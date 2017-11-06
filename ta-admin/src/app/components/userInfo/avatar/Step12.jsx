import * as React from "react";
import { Steps, Form, Row, Col, Input, Button, message } from "antd";
import * as request from "superagent";
import "./Step12.less";
class Step12 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            ajaxData: [],
        };
    }
    updateAjaxData(name, value) {
        console.log(value);
        let newData = this.state.ajaxData;
        newData[name] = value;
        this.setState({
            ajaxData: newData
        });
    }
    next() {
        let data = this.state.ajaxData;
        if (!data.phone || !data.name || !data.password || !data.password2) {
            message.error('请输入所有必填项！');
            return;
        }
        if (/^[0-9]*$/.test(data.phone) == false) {
            message.error('手机号必须为数字！');
            return;
        }
        if (data.password !== data.password2) {
            message.error('两次输入密码不一致！');
            return;
        }
        request
            .post('/userinfo/adduser')
            .type("form")
            .send({
                phone: data.phone,
                name: data.name,
                password: data.password
            })
            .end((err, res) => {
                if (err) {
                    message.error('出错')
                } else {
                    let data = JSON.parse(res.text);
                    if (data.status == 1) {
                        this.context.router.push('/workbench/userInfo/avatar/edit/step3?userid=' + data.data.userid);
                    } else {
                        message.error(data.msg);
                    }
                }
            });
    }
    render() {
        const Step = Steps.Step;
        const FormItem = Form.Item;
        return (
            <div className="content-wrap">
                <Row className="step-wrap">
                    <Steps>
                        <Step title="验证或注册账号" />
                        {
                            // <Step title="资质认证" />
                        }
                        <Step title="创建角色" />
                        <Step title="完成" />
                    </Steps>
                </Row>
                <Row type="flex" justify="center" className="Form-wrap">
                    <Col span={12}>
                        <Form layout="horizontal">
                            <FormItem
                                required
                                label="注册手机号"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入您的手机号码" onChange={(e) => { this.updateAjaxData('phone', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                required
                                label="姓名"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入您的真实姓名" onChange={(e) => { this.updateAjaxData('name', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                required
                                label="密码"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入密码" type="password" onChange={(e) => { this.updateAjaxData('password', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                required
                                label="确认密码"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请再次输入密码" type="password" onChange={(e) => { this.updateAjaxData('password2', e.target.value) } } />
                            </FormItem>
                        </Form>
                        <Row className="btn-wrap">
                            <Button size="large" type="primary" onClick={() => { this.next() } }>下一步</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
Step12.contextTypes = {
    router: React.PropTypes.object
};
export default Step12;
