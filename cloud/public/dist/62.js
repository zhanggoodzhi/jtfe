webpackJsonp([62],{

/***/ 1113:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(527);


/***/ }),

/***/ 527:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(37);
__webpack_require__(910);
var KnowledgeClassifyIndex;
(function (KnowledgeClassifyIndex) {
    var init = false, classify, state, cId;
    $(function () {
        initTable();
        getTopClassify();
    });
    function initTable() {
        $('#table').DataTable({
            ajax: {
                url: 'knowledge/classify/list',
                type: 'POST',
                beforeSend: resetClassifyContentHeight,
                dataSrc: function (data) {
                    var calssifyData = getClassifyData(data.rows);
                    if (init) {
                        refreshTree(calssifyData);
                    }
                    else {
                        initTree(calssifyData);
                        initClassify(calssifyData);
                    }
                    return data.rows;
                },
                data: function (data) {
                    var d = {
                        value: '',
                        sortField: '',
                        sortType: ''
                    };
                    return utils_1.cleanObject(d);
                }
            },
            scrollY: tables_1.getTableHeight() - 60 + 'px',
            paging: false,
            pageLength: 20,
            columns: [
                { data: 'id', title: 'id' },
                { data: 'csfValue', title: '类型名称' },
                { data: 'valueEn', title: '英文名' },
                { data: 'xuhao', title: '优先级' },
                { data: 'miaoshu', title: '简介', width: '35%' }
            ],
            initComplete: initComplete
        })
            .on('user-select', changeTree);
    }
    function changeTree(e, dt, type, indexes) {
        setTimeout(function () {
            var selected = tables_1.getSelected(dt), tree = $('#tree').jstree(true);
            tree.deselect_all(true);
            if (selected.length > 0) {
                tree.select_node(selected.map(function (v) { return v.id; }), true);
            }
        }, 0);
    }
    function initComplete() {
        var table = $('#table').DataTable();
        var t = new tables_1.Table(table);
        var btn = $('#detail-submit-btn');
        $('.placeholder').remove();
        resetClassifyContentHeight();
        $('#add-btn').on('click', function () {
            showModal('添加分类', 'add');
            var data = table.row({ selected: true }).data();
            refreshClassify(table.data().toArray());
            addParamElement();
            if (data && data.id !== -1) {
                setTimeout(function () {
                    classify.selected = [data.id];
                }, 200);
            }
        });
        $('#edit-btn').on('click', function () {
            var data = table.rows({ selected: true }).data();
            if (data.length < 1) {
                utils_1.alertMessage('请选择要编辑的分类');
            }
            else if (data.length > 1) {
                utils_1.alertMessage('只能编辑一个分类');
            }
            else if (data[0].parentId === null) {
                $('#top-detail-moadl').modal('show');
                $('#top-classify-num').val(data[0].xuhao);
            }
            else {
                var currentData_1 = data[0];
                if (currentData_1.parentId === null) {
                    return;
                }
                refreshClassify(utils_1.filterChild({
                    data: table.data().toArray(),
                    id: currentData_1.id
                }));
                showModal('编辑分类', 'edit');
                $('#classify-num').val(currentData_1.xuhao);
                $('#classify-remark').val(currentData_1.miaoshu);
                $('#classify-name').val(currentData_1.csfValue);
                $('#classify-engname').val(currentData_1.valueEn);
                cId = currentData_1.id;
                if (currentData_1.classifyParamList && currentData_1.classifyParamList.length > 0) {
                    currentData_1.classifyParamList.forEach(function (v) {
                        addParamElement(v.name, v.value);
                    });
                }
                setTimeout(function () {
                    classify.selected = [currentData_1.parentId];
                }, 200);
            }
        });
        btn.on('click', function () {
            var list = [
                { el: '#classify-name', name: '分类名称', valueName: 'value', require: true },
                { el: '#classify-engname', name: '英文名', valueName: 'valueEn', require: true },
                { el: '#classify-num', name: '优先级', valueName: 'xuhao', require: true },
                { el: '#classify-remark', name: '类型简介', valueName: 'miaoshu', require: false }
            ];
            var data = {};
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var v = list_1[_i];
                var val = $.trim($(v.el).val());
                if (val === '' && v.require) {
                    utils_1.alertMessage(v.name + "\u4E0D\u80FD\u4E3A\u7A7A");
                    return;
                }
                data[v.valueName] = val;
            }
            $('#param-wrap .param-group').toArray().forEach(function (v) {
                var el = $(v);
                var name = $.trim(el.find('.param-name ').val());
                var value = $.trim(el.find('.param-value ').val());
                if (name === '' || value === '') {
                    return;
                }
                if (!data.param) {
                    data.param = [];
                }
                data.param.push({
                    name: name,
                    value: value
                });
            });
            data.parentId = classify.selected[0] === '#' ? null : classify.selected[0];
            if (data.param) {
                data.param = JSON.stringify(data.param);
            }
            switch (state) {
                case 'add':
                    addSubmit(data, table);
                    break;
                case 'edit':
                    editSubmit(data, table);
                    break;
                default:
                    utils_1.alertMessage('未知错误');
                    break;
            }
        });
        $('#del-btn').on('click', function () {
            var data = table.rows({ selected: true }).data().toArray();
            var total = table.data().toArray();
            if (data.length <= 0) {
                utils_1.alertMessage('请选择要删除的分类');
                return;
            }
            var ids = [];
            data.forEach(function (v) {
                if (v.parentId) {
                    ids.push(v.id);
                }
            });
            if (ids.length <= 0) {
                utils_1.alertMessage('无法删除预置分类');
                return;
            }
            for (var _i = 0, total_1 = total; _i < total_1.length; _i++) {
                var v = total_1[_i];
                if (v.parentId && ids.indexOf(v.id) < 0 && ids.indexOf(v.parentId) > -1) {
                    utils_1.alertMessage('该分类含有子分类,请先删除子分类');
                    return;
                }
            }
            utils_1.confirmModal({
                msg: '确认删除选中分类吗?',
                cb: function (modal, delSubmitBtn) {
                    var endloading = utils_1.loadingBtn(delSubmitBtn);
                    $.ajax({
                        url: 'knowledge/classify/delete',
                        type: 'POST',
                        data: {
                            classifyId: ids.join(',')
                        },
                        success: function (msg) {
                            utils_1.alertMessage(msg.msg, !msg.error);
                            if (!msg.error) {
                                modal.modal('hide');
                                // table.ajax.reload().draw();
                                t.refresh();
                            }
                        },
                        complete: function () {
                            endloading();
                        }
                    });
                }
            });
        });
        $('#detail-moadl').on('hidden.bs.modal', function () {
            // classify.selected = [classify.data[0].id];
            cId = undefined;
            $('#classify-remark,#classify-name,#classify-engname').val('');
            $('#classify-num').val('1');
            $('#param-wrap').empty();
        });
        $('#classify-engname').on('input', function () {
            var el = $(this);
            el.val(el.val().replace(/[^A-Za-z]/ig, ''));
        });
        $('#detail-moadl').on('shown.bs.modal', function () {
            $('#classify-name').select();
        });
        $('#detail-moadl').one('shown.bs.modal', function () {
            classify.adjustWidth();
        });
        $('#add-param-btn').on('click', function () {
            addParamElement();
        });
        $('#param-wrap').on('click', '.remove-this', function () {
            $(this).parent().remove();
        });
        $('#top-detail-submit-btn').on('click', function () {
            var topDetailSubmitBtn = $(this);
            var val = $('#top-classify-num').val();
            var id = $('#table').DataTable().row({ selected: true }).data().id;
            if (!val) {
                utils_1.alertMessage('请输入优先级');
                return;
            }
            var endLoading = utils_1.loadingBtn(topDetailSubmitBtn);
            $.ajax({
                url: 'knowledge/classify/updateHierarchy1',
                type: 'POST',
                data: {
                    classifyId: id,
                    xuhao: val
                },
                success: function (msg) {
                    utils_1.alertMessage(msg.msg, !msg.error);
                    if (!msg.error) {
                        $('#top-detail-moadl').modal('hide');
                        t.refresh();
                    }
                },
                complete: function () {
                    endLoading();
                }
            });
        });
        $('#top-table').on('change', '.top-info', function () {
            var el = $(this), id = el.prop('id');
            var url = '';
            switch (el.prop('checked')) {
                case true:
                    url = 'knowledge/classify/show';
                    break;
                case false:
                    url = 'knowledge/classify/hide';
                    break;
                default:
                    return;
            }
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    classifyId: id
                },
                success: function (msg) {
                    utils_1.alertMessage(msg.msg, !msg.error);
                    if (!msg.error) {
                        // table.ajax.reload().draw();
                        t.refresh();
                        getTopClassify();
                    }
                }
            });
        });
    }
    function addSubmit(data, table) {
        var t = new tables_1.Table(table);
        var endLoading = utils_1.loadingBtn($('#detail-submit-btn'));
        $.ajax({
            url: 'knowledge/classify/save',
            type: 'POST',
            data: data,
            success: function (msg) {
                utils_1.alertMessage(msg.msg, !msg.error);
                if (!msg.error) {
                    $('#detail-moadl').modal('hide');
                    // table.ajax.reload().draw();
                    t.refresh(true);
                }
            },
            complete: function () {
                endLoading();
            }
        });
    }
    function editSubmit(data, table) {
        var t = new tables_1.Table(table);
        var btn = $('#detail-submit-btn');
        var endLoading = utils_1.loadingBtn(btn);
        data.classifyId = cId;
        $.ajax({
            url: 'knowledge/classify/update',
            type: 'POST',
            data: data,
            success: function (msg) {
                utils_1.alertMessage(msg.msg, !msg.error);
                if (!msg.error) {
                    $('#detail-moadl').modal('hide');
                    // table.ajax.reload().draw();
                    t.refresh();
                }
            },
            complete: function () {
                endLoading();
            }
        });
    }
    function resetClassifyContentHeight() {
        $('#classify-content').height($('#detail-content').height());
    }
    function addParamElement(name, value) {
        if (name === void 0) { name = ''; }
        if (value === void 0) { value = ''; }
        $('#param-wrap').append("\n                <div class='form-group param-group'>\n                    <label class='control-label col-md-2 col-sm-2 col-lg-2'>\u53C2\u6570\u540D</label>\n                    <div class='col-md-4 col-sm-4 col-lg-4'><input class='param-name form-control input-sm' type='text' value='" + name + "'></div>\n                    <label class='control-label col-md-2 col-sm-2 col-lg-2'>\u53C2\u6570</label>\n                    <div class='col-md-4 col-sm-4 col-lg-4'><input class='param-value form-control input-sm' type='text' value='" + value + "'></div>\n                    <div class='remove-this'></div>\n                </div>");
    }
    function initTree(data) {
        var table = $('#table').DataTable();
        var lastSelected;
        $('#tree').jstree({
            core: {
                data: data,
                strings: false,
                animation: 100,
                themes: {
                    icons: false
                },
                multiple: true
            }
        })
            .on('changed.jstree', function (e, action) {
            var allData = table.data().toArray(), treeSelected = action.selected, selectedIndex = [];
            // 判断是否发生变化,jstree在重复点击时也会触发change时间
            if (lastSelected !== undefined && lastSelected.length === treeSelected.length) {
                for (var i = 0, len = lastSelected.length; i < len; i++) {
                    // treeSelected是排过序直接比较就可以
                    if (lastSelected[i] !== treeSelected[i]) {
                        break;
                    }
                    else if (i === len - 1) {
                        return;
                    }
                }
            }
            lastSelected = treeSelected.slice(0);
            allData.forEach(function (v, i) {
                if (treeSelected.indexOf(v.id.toString()) > -1) {
                    selectedIndex.push(i);
                }
            });
            table.rows().deselect();
            if (selectedIndex.length > 0) {
                // 如果只选中了一条要判断是否要翻页
                if (selectedIndex.length === 1) {
                    var index = selectedIndex[0], 
                    // len = table.page.len(),
                    // page = Math.floor(index / len),
                    scrollBody = table.settings()[0].nScrollBody, tr = table.row(index).node();
                    // 翻页
                    // if (table.page() !== page) {
                    //     table.page(page).draw('page');
                    // }
                    // 滚动
                    if (scrollBody.scrollHeight !== scrollBody.clientHeight) {
                        $(scrollBody).animate({
                            scrollTop: tr.offsetTop
                        });
                    }
                }
                table.rows(selectedIndex).select();
            }
        })
            .on('refresh.jstree', function () {
            $('#tree').jstree(true).open_all();
        })
            .one('ready.jstree', function () {
            $('#tree').jstree(true).open_all();
        });
        init = true;
    }
    function refreshTree(data) {
        $('#tree').jstree(true).settings.core.data = data;
        $('#tree').jstree(true).refresh(false, null);
    }
    function getClassifyData(data) {
        var d = data.map(function (v) {
            return {
                id: v.id,
                text: v.csfValue,
                parent: v.parentId === null ? '#' : v.parentId,
                state: {
                    disabled: v.id === -1
                }
            };
        });
        return d;
    }
    function initClassify(data) {
        classify = new utils_1.Tree({
            el: $('#classify'),
            data: data,
            multiple: false,
            selected: true
        });
    }
    function refreshClassify(data) {
        classify.data = getClassifyData(data);
    }
    function showModal(title, currentState) {
        state = currentState;
        $('#detail-moadl')
            .modal('show')
            .find('.modal-title')
            .text(title);
    }
    function fillTopModal(data) {
        var html = '';
        data.forEach(function (v) {
            if (v.parentId === null) {
                html += "\n                <tr>\n                    <td>" + v.csfValue + "</td>\n                    <td><label class='show text-center'><input type='checkbox' id='" + v.id + "' " + (v.used ? 'checked' : '') + " class='top-info'></label></td>\n                </tr>";
            }
        });
        $('#top-table tbody').html(html);
    }
    function getTopClassify() {
        $.ajax({
            url: 'knowledge/classify/showHierarchy1',
            success: function (msg) {
                if (!msg.error) {
                    fillTopModal(msg.data);
                }
            }
        });
    }
})(KnowledgeClassifyIndex || (KnowledgeClassifyIndex = {}));


/***/ }),

/***/ 910:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1113]);
//# sourceMappingURL=62.js.map