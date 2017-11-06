import * as React from "react";
import {Table,Button,Row,Col,DatePicker,Form,Icon,Input,Select,Badge,Modal} from 'antd';
import * as request from "superagent";
import moment from "moment";
import "./Withdraw.less";

class Withdraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_data: [],
            formData:{owner:'',startDay:'',endDay:'',status:'',phoneNo:''},
            detailVisible:false,
            bill_data:{},
            cash_data:{},
            wallet_data:{},
            owner_data:{},
            wcancleVisible:'none',
            rowid:'',
            total:0
        };
    }
    componentWillMount() {
        this.fetchSources();
    }
    /**
     * 获取订单数据源
     */
    fetchSources() {
        const sendData = Object.assign({
            page: 1,
            rows: 20,
            order: "desc",
            sort: "id"
        }, this.state.formData);
        request
            .post('/bill/cashlist')
            .type("form")
            .send(sendData)
            .end((err,res)=>{
                if(!err){
                    this.setState({
                        list_data:JSON.parse(res.text).rows,
                        total:JSON.parse(res.text).total
                    });
                }
            })
    }
    searchHandle() {
        const formFields = this.props.form.getFieldsValue();
        const sendData = Object.assign({
            page: 1,
            rows: 20,
            order: "desc",
            sort: "id"
        }, this.state.formData);
        sendData.owner = formFields.owner;
        sendData.phoneNo = formFields.phoneNo;
        sendData.status = formFields.status;
        sendData.startDay = formFields.startDay === undefined ? '' : moment(formFields.startDay).format('YYYY-MM-DD HH:mm:ss');
        sendData.endDay = formFields.endDay === undefined ? '' : moment(formFields.endDay).format('YYYY-MM-DD HH:mm:ss');
        this.setState(
            { formData: sendData }, () => {
                this.fetchSources();
            });
    }
    clearHandle() {
        this.props.form.resetFields();
        this.searchHandle();
    }
    //查看详情
    detail(record){
        console.log(record);
        this.setState({ detailVisible: true,rowid:record.id });
        request
            .post('/bill/cashdetail')
            .type("form")
            .send({id:record.id})
            .end((err,res)=>{
                if(!err){
                    this.setState({
                        bill_data:JSON.parse(res.text).bill,
                        cash_data:JSON.parse(res.text).cash,
                        wallet_data:JSON.parse(res.text).wallet,
                        owner_data:JSON.parse(res.text).bill.owner
                    });
                }
            })
    }
    handleDetailCancel() {
        this.setState({ detailVisible: false });
    }
    handleOk() {
        this.setState({ detailVisible: false});
    }
    //不同意提现
    refuse(){
        this.setState({
            wcancleVisible:'block'
        });
    }
    //不同意提现之取消按钮---未完善，后续处理
    wcancle(){
        this.setState({
            wcancleVisible:'none'
        });
    }
    //不同意提现之确认按钮
    wok(){
        this.setState({
            wcancleVisible:'none'
        });
        const formFields = this.props.form.getFieldsValue();
        const sendData={id:this.state.rowid,comment:formFields.comment,status:'2'};
        request
            .post('/bill/cashupdate')
            .type("form")
            .send(sendData)
            .end((err,res)=>{
                console.log(res);
                this.setState({
                    detailVisible:false
                });
            })
    }
    render() {
        const Option = Select.Option;
        const FormItem = Form.Item;
        const formItemLayout = {
            wrapperCol: {
                span: 21
            }
        };
        const { getFieldDecorator  } = this.props.form;
        const table_withdraw_columns = [
        {
            title: '订单ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '昵称',
            dataIndex: 'owner.name',
            key: 'owner.name',
        }, {
            title: '提现时间',
            dataIndex: 'createtime',
            key: 'createtime',
            sorter: (a, b) => a.createtime - b.createtime
        }, {
            title: '提现金额',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.money - b.money
        }, {
            title: '提现进度操作',
            dataIndex: 'statusName',
            key: 'statusName',
            render:(text)=>{
                let str='';
                switch(text){
                    case '交易成功':
                        str=<Badge status="success" text="等待付款" />;
                    break;
                    case '交易失败':
                        str=<Badge status="error" text="等待付款" />;
                    break;
                    case '等待付款':
                        str=<Badge status="processing" text="等待付款" />;
                    break;
                }
                return str;
            }
        },{
            title: '查看详情',
            key: 'opt',
            render:(record)=>{
                return <a onClick={()=>{this.detail(record)}}>查看详情</a>
            }
        }];
        //提现状态
        let withdrawStatus;
        let failReason;
        let withProcess;
        switch(this.state.bill_data.status){
            case 1:
                withdrawStatus='提现成功';
            break;
            case 2:
                withdrawStatus='提现失败';
                failReason=<tr>
                                <td className='tdcs'><strong>失败原因:</strong></td>
                                <td>{this.state.bill_data.comment}</td>
                            </tr>;
            break;
            case 0:
                withdrawStatus='未受理';
                withProcess=<tr><td></td><td><Button>同意</Button>&nbsp;&nbsp;<Button onClick={()=>{this.refuse()}}>不同意</Button></td></tr>
            break;
        }
        return (
            <div>
                <Form layout="horizontal">
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('owner')(
                                <Input type="text" placeholder="昵称/TA号"/>)}
                            </FormItem>
                        </Col>
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('phoneNo')(
                                <Input type="text" placeholder="手机号码"/>)}
                            </FormItem>
                        </Col>
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('status')(
                                    <Select placeholder="提现进度">
                                        <Option value="1">交易成功</Option>
                                        <Option value="2">交易失败</Option>
                                        <Option value="0">等待付款</Option>
                                    </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem >
                                {getFieldDecorator('startDay')(
                                    <DatePicker style={{ width: '85%' }}  placeholder='提现时间从'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem>
                                {getFieldDecorator('endDay')(
                                    <DatePicker style={{ width: '85%' }}  placeholder='至'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={24} xs={24} md={12} lg={12}  className="btn-wrap">
                            <Button type="primary" onClick={this.searchHandle.bind(this) } style={{marginRight: 10 }}><Icon type="search" />搜索</Button>
                            <Button type="ghost" onClick={this.clearHandle.bind(this) }><Icon type="delete" />清空</Button>
                        </Col>
                    </Row>
                </Form>
                <Table dataSource={this.state.list_data}
                    columns={table_withdraw_columns}
                    pagination={
                         {
                            total:this.state.total,
                            showTotal: () => `符合条件的条目： ${this.state.total} 条`,
                            showSizeChanger: true,
                            defaultPageSize:10,
                            onShowSizeChange: (current, pageSize) => {
                                this.setState({
                                    pagination: {
                                        current: 1,
                                        pageSize: pageSize
                                    }
                                });
                            }
                        }
                    }
                    onChange={this.fetchSources.bind(this) }/>
                <Modal key={1}
                    title="提现记录详细信息"
                    visible={this.state.detailVisible}
                    onCancel={()=>{this.handleDetailCancel()}}
                    onOk={()=>{this.handleOk()}}>
                    <table>
                        <tbody>
                            <tr>
                                <td className='tdcs'><strong>账单号：</strong></td>
                                <td>{this.state.bill_data.id}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>账单类型：</strong></td>
                                <td>{this.state.bill_data.billingTypeName}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>金额：</strong></td>
                                <td>{this.state.bill_data.quantity}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>创建时间：</strong></td>
                                <td>{this.state.bill_data.createtime}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>申请用户：</strong></td>
                                <td><img src={this.state.owner_data.headUrl} width="20" height="20"/>{this.state.owner_data.name}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>联系电话：</strong></td>
                                <td>{this.state.owner_data.phoneNo}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>用户邮箱：</strong></td>
                                <td>{this.state.owner_data.email}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>用户钱包余额：</strong></td>
                                <td>{this.state.wallet_data.quantity}TA币</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>用户选择的提现方式：</strong></td>
                                <td>{this.state.cash_data.payTypeName}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>用户选择的支付账号：</strong></td>
                                <td>{this.state.cash_data.payAccount}</td>
                            </tr>
                            <tr>
                                <td className='tdcs'><strong>提现状态：</strong></td>
                                <td>{withdrawStatus}</td>
                            </tr>
                            {failReason}
                            {withProcess}
                            <tr style={{display:`${this.state.wcancleVisible}`}}>
                                <td></td>
                                <td>
                                    <Form style={{position:'relative',left:200}}>
                                        <FormItem>
                                            {getFieldDecorator('comment')(
                                                <Input type="textarea" cols={4} placeholder='请填写不同意的原因' style={{marginBottom:10,marginTop:5}}/>
                                            ) }
                                        </FormItem>
                                        <Button onClick={()=>{this.wok()}}>确定</Button>&nbsp;&nbsp;<Button onClick={()=>{this.wcancle()}}>取消</Button>
                                    </Form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Modal>
            </div>
        )
    }
}
Withdraw.propTypes = {
    form: React.PropTypes.object
};
const WithdrawForm = Form.create({})(Withdraw);
export default WithdrawForm;
