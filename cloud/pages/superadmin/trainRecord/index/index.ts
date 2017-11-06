
import './index.less';
import * as utils from 'utils';
import * as newTables from 'new-table';
import * as tables from 'tables';
import 'daterangepicker';
import { bindEnter, alertMessage, cleanObject, loadingBtn, renderSimpleTime, forbidEnterAutoSubmit } from 'utils';
namespace SuperadminTrainRecordIndex {
	(function () {
		initTable();
	})();
	let recordTable;
	let sideBar;
	function initTable() {
		const date = new utils.CommonDate({ el: $('#date') });
		recordTable = new newTables.Table({
			el: $('#train-table'),
			options: {
				serverSide: true,
				paging: true,
				ajax: {
					url: 'superadmin/trainRecord/list',
					type: 'POST',
					dataType: 'json',
					dataSrc: (data) => {
						return data.rows;
					},
					data: (data) => {
						return cleanObject({
							page: tables.getPage(data),
							rows: parseInt($('#page-change').val().trim()),
							appid: $.trim($('#appid').val()),
							adminUser: $.trim($('#admin-user').val()),
							result: $.trim($('#train-result').val()),
							startTime: date.getDate('start'),
							endTime: date.getDate('end')
						});
					}
				},
				initComplete: initcomplete,
				columns: [
					{ data: 'checked', title: '', render: (text) => { if (text === 1) { return '<div class="red-point"></div>'; } else { return ''; } }, width: '5px' },
					{ data: 'appName', title: '应用' },
					{ data: 'adminUserName', title: '用户名' },
					{ data: 'statusValue', title: '训练结果' },
					{ data: 'msg', title: '备注' },
					{ data: 'createTime', title: '开始训练时间', width: (tables as any).VARIABLES.width.commonTime },
					{ data: 'updateTime', title: '结束训练时间', width: (tables as any).VARIABLES.width.commonTime },
					{ data: 'id', title: '操作', className: 'prevent', render: text => { return `<a href='javascript:;' data-id='${text}' class='detail-btn'>查看详情</a>`; } }
				]
			}
		});
	}
	function initcomplete() {
		bindeSearch();
		bindDetail();
		const t = $('#train-table').DataTable();
		utils.bindEnter($('.cloud-search-area input#admin-user'), () => {
			recordTable.reload();
		});
		tables.bindPageChange(t);
	}
	// 查询功能
	function bindeSearch() {
		$('#search-btn').on('click', () => {
			recordTable.reload();
		});
	}
	// 查看详情
	function bindDetail() {
		$('#train-table').on('click', '.detail-btn', function (e) {
			const id = $(e.target).data('id');
			$.ajax({
				url: 'superadmin/trainRecord/detail',
				data: { id },
				success: (res) => {
					if (res.code === '200') {
						initSider(res.msg);
						sideBar.show();
						$(e.target).parent('td').parent('tr').find('.red-point').removeClass('red-point');
						if (!res.msg.remains) {
							$('.cloud-menu-sign:parent(a[href="superadmin/trainRecord/index"])').removeClass('cloud-menu-sign');
						}

					} else {
						utils.alertMessage('详情获取失败！', false);
					}
				}
			});
		});
	}
	function initSider(detailData) {
		sideBar = new utils.SideBar({
			id: 'record-detail',
			title: '训练详情',
			content: `
				<div>
					<p>应用：${detailData.appName}</p>
					<p>用户名：${detailData.adminUserName}</p>
					<p>开始训练时间：${detailData.createTime}</p>
					<p>结束训练时间：${detailData.updateTime}</p>
					<p>训练结果：${detailData.statusValue}</p>
					<p>结果详情</p>
					<hr style='margin-top:10px;margin-bottom:10px;'/>
					<p>${detailData.msg}</p>
				</div>
			`
		});
	}
}

