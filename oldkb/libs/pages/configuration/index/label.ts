import * as utils from 'utils';
import {Table} from 'tables';
import * as labelDetial from './label-detail.pug';

export function initLabel() {
	const t = $('#label-table');
	new Table({
		el: t,
		options: {
			ajax: {
				url: '/api/label/list',
				dataSrc: (d) => d,
				data: (data) => {
					// return extendsData(data);
					return {};
				}
			},
			// data: [
			// 	{ id: 1, name: 'label1', introduction: 'introduction1' },
			// 	{ id: 2, name: 'label2', introduction: 'introduction2' }
			// ],
			// serverSide: true,
			columns: [
				{ data: 'id', title: 'id' },
				{ data: 'name', title: '名称' },
				{ data: 'id', title: '操作', className: 'prevent', render: renderAction }
			]
		},
		initComplete: function (dt) {
			utils.tabShown($('#label-link'), () => {
				this.reload();
			}, false);
			const showModal = (data?) => {
				const action = data ? '编辑' : '新建';
				utils.modal(action + '标签', labelDetial(data), '保存', (remove, end, modal) => {
					const name = modal.find('input[name="name"]').val().trim();
					let config;
					if (name === '') {
						utils.toast('请填写标签名');
						end();
						return;
					}
					if (!data) {
						config = {
							url: '/api/label/create',
							method: 'POST',
							data: {
								name: name
							}
						};
					} else {
						config = {
							url: '/api/label/update',
							method: 'PUT',
							contentType: 'application/json',
							data: JSON.stringify({
								name: name,
								id: data.id
							})
						};
					}


					$.ajax(config)
						.always(() => { end(); })
						.done(() => {
							utils.toast(action + '成功');
							this.reload();
							remove();
						});
				});
			};

			t.on('click', '.kb-edit', (e) => {
				const data = dt.row($(e.currentTarget).parents('tr')).data();
				showModal(data);
			})
				.on('click', '.kb-delete', (e) => {
					const data: any = dt.row($(e.currentTarget).parents('tr')).data();
					utils.confirmModal('确认删除改标签吗?', (remove, end) => {
						$.ajax(`/api/label/delete?${$.param({labelId: data.id})}`, {
							method: 'delete'
						})
							.always(() => {
								end();
							})
							.done(() => {
								utils.toast('删除成功');
								this.reload();
								remove();
							});
					});
				});

			$('#add-label-btn').on('click', () => {
				showModal();
			});
		}
	});
}





function renderAction(id: number) {
	return `<i class='kb-icon kb-edit'></i><i class='kb-icon kb-delete'></i>`;
}
