webpackJsonp([64],{

/***/ 1111:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(525);


/***/ }),

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
__webpack_require__(36);
__webpack_require__(908);
var messageList = $('#message-list');
var messageContent = $('#message-content');
function fetchMessages() {
    return $.ajax('bulletin/queryBulletinSystem', {
        method: 'POST'
    });
}
function updateMessageContent(content) {
    messageContent.html(content);
}
function updateActiveMessage(item) {
    if (item.hasClass('active')) {
        return;
    }
    messageList.find('.active').removeClass('active');
    try {
        var data = item.data('data');
        updateMessageContent(data.contentHtml);
        item.addClass('active');
    }
    catch (error) {
        updateMessageContent('<p class="text-center">获取数据异常</p>');
    }
}
(function () {
    var unviewedModal = $('#unreviewed-modal');
    if (unviewedModal.modal.length > 0) {
        unviewedModal.modal('show');
    }
    if (enterIndexCount === 1 && unresolveduProblemCount > 0) {
        utils_1.alertMessage("\u7CFB\u7EDF\u4E2D\u6709<span class=\"text-danger\">" + unresolveduProblemCount + "</span>\u6B21\u4F1A\u8BDD\u88AB\u7528\u6237\u8BC4\u4EF7\u4E3A\u672A\u89E3\u51B3\u95EE\u9898\uFF0C\u8BF7\u5C3D\u5FEB\u53BB\u4F1A\u8BDD\u7EDF\u8BA1\u9875\u9762\u67E5\u770B\u8BE6\u60C5", 'warn');
    }
    messageList.on('click', '.message-item', function (e) {
        var item = $(e.currentTarget);
        updateActiveMessage(item);
    });
    fetchMessages()
        .then(function (res) {
        if (!res) {
            return;
        }
        var messages = JSON.parse(res);
        messageList.empty();
        if (messages && messages.length > 0) {
            messages.forEach(function (data, index) {
                var item = $("<tr class=\"message-item\">\n\t\t\t\t\t\t<td>" + data.title + "</td>\n\t\t\t\t\t\t<td>" + moment(data.createTime).format('YYYY-MM-DD') + "</td>\n\t\t\t\t\t</tr>");
                item.data('data', data);
                messageList.append(item);
                if (index === 0) {
                    item.find('td:first').append('<img src="images/new.png">');
                    updateActiveMessage(item);
                }
            });
        }
        else {
            messageList.append('<tr class="text-center"><td colspan="2">暂无数据</td></tr>');
        }
    });
}());


/***/ }),

/***/ 908:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1111]);
//# sourceMappingURL=64.js.map