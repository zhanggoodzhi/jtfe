import './index.less';
import { Table } from 'new-table';
import * as utils from 'utils';
namespace UserAppIndex {
	let roleTable;
	let authTable;
	let ifAdd = true;
	let currentId = 0;
	let selectRoleId = 0;
	$(function () {
		init();
	});

	function init() {
		initRoleTable();
		initAuthTable();
	}

	function initRoleTable() {
		roleTable = new Table(
			{
				el: $('#role-table'),
				options: {
					paging: false,
					info: false,
					serverSide: true,
					ajax: {
						type: 'POST',
						url: 'user/app/getRole',
						dataSrc: data => { return data.data; },
						data: (d: any) => {
							return {};
						}
					},
					// data: [{
					// 	id: '1',
					// 	text: '管理员'
					// },
					// {
					// 	id: '2',
					// 	text: '审核者'
					// }],
					initComplete: bindRoleTableEvent,
					columns: [
						{ data: 'name' },
						{
							data: 'id', className: 'prevent', width: '70', render: (id) => {
								return `
								<i class="fa cloud-fa-icon fa-edit edit" title="编辑"></i>
								<i class="fa cloud-fa-icon fa-trash delete" title="删除"></i>
								`;
							}
						}
					]
				}
			});
	}
	function bindRoleTableEvent() {
		const tableEl = $('#role-table');
		const modalEl = $('#role-modal');
		tableEl.DataTable().select.style('single');
		$('#add-btn').on('click', function () {
			ifAdd = true;
			$('#role-modal').modal('show');
		});
		modalEl.on('hidden.bs.modal', function () {
			$('#name').val(null);
			$('#role-modal .modal-title').text('添加角色');
		});
		tableEl.on('click', '.edit', function () {
			$('#role-modal .modal-title').text('编辑角色');
			ifAdd = false;
			const rowData = roleTable.dt.row($(this).closest('tr')).data();
			const name = rowData.name;
			currentId = rowData.id;
			$('#name').val(name);
			$('#role-modal').modal('show');
		});
		tableEl.on('click', '.delete', function () {
			const id = roleTable.dt.row($(this).closest('tr')).data().id;
			utils.confirmModal({
				msg: '确认删除该角色么?',
				cb: (modal, btn) => {
					$.ajax({
						url: 'user/app/delRole',
						data: {
							roleId: id,
							flag: false
						},
						method: 'POST',
						success: function (data) {
							if (data.state === 'success') {
								modal.modal('hide');
								roleTable.reload();
								utils.alertMessage('删除成功！', true);
							}
							else if (data.state === 'fail_existUser') {
								modal.modal('hide');
								utils.confirmModal({
									msg: '存在用户使用该角色，是否继续删除?',
									cb: (smodal, sbtn) => {
										$.ajax({
											url: 'user/app/delRole',
											data: {
												roleId: id,
												flag: true
											},
											method: 'POST',
											success: function (sdata) {
												if (sdata.state === 'success') {
													smodal.modal('hide');
													roleTable.reload();
													utils.alertMessage('删除成功！', true);
												} else {
													utils.alertMessage('删除失败！', false);
												}
											}
										});
									}
								});
							} else {
								utils.alertMessage('删除失败！', false);
							}
						}
					});
				}
			});
		});
		$('#modal-save-btn').on('click', function () {
			const name = $('#name').val();
			if (name === '') {
				utils.alertMessage('请输入角色名称!');
				return;
			}
			$.ajax('user/app/addRole', {
				method: 'POST',
				data: {
					name,
					id: ifAdd ? 0 : currentId
				}
			}).done((data) => {
				if (data.state === 'success' || data.state === 'editsuccess') {
					utils.alertMessage(ifAdd ? '添加成功' : '编辑成功', true);
					modalEl.modal('hide');
					roleTable.reload();
				} else {
					utils.alertMessage(data.msg);
				}
			});
		});
		tableEl.DataTable().on('select', function (e, dt, type, indexes) {
			const authDt = authTable.dt;
			const rowData = roleTable.dt.row(indexes).data();
			const id = rowData.id;
			selectRoleId = id;
			$.ajax('user/app/showPri', {
				method: 'POST',
				data: {
					id
				}
			}).done((data) => {
				if (data.state === 'success') {
					const arr = data.msg.split(',');
					arr.forEach(v => {
						authDt.row((i, row) => {
							if (row.id.toString() === v) {
								return true;
							}
						}).select();
					});
				} else {
					authDt.rows().deselect();
				}
			});
		});
		tableEl.DataTable().on('deselect', (e, dt) => {
			const authDt = authTable.dt;
			authDt.rows().deselect();
		});
	}
	function initAuthTable() {
		authTable = new Table(
			{
				el: $('#auth-table'),
				checkbox: {
					data: 'id'
				},
				options: {
					select: {
						style: 'api',
						blurable: false,
						info: false,
						selector: 'tr td:not(.prevent)'
					},
					paging: false,
					info: false,
					serverSide: true,
					ajax: {
						type: 'POST',
						url: 'user/app/getPrivileges',
						dataSrc: data => { return data.data; },
						data: (d: any) => {
							return {};
						}
					},
					// data: [{
					// 	id: '1',
					// 	text: '权限1'
					// },
					// {
					// 	id: '2',
					// 	text: '权限2'
					// }],
					initComplete: bindAuthTableEvent,
					columns: [
						{ data: 'desc', title: '全选' }
					]
				}
			});
	}
	function turnEdit() {
		$('#auth-table').DataTable().select.style('multi');
		$('#edit-btn').hide();
		$('#save-btn').show();
		$('.disabled-wrap').show();
		$('#auth-table tr').removeClass('disable');
		$('#auth-table_wrapper .dataTables_scrollHead').addClass('show');
	}
	function turnCheck() {
		$('#auth-table').DataTable().select.style('api');
		$('#save-btn').hide();
		$('#edit-btn').show();
		$('.disabled-wrap').hide();
		$('#auth-table tr').addClass('disable');
		$('#auth-table_wrapper .dataTables_scrollHead').removeClass('show');
	}
	function bindAuthTableEvent() {
		$('#auth-table tr').addClass('disable');
		$('#edit-btn').on('click', function () {
			if (Array.from(roleTable.dt.rows('.selected').data()).length === 0) {
				utils.alertMessage('请先选择一个角色！');
				return;
			}
			turnEdit();
		});
		$('#save-btn').on('click', function () {
			const selects = Array.from(authTable.dt.rows('.selected').data()) as any;
			const ids = selects.map(v => {
				return v.id;
			});
			$.ajax('user/app/editPri', {
				method: 'POST',
				data: {
					roleid: selectRoleId,
					pris: ids.join(',')
				}
			}).done((data) => {
				if (data.state === 'add' || data.state === 'success' || data.state === 'delete') {
					utils.alertMessage('编辑权限成功', true);
					turnCheck();
				} else {
					utils.alertMessage(data.msg);
				}
			});
		});
	}
}
