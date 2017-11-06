import './index.less';
import 'new-table';
import * as tables from 'tables';
import * as utils from 'utils';
import * as moment from 'moment';
namespace Weixinv2Index {
	let table: DataTables.Api;
	$(() => {
		initTable();
	});

    /**
     * 初始化表格
     */
	function initTable() {
		table = $('#table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					// select: true,
					ajax: {
						url: 'weixinv2/broadcast/list',
						type: 'GET',
						data: (data) => {
							return {
								page: tables.getPage(data),
								rows: data.length
							};
						},
						dataSrc: data => data.rows
					},
					initComplete: initComplete,
					columns: [
						{
							data: 'cover', title: '封面', render: (url) => `<div class="wx-cover" ${url ? 'style="background-image:url(' + url + ')"' : ''}></div>`
						},
						{ data: 'title', title: '标题', render: initTitle },
						{ data: 'group', title: '发送对象' },
						{ data: 'gender', title: '性别' },
						{ data: 'wechatName', title: '公众号' },
						{ data: 'status', title: '状态' },
						{ data: 'tsp', title: '时间', createdCell: tables.createAddTitle, render: (text) => { return moment(text).format('YYYY-MM-DD HH:mm:ss'); } }
					]
				}
			)
		);
	}
	function initTitle(text) {
		let msg: string = '';
		if (text.length) {
			text.forEach(function (value) {
				msg += '<p class="weixin-title force-width" title="' + value + '">' + value + '</p>';
			});
		}
		return '<div>' + msg + '</div>';
	}
	function initComplete() {
		const t = new tables.Table(table);
		tables.bindPageChange(table, $('#page-change'));
		// 重新推送审核请求
		$('#rebroadcast-btn').on('click', () => {
			tables.checkLength({
				table: table,
				action: '重新推送',
				name: '审核请求',
				unique: false,
				cb: (data) => {
					let statuses = [];
					data.forEach(v => {
						statuses.push(v.status);
					});
					function checkRefused(s) {
						return s === '群发请求被拒绝';
					}
					let isPassable: boolean = statuses.some(checkRefused);
					if (isPassable) {
						let ids = [];
						data.forEach(v => {
							ids.push(v.id);
						});
						$.ajax({
							url: 'weixinv2/broadcast/rebroadcast',
							data: { ids: ids.join(',') },
							type: 'GET',
							success: (datas) => {
								if (!datas.error) {
									t.refresh(true);
									utils.alertMessage('重新推送审核请求成功！', true);
								} else {
									utils.alertMessage(datas.msg);
								}

							}
						});
					} else {
						utils.alertMessage('请选择状态为“群发请求被拒绝”的记录！');
					}

				}
			});
		});
	};

}
