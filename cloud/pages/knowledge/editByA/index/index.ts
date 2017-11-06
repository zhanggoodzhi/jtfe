import {
	IconState, alertMessage, ClassifyTree, bindEnter, loadingBtn, endLoadingBtn, cleanObject, CommonDate,
	// Upload,
	formatClassify, renderCommonTime, useIcon
} from 'utils';
import 'new-table';
import { VARIABLES, createAddTitle, getTableHeight, bindPageChange, checkLength, commonConfig, simpleConfig, Table } from 'tables';

import 'tree';
import 'daterangepicker';
import './index.less';
import { DelayUpload } from 'upload';
declare const isreturn: boolean;

namespace KnowledgeEditbyAIndex {
	let date: CommonDate, classify: ClassifyTree, init = false, actionData = { pairId: null };

	$(function () {
		classify = fillSelectData(); // 填充下拉框菜单信息
		clearSession();
		initDate(); // 初始化时间表单
		initDataTables(); // 初始化主表格
	});


	function initDate() {
		date = new CommonDate({
			el: $('#form-date')
		});
	}

	// main table
	function initDataTables() {
		$('#table').DataTable(
			Object.assign(
				commonConfig(),
				{
					ajax: {
						type: 'POST',
						url: 'knowledge/editByA/listCorpusByPM',
						dataSrc: function (data) {
							const d = data.rows;
							return d;
						},
						data: function (d: any) {
							const order = d.order[0],
								field = d.columns[order.column].data,
								data = Object.assign(getFormData(), {
									page: Math.floor((d.start + d.length) / d.length),
									rows: d.length,
									sortType: order.dir,
									sortField: field
								});
							if (!init && isreturn === true) {
								const cacheData: any = getCacheForm();
								if (!$.isEmptyObject(cacheData)) {
									const cacheOrder = cacheData.order.split(',');
									cacheData.sortType = cacheOrder[1];
									cacheData.sortField = d.columns[cacheOrder[0]].data;
									delete cacheData.order;
									if (cacheData.rows) {
										$('#table').DataTable().page.len(cacheData.rows);
									}
									return cacheData;
								}
							}
							return cleanObject(data);
						}
					},
					scrollY: getTableHeight(),
					ordering: true,
					order: [[8, 'desc']],
					columns: [
						{ data: 'countSubQ', title: '', 'orderable': false, width: VARIABLES.width.icon, className: 'show-q-corpus force-width prevent', createdCell: createShowCorpus },
						{ name: 'question', data: 'question', title: '问题', 'orderable': false, createdCell: createAddTitle },
						{ data: 'countSubA', title: '', 'orderable': false, width: VARIABLES.width.icon, className: 'show-a-corpus force-width prevent', createdCell: createShowCorpus },
						{ name: 'plainText', data: 'plainText', title: '回复', 'orderable': false, createdCell: createAddTitle },
						{ data: 'dialog', title: '对话模型', 'orderable': false, width: VARIABLES.width.button, className: 'prevent', render: renderDialog },
						{ name: 'pushway', data: 'pushway', title: '渠道', width: '80px', render: renderPushway },
						{ name: 'classifyId', data: 'classifyId', width: '80px', title: '类型', render: renderClassify },
						{ name: 'characterId', data: 'characterId', width: '80px', title: '角色', render: renderCharacter },
						{ name: 'updateTime', data: 'updateTime', width: VARIABLES.width.commonTime, title: '更新时间', render: renderCommonTime }
					],
					drawCallback: function () {
						$('.dataTables_scrollBody').scrollTop(0);
						if (init) {
							cacheForm();
						}
					},
					initComplete: initComplete
				}));
	}

	// 填充下拉框数据
	function fillSelectData() {
		return new ClassifyTree({
			el: $('#classify'),
			data: formatClassify(selectData.classify, true),
			selected: true,
			multiple: true
		});
	}

