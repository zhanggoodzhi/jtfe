import * as React from "react";
import { Link } from "react-router";
import { Card, Timeline, Row, Col,Modal } from "antd";
import * as request from "superagent";
import "./Detail.less";
class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ajaxData: {
                userBase: {},
                avatars: [],
                certifis: [],
                userWallet: {},
                cert:{}
            }
        };
    }
    cleanData(data) {
        for (let i in data) {
            if (!data[i] && data[i] !== 0) {
                data[i] = '无';
            }
        }
    }
    componentWillMount() {
        const id = window.location.href.split('=')[1];
        request
            .post('/account/detail.do')
            .type("form")
            .send({
                id: id
            })
            .end((err, res) => {
                this.setState({
                    ajaxData: JSON.parse(res.text).account
                });
            });
    }
    //显示证书详情
    showCerti(certid){
        request
            .post('/certification/certinfo.do')
            .type("form")
            .send({
                certid:certid
            })
            .end((err, res) => {
                if(!err){
                    this.setState({
                        cert: JSON.parse(res.text)
                    },()=>{
                        Modal.info({
                            title: '证书详情',
                            content: (
                                <div>
                                    <p style={{marginBottom:20}}>{this.state.cert.name}:&nbsp;&nbsp;{this.state.cert.instruction}</p>
                                    <div className='cert-intro-title ant-col-24 ant-col-24'>
                                        <div style={{display:'inline-block',float:'left'}}><img width="20px" height="20px" src="/resources/image/privilege.png"/></div>
                                        <div className='charname'>证书权限</div>
                                    </div>
                                    <div dangerouslySetInnerHTML={{__html: `${this.state.cert.hasChar}`}} />
                               </div>
                            ),
                            onOk() {},
                            width:930
                        });
                    });
                    console.log(JSON.parse(res.text))
                }
            });
    }
    render() {
        const data = this.state.ajaxData;
        console.log("=============data===============");
        console.log(data);
        const userBase = data.userBase;
        this.cleanData(data);
        this.cleanData(userBase);
        const isvip = data.isvip == true ? <p className="image-p"><img src="/resources/image/account/vip.png" /><span className="title">会员到期时间: </span><span className="text time">{data.null}</span></p> : <p>非会员</p>;
        const avatar = data.avatars.length == 0 ? <span className="text">无</span> : data.avatars.map((v) => {
            return <span className="text" key={v.id}>{v.name}</span>
        });
        const certificate = data.certifis.length == 0 ? <span className="text">无</span> : data.certifis.map((v) => {
            return <Link className="text" key={v.id} onClick={()=>{this.showCerti(`${v.id}`)}}>{v.name}</Link>
        });
        return (
            <Card className="blue-card" title="详细信息">
                <Row className="top-row" type="flex" justify="space-around">
                    <Col className="big-img-wrap" span={4}>
                        <img src={data.headUrl} />
                    </Col>
                    <Col span={6} className="right-border">
                        <h2>{data.name}</h2>
                        {isvip}
                        <p><span className="title">账号: </span><span className="text">{data.id}</span></p>
                        <p><span className="title">身份: </span><span className="text">{data.roleTypeName}</span></p>
                    </Col>
                    <Col span={5}>
                        <p><span className="title">生日: </span><span className="text">{userBase.birthday}</span></p>
                        <p><span className="title">星座: </span><span className="text">{userBase.zodiacName}</span></p>
                        <p><span className="title">婚姻: </span><span className="text">{userBase.marriageName}</span></p>
                        <p><span className="title">血型: </span><span className="text">{userBase.bloodTypeName}</span></p>
                    </Col>
                    <Col span={5}>
                        <p><span className="title">学历: </span><span className="text">{userBase.educationName}</span></p>
                        <p><span className="title">行业: </span><span className="text">{userBase.jobspecialtyName}</span></p>
                        <p><span className="title">工作: </span><span className="text">{userBase.jobdetail}</span></p>
                        <p><span className="title">手机号码: </span><span className="text telephone">{data.phoneNo}</span></p>
                    </Col>
                </Row>
                <Timeline>
                    <Timeline.Item><span className="title">角色: </span>{avatar}</Timeline.Item>
                    <Timeline.Item><span className="title">证书: </span>{certificate}</Timeline.Item>
                    <Timeline.Item><span className="title">入驻信息: </span><span className="text">{data.ruzhu}</span></Timeline.Item>
                    <Timeline.Item><span className="title">认证信息: </span><span className="text">{data.renzheng}</span></Timeline.Item>
                    <Timeline.Item>
                        <Row type="flex" justify="space-between">
                            <Col className="blue image-wrap" span={7} onClick={() => { this.context.router.push('/workbench/record/order?userid='+data.id) } }>
                                <p className="number">{data.ordercount}</p>
                                <p className="bottom-title">订单数</p>
                            </Col>
                            <Col className="orange image-wrap" span={7} onClick={() => { this.context.router.push('/workbench/userInfo/account/wallet?id=' + data.id) } }>
                                <p className="number">{data.userWallet=='无'?0:data.userWallet.quantity}</p>
                                <p className="bottom-title">钱包余额</p>
                            </Col>
                            <Col className="red image-wrap" span={7} onClick={() => { this.context.router.push('/workbench/review/article?userid='+data.id) } }>
                                <p className="number">{data.articlecount}</p>
                                <p className="bottom-title">文章数</p>
                            </Col>
                        </Row>
                    </Timeline.Item>
                </Timeline>
            </Card>
        );
    }
}
Detail.contextTypes = {
    router: React.PropTypes.object
};
export default Detail;
