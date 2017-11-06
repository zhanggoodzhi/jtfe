import * as React from "react";
import { Spin, Table, Modal, DatePicker, Form, Select, Input, Button, Row, Col, message, Icon } from "antd";
import * as request from "superagent";
import moment from "moment";
import { connect } from 'react-redux'
import { formAjax, } from '../global/utils';
import WangEditor from "wangeditor";
import "./article.less";
const mapStateToProps = (state) => {
    return {
        redDot: state.redDot
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeRedDot: (redDot) => { dispatch({ type: 'changeRedDot', redDot: redDot }) }
    }
}


class Modify extends React.Component {
    constructor(props) {
        super(props);
        this.editor = null;
        this.state = {

        };
    }
    getArticleHtml() {
        return this.editor.$txt.html();
    }
    initArticle() {
        this.editor.$txt.html(this.props.article);
    }
    componentDidMount() {
        this.editor = new WangEditor('edit');
        this.editor.config.menus = $.map(WangEditor.config.menus, function (item) {
            if (item === 'video') {
                return null;
            }
            return item;
        });
        this.editor.config.uploadImgUrl = '/article/uploadIcon';
        this.editor.config.uploadImgFns.onload = (resultText) => {
            let data = JSON.parse(resultText);
            // resultText 服务器端返回的text
            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
            this.props.addImg(data.id);
            // 上传图片时，已经将图片的名字存在 this.editor.uploadImgOriginalName
            var originalName = this.editor.uploadImgOriginalName || '';

            // 如果 resultText 是图片的url地址，可以这样插入图片：
            this.editor.command(null, 'insertHtml', '<img src="' + data.url + '" alt="' + originalName + '" style="max-width:100%;"/>');
            // 如果不想要 img 的 max-width 样式，也可以这样插入：
            // editor.command(null, 'InsertImage', resultText);
        };
        this.editor.config.uploadImgFileName = 'fileUpload';
        this.editor.create();
        this.initArticle();
    }
    render() {
        return (

            <div className="edit-container">
                <div id="edit">

                </div>
            </div>
        )
    }
}
Modify.propTypes = {
    addImg: React.PropTypes.func,
    article: React.PropTypes.string
};


