import {
	bindEnter, alertMessage, loadingBtn, endLoadingBtn, cleanObject, CommonDate, bindInput, confirmModal, renderCommonTime, SideBar
} from 'utils';
import * as tables from 'new-table';
import * as ntables from 'tables';
import 'daterangepicker';
import 'script-loader!bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js';
import 'bootstrap-tagsinput/dist/bootstrap-tagsinput.less';
import './index.less';

import { DelayUpload } from 'upload';
namespace SynonymsIndex {
	let table, state, t, side, tableD, gainTable, gainTableEl, gainTableD, innerSaveFlag = false;

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
					dataSrc: data => { return data.rows; },
					data: (d: any) => {
						const time = $('#form-date').val().split(' - '),
							data = {
								page: Math.floor((d.start + d.length) / d.length),
								rows: d.length,
								beginTime: time[0],
								endTime: time[1],
								keyword: $.trim($('#keywrods').val()),
								source: $('#source').val()
							};
						return cleanObject(data);
					}
				},
				columns: [
					{ data: 'representative', title: '同义词组代表词' },
					{ data: 'synonyms', title: '同文词组' },
					{ data: 'tsp', title: '更新时间', width: (ntables as any).VARIABLES.width.commonTime, render: renderCommonTime }
				],
				initComplete: () => {
					tableD = $('#key-table').DataTable();
					upload();
					const input = $('#keywrods');
					initTags();
					initAddWords();
					initDelWords();
					initEditWords();
					initSubmit();
					bindEnter(input, () => {
						table.reload();
					});
					$('#search-btn').on('click', function () {
						table.reload();
					});
					$('#page-change').on('change', (e) => {
						tableD.page.len($('#page-change').val()).draw(false);
					});
				}
			}
		});
	}
	let $gainKey;
	let $import;


	let $importAll;
	let $clearBtn;
	let $btns = [];
	let $oBtns = [];
	function initSider() {
		side = new SideBar({
			id: 'gain',
			title: '自动获取同义词',
			content: `<div>
						<div class='form-group'>
							<button class='btn btn-primary btn-sm' type='button'  disabled='true'id='gainKey'>获取同义词</button>
							<button class='btn btn-primary btn-sm' type='button' disabled='true' id='import' style='display:none'>确认导入</button>
							<button class='btn btn-primary btn-sm' type='button' id='importAll' style='display:none'>全部导入</button>
							<button class='btn btn-danger btn-sm' type='button' id='clearBtn'>清空列表</button>
						</div>
						<table class='table fixed-table' id='gain-table'></table>
					</div>`,
			onShow: () => {
				isGenDone();
				if (gainTableLength) {
					$('#import').css('display', 'inline-block');
					$('#importAll').css('display', 'inline-block');
				}
				gainTableD.rows().select();
			}/* ,
			onHide: () => {
				table.reload();
			} */
		});
	}
	// sider中一个在进程中，其他都不能使用
	function forbidAll() {
		$oBtns.forEach(v => {
			v.prop('disabled', 'true');
		});
	}
	function reopenAll() {
		$btns.forEach(v => {
			v.prop('disabled', null);
		});
	}
	let isThisError = false;
	let thisMsg: any = {
		msg: '',
		code: '000',
		error: false
	};
	let notifyMsg;

	// 判断轮循有没有结束
	function isGenDone() {
		const beforeMsg = thisMsg;
		$.ajax({
			url: 'knowledge/synonyms/isSynonymGenDone',
			method: 'POST',
			success: (msg) => {
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
					alertMessage(msg.msg, !msg.error);
				} else if (msg.code === '201') {
					isThisError = true;
					// $gainKey.prop('disabled',null);
					reopenAll();
					gainTable.reload();
					if (notifyMsg) {
						notifyMsg.remove();
					}
				} else if (msg.code === '500') {
					isThisError = true;
					// $gainKey.prop('disabled', true);
					forbidAll();
					if (notifyMsg) {
						notifyMsg.remove();
					}
					alertMessage(msg.msg, !msg.error);
				} else if (msg.code === '501') {
					isThisError = true;
					// $gainKey.prop('disabled', true);
					forbidAll();
					// 之前的不是501 就弹出
					if (beforeMsg.code !== '501') {
						notifyMsg = alertMessage(thisMsg.msg, '', false);
					}
					setTimeout(isGenDone, 5000);
				}
			}
		});
	}

	function initDate() {
		new CommonDate({
			el: $('#form-date')
		});
	}
	function upload() {
		const uploadBtn = $('#upload-submit-btn');
		const uploader = new DelayUpload({
			accept: '.xls,xlsx',
			url: 'knowledge/synonyms/batchupload',
			name: 'uploadedFile',
			saveBtn: $('#upload-wrap'),
			submitBtn: uploadBtn,
			save: (id, fileName) => {
				$('#info-wrap').show();
				$('#info-name').text(fileName);
			},
			success: (msg) => {
				if (!msg.error) {
					alertMessage(msg.msg, msg.code, false);
					$('#upload').modal('hide');
					table.reload();
					$('#info-wrap').hide();
					$('#info-name').text('');
				}
			},
			cancel: () => {
				$('#info-wrap').hide();
				$('#info-name').text('');
			}
		});
		$('#upload').on('hide.bs.modal', () => {
			uploader.cancel();
		});
		$('#batch-upload-btn').on('click', () => {
			$('#upload').modal('show');
		});
	}
	function initTags() {
		const tag: any = $('#input-tag');
		const input = $('#input-title');
		let lastTitle: string;
		tag.tagsinput();
		tag.on('beforeItemRemove', (e) => {
			const val = $.trim(input.val());
			if (e.item === val) {
				input.val('');
			}
		});
		bindEnter(input, () => {
			$('.bootstrap-tagsinput input').focus();
		});

		bindInput(input, 'input change', (val) => {
			const value = val;
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
		const btn = $('#submit-btn');
		const tag: any = $('#input-tag');
		let bool;
		btn.on('click', function () {
			if (!innerSaveFlag) {
				const value = $.trim($('#input-title').val());
				const tagVal = tag.val();
				if (!state) {
					alertMessage('未知错误!');
				}
				else if (!value) {
					alertMessage('请输入同义词代表词!');
				}
				else if (tag.tagsinput('items').length <= 1) {
					alertMessage('请至少输入一个同义词!');
				}
				else if (tagVal.replace(/,/g, '').length > 200) {
					alertMessage('同义词组长度不能超过200!');
				}
				else {
					const id = tag.attr('data-id'),
						data: any = {
							representative: value,
							synonyms: tagVal
						};
					let url;
					if (id) {
						data.id = id;
						url = 'knowledge/synonyms/update';
						bool = false;
					}
					else {
						url = 'knowledge/synonyms/add';
						bool = true;
					}
					loadingBtn(btn);
					$.ajax({
						url: url,
						type: 'POST',
						data: data,
						success: (msg) => {
							alertMessage(msg.msg, msg.code);
							if (!msg.error) {
								$('#add-modal').modal('hide');
								// table.draw();
								// t.refresh(bool);
								table.reload();
							}
						},
						complete: () => {
							endLoadingBtn(btn);
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
		let tag = $('#input-tag');
		tag.attr({ 'data-id': '', 'data-value': '' });
	}
	function initEditWords() {
		let tag: any = $('#input-tag');
		$('#edit-btn').on('click', function () {
			let select = $('.selected', '#key-table');
			if (select.length > 1) {
				alertMessage('只能编辑一个同义词!');
			}
			else if (select.length < 1) {
				alertMessage('请选择要编辑的同义词!');
			}
			else {
				let data = tableD.row(select).data();
				let synonyms = data.synonyms.split(',');
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
		$('#gain-btn').on('click', () => {
			side.show();
		});
	}
	let gainTableLength;
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
					dataSrc: data => { gainTableLength = data.rows.length; return data.rows; },
					data: (d: any) => {
						return cleanObject({
							page: ntables.getPage(d),
							rows: d.length
						});
					}
				},
				columns: [
					{ data: 'representative', title: '同义词组代表词' },
					{ data: 'synonyms', title: '同义词组' },
					{ data: 'tsp', title: '提取时间', render: (ntables as any).renderCommonTime, width: (ntables as any).VARIABLES.width.commonTime },
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
		} else {
			return '已导入';
		}
	}
	function renderAction(d, type, row) {
		return `<div title='编辑' style='cursor:pointer' data-id='${row.id}' data-representative='${row.representative}' data-synonyms='${row.synonyms}'><img src='${ctx}/images/materialIcon/editIconD.png' width='20px' height='auto' class='gain-edit'/></div>`;
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
		$('#add-modal').on('hide.bs.modal', () => {
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
				success: (msg) => {
					if (msg.code === '200') {
						const isBeforeError = isThisError;
						if (isBeforeError) {
							gainTable.reload(true, () => {
								isGenDone();
							});
						}
					} else {
						alertMessage(msg.msg, !msg.error);
					}
				},
				complete: () => {
					// endLoading();
					// $gainKey.prop('disabled', null);
					reopenAll();
				}
			});
		});
	}
	function bindChangeDisabled() {
		gainTableD.on('select.dt', () => {
			if (gainTable.selected.length > 0) {
				$import.prop('disabled', null);
			}
		});
		gainTableD.on('deselect.dt', () => {
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
				success: (msg) => {
					// endImA();
					// $(this).prop('disabled',true);
					reopenAll();
					gainTable.reload();
					table.reload();
					alertMessage(msg.msg, !msg.error);
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
			const selectedRows = gainTable.selected;
			let ids = [];
			selectedRows.forEach(v => {
				ids.push(v.id);
			});
			$.ajax({
				url: 'knowledge/synonyms/impSynonyms',
				method: 'POST',
				data: {
					ids: ids.join(',')
				},
				success: (msg) => {
					if (msg.code === '200') {
						gainTable.reload();
						table.reload();
					}
					// endImport();
					// $(this).prop('disabled',true);
					reopenAll();
					alertMessage(msg.msg, !msg.error);
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
				success: (msg) => {
					if (msg.code === '200') {
						gainTable.reload();
					}
					alertMessage(msg.msg, !msg.error);
				},
				complete: () => {
					// endCBtn();
					// $(this).prop('disabled',null);
					reopenAll();
				}
			});
		});
	}
	// 点击表格编辑功能
	function bindEdit() {
		let tag: any = $('#input-tag');
		gainTableEl.on('click', '.gain-edit', function () {
			innerSaveFlag = true;
			const dataEl = $(this).parent('div');
			const sid = dataEl.data('id');
			const ssynonyms = dataEl.data('synonyms').split(',');
			const srepresentative = dataEl.data('representative');
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
		$('#submit-btn').on('click', () => {
			const tag: any = $('#input-tag');
			const id = tag.attr('data-id');
			const value = $.trim($('#input-title').val());
			const tagVal = tag.val();
			if (innerSaveFlag) {
				const root = $('#edit-modal-content input');
				const newWord = $.trim(root.val());
				const nid = root.data('id');
				$.ajax({
					url: 'knowledge/synonyms/modSynonymsImp',
					method: 'POST',
					data: {
						id: id,
						representative: value,
						synonyms: tagVal
					},
					success: (msg) => {
						if (msg.code === '200') {
							gainTable.reload();
							$('#add-modal').modal('hide');
						}
						alertMessage(msg.msg, !msg.error);
					}
				});
			}
		});
	}
}
