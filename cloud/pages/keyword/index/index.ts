import { alertMessage, loadingBtn, renderCommonTime, cleanObject, bindEnter } from 'utils';
import * as tables from 'new-table';
import * as ntables from 'tables';
import * as utils from 'utils';
import { getPage, commonConfig, bindPageChange, delBtnClick, VARIABLES, Table } from 'tables';
import 'time';
import './index.less';
import { DelayUpload } from 'upload';
const param = {
	path: 'keyword',
	listParam: 'keyword',
	wordName: '关键词',
	addParam: 'word',
	delType: 'POST'
};
let table, side, gainTable, gainTableEl, gainTableD, innerSaveFlag = false;
namespace KnowledgeKeyword {
	$(init);
	function init() {
		initTable();
		initSider();
		initGainTable();
		bindEvents();
	}

	function initTable() {
		const tname = param.wordName;
		table = new tables.Table({
			el: $('#key-table'),
			options: {
				serverSide: true,
				paging: true,
				ajax: {
					type: 'POST',
					url: param.path + '/list',
					dataSrc: data => { return data.rows; },
					data: (d: any) => {
						let data = {
							page: getPage(d),
							rows: d.length,
							source: $('#source').val()
						};
						data[param.listParam] = $('#keyword').val();
						return cleanObject(data);
					}
				},
				columns: [
					{ data: 'word', title: tname },
					{ data: 'createTime', title: '创建时间', render: utils.renderCommonTime, width: (ntables as any).VARIABLES.width.commonTime },
					{ data: 'updateTime', title: '修改时间', render: utils.renderCommonTime, width: (ntables as any).VARIABLES.width.commonTime }
				],
				initComplete: initComplete
			}
		});
	}
	function initComplete() {
		const tableD = $('#key-table').DataTable();
		ntables.bindPageChange(tableD);
		const name = param.wordName;
		delBtnClick({
			table: tableD,
			url: param.path + '/delete',
			name: name,
			type: param.delType,
			el: $('#del-btn')
		});

		const uploadBtn = $('#upload-submit-btn');
		const upload = new DelayUpload({
			accept: '.xls,xlsx',
			url: param.path + '/batchupload',
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
			upload.cancel();
		});

		$('#batch-upload-btn').on('click', () => {
			$('#upload').modal('show');
		});

		$('#add-btn').on('click', () => {
			$('#add-modal').modal('show');
			$('#add-word').val('');
		});

		$('#add-modal').on('shown.bs.modal', () => {
			$('#add-word').focus();
		});

		$('#add-submit').on('click', () => {
			const val = $.trim($('#add-word').val());
			if (val === '') {
				alertMessage(`${name}不能为空`);
			} else {
				const loading = loadingBtn($('#add-submit'));
				let data = {};
				data[param.addParam] = $('#add-word').val();
				$.ajax({
					type: 'POST',
					url: param.path + '/add',
					data: data,
					success: (msg) => {
						if (!msg.error) {
							$('#add-modal').modal('hide');
							table.reload();
						}
						alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						loading();
					}
				});
			}
		});

		$('#edit-btn').on('click', () => {
			const data = tableD.rows({ selected: true }).data();
			if (data.length < 1) {
				alertMessage(`请选择要编辑的${name}`);
			}
			else if (data.length > 1) {
				alertMessage(`只能编辑一个${name}`);
			}
			else {
				const currentData = data[0];
				$('#edit-modal').modal('show');
				$('#edit-modal-content').html(
					`<div class='form-group'>
						<label>原${name}</label>
						<p class='form-control-static' title='${currentData.word}'>${currentData.word}</p>
					</div>
					<div class='form-group'>
						<label>修改为</label>
						<input type='text' class='form-control' data-id='${currentData.id}' value='${currentData.word}' data-old='${currentData.word}' maxlength='50'>
					</div>`);
				$('#edit-modal-content input:first').select();
			}
		});

		$('#edit-submit').on('click', () => {
			if (!innerSaveFlag) {
				let data = [];
				Array.prototype.forEach.call($('#edit-modal-content input'), v => {
					const el = $(v),
						val = $.trim(el.val());
					if (val === el.attr('data-old')) {
						return;
					}
					data.push({
						id: el.data('id'),
						name: val
					});
				});
				if (data.length < 1) {
					alertMessage(`未修改${name}或所有${name}为空`);
				}
				else if (data[0].name.length > 255) {
					alertMessage(`${name}长度不能超过255个字符`);
					return;
				}
				else {
					const loading = loadingBtn($('#edit-submit'));
					$.ajax({
						url: param.path + '/update',
						type: 'POST',
						data: JSON.stringify({ 'data': data }),
						dataType: 'json',
						contentType: 'application/json; charset=utf-8',
						success: (msg) => {
							if (!msg.error) {
								$('#edit-modal').modal('hide');
								table.reload();
							}
							alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							loading();
						}
					});
				}
			}
		});

		$('#search-btn').on('click', () => {
			table.reload();
		});


		bindEnter($('#keyword'), () => {
			table.reload();
		});

		bindEnter($('#edit-modal'), () => {
			$('#edit-submit').click();
		}, 'input');

		bindEnter($('#add-modal'), () => {
			$('#add-submit').click();
		}, 'input');


		bindPageChange(tableD, $('#page-change'));
	}
	let $gainKey;
	let $import;
	let $importAll;
	let $clearBtn;
	let $btns = [];
	let $oBtns = [];
	function initSider() {
		side = new utils.SideBar({
			id: 'gain',
			title: '自动获取关键词',
			content: `<div>
						<div class='form-group'>
							<button class='btn btn-primary btn-sm' type='button' disabled='true' id='gainKey'>获取关键词</button>
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
			url: param.path + '/isSynonymGenDone',
			method: 'POST',
			success: (msg) => {
				thisMsg = msg;
				if (msg.code === '200') {
					isThisError = true;
					if (msg.data) {
						$('#import').css('display', 'inline-block');
						$('#importAll').css('display', 'inline-block');
					}
					reopenAll();
					// $('#gainKey').prop('disabled', null);
					gainTable.reload();
					if (notifyMsg) {
						notifyMsg.remove();
					}
					utils.alertMessage(msg.msg, !msg.error);
				} else if (msg.code === '201') {
					isThisError = true;
					reopenAll();
					// $('#gainKey').prop('disabled', null);
					gainTable.reload();
					if (notifyMsg) {
						notifyMsg.remove();
					}
				} else if (msg.code === '500') {
					isThisError = true;
					forbidAll();
					// $('#gainKey').prop('disabled', true);
					if (notifyMsg) {
						notifyMsg.remove();
					}
					utils.alertMessage(msg.msg, !msg.error);
				} else if (msg.code === '501') {
					isThisError = true;
					// $('#gainKey').prop('disabled', true);
					forbidAll();
					// 之前的不是501 就弹出
					if (beforeMsg.code !== '501') {
						notifyMsg = utils.alertMessage(thisMsg.msg, '', false);
					}
					setTimeout(isGenDone, 5000);
				}
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
					type: 'POST',
					url: param.path + '/getImpList',
					dataSrc: data => { gainTableLength = data.rows.length; return data.rows; },
					data: (d: any) => {
						return cleanObject({
							page: getPage(d),
							rows: d.length
						});
					}
				},
				columns: [
					{ data: 'keyword', title: '关键词' },
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
		gainTableD = gainTableEl.DataTable();
	}

	function renderSt(d) {
		if (d === 0) {
			return '等待导入';
		} else {
			return '已导入';
		}
	}
	function renderAction(d, type, row) {
		return `<div title='编辑' style='cursor:pointer' data-id='${row.id}' data-keyword='${row.keyword}'><img src='${ctx}/images/materialIcon/editIconD.png' width='20px' height='auto' class='gain-edit'/></div>`;
	}
	function gainInitComplete() {
		$gainKey = $('#gainKey');
		$import = $('#import');
		$importAll = $('#importAll');
		$clearBtn = $('#clearBtn');
		$oBtns = [$import, $gainKey, $importAll, $clearBtn];
		$btns = [$gainKey, $importAll, $clearBtn];
		bindGainKeyWords();
		bindChangeDisabled();
		bindImport();
		bindAllImport();
		bindClear();
		bindEdit();
		bindEditSave();
		$('#edit-modal').on('hide.bs.modal', () => {
			innerSaveFlag = false;
		});
	}

	// 全部导入
	function bindAllImport() {
		$importAll.on('click', function () {
			// const endImA = loadingBtn($(this));
			forbidAll();
			$.ajax({
				url: param.path + '/impAllKeyword',
				success: (msg) => {
					// endImA();
					reopenAll();
					gainTable.reload();
					table.reload();
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
	}
	// 从后端获取关键词
	function bindGainKeyWords() {
		$gainKey.on('click', function () {
			forbidAll();
			// const endLoading = utils.loadingBtn($(this));
			$.ajax({
				url: param.path + '/generateKeywordInvoke',
				method: 'GET',
				success: (msg) => {
					if (msg.code === '200') {
						const isBeforeError = isThisError;
						if (isBeforeError) {
							gainTable.reload(true, () => {
								isGenDone();
							});
						}
					}
				},
				complete: () => {
					reopenAll();
					// endLoading();
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
	function bindImport() {
		$import.on('click', function () {
			// gain selected rows
			// const endImport = loadingBtn($(this));
			forbidAll();
			const selectedRows = gainTable.selected;
			let ids = [];
			selectedRows.forEach(v => {
				ids.push(v.id);
			});
			$.ajax({
				url: param.path + '/impKeyword',
				method: 'POST',
				data: {
					ids: ids.join(',')
				},
				success: (msg) => {
					if (msg.code === '200') {
						gainTable.reload();
						table.reload();
					}
					reopenAll();
					// endImport();
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
		});
	}
	function bindClear() {
		$clearBtn.on('click', function () {
			// const endCBtn = utils.loadingBtn($(this));
			forbidAll();
			// 清空页面
			$.ajax({
				url: param.path + '/clearImpList',
				method: 'POST',
				success: (msg) => {
					if (msg.code === '200') {
						gainTable.reload();
					}
					utils.alertMessage(msg.msg, !msg.error);

				},
				complete: () => {
					// endCBtn();
					reopenAll();
				}
			});
		});
	}
	// 点击表格编辑功能
	function bindEdit() {
		gainTableEl.on('click', '.gain-edit', function () {
			innerSaveFlag = true;
			const id = $(this).parent('div').data('id');
			const keyword = $(this).parent('div').data('keyword');
			$('#edit-modal').modal('show');
			$('#edit-modal-content').html(
				`<div class='form-group'>
					<label>原关键词</label>
					<p class='form-control-static' title='${keyword}'>${keyword}</p>
				</div>
				<div class='form-group'>
					<label>修改为</label>
					<input type='text' class='form-control' data-id='${id}' value='${keyword}' data-old='${keyword}' maxlength='50'/>
				</div>`);
			$('#edit-modal-content input:first').select();
		});

	}
	// 点击编辑保存功能
	function bindEditSave() {
		$('#edit-submit').on('click', () => {
			if (innerSaveFlag) {
				const root = $('#edit-modal-content input');
				const newWord = $.trim(root.val());
				const nid = root.data('id');
				$.ajax({
					url: param.path + '/modKeywordImp',
					method: 'POST',
					data: {
						id: nid,
						keyword: newWord
					},
					success: (msg) => {
						if (msg.code === '200') {
							gainTable.reload();
							$('#edit-modal').modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					}
				});
			}
		});
	}
}



