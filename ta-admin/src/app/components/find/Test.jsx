import * as React from "react";
import { Switch, message, Upload, Icon, Table, Radio, Modal, Form, Select, Input, Button, Row, Col } from "antd";
import * as request from "superagent";
import { formAjax } from '../global/utils';
import WangEditor from "wangeditor";
import "./Test.less";
class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.ifAdd = null;
    this.editor1 = null;
    this.editor2 = null;
    this.editor3 = null;
    this.formData = new FormData();
    this.file1 = null;
    this.file2 = null;
    this.state = {
      ajaxData: {}
    };
  }
  updateAjaxData(name, value) {
    console.log(value);
    let newData = this.state.ajaxData;
    newData[name] = value;
    this.setState({
      ajaxData: newData
    });
  }

  beforeUpload1(file) {
    let newData = this.state.ajaxData;
    newData.banner = window.URL.createObjectURL(file);
    this.setState({
      ajaxData: newData
    });
    this.file1 = file;
  }

  beforeUpload2(file) {
    let newData = this.state.ajaxData;
    newData.icon = window.URL.createObjectURL(file);
    this.setState({
      ajaxData: newData
    });
    this.file2 = file;

  }
  getDetailData(id) {
    if (!id) {
      this.ifAdd = true;
      this.editor1.$txt.html('');
      this.editor2.$txt.html('');
      this.setState({
        ajaxData: {
          banner: '',
          icon: '',
          id: '',
          label: "",
          name: "",
          summary: '',
          type: 101,
          typeName: "",
          active: true
        }
      });
    } else {
      this.ifAdd = false;
      request
        .post('/test/detail')
        .type("form")
        .send({
          id: id
        })
        .end((err, res) => {
          let data = JSON.parse(res.text);
          this.initWangEditorData(data.summary, data.guide);
          this.setState({
            ajaxData: data
          });
        });
    }
  }

  save() {
    const data = this.state.ajaxData;
    this.formData = new FormData();
    let typeName = '';
    switch (data.type) {
      case 101: typeName = '心理测试'; break;
      case 102: typeName = '职业测试'; break;
      case 103: typeName = '儿童心理'; break;
      case 104: typeName = '情感测试'; break;
    }
    const test = {
      id: data.id ? data.id : '',
      label: data.label,
      name: data.name,
      summary: this.editor1.$txt.html(),
      guide: this.editor2.$txt.html(),
      type: data.type,
      typeName: typeName,
      active: data.active
    }
    if (!test.label || !test.name || !test.summary || !test.guide || !this.file1 && !data.banner || !this.file2 && !data.icon) {
      message.error('请输入所有必填项');
      return;
    }
    this.formData.append("bannerfile", this.file1);
    this.formData.append("iconfile", this.file2);
    for (let i in test) {
      this.formData.append(i, test[i]);
    }
    request
      .post('/test/save')
      .send(this.formData)
      .end((err, res) => {
        if (err) {
          message.error('出错')
        } else {
          let data = JSON.parse(res.text);
          if (data.status == 1) {
            message.success(data.msg);
            this.props.handleCancel();
            this.props.getTableData({ current: this.props.current, pageSize: this.props.pageSize });
          } else {
            message.error(data.msg);
          }
        }
      });
  }
  initWangEditorData(str1, str2) {
    this.editor1.$txt.html(str1);
    this.editor2.$txt.html(str2);
  }
  initWangEditor() {
    this.editor1 = new WangEditor('edit1');
    this.editor1.config.menus = $.map(WangEditor.config.menus, function (item) {//去掉地图
      if (item === 'location') {
        return null;
      }
      if (item === 'img') {
        return null;
      }
      if (item === 'video') {
        return null;
      }
      return item;
    });

    this.editor1.create();

    this.editor2 = new WangEditor('edit2');
    this.editor2.config.menus = $.map(WangEditor.config.menus, function (item) {
      if (item === 'location') {
        return null;
      }
      if (item === 'img') {
        return null;
      }
      if (item === 'video') {
        return null;
      }
      return item;
    });
    this.editor2.create();
  }

  componentDidMount() {
    this.initWangEditor();
  }

  render() {
    const RadioGroup = Radio.Group;
    const FormItem = Form.Item;
    const data = this.state.ajaxData;
    const banner = data.banner;
    const icon = data.icon;
    return (
      <div className="edit-container">
        <Row type="flex" justify="center" id="components-upload-demo-inplace">
          <Col span={18}>
            <Form layout="horizontal">
              <FormItem
                required
                label="广告"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Upload
                  beforeUpload={this.beforeUpload1.bind(this)}
                  className="avatar-uploader"
                  name="fileUpload"
                  showUploadList={false}
                  action="/empty/file"
                >
                  {
                    banner ?
                      <img src={banner} role="presentation" className="avatar" /> :
                      <Icon type="plus" className="avatar-uploader-trigger" />
                  }
                </Upload>
              </FormItem>
              <FormItem
                required
                label="Logo"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Upload
                  beforeUpload={this.beforeUpload2.bind(this)}
                  className="avatar-uploader"
                  name="fileUpload"
                  showUploadList={false}
                  action="/empty/file"
                >
                  {
                    icon ?
                      <img src={icon} role="presentation" className="avatar" /> :
                      <Icon type="plus" className="avatar-uploader-trigger" />
                  }
                </Upload>
              </FormItem>
              <FormItem
                required
                label="名称"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Input placeholder="请输入名称" value={data.name} onChange={(e) => { this.updateAjaxData('name', e.target.value) }} />
              </FormItem>
              <FormItem
                required
                label="标签"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Input placeholder="请输入标签" value={data.label} onChange={(e) => { this.updateAjaxData('label', e.target.value) }} />
              </FormItem>
              <FormItem
                required
                label="接口"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Input disabled={true} value={`/test/${data.label}`} />
              </FormItem>
              <FormItem
                required
                label="类别"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <RadioGroup value={data.type} onChange={(e) => { this.updateAjaxData('type', e.target.value) }}>
                  <Radio value={101}>心理测试</Radio>
                  <Radio value={102}>职业测试</Radio>
                  <Radio value={103}>儿童心理</Radio>
                  <Radio value={104}>情感测试</Radio>
                </RadioGroup>
              </FormItem>
              <Row className="mt">简介：</Row>
              <Row className="mt edit1-wrap">
                <Col id="edit1" style={{ height: 400 }}>
                </Col>
              </Row>
              <Row className="mt">指导语：</Row>
              <Row className="mt edit2-wrap">
                <Col id="edit2" style={{ height: 400 }}>
                </Col>
              </Row>
              <FormItem
                className="mt"
                required
                label="是否可用"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
              >
                <Switch checked={data.active} checkedChildren="是" unCheckedChildren="否" onChange={(value) => { this.updateAjaxData('active', value) }} />
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

Edit.propTypes = {
  id: React.PropTypes.number,
  getTableData: React.PropTypes.func,
  handleCancel: React.PropTypes.func,
  current: React.PropTypes.number,
  pageSize: React.PropTypes.number
};

class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: -1,
      startValue: null,
      endValue: null,
      endOpen: false,
      identity: [{ "id": "0", "code": '0', "name": "无数据" }],
      online: [{ "id": "0", "code": '0', "name": "无数据" }]
    };
  }

  disabledStartDate(startValue) {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.valueOf() > this.state.endValue.valueOf();
  }

  disabledEndDate(endValue) {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.valueOf() <= this.state.startValue.valueOf();
  }

  onChange(field, value) {
    this.setState({
      [field]: value,
    });
  }

  onStartChange(value) {
    this.onChange('startValue', value);
  }

  onEndChange(value) {
    this.onChange('endValue', value);
  }

  reset() {
    this.props.form.resetFields();
    this.props.clearForm();

  }

  render() {

    const FormItem = Form.Item;

    const Option = Select.Option;

    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    };
    const getFieldDecorator = this.props.form.getFieldDecorator;

    return (
      <Form layout="horizontal">
        <Row>
          <Col sm={12} xs={24} md={5} lg={5}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("keyword")(
                <Input
                  id="account"
                  placeholder="测试问卷名"
                />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={5}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("type")(
                <Select
                  placeholder="所有类别"
                >
                  <Option value="101">心理测试</Option>
                  <Option value="102">职业测试</Option>
                  <Option value="103">儿童心理</Option>
                  <Option value="104">情感测试</Option>
                  <Option value="null">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={5}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("active")(
                <Select
                  placeholder="所有状态"
                >
                  <Option value="true">可用</Option>
                  <Option value="false">不可用</Option>
                  <Option value="null">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={11} lg={9} className="btn-wrap">
            <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
            <Button icon="delete" onClick={this.reset.bind(this)}>清空</Button>
            <Button type="primary" icon="plus" onClick={() => { this.props.add() }}>新增</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

FormElement.contextTypes = {
  router: React.PropTypes.object
};
FormElement.propTypes = {
  form: React.PropTypes.object,
  updateForm: React.PropTypes.func,
  clearForm: React.PropTypes.func,
  getTableData: React.PropTypes.func,
  add: React.PropTypes.func
};

let timer = null;

const SearchForm = Form.create({
  onFieldsChange: (props, fields) => {
    console.log(fields);
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
    }, 200)
  }
})(FormElement);

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
      tableLoading: false,
      tableData: null,
      identity: [{ "id": "0", "code": "0", "name": "无数据" }],
      online: [{ "id": "0", "code": "0", "name": "无数据" }],
      formData: {
        "keyword": ""
      }
    };
  }

  getTableData(pagination) {
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
    this.setState({
      tableLoading: true,
    });
    sendData.type = sendData.type === 'null' ? null : sendData.type;
    sendData.active = sendData.active === 'null' ? null : sendData.active;

    request
      .post('/test/list')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        this.setState({
          tableData: JSON.parse(res.text),
          tableLoading: false
        });
      });
  }
  clearForm() {
    /*this.props.updateForm(
        {
            "keyword": "",
            "type": "",
            "active": ""
        }
    );*/
    this.setState({
      formData: {
        "keyword": "",
        "type": "",
        "active": ""
      }
    }, () => {
      this.getTableData({ current: 1, pageSize: this.state.pageSize });
    });
  }
  updateForm(data) {
    const cloneFormData = Object.assign({}, this.state.formData, data);
    this.setState({
      formData: cloneFormData
    });
  }

  componentDidMount() {
    this.getTableData();
  }

  edit(id) {
    this.setState({
      visible: true
    }, () => {
      this.refs.edit.getDetailData(id);
    });
  }
  handleOk() {
    this.refs.edit.save();
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  add() {
    this.setState({
      visible: true
    }, () => {
      this.refs.edit.getDetailData();
    });
  }
  dele(id) {
    formAjax.bind(this)('您确定要删除吗？', '/test/del.do', { id: id }, () => {
      this.getTableData({ current: this.state.current, pageSize: this.state.pageSize });
    });
  }
  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '测试问卷名称',
        dataIndex: 'name'
      },
      {
        title: '标志',
        dataIndex: 'label'
      },
      {
        title: '类别',
        dataIndex: 'typeName'
      },
      {
        title: '是否可用',
        dataIndex: 'active',
        render: (active) => {
          return active == true ? '可用' : '不可用';
        }
      },
      {
        title: '操作',
        dataIndex: 'onlineStatusName',
        render: (text, record) => {
          return <Row className="td-btn-wrap"><Col xs={12}><a onClick={() => { this.edit(record.id) }}>基本信息管理</a></Col><Col xs={12}><a onClick={() => { this.dele(record.id) }}>删除</a></Col></Row>
        }
      }
    ];
    const pagination = {
      total: this.state.tableData ? this.state.tableData.total : 1,
      showTotal: () => `符合条件的条目： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
      showSizeChanger: true,
      pageSize: this.state.pageSize,
      defaultPageSize: 10,
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pageSize: pageSize
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
        <Modal title="编辑测试" visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName='test-edit-wrap'>
          <Edit
            ref="edit"
            handleCancel={this.handleCancel.bind(this)}
            getTableData={this.getTableData.bind(this)}
            current={this.state.current}
            pageSize={this.state.pageSize}
          />
        </Modal>
        <SearchForm
          updateForm={this.updateForm.bind(this)}
          getTableData={this.getTableData.bind(this)}
          clearForm={this.clearForm.bind(this)}
          add={this.add.bind(this)}
        />
        <Table
          loading={this.state.tableLoading}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={this.getTableData.bind(this)}
          rowKey={record => record.id}
        />
      </div >
    );
  }
}
Test.contextTypes = {
  router: React.PropTypes.object
};

export default Test;
