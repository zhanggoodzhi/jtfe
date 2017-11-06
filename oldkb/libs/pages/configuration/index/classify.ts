import * as utils from 'utils';
import * as tables from 'tables';
import {SelectTree, Tree} from 'tree';

export function initClassify() {
	new Tree({
		el: $('#classify-tree'),
		data: [],
		ready: function () {
			const tree = this;

			const parentTree = new SelectTree({
				el: $('#parent-node'),
				data: [],
				placeholder: '选择父级'
			});

			parentTree.el.on('refresh.jstree', () => {
				parentTree.tree.open_all();
			});

			this.el.on('refresh.jstree', () => {
				this.tree.open_all();
			});

			initTable(tree, parentTree);
		}
	});

}
function initTable(tree: Tree, parentTree: Tree) {
	new tables.Table({
		el: $('#classify-table'),
		options: {
			ajax: {
				url: '/api/directory/template/list',
				dataSrc: d => {
					const data = parseClassifyTreeData(d);
					parentTree.data = data;
					tree.data = data;
					return d;
				}
			},
			paging: false,
			serverSide: false,
			select: tables.getSelectConfigObject('single'),
			rowId: 'directoryId',
			columns: [
				{ data: 'directoryId', title: 'ID' },
				{ data: 'directoryName', title: '分类名称' },
				{ data: 'templateList', title: '关联模板', render: renderTemplate },
				{ data: 'directoryId', title: '操作', render: renderAction, className: 'prevent', width: '100px' }
			]
		},
		initComplete: function () {
			enum classifyType {
				add,
				edit
			}

			const modal = $('#classify-modal'),
				dt = this.dt;

			const getData = () => {
				const name = ($('#classify-name').val() as string).trim(),
					parentId = parentTree.selected as any,
					templateIds = $('#related-module').val() as string;

				if (name === '') {
					utils.toast('分类名称不能为空');
				}
				else if (templateIds.length <= 0) {
					utils.toast('关联模板不能为空');
				}
				else {
					return {
						directoryName: name,
						parentDirectoryId: parentId.id || null,
						templateIds: templateIds
					};
				}
			};


			let type: classifyType, directoryId: string = null;

			const resetModal = (data?) => {
				const select = $('#related-module'),
					t = parentTree.tree;

				t.enable_node($('.jstree-disabled').toArray());

				if (!data) {
					$('#classify-name').val('');
					parentTree.selected = [];
					select.val([]);
					directoryId = null;
				} else {
					const dId = data.directoryId,
						disabled = t.get_json(dId, { flat: true } as any).map(v => v.id);

					$('#classify-name').val(data.directoryName);
					parentTree.selected = data.parentDirectoryId;
					select.val(data.templateList ? data.templateList.map(v => v.id) : []);
					directoryId = dId;

					t.disable_node(disabled);
				}
				select.material_select();
			};

			modal.modal();

			$('#add-clissify-btn').on('click', () => {
				resetModal();
				modal.find('.modal-header>h5').html('添加分类');
				modal.modal('open');
				type = classifyType.add;
			});

			$('#classify-modal .kb-yes-btn').on('click', (e) => {
				const data = getData();
				if (!data) {
					return;
				}
				const end = utils.btnLoading($(e.currentTarget));

				switch (type) {
					case classifyType.add:
						$.ajax('/api/directory/template/add', {
							method: 'POST',
							contentType: 'application/json',
							data: JSON.stringify(data)
						})
							.done(res => {
								modal.modal('close');
								this.reload();
							})
							.always(() => {
								end();
							});
						break;
					case classifyType.edit:
						if (directoryId !== null) {
							Object.assign(data, {
								directoryId: directoryId
							});
							$.ajax('/api/directory/template/update', {
								method: 'PUT',
								contentType: 'application/json',
								data: JSON.stringify(data)
							})
								.done(res => {
									modal.modal('close');
									this.reload();
								})
								.always(() => {
									end();
								});
						}
						break;
					default:
						break;
				}
			});

			this.el.on('user-select.dt', () => {
				setTimeout(() => {
					const selected = this.selectedData,
						t = tree.tree;
					t.deselect_all(true);

					if (selected && selected.length > 0) {
						t.select_node(selected[0].directoryId, true);
					}
				}, 0);
			})
				.on('click', '.kb-icon', (e) => {
					const el = $(e.currentTarget);
					const data = dt.row(el.closest('tr')).data() as any;
					switch (el.data('action')) {
						case 'create':
							resetModal(data);
							modal.find('.modal-header>h5').html('编辑分类');
							modal.modal('open');
							type = classifyType.edit;
							break;
						case 'delete':
							deleteClassify(data, this);
							break;
						default:
							break;
					}
				});

			tree.el.on('select_node.jstree', () => {
				const selectedTree: any = tree.selected;

				if (this.isSelected()) {
					dt.rows().deselect();
				}

				if (selectedTree) {
					dt.row('#' + selectedTree.id).select();
				}
			})
				.on('deselect_node.jstree', () => {
					if (this.isSelected()) {
						dt.rows().deselect();
					}
				});
		}
	});
}


function deleteClassify(data, table: tables.Table) {
	utils.confirmModal(`确认删除 「${data.directoryName}」分类吗?`, (remove, end) => {
		$.ajax('/api/directory/delete?' + $.param({directoryId: data.directoryId}), {
			method: 'DELETE'
		})
			.done(() => {
				table.reload();
				remove();
			})
			.always((jqXHR, textStatus) => {
				if (jqXHR.status === 500) {
					const d = jqXHR.responseJSON;
					if (d !== '' && d.message) {
						utils.toast(d.message);
					}
				}
				end();
			});
	});
}


function renderTemplate(list) {
	if (!list) {
		return '无';
	}

	return list.map(v => v.name).join(',');
}


function parseClassifyTreeData(data) {
	return data.map(v => {
		return {
			id: v.directoryId,
			parent: v.parentDirectoryId === null ? '#' : v.parentDirectoryId,
			text: v.directoryName
		};
	});
}


function renderAction(id: number) {
	return `<i class='kb-icon' data-action='create'></i><i class='kb-icon' data-action='delete'></i>`;
}
