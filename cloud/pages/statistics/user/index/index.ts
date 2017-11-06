import { cleanObject, CommonDate, renderCommonTime, renderPercent } from 'utils';
import { SpssBtnDate, initTip } from '../../spssUtils';
import { Table, createAddTitle } from 'new-table';
import { commonConfig, getTableHeight } from 'tables';
import * as echarts from 'echarts/lib/echarts';
import * as chinaJson from './china.json';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/map';
import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/toolbox';
import './index.less';
namespace StatisticsUserIndex {
	let chart;
	let map;
	let rankTable;
	let datePicker;
	let recordT;
	let recordTable;
	$(() => {
		init();
	});
	function init() {
		initTip([{
			el: $('#source-tip'),
			content: `
			统计来自不同渠道的用户占比
			`
		}, {
			el: $('#distribute-tip'),
			content: `
			统计各省份的来访用户分布情况
			`
		}, {
			el: $('#rank-tip'),
			content: `
			统计各省份的来访用户数量和占比
			`
		}]);
		bindTabEvent();
		initDatePicker();
		initTableData();
		initCharts();
		initTable();
	}

	function initTableData() {
		const newData = new Date();
		const latestDate = new Date(newData);
		const threeMonthBefore = new Date(newData as any - 30 * 3 * 24 * 60 * 60 * 1000);
		new CommonDate({
			el: $('#form-date'),
			options: {
				startDate: threeMonthBefore,
				endDate: latestDate
			}
		});
	}
	function bindTabEvent() {
		$('a[href="#userRecord"]').on('shown.bs.tab', function () {
			if (recordTable) {
				recordTable.reload();
				return;
			}
			initRecordTable();
		});
	}
	function initRecordTable() {
		recordTable = new Table(
			{
				el: $('#record-table'),
				options: {
					paging: true,
					serverSide: true,
					ajax: {
						type: 'POST',
						url: 'spss/userData/pageUserInfoByParam',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							const time = $('#form-date').val().split(' - '),
								data = {
									page: Math.floor((d.start + d.length) / d.length),
									rows: d.length,
									beginTime: time[0],
									endTime: time[1],
									userName: $.trim($('#user').val()),
									degree: $.trim($('#satisfy').val()),
									sessiones: $.trim($('#talk-number').val())
								};
							return cleanObject(data);
						}
					},
					initComplete: bindRecordEvent,
					columns: [
						{ data: 'userName', createdCell: createAddTitle, title: '用户' },
						{ data: 'sessiones', width: '45', title: '会话数' },
						{ data: 'vistorSendMsg', width: '45', title: '问题数' },
						{ data: 'servicerSendMsg', title: '人工客服回复数' },
						{ data: 'robotSendMsg', title: '机器人回复数' },
						{ data: 'hasNoAnswer', title: '未匹配问题数<i class="table-tip fa fa-question-circle" id="hasno-tip"></i>' },
						{ data: 'satify', title: '用户满意率<i class="table-tip fa fa-question-circle" id="satisfy-tip"></i>', render: renderPercent },
						{ data: 'firstSessionTime', title: '首次会话时间', width: '126', render: renderCommonTime },
						{ data: 'lastSessionTime', title: '最后会话时间', width: '126', render: renderCommonTime },
						{
							data: 'userName', title: '操作', width: '30', render: (userName, status, rowData) => {
								return `<div data-starttime="${rowData.firstSessionTime}" data-endtime="${rowData.lastSessionTime}" data-userName="${userName}" class="cloud-image-icon"><img src="images/chart2.png" class="view-detail" title="查看会话记录"/></div>`;
							}
						}
					]
				}
			});
	}
	function bindRecordEvent() {
		initTip([{
			el: $('#hasno-tip'),
			content: `
			机器人未匹配到答案的问题数
			`
		}, {
			el: $('#satisfy-tip'),
			content: `
			被用户评价为满意和非常满意的会话在所有会话中的占比
			`
		}]);
		$('#export').on('click', function () {
			const href = `spss/userData/exportUserInfoExcel?${$.param(recordTable.dt.ajax.params())}`;
			window.open(href);
		});
		const tableEl = $('#record-table');
		$('#search-btn').on('click', function () {
			recordTable.reload();
		});
		tableEl.on('click', '.view-detail', function () {
			const data = $(this).parent().data();
			window.open(`spss/sessionLog/index?userName=${data.username}&startTime=${data.starttime}&endTime=${data.endtime}`);
		});
	}
	function initDatePicker() {
		const el = $('.spss-time-container .date-range-picker');
		datePicker = new SpssBtnDate({
			el,
			onClick: (mode, date) => {
				drawChart();
				drawTable();
			}
		});
	}
	function initCharts() {
		echarts.registerMap('china', chinaJson);
		chart = echarts.init(document.getElementById('chart'));
		map = echarts.init(document.getElementById('map'));
		drawChart();
	}
	function drawChart() {
		getChartData((data) => {
			chart.setOption(getOp(data));
		});
		getMapData((data) => {
			map.setOption(getMapOp(data));
		});
	}

	function drawTable() {
		rankTable.reload();
		// $.ajax({
		// 	url: 'spss/userData/arealRanking',
		// 	method: 'GET',
		// 	data: {
		// 		mode: datePicker.mode,
		// 		startDay: datePicker.date.startDay,
		// 		endDay: datePicker.date.endDay,
		// 		page: 1,
		// 		size: 100
		// 	}
		// }).done((data) => {
		// 	const newData = data.map((v, i) => {
		// 		return {
		// 			...v,
		// 			rank: i + 1
		// 		};
		// 	});
		// 	if (!rankTable) {
		// 		const table = $('#percent-table').DataTable(
		// 			{
		// 				data: newData,
		// 				scrollY: '300px',
		// 				serverSide: false,
		// 				select: 'single',
		// 				info: false,
		// 				columns: [
		// 					{ data: 'rank', title: '排名' },
		// 					{ data: 'categoryName', title: '分类' },
		// 					{ data: 'sum', title: '次数' },
		// 					{ data: 'rate', title: '占比' }
		// 				]
		// 			});
		// 		rankTable = new Table(table);
		// 	} else {
		// 		rankTable.table.rows().remove();
		// 		rankTable.table.rows.add(newData);
		// 		rankTable.table.draw();
		// 	}
		// });
	}
	function initTable() {
		rankTable = new Table(
			{
				el: $('#area-rank-table'),
				options: {
					paging: true,
					scrollY: '300px',
					ajax: {
						type: 'POST',
						url: 'spss/userData/arealRanking',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							const data = {
								page: Math.floor((d.start + d.length) / d.length),
								rows: d.length,
								mode: datePicker.mode,
								startDay: datePicker.date.startDay,
								endDay: datePicker.date.endDay
							};
							return cleanObject(data);
						}
					},
					serverSide: true,
					columns: [
						{ data: 'no', title: '排名' },
						{ data: 'name', title: '分类' },
						{ data: 'value', title: '次数' },
						{ data: 'rate', title: '占比', render: renderPercent }
					],
					initComplete: bindRecordEvent
				}
			});
	}
	function getChartData(cb) {
		$.ajax({
			url: 'spss/userData/userSource',
			method: 'GET',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			cb(data);
		});
	}
	function getMapData(cb) {
		$.ajax({
			url: 'spss/userData/arealDistribute',
			method: 'GET',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			cb(data);
		});
	}
	function getOp(data) {
		return {
			color: ['#ffb000', '#37a6e7', '#4caf50'],
			series: {
				data,
				name: '用户来源',
				type: 'pie',
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			},
			toolbox: {
				right: 50,
				feature: {
					saveAsImage: {}
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['微信', '移动应用', 'PC网页']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			}
		};
	}
	function getMapOp(data) {
		const option = {
			color: ['#ffb000'],
			title: {
				text: 'iphone销量',
				subtext: '纯属虚构',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			visualMap: {
				inRange: {
					color: ['#d7e2f5', '#3159a4']
				},
				min: 0,
				max: 2500,
				left: 'left',
				top: 'bottom',
				text: ['高', '低'],           // 文本，默认为数值文本
				calculable: true
			},
			toolbox: {
				right: 40,
				show: true,
				orient: 'vertical',
				top: 'center',
				feature: {
					restore: {},
					saveAsImage: {}
				},
				iconStyle: {
					normal: {
						textAlign: 'right',
						textPosition: 'left'
					},
					emphasis: {
						textAlign: 'right',
						textPosition: 'left'
					}
				}
			},
			series: [
				{
					data,
					name: '用户',
					type: 'map',
					mapType: 'china',
					roam: false,
					label: {
						normal: {
							textStyle: {
								color: '#8b5839'
							},
							show: true
						},
						emphasis: {
							textStyle: {
								color: '#8b5839'
							},
							show: true
						}
					},
					itemStyle: {
						emphasis: {
							areaColor: '#f2da6b'
						}
					}
				}
			]
		};
		return option;
	}
}

