webpackJsonp([68],{

/***/ 1162:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(574);


/***/ }),

/***/ 574:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// import 'select2/dist/css/select2.css';
var utils = __webpack_require__(5);
__webpack_require__(7);
var tables = __webpack_require__(13);
// import 'script-loader!select2/dist/js/select2.full.min.js';
__webpack_require__(47);
var SuperadminFieldDictionaryIndex;
(function (SuperadminFieldDictionaryIndex) {
    var action;
    (function (action) {
        action[action["add"] = 0] = "add";
        action[action["update"] = 1] = "update";
    })(action || (action = {}));
    var state;
    $(initTable);
    function initTable() {
        var $type = $('.type');
        var $visible = $('.visible');
        $type.select2({
            data: types,
            placeholder: '选择类型',
            allowClear: true
        });
        $type.val('').trigger('change');
        $visible.select2({
            val: '全员可见',
            data: visibles,
            placeholder: '选择可见度',
            allowClear: true
        });
        $visible.val('999').trigger('change');
        $('#table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'superadmin/fieldDictionary/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        page: tables.getPage(data),
                        rows: data.length,
                        name: $('#name').val(),
                        type: $('#type option:selected').text(),
                        code: $('#code').val(),
                        visible_level: $('#visibleLevel option:selected').val()
                    });
                }
            },
            columns: [
                { data: 'type', title: '类型' },
                { data: 'name', title: '名称' },
                { data: 'code', title: 'code值' },
                { data: 'description', title: '描述' },
                { data: 'visibleLevel', title: '可见度', render: renderVisible }
            ],
            initComplete: initComplete
        }));
        function renderVisible(text) {
            var visibleName;
            visibles.forEach(function (v) {
                if (v.id === text) {
                    visibleName = v.text;
                }
            });
            return visibleName;
        }
    }
    function initComplete() {
        var table = $('#table').DataTable();
        utils.bindEnter($('#name,#type,#code'), function () {
            table.draw();
        });
        // 查询功能
        $('#dictionary-search-btn').on('click', function () {
            table.draw();
        });
        tables.bindPageChange(table); // 绑定修改分页
        // 添加功能
        var modalRoot = $('.dictionary');
        $('#dictionary-add-btn').on('click', function () {
            state = action.add;
            modalRoot.find('button.submit-btn').html('添加');
            modalRoot.modal('show').find('h4.modal-title').text('添加数据字典');
            clearData(modalRoot);
        });
        // 编辑功能
        var dicid;
        $('#dictionary-edit-btn').on('click', function () {
            state = action.update;
            tables.checkLength({
                action: '修改',
                name: '数据字典',
                unique: true,
                table: table,
                cb: function (data) {
                    dicid = data.id;
                    getData().forEach(function (v) {
                        var el = modalRoot.find(v.el);
                        if (v.name === 'visible_level') {
                            $(el).val(data.visibleLevel).trigger('change');
                        }
                        else if (v.name === 'type') {
                            // 遍历类型对象
                            types.forEach(function (t) {
                                if (t.text === data[v.name]) {
                                    $(el).val(t.id).trigger('change');
                                }
                            });
                        }
                        else {
                            el.val(data[v.name]);
                        }
                    });
                    modalRoot.find('button.submit-btn').html('保存');
                    modalRoot.modal('show').find('h4.modal-title').text('修改数据字典');
                }
            });
        });
        // 确定按钮
        $('.submit-btn').on('click', function () {
            if (state === action.add) {
                addSubEvent();
            }
            else if (state === action.update) {
                editSubEvent();
            }
        });
        // 删除功能
        tables.delBtnClick({
            el: $('#dictionary-del-btn'),
            table: table,
            name: '数据字典',
            url: 'superadmin/fieldDictionary/delete'
        });
        function addSubEvent() {
            var endLoading = utils.loadingBtn($(this));
            var ajaxData = validator(modalRoot, 'add');
            ajaxData.code = parseInt(ajaxData.code);
            if (ajaxData) {
                $.ajax({
                    url: 'superadmin/fieldDictionary/add',
                    type: 'POST',
                    data: ajaxData,
                    success: function (msg) {
                        if (!msg.error) {
                            table.draw();
                            modalRoot.modal('hide');
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    }
                });
            }
            endLoading();
        }
        function editSubEvent() {
            var endLoading = utils.loadingBtn($(this));
            var ajaxData = validator(modalRoot, 'edit');
            Object.assign(ajaxData, { id: dicid });
            if (ajaxData) {
                $.ajax({
                    url: 'superadmin/fieldDictionary/update',
                    type: 'POST',
                    data: ajaxData,
                    success: function (msg) {
                        if (!msg.error) {
                            table.draw();
                            modalRoot.modal('hide');
                            clearData(modalRoot);
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    }
                });
            }
            endLoading();
        }
    }
    function getData(filter) {
        var data = [
            {
                name: 'type',
                el: '.type',
                require: true
            },
            {
                name: 'name',
                el: '.name',
                require: true
            },
            {
                name: 'code',
                el: '.code',
                require: true,
                pattern: /^[-+]?[0-9]+$/,
                patternMsg: '（须为整数类型）！'
            }, {
                name: 'description',
                el: '.description',
                require: false
            }, {
                name: 'visible_level',
                el: '.visible_level',
                require: true
            }
        ];
        if (filter) {
            var d_1 = [];
            data.forEach(function (v) {
                if (filter !== v.el) {
                    d_1.push(v);
                }
            });
            return d_1;
        }
        return data;
    }
    function validator(el, msg) {
        var currentData = [];
        if (msg === 'add') {
            currentData = getData();
        }
        else if (msg === 'edit') {
            currentData = getData();
        }
        var ajaxData = {};
        for (var _i = 0, currentData_1 = currentData; _i < currentData_1.length; _i++) {
            var v = currentData_1[_i];
            var val = void 0;
            var name_1 = void 0;
            if (v.name === 'type') {
                val = el.find('.type option:selected').text();
                name_1 = '类型';
            }
            else if (v.name === 'visible_level') {
                val = el.find('.visible option:selected').val();
                name_1 = '可见度';
            }
            else {
                var input = el.find(v.el);
                val = $.trim(input.val());
                name_1 = input.parent().prev().text();
            }
            if (v.require && val === '') {
                utils.alertMessage(name_1 + "\u7684\u503C\u4E0D\u80FD\u4E3A\u7A7A");
                return false;
            }
            var misFormat = name_1 + '的格式不正确！';
            if (v.pattern && !v.pattern.test(val)) {
                var pmsg = v.patternMsg;
                utils.alertMessage("" + (pmsg ? misFormat + pmsg : misFormat));
                return false;
            }
            ajaxData[v.name] = val;
        }
        return ajaxData;
    }
    function clearData(modalRoot) {
        getData().forEach(function (v) {
            var el = modalRoot.find(v.el);
            if (v.name === 'visible_level') {
                $(el).val('999').trigger('change');
            }
            else if (v.name === 'type') {
                $(el).val('').trigger('change');
            }
            else {
                el.val('');
            }
        });
    }
})(SuperadminFieldDictionaryIndex || (SuperadminFieldDictionaryIndex = {}));


/***/ })

},[1162]);
//# sourceMappingURL=68.js.map