import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Select } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import style from './style.less';
interface MemberManageProviderProps extends CommomComponentProps<MemberManageProviderProps> {

};

interface MemberManageProviderState {

};

class MemberManageProvider extends React.Component<MemberManageProviderProps, MemberManageProviderState> {

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
      title: '社会信用代码（身份证号码）',
      dataIndex: 'auditor',
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
        <Link to={'/home/workbench/membermanage/provider/add'}>
          <Button className={style.Add} type="primary">添加成员</Button>
        </Link>
        <Button className={style.Import} type="primary">批量导入</Button>
        <Table className={style.Table} rowKey="id" columns={columns} dataSource={data} />
      </div >
    );
  }
}
export default connect<any, any, MemberManageProviderProps>(
  null, null
)(MemberManageProvider) as any;
