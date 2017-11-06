import * as React from "react";
import { Table, Row, Col, Form, Input, Button } from "antd";
import * as request from "superagent";
import "./Help.less";

class FormElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            identity: [{ "id": "0", "code": "0", "name": "无数据" }],
            online: [{ "id": "0", "code": "0", "name": "无数据" }]
        };
    }

    handleStartToggle({ open }) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    handleEndToggle({ open }) {
        this.setState({ endOpen: open });
    }
    componentWillMount() {
        request
            .post('account/queryType.do')
            .type("form")
            .send({
                "type": "account_type"
            })
            .end((err, res) => {
                this.setState({ "identity": JSON.parse(res.text) });
            });
        request
            .post('account/queryType.do')
            .type("form")
            .send({
                "type": "online_status"
            })
            .end((err, res) => {
                this.setState({ "online": JSON.parse(res.text) });
            });
    }

    reset() {
        this.props.form.resetFields();
        this.props.updateForm(
            {
                "keyword": "",
                "name": "",
                "area": ""
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
                    <Col sm={12} xs={24} md={5} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("keyword")(
                                <Input
                                    placeholder="TA号/手机号码"
                                    />
                            ) }
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={5} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("name")(
                                <Input
                                    placeholder="昵称"
                                    />
                            ) }
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={5} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("phoneNoLocation")(
                                <Input
                                    placeholder="归属地"
                                    />
                            ) }
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={9} lg={6} className="btn-wrap">
                        <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
                        <Button icon="delete" onClick={this.reset.bind(this) }>清空</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
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

class Help extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            tableData: null,
            identity: [{ "id": "0", "code": "0", "name": "无数据" }],
            online: [{ "id": "0", "code": "0", "name": "无数据" }],
            formData: {
                "keyword": "",
                "phoneNo": ""
            }
        };
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
        request
            .post('baseinfo/page.do')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                this.setState({
                    tableData: JSON.parse(res.text),
                    tableLoading: false
                });
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
                dataIndex: 'user.genderName'
            },
            {
                title: 'TA号',
                dataIndex: 'user.id'
            },
            {
                title: '手机号码',
                dataIndex: 'phone'
            },
            {
                title: '归属地',

            },
            {
                title: '情感',
            },
            {
                title: '操作',
                render: () => {
                    return <a>查看详情</a>
                }
            }
        ];
        const pagination = {
            total: this.state.tableData ? this.state.tableData.total : 1,
            pageSize: 20
        };
        const data = this.state.tableData ? this.state.tableData.rows : [];


        return (
            <div className="user-list">
                <SearchForm
                    updateForm={this.updateForm.bind(this) }
                    getTableData={this.getTableData.bind(this) }
                    />
                <Table
                    className="main-table"
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    onChange={this.getTableData.bind(this) }
                    />
            </div>
        );
    }
}

export default Help;
