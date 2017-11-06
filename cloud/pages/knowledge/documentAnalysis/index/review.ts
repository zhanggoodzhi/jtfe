import * as utils from 'utils';
import * as tables from 'tables';
declare const selectData;
let preDate;
let auditedDate;
let preTable;
let auditedTable;
let preSideBar;
let auditedSideBar;
let preCurrentData;
let auditedCurrentData;

let editDoc: string;
let editCroups;
let editType: string;
// 公用的编辑侧栏
let editSidebar: utils.SideBar;

const symbols = ['.', ',', '?', '|', '[', ']', '^', '$', '\\', '-', '+', '*', '{', '}', '(', ')']
	.map(v => new RegExp('\\' + v), 'ig');

$(() => {
	initEditSideBar();
});

export function initPreAudited() {
	initPreSideBar();
	initPreAuditedDate();
	initPreAuditedTable();
}

export function initAudited() {
	initAuditedSideBar();
	initAuditedDate();
	initAuditedTable();
}

function initEditSideBar() {
	editSidebar = new utils.SideBar({
		id: 'edit-sidebar',
		title: '编辑',
		content: `
        <div class="row edit-sidebar-content">
            <div class="col-sm-6">
                <form class="flex-form row prop-form">
                <div class="form-group col-sm-6">
                    <label>类型</label>
                    <div id="edit-sidebar-classify" class="form-control input-sm"/>
                </div>
                <div class="form-group col-sm-6">
                    <label>角色</label>
                    <select type="text" id="edit-sidebar-character" class="form-control input-sm">
                    ${selectData.character.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group col-sm-6">
                    <label>渠道</label>
                    <select type="text" id="edit-sidebar-pushway" class="form-control input-sm">
                    ${selectData.pushway.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group col-sm-6">
                    <label>有效期</label>
                    <input type="text" id="edit-sidebar-time" class="form-control input-sm"/>
                </div>
                </form>
                <form id="corpus-form" class="corpus-form">

                </form>
                <div class="text-center edit-sidebar-btn">
                    <button id="save-edit-btn" type="button" class="btn btn-primary">保存</button>
                    <button id="save-check-edit-btn" type="button" class="btn btn-primary">保存并审核</button>
                    <button id="cancel-edit-btn" type="button" class="btn btn-primary">返回</button>
                </div>
            </div>
            <div class="col-sm-6 edit-doc-content" id="edit-doc-content"></div>
        </div>
        `
	});

	const corpusForm = $('#corpus-form'),
		docContent = $('#edit-doc-content');

	const classify = new utils.Tree({
		el: $('#edit-sidebar-classify'),
		data: utils.formatClassify(selectData.classify)
	});

	$('#cancel-edit-btn').on('click', () => {
		editSidebar.hide();
	});

	$('#edit-sidebar-time').daterangepicker({
		locale: utils.DATERANGEPICKERLOCALE,
		startDate: moment(),
		endDate: moment().add(5, 'years')
	});


	corpusForm.on('click', ('.add-q'), (e) => {
		const input = $(e.currentTarget).closest('.question-action').prev(),
			group = input.parent('.form-group'),
			repeat = input.parent().prev('.repeat-wrap'),
			val = input.val().trim();
		// exisit = repeat.find('input').toArray().map(v => $(v).val().trim());

		input.focus();

		if (val === '' || group.hasClass('has-error') || group.data('loading')) {
			return;
		}

		// if (exisit.indexOf(val) > -1) {
		// 	utils.alertMessage('请不要添加重复的复述问法');
		// 	return;
		// }

		repeat.append(renderRemoveInput(val));

		input.val('');
	});

	corpusForm.on('click', '.remove-icon', (e) => {
		$(e.currentTarget).parent().remove();
	});


	corpusForm.on('click', '.edit-question,.edit-answer', (e) => {
		const el = $(e.currentTarget),
			val = el.data('text');

		if (val !== '') {
			const wrap = $('#edit-doc-content ');
			if (!el.hasClass('selected')) {
				corpusForm.find('.selected').removeClass('selected');
				el.addClass('selected');
			}
			renderDocContent(val);
			const strong = wrap.find('strong:first');
			if (strong.length > 0) {
				wrap.animate({ scrollTop: strong.get(0).offsetTop });
			}
		}
	});


	docContent.on('mouseup', (e) => {
		const text = getIt(),
			selected = corpusForm.find('.selected');
		if (selected.length > 0 && text) {
			selected
				.data('text', text)
				.html(text).trigger('click');
		}
	});


	corpusForm.on('input', '.add-input-question', utils.debounce((e) => {
		const input = $(e.currentTarget),
			group = input.parent('.form-group'),
			info = group.find('.add-question-info'),
			val = input.val().trim(),
			exist = corpusForm.find('.repeat-wrap input').toArray().map(v => $(v).val().trim());

		if (exist.indexOf(val) > -1) {
			group.addClass('has-error');
			info.html('复述问法已存在!').show();
			return;
		}

		const clear = () => {
			group.removeClass('has-error');
			info.empty().hide();
			group.data('loading', false);
		};

		if (!editCroups || editCroups.length <= 0) {
			return;
		}
		if (val !== '') {
			group.data('loading', true);
			$.ajax('knowledge/documentAnalysis/documentCorpus/hasSame', {
				abortOnRetry: true,
				data: {
					questionLiteral: val,
					documentId: editCroups[0].documentId
				}
			})
				.done(res => {
					if (res.data) {
						group.addClass('has-error');
						info.html('复述问法已存在!').show();
					} else {
						clear();
					}

				});
		} else {
			clear();
		}
	}, 200));

	$('#save-edit-btn').on('click', (e) => {
		const group = $('#corpus-form .question-wrap');
		if (group.hasClass('has-error') || group.data('loading')) {
			return;
		}
		const end = utils.loadingBtn($(e.currentTarget));
		saveEdit((xhr) => {
			end();
		});
	});

	$('#save-check-edit-btn').on('click', (e) => {
		const group = $('#corpus-form .question-wrap');
		if (group.hasClass('has-error') || group.data('loading')) {
			return;
		}
		const end = utils.loadingBtn($(e.currentTarget));
		saveEdit((xhr) => {
			if (xhr.error) {
				end();
				return;
			}
			$.ajax({
				url: 'knowledge/documentAnalysis/documentCorpus/verify',
				method: 'GET',
				data: {
					pairIds: editCroups.map(v => v.pairId).join(',')
				},
				success: (msg) => {
					if (!msg.error) {
						if (preTable) {
							preTable.refresh();
						}
						if (auditedTable) {
							auditedTable.refresh();
						}
						editSidebar.hide();
					}
					utils.alertMessage(msg.msg, !msg.error);
				},
				complete: () => {
					end();
				}
			});
		});

	});

	function saveEdit(cb?) {
		// const els = editSidebar.elements;
		const time = $('#edit-sidebar-time').val().split(' - '),
			data = {
				classifyId: classify.selected[0],
				characterId: $('#edit-sidebar-character').val(),
				pushway: $('#edit-sidebar-pushway').val(),
				beginTime: time[0],
				endTime: time[1]
			},
			corpus = Array.prototype.map.call(corpusForm.find('.form-block'), (v, i) => {
				const el = $(v),
					qs = el.find('.repeat-wrap input').toArray().map(input => $(input).val()),
					q = el.find('.question-wrap input').val().trim();
				if (q !== '' && qs.indexOf(q) < 0) {
					qs.push(q);
				}

				const d = {
					...data,
					digest: el.find('.edit-answer').html(),
					literal: el.find('.edit-question').html(),
					sunQuestions: qs.map(val => {
						return {
							questionId: null,
							questionLiteral: val
						};
					})
				};

				return Object.assign({}, editCroups[i], d);
			});


		$.ajax('knowledge/documentAnalysis/documentCorpus/update', {
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(corpus)
		})
			.done(res => {
				if (!res.error) {
					editSidebar.hide();
					if (preTable) {
						preTable.refresh();
					}

					if (auditedTable) {
						auditedTable.refresh();
					}
				}
				utils.alertMessage(res.msg, !res.error);
			})
			.always(cb);
	}
}


