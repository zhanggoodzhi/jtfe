import * as React from "react";
import { Table, Row, Col, Form, Input, Button, Select, Card, Icon, Radio, DatePicker, Progress } from "antd";
import * as request from "superagent";
import "./Message.less";
import echarts from 'echarts';
import moment from 'moment';
class Message extends React.Component {
    constructor(props) {
        super(props);
        this.prevent = '';
        this.state = {
            percentData: {},
            type: '1',
            msgDataBtnValue: '0',
            msgDataStartDay: moment().format('YYYY-MM-DD'),
            msgDataEndDay: moment().format('YYYY-MM-DD'),
            typeDataBtnValue: '0',
            typeDataStartDay: moment().format('YYYY-MM-DD'),
            typeDataEndDay: moment().format('YYYY-MM-DD'),
            msgDataStatus: 'P',//p,m,a三种状态
            msgData: {
                datelist: [],

                mountsP: [],
                mountsM: [],
                mountsA: [],

                playersP: [],
                playersM: [],
                playersA: [],

                avatarsP: [],
                avatarsM: [],
                avatarsA: [],

                robotsP: [],
                robotsM: [],
                robotsA: [],
            },
            msgType: {
                datelist: [],
                promap: [],
                typemap: []
            },
            value: '',
            focus: false,
        }
    }
    switchMsgData(type) {
        switch (type) {
            case 0: return this.state.msgData['mounts' + this.state.msgDataStatus];
            case 1: return this.state.msgData['players' + this.state.msgDataStatus];
            case 2: return this.state.msgData['avatars' + this.state.msgDataStatus];
            case 3: return this.state.msgData['robots' + this.state.msgDataStatus];
        }
    }
    initEcharts(id, op) {
        let newChart = echarts.init(document.getElementById(id));
        newChart.setOption(op);
        return newChart;
    }
    getXName(datetype) {
        switch (datetype) {
            case 'year':
                return '年';
            case 'month':
                return '月';
            case 'day':
                return '日';
            case 'hour':
                return '时';

        }
    }
    getMsgData() {
        request
            .post('/msgStatistic/msgData.do')
            .type("form")
            .send({
                start: this.state.msgDataStartDay,
                end: this.state.msgDataEndDay
            })
            .end((err, res) => {
                let data = JSON.parse(res.text);
                switch (data.datetype) {
                    case 'year':
                        break;
                    case 'month':
                        data.datelist = data.datelist.map((v) => {
                            return (v[4] == 0 ? '' : v[4]) + v[5]
                        });
                        break;
                    case 'day':
                        data.datelist = data.datelist.map((v) => {
                            return (v[6] == 0 ? '' : v[6]) + v[7]
                        });
                        break;
                    case 'hour':
                        data.datelist = data.datelist.map((v) => {
                            return (v[8] == 0 ? '' : v[8]) + v[9]
                        });
                        break;
                }
                this.setState({
                    msgData: data
                });
            });
    }
    getTypeData() {
        request
            .post('/msgStatistic/msgServerData.do')
            .type("form")
            .send({
                type: this.state.type,
                start: this.state.typeDataStartDay,
                end: this.state.typeDataEndDay
            })
            .end((err, res) => {
                let data = JSON.parse(res.text);
                switch (data.datetype) {
                    case 'year':
                        break;
                    case 'month':
                        data.datelist = data.datelist.map((v) => {
                            return (v[4] == 0 ? '' : v[4]) + v[5]
                        });
                        break;
                    case 'day':
                        data.datelist = data.datelist.map((v) => {
                            return (v[6] == 0 ? '' : v[6]) + v[7]
                        });
                        break;
                    case 'hour':
                        data.datelist = data.datelist.map((v) => {
                            return (v[8] == 0 ? '' : v[8]) + v[9]
                        });
                        break;
                }
                this.setState({
                    msgType: data
                });
            });
    }
    componentDidMount() {
        request
            .post('/msgStatistic/msgDataTrend')
            .type("form")
            .send({ istest: false })
            .end((err, res) => {
                let data = JSON.parse(res.text);
                this.setState({
                    percentData: data
                });
            });
        this.getMsgData();
        this.getTypeData();
    }
    componentDidUpdate() {
        if (this.prevent !== '1') {
            this.initEcharts('line-chart', {
                legend: {
                    data: ['全部', '用户', '角色', '机器人']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    name: this.getXName(this.state.msgData.datetype),
                    type: 'category',
                    boundaryGap: false,
                    data: this.state.msgData.datelist
                },
                yAxis: {},
                series: [
                    {
                        name: '全部',
                        type: 'line',
                        data: this.switchMsgData(0)
                    }, {
                        name: '用户',
                        type: 'line',
                        data: this.switchMsgData(1)
                    }, {
                        name: '角色',
                        type: 'line',
                        data: this.switchMsgData(2)
                    }, {
                        name: '机器人',
                        type: 'line',
                        data: this.switchMsgData(3)
                    }]
            });
        }
        if (this.prevent !== '2') {
            const msgType = this.state.msgType;
            const legend = [];
            for (let i in msgType.promap) {
                legend.push(msgType.promap[i]);
            }
            const series = [];
            for (let i in msgType.typemap) {
                series.push({
                    name: msgType.promap[i],
                    type: 'bar',
                    data: msgType.typemap[i]
                });
            }
            this.initEcharts('bar-chart', {
                grid: {
                    top: 100
                },
                legend: {
                    height: 100,
                    data: legend
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                toolbox: {
                    show: true,
                    top: 50,
                    feature: {
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    name: this.getXName(msgType.datetype),
                    type: 'category',
                    data: msgType.datelist
                },
                yAxis: {},
                series: series
            });
        }
    }

    changeMsgDate(value) {
        switch (value) {
            case '0':
                this.setState({
                    msgDataBtnValue: value,
                    msgDataStartDay: moment().format('YYYY-MM-DD'),
                    msgDataEndDay: moment().format('YYYY-MM-DD')
                }, () => {
                    this.getMsgData();
                });
                break;
            case '1':
                this.setState({
                    msgDataBtnValue: value,
                    msgDataStartDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
                    msgDataEndDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD')
                }, () => {
                    this.getMsgData();
                });
                break;
            case '2':
                this.setState({
                    msgDataBtnValue: value,
                    msgDataStartDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000 * 7)).format('YYYY-MM-DD'),
                    msgDataEndDay: moment().format('YYYY-MM-DD')
                }, () => {
                    this.getMsgData();
                });
                break;
            case '3':
                this.setState({
                    msgDataBtnValue: value,
                    msgDataStartDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000 * 30)).format('YYYY-MM-DD'),
                    msgDataEndDay: moment().format('YYYY-MM-DD')
                }, () => {
                    this.getMsgData();
                });
                break;
        }
    }
    changeTypeDate(value) {
        switch (value) {
            case '0':
                this.setState({
                    typeDataBtnValue: value,
                    typeDataStartDay: moment().format('YYYY-MM-DD'),
                    typeDataEndDay: moment().format('YYYY-MM-DD')
                }, () => {
                    this.getTypeData();
                });
                break;
            case '1':
                this.setState({
                    typeDataBtnValue: value,
                    typeDataStartDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
                    typeDataEndDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD')
                }, () => {
                    this.getTypeData();
                });
                break;
            case '2':
                this.setState({
                    typeDataBtnValue: value,
                    typeDataStartDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000 * 7)).format('YYYY-MM-DD'),
                    typeDataEndDay: moment().format('YYYY-MM-DD')
                }, () => {
                    this.getTypeData();
                });
                break;
            case '3':
                this.setState({
                    typeDataBtnValue: value,
                    typeDataStartDay: moment(new Date(Date.parse(new Date()) - 24 * 60 * 60 * 1000 * 30)).format('YYYY-MM-DD'),
                    typeDataEndDay: moment().format('YYYY-MM-DD')
                }, () => {
                    this.getTypeData();
                });
                break;
        }
    }

    changeMsgRangeDate(startDay, endDay) {
        this.setState({
            msgDataBtnValue: '4',
            msgDataStartDay: moment(startDay).format('YYYY-MM-DD'),
            msgDataEndDay: moment(endDay).format('YYYY-MM-DD')
        }, () => {
            this.getMsgData();
        });
    }
    changeTypeRangeDate(startDay, endDay) {
        this.setState({
            typeDataBtnValue: '4',
            typeDataStartDay: moment(startDay).format('YYYY-MM-DD'),
            typeDataEndDay: moment(endDay).format('YYYY-MM-DD')
        }, () => {
            this.getTypeData();
        });
    }

    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    }
    judgeIcon(data) {
        if (data > 0) {
            return 'arrow-up';
        } else if (data < 0) {
            return 'arrow-down';
        } else {
            return 'pause-circle-o';
        }
    }
    judgeColor(data) {
        if (data > 0) {
            return 'green';
        } else if (data < 0) {
            return 'red';
        } else {
            return 'yellow';
        }
    }
    changeArr(percentArr, flagArr, colorArr) {
        for (let i = 0; i < percentArr.length; i++) {
            flagArr[i] = this.judgeIcon(this.state.percentData[percentArr[i]]);
            colorArr[i] = this.judgeColor(this.state.percentData[percentArr[i]]);
        }
    }
    render() {
        const RadioButton = Radio.Button;
        const RadioGroup = Radio.Group;
        const RangePicker = DatePicker.RangePicker;
        const percentData = this.state.percentData;
        let flagArr = ['pause-circle-o', 'pause-circle-o', 'pause-circle-o', 'pause-circle-o', 'pause-circle-o', 'pause-circle-o'];
        let colorArr = ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'];
        let percentArr = ['personPrecentDay', 'personPrecentWeek', 'msgPrecentDay', 'msgPrecentWeek', 'avgPrecentDay', 'avgPrecentWeek'];
        this.changeArr(percentArr, flagArr, colorArr);
        // const Option = Select.Option;
        // const InputGroup = Input.Group;
        // const btnCls = classNames({
        //     'ant-search-btn': true,
        //     'ant-search-btn-noempty': !!this.state.value.trim(),
        // });
        // const searchCls = classNames({
        //     'ant-search-input': true,
        //     'ant-search-input-focus': this.state.focus,
        // });
        // const tableData = [{
        //     id: 1,
        //     name: 2,
        //     img: 3,
        //     audio: 4,
        //     text: 5
        // }]
        // const columns = [
        //     {
        //         title: 'ID',
        //         dataIndex: 'id'
        //     },
        //     {
        //         title: '名称',
        //         dataIndex: 'name'
        //     },
        //     {
        //         title: '图片',
        //         dataIndex: 'img'
        //     },
        //     {
        //         title: '语音',
        //         dataIndex: 'audio'
        //     },
        //     {
        //         title: '文本',
        //         dataIndex: 'text',
        //         render: (text) => {
        //             return <Progress percent={text} status="active" />
        //         }

        //     }
        // ];
        return (
            <div className="message-container">
                {
                    // <Row>
                    //     <Select style={{ width: 180 }} placeholder="请选择数据平台">
                    //         <Option value='0'>3</Option>
                    //         <Option value='1'>4</Option>
                    //     </Select>
                    // </Row>
                }
                <Row className="card-wrap mtt">
                    <Col span={24}>
                        <Card title="昨日关键指标分析" style={{ width: '100%' }}>
                            <Row type="flex" justify="space-between">
                                <Col span={8} className="center">
                                    <p>消息发送人数</p>
                                    <p>{percentData.yesPerCount}</p>
                                    <p>日：<Icon type={flagArr[0]} className={colorArr[0]} /><span className="percent">{Math.abs(percentData.personPrecentDay) + '%'}</span></p>
                                    <p>周：<Icon type={flagArr[1]} className={colorArr[1]} /><span className="percent">{Math.abs(percentData.personPrecentWeek) + '%'}</span></p>
                                </Col>
                                <Col span={8} className="center">
                                    <p>消息发送次数</p>
                                    <p>{percentData.yesMsgCount}</p>
                                    <p>日：<Icon type={flagArr[2]} className={colorArr[2]} /><span className="percent">{Math.abs(percentData.msgPrecentDay) + '%'}</span></p>
                                    <p>周：<Icon type={flagArr[3]} className={colorArr[3]} /><span className="percent">{Math.abs(percentData.msgPrecentWeek) + '%'}</span></p>
                                </Col>
                                <Col span={8} className="center last">
                                    <p>人均发送次数</p>
                                    <p>{percentData.yesAvgCount}</p>
                                    <p>日：<Icon type={flagArr[4]} className={colorArr[4]} /><span className="percent">{Math.abs(percentData.avgPrecentDay) + '%'}</span></p>
                                    <p>周：<Icon type={flagArr[5]} className={colorArr[5]} /><span className="percent">{Math.abs(percentData.avgPrecentWeek) + '%'}</span></p>
                                </Col>

                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row className="title-wrap mtt">
                    <Col span={4} className="title">
                        <span>关键指标详解：</span>
                    </Col>
                    <Col span={18}>
                        <RadioGroup defaultValue="P" size="large" onChange={(e) => { this.prevent = "2"; this.setState({ msgDataStatus: e.target.value }) } }>
                            <RadioButton value="P">消息发送人数</RadioButton>
                            <RadioButton value="M">消息发送次数</RadioButton>
                            <RadioButton value="A">人均发送次数</RadioButton>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row className="chart-wrap mt">
                    <Row className="chart-title">
                        <Col span={15}>
                            <RadioGroup value={this.state.msgDataBtnValue} size="large" onChange={(e) => { this.prevent = "2"; this.changeMsgDate(e.target.value) } }>
                                <RadioButton className="bl" value="0">今天</RadioButton>
                                <RadioButton value="1">昨天</RadioButton>
                                <RadioButton value="2">最近7天</RadioButton>
                                <RadioButton className="r" value="3">最近30天</RadioButton>
                            </RadioGroup>
                        </Col>
                        <Col span={9}>
                            <RangePicker style={{ width: 300 }} onChange={(arr) => { this.prevent = "2"; this.changeMsgRangeDate(arr[0], arr[1]) } } />
                        </Col>
                    </Row>
                    <Row className="chart-content">
                        <div id="line-chart">
                        </div>
                    </Row>
                </Row>
                {
                    // <Row className="title-wrap mtt">
                    //     <Col span={3} className="title">
                    //         <span>消息关键词分析：</span>
                    //     </Col>
                    //     <Col span={18}>
                    //         <InputGroup className={searchCls}>
                    //             <Input placeholder="请输入关键词进行查询" onFocus={this.handleFocusBlur.bind(this)} onBlur={this.handleFocusBlur.bind(this)}
                    //                 />
                    //             <div className="ant-input-group-wrap">
                    //                 <Button icon="search" className={btnCls} />
                    //             </div>
                    //         </InputGroup>
                    //     </Col>
                    // </Row>
                    // <Row className="chart-wrap mt">
                    //     <Row className="chart-title">
                    //         <Col span={15}>
                    //             <RadioGroup defaultValue="0" size="large">
                    //                 <RadioButton className="bl" value="0">今天</RadioButton>
                    //                 <RadioButton value="1">昨天</RadioButton>
                    //                 <RadioButton value="2">最近7天</RadioButton>
                    //                 <RadioButton className="r" value="3">最近30天</RadioButton>
                    //             </RadioGroup>
                    //         </Col>
                    //         <Col span={9}>
                    //             <RangePicker style={{ width: 300 }} />
                    //         </Col>
                    //     </Row>
                    //     <Row className="chart-content">
                    //         <Row type="flex" justify="space-between" className="title mtt">
                    //             <Col style={{ textAlign: 'center' }} span={5}>详细数据:</Col>
                    //             <Col style={{ textAlign: 'center' }} span={5}><Button type="primary">导出为excel</Button></Col>
                    //         </Row>
                    //         <Row className="table-wrap">
                    //             <Table
                    //                 columns={columns}
                    //                 dataSource={tableData}
                    //                 />
                    //         </Row>
                    //     </Row>
                    // </Row>
                }
                <Row className="title-wrap mtt">
                    <Col span={3} className="title">
                        <span>消息分类：</span>
                    </Col>
                    <Col span={18}>
                        <RadioGroup value={this.state.type} size="large" onChange={(e) => { this.prevent = "1"; this.setState({ type: e.target.value }, () => { this.getTypeData() }) } }>
                            <RadioButton value="1">消息总数</RadioButton>
                            <RadioButton value="2">问题消息数</RadioButton>
                            <RadioButton value="3">回答消息数</RadioButton>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row className="chart-wrap mt">
                    <Row className="chart-title">
                        <Col span={15}>
                            <RadioGroup value={this.state.typeDataBtnValue} size="large" onChange={(e) => { this.prevent = "1"; this.changeTypeDate(e.target.value) } }>
                                <RadioButton className="bl" value="0">今天</RadioButton>
                                <RadioButton value="1">昨天</RadioButton>
                                <RadioButton value="2">最近7天</RadioButton>
                                <RadioButton className="r" value="3">最近30天</RadioButton>
                            </RadioGroup>
                        </Col>
                        <Col span={9}>
                            <RangePicker style={{ width: 300 }} onChange={(arr) => { this.prevent = "1"; this.changeTypeRangeDate(arr[0], arr[1]) } } />
                        </Col>
                    </Row>
                    <Row className="chart-content">
                        <div id="bar-chart">
                        </div>
                    </Row>
                </Row>
            </div >
        );
    }
}

export default Message;