class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.imgArr = [];
        this.state = {
            article: null,
            spin: false,
            status: null,
            visible: false,
            comments: []
        };
    }
    addImg(id) {
        this.imgArr.push(id);
    }
    audit(str) {
        request
            .post('/article/review.do')
            .type("form")
            .send({
                articleId: this.props.id,
                status: str
            })
            .end((err, res) => {
                if (err) {
                    message.error('出错')
                } else {
                    let data = JSON.parse(res.text);
                    if (data.status == 1) {
                        this.props.handleCancel();
                        message.success('审批成功');
                        this.props.getTableData({ current: this.props.current, pageSize: this.props.pageSize });
                    } else {
                        message.error(data.msg);
                    }
                }
            });
    }

    handleCancel() {
        this.setState({
            visible: false,
        });
    }

    showModal() {
        this.setState({
            visible: true,
        }, () => {
            this.refs.modify.initArticle();
        });
    }

    delete() {
        formAjax.bind(this)('您确定要永久删除吗？', '/article/deleteArticle.do', { articleId: this.props.id }, () => {
            this.props.handleCancel();
            this.props.getTableData({ current: this.props.current, pageSize: this.props.pageSize });
        });
    }
    getDetail(id) {
        this.setState({ spin: true });
        request
            .post('/article/snapshotContentAndComment.do')
            .type("form")
            .send({
                articleId: id
            })
            .end((err, res) => {
                this.setState({ spin: false });
                let data = JSON.parse(res.text);
                this.setState({
                    article: data.content,
                    comments: data.comments,
                    status: data.status
                });
            });
    }
    ok() {
        request
            .post('/article/updateArticle.do')
            .type("form")
            .send({
                articleId: this.props.id,
                content: this.refs.modify.getArticleHtml(),
                piclist: this.imgArr.join(',')
            })
            .end((err, res) => {
                if (err) {
                    message.error('出错')
                } else {
                    let data = JSON.parse(res.text);
                    if (data.status == 1) {
                        this.setState({
                            visible: false
                        });
                        this.props.getTableData({ current: this.props.current, pageSize: this.props.pageSize });
                        this.props.handleCancel();
                        message.success('修改成功');
                    } else {
                        message.error(data.msg);
                    }
                }
            });
    }
    render() {
        let comments = null;
        if (this.state.comments.length == 0) {
            comments = <div><p>该文章无评论</p></div>
        } else {
            comments = this.state.comments.map((v, i) => {
                return <div className="comment-item" key={i} dangerouslySetInnerHTML={{ __html: v }} ></div>
            });
        }
        let footer = null;
        switch (this.state.status) {
            case 'passed':
                footer = (
                    <div className="footer">
                        <Button type="primary" onClick={() => { this.audit('unfixed') } }>待改</Button>
                        <Button type="primary" onClick={() => { this.audit('droped') } }>抛弃</Button>
                        <Button type="ghost" className="delete" onClick={() => { this.delete() } }>永久删除</Button>
                    </div>
                );
                break;
            case 'unfixed':
                footer = (
                    <div className="footer">
                        <Button type="primary" className="modify" onClick={this.showModal.bind(this)}>修改文章</Button>
                        <Button type="primary" onClick={() => { this.audit('passed') } }>通过</Button>
                        <Button type="primary" onClick={() => { this.audit('droped') } }>抛弃</Button>
                        <Button type="ghost" className="delete" onClick={() => { this.delete() } }>永久删除</Button>
                    </div>
                );
                break;
            case 'unreviewed':
                footer = (
                    <div className="footer">
                        <Button type="primary" className="modify" onClick={this.showModal.bind(this)}>修改文章</Button>
                        <Button type="primary" onClick={() => { this.audit('passed') } }>通过</Button>
                        <Button type="primary" onClick={() => { this.audit('unfixed') } }>待改</Button>
                        <Button type="primary" onClick={() => { this.audit('droped') } }>抛弃</Button>
                        <Button type="ghost" className="delete" onClick={() => { this.delete() } }>永久删除</Button>
                    </div>
                );
                break;
            case 'droped':
                footer = (
                    <div className="footer">
                        <Button type="primary" onClick={() => { this.audit('passed') } }>通过</Button>
                        <Button type="primary" onClick={() => { this.audit('unfixed') } }>待改</Button>
                        <Button type="ghost" className="delete" onClick={() => { this.delete() } }>永久删除</Button>
                    </div>
                );
                break;

        }
        return (
            <div className="detail-wrap">
                <Modal
                    onOk={this.ok.bind(this)}
                    title="修改文章"
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    maskClosable={false}
                    wrapClassName='article-modify-wrap'>
                    <Modify
                        addImg={this.addImg.bind(this)}
                        ref="modify"
                        article={this.state.article}
                        />
                </Modal>
                <Spin spinning={this.state.spin} size="large">
                    <div className="article-wrap">
                        <div className="article" dangerouslySetInnerHTML={{ __html: this.state.article }} />
                        <div className="comment-wrap">
                            <Row className="title">文章评论</Row>
                            <Row className="comment">
                                {comments}
                            </Row>
                        </div>
                    </div>
                </Spin>
                {footer}
            </div>
        )
    }
}
Detail.propTypes = {
    id: React.PropTypes.number,
    handleCancel: React.PropTypes.func,
    getTableData: React.PropTypes.func,
    current: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    setLoading: React.PropTypes.func
};
class FormElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            status: [],
            majorcategory: [],
            category: []
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
    componentDidMount() {
        request
            .post('/article/queryTypeStatus.do')
            .type("form")
            .send({})
            .end((err, res) => {
                this.setState({ "status": JSON.parse(res.text) });
            });
        request
            .post('/article/queryMajorCategory')
            .type("form")
            .send({})
            .end((err, res) => {
                this.setState({ "majorcategory": JSON.parse(res.text) });
            });
    }

    reset() {
        this.props.form.resetFields();
        this.props.clearForm();


    }
    getCategory(value) {
        request
            .post('/article/queryMinorCategory')
            .type("form")
            .send({ majorName: value })
            .end((err, res) => {
                this.setState({ "category": JSON.parse(res.text) });
            });

    }

    render() {

        const FormItem = Form.Item;

        const Option = Select.Option;

        const status = this.state.status.map((v, i) => {
            return <Option value={v.value} key={i}>{v.name}</Option>;
        });
        status.push(<Option value={null} key={-1}>全部</Option>);

        const majorcategory = this.state.majorcategory.map((v, i) => {
            return <Option value={v} key={i}>{v}</Option>;
        });
        majorcategory.push(<Option value={null} key={-1}>全部</Option>);

        const category = this.state.category.map((v, i) => {
            return <Option value={v} key={i}>{v}</Option>;
        });
        category.push(<Option value={null} key={-1}>全部</Option>);

        const formItemLayout = {
            wrapperCol: {
                span: 21
            }
        };
        const getFieldDecorator = this.props.form.getFieldDecorator;

        return (
            <Form className="search-form" layout="horizontal">
                <Row>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("keyword")(
                                <Input
                                    placeholder="请输入标题关键字"
                                    />
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("status")(
                                <Select
                                    placeholder="状态"
                                    >
                                    {status}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("majorcategory")(
                                <Select
                                    placeholder="主类别"
                                    onChange={this.getCategory.bind(this)}
                                    >
                                    {majorcategory}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            {...formItemLayout}
                            >
                            {getFieldDecorator("category")(
                                <Select
                                    placeholder="子类别"
                                    >
                                    {category}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} xs={24} md={6} lg={6}>
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
                    <Col sm={12} xs={24} md={6} lg={6}>
                        <FormItem
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 17 }}
                            >
                            {getFieldDecorator("endDay")(
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={this.disabledEndDate.bind(this)}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="至"
                                    onChange={this.onEndChange.bind(this)} />
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={24} xs={24} md={12} lg={12} className="btn-wrap">
                        <Button type="primary" icon="search" onClick={this.props.getTableData}>搜索</Button>
                        <Button type="ghost" onClick={this.reset.bind(this)}><Icon type="delete" />清空</Button>
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
    clearForm: React.PropTypes.func,
    getTableData: React.PropTypes.func
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

class article extends React.Component {
    constructor(props) {
        super(props);
        this.redDot = null;
        this.state = {
            id: null,
            visible: false,
            current: 1,
            pageSize: 10,
            count: 0,
            tableLoading: false,
            tableData: null,
            identity: [{ "id": "0", "code": "0", "name": "无数据" }],
            majorcategory: [{ "id": "0", "code": "0", "name": "无数据" }],
            formData: {
                "keyword": "",
                "startDay": "",
                "endDay": "",
                "userid:": ""
            }
        };
    }

    getTableData(pagination) {
        const userid = window.location.href.split('=')[1];
        const sendData = Object.assign({
            page: 1,
            rows: 10,
            order: "desc",
            sort: "id"
        }, this.state.formData);
        if (pagination && pagination.current) {
            sendData.rows = pagination.pageSize;
            sendData.page = pagination.current;
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
        if (userid) { sendData.userid = userid }
        sendData.status = sendData.status === 'null' ? null : sendData.status;
        sendData.majorcategory = sendData.majorcategory === 'null' ? null : sendData.majorcategory;
        sendData.category = sendData.category === 'null' ? null : sendData.category;
        sendData.startDay = sendData.startDay === '' ? null : moment(sendData.startDay).format('YYYY-MM-DD HH:mm:ss');
        sendData.endDay = sendData.endDay === '' ? null : moment(sendData.endDay).format('YYYY-MM-DD HH:mm:ss');

        request
            .post('/article/queryList')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                let data = JSON.parse(res.text);
                let redDot = new Object();
                for (let i in this.props.redDot) {
                    redDot[i] = this.props.redDot[i];
                }
                if (redDot.article !== data.unReviewCount) {
                    redDot.article = data.unReviewCount;
                    this.props.changeRedDot(redDot);
                }
                this.setState({
                    count: data.unReviewCount,
                    tableData: data,
                    tableLoading: false
                });
            });
        delete sendData.page;
        delete sendData.rows;
        delete sendData.order;
        delete sendData.sort;
    }
    clearForm() {
        this.setState({
            formData: {
                "keyword": "",
                "status": "",
                "majorcategory": "",
                "category": "",
                "startDay": "",
                "endDay": "",
                "userid": ""
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
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    showModal() {
        this.setState({
            visible: true,
        });
    }
    showDetail(id) {
        this.setState({
            id: id
        });
        this.setState({
            visible: true,
        }, () => {
            this.refs.detail.getDetail(id);
        });
    }
    componentDidMount() {
        this.redDot = this.props.redDot;
        this.getTableData();
    }

    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: '标题',
                dataIndex: 'title',
                render: (title, record) => {
                    return <a onClick={() => { this.showDetail(record.id) } }>{title}</a>
                }

            },
            {
                title: '分类',
                dataIndex: 'minorCategoryName'
            },
            {
                title: '评论数',
                dataIndex: 'supportCount'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime'
            },
            {
                title: '状态',
                dataIndex: 'status',
                render(status) {
                    switch (status) {
                        case 'passed': return '已通过';
                        case 'unreviewed': return '待审核';
                        case 'unfixed': return '待修改';
                        case 'droped': return '已抛弃';
                        default: return '无';
                    }
                }
            }
        ];
        const pagination = {
            total: this.state.tableData ? this.state.tableData.total : 1,
            showTotal: () => `符合条件的条目： ${this.state.tableData ? this.state.tableData.total : 1} 条`,
            showSizeChanger: true,
            pageSize: this.state.pageSize,
            current: this.state.current,
            onShowSizeChange: (current, pageSize) => {
                this.setState({
                    pageSize: pageSize
                });
            }
        };
        const data = this.state.tableData ? this.state.tableData.rows : [];

        return (
            <div className="article-wrap">
                <Modal title="文章内容" visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)} maskClosable={false} wrapClassName='article-Detail-wrap'>
                    <Detail
                        ref="detail"
                        id={this.state.id}
                        handleCancel={this.handleCancel.bind(this)}
                        getTableData={this.getTableData.bind(this)}
                        current={this.state.current}
                        pageSize={this.state.pageSize}
                        setLoading={this.props.setLoading}
                        />
                </Modal>
                <SearchForm
                    updateForm={this.updateForm.bind(this)}
                    getTableData={this.getTableData.bind(this)}
                    clearForm={this.clearForm.bind(this)}
                    />
                <Row className="unreviewed-wrap">
                    <span className="unreviewed">未审批:  <span style={{ color: 'red' }}>{this.state.count}</span></span>
                </Row>
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
article.contextTypes = {
    router: React.PropTypes.object
};
article.propTypes = {
    redDot: React.PropTypes.object,
    changeRedDot: React.PropTypes.func,
    setLoading: React.PropTypes.func
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(article);
