import * as React from "react";
import { Table, Button, Row, Col, DatePicker, Form, Icon, Input, Select, Modal, Tabs } from 'antd';
import * as request from "superagent";
import moment from "moment";
/*import videojs from "video.js";
import "video.js/dist/video-js.css";*/
import "./order.less";


class FormElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order_data: [],
      orderStatus: [{ "id": "0", "code": '0', "name": "无数据" }],
      complainsatus: [{ "id": "0", "code": '0', "name": "无数据" }],
      formData: { actor: '', player: '', minutes: '', orderstatus: '', complainsatus: '', startDay: '', endDay: '', userid: '' }
    };
  }
  componentWillMount() {
    //初始化头部form表单下拉菜单中的值
    request
      .post('/order/queryType')
      .type("form")
      .send({
        "type": "order_status"
      })
      .end((err, res) => {
        if (!err) {
          this.setState({ "orderStatus": JSON.parse(res.text) });
        }
      });
    //初始化 投诉状态的下拉菜单初始值
    request
      .post('/order/queryType')
      .type("form")
      .send({
        "type": "order_complain_status"
      })
      .end((err, res) => {
        if (!err) {
          this.setState({ "complainsatus": JSON.parse(res.text) });
        }
      });
  }

  clearHandle() {
    //formData:{actor:'',player:'',minutes:'',orderstatus:'',complainsatus:'',startDay:'',endDay:''}
    this.props.form.resetFields();
    this.props.clearForm();
  }
  updateForm(data) {
    const cloneFormData = Object.assign({}, this.state.formData, data);
    this.setState({
      formData: cloneFormData
    });
  }
  //导出为excel
  excel() {
    const formFields = this.props.form.getFieldsValue();
    console.log(formFields);
    let href = `/order/saveOrderToExcel.do?1=1`;
    if (formFields.actor) {
      href += `&actor=${formFields.actor}`
    }
    if (formFields.complainstatus) {
      href += `&complainstatus=${formFields.complainstatus}`
    }
    if (formFields.minutes) {
      href += `&minutes=${formFields.minutes}`
    }
    if (formFields.orderstatus) {
      href += `&orderstatus=${formFields.orderstatus}`
    }
    if (formFields.player) {
      href += `&player=${formFields.player}`
    }
    if (formFields.startDay) {
      href += `&startDay=${formFields.startDay}`
    }
    if (formFields.endDay) {
      href += `&sendDay=${formFields.endDay}`
    }
    window.location.href = href;
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
    //初始化 订单状态的下拉菜单的初始值
    const orderStatus = this.state.orderStatus.map((v) => {
      if (!v.id) {
        return <Option value='-1' key={'-1'}>{v.name}</Option>;
      }
      return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
    });
    //初始化 投诉状态的下拉菜单初始值
    const complainsatus = this.state.complainsatus.map((v) => {
      if (!v.id) {
        return <Option value='-1' key={'-1'}>{v.name}</Option>;
      }
      return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
    });
    //导出excel按钮显示
    let excelBtn = '';
    if (this.props.ifExcel) {
      excelBtn = <Button type="ghost" onClick={this.excel.bind(this)}>导出为excel</Button>
    }
    return (
      <Form layout="horizontal">
        <Row type="flex" align="middle" justify="start">
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('actor')(
                <Input type="text" placeholder="角色昵称/角色ID" />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('player')(
                <Input type="text" placeholder="玩家昵称/TA号" />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('minutes')(
                <Select placeholder="订单时长" >
                  <Option value={'0'} key={11}>0~30</Option>
                  <Option value={'30'} key={12}>30~60</Option>
                  <Option value={'60'} key={13}>60~90</Option>
                  <Option value={'90'} key={14}>90~120</Option>
                  <Option value={'120'} key={15}>>120</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('orderstatus')(
                <Select placeholder="订单状态" >
                  {orderStatus}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="middle" justify="start" >
          <Col sm={12} xs={24} md={4} lg={5}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('complainstatus')(
                <Select placeholder="投诉状态" >
                  {complainsatus}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem>
              {getFieldDecorator('startDay')(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '85%' }} placeholder="下单时间从" />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={5}>
            <FormItem>
              {getFieldDecorator('endDay')(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '85%' }} placeholder="至" />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={12} lg={8} className="btn-wrap">
            <Button type="primary" icon='search' onClick={this.props.fetchOrder} style={{ marginRight: 8 }}>搜索</Button>
            <Button type="ghost" icon='delete' onClick={() => { this.clearHandle() }} style={{ marginRight: 8 }}>清空</Button>
            {excelBtn}
          </Col>
        </Row>
      </Form>
    );
  }
}

FormElements.propTypes = {
  form: React.PropTypes.object,
  updateForm: React.PropTypes.func,
  clearForm: React.PropTypes.func,
  fetchOrder: React.PropTypes.func,
  ifExcel: React.PropTypes.bool
}
let timer = null;
const SearchForm = Form.create({
  onFieldsChange: (props, fields) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      for (let i in fields) {
        const obj = {};
        obj[fields[i].name] = fields[i].value;
        props.updateForm(obj);
      }
    }, 200);
  }
})(FormElements);
const options = { techOrder: ["html5", "flash"], controls: true, autoplay: false, preload: "none" };
class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: [{ "id": "0", "code": '0', "name": "无数据" }],
      complainsatus: [{ "id": "0", "code": '0', "name": "无数据" }],
      visible: false,
      pageSize: 10,
      current: 1,
      orderDetail_data: [],
      chartDetail_data: [],
      tloading: false,
      ifExcel: true,
      total: 0
    }
  }
  clearForm() {
    this.setState({
      formData: {
        "page": 1,
        "rows": 20,
        "actor": "",
        "player": "",
        "minutes": null,
        "orderstatus": "",
        "complainsatus": '',
        "startDay": undefined,
        "endDay": undefined
      }
    }, () => {
      this.fetchOrder({ current: 1, pageSize: this.state.pageSize });
    });
  }
  updateForm(data) {
    const cloneFormData = Object.assign({}, this.state.formData, data);
    this.setState({
      formData: cloneFormData
    });
  }
  componentWillMount() {
    //初始化表格数据
    this.fetchOrder();
  }
  /*componentDidUpdate() {
      this.state.chartDetail_data.forEach(v => {
          if(v.textContent!=null){
              if (v.chatType === 2 || v.chatType === 4) {
                  videojs(v.mediaid, options)
              }
          }
      });
  }*/
  /**
   * 获取订单数据源
   */
  fetchOrder(pagination) {
    console.log(pagination);
    const userid = window.location.href.split('=')[1];
    //发送至后台的参数
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
    let compst;
    if (sendData.complainstatus === undefined || '' || null) {
      compst = -1;
    } else {
      compst = sendData.complainstatus;
    }
    if (userid) { sendData.userid = userid }
    sendData.complainstatus = compst;
    sendData.startDay = sendData.startDay === undefined ? null : moment(sendData.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = sendData.endDay === undefined ? null : moment(sendData.endDay).format('YYYY-MM-DD HH:mm:ss');

    request
      .post('/order/queryList')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        if (!err) {
          if (JSON.parse(res.text).total) {
            this.setState({ ifExcel: true })
          }
          this.setState({
            order_data: res.body.rows,
            total: res.body.total
          }, () => {
            this.setState({ tloading: false });
          });
        }
      });
  }
  orderDetail(orderid) {
    request
      .post('/order/orderDetail.do')
      .type("form")
      .send({ orderId: orderid })
      .end((err, res) => {
        if (!err) {
          this.setState({
            orderDetail_data: JSON.parse(res.text).order,
            chartDetail_data: JSON.parse(res.text).content
          });
        }
      });
    this.setState({ tabActiveKey: '1', visible: true });

  }
  handleCancel() {
    this.setState({ visible: false });
  }
  render() {
    const table_orders_columns = [
      {
        title: '订单ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '玩家昵称',
        dataIndex: 'playername',
        key: 'playername',
      }, {
        title: '角色昵称',
        dataIndex: 'actorname',
        key: 'actorname',
      }, {
        title: '订单时长',
        dataIndex: 'minutes',
        key: 'minutes',
        sorter: (a, b) => a.dealTime - b.dealTime
      }, {
        title: '订单金额',
        dataIndex: 'quantity',
        key: 'quantity',
        sorter: (a, b) => a.quantity - b.quantity
      }, {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a, b) => a.createTime - b.createTime
      }, {
        title: '订单状态',
        dataIndex: 'statusName',
        key: 'statusName',
      }, {
        title: '投诉状态',
        dataIndex: 'complainStatusName',
        key: 'complainStatusName',
        render: (complainStatusName) => {
          if (complainStatusName == null) {
            return '无投诉';
          } else {
            return complainStatusName;
          }
        }
      }, {
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
        render: (text, record) => {
          return <a href="javascript:;" onClick={() => { this.orderDetail(record.id) }}>查看详情</a>;
        }
      }];
    const FormItem = Form.Item;
    const TabPane = Tabs.TabPane;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    //初始化聊天内容
    let chatCtx;
    if (this.state.chartDetail_data.length != 0) {
      chatCtx = this.state.chartDetail_data.map((v) => {
        //聊天内容
        let chatctx;
        switch (v.chatType) {
          case 1:
            chatctx = v.textContent;
            break;
          case 2:
            chatctx = <audio id={v.mediaid} src={v.mediaUrl} controls></audio>
            //chatctx = <video id={v.mediaid} src={v.mediaUrl} height="20" className={`video-js vjs-default-skin vjs-big-play-centered`} >您的浏览器不支持 video 标签。</video>;
            break;
          case 3:
            chatctx = <img src={v.mediaUrl} width='200' height='100' />;
            break;
          case 4:
            chatctx = <video id={v.mediaid} src={v.mediaUrl} controls width='350' height='200'></video>
            //chatctx = <video id={v.mediaid} src={v.mediaUrl} className={`video-js vjs-default-skin vjs-big-play-centered`}>您的浏览器不支持 video 标签。</video>;
            break;
        }
        //右侧人物身份name和url
        let withPlayName;
        let withPlayHeadUrl;
        if (v.type == "WITH_AVATAR") {
          withPlayName = v.avatarname;
          withPlayHeadUrl = v.avatarHeadUrl;
        } else {
          withPlayName = v.robotname;
          withPlayHeadUrl = v.robotHeadUrl;
        }
        //单条聊天内容展示(类型不同 聊天内容不同)
        let info;
        if (v.channelType == 4) {
          info = <div className='singleInfo' key={v.id}>
            <div className="time">{moment(`${v.createTime}`, "YYYYMMDD").fromNow()}</div>
            <div className="infoBox avatarInfo">
              <div className='infoCtx'>
                <div className='nickname'>
                  {withPlayName}
                </div>
                <div className='ctx'>
                  {chatctx}
                </div>
              </div>
              <div className='photo'>
                <img src={withPlayHeadUrl} width='50px' height='50px' />
              </div>
            </div>
          </div>
        } else if (v.channelType == 3) {
          info = <div className='singleInfo playerInfo' key={v.id}>
            <div className="time">{moment(`${v.createTime}`, "YYYYMMDD").fromNow()}</div>
            <div className="infoBox">
              <div className='photo'>
                <img src={v.playerHeadUrl} width='50px' height='50px' alt='无头像' />
              </div>
              <div className='infoCtx'>
                <div className='nickname'>
                  {v.playername}
                </div>
                <div className='ctx'>
                  {chatctx}
                </div>
              </div>
            </div>
          </div>
        }
        return info;
      });
    } else if (this.state.chartDetail_data.length == 0) {
      chatCtx = '无聊天记录';
    }
    return (
      <div>
        <SearchForm ifExcel={this.state.ifExcel}
          clearForm={this.clearForm.bind(this)} updateForm={this.updateForm.bind(this)} fetchOrder={this.fetchOrder.bind(this)} />
        <Table dataSource={this.state.order_data}
          columns={table_orders_columns}
          pagination={
            {
              total: this.state.total,
              showTotal: () => `符合条件的条目： ${this.state.total} 条`,
              showSizeChanger: true,
              pageSize: this.state.pageSize,
              current: this.state.current,
              onShowSizeChange: (current, pageSize) => {
                this.setState({
                  pageSize: pageSize
                });
              }
            }
          }
          onChange={this.fetchOrder.bind(this)}
          loading={this.state.tloading}
          rowKey={record => record.id}
        />
        <Modal title="订单详情"
          onCancel={this.handleCancel.bind(this)}
          onOk={this.handleCancel.bind(this)}
          visible={this.state.visible}
          className='orderDetail'>
          <Tabs defaultActiveKey="1" activeKey={this.state.tabActiveKey} onTabClick={(v) => { this.setState({ tabActiveKey: v }) }}>
            <TabPane tab="订单详情" key="1">
              <Form layout="horizontal">
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="订单编号">
                      {this.state.orderDetail_data.id}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="下单用户">
                      {this.state.orderDetail_data.playername}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="化身">
                      {this.state.orderDetail_data.avtarname}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="时间">
                      {this.state.orderDetail_data.minutes}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="金额">
                      {this.state.orderDetail_data.quantity}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="下单时间">
                      {this.state.orderDetail_data.createTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="开始时间">
                      {this.state.orderDetail_data.startTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="结束时间">
                      {this.state.orderDetail_data.endTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="支付时间">
                      {this.state.orderDetail_data.dealTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="取消时间">
                      {this.state.orderDetail_data.cancelTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout} label="订单状态">
                      {this.state.orderDetail_data.statusName}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </TabPane>
            <TabPane tab="聊天记录" key="2">
              <div className='orderChat'>
                {chatCtx}
              </div>
            </TabPane>
          </Tabs>

        </Modal>
      </div>
    )
  }

}
export default Order;
