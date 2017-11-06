import * as React from "react";
import { Row, Col, Radio } from "antd";
import * as request from "superagent";
import "./Immediate.less";
import echarts from 'echarts';

class Immediate extends React.Component {
    constructor(props) {
        super(props);
        this.ifClick=false;
        this.state = {
            chart: 'daily',
            mode: 0,
            type: 1,
            precision: 1,
            dailyData: {
                xAxis: [],
                series: []
            },
            msgData: {
                xAxis: [],
                series: []
            },
            articleData: {
                xAxis: [],
                series: []
            },
            onlineData: {
                series: []
            },
            activeData: {
                series: []
            },
            orderData: {
                xAxis: [],
                series: []
            },
            detail: {
                yAxis: null,
                legend: [],
                xAxis: [],
                series: []
            }
        }
    }
    initEcharts(id, op) {
        let newChart = echarts.init(document.getElementById(id));
        newChart.setOption(op);
        return newChart;
    }
    getDailyData() {
        request
            .post('/analysis/getDailyData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    dailyData: {
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            name: '问答数',
                            data: data.split('||')[1].split(','),
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            }
                        }]
                    }
                });
            });
    }
    getMsgData() {
        request
            .post('/analysis/getMsgData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    msgData: {
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            name: '问答数',
                            data: data.split('||')[1].split(','),
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            }
                        }]
                    }
                });
            });
    }
    getArticleData() {
        request
            .post('/analysis/getArticleData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    articleData: {
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            name: '发帖',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data.split('||')[1].split(',')
                        }, {
                            name: '点赞',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data.split('||')[2].split(',')
                        }, {
                            name: '回复',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data.split('||')[3].split(',')
                        }]
                    }
                });
            });
    }
    getOnlineData() {
        request
            .post('/analysis/getOnlineData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    onlineData: {
                        series: [{
                            name: '普通用户',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
                                }
                            },
                            data: data.split('||')[0].split(',')
                        }, {
                            name: '服务者',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
                                }
                            },
                            data: data.split('||')[1].split(',')
                        }]
                    }
                });
            });
    }
    getActiveData() {
        request
            .post('/analysis/getActiveData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    activeData: {
                        series: [{
                            name: '普通用户',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
                                }
                            },
                            data: data.split('||')[0].split(',')
                        }, {
                            name: '服务者',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
                                }
                            },
                            data: data.split('||')[1].split(',')
                        }]
                    }
                });
            });
    }
    getOrderData() {
        request
            .post('/analysis/getOrderData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    orderData: {
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            yAxisIndex: 0,
                            name: '总数',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data.split('||')[1].split(',')
                        }, {
                            yAxisIndex: 0,
                            name: '成交',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data.split('||')[2].split(',')
                        }, {
                            yAxisIndex: 0,
                            name: '取消',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data.split('||')[3].split(',')
                        },
                        {
                            yAxisIndex: 0,
                            name: '投诉',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: data.split('||')[4].split(',')
                        },
                        {
                            yAxisIndex: 1,
                            name: '价格',
                            type: 'line',
                            data: data.split('||')[5].split(',')
                        }]
                    }
                });
            });
    }
    getDailyDetail(mode, type, precision) {
        request
            .post('/analysis/getDailyDetail.do')
            .type("form")
            .send({
                mode: mode,
                type: type,
                precision: precision
            })
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    detail: {
                        legend: ['昨日数据', '今日数据'],
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            name: '昨日数据',
                            data: data.split('||')[1].split(','),
                            type: 'line'
                        },
                        {
                            name: '今日数据',
                            data: data.split('||')[2].split(','),
                            type: 'line'
                        }]
                    }
                });
            });
    }
    getArticleDetail(mode, precision) {
        request
            .post('/analysis/getArticleDetail.do')
            .type("form")
            .send({
                mode: mode,
                precision: precision
            })
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    detail: {
                        legend: ['发帖', '点赞', '回复'],
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            name: '发帖',
                            data: data.split('||')[1].split(','),
                            type: 'line'
                        },
                        {
                            name: '点赞',
                            data: data.split('||')[2].split(','),
                            type: 'line'
                        },
                        {
                            name: '回复',
                            data: data.split('||')[2].split(','),
                            type: 'line'
                        }]
                    }
                });
            });
    }
    getOnlineDetail(mode, type, precision) {
        request
            .post('/analysis/getDetailByUserType.do')
            .type("form")
            .send({
                mode: mode,
                type: type,
                precision: precision
            })
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    detail: {
                        legend: ['普通用户', '服务者'],
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            name: '普通用户',
                            data: data.split('||')[1].split(','),
                            type: 'line'
                        },
                        {
                            name: '服务者',
                            data: data.split('||')[2].split(','),
                            type: 'line'
                        }]
                    }
                });
            });
    }
    getOrderDetail(mode, precision) {
        request
            .post('/analysis/getOrderDetail.do')
            .type("form")
            .send({
                mode: mode,
                precision: precision
            })
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    detail: {
                        legend: ['总数', '成交', '取消', '投诉', '价格'],
                        yAxis: [
                            {
                                name: '订单量',
                                type: 'value',
                            }, {
                                name: '价格',
                                type: 'value',
                            }
                        ],
                        xAxis: data.split('||')[0].split(','),
                        series: [{
                            yAxisIndex: 0,
                            name: '总数',
                            data: data.split('||')[1].split(','),
                            type: 'line'
                        },
                        {
                            yAxisIndex: 0,
                            name: '成交',
                            data: data.split('||')[2].split(','),
                            type: 'line'
                        },
                        {
                            yAxisIndex: 0,
                            name: '取消',
                            data: data.split('||')[3].split(','),
                            type: 'line'
                        },
                        {
                            yAxisIndex: 0,
                            name: '投诉',
                            data: data.split('||')[4].split(','),
                            type: 'line'
                        },
                        {
                            yAxisIndex: 1,
                            name: '价格',
                            data: data.split('||')[5].split(','),
                            type: 'line'
                        }]
                    }
                });
            });
    }
    clickBtn(value) {
        let mode = this.state.mode;
        let type = this.state.type;
        switch (this.state.chart) {
            case 'daily':
                this.setState({ precision: value });
                this.getDailyDetail(mode, type, value);
                break;
            case 'article':
                this.setState({ precision: value });
                this.getArticleDetail(mode, value);
                break;
            case 'online':
                this.setState({ precision: value });
                this.getOnlineDetail(mode, type, value);
                break;
            case 'order':
                this.setState({ precision: value });
                this.getOrderDetail(mode, value);
                break;
        }
    }
    componentWillMount() {
        this.getDailyData();
        this.getMsgData();
        this.getArticleData();
        this.getOnlineData();
        this.getActiveData();
        this.getOrderData();
        this.getDailyDetail(0, 1, 1);
    }
    componentDidUpdate() {
        if (this.state.orderData.series.length == 0) {//解决初始状态series为空数组，echarts发出warning的问题
            return;
        }
        const precision = this.state.precision;

        this.initEcharts('detail', {
            grid: {
                left: 50
            },
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            legend: {
                data: this.state.detail.legend
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.detail.xAxis
            },
            yAxis: !this.state.detail.yAxis ? {} : this.state.detail.yAxis,
            dataZoom: [{
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: this.state.detail.series
        });
        if(this.ifClick==true){//若点击了，其他的表格数据没变，不需要重复setOption
            return;
        }
        this.initEcharts('register', {
            grid: {
                left: 50
            },
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '注册人数',
                textStyle: {
                    fontSize: 12
                }
            },
            tooltip: {},
            xAxis: {
                data: this.state.dailyData.xAxis
            },
            yAxis: {},
            series: this.state.dailyData.series

        }).on('click', (params) => {
            this.ifClick=true;
            this.setState({
                mode: params.dataIndex,
                chart: 'daily',
                type: 1
            });
            this.getDailyDetail(params.dataIndex, 1, precision);
        });

        this.initEcharts('news', {
            grid: {
                left: 50
            },
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '消息数量',
                textStyle: {
                    fontSize: 12
                }
            },
            tooltip: {},
            xAxis: {
                data: this.state.msgData.xAxis
            },
            yAxis: {},
            series: this.state.msgData.series
        }).on('click', (params) => {
            this.ifClick=true;
            this.setState({
                mode: params.dataIndex,
                chart: 'daily',
                type: 2
            });
            this.getDailyDetail(params.dataIndex, 2, precision);
        });
        this.initEcharts('article', {
            grid: {
                left: 50
            },
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '文章',
                textStyle: {
                    fontSize: 12
                }
            },
            legend: {
                top: 20,
                data: ['发帖', '点赞', '回复']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                data: this.state.articleData.xAxis
            },
            yAxis: {},
            series: this.state.articleData.series
        }).on('click', (params) => {
            this.ifClick=true;
            this.setState({
                mode: params.dataIndex,
                chart: 'article'
            });
            this.getArticleDetail(params.dataIndex, precision);
        });

        this.initEcharts('online', {
            grid: {
                left: 50
            },
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '在线人数',
                textStyle: {
                    fontSize: 12
                }
            },
            legend: {
                top: 20,
                data: ['普通用户', '服务者']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {

            },
            yAxis: { data: ['昨日', '今日'] },
            series: this.state.onlineData.series
        }).on('click', (params) => {
            this.ifClick=true;
            this.setState({
                mode: params.dataIndex,
                chart: 'online',
                type: 1
            });
            this.getOnlineDetail(params.dataIndex, 1, precision);
        });

        this.initEcharts('active', {
            grid: {
                left: 50
            },
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '活跃度',
                textStyle: {
                    fontSize: 12
                }
            },
            legend: {
                top: 20,
                data: ['普通用户', '服务者']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {

            },
            yAxis: { data: ['昨日', '今日'] },
            series: this.state.onlineData.series
        }).on('click', (params) => {
            this.ifClick=true;
            this.setState({
                mode: params.dataIndex,
                chart: 'online',
                type: 2
            });
            this.getOnlineDetail(params.dataIndex, 2, precision);
        });

        this.initEcharts('order', {
            grid: {
                left: 50,
                top: 80
            },
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '订单数量',
                textStyle: {
                    fontSize: 12
                }
            },
            legend: {
                top: 20,
                data: ['总数', '成交', '取消', '投诉', '价格']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            xAxis: {
                data: this.state.orderData.xAxis
            },
            yAxis: [
                {
                    name: '订单量',
                    type: 'value',
                }, {
                    name: '价格',
                    type: 'value',
                }
            ],
            series: this.state.orderData.series
        }).on('click', (params) => {
            this.ifClick=true;
            console.log(params);
            this.setState({
                mode: params.dataIndex,
                chart: 'order'
            });
            this.getOrderDetail(params.dataIndex, precision);
        });
    }
    render() {
        const RadioButton = Radio.Button;
        const RadioGroup = Radio.Group;
        return (
            <div className="container">
                <Row type="flex" justify="space-around">
                    <Col className="topChart" span={8} id="register">

                    </Col>
                    <Col className="topChart" span={8} id="news">

                    </Col>
                    <Col className="topChart" span={8} id="article">

                    </Col>
                </Row>
                <Row type="flex" justify="space-around">
                    <Col className="middleChart" span={10} id="online">

                    </Col>
                    <Col className="middleChart" span={10} id="active">

                    </Col>
                </Row>
                <Row type="flex" justify="space-around">
                    <Col className="middleChart" span={12} id="order">

                    </Col>
                </Row>
                <Row type="flex" justify="space-around">
                    <Col className="bottomChart" span={20} id="detail">

                    </Col>
                </Row>
                <Row type="flex" justify="space-around" className="immediate-bottom">
                    <RadioGroup defaultValue="1" onChange={(e) => { this.clickBtn(e.target.value) } }>
                        <RadioButton value="1">5分钟</RadioButton>
                        <RadioButton value="2">10分钟</RadioButton>
                        <RadioButton value="3">半小时</RadioButton>
                        <RadioButton value="4">一小时</RadioButton>
                    </RadioGroup>
                </Row>
            </div>
        );
    }
}

export default Immediate;
