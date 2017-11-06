import * as React from "react";
import { Table, DatePicker, Form, Select, Input, Button, Row, Col, Badge } from "antd";
import { Link } from "react-router";
import * as request from "superagent";
import { Img } from '../../global/utils';
import moment from "moment";
import "./Account.less";

class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  componentWillMount() {
    request
      .post('/account/queryType.do')
      .type("form")
      .send({
        "type": "account_type"
      })
      .end((err, res) => {
        this.setState({ "identity": JSON.parse(res.text) });
      });
    request
      .post('/account/queryType.do')
      .type("form")
      .send({
        "type": "online_status"
      })
      .end((err, res) => {
        this.setState({ "online": JSON.parse(res.text) });
      });
  }

  reset() {
    this.props.form.resetFields();
    this.props.clearForm();
  }
  //导出为excel
  excel() {
    const formFields = this.props.form.getFieldsValue();
    let href = `/account/exportExcel.do?1=1`;
    if (formFields.genderName) {
      href += `&genderName=${formFields.genderName}`
    }
    if (formFields.keyword) {
      href += `&keyword=${formFields.keyword}`
    }
    if (formFields.onlineStatus) {
      href += `&onlineStatus=${formFields.onlineStatus}`
    }
    if (formFields.roleType) {
      href += `&roleType=${formFields.roleType}`
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

    const identity = this.state.identity.map((v) => {
      if (!v.id) {
        return <Option value='' key={'null'}>{v.name}</Option>;
      }
      return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
    });

    const online = this.state.online.map((v) => {
      if (!v.id) {
        return <Option value='' key='null'>{v.name}</Option>;
      }
      return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
    });
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    };
    const getFieldDecorator = this.props.form.getFieldDecorator;
    //导出excel按钮显示
    let excelBtn = '';
    if (this.props.ifExcel) {
      excelBtn = <Button type="ghost" onClick={this.excel.bind(this)}>导出为excel</Button>
    }
    return (
      <Form layout="horizontal">
        <Row>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("keyword")(
                <Input
                  id="account"
                  placeholder="用户昵称/TA号/手机号码"
                />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("roleType")(
                <Select
                  placeholder="用户身份"
                >
                  {identity}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("onlineStatus")(
                <Select
                  placeholder="在线状态"
                >
                  {online}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("genderName")(
                <Select
                  placeholder="性别"
                >
                  <Option value="6001">男</Option>
                  <Option value="6002">女</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem>
              {getFieldDecorator("startDay")(
                <DatePicker
                  style={{ width: '85%' }}
                  disabledDate={this.disabledStartDate.bind(this)}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="注册时间从"
                  onChange={this.onStartChange.bind(this)} />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem>
              {getFieldDecorator("endDay")(
                <DatePicker
                  style={{ width: '85%' }}
                  disabledDate={this.disabledEndDate.bind(this)}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="至"
                  onChange={this.onEndChange.bind(this)} />
              )}
            </FormItem>
          </Col>
          <Col sm={24} xs={24} md={14} lg={11} className="btn-wrap">
            <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
            <Button icon="delete" type="ghost" onClick={this.reset.bind(this)}>清空</Button>
            {excelBtn}
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
  ifExcel: React.PropTypes.bool
};

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
    }, 200)
  }
})(FormElement);

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      current: 1,
      tableLoading: false,
      tableData: null,
      identity: [{ "id": "0", "code": "0", "name": "无数据" }],
      online: [{ "id": "0", "code": "0", "name": "无数据" }],
      formData: {
        "keyword": "",
        "startDay": "",
        "endDay": ""
      },
      ifExcel: true
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
    sendData.roleType = sendData.roleType === 'null' ? null : sendData.roleType;
    sendData.onlineStatus = sendData.onlineStatus === 'null' ? null : sendData.onlineStatus;
    sendData.gender = sendData.genderName === 'null' ? null : sendData.genderName;
    sendData.startDay = sendData.startDay === '' ? null : moment(sendData.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = sendData.endDay === '' ? null : moment(sendData.endDay).format('YYYY-MM-DD HH:mm:ss');
    delete sendData.genderName;

    request
      .post('/account/queryList')
      .type("form")
      .send(sendData)
      .end((err, res) => {
        if (!err) {
          if (JSON.parse(res.text).total) {
            this.setState({ ifExcel: true })
          }
          this.setState({
            tableData: JSON.parse(res.text),
            tableLoading: false
          });
        }

      });
  }
  clearForm() {
    this.setState({
      formData: {
        "keyword": "",
        "roleType": "",
        "onlineStatus": "",
        "genderName": "",
        "startDay": "",
        "endDay": ""
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

  render() {
    const columns = [
      {
        title: '头像',
        dataIndex: 'headUrl',
        render: (headUrl) => {
          return <Img className="head-icon" src={headUrl} />;
        },
        height: 51
      },
      {
        title: '昵称',
        dataIndex: 'name',
        render: (name, record) => {
          return <Link to={'/workbench/userInfo/account/detail?id=' + record.id}>{name}</Link>
        },
        height: 51
      },
      {
        title: 'TA号',
        dataIndex: 'id',
        height: 51
      },
      {
        title: '手机号码',
        dataIndex: 'phoneNo',
        height: 51
      },
      {
        title: '归属地',
        dataIndex: 'phoneNoLocation',
        height: 51
      },
      {
        title: '性别',
        dataIndex: 'genderName',
        height: 51
      },
      {
        title: '用户身份',
        dataIndex: 'roleTypeName',
        height: 51
      },
      {
        title: '注册时间',
        dataIndex: 'regTime',
        height: 51
      },
      {
        title: '状态',
        dataIndex: 'onlineStatusName',
        render: (onlineStatusName) => {
          switch (onlineStatusName) {
            case '在线': return (<Badge status="success" text={onlineStatusName} />);
            case '离线': return (<Badge status="default" text={onlineStatusName} />);
            case '忙碌': return (<Badge status="processing" text={onlineStatusName} />);
            case '离开': return (<Badge status="error" text={onlineStatusName} />);
            case '隐身': return (<Badge status="warning" text={onlineStatusName} />);
          }
        },
        height: 51
      }
    ];

    const pagination = {
      total: this.state.tableData ? this.state.tableData.total : 1,
      showTotal: () => `符合条件的条目： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
      showSizeChanger: true,
      pageSize: this.state.pageSize,
      current: this.state.current,
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pageSize: pageSize
        });
      }
    };
    const data = this.state.tableData ? this.state.tableData.rows : [];

    return (
      <div className="user-list">
        <SearchForm
          updateForm={this.updateForm.bind(this)}
          getTableData={this.getTableData.bind(this)}
          clearForm={this.clearForm.bind(this)}
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
Account.contextTypes = {
  router: React.PropTypes.object
};

export default Account;
