import * as utils from 'utils';
import 'new-table';
import { commonConfig, getPage, bindEnter, bindPageChange, simpleConfig, Table } from 'tables';
import 'tree';
import 'time';
import './index.less';

namespace CustomizeRecommendIndex {
	interface ISubmitData {
		id?: number;
		questionId?: number;
		recommendQuestionId?: number[];
	}
	enum modalState {
		create,
		edit
	}
	let state: modalState, submitData: ISubmitData;
	let t: Table;
	let detailT: Table;
	$(() => {
		initDatatable();
	});

	function initDatatable() {
		const classify = new utils.ClassifyTree({
			el: $('#classify'),
			data: utils.formatClassify(selectData.classify, true),
			selected: true,
			multiple: true
		});
		$('#table').DataTable(Object.assign({
			ajax: {
				url: 'recommend/list',
				type: 'POST',
				dataSrc: (data) => data.rows,
				data: (data) => {
					return utils.cleanObject({
						classifyId: classify.selected.join(','),
						keyword1: $.trim($('#keyword').val()),
						currentPage: getPage(data),
						pageSize: data.length,
						sortField: '',
						sortType: ''
					});
				}
			},
			initComplete: initComplete,
			columns: [
				{ name: 'question', data: 'question', width: '50%', title: '问题' },
				{ name: 'recommendQuestion', data: 'recommendQuestion', width: '30%', title: '推荐问题' },
				{ name: 'createTime', data: 'createTime', title: '创建时间', render: utils.renderCommonTime }
			]
		}, commonConfig()));
	}

	function initComplete() {
		const table = $('#table').DataTable();
		t = new Table(table);
		$('#search-btn').on('click', () => {
			// table.draw();
			t.refresh(true);
		});

		$('#del-btn').on('click', () => {
			const data = table.rows({ selected: true }).data().toArray();
			if (data.length <= 0) {
				utils.alertMessage('请选择要删除的推荐问题');
				return;
			}
			utils.confirmModal({
				msg: `确认删除选中的 ${data.length} 条推荐问题吗?`,
				cb: (modal, btn) => {
					const loading = utils.loadingBtn(btn);
					$.ajax({
						url: 'recommend/delete',
						type: 'POST',
						data: {
							ids: data.map(v => v.id).join(',')
						},
						success: (msg) => {
							if (!msg.error) {
								modal.modal('hide');
								// table.draw();
								t.refresh();
							}
							utils.alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							loading();
						}
					});
				}
			});
		});

		$('#add-btn').on('click', () => {
			$('#detail-modal').modal('show')
				.find('.modal-title')
				.text('添加推荐问题');
			state = modalState.create;
			submitData = {
				recommendQuestionId: []
			};

			$('#detail-q').val('请选择问题');
			$('#rq-wrap').html(`<div class='rq-item' id='placeholder'><input id='detail-rq' type='text' readonly='readonly' class='form-control input-sm rq-input' value='请选择推荐问题'/></div>`);
		});
		$('#edit-btn').on('click', () => {
			const data = table.rows({ selected: true }).data().toArray();
			if (data.length < 1) {
				utils.alertMessage('请选择要编辑推荐问题');
			}
			else if (data.length > 1) {
				utils.alertMessage('只能编辑一个推荐问题');
			}
			else {
				const currentData = data[0];
				$('#detail-modal').modal('show')
					.find('.modal-title')
					.text('编辑推荐问题');
				state = modalState.edit;
				submitData = {
					id: currentData.id,
					questionId: currentData.questionId,
					recommendQuestionId: [currentData.recommendQuestionId]
				};

				$('#detail-q').val(currentData.question);
				$('#rq-wrap').html(createRqItem(currentData.recommendQuestion, currentData.recommendQuestionId));
			}
		});

		$('#detail-modal').one('shown.bs.modal', () => {
			const detailClassify = new utils.ClassifyTree({
				el: $('#modal-classify'),
				data: utils.formatClassify(selectData.classify, true),
				selected: true,
				multiple: true
			});
			$('#detail-table').DataTable(Object.assign(
				simpleConfig(),
				{
					ajax: {
						url: 'recommend/update/list',
						type: 'POST',
						data: data => {
							return utils.cleanObject({
								keyword: $.trim($('#detail-keyword').val()),
								classifys: detailClassify.selected.join(','),
								corpusStatus: 8,
								page: getPage(data),
								rows: data.length
							});
						},
						dataSrc: data => data.rows
					},
					columns: [
						{ name: 'question', data: 'question', title: '问题' }
					],
					initComplete: detailInitComplete
				}));
		});

		$('#detail-modal').on('hidden.bs.modal', () => {
			submitData = null;
			$('#detail-q,#detail-rq').val('');
		});

		bindEnter(table);

		bindPageChange(table, $('#page-change'));

	}

