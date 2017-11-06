import * as utils from 'utils';
import { Table, createAddTitle } from 'new-table';
import * as tables from 'tables';
import 'time';
import './index.less';
import CorpusUpdateSideBar from 'corpusUpdateSideBar';
import { DelayUpload } from 'upload';
let addTable;
let auditTable;
let addCurrentData;
let addSideBar;
let reviewSideBar;
let endLoading;
declare let hrefId;
declare const hrefType;
namespace SettingCsIndex {
	$(init);
	function init() {
		checkHref();
		initAddTable();
		$('#server-group-tab').one('shown.bs.tab', () => {
			initAuditTable();
		});
		$('#server-acc-tab').on('shown.bs.tab', () => {
			addTable.reload();
		});
		$('#server-group-tab').on('shown.bs.tab', () => {
			auditTable.reload();
		});
		initSideBar();
	}

	function checkHref() {
		if (hrefType === '1') {
			$('#tablist a:last').tab('show');
		}
	}

	function initSideBar() {
		addSideBar = new CorpusUpdateSideBar({
			ifReview: true,
			hideFn: () => {
				addTable.reload();
			}
		});

		reviewSideBar = new CorpusUpdateSideBar({
			ifReview: true,
			hideFn: () => {
				auditTable.reload();
			}
		});
		// sideBar = new utils.SideBar({
		// 	id: 'language',
		// 	title: '添加语料',
		// 	content: '',
		// 	onHide: () => {
		// 		$('#language').find('iframe').remove();
		// 	}
		// });
	}

	function initAuditTable() {
		auditTable = new Table({
			el: $('#audit-table'),
			options: {
				paging: true,
				serverSide: true,
				ordering: true,
				order: [6, 'desc'],
				ajax: {
					type: 'POST',
					url: 'knowledge/rehearsalAudit/list',
					dataSrc: data => { return data.rows; },
					data: (d: any) => {
						let order;
						for (let v of d.order) {
							if (v.column === 6) {
								order = v.dir;
							}
						}
						let data = {
							confuseDegreeOrder: order,
							confuseDegree: $('#audit-form .mix').val().trim(),
							operation: $('#audit-form .suggest').val().trim(),
							page: Math.floor((d.start + d.length) / d.length),
							rows: d.length,
							questionId: () => {
								if (hrefId && hrefType === '1') {
									return hrefId;
								}
								return null;
							}
						};
						return utils.cleanObject(data);
					}
				},
				initComplete: bindAuditEvent,
				columns: [
					// { data: 'rehearsalQuestionList', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowQCorpus },
					// { data: 'question', title: '问题', createdCell: createAddTitle },
					// {
					// 	data: 'answer', title: '回复', createdCell: createAddTitle, render: (arr) => {
					// 		return arr[0].content;
					// 	}
					// },
					// { data: 'status', title: '状态', render: renderStatus },
					// { data: 'classify', title: '类型', render: renderClassify },
					// { data: 'updateTime', title: '更新时间', render: utils.renderCommonTime },
					// { data: 'id', title: '操作', render: renderBtn },
					{ orderable: false, data: 'rehearsalQuestionList', title: '', width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowQCorpus },
					{ orderable: false, data: 'question', title: '问题', createdCell: createAddTitle },
					{
						orderable: false,
						data: 'answer', title: '回复', createdCell: (cell, cellData) => {
							$(cell).attr('title', cellData[0].content);
						}, render: (arr) => {
							return arr[0].content;
						}
					},
					{ orderable: false, data: 'confuseQuestion', title: '混淆问题', createdCell: createAddTitle },
					{ orderable: false, data: 'confuseAnswer', title: '混淆回复', createdCell: createAddTitle },
					{ data: 'confuseDegree', title: '混淆度', render: renderPercent },
					{ orderable: false, data: 'classify', title: '类型', render: renderClassify },
					{ orderable: false, data: 'confuseDegree', title: '操作建议', render: renderSuggest },
					{ orderable: false, data: 'id', title: '操作', className: 'prevent', width: '162', render: renderAuditBtn }
				]
			},
			checkbox: {
				data: ''
			}
		});
	}

