webpackJsonp([49],{

/***/ 1138:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(551);


/***/ }),

/***/ 551:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var new_table_1 = __webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(37);
var daterangepicker_1 = __webpack_require__(21);
__webpack_require__(86);
__webpack_require__(936);
var ParaphraseIndex;
(function (ParaphraseIndex) {
    var table = new new_table_1.Table({
        el: $('#table'),
        checkbox: {
            data: 'id'
        },
        options: {
            ajax: {
                url: 'paraphrase/list',
                type: 'POST',
                data: function (data) {
                    return {
                        keyword: $.trim($('#keyword').val()),
                        page: tables_1.getPage(data),
                        size: data.length
                    };
                },
                dataSrc: function (data) {
                    return data.rows;
                }
            },
            serverSide: true,
            paging: true,
            columns: [
                { data: 'paraphraseType.typeName', title: '规则名称' },
                { data: 'paraphraseRules', title: '规则内容', width: '70%', createdCell: function (td, data) { tables_1.createAddTitle(td, getContent(data)); }, render: getContent },
                { data: 'paraphraseType.tsp', title: '更新时间', render: renderTime }
            ],
            initComplete: initComplete
        }
    });
    function getContent(data) {
        var str = data.map(function (v) {
            return v.ptext;
        }).join(' | ');
        return str;
    }
    function renderTime(time) {
        return moment(time).format('YYYY-MM-DD');
    }
    function initComplete() {
        var dt = table.dt;
        var classifyData = selectData.classify.map(function (v) {
            var d = {
                id: v.id,
                text: v.name,
                parent: v.parent
            };
            if (d.parent === 0) {
                d.parent = '#';
            }
            return d;
        });
        var classify = new utils_1.ClassifyTree({
            el: $('#set-classify'),
            data: classifyData,
            selected: true
        });
        var typeId = null;
        var editor = new utils_1.Editor({ el: $('#editor') });
        new daterangepicker_1.SimpleDate({ el: $('#start-date'), date: moment() });
        new daterangepicker_1.SimpleDate({ el: $('#end-date'), date: moment().add(5, 'year') });
        tables_1.bindPageChange($('#table').DataTable(), $('#page-change'));
        utils_1.bindEnter($('#lable-area'), function () {
            $('#preview-btn').click();
        });
        utils_1.bindEnter($('#keyword'), function () {
            table.reload(true);
            // table.draw();
        });
        $('#add-repeat-btn').on('click', function () {
            window.location.href = 'knowledge/rehearsalReview/index';
        });
        $('#search-btn').on('click', function () {
            table.reload(true);
            // table.draw();
        });
        $('#del-btn').on('click', function () {
            var data = table.selected;
            if (!data || data.length <= 0) {
                utils_1.alertMessage('请选择要删除的规则');
            }
            else {
                $('#del-modal').modal('show');
            }
        });
        $('#confirm-del-btn').on('click', function () {
            var data = table.selected;
            var ids = data.map(function (v) {
                return v.paraphraseType.id;
            });
            $.ajax({
                url: 'paraphrase/delete',
                type: 'GET',
                data: {
                    ids: ids.join(',')
                },
                success: function (msg) {
                    utils_1.alertMessage(msg.msg, msg.code);
                    if (!msg.error) {
                        table.reload();
                        // table.draw();
                    }
                }
            });
        });
        $('#add-btn').on('click', function () {
            location.href = ctx + '/paraphrase/update/index';
        });
        $('#update-btn').on('click', function () {
            var data = table.selected;
            if (data.length <= 0) {
                utils_1.alertMessage('请选择要编辑的规则');
            }
            else if (data.length > 1) {
                utils_1.alertMessage('只能选择一条规则');
            }
            else {
                location.href = ctx + "/paraphrase/update/index?id=" + data[0].paraphraseType.id;
            }
        });
        $('#produce-btn').on('click', function () {
            var data = table.selected;
            if (data.length <= 0) {
                utils_1.alertMessage('请选择要生成复述的规则');
            }
            else if (data.length > 1) {
                utils_1.alertMessage('只能选择一条规则');
            }
            else {
                var type = data[0].paraphraseType;
                var str_1 = '';
                $('#produce-modal').modal('show');
                $('#rule-title').text(type.typeName);
                typeId = type.id;
                type.content.split(',').forEach(function (v) {
                    str_1 += "\n                    <div class=\"form-group cloud-group\">\n                        <label class=\"cloud-input-title\">" + v + "</label>\n                        <div class=\"cloud-input-content\">\n                            <input type=\"text\" class=\"form-control input-sm label-item\" data-name=\"" + v + "\">\n                        </div>\n                    </div>";
                });
                $('#lable-area').html(str_1);
            }
        });
        $('#produce-modal').one('shown.bs.modal', function () {
            classify.adjustWidth();
        });
        $('#produce-modal').on('hidden.bs.modal', function () {
            typeId = null;
            $('#preview-area').empty();
            classify.selected = [classify.data[0].id];
            editor.editorElement.$txt.html('<p>无回复</p>');
        });
        $('#preview-btn').on('click', function () {
            if (typeId === null) {
                return;
            }
            else {
                var d = getTag();
                var btn_1 = $('#preview-btn');
                if (d) {
                    utils_1.loadingBtn(btn_1);
                    $.ajax({
                        url: 'paraphrase/preview',
                        type: 'POST',
                        data: {
                            typeid: typeId,
                            tags: JSON.stringify(d)
                        },
                        success: function (msg) {
                            if (msg.error) {
                                utils_1.alertMessage(msg.msg, !msg.error);
                            }
                            else {
                                $('#preview-area').html(msg.msg.join('\r\n'));
                            }
                        },
                        complete: function () {
                            utils_1.endLoadingBtn(btn_1);
                        }
                    });
                }
            }
        });
        $('#produce-save-btn').on('click', function () {
            var btn = $('#produce-save-btn'), tags = getTag(), editEl = editor.editorElement.$txt, text = $.trim(editEl.formatText()), html = editEl.html(), beginTime = $('#start-date').val(), endTime = $('#end-date').val(), data = {
                classifyid: classify.selected.join(','),
                status: 8,
                characterid: $('#character').val(),
                pushway: $('#pushway').val(),
                beginTime: beginTime,
                endTime: endTime,
                typeid: typeId
            };
            if (moment(beginTime).valueOf() >= moment(endTime).valueOf()) {
                utils_1.alertMessage('失效时间不可早于生效时间');
            }
            else if (!tags) {
                return;
            }
            else if (!text) {
                utils_1.alertMessage('请填写回复内容');
            }
            else {
                utils_1.loadingBtn(btn);
                Object.assign(data, {
                    tags: JSON.stringify(tags),
                    plain_text: text,
                    html_content: html
                });
                $.ajax({
                    url: 'paraphrase/save2db',
                    type: 'POST',
                    data: data,
                    success: function (msg) {
                        utils_1.alertMessage(msg.msg, !msg.error);
                        if (!msg.error) {
                            $('#produce-modal').modal('hide');
                        }
                    },
                    complete: function () {
                        utils_1.endLoadingBtn(btn);
                    }
                });
            }
        });
    }
    function getTag() {
        var data = $('#produce-modal .label-item').toArray();
        var d = {};
        var check = true;
        if (data.length <= 0) {
            check = false;
        }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var i = data_1[_i];
            var el = $(i);
            var val = $.trim(el.val());
            if (val === '' || val === undefined) {
                utils_1.alertMessage('请填写标签内容');
                check = false;
                break;
            }
            else {
                d[el.attr('data-name')] = val;
            }
        }
        if (!check) {
            return false;
        }
        else {
            return d;
        }
    }
})(ParaphraseIndex || (ParaphraseIndex = {}));


/***/ }),

/***/ 936:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1138]);
//# sourceMappingURL=49.js.map