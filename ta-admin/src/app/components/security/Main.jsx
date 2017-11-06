import * as React from "react";
import { render } from "react-dom";
import { Tabs, Table, Button, Row, Col, Modal, Form, Checkbox, Spin, Input, Tooltip } from 'antd';
import "./main.less"
import UserForm from "./UserForm"
import RoleAddForm from "./RoleAddForm"
import request from 'superagent';
import { RouterContext } from 'react-router';
import RolePermissionUpdateForm from './RolePermissionUpdateForm';

const CheckboxGroup = Checkbox.Group;

const TabPane = Tabs.TabPane;

class Main extends React.Component {

    constructor(props, context) {
        super(props, context);

        console.debug(this.context);
        console.debug(this.context.router);

        this.url_get_users = '/security/users';
        this.url_get_roles = '/security/roles';
        this.url_get_permissions = '/security/permissions';

        this.state = {
            data_users: [],
            data_roles: [],
            data_permissions: [],
            userAddFormModalVisible: false,
            roleAddFormModalVisible: false,
            roleAddConfirmLoading: false,
        };

        this.table_permissions_columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '范围',
            dataIndex: 'scope',
            key: 'scope',
            render: function (text, record, index) {
                let scope = record.scope;
                let desc = record.scopeDesc;
                return <Tooltip title={desc}>
                    <span>{scope}</span>
                </Tooltip>;
            }
        }, {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
        }];


        this.table_users_columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '用户',
            dataIndex: 'username',
            key: 'username',
            render: (text, record, index) => React.createElement('a', { href: '/workbench/security/users/' + record.id }, text),
        }, {
            title: '别名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '备注',
            dataIndex: 'desc',
            key: 'desc',
        }, {
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            render: function (text, record, index) {
                return text === true ? '已启用' : '已禁用';
            }
        }];

        this.table_roles_columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '角色',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '备注',
            dataIndex: 'desc',
            key: 'desc',
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'op',
            render: function (text, record, index) {
                let roleid = record.id;
                let rolename = record.name;
                return <div><Button type="ghost" onClick={() => this.onRoleDetailBtnClicked(roleid)}>查看</Button>
                    <Button type="ghost" onClick={this.onRolePermissionBtnClicked.bind(this, record, index)}>权限</Button>
                    <Button type="ghost" onClick={() => this.onDelRoleBtnClicked(roleid, rolename)}>删除</Button></div>;
            }.bind(this)
        }];
    }

    onRoleDetailBtnClicked(roleid) {
        this.context.router.push(`/workbench/security/roles/${roleid}/detail`);
    }

    onRolePermissionBtnClicked(role, index) {
        console.debug("onRolePermissionBtnClicked");
        let form = <RolePermissionUpdateForm key={`item-${index}`} selectedRole={role} />;
        let container = this.refs.container;
        console.debug(this.refs);
        console.debug(this.refs.container);
        let formComponent = render(form, container);
        formComponent.showModal();
    }

    onDelRoleBtnClicked(roleid, rolename) {
        let _this = this;
        Modal.confirm({
            title: '真的要删除下列角色吗？',
            content: rolename,
            onOk() {
                return new Promise((resolve, reject) => {
                    console.debug('in Promise %s', _this);
                    //向服务器请求删除角色
                    console.debug('onDelRoleBtnClicked!! role[id=%i] will be deleted!', roleid);
                    request.del(`/security/roles/${roleid}`).end(function (err, res) {
                        console.debug(res.text);
                        if (err || res.body.code != 0) {
                            console.error('error..');
                            reject(err);
                        } else {
                            console.debug(res.body.message);
                            resolve(res.body);
                        }
                        this.fetchRoles();
                    }.bind(_this));
                }).catch((err) => console.log(err));
            }
        });
    }

    /**
     * 获取用户数据源
     */
    fetchUsers() {
        $.ajax({
            url: this.url_get_users,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data_users: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url_get_users, status, err.toString());
            }.bind(this)
        });
    }


    /**
     * 获取角色数据源
     */
    fetchRoles() {
        $.ajax({
            url: this.url_get_roles,
            dataType: 'json',
            cache: false,
            success: function (data) {
                console.debug(JSON.stringify(data));
                this.setState({ data_roles: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url_get_users, status, err.toString());
            }.bind(this),
        });
    }

    /**
     * 获取权限数据源
     */
    fetchPermissions() {
        $.ajax({
            url: this.url_get_permissions,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data_permissions: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url_get_permissions, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        return (
            <Tabs type="card">
                <TabPane tab="用户" key="1">
                    <Button type="primary" onClick={() => { this.onUserAddBtnClick() } }>添加</Button>
                    <Table dataSource={this.state.data_users} columns={this.table_users_columns} />
                    <Modal
                        title="添加用户"
                        visible={this.state.userAddFormModalVisible}
                        onOk={() => this.handleUserFormSubmit()}
                        onCancel={() => this.hideUserFormModal()}
                        closable={false}
                        maskClosable={false}>
                        <UserForm ref="userForm" />
                    </Modal>
                </TabPane>
                <TabPane tab="角色" key="2">
                    <Button type="primary" onClick={this.onRoleAddBtnClicked.bind(this)}>添加</Button>
                    <Modal title="添加角色"
                        visible={this.state.roleAddFormModalVisible}
                        onOk={this.handleOkRoleAdd.bind(this)}
                        confirmLoading={this.state.roleAddConfirmLoading}
                        onCancel={this.handleCancelRoleAdd.bind(this)}
                        closable={false}
                        maskClosable={false}>
                        <RoleAddForm ref="roleAddForm" />
                    </Modal>
                    <Table dataSource={this.state.data_roles} columns={this.table_roles_columns} />
                    <div ref="container"></div>
                </TabPane>
                <TabPane tab="权限" key="3">
                    <Table dataSource={this.state.data_permissions} columns={this.table_permissions_columns} />
                </TabPane>
            </Tabs>
        )
    }

    onRoleAddFormSubmit() {
        console.debug('onRoleAddFormSubmit');
    }

    handleOkRolePermissionUpdate() {
        this.hideRolePermissionUpdateFormModal();
        this.refs.modal1.unmountComponentAtNode(this);
    }

    handleCancelRolePermissionUpdate() {
        this.hideRolePermissionUpdateFormModal();
    }

    handleOkRoleAdd() {
        this.setState({ roleAddConfirmLoading: true });
        let _this = this.refs.roleAddForm;
        console.log('Received values of form:', _this.getFieldsValue());
        request.post('/security/roles').type('form').send(_this.getFieldsValue()).end(function (err, res) {
            if (err || res.status != 200) {
                //fail
                console.error(err || res.text);
            } else {
                //success
                this.fetchRoles();
                this.setState({ roleAddConfirmLoading: false });
                //关闭modal
                this.hideRoleAddFormModal();
            }
        }.bind(this));
    }

    handleCancelRoleAdd() {
        this.hideRoleAddFormModal();
    }

    onRoleAddBtnClicked() {
        console.debug(`onRoleAddBtnClicked!!`);
        this.setState({ roleAddFormModalVisible: true });
    }

    handleUserFormSubmit() {
        let data = this.refs.userForm.getFieldsValue();
        data.enabled = data.enabled || false;
        console.log(data);
        this.hideUserFormModal();
        $.post('/security/users', data, 'json').done(function (data, textStatus, jqXHR) {
            console.debug("return data:%s", JSON.stringify(data));
            this.refs.userForm.resetFields();
            this.fetchUsers();
        }.bind(this)).fail(function (jqXHR, textStatus, errorThrown) {
            console.error(errorThrown);
        }.bind(this));
    }

    showUserFormModal() {
        this.setState({ userAddFormModalVisible: true });
    }

    hideUserFormModal() {
        this.setState({ userAddFormModalVisible: false });
    }

    showRoleAddFormModal() {
        this.setState({ roleAddFormModalVisible: true });
    }

    hideRoleAddFormModal() {
        this.setState({ roleAddFormModalVisible: false });
    }

    onUserAddBtnClick() {
        console.debug('点击了添加用户按钮');
        console.debug(this);
        this.showUserFormModal();
    }

    onUserRoleBtnClick() {
        console.debug("点击了查看用户角色按钮");
        this.showUserRoleModal();
    }

    componentDidMount() {
        this.fetchUsers();
        this.fetchRoles();
        this.fetchPermissions();
    }
}

Main.contextTypes = {
    router: React.PropTypes.object
}

export default Main;
