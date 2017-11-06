import * as React from 'react';
import { connect } from 'react-redux';
import { message, Button, Table, Select, Badge } from 'antd';
import { stringify } from 'qs';
import { CommomComponentProps } from 'models/component';
import { Link } from 'react-router-dom';
import style from './style.less';
interface CustomnotificationTableProps extends CommomComponentProps<CustomnotificationTableProps> {
};

interface CustomnotificationTableState {
  listData: any;
  sendData: any;
  loading: boolean;
  total: number;
};
const defaultSize = 10;
const defaultSendData = {
  status: null,
  page: 1,
  size: defaultSize,
};
class CustomnotificationTable extends React.Component<CustomnotificationTableProps, CustomnotificationTableState> {
  public constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sendData: defaultSendData,
      listData: [],
      total: 0,
    };
  }
  sortTime(a, b) {
    return new Date(a) < new Date(b) ? -1 : 1;
  }
  private selectChange = () => {

  }
  componentWillMount() {
    this.fetchData();
  }
  private fetchData = (g?) => {
    const { status, page, size } = this.state.sendData;
    this.setState({
      loading: true
    });

    fch(`/v1/rectification/list?${stringify({
      page,
      size,
      status
    })}`).then((res: any) => {
      console.log(res);
      this.setState({
        listData: res.content,
        total: res.totalElements,
        loading: false
      });
    });
  }
  public render(): JSX.Element {
    const Option = Select.Option;
    const columns = [{
      title: '通知对象',
      dataIndex: 'target',
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
      title: '通知内容',
      dataIndex: 'note',
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
          <Link to={'/home/workbench/customnotification/detail/' + text}>查看详情</Link>
          :
          <Link to={'/home/workbench/customnotification/update/' + text}>查看详情</Link>
          ;
      }
    }];
    const data = [{
      ifCheck: false,
      target: 'xxx中学',
      id: '1',
      noteTime: '2017-06-20',
      updateTime: '2017-06-20',
      status: '已办结',
      note: '张三个十个三四个g',
    },
    {
      ifCheck: true,
      target: 'xxx中学',
      id: '2',
      noteTime: '2017-05-20',
      updateTime: '2017-03-20',
      status: '已办结',
      note: '李四34223423',
    },
    {
      ifCheck: false,
      target: 'xxx中学',
      id: '3',
      noteTime: '2017-02-20',
      updateTime: '2017-04-20',
      status: '未办结',
      note: '王五更多搜索大公告撒旦撒旦',
    }];
    console.log(this.props);
    return (
      <div className={style.Content}>
        <div>
          <Link to={'/home/workbench/customnotification/add'}>
            <Button className={style.Add} type="primary">新增通知</Button>
          </Link>
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

export default connect<any, any, CustomnotificationTableProps>(
  null, null
)(CustomnotificationTable) as any;
