webpackJsonp([26],{

/***/ 1117:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(528);


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

/***/ 528:
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
var corpusUpdateSideBar_1 = __webpack_require__(123);
var new_table_1 = __webpack_require__(7);
var tables_1 = __webpack_require__(13);
__webpack_require__(37);
__webpack_require__(21);
__webpack_require__(911);
var upload_1 = __webpack_require__(30);
var KnowledgeEditbyAIndex;
(function (KnowledgeEditbyAIndex) {
    var actionTable, pairId;
    var request;
    var endLoading;
    var sideBar;
    var currentResourceData;
    var classify = fillSelectData(); // 填充下拉框菜单信息
    var date = initDate(); // 初始化时间表单
    clearSession();
    // initDataTables(); // 初始化主表格
    var table = new new_table_1.Table({
        el: $('#table'),
        checkbox: {
            data: 'pairId'
        },
        options: {
            ajax: {
                type: 'GET',
                url: 'knowledge/corpusManage/corpus/list',
                dataSrc: function (data) {
                    var d = data.rows;
                    return d;
                },
                data: function (d) {
                    var order = d.order[0], field = d.columns[order.column].data, data = Object.assign(getFormData(), {
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length,
                        sortType: order.dir,
                        sortField: field
                    });
                    return utils_1.cleanObject(data);
                }
            },
            serverSide: true,
            paging: true,
            ordering: true,
            // order: [[8, 'desc']],
            order: [[3, 'desc']],
            columns: [
                // {
                // 	data: 'countSubQ',
                // 	title: '',
                // 	orderable: false,
                // 	width: '12px',
                // 	className: 'show-q-corpus force-width prevent',
                // 	createdCell: createShowCorpus
                // },
                {
                    name: 'question',
                    data: 'literal',
                    title: '问题',
                    orderable: false,
                    render: renderQuestion
                },
                // {
                // 	data: 'countSubA',
                // 	title: '',
                // 	orderable: false,
                // 	width: '12px',
                // 	className: 'show-a-corpus force-width prevent',
                // 	createdCell: createShowCorpus
                // },
                {
                    name: 'plainText',
                    data: 'digest',
                    title: '回复',
                    orderable: false,
                    render: renderAnswer
                },
                // {
                // 	data: 'locked',
                // 	title: '对话模型',
                // 	orderable: false,
                // 	width: '58px',
                // 	className: 'prevent',
                // 	render: renderDialog
                // },
                {
                    name: 'updateTime',
                    data: 'qupdateTime',
                    width: '70px',
                    title: '更新时间',
                    render: utils_1.renderSimpleTime
                }, {
                    data: 'questionId',
                    title: '操作',
                    width: '220px',
                    render: renderOperation,
                    orderable: false
                }
            ],
            initComplete: initComplete
        }
    });
    function renderOperation(text, status, rowData, a) {
        var talk = "<a data-id=\"" + rowData.pairId + "\" data-q=\"" + rowData.literal + "\" class=\"operate talk\">\u5BF9\u8BDD\u6A21\u578B</a>";
        if (!rowData.locked) {
            talk = '';
        }
        return "<a data-id=\"" + rowData.pairId + "\" class=\"operate edit\">\u7F16\u8F91</a><a data-id=\"" + rowData.pairId + "\" class=\"operate check\">\u67E5\u770B\u64CD\u4F5C\u8BB0\u5F55</a><a data-id=\"" + rowData.pairId + "\" class=\"operate delete\">\u5220\u9664</a>" + talk;
    }
    function initSideBar() {
        sideBar = new corpusUpdateSideBar_1.default({
            hideFn: function () {
                table.reload();
            }
        });
        // sideBar = new SideBar({
        // 	id: 'language',
        // 	title: '添加语料',
        // 	content: '',
        // 	onHide: () => {
        // 		$('#language').find('iframe').remove();
        // 	}
        // });
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
    function renderQuestion(text, status, rowData) {
        var classifyName = renderClassify(rowData.classifyId);
        var numberEl = "<a class=\"qmore\" data-id=\"" + rowData.pairId + "\">" + rowData.countSubQ + "</a>";
        if (rowData.countSubQ <= 0) {
            numberEl = "<a class=\"zero\" data-id=\"" + rowData.pairId + "\">" + rowData.countSubQ + "</a>";
        }
        var recommend = "<span class=\"small-item small repeat\">\u63A8\u8350\u95EE\u9898:<a class=\"rmore\" data-id=\"" + rowData.questionId + "\">" + rowData.recommendNum + "</a></span>";
        if (!rowData.recommendNum) {
            recommend = '';
        }
        return "\n\t\t<p class=\"info ellipsis\" title=\"" + text + "\"><span>" + text + "<span></p>\n\t\t<p class=\"small info\"><span class=\"small-item big\">\u7C7B\u578B:" + classifyName + "</span><span class=\"small-item small repeat\">\u590D\u8FF0\u95EE\u6CD5:" + numberEl + "</span>" + recommend + "</p>\n\t\t";
    }
    function renderAnswer(text, status, rowData) {
        var pushway = renderPushway(rowData.pushway);
        var character = renderCharacter(rowData.characterId);
        var type = renderType(rowData.type);
        var enType = getTypeName(rowData.type);
        var numberEl = "<a class=\"amore\" data-id=\"" + rowData.pairId + "\">" + rowData.countSubA + "</a>";
        if (rowData.countSubA <= 0) {
            numberEl = "<a class=\"zero\" data-id=\"" + rowData.pairId + "\">" + rowData.countSubA + "</a>";
        }
        return "\n\t\t<p class=\"info\"><span class=\"small\">" + type + ":</span><span class=\"ellipsis a-hover\" data-type=\"" + enType + "\" data-id=\"" + rowData.resourceId + "\" data-toggle=\"popover\" data-trigger=\"manual\">" + utils_1.formatText(text) + "</span></p>\n\t\t<p class=\"small info\"><span class=\"small-item\">\u6E20\u9053:" + pushway + "</span><span class=\"small-item\">\u89D2\u8272:" + character + "</span><span class=\"small-item repeat\">\u5176\u4ED6\u56DE\u590D:" + numberEl + "</span></p>\n\t\t";
    }
    function initDate() {
        return new utils_1.CommonDate({
            el: $('#form-date')
        });
    }
    // 填充下拉框数据
    function fillSelectData() {
        return new utils_1.ClassifyTree({
            el: $('#classify'),
            data: utils_1.formatClassify(selectData.classify, true),
            selected: true,
            multiple: true
        });
    }
    function initComplete() {
        var dt = table.dt;
        var delBtn = $('#delete-submit-btn');
        var uploadBtn = $('#upload-submit-btn');
        var upload = new upload_1.DelayUpload({
            accept: '.xls,.xlsx',
            url: 'knowledge/corpusManage/uploadCorpusSubmit',
            saveBtn: $('#upload-wrap'),
            submitBtn: uploadBtn,
            name: 'attach',
            save: function (id, name) {
                $('#info-wrap').show();
                $('#info-name').text(name);
            },
            success: function (res) {
                if (!res.error) {
                    $('#upload').modal('hide');
                    table.reload();
                    $('#info-wrap').hide();
                    $('#info-name').text('');
                    // isOver();
                }
            },
            cancel: function () {
                $('#info-wrap').hide();
                $('#info-name').text('');
            }
        });
        // table.addChildRows($('#table tbody tr:first'), [{ _all: 'sb' }, { qupdateTime: '123' }], 'q');
        $('#upload').on('hide.bs.modal', function () {
            upload.cancel();
        });
        var /*ids: string[] = [],*/ actionInit = false;
        // renderForm();
        initSideBar();
        tables_1.bindPageChange(dt, $('#page-change'));
        $('#add-corpus-btn').on('click', function () {
            sideBar.open(null, '添加语料');
            // changeIframeSideBar('添加语料', 'knowledge/corpusManage/update');
        });
        // $('#language').on('save', function () {
        // 	sideBar.hide();
        // 	table.reload();
        // });
        $('#search-btn').on('click', function () {
            table.reload(true);
        });
        // $('#edit-btn').on('click', () => {
        // 	const data = dt.rows({ selected: true }).data().toArray();
        // 	if (data.length < 1) {
        // 		alertMessage('请选择要操作的问题！');
        // 	}
        // 	else if (data.length > 1) {
        // 		alertMessage('只能编辑一个问题！');
        // 	}`
        // 	else {
        // 		const id = data[0].pairId;
        // 		window.location.href = `${ctx}/knowledge/corpusManage/update?pairId=${id}`;
        // 	}
        // });
        $('#del-btn').on('click', function () {
            var d = dt.rows({ selected: true }).data();
            // let num=0;
            if (d.length <= 0) {
                utils_1.alertMessage('请选择要操作的问题！');
                return;
            }
            var ids = d.map(function (v) { return v.pairId; });
            // for (let v of d) {
            // 	// if (v.dialog === 0) {
            // 	ids.push(v.id);
            // 	// }
            //     /* if(v.classifyId===1056){
            //          ++num;
            //      }*/
            // }
            // if (ids.length <= 0) {
            // 	alertMessage('语料在对话模型中被使用,请先修改对话模型后再尝试删除语料');
            // 	return;
            // }
            /*if(num){
                alertMessage('无法删除类型为”对话模型“的语料，请重新选择不包含该类型的语料');
                return;
            }*/
            utils_1.confirmModal({
                msg: '确认删除选中的语料吗？',
                cb: function (modal, btn) {
                    var end = utils_1.loadingBtn(btn);
                    $.ajax({
                        url: "knowledge/corpusManage/corpus/delete?" + $.param({
                            pairIds: ids.join(',')
                        }),
                        type: 'DELETE',
                        success: function (msg) {
                            if (!msg.error) {
                                table.reload();
                                modal.modal('hide');
                            }
                            utils_1.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            end();
                        }
                    });
                }
            });
            // $('#confirm').modal('show');
        });
        // delBtn.on('click', () => {
        // 	if (ids.length <= 0) {
        // 		return;
        // 	}
        // 	loadingBtn(delBtn);
        // 	$.ajax({
        // 		url: 'knowledge/editByA/delete',
        // 		data: {
        // 			pairIds: ids.join(',')
        // 		},
        // 		type: 'POST',
        // 		success: (msg) => {
        // 			if (!msg.error) {
        // 				t.refresh();
        // 				$('#confirm').modal('hide');
        // 			}
        // 			alertMessage(msg.msg, msg.code);
        // 		},
        // 		complete: () => {
        // 			endLoadingBtn(delBtn);
        // 		}
        // 	});
        // });
        $('#reset-btn').on('click', function () {
            setTimeout(function () {
                date.resetDate();
                classify.reset();
                dt.page.len($('#page-change').val());
            }, 0);
        });
        // $('#confirm').on('hidden.bs.modal', () => {
        // 	ids = [];
        // });
        $upBtn.on('click', function () {
            $('#upload').modal('show');
        });
        utils_1.bindEnter($('#form-answer,#form-question'), function () { return table.reload(true); });
        // $('m ').on('click', () => t.refresh(true)); // 查询问题
        $('#export-btn').on('click', function (e) {
            exportCorpus('export/export', $(e.currentTarget));
        });
        /* $('#nolimit-export-btn').on('click', () => {
            exportCorpus('corpus/exportExcel_nolimit');
        }); */
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
        // .on('mouseleave', '.a-hover', (e) => {
        // 	const el = $(e.currentTarget);
        // 	const popover = el.data('bs.popover');
        // 	setTimeout(() => {
        // 	}, 300);
        // 	if (popover) {
        // 		el.popover('hide');
        // 	}
        // });
        // 处理表格hover事件
        // $('#table').on('mouseenter', '.a-hover', throttle(
        // 	(e) => {
        // 		const el = $(e.currentTarget);
        // 		const type = el.data().type;
        // 		const id = el.data().id;
        // 		if (el.siblings('.popover').length) {
        // 			return;
        // 		}
        // 		if ($('[data-toggle="popover"]').length) {
        // 			$('[data-toggle="popover"]').popover('destroy');
        // 		}
        // 		if (request) {
        // 			request.abort();
        // 			request = null;
        // 		}
        // 		const text = (table.dt.row(el.closest('tr')).data() as any).digest;
        // 		if (type === 'html' || type === 'text' || type === 'intent') {
        // 			el.popover({
        // 				template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
        // 				html: true,
        // 				content: `<div class="resource-content">${text}</div>`,
        // 				container: 'body'
        // 			}).popover('show');
        // 		}
        // 		else if (type === 'attach') {
        // 			request = $.ajax({
        // 				url: `${kbRestUrl}/attachment/detail/${id}`,
        // 				method: 'GET'
        // 			}).done((msg) => {
        // 				const resourceItem = getResourceItem(el.data().type, msg);
        // 				el.popover({
        // 					template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
        // 					html: true,
        // 					content: `<div class="resource-content">${resourceItem}</div>`,
        // 					container: 'body'
        // 				}).popover('show');
        // 			});
        // 		}
        // 		else {
        // 			request = $.ajax({
        // 				url: `${kbRestUrl}/resource/detail`,
        // 				data: {
        // 					appid: appid,
        // 					type,
        // 					materialId: id
        // 				}
        // 			}).done((msg) => {
        // 				currentResourceData = msg;
        // 				const resourceItem = getResourceItem(el.data().type, msg);
        // 				el.popover({
        // 					template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
        // 					html: true,
        // 					content: `<div class="resource-content">${resourceItem}</div>`,
        // 					container: 'body'
        // 				}).popover('show');
        // 			});
        // 		}
        // 	},
        // 	200));
        // $('body').on('click', function (e) {
        // 	if ($(e.target).closest('.popover').length) {
        // 		return;
        // 	}
        // 	if ($(e.target).closest('#preview-modal').length) {
        // 		return;
        // 	}
        // 	$('[data-toggle="popover"]').popover('hide');
        // });
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
        $('#table').on('click', '.qmore', function () {
            var el = $(this);
            var tr = el.closest('tr');
            if (el.hasClass('open')) {
                table.hideChildRows(tr, 'question');
                el.removeClass('open');
                return;
            }
            hideAllChildRows();
            if (table.hasChild(tr, 'question')) {
                el.addClass('open');
                table.showChildRows(tr, 'question');
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
                                        updateTime: utils_1.renderSimpleTime(v.updateTime)
                                    };
                                });
                            }
                            else {
                                data = [{ _all: '无数据' }];
                            }
                            table.addChildRows(tr, data, 'question');
                            el.addClass('open');
                        }
                    }
                });
            }
        });
        $('#table').on('click', '.rmore', function () {
            var el = $(this);
            var tr = el.closest('tr');
            if (el.hasClass('open')) {
                table.hideChildRows(tr, 'question');
                el.removeClass('open');
                return;
            }
            hideAllChildRows();
            if (table.hasChild(tr, 'question')) {
                el.addClass('open');
                table.showChildRows(tr, 'question');
            }
            else {
                $.ajax({
                    url: 'knowledge/corpusManage/findByQuestionId',
                    type: 'GET',
                    data: {
                        questionId: el.data('id')
                    },
                    success: function (res) {
                        if (!res.error) {
                            var data = void 0;
                            if (res.data && res.data.length > 0) {
                                data = res.data.map(function (v) {
                                    return {
                                        question: v.recommendQuestion,
                                        updateTime: utils_1.renderSimpleTime(v.updateTime)
                                    };
                                });
                            }
                            else {
                                data = [{ _all: '无数据' }];
                            }
                            table.addChildRows(tr, data, 'question');
                            el.addClass('open');
                        }
                    }
                });
            }
        });
        $('#table').on('click', '.amore', function () {
            var el = $(this);
            var tr = el.closest('tr');
            if (el.hasClass('open')) {
                table.hideChildRows(tr, 'plainText');
                el.removeClass('open');
                return;
            }
            hideAllChildRows();
            if (table.hasChild(tr, 'plainText')) {
                el.addClass('open');
                table.showChildRows(tr, 'plainText');
            }
            else {
                $.ajax({
                    url: 'knowledge/corpusManage/listAnswer',
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
                                        plainText: renderChildAnswer(v),
                                        updateTime: utils_1.renderSimpleTime(v.updateTime)
                                    };
                                });
                            }
                            else {
                                data = [{ _all: '无数据' }];
                            }
                            table.addChildRows(tr, data, 'plainText');
                            el.addClass('open');
                        }
                    }
                });
            }
        });
        // $('#table').on('click', '.show-corpus-td.show-a-corpus', (e) => {
        // showCorpus(e, 'knowledge/corpusManage/listAnswer', 'plainText');
        // });
        // $('#table').on('click', '.show-corpus-td.show-q-corpus', (e) => {
        // 	showCorpus(e, 'knowledge/corpusManage/listSunQuestion', 'question');
        // });
        $('#table').on('click', '.talk', function () {
            var btn = $(this), id = btn.attr('data-id'), q = btn.attr('data-q');
            utils_1.loadingBtn(btn);
            $.ajax({
                url: 'knowledge/corpusManage/listDialogByPairId',
                type: 'GET',
                data: {
                    pairId: id
                },
                success: function (msg) {
                    if (!msg.error) {
                        $('#dialog-modal').modal('show');
                        initDialogTree(msg.msg, q);
                    }
                },
                complete: function () {
                    utils_1.endLoadingBtn(btn);
                }
            });
        });
        $('#table').on('click', '.edit', function () {
            var btn = $(this), id = btn.attr('data-id');
            sideBar.open(id, '编辑语料');
            // changeIframeSideBar('编辑语料', `knowledge/corpusManage/update?pairId=${id}`);
        });
        $('#table').on('click', '.delete', function () {
            var id = $(this).attr('data-id');
            utils_1.confirmModal({
                msg: '确认删除选中的语料吗？',
                cb: function (modal, btn) {
                    var end = utils_1.loadingBtn(btn);
                    $.ajax({
                        url: "knowledge/corpusManage/corpus/delete?" + $.param({
                            pairIds: id
                        }),
                        type: 'DELETE',
                        success: function (msg) {
                            if (!msg.error) {
                                table.reload();
                                modal.modal('hide');
                            }
                            utils_1.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            end();
                        }
                    });
                }
            });
        });
        $('#table').on('click', '.check', function () {
            var btn = $(this), id = btn.attr('data-id');
            pairId = id;
            if (!actionTable) {
                initActionTable();
            }
            else {
                actionTable.reload();
            }
            $('#action-modal').modal('show');
        });
        $('#action-btn').on('click', function () {
            tables_1.checkLength({
                action: '查看',
                name: '语料',
                table: dt,
                cb: function (data) {
                    pairId = data.pairId;
                    if (!actionTable) {
                        initActionTable();
                    }
                    else {
                        actionTable.reload();
                    }
                    $('#action-modal').modal('show');
                }
            });
        });
        $('#dialog-edit-btn').on('click', function () {
            var selected = $('#dialog').jstree(true).get_selected(true);
            if (selected.length > 0) {
                var d = selected[0].original;
                window.open(ctx + "/knowledge/dialog/update?id=" + d.dialog);
            }
            else {
                utils_1.alertMessage('请选择对话模型');
            }
        });
        $('#dialog-modal').on('hidden.bs.modal', function () {
            $('#dialog-question').val('');
            $('#dialog-answer').html('');
        });
        // if (!isreturn && init === false) {
        // 	init = true;
        // }
        // 合并语料
        $('#merge-btn').on('click', function () {
            tables_1.checkLength({
                action: '合并',
                name: '语料',
                table: dt,
                unique: false,
                cb: function (data) {
                    var ids = data.map(function (v) { return 'pairId=' + v.pairId; });
                    if (data.length === 1) {
                        utils_1.alertMessage('请至少选择两条或两条以上的语料合并！');
                    }
                    else {
                        sideBar.open(null, '合并语料', ctx + "/knowledge/corpusManage/update?" + ids.join('&'));
                        // changeIframeSideBar('合并语料', `${ctx}/knowledge/corpusManage/update?${ids.join('&')}`);
                    }
                }
            });
        });
    }
    // function changeIframeSideBar(text, src) {
    // 	const sideBarEl = $('#language');
    // 	sideBarEl.find('.sidebar-title').text(text);
    // 	const iframeEl = document.createElement('iframe');
    // 	iframeEl.src = src;
    // 	iframeEl.onload = function () {
    // 		if (endLoading) {
    // 			endLoading();
    // 		}
    // 	};
    // 	$('#language .sidebar-content').append($(iframeEl));
    // 	endLoading = addLoadingBg(sideBarEl.find('.sidebar-content'));
    // 	sideBar.show();
    // }
    function renderChildAnswer(rowData) {
        var pushway = renderPushway(rowData.pushway);
        var character = rowData.character.vname;
        var type = renderType(rowData.type);
        var enType = getTypeName(rowData.type);
        return "\n\t\t<p class=\"info\"><span class=\"small\">" + type + ":</span><span class=\"ellipsis a-hover\" data-type=\"" + enType + "\" data-digest=\"" + rowData.digest + "\" data-id=\"" + rowData.resourceId + "\" data-toggle=\"popover\" data-trigger=\"manual\">" + utils_1.formatText(rowData.plainText) + "</span></p>\n\t\t<p class=\"small info\"><span class=\"small-item\">\u6E20\u9053:" + pushway + "</span><span class=\"small-item\">\u89D2\u8272:" + character + "</span></p>\n\t\t";
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
    function hideAllChildRows() {
        var trs = table.table.find('.open').removeClass('open').closest('tr').toArray();
        trs.forEach(function (v) {
            var tr = $(v);
            if (table.isShownChild(tr, 'question')) {
                table.hideChildRows(tr, 'question');
            }
            else if (table.isShownChild(tr, 'plainText')) {
                table.hideChildRows(tr, 'plainText');
            }
        });
    }
    function initActionTable() {
        actionTable = new new_table_1.Table({
            el: $('#action-table'),
            options: {
                scrollY: '300px',
                scrollCollapse: true,
                ajax: {
                    url: 'knowledge/corpusManage/history',
                    dataSrc: function (data) { return data.rows; },
                    data: function (data) {
                        return new_table_1.extendsData(data, {
                            pairId: pairId
                        });
                    }
                },
                select: false,
                serverSide: true,
                paging: true,
                columns: [
                    { title: '', data: 'id', width: '12px', createdCell: createShowAction },
                    { title: '操作', data: 'content' },
                    { title: '操作时间', data: 'createTime', render: utils_1.renderSimpleTime, width: '70px' }
                ],
                initComplete: function () {
                    var dt = actionTable.dt;
                    actionTable.adjustHeader();
                    $('#action-table').on('click', '.show-action-td', function (e) {
                        var el = $(e.currentTarget), row = dt.row(el.closest('tr')), icon = el.icon();
                        switch (icon.state) {
                            case utils_1.IconState.loading:
                                return;
                            case utils_1.IconState.plus:
                                if (row.child()) {
                                    row.child.show();
                                    icon.state = utils_1.IconState.minus;
                                }
                                else {
                                    icon.state = utils_1.IconState.loading;
                                    $.ajax({
                                        url: 'knowledge/corpusManage/historyDetail',
                                        type: 'GET',
                                        data: {
                                            historyId: el.data('id')
                                        },
                                        success: function (res) {
                                            if (!res.error) {
                                                if (res.data && res.data.length > 0) {
                                                    var html_1 = '';
                                                    res.data.forEach(function (v) {
                                                        html_1 += "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"action-detial-title\">" + v.field + "</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t:\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"text-danger\">" + utils_1.formatText(v.oldValue) + "</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t=>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"text-danger\">" + utils_1.formatText(v.newValue) + "</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>";
                                                    });
                                                    row.child(html_1).show();
                                                }
                                                icon.state = utils_1.IconState.plus;
                                            }
                                            else {
                                                utils_1.alertMessage(res.msg, !res.error);
                                                icon.state = utils_1.IconState.minus;
                                            }
                                        },
                                        complete: function () {
                                            icon.state = utils_1.IconState.minus;
                                        }
                                    });
                                }
                                break;
                            case utils_1.IconState.minus:
                                row.child.hide();
                                icon.state = utils_1.IconState.plus;
                                break;
                            default:
                                break;
                        }
                        actionTable.adjustHeader();
                    });
                }
            }
        });
        // $('#action-table').DataTable(
        // 	Object.assign(
        // 		simpleConfig(),
        // 		{
        // 			ajax: {
        // 				url: 'knowledge/corpusManage/history',
        // 				dataSrc: data => data.rows,
        // 				data: () => {
        // 					return actionData;
        // 				}
        // 			},
        // 			columns: [
        // 				{ title: '', data: 'id', width: '12px', createdCell: createShowAction },
        // 				{ title: '操作', data: 'content' },
        // 				{ title: '操作时间', data: 'createTime', render: renderSimpleTime, width: VARIABLES.width.simpleTime }
        // 			],
        // 			select: false,
        // 			initComplete: ActionTableInitComplete
        // 		}));
    }
    /*function ActionTableInitComplete() {
        const dt = table.dt;
        $('#action-table').on('click', '.show-action-td', (e) => {
            const el = $(e.currentTarget),
                icon = el.icon();
            switch (icon.state) {
                case IconState.loading:
                    return;
                case IconState.plus:
                    icon.state = IconState.loading;
                    $.ajax({
                        url: 'knowledge/historyDetail/historyDetail',
                        type: 'GET',
                        data: {
                            historyId: el.data('id')
                        },
                        success: (msg) => {
                            if (!msg.error) {
                                addActionDetial(msg.data, el.parents('tr'), dt.columns().indexes().length);
                            } else {
                                alertMessage(msg.msg, !msg.error);
                            }
                        },
                        complete: () => {
                            icon.state = IconState.minus;
                        }
                    });
                    break;
                case IconState.minus:
                    break;
                default:
                    break;
            }

            clearActionTable();
        });
        $('#action-modal').on('show.bs.modal', () => {
            table.reload();
        });
    }*/
    // function addActionDetial(data, el: JQuery, len: number) {
    // 	let html = '';
    // 	data.forEach(v => {
    // 		html += `
    //             <li>
    //                 <span class="action-detial-title">${v.field}</span>
    //                 :
    //                 <span class="text-danger">${v.oldValue}</span>
    //                 =>
    //                 <span class="text-danger">${v.newValue}</span>
    //             </li>`;
    // 	});
    // 	if (html === '') {
    // 		html = '<div class="text-center">无数据</div>';
    // 	}
    // 	else {
    // 		html = '<ol>' + html + '</ol>';
    // 	}
    // 	el.after(`<tr class="action-details">
    //                 <td colspan=${len}>
    //                     ${html}
    //                 </td>
    //             </tr>`);
    // }
    // function clearActionTable() {
    // 	$('.action-details').remove();
    // 	resetIcon($('#action-table tbody .show-action-td'));
    // }
    // function showCorpus(e: JQueryEventObject, url: string, name: string) {
    // 	const el = $(e.currentTarget),
    // 		tr = el.closest('tr'),
    // 		icon = el.icon();
    // 	switch (icon.state) {
    // 		case IconState.loading:
    // 			return;
    // 		case IconState.plus:
    // 			$('#table .fa-minus-square').trigger('click');
    // 			if (table.hasChild(tr, name)) {
    // 				table.showChildRows(tr, name);
    // 				icon.state = IconState.minus;
    // 				return;
    // 			}
    // 			icon.state = IconState.loading;
    // 			$.ajax({
    // 				url: url,
    // 				type: 'GET',
    // 				data: {
    // 					pairId: el.data('id')
    // 				},
    // 				success: (res) => {
    // 					if (!res.error) {
    // 						let data;
    // 						if (res.data && res.data.length > 0) {
    // 							if (name === 'question') {
    // 								data = res.data.map(v => {
    // 									return {
    // 										question: v.literal,
    // 										classifyId: v.classify.value,
    // 										updateTime: renderSimpleTime(v.updateTime)
    // 									};
    // 								});
    // 							} else {
    // 								data = res.data.map(v => {
    // 									return {
    // 										plainText: v.digest,
    // 										// classifyId: v.classify.vname,
    // 										updateTime: renderSimpleTime(v.updateTime),
    // 										pushway: renderPushway(v.pushway),
    // 										characterId: v.character.vname
    // 									};
    // 								});
    // 							}
    // 						} else {
    // 							data = [{ _all: '无数据' }];
    // 						}
    // 						table.addChildRows(tr, data, name);
    // 					}
    // 				},
    // 				complete: () => {
    // 					icon.state = IconState.minus;
    // 				}
    // 			});
    // 			break;
    // 		case IconState.minus:
    // 			table.hideChildRows(tr, name);
    // 			icon.state = IconState.plus;
    // 			break;
    // 		default:
    // 			return;
    // 	}
    // 	// clearTable();
    // }
    // function clearTable() {
    // 	$('.cps-details').remove();
    // 	resetIcon($('#table tbody .show-corpus-td'));
    // }
    // function resetIcon(element?: JQuery) {
    // 	Array.prototype.forEach.call(element, v => {
    // 		const icon = $(v).icon();
    // 		if (icon.state === IconState.minus) {
    // 			icon.state = IconState.plus;
    // 		}
    // 	});
    // }
    // /**
    //  * 千万不要改字段名,不然就雪崩
    //  *
    //  * @param {any} data
    //  * @param {any} name
    //  * @returns
    //  */
    // function getTrs(data, name: string) {
    // 	let html = '';
    // 	const dt = table.dt,
    // 		len = dt.columns().indexes().length,
    // 		indexMap = {
    // 			question: dt.column('question:name').index(),
    // 			plainText: dt.column('plainText:name').index(),
    // 			classifyId: dt.column('classifyId:name').index(),
    // 			characterId: dt.column('characterId:name').index(),
    // 			// status: dt.column("status:name").index(),
    // 			updateTime: dt.column('updateTime:name').index(),
    // 			pushway: dt.column('pushway:name').index()
    // 		};
    // 	if (!data || data.length <= 0) {
    // 		return `
    //             <tr class="cps-details">
    //                 <td colspan="${len}" class="text-center">无数据</td>
    //             </tr>`;
    // 	}
    // 	for (let v of data) {
    // 		const d = new Array(len);
    // 		// 拿q或者a内容
    // 		const qaMap = {
    // 			question: v.literal,
    // 			plainText: v.plainText
    // 		},
    // 			// 通用部分
    // 			list = [{
    // 				name: 'classifyId',
    // 				value: v.question.classify.csfValue
    // 			},
    // 			{
    // 				name: 'characterId',
    // 				value: name === 'question' ? '' : v.character.vname
    // 			},
    // 			{
    // 				name: 'pushway',
    // 				value: name === 'question' ? '' : renderPushway(v.pushway)
    // 			},
    // 			{
    // 				name: 'updateTime',
    // 				value: renderSimpleTime(v.updateTime)
    // 			}];
    // 		html += ` <tr class="cps-details">`;
    // 		for (let l of list) {
    // 			d[indexMap[l.name]] = l.value;
    // 		}
    // 		d[indexMap[name]] = qaMap[name];
    // 		for (let h of d) {
    // 			if (!h) {
    // 				html += `<td></td>`;
    // 			}
    // 			else {
    // 				html += `<td class="force-width">${h}</td>`;
    // 			}
    // 		}
    // 		html += `</tr>`;
    // 	}
    // 	return html;
    // }
    function getTypeName(id) {
        for (var _i = 0, _a = selectData.type; _i < _a.length; _i++) {
            var v = _a[_i];
            if (id === v.id) {
                return v.enname;
            }
        }
    }
    function renderClassify(id) {
        for (var _i = 0, _a = selectData.classify; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.id === id) {
                return i.name;
            }
        }
        return '';
    }
    function renderCharacter(id) {
        for (var _i = 0, _a = selectData.character; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i.id === id) {
                return i.name;
            }
        }
        return '';
    }
    /* function renderStatus(status) {
         for (let i of selectData.status) {
             if (i.id === status) {
                 return i.name;
             }
         }
         return "";
     }*/
    function exportCorpus(name, btn) {
        // alertMessage('正在生成文件', '');
        var data = getFormData();
        var end = utils_1.loadingBtn(btn);
        $.ajax({
            url: ctx + "/knowledge/corpus/" + name,
            method: 'POST',
            data: data,
            success: function (res) {
                if (res.success) {
                    var $point1 = $('<span class="point1"></span>');
                    var $point2 = $('<span class="point2"></span>');
                    if ($('.export-main-sign .point1').length === 0) {
                        $('.export-main-sign').append($point1);
                        $('.export-sign').prepend($point2);
                    }
                    utils_1.alertMessage('任务创建成功，请至页面右上角用户名中的导出记录中查看相关文件！', true);
                }
                else {
                    utils_1.alertMessage(res.msg, res.success);
                }
            },
            complete: function () {
                end();
            }
        });
        // location.href = `${ctx}/knowledge/corpus/${name}?${$.param(data)}`;
    }
    // function cacheForm() {
    // 	if (window.sessionStorage) {
    // 		const table = $('#table').DataTable();
    // 		const order = table.order();
    // 		const data = {
    // 			keyword: $.trim($('#form-question').val()),
    // 			answerkeyword: $.trim($('#form-answer').val()),
    // 			classifys: classify.selected.join(','),
    // 			// corpusStatus: $("#select-status").val(),
    // 			character: $('#select-character').val(),
    // 			page: table.page(),
    // 			rows: table.page.len(),
    // 			beginTime: date.getDate('start'),
    // 			endTime: date.getDate('end'),
    // 			order: order[0].join(','),
    // 			pushway: $('#select-pushway').val()
    // 		};
    // 		for (let i in data) {
    // 			window.sessionStorage.setItem(i, data[i]);
    // 		}
    // 	}
    // }
    // function getCacheItem(key) {
    // 	if (window.sessionStorage && window.sessionStorage.getItem(key)) {
    // 		return window.sessionStorage.getItem(key);
    // 	}
    // 	else {
    // 		return '';
    // 	}
    // }
    // function getCacheForm() {
    // 	const list = [
    // 		'keyword',
    // 		'answerkeyword',
    // 		'classifys',
    // 		// "corpusStatus",
    // 		'character',
    // 		'page',
    // 		'rows',
    // 		'beginTime',
    // 		'endTime',
    // 		'pushway',
    // 		'order'
    // 	];
    // 	const data: any = {};
    // 	for (let v of list) {
    // 		data[v] = getCacheItem(v);
    // 	}
    // 	return cleanObject(data);
    // }
    // function renderForm() {
    // 	if (window.sessionStorage) {
    // 		if (!init && isreturn === true) {
    // 			const cacheData: any = getCacheForm();
    // 			const formList = {
    // 				keyword: '#form-question',
    // 				answerkeyword: '#form-answer',
    // 				// corpusStatus: "#select-status",
    // 				character: '#select-character',
    // 				rows: '#page-change',
    // 				pushway: '#select-pushway'
    // 			};
    // 			for (let i in formList) {
    // 				if (cacheData[i]) {
    // 					$(formList[i]).val(cacheData[i]);
    // 				}
    // 			}
    // 			if (cacheData.beginTime && cacheData.endTime) {
    // 				date.setDate(cacheData.beginTime, cacheData.endTime);
    // 			}
    // 			if (cacheData.classifys) {
    // 				const classifys = cacheData.classifys.split(',');
    // 				classify.tree.jstree(true).select_node(classifys);
    // 			}
    // 			init = true;
    // 		}
    // 	}
    // }
    // function renderShowCorpus(cellData) {
    //     return '';
    // }
    function createShowCorpus(td, cellDatA, row) {
        var el = $(td);
        if (cellDatA > 0) {
            el
                .addClass('show-corpus-td')
                .data('id', row.pairId)
                .icon();
        }
        else {
            el.addClass('disabled')
                .icon();
        }
    }
    function createShowAction(td, cell, row) {
        var el = $(td);
        if (!row.history) {
            el.empty();
        }
        else {
            el
                .addClass('show-action-td')
                .data('id', cell)
                .icon();
        }
    }
    function renderDialog(locked, type, row, meta) {
        if (!locked) {
            return '无';
        }
        return "<button type=\"button\" class=\"btn btn-xs btn-primary show-dialog\" data-id=\"" + row.pairId + "\">\u663E\u793A</button>";
    }
    // dialog tree
    function initDialogTree(data, q) {
        $('#dialog').html('<div id="dialog-tree"></div>');
        var d = [], $tree = $('#dialog-tree');
        Object.keys(data).forEach(function (v, i) {
            var rootId = "root-" + i, dialog = data[v][0].id;
            d.push({
                parent: '#',
                text: v,
                id: rootId,
                isDialog: true
            });
            for (var _i = 0, _a = data[v]; _i < _a.length; _i++) {
                var j = _a[_i];
                d.push({
                    text: j.expectWord.literal,
                    id: j.id,
                    parent: j.parent ? j.parent : rootId,
                    answer: j.content.digest,
                    question: j.expectWord.literal,
                    dialog: dialog
                });
            }
        });
        var selectedID = d.filter(function (item) { return item.question === q; })[0].id;
        $tree.jstree({
            core: {
                data: d,
                animation: 100,
                themes: {
                    icons: false
                },
                multiple: false
            },
            'conditionalselect': function (node, event) {
                if (node.id.match(/root/)) {
                    return false;
                }
                return true;
            },
            plugins: ['conditionalselect']
        });
        var tree = $tree.jstree(true);
        $tree.on('refresh.jstree', function () {
            tree.open_all();
            tree.select_node(selectedID);
        });
        $tree.on('select_node.jstree', function (e, action) {
            var _data = action.node.original;
            $('#dialog-question').val(_data.question);
            $('#dialog-answer').html(_data.answer);
        });
        tree.refresh();
    }
    function clearSession() {
        if (window.sessionStorage) {
            if (!isreturn) {
                window.sessionStorage.clear();
            }
        }
    }
    function renderPushway(id) {
        for (var _i = 0, _a = selectData.pushway; _i < _a.length; _i++) {
            var i = _a[_i];
            if (id === i.id) {
                return i.name;
            }
        }
        return '';
    }
    function getFormData() {
        return utils_1.cleanObject({
            questionkeyword: $.trim($('#form-question').val()),
            answerkeyword: $.trim($('#form-answer').val()),
            classifys: classify.selected.join(','),
            pushway: $('#select-pushway').val(),
            // corpusStatus: $("#select-status").val(),
            character: $('#select-character').val(),
            beginTime: date.getDate('start'),
            endTime: date.getDate('end')
        });
    }
    // 对于批量上传进行轮循判断
    var $upBtn = $('#batch-upload-btn');
    // isOver();
    // function isOver() {
    // 	const endBtn = loadingBtn($upBtn);
    // 	$.ajax({
    // 		url: 'knowledge/corpusManage/uploadCorpusSubmit/finish',
    // 		type: 'GET',
    // 		success: (msg) => {
    // 			if (!msg.error) {
    // 				endBtn();
    // 			} else {
    // 				setTimeout(isOver, 2000);
    // 				alertMessage(msg.msg, !msg.error, false);
    // 			}
    // 		}
    // 	});
    // }
})(KnowledgeEditbyAIndex || (KnowledgeEditbyAIndex = {}));


/***/ }),

/***/ 911:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1117]);
//# sourceMappingURL=26.js.map