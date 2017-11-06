declare const dialogid: any;
import './index.less';
import 'new-table';
import { getPage, createAddTitle, getTableHeight, simpleConfig } from 'tables';
// import { alertMessage, ClassifyTree, cleanObject, CommonDate, bindInput, addLoadingBg, bindEnter, confirmModal, formatText, getMinContentHeight } from 'utils';
import * as utils from 'utils';
import 'tree';
// import 'editor';
import 'daterangepicker';

namespace dialogUpdate {
	interface IUpdateParam {
		id: number;
		expectword?: string;
		content?: string;
		pairId?: number;
	}
	let tableRowSelected;
	let date: utils.CommonDate, target, tree: JSTree, classify: utils.ClassifyTree;

	const answer = $('#answer-area'),
		question = $('#question');

	// const classify: utils.ClassifyTree = initClassify();

	const defaultQuestion = '默认问题',
		defaultAnswer = '默认回复';

	$(function () {
		initTree();
		initCorpus();
	});

	function getTreeData(cb: Function) {
		$.ajax({
			type: 'POST',
			url: 'knowledge/dialog/getDetail',
			data: {
				id: dialogid
			},
			success: (msg) => {
				const data = msg.rows,
					treeData = data.map(function (v) {
						const d: any = {
							id: v.id,
							qId: v.expectWord.id,
							parent: v.parent,
							text: v.expectWord.literal,
							plainText: v.content.plainText,
							// contentHtml: v.content.contentHtml,
							fromServer: true,
							synedPairId: v.synedPairId
						};
						d.current = Object.assign({}, d);
						if (!v.parent) {
							d.parent = '#';
							d.state = {
								'selected': true
							};
						}
						return d;
					});
				if (data.length > 0) {
					$('#select-character').val(data[0].character.id);
				}
				cb(treeData);
			}
		});
	}

	function initTree() {
		let endLoadTree = null,
			endLoadTable = null;
		$(document).ajaxStart(() => {
			if (!endLoadTree) {
				endLoadTree = loadTree();
			}
			if (!endLoadTable) {
				endLoadTable = loadTable();
			}
		});

		$(document).ajaxComplete(() => {
			if (endLoadTree) {
				endLoadTree();
				endLoadTree = null;
			}
			if (endLoadTable) {
				endLoadTable();
				endLoadTable = null;
			}
		});

		getTreeData((treeData) => {
			// $('#tree').height('auto');
			$('#tree').jstree({
				'core': {
					'data': treeData,
					'strings': {
						'Loading ...': '加载中...'
					},
					'animation': 100,
					'themes': {
						'icons': false
					},
					'check_callback': true,
					'multiple': false
				},
				'dnd': {
					'large_drag_target': true
				},
				'contextmenu': {
					'items': {
						'create': {
							'separator_before': false,
							'separator_after': true,
							'_disabled': false,
							'label': '新建',
							'action': treeAddAction
						},
						'rename': {
							'separator_before': false,
							'separator_after': false,
							'_disabled': false,
							'label': '重命名',
							'action': (data) => {
								const inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								inst.edit(obj);
							}
						},
						'remove': {
							'separator_before': false,
							'icon': false,
							'separator_after': false,
							'_disabled': false,
							'label': '删除',
							'action': (data) => {
								const inst = $.jstree.reference(data.reference),
									obj = inst.get_node(data.reference);
								if (obj.parent === '#') {
									utils.alertMessage('无法删除根节点!');
									return;
								}
								utils.confirmModal({
									msg: '确认删除选中问题吗？',
									cb: (modal, btn) => {
										const end = utils.loadingBtn(btn);

										$.ajax({
											type: 'POST',
											url: 'knowledge/dialog/update/removeNode',
											data: {
												id: obj.id
											},
											success: function (msg) {
												if (!msg.error) {
													if (inst.is_selected(obj)) {
														inst.delete_node(inst.get_selected());
													}
													else {
														inst.delete_node(obj);
													}
													tree.deselect_all();
													tree.select_node(obj.parent);
													modal.modal('hide');
												} else {
													utils.alertMessage(msg.msg);
												}
											},
											complete: () => {
												end();
											}
										});
									}
								});
							}
						}
					}
				},
				'types': {
					'#': {
						'max_children': 1
					}
				},
				'plugins': ['dnd', 'contextmenu', 'types', 'conditionalselect', 'unique'],
				'conditionalselect': checkLeave
			})
				.on('changed.jstree', updateContent)
				.on('rename_node.jstree', updateName)
				// .on('delete_node.jstree', deleteNode)
				.on('move_node.jstree', moveNode)
				.one('ready.jstree', treeInitComplete);

			question.on('input', () => rename(question.val().trim()));
			answer.on('input', () => updateContentData(answer.val().trim()));
		});


	}

