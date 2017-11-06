import * as React from "react";
import { Link } from 'react-router'
import { Form, Row, Col, Input, Button, Icon, Modal, message, Upload } from "antd";
import * as request from "superagent";
import { ajax, formAjax } from "../../global/utils"
import CopyToClipboard from 'react-copy-to-clipboard';
import './WeixinIntegrate.less';
class WeixinIntegrate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled1: true,
            disabled2: true,
            disabled3: true,
            disabled4: true,
            disabled5: true,
            disabled6: true,
            ajaxData: {
                domain: '',
                serverURL: '',
                taAppId: null,
                taSecret: "",
                wxAesKey: "",
                wxAppId: "",
                wxOriginId: "",
                wxSecret: "",
                wxToken: ""
            },
            fileList: [{
                uid: -1,
                name: 'yy',
                status: 'done',
                url: 'yy'
            }],
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
    componentDidMount() {
        ajax.bind(this)('/weixin/weixinset', null, (data) => {
            for (let i in data) {
                data[i] = data[i] == null ? '' : data[i];
            }
            this.setState({
                ajaxData: data
            });
        });
        request
            .get('/weixin/hasWxVerify')
            .end((err, res) => {
                let url = JSON.parse(res.text).url
                if (url !== null) {
                    this.setState({
                        fileList: [{
                            uid: -1,
                            name: url.split('download/')[1],
                            status: 'done',
                            url: url,
                        }]
                    })
                }
            });
    }
    save() {
        let data = this.state.ajaxData;
        for (let i = 1; i <= 5; i++) {
            if (this.state['disabled' + i] == false) {
                message.error('请全部确定后再保存');
                return;
            }
        }
        formAjax.bind(this)('确定要保存并更新数据吗？', '/weixin/save', {
            wxAppId: data.wxAppId,
            wxSecret: data.wxSecret,
            wxToken: data.wxToken,
            wxOriginId: data.wxOriginId,
            wxAesKey: data.wxAesKey
        });
    }
    handleChange(info) {
        console.log(info);
        if (info.file.response && typeof info.file.response !== "string") {
            message.error(info.file.response.msg)
            return;
        }
        let fileList = info.fileList;
        fileList = fileList.map((file) => {
            if (file.response) {
                message.success('上传成功');
                file.url = file.response;
            }
            return file;
        });
        fileList = fileList.slice(-1);
        this.setState({ fileList });
    }
    render() {
        const FormItem = Form.Item;
        const data = this.state.ajaxData;
        return (
            <div className="weixinIntegrate">
                <Row style={{ marginTop: 15 }}><Icon type="question-circle-o" /><Link style={{ marginLeft: 5 }} to={'/workbench/weixin/integrate/step1'}>查看对接说明</Link></Row>
                <Row type="flex" justify="center" className="Form-wrap mt">
                    <Form className="form">
                        <Row style={{ margin: '15px 0' }}><h3>一：将以下两条复制到微信公众平台相应位置：</h3></Row>
                        <FormItem
                            label="域名"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            >
                            <Row>
                                <Col>
                                    <p>{data.domain}</p>
                                    <CopyToClipboard text={data.domain}>
                                        <Button style={{ marginLeft: 10 }} >复制</Button>
                                    </CopyToClipboard>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            label="URL(服务器地址)"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            >
                            <p>{data.serverURL}</p>
                            <CopyToClipboard text={data.serverURL}>
                                <Button style={{ marginLeft: 10 }} >复制</Button>
                            </CopyToClipboard>
                        </FormItem>
                        <Row style={{ margin: '15px 0' }}><h3>二：从微信公众平台相应位置获取以下五条：</h3></Row>
                        <FormItem
                            label="Token(微信令牌)"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            >
                            {
                                this.state.disabled1 ?
                                    <p>{data.wxToken}</p>
                                    :
                                    <Input style={{ width: 570 }} placeholder="请输入Token(令牌)" value={data.wxToken} onChange={(e) => { this.updateAjaxData('wxToken', e.target.value) } } />
                            }
                            <Button onClick={() => { this.setState({ disabled1: !this.state.disabled1 }) } } style={{ marginLeft: 10 }} >{this.state.disabled1 ? '修改' : '确定'}</Button>
                        </FormItem>
                        <FormItem
                            label="微信应用ID(AppId)"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            >
                            {
                                this.state.disabled3 ?
                                    <p>{data.wxAppId}</p>
                                    :
                                    <Input style={{ width: 570 }} placeholder="请输入微信应用ID(AppId)" value={data.wxAppId} onChange={(e) => { this.updateAjaxData('wxAppId', e.target.value) } } />
                            }
                            <Button onClick={() => { this.setState({ disabled3: !this.state.disabled3 }) } } style={{ marginLeft: 10 }} >{this.state.disabled3 ? '修改' : '确定'}</Button>
                        </FormItem>
                        <FormItem
                            label="微信应用密钥"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            >
                            {
                                this.state.disabled4 ?
                                    <p>{data.wxSecret}</p>
                                    :
                                    <Input style={{ width: 570 }} placeholder="请输入微信应用密钥" value={data.wxSecret} onChange={(e) => { this.updateAjaxData('wxSecret', e.target.value) } } />
                            }
                            <Button onClick={() => { this.setState({ disabled4: !this.state.disabled4 }) } } style={{ marginLeft: 10 }} >{this.state.disabled4 ? '修改' : '确定'}</Button>
                        </FormItem>
                        <FormItem
                            label="微信原始ID"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            >
                            {
                                this.state.disabled5 ?
                                    <p>{data.wxOriginId}</p>
                                    :
                                    <Input style={{ width: 570 }} placeholder="请输入微信原始ID" value={data.wxOriginId} onChange={(e) => { this.updateAjaxData('wxOriginId', e.target.value) } } />
                            }
                            <Button onClick={() => { this.setState({ disabled5: !this.state.disabled5 }) } } style={{ marginLeft: 10 }} >{this.state.disabled5 ? '修改' : '确定'}</Button>
                        </FormItem>
                        <FormItem
                            label="消息加解密密钥"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            >
                            {
                                this.state.disabled6 ?
                                    <p>{data.wxAesKey}</p>
                                    :
                                    <Input style={{ width: 570 }} placeholder="请输入消息加解密密钥" value={data.wxAesKey} onChange={(e) => { this.updateAjaxData('wxAesKey', e.target.value) } } />
                            }
                            <Button onClick={() => { this.setState({ disabled6: !this.state.disabled6 }) } } style={{ marginLeft: 10 }} >{this.state.disabled6 ? '修改' : '确定'}</Button>
                        </FormItem>
                        <div className="btn-wrap mt" style={{ textAlign: 'center' }}>
                            <Button size="large" type="primary" onClick={this.save.bind(this)}>保存</Button>
                        </div>
                        <Row style={{ margin: '20px 0' }}><h3>三：按步骤：微信公众平台-->公众号设置-->功能设置-->业务域名/JS接口安全域名/网页授权域名-->设置后弹出的页面下载txt,然后通过下面的按钮上传：</h3></Row>
                        <FormItem
                            label="MP_verify_xxxxxxxxxxxxxxxx.txt文件"
                            labelCol={{ span: 10 }}
                            wrapperCol={{ span: 10 }}
                            >
                            <Upload
                                action='/weixin/uploadtxt'
                                accept='text/plain'
                                name="upload"
                                onPreview={(file) => { window.open(file.url) } }
                                onChange={this.handleChange.bind(this)}
                                fileList={this.state.fileList}>
                                <Button type="ghost">
                                    <Icon type="upload" />上传
                                </Button>
                            </Upload>
                        </FormItem>
                    </Form>
                </Row>
            </div >
        );
    }
}
WeixinIntegrate.propTypes = {
    setLoading: React.PropTypes.func,
};
export default WeixinIntegrate;
