import * as React from "react";
import { Table, Button, Row, Col, DatePicker, Form, Icon, Input, Select, Modal, Badge } from 'antd';
import * as request from "superagent";
import { connect } from 'react-redux'
import moment from "moment";
import "./settle.less"
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
class Settle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settle_data: [],
      reviewVisible: false,
      detailVisible: false,
      formData: { status: '', startDay: '', endDay: '' },
      reviewInitial: [],
      reason: '',
      tloading: false,
      total: 0,
      paginationCurrent: 1,
      paginationPageSize: 10
    };
  }
  componentWillMount() {
    this.fetchSettle();
  }
  /**
   * 获取所有聊天记录数据源
   */
  fetchSettle(pagination) {

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
    sendData.status = formFields.status;
    sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');
    /*sendData.status = sendData.status === '' ? null : sendData.status;
    sendData.startDay = sendData.startDay === '' ? null : moment(sendData.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = sendData.endDay === '' ? null : moment(sendData.endDay).format('YYYY-MM-DD HH:mm:ss');*/
    request
      .post('/enterApply/page.do')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        let redDot = new Object();
        for (let i in this.props.redDot) {
          redDot[i] = this.props.redDot[i];
        }
        redDot.enterapply = JSON.parse(res.text).unReviewCount;
        this.props.changeRedDot(redDot);
        if (!err) {
          this.setState({
            "settle_data": JSON.parse(res.text).rows,
            total: res.body.total
          }, () => {
            if (JSON.parse(res.text).rows == 0 && res.body.total != 0) {
              this.setState({ paginationCurrent: 1 }, () => {
                this.fetchSettle();
              });
            } else {
              this.setState({
                tloading: false
              });
            }
          });
        }
      });
  }
  //马上审核
  review(record) {
    this.setState({
      reviewVisible: true,
      reviewInitial: record
    });
  }

  //modal页眉关闭 页脚取消按钮
  handleCancel() {
    this.setState({ reviewVisible: false });
    $(".reason:last").css("display", "none");
    $("#passBtns").css("display", "block");
    $("#npassBtns").css("display", "none");
  }
  //modal详情中 审核通过按钮--根据后台需求修改
  handlePass() {
    request
      .post('/enterApply/queryUpdate.do')
      .type("form")
      .send({ id: this.state.reviewInitial.id, status: 'passed', reason: '' })
      .end((err, res) => {
        if (!err) {
          console.log(res);
          this.fetchSettle();
        } else {
          message.error('出错');
        }
      });
    this.setState({ reviewVisible: false });
  }
  //modal中 审核不通过按钮
  handleNoPass() {
    $(".reason:last").css("display", "block");
    $("#passBtns").css("display", "none");
    $("#npassBtns").css("display", "block");
  }
  //审核不通过时 填写了不通过理由后的 确认 按钮
  handleNoPassSub() {
    //--获取表单中textarea内容，根据后台需求修改
    const reasons = this.state.reason;
    if (!reasons) {
      Modal.error({
        title: 'This is an error message',
        content: '请填写审核不通过的理由！',
      });
      return;
    }
    request
      .post('/enterApply/queryUpdate.do')
      .type("form")
      .send({ id: this.state.reviewInitial.id, status: 'unpassed', reason: reasons })
      .end((err) => {
        if (!err) {
          this.fetchSettle();
        } else {
          message.error('出错')
        }
      });
    this.setState({ reviewVisible: false });
    $(".reason:last").css("display", "none");
    $("#passBtns").css("display", "block");
    $("#npassBtns").css("display", "none");
  }

  //查看详情
  checkDetail(record) {
    request
      .post('/enterApply/querySingle.do')
      .type("form")
      .send({ id: record.id })
      .end((err, res) => {
        if (!err) {
          this.setState({
            detailVisible: true,
            reviewInitial: JSON.parse(res.text)
          });
        }
      });
  }
  handleDetailCancel() {
    this.setState({ detailVisible: false });
  }
  handleDetailOk() {
    this.setState({ detailVisible: false });
  }
  /*searchHandle() {
      const formFields = this.props.form.getFieldsValue();
      const sendData = Object.assign({
          page: 1,
          rows: 10,
          order: "desc",
          sort: "id"
      }, this.state.formData);
      sendData.status = formFields.status;
      sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
      sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');
      this.setState(
          { formData: sendData }, () => {
              this.fetchSettle();
          });
  }*/
  clearHandle() {
    this.props.form.resetFields();
    this.fetchSettle({ current: 1, pageSize: this.state.paginationPageSize });
  }
  handleReason(event) {
    this.setState({ 'reason': event.target.value });
  }
  render() {
    const Option = Select.Option;
    const FormItem = Form.Item;
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    };
    const { getFieldDecorator } = this.props.form;
    //表格列
    const settle_columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '昵称',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: 'TA号',
        dataIndex: 'userid',
        key: 'userid'
      }, {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime'
      }, {
        title: '申请状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          if (status === 'unreviewed') {
            return <Badge status="warning" text="待审核" />;
          } else if (status === 'unpassed') {
            return <Badge status="error" text="未通过" />;
          } else if (status === 'passed') {
            return <Badge status="success" text="已通过" />;
          }
        }
      }, {
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
        render: (text, record) => {
          let opts = "";
          if (record.status === 'unreviewed') {
            opts = <a href="javascript:;" onClick={() => { this.review(record) }}>马上审核</a>;
          } else {
            opts = <a href="javascript:;" onClick={() => { this.checkDetail(record) }}>查看详情</a>;
          }
          return opts;
        }
      }
    ];
    return (
      <div>
        <Form layout="horizontal">
          <Row type="flex" align="middle" justify="start">
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="审核状态">
                    <Option value="passed">已通过</Option>
                    <Option value="unpassed">未通过</Option>
                    <Option value="unreviewed">待审核</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={5} lg={6}>
              <FormItem>
                {getFieldDecorator('startDay')(
                  <DatePicker style={{ width: '85%' }} format="YYYY-MM-DD HH:mm:ss" showTime placeholder="申请时间从" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem>
                {getFieldDecorator('endDay')(
                  <DatePicker style={{ width: '85%' }} format="YYYY-MM-DD HH:mm:ss" showTime placeholder="至" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={7} lg={6} className="btn-wrap">
              <Button type="primary" onClick={this.fetchSettle.bind(this)} style={{ "marginRight": 10 }}><Icon type="search" />查询</Button>
              <Button type="ghost" onClick={this.clearHandle.bind(this)}><Icon type="delete" />清空</Button></Col>
          </Row>
        </Form>
        <Table
          dataSource={this.state.settle_data}
          columns={settle_columns}
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
          onChange={this.fetchSettle.bind(this)}
          loading={this.state.tloading}
          rowKey={record => record.id} />
        <Modal title="马上审核" onCancel={this.handleCancel.bind(this)} visible={this.state.reviewVisible}
          footer={[
            <div id="passBtns" key={1}>
              <Button type="primary" size="large" onClick={this.handlePass.bind(this)} key={1}>审核通过</Button>
              <Button type="primary" size="large" onClick={this.handleNoPass.bind(this)} style={{ marginLeft: 20 }} key={2}>不通过</Button>
            </div>,
            <div id="npassBtns" style={{ display: 'none' }} key={2}>
              <Button type="primary" size="large" onClick={this.handleCancel.bind(this)} key={1}>取消</Button>
              <Button type="primary" size="large" onClick={this.handleNoPassSub.bind(this)} key={2}>确定</Button>
            </div>
          ]}>
          <DetailFormModal initialData={this.state.reviewInitial} handleReason={this.handleReason.bind(this)} />
        </Modal>
        <Modal title="审核详情" onCancel={this.handleDetailCancel.bind(this)} onOk={this.handleDetailOk.bind(this)} visible={this.state.detailVisible} >
          <DetailFormModal initialData={this.state.reviewInitial} />
        </Modal>
      </div>
    );
  }
}

Settle.propTypes = {
  form: React.PropTypes.object,
  redDot: React.PropTypes.object,
  changeRedDot: React.PropTypes.func
};
const SettleForm = Form.create({})(Settle);

//详情中modal中的表单
class DetailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    }
  }
  componentWillMount() {
    this.getSubFiles();
  }
  componentWillReceiveProps() {
    this.getSubFiles();
  }
  //从后台获取附件内容
  getSubFiles() {
    request
      .post('/enterApply/queryFiles.do')
      .type("form")
      .send({ id: this.props.initialData.id })
      .end((err, res) => {
        if (!err) {
          this.setState({
            "files": JSON.parse(res.text)
          });
        } else {
          message.error('出错')
        }
      });
  }
  render() {
    const initialDataProps = this.props.initialData;
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const enterWay = initialDataProps.enterWay === 'audit' ? '审核入驻' : '直接入驻';
    let status;
    if (initialDataProps.status === 'unreviewed') {
      status = '未审核';
    } else if (initialDataProps.status === 'unpassed') {
      status = '未通过';
    } else if (initialDataProps.status === 'passed') {
      status = '已通过';
    }
    //附件
    const subFiles = this.state.files.map((v, i) => {
      return <Row type="flex" align="middle" justify="center" key={i}>
        <Col sm={12} xs={24} md={6} lg={18}>
          <FormItem
            {...formItemLayout}
            label={`附件${i + 1}:`}
          >
            {getFieldDecorator('tano')(
              <a href={`/enter/enterFile/${v.id}/download`}>{v.name}</a>
            )}
          </FormItem>
        </Col>
      </Row>
    });
    //未通过的理由initialData
    let noreason;
    if (initialDataProps.status === 'unpassed') {
      noreason = <Row type="flex" align="middle" justify="center">
        <Col sm={12} xs={24} md={6} lg={18}>
          <FormItem  {...formItemLayout} label='审核未通过的理由'>
            {getFieldDecorator('reason', { initialValue: initialDataProps.reason === null ? '无' : initialDataProps.reason })(
              <Input type='textarea' rows={3} readOnly />
            )}
          </FormItem>
        </Col>
      </Row>;
    }
    return (
      <Form layout="horizontal">
        <Row type="flex" align="middle" justify="center">
          <Col sm={12} xs={24} md={6} lg={18}>
            <FormItem
              {...formItemLayout}
              label="TA号"
            >
              {getFieldDecorator('userid', { initialValue: initialDataProps.userid })(
                <Input type="text" readOnly />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="middle" justify="center">
          <Col sm={12} xs={24} md={6} lg={18}>
            <FormItem
              {...formItemLayout}
              label="昵称"
            >
              {getFieldDecorator('username', { initialValue: initialDataProps.username })(
                <Input type="text" readOnly />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="middle" justify="center">
          <Col sm={12} xs={24} md={6} lg={18}>
            <FormItem
              {...formItemLayout}
              label="申请时间"
            >
              {getFieldDecorator('applyTime', { initialValue: initialDataProps.applyTime })(
                <Input type="text" readOnly />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="middle" justify="center">
          <Col sm={12} xs={24} md={6} lg={18}>
            <FormItem
              {...formItemLayout}
              label="入驻方式"
            >
              {getFieldDecorator('enterWay', { initialValue: enterWay })(
                <Input type="text" readOnly />
              )}
            </FormItem>
          </Col>
        </Row>
        {subFiles}
        <Row type="flex" align="middle" justify="center">
          <Col sm={12} xs={24} md={6} lg={18}>
            <FormItem
              {...formItemLayout}
              label="审核状态："
            >
              {getFieldDecorator('status')(
                <a href="javascript:;">{status}</a>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="middle" justify="center">
          <Col sm={12} xs={24} md={6} lg={18} className='reason' style={{ display: 'none' }}>
            <FormItem
              {...formItemLayout}
              label="审核未通过的理由"
            >
              {getFieldDecorator('nopassReason')(
                <Input type="textarea" rows={4} placeholder='请认真填写审核未通过理由' onChange={this.props.handleReason} />
              )}
            </FormItem>
          </Col>
        </Row>
        {noreason}
      </Form>
    );
  }
}
DetailForm.propTypes = {
  form: React.PropTypes.object,
  initialData: React.PropTypes.object,
  handleReason: React.PropTypes.func
};
const DetailFormModal = Form.create({})(DetailForm);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettleForm);

