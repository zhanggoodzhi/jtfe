import * as React from "react";
import { Table, Button, Row, Col, DatePicker, Form, Icon, Input, Select, Badge } from 'antd';
import * as request from "superagent";
import moment from "moment";
import "./recharge.less";
const table_charge_columns = [
  {
    title: '订单ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
  }, {
    title: '昵称',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: '充值方式',
    dataIndex: 'goods',
    key: 'goods',
  }, {
    title: '充值金额（元）',
    dataIndex: 'price',
    key: 'price',
    sorter: (a, b) => a.price - b.price
  }, {
    title: '充值TA币',
    dataIndex: 'amount',
    key: 'amount',
    sorter: (a, b) => a.amount - b.amount
  }, {
    title: '钱包余额',
    dataIndex: 'quantity',
    key: 'quantity',
    sorter: (a, b) => a.quantity - b.quantity
  }, {
    title: '充值时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: (a, b) => a.createtime - b.createtime
  }, {
    title: '支付状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let returnStr = '';
      switch (status) {
        case 1:
          returnStr = <Badge status="success" text='支付成功' />;
          break;
        case 0:
          returnStr = <Badge status="error" text='支付失败' />;
          break;
        default:
          returnStr = <Badge status="default" text='全部' />;
          break;
      }
      return returnStr;
    }
  }];
class Recharge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recharge_data: [],
      formData: { keyword: '', status: '', startDay: '', endDay: '' },
      tloading: false,
      total: 0,
      pageSize: 10
    };
  }
  componentWillMount() {
    this.fetchRecharge();
  }
  /**
   * 获取订单数据源
   */
  fetchRecharge(pagination) {
    this.setState({ tloading: true });
    const sendData = Object.assign({
      page: 1,
      rows: 10,
      order: "desc",
      sort: "id"
    }, this.state.formData);

    if (pagination && pagination.current) {
      sendData.page = pagination.current;
      sendData.rows = pagination.pageSize;
      this.setState({
        current: pagination.current
      });
    } else {
      this.setState({
        current: 1
      });
    }
    sendData.keyword = sendData.keyword === '' ? null : sendData.keyword;
    sendData.status = sendData.status === '' ? null : sendData.status;
    sendData.startDay = sendData.startDay === '' ? null : moment(sendData.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = sendData.endDay === '' ? null : moment(sendData.endDay).format('YYYY-MM-DD HH:mm:ss');

    request
      .post('/trade/queryList')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        if (!err) {
          this.setState({
            recharge_data: JSON.parse(res.text).rows,
            total: res.body.total
          }, () => {
            this.setState({ tloading: false });
          });
        }
      });
  }
  searchHandle() {
    const formFields = this.props.form.getFieldsValue();
    const sendData = Object.assign({
      page: 1,
      rows: 10,
      order: "desc",
      sort: "id"
    }, this.state.formData);
    sendData.keyword = formFields.keyword;
    sendData.status = formFields.status;
    sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');
    this.setState(
      { formData: sendData }, () => {
        this.fetchRecharge();
      });

  }
  clearHandle() {
    this.props.form.resetFields();
    this.searchHandle({ current: 1, pageSize: this.state.pageSize });
    //this.fetchOrder({ current: 1, pageSize: this.state.pageSize });
  }
  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form layout="horizontal">
          <Row type="flex" align="middle" justify="start">
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('keyword')(
                  <Input type="text" placeholder="昵称/TA号/手机号码" />
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="支付状态">
                    <Option value="">全部</Option>
                    <Option value="1">支付成功</Option>
                    <Option value="0">支付失败</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem>
                {getFieldDecorator('startDay')(
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '85%' }} placeholder='充值时间从' />
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem >
                {getFieldDecorator('endDay')(
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '85%' }} placeholder='至' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" align="middle" justify="end" style={{ marginBottom: 10 }}>
            <Col><Button type="primary" onClick={this.searchHandle.bind(this)} style={{ marginRight: 10 }}><Icon type="search" />搜索</Button></Col>
            <Col><Button type="ghost" onClick={this.clearHandle.bind(this)}><Icon type="delete" />清空</Button></Col>
          </Row>
        </Form>
        <Table
          dataSource={this.state.recharge_data}
          columns={table_charge_columns}
          pagination={
            {
              total: this.state.total,
              showTotal: () => `符合条件的条目： ${this.state.total} 条`,
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSize: this.state.pageSize,
              current: this.state.current,
              onShowSizeChange: (current, pageSize) => {
                this.setState({
                  pageSize: pageSize
                });
              }
            }
          }
          onChange={this.fetchRecharge.bind(this)}
          loading={this.state.tloading}
          rowKey={record => record.id} />
      </div>
    )
  }
}
Recharge.propTypes = {
  form: React.PropTypes.object
};
const RechargeForm = Form.create({})(Recharge);
export default RechargeForm;
