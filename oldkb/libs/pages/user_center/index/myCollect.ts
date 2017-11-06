import './myCollect.less';
import * as utils from 'utils';
import * as tables from 'tables';
let table: any;
export function initMyCollect() {
	initTable();
}
function initTable() {
	const tableEl = $('#collect-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/api/collection/list',
				data: function (d: any) {
					const data = tables.extendsData(d, {
						content: $('#my-collect-keyword').val(),
						startDay: utils.clearTimeEmpty($('#my-collect-collectTime .date-start').val()),
						endDay: utils.clearTimeEmpty($('#my-collect-collectTime .date-end').val())
					});
					d = utils.cleanObject(data);
					return d;
				}
			},
			columns: [
				{ data: 'collectionId', title: 'ID', createdCell: utils.createAddTitle },
				{ data: 'knowledgeName', title: '标题' },
				{ data: 'createTime', title: '收藏时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'readNum', title: '阅读次数' },
				{ data: 'knowledgeId', title: '操作', className: 'prevent', render: utils.renderDeleteBtn }
			]
		},
		initComplete: initComplete
	});

	function initComplete() {
		utils.bindtabEvent('my-collect', () => {
			table.reload();
		});
		$('#kb-user h3[data-link="my-collect"]').on('click', function () {
			table.reload();
		});
		tableEl.on('click', '.view-delete', function (e) {
			utils.confirmModal('确认要删除吗?', (remove, end) => {
				$.ajax({
					url: '/api/collection/delete?knowledgeId=' + $(this).data('id'),
					method: 'DELETE',
					success: () => {
						utils.toast('删除成功');
						table.reload();
						remove();
					}
				});
			});
		});

		$('#my-collect-search').on('click', function () {
			table.reload();
		});

		$('#my-collect-clear').on('click', function () {
			const rangeTimeEl = $('#my-collect-collectTime');
			$('#my-collect-keyword').val(null);
			rangeTimeEl.find('.date-start').val(null);
			rangeTimeEl.find('.date-end').val(null);
		});
	}
}


