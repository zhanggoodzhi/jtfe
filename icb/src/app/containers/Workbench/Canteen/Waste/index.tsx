import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Row, Col, DatePicker } from 'antd';
import { push, RouterAction } from 'react-router-redux';
import { CommomComponentProps } from 'models/component';
import { IWasteItem } from 'models/workbench';
import moment from 'moment';
import style from '../index.less';

interface WasteRecordProps extends CommomComponentProps<WasteRecordProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface WasteRecordState {
  list: IWasteItem[];
  loading: boolean;
  total: number;
};

class WasteRecord extends React.Component<WasteRecordProps, WasteRecordState> {
  private page;
  private pageSize = 10;
  private dateRange;
  public componentWillMount() {
    const dateRange = [moment().subtract(10, 'year').format('YYYY-MM-DD'), moment().add(30, 'year').format('YYYY-MM-DD')];
    this.dateRange = dateRange;
    this.page = 1;
    this.fetchByData();
  }
  private handleAdd = () => {
    this.props.push(this.props.match.path + 'add');
  }
  private handleSelect = (record, index, event) => {
    this.props.push(this.props.match.path + 'detail/' + record.bizid);
  }
  private changeDates = (dates, datesString) => {
    this.dateRange = datesString;
    this.fetchByData();
  }
  private fetchByData() {
    this.setState({ list: [], loading: true, total: 0 });
    fch(`/v1/waste/find`,
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
      this.setState({ list: res.content, loading: false, total: Number(res.numberOfElements) });
    });
  }
  private changePage = (current, size) => {
    this.page = current;
    this.fetchByData();
  }
  public render(): JSX.Element {
    const { RangePicker } = DatePicker;
    const columns = [
      { title: '种类', dataIndex: 'type' },
      { title: '数量(Kg)', dataIndex: 'number' },
      { title: '收运人', dataIndex: 'people' },
      { title: '用途', dataIndex: 'purpose' },
      { title: '单位经手人', dataIndex: 'companyperson' },
      { title: '日期', dataIndex: 'tsp' }
    ];
    return (
      <div className={style.Detail}>
        <Row >
          <Col lg={{ span: 13 }} md={{ span: 13 }} xs={{ span: 24 }} >
            <RangePicker
              defaultValue={[moment().subtract(10, 'year'), moment().add(30, 'year')]}
              ranges={{ '全部': [moment().subtract(10, 'year'), moment().add(30, 'year')], '最近7天': [moment().subtract(7, 'days'), moment()], '最近30天': [moment().subtract(1, 'month'), moment()] }}
              onChange={this.changeDates}
            />
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 24 }} >
            <Button htmlType="button" className={style.ExportBtn} type="primary"><a href={`/v1/waste/export?beginTime=${this.dateRange[0]}&endTime=${this.dateRange[1]}`} target="_blank">导出至excel</a></Button>
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 24 }} >
            <Button onClick={this.handleAdd} type="primary">添加记录</Button>
          </Col>
        </Row>
        <Table
          rowKey={record => (record as any).bizid}
          dataSource={this.state.list}
          columns={columns}
          className={style.Table}
          bordered
          onRowClick={this.handleSelect}
          loading={this.state.loading}
          pagination={{
            size: 'small',
            pageSize: this.pageSize,
            current: this.page,
            total: this.state.total,
            onChange: this.changePage
          }} />
      </div>
    );
  }
}

export default connect<any, any, WasteRecordProps>(
  state => ({ workbench: state.workbench, dropdownData: state.dropdownData }),
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(WasteRecord);
