import * as table from 'new-table';

const t = new table.Table({
	el: $('#table'),
	options: {
		ajax: {
			url: 'knowledge/export/list',
			dataSrc: res => res.rows
		},
		select: false,
		columns: [
			{ title: '文件名', data: 'documentName', width: '240px' },
			{ title: '文件容量', data: 'documentSize', width: '82px' },
			{ title: '任务来源', data: 'documentSource', width: '120px' },
			{ title: '导出条件', data: 'remark', createdCell: table.createAddTitle },
			{ title: '状态', data: 'status', render: renderStatus, width: '170px' }
		]
	}
});


function renderStatus(complete: boolean, type, row) {
	return complete ? `<div>任务已完成 <a href="knowledge/export/get?id=${row.id}">点此下载文件</a></div>` : '正在进行中...';
}
