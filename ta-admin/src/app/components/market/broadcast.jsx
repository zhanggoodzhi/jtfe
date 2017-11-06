import * as React from "react";
import {Table,Button,Row,Col,DatePicker,Form,Icon,Select} from 'antd';
import {get} from "superagent";
import './Broadcast.less';

const broadcast_columns=[
    {
        title:'ID',
        key:'id'
    },{
        title:'目标',
        key:'purpose'
    },{
        title:'消息类型',
        key:'type'
    },{
        title:'推送内容',
        key:'ctx'
    },{
        title:'性别',
        key:'sex'
    },{
        title:'状态',
        key:'status'
    },{
        title:'推送时间',
        key:'time'
    }];
class Broadcast extends React.Component{
    constructor(props){
        super(props);
        this.state={
            broadcast_data:[]
        };
    }
    fetchSources(){
        get("/security/users")
            .set("Content-type", "applicatin/json")
            .end((err, res) => {
                if (!err) {
                    console.log(res.body);

                }
            })
    }
    searchHandle(){
        console.log(this.props.form.getFieldsValue());
    }
    clearHandle(){
        this.props.form.resetFields();
    }
    render(){
        const FormItem=Form.Item;
        const Option=Select.Option;
        const {getFieldDecorator}=this.props.form;
        const formItemLayout={
            wrapperCol:{
                span:21
            }
        }
        return(
            <div>
                <Form layout="horizontal">
                    <Row type="flex" align="middle" justify="start">
                         <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('purpose')(
                                    <Select placeholder='目标'>
                                        <Option value="10">目标</Option>
                                        <Option value="20">全部用户</Option>
                                        <Option value="30">按分组选择</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('type')(
                                    <Select placeholder='消息类型'>
                                        <Option value="10">text</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('sex')(
                                    <Select placeholder='性别'>
                                        <Option value="10">男</Option>
                                        <Option value="20">女</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem {...formItemLayout}>
                                {getFieldDecorator('status')(
                                    <Select placeholder='推送状态'>
                                        <Option value="10">准备</Option>
                                        <Option value="20">完成</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem>
                                {getFieldDecorator('startTime')(
                                <DatePicker style={{width:'85%'}} placeholder="起始时间"/>) }
                            </FormItem>
                        </Col>
                        <Col sm={12} xs={24} md={6} lg={6}>
                            <FormItem>
                                {getFieldDecorator('endTime')(
                                <DatePicker style={{width:'85%'}} placeholder="结束时间"/>)}
                            </FormItem>
                        </Col>
                        <Col sm={24} xs={24} md={12} lg={12} className="btn-wrap">
                        <Button type="primary" onClick={()=>this.searchHandle()} style={{marginRight: 10 }}><Icon type="search" />查询</Button>
                        <Button type="ghost" onClick={()=>this.clearHandle()} style={{marginRight: 10 }}><Icon type="delete" />清空</Button></Col>
                    </Row>
                </Form>
                <Table columns={broadcast_columns} dataSource={this.state.broadcast_data}/>
            </div>
        );
    }
}
Broadcast.propTypes={
    form:React.PropTypes.object
}
const BroadcastForm=Form.create({})(Broadcast);
export default BroadcastForm;