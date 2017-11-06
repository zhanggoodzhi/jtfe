import * as React from "react";
import { Steps, Form, Row, Col, Input, Button, Icon, message } from "antd";
import * as request from "superagent";
import "./Step11.less";
class Step11 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            ajaxData: [],
            imgUrl: '/userinfo/imgcode#'
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
    reload() {
        request
            .get('/userinfo/imgcode')
            .end((err, res) => {
            });
        let ran = Math.random();
        this.setState({
            imgUrl: this.state.imgUrl + ran
        });
    }
    next() {
        let data = this.state.ajaxData;
        if (!data.userid || !data.code) {
            message.error('请输入所有必填项！');
            return;
        }
        if (/^[0-9]*$/.test(data.userid) == false) {
            message.error('账号必须为数字！');
            return;
        }
        request
            .post('/userinfo/check.do')
            .type("form")
            .send({
                userid: data.userid,
                code: data.code
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
                                label="验证账号"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入TA账号(必须为数字类型)" onChange={(e) => { this.updateAjaxData('userid', e.target.value) } } />
                            </FormItem>
                            <div className="test-wrap">
                                <FormItem
                                    required
                                    label="验证码"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 14 }}
                                    >
                                    <Input className="code-input" placeholder="请输入验证码" onChange={(e) => { this.updateAjaxData('code', e.target.value) } } />
                                </FormItem>
                                <div className="image-wrap" onClick={this.reload.bind(this)} ><img src={this.state.imgUrl} /></div>
                            </div>
                        </Form>
                        <Row className="btn-wrap">
                            <Button size="large" type="primary" onClick={() => { this.next() } }>下一步</Button>
                        </Row>
                        <Row justify="center" type="flex" align="middle" className="bottom">
                            <Col span={9}><span className="bottom-info">无TA账号请点击立即注册</span></Col>
                            <Col span={4}><Button size="large" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit/step12') } }>立即注册</Button></Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
Step11.contextTypes = {
    router: React.PropTypes.object
};
export default Step11;