function renderRemoveInput(val: string) {
	return `<div class="remove-input">
            <input class="form-control input-sm" type="text" readonly value="${val}">
            <span class="remove-icon"></span>
        </div>
        `;
}


function fillEditSidebar(cb?) {
	if (editCroups.length < 0) {
		return;
	}
	$.ajax('knowledge/attach/viewDoc', {
		data: {
			attachId: editCroups[0].documentId
		}
	})
		.done(res => {
			let html = '';
			editDoc = res.replace(/\s+/g, '');
			renderDocContent();
			editCroups.forEach(v => {
				html += `
                        <hr/>
                        <div class="form-block">
                            <div class="form-group">
                            <label>问题</label>
                            <div class="form-control input-sm edit-question">${v.literal}</div>
                            </div>
                            <div class="form-group">
                            <label>复述问法</label>
                            <div class="repeat-wrap">
                                ${v.sunQuestions.map(q => renderRemoveInput(q.questionLiteral)).join('')}
                            </div>
                            <div class="question-wrap form-group">
                                <input class="form-control input-sm add-input-question"/>
                                <div class="question-action"><i class="fa fa-plus add-q"></i></div>
								<p class="add-question-info"></p>
                            </div>
                            </div>
                            <div class="form-group">
                            <label>回复</label>
                            <div class="form-control input-sm edit-answer">${v.digest}</div>
                            </div>
                        </div>`;
			});
			$('#corpus-form').html(html);
			editSidebar.show();
			const saveCheckBtn = $('#save-check-edit-btn');
			switch (editType) {
				case 'preBatch':
					saveCheckBtn.show();
					break;
				case 'auditedBatch':
					saveCheckBtn.hide();
					break;
				default:
					return;
			}
		});

}

