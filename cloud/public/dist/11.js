webpackJsonp([11],{

/***/ 1114:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(530);


/***/ }),

/***/ 123:
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
var utils_1 = __webpack_require__(5);
var CorpusUpdateSideBar = /** @class */ (function () {
    function CorpusUpdateSideBar(o) {
        var _default = {
            ifReview: false,
            title: '添加语料'
        };
        this.op = __assign({}, _default, o);
        this.init();
    }
    CorpusUpdateSideBar.prototype.init = function () {
        this.initSideBar();
    };
    CorpusUpdateSideBar.prototype.initSideBar = function () {
        var _this = this;
        this.sideBar = new utils_1.SideBar({
            title: 'xxx',
            content: '',
            onHide: function () {
                _this.sideBar.elements.wrap.find('iframe').remove();
            }
        });
    };
    CorpusUpdateSideBar.prototype.open = function (id, title, src) {
        var _this = this;
        var sideBarEl = this.sideBar.elements.wrap;
        sideBarEl.find('.sidebar-title').text(title);
        var iframeEl = document.createElement('iframe');
        if (src) {
            iframeEl.src = src;
        }
        else {
            var str = $.param(utils_1.cleanObject({
                type: this.op.ifReview ? 'review' : '',
                pairId: id ? id : ''
            }));
            iframeEl.src = "knowledge/corpusManage/update?" + str;
        }
        sideBarEl.find('.sidebar-content').append($(iframeEl));
        var endLoading = utils_1.addLoadingBg(sideBarEl.find('.sidebar-content'));
        iframeEl.onload = function () {
            if (endLoading) {
                endLoading();
            }
            iframeEl.contentWindow.jump = function (s) {
                window.open(s);
            };
            iframeEl.contentWindow.hideFn = function (res) {
                utils_1.alertMessage(res.msg, !res.error);
                if (!res.error) {
                    _this.sideBar.hide();
                    _this.op.hideFn();
                }
            };
        };
        this.sideBar.show();
    };
    return CorpusUpdateSideBar;
}());
exports.default = CorpusUpdateSideBar;


/***/ }),

