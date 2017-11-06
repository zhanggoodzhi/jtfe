webpackJsonp([28],{

/***/ 1155:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(567);


/***/ }),

/***/ 289:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 306:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(36);
__webpack_require__(289);
var upload_1 = __webpack_require__(30);
var Word = /** @class */ (function () {
    function Word(props) {
        var _this = this;
        this.initComplete = function () {
            var table = $('#key-table').DataTable();
            var t = new tables_1.Table(table);
            var name = _this.props.wordName;
            tables_1.delBtnClick({
                table: table,
                url: _this.props.path + '/delete',
                name: name,
                type: _this.props.delType,
                el: $('#del-btn')
            });
            var uploadBtn = $('#upload-submit-btn');
            var upload = new upload_1.DelayUpload({
                accept: '.xls,xlsx',
                url: _this.props.path + '/batchupload',
                name: 'uploadedFile',
                saveBtn: $('#upload-wrap'),
                submitBtn: uploadBtn,
                save: function (id, fileName) {
                    $('#info-wrap').show();
                    $('#info-name').text(fileName);
                },
                success: function (msg) {
                    if (!msg.error) {
                        utils_1.alertMessage(msg.msg, msg.code, false);
                        $('#upload').modal('hide');
                        t.refresh();
                        $('#info-wrap').hide();
                        $('#info-name').text('');
                    }
                },
                cancel: function () {
                    $('#info-wrap').hide();
                    $('#info-name').text('');
                }
            });
            $('#upload').on('hide.bs.modal', function () {
                upload.cancel();
            });
            // const upload = new Upload({
            //     url: this.props.path + '/batchupload',
            //     name: 'uploadedFile',
            //     accept: '.xlsx,.xls',
            //     bindChangeEvent: false,
            //     success: (msg) => {
            //         alertMessage(msg.msg, msg.code, false);
            //         if (!msg.error) {
            //             $('#upload').modal('hide');
            //             // table.draw();
            //             t.refresh();
            //         }
            //     },
            //     onChange: (files) => {
            //         if (files) {
            //             $('#info-wrap').show();
            //             $('#info-name').text(files[0].name);
            //         }
            //     },
            //     clearCallback: () => {
            //         $('#info-wrap').hide();
            //         $('#info-name').text('');
            //     },
            //     complete: () => {
            //         endLoadingBtn(uploadBtn, '确定');
            //     }
            // });
            // $('#upload').on('hide.bs.modal', () => {
            //     upload.clear();
            // });
            // $('#upload-wrap').on('click', () => {
            //     upload.select();
            // });
            // uploadBtn.on('click', () => {
            //     if (!upload.getFiles()) {
            //         alertMessage('请选择要上传的文件');
            //         return;
            //     }
            //     loadingBtn(uploadBtn);
            //     upload.upload();
            // });
            $('#batch-upload-btn').on('click', function () {
                $('#upload').modal('show');
            });
            $('#add-btn').on('click', function () {
                $('#add-modal').modal('show');
                $('#add-word').val('');
            });
            $('#add-modal').on('shown.bs.modal', function () {
                $('#add-word').focus();
            });
            $('#add-submit').on('click', function () {
                var val = $.trim($('#add-word').val());
                if (val === '') {
                    utils_1.alertMessage(name + "\u4E0D\u80FD\u4E3A\u7A7A");
                }
                else {
                    var loading_1 = utils_1.loadingBtn($('#add-submit'));
                    var data = {};
                    data[_this.props.addParam] = $('#add-word').val();
                    $.ajax({
                        type: 'POST',
                        url: _this.props.path + '/add',
                        data: data,
                        success: function (msg) {
                            if (!msg.error) {
                                $('#add-modal').modal('hide');
                                // table.draw();
                                t.refresh(true);
                            }
                            utils_1.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            loading_1();
                        }
                    });
                }
            });
            $('#edit-btn').on('click', function () {
                var data = table.rows({ selected: true }).data();
                if (data.length < 1) {
                    utils_1.alertMessage("\u8BF7\u9009\u62E9\u8981\u7F16\u8F91\u7684" + name);
                }
                else if (data.length > 1) {
                    utils_1.alertMessage("\u53EA\u80FD\u7F16\u8F91\u4E00\u4E2A" + name);
                }
                else {
                    var currentData = data[0];
                    $('#edit-modal').modal('show');
                    $('#edit-modal-content').html("<div class='form-group'>\n                        <label>\u539F" + name + "</label>\n                        <p class='form-control-static' title='" + currentData.word + "'>" + currentData.word + "</p>\n                    </div>\n                    <div class='form-group'>\n                        <label>\u4FEE\u6539\u4E3A</label>\n                        <input type='text' class='form-control' data-id='" + currentData.id + "' value='" + currentData.word + "' data-old='" + currentData.word + "' maxlength='50'>\n                    </div>");
                    $('#edit-modal-content input:first').select();
                }
            });
            $('#edit-submit').on('click', function () {
                var data = [];
                Array.prototype.forEach.call($('#edit-modal-content input'), function (v) {
                    var el = $(v), val = $.trim(el.val());
                    if (val === el.attr('data-old')) {
                        return;
                    }
                    data.push({
                        id: el.data('id'),
                        name: val
                    });
                });
                if (data.length < 1) {
                    utils_1.alertMessage("\u672A\u4FEE\u6539" + name + "\u6216\u6240\u6709" + name + "\u4E3A\u7A7A");
                }
                else if (data[0].name.length > 255) {
                    utils_1.alertMessage(name + "\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7255\u4E2A\u5B57\u7B26");
                    return;
                }
                else {
                    var loading_2 = utils_1.loadingBtn($('#edit-submit'));
                    $.ajax({
                        url: _this.props.path + '/update',
                        type: 'POST',
                        data: JSON.stringify({ 'data': data }),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        success: function (msg) {
                            if (!msg.error) {
                                $('#edit-modal').modal('hide');
                                // table.draw(false);
                                t.refresh();
                            }
                            utils_1.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            loading_2();
                        }
                    });
                }
            });
            $('#search-btn').on('click', function () {
                // table.draw();
                t.refresh(true);
            });
            utils_1.bindEnter($('#keyword'), function () {
                // table.draw();
                t.refresh(true);
            });
            utils_1.bindEnter($('#edit-modal'), function () {
                $('#edit-submit').click();
            }, 'input');
            utils_1.bindEnter($('#add-modal'), function () {
                $('#add-submit').click();
            }, 'input');
            tables_1.bindPageChange(table, $('#page-change'));
            // $('#keyword').focus();
        };
        this.props = props;
        this.init();
    }
    Word.prototype.init = function () {
        var _this = this;
        var tname = this.props.wordName;
        $('#key-table').DataTable(Object.assign(tables_1.commonConfig(), {
            ajax: {
                type: 'POST',
                url: this.props.path + '/list',
                dataSrc: function (data) { return data.rows; },
                data: function (d) {
                    var data = {
                        page: tables_1.getPage(d),
                        rows: d.length,
                        source: $('#source').val()
                    };
                    data[_this.props.listParam] = $('#keyword').val();
                    return utils_1.cleanObject(data);
                }
            },
            columns: [
                { data: 'word', title: tname },
                { data: 'createTime', title: '创建时间', render: utils_1.renderCommonTime, width: tables_1.VARIABLES.width.commonTime },
                { data: 'updateTime', title: '修改时间', render: utils_1.renderCommonTime, width: tables_1.VARIABLES.width.commonTime }
            ],
            initComplete: this.initComplete
        }));
    };
    return Word;
}());
exports.default = Word;


/***/ }),

/***/ 567:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var word_1 = __webpack_require__(306);
$(function () {
    new word_1.default({
        path: "stopword",
        listParam: "stopword",
        wordName: "停用词",
        addParam: "stopword",
        delType: "GET"
    });
});


/***/ })

},[1155]);
//# sourceMappingURL=28.js.map