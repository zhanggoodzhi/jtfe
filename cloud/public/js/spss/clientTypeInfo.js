require.config({
    paths: {
        "echarts": contextPath + "/js/echarts",
        "echarts/chart/line": contextPath + "/js/echarts-map",
        "echarts/chart/bar": contextPath + "/js/echarts-map",
    }
});

$(function () {
    info.init();
});
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var info = (function ($, undefined) {
    var $stasticsMode = undefined;
    var $day = undefined;
    var $month = undefined;
    var $year = undefined;
    var $startDay = undefined;
    var $endDay = undefined;
    var parser = function (dateStr) {
        var regexDT = /(\d{4})-?(\d{2})?-?(\d{2})?\s?(\d{2})?:?(\d{2})?:?(\d{2})?/g;
        var matchs = regexDT.exec(dateStr);
        if (matchs != null) {
            var date = new Array();
            for (var i = 1; i < matchs.length; i++) {
                if (matchs[i] != undefined) {
                    date[i] = matchs[i];
                } else {
                    if (i <= 3) {
                        date[i] = "01";
                    } else {
                        date[i] = "00";
                    }
                }
            }
            return new Date(date[1], date[2] - 1, date[3], date[4], date[5],
                date[6]);
        } else {
            return new Date();
        }
    };

    var startDay = parser((new Date()).formatDate("yyyy-MM-dd"));
    var endDay = parser((new Date((new Date()).getTime() + 24 * 60 * 60 * 1000))
        .formatDate("yyyy-MM-dd"));

    /*var stasticsModeManager = undefined;*/
    var yearManager = undefined;
    var monthManager = undefined;

    //var today = new Date(currentTime);
    //console.log('today', today);
    var today = new Date(currentTime.replace("-", "/"));
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth() + 1;
    var currentDay = today.getDate();
    var todayStr = (new Date()).formatDate("yyyy-MM-dd");
    /*var stasticsModeData = [{
        id: 0,
        text: "每日统计(以小时单位)"
    }, {
        id: 1,
        text: "每月统计(以天单位)"
    }, {
        id: 2,
        text: "每年统计(以月单位)"
    }, {
        id: 3,
        text: "任意时段统计(以天单位)"
    }];*/
    var yearData = (function () {

        var result = [];

        for (var startYear = currentYear; startYear >= 2013; startYear--) {
            result.push({
                id: startYear,
                text: startYear + "年"
            });
        }
        return result;
    })();
    var monthData = [{
        id: 1,
        text: "1月"
    }, {
        id: 2,
        text: "2月"
    }, {
        id: 3,
        text: "3月"
    }, {
        id: 4,
        text: "4月"
    }, {
        id: 5,
        text: "5月"
    }, {
        id: 6,
        text: "6月"
    }, {
        id: 7,
        text: "7月"
    }, {
        id: 8,
        text: "8月"
    }, {
        id: 9,
        text: "9月"
    }, {
        id: 10,
        text: "10月"
    }, {
        id: 11,
        text: "11月"
    }, {
        id: 12,
        text: "12月"
    }];

    var trendParams = {
        mode: 0,
        day: today,
        year: currentYear,
        month: currentMonth,
        startDay: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
        endDay: today,
        anynomous: -1,
        hour: -1,
        minCount: 0,
        maxCount: -100
    };


    var timeString = todayStr + " 00:00:00";
    var initVar = function () {
        $stasticsMode = $("#stasticsMode");
        $year = $("#year");
        $month = $("#month");
        $day = $("#day");
        $startDay = $("#startDay");
        $endDay = $("#endDay");
    }
    var initCombox = function () {
        initDateBox("0");
        /*stasticsModeManager = $stasticsMode.ligerComboBox({
            width: 200,
            emptyText: "",
            data: stasticsModeData,
            isMultiSelect: false,
            onSelected: function (value) {
                initDateBox(value);
            }
        });
        stasticsModeManager.setValue("0");*/

        yearManager = $year.ligerComboBox({
            width: 80,
            emptyText: "",
            data: yearData,
            isMultiSelect: false,
        });
        yearManager.setValue(2014);

        monthManager = $month.ligerComboBox({
            width: 80,
            emptyText: "",
            data: monthData,
            isMultiSelect: false,
        });
        monthManager.setValue(currentMonth);
    };
    var initDateBox = function (value) {
        console.log('value;',value);
        switch (value) {
            case "0":
                hideAllParam();
                $day.parent().parent().show();
                $day.datebox(getDateConfig());
                $day.datebox("setValue", todayStr);
                break;
            case "1":
                hideAllParam();
                $year.closest(".param").show();
                yearManager.setValue(currentYear);
                $month.closest(".param").show();
                monthManager.setValue(currentMonth);
                break;
            case "2":
                hideAllParam();
                $year.closest(".param").show();
                yearManager.setValue(currentYear);
                break;
            case "3":
                hideAllParam();
                $startDay.parent().parent().show();
                $endDay.parent().parent().show();
                $startDay.datebox(getDateConfig());
                $endDay.datebox(getDateConfig());
                $startDay.datebox("setValue", todayStr);
                $endDay.datebox("setValue", todayStr);
                break;
        }
    };

    var hideAllParam = function () {
        $(".param").hide();
    };

    var getDateConfig = function () {
        return {
            showSeconds: false,
            formatter: formatter,
            parser: parser
        };
    };
    var formatter = function (date) {
        /*var mode = "0"
        if (stasticsModeManager) {
            mode = stasticsModeManager.getValue();
        }*/
        var mode=$stasticsMode.val();
        switch (mode) {
            case "0":
                return date.formatDate("yyyy-MM-dd");
                break;
            case "1":
                return date.formatDate("yyyy-MM");
                break;
            case "2":
                return date.formatDate("yyyy");
                break;
            case "3":
                return date.formatDate("yyyy-MM-dd");
                break;
            default:
                break;
        }
    };


    var trendUrl = contextPath + "/spss/getCategoryTypeData";

    var clientTypeInfoChart = undefined;
    var getEchartsOption = function (serverOption) {
        var option = {
            //			grid : {
            //				x : 0,
            //				y : 60,
            //				x2 : 0,
            //				y2 : 30
            //			},
            calculable: true,
            tooltip: {
                //				trigger : 'item',
                show: true,
                trigger: 'axis'
            },
            title: {
                text: "   会话消息-分类问答趋势  ",
                subtext: '对话次数',
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'bolder',
                    color: '#999'
                },
                y: 'top',
                x: 'left',
            },

            toolbox: {
                show: true,
                x: 'right',
                feature: {
                    magicType: ['line', 'bar'],
                    dataView: true,
                    restore: true,
                    saveAsImage: true
                }
            },
            legend: {
                orient: "horizontal",
                x: "center",
                y: "top",
                data: null
            },
            xAxis: [{
                type: "category",
                data: null
            }],
            yAxis: [{
                type: "value"
            }],
            series: null
        };
        option.legend.data = serverOption.legend;
        option.xAxis[0].data = serverOption.category;
        option.series = serverOption.series;
        return option;
    };
    var initEchart = function () {
        require(['echarts', 'echarts/chart/bar', 'echarts/chart/line', ],
            function (echarts) {
                if (clientTypeInfoChart) {
                    clientTypeInfoChart.clear();
                    //clientTypeInfoChart.dispose();
                }
                clientTypeInfoChart = echarts
                    .init($("#clientTypeInfoChart")[0]);
                /*console.log(1, trendUrl);*/
                $.get(trendUrl, trendParams, function (data) {
                    var option = getEchartsOption(data.data.echartsOption);
                    clientTypeInfoChart.hideLoading();
                    clientTypeInfoChart.setOption(option);
                    //设置单击事件
                    //	echartsConfig = require("echarts/config");
                    //	clientTypeInfoChart.hideLoading();
                    //	clientTypeInfoChart.setOption(option);
                }, "json");

            });
    };
    var getChangedSelected=function(){
        console.log($stasticsMode.val());
        initDateBox($stasticsMode.val());
    }
    var updateData = function () {
        var mode=$stasticsMode.val();
       // var mode = stasticsModeManager.getValue();
        trendParams.mode = mode;
        trendParams.anynomous = -1;
        switch (mode) {
            case "0":
                let commonDay = parser($day.datebox("getValue"));
                trendParams.day = new Date(commonDay).Format("yyyy-MM-dd hh:mm:ss");
                startDay = new Date(trendParams.day).Format("yyyy-MM-dd hh:mm:ss");
                endDay = new Date(commonDay.getTime() + 24 * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
                trendParams.startDay = startDay;
                trendParams.endDay = endDay;
                break;
            case "1":
                trendParams.year = yearManager.getValue();
                trendParams.month = monthManager.getValue();
                if (trendParams.month < 10) {

                    startDay = parser(trendParams.year + "-0" + trendParams.month);
                } else {
                    startDay = parser(trendParams.year + "-" + trendParams.month);

                }

                endDay = new Date(new Date(startDay.getTime()).setMonth(startDay
                    .getMonth() + 1));
                trendParams.startDay = (new Date(startDay)).Format("yyyy-MM-dd hh:mm:ss");
                trendParams.endDay = endDay.Format("yyyy-MM-dd hh:mm:ss");
                break;
            case "2":
                trendParams.year = yearManager.getValue();
                startDay = parser(trendParams.year);
                endDay = new Date(new Date(startDay.getTime()).setYear(startDay
                    .getFullYear() + 1));
                trendParams.startDay = (new Date(startDay)).Format("yyyy-MM-dd hh:mm:ss");
                trendParams.endDay = endDay.Format("yyyy-MM-dd hh:mm:ss");
                break;
            case "3":
                /*trendParams.startDay = parser($startDay.datebox("getValue"));
                trendParams.endDay = parser($endDay.datebox("getValue"));
                startDay = trendParams.startDay;
                endDay = new Date(trendParams.endDay.getTime() + 24 * 60 * 60 *
                    1000).Format("yyyy-MM-dd hh:mm:ss");
                trendParams.startDay = startDay;
                trendParams.endDay = endDay;*/
                trendParams.startDay = (new Date($startDay.datebox("getValue"))).Format("yyyy-MM-dd hh:mm:ss");
                trendParams.endDay = (new Date($endDay.datebox("getValue"))).Format("yyyy-MM-dd hh:mm:ss");
                break;
            default:
                break;
        }


    };
    var analyseClient = function () {

        updateData();

        initEchart();

    };

    method = {
        init: function () {
            trendParams.day = new Date(currentTime).Format("yyyy-MM-dd hh:mm:ss");
            trendParams.startDay = trendParams.day;
            trendParams.endDay = trendParams.day;
            initEchart();
            initVar();
            initCombox();
        },
        analyseClient: analyseClient,
        getChangedSelected:getChangedSelected
    };
    return method;

})(jQuery);
