import { SpssBtnDate, initTip } from '../../spssUtils';
import { renderMilliTimeLength, renderPercent } from 'utils';
import 'jqCloud/jqcloud.css';
import 'script-loader!jqCloud/jqcloud-1.0.4.min';
import 'new-table';
import { Table } from 'tables';
import * as echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';
namespace StatisticsLogIndex {
	let chart;
	let infoChart;
	let datePicker;
	let percentTable;
	let hotTable;
	let classifyId = null;
	let classifyName = null;
	let type = '0'; // 0：消息数: ,1:会话数，2：平均响应时间
	$(() => {
		init();
	});
	function init() {
		const time = moment(Date.now());

		console.log(time.format('YYYY-MM-DD, HH:mm:ss'), time / 1000, time.format('HH:mm:ss, SS'));
		initTip([{
			el: $('#main-tip'),
			placement: 'left',
			content: `
			<div class="text"><p><b>消息数：</b>问题和回复消息总和</p><p><b>会话数：</b>访客从开始咨询到结束咨询为一次会话</p>
			<p><b>平均响应时长：</b>从客服接收问题到回复答案的平均耗时</p>
			<p>注：智能客服与人工客服平均响应时长不同，智能客服平均响应时长为接收问题到回复问题的平均耗时，而人工客服平均响应时长为来访用户发起转人工请求到人工客服接受请求的平均耗时</p><p><br></p></div>
			`
		}, {
			el: $('#log-tip'),
			content: `
			<div class="text""><p><b>消息类型统计：</b>显示所选时间段内访客提问次数top10的消息类型及各类型的占比；</p>
			<p><b>导出：</b>导出所选时间段内所有消息类型的统计结果。</p></div>
			`
		}, {
			el: $('#hot-problem-tip'),
			content: `
			<div class="text" style="padding: 14px;"><p><b>热点问题：</b>显示所选时间段内访客提问次数top20的问题；</p>
			<p><b>导出：</b>导出所选时间段内访客提问次数大于等于1的所有问题。</p></div>
			`
		}, {
			el: $('#hot-word-tip'),
			content: `
			<div class="text" style="padding: 14px;"><p><b>热门词汇：显示</b>所选时间段内访客非聊天问题中出现频率高的词汇；</p>
			<p><b>导出：</b>导出所选时间段内所有的热门词汇</p></div>
			`
		}]);
		initDatePicker();
		initInfo();
		initCharts();
		initPercentTable();
		drawTable();
		drawTagCloud();
		bindEvent();
	}
	function initInfo() {
		drawInfo();
	}
	function drawInfo() {
		$.ajax({
			url: 'spss/msgData/summary',
			method: 'GET',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			const bigEl = $('.spss-info-wrap');
			const smart = bigEl.find('.smart span');
			smart.eq(1).html(data.sumRobotAllMsg);
			smart.eq(2).html(data.sumRobotReceiveMsg);
			smart.eq(3).html(data.sumRobotSendMsg);
			smart.eq(4).html(data.sumRobotSession);
			smart.eq(5).html(renderMilliTimeLength(data.avgRobotResponTime));
			const person = bigEl.find('.person span');
			person.eq(1).html(data.sumServicerAllMsg === 0 ? '--' : data.sumServicerAllMsg);
			person.eq(2).html(data.sumServicerReceiveMsg === 0 ? '--' : data.sumServicerReceiveMsg);
			person.eq(3).html(data.sumServicerSendMsg === 0 ? '--' : data.sumServicerSendMsg);
			person.eq(4).html(data.sumServicerSession === 0 ? '--' : data.sumServicerSession);
			person.eq(5).html(data.avgServicerResponTime === 0 ? '--' : renderMilliTimeLength(data.avgServicerResponTime));
		});
	}
	function drawTagCloud() {
		$.ajax({
			url: 'spss/msgData/hotWords',
			method: 'GET',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			if (!data.length) {
				data = [{ text: '无热门词汇', weight: 15 }];
			}
			const el = $('#tag-cloud');
			if (el.length) {
				el.remove();
			}
			const newEl = $('<div id="tag-cloud"></div>');
			$('.tag-cloud-wrap').append(newEl);
			newEl.jQCloud(data);
		});
	}
	function initPercentTable() {
		drawPercentTable();
	}
	function drawPercentTable() {
		$.ajax({
			url: 'spss/msgData/categoryStat',
			method: 'GET',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			const newData = data.map((v, i) => {
				return {
					...v,
					rank: i + 1
				};
			});
			if (!percentTable) {
				const table = $('#percent-table').DataTable(
					{
						data: newData,
						scrollY: '300px',
						serverSide: false,
						select: 'single',
						info: false,
						columns: [
							{ data: 'rank', title: '排名' },
							{ data: 'categoryName', title: '分类' },
							{ data: 'sum', title: '次数' },
							{ data: 'rate', title: '占比', render: renderPercent }
						]
					});
				table.on('select', function (e, dt, _type, indexes) {
					const rowData = table.row(indexes[0]).data();
					classifyId = (rowData as any).categoryId;
					classifyName = (rowData as any).categoryName;
					drawInfoChart();
				});
				percentTable = new Table(table);
			} else {
				percentTable.table.rows().remove();
				percentTable.table.rows.add(newData);
				percentTable.table.draw();
			}
		});
	}
	function drawTable() {
		$.ajax({
			url: 'spss/msgData/hotQuestion',
			method: 'GET',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			if (hotTable) {
				hotTable.table.rows().remove();
				hotTable.table.rows.add(data);
				hotTable.table.draw();
				return;
			}
			const table = $('#hot-table').DataTable(
				{
					data,
					scrollY: '300px',
					serverSide: false,
					info: false,
					columns: [
						{ data: 'no', title: '排名' },
						{ data: 'question', title: '问题' },
						{ data: 'classifyName', title: '所属类型' },
						{ data: 'sum', title: '提问次数' }
					]
				});
			hotTable = new Table(table);
		});
	}
	function initDatePicker() {
		const el = $('.spss-time-container .date-range-picker');
		datePicker = new SpssBtnDate({
			el,
			onClick: (mode, date) => {
				drawInfo();
				drawChart();
				drawPercentTable();
				drawTable();
				drawInfoChart();
				drawTagCloud();
			}
		});
	}
	function initCharts() {
		chart = echarts.init(document.getElementById('chart'));
		infoChart = echarts.init(document.getElementById('info-chart'));
		drawChart();
		drawInfoChart();
	}
	function drawChart() {
		getChartData((data) => {
			chart.clear();
			chart.setOption(getOp(data));
		});
	}
	function drawInfoChart() {
		getInfoChartData((data) => {
			infoChart.clear();
			infoChart.setOption(getInfoOp(data));
		});
	}
	function bindEvent() {
		$('#type-select').on('change', function () {
			type = $(this).val();
			drawChart();
		});
		$('#export1').on('click', function () {
			const href = `spss/msgData/exportCategoryStatExcel?${$.param({
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			})}`;
			window.open(href);
		});
		$('#export2').on('click', function () {
			const href = `spss/msgData/exportHotQuestionExcel?${$.param({
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			})}`;
			window.open(href);
		});
		$('#export3').on('click', function () {
			const href = `spss/msgData/exportHotWordsExcel?${$.param({
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			})}`;
			window.open(href);
		});
	}
	function getChartData(cb) {
		$.ajax({
			url: 'spss/msgData/dataFilter',
			method: 'GET',
			data: {
				type,
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			cb(data);
		});
	}
	function getInfoChartData(cb) {
		$.ajax({
			url: 'spss/msgData/categoryStatLine',
			method: 'GET',
			data: {
				categoryId: classifyId,
				categoryName: classifyName,
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			cb(data);
		});
	}
	function getInfoOp(data) {
		const series = data.yData.map((v) => {
			return {
				name: v.name,
				type: 'line',
				data: v.data
			};
		});
		return {
			series,
			title: {
				text: '消息次数',
				textStyle: {
					fontSize: 13,
					fontWeight: 'bold'
				},
				top: 19
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: [classifyName]
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
				data: data.xData
			},
			yAxis: {
				type: 'value'
			}
		};
	}
	function getOp(data) {
		let xData = data.xData;
		const legend = ['人工客服', '智能客服'];
		let axisLabel = {};
		let formatter = {};
		const series = data.yData.map((v) => {
			return {
				name: v.name,
				type: 'line',
				data: v.data
			};
		});
		if (type === '2') {
			axisLabel = {
				formatter: function (value, index) {
					return renderMilliTimeLength(value);
				}
			};
			formatter = (params, ticket, callback) => {
				return `
					${params[0].axisValue}<br/>
					<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${params[0].color}"></span> ${params[0].seriesName}：${renderMilliTimeLength(params[0].data)}<br/>
					<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${params[1].color}"></span> ${params[0].seriesName}：${renderMilliTimeLength(params[1].data)}
				`;
			};
		}
		return {
			color: ['#ffb000', '#37a6e7', '#4caf50'],
			series,
			tooltip: {
				formatter,
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
				axisLabel,
				type: 'value'
			}
		};
	}
}

