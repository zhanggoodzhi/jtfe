webpackJsonp([34],{

/***/ 1173:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(585);


/***/ }),

/***/ 585:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(7);
__webpack_require__(47);
__webpack_require__(21);
__webpack_require__(965);
var tables = __webpack_require__(13);
var utils = __webpack_require__(5);
var Weixinv2NewIndex;
(function (Weixinv2NewIndex) {
    var table, date;
    $(function () {
        initSelectA();
        initTable();
    });
    /**
     * 初始化表格
     */
    function initTable() {
        date = new utils.CommonDate({
            el: $('#form-date')
        });
        table = $('#table').DataTable(Object.assign(tables.commonConfig(), {
            // select: true,
            ajax: {
                url: 'weixinv2/broadcast/newlist',
                type: 'GET',
                data: function (data) {
                    var d = {
                        startDay: date.getDate('start'),
                        endDay: date.getDate('end'),
                        title: $('#title').val(),
                        wxName: $('#weixin-account option:selected').val(),
                        page: tables.getPage(data),
                        rows: data.length
                    };
                    return utils.cleanObject(d);
                },
                dataSrc: function (data) { return data.rows; }
            },
            initComplete: initComplete,
            columns: [
                { data: 'title', title: '标题', render: initTitle },
                { data: 'wechatName', title: '公众号' },
                { data: 'tsp', title: '发送时间', createdCell: tables.createAddTitle, render: utils.renderCommonTime, width: tables.VARIABLES.width.commonTime },
                { data: 'sataDate', title: '更新时间', render: utils.renderCommonTime, width: tables.VARIABLES.width.commonTime },
                { data: 'targetUser', title: '送达人数', width: 70 },
                { data: 'pageReadCount', title: '阅读数', width: 70 },
                { data: 'oripageReadCount', title: '查看原文数', width: 70 },
                { data: 'shareCount', title: '分享数', width: 70 },
                { data: 'favCount', title: '收藏数', width: 70 },
                { data: 'countNewUser', title: '新增用户', width: 70 },
                { data: 'countCancelUser', title: '取关数', width: 70 }
            ]
        }));
    }
    function initTitle(text) {
        var msg = '';
        if (text.length) {
            text.forEach(function (value) {
                msg += '<p class="weixin-title force-width" title="' + value + '">' + value + '</p>';
            });
        }
        return '<div>' + msg + '</div>';
    }
    function initComplete() {
        var t = new tables.Table(table);
        utils.bindEnter($('#title'), function () { t.refresh(true); });
        tables.bindPageChange(table, $('#page-change'));
        $('#search-btn').on('click', function () {
            t.refresh(true);
        });
        // 更新统计数
        $('#updateStat-btn').on('click', function () {
            var _this = this;
            tables.checkLength({
                table: table,
                action: '更新',
                name: '统计数',
                unique: false,
                cb: function (data) {
                    var endLoading = utils.loadingBtn($(_this));
                    // 获取选中行id，传给后端
                    var ids = [];
                    data.forEach(function (v) {
                        ids.push(v.id);
                    });
                    $.ajax({
                        url: 'weixinv2/broadcast/updateStat',
                        data: { ids: ids.join(',') },
                        type: 'GET',
                        success: function (datas) {
                            if (!datas.error) {
                                t.refresh(true);
                                utils.alertMessage('更新统计数成功！', true);
                            }
                            else {
                                utils.alertMessage(datas.msg);
                            }
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                }
            });
        });
        // 合计
        var root = $('#count-modal');
        $('#count-btn').on('click', function () {
            tables.checkLength({
                table: table,
                action: '合计',
                name: '选中的记录',
                unique: false,
                cb: function (data) {
                    var targetUsers = 0, pageReadCounts = 0, oripageReadCounts = 0, shareCounts = 0, favCounts = 0, countNewUsers = 0, countCancelUsers = 0;
                    data.forEach(function (v) {
                        targetUsers = targetUsers + v.targetUser;
                        pageReadCounts = pageReadCounts + v.pageReadCount;
                        oripageReadCounts = oripageReadCounts + v.oripageReadCount;
                        shareCounts = shareCounts + v.shareCount;
                        favCounts = favCounts + v.favCount;
                        countNewUsers = countNewUsers + v.countNewUser;
                        countCancelUsers = countCancelUsers + v.countCancelUser;
                    });
                    $('.targetUsers').text(targetUsers);
                    $('.pageReadCounts').text(pageReadCounts);
                    $('.oripageReadCounts').text(oripageReadCounts);
                    $('.shareCounts').text(shareCounts);
                    $('.favCounts').text(favCounts);
                    $('.countNewUsers').text(countNewUsers);
                    $('.countCancelUsers').text(countCancelUsers);
                    root.modal('show').find('h4.modal-title').text("\u9009\u4E2D\u7684" + data.length + "\u6761\u8BB0\u5F55\u7684\u5408\u8BA1\u6570");
                    root.modal('show');
                }
            });
        });
        // 导出
        date = new utils.CommonDate({
            el: $('#form-date')
        });
        $('#export-btn').on('click', function () {
            utils.alertMessage('正在生成文件！', 'success');
            var data = utils.cleanObject({
                title: $.trim($('#title').val()),
                wxName: $('#weixin-account option:selected').val(),
                startDay: date.getDate('start'),
                endDay: date.getDate('end')
            });
            var str = '';
            for (var i in data) {
                str += '&' + i + '=' + encodeURI(data[i]);
            }
            if (str !== '') {
                str = '?' + str.slice(1);
            }
            location.href = ctx + "/weixinv2/broadcast/exportExcel" + str;
        });
    }
    function initSelectA() {
        var $wa = $('#weixin-account');
        $wa.select2({
            data: wechatCredentials,
            placeholder: '输入关键字查询公众号',
            allowClear: true
        });
        $wa.val('').trigger('change');
    }
})(Weixinv2NewIndex || (Weixinv2NewIndex = {}));


/***/ }),

/***/ 965:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1173]);
//# sourceMappingURL=34.js.map