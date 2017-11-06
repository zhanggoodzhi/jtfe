import * as utils from 'utils';
import { Table, extendsData } from 'new-table';


interface IAnswerOption {
	name: string;
	urlName: string;
	nameText: string;
	addState: number;
	editState: number;
	method?: string;
}
export class Answer {
	private _table: Table;
	private _options: IAnswerOption;

	constructor(options: IAnswerOption) {
		this._options = options;
		this.init();
	}

	init() {
		const op = this._options;
		$(`#${op.name}-answer-tab`).one('shown.bs.tab', () => {
			this._table = new Table({
				el: $(`#${op.name}-answer-table`),
				options: {
					ajax: {
						url: `setting/app/${op.urlName}/list`,
						type: 'POST',
						dataSrc: data => data.rows,
						data: data => {
							return extendsData(data, {
								keyword: $.trim($(`#${op.name}-answer-keyword`).val())
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
						$(`#${op.name}-answer-search-btn`).on('click', () => {
							this._table.reload(true);
						});

						$(`#${op.name}-answer-del-btn`).on('click', () => {
							const data = this._table.selected;

							if (data.length <= 0) {
								utils.alertMessage(`请选择要删除的${op.nameText}`);
								return;
							}

							utils.confirmModal({
								msg: `确认删除选中${op.nameText}吗?`,
								cb: (modal, btn) => {
									const loading = utils.loadingBtn(btn);
									$.ajax({
										url: `setting/app/${op.urlName}/delete`,
										type: 'POST',
										data: {
											ids: data.map(v => v.id).join(',')
										},
										success: (msg) => {
											if (!msg.error) {
												modal.modal('hide');
												this._table.reload();
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

						$(`#${op.name}-answer-edit-btn`).on('click', () => {
							const data = this._table.selected;

							if (data.length < 1) {
								utils.alertMessage(`请选择要编辑的${op.nameText}`);
							}
							else if (data.length > 1) {
								utils.alertMessage(`只能编辑一个${op.nameText}`);
							}
							else {
								$(`#answer-modal`).modal('show')
									.find('.modal-title')
									.text(`编辑${op.nameText}`);
								editor.html(data[0].contentHtml);
								editor.data('data', {
									id: data[0].id
								});
							}
						});

						utils.bindEnter($(`#${op.name}-answer-keyword`), () => {
							this._table.reload();
						});
					}
				}
			});
		});
	}

	public submit = (data, edit?: boolean) => {
		const op = this._options;
		const url = edit ? `setting/app/${op.urlName}/update` : `setting/app/${op.urlName}/add`;
		const end = utils.loadingBtn($('#editor-yes-btn'));
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			success: (msg) => {
				if (!msg.error) {
					$('#answer-modal').modal('hide');
					this._table.reload();
				}
				utils.alertMessage(msg.msg, !msg.error);
			},
			complete: () => {
				end();
			}
		});
	}


	get state() {
		return {
			add: this._options.addState,
			edit: this._options.editState
		};
	}
}
