import './index.less';
import { alertMessage, loadingBtn, endLoadingBtn, cleanObject, renderSimpleTime, confirmModal } from 'utils';
import 'new-table';
import { createAddTitle, VARIABLES, commonConfig, Table, bindPageChange } from 'tables';
import { SimpleDate } from 'daterangepicker';
namespace DialogIndex {
	let table: any, state: any;
	let t;
	$(function () {
		initDataTables();
		initBtn();
		initDate();
	});
	function initDataTables() {
		const width = VARIABLES.width;
		table = $('#key-table').DataTable(
			Object.assign(
				commonConfig(),
				{
					ajax: {
						type: 'POST',
						url: 'knowledge/dialog/list',
						dataSrc: data => { return data.rows; },
						data: d => {
							let data = {
								page: Math.floor((d.start + d.length) / d.length),
								rows: d.length
							};
							return cleanObject(data);
						}
					},
					columns: [
						{ data: 'dialogName', title: '对话模型名称', createdCell: createAddTitle },
						{ data: 'character.vname', width: 8 * width.char, title: '应用到的虚拟角色' },
						{ data: 'startTime', width: width.simpleTime, title: '生效时间', render: renderSimpleTime },
						{ data: 'endTime', width: width.simpleTime, title: '失效时间', render: renderSimpleTime },
						{ data: 'isReaccess', width: 8 * width.char, title: '是否允许重复进入', render: renderAccess }
					]
				}));
		t = new Table(table);
		$('#search-btn').on('click', function () {
			// table.draw();
			t.refresh(true);
		});
		bindPageChange(table, $('#page-change'));
        /*$('#page-change').on('change', function () {
            let len = $(this).val();
            table.page.len(len).draw();
        });*/

	}

	function renderAccess(status) {
		switch (status) {
			case 0:
				return '不允许';
			case 1:
				return '允许';
			default:
				return '';
		}
	}


	function initBtnEditDetails() {
		$('#edit-more-btn').on('click', function () {
			let select = $('.selected');
			if (select.length > 1) {
				alertMessage('只能编辑一个对话模型!');
			}
			else if (select.length < 1) {
				alertMessage('请选择要编辑的对话模型!');
			}
			else {
				let id = table.row(select).data().id;
				window.location.href = ctx + '/knowledge/dialog/update?id=' + id;
			}
		});
	}

	function initBtn() {
		initBtnCreate();
		initBtnDelete();
		initBtnEditDetails();
		initBtnEdit();
		initSubmit();
	}

	function initSubmit() {
		$('#create-submit-btn').on('click', function () {
			const dialogName = $.trim($('#dialogName').val()),
				reg = /^[a-zA-Z0-9\u4E00-\u9FA5]+$/,
				ir = $('#isReaccess').prop('checked') ? 1 : 0,
				data: any = {
					dialogName: dialogName,
					character: $('#select-character').val(),
					startTime: $('#start-date').val(),
					endTime: $('#end-date').val(),
					isReaccess: ir
				},
				el = $(this);
			if (!dialogName) {
				alertMessage('请填写对话模型名称!');
			}
			else if (!dialogName.match(reg)) {
				alertMessage('对话模型名称只能是数字,英文或中文!');
			}
			else {
				loadingBtn(el);
				let url;
				let bool;
				if (state === 'add') {
					url = 'knowledge/dialog/add';
					bool = true;
				}
				else if (state === 'edit') {
					url = 'knowledge/dialog/modify';
					data.id = table.row($('.selected')).data().id;
					bool = false;
				}
				else {
					return;
				}
				$.ajax({
					url: url,
					type: 'POST',
					data: data,
					success: function (msg) {
						if (!msg.error) {
							$('#create-modal').modal('hide');
							t.refresh(bool);
						}
						alertMessage(msg.msg, !msg.error);
					},
					complete: function () {
						endLoadingBtn(el);
					}
				});
			}
		});

		$('#create-modal').on('hidden.bs.modal', function () {
			let select = $('#select-character');
			let btn = $('#create-submit-btn');
			$('#dialogName').val(null);
			$('#isReaccess').prop('checked', null);
			select.val(select.find('option').first().val())
				.prop('disabled', null);
			$('#start-date').val(moment().format('YYYY-MM-DD'));
			$('#end-date').val(moment().add(5, 'year').format('YYYY-MM-DD'));
			if (btn.prop('disabled')) {
				endLoadingBtn(btn);
			}
		});
	}
	function initBtnCreate() {
		$('#add-btn').on('click', function () {
			$('#create-modal').modal('show').find('.modal-title').text('创建对话模型');
			state = 'add';
		});
	}
	function initBtnDelete() {
		$('#del-btn').on('click', function () {
			let select = $('.selected');
			if (select.length < 1) {
				alertMessage('请选择要删除的对话模型!');
			}
			else {
				let ids = Array.prototype.map.call(select, function (v) {
					let data = table.row(v).data();
					return data.id;
				});
				ids = ids.join(',');

				confirmModal({
					msg: '确认删除选中对话吗？',
					cb: (modal, btn) => {
						const end = loadingBtn(btn);
						$.ajax({
							url: 'knowledge/dialog/delete',
							type: 'POST',
							data: {
								ids: ids
							},
							success: function (msg) {
								alertMessage(msg.msg, msg.code);
								t.refresh();
								modal.modal('hide');
							},
							complete: () => {
								end();
							}
						});
					}
				});

				// BootstrapDialog.show({
				// 	title: '温馨提示',
				// 	message: '确认删除选中对话吗？',
				// 	size: BootstrapDialog.SIZE_SMALL,
				// 	buttons: [
				// 		{
				// 			label: '确认',
				// 			cssClass: 'btn-danger',
				// 			action: function (dialogItself) {
				// 				deleteByIds(ids);
				// 				dialogItself.close();
				// 			}
				// 		},
				// 		{
				// 			label: '取消',
				// 			cssClass: 'btn-default',
				// 			action: function (dialogItself) {
				// 				dialogItself.close();
				// 			}
				// 		}
				// 	]
				// });
			}
		});
	}
	function initDate() {
		new SimpleDate({
			el: $('#start-date')
		});
		new SimpleDate({
			el: $('#end-date'),
			date: moment().add(5, 'year')
		});
	}


	function initBtnEdit() {
		$('#edit-btn').on('click', function () {
			let select = $('.selected');
			if (select.length > 1) {
				alertMessage('只能编辑一个对话模型!');
			}
			else if (select.length < 1) {
				alertMessage('请选择要编辑的对话模型!');
			}
			else {
				let data = table.row(select).data();
				$('#create-modal').modal('show').find('.modal-title').text('编辑基本信息');
				state = 'edit';
				$('#dialogName').val(data.dialogName);
				$('#select-character').val(data.character.id).prop('disabled', true);
				$('#start-date').val(renderSimpleTime(data.startTime));
				$('#end-date').val(renderSimpleTime(data.endTime));
				if (data.isReaccess === 0) {
					$('#isReaccess').prop('checked', null);
				}
				if (data.isReaccess === 1) {
					$('#isReaccess').prop('checked', true);
				}
			}
		});
	}
}
