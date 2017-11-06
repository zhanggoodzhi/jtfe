import * as React from "react";
import { Table, Button, Row, Col, DatePicker, Form, Icon, Input, Select, Modal, Steps, Card, Radio } from 'antd';
import * as request from "superagent";
import { connect } from 'react-redux'
import moment from "moment";
import './qualification.less';
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
//审核流程
const Step = Steps.Step;
const array = [1, 2, 3];
const steps = array.map((item, i) => ({
  title: `Step ${i + 1}`,
}));
class Qualification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qualification_data: [],
      formData: { user: '', certifi: '', status: 'unreviewed', startDay: '', endDay: '' },
      qualification_certi: [],
      tloading: false,
      applyCertRecord: {},
      baseinfo: [],
      cert: {},
      certids: [],
      isdebug: '',
      attachs: [],
      proQualications: [],
      trainHistorys: [],
      workHistorys: [],
      reviewVisible: false,
      detailVisible: false,
      step1visible: `block`,
      step2visible: `none`,
      step3visible: `none`,
      subBtn: 'none',
      prevBtn: 'none',
      nextBtn: 'inline-block',
      appCertRecordid: '',
      detail_data: {},
      dapplyCertRecord: {},
      total: 0,
      current: 0,
      paginationCurrent: 1,
      paginationPageSize: 10
    };
  }
  componentWillMount() {
    request
      .post('/certification/queryAll.do')
      .type("form")
      .end((err, res) => {
        if (!err) {
          this.setState({ qualification_certi: JSON.parse(res.text) });
        }
      });
    this.fetchSources();
  }
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
    let nstatus = '';
    if (formFields.status === 'all') {
      nstatus = '';
    } else {
      if (!formFields.status) { nstatus = sendData.status } else { nstatus = formFields.status }
    }

    sendData.user = formFields.user;
    sendData.certifi = formFields.certifi;
    sendData.status = nstatus;
    sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');
    request
      .post('/approve/certpage.do')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        let data = JSON.parse(res.text);
        let redDot = new Object();
        for (let i in this.props.redDot) {
          redDot[i] = this.props.redDot[i];
        }
        redDot.approveRecord = data.unReviewCount;
        this.props.changeRedDot(redDot);
        if (!err) {
          this.setState({
            "qualification_data": JSON.parse(res.text).rows,
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
  /*searchHandle(){
      this.fetchSources();
  }*/
  clearHandle() {
    this.props.form.resetFields();
    this.fetchSources({ current: 1, pageSize: this.state.paginationPageSize });
  }
  refreshHandle() {
    this.fetchSources();
  }
  handleReviewCancel() {
    this.setState({ reviewVisible: false });
  }
  //通过审核
  review(record) {
    request
      .post('/approve/audit.do')
      .type("form")
      .send({ id: record.id, userid: record.user.id })
      .end((err, res) => {
        if (!err) {
          let bi = [];
          let nbaseinfo = Object.assign(JSON.parse(res.text).cert, JSON.parse(res.text).baseinfo);
          bi.push(nbaseinfo);
          this.setState({
            applyCertRecord: JSON.parse(res.text).applyCertRecord,
            baseinfo: bi,
            cert: JSON.parse(res.text).cert,
            certids: JSON.parse(res.text).certids,
            isdebug: JSON.parse(res.text).isdebug,
            reviewVisible: true,
            appCertRecordid: record.id,
            attachs: JSON.parse(res.text).attachs,
            proQualications: JSON.parse(res.text).proQualications,
            trainHistorys: JSON.parse(res.text).trainHistorys,
            workHistorys: JSON.parse(res.text).workHistorys
          });
        }
      });
  }
  //上一步
  prev() {
    let current = this.state.current;
    if (current === 0) {
      current = steps.length;
    }
    --current;
    this.cssswitch(current);
  }
  //下一步
  next() {
    let current = this.state.current + 1;
    if (current === steps.length) {
      current = 0;
    }
    this.cssswitch(current);
  }
  cssswitch(current) {
    this.setState({ current });
    switch (current) {
      case 0:
        this.setState({
          step1visible: `block`,
          step2visible: `none`,
          step3visible: `none`,
          subBtn: 'none',
          prevBtn: 'none',
          nextBtn: 'inline-block'
        });
        break;
      case 1:
        this.setState({
          step1visible: `none`,
          step2visible: `block`,
          step3visible: `none`,
          subBtn: 'none',
          prevBtn: 'inline-block',
          nextBtn: 'inline-block'
        });
        break;
      case 2:
        this.setState({
          step1visible: `none`,
          step2visible: `none`,
          step3visible: `block`,
          subBtn: 'inline-block',
          prevBtn: 'inline-block',
          nextBtn: 'none'
        });
        break;
    }
  }
  //提交按钮
  submitQualify() {
    const formFields = this.props.form.getFieldsValue();
    const sendData = {
      appCertRecordid: formFields.appCertRecordid,
      status: formFields.mstatus,
      remarks: formFields.remarks
    };
    request
      .post('/approve/save.do')
      .type("form")
      .send(formFields)
      .end((err, res) => {
        if (!err) {
          let data = JSON.parse(res.text);
          if (data.status == 1) {
            this.setState({ reviewVisible: false }, () => { this.fetchSources() });
          } else {
            Modal.error({
              title: '注意：',
              content: data.msg,
            });
          }
        } else {
          message.error('出错');
        }
      })
  }
  //查看详情 showApproveInfo.do
  detail(record) {
    request
      .post('/approve/showApproveInfo.do')
      .type("form")
      .send({ appCertRecordid: record.id })
      .end((err, res) => {
        if (!err) {
          this.setState({
            detail_data: JSON.parse(res.text),
            dapplyCertRecord: JSON.parse(res.text).applyCertRecord,
            detailVisible: true
          });
        }
      });
  }
  handleDetailCancel() {
    this.setState({ detailVisible: false });
  }
  handleOk() {
    this.setState({ detailVisible: false });
  }
  render() {
    const qualification_columns = [{
      title: 'ID',
      key: 'id',
      dataIndex: 'id'
    }, {
      title: '申请用户',
      key: 'user.name',
      dataIndex: 'user.name'
    }, {
      title: '申请证书',
      key: 'certification.name',
      dataIndex: 'certification.name'
    }, {
      title: '申请日期',
      key: 'applyTime',
      dataIndex: 'applyTime'
    }, {
      title: '审核状态',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        return text === 'unreviewed' ? '待审核' : '已受理'
      }
    }, {
      title: '操作',
      key: 'opt',
      dataIndex: 'status',
      render: (text, record) => {
        let str;
        if (text === 'unreviewed') {
          str = <a href="javascript:;" onClick={() => { this.review(record) }}>马上审核</a>;
        } else {
          str = <a href="javascript:;" onClick={() => { this.detail(record) }}>查看详情</a>
        }
        return str;
      }
    }];
    const FormItem = Form.Item;
    const Option = Select.Option;
    const RadioGroup = Radio.Group;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    }
    const certis = this.state.qualification_certi.map((v, i) => {
      return <Option value={`${v.id}`} key={v.id}>{v.name}</Option>
    });
    //审核流程
    const { current } = this.state;
    //用户的基础资料的表格列表
    const baseinfo_columns = [{
      title: '用户名',
      key: 'username',
      dataIndex: 'user.name'
    }, {
      title: '真实姓名',
      key: 'realname',
      dataIndex: 'realname'
    }, {
      title: '身份证号',
      key: 'idcard',
      dataIndex: 'idcard'
    }, {
      title: '电话',
      key: 'phone',
      dataIndex: 'phone'
    }, {
      title: '申请证书',
      key: 'name',
      dataIndex: 'name'
    }, {
      title: '国籍',
      key: 'country',
      dataIndex: 'country'
    }, {
      title: '城市',
      key: 'city',
      dataIndex: 'city'
    }];
    const professional_columns = [{
      title: '资格名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '证书编号',
      dataIndex: 'number',
      key: 'number',
    }, {
      title: '扫描件',
      key: 'scanPicUrl',
      render: (text) => { return <a href={text.scanPicUrl}>{text.scanPic}</a> }
    }];
    const experience_columns = [{
      title: '单位名称',
      dataIndex: 'organization',
      key: 'organization'
    }, {
      title: '职位职称',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '起始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }];
    const train_columns = [{
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName'
    }, {
      title: '培训机构',
      dataIndex: 'institution',
      key: 'institution',
    }, {
      title: '起始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '扫描件',
      key: 'scanPic',
      render: (text) => { return <a href={text.scanPicUrl}>{text.scanPic}</a> }
    }];
    const attachment_columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '扫描件',
      key: 'certifiFile',
      render: (text) => { return <a href={text.certifiFileUrl}>{text.certifiFile}</a> }
    }];
    const detailst = this.state.detail_data.status === 'unpassed' ? '未通过审核' : '审核通过';
    let proQua = '';
    if (this.state.proQualications) {
      proQua = <div><h4 className="account-title">专业资格证明：</h4>
        <Table columns={professional_columns} dataSource={this.state.proQualications} bordered pagination={false} /></div>
    }
    let wh = '';
    if (this.state.workHistorys) {
      wh = <div>
        <h4 className="account-title">工作经历：</h4>
        <Table columns={experience_columns} dataSource={this.state.workHistorys} bordered pagination={false} />
      </div>
    }
    let trainH = '';
    if (this.state.trainHistorys) {
      trainH = <div><h4 className="account-title">培训经历：</h4>
        <Table columns={train_columns} dataSource={this.state.trainHistorys} bordered pagination={false} /></div>
    }
    let atta = '';
    if (this.state.attachs) {
      atta = <div><h4 className="account-title">附件：</h4>
        <Table columns={attachment_columns} dataSource={this.state.attachs} bordered pagination={false} /></div>
    }
    let frontUrl;
    let backUrl;
    if (this.state.baseinfo.length != 0) {
      frontUrl = this.state.baseinfo[0].idcardFrontUrl;
      backUrl = this.state.baseinfo[0].idcardBackUrl;
    }

    return (
      <div>
        <Form layout="horizontal">
          <Row type="flex" align="middle" justify="start">
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('user')(
                  <Input type="text" placeholder="用户ID、名字" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('certifi')(
                  <Select placeholder="证书名">
                    {certis}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem>
                {getFieldDecorator('startDay')(
                  <DatePicker style={{ width: '85%' }} placeholder="起始时间" />)}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem>
                {getFieldDecorator('endDay')(
                  <DatePicker style={{ width: '85%' }} placeholder="结束时间" />)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" align="middle" justify="start">
            <Col sm={12} xs={24} md={6} lg={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="待审核">
                    <Option value="all">所有</Option>
                    <Option value="unreviewed">待审核</Option>
                    <Option value="reviewed">已受理</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={12} xs={24} md={18} lg={18} className="btn-wrap">
              <Button type="primary" onClick={() => this.fetchSources()} style={{ marginRight: 10 }}><Icon type="search" />搜索</Button>
              <Button type="ghost" onClick={() => this.clearHandle()} style={{ marginRight: 10 }}><Icon type="delete" />清空</Button></Col>
          </Row>
        </Form>
        <Table
          dataSource={this.state.qualification_data}
          columns={qualification_columns}
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
                  // paginationCurrent: current,
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
          title="资格证书申请信息审核"
          visible={this.state.reviewVisible}
          onCancel={this.handleReviewCancel.bind(this)}
          width={950}
          footer={
            <div>
              <Button key='bb' type='primary' onClick={() => { this.prev() }} style={{ display: `${this.state.prevBtn}` }}>上一步</Button>
              <Button key='cc' type='primary' onClick={() => { this.next() }} style={{ display: `${this.state.nextBtn}` }}>下一步</Button>
              <Button key='aa' type='primary' onClick={() => { this.submitQualify() }} style={{ display: `${this.state.subBtn}` }}>提交</Button>
            </div>
          }>
          <section>
            <h4 style={{ marginBottom: 15 }}>以下为用户申请服务者时上传的资料</h4>
            <Steps current={current}>
              <Step title="Step1" description="用户的基础资料" />
              <Step title="Step2" description="审核申请所需要的信息" />
              <Step title="Step3" description="确定审核结果" />
            </Steps>
            <section style={{ marginTop: 15, marginBottom: 15, display: `${this.state.step1visible}` }}>
              <h4 style={{ marginBottom: 10 }}>用户的基础资料</h4>
              <Table columns={baseinfo_columns} dataSource={this.state.baseinfo} pagination={false}
                rowKey={record => record.id} />
              <section style={{ overflow: 'hidden' }}>
                <section style={{ float: 'left', margin: 20 }}>
                  <div style={{ margin: 20 }}>身份证正面</div>
                  <img src={frontUrl} width={300} height={200} />
                </section>
                <section style={{ float: 'left', margin: 20, marginLeft: 30 }}>
                  <div style={{ margin: 20 }}>身份证反面</div>
                  <img src={backUrl} width={300} height={200} />
                </section>
              </section>
            </section>
            <section style={{ marginTop: 15, marginBottom: 15, display: `${this.state.step2visible}` }}>
              <h4 style={{ marginBottom: 10 }}>审核申请所需要的信息:</h4>
              <section>
                <Card title="证书信息" style={{ width: 900 }}>
                  <p style={{ marginBottom: 20 }}>{this.state.cert.name}:{this.state.cert.instruction}</p>
                  <div className='cert-intro-title ant-col-24 ant-col-24'>
                    <div style={{ display: 'inline-block', float: 'left' }}><img width="20px" height="20px" src="/resources/image/privilege.png" /></div>
                    <div className='charname'>证书权限</div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: `${this.state.cert.hasChar}` }} />
                </Card>
                {proQua}
                {wh}
                {trainH}
                {atta}
              </section>
            </section>
            <section style={{ marginTop: 15, marginBottom: 15, display: `${this.state.step3visible}` }}>
              <h4 style={{ marginBottom: 10 }}>确定审核结果</h4>
              <Form layout="horizontal">
                <Row type="flex" align="middle" justify="start">
                  <Col sm={18} xs={24} md={18} lg={18}>
                    <FormItem label="审核状态：" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('mstatus')(
                        <RadioGroup>
                          <Radio key="a" value={'unpassed'}>驳回</Radio>
                          <Radio key="b" value={'authenticated'}>同意</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" align="middle" justify="start">
                  <Col sm={18} xs={24} md={18} lg={18}>
                    <FormItem label="备注（如未通过的原因）：" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} >
                      {getFieldDecorator('remarks')(
                        <Input type="textarea" cols={3} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row style={{ display: 'none' }}>
                  <Col sm={18} xs={24} md={18} lg={18}>
                    <FormItem l>
                      {getFieldDecorator('appCertRecordid', { initialValue: this.state.appCertRecordid })(
                        <Input type="text" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </section>
          </section>
        </Modal>
        <Modal key={2}
          title="用户注册信息"
          visible={this.state.detailVisible}
          onCancel={this.handleDetailCancel.bind(this)}
          onOk={this.handleOk}>
          <Row>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><strong>审核者用户名：</strong></Col>
            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>{this.state.dapplyCertRecord.username}</Col>
          </Row>
          <Row>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><strong>审核的证书：</strong></Col>
            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>{this.state.dapplyCertRecord.certname}</Col>
          </Row>
          <Row>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><strong>申请时间：</strong></Col>
            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>{this.state.dapplyCertRecord.applyTime}</Col>
          </Row>
          <Row>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><strong>审核时间：</strong></Col>
            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>{this.state.detail_data.approveTime}</Col>
          </Row>
          <Row>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><strong>审核状态：</strong></Col>
            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>{detailst}</Col>
          </Row>
          <Row>
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}><strong>备注信息：</strong></Col>
            <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}>{this.state.detail_data.remarks}</Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
Qualification.propTypes = {
  form: React.PropTypes.object,
  redDot: React.PropTypes.object,
  changeRedDot: React.PropTypes.func
}
const QualificationForm = Form.create({})(Qualification);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationForm);
