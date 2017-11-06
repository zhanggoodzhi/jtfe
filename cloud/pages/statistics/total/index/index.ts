import { getMinContentHeight } from 'utils';
import { SpssBtnDate, formatter, axisLabel, initTip } from '../../spssUtils';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';
namespace StatisticsTotalIndex {
	let chart;
	let datePicker;
	let type = '0'; // 1:会话数，2：消息数:，3：平均满意率，4：应答匹配率
	$(() => {
		init();
	});
	function init() {
		initTip([{
			el: $('.tip'),
			placement: 'left',
			content: `
		<div class="text"><p><b>消息数：</b>问题和回复消息总和</p><p><b>会话数：</b>访客从开始咨询到结束咨询为一次会话；</p>
		<p><b>转人工数：</b>用户从智能客服页面转人工客服的会话数</p><p><b>智能客服解决数：</b>完全由智能客服接待访客，即未转人工的会话数</p>
		<p><b>智能客服解决率：</b>智能客服解决数在所有会话数中的占比</p><p><b>平均满意率：</b>被用户评价为满意和非常满意的会话数在所有参评会话数中的占比</p>
		<p><b>参评数：</b>用户进行了满意度评价的会话总数</p><p><b>参评率：</b>参评数在所有会话数中的占比</p><p><b>有答案：</b>智能客服匹配到答案的问题数</p>
		<p><b>无答案：</b>智能客服未匹配到答案的问题数</p><p><b>应答匹配率：</b>无答案问题在所有问题中的占比</p><p><br></p><p><br></p></div>
		`}]);
		initDatePicker();
		initInfo();
		initChartHeight();
		initCharts();
		bindEvent();
	}

	function initInfo() {
		drawInfo();
	}

	function drawInfo() {
		$.ajax({
			url: 'spss/dataScreening/summary',
			method: 'GET',
			data: {
				mode: datePicker.mode,
				startDay: datePicker.date.startDay,
				endDay: datePicker.date.endDay
			}
		}).done((data) => {
			const bigEl = $('.spss-info-wrap');
			const news = bigEl.find('.news');
			news.find('.t').html(data.sumAllMsg);
			news.find('.b1').html(data.sumAllReceiveMsgCount);
			news.find('.b2').html(data.sumAllSendMsgCount);
			const solve = bigEl.find('.solve');
			solve.find('.t').html(data.robotResolutionRate + '%');
			solve.find('.b1').html(data.sumAllSession);
			solve.find('.b2').html(data.sumServicerSessionCount === 0 ? '--' : data.sumServicerSessionCount);
			const satisfy = bigEl.find('.satisfy');
			satisfy.find('.t').html(data.avgSatisfyRate + '%');
			satisfy.find('.b1').html(data.sumAppraise);
			satisfy.find('.b2').html(data.appraiseRate + '%');
			const match = bigEl.find('.match');
			match.find('.t').html(data.answerMatchRate + '%');
			match.find('.b1').html(data.sumHasAnswer);
			match.find('.b2').html(data.sumHasNoAnswer);
		});
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
				drawInfo();
				drawChart();
			}
		});
	}

	function initCharts() {
		chart = echarts.init(document.getElementById('chart'));
		drawChart();
	}

	function drawChart() {
		getChartData((data) => {
			const op = getOp(data);
			chart.clear();
			chart.setOption(op);
		});
	};
	function bindEvent() {
		$('#type-select').on('change', function () {
			type = $(this).val();
			drawChart();
			console.log(datePicker.date, datePicker.mode);
		});
	}

	function getChartData(cb) {
		$.ajax({
			url: 'spss/dataScreening/dataFilter',
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

	function getOp(data) {
		let xData = data.xData;
		let legend;
		const series = data.yData.map((v) => {
			return {
				name: v.name,
				type: 'line',
				data: v.data
			};
		});
		let f = {};
		let a = {};
		if (type === '0' || type === '3' || type === '2') {
			f = formatter;
			a = axisLabel;
		}
		switch (type) {
			case '0':
				legend = ['智能客服解决率'];
				break;
			case '1':
				legend = ['问题消息数', '回复消息数'];
				break;
			case '2':
				legend = ['平均满意率'];
				break;
			case '3':
				legend = ['应答匹配率'];
				break;
			default:
				legend = ['智能客服解决率'];
				break;
		}
		return {
			color: ['#ffb000', '#37a6e7', '#4caf50'],
			series: series,
			toolbox: {
				right: 50,
				feature: {
					saveAsImage: {}
				}
			},
			tooltip: {
				formatter: f,
				trigger: 'axis'
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

