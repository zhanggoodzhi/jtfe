webpackJsonp([10],{

/***/ 1116:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(532);


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

/***/ 532:
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
var new_table_1 = __webpack_require__(7);
var tables = __webpack_require__(13);
var utils = __webpack_require__(5);
__webpack_require__(37);
var corpusUpdateSideBar_1 = __webpack_require__(123);
__webpack_require__(21);
__webpack_require__(915);
var corpus_relate_1 = __webpack_require__(304);
var auditTable;
var request;
var currentResourceData;
var KnowledgeReviewIndex;
(function (KnowledgeReviewIndex) {
    var select;
    var date = new utils.CommonDate({
        el: $('#date')
    });
    var tree = new utils.Tree({
        el: $('#main-classify'),
        data: utils.formatClassify(selectData.classify, true),
        multiple: true,
        selected: true,
        initComplete: initTable
    });
    var sideBar = new corpusUpdateSideBar_1.default({
        hideFn: function () {
            auditTable.reload();
        }
    });
    // const sideBar = new utils.SideBar({
    // 	id: 'editasnew',
    // 	title: '编辑为新语料',
    // 	content: ''
    // });
    var corpusRelate = new corpus_relate_1.CorpusRelate(selectData);
    /**
     * 初始化表格
     */
    function initTable() {
        var initFrom = false;
        auditTable = new new_table_1.Table({
            el: $('#table'),
            checkbox: {
                data: 'id'
            },
            options: {
                ajax: {
                    url: 'knowledge/corpus/review/list',
                    dataSrc: function (data) { return data.rows; },
                    data: function (data) {
                        var d = new_table_1.extendsData(data);
                        if (fromData && !initFrom) {
                            initFrom = true;
                            Object.assign(d, { questionId: fromData.id });
                        }
                        else {
                            Object.assign(d, getSearchData());
                        }
                        return utils.cleanObject(d);
                    }
                },
                serverSide: true,
                paging: true,
                initComplete: function () {
                    initComplete(auditTable);
                },
                columns: [
                    { data: 'literal', title: '问题', render: renderQuestion },
                    { data: 'similarityLiteral', title: '相似句', createdCell: tables.createAddTitle },
                    { data: 'digest', title: '回复', render: renderAnswer },
                    { data: 'similarityDegree', title: '相似度', width: '60px', render: renderDegree },
                    { data: 'hits', title: '热度', width: '40px' },
                    // { data: 'classifyID', title: '分类', width: '60px', render: tables.renderClassify },
                    { data: 'qupdateTime', title: '更新时间', width: '120px', render: utils.renderSimpleTime },
                    { data: 'pairId', title: '操作', width: '90px', render: function () { return '<button class="btn btn-sm btn-link edit-as-new-btn">编辑为新语料</button>'; } }
                ]
            }
        });
    }
    function renderAnswer(text, status, rowData) {
        rowData.type = 6;
        rowData.resourceId = '6273385313150697472';
        var type = renderType(rowData.type);
        var enType = getTypeName(rowData.type);
        return "\n\t\t<p class=\"info\">\n\t\t<span class=\"small\">" + type + ":</span>\n\t\t<span class=\"ellipsis a-hover\" data-type=\"" + enType + "\" data-id=\"" + rowData.resourceId + "\" data-toggle=\"popover\" data-trigger=\"manual\">" + utils.formatText(text) + "</span>\n\t\t</p>\n\t\t";
    }
    function getResourceItem(type, data) {
        switch (type) {
            case 'text':
                return data.nonShared.content;
            case 'link':
                return "\n\t\t\t<a target=\"view_window\" href=\"" + data.nonShared.linkUrl + "\">" + data.title + "</a>\n\t\t\t<p>" + data.desc + "<p>\n\t\t\t";
            case 'image': return "\n\t\t\t<div class=\"image-wrap\"><img src=\"" + data.nonShared.mediaUrl + "\"/></div>\n\t\t\t<p class=\"tcenter\">" + data.title + "</p>\n\t\t\t";
            case 'music': return "\n\t\t\t<div><audio controls src=\"" + data.nonShared.mediaUrl + "\"></audio></div>\n\t\t\t<p class=\"tcenter\">" + data.title + "</p>\n\t\t\t";
            case 'voice': return "\n\t\t\t<div><audio controls src=\"" + data.nonShared.mediaUrl + "\"></audio></div>\n\t\t\t<p class=\"tcenter\">" + data.title + "</p>\n\t\t\t";
            case 'video': return "\n\t\t\t<p class=\"tcenter\">" + data.title + "</p>\n\t\t\t<div><video controls src=\"" + data.nonShared.mediaUrl + "\"></video></div>\n\t\t\t<p class=\"tcenter\">" + data.desc + "</p>\n\t\t\t";
            case 'news':
                var cover = data.articles[0];
                var children_1 = '';
                data.articles.forEach(function (v, i) {
                    if (i === 0) {
                        return;
                    }
                    children_1 += "<div class=\"child clearfix\"><span>" + v.title + "</span><img src=\"" + v.picUrl + "\"/></div>";
                });
                return "\n\t\t\t<div class=\"tcenter cover\" style=\"background-image:url(" + cover.picUrl + ")\"><p class=\"big-title\">" + cover.title + "</p></div>\n\t\t\t" + children_1 + "\n\t\t\t";
            case 'attach':
                var src = getSrc(data);
                return "\n\t\t\t<p class=\"file-wrap\"><img src=\"" + src + "\"/><a target=\"view_window\" href=\"http://localhost:8080/cloud/knowledge/corpusManage/attach/download?id=" + data.id + "\">" + data.filename + "</a></p>\n\t\t\t";
            default:
                return '无此类型';
        }
    }
    function getTypeName(id) {
        for (var _i = 0, _a = selectData.type; _i < _a.length; _i++) {
            var v = _a[_i];
            if (id === v.id) {
                return v.enname;
            }
        }
    }
    function getSrc(msg) {
        var imgSrc = 'images/types/';
        switch (msg.type) {
            case 1:
                var docImg = void 0;
                var extension = msg.fileext.substring(1);
                if (extension === 'doc' || 'docm' || 'dotx' || 'dotm' || 'docx') {
                    docImg = imgSrc + 'doc.png';
                }
                else if (extension === 'xls' || 'xlsx' || 'xlsm' || 'xltx' || 'xltm' || 'xlsb' || 'xlam') {
                    docImg = imgSrc + 'xls.png';
                }
                else if (extension === 'ppt' || 'pptx' || 'pptm' || 'ppsm' || 'potx' || 'potm') {
                    docImg = imgSrc + 'ppt.png';
                }
                else if (extension === 'pdf') {
                    docImg = imgSrc + 'pdf.png';
                }
                else if (extension === 'txt') {
                    docImg = imgSrc + 'txt.png';
                }
                return docImg;
            case 2:
                return imgSrc + 'audio.png';
            case 3:
                return imgSrc + 'video.png';
            case 4:
                return imgSrc + 'image.png';
            default:
                return '';
        }
    }
    function renderType(type) {
        for (var _i = 0, _a = selectData.type; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.id === type) {
                return v.name;
            }
        }
        return '未知';
    }
    function initComplete(table) {
        var dt = table.dt;
        var lastHtml, targetHtml = '<tr><td>操作</td><td>';
        $('.btn-trigger').toArray().forEach(function (v) {
            var el = $(v);
            targetHtml += "<button type='button' class='btn btn-sm btn-link' data-target='#" + el.prop('id') + "'>" + el.text() + "</button>";
        });
        targetHtml += '</td></tr>';
        $('#table').on('click', '.cover', function () {
            var detail = currentResourceData.articles[0];
            var modalEl = $('#preview-modal');
            modalEl.find('.title').text(detail.title);
            modalEl.find('.image-wrap img').attr('src', detail.picUrl);
            modalEl.find('.content').html(detail.content);
            modalEl.find('.desc').text(detail.desc);
            modalEl.modal('show');
        });
        $('#table').on('click', '.child', function () {
            var modalEl = $('#preview-modal');
            var index = $('.popover:visible').find('.cover,.child').index($(this));
            var detail = currentResourceData.articles[index];
            modalEl.find('.title').text(detail.title);
            modalEl.find('.image-wrap img').attr('src', detail.picUrl);
            modalEl.find('.content').html(detail.content);
            modalEl.find('.desc').text(detail.desc);
            modalEl.modal('show');
            $('#preview-modal').modal('show');
        });
        $('#table').on('mouseenter', '.a-hover', function (e) {
            var el = $(e.currentTarget);
            var data = el.data();
            if (data['bs.popover']) {
                return;
            }
            var type = data.type;
            var id = data.id;
            var config = {
                html: true,
                container: el,
                trigger: 'hover',
                placement: 'top',
                delay: { 'show': 300, 'hide': 300 }
            };
            var show = function () {
                if (el.is(':hover')) {
                    el.popover('show');
                }
            };
            if (type === 'html' || type === 'text' || type === 'intent') {
                var rowData = table.dt.row(el.closest('tr')).data();
                var text = rowData ? rowData.digest : el.data().digest;
                el.popover(__assign({}, config, { template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>', content: "<div class=\"resource-content\">" + text + "</div>" }));
                show();
            }
            else if (type === 'attach') {
                request = $.ajax({
                    url: kbRestUrl + "/attachment/detail/" + id,
                    method: 'GET'
                }).done(function (msg) {
                    var resourceItem = getResourceItem(el.data().type, msg);
                    el.popover(__assign({}, config, { template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>', content: "<div class=\"resource-content\">" + resourceItem + "</div>" }));
                    show();
                });
            }
            else {
                request = $.ajax({
                    url: kbRestUrl + "/resource/detail",
                    data: {
                        appid: appid,
                        type: type,
                        materialId: id
                    }
                }).done(function (msg) {
                    currentResourceData = msg;
                    var resourceItem = getResourceItem(el.data().type, msg);
                    el.popover(__assign({}, config, { template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>', content: "<div class=\"resource-content\">" + resourceItem + "</div>" }));
                    show();
                });
            }
        });
        $('#del-btn').on('click', function () {
            var selected = table.selected;
            if (selected.length <= 0) {
                utils.alertMessage('请选择要删除的语料');
                return;
            }
            utils.confirmModal({
                msg: '确认删除选中的语料吗？',
                cb: function (modal, btn) {
                    var end = utils.loadingBtn(btn);
                    $.ajax("knowledge/corpus/review/delete?pairIds=" + selected.map(function (v) { return v.pairId; }), {
                        method: 'DELETE'
                    })
                        .always(function () { end(); })
                        .done(function (res) {
                        if (!res.error) {
                            modal.modal('hide');
                            table.reload();
                        }
                        utils.alertMessage(res.msg, !res.error);
                    });
                }
            });
        });
        // tables.delBtnClick({
        // 	type: 'DELETE',
        // 	name: '语料',
        // 	url: 'knowledge/corpus/review/delete',
        // 	table: dt,
        // 	param: 'pairIds',
        // 	dataParam: 'pairId',
        // 	el: $('#del-btn')
        // });
        $('#edit-btn').on('click', function () {
            table.checkLength({
                action: '编辑',
                name: '语料',
                single: false,
                cb: function (data) {
                    /* $('#edit-modal').modal('show');
                    select = data; */
                    corpusRelate.showModal(data);
                }
            });
        });
        // $('#save-new-btn').on('click', () => {
        // 	table.checkLength({
        // 		name: '语料',
        // 		action: '保存',
        // 		cb: (data) => {
        // location.assign(`${ctx}/knowledge/corpusManage/update?pairId=${data.pairId}`);
        // 		}
        // 	});
        // });
        $('#check-btn').on('click', function () {
            table.checkLength({
                action: '审核',
                name: '语料',
                single: false,
                cb: function (data) {
                    var ids = [];
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var v = data_1[_i];
                        if (v.similarityQid !== null) {
                            ids.push(v.pairId);
                        }
                    }
                    if (ids.length < 1) {
                        utils.alertMessage('只能审核含有相似句的语料');
                        return;
                    }
                    var endLoading = utils.loadingBtn($('#check-btn'));
                    $.ajax({
                        // url: "knowledge/review/accept",
                        url: 'knowledge/corpus/review/verify',
                        type: 'POST',
                        data: {
                            pairIds: ids.join(',')
                        },
                        success: function (msg) {
                            utils.alertMessage(msg.msg, !msg.error);
                            if (!msg.error) {
                                table.reload();
                            }
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                }
            });
        });
        $('#show-detial-btn').on('click', function () {
            table.checkLength({
                single: true,
                action: '查看',
                name: '语料',
                cb: function (data, rows) {
                    var modal = $('#detial-modal'), rowIndex = rows.index();
                    var html = '';
                    Array.prototype.forEach.call(dt.columns().header(), function (v, i) {
                        var title = $(v).html(), content = dt.cell(rowIndex, i).render('display');
                        html += "<tr><td>" + title + "</td><td>" + content + "</td></tr>";
                    });
                    html += targetHtml;
                    modal.modal('show');
                    if (lastHtml === undefined || lastHtml !== html) {
                        $('#detial-content').html(html);
                        lastHtml = html;
                    }
                }
            });
        });
        $('#detial-content').on('click', '.btn-link', function (e) {
            $('#detial-modal').hide().modal('hide');
            $($(e.currentTarget).data('target')).trigger('click');
        });
        $('#search-btn').on('click', function () {
            table.reload(true);
        });
        // 导出语料
        $('#export-btn').on('click', function () {
            utils.alertMessage('正在生成文件！', 'success');
            var data = utils.cleanObject(getSearchData());
            location.href = ctx + "/knowledge/corpus/review/exportTestExcel?" + $.param(data);
        });
        utils.bindEnter($('#similar,#question,#answer'), function () { table.reload(true); });
        tables.bindPageChange(dt, $('#page-change'));
        // $('#edit-modal').one('shown.bs.modal', initEditTable);
        table.table.on('click', '.edit-as-new-btn', function (e) {
            var data = dt.row($(e.currentTarget).closest('tr')).data();
            if (!data) {
                return;
            }
            sideBar.open(data.pairId, '添加语料');
            // const content = sideBar.elements.content.empty();
            // const end = utils.addLoadingBg(content);
            // const iframe = document.createElement('iframe');
            // iframe.onload = () => {
            // 	end();
            // };
            // iframe.src = `knowledge/corpusManage/update?pairId=${data.pairId}`;
            // content.append(iframe);
            // sideBar.show();
        });
    }
    function renderQuestion(q, type, row) {
        return "<p class=\"question\" title=\"" + q + "\">" + q + "</p>\n\t\t\t<p class=\"cloud-td-info\">\u7C7B\u522B:" + tables.renderClassify(row.similarityClassifyId) + "</p>\n\t\t";
    }
    /**
     * 初始化语料编辑时选择知识点的表格
     */
    /* function initEditTable() {
        const classify = new utils.ClassifyTree({
            el: $('#classify'),
            data: utils.formatClassify(selectData.classify, true),
            multiple: true,
            selected: true
        });

        const eDate = new utils.CommonDate({
            el: $('#form-date')
        });

        const eTable = new Table({
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
                    url: 'knowledge/corpus/review/update/list',
                    dataSrc: data => data.rows,
                    data: (data) => {
                        return utils.cleanObject(extendsData(data, {
                            questionkeyword: $.trim($('#form-question').val()),
                            answerkeword: $.trim($('#form-answer').val()),
                            classifys: classify.selected.join(','),
                            character: $('#select-character').val(),
                            pushway: $('#select-pushway').val(),
                            beginTime: eDate.getDate('start'),
                            endTime: eDate.getDate('end'),
                            corpusStatus: 8
                        }));
                    }
                },
                columns: [
                    { data: 'literal', title: '问题', width: '50%', createdCell: tables.createAddTitle },
                    { data: 'digest', title: '回复', width: '50%', createdCell: tables.createAddTitle }
                ],
                initComplete: () => {
                    editInitComplete(eTable);
                },
                scrollY: '300px',
                scrollCollapse: true
            }
        });

    }
    function editInitComplete(eTable: Table) {
        const dt = eTable.dt;
        $('#edit-submit-btn').on('click', () => {
            eTable.checkLength({
                name: '知识点',
                action: '添加到',
                cb: (data) => {
                    if (!select || select.length < 1) {
                        return;
                    }
                    else {
                        for (let v of select) {
                            if (v.pairId === data.pairId) {
                                utils.alertMessage('不能保存为相同语料');
                                return;
                            }
                        }
                        const endLoading = utils.loadingBtn($('#edit-submit-btn'));
                        $.ajax({
                            url: 'knowledge/corpus/review/update',
                            type: 'POST',
                            data: {
                                pairIds: select.map(v => v.pairId).join(','),
                                pairId: data.pairId
                            },
                            success: (msg) => {
                                utils.alertMessage(msg.msg, !msg.error);
                                if (!msg.error) {
                                    $('#edit-modal').modal('hide');
                                    $('#table').DataTable().draw(false);
                                }
                            },
                            complete: () => {
                                endLoading();
                            }
                        });
                    }
                }
            });
        });

        $('#form-search-btn').on('click', () => {
            eTable.reload(true);
        });

        utils.bindEnter($('#form-answer,#form-question'), () => eTable.reload(true));
    } */
    function renderDegree(num) {
        return (num * 1000 / 10) + '%';
    }
    function getSearchData() {
        var similar = $('#select-similar').val().split('-');
        return {
            questionkeyword: $.trim($('#question').val()),
            similarQuestionkeyword: $.trim($('#similar').val()),
            answerkeyword: $.trim($('#answer').val()),
            classifys: tree.selected.join(','),
            beginDegree: similar[0],
            endDegree: similar[1],
            beginTime: date.getDate('start'),
            endTime: date.getDate('end')
        };
    }
})(KnowledgeReviewIndex || (KnowledgeReviewIndex = {}));


/***/ }),

/***/ 915:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1116]);
//# sourceMappingURL=10.js.map