function renderDocContent(keyword?: string) {
	let doc = editDoc;

	if (keyword) {
		// symbols.forEach(v => {
		// 	keyword = keyword.replace(v, symbol => {
		// 		console.log(symbol, '\\' + symbol);
		// 		return '\\' + symbol;
		// 	});
		// });


		doc = doc.replace(keyword, k => `<strong>${k}</strong>`);
	}

	$('#edit-doc-content').html(doc);
}

function initPreSideBar() {
	preSideBar = new utils.SideBar({
		id: 'pre-sideBar',
		title: '查看详情',
		content: `
            <form id="pre-detail-form" class="disabled-form">
            <div class="cloud-row">
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">问题</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="question">问题</p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">回复</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="answer"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">文档标题</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="title"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">类型</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="type"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">角色</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="role"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">渠道</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="method"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">更新时间</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="update-time"></p>
                </div>
                </div>
            </div>
            <div class="btn-wrap">
                <button type="button" class="pass btn btn-primary btn-sm">审核通过</button>
                <button type="button" class="edit btn btn-primary btn-sm">编辑</button>
                <button type="button" class="del btn btn-danger btn-sm">删除</button>
            </div>
            </form>
        `
	});
}
function initAuditedSideBar() {
	auditedSideBar = new utils.SideBar({
		id: 'audited-sideBar',
		title: '语料详情',
		content: `
            <form id="pre-detail-form" class="disabled-form">
            <div class="cloud-row">
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">问题</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="question">问题</p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">回复</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="answer"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">文档标题</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="title"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">类型</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="type"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">角色</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="role"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">渠道</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="method"></p>
                </div>
                </div>
                <div class="form-group clearfix">
                <label class="control-label col-md-2 col-sm-2 col-lg-2">更新时间</label>
                <div class="col-md-10 col-sm-10 col-lg-10">
                    <p class="update-time"></p>
                </div>
                </div>
            </div>
            <div class="btn-wrap">
                <button type="button" class="edit btn btn-primary btn-sm">编辑</button>
                <button type="button" class="del btn btn-danger btn-sm">删除</button>
            </div>
            </form>
                    `
	});
}
function initPreAuditedDate() {
	preDate = new utils.CommonDate({
		el: $('#pre-form-date')
	});
}

