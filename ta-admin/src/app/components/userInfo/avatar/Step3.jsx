import * as React from "react";
import { Steps, Form, Row, Col, Input, Button, Select, Upload, Icon, message } from "antd";
import * as request from "superagent";
import "./Step3.less";
class Step3 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            imgUrl: '',
            allRole: [],
            ajaxData: {}
        };
    }
    updateAjaxData(name, value) {
        console.log(value);
        let newData = this.state.ajaxData;
        newData[name] = value;
        this.setState({
            ajaxData: newData
        });
    }
    componentWillMount() {
        request
            .post('/avatar/queryByPrfectureAndCert.do')
            .type("form")
            .send({

            })
            .end((err, res) => {
                this.setState({
                    allRole: JSON.parse(res.text)
                });
            });
    }
    handleChange(info) {
        if (info.file.status === 'done') {
            this.updateAjaxData('headIcon', info.file.response.iconId);
            this.setState({
                // Get this url from response in real world.
                imageUrl: info.file.response.url,
            });
        }
    }
    next() {
        let data = this.state.ajaxData;
        if (!data.name || !data.prototypeid || !data.headIcon || !data.selfDesc) {
            message.error('请输入所有必填项！');
            return;
        }
        request
            .post('/avatar/addAvatar.do')
            .type("form")
            .send({
                actorid:window.location.href.split('=')[1],
                name: data.name,
                prototypeid: data.prototypeid,
                headIcon: data.headIcon,
                selfDesc: data.selfDesc
            })
            .end((err, res) => {
                if (err) {
                    message.error('出错')
                } else {
                    let data = JSON.parse(res.text);
                    if (data.status == 1) {
                        this.context.router.push('/workbench/userInfo/avatar/edit/step4?userid='+window.location.href.split('=')[1])
                    } else {
                        message.error(data.msg);
                    }
                }
            });
    }
    render() {
        const Option = Select.Option;
        const Step = Steps.Step;
        const FormItem = Form.Item;
        const imageUrl = this.state.imageUrl;
        let options = this.state.allRole.map((v, i) => {
            return <Option key={i.toString()} value={v.id.toString()}>{v.name}</Option>
        });

        return (
            <div className="content-wrap">
                <Row className="step-wrap">
                    <Steps current={1}>
                        <Step title="验证或注册账号" />
                        {
                            // <Step title="资质认证" />
                        }
                        <Step title="创建角色" />
                        <Step title="完成" />
                    </Steps>
                </Row>
                <Row type="flex" justify="center" className="Form-wrap" id="components-upload-demo-inplace">
                    <Col span={12}>
                        <Form layout="horizontal">
                            <FormItem
                                required
                                label="昵称"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入昵称" onChange={(e) => { this.updateAjaxData('name', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                required
                                label="头像"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Upload
                                    className="avatar-uploader"
                                    name="fileUpload"
                                    showUploadList={false}
                                    action="/medias/uploadIcon/head"
                                    onChange={this.handleChange.bind(this)}
                                    >
                                    {
                                        imageUrl ?
                                            <img src={imageUrl} role="presentation" className="avatar" /> :
                                            <Icon type="plus" className="avatar-uploader-trigger" />
                                    }
                                </Upload>
                            </FormItem>
                            <FormItem
                                required
                                label="角色类别"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Select onChange={(value) => { this.updateAjaxData('prototypeid', value) } }
                                    placeholder="请选择角色"
                                    >
                                    {options}
                                </Select>
                            </FormItem>
                            <FormItem
                                required
                                label="自我介绍"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input rows={4} type="textarea" placeholder="请输入服务者个人简介" onChange={(e) => { this.updateAjaxData('selfDesc', e.target.value) } } />
                            </FormItem>
                        </Form>
                        <Row className="btn-wrap bottom">
                            <Button type="primary" size="large" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit') } }>上一步</Button>
                            <Button className="next" size="large" type="primary" onClick={() => { this.next() } }>下一步</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
Step3.contextTypes = {
    router: React.PropTypes.object
};
export default Step3;
