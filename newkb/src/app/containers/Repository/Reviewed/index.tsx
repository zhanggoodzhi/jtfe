import * as React from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { connect } from 'react-redux';
import { Form, Button, Input, DatePicker, Table, Icon, message } from 'antd';
import moment from 'moment';
import axios from 'helper/axios';
interface ReviewedProps { };

interface ReviewedState {
  keyword?: string;
  timeRange?;
  page?;
  dataSource?;
  total?;
  currentPage?;
};

class Reviewed extends React.Component<ReviewedProps & FormComponentProps, ReviewedState> {
  private size = 20;
  public constructor(props) {
    super(props);
    this.state = { keyword: '', timeRange: [], page: 1 };
  }
  public componentWillMount() {
    this.axiosReviewed();
  }
  private axiosReviewed(current?) {
    let cpage;
    const { keyword, timeRange, page } = this.state;
    current ? cpage = current : cpage = page;
    axios.get('/api/repository/list', {
      params: {
        templateId: null,
        keyword,
        status: '3,4',
        startDay: timeRange[0],
        endDay: timeRange[1],
        page: cpage,
        size: this.size
      }
    }).then(res => {
      const { status, data } = res;
      if ((status as any) === 200) {
        this.setState({ dataSource: [...data.data], total: Number(data.total) });
      } else {
        message.error(res.statusText);
      }
    });
  }
  private renderStatus = (status) => {
    switch (status) {
      case 0:
        return '<span style="color:#272727;">未创建</span>';
      case 1:
        return '<span style="color:#a0a0a0;">草稿</span>';
      case 2:
        return '<span style="color:#dd5501;">审核中</span>';
      case 3:
        return '<span style="color:#73a93a;">已发布</span>';
      case 4:
        return '<span style="color:#c51f29;">被驳回</span>';
      case 5:
        return '<span style="color:#1f9ce5;">已归档</span>';
      default:
        return '未知状态';
    }
  }
  private renderTime = (time) => {
    moment.locale('zh-cn');
    return time ? moment(time).fromNow() : null;
  }
  public render(): JSX.Element {
    const { dataSource, total, currentPage } = this.state;
    const { getFieldDecorator } = this.props.form;
    const RangePicker = DatePicker.RangePicker;
    const FormItem = Form.Item;
    const columns = [{
      title: 'ID',
      dataIndex: 'knowledgeId'
    }, {
      title: '名称',
      dataIndex: 'knowledgeName'
    }, {
      title: '作者',
      dataIndex: 'author'
    }, {
      title: '状态',
      dataIndex: 'status',
      render: this.renderStatus
    }, {
      title: '更新时间',
      dataIndex: 'updateAt',
      render: this.renderTime
    }, {
      title: '操作',
      dataIndex: '',
      render: () => <Icon type="search" title="查看详情" />
    }];
    return (
      <div>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('keyword')(
              <Input type="text" placeholder="关键字" onChange={v => { this.setState({ keyword: v.target.value }); }} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('range')(
              <RangePicker placeholder={['审核时间', '审核时间']} onChange={(date, dateStr) => { this.setState({ timeRange: dateStr }); }} />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => this.axiosReviewed()}>查询</Button>
          </FormItem>
        </Form>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={record => (record as any).knowledgeId}
          pagination={{
            total,
            current: currentPage,
            pageSize: this.size,
            onChange: current => {
              this.axiosReviewed(current);
            }
          }} />
      </div >
    );
  }
}

export default connect(
  (state) => ({
    // Map state to props
  }),
  {
    // Map dispatch to props
  })(Form.create()(Reviewed));
