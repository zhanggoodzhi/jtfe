// import 'select2/dist/css/select2.css';
import * as utils from 'utils';
import 'new-table';
import * as tables from 'tables';
// import 'script-loader!select2/dist/js/select2.full.min.js';
import 'select';

namespace SuperadminFieldDictionaryIndex {
	enum action {
		add,
		update
	}
	let state: action;
	declare const types;// 权限
	declare const visibles;// 文档类型
	$(initTable);
	function initTable() {
		const $type = $('.type');
		const $visible = $('.visible');
		$type.select2({
			data: types,
			placeholder: '选择类型',
			allowClear: true
		});
		$type.val('').trigger('change');
		$visible.select2({
			val: '全员可见',
			data: visibles,
			placeholder: '选择可见度',
			allowClear: true
		} as any);
		$visible.val('999').trigger('change');
		$('#table').DataTable(Object.assign(tables.commonConfig(),
			{
				ajax: {
					url: 'superadmin/fieldDictionary/list',
					type: 'POST',
					dataSrc: data => data.rows,
					data: data => {
						return utils.cleanObject({
							page: tables.getPage(data),
							rows: data.length,
							name: $('#name').val(),
							type: $('#type option:selected').text(),
							code: $('#code').val(),
							visible_level: $('#visibleLevel option:selected').val()
						});
					}
				},
				columns: [
					{ data: 'type', title: '类型' },
					{ data: 'name', title: '名称' },
					{ data: 'code', title: 'code值' },
					{ data: 'description', title: '描述' },
					{ data: 'visibleLevel', title: '可见度', render: renderVisible }
				],
				initComplete: initComplete
			}
		));
		function renderVisible(text) {
			let visibleName;
			visibles.forEach(v => {
				if (v.id === text) {
					visibleName = v.text;
				}
			});
			return visibleName;
		}
	}
	function initComplete() {
		const table = $('#table').DataTable();
		utils.bindEnter($('#name,#type,#code'), () => {
			table.draw();
		});
		// 查询功能
		$('#dictionary-search-btn').on('click', () => {
			table.draw();
		});
		tables.bindPageChange(table); // 绑定修改分页
		// 添加功能
		const modalRoot = $('.dictionary');
		$('#dictionary-add-btn').on('click', () => {
			state = action.add;
			modalRoot.find('button.submit-btn').html('添加');
			modalRoot.modal('show').find('h4.modal-title').text('添加数据字典');
			clearData(modalRoot);
		});
		// 编辑功能
		let dicid: number;
		$('#dictionary-edit-btn').on('click', () => {
			state = action.update;
			tables.checkLength({
				action: '修改',
				name: '数据字典',
				unique: true,
				table: table,
				cb: (data) => {
					dicid = data.id;
					getData().forEach(v => {
						const el = modalRoot.find(v.el);
						if (v.name === 'visible_level') {
							$(el).val(data.visibleLevel).trigger('change');
						} else if (v.name === 'type') {
							// 遍历类型对象
							types.forEach(t => {
								if (t.text === data[v.name]) {
									$(el).val(t.id).trigger('change');
								}
							});
						} else {
							el.val(data[v.name]);
						}
					});
					modalRoot.find('button.submit-btn').html('保存');
					modalRoot.modal('show').find('h4.modal-title').text('修改数据字典');
				}
			});
		});
		// 确定按钮
		$('.submit-btn').on('click', () => {
			if (state === action.add) {
				addSubEvent();
			} else if (state === action.update) {
				editSubEvent();
			}
		});
		// 删除功能
		tables.delBtnClick({
			el: $('#dictionary-del-btn'),
			table: table,
			name: '数据字典',
			url: 'superadmin/fieldDictionary/delete'
		});

		function addSubEvent() {
			const endLoading = utils.loadingBtn($(this));
			const ajaxData: any = validator(modalRoot, 'add');
			ajaxData.code = parseInt(ajaxData.code);
			if (ajaxData) {
				$.ajax({
					url: 'superadmin/fieldDictionary/add',
					type: 'POST',
					data: ajaxData,
					success: msg => {
						if (!msg.error) {
							table.draw();
							modalRoot.modal('hide');
						}
						utils.alertMessage(msg.msg, !msg.error);
					}
				});
			}
			endLoading();
		}
		function editSubEvent() {
			const endLoading = utils.loadingBtn($(this));
			const ajaxData = validator(modalRoot, 'edit');
			Object.assign(ajaxData, { id: dicid });
			if (ajaxData) {
				$.ajax({
					url: 'superadmin/fieldDictionary/update',
					type: 'POST',
					data: ajaxData,
					success: msg => {
						if (!msg.error) {
							table.draw();
							modalRoot.modal('hide');
							clearData(modalRoot);
						}
						utils.alertMessage(msg.msg, !msg.error);
					}
				});
			}
			endLoading();
		}
	}
	function getData(filter?: string) {
		const data = [
			{
				name: 'type',
				el: '.type',
				require: true
			},
			{
				name: 'name',
				el: '.name',
				require: true
			},
			{
				name: 'code',
				el: '.code',
				require: true,
				pattern: /^[-+]?[0-9]+$/,
				patternMsg: '（须为整数类型）！'
			}, {
				name: 'description',
				el: '.description',
				require: false
			}, {
				name: 'visible_level',
				el: '.visible_level',
				require: true
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
	function validator(el, msg) {
		let currentData = [];
		if (msg === 'add') {
			currentData = getData();
		} else if (msg === 'edit') {
			currentData = getData();
		}
		let ajaxData = {};
		for (let v of currentData) {
			let val;
			let name;
			if (v.name === 'type') {
				val = el.find('.type option:selected').text();
				name = '类型';
			} else if (v.name === 'visible_level') {
				val = el.find('.visible option:selected').val();
				name = '可见度';
			} else {
				const input = el.find(v.el);
				val = $.trim(input.val());
				name = input.parent().prev().text();
			}
			if (v.require && val === '') {
				utils.alertMessage(`${name}的值不能为空`);
				return false;
			}
			const misFormat = name + '的格式不正确！';
			if (v.pattern && !v.pattern.test(val)) {
				const pmsg = v.patternMsg;
				utils.alertMessage(`${pmsg ? misFormat + pmsg : misFormat}`);
				return false;
			}
			ajaxData[v.name] = val;
		}
		return ajaxData;
	}
	function clearData(modalRoot) {
		getData().forEach(v => {
			const el = modalRoot.find(v.el);
			if (v.name === 'visible_level') {
				$(el).val('999').trigger('change');
			} else if (v.name === 'type') {
				$(el).val('').trigger('change');
			} else {
				el.val('');
			}
		});
	}
}

