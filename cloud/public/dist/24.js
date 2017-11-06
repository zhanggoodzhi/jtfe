webpackJsonp([24],{

/***/ 1131:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(544);


/***/ }),

/***/ 123:
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
var utils_1 = __webpack_require__(5);
var CorpusUpdateSideBar = /** @class */ (function () {
    function CorpusUpdateSideBar(o) {
        var _default = {
            ifReview: false,
            title: '添加语料'
        };
        this.op = __assign({}, _default, o);
        this.init();
    }
    CorpusUpdateSideBar.prototype.init = function () {
        this.initSideBar();
    };
    CorpusUpdateSideBar.prototype.initSideBar = function () {
        var _this = this;
        this.sideBar = new utils_1.SideBar({
            title: 'xxx',
            content: '',
            onHide: function () {
                _this.sideBar.elements.wrap.find('iframe').remove();
            }
        });
    };
    CorpusUpdateSideBar.prototype.open = function (id, title, src) {
        var _this = this;
        var sideBarEl = this.sideBar.elements.wrap;
        sideBarEl.find('.sidebar-title').text(title);
        var iframeEl = document.createElement('iframe');
        if (src) {
            iframeEl.src = src;
        }
        else {
            var str = $.param(utils_1.cleanObject({
                type: this.op.ifReview ? 'review' : '',
                pairId: id ? id : ''
            }));
            iframeEl.src = "knowledge/corpusManage/update?" + str;
        }
        sideBarEl.find('.sidebar-content').append($(iframeEl));
        var endLoading = utils_1.addLoadingBg(sideBarEl.find('.sidebar-content'));
        iframeEl.onload = function () {
            if (endLoading) {
                endLoading();
            }
            iframeEl.contentWindow.jump = function (s) {
                window.open(s);
            };
            iframeEl.contentWindow.hideFn = function (res) {
                utils_1.alertMessage(res.msg, !res.error);
                if (!res.error) {
                    _this.sideBar.hide();
                    _this.op.hideFn();
                }
            };
        };
        this.sideBar.show();
    };
    return CorpusUpdateSideBar;
}());
exports.default = CorpusUpdateSideBar;


/***/ }),

