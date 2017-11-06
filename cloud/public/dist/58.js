webpackJsonp([58],{

/***/ 1121:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(535);


/***/ }),

/***/ 535:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(918);
var utils_1 = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
var daterangepicker_1 = __webpack_require__(21);
var DialogIndex;
(function (DialogIndex) {
    var table, state;
    var t;
    $(function () {
        initDataTables();
        initBtn();
        initDate();
    });
    function initDataTables() {
        var width = tables_1.VARIABLES.width;
        table = $('#key-table').DataTable(Object.assign(tables_1.commonConfig(), {
            ajax: {
                type: 'POST',
                url: 'knowledge/dialog/list',
                dataSrc: function (data) { return data.rows; },
                data: function (d) {
                    var data = {
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length
                    };
                    return utils_1.cleanObject(data);
                }
            },
            columns: [
                { data: 'dialogName', title: '对话模型名称', createdCell: tables_1.createAddTitle },
                { data: 'character.vname', width: 8 * width.char, title: '应用到的虚拟角色' },
                { data: 'startTime', width: width.simpleTime, title: '生效时间', render: utils_1.renderSimpleTime },
                { data: 'endTime', width: width.simpleTime, title: '失效时间', render: utils_1.renderSimpleTime },
                { data: 'isReaccess', width: 8 * width.char, title: '是否允许重复进入', render: renderAccess }
            ]
        }));
        t = new tables_1.Table(table);
        $('#search-btn').on('click', function () {
            // table.draw();
            t.refresh(true);
        });
        tables_1.bindPageChange(table, $('#page-change'));
        /*$('#page-change').on('change', function () {
            let len = $(this).val();
            table.page.len(len).draw();
        });*/
    }
    function renderAccess(status) {
        switch (status) {
            case 0:
                return '不允许';
            case 1:
                return '允许';
            default:
                return '';
        }
    }
    function initBtnEditDetails() {
        $('#edit-more-btn').on('click', function () {
            var select = $('.selected');
            if (select.length > 1) {
                utils_1.alertMessage('只能编辑一个对话模型!');
            }
            else if (select.length < 1) {
                utils_1.alertMessage('请选择要编辑的对话模型!');
            }
            else {
                var id = table.row(select).data().id;
                window.location.href = ctx + '/knowledge/dialog/update?id=' + id;
            }
        });
    }
    function initBtn() {
        initBtnCreate();
        initBtnDelete();
        initBtnEditDetails();
        initBtnEdit();
        initSubmit();
    }
    function initSubmit() {
        $('#create-submit-btn').on('click', function () {
            var dialogName = $.trim($('#dialogName').val()), reg = /^[a-zA-Z0-9\u4E00-\u9FA5]+$/, ir = $('#isReaccess').prop('checked') ? 1 : 0, data = {
                dialogName: dialogName,
                character: $('#select-character').val(),
                startTime: $('#start-date').val(),
                endTime: $('#end-date').val(),
                isReaccess: ir
            }, el = $(this);
            if (!dialogName) {
                utils_1.alertMessage('请填写对话模型名称!');
            }
            else if (!dialogName.match(reg)) {
                utils_1.alertMessage('对话模型名称只能是数字,英文或中文!');
            }
            else {
                utils_1.loadingBtn(el);
                var url = void 0;
                var bool_1;
                if (state === 'add') {
                    url = 'knowledge/dialog/add';
                    bool_1 = true;
                }
                else if (state === 'edit') {
                    url = 'knowledge/dialog/modify';
                    data.id = table.row($('.selected')).data().id;
                    bool_1 = false;
                }
                else {
                    return;
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data,
                    success: function (msg) {
                        if (!msg.error) {
                            $('#create-modal').modal('hide');
                            t.refresh(bool_1);
                        }
                        utils_1.alertMessage(msg.msg, !msg.error);
                    },
                    complete: function () {
                        utils_1.endLoadingBtn(el);
                    }
                });
            }
        });
        $('#create-modal').on('hidden.bs.modal', function () {
            var select = $('#select-character');
            var btn = $('#create-submit-btn');
            $('#dialogName').val(null);
            $('#isReaccess').prop('checked', null);
            select.val(select.find('option').first().val())
                .prop('disabled', null);
            $('#start-date').val(moment().format('YYYY-MM-DD'));
            $('#end-date').val(moment().add(5, 'year').format('YYYY-MM-DD'));
            if (btn.prop('disabled')) {
                utils_1.endLoadingBtn(btn);
            }
        });
    }
    function initBtnCreate() {
        $('#add-btn').on('click', function () {
            $('#create-modal').modal('show').find('.modal-title').text('创建对话模型');
            state = 'add';
        });
    }
    function initBtnDelete() {
        $('#del-btn').on('click', function () {
            var select = $('.selected');
            if (select.length < 1) {
                utils_1.alertMessage('请选择要删除的对话模型!');
            }
            else {
                var ids_1 = Array.prototype.map.call(select, function (v) {
                    var data = table.row(v).data();
                    return data.id;
                });
                ids_1 = ids_1.join(',');
                utils_1.confirmModal({
                    msg: '确认删除选中对话吗？',
                    cb: function (modal, btn) {
                        var end = utils_1.loadingBtn(btn);
                        $.ajax({
                            url: 'knowledge/dialog/delete',
                            type: 'POST',
                            data: {
                                ids: ids_1
                            },
                            success: function (msg) {
                                utils_1.alertMessage(msg.msg, msg.code);
                                t.refresh();
                                modal.modal('hide');
                            },
                            complete: function () {
                                end();
                            }
                        });
                    }
                });
                // BootstrapDialog.show({
                // 	title: '温馨提示',
                // 	message: '确认删除选中对话吗？',
                // 	size: BootstrapDialog.SIZE_SMALL,
                // 	buttons: [
                // 		{
                // 			label: '确认',
                // 			cssClass: 'btn-danger',
                // 			action: function (dialogItself) {
                // 				deleteByIds(ids);
                // 				dialogItself.close();
                // 			}
                // 		},
                // 		{
                // 			label: '取消',
                // 			cssClass: 'btn-default',
                // 			action: function (dialogItself) {
                // 				dialogItself.close();
                // 			}
                // 		}
                // 	]
                // });
            }
        });
    }
    function initDate() {
        new daterangepicker_1.SimpleDate({
            el: $('#start-date')
        });
        new daterangepicker_1.SimpleDate({
            el: $('#end-date'),
            date: moment().add(5, 'year')
        });
    }
    function initBtnEdit() {
        $('#edit-btn').on('click', function () {
            var select = $('.selected');
            if (select.length > 1) {
                utils_1.alertMessage('只能编辑一个对话模型!');
            }
            else if (select.length < 1) {
                utils_1.alertMessage('请选择要编辑的对话模型!');
            }
            else {
                var data = table.row(select).data();
                $('#create-modal').modal('show').find('.modal-title').text('编辑基本信息');
                state = 'edit';
                $('#dialogName').val(data.dialogName);
                $('#select-character').val(data.character.id).prop('disabled', true);
                $('#start-date').val(utils_1.renderSimpleTime(data.startTime));
                $('#end-date').val(utils_1.renderSimpleTime(data.endTime));
                if (data.isReaccess === 0) {
                    $('#isReaccess').prop('checked', null);
                }
                if (data.isReaccess === 1) {
                    $('#isReaccess').prop('checked', true);
                }
            }
        });
    }
})(DialogIndex || (DialogIndex = {}));


/***/ }),

/***/ 918:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1121]);
//# sourceMappingURL=58.js.map