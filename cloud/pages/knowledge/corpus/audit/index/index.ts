import * as utils from 'utils';
import * as table from 'new-table';
import { CommonDate } from 'daterangepicker';
import CorpusUpdateSideBar from 'corpusUpdateSideBar';
import { CorpusRelate } from 'corpus-relate';
import 'tree';
import './index.less';
declare const fromData: {
	id: string;
};
let initFrom = false;
interface ISunQuestion {
	'id';
	'classify';
	'sentenceType';
	'user';
	'application';
	'predictedClassify';
	'literal';
	'contextFree';
	'hits';
	'sentiment';
	'qupdateTime';
	'segments';
	'remarks';
	'md5';
	'fid';
	'countSubQ';
	'countSubA';
	'documentId';
	'confuseQuestion';
	'confuseAnswer';
	'confuseDegree';
}

interface IQuestion {
	'pairId';
	'questionId';
	'literal';
	'similarityQid';
	'similarityLiteral';
	'similarityDegree';
	'classifyID';
	'virtualCharacterID';
	'status';
	'qupdateTime';
	'answer';
	'countSubQ';
	'suns': ISunQuestion[];
}

const $table = $('#table');

const date = new CommonDate({
	el: $('#date')
});

let sideBar = new CorpusUpdateSideBar({
	hideFn: () => {
		t.reload();
	}
});

let selectedRows: IQuestion[];

const types = {
	ignore: 'ignore',
	ignoreForever: 'ignore-forever',
	add: 'add',
	delete: 'delete',
	link: 'link'
};

const corpusRelate = new CorpusRelate(selectData);

const t = new table.Table({
	el: $table,
	checkbox: {
		data: 'pairId'
	},
	options: {
		ajax: {
			url: 'knowledge/corpus/audit/list',
			dataSrc: data => data.rows,
			data: (d: any) => {
				const order = d.order[0];
				const data = table.extendsData(d);
				if (fromData && !initFrom) {
					initFrom = true;
					Object.assign(d, { questionId: fromData.id });
				}
				else {
					Object.assign(d, {
						beginDegree: 0,
						endDegree: 0,
						beginTime: date.getDate('start'),
						endTime: date.getDate('end'),
						keyword: $('#question').val().trim(),
						sortField: d.columns[order.column].name,
						sortType: order.dir
					});
				}
				return utils.cleanObject(d);
			}
		},
		paging: true,
		serverSide: true,
		ordering: true,
		order: [[3, 'desc']],
		columns: [
			{
				title:
				'无答案问题<i id="table-expand-btn" class="fa fa-expand fa-compress" aria-hidden="true"></i>',
				data: 'literal',
				render: renderQuestion,
				orderable: false
			},
			{ name: 'hits', title: '被问次数', data: 'hits', render: renderHits, width: '60px' },
			{ name: 'qupdateTime', title: '创建时间', data: 'qupdateTime', render: utils.renderCommonTime, width: '120px' },
			{ title: '操作', data: 'pairId', render: renderAction, className: 'prevent', width: '200px', orderable: false }
		],
		drawCallback: fillChildren,
		initComplete: initComplete
	}
});


function fillChildren() {
	const dt = t.dt;
	Array.prototype.forEach.call(dt.rows().nodes(), (e) => {
		const tr = $(e),
			row = dt.row(tr).data() as IQuestion;
		if (row.countSubQ) {
			const children = $(row.suns.map(sun => {
				const child = $(`
					<tr class="sub-tr" data-group="${row.pairId}">
						<td></td>
						<td>${sun.literal}</td>
						<td>${sun.hits}</td>
						<td>${utils.renderCommonTime(sun.qupdateTime)}</td>
						<td>
							<a href="javascript:;" class="table-sun-action-btn" data-type="${types.delete}">移出</a>
							<a href="javascript:;" class="table-sun-action-btn" data-type="${types.ignore}">忽略</a>
							<a href="javascript:;" class="table-sun-action-btn" data-type="${types.ignoreForever}">永久忽略</a>
						</td>
					</tr>
				`);

				child.data({
					parent: tr,
					row: {
						...sun,
						pairId: row.pairId
					}
				});

				return child.get(0);

			}));

			tr.data('children', children).after(children);
		}
	});
}


function renderAction(pairId, type, row) {
	const deleteBtn = `<a href="javascript:;" class="table-action-btn" data-type="${types.delete}">移出</a>`;
	return `
		<a href="javascript:;" class="table-action-btn" data-type="${types.add}">添加</a>
		<a href="javascript:;" class="table-action-btn" data-type="${types.link}">关联</a>
		${row.countSubQ ? deleteBtn : ''}
		<a href="javascript:;" class="table-action-btn" data-type="${types.ignore}">忽略</a>
		<a href="javascript:;" class="table-action-btn" data-type="${types.ignoreForever}">永久忽略</a>
	`;
}


