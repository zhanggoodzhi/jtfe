import * as React from "react";
import { Table, Row, Col, Select, Form, Input, Button, Modal, Upload, Icon, message, Tabs, Menu, Radio, Tag } from "antd";
import * as request from "superagent";
import "./Game.less";

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            priviewVisible: false,
            priviewImage: ''
        };
    }
    previewHandleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    render() {
        const FormItem = Form.Item;
        const props = {
            action: '/upload.do',
            listType: 'picture-card',
            onPreview: (file) => {
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                });
            },
        };
        const propsv = {
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

        return (
            <div className="add-wrap">
                <Form layout="horizontal">
                    <FormItem
                        label="名字"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input placeholder="请输入名字" onChange={(e) => { this.updateAjaxData('name', e.target.value) } } />
                    </FormItem>
                    <FormItem
                        label="图片"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Upload {...props}>
                            <Icon type="plus" />
                            <div className="ant-upload-text">点击上传LOGO</div>
                        </Upload>
                        <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.previewHandleCancel.bind(this)}>
                            <img alt="example" src={this.state.priviewImage} />
                        </Modal>
                    </FormItem>
                    <FormItem
                        label="语音"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Upload {...propsv}>
                            <Button type="ghost">
                                <Icon type="upload" />点击上传
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem
                        label="文本"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        >
                        <Input type="textarea" placeholder="请输入文本" onChange={(e) => { this.updateAjaxData('text', e.target.value) } } />
                    </FormItem>
                    <Row className="btn-wrap">
                        <Button size="large" type="primary">保存</Button>
                    </Row>
                </Form>
            </div>
        )
    }
}
class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '0',
            ajaxData: {
                tags: [
                    {
                        feature: "blue",
                        id: 88,
                        type: "color"
                    }
                ],
                class: [
                    {
                        name: 'color',
                        id: 43,
                        children: [
                            {
                                name: 'blue',
                                id: 88,
                            },
                            {
                                name: 'red',
                                id: 99,
                            }
                        ]

                    }, {
                        name: 'clazz',
                        id: 23,
                        children: [
                            {
                                name: 'fruit',
                                id: 55,
                            },
                            {
                                name: 'car',
                                id: 33,
                            }
                        ]
                    }
                ],
                tags2: [
                    {
                        name: "菠萝",
                        id: 6,
                    },
                    {
                        name: "苹果",
                        id: 7,
                    }
                ]
            }
        };
    }
    onChange(e) {
        let newData = this.state.ajaxData;
        let tags = newData.tags;
        let exist = false;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].type == newData.class[this.state.current].name) {//如果此类标签已存在
                newData.tags[i] = {
                    feature: e.target['data-name'],
                    id: e.target.value,
                    type: newData.class[this.state.current].name
                };
                exist = true;
            }
        }
        if (exist == false) {//此类标签不存在
            newData.tags.push({
                feature: e.target['data-name'],
                id: e.target.value,
                type: newData.class[this.state.current].name
            });
        }
        this.setState({
            ajaxData: newData
        });
    }
    selectChange(value) {
        console.log(value);
    }
    handleClick(e) {
        this.setState({
            current: e.key,
        });
    }
    delete(i) {
        let newData = this.state.ajaxData;
        newData.tags.splice(i, 1);
        this.setState({
            ajaxData: newData
        });
    }
    delete2(i) {
        let newData = this.state.ajaxData;
        newData.tags2.splice(i, 1);
        this.setState({
            ajaxData: newData
        });
    }
    render() {
        const SubMenu = Menu.SubMenu;
        const TabPane = Tabs.TabPane;
        const RadioGroup = Radio.Group;
        const RadioButton = Radio.Button;
        const classes = this.state.ajaxData.class.map((v, i) => {
            return <Menu.Item key={i}>{v.name}</Menu.Item>
        });
        const radios = this.state.ajaxData.class[this.state.current].children.map((v, i) => {
            return <RadioButton data-name={v.name} key={i} value={v.id}>{v.name}</RadioButton>
        });
        const tags = this.state.ajaxData.tags.map((v, i) => {
            return <Tag closable key={v.id} color="blue" onClose={() => { this.delete(i) } }>{v.feature}</Tag>
        });
        const props = {
            value: "",
            onChange: this.onChange.bind(this)
        };
        let exist = false;
        for (let i = 0; i < this.state.ajaxData.tags.length; i++) {
            if (this.state.ajaxData.tags[i].type == this.state.ajaxData.class[this.state.current].name) {//如果此类标签已存在
                props.value = this.state.ajaxData.tags[i].id;
                exist = true;
            }
        }
        if (exist == false) {//此类标签不存在
            props.value = '';
        }
        const tags2 = this.state.ajaxData.tags2.map((v, i) => {
            return <Tag closable key={v.id} color="blue" onClose={() => { this.delete2(i) } }>{v.name}</Tag>
        });
        return (
            <Tabs type="card">
                <TabPane tab="基础信息" key="1"><Add /></TabPane>
                <TabPane tab="视图卡与特征" key="2" className="property-wrap">
                    <Row className="title">视图卡：<span>笔记本</span></Row>
                    <Row className="title">已经关联的特征：</Row>
                    <Row className="title tag-wrap">
                        {tags}
                    </Row>
                    <Row className="title">添加关联：</Row>
                    <Row>
                        <Col span="4">
                            <Menu onClick={this.handleClick.bind(this)}
                                defaultOpenKeys={['sub1']}
                                selectedKeys={[this.state.current]}
                                mode="inline"
                                >
                                <SubMenu key="sub1" disabled="true" title={<span>特征列表</span>}>
                                    {classes}
                                </SubMenu>
                            </Menu>
                        </Col>
                        <Col span="20">
                            <div className='info'>
                                <RadioGroup {...props}>
                                    {radios}
                                </RadioGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row className="btn-wrap">
                        <Button size="large" type="primary">保存</Button>
                    </Row>
                </TabPane>
                <TabPane tab="视图卡与视图卡" key="3" className="card-wrap">
                    <Row className="title">视图卡：<span>笔记本</span></Row>
                    <Row className="title">已经关联的视图卡：</Row>
                    <Row className="title tag-wrap">
                        {tags2}
                    </Row>
                    <Row className="title">添加关联：</Row>
                    <Row className="title select-wrap">

                    </Row>
                    <Row className="btn-wrap">
                        <Button size="large" type="primary">保存</Button>
                    </Row>
                </TabPane>
            </Tabs >
        )
    }
}



class FormElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            identity: [{ "id": "0", "code": "0", "name": "无数据" }],
            online: [{ "id": "0", "code": "0", "name": "无数据" }]
        };
    }

    handleStartToggle({ open }) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    handleEndToggle({ open }) {
        this.setState({ endOpen: open });
    }

    reset() {
        this.props.form.resetFields();
        this.props.clearForm();

    }

    render() {
        const formItemLayout = {
            wrapperCol: {
                span: 21
            }
        };
        const FormItem = Form.Item;
        const getFieldDecorator = this.props.form.getFieldDecorator;
        return (
            <Form layout="horizontal">
                <Row>
                    <Col sm={12} xs={24} md={4} lg={5}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("keyword")(
                                <Input
                                    placeholder="TA号/手机号码"
                                    />
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={4} lg={5}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("name")(
                                <Input
                                    placeholder="昵称"
                                    />
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={4} lg={5}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("phoneNoLocation")(
                                <Input
                                    placeholder="归属地"
                                    />
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={11} lg={9} className="btn-wrap">
                        <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
                        <Button icon="delete" onClick={this.reset.bind(this)}>清空</Button>
                        <Button icon="plus" type="primary" onClick={this.props.showAddModal}>新增</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
FormElement.propTypes = {
    form: React.PropTypes.object,
    updateForm: React.PropTypes.func,
    getTableData: React.PropTypes.func,
    showAddModal: React.PropTypes.func,
    clearForm:React.PropTypes.func,
};

let timer = null;

const SearchForm = Form.create({
    onFieldsChange: (props, fields) => {
        console.log(fields);
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false,
            detailVisible: false,
            tableLoading: false,
            tableData: null,
            identity: [{ "id": "0", "code": "0", "name": "无数据" }],
            online: [{ "id": "0", "code": "0", "name": "无数据" }],
            formData: {
                "keyword": "",
                "phoneNo": ""
            }
        };
    }
    showAddModal() {
        this.setState({
            addVisible: true,
        });
    }
    addHandleCancel() {
        this.setState({
            addVisible: false,
        });
    }
    showDetailModal() {
        this.setState({
            detailVisible: true,
        });
    }
    detailHandleCancel() {
        this.setState({
            detailVisible: false,
        });
    }
    getTableData(pagination) {
        const sendData = Object.assign({
            page: 1,
            rows: 20,
            order: "desc",
            sort: "id"
        }, this.state.formData);
        if (pagination && pagination.current) {
            sendData.page = pagination.current;
            sendData.rows=pagination.pageSize;
        }
        this.setState({ tableLoading: true });
        if (sendData.hasOwnProperty('startDay') && sendData.startDay !== undefined) {
            sendData.startDay = sendData.startDay.toString();
        }
        if (sendData.hasOwnProperty('endDay') && sendData.endDay !== undefined) {
            sendData.endDay = sendData.endDay.toString();
        }
        // request
        //     .post('baseinfo/page.do')
        //     .type("form")
        //     .send(sendData)
        //     .end((err, res) => {
        //         this.setState({
        //             tableData: JSON.parse(res.text),
        //             tableLoading: false
        //         });
        //     });
        this.setState({
            tableLoading: false
        });
    }
    clearForm() {
        /*this.props.updateForm(
            {
                "keyword": "",
                "name": "",
                "area": ""
            }
        );*/
        this.setState({
            formData: {
                "keyword": "",
                "name": "",
                "area": ""
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

    render() {
        const tableData = [{
            id: 1,
            name: 2,
            img: 3,
            audio: 4,
            text: 5
        }]
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '名称',
                dataIndex: 'name',
                render: (name) => {
                    return <a onClick={this.showDetailModal.bind(this)}>{name}</a>
                }
            },
            {
                title: '图片',
                dataIndex: 'img'
            },
            {
                title: '语音',
                dataIndex: 'audio'
            },
            {
                title: '文本',
                dataIndex: 'text'

            }
        ];
        const pagination = {
            total: this.state.tableData ? this.state.tableData.total : 1,
            showTotal: () => `符合条件的条目： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
            showSizeChanger: true,
            defaultPageSize:10,
            onShowSizeChange: (current, pageSize) => {
                console.log(current,pageSize);
                this.setState({
                    pagination: {
                        current: 1,
                        pageSize: pageSize
                    }
                });
            }
            //current: this.state.current
        };
        /*const pagination = {
            total: this.state.tableData ? this.state.tableData.total : 1,
            pageSize: 20
        };*/
        const data = this.state.tableData ? this.state.tableData.rows : [];

        return (
            <div className="user-list">
                <Modal title="新增" visible={this.state.addVisible}
                    onCancel={this.addHandleCancel.bind(this)} maskClosable={false} wrapClassName="add-modal">
                    <Add />
                </Modal>
                <Modal visible={this.state.detailVisible}
                    onCancel={this.detailHandleCancel.bind(this)} maskClosable={false} wrapClassName="detail-modal">
                    <Detail />
                </Modal>
                <SearchForm
                    updateForm={this.updateForm.bind(this)}
                    getTableData={this.getTableData.bind(this)}
                    showAddModal={this.showAddModal.bind(this)}
                    clearForm={this.clearForm.bind(this)}
                    />
                <Table
                    className="main-table"
                    loading={this.state.tableLoading}
                    columns={columns}
                    dataSource={tableData}
                    pagination={pagination}
                    onChange={this.getTableData.bind(this)}
                    />
            </div>
        );
    }
}

export default Game;
