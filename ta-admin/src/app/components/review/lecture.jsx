import * as React from "react";
import { Table, Button, Row, Col, DatePicker, Form, Icon, Input, Select, Modal, Radio } from 'antd';
import * as request from "superagent";
import { connect } from 'react-redux'
import moment from "moment";
import './lecture.less';
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
class Lecture extends React.Component {
  constructor(props) {
    super(props);
    this.lectureId = null;
    this.state = {
      status: null,
      textarea: null,
      lecture_data: [],
      formData: { host: '', avatar: '', topic: '', lectureCategory: '', process: 'waiting', startDay: '', endDay: '' },
      reviewVisible: false,
      detailVisible: false,
      singleLectureInfo: [],
      catogories: [],
      tloading: false,
      total: 0,
      paginationCurrent: 1,
      paginationPageSize: 10
    };
  }
  componentWillMount() {
    this.fetchSources();
    request
      .post('/lecture/queryAllCategory.do')
      .type("form")
      .end((err, res) => {
        if (!err) {
          this.setState({
            catogories: JSON.parse(res.text)
          });
        }
      });
  }
  //获取分页讲座数据
  fetchSources(pagination) {
    this.setState({ tloading: true });
    const formFields = this.props.form.getFieldsValue();
    const sendData = Object.assign({
      page: this.state.paginationCurrent,
      rows: this.state.paginationPageSize,
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
    let nprocess = '';
    if (formFields.process === 'all') {
      nprocess = '';
    } else {
      if (!formFields.process) { nprocess = sendData.process } else { nprocess = formFields.process }
    }
    /*if(formFields.host||formFields.avatar||formFields.topic||formFields.lectureCategory
    ||formFields.process||formFields.startDay||formFields.endDay){*/
    sendData.host = formFields.host;
    sendData.avatar = formFields.avatar;
    sendData.topic = formFields.topic;
    sendData.lectureCategory = formFields.lectureCategory;
    sendData.process = nprocess;
    sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');

    request
      .post('/lecture/lecturePage.do')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        let data = JSON.parse(res.text);
        let redDot = new Object();
        for (let i in this.props.redDot) {
          redDot[i] = this.props.redDot[i];
        }
        redDot.lecture = data.unReviewCount;
        this.props.changeRedDot(redDot);
        if (!err) {
          this.setState({
            lecture_data: JSON.parse(res.text).rows,
            total: res.body.total
          }, () => {
            if (JSON.parse(res.text).rows == 0 && res.body.total != 0) {
              this.setState({ paginationCurrent: 1 }, () => {
                this.fetchSources();
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
  /*searchHandle() {
      const formFields = this.props.form.getFieldsValue();
      const sendData = Object.assign({
          page: 1,
          rows: 10,
          order: "desc",
          sort: "id"
      }, this.state.formData);
      sendData.host = formFields.host;
      sendData.avatar = formFields.avatar;
      sendData.topic = formFields.topic;
      sendData.lectureCategory = formFields.lectureCategory;
      sendData.process = formFields.process;
      sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
      sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');
      this.setState(
          { formData: sendData }, () => {
              this.fetchSources();
          });
      this.fetchSources();
  }*/
  clearHandle() {
    this.props.form.resetFields();
    this.fetchSources({ current: 1, pageSize: this.state.paginationPageSize });
  }
  handleDetailCancel() {
    this.setState({ detailVisible: false });
  }
  handleDetailOk() {
    this.setState({ detailVisible: false });
  }
  handleReviewCancel() {
    this.setState({ reviewVisible: false });
  }
  //获取单条讲座数据信息
  fetchSingleLecture(id) {
    this.lectureId = id;
    request
      .post('/lecture/lectureInfo.do')
      .type("form")
      .send({ lectureId: id })
      .end((err, res) => {
        if (!err) {
          this.setState({
            singleLectureInfo: JSON.parse(res.text),
            pagination: {
              total: res.body.total,
              pageSize: 20
            }
          });
        }
      });
  }
  //保存审核结果
  handleSave() {
    // this.props.form.resetFields();
    // const formData = this.props.form.getFieldsValue();
    // console.log("==========formData==============");
    // console.log(formData);
    if (this.state.status === null) {
      Modal.error({
        title: 'This is an error message',
        content: '请选择审核结果！',
      });
      return;
    }
    const sendData = { lectureId: this.lectureId, remarks: this.state.textarea, status: this.state.status === 1 ? 'unpassed' : 'passed' };
    request
      .post('/lecture/lectureAudit.do')
      .type("form")
      .send(sendData)
      .end((err) => {
        if (!err) {
          this.fetchSources();
        } else {
          message.error('出错');
        }
      });
    this.setState({ reviewVisible: false });
  }
  //讲座审核
  review(record) {
    this.setState({
      textarea: '',
      status: null
    });
    this.fetchSingleLecture(record.id);
    this.setState({
      reviewVisible: true
    });
  }
  //查看讲座详情
  detail(record) {
    this.fetchSingleLecture(record.id);
    this.setState({
      detailVisible: true
    });
  }

  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    }
    const lecture_columns = [{
      title: '讲座主题',
      dataIndex: 'topic',
      key: 'topic'
    }, {
      title: '创建用户',
      dataIndex: 'hostname',
      key: 'hostname'
    }, {
      title: '讲座类别',
      dataIndex: 'catename',
      key: 'catename'
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime'
    }, {
      title: '状态',
      dataIndex: 'process',
      key: 'process',
      render: (text) => {
        let p = '';
        switch (text) {
          case 'ready':
            p = '已就绪';
            break;
          case 'rearrange':
            p = '未通过';
            break;
          case 'waiting':
            p = '待审批';
            break;
          case 'running':
            p = '正进行';
            break;
          case 'finished':
            p = '已结束';
            break;
          case 'cancelled':
            p = '已撤销';
            break;
        }
        return p;
      }
    }, {
      title: '操作',
      key: 'opt',
      dataIndex: 'process',
      render: (text, record) => {
        let p = '';
        switch (text) {
          case 'waiting':
            p = <a href='javascript:;' onClick={() => { this.review(record) }}>立即审核</a>;
            break;
          default:
            p = <a href='javascript:;' onClick={() => { this.detail(record) }}>查看详情</a>;
            break;
        }
        return p;
      }
    }];
    const RadioGroup = Radio.Group;
    const capacity = this.state.singleLectureInfo.capacityLimit ? this.state.singleLectureInfo.capacity : '不限人数';
    const price = this.state.singleLectureInfo.payNeed ? this.state.singleLectureInfo.ticketPrice : '免费';
    //catogories
    const catogories = this.state.catogories.map((v, i) => {
      return <Option key={v.id}>{v.name}</Option>
    });
    //状态
    let st;
    switch (this.state.singleLectureInfo.process) {
      case 'ready':
        st = '已就绪';
        break;
      case 'rearrange':
        st = '未通过';
        break;
      case 'waiting':
        st = '待审批';
        break;
      case 'running':
        st = '正进行';
        break;
      case 'finished':
        st = '已结束';
        break;
      case 'cancelled':
        st = '已撤销';
        break;
    }
    return (
      <section>
        <Form layout="horizontal">
          <Row type="flex" align="middle" justify="start">
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('host')(
                  <Input type="text" placeholder="用户ID或名字" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('avatar')(
                  <Input type="text" placeholder="化身名或ID" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('topic')(
                  <Input type="text" placeholder="主题" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('lectureCategory')(
                  <Select placeholder="讲座类别">
                    {catogories}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('process')(
                  <Select placeholder="待审批">
                    <Option value="all">所有</Option>
                    <Option value="ready">已就绪</Option>
                    <Option value="rearrange">未通过</Option>
                    <Option value="waiting">待审批</Option>
                    <Option value="running">正进行</Option>
                    <Option value="finished">已结束</Option>
                    <Option value="cancelled">已撤销</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={5} lg={6}>
              <FormItem>
                {getFieldDecorator('startDay')(
                  <DatePicker style={{ width: '85%' }} placeholder="起始时间" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={5} lg={6}>
              <FormItem>
                {getFieldDecorator('endDay')(
                  <DatePicker style={{ width: '85%' }} placeholder="结束时间" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={8} lg={6} className="btn-wrap">
              <Button type="primary" onClick={() => this.fetchSources()} style={{ marginRight: 10 }}><Icon type="search" />查询</Button>
              <Button type="ghost" onClick={() => this.clearHandle()} style={{ marginRight: 10 }}><Icon type="delete" />清空</Button></Col>
          </Row>
        </Form>
        <Table dataSource={this.state.lecture_data}
          columns={lecture_columns}
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
        <Modal
          key={1}
          title="立即审核"
          visible={this.state.reviewVisible}
          onCancel={this.handleReviewCancel.bind(this)}
          footer={<Button type="primary" size="large" onClick={this.handleSave.bind(this)}>保存</Button>}>
          <div className='sec1'>
            <div className='photo'>
              <img src={this.state.singleLectureInfo.iconUrl} width='210' height='210' />
            </div>
            <ul className='info1'>
              <li><strong>讲座主题：</strong>{this.state.singleLectureInfo.topic}</li>
              <li><strong>讲座类别：</strong>{this.state.singleLectureInfo.catename}</li>
              <li><strong>讲座时长：</strong>{this.state.singleLectureInfo.length}</li>
              <li><strong>讲座创建者：</strong>{this.state.singleLectureInfo.hostname}</li>
              <li><strong>化身：</strong>{this.state.singleLectureInfo.avatarname}</li>
              <li><strong>状态：</strong>{st}</li>
            </ul>
          </div>
          <div className='sec2'>
            <h3>讲座介绍</h3>
            <Input type="textarea" disabled={true} value={this.state.singleLectureInfo.remarks} rows={3} />
          </div>
          <ul className='sec3'>
            <li><strong>讲座限制人数：</strong>{capacity}</li>
            <li><strong>讲座价格：</strong>{price}</li>
            <li><strong>创建时间：</strong>{this.state.singleLectureInfo.createTime}</li>
            <li><strong>开始时间：</strong>{this.state.singleLectureInfo.startTime}</li>
          </ul>
          <Form className='sec4'>
            <FormItem label="审核结果：">
              <RadioGroup value={this.state.status} onChange={(e) => { this.setState({ status: e.target.value }) }}>
                <Radio key="a" value="1">不通过</Radio>
                <Radio key="b" value="2">通过</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="备注：">
              <Input type="textarea" value={this.state.textarea} onChange={(e) => { this.setState({ textarea: e.target.value }) }} rows={5} />
            </FormItem>
            <FormItem>
              {getFieldDecorator('lectureId', { initialValue: this.state.singleLectureInfo.id })(
                <Input style={{ display: "none" }} />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          key={2}
          title="审核详情"
          visible={this.state.detailVisible}
          onCancel={this.handleDetailCancel.bind(this)}
          onOk={this.handleDetailOk.bind(this)}>
          <div className='sec1'>
            <div className='photo'>
              <img src={this.state.singleLectureInfo.iconUrl} width='210' height='210' />
            </div>
            <ul className='info1'>
              <li><strong>讲座主题：</strong>{this.state.singleLectureInfo.topic}</li>
              <li><strong>讲座类别：</strong>{this.state.singleLectureInfo.catename}</li>
              <li><strong>讲座时长：</strong>{this.state.singleLectureInfo.length}</li>
              <li><strong>讲座创建者：</strong>{this.state.singleLectureInfo.hostname}</li>
              <li><strong>化身：</strong>{this.state.singleLectureInfo.avatarname}</li>
              <li><strong>状态：</strong>{st}</li>
            </ul>
          </div>
          <div className='sec2'>
            <h3>讲座介绍</h3>
            <Input type="textarea" disabled={true} value={this.state.singleLectureInfo.remarks} rows={3} />
          </div>
          <ul className='sec3'>
            <li><strong>讲座限制人数：</strong>{capacity}</li>
            <li><strong>讲座价格：</strong>{price}</li>
            <li><strong>创建时间：</strong>{this.state.singleLectureInfo.createTime}</li>
            <li><strong>开始时间：</strong>{this.state.singleLectureInfo.startTime}</li>
          </ul>
        </Modal>
      </section>
    );
  }
}
Lecture.propTypes = {
  form: React.PropTypes.object,
  redDot: React.PropTypes.object,
  changeRedDot: React.PropTypes.func
}
const LectureForm = Form.create({})(Lecture);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LectureForm);
