/*global Chart  moment resizeHeight*/
"use strict";
$(function () {
    initDate("day");
    initServiceDate();
    getData("day");
    getServiceData();
    $("#change-view").on("change", changeView);
    $("#change-time").on("change", changeTime);
    $("#custom-service-change-time").on("change", changeServiceTime);
});
var user, message, data, serviceData;
var locale = {
    "format": "YYYY-MM-DD",
    "separator": " - ",
    "applyLabel": "确定",
    "cancelLabel": "取消",
    "fromLabel": "从",
    "toLabel": "到",
    "customRangeLabel": "时间表",
    "weekLabel": "W",
    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
    "monthNames": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    "firstDay": 1
};

function createData() {
    var dataList = ["user", "message"];
    data = {};
    dataList.forEach(function (v) {
        data[v] = {
            options: {
                tooltips: {
                    mode: "single"
                }
            },
            data: {
                datasets: [],
                labels: []
            }
        };
    });
    data.message.options.tooltips.callbacks = {
        label: function (tooltip, tooltipData) {
            var custom = tooltipData.datasets[0].data[tooltip.index],
                person = tooltipData.datasets[1].data[tooltip.index],
                robot = tooltipData.datasets[2].data[tooltip.index],
                accNum=custom==0?0:Math.ceil(person / custom * 100),
                robotNum=custom==0?0:Math.ceil(robot / custom * 100);
            return ["用户发送消息数：" + custom, "人工客服回复数：" + person + " (" + accNum + "%)", "机器人回复数：" + robot + " (" + robotNum + "%)"];
        }
    };
    data.user.options.tooltips.callbacks = {
        label: function (tooltip, tooltipData) {
            var customMessage = tooltipData.datasets[0].data[tooltip.index],
                askPerson = tooltipData.datasets[1].data[tooltip.index],
                personServer = tooltipData.datasets[2].data[tooltip.index],
                accNum=askPerson==0?0:Math.ceil(personServer / askPerson * 100),
                reqNum=customMessage==0?0:Math.ceil(askPerson / customMessage * 100);
            return ["发送消息用户数：" + customMessage, "请求人工客服用户数：" + askPerson + " (" +reqNum+ "%)", "人工客服接待用户数：" + personServer + " (" + accNum + "%)"];
        }
    };
}

function initUser() {
    if (user) {
        user.destroy();
    }
    user = new Chart($("#user-num"), {
        type: 'line',
        data: data.user.data,
        options: data.user.options
    });
}

function initMessage() {
    if (message) {
        message.destroy();
    }
    message = new Chart($("#message-num"), {
        type: 'line',
        data: data.message.data,
        options: data.message.options
    });
}


