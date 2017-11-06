import './myDraft.less';
import * as utils from 'utils';
import * as tables from 'tables';
let table: any;
let kbDetail: any;
let kbEdit: any;
export function initMyDraft(d, e) {
	kbDetail = d;
	kbEdit = e;
	initTable();
}
function initTable() {
	const tableEl = $('#draft-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/api/repository/mylist',
				data: function (d: any) {
					const data = tables.extendsData(d, {
						status: 1
					});
					d = utils.cleanObject(data);
					return d;
				}
			},
			columns: [
				{ data: 'knowledgeId', title: 'ID', createdCell: utils.createAddTitle },
				{ data: 'knowledgeName', title: '标题' },
				{ data: 'directoryName', title: '分类' },
				{ data: 'updateAt', title: '更新时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'knowledgeId', title: '操作', className: 'prevent', render: utils.renderCheckBtn }
			]
		},
		initComplete: initComplete
	});

	function initComplete() {
		utils.bindtabEvent('draft-box', () => {
			table.reload();
		});
		tableEl.on('click', '.kb-check', function (e) {
			kbDetail.table = table;
			kbDetail.init(utils.getDetailParams($(this)));
		});
		$('#draft-add-btn').on('click', 'li', function () {
			const templateId = $(this).find('a').attr('data-id');
			kbEdit.showAdd(templateId);
		});
	}
}
