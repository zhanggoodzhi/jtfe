webpackJsonp([65],{

/***/ 1110:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(524);


/***/ }),

/***/ 524:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(37);
__webpack_require__(36);
__webpack_require__(907);
var CustomizeRecommendIndex;
(function (CustomizeRecommendIndex) {
    var modalState;
    (function (modalState) {
        modalState[modalState["create"] = 0] = "create";
        modalState[modalState["edit"] = 1] = "edit";
    })(modalState || (modalState = {}));
    var state, submitData;
    var t;
    var detailT;
    $(function () {
        initDatatable();
    });
    function initDatatable() {
        var classify = new utils.ClassifyTree({
            el: $('#classify'),
            data: utils.formatClassify(selectData.classify, true),
            selected: true,
            multiple: true
        });
        $('#table').DataTable(Object.assign({
            ajax: {
                url: 'recommend/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        classifyId: classify.selected.join(','),
                        keyword1: $.trim($('#keyword').val()),
                        currentPage: tables_1.getPage(data),
                        pageSize: data.length,
                        sortField: '',
                        sortType: ''
                    });
                }
            },
            initComplete: initComplete,
            columns: [
                { name: 'question', data: 'question', width: '50%', title: '问题' },
                { name: 'recommendQuestion', data: 'recommendQuestion', width: '30%', title: '推荐问题' },
                { name: 'createTime', data: 'createTime', title: '创建时间', render: utils.renderCommonTime }
            ]
        }, tables_1.commonConfig()));
    }
    function initComplete() {
        var table = $('#table').DataTable();
        t = new tables_1.Table(table);
        $('#search-btn').on('click', function () {
            // table.draw();
            t.refresh(true);
        });
        $('#del-btn').on('click', function () {
            var data = table.rows({ selected: true }).data().toArray();
            if (data.length <= 0) {
                utils.alertMessage('请选择要删除的推荐问题');
                return;
            }
            utils.confirmModal({
                msg: "\u786E\u8BA4\u5220\u9664\u9009\u4E2D\u7684 " + data.length + " \u6761\u63A8\u8350\u95EE\u9898\u5417?",
                cb: function (modal, btn) {
                    var loading = utils.loadingBtn(btn);
                    $.ajax({
                        url: 'recommend/delete',
                        type: 'POST',
                        data: {
                            ids: data.map(function (v) { return v.id; }).join(',')
                        },
                        success: function (msg) {
                            if (!msg.error) {
                                modal.modal('hide');
                                // table.draw();
                                t.refresh();
                            }
                            utils.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            loading();
                        }
                    });
                }
            });
        });
        $('#add-btn').on('click', function () {
            $('#detail-modal').modal('show')
                .find('.modal-title')
                .text('添加推荐问题');
            state = modalState.create;
            submitData = {
                recommendQuestionId: []
            };
            $('#detail-q').val('请选择问题');
            $('#rq-wrap').html("<div class='rq-item' id='placeholder'><input id='detail-rq' type='text' readonly='readonly' class='form-control input-sm rq-input' value='\u8BF7\u9009\u62E9\u63A8\u8350\u95EE\u9898'/></div>");
        });
        $('#edit-btn').on('click', function () {
            var data = table.rows({ selected: true }).data().toArray();
            if (data.length < 1) {
                utils.alertMessage('请选择要编辑推荐问题');
            }
            else if (data.length > 1) {
                utils.alertMessage('只能编辑一个推荐问题');
            }
            else {
                var currentData = data[0];
                $('#detail-modal').modal('show')
                    .find('.modal-title')
                    .text('编辑推荐问题');
                state = modalState.edit;
                submitData = {
                    id: currentData.id,
                    questionId: currentData.questionId,
                    recommendQuestionId: [currentData.recommendQuestionId]
                };
                $('#detail-q').val(currentData.question);
                $('#rq-wrap').html(createRqItem(currentData.recommendQuestion, currentData.recommendQuestionId));
            }
        });
        $('#detail-modal').one('shown.bs.modal', function () {
            var detailClassify = new utils.ClassifyTree({
                el: $('#modal-classify'),
                data: utils.formatClassify(selectData.classify, true),
                selected: true,
                multiple: true
            });
            $('#detail-table').DataTable(Object.assign(tables_1.simpleConfig(), {
                ajax: {
                    url: 'recommend/update/list',
                    type: 'POST',
                    data: function (data) {
                        return utils.cleanObject({
                            keyword: $.trim($('#detail-keyword').val()),
                            classifys: detailClassify.selected.join(','),
                            corpusStatus: 8,
                            page: tables_1.getPage(data),
                            rows: data.length
                        });
                    },
                    dataSrc: function (data) { return data.rows; }
                },
                columns: [
                    { name: 'question', data: 'question', title: '问题' }
                ],
                initComplete: detailInitComplete
            }));
        });
        $('#detail-modal').on('hidden.bs.modal', function () {
            submitData = null;
            $('#detail-q,#detail-rq').val('');
        });
        tables_1.bindEnter(table);
        tables_1.bindPageChange(table, $('#page-change'));
    }
    function detailInitComplete() {
        var table = $('#detail-table').DataTable();
        detailT = new tables_1.Table(table);
        // let once = false;
        $('#detail-search-btn').on('click', function () {
            // table.draw();
            detailT.refresh(true);
        });
        tables_1.bindEnter(table, $('#detail-keyword'));
        $('#set-q-btn').on('click', function () {
            var data = table.rows({ selected: true }).data().toArray();
            if (data.length < 1) {
                utils.alertMessage('请选择要设为问题的问题');
            }
            else if (data.length > 1) {
                utils.alertMessage('只能选择一个问题');
            }
            else if (!checkQ(data[0].questionId)) {
                utils.alertMessage('请不要选择相同的问题');
            }
            else {
                submitData.questionId = data[0].questionId;
                $('#detail-q').val(data[0].question);
            }
        });
        $('#set-rq-btn').on('click', function () {
            var data = table.rows({ selected: true }).data().toArray();
            var i = 0, html = '';
            if (data.length < 1) {
                utils.alertMessage('请选择要设为推荐问题的问题');
                return;
            }
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var v = data_1[_i];
                if (!checkQ(v.questionId)) {
                    continue;
                }
                submitData.recommendQuestionId.push(v.questionId);
                html += createRqItem(v.question, v.questionId);
                i++;
            }
            if (i === 0) {
                utils.alertMessage('请不要选择相同的问题');
                return;
            }
            if ($('#placeholder').length > 0) {
                $('#placeholder').remove();
            }
            $('#rq-wrap').append(html);
            // $('#detail-rq').val(data.question);
        });
        $('#detail-submit-btn').on('click', function () {
            var url;
            if (!submitData.questionId || submitData.recommendQuestionId.length < 1) {
                utils.alertMessage('问题或推荐问题为空');
                return;
            }
            var bool;
            switch (state) {
                case modalState.create:
                    url = 'recommend/add';
                    bool = true;
                    break;
                case modalState.edit:
                    if (!submitData.id) {
                        return;
                    }
                    url = 'recommend/update/save';
                    bool = false;
                    break;
                default:
                    return;
            }
            var loading = utils.loadingBtn($('#detail-submit-btn'));
            var data = Object.assign({}, submitData, {
                recommendQuestionId: submitData.recommendQuestionId.join(',')
            });
            $.ajax({
                url: url,
                data: data,
                success: function (msg) {
                    if (!msg.error) {
                        $('#detail-modal').modal('hide');
                        // table.draw();
                        // $('#table').DataTable().draw(false);
                        t.refresh(bool);
                    }
                    utils.alertMessage(msg.msg, !msg.error);
                },
                complete: function () {
                    loading();
                }
            });
        });
        $('#rq-wrap').on('click', '.close', function (e) {
            if (submitData.recommendQuestionId.length < 1) {
                return;
            }
            var el = $(e.currentTarget).parent(), index = submitData.recommendQuestionId.indexOf(el.data('id'));
            if (index > -1) {
                el.remove();
                submitData.recommendQuestionId.splice(index, 1);
            }
        });
    }
    function checkQ(id) {
        var all = [submitData.questionId].concat(submitData.recommendQuestionId);
        for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
            var v = all_1[_i];
            if (id === v) {
                return false;
            }
        }
        return true;
    }
    function createRqItem(value, id) {
        return ("<div class='rq-item' data-id='" + id + "' >\n                    <input id='detail-rq' type='text' readonly='readonly' class='form-control input-sm rq-input' value='" + value + "'/>\n                    <button type='button' class='close'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>\n                </div>");
    }
})(CustomizeRecommendIndex || (CustomizeRecommendIndex = {}));


/***/ }),

/***/ 907:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1110]);
//# sourceMappingURL=65.js.map