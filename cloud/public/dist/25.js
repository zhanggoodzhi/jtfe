webpackJsonp([25],{

/***/ 1048:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
var tables = __webpack_require__(13);
var preDate;
var auditedDate;
var preTable;
var auditedTable;
var preSideBar;
var auditedSideBar;
var preCurrentData;
var auditedCurrentData;
var editDoc;
var editCroups;
var editType;
// 公用的编辑侧栏
var editSidebar;
var symbols = ['.', ',', '?', '|', '[', ']', '^', '$', '\\', '-', '+', '*', '{', '}', '(', ')']
    .map(function (v) { return new RegExp('\\' + v); }, 'ig');
$(function () {
    initEditSideBar();
});
function initPreAudited() {
    initPreSideBar();
    initPreAuditedDate();
    initPreAuditedTable();
}
exports.initPreAudited = initPreAudited;
function initAudited() {
    initAuditedSideBar();
    initAuditedDate();
    initAuditedTable();
}
exports.initAudited = initAudited;
function initEditSideBar() {
    editSidebar = new utils.SideBar({
        id: 'edit-sidebar',
        title: '编辑',
        content: "\n        <div class=\"row edit-sidebar-content\">\n            <div class=\"col-sm-6\">\n                <form class=\"flex-form row prop-form\">\n                <div class=\"form-group col-sm-6\">\n                    <label>\u7C7B\u578B</label>\n                    <div id=\"edit-sidebar-classify\" class=\"form-control input-sm\"/>\n                </div>\n                <div class=\"form-group col-sm-6\">\n                    <label>\u89D2\u8272</label>\n                    <select type=\"text\" id=\"edit-sidebar-character\" class=\"form-control input-sm\">\n                    " + selectData.character.map(function (v) { return "<option value=\"" + v.id + "\">" + v.name + "</option>"; }).join('') + "\n                    </select>\n                </div>\n                <div class=\"form-group col-sm-6\">\n                    <label>\u6E20\u9053</label>\n                    <select type=\"text\" id=\"edit-sidebar-pushway\" class=\"form-control input-sm\">\n                    " + selectData.pushway.map(function (v) { return "<option value=\"" + v.id + "\">" + v.name + "</option>"; }).join('') + "\n                    </select>\n                </div>\n                <div class=\"form-group col-sm-6\">\n                    <label>\u6709\u6548\u671F</label>\n                    <input type=\"text\" id=\"edit-sidebar-time\" class=\"form-control input-sm\"/>\n                </div>\n                </form>\n                <form id=\"corpus-form\" class=\"corpus-form\">\n\n                </form>\n                <div class=\"text-center edit-sidebar-btn\">\n                    <button id=\"save-edit-btn\" type=\"button\" class=\"btn btn-primary\">\u4FDD\u5B58</button>\n                    <button id=\"save-check-edit-btn\" type=\"button\" class=\"btn btn-primary\">\u4FDD\u5B58\u5E76\u5BA1\u6838</button>\n                    <button id=\"cancel-edit-btn\" type=\"button\" class=\"btn btn-primary\">\u8FD4\u56DE</button>\n                </div>\n            </div>\n            <div class=\"col-sm-6 edit-doc-content\" id=\"edit-doc-content\"></div>\n        </div>\n        "
    });
    var corpusForm = $('#corpus-form'), docContent = $('#edit-doc-content');
    var classify = new utils.Tree({
        el: $('#edit-sidebar-classify'),
        data: utils.formatClassify(selectData.classify)
    });
    $('#cancel-edit-btn').on('click', function () {
        editSidebar.hide();
    });
    $('#edit-sidebar-time').daterangepicker({
        locale: utils.DATERANGEPICKERLOCALE,
        startDate: moment(),
        endDate: moment().add(5, 'years')
    });
    corpusForm.on('click', ('.add-q'), function (e) {
        var input = $(e.currentTarget).closest('.question-action').prev(), group = input.parent('.form-group'), repeat = input.parent().prev('.repeat-wrap'), val = input.val().trim();
        // exisit = repeat.find('input').toArray().map(v => $(v).val().trim());
        input.focus();
        if (val === '' || group.hasClass('has-error') || group.data('loading')) {
            return;
        }
        // if (exisit.indexOf(val) > -1) {
        // 	utils.alertMessage('请不要添加重复的复述问法');
        // 	return;
        // }
        repeat.append(renderRemoveInput(val));
        input.val('');
    });
    corpusForm.on('click', '.remove-icon', function (e) {
        $(e.currentTarget).parent().remove();
    });
    corpusForm.on('click', '.edit-question,.edit-answer', function (e) {
        var el = $(e.currentTarget), val = el.data('text');
        if (val !== '') {
            var wrap = $('#edit-doc-content ');
            if (!el.hasClass('selected')) {
                corpusForm.find('.selected').removeClass('selected');
                el.addClass('selected');
            }
            renderDocContent(val);
            var strong = wrap.find('strong:first');
            if (strong.length > 0) {
                wrap.animate({ scrollTop: strong.get(0).offsetTop });
            }
        }
    });
    docContent.on('mouseup', function (e) {
        var text = getIt(), selected = corpusForm.find('.selected');
        if (selected.length > 0 && text) {
            selected
                .data('text', text)
                .html(text).trigger('click');
        }
    });
    corpusForm.on('input', '.add-input-question', utils.debounce(function (e) {
        var input = $(e.currentTarget), group = input.parent('.form-group'), info = group.find('.add-question-info'), val = input.val().trim(), exist = corpusForm.find('.repeat-wrap input').toArray().map(function (v) { return $(v).val().trim(); });
        if (exist.indexOf(val) > -1) {
            group.addClass('has-error');
            info.html('复述问法已存在!').show();
            return;
        }
        var clear = function () {
            group.removeClass('has-error');
            info.empty().hide();
            group.data('loading', false);
        };
        if (!editCroups || editCroups.length <= 0) {
            return;
        }
        if (val !== '') {
            group.data('loading', true);
            $.ajax('knowledge/documentAnalysis/documentCorpus/hasSame', {
                abortOnRetry: true,
                data: {
                    questionLiteral: val,
                    documentId: editCroups[0].documentId
                }
            })
                .done(function (res) {
                if (res.data) {
                    group.addClass('has-error');
                    info.html('复述问法已存在!').show();
                }
                else {
                    clear();
                }
            });
        }
        else {
            clear();
        }
    }, 200));
    $('#save-edit-btn').on('click', function (e) {
        var group = $('#corpus-form .question-wrap');
        if (group.hasClass('has-error') || group.data('loading')) {
            return;
        }
        var end = utils.loadingBtn($(e.currentTarget));
        saveEdit(function (xhr) {
            end();
        });
    });
    $('#save-check-edit-btn').on('click', function (e) {
        var group = $('#corpus-form .question-wrap');
        if (group.hasClass('has-error') || group.data('loading')) {
            return;
        }
        var end = utils.loadingBtn($(e.currentTarget));
        saveEdit(function (xhr) {
            if (xhr.error) {
                end();
                return;
            }
            $.ajax({
                url: 'knowledge/documentAnalysis/documentCorpus/verify',
                method: 'GET',
                data: {
                    pairIds: editCroups.map(function (v) { return v.pairId; }).join(',')
                },
                success: function (msg) {
                    if (!msg.error) {
                        if (preTable) {
                            preTable.refresh();
                        }
                        if (auditedTable) {
                            auditedTable.refresh();
                        }
                        editSidebar.hide();
                    }
                    utils.alertMessage(msg.msg, !msg.error);
                },
                complete: function () {
                    end();
                }
            });
        });
    });
    function saveEdit(cb) {
        // const els = editSidebar.elements;
        var time = $('#edit-sidebar-time').val().split(' - '), data = {
            classifyId: classify.selected[0],
            characterId: $('#edit-sidebar-character').val(),
            pushway: $('#edit-sidebar-pushway').val(),
            beginTime: time[0],
            endTime: time[1]
        }, corpus = Array.prototype.map.call(corpusForm.find('.form-block'), function (v, i) {
            var el = $(v), qs = el.find('.repeat-wrap input').toArray().map(function (input) { return $(input).val(); }), q = el.find('.question-wrap input').val().trim();
            if (q !== '' && qs.indexOf(q) < 0) {
                qs.push(q);
            }
            var d = __assign({}, data, { digest: el.find('.edit-answer').html(), literal: el.find('.edit-question').html(), sunQuestions: qs.map(function (val) {
                    return {
                        questionId: null,
                        questionLiteral: val
                    };
                }) });
            return Object.assign({}, editCroups[i], d);
        });
        $.ajax('knowledge/documentAnalysis/documentCorpus/update', {
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(corpus)
        })
            .done(function (res) {
            if (!res.error) {
                editSidebar.hide();
                if (preTable) {
                    preTable.refresh();
                }
                if (auditedTable) {
                    auditedTable.refresh();
                }
            }
            utils.alertMessage(res.msg, !res.error);
        })
            .always(cb);
    }
}
function renderRemoveInput(val) {
    return "<div class=\"remove-input\">\n            <input class=\"form-control input-sm\" type=\"text\" readonly value=\"" + val + "\">\n            <span class=\"remove-icon\"></span>\n        </div>\n        ";
}
function fillEditSidebar(cb) {
    if (editCroups.length < 0) {
        return;
    }
    $.ajax('knowledge/attach/viewDoc', {
        data: {
            attachId: editCroups[0].documentId
        }
    })
        .done(function (res) {
        var html = '';
        editDoc = res.replace(/\s+/g, '');
        renderDocContent();
        editCroups.forEach(function (v) {
            html += "\n                        <hr/>\n                        <div class=\"form-block\">\n                            <div class=\"form-group\">\n                            <label>\u95EE\u9898</label>\n                            <div class=\"form-control input-sm edit-question\">" + v.literal + "</div>\n                            </div>\n                            <div class=\"form-group\">\n                            <label>\u590D\u8FF0\u95EE\u6CD5</label>\n                            <div class=\"repeat-wrap\">\n                                " + v.sunQuestions.map(function (q) { return renderRemoveInput(q.questionLiteral); }).join('') + "\n                            </div>\n                            <div class=\"question-wrap form-group\">\n                                <input class=\"form-control input-sm add-input-question\"/>\n                                <div class=\"question-action\"><i class=\"fa fa-plus add-q\"></i></div>\n\t\t\t\t\t\t\t\t<p class=\"add-question-info\"></p>\n                            </div>\n                            </div>\n                            <div class=\"form-group\">\n                            <label>\u56DE\u590D</label>\n                            <div class=\"form-control input-sm edit-answer\">" + v.digest + "</div>\n                            </div>\n                        </div>";
        });
        $('#corpus-form').html(html);
        editSidebar.show();
        var saveCheckBtn = $('#save-check-edit-btn');
        switch (editType) {
            case 'preBatch':
                saveCheckBtn.show();
                break;
            case 'auditedBatch':
                saveCheckBtn.hide();
                break;
            default:
                return;
        }
    });
}
function renderDocContent(keyword) {
    var doc = editDoc;
    if (keyword) {
        // symbols.forEach(v => {
        // 	keyword = keyword.replace(v, symbol => {
        // 		console.log(symbol, '\\' + symbol);
        // 		return '\\' + symbol;
        // 	});
        // });
        doc = doc.replace(keyword, function (k) { return "<strong>" + k + "</strong>"; });
    }
    $('#edit-doc-content').html(doc);
}
function initPreSideBar() {
    preSideBar = new utils.SideBar({
        id: 'pre-sideBar',
        title: '查看详情',
        content: "\n            <form id=\"pre-detail-form\" class=\"disabled-form\">\n            <div class=\"cloud-row\">\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u95EE\u9898</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"question\">\u95EE\u9898</p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u56DE\u590D</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"answer\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u6587\u6863\u6807\u9898</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"title\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u7C7B\u578B</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"type\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u89D2\u8272</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"role\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u6E20\u9053</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"method\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u66F4\u65B0\u65F6\u95F4</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"update-time\"></p>\n                </div>\n                </div>\n            </div>\n            <div class=\"btn-wrap\">\n                <button type=\"button\" class=\"pass btn btn-primary btn-sm\">\u5BA1\u6838\u901A\u8FC7</button>\n                <button type=\"button\" class=\"edit btn btn-primary btn-sm\">\u7F16\u8F91</button>\n                <button type=\"button\" class=\"del btn btn-danger btn-sm\">\u5220\u9664</button>\n            </div>\n            </form>\n        "
    });
}
function initAuditedSideBar() {
    auditedSideBar = new utils.SideBar({
        id: 'audited-sideBar',
        title: '语料详情',
        content: "\n            <form id=\"pre-detail-form\" class=\"disabled-form\">\n            <div class=\"cloud-row\">\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u95EE\u9898</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"question\">\u95EE\u9898</p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u56DE\u590D</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"answer\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u6587\u6863\u6807\u9898</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"title\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u7C7B\u578B</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"type\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u89D2\u8272</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"role\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u6E20\u9053</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"method\"></p>\n                </div>\n                </div>\n                <div class=\"form-group clearfix\">\n                <label class=\"control-label col-md-2 col-sm-2 col-lg-2\">\u66F4\u65B0\u65F6\u95F4</label>\n                <div class=\"col-md-10 col-sm-10 col-lg-10\">\n                    <p class=\"update-time\"></p>\n                </div>\n                </div>\n            </div>\n            <div class=\"btn-wrap\">\n                <button type=\"button\" class=\"edit btn btn-primary btn-sm\">\u7F16\u8F91</button>\n                <button type=\"button\" class=\"del btn btn-danger btn-sm\">\u5220\u9664</button>\n            </div>\n            </form>\n                    "
    });
}
function initPreAuditedDate() {
    preDate = new utils.CommonDate({
        el: $('#pre-form-date')
    });
}
function initAuditedDate() {
    auditedDate = new utils.CommonDate({
        el: $('#audited-form-date')
    });
}
function bindPreAuditedEvent() {
    var tableEl = $('#pre-table');
    var preSideBarEl = $('#pre-sideBar');
    $('#pre-audit-tab').on('click', function () {
        if (preTable) {
            preTable.refresh();
        }
    });
    $('#pre-search-btn').on('click', function () {
        preTable.refresh(true);
    });
    $('#pre-reset-btn').on('click', function () {
        $('#pre-q').val('');
        $('#pre-a').val('');
        $('#pre-doc').val('');
        preDate.resetDate();
    });
    tables.bindCheckBoxEvent(tableEl);
    utils.bindEnter($('#pre-audit-search-form input'), function () {
        preTable.refresh(true);
    });
    $('#pre-batch-audit-btn').on('click', function () {
        var dataArr = tables.getCheckboxRowsData(tableEl);
        if (dataArr.length <= 0) {
            utils.alertMessage('请选择要审核的语料');
            return;
        }
        utils.confirmModal({
            msg: "\u786E\u8BA4\u6279\u91CF\u5BA1\u6838\u9009\u4E2D\u7684\u8BED\u6599\u5417?",
            text: '审核',
            className: 'btn-primary',
            cb: function (modal, btn) {
                var endLoading = utils.loadingBtn(btn);
                var pairIdsArr = dataArr.map(function (v) {
                    return v.pairId;
                });
                $.ajax({
                    url: 'knowledge/documentAnalysis/documentCorpus/verify',
                    method: 'GET',
                    data: {
                        pairIds: pairIdsArr.join(',')
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            preTable.refresh();
                            modal.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
    $('#pre-batch-edit-btn').on('click', function () {
        var dataArr = tables.getCheckboxRowsData(tableEl);
        if (dataArr.length === 0) {
            utils.alertMessage('请先选择语料');
            return;
        }
        var docId = dataArr[0].documentId;
        for (var _i = 0, dataArr_1 = dataArr; _i < dataArr_1.length; _i++) {
            var v = dataArr_1[_i];
            if (v.documentId !== docId) {
                utils.alertMessage('批量编辑只能选择属于同一个文档的语料');
                return;
            }
        }
        editCroups = dataArr;
        editType = 'preBatch';
        fillEditSidebar();
    });
    $('#pre-batch-del-btn').on('click', function () {
        var dataArr = tables.getCheckboxRowsData(tableEl);
        if (dataArr.length === 0) {
            utils.alertMessage('请先选择语料');
            return;
        }
        var questionIdsArr = dataArr.map(function (v) {
            return v.questionId;
        });
        utils.confirmModal({
            msg: "\u786E\u8BA4\u5220\u9664\u9009\u4E2D\u7684\u8BED\u6599\u5417?",
            cb: function (modal, btn) {
                var endLoading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
                    type: 'POST',
                    data: {
                        questionIds: questionIdsArr.join(',')
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            preTable.refresh();
                            modal.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
    tableEl.on('click', '.delete', function () {
        var _this = this;
        utils.confirmModal({
            msg: "\u786E\u8BA4\u5220\u9664\u8BE5\u8BED\u6599\u5417?",
            cb: function (modal, btn) {
                var data = preTable.table.row($(_this).closest('tr')).data();
                var endLoading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
                    type: 'POST',
                    data: {
                        questionIds: data.questionId
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            preTable.refresh();
                            modal.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
    tableEl.on('click', '.view-detail', function () {
        var data = preTable.table.row($(this).closest('tr')).data();
        preCurrentData = data;
        var sideBarEl = $('#pre-sideBar');
        sideBarEl.find('p.question').text(data.literal);
        sideBarEl.find('p.answer').text(data.digest);
        sideBarEl.find('p.title').text(data.documentTitle);
        sideBarEl.find('p.type').text(renderClassify(data.classifyId));
        sideBarEl.find('p.role').text(renderCharacter(data.characterId));
        sideBarEl.find('p.method').text(renderPushWay(data.pushway));
        sideBarEl.find('p.update-time').text(utils.renderCommonTime(data.updateTime));
        preSideBar.show();
    });
    tableEl.on('click', '.pass', function () {
        var id = preTable.table.row($(this).closest('tr')).data().pairId;
        $.ajax({
            url: 'knowledge/documentAnalysis/documentCorpus/verify',
            method: 'GET',
            data: {
                pairIds: id
            },
            success: function (msg) {
                if (!msg.error) {
                    preTable.refresh();
                }
                utils.alertMessage(msg.msg, !msg.error);
            }
        });
    });
    tableEl.on('click', '.edit', function () {
        editCroups = [preTable.table.row($(this).closest('tr')).data()];
        // editCroups[0].documentId = '6263182249974300672';
        editType = 'preBatch';
        fillEditSidebar();
    });
    // pre-sidebar事件
    preSideBarEl.on('click', '.pass', function () {
        $.ajax({
            url: 'knowledge/documentAnalysis/documentCorpus/verify',
            method: 'GET',
            data: {
                pairIds: preCurrentData.pairId
            },
            success: function (msg) {
                if (!msg.error) {
                    preSideBar.hide();
                    preTable.refresh();
                }
                utils.alertMessage(msg.msg, !msg.error);
            }
        });
    });
    preSideBarEl.on('click', '.edit', function (e) {
        editCroups = [preCurrentData];
        preSideBar.hide();
        editType = 'preBatch';
        fillEditSidebar();
    });
    preSideBarEl.on('click', '.del', function () {
        utils.confirmModal({
            msg: "\u786E\u8BA4\u5220\u9664\u8BE5\u8BED\u6599\u5417?",
            cb: function (modal, btn) {
                var endLoading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
                    type: 'POST',
                    data: {
                        questionIds: preCurrentData.questionId
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            if (preTable) {
                                preTable.refresh();
                            }
                            if (auditedTable) {
                                auditedTable.refresh();
                            }
                            modal.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
}
function bindAuditedEvent() {
    var tableEl = $('#audited-table');
    var auditedSideBarEl = $('#audited-sideBar');
    $('#audited-tab').on('click', function () {
        if (auditedTable) {
            auditedTable.refresh();
        }
    });
    $('#audited-search-btn').on('click', function () {
        auditedTable.refresh(true);
    });
    $('#audited-reset-btn').on('click', function () {
        $('#audited-q').val('');
        $('#audited-a').val('');
        $('#audited-doc').val('');
        auditedDate.resetDate();
    });
    tables.bindCheckBoxEvent(tableEl);
    utils.bindEnter($('#audited-search-form input'), function () {
        auditedTable.refresh(true);
    });
    $('#audited-batch-edit-btn').on('click', function () {
        var dataArr = tables.getCheckboxRowsData(tableEl);
        if (dataArr.length === 0) {
            utils.alertMessage('请先选择语料');
            return;
        }
        var docId = dataArr[0].documentId;
        for (var _i = 0, dataArr_2 = dataArr; _i < dataArr_2.length; _i++) {
            var v = dataArr_2[_i];
            if (docId !== v.documentId) {
                utils.alertMessage('批量编辑只能选择属于同一个文档的语料');
                return;
            }
        }
        editCroups = dataArr;
        editType = 'auditedBatch';
        fillEditSidebar();
    });
    $('#audited-export-btn').on('click', function () {
        var time = $('#audited-form-date').val().split(' - ');
        window.location.href = "knowledge/documentAnalysis/documentCorpus/exportExcel?" + $.param(utils.cleanObject({
            questionKeyword: $('#audited-q').val().trim(),
            answerKeyword: $('#audited-a').val().trim(),
            documentKeyword: $('#audited-doc').val().trim(),
            beginTime: time[0],
            endTime: time[1]
        }));
    });
    $('#audited-batch-del-btn').on('click', function () {
        var dataArr = tables.getCheckboxRowsData(tableEl);
        if (dataArr.length <= 0) {
            utils.alertMessage('请选择要删除的语料');
            return;
        }
        var questionIdsArr = dataArr.map(function (v) {
            return v.questionId;
        });
        utils.confirmModal({
            msg: "\u786E\u8BA4\u5220\u9664\u9009\u4E2D\u7684\u8BED\u6599\u5417?",
            cb: function (modal, btn) {
                var endLoading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
                    type: 'POST',
                    data: {
                        questionIds: questionIdsArr.join(',')
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            auditedTable.refresh();
                            modal.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
    tableEl.on('click', '.view-detail', function () {
        var data = auditedTable.table.row($(this).closest('tr')).data();
        auditedCurrentData = data;
        var sideBarEl = $('#audited-sideBar');
        sideBarEl.find('p.question').text(data.literal);
        sideBarEl.find('p.answer').text(data.digest);
        sideBarEl.find('p.title').text(data.documentTitle);
        sideBarEl.find('p.type').text(renderClassify(data.classifyId));
        sideBarEl.find('p.role').text(renderCharacter(data.characterId));
        sideBarEl.find('p.method').text(renderPushWay(data.pushway));
        sideBarEl.find('p.update-time').text(utils.renderCommonTime(data.updateTime));
        auditedSideBar.show();
    });
    tableEl.on('click', '.edit', function (e) {
        editCroups = [auditedTable.table.row($(e.currentTarget).closest('tr')).data()];
        editType = 'auditedBatch';
        fillEditSidebar();
    });
    tableEl.on('click', '.delete', function () {
        var _this = this;
        utils.confirmModal({
            msg: "\u786E\u8BA4\u5220\u9664\u8BE5\u8BED\u6599\u5417?",
            cb: function (modal, btn) {
                var data = auditedTable.table.row($(_this).closest('tr')).data();
                var endLoading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
                    type: 'POST',
                    data: {
                        questionIds: data.questionId
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            auditedTable.refresh();
                            modal.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
    // audited-sidebar事件
    auditedSideBarEl.on('click', '.edit', function () {
        editCroups = [auditedCurrentData];
        auditedSideBar.hide();
        editType = 'auditedBatch';
        fillEditSidebar();
    });
    auditedSideBarEl.on('click', '.del', function () {
        utils.confirmModal({
            msg: "\u786E\u8BA4\u5220\u9664\u8BE5\u8BED\u6599\u5417?",
            cb: function (modal, btn) {
                var endLoading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
                    type: 'POST',
                    data: {
                        questionIds: auditedCurrentData.questionId
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            auditedSideBar.hide();
                            auditedTable.refresh();
                            modal.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    });
}
function initPreAuditedTable() {
    var tableEl = $('#pre-table');
    tableEl.DataTable(Object.assign(tables.commonConfig(), {
        // data: [
        //     { attachName: '文档1', filesize: '10k', hasGenerate: '已生成', uploadTime: '2017-03-01', id: 1 },
        //     { attachName: '文档2', filesize: '20k', hasGenerate: '未生成', uploadTime: '2017-03-10', id: 2 },
        //     { attachName: '文档3', filesize: '30k', hasGenerate: '已生成', uploadTime: '2017-04-01', id: 3 },
        //     { attachName: '文档4', filesize: '40k', hasGenerate: '未生成', uploadTime: '2016-11-01', id: 4 }
        // ],
        // serverSide: false,
        scrollY: tables.getTabsTableHeight($('#pre-audit-search-form')),
        select: false,
        ajax: {
            type: 'POST',
            url: 'knowledge/documentAnalysis/unverifyDocumentCorpus/list',
            dataSrc: function (data) { return data.rows; },
            data: function (d) {
                var time = $('#pre-form-date').val().split(' - '), data = {
                    questionKeyword: $('#pre-q').val().trim(),
                    answerKeyword: $('#pre-a').val().trim(),
                    documentKeyword: $('#pre-doc').val().trim(),
                    beginTime: time[0],
                    endTime: time[1],
                    keyword: $.trim($('#keywrods').val()),
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length
                };
                return utils.cleanObject(data);
            }
        },
        columns: [
            tables.getCheckboxColumnObj('answerId'),
            { data: 'literal', title: '问题', createdCell: tables.createAddTitle },
            { data: 'digest', title: '回复', createdCell: tables.createAddTitle },
            { data: 'documentTitle', title: '文档' },
            { data: 'classifyId', title: '类型', render: renderClassify },
            { data: 'updateTime', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
            { data: 'answerId', title: '操作', render: renderPreIcons }
        ],
        initComplete: function () {
            var t = tableEl.DataTable();
            preTable = new tables.Table(t);
            bindPreAuditedEvent();
        }
    }));
}
function renderClassify(id) {
    for (var _i = 0, _a = selectData.classify; _i < _a.length; _i++) {
        var i = _a[_i];
        if (i.id === id) {
            return i.name;
        }
    }
    return '';
}
function renderPushWay(id) {
    for (var _i = 0, _a = selectData.pushway; _i < _a.length; _i++) {
        var i = _a[_i];
        if (i.id === id) {
            return i.name;
        }
    }
    return '';
}
function renderCharacter(id) {
    for (var _i = 0, _a = selectData.character; _i < _a.length; _i++) {
        var i = _a[_i];
        if (i.id === id) {
            return i.name;
        }
    }
    return '';
}
function renderPreIcons(id) {
    return "\n    <i class=\"fa cloud-fa-icon fa-check-square-o pass\" title=\"\u5BA1\u6838\u901A\u8FC7\"></i>\n    <i class=\"fa cloud-fa-icon fa-edit edit\" title=\"\u7F16\u8F91\"></i>\n    <i class=\"fa cloud-fa-icon fa-eye view-detail\" title=\"\u67E5\u770B\"></i>\n    <i class=\"fa cloud-fa-icon fa-trash delete\" title=\"\u5220\u9664\"></i>\n    ";
}
function renderAuditedIcons(id) {
    return "\n    <i class=\"fa cloud-fa-icon fa-edit edit\" title=\"\u7F16\u8F91\"></i>\n    <i class=\"fa cloud-fa-icon fa-eye view-detail\" title=\"\u67E5\u770B\"></i>\n    <i class=\"fa cloud-fa-icon fa-trash delete\" title=\"\u5220\u9664\"></i>\n    ";
}
function initAuditedTable() {
    var tableEl = $('#audited-table');
    tableEl.DataTable(Object.assign(tables.commonConfig(), {
        // data: [
        //     { attachName: '文档1', filesize: '10k', hasGenerate: '已生成', uploadTime: '2017-03-01', id: 1 },
        //     { attachName: '文档2', filesize: '20k', hasGenerate: '未生成', uploadTime: '2017-03-10', id: 2 },
        //     { attachName: '文档3', filesize: '30k', hasGenerate: '已生成', uploadTime: '2017-04-01', id: 3 },
        //     { attachName: '文档4', filesize: '40k', hasGenerate: '未生成', uploadTime: '2016-11-01', id: 4 }
        // ],
        // serverSide: false,
        scrollY: tables.getTabsTableHeight($('#audited-search-form')),
        select: false,
        ajax: {
            type: 'POST',
            url: 'knowledge/documentAnalysis/verifiedDocumentCorpus/list',
            dataSrc: function (data) { return data.rows; },
            data: function (d) {
                var time = $('#audited-form-date').val().split(' - '), data = {
                    questionKeyword: $('#audited-q').val().trim(),
                    answerKeyword: $('#audited-a').val().trim(),
                    documentKeyword: $('#audited-doc').val().trim(),
                    beginTime: time[0],
                    endTime: time[1],
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length
                };
                return utils.cleanObject(data);
            }
        },
        initComplete: function () {
            var t = tableEl.DataTable();
            auditedTable = new tables.Table(t);
            bindAuditedEvent();
        },
        columns: [
            tables.getCheckboxColumnObj('answerId'),
            { data: 'literal', title: '问题' },
            { data: 'digest', title: '回复' },
            { data: 'documentTitle', title: '文档' },
            { data: 'classifyId', title: '类型', render: renderClassify },
            { data: 'updateTime', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
            { data: 'answerId', title: '操作', render: renderAuditedIcons }
        ]
    }));
}
function getIt() {
    if (window.getSelection) {
        return window.getSelection().toString();
    }
    else if (document.getSelection) {
        return document.getSelection().toString();
    }
    else {
        var selection = document.selection && document.selection.createRange();
        return selection.text;
    }
}


/***/ }),

/***/ 1123:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(537);


/***/ }),

/***/ 537:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(7);
var tables = __webpack_require__(13);
var review_1 = __webpack_require__(1048);
var upload_1 = __webpack_require__(30);
var daterangepicker_1 = __webpack_require__(21);
__webpack_require__(37);
__webpack_require__(920);
var kbyte = 1024;
var mbyte = 1048576;
var KnowledgeDocmentAnalysisIndex;
(function (KnowledgeDocmentAnalysisIndex) {
    $(init);
    function init() {
        initDocMgr();
        $('#pre-audit-tab').one('shown.bs.tab', review_1.initPreAudited);
        $('#audited-tab').one('shown.bs.tab', review_1.initAudited);
    }
    // 文档管理
    function initDocMgr() {
        var cdate = new utils.CommonDate({
            el: $('.doc-form-date')
        });
        // 填充下拉框数据
        var classify = new utils.Tree({
            el: $('#doc-classify'),
            data: utils.formatClassify(selectData.classify)
        });
        new daterangepicker_1.SimpleDate({
            el: $('#start-date')
        });
        new daterangepicker_1.SimpleDate({
            el: $('#end-date'),
            date: moment().add(5, 'year')
        });
        // 初始化表格
        var docMgrTable = $('#mgr-table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                type: 'POST',
                url: 'knowledge/attach/list',
                dataSrc: function (data) { return data.rows; },
                data: function (d) {
                    var time = $('#mgr-form-date').val().split(' - '), data = {
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length,
                        keyword: $.trim($('#doc-title').val()),
                        hasGenerate: $('#corpus-status').val(),
                        startDay: time[0],
                        endDay: time[1]
                    };
                    return utils.cleanObject(data);
                }
            },
            scrollY: tables.getTabsTableHeight($('#mgr-search-form')),
            initComplete: initDocMgrComplete,
            columns: [
                { data: 'attachName', title: '文档' },
                { data: 'filesize', title: '大小', render: renderSize },
                { data: 'hasGenerate', title: '生成语料状态', render: renderGene },
                { data: 'uploadTime', title: '更新时间', render: utils.renderSimpleTime },
                { data: 'id', title: '操作', render: renderDocOpt, className: 'prevent' }
            ]
        }));
        function renderSize(d) {
            if (d > mbyte) {
                return Math.floor(d * 100 / mbyte) / 100 + "MB";
            }
            else if (d > kbyte) {
                return Math.floor(d * 100 / kbyte) / 100 + "KB";
            }
            else {
                return d + "B";
            }
        }
        function renderGene(d) {
            if (d) {
                return '<span>已生成</span>';
            }
            else {
                return '<span style="color:red">未生成</span>';
            }
        }
        function renderDocOpt(data, type, row) {
            return "<div data-attachId=" + row.attachId + " class='doc-opt'>\n                            <a class='opt-update' id='#optu" + data + "' title='\u66F4\u65B0\u6587\u6863'><i class=\"fa fa-refresh\"></i></a>\n                            <a class='opt-view' id='#optv" + data + "' title='\u67E5\u770B\u6587\u6863' href='knowledge/attach/downDoc?attachId=" + row.attachId + "'><i class=\"fa fa-eye\"></i></a>\n                            <a class='opt-generate' id='#optg" + data + "' title='\u751F\u6210\u8BED\u6599'><img src='" + ctx + "/images/generate.png' width='17px' style='margin-top:-5px'/></a>\n                            <a class='opt-del' id='#optd" + data + "' title='\u5220\u9664\u6587\u6863'><i class=\"fa fa-trash\"></i></a>\n                        </div>";
        }
        function initDocMgrComplete() {
            var _this = this;
            var t = new tables.Table(docMgrTable);
            var upRoot = $('#upload-doc-modal');
            var generateRoot = $('#generate-modal');
            var generateSource; // 判断生成语料的情况来源。用于确定点击'生成'功能时，执行哪个后端接口（/generate或者/upload）
            var upParams; // 上传附加参数
            var upHasGenerated = false; // 是否生成语料的标志
            var upAttachId = ''; // upAttachId
            var clearStoredFilesLater = false; // 点击'上传并生成语料'后，该值改变，用于判断是否立即清除保存的文件，也可用于上传成功后关闭哪个模态框
            /*上传文档相关功能*/
            var $wrap = $('#info-wrap');
            var upFileId;
            var triggerEnd;
            var upload = new upload_1.DelayUpload({
                multiple: true,
                name: 'fileUpload',
                // application/vnd.ms-excel，application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                accept: '.txt,.doc,.docx,.pdf,.xls,.xlsx',
                url: 'knowledge/attach/upload',
                saveBtn: $('#upload-wrap'),
                onAllComplete: function () {
                    // utils.endLoadingBtn($('#only-upload'));
                    if (!clearStoredFilesLater) {
                        upRoot.modal('hide');
                    }
                    else {
                        generateRoot.modal('hide');
                    }
                    t.refresh();
                    $wrap.empty();
                    if (triggerEnd) {
                        triggerEnd();
                    }
                },
                save: function (id, name) {
                    if (upAttachId) {
                        upload.uploader.setItemLimit(1);
                    }
                    else {
                        upload.uploader.setItemLimit(100);
                    }
                    var el = $("<p><span id='info-name'>" + name + "</span>\n                                    <span aria-hidden='true' class='glyphicon glyphicon-trash info-del' data-fileId='" + id + "'></span></p>");
                    $wrap.append(el);
                    upFileId = $(_this).data('fileid');
                    el.find('.info-del').on('click', function () {
                        upload.uploader.cancel($(this).data('fileid'));
                        $(this).parent('p').remove();
                    });
                },
                success: function (msg) {
                    if (msg.error) {
                        utils.alertMessage(msg.msg, !msg.error);
                    }
                },
                cancel: function () {
                    $wrap.empty();
                }
            });
            utils.bindEnter($('#doc-title'), function () {
                docMgrTable.draw();
            });
            /*清空模态框（点击仅上传后，upRoot关闭后，清空upRoot;点击上传并生成语料后，点击生成后，generateRoot关闭后，清空upRoot和generateRoot;
            点击批量生成语料或者表格中的生成语料按钮后,generateRoot关闭后，清空generateRoot）*/
            clearModals();
            function clearModals() {
                upRoot.on('hide.bs.modal', function () {
                    if (!clearStoredFilesLater) {
                        upAttachId = '';
                        upload.cancel();
                        clearUpRoot();
                    }
                    else if (clearStoredFilesLater) {
                        clearUpRoot();
                    }
                });
                generateRoot.on('hide.bs.modal', function () {
                    if (testAjax) {
                        testAjax.abort();
                    }
                    if (!clearStoredFilesLater) {
                        clearGenerateRoot();
                    }
                    else if (clearStoredFilesLater) {
                        upAttachId = '';
                        upload.cancel();
                        clearGenerateRoot();
                        clearStoredFilesLater = false;
                    }
                });
            }
            // 清空upRoot
            function clearUpRoot() {
                $wrap.empty();
            }
            // 清空generateRoot
            function clearGenerateRoot() {
                classify.resetFirst();
                $('#select-character').val('');
                $('#select-pushway').val('');
                $('#start-date').val(moment().format('YYYY-MM-DD'));
                $('#end-date').val(moment().add(5, 'year').format('YYYY-MM-DD'));
            }
            // 上传文档按钮
            $('#upload-btn').on('click', function () {
                upRoot.modal('show');
            });
            // 表格中的更新文档
            $('#mgr-table').on('click', '.opt-update', function (e) {
                var data = docMgrTable.row($(e.currentTarget).closest('tr')).data();
                upAttachId = data.attachId;
                upRoot.modal('show');
            });
            // 判断是否有上传文件
            var submitedArr;
            var failedArr;
            function hasUploadFile() {
                submitedArr = upload.uploader.getUploads({
                    status: upload.qq.status.SUBMITTED
                });
                failedArr = upload.uploader.getUploads({
                    status: upload.qq.status.UPLOAD_FAILED
                });
            }
            // 仅上传
            $('#only-upload').on('click', function () {
                upParams = {
                    hasGenerate: false,
                    attachId: upAttachId
                };
                upload.uploader.setParams(upParams, upFileId);
                upload.uploadAllFile();
                hasUploadFile();
                if (submitedArr.concat(failedArr).length !== 0) {
                    triggerEnd = utils.loadingBtn($('#only-upload'));
                }
                // utils.loadingBtn($('#only-upload'));
            });
            // 上传并生成语料('上传并生成语料'为保存功能，'生成'为提交功能)
            var $uploadAndGenerateBtn = $('#upload-and-generate');
            $uploadAndGenerateBtn.on('click', function () {
                generateSource = 'upload';
                upHasGenerated = true;
                hasUploadFile();
                if (submitedArr.concat(failedArr).length === 0) {
                    utils.alertMessage('请先上传文档再生成语料！');
                    return;
                }
                else {
                    clearStoredFilesLater = true;
                    upRoot.modal('hide');
                    generateRoot.modal('show');
                }
            });
            /*生成语料相关功能*/
            var geAttachId; // 生成语料的attachId
            // 生成语料
            $('#mgr-table').on('click', '.opt-generate', function (e) {
                generateSource = 'generate';
                var data = docMgrTable.row($(e.currentTarget).closest('tr')).data();
                geAttachId = data.attachId;
                showGenerateRoot(data.hasGenerate, "\u8BE5\u6587\u6863\u5DF2\u751F\u6210\u8BED\u6599\uFF0C\u662F\u5426\u91CD\u65B0\u751F\u6210\uFF08\u91CD\u65B0\u751F\u6210\u4F1A\u5220\u9664\u73B0\u6709\u76F8\u5173\u8BED\u6599\uFF1F\uFF09", '重新生成');
            });
            // 批量生成语料
            $('#generate-btn').on('click', function () {
                generateSource = 'generate';
                var data = docMgrTable.rows({ selected: true }).data().toArray();
                if (data.length <= 0) {
                    utils.alertMessage('请选择要批量生成语料的文档');
                    return;
                }
                geAttachId = data.map(function (v) { return v.attachId; }).join(',');
                var count = 0;
                data.forEach(function (v) {
                    if (v.hasGenerate) {
                        count++;
                    }
                });
                showGenerateRoot((count > 0), "\u5DF2\u9009\u62E9\u7684\u6570\u636E\u5B58\u5728" + count + "\u6761\u6587\u6863\u5DF2\u751F\u6210\u8BED\u6599\uFF0C\u662F\u5426\u5168\u90E8\u91CD\u65B0\u751F\u6210\uFF08\u91CD\u65B0\u751F\u6210\u4F1A\u5220\u9664\u73B0\u6709\u76F8\u5173\u8BED\u6599\uFF1F\uFF09", '确定');
            });
            function showGenerateRoot(hasGenerate, msg, text) {
                if (hasGenerate) {
                    utils.confirmModal({
                        msg: msg,
                        cb: function (modal, btn) {
                            modal.modal('hide');
                            generateRoot.modal('show');
                        },
                        className: 'btn-primary',
                        text: text
                    });
                }
                else {
                    generateRoot.modal('show');
                }
            }
            // 生成语料（点击'生成'按钮，分为两种情况：单纯的生成语料和上传文档后的生成语料）
            var $generateCorpusBtn = $('#generate-modal-btn');
            var testAjax;
            function generateCorpus() {
                triggerEnd = utils.loadingBtn($generateCorpusBtn);
                // 校验不能为空
                var clId = classify.selected[0];
                var chId = $('#select-character').val();
                var pu = $('#select-pushway').val();
                var sd = $('#start-date').val();
                var ed = $('#end-date').val();
                var num = 0;
                var validateIsEmpty = function (val, name) {
                    if (!val) {
                        utils.alertMessage("\u8BF7\u9009\u62E9" + name + "\uFF01\uFF08" + name + "\u4E0D\u80FD\u4E3A\u7A7A\uFF09");
                        return;
                    }
                    ++num;
                };
                validateIsEmpty(clId, '类型');
                validateIsEmpty(chId, '角色');
                validateIsEmpty(pu, '渠道');
                validateIsEmpty(sd, '生效日期');
                validateIsEmpty(ed, '失效日期');
                if (num !== 5) {
                    triggerEnd();
                    return;
                }
                if (generateSource === 'generate') {
                    testAjax = $.ajax({
                        url: 'knowledge/attach/generate',
                        type: 'POST',
                        data: {
                            attachIds: geAttachId,
                            classifyId: clId,
                            characterId: chId,
                            pushway: pu,
                            startDay: sd,
                            endDay: ed
                        }
                    })
                        .done(function (res) {
                        if (!res.error) {
                            generateRoot.modal('hide');
                            t.refresh(true);
                            utils.alertMessage(res.msg, true);
                        }
                        else {
                            utils.alertMessage(res.msg);
                        }
                    })
                        .always(function () {
                        triggerEnd();
                    });
                }
                else if (generateSource === 'upload') {
                    // 上传并生成语料的生成：修改param值。
                    upParams = {
                        hasGenerate: upHasGenerated,
                        attachId: upAttachId,
                        classifyId: clId,
                        characterId: chId,
                        pushway: pu,
                        startDay: sd,
                        endDay: ed
                    };
                    upload.uploader.setParams(upParams, upFileId);
                    // debugger
                    upload.uploadAllFile();
                }
            }
            $generateCorpusBtn.on('click', function () {
                generateCorpus();
            });
            // 预览文件
            // $('#mgr-table').on('click', '.opt-view', (e) => {
            // 	const data: any = docMgrTable.row($(e.currentTarget).closest('tr')).data();
            // 	const id = data.attachId;
            // 	window.open('knowledge/attach/viewDoc?attachId=' + id);
            // });
            /*删除相关功能*/
            // 删除
            $('#mgr-table').on('click', '.opt-del', function (e) {
                var data = docMgrTable.row($(e.currentTarget).closest('tr')).data();
                var id = data.attachId;
                utils.confirmModal({
                    msg: "\u5220\u9664\u64CD\u4F5C\u4F1A\u5C06\u8BE5\u6587\u6863\u751F\u6210\u7684\u8BED\u6599\u4E00\u5E76\u5220\u9664\uFF0C\u60A8\u786E\u5B9A\u5220\u9664\u9009\u4E2D\u7684\u8BB0\u5F55\u5417\uFF1F",
                    cb: function (modal, btn) {
                        var endLoading = utils.loadingBtn(btn);
                        $.ajax({
                            url: 'knowledge/attach/delete',
                            type: 'GET',
                            data: {
                                attachIds: id
                            },
                            success: function (msg) {
                                if (!msg.error) {
                                    docMgrTable.ajax.reload(null, false);
                                    modal.modal('hide');
                                }
                                utils.alertMessage(msg.msg, !msg.error);
                            },
                            complete: function () {
                                endLoading();
                            }
                        });
                    }
                });
            });
            // 批量删除
            tables.delBtnClick({
                el: $('#del-btn'),
                table: docMgrTable,
                name: '文档（相应文档所生成的语料也会被一并删除）',
                url: 'knowledge/attach/delete',
                type: 'GET',
                param: 'attachIds',
                dataParam: 'attachId'
            });
            // 查询
            $('#mgr-search-btn').on('click', function () {
                t.refresh(true);
            });
            // 重置
            $('#mgr-reset-btn').on('click', function () {
                $('#doc-title').val('');
                $('#corpus-status').val('');
                cdate.resetDate();
                t.refresh(true);
            });
        }
    }
    /*// 待审核
    function initPreAudited() {
        //初始化表格
        let preTable;
        function initDataTables() {
            preTable = $('#pre-table').DataTable(
                Object.assign(
                    tables.commonConfig(),
                    {
                        ajax: {
                            type: 'POST',
                            url: 'knowledge/synonyms/list',
                            dataSrc: data => { return data.rows; },
                            data: (d: any) => {
                                const time = $('#pre-form-date').val().split(' - '),
                                    data = {
                                        page: Math.floor((d.start + d.length) / d.length),
                                        rows: d.length,
                                        beginTime: time[0],
                                        endTime: time[1],
                                        keyword: $.trim($('#keywrods').val())
                                    };
                                return utils.cleanObject(data);
                            }
                        },
                        initComplete: () => {

                        },
                        columns: [
                            { data: 'title', title: '问题' },
                            { data: 'size', title: '回复' },
                            { data: 'tsp', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
                            { data: 'id', title: '操作' }
                        ]
                    }));

            const t = new tables.Table(preTable);
            $('#pre-search-btn').on('click', function () {
                t.refresh(true);
            });
        }
    }
    // 已审核
    function initAudited() {
        //初始化表格
        let auditedTable;
        function initDataTables() {
            auditedTable = $('#audited-table').DataTable(
                Object.assign(
                    tables.commonConfig(),
                    {
                        ajax: {
                            type: 'POST',
                            url: 'knowledge/synonyms/list',
                            dataSrc: data => { return data.rows; },
                            data: (d: any) => {
                                const time = $('#audited-form-date').val().split(' - '),
                                    data = {
                                        page: Math.floor((d.start + d.length) / d.length),
                                        rows: d.length,
                                        beginTime: time[0],
                                        endTime: time[1],
                                        keyword: $.trim($('#keywrods').val())
                                    };
                                return utils.cleanObject(data);
                            }
                        },
                        initComplete: () => {

                        },
                        columns: [
                            { data: 'title', title: '问题' },
                            { data: 'size', title: '回复' },
                            { data: 'tsp', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
                            { data: 'id', title: '操作' }
                        ]
                    }));

            const t = new tables.Table(auditedTable);
            $('#audited-search-btn').on('click', function () {
                t.refresh(true);
            });
        }
    }*/
})(KnowledgeDocmentAnalysisIndex || (KnowledgeDocmentAnalysisIndex = {}));


/***/ }),

/***/ 920:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1123]);
//# sourceMappingURL=25.js.map