import * as React from "react";
import { Steps, Form, Row, Col, Input, Button, Select, Upload, Icon, message, DatePicker } from "antd";
import * as request from "superagent";
import "./Step22.less";
import moment from 'moment';
class Step22 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.typeId = window.location.href.split('?')[1].split('&')[1].split('=')[1];
        this.state = {
            certificateCount: 1,
            workCount: 1,
            trainCount: 1,
            otherCount: 1,
            ajaxData: {
                id: '',
                name: '',
                phone: '',
                country: '',
                city: '',
                identity: '',
                identityFront: '',
                identityBehind: '',
                certificate: [
                    {
                        id: '',
                        name: '',
                        number: '',
                        scanPic: '',
                    }
                ],
                work: [
                    {
                        id: '',
                        organization: '',
                        job: '',
                        beginTime: '',
                        endTime: '',
                    }
                ],
                train: [
                    {
                        id: '',
                        filename: '',
                        courseName: '',
                        institution: '',
                        beginTime: '',
                        endTime: '',
                        scanPic: ''
                    }
                ],
                other: ['']
            }
        };
    }
    componentWillMount() {
        request
            .post('/baseinfo/baseuser.do')
            .type("form")
            .send({
                userid: window.location.href.split('?')[1].split('&')[0].split('=')[1]
            })
            .end((err, res) => {
                //将后台数据格式转换成前端格式
                let data = JSON.parse(res.text);
                let baseinfo = data.baseinfo;
                this.setState({
                    certificateCount: data.proQualications.length > 1 ? data.proQualications.length : 1,
                    workCount: data.workHistorys.length > 1 ? data.workHistorys.length : 1,
                    trainCount: data.trainHistorys.length > 1 ? data.trainHistorys.length : 1,
                    otherCount: data.attachs.length > 1 ? data.attachs.length : 1,
                    ajaxData: {
                        id: baseinfo.id,
                        name: baseinfo.realname,
                        phone: baseinfo.phone,
                        country: baseinfo.country,
                        city: baseinfo.city,
                        identity: baseinfo.idcard,
                        identityFront: baseinfo.idcardFront,
                        identityBehind: baseinfo.idcardBack,
                        certificate: data.proQualications,
                        work: data.workHistorys,
                        train: data.trainHistorys,
                        other: data.attachs
                    }
                });
            });
    }
    addForm(str) {
        let newCount = this.state[str + 'Count'];
        let newData = this.state.ajaxData;
        newCount++;
        let newForm = null;
        switch (str) {
            case 'certificate':
                newForm = {
                    id: '',
                    name: '',
                    number: '',
                    scanPic: '',
                };
                break;
            case 'work':
                newForm = {
                    id: '',
                    organization: '',
                    job: '',
                    beginTime: '',
                    endTime: ''
                }
                break;
            case 'train':
                newForm = {
                    id: '',
                    filename: '',
                    courseName: '',
                    institution: '',
                    beginTime: '',
                    endTime: '',
                    scanPic: ''
                }
                break;
            case 'other':
                newForm = ''
                break;
        }
        newData[str].push(newForm);
        this.setState({ [str + 'Count']: newCount });
    }
    updateAjaxData(name, value, cname, i) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            let newData = this.state.ajaxData;
            if (!cname) {
                newData[name] = value;
            } else {
                newData[name][i][cname] = value;
            }
            console.log(newData);
            this.setState({
                ajaxData: newData
            });
        }, 200);
    }
    render() {
        const Step = Steps.Step;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const data = this.state.ajaxData;
        const certificate = data.certificate;
        const work = data.work;
        const train = data.train;
        const other = data.other;


        const identityFrontprops = {
            name: 'file',
            action: '/certification/uploadImg',
            listType: 'picture',
            data: {
                type: 'front'
            },
            defaultFileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
                thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
            }],
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        const identityBehindProps = {
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
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        const certificateProps = {
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
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        const trainProps = {
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
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        const otherProps = {
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
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        const certificateItems = [];
        for (let i = 0; i < this.state.certificateCount; i++) {
            certificateItems.push(
                <div key={`certificateItem_${i}`}>
                    <FormItem
                        label="资质名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input placeholder="请输入资质名称" value={certificate[i].name} onChange={(e) => { this.updateAjaxData('certificate', e.target.value, 'name', i) } } />
                    </FormItem>
                    <FormItem
                        label="证书编号"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input placeholder="请输入证书编号" value={certificate[i].number} onChange={(e) => { this.updateAjaxData('certificate', e.target.value, 'number', i) } } />
                    </FormItem>
                    <FormItem
                        label="资质证明"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Upload {...certificateProps}>
                            <Button type="ghost">
                                <Icon type="upload" />上传文件
                            </Button>
                        </Upload>
                    </FormItem>
                </div>
            );
        }
        const workItems = [];
        for (let i = 0; i < this.state.workCount; i++) {
            workItems.push(
                <div key={`workItem_${i}`}>
                    <FormItem
                        label="公司名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input placeholder="请输入工作名称" value={work[i].organization} onChange={(e) => { this.updateAjaxData('work', e.target.value, 'organization', i) } } />
                    </FormItem>
                    <FormItem
                        label="工作职位"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input placeholder="请输入工作职位" value={work[i].job} onChange={(e) => { this.updateAjaxData('work', e.target.value, 'job', i) } } />
                    </FormItem>
                    <FormItem
                        label="工作时间从"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <DatePicker placeholder="请输入工作开始时间" value={moment(work[i].beginTime)} onChange={(date, dateString) => { this.updateAjaxData('work', dateString, 'beginTime', i) } } />
                    </FormItem>
                    <FormItem
                        label="至"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <DatePicker placeholder="请输入工作结束时间" value={moment(work[i].endTime)} onChange={(date, dateString) => { this.updateAjaxData('work', dateString, 'endTime', i) } } />
                    </FormItem>
                </div>
            );
        }
        const trainItems = [];
        for (let i = 0; i < this.state.trainCount; i++) {
            trainItems.push(
                <div key={`trainItem_${i}`}>
                    <FormItem
                        label="课程名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input placeholder="请输入课程名称" value={train[i].courseName} onChange={(e) => { this.updateAjaxData('train', e.target.value, 'courseName', i) } } />
                    </FormItem>
                    <FormItem
                        label="培训机构"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input placeholder="请输入培训机构" value={train[i].institution} onChange={(e) => { this.updateAjaxData('train', e.target.value, 'institution', i) } } />
                    </FormItem>
                    <FormItem
                        label="培训时间从"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <DatePicker placeholder="请输入培训开始时间" value={moment(train[i].beginTime)} onChange={(date, dateString) => { this.updateAjaxData('train', dateString, 'beginTime', i) } } />
                    </FormItem>
                    <FormItem
                        label="至"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <DatePicker placeholder="请输入培训结束时间" value={moment(train[i].endTime)} onChange={(date, dateString) => { this.updateAjaxData('train', dateString, 'endTime', i) } } />
                    </FormItem>
                    <FormItem
                        label="证书扫描件"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Upload {...trainProps}>
                            <Button type="ghost">
                                <Icon type="upload" />上传文件
                                    </Button>
                        </Upload>
                    </FormItem>
                </div>
            );
        }
        const otherItems = [];
        for (let i = 0; i < this.state.otherCount; i++) {
            otherItems.push(
                <div key={`otherItem_${i}`}>
                    <FormItem
                        label="附件1"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Upload {...otherProps}>
                            <Button type="ghost">
                                <Icon type="upload" />上传文件
                            </Button>
                        </Upload>
                    </FormItem>
                </div>
            );
        }
        const certificateBox = this.typeId == '2' ? [
            <Row key="1"><h3>专业资质证明（心理咨询师证书或其他）: </h3></Row>,
            <Row key="2" type="flex" justify="center" className="certificate-info-wrap info-wrap">
                <Col span={12}>
                    {certificateItems}
                    <Row className="btn-wrap">
                        <Button type="primary"
                            icon='plus'
                            onClick={() => {
                                this.addForm('certificate')
                            }
                            }>继续添加其他资质</Button>
                    </Row>
                </Col>
            </Row>
        ] : null;
        const workAndTrainBox = this.typeId == '3' ? [
            <Row key="0"><h3>工作经历: </h3></Row>,
            <Row key="1" type="flex" justify="center" className="work-info-wrap info-wrap">
                <Col span={12}>
                    {workItems}
                    <Row className="btn-wrap">
                        <Button type="primary"
                            icon='plus'
                            onClick={() => {
                                this.addForm('work')
                            }
                            }>继续添加其他工作经历</Button>
                    </Row>
                </Col>
            </Row>,
            <Row key="2"><h3>培训经历: </h3></Row>,
            <Row key="3" type="flex" justify="center" className="train-info-wrap info-wrap">
                <Col span={12}>
                    {trainItems}
                    <Row className="btn-wrap">
                        <Button type="primary"
                            icon='plus'
                            onClick={() => {
                                this.addForm('train')
                            }
                            }>继续添加其他培训经历</Button>
                    </Row>
                </Col>
            </Row>
        ] : null;
        return (
            <div className="content-wrap">
                <Row className="step-wrap">
                    <Steps current={1}>
                        <Step title="验证或注册账号" />
                        <Step title="资质认证" />
                        <Step title="创建角色" />
                        <Step title="完成" />
                    </Steps>
                </Row>
                <Form layout="horizontal">
                    <Row><h3>个人信息: </h3></Row>
                    <Row type="flex" justify="center" className="self-info-wrap info-wrap">
                        <Col span={12}>
                            <FormItem
                                required
                                label="姓名"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input value={data.name} placeholder="请输入姓名" onChange={(e) => { this.updateAjaxData('name', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                required
                                label="电话"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input value={data.phone} placeholder="请输入电话号码" onChange={(e) => { this.updateAjaxData('phone', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                label="国籍"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input value={data.country} placeholder="请选择国籍" onChange={(e) => { this.updateAjaxData('country', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                label="所在城市"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input value={data.city} placeholder="请选择所在城市" onChange={(e) => { this.updateAjaxData('city', e.target.value) } } />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row><h3>身份证信息: </h3></Row>
                    <Row type="flex" justify="center" className="identity-info-wrap info-wrap">
                        <Col span={12}>
                            <FormItem
                                required
                                label="身份证号码"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Input placeholder="请输入身份证号码" value={data.identity} onChange={(e) => { this.updateAjaxData('identity', e.target.value) } } />
                            </FormItem>
                            <FormItem
                                required
                                label="身份证正面照片"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Upload {...identityFrontprops}>
                                    <Button type="ghost">
                                        <Icon type="upload" />上传文件
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem
                                required
                                label="身份证反面照片"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                                >
                                <Upload {...identityBehindProps}>
                                    <Button type="ghost">
                                        <Icon type="upload" />上传文件
                                    </Button>
                                </Upload>
                            </FormItem>
                        </Col>
                    </Row>
                    {certificateBox}
                    {workAndTrainBox}
                    <Row><h3>其他附件（个人简历、培训证明或其他相关证书等，支持pdf、word、png、jpg格式，不超过2M）: </h3></Row>
                    <Row type="flex" justify="center" className="other-info-wrap info-wrap">
                        <Col span={12}>
                            {otherItems}
                            <Row className="btn-wrap">
                                <Button type="primary"
                                    icon='plus'
                                    onClick={() => {
                                        this.addForm('other')
                                    }
                                    }>继续添加其他附件</Button>
                            </Row>
                        </Col>
                    </Row>
                </Form>
                <Row className="btn-wrap bottom">
                    <Button type="primary" size="large" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit/step21') } }>上一步</Button>
                    <Button className="next" size="large" type="primary" onClick={() => { this.context.router.push('/workbench/userInfo/avatar/edit/step3') } }>下一步</Button>
                </Row>
            </div >
        );
    }
}
Step22.contextTypes = {
    router: React.PropTypes.object
};
export default Step22;
