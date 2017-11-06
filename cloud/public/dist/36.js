webpackJsonp([36],{

/***/ 1168:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(580);


/***/ }),

/***/ 580:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(961);
var new_table_1 = __webpack_require__(7);
var utils = __webpack_require__(5);
var UserAppIndex;
(function (UserAppIndex) {
    var roleTable;
    var authTable;
    var ifAdd = true;
    var currentId = 0;
    var selectRoleId = 0;
    $(function () {
        init();
    });
    function init() {
        initRoleTable();
        initAuthTable();
    }
    function initRoleTable() {
        roleTable = new new_table_1.Table({
            el: $('#role-table'),
            options: {
                paging: false,
                info: false,
                serverSide: true,
                ajax: {
                    type: 'POST',
                    url: 'user/app/getRole',
                    dataSrc: function (data) { return data.data; },
                    data: function (d) {
                        return {};
                    }
                },
                // data: [{
                // 	id: '1',
                // 	text: '管理员'
                // },
                // {
                // 	id: '2',
                // 	text: '审核者'
                // }],
                initComplete: bindRoleTableEvent,
                columns: [
                    { data: 'name' },
                    {
                        data: 'id', className: 'prevent', width: '70', render: function (id) {
                            return "\n\t\t\t\t\t\t\t\t<i class=\"fa cloud-fa-icon fa-edit edit\" title=\"\u7F16\u8F91\"></i>\n\t\t\t\t\t\t\t\t<i class=\"fa cloud-fa-icon fa-trash delete\" title=\"\u5220\u9664\"></i>\n\t\t\t\t\t\t\t\t";
                        }
                    }
                ]
            }
        });
    }
    function bindRoleTableEvent() {
        var tableEl = $('#role-table');
        var modalEl = $('#role-modal');
        tableEl.DataTable().select.style('single');
        $('#add-btn').on('click', function () {
            ifAdd = true;
            $('#role-modal').modal('show');
        });
        modalEl.on('hidden.bs.modal', function () {
            $('#name').val(null);
            $('#role-modal .modal-title').text('添加角色');
        });
        tableEl.on('click', '.edit', function () {
            $('#role-modal .modal-title').text('编辑角色');
            ifAdd = false;
            var rowData = roleTable.dt.row($(this).closest('tr')).data();
            var name = rowData.name;
            currentId = rowData.id;
            $('#name').val(name);
            $('#role-modal').modal('show');
        });
        tableEl.on('click', '.delete', function () {
            var id = roleTable.dt.row($(this).closest('tr')).data().id;
            utils.confirmModal({
                msg: '确认删除该角色么?',
                cb: function (modal, btn) {
                    $.ajax({
                        url: 'user/app/delRole',
                        data: {
                            roleId: id,
                            flag: false
                        },
                        method: 'POST',
                        success: function (data) {
                            if (data.state === 'success') {
                                modal.modal('hide');
                                roleTable.reload();
                                utils.alertMessage('删除成功！', true);
                            }
                            else if (data.state === 'fail_existUser') {
                                modal.modal('hide');
                                utils.confirmModal({
                                    msg: '存在用户使用该角色，是否继续删除?',
                                    cb: function (smodal, sbtn) {
                                        $.ajax({
                                            url: 'user/app/delRole',
                                            data: {
                                                roleId: id,
                                                flag: true
                                            },
                                            method: 'POST',
                                            success: function (sdata) {
                                                if (sdata.state === 'success') {
                                                    smodal.modal('hide');
                                                    roleTable.reload();
                                                    utils.alertMessage('删除成功！', true);
                                                }
                                                else {
                                                    utils.alertMessage('删除失败！', false);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                utils.alertMessage('删除失败！', false);
                            }
                        }
                    });
                }
            });
        });
        $('#modal-save-btn').on('click', function () {
            var name = $('#name').val();
            if (name === '') {
                utils.alertMessage('请输入角色名称!');
                return;
            }
            $.ajax('user/app/addRole', {
                method: 'POST',
                data: {
                    name: name,
                    id: ifAdd ? 0 : currentId
                }
            }).done(function (data) {
                if (data.state === 'success' || data.state === 'editsuccess') {
                    utils.alertMessage(ifAdd ? '添加成功' : '编辑成功', true);
                    modalEl.modal('hide');
                    roleTable.reload();
                }
                else {
                    utils.alertMessage(data.msg);
                }
            });
        });
        tableEl.DataTable().on('select', function (e, dt, type, indexes) {
            var authDt = authTable.dt;
            var rowData = roleTable.dt.row(indexes).data();
            var id = rowData.id;
            selectRoleId = id;
            $.ajax('user/app/showPri', {
                method: 'POST',
                data: {
                    id: id
                }
            }).done(function (data) {
                if (data.state === 'success') {
                    var arr = data.msg.split(',');
                    arr.forEach(function (v) {
                        authDt.row(function (i, row) {
                            if (row.id.toString() === v) {
                                return true;
                            }
                        }).select();
                    });
                }
                else {
                    authDt.rows().deselect();
                }
            });
        });
        tableEl.DataTable().on('deselect', function (e, dt) {
            var authDt = authTable.dt;
            authDt.rows().deselect();
        });
    }
    function initAuthTable() {
        authTable = new new_table_1.Table({
            el: $('#auth-table'),
            checkbox: {
                data: 'id'
            },
            options: {
                select: {
                    style: 'api',
                    blurable: false,
                    info: false,
                    selector: 'tr td:not(.prevent)'
                },
                paging: false,
                info: false,
                serverSide: true,
                ajax: {
                    type: 'POST',
                    url: 'user/app/getPrivileges',
                    dataSrc: function (data) { return data.data; },
                    data: function (d) {
                        return {};
                    }
                },
                // data: [{
                // 	id: '1',
                // 	text: '权限1'
                // },
                // {
                // 	id: '2',
                // 	text: '权限2'
                // }],
                initComplete: bindAuthTableEvent,
                columns: [
                    { data: 'desc', title: '全选' }
                ]
            }
        });
    }
    function turnEdit() {
        $('#auth-table').DataTable().select.style('multi');
        $('#edit-btn').hide();
        $('#save-btn').show();
        $('.disabled-wrap').show();
        $('#auth-table tr').removeClass('disable');
        $('#auth-table_wrapper .dataTables_scrollHead').addClass('show');
    }
    function turnCheck() {
        $('#auth-table').DataTable().select.style('api');
        $('#save-btn').hide();
        $('#edit-btn').show();
        $('.disabled-wrap').hide();
        $('#auth-table tr').addClass('disable');
        $('#auth-table_wrapper .dataTables_scrollHead').removeClass('show');
    }
    function bindAuthTableEvent() {
        $('#auth-table tr').addClass('disable');
        $('#edit-btn').on('click', function () {
            if (Array.from(roleTable.dt.rows('.selected').data()).length === 0) {
                utils.alertMessage('请先选择一个角色！');
                return;
            }
            turnEdit();
        });
        $('#save-btn').on('click', function () {
            var selects = Array.from(authTable.dt.rows('.selected').data());
            var ids = selects.map(function (v) {
                return v.id;
            });
            $.ajax('user/app/editPri', {
                method: 'POST',
                data: {
                    roleid: selectRoleId,
                    pris: ids.join(',')
                }
            }).done(function (data) {
                if (data.state === 'add' || data.state === 'success' || data.state === 'delete') {
                    utils.alertMessage('编辑权限成功', true);
                    turnCheck();
                }
                else {
                    utils.alertMessage(data.msg);
                }
            });
        });
    }
})(UserAppIndex || (UserAppIndex = {}));


/***/ }),

/***/ 961:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1168]);
//# sourceMappingURL=36.js.map