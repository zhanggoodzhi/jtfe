import { alertMessage, ClassifyTree, loadingBtn, endLoadingBtn, bindEnter, Editor } from 'utils';
import { Table } from 'new-table';
import { bindPageChange, getTableHeight, createAddTitle, getPage } from 'tables';
import 'tree';
import { SimpleDate } from 'daterangepicker';
import 'editor';
import './index.less';
namespace ParaphraseIndex {
	const table = new Table({
		el: $('#table'),
		checkbox: {
			data: 'id'
		},
		options: {
			ajax: {
				url: 'paraphrase/list',
				type: 'POST',
				data: (data: any) => {
					return {
						keyword: $.trim($('#keyword').val()),
						page: getPage(data),
						size: data.length
					};
				},
				dataSrc: function (data) {
					return data.rows;
				}
			},
			serverSide: true,
			paging: true,
			columns: [
				{ data: 'paraphraseType.typeName', title: '规则名称' },
				{ data: 'paraphraseRules', title: '规则内容', width: '70%', createdCell: (td, data) => { createAddTitle(td, getContent(data)); }, render: getContent },
				{ data: 'paraphraseType.tsp', title: '更新时间', render: renderTime }
			],
			initComplete: initComplete
		}
	});

	function getContent(data) {
		let str = data.map((v) => {
			return v.ptext;
		}).join(' | ');
		return str;
	}

	function renderTime(time: number) {
		return moment(time).format('YYYY-MM-DD');
	}

	function initComplete() {
		const dt = table.dt;
		const classifyData = selectData.classify.map((v) => {
			const d = {
				id: v.id,
				text: v.name,
				parent: v.parent
			};
			if (d.parent === 0) {
				d.parent = '#';
			}
			return d;
		});
		const classify = new ClassifyTree({
			el: $('#set-classify'),
			data: classifyData,
			selected: true
		});

		let typeId = null;

		const editor = new Editor({ el: $('#editor') });

		new SimpleDate({ el: $('#start-date'), date: moment() });
		new SimpleDate({ el: $('#end-date'), date: moment().add(5, 'year') });

		bindPageChange($('#table').DataTable(), $('#page-change'));
		bindEnter($('#lable-area'), () => {
			$('#preview-btn').click();

		});

		bindEnter($('#keyword'), () => {
			table.reload(true);
			// table.draw();
		});
		$('#add-repeat-btn').on('click', function () {
			window.location.href = 'knowledge/rehearsalReview/index';
		});
		$('#search-btn').on('click', () => {
			table.reload(true);
			// table.draw();
		});

		$('#del-btn').on('click', () => {
			const data = table.selected;
			if (!data || data.length <= 0) {
				alertMessage('请选择要删除的规则');
			}
			else {
				$('#del-modal').modal('show');
			}
		});

		$('#confirm-del-btn').on('click', () => {
			const data = table.selected;
			const ids = data.map((v) => {
				return v.paraphraseType.id;
			});
			$.ajax({
				url: 'paraphrase/delete',
				type: 'GET',
				data: {
					ids: ids.join(',')
				},
				success: (msg) => {
					alertMessage(msg.msg, msg.code);
					if (!msg.error) {
						table.reload();
						// table.draw();
					}
				}
			});
		});

		$('#add-btn').on('click', () => {
			location.href = ctx + '/paraphrase/update/index';
		});

		$('#update-btn').on('click', () => {
			const data = table.selected;
			if (data.length <= 0) {
				alertMessage('请选择要编辑的规则');
			}
			else if (data.length > 1) {
				alertMessage('只能选择一条规则');
			}
			else {
				location.href = `${ctx}/paraphrase/update/index?id=${data[0].paraphraseType.id}`;
			}
		});

		$('#produce-btn').on('click', () => {
			const data = table.selected;
			if (data.length <= 0) {
				alertMessage('请选择要生成复述的规则');
			}
			else if (data.length > 1) {
				alertMessage('只能选择一条规则');
			}
			else {
				const type = data[0].paraphraseType;
				let str = '';
				$('#produce-modal').modal('show');
				$('#rule-title').text(type.typeName);
				typeId = type.id;
				type.content.split(',').forEach(v => {
					str += `
                    <div class="form-group cloud-group">
                        <label class="cloud-input-title">${v}</label>
                        <div class="cloud-input-content">
                            <input type="text" class="form-control input-sm label-item" data-name="${v}">
                        </div>
                    </div>`;
				});
				$('#lable-area').html(str);
			}
		});

		$('#produce-modal').one('shown.bs.modal', () => {
			classify.adjustWidth();
		});

		$('#produce-modal').on('hidden.bs.modal', () => {
			typeId = null;
			$('#preview-area').empty();
			classify.selected = [classify.data[0].id];
			editor.editorElement.$txt.html('<p>无回复</p>');
		});

		$('#preview-btn').on('click', () => {
			if (typeId === null) {
				return;
			}
			else {
				const d = getTag();
				const btn = $('#preview-btn');
				if (d) {
					loadingBtn(btn);
					$.ajax({
						url: 'paraphrase/preview',
						type: 'POST',
						data: {
							typeid: typeId,
							tags: JSON.stringify(d)
						},
						success: msg => {
							if (msg.error) {
								alertMessage(msg.msg, !msg.error);
							}
							else {
								$('#preview-area').html(msg.msg.join('\r\n'));
							}
						},
						complete: () => {
							endLoadingBtn(btn);
						}
					});
				}
			}
		});

		$('#produce-save-btn').on('click', () => {
			const btn = $('#produce-save-btn'),
				tags = getTag(),
				editEl = editor.editorElement.$txt,
				text = $.trim(editEl.formatText()),
				html = editEl.html(),
				beginTime = $('#start-date').val(),
				endTime = $('#end-date').val(),
				data = {
					classifyid: classify.selected.join(','),
					status: 8,
					characterid: $('#character').val(),
					pushway: $('#pushway').val(),
					beginTime: beginTime,
					endTime: endTime,
					typeid: typeId
				};
			if (moment(beginTime).valueOf() >= moment(endTime).valueOf()) {
				alertMessage('失效时间不可早于生效时间');
			}
			else if (!tags) {
				return;
			}
			else if (!text) {
				alertMessage('请填写回复内容');
			}
			else {
				loadingBtn(btn);
				Object.assign(data, {
					tags: JSON.stringify(tags),
					plain_text: text,
					html_content: html
				});

				$.ajax({
					url: 'paraphrase/save2db',
					type: 'POST',
					data: data,
					success: (msg) => {
						alertMessage(msg.msg, !msg.error);
						if (!msg.error) {
							$('#produce-modal').modal('hide');
						}
					},
					complete: () => {
						endLoadingBtn(btn);
					}
				});

			}
		});



	}

	function getTag() {
		const data = $('#produce-modal .label-item').toArray();
		const d = {};
		let check = true;
		if (data.length <= 0) {
			check = false;
		}
		for (let i of data) {
			const el = $(i);
			const val = $.trim(el.val());
			if (val === '' || val === undefined) {
				alertMessage('请填写标签内容');
				check = false;
				break;
			}
			else {
				d[el.attr('data-name')] = val;
			}
		}
		if (!check) {
			return false;
		}
		else {
			return d;
		}
	}
}
