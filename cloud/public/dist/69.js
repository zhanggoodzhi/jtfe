webpackJsonp([69],{

/***/ 1157:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(569);


/***/ }),

/***/ 569:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// import 'select2/dist/css/select2.css';
var utils = __webpack_require__(5);
__webpack_require__(7);
var tables = __webpack_require__(13);
__webpack_require__(47);
// import 'script-loader!select2/dist/js/select2.full.min.js';
var SuperadminApisIndex;
(function (SuperadminApisIndex) {
    var action;
    (function (action) {
        action[action["update"] = 0] = "update";
        action[action["add"] = 1] = "add";
    })(action || (action = {}));
    var state;
    $(initTable);
    function initTable() {
        var $appList = $('.appid');
        $appList.select2({
            data: appList,
            placeholder: '选择应用名称',
            allowClear: true
        });
        $appList.val('').trigger('change');
        $('#table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'superadmin/apis/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        page: tables.getPage(data),
                        rows: data.length,
                        apiName: $('#apiName').val(),
                        apiDesc: $('#apiDesc').val(),
                        apiUrl: $('#apiUrl').val(),
                        appid: $('#appid option:selected').val()
                    });
                }
            },
            columns: [
                { data: 'apiName', title: '名称' },
                { data: 'apiDesc', title: '描述', render: function (text) { return text ? text : '无'; } },
                { data: 'apiUrl', title: '链接' },
                { data: 'appName', title: '应用名称' }
            ],
            initComplete: initComplete
        }));
    }
    function initComplete() {
        var table = $('#table').DataTable();
        // 回车查询
        utils.bindEnter($('#apiName,#apiDesc,#apiUrl'), function () {
            table.draw();
        });
        // 查询功能
        $('#apis-search-btn').on('click', function () {
            table.draw();
        });
        tables.bindPageChange(table); // 绑定修改分页
        var modalRoot = $('.apis');
        // 编辑功能
        var editId;
        $('#apis-edit-btn').on('click', function () {
            state = action.update;
            tables.checkLength({
                action: '编辑',
                name: 'API信息',
                unique: true,
                table: table,
                cb: function (data, row) {
                    editId = data.id;
                    modalRoot.find('.apiName').val(data.apiName);
                    modalRoot.find('.apiDesc').val(data.apiDesc);
                    modalRoot.find('.apiUrl').val(data.apiUrl);
                    appList.forEach(function (v) {
                        if (v.text === data.appName) {
                            $(modalRoot.find('.appid')).val(v.id).trigger('change');
                        }
                    });
                    modalRoot.find('.submit-btn').text('保存');
                    modalRoot.modal('show').find('.modal-title').text('修改API');
                }
            });
        });
        // 添加功能
        $('#apis-add-btn').on('click', function () {
            state = action.add;
            modalRoot.find('.submit-btn').text('添加');
            modalRoot.modal('show').find('.modal-title').text('添加API');
        });
        // 提交功能
        modalRoot.find('.submit-btn').on('click', function () {
            var endLoading = utils.loadingBtn($(this));
            // 获取传给后台的值
            var sendData = {
                apiName: $.trim(modalRoot.find('.apiName').val()),
                apiDesc: $.trim(modalRoot.find('.apiDesc').val()),
                apiUrl: $.trim(modalRoot.find('.apiUrl').val()),
                appid: $.trim(modalRoot.find('.appid option:selected').val())
            };
            var actionUrl;
            if (state === action.add) {
                actionUrl = 'superadmin/apis/add';
            }
            else if (state === action.update) {
                actionUrl = 'superadmin/apis/update';
                Object.assign(sendData, { id: editId });
            }
            // 校验
            var inputs = modalRoot.find('input').toArray();
            for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
                var v = inputs_1[_i];
                var name_1 = $.trim($(v).parent().prev().text());
                if (name_1 !== '描述' && !$(v).val()) {
                    utils.alertMessage(name_1 + '不能为空！');
                    endLoading();
                    return;
                }
            }
            if (!modalRoot.find('.appid').val()) {
                utils.alertMessage('应用名称不能为空！');
                endLoading();
                return;
            }
            // 传值给后台
            $.ajax({
                url: actionUrl,
                type: 'POST',
                data: sendData,
                success: function (msg) {
                    if (!msg.error) {
                        table.draw();
                        modalRoot.modal('hide');
                    }
                    utils.alertMessage(msg.msg, !msg.error);
                }
            });
            endLoading();
        });
        // 模态框消失就清空模态框中的数据
        modalRoot.on('hidden.bs.modal', function () {
            var inputs = modalRoot.find('input').toArray();
            for (var _i = 0, inputs_2 = inputs; _i < inputs_2.length; _i++) {
                var v = inputs_2[_i];
                $($(v).val(''));
            }
            modalRoot.find('.appid').val('').trigger('change');
        });
        // 删除功能
        tables.delBtnClick({
            el: $('#apis-del-btn'),
            table: table,
            name: 'API信息',
            url: 'superadmin/apis/delete'
        });
    }
})(SuperadminApisIndex || (SuperadminApisIndex = {}));


/***/ })

},[1157]);
//# sourceMappingURL=69.js.map