webpackJsonp([51],{

/***/ 1132:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(545);


/***/ }),

/***/ 545:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(7);
var tables = __webpack_require__(13);
var utils = __webpack_require__(5);
__webpack_require__(37);
__webpack_require__(21);
__webpack_require__(931);
var KnowledgeReviewIndex;
(function (KnowledgeReviewIndex) {
    var select;
    var t;
    var tree = new utils.Tree({
        el: $('#main-classify'),
        data: utils.formatClassify(selectData.classify, true),
        multiple: true,
        selected: selectData.classify.map(function (cls) { return cls.id; }),
        initComplete: function (tr) {
            tr.tree.deselect_node(expectClassify);
            initTable(tr);
        }
    });
    /**
     * 初始化表格
     */
    function initTable(classify) {
        var date = new utils.CommonDate({
            el: $('#date')
        });
        var initForm = false;
        $('#table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'knowledge/review/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    var d = {
                        currentPage: tables.getPage(data),
                        pageSize: data.length
                    };
                    if (window.fromData && !initForm) {
                        initForm = true;
                        Object.assign(d, { questionId: fromData.id });
                    }
                    else {
                        var similar = $('#select-similar').val().split('-');
                        Object.assign(d, {
                            keyword1: $.trim($('#question').val()),
                            keyword2: $.trim($('#similar').val()),
                            answer: $.trim($('#answer').val()),
                            classifys: classify.selected.join(','),
                            beginDegree: similar[0],
                            endDegree: similar[1],
                            beginTime: date.getDate('start'),
                            endTime: date.getDate('end'),
                            sortField: '',
                            sortType: ''
                        });
                    }
                    return utils.cleanObject(d);
                }
            },
            initComplete: initComplete,
            columns: [
                { name: 'literal', data: 'literal', title: '问题', width: '25%', createdCell: tables.createAddTitle },
                { name: 'similarityLiteral', data: 'similarityLiteral', title: '相似句', width: '25%', createdCell: tables.createAddTitle },
                { name: 'answer', data: 'answer', title: '回复', width: '25%', createdCell: tables.createAddTitle },
                { name: 'similarityDegree', data: 'similarityDegree', title: '相似度', width: '60px', render: renderDegree },
                { name: 'hits', data: 'hits', title: '热度', width: '40px' },
                { name: 'classifyID', data: 'classifyID', title: '分类', width: '60px', render: tables.renderClassify },
                { name: 'updateTime', data: 'updateTime', title: '更新时间', width: '128px', render: utils.renderCommonTime }
            ]
        }));
    }
    function initComplete() {
        var table = $('#table').DataTable();
        t = new tables.Table(table);
        var lastHtml, targetHtml = '<tr><td>操作</td><td>';
        $('.btn-trigger').toArray().forEach(function (v) {
            var el = $(v);
            targetHtml += "<button type='button' class='btn btn-sm btn-link' data-target='#" + el.prop('id') + "'>" + el.text() + "</button>";
        });
        targetHtml += '</td></tr>';
        tables.delBtnClick({
            name: '语料',
            url: 'knowledge/review/delete',
            table: table,
            param: 'pairIds',
            dataParam: 'pairId',
            el: $('#del-btn')
        });
        $('#edit-btn').on('click', function () {
            tables.checkLength({
                action: '编辑',
                table: table,
                name: '语料',
                unique: false,
                cb: function (data) {
                    $('#edit-modal').modal('show');
                    select = data;
                }
            });
        });
        $('#save-new-btn').on('click', function () {
            tables.checkLength({
                name: '语料',
                action: '保存',
                table: table,
                cb: function (data) {
                    location.assign(ctx + "/knowledge/editByA/update?question=" + encodeURI(data.literal));
                }
            });
        });
        $('#check-btn').on('click', function () {
            tables.checkLength({
                table: table,
                action: '审核',
                name: '语料',
                unique: false,
                cb: function (data) {
                    var ids = [];
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var v = data_1[_i];
                        if (v.similarityQid !== null) {
                            ids.push(v.pairId);
                        }
                    }
                    if (ids.length < 1) {
                        utils.alertMessage('只能审核含有相似句的语料');
                        return;
                    }
                    var endLoading = utils.loadingBtn($('#check-btn'));
                    $.ajax({
                        // url: "knowledge/review/accept",
                        url: 'knowledge/review/verify',
                        type: 'POST',
                        data: {
                            pairIds: ids.join(',')
                        },
                        success: function (msg) {
                            utils.alertMessage(msg.msg, !msg.error);
                            if (!msg.error) {
                                t.refresh();
                            }
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                }
            });
        });
        $('#show-detial-btn').on('click', function () {
            tables.checkLength({
                unique: true,
                table: table,
                action: '查看',
                name: '语料',
                cb: function (data, rows) {
                    var modal = $('#detial-modal'), rowIndex = rows.index();
                    var html = '';
                    Array.prototype.forEach.call(table.columns().header(), function (v, i) {
                        var title = $(v).html(), content = table.cell(rowIndex, i).render('display');
                        html += "<tr><td>" + title + "</td><td>" + content + "</td></tr>";
                    });
                    html += targetHtml;
                    modal.modal('show');
                    if (lastHtml === undefined || lastHtml !== html) {
                        $('#detial-content').html(html);
                        lastHtml = html;
                    }
                }
            });
        });
        $('#detial-content').on('click', '.btn-link', function (e) {
            $('#detial-modal').hide().modal('hide');
            $($(e.currentTarget).data('target')).trigger('click');
        });
        $('#search-btn').on('click', function () {
            // table.draw();
            t.refresh(true);
        });
        // 导出语料
        var date = new utils.CommonDate({
            el: $('#date')
        });
        $('#export-btn').on('click', function () {
            utils.alertMessage('正在生成文件！', 'success');
            var similar = $('#select-similar').val().split('-');
            var data = utils.cleanObject({
                keyword1: $.trim($('#question').val()),
                keyword2: $.trim($('#similar').val()),
                answer: $.trim($('#answer').val()),
                classifys: tree.selected.join(','),
                beginDegree: similar[0],
                endDegree: similar[1],
                beginTime: date.getDate('start'),
                endTime: date.getDate('end')
            });
            var str = '';
            for (var i in data) {
                str += '&' + i + '=' + encodeURI(data[i]);
            }
            if (str !== '') {
                str = '?' + str.slice(1);
            }
            // console.log(`${ctx}/knowledge/review/exportTestExcel${str}`);
            location.href = ctx + "/knowledge/review/exportTestExcel" + str;
        });
        // tables.bindEnter(table, $('#similar,#question,#answer'));
        utils.bindEnter($('#similar,#question,#answer'), function () { t.refresh(true); });
        tables.bindPageChange(table, $('#page-change'));
        $('#edit-modal').one('shown.bs.modal', initEditTable);
    }
    /**
     * 初始化语料编辑时选择知识点的表格
     */
    function initEditTable() {
        var classify = new utils.ClassifyTree({
            el: $('#classify'),
            data: utils.formatClassify(selectData.classify, true),
            multiple: true,
            selected: true
        });
        var date = new utils.CommonDate({
            el: $('#form-date')
        });
        $('#edit-table').DataTable(Object.assign(tables.simpleConfig('single'), {
            ajax: {
                url: 'knowledge/review/update/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        keyword: $.trim($('#form-question').val()),
                        answerkeyword: $.trim($('#form-answer').val()),
                        classifys: classify.selected.join(','),
                        character: $('#select-character').val(),
                        page: tables.getPage(data),
                        rows: data.length,
                        pushway: $('#select-pushway').val(),
                        beginTime: date.getDate('start'),
                        endTime: date.getDate('end'),
                        corpusStatus: 8
                    });
                }
            },
            columns: [
                { data: 'countSubQ', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowCorpus },
                { name: 'question', data: 'question', title: '问题', width: '50%', createdCell: tables.createAddTitle },
                { name: 'plainText', data: 'plainText', title: '回复', width: '50%', createdCell: tables.createAddTitle }
            ],
            initComplete: editInitComplete
        }));
    }
    function editInitComplete() {
        var table = $('#edit-table').DataTable();
        var editT = new tables.Table(table);
        $('#edit-submit-btn').on('click', function () {
            tables.checkLength({
                name: '知识点',
                action: '添加到',
                table: table,
                cb: function (data) {
                    var currentdata = data;
                    if (!select || select.length < 1) {
                        return;
                    }
                    else {
                        for (var _i = 0, select_1 = select; _i < select_1.length; _i++) {
                            var v = select_1[_i];
                            if (v.pairId === currentdata.id) {
                                utils.alertMessage('不能保存为相同语料');
                                return;
                            }
                        }
                        var endLoading_1 = utils.loadingBtn($('#edit-submit-btn'));
                        $.ajax({
                            url: 'knowledge/review/update/save',
                            type: 'GET',
                            data: {
                                pairIds: select.map(function (v) { return v.pairId; }).join(','),
                                pairId: currentdata.id
                            },
                            success: function (msg) {
                                utils.alertMessage(msg.msg, !msg.error);
                                if (!msg.error) {
                                    $('#edit-modal').modal('hide');
                                    // $('#table').DataTable().draw(false);
                                    t.refresh();
                                }
                            },
                            complete: function () {
                                endLoading_1();
                            }
                        });
                    }
                }
            });
        });
        $('#edit-table').on('click', '.show-corpus-td.show-q-corpus', function (e) {
            showCorpus(e, 'knowledge/editByA/listByPairId', 'q');
        });
        $('#form-search-btn').on('click', function () {
            // table.draw();
            editT.refresh(true);
        });
        // tables.bindEnter(table, $('#form-question,#form-answer'));
        utils.bindEnter($('#form-answer,#form-question'), function () { return editT.refresh(true); });
    }
    function showCorpus(e, url, name) {
        var el = $(e.currentTarget), tr = el.parents('tr'), icon = el.icon();
        switch (icon.state) {
            case utils.IconState.loading:
                return;
            case utils.IconState.plus:
                icon.state = utils.IconState.loading;
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: {
                        pairId: el.data('id')
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            var trs = void 0;
                            if (name === 'q') {
                                trs = msg.msg.pms.map(function (v) {
                                    return "\n\t\t\t\t\t\t\t\t\t\t<tr class=\"cps-details\">\n\t\t\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t\t\t<td class=\"force-width\">" + v.question.literal + "</td>\n\t\t\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t";
                                });
                            }
                            else {
                                trs = msg.msg.map(function (v) {
                                    return "\n\t\t\t\t\t\t\t\t\t\t<tr class=\"cps-details\">\n\t\t\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t\t\t<td class=\"force-width\">" + v.answer.plainText + "</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t";
                                });
                            }
                            // const trs = getTrs(name === 'question' ? msg.msg.pms : msg.msg, name);
                            tr.after($(trs.join('')));
                        }
                    },
                    complete: function () {
                        icon.state = utils.IconState.minus;
                    }
                });
                break;
            case utils.IconState.minus:
                break;
            default:
                return;
        }
        clearTable();
    }
    function clearTable() {
        $('.cps-details').remove();
        resetIcon($('#edit-table tbody .show-corpus-td'));
    }
    function resetIcon(element) {
        Array.prototype.forEach.call(element, function (v) {
            var icon = $(v).icon();
            if (icon.state === utils.IconState.minus) {
                icon.state = utils.IconState.plus;
            }
        });
    }
    function renderDegree(num) {
        return (num * 1000 / 10) + '%';
    }
    function createShowCorpus(td, cellDatA, rowData) {
        var el = $(td);
        if (cellDatA > 0) {
            el.addClass('show-corpus-td')
                .data('id', rowData.id)
                .icon();
        }
        else {
            el.addClass('disabled')
                .icon();
        }
    }
})(KnowledgeReviewIndex || (KnowledgeReviewIndex = {}));


/***/ }),

/***/ 931:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1132]);
//# sourceMappingURL=51.js.map