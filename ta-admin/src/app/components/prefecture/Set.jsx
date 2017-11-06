import * as React from "react";
import { message, DatePicker, Radio, Table, Select, Badge, InputNumber, Row, Col, Button, Checkbox, Icon, Tabs, Upload, Modal, Form, Input } from "antd";
import * as request from "superagent";
import { imgAjax, formAjax } from '../global/utils';
import "./Set.less";
import moment from 'moment';
import RobotManage from './RobotManage';
class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.formData = new FormData();
    // this.addArr = [];
    this.file = null;
    this.state = {
      checked: [],
      ifedit: false,
      visible: false,
      status: 0,//0为新增，1为编辑
      charAll: [
      ],
      // addArr: [],
      tableData: [],
      ajaxData: {
        name: '',
        id: '',
        signature: '',
        introduction: '',
        iconUrl: '',
        enterWay: '',
        isverify: ''
      }
    };
  }

  componentWillMount() {
    if (window.location.href.split('=').length == 1) {
      this.setState({
        tableData: [],
        ifedit: true
      });
      return;
    }
    const id = window.location.href.split('=')[1];
    request
      .post('/prefecture/prefecture.do')
      .type("form")
      .send({
        id: id
      })
      .end((err, res) => {
        let data = JSON.parse(res.text);
        let newData = this.state.ajaxData;
        newData.name = data.name;
        newData.id = data.id;
        newData.signature = data.signature;
        newData.isverify = data.isverify;
        newData.introduction = data.introduction;
        newData.iconUrl = data.iconUrl;
        newData.enterWay = data.enterWay;
        newData.auditEnter = data.auditEnter;
        newData.codeEnter = data.codeEnter;
        newData.straightEnter = data.straightEnter;
        this.setState({
          ajaxData: newData,
          imageUrl: this.state.ajaxData.iconUrl,
        });
      });
    request
      .post('/avatar/queryAvatarAll')
      .type("form")
      .send({

      })
      .end((err, res) => {
        let data = JSON.parse(res.text);
        this.setState({
          charAll: data
        });
      });
    this.getTableData();
  }

  getTableData() {
    request
      .post('/charPrefecture/queryByPrefecture.do')
      .type("form")
      .send({
        prefectureId: window.location.href.split('=')[1],
      })
      .end((err, res) => {
        let data = JSON.parse(res.text);
        this.setState({
          tableData: data
        });
      });
  }
  showModal() {
    this.setState({
      checked: [],
      visible: true,
    });
  }
  handleOk() {
    request
      .post('/charPrefecture/add.do')
      .type("form")
      .send({
        prefectureId: window.location.href.split('=')[1],
        ids: this.state.checked.join(',')
      })
      .end((err) => {
        if (err) {
          message.error('出错')
        } else {
          this.setState({
            visible: false
          });
          this.getTableData();
        }
      });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  previewHandleCancel() {
    this.setState({
      priviewVisible: false,
    });
  }
  saveForm() {
    this.formData = new FormData();
    let data = this.state.ajaxData;
    if (!data.name || !data.signature || !data.introduction || !data.enterWay || !data.iconUrl) {
      message.error('请输入所有必填项');
      return;
    }
    this.formData.append("info_file", this.file);
    this.formData.append('name', data.name);
    this.formData.append('id', data.id === undefined ? '' : data.id);
    this.formData.append('signature', data.signature);
    this.formData.append('isverify', data.isverify == 'true' ? true : false);
    this.formData.append('introduction', data.introduction);
    this.formData.append('enterWay', data.enterWay == '' ? null : data.enterWay);
    imgAjax.bind(this)('确定要保存吗？', '/prefecture/update.do', this.formData, () => {
      this.setState({
        ifedit: !this.state.ifedit
      });
    });
    // request
    //     .post('/prefecture/update.do')
    //     .send(this.formData)
    //     .end((err) => {
    //         if (err) {
    //             message.error('出错')
    //         } else {
    //             this.setState({
    //                 ifedit: !this.state.ifedit
    //             });
    //             message.success('保存成功');
    //         }
    //     });
  }
  beforeUpload(file) {
    let newData = this.state.ajaxData;
    newData.iconUrl = window.URL.createObjectURL(file);
    this.setState({
      ajaxData: newData
    });
    this.file = file;
  }
  addItem(value) {
    this.setState({
      checked: value
    });
  }
  deleteItem(id) {
    request
      .post('/charPrefecture/delete.do')
      .type('form')
      .send({
        id: id
      })
      .end((err) => {
        if (err) {
          message.error('出错')
        } else {
          this.getTableData();
          message.success('删除成功');
        }
      });
  }
  checkboxChange(value) {
    if (!this.state.ifedit) {
      return;
    }
    let newData = this.state.ajaxData;
    newData.enterWay = value.join(',');
    this.setState({
      ajaxData: newData
    });
  }
  updateAjaxData(name, e) {
    let value = e.target.value.toString();
    let newData = this.state.ajaxData;
    newData[name] = value;
    this.setState({
      ajaxData: newData
    });
  }
  handleChange(info) {
    if (info.file.status === 'done') {
      this.setState({
        // Get this url from response in real world.
        imageUrl: this.state.ajaxData.iconUrl,
      });
    }
  }
  render() {
    const RadioGroup = Radio.Group;
    const FormItem = Form.Item;
    const CheckboxGroup = Checkbox.Group;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '角色类型',
        dataIndex: 'username',
      },
      {
        title: '角色性别',
        dataIndex: 'gender',
        render: (gender) => {
          switch (gender) {
            case 6001: return '男';
            case 6002: return '女';
            default: return '未知';
          }
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          return <a className="table-delete" onClick={() => { this.deleteItem(record.id) }}>删除</a>
        }
      }
    ]
    const rest = [];
    let flag = null;
    for (let i = 0; i < this.state.charAll.length; i++) {
      flag = false;
      for (let j = 0; j < this.state.tableData.length; j++) {
        if (this.state.charAll[i].id == this.state.tableData[j].userid) {
          flag = true
        }
      }
      if (flag == false) {
        rest.push(this.state.charAll[i]);
      }
    }

    const modalOptions = rest.map((v) => {
      return {
        label: v.name,
        value: v.id
      }
    });
    const data = this.state.ajaxData;
    const imageUrl = this.state.imageUrl;
    const checkValue = data.enterWay ? data.enterWay.split(',') : [];
    let options = [
      { label: '入驻审核', value: 'audit', disabled: true },
      { label: '入驻码', value: 'entercode', disabled: true },
      { label: '直接入驻', value: 'straight', disabled: true },
    ];
    if (this.state.ifedit) {
      for (let v of options) {
        v.disabled = false;
      }
      if (checkValue.indexOf('audit') !== -1) {
        options[2].disabled = true;
      }
      if (checkValue.indexOf('entercode') !== -1) {
        options[2].disabled = true;
      }
      if (checkValue.indexOf('straight') !== -1) {
        options[0].disabled = true;
        options[1].disabled = true;
      }
    }
    let other = null;
    if (window.location.href.split('=').length !== 1) {
      other = (
        <div className="wrap role-type-wrap">
          <h3>专区角色类别: </h3>
          <div className='content'>
            <Row>
              <Col span="24" className="btn-wrap">
                <Button type="primary" icon="plus" onClick={this.showModal.bind(this)}>添加角色类别</Button>
                <Button icon="reload" onClick={this.getTableData.bind(this)}>刷新</Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={Object.prototype.toString.call(this.state.tableData) === '[object Array]' ? this.state.tableData : []}
              pagination={false}
              rowKey={record => record.id}
            />
          </div>
        </div>
      )
    }
    return (
      <div className="edit-main">
        <Modal title="添加角色类别" visible={this.state.visible} closable={false}
          onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <FormItem className="add-form-item-wrap">
              <Row type="flex" justify="center">
                <Col span={18} offset={6}>
                  <CheckboxGroup value={this.state.checked} onChange={(value) => { this.addItem(value) }} options={modalOptions} />
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Modal>
        <div className="wrap info-wrap">
          <h3>专区基本信息: </h3>
          <Row className='info'>
            <Col span={6}>
              <div className="row-left" id="components-upload-demo-inplace">
                <h5 className="ant-form-item-required">专区LOGO：</h5>
                <Upload
                  beforeUpload={this.beforeUpload.bind(this)}
                  className="avatar-uploader"
                  name="avatar"
                  showUploadList={false}
                  action="/empty/file"
                  onChange={this.handleChange.bind(this)}
                >
                  {
                    imageUrl ?
                      <img src={imageUrl} role="presentation" className="avatar" /> :
                      <Icon type="plus" className="avatar-uploader-trigger" />
                  }
                </Upload>
              </div>
            </Col>
            <Col span={18}>
              <Form layout="horizontal" className="row-right">
                <FormItem
                  required
                  label="专区名称"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Input placeholder="请输入专区名称" disabled={!this.state.ifedit} value={data.name} onChange={(e) => { this.updateAjaxData('name', e) }} />
                </FormItem>
                <FormItem
                  required
                  label="专区宣传语"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Input type="textarea" rows={6} disabled={!this.state.ifedit} placeholder="请输入专区宣传语" value={data.signature} onChange={(e) => { this.updateAjaxData('signature', e) }} />
                </FormItem>
                <FormItem
                  required
                  label="专区简介"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                  <Input type="textarea" rows={6} disabled={!this.state.ifedit} placeholder="请输入专区简介" value={data.introduction} onChange={(e) => { this.updateAjaxData('introduction', e) }} />
                </FormItem>
              </Form>
            </Col>
          </Row>
        </div>
        <div className="wrap server-type-wrap">
          <h3 className="ant-form-item-required">专区验证方式: </h3>
          <div className='info'>
            <RadioGroup value={data.isverify.toString()} disabled={!this.state.ifedit} onChange={(value) => { this.updateAjaxData('isverify', value) }} >
              <Radio value="true">需要验证</Radio>
              <Radio value="false">无需验证</Radio>
            </RadioGroup>
          </div>
        </div>
        <div className="wrap server-type-wrap">
          <h3 className="ant-form-item-required">服务者专区入驻方式: </h3>
          <div className='info'>
            <CheckboxGroup options={options} disabled={!this.state.ifedit} value={checkValue} onChange={(value) => { this.checkboxChange(value) }} />
          </div>
        </div>
        <Row type="flex" justify="center"><Button type="primary" size="large" onClick={() => { this.state.ifedit ? this.saveForm() : this.setState({ ifedit: !this.state.ifedit }) }}>{this.state.ifedit ? '保存' : '编辑'}</Button></Row>
        {other}
      </div>
    );
  }
}
Edit.propTypes = {
  setLoading: React.PropTypes.func
};
class CMFormElement extends React.Component {
  constructor(props) {
    super(props);
    this.id = null;
    this.state = {
      ajaxData: {
        verifiNumber: 1,
        type: "onetime",
        startTime: moment(),
        invalidTime: moment(new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000 * 30))
      },
      startValue: null,
      endValue: null,
      endOpen: false
    };
  }

  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }
  componentWillMount() {
    if (window.location.href.split('=').length == 1) {
      return;
    }
    this.id = window.location.href.split('=')[1];
  }
  handleOk() {
    let data = this.state.ajaxData;
    request
      .post('/verification/add.do')
      .type("form")
      .send({
        prefectureId: this.id,
        type: data.type,
        verifiNumber: data.verifiNumber,
        startTime: data.startTime.format('YYYY-MM-DD'),
        invalidTime: data.invalidTime.format('YYYY-MM-DD')

      })
      .end((err, res) => {
        let data = JSON.parse(res.text)
        if (data.issuccess == false) {
          Modal.error({
            title: '出错',
            content: data.msg,
          });
        } else {
          this.props.getTableData({ current: this.props.current });
          this.setState({
            visible: false,
          });
        }
      });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  updateAjaxData(name, value) {
    let newData = this.state.ajaxData;
    newData[name] = value;
    this.setState({
      ajaxData: newData
    });
  }

  reset() {
    this.props.form.resetFields();
    this.props.updateForm(
      {
        "type": "",
        "isInvaild": ""
      }, () => {
        this.props.getTableData();
      }
    );
  }
  excel() {
    let type = this.props.form.getFieldValue('type') === 'null' ? null : this.props.form.getFieldValue('type');
    let isInvaild = this.props.form.getFieldValue('isInvaild') === 'null' ? null : this.props.form.getFieldValue('isInvaild');
    let href = '/verification/exportExcel.do?';
    if (type) {
      href += 'type=' + type;
    }
    if (isInvaild) {
      href += '&isInvaild=' + isInvaild;
    }
    window.location.href = href;
  }
  changeRadio(value) {
    if (value == "onetime") {
      let newData = this.state.ajaxData;
      newData.startTime = moment();
      newData.verifiNumber = 1;
      newData.invalidTime = moment(new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000 * 30));
      this.setState({
        ajaxData: newData,
      });
    } else {
      let newData = this.state.ajaxData;
      newData.verifiNumber = 1;
      newData.startTime = moment();
      newData.invalidTime = moment(new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000 * 30 * 3));
      this.setState({
        ajaxData: newData
      });
    }
    this.updateAjaxData('type', value)
  }
  render() {
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const Option = Select.Option;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };
    const data = this.state.ajaxData;
    const getFieldDecorator = this.props.form.getFieldDecorator;
    let _number = null;
    if (this.state.ajaxData.type == 'expdate') {
      _number = { max: 1 };
    }
    const ifExcel = this.props.ifExcel ? <Button type="primary" onClick={this.excel.bind(this)}>导出为excel</Button> : null;
    return (
      <Form layout="horizontal">
        <Modal className="zz-modal" maskClosable={false} title="添加验证码" visible={this.state.visible}
          onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              required
              label="验证码类型"
            >
              <RadioGroup defaultValue="onetime" onChange={(e) => { this.changeRadio(e.target.value) }}>
                <Radio value="onetime">一次性验证码</Radio>
                <Radio value="expdate">有效期验证码</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              key="2"
              {...formItemLayout}
              required
              label="生效时间"
            >
              <DatePicker value={data.startTime} onChange={(date) => { this.updateAjaxData('startTime', date) }} />
            </FormItem>
            <FormItem
              key="3"
              {...formItemLayout}
              required
              label="失效时间"
            >
              <DatePicker value={data.invalidTime} onChange={(date) => { this.updateAjaxData('invalidTime', date) }} />
            </FormItem>
            <FormItem
              label="验证码数量"
              {...formItemLayout}
              required
            >
              <InputNumber value={this.state.ajaxData.verifiNumber} min={1} {..._number} defaultValue={1} onChange={(value) => { this.updateAjaxData('verifiNumber', value) }} />
            </FormItem>
          </Form>
        </Modal>
        <Row>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("type")(
                <Select
                  placeholder="请选择验证码类型"
                >
                  <Option value="onetime">一次性验证码</Option>
                  <Option value="expdate">有效期验证码</Option>
                  <Option value="null">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("isInvaild")(
                <Select
                  placeholder="请选择验证码状态"
                >
                  <Option value="true">失效</Option>
                  <Option value="false">未失效</Option>
                  <Option value="null">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} xs={24} md={16} lg={12} className="btn-wrap">
            <Button type="primary" icon="search" onClick={this.props.getTableData}>查询</Button>
            <Button icon="delete" onClick={this.reset.bind(this)}>清空</Button>
            <Button type="primary" icon="plus" onClick={this.showModal.bind(this)}>添加验证码</Button>
            {ifExcel}
          </Col>
        </Row>
      </Form>
    );
  }
}
CMFormElement.propTypes = {
  form: React.PropTypes.object,
  updateForm: React.PropTypes.func,
  getTableData: React.PropTypes.func,
  current: React.PropTypes.number,
  ifExcel: React.PropTypes.bool
};
let CMtimer = null;

