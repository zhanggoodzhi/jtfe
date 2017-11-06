webpackJsonp([27],{

/***/ 1109:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(523);


/***/ }),

/***/ 523:
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
var new_table_1 = __webpack_require__(7);
var utils = __webpack_require__(5);
__webpack_require__(21);
__webpack_require__(906);
var sideBarPug = __webpack_require__(987);
var table;
var date;
var sideBar;
var currentId;
var replyType = '在线';
$(function () {
    init();
});
function init() {
    $('#date').parent('.cloud-input-content').css('width', 300);
    initDate();
    initSideBar();
    initTable();
}
function initDate() {
    var now = new Date();
    date = new utils.CommonDate({
        el: $('#date'),
        options: {
            timePicker: true,
            timePicker24Hour: true,
            showCustomRangeLabel: false,
            locale: {
                format: 'YYYY-MM-DD HH:mm:ss',
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
            startDate: new Date(Date.parse(now) - 10 * 24 * 3600 * 1000),
            endDate: now
        }
    });
}
function initTable() {
    table = new new_table_1.Table({
        el: $('#table'),
        options: {
            ajax: {
                type: 'GET',
                url: 'cs/guestBook/findAllCsGuestBookPage',
                dataSrc: function (data) {
                    var d = data.rows;
                    return d;
                },
                data: function (d) {
                    var data = Object.assign(getFormData(), {
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length
                    });
                    return utils.cleanObject(data);
                }
            },
            serverSide: true,
            paging: true,
            columns: [
                {
                    data: 'id',
                    title: '留言ID'
                },
                {
                    data: 'visitor',
                    title: '访客'
                },
                {
                    data: 'content',
                    title: '留言内容'
                },
                {
                    data: 'expectReplyType',
                    title: '期望回复方式',
                    render: renderReplyType
                },
                {
                    data: 'status',
                    title: '状态',
                    render: renderStatus
                },
                {
                    data: 'messageTime',
                    title: '留言时间',
                    render: utils.renderCommonTime
                },
                {
                    data: 'replyTime',
                    title: '回复时间',
                    render: utils.renderCommonTime
                },
                {
                    data: 'id',
                    title: '操作',
                    render: function (text) {
                        return "<button data-id=\"" + text + "\" type=\"button\" class=\"check btn btn-link\">\u67E5\u770B</button>";
                    }
                }
            ],
            initComplete: initComplete
        }
    });
}
function getFormData() {
    return utils.cleanObject({
        id: $('#word-id').val(),
        visitor: $('#visitor-id').val(),
        status: $('#select').val(),
        messageTimeStart: date.getDate('start'),
        messageTimeEnd: date.getDate('end')
    });
}
function initSideBar() {
    sideBar = new utils.SideBar({
        title: '查看留言',
        content: ''
    });
}
function renderStatus(status) {
    switch (status) {
        case 0: return '未回复';
        case 1: return '已回复';
        default: return '回复状态错误';
    }
}
function renderSex(sex) {
    switch (sex) {
        case 0: return '男';
        case 1: return '女';
        default: return '男';
    }
}
function renderReplyType(type) {
    switch (type) {
        case 0: return '在线回复';
        case 1: return '电话回复';
        default: return '设置已回复';
    }
}
function renderInfo() {
}
function initComplete() {
    var contentEl = sideBar.elements.content;
    $('#table').on('click', '.check', function () {
        var id = $(this).data('id');
        $.ajax({
            url: 'cs/guestBook/findCsGuestBookById',
            method: 'POST',
            data: {
                id: id
            }
        }).done(function (data) {
            currentId = id;
            contentEl.html('').append(sideBarPug(__assign({}, data, { status: renderStatus(data.status), sex: renderSex(data.sex), expectReplyType: renderReplyType(data.expectReplyType), messageTime: utils.renderCommonTime(data.messageTime), replyTime: utils.renderCommonTime(data.replyTime), replyType: renderReplyType(data.replyType) })));
            sideBar.show();
        });
    });
    $('#search-btn').on('click', function () {
        table.reload();
    });
    contentEl.on('click', '#reply', function () {
        utils.confirmModal({
            msg: "\u786E\u8BA4\u8981\u8BBE\u7F6E\u4E3A\u5DF2\u56DE\u590D\u4E48\u5417?",
            className: 'btn-primary',
            text: '确定',
            cb: function (modal, btn) {
                $.ajax({
                    url: 'cs/guestBook/reply',
                    method: 'POST',
                    data: {
                        id: currentId,
                        replyType: '-1'
                    }
                }).done(function (data) {
                    sideBar.hide();
                    modal.modal('hide');
                    table.reload();
                });
            }
        });
    });
    contentEl.on('click', '#online-reply', function () {
        replyType = '在线';
        $(this).css('background', '#e7f4fd');
        $('#tele-reply').css('background', 'white');
        showTextArea();
    });
    contentEl.on('click', '#tele-reply', function () {
        replyType = '电话';
        $(this).css('background', '#e7f4fd');
        $('#online-reply').css('background', 'white');
        showTextArea();
    });
    contentEl.on('click', '#submit', function () {
        $.ajax({
            url: 'cs/guestBook/reply',
            method: 'POST',
            data: {
                id: currentId,
                replyType: replyType === '在线' ? 0 : 1,
                replyContent: $('#textarea').val()
            }
        }).done(function (data) {
            utils.alertMessage('操作成功', true);
            sideBar.hide();
            table.reload();
        });
    });
    contentEl.on('click', '#cancel', function () {
        sideBar.hide();
    });
}
function showTextArea() {
    var contentEl = $('#operation .content');
    contentEl.find('.textarea-wrap').remove();
    contentEl.append("\n\t<div class=\"textarea-wrap\">\n\t<textarea id=\"textarea\" class=\"form-control\" rows=\"3\" placeholder=\"\u8BF7\u8F93\u5165\u56DE\u590D\u5185\u5BB9\"></textarea>\n\t</div>\n\t");
    $('.btn-wrap').show();
}


/***/ }),

