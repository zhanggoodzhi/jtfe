import * as React from "react";
import { Table, Row, Col, Form, Input, Button, Select } from "antd";
import * as request from "superagent";
import "./Index.less";
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
        const Option = Select.Option;
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
                            {getFieldDecorator("name")(
                                <Input
                                    placeholder="请输入版本名"
                                    />
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("roleType")(
                                <Select
                                    placeholder="强制更新"
                                    >
                                    <Option value="0">强制更新</Option>
                                    <Option value="1">不强制更新</Option>
                                    <Option value="2">全部</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={24} xs={24} md={12} lg={12} className="btn-wrap">
                        <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
                        <Button icon="plus" onClick={() => { this.context.router.push('/workbench/app/update/edit') } }>添加</Button>
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
