import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import { push, RouterAction } from 'react-router-redux';
import { CommomComponentProps } from 'models/component';
import { IWorkbench } from 'models/workbench';
import { update } from 'modules/workbench';
import { getSpecVal, getRemoteSpecVal } from 'helper/selectAndRadio';
import style from '../index.less';

interface AirRecordProps extends CommomComponentProps<AirRecordProps> {
  workbench?: IWorkbench;
  update?(data: IWorkbench): Promise<any>;
  push?: Redux.ActionCreator<RouterAction>;
};

interface WasteRecordState { };

class WasteRecord extends React.Component<AirRecordProps, WasteRecordState> {
  private page;
  private pageSize = 10;
  private dateRange;
  private matters;
  private modes;
  public componentWillMount() {
    this.matters = this.props.workbench.tablewareMatters;
    this.modes = this.props.workbench.tablewareModes;
    const dateRange = [moment().subtract(10, 'year').format('YYYY-MM-DD'), moment().add(30, 'year').format('YYYY-MM-DD')];
    this.dateRange = dateRange;
    this.page = 1;
    this.fetchByData();
  }

  private changeDates = (dates, datesString) => {
    this.dateRange = datesString;
    this.fetchByData();
  }
  private fetchByData() {
    const { tablewares } = this.props.workbench;
    const newTablewares = { ...tablewares };
    newTablewares.loading = true;
    this.props.update({ tablewares: newTablewares });
    fch('/v1/tablewarev/find',
      {
        method: 'POST',
        body: {
          beginTime: this.dateRange[0],
          endTime: this.dateRange[1],
          page: this.page,
          pageSize: this.pageSize
        }
      }
    ).then(res => {
      const { tablewares } = this.props.workbench;
      const newTablewares = { ...tablewares };
      newTablewares.list = [...res.content];
      newTablewares.loading = false;
      if (Number(tablewares.total) !== Number(res.numberOfElements)) {
        newTablewares.total = Number(res.numberOfElements);
      }
      this.props.update({ tablewares: newTablewares });
    });
  }
  private changePage = (current, size) => {
    this.page = current;
    this.fetchByData();
  }
  private handleAdd = () => {
    this.props.push(this.props.match.path + 'add');
  }
  private handleSelect = (record, index, event) => {
    this.props.push(this.props.match.path + 'detail/' + record.bizid);
  }

  public render(): JSX.Element {
    const { RangePicker } = DatePicker;
    const { tablewares } = this.props.workbench;
    const columns = [
      { title: '消毒对象', dataIndex: 'matter', render: (text, record, index) => getSpecVal(this.matters, text) },
      { title: '消毒方法', dataIndex: 'mode', render: (text, record, index) => getSpecVal(this.modes, text) },
      { title: '操作人', dataIndex: 'operator', render: (text, record, index) => getRemoteSpecVal(this.props.dropdownData.canteenPersonVoList, text) },
      { title: '消毒时间', dataIndex: 'time' },
      { title: '日期', dataIndex: 'tsp' }
    ];
    return (
      <div className={style.Detail}>
        <Row>
          <Col lg={{ span: 8 }} md={{ span: 10 }} xs={{ span: 10 }} >
            <RangePicker
              defaultValue={[moment().subtract(10, 'year'), moment().add(30, 'year')]}
              ranges={{ '全部': [moment().subtract(10, 'year'), moment().add(30, 'year')], '最近7天': [moment().subtract(7, 'days'), moment()], '最近30天': [moment().subtract(1, 'month'), moment()] }}
              onChange={this.changeDates}
            />
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 24 }} >
            <Button htmlType="button" className={style.ExportBtn} type="primary"><a href={`/v1/tablewarev/export?beginTime=${this.dateRange[0]}&endTime=${this.dateRange[1]}`} target="_blank">导出至excel</a></Button>
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 24 }} >
            <Button onClick={this.handleAdd} type="primary">添加记录</Button>
          </Col>
        </Row>
        <Table
          dataSource={tablewares.list}
          columns={columns}
          rowKey={record => (record as any).bizid}
          className={style.Table}
          bordered
          onRowClick={this.handleSelect}
          loading={tablewares.loading}
          pagination={{
            size: 'small',
            pageSize: this.pageSize,
            current: this.page,
            total: tablewares.total,
            onChange: this.changePage
          }} />
      </div>
    );
  }
}

export default connect<any, any, AirRecordProps>(
  state => ({ workbench: state.workbench, dropdownData: state.dropdownData }),
  dispatch => ({
    update: data => { dispatch(update(data)); return Promise.resolve(); },
    push: location => { dispatch(push(location)); }
  })
)(WasteRecord);
