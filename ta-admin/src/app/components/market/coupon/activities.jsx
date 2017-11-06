import * as React from "react";
import {Row,Col,Card} from 'antd';
import {Link} from 'react-router';
import './activities.less';

class Activities extends React.Component{
    render(){
        return(
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Card title="优惠券详情" bordered={false} extra={<Link to={"/workbench/market/coupon/addCoupon"}>添加优惠券</Link>} style={{ width: 750 }}>
                    <Row type="flex" align="middle" justify="center">
                        <Col sm={6} xs={24} md={6} lg={6}>
                            活动名称：
                        </Col>
                        <Col sm={18} xs={24} md={18} lg={18}>
                            新用户首次聊天免费
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="center">
                        <Col sm={6} xs={24} md={6} lg={6}>
                            发起人：
                        </Col>
                        <Col sm={18} xs={24} md={18} lg={18}>
                            王玥
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="center">
                        <Col sm={6} xs={24} md={6} lg={6}>
                            有效时间：
                        </Col>
                        <Col sm={18} xs={24} md={18} lg={18}>
                            开始时间 2017-01-01 14:56:13.0 - 结束时间 2017-01-01 14:56:21.0
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="center">
                        <Col sm={6} xs={24} md={6} lg={6}>
                            注释：
                        </Col>
                        <Col sm={18} xs={24} md={18} lg={18}>
                            新用户首次聊天免费
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="center">
                        <Col sm={6} xs={24} md={6} lg={6}>
                            当前状态：
                        </Col>
                        <Col sm={18} xs={24} md={18} lg={18}>
                            已过期
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}
export default Activities;