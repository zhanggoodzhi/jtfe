import * as React from "react";
import { Table, Row, Col, Form, Input, Button, Menu } from "antd";
import * as request from "superagent";
import "./Certificate.less";
class Certificate extends React.Component {
    constructor(props) {
        super(props);
        this.ajaxData=[{

        }];
        this.state = {
            current: '1',
        };
    }
    handleClick(e) {
        this.setState({
            current: e.key,
        });
    }
    render() {
        const SubMenu = Menu.SubMenu;
        return (
            <div className="user-list">
                <Row>
                    <Col span={6}>
                        <Menu onClick={this.handleClick.bind(this)}
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.current]}
                            mode="inline"
                            >
                            <SubMenu key="sub1" disabled="true" title={<span>证书详情</span>}>
                                <Menu.Item key="1">情感陪聊师</Menu.Item>
                                <Menu.Item key="2">心理咨询师</Menu.Item>
                                <Menu.Item key="3">职业规划师</Menu.Item>
                                <Menu.Item key="4">其他类型</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                    <Col className="detail" span={18}>
                        <h2>情感陪聊师</h2>
                        <p className="simple"><span>简介：</span><span>陪人聊天，让您不再感到孤独</span></p>
                        <p>证书权限</p>
                        <Row className="tag-wrap">
                            <Col className="tag-item" span={10}>
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                            <Col span={10} className="tag-item">
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                            <Col span={10} className="tag-item">
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                            <Col span={10} className="tag-item">
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                            <Col span={10} className="tag-item">
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                            <Col span={10} className="tag-item">
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                            <Col span={10} className="tag-item">
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                            <Col span={10} className="tag-item">
                                <div className="name">心理咨询男</div>
                                <div className="status">未获得</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Certificate;
