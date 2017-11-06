import * as utils from 'utils';
import { Table, extendsData } from 'new-table';

let table;
$('#default-answer-tab').one('shown.bs.tab', () => {
	table = new Table({
		el: $('#default-answer-table'),
		options: {
			ajax: {
				url: 'setting/app/defaultAnswer/list',
				type: 'POST',
				dataSrc: data => data.rows,
				data: data => {
					return extendsData(data, {
						keyword: $.trim($('#default-answer-keyword').val())
					});
				}
			},
			paging: true,
			serverSide: true,
			columns: [
				{ name: 'plainText', data: 'plainText', title: '回复内容' }
			],
			initComplete: () => {
				const editor = $('#answer-editor');
				$('#answer-search-btn').on('click', () => {
					table.reload(true);
				});

				$('#answer-del-btn').on('click', () => {
					const data = table.selected;

					if (data.length <= 0) {
						utils.alertMessage('请选择要删除的默认回复');
						return;
					}

					utils.confirmModal({
						msg: '确认删除选中默认回复吗?',
						cb: (modal, btn) => {
							const loading = utils.loadingBtn(btn);
							$.ajax({
								url: 'setting/app/defaultAnswer/delete',
								type: 'POST',
								data: {
									ids: data.map(v => v.id).join(',')
								},
								success: (msg) => {
									if (!msg.error) {
										modal.modal('hide');
										table.reload();
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

				$('#answer-edit-btn').on('click', () => {
					const data = table.selected;

					if (data.length < 1) {
						utils.alertMessage('请选择要编辑的默认回复');
					}
					else if (data.length > 1) {
						utils.alertMessage('只能编辑一个默认回复');
					}
					else {
						$('#answer-modal').modal('show')
							.find('.modal-title')
							.text('编辑默认回复');
						editor.html(data[0].contentHtml);
						editor.data('data', {
							id: data[0].id
						});
					}
				});

				utils.bindEnter($('#answer-keyword'), () => {
					table.reload();
				});
			}
		}
	});
});


export function submitDefaultAnswer(data, edit?: boolean) {
	const url = edit ? 'setting/app/defaultAnswer/update' : 'setting/app/defaultAnswer/add';
	const end = utils.loadingBtn($('#editor-yes-btn'));
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		success: (msg) => {
			if (!msg.error) {
				$('#answer-modal').modal('hide');
				table.reload();
			}
			utils.alertMessage(msg.msg, !msg.error);
		},
		complete: () => {
			end();
		}
	});

}
