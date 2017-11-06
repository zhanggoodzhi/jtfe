webpackJsonp([16],{

/***/ 1134:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(547);


/***/ }),

/***/ 290:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 294:
/***/ (function(module, exports) {

module.exports = "/*\n * bootstrap-tagsinput v0.7.1 by Tim Schlechter\n * \n */\n\n!function(a){\"use strict\";function b(b,c){this.isInit=!0,this.itemsArray=[],this.$element=a(b),this.$element.hide(),this.isSelect=\"SELECT\"===b.tagName,this.multiple=this.isSelect&&b.hasAttribute(\"multiple\"),this.objectItems=c&&c.itemValue,this.placeholderText=b.hasAttribute(\"placeholder\")?this.$element.attr(\"placeholder\"):\"\",this.inputSize=Math.max(1,this.placeholderText.length),this.$container=a('<div class=\"bootstrap-tagsinput\"></div>'),this.$input=a('<input type=\"text\" placeholder=\"'+this.placeholderText+'\"/>').appendTo(this.$container),this.$element.before(this.$container),this.build(c),this.isInit=!1}function c(a,b){if(\"function\"!=typeof a[b]){var c=a[b];a[b]=function(a){return a[c]}}}function d(a,b){if(\"function\"!=typeof a[b]){var c=a[b];a[b]=function(){return c}}}function e(a){return a?i.text(a).html():\"\"}function f(a){var b=0;if(document.selection){a.focus();var c=document.selection.createRange();c.moveStart(\"character\",-a.value.length),b=c.text.length}else(a.selectionStart||\"0\"==a.selectionStart)&&(b=a.selectionStart);return b}function g(b,c){var d=!1;return a.each(c,function(a,c){if(\"number\"==typeof c&&b.which===c)return d=!0,!1;if(b.which===c.which){var e=!c.hasOwnProperty(\"altKey\")||b.altKey===c.altKey,f=!c.hasOwnProperty(\"shiftKey\")||b.shiftKey===c.shiftKey,g=!c.hasOwnProperty(\"ctrlKey\")||b.ctrlKey===c.ctrlKey;if(e&&f&&g)return d=!0,!1}}),d}var h={tagClass:function(a){return\"label label-info\"},itemValue:function(a){return a?a.toString():a},itemText:function(a){return this.itemValue(a)},itemTitle:function(a){return null},freeInput:!0,addOnBlur:!0,maxTags:void 0,maxChars:void 0,confirmKeys:[13,44],delimiter:\",\",delimiterRegex:null,cancelConfirmKeysOnEmpty:!1,onTagExists:function(a,b){b.hide().fadeIn()},trimValue:!1,allowDuplicates:!1};b.prototype={constructor:b,add:function(b,c,d){var f=this;if(!(f.options.maxTags&&f.itemsArray.length>=f.options.maxTags)&&(b===!1||b)){if(\"string\"==typeof b&&f.options.trimValue&&(b=a.trim(b)),\"object\"==typeof b&&!f.objectItems)throw\"Can't add objects when itemValue option is not set\";if(!b.toString().match(/^\\s*$/)){if(f.isSelect&&!f.multiple&&f.itemsArray.length>0&&f.remove(f.itemsArray[0]),\"string\"==typeof b&&\"INPUT\"===this.$element[0].tagName){var g=f.options.delimiterRegex?f.options.delimiterRegex:f.options.delimiter,h=b.split(g);if(h.length>1){for(var i=0;i<h.length;i++)this.add(h[i],!0);return void(c||f.pushVal())}}var j=f.options.itemValue(b),k=f.options.itemText(b),l=f.options.tagClass(b),m=f.options.itemTitle(b),n=a.grep(f.itemsArray,function(a){return f.options.itemValue(a)===j})[0];if(!n||f.options.allowDuplicates){if(!(f.items().toString().length+b.length+1>f.options.maxInputLength)){var o=a.Event(\"beforeItemAdd\",{item:b,cancel:!1,options:d});if(f.$element.trigger(o),!o.cancel){f.itemsArray.push(b);var p=a('<span class=\"tag '+e(l)+(null!==m?'\" title=\"'+m:\"\")+'\">'+e(k)+'<span data-role=\"remove\"></span></span>');p.data(\"item\",b),f.findInputWrapper().before(p),p.after(\" \");var q=a('option[value=\"'+encodeURIComponent(j)+'\"]',f.$element).length||a('option[value=\"'+e(j)+'\"]',f.$element).length;if(f.isSelect&&!q){var r=a(\"<option selected>\"+e(k)+\"</option>\");r.data(\"item\",b),r.attr(\"value\",j),f.$element.append(r)}c||f.pushVal(),(f.options.maxTags===f.itemsArray.length||f.items().toString().length===f.options.maxInputLength)&&f.$container.addClass(\"bootstrap-tagsinput-max\"),a(\".typeahead, .twitter-typeahead\",f.$container).length&&f.$input.typeahead(\"val\",\"\"),this.isInit?f.$element.trigger(a.Event(\"itemAddedOnInit\",{item:b,options:d})):f.$element.trigger(a.Event(\"itemAdded\",{item:b,options:d}))}}}else if(f.options.onTagExists){var s=a(\".tag\",f.$container).filter(function(){return a(this).data(\"item\")===n});f.options.onTagExists(b,s)}}}},remove:function(b,c,d){var e=this;if(e.objectItems&&(b=\"object\"==typeof b?a.grep(e.itemsArray,function(a){return e.options.itemValue(a)==e.options.itemValue(b)}):a.grep(e.itemsArray,function(a){return e.options.itemValue(a)==b}),b=b[b.length-1]),b){var f=a.Event(\"beforeItemRemove\",{item:b,cancel:!1,options:d});if(e.$element.trigger(f),f.cancel)return;a(\".tag\",e.$container).filter(function(){return a(this).data(\"item\")===b}).remove(),a(\"option\",e.$element).filter(function(){return a(this).data(\"item\")===b}).remove(),-1!==a.inArray(b,e.itemsArray)&&e.itemsArray.splice(a.inArray(b,e.itemsArray),1)}c||e.pushVal(),e.options.maxTags>e.itemsArray.length&&e.$container.removeClass(\"bootstrap-tagsinput-max\"),e.$element.trigger(a.Event(\"itemRemoved\",{item:b,options:d}))},removeAll:function(){var b=this;for(a(\".tag\",b.$container).remove(),a(\"option\",b.$element).remove();b.itemsArray.length>0;)b.itemsArray.pop();b.pushVal()},refresh:function(){var b=this;a(\".tag\",b.$container).each(function(){var c=a(this),d=c.data(\"item\"),f=b.options.itemValue(d),g=b.options.itemText(d),h=b.options.tagClass(d);if(c.attr(\"class\",null),c.addClass(\"tag \"+e(h)),c.contents().filter(function(){return 3==this.nodeType})[0].nodeValue=e(g),b.isSelect){var i=a(\"option\",b.$element).filter(function(){return a(this).data(\"item\")===d});i.attr(\"value\",f)}})},items:function(){return this.itemsArray},pushVal:function(){var b=this,c=a.map(b.items(),function(a){return b.options.itemValue(a).toString()});b.$element.val(c,!0).trigger(\"change\")},build:function(b){var e=this;if(e.options=a.extend({},h,b),e.objectItems&&(e.options.freeInput=!1),c(e.options,\"itemValue\"),c(e.options,\"itemText\"),d(e.options,\"tagClass\"),e.options.typeahead){var i=e.options.typeahead||{};d(i,\"source\"),e.$input.typeahead(a.extend({},i,{source:function(b,c){function d(a){for(var b=[],d=0;d<a.length;d++){var g=e.options.itemText(a[d]);f[g]=a[d],b.push(g)}c(b)}this.map={};var f=this.map,g=i.source(b);a.isFunction(g.success)?g.success(d):a.isFunction(g.then)?g.then(d):a.when(g).then(d)},updater:function(a){return e.add(this.map[a]),this.map[a]},matcher:function(a){return-1!==a.toLowerCase().indexOf(this.query.trim().toLowerCase())},sorter:function(a){return a.sort()},highlighter:function(a){var b=new RegExp(\"(\"+this.query+\")\",\"gi\");return a.replace(b,\"<strong>$1</strong>\")}}))}if(e.options.typeaheadjs){var j=null,k={},l=e.options.typeaheadjs;a.isArray(l)?(j=l[0],k=l[1]):k=l,e.$input.typeahead(j,k).on(\"typeahead:selected\",a.proxy(function(a,b){k.valueKey?e.add(b[k.valueKey]):e.add(b),e.$input.typeahead(\"val\",\"\")},e))}e.$container.on(\"click\",a.proxy(function(a){e.$element.attr(\"disabled\")||e.$input.removeAttr(\"disabled\"),e.$input.focus()},e)),e.options.addOnBlur&&e.options.freeInput&&e.$input.on(\"focusout\",a.proxy(function(b){0===a(\".typeahead, .twitter-typeahead\",e.$container).length&&(e.add(e.$input.val()),e.$input.val(\"\"))},e)),e.$container.on(\"keydown\",\"input\",a.proxy(function(b){var c=a(b.target),d=e.findInputWrapper();if(e.$element.attr(\"disabled\"))return void e.$input.attr(\"disabled\",\"disabled\");switch(b.which){case 8:if(0===f(c[0])){var g=d.prev();g.length&&e.remove(g.data(\"item\"))}break;case 46:if(0===f(c[0])){var h=d.next();h.length&&e.remove(h.data(\"item\"))}break;case 37:var i=d.prev();0===c.val().length&&i[0]&&(i.before(d),c.focus());break;case 39:var j=d.next();0===c.val().length&&j[0]&&(j.after(d),c.focus())}var k=c.val().length;Math.ceil(k/5);c.attr(\"size\",Math.max(this.inputSize,c.val().length))},e)),e.$container.on(\"keypress\",\"input\",a.proxy(function(b){var c=a(b.target);if(e.$element.attr(\"disabled\"))return void e.$input.attr(\"disabled\",\"disabled\");var d=c.val(),f=e.options.maxChars&&d.length>=e.options.maxChars;e.options.freeInput&&(g(b,e.options.confirmKeys)||f)&&(0!==d.length&&(e.add(f?d.substr(0,e.options.maxChars):d),c.val(\"\")),e.options.cancelConfirmKeysOnEmpty===!1&&b.preventDefault());var h=c.val().length;Math.ceil(h/5);c.attr(\"size\",Math.max(this.inputSize,c.val().length))},e)),e.$container.on(\"click\",\"[data-role=remove]\",a.proxy(function(b){e.$element.attr(\"disabled\")||e.remove(a(b.target).closest(\".tag\").data(\"item\"))},e)),e.options.itemValue===h.itemValue&&(\"INPUT\"===e.$element[0].tagName?e.add(e.$element.val()):a(\"option\",e.$element).each(function(){e.add(a(this).attr(\"value\"),!0)}))},destroy:function(){var a=this;a.$container.off(\"keypress\",\"input\"),a.$container.off(\"click\",\"[role=remove]\"),a.$container.remove(),a.$element.removeData(\"tagsinput\"),a.$element.show()},focus:function(){this.$input.focus()},input:function(){return this.$input},findInputWrapper:function(){for(var b=this.$input[0],c=this.$container[0];b&&b.parentNode!==c;)b=b.parentNode;return a(b)}},a.fn.tagsinput=function(c,d,e){var f=[];return this.each(function(){var g=a(this).data(\"tagsinput\");if(g)if(c||d){if(void 0!==g[c]){if(3===g[c].length&&void 0!==e)var h=g[c](d,null,e);else var h=g[c](d);void 0!==h&&f.push(h)}}else f.push(g);else g=new b(this,c),a(this).data(\"tagsinput\",g),f.push(g),\"SELECT\"===this.tagName&&a(\"option\",a(this)).attr(\"selected\",\"selected\"),a(this).val(a(this).val())}),\"string\"==typeof c?f.length>1?f:f[0]:f},a.fn.tagsinput.Constructor=b;var i=a(\"<div />\");a(function(){a(\"input[data-role=tagsinput], select[multiple][data-role=tagsinput]\").tagsinput()})}(window.jQuery);\n//# sourceMappingURL=bootstrap-tagsinput.min.js.map"

/***/ }),

