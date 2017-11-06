import * as React from "react";
import { Row, Col } from 'antd';
import request from 'superagent';

class RoleDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roleDetail: null
        };
    }

    componentWillMount() {
        console.debug('componentWillMount');
        request.get(`/security/roles/${this.props.routeParams.id}/detail`).end(function (err, res) {
            console.debug(res.text);
            if (err) {
                console.error('error');
            } else {
                this.setState({
                    roleDetail: res.body
                });

                console.debug(this.state.roleDetail);
            }
        }.bind(this));
    }

    render() {
        if (this.state.roleDetail) {
            return (
                <div>
                    <Row>
                        <Col span={24}>角色信息</Col>
                    </Row>
                    <Row>
                        <Col span={24}>ID：{this.state.roleDetail.role.id}</Col>
                    </Row>
                    <Row>
                        <Col span={24}>名称：{this.state.roleDetail.role.name}</Col>
                    </Row>
                    <Row>
                        <Col span={24}>备注：{this.state.roleDetail.role.desc}</Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col span={24}>已分配下列权限</Col>
                    </Row>
                    {
                        this.state.roleDetail.permissions.map(function (it) {
                            return <Row key={it.id}>
                                <Col span={4}>{it.id}</Col>
                                <Col span={10}>{it.name}</Col>
                                <Col span={10}>{it.desc}</Col>
                            </Row>
                        }.bind(this))
                    }
                    <hr />
                    <Row>
                        <Col span={24}>已分配给下列用户</Col>
                    </Row>
                    {
                        this.state.roleDetail.users.map(function (it) {
                            return <Row key={it.id}>
                                <Col span={4}>{it.id}</Col>
                                <Col span={20}>{`${it.name}[${it.username}]`}</Col>
                            </Row>
                        }.bind(this))
                    }
                </div>
            );
        } else {
            return <div>角色信息拉取失败，请刷新页面重新加载。</div>
        }
    }

}

export default RoleDetail;