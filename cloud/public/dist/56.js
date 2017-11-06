webpackJsonp([56],{

/***/ 1125:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(539);


/***/ }),

/***/ 539:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(37);
__webpack_require__(21);
__webpack_require__(921);
var upload_1 = __webpack_require__(30);
var KnowledgeEditbyAIndex;
(function (KnowledgeEditbyAIndex) {
    var date, classify, init = false, actionData = { pairId: null };
    $(function () {
        classify = fillSelectData(); // 填充下拉框菜单信息
        clearSession();
        initDate(); // 初始化时间表单
        initDataTables(); // 初始化主表格
    });
    function initDate() {
        date = new utils_1.CommonDate({
            el: $('#form-date')
        });
    }
    // main table
    function initDataTables() {
        $('#table').DataTable(Object.assign(tables_1.commonConfig(), {
            ajax: {
                type: 'POST',
                url: 'knowledge/editByA/listCorpusByPM',
                dataSrc: function (data) {
                    var d = data.rows;
                    return d;
                },
                data: function (d) {
                    var order = d.order[0], field = d.columns[order.column].data, data = Object.assign(getFormData(), {
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length,
                        sortType: order.dir,
                        sortField: field
                    });
                    if (!init && isreturn === true) {
                        var cacheData = getCacheForm();
                        if (!$.isEmptyObject(cacheData)) {
                            var cacheOrder = cacheData.order.split(',');
                            cacheData.sortType = cacheOrder[1];
                            cacheData.sortField = d.columns[cacheOrder[0]].data;
                            delete cacheData.order;
                            if (cacheData.rows) {
                                $('#table').DataTable().page.len(cacheData.rows);
                            }
                            return cacheData;
                        }
                    }
                    return utils_1.cleanObject(data);
                }
            },
            scrollY: tables_1.getTableHeight(),
            ordering: true,
            order: [[8, 'desc']],
            columns: [
                { data: 'countSubQ', title: '', 'orderable': false, width: tables_1.VARIABLES.width.icon, className: 'show-q-corpus force-width prevent', createdCell: createShowCorpus },
                { name: 'question', data: 'question', title: '问题', 'orderable': false, createdCell: tables_1.createAddTitle },
                { data: 'countSubA', title: '', 'orderable': false, width: tables_1.VARIABLES.width.icon, className: 'show-a-corpus force-width prevent', createdCell: createShowCorpus },
                { name: 'plainText', data: 'plainText', title: '回复', 'orderable': false, createdCell: tables_1.createAddTitle },
                { data: 'dialog', title: '对话模型', 'orderable': false, width: tables_1.VARIABLES.width.button, className: 'prevent', render: renderDialog },
                { name: 'pushway', data: 'pushway', title: '渠道', width: '80px', render: renderPushway },
                { name: 'classifyId', data: 'classifyId', width: '80px', title: '类型', render: renderClassify },
                { name: 'characterId', data: 'characterId', width: '80px', title: '角色', render: renderCharacter },
                { name: 'updateTime', data: 'updateTime', width: tables_1.VARIABLES.width.commonTime, title: '更新时间', render: utils_1.renderCommonTime }
            ],
            drawCallback: function () {
                $('.dataTables_scrollBody').scrollTop(0);
                if (init) {
                    cacheForm();
                }
            },
            initComplete: initComplete
        }));
    }
    // 填充下拉框数据
    function fillSelectData() {
        return new utils_1.ClassifyTree({
            el: $('#classify'),
            data: utils_1.formatClassify(selectData.classify, true),
            selected: true,
            multiple: true
        });
    }
    function initComplete() {
        var table = $('#table').DataTable();
        var t = new tables_1.Table(table);
        var delBtn = $('#delete-submit-btn');
        var uploadBtn = $('#upload-submit-btn');
        var upload = new upload_1.DelayUpload({
            accept: '.xls,.xlsx',
            url: 'knowledge/uploadCorpusSumit',
            saveBtn: $('#upload-wrap'),
            submitBtn: uploadBtn,
            save: function (id, name) {
                $('#info-wrap').show();
                $('#info-name').text(name);
            },
            success: function (res) {
                if (!res.error) {
                    utils_1.alertMessage(res.msg, !res.error, false);
                    $('#upload').modal('hide');
                    t.refresh();
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
        var ids = [], actionInit = false;
        initDialogTree();
        renderForm();
        tables_1.bindPageChange(table, $('#page-change'));
        $('#search-btn').on('click', function () {
            t.refresh(true);
        });
        $('#edit-btn').on('click', function () {
            var data = table.rows({ selected: true }).data().toArray();
            if (data.length < 1) {
                utils_1.alertMessage('请选择要操作的问题！');
            }
            else if (data.length > 1) {
                utils_1.alertMessage('只能编辑一个问题！');
            }
            else {
                var id = data[0].id;
                window.location.href = ctx + "/knowledge/editByA/update?pairId=" + id;
            }
        });
        $('#del-btn').on('click', function () {
            var d = table.rows({ selected: true }).data();
            // let num=0;
            if (d.length <= 0) {
                utils_1.alertMessage('请选择要操作的问题！');
                return;
            }
            ids = [];
            for (var _i = 0, d_1 = d; _i < d_1.length; _i++) {
                var v = d_1[_i];
                // if (v.dialog === 0) {
                ids.push(v.id);
                // }
                /* if(v.classifyId===1056){
                     ++num;
                 }*/
            }
            if (ids.length <= 0) {
                utils_1.alertMessage('语料在对话模型中被使用,请先修改对话模型后再尝试删除语料');
                return;
            }
            /*if(num){
                alertMessage('无法删除类型为”对话模型“的语料，请重新选择不包含该类型的语料');
                return;
            }*/
            $('#confirm').modal('show');
        });
        delBtn.on('click', function () {
            if (ids.length <= 0) {
                return;
            }
            utils_1.loadingBtn(delBtn);
            $.ajax({
                url: 'knowledge/editByA/delete',
                data: {
                    pairIds: ids.join(',')
                },
                type: 'POST',
                success: function (msg) {
                    if (!msg.error) {
                        t.refresh();
                        $('#confirm').modal('hide');
                    }
                    utils_1.alertMessage(msg.msg, msg.code);
                },
                complete: function () {
                    utils_1.endLoadingBtn(delBtn);
                }
            });
        });
        $('#reset-btn').on('click', function () {
            setTimeout(function () {
                date.resetDate();
                classify.reset();
                table.page.len($('#page-change').val());
            }, 0);
        });
        $('#confirm').on('hidden.bs.modal', function () {
            ids = [];
        });
        $('#batch-upload-btn').on('click', function () {
            $('#upload').modal('show');
        });
        utils_1.bindEnter($('#form-answer,#form-question'), function () { return t.refresh(true); });
        // $('m ').on('click', () => t.refresh(true)); // 查询问题
        $('#export-btn').on('click', function (e) {
            exportCorpus($(e.currentTarget), 'exportExcel');
        });
        $('#nolimit-export-btn').on('click', function (e) {
            exportCorpus($(e.currentTarget), 'noLimitExportExcel');
        });
        $('#table').on('click', '.show-corpus-td.show-a-corpus', function (e) {
            showCorpus(e, 'knowledge/editByA/listAnswerByPairId', 'plainText');
        });
        $('#table').on('click', '.show-corpus-td.show-q-corpus', function (e) {
            showCorpus(e, 'knowledge/editByA/listByPairId', 'question');
        });
        $('#table').on('click', '.show-dialog', function () {
            var btn = $(this), id = btn.attr('data-id');
            utils_1.loadingBtn(btn);
            $.ajax({
                url: 'knowledge/editByA/listDialogByPairId',
                type: 'GET',
                data: {
                    pairId: id
                },
                success: function (msg) {
                    if (!msg.error) {
                        $('#dialog-modal').modal('show');
                        updateDialogTree(msg.msg);
                    }
                },
                complete: function () {
                    utils_1.endLoadingBtn(btn);
                }
            });
        });
        $('#action-btn').on('click', function () {
            tables_1.checkLength({
                action: '查看',
                name: '语料',
                table: table,
                cb: function (data) {
                    actionData.pairId = data.id;
                    $('#action-modal').modal('show');
                    if (!actionInit) {
                        initActionTable();
                        actionInit = true;
                    }
                }
            });
        });
        $('#dialog-edit-btn').on('click', function () {
            var selected = $('#dialog').jstree(true).get_selected(true);
            if (selected.length > 0) {
                var d = selected[0].original;
                window.open(ctx + "/knowledge/dialog/update?id=" + d.dialog);
            }
            else {
                utils_1.alertMessage('请选择对话模型');
            }
        });
        $('#dialog-modal').on('hidden.bs.modal', function () {
            $('#dialog-question').val('');
            $('#dialog-answer').html('');
        });
        if (!isreturn && init === false) {
            init = true;
        }
        // 合并语料
        $('#merge-btn').on('click', function () {
            tables_1.checkLength({
                action: '合并',
                name: '语料',
                table: table,
                unique: false,
                cb: function (data) {
                    var mids = [];
                    data.forEach(function (v) {
                        mids.push(v.questionId);
                    });
                    if (data.length === 1) {
                        utils_1.alertMessage('请至少选择两条或两条以上的语料合并！');
                    }
                    else {
                        window.location.href = ctx + "/knowledge/editByA/merge?title=\u8BED\u6599\u5408\u5E76&ids=" + mids.join(',');
                    }
                }
            });
        });
    }
    function initActionTable() {
        $('#action-table').DataTable(Object.assign(tables_1.simpleConfig(), {
            ajax: {
                url: 'knowledge/editByA/history',
                dataSrc: function (data) { return data.rows; },
                data: function () {
                    return actionData;
                }
            },
            columns: [
                { title: '', data: 'id', width: '12px', createdCell: createShowAction },
                { title: '操作', data: 'content' },
                { title: '操作时间', data: 'createTime', render: utils_1.renderCommonTime, width: tables_1.VARIABLES.width.commonTime }
            ],
            select: false,
            initComplete: ActionTableInitComplete
        }));
    }
    function ActionTableInitComplete() {
        var table = $('#action-table').DataTable();
        var t = new tables_1.Table(table);
        $('#action-table').on('click', '.show-action-td', function (e) {
            var el = $(e.currentTarget), icon = el.icon();
            switch (icon.state) {
                case utils_1.IconState.loading:
                    return;
                case utils_1.IconState.plus:
                    icon.state = utils_1.IconState.loading;
                    $.ajax({
                        url: 'knowledge/editByA/historyDetail',
                        type: 'GET',
                        data: {
                            historyId: el.data('id')
                        },
                        success: function (msg) {
                            if (!msg.error) {
                                addActionDetial(msg.data, el.parents('tr'), table.columns().indexes().length);
                            }
                            else {
                                utils_1.alertMessage(msg.msg, !msg.error);
                            }
                        },
                        complete: function () {
                            icon.state = utils_1.IconState.minus;
                        }
                    });
                    break;
                case utils_1.IconState.minus:
                    break;
                default:
                    break;
            }
            clearActionTable();
        });
        $('#action-modal').on('show.bs.modal', function () {
            t.refresh();
        });
    }
    function addActionDetial(data, el, len) {
        var html = '';
        data.forEach(function (v) {
            html += "\n                <li>\n                    <span class=\"action-detial-title\">" + v.field + "</span>\n                    :\n                    <span class=\"text-danger\">" + v.oldValue + "</span>\n                    =>\n                    <span class=\"text-danger\">" + v.newValue + "</span>\n                </li>";
        });
        if (html === '') {
            html = '<div class="text-center">无数据</div>';
        }
        else {
            html = '<ol>' + html + '</ol>';
        }
        el.after("<tr class=\"action-details\">\n                    <td colspan=" + len + ">\n                        " + html + "\n                    </td>\n                </tr>");
    }
    function clearActionTable() {
        $('.action-details').remove();
        resetIcon($('#action-table tbody .show-action-td'));
    }
    function showCorpus(e, url, name) {
        var el = $(e.currentTarget), tr = el.parents('tr'), icon = el.icon();
        switch (icon.state) {
            case utils_1.IconState.loading:
                return;
            case utils_1.IconState.plus:
                icon.state = utils_1.IconState.loading;
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: {
                        pairId: el.data('id')
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            var trs = getTrs(name === 'question' ? msg.msg.pms : msg.msg, name);
                            tr.after($(trs));
                        }
                    },
                    complete: function () {
                        icon.state = utils_1.IconState.minus;
                    }
                });
                break;
            case utils_1.IconState.minus:
                break;
            default:
                return;
        }
        clearTable();
    }
    function clearTable() {
        $('.cps-details').remove();
        resetIcon($('#table tbody .show-corpus-td'));
    }
    function resetIcon(element) {
        Array.prototype.forEach.call(element, function (v) {
            var icon = $(v).icon();
            if (icon.state === utils_1.IconState.minus) {
                icon.state = utils_1.IconState.plus;
            }
        });
    }
    /**
     * 千万不要改字段名,不然就雪崩
     *
     * @param {any} data
     * @param {any} name
     * @returns
     */
    function getTrs(data, name) {
        var html = '';
        var table = $('#table').DataTable(), len = table.columns().indexes().length, indexMap = {
            question: table.column('question:name').index(),
            plainText: table.column('plainText:name').index(),
            classifyId: table.column('classifyId:name').index(),
            characterId: table.column('characterId:name').index(),
            // status: table.column("status:name").index(),
            updateTime: table.column('updateTime:name').index(),
            pushway: table.column('pushway:name').index()
        };
        if (!data || data.length <= 0) {
            return "\n                <tr class=\"cps-details\">\n                    <td colspan=\"" + len + "\" class=\"text-center\">\u65E0\u6570\u636E</td>\n                </tr>";
        }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var v = data_1[_i];
            var d = new Array(len);
            // 拿q或者a内容
            var qaMap = {
                question: v.question.literal,
                plainText: v.answer.plainText
            }, 
            // 通用部分
            list = [{
                    name: 'classifyId',
                    value: v.question.classify.csfValue
                },
                {
                    name: 'characterId',
                    value: name === 'question' ? '' : v.character.vname
                },
                {
                    name: 'pushway',
                    value: name === 'question' ? '' : renderPushway(v.pushway)
                },
                {
                    name: 'updateTime',
                    value: utils_1.renderCommonTime(v.updateTime)
                }];
            html += " <tr class=\"cps-details\">";
            for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
                var l = list_1[_a];
                d[indexMap[l.name]] = l.value;
            }
            d[indexMap[name]] = qaMap[name];
            for (var _b = 0, d_2 = d; _b < d_2.length; _b++) {
                var h = d_2[_b];
                if (!h) {
                    html += "<td></td>";
                }
                else {
                    html += "<td class=\"force-width\">" + h + "</td>";
                }
            }
            html += "</tr>";
        }
        return html;
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
    function renderCharacter(id) {
        for (var _i = 0, _a = selectData.character; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.id === id) {
                return i.name;
            }
        }
        return '';
    }
    /* function renderStatus(status) {
         for (let i of selectData.status) {
             if (i.id === status) {
                 return i.name;
             }
         }
         return "";
     }*/
    function exportCorpus(btn, name) {
        // alertMessage('正在生成文件', 'success');
        // const end = loadingBtn(btn);
        var data = $.param(getFormData());
        // let str = '';
        // for (let i in data) {
        // 	str += '&' + i + '=' + encodeURI(data[i]);
        // }
        // if (str !== '') {
        // 	str = '?' + str.slice(1);
        // }
        // $.ajax(`knowledge/${name}`, {
        // 	data
        // })
        // 	.done(res => {
        // 		alertMessage(res.msg, !res.error);
        // 	})
        // 	.always(() => {
        // 		end();
        // 	});
        location.href = ctx + "/knowledge/" + name + "?" + data;
    }
    function cacheForm() {
        if (window.sessionStorage) {
            var table = $('#table').DataTable();
            var order = table.order();
            var data = {
                keyword: $.trim($('#form-question').val()),
                answerkeyword: $.trim($('#form-answer').val()),
                classifys: classify.selected.join(','),
                // corpusStatus: $("#select-status").val(),
                character: $('#select-character').val(),
                page: table.page(),
                rows: table.page.len(),
                beginTime: date.getDate('start'),
                endTime: date.getDate('end'),
                order: order[0].join(','),
                pushway: $('#select-pushway').val()
            };
            for (var i in data) {
                window.sessionStorage.setItem(i, data[i]);
            }
        }
    }
    function getCacheItem(key) {
        if (window.sessionStorage && window.sessionStorage.getItem(key)) {
            return window.sessionStorage.getItem(key);
        }
        else {
            return '';
        }
    }
    function getCacheForm() {
        var list = [
            'keyword',
            'answerkeyword',
            'classifys',
            // "corpusStatus",
            'character',
            'page',
            'rows',
            'beginTime',
            'endTime',
            'pushway',
            'order'
        ];
        var data = {};
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var v = list_2[_i];
            data[v] = getCacheItem(v);
        }
        return utils_1.cleanObject(data);
    }
    function renderForm() {
        if (window.sessionStorage) {
            if (!init && isreturn === true) {
                var cacheData = getCacheForm();
                var formList = {
                    keyword: '#form-question',
                    answerkeyword: '#form-answer',
                    // corpusStatus: "#select-status",
                    character: '#select-character',
                    rows: '#page-change',
                    pushway: '#select-pushway'
                };
                for (var i in formList) {
                    if (cacheData[i]) {
                        $(formList[i]).val(cacheData[i]);
                    }
                }
                if (cacheData.beginTime && cacheData.endTime) {
                    date.setDate(cacheData.beginTime, cacheData.endTime);
                }
                if (cacheData.classifys) {
                    var classifys = cacheData.classifys.split(',');
                    classify.tree.jstree(true).select_node(classifys);
                }
                init = true;
            }
        }
    }
    // function renderShowCorpus(cellData) {
    //     return '';
    // }
    function createShowCorpus(td, cellDatA, rowData) {
        var el = $(td);
        if (cellDatA > 0) {
            el
                .addClass('show-corpus-td')
                .data('id', rowData.id)
                .icon();
        }
        else {
            el.addClass('disabled')
                .icon();
        }
    }
    function createShowAction(td, cellData, rowData) {
        var el = $(td);
        if (!rowData.history) {
            el.empty();
        }
        else {
            el
                .addClass('show-action-td')
                .data('id', cellData)
                .icon();
        }
    }
    function renderDialog(dialog, type, full, meta) {
        return "<button type=\"button\" class=\"btn btn-xs btn-primary show-dialog\" " + (dialog === 0 ? 'disabled' : '') + " data-id=\"" + full.id + "\">\u663E\u793A</button>";
    }
    function initDialogTree() {
        $('#dialog').jstree({
            core: {
                data: [],
                animation: 100,
                themes: {
                    icons: false
                },
                multiple: false
            },
            'conditionalselect': function (node, event) {
                if (node.id.match(/root/)) {
                    return false;
                }
                return true;
            },
            plugins: ['conditionalselect']
        })
            .on('refresh.jstree', function () {
            var tree = $('#dialog').jstree(true), data = tree.get_json(null, { flat: true });
            tree.deselect_all();
            tree.open_all();
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var v = data_2[_i];
                if (!v.id.match(/root/)) {
                    tree.select_node(v.id);
                    return;
                }
            }
            // tree.select_node();
        })
            .on('select_node.jstree', function (e, action) {
            var node = action.node;
            var data = node.original;
            $('#dialog-question').val(data.question);
            $('#dialog-answer').html(data.answer);
        });
    }
    function updateDialogTree(data) {
        var d = [];
        var tree = $('#dialog').jstree(true);
        Object.keys(data).forEach(function (v, i) {
            var rootId = "root-" + i, dialog = data[v][0].id;
            d.push({
                parent: '#',
                text: v,
                id: rootId,
                isDialog: true
            });
            for (var _i = 0, _a = data[v]; _i < _a.length; _i++) {
                var j = _a[_i];
                d.push({
                    text: j.expectWord.literal,
                    id: j.id,
                    parent: j.parent ? j.parent : rootId,
                    answer: j.content.contentHtml,
                    question: j.expectWord.literal,
                    dialog: dialog
                });
            }
        });
        tree.settings.core.data = d;
        tree.refresh();
    }
    function clearSession() {
        if (window.sessionStorage) {
            if (!isreturn) {
                window.sessionStorage.clear();
            }
        }
    }
    function renderPushway(id) {
        for (var _i = 0, _a = selectData.pushway; _i < _a.length; _i++) {
            var i = _a[_i];
            if (id === i.id) {
                return i.name;
            }
        }
        return '';
    }
    function getFormData() {
        return utils_1.cleanObject({
            keyword: $.trim($('#form-question').val()),
            answerkeyword: $.trim($('#form-answer').val()),
            classifys: classify.selected.join(','),
            pushway: $('#select-pushway').val(),
            // corpusStatus: $("#select-status").val(),
            character: $('#select-character').val(),
            beginTime: date.getDate('start'),
            endTime: date.getDate('end')
        });
    }
})(KnowledgeEditbyAIndex || (KnowledgeEditbyAIndex = {}));


/***/ }),

/***/ 921:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1125]);
//# sourceMappingURL=56.js.map