	function detailInitComplete() {
		const table = $('#detail-table').DataTable();
		detailT = new Table(table);
		// let once = false;

		$('#detail-search-btn').on('click', () => {
			// table.draw();
			detailT.refresh(true);
		});

		bindEnter(table, $('#detail-keyword'));

		$('#set-q-btn').on('click', () => {
			const data: any = table.rows({ selected: true }).data().toArray();
			if (data.length < 1) {
				utils.alertMessage('请选择要设为问题的问题');
			}
			else if (data.length > 1) {
				utils.alertMessage('只能选择一个问题');
			}
			else if (!checkQ(data[0].questionId)) {
				utils.alertMessage('请不要选择相同的问题');
			}
			else {
				submitData.questionId = data[0].questionId;
				$('#detail-q').val(data[0].question);
			}
		});

		$('#set-rq-btn').on('click', () => {
			const data: any = table.rows({ selected: true }).data().toArray();
			let i = 0,
				html = '';
			if (data.length < 1) {
				utils.alertMessage('请选择要设为推荐问题的问题');
				return;
			}

			for (let v of data) {
				if (!checkQ(v.questionId)) {
					continue;
				}
				submitData.recommendQuestionId.push(v.questionId);
				html += createRqItem(v.question, v.questionId);
				i++;
			}



			if (i === 0) {
				utils.alertMessage('请不要选择相同的问题');
				return;
			}
			if ($('#placeholder').length > 0) {
				$('#placeholder').remove();
			}

			$('#rq-wrap').append(html);

			// $('#detail-rq').val(data.question);
		});

		$('#detail-submit-btn').on('click', () => {
			let url: string;
			if (!submitData.questionId || submitData.recommendQuestionId.length < 1) {
				utils.alertMessage('问题或推荐问题为空');
				return;
			}
			let bool: boolean;
			switch (state) {
				case modalState.create:
					url = 'recommend/add';
					bool = true;
					break;
				case modalState.edit:
					if (!submitData.id) {
						return;
					}
					url = 'recommend/update/save';
					bool = false;
					break;
				default:
					return;
			}
			const loading = utils.loadingBtn($('#detail-submit-btn'));
			const data = Object.assign({}, submitData, {
				recommendQuestionId: submitData.recommendQuestionId.join(',')
			});
			$.ajax({
				url: url,
				data: data,
				success: (msg) => {
					if (!msg.error) {
						$('#detail-modal').modal('hide');
						// table.draw();
						// $('#table').DataTable().draw(false);
						t.refresh(bool);
					}
					utils.alertMessage(msg.msg, !msg.error);
				},
				complete: () => {
					loading();
				}
			});
		});

		$('#rq-wrap').on('click', '.close', (e) => {
			if (submitData.recommendQuestionId.length < 1) {
				return;
			}
			const el = $(e.currentTarget).parent(),
				index = submitData.recommendQuestionId.indexOf(el.data('id'));
			if (index > -1) {
				el.remove();
				submitData.recommendQuestionId.splice(index, 1);
			}
		});

	}

	function checkQ(id): boolean {
		const all = [submitData.questionId].concat(submitData.recommendQuestionId);
		for (let v of all) {
			if (id === v) {
				return false;
			}
		}
		return true;
	}

	function createRqItem(value, id): string {
		return (
			`<div class='rq-item' data-id='${id}' >
                    <input id='detail-rq' type='text' readonly='readonly' class='form-control input-sm rq-input' value='${value}'/>
                    <button type='button' class='close'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>
                </div>`);
	}

}
