import * as utils from 'utils';
import * as tables from 'tables';
let table;
let ifSortable = false;
export function initCheck() {
	utils.setScroll();
	const el = $('#check-table');
	table = new tables.Table({
		el: el,
		options: {
			scrollY: getScrollY(),
			ajax: {
				method: 'GET',
				url: '/api/review/order/list',
				dataSrc: (d) => {
					return d;
				}
			},
			columns: [
				{ data: 'index', title: '审核顺序' },
				{ data: 'userid', title: 'ID', className: 'userid-item' },
				{ data: 'username', title: '审核者' },
				{ data: 'userid', title: '操作', render: utils.renderDeleteBtn }
			],
			rowReorder: {
				dataSrc: 'index',
				selector: 'tr'
			},
			ordering: true,
			order: [[0, 'asc']],
			columnDefs: [
				{ orderable: false, targets: '_all' }
			]
		},
		initComplete: function (dt) {
			setTimeout(() => {
				table.dt.rowReorder.disable();
				renderStepBar();
			}, 0);
			el.on('row-reordered.dt', (e, diff, edit) => {
				const end = this.loading();
				setTimeout(() => {
					end();
				}, 30);
			});
			$('#add-check-user-btn').on('click', () => {
				$.ajax({
					method: 'GET',
					url: '/api/member/user/listAll',
					success: (data) => {
						const options = data.map((v) => {
							return `<option value="${v.id}">${v.alias}</option>`;
						});
						utils.modal('添加审核者', `
				<form class="clearfix">
					<div class="input-field col s12">
						<select id="review-select"><option value="" disabled selected>请选择审核者</option>${options}</select>
					</div>
				</form>
				`, '确定', (remove, end, modal) => {
								const name = modal.find('#review-select').val();
								if (name === '' || name === null) {
									utils.toast('请填写审核者');
									end();
									return;
								}
								$.ajax({
									method: 'POST',
									url: '/api/review/order/add',
									data: {
										userid: name
									},
									success: () => {
										remove();
										this.reload();
									}
								});
							}, () => { utils.initSelect(); });
					}
				});
			});
			$('#edit-check-flow-btn').on('click', function () {
				const el = $(this);
				if (ifSortable) {
					const userids = [];
					$('#check-tab td.userid-item').each((i, e) => {
						userids.push($(e).text());
					});
					table.dt.rowReorder.disable();
					utils.confirmModal('确认保存审核顺序吗?', (remove, end) => {
						$.ajax({
							url: '/api/review/order/swap',
							method: 'PUT',
							data: {
								userids: userids.join(',')
							},
							success: () => {
								utils.toast('保存审核顺序成功');
								remove();
								table.reload(true, () => {
									console.log('reload完毕');
									renderStepBar();
								});
								el.text('编辑审核顺序');
							}
						});
					});
				} else {
					table.dt.rowReorder.enable();
					el.text('保存审核顺序');
				}
				ifSortable = !ifSortable;
			});
			el.on('click', '.kb-delete', function () {
				utils.confirmModal('确认删除改标签吗?', (remove, end) => {
					$.ajax({
						url: '/api/review/order/delete',
						method: 'POST',
						data: {
							userid: $(this).data('id')
						},
						success: () => {
							utils.toast('删除成功');
							remove();
							table.reload();
						}
					});
				});
			});
		}
	} as any);
}
function renderStepBar() {
	const el = $('#check-tab .kb-step-wrap ul');
	el.html('');
	table.dt.ajax.json().map((v, i) => {
		el.append(`
		<li class="active">
			<span class="circle">${i + 1}</span>
			<span class="text ellipsis" title="${v.username}">${v.username}</span>
			<span class="line"></span>
		</li>
		`);
	});
}
function getScrollY() {
	const tableHeight = $('.kb-scroll:visible').outerHeight();
	return tableHeight - 296 + '';
}


