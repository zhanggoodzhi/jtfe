webpackJsonp([63],{

/***/ 1112:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(526);


/***/ }),

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var tables = __webpack_require__(7);
var ntables = __webpack_require__(13);
var utils = __webpack_require__(5);
var tables_1 = __webpack_require__(13);
__webpack_require__(36);
__webpack_require__(909);
var upload_1 = __webpack_require__(30);
var param = {
    path: 'keyword',
    listParam: 'keyword',
    wordName: '关键词',
    addParam: 'word',
    delType: 'POST'
};
var table, side, gainTable, gainTableEl, gainTableD, innerSaveFlag = false;
var KnowledgeKeyword;
(function (KnowledgeKeyword) {
    $(init);
    function init() {
        initTable();
        initSider();
        initGainTable();
        bindEvents();
    }
    function initTable() {
        var tname = param.wordName;
        table = new tables.Table({
            el: $('#key-table'),
            options: {
                serverSide: true,
                paging: true,
                ajax: {
                    type: 'POST',
                    url: param.path + '/list',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var data = {
                            page: tables_1.getPage(d),
                            rows: d.length,
                            source: $('#source').val()
                        };
                        data[param.listParam] = $('#keyword').val();
                        return utils_1.cleanObject(data);
                    }
                },
                columns: [
                    { data: 'word', title: tname },
                    { data: 'createTime', title: '创建时间', render: utils.renderCommonTime, width: ntables.VARIABLES.width.commonTime },
                    { data: 'updateTime', title: '修改时间', render: utils.renderCommonTime, width: ntables.VARIABLES.width.commonTime }
                ],
                initComplete: initComplete
            }
        });
    }
    function initComplete() {
        var tableD = $('#key-table').DataTable();
        ntables.bindPageChange(tableD);
        var name = param.wordName;
        tables_1.delBtnClick({
            table: tableD,
            url: param.path + '/delete',
            name: name,
            type: param.delType,
            el: $('#del-btn')
        });
        var uploadBtn = $('#upload-submit-btn');
        var upload = new upload_1.DelayUpload({
            accept: '.xls,xlsx',
            url: param.path + '/batchupload',
            name: 'uploadedFile',
            saveBtn: $('#upload-wrap'),
            submitBtn: uploadBtn,
            save: function (id, fileName) {
                $('#info-wrap').show();
                $('#info-name').text(fileName);
            },
            success: function (msg) {
                if (!msg.error) {
                    utils_1.alertMessage(msg.msg, msg.code, false);
                    $('#upload').modal('hide');
                    table.reload();
                    $('#info-wrap').hide();
                    $('#info-name').text('');
                }
            },
            cancel: function () {
                $('#info-wrap').hide();
                $('#info-name').text('');
            }
        });
        $('#upload').on('hide.bs.modal', function () {
            upload.cancel();
        });
        $('#batch-upload-btn').on('click', function () {
            $('#upload').modal('show');
        });
        $('#add-btn').on('click', function () {
            $('#add-modal').modal('show');
            $('#add-word').val('');
        });
        $('#add-modal').on('shown.bs.modal', function () {
            $('#add-word').focus();
        });
        $('#add-submit').on('click', function () {
            var val = $.trim($('#add-word').val());
            if (val === '') {
                utils_1.alertMessage(name + "\u4E0D\u80FD\u4E3A\u7A7A");
            }
            else {
                var loading_1 = utils_1.loadingBtn($('#add-submit'));
                var data = {};
                data[param.addParam] = $('#add-word').val();
                $.ajax({
                    type: 'POST',
                    url: param.path + '/add',
                    data: data,
                    success: function (msg) {
                        if (!msg.error) {
                            $('#add-modal').modal('hide');
                            table.reload();
                        }
                        utils_1.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        loading_1();
                    }
                });
            }
        });
        $('#edit-btn').on('click', function () {
            var data = tableD.rows({ selected: true }).data();
            if (data.length < 1) {
                utils_1.alertMessage("\u8BF7\u9009\u62E9\u8981\u7F16\u8F91\u7684" + name);
            }
            else if (data.length > 1) {
                utils_1.alertMessage("\u53EA\u80FD\u7F16\u8F91\u4E00\u4E2A" + name);
            }
            else {
                var currentData = data[0];
                $('#edit-modal').modal('show');
                $('#edit-modal-content').html("<div class='form-group'>\n\t\t\t\t\t\t<label>\u539F" + name + "</label>\n\t\t\t\t\t\t<p class='form-control-static' title='" + currentData.word + "'>" + currentData.word + "</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='form-group'>\n\t\t\t\t\t\t<label>\u4FEE\u6539\u4E3A</label>\n\t\t\t\t\t\t<input type='text' class='form-control' data-id='" + currentData.id + "' value='" + currentData.word + "' data-old='" + currentData.word + "' maxlength='50'>\n\t\t\t\t\t</div>");
                $('#edit-modal-content input:first').select();
            }
        });
        $('#edit-submit').on('click', function () {
            if (!innerSaveFlag) {
                var data_1 = [];
                Array.prototype.forEach.call($('#edit-modal-content input'), function (v) {
                    var el = $(v), val = $.trim(el.val());
                    if (val === el.attr('data-old')) {
                        return;
                    }
                    data_1.push({
                        id: el.data('id'),
                        name: val
                    });
                });
                if (data_1.length < 1) {
                    utils_1.alertMessage("\u672A\u4FEE\u6539" + name + "\u6216\u6240\u6709" + name + "\u4E3A\u7A7A");
                }
                else if (data_1[0].name.length > 255) {
                    utils_1.alertMessage(name + "\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7255\u4E2A\u5B57\u7B26");
                    return;
                }
                else {
                    var loading_2 = utils_1.loadingBtn($('#edit-submit'));
                    $.ajax({
                        url: param.path + '/update',
                        type: 'POST',
                        data: JSON.stringify({ 'data': data_1 }),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        success: function (msg) {
                            if (!msg.error) {
                                $('#edit-modal').modal('hide');
                                table.reload();
                            }
                            utils_1.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            loading_2();
                        }
                    });
                }
            }
        });
        $('#search-btn').on('click', function () {
            table.reload();
        });
        utils_1.bindEnter($('#keyword'), function () {
            table.reload();
        });
        utils_1.bindEnter($('#edit-modal'), function () {
            $('#edit-submit').click();
        }, 'input');
        utils_1.bindEnter($('#add-modal'), function () {
            $('#add-submit').click();
        }, 'input');
        tables_1.bindPageChange(tableD, $('#page-change'));
    }
    var $gainKey;
    var $import;
    var $importAll;
    var $clearBtn;
    var $btns = [];
    var $oBtns = [];
    function initSider() {
        side = new utils.SideBar({
            id: 'gain',
            title: '自动获取关键词',
            content: "<div>\n\t\t\t\t\t\t<div class='form-group'>\n\t\t\t\t\t\t\t<button class='btn btn-primary btn-sm' type='button' disabled='true' id='gainKey'>\u83B7\u53D6\u5173\u952E\u8BCD</button>\n\t\t\t\t\t\t\t<button class='btn btn-primary btn-sm' type='button' disabled='true' id='import' style='display:none'>\u786E\u8BA4\u5BFC\u5165</button>\n\t\t\t\t\t\t\t<button class='btn btn-primary btn-sm' type='button' id='importAll' style='display:none'>\u5168\u90E8\u5BFC\u5165</button>\n\t\t\t\t\t\t\t<button class='btn btn-danger btn-sm' type='button' id='clearBtn'>\u6E05\u7A7A\u5217\u8868</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<table class='table fixed-table' id='gain-table'></table>\n\t\t\t\t\t</div>",
            onShow: function () {
                isGenDone();
                if (gainTableLength) {
                    $('#import').css('display', 'inline-block');
                    $('#importAll').css('display', 'inline-block');
                }
                gainTableD.rows().select();
            } /* ,
            onHide: () => {
                table.reload();
            } */
        });
    }
    // sider中一个在进程中，其他都不能使用
    function forbidAll() {
        $oBtns.forEach(function (v) {
            v.prop('disabled', 'true');
        });
    }
    function reopenAll() {
        $btns.forEach(function (v) {
            v.prop('disabled', null);
        });
    }
    var isThisError = false;
    var thisMsg = {
        msg: '',
        code: '000',
        error: false
    };
    var notifyMsg;
    // 判断轮循有没有结束
    function isGenDone() {
        var beforeMsg = thisMsg;
        $.ajax({
            url: param.path + '/isSynonymGenDone',
            method: 'POST',
            success: function (msg) {
                thisMsg = msg;
                if (msg.code === '200') {
                    isThisError = true;
                    if (msg.data) {
                        $('#import').css('display', 'inline-block');
                        $('#importAll').css('display', 'inline-block');
                    }
                    reopenAll();
                    // $('#gainKey').prop('disabled', null);
                    gainTable.reload();
                    if (notifyMsg) {
                        notifyMsg.remove();
                    }
                    utils.alertMessage(msg.msg, !msg.error);
                }
                else if (msg.code === '201') {
                    isThisError = true;
                    reopenAll();
                    // $('#gainKey').prop('disabled', null);
                    gainTable.reload();
                    if (notifyMsg) {
                        notifyMsg.remove();
                    }
                }
                else if (msg.code === '500') {
                    isThisError = true;
                    forbidAll();
                    // $('#gainKey').prop('disabled', true);
                    if (notifyMsg) {
                        notifyMsg.remove();
                    }
                    utils.alertMessage(msg.msg, !msg.error);
                }
                else if (msg.code === '501') {
                    isThisError = true;
                    // $('#gainKey').prop('disabled', true);
                    forbidAll();
                    // 之前的不是501 就弹出
                    if (beforeMsg.code !== '501') {
                        notifyMsg = utils.alertMessage(thisMsg.msg, '', false);
                    }
                    setTimeout(isGenDone, 5000);
                }
            }
        });
    }
    function bindEvents() {
        bindGainEvent();
    }
    function bindGainEvent() {
        $('#gain-btn').on('click', function () {
            side.show();
        });
    }
    var gainTableLength;
    function initGainTable() {
        gainTableEl = $('#gain-table');
        gainTable = new tables.Table({
            el: gainTableEl,
            options: {
                serverSide: true,
                paging: true,
                ajax: {
                    type: 'POST',
                    url: param.path + '/getImpList',
                    dataSrc: function (data) { gainTableLength = data.rows.length; return data.rows; },
                    data: function (d) {
                        return utils_1.cleanObject({
                            page: tables_1.getPage(d),
                            rows: d.length
                        });
                    }
                },
                columns: [
                    { data: 'keyword', title: '关键词' },
                    { data: 'tsp', title: '提取时间', render: ntables.renderCommonTime, width: ntables.VARIABLES.width.commonTime },
                    { data: 'status', title: '状态', render: renderSt },
                    { data: 'id', title: '操作', render: renderAction, className: 'prevent' }
                ],
                initComplete: gainInitComplete
            },
            checkbox: {
                data: 'id',
                defaultChecked: true
            }
        });
        gainTableD = gainTableEl.DataTable();
    }
    function renderSt(d) {
        if (d === 0) {
            return '等待导入';
        }
        else {
            return '已导入';
        }
    }
    function renderAction(d, type, row) {
        return "<div title='\u7F16\u8F91' style='cursor:pointer' data-id='" + row.id + "' data-keyword='" + row.keyword + "'><img src='" + ctx + "/images/materialIcon/editIconD.png' width='20px' height='auto' class='gain-edit'/></div>";
    }
    function gainInitComplete() {
        $gainKey = $('#gainKey');
        $import = $('#import');
        $importAll = $('#importAll');
        $clearBtn = $('#clearBtn');
        $oBtns = [$import, $gainKey, $importAll, $clearBtn];
        $btns = [$gainKey, $importAll, $clearBtn];
        bindGainKeyWords();
        bindChangeDisabled();
        bindImport();
        bindAllImport();
        bindClear();
        bindEdit();
        bindEditSave();
        $('#edit-modal').on('hide.bs.modal', function () {
            innerSaveFlag = false;
        });
    }
    // 全部导入
    function bindAllImport() {
        $importAll.on('click', function () {
            // const endImA = loadingBtn($(this));
            forbidAll();
            $.ajax({
                url: param.path + '/impAllKeyword',
                success: function (msg) {
                    // endImA();
                    reopenAll();
                    gainTable.reload();
                    table.reload();
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
    }
    // 从后端获取关键词
    function bindGainKeyWords() {
        $gainKey.on('click', function () {
            forbidAll();
            // const endLoading = utils.loadingBtn($(this));
            $.ajax({
                url: param.path + '/generateKeywordInvoke',
                method: 'GET',
                success: function (msg) {
                    if (msg.code === '200') {
                        var isBeforeError = isThisError;
                        if (isBeforeError) {
                            gainTable.reload(true, function () {
                                isGenDone();
                            });
                        }
                    }
                },
                complete: function () {
                    reopenAll();
                    // endLoading();
                }
            });
        });
    }
    function bindChangeDisabled() {
        gainTableD.on('select.dt', function () {
            if (gainTable.selected.length > 0) {
                $import.prop('disabled', null);
            }
        });
        gainTableD.on('deselect.dt', function () {
            if (gainTable.selected.length === 0) {
                $import.prop('disabled', true);
            }
        });
    }
    function bindImport() {
        $import.on('click', function () {
            // gain selected rows
            // const endImport = loadingBtn($(this));
            forbidAll();
            var selectedRows = gainTable.selected;
            var ids = [];
            selectedRows.forEach(function (v) {
                ids.push(v.id);
            });
            $.ajax({
                url: param.path + '/impKeyword',
                method: 'POST',
                data: {
                    ids: ids.join(',')
                },
                success: function (msg) {
                    if (msg.code === '200') {
                        gainTable.reload();
                        table.reload();
                    }
                    reopenAll();
                    // endImport();
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
        });
    }
    function bindClear() {
        $clearBtn.on('click', function () {
            // const endCBtn = utils.loadingBtn($(this));
            forbidAll();
            // 清空页面
            $.ajax({
                url: param.path + '/clearImpList',
                method: 'POST',
                success: function (msg) {
                    if (msg.code === '200') {
                        gainTable.reload();
                    }
                    utils.alertMessage(msg.msg, !msg.error);
                },
                complete: function () {
                    // endCBtn();
                    reopenAll();
                }
            });
        });
    }
    // 点击表格编辑功能
    function bindEdit() {
        gainTableEl.on('click', '.gain-edit', function () {
            innerSaveFlag = true;
            var id = $(this).parent('div').data('id');
            var keyword = $(this).parent('div').data('keyword');
            $('#edit-modal').modal('show');
            $('#edit-modal-content').html("<div class='form-group'>\n\t\t\t\t\t<label>\u539F\u5173\u952E\u8BCD</label>\n\t\t\t\t\t<p class='form-control-static' title='" + keyword + "'>" + keyword + "</p>\n\t\t\t\t</div>\n\t\t\t\t<div class='form-group'>\n\t\t\t\t\t<label>\u4FEE\u6539\u4E3A</label>\n\t\t\t\t\t<input type='text' class='form-control' data-id='" + id + "' value='" + keyword + "' data-old='" + keyword + "' maxlength='50'/>\n\t\t\t\t</div>");
            $('#edit-modal-content input:first').select();
        });
    }
    // 点击编辑保存功能
    function bindEditSave() {
        $('#edit-submit').on('click', function () {
            if (innerSaveFlag) {
                var root = $('#edit-modal-content input');
                var newWord = $.trim(root.val());
                var nid = root.data('id');
                $.ajax({
                    url: param.path + '/modKeywordImp',
                    method: 'POST',
                    data: {
                        id: nid,
                        keyword: newWord
                    },
                    success: function (msg) {
                        if (msg.code === '200') {
                            gainTable.reload();
                            $('#edit-modal').modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    }
                });
            }
        });
    }
})(KnowledgeKeyword || (KnowledgeKeyword = {}));


/***/ }),

/***/ 909:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1112]);
//# sourceMappingURL=63.js.map