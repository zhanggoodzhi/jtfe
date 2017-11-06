import * as React from "react";
import { Table, Row, Col, Form, Input, Button, Icon, Select, DatePicker, Modal } from "antd";
import * as request from "superagent";
import "./Edit.less";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.ajaxData = [];
        this.state = {
            visible: false
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
    updateAjaxData(name, value) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.ajaxData[name] = value;
            console.log(this.ajaxData);
        }, 200);
    }
    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        return (
            <div className="user-list">
                <Row type="flex" justify="center" className="Form-wrap">
                    <Col span={12}>
                        <Form layout="horizontal">
                            <FormItem
                                label="选择头像"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择头像" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="机器人名"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入机器人名" onChange={(e) => { this.updateAjaxData('name', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                label="性格"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择性格" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="培训时间从"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <DatePicker placeholder="请输入培训开始时间" onChange={(date, dateString) => { this.updateAjaxData('train', dateString) } } />
                            </FormItem>
                            <FormItem
                                label="生日"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择生日" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="血型"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择血型" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="星座"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择星座" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="教育背景"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择教育背景" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="性别"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择性别" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="婚姻"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择婚姻" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="行业"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select placeholder="请选择行业" onChange={(value) => { this.updateAjaxData('country', value) } }>
                                    <Option value='0'>1</Option>
                                    <Option value='1'>2</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                label="详细介绍"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入详细介绍" onChange={(e) => { this.updateAjaxData('name', e.target.value) } } />
                            </FormItem>
                        </Form>
                        <Row className="btn-wrap">
                            <Button size="large" type="primary" onClick={() => { this.context.router.push('/workbench/app/robot') } }>提交</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Edit;
