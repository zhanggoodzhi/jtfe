webpackJsonp([35],{

/***/ 1171:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(583);


/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(963);
var Weixinv2BroadcastAuditorCheckerIndex;
(function (Weixinv2BroadcastAuditorCheckerIndex) {
    $(function () {
        reject();
        approve();
    });
    function reject() {
        $('#reject-btn').on('click', function () {
            $('#mainbody').html('请稍等');
            $.ajax({
                url: 'weixinv2/broadcast/auditReject',
                type: 'POST',
                data: {
                    'processid': processid
                },
                success: function (data) {
                    if (data.code === '200') {
                        $('#mainbody').html('您已拒绝本次消息群发请求');
                    }
                    else {
                        $('#mainbody').html('操作失败,原因:' + data.msg);
                    }
                }
            });
        });
    }
    function approve() {
        $('#approve-btn').on('click', function () {
            $('#mainbody').html('请稍等');
            $.ajax({
                url: 'weixinv2/broadcast/auditApprove',
                type: 'POST',
                data: {
                    'processid': processid
                },
                success: function (data) {
                    $('#mainbody').html('');
                    if (data.code === '200') {
                        $('#mainbody').html('您已同意本次消息群发请求');
                    }
                    else {
                        $('#mainbody').html('操作失败,原因:' + data.msg);
                    }
                }
            });
        });
    }
})(Weixinv2BroadcastAuditorCheckerIndex || (Weixinv2BroadcastAuditorCheckerIndex = {}));


/***/ }),

/***/ 963:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1171]);
//# sourceMappingURL=35.js.map