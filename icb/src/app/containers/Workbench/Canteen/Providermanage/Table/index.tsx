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
      title: '序号',
      dataIndex: 'target',
    }, {
      title: '名称',
      dataIndex: 'note',
    }, {
      title: '采购单位',
      dataIndex: 'status',
    }, {
      title: '许可证号、营业执照或摊位号',
      dataIndex: 'noteTime',
    }, {
      title: '联系人',
      dataIndex: 'updateTime',
    }, {
      title: '联系电话',
      dataIndex: 'telephone',
    }, {
      title: '是否供应中',
      dataIndex: 'ifSell',
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <div>
            <Link className={style.Button} to={'/home/workbench/providermanage/update/' + text}>编辑</Link>
            <Link className={style.Button} to={'/home/workbench/providermanage/detail/' + text}>查看</Link>
            <a className={style.Button}>删除</a>
          </div>
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
        <Link to={'/home/workbench/providermanage/add'}>
          <Button className={style.Add} type="primary">添加供应商</Button>
        </Link>
        <h3 className={style.BigTitle}>食品、食品添加剂及食品相关产品供应商信息一览表</h3>
        <Table className={style.Table} rowKey="id" columns={columns} dataSource={data} />
      </div >
    );
  }
}

export default connect<any, any, TableComponentProps>(
  null, null
)(TableComponent) as any;
