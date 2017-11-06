import * as React from "react";
import { render } from "react-dom";
import {Modal,Button,Table } from "antd";
import * as request from "superagent";
import "./role.less";
import RoleForm from "../../components/role/roleForm";
import RoleCheck from "../../components/role/RoleCheck";
export default class Role extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            iconStatus: [],
            ajaxData: []
        };
    }
    componentWillMount() {
        const sendData = {
            page: 1,
            rows: 20,
            order: 'desc',
            sort: 'id'
        }
        request
            .post('role/query.do ')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                console.log(JSON.parse(res.text).rows);
                this.setState({
                    ajaxData:JSON.parse(res.text).rows
                });
            });
    }
    roleCheck(text) {
        Modal.info({
            title: '',
            content: <RoleCheck id={text.id}/>,
            width: 900,
            onOk() { },
            okText: '关闭'
        });
    }
    showModal() {
        this.setState({
            visible: true,
        });
    }
    handleOk() {
        this.setState({
            visible: false,
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    render() {
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
        }, {
                title: '角色',
                dataIndex: 'role_name',
            }, {
                title: '操作',
                render: (text) => {
                    return <div><a onClick={() => { this.roleCheck(text) } }>查看</a>&ensp; &ensp; &ensp; <a>编辑</a>&ensp; &ensp; &ensp; <a>删除</a></div>
                },
            }];

        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect(record, selected, selectedRows) {
                console.log(record, selected, selectedRows);
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows);
            },
        };

        return (
            <div className="content">
                <Modal visible={this.state.visible}
                    onOk={this.handleOk.bind(this) } onCancel={this.handleCancel.bind(this) }
                    >
                    <RoleForm/>
                </Modal>
                <div className="add-user">
                    <Button type="primary" onClick={this.showModal.bind(this) }>添加角色</Button>
                </div>
                <div className="many-remove" >
                    <Button type="ghost">批量删除</Button>
                </div>
                <Table columns={columns} rowSelection={rowSelection} dataSource={this.state.ajaxData} />
            </div>
        );
    }
}
