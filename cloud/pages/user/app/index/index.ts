import './index.less';
import 'multiselect';
import 'select';
import 'daterangepicker';
import * as tables from 'new-table';
import { getPage, commonConfig, bindPageChange, delBtnClick, VARIABLES, Table } from 'tables';
import { confirmModal, alertMessage, renderSimpleTime, cleanObject } from 'utils';
declare const appName;
declare const isVcg;
declare const roleJson;
namespace UserAppIndex {
	$(function () {
		initTable();
		initSelect2();
		cPwd = $('.cloud-password').cPassword();
	});
	// 初始化表格
	let cPwd;
	let table;
	let editId = '';
	const rolesData = JSON.parse(roleJson);
	const path = 'user/app/';
	const addRoot = $('#add-modal');
	const editRoot = $('#edit-modal');

	function initTable() {
		table = new tables.Table({
			el: $('#user-table'),
			options: {
				serverSide: true,
				paging: true,
				ajax: {
					type: 'POST',
					url: path + 'list',
					dataSrc: data => { return data.rows; },
					data: (d: any) => {
						let data = {
							page: getPage(d),
							rows: d.length,
							name: $.trim($('#name').val()),
							email: $.trim($('#email').val()),
							role: $.trim($('#role').val())
						};
						return cleanObject(data);
					}
				},
				columns: [
					{ data: 'adminName', title: '用户名' },
					{ data: 'email', title: '邮箱', className: isVcg ? 'hide' : '' },
					{ data: 'adminRoleVoList', title: '角色', render: renderRoles },
					{ data: 'wechatName', title: '微信公众号', render: (text) => { return text ? text : '未指定'; } },
					{ data: 'regTime', title: '创建时间', render: renderSimpleTime, width: (VARIABLES as any).width.simpleTime },
					{
						data: 'id',
						title: '操作',
						className: 'prevent cloud-table-action',
						render: (data, type, row, meta) => {
							const roleList = row.adminRoleVoList;
							let roleIds = [];
							if (isVcg && roleList.length !== 0) {
								roleList.forEach(v => {
									roleIds.push(v.roleId);
								});
							}
							let optStr = `<a href='javascript:;' data-id='${row.id}' data-nickname='${row.nickname}' data-adminname='${row.adminName}' data-roles='${roleIds.join(',')}' data-wx='${row.wechatId}' class='single-edit'>编辑</a>`;
							optStr += isVcg ? '' : `&nbsp;&nbsp;<a href='javascript:;' data-id='${row.id}' data-nickname='${row.nickname}' class='single-delete'>删除</a>`;
							return optStr;
						}
					}
				],
				initComplete: initComplete
			}
		});
	}
	function initComplete() {
		bindSearchEvent();// 关键字查询
		bindAddEvent();// 添加模态框显示
		doReg();// 注册添加
		bindSingleEdit();// 初始化编辑模态框并显示
		doEditUser();// 编辑保存
		bindSingleDelete();// 删除

		// 唯一性校验
		bindAdminNameVerifyEvent();
		bindEmailVerifyEvent();

		// 清空模态框
		clearModal();
	}
	function renderRoles(roles) {
		let names = [];
		if (roles) {
			roles.forEach(v => {
				names.push(v.roleName);
			});
		}
		return names.join(',');
	}
	// 查询功能
	function bindSearchEvent() {
		$('#search-btn').on('click', () => {
			table.reload();
		});
	}
	// 添加功能
	function bindAddEvent() {
		$('#add-btn').on('click', () => {
			editId = '';
			addRoot.modal('show');
		});
	}
	// 删除功能
	function bindSingleDelete() {
		$('#user-table').on('click', '.single-delete', function () {
			delUser($(this).data('id'));
		});
	}
	// 编辑功能
	function bindSingleEdit() {
		$('#user-table').on('click', '.single-edit', function () {
			const d = $(this).data();
			if (!isVcg) {
				editUser(d.id, d.nickname);
			} else {
				// editRoot.find('.id').val(d.id);
				editId = d.id;
				editRoot.find('.name').val(d.adminname);
				editRoot.find('.role').val(d.roles).trigger('change');
				editRoot.find('.wx').val(d.wx);
				editRoot.modal('show');

			}
		});
	}


