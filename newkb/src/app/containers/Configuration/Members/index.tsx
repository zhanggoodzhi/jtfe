import * as React from 'react';
import { FormComponentProps } from 'antd/lib/form/Form';
import { connect } from 'react-redux';
import axios from 'helper/axios';
import { Form, Input, Button, Select, Table, Modal, message, Row, Col, Avatar, Upload } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import {
  IConfiguration,
  refreshMemberList,
  insertMemberList,
  updateMemberList,
  deleteMemberList,
  refreshRoleList
} from 'configuration';

interface MembersProps {
  configuration: IConfiguration;
  refreshMemberList,
  insertMemberList,
  updateMemberList,
  deleteMemberList,
  refreshRoleList
};

interface MembersState {
  email: string;
  role: string;
  loading: boolean;
  total?;
  visible?;
  editId?;
  password?;
  editData?;
};

class Members extends React.Component<MembersProps & FormComponentProps, MembersState> {
  constructor(props) {
    super(props);
    this.state = { email: '', role: '', loading: false, visible: false, editData: {} };
  }
  private fetchRoleList() {
    axios.get('/api/member/role/list')
      .then(res => {
        if (res.data.error) {
          return;
        }
        const newRoleList = res.data.map(v => {
          return {
            id: v.id,
            remark: v.remark
          };
        });
        this.props.refreshRoleList(newRoleList);
      });
  }

  private fetchMemberList = () => {
    this.setState({
      loading: true
    });
    axios.get('/api/member/user/page', {
      params: {
        email: this.state.email,
        role: this.state.role
      }
    })
      .then(res => {
        this.setState({
          loading: false
        });
        if (res.data.error) {
          return;
        }
        this.props.refreshMemberList(res.data.data);
      });
  }
  componentWillMount() {
    const { roleList, memberList } = this.props.configuration;
    if (!roleList.length) {
      this.fetchRoleList();
    }
    if (!memberList.length) {
      this.fetchMemberList();
    }
  }

