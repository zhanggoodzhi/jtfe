import './knowledge.less';
import * as utils from 'utils';
import * as tables from 'tables';
import * as echarts from 'echarts';
let knowledgeHotTable: any, classifyHotTable: any;
let newDataRangeTime: any;
let knowledgeHotRangeTime: any;
let classifyHotRangeTime: any;
let btn1: number, btn2: number;// 时间选择按钮上面的按钮
let time1: any, time2: any, time3: any;// 时间选择按钮
let chart: any;
export function initKnowledge() {
	init();
}
function init() {
	initDropDown();
	initStyle();
	initChart();
	initTable();
	bindEvent();
}
function getChartData() {
	$.ajax({
		url: '/statistics/increment',
		type: 'GET',
		data: {
			startDay: time1.startTime,
			endDay: time1.endTime,
			type: btn1
		},
		success: (data) => {
			renderchart(data);
		}
	});
}
function renderchart(data) {
	const title = $('.new-data .active').text() + '数';
	chart.setOption({
		color: ['#1f9ce5'],
		tooltip: {
			trigger: 'axis',
			formatter: '{a} <br/>{b} : {c}'
		},
		xAxis: {
			type: 'category',
			name: '时间',
			splitLine: { show: false },
			data: data.dateList,
			boundaryGap: false
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		yAxis: {
			type: 'value',
			name: title
		},
		series: [
			{
				name: title,
				type: 'line',
				data: data.countList
			}
		]
	});
}
function limitRangeDate(time) {
	if (Number(time.startTime.split('-')[0]) < 2016) {
		time.startTime = '2016-1-1';
	}
	return time;
}
function initDropDown() {
	newDataRangeTime = new utils.RangeDateBtn({
		el: $('#new-data-rangeTime'),
		sureCb: (data) => {
			time1 = limitRangeDate(data);
			getChartData();
		},
		cancelCb: (data) => {
			newDataRangeTime.btnEl.removeClass('active');
		}
	});
	knowledgeHotRangeTime = new utils.RangeDateBtn({
		el: $('#knowledge-hot-rangeTime'),
		sureCb: (data) => {
			time2 = limitRangeDate(data);
			knowledgeHotTable.reload();
		},
		cancelCb: (data) => {
			knowledgeHotRangeTime.btnEl.removeClass('active');
		}
	});
	classifyHotRangeTime = new utils.RangeDateBtn({
		el: $('#classify-hot-rangeTime'),
		sureCb: (data) => {
			time3 = limitRangeDate(data);
			classifyHotTable.reload();
		},
		cancelCb: (data) => {
			classifyHotRangeTime.btnEl.removeClass('active');
		}
	});
}

function initStyle() {
	utils.initBtnStyle($('.new-data,.new-data-time,.knowledge-hot,.knowledge-hot-time,.classify-hot-time'));
}
function initChart() {
	chart = echarts.init($('#new-data-chart')[0]);
	getTime('w', 1);
	btn1 = 1;
	getChartData();
}
function initTable() {
	getTime('w', 2);
	getTime('w', 3);
	btn2 = 1;
	const knowledgeHotTableEl = $('#knowledge-hot-table');
	knowledgeHotTable = new tables.Table({
		el: knowledgeHotTableEl,
		options: {
			paging: false,
			info: false,
			scrollY: '550',
			ajax: {
				url: '/statistics/knowledge/hot/list',
				type: 'GET',
				data: function (d: any) {
					const data = {
						startDay: time2.startTime,
						endDay: time2.endTime,
						type: btn2
					};
					d = utils.cleanObject(data);
					return d;
				},
				dataSrc: function (d) {
					if (d.length === 0) {
						return [];
					} else {
						const max = d[0].heat;
						const min = d[d.length - 1].heat;
						for (let v of d) {
							v.heat = (v.heat - min + 1) / (max - min + 1) * 100;
						}
						return d;
					}
				}
			},
			columns: [
				{ data: 'index', title: '排名', width: '20%' },
				{ data: 'knowledgeName', title: '知识点', width: '20%' },
				{ data: 'heat', title: '知识热度', render: renderPercent }
			]
		}
	});
	const classifyHotTableEl = $('#classify-hot-table');
	classifyHotTable = new tables.Table({
		el: classifyHotTableEl,
		options: {
			paging: false,
			info: false,
			scrollY: '550',
			ajax: {
				url: '/statistics/directory/hot/list',
				type: 'GET',
				data: function (d: any) {
					const data = {
						startDay: time3.startTime,
						endDay: time3.endTime
					};
					d = utils.cleanObject(data);
					return d;
				},
				dataSrc: function (d) {
					return d;
				}
			},
			columns: [
				{ data: 'index', title: '排名' },
				{ data: 'directoryName', title: '知识点' },
				{ data: 'count', title: '知识热度' }
			]
		}
	});
}
function renderPercent(percent) {
	return `<div class="percent" style="width:${percent + '%'}"><div>`;
}
function bindEvent() {
	bindDefineTimeEvent($('.new-data-time'), 1, () => {
		getChartData();
	});
	bindDefineTimeEvent($('.knowledge-hot-time'), 2, () => {
		knowledgeHotTable.reload();
	});
	bindDefineTimeEvent($('.classify-hot-time'), 3, () => {
		classifyHotTable.reload();
	});
	bindBtnEvent($('.new-data'), 1, () => {
		getChartData();
	});
	bindBtnEvent($('.knowledge-hot'), 2, () => {
		knowledgeHotTable.reload();
	});
	bindExcelEvent();
}
function bindExcelEvent() {
	$('#knowledge-hot-excel').on('click', function () {
		window.location.href = `/statistics/knowledge/hot/excel?startDay=${time2.startTime}&endDay=${time2.endTime}&type=${btn2}`;
	});
	$('#classify-hot-excel').on('click', function () {
		window.location.href = `/statistics/directory/hot/excel?startDay=${time3.startTime}&endDay=${time3.endTime}`;
	});
}
function bindDefineTimeEvent(ulEl, timeNumber, cb?) {
	ulEl.on('click', 'li', function () {
		console.log(434);
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
function bindBtnEvent(el, btnNumber, cb?) {
	el.on('click', 'li', function () {
		const type = $(this).index() + 1;
		switch (btnNumber) {
			case 1: btn1 = type; break;
			case 2: btn2 = type; break;
			default: btn1 = type; break;
		}
		console.log(btn1, btn2);
		if (cb) {
			cb();
		}
	});
}
function getTime(str, timeNumber) {
	let endTime: any = new Date().getTime();
	let startTime;
	switch (str) {
		case 'w': startTime = utils.formatTime(endTime - 1000 * 60 * 60 * 24 * 6); break;
		case 'm': startTime = utils.formatTime(endTime - 1000 * 60 * 60 * 24 * 29); break;
		case 'y': startTime = utils.formatTime(endTime - 1000 * 60 * 60 * 24 * 364); break;
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