/***/ 299:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20)(__webpack_require__(294))

/***/ }),

/***/ 547:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var tables = __webpack_require__(7);
var ntables = __webpack_require__(13);
__webpack_require__(21);
__webpack_require__(299);
__webpack_require__(290);
__webpack_require__(932);
var upload_1 = __webpack_require__(30);
var SynonymsIndex;
(function (SynonymsIndex) {
    var table, state, t, side, tableD, gainTable, gainTableEl, gainTableD, innerSaveFlag = false;
    $(document).ready(function () {
        initDate();
        initSynoTable();
        initSider();
        initGainTable();
        bindEvents();
    });
    function initSynoTable() {
        table = new tables.Table({
            el: $('#key-table'),
            options: {
                serverSide: true,
                paging: true,
                ajax: {
                    type: 'POST',
                    url: 'knowledge/synonyms/list',
                    dataSrc: function (data) { return data.rows; },
                    data: function (d) {
                        var time = $('#form-date').val().split(' - '), data = {
                            page: Math.floor((d.start + d.length) / d.length),
                            rows: d.length,
                            beginTime: time[0],
                            endTime: time[1],
                            keyword: $.trim($('#keywrods').val()),
                            source: $('#source').val()
                        };
                        return utils_1.cleanObject(data);
                    }
                },
                columns: [
                    { data: 'representative', title: '同义词组代表词' },
                    { data: 'synonyms', title: '同文词组' },
                    { data: 'tsp', title: '更新时间', width: ntables.VARIABLES.width.commonTime, render: utils_1.renderCommonTime }
                ],
                initComplete: function () {
                    tableD = $('#key-table').DataTable();
                    upload();
                    var input = $('#keywrods');
                    initTags();
                    initAddWords();
                    initDelWords();
                    initEditWords();
                    initSubmit();
                    utils_1.bindEnter(input, function () {
                        table.reload();
                    });
                    $('#search-btn').on('click', function () {
                        table.reload();
                    });
                    $('#page-change').on('change', function (e) {
                        tableD.page.len($('#page-change').val()).draw(false);
                    });
                }
            }
        });
    }
    var $gainKey;
    var $import;
    var $importAll;
    var $clearBtn;
    var $btns = [];
    var $oBtns = [];
    function initSider() {
        side = new utils_1.SideBar({
            id: 'gain',
            title: '自动获取同义词',
            content: "<div>\n\t\t\t\t\t\t<div class='form-group'>\n\t\t\t\t\t\t\t<button class='btn btn-primary btn-sm' type='button'  disabled='true'id='gainKey'>\u83B7\u53D6\u540C\u4E49\u8BCD</button>\n\t\t\t\t\t\t\t<button class='btn btn-primary btn-sm' type='button' disabled='true' id='import' style='display:none'>\u786E\u8BA4\u5BFC\u5165</button>\n\t\t\t\t\t\t\t<button class='btn btn-primary btn-sm' type='button' id='importAll' style='display:none'>\u5168\u90E8\u5BFC\u5165</button>\n\t\t\t\t\t\t\t<button class='btn btn-danger btn-sm' type='button' id='clearBtn'>\u6E05\u7A7A\u5217\u8868</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<table class='table fixed-table' id='gain-table'></table>\n\t\t\t\t\t</div>",
            onShow: function () {
                isGenDone();
                if (gainTableLength) {
                    $('#import').css('display', 'inline-block');
                    $('#importAll').css('display', 'inline-block');
                }
                gainTableD.rows().select();
            } /* ,
            onHide: () => {
                table.reload();
            } */
        });
    }
    // sider中一个在进程中，其他都不能使用
    function forbidAll() {
        $oBtns.forEach(function (v) {
            v.prop('disabled', 'true');
        });
    }
    function reopenAll() {
        $btns.forEach(function (v) {
            v.prop('disabled', null);
        });
    }
    var isThisError = false;
    var thisMsg = {
        msg: '',
        code: '000',
        error: false
    };
    var notifyMsg;
    // 判断轮循有没有结束
    function isGenDone() {
        var beforeMsg = thisMsg;
        $.ajax({
            url: 'knowledge/synonyms/isSynonymGenDone',
            method: 'POST',
            success: function (msg) {
                thisMsg = msg;
                if (msg.code === '200') {
                    isThisError = true;
                    if (msg.data) {
                        $('#import').css('display', 'inline-block');
                        $('#importAll').css('display', 'inline-block');
                    }
                    // $gainKey.prop('disabled',null);
                    reopenAll();
                    gainTable.reload();
                    if (notifyMsg) {
                        notifyMsg.remove();
                    }
                    utils_1.alertMessage(msg.msg, !msg.error);
                }
                else if (msg.code === '201') {
                    isThisError = true;
                    // $gainKey.prop('disabled',null);
                    reopenAll();
                    gainTable.reload();
                    if (notifyMsg) {
                        notifyMsg.remove();
                    }
                }
                else if (msg.code === '500') {
                    isThisError = true;
                    // $gainKey.prop('disabled', true);
                    forbidAll();
                    if (notifyMsg) {
                        notifyMsg.remove();
                    }
                    utils_1.alertMessage(msg.msg, !msg.error);
                }
                else if (msg.code === '501') {
                    isThisError = true;
                    // $gainKey.prop('disabled', true);
                    forbidAll();
                    // 之前的不是501 就弹出
                    if (beforeMsg.code !== '501') {
                        notifyMsg = utils_1.alertMessage(thisMsg.msg, '', false);
                    }
                    setTimeout(isGenDone, 5000);
                }
            }
        });
    }
    function initDate() {
        new utils_1.CommonDate({
            el: $('#form-date')
        });
    }
    function upload() {
        var uploadBtn = $('#upload-submit-btn');
        var uploader = new upload_1.DelayUpload({
            accept: '.xls,xlsx',
            url: 'knowledge/synonyms/batchupload',
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
                    table.reload();
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
            uploader.cancel();
        });
        $('#batch-upload-btn').on('click', function () {
            $('#upload').modal('show');
        });
    }
    function initTags() {
        var tag = $('#input-tag');
        var input = $('#input-title');
        var lastTitle;
        tag.tagsinput();
        tag.on('beforeItemRemove', function (e) {
            var val = $.trim(input.val());
            if (e.item === val) {
                input.val('');
            }
        });
        utils_1.bindEnter(input, function () {
            $('.bootstrap-tagsinput input').focus();
        });
        utils_1.bindInput(input, 'input change', function (val) {
            var value = val;
            input.val(value);
            if (lastTitle === value) {
                return;
            }
            if (!lastTitle) {
                lastTitle = value;
            }
            else {
                tag.tagsinput('remove', lastTitle);
                lastTitle = value;
            }
            tag.tagsinput('add', value);
        });
        $('#add-modal').on('hidden.bs.modal', function () {
            $('#input-title').val('');
            tag.tagsinput('removeAll');
            clearData();
            state = null;
        });
    }
    function initAddWords() {
        $('#add-btn').on('click', function () {
            $('#add-modal').modal('show').find('.modal-title').text('添加同义词');
            clearData();
            state = 'add';
        });
    }
    function initSubmit() {
        var btn = $('#submit-btn');
        var tag = $('#input-tag');
        var bool;
        btn.on('click', function () {
            if (!innerSaveFlag) {
                var value = $.trim($('#input-title').val());
                var tagVal = tag.val();
                if (!state) {
                    utils_1.alertMessage('未知错误!');
                }
                else if (!value) {
                    utils_1.alertMessage('请输入同义词代表词!');
                }
                else if (tag.tagsinput('items').length <= 1) {
                    utils_1.alertMessage('请至少输入一个同义词!');
                }
                else if (tagVal.replace(/,/g, '').length > 200) {
                    utils_1.alertMessage('同义词组长度不能超过200!');
                }
                else {
                    var id = tag.attr('data-id'), data = {
                        representative: value,
                        synonyms: tagVal
                    };
                    var url = void 0;
                    if (id) {
                        data.id = id;
                        url = 'knowledge/synonyms/update';
                        bool = false;
                    }
                    else {
                        url = 'knowledge/synonyms/add';
                        bool = true;
                    }
                    utils_1.loadingBtn(btn);
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: data,
                        success: function (msg) {
                            utils_1.alertMessage(msg.msg, msg.code);
                            if (!msg.error) {
                                $('#add-modal').modal('hide');
                                // table.draw();
                                // t.refresh(bool);
                                table.reload();
                            }
                        },
                        complete: function () {
                            utils_1.endLoadingBtn(btn);
                        }
                    });
                }
            }
        });
    }
    function initDelWords() {
        ntables.delBtnClick({
            el: $('#del-btn'),
            table: tableD,
            name: '同义词',
            url: 'knowledge/synonyms/delete',
            type: 'GET'
        });
    }
    function clearData() {
        var tag = $('#input-tag');
        tag.attr({ 'data-id': '', 'data-value': '' });
    }
    function initEditWords() {
        var tag = $('#input-tag');
        $('#edit-btn').on('click', function () {
            var select = $('.selected', '#key-table');
            if (select.length > 1) {
                utils_1.alertMessage('只能编辑一个同义词!');
            }
            else if (select.length < 1) {
                utils_1.alertMessage('请选择要编辑的同义词!');
            }
            else {
                var data = tableD.row(select).data();
                var synonyms = data.synonyms.split(',');
                tag.attr('data-id', data.id);
                tag.attr('data-value', data.representative);
                $('#input-title').val(data.representative);
                synonyms.forEach(function (v) {
                    tag.tagsinput('add', v);
                }, this);
                $('#add-modal').modal('show').find('.modal-title').text('编辑同义词');
                state = 'edit';
            }
        });
    }
    function bindEvents() {
        bindGainEvent();
    }
    function bindGainEvent() {
        $('#gain-btn').on('click', function () {
            side.show();
        });
    }
    var gainTableLength;
    function initGainTable() {
        gainTableEl = $('#gain-table');
        gainTable = new tables.Table({
            el: gainTableEl,
            options: {
                serverSide: true,
                paging: true,
                ajax: {
                    type: 'GET',
                    url: 'knowledge/synonyms/getImpList',
                    dataSrc: function (data) { gainTableLength = data.rows.length; return data.rows; },
                    data: function (d) {
                        return utils_1.cleanObject({
                            page: ntables.getPage(d),
                            rows: d.length
                        });
                    }
                },
                columns: [
                    { data: 'representative', title: '同义词组代表词' },
                    { data: 'synonyms', title: '同义词组' },
                    { data: 'tsp', title: '提取时间', render: ntables.renderCommonTime, width: ntables.VARIABLES.width.commonTime },
                    { data: 'status', title: '状态', render: renderSt },
                    { data: 'id', title: '操作', render: renderAction, className: 'prevent' }
                ],
                initComplete: gainInitComplete
            },
            checkbox: {
                data: 'id',
                defaultChecked: true
            }
        });
    }
    function renderSt(d) {
        if (d === 0) {
            return '等待导入';
        }
        else {
            return '已导入';
        }
    }
    function renderAction(d, type, row) {
        return "<div title='\u7F16\u8F91' style='cursor:pointer' data-id='" + row.id + "' data-representative='" + row.representative + "' data-synonyms='" + row.synonyms + "'><img src='" + ctx + "/images/materialIcon/editIconD.png' width='20px' height='auto' class='gain-edit'/></div>";
    }
    function gainInitComplete() {
        gainTableD = $('#gain-table').DataTable();
        $gainKey = $('#gainKey');
        $import = $('#import');
        $importAll = $('#importAll');
        $clearBtn = $('#clearBtn');
        $oBtns = [$import, $gainKey, $importAll, $clearBtn];
        $btns = [$gainKey, $importAll, $clearBtn];
        bindGainKeyWords();
        bindChangeDisabled();
        bindImport();
        bindClear();
        bindEdit();
        bindEditSave();
        $('#add-modal').on('hide.bs.modal', function () {
            innerSaveFlag = false;
        });
        bindAllImport();
    }
    // 从后端获取同义词
    function bindGainKeyWords() {
        $gainKey.on('click', function () {
            // const endLoading=loadingBtn($(this));
            // $gainKey.prop('disabled', true);
            forbidAll();
            $.ajax({
                url: 'knowledge/synonyms/generateSynonymsInvoke',
                method: 'GET',
                success: function (msg) {
                    if (msg.code === '200') {
                        var isBeforeError = isThisError;
                        if (isBeforeError) {
                            gainTable.reload(true, function () {
                                isGenDone();
                            });
                        }
                    }
                    else {
                        utils_1.alertMessage(msg.msg, !msg.error);
                    }
                },
                complete: function () {
                    // endLoading();
                    // $gainKey.prop('disabled', null);
                    reopenAll();
                }
            });
        });
    }
    function bindChangeDisabled() {
        gainTableD.on('select.dt', function () {
            if (gainTable.selected.length > 0) {
                $import.prop('disabled', null);
            }
        });
        gainTableD.on('deselect.dt', function () {
            if (gainTable.selected.length === 0) {
                $import.prop('disabled', true);
            }
        });
    }
    // 全部导入
    function bindAllImport() {
        $importAll.on('click', function () {
            forbidAll();
            // $(this).prop('disabled',true);
            // const endImA = loadingBtn($(this));
            $.ajax({
                url: 'knowledge/synonyms/impAllSynonyms',
                type: 'POST',
                success: function (msg) {
                    // endImA();
                    // $(this).prop('disabled',true);
                    reopenAll();
                    gainTable.reload();
                    table.reload();
                    utils_1.alertMessage(msg.msg, !msg.error);
                }
            });
        });
    }
    function bindImport() {
        $import.on('click', function () {
            // gain selected rows
            // const endImport = loadingBtn($(this));
            // $(this).prop('disabled',true);
            forbidAll();
            var selectedRows = gainTable.selected;
            var ids = [];
            selectedRows.forEach(function (v) {
                ids.push(v.id);
            });
            $.ajax({
                url: 'knowledge/synonyms/impSynonyms',
                method: 'POST',
                data: {
                    ids: ids.join(',')
                },
                success: function (msg) {
                    if (msg.code === '200') {
                        gainTable.reload();
                        table.reload();
                    }
                    // endImport();
                    // $(this).prop('disabled',true);
                    reopenAll();
                    utils_1.alertMessage(msg.msg, !msg.error);
                }
            });
        });
    }
    function bindClear() {
        $clearBtn.on('click', function () {
            forbidAll();
            // $(this).prop('disabled',true);
            // const endCBtn=loadingBtn($(this));
            // 清空页面
            $.ajax({
                url: 'knowledge/synonyms/clearImpList',
                method: 'POST',
                success: function (msg) {
                    if (msg.code === '200') {
                        gainTable.reload();
                    }
                    utils_1.alertMessage(msg.msg, !msg.error);
                },
                complete: function () {
                    // endCBtn();
                    // $(this).prop('disabled',null);
                    reopenAll();
                }
            });
        });
    }
    // 点击表格编辑功能
    function bindEdit() {
        var tag = $('#input-tag');
        gainTableEl.on('click', '.gain-edit', function () {
            innerSaveFlag = true;
            var dataEl = $(this).parent('div');
            var sid = dataEl.data('id');
            var ssynonyms = dataEl.data('synonyms').split(',');
            var srepresentative = dataEl.data('representative');
            tag.attr('data-id', sid);
            tag.attr('data-value', srepresentative);
            $('#input-title').val(srepresentative);
            ssynonyms.forEach(function (v) {
                tag.tagsinput('add', v);
            }, this);
            $('#add-modal').modal('show').find('.modal-title').text('编辑同义词');
        });
    }
    // 点击编辑保存功能
    function bindEditSave() {
        $('#submit-btn').on('click', function () {
            var tag = $('#input-tag');
            var id = tag.attr('data-id');
            var value = $.trim($('#input-title').val());
            var tagVal = tag.val();
            if (innerSaveFlag) {
                var root = $('#edit-modal-content input');
                var newWord = $.trim(root.val());
                var nid = root.data('id');
                $.ajax({
                    url: 'knowledge/synonyms/modSynonymsImp',
                    method: 'POST',
                    data: {
                        id: id,
                        representative: value,
                        synonyms: tagVal
                    },
                    success: function (msg) {
                        if (msg.code === '200') {
                            gainTable.reload();
                            $('#add-modal').modal('hide');
                        }
                        utils_1.alertMessage(msg.msg, !msg.error);
                    }
                });
            }
        });
    }
})(SynonymsIndex || (SynonymsIndex = {}));


/***/ }),

/***/ 932:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1134]);
//# sourceMappingURL=16.js.map