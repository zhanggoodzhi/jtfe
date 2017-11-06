webpackJsonp([38],{

/***/ 1165:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(577);


/***/ }),

/***/ 577:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(958);
var utils = __webpack_require__(5);
var newTables = __webpack_require__(7);
var tables = __webpack_require__(13);
__webpack_require__(21);
var utils_1 = __webpack_require__(5);
var SuperadminTrainRecordIndex;
(function (SuperadminTrainRecordIndex) {
    (function () {
        initTable();
    })();
    var recordTable;
    var sideBar;
    function initTable() {
        var date = new utils.CommonDate({ el: $('#date') });
        recordTable = new newTables.Table({
            el: $('#train-table'),
            options: {
                serverSide: true,
                paging: true,
                ajax: {
                    url: 'superadmin/trainRecord/list',
                    type: 'POST',
                    dataType: 'json',
                    dataSrc: function (data) {
                        return data.rows;
                    },
                    data: function (data) {
                        return utils_1.cleanObject({
                            page: tables.getPage(data),
                            rows: parseInt($('#page-change').val().trim()),
                            appid: $.trim($('#appid').val()),
                            adminUser: $.trim($('#admin-user').val()),
                            result: $.trim($('#train-result').val()),
                            startTime: date.getDate('start'),
                            endTime: date.getDate('end')
                        });
                    }
                },
                initComplete: initcomplete,
                columns: [
                    { data: 'checked', title: '', render: function (text) { if (text === 1) {
                            return '<div class="red-point"></div>';
                        }
                        else {
                            return '';
                        } }, width: '5px' },
                    { data: 'appName', title: '应用' },
                    { data: 'adminUserName', title: '用户名' },
                    { data: 'statusValue', title: '训练结果' },
                    { data: 'msg', title: '备注' },
                    { data: 'createTime', title: '开始训练时间', width: tables.VARIABLES.width.commonTime },
                    { data: 'updateTime', title: '结束训练时间', width: tables.VARIABLES.width.commonTime },
                    { data: 'id', title: '操作', className: 'prevent', render: function (text) { return "<a href='javascript:;' data-id='" + text + "' class='detail-btn'>\u67E5\u770B\u8BE6\u60C5</a>"; } }
                ]
            }
        });
    }
    function initcomplete() {
        bindeSearch();
        bindDetail();
        var t = $('#train-table').DataTable();
        utils.bindEnter($('.cloud-search-area input#admin-user'), function () {
            recordTable.reload();
        });
        tables.bindPageChange(t);
    }
    // 查询功能
    function bindeSearch() {
        $('#search-btn').on('click', function () {
            recordTable.reload();
        });
    }
    // 查看详情
    function bindDetail() {
        $('#train-table').on('click', '.detail-btn', function (e) {
            var id = $(e.target).data('id');
            $.ajax({
                url: 'superadmin/trainRecord/detail',
                data: { id: id },
                success: function (res) {
                    if (res.code === '200') {
                        initSider(res.msg);
                        sideBar.show();
                        $(e.target).parent('td').parent('tr').find('.red-point').removeClass('red-point');
                        if (!res.msg.remains) {
                            $('.cloud-menu-sign:parent(a[href="superadmin/trainRecord/index"])').removeClass('cloud-menu-sign');
                        }
                    }
                    else {
                        utils.alertMessage('详情获取失败！', false);
                    }
                }
            });
        });
    }
    function initSider(detailData) {
        sideBar = new utils.SideBar({
            id: 'record-detail',
            title: '训练详情',
            content: "\n\t\t\t\t<div>\n\t\t\t\t\t<p>\u5E94\u7528\uFF1A" + detailData.appName + "</p>\n\t\t\t\t\t<p>\u7528\u6237\u540D\uFF1A" + detailData.adminUserName + "</p>\n\t\t\t\t\t<p>\u5F00\u59CB\u8BAD\u7EC3\u65F6\u95F4\uFF1A" + detailData.createTime + "</p>\n\t\t\t\t\t<p>\u7ED3\u675F\u8BAD\u7EC3\u65F6\u95F4\uFF1A" + detailData.updateTime + "</p>\n\t\t\t\t\t<p>\u8BAD\u7EC3\u7ED3\u679C\uFF1A" + detailData.statusValue + "</p>\n\t\t\t\t\t<p>\u7ED3\u679C\u8BE6\u60C5</p>\n\t\t\t\t\t<hr style='margin-top:10px;margin-bottom:10px;'/>\n\t\t\t\t\t<p>" + detailData.msg + "</p>\n\t\t\t\t</div>\n\t\t\t"
        });
    }
})(SuperadminTrainRecordIndex || (SuperadminTrainRecordIndex = {}));


/***/ }),

/***/ 958:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1165]);
//# sourceMappingURL=38.js.map