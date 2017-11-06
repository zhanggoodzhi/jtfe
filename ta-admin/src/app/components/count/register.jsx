import * as React from "react";
import { Row, Col } from 'antd';
import * as request from "superagent";
import "./register.less"
import echarts from 'echarts';

class register extends React.Component {
    constructor(props) {
        super(props);
        this.preventYear = false;
        this.preventMonth = false;
        this.preventDay = false;
        this.preventHour = false;
        this.state = {
            year: -1,
            month: -1,
            day: -1,
            yearData: {
                xAxis: [],
                data: []
            },
            monthData: {
                xAxis: [],
                data: []
            },
            dayData: {
                xAxis: [],
                data: []
            },
            hourData: {
                xAxis: [],
                data: []
            }
        }
    }
    initEcharts(id, op) {
        let newChart = echarts.init(document.getElementById(id));
        newChart.setOption(op);
        return newChart;
    }
    getDataOfRegister(type) {
        let sendData = null;
        const year = this.state.year;
        const month = this.state.month;
        const day = this.state.day;
        switch (type) {
            case 'year':
                sendData = {
                    year: -1,
                    month: -1,
                    day: -1,
                    hour: -1
                }
                break;
            case 'month':
                sendData = {
                    year: year,
                    month: -1,
                    day: -1,
                    hour: -1
                }
                break;
            case 'day':
                sendData = {
                    year: year,
                    month: month,
                    day: -1,
                    hour: -1
                }
                break;
            case 'hour':
                sendData = {
                    year: year,
                    month: month,
                    day: day,
                    hour: -1
                }
                break;
            default: console.log('switch1出错');
                break;
        }
        request
            .post('/analysis/getDataOfRegister.do')
            .type("form")
            .send(sendData)
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                switch (type) {
                    case 'year':
                        this.setState({
                            yearData: {
                                xAxis: data.split('||')[0].split(','),
                                data: data.split('||')[1].split(',')
                            }
                        });
                        break;
                    case 'month':
                        this.setState({
                            monthData: {
                                xAxis: data.split('||')[0].split(','),
                                data: data.split('||')[1].split(',')
                            }
                        });
                        break;
                    case 'day':
                        this.setState({
                            dayData: {
                                xAxis: data.split('||')[0].split(','),
                                data: data.split('||')[1].split(',')
                            }
                        });
                        break;
                    case 'hour':
                        this.setState({
                            hourData: {
                                xAxis: data.split('||')[0].split(','),
                                data: data.split('||')[1].split(',')
                            }
                        });
                        break;
                    default: console.log('switch2出错');
                        break;
                }
            });
    }

    componentWillMount() {
        let time = new Date();
        this.setState({
            year: time.getFullYear(),
            month: time.getMonth() + 1,
            day: time.getDate()
        }, () => {
            this.getDataOfRegister('year');
            this.getDataOfRegister('month');
            this.getDataOfRegister('day');
            this.getDataOfRegister('hour');
        });
    }
    componentDidUpdate() {
        if (this.preventYear == false) {
            this.initEcharts('year', {
                color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
                title: {
                    text: '年注册',
                    textStyle: {
                        fontSize: 12
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: { data: this.state.yearData.xAxis },
                yAxis: {},
                series: [{
                    name: '注册数',
                    data: this.state.yearData.data,
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }
                }]
            }).on('click', (params) => {
                this.preventYear = true;
                this.preventMonth = false;
                this.preventDay = false;
                this.preventHour = false;
                this.setState({
                    year: params.name,
                    month: 1,
                    day: 1
                }, () => {
                    this.getDataOfRegister('month');
                    this.getDataOfRegister('day');
                    this.getDataOfRegister('hour');
                });
            });
        }
        if (this.preventMonth == false) {
            this.initEcharts('month', {
                color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
                title: {
                    text: '月注册',
                    textStyle: {
                        fontSize: 12
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: { data: this.state.monthData.xAxis },
                yAxis: {},
                series: [{
                    name: '注册数',
                    data: this.state.monthData.data,
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }
                }]
            }).on('click', (params) => {
                this.preventYear = true;
                this.preventMonth = true;
                this.preventDay = false;
                this.preventHour = false;
                this.setState({
                    month: params.name,
                    day: 1
                }, () => {
                    this.getDataOfRegister('day');
                    this.getDataOfRegister('hour');
                });
            });
        }
        if (this.preventDay == false) {
            this.initEcharts('day', {
                color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
                title: {
                    text: '日注册',
                    textStyle: {
                        fontSize: 12
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    }
                },
                xAxis: {
                    data: this.state.dayData.xAxis,
                    boundaryGap: false,
                },
                yAxis: {},
                series: [{
                    name: '注册数',
                    data: this.state.dayData.data,
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }
                }]
            }).on('click', (params) => {
                this.preventYear = true;
                this.preventMonth = true;
                this.preventDay = true;
                this.preventHour = false;
                this.setState({
                    day: params.name
                }, () => {
                    this.getDataOfRegister('hour');
                });
            });
        }
        if (this.preventHour == false) {
            this.initEcharts('hour', {
                color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
                title: {
                    text: '时注册',
                    textStyle: {
                        fontSize: 12
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line'
                    }
                },
                xAxis: {
                    data: this.state.hourData.xAxis,
                    boundaryGap: false,
                },
                yAxis: {},
                series: [{
                    name: '注册数',
                    data: this.state.hourData.data,
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    }
                }]
            })
        }
    }
    render() {
        return (
            <div className="register-container">
                <Row type="flex" justify="space-around">
                    <Col className="chart" span={10} id="year">

                    </Col>
                    <Col className="chart" span={10} id="month">

                    </Col>
                </Row>
                <Row type="flex" justify="space-around">
                    <Col className="chart" span={24} id="day">

                    </Col>
                </Row>
                <Row type="flex" justify="space-around">
                    <Col className="chart" span={24} id="hour">

                    </Col>
                </Row>
            </div>
        );
    }
}
export default register;
