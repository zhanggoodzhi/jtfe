import './allstatus.less';
import * as tables from 'tables';
import * as utils from 'utils';
let table: any;
let kbDetail: any;
export function initAllstatus(d) {
	kbDetail = d;
	utils.tabShown($('#allstatus-btn'), (e) => { initTable(); });
};

function initTable() {
	const tableEl = $('#allstatus-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/api/repository/list',
				data: function (d: any) {
					const data = {
						templateId: $('#allstatus-template').val(),
						keyword: $('#allstatus-keyword').val(),
						status: ($('#allstatus-status').val() as string[]).join(','),
						startDay: utils.clearTimeEmpty($('#allstatus-updatetime .date-start').val()),
						endDay: utils.clearTimeEmpty($('#allstatus-updatetime .date-end').val()),
						page: Math.floor((d.start + d.length) / d.length),
						size: d.length
					};
					d = utils.cleanObject(data);
					return d;
				}
			},
			columns: [
				{ data: 'knowledgeId', title: 'ID', createdCell: utils.createAddTitle },
				{ data: 'knowledgeName', title: '名称', createdCell: utils.createAddTitle },
				{ data: 'author', title: '作者' },
				{ data: 'status', title: '状态', width: '10%', render: utils.renderStatus },
				{ data: 'createAt', title: '创建时间', width: '10%', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'updateAt', title: '更新时间', width: '10%', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'knowledgeId', title: '操作', width: '5%', className: 'prevent', render: utils.renderCheckBtn }
			]
		},
		initComplete: initComplete
	});

	function initComplete() {
		utils.tabShown($('#allstatus-btn'), () => {
			this.reload();
		}, false);
		$('#allstatus-search').on('click', () => {
			table.reload();
		});
		$('#allstatus-clear').on('click', () => {
			$('#allstatus-keyword').val(null);
			$('#allstatus-template').val(null);
			$('#allstatus-status').val(null);
			$('#allstatus-updatetime .date-start').val(null);
			$('#allstatus-updatetime .date-end').val(null);
			utils.initDatePicker();
			utils.initSelect();
		});
		tableEl.on('click', '.view-detail', function (e) {
			kbDetail.table = table;
			kbDetail.init(utils.getDetailParams($(this)));
		});
	}
}

