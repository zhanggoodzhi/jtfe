import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import { push, RouterAction } from 'react-router-redux';
import { CommomComponentProps } from 'models/component';
import { IStaylikeItem } from 'models/workbench';
import { getSpecVal } from 'helper/selectAndRadio';
import style from '../index.less';

interface StaylikeProps extends CommomComponentProps<StaylikeProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface StaykikeState {
  list: IStaylikeItem[];
  loading: boolean;
  total: number;
};

class Staykike extends React.Component<StaylikeProps, StaykikeState> {
  private page;
  private pageSize = 10;
  private dateRange;
  public componentWillMount() {
    const dateRange = [moment().subtract(10, 'year').format('YYYY-MM-DD'), moment().add(30, 'year').format('YYYY-MM-DD')];
    this.dateRange = dateRange;
    this.page = 1;
    this.fetchByData();
  }
  private changePage = (current, size) => {
    this.page = current;
    this.fetchByData();
  }
  private changeDates = (dates, datesString) => {
    this.dateRange = datesString;
    this.fetchByData();
  }
  private fetchByData() {
    this.setState({ list: [], loading: true, total: 0 });
    fch(`/v1/retention/find`,
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
  private handleAdd = () => {
    this.props.push(this.props.match.path + 'add');
  }
  private handleSelect = (record, index, event) => {
    this.props.push(this.props.match.path + 'detail/' + record.bizid);
  }
  public render(): JSX.Element {
    const columns = [
      {
        title: '照片', dataIndex: 'photo', render: (text, record, index) => {
          return <div style={{ backgroundImage: `url(${text})` }} className={style.TablePhoto} />;
        }
      },
      { title: '餐次', dataIndex: 'mealtime', render: (text, record, index) => getSpecVal(this.props.workbench.mealTimes, text) },
      { title: '食品名称', dataIndex: 'name' },
      { title: '留样量', dataIndex: 'number', render: (text, record, index) => text + 'g' },
      { title: '留样时间', dataIndex: 'time' },
      { title: '留样人员', dataIndex: 'personnel' },
      { title: '审核人员', dataIndex: 'auditors' },
      { title: '日期', dataIndex: 'tsp' },

    ];
    const { RangePicker } = DatePicker;
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
            <Button htmlType="button" className={style.ExportBtn} type="primary"><a href={`/v1/retention/export?beginTime=${this.dateRange[0]}&endTime=${this.dateRange[1]}`} target="_blank">导出至excel</a></Button>
          </Col>
          <Col lg={{ span: 3 }} md={{ span: 3 }} xs={{ span: 24 }} >
            <Button onClick={this.handleAdd} type="primary">添加记录</Button>
          </Col>
        </Row>
        <Table
          dataSource={this.state.list}
          columns={columns}
          rowKey={record => (record as any).bizid}
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

export default connect<any, any, StaylikeProps>(
  (state) => ({
    workbench: state.workbench
  }),
  dispatch => ({
    push: location => { dispatch(push(location)); }
  })
)(Staykike);
