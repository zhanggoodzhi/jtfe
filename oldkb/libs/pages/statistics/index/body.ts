import './body.less';
import * as utils from 'utils';
import * as tables from 'tables';
import * as echarts from 'echarts';
let exampleHotTable: any, classHotTable: any;
let bodyHotRangeTime: any;
let exampleHotRangeTime: any;
let classHotRangeTime: any;
let time1: any, time2: any, time3: any;// 时间选择按钮
let chart: any;
let hot: any;
let position: any;
let chartData: any;
let exampleTableData: any;
let classTableData: any;
export function initBody() {
	utils.tabShown($('#kb-body-btn'), (e) => {
		utils.setScroll();
		init();
	});
}
function init() {
	initDropDown();
	initStyle();
	initChart();
	initTable();
	bindEvent();
}
function getChartData() {
	hot = [0, 1, 2, 3];
	position = [0, 1, 2, 3, 4];
	chartData = [[0, 1, 'class1'], [2, 3, 'class2']];
	renderchart();
}
function renderchart() {
	chart.setOption({
		polar: {

		},
		tooltip: {
			formatter: function (params) {
				return params.value[2] + ':' + hot[params.value[0]];
			}
		},
		radiusAxis: {
			type: 'category',
			data: hot,
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			},
			splitLine: {
				show: false,
				interval: function () {
					return 1;
				}
			},
			splitArea: {
				show: true,
				interval: 2,
				areaStyle: {
					color: ['#5cbce7', '#c1e3f8', '#eaf6fd', '#f5fbfe']
				}
			},

		},
		angleAxis: {
			type: 'category',
			data: position,
			boundaryGap: false,
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			}
		},
		series: [{
			name: 'Punch Card',
			type: 'scatter',
			coordinateSystem: 'polar',
			symbolSize: function (val) {
				return 13;
			},
			data: chartData
		}]
	});
}
function initDropDown() {
	bodyHotRangeTime = new utils.RangeDateBtn({
		el: $('#body-hot-rangeTime'),
		sureCb: (data) => {
			time1 = limitRangeDate(data);
		},
		cancelCb: (data) => {
			bodyHotRangeTime.btnEl.removeClass('active');
		}
	});
	exampleHotRangeTime = new utils.RangeDateBtn({
		el: $('#example-hot-rangeTime'),
		sureCb: (data) => {
			time2 = limitRangeDate(data);
		},
		cancelCb: (data) => {
			exampleHotRangeTime.btnEl.removeClass('active');
		}
	});
	classHotRangeTime = new utils.RangeDateBtn({
		el: $('#class-hot-rangeTime'),
		sureCb: (data) => {
			time3 = limitRangeDate(data);
		},
		cancelCb: (data) => {
			classHotRangeTime.btnEl.removeClass('active');
		}
	});
}
function limitRangeDate(time) {
	if (Number(time.startTime.split('-')[0]) < 2016) {
		time.startTime = '2016-1-1';
	}
	return time;
}
function initStyle() {
	utils.initBtnStyle($('.body-hot-time,.example-hot-time,.class-hot-time'));
}
function initChart() {
	chart = echarts.init($('#body-hot-chart')[0]);
	getChartData();
}
function getExampleTableData() {
	exampleTableData = [
		{
			'name': 'example',
			'position': 'System Architect',
			'salary': '50',
			'start_date': '2011/04/25',
			'office': 'Edinburgh',
			'extn': '5421'
		},
		{
			'name': 'Garrett Winters',
			'position': 'Director',
			'salary': '80',
			'start_date': '2011/07/25',
			'office': 'Edinburgh',
			'extn': '8422'
		}
	];
}
function getClassTableData() {
	classTableData = [
		{
			'name': 'class',
			'position': 'System Architect',
			'salary': '50',
			'start_date': '2011/04/25',
			'office': 'Edinburgh',
			'extn': '5421'
		},
		{
			'name': 'Garrett Winters',
			'position': 'Director',
			'salary': '80',
			'start_date': '2011/07/25',
			'office': 'Edinburgh',
			'extn': '8422'
		}
	];
}
function initTable() {
	getExampleTableData();
	getClassTableData();
	const exampleHotTableEl = $('#example-hot-table');
	exampleHotTable = new tables.Table({
		el: exampleHotTableEl,
		options: {
			paging: false,
			info: false,
			scrollY: '400',
			data: exampleTableData,
			columns: [
				{ data: 'name', title: '排名', width: '20%' },
				{ data: 'position', title: '知识点', width: '20%' },
				{ data: 'salary', title: '知识热度', render: renderPercent }
			]
		}
	});
	const classHotTableEl = $('#class-hot-table');
	classHotTable = new tables.Table({
		el: classHotTableEl,
		options: {
			paging: false,
			info: false,
			scrollY: '400',
			data: classTableData,
			columns: [
				{ data: 'name', title: '排名' },
				{ data: 'position', title: '知识点' },
				{ data: 'salary', title: '知识热度' }
			]
		}
	});
}
function renderPercent(percent) {
	return `<div class="percent" style="width:${percent + '%'}"><div>`;
}
function bindEvent() {
	bindDefineTimeEvent($('.body-hot-time'), 1, () => {
		getChartData();
	});
	bindDefineTimeEvent($('.example-hot-time'), 2);
	bindDefineTimeEvent($('.class-hot-time'), 3);
}
function bindDefineTimeEvent(ulEl, timeNumber, cb?) {
	ulEl.on('click', 'li', function () {
		const el = $(this);
		if (el.hasClass('define')) {
			return;
		}
		getTime(el.data('value'), timeNumber);
		if (cb) {
			cb();
		}
	});
}
function getTime(str, timeNumber) {
	let endTime: any = new Date().getTime();
	let startTime;
	switch (str) {
		case 'w': startTime = utils.formatTime(endTime - 1000 * 60 * 60 * 24 * 7); break;
		case 'm': startTime = utils.formatTime(endTime - 1000 * 60 * 60 * 24 * 30); break;
		case 'y': startTime = utils.formatTime(endTime - 1000 * 60 * 60 * 24 * 365); break;
		case 't':
			startTime = '2016-1-1';
			break;
		default: startTime = utils.formatTime(endTime - 1000 * 60 * 60 * 24 * 7); break;
	}
	endTime = utils.formatTime(endTime);
	const time = {
		startTime: startTime,
		endTime: endTime
	};
	switch (timeNumber) {
		case 1: time1 = time; break;
		case 2: time2 = time; break;
		case 3: time3 = time; break;
		default: time1 = time; break;
	}
}
