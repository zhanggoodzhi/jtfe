import * as utils from 'utils';
import 'new-table';
import * as tables from 'tables';
import 'primary';
import './index.less';
namespace Appswitch {
	interface IAppStatus {
		code: number;
		desc: string;
		name: string;
	}
	declare const appStatus: IAppStatus[];
	$(() => {
		initTable();
	});

	function initTable() {
		$('#table').DataTable(Object.assign(
			tables.commonConfig('single'),
			{
				ajax: {
					type: 'POST',
					url: 'applist',
					dataSrc: data => data.rows,
					data: data => {
						return utils.cleanObject({
							page: tables.getPage(data),
							rows: data.length,
							status: $('#app-status').val(),
							keyword: $.trim($('#app-name').val()),
							appId: $.trim($('#app-number').val())
						});
					}
				},
				scrollY: window.innerHeight - 240,
				columns: [
					{ name: 'id', data: 'id', title: '应用编号', width: '20%' },
					{ name: 'appName', data: 'appName', title: '应用名称', width: '20%' },
					{ name: 'appReadme', data: 'appReadme', title: '描述信息' },
					{ name: 'checked', data: 'checked', title: '状态', width: '10%', render: renderStatus }
				],
				initComplete: initComplete
			}
		));
	}

	function initComplete() {
		const table = $('#table').DataTable();
		const t = new tables.Table(table);
		$('#search-btn').on('click', () => {
			// table.draw();
			t.refresh(true);
		});

		tables.bindPageChange(table, $('#page-change'));

		table.on('select', (e, dt) => {
			const data = tables.getSelected(dt)[0];
			if (!data) {
				return;
			}
			const endLoading = utils.addLoadingBg($('.x_panel'), $('.x_content'));
			$.ajax({
				type: 'POST',
				url: 'chooseApp',
				data: {
					'appId': data.id,
					'appRead': data.appName
				},
				success: (msg) => {
					if (!msg.error) {
						location.assign(`${ctx}/index`);
					}
					else {
						utils.alertMessage(msg.msg, !msg.error);
						endLoading();
					}
				},
				error: (err) => {
					utils.alertMessage(`系统错误, 请刷新页面后重试或联系管理员\n错误信息:${err.statusText}\n错误状态码:${err.status}`);
					endLoading();
				}
			});
		});


		utils.bindInput($('#app-number'), 'input', (val) => {
			$('#app-number').val(val.replace(/\D/g, ''));
		}, 100);

		utils.bindEnter($('#app-number,#app-name'), () => {
			t.refresh(true);
			// table.draw();
		});
	}

	function renderStatus(status) {
		for (let v of appStatus) {
			if (status === v.code) {
				return v.name;
			}
		}
		return '无数据';
	}
}
