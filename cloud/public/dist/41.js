webpackJsonp([41],{

/***/ 1161:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(573);


/***/ }),

/***/ 573:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(7);
__webpack_require__(21);
__webpack_require__(86);
var tables = __webpack_require__(13);
__webpack_require__(955);
var SuperadminBulletinIndex;
(function (SuperadminBulletinIndex) {
    var state;
    var editor;
    $(initTable);
    function initTable() {
        var width = tables.VARIABLES.width;
        var date = new utils.CommonDate({
            el: $('#create-date')
        });
        $('#table').DataTable(Object.assign(tables.commonConfig(), {
            ajax: {
                url: 'superadmin/bulletin/list',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    return utils.cleanObject({
                        page: tables.getPage(data),
                        rows: data.length,
                        title: $('#search-title').val(),
                        plainText: $('#search-plainText').val(),
                        beginTime: date.getDate('start'),
                        endTime: date.getDate('end')
                    });
                }
            },
            columns: [
                { data: 'title', title: '公告标题', createdCell: tables.createAddTitle },
                { data: 'adminUserName', title: '用户' },
                { data: 'plainText', title: '公告内容', createdCell: tables.createAddTitle },
                { data: 'createTime', width: width.commonTime, title: '创建时间', render: utils.renderCommonTime }
            ],
            initComplete: initComplete
        }));
    }
    function initEditor() {
        editor = new utils.Editor({
            el: $('#plainText')
        }).editorElement;
    }
    function initComplete() {
        var table = $('#table').DataTable();
        // 查询功能
        initEditor();
        $('#search-btn').on('click', function () {
            table.draw();
        });
        tables.bindPageChange(table); // 绑定修改分页
        // 删除功能
        tables.delBtnClick({
            el: $('#delete-btn'),
            table: table,
            name: '公告',
            url: 'superadmin/bulletin/delete'
        });
        // 编辑功能
        $('#edit-btn').on('click', function () {
            tables.checkLength({
                action: '编辑',
                name: '公告',
                table: table,
                unique: true,
                cb: function (data, row) {
                    $('#create-modal').modal('show').find('.modal-title').text('编辑公告');
                    state = 'update';
                    $('#title').val(data.title);
                    editor.$txt.html(data.contentHtml);
                }
            });
        });
        // 添加功能
        $('#add-btn').on('click', function () {
            $('#create-modal').modal('show').find('.modal-title').text('添加公告');
            state = 'add';
        });
        // 确定编辑
        $('#create-submit-btn').on('click', function () {
            var id;
            var title = $('#title').val();
            var plainText = editor.$txt.html();
            if (state === 'add') {
                id = undefined;
            }
            else {
                var tableData = tables.getSelected(table)[0];
                id = tableData.id;
            }
            ;
            var data = {
                id: id,
                title: title,
                plainText: utils.formatText(plainText),
                contentHtml: plainText
            };
            var el = $(this);
            if (!title) {
                utils.alertMessage('请填写公告标题!');
                return;
            }
            else if (title.lenth > 50) {
                utils.alertMessage('公告标题不能超过50个字!');
                return;
            }
            else if (plainText === '<p><br></p>' || !plainText) {
                utils.alertMessage('请填写公告内容!');
                return;
            }
            utils.loadingBtn(el);
            $.ajax({
                url: 'superadmin/bulletin/' + state,
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
            $('#title').val(null);
            editor.$txt.html('');
        });
    }
})(SuperadminBulletinIndex || (SuperadminBulletinIndex = {}));


/***/ }),

/***/ 955:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1161]);
//# sourceMappingURL=41.js.map