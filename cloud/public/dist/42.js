webpackJsonp([42],{

/***/ 1159:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(571);


/***/ }),

/***/ 571:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(7);
__webpack_require__(36);
var tables = __webpack_require__(13);
__webpack_require__(47);
// import 'select2/dist/css/select2.css';
// import 'script-loader!select2/dist/js/select2.full.min.js';
__webpack_require__(953);
var SuperadminAppIndex;
(function (SuperadminAppIndex) {
    var state;
    var allAccount;
    $(initTable);
    function initTable() {
        var width = tables.VARIABLES.width;
        $('#table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'superadmin/app/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        page: tables.getPage(data),
                        rows: data.length,
                        appName: $('#search-appName').val()
                    });
                }
            },
            columns: [
                { data: 'appName', title: '应用名称', createdCell: tables.createAddTitle },
                { data: 'appReadme', title: '应用简介', createdCell: tables.createAddTitle },
                { data: 'userName', title: '创建人' },
                { data: 'appUpdateTime', width: width.commonTime, title: '编辑时间', render: utils.renderCommonTime },
                { data: 'appAddTime', width: width.commonTime, title: '创建时间', render: utils.renderCommonTime },
                { data: 'id', title: '操作', render: renderAction }
            ],
            initComplete: initComplete
        }));
    }
    function renderAction(id, type, row) {
        return "<div data-id='" + id + "' data-appname='" + row.appName + "' data-appreadme='" + row.appReadme + "' data-power='" + row.addWechatFotomore + "'>\n\t\t\t<a href='javascript:;' class='tr-edit-btn'>\u7F16\u8F91   </a>\n\t\t\t<a href='javascript:;' class='tr-train-btn'>\u5168\u91CF\u8BAD\u7EC3</a>\n\t\t</div>";
    }
    // 编辑
    function bindEditEvent() {
        $('#table').on('click', '.tr-edit-btn', function () {
            var endLoading = utils.loadingBtn($(this));
            var ndata = $(this).closest('div').data();
            var id = ndata.id;
            var appname = ndata.appname;
            var appreadme = ndata.appreadme;
            var power = ndata.power;
            $.ajax({
                url: 'superadmin/user/listByApp',
                type: 'POST',
                data: {
                    id: id
                },
                success: function (msg) {
                    if (msg.status === 'success') {
                        $('#users').val(getArr(msg.rows)).trigger('change');
                        $('#appName').val(appname);
                        $('#appReadme').val(appreadme);
                        $('#create-modal').modal('show').find('.modal-title').text('编辑应用');
                        if (power) {
                            $('.power-choose input#withPower').prop('checked', true);
                            $('.power-choose input#noPower').prop('checked', false);
                        }
                        else {
                            $('.power-choose input#noPower').prop('checked', true);
                            $('.power-choose input#withPower').prop('checked', false);
                        }
                        state = 'update';
                    }
                },
                complete: function () {
                    endLoading();
                }
            });
        });
    }
    // 全量训练
    function bindTrainEvent() {
        $('#table').on('click', '.tr-train-btn', function () {
            var endLoading = utils.loadingBtn($(this));
            var appid = $(this).closest('div').data('id');
            $.ajax({
                url: 'train/trainReset ',
                data: {
                    appid: appid
                },
                success: function (msg) {
                    utils.alertMessage(msg.msg, !msg.error);
                },
                complete: function () {
                    endLoading();
                }
            });
        });
    }
    function formatData(data) {
        return data.map(function (v) {
            return {
                id: v.id,
                text: v.adminName
            };
        });
    }
    function getArr(data) {
        var arr = data.map(function (v) {
            return v.id;
        });
        return arr;
    }
    function initSelect2() {
        $.ajax({
            url: 'superadmin/user/listAll',
            type: 'POST',
            success: function (data) {
                if (data.status === 'success') {
                    $('#users').select2({
                        placeholder: '请选择用户',
                        data: formatData(data.rows),
                        allowClear: true
                    });
                }
            }
        });
    }
    function initComplete() {
        var table = $('#table').DataTable();
        // 查询功能
        initSelect2();
        $('#search-btn').on('click', function () {
            table.draw();
        });
        tables.bindPageChange(table); // 绑定修改分页
        bindEditEvent();
        bindTrainEvent();
        // 删除功能
        tables.delBtnClick({
            el: $('#delete-btn'),
            table: table,
            name: '应用',
            url: 'superadmin/app/delete'
        });
        // 添加功能
        $('#add-btn').on('click', function () {
            $('#create-modal').modal('show').find('.modal-title').text('添加应用');
            state = 'add';
        });
        // 确定编辑
        $('#create-submit-btn').on('click', function () {
            var id;
            var appName = $('#appName').val();
            var appReadme = $('#appReadme').val();
            var isAddWechatFotomore = $('.power-choose input:checked').val();
            var userIds = $('#users').val().join(',');
            var el = $(this);
            if (state === 'add') {
                id = undefined;
            }
            else {
                var tableData = tables.getSelected(table)[0];
                id = tableData.id;
            }
            var data = {
                id: id,
                userIds: userIds,
                appName: appName,
                appReadme: appReadme,
                isAddWechatFotomore: isAddWechatFotomore
            };
            if (!appName) {
                utils.alertMessage('请填写应用名!');
                return;
            }
            else if (!appReadme) {
                utils.alertMessage('请填写应用简介!');
                return;
            }
            utils.loadingBtn(el);
            $.ajax({
                url: 'superadmin/app/' + state,
                type: 'POST',
                data: utils.cleanObject(data),
                success: function (msg) {
                    if (!msg.error) {
                        $('#create-modal').modal('hide');
                        table.draw();
                    }
                    utils.alertMessage(msg.msg, !msg.error);
                },
                complete: function () {
                    utils.endLoadingBtn(el);
                }
            });
        });
        // 清空模态框
        $('#create-modal').on('hidden.bs.modal', function () {
            $('#users').val(null);
            $('#appName').val(null);
            $('#appReadme').val(null);
            $('#noPower').prop('checked', false);
            $('#withPower').prop('checked', false);
            $('#users').val(null).trigger('change');
        });
    }
})(SuperadminAppIndex || (SuperadminAppIndex = {}));


/***/ }),

/***/ 953:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1159]);
//# sourceMappingURL=42.js.map