import * as React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { CommomComponentProps } from 'models/component';
import { stringify } from 'qs';
import { IEmployees } from 'models/workbench';
import { update } from 'modules/workbench';
import { push, RouterAction } from 'react-router-redux';
import { Table, Row, Col, Button, notification } from 'antd';
import { getSpecVal } from 'helper/selectAndRadio';
import style from '../../index.less';
interface EmployeesProps extends CommomComponentProps<EmployeesProps> {
  push?: Redux.ActionCreator<RouterAction>;
};

interface EmployeesState {
  list: IEmployees[];
  loading: boolean;
  total: number;
};
class Employees extends React.Component<EmployeesProps, EmployeesState> {
  public constructor(props) {
    super(props);
    this.state = { list: [], loading: true, total: 10 };
  }
  private currentPage: number;
  private pageSize: number;
  private fkBizid: string;
  public componentWillMount() {
    this.fkBizid = this.props.dropdownData.user.organization;
    this.currentPage = 1;
    this.pageSize = 10;
    this.fetchSource();
  }
  private changePage = (page, pageSize) => {
    this.currentPage = page;
    this.pageSize = pageSize;
    this.fetchSource();
  }
  private fetchSource() {
    fch(`/v1/canteen/person/list?${stringify({
      fkBizid: this.fkBizid,
      type: 0,
      page: this.currentPage,
      size: this.pageSize
    })}`)
      .then(res => {
        this.setState({ list: res.content, loading: false, total: Number(res.totalElements) });
      });
  }
  private delSingle(bizid) {
    fch(`/v1/canteen/person/${bizid}`, {
      method: 'DELETE'
    }).then(res => {
      if (res.status === '200') {
        this.fetchSource();
        notification.success({
          message: '删除成功！',
          description: res.message,
        });
      } else {
        notification.error({
          message: '删除失败！',
          description: res.message,
        });
      }
    });
  }
  public render(): JSX.Element {
    const columns = [{
      title: '序号',
      dataIndex: '',
      render: (text, record, index) => {
        return index + (this.currentPage - 1) * this.pageSize;
      }
    }, {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '性别',
      dataIndex: 'sex',
      render: text => getSpecVal(this.props.workbench.sexes, text)
    }, {
      title: '职务',
      dataIndex: 'job',
      render: text => getSpecVal(this.props.workbench.workerTypes, text)
    }, {
      title: '状态',
      dataIndex: 'status',
      render: text => getSpecVal(this.props.workbench.workerStatus, text)
    }, {
      title: '从业时间',
      dataIndex: 'qcBeginTime',
      render: text => moment(new Date(Number(text))).format('YYYY-MM-DD')
    }, {
      title: '健康证有效期',
      dataIndex: 'hcValidityTime',
      render: text => moment(new Date(Number(text))).format('YYYY-MM-DD')
    }, {
      title: '操作',
      dataIndex: 'bizid',
      render: (text, record) => {
        return (
          <div>
            <a href="javascript:;" onClick={() => { this.props.push(this.props.location.pathname + '/add/' + text); }}>编辑</a>
            <a href="javascript:;" style={{ marginLeft: '15px' }} onClick={() => { this.delSingle(text); }}>删除</a>
          </div >);
      }
    }];
    return (
      <div>
        <Row type="flex" justify="end" style={{ marginBottom: '10px' }}>
          <Col span={1}>
            <Button onClick={() => { this.props.push(this.props.location.pathname + '/add'); }} type={'primary'}>添加</Button>
          </Col>
        </Row>
        <Table
          className={style.Table}
          dataSource={this.state.list}
          columns={columns}
          pagination={{
            size: 'small',
            pageSize: this.pageSize,
            current: this.currentPage,
            total: this.state.total,
            onChange: this.changePage
          }}
          rowKey={record => (record as any).bizid}
          loading={this.state.loading}
          bordered />
      </div>);
  }
}

export default connect<any, any, EmployeesProps>(
  state => ({ workbench: state.workbench, dropdownData: state.dropdownData }),
  dispatch => ({
    update: data => { dispatch(update(data)); return Promise.resolve(); },
    push: location => { dispatch(push(location)); },
  }))(Employees);
