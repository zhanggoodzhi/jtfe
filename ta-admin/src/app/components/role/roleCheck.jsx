import * as React from "react";
import { render } from "react-dom";
import {Modal, Icon, Tabs, Breadcrumb, Form, Select, Input, Button, Row, Col, Table } from "antd";
import * as request from "superagent";
import "./roleCheck.less";
export default class RoleCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            ajaxData: [{
                key: 1,
                id: 1,
                headIcon: 2,
                account: 3,
                markName: 4,
                area: 5,
                role: [1, 2, 3],
                authority: "角色管理员可以添加/删除群成员、修改群资料、删除上传到群共享的文件、删除相册/相片"
            }, {
                    key: 2,
                    id: 1,
                    headIcon: 2,
                    account: 3,
                    markName: 4,
                    area: 5,
                    role: [1, 2, 3],
                    authority: "角色管理员可以添加/删除群成员、修改群资料、删除上传到群共享的文件、删除相册/相片"
                }, {
                    key: 3,
                    id: 1,
                    headIcon: 2,
                    account: 3,
                    markName: 4,
                    area: 5,
                    role: [1, 2, 3],
                    authority: "角色管理员可以添加/删除群成员、修改群资料、删除上传到群共享的文件、删除相册/相片"
                }]
        };
    }
    componentDidMount() {
        const sendData = {
           role_id:'1'
        }
        request
            .post('role/getPrisByRoleId.do')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                console.log(JSON.parse(res.text));
                // this.setState({
                //     ajaxData: JSON.parse(res.text).rows
                // });
            });
    }
    render() {
        const TabPane = Tabs.TabPane;
        const authcolumns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
                title: '权限',
                dataIndex: 'authority',
                key: 'authority'
            }];
        const accountcolumns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        }, {
                title: '用户名',
                dataIndex: 'account',
                key: 'account'
            }];
        return (
            <div className="roleCheck-wrap">
                <Tabs type="card">
                    <TabPane tab="权限" key="1">
                        <Table showHeader={false} columns={authcolumns} dataSource={this.state.ajaxData} />
                    </TabPane>
                    <TabPane tab="用户名" key="2">
                        <Table showHeader={false} columns={accountcolumns} dataSource={this.state.ajaxData} />
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}
