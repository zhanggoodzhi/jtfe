import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Tabs, } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import fetch from 'helper/fetch';
import style from './style.less';
interface RectificationSelfProps extends CommomComponentProps<RectificationSelfProps> {
};

interface RectificationSelfState {

};

class RectificationSelf extends React.Component<RectificationSelfProps, RectificationSelfState> {
  public constructor(props) {
    super(props);
  }
  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }
  public render(): JSX.Element {
    const TabPane = Tabs.TabPane;
    const columns = [{
      title: '记录生成日期',
      dataIndex: 'createTime',
      sorter: (a, b) => this.sortTime(a.createTime, b.createTime),
    }, {
      title: '整改状态',
      dataIndex: 'status',
    }, {
      title: '检查人',
      dataIndex: 'auditor',
    }, {
      title: '检查日期',
      dataIndex: 'auditTime',
      sorter: (a, b) => this.sortTime(a.auditTime, b.auditTime),
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        if (record.status === '已整改') {
          return <Link to={this.props.location.pathname + '/detail/' + text}>查看</Link>;
        }
        return <Link to={this.props.location.pathname + '/update/' + text}>整改</Link>;
      }
    }];
    const data = [{
      id: '1',
      createTime: '2017-06-20',
      status: '已整改',
      auditor: '张三',
      auditTime: '2017-07-20',
    },
    {
      id: '2',
      createTime: '2017-05-20',
      status: '已整改',
      auditor: '李四',
      auditTime: '2017-08-20',
    },
    {
      id: '3',
      createTime: '2017-02-20',
      status: '未整改',
      auditor: '王五',
      auditTime: '2017-01-20',
    }];
    return (
      <div className={style.Detail}>
        
        <Tabs onChange={() => { }}>
          <TabPane tab="自查整改" key="1">Content of Tab Pane 1</TabPane>
          <TabPane tab="整改通知" key="2">Content of Tab Pane 2</TabPane>
        </Tabs>
        <Table className={style.Table} rowKey="id" columns={columns} dataSource={data} />
      </div >
    );
  }
}

export default connect<any, any, RectificationSelfProps>(
  null, null
)(RectificationSelf) as any;
