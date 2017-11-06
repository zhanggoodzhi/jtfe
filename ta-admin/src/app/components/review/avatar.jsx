import * as React from "react";
import { Tag, message, Modal, Form, Row, Col, Table, DatePicker, Select, Input, Button, Switch } from "antd";
import * as request from "superagent";
import { Img } from '../global/utils';
import moment from "moment";
import "./avatar.less";
class FormElement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            online: [],
            type: []
        };
    }

    disabledStartDate(startValue) {
        if (!startValue || !this.state.endValue) {
            return false;
        }
        return startValue.valueOf() > this.state.endValue.valueOf();
    }

    disabledEndDate(endValue) {
        if (!endValue || !this.state.startValue) {
            return false;
        }
        return endValue.valueOf() <= this.state.startValue.valueOf();
    }

    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    }

    onStartChange(value) {
        this.onChange('startValue', value);
    }

    onEndChange(value) {
        this.onChange('endValue', value);
    }

    handleStartOpenChange(open) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange(open) {
        this.setState({ endOpen: open });
    }
    componentWillMount() {
        request
            .post('/account/queryType.do')
            .type("form")
            .send({
                "type": "online_status"
            })
            .end((err, res) => {
                if (!err) {
                    this.setState({ "online": JSON.parse(res.text) });
                }
            });
        request
            .post('/account/queryType.do')
            .type("form")
            .send({
                "type": "user_character"
            })
            .end((err, res) => {
                if (!err) {
                    this.setState({ "type": JSON.parse(res.text) });
                }
            });
    }

    reset() {
        this.props.form.resetFields();
        this.props.clearForm();
    }
    render() {
        const FormItem = Form.Item;

        const Option = Select.Option;

        const online = this.state.online.map((v) => {
            if (!v.id) {
                return <Option value='null' key='null'>{v.name}</Option>;
            }
            return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
        });
        const type = this.state.type.map((v) => {
            if (!v.id) {
                return <Option value='null' key='null'>{v.name}</Option>;
            }
            return <Option value={v.code.toString()} key={v.id.toString()}>{v.name}</Option>;
        });

        const formItemLayout = {
            wrapperCol: {
                span: 21
            }
        };

        const getFieldDecorator = this.props.form.getFieldDecorator;
        return (
            <Form layout="horizontal">
                <Row>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator("keyword")(
                                <Input
                                    placeholder="角色昵称"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator("actor")(
                                <Input
                                    placeholder="创建者TA号/手机号/昵称"
                                />
                            )}

                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator("onlineStatus")(
                                <Select
                                    placeholder="在线状态"
                                >
                                    {online}
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator("reviewStatus", {
                                initialValue: '1'
                            })(
                                <Select placeholder="审核状态"
                                >
                                    <Option value="1">审核中</Option>
                                    <Option value="2">未通过</Option>
                                </Select>
                                )}

                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator("character")(
                                <Select
                                    placeholder="角色类别"
                                >
                                    {type}
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={4} lg={6}>
                        <FormItem>
                            {getFieldDecorator("startDay")(
                                <DatePicker
                                    style={{ width: '85%' }}
                                    disabledDate={this.disabledStartDate.bind(this)}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="创建时间从"
                                    onChange={this.onStartChange.bind(this)} />
                            )}

                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={4} lg={6}>
                        <FormItem>
                            {getFieldDecorator("endDay")(
                                <DatePicker
                                    style={{ width: '85%' }}
                                    disabledDate={this.disabledEndDate.bind(this)}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="至"
                                    onChange={this.onEndChange.bind(this)} />
                            )}

                        </FormItem>
                    </Col>
                    <Col sm={24} xs={24} md={8} lg={6} className="btn-wrap">
                        <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
                        <Button icon="delete" onClick={this.reset.bind(this)}>清空</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
FormElement.contextTypes = {
    router: React.PropTypes.object
};
FormElement.propTypes = {
    form: React.PropTypes.object,
    updateForm: React.PropTypes.func,
    getTableData: React.PropTypes.func,
    clearForm: React.PropTypes.func,
};


let timer = null;


const SearchForm = Form.create({
    onFieldsChange: (props, fields) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            for (let i in fields) {
                const obj = {};
                obj[fields[i].name] = fields[i].value;
                props.updateForm(obj);
            }
        }, 200)
    }
})(FormElement);


