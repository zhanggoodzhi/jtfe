import * as tables from 'tables';
import * as utils from 'utils';
declare const privileges: any;
let allMemberTable;
let roleMemberTable;
let characterModal;
let ifAdd = true;
let roleArr = [];
let currentId = null;
let roleTable: any;
let authTable: any;
export function initAuth() {
	initOutTable();
	initModalTable();
}
function initModalTable() {
	allMemberTable = new tables.Table({
		el: $('#all-member-table'),
		options: {
			language: {
				info: '_START_~_END_ (总共_TOTAL_人)'
			},
			serverSide: true,
			scrollY: '300',
			ajax: {
				url: '/api/member/user/page',
				dataSrc: d => d.data,
				data: (d) => {
					const data = tables.extendsData(d, {
						username: ($('#auth-name').val() as string).trim()
					});
					const newData = utils.cleanObject(data);
					return newData;
				}
			},
			columns: [
				{ data: 'name', title: '账户名' },
				{ data: 'alias', title: '昵称' }
			]
		},
		initComplete: function () {

		}
	});
	roleMemberTable = new tables.Table({
		el: $('#role-member-table'),
		options: {
			scrollY: '300',
			paging: false,
			info: false,
			data: [],
			columns: [
				{ data: 'name', title: '账户名' },
				{ data: 'alias', title: '昵称' },
				{ data: 'id', title: '操作', render: utils.renderDeleteBtn }
			]
		},
		initComplete: function () {

		}
	});
}
function clearModal() {
	$('#auth-classify').val(null);
	$('#auth-desc').val(null);
	roleArr = [];
	roleMemberTable.refresh([]);
	ifAdd = true;
	characterModal.find('.modal-header h5').text('添加角色');
}
function initOutTable() {
	authTable = new tables.Table({
		el: $('#auth-table'),
		options: {
			data: privileges,
			columns: [
				{ data: 'id', title: 'ID' },
				{ data: 'remark', title: '权限' }
			]
		},
		initComplete: function () {
			this.disable();
		}
	});
	roleTable = new tables.Table({
		el: $('#role-table'),
		options: {
			serverSide: true,
			paging: false,
			info: false,
			ajax: {
				url: '/api/member/role/list',
				dataSrc: (d) => d,
				data: (data) => {
					return {};
				}
			},
			columns: [
				{ data: 'name', title: '角色' },
				{ data: 'remark', title: '简介' },
				{ data: 'id', title: '操作', render: utils.renderEditAndDeleteBtn }
			]
		},
		initComplete: function () {
			const authDt = authTable.dt;
			characterModal = $('#character-modal');
			characterModal.modal({
				complete: function () {
					clearModal();
				}
			});
			this.el.on('select.dt', (e, dt, type, index) => {
				if (authTable.isSelected()) {
					authDt.rows().deselect();
				}
				if (this.selected.length > 1) {
					return;
				}
				$.ajax('/api/member/role/privileges', {
					method: 'GET',
					data: {
						roleid: dt.row(index).data().id
					}
				}).done((data) => {
					Array.prototype.forEach.call(data, (v) => {
						authDt.row((id, row) => {
							if (row.id === v.id) {
								return true;
							}
							return false;
						}).select();
					});
				});
			})
				.on('deselect.dt', (e, dt) => {
					authDt.rows().deselect();
				});
			$('#add-character-btn').on('click', () => {
				characterModal.modal('open');
				allMemberTable.reload();
				roleMemberTable.dt.draw();
			});
			$('#edit-auth-btn').on('click', (e) => {
				const btn = $(e.currentTarget);
				if (!authTable.isInited()) {
					utils.toast('角色权限表格尚未初始化完成');
				}
				else if (!this.isSelected()) {
					utils.toast('请选择要编辑的角色');
				}
				else if (!this.isSingle()) {
					utils.toast('只能选择一个角色');
				} else {
					if (this.isDisabled()) {
						const privilegeIds = authDt.rows({ selected: true }).data().toArray().map((v) => {
							return v.id;
						});
						const roleid = roleTable.dt.rows({ selected: true }).data()[0].id;
						const end = utils.btnLoading(btn),
							tableEnd = authTable.loading();
						$.ajax('/api/member/privilege/modify', {
							method: 'POST',
							data: {
								roleid,
								privileges: privilegeIds.join(',')
							}
						}).done(() => {
							utils.toast('更改权限成功');
							roleTable.reload();
							end();
							tableEnd();
							this.enable();
							authTable.disable();
							btn.html('编辑权限');
							authTable.el.removeClass('kb-tick-table');
						});
					} else {
						this.disable();
						authTable.enable();
						btn.html('保存权限');
						authTable.el.addClass('kb-tick-table');
					}
				}
			});
			this.el.on('click', '.view-edit', function () {
				const el = $(this);
				currentId = el.data().id;
				ifAdd = false;
				const rowData: any = roleTable.dt.row(el.closest('tr')).data();
				const ids = rowData.userids;
				$.ajax('/api/member/user/list', {
					data: {
						userids: ids.join(',')
					}
				}).done((data) => {
					const { name, remark } = rowData;
					roleArr = [...data];
					$('#auth-classify').val(name);
					$('#auth-desc').val(remark);
					characterModal.find('.modal-header h5').text('编辑角色');
					characterModal.modal('open');
					allMemberTable.reload();
					roleMemberTable.refresh(roleArr);
				});
			});
			this.el.on('click', '.view-delete', function () {
				const id = $(this).data().id;
				utils.configurationDeleteEvent('/api/member/role/delete', {
					roleid: id
				}, () => {
					roleTable.reload();
				});
			});
			bindModalEvent();
		}
	});
}
function bindModalEvent() {
	$('#auth-search-btn').on('click', function () {
		allMemberTable.reload();
	});
	const allMemberTableDt = allMemberTable.dt;
	allMemberTableDt.on('select.dt', (e, dt, type, index) => {
		const data = allMemberTableDt.row(index).data();
		const id = data.id;
		const roleIds = roleArr.map((v) => {
			return v.id;
		});
		if (roleIds.indexOf(id) === -1) {
			roleArr.push(data);
			roleMemberTable.refresh(roleArr);
		}
	});
	roleMemberTable.el.on('click', '.view-delete', function () {
		const id = $(this).data().id;
		roleArr = roleArr.filter((v) => {
			if (v.id === id) {
				return false;
			}
			return true;
		});
		roleMemberTable.refresh(roleArr);
	});
	$('#character-modal .kb-yes-btn').on('click', function () {
		const name = ($('#auth-classify').val() as string).trim();
		const remark = ($('#auth-desc').val() as string).trim();
		const userids = roleArr.map((v) => {
			return v.id;
		});
		let url: string;
		let id = null;
		let method = 'POST';
		let text = '添加';
		if (ifAdd) {
			url = '/api/member/role/create';
		} else {
			url = '/api/member/role/update';
			id = currentId;
			method = 'PUT';
			text = '编辑';
		}
		$.ajax(url, {
			method,
			contentType: 'application/json',
			data: JSON.stringify({
				id,
				name,
				remark,
				userids: userids
			})
		}).done(() => {
			roleTable.reload();
			utils.toast(text + '角色成功');
			characterModal.modal('close');
		});
	});
}
