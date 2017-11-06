import * as React from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { connect } from 'react-redux';
import { Form, Button, Input, DatePicker, Table, Icon, message, Select } from 'antd';
import moment from 'moment';
import axios from 'helper/axios';
import { IConfiguration } from 'configuration';
interface FieldProps {
  configuration?: IConfiguration;
};

interface FieldState {
  keyword?: string;
  templateId?;
  timeRange?;
  page?;
  dataSource?;
  total?;
  currentPage?;
};

class Field extends React.Component<FieldProps & FormComponentProps, FieldState> {
  private size = 20;
  public constructor(props) {
    super(props);
    this.state = { keyword: '', templateId: '', timeRange: [], page: 1 };
  }
  public componentWillMount() {
    this.axiosField();
  }
  private axiosField(current?) {
    let cpage;
    const { keyword, templateId, timeRange, page } = this.state;
    current ? cpage = current : cpage = page;
    axios.get('/api/repository/list', {
      params: {
        templateId,
        keyword,
        status: 5,
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
  private renderTime = (time) => {
    moment.locale('zh-cn');
    return time ? moment(time).fromNow() : null;
  }
  public render(): JSX.Element {
    const { templates } = this.props.configuration;
    const { dataSource, total, currentPage } = this.state;
    const { getFieldDecorator } = this.props.form;
    const RangePicker = DatePicker.RangePicker;
    const FormItem = Form.Item;
    const Option = Select.Option;
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
      title: '归档时间',
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
            {
              getFieldDecorator('templateId')(
                <Select placeholder="请选择模板" style={{ width: 200 }} onChange={(value) => { this.setState({ templateId: value }); }}>
                  {
                    templates.map(v => {
                      return <Option value={v.id} key={v.id}>{v.name}</Option>;
                    })
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem>
            {getFieldDecorator('range')(
              <RangePicker placeholder={['归档时间', '归档时间']} onChange={(date, dateStr) => { this.setState({ timeRange: dateStr }); }} />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => this.axiosField()}>查询</Button>
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
              this.axiosField(current);
            }
          }} />
      </div >
    );
  }
}

export default connect<any, any, any>(
  (state) => ({
    configuration: state.configuration
  }),
  {
    // Map dispatch to props
  })(Form.create()(Field));
