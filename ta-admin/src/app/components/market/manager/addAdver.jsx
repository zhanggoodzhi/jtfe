import * as React from "react";
import {Button,Row,Col,Form,Icon,Input,Select,Upload,Radio,Modal} from 'antd';
import './editAdver.less';


class AddAdver extends React.Component{
    constructor(props){
        super(props);
        this.state={
            previewVisible:false,
            previewImage:''
        }

    }
    handleCancel() {
        this.setState({
            previewVisible: false,
        });
    }
    handleSubmit(){
        console.log(this.props.form.getFieldsValue());
    }
    render(){
        const FormItem=Form.Item;
        const { getFieldDecorator } = this.props.form;
        const RadioGroup = Radio.Group;
        const Option=Select.Option;
        const props = {
            action: '/upload.do',
            listType: 'picture-card',
            onPreview: (file) => {
                this.setState({
                    previewImage: file.url,
                    previewVisible: true,
                })
            }
        }
        return(
            <div>
                <Form layout="vertical">
                    <Row type="flex" align="middle" justify="start" style={{marginBottom:10}}>
                        <h1>新增横幅广告</h1>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={24} xs={24} md={7} lg={7}>
                            <FormItem label="选择触发事件类型">
                                {getFieldDecorator('type')(
                                    <Select placeholder="选择触发事件类型">
                                        <Option value="1">click</Option>
                                        <Option value="2">view</Option>
                                        <Option value="3">noop</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={24} xs={24} md={7} lg={7}>
                            <FormItem label="横幅名称">
                                {getFieldDecorator('bannerName')(
                                    <Input type="text"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={24} xs={24} md={8} lg={20}>
                            <FormItem label="横幅图片">
                                {getFieldDecorator('newBannerPic')(
                                    <div className="clearfix">
                                        <Upload {...props}>
                                            <Icon type="plus" />
                                            <div className="ant-upload-text">Upload</div>
                                        </Upload>
                                        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                            <img alt="example" src={this.state.previewImage} />
                                        </Modal>
                                    </div>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={24} xs={24} md={8} lg={20}>
                            <FormItem label="广告默认显示">
                                {getFieldDecorator('display')(
                                    <RadioGroup>
                                        <Radio key="yes" value={'yes'}>是</Radio>
                                        <Radio key="no" value={'no'}>否</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="start">
                        <Col sm={24} xs={24} md={8} lg={20}>
                            <Button type="primary" onClick={()=>{this.handleSubmit()}}>提交</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}
AddAdver.propTypes={
    form:React.PropTypes.object
}
const AddAdverForm=Form.create({})(AddAdver);
export default AddAdverForm;