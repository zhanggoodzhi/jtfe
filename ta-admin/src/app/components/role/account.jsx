import * as React from "react";
import {Modal, Icon, Button, Table ,Row,Col} from "antd";
import * as request from "superagent";
import "./account.less";
import AccountForm from "../../components/role/accountForm";
export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            iconStatus: [],
            ajaxData: [{
                key: 1,
                id: 1,
                headIcon: 2,
                account: 3,
                markName: 4,
                area: 5,
                role: [1, 2, 3]
            }, {
                    key: 2,
                    id: 1,
                    headIcon: 2,
                    account: 3,
                    markName: 4,
                    area: 5,
                    role: [1, 2, 3]
                }, {
                    key: 3,
                    id: 1,
                    headIcon: 2,
                    account: 3,
                    markName: 4,
                    area: 5,
                    role: [1, 2, 3]
                }]
        };
    }
    showModal() {
        this.setState({
            visible: true,
        });
    }
    handleOk() {
        console.log('点击了确定');
        this.setState({
            visible: false,
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    iconClick(index) {
        let state = this.state.iconStatus;
        state[index] = !state[index];
        this.setState({
            iconStatus: state
        });
    }
    componentDidMount() {
        let state = [];
        this.state.ajaxData.forEach(() => {
            state.push(false);
        });
        this.setState({
            iconStatus: state
        });
        const sendData = {
            page: 1,
            rows: 20,
            order: 'desc',
            sort: 'id'
        }
        request
            .post('/account/queryList ')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                console.log(JSON.parse(res.text));
            });
    }
    render() {
        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
            {
                title: '头像',
                dataIndex: 'headIcon',
                key: 'headIcon'
            }, {
                title: '用户名',
                dataIndex: 'account',
                key: 'account'
            }, {
                title: '备注名',
                dataIndex: 'markName',
                key: 'markName'
            }, {
                title: '专区',
                dataIndex: 'area',
                key: 'area'
            }, {
                title: '角色',
                dataIndex: 'role',
                key: 'role',
                render: (role, record, index) => {
                    const Plength = role.length;
                    const theHeight = this.state.iconStatus[index] ? String(Plength * 34) + 'px' : '34px';
                    const iconClass = this.state.iconStatus[index] ? 'icon-click' : 'icon-noclick';
                    const theIcon = this.state.iconStatus[index] ? 'minus-square' : 'plus-square';
                    const ro = role.map((v, i) => {
                        return <p key={`roleitem_${i}`} className="role-item">{v}</p>
                    });
                    return <div className='role-wrap'>
                        <div className='icon-wrap' onClick={() => { this.iconClick(index) } }>
                            <Icon type={theIcon}/>
                        </div>
                        <div className={iconClass} style={{ height: theHeight }}>{ro}</div>
                    </div>
                }
            }, {
                title: '操作',
                render: () => {
                    return <Row className="td-btn-wrap"><Col xs={12}><a className="check">编辑</a></Col><Col xs={12}><a className="toBlack">删除</a></Col></Row>
                },
                key: 'do',
                width: '10%'
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
                <Modal visible={this.state.visible} closable={false}
                    onOk={this.handleOk.bind(this) } onCancel={this.handleCancel.bind(this) }
                    >
                    <AccountForm/>
                </Modal>
                <div className="add-user">
                    <Button type="primary" onClick={this.showModal.bind(this) }>添加用户</Button>
                </div>
                <div className="many-remove" >
                    <Button type="ghost">批量删除</Button>
                </div>
                <Table rowClassName={() => { return "account-table" } } columns={columns} rowSelection={rowSelection} dataSource={this.state.ajaxData} />
            </div>
        );
    }
}
