webpackJsonp([40],{

/***/ 1163:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(575);


/***/ }),

/***/ 575:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(956);
// import * as debounce from 'lodash/debounce.js';
var SuperadminFieldQa_settingIndex;
(function (SuperadminFieldQa_settingIndex) {
    $(init);
    function init() {
        if (!$.isEmptyObject(switchItems)) {
            for (var key in switchItems) {
                $("[name='" + key + "'][value='" + switchItems[key] + "']")
                    .prop('checked', true);
            }
        }
        if (!$.isEmptyObject(thresholdItems)) {
            for (var key in thresholdItems) {
                $("[name='" + key + "']")
                    .val(thresholdItems[key]);
            }
        }
        $(document).on('change', 'input', utils.debounce(function (e) {
            var input = $(e.currentTarget), val = input.val().trim();
            if (val !== '') {
                var name_1 = input.prop('name'), text_1 = input.closest('.form-group').data('name'), group = input.data('group');
                $.ajax("superadmin/qa_setting/" + group, {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify([{
                            key: name_1,
                            value: val
                        }])
                })
                    .done(function (res) {
                    if (!res.error) {
                        utils.alertMessage("\u4FDD\u5B58\u300C" + text_1 + "\u300D\u6210\u529F", true);
                    }
                    else {
                        utils.alertMessage(res.msg, !res.error);
                    }
                })
                    .fail(function () {
                    utils.alertMessage("\u4FDD\u5B58\u300C" + text_1 + "\u300D\u5931\u8D25");
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                });
            }
        }, 300));
    }
})(SuperadminFieldQa_settingIndex || (SuperadminFieldQa_settingIndex = {}));


/***/ }),

/***/ 956:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1163]);
//# sourceMappingURL=40.js.map