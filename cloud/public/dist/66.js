webpackJsonp([66],{

/***/ 1107:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(521);


/***/ }),

/***/ 521:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(904);
$(function () {
    $('#myTab li:eq(0) a').tab('show');
    $('#myTab a').on('shown.bs.tab', function (e) {
        height();
    });
    $('#use').on('click', function () {
        invoke(this);
    });
});
function invoke(btn) {
    var $btn = $(btn);
    var $q = $('input[name=\'q\']');
    var val = $.trim($q.val());
    if (val === '') {
        new PNotify({
            title: '提示：',
            text: '请输入问句！'
        });
        // alert('请输入问句');
        $q.focus();
        return;
    }
    // var queryString = $("form").serialize();
    var url = 'api/debug';
    // console.log($("form").val());
    // return;
    $.ajax(url, {
        type: 'POST',
        async: false,
        dataType: 'text',
        beforeSend: function (XMLHttpRequest) {
            $q.attr('disabled', 'disabled');
            $btn.attr('disabled', 'disabled');
        },
        data: $('form').serialize(),
        success: function (data, textStatus) {
            $('#response').val(data);
        },
        complete: function (XMLHttpRequest, textStatus) {
            $q.removeAttr('disabled');
            $btn.removeAttr('disabled');
        }
    });
}
function height() {
    var screenHeight = window.innerHeight;
    var h = $('.x_panel').outerHeight(true) + $('footer').outerHeight(true) + $('.nav_menu').outerHeight(true) + 16;
    if (h > screenHeight) {
        $('.left_col').css('height', h + 'px');
        $('.right_col').css('height', h + 'px');
        $('.main_container').css('height', h + 'px');
        $('.container').css('height', h + 'px');
        $('body').css('height', h + 'px');
    }
    else {
        $('.left_col').css('height', '100%');
        $('.right_col').css('height', '100%');
        $('.main_container').css('height', '100%');
        $('.container').css('height', '100%');
        $('body').css('height', '100%');
    }
}


/***/ }),

/***/ 904:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1107]);
//# sourceMappingURL=66.js.map