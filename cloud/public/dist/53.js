webpackJsonp([53],{

/***/ 1129:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(74);


/***/ }),

/***/ 291:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(291);
var utils_1 = __webpack_require__(5);
__webpack_require__(47);
// 素材部分公用函数start
function uploadResource(type, thisFile, cb, cb2) {
    if (thisFile) {
        var mimeType = thisFile.type;
        $.ajax({
            url: kbRestUrl + "/resource/file/upload/" + thisFile.name + "/" + type + "/" + appid,
            method: 'POST',
            contentType: mimeType,
            data: thisFile,
            processData: false,
            success: function (data) {
                cb(data);
            },
            error: function (e) {
                if (cb2) {
                    cb2();
                }
            }
        });
    }
}
exports.uploadResource = uploadResource;
function renderBtn(id, type) {
    return "\n\t\t<div class=\"btnToolbox\">\n\t\t\t<div class=\"icon-wrap view-edit\" data-id='" + id + "' title='\u7F16\u8F91'>\n\t\t\t\t<img src=\"" + ctx + "/images/materialIcon/editIconD.png\" width=\"20px\" height=\"20px\">\n\t\t\t</div>\n\t\t\t<div class=\"icon-wrap view-delete\" data-id='" + id + "' title='\u5220\u9664'>\n\t\t\t\t<img src=\"" + ctx + "/images/materialIcon/delIconD.png\" width=\"20px\" height=\"20px\">\n\t\t\t</div>\n\t\t</div>\n\t";
}
exports.renderBtn = renderBtn;
/**
 * 搜索回车事件，搜索按钮事件
 * @export
 * @param {any} type
 * @param {any} cb
 */
function bindSearchEvent(type, cb) {
    $("#" + type + "-search-btn").on('click', function () {
        cb();
    });
    $("#" + type + "-search-title").on('keydown', function (e) {
        if (e && e.keyCode === 13) {
            cb();
            return false;
        }
    });
}
exports.bindSearchEvent = bindSearchEvent;
function resourceCreateAjax(data, cb) {
    console.log(data);
    return $.ajax({
        url: kbRestUrl + "/resource/create/" + appid,
        method: 'POST',
        data: JSON.stringify(data),
        xhrFields: {
            withCredentials: true
        },
        contentType: 'application/json'
    }).done(function (msg) {
        cb(msg);
    });
}
exports.resourceCreateAjax = resourceCreateAjax;
function resourceUpdateAjax(data, cb) {
    return $.ajax({
        url: kbRestUrl + "/resource/update",
        method: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function (msg) {
        cb(msg);
    });
}
exports.resourceUpdateAjax = resourceUpdateAjax;
function bindResourceEditEvent(type, cb) {
    $("#" + type + "-tab").on('click', '.view-edit', function () {
        var el = $(this);
        var id = el.data().id;
        cb(id, el);
    });
}
exports.bindResourceEditEvent = bindResourceEditEvent;
function bindResourceDownloadEvent(type) {
    $("#" + type + "-tab").on('click', '.view-download', function () {
        var a = document.createElement('a');
        a.href = $(this).data().url;
        a.download = '';
        a.click();
    });
}
exports.bindResourceDownloadEvent = bindResourceDownloadEvent;
// 图文组接口不同
/*export function bindDeleteEvent(type, cb) {
    let text;
    switch (type) {
        case 'text': text = '文本'; break;
        case 'image': text = '图片'; break;
        case 'voice': text = '语音'; break;
        case 'video': text = '视频'; break;
        case 'music': text = '音乐'; break;
        case 'link': text = '链接'; break;
        case 'file': text = '文件'; break;
        default: text = '~~~~type错误~~~~~'; break;
    }

    $(`#${type}-tab`).on('click', '.view-delete', function () {
        const el = $(this);
        const id = el.data().id;
        confirmModal({
            msg: `确认删除该${text}吗?`,
            cb: (modal, btn) => {
                const end = loadingBtn(btn);
                $.ajax({
                    url: 'weixinv2/material/deleteMedia',
                    method: 'POST',
                    data: {
                        mediaId: id
                    },
                    success: (res) => {
                        if (!res.error) {
                            cb(res, el);
                            modal.modal('hide');
                        }
                        alertMessage(res.msg, !res.error);
                    },
                    complete: () => {
                        end();
                    }
                });
            }
        });
    });
}*/
function bindResourceDeleteEvent(type, cb) {
    var text;
    switch (type) {
        case 'text':
            text = '文本';
            break;
        case 'image':
            text = '图片';
            break;
        case 'voice':
            text = '语音';
            break;
        case 'video':
            text = '视频';
            break;
        case 'music':
            text = '音乐';
            break;
        case 'news':
            text = '图文';
            break;
        case 'link':
            text = '链接';
            break;
        case 'file':
            text = '文件';
            break;
        default:
            text = '~~~~type错误~~~~~';
            break;
    }
    $("#" + type + "-tab").on('click', '.view-delete', function () {
        var el = $(this);
        var id = el.data().id;
        utils_1.confirmModal({
            msg: "\u786E\u8BA4\u5220\u9664\u8BE5" + text + "\u5417?\uFF08\u8BE5\u7D20\u6750\u5173\u8054\u7684\u8BED\u6599\u5C06\u88AB\u4E00\u540C\u5220\u9664\uFF0C\u8BF7\u77E5\u6089\uFF01\uFF09",
            cb: function (modal, btn) {
                var endLoading = utils_1.loadingBtn(btn);
                $.ajax({
                    url: ctx + "/knowledge/material/delete?materialId=" + id + "&type=" + type /* `${kbRestUrl}/resource/delete/${appid}/${id}/${type}` */,
                    method: 'DELETE',
                    success: function (res) {
                        if (res.success) {
                            cb();
                            utils_1.alertMessage('删除成功！', true);
                        }
                        else {
                            utils_1.alertMessage(res.msg, res.success);
                        }
                        modal.modal('hide');
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
}
exports.bindResourceDeleteEvent = bindResourceDeleteEvent;
function triggerAddEvent() {
    if (window.ifResolveHrefParam) {
        return;
    }
    $("#" + typeParam + "-link").trigger('addResource');
    window.ifResolveHrefParam = true;
}
exports.triggerAddEvent = triggerAddEvent;
function triggerEditEvent(cb) {
    if (!idParam) {
        return;
    }
    $.ajax(kbRestUrl + "/resource/search/" + appid, {
        method: 'POST',
        data: utils_1.cleanObject({
            type: typeParam,
            group: sendGroup,
            appid: appid,
            page: 1,
            size: 10,
            id: idParam
        })
    })
        .done(function (res) {
        if (cb) {
            cb(res);
        }
    });
}
exports.triggerEditEvent = triggerEditEvent;
function resourceFileDeleteMoreEvent(ids, cb) {
    if (ids.length === 0) {
        return;
    }
    ids.forEach(function (v) {
        var meI = encodeURIComponent(v);
        $.ajax({
            url: kbRestUrl + "/resource/file/delete?mediaId=" + meI,
            method: 'DELETE',
            success: function () {
                if (cb) {
                    cb();
                }
            }
        });
    });
}
exports.resourceFileDeleteMoreEvent = resourceFileDeleteMoreEvent;
function noResourceHtml() {
    return '<p class="cloud-no-resource">没有检索到数据</p>';
}
exports.noResourceHtml = noResourceHtml;
// 素材部分公用函数end


/***/ })

},[1129]);
//# sourceMappingURL=53.js.map