	function initComplete() {
		const table = $('#table').DataTable();
		const t = new Table(table);
		const delBtn = $('#delete-submit-btn');
		const uploadBtn = $('#upload-submit-btn');
		const upload = new DelayUpload({
			accept: '.xls,.xlsx',
			url: 'knowledge/uploadCorpusSumit',
			saveBtn: $('#upload-wrap'),
			submitBtn: uploadBtn,
			save: (id, name) => {
				$('#info-wrap').show();
				$('#info-name').text(name);
			},
			success: res => {
				if (!res.error) {
					alertMessage(res.msg, !res.error, false);
					$('#upload').modal('hide');
					t.refresh();
					$('#info-wrap').hide();
					$('#info-name').text('');
				}
			},
			cancel: () => {
				$('#info-wrap').hide();
				$('#info-name').text('');
			}
		});
		$('#upload').on('hide.bs.modal', () => {
			upload.cancel();
		});
		let ids: string[] = [], actionInit: boolean = false;
		initDialogTree();
		renderForm();

		bindPageChange(table, $('#page-change'));

		$('#search-btn').on('click', () => {
			t.refresh(true);
		});
		$('#edit-btn').on('click', () => {
			const data = table.rows({ selected: true }).data().toArray();
			if (data.length < 1) {
				alertMessage('请选择要操作的问题！');
			}
			else if (data.length > 1) {
				alertMessage('只能编辑一个问题！');
			}
			else {
				const id = data[0].id;
				window.location.href = `${ctx}/knowledge/editByA/update?pairId=${id}`;
			}
		});

		$('#del-btn').on('click', () => {
			const d: any = table.rows({ selected: true }).data();
			// let num=0;
			if (d.length <= 0) {
				alertMessage('请选择要操作的问题！');
				return;
			}
			ids = [];
			for (let v of d) {
				// if (v.dialog === 0) {
				ids.push(v.id);
				// }
                /* if(v.classifyId===1056){
                     ++num;
                 }*/
			}
			if (ids.length <= 0) {
				alertMessage('语料在对话模型中被使用,请先修改对话模型后再尝试删除语料');
				return;
			}
            /*if(num){
                alertMessage('无法删除类型为”对话模型“的语料，请重新选择不包含该类型的语料');
                return;
            }*/
			$('#confirm').modal('show');
		});

		delBtn.on('click', () => {
			if (ids.length <= 0) {
				return;
			}
			loadingBtn(delBtn);
			$.ajax({
				url: 'knowledge/editByA/delete',
				data: {
					pairIds: ids.join(',')
				},
				type: 'POST',
				success: (msg) => {
					if (!msg.error) {
						t.refresh();
						$('#confirm').modal('hide');
					}
					alertMessage(msg.msg, msg.code);
				},
				complete: () => {
					endLoadingBtn(delBtn);
				}
			});
		});

		$('#reset-btn').on('click', () => {
			setTimeout(() => {
				date.resetDate();
				classify.reset();
				table.page.len($('#page-change').val());
			}, 0);
		});

		$('#confirm').on('hidden.bs.modal', () => {
			ids = [];
		});

		$('#batch-upload-btn').on('click', () => {
			$('#upload').modal('show');
		});

		bindEnter($('#form-answer,#form-question'), () => t.refresh(true));

		// $('m ').on('click', () => t.refresh(true)); // 查询问题

		$('#export-btn').on('click', (e) => {
			exportCorpus($(e.currentTarget), 'exportExcel');
		});

		$('#nolimit-export-btn').on('click', (e) => {
			exportCorpus($(e.currentTarget), 'noLimitExportExcel');
		});

		$('#table').on('click', '.show-corpus-td.show-a-corpus', (e) => {
			showCorpus(e, 'knowledge/editByA/listAnswerByPairId', 'plainText');
		});

		$('#table').on('click', '.show-corpus-td.show-q-corpus', (e) => {
			showCorpus(e, 'knowledge/editByA/listByPairId', 'question');
		});

		$('#table').on('click', '.show-dialog', function () {
			const btn = $(this),
				id = btn.attr('data-id');
			loadingBtn(btn);
			$.ajax({
				url: 'knowledge/editByA/listDialogByPairId',
				type: 'GET',
				data: {
					pairId: id
				},
				success: (msg) => {
					if (!msg.error) {
						$('#dialog-modal').modal('show');
						updateDialogTree(msg.msg);
					}
				},
				complete: () => {
					endLoadingBtn(btn);
				}
			});
		});

		$('#action-btn').on('click', () => {
			checkLength({
				action: '查看',
				name: '语料',
				table: table,
				cb: (data) => {
					actionData.pairId = data.id;
					$('#action-modal').modal('show');
					if (!actionInit) {
						initActionTable();
						actionInit = true;
					}
				}
			});
		});

		$('#dialog-edit-btn').on('click', function () {
			const selected = $('#dialog').jstree(true).get_selected(true);
			if (selected.length > 0) {
				const d = selected[0].original;
				window.open(`${ctx}/knowledge/dialog/update?id=${d.dialog}`);
			} else {
				alertMessage('请选择对话模型');
			}
		});

		$('#dialog-modal').on('hidden.bs.modal', () => {
			$('#dialog-question').val('');
			$('#dialog-answer').html('');
		});

		if (!isreturn && init === false) {
			init = true;
		}
		// 合并语料
		$('#merge-btn').on('click', () => {
			checkLength({
				action: '合并',
				name: '语料',
				table: table,
				unique: false,
				cb: (data) => {
					let mids = [];
					data.forEach(v => {
						mids.push(v.questionId);
					});
					if (data.length === 1) {
						alertMessage('请至少选择两条或两条以上的语料合并！');
					} else {
						window.location.href = `${ctx}/knowledge/editByA/merge?title=语料合并&ids=${mids.join(',')}`;
					}
				}
			});
		});
	}

