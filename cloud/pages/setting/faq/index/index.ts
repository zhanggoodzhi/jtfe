import * as utils from 'utils';
import 'new-table';
import * as tables from 'tables';
import 'time';
import 'tree';
import './index.less';
namespace FaqIndex {
	enum MenuState {
		add,
		edit
	}
	$(() => {
		init();
	});
	let commonT: tables.Table;
	let menuT: tables.Table;

    /**
     * 常见问题栏
     *
     * @class CommonQuestionPage
     */
	class CommonQuestionPage {
		constructor() {
			this.init();
		}
		init() {
			const width = tables.VARIABLES.width;
			$('#common-question-table').DataTable(Object.assign(
				tables.commonConfig(),
				{
					ajax: {
						url: 'setting/faq/frequentQuestion/list',
						type: 'POST',
						dataSrc: data => data.rows,
						data: (data) => {
							return utils.cleanObject({
								keyword: $.trim($('#q-keyword').val()),
								generalMenuId: $('#q-menu').val(),
								faq: $('#q-state').val(),
								page: tables.getPage(data),
								rows: data.length,
								sort: '',
								order: ''
							});
						}
					},
					scrollY: tables.getTabsTableHeight($('#common-question .cloud-search-area')),
					columns: [
						{ name: 'question', data: 'question', title: '问题', createdCell: tables.createAddTitle },
						{ name: 'answer', data: 'answer', title: '答案', createdCell: tables.createAddTitle },
						{ name: 'classify', data: 'classify', title: '分类', width: 4 * width.char },
						{ name: 'faq', data: 'faq', title: '状态', render: (faq) => faq ? '已开放' : '已关闭', width: width.minimum },
						{ name: 'createtime', data: 'createtime', title: '创建时间', render: utils.renderSimpleTime, width: width.simpleTime }
					],
					initComplete: this.initComplete
				}
			));
		}

		initComplete = () => {
			const table = $('#common-question-table').DataTable();
			commonT = new tables.Table(table);
			$('#common-question-tab').on('shown.bs.tab', () => {
				commonT.refresh(true);
			});
			$('#common-question-search-btn').on('click', () => {
				// table.draw();
				commonT.refresh(true);
			});
			utils.bindEnter($('#q-keyword'), () => { commonT.refresh(true); });
			// tables.bindEnter(table, $('#q-keyword'));

			bindUpdateQuestion(table, $('#common-question-open-btn'), '开放', '已关闭', false);
			bindUpdateQuestion(table, $('#common-question-close-btn'), '关闭', '已开放', true);
		}
	}


	class MenuManagePage {
		private state: MenuState;
		constructor() {
			this.init();
		}
		init() {
			const width = tables.VARIABLES.width;
			$('#menu-manage-table').DataTable(Object.assign(
				tables.commonConfig(),
				{
					ajax: {
						url: 'setting/faq/generalMenu/list',
						type: 'POST',
						dataSrc: data => {
							const d = data.rows;
							selectData.generalMenus = d;
							fillSelect();
							return d;
						},
						data: (data) => {
							return utils.cleanObject({
								keyword: $.trim($('#m-keyword').val()),
								sort: '',
								order: ''
							});
						}
					},
					serverSide: false,
					scrollY: tables.getTabsTableHeight($('#menu-manage .cloud-search-area')),
					columns: [
						{ name: 'name', data: 'name', title: '菜单名称' },
						{ name: 'gmDesc', data: 'gmDesc', title: '描述' },
						{ name: 'index', data: 'index', title: '优先级', width: width.minimum }
					],
					initComplete: this.initComplete
				}
			));
		}

