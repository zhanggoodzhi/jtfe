import { Table } from 'new-table';
import { cleanObject, alertMessage, loadingBtn } from 'utils';
import 'daterangepicker';
import './index.less';
namespace CorpusExportIndex {
	$(initTable);
	let recordTable;
	let thisPageRows;
	function initTable() {
		recordTable = new Table({
			el: $('#record-table'),
			options: {
				ajax: {
					type: 'GET',
					url: 'knowledge/corpus/export/list',
					dataSrc: function (data) {
						thisPageRows = data.rows;
						return thisPageRows;
					},
					data: function (d: any) {
						const data = {
							page: Math.floor((d.start + d.length) / d.length),
							rows: d.length
						};
						return cleanObject(data);
					}
				},
				serverSide: true,
				paging: true,
				rowId: 'id',
				columns: [
					{
						data: 'documentName',
						title: '文件名',
						width: '20%',
						render: (text) => {
							return `<div title=${text}>${text}</div>`;
						}
					},
					{
						data: 'documentSize',
						title: '文件大小',
						className: 'size',
						render: (text, type, record) => renderSize(record.status, text)
					},
					{
						data: 'rate',
						title: '导出进度',
						className: 'bar',
						render: (text, type, record) => {
							return `
							<div class="progress process-border" >
								<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:${text * 100}%">
								${text * 100}%
								</div>
							</div>
							`;
						}
					},
					{
						data: 'statuss',
						title: '状态',
						className: 'statuss'
					},
					{
						data: 'createTime',
						title: '创建时间',
						render: text => myRenderTime(text)
					},
					{
						data: 'finishTime',
						title: '完成时间',
						className: 'fTime',
						render: text => myRenderTime(text)
					},
					{
						data: 'status',
						title: '操作',
						className: 'opt',
						render: (text, type, record) => {
							switch (text) {
								case 0:
									return `<a href='javascript:;' data-id='${record.id}' class='td-abort'>终止</a>`;
								case 1:
									return `<a href='knowledge/corpus/export/result?id=${record.id}'>下载</a>&nbsp;&nbsp;<a href='javascript:;' data-id='${record.id}' class='td-delete'>删除</a>`;
								case 2:
									return `<a href='javascript:;' data-id='${record.id}' class='td-delete'>删除</a>`;
								default:
									return '后端数据问题';
							}
						}
					}
				],
				initComplete: initComplete
			}
		});
	}
	function initComplete() {
		bindDelete();
		bindConfirmDelete();
		bindAbort();
		bindConfirmAbort();
		bindRateExport();
	}
	// 删除模态框显示
	let deleteId;
	function bindDelete() {
		$('#record-table').on('click', '.td-delete', (e) => {
			deleteId = $(e.target).data('id');
			$('#delete-confirm-modal').modal('show');
		});
	}
	// 确认删除
	function bindConfirmDelete() {
		$('#delete-confirm-modal').on('click', '#delete-submit-btn', function () {
			const end = loadingBtn($(this));
			$.ajax({
				url: `knowledge/corpus/export/delete?ids=${deleteId}`,
				method: 'DELETE',
				success: (res) => {
					if (res.success) {
						recordTable.reload();
						$('#delete-confirm-modal').modal('hide');
					}
					end();
					alertMessage(res.msg, res.success);
				}
			});
		});
	}
	// 终止模态框显示
	let abortId;
	function bindAbort() {
		$('#record-table').on('click', '.td-abort', (e) => {
			abortId = $(e.target).data('id');
			$('#abort-confirm-modal').modal('show');
		});
	}
	// 确认终止
	function bindConfirmAbort() {
		$('#abort-confirm-modal').on('click', '#abort-submit-btn', function () {
			const end = loadingBtn($(this));
			$.ajax({
				url: `knowledge/corpus/export/stop?id=${abortId}`,
				method: 'PUT',
				success: (res) => {
					if (res.success) {
						recordTable.reload();
						$('#abort-confirm-modal').modal('hide');
					}
					end();
					alertMessage(res.msg, res.success);
				}
			});
		});
	}
	// 刷新导出进度
	let rateData;
	let exportFlag = true;
	let timeInterval;
	function bindRateExport() {
		if (exportFlag) {
			timeInterval = window.setInterval(bindRate, 5000);
		}
	}
	function bindRate() {
		$.ajax({
			url: 'knowledge/corpus/export/rate',
			method: 'GET',
			success: (res) => {
				if (res.success) {
					rateData = [...res.data];
					// 从后端获取新的进程数据，更改对应行显示内容
					refreshRate();
					// 只要有一个为0就返回为true，为true的时候，说明有一个正在导出，那就要调用rate；为false的时候就要终止循环
					exportFlag = rateData.some(v => {
						return v.status === 0;
					});
				} else {
					exportFlag = false;
					alertMessage(res.msg, res.success);
				}
				if (!exportFlag) {
					window.clearInterval(timeInterval);
				}
			}
		});
	}
	// 当前页的数据，刷新后的数据。对比他们的id，相等的时候，把刷新的数据的rate作为新的值，修改该单元格
	function refreshRate() {
		thisPageRows.forEach(v => {
			rateData.forEach(r => {
				if (v.id === r.id) {
					const dt = $('#record-table').DataTable();
					const row = $('#' + r.id);
					row.find('.size').html(renderSize(r.status, r.documentSize));
					dt.cell(row, '.bar').data(r.rate);
					dt.cell(row, '.statuss').data(r.statuss);
					dt.cell(row, '.fTime').data(r.finishTime);
					dt.cell(row, '.opt').data(r.status);
				}
			});
		});
	}
	function myRenderTime(time: string | Date | moment.Moment) {
		if (!time) {
			return '--';
		}
		return moment(time).format('YYYY-MM-DD HH:mm:ss');
	}
	function renderSize(status, size) {
		switch (status) {
			case 0:
				return '--';
			case 1:
				return size;
			case 2:
				// 已终止
				return '0.00KB';
			default:
				return '后端数据异常';
		}
	}
}
