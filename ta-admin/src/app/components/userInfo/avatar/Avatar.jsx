import * as React from 'react';
import { Modal, Form, Row, Col, Table, DatePicker, Select, Input, Button } from 'antd';
import * as request from 'superagent';
import { formAjax, Img } from '../../global/utils';
import moment from 'moment';
import './Avatar.less';

class AllRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
      tableLoading: false,
      ajaxData: []
    };
  }
  componentWillReceiveProps(props) {
    if (props.actorid === this.props.actorid) {
      return;
    }
    let sendData = {
      page: 1,
      rows: 10,
      order: 'desc',
      sort: 'id',
      actorid: props.actorid
    };
    this.setState({ tableLoading: true });
    request
      .post('/avatar/queryAvatarListByActor')
      .type('form')
      .send(sendData)
      .end((err, res) => {
        this.setState({
          ajaxData: JSON.parse(res.text),
          tableLoading: false,
          current: 1
        });
      });
  }
  componentDidMount() {
    this.getTableData();
  }

  getTableData(pagination) {
    let sendData = {
      page: 1,
      rows: 10,
      order: 'desc',
      sort: 'id',
      actorid: this.props.actorid
    };
    console.log(sendData);
    if (pagination && pagination.current) {
      sendData.page = pagination.current;
      sendData.rows = pagination.pageSize;
    }
    this.setState({ tableLoading: true });
    request
      .post('/avatar/queryAvatarListByActor')
      .type('form')
      .send(sendData)
      .end((err, res) => {
        this.setState({
          ajaxData: JSON.parse(res.text),
          tableLoading: false,
          current: pagination ? pagination.current : 1
        });
      });
  }

  addToBlack(id) {
    formAjax.bind(this)('确定要禁用吗？', '/avatar/deleteAvatarById', {
      avatarid: id
    }, () => {
      this.getTableData({ current: this.state.current, pageSize: this.state.pageSize });
    });
  }
  render() {
    const pagination = {
      total: this.state.ajaxData ? this.state.ajaxData.total : 1,
      showTotal: () => `符合条件的条目： ${this.state.ajaxData ? this.state.ajaxData.total : 1} 条`,
      showSizeChanger: true,
      pageSize: this.state.pageSize,
      current: this.state.current,
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pageSize: pageSize
        });
      }
    };

    const data = this.state.ajaxData.rows;
    const iconUrl = 'http://image.ta.jintongsoft.cn/portrait/100_100/';
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '头像',
        dataIndex: 'headIcon',
        render: (iconId) => {
          let val;
          if (iconId) {
            val = iconId;
          } else {
            val = 'd5ad078df7e1d09ca580786488873236';
          }
          return <img className="head-icon" src={`${iconUrl}${val}.jpg`} />;
        },
      },
      {
        title: '角色昵称',
        dataIndex: 'name'
      },
      {
        title: '性别',
        dataIndex: 'prototype.genderName'
      },
      {
        title: '角色类别',
        dataIndex: 'prototype.name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime'
      },
      {
        title: '状态',
        dataIndex: 'onlineName'
      },
      {
        title: '创建者昵称',
        dataIndex: 'actor.name'
      },
      {
        title: '操作',
        width: 150,
        render: (text, record) => {
          return <Row className="td-btn-wrap"><Col xs={12}><a className="toBlack" onClick={() => { this.addToBlack(record.id); }}>禁用</a></Col></Row>;
        }
      },

    ];

    return <Table
      loading={this.state.tableLoading}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      onChange={this.getTableData.bind(this)}
      rowKey="id"
    />;
  }
}
AllRole.propTypes = {
  actorid: React.PropTypes.number,
  clearForm: React.PropTypes.func,
  setLoading: React.PropTypes.func
};
class FormElement extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      online: [],
      type: []
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

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }
  componentWillMount() {
    request
      .post('/account/queryType.do')
      .type('form')
      .send({
        'type': 'online_status'
      })
      .end((err, res) => {
        this.setState({ 'online': JSON.parse(res.text) });
      });
    request
      .post('/account/queryType.do')
      .type('form')
      .send({
        'type': 'user_character'
      })
      .end((err, res) => {
        this.setState({ 'type': JSON.parse(res.text) });
      });
  }

  reset() {
    this.props.form.resetFields();
    this.props.clearForm();
  }
  //导出为excel
  excel() {
    const formFields = this.props.form.getFieldsValue();
    let href = `/avatar/exportExcel.do?1=1`;
    if (formFields.actor) {
      href += `&actor=${formFields.actor}`;;
    }
    if (formFields.character) {
      href += `&character=${formFields.character}`;;
    }
    if (formFields.keyword) {
      href += `&keyword=${formFields.keyword}`;;
    }
    if (formFields.onlineStatus) {
      href += `&onlineStatus=${formFields.onlineStatus}`;;
    }
    if (formFields.startDay) {
      href += `&startDay=${formFields.startDay}`;;
    }
    if (formFields.endDay) {
      href += `&sendDay=${formFields.endDay}`;;
    }
    window.location.href = href;
  }
  render() {
    const FormItem = Form.Item;

    const Option = Select.Option;

    const online = this.state.online.map((v) => {
      if (!v.id) {
        return <Option value="null" key="null">{v.name}</Option>;
      }
      return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
    });
    const type = this.state.type.map((v) => {
      if (!v.id) {
        return <Option value="null" key="null">{v.name}</Option>;
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
      excelBtn = <Button type="ghost" onClick={this.excel.bind(this)}>导出为excel</Button>;;
    }
    return (
      <Form layout="horizontal">
        <Row>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('keyword')(
                <Input
                  placeholder="角色昵称"
                />
              )}
            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('actor')(
                <Input
                  placeholder="创建者TA号/手机号/昵称"
                />
              )}

            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={6} lg={6}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('onlineStatus')(
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
              {getFieldDecorator('character')(
                <Select
                  placeholder="角色类别"
                >
                  {type}
                </Select>
              )}

            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem>
              {getFieldDecorator('startDay')(
                <DatePicker
                  style={{ width: '85%' }}
                  disabledDate={this.disabledStartDate.bind(this)}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="创建时间从"
                  onChange={this.onStartChange.bind(this)} />
              )}

            </FormItem>
          </Col>
          <Col sm={12} xs={24} md={4} lg={6}>
            <FormItem>
              {getFieldDecorator('endDay')(
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
          <Col sm={24} xs={24} md={16} lg={12} className="btn-wrap">
            <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
            <Button icon="delete" onClick={this.reset.bind(this)}>清空</Button>
            <Button icon="plus" type="primary" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit');; }}>添加服务者</Button>
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
  getTableData: React.PropTypes.func,
  clearForm: React.PropTypes.func,
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
      console.log(fields);
      for (let i in fields) {
        const obj = {};
        obj[fields[i].name] = fields[i].value;
        props.updateForm(obj);
      }
    }, 200);
  }
})(FormElement);

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actorid: null,
      pageSize: 10,
      current: 1,
      tableLoading: false,
      tableData: null,
      online: [{ 'id': '0', 'code': '0', 'name': '无数据' }],
      visible: false,
      formData: {
        'keyword': '',
        'startDay': '',
        'endDay': ''
      },
      ifExcel: true
    };
  }
  showModal() {
    this.setState({
      visible: true,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  getTableData(pagination) {
    let sendData = Object.assign({
      page: 1,
      rows: 10,
      order: 'desc',
      sort: 'id'
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
    sendData.startDay = sendData.startDay === '' ? null : moment(sendData.startDay).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDay = sendData.endDay === '' ? null : moment(sendData.endDay).format('YYYY-MM-DD HH:mm:ss');
    request
      .post('/avatar/queryAvatarList')
      .type('form')
      .send(sendData)
      .end((err, res) => {
        if (!err) {
          if (JSON.parse(res.text).total) {
            this.setState({ ifExcel: true });
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
        'keyword': '',
        'actor': '',
        'onlineStatus': '',
        'character': '',
        'startDay': '',
        'endDay': ''
      }
    }, () => {
      this.getTableData({ current: 1, pageSize: this.state.pageSize });
    });
  }
  addToBlack(id) {
    formAjax.bind(this)('确定要禁用吗？', '/avatar/deleteAvatarById', { avatarid: id }, () => {
      this.getTableData({ current: this.state.current });
    });
  }
  updateForm(data) {
    const cloneFormData = Object.assign({}, this.state.formData, data);
    this.setState({
      formData: cloneFormData
    });
  }
  renderAllRole(text, record) {
    this.setState({
      actorid: record.actor.id
    });
    this.showModal();
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
        title: '头像',
        dataIndex: 'headIconUrl',
        render: (headIconUrl) => {
          return <Img className="head-icon" src={headIconUrl} />;
        },
      },
      {
        title: '角色昵称',
        dataIndex: 'name'
      },
      {
        title: '性别',
        dataIndex: 'prototype.genderName'
      },
      {
        title: '角色类别',
        dataIndex: 'prototype.name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime'
      },
      {
        title: '状态',
        dataIndex: 'onlineName'
      },
      {
        title: '创建者昵称',
        dataIndex: 'actor.name'
      },
      {
        title: '操作',
        render: (text, record) => {
          return <Row className="td-btn-wrap"><Col xs={12}><a onClick={() => { this.renderAllRole(text, record); }} className="check">所有角色</a></Col><Col xs={10}><a style={{ marginLeft: 15 }} className="toBlack" onClick={() => { this.addToBlack(record.id); }}>禁用</a></Col></Row>;
        }
      },

    ];
    const pagination = {
      total: this.state.tableData ? this.state.tableData.total : 1,
      showTotal: () => `符合条目的数量： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
      showSizeChanger: true,
      defaultPageSize: 10,
      current: this.state.current,
      pageSize: this.state.pageSize,
      onShowSizeChange: (current, pageSize) => {
        this.setState({
          pageSize: pageSize
        });
      }
    };

    const data = this.state.tableData ? this.state.tableData.rows : [];
    return (
      <div className="user-list">
        <Modal title="所有角色" visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName="all-role-wrap">
          <AllRole actorid={this.state.actorid} setLoading={this.props.setLoading} />
        </Modal>
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
          rowKey="id"
        />
      </div>
    );
  }
}

Avatar.propTypes = {
  setLoading: React.PropTypes.func,
};

export default Avatar;
