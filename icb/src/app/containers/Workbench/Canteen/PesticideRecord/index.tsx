import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import { push, RouterAction } from 'react-router-redux';
import { CommomComponentProps } from 'models/component';
import { IWorkbench } from 'models/workbench';
import { update } from 'modules/workbench';
import style from '../index.less';

interface PesticdeRecordProps extends CommomComponentProps<PesticdeRecordProps> {
  workbench?: IWorkbench;
  update?(data: IWorkbench): Promise<any>;
  push?: Redux.ActionCreator<RouterAction>;
};

interface PesticdeRecordState { };

class PesticdeRecord extends React.Component<PesticdeRecordProps, PesticdeRecordState> {
  private page;
  private pageSize = 10;
  private dateRange;
  public componentWillMount() {
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
    const { pesticides } = this.props.workbench;
    const newPesticides = { ...pesticides };
    newPesticides.loading = true;
    this.props.update({ pesticides: newPesticides });
    fch('/v1/insecticide/find',
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
      const { pesticides } = this.props.workbench;
      const newPesticides = { ...pesticides };
      newPesticides.list = [...res.content];
      newPesticides.loading = false;
      if (Number(pesticides.total) !== Number(res.numberOfElements)) {
        newPesticides.total = Number(res.numberOfElements);
      }
      this.props.update({ pesticides: newPesticides });
    });
  }
  private handleAdd = () => {
    this.props.push(this.props.match.path + 'add');
  }
  private handleSelect = (record, index, event) => {
    this.props.push(this.props.match.path + 'detail/' + record.bizid);
  }
  private changePage = (current, size) => {
    this.page = current;
    this.fetchByData();
  }
  public render(): JSX.Element {
    const { RangePicker } = DatePicker;
    const columns = [
      { title: '名称', dataIndex: 'name' },
      { title: '使用数量', dataIndex: 'number' },
      { title: '使用位置', dataIndex: 'position' },
      { title: '使用人', dataIndex: 'user' },
      { title: '效果', dataIndex: 'effect' },
      { title: '日期', dataIndex: 'tsp' }
    ];
    const { pesticides } = this.props.workbench;
    return (
      <div className={style.Detail}>
        <Row>
          <Col lg={{ span: 13 }} md={{ span: 13 }} xs={{ span: 24 }} >
            <RangePicker
              defaultValue={[moment().subtract(10, 'year'), moment().add(30, 'year')]}
              ranges={{ '全部': [moment().subtract(10, 'year'), moment().add(30, 'year')], '最近7天': [moment().subtract(7, 'days'), moment()], '最近30天': [moment().subtract(1, 'month'), moment()] }}
              onChange={this.changeDates}
            />
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 24 }} >
            <Button htmlType="button" className={style.ExportBtn} type="primary"><a href={`/v1/insecticide/export?beginTime=${this.dateRange[0]}&endTime=${this.dateRange[1]}`} target="_blank">导出至excel</a></Button>
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 24 }} >
            <Button onClick={this.handleAdd} type="primary">添加记录</Button>
          </Col>
        </Row>
        <Table
          dataSource={pesticides.list}
          columns={columns}
          rowKey={record => (record as any).bizid}
          className={style.Table}
          bordered
          onRowClick={this.handleSelect}
          loading={pesticides.loading}
          pagination={{
            size: 'small',
            pageSize: this.pageSize,
            current: this.page,
            total: pesticides.total,
            onChange: this.changePage
          }} />
      </div>
    );
  }
}

export default connect<any, any, PesticdeRecordProps>(
  state => ({ workbench: state.workbench }),
  dispatch => ({
    update: data => { dispatch(update(data)); return Promise.resolve(); },
    push: location => { dispatch(push(location)); }
  })
)(PesticdeRecord);
