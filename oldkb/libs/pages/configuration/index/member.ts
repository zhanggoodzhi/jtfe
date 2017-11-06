import * as tables from 'tables';
import * as utils from 'utils';
declare const roles: any;
let table: any;
export function initMember() {
	table = new tables.Table({
		el: $('#member-table'),
		options: {
			serverSide: true,
			ajax: {
				url: '/api/member/user/page',
				method: 'GET',
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = tables.extendsData(d, {
						email: ($('#member-email').val() as string).trim(),
						role: ($('#member-role').val() as string[]).join(',')
					});
					const newData = utils.cleanObject(data);
					return newData;
				}
			},
			columns: [
				{ data: 'name', title: '账户名' },
				{ data: 'alias', title: '昵称' },
				{ data: 'email', title: '邮箱' },
				{ data: 'mobile', title: '手机号' },
				{ data: 'qq', title: 'QQ号' },
				{ data: 'id', title: '操作', className: 'prevent', render: utils.renderEditAndDeleteBtn }
			]
		},
		initComplete: initComplete
	});
}
function getFormData(modal) {
	const name = modal.find('input[name="name"]').val().trim();
	const alias = modal.find('input[name="alias"]').val().trim();
	const password = modal.find('input[name="password"]').val().trim();
	const rePassword = modal.find('input[name="rePassword"]').val().trim();
	const email = modal.find('input[name="email"]').val().trim();
	const mobile = modal.find('input[name="mobile"]').val().trim();
	const qq = modal.find('input[name="qq"]').val().trim();
	const roleids = modal.find('#modal-member-role').val();
	const validateArr = [
		{
			name: name,
			text: '账户名'
		}, {
			name: alias,
			text: '昵称'
		}, {
			name: roleids,
			text: '角色'
		}, {
			name: password,
			text: '密码'
		}, {
			name: email,
			text: '邮箱'
		}];
	for (let v of validateArr) {
		if (v.name === '') {
			utils.toast(v.text + '不能为空');
			return false;
		}
	}
	if (email && !/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email)) {
		utils.toast('邮箱格式不正确');
		return false;
	}
	if (mobile && !/^1[34578]\d{9}$/.test(mobile)) {
		utils.toast('手机号格式不正确');
		return false;
	}
	if (qq && !/^[1-9][0-9]{4,}$/.test(qq)) {
		utils.toast('QQ格式不正确');
		return false;
	}
	if (password !== rePassword) {
		utils.toast('两次新密码输入不一致');
		return false;
	}
	return {
		name,
		alias,
		roleids,
		password,
		email,
		mobile,
		qq
	};
}
function createModalHtml(data?) {
	const strArr = roles.map((v) => {
		return `<option value="${v.id}">${v.remark}</option>`;
	});
	const modalHtml = `
			<form class="clearfix">
				<div class="input-field col s12">
					<input name="name" value="${data ? data.name : ''}" placeholder="请输入账户名" />
				</div>
				<div class="input-field col s12">
					<input name="alias" value="${data ? data.alias : ''}" placeholder="请输入昵称" />
				</div>
				<div class="input-field col s12">
					<select id="modal-member-role" class="member-role select-small" multiple>
						<option value="" selected disabled>请选择角色</option>
						${strArr.join('')}
					</select>
				</div>
				<div class="input-field col s12">
					<input type="password" name="password" value="${data ? data.password : ''}" placeholder="请输入密码" />
				</div>
				<div class="input-field col s12">
					<input type="password" name="rePassword" value="${data ? data.password : ''}" placeholder="请确认密码" />
				</div>
				<div class="input-field col s12">
					<input name="email" value="${data ? data.email : ''}" placeholder="请输入邮箱" />
				</div>
				<div class="input-field col s12">
					<input name="mobile" value="${data ? data.mobile : ''}" placeholder="请输入手机号" />
				</div>
				<div class="input-field col s12">
					<input name="qq" value="${data ? data.qq : ''}" placeholder="请输入QQ号" />
				</div>
			</form>
		`;
	return modalHtml;
}
function initComplete() {
	const dt = table.dt;
	dt.on('click', '.view-delete', function (e) {
		const id = $(this).data().id;
		utils.configurationDeleteEvent('/api/member/user/delete', {
			userid: id
		}, () => {
			table.reload();
		});
	});
	dt.on('click', '.view-edit', function (e) {
		const data = table.dt.row($(e.currentTarget).parents('tr')).data();
		const id = data.id;
		utils.modal('编辑', createModalHtml(data), '保存', (remove, end, modal) => {
			const formData = getFormData(modal);
			if (!formData) {
				end();
				return;
			}
			$.ajax({
				url: '/api/member/user/updateSimple',
				method: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify({
					id,
					...formData
				})
			})
				.always(() => { end(); })
				.done(() => {
					utils.toast('编辑成员成功');
					table.reload();
					remove();
				});
		}, () => {
			const roleids = data.roles.map((v) => {
				return v.id;
			});
			$('#modal-member-role').val(roleids);
			$('select').material_select();
		});
	});
	$('#member-add-btn').on('click', function (e) {
		utils.modal('新增成员', createModalHtml(), '保存', (remove, end, modal) => {
			const formData = getFormData(modal);
			if (!formData) {
				end();
				return;
			}
			$.ajax({
				url: '/api/member/user/create',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					...formData
				})
			})
				.always(() => { end(); })
				.done(() => {
					utils.toast('新增成员成功');
					table.reload();
					remove();
				});
		}, () => {
			$('select').material_select();
		});
	});
	$('#member-search-btn').on('click', function () {
		table.reload();
	});
}
