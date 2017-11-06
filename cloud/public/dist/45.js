webpackJsonp([45],{

/***/ 1152:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(564);


/***/ }),

/***/ 564:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var spssUtils_1 = __webpack_require__(87);
__webpack_require__(21);
var new_table_1 = __webpack_require__(7);
__webpack_require__(949);
var StatisticsTalkIndex;
(function (StatisticsTalkIndex) {
    var table, qTable;
    var unMatchSideBar;
    var baseuri;
    var currentId;
    var recordSideBar;
    var rowData;
    var defaultStartDate;
    var defaultEndDate;
    $(document).ready(function () {
        initSearchData();
        initDate();
        initSideBar();
        initIndexTables();
    });
    function initSearchData() {
        var hrefArr = window.location.href.split('?');
        if (hrefArr.length > 1) {
            var paramArr = hrefArr[1].split('&');
            var userName = paramArr[0].split('=')[1];
            var startTime = paramArr[1].split('=')[1];
            var endTime = paramArr[2].split('=')[1];
            $('#user').val(decodeURI(userName));
            defaultStartDate = new Date(Number(decodeURI(startTime)));
            defaultEndDate = new Date(Number(decodeURI(endTime)));
        }
    }
    function initSideBar() {
        unMatchSideBar = new utils_1.SideBar({
            id: 'unMatch-sideBar',
            title: '查看详情',
            content: "\n            <form id=\"pre-detail-form\" class=\"disabled-form\">\n                <div class=\"cloud-row clearfix\">\n                    <div class=\"col-md-6\">\n                        <div class=\"form-group clearfix\">\n                            <label class=\"control-label col-md-5 col-sm-5 col-lg-5\">\u7528\u6237</label>\n                            <div class=\"col-md-7 col-sm-7 col-lg-7\">\n                                <p class=\"question\">\u95EE\u9898</p>\n                            </div>\n                        </div>\n                    </div>\n                     <div class=\"col-md-6\">\n                        <div class=\"form-group clearfix\">\n                            <label class=\"control-label col-md-5 col-sm-5 col-lg-5\">\u8BBF\u95EE\u65F6\u957F</label>\n                            <div class=\"col-md-7 col-sm-7 col-lg-7\">\n                                <p class=\"time\">\u95EE\u9898\u95EE\u9898\u95EE\u9898\u95EE\u9898\u95EE\u9898</p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"cloud-row clearfix\">\n                    <div class=\"col-md-6\">\n                        <div class=\"form-group clearfix\">\n                            <label class=\"control-label col-md-5 col-sm-5 col-lg-5\">\u672A\u5339\u914D\u95EE\u9898/\u6240\u6709\u95EE\u9898</label>\n                            <div class=\"col-md-7 col-sm-7 col-lg-7\">\n                                <p class=\"all-question\">\u95EE\u9898</p>\n                            </div>\n                        </div>\n                    </div>\n                     <div class=\"col-md-6\">\n                        <div class=\"form-group clearfix\">\n                            <label class=\"control-label col-md-5 col-sm-5 col-lg-5\">\u672A\u5339\u914D\u95EE\u9898\u6BD4\u7387</label>\n                            <div class=\"col-md-7 col-sm-7 col-lg-7\">\n                                <p class=\"question-percent\">\u95EE\u9898\u95EE\u9898\u95EE\u9898\u95EE\u9898\u95EE\u9898</p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </form>\n            <div class=\"table-wrap\">\n                <table id=\"question-table\" class=\"table\"></table>\n            </div>\n        "
        });
        recordSideBar = new utils_1.SideBar({
            id: 'chart-sideBar',
            title: '聊天记录',
            content: "\n\t\t\t<div class=\"record-wrap\"></div>\n        "
        });
    }
    function drawQTable() {
        if (qTable) {
            qTable.reload(true);
            return;
        }
        qTable = new new_table_1.Table({
            el: $('#question-table'),
            options: {
                paging: true,
                serverSide: true,
                ajax: {
                    type: 'POST',
                    url: 'spss/sessionLog/notMatchQuestion',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var time = $('#form-date').val().split(' - '), data = {
                            customsession: currentId
                        };
                        return utils_1.cleanObject(data);
                    }
                },
                initComplete: bindQEvent,
                columns: [
                    { data: 'msgtext', title: '问题' },
                    {
                        data: 'msgtext', title: '操作', render: function (msgtext) {
                            return "<div class=\"cloud-image-icon\"><img data-name=\"" + msgtext + "\" src=\"images/addFile.png\" class=\"add-file\" title=\"\u6DFB\u52A0\u4E3A\u65B0\u8BED\u6599\"/></div>";
                        }
                    }
                ]
            }
        });
    }
    function bindQEvent() {
        $('#question-table').on('click', '.add-file', function () {
            location.assign(ctx + "/knowledge/editByA/update?question=" + encodeURI($(this).data().name));
        });
    }
    function initIndexTables() {
        table = new new_table_1.Table({
            el: $('#key-table'),
            options: {
                serverSide: true,
                paging: true,
                ordering: true,
                order: [3, 'desc'],
                ajax: {
                    type: 'POST',
                    url: 'spss/sessionLog/pageSessionLogByParam',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var startTimeOrder;
                        for (var _i = 0, _a = d.order; _i < _a.length; _i++) {
                            var v = _a[_i];
                            if (v.column === 3) {
                                startTimeOrder = v.dir;
                            }
                        }
                        var time = $('#form-date').val().split(' - '), data = {
                            startTimeOrder: startTimeOrder,
                            page: Math.floor((d.start + d.length) / d.length),
                            rows: d.length,
                            startTime: time[0],
                            endTime: time[1],
                            userName: $.trim($('#user').val()),
                            source: $.trim($('#source').val()),
                            degree: $.trim($('#satisfy').val())
                            // reason: $.trim($('#reason').val())
                        };
                        return utils_1.cleanObject(data);
                    }
                },
                initComplete: bindEvent,
                columns: [
                    { data: 'userName', title: '用户', createdCell: new_table_1.createAddTitle, orderable: false },
                    { data: 'source', title: '来源', orderable: false },
                    {
                        data: 'sessionTime', title: '会话时长<i class="table-tip fa fa-question-circle" id="time-tip"></i>', orderable: false, render: function (s) {
                            return utils_1.renderTimeLength(s);
                        }
                    },
                    { data: 'startTime', title: '开始时间', width: '128', render: utils_1.renderCommonTime },
                    { data: 'endTime', title: '结束时间', width: '128', orderable: false, render: utils_1.renderCommonTime },
                    { data: 'degree', title: '满意度', orderable: false, render: renderSatisfaction },
                    { data: 'shortComment', title: '评价', orderable: false },
                    { data: 'hasNoAnswer', title: '未匹配问题<i class="table-tip fa fa-question-circle" id="hasno-tip"></i>', orderable: false, render: renderNumber },
                    {
                        data: 'customSession', title: '操作', orderable: false, render: renderIcons
                    }
                ]
            }
        });
    }
    function renderSatisfaction(num) {
        if (num === null || num === undefined) {
            return '无';
        }
        if (num === 100) {
            return '非常满意';
        }
        else if (num === 75) {
            return '满意';
        }
        else if (num === 50) {
            return '一般';
        }
        else if (num === 25) {
            return '不满意';
        }
        else if (num === 0) {
            return '非常不满意';
        }
    }
    function renderNumber(text, type, row) {
        return "<span data-id=\"" + row.sessionId + "\" class=\"red-number\">" + text + "</span>";
    }
    function renderIcons(id) {
        return "<div class=\"cloud-image-icon view-record\"><img data-id=\"" + id + "\" src=\"images/chart1.png\" title=\"\u67E5\u770B\u804A\u5929\u8BB0\u5F55\"/></div>";
    }
    function initDate() {
        var latestDate = new Date();
        var threeMonthBefore = new Date(latestDate - 30 * 3 * 24 * 60 * 60 * 1000);
        new utils_1.CommonDate({
            el: $('#form-date'),
            options: {
                timePicker: true,
                timePicker24Hour: true,
                showCustomRangeLabel: false,
                locale: {
                    format: 'YYYY-MM-DD HH:mm',
                    'separator': ' - ',
                    'applyLabel': '确定',
                    'cancelLabel': '取消',
                    'fromLabel': '从',
                    'toLabel': '到',
                    'weekLabel': 'W',
                    'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
                    'monthNames': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    'firstDay': 1
                },
                ranges: null,
                startDate: defaultStartDate ? defaultStartDate : threeMonthBefore,
                endDate: defaultEndDate ? defaultEndDate : latestDate
            }
        });
    }
    function renderRecord(id) {
        $.ajax({
            url: 'spss/sessionLog/getMsglog',
            method: 'GET',
            data: {
                sessionId: id
            }
        }).done(function (data) {
            var lastTime = 0;
            var wrapEl = $('#chart-sideBar .record-wrap');
            wrapEl.empty();
            for (var _i = 0, _a = data.msg; _i < _a.length; _i++) {
                var v = _a[_i];
                if (v.msgtime - lastTime > 20000) {
                    var time = utils_1.renderCommonTime(v.msgtime);
                    wrapEl.append("<div class=\"time-wrap\"><span>" + time + "</span></div>");
                    lastTime = v.msgtime;
                }
                if (v.sendername === '访客') {
                    wrapEl.append("\n<div class=\"chart-right-item clearfix\"><img src=\"" + data.data.vistorpic.substring(1) + "\" class=\"headIcon\"/>\n  <div class=\"content\">\n    <div class=\"name-wrap\"><span class=\"name\">" + rowData.userName + "</span></div>\n    <div class=\"text-wrap\">\n      <div class=\"text\">" + parserMsg(v.msgtext) + "</div>\n    </div>\n  </div>\n</div>\n\t\t\t\t\t");
                }
                else {
                    var pic = '';
                    var name_1 = '';
                    if (v.sendername === '机器人') {
                        pic = data.data.robotpic.substring(1);
                        name_1 = '智能客服';
                    }
                    else {
                        pic = data.data.servicerpic.substring(1);
                        name_1 = v.sendername;
                    }
                    wrapEl.append("<div class=\"chart-left-item clearfix\"><img src=\"" + pic + "\" class=\"headIcon\"/>\n  <div class=\"content\">\n    <div class=\"name-wrap\"><span class=\"name\">" + name_1 + "</span></div>\n    <div class=\"text-wrap\">\n      <div class=\"text\">" + parserMsg(v.msgtext) + "</div>\n    </div>\n  </div>\n</div>");
                }
            }
        });
    }
    function bindEvent() {
        spssUtils_1.initTip([{
                el: $('#time-tip'),
                content: "\n\t\t\t\u4ECE\u4F1A\u8BDD\u5F00\u59CB\u5230\u4F1A\u8BDD\u7ED3\u675F\u7684\u65F6\u957F\n\t\t\t"
            }, {
                el: $('#hasno-tip'),
                content: "\n\t\t\t\u4F1A\u8BDD\u4E2D\u667A\u80FD\u5BA2\u670D\u672A\u5339\u914D\u5230\u7B54\u6848\u7684\u95EE\u9898\n\t\t\t"
            }]);
        var tableEl = $('#key-table');
        $('#search-btn').on('click', function () {
            table.reload(true);
        });
        $('#export').on('click', function () {
            var href = "spss/sessionLog/exportSessionLogExcel?" + $.param(table.dt.ajax.params());
            window.open(href);
        });
        tableEl.on('click', '.red-number', function () {
            var modalEl = $('#unMatch-sideBar');
            var currentData = table.dt.row($(this).closest('td')).data();
            modalEl.find('.question').text(currentData.userName);
            modalEl.find('.time').text(utils_1.renderTimeLength(currentData.sessionTime));
            modalEl.find('.all-question').text(currentData.hasNoAnswer + "/" + (currentData.hasNoAnswer + currentData.hasAnswer));
            var percent = 0;
            if (currentData.hasNoAnswer + currentData.hasAnswer !== 0) {
                percent = (currentData.hasNoAnswer * 100 / (currentData.hasNoAnswer + currentData.hasAnswer)).toFixed(2);
            }
            modalEl.find('.question-percent').text(percent + "%");
            currentId = currentData.customSession;
            drawQTable();
            unMatchSideBar.show();
        });
        tableEl.on('click', '.view-record', function () {
            var el = $(this).find('img');
            rowData = table.dt.row(el.closest('tr')).data();
            recordSideBar.show();
            renderRecord(el.data().id);
        });
    }
    function parserMsg(msg) {
        try {
            var multimedia = JSON.parse(msg);
            if (multimedia.fileType === 'IMAGE') {
                var imgSize = void 0;
                if (multimedia.width > 600) {
                    imgSize = ' width=\"600px\" height=\"' + multimedia.height
                        / (multimedia.width / 600) + 'px\"';
                }
                else {
                    imgSize = ' width=\"' + multimedia.width + 'px\" height=\"'
                        + multimedia.height + 'px\"';
                }
                msg = '<a id=' + multimedia.prefix
                    + ' class="preview"  href="'
                    + multimedia.fileDir + '" target="_blank">' + '<img  class="lazy" src='
                    + multimedia.fileDir + imgSize + ' /></a>';
            }
            else if (multimedia.fileType === 'DOCUMENT') {
                msg = '<div class="doc">'
                    + '<div class="imgstyle"><img src="../public/imgs/pdf.png/" width="50px" hight="50px"></div>'
                    + '<div class="textstyle">' + '<div class="docName">'
                    + multimedia.prefix + '</div>' + '<div class="docDown">'
                    + '<span class="size">文件大小 : ' + multimedia.size
                    + '</span>'
                    + '<span class="down"><a href="' + baseuri + multimedia.fileDir + ';" download="' + multimedia.prefix + '" '
                    + '>下载文件</a></span>' + '</div>' + '</div>' + '</div>';
            }
            else if (multimedia.fileType === 'FEEDBACK') {
                var degree = multimedia.degree;
                var evaluateHtml = '<div class="doc">'
                    + '	<table class="table table-striped">'
                    + '		<thead>'
                    + '			<tr>'
                    + '				<th colspan=2 style="text-align:center;min-width:200px;max-width:400px">用户评价信息</th>'
                    + '			</tr>'
                    + '		</thead>'
                    + '		<tbody>'
                    + '			<tr>'
                    + '				<td style="width:80px;">用户ID</td>'
                    + '				<td style="min-width:200px;max-width:400px">' + rowData.userName + '</td>'
                    + '			</tr>'
                    + '			<tr>'
                    + '				<td>满意度</td>';
                if (degree === '100' || degree === '75') {
                    if (degree === '100') {
                        evaluateHtml += '			<td>非常满意</td>';
                    }
                    else {
                        evaluateHtml += '			<td>满意</td>';
                    }
                    evaluateHtml += '			</tr>';
                }
                else {
                    if (degree === '50') {
                        evaluateHtml += '			<td>一般</td>';
                    }
                    else if (degree === '25') {
                        evaluateHtml += '			<td>不满意</td>';
                    }
                    else {
                        evaluateHtml += '			<td>非常不满意</td>';
                    }
                    if (degree === '50') {
                        evaluateHtml += '			</tr>'
                            + '			<tr>'
                            + '				<td>问题是否解决</td>';
                        evaluateHtml += '			<td>' + multimedia.shortComment + '</td>';
                    }
                    else {
                        evaluateHtml += '			</tr>'
                            + '			<tr>'
                            + '				<td>不足原因</td>';
                        evaluateHtml += '			<td>' + multimedia.shortComment + '</td>';
                    }
                    evaluateHtml += '			</tr>';
                }
                evaluateHtml += '				<tr>'
                    + '					<td>具体评价</td>';
                if (multimedia.comment === null || multimedia.comment === '') {
                    evaluateHtml += '				<td>未填写</td>';
                }
                else {
                    evaluateHtml += '				<td>' + multimedia.comment + '</td>';
                }
                evaluateHtml = evaluateHtml + '	</tr>'
                    + '</tbody></table>';
                msg = evaluateHtml;
            }
            return msg;
        }
        catch (err) {
            return msg;
        }
    }
})(StatisticsTalkIndex || (StatisticsTalkIndex = {}));


/***/ }),

/***/ 949:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1152]);
//# sourceMappingURL=45.js.map