function getData(view) {
    var url;
    var date = $("#change-time").val().split(" - ");
    if (date.length === 1) {
        date.push(moment(date[0]).add(1, 'day').format("YYYY-MM-DD"));
    }
    if (view === "day") {
        url = "spss/cs/listAppStatByDayBetween";
    } else {
        url = "spss/cs/listAppStatByHourBetween";
    }
    //清空或初始化data
    createData();
    $.ajax({
        url: url,
        type: "GET",
        data: {
            start: date[0],
            end: date[1]
        },
        success: function (returnData) {
            //            if (returnData.msg.length <= 0) {
            //                $("#app-wrap").hide();
            //                return;
            //            } else {
            //                $("#app-wrap").show();
            //            }
            var userProps = [
                    // {
                    //     name: "countVisitor",
                    //     zhName: "访问数",
                    //     color: "#4BC0C0"
                    // },
                    {
                        name: "countVisitorSendmsg",
                        zhName: "发送消息的用户数",
                        color: "#4BC0C0"
                    },
                    {
                        name: "countVistorAsk4servicer",
                        zhName: "请求人工客服用户数",
                        color: "#BDB76B"
                    },
                    {
                        name: "countVistorAcceptedByServicer",
                        zhName: "人工客服接待用户数",
                        color: "#87CEFA"
                    }

                ],
                messageProps = [{
                        name: "countMsgByVistor",
                        zhName: "用户发送消息数",
                        color: "#4BC0C0"
                    },
                    {
                        name: "countMsgByServicer",
                        zhName: "人工客服回复数",
                        color: "#BDB76B"
                    },
                    {
                        name: "countMsgByRobot",
                        zhName: "机器人回复数",
                        color: "#F08080"
                    }
                ];

            pushData(returnData.msg.user, data.user, userProps);
            pushData(returnData.msg.msg, data.message, messageProps);
            initUser();
            initMessage();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function pushData(rData, fData, prop) {
    rData.forEach(function (v) {
        fData.data.labels.push(v.thedate);
    });
    prop.forEach(function (v) {
        var d = [];
        rData.forEach(function (vd) {
            d.push(vd[v.name]);
        });
        fData.data.datasets.push({
            label: v.zhName,
            borderColor: v.color,
            backgroundColor: v.color,
            fill: false,
            lineTension: 0.3,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 1,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: d
        });
    });
}


function changeView() {
    initDate($(this).val());
}

function initDate(view) {
    var el = $("#change-time");
    if (el.attr("data-date")) {
        el.attr("data-date", "true");
        el.data('daterangepicker').remove();
    }
    if (view === "day") {
        el.daterangepicker({
            autoApply: true,
            timePicker: false,
            locale: locale,
            startDate: moment().subtract(30, 'days'),
            endDate: moment()
        });
    } else {
        el.daterangepicker({
            autoApply: true,
            singleDatePicker: true,
            locale: locale,
            startDate: moment().subtract(1, 'days')
        });
    }
}

function initServiceDate() {
    $("#custom-service-change-time").daterangepicker({
        autoApply: true,
        timePicker: false,
        locale: locale,
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    });
}

function changeTime() {
    getData($("#change-view").val());
}

function getServiceData() {
    var date = $("#custom-service-change-time").val().split(" - ");
    $.ajax({
        url: "spss/cs/listServiceStatByDayBetween",
        data: {
            start: date[0],
            end: date[1] ? date[1] : date[0]
        },
        success: function (returnData) {
            //            if (returnData.msg.length <= 0) {
            //                $("#server-wrap").hide();
            //                return;
            //            } else {
            //                $("#server-wrap").show();
            //            }
            returnData.msg.forEach(function (v) {
                var startMin;
                v.startTime = [];
                v.workTime = v.offlinedate.map(function (v1, i1) {
                    var start = new Date(v.onlinedate[i1]);
                    var time = new Date(v1).getTime() - start.getTime();
                    time = Math.ceil(time / (1000 * 60 * 60) * 10) / 10;
                    startMin = Math.ceil(start.getMinutes() / 6);
                    v.startTime.push(Number(start.getHours() + "." + startMin));
                    return time;
                });
            });
            var showData = [{
                    name: "workTime",
                    type: "bar",
                    originName: [{
                            name: "startTime",
                            zhName: "上班打卡时间",
                            color: "transparent",
                        },
                        {
                            name: "workTime",
                            zhName: "上班时长",
                            color: "#FF69B4"
                        },
                        {
                            name: "onlinedate",
                            zhName: "上班时间",
                            color: "transparent"
                        },
                        {
                            name: "offlinedate",
                            zhName: "下班时间",
                            color: "transparent"
                        }

                    ],
                    options: {
                        title: {
                            display: true,
                            text: "打卡时长",
                            fontFamily: "Microsoft Yahei",
                            fontStyle: "normal"
                        },
                        scales: {
                            xAxes: [{
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                    max: 24,
                                    min: 0,
                                    stepSize: 8
                                }
                            }]
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            mode: "single",
                            callbacks: {
                                label: function (tooltips, tooltipsData) {
                                    var onTime = tooltipsData.datasets[2].data[tooltips.index].slice(-5),
                                        offTime = tooltipsData.datasets[3].data[tooltips.index].slice(-5),
                                        workTime = tooltipsData.datasets[1].data[tooltips.index];
                                    return ["上班时间:" + onTime, "下班时间:" + offTime, "上班时长:" + workTime + "小时"];
                                }
                            }
                        }
                    }

                },
                {
                    name: "messageNum",
                    type: "bar",
                    originName: [{
                        name: "countServicerMsg",
                        zhName: "发送消息总数",
                        color: "#FFC0CB"
                    }],
                    options: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: "发送消息总数",
                            fontFamily: "Microsoft Yahei",
                            fontStyle: "normal"
                        }
                    }
                },
                {
                    name: "personNum",
                    type: "line",
                    originName: [{
                            name: "countRequestAccepted",
                            zhName: "接待客户数量",
                            color: "#2F4F4F"
                        }

                    ],
                    options: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: "接待客户数量",
                            fontFamily: "Microsoft Yahei",
                            fontStyle: "normal"
                        }
                    }
                }
            ];
            createServeiceElement(returnData.msg, showData);
            createServeiceData(returnData.msg, showData);
            returnData.msg.forEach(function (v) {
                showData.forEach(function (v1) {
                    var el = $("#" + v.account).find("#" + v.account + "-" + v1.name);
                    var data = serviceData[v.account][v1.name].data,
                        options = serviceData[v.account][v1.name].options;

                    if (!options.scales && data && data.datasets && data.datasets[0] && data.datasets[0].data && data.datasets[0].data.length > 0) {
                        var max = Math.max.apply(null, data.datasets[0].data),
                            step = Math.ceil(max / 3);

                        options = $.extend({
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        stepSize: step
                                    }
                                }]
                            }
                        }, options)
                    }


                    new Chart(el, {
                        type: v1.type,
                        data: data,
                        options: options
                    });
                });
            });
            resizeHeight();
        },
        error: function (err) {
            console.error(err);
        }
    });
}

function createServeiceElement(data, showData) {
    var el = "";
    data.forEach(function (v) {
        el += "<div id=" + v.account + "><h5 class='service-name'>" + v.name + "</h5>";
        showData.forEach(function (v1) {
            el += "<div class='col-md-4 " + v1.name + "'><canvas id=" + v.account + "-" + v1.name + "></canvas></div>";
        });
        el += "</div><hr/>";

    });
    $("#custom-service-wrap").append(el);

}

function createServeiceData(data, showData) {
    serviceData = {};
    data.forEach(function (v) {
        var labels = v.thedate;
        serviceData[v.account] = {};
        showData.forEach(function (v1) {
            serviceData[v.account][v1.name] = {
                options: v1.options ? v1.options : {},
                data: {
                    datasets: [],
                    labels: labels
                }
            };
            v1.originName.forEach(function (v2) {
                serviceData[v.account][v1.name].data.datasets.push({
                    label: v2.zhName,
                    data: v[v2.name],
                    backgroundColor: v2.color,
                    borderColor: v2.color,
                    borderJoinStyle: 'miter',
                    pointBorderWidth: 1,
                    pointHoverRadius: 3,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    lineTension: 0.3,
                    fill: false,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    pointHitRadius: 10
                });
            });

        });

    });

}


function changeServiceTime() {
    $("#custom-service-wrap").empty();
    getServiceData();
}
