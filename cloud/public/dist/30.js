webpackJsonp([30],{

/***/ 1178:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(64);


/***/ }),

/***/ 292:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(292);
// import 'select2/dist/css/select2.css';
// import 'script-loader!select2/dist/js/select2.full.min.js';
var utils_1 = __webpack_require__(5);
__webpack_require__(47);
var tables = __webpack_require__(7);
// 素材部分公用函数start
function renderBtn(id, type) {
    var val = $("#" + type + "-account").val();
    var edit = "\n\t\t\t<div class=\"icon-wrap view-edit\" data-id='" + id + "' title='\u7F16\u8F91'>\n\t\t\t\t<img src=\"" + ctx + "/images/materialIcon/editIconD.png\" width=\"20px\" height=\"20px\">\n\t\t\t</div>\n\t", del = "\n\t\t\t<div class=\"icon-wrap view-delete\" data-id='" + id + "' title='\u5220\u9664'>\n\t\t\t\t<img src=\"" + ctx + "/images/materialIcon/delIconD.png\" width=\"20px\" height=\"20px\">\n\t\t\t</div>\n\t\t", pushOne = "\n\t\t\t<div class=\"icon-wrap view-share\" data-id='" + id + "' title='\u7FA4\u53D1'>\n\t\t\t\t<img src=\"" + ctx + "/images/materialIcon/shareIconD.png\" width=\"20px\" height=\"20px\">\n\t\t\t</div>\n\t\t";
    if (val === '') {
        pushOne = '';
    }
    else if (nodeAccountId && nodeAccountId !== val) {
        edit = del = '';
    }
    return "\n\t\t<div class=\"btnToolbox\">\n\t\t\t" + edit + "\n\t\t\t<div class=\"icon-wrap view-share-all\" data-id='" + id + "' title='\u63A8\u9001\u5230\u5FAE\u4FE1\u77E9\u9635'>\n\t\t\t\t<img src=\"" + ctx + "/images/materialIcon/shareAllIconD.png\" width=\"20px\" height=\"20px\">\n\t\t\t</div>\n\t\t\t" + pushOne + "\n\t\t\t" + del + "\n\t\t</div>\n\t";
}
exports.renderBtn = renderBtn;
/**
 * 获取公众号ID
 *
 * @export
 * @param {any} type
 * @returns
 */