	function refreshTree() {
		getTreeData((treeData) => {
			(tree as any).settings.core.data = treeData;
			tree.refresh(true, null);
		});
	}

	function rename(val) {
		const data = tree.get_selected(true)[0];
		data.original.current.text = val;
		tree.rename_node(data.id, val);
	}

	// function initEditor() {
	// 	const e = new Editor({
	// 		el: $('#editor'),
	// 		onChange: updateContentData
	// 	});
	// 	editor = e.editorElement;
	// }

	function updateContentData(val) {
		const data = tree.get_selected(true)[0].original.current;
		if (data.plainText !== val) {
			data.plainText = val;
		}
		// if (data.contentHtml !== html) {
		// 	data.contentHtml = html;
		// 	data.plainText = formatText(html);
		// }
	}

	function updateName(e, text) {
		const q = question,
			t = $.trim(q.val());
		if (t === text.text) {
			return;
		}
		tree.get_selected(true)[0].original.current.text = text.text;
		q.val(text.text);
	}

	function updateContent(e, t) {
		if (!tree) {
			return;
		}
		const data = tree.get_selected(true);
		if (data.length !== 1) {
			return;
		}
		const d = data[0].original.current;
		const text = d.text,
			val = d.plainText || '';

		// html = d.contentHtml ? d.contentHtml : '<p><br/></p>';

		// checkAble(d);

		// if (question.val() === text && answer.val() === val) {
		// 	return;
		// }

		question.val(text);
		answer.val(val);
		// editor.$txt.html(html);
	}
	function deleteNode(node, parent) {
		const id = parent.node.original.current.id;
		if (id) {
			$.ajax({
				type: 'POST',
				url: 'knowledge/dialog/update/removeNode',
				data: {
					id: id
				},
				success: function (msg) {
					if (msg.error) {
						utils.alertMessage(msg.msg);
					}
				}
			});
		}
	}

	function initEditForm() {
		$('.edit-form').show();
		initSave();
	}

	function moveNode(node, parent, position, oldParent) {
		const nodeEl = parent.node;
		tree.deselect_all();
		tree.select_node(nodeEl.id);
		tree.open_node(parent.parent);
		$.ajax({
			url: 'knowledge/dialog/update/moveNode',
			type: 'POST',
			data: {
				id: nodeEl.id,
				parentId: nodeEl.parent
			},
			success: (msg) => {
				utils.alertMessage(msg.msg, !msg.error);
				if (msg.error) {
					refreshTree();
				}
			},
			error: refreshTree
		});
	}

	function initSave() {
		$('#submit-btn').on('click', function () {
			const origin = tree.get_selected(true)[0].original,
				data = origin.current,
				expectword = question.val().trim(),
				content = answer.val().trim(),
				d = {
					id: data.id
				};

			if (expectword === defaultQuestion || content === defaultAnswer) {
				utils.alertMessage(`问题或回复不能为${defaultQuestion}和${defaultAnswer}`);
				return;
			}

			if (expectword === origin.plainText && content === origin.text) {
				utils.alertMessage('问题或回复未发生改动');
				return;
			}



			if (tableRowSelected && tableRowSelected.pairId /*&& selected.id*/) {
				Object.assign(d, {
					pairId: tableRowSelected.pairId
				});
				save(d);
			}
			else {
				Object.assign(d, {
					expectword,
					content
				});
				save(d);
				// if (data.qId && data.synedPairId !== 1) {
				// 	checkDialog(d, data.qId);
				// }
				// else {
				// 	save(d);
				// }
			}

		});
	}