/***/ 288:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 293:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(25);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (character, pushway) {pug_html = pug_html + "\u003Cdiv class=\"modal fade\" id=\"edit-modal\" data-backdrop=\"false\"\u003E\u003Cdiv class=\"modal-dialog modal-lg\"\u003E\u003Cdiv class=\"modal-content\"\u003E\u003Cdiv class=\"modal-header\"\u003E\u003Cbutton class=\"close\" type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\"\u003E\u003Cspan aria-hidden=\"true\"\u003E&times;\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003Ch4 class=\"modal-title\"\u003E关联到已有语料\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"modal-body clearfix\"\u003E\u003Cform class=\"form-horizontal cloud-form\"\u003E\u003Cdiv class=\"form-group\"\u003E\u003Clabel class=\"cloud-input-title\"\u003E类型\u003C\u002Flabel\u003E\u003Cdiv class=\"cloud-input-content cloud-lg\"\u003E\u003Cdiv class=\"form-control input-sm\" id=\"classify\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"form-group\"\u003E\u003Clabel class=\"cloud-input-title\"\u003E问题\u003C\u002Flabel\u003E\u003Cdiv class=\"cloud-input-content\"\u003E\u003Cinput class=\"form-control input-sm\" id=\"form-question\" type=\"text\" placeholder=\"关键词\" maxlength=\"30\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"form-group\"\u003E\u003Clabel class=\"cloud-input-title\"\u003E回复\u003C\u002Flabel\u003E\u003Cdiv class=\"cloud-input-content\"\u003E\u003Cinput class=\"form-control input-sm\" id=\"form-answer\" type=\"text\" placeholder=\"关键词\" maxlength=\"30\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"form-group\"\u003E\u003Clabel class=\"cloud-input-title\"\u003E渠道\u003C\u002Flabel\u003E\u003Cdiv class=\"cloud-input-content\"\u003E\u003Cselect class=\"form-control input-sm\" id=\"select-pushway\" name=\"pushway\"\u003E\u003Coption value=\"\"\u003E全部\u003C\u002Foption\u003E";
var items=pushway
// iterate items
;(function(){
  var $$obj = items;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var item = $$obj[pug_index0];
pug_html = pug_html + "\u003Coption" + (pug.attr("value", item.id, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = item.name) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var item = $$obj[pug_index0];
pug_html = pug_html + "\u003Coption" + (pug.attr("value", item.id, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = item.name) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"form-group\"\u003E\u003Clabel class=\"cloud-input-title\"\u003E角色\u003C\u002Flabel\u003E\u003Cdiv class=\"cloud-input-content\"\u003E\u003Cselect class=\"form-control input-sm\" id=\"select-character\" name=\"character\"\u003E\u003Coption value=\"\"\u003E全部\u003C\u002Foption\u003E";
var items=character
// iterate items
;(function(){
  var $$obj = items;
  if ('number' == typeof $$obj.length) {
      for (var pug_index1 = 0, $$l = $$obj.length; pug_index1 < $$l; pug_index1++) {
        var item = $$obj[pug_index1];
pug_html = pug_html + "\u003Coption" + (pug.attr("value", item.id, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = item.name) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index1 in $$obj) {
      $$l++;
      var item = $$obj[pug_index1];
pug_html = pug_html + "\u003Coption" + (pug.attr("value", item.id, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = item.name) ? "" : pug_interp)) + "\u003C\u002Foption\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fselect\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"form-group\"\u003E\u003Clabel class=\"cloud-input-title\"\u003E更新时间\u003C\u002Flabel\u003E\u003Cdiv class=\"cloud-input-content cloud-md\"\u003E\u003Cinput class=\"form-control input-sm\" id=\"form-date\" type=\"text\" readonly\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"form-group\"\u003E\u003Cbutton class=\"btn btn-primary btn-sm\" id=\"form-search-btn\" type=\"button\"\u003E查询\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fform\u003E\u003Ctable class=\"table fixed-table\" id=\"edit-table\"\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"modal-footer\"\u003E\u003Cbutton class=\"btn btn-success\" id=\"edit-submit-btn\" type=\"button\"\u003E保存\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-default\" type=\"button\" data-dismiss=\"modal\"\u003E取消\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"character" in locals_for_with?locals_for_with.character:typeof character!=="undefined"?character:undefined,"pushway" in locals_for_with?locals_for_with.pushway:typeof pushway!=="undefined"?pushway:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ 304:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var item = __webpack_require__(293);
var new_table_1 = __webpack_require__(7);
var tables = __webpack_require__(13);
var utils = __webpack_require__(5);
__webpack_require__(37);
__webpack_require__(21);
__webpack_require__(288);
var CorpusRelate = /** @class */ (function () {
    function CorpusRelate(selectData) {
        var _this = this;
        /**
         * 初始化语料编辑时选择知识点的表格
         */
        this.initEditTable = function () {
            var classify = new utils.ClassifyTree({
                el: $('#classify'),
                data: utils.formatClassify(_this.selectData.classify, true),
                multiple: true,
                selected: true
            });
            var eDate = new utils.CommonDate({
                el: $('#form-date')
            });
            _this.eTable = new new_table_1.Table({
                el: $('#edit-table'),
                checkbox: {
                    data: 'pairId'
                },
                options: {
                    select: {
                        style: 'single'
                    },
                    paging: true,
                    serverSide: true,
                    ajax: {
                        url: 'knowledge/corpusManage/corpus/list',
                        dataSrc: function (data) { return data.rows; },
                        data: function (data) {
                            return utils.cleanObject({
                                questionkeyword: $.trim($('#form-question').val()),
                                answerkeword: $.trim($('#form-answer').val()),
                                classifys: classify.selected.join(','),
                                character: $('#select-character').val(),
                                pushway: $('#select-pushway').val(),
                                beginTime: eDate.getDate('start'),
                                endTime: eDate.getDate('end'),
                                corpusStatus: 8,
                                page: Math.floor(data.start / data.length) + 1,
                                rows: 20
                            });
                        }
                    },
                    columns: [
                        {
                            name: 'question',
                            data: 'literal',
                            title: '问题',
                            width: '50%',
                            createdCell: tables.createAddTitle,
                            render: _this.renderQuestion
                        },
                        {
                            name: 'plainText',
                            data: 'digest',
                            title: '回复',
                            width: '50%',
                            createdCell: tables.createAddTitle
                        }
                    ],
                    initComplete: function () {
                        _this.editInitComplete(_this.eTable);
                    },
                    scrollY: '300px',
                    scrollCollapse: true
                }
            });
        };
        this.renderQuestion = function (text, status, rowData) {
            var classifyName = _this.renderClassify(rowData.classifyId);
            var numberEl = "<a class=\"qmore\" data-id=\"" + rowData.pairId + "\">" + rowData.countSubQ + "</a>";
            if (rowData.countSubQ <= 0) {
                numberEl = "<a class=\"zero\" data-id=\"" + rowData.pairId + "\">" + rowData.countSubQ + "</a>";
            }
            return "\n\t\t<p class=\"info ellipsis\" title=\"" + text + "\"><span>" + text + "<span></p>\n\t\t<p class=\"small info\"><span class=\"small-item big\">\u7C7B\u578B:" + classifyName + "</span><span class=\"small-item small repeat\">\u590D\u8FF0\u95EE\u6CD5:" + numberEl + "</span></p>\n\t\t";
        };
        this.renderClassify = function (id) {
            for (var _i = 0, _a = _this.selectData.classify; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.id === id) {
                    return i.name;
                }
            }
            return '';
        };
        this.hideAllChildRows = function () {
            var trs = _this.eTable.table.find('.open').removeClass('open').closest('tr').toArray();
            trs.forEach(function (v) {
                var tr = $(v);
                if (_this.eTable.isShownChild(tr, 'question')) {
                    _this.eTable.hideChildRows(tr, 'question');
                }
                else if (_this.eTable.isShownChild(tr, 'plainText')) {
                    _this.eTable.hideChildRows(tr, 'plainText');
                }
            });
        };
        /* 对外提供一个显示模态框的方法 */
        this.showModal = function (data) {
            _this.select = data;
            _this.eTable.reload({ start: 0 });
            $('#edit-modal').modal('show');
        };
        this.selectData = selectData;
        // 组件内部方法：模态框显示的时候，初始化表格
        $('body').append($(item({
            pushway: selectData.pushway,
            character: selectData.character
        })));
        this.initEditTable();
    }
    CorpusRelate.prototype.editInitComplete = function (eTable) {
        var _this = this;
        var dt = eTable.dt;
        // 保存功能
        $('#edit-submit-btn').on('click', function () {
            eTable.checkLength({
                name: '知识点',
                action: '添加到',
                cb: function (data) {
                    var select = _this.select;
                    if (!select || select.length < 1) {
                        return;
                    }
                    else {
                        for (var _i = 0, select_1 = select; _i < select_1.length; _i++) {
                            var v = select_1[_i];
                            if (v.pairId === data.pairId) {
                                utils.alertMessage('不能保存为相同语料');
                                return;
                            }
                        }
                        var endLoading_1 = utils.loadingBtn($('#edit-submit-btn'));
                        $.ajax({
                            url: 'knowledge/corpus/review/update',
                            type: 'POST',
                            data: {
                                pairIds: select.map(function (v) { return v.pairId; }).join(','),
                                pairId: data.pairId
                            },
                            success: function (msg) {
                                utils.alertMessage(msg.msg, !msg.error);
                                if (!msg.error) {
                                    $('#edit-modal').modal('hide');
                                    $('#table').DataTable().draw(false);
                                }
                            },
                            complete: function () {
                                endLoading_1();
                            }
                        });
                    }
                }
            });
        });
        $('#form-search-btn').on('click', function () {
            eTable.reload(true);
        });
        utils.bindEnter($('#form-answer,#form-question'), function () { return eTable.reload(true); });
        // 展开复述问法
        $('#edit-table').on('click', '.qmore', function (e) {
            var el = $(e.target);
            var tr = el.closest('tr');
            if (el.hasClass('open')) {
                _this.eTable.hideChildRows(tr, 'question');
                el.removeClass('open');
                return;
            }
            _this.hideAllChildRows();
            if (_this.eTable.hasChild(tr, 'question')) {
                el.addClass('open');
                _this.eTable.showChildRows(tr, 'question');
            }
            else {
                $.ajax({
                    url: 'knowledge/corpusManage/listSunQuestion',
                    type: 'GET',
                    data: {
                        pairId: el.data('id')
                    },
                    success: function (res) {
                        if (!res.error) {
                            var data = void 0;
                            if (res.data && res.data.length > 0) {
                                data = res.data.map(function (v) {
                                    return {
                                        question: v.literal,
                                        updateTime: utils.renderSimpleTime(v.updateTime)
                                    };
                                });
                            }
                            else {
                                data = [{ _all: '无数据' }];
                            }
                            _this.eTable.addChildRows(tr, data, 'question');
                            el.addClass('open');
                        }
                    }
                });
            }
        });
    };
    return CorpusRelate;
}());
exports.CorpusRelate = CorpusRelate;


/***/ }),

/***/ 530:
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
var utils = __webpack_require__(5);
var table = __webpack_require__(7);
var daterangepicker_1 = __webpack_require__(21);
var corpusUpdateSideBar_1 = __webpack_require__(123);
var corpus_relate_1 = __webpack_require__(304);
__webpack_require__(37);
__webpack_require__(913);
var initFrom = false;
var $table = $('#table');
var date = new daterangepicker_1.CommonDate({
    el: $('#date')
});
var sideBar = new corpusUpdateSideBar_1.default({
    hideFn: function () {
        t.reload();
    }
});
var selectedRows;
var types = {
    ignore: 'ignore',
    ignoreForever: 'ignore-forever',
    add: 'add',
    delete: 'delete',
    link: 'link'
};
var corpusRelate = new corpus_relate_1.CorpusRelate(selectData);
var t = new table.Table({
    el: $table,
    checkbox: {
        data: 'pairId'
    },
    options: {
        ajax: {
            url: 'knowledge/corpus/audit/list',
            dataSrc: function (data) { return data.rows; },
            data: function (d) {
                var order = d.order[0];
                var data = table.extendsData(d);
                if (fromData && !initFrom) {
                    initFrom = true;
                    Object.assign(d, { questionId: fromData.id });
                }
                else {
                    Object.assign(d, {
                        beginDegree: 0,
                        endDegree: 0,
                        beginTime: date.getDate('start'),
                        endTime: date.getDate('end'),
                        keyword: $('#question').val().trim(),
                        sortField: d.columns[order.column].name,
                        sortType: order.dir
                    });
                }
                return utils.cleanObject(d);
            }
        },
        paging: true,
        serverSide: true,
        ordering: true,
        order: [[3, 'desc']],
        columns: [
            {
                title: '无答案问题<i id="table-expand-btn" class="fa fa-expand fa-compress" aria-hidden="true"></i>',
                data: 'literal',
                render: renderQuestion,
                orderable: false
            },
            { name: 'hits', title: '被问次数', data: 'hits', render: renderHits, width: '60px' },
            { name: 'qupdateTime', title: '创建时间', data: 'qupdateTime', render: utils.renderCommonTime, width: '120px' },
            { title: '操作', data: 'pairId', render: renderAction, className: 'prevent', width: '200px', orderable: false }
        ],
        drawCallback: fillChildren,
        initComplete: initComplete
    }
});
function fillChildren() {
    var dt = t.dt;
    Array.prototype.forEach.call(dt.rows().nodes(), function (e) {
        var tr = $(e), row = dt.row(tr).data();
        if (row.countSubQ) {
            var children = $(row.suns.map(function (sun) {
                var child = $("\n\t\t\t\t\t<tr class=\"sub-tr\" data-group=\"" + row.pairId + "\">\n\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t<td>" + sun.literal + "</td>\n\t\t\t\t\t\t<td>" + sun.hits + "</td>\n\t\t\t\t\t\t<td>" + utils.renderCommonTime(sun.qupdateTime) + "</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"table-sun-action-btn\" data-type=\"" + types.delete + "\">\u79FB\u51FA</a>\n\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"table-sun-action-btn\" data-type=\"" + types.ignore + "\">\u5FFD\u7565</a>\n\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"table-sun-action-btn\" data-type=\"" + types.ignoreForever + "\">\u6C38\u4E45\u5FFD\u7565</a>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t");
                child.data({
                    parent: tr,
                    row: __assign({}, sun, { pairId: row.pairId })
                });
                return child.get(0);
            }));
            tr.data('children', children).after(children);
        }
    });
}
function renderAction(pairId, type, row) {
    var deleteBtn = "<a href=\"javascript:;\" class=\"table-action-btn\" data-type=\"" + types.delete + "\">\u79FB\u51FA</a>";
    return "\n\t\t<a href=\"javascript:;\" class=\"table-action-btn\" data-type=\"" + types.add + "\">\u6DFB\u52A0</a>\n\t\t<a href=\"javascript:;\" class=\"table-action-btn\" data-type=\"" + types.link + "\">\u5173\u8054</a>\n\t\t" + (row.countSubQ ? deleteBtn : '') + "\n\t\t<a href=\"javascript:;\" class=\"table-action-btn\" data-type=\"" + types.ignore + "\">\u5FFD\u7565</a>\n\t\t<a href=\"javascript:;\" class=\"table-action-btn\" data-type=\"" + types.ignoreForever + "\">\u6C38\u4E45\u5FFD\u7565</a>\n\t";
}
function renderQuestion(literal, type, row) {
    return "\n\t\t<p title=\"" + literal + "\">" + literal + "</p>\n\t\t<p class=\"similar-questions\">\u76F8\u4F3C\u65E0\u7B54\u6848\u95EE\u9898\uFF1A<a class=\"table-suns-btn " + (row.countSubQ ? 'has-similar' : '') + "\" href=\"javascript:;\">" + (row.countSubQ ? row.countSubQ : 0) + "</a></p>\n\t";
}
function initComplete() {
    var dt = $table.DataTable(), modal = $('#link-modal');
    $('#search-btn').on('click', function () {
        t.reload(true);
    });
    utils.bindEnter($('#question'), function () {
        t.reload(true);
    });
    $('.action-btn').on('click', function (e) {
        var btn = $(e.currentTarget), type = btn.data('type'), selected = t.selected;
        selectedRows = selected;
        if (selected.length > 0) {
            switch (type) {
                case types.link:
                    corpusRelate.showModal(selectedRows);
                    // showLinkModal();
                    break;
                case types.add:
                    var allQids = selected.map(function (row) { return row.pairId; });
                    addAction(allQids);
                    break;
                case types.ignore:
                case types.ignoreForever:
                    ignoreAction(selected.map(function (row) {
                        var qids = [row.questionId];
                        if (row.countSubQ) {
                            qids.push.apply(qids, row.suns.map(function (sun) { return (sun.id); }));
                        }
                        return {
                            pairId: row.pairId,
                            qids: qids
                        };
                    }), type === types.ignoreForever);
                    break;
                default:
                    break;
            }
        }
        else {
            utils.alertMessage('请选择要' + btn.text() + '的问题');
        }
    });
    $('#refresh-btn').on('click', function (e) {
        var end = utils.loadingBtn($(e.currentTarget));
        $.ajax('knowledge/corpus/audit/group', {
            method: 'POST'
        }).done(function (res) {
            utils.alertMessage(res.msg, !res.error);
            t.reload();
        })
            .always(function () {
            end();
        });
    });
    $('#table-expand-btn').on('click', function (e) {
        var subTrs = $table.find('.sub-tr'), btn = $(e.currentTarget);
        var visible = checkAllVisible();
        if (visible) {
            btn.addClass('fa-compress');
            subTrs.show();
        }
        else {
            btn.removeClass('fa-compress');
            subTrs.hide();
        }
    });
    function checkAllVisible() {
        var subTrs = $table.find('.sub-tr');
        var visible = false;
        for (var _i = 0, _a = subTrs.toArray(); _i < _a.length; _i++) {
            var tr = _a[_i];
            if (!$(tr).is(':visible')) {
                visible = true;
                break;
            }
        }
        return visible;
    }
    $table
        .on('click', '.table-suns-btn', function (e) {
        e.stopPropagation();
        var tr = $(e.currentTarget).closest('tr'), children = tr.data('children');
        if (children) {
            children.toggle();
            var visible = checkAllVisible(), btn = $('#table-expand-btn');
            if (visible) {
                btn.removeClass('fa-compress');
            }
            else {
                btn.addClass('fa-compress');
            }
        }
    })
        .on('click', '.table-action-btn', function (e) {
        var btn = $(e.currentTarget), row = dt.row(btn.closest('tr')).data(), type = btn.data('type');
        selectedRows = [row];
        switch (type) {
            case types.add:
                addAction([row.pairId]);
                break;
            case types.link:
                corpusRelate.showModal(selectedRows);
                break;
            case types.delete:
                deleteAction(row.pairId, row.questionId);
                break;
            case types.ignore:
            case types.ignoreForever:
                ignoreAction([
                    {
                        pairId: row.pairId,
                        qids: [row.questionId]
                    }
                ], type === types.ignoreForever);
                break;
            default:
                return;
        }
    })
        .on('click', '.table-sun-action-btn', function (e) {
        var btn = $(e.currentTarget), tr = btn.closest('tr'), row = tr.data('row'), type = btn.data('type');
        switch (type) {
            case types.delete:
                deleteAction(row.pairId, row.id);
                break;
            case types.ignore:
            case types.ignoreForever:
                ignoreAction([
                    {
                        pairId: row.pairId,
                        qids: [row.id]
                    }
                ], type === types.ignoreForever);
                break;
            default:
                break;
        }
    });
}
function ignoreAction(pairs, forever) {
    if (forever === void 0) { forever = false; }
    var submit = function (cb) {
        var xhr = $.ajax('knowledge/corpus/audit/delete', {
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                pairs: pairs,
                forever: forever
            })
        })
            .done(function (res) {
            t.reload();
            utils.alertMessage(res.msg, !res.error);
        });
        if (cb) {
            xhr.always(cb);
        }
    };
    if (forever) {
        utils.confirmModal({
            msg: '该问题不会再次出现在无答案问题列表中，您确定要永久忽略吗？',
            text: '永久忽略',
            cb: function (modal, btn) {
                var end = utils.loadingBtn(btn);
                submit(function () {
                    modal.modal('hide');
                    end();
                });
            }
        });
    }
    else {
        submit();
    }
}
function deleteAction(pairId, qId) {
    $.ajax('knowledge/corpus/audit/independent', {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            pairId: pairId,
            qid: qId
        })
    })
        .done(function (res) {
        t.reload();
        utils.alertMessage(res.msg, !res.error);
    });
}
var classify = new utils.ClassifyTree({
    el: $('#classify'),
    data: utils.formatClassify(selectData.classify, true),
    multiple: true,
    selected: true
});
var lDate = new utils.CommonDate({
    el: $('#form-date')
});
/* const lT = new table.Table({
    el: $('#edit-table'),
    options: {
        scrollY: '300px',
        ajax: {
            url: 'knowledge/review/update/list',
            type: 'POST',
            dataSrc: data => data.rows,
            data: (data) => {
                return utils.cleanObject(
                    table.extendsData(data, {
                        keyword: $.trim($('#form-question').val()),
                        classifys: classify.selected.join(','),
                        answerkeyword: $.trim($('#form-answer').val()),
                        character: $('#select-character').val(),
                        pushway: $('#select-pushway').val(),
                        beginTime: lDate.getDate('start'),
                        endTime: lDate.getDate('end'),
                        corpusStatus: 8
                    }));
            }
        },
        paging: true,
        serverSide: true,
        select: {
            style: 'single'
        },
        columns: [
            { data: 'countSubQ', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowCorpus },
            { name: 'question', data: 'question', title: '问题', width: '50%' },
            // { data: 'countSubA', title: '', 'orderable': false, width: '12', className: 'show-a-corpus force-width prevent', createdCell: createShowCorpus },
            { name: 'plainText', data: 'plainText', title: '回复', width: '50%' }
        ],
        initComplete: () => {
            const t = lT.dt;

            $('#form-search-btn').on('click', () => {
                t.draw();
            });

            $('#edit-table').on('click', '.show-corpus-td.show-q-corpus', (e) => {
                showCorpus(e, 'knowledge/editByA/listByPairId', 'q');
            });
            $('#edit-table').on('click', '.show-corpus-td.show-a-corpus', (e) => {
                showCorpus(e, 'knowledge/editByA/listAnswerByPairId', 'a');
            });
            utils.bindEnter($('#form-answer,#form-question'), () => t.draw());

            $('#link-modal').one('shown.bs.modal', () => {
                lT.adjustHeader();
            });


            $('#edit-submit-btn').on('click', linkAction);
        }
    }
}); */
/* function showCorpus(e: JQueryEventObject, url: string, name: string) {
    const el = $(e.currentTarget),
        tr = el.parents('tr'),
        icon = el.icon();
    switch (icon.state) {
        case utils.IconState.loading:
            return;
        case utils.IconState.plus:
            icon.state = utils.IconState.loading;
            $.ajax({
                url: url,
                type: 'GET',
                data: {
                    pairId: el.data('id')
                },
                success: (msg) => {
                    if (!msg.error) {
                        let trs;
                        if (name === 'q') {
                            trs = msg.msg.pms.map(v => {
                                return `
                                    <tr class="cps-details">
                                    <td></td>
                                    <td class="force-width">${v.question.literal}</td>
                                    <td></td>
                                    <td></td>
                                    </tr>
                                `;
                            });
                        } else {
                            trs = msg.msg.map(v => {
                                return `
                                    <tr class="cps-details">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="force-width">${v.answer.plainText}</td>
                                    </tr>
                                `;
                            });
                        }
                        // const trs = getTrs(name === 'question' ? msg.msg.pms : msg.msg, name);
                        tr.after($(trs.join('')));
                    }
                },
                complete: () => {
                    icon.state = utils.IconState.minus;
                }
            });
            break;
        case utils.IconState.minus:
            break;
        default:
            return;
    }
    clearTable();
} */
function clearTable() {
    $('.cps-details').remove();
    resetIcon($('#edit-table tbody .show-corpus-td'));
}
function resetIcon(element) {
    Array.prototype.forEach.call(element, function (v) {
        var icon = $(v).icon();
        if (icon.state === utils.IconState.minus) {
            icon.state = utils.IconState.plus;
        }
    });
}
function createShowCorpus(td, cellDatA, rowData) {
    var el = $(td);
    if (cellDatA > 0) {
        el.addClass('show-corpus-td')
            .data('id', rowData.id)
            .icon();
    }
    else {
        el.addClass('disabled')
            .icon();
    }
}
/* function showLinkModal() {
    $('#link-modal').modal('show');
    lT.reload();
} */
/* function linkAction() {
    const modal = $('#link-modal'),
        btn = $('#edit-submit-btn');
    if (selectedRows) {
        const selected = lT.selected;
        if (selected.length > 0) {
            const end = utils.loadingBtn(btn);
            const ids = selectedRows.map(row => row.pairId),
                id = selected[0].id;
            $.ajax('knowledge/review/update/save', {
                data: {
                    pairIds: ids.join(','),
                    pairId: id
                }
            })
                .done(res => {
                    utils.alertMessage(res.msg, !res.error);
                    modal.modal('hide');
                    t.reload();
                })
                .always(() => {
                    end();
                });

        } else {
            utils.alertMessage('请选择要关联的问题');
        }
    }
} */
function addAction(arr) {
    var ids = arr.map(function (v) { return 'pairId=' + v; });
    if (!ids.length) {
        utils.alertMessage('请至少选择两条或两条以上的语料合并！');
    }
    else {
        sideBar.open(null, '添加语料', ctx + "/knowledge/corpusManage/update?" + ids.join('&'));
        // changeIframeSideBar('合并语料', `${ctx}/knowledge/corpusManage/update?${ids.join('&')}`);
    }
    // location.href = 'knowledge/editByA/merge?title=语料添加&ids=' + ids;
}
function renderHits(hits) {
    return hits ? hits : 0;
}


/***/ }),

/***/ 913:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1114]);
//# sourceMappingURL=11.js.map