import * as React from "react";
import { Steps, Row, Button } from "antd";
import './Step.less';
class Step3 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            ajaxData: [],
            imgUrl: '/userinfo/imgcode#'
        };
    }
    render() {
        const Step = Steps.Step;
        return (
            <div className="weixinIntegrate-wrap">
                <Row className="step-wrap">
                    <Steps current={2}>
                        <Step title="配置URL与Token" />
                        <Step title="域名设置" />
                        <Step title="启动服务配置" />
                        <Step title="确定启用" />
                        <Step title="智能机器人对接成功" />
                    </Steps>
                </Row>
                <Row className="mt"><img style={{ width: '100%', height: 'auto' }} src="/resources/image/weixinIntegrate/3.jpg" /></Row>
                <Row className="btn-wrap mt" style={{ textAlign: 'center' }}>
                    <Button size="large" type="primary" onClick={() => { this.context.router.push('/workbench/weixin/integrate/step2') } }>上一步</Button>
                    <Button style={{ marginLeft: 20 }} size="large" type="primary" onClick={() => { this.context.router.push('/workbench/weixin/integrate/step4') } }>下一步</Button>
                    <Button style={{ marginLeft: 20 }} size="large" type="primary" onClick={() => { this.context.router.push('/workbench/weixin/integrate') } }>返回对接页面</Button>
                </Row>
            </div>
        );
    }
}
Step3.contextTypes = {
    router: React.PropTypes.object
};
export default Step3;