/***/ 906:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 987:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(25);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (expectReplyTimeEnd, expectReplyTimeStart, expectReplyType, id, messageTime, name, replyContent, replyTime, replyType, sex, status, visitor) {pug_html = pug_html + "\u003Ctable id=\"info-table\"\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E留言ID:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = id) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E访客:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = visitor) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E留言时间:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = messageTime) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E称呼:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = name) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E性别:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = sex) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E期望回复方式:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = expectReplyType) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E期望回复时段:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = expectReplyTimeStart+'~'+expectReplyTimeEnd) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E留言内容:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E" + (pug.escape(null == (pug_interp = replyContent) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E状态:\u003C\u002Ftd\u003E\u003Ctd class=\"content\" id=\"status\"\u003E" + (pug.escape(null == (pug_interp = status) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E回复时间:\u003C\u002Ftd\u003E\u003Ctd class=\"content\" id=\"reply-time\"\u003E" + (pug.escape(null == (pug_interp = replyTime) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
if (status==='未回复') {
pug_html = pug_html + "\u003Ctr id=\"operation\"\u003E\u003Ctd class=\"title\"\u003E操作:\u003C\u002Ftd\u003E\u003Ctd class=\"content\"\u003E\u003Cbutton class=\"btn btn-link\" id=\"reply\" type=\"button\"\u003E设为已回复\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-link\" id=\"online-reply\" type=\"button\"\u003E在线回复\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-link\" id=\"tele-reply\" type=\"button\"\u003E电话回复\u003C\u002Fbutton\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
}
else {
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"title\"\u003E回复方式:\u003C\u002Ftd\u003E\u003Ctd class=\"content\" id=\"reply-time\"\u003E" + (pug.escape(null == (pug_interp = replyType) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003Ctr\u003E\u003Ctd class=\"title\"\u003E回复内容:\u003C\u002Ftd\u003E\u003Ctd class=\"content\" id=\"reply-time\"\u003E" + (pug.escape(null == (pug_interp = replyContent) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
}
pug_html = pug_html + "\u003C\u002Ftable\u003E\u003Cdiv class=\"btn-wrap\"\u003E\u003Cbutton class=\"btn btn-primary\" id=\"submit\" type=\"button\"\u003E发送\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn\" id=\"cancel\" type=\"button\"\u003E取消\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";}.call(this,"expectReplyTimeEnd" in locals_for_with?locals_for_with.expectReplyTimeEnd:typeof expectReplyTimeEnd!=="undefined"?expectReplyTimeEnd:undefined,"expectReplyTimeStart" in locals_for_with?locals_for_with.expectReplyTimeStart:typeof expectReplyTimeStart!=="undefined"?expectReplyTimeStart:undefined,"expectReplyType" in locals_for_with?locals_for_with.expectReplyType:typeof expectReplyType!=="undefined"?expectReplyType:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"messageTime" in locals_for_with?locals_for_with.messageTime:typeof messageTime!=="undefined"?messageTime:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"replyContent" in locals_for_with?locals_for_with.replyContent:typeof replyContent!=="undefined"?replyContent:undefined,"replyTime" in locals_for_with?locals_for_with.replyTime:typeof replyTime!=="undefined"?replyTime:undefined,"replyType" in locals_for_with?locals_for_with.replyType:typeof replyType!=="undefined"?replyType:undefined,"sex" in locals_for_with?locals_for_with.sex:typeof sex!=="undefined"?sex:undefined,"status" in locals_for_with?locals_for_with.status:typeof status!=="undefined"?status:undefined,"visitor" in locals_for_with?locals_for_with.visitor:typeof visitor!=="undefined"?visitor:undefined));;return pug_html;};
module.exports = template;

/***/ })

},[1109]);
//# sourceMappingURL=27.js.map