webpackJsonp([44],{

/***/ 1153:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(565);


/***/ }),

/***/ 565:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var spssUtils_1 = __webpack_require__(87);
var echarts = __webpack_require__(10);
__webpack_require__(131);
__webpack_require__(122);
__webpack_require__(133);
__webpack_require__(120);
__webpack_require__(950);
var StatisticsTotalIndex;
(function (StatisticsTotalIndex) {
    var chart;
    var datePicker;
    var type = '0'; // 1:会话数，2：消息数:，3：平均满意率，4：应答匹配率
    $(function () {
        init();
    });
    function init() {
        spssUtils_1.initTip([{
                el: $('.tip'),
                placement: 'left',
                content: "\n\t\t<div class=\"text\"><p><b>\u6D88\u606F\u6570\uFF1A</b>\u95EE\u9898\u548C\u56DE\u590D\u6D88\u606F\u603B\u548C</p><p><b>\u4F1A\u8BDD\u6570\uFF1A</b>\u8BBF\u5BA2\u4ECE\u5F00\u59CB\u54A8\u8BE2\u5230\u7ED3\u675F\u54A8\u8BE2\u4E3A\u4E00\u6B21\u4F1A\u8BDD\uFF1B</p>\n\t\t<p><b>\u8F6C\u4EBA\u5DE5\u6570\uFF1A</b>\u7528\u6237\u4ECE\u667A\u80FD\u5BA2\u670D\u9875\u9762\u8F6C\u4EBA\u5DE5\u5BA2\u670D\u7684\u4F1A\u8BDD\u6570</p><p><b>\u667A\u80FD\u5BA2\u670D\u89E3\u51B3\u6570\uFF1A</b>\u5B8C\u5168\u7531\u667A\u80FD\u5BA2\u670D\u63A5\u5F85\u8BBF\u5BA2\uFF0C\u5373\u672A\u8F6C\u4EBA\u5DE5\u7684\u4F1A\u8BDD\u6570</p>\n\t\t<p><b>\u667A\u80FD\u5BA2\u670D\u89E3\u51B3\u7387\uFF1A</b>\u667A\u80FD\u5BA2\u670D\u89E3\u51B3\u6570\u5728\u6240\u6709\u4F1A\u8BDD\u6570\u4E2D\u7684\u5360\u6BD4</p><p><b>\u5E73\u5747\u6EE1\u610F\u7387\uFF1A</b>\u88AB\u7528\u6237\u8BC4\u4EF7\u4E3A\u6EE1\u610F\u548C\u975E\u5E38\u6EE1\u610F\u7684\u4F1A\u8BDD\u6570\u5728\u6240\u6709\u53C2\u8BC4\u4F1A\u8BDD\u6570\u4E2D\u7684\u5360\u6BD4</p>\n\t\t<p><b>\u53C2\u8BC4\u6570\uFF1A</b>\u7528\u6237\u8FDB\u884C\u4E86\u6EE1\u610F\u5EA6\u8BC4\u4EF7\u7684\u4F1A\u8BDD\u603B\u6570</p><p><b>\u53C2\u8BC4\u7387\uFF1A</b>\u53C2\u8BC4\u6570\u5728\u6240\u6709\u4F1A\u8BDD\u6570\u4E2D\u7684\u5360\u6BD4</p><p><b>\u6709\u7B54\u6848\uFF1A</b>\u667A\u80FD\u5BA2\u670D\u5339\u914D\u5230\u7B54\u6848\u7684\u95EE\u9898\u6570</p>\n\t\t<p><b>\u65E0\u7B54\u6848\uFF1A</b>\u667A\u80FD\u5BA2\u670D\u672A\u5339\u914D\u5230\u7B54\u6848\u7684\u95EE\u9898\u6570</p><p><b>\u5E94\u7B54\u5339\u914D\u7387\uFF1A</b>\u65E0\u7B54\u6848\u95EE\u9898\u5728\u6240\u6709\u95EE\u9898\u4E2D\u7684\u5360\u6BD4</p><p><br></p><p><br></p></div>\n\t\t"
            }]);
        initDatePicker();
        initInfo();
        initChartHeight();
        initCharts();
        bindEvent();
    }
    function initInfo() {
        drawInfo();
    }
    function drawInfo() {
        $.ajax({
            url: 'spss/dataScreening/summary',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            var bigEl = $('.spss-info-wrap');
            var news = bigEl.find('.news');
            news.find('.t').html(data.sumAllMsg);
            news.find('.b1').html(data.sumAllReceiveMsgCount);
            news.find('.b2').html(data.sumAllSendMsgCount);
            var solve = bigEl.find('.solve');
            solve.find('.t').html(data.robotResolutionRate + '%');
            solve.find('.b1').html(data.sumAllSession);
            solve.find('.b2').html(data.sumServicerSessionCount === 0 ? '--' : data.sumServicerSessionCount);
            var satisfy = bigEl.find('.satisfy');
            satisfy.find('.t').html(data.avgSatisfyRate + '%');
            satisfy.find('.b1').html(data.sumAppraise);
            satisfy.find('.b2').html(data.appraiseRate + '%');
            var match = bigEl.find('.match');
            match.find('.t').html(data.answerMatchRate + '%');
            match.find('.b1').html(data.sumHasAnswer);
            match.find('.b2').html(data.sumHasNoAnswer);
        });
    }
    function initChartHeight() {
        var chartHeight = utils_1.getMinContentHeight() - 323;
        var minChartHeight = 300;
        if (chartHeight < minChartHeight) {
            chartHeight = minChartHeight;
        }
        $('.chart-wrap').height(chartHeight);
    }
    function initDatePicker() {
        var el = $('.spss-time-container .date-range-picker');
        datePicker = new spssUtils_1.SpssBtnDate({
            el: el,
            onClick: function (mode, date) {
                drawInfo();
                drawChart();
            }
        });
    }
    function initCharts() {
        chart = echarts.init(document.getElementById('chart'));
        drawChart();
    }
    function drawChart() {
        getChartData(function (data) {
            var op = getOp(data);
            chart.clear();
            chart.setOption(op);
        });
    }
    ;
    function bindEvent() {
        $('#type-select').on('change', function () {
            type = $(this).val();
            drawChart();
            console.log(datePicker.date, datePicker.mode);
        });
    }
    function getChartData(cb) {
        $.ajax({
            url: 'spss/dataScreening/dataFilter',
            method: 'GET',
            data: {
                type: type,
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            cb(data);
        });
    }
    function getOp(data) {
        var xData = data.xData;
        var legend;
        var series = data.yData.map(function (v) {
            return {
                name: v.name,
                type: 'line',
                data: v.data
            };
        });
        var f = {};
        var a = {};
        if (type === '0' || type === '3' || type === '2') {
            f = spssUtils_1.formatter;
            a = spssUtils_1.axisLabel;
        }
        switch (type) {
            case '0':
                legend = ['智能客服解决率'];
                break;
            case '1':
                legend = ['问题消息数', '回复消息数'];
                break;
            case '2':
                legend = ['平均满意率'];
                break;
            case '3':
                legend = ['应答匹配率'];
                break;
            default:
                legend = ['智能客服解决率'];
                break;
        }
        return {
            color: ['#ffb000', '#37a6e7', '#4caf50'],
            series: series,
            toolbox: {
                right: 50,
                feature: {
                    saveAsImage: {}
                }
            },
            tooltip: {
                formatter: f,
                trigger: 'axis'
            },
            legend: {
                data: legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                axisLabel: a,
                type: 'value'
            }
        };
    }
})(StatisticsTotalIndex || (StatisticsTotalIndex = {}));


/***/ }),

/***/ 950:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1153]);
//# sourceMappingURL=44.js.map