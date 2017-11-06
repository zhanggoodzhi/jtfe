import * as React from "react";
import { Steps, Row, Col, Button } from "antd";
import * as request from "superagent";
import "./Step21.less";
class Step21 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.userid=null;
        this.id = null;
        this.state = {
            arr: []
        };
    }
    changeColor(i) {
        const newArr = this.state.arr;
        for (let j in newArr) {
            if (j == i) {
                newArr[j].color = '#2db7f4';
                this.id = newArr[j].id;
            } else {
                newArr[j].color = '#fff';
            }
        }
        this.setState({
            arr: newArr
        });
    }
    componentWillMount() {
        this.userid=window.location.href.split('=')[1];
        request
            .post('/certification/findAll.do')
            .type("form")
            .send({
            })
            .end((err, res) => {
                const arr = JSON.parse(res.text).map((v) => {
                    return { name: v.name, color: '#fff', id: v.id }
                });
                this.setState({
                    arr: arr
                });
            });
    }
    render() {
        const Step = Steps.Step;
        const cols = this.state.arr.map((v, i) => {
            return (
                <Col key={`_${i}`} className="select-item" span={10} style={{ background: v.color }} onClick={() => { this.changeColor(i) } }>
                    <span>{v.name}</span>
                </Col>
            );
        });
        return (
            <div className="content-wrap">
                <Row className="step-wrap">
                    <Steps current={1}>
                        <Step title="验证或注册账号" />
                        <Step title="资质认证" />
                        <Step title="创建角色" />
                        <Step title="完成" />
                    </Steps>
                </Row>
                <Row type="flex" justify="center" className="type-wrap">
                    <Col span={12}>
                        <Row className="title-wrap"><span>选择服务者类型</span></Row>
                        <Row type="flex" justify="space-between">
                            {cols}
                        </Row>
                        <Row className="btn-wrap">
                            <Button size="large" type="primary" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit') } }>上一步</Button>
                            <Button className="next" size="large" type="primary" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit/step22?userid='+this.userid+'&id=' + this.id) } }>下一步</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
Step21.contextTypes = {
    router: React.PropTypes.object
};
export default Step21;