	function renderPercent(num) {
		if (num === null) {
			return '';
		}
		return num + '%';
	}
	function renderSuggest(num) {
		if (num === null) {
			return '';
		}
		if (num <= 50) {
			return '审核通过';
		}
		if (num > 50 && num < 70) {
			return '无建议';
		}
		if (num > 70 && num < 90) {
			return '合并/编辑/删除';
		}
		if (num >= 90) {
			return '合并通过';
		}
		return '';
	}

	function bindAuditEvent() {
		if (hrefId && hrefType === '1') {
			hrefId = null;
		}
		const dt = auditTable.dt;
		const formEl = $('#audit-form');
		// $('#language').on('auditSave', function () {
		// 	sideBar.hide();
		// 	// $('#iframe-modal').modal('hide');
		// 	auditTable.reload();
		// });
		formEl.find('.reply-search').on('click', function () {
			auditTable.reload(true);
		});
		formEl.find('.reply-reset').on('click', function () {
			formEl.find('.mix').val('0');
			formEl.find('.suggest').val('0');
		});
		formEl.find('.reply-audit').on('click', function () {
			const selected = auditTable.selected;
			if (!selected.length) {
				utils.alertMessage('请先选择一条复述句', false);
				return;
			}
			const ids = selected.map((v) => {
				return v.questionId;
			});
			utils.confirmModal({
				msg: '确认批量审核选中的复述句吗?',
				text: '审核通过',
				className: 'btn-success',
				cb: (modal: JQuery, delSubmitBtn: JQuery) => {
					const endloading = utils.loadingBtn(delSubmitBtn);
					$.ajax({
						type: 'POST',
						url: 'knowledge/rehearsalAudit/auditPass',
						data: {
							ids: ids.join(',')
						}
					}).done((msg) => {
						if (!msg.error) {
							utils.alertMessage(msg.msg, !msg.error);
							modal.modal('hide');
							auditTable.reload();
						} else {
							utils.alertMessage(msg.msg, !msg.error);
						}
					}).always(() => {
						endloading();
					});
				}
			});
		});
		formEl.find('.reply-delete').on('click', function () {
			const selected = auditTable.selected;
			if (!selected.length) {
				utils.alertMessage('请先选择一条复述句', false);
				return;
			}
			const ids = selected.map((v) => {
				return v.questionId;
			});
			utils.confirmModal({
				msg: '确认批量删除选中的复述句吗?',
				cb: (modal: JQuery, delSubmitBtn: JQuery) => {
					const endloading = utils.loadingBtn(delSubmitBtn);
					$.ajax({
						type: 'POST',
						url: 'knowledge/rehearsalAudit/batchDelete',
						data: {
							ids: ids.join(',')
						}
					}).done((msg) => {
						if (!msg.error) {
							utils.alertMessage(msg.msg, !msg.error);
							modal.modal('hide');
							auditTable.reload();
						} else {
							utils.alertMessage(msg.msg, !msg.error);
						}
					}).always(() => {
						endloading();
					});
				}
			});
		});
		formEl.on('click', '.reply-output', () => {
			utils.alertMessage('正在生成文件', 'success');
			const data = utils.cleanObject({
				confuseDegree: $('#audit-form .mix').val().trim(),
				operation: $('#audit-form .suggest').val().trim()
			});
			let str = '';
			for (let i in data) {
				str += '&' + i + '=' + encodeURI(data[i]);
			}
			if (str !== '') {
				str = '?' + str.slice(1);
			}
			location.href = `${ctx}/knowledge/rehearsalAudit/exportExcel${name}${str}`;
		});
		dt.on('click', '.show-corpus-td.show-q-corpus', (e) => {
			const el = $(e.target).closest('td');
			const data = auditTable.dt.row(el).data();
			showAuditedCorpus(el, data);
		});
		dt.on('click', '.fa-check-square-o', function () {
			const id = $(this).data().id;
			$.ajax({
				type: 'POST',
				url: 'knowledge/rehearsalAudit/auditPass',
				data: {
					ids: id
				}
			}).done((msg) => {
				if (!msg.error) {
					utils.alertMessage(msg.msg, !msg.error);
					auditTable.reload();
				} else {
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
		dt.on('click', '.fa-check', function () {
			const id = $(this).data().id;
			$.ajax({
				type: 'POST',
				url: 'knowledge/rehearsalAudit/mergePass',
				data: {
					id: id
				}
			}).done((msg) => {
				if (!msg.error) {
					utils.alertMessage(msg.msg, !msg.error);
					auditTable.reload();
				} else {
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
		dt.on('click', '.fa-edit', function () {
			const id = $(this).data().id;
			reviewSideBar.open(id, '编辑语料');
			// changeIframeSideBar('audit', '编辑语料', `knowledge/corpusManage/update?type=review&pairId=${id}`);
			// const sideBarEl = $('#language');
			// sideBarEl.attr('data-type', 'audit').find('iframe').attr('src', `knowledge/corpusManage/update?type=review&pairId=${id}`);
			// sideBarEl.find('.sidebar-title').text('编辑语料');
			// sideBar.show();
			// $('#iframe-modal').modal('show');
		});
		// $('#iframe-modal').on('hide.bs.modal', () => {
		// 	$('#iframe-modal').find('iframe').attr('src', 'knowledge/corpusManage/update');
		// });
		dt.on('click', '.fa-trash', function () {
			const id = $(this).data().id;
			utils.confirmModal({
				msg: '确认删除选中的复述句吗?',
				cb: (modal: JQuery, delSubmitBtn: JQuery) => {
					const endloading = utils.loadingBtn(delSubmitBtn);
					$.ajax({
						type: 'POST',
						url: 'knowledge/rehearsalAudit/delete',
						data: {
							id: id
						}
					}).done((msg) => {
						if (!msg.error) {
							utils.alertMessage(msg.msg, !msg.error);
							modal.modal('hide');
							auditTable.reload();
						} else {
							utils.alertMessage(msg.msg, !msg.error);
						}
					}).always(() => {
						endloading();
					});
				}
			});
		});
	}

	function renderAuditBtn(id, status, rowData) {
		let merge = rowData.confuseQuestion ? `<i title="合并通过" data-id="${rowData.questionId}" class="add-icon cloud-fa-icon fa fa-check"></i>` : '';
		return `
			<i title="审核通过" data-id="${rowData.questionId}" class="cloud-fa-icon fa fa-check-square-o"></i>
			${merge}
			<i title="编辑" data-id="${id}" class="cloud-fa-icon fa fa-edit"></i>
			<i title="删除" data-id="${rowData.questionId}" class="cloud-fa-icon fa fa-trash"></i>
		`;
	}

	// function changeIframeSideBar(type, text, src) {
	// 	const sideBarEl = $('#language');
	// 	sideBarEl.attr('data-type', type);
	// 	sideBarEl.find('.sidebar-title').text(text);
	// 	const iframeEl = document.createElement('iframe');
	// 	iframeEl.src = src;
	// 	iframeEl.onload = function () {
	// 		if (endLoading) {
	// 			endLoading();
	// 		}
	// 	};
	// 	$('#language .sidebar-content').append($(iframeEl));
	// 	endLoading = utils.addLoadingBg(sideBarEl.find('.sidebar-content'));
	// 	sideBar.show();
	// }

	function initAddTable() {
		addTable = new Table({
			el: $('#add-table'),
			options: {
				paging: true,
				serverSide: true,
				ajax: {
					type: 'POST',
					url: 'knowledge/rehearsalReview/list',
					dataSrc: data => data.rows,
					data: (d: any) => {
						let data = {
							question: $('#add-form .question').val().trim(),
							answer: $('#add-form .reply').val().trim(),
							status: $('#add-form .status').val().trim(),
							page: Math.floor((d.start + d.length) / d.length),
							rows: d.length,
							questionId: () => {
								if (hrefId && hrefType === '0') {
									return hrefId;
								}
								return null;
							}
						};
						return utils.cleanObject(data);
					}
				},
				// data: [{
				// 	word: 1,
				// 	createTime: 2,
				// 	updateTime: 3
				// }],
				initComplete: bindAddEvent,
				columns: [
					{ data: 'rehearsalQuestionList', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowQCorpus },
					{ data: 'question', title: '问题', createdCell: createAddTitle },
					{
						data: 'answer', title: '回复', createdCell: (cell, cellData) => {
							$(cell).attr('title', cellData[0].content);
						}, render: (arr) => {
							return arr[0].content;
						}
					},
					{ data: 'status', title: '状态', render: renderStatus },
					{ data: 'classify', title: '类型', render: renderClassify },
					{ data: 'updateTime', title: '更新时间', render: utils.renderCommonTime },
					{ data: 'id', title: '操作', className: 'prevent', render: renderBtn }
				]
			},
			checkbox: {
				data: ''
			}
		});
	}
	function renderStatus(status) {
		if (status === 0) {
			return '未提交';
		} else {
			return '待审核';
		}
	}
	function renderBtn(id, status, rowData) {
		const auditIcon = rowData.status === 0 ? `<i title="提交审核" data-id="${id}" class="cloud-fa-icon fa fa-external-link"></i>` : '';
		return `
			${auditIcon}
			<i title="添加相似问法" data-id="${id}" class="add-icon cloud-fa-icon fa fa-plus-square"></i>
			<i title="编辑" data-id="${id}" class="cloud-fa-icon fa fa-edit"></i>
			<i title="删除" data-id="${rowData.questionId}" class="cloud-fa-icon fa fa-trash"></i>
		`;
	}
	function renderClassify(id) {
		for (let i of selectData.classify) {
			if (i.id === id) {
				return i.name;
			}
		}
		return '';
	}

	function createShowQCorpus(td: HTMLElement, cellDatA: number, rowData) {
		const el = $(td);
		if ((cellDatA as any).length) {
			el.addClass('show-corpus-td')
				.data('id', rowData.id)
				.icon();
		}
		else {
			el.addClass('disabled')
				.icon();
		}
	}
	function bindAddEvent() {
		if (hrefId && hrefType === '0') {
			hrefId = null;
		}
		const formEl = $('#add-form');
		const dt = addTable.dt;
		const modalEl = $('#add-modal');
		const delBtn = $('#delete-submit-btn');
		const uploadBtn = $('#upload-submit-btn');
		const upload = new DelayUpload({
			accept: '.xls,xlsx',
			name: 'file',
			url: 'knowledge/rehearsalReview/uploadExcel',
			saveBtn: $('#upload-wrap'),
			submitBtn: uploadBtn,
			save: (id, name) => {
				$('#info-wrap').show();
				$('#info-name').text(name);
			},
			success: (msg) => {
				if (!msg.error) {
					utils.alertMessage(msg.msg, msg.code, false);
					addTable.reload();
					$('#upload').modal('hide');
					$('#info-wrap').hide();
					$('#info-name').text('');
				}
			},
			cancel: () => {
				$('#info-wrap').hide();
				$('#info-name').text('');
			}
		});
		// $('#language').on('addSave', function () {
		// 	sideBar.hide();
		// 	// $('#iframe-modal').modal('hide');
		// 	addTable.reload();
		// });
		$('#upload').on('hide.bs.modal', () => {
			upload.cancel();
		});
		formEl.find('.reply-search').on('click', function () {
			addTable.reload(true);
		});
		formEl.find('.reply-batch-upload').on('click', () => {
			$('#upload').modal('show');
		});
		formEl.find('.reply-add').on('click', () => {
			addSideBar.open(null, '添加语料');
			// changeIframeSideBar('add', '添加语料', 'knowledge/corpusManage/update?type=review');
			// sideBar.show();
			// $('#language').attr('data-type', 'add').find('.sidebar-title').text('添加语料');
			// $('#iframe-modal').attr('data-type', 'add').modal('show');
		});
		formEl.find('.reply-audit').on('click', function () {
			const selected = addTable.selected;
			if (!selected.length) {
				utils.alertMessage('请先选择一条复述句', false);
				return;
			}
			const ids = selected.map((v) => {
				return v.id;
			});
			utils.confirmModal({
				msg: '确认批量审核选中的复述句吗?',
				text: '确定',
				className: 'btn-success',
				cb: (modal: JQuery, delSubmitBtn: JQuery) => {
					const endloading = utils.loadingBtn(delSubmitBtn);
					$.ajax({
						type: 'POST',
						url: 'knowledge/rehearsalReview/toMoreVerify',
						data: {
							ids: ids.join(',')
						}
					}).done((msg) => {
						if (!msg.error) {
							utils.alertMessage(msg.msg, !msg.error);
							modal.modal('hide');
							addTable.reload();
						} else {
							utils.alertMessage(msg.msg, !msg.error);
						}
					}).always(() => {
						endloading();
					});
				}
			});
		});

		formEl.on('click', '.reply-output', () => {
			utils.alertMessage('正在生成文件', 'success');
			const data = utils.cleanObject({
				question: $('#add-form .question').val().trim(),
				answer: $('#add-form .reply').val().trim(),
				status: $('#add-form .status').val().trim()
			});
			let str = '';
			for (let i in data) {
				str += '&' + i + '=' + encodeURI(data[i]);
			}
			if (str !== '') {
				str = '?' + str.slice(1);
			}
			location.href = `${ctx}/knowledge/rehearsalReview/exportExcel${name}${str}`;
		});

		formEl.find('.reply-delete').on('click', function () {
			const selected = addTable.selected;
			if (!selected.length) {
				utils.alertMessage('请先选择一条复述句', false);
				return;
			}
			const ids = selected.map((v) => {
				return v.questionId;
			});
			utils.confirmModal({
				msg: '确认批量删除选中的复述句吗?',
				cb: (modal: JQuery, delSubmitBtn: JQuery) => {
					const endloading = utils.loadingBtn(delSubmitBtn);
					$.ajax({
						type: 'POST',
						url: 'knowledge/rehearsalReview/deleteAllQuestion',
						data: {
							questionIds: ids.join(',')
						}
					}).done((msg) => {
						if (!msg.error) {
							utils.alertMessage(msg.msg, !msg.error);
							modal.modal('hide');
							addTable.reload();
						} else {
							utils.alertMessage(msg.msg, !msg.error);
						}
					}).always(() => {
						endloading();
					});
				}
			});
		});
		dt.on('click', '.fa-external-link', function () {
			const id = $(this).data().id;
			$.ajax({
				type: 'POST',
				url: 'knowledge/rehearsalReview/toVerify',
				data: {
					id
				}
			}).done((msg) => {
				if (!msg.error) {
					utils.alertMessage(msg.msg, !msg.error);
					addTable.reload();
				} else {
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
		dt.on('click', '.fa-edit', function () {
			// debugger;
			const id = $(this).data().id;
			addSideBar.open(id, '编辑语料');
			// changeIframeSideBar('add', '编辑语料', `knowledge/corpusManage/update?type=review&pairId=${id}`);
			// const sideBarEl = $('#language');
			// sideBarEl.attr('data-type', 'add').find('iframe').attr('src', `knowledge/corpusManage/update?type=review&pairId=${id}`);
			// sideBarEl.find('.sidebar-title').text('编辑语料');
			// sideBar.show();
			// $('#iframe-modal').find('iframe').attr('data-type', 'add').attr('src', `knowledge/corpusManage/update?type=review&pairId=${id}`);
			// $('#iframe-modal').modal('show');
		});
		// $('#iframe-modal').on('hide.bs.modal', () => {
		// 	$('#iframe-modal').find('iframe').attr('src', 'knowledge/corpusManage/update?type=review');
		// });
		dt.on('click', '.fa-trash', function () {
			const id = $(this).data().id;
			utils.confirmModal({
				msg: '确认删除选中的复述句吗?',
				cb: (modal: JQuery, delSubmitBtn: JQuery) => {
					const endloading = utils.loadingBtn(delSubmitBtn);
					$.ajax({
						type: 'POST',
						url: 'knowledge/rehearsalReview/deleteQuestion',
						data: {
							questionId: id
						}
					}).done((msg) => {
						if (!msg.error) {
							utils.alertMessage(msg.msg, !msg.error);
							modal.modal('hide');
							addTable.reload();
						} else {
							utils.alertMessage(msg.msg, !msg.error);
						}
					}).always(() => {
						endloading();
					});
				}
			});
		});
		dt.on('click', '.show-corpus-td.show-q-corpus', (e) => {
			const el = $(e.target).closest('td');
			const data = addTable.dt.row(el).data();
			showQCorpus(el, data);
		});
		dt.on('click', '.add-icon', function () {
			modalEl.modal('show');
			addCurrentData = addTable.dt.row($(this).closest('td')).data();
			modalEl.find('.standard').val(addCurrentData.question);
			for (let v of addCurrentData.rehearsalQuestionList) {
				addRepeatQuestion(v.content);
			}
		});
		modalEl.find('.add-repeat').on('click', function () {
			if (!vadilate(modalEl.find('.repeat'))) {
				return;
			}
			const masterQuestion = modalEl.find('.standard').val().trim();
			const slaveQuestion = modalEl.find('.repeat').val().trim();
			// addRepeatQuestion(modalEl.find('.repeat').val().trim());
			$.ajax({
				type: 'POST',
				url: 'knowledge/rehearsalReview/isSimilarity',
				data: {
					masterQuestion,
					slaveQuestion
				}
			}).done((msg) => {
				if (!msg.error) {
					addRepeatQuestion(slaveQuestion);
					modalEl.find('.repeat').val('');
				}
				utils.alertMessage(msg.msg, !msg.error);

			});
		});
		modalEl.on('click', '.add-edit', function () {
			$(this).siblings('input').prop('readonly', false).focus();
		});
		modalEl.on('keypress', '.more-repeat', function (e) {
			if (e.keyCode !== 13) {
				return;
			}
			if (!vadilate($(this))) {
				$(this).focus();
				return;
			}
			const masterQuestion = modalEl.find('.standard').val().trim();
			const slaveQuestion = $(this).val().trim();
			$.ajax({
				type: 'POST',
				url: 'knowledge/rehearsalReview/isSimilarity',
				data: {
					masterQuestion,
					slaveQuestion
				}
			}).done((msg) => {
				if (!msg.error) {
					utils.alertMessage(msg.msg, !msg.error);
					$(this).prop('readonly', true);
				} else {
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
		modalEl.on('blur', '.more-repeat', function () {
			if (!vadilate($(this))) {
				$(this).focus();
				return;
			}
			const masterQuestion = modalEl.find('.standard').val().trim();
			const slaveQuestion = $(this).val().trim();
			$.ajax({
				type: 'POST',
				url: 'knowledge/rehearsalReview/isSimilarity',
				data: {
					masterQuestion,
					slaveQuestion
				}
			}).done((msg) => {
				if (!msg.error) {
					utils.alertMessage(msg.msg, !msg.error);
					$(this).prop('readonly', true);
				} else {
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
		modalEl.on('click', '.add-delete', function () {
			$(this).closest('.form-group').remove();
		});
		modalEl.on('hide.bs.modal', () => {
			modalEl.find('.more-repeat').each((i, e) => {
				$(e).closest('.form-group').remove();
			});
			modalEl.find('.repeat').val('');
		});
		modalEl.find('#add-save').on('click', function () {
			let flag = false;
			modalEl.find('.more-repeat').each((i, e) => {
				if (e === document.activeElement) {
					flag = true;
				}
			});
			if (flag) {
				return;
			}
			const childQuestionList = [];
			modalEl.find('.more-repeat').each((i, e) => {
				childQuestionList.push({
					content: $(e).val().trim()
				});
			});
			const endloading = utils.loadingBtn($(this));
			$.ajax({
				type: 'POST',
				url: 'knowledge/rehearsalReview/updateQuestion',
				contentType: 'application/json',
				data: JSON.stringify({
					childQuestionList,
					questionId: addCurrentData.questionId,
					question: addCurrentData.question
				})
			}).done((msg) => {
				if (!msg.error) {
					utils.alertMessage(msg.msg, !msg.error);
					endloading();
					addTable.reload();
					modalEl.modal('hide');
				} else {
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
	}
	function vadilate(el) {
		const modalEl = $('#add-modal');
		const masterQuestion = modalEl.find('.standard').val().trim();
		const slaveQuestion = el.val().trim();
		let flag = false;
		if (masterQuestion === slaveQuestion) {
			utils.alertMessage('标准问法不能与复述问法相同');
			return false;
		}
		el.closest('.form-group').siblings().each((i, e) => {
			if ($(e).find('input').is(el)) {
				return;
			}
			if ($(e).find('input').is('.repeat')) {
				return;
			}
			if ($(e).find('input').val().trim() === slaveQuestion) {
				flag = true;
				utils.alertMessage('复述问法不能重复');
				return;
			}
		});
		if (flag) {
			return false;
		}
		if (slaveQuestion === '') {
			utils.alertMessage('复述问法不能为空');
			return false;
		}
		return true;
	}
	function addRepeatQuestion(slaveQuestion) {
		$('#add-modal .form-horizontal').append(`
			<div class="form-group"><label class="cloud-input-title"></label><div class="cloud-input-content"><input value="${slaveQuestion}" readonly class="more-repeat form-control input-sm" type="text"><i class="cloud-fa-icon fa fa-edit add-edit"></i><i class="cloud-fa-icon fa fa-trash add-delete"></i></div></div>
		`);
	}
	function showAuditedCorpus(el, data) {
		const icon = el.icon();
		const id = data.id;
		if (icon.state === utils.IconState.plus) {
			for (let v of data.rehearsalQuestionList) {
				const tr = $(`<tr class="cps-details">
						<td></td>
						<td></td>
						<td>${v.content}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>
							<i title="合并通过" data-id="${v.id}" class="add-icon cloud-fa-icon fa fa-check"></i>
							<i title="编辑" data-id="${id}" class="cloud-fa-icon fa fa-edit"></i>
							<i title="删除" data-id="${v.id}" class="cloud-fa-icon fa fa-trash"></i>
						</td>
                	</tr>`);
				el.closest('tr').after(tr);
			}
			icon.state = utils.IconState.minus;
			return;
		}
		$('.cps-details').remove();
		icon.state = utils.IconState.plus;
	}
	function showQCorpus(el, data) {
		const icon = el.icon();
		const id = data.id;
		if (icon.state === utils.IconState.plus) {
			for (let v of data.rehearsalQuestionList) {
				const tr = $(`<tr class="cps-details">
						<td></td>
						<td></td>
						<td>${v.content}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>
							<i title="编辑" data-id="${id}" class="cloud-fa-icon fa fa-edit"></i>
							<i title="删除" data-id="${v.id}" class="cloud-fa-icon fa fa-trash"></i>
						</td>
                	</tr>`);
				el.closest('tr').after(tr);
			}
			icon.state = utils.IconState.minus;
			return;
		}
		$('.cps-details').remove();
		icon.state = utils.IconState.plus;
	}
}
