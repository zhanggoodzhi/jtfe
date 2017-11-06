import 'new-table';
import * as tables from 'tables';
import * as utils from 'utils';
import 'tree';
import 'daterangepicker';
import './index.less';

namespace KnowledgeReviewIndex {
	declare const fromData: {
		id: string;
	};

	declare const expectClassify: number[];

	let select;
	let t;


	const tree = new utils.Tree({
		el: $('#main-classify'),
		data: utils.formatClassify(selectData.classify, true),
		multiple: true,
		selected: selectData.classify.map(cls => cls.id),
		initComplete: (tr) => {
			tr.tree.deselect_node(expectClassify);
			initTable(tr);
		}
	});

    /**
     * 初始化表格
     */
	function initTable(classify) {
		const date = new utils.CommonDate({
			el: $('#date')
		});
		let initForm = false;

		$('#table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					ajax: {
						url: 'knowledge/review/list',
						type: 'POST',
						dataSrc: data => data.rows,
						data: (data) => {
							const d = {
								currentPage: tables.getPage(data),
								pageSize: data.length
							};
							if ((window as any).fromData && !initForm) {
								initForm = true;
								Object.assign(d, { questionId: fromData.id });
							}
							else {
								const similar = $('#select-similar').val().split('-');
								Object.assign(d, {
									keyword1: $.trim($('#question').val()),
									keyword2: $.trim($('#similar').val()),
									answer: $.trim($('#answer').val()),
									classifys: classify.selected.join(','),
									beginDegree: similar[0],
									endDegree: similar[1],
									beginTime: date.getDate('start'),
									endTime: date.getDate('end'),
									sortField: '',
									sortType: ''
								});
							}
							return utils.cleanObject(d);
						}
					},
					initComplete: initComplete,
					columns: [
						{ name: 'literal', data: 'literal', title: '问题', width: '25%', createdCell: tables.createAddTitle },
						{ name: 'similarityLiteral', data: 'similarityLiteral', title: '相似句', width: '25%', createdCell: tables.createAddTitle },
						{ name: 'answer', data: 'answer', title: '回复', width: '25%', createdCell: tables.createAddTitle },
						{ name: 'similarityDegree', data: 'similarityDegree', title: '相似度', width: '60px', render: renderDegree },
						{ name: 'hits', data: 'hits', title: '热度', width: '40px' },
						{ name: 'classifyID', data: 'classifyID', title: '分类', width: '60px', render: tables.renderClassify },
						{ name: 'updateTime', data: 'updateTime', title: '更新时间', width: '128px', render: utils.renderCommonTime }
					]
				}
			)
		);
	}

	function initComplete() {
		const table = $('#table').DataTable();
		t = new tables.Table(table);
		let lastHtml, targetHtml = '<tr><td>操作</td><td>';
		$('.btn-trigger').toArray().forEach(v => {
			const el = $(v);
			targetHtml += `<button type='button' class='btn btn-sm btn-link' data-target='#${el.prop('id')}'>${el.text()}</button>`;
		});
		targetHtml += '</td></tr>';
		tables.delBtnClick({
			name: '语料',
			url: 'knowledge/review/delete',
			table: table,
			param: 'pairIds',
			dataParam: 'pairId',
			el: $('#del-btn')
		});

		$('#edit-btn').on('click', () => {
			tables.checkLength({
				action: '编辑',
				table: table,
				name: '语料',
				unique: false,
				cb: (data) => {
					$('#edit-modal').modal('show');
					select = data;
				}
			});
		});

		$('#save-new-btn').on('click', () => {
			tables.checkLength({
				name: '语料',
				action: '保存',
				table: table,
				cb: (data) => {
					location.assign(`${ctx}/knowledge/editByA/update?question=${encodeURI(data.literal)}`);
				}
			});
		});

		$('#check-btn').on('click', () => {
			tables.checkLength({
				table: table,
				action: '审核',
				name: '语料',
				unique: false,
				cb: (data) => {
					const ids: number[] = [];
					for (let v of data) {
						if (v.similarityQid !== null) {
							ids.push(v.pairId);
						}
					}

					if (ids.length < 1) {
						utils.alertMessage('只能审核含有相似句的语料');
						return;
					}
					const endLoading = utils.loadingBtn($('#check-btn'));
					$.ajax({
						// url: "knowledge/review/accept",
						url: 'knowledge/review/verify',
						type: 'POST',
						data: {
							pairIds: ids.join(',')
						},
						success: (msg) => {
							utils.alertMessage(msg.msg, !msg.error);
							if (!msg.error) {
								t.refresh();
							}
						},
						complete: () => {
							endLoading();
						}
					});
				}
			});
		});

		$('#show-detial-btn').on('click', () => {
			tables.checkLength({
				unique: true,
				table: table,
				action: '查看',
				name: '语料',
				cb: (data, rows) => {
					const modal = $('#detial-modal'),
						rowIndex = rows.index();
					let html = '';
					Array.prototype.forEach.call(table.columns().header(), (v, i) => {
						const title = $(v).html(),
							content = (table.cell(rowIndex, i) as any).render('display');
						html += `<tr><td>${title}</td><td>${content}</td></tr>`;
					});

					html += targetHtml;
					modal.modal('show');
					if (lastHtml === undefined || lastHtml !== html) {
						$('#detial-content').html(html);
						lastHtml = html;
					}
				}
			});
		});

		$('#detial-content').on('click', '.btn-link', (e) => {
			$('#detial-modal').hide().modal('hide');
			$($(e.currentTarget).data('target')).trigger('click');

		});

		$('#search-btn').on('click', () => {
			// table.draw();
			t.refresh(true);
		});
		// 导出语料
		const date = new utils.CommonDate({
			el: $('#date')
		});
		$('#export-btn').on('click', () => {
			utils.alertMessage('正在生成文件！', 'success');
			const similar = $('#select-similar').val().split('-');
			const data = utils.cleanObject({
				keyword1: $.trim($('#question').val()),
				keyword2: $.trim($('#similar').val()),
				answer: $.trim($('#answer').val()),
				classifys: tree.selected.join(','),
				beginDegree: similar[0],
				endDegree: similar[1],
				beginTime: date.getDate('start'),
				endTime: date.getDate('end')
			});
			let str = '';
			for (let i in data) {
				str += '&' + i + '=' + encodeURI(data[i]);
			}
			if (str !== '') {
				str = '?' + str.slice(1);
			}
			// console.log(`${ctx}/knowledge/review/exportTestExcel${str}`);
			location.href = `${ctx}/knowledge/review/exportTestExcel${str}`;
		});
		// tables.bindEnter(table, $('#similar,#question,#answer'));
		utils.bindEnter($('#similar,#question,#answer'), () => { t.refresh(true); });
		tables.bindPageChange(table, $('#page-change'));

		$('#edit-modal').one('shown.bs.modal', initEditTable);
	}

    /**
     * 初始化语料编辑时选择知识点的表格
     */
	function initEditTable() {
		const classify = new utils.ClassifyTree({
			el: $('#classify'),
			data: utils.formatClassify(selectData.classify, true),
			multiple: true,
			selected: true
		});

		const date = new utils.CommonDate({
			el: $('#form-date')
		});
		$('#edit-table').DataTable(Object.assign(
			tables.simpleConfig('single'),
			{
				ajax: {
					url: 'knowledge/review/update/list',
					type: 'POST',
					dataSrc: data => data.rows,
					data: (data) => {
						return utils.cleanObject({
							keyword: $.trim($('#form-question').val()),
							answerkeyword: $.trim($('#form-answer').val()),
							classifys: classify.selected.join(','),
							character: $('#select-character').val(),
							page: tables.getPage(data),
							rows: data.length,
							pushway: $('#select-pushway').val(),
							beginTime: date.getDate('start'),
							endTime: date.getDate('end'),
							corpusStatus: 8
						});
					}
				},
				columns: [
					{ data: 'countSubQ', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowCorpus },
					{ name: 'question', data: 'question', title: '问题', width: '50%', createdCell: tables.createAddTitle },
					{ name: 'plainText', data: 'plainText', title: '回复', width: '50%', createdCell: tables.createAddTitle }
				],
				initComplete: editInitComplete
			}
		));

	}
	function editInitComplete() {
		const table = $('#edit-table').DataTable();
		const editT = new tables.Table(table);
		$('#edit-submit-btn').on('click', () => {
			tables.checkLength({
				name: '知识点',
				action: '添加到',
				table: table,
				cb: (data) => {
					const currentdata = data;
					if (!select || select.length < 1) {
						return;
					}
					else {
						for (let v of select) {
							if (v.pairId === currentdata.id) {
								utils.alertMessage('不能保存为相同语料');
								return;
							}
						}
						const endLoading = utils.loadingBtn($('#edit-submit-btn'));
						$.ajax({
							url: 'knowledge/review/update/save',
							type: 'GET',
							data: {
								pairIds: select.map(v => v.pairId).join(','),
								pairId: currentdata.id
							},
							success: (msg) => {
								utils.alertMessage(msg.msg, !msg.error);
								if (!msg.error) {
									$('#edit-modal').modal('hide');
									// $('#table').DataTable().draw(false);
									t.refresh();
								}
							},
							complete: () => {
								endLoading();
							}
						});
					}
				}
			});
		});

		$('#edit-table').on('click', '.show-corpus-td.show-q-corpus', (e) => {
			showCorpus(e, 'knowledge/editByA/listByPairId', 'q');
		});

		$('#form-search-btn').on('click', () => {
			// table.draw();
			editT.refresh(true);
		});

		// tables.bindEnter(table, $('#form-question,#form-answer'));
		utils.bindEnter($('#form-answer,#form-question'), () => editT.refresh(true));
	}

	function showCorpus(e: JQueryEventObject, url: string, name: string) {
		const el = $(e.currentTarget),
			tr = el.parents('tr'),
			icon = el.icon();
		switch (icon.state) {
			case utils.IconState.loading:
				return;
			case utils.IconState.plus:
				icon.state = utils.IconState.loading;
				$.ajax({
					url: url,
					type: 'GET',
					data: {
						pairId: el.data('id')
					},
					success: (msg) => {
						if (!msg.error) {
							let trs;
							if (name === 'q') {
								trs = msg.msg.pms.map(v => {
									return `
										<tr class="cps-details">
										<td></td>
										<td class="force-width">${v.question.literal}</td>
										<td></td>
										<td></td>
										</tr>
									`;
								});
							} else {
								trs = msg.msg.map(v => {
									return `
										<tr class="cps-details">
										<td></td>
										<td></td>
										<td></td>
										<td class="force-width">${v.answer.plainText}</td>
										</tr>
									`;
								});
							}
							// const trs = getTrs(name === 'question' ? msg.msg.pms : msg.msg, name);
							tr.after($(trs.join('')));
						}
					},
					complete: () => {
						icon.state = utils.IconState.minus;
					}
				});
				break;
			case utils.IconState.minus:
				break;
			default:
				return;
		}
		clearTable();
	}

	function clearTable() {
		$('.cps-details').remove();
		resetIcon($('#edit-table tbody .show-corpus-td'));
	}

	function resetIcon(element?: JQuery) {
		Array.prototype.forEach.call(element, v => {
			const icon = $(v).icon();
			if (icon.state === utils.IconState.minus) {
				icon.state = utils.IconState.plus;
			}
		});
	}

	function renderDegree(num: number): string {
		return (num * 1000 / 10) + '%';
	}

	function createShowCorpus(td: HTMLElement, cellDatA: number, rowData) {
		const el = $(td);
		if (cellDatA > 0) {
			el.addClass('show-corpus-td')
				.data('id', rowData.id)
				.icon();
		}
		else {
			el.addClass('disabled')
				.icon();
		}
	}
}