	function initActionTable() {
		$('#action-table').DataTable(
			Object.assign(
				simpleConfig(),
				{
					ajax: {
						url: 'knowledge/editByA/history',
						dataSrc: data => data.rows,
						data: () => {
							return actionData;
						}
					},
					columns: [
						{ title: '', data: 'id', width: '12px', createdCell: createShowAction },
						{ title: '操作', data: 'content' },
						{ title: '操作时间', data: 'createTime', render: renderCommonTime, width: VARIABLES.width.commonTime }
					],
					select: false,
					initComplete: ActionTableInitComplete
				}));
	}

	function ActionTableInitComplete() {
		const table = $('#action-table').DataTable();
		const t = new Table(table);
		$('#action-table').on('click', '.show-action-td', (e) => {
			const el = $(e.currentTarget),
				icon = el.icon();
			switch (icon.state) {
				case IconState.loading:
					return;
				case IconState.plus:
					icon.state = IconState.loading;
					$.ajax({
						url: 'knowledge/editByA/historyDetail',
						type: 'GET',
						data: {
							historyId: el.data('id')
						},
						success: (msg) => {
							if (!msg.error) {
								addActionDetial(msg.data, el.parents('tr'), table.columns().indexes().length);
							} else {
								alertMessage(msg.msg, !msg.error);
							}
						},
						complete: () => {
							icon.state = IconState.minus;
						}
					});
					break;
				case IconState.minus:
					break;
				default:
					break;
			}

			clearActionTable();
		});
		$('#action-modal').on('show.bs.modal', () => {
			t.refresh();
		});
	}

	function addActionDetial(data, el: JQuery, len: number) {
		let html = '';
		data.forEach(v => {
			html += `
                <li>
                    <span class="action-detial-title">${v.field}</span>
                    :
                    <span class="text-danger">${v.oldValue}</span>
                    =>
                    <span class="text-danger">${v.newValue}</span>
                </li>`;
		});
		if (html === '') {
			html = '<div class="text-center">无数据</div>';
		}
		else {
			html = '<ol>' + html + '</ol>';
		}
		el.after(`<tr class="action-details">
                    <td colspan=${len}>
                        ${html}
                    </td>
                </tr>`);
	}

	function clearActionTable() {
		$('.action-details').remove();
		resetIcon($('#action-table tbody .show-action-td'));
	}


	function showCorpus(e: JQueryEventObject, url: string, name: string) {
		const el = $(e.currentTarget),
			tr = el.parents('tr'),
			icon = el.icon();
		switch (icon.state) {
			case IconState.loading:
				return;
			case IconState.plus:
				icon.state = IconState.loading;
				$.ajax({
					url: url,
					type: 'GET',
					data: {
						pairId: el.data('id')
					},
					success: (msg) => {
						if (!msg.error) {
							const trs = getTrs(name === 'question' ? msg.msg.pms : msg.msg, name);
							tr.after($(trs));
						}
					},
					complete: () => {
						icon.state = IconState.minus;
					}
				});
				break;
			case IconState.minus:
				break;
			default:
				return;
		}
		clearTable();
	}

