import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Select } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import style from './style.less';
interface MemberManageCanteenProps extends CommomComponentProps<MemberManageCanteenProps> {

};

interface MemberManageCanteenState {

};

class MemberManageCanteen extends React.Component<MemberManageCanteenProps, MemberManageCanteenState> {

  public constructor(props) {
    super(props);
  }
  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }
  private selectChange = () => {

  }
  public render(): JSX.Element {
    const Option = Select.Option;
    const columns = [{
      title: '序号',
      dataIndex: 'createTime'
    }, {
      title: '经营者名称',
      dataIndex: 'status',
    }, {
      title: '主体业态备注',
      dataIndex: 'auditor',
    }, {
      title: '单位性质',
      dataIndex: 'auditTime',
    }, {
      title: '法定代表人（负责人）',
    }, {
      title: '日常监督管理机构',
    }, {
      title: '更新时间',
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <div>
            <Link className={style.Mf} to={this.props.location.pathname + '/update/' + text}>编辑</Link>
            <Link className={style.Mf} to={this.props.location.pathname + '/detail/' + text}>查看评论</Link>
            <a className={style.Mf}>删除</a>
          </div>
        );
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
      <div className={style.Content}>
        <Link to={'/home/workbench/membermanage/canteen/add'}>
          <Button className={style.Add} type="primary">添加成员</Button>
        </Link>
        <Button className={style.Import} type="primary">批量导入</Button>
        <div>
          <label>所属分局：</label>
          <Select style={{ width: 120 }} onChange={this.selectChange}>
            <Option value="0">全部</Option>
            <Option value="1">高新区分局</Option>
            <Option value="2">城北分局</Option>
          </Select>
          <label className={style.Mf}>主题业态备注：</label>
          <Select style={{ width: 120 }} onChange={this.selectChange}>
            <Option value="0">全部</Option>
            <Option value="1">高新区分局</Option>
            <Option value="2">城北分局</Option>
          </Select>
          <Button className={style.Mf} type="primary">查询</Button>
        </div>
        <Table className={style.Table} rowKey="id" columns={columns} dataSource={data} />
      </div >
    );
  }
}
export default connect<any, any, MemberManageCanteenProps>(
  null, null
)(MemberManageCanteen) as any;
