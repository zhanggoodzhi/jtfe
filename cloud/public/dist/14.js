webpackJsonp([14],{

/***/ 1016:
/***/ (function(module, exports) {

module.exports = "/*!\r\n * jQCloud Plugin for jQuery\r\n *\r\n * Version 1.0.4\r\n *\r\n * Copyright 2011, Luca Ongaro\r\n * Licensed under the MIT license.\r\n *\r\n * Date: 2013-05-09 18:54:22 +0200\r\n*/\r\n(function(e){\"use strict\";e.fn.jQCloud=function(t,n){var r=this,i=r.attr(\"id\")||Math.floor(Math.random()*1e6).toString(36),s={width:r.width(),height:r.height(),center:{x:(n&&n.width?n.width:r.width())/2,y:(n&&n.height?n.height:r.height())/2},delayedMode:t.length>50,shape:!1,encodeURI:!0,removeOverflowing:!0};n=e.extend(s,n||{}),r.addClass(\"jqcloud\").width(n.width).height(n.height),r.css(\"position\")===\"static\"&&r.css(\"position\",\"relative\");var o=function(){var s=function(e,t){var n=function(e,t){return Math.abs(2*e.offsetLeft+e.offsetWidth-2*t.offsetLeft-t.offsetWidth)<e.offsetWidth+t.offsetWidth&&Math.abs(2*e.offsetTop+e.offsetHeight-2*t.offsetTop-t.offsetHeight)<e.offsetHeight+t.offsetHeight?!0:!1},r=0;for(r=0;r<t.length;r++)if(n(e,t[r]))return!0;return!1};for(var o=0;o<t.length;o++)t[o].weight=parseFloat(t[o].weight,10);t.sort(function(e,t){return e.weight<t.weight?1:e.weight>t.weight?-1:0});var u=n.shape===\"rectangular\"?18:2,a=[],f=n.width/n.height,l=function(o,l){var c=i+\"_word_\"+o,h=\"#\"+c,p=6.28*Math.random(),d=0,v=0,m=0,g=5,y=\"\",b=\"\",w;l.html=e.extend(l.html,{id:c}),l.html&&l.html[\"class\"]&&(y=l.html[\"class\"],delete l.html[\"class\"]),t[0].weight>t[t.length-1].weight&&(g=Math.round((l.weight-t[t.length-1].weight)/(t[0].weight-t[t.length-1].weight)*9)+1),w=e(\"<span>\").attr(l.html).addClass(\"w\"+g+\" \"+y),l.link?(typeof l.link==\"string\"&&(l.link={href:l.link}),n.encodeURI&&(l.link=e.extend(l.link,{href:encodeURI(l.link.href).replace(/'/g,\"%27\")})),b=e(\"<a>\").attr(l.link).text(l.text)):b=l.text,w.append(b);if(!!l.handlers)for(var E in l.handlers)l.handlers.hasOwnProperty(E)&&typeof l.handlers[E]==\"function\"&&e(w).bind(E,l.handlers[E]);r.append(w);var S=w.width(),x=w.height(),T=n.center.x-S/2,N=n.center.y-x/2,C=w[0].style;C.position=\"absolute\",C.left=T+\"px\",C.top=N+\"px\";while(s(w[0],a)){if(n.shape===\"rectangular\"){v++,v*u>(1+Math.floor(m/2))*u*(m%4%2===0?1:f)&&(v=0,m++);switch(m%4){case 1:T+=u*f+Math.random()*2;break;case 2:N-=u+Math.random()*2;break;case 3:T-=u*f+Math.random()*2;break;case 0:N+=u+Math.random()*2}}else d+=u,p+=(o%2===0?1:-1)*u,T=n.center.x-S/2+d*Math.cos(p)*f,N=n.center.y+d*Math.sin(p)-x/2;C.left=T+\"px\",C.top=N+\"px\"}if(n.removeOverflowing&&(T<0||N<0||T+S>n.width||N+x>n.height)){w.remove();return}a.push(w[0]),e.isFunction(l.afterWordRender)&&l.afterWordRender.call(w)},c=function(i){i=i||0;if(!r.is(\":visible\")){setTimeout(function(){c(i)},10);return}i<t.length?(l(i,t[i]),setTimeout(function(){c(i+1)},10)):e.isFunction(n.afterCloudRender)&&n.afterCloudRender.call(r)};n.delayedMode?c():(e.each(t,l),e.isFunction(n.afterCloudRender)&&n.afterCloudRender.call(r))};return setTimeout(function(){o()},10),r}})(jQuery);"

/***/ }),

/***/ 1031:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20)(__webpack_require__(1016))

/***/ }),

