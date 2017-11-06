webpackJsonp([47],{

/***/ 1144:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(557);


/***/ }),

/***/ 557:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(7);
var tables = __webpack_require__(13);
__webpack_require__(36);
__webpack_require__(37);
__webpack_require__(941);
var FaqIndex;
(function (FaqIndex) {
    var MenuState;
    (function (MenuState) {
        MenuState[MenuState["add"] = 0] = "add";
        MenuState[MenuState["edit"] = 1] = "edit";
    })(MenuState || (MenuState = {}));
    $(function () {
        init();
    });
    var commonT;
    var menuT;
    /**
     * 常见问题栏
     *
     * @class CommonQuestionPage
     */
    var CommonQuestionPage = /** @class */ (function () {
        function CommonQuestionPage() {
            this.initComplete = function () {
                var table = $('#common-question-table').DataTable();
                commonT = new tables.Table(table);
                $('#common-question-tab').on('shown.bs.tab', function () {
                    commonT.refresh(true);
                });
                $('#common-question-search-btn').on('click', function () {
                    // table.draw();
                    commonT.refresh(true);
                });
                utils.bindEnter($('#q-keyword'), function () { commonT.refresh(true); });
                // tables.bindEnter(table, $('#q-keyword'));
                bindUpdateQuestion(table, $('#common-question-open-btn'), '开放', '已关闭', false);
                bindUpdateQuestion(table, $('#common-question-close-btn'), '关闭', '已开放', true);
            };
            this.init();
        }
        CommonQuestionPage.prototype.init = function () {
            var width = tables.VARIABLES.width;
            $('#common-question-table').DataTable(Object.assign(tables.commonConfig(), {
                ajax: {
                    url: 'setting/faq/frequentQuestion/list',
                    type: 'POST',
                    dataSrc: function (data) { return data.rows; },
                    data: function (data) {
                        return utils.cleanObject({
                            keyword: $.trim($('#q-keyword').val()),
                            generalMenuId: $('#q-menu').val(),
                            faq: $('#q-state').val(),
                            page: tables.getPage(data),
                            rows: data.length,
                            sort: '',
                            order: ''
                        });
                    }
                },
                scrollY: tables.getTabsTableHeight($('#common-question .cloud-search-area')),
                columns: [
                    { name: 'question', data: 'question', title: '问题', createdCell: tables.createAddTitle },
                    { name: 'answer', data: 'answer', title: '答案', createdCell: tables.createAddTitle },
                    { name: 'classify', data: 'classify', title: '分类', width: 4 * width.char },
                    { name: 'faq', data: 'faq', title: '状态', render: function (faq) { return faq ? '已开放' : '已关闭'; }, width: width.minimum },
                    { name: 'createtime', data: 'createtime', title: '创建时间', render: utils.renderSimpleTime, width: width.simpleTime }
                ],
                initComplete: this.initComplete
            }));
        };
        return CommonQuestionPage;
    }());
    var MenuManagePage = /** @class */ (function () {
        function MenuManagePage() {
            var _this = this;
            this.initComplete = function () {
                var table = $('#menu-manage-table').DataTable(), tree = new utils.Tree({
                    el: $('#relationship-select'),
                    data: utils.formatClassify(selectData.classifys),
                    multiple: true,
                    selected: false,
                    selectAllClear: false
                }), dataList = [
                    { el: '#menu-name', param: 'name', require: true, default: '' },
                    { el: '#menu-number', param: 'index', require: true, default: '1' },
                    { el: '#menu-description', param: 'gmDesc', require: true, default: '' }
                ] /*,
                reafresh = () => { table.ajax.reload().draw(); }*/;
                menuT = new tables.Table(table);
                var selectedId;
                $('#menu-manage-tab').on('shown.bs.tab', function () {
                    menuT.refresh(true);
                });
                tables.delBtnClick({
                    name: '菜单',
                    table: table,
                    url: 'setting/faq/generalMenu/delete',
                    el: $('#menu-manage-del-btn')
                });
                $('#menu-manage-search-btn').on('click', function () { menuT.refresh(true); });
                $('#menu-manage-add-btn').on('click', function () {
                    $('#relationship-select').text('');
                    $('#menu-modal').modal('show')
                        .find('.modal-title').text('添加菜单');
                    _this.state = MenuState.add;
                });
                $('#menu-manage-edit-btn').on('click', function () {
                    tables.checkLength({
                        action: '编辑',
                        name: '菜单',
                        table: table,
                        cb: function (data) {
                            var currentData = data, id = currentData.id, endLoading = utils.loadingBtn($('#menu-manage-edit-btn'));
                            $.ajax({
                                url: 'setting/faq/faqMenu/list',
                                type: 'POST',
                                data: {
                                    generalMenuId: id
                                },
                                success: function (msg) {
                                    if (!msg.error) {
                                        $('#menu-modal').modal('show')
                                            .find('.modal-title').text('编辑菜单');
                                        _this.state = MenuState.edit;
                                        selectedId = [id].toString();
                                        for (var _i = 0, dataList_1 = dataList; _i < dataList_1.length; _i++) {
                                            var v = dataList_1[_i];
                                            $(v.el).val(currentData[v.param]);
                                        }
                                        tree.selected = msg.msg;
                                    }
                                },
                                complete: function () {
                                    endLoading();
                                }
                            });
                        }
                    });
                });
                $('#menu-save-btn').on('click', function () {
                    var url;
                    var data = {};
                    for (var _i = 0, dataList_2 = dataList; _i < dataList_2.length; _i++) {
                        var v = dataList_2[_i];
                        var el = $(v.el), val = $.trim(el.val());
                        if (val === '' && v.require) {
                            utils.alertMessage(el.parent().prev('.cloud-input-title').text() + "\u4E0D\u80FD\u4E3A\u7A7A");
                            return;
                        }
                        data[v.param] = val;
                    }
                    if (!$('#relationship-select').text()) {
                        utils.alertMessage('映射关系不能为空！');
                        return;
                    }
                    Object.assign(data, { parentId: '0', classifyIds: tree.selected.join(',') });
                    var bool;
                    switch (_this.state) {
                        case MenuState.add:
                            url = 'setting/faq/generalMenu/add';
                            bool = true;
                            break;
                        case MenuState.edit:
                            if (selectedId && data.parentId !== selectedId) {
                                url = 'setting/faq/generalMenu/update';
                                bool = false;
                                data.id = selectedId;
                            }
                            else {
                                utils.alertMessage('不能选择自身为父级菜单');
                                return;
                            }
                            break;
                        default:
                            return;
                    }
                    var endLoading = utils.loadingBtn($('#menu-save-btn'));
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: data,
                        success: function (msg) {
                            utils.alertMessage(msg.msg, !msg.error);
                            if (!msg.error) {
                                $('#menu-modal').modal('hide');
                                menuT.refresh(bool);
                                // reafresh();
                            }
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                });
                utils.bindEnter($('#m-keyword'), function () { menuT.refresh(true); });
                $('#menu-modal').one('shown.bs.modal', function () {
                    tree.adjustWidth();
                });
                $('#menu-modal').on('hidden.bs.modal', function () {
                    for (var _i = 0, dataList_3 = dataList; _i < dataList_3.length; _i++) {
                        var v = dataList_3[_i];
                        $(v.el).val(v.default);
                    }
                    tree.clear();
                    selectedId = null;
                });
            };
            this.init();
        }
        MenuManagePage.prototype.init = function () {
            var width = tables.VARIABLES.width;
            $('#menu-manage-table').DataTable(Object.assign(tables.commonConfig(), {
                ajax: {
                    url: 'setting/faq/generalMenu/list',
                    type: 'POST',
                    dataSrc: function (data) {
                        var d = data.rows;
                        selectData.generalMenus = d;
                        fillSelect();
                        return d;
                    },
                    data: function (data) {
                        return utils.cleanObject({
                            keyword: $.trim($('#m-keyword').val()),
                            sort: '',
                            order: ''
                        });
                    }
                },
                serverSide: false,
                scrollY: tables.getTabsTableHeight($('#menu-manage .cloud-search-area')),
                columns: [
                    { name: 'name', data: 'name', title: '菜单名称' },
                    { name: 'gmDesc', data: 'gmDesc', title: '描述' },
                    { name: 'index', data: 'index', title: '优先级', width: width.minimum }
                ],
                initComplete: this.initComplete
            }));
        };
        return MenuManagePage;
    }());
    /*function updateParentMenu(data, selectId) {
        let html = "";
        data.forEach(v => {
            html += `<option value="${v.id}" ${selectId === v.id ? "selected" : ""}>${v.text}</option>`;
        });
        $("#parent-menu").html(html);
    }*/
    /*    function formateTreeDate(filter?): utils.ITreeData[] {
            // const data = table.rows().data().toArray(),
            const data = selectData.generalMenus,
                d: utils.ITreeData[] = [{
                    parent: "#",
                    id: "0",
                    text: "根节点"
                }];
            data.forEach(v => {
                d.push({
                    parent: v.parent,
                    id: v.id,
                    text: v.name
                });
            });

            if (filter !== undefined) {
                return utils.filterChild({
                    data: d,
                    id: filter
                });
            }

            return d;
        }*/
    function init() {
        fillSelect();
        new CommonQuestionPage();
        $('#menu-manage-tab').one('shown.bs.tab', function () {
            new MenuManagePage();
        });
    }
    /**
     *
     * 关闭和开放功能
     * @param {any} table DataTable
     * @param {JQuery} btn 按钮元素用于Loading
     * @param {string} action 提示=>操作
     * @param {string} status 提示=>状态
     * @param {boolean} faqStatus 操作的状态并根据状态过滤
     */
    function bindUpdateQuestion(table, btn, action, status, faqStatus) {
        btn.on('click', function () {
            tables.checkLength({
                action: action,
                name: '常见问题',
                table: table,
                unique: false,
                cb: function (data) {
                    var d = [];
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var v = data_1[_i];
                        if (v.faq === faqStatus) {
                            d.push(v.pid);
                        }
                    }
                    if (d.length < 1) {
                        utils.alertMessage("\u8BF7\u9009\u62E9" + status + "\u72B6\u6001\u7684\u63A8\u8350\u95EE\u9898");
                        return;
                    }
                    updateQuestion(table, btn, d.join(','));
                }
            });
        });
    }
    function updateQuestion(table, btn, pids) {
        var endLoading = utils.loadingBtn(btn);
        var t = new tables.Table(table);
        $.ajax({
            url: 'setting/faq/frequentQuestion/update',
            type: 'POST',
            data: {
                pids: pids
            },
            success: function (msg) {
                utils.alertMessage(msg.msg, !msg.error);
                if (!msg.error) {
                    t.refresh();
                    // table.draw(false);
                }
            },
            complete: function () {
                endLoading();
            }
        });
    }
    function fillSelect() {
        var html = '<option value="">全部</option>';
        var generalMenus = selectData.generalMenus;
        if (generalMenus.length > 0) {
            for (var _i = 0, generalMenus_1 = generalMenus; _i < generalMenus_1.length; _i++) {
                var v = generalMenus_1[_i];
                html += "<option value=" + v.id + ">" + v.name + "</option>";
            }
        }
        $('#q-menu').html(html);
    }
})(FaqIndex || (FaqIndex = {}));


/***/ }),

/***/ 941:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1144]);
//# sourceMappingURL=47.js.map