function getAccountId(type) {
    var selectEl = $("#" + type + "-account");
    var value = selectEl.val();
    if (value) {
        return value;
    }
    else {
        if (type === 'text' || type === 'link') {
            return '';
        }
        else {
            var ids_1 = [];
            selectEl.find('option:not(:first)').each(function (i, e) {
                ids_1.push($(e).val());
            });
            return ids_1.join(',');
        }
    }
}
exports.getAccountId = getAccountId;
function getActiveAccountId() {
    var account = $('#tab-content .active.tab-pane .weixin-account');
    if (account.length > 0) {
        var val = account.val(), selectId = val === ''
            ? Array.prototype.map.call(account.find('option:not([value=""])'), function (o) { return $(o).val(); }).join(',')
            : val;
        return selectId;
    }
    return '';
}
exports.getActiveAccountId = getActiveAccountId;
/**
 * 搜索回车事件，搜索按钮事件，公众号change事件
 * (注意：请将初始化上传事件放在这个前面，不然新建素材按钮不会disabled)
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
    var addBtn = $("#" + type + "-add-btn");
    // addBtn.prop('disabled', 'disabled').find('input[type=file]').prop('disabled', true).css('cursor', 'not-allowed');
    $("#" + type + "-account").on('change', function () {
        // 	if ($.trim($(`#${type}-account`).val()) === '') {
        // 		addBtn.prop('disabled', 'disabled').find('input[type=file]').prop('disabled', true).css('cursor', 'not-allowed');
        // 	} else {
        // 		addBtn.prop('disabled', null).find('input[type=file]').prop('disabled', false).css('cursor', 'pointer');
        // 	}
        cb();
    });
}
exports.bindSearchEvent = bindSearchEvent;
function resourceCreateAjax(data, cb, type) {
    if (type === 'text') {
        return $.ajax({
            url: 'weixinv2/enterprise/plaintext/save',
            method: 'POST',
            data: data
        }).done(function (msg) {
            cb(msg);
        });
    }
    else if (type === 'link') {
        return $.ajax({
            url: 'weixinv2/enterprise/outsideChain/save',
            method: 'POST',
            data: data
        }).done(function (msg) {
            cb(msg);
        });
    }
    else if (type === 'video') {
        return $.ajax({
            url: 'weixinv2/material/saveVideo',
            method: 'POST',
            data: data
        }).done(function (msg) {
            cb(msg);
        });
    }
}
exports.resourceCreateAjax = resourceCreateAjax;
function resourceUpdateAjax(data, cb, type) {
    if (type === 'text') {
        return $.ajax({
            url: 'weixinv2/enterprise/plaintext/update',
            method: 'POST',
            data: data
        }).done(function (msg) {
            cb(msg);
        });
    }
    else if (type === 'link') {
        return $.ajax({
            url: 'weixinv2/enterprise/outsideChain/upload',
            method: 'POST',
            data: data
        }).done(function (msg) {
            cb(msg);
        });
    }
    else if (type === 'video') {
        return $.ajax({
            url: 'weixinv2/material/updateVideo',
            method: 'POST',
            data: data
        }).done(function (msg) {
            cb(msg);
        });
    }
    else {
        return $.ajax({
            url: 'weixinv2/material/updateNewMedia',
            method: 'POST',
            data: data
        }).done(function (msg) {
            cb(msg);
        });
    }
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
function bindDeleteEvent(type, cb) {
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
            msg: "\u786E\u8BA4\u5220\u9664\u8BE5" + text + "\u5417?",
            cb: function (modal, btn) {
                var end = utils_1.loadingBtn(btn);
                $.ajax({
                    url: 'weixinv2/material/deleteMedia',
                    method: 'POST',
                    data: {
                        mediaId: id
                    },
                    success: function (res) {
                        if (!res.error) {
                            cb(res, el);
                            modal.modal('hide');
                        }
                        utils_1.alertMessage(res.msg, !res.error);
                    },
                    complete: function () {
                        end();
                    }
                });
            }
        });
    });
}
exports.bindDeleteEvent = bindDeleteEvent;
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
    if (type === 'text') {
        $("#" + type + "-tab").on('click', '.view-delete', function () {
            var el = $(this);
            var id = el.data().id;
            utils_1.confirmModal({
                msg: "\u786E\u8BA4\u5220\u9664\u8BE5" + text + "\u5417?",
                cb: function (modal, btn) {
                    var endLoading = utils_1.loadingBtn(btn);
                    $.ajax({
                        url: "weixinv2/enterprise/plaintext/delete",
                        method: 'POST',
                        data: { id: "" + id },
                        success: function (res) {
                            if (!res.error) {
                                // table.ajax.reload(null, false);
                                cb();
                                modal.modal('hide');
                            }
                            utils_1.alertMessage(res.msg, !res.error);
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                }
            });
        });
    }
    else if (type === 'link') {
        // url和data要修改
        $("#" + type + "-tab").on('click', '.view-delete', function () {
            var el = $(this);
            var id = el.data().id;
            utils_1.confirmModal({
                msg: "\u786E\u8BA4\u5220\u9664\u8BE5" + text + "\u5417?",
                cb: function (modal, btn) {
                    var endLoading = utils_1.loadingBtn(btn);
                    $.ajax({
                        url: "weixinv2/enterprise/outsideChain/delete",
                        method: 'POST',
                        data: { id: "" + id },
                        success: function (res) {
                            if (!res.error) {
                                cb();
                                // table.ajax.reload(null, false);
                                modal.modal('hide');
                            }
                            utils_1.alertMessage(res.msg, !res.error);
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                }
            });
        });
    }
}
exports.bindResourceDeleteEvent = bindResourceDeleteEvent;
function resourceFileDeleteMoreEvent(ids, type, cb) {
    if (ids.length === 0) {
        return;
    }
    var nurl;
    if (type === 'link') {
        nurl = 'weixinv2/enterprise/outsideChain/deleteMore';
    }
    else if (type === 'video') {
        nurl = 'weixinv2/material/deleteMoreVideo';
    }
    $.ajax({
        url: nurl,
        method: 'POST',
        data: {
            mediaIds: ids.join(',')
        },
        success: function () {
            if (cb) {
                cb();
            }
        }
    });
}
exports.resourceFileDeleteMoreEvent = resourceFileDeleteMoreEvent;
var PushModal = /** @class */ (function () {
    function PushModal() {
        var _this = this;
        this.modal = $('#push-modal');
        this.modal.one('shown.bs.modal', function () {
            _this.initTable();
        });
    }
    PushModal.prototype.initTable = function () {
        var _this = this;
        this.table = new tables.Table({
            el: $('#push-table'),
            options: {
                serverSide: false,
                scrollY: '450px',
                scrollCollapse: true,
                select: 'multi',
                data: output[0].wechatCredentials,
                info: false,
                initComplete: function () {
                    _this.initSelect2();
                    _this.bindEvent();
                },
                columns: [
                    { data: 'wxName', title: '公众号' },
                    {
                        data: 'accountType', className: 'select-wrap prevent', title: '群发对象',
                        render: this.renderSelect
                    }
                ]
            },
            checkbox: {
                data: ''
            }
        });
        // this.table = new tables.Table({
        // 	el: $('#push-table'),
        // 	options: {
        // 		serverSide: false,
        // 		scrollY: '450px',
        // 		scrollCollapse: true,
        // 		select: false,
        // 		info: false,
        // 		initComplete: () => {
        // 			this.initSelect2();
        // 			this.bindEvent();
        // 		},
        // 	}
        // });
    };
    PushModal.prototype.renderSelect = function (text, status, rowData) {
        if (text !== 3) {
            var options_1 = '';
            groupOutput[0].groupNames.map(function (v) {
                if (v.credential.id === rowData.id) {
                    options_1 += "\n\t\t\t\t\t\t<option value=\"" + v.groupid + "\">" + v.name + "</option>\n\t\t\t\t\t\t";
                }
            });
            return "\n\t<div class=\"form-group\">\n\t  <select data-id=\"" + rowData.id + "\" class=\"select form-control\">\n\t    <option value=\"-1\">\u5168\u90E8\u7528\u6237</option>\n\t    " + options_1 + "\n\t  </select>\n\t</div>\n\t\t\t\t";
        }
        else {
            var options_2 = '';
            credentialBeansOutput[0].wechatAppInCredentialBeans.map(function (v) {
                if (v.credentialId === rowData.id) {
                    for (var _i = 0, _a = v.apps; _i < _a.length; _i++) {
                        var sv = _a[_i];
                        options_2 += "\n\t\t\t\t\t\t<option value=\"" + sv.agentid + "\">" + sv.name + "</option>\n\t\t\t\t\t\t";
                    }
                }
            });
            return "\n\t<div class=\"form-group\">\n\t\t<select data-id=\"" + rowData.id + "\" multiple=\"multiple\" class=\"select form-control select2\">\n\t\t\t" + options_2 + "\n\t\t</select>\n\t</div>\n\t\t\t\t";
        }
    };
    PushModal.prototype.initSelect2 = function () {
        this.modal.find('.select2').select2({
            placeholder: '企业号群发对象'
        });
    };
    PushModal.prototype.bindEvent = function () {
        // tables.bindCheckBoxEvent($('#push-table'));
        var _this = this;
        this.modal.on('hidden.bs.modal', function (e) {
            _this.clearTable();
        });
        var self = this;
        $('#push-sure').on('click', function () {
            var num = 0;
            var op = _this.op;
            if (!op) {
                return;
            }
            // const rowsData = this.table.selected;
            // if (rowsData.length <= 0) {
            // 	alertMessage('请选择公众号');
            // 	return;
            // }
            // const data: IPushItem[] = [];
            // const
            // rowsData.map((v) => {
            // 	val = tr.find('select').val(),
            // 	const d: IPushItem = {
            // 		credential: v.id,
            // 		mediaId: op.mediaId
            // 	} as IPushItem;
            // });
            var trs = _this.modal.find('tr.selected');
            if (trs.length <= 0) {
                utils_1.alertMessage('请选择公众号');
                return;
            }
            var data = [];
            Array.prototype.forEach.call(trs, function (v) {
                var tr = $(v), trData = _this.table.dt.row(tr).data(), val = tr.find('select').val(), d = {
                    credential: trData.id,
                    mediaId: op.mediaId
                };
                if (Array.isArray(val)) {
                    if (val.length <= 0) {
                        utils_1.alertMessage('请选择公众号「' + trData.wxName + '」的群发对象');
                        return;
                    }
                    d.agentid = val.join(',');
                }
                else {
                    if (val === '-1') {
                        d.target = '1';
                    }
                    else {
                        d.target = '2';
                        d.group = val;
                    }
                }
                data.push(d);
            });
            if (data.length <= 0) {
                return;
            }
            var end = utils_1.loadingBtn($('#push-sure'));
            var currentData = op.parse ? op.parse(data) : {
                url: 'weixinv2/broadcast/addBroadcast',
                data: data
            };
            var self = _this;
            currentData.data.forEach(function (v, i) {
                $.ajax(currentData.url, {
                    method: 'POST',
                    data: v
                }).done(function (res) {
                    if (!res.error) {
                        var name_1 = self.table.dt.row(trs.eq(i)).data().wxName;
                        utils_1.alertMessage("\u6210\u529F\u63A8\u9001\u5230 \"" + name_1 + "\"", !res.error);
                    }
                    else {
                        utils_1.alertMessage(res.msg, !res.error);
                    }
                })
                    .always(function () {
                    num++;
                    if (num >= i) {
                        _this.modal.modal('hide');
                        op.refresh();
                        end();
                    }
                });
            });
            // const nameArr = [];
            // const sendArr = [];
            // if (checked.length <= 0) {
            // 	alertMessage('请选择公众号');
            // 	return;
            // }
            // for (let e of checked.toArray()) {
            // 	const checkbox = $(e);
            // 	const type = checkbox.attr('data-type');
            // 	const td = checkbox.parent();
            // 	const el = td.siblings('.select-wrap').find('.select');
            // 	const name = td.next().text();
            // 	const credential = el.data().id;
            // 	const mediaId = op.mediaId;
            // 	const value = el.val();
            // 	switch (op.type) {
            // 		case 'text':
            // 		case 'file':
            // 		case 'link':
            // 			if (type !== '3') {
            // 				alertMessage('文本、文件和链接只能推送给企业号');
            // 				return;
            // 			}
            // 			break;
            // 		default:
            // 			break;
            // 	}
            // 	nameArr.push(name);
            // 	if (el.hasClass('select2')) {
            // 		sendArr.push({
            // 			credential,
            // 			mediaId,
            // 			agentid: value.join(',')
            // 		});
            // 	} else {
            // 		if (el.val() === '-1') {
            // 			sendArr.push({
            // 				mediaId,
            // 				credential,
            // 				target: 1
            // 			});
            // 		} else {
            // 			sendArr.push({
            // 				mediaId,
            // 				credential,
            // 				target: 2,
            // 				group: value
            // 			});
            // 		}
            // 	}
            // }
            // let sum = 0;
            // const end = loadingBtn($('#push-sure'));
            // sendArr.forEach((v, i) => {
            // 	$.ajax('weixinv2/broadcast/addBroadcast', {
            // 		method: 'POST',
            // 		data: v
            // 	}).done(res => {
            // 		if (!res.error) {
            // 			alertMessage(`成功推送到 "${nameArr[i]}"`, !res.error);
            // 		} else {
            // 			alertMessage(res.msg, !res.error);
            // 		}
            // 	})
            // 		.always(() => {
            // 			sum++;
            // 			if (sum === sendArr.length) {
            // 				this.modal.modal('hide');
            // 				op.cb();
            // 				end();
            // 			}
            // 		});
            // });
        });
    };
    PushModal.prototype.clearTable = function () {
        this.modal.find('tbody tr').show();
        this.modal.find('input[type=checkbox]').prop('checked', false);
        this.modal.find('select:not(.select2)').val('-1');
        this.modal.find('.select2').select2().val(null).trigger('change');
    };
    PushModal.prototype.updateTitle = function (title) {
        this.modal.find('.modal-header h4').html(title);
    };
    PushModal.prototype.show = function (op) {
        this.op = op;
        switch (op.type) {
            // case 'text':
            // case 'video':
            case 'file':
            case 'link':
                var trs = $('#push-table tbody tr'), wx = trs.filter('[data-type!="3"]');
                if (trs.length <= wx.length) {
                    return utils_1.alertMessage('没有符合推送该类型的公众号');
                }
                wx.hide();
                break;
            default:
                break;
        }
        if (op.single) {
            var currentAccountId_1 = $("#" + op.type + "-account").val();
            if (!currentAccountId_1) {
                return;
            }
            $('#check-wrap').hide();
            this.updateTitle('群发');
            this.modal.find('tbody tr').each(function (i, e) {
                var el = $(e);
                if (el.attr('data-id') !== currentAccountId_1) {
                    el.hide();
                }
                else {
                    el.find('input[type="checkbox"]').prop('checked', true).trigger('change');
                }
            });
        }
        else {
            $('#check-wrap').show();
            this.updateTitle('推送到矩阵');
        }
        this.modal.modal('show');
    };
    PushModal.prototype.hide = function () {
        this.modal.modal('hide');
    };
    return PushModal;
}());
exports.PushModal = PushModal;
function noResourceHtml() {
    return '<p class="cloud-no-resource">没有检索到数据</p>';
}
exports.noResourceHtml = noResourceHtml;
// 素材部分公用函数end


/***/ })

},[1178]);
//# sourceMappingURL=30.js.map