class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actorid: null,
            pageSize: 10,
            current: 1,
            tableLoading: false,
            tableData: null,
            online: [{ "id": "0", "code": "0", "name": "无数据" }],
            visible: false,
            ispass: true,
            remarks: null,
            previewVisible: false,
            previewSrc: null,
            detailData: {
                actor: {},
                photos: [],
                labels: [],
                prototype: {}
            },
            formData: {
                reviewStatus: '1',
                "keyword": "",
                "startDay": "",
                "endDay": ""
            }
        };
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }

    getTableData(pagination) {
        let sendData = Object.assign({
            page: 1,
            rows: 10,
            order: "desc",
            sort: "id"
        }, this.state.formData);
        if (pagination && pagination.current) {
            sendData.page = pagination.current;
            sendData.rows = pagination.pageSize;
            this.setState({
                current: pagination.current
            });
        } else {
            this.setState({
                current: 1
            });
        }
        this.setState({
            tableLoading: true,
        });
        sendData.roleType = sendData.roleType === 'null' ? null : sendData.roleType;
        sendData.onlineStatus = sendData.onlineStatus === 'null' ? null : sendData.onlineStatus;
        sendData.startDay = sendData.startDay === '' ? null : moment(sendData.startDay).format('YYYY-MM-DD HH:mm:ss');
        sendData.endDay = sendData.endDay === '' ? null : moment(sendData.endDay).format('YYYY-MM-DD HH:mm:ss');
        request
            .post('/avatar/queryAvatarList')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        tableData: JSON.parse(res.text),
                        tableLoading: false
                    });
                }
            });
    }
    clearForm() {
        this.setState({
            formData: {
                "keyword": "",
                "actor": "",
                "onlineStatus": "",
                "character": "",
                "reviewStatus": "1",
                "startDay": "",
                "endDay": ""
            }
        }, () => {
            this.getTableData({ current: 1, pageSize: this.state.pageSize });
        });
    }
    updateForm(data) {
        const cloneFormData = Object.assign({}, this.state.formData, data);
        this.setState({
            formData: cloneFormData
        });
    }
    componentDidMount() {
        this.getTableData();
    }
    showDetail(id) {
        request
            .post('/avatar/audit/detail.do')
            .type("form")
            .send({ id })
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        visible: true,
                        detailData: JSON.parse(res.text)
                    });
                }
            })
    }
    submit() {
        const remarks = this.state.remarks;
        const ispass = this.state.ispass;
        request
            .post('/avatar/audit')
            .type("form")
            .send({
                ispass,
                remarks,
                avatarid: this.state.detailData.id,
            })
            .end((err, res) => {
                if (!err) {
                    this.setState({
                        visible: false
                    });
                    message.success('审核成功');
                    this.getTableData();
                }
            })
    }
    render() {
        const FormItem = Form.Item;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '头像',
                dataIndex: 'headIconUrl',
                render: (headIconUrl) => {
                    return <Img className="head-icon" src={headIconUrl} />;
                },
            },
            {
                title: '角色昵称',
                dataIndex: 'name'
            },
            {
                title: '性别',
                dataIndex: 'prototype.genderName'
            },
            {
                title: '角色类别',
                dataIndex: 'prototype.name',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime'
            },
            {
                title: '状态',
                dataIndex: 'onlineName'
            },
            {
                title: '创建者昵称',
                dataIndex: 'actor.name'
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <Row className="td-btn-wrap"><Col xs={12}><a onClick={() => { this.showDetail(record.id) }} className="check">{record.reviewStatus === 1 ? '审核' : '查看'}</a></Col></Row>
                }
            },
        ];
        const pagination = {
            total: this.state.tableData ? this.state.tableData.total : 1,
            showTotal: () => `符合条目的数量： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
            showSizeChanger: true,
            defaultPageSize: 10,
            current: this.state.current,
            pageSize: this.state.pageSize,
            onShowSizeChange: (current, pageSize) => {
                this.setState({
                    pageSize: pageSize
                });
            }
        };

        const data = this.state.tableData ? this.state.tableData.rows : [];
        const photos = this.state.detailData.photos.map((v, i) => {
            return <Img key={i} onClick={(e) => { this.setState({ previewVisible: true, previewSrc: e.target.src }); }} key={i} className={v.figure ? 'cover' : 'not-cover'} src={v.url} />
        });
        const review = this.state.detailData.reviewStatus === 1 ? (
            <FormItem
                {...formItemLayout}
                label="审核操作"
            >
                <Switch onChange={() => { this.setState({ ispass: !this.state.ispass }) }} defaultChecked checkedChildren={'通过'} unCheckedChildren={'不通过'} />
            </FormItem>
        ) : null;
        const remarks = this.state.ispass ? null : (
            <FormItem
                {...formItemLayout}
                label="不通过原因"
            >
                <Input placeholder="请输入不通过的原因" onChange={(e) => { this.setState({ remarks: e.target.value }) }} />
            </FormItem>
        );
        const label = this.state.detailData.labels.map((v, i) => {
            return <Tag key={i} color={v.bgcolor}>{v.text}</Tag>;
        });
        const preview = this.state.previewVisible ? (
            <div className="preview-wrap">
                <Button onClick={() => { this.setState({ previewVisible: false }) }} className="close-btn" type="primary" shape="circle" icon="close" size="large" />
                <Img src={this.state.previewSrc} />
            </div>
        ) : null;
        return (
            <div className="user-list">
                {preview}
                <Modal className="review-avatar-info-modal" width="650px" title="化身信息" visible={this.state.visible}
                    onOk={() => { this.submit() }}
                    onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName='review-detail-wrap'>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="头像"
                        >
                            <Img className="head-icon" onClick={(e) => { this.setState({ previewVisible: true, previewSrc: e.target.src }); }} src={this.state.detailData.headIconUrl} />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="相册"
                        >
                            {photos}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="化身原型"
                        >
                            <span className="ant-form-text">{this.state.detailData.prototype.name}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标签"
                        >
                            {label}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="昵称"
                        >
                            <span className="ant-form-text">{this.state.detailData.name}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="城市"
                        >
                            <span className="ant-form-text">{this.state.detailData.city}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="教育"
                        >
                            <span className="ant-form-text">{this.state.detailData.educationStr}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="职业"
                        >
                            <span className="ant-form-text">{this.state.detailData.jobSpecialtyStr}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="职业描述"
                        >
                            <span className="ant-form-text">{this.state.detailData.jobDetail}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="组织机构"
                        >
                            <span className="ant-form-text">{this.state.detailData.organizationStr}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="个人介绍"
                        >
                            <span className="ant-form-text">{this.state.detailData.selfDesc}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="服务定价"
                        >
                            <span className="ant-form-text">{this.state.detailData.price}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="创建者"
                        >
                            <span className="ant-form-text">{this.state.detailData.actor.name}(性别：{this.state.detailData.actor.genderName})</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="创建时间"
                        >
                            <span className="ant-form-text">{this.state.detailData.createTime}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="审核状态"
                        >
                            <span className="ant-form-text">{this.state.detailData.reviewStatus === 1 ? '审核中' : `未通过（原因：${this.state.detailData.unPassReason}）`}</span>
                        </FormItem>
                        {review}
                        {remarks}
                    </Form>
                </Modal>
                <SearchForm
                    updateForm={this.updateForm.bind(this)}
                    getTableData={this.getTableData.bind(this)}
                    clearForm={this.clearForm.bind(this)}
                />
                <Table
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    onChange={this.getTableData.bind(this)}
                />
            </div>
        );
    }
}

Avatar.propTypes = {
    setLoading: React.PropTypes.func,
};

export default Avatar;