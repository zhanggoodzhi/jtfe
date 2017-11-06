import * as React from "react";
import {Row,Col,Form,Upload,Button,Icon,message,Card,Table,Select,InputNumber,Input} from 'antd';
import './addCoupon.less';

class CouponDetail extends React.Component{
    render(){
        const props = {
            name: 'file',
            action: '/upload.do',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        const FormItem=Form.Item;
        return(
            <Card style={{ width:'100%',marginBottom:15 }} title='活动详情修改'>
                <Form layout="horizontal">
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                活动名称：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                新用户首次聊天免费
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                发起人：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                王玥
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                有效时间：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                开始时间 2017-01-01 14:56:15.0 - 结束时间 2017-01-01 14:56:19.0
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                注释：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                新用户首次聊天免费
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                当前状态：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                已过期
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                动作：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                无
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                海报缩略图：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                无
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                海报原图：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                125fdsf25
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                海报原图：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                dfsdfsdfe545gdfy5b
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                选择一个海报缩略图：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                <Upload {...props}>
                                    <Button type="ghost">
                                    <Icon type="upload" /> Click to Upload
                                    </Button>
                                </Upload>
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <FormItem style={{width:'60%'}}>
                            <Col sm={6} xs={24} md={6} lg={5}>
                                选择一个海报原图：
                            </Col>
                            <Col sm={18} xs={24} md={18} lg={19}>
                                <Upload {...props}>
                                    <Button type="ghost">
                                    <Icon type="upload" /> Click to Upload
                                    </Button>
                                </Upload>
                            </Col>
                        </FormItem>
                    </Row>
                    <Row type="flex" align="middle" justify="end">
                        <Col sm={24} xs={24} md={24} lg={24}>
                            <Button type="primary">上传文件</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    }
}
CouponDetail.propTypes={
    form:React.PropTypes.object
}
const CouponDetailForm=Form.create({})(CouponDetail);

const coupon_columns=[
    {
        title:'优惠券类型',
        key:'type',
        dataIndex:'type'
    },
    {
        title:'适用范围',
        key:'range',
        dataIndex:'range'
    },
    {
        title:'使用数量',
        key:'amount',
        dataIndex:'amount'
    },
    {
        title:'操作',
        key:'opt',
        render:()=>{return <a href="javascript:;">删除</a>}
    }
];
const data=[
    {
        type:'九折打折券',
        range:'心理咨询',
        amount:'适用 6张'
    },{
        type:'九折打折券',
        range:'情感陪聊',
        amount:'适用 6张'
    },{
        type:'十元抵用券',
        range:'情感陪聊',
        amount:'适用 1张'
    }
];
class AddCoupon extends React.Component{
    constructor(props){
        super(props);
        this.state={
            coupon_data:data
        };
    }

    render(){
        const FormItem=Form.Item;
        const Option=Select.Option;
        const {getFieldDecorator}=this.props.form;
        const formItemLayout={
            labelCol:{span:8},
            wrapperCol:{span:14}
        }
        return(
            <Card style={{ width:'100%' }} title='折扣券修改'>
                <Table columns={coupon_columns} dataSource={this.state.coupon_data}/>
                <Card style={{ width:'49%',float:'left',marginBottom:10 }} title='添加打折券'>
                    <Form layout="horizontal">
                        <Row type="flex" align="middle" justify="start">
                            <Col sm={12} xs={24} md={6} lg={19}>
                                <FormItem label='适用范围' {...formItemLayout}>
                                    {getFieldDecorator('range',{ initialValue: '情感陪聊' })(
                                    <Select>
                                        <Option value="10">情感陪聊</Option>
                                        <Option value="20">心理咨询</Option>
                                        <Option value="50">所有</Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" align="middle" justify="start">
                            <Col sm={12} xs={24} md={6} lg={19}>
                                <FormItem label='折扣比例' {...formItemLayout}>
                                    {getFieldDecorator('discount',{ initialValue: '九折' })(
                                        <Select>
                                            <Option value="10">一折</Option>
                                            <Option value="20">二折</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" align="middle" justify="start">
                            <Col sm={12} xs={24} md={6} lg={19}>
                                <FormItem label='每个用户领取数量' {...formItemLayout}>
                                    {getFieldDecorator('amount',{ initialValue: '1' })(
                                        <InputNumber min={1} defaultValue={1} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" align="middle" justify="end">
                            <Col sm={12} xs={24} md={6} lg={6}>
                                <Button>添加</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card style={{ width:'49%',float:'right',marginBottom:10 }} title='添加抵用券'>
                    <Form layout="horizontal">
                        <Row type="flex" align="middle" justify="start">
                            <Col sm={12} xs={24} md={6} lg={19}>
                                <FormItem label='适用范围' {...formItemLayout}>
                                    {getFieldDecorator('range',{ initialValue: '情感陪聊' })(
                                    <Select>
                                        <Option value="10">情感陪聊</Option>
                                        <Option value="20">心理咨询</Option>
                                        <Option value="50">所有</Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" align="middle" justify="start">
                            <Col sm={12} xs={24} md={6} lg={19}>
                                <FormItem label='抵用面值' {...formItemLayout}>
                                    {getFieldDecorator('discount',{ initialValue: '10' })(
                                        <Select>
                                            <Option value="10">50</Option>
                                            <Option value="20">10</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" align="middle" justify="start">
                            <Col sm={12} xs={24} md={6} lg={19}>
                                <FormItem label='每个用户领取数量' {...formItemLayout}>
                                    {getFieldDecorator('amount',{ initialValue: '1' })(
                                        <InputNumber min={1} defaultValue={1} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" align="middle" justify="end">
                            <Col sm={12} xs={24} md={6} lg={6}>
                                <Button>添加</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Card>
        );
    }
}
AddCoupon.propTypes={
    form:React.PropTypes.object
}
const AddCouponForm=Form.create({})(AddCoupon);

class ActDetail extends React.Component{
    render(){
        return(
            <div>
                <CouponDetailForm/>
                <AddCouponForm/>
            </div>
        );
    }
}
export default ActDetail;