function renderQuestion(literal, type, row) {
	return `
		<p title="${literal}">${literal}</p>
		<p class="similar-questions">相似无答案问题：<a class="table-suns-btn ${row.countSubQ ? 'has-similar' : ''}" href="javascript:;">${row.countSubQ ? row.countSubQ : 0}</a></p>
	`;
}

function initComplete() {
	const dt = $table.DataTable(),
		modal = $('#link-modal');

	$('#search-btn').on('click', () => {
		t.reload(true);
	});


	utils.bindEnter($('#question'), () => {
		t.reload(true);
	});

	$('.action-btn').on('click', (e) => {
		const btn = $(e.currentTarget),
			type = btn.data('type'),
			selected = t.selected as IQuestion[];
		selectedRows = selected;
		if (selected.length > 0) {
			switch (type) {
				case types.link:
					corpusRelate.showModal(selectedRows);
					// showLinkModal();
					break;
				case types.add:
					const allQids = selected.map(row => row.pairId);
					addAction(allQids);
					break;
				case types.ignore:
				case types.ignoreForever:
					ignoreAction(
						selected.map(row => {
							const qids = [row.questionId];
							if (row.countSubQ) {
								qids.push(...row.suns.map(sun => (sun.id)));
							}
							return {
								pairId: row.pairId,
								qids
							};
						}),
						type === types.ignoreForever
					);
					break;
				default:
					break;
			}
		} else {
			utils.alertMessage('请选择要' + btn.text() + '的问题');
		}
	});

	$('#refresh-btn').on('click', (e) => {
		const end = utils.loadingBtn($(e.currentTarget));
		$.ajax('knowledge/corpus/audit/group', {
			method: 'POST'
		}).done(res => {
			utils.alertMessage(res.msg, !res.error);
			t.reload();
		})
			.always(() => {
				end();
			});
	});

	$('#table-expand-btn').on('click', (e) => {
		const subTrs = $table.find('.sub-tr'),
			btn = $(e.currentTarget);
		const visible = checkAllVisible();

		if (visible) {
			btn.addClass('fa-compress');
			subTrs.show();

		} else {
			btn.removeClass('fa-compress');
			subTrs.hide();
		}
	});


	function checkAllVisible() {
		const subTrs = $table.find('.sub-tr');
		let visible = false;
		for (let tr of subTrs.toArray()) {
			if (!$(tr).is(':visible')) {
				visible = true;
				break;
			}
		}


		return visible;
	}


	$table
		.on('click', '.table-suns-btn', (e) => {
			e.stopPropagation();
			const tr = $(e.currentTarget).closest('tr'),
				children = tr.data('children');

			if (children) {
				children.toggle();

				const visible = checkAllVisible(),
					btn = $('#table-expand-btn');
				if (visible) {
					btn.removeClass('fa-compress');

				} else {
					btn.addClass('fa-compress');
				}
			}

		})
		.on('click', '.table-action-btn', (e) => {
			const btn = $(e.currentTarget),
				row = dt.row(btn.closest('tr')).data() as IQuestion,
				type = btn.data('type');

			selectedRows = [row];

			switch (type) {
				case types.add:
					addAction([row.pairId]);
					break;
				case types.link:
					corpusRelate.showModal(selectedRows);
					break;
				case types.delete:
					deleteAction(row.pairId, row.questionId);
					break;
				case types.ignore:
				case types.ignoreForever:
					ignoreAction(
						[
							{
								pairId: row.pairId,
								qids: [row.questionId]
							}
						],
						type === types.ignoreForever
					);
					break;
				default:
					return;
			}
		})
		.on('click', '.table-sun-action-btn', (e) => {
			const btn = $(e.currentTarget),
				tr = btn.closest('tr'),
				row = tr.data('row'),
				type = btn.data('type');
			switch (type) {
				case types.delete:
					deleteAction(row.pairId, row.id);
					break;
				case types.ignore:
				case types.ignoreForever:
					ignoreAction(
						[
							{
								pairId: row.pairId,
								qids: [row.id]
							}
						], type === types.ignoreForever
					);
					break;
				default:
					break;
			}
		});
}


