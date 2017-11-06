import './unreviewed.less';
import * as tables from 'tables';
import * as utils from 'utils';
let table: any;
let kbDetail: any;
export function initUnreviewed(d) {
	kbDetail = d;
	utils.tabShown($('#unreviewed-btn'), (e) => { initTable(); });
};

function initTable() {
	const tableEl = $('#unreviewed-table');
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
					const data = {
						templateId: null,
						keyword: $('#unreviewed-keyword').val(),
						status: 2,
						reviewPage: true,
						startDay: utils.clearTimeEmpty($('#unreviewed-updatetime .date-start').val()),
						endDay: utils.clearTimeEmpty($('#unreviewed-updatetime .date-end').val()),
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
				{ data: 'createAt', title: '更新时间', width: '10%',  createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'knowledgeId', title: '操作', width: '5%',  className: 'prevent', render: utils.renderCheckBtn }
			]
		},
		initComplete: function () {
			utils.tabShown($('#unreviewed-btn'), () => {
				this.reload();
			}, false);
			$('#unreviewed-search').on('click', () => {
				table.reload();
			});
			$('#allPass').on('click', () => {
				const ids = table.dt.rows('.selected').data().toArray().map((v) => {
					return v.knowledgeId;
				});
				utils.confirmModal('确定要批量通过么？', (remove) => {
					$.ajax({
						method: 'PUT',
						url: `/review/auditall`,
						processData: false,
						contentType: 'application/json',
						data: JSON.stringify({
							knowledgeIds: ids,
							result: 1
						}),
						success: (data) => {
							utils.toast('已批量通过审核');
							remove();
							table.reload();
						}
					});
				});
			});
			$('#allRefuse').on('click', () => {
				const ids = table.dt.rows('.selected').data().toArray().map((v) => {
					return v.knowledgeId;
				});
				utils.confirmModal('确定要批量驳回么？', (remove) => {
					$.ajax({
						method: 'PUT',
						url: `/review/auditall`,
						processData: false,
						contentType: 'application/json',
						data: JSON.stringify({
							knowledgeIds: ids,
							result: 0
						}),
						success: (data) => {
							utils.toast('批量驳回成功');
							remove();
							table.reload();
						}
					});
				});
			});
			tableEl.on('click', '.view-detail', function (e) {
				kbDetail.table = table;
				kbDetail.init(utils.getDetailParams($(this)));
			});
		}
	});
}

