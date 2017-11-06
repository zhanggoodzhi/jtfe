import 'new-table';
import * as tables from 'tables';
import 'daterangepicker';
import * as utils from 'utils';
import 'select';
import './index.less';
namespace SuperadminUserIndex {
	interface IData {
		page?: number;
		rows?: number;
		adminName: string;
		nickname?: string;
		mobile?: string;
		email?: string;
		status?: string;
		sortField?: string;
		sortType?: string;
		qq?: string;
		id?: number;
		password?: string;
	}
	interface IDataAssociations {
		name: string;
		pattern?: RegExp;
		patternMsg?: string;
		require: boolean;
		el: string;
	}
	enum action {
		block,
		reopen
	}
	let isSelectInited: Boolean = false;
	let cPwd;
	$(function () {
		initSelect2();
		initTable();
		cPwd = $('.cloud-password').cPassword();
	});
	let editId;
	function initTable() {
		$('#table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					ajax: {
						url: 'superadmin/user/list',
						type: 'POST',
						dataType: 'json',
						dataSrc: (data) => {
							return data.rows;
						},
						data: (data) => {
							const d: IData = {
								page: tables.getPage(data),
								rows: parseInt($('#page-change').val().trim()),
								adminName: $.trim($('#adminName').val()),
								email: $.trim($('#email').val()),
								status: $.trim($('#status').val()),
								sortField: '',
								sortType: ''
							};
							return utils.cleanObject(d);
						}
					},
					initComplete: initcomplete,
					columns: [
						{ data: 'adminName', title: '用户名' },
						{ data: 'email', title: '邮箱' },
						{ data: 'status', title: '状态', render: renderStatus },
						{ data: 'regTime', title: '创建时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime },
						{
							data: 'id',
							title: '操作',
							className: 'prevent cloud-table-action',
							render: (id) => {
								return `<a href='javascript:;' data-id='${id}' class='single-edit'>编辑</a> `;
							}
						}
					]
				}
			)
		);
	}
	function renderStatus(text) {
		switch (text) {
			case 1:
				return '启用';
			case 0:
				return '停用';
			default:
				return '';
		}
	}
	function formatData(data) {
		return data.map((v) => {
			return {
				id: v.id,
				text: v.appName
			};
		});
	}
	function initSelect2() {
		$.ajax({
			url: 'superadmin/app/list',
			type: 'POST',
			success: function (data) {
				if (data.status === 'success') {
					$('.apps').select2({
						placeholder: '请选择应用',
						data: formatData(data.rows),
						allowClear: true
					});
					isSelectInited = true;
				}
			}
		});
	}
	function initcomplete() {
		const table: any = $('#table').DataTable();
		const editRoot = $('#edit-modal');
		const addRoot = $('#add-modal');
		tables.bindPageChange(table, $('#page-change'));
		// 查询按钮
		$('#search-btn').on('click', () => {
			table.draw();
		});
		// 编辑
		bindEditSingle();
		// 唯一性校验
		bindAdminNameVerifyEvent();
		bindEmailVerifyEvent();
		// 编辑模块中的保存按钮
		$('#edit-submit-btn').on('click', function () {
			const result = validator(editRoot, 'edit');
			if (result) {
				const endLoading = utils.loadingBtn($(this));
				// 分配的应用
				const appIds = editRoot.find('.apps').val();
				if (appIds.length === 0) {
					utils.alertMessage('应用不能为空！', false);
					endLoading();
					return;
				}
				// 表单校验成功则传数据到后台
				$.ajax({
					url: 'superadmin/user/update',
					type: 'POST',
					data: { ...result, appIds: appIds.join(',') },
					success: function (msg) {
						if (!msg.error) {
							editRoot.modal('hide');
							table.draw();
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
		// 添加用户按钮
		$('#add-btn').on('click', () => {
			// 生成默认密码
			// $('.password').val(Math.random().toString().slice(-6));
			if (!isSelectInited) {
				utils.alertMessage('应用app数据尚未初始化完毕，请稍后重试！', false);
			} else {
				addRoot.modal('show');
			}
		});
		// 添加用户中的添加按钮
		$('#add-submit-btn').on('click', function () {
			editId = '';
			const result = validator(addRoot, 'add');
			// 状态值：
			const status = $('input[name="isOpen"]:checked').val();
			// 校验表单数据
			if (result) {
				const endLoading = utils.loadingBtn($(this));
				// 分配的应用
				const appIds = addRoot.find('.apps').val();
				if (appIds.length === 0) {
					utils.alertMessage('应用不能为空！', false);
					endLoading();
					return;
				}
				$.ajax({
					url: 'superadmin/user/add',
					type: 'POST',
					data: Object.assign(result, {
						appIds: appIds.join(','),
						status: status
					}),
					success: function (msg) {
						if (!msg.error) {
							addRoot.modal('hide');
							table.draw();
						}
						utils.alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
		// 清空
		addRoot.on('hidden.bs.modal', () => {
			addRoot.find('.apps').val(null).trigger('change');
			getData('.id').forEach(v => {
				addRoot.find(v.el).val('');
			});
			$('input[name="isOpen"]:first').prop('checked', 'checked');
			cPwd.resetCPwd();
			$('input.error-validate').removeClass('error-validate');
			$('.validate-msg').hide();
		});
		editRoot.on('hide.bs.modal', () => {
			$('input.error-validate').removeClass('error-validate');
			$('.validate-msg').hide();
		});
		// 启用按钮
		$('#enable-btn').on('click', function () {
			changeStatus($(this), 'superadmin/user/reopen', table, action.reopen);
		});
		// 禁用按钮
		$('#disable-btn').on('click', function () {
			changeStatus($(this), 'superadmin/user/block', table, action.block);
		});
		// 回车即可以重新查询表格
		tables.bindEnter(table, $('#adminName,#mobile,#status'));
	}
	// 编辑功能
	function bindEditSingle() {
		const editRoot = $('#edit-modal');
		$('#table').on('click', '.single-edit', (e) => {
			if (!isSelectInited) {
				utils.alertMessage('应用app数据尚未初始化完毕，请稍后重试！', false);
			} else {
				const id = $(e.target).data('id');
				editId = id;
				$.ajax({
					url: 'superadmin/user/findOne',
					data: {
						id
					},
					success: (msg) => {
						if (msg.code === '200') {
							editRoot.modal('show');
							getData('.c-password').forEach(v => {
								editRoot.find(v.el).val(msg.data[v.name]);
							});
							editRoot.find('.apps').val(msg.data.appIdList).trigger('change');
						} else {
							utils.alertMessage(`后端数据异常：${msg.msg}`, !msg.error);
						}
					}
				});
			}
		});
	}
	// 用户名、邮件名唯一性的实时校验
	function bindAdminNameVerifyEvent() {
		$('.admin-name').on('change', (e) => {
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
    /**
     *
     * 禁用和启用功能的通用方法
     * @param {any} el 按钮元素
     * @param {any} status 要改变成的状态的名称
     * @param {any} url 后台接口
     * @param {any} table 需要被重新绘制的table
     * @param {any} bool 用于区分是启动还禁用的标识符
     * @returns
     */
	function changeStatus(el, url, table, act) {
		const endLoading = utils.loadingBtn(el);
		let ids = [];
		let actName: string;
		act === action.reopen ? actName = '启用' : actName = '停用';
		tables.checkLength({
			action: actName,
			name: '用户信息',
			unique: false,
			table: table,
			cb: (datas, rows) => {
				datas.forEach(v => {
					if (act !== v.status) {
						if (v.id) {
							ids.push(v.id);
						}
					}
				});
				if (!ids[0]) {
					utils.alertMessage('后端数据异常，无法获取id！', false);
					return;
				}
				if (ids.length === 0) {
					utils.alertMessage(`无法${actName}状态为已${actName}的用户！`);
					return;
				}
				$.ajax({
					url: url,
					type: 'POST',
					data: {
						ids: ids.join(',')
					},
					success: function (msg) {
						if (!msg.error) {
							table.draw();
						}
						utils.alertMessage(msg.msg, !msg.error);
					}
				});
			}
		});
		endLoading();


	}

    /**
     *
     * @param {any} el 要进行表单验证的modal框
     * @param {any} msg 用于区分要过滤那个表单元素的标识符
     * @returns 如果表单校验不通过，返回值为空；表单校验通过，则返回将要传个后台的数据
     */
	function validator(el, msg) {
		let currentData = [];
		if (msg === 'add') {
			currentData = getData('.id');
		} else if (msg === 'edit') {
			currentData = getData('.c-password');
		}
		let ajaxData = {};
		for (let v of currentData) {
			const input = el.find(v.el);
			const val = $.trim(input.val());
			let name = input.parent().prev().text();
			if (v.name === 'password') {
				name = '密码';
			}
			if (v.require && val === '') {
				utils.alertMessage(`${name}的值不能为空`);
				return false;
			}
			if (v.pattern && !v.pattern.test(val)) {
				utils.alertMessage(`${v.patternMsg ? name + '的格式不正确！' + v.patternMsg : name + '的格式不正确！'}`);
				return false;
			}
			ajaxData[v.name] = val;
		}
		return ajaxData;
	}
    /**
     *
     * 提交表单之前获取表单中的数据
     * @param {string[]} [filter]  需要被过滤掉的值
     * @returns 返回对应的表单中的数据
     */
	function getData(filter?: string) {
		// 页面中各个表单里通用的中表单域值及其相关信息
		const data: [IDataAssociations] = [
			{
				name: 'id',
				require: false,
				el: '.id'
			},
			{
				name: 'adminName',
				require: true,
				el: '.admin-name'
			},
			{
				name: 'email',
				pattern: /^[a-zA-Z0-9_\-\.]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
				require: true,
				el: '.email'
			},
			{
				name: 'password',
				pattern: /(\w{6,})|([`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]{6,})|(\w[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]{6,})|([`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]\w{6,})/i,
				patternMsg: '（密码由6位以上（数字、字母、特殊字符组成））',
				require: true,
				el: '.c-password'
			},
			{
				name: 'mobile',
				pattern: /^(1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}){0,1}$/,
				require: false,
				el: '.mobile'
			},
			{
				name: 'qq',
				pattern: /^([1-9][0-9]{4,14}){0,1}$/,
				patternMsg: '（qq号为5到15位数字组成）！',
				require: false,
				el: '.qq'
			}
		];
		if (filter) {
			const d = [];
			data.forEach(v => {
				if (filter !== v.el) {
					d.push(v);
				}
			});
			return d;
		}
		return data;
	}
}

