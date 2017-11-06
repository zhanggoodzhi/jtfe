import * as React from "react";
/*import videojs from "video.js";
import "video.js/dist/video-js.css";*/
import { Table, Button, Row, Col, DatePicker, Form, Icon, Input, Select, Modal, Tabs, message, Radio } from 'antd';
import * as request from "superagent";
import { connect } from 'react-redux'
import moment from "moment";
import './complain.less';
const mapStateToProps = (state) => {
  return {
    redDot: state.redDot
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeRedDot: (redDot) => { dispatch({ type: 'changeRedDot', redDot: redDot }) }
  }
}
const options = { techOrder: ["html5", "flash"], controls: true, autoplay: false, preload: "none" };

class Complain extends React.Component {
  constructor(props) {
    super(props);
    this.orderId = null;
    this.complainId = null;
    this.state = {
      complain_data: [],
      formData: { orderid: '', statusName: '', status: '', startDay: '', endDay: '' },
      visible: false,
      status: false,
      textarea: '',
      orderDetail_data: [],
      chartDetail_data: [],
      complainDetail_data: [],
      orderStatus: [{ "id": "0", "code": '0', "name": "无数据" }],
      complainSatus: [{ "id": "0", "code": '0', "name": "无数据" }],
      tloading: false,
      responseVisible: 'none',
      judgeResult: '',
      total: 0,
      paginationCurrent: 1,
      paginationPageSize: 10
    };
  }
  componentWillMount() {
    this.fetchSources();
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
          this.setState({ "complainSatus": JSON.parse(res.text) });
        }
      });
  }
  /*componentDidUpdate() {
      this.state.chartDetail_data.forEach(v => {
          if (v.chatType === 2 || v.chatType === 4) {
              videojs(v.mediaid, options)
          }
      });
  }*/
  fetchSources(pagination) {
    console.log("pagination");
    console.log(pagination);
    this.setState({ tloading: true });
    const formFields = this.props.form.getFieldsValue();
    const sendData = Object.assign({
      page: 1,
      rows: 10,
      order: "desc",
      sort: "id"
    }, this.state.formData);

    if (pagination && pagination.current) {
      sendData.page = pagination.current;
      sendData.rows = pagination.pageSize;
      this.setState({ paginationCurrent: pagination.current });
    } else {
      this.setState({
        paginationCurrent: 1
      });
    }
    let compl;
    if (formFields.statusName == -1) {
      compl = null;
    } else if (formFields.statusName == '') {
      compl = null;
    } else {
      compl = formFields.statusName;
    }
    let orderstatus;
    if (formFields.status == -1) {
      orderstatus = null;
    } else if (formFields.status == '') {
      orderstatus = null;
    } else {
      orderstatus = formFields.status;
    }

    sendData.orderid = formFields.orderid;
    sendData.statusName = compl;
    sendData.status = orderstatus;
    sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');

    request
      .post('/order/queryComplain')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        let data = JSON.parse(res.text);
        let redDot = new Object();
        for (let i in this.props.redDot) {
          redDot[i] = this.props.redDot[i];
        }
        redDot.orderComplain = data.unReviewCount;
        this.props.changeRedDot(redDot);
        if (!err) {
          this.setState({
            complain_data: JSON.parse(res.text).rows,
            total: res.body.total
          }, () => {
            this.setState({ tloading: false });
          });
        }
      });
  }
  //查看详情
  complainDetail(orderid) {
    this.orderId = orderid;
    this.setState({
      textarea: '',
      tabActiveKey: '1'
    });
    request
      .post('/order/orderDetail.do')
      .type("form")
      .send({ 'orderId': orderid })
      .end((err, res) => {
        if (!err) {
          let complainDetails = [];
          if (JSON.parse(res.text).has_complain) {
            complainDetails = JSON.parse(res.text).complain
          }
          this.complainId = complainDetails.id;
          this.setState({//投诉的状态，判断是否出现表单
            status: complainDetails.status == 0 ? true : false
          });
          this.setState({
            orderDetail_data: JSON.parse(res.text).order,
            chartDetail_data: JSON.parse(res.text).content,
            complainDetail_data: complainDetails,
            visible: true
          });
        }
      });
  }
  handleCancel() {
    this.setState({ visible: false });
  }
  clearHandle() {
    this.props.form.resetFields();
    this.fetchSources({ current: 1, pageSize: this.state.paginationPageSize });
  }

  commit(type) {
    switch (type) {
      case 1:
        this.state.judgeResult = 1;
        this.setState({ responseVisible: 'none' });
        this.dealComplain(1);
        break;
      case 0:
        this.setState({ responseVisible: 'inline-block' });
        this.state.judgeResult = 2;
        break;
      case 2:
        this.setState({ responseVisible: 'inline-block' });
        this.state.judgeResult = 0;
        break;
      case 3:
        if (!this.state.textarea) {
          Modal.error({
            title: '请填写反馈意见',
            content: '反馈意见为必填项！',
          });
          return;
        } else {
          this.setState({ responseVisible: 'none' });
          this.dealComplain(this.state.judgeResult);
        }
        break;
      case 4:
        this.setState({ responseVisible: 'none' });
        this.handleCancel();
        break;
    }
  }
  dealComplain(type) {
    let self = this;
    request
      .post('/order/doComplainJudge.do')
      .type("form")
      .send({
        orderId: self.orderId,
        complainId: self.complainId,
        judgeResult: type,
        comment: self.state.textarea,
      })
      .end((err, res) => {
        if (!err) {
          this.fetchSources();
          this.handleCancel();
        } else {
          message.error('出错');
        }
      });
  }
  getResult() {
    switch (this.state.complainDetail_data.solution) {
      case 0:
        return '驳回申请';
      case 1:
        return '全额退款';
      case 2:
        return '50%退款';
      default:
        return '待处理';
    }
  }
  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const TabPane = Tabs.TabPane;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    }
    const formItemLayout2 = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      }
    }
    //初始化 订单状态的下拉菜单的初始值
    const orderStatus = this.state.orderStatus.map((v) => {
      if (!v.id) {
        return <Option value='-1' key={'-1'}>{v.name}</Option>;
      }
      return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
    });
    //初始化 投诉状态的下拉菜单初始值
    const complainSatus = this.state.complainSatus.map((v) => {
      if (!v.id) {
        return <Option value='-1' key={'-1'}>{v.name}</Option>;
      }
      return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
    });
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    const complain_columns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        width: 30
      }, {
        title: '订单ID',
        key: 'orderid',
        dataIndex: 'order.id',
        width: 60
      }, {
        title: '用户',
        key: 'order.playername',
        dataIndex: 'order.playername',
        width: 80
      }, {
        title: '化身',
        key: 'order.avtarname',
        dataIndex: 'order.avtarname',
        width: 80
      }, {
        title: '投诉内容',
        key: 'comment',
        dataIndex: 'comment'
      }, {
        title: '时间',
        key: 'order.createTime',
        dataIndex: 'order.createTime',
        width: 150
      }, {
        title: '投诉状态',
        key: 'statusName',
        dataIndex: 'statusName',
        width: 80
      }, {
        title: '订单状态',
        key: 'order.statusName',
        dataIndex: 'order.statusName',
        width: 80
      }, {
        title: '操作',
        key: 'opt',
        render: (text, record) => {
          let str = '';
          switch (record.status) {
            case 0:
              str = <a href="javascript:;" onClick={() => { this.complainDetail(record.order.id); }}>投诉处理</a>
              break;
            case 1:
              str = <a href="javascript:;" onClick={() => { this.complainDetail(record.order.id); }}>查看详情</a>
              break;
          }
          return str;
        },
        width: 80
      }];
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
    let esform = null;
    if (this.state.status == false) {
      esform = (
        <Row type="flex" align="middle" justify="center">
          <Col sm={12} xs={24} md={6} lg={18}>
            <FormItem {...formItemLayout2} label="反馈意见">
              {this.state.complainDetail_data.response}
            </FormItem>
          </Col>
        </Row>
      )
    } else {
      esform = [
        <Row key={100} type="flex" align="middle" justify="center">
          <RadioGroup defaultValue="a">
            <RadioButton value="a" key={11} onClick={() => { this.commit(1) }}>全额退款</RadioButton>
            <RadioButton value="b" key={10} onClick={() => { this.commit(0) }}>驳回申请</RadioButton>
            <RadioButton value="c" key={12} onClick={() => { this.commit(2) }}>50%退款</RadioButton>
          </RadioGroup>

        </Row>,
        <div style={{ display: `${this.state.responseVisible}`, width: 490, marginTop: 20 }} key={16}>
          <Row key={101} type="flex" align="middle" justify="center">
            <Col sm={12} xs={24} md={6} lg={18} key={15}>
              <FormItem {...formItemLayout2} label="反馈意见">
                <Input type="textarea" value={this.state.textarea} rows={4} placeholder="请输入反馈意见" onChange={(e) => { this.setState({ textarea: e.target.value }) }} />
              </FormItem>
            </Col>
          </Row>
          <Row key={102} type="flex" align="middle" justify="center">
            <Col key={13}><Button type="ghost" onClick={() => { this.commit(3) }} style={{ marginRight: 10 }}>确认</Button></Col>
            <Col key={14}><Button type="ghost" onClick={() => { this.commit(4) }} style={{ marginRight: 10 }}>取消</Button></Col>
          </Row>
        </div>
      ]
    }
    return (

      <div>
        <Form layout="horizontal">
          <Row type="flex" align="middle" justify="start">
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('orderid')(
                  <Input type="text" placeholder="订单号" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('statusName')(
                  <Select placeholder="投诉状态">
                    {complainSatus}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="订单状态">
                    {orderStatus}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem>
                {getFieldDecorator('startDay')(
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '85%' }} placeholder='投诉日期从' />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6} >
              <FormItem >
                {getFieldDecorator('endDay')(
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '85%' }} placeholder='至' />)}
              </FormItem>
            </Col>
            <Col sm={24} xs={24} md={12} lg={12} className="btn-wrap">
              <Button type="primary" onClick={this.fetchSources.bind(this)} style={{ marginRight: 10 }}><Icon type="search" />搜索</Button>
              <Button type="ghost" onClick={this.clearHandle.bind(this)}><Icon type="delete" />清空</Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={complain_columns}
          dataSource={this.state.complain_data}
          pagination={
            {
              total: this.state.total,
              showTotal: () => `符合条件的条目： ${this.state.total} 条`,
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSize: this.state.paginationPageSize,
              current: this.state.paginationCurrent,
              onShowSizeChange: (current, pageSize) => {
                this.setState({
                  //paginationCurrent: current,
                  paginationPageSize: pageSize
                });
              }
            }
          }
          onChange={this.fetchSources.bind(this)}
          loading={this.state.tloading}
          rowKey={record => record.id} />
        <Modal title="投诉详情"
          wrapClassName="complain-detail"
          onCancel={this.handleCancel.bind(this)}
          onOk={this.handleCancel.bind(this)}
          visible={this.state.visible}>
          <Tabs defaultActiveKey="1" activeKey={this.state.tabActiveKey} onTabClick={(v) => { this.setState({ tabActiveKey: v }) }}>
            <TabPane tab="订单详情" key="1">
              <Form layout="horizontal">
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="订单编号">
                      {this.state.orderDetail_data.id}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="下单用户">
                      {this.state.orderDetail_data.playername}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="化身">
                      {this.state.orderDetail_data.avtarname}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="时间">
                      {this.state.orderDetail_data.minutes}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="金额">
                      {this.state.orderDetail_data.quantity}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="下单时间">
                      {this.state.orderDetail_data.createTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="开始时间">
                      {this.state.orderDetail_data.createTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="结束时间">
                      {this.state.orderDetail_data.endTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="支付时间">
                      {this.state.orderDetail_data.dealTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="取消时间">
                      {this.state.orderDetail_data.cancelTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="订单状态">
                      {this.state.orderDetail_data.statusName}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="投诉时间">
                      {this.state.complainDetail_data.createTime}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="投诉理由">
                      {this.state.complainDetail_data.comment}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="投诉状态">
                      {this.state.complainDetail_data.statusName}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="center">
                  <Col sm={12} xs={24} md={6} lg={18}>
                    <FormItem {...formItemLayout2} label="处理结果">
                      {this.getResult()}
                    </FormItem>
                  </Col>
                </Row>
                {esform}
              </Form>
            </TabPane>
            <TabPane tab="聊天记录" key="2">
              <div className='chat'>
                {chatCtx}
              </div>
            </TabPane>
          </Tabs>
        </Modal>
      </div >
    );
  }
}
Complain.propTypes = {
  form: React.PropTypes.object,
  redDot: React.PropTypes.object,
  changeRedDot: React.PropTypes.func
}
const ComplainForm = Form.create({})(Complain);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComplainForm);

/*<Col key={11}><Button type="ghost" onClick={() => { this.commit(1) } } style={{ marginRight: 10 }}>全额退款</Button></Col>
<Col key={10}><Button type="ghost" onClick={() => { this.commit(0) } } style={{ marginRight: 10 }}>驳回申请</Button></Col>
<Col key={12}><Button type="ghost" onClick={() => { this.commit(2) } } style={{ marginRight: 10 }}>50%退款</Button></Col>*/
