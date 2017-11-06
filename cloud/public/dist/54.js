webpackJsonp([54],{

/***/ 1127:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(541);


/***/ }),

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-unused-variable
var utils_1 = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(86);
var daterangepicker_1 = __webpack_require__(21);
__webpack_require__(37);
__webpack_require__(923);
var KnwoledgeEditbyAUpdate;
(function (KnwoledgeEditbyAUpdate) {
    var newAText = '新建回复', checkQList = [];
    var reviewData;
    var qsTableData;
    var originQuestion, // 用于判断是否查重
    paging, 
    // linkId: string,
    tree, editor, delA = [], delQ = [], action, url = ctx + "/knowledge/editByA/index?isreturn=true", loadingEl, qsTable = null;
    var newQRow = function (val) {
        return {
            question: {
                literal: val
            }
        };
    }, newQAutoRepeatRow = function (rowData) {
        return {
            question: {
                literal: rowData.name,
                group: rowData.group
            }
        };
    }, newARow = function (text, extra) {
        if (text === void 0) { text = newAText; }
        var data = {
            answer: {
                plainText: text,
                contentHtml: "<p>" + text + "</p>"
            },
            character: {
                id: selectData.character[0].id
            },
            beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment().add(5, 'year').format('YYYY-MM-DD HH:mm:ss'),
            pushway: selectData.pushway[0].id
        };
        if (extra) {
            Object.assign(data, extra);
        }
        return data;
    }, DELAY = 100, answerTypes = {
        common: '1',
        picture: '2',
        audio: '1',
        video: '1',
        pictxt: '1',
        link: '1'
    };
    $(initGlobal);
    function init() {
        if (pairId !== undefined || reviewId) {
            action = new Edit();
        }
        else {
            var search = location.search;
            if (search !== '' && search.match(/question/g)) {
                var q = search.slice(1).split('=');
                if (q.length > 1) {
                    url = ctx + "/knowledge/review/index";
                    $('#question').val(decodeURI(q[1]));
                }
            }
            action = new Create();
        }
        $('#back-btn').on('click', function () {
            location.href = url;
        });
    }
    function transFormData(data) {
        var pms = data.childQuestionList.map(function (v) {
            return {
                question: {
                    literal: v.content,
                    id: v.id
                }
            };
        });
        var pairs = data.answerList.map(function (v) {
            return {
                answer: {
                    plainText: v.content,
                    contentHtml: v.contentHtml
                },
                character: {
                    id: v.character
                },
                pushway: v.pushWay,
                beginTime: v.beginTime,
                endTime: v.endTime,
                id: data.id,
                question: {
                    id: data.questionId,
                    classify: {
                        id: data.classify
                    },
                    literal: data.question
                }
            };
        });
        return {
            msg: {
                pairs: pairs,
                pms: pms
            }
        };
    }
    /**
     *
     * 编辑类
     * @class Edit
     */
    var Edit = /** @class */ (function () {
        function Edit() {
            this.getData();
        }
        Edit.prototype.getData = function () {
            var _this = this;
            if (hrefType === 'review' && reviewId) {
                $.ajax({
                    url: 'knowledge/rehearsalReview/getPair',
                    method: 'POST',
                    data: {
                        id: reviewId
                    },
                    success: function (data) {
                        reviewData = data;
                        var msg = transFormData(data);
                        if (!msg.error) {
                            _this.fillData(msg.msg);
                            _this.initSave();
                        }
                        else {
                            utils_1.alertMessage('未知错误');
                        }
                    }
                });
                return;
            }
            $.ajax({
                url: 'knowledge/editByA/listByPairId',
                data: {
                    pairId: pairId
                },
                success: function (msg) {
                    if (!msg.error) {
                        _this.fillData(msg.msg);
                        _this.initSave();
                    }
                    else {
                        utils_1.alertMessage('未知错误');
                    }
                }
            });
        };
        Edit.prototype.fillData = function (data) {
            try {
                var q = data.pairs[0].question;
                $('#question').val(q.literal);
                originQuestion = q;
                this.qId = q.id;
                showRepeat();
                initQTable(data.pms);
                initATable(data.pairs);
                tree.selected = [q.classify.id];
            }
            catch (e) {
                console.error(e);
            }
        };
        Edit.prototype.initSave = function () {
            var _this = this;
            $('#save-btn').on('click', function () {
                setTimeout(function () {
                    var data = {
                        questionId: _this.qId
                    };
                    if (!checkGlobal()) {
                        return;
                    }
                    var standards = getStandards(_this.qId), pms = getPms(), childList = getAutoRepeat(), listLen = checkQList.length;
                    if (standards === false) {
                        return;
                    }
                    if (pms === false) {
                        return;
                    }
                    data = Object.assign(data, {
                        childList: JSON.stringify(childList),
                        delPmsId: JSON.stringify(delQ),
                        delPairsId: JSON.stringify(delA),
                        standards: standards,
                        pms: pms
                    });
                    showLoading();
                    if (listLen > 0 && checkQList[listLen - 1].loading) {
                        _this.lastData = data;
                        return;
                    }
                    if (hrefType === 'review' && reviewId) {
                        var question = JSON.parse(pms);
                        var answer = JSON.parse(standards);
                        var childQuestionList = question.map(function (v) {
                            return {
                                content: v.question
                            };
                        });
                        var answerList = answer.map(function (v) {
                            return {
                                content: v.plainText,
                                contentHtml: v.htmlContent,
                                character: v.characterId,
                                pushWay: v.pushway,
                                beginTime: v.beginTime,
                                endTime: v.endTime
                            };
                        });
                        $.ajax({
                            type: 'POST',
                            url: 'knowledge/rehearsalReview/updatePair',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                autoRehearsalList: childList,
                                childQuestionList: childQuestionList,
                                answerList: answerList,
                                question: answer[0].question,
                                classify: answer[0].classifyId ? answer[0].classifyId : -1,
                                id: reviewData.id,
                                questionId: reviewData.questionId,
                                status: reviewData.status
                            })
                        }).done(function (msg) {
                            if (!msg.error) {
                                utils_1.alertMessage(msg.msg, !msg.error);
                                parent.window.reviewSave();
                                clearLoading();
                            }
                            else {
                                utils_1.alertMessage(msg.msg, !msg.error);
                            }
                        });
                    }
                    else {
                        _this.save(data);
                    }
                }, DELAY);
            });
        };
        Edit.prototype.save = function (data) {
            $.ajax({
                url: 'knowledge/editByA/updatePair',
                type: 'POST',
                data: data,
                success: function (msg) {
                    utils_1.alertMessage(msg.msg, msg.code);
                    if (!msg.error) {
                        saveIntent();
                        setTimeout(function () {
                            window.location.assign(ctx + "/knowledge/editByA/index?isreturn=true");
                        }, 3000);
                    }
                },
                complete: function () {
                    clearLoading();
                }
            });
        };
        Edit.prototype.saveByLastData = function () {
            this.save(this.lastData);
        };
        return Edit;
    }());
    /**
     *
     * 新建类
     * @class Create
     */
    var Create = /** @class */ (function () {
        function Create() {
            this.fillData();
            this.initSave();
        }
        Create.prototype.fillData = function () {
            showRepeat();
            initQTable([]);
            initATable([newARow()]);
        };
        Create.prototype.initSave = function () {
            var _this = this;
            $('#save-btn').on('click', function () {
                setTimeout(function () {
                    var data;
                    if (!checkGlobal()) {
                        return;
                    }
                    var standards = getStandards(null), pms = getPms(), childList = getAutoRepeat(), listLen = checkQList.length;
                    if (standards === false) {
                        return;
                    }
                    if (pms === false) {
                        return;
                    }
                    data = {
                        childList: JSON.stringify(childList),
                        standards: standards,
                        pms: pms
                    };
                    showLoading();
                    if (listLen > 0 && checkQList[listLen - 1].loading) {
                        _this.lastData = data;
                        return;
                    }
                    if (hrefType === 'review' && !reviewId) {
                        var question = JSON.parse(pms);
                        var answer = JSON.parse(standards);
                        var childQuestionList = question.map(function (v) {
                            return {
                                content: v.question
                            };
                        });
                        var answerList = answer.map(function (v) {
                            return {
                                content: v.plainText,
                                contentHtml: v.htmlContent,
                                character: v.characterId,
                                pushWay: v.pushway,
                                beginTime: v.beginTime,
                                endTime: v.endTime
                            };
                        });
                        $.ajax({
                            type: 'POST',
                            url: 'knowledge/rehearsalReview/addPair',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                autoRehearsalList: childList,
                                childQuestionList: childQuestionList,
                                answerList: answerList,
                                status: 0,
                                question: answer[0].question,
                                classify: answer[0].classifyId
                            })
                        }).done(function (msg) {
                            if (!msg.error) {
                                parent.window.reviewSave();
                            }
                            clearLoading();
                            utils_1.alertMessage(msg.msg, !msg.error);
                        });
                        return;
                    }
                    _this.save(data);
                }, DELAY);
            });
        };
        Create.prototype.save = function (data) {
            $.ajax({
                url: 'knowledge/editByA/addPair',
                type: 'POST',
                data: data,
                success: function (msg) {
                    utils_1.alertMessage(msg.msg, msg.code);
                    if (!msg.error) {
                        saveIntent();
                        setTimeout(function () {
                            window.location.assign(ctx + "/knowledge/editByA/index");
                        }, 3000);
                    }
                },
                complete: function () {
                    clearLoading();
                }
            });
        };
        Create.prototype.saveByLastData = function () {
            this.save(this.lastData);
        };
        return Create;
    }());
    /**
     *
     * 初始化编辑主句时的问题表格
     * @param {any} data
     */
    function initQTable(data) {
        $('#q-table').DataTable({
            data: data,
            select: {
                style: 'single',
                blurable: false,
                info: false
            },
            initComplete: qTableInitComplete,
            columns: [
                { data: 'question.literal', title: '问题', width: '90%', render: renderTitle },
                { data: 'question.id', title: '操作', render: tables_1.renderEditAndDeleteIcon, width: '10%' }
            ]
        });
    }
    /**
     * 问题表格初始化回调
     */
    function qTableInitComplete() {
        var table = $('#q-table').DataTable();
        table.row(0).select();
        // $('#edit-q-btn').on('click', () => {
        //     const data: any = table.row('.selected').data();
        //     if (!data) {
        //         alertMessage('请选择要编辑的复述问法');
        //     }
        //     else {
        //         $('#edit-q-modal').modal('show').find('.modal-title').text('编辑复述问法');
        //         $('#q-input').val(data.question.literal).focus();
        //     }
        // });
        // $('#q-edit-confirm-btn').on('click', () => {
        //     const val = $.trim($('#q-input').val()),
        //         qVal = $.trim($('#question').val());
        //     if (val === '') {
        //         alertMessage('请输入复述问法');
        //     }
        //     else if (val === qVal) {
        //         alertMessage('与标准问法一致');
        //     }
        //     else {
        //         const cell = table.cell('.selected td:first');
        //         cell.data(val).draw();
        //         $('#edit-q-modal').modal('hide');
        //     }
        // });
        $('#add-question').on('click', function () {
            var el = $('#add-question-text');
            var val = $.trim(el.val());
            var qVal = $.trim($('#question').val());
            if (!val) {
                utils_1.alertMessage('请输入复述问法');
                return;
            }
            if (val === qVal) {
                utils_1.alertMessage('与标准问法一致');
                return;
            }
            var qData = $('#q-table').DataTable().data().toArray();
            for (var _i = 0, qData_1 = qData; _i < qData_1.length; _i++) {
                var v = qData_1[_i];
                var text = v.question.literal;
                if (val === text) {
                    utils_1.alertMessage('复述问法已存在！');
                    return;
                }
            }
            el.val('');
            if (hrefType === 'review') {
                $.ajax({
                    type: 'POST',
                    url: 'knowledge/rehearsalReview/isSimilarity',
                    data: {
                        masterQuestion: qVal,
                        slaveQuestion: val
                    }
                }).done(function (msg) {
                    if (!msg.error) {
                        utils_1.alertMessage(msg.msg, !msg.error);
                        table.row.add(newQRow(val)).draw().row('#q-table tbody tr:last').select();
                    }
                    else {
                        utils_1.alertMessage(msg.msg, !msg.error);
                    }
                });
                return;
            }
            table.row.add(newQRow(val)).draw().row('#q-table tbody tr:last').select();
        });
        $('.q-table-wrap').on('click', '.view-delete', function () {
            var _this = this;
            utils_1.confirmModal({
                msg: "\u786E\u8BA4\u8981\u5220\u9664\u5417",
                cb: function (modal, btn) {
                    var el = table.row($(_this).closest('tr'));
                    var data = el.data();
                    if (data.id) {
                        delQ.push(data.question.id);
                    }
                    el.remove();
                    table.draw().row(0).select();
                    modal.modal('hide');
                }
            });
        });
        $('.q-table-wrap').on('click', '.view-edit', function () {
            var tr = $(this).closest('tr');
            var title = tr.find('span');
            var input = tr.find('input');
            title.hide();
            input.val(title.text()).show().focus();
        });
        $('.q-table-wrap').on('keypress', '.q-input', function (e) {
            var keynum = (e.keyCode ? e.keyCode : e.which);
            if (keynum === 13) {
                $(this).blur();
            }
        });
        $('.q-table-wrap').on('blur', '.q-input', function () {
            var el = $(this);
            el.hide();
            el.siblings('.q-title').text(el.val()).show();
            var cell = table.cell(el.closest('tr').find('td').eq(0));
            cell.data(el.val()).draw();
        });
        $('#auto-repeat').on('click', function () {
            if ($('#question').val().trim() === '') {
                utils_1.alertMessage('请输入标准问法');
                return;
            }
            var endLoading = utils_1.loadingBtn($(this));
            $.ajax({
                url: '/cloud/knowledge/editByA/generateSunQuestion',
                method: 'GET',
                data: {
                    literal: $('#question').val().trim()
                }
            }).done(function (data) {
                if (data.data && !$.isEmptyObject(data.data)) {
                    $('#edit-q-modal').modal('show');
                    drawQSTable(data.data);
                }
                else {
                    utils_1.alertMessage('根据标准问法，未查询到符合条件的复述问法', true);
                }
            })
                .always(function () {
                endLoading();
            });
        });
        // $('#add-q-btn').on('click', () => {
        //     table.row.add(newQRow())
        //         .draw()
        //         .row('#q-table tbody tr:last')
        //         .select();
        //     $('#edit-q-modal').modal('show').find('.modal-title').text('添加复述问法');
        //     $('#q-input').val(newQText).select();
        // });
        // $('#del-q-btn').on('click', () => {
        //     const el = table.row('.selected');
        //     const data: any = el.data();
        //     if (!data) {
        //         alertMessage('请选择要删除的复述问法');
        //     }
        //     else {
        //         if (data.id) {
        //             delQ.push(data.question.id);
        //         }
        //         el.remove();
        //         table.draw().row(0).select();
        //     }
        // });
        // $('#link-wrap,#common-wrap').on('click', '.link-btn', () => {
        //     $('#link-modal').modal('show');
        // });
        // $('#link-wrap').on('click', '.unlink-btn', () => {
        //     confirmModal({
        //         msg: '确定取消关联该知识点吗?',
        //         cb: (modal) => {
        //             modal.modal('hide');
        //             $('#link-wrap').empty();
        //             linkId = undefined;
        //             $('#link-btn').show();
        //         },
        //         text: '确定'
        //     });
        // });
        // $('#link-modal').on('show.bs.modal', () => {
        //     getLinkList('', 1);
        // });
        // $('#link-modal').on('hidden.bs.modal', () => {
        //     $('#link-input').val('');
        //     $('#result-wrap').empty();
        //     paging.total = 1;
        // });
        // $('#link-submit-btn').on('click', () => {
        //     const el = $('#result-wrap input:checked');
        //     if (el.length <= 0) {
        //         alertMessage('请选择要关联的知识点');
        //     }
        //     else {
        //         linkId = el.attr('data-id');
        //         const html = `
        //         <label class="cloud-input-title classify-title">
        //             已关联知识点：
        //         </label>
        //         <a href="depart/detail?id=${linkId}" target="_blank" class="cloud-input-title classify-title">
        //             ${el.attr('data-title')}
        //         </a>
        //         <div class="link-btn-wrap">
        //             <button type="button" class="btn btn-sm btn-primary link-btn">关联知识点</button>
        //             <button type="button" class="btn btn-sm btn-danger unlink-btn">取消关联</button>
        //         </div>`;
        //         $('#link-wrap').html(html);
        //         $('#link-modal').modal('hide');
        //         $('#link-btn').hide();
        //     }
        // });
        // bindInput($('#link-input'), 'input keypress', getLinkList, DELAY);
    }
    function drawQSTable(data) {
        qsTableData = [];
        // for (let i in data) {
        // 	if ($.isEmptyObject(data[i])) {
        // 		qsTableData.push({
        // 			name: i,
        // 			number: 0,
        // 			children: []
        // 		});
        // 	} else {
        // 		let smallData = [];
        // 		for (let j in data[i]) {
        // 			smallData.push({
        // 				name: j,
        // 				percent: data[i][j]
        // 			});
        // 		}
        // 		qsTableData.push({
        // 			name: i,
        // 			number: Object.getOwnPropertyNames(data[i]).length,
        // 			children: smallData
        // 		});
        // 	}
        // }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var v = data_1[_i];
            qsTableData.push({
                name: v.sentence,
                group: v.group
            });
        }
        if (qsTable) {
            qsTable.rows().remove();
            qsTable.rows.add(qsTableData);
            qsTable.draw();
            return;
        }
        // const tableData = data.map((v) => {
        //     return {
        //         name: v,
        //         number: 3
        //     };
        // });
        $('#edit-q-modal').on('shown.bs.modal', function () {
            $('#q-select-table .checkAll').prop('checked', true).trigger('change');
        });
        qsTable = $('#q-select-table').DataTable({
            data: qsTableData,
            select: false,
            initComplete: qsComplete,
            columns: [
                tables_1.getCheckboxColumnObj('name'),
                { data: 'name', title: '复述问法', width: '40%' }
                // { data: 'number', title: '混淆句', render: renderNumber }
            ]
        });
    }
    function renderNumber(num, status, row) {
        if (num === 0) {
            return num;
        }
        else {
            return "<span class=\"question-number\">" + num + "</span>";
        }
    }
    function qsComplete() {
        // const editQTModal = $('#edit-q-modal');
        // editQTModal.on('hidden.bs.modal', function () {
        //     editQTModal.find('input[name=checklist]').each((i, e) => {
        //         (e as any).checked = false;
        //     });
        // });
        tables_1.bindCheckBoxEvent($('#q-select-table'));
        // $('#checkAll').on('click', function () {
        //     const val = this.checked;
        //     if (val) {
        //         $('input[name=checklist]').each((i, e) => {
        //             (e as any).checked = true;
        //         });
        //     } else {
        //         $('input[name=checklist]').each((i, e) => {
        //             (e as any).checked = false;
        //         });
        //     }
        // });
        // $('#q-select-table .checkAll').click();
        $('#q-edit-confirm-btn').on('click', function () {
            var table = $('#q-table').DataTable();
            $('input[name=checklist]:checked').each(function (i, e) {
                var rowData = qsTable.row($(e).closest('tr')).data();
                table.row.add(Object.assign(newQAutoRepeatRow(rowData), { ifauto: true }));
            });
            table.draw().row('#q-table tbody tr:last').select();
            $('#edit-q-modal').modal('hide');
        });
        $('#q-select-table').on('click', '.question-number', function () {
            var el = $(this);
            var tr = el.closest('tr');
            if (el.is('.active')) {
                el.removeClass('active');
                tr.siblings('.child').remove();
            }
            else {
                el.addClass('active');
                var data = $('#q-select-table').DataTable().row(el.closest('tr')).data();
                data.children.forEach(function (v) {
                    var newTr = $("<tr role=\"row\" class=\"child\">y\n                    <td class=\"force-width\"></td>\n                    <td class=\"force-width\"></td>\n                    <td class=\"force-width\"><span class=\"question-detail\">" + v.name + "  (\u6DF7\u6DC6\u7387\uFF1A" + v.percent + ")</span></td>\n                </tr>");
                    newTr.insertAfter(tr);
                });
            }
        });
    }
    function getLinkList(value, index) {
        if (index === void 0) { index = 1; }
        $('#link-loading').addClass('show');
        $.ajax({
            url: 'depart/doclist',
            type: 'POST',
            data: utils_1.cleanObject({
                keyword: $.trim(value),
                classifyid: tree.selected[0],
                isparent: true,
                size: 10,
                page: index
            }),
            success: function (msg) {
                if (!paging) {
                    initPagin(msg.recordsTotal);
                }
                else {
                    paging.index = index;
                    paging.total = msg.recordsTotal;
                }
                renderlinkList(msg.rows);
                $('#link-loading').removeClass('show');
            }
        });
    }
    function renderlinkList(data) {
        if (data && data.length > 0) {
            var html_1 = '';
            data.forEach(function (v) {
                html_1 += "\n                <li class=\"radio\">\n                    <label>\n                        <input type=\"radio\" name=\"link\" data-id=\"" + v.id + "\" data-title=\"" + v.title + "\"/>\n                        " + v.title + "\n                    </label>\n                </li>";
            });
            $('#result-wrap').html(html_1);
        }
    }
    function initPagin(total) {
        paging = new utils_1.Pagination($('#link-paging'), {
            size: 10,
            total: total,
            onChange: function (data) {
                getLinkList($.trim($('#link-input').val()), data.index);
            }
        });
    }
    /**
     *
     * 初始化编辑主句时的回复表格
     * @param {any} data 表格数据
     */
    function initATable(aData) {
        // const currentData = aData.map(v => {
        // 	v.beginTime = v.beginTime;// moment(v.beginTime).format('YYYY-MM-DD HH:MM:SS');
        // 	v.endTime = v.endTime;// moment(v.endTime).format('YYYY-MM-DD HH:MM:SS');
        // 	return v;
        // });
        $('#a-table').DataTable({
            data: aData,
            select: {
                style: 'single',
                blurable: false,
                info: false,
                selector: 'td:first-child'
            },
            initComplete: aTableInitComplete,
            columns: [
                { data: 'answer.plainText', title: '回复', width: '40%' },
                { data: 'character', title: '角色', render: renderCharacter },
                { data: 'pushway', title: '渠道', render: renderPushway },
                { data: 'beginTime', title: '生效时间', render: function (data) { return renderTime(data, 'begin-date'); }, createdCell: createTime },
                { data: 'endTime', title: '失效时间', render: function (data) { return renderTime(data, 'end-date'); }, createdCell: createTime }
                // { data: "status", title: "审核状态", render: renderStatus, width: "80px", createdCell: createStatus }
            ]
        });
    }
    function renderCharacter(character) {
        var str = "<div class=\"cloud-input-content cloud-sm\"><select class=\"character form-control input-sm\">";
        selectData.character.forEach(function (v) {
            str += "<option value=\"" + v.id + "\" " + (v.id === character.id ? 'selected="true"' : '') + ">" + v.name + "</option>";
        });
        return str + '</select></div>';
    }
    function renderTime(time, className) {
        return "<div class=\"cloud-input-content cloud-sm\"><input type=\"text\" class=\"form-control " + className + " input-sm date\" value=\"" + time + "\" data-origin=\"" + time + "\"></div>";
    }
    /**
     *
     * 渲染时间选择控件
     * @param {any} el
     */
    function createTime(el) {
        var input = $(el).find('input');
        new daterangepicker_1.SimpleDate({
            el: input,
            date: input.val()
        });
    }
    /**
     * 回复表格初始化回调
     */
    function aTableInitComplete() {
        var table = $('#a-table').DataTable(), 
        // tslint:disable-next-line:no-unused-variable
        modal = $('#swicth-answer-type');
        editor = new utils_1.Editor({
            el: $('#editor'),
            onChange: editorOnChange
        }).editorElement;
        editor.$txt.blur();
        table.on('select', changeEditorContent);
        table.on('deselect', clearEditorContent);
        $('#add-a-btn').on('click', function () {
            var type = $('input[name="answer-type"]:checked').val();
            switch (type) {
                case 'common':
                    table.row.add(newARow()).draw();
                    table.row('tr:last').select();
                    break;
                case 'intent':
                    $('#intent-modal').modal('show');
                    break;
                default:
                    return;
            }
            // table.row.add(newARow()).draw();
            // table.row('tr:last').select();
            // modal.modal('show');
        });
        // $('#answer-type-list').on('change', 'input:radio', (e) => {
        //     const answerContent = $('#answer-type-content'),
        //         el = $(e.currentTarget),
        //         type = el.val();
        //     if (el.is(':checked')) {
        //         answerContent.find('.answer-content-group').hide();
        //         answerContent.find(`.answer-content-group[data-type=${type}]`).show();
        //     }
        // });
        // $('#switch-answer-btn').on('click', () => {
        //     const checked = $('#answer-type-list input[type=radio]:checked'),
        //         answerContent = $('#answer-type-content'),
        //         type = checked.val();
        //     if (checked.length <= 0) {
        //         return;
        //     }
        //     const group = answerContent.find(`.answer-content-group[data-type=${type}]`);
        //     if (group.length > 0 && !group.find('input').val()) {
        //         alertMessage(group.find('label').html());
        //         return;
        //     }
        //     switch (type) {
        //         case '1':
        //             table.row.add(newARow()).draw();
        //             break;
        //         case '5':
        //             table.row.add(newARow('【链接】', type)).draw();
        //             break;
        //         case '2':
        //             table.row.add(newARow('【图片文件】', type)).draw();
        //             break;
        //         default:
        //             return;
        //     }
        //     table.row('tr:last').select();
        //     modal.modal('hide');
        //     resetAnswerList();
        // });
        $('#intent-confirm-btn').on('click', function (e) {
            var intentModal = $('#intent-modal'), extras = intentModal.find('.extras-row').toArray(), code = $('#intent-code').val().trim();
            if (code === '') {
                utils_1.alertMessage('intentKey 不能为空');
            }
            else if (extras.length <= 0) {
                utils_1.alertMessage('extras 不能为空');
            }
            else {
                var end_1 = utils_1.loadingBtn($(e.currentTarget)), intentJson_1 = JSON.stringify({
                    intentKey: code,
                    extras: extras.map(function (v) {
                        var inputs = $(v).find('input');
                        return {
                            key: inputs.eq(0).val(),
                            value: inputs.eq(1).val()
                        };
                    })
                });
                $.ajax('knowledge/intent/add', {
                    method: 'POST',
                    // contentType: 'application/json',
                    data: {
                        intentJson: intentJson_1
                    }
                })
                    .done(function (msg) {
                    if (!msg.error) {
                        table.row.add(newARow("[\u610F\u56FE: " + intentJson_1 + "]", {
                            intentId: msg.data.id
                        })).draw();
                        table.row('tr:last').select();
                    }
                })
                    .always(function () {
                    end_1();
                    intentModal.modal('hide');
                });
            }
        });
        $('#intent-modal').on('click', '.remove-this', function (e) {
            $(e.currentTarget).parent('.extras-row').remove();
        })
            .on('hidden.bs.modal', function () {
            $('#intent-code').val('');
            $('#intent-modal .extras-row').remove();
            $('#extras-add input').val('');
        });
        $('#extras-add').on('change', 'input', function (e) {
            var el = $(e.currentTarget);
            var html = '<div class="row extras-row">';
            if (el.val().trim() === '') {
                return;
            }
            var inputs = $('#extras-add input').toArray();
            for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                var v = inputs_1[_i];
                var vEl = $(v), val = vEl.val().trim();
                if (val === '') {
                    return;
                }
                html += "\n                    <div class=\"col-sm-6\">\n                        <input class=\"form-control input-sm\" readonly value=\"" + val + "\">\n                    </div>\n                ";
            }
            for (var _a = 0, inputs_2 = inputs; _a < inputs_2.length; _a++) {
                var v = inputs_2[_a];
                $(v).val('');
            }
            html += '<div class="remove-this"></div></div>';
            $('#extras-add').before(html);
        });
        $('#del-a-btn').on('click', function () {
            utils_1.confirmModal({
                msg: "\u786E\u8BA4\u8981\u5220\u9664\u5417",
                cb: function (modal1, btn) {
                    var el = table.row({ selected: true });
                    var data = el.data();
                    if (!data) {
                        utils_1.alertMessage('请选择要删除的回复');
                    }
                    else {
                        if (data.id) {
                            delA.push(data.id);
                        }
                        el.remove();
                        table.draw().row(0).select();
                    }
                    if (table.rows().data().toArray().length < 1) {
                        clearEditorContent();
                    }
                    modal1.modal('hide');
                }
            });
        });
        $('#a-table').on('change', '.begin-date', function () {
            var el = $(this);
            table.row(el.parents('tr')).data().beginTime = el.val() + ' ' + el.data('origin').split(' ')[1];
        });
        $('#a-table').on('change', '.end-date', function () {
            var el = $(this);
            table.row(el.parents('tr')).data().endTime = el.val() + ' ' + el.data('origin').split(' ')[1];
        });
        $('#a-table').on('change', '.character', function () {
            var el = $(this);
            table.row(el.parents('tr')).data().character.id = parseInt(el.val());
        });
        $('#a-table').on('change', '.pushway', function () {
            var el = $(this);
            table.row(el.parents('tr')).data().pushway = parseInt(el.val());
        });
        table.row(0).select();
        // resetAnswerList();
    }
    // tslint:disable-next-line:no-unused-variable
    function resetAnswerList() {
        $('#answer-type-list input:radio:first')
            .prop('checked', true)
            .trigger('change');
        $('#answer-type-content input').val('');
    }
    /**
     *
     * 回复表格切换选中是修改编辑器内容
     * @param {any} e
     * @param {any} dt
     * @param {any} type
     * @param {any} indexes
     */
    function changeEditorContent(e, dt, type, indexes) {
        var data = dt.row(indexes).data();
        // const p = editor.$txt.find("p:last");
        editor.enable();
        editor.$txt.html(data.answer.contentHtml);
        if (data.answer.plainText.match(/^\[意图/)) {
            $('.wangEditor-container').hide();
        }
        else {
            $('.wangEditor-container').show();
        }
    }
    /**
     *
     * 禁用编辑器
     * @param {any} e
     * @param {any} dt
     */
    function clearEditorContent(e, dt) {
        editor.disable();
        editor.$txt.html('<h4 class="text-center">请选择回复</h4>');
    }
    /**
     *
     * 编辑器修改回调
     * @returns
     */
    function editorOnChange() {
        var table = $('#a-table').DataTable();
        var data = table.row({ selected: true }).data();
        if (!data) {
            return;
        }
        else {
            var html = editor.$txt.html(), text = utils_1.formatText(html);
            table.cell('.selected td:first').data(text).draw();
            data.answer.contentHtml = html;
        }
    }
    function checkHrefSource() {
        if (hrefType === 'review') {
            $('body').addClass('review-mode');
            getDetail();
        }
    }
    function getDetail() {
        // $.ajax({
        // 	type: 'POST',
        // 	url: 'knowledge/rehearsalReview/getPair',
        // 	data: {
        // 		id:
        // 	}
        // }).done((msg) => {
        // 	if (!msg.error) {
        // 		utils.alertMessage(msg.msg, !msg.error);
        // 		addTable.reload();
        // 	} else {
        // 		utils.alertMessage(msg.msg, !msg.error);
        // 	}
        // });
    }
    /**
     * 初始化全局配置（不论新建或编辑）
     */
    function initGlobal() {
        checkHrefSource();
        var q = $('#question');
        showLoading();
        tree = new utils_1.Tree({
            el: $('#classify'),
            data: utils_1.formatClassify(selectData.classify),
            initComplete: init
        });
        $.extend(true, $.fn.dataTable.defaults, {
            info: false
        });
        // 绑定问题内容的事件
        utils_1.bindInput(q, 'input keyup', checkExist);
        // 金立测试完成后需要删掉的
        q.on('change', function (e) {
            if ($(e.currentTarget).val().trim() !== '') {
                $('#auto-repeat').trigger('click');
            }
        });
        utils_1.bindEnter(q, function () {
            $('#save-btn').click();
        });
    }
    function checkExist() {
        var q = $('#question'), val = $.trim(q.val());
        if (val === '') {
            return;
        }
        var d = {
            loading: true,
            exist: false
        }, 
        // 把每次验证的都添加
        parent = q.parent(), index = checkQList.length;
        checkQList.push(d);
        if (originQuestion && val === originQuestion.literal) {
            d.loading = false;
            parent.removeClass('has-error');
            return;
        }
        $.ajax({
            url: 'knowledge/editByA/checkQuestion',
            type: 'POST',
            data: {
                literal: val
            },
            success: function (msg) {
                var isClick = !!loadingEl, islast = index === checkQList.length - 1, data = msg.msg;
                var href, text;
                d.loading = false;
                // msg.msg为冲突的pair
                if (data !== null) {
                    parent.addClass('has-error');
                    d.exist = true;
                    switch (data.status) {
                        case 8:
                            href = "knowledge/editByA/update?pairId=" + data.id;
                            text = '该问题已经存在,点击前往编辑该问题';
                            break;
                        case 1:
                            var param = "?from=update&id=" + data.question.id;
                            href = "knowledge/review/index" + param;
                            text = '该问题已经存在,点击前往审核该问题';
                            break;
                        default:
                            return;
                    }
                    $('#exist-link').prop('href', href);
                    $('#exist-text').text(text);
                    if (isClick && islast) {
                        utils_1.alertMessage('问题已经存在');
                        clearLoading();
                    }
                }
                else {
                    if (isClick && islast) {
                        action.saveByLastData();
                    }
                    parent.removeClass('has-error');
                }
            },
            complete: function () {
                d.loading = false;
            }
        });
    }
    function saveIntent() {
        var data = $('#a-table').DataTable().data().toArray();
        data.forEach(function (v) {
            if (v.intentId) {
                $.ajax('knowledge/intent/add/answerContent', {
                    method: 'POST',
                    data: {
                        plainText: v.answer.plainText,
                        intentId: v.intentId
                    },
                    error: null
                });
            }
        });
    }
    /**
     *
     * 获取standards
     * @param {any} aId
     * @returns
     */
    function getStandards(aId) {
        // let error = false;
        var aData = $('#a-table').DataTable().data().toArray();
        var standards = [];
        var propList = [
            'htmlContent',
            'pushway',
            'characterId'
        ];
        for (var _i = 0, aData_1 = aData; _i < aData_1.length; _i++) {
            var v = aData_1[_i];
            var text = v.answer.plainText;
            if (text === '' || text === newAText) {
                utils_1.alertMessage("\u8BF7\u4E0D\u8981\u63D0\u4EA4\u7A7A\u56DE\u590D\u6216" + newAText);
                return false;
            }
            var d = {
                answerId: v.answer.id,
                beginTime: v.beginTime,
                characterId: v.character.id,
                classifyId: tree.selected[0],
                endTime: v.endTime,
                htmlContent: v.answer.contentHtml,
                id: v.id ? v.id : null,
                plainText: text,
                question: $.trim($('#question').val()),
                questionId: aId,
                // status: v.status,
                pushway: v.pushway
            };
            if (standards.length > 0) {
                for (var _a = 0, standards_1 = standards; _a < standards_1.length; _a++) {
                    var j = standards_1[_a];
                    var same = true;
                    for (var _b = 0, propList_1 = propList; _b < propList_1.length; _b++) {
                        var k = propList_1[_b];
                        if (j[k] !== d[k]) {
                            same = false;
                        }
                    }
                    if (same) {
                        utils_1.alertMessage('存在内容完全一致的回复');
                        return false;
                    }
                }
            }
            standards.push(utils_1.cleanObject(d));
        }
        if (aData.length < 1) {
            utils_1.alertMessage('必须创建一条回复');
            return false;
        }
        return JSON.stringify(standards);
    }
    function getAutoRepeat() {
        var qData = $('#q-table').DataTable().data().toArray();
        var arr = [];
        for (var _i = 0, qData_2 = qData; _i < qData_2.length; _i++) {
            var v = qData_2[_i];
            if (v.ifauto) {
                arr.push({
                    groupId: v.question.group,
                    content: v.question.literal
                });
            }
        }
        // return JSON.stringify(arr);
        return arr;
    }
    /**
     *
     * 获取pms
     * @returns
     */
    function getPms() {
        var qData = $('#q-table').DataTable().data().toArray();
        var pms = [];
        var val = $.trim($('#question').val());
        for (var _i = 0, qData_3 = qData; _i < qData_3.length; _i++) {
            var v = qData_3[_i];
            var text = v.question.literal;
            if (text === '') {
                continue;
            }
            if (text === val) {
                utils_1.alertMessage('存在与标准问法一致的问题');
                return false;
            }
            var d = {
                classifyId: tree.selected[0],
                question: text,
                questionId: v.question.id,
                id: v.id ? v.id : null
            };
            if (pms.length > 0) {
                for (var _a = 0, pms_1 = pms; _a < pms_1.length; _a++) {
                    var j = pms_1[_a];
                    if (j.question === d.question) {
                        utils_1.alertMessage('存在内容完全一致的问题');
                        return false;
                    }
                }
            }
            pms.push(utils_1.cleanObject(d));
        }
        return JSON.stringify(pms);
    }
    /**
     * 通用全局检查
     *
     * @returns {boolean}
     */
    function checkGlobal() {
        var val = $.trim($('#question').val());
        if (val === '' || val === undefined) {
            utils_1.alertMessage('问题不能为空');
            return false;
        }
        else if (checkQList.length > 0) {
            if (checkQList[checkQList.length - 1].exist === true) {
                utils_1.alertMessage('问题已经存在');
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    function showRepeat() {
        $('#repeat-wrap .hidden').removeClass('hidden');
        clearLoading();
    }
    function renderPushway(id) {
        var str = "<div class=\"cloud-input-content cloud-sm\"><select class=\"form-control input-sm pushway\">";
        selectData.pushway.forEach(function (v) {
            str += "<option value=\"" + v.id + "\" " + (v.id === id ? 'selected' : '') + ">" + v.name + "</option>";
        });
        return str + '</select></div>';
    }
    function showLoading() {
        clearLoading();
        loadingEl = utils_1.addLoadingBg($('.x_panel'), $('.x_content'));
    }
    function clearLoading() {
        if (loadingEl) {
            loadingEl();
            loadingEl = null;
        }
    }
    function renderTitle(title) {
        return "\n\t\t<span class=\"q-title\">" + title + "</span>\n\t\t<input class=\"input-sm form-control q-input\"/>\n\t";
    }
})(KnwoledgeEditbyAUpdate || (KnwoledgeEditbyAUpdate = {}));


/***/ }),

/***/ 923:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1127]);
//# sourceMappingURL=54.js.map