	function clearTable() {
		$('.cps-details').remove();
		resetIcon($('#table tbody .show-corpus-td'));
	}


	function resetIcon(element?: JQuery) {
		Array.prototype.forEach.call(element, v => {
			const icon = $(v).icon();
			if (icon.state === IconState.minus) {
				icon.state = IconState.plus;
			}
		});
	}

    /**
     * 千万不要改字段名,不然就雪崩
     *
     * @param {any} data
     * @param {any} name
     * @returns
     */
	function getTrs(data, name: string) {
		let html = '';
		const table = $('#table').DataTable(),
			len = table.columns().indexes().length,
			indexMap = {
				question: table.column('question:name').index(),
				plainText: table.column('plainText:name').index(),
				classifyId: table.column('classifyId:name').index(),
				characterId: table.column('characterId:name').index(),
				// status: table.column("status:name").index(),
				updateTime: table.column('updateTime:name').index(),
				pushway: table.column('pushway:name').index()
			};

		if (!data || data.length <= 0) {
			return `
                <tr class="cps-details">
                    <td colspan="${len}" class="text-center">无数据</td>
                </tr>`;
		}
		for (let v of data) {
			const d = new Array(len);
			// 拿q或者a内容
			const qaMap = {
				question: v.question.literal,
				plainText: v.answer.plainText
			},
				// 通用部分
				list = [{
					name: 'classifyId',
					value: v.question.classify.csfValue
				},
				{
					name: 'characterId',
					value: name === 'question' ? '' : v.character.vname
				},
				{
					name: 'pushway',
					value: name === 'question' ? '' : renderPushway(v.pushway)
				},
				{
					name: 'updateTime',
					value: renderCommonTime(v.updateTime)
				}];

			html += ` <tr class="cps-details">`;
			for (let l of list) {
				d[indexMap[l.name]] = l.value;
			}

			d[indexMap[name]] = qaMap[name];
			for (let h of d) {
				if (!h) {
					html += `<td></td>`;
				}
				else {
					html += `<td class="force-width">${h}</td>`;
				}
			}
			html += `</tr>`;
		}
		return html;
	}


	function renderClassify(id) {
		for (let i of selectData.classify) {
			if (i.id === id) {
				return i.name;
			}
		}
		return '';
	}

	function renderCharacter(id) {
		for (let i of selectData.character) {
			if (i.id === id) {
				return i.name;
			}
		}
		return '';
	}

    /* function renderStatus(status) {
         for (let i of selectData.status) {
             if (i.id === status) {
                 return i.name;
             }
         }
         return "";
     }*/


	function exportCorpus(btn, name: string) {
		// alertMessage('正在生成文件', 'success');
		// const end = loadingBtn(btn);
		const data = $.param(getFormData());

		// let str = '';
		// for (let i in data) {
		// 	str += '&' + i + '=' + encodeURI(data[i]);
		// }
		// if (str !== '') {
		// 	str = '?' + str.slice(1);
		// }
		// $.ajax(`knowledge/${name}`, {
		// 	data
		// })
		// 	.done(res => {
		// 		alertMessage(res.msg, !res.error);
		// 	})
		// 	.always(() => {
		// 		end();
		// 	});
		location.href = `${ctx}/knowledge/${name}?${data}`;
	}

	function cacheForm() {
		if (window.sessionStorage) {
			const table = $('#table').DataTable();
			const order = table.order();
			const data = {
				keyword: $.trim($('#form-question').val()),
				answerkeyword: $.trim($('#form-answer').val()),
				classifys: classify.selected.join(','),
				// corpusStatus: $("#select-status").val(),
				character: $('#select-character').val(),
				page: table.page(),
				rows: table.page.len(),
				beginTime: date.getDate('start'),
				endTime: date.getDate('end'),
				order: order[0].join(','),
				pushway: $('#select-pushway').val()
			};

			for (let i in data) {
				window.sessionStorage.setItem(i, data[i]);
			}
		}
	}


	function getCacheItem(key) {
		if (window.sessionStorage && window.sessionStorage.getItem(key)) {
			return window.sessionStorage.getItem(key);
		}
		else {
			return '';
		}
	}

