import './filed.less';
import * as tables from 'tables';
import * as utils from 'utils';
let table: any;
let kbDetail: any;
export function initFiled(d) {
	kbDetail = d;
	utils.tabShown($('#filed-btn'), (e) => { initTable(); });
};

function initTable() {
	const tableEl = $('#filed-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true, // 后端分页
			ajax: {
				method: 'GET',
				url: '/api/repository/list',
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					// const data = {
					// 	templateId: null,
					// 	keyword:null,
					// 	status: 5,
					// 	startDay: "2016-01-01",
					// 	endDay: "2017-01-29",
					// 	page: Math.floor((d.start + d.length) / d.length),
					// 	size: d.length
					// };
					const data = {
						templateId: $('#filed-template').val(),
						keyword: $('#filed-keyword').val(),
						status: 5,
						startDay: utils.clearTimeEmpty($('#filed-updatetime .date-start').val()),
						endDay: utils.clearTimeEmpty($('#filed-updatetime .date-end').val()),
						page: Math.floor((d.start + d.length) / d.length),
						size: d.length
					};
					d = utils.cleanObject(data);
					return d;
				}
			},
			columns: [
				{ data: 'knowledgeId', title: 'ID' },
				{ data: 'knowledgeName', title: '名称' },
				{ data: 'author', title: '作者' },
				{ data: 'updateAt', title: '归档时间', width: '10%', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'knowledgeId', title: '操作', width: '5%', className: 'prevent', render: utils.renderCheckBtn }
			]
		},
		initComplete: initComplete
	});

	function initComplete() {
		utils.tabShown($('#filed-btn'), () => {
			this.reload();
		}, false);
		$('#filed-search').on('click', () => {
			table.reload();
		});
		tableEl.on('click', '.view-detail', function (e) {
			kbDetail.table = table;
			kbDetail.init(utils.getDetailParams($(this)));
		});
	}
}

