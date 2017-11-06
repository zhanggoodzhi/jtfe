import * as React from "react";
import { Table,Row, Col} from "antd";
import {get} from "superagent";
import "./Certificate.less";
const data_account=[
    {
        title:'用户名',
        value:'吖'
    },
    {
        title:'手机号码',
        value:'002384783754325'
    },
    {
        title:'国际',
        value:'中国'
    },
    {
        title:'用户名',
        value:'吖'
    },
    {
        title:'手机号码',
        value:'002384783754325'
    },
    {
        title:'国际',
        value:'中国'
    }
];
const professional_columns=[{
        title: '资格名称',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '证书编号',
        dataIndex: 'no',
        key: 'no',
    }, {
        title: '扫描件',
        key: 'file',
        render: (text) =>{return <a href="javascript:;">{text.file}</a>}
    }];

const professional_data=[{
    name:'国家二级心理咨询师',
    no:'mk3245',
    file:'国家二级心理咨询师证书.pdf'
}];
const experience_columns=[{
    title: '单位名称',
    dataIndex: 'name',
    key: 'name'
    }, {
    title: '职位职称',
    dataIndex: 'no',
    key: 'no',
    }, {
    title: '起始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    }, {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    }];
const train_columns=[{
    title: '课程名称',
    dataIndex: 'name',
    key: 'name'
    }, {
    title: '培训机构',
    dataIndex: 'no',
    key: 'no',
    }, {
    title: '起始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    }, {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    }, {
    title: '扫描件',
    key: 'file',
    render: (text) =>{return <a href="javascript:;">{text.file}</a>}
    }];
const attachment_columns=[{
    title: 'ID',
    dataIndex: 'name',
    key: 'name'
    }, {
    title: '文件名',
    dataIndex: 'no',
    key: 'no',
    }, {
    title: '扫描件',
    key: 'file',
    render: (text) =>{return <a href="javascript:;">{text.file}</a>}
    }];
class Certificate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_account:[{title:'',value:''}],
            professional_data:[]
        };
    }
    componentWillMount(){
         this.getCertificateSource();
     }
     //获取相关财务信息数据源
    getCertificateSource(){
         /*get("/account/wallet")
        .set("Content-type", "application/json")
        .end((err, res) => {
            if (!err) {
                this.setState({data_chart: res });
            }
        });*/
        //模拟后台数据，获取到后台真是数据后删除
        this.setState({data_account:data_account,professional_data:professional_data });
    }
    render() {

        const account=this.state.data_account.map((v)=>{
            return <Col span="8"><p className="account-detail">{v.title}：<span>{v.value}</span></p></Col>;
        });
        return (
            <div>
                <p className="top-title" >证书详情</p>
                <div className="box-border">
                    <p className="account-title">基本信息：</p>
                    <Row type="flex" justify="center">
                        {account}
                    </Row>
                    <Row type="flex" justify="center">
                        <Col span="10"><p className="account-img">身份证正面<br/><img src="" width='300' height='150'/></p></Col>
                        <Col span="10"><p className="account-img">身份证反面<br/><img src="" width='300' height='150'/></p></Col>
                    </Row>
                    <p className="account-title">专业资格证明：</p>
                    <Table columns={professional_columns} dataSource={this.state.professional_data} bordered/>
                    <p className="account-title">工作经历：</p>
                    <Table columns={experience_columns} dataSource={this.state.data_deal} bordered/>
                    <p className="account-title">培训经历：</p>
                    <Table columns={train_columns} dataSource={this.state.data_deal} bordered/>
                    <p className="account-title">附件：</p>
                    <Table columns={attachment_columns} dataSource={this.state.data_deal} bordered/>
                </div>
            </div>
        );
    }
}
export default Certificate;