/***/ 1148:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(561);


/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";



    var echarts = __webpack_require__(10);
    var graphic = __webpack_require__(17);
    var layout = __webpack_require__(45);

    // Model
    echarts.extendComponentModel({

        type: 'title',

        layoutMode: {type: 'box', ignoreSize: true},

        defaultOption: {
            // 一级层叠
            zlevel: 0,
            // 二级层叠
            z: 6,
            show: true,

            text: '',
            // 超链接跳转
            // link: null,
            // 仅支持self | blank
            target: 'blank',
            subtext: '',

            // 超链接跳转
            // sublink: null,
            // 仅支持self | blank
            subtarget: 'blank',

            // 'center' ¦ 'left' ¦ 'right'
            // ¦ {number}（x坐标，单位px）
            left: 0,
            // 'top' ¦ 'bottom' ¦ 'center'
            // ¦ {number}（y坐标，单位px）
            top: 0,

            // 水平对齐
            // 'auto' | 'left' | 'right' | 'center'
            // 默认根据 left 的位置判断是左对齐还是右对齐
            // textAlign: null
            //
            // 垂直对齐
            // 'auto' | 'top' | 'bottom' | 'middle'
            // 默认根据 top 位置判断是上对齐还是下对齐
            // textBaseline: null

            backgroundColor: 'rgba(0,0,0,0)',

            // 标题边框颜色
            borderColor: '#ccc',

            // 标题边框线宽，单位px，默认为0（无边框）
            borderWidth: 0,

            // 标题内边距，单位px，默认各方向内边距为5，
            // 接受数组分别设定上右下左边距，同css
            padding: 5,

            // 主副标题纵向间隔，单位px，默认为10，
            itemGap: 10,
            textStyle: {
                fontSize: 18,
                fontWeight: 'bolder',
                color: '#333'
            },
            subtextStyle: {
                color: '#aaa'
            }
        }
    });

    // View
    echarts.extendComponentView({

        type: 'title',

        render: function (titleModel, ecModel, api) {
            this.group.removeAll();

            if (!titleModel.get('show')) {
                return;
            }

            var group = this.group;

            var textStyleModel = titleModel.getModel('textStyle');
            var subtextStyleModel = titleModel.getModel('subtextStyle');

            var textAlign = titleModel.get('textAlign');
            var textBaseline = titleModel.get('textBaseline');

            var textEl = new graphic.Text({
                style: graphic.setTextStyle({}, textStyleModel, {
                    text: titleModel.get('text'),
                    textFill: textStyleModel.getTextColor()
                }, {disableBox: true}),
                z2: 10
            });

            var textRect = textEl.getBoundingRect();

            var subText = titleModel.get('subtext');
            var subTextEl = new graphic.Text({
                style: graphic.setTextStyle({}, subtextStyleModel, {
                    text: subText,
                    textFill: subtextStyleModel.getTextColor(),
                    y: textRect.height + titleModel.get('itemGap'),
                    textVerticalAlign: 'top'
                }, {disableBox: true}),
                z2: 10
            });

            var link = titleModel.get('link');
            var sublink = titleModel.get('sublink');

            textEl.silent = !link;
            subTextEl.silent = !sublink;

            if (link) {
                textEl.on('click', function () {
                    window.open(link, '_' + titleModel.get('target'));
                });
            }
            if (sublink) {
                subTextEl.on('click', function () {
                    window.open(sublink, '_' + titleModel.get('subtarget'));
                });
            }

            group.add(textEl);
            subText && group.add(subTextEl);
            // If no subText, but add subTextEl, there will be an empty line.

            var groupRect = group.getBoundingRect();
            var layoutOption = titleModel.getBoxLayoutParams();
            layoutOption.width = groupRect.width;
            layoutOption.height = groupRect.height;
            var layoutRect = layout.getLayoutRect(
                layoutOption, {
                    width: api.getWidth(),
                    height: api.getHeight()
                }, titleModel.get('padding')
            );
            // Adjust text align based on position
            if (!textAlign) {
                // Align left if title is on the left. center and right is same
                textAlign = titleModel.get('left') || titleModel.get('right');
                if (textAlign === 'middle') {
                    textAlign = 'center';
                }
                // Adjust layout by text align
                if (textAlign === 'right') {
                    layoutRect.x += layoutRect.width;
                }
                else if (textAlign === 'center') {
                    layoutRect.x += layoutRect.width / 2;
                }
            }
            if (!textBaseline) {
                textBaseline = titleModel.get('top') || titleModel.get('bottom');
                if (textBaseline === 'center') {
                    textBaseline = 'middle';
                }
                if (textBaseline === 'bottom') {
                    layoutRect.y += layoutRect.height;
                }
                else if (textBaseline === 'middle') {
                    layoutRect.y += layoutRect.height / 2;
                }

                textBaseline = textBaseline || 'top';
            }

            group.attr('position', [layoutRect.x, layoutRect.y]);
            var alignStyle = {
                textAlign: textAlign,
                textVerticalAlign: textBaseline
            };
            textEl.setStyle(alignStyle);
            subTextEl.setStyle(alignStyle);

            // Render background
            // Get groupRect again because textAlign has been changed
            groupRect = group.getBoundingRect();
            var padding = layoutRect.margin;
            var style = titleModel.getItemStyle(['color', 'opacity']);
            style.fill = titleModel.get('backgroundColor');
            var rect = new graphic.Rect({
                shape: {
                    x: groupRect.x - padding[3],
                    y: groupRect.y - padding[0],
                    width: groupRect.width + padding[1] + padding[3],
                    height: groupRect.height + padding[0] + padding[2],
                    r: titleModel.get('borderRadius')
                },
                style: style,
                silent: true
            });
            graphic.subPixelOptimizeRect(rect);

            group.add(rect);
        }
    });


