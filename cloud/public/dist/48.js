webpackJsonp([48],{

/***/ 1139:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(552);


/***/ }),

/***/ 552:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var new_table_1 = __webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(37);
__webpack_require__(937);
var ParaphraseUpdateIndex;
(function (ParaphraseUpdateIndex) {
    var listData = [], delData = [];
    var originData;
    $(function () {
        initTree();
        resizeInput();
    });
    function initTable(tree) {
        var table = new new_table_1.Table({
            el: $('#table'),
            options: {
                serverSide: true,
                paging: true,
                ajax: {
                    url: 'paraphrase/listPairs',
                    type: 'POST',
                    data: function (data) {
                        var classify = tree.selected;
                        return utils_1.cleanObject(new_table_1.extendsData(data, {
                            keyword: $.trim($('#question').val()),
                            classifys: classify.join(','),
                            corpusStatus: $('#status').val()
                        }));
                    },
                    dataSrc: function (data) { return data.rows; }
                },
                columns: [
                    { data: 'literal', title: '问题' }
                ],
                drawCallback: resizeInput,
                initComplete: initComplete
            }
        });
        $('#table')
            .on('select.dt', function (e, dt, t, indexes) {
            if (t === 'row') {
                dt.rows(indexes).data().toArray().forEach(function (v) {
                    if (checkText(v.literal)) {
                        addListItem({
                            text: v.literal
                        });
                    }
                });
                resizeInput();
            }
        });
        function initComplete() {
            var dt = table.dt;
            if (!isUpdate) {
                new Create();
            }
            else {
                new Update();
            }
            $('#search-btn').on('click', function () {
                table.reload(true);
            });
            utils_1.bindEnter($('#question'), function () { table.reload(true); });
            tables_1.bindPageChange(dt, $('#cloud-page-length'));
            initList();
        }
    }
    var Create = /** @class */ (function () {
        function Create() {
            this.initLabel();
            this.initSave();
        }
        Create.prototype.initLabel = function () {
            var el = document.querySelector('.tag-item').outerHTML;
            $('#create-label-btn').on('click', function () {
                $(this).parent().before(el);
            });
            $('#edit-form').on('click', '.tag-item .remove-this', function () {
                if ($('.tag-item').length <= 1) {
                    utils_1.alertMessage('必须要有一个标签');
                    return;
                }
                $(this).parent().remove();
                resizeInput();
            });
        };
        Create.prototype.initSave = function () {
            $('#save-btn').on('click', function () {
                var ruleName = $.trim($('#rule-name').val());
                var tagItem = $('.tag-item').toArray();
                if (tagItem.length <= 0) {
                    utils_1.alertMessage('请新建标签');
                }
                else if (!ruleName) {
                    utils_1.alertMessage('请填写规则名称');
                }
                else if (!listData || listData.length < 2) {
                    utils_1.alertMessage('请选择至少两条语料');
                }
                else {
                    var values = [], names = [], tags = [];
                    var rules = listData.map(function (v) { return v.text; });
                    for (var _i = 0, tagItem_1 = tagItem; _i < tagItem_1.length; _i++) {
                        var v = tagItem_1[_i];
                        var el = $(v);
                        var name_1 = $.trim(el.find('.label-name').val());
                        var value = $.trim(el.find('.label-value').val());
                        if (name_1 && value) {
                            if (values.indexOf(value) >= 0) {
                                utils_1.alertMessage('替换内容重复');
                                return;
                            }
                            else if (names.lastIndexOf(name_1) >= 0) {
                                utils_1.alertMessage('标签名称重复');
                                return;
                            }
                            else {
                                tags.push({
                                    name: name_1,
                                    value: value
                                });
                                names.push(name_1);
                                values.push(value);
                            }
                        }
                        else {
                            utils_1.alertMessage('标签名称和替换内容不能为空');
                            return;
                        }
                    }
                    var btn_1 = $('#save-btn');
                    utils_1.loadingBtn(btn_1);
                    $.ajax({
                        url: 'paraphrase/add',
                        type: 'POST',
                        data: {
                            name: ruleName,
                            tag: names.join(','),
                            tags: JSON.stringify(tags),
                            rules: JSON.stringify(rules)
                        },
                        success: function (msg) {
                            utils_1.alertMessage(msg.msg, msg.code);
                            if (!msg.error) {
                                location.assign(ctx + '/paraphrase/index');
                            }
                        },
                        complete: function () {
                            utils_1.endLoadingBtn(btn_1);
                        }
                    });
                }
            });
        };
        return Create;
    }());
    function initTree() {
        new utils_1.Tree({
            el: $('#classify'),
            data: utils_1.formatClassify(classifyData, true),
            multiple: true,
            initComplete: initTable
        });
    }
    var Update = /** @class */ (function () {
        function Update() {
            this.initOriginData();
            this.initSave();
        }
        Update.prototype.initOriginData = function () {
            originData = $('#cloud-list .list-group-item').toArray().map(function (v) { return $(v).data(); });
        };
        Update.prototype.initSave = function () {
            $('#save-btn').on('click', function () {
                var ruleName = $.trim($('#rule-name').val());
                var tags = $('.label-name').toArray();
                if (!ruleName) {
                    utils_1.alertMessage('请填写规则名称');
                }
                else if (!listData || listData.length < 2) {
                    utils_1.alertMessage('请选择至少两条语料');
                }
                else {
                    var btn_2 = $('#save-btn');
                    var newRules_1 = [];
                    var tagsData = [];
                    var content = $('#rel-content').text().split(',').map(function (v) { return { name: v }; });
                    listData.forEach(function (v) {
                        var len = delData.length;
                        var pushData = true, isOrigin = false;
                        if (len > 0) {
                            for (var i = 0; i < len; i++) {
                                if (delData[i].text === v.text) {
                                    delData.splice(i, 1);
                                    pushData = false;
                                    break;
                                }
                            }
                        }
                        for (var _i = 0, originData_1 = originData; _i < originData_1.length; _i++) {
                            var j = originData_1[_i];
                            if (v.text === j.text) {
                                isOrigin = true;
                            }
                        }
                        if (!isOrigin && pushData) {
                            newRules_1.push(v.text);
                        }
                    });
                    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
                        var v = tags_1[_i];
                        var el = $(v);
                        var val = $.trim(el.val());
                        if (val === '') {
                            utils_1.alertMessage('请填写替换内容');
                            return;
                        }
                        tagsData.push({
                            name: el.data('name'),
                            value: val
                        });
                    }
                    var data = Object.assign(type, {
                        name: ruleName,
                        ruleIds: JSON.stringify(delData.map(function (v) { return v.id; })),
                        newRules: JSON.stringify(newRules_1),
                        tags: JSON.stringify(tagsData),
                        content: JSON.stringify(content)
                    });
                    utils_1.loadingBtn(btn_2);
                    $.ajax({
                        url: 'paraphrase/edit',
                        type: 'POST',
                        data: data,
                        success: function (msg) {
                            utils_1.alertMessage(msg.msg, msg.code);
                            if (!msg.error) {
                                location.href = ctx + '/paraphrase/index';
                            }
                        },
                        complete: function () {
                            utils_1.endLoadingBtn(btn_2);
                        }
                    });
                }
            });
        };
        return Update;
    }());
    function checkText(text) {
        for (var _i = 0, listData_1 = listData; _i < listData_1.length; _i++) {
            var i = listData_1[_i];
            if (i.text === text) {
                return false;
            }
        }
        return true;
    }
    function initList() {
        if (isUpdate) {
            var listItem = $('#cloud-list .list-group-item');
            if (listItem.length > 0) {
                listItem.toArray().forEach(function (v) {
                    listData.push($(v).data());
                });
            }
        }
        $('#cloud-list').on('click', '.remove-this', function () {
            var el = $(this).parent(), text = el.data('text');
            var index = -1;
            var _loop_1 = function (i) {
                index++;
                if (text === i.text) {
                    if (originData) {
                        var originIndex_1 = -1;
                        originData.forEach(function (j, k) {
                            if (originIndex_1 >= 0) {
                                return;
                            }
                            if (text === j.text) {
                                originIndex_1 = k;
                            }
                        });
                        if (isUpdate && originIndex_1 >= 0) {
                            delData.push(originData[originIndex_1]);
                        }
                    }
                    return "break";
                }
            };
            for (var _i = 0, listData_2 = listData; _i < listData_2.length; _i++) {
                var i = listData_2[_i];
                var state_1 = _loop_1(i);
                if (state_1 === "break")
                    break;
            }
            listData.splice(index, 1);
            el.remove();
        });
        $('#empty-btn').on('click', function () {
            if (!isUpdate) {
                $('#cloud-list').empty();
            }
            else {
                $('#cloud-list').find('.remove-this').click();
            }
            listData.splice(0, listData.length);
            resizeInput();
        });
        $('#add-btn').on('click', function () {
            var val = $.trim($('#user-create').val());
            if (val === undefined || val === '') {
                utils_1.alertMessage('请输入自定语料内容');
            }
            else if (!checkText(val)) {
                utils_1.alertMessage('与已存在语料内容重复');
            }
            else {
                addListItem({
                    text: val
                });
                resizeInput();
                $('#user-create').val(null).focus();
            }
        });
    }
    function addListItem(data) {
        listData.push(data);
        $('#cloud-list').append("<li class=\"list-group-item\" data-text=\"" + data.text + "\"}>\n                <span class=\"remove-this\">\n                    <img src=\"images/close.png\" alt=\"\u5220\u9664\u8BED\u6599\" title=\"\u5220\u9664\u8BED\u6599\">\n                </span> " + data.text + "\n            </li>");
    }
    function resizeInput() {
        var userCreateWrap = $('#user-create').parent();
        userCreateWrap.css('width', userCreateWrap.parent().width() - userCreateWrap.prev().outerWidth() - 1 + "px");
    }
})(ParaphraseUpdateIndex || (ParaphraseUpdateIndex = {}));


/***/ }),

/***/ 937:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1139]);
//# sourceMappingURL=48.js.map