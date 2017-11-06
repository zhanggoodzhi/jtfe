webpackJsonp([43],{

/***/ 1158:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(570);


/***/ }),

/***/ 570:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(7);
__webpack_require__(952);
var SuperadminAppDeleteCodeVerify;
(function (SuperadminAppDeleteCodeVerify) {
    $(bindDeleteEvents);
    function bindDeleteEvents() {
        $('#confirm-delete').on('click', function () {
            deleteAjax(true);
        });
        $('#cancel-delete').on('click', function () {
            deleteAjax(false);
        });
    }
    function deleteAjax(verify) {
        $.ajax({
            url: 'superadmin/app/deleteVerify',
            data: {
                code: $('#code').val(),
                verify: verify
            },
            type: 'POST',
            success: function (data) {
                utils.alertMessage(data.msg, !data.error);
            }
        });
    }
})(SuperadminAppDeleteCodeVerify || (SuperadminAppDeleteCodeVerify = {}));


/***/ }),

/***/ 952:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1158]);
//# sourceMappingURL=43.js.map