/***/ }),

/***/ 561:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var spssUtils_1 = __webpack_require__(87);
var utils_1 = __webpack_require__(5);
__webpack_require__(893);
__webpack_require__(1031);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
var echarts = __webpack_require__(10);
// import 'echarts/lib/chart/bar';
__webpack_require__(131);
__webpack_require__(122);
__webpack_require__(119);
__webpack_require__(133);
__webpack_require__(120);
__webpack_require__(945);
var StatisticsLogIndex;
(function (StatisticsLogIndex) {
    var chart;
    var infoChart;
    var datePicker;
    var percentTable;
    var hotTable;
    var classifyId = null;
    var classifyName = null;
    var type = '0'; // 0：消息数: ,1:会话数，2：平均响应时间
    $(function () {
        init();
    });
    function init() {
        var time = moment(Date.now());
        console.log(time.format('YYYY-MM-DD, HH:mm:ss'), time / 1000, time.format('HH:mm:ss, SS'));
        spssUtils_1.initTip([{
                el: $('#main-tip'),
                placement: 'left',
                content: "\n\t\t\t<div class=\"text\"><p><b>\u6D88\u606F\u6570\uFF1A</b>\u95EE\u9898\u548C\u56DE\u590D\u6D88\u606F\u603B\u548C</p><p><b>\u4F1A\u8BDD\u6570\uFF1A</b>\u8BBF\u5BA2\u4ECE\u5F00\u59CB\u54A8\u8BE2\u5230\u7ED3\u675F\u54A8\u8BE2\u4E3A\u4E00\u6B21\u4F1A\u8BDD</p>\n\t\t\t<p><b>\u5E73\u5747\u54CD\u5E94\u65F6\u957F\uFF1A</b>\u4ECE\u5BA2\u670D\u63A5\u6536\u95EE\u9898\u5230\u56DE\u590D\u7B54\u6848\u7684\u5E73\u5747\u8017\u65F6</p>\n\t\t\t<p>\u6CE8\uFF1A\u667A\u80FD\u5BA2\u670D\u4E0E\u4EBA\u5DE5\u5BA2\u670D\u5E73\u5747\u54CD\u5E94\u65F6\u957F\u4E0D\u540C\uFF0C\u667A\u80FD\u5BA2\u670D\u5E73\u5747\u54CD\u5E94\u65F6\u957F\u4E3A\u63A5\u6536\u95EE\u9898\u5230\u56DE\u590D\u95EE\u9898\u7684\u5E73\u5747\u8017\u65F6\uFF0C\u800C\u4EBA\u5DE5\u5BA2\u670D\u5E73\u5747\u54CD\u5E94\u65F6\u957F\u4E3A\u6765\u8BBF\u7528\u6237\u53D1\u8D77\u8F6C\u4EBA\u5DE5\u8BF7\u6C42\u5230\u4EBA\u5DE5\u5BA2\u670D\u63A5\u53D7\u8BF7\u6C42\u7684\u5E73\u5747\u8017\u65F6</p><p><br></p></div>\n\t\t\t"
            }, {
                el: $('#log-tip'),
                content: "\n\t\t\t<div class=\"text\"\"><p><b>\u6D88\u606F\u7C7B\u578B\u7EDF\u8BA1\uFF1A</b>\u663E\u793A\u6240\u9009\u65F6\u95F4\u6BB5\u5185\u8BBF\u5BA2\u63D0\u95EE\u6B21\u6570top10\u7684\u6D88\u606F\u7C7B\u578B\u53CA\u5404\u7C7B\u578B\u7684\u5360\u6BD4\uFF1B</p>\n\t\t\t<p><b>\u5BFC\u51FA\uFF1A</b>\u5BFC\u51FA\u6240\u9009\u65F6\u95F4\u6BB5\u5185\u6240\u6709\u6D88\u606F\u7C7B\u578B\u7684\u7EDF\u8BA1\u7ED3\u679C\u3002</p></div>\n\t\t\t"
            }, {
                el: $('#hot-problem-tip'),
                content: "\n\t\t\t<div class=\"text\" style=\"padding: 14px;\"><p><b>\u70ED\u70B9\u95EE\u9898\uFF1A</b>\u663E\u793A\u6240\u9009\u65F6\u95F4\u6BB5\u5185\u8BBF\u5BA2\u63D0\u95EE\u6B21\u6570top20\u7684\u95EE\u9898\uFF1B</p>\n\t\t\t<p><b>\u5BFC\u51FA\uFF1A</b>\u5BFC\u51FA\u6240\u9009\u65F6\u95F4\u6BB5\u5185\u8BBF\u5BA2\u63D0\u95EE\u6B21\u6570\u5927\u4E8E\u7B49\u4E8E1\u7684\u6240\u6709\u95EE\u9898\u3002</p></div>\n\t\t\t"
            }, {
                el: $('#hot-word-tip'),
                content: "\n\t\t\t<div class=\"text\" style=\"padding: 14px;\"><p><b>\u70ED\u95E8\u8BCD\u6C47\uFF1A\u663E\u793A</b>\u6240\u9009\u65F6\u95F4\u6BB5\u5185\u8BBF\u5BA2\u975E\u804A\u5929\u95EE\u9898\u4E2D\u51FA\u73B0\u9891\u7387\u9AD8\u7684\u8BCD\u6C47\uFF1B</p>\n\t\t\t<p><b>\u5BFC\u51FA\uFF1A</b>\u5BFC\u51FA\u6240\u9009\u65F6\u95F4\u6BB5\u5185\u6240\u6709\u7684\u70ED\u95E8\u8BCD\u6C47</p></div>\n\t\t\t"
            }]);
        initDatePicker();
        initInfo();
        initCharts();
        initPercentTable();
        drawTable();
        drawTagCloud();
        bindEvent();
    }
    function initInfo() {
        drawInfo();
    }
    function drawInfo() {
        $.ajax({
            url: 'spss/msgData/summary',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            var bigEl = $('.spss-info-wrap');
            var smart = bigEl.find('.smart span');
            smart.eq(1).html(data.sumRobotAllMsg);
            smart.eq(2).html(data.sumRobotReceiveMsg);
            smart.eq(3).html(data.sumRobotSendMsg);
            smart.eq(4).html(data.sumRobotSession);
            smart.eq(5).html(utils_1.renderMilliTimeLength(data.avgRobotResponTime));
            var person = bigEl.find('.person span');
            person.eq(1).html(data.sumServicerAllMsg === 0 ? '--' : data.sumServicerAllMsg);
            person.eq(2).html(data.sumServicerReceiveMsg === 0 ? '--' : data.sumServicerReceiveMsg);
            person.eq(3).html(data.sumServicerSendMsg === 0 ? '--' : data.sumServicerSendMsg);
            person.eq(4).html(data.sumServicerSession === 0 ? '--' : data.sumServicerSession);
            person.eq(5).html(data.avgServicerResponTime === 0 ? '--' : utils_1.renderMilliTimeLength(data.avgServicerResponTime));
        });
    }
    function drawTagCloud() {
        $.ajax({
            url: 'spss/msgData/hotWords',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            if (!data.length) {
                data = [{ text: '无热门词汇', weight: 15 }];
            }
            var el = $('#tag-cloud');
            if (el.length) {
                el.remove();
            }
            var newEl = $('<div id="tag-cloud"></div>');
            $('.tag-cloud-wrap').append(newEl);
            newEl.jQCloud(data);
        });
    }
    function initPercentTable() {
        drawPercentTable();
    }
    function drawPercentTable() {
        $.ajax({
            url: 'spss/msgData/categoryStat',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            var newData = data.map(function (v, i) {
                return __assign({}, v, { rank: i + 1 });
            });
            if (!percentTable) {
                var table_1 = $('#percent-table').DataTable({
                    data: newData,
                    scrollY: '300px',
                    serverSide: false,
                    select: 'single',
                    info: false,
                    columns: [
                        { data: 'rank', title: '排名' },
                        { data: 'categoryName', title: '分类' },
                        { data: 'sum', title: '次数' },
                        { data: 'rate', title: '占比', render: utils_1.renderPercent }
                    ]
                });
                table_1.on('select', function (e, dt, _type, indexes) {
                    var rowData = table_1.row(indexes[0]).data();
                    classifyId = rowData.categoryId;
                    classifyName = rowData.categoryName;
                    drawInfoChart();
                });
                percentTable = new tables_1.Table(table_1);
            }
            else {
                percentTable.table.rows().remove();
                percentTable.table.rows.add(newData);
                percentTable.table.draw();
            }
        });
    }
    function drawTable() {
        $.ajax({
            url: 'spss/msgData/hotQuestion',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            if (hotTable) {
                hotTable.table.rows().remove();
                hotTable.table.rows.add(data);
                hotTable.table.draw();
                return;
            }
            var table = $('#hot-table').DataTable({
                data: data,
                scrollY: '300px',
                serverSide: false,
                info: false,
                columns: [
                    { data: 'no', title: '排名' },
                    { data: 'question', title: '问题' },
                    { data: 'classifyName', title: '所属类型' },
                    { data: 'sum', title: '提问次数' }
                ]
            });
            hotTable = new tables_1.Table(table);
        });
    }
    function initDatePicker() {
        var el = $('.spss-time-container .date-range-picker');
        datePicker = new spssUtils_1.SpssBtnDate({
            el: el,
            onClick: function (mode, date) {
                drawInfo();
                drawChart();
                drawPercentTable();
                drawTable();
                drawInfoChart();
                drawTagCloud();
            }
        });
    }
    function initCharts() {
        chart = echarts.init(document.getElementById('chart'));
        infoChart = echarts.init(document.getElementById('info-chart'));
        drawChart();
        drawInfoChart();
    }
    function drawChart() {
        getChartData(function (data) {
            chart.clear();
            chart.setOption(getOp(data));
        });
    }
    function drawInfoChart() {
        getInfoChartData(function (data) {
            infoChart.clear();
            infoChart.setOption(getInfoOp(data));
        });
    }
    function bindEvent() {
        $('#type-select').on('change', function () {
            type = $(this).val();
            drawChart();
        });
        $('#export1').on('click', function () {
            var href = "spss/msgData/exportCategoryStatExcel?" + $.param({
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            });
            window.open(href);
        });
        $('#export2').on('click', function () {
            var href = "spss/msgData/exportHotQuestionExcel?" + $.param({
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            });
            window.open(href);
        });
        $('#export3').on('click', function () {
            var href = "spss/msgData/exportHotWordsExcel?" + $.param({
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            });
            window.open(href);
        });
    }
    function getChartData(cb) {
        $.ajax({
            url: 'spss/msgData/dataFilter',
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
    function getInfoChartData(cb) {
        $.ajax({
            url: 'spss/msgData/categoryStatLine',
            method: 'GET',
            data: {
                categoryId: classifyId,
                categoryName: classifyName,
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            cb(data);
        });
    }
    function getInfoOp(data) {
        var series = data.yData.map(function (v) {
            return {
                name: v.name,
                type: 'line',
                data: v.data
            };
        });
        return {
            series: series,
            title: {
                text: '消息次数',
                textStyle: {
                    fontSize: 13,
                    fontWeight: 'bold'
                },
                top: 19
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [classifyName]
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
                data: data.xData
            },
            yAxis: {
                type: 'value'
            }
        };
    }
    function getOp(data) {
        var xData = data.xData;
        var legend = ['人工客服', '智能客服'];
        var axisLabel = {};
        var formatter = {};
        var series = data.yData.map(function (v) {
            return {
                name: v.name,
                type: 'line',
                data: v.data
            };
        });
        if (type === '2') {
            axisLabel = {
                formatter: function (value, index) {
                    return utils_1.renderMilliTimeLength(value);
                }
            };
            formatter = function (params, ticket, callback) {
                return "\n\t\t\t\t\t" + params[0].axisValue + "<br/>\n\t\t\t\t\t<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:" + params[0].color + "\"></span> " + params[0].seriesName + "\uFF1A" + utils_1.renderMilliTimeLength(params[0].data) + "<br/>\n\t\t\t\t\t<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:" + params[1].color + "\"></span> " + params[0].seriesName + "\uFF1A" + utils_1.renderMilliTimeLength(params[1].data) + "\n\t\t\t\t";
            };
        }
        return {
            color: ['#ffb000', '#37a6e7', '#4caf50'],
            series: series,
            tooltip: {
                formatter: formatter,
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
                axisLabel: axisLabel,
                type: 'value'
            }
        };
    }
})(StatisticsLogIndex || (StatisticsLogIndex = {}));


/***/ }),

/***/ 893:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 945:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1148]);
//# sourceMappingURL=14.js.map