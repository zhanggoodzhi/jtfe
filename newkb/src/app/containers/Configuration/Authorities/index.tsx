import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'helper/axios';
import { Modal, Button, Icon, Col, Form, Input, message, Row, Select, Table, Tree, TreeSelect } from 'antd';
import { stringify } from 'qs';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';
import qs from 'qs';
import HeightHolder from 'components/HeightHolder';
import * as style from './style.less';
import {
  IConfiguration,
  refreshRoleList,
  insertRoleList,
  updateRoleList,
  deleteRoleList,
  refreshMemberList
} from 'configuration';
interface AuthoritiesProps {
  configuration: IConfiguration;
  refreshRoleList;
  updateRoleList;
  insertRoleList;
  deleteRoleList;
  refreshMemberList;
  form;
};

interface AuthoritiesState {
  roleSelected: string;
  authSelected: any;
  memberSelected: any;
  memberLoading: boolean;
  roleLoading: boolean;
  /**
   *
   * 权限是否在编辑状态
   * @type {boolean}
   * @memberof AuthoritiesState
   */
  ifEdit: boolean;
  ifModalAdd: boolean;
  visible: boolean;
  keyword: string;
};

class Authorities extends React.Component<AuthoritiesProps, AuthoritiesState> {
  constructor(prop) {
    super(prop);
    this.state = {
      ifModalAdd: true,
      memberLoading: false,
      roleLoading: false,
      roleSelected: '',
      authSelected: [],
      memberSelected: [],
      ifEdit: false,
      visible: false,
      keyword: ''
    };
  }
  private currentRoleId = null;
  private selectRole = (selectedRowKeys, selectedRows) => {
    if (this.state.ifEdit) {
      return;
    }
    const id = selectedRowKeys[0];
    this.setState({
      roleSelected: id
    });
    axios.get('/api/member/role/privileges', {
      params: {
        roleid: id
      }
    })
      .then(res => {
        const { data } = res;
        if (data.error) {
          return;
        }
        const ids = data.map(v => {
          return v.id;
        });
        this.setState({
          authSelected: ids
        });
      });
  }