function ignoreAction(pairs, forever = false) {
	const submit = (cb?) => {
		const xhr = $.ajax('knowledge/corpus/audit/delete', {
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				pairs,
				forever
			})
		})
			.done(res => {
				t.reload();
				utils.alertMessage(res.msg, !res.error);
			});
		if (cb) {
			xhr.always(cb);
		}
	};


	if (forever) {
		utils.confirmModal({
			msg: '该问题不会再次出现在无答案问题列表中，您确定要永久忽略吗？',
			text: '永久忽略',
			cb: (modal, btn) => {
				const end = utils.loadingBtn(btn);
				submit(() => {
					modal.modal('hide');
					end();
				});
			}
		});
	} else {
		submit();
	}

}


function deleteAction(pairId, qId) {
	$.ajax('knowledge/corpus/audit/independent', {
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			pairId,
			qid: qId
		})
	})
		.done(res => {
			t.reload();
			utils.alertMessage(res.msg, !res.error);
		});
}


const classify = new utils.ClassifyTree({
	el: $('#classify'),
	data: utils.formatClassify(selectData.classify, true),
	multiple: true,
	selected: true
});


const lDate = new utils.CommonDate({
	el: $('#form-date')
});

/* const lT = new table.Table({
	el: $('#edit-table'),
	options: {
		scrollY: '300px',
		ajax: {
			url: 'knowledge/review/update/list',
			type: 'POST',
			dataSrc: data => data.rows,
			data: (data) => {
				return utils.cleanObject(
					table.extendsData(data, {
						keyword: $.trim($('#form-question').val()),
						classifys: classify.selected.join(','),
						answerkeyword: $.trim($('#form-answer').val()),
						character: $('#select-character').val(),
						pushway: $('#select-pushway').val(),
						beginTime: lDate.getDate('start'),
						endTime: lDate.getDate('end'),
						corpusStatus: 8
					}));
			}
		},
		paging: true,
		serverSide: true,
		select: {
			style: 'single'
		},
		columns: [
			{ data: 'countSubQ', title: '', 'orderable': false, width: '12', className: 'show-q-corpus force-width prevent', createdCell: createShowCorpus },
			{ name: 'question', data: 'question', title: '问题', width: '50%' },
			// { data: 'countSubA', title: '', 'orderable': false, width: '12', className: 'show-a-corpus force-width prevent', createdCell: createShowCorpus },
			{ name: 'plainText', data: 'plainText', title: '回复', width: '50%' }
		],
		initComplete: () => {
			const t = lT.dt;

			$('#form-search-btn').on('click', () => {
				t.draw();
			});

			$('#edit-table').on('click', '.show-corpus-td.show-q-corpus', (e) => {
				showCorpus(e, 'knowledge/editByA/listByPairId', 'q');
			});
			$('#edit-table').on('click', '.show-corpus-td.show-a-corpus', (e) => {
				showCorpus(e, 'knowledge/editByA/listAnswerByPairId', 'a');
			});
			utils.bindEnter($('#form-answer,#form-question'), () => t.draw());

			$('#link-modal').one('shown.bs.modal', () => {
				lT.adjustHeader();
			});


			$('#edit-submit-btn').on('click', linkAction);
		}
	}
}); */
/* function showCorpus(e: JQueryEventObject, url: string, name: string) {
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
} */
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

/* function showLinkModal() {
	$('#link-modal').modal('show');
	lT.reload();
} */


/* function linkAction() {
	const modal = $('#link-modal'),
		btn = $('#edit-submit-btn');
	if (selectedRows) {
		const selected = lT.selected;
		if (selected.length > 0) {
			const end = utils.loadingBtn(btn);
			const ids = selectedRows.map(row => row.pairId),
				id = selected[0].id;
			$.ajax('knowledge/review/update/save', {
				data: {
					pairIds: ids.join(','),
					pairId: id
				}
			})
				.done(res => {
					utils.alertMessage(res.msg, !res.error);
					modal.modal('hide');
					t.reload();
				})
				.always(() => {
					end();
				});

		} else {
			utils.alertMessage('请选择要关联的问题');
		}
	}
} */

function addAction(arr) {
	const ids = arr.map(v => 'pairId=' + v);
	if (!ids.length) {
		utils.alertMessage('请至少选择两条或两条以上的语料合并！');
	} else {
		sideBar.open(null, '添加语料', `${ctx}/knowledge/corpusManage/update?${ids.join('&')}`);
		// changeIframeSideBar('合并语料', `${ctx}/knowledge/corpusManage/update?${ids.join('&')}`);
	}
	// location.href = 'knowledge/editByA/merge?title=语料添加&ids=' + ids;
}


function renderHits(hits) {
	return hits ? hits : 0;
}
