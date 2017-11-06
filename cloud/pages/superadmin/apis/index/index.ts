// import 'select2/dist/css/select2.css';
import * as utils from 'utils';
import 'new-table';
import * as tables from 'tables';
import 'select';
// import 'script-loader!select2/dist/js/select2.full.min.js';
namespace SuperadminApisIndex {
	declare const appList;
	enum action {
		update,
		add
	}
	let state: action;
	$(initTable);
	function initTable() {
		const $appList = $('.appid');
		$appList.select2({
			data: appList,
			placeholder: '选择应用名称',
			allowClear: true
		});
		$appList.val('').trigger('change');
		$('#table').DataTable(Object.assign(tables.commonConfig(),
			{
				ajax: {
					url: 'superadmin/apis/list',
					type: 'POST',
					dataSrc: data => data.rows,
					data: data => {
						return utils.cleanObject({
							page: tables.getPage(data),
							rows: data.length,
							apiName: $('#apiName').val(),
							apiDesc: $('#apiDesc').val(),
							apiUrl: $('#apiUrl').val(),
							appid: $('#appid option:selected').val()
						});
					}
				},
				columns: [
					{ data: 'apiName', title: '名称' },
					{ data: 'apiDesc', title: '描述', render: (text) => text ? text : '无' },
					{ data: 'apiUrl', title: '链接' },
					{ data: 'appName', title: '应用名称' }
				],
				initComplete: initComplete
			}
		));
	}

	function initComplete() {
		const table = $('#table').DataTable();
		// 回车查询
		utils.bindEnter($('#apiName,#apiDesc,#apiUrl'), () => {
			table.draw();
		});
		// 查询功能
		$('#apis-search-btn').on('click', () => {
			table.draw();
		});

		tables.bindPageChange(table); // 绑定修改分页
		const modalRoot = $('.apis');
		// 编辑功能
		let editId;
		$('#apis-edit-btn').on('click', () => {
			state = action.update;
			tables.checkLength({
				action: '编辑',
				name: 'API信息',
				unique: true,
				table: table,
				cb: (data, row) => {
					editId = data.id;
					modalRoot.find('.apiName').val(data.apiName);
					modalRoot.find('.apiDesc').val(data.apiDesc);
					modalRoot.find('.apiUrl').val(data.apiUrl);
					appList.forEach(v => {
						if (v.text === data.appName) {
							$(modalRoot.find('.appid')).val(v.id).trigger('change');
						}
					});
					modalRoot.find('.submit-btn').text('保存');
					modalRoot.modal('show').find('.modal-title').text('修改API');
				}
			});
		});
		// 添加功能
		$('#apis-add-btn').on('click', () => {
			state = action.add;
			modalRoot.find('.submit-btn').text('添加');
			modalRoot.modal('show').find('.modal-title').text('添加API');
		});
		// 提交功能
		modalRoot.find('.submit-btn').on('click', function () {
			const endLoading = utils.loadingBtn($(this));
			// 获取传给后台的值
			const sendData = {
				apiName: $.trim(modalRoot.find('.apiName').val()),
				apiDesc: $.trim(modalRoot.find('.apiDesc').val()),
				apiUrl: $.trim(modalRoot.find('.apiUrl').val()),
				appid: $.trim(modalRoot.find('.appid option:selected').val())
			};
			let actionUrl: string;
			if (state === action.add) {
				actionUrl = 'superadmin/apis/add';
			} else if (state === action.update) {
				actionUrl = 'superadmin/apis/update';
				Object.assign(sendData, { id: editId });
			}
			// 校验
			const inputs = modalRoot.find('input').toArray();
			for (let v of inputs) {
				const name = $.trim($(v).parent().prev().text());
				if (name !== '描述' && !$(v).val()) {
					utils.alertMessage(name + '不能为空！');
					endLoading();
					return;
				}
			}
			if (!modalRoot.find('.appid').val()) {
				utils.alertMessage('应用名称不能为空！');
				endLoading();
				return;
			}
			// 传值给后台
			$.ajax({
				url: actionUrl,
				type: 'POST',
				data: sendData,
				success: msg => {
					if (!msg.error) {
						table.draw();
						modalRoot.modal('hide');
					}
					utils.alertMessage(msg.msg, !msg.error);
				}
			});
			endLoading();
		});
		// 模态框消失就清空模态框中的数据
		modalRoot.on('hidden.bs.modal', () => {
			const inputs = modalRoot.find('input').toArray();
			for (let v of inputs) {
				$($(v).val(''));
			}
			modalRoot.find('.appid').val('').trigger('change');
		});
		// 删除功能
		tables.delBtnClick({
			el: $('#apis-del-btn'),
			table: table,
			name: 'API信息',
			url: 'superadmin/apis/delete'
		});
	}
}

