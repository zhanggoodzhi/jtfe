webpackJsonp([72],{

/***/ 1124:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(538);


/***/ }),

/***/ 538:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var table = __webpack_require__(7);
var t = new table.Table({
    el: $('#table'),
    options: {
        ajax: {
            url: 'knowledge/export/list',
            dataSrc: function (res) { return res.rows; }
        },
        select: false,
        columns: [
            { title: '文件名', data: 'documentName', width: '240px' },
            { title: '文件容量', data: 'documentSize', width: '82px' },
            { title: '任务来源', data: 'documentSource', width: '120px' },
            { title: '导出条件', data: 'remark', createdCell: table.createAddTitle },
            { title: '状态', data: 'status', render: renderStatus, width: '170px' }
        ]
    }
});
function renderStatus(complete, type, row) {
    return complete ? "<div>\u4EFB\u52A1\u5DF2\u5B8C\u6210 <a href=\"knowledge/export/get?id=" + row.id + "\">\u70B9\u6B64\u4E0B\u8F7D\u6587\u4EF6</a></div>" : '正在进行中...';
}


/***/ })

},[1124]);
//# sourceMappingURL=72.js.map