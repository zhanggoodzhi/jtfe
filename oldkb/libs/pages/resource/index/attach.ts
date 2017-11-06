import * as tables from 'tables';
import * as utils from 'utils';
import './attach.less';

export function initAttach() {
	utils.tabShown($('#attach-link'), (e) => { init(); });
};
let table: any;

function init() {
	// 表格初始化
	const tableEl = $('#attach-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/attach/listfile',
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = tables.extendsData(d, utils.getSearchAtachParams('attach'));
					const newData = utils.cleanObject(data);
					return newData;
				}
			},
			columns: [
				{ data: 'id', title: 'ID', createdCell: utils.createAddTitle },
				{ data: 'filename', title: '附件名称', createdCell: utils.createAddTitle },
				{ data: 'url', title: '链接地址' },
				{ data: 'filesize', title: '附件大小', createdCell: utils.createAddTitle },
				{ data: 'createAt', title: '上传时间', createdCell: utils.createAddTitle, render: utils.renderTime }
				// { data: 'materialId', title: '操作', className: 'prevent', render: utils.renderEditAndDeleteBtn }
			]
		},
		initComplete: initComplete
	});
}

function initComplete() {
	utils.tabShown($('#attach-link'), () => {
		this.reload();
	}, false);
	// 查询功能
	$('#attach-search').on('click', () => {
		this.reload();
	});
}
