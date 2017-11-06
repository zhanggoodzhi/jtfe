webpackJsonp([70],{

/***/ 1156:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(568);


/***/ }),

/***/ 568:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(7);
__webpack_require__(21);
var tables = __webpack_require__(13);
var SuperadminAdminLoginInfoIndex;
(function (SuperadminAdminLoginInfoIndex) {
    $(initTable);
    function initTable() {
        var date = new utils.CommonDate({ el: $('#date') }), width = tables.VARIABLES.width;
        $('#table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'superadmin/adminLoginInfo/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        adminName: $('#user-name').val(),
                        adminLoginIp: $('#ip-address').val(),
                        loginResult: $('#login-result').val(),
                        adminIpLocation: $('#location-address').val(),
                        appid: $('#appid').val(),
                        beginTime: date.getDate('start'),
                        endTime: date.getDate('end'),
                        page: tables.getPage(data),
                        rows: data.length
                    });
                }
            },
            columns: [
                { data: 'appName', title: '应用' },
                { data: 'adminUserName', title: '用户名' },
                { data: 'adminIpLocation', title: '访问地点' },
                { data: 'loginResult', title: '登陆结果' },
                { data: 'adminLoginIp', title: 'IP地址' },
                { data: 'adminLoginTime', title: '登录时间', width: width.commonTime, render: utils.renderCommonTime }
            ],
            initComplete: initComplete
        }));
    }
    function initComplete() {
        var table = $('#table').DataTable();
        // 查询功能
        $('#search-btn').on('click', function () {
            table.draw();
        });
        tables.bindEnter(table, $('.cloud-search-area input'));
        tables.bindPageChange(table); // 绑定修改分页
    }
})(SuperadminAdminLoginInfoIndex || (SuperadminAdminLoginInfoIndex = {}));


/***/ })

},[1156]);
//# sourceMappingURL=70.js.map