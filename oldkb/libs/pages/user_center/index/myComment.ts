import './myComment.less';
import * as utils from 'utils';
import * as tables from 'tables';
let table: any;
export function initMyComment() {
	initDatePicker();
	initTable();
}
function initDatePicker() {
	$('.datepicker').pickadate({
		selectMonths: true,
		selectYears: 15
	});
}
function initTable() {
	const tableEl = $('#comment-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/api/comment/mylist',
				data: function (d: any) {
					const data = tables.extendsData(d, {
						knowledgeName: $('#my-comment-keyword').val(),
						content: $('#my-comment-content').val(),
						startDay: utils.clearTimeEmpty($('#my-comment-commentTime .date-start').val()),
						endDay: utils.clearTimeEmpty($('#my-comment-commentTime .date-end').val())
					});
					d = utils.cleanObject(data);
					return d;
				}
			},
			columns: [
				{ data: 'commentId', title: 'ID', createdCell: utils.createAddTitle },
				{ data: 'knowledgeName', title: '标题' },
				{ data: 'content', title: '内容', createdCell: utils.createAddTitle },
				{ data: 'createTime', title: '评论时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'commentId', title: '操作', className: 'prevent', render: utils.renderDeleteBtn }
			]
		},
		initComplete: initComplete
	});

	function initComplete() {
		utils.bindtabEvent('my-comment', () => {
			table.reload();
		});
		$('#kb-user h3[data-link="my-comment"]').on('click', function () {
			table.reload();
		});
		tableEl.on('click', '.view-delete', function (e) {
			utils.confirmModal('确认要删除吗?', (remove, end) => {
				$.ajax({
					url: '/api/comment/delete?commentId=' + $(this).data('id'),
					method: 'DELETE',
					success: () => {
						utils.toast('删除成功');
						table.reload();
						remove();
					}
				});
			});
		});
		$('#my-comment-search').on('click', function () {
			table.reload();
		});
		$('#my-comment-clear').on('click', function () {
			const rangeTimeEl = $('#my-comment-commentTime');
			$('#my-comment-keyword').val(null);
			$('#my-comment-content').val(null);
			rangeTimeEl.find('.date-start').val(null);
			rangeTimeEl.find('.date-end').val(null);
		});
	}
}


