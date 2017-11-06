webpackJsonp([15],{

/***/ 1136:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(549);


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

/***/ 549:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(21);
__webpack_require__(299);
__webpack_require__(290);
__webpack_require__(934);
var upload_1 = __webpack_require__(30);
var TyposIndex;
(function (TyposIndex) {
    var table, state, t;
    $(document).ready(function () {
        initDate();
        initDataTables();
    });
    function initDataTables() {
        table = $('#key-table').DataTable(Object.assign(tables_1.commonConfig(), {
            ajax: {
                type: 'POST',
                url: 'knowledge/typo/list',
                dataSrc: function (data) { return data.rows; },
                data: function (d) {
                    var time = $('#form-date').val().split(' - '), data = {
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length,
                        beginTime: time[0],
                        endTime: time[1],
                        keyword: $.trim($('#keywrods').val()),
                        correct: $.trim($('#correct').val())
                    };
                    return utils_1.cleanObject(data);
                }
            },
            initComplete: function () {
                upload();
                // const input = $("#keywrods");
                initTags();
                initAddWords();
                initDelWords();
                initEditWords();
                initSubmit();
                utils_1.bindEnter($('#keywrods,#correct'), function () {
                    t.refresh(true);
                    // table.draw();
                });
            },
            columns: [
                { data: 'typo', title: '用户输入的错字' },
                { data: 'correct', title: '纠正为' },
                { data: 'tsp', title: '更新时间', width: tables_1.VARIABLES.width.commonTime, render: utils_1.renderCommonTime }
            ]
        }));
        t = new tables_1.Table(table);
        $('#search-btn').on('click', function () {
            t.refresh(true);
            // table.draw();
        });
        tables_1.bindPageChange(table, $('#page-change'));
    }
    function initDate() {
        new utils_1.CommonDate({
            el: $('#form-date')
        });
    }
    function upload() {
        var uploadBtn = $('#upload-submit-btn');
        var upload = new upload_1.DelayUpload({
            accept: '.xls,xlsx',
            url: 'knowledge/typo/batchupload',
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
        //     url: 'knowledge/typo/batchupload',
        //     name: 'uploadedFile',
        //     accept: '.xlsx,.xls',
        //     bindChangeEvent: false,
        //     success: (msg) => {
        //         alertMessage(msg.msg, msg.code, false);
        //         if (!msg.error) {
        //             $('#upload').modal('hide');
        //             t.refresh();
        //             // table.draw();
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
    }
    function initTags() {
        var tag = $('#input-tag');
        var input = $('#input-title');
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
        $('#add-modal').on('hidden.bs.modal', function () {
            $('#input-title').val('');
            tag.tagsinput('removeAll');
            clearData();
            state = null;
        });
    }
    function initAddWords() {
        $('#add-btn').on('click', function () {
            $('#add-modal').modal('show').find('.modal-title').text('添加错别字');
            clearData();
            state = 'add';
        });
    }
    function initSubmit() {
        var btn = $('#submit-btn');
        var tag = $('#input-tag');
        btn.on('click', function () {
            var value = $.trim($('#input-title').val());
            var tagVal = tag.val();
            var bool;
            if (!state) {
                utils_1.alertMessage('未知错误!');
            }
            else if (!value) {
                utils_1.alertMessage('请输入错别字代表词!');
            }
            else if (tagVal.replace(/,/g, '').length > 200) {
                utils_1.alertMessage('用户输入的错字长度不能超过200!');
            }
            else {
                var id = tag.attr('data-id'), data = {
                    correct: value,
                    typo: tagVal
                };
                var url = void 0;
                if (state === 'edit') {
                    data.id = id;
                    url = 'knowledge/typo/update';
                    bool = false;
                }
                else if (state === 'add') {
                    url = 'knowledge/typo/add';
                    bool = true;
                }
                /*if (id) {
                    data.id = id;
                    url = 'knowledge/typo/update';
                }
                else {
                    url = 'knowledge/typo/add';
                }*/
                utils_1.loadingBtn(btn);
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data,
                    success: function (msg) {
                        utils_1.alertMessage(msg.msg, msg.code);
                        if (!msg.error) {
                            $('#add-modal').modal('hide');
                            t.refresh(bool);
                            // table.draw();
                        }
                    },
                    complete: function () {
                        utils_1.endLoadingBtn(btn);
                    }
                });
            }
        });
    }
    function initDelWords() {
        tables_1.delBtnClick({
            el: $('#del-btn'),
            table: table,
            name: '错别字',
            url: 'knowledge/typo/delete',
            type: 'GET'
        });
    }
    function clearData() {
        var tag = $('#typos');
        tag.attr({ 'data-id': '', 'data-value': '' });
    }
    function initEditWords() {
        var tag = $('#input-tag');
        $('#edit-btn').on('click', function () {
            var select = $('.selected');
            if (select.length > 1) {
                utils_1.alertMessage('只能编辑一个错别字!');
            }
            else if (select.length < 1) {
                utils_1.alertMessage('请选择要编辑的错别字!');
            }
            else {
                var data = table.row(select).data();
                var typo = data.typo.split(',');
                tag.attr('data-id', data.id);
                tag.attr('data-value', data.correct);
                $('#input-title').val(data.correct);
                typo.forEach(function (v) {
                    tag.tagsinput('add', v);
                }, this);
                $('#add-modal').modal('show').find('.modal-title').text('编辑错别字');
                state = 'edit';
            }
        });
    }
})(TyposIndex || (TyposIndex = {}));


/***/ }),

/***/ 934:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1136]);
//# sourceMappingURL=15.js.map