  private saveRole = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        let method;
        let url;
        let cb;
        if (this.state.ifModalAdd) {
          method = 'post';
          url = '/api/member/role/create';
          cb = this.props.insertRoleList;
        } else {
          method = 'put';
          url = '/api/member/role/update';
          cb = this.props.updateRoleList;
        }
        const formData = this.props.form.getFieldsValue();
        axios[method](url, {
          name: formData.type,
          remark: formData.desc,
          id: this.currentRoleId,
          userids: this.state.memberSelected
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
  private clearModal = () => {
    this.props.form.setFieldsValue({
      type: '',
      desc: ''
    });
    this.setState({
      keyword: '',
      memberSelected: []
    });
    this.currentRoleId = null;
  }
  private handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  componentWillMount() {
    if (!this.props.configuration.roleList.length) {
      this.fetchRoleList();
    }
    if (!this.props.configuration.memberList.length) {
      this.fetchMemberList();
    }
  }

  private fetchRoleList() {
    this.setState({
      roleLoading: true
    });
    axios.get('/api/member/role/list')
      .then(res => {
        this.setState({
          roleLoading: false
        });
        if (res.data.error) {
          return;
        }
        const newRoleList = res.data.map(v => {
          return {
            id: v.id,
            name: v.name,
            remark: v.remark,
            userids: v.userids
          };
        });
        this.props.refreshRoleList(newRoleList);
      });
  }

  private fetchMemberList = () => {
    this.setState({
      memberLoading: true,
      memberSelected: []
    });
    axios.get('/api/member/user/page', {
      params: {
        username: this.state.keyword
      }
    })
      .then(res => {
        this.setState({
          memberLoading: false
        });
        if (res.data.error) {
          return;
        }
        const newMemberList = res.data.data.map(v => {
          return {
            id: v.id,
            name: v.name,
            alias: v.alias
          };
        });
        this.props.refreshMemberList(newMemberList);
      });
  }

  private delete = (id) => {
    if (this.state.ifEdit) {
      message.error('请先保存编辑后的权限');
      return;
    }
    Modal.confirm({
      title: '温馨提示',
      content: '确认删除该角色吗？',
      onOk: () => {
        return axios.delete('/api/member/role/delete', {
          params: {
            roleid: id
          }
        })
          .then(res => {
            const { data } = res;
            if (!data.error) {
              this.props.deleteRoleList(data);
            } else {
              message.error(data.message);
            }
          });
      }
    });
  }

  private deleteMemberSelectedItem = (id) => {
    let newMemberSelected = [...this.state.memberSelected];
    newMemberSelected = newMemberSelected.filter(v => {
      return v !== id;
    });
    this.setState({
      memberSelected: newMemberSelected
    });
  }

  private edit = (rowData) => {
    this.currentRoleId = rowData.id;
    this.setState({
      ifModalAdd: false,
    });
    axios.get('/api/member/user/list', {
      params: {
        userids: rowData.userids.join(',')
      }
    })
      .then(res => {
        const data = res.data;
        const newMemberSelected = data.map(v => {
          return v.id;
        });
        this.props.form.setFieldsValue({
          type: rowData.name,
          desc: rowData.remark
        });
        this.setState({
          memberSelected: newMemberSelected,
          visible: true
        });
      });
  }
  private turnEdit = () => {
    if (!this.state.roleSelected) {
      message.error('请先选择一个角色')
      return;
    }
    this.setState({ ifEdit: true });
  }

  private save = () => {
    const { roleSelected, authSelected } = this.state;

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.post('/api/member/privilege/modify', qs.stringify({
      roleid: roleSelected,
      privileges: authSelected.join(',')
    }))
      .then(res => {
        const data = res.data;
        if (data.error) {
          message.error(data.message);
          return;
        }
        message.success('编辑权限成功！');
        this.setState({ ifEdit: false });
      });
  }

  public render(): JSX.Element {
    const { authSelected, ifEdit, roleSelected, memberSelected, ifModalAdd } = this.state;
    const { roleList, memberList, privilegeList } = this.props.configuration;
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    // const data = [{
    //   id: '1',
    //   name: 'John Brown',
    //   age: 32,
    //   address: 'New York No. 1 Lake Park',
    // }, {
    //   id: '2',
    //   name: 'Jim Green',
    //   age: 42,
    //   address: 'London No. 1 Lake Park',
    // }, {
    //   id: '3',
    //   name: 'Joe Black',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
    // }];
    const columns = [{
      title: '角色',
      dataIndex: 'name',
    }, {
      title: '简介',
      dataIndex: 'remark',
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => { this.edit(record); }}>编辑</a>
            <span className="ant-divider" />
            <a onClick={() => { this.delete(text); }}>删除</a>
          </span>
        );
      }
    }];
    const modalRoleList = memberSelected.map(v => {
      let item;
      memberList.forEach(sv => {
        if (sv.id === v) {
          item = sv;
        }
      });
      return item;
    });
    const modalRolecolumns = [{
      title: '账户名',
      dataIndex: 'name',
    }, {
      title: '昵称',
      dataIndex: 'alias',
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => { this.deleteMemberSelectedItem(text); }}>删除</a>
          </span>
        );
      }
    }];
    const memberColumns = [{
      title: '账户名',
      dataIndex: 'name',
    }, {
      title: '昵称',
      dataIndex: 'alias',
    }];
    const authColumns = [{
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '权限',
      dataIndex: 'remark',
    }];
    return (
      <Row
        style={{
          position: 'relative',
          margin: '-15px -12px',
        }}
      >
        <Col
          style={{
            paddingRight: '16px',
          }}
          span={12}
        >
          <div style={{ borderRight: '1px solid #eee' }}>
            <div className={style.Header}>
              <h5>角色列表</h5>
              <Button onClick={() => { this.setState({ visible: true, ifModalAdd: true }); }} type="primary" style={{ float: 'right' }} >添加角色</Button>
            </div>
            <HeightHolder
              className={style.Content}
              scroll={true}
            >
              <Table
                loading={this.state.roleLoading}
                rowKey="id"
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: [roleSelected],
                  onChange: this.selectRole
                }}
                columns={columns}
                dataSource={roleList}
                pagination={false} />
            </HeightHolder>
          </div>
        </Col>
        <div className={style.Middle}>
          <Icon className={style.Arrow} type="right" />
        </div>
        <Col
          span={12}
          style={{
            paddingLeft: '16px'
          }}
        >
          <div style={{ borderLeft: '1px solid #eee' }}>
            <div className={style.Header}>
              <h5>角色权限</h5>
              {
                ifEdit ?
                  <Button onClick={this.save} type="primary" style={{ float: 'right' }} >保存</Button>
                  :
                  <Button onClick={this.turnEdit} type="primary" style={{ float: 'right' }} >编辑权限</Button>
              }
            </div>
            <HeightHolder
              className={style.Content}
              scroll={true}
            >
              <Table
                rowClassName={() => { return ifEdit ? '' : 'disabled'; }}
                rowKey="id"
                columns={authColumns}
                rowSelection={{
                  selectedRowKeys: authSelected,
                  type: 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    if (ifEdit) {
                      this.setState({
                        authSelected: selectedRowKeys
                      });
                    }
                  }
                }}
                dataSource={privilegeList}
                pagination={false} />
            </HeightHolder>
          </div>
        </Col>
        <Modal
          className={style.DisabledModal}
          title={ifModalAdd ? '添加角色' : '编辑角色'}
          visible={this.state.visible}
          onOk={this.saveRole}
          width={1000}
          afterClose={this.clearModal}
          onCancel={this.handleCancel}
        >
          <div style={{ marginBottom: 24 }}>
            <Form layout="inline">
              <FormItem
                label="角色类型"
              >
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请输入角色类型!' }],
                })(
                  <Input placeholder="请输入角色类型" />
                  )}
              </FormItem>
              <FormItem
                label="简介"
              >
                {getFieldDecorator('desc', {
                  rules: [{ required: true, message: '请输入角色简介!' }],
                })(
                  <Input placeholder="请输入角色简介" />
                  )}
              </FormItem>
              <FormItem
                label="姓名/部门/邮箱"
              >
                {getFieldDecorator('keyword')(
                  <Input onChange={(e) => { this.setState({ keyword: e.target.value }) }} placeholder="请输入姓名/部门/邮箱" />
                )}
              </FormItem>
              <FormItem>
                <Button onClick={this.fetchMemberList} style={{ float: 'right' }} type="primary">查询</Button>
              </FormItem>
            </Form>
          </div>
          <Row>
            <Col span={12} style={{ paddingRight: '16px' }}>
              <h5 style={{ padding: '10px 0' }}>角色成员</h5>
              <Table
                rowKey="id"
                columns={modalRolecolumns}
                dataSource={modalRoleList}
                locale={{
                  emptyText: '该角色目前没有成员,请从右侧所有成员列表中选择添加到该角色中'
                }}
                pagination={false} />
            </Col>
            <div className={style.Middle} style={{ background: 'white' }}>
              <Icon className={style.Arrow} type="left" />
            </div>
            <Col span={12} style={{ paddingLeft: '16px' }}>
              <h5 style={{ padding: '10px 0' }}>所有成员</h5>
              <Table
                rowKey="id"
                loading={this.state.memberLoading}
                columns={memberColumns}
                rowSelection={{
                  selectedRowKeys: memberSelected,
                  type: 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                      memberSelected: selectedRowKeys
                    });
                  }
                }}
                pagination={false}
                dataSource={memberList} />
            </Col>
          </Row>

        </Modal>
      </Row>
    );
  }
}

export default connect<any, any, any>
  (
  state => ({ configuration: state.configuration }),
  dispatch => ({
    refreshRoleList: data => dispatch(refreshRoleList(data)),
    insertRoleList: data => dispatch(insertRoleList(data)),
    updateRoleList: data => dispatch(updateRoleList(data)),
    deleteRoleList: data => dispatch(deleteRoleList(data)),
    refreshMemberList: data => dispatch(refreshMemberList(data)),
  })
  )(Form.create()(Authorities));
