import * as utils from 'utils';
import 'new-table';
import 'daterangepicker';
import * as tables from 'tables';
namespace SuperadminAdminLoginInfoIndex {
	$(initTable);
	function initTable() {
		const date = new utils.CommonDate({ el: $('#date') }),
			width = tables.VARIABLES.width;
		$('#table').DataTable(Object.assign(tables.commonConfig(),
			{
				ajax: {
					url: 'superadmin/adminLoginInfo/list',
					type: 'POST',
					dataSrc: data => data.rows,
					data: data => {
						return utils.cleanObject({
							adminName: $('#user-name').val(),
							adminLoginIp: $('#ip-address').val(),
							loginResult: $('#login-result').val(),
							adminIpLocation: $('#location-address').val(),
							appid: $('#appid').val(),
							beginTime: date.getDate('start'),
							endTime: date.getDate('end'),
							page: tables.getPage(data),
							rows: data.length
						});
					}
				},
				columns: [
					{ data: 'appName', title: '应用' },
					{ data: 'adminUserName', title: '用户名' },
					{ data: 'adminIpLocation', title: '访问地点' },
					{ data: 'loginResult', title: '登陆结果' },
					{ data: 'adminLoginIp', title: 'IP地址' },
					{ data: 'adminLoginTime', title: '登录时间', width: width.commonTime, render: utils.renderCommonTime }
				],
				initComplete: initComplete
			}
		));
	}

	function initComplete() {
		const table = $('#table').DataTable();
		// 查询功能
		$('#search-btn').on('click', () => {
			table.draw();
		});

		tables.bindEnter(table, $('.cloud-search-area input'));

		tables.bindPageChange(table); // 绑定修改分页


	}
}
