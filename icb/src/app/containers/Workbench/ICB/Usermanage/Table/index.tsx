import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import style from './style.less';
interface TableComponentProps extends CommomComponentProps<TableComponentProps> {
};

interface TableComponentState {

};

class TableComponent extends React.Component<TableComponentProps, TableComponentState> {
  public constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    const columns = [{
      title: '用户名',
      dataIndex: 'target',
    }, {
      title: '联系方式',
      dataIndex: 'note',
    }, {
      title: '归属地',
      dataIndex: 'status',
    }, {
      title: '用户类别',
      dataIndex: 'noteTime',
    }, {
      title: '评论次数',
      dataIndex: 'updateTime',
    }, {
      title: '注册时间',
      dataIndex: 'telephone',
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <Link className={style.Button} to={'/home/workbench/usermanage/detail/' + text}>查看评论</Link>
        );
        ;
      }
    }];
    const data = [{
      target: 'xxx中学',
      id: '1',
      noteTime: '2017-06-20',
      updateTime: '2017-06-20',
      status: '已办结',
      note: '张三个十个三四个g',
      telephone: '34242342342',
      ifSell: 'true'
    },
    {
      target: 'xxx中学',
      id: '2',
      noteTime: '2017-05-20',
      updateTime: '2017-03-20',
      status: '已办结',
      note: '李四34223423',
      telephone: '34242342342',
      ifSell: 'true'
    },
    {
      target: 'xxx中学',
      id: '3',
      noteTime: '2017-02-20',
      updateTime: '2017-04-20',
      status: '未办结',
      note: '王五更多搜索大公告撒旦撒旦',
      telephone: '34242342342',
      ifSell: 'true'
    }];
    console.log(this.props);
    return (
      <div className={style.Content}>
        <Table className={style.Table} rowKey="id" columns={columns} dataSource={data} />
      </div >
    );
  }
}

export default connect<any, any, TableComponentProps>(
  null, null
)(TableComponent) as any;
