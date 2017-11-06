import './myKnowledge.less';
import * as utils from 'utils';
import * as tables from 'tables';
let table: any;
let kbDetail: any;
let kbEdit: any;
export function initMyKnowledge(d, e) {
	kbDetail = d;
	kbEdit = e;
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
	const tableEl = $('#knowledge-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/api/repository/mylist',
				data: function (d: any) {
					const data = tables.extendsData(d, {
						keyword: $('#my-knowledge-keyword').val(),
						status: ($('#my-knowledge-status').val() as string[]).join(','),
						startDay: utils.clearTimeEmpty($('#my-knowledge-updatetime .date-start').val() as string),
						endDay: utils.clearTimeEmpty($('#my-knowledge-updatetime .date-end').val() as string)
					});
					d = utils.cleanObject(data);
					return d;
				}
			},
			columns: [
				{ data: 'knowledgeId', title: 'ID', createdCell: utils.createAddTitle },
				{ data: 'knowledgeName', title: '标题', createdCell: utils.createAddTitle },
				{ data: 'directoryName', title: '分类' },
				{ data: 'updateAt', title: '更新时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'reviewname', title: '当前审核者' },
				{ data: 'status', title: '审核状态', render: utils.renderStatus },
				{ data: 'remarks', title: '审核备注', createdCell: utils.createAddTitle },
				{ data: 'knowledgeId', title: '操作', className: 'prevent', render: utils.renderCheckBtn }
			]
		},
		initComplete: initComplete
	});

	function initComplete() {
		utils.bindtabEvent('my-knowledge', () => {
			table.reload();
		});
		$('#kb-user h3[data-link="my-knowledge"]').on('click', function () {
			table.reload();
		});
		tableEl.on('click', '.view-detail', function (e) {
			kbDetail.table = table;
			kbDetail.init(utils.getDetailParams($(this)));
		});
		$('#my-knowledge-search').on('click', function () {
			table.reload();
		});
		$('#my-knowledge-clear').on('click', function () {
			const rangeTimeEl = $('#my-knowledge-updatetime');
			const selectEl = $('#my-knowledge-status');
			$('#my-knowledge-keyword').val(null);
			selectEl.val(null);
			selectEl.material_select();
			rangeTimeEl.find('.date-start').val(null);
			rangeTimeEl.find('.date-end').val(null);
		});
		$('#knowledge-add-btn').on('click', 'li', function () {
			const templateId = $(this).find('a').attr('data-id');
			kbEdit.showAdd(templateId);
		});
	}
}