	function save(data) {
		const d = tree.get_selected(true)[0].original;

		$.ajax({
			url: 'knowledge/dialog/update/modifyNode',
			type: 'POST',
			data: data,
			success: (msg) => {
				utils.alertMessage(msg.msg, !msg.error);
				console.log(d);
				if (!msg.error) {
					// d.current.synedPairId = synedPairId;
					Object.assign(d, d.current);
				}
				else {
					refreshTree();
				}
			},
			error: refreshTree
		});
	}

	function checkDialog(data, qid) {
		$.ajax({
			url: 'knowledge/dialog/update/isExistPm',
			type: 'POST',
			data: {
				qid: qid
			},
			success: (msg) => {
				if (!msg.error) {
					if (msg.msg === true) {
						utils.confirmModal({
							msg: '对话模型的问题已经被修改,是否希望在语料库中继续保留之前的问答对及复述',
							text: '保留',
							className: 'btn-primary',
							cb: (modal, btn) => {
								modal.modal('hide');
								save(data);
							},
							cancelText: '不保留',
							cancel: (modal, btn) => {
								modal.modal('hide');
								Object.assign(data, { delFlag: 1 });
								save(data);
							}
						});
					}
					else {
						save(data);
					}
				}
			}
		});
	}

	function treeAddAction(data) {
		const inst = $.jstree.reference(data.reference),
			obj = inst.get_node(data.reference);
		if (!checkLeave(Object.assign({}, obj, { id: null }))) {
			return;
		}
		for (let i of obj.children) {
			const d = tree.get_node(i).original.current;
			if (d.text === defaultQuestion || d.plainText === defaultAnswer) {
				tree.deselect_all();
				tree.select_node(i);
				utils.alertMessage(`存在${defaultQuestion}或${defaultAnswer},请保存或删除该问题后再添加节点`);
				return;
			}
		}
		// const endLoadTree = loadTree();
		$.ajax({
			url: 'knowledge/dialog/update/addNode',
			type: 'POST',
			data: {
				parentId: obj.id
			},
			success: (msg) => {
				if (!msg.error) {
					const d: any = {
						id: msg.msg,
						text: defaultQuestion,
						plainText: defaultAnswer,
						// contentHtml: defaultAnswerHtml,
						parent: obj.id
					};
					d.current = Object.assign({}, d);
					inst.create_node(obj, d, 'last', (newNode) => {
						setTimeout(() => {
							tree.deselect_all();
							tree.select_node(newNode);
							inst.edit(newNode);
						}, 0);
					});
				}
				else {
					utils.alertMessage(msg.msg);
				}
			}
		});
	}

	function initCorpus() {
		const btn = $('#show-coupus-btn');
		btn.one('click', () => {
			const showbtn = $('<button type="button" class="btn btn-sm btn-primary" id="show-btn">选择现有语料</button>')
				.hide()
				.on('click', () => {
					$('#show-coupus-wrap').show();
					showbtn.hide();
				});
			btn.after(showbtn)
				.remove();
			beforeInitTable();
			$('#table').DataTable(
				Object.assign(
					simpleConfig('single'),
					{
						ajax: {
							type: 'POST',
							url: 'knowledge/dialog/getPairs',
							dataSrc: data => data.rows,
							data: (data: any) => {
								const d = {
									questionkeyword: $.trim($('#form-question').val()),
									answerkeyword: $.trim($('#form-answer').val()),
									classifyIds: classify.selected.join(','),
									// corpusStatus: $("#select-status").val(),
									characterId: $('#select-character').val(),
									page: getPage(data),
									rows: data.length,
									pushway: $('#select-pushway').val(),
									beginTime: date.getDate('start'),
									endTime: date.getDate('end')
								};
								return utils.cleanObject(d);
							}
						},
						scrollY: getTableHeight() - 504,
						scrollCollapse: true,
						pageLength: 20,
						processing: false,
						columns: [
							{ name: 'question', data: 'literal', title: '问题', width: '50%', createdCell: createAddTitle },
							{ name: 'plainText', data: 'digest', title: '回复', width: '50%', createdCell: createAddTitle }
						],
						drawCallback: () => {
							toggleTable();
						},
						initComplete: initComplete
					}))
				.on('select', tableChange)
				.on('deselect', () => {
					tableRowSelected = null;
					toggleTable();
				});
		});
	}

