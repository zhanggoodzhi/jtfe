import { SpssBtnDate, formatter, axisLabel, initTip } from '../../spssUtils';
import * as echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';
namespace StatisticsSatisfactionIndex {
	let pieChart;
	let lineChart;
	let datePicker;
	$(() => {
		init();
	});
	function init() {
		initTip([{
			el: $('#num-tip'),
			content: `
			统计被用户评价为非常满意、满意、一般、不满意和非常不满意的会话次数占比
			`
		}, {
			el: $('#percent-tip'),
			content: `
			统计人工客服和智能客服的满意率
			`
		}]);
		initDatePicker();
		initCharts();
	}
	function initDatePicker() {
		const el = $('.spss-time-container .date-range-picker');
		datePicker = new SpssBtnDate({
			el,
			onClick: (mode, date) => {
				drawPieChart();
				drawLineChart();
			}
		});
	}
	function initCharts() {
		pieChart = echarts.init(document.getElementById('pie-chart'));
		drawPieChart();
		lineChart = echarts.init(document.getElementById('line-chart'));
		drawLineChart();
	}
	function drawPieChart() {
		getPieChartData((data) => {
			pieChart.setOption(getPieOp(data));
		});
	}
	function drawLineChart() {
		getLineChartData((data) => {
			lineChart.setOption(getLineOp(data));
		});
	}

	function getPieChartData(cb) {
		$.ajax({
			url: 'spss/satisfactionAnalysis//statSatisfaction',
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
	function getLineChartData(cb) {
		$.ajax({
			url: 'spss/satisfactionAnalysis/dataFilter',
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
	function getPieOp(data) {
		return {
			color: ['#ffb000', '#37a6e7', '#4caf50', '#a9a9a9', '#c51f29'],
			series: {
				data,
				name: '满意度统计',
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
				data: ['非常满意', '满意', '一般', '不满意', '非常不满意']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			}
		};
	}
	function getLineOp(data) {
		const series = data.yData.map((v) => {
			return {
				name: v.name,
				type: 'line',
				data: v.data
			};
		});
		return {
			color: ['#ffb000', '#37a6e7', '#4caf50'],
			series,
			toolbox: {
				right: 50,
				feature: {
					saveAsImage: {}
				}
			},
			tooltip: {
				formatter,
				trigger: 'axis'
			},
			legend: {
				data: ['人工客服', '智能客服']
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
				axisLabel,
				type: 'value'
			}
		};
	}
}