  // 查询功能
  private searchMember = () => {
    this.fetchMemberList();
  }
  private changeEmail = (e) => {
    this.setState({ email: e.target.value });
  }
  private handleRole = (value) => {
    this.setState({ role: value.join(',') });
  }
  // 点击添加成员按钮
  private addMember = () => {
    this.setState({ editId: '', visible: true });
  }
  // 保存成员
  private saveMember = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        delete (values.rePassword);
        const { editId } = this.state;
        let method, url, cb;
        if (!editId) {
          method = 'post';
          url = '/api/member/user/create';
          cb = this.props.insertMemberList;
        } else {
          method = 'put';
          url = '/api/member/user/updateSimple';
          cb = this.props.updateMemberList;
        }
        axios[method](url, {
          id: editId,
          ...values
        })
          .then(res => {
            const data = res.data;
            if (data.error) {
              message.error(data.message);
              return;
            }
            cb(data);
            this.setState({
              visible: false
            });
          });
      }
    });
  }
  // 点击编辑成员按钮
  private editMember = (record) => {
    this.setState({ editId: record.id, visible: true, editData: record });
  }
  // 清空模态框
  private clearModal = () => {
    this.setState({ editData: {} });
    // this.props.form.resetFields();
  }
  // 点击取消按钮
  private handleCancel = () => {
    this.setState({ visible: false });
  }
  // 点击删除按钮
  private deleteMember = (id) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确认删除该成员吗？',
      onOk: () => {
        return axios.delete('/api/member/user/delete', {
          params: {
            userid: id
          }
        })
          .then(res => {
            const { data } = res;
            if (!data.error) {
              this.props.deleteMemberList(data);
            } else {
              message.error(data.message);
            }
          });
      }
    });
  }
  // 校验再次输入的密码
  private handleConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次输入的密码不一致！');
    }
    callback();
  }
  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const { roleList, memberList } = this.props.configuration;
    const { visible, editId, loading, editData } = this.state;
    const roleOptions = roleList ? roleList.map(v => {
      return <Option value={v.id} key={v.id}>{v.remark}</Option>;
    }) : [];
    const columns = [{
      title: 'ID',
      dataIndex: 'id'
    }/* , {
      title: '头像',
      dataIndex: 'headicon',
      render: (text) => {
        return <Avatar icon="user" src={text} />;
      }
    } */, {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '角色类型',
      dataIndex: 'roles',
      render: (text) => {
        const roleNames = [];
        if (text.length !== 0) {
          text.map(v => {
            roleNames.push(v.name);
          });
        }
        return roleNames.join(',');
      }
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => this.editMember(record)}>编辑</a>
            <span className="ant-divider" />
            <a onClick={() => this.deleteMember(text)}>删除</a>
          </span>
        );
      }
    }];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const rolesIds = [];
    if (Object.keys(editData).length !== 0) {
      const { roles } = editData;
      if (roles) {
        roles.map(v => {
          rolesIds.push(v.id);
        });
      }
    }

    return (
      <div>
        <Form layout="inline">
          <FormItem>
            <Input placeholder="邮箱/姓名" onChange={this.changeEmail} />
          </FormItem>
          <FormItem>
            <Select
              mode="multiple"
              style={{ width: '400px' }}
              placeholder="请选择角色"
              onChange={this.handleRole}
            >
              {roleOptions}
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.searchMember}>查询</Button>
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.addMember}>添加成员</Button>
          </FormItem>
        </Form>
        <Table
          columns={columns}
          dataSource={memberList}
          style={{ padding: '10px 0' }}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <Modal
          title={editId ? '编辑成员' : '添加成员'}
          visible={visible}
          afterClose={this.clearModal}
          onCancel={this.handleCancel}
          footer={null}
        >
          <div style={{ marginBottom: 24 }}>
            <Form onSubmit={this.saveMember}>
              <FormItem
                label="姓名" {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, whitespace: true, message: '账号名不能为空！' }],
                  initialValue: editData.name
                })(
                  <Input placeholder="请输入姓名" />
                  )}
              </FormItem>
              <FormItem
                label="邮箱" {...formItemLayout}
              >
                {getFieldDecorator('email', {
                  rules: [
                    { required: true, whitespace: true, message: '邮箱不能为空！' },
                    {
                      pattern: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/, message: '邮箱不合法!'
                    }],
                  initialValue: editData.email
                })(
                  <Input placeholder="请输入邮箱" />
                  )}
              </FormItem>
              {/* <FormItem
                label="昵称" {...formItemLayout}
              >
                {getFieldDecorator('alias', {
                  rules: [{ required: true, whitespace: true, message: '昵称不能为空！' }],
                  initialValue: editData.alias
                })(
                  <Input placeholder="请输入昵称" />
                  )}
              </FormItem> */}
              <FormItem label="角色" {...formItemLayout}>
                {getFieldDecorator('roleids', {
                  rules: [
                    { required: true, whitespace: true, message: '角色不能为空！', transform: value => value.join(',') }],
                  initialValue: rolesIds
                })(
                  <Select
                    mode="multiple"
                    placeholder="请选择角色"
                  >
                    {roleOptions}
                  </Select>
                  )}
              </FormItem>
              <FormItem label="登录密码" {...formItemLayout}
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, whitespace: true, message: '密码不能为空！' }],
                  initialValue: editData.password
                })(
                  <Input placeholder="请输入密码" />
                  )}
              </FormItem>
              {/* <FormItem
                label="确认密码" {...formItemLayout}
              >
                {getFieldDecorator('rePassword', {
                  rules: [{
                    required: true, whitespace: true, message: '确认密码不能为空！'
                  }, {
                    validator: this.handleConfirmPassword
                  }],
                  initialValue: editData.password
                })(
                  <Input placeholder="请再次输入密码" />
                  )}
              </FormItem>
               <FormItem
                label="手机号" {...formItemLayout}
              >
                {getFieldDecorator('mobile', {
                  rules: [
                    { required: true, whitespace: true, message: '手机号不能为空！' },
                    { pattern: /^1[34578]\d{9}$/, message: '手机号不合法！' }],
                  initialValue: editData.mobile
                })(
                  <Input placeholder="请输入手机号" />
                  )}
              </FormItem> */}
              <FormItem
                label="QQ" {...formItemLayout}
                style={{ display: editId ? 'none' : '' }}
              >
                {getFieldDecorator('qq', {
                  rules: [
                    { required: false, whitespace: true, message: 'QQ号不能为空！' },
                    { pattern: /^[1-9][0-9]{4,}$/, message: 'QQ号不合法！' }],
                  initialValue: editData.qq
                })(
                  <Input placeholder="请输入QQ号" />
                  )}
              </FormItem>
              <FormItem>
                <Row justify={'end'} gutter={10} type={'flex'}>
                  <Col>
                    <Button type="primary" onClick={this.handleCancel} key="modalCancel">取消</Button>
                  </Col>
                  <Col>
                    <Button type="primary" htmlType="submit" key="modalSave">保存</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
export default connect<any, any, any>
  (
  state => ({ configuration: state.configuration }),
  dispatch => ({
    refreshMemberList: data => dispatch(refreshMemberList(data)),
    insertMemberList: data => dispatch(insertMemberList(data)),
    updateMemberList: data => dispatch(updateMemberList(data)),
    deleteMemberList: data => dispatch(deleteMemberList(data)),
    refreshRoleList: data => dispatch(refreshRoleList(data))
  })
  )(Form.create()(Members));
