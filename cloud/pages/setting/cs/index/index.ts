import * as utils from 'utils';
import * as newTable from 'new-table';
import * as tables from 'tables';
import 'time';
import './index.less';
import 'script-loader!cropper/dist/cropper.min.js';
import 'cropper/dist/cropper.css';
// import { DelayUpload } from 'upload';
namespace SettingCsIndex {
	$(init);
	interface IDataAssociations {
		name: string;
		pattern?: RegExp;
		patternMsg?: string;
		require: boolean;
		el: string;
	}
	interface ILocation {
		prefix: string;
		fileDir: string;
		suffix: string;
		uri: string;
	}
	declare let groups;// 分组
	declare const operationList;// 权限
	declare const doctypeList;// 文档类型
	let accT;
	let modalFlag;
	enum types {
		account,
		group,
		document
	}
	function parseLocation(location: ILocation) {
		return location.uri + '?' + $.param({
			prefix: location.prefix,
			fileDir: location.fileDir,
			suffix: location.suffix
		});
	}
	function init() {
		initGlobal();
		fillGroups('#account-group', true);
		initServerAccount();// 第一个标签页
	}

	function initGlobal() {
		$('#server-group-tab').one('shown.bs.tab', initServerGroup);// 第二个标签页
		$('#document-manage-tab').one('shown.bs.tab', initDocumentManage);// 第三个标签页
		$('#common-manage-tab').one('shown.bs.tab', initCommonManage);// 第四个标签页
	}
	function initServerAccount() {
		// 初始化客服账号表格
		$('#account-table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					ajax: {
						url: 'setting/cs/account/list',
						type: 'POST',
						dataSrc: data => data.rows,
						data: data => {
							return utils.cleanObject({
								page: tables.getPage(data),
								rows: data.length,
								username: $.trim($('#account-name').val()),
								alias: $.trim($('#account-alias').val()),
								groupid: $('#account-group').val(),
								deleted: $('#account-status').val(),
								sort: '',
								order: ''
							});
						}
					},
					scrollY: tables.getTabsTableHeight($('#server-account .cloud-search-area')),
					columns: [
						{
							data: 'servicerHead', title: '头像', render: (text) => {
								return `<span class="headIcon" style="background:url('${text}')"></span>`;
							}
						},
						{ data: 'username', title: '用户名' },
						{ data: 'alias', title: '别名' },
						{ data: 'groupPrivilege', title: '分组名称', render: text => text ? text.groupname : '暂无分组' },
						{
							data: 'groupPrivilege', title: '权限', width: '120px', className: 'priviShow', render: renderOptions, createdCell: (cell, cellData) => {
								$(cell).attr('title', renderOptions(cellData) as any);
							}
						},
						{ data: 'mobile', title: '电话', createdCell: tables.createAddTitle },
						{ data: 'email', title: '邮箱' },
						{ data: 'deleted', title: '状态', render: renderStatus }
					],
					initComplete: initComplete
				}
			)
		);
		function initComplete() {
			initCorpper();
			const table = $('#account-table').DataTable();
			accT = new tables.Table(table);
			const accEditRoot = $('#account-edit-modal');
			const accAddRoot = $('#account-add-modal');
			const groupRoot = $('#groups-modal');

			$('#server-acc-tab').on('shown.bs.tab', () => {
				accT.refresh(true);
			});
			// 回车查询
			utils.bindEnter($('#account-name,#account-alias'), () => {
				// table.draw();
				accT.refresh(true);
			});
			// 查询
			$('.acc-search').on('click', () => {
				// table.draw();
				accT.refresh(true);
			});
			// 编辑
			$('.acc-edit').on('click', () => {
				modalFlag = 'edit';
				tables.checkLength({
					action: '编辑',
					table: table,
					name: '客服账号',
					unique: true,
					cb: (data) => {
						accEditRoot.find('.cropper').prop('src', data.servicerHead);
						accEditRoot.find('.password').val('');
						accEditRoot.modal('show');
						getData('.password').forEach(v => {
							accEditRoot.find(v.el).val(data[v.name]);
							if (v.el === '.groupid') {
								fillGroups('.groupid');
								accEditRoot.find(v.el).val(data.groupPrivilege.id);
							}
						});
					}
				});
			});
			// 编辑模态框中的确定
			$('#acc-edit-submit-btn').on('click', function () {
				accSubmit(accEditRoot, 'edit', 'setting/cs/account/update', '.password', $(this));
			});
			// 添加
			$('.acc-add').on('click', () => {
				modalFlag = 'add';
				groupsModal(accAddRoot);
			});
			// 添加模态框中的确定--获取值并校验 ajax传给后台
			$('#acc-add-submit-btn').on('click', function () {
				accSubmit(accAddRoot, 'add', 'setting/cs/account/add', '.id', $(this));
			});
			// 启用
			$('.acc-reopen').on('click', function () {
				let ids = [];
				const select: any = tables.getSelected(table);
				select.forEach(v => {
					ids.push(v.id);
				});
				if (ids.length === 0) {
					utils.alertMessage('请选择至少一条客服信息！');
				} else {
					groupsModal(groupRoot);
				}
			});
			// 启用后的分组选项中的确定按钮
			$('#group-submit-btn').on('click', function () {
				const changedGroupid = groupRoot.find('.groupid').val();
				const addData = { groupid: changedGroupid };
				const msg = '请选择正确的账号或分组(分组未发生改变)!';
				if (changeStatus($(this), 'setting/cs/account/reopen', msg, addData)) {
					groupRoot.modal('hide');
				}
			});
			// 禁用
			$('.acc-block').on('click', function () {
				const msg = '请选择至少一条未被禁用的客服信息！';
				changeStatus($(this), 'setting/cs/account/delete', msg);
			});

            /**
             *
             * 分组框
             * @param {JQuery} root modal的jqeury对象
             */
			function groupsModal(root: JQuery) {
				root.find('.groupid').empty();
				fillGroups('.groupid');
				root.modal('show');
			}
            /**
             *
             * 修改启用或者禁用状态
             * @param {JQuery} el 按钮
             * @param {string} url 后台接口Url
             * @param {string} msgs 错误提示信息
             * @param {*} [addData] 启用功能附加的字段
             * @returns
             */
			function changeStatus(el: JQuery, url: string, msgs: string, addData?: any) {
				const endLoading = utils.loadingBtn(el);
				let ids = [];
				const select: any = tables.getSelected(table);
				if (addData) {
					select.forEach(v => {
						if (!(v.deleted === 0 && v.groupPrivilege.id === parseInt(addData.groupid))) {
							ids.push(v.id);
						}
					});
				} else {
					select.forEach(v => {
						if (v.deleted !== 1) {
							ids.push(v.id);
						}
					});
				}
				if (ids.length === 0) {
					utils.alertMessage(msgs);
					endLoading();
					return false;
				} else {
					const sendData = { ids: ids.join(',') };
					if (addData) {
						Object.assign(sendData, addData);
					}
					$.ajax({
						url: url,
						type: 'POST',
						data: sendData,
						success: msg => {
							if (!msg.error) {
								// table.draw();
								accT.refresh();
							}
							utils.alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							endLoading();
						}
					});
					endLoading();
					return true;
				}
			}
            /**
             *
             * 添加和编辑的确定按钮的通用方法
             * @param {JQuery} root 模态框
             * @param {string} type 编辑或者添加的标识符
             * @param {string} url 后台接口Url
             * @param {string} filter 需要被过滤掉的不被校验的元素
             */
			function accSubmit(root: JQuery, type: string, url: string, filter: string, btn: JQuery) {

				const result = validator(root, type);
				const bool = (type === 'add' ? true : false);
				// 头像
				const servicerHead = bool ? $('#account-add-modal').find('img.cropper').attr('src') : $('#account-edit-modal').find('img.cropper').attr('src');
				if (result) {
					const endLoading = utils.loadingBtn(btn);
					$.ajax({
						url: url,
						type: 'POST',
						data: Object.assign({ servicerHead }, result),
						success: msg => {
							if (!msg.error) {
								root.modal('hide');
								// table.draw();
								accT.refresh(bool);
							}
							utils.alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							endLoading();
						}
					});
				}
			}
			accAddRoot.on('hidden.bs.modal', () => {
				const sr = accAddRoot.find('img.cropper').data('src');
				accAddRoot.find('img.cropper').attr('src', sr);
				getData().forEach(v => {
					if (v.name === 'deleted') {
						accAddRoot.find(v.el).val('0');
					} else {
						accAddRoot.find(v.el).val('');
					}
				});
			});
		}
		function renderStatus(text) {
			switch (text) {
				case 0:
					return '已启用';
				case 1:
					return '已禁用';
				default:
					return '';
			}
		}
		function renderOptions(text) {
			if (text) {
				const optionIds = text.operationids.split(',');
				const optionNames = [];
				operationList.forEach(v => {
					optionIds.forEach(m => {
						if (v.id === parseInt(m)) {
							optionNames.push(v.opname);
						}
					});
				});
				return optionNames;
			} else {
				return '暂无权限';
			}

		}
	}

	function initServerGroup() {
		let getAll: boolean;
		// 初始化分组管理表格
		$('#group-table').DataTable({
			ajax: {
				url: 'setting/cs/groupPrivilege/list',
				type: 'POST',
				dataSrc: data => {
					if (getAll) {
						fetchGroupsData(data);
					}
					return data.rows;
				},
				data: data => {
					const d: any = utils.cleanObject({
						groupname: $('#grounp-name').val(),
						rows: 99999,
						sort: '',
						order: ''
					});

					if (d.groupname === '') {
						getAll = true;
					}
					else {
						getAll = false;
						$.ajax({
							type: 'POST',
							url: 'setting/cs/groupPrivilege/list',
							data: {
								groupname: '',
								rows: 99999,
								sort: '',
								order: ''
							},
							success: fetchGroupsData
						});
					}
					return d;
				}
			},
			scrollY: tables.getTabsTableHeight($('#server-group .cloud-search-area')) + 'px',
			serverSide: false,
			pageLength: 20,
			pagingType: 'simple_numbers',
			paging: true,
			select: {
				style: 'os',
				blurable: false,
				info: false,
				selector: 'tr td:not(.prevent)'
			},
			columns: [
				{ data: 'groupname', title: '分组名称' },
				{ data: 'operationids', title: '权限', render: renderGroupOptions },
				{ data: 'tsp', title: '更新时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime.toString() }
			],
			initComplete: initComplete
		});
		function initComplete() {
			const table = $('#group-table').DataTable();
			const groupT = new tables.Table(table);
			const groupEditRoot = $('#group-edit-modal');
			const groupAddRoot = $('#group-add-modal');

			$('#server-group-tab').on('shown.bs.tab', () => {
				groupT.refresh(true);
			});
			// 回车查询
			utils.bindEnter($('#grounp-name'), () => {
				// table.ajax.reload();
				groupT.refresh(true);
			});
			// 查询
			$('#group-search-btn').on('click', () => {
				// table.ajax.reload();
				groupT.refresh(true);
			});
			// 编辑
			$('#group-edit-btn').on('click', () => {

				const elroot = groupEditRoot.find('.operationids');
				elroot.empty();
				tables.checkLength({
					action: '编辑',
					table: table,
					name: '分组管理信息',
					unique: true,
					cb: (data) => {
						getData('', types.group).forEach(v => {
							groupEditRoot.find(v.el).val(data[v.name]);
						});
						operationList.forEach(v => {
							elroot.append(
								`<label class='checkbox-inline'>
                                    <input class='operationids' type="checkbox" value=${v.id} name='operationids' id='operation${v.id}'/>${v.opname}
                                </label>`
							);
						});
						// 给复选框 勾上默认值
						const checkedids = data.operationids.split(',');
						for (let i = 0; i < operationList.length; i++) {
							for (let j = 0; j < checkedids.length; j++) {
								if (operationList[i].id === parseInt(checkedids[j])) {
									elroot.find(`#operation${checkedids[j]}`).prop('checked', 'checked');
								}
							}
						}
						$('#group-edit-modal .checkbox-inline:first').css({ 'margin-left': '10px' });
						groupEditRoot.modal('show');

					}
				});
			});
			// 编辑模态框里的确定按钮
			$('#group-edit-submit-btn').on('click', function () {
				const result: any = validator(groupEditRoot, 'edit', types.group);
				let chkValue = [];
				$('#group-edit-modal input[name="operationids"]:checked').each(function () {
					chkValue.push($(this).val());
				});
				if (chkValue.length < 1) {
					utils.alertMessage('权限选择不能为空');
					return;
				}
				result.operationids = chkValue.join(',');
				if (result) {
					const endLoading = utils.loadingBtn($(this));
					$.ajax({
						url: 'setting/cs/groupPrivilege/update',
						type: 'POST',
						data: result,
						success: msg => {
							if (!msg.error) {
								groupEditRoot.modal('hide');
								// table.ajax.reload().draw();
								groupT.refresh();
							}
							utils.alertMessage(msg.msg, !msg.error);

						},
						complete: () => {
							// $('#account-table').DataTable().ajax.reload();
							accT.refresh();
							endLoading();
						}
					});
				}
			});
			// 添加
			$('#group-add-btn').on('click', () => {
				const elroot = groupAddRoot.find('.operationids');
				elroot.empty();
				operationList.forEach(v => {
					elroot.append(
						`<label class='checkbox-inline'>
                            <input type="checkbox" value=${v.id} name='operationids'/>${v.opname}
                        </label>`
					);
				});
				$('#group-add-modal .checkbox-inline:first').css({ 'margin-left': '10px' });
				groupAddRoot.modal('show');
			});
			// 添加模态框中的确定按钮
			$('#group-add-submit-btn').on('click', function () {
				const result: any = validator(groupAddRoot, 'add', types.group);
				let chkValue = [];
				$('#group-add-modal input[name="operationids"]:checked').each(function () {
					chkValue.push($(this).val());
				});
				if (chkValue.length < 1) {
					utils.alertMessage('权限选择不能为空');
					return;
				}
				result.operationids = chkValue.join(',');
				if (result) {
					const endLoading = utils.loadingBtn($(this));
					$.ajax({
						url: 'setting/cs/groupPrivilege/add',
						type: 'POST',
						data: result,
						success: msg => {
							if (!msg.error) {
								groupAddRoot.modal('hide');
								groupT.refresh(true);
								// table.ajax.reload();
							}
							utils.alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							accT.refresh();
							// $('#account-table').DataTable().ajax.reload();
							endLoading();
						}
					});
				}

			});
			// 删除
			const options = {
				el: $('#group-del-btn'),
				table: table,
				name: '分组管理信息',
				url: 'setting/cs/groupPrivilege/delete'
			};
			tables.delBtnClick(options);
			function clearData(groupRoot) {
				groupRoot.find('.groupname').val('');
				groupRoot.find('.operationids').val('');
			}
			groupAddRoot.on('hidden.bs.modal', () => {
				clearData(groupAddRoot);
			});
			groupEditRoot.on('hidden.bs.modal', () => {
				clearData(groupEditRoot);
			});
		}
		function renderGroupOptions(text) {
			const optionIds = text.split(',');
			const optionNames = [];
			operationList.forEach(v => {
				optionIds.forEach(m => {
					if (v.id === parseInt(m)) {
						optionNames.push(v.opname);
					}
				});
			});
			return optionNames;
		}
		function fetchGroupsData(data) {
			groups = [];
			data.rows.forEach(v => {
				let m: any = {};
				m.id = v.id;
				m.groupname = v.groupname;
				groups.push(m);
			});
			fillGroups('#account-group', true);
			fillGroups('.groupid');
		}
	}

	function initDocumentManage() {
		doctypeList.forEach(v => {
			$('.doctype').append(`<option value=${v}>${v}</option>`);
		});
		// 初始化文档管理表格
		$('#document-table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					ajax: {
						url: 'setting/cs/document/list',
						type: 'POST',
						dataSrc: data => data.rows,
						data: data => {
							return utils.cleanObject({
								docname: $.trim($('.docname').val()),
								doctype: $.trim($('.doctype').val()),
								page: tables.getPage(data),
								rows: data.length,
								sort: '',
								order: ''
							});
						}
					},
					scrollY: tables.getTabsTableHeight($('#document-manage .cloud-search-area')),
					columns: [
						{ data: 'docname', title: '文档名称' },
						{ data: 'doctype', title: '文档类型' },
						{ data: 'docsize', title: '文档大小' },
						{
							data: 'location', title: '操作', render: (locationJson: string) => {
								const uri = locationJson.startsWith('{') ? parseLocation(JSON.parse(locationJson)) : locationJson.slice(1);
								return `<a href="${uri}">下载附件</a>`;
							},
							class: 'prevent'
						},
						{ data: 'createtime', title: '创建时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime },
						{ data: 'tsp', title: '更新时间', render: utils.renderSimpleTime, width: tables.VARIABLES.width.simpleTime }
					],
					initComplete: initComplete
				}
			)
		);
		function initComplete() {
			const table = $('#document-table').DataTable();
			const docT = new tables.Table(table);
			const documentEditRoot = $('#document-edit-modal');
			const documentAddRoot = $('#document-add-modal');

			$('#document-manage-tab').on('shown.bs.tab', () => {
				docT.refresh(true);
			});
			// 回车查询
			utils.bindEnter($('.docname'), () => {
				// table.draw();
				docT.refresh(true);
			});
			// 查询
			$('#document-search-btn').on('click', () => {
				// table.draw();
				docT.refresh(true);
			});
			// 编辑
			$('#document-edit-btn').on('click', () => {
				tables.checkLength({
					action: '编辑',
					table: table,
					name: '文档管理信息',
					unique: true,
					cb: (data) => {
						documentEditRoot.modal('show');
						getData('', types.document).forEach(v => {
							documentEditRoot.find(v.el).val(data[v.name]);
						});
					}
				});
			});
			// 编辑上传
			const editUpload = new utils.Upload({
				url: 'setting/cs/document/update',
				accept: 'application/msword,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				name: 'attach',
				bindChangeEvent: false,
				ableEmpty: true,
				success: msg => {
					if (!msg.error) {
						documentEditRoot.modal('hide');
						docT.refresh();
					}
					utils.alertMessage(msg.msg, !msg.error, false);
				},
				onChange: () => {
					const editFile = editUpload.getFiles();
					if (editFile) {
						documentEditRoot.find('.attach').attr('data-text', editFile[0].name);
					}
				},
				clearCallback: () => {
					documentEditRoot.find('.attach').attr('data-text', '点击此处上传新附件(若不上传则默认使用原附件)');
				},
				complete: () => {
					enda();
				}
			});
			documentEditRoot.find('.attach').on('click', function () {
				editUpload.select();
			});
			// 编辑模态框里的确定按钮
			let enda: any;
			$('#document-edit-submit-btn').on('click', function () {
				const result: any = validator(documentEditRoot, 'edit', types.document);
				if (result) {
					enda = utils.loadingBtn($(this));
					editUpload.upload({ 'id': result.id, 'docname': result.docname });
				}
			});
			// 添加
			$('#document-add-btn').on('click', () => {
				documentAddRoot.modal('show');
			});
			const addUpload = new utils.Upload({
				url: 'setting/cs/document/add',
				accept: 'application/msword,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				name: 'attach',
				bindChangeEvent: false,
				success: msg => {
					if (!msg.error) {
						documentAddRoot.modal('hide');
						docT.refresh(true);
					}
					utils.alertMessage(msg.msg, !msg.error, false);
				},
				onChange: () => {
					const addFile = addUpload.getFiles();
					if (addFile) {
						documentAddRoot.find('.attach').attr('data-text', addFile[0].name);
					}
				},
				clearCallback: () => {
					documentAddRoot.find('.attach').attr('data-text', '点击此处上传附件');
				},
				complete: () => {
					addEnda();
				}
			});
			documentAddRoot.find('.attach').on('click', function () {
				addUpload.select();
			});
			// 添加模态框中的确定按钮
			let addEnda: any;
			$('#document-add-submit-btn').on('click', function () {
				const result: any = validator(documentAddRoot, 'add', types.document);
				if (result) {
					if (!addUpload.getFiles()) {
						utils.alertMessage('附件不能为空！');
						return;
					}
					addEnda = utils.loadingBtn($(this));
					addUpload.upload({ 'docname': result.docname });
				}
			});
			documentAddRoot.on('hidden.bs.modal', () => {
				documentAddRoot.find('.docname').val('');
			});
			// 删除
			const options = {
				el: $('#document-del-btn'),
				table: table,
				name: '文档管理信息',
				url: 'setting/cs/document/delete'
			};
			tables.delBtnClick(options);
		}
	}

	function updateGroups() {
		return $.get('setting/qucikReply/queryQRGroup')
			.then(res => updateCommonGroups(res.msg));
	}



	function initCommonManage() {
		updateGroups()
			.then(() => {
				const table = new newTable.Table({
					el: $('#common-table'),
					options: {
						ajax: {
							url: 'setting/qucikReply/queryQuickReply',
							dataSrc: res => res.msg,
							data: () => {
								return {
									groupId: $('#common-group').val()
								};
							}
						},
						select: false,
						scrollY: tables.getTabsTableHeight($('#common-manage .cloud-search-area')),
						columns: [{
							title: '常用语',
							data: 'content'
						}, {
							title: '分组',
							data: 'qrGroup.content'
						}, {
							title: '操作',
							data: 'id',
							width: '80px',
							render: (id) => {
								return `
								<a href="javascript:;" data-id="${id}" class="common-edit-btn">编辑</a>
								<a href="javascript:;" data-id="${id}" class="common-delete-btn">删除</a>
								`;
							}
						}],
						initComplete: () => commonManageInitComponent(table)
					}
				});
			});
	}

	function commonManageInitComponent(t: newTable.Table) {
		const dt = t.dt;
		let activeRow;
		let activeGroup;
		$('#common-table').on('click', '.common-edit-btn', (e) => {
			activeRow = dt.row($(e.currentTarget).closest('tr')).data();
			$('#common-edit-input').val(activeRow.content);
			$('#common-edit-group').val(activeRow.qrGroup.id);
			$('#common-edit-modal').modal('show');
		})
			.on('click', '.common-delete-btn', (e) => {
				const id = $(e.currentTarget).data('id');
				utils.confirmModal({
					msg: '确认删除选中常用语吗？',
					cb: (modal, btn) => {
						const end = utils.loadingBtn(btn);
						$.ajax('setting/qucikReply/deleteQucikReply', {
							method: 'POST',
							data: {
								replyId: id
							}
						})
							.done((res) => {
								if (!res.error) {
									modal.modal('hide');
									t.reload();
								}
							})
							.always(() => end());
					}
				});
			});


		$('#common-add-btn').on('click', () => {
			$('#common-add-modal').modal('show');
		});

		$('#common-search-btn').on('click', () => {
			t.reload(true);
		});

		$('#common-group-submit-btn').on('click', () => {
			const input = $('#common-group-input').val().trim();
			if (!input) {
				utils.alertMessage('请输入分组名称');
				return;
			}
			const end = utils.loadingBtn($('#common-group-submit-btn'));

			$.ajax('setting/qucikReply/addOrUpdateQRGroup', {
				method: 'POST',
				data: {
					content: input
				}
			})
				.done(res => {
					utils.alertMessage(res.msg, !res.error);
					if (!res.error) {
						$('#common-group-input').val('');
						updateGroups();
					}
				})
				.always(() => end());
		});

		$('#common-group-table').on('click', '.common-group-delete-btn', (e) => {
			const id = $(e.currentTarget).data('id');
			utils.confirmModal({
				msg: '确定要删除选中分组吗？',
				cb: (modal, btn) => {
					const end = utils.loadingBtn(btn);
					$.ajax('setting/qucikReply/deleteQRGroup', {
						method: 'POST',
						data: {
							groupId: id
						}
					})
						.done(res => {
							if (!res.error) {
								modal.modal('hide');
								updateGroups();
							}
							utils.alertMessage(res.msg, !res.error);
						})
						.always(() => end());
				}
			});
		})
			.on('click', '.common-group-edit-btn', (e) => {
				const { content, id } = $(e.currentTarget).data();

				activeGroup = id;
				$('#common-group-edit-input').val(content);
				$('#common-group-edit-modal').modal('show');
			});

		$('#common-group-edit-submit-btn').on('click', (e) => {
			const content = $('#common-group-edit-input').val().trim();
			if (!content) {
				utils.alertMessage('请输入分组名称');
				return;
			}
			const end = utils.loadingBtn($(e.currentTarget));
			$.ajax('setting/qucikReply/addOrUpdateQRGroup', {
				method: 'POST',
				data: {
					groupId: activeGroup,
					content
				}
			})
				.done(res => {
					if (!res.error) {
						$('#common-group-edit-modal').modal('hide');
						updateGroups();
					}
					utils.alertMessage(res.msg, !res.error);
				})
				.always(() => end());
		});
		$('#common-edit-submit-btn').on('click', () => {
			const content = $('#common-edit-input').val().trim(),
				groupId = $('#common-edit-group').val();
			if (!content || !groupId) {
				return;
			}

			const end = utils.loadingBtn($('#common-edit-submit-btn'));
			$.ajax('setting/qucikReply/addOrUpdateQucikReply', {
				method: 'POST',
				data: {
					replyId: activeRow.id,
					groupId,
					content
				}
			})
				.always(() => end())
				.done(res => {
					$('#common-edit-input').val('');
					$('#common-edit-group').find('option:first').prop('selected', true);
					$('#common-edit-modal').modal('hide');
					t.reload();
				});
		});

		$('#common-add-submit-btn').on('click', () => {
			const content = $('#common-add-input').val().trim(),
				groupId = $('#common-add-group').val();
			if (!content || !groupId) {
				utils.alertMessage('常用语或分组不能为空');
				return;
			}

			const end = utils.loadingBtn($('#common-add-submit-btn'));
			$.ajax('setting/qucikReply/addOrUpdateQucikReply', {
				method: 'POST',
				data: {
					groupId,
					content
				}
			})
				.always(() => end())
				.done(res => {
					$('#common-add-input').val('');
					$('#common-add-group').find('option:first').prop('selected', true);
					$('#common-add-modal').modal('hide');
					t.reload();
				});

		});

		$('#common-group-btn').on('click', () => {
			$('#common-group-modal').modal('show');
		});
	}


	function updateCommonGroups(commonGroups) {
		const el = $('#common-group');
		const lastVal = el.val();
		const tbody = $('#common-group-table');
		el.empty();
		tbody.empty();
		el.append('<option value="">全部</option>');
		const groupsHtml = commonGroups.map(v => {
			tbody.append(`
				<tr>
					<td>${v.content}</td>
					<td>
						<a href="javascript:;" data-id="${v.id}" data-content="${v.content}" class="common-group-edit-btn">编辑</a>
						<a href="javascript:;" data-id="${v.id}" class="common-group-delete-btn">删除</a>
					</td>
				</tr>
				`);
			return `<option value="${v.id}">${v.content}</option>`;
		}).join('');

		$('#common-add-group').html(groupsHtml);
		$('#common-edit-group').html(groupsHtml);

		el.append(groupsHtml);


		if (lastVal) {
			el.val(lastVal);
		}
	}
    /**
     *
     * 给select添加分组的option选项
     * @param {any} el 被添加的select的id或样式
     * @param {any} [selectedOption] 被选中的option标识符（编辑模态框初始化的时候使用）
     */
	function fillGroups(el, total: boolean = false) {
		let html = total ? '<option value="">全部分组</opton>' : '';
		groups.forEach(v => {
			html += `<option value=${v.id}>${v.groupname}</opton>`;
		});

		$(el).html(html);
	}

    /**
     *
     * @param {any} el 要进行表单验证的modal框
     * @param {any} msg 用于区分要过滤那个表单元素的标识符
     * @returns 如果表单校验不通过，返回值为空；表单校验通过，则返回将要传个后台的数据
     */
	function validator(el, msg, type?: types) {
		let currentData = [];
		if (!type) {
			if (msg === 'add') {
				currentData = getData('.id');
			} else if (msg === 'edit') {
				currentData = getData();
			}
		}
		if (type === types.group) {
			if (msg === 'add') {
				currentData = getData('.id', type);
			} else if (msg === 'edit') {
				currentData = getData('', type);
			}
		}
		if (type === types.document) {
			if (msg === 'add') {
				currentData = getData('.id', type);
			} else if (msg === 'edit') {
				currentData = getData('', type);
			}
		}
		let ajaxData = {};
		for (let v of currentData) {
			const input = el.find(v.el);
			const val = $.trim(input.val());
			const name = input.parent().prev().text();
			// 如果是编辑模块 则对密码校验时 若不为空，则进行正则校验；  而如果是添加模块 则需要进行为空和正则校验
			if (v.name === 'password' && msg === 'edit') {
				if (val !== '') {
					if (v.pattern && !v.pattern.test(val)) {
						if (val.length < 6) {
							utils.alertMessage('密码格式不正确，至少为6个字符！');
							return false;
						} else if (val.length > 16) {
							utils.alertMessage('密码格式不正确，最多16个字符！');
							return false;
						} else {
							utils.alertMessage(`${v.patternMsg ? name + '的格式不正确！' + v.patternMsg : name + '的格式不正确！'}`);
							return false;
						}
					}
				}
			} else {
				if (v.require && val === '') {
					utils.alertMessage(`${name}的值不能为空`);
					return false;
				}
				if (!v.require && val !== '' && v.pattern && !v.pattern.test(val) || v.require && v.pattern && !v.pattern.test(val)) {
					utils.alertMessage(`${v.patternMsg ? name + '的格式不正确！' + v.patternMsg : name + '的格式不正确！'}`);
					return false;
				}
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
	function getData(filter?: string, type?: types) {
		// 页面中各个表单里通用的表单域值及其相关信息
		let data: [IDataAssociations];
		if (type === types.account || !type) {
			data = [
				{
					name: 'id',
					require: true,
					el: '.id'
				},
				{
					name: 'groupid',
					require: true,
					el: '.groupid'
				},
				{
					name: 'username',
					require: true,
					el: '.username'
				},
				{
					name: 'password',
					pattern: /^\w{6,16}$/,
					patternMsg: '（密码由6~16位字母、数字或下划线组成）',
					require: true,
					el: '.password'
				},
				{
					name: 'alias',
					require: true,
					el: '.alias'
				},
				{
					name: 'mobile',
					pattern: /(((\+86)|(86))?(1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}))|((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))/,
					require: false,
					el: '.mobile'
				},
				{
					name: 'email',
					pattern: /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
					require: false,
					el: '.email'
				},
				{
					name: 'deleted',
					require: false,
					el: '.deleted'
				}
			];
		}

		if (type === types.group) {
			data = [
				{
					name: 'id',
					require: true,
					el: '.id'
				},
				{
					name: 'groupname',
					require: true,
					el: '.groupname'
				}
			];
		}
		if (type === types.document) {
			data = [
				{
					name: 'id',
					require: true,
					el: '.id'
				},
				{
					name: 'docname',
					require: true,
					el: '.docname'
				}
			];
		}
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
	/* 头像裁剪 */
	function initCorpper() {
		const cropper = $('#cropper-image').cropper({
			aspectRatio: 1,
			viewMode: 1,
			dragMode: 'move',
			preview: '.cropper-preview',
			minContainerHeight: 400,
			zoomOnTouch: false
		});
		let headEl: JQuery;
		$('.account').on('click', '.cropper', function () {
			const el = $('<input type="file" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" />');
			headEl = $(this);
			el.one('change', function () {
				if (!this.value || !this.files || this.files.length !== 1) {
					return;
				}
				const file = this.files[0];
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = (e) => {
					showCropper();
					cropper.cropper('replace', (e.currentTarget as any).result);
				};
			});

			el.click(); // IE弹窗会阻塞页面,一定要放在绑定事件之后

		});

		$('#cancel-btn').on('click', hideCropper);

		$('#crop-btn').on('click', () => {
			if (!headEl) {
				return;
			}
			const loading = utils.loadingBtn($('#crop-btn'));
			cropper.cropper('getCroppedCanvas', {
				width: 80,
				height: 80
			}).toBlob((blob) => {
				const data = new FormData(),
					elData = headEl.data();
				data.append(elData.name, blob);
				$.ajax({
					url: elData.url,
					type: 'POST',
					data: data,
					processData: false,
					contentType: false,
					success: (msg) => {
						if (!msg.error) {
							headEl.prop('src', msg.msg);
							/* if (elData.changeHeadSrc) {
								$('.cloud-heading-image').prop('src', msg.msg);
							} */
							hideCropper();
							utils.alertMessage('修改成功', true);
						}
						else {
							utils.alertMessage(msg.msg);
						}
					},
					complete: () => {
						loading();
					}
				});
			});
		});
	}

	function showCropper() {
		$('.box1').hide();
		modalFlag === 'add' ? $('#account-add-modal').hide() : $('#account-edit-modal').hide();
		$('#cropper-wrap').show();
	}

	function hideCropper() {
		$('.box1').show();
		modalFlag === 'add' ? $('#account-add-modal').show() : $('#account-edit-modal').show();
		$('#cropper-wrap').hide();
	}

}