	function beforeInitTable() {
		const wrap = $('#show-coupus-wrap');
		wrap.removeClass('hidden');
		$('#hide-btn').on('click', () => {
			deselectTable();
			wrap.hide();
			$('#show-btn').show();
		});
		initClassify();
		initDate();
	}

	function tableChange(e, dt, type, indexes) {
		if (type === 'row') {
			const q = question;
			tableRowSelected = dt.row(indexes).data();
			q.val(tableRowSelected.literal);
			// editor.$txt.html(selected.htmlContent);
			answer.val(tableRowSelected.digest);
			rename(tableRowSelected.literal);
			toggleTable();
		}
	}

	const toggleTable = utils.debounce(() => {
		if (tableRowSelected) {
			question.prop('disabled', true);
			answer.prop('disabled', true);
		} else {
			question.prop('disabled', null);
			answer.prop('disabled', null);
		}
	}, 200);

	// function tableDisable() {
	// 	question.prop('disabled', true);
	// 	answer.prop('disabled', true);
	// 	// editor.disable();
	// }

	// function tableEnable() {
	// 	if (selected) {
	// 		selected = null;
	// 	}
	// 	question.prop('disabled', null);
	// 	answer.prop('disabled', null);
	// 	// editor.enable();
	// }

    /*    function checkAble(data) {
            $("#hide-btn").click();
            if (data.synedPairId) {
                // $("#show-btn,#show-coupus-btn").hide();
                tableDIsable();
            }
            else {
                // $("#show-btn,#show-coupus-btn").show();
                tableEnable();
            }
        }*/

	function initClassify() {
		const d = selectData.classify.map(function (v) {
			const data = {
				id: v.id,
				text: v.name,
				parent: v.parent
			};
			return data;
		});

		d.unshift({
			text: '所有问题',
			id: 0,
			parent: '#',
			state: {
				opened: true
			}
		});

		classify = new utils.ClassifyTree({
			el: $('#classify'),
			data: d,
			selected: true,
			multiple: true
		});
	}

	function initDate() {
		date = new utils.CommonDate({
			el: $('#form-date')
		});
	}

	function deselectTable() {
		if ($('#show-coupus-btn').length <= 0 && tableRowSelected) {
			const table = $('#table').DataTable();
			table.rows().deselect();
		}
	}

	function initComplete() {
		const table = $('#table').DataTable();
		$('#search-btn').on('click', () => {
			table.draw();
		});
		utils.bindEnter($('#form-question,#form-answer'), () => {
			table.draw();
		});
	}

	function checkLeave(t): boolean {
		const select = tree.get_selected(true)[0],
			data = select.original,
			current = data.current;
		if ($('#submit-btn').prop('disabled')) {
			utils.alertMessage('正在保存中,请稍等');
			return false;
		}
		if (select.id === t.id) {
			return false;
		}
		if (data.plainText === current.plainText && data.text === current.text) {
			deselectTable();
			return true;
		}
		$('#leave-confirm-modal').modal('show');
		target = t;
		return false;
	}

	function treeInitComplete() {
		tree = $('#tree').jstree(true);
		tree.open_all();
		initEditForm();
		updateContent(null, null);
		$('#leave-btn').on('click', () => {
			const select = tree.get_selected(true)[0],
				data = select.original,
				current = data.current;
			if (!target) {
				return;
			}
			deselectTable();

			for (let i in current) {
				current[i] = data[i];
			}
			$('#leave-confirm-modal').modal('hide');
			tree.rename_node(select.id, data.text);
			if (target.id) {// 点击
				tree.deselect_all();
				tree.select_node(target.id);
			} else {// 新建
				treeAddAction({ reference: select.id });
			}

		});
		$('#leave-confirm-modal').on('hidden.bs.modal', () => {
			target = null;
		});
	}

	function loadTree() {
		return utils.addLoadingBg($('#tree-wrap'), $('#tree'));
	}

	function loadTable() {
		return utils.addLoadingBg($('#table-wrap'), $('#table-blur'));
	}
}
