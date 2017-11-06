import * as React from "react";
import { Table, Modal, DatePicker, Upload, Form, Select, Input, Button, Row, Col, Icon, message } from "antd";
import * as request from "superagent";
import { Img } from '../global/utils';
import "./BindRoles.less";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.formData = new FormData();
        this.originid = null;
        this.originFormData = null;
        this.state = {
            file: null,
            selectedRowKey: -1,
            tableLoading: false,
            tableData: [],
            ajaxData: {
                nickName: '',
                headUrl: '',
                roleType: '',
                headIcon: '',
                serverid: '',
                halfAccount: ''
            }
        }
    }
    cleanKey() {
        this.setState({
            selectedRowKey: -1
        });
    }
    cleanFile() {
        this.setState({
            file: null
        });
    }
    updateAjaxData(name, value) {
        console.log(value);
        let newData = this.state.ajaxData;
        newData[name] = value;
        this.setState({
            ajaxData: newData
        });
    }
    beforeUpload(file) {
        console.log(window.URL.createObjectURL(file));
        let newData = this.state.ajaxData;
        newData.headUrl = window.URL.createObjectURL(file);
        this.setState({
            ajaxData: newData
        });
        this.setState({
            file: file
        });
    }
    cleanAjaxData() {
        this.setState({
            ajaxData: {
                nickName: '',
                headUrl: '',
                roleType: '',
                headIcon: '',
                serverid: '',
                halfAccount: ''
            }
        });
    }
    getFormData(id) {
        this.setState({
            tableLoading: true,
        });
        request
            .post('/weixin/kflist')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text);
                this.originid = data.originid;
                let sid = null;
                if (id) {//编辑时
                    for (let v of data.kflist) {
                        if (v.id == id) {
                            sid = v.sid;
                            this.originFormData = v;
                            let newData = this.state.ajaxData;
                            newData.roleType = v.sid ? v.sid.split('_')[0] : null;
                            newData.nickName = v.nick;
                            newData.headUrl = v.headImgUrl ? `http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=${v.headImgUrl}` : null;
                            newData.serverid = v.sid ? v.sid.split('_')[1] : null;
                            newData.halfAccount = v.account.split('@')[0];
                            this.setState({
                                ajaxData: newData
                            });
                        }
                    }
                } else {//添加时
                    this.cleanAjaxData();
                }
                let arr = [];
                for (let i in data.vomap) {
                    if (!data.vomap[i].wxAccount || (data.vomap[i].wxAccount && i == sid)) {
                        arr.push(data.vomap[i]);
                    }
                }
                this.setState({
                    tableData: arr,
                    tableLoading: false
                });
            });
    }

    save() {
        const confirm = Modal.confirm;
        const self = this;
        this.formData = new FormData();
        let data = this.state.ajaxData;
        this.formData.append('isadd', this.props.isadd);
        if (data.serverid) {
            this.formData.append('serverid', data.serverid);
        }
        if (data.roleType) {
            this.formData.append('roleType', data.roleType);
        }
        if (data.headIcon) {
            this.formData.append('headIcon', data.headIcon);
        }
        this.formData.append('kfAccount', data.halfAccount + this.originid);
        this.formData.append('nickName', data.nickName);
        if (this.state.file) {
            this.formData.append('uploadfile', this.state.file);
        }
        confirm({
            title: '提示',
            content: '确定要保存数据吗？',
            onOk() {
                request
                    .post('/weixin/kfedit')
                    .send(self.formData)
                    .end((err, res) => {
                        if (err) {
                            message.error('出错')
                        } else {
                            let data = JSON.parse(res.text);
                            if (data.status == 1) {
                                self.props.handleCancel();
                                message.success(data.msg);
                                self.props.getTableData();
                            } else {
                                message.error(data.msg);
                            }
                        }
                    });

            },
            onCancel() { },
        });
    }
    cancel() {
        const confirm = Modal.confirm;
        const self = this;
        confirm({
            title: '提示',
            content: '确定要重置数据么',
            onOk() {
                if (self.props.isadd) {
                    self.cleanAjaxData();
                } else {
                    let newData = self.state.ajaxData;
                    newData.nickName = self.originFormData.nick;
                    newData.headUrl = self.originFormData.headImgUrl ? `http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=${self.originFormData.headImgUrl}` : null;
                    newData.serverid = self.originFormData.sid ? self.originFormData.sid.split('_')[1] : null,
                        self.setState({
                            ajaxData: newData
                        });
                }
                self.cleanKey();
            },
            onCancel() { },
        });
    }

    render() {
        const imageUrl = this.state.ajaxData.headUrl;
        const FormItem = Form.Item;
        const tableData = this.state.tableData;
        const data = this.state.ajaxData;
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '昵称',
                dataIndex: 'name',
            },
            {
                title: '头像',
                dataIndex: 'headUrl',
                render(headUrl) {
                    return <Img src={headUrl} />;
                }
            },
            {
                title: '类型',
                dataIndex: 'roleType',
                render(roleType) {
                    return roleType == 7004 ? '机器人' : '角色';
                }
            },
            {
                title: '状态',
                dataIndex: 'wxAccount',
                render(wxAccount) {
                    return wxAccount ? <span style={{ color: 'green' }}>当前绑定</span> : '未绑定';
                }
            }
        ];
        return (
            <div className="edit-content">
                <Table
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [this.state.selectedRowKey],
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log(selectedRowKeys, selectedRows);
                            let data = selectedRows[0];
                            let newData = this.state.ajaxData;
                            newData.nickName = data.name;
                            newData.headUrl = data.headUrl;
                            newData.roleType = data.roleType;
                            newData.headIcon = data.headIcon;
                            newData.serverid = data.id
                            if (this.props.isadd == true) {
                                newData.halfAccount = data.id
                            }
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
                <Row type="flex" justify="center" className="form-wrap">
                    <Col span={20} id="components-upload-demo-inplace">
                        <Form layout="horizontal">
                            <FormItem
                                label="客服账号"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input disabled={!this.props.isadd} value={data.halfAccount} addonAfter={this.originid} placeholder="请输入客服账号" onChange={(e) => { this.updateAjaxData('halfAccount', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                label="客服昵称"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input value={data.nickName} placeholder="请输入客服昵称" onChange={(e) => { this.updateAjaxData('nickName', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                label="客服头像"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Upload
                                    beforeUpload={this.beforeUpload.bind(this)}
                                    className="avatar-uploader"
                                    name="avatar"
                                    showUploadList={false}
                                    action="/empty/file"
                                    >
                                    {
                                        imageUrl ?
                                            <img src={imageUrl} role="presentation" className="avatar" /> :
                                            <Icon type="plus" className="avatar-uploader-trigger" />
                                    }
                                </Upload>
                            </FormItem>
                            <Row className="btn-wrap">
                                <Button size="large" type="primary" onClick={() => { this.save() } }>保存</Button>
                                <Button size="large" type="primary" style={{ marginLeft: 15 }} onClick={() => { this.cancel() } }>撤销</Button>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
Edit.propTypes = {
    actorid: React.PropTypes.number,
    isadd: React.PropTypes.bool,
    getTableData: React.PropTypes.func,
    handleCancel: React.PropTypes.func,
    setLoading: React.PropTypes.func
};

class BindRoles extends React.Component {
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
        request
            .post('/weixin/kflist')
            .type("form")
            .send()
            .end((err, res) => {
                this.setState({
                    tableData: JSON.parse(res.text).kflist,
                    tableLoading: false
                });
            });
        this.setState({
            tableLoading: true,
        });
    }

    componentDidMount() {
        this.getTableData();
    }

    add() {
        this.setState({
            visible: true,
            isadd: true
        }, () => {
            this.refs.edit.getFormData();
            this.refs.edit.cleanKey();
            this.refs.edit.cleanFile();
        });
    }
    edit(id) {
        this.setState({
            visible: true,
            isadd: false
        }, () => {
            this.refs.edit.getFormData(id);
            this.refs.edit.cleanKey();
            this.refs.edit.cleanFile();
        });
    }
    delete(sid, account) {
        const confirm = Modal.confirm;
        const self = this;
        confirm({
            title: '提示',
            content: '确定要删除该客服吗？',
            onOk() {
                request
                    .post('/weixin/kfdel')
                    .type("form")
                    .send({
                        serverid: sid ? sid.split('_')[1] : null,
                        roleType: sid ? sid.split('_')[0] : null,
                        kfAccount: account
                    })
                    .end((err, res) => {
                        if (err) {
                            message.error('出错')
                        } else {
                            let data = JSON.parse(res.text);
                            if (data.status == 1) {
                                self.getTableData({ current: self.state.current });
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
        if (data === undefined) {
            return <div>此页面无法显示，原因：1.您没有绑定公众号。2.你的微信公众号无权限开通客服功能</div>
        }
        const columns = [
            {
                title: '头像',
                dataIndex: 'headImgUrl',
                render: (headImgUrl) => {
                    return <Img src={`http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=${headImgUrl}`}/>
                }
            },
            {
                title: '客服账号',
                dataIndex: 'account'
            },
            {
                title: '昵称',
                dataIndex: 'nick'
            },
            {
                title: '状态',
                dataIndex: 'sid',
                render: (sid) => {
                    return sid ? '已绑定' : '未绑定';
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <Row className="btn-wrap"><Col xs={12}><a onClick={() => { this.edit(record.id) } } className="check">编辑</a></Col><Col xs={12}><a className="toBlack" onClick={() => { this.delete(record.sid, record.account) } }>删除</a></Col></Row>
                }
            }
        ];
        const pagination = {
            pageSize: 20,
            current: this.state.current
        };
        return (
            <div className="bindRoles-content">
                <Modal title="添加与编辑" visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName='bindRoles-edit-wrap'>
                    <Edit setLoading={this.props.setLoading} ref="edit" isadd={this.state.isadd} getTableData={this.getTableData.bind(this)} handleCancel={this.handleCancel.bind(this)} />
                </Modal>
                <Row className="add-wrap"><Button type="primary" icon="plus" onClick={() => { this.add() } }>添加角色</Button></Row>
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


BindRoles.contextTypes = {
    router: React.PropTypes.object,
};
BindRoles.propTypes = {
    setLoading: React.PropTypes.func,
};
export default BindRoles;