function initAuditedDate() {
	auditedDate = new utils.CommonDate({
		el: $('#audited-form-date')
	});
}

function bindPreAuditedEvent() {
	const tableEl = $('#pre-table');
	const preSideBarEl = $('#pre-sideBar');
	$('#pre-audit-tab').on('click', function () {
		if (preTable) {
			preTable.refresh();
		}
	});
	$('#pre-search-btn').on('click', function () {
		preTable.refresh(true);
	});
	$('#pre-reset-btn').on('click', function () {
		$('#pre-q').val('');
		$('#pre-a').val('');
		$('#pre-doc').val('');
		preDate.resetDate();
	});
	tables.bindCheckBoxEvent(tableEl);
	utils.bindEnter($('#pre-audit-search-form input'), () => {
		preTable.refresh(true);
	});
	$('#pre-batch-audit-btn').on('click', function () {
		const dataArr = tables.getCheckboxRowsData(tableEl);
		if (dataArr.length <= 0) {
			utils.alertMessage('请选择要审核的语料');
			return;
		}
		utils.confirmModal({
			msg: `确认批量审核选中的语料吗?`,
			text: '审核',
			className: 'btn-primary',
			cb: (modal, btn) => {
				const endLoading = utils.loadingBtn(btn);
				const pairIdsArr = dataArr.map((v) => {
					return v.pairId;
				});
				$.ajax({
					url: 'knowledge/documentAnalysis/documentCorpus/verify',
					method: 'GET',
					data: {
						pairIds: pairIdsArr.join(',')
					},
					success: (msg) => {
						if (!msg.error) {
							preTable.refresh();
							modal.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});

	});
	$('#pre-batch-edit-btn').on('click', function () {
		const dataArr = tables.getCheckboxRowsData(tableEl);
		if (dataArr.length === 0) {
			utils.alertMessage('请先选择语料');
			return;
		}
		const docId = dataArr[0].documentId;
		for (let v of dataArr) {
			if (v.documentId !== docId) {
				utils.alertMessage('批量编辑只能选择属于同一个文档的语料');
				return;
			}
		}
		editCroups = dataArr;
		editType = 'preBatch';
		fillEditSidebar();
	});
	$('#pre-batch-del-btn').on('click', function () {
		const dataArr = tables.getCheckboxRowsData(tableEl);
		if (dataArr.length === 0) {
			utils.alertMessage('请先选择语料');
			return;
		}
		const questionIdsArr = dataArr.map((v) => {
			return v.questionId;
		});
		utils.confirmModal({
			msg: `确认删除选中的语料吗?`,
			cb: (modal, btn) => {
				const endLoading = utils.loadingBtn(btn);
				$.ajax({
					url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
					type: 'POST',
					data: {
						questionIds: questionIdsArr.join(',')
					},
					success: (msg) => {
						if (!msg.error) {
							preTable.refresh();
							modal.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	});
	tableEl.on('click', '.delete', function () {
		utils.confirmModal({
			msg: `确认删除该语料吗?`,
			cb: (modal, btn) => {
				const data = preTable.table.row($(this).closest('tr')).data();
				const endLoading = utils.loadingBtn(btn);
				$.ajax({
					url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
					type: 'POST',
					data: {
						questionIds: data.questionId
					},
					success: (msg) => {
						if (!msg.error) {
							preTable.refresh();
							modal.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	});
	tableEl.on('click', '.view-detail', function () {
		const data = preTable.table.row($(this).closest('tr')).data();
		preCurrentData = data;
		const sideBarEl = $('#pre-sideBar');
		sideBarEl.find('p.question').text(data.literal);
		sideBarEl.find('p.answer').text(data.digest);
		sideBarEl.find('p.title').text(data.documentTitle);
		sideBarEl.find('p.type').text(renderClassify(data.classifyId));
		sideBarEl.find('p.role').text(renderCharacter(data.characterId));
		sideBarEl.find('p.method').text(renderPushWay(data.pushway));
		sideBarEl.find('p.update-time').text(utils.renderCommonTime(data.updateTime));
		preSideBar.show();
	});
	tableEl.on('click', '.pass', function () {
		const id = preTable.table.row($(this).closest('tr')).data().pairId;
		$.ajax({
			url: 'knowledge/documentAnalysis/documentCorpus/verify',
			method: 'GET',
			data: {
				pairIds: id
			},
			success: (msg) => {
				if (!msg.error) {
					preTable.refresh();
				}
				utils.alertMessage(msg.msg, !msg.error);
			}
		});
	});
	tableEl.on('click', '.edit', function () {
		editCroups = [preTable.table.row($(this).closest('tr')).data()];
		// editCroups[0].documentId = '6263182249974300672';
		editType = 'preBatch';
		fillEditSidebar();
	});
	// pre-sidebar事件
	preSideBarEl.on('click', '.pass', function () {
		$.ajax({
			url: 'knowledge/documentAnalysis/documentCorpus/verify',
			method: 'GET',
			data: {
				pairIds: preCurrentData.pairId
			},
			success: (msg) => {
				if (!msg.error) {
					preSideBar.hide();
					preTable.refresh();
				}
				utils.alertMessage(msg.msg, !msg.error);
			}
		});
	});
	preSideBarEl.on('click', '.edit', function (e) {
		editCroups = [preCurrentData];
		preSideBar.hide();
		editType = 'preBatch';
		fillEditSidebar();
	});
	preSideBarEl.on('click', '.del', function () {
		utils.confirmModal({
			msg: `确认删除该语料吗?`,
			cb: (modal, btn) => {
				const endLoading = utils.loadingBtn(btn);
				$.ajax({
					url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
					type: 'POST',
					data: {
						questionIds: preCurrentData.questionId
					},
					success: (msg) => {
						if (!msg.error) {
							if (preTable) {
								preTable.refresh();
							}

							if (auditedTable) {
								auditedTable.refresh();
							}
							modal.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	});
}


function bindAuditedEvent() {
	const tableEl = $('#audited-table');
	const auditedSideBarEl = $('#audited-sideBar');
	$('#audited-tab').on('click', function () {
		if (auditedTable) {
			auditedTable.refresh();
		}
	});

	$('#audited-search-btn').on('click', function () {
		auditedTable.refresh(true);
	});

	$('#audited-reset-btn').on('click', function () {
		$('#audited-q').val('');
		$('#audited-a').val('');
		$('#audited-doc').val('');
		auditedDate.resetDate();
	});

	tables.bindCheckBoxEvent(tableEl);

	utils.bindEnter($('#audited-search-form input'), () => {
		auditedTable.refresh(true);
	});

	$('#audited-batch-edit-btn').on('click', function () {
		const dataArr = tables.getCheckboxRowsData(tableEl);
		if (dataArr.length === 0) {
			utils.alertMessage('请先选择语料');
			return;
		}
		const docId = dataArr[0].documentId;
		for (let v of dataArr) {
			if (docId !== v.documentId) {
				utils.alertMessage('批量编辑只能选择属于同一个文档的语料');
				return;
			}
		}
		editCroups = dataArr;
		editType = 'auditedBatch';
		fillEditSidebar();
	});
	$('#audited-export-btn').on('click', function () {
		const time = $('#audited-form-date').val().split(' - ');
		window.location.href = `knowledge/documentAnalysis/documentCorpus/exportExcel?${$.param(utils.cleanObject({
			questionKeyword: $('#audited-q').val().trim(),
			answerKeyword: $('#audited-a').val().trim(),
			documentKeyword: $('#audited-doc').val().trim(),
			beginTime: time[0],
			endTime: time[1]
		}))}`;
	});

	$('#audited-batch-del-btn').on('click', function () {
		const dataArr = tables.getCheckboxRowsData(tableEl);

		if (dataArr.length <= 0) {
			utils.alertMessage('请选择要删除的语料');
			return;
		}
		const questionIdsArr = dataArr.map((v) => {
			return v.questionId;
		});
		utils.confirmModal({
			msg: `确认删除选中的语料吗?`,
			cb: (modal, btn) => {
				const endLoading = utils.loadingBtn(btn);
				$.ajax({
					url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
					type: 'POST',
					data: {
						questionIds: questionIdsArr.join(',')
					},
					success: (msg) => {
						if (!msg.error) {
							auditedTable.refresh();
							modal.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	});

	tableEl.on('click', '.view-detail', function () {
		const data = auditedTable.table.row($(this).closest('tr')).data();
		auditedCurrentData = data;
		const sideBarEl = $('#audited-sideBar');
		sideBarEl.find('p.question').text(data.literal);
		sideBarEl.find('p.answer').text(data.digest);
		sideBarEl.find('p.title').text(data.documentTitle);
		sideBarEl.find('p.type').text(renderClassify(data.classifyId));
		sideBarEl.find('p.role').text(renderCharacter(data.characterId));
		sideBarEl.find('p.method').text(renderPushWay(data.pushway));
		sideBarEl.find('p.update-time').text(utils.renderCommonTime(data.updateTime));
		auditedSideBar.show();
	});

	tableEl.on('click', '.edit', function (e) {
		editCroups = [auditedTable.table.row($(e.currentTarget).closest('tr')).data()];
		editType = 'auditedBatch';
		fillEditSidebar();
	});

	tableEl.on('click', '.delete', function () {
		utils.confirmModal({
			msg: `确认删除该语料吗?`,
			cb: (modal, btn) => {
				const data = auditedTable.table.row($(this).closest('tr')).data();
				const endLoading = utils.loadingBtn(btn);
				$.ajax({
					url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
					type: 'POST',
					data: {
						questionIds: data.questionId
					},
					success: (msg) => {
						if (!msg.error) {
							auditedTable.refresh();
							modal.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	});
	// audited-sidebar事件
	auditedSideBarEl.on('click', '.edit', function () {
		editCroups = [auditedCurrentData];
		auditedSideBar.hide();
		editType = 'auditedBatch';
		fillEditSidebar();
	});

	auditedSideBarEl.on('click', '.del', function () {
		utils.confirmModal({
			msg: `确认删除该语料吗?`,
			cb: (modal, btn) => {
				const endLoading = utils.loadingBtn(btn);
				$.ajax({
					url: 'knowledge/documentAnalysis/documentCorpus/deleteByQuestionIds',
					type: 'POST',
					data: {
						questionIds: auditedCurrentData.questionId
					},
					success: (msg) => {
						if (!msg.error) {
							auditedSideBar.hide();
							auditedTable.refresh();
							modal.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	});
}
function initPreAuditedTable() {
	const tableEl = $('#pre-table');
	tableEl.DataTable(
		Object.assign(
			tables.commonConfig(),
			{
				// data: [
				//     { attachName: '文档1', filesize: '10k', hasGenerate: '已生成', uploadTime: '2017-03-01', id: 1 },
				//     { attachName: '文档2', filesize: '20k', hasGenerate: '未生成', uploadTime: '2017-03-10', id: 2 },
				//     { attachName: '文档3', filesize: '30k', hasGenerate: '已生成', uploadTime: '2017-04-01', id: 3 },
				//     { attachName: '文档4', filesize: '40k', hasGenerate: '未生成', uploadTime: '2016-11-01', id: 4 }
				// ],
				// serverSide: false,
				scrollY: tables.getTabsTableHeight($('#pre-audit-search-form')),
				select: false,
				ajax: {
					type: 'POST',
					url: 'knowledge/documentAnalysis/unverifyDocumentCorpus/list',
					dataSrc: data => { return data.rows; },
					data: (d: any) => {
						const time = $('#pre-form-date').val().split(' - '),
							data = {
								questionKeyword: $('#pre-q').val().trim(),
								answerKeyword: $('#pre-a').val().trim(),
								documentKeyword: $('#pre-doc').val().trim(),
								beginTime: time[0],
								endTime: time[1],
								keyword: $.trim($('#keywrods').val()),
								page: Math.floor((d.start + d.length) / d.length),
								rows: d.length
							};
						return utils.cleanObject(data);
					}
				},
				columns: [
					tables.getCheckboxColumnObj('answerId'),
					{ data: 'literal', title: '问题', createdCell: tables.createAddTitle },
					{ data: 'digest', title: '回复', createdCell: tables.createAddTitle },
					{ data: 'documentTitle', title: '文档' },
					{ data: 'classifyId', title: '类型', render: renderClassify },
					{ data: 'updateTime', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
					{ data: 'answerId', title: '操作', render: renderPreIcons }
				],
				initComplete: () => {
					const t = tableEl.DataTable();
					preTable = new tables.Table(t);
					bindPreAuditedEvent();
				}
			}));
}
function renderClassify(id) {
	for (let i of selectData.classify) {
		if (i.id === id) {
			return i.name;
		}
	}
	return '';
}
function renderPushWay(id) {
	for (let i of selectData.pushway) {
		if (i.id === id) {
			return i.name;
		}
	}
	return '';
}
function renderCharacter(id) {
	for (let i of selectData.character) {
		if (i.id === id) {
			return i.name;
		}
	}
	return '';
}
function renderPreIcons(id) {
	return `
    <i class="fa cloud-fa-icon fa-check-square-o pass" title="审核通过"></i>
    <i class="fa cloud-fa-icon fa-edit edit" title="编辑"></i>
    <i class="fa cloud-fa-icon fa-eye view-detail" title="查看"></i>
    <i class="fa cloud-fa-icon fa-trash delete" title="删除"></i>
    `;
}
function renderAuditedIcons(id) {
	return `
    <i class="fa cloud-fa-icon fa-edit edit" title="编辑"></i>
    <i class="fa cloud-fa-icon fa-eye view-detail" title="查看"></i>
    <i class="fa cloud-fa-icon fa-trash delete" title="删除"></i>
    `;
}
function initAuditedTable() {
	const tableEl = $('#audited-table');
	tableEl.DataTable(
		Object.assign(
			tables.commonConfig(),
			{
				// data: [
				//     { attachName: '文档1', filesize: '10k', hasGenerate: '已生成', uploadTime: '2017-03-01', id: 1 },
				//     { attachName: '文档2', filesize: '20k', hasGenerate: '未生成', uploadTime: '2017-03-10', id: 2 },
				//     { attachName: '文档3', filesize: '30k', hasGenerate: '已生成', uploadTime: '2017-04-01', id: 3 },
				//     { attachName: '文档4', filesize: '40k', hasGenerate: '未生成', uploadTime: '2016-11-01', id: 4 }
				// ],
				// serverSide: false,
				scrollY: tables.getTabsTableHeight($('#audited-search-form')),
				select: false,
				ajax: {
					type: 'POST',
					url: 'knowledge/documentAnalysis/verifiedDocumentCorpus/list',
					dataSrc: data => { return data.rows; },
					data: (d: any) => {
						const time = $('#audited-form-date').val().split(' - '),
							data = {
								questionKeyword: $('#audited-q').val().trim(),
								answerKeyword: $('#audited-a').val().trim(),
								documentKeyword: $('#audited-doc').val().trim(),
								beginTime: time[0],
								endTime: time[1],
								page: Math.floor((d.start + d.length) / d.length),
								rows: d.length
							};
						return utils.cleanObject(data);
					}
				},
				initComplete: () => {
					const t = tableEl.DataTable();
					auditedTable = new tables.Table(t);
					bindAuditedEvent();
				},
				columns: [
					tables.getCheckboxColumnObj('answerId'),
					{ data: 'literal', title: '问题' },
					{ data: 'digest', title: '回复' },
					{ data: 'documentTitle', title: '文档' },
					{ data: 'classifyId', title: '类型', render: renderClassify },
					{ data: 'updateTime', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
					{ data: 'answerId', title: '操作', render: renderAuditedIcons }
				]
			}));
}

function getIt() {
	if (window.getSelection) {
		return window.getSelection().toString();
	}
	else if (document.getSelection) {
		return document.getSelection().toString();
	}
	else {
		const selection = (document as any).selection && (document as any).selection.createRange();
		return selection.text;
	}
}