/***/ 544:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
var new_table_1 = __webpack_require__(7);
__webpack_require__(36);
__webpack_require__(930);
var corpusUpdateSideBar_1 = __webpack_require__(123);
var upload_1 = __webpack_require__(30);
var addTable;
var auditTable;
var addCurrentData;
var addSideBar;
var reviewSideBar;
var endLoading;
var SettingCsIndex;
(function (SettingCsIndex) {
    $(init);
    function init() {
        checkHref();
        initAddTable();
        $('#server-group-tab').one('shown.bs.tab', function () {
            initAuditTable();
        });
        $('#server-acc-tab').on('shown.bs.tab', function () {
            addTable.reload();
        });
        $('#server-group-tab').on('shown.bs.tab', function () {
            auditTable.reload();
        });
        initSideBar();
    }
    function checkHref() {
        if (hrefType === '1') {
            $('#tablist a:last').tab('show');
        }
    }
    function initSideBar() {
        addSideBar = new corpusUpdateSideBar_1.default({
            ifReview: true,
            hideFn: function () {
                addTable.reload();
            }
        });
        reviewSideBar = new corpusUpdateSideBar_1.default({
            ifReview: true,
            hideFn: function () {
                auditTable.reload();
            }
        });
        // sideBar = new utils.SideBar({
        // 	id: 'language',
        // 	title: '添加语料',
        // 	content: '',
        // 	onHide: () => {
        // 		$('#language').find('iframe').remove();
        // 	}
        // });
    }
    function initAuditTable() {
        auditTable = new new_table_1.Table({
            el: $('#audit-table'),
            options: {
                paging: true,
                serverSide: true,
                ordering: true,
                order: [6, 'desc'],
                ajax: {
                    type: 'POST',
                    url: 'knowledge/rehearsalAudit/list',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var order;
                        for (var _i = 0, _a = d.order; _i < _a.length; _i++) {
                            var v = _a[_i];
                            if (v.column === 6) {
                                order = v.dir;
                            }
                        }
                        var data = {
                            confuseDegreeOrder: order,
                            confuseDegree: $('#audit-form .mix').val().trim(),
                            operation: $('#audit-form .suggest').val().trim(),
                            page: Math.floor((d.start + d.length) / d.length),
                            rows: d.length,
                            questionId: function () {
                                if (hrefId && hrefType === '1') {
                                    return hrefId;
                                }
                                return null;
                            }
                        };
                        return utils.cleanObject(data);
                    }
                },
                initComplete: bindAuditEvent,
                columns: [
                    // { data: 'rehearsalQuestionList', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowQCorpus },
                    // { data: 'question', title: '问题', createdCell: createAddTitle },
                    // {
                    // 	data: 'answer', title: '回复', createdCell: createAddTitle, render: (arr) => {
                    // 		return arr[0].content;
                    // 	}
                    // },
                    // { data: 'status', title: '状态', render: renderStatus },
                    // { data: 'classify', title: '类型', render: renderClassify },
                    // { data: 'updateTime', title: '更新时间', render: utils.renderCommonTime },
                    // { data: 'id', title: '操作', render: renderBtn },
                    { orderable: false, data: 'rehearsalQuestionList', title: '', width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowQCorpus },
                    { orderable: false, data: 'question', title: '问题', createdCell: new_table_1.createAddTitle },
                    {
                        orderable: false,
                        data: 'answer', title: '回复', createdCell: function (cell, cellData) {
                            $(cell).attr('title', cellData[0].content);
                        }, render: function (arr) {
                            return arr[0].content;
                        }
                    },
                    { orderable: false, data: 'confuseQuestion', title: '混淆问题', createdCell: new_table_1.createAddTitle },
                    { orderable: false, data: 'confuseAnswer', title: '混淆回复', createdCell: new_table_1.createAddTitle },
                    { data: 'confuseDegree', title: '混淆度', render: renderPercent },
                    { orderable: false, data: 'classify', title: '类型', render: renderClassify },
                    { orderable: false, data: 'confuseDegree', title: '操作建议', render: renderSuggest },
                    { orderable: false, data: 'id', title: '操作', className: 'prevent', width: '162', render: renderAuditBtn }
                ]
            },
            checkbox: {
                data: ''
            }
        });
    }
    function renderPercent(num) {
        if (num === null) {
            return '';
        }
        return num + '%';
    }
    function renderSuggest(num) {
        if (num === null) {
            return '';
        }
        if (num <= 50) {
            return '审核通过';
        }
        if (num > 50 && num < 70) {
            return '无建议';
        }
        if (num > 70 && num < 90) {
            return '合并/编辑/删除';
        }
        if (num >= 90) {
            return '合并通过';
        }
        return '';
    }
    function bindAuditEvent() {
        if (hrefId && hrefType === '1') {
            hrefId = null;
        }
        var dt = auditTable.dt;
        var formEl = $('#audit-form');
        // $('#language').on('auditSave', function () {
        // 	sideBar.hide();
        // 	// $('#iframe-modal').modal('hide');
        // 	auditTable.reload();
        // });
        formEl.find('.reply-search').on('click', function () {
            auditTable.reload(true);
        });
        formEl.find('.reply-reset').on('click', function () {
            formEl.find('.mix').val('0');
            formEl.find('.suggest').val('0');
        });
        formEl.find('.reply-audit').on('click', function () {
            var selected = auditTable.selected;
            if (!selected.length) {
                utils.alertMessage('请先选择一条复述句', false);
                return;
            }
            var ids = selected.map(function (v) {
                return v.questionId;
            });
            utils.confirmModal({
                msg: '确认批量审核选中的复述句吗?',
                text: '审核通过',
                className: 'btn-success',
                cb: function (modal, delSubmitBtn) {
                    var endloading = utils.loadingBtn(delSubmitBtn);
                    $.ajax({
                        type: 'POST',
                        url: 'knowledge/rehearsalAudit/auditPass',
                        data: {
                            ids: ids.join(',')
                        }
                    }).done(function (msg) {
                        if (!msg.error) {
                            utils.alertMessage(msg.msg, !msg.error);
                            modal.modal('hide');
                            auditTable.reload();
                        }
                        else {
                            utils.alertMessage(msg.msg, !msg.error);
                        }
                    }).always(function () {
                        endloading();
                    });
                }
            });
        });
        formEl.find('.reply-delete').on('click', function () {
            var selected = auditTable.selected;
            if (!selected.length) {
                utils.alertMessage('请先选择一条复述句', false);
                return;
            }
            var ids = selected.map(function (v) {
                return v.questionId;
            });
            utils.confirmModal({
                msg: '确认批量删除选中的复述句吗?',
                cb: function (modal, delSubmitBtn) {
                    var endloading = utils.loadingBtn(delSubmitBtn);
                    $.ajax({
                        type: 'POST',
                        url: 'knowledge/rehearsalAudit/batchDelete',
                        data: {
                            ids: ids.join(',')
                        }
                    }).done(function (msg) {
                        if (!msg.error) {
                            utils.alertMessage(msg.msg, !msg.error);
                            modal.modal('hide');
                            auditTable.reload();
                        }
                        else {
                            utils.alertMessage(msg.msg, !msg.error);
                        }
                    }).always(function () {
                        endloading();
                    });
                }
            });
        });
        formEl.on('click', '.reply-output', function () {
            utils.alertMessage('正在生成文件', 'success');
            var data = utils.cleanObject({
                confuseDegree: $('#audit-form .mix').val().trim(),
                operation: $('#audit-form .suggest').val().trim()
            });
            var str = '';
            for (var i in data) {
                str += '&' + i + '=' + encodeURI(data[i]);
            }
            if (str !== '') {
                str = '?' + str.slice(1);
            }
            location.href = ctx + "/knowledge/rehearsalAudit/exportExcel" + name + str;
        });
        dt.on('click', '.show-corpus-td.show-q-corpus', function (e) {
            var el = $(e.target).closest('td');
            var data = auditTable.dt.row(el).data();
            showAuditedCorpus(el, data);
        });
        dt.on('click', '.fa-check-square-o', function () {
            var id = $(this).data().id;
            $.ajax({
                type: 'POST',
                url: 'knowledge/rehearsalAudit/auditPass',
                data: {
                    ids: id
                }
            }).done(function (msg) {
                if (!msg.error) {
                    utils.alertMessage(msg.msg, !msg.error);
                    auditTable.reload();
                }
                else {
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
        dt.on('click', '.fa-check', function () {
            var id = $(this).data().id;
            $.ajax({
                type: 'POST',
                url: 'knowledge/rehearsalAudit/mergePass',
                data: {
                    id: id
                }
            }).done(function (msg) {
                if (!msg.error) {
                    utils.alertMessage(msg.msg, !msg.error);
                    auditTable.reload();
                }
                else {
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
        dt.on('click', '.fa-edit', function () {
            var id = $(this).data().id;
            reviewSideBar.open(id, '编辑语料');
            // changeIframeSideBar('audit', '编辑语料', `knowledge/corpusManage/update?type=review&pairId=${id}`);
            // const sideBarEl = $('#language');
            // sideBarEl.attr('data-type', 'audit').find('iframe').attr('src', `knowledge/corpusManage/update?type=review&pairId=${id}`);
            // sideBarEl.find('.sidebar-title').text('编辑语料');
            // sideBar.show();
            // $('#iframe-modal').modal('show');
        });
        // $('#iframe-modal').on('hide.bs.modal', () => {
        // 	$('#iframe-modal').find('iframe').attr('src', 'knowledge/corpusManage/update');
        // });
        dt.on('click', '.fa-trash', function () {
            var id = $(this).data().id;
            utils.confirmModal({
                msg: '确认删除选中的复述句吗?',
                cb: function (modal, delSubmitBtn) {
                    var endloading = utils.loadingBtn(delSubmitBtn);
                    $.ajax({
                        type: 'POST',
                        url: 'knowledge/rehearsalAudit/delete',
                        data: {
                            id: id
                        }
                    }).done(function (msg) {
                        if (!msg.error) {
                            utils.alertMessage(msg.msg, !msg.error);
                            modal.modal('hide');
                            auditTable.reload();
                        }
                        else {
                            utils.alertMessage(msg.msg, !msg.error);
                        }
                    }).always(function () {
                        endloading();
                    });
                }
            });
        });
    }
    function renderAuditBtn(id, status, rowData) {
        var merge = rowData.confuseQuestion ? "<i title=\"\u5408\u5E76\u901A\u8FC7\" data-id=\"" + rowData.questionId + "\" class=\"add-icon cloud-fa-icon fa fa-check\"></i>" : '';
        return "\n\t\t\t<i title=\"\u5BA1\u6838\u901A\u8FC7\" data-id=\"" + rowData.questionId + "\" class=\"cloud-fa-icon fa fa-check-square-o\"></i>\n\t\t\t" + merge + "\n\t\t\t<i title=\"\u7F16\u8F91\" data-id=\"" + id + "\" class=\"cloud-fa-icon fa fa-edit\"></i>\n\t\t\t<i title=\"\u5220\u9664\" data-id=\"" + rowData.questionId + "\" class=\"cloud-fa-icon fa fa-trash\"></i>\n\t\t";
    }
    // function changeIframeSideBar(type, text, src) {
    // 	const sideBarEl = $('#language');
    // 	sideBarEl.attr('data-type', type);
    // 	sideBarEl.find('.sidebar-title').text(text);
    // 	const iframeEl = document.createElement('iframe');
    // 	iframeEl.src = src;
    // 	iframeEl.onload = function () {
    // 		if (endLoading) {
    // 			endLoading();
    // 		}
    // 	};
    // 	$('#language .sidebar-content').append($(iframeEl));
    // 	endLoading = utils.addLoadingBg(sideBarEl.find('.sidebar-content'));
    // 	sideBar.show();
    // }
    function initAddTable() {
        addTable = new new_table_1.Table({
            el: $('#add-table'),
            options: {
                paging: true,
                serverSide: true,
                ajax: {
                    type: 'POST',
                    url: 'knowledge/rehearsalReview/list',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var data = {
                            question: $('#add-form .question').val().trim(),
                            answer: $('#add-form .reply').val().trim(),
                            status: $('#add-form .status').val().trim(),
                            page: Math.floor((d.start + d.length) / d.length),
                            rows: d.length,
                            questionId: function () {
                                if (hrefId && hrefType === '0') {
                                    return hrefId;
                                }
                                return null;
                            }
                        };
                        return utils.cleanObject(data);
                    }
                },
                // data: [{
                // 	word: 1,
                // 	createTime: 2,
                // 	updateTime: 3
                // }],
                initComplete: bindAddEvent,
                columns: [
                    { data: 'rehearsalQuestionList', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowQCorpus },
                    { data: 'question', title: '问题', createdCell: new_table_1.createAddTitle },
                    {
                        data: 'answer', title: '回复', createdCell: function (cell, cellData) {
                            $(cell).attr('title', cellData[0].content);
                        }, render: function (arr) {
                            return arr[0].content;
                        }
                    },
                    { data: 'status', title: '状态', render: renderStatus },
                    { data: 'classify', title: '类型', render: renderClassify },
                    { data: 'updateTime', title: '更新时间', render: utils.renderCommonTime },
                    { data: 'id', title: '操作', className: 'prevent', render: renderBtn }
                ]
            },
            checkbox: {
                data: ''
            }
        });
    }
    function renderStatus(status) {
        if (status === 0) {
            return '未提交';
        }
        else {
            return '待审核';
        }
    }
    function renderBtn(id, status, rowData) {
        var auditIcon = rowData.status === 0 ? "<i title=\"\u63D0\u4EA4\u5BA1\u6838\" data-id=\"" + id + "\" class=\"cloud-fa-icon fa fa-external-link\"></i>" : '';
        return "\n\t\t\t" + auditIcon + "\n\t\t\t<i title=\"\u6DFB\u52A0\u76F8\u4F3C\u95EE\u6CD5\" data-id=\"" + id + "\" class=\"add-icon cloud-fa-icon fa fa-plus-square\"></i>\n\t\t\t<i title=\"\u7F16\u8F91\" data-id=\"" + id + "\" class=\"cloud-fa-icon fa fa-edit\"></i>\n\t\t\t<i title=\"\u5220\u9664\" data-id=\"" + rowData.questionId + "\" class=\"cloud-fa-icon fa fa-trash\"></i>\n\t\t";
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
    function createShowQCorpus(td, cellDatA, rowData) {
        var el = $(td);
        if (cellDatA.length) {
            el.addClass('show-corpus-td')
                .data('id', rowData.id)
                .icon();
        }
        else {
            el.addClass('disabled')
                .icon();
        }
    }
    function bindAddEvent() {
        if (hrefId && hrefType === '0') {
            hrefId = null;
        }
        var formEl = $('#add-form');
        var dt = addTable.dt;
        var modalEl = $('#add-modal');
        var delBtn = $('#delete-submit-btn');
        var uploadBtn = $('#upload-submit-btn');
        var upload = new upload_1.DelayUpload({
            accept: '.xls,xlsx',
            name: 'file',
            url: 'knowledge/rehearsalReview/uploadExcel',
            saveBtn: $('#upload-wrap'),
            submitBtn: uploadBtn,
            save: function (id, name) {
                $('#info-wrap').show();
                $('#info-name').text(name);
            },
            success: function (msg) {
                if (!msg.error) {
                    utils.alertMessage(msg.msg, msg.code, false);
                    addTable.reload();
                    $('#upload').modal('hide');
                    $('#info-wrap').hide();
                    $('#info-name').text('');
                }
            },
            cancel: function () {
                $('#info-wrap').hide();
                $('#info-name').text('');
            }
        });
        // $('#language').on('addSave', function () {
        // 	sideBar.hide();
        // 	// $('#iframe-modal').modal('hide');
        // 	addTable.reload();
        // });
        $('#upload').on('hide.bs.modal', function () {
            upload.cancel();
        });
        formEl.find('.reply-search').on('click', function () {
            addTable.reload(true);
        });
        formEl.find('.reply-batch-upload').on('click', function () {
            $('#upload').modal('show');
        });
        formEl.find('.reply-add').on('click', function () {
            addSideBar.open(null, '添加语料');
            // changeIframeSideBar('add', '添加语料', 'knowledge/corpusManage/update?type=review');
            // sideBar.show();
            // $('#language').attr('data-type', 'add').find('.sidebar-title').text('添加语料');
            // $('#iframe-modal').attr('data-type', 'add').modal('show');
        });
        formEl.find('.reply-audit').on('click', function () {
            var selected = addTable.selected;
            if (!selected.length) {
                utils.alertMessage('请先选择一条复述句', false);
                return;
            }
            var ids = selected.map(function (v) {
                return v.id;
            });
            utils.confirmModal({
                msg: '确认批量审核选中的复述句吗?',
                text: '确定',
                className: 'btn-success',
                cb: function (modal, delSubmitBtn) {
                    var endloading = utils.loadingBtn(delSubmitBtn);
                    $.ajax({
                        type: 'POST',
                        url: 'knowledge/rehearsalReview/toMoreVerify',
                        data: {
                            ids: ids.join(',')
                        }
                    }).done(function (msg) {
                        if (!msg.error) {
                            utils.alertMessage(msg.msg, !msg.error);
                            modal.modal('hide');
                            addTable.reload();
                        }
                        else {
                            utils.alertMessage(msg.msg, !msg.error);
                        }
                    }).always(function () {
                        endloading();
                    });
                }
            });
        });
        formEl.on('click', '.reply-output', function () {
            utils.alertMessage('正在生成文件', 'success');
            var data = utils.cleanObject({
                question: $('#add-form .question').val().trim(),
                answer: $('#add-form .reply').val().trim(),
                status: $('#add-form .status').val().trim()
            });
            var str = '';
            for (var i in data) {
                str += '&' + i + '=' + encodeURI(data[i]);
            }
            if (str !== '') {
                str = '?' + str.slice(1);
            }
            location.href = ctx + "/knowledge/rehearsalReview/exportExcel" + name + str;
        });
        formEl.find('.reply-delete').on('click', function () {
            var selected = addTable.selected;
            if (!selected.length) {
                utils.alertMessage('请先选择一条复述句', false);
                return;
            }
            var ids = selected.map(function (v) {
                return v.questionId;
            });
            utils.confirmModal({
                msg: '确认批量删除选中的复述句吗?',
                cb: function (modal, delSubmitBtn) {
                    var endloading = utils.loadingBtn(delSubmitBtn);
                    $.ajax({
                        type: 'POST',
                        url: 'knowledge/rehearsalReview/deleteAllQuestion',
                        data: {
                            questionIds: ids.join(',')
                        }
                    }).done(function (msg) {
                        if (!msg.error) {
                            utils.alertMessage(msg.msg, !msg.error);
                            modal.modal('hide');
                            addTable.reload();
                        }
                        else {
                            utils.alertMessage(msg.msg, !msg.error);
                        }
                    }).always(function () {
                        endloading();
                    });
                }
            });
        });
        dt.on('click', '.fa-external-link', function () {
            var id = $(this).data().id;
            $.ajax({
                type: 'POST',
                url: 'knowledge/rehearsalReview/toVerify',
                data: {
                    id: id
                }
            }).done(function (msg) {
                if (!msg.error) {
                    utils.alertMessage(msg.msg, !msg.error);
                    addTable.reload();
                }
                else {
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
        dt.on('click', '.fa-edit', function () {
            // debugger;
            var id = $(this).data().id;
            addSideBar.open(id, '编辑语料');
            // changeIframeSideBar('add', '编辑语料', `knowledge/corpusManage/update?type=review&pairId=${id}`);
            // const sideBarEl = $('#language');
            // sideBarEl.attr('data-type', 'add').find('iframe').attr('src', `knowledge/corpusManage/update?type=review&pairId=${id}`);
            // sideBarEl.find('.sidebar-title').text('编辑语料');
            // sideBar.show();
            // $('#iframe-modal').find('iframe').attr('data-type', 'add').attr('src', `knowledge/corpusManage/update?type=review&pairId=${id}`);
            // $('#iframe-modal').modal('show');
        });
        // $('#iframe-modal').on('hide.bs.modal', () => {
        // 	$('#iframe-modal').find('iframe').attr('src', 'knowledge/corpusManage/update?type=review');
        // });
        dt.on('click', '.fa-trash', function () {
            var id = $(this).data().id;
            utils.confirmModal({
                msg: '确认删除选中的复述句吗?',
                cb: function (modal, delSubmitBtn) {
                    var endloading = utils.loadingBtn(delSubmitBtn);
                    $.ajax({
                        type: 'POST',
                        url: 'knowledge/rehearsalReview/deleteQuestion',
                        data: {
                            questionId: id
                        }
                    }).done(function (msg) {
                        if (!msg.error) {
                            utils.alertMessage(msg.msg, !msg.error);
                            modal.modal('hide');
                            addTable.reload();
                        }
                        else {
                            utils.alertMessage(msg.msg, !msg.error);
                        }
                    }).always(function () {
                        endloading();
                    });
                }
            });
        });
        dt.on('click', '.show-corpus-td.show-q-corpus', function (e) {
            var el = $(e.target).closest('td');
            var data = addTable.dt.row(el).data();
            showQCorpus(el, data);
        });
        dt.on('click', '.add-icon', function () {
            modalEl.modal('show');
            addCurrentData = addTable.dt.row($(this).closest('td')).data();
            modalEl.find('.standard').val(addCurrentData.question);
            for (var _i = 0, _a = addCurrentData.rehearsalQuestionList; _i < _a.length; _i++) {
                var v = _a[_i];
                addRepeatQuestion(v.content);
            }
        });
        modalEl.find('.add-repeat').on('click', function () {
            if (!vadilate(modalEl.find('.repeat'))) {
                return;
            }
            var masterQuestion = modalEl.find('.standard').val().trim();
            var slaveQuestion = modalEl.find('.repeat').val().trim();
            // addRepeatQuestion(modalEl.find('.repeat').val().trim());
            $.ajax({
                type: 'POST',
                url: 'knowledge/rehearsalReview/isSimilarity',
                data: {
                    masterQuestion: masterQuestion,
                    slaveQuestion: slaveQuestion
                }
            }).done(function (msg) {
                if (!msg.error) {
                    addRepeatQuestion(slaveQuestion);
                    modalEl.find('.repeat').val('');
                }
                utils.alertMessage(msg.msg, !msg.error);
            });
        });
        modalEl.on('click', '.add-edit', function () {
            $(this).siblings('input').prop('readonly', false).focus();
        });
        modalEl.on('keypress', '.more-repeat', function (e) {
            var _this = this;
            if (e.keyCode !== 13) {
                return;
            }
            if (!vadilate($(this))) {
                $(this).focus();
                return;
            }
            var masterQuestion = modalEl.find('.standard').val().trim();
            var slaveQuestion = $(this).val().trim();
            $.ajax({
                type: 'POST',
                url: 'knowledge/rehearsalReview/isSimilarity',
                data: {
                    masterQuestion: masterQuestion,
                    slaveQuestion: slaveQuestion
                }
            }).done(function (msg) {
                if (!msg.error) {
                    utils.alertMessage(msg.msg, !msg.error);
                    $(_this).prop('readonly', true);
                }
                else {
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
        modalEl.on('blur', '.more-repeat', function () {
            var _this = this;
            if (!vadilate($(this))) {
                $(this).focus();
                return;
            }
            var masterQuestion = modalEl.find('.standard').val().trim();
            var slaveQuestion = $(this).val().trim();
            $.ajax({
                type: 'POST',
                url: 'knowledge/rehearsalReview/isSimilarity',
                data: {
                    masterQuestion: masterQuestion,
                    slaveQuestion: slaveQuestion
                }
            }).done(function (msg) {
                if (!msg.error) {
                    utils.alertMessage(msg.msg, !msg.error);
                    $(_this).prop('readonly', true);
                }
                else {
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
        modalEl.on('click', '.add-delete', function () {
            $(this).closest('.form-group').remove();
        });
        modalEl.on('hide.bs.modal', function () {
            modalEl.find('.more-repeat').each(function (i, e) {
                $(e).closest('.form-group').remove();
            });
            modalEl.find('.repeat').val('');
        });
        modalEl.find('#add-save').on('click', function () {
            var flag = false;
            modalEl.find('.more-repeat').each(function (i, e) {
                if (e === document.activeElement) {
                    flag = true;
                }
            });
            if (flag) {
                return;
            }
            var childQuestionList = [];
            modalEl.find('.more-repeat').each(function (i, e) {
                childQuestionList.push({
                    content: $(e).val().trim()
                });
            });
            var endloading = utils.loadingBtn($(this));
            $.ajax({
                type: 'POST',
                url: 'knowledge/rehearsalReview/updateQuestion',
                contentType: 'application/json',
                data: JSON.stringify({
                    childQuestionList: childQuestionList,
                    questionId: addCurrentData.questionId,
                    question: addCurrentData.question
                })
            }).done(function (msg) {
                if (!msg.error) {
                    utils.alertMessage(msg.msg, !msg.error);
                    endloading();
                    addTable.reload();
                    modalEl.modal('hide');
                }
                else {
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
    }
    function vadilate(el) {
        var modalEl = $('#add-modal');
        var masterQuestion = modalEl.find('.standard').val().trim();
        var slaveQuestion = el.val().trim();
        var flag = false;
        if (masterQuestion === slaveQuestion) {
            utils.alertMessage('标准问法不能与复述问法相同');
            return false;
        }
        el.closest('.form-group').siblings().each(function (i, e) {
            if ($(e).find('input').is(el)) {
                return;
            }
            if ($(e).find('input').is('.repeat')) {
                return;
            }
            if ($(e).find('input').val().trim() === slaveQuestion) {
                flag = true;
                utils.alertMessage('复述问法不能重复');
                return;
            }
        });
        if (flag) {
            return false;
        }
        if (slaveQuestion === '') {
            utils.alertMessage('复述问法不能为空');
            return false;
        }
        return true;
    }
    function addRepeatQuestion(slaveQuestion) {
        $('#add-modal .form-horizontal').append("\n\t\t\t<div class=\"form-group\"><label class=\"cloud-input-title\"></label><div class=\"cloud-input-content\"><input value=\"" + slaveQuestion + "\" readonly class=\"more-repeat form-control input-sm\" type=\"text\"><i class=\"cloud-fa-icon fa fa-edit add-edit\"></i><i class=\"cloud-fa-icon fa fa-trash add-delete\"></i></div></div>\n\t\t");
    }
    function showAuditedCorpus(el, data) {
        var icon = el.icon();
        var id = data.id;
        if (icon.state === utils.IconState.plus) {
            for (var _i = 0, _a = data.rehearsalQuestionList; _i < _a.length; _i++) {
                var v = _a[_i];
                var tr = $("<tr class=\"cps-details\">\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td>" + v.content + "</td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<i title=\"\u5408\u5E76\u901A\u8FC7\" data-id=\"" + v.id + "\" class=\"add-icon cloud-fa-icon fa fa-check\"></i>\n\t\t\t\t\t\t\t<i title=\"\u7F16\u8F91\" data-id=\"" + id + "\" class=\"cloud-fa-icon fa fa-edit\"></i>\n\t\t\t\t\t\t\t<i title=\"\u5220\u9664\" data-id=\"" + v.id + "\" class=\"cloud-fa-icon fa fa-trash\"></i>\n\t\t\t\t\t\t</td>\n                \t</tr>");
                el.closest('tr').after(tr);
            }
            icon.state = utils.IconState.minus;
            return;
        }
        $('.cps-details').remove();
        icon.state = utils.IconState.plus;
    }
    function showQCorpus(el, data) {
        var icon = el.icon();
        var id = data.id;
        if (icon.state === utils.IconState.plus) {
            for (var _i = 0, _a = data.rehearsalQuestionList; _i < _a.length; _i++) {
                var v = _a[_i];
                var tr = $("<tr class=\"cps-details\">\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td>" + v.content + "</td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<i title=\"\u7F16\u8F91\" data-id=\"" + id + "\" class=\"cloud-fa-icon fa fa-edit\"></i>\n\t\t\t\t\t\t\t<i title=\"\u5220\u9664\" data-id=\"" + v.id + "\" class=\"cloud-fa-icon fa fa-trash\"></i>\n\t\t\t\t\t\t</td>\n                \t</tr>");
                el.closest('tr').after(tr);
            }
            icon.state = utils.IconState.minus;
            return;
        }
        $('.cps-details').remove();
        icon.state = utils.IconState.plus;
    }
})(SettingCsIndex || (SettingCsIndex = {}));


/***/ }),

/***/ 930:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1131]);
//# sourceMappingURL=24.js.map