import { Table, extendsData } from 'new-table';
import * as utils from 'utils';
interface ICharacterSubmitData {
	id?: number;
	vname: string;
	content: string;
	label: string;
	gender: string;
}
const formList = [
	{
		name: 'vname',
		el: '#name',
		require: true
	},
	{
		name: 'content',
		el: '#description',
		require: false
	},
	{
		name: 'label',
		el: '#label',
		require: false
	},
	{
		name: 'gender',
		el: '#gender',
		require: false
	}
];

let submitData;

$('#character-tab').one('shown.bs.tab', () => {
	const table = new Table({
		el: $('#character-table'),
		options: {
			ajax: {
				url: 'setting/app/character/list',
				type: 'POST',
				dataSrc: data => data.rows,
				data: data => {
					return extendsData(data, {
						keyword: $.trim($('#character-keyword').val())
					});
				}
			},
			columns: [
				{ width: '20px', render: (data, type, full, meta) => meta.row + 1 },
				{ name: 'vname', data: 'vname', title: '角色名称' },
				{ name: 'gender', data: 'gender', title: '性别', width: '60px', render: renderGender },
				{ name: 'label', data: 'label', title: '标签' },
				{ name: 'content', data: 'content', title: '描述', width: '32%' }
			],
			paging: true,
			serverSide: true,
			initComplete: () => {
				const detailModal = $('#detail-modal');
				$('#character-search-btn').on('click', () => {
					table.reload(true);
				});

				$('#character-del-btn').on('click', () => {
					const d = table.selected;

					if (d.length <= 0) {
						utils.alertMessage('请选择要删除的角色');
					}
					else {
						utils.confirmModal({
							msg: '确认删除选中角色吗?',
							cb: (modal, btn) => {
								const loading = utils.loadingBtn(btn);
								$.ajax({
									url: 'setting/app/character/delete',
									type: 'POST',
									data: { ids: d.map(v => v.id).join(',') },
									success: (msg) => {
										utils.alertMessage(msg.msg, !msg.error);
										if (!msg.error) {
											modal.modal('hide');
											table.reload();
										}
									},
									complete: () => {
										loading();
									}
								});
							}
						});
					}
				});

				$('#character-add-btn').on('click', () => {
					detailModal.modal('show')
						.find('.modal-title')
						.text('添加角色');
					submitData = {} as any;
				});

				$('#character-edit-btn').on('click', () => {
					const d = table.selected;
					if (d.length <= 0) {
						utils.alertMessage('请选择要编辑的角色');
					}
					else if (d.length > 1) {
						utils.alertMessage('只能编辑一个角色');
					}
					else {
						detailModal.modal('show')
							.find('.modal-title')
							.text('编辑角色');
						fillSubmitData(d[0]);
						submitData = {
							id: d[0].id
						} as any;
					}
				});

				$('#submit-btn').on('click', () => {
					const btn = $('#submit-btn');
					if (!submitData || !updateSubmitData()) {
						return;
					}
					const edn = utils.loadingBtn(btn);
					const bool = submitData.hasOwnProperty('id') ? false : true;
					$.ajax({
						url: submitData.hasOwnProperty('id') ? 'setting/app/character/update' : 'setting/app/character/add',
						type: 'POST',
						data: utils.cleanObject(submitData),
						success: (msg) => {
							utils.alertMessage(msg.msg, !msg.error);
							if (!msg.error) {
								$('#detail-modal').modal('hide');
								table.reload(bool);
							}
						},
						complete: () => {
							edn();
						}
					});
				});

				detailModal.on('hidden.bs.modal', () => {
					submitData = null;
					$('#name,#label,#description').val('');
					$('#gender').val('3');
				});

				utils.bindEnter($('#character-keyword'), () => {
					table.reload();
				});

			}
		}
	});
});

function updateSubmitData() {
	for (let v of formList) {
		const el = $(v.el);
		const val = $.trim(el.val());
		if (val === '' && v.require) {
			utils.alertMessage(`${el.parents('.form-group').find('.cloud-input-title').text()}不能为空`);
			return false;
		} else {
			submitData[v.name] = val;
		}
	}
	return true;
}

function fillSubmitData(data) {
	for (let v of formList) {
		$(v.el).val(data[v.name]);
	}
}

function renderGender(id: number) {
	switch (id) {
		case 1:
			return '男';
		case 2:
			return '女';
		default:
			return '未知';
	}
}
