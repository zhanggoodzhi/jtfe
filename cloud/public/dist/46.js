webpackJsonp([46],{

/***/ 1150:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(563);


/***/ }),

/***/ 563:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var new_table_1 = __webpack_require__(7);
var spssUtils_1 = __webpack_require__(87);
var echarts = __webpack_require__(10);
// import 'echarts/lib/chart/bar';
__webpack_require__(131);
__webpack_require__(122);
// import 'echarts/lib/component/title';
__webpack_require__(133);
__webpack_require__(120);
__webpack_require__(947);
var StatisticsServiceIndex;
(function (StatisticsServiceIndex) {
    var chart;
    var datePicker;
    var serviceTable;
    var service;
    var type = '0';
    $(function () {
        init();
    });
    function init() {
        spssUtils_1.initTip([{
                el: $('#service-tip'),
                content: "\n\t\t\t\u7EDF\u8BA1\u4EBA\u5DE5\u5BA2\u670D\u7684\u4F1A\u8BDD\u6570\uFF0C\u6536\u5230\u7684\u95EE\u9898\u6D88\u606F\u6570\uFF0C\u53D1\u51FA\u7684\u56DE\u590D\u6D88\u606F\u6570\uFF0C\u5728\u7EBF\u603B\u65F6\u957F\uFF0C\u4F1A\u8BDD\u603B\u65F6\u957F\uFF0C\u5728\u7EBF\u4EBA\u5DE5\u5229\u7528\uFF0C\u5E73\u5747\u76F8\u5E94\u65F6\u957F\u4EE5\u53CA\u5E73\u5747\u6EE1\u610F\u7387\n\t\t\t"
            }]);
        initDatePicker();
        initChartHeight();
        renderSelectDataAndDrawChart();
        drawTable();
        bindEvent();
    }
    function renderSelectDataAndDrawChart() {
        $.ajax({
            url: 'spss/staffService/getServicer',
            method: 'GET'
        }).done(function (data) {
            var selectEl = $('#service-select');
            selectEl.empty();
            if (data.length === 0) {
                selectEl.prop('disabled', true).append("\n\t\t\t\t<option>\u65E0\u4EBA\u5DE5\u5BA2\u670D</option>\n\t\t\t");
                return;
            }
            selectEl.prop('disabled', false);
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var v = data_1[_i];
                selectEl.append("\n\t\t\t\t<option value=\"" + v.id + "\">" + v.alias + "</option>\n\t\t\t");
            }
            service = data[0].id;
            drawChart();
        });
    }
    function drawTable() {
        $.ajax({
            type: 'POST',
            url: 'spss/staffService/serviceStatistics',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (msg) {
            if (serviceTable) {
                serviceTable.refresh(msg);
                return;
            }
            serviceTable = new new_table_1.Table({
                el: $('#service-table'),
                options: {
                    info: false,
                    data: msg,
                    paging: false,
                    scrollY: '300px',
                    serverSide: false,
                    columns: [
                        { data: 'servicerName', title: '客服名称' },
                        { data: 'sessionCount', title: '会话数' },
                        { data: 'servicerReceiveMsg', title: '问题消息数' },
                        { data: 'servicerSendMsg', title: '回复消息数' },
                        { data: 'onlineTimeAll', title: '在线总时长<i class="table-tip fa fa-question-circle" id="t1-tip"></i>', render: function (time) { return time === '--' ? '--' : utils_1.renderMilliTimeLength(time); } },
                        { data: 'sessionTimeAll', title: '会话总时长<i class="table-tip fa fa-question-circle" id="t2-tip"></i>', render: function (time) { return time === '--' ? '--' : utils_1.renderMilliTimeLength(time); } },
                        { data: 'utilization', title: '在线人工利用率<i class="table-tip fa fa-question-circle" id="t3-tip"></i>', render: function (text) { return text === '--' ? '--' : utils_1.renderPercent(text); } },
                        { data: 'responTimeAll', title: '平均响应时长<i class="table-tip fa fa-question-circle" id="t4-tip"></i>', render: function (time) { return time === '--' ? '--' : utils_1.renderMilliTimeLength(time); } },
                        { data: 'statisticsRate', title: '平均满意率<i class="table-tip fa fa-question-circle" id="t5-tip"></i>', render: function (text) { return text === '--' ? '--' : utils_1.renderPercent(text); } }
                    ],
                    initComplete: function () {
                        spssUtils_1.initTip([{
                                el: $('#t1-tip'),
                                content: "\n\t\t\t\t\t\t\t\t\u4EBA\u5DE5\u5BA2\u670D\u7684\u603B\u5728\u7EBF\u65F6\u957F\n\t\t\t\t\t\t\t"
                            }, {
                                el: $('#t2-tip'),
                                content: "\n\t\t\t\t\t\t\t\t\u4EBA\u5DE5\u5BA2\u670D\u7684\u603B\u4F1A\u8BDD\u65F6\u957F\n\t\t\t\t\t\t\t"
                            }, {
                                el: $('#t3-tip'),
                                content: "\n\t\t\t\t\t\t\t\t\u4EBA\u5DE5\u5BA2\u670D\u7684\u4F1A\u8BDD\u603B\u65F6\u957F\u5728\u5728\u7EBF\u603B\u65F6\u957F\u4E2D\u7684\u5360\u6BD4\n\t\t\t\t\t\t\t"
                            }, {
                                el: $('#t4-tip'),
                                content: "\n\t\t\t\t\t\t\t\t\u6765\u8BBF\u7528\u6237\u53D1\u8D77\u8F6C\u4EBA\u5DE5\u8BF7\u6C42\u5230\u4EBA\u5DE5\u5BA2\u670D\u63A5\u53D7\u8BF7\u6C42\u7684\u5E73\u5747\u8017\u65F6\n\t\t\t\t\t\t\t"
                            }, {
                                el: $('#t5-tip'),
                                placement: 'left',
                                content: "\n\t\t\t\t\t\t\t\t\u88AB\u6765\u8BBF\u7528\u6237\u8BC4\u4EF7\u4E3A\u6EE1\u610F\u548C\u975E\u5E38\u6EE1\u610F\u7684\u4F1A\u8BDD\u6570\u5728\u6240\u6709\u53C2\u8BC4\u4F1A\u8BDD\u6570\u4E2D\u7684\u5360\u6BD4\n\t\t\t\t\t\t\t"
                            }]);
                        $('#export').on('click', function () {
                            var href = "spss/staffService/exportServiceStatisticsExcel?" + $.param({
                                mode: datePicker.mode,
                                startDay: datePicker.date.startDay,
                                endDay: datePicker.date.endDay
                            });
                            window.open(href);
                        });
                    }
                }
            });
        });
        // const data = [{
        // 	rank: 1,
        // 	question: 2,
        // 	type: 3,
        // 	number: 4
        // }, {
        // 	rank: 1,
        // 	question: 2,
        // 	type: 3,
        // 	number: 4
        // }, {
        // 	rank: 1,
        // 	question: 2,
        // 	type: 3,
        // 	number: 4
        // }];
        // const table = $('#service-table').DataTable(
        // 	{
        // 		data,
        // 		scrollY: '300px',
        // 		serverSide: false,
        // 		info: false,
        // 		columns: [
        // 			{ data: 'rank', title: '排行' },
        // 			{ data: 'question', title: '类型' },
        // 			{ data: 'type', title: '参评数' },
        // 			{ data: 'number', title: '参评率' },
        // 			{ data: 'type', title: '好评数' },
        // 			{ data: 'type', title: '好评率' },
        // 			{ data: 'type', title: '差评数' },
        // 			{ data: 'type', title: '差评率' }
        // 		]
        // 	});
        // serviceTable = new Table(table);
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
                drawTable();
                renderSelectDataAndDrawChart();
            }
        });
    }
    function drawChart() {
        if (!chart) {
            chart = echarts.init(document.getElementById('chart'));
        }
        getChartData(function (data) {
            chart.clear();
            chart.setOption(getOp(data));
        });
    }
    function bindEvent() {
        $('#service-select').on('change', function () {
            service = $(this).val();
            drawChart();
        });
        $('#data-select').on('change', function () {
            type = $(this).val();
            drawChart();
        });
    }
    function getChartData(cb) {
        $.ajax({
            url: 'spss/staffService/lineChart',
            method: 'GET',
            data: {
                servicerId: service,
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
        var legend = data.yData.map(function (v) {
            return v.name;
        });
        var f = {};
        var a = {};
        var series = data.yData.map(function (v) {
            return {
                name: v.name,
                type: 'line',
                data: v.data
            };
        });
        if (type === '2') {
            a = {
                formatter: function (value, index) {
                    return utils_1.renderMilliTimeLength(value);
                }
            };
            f = function (params, ticket, callback) {
                return "\n\t\t\t\t\t" + params[0].axisValue + "<br/>\n\t\t\t\t\t<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:" + params[0].color + "\"></span> " + params[0].seriesName + "\uFF1A" + utils_1.renderMilliTimeLength(params[0].data) + "<br/>\n\t\t\t\t\t<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:" + params[1].color + "\"></span> " + params[1].seriesName + "\uFF1A" + utils_1.renderMilliTimeLength(params[1].data) + "\n\t\t\t\t";
            };
        }
        if (type === '3') {
            f = spssUtils_1.formatter;
            a = spssUtils_1.axisLabel;
        }
        return {
            color: ['#ffb000', '#37a6e7', '#4caf50'],
            series: series,
            tooltip: {
                formatter: f,
                trigger: 'axis'
            },
            toolbox: {
                right: 50,
                feature: {
                    saveAsImage: {}
                }
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
})(StatisticsServiceIndex || (StatisticsServiceIndex = {}));


/***/ }),

/***/ 947:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1150]);
//# sourceMappingURL=46.js.map