const CMSearchForm = Form.create({
  onFieldsChange: (props, fields) => {
    if (CMtimer) {
      clearTimeout(CMtimer);
      CMtimer = null;
    }
    CMtimer = setTimeout(() => {
      for (let i in fields) {
        const obj = {};
        obj[fields[i].name] = fields[i].value;
        props.updateForm(obj);
      }
    }, 200)
  }
})(CMFormElement);

class CodeManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ifExcel: true,
      current: 1,
      tableLoading: false,
      tableData: null,
      formData: {

      }
    };
  }
  getTableData(pagination) {
    const sendData = Object.assign({
      page: 1,
      rows: 20,
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
    this.setState({
      tableLoading: true,
    });
    sendData.type = sendData.type === 'null' ? null : sendData.type;
    sendData.isInvaild = sendData.isInvaild === 'null' ? null : sendData.isInvaild;
    request
      .post('/verification/page.do')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        let data = JSON.parse(res.text);
        let ifExcel = true;
        if (data.total == 0) {
          ifExcel = false;
        }
        this.setState({
          ifExcel: ifExcel,
          tableData: data,
          tableLoading: false
        });
      });
  }
  componentDidMount() {
    this.getTableData();
  }
  updateForm(data, cb) {
    const cloneFormData = Object.assign({}, this.state.formData, data);
    this.setState({
      formData: cloneFormData
    }, () => {
      cb ? cb() : ''
    });
  }
  delete(id) {
    formAjax.bind(this)('确定要删除吗？', '/verification/del.do', { id: id }, () => { this.getTableData({ current: this.state.current }); });
  }
  render() {
    const columns = [
      {
        title: '验证码ID',
        dataIndex: 'id'
      },
      {
        title: '验证码',
        dataIndex: 'code'
      },
      {
        title: '验证码状态',
        dataIndex: 'isInvaild',
        render: (isInvaild) => {
          switch (isInvaild) {
            case true: return (<Badge status="error" text={'失效'} />);
            case false: return (<Badge status="success" text={'未失效'} />);
          }
        }
      },
      {
        title: '验证码类型',
        dataIndex: 'type',
        render: (type) => {
          if (type == 'onetime') {
            return '一次性验证码';
          } else {
            return '有效期验证码';
          }
        }
      },
      {
        title: '生效日期',
        dataIndex: 'startTime'
      },
      {
        title: '失效日期',
        dataIndex: 'invalidTime'
      },
      {
        title: '操作',
        render: (text, record) => {
          return <a onClick={() => { this.delete(record.id) }}>删除</a>
        }
      }
    ];
    const pagination = {
      total: this.state.tableData ? this.state.tableData.total : 1,
      showTotal: () => `符合条件的条目： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
      showSizeChanger: true,
      defaultPageSize: 10,
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pagination: {
            current: 1,
            pageSize: pageSize
          }
        });
      },
      current: this.state.current
    };
    const data = this.state.tableData ? this.state.tableData.rows : [];

    return (
      <div className="user-list">
        <CMSearchForm
          updateForm={this.updateForm.bind(this)}
          getTableData={this.getTableData.bind(this)}
          current={this.state.current}
          ifExcel={this.state.ifExcel}
        />
        <Table
          loading={this.state.tableLoading}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={this.getTableData.bind(this)}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}

class ECMFormElement extends React.Component {
  constructor(props) {
    super(props);
    this.id = null;
    this.state = {
      ajaxData: {
        verifiNumber: 1,
        type: "onetime",
        startTime: moment(),
        invalidTime: moment(new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000 * 30))
      },
      startValue: null,
      endValue: null,
      endOpen: false
    };
  }

  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }
  componentWillMount() {
    if (window.location.href.split('=').length == 1) {
      return;
    }
    this.id = window.location.href.split('=')[1];
  }
  handleOk() {
    let data = this.state.ajaxData;
    request
      .post('/enter/add.do')
      .type("form")
      .send({
        prefectureId: this.id,
        type: data.type,
        number: data.verifiNumber,
        startTime: data.startTime.format('YYYY-MM-DD'),
        invalidTime: data.invalidTime.format('YYYY-MM-DD')
      })
      .end((err, res) => {
        let data = JSON.parse(res.text)
        if (data.status === -1) {
          Modal.error({
            title: '出错',
            content: data.msg,
          });
        } else {
          this.props.getTableData({ current: this.props.current });
          this.setState({
            visible: false,
          });
        }
      });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  updateAjaxData(name, value) {
    let newData = this.state.ajaxData;
    newData[name] = value;
    this.setState({
      ajaxData: newData
    });
  }

  reset() {
    this.props.form.resetFields();
    this.props.updateForm(
      {
        "isInvaild": ""
      }, () => {
        this.props.getTableData();
      }
    );
  }

  excel() {
    let isInvaild = this.props.form.getFieldValue('isInvaild') === 'null' ? null : this.props.form.getFieldValue('isInvaild');
    let href = '/enter/exportExcel.do?';

    if (isInvaild) {
      href += '&isInvaild=' + isInvaild;
    }
    window.location.href = href;
  }
  changeRadio(value) {
    if (value == "onetime") {
      let newData = this.state.ajaxData;
      newData.startTime = moment();
      newData.verifiNumber = 1;
      newData.invalidTime = moment(new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000 * 30));
      this.setState({
        ajaxData: newData,
      });
    } else {
      let newData = this.state.ajaxData;
      newData.verifiNumber = 1;
      newData.startTime = moment();
      newData.invalidTime = moment(new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000 * 30 * 3));
      this.setState({
        ajaxData: newData
      });
    }
    this.updateAjaxData('type', value)
  }
  render() {
    const FormItem = Form.Item;
    const Option = Select.Option;
    const RadioGroup = Radio.Group;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };
    let _number = null;
    if (this.state.ajaxData.type == 'expdate') {
      _number = { max: 1 };
    }
    const data = this.state.ajaxData;
    const ifExcel = this.props.ifExcel ? <Button type="primary" onClick={this.excel.bind(this)}>导出为excel</Button> : null;
    const getFieldDecorator = this.props.form.getFieldDecorator;
    return (
      <Form layout="horizontal">
        <Modal className="zz-modal" maskClosable={false} title="添加入驻码" visible={this.state.visible}
          onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              required
              label="入驻码类型"
            >
              <RadioGroup defaultValue="onetime" onChange={(e) => { this.changeRadio(e.target.value) }}>
                <Radio value="onetime">一次性入驻码</Radio>
                <Radio value="expdate">有效期入驻码</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              key="2"
              {...formItemLayout}
              required
              label="生效时间"
            >
              <DatePicker value={data.startTime} onChange={(date) => { this.updateAjaxData('startTime', date) }} />
            </FormItem>
            <FormItem
              key="3"
              {...formItemLayout}
              required
              label="失效时间"
            >
              <DatePicker value={data.invalidTime} onChange={(date) => { this.updateAjaxData('invalidTime', date) }} />
            </FormItem>
            <FormItem
              label="入驻码数量"
              {...formItemLayout}
              required
            >
              <InputNumber value={this.state.ajaxData.verifiNumber} min={1} {..._number} defaultValue={1} onChange={(value) => { this.updateAjaxData('verifiNumber', value) }} />
            </FormItem>
          </Form>
        </Modal>
        <Row>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("type")(
                <Select
                  placeholder="请选择入驻码类型"
                >
                  <Option value="onetime">一次性入驻码</Option>
                  <Option value="expdate">有效期入驻码</Option>
                  <Option value="null">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("isInvaild")(
                <Select
                  placeholder="请选择入驻码状态"
                >
                  <Option value="true">已失效</Option>
                  <Option value="false">未失效</Option>
                  <Option value="null">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} xs={24} md={16} lg={12} className="btn-wrap">
            <Button type="primary" icon="search" onClick={this.props.getTableData}>查询</Button>
            <Button icon="delete" onClick={this.reset.bind(this)}>清空</Button>
            <Button type="primary" icon="plus" onClick={this.showModal.bind(this)}>添加入驻码</Button>
            {ifExcel}
          </Col>
        </Row>
      </Form>
    );
  }
}
ECMFormElement.propTypes = {
  form: React.PropTypes.object,
  updateForm: React.PropTypes.func,
  getTableData: React.PropTypes.func,
  current: React.PropTypes.number,
  ifExcel: React.PropTypes.bool
};

let ECMtimer = null;

const ECMSearchForm = Form.create({
  onFieldsChange: (props, fields) => {
    if (ECMtimer) {
      clearTimeout(ECMtimer);
      ECMtimer = null;
    }
    ECMtimer = setTimeout(() => {
      for (let i in fields) {
        const obj = {};
        obj[fields[i].name] = fields[i].value;
        props.updateForm(obj);
      }
    }, 200)
  }
})(ECMFormElement);

class EntryCodeManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ifExcel: true,
      current: 1,
      tableLoading: false,
      tableData: null,
      formData: {

      }
    };
  }
  getTableData(pagination) {
    const sendData = Object.assign({
      page: 1,
      rows: 20,
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
    this.setState({
      tableLoading: true,
    });
    sendData.isInvaild = sendData.isInvaild === 'null' ? null : sendData.isInvaild;
    sendData.type = sendData.type === 'null' ? null : sendData.type;
    request
      .post('/enter/page.do')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        let data = JSON.parse(res.text);
        let ifExcel = true;
        if (data.total == 0) {
          ifExcel = false;
        }
        this.setState({
          ifExcel: ifExcel,
          tableData: data,
          tableLoading: false
        });
      });
  }
  componentDidMount() {
    this.getTableData();
  }
  updateForm(data, cb) {
    const cloneFormData = Object.assign({}, this.state.formData, data);
    this.setState({
      formData: cloneFormData
    }, () => {
      if (cb) {
        cb();
      }
    });
  }
  render() {
    const columns = [
      {
        title: '入驻码ID',
        dataIndex: 'id'
      },
      {
        title: '入驻码',
        dataIndex: 'code'
      },
      {
        title: '入驻码状态',
        dataIndex: 'isInvaild',
        render: (isInvaild) => {
          switch (isInvaild) {
            case true: return (<Badge status="error" text={'已失效'} />);
            case false: return (<Badge status="success" text={'未失效'} />);
          }
        }
      },
      {
        title: '入驻码类型',
        dataIndex: 'type',
        render: (type) => {
          if (type == 'onetime') {
            return '一次性入驻码';
          } else {
            return '有效期入驻码';
          }
        }
      },
      {
        title: '生效日期',
        dataIndex: 'startTime'
      },
      {
        title: '失效日期',
        dataIndex: 'invalidTime'
      }
    ];
    const pagination = {
      total: this.state.tableData ? this.state.tableData.total : 1,
      showTotal: () => `符合条件的条目： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
      showSizeChanger: true,
      defaultPageSize: 10,
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pagination: {
            current: 1,
            pageSize: pageSize
          }
        });
      },
      current: this.state.current
    };
    /*const pagination = {
        total: this.state.tableData ? this.state.tableData.total : 1,
        pageSize: 20,
        current: this.state.current
    };*/
    const data = this.state.tableData ? this.state.tableData.rows : [];

    return (
      <div className="user-list">
        <ECMSearchForm
          updateForm={this.updateForm.bind(this)}
          getTableData={this.getTableData.bind(this)}
          current={this.state.current}
          ifExcel={this.state.ifExcel}
        />
        <Table
          loading={this.state.tableLoading}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={this.getTableData.bind(this)}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}


class Set extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      iconStatus: [],
      tableData: null,
      identity: [{ "id": "0", "code": "0", "name": "无数据" }],
      online: [{ "id": "0", "code": "0", "name": "无数据" }],
      formData: {
        "keyword": "",
        "phoneNo": ""
      }
    };
  }
  render() {
    const TabPane = Tabs.TabPane;
    let other = <TabPane tab="编辑专区" key="1"><Edit setLoading={this.props.setLoading} /></TabPane>;
    if (window.location.href.split('=').length !== 1) {
      other = [<TabPane tab="编辑专区" key="1"><Edit setLoading={this.props.setLoading} /></TabPane>
        , <TabPane tab="验证码管理" key="2"><CodeManage setLoading={this.props.setLoading} /></TabPane>,
      <TabPane tab="入驻码管理" key="3"><EntryCodeManage setLoading={this.props.setLoading} /></TabPane>,
      <TabPane tab="机器人管理" key="4"><RobotManage /></TabPane>
      ]
    }
    return (
      <div className="user-list">
        <Tabs type="card">
          {other}
        </Tabs>
      </div>
    );
  }
}
Set.propTypes = {
  setLoading: React.PropTypes.func,
};
export default Set;
