import { getMinContentHeight, cleanObject, renderMilliTimeLength, renderPercent } from 'utils';
import { Table } from 'new-table';
import { SpssBtnDate, formatter, axisLabel, initTip } from '../../spssUtils';
import * as echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';
namespace StatisticsServiceIndex {
	let chart;
	let datePicker;
	let serviceTable;
	let service;
	let type = '0';
	$(() => {
		init();
	});
	function init() {
		initTip([{
			el: $('#service-tip'),
			content: `
			统计人工客服的会话数，收到的问题消息数，发出的回复消息数，在线总时长，会话总时长，在线人工利用，平均相应时长以及平均满意率
			`
		}]);
		initDatePicker();
		initChartHeight();
		renderSelectDataAndDrawChart();
		drawTable();
		bindEvent();
	}
	function renderSelectDataAndDrawChart() {
		$.ajax({
			url: 'spss/staffService/getServicer',
			method: 'GET'
		}).done((data) => {
			const selectEl = $('#service-select');
			selectEl.empty();
			if (data.length === 0) {
				selectEl.prop('disabled', true).append(`
				<option>无人工客服</option>
			`);
				return;
			}
			selectEl.prop('disabled', false);
			for (let v of data) {
				selectEl.append(`
				<option value="${v.id}">${v.alias}</option>
			`);
			}
			service = data[0].id;
			drawChart();
		});
	}
	function drawTable() {
		$.ajax({
			type: 'POST',
			url: 'spss/staffService/serviceStatistics',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((msg) => {
			if (serviceTable) {
				serviceTable.refresh(msg);
				return;
			}
			serviceTable = new Table(
				{
					el: $('#service-table'),
					options: {
						info: false,
						data: msg,
						paging: false,
						scrollY: '300px',
						serverSide: false,
						columns: [
							{ data: 'servicerName', title: '客服名称' },
							{ data: 'sessionCount', title: '会话数' },
							{ data: 'servicerReceiveMsg', title: '问题消息数' },
							{ data: 'servicerSendMsg', title: '回复消息数' },
							{ data: 'onlineTimeAll', title: '在线总时长<i class="table-tip fa fa-question-circle" id="t1-tip"></i>', render: (time) => { return time === '--' ? '--' : renderMilliTimeLength(time); } },
							{ data: 'sessionTimeAll', title: '会话总时长<i class="table-tip fa fa-question-circle" id="t2-tip"></i>', render: (time) => { return time === '--' ? '--' : renderMilliTimeLength(time); } },
							{ data: 'utilization', title: '在线人工利用率<i class="table-tip fa fa-question-circle" id="t3-tip"></i>', render: (text) => { return text === '--' ? '--' : renderPercent(text); } },
							{ data: 'responTimeAll', title: '平均响应时长<i class="table-tip fa fa-question-circle" id="t4-tip"></i>', render: (time) => { return time === '--' ? '--' : renderMilliTimeLength(time); } },
							{ data: 'statisticsRate', title: '平均满意率<i class="table-tip fa fa-question-circle" id="t5-tip"></i>', render: (text) => { return text === '--' ? '--' : renderPercent(text); } }
						],
						initComplete: () => {
							initTip([{
								el: $('#t1-tip'),
								content: `
								人工客服的总在线时长
							`
							}, {
								el: $('#t2-tip'),
								content: `
								人工客服的总会话时长
							`
							}, {
								el: $('#t3-tip'),
								content: `
								人工客服的会话总时长在在线总时长中的占比
							`
							}, {
								el: $('#t4-tip'),
								content: `
								来访用户发起转人工请求到人工客服接受请求的平均耗时
							`
							}, {
								el: $('#t5-tip'),
								placement: 'left',
								content: `
								被来访用户评价为满意和非常满意的会话数在所有参评会话数中的占比
							`
							}]);
							$('#export').on('click', function () {
								const href = `spss/staffService/exportServiceStatisticsExcel?${$.param({
									mode: datePicker.mode,
									startDay: datePicker.date.startDay,
									endDay: datePicker.date.endDay
								})}`;
								window.open(href);
							});
						}
					}
				});
		});

		// const data = [{
		// 	rank: 1,
		// 	question: 2,
		// 	type: 3,
		// 	number: 4
		// }, {
		// 	rank: 1,
		// 	question: 2,
		// 	type: 3,
		// 	number: 4
		// }, {
		// 	rank: 1,
		// 	question: 2,
		// 	type: 3,
		// 	number: 4
		// }];
		// const table = $('#service-table').DataTable(
		// 	{
		// 		data,
		// 		scrollY: '300px',
		// 		serverSide: false,
		// 		info: false,
		// 		columns: [
		// 			{ data: 'rank', title: '排行' },
		// 			{ data: 'question', title: '类型' },
		// 			{ data: 'type', title: '参评数' },
		// 			{ data: 'number', title: '参评率' },
		// 			{ data: 'type', title: '好评数' },
		// 			{ data: 'type', title: '好评率' },
		// 			{ data: 'type', title: '差评数' },
		// 			{ data: 'type', title: '差评率' }
		// 		]
		// 	});
		// serviceTable = new Table(table);
	}
	function initChartHeight() {
		let chartHeight = getMinContentHeight() - 323;
		let minChartHeight = 300;
		if (chartHeight < minChartHeight) {
			chartHeight = minChartHeight;
		}
		$('.chart-wrap').height(chartHeight);
	}
	function initDatePicker() {
		const el = $('.spss-time-container .date-range-picker');
		datePicker = new SpssBtnDate({
			el,
			onClick: (mode, date) => {
				drawTable();
				renderSelectDataAndDrawChart();
			}
		});
	}
	function drawChart() {
		if (!chart) {
			chart = echarts.init(document.getElementById('chart'));
		}
		getChartData((data) => {
			chart.clear();
			chart.setOption(getOp(data));
		});
	}
	function bindEvent() {
		$('#service-select').on('change', function () {
			service = $(this).val();
			drawChart();
		});
		$('#data-select').on('change', function () {
			type = $(this).val();
			drawChart();
		});
	}
	function getChartData(cb) {
		$.ajax({
			url: 'spss/staffService/lineChart',
			method: 'GET',
			data: {
				servicerId: service,
				type,
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			cb(data);
		});
	}
	function getOp(data) {
		let xData = data.xData;
		const legend = data.yData.map((v) => {
			return v.name;
		});
		let f = {};
		let a = {};
		const series = data.yData.map((v) => {
			return {
				name: v.name,
				type: 'line',
				data: v.data
			};
		});
		if (type === '2') {
			a = {
				formatter: function (value, index) {
					return renderMilliTimeLength(value);
				}
			};
			f = (params, ticket, callback) => {
				return `
					${params[0].axisValue}<br/>
					<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${params[0].color}"></span> ${params[0].seriesName}：${renderMilliTimeLength(params[0].data)}<br/>
					<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${params[1].color}"></span> ${params[1].seriesName}：${renderMilliTimeLength(params[1].data)}
				`;
			};
		}
		if (type === '3') {
			f = formatter;
			a = axisLabel;
		}
		return {
			color: ['#ffb000', '#37a6e7', '#4caf50'],
			series,
			tooltip: {
				formatter: f,
				trigger: 'axis'
			},
			toolbox: {
				right: 50,
				feature: {
					saveAsImage: {}
				}
			},
			legend: {
				data: legend
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xData
			},
			yAxis: {
				axisLabel: a,
				type: 'value'
			}
		};
	}
}

