import * as React from "react";
import { Table} from "antd";
import * as request from "superagent";
import "./Wallet.less";

class Wallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cash_data:[],
            bill_data:[],
            rest:''
        };
    }
     componentWillMount(){
         this.getCashDetail();
         this.getWalletDetail();
     }
     //获取财务信息
    getCashDetail(){
        const userid=window.location.href.split('=')[1];
        request
            .post('/wallet/detail.do')
            .type("form")
            .send({userid:userid})
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        "cash_data":JSON.parse(res.text).cashlist,
                        "rest":JSON.parse(res.text).wallet.quantity
                 });
                }
            });
    }
    //获取相关财务信息数据源
    getWalletDetail(pagination){
        const userid=window.location.href.split('=')[1];
        const sendData = {
            ownerId:userid,
            page: 1,
            rows:15,
            order: "desc",
            sort: "id"
        };
        if (pagination && pagination.current) {
            sendData.page = pagination.current;
        }
        request
            .post('/bill/queryList')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        "bill_data":JSON.parse(res.text).rows,
                        pagination:{
                            total:res.body.total,
                            pageSize:15
                        }
                    });
                }
            });
    }

    render() {
        const cash_columns=[];
        this.state.cash_data.map((v,i)=>{
            cash_columns.push({
                title:v.payTypeName,
                dataIndex:'payAccount',
                key:i
            });
        });
        const wallet_columns = [{
            title: '支出/收入',
            dataIndex: 'incomeName',
            key: 'incomeName'
            }, {
            title: '金额',
            dataIndex: 'quantity',
            key: 'quantity',
            }, {
            title: '交易时间',
            dataIndex: 'createtime',
            key: 'createtime',
            }, {
            title: '交易状态',
            dataIndex: 'statusName',
            key: 'statusName',
            }, {
            title: '交易类型',
            dataIndex: 'billingTypeName',
            key: 'billingTypeName',
            }, {
            title: '交易评论',
            dataIndex: 'comment',
            key: 'comment',
        }];
        return (
            <div>
                <p className="top-title" >钱包信息</p>
                <div className="box-border">
                    <p className="account-title" key={1}>相关财务信息：</p>
                    <Table columns={cash_columns} dataSource={this.state.cash_data} bordered key={2} pagination={false}/>
                    <p className="account-title bills" key={3}>钱包余额及明细：<i>{this.state.rest} TA币</i></p>
                    <Table
                        columns={wallet_columns}
                        dataSource={this.state.bill_data}
                        bordered
                        key={4}
                        pagination={this.state.pagination}
                        onChange={this.getWalletDetail.bind(this)}/>
                </div>
            </div>
        );
    }
}
export default Wallet;
