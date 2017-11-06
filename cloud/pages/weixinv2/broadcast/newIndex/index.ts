import 'new-table';
import 'select';
import 'daterangepicker';
import './index.less';
import * as tables from 'tables';
import * as utils from 'utils';
declare const wechatCredentials;
declare const status;
namespace Weixinv2NewIndex {
	let table: DataTables.Api, date;
	$(() => {
		initSelectA();
		initTable();
	});
    /**
     * 初始化表格
     */
	function initTable() {
		date = new utils.CommonDate({
			el: $('#form-date')
		});
		table = $('#table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					// select: true,
					ajax: {
						url: 'weixinv2/broadcast/newlist',
						type: 'GET',
						data: (data) => {
							const d = {
								startDay: date.getDate('start'),
								endDay: date.getDate('end'),
								title: $('#title').val(),
								wxName: $('#weixin-account option:selected').val(),
								page: tables.getPage(data),
								rows: data.length
							};
							return utils.cleanObject(d);
						},
						dataSrc: data => data.rows
					},
					initComplete: initComplete,
					columns: [
						{ data: 'title', title: '标题', render: initTitle },
						{ data: 'wechatName', title: '公众号' },
						{ data: 'tsp', title: '发送时间', createdCell: tables.createAddTitle, render: utils.renderCommonTime, width: tables.VARIABLES.width.commonTime },
						{ data: 'sataDate', title: '更新时间', render: utils.renderCommonTime, width: tables.VARIABLES.width.commonTime },
						{ data: 'targetUser', title: '送达人数', width: 70 },
						{ data: 'pageReadCount', title: '阅读数', width: 70 },
						{ data: 'oripageReadCount', title: '查看原文数', width: 70 },
						{ data: 'shareCount', title: '分享数', width: 70 },
						{ data: 'favCount', title: '收藏数', width: 70 },
						{ data: 'countNewUser', title: '新增用户', width: 70 },
						{ data: 'countCancelUser', title: '取关数', width: 70 }
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
		utils.bindEnter($('#title'), () => { t.refresh(true); });
		tables.bindPageChange(table, $('#page-change'));
		$('#search-btn').on('click', () => {
			t.refresh(true);
		});
		// 更新统计数
		$('#updateStat-btn').on('click', function () {
			tables.checkLength({
				table: table,
				action: '更新',
				name: '统计数',
				unique: false,
				cb: (data) => {
					const endLoading = utils.loadingBtn($(this));
					// 获取选中行id，传给后端
					let ids = [];
					data.forEach(v => {
						ids.push(v.id);
					});
					$.ajax({
						url: 'weixinv2/broadcast/updateStat',
						data: { ids: ids.join(',') },
						type: 'GET',
						success: (datas) => {
							if (!datas.error) {
								t.refresh(true);
								utils.alertMessage('更新统计数成功！', true);
							} else {
								utils.alertMessage(datas.msg);
							}
						},
						complete: () => {
							endLoading();
						}


					});
				}
			});
		});
		// 合计
		const root = $('#count-modal');
		$('#count-btn').on('click', () => {
			tables.checkLength({
				table: table,
				action: '合计',
				name: '选中的记录',
				unique: false,
				cb: (data) => {
					let targetUsers = 0,
						pageReadCounts = 0,
						oripageReadCounts = 0,
						shareCounts = 0,
						favCounts = 0,
						countNewUsers = 0,
						countCancelUsers = 0;
					data.forEach(v => {
						targetUsers = targetUsers + v.targetUser;
						pageReadCounts = pageReadCounts + v.pageReadCount;
						oripageReadCounts = oripageReadCounts + v.oripageReadCount;
						shareCounts = shareCounts + v.shareCount;
						favCounts = favCounts + v.favCount;
						countNewUsers = countNewUsers + v.countNewUser;
						countCancelUsers = countCancelUsers + v.countCancelUser;
					});
					$('.targetUsers').text(targetUsers);
					$('.pageReadCounts').text(pageReadCounts);
					$('.oripageReadCounts').text(oripageReadCounts);
					$('.shareCounts').text(shareCounts);
					$('.favCounts').text(favCounts);
					$('.countNewUsers').text(countNewUsers);
					$('.countCancelUsers').text(countCancelUsers);
					root.modal('show').find('h4.modal-title').text(`选中的${data.length}条记录的合计数`);
					root.modal('show');
				}
			});
		});
		// 导出
		date = new utils.CommonDate({
			el: $('#form-date')
		});
		$('#export-btn').on('click', () => {
			utils.alertMessage('正在生成文件！', 'success');
			const data = utils.cleanObject({
				title: $.trim($('#title').val()),
				wxName: $('#weixin-account option:selected').val(),
				startDay: date.getDate('start'),
				endDay: date.getDate('end')
			});
			let str = '';
			for (let i in data) {
				str += '&' + i + '=' + encodeURI(data[i]);
			}
			if (str !== '') {
				str = '?' + str.slice(1);
			}
			location.href = `${ctx}/weixinv2/broadcast/exportExcel${str}`;
		});
	}
	function initSelectA() {
		const $wa = $('#weixin-account');
		$wa.select2({
			data: wechatCredentials,
			placeholder: '输入关键字查询公众号',
			allowClear: true
		});
		$wa.val('').trigger('change');
	}
}
