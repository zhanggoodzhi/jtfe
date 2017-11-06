import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Select, Badge } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
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
  private selectChange = () => {

  }
  public render(): JSX.Element {
    const Option = Select.Option;
    const columns = [{
      title: '记录生成日期',
      dataIndex: 'createTime',
      sorter: (a, b) => this.sortTime(a.createTime, b.createTime),
      render: (text, record) => {
        const badge = record.status === '未整改' ? <Badge status="error" /> : <i className={style.None} />;
        return (
          <div>
            {badge}
            <span className={style.RedDotItem}>{text}</span>
          </div>
        );
      }
    }, {
      title: '状态',
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
          return <Link to={this.props.location.pathname + '/detail/' + text}>查看详情</Link>;
        }
        return <Link to={this.props.location.pathname + '/update/' + text}>立即整改</Link>;
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
        <div>
          <label>状态：</label>
          <Select style={{ width: 120 }} onChange={this.selectChange}>
            <Option value="0">全部</Option>
            <Option value="1">已整改</Option>
            <Option value="2">未整改</Option>
          </Select>
          <Button className={style.Button} type="primary">查询</Button>
        </div>
        <Table className={style.Table} rowKey="id" columns={columns} dataSource={data} />
      </div >
    );
  }
}
export default connect<any, any, RectificationSelfProps>(
  null, null
)(RectificationSelf) as any;
