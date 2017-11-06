import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Select, Badge } from 'antd';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import style from './style.less';
interface RectificationNoticeProps extends CommomComponentProps<RectificationNoticeProps> {
};

interface RectificationNoticeState {

};

class RectificationNotice extends React.Component<RectificationNoticeProps, RectificationNoticeState> {
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
      title: '通知内容',
      dataIndex: 'note',
      render: (text, record) => {
        const badge = record.ifCheck ? <Badge status="error" /> : <i className={style.None} />;
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
      title: '通知时间',
      dataIndex: 'noteTime',
      sorter: (a, b) => this.sortTime(a.noteTime, b.noteTime),
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      sorter: (a, b) => this.sortTime(a.updateTime, b.updateTime),
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        return record.status === '已办结' ?
          <Link to={this.props.location.pathname + '/detail/' + text}>查看详情</Link>
          :
          <Link to={this.props.location.pathname + '/update/' + text}>查看详情</Link>
          ;
      }
    }];
    const data = [{
      ifCheck: false,
      id: '1',
      noteTime: '2017-06-20',
      updateTime: '2017-06-20',
      status: '已办结',
      note: '张三个十个三四个g',
    },
    {
      ifCheck: true,
      id: '2',
      noteTime: '2017-05-20',
      updateTime: '2017-03-20',
      status: '已办结',
      note: '李四34223423',
    },
    {
      ifCheck: false,
      id: '3',
      noteTime: '2017-02-20',
      updateTime: '2017-04-20',
      status: '未办结',
      note: '王五更多搜索大公告撒旦撒旦',
    }];
    return (
      <div className={style.Content}>
        <div>
          <label>状态：</label>
          <Select style={{ width: 120 }} onChange={this.selectChange}>
            <Option value="0">全部</Option>
            <Option value="1">已办结</Option>
            <Option value="2">未办结</Option>
          </Select>
          <Button className={style.Button} type="primary">查询</Button>
        </div>
        <Table className={style.Table} rowKey="id" columns={columns} dataSource={data} />
      </div >
    );
  }
}

export default connect<any, any, RectificationNoticeProps>(
  null, null
)(RectificationNotice) as any;
