import * as React from "react";
import { Table, Row, Col, Form, Input, Button, Icon, Select } from "antd";
import { Link } from "react-router";
import * as request from "superagent";
import "./Index.less";

class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      current: 1,
      endValue: null,
      endOpen: false,
      identity: [{ "id": "0", "code": "0", "name": "无数据" }],
      online: [{ "id": "0", "code": "0", "name": "无数据" }],
      qualification_certi: []
    };
  }
  componentDidMount() {
    request
      .post('/certification/queryAll.do')
      .type("form")
      .end((err, res) => {
        if (!err) {
          this.setState({ qualification_certi: JSON.parse(res.text) });
        }
      })
  }
  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }
  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  }
  reset() {
    this.props.form.resetFields();
    this.props.clearForm();
    /*this.props.updateForm(
        {
            "user": "",
            "realname": "",
            "city": ""
        }
    );*/
  }

  render() {
    const formItemLayout = {
      wrapperCol: {
        span: 21
      }
    };
    const FormItem = Form.Item;
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const Option = Select.Option;
    const certis = this.state.qualification_certi.map((v, i) => {
      return <Option value={`${v.id}`} key={v.id}>{v.name}</Option>
    });
    return (
      <Form layout="horizontal">
        <Row>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("user")(
                <Input
                  placeholder="TA号/手机号码"
                />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("realname")(
                <Input
                  placeholder="真实姓名"
                />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator("city")(
                <Input
                  placeholder="归属地"
                />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('certid')(
                <Select placeholder="证书名">
                  {certis}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" className="btn-wrap">
            <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
            <Button icon="delete" onClick={this.reset.bind(this)}>清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
FormElement.propTypes = {
  form: React.PropTypes.object,
  updateForm: React.PropTypes.func,
  clearForm: React.PropTypes.func,
  getTableData: React.PropTypes.func
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

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      pageSize: 10,
      tableData: null,
      identity: [{ "id": "0", "code": "0", "name": "无数据" }],
      online: [{ "id": "0", "code": "0", "name": "无数据" }],
      formData: {
        "user": "",
        "realname": "",
        "city": "",
        "certid": ''
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
    this.setState({ tableLoading: true });
    request
      .post('/baseinfo/page.do')
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
    this.setState({
      formData: {
        "user": "",
        "realname": "",
        "city": "",
        "certid": ''
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
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '真实姓名',
        dataIndex: 'realname'
      },
      {
        title: 'TA号',
        dataIndex: 'userid'
      },
      {
        title: '手机号码',
        dataIndex: 'phone'
      },
      {
        title: '归属地',
        dataIndex: 'city'
      },
      {
        title: (<div><Row type="flex" justify="center"><Col>证书名称</Col></Row><Row className="type-wrap" type="flex" justify="space-around"><Col>情感陪聊师</Col><Col>心理咨询师</Col><Col>职业规划师</Col><Col>其他类型</Col></Row></div>),
        dataIndex: 'certinfos',
        render: (certinfos) => {
          if (certinfos == null) {
            return '';
          }
          let arr = [false, false, false, false];
          for (let v of certinfos) {
            let i = Number(v[0]) - 1;
            arr[i] = true;
          }
          let dom = arr.map((v, i) => {
            if (v == true) {
              return <Col key={i}><Icon type="check" /></Col>
            } else {
              return <Col key={i}><Icon type="close" /></Col>
            }
          });
          return (
            <Row type="flex" justify="space-around">
              {dom}
            </Row>
          )
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          return <Link to={'/workbench/userInfo/identify/certificate?userid=' + record.userid}>查看详情</Link>
        }
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
        />
        <Table
          className="main-table"
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

export default Index;
