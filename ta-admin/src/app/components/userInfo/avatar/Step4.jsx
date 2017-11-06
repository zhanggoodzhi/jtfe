import * as React from "react";
import { Steps, Form, Row, Col, Input, Button, Select, Upload, Icon } from "antd";
import * as request from "superagent";
import "./Step3.less";
class Step3 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    render() {
        const Step = Steps.Step;
        return (
            <div className="content-wrap">
                <Row className="step-wrap">
                    <Steps current={2}>
                        <Step title="验证或注册账号" />
                        {
                            // <Step title="资质认证" />
                        }
                        <Step title="创建角色" />
                        <Step title="完成" />
                    </Steps>
                </Row>
                <Row type="flex" justify="center">
                    <Col style={{ textalign: 'center' }}>
                        <Icon type="check-circle" />  服务者已添加成功
                    </Col>
                </Row>
                <Row className="btn-wrap bottom" style={{ marginTop: '50px' }}>
                    <Button type="primary" size="large" onClick={() => { this.context.router.push('/workbench/userInfo/avatar') } }>查看详情</Button>
                    <Button className="next" size="large" type="primary" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit/step3?userid='+window.location.href.split('=')[1]) } }>继续添加</Button>
                </Row>
            </div >
        );
    }
}
Step3.contextTypes = {
    router: React.PropTypes.object
};
export default Step3;
