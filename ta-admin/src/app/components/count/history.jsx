import * as echarts from 'echarts';
import * as React from "react";
import * as request from "superagent";
import "./gift.less";

class History extends React.Component {
    constructor(props) {
        super(props);
        this.registerChart = null;
        this.messageChart = null;
        this.onlineChart = null;
        this.activeChart = null;
        this.articleChart = null;
        this.orderChart = null;
        this.state = {
            registerData: {
                categories: ["最低", "平均", '最高'],
                data: [],
                summary: ''
            },
            messageData: {
                categories: ["最低", "平均", '最高'],
                data: [],
                summary: ''
            },
            onlineData: {
                data1: '',
                data2: ''
            },
            activeData: {
                data1: [],
                data2: []
            },
            articleData: {
                data1: [],
                data2: [],
                data3: []
            },
            orderData: {
                data1: [],
                data2: [],
                data3: [],
                data4: [],
                data5: [],
            }
        }
    }
    getData() {
        request
            .post('/featureSummary/getFeatureData.do')
            .type("form")
            .send({
                mode: 1
            })
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    registerData: {
                        categories: data.split('||')[0].split(','),
                        data: data.split('||')[2].split(','),
                        summary: '注册总数：' + data.split('||')[1]
                    }
                });
            });
        request
            .post('/featureSummary/getFeatureData.do')
            .type("form")
            .send({
                mode: 2
            })
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    messageData: {
                        categories: data.split('||')[0].split(','),
                        data: data.split('||')[2].split(','),
                        summary: '注册总数：' + data.split('||')[1].split(',')
                    }
                });
            });
        request
            .post('/featureSummary/getOnlineData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    onlineData: {
                        data1: data.split('||')[0],
                        data2: data.split('||')[1]
                    },
                });
            });
        request
            .post('/featureSummary/getActivityData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    activeData: {
                        data1: data.split('||')[0].split(','),
                        data2: data.split('||')[1].split(',')
                    }
                });
            });
        request
            .post('/featureSummary/getArticleData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    articleData: {
                        data1: data.split('||')[0].split(','),
                        data2: data.split('||')[1].split(','),
                        data3: data.split('||')[2].split(',')
                    },
                });
            });
        request
            .post('/featureSummary/getOrderData.do')
            .type("form")
            .send()
            .end((err, res) => {
                let data = JSON.parse(res.text).data.data;
                this.setState({
                    orderData: {
                        categories: ['最低', '平均', '最高'],
                        data1: data.split('||')[0].split(','),
                        data2: data.split('||')[1].split(','),
                        data3: data.split('||')[2].split(','),
                        data4: data.split('||')[3].split(','),
                        data5: data.split('||')[4].split(',')
                    }
                });
            });

    }
    componentDidMount() {
        this.getData();
        //注册总数
        const registerOption = {
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: ''
            },

            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '注册数',
                    type: 'bar',
                    data: [],
                    barWidth: '60%'
                }
            ]
        }
        this.registerChart = echarts.init(document.getElementById('register'));
        //初始化yearOption
        this.registerChart.setOption(registerOption);


        //消息总数
        const messageOption = {
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '消息数',
                    type: 'bar',
                    data: [],
                    barWidth: '60%'
                }
            ]
        }
        this.messageChart = echarts.init(document.getElementById('message'));
        //初始化yearOption
        this.messageChart.setOption(messageOption);



        //==========在线用户
        const onlineOption = {
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '在线用户',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                top: 20,
                orient: 'vertical',
                left: 'left',
                data: ['用户', '服务者']
            },
            series: [
                {
                    name: '在线人数',
                    type: 'pie',
                    data: [{ name: '', value: '' }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        this.onlineChart = echarts.init(document.getElementById('online'));
        //初始化yearOption
        this.onlineChart.setOption(onlineOption);




        //===================活跃度
        const activeOption = {
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '活跃度'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 20,
                data: ['普通用户', '服务者']
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: ['最低', '平均', '最高']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '普通用户',
                    type: 'bar',
                    data: []
                },
                {
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '服务者',
                    type: 'bar',
                    data: []
                }
            ]
        };
        this.activeChart = echarts.init(document.getElementById('active'));
        //初始化yearOption
        this.activeChart.setOption(activeOption);



        //=========文章统计
        const articleOption = {
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '文章统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 20,
                data: ['发帖', '点赞', '回复']
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: ['最低', '平均', '最高']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '发帖',
                    type: 'bar',
                    data: []
                },
                {
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '点赞',
                    type: 'bar',
                    data: []
                },
                {
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '回复',
                    type: 'bar',
                    data: []
                }
            ]
        };
        this.articleChart = echarts.init(document.getElementById('article'));
        //初始化yearOption
        this.articleChart.setOption(articleOption);



        //==========订单统计
        const orderOption = {
            color: ['#2db7f4', '#ffb000', '#69ef3b', '#ff7174', '#ff9873'],
            title: {
                text: '订单统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                top: 20,
                data: ['总数', '成交', '取消', '投诉', '价格']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['最低', '平均', '最高']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '订单量',
                    axisLabel: {
                        formatter: '{value}个'
                    }
                },
                {
                    type: 'value',
                    name: '价格',
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                }
            ],
            series: [
                {
                    yAxisIndex: 0,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '总数',
                    type: 'bar',
                    data: []
                },
                {
                    yAxisIndex: 0,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '成交',
                    type: 'bar',
                    data: []
                },
                {
                    yAxisIndex: 0,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '取消',
                    type: 'bar',
                    data: []
                },
                {
                    yAxisIndex: 0,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '投诉',
                    type: 'bar',
                    data: []
                },
                {
                    yAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    name: '价格',
                    type: 'line',
                    data: []
                }
            ]
        };
        this.orderChart = echarts.init(document.getElementById('order'));
        //初始化yearOption
        this.orderChart.setOption(orderOption);

    }
    componentDidUpdate() {
        const registerData = this.state.registerData;
        this.registerChart.setOption({
            title: {
                text: registerData.summary
            },
            xAxis: {
                data: registerData.categories
            },
            series: [{
                name: '注册数',
                data: registerData.data
            }]
        });


        const messageData = this.state.messageData;
        this.messageChart.setOption({
            title: {
                text: messageData.summary
            },
            xAxis: {
                data: messageData.categories
            },
            series: [{
                name: '消息数',
                data: messageData.data
            }]
        });



        const onlineData = this.state.onlineData;
        this.onlineChart.setOption({
            series: [{
                name: '在线人数',
                data: [{ name: '用户', value: onlineData.data1 }, { name: '服务者', value: onlineData.data2 }]
            }]
        });



        const activeData = this.state.activeData;
        this.activeChart.setOption({
            series: [{
                name: '普通用户',
                data: activeData.data1
            }, {
                name: '服务者',
                data: activeData.data2
            }]
        });



        const articleData = this.state.articleData;
        this.articleChart.setOption({
            series: [{
                name: '发帖',
                data: articleData.data1
            }, {
                name: '点赞',
                data: articleData.data2
            }, {
                name: '回复',
                data: articleData.data3
            }]
        });



        const orderData = this.state.orderData;
        this.orderChart.setOption({
            series: [{
                name: '总数',
                data: orderData.data1
            }, {
                name: '成交',
                data: orderData.data2
            }, {
                name: '取消',
                data: orderData.data3
            }, {
                name: '投诉',
                data: orderData.data2
            }, {
                name: '价格',
                data: orderData.data3
            }]
        });
    }

    render() {
        return (
            <div>
                <div style={{ marginBottom: 40 }}>
                    <div id='register' style={{ width: '33%', height: 300, display: 'inline-block' }}></div>
                    <div id='message' style={{ width: '33%', height: 300, display: 'inline-block' }}></div>
                    <div id='online' style={{ width: '33%', height: 300, display: 'inline-block' }}></div>
                </div>
                <div style={{ marginBottom: 40 }}>
                    <div id='active' style={{ width: '48%', height: 300, display: 'inline-block' }}></div>
                    <div id='article' style={{ width: '48%', height: 300, display: 'inline-block' }}></div>
                </div>
                <div id='order' style={{ width: '100%', height: 300 }}></div>
            </div>
        );
    }
}
export default History;