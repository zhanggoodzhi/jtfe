import * as React from "react";
import { Table, Modal, Button, Row, Col, message } from "antd";
import { ajax, Img } from '../global/utils';
import * as request from "superagent";
import "./RoleManage.less";

class Bind extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: '',
            selectedRowKey: -1,
            tableLoading: false,
            tableData: [],
            visible: false,
            ajaxData: {
                kfAccount: null,
                serverid: null,
                roleType: null,
                headIcon: null,
                nickName: null,
                isadd: false
            }
        }
    }
    cleanKey() {
        this.setState({
            selectedRowKey: -1
        });
    }

    getFormData(record) {
        let newData = this.state.ajaxData;
        newData.serverid = record.id;
        newData.roleType = record.roleType;
        newData.headIcon = record.headIcon;
        this.setState({
            ajaxData: newData,
            tableLoading: true,
        });
        request
            .post('/weixin/unbindkf')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text);
                let errorArr = [];
                for (let i = 0; i < data.length; i++) {
                    errorArr.push(false)
                }
                this.setState({
                    errorArr: errorArr,
                    tableData: data,
                    tableLoading: false
                });
            });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    not() {
        let data = this.state.ajaxData;
        this.props.setLoading(true);
        request
            .post('/weixin/kfbind')
            .type("form")
            .send({
                kfAccount: data.kfAccount,
                serverid: data.serverid,
                roleType: data.roleType
            })
            .end((err, res) => {
                this.props.setLoading(false);
                if (err) {
                    message.error('出错')
                } else {
                    let data = JSON.parse(res.text);
                    if (data.status == 1) {
                        this.setState({
                            visible: false,
                        });
                        this.props.handleCancel();
                        message.success('请求成功');
                        this.props.getTableData();
                    } else {
                        message.error(data.msg);
                    }
                }
            });
    }
    sure() {
        let data = this.state.ajaxData;
        this.props.setLoading(true);
        request
            .post('/weixin/kfedit')
            .type("form")
            .send(data)
            .end((err, res) => {
                this.props.setLoading(false);
                if (err) {
                    message.error('出错')
                } else {
                    let data = JSON.parse(res.text);
                    if (data.status == 1) {
                        this.setState({
                            visible: false,
                        });
                        this.props.handleCancel();
                        message.success('请求成功');
                        this.props.getTableData();
                    } else {
                        message.error(data.msg);
                    }
                }
            });
    }
    saveConfirm() {
        const confirm = Modal.confirm;
        const self = this;
        if (this.state.selectedRowKey == -1) {
            message.error('请选择客服账号');
            return;
        }
        confirm({
            title: '提示',
            content: '确定要绑定该客服账号么？',
            onOk() {
                self.setState({
                    visible: true
                });
            },
            onCancel() { },
        });
    }

    render() {
        const tableData = this.state.tableData;
        const columns = [
            {
                title: '客服头像',
                dataIndex: 'headImgUrl',
                render: (headImgUrl) => {
                    return <Img src={`http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=${headImgUrl}`} />
                }
            },
            {
                title: '客服账号',
                dataIndex: 'account'
            },
            {
                title: '客服昵称',
                dataIndex: 'nick',
            }
        ];
        return (
            <div className="edit-content">
                <Modal title="请选择" visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName='RoleManage-component-wrap'>
                    <Row><h4>是否将该角色的头像和昵称同步到所选择的客服？</h4></Row>
                    <Row className="btn-wrap" style={{ marginTop: 20, textAlign: 'center' }}>
                        <Button size="large" type="primary" onClick={() => { this.sure() } }>是</Button>
                        <Button size="large" style={{ marginLeft: 15 }} onClick={() => { this.not() } }>否</Button>
                    </Row>
                </Modal>
                <Table
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [this.state.selectedRowKey],
                        onChange: (selectedRowKeys, selectedRows) => {
                            let data = selectedRows[0];
                            let newData = this.state.ajaxData;
                            newData.kfAccount = data.account;
                            newData.nickName = data.nick;
                            this.setState({
                                selectedRowKey: selectedRowKeys[0],
                                ajaxData: newData
                            });

                        }
                    }}
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    />
                <Row className="btn-wrap" style={{ marginTop: 20 }}>
                    <Button size="large" type="primary" onClick={() => { this.saveConfirm() } }>确定</Button>
                    <Button size="large" style={{ marginLeft: 15 }} onClick={() => { this.props.handleCancel() } }>取消</Button>
                </Row>
            </div>
        )
    }
}
Bind.propTypes = {
    getTableData: React.PropTypes.func,
    handleCancel: React.PropTypes.func,
    setLoading: React.PropTypes.func
};

class RoleManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            tableLoading: false,
            tableData: null,
            visible: false
        };
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }

    getTableData() {
        this.setState({
            tableLoading: true,
        });
        ajax.bind(this)('/weixin/kfcharacter', null, (data) => {
            let errorArr = [];
            for (let i = 0; i < data.serverlist.length; i++) {
                errorArr.push(false)
            }
            this.setState({
                errorArr: errorArr,
                tableData: data.serverlist,
                tableLoading: false
            });
        })
    }

    componentDidMount() {
        this.getTableData();
    }

    bind(record) {
        this.setState({
            visible: true
        }, () => {
            this.refs.bind.getFormData(record);
            this.refs.bind.cleanKey();
        });
    }
    unBind(record) {
        const confirm = Modal.confirm;
        const self = this;
        confirm({
            title: '提示',
            content: '确定要解绑吗？',
            onOk() {
                self.props.setLoading(true);
                request
                    .post('/weixin/kfunbind')
                    .type("form")
                    .send({
                        serverid: record.id,
                        roleType: record.roleType,
                        kfAccount: record.wxAccount
                    })
                    .end((err, res) => {
                        self.props.setLoading(false);
                        if (err) {
                            message.error('出错')
                        } else {
                            let data = JSON.parse(res.text);
                            if (data.status == 1) {
                                self.getTableData({ current: self.state.current });
                                message.success(data.msg);
                            } else {
                                message.error(data.msg);
                            }
                        }
                    });
            },
            onCancel() { },
        });
    }
    render() {
        const data = this.state.tableData;
        console.log(data);
        if (data === undefined) {
            return <div>此页面无法显示，原因：1.您没有绑定公众号。2.你的微信公众号无权限开通客服功能</div>
        }
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '头像',
                dataIndex: 'headUrl',
                render: (headImgUrl) => {
                    return <Img src={headImgUrl} />
                }
            },
            {
                title: '微信账号',
                dataIndex: 'wxAccount'
            },
            {
                title: '昵称',
                dataIndex: 'name'
            },
            {
                title: '角色类型',
                dataIndex: 'roleType',
                render: (roleType) => {
                    return roleType == 7004 ? '机器人' : '化身';
                }
            },
            {
                title: '状态',
                render: (text, record) => {
                    return record.wxAccount ? '已绑定' : '未绑定';
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    if (!record.wxAccount) {
                        return <Row className="btn-wrap"><Col><a className="check" onClick={() => { this.bind(record) } }>绑定</a></Col></Row>
                    } else {
                        return <Row className="btn-wrap"><Col><a className="check" onClick={() => { this.unBind(record) } }>解绑</a></Col></Row>
                    }
                }
            }
        ];
        const pagination = {
            total: this.state.tableData ? this.state.tableData.length : 1,
            showTotal: () => `符合条件的条目： ${this.state.tableData ? this.state.tableData.length : 1} 条`,
            showSizeChanger: true,
            defaultPageSize:10,
            onShowSizeChange: (current, pageSize) => {
                console.log(current,pageSize);
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
            pageSize: 20,
            current: this.state.current
        };*/
        return (
            <div className="roleManage-content">
                <Modal title="绑定客服" visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName='roleManage-edit-wrap'>
                    <Bind ref="bind" setLoading={this.props.setLoading} getTableData={this.getTableData.bind(this)} handleCancel={this.handleCancel.bind(this)} />
                </Modal>
                <Table
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    onChange={(v) => { this.setState({ current: v.current }) } }
                    />
            </div>
        );
    }
}
RoleManage.contextTypes = {
    router: React.PropTypes.object,
};
RoleManage.propTypes = {
    setLoading: React.PropTypes.func,
};
export default RoleManage;