	// 初始化表格数据
	function formatData(data) {
		return data.map((v) => {
			return {
				id: v.id,
				text: v.name
			};
		});
	}
	function initSelect2() {
		$('.role').select2({
			placeholder: '请选择角色',
			data: formatData(rolesData),
			allowClear: true
		});
	}
	// 用户名、邮件名唯一性的实时校验
	function bindAdminNameVerifyEvent() {
		$('.name').on('change', (e) => {
			verify({ name: $.trim($(e.target).val()), flag: 0 }, $(e.target));
		});
	}
	function bindEmailVerifyEvent() {
		$('.email').on('change', (e) => {
			verify({ email: $.trim($(e.target).val()), flag: 1 }, $(e.target));
		});
	}
	function verify(data, $el) {
		let sendData;
		if (editId) {
			sendData = Object.assign({ id: editId }, ...data);
		}
		$.ajax({
			url: 'superadmin/user/verify',
			data: editId ? sendData : data,
			success: (msg) => {
				if (msg.error) {
					$el.addClass('error-validate').focus();
					$el.next('.validate-msg').css('display', 'inline-block');
				} else {
					$el.removeClass('error-validate');
					$el.next('.validate-msg').css('display', 'none');
				}
			}
		});
	}
	// 注册
	function doReg() {
		$('#register-btn').on('click', () => {
			const adminUser = $.trim(addRoot.find('.name').val());
			const roles = addRoot.find('.role').val().join(',');
			const email = $.trim(addRoot.find('.email').val());
			const pwd = $.trim(addRoot.find('.c-password').val());
			const credentialId = addRoot.find('.wx').val();
			const mobile = $.trim(addRoot.find('.mobile').val());
			const qq = $.trim(addRoot.find('.qq').val());
			if (adminUser === undefined || adminUser === '') {
				alertMessage('用户名不能为空！', false);
				return;
			}
			if (addRoot.find('.role').val().length === 0) {
				alertMessage('角色不能为空！', false);
				return;
			}
			if (email === undefined || email === '') {
				alertMessage('邮箱不能为空！', false);
				return;
			} else {
				const eReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
				if (!eReg.test(email)) {
					alertMessage('电子邮箱格式不正确！', false);
					return;
				}
			}
			if (pwd === undefined || pwd === '') {
				alertMessage('密码不能为空！', false);
				return;
			}
			if (pwd.length < 6) {
				alertMessage('密码不能小于6位！', false);
				return;
			}
			if (mobile) {
				let reg = /^0?(13[0-9]|15[012356789]|18[02356789]|14[57]|17[0678])[0-9]{8}$/;
				if (!reg.test(mobile)) {
					reg = /^0?(170[059])[0-9]{7}$/;
					if (!reg.test(mobile)) {
						alertMessage('手机号码格式不正确！', false);
						return;
					}
				}
			}
			const sendData = { adminUser, roles, email, pwd, mobile, qq };
			$.ajax({
				url: path + 'doReg',
				type: 'POST',
				data: { ...cleanObject(sendData), credentialId },
				success: function (data) {
					if (!data.error) {
						alertMessage('您已成功注册应用成员！', true);
						table.reload();
						addRoot.modal('hide');
					} else {
						alertMessage(data.msg, !data.error);
					}
				}
			});
		});
	}

	function delUser(userId) {
		confirmModal({
			msg: `确认删除?`,
			cb: (modal, btn) => {
				$.ajax({
					url: path + 'delUser',
					data: {
						userId
					},
					type: 'POST',
					success: function (data) {
						if (!data.error) {
							modal.modal('hide');
							table.reload();
							alertMessage('删除成功！', true);
						} else {
							alertMessage('删除失败！', !data.error);
						}
					}
				});
			}
		});
	}

	// 点击编辑应用成员时，获取应用成员信息
	function editUser(userId, nickname) {
		editId = userId;
		$.ajax({
			url: path + 'getUser',
			type: 'POST',
			data: {
				'userId': userId,
				'nickname': nickname
			},
			success: function (data) {
				if (data.state === 'success') {
					editRoot.find('.name').val(data.name);
					editRoot.find('.role').val(data.roles.split(',')).trigger('change');
					editRoot.find('.email').val(data.email);
					editRoot.find('.wx').val(data.extraData);
					editRoot.find('.mobile').val(data.mobile);
					editRoot.find('.qq').val(data.qq);
					editRoot.modal('show');
				} else {
					alertMessage('获取单条数据异常！', false);
				}
			}
		});
	}
	// 编辑修改后提交
	function doEditUser() {
		$('#edit-submit-btn').on('click', () => {
			const adminUser = $.trim($('.name').val());
			const roles = $('.role').val().join(',');
			const email = $.trim($('.email').val());
			const credentialId = $('.wx').val();
			const mobile = $.trim($('.mobile').val());
			const qq = $.trim($('.qq').val());
			// 编辑的校验尚未处理
			$.ajax({
				url: path + 'doEditUser',
				type: 'POST',
				data: {
					'userId': editId,
					'email': email,
					'mobile': mobile,
					'roles': roles,
					'adminUser': adminUser,
					'qq': qq,
					'credentialId': credentialId
				},
				success: function (data) {
					if (!data.error) {
						table.reload();
						editRoot.modal('hide');
					} else {
						alertMessage(data.msg, !data.error);
					}
				}
			});
		});
	}
	// 清空模态框
	function clearModal() {
		addRoot.on('hide.bs.modal', () => {
			addRoot.find('.name').val('');
			addRoot.find('.role').val(null).trigger('change');
			addRoot.find('.email').val('');
			addRoot.find('.c-password').val('');
			addRoot.find('.wx').val('');
			addRoot.find('.mobile').val('');
			addRoot.find('.qq').val('');
			cPwd.resetCPwd();
			$('input.error-validate').removeClass('error-validate');
			$('.validate-msg').hide();
		});
		editRoot.on('hide.bs.modal', () => {
			$('input.error-validate').removeClass('error-validate');
			$('.validate-msg').hide();
		});
	}
}
