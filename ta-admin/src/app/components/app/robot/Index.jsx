import * as React from "react";
import { Table, Row, Col, Form, Input, Button, Modal } from "antd";
import * as request from "superagent";
import "./Index.less";
class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const FormItem = Form.Item;
        return (
            <div className="user-wrap">
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="头像"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="TA号"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="姓名"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="电话"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="性别"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="性格"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="用户类型"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="注册时间"
                        >
                        <p>Big eye minion</p>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
class Record extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return <div>432432</div>
    }
}
class DetailFormElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    reset() {
        this.props.form.resetFields();
        this.props.updateForm(
            {
                "keyword": ""
            }
        );
    }

    render() {
        const formItemLayout = {
            wrapperCol: {
                span: 21
            }
        };
        const FormItem = Form.Item;
        const getFieldDecorator = this.props.form.getFieldDecorator;
        return (
            <Form layout="horizontal">
                <Row>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("keyword")(
                                <Input
                                    placeholder="请输入用户关键字"
                                    />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="18" className="btn-wrap">
                        <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
DetailFormElement.contextTypes = {
    router: React.PropTypes.object
};
DetailFormElement.propTypes = {
    form: React.PropTypes.object,
    updateForm: React.PropTypes.func,
    getTableData: React.PropTypes.func
};

let timer2 = null;

const DetailSearchForm = Form.create({
    onFieldsChange: (props, fields) => {
        console.log(fields);
        if (timer2) {
            clearTimeout(timer2);
            timer2 = null;
        }
        timer2 = setTimeout(() => {
            for (let i in fields) {
                const obj = {};
                obj[fields[i].name] = fields[i].value;
                props.updateForm(obj);
            }
        }, 200)
    }
})(DetailFormElement);

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            tableData: null,
            userVisible: false,
            recordVisible: false,
            formData: {
                "keyword": "",
                "phoneNo": ""
            }
        };
    }
    showUserModal() {
        console.log('34324');
        this.setState({
            userVisible: true,
        });
    }
    userHandleCancel() {
        this.setState({
            userVisible: false,
        });
    }
    showRecordModal() {
        this.setState({
            recordVisible: true,
        });
    }
    recordHandleCancel() {
        this.setState({
            recordVisible: false,
        });
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
        }
        this.setState({ tableLoading: true });
        if (sendData.hasOwnProperty('startDay') && sendData.startDay !== undefined) {
            sendData.startDay = sendData.startDay.toString();
        }
        if (sendData.hasOwnProperty('endDay') && sendData.endDay !== undefined) {
            sendData.endDay = sendData.endDay.toString();
        }
        // request
        //     .post('baseinfo/page.do')
        //     .type("form")
        //     .send(sendData)
        //     .end((err, res) => {
        //         this.setState({
        //             tableData: JSON.parse(res.text),
        //             tableLoading: false
        //         });
        //     });
        this.setState({
            tableLoading: false
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
                title: '昵称',
                render: () => {
                    return <a onClick={this.showUserModal.bind(this)} className="user">查看用户</a>
                }
            },
            {
                title: 'TA号',
                dataIndex: 'user'
            },
            {
                title: '手机号码',
                dataIndex: 'phone'
            },
            {
                title: '操作',
                render: () => {
                    return <a onClick={this.showRecordModal.bind(this)} className="record">聊天记录</a>
                }
            }
        ];
        const pagination = {
            total: this.state.tableData ? this.state.tableData.total : 1,
            pageSize: 20
        };
        // const data = this.state.tableData ? this.state.tableData.rows : [];
        const data = [{
            id: 1,
            genderName: 2,
            user: 3,
            phone: 4
        }];


        return (
            <div className="user-list" >
                <Modal title="用户信息" visible={this.state.userVisible}
                    onCancel={this.userHandleCancel.bind(this)} maskClosable={false} wrapClassName="user-modal">
                    <User />
                </Modal>
                <Modal title="聊天记录" visible={this.state.recordVisible}
                    onCancel={this.recordHandleCancel.bind(this)} maskClosable={false} wrapClassName="record-modal">
                    <Record />
                </Modal>
                <DetailSearchForm
                    updateForm={this.updateForm.bind(this)}
                    getTableData={this.getTableData.bind(this)}
                    />
                <Table
                    className="main-table"
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    onChange={this.getTableData.bind(this)}
                    />
            </div >
        );
    }
}

class FormElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    reset() {
        this.props.form.resetFields();
        this.props.updateForm(
            {
                "keyword": ""
            }
        );
    }

    render() {
        const formItemLayout = {
            wrapperCol: {
                span: 21
            }
        };
        const FormItem = Form.Item;
        const getFieldDecorator = this.props.form.getFieldDecorator;
        return (
            <Form layout="horizontal">
                <Row>
                    <Col sm={6} xs={6} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("keyword")(
                                <Input
                                    placeholder="请输入robot关键字"
                                    />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="18" className="btn-wrap">
                        <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
                        <Button icon="plus" onClick={() => { this.context.router.push('/workbench/app/robot/edit') } }>添加</Button>
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
            tableData: null,
            visible: false,
            formData: {
                "keyword": "",
                "phoneNo": ""
            }
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
        const sendData = Object.assign({
            page: 1,
            rows: 20,
            order: "desc",
            sort: "id"
        }, this.state.formData);
        if (pagination && pagination.current) {
            sendData.page = pagination.current;
        }
        this.setState({ tableLoading: true });
        if (sendData.hasOwnProperty('startDay') && sendData.startDay !== undefined) {
            sendData.startDay = sendData.startDay.toString();
        }
        if (sendData.hasOwnProperty('endDay') && sendData.endDay !== undefined) {
            sendData.endDay = sendData.endDay.toString();
        }
        // request
        //     .post('baseinfo/page.do')
        //     .type("form")
        //     .send(sendData)
        //     .end((err, res) => {
        //         this.setState({
        //             tableData: JSON.parse(res.text),
        //             tableLoading: false
        //         });
        //     });
        this.setState({
            tableLoading: false
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
                title: '昵称',
                dataIndex: 'genderName'
            },
            {
                title: 'TA号',
                dataIndex: 'user'
            },
            {
                title: '手机号码',
                dataIndex: 'phone'
            },
            {
                title: '操作',
                render: () => {
                    return <Row className="td-btn-wrap"><Col xs={12}><a onClick={this.showModal.bind(this)} className="check">查看用户</a></Col><Col xs={12}><a className="edit" onClick={() => { this.context.router.push('/workbench/app/robot/edit') } }>编辑</a></Col></Row>

                }
            }
        ];
        const pagination = {
            total: this.state.tableData ? this.state.tableData.total : 1,
            pageSize: 20
        };
        // const data = this.state.tableData ? this.state.tableData.rows : [];
        const data = [{
            id: 1,
            genderName: 2,
            user: 3,
            phone: 4
        }];


        return (
            <div className="user-list" >
                <Modal title="查询指定用户与机器人的聊天记录" visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName="detail-modal">
                    <Detail />
                </Modal>
                <SearchForm
                    updateForm={this.updateForm.bind(this)}
                    getTableData={this.getTableData.bind(this)}
                    />
                <Table
                    className="main-table"
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    onChange={this.getTableData.bind(this)}
                    />
            </div >
        );
    }
}
Index.contextTypes = {
    router: React.PropTypes.object
};
export default Index;