	function getCacheForm() {
		const list = [
			'keyword',
			'answerkeyword',
			'classifys',
			// "corpusStatus",
			'character',
			'page',
			'rows',
			'beginTime',
			'endTime',
			'pushway',
			'order'
		];

		const data: any = {};
		for (let v of list) {
			data[v] = getCacheItem(v);
		}
		return cleanObject(data);
	}

	function renderForm() {
		if (window.sessionStorage) {
			if (!init && isreturn === true) {
				const cacheData: any = getCacheForm();
				const formList = {
					keyword: '#form-question',
					answerkeyword: '#form-answer',
					// corpusStatus: "#select-status",
					character: '#select-character',
					rows: '#page-change',
					pushway: '#select-pushway'
				};
				for (let i in formList) {
					if (cacheData[i]) {
						$(formList[i]).val(cacheData[i]);
					}
				}
				if (cacheData.beginTime && cacheData.endTime) {
					date.setDate(cacheData.beginTime, cacheData.endTime);
				}

				if (cacheData.classifys) {
					const classifys = cacheData.classifys.split(',');
					classify.tree.jstree(true).select_node(classifys);
				}
				init = true;
			}
		}
	}

	// function renderShowCorpus(cellData) {
	//     return '';
	// }

	function createShowCorpus(td: HTMLElement, cellDatA: number, rowData) {
		const el = $(td);
		if (cellDatA > 0) {
			el
				.addClass('show-corpus-td')
				.data('id', rowData.id)
				.icon();
		}
		else {
			el.addClass('disabled')
				.icon();
		}
	}


	function createShowAction(td, cellData, rowData) {
		const el = $(td);
		if (!rowData.history) {
			el.empty();
		}
		else {
			el
				.addClass('show-action-td')
				.data('id', cellData)
				.icon();
		}
	}


	function renderDialog(dialog, type, full, meta) {
		return `<button type="button" class="btn btn-xs btn-primary show-dialog" ${dialog === 0 ? 'disabled' : ''} data-id="${full.id}">显示</button>`;
	}

	function initDialogTree() {
		$('#dialog').jstree({
			core: {
				data: [],
				animation: 100,
				themes: {
					icons: false
				},
				multiple: false
			},
			'conditionalselect': function (node, event) {
				if (node.id.match(/root/)) {
					return false;
				}
				return true;
			},
			plugins: ['conditionalselect']
		})
			.on('refresh.jstree', () => {
				const tree = $('#dialog').jstree(true),
					data = tree.get_json(null, { flat: true } as any);
				tree.deselect_all();
				tree.open_all();
				for (let v of data) {
					if (!v.id.match(/root/)) {
						tree.select_node(v.id);
						return;
					}
				}
				// tree.select_node();
			})
			.on('select_node.jstree', (e, action) => {
				const node = action.node;
				const data = node.original;
				$('#dialog-question').val(data.question);
				$('#dialog-answer').html(data.answer);
			});
	}

	function updateDialogTree(data) {
		const d = [];
		const tree: any = $('#dialog').jstree(true);
		Object.keys(data).forEach((v, i) => {
			const rootId = `root-${i}`,
				dialog = data[v][0].id;
			d.push({
				parent: '#',
				text: v,
				id: rootId,
				isDialog: true
			});
			for (let j of data[v]) {
				d.push({
					text: j.expectWord.literal,
					id: j.id,
					parent: j.parent ? j.parent : rootId,
					answer: j.content.contentHtml,
					question: j.expectWord.literal,
					dialog: dialog
				});
			}
		});
		tree.settings.core.data = d;
		tree.refresh();
	}

	function clearSession() {
		if (window.sessionStorage) {
			if (!isreturn) {
				window.sessionStorage.clear();
			}
		}
	}

	function renderPushway(id) {
		for (let i of selectData.pushway) {
			if (id === i.id) {
				return i.name;
			}
		}
		return '';
	}

	function getFormData() {
		return cleanObject({
			keyword: $.trim($('#form-question').val()),
			answerkeyword: $.trim($('#form-answer').val()),
			classifys: classify.selected.join(','),
			pushway: $('#select-pushway').val(),
			// corpusStatus: $("#select-status").val(),
			character: $('#select-character').val(),
			beginTime: date.getDate('start'),
			endTime: date.getDate('end')
		});

	}
}
