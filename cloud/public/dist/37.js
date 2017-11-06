webpackJsonp([37],{

/***/ 1166:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(578);


/***/ }),

/***/ 578:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(7);
var tables = __webpack_require__(13);
__webpack_require__(21);
var utils = __webpack_require__(5);
__webpack_require__(47);
__webpack_require__(959);
var SuperadminUserIndex;
(function (SuperadminUserIndex) {
    var action;
    (function (action) {
        action[action["block"] = 0] = "block";
        action[action["reopen"] = 1] = "reopen";
    })(action || (action = {}));
    var isSelectInited = false;
    var cPwd;
    $(function () {
        initSelect2();
        initTable();
        cPwd = $('.cloud-password').cPassword();
    });
    var editId;
    function initTable() {
        $('#table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'superadmin/user/list',
                type: 'POST',
                dataType: 'json',
                dataSrc: function (data) {
                    return data.rows;
                },
                data: function (data) {
                    var d = {
                        page: tables.getPage(data),
                        rows: parseInt($('#page-change').val().trim()),
                        adminName: $.trim($('#adminName').val()),
                        email: $.trim($('#email').val()),
                        status: $.trim($('#status').val()),
                        sortField: '',
                        sortType: ''
                    };
                    return utils.cleanObject(d);
                }
            },
            initComplete: initcomplete,
            columns: [
                { data: 'adminName', title: '用户名' },
                { data: 'email', title: '邮箱' },
                { data: 'status', title: '状态', render: renderStatus },
                { data: 'regTime', title: '创建时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime },
                {
                    data: 'id',
                    title: '操作',
                    className: 'prevent cloud-table-action',
                    render: function (id) {
                        return "<a href='javascript:;' data-id='" + id + "' class='single-edit'>\u7F16\u8F91</a> ";
                    }
                }
            ]
        }));
    }
    function renderStatus(text) {
        switch (text) {
            case 1:
                return '启用';
            case 0:
                return '停用';
            default:
                return '';
        }
    }
    function formatData(data) {
        return data.map(function (v) {
            return {
                id: v.id,
                text: v.appName
            };
        });
    }
    function initSelect2() {
        $.ajax({
            url: 'superadmin/app/list',
            type: 'POST',
            success: function (data) {
                if (data.status === 'success') {
                    $('.apps').select2({
                        placeholder: '请选择应用',
                        data: formatData(data.rows),
                        allowClear: true
                    });
                    isSelectInited = true;
                }
            }
        });
    }
    function initcomplete() {
        var table = $('#table').DataTable();
        var editRoot = $('#edit-modal');
        var addRoot = $('#add-modal');
        tables.bindPageChange(table, $('#page-change'));
        // 查询按钮
        $('#search-btn').on('click', function () {
            table.draw();
        });
        // 编辑
        bindEditSingle();
        // 唯一性校验
        bindAdminNameVerifyEvent();
        bindEmailVerifyEvent();
        // 编辑模块中的保存按钮
        $('#edit-submit-btn').on('click', function () {
            var result = validator(editRoot, 'edit');
            if (result) {
                var endLoading_1 = utils.loadingBtn($(this));
                // 分配的应用
                var appIds = editRoot.find('.apps').val();
                if (appIds.length === 0) {
                    utils.alertMessage('应用不能为空！', false);
                    endLoading_1();
                    return;
                }
                // 表单校验成功则传数据到后台
                $.ajax({
                    url: 'superadmin/user/update',
                    type: 'POST',
                    data: __assign({}, result, { appIds: appIds.join(',') }),
                    success: function (msg) {
                        if (!msg.error) {
                            editRoot.modal('hide');
                            table.draw();
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading_1();
                    }
                });
            }
        });
        // 添加用户按钮
        $('#add-btn').on('click', function () {
            // 生成默认密码
            // $('.password').val(Math.random().toString().slice(-6));
            if (!isSelectInited) {
                utils.alertMessage('应用app数据尚未初始化完毕，请稍后重试！', false);
            }
            else {
                addRoot.modal('show');
            }
        });
        // 添加用户中的添加按钮
        $('#add-submit-btn').on('click', function () {
            editId = '';
            var result = validator(addRoot, 'add');
            // 状态值：
            var status = $('input[name="isOpen"]:checked').val();
            // 校验表单数据
            if (result) {
                var endLoading_2 = utils.loadingBtn($(this));
                // 分配的应用
                var appIds = addRoot.find('.apps').val();
                if (appIds.length === 0) {
                    utils.alertMessage('应用不能为空！', false);
                    endLoading_2();
                    return;
                }
                $.ajax({
                    url: 'superadmin/user/add',
                    type: 'POST',
                    data: Object.assign(result, {
                        appIds: appIds.join(','),
                        status: status
                    }),
                    success: function (msg) {
                        if (!msg.error) {
                            addRoot.modal('hide');
                            table.draw();
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        endLoading_2();
                    }
                });
            }
        });
        // 清空
        addRoot.on('hidden.bs.modal', function () {
            addRoot.find('.apps').val(null).trigger('change');
            getData('.id').forEach(function (v) {
                addRoot.find(v.el).val('');
            });
            $('input[name="isOpen"]:first').prop('checked', 'checked');
            cPwd.resetCPwd();
            $('input.error-validate').removeClass('error-validate');
            $('.validate-msg').hide();
        });
        editRoot.on('hide.bs.modal', function () {
            $('input.error-validate').removeClass('error-validate');
            $('.validate-msg').hide();
        });
        // 启用按钮
        $('#enable-btn').on('click', function () {
            changeStatus($(this), 'superadmin/user/reopen', table, action.reopen);
        });
        // 禁用按钮
        $('#disable-btn').on('click', function () {
            changeStatus($(this), 'superadmin/user/block', table, action.block);
        });
        // 回车即可以重新查询表格
        tables.bindEnter(table, $('#adminName,#mobile,#status'));
    }
    // 编辑功能
    function bindEditSingle() {
        var editRoot = $('#edit-modal');
        $('#table').on('click', '.single-edit', function (e) {
            if (!isSelectInited) {
                utils.alertMessage('应用app数据尚未初始化完毕，请稍后重试！', false);
            }
            else {
                var id = $(e.target).data('id');
                editId = id;
                $.ajax({
                    url: 'superadmin/user/findOne',
                    data: {
                        id: id
                    },
                    success: function (msg) {
                        if (msg.code === '200') {
                            editRoot.modal('show');
                            getData('.c-password').forEach(function (v) {
                                editRoot.find(v.el).val(msg.data[v.name]);
                            });
                            editRoot.find('.apps').val(msg.data.appIdList).trigger('change');
                        }
                        else {
                            utils.alertMessage("\u540E\u7AEF\u6570\u636E\u5F02\u5E38\uFF1A" + msg.msg, !msg.error);
                        }
                    }
                });
            }
        });
    }
    // 用户名、邮件名唯一性的实时校验
    function bindAdminNameVerifyEvent() {
        $('.admin-name').on('change', function (e) {
            verify({ name: $.trim($(e.target).val()), flag: 0 }, $(e.target));
        });
    }
    function bindEmailVerifyEvent() {
        $('.email').on('change', function (e) {
            verify({ email: $.trim($(e.target).val()), flag: 1 }, $(e.target));
        });
    }
    function verify(data, $el) {
        var sendData;
        if (editId) {
            sendData = Object.assign.apply(Object, [{ id: editId }].concat(data));
        }
        $.ajax({
            url: 'superadmin/user/verify',
            data: editId ? sendData : data,
            success: function (msg) {
                if (msg.error) {
                    $el.addClass('error-validate').focus();
                    $el.next('.validate-msg').css('display', 'inline-block');
                }
                else {
                    $el.removeClass('error-validate');
                    $el.next('.validate-msg').css('display', 'none');
                }
            }
        });
    }
    /**
     *
     * 禁用和启用功能的通用方法
     * @param {any} el 按钮元素
     * @param {any} status 要改变成的状态的名称
     * @param {any} url 后台接口
     * @param {any} table 需要被重新绘制的table
     * @param {any} bool 用于区分是启动还禁用的标识符
     * @returns
     */
    function changeStatus(el, url, table, act) {
        var endLoading = utils.loadingBtn(el);
        var ids = [];
        var actName;
        act === action.reopen ? actName = '启用' : actName = '停用';
        tables.checkLength({
            action: actName,
            name: '用户信息',
            unique: false,
            table: table,
            cb: function (datas, rows) {
                datas.forEach(function (v) {
                    if (act !== v.status) {
                        if (v.id) {
                            ids.push(v.id);
                        }
                    }
                });
                if (!ids[0]) {
                    utils.alertMessage('后端数据异常，无法获取id！', false);
                    return;
                }
                if (ids.length === 0) {
                    utils.alertMessage("\u65E0\u6CD5" + actName + "\u72B6\u6001\u4E3A\u5DF2" + actName + "\u7684\u7528\u6237\uFF01");
                    return;
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {
                        ids: ids.join(',')
                    },
                    success: function (msg) {
                        if (!msg.error) {
                            table.draw();
                        }
                        utils.alertMessage(msg.msg, !msg.error);
                    }
                });
            }
        });
        endLoading();
    }
    /**
     *
     * @param {any} el 要进行表单验证的modal框
     * @param {any} msg 用于区分要过滤那个表单元素的标识符
     * @returns 如果表单校验不通过，返回值为空；表单校验通过，则返回将要传个后台的数据
     */
    function validator(el, msg) {
        var currentData = [];
        if (msg === 'add') {
            currentData = getData('.id');
        }
        else if (msg === 'edit') {
            currentData = getData('.c-password');
        }
        var ajaxData = {};
        for (var _i = 0, currentData_1 = currentData; _i < currentData_1.length; _i++) {
            var v = currentData_1[_i];
            var input = el.find(v.el);
            var val = $.trim(input.val());
            var name_1 = input.parent().prev().text();
            if (v.name === 'password') {
                name_1 = '密码';
            }
            if (v.require && val === '') {
                utils.alertMessage(name_1 + "\u7684\u503C\u4E0D\u80FD\u4E3A\u7A7A");
                return false;
            }
            if (v.pattern && !v.pattern.test(val)) {
                utils.alertMessage("" + (v.patternMsg ? name_1 + '的格式不正确！' + v.patternMsg : name_1 + '的格式不正确！'));
                return false;
            }
            ajaxData[v.name] = val;
        }
        return ajaxData;
    }
    /**
     *
     * 提交表单之前获取表单中的数据
     * @param {string[]} [filter]  需要被过滤掉的值
     * @returns 返回对应的表单中的数据
     */
    function getData(filter) {
        // 页面中各个表单里通用的中表单域值及其相关信息
        var data = [
            {
                name: 'id',
                require: false,
                el: '.id'
            },
            {
                name: 'adminName',
                require: true,
                el: '.admin-name'
            },
            {
                name: 'email',
                pattern: /^[a-zA-Z0-9_\-\.]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
                require: true,
                el: '.email'
            },
            {
                name: 'password',
                pattern: /(\w{6,})|([`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]{6,})|(\w[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]{6,})|([`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]\w{6,})/i,
                patternMsg: '（密码由6位以上（数字、字母、特殊字符组成））',
                require: true,
                el: '.c-password'
            },
            {
                name: 'mobile',
                pattern: /^(1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}){0,1}$/,
                require: false,
                el: '.mobile'
            },
            {
                name: 'qq',
                pattern: /^([1-9][0-9]{4,14}){0,1}$/,
                patternMsg: '（qq号为5到15位数字组成）！',
                require: false,
                el: '.qq'
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
})(SuperadminUserIndex || (SuperadminUserIndex = {}));


/***/ }),

/***/ 959:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1166]);
//# sourceMappingURL=37.js.map