		initComplete = () => {
			const table = $('#menu-manage-table').DataTable(),
				tree = new utils.Tree({
					el: $('#relationship-select'),
					data: utils.formatClassify(selectData.classifys),
					multiple: true,
					selected: false,
					selectAllClear: false
				}),
				dataList = [
					{ el: '#menu-name', param: 'name', require: true, default: '' },
					{ el: '#menu-number', param: 'index', require: true, default: '1' },
					{ el: '#menu-description', param: 'gmDesc', require: true, default: '' }
				]/*,
                reafresh = () => { table.ajax.reload().draw(); }*/;
			menuT = new tables.Table(table);
			let selectedId;


			$('#menu-manage-tab').on('shown.bs.tab', () => {
				menuT.refresh(true);
			});

			tables.delBtnClick({
				name: '菜单',
				table: table,
				url: 'setting/faq/generalMenu/delete',
				el: $('#menu-manage-del-btn')
			});

			$('#menu-manage-search-btn').on('click', () => { menuT.refresh(true); });

			$('#menu-manage-add-btn').on('click', () => {
				$('#relationship-select').text('');
				$('#menu-modal').modal('show')
					.find('.modal-title').text('添加菜单');
				this.state = MenuState.add;
			});

			$('#menu-manage-edit-btn').on('click', () => {
				tables.checkLength({
					action: '编辑',
					name: '菜单',
					table: table,
					cb: (data) => {
						const currentData = data,
							id = currentData.id,
							endLoading = utils.loadingBtn($('#menu-manage-edit-btn'));
						$.ajax({
							url: 'setting/faq/faqMenu/list',
							type: 'POST',
							data: {
								generalMenuId: id
							},
							success: (msg) => {
								if (!msg.error) {
									$('#menu-modal').modal('show')
										.find('.modal-title').text('编辑菜单');
									this.state = MenuState.edit;
									selectedId = [id].toString();
									for (let v of dataList) {
										$(v.el).val(currentData[v.param]);
									}
									tree.selected = msg.msg;
								}
							},
							complete: () => {
								endLoading();
							}

						});
					}
				});
			});

			$('#menu-save-btn').on('click', () => {
				let url: string;

				const data: any = {};
				for (let v of dataList) {
					const el = $(v.el),
						val = $.trim(el.val());
					if (val === '' && v.require) {
						utils.alertMessage(`${el.parent().prev('.cloud-input-title').text()}不能为空`);
						return;
					}
					data[v.param] = val;
				}
				if (!$('#relationship-select').text()) {
					utils.alertMessage('映射关系不能为空！');
					return;
				}
				Object.assign(data, { parentId: '0', classifyIds: tree.selected.join(',') });
				let bool;
				switch (this.state) {
					case MenuState.add:
						url = 'setting/faq/generalMenu/add';
						bool = true;
						break;
					case MenuState.edit:
						if (selectedId && data.parentId !== selectedId) {
							url = 'setting/faq/generalMenu/update';
							bool = false;
							data.id = selectedId;
						}
						else {
							utils.alertMessage('不能选择自身为父级菜单');
							return;
						}
						break;
					default:
						return;
				}
				const endLoading = utils.loadingBtn($('#menu-save-btn'));
				$.ajax({
					url: url,
					type: 'POST',
					data: data,
					success: (msg) => {
						utils.alertMessage(msg.msg, !msg.error);
						if (!msg.error) {
							$('#menu-modal').modal('hide');
							menuT.refresh(bool);
							// reafresh();
						}
					},
					complete: () => {
						endLoading();
					}
				});
			});

			utils.bindEnter($('#m-keyword'), () => { menuT.refresh(true); });

			$('#menu-modal').one('shown.bs.modal', () => {
				tree.adjustWidth();
			});
			$('#menu-modal').on('hidden.bs.modal', () => {
				for (let v of dataList) {
					$(v.el).val(v.default);
				}
				tree.clear();
				selectedId = null;
			});
		}
	}

    /*function updateParentMenu(data, selectId) {
        let html = "";
        data.forEach(v => {
            html += `<option value="${v.id}" ${selectId === v.id ? "selected" : ""}>${v.text}</option>`;
        });
        $("#parent-menu").html(html);
    }*/

    /*    function formateTreeDate(filter?): utils.ITreeData[] {
            // const data = table.rows().data().toArray(),
            const data = selectData.generalMenus,
                d: utils.ITreeData[] = [{
                    parent: "#",
                    id: "0",
                    text: "根节点"
                }];
            data.forEach(v => {
                d.push({
                    parent: v.parent,
                    id: v.id,
                    text: v.name
                });
            });

            if (filter !== undefined) {
                return utils.filterChild({
                    data: d,
                    id: filter
                });
            }

            return d;
        }*/


	function init() {
		fillSelect();
		new CommonQuestionPage();

		$('#menu-manage-tab').one('shown.bs.tab', () => {
			new MenuManagePage();
		});
	}


    /**
     *
     * 关闭和开放功能
     * @param {any} table DataTable
     * @param {JQuery} btn 按钮元素用于Loading
     * @param {string} action 提示=>操作
     * @param {string} status 提示=>状态
     * @param {boolean} faqStatus 操作的状态并根据状态过滤
     */
	function bindUpdateQuestion(table, btn: JQuery, action: string, status: string, faqStatus: boolean) {
		btn.on('click', () => {
			tables.checkLength({
				action: action,
				name: '常见问题',
				table: table,
				unique: false,
				cb: (data) => {
					const d: number[] = [];
					for (let v of data) {
						if (v.faq === faqStatus) {
							d.push(v.pid);
						}
					}

					if (d.length < 1) {
						utils.alertMessage(`请选择${status}状态的推荐问题`);
						return;
					}

					updateQuestion(table, btn, d.join(','));
				}
			});
		});
	}


	function updateQuestion(table, btn: JQuery, pids: string) {
		const endLoading = utils.loadingBtn(btn);
		const t = new tables.Table(table);
		$.ajax({
			url: 'setting/faq/frequentQuestion/update',
			type: 'POST',
			data: {
				pids: pids
			},
			success: (msg) => {
				utils.alertMessage(msg.msg, !msg.error);
				if (!msg.error) {
					t.refresh();
					// table.draw(false);
				}
			},
			complete: () => {
				endLoading();
			}
		});
	}

	function fillSelect() {
		let html = '<option value="">全部</option>';
		const generalMenus = selectData.generalMenus;
		if (generalMenus.length > 0) {
			for (let v of generalMenus) {
				html += `<option value=${v.id}>${v.name}</option>`;
			}
		}

		$('#q-menu').html(html);
	}
}

