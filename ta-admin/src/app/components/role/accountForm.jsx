import * as React from "react";
import { render } from "react-dom";
import {Modal, Icon, Tabs, Breadcrumb, Form, Select, Input, Button, Row, Col, Table, Checkbox} from "antd";
import * as request from "superagent";
import "./accountForm.less";
class FormElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const Option = Select.Option;
        const FormItem = Form.Item;
        const getFieldDecorator = this.props.fgetFieldDecoratorrops;
        const InputGroup = Input.Group;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        const updatemarkName = getFieldDecorator("markName", {});
        return (
            <div className="form-wrap">
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                        >
                        <InputGroup>
                            <Col span="12">
                                <Input type="text" {...getFieldDecorator('account') } placeholder="请输入用户名"/>
                            </Col>
                            <Col span="12">
                                <Select size="large" defaultValue="请选择专区">
                                    <Option value="0">江苏昆山妇联</Option>
                                    <Option value="1">苏州馨港婚姻家庭</Option>
                                    <Option value="2">测试</Option>
                                    <Option value="3">测试</Option>
                                </Select>
                            </Col>
                        </InputGroup>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注名"
                        >
                        <Input type="text" {...getFieldDecorator('markName') } placeholder="请输入备注名" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                        >
                        <Input type="password" {...getFieldDecorator('password') } placeholder="请输入密码" />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="角色"
                        >
                        <Row>
                            <Col  span="8">
                                <Checkbox className="ant-checkbox-inline">信息发布管理员</Checkbox>
                            </Col>
                            <Col  span="8">
                                <Checkbox className="ant-checkbox-inline">考勤管理员</Checkbox>
                            </Col>
                            <Col  span="8">
                                <Checkbox className="ant-checkbox-inline">物资管理员</Checkbox>
                            </Col>
                        </Row>
                        <Row>
                            <Col  span="8">
                                <Checkbox className="ant-checkbox-inline">收文管理员</Checkbox>
                            </Col>
                            <Col  span="8">
                                <Checkbox className="ant-checkbox-inline">档案管理员</Checkbox>
                            </Col>
                            <Col  span="8">
                                <Checkbox className="ant-checkbox-inline">外出审批管理员</Checkbox>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
FormElement.propTypes = {
    form: React.PropTypes.object
}
const AccountForm = Form.create()(FormElement);
export default AccountForm;