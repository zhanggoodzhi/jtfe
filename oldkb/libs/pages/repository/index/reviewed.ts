import './reviewed.less';
import * as tables from 'tables';
import * as utils from 'utils';
let table: any;
let kbDetail: any;
export function initReviewed(d) {
	kbDetail = d;
	utils.tabShown($('#reviewed-btn'), (e) => { initTable(); });
};

function initTable() {
	const tableEl = $('#reviewed-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true, // 后端分页

			ajax: {
				method: 'GET',
				url: '/api/repository/list',
				//contentType:"application/x-www-form-urlencoded",
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = {
						templateId: null,
						keyword: $('#reviewed-keyword').val(),
						status: '3,4',
						startDay: utils.clearTimeEmpty($('#reviewed-updatetime .date-start').val()),
						endDay: utils.clearTimeEmpty($('#reviewed-updatetime .date-end').val()),
						page: Math.floor((d.start + d.length) / d.length),
						size: d.length
					};
					// const data = {
					// 	templateId: null,
					// 	keyword: null,
					// 	status: [3].join(","),
					// 	startDay: "2016-01-01",
					// 	endDay: "2017-01-29",
					// 	page: Math.floor((d.start + d.length) / d.length),
					// 	size: d.length
					// };
					d = utils.cleanObject(data);
					return d;
				}
			},
			columns: [
				{ data: 'knowledgeId', title: 'ID', createdCell: utils.createAddTitle },
				{ data: 'knowledgeName', title: '名称', createdCell: utils.createAddTitle },
				{ data: 'author', title: '作者', createdCell: utils.createAddTitle },
				{ data: 'status', width: '10%', title: '状态', render: utils.renderStatus },
				{ data: 'updateAt', width: '10%', title: '更新时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'knowledgeId', width: '5%', title: '操作', className: 'prevent', render: utils.renderCheckBtn }
			]
		},
		initComplete: function () {
			utils.tabShown($('#reviewed-btn'), () => {
				this.reload();
			}, false);
			$('#reviewed-search').on('click', () => {
				table.reload();
			});
			tableEl.on('click', '.view-detail', function (e) {
				kbDetail.table = table;
				kbDetail.init(utils.getDetailParams($(this)));
			});
		}
	});
}

