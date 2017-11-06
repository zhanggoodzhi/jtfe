import { getMinContentHeight, formatClassify, Tree, bindEnter, cleanObject } from 'utils';
import 'new-table';
import { getTableHeight, commonConfig, getPage, createAddTitle, Table } from 'tables';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'tree';
import './index.less';
namespace KnowledgeClassifyIndex {
	interface Idate {
		year: number;
		month: number;
		day: number;
		hour: number;
	}
	let chartHeight: number;
	let tree: Tree;
	let table: DataTables.Api;
	let refreshT: Table;
	let yearChart, monthChart, dayChart, hourChart;
	let time = new Date();
	let chartType = {
		y: 'bar',
		m: 'bar',
		d: 'bar',
		h: 'bar'
	};
	let temporaryTime: Idate = {// 此时间是中间数据，得经过二次处理再发送
		year: time.getFullYear(),
		month: time.getMonth() + 1,
		day: time.getDate(),
		hour: time.getHours()
	};
	let sendTableData: Idate = Object.assign({}, temporaryTime);// 表格的发送数据
	let xAxis: string[] = ['空'], chartData: string[] = ['0'];// 记录每次获取的横坐标与数据
	$(() => {
		init();
	});
	function init() {
		initChartHeight();
		bindResize();
		initTree();
	}
	function initTree() {
		tree = new Tree({
			el: $('#main-classify'),
			data: formatClassify(selectData, true),
			multiple: true,
			selected: true,
			initComplete: () => {
				initEcharts();
				bindClickEvent();
				initTable();
			}
		});
	}
	function bindResize() {
		$(window).resize(() => {
			$('.right_col').css('min-height', window.innerHeight - 5);
			initChartHeight();
			echartsResize();
			DataTablesBodyResize();
		});
	}
	function echartsResize() {
		yearChart.resize();
		monthChart.resize();
		dayChart.resize();
		hourChart.resize();
	}
	function getScrollHeight() {
		return (chartHeight + 35) * 4 + 32 - 32 - $('.cloud-search-area').height() - 51 - 27;
	}
	function DataTablesBodyResize() {
		$('.dataTables_scrollBody').height(chartHeight === 109 ? getScrollHeight() : getTableHeight());
	}
	function initChartHeight() {
		chartHeight = (getMinContentHeight() - 32) / 4 - 35;
		if (chartHeight < 109) {
			chartHeight = 109;
		}
		$('.chart').height(chartHeight);
	}
	function bindBtnEvent(el) {
		el.find('.bar').on('click', function () {
			const type = $(this).data('type');
			chartType[type] = 'bar';
			saveAndUpdateData(type);
			setChartOption(type);
		});
		el.find('.line').on('click', function () {
			const type = $(this).data('type');
			chartType[type] = 'line';
			saveAndUpdateData(type);
			setChartOption(type);
		});
	}
	function saveAndUpdateData(type) {
		let op;
		switch (type) {
			case 'y':
				op = yearChart.getOption();
				xAxis = op.xAxis[0].data;
				chartData = op.series[0].data;
				break;
			case 'm':
				op = monthChart.getOption();
				xAxis = op.xAxis[0].data;
				chartData = op.series[0].data;
				break;
			case 'd':
				op = dayChart.getOption();
				xAxis = op.xAxis[0].data;
				chartData = op.series[0].data;
				break;
			case 'h':
				op = hourChart.getOption();
				xAxis = op.xAxis[0].data;
				chartData = op.series[0].data;
				break;
			default:
				op = yearChart.getOption();
				xAxis = op.xAxis[0].data;
				chartData = op.series[0].data;
				break;
		}
	}
	function initEcharts() {
		yearChart = echarts.init(document.getElementById('year-chart'));
		monthChart = echarts.init(document.getElementById('month-chart'));
		dayChart = echarts.init(document.getElementById('day-chart'));
		hourChart = echarts.init(document.getElementById('hour-chart'));
		getChartData('y');
		getChartData('m');
		getChartData('d');
		getChartData('h');
	}
	function bindClickEvent() {
		const yearWrap = $('.year-wrap-wrap');
		const monthWrap = $('.month-wrap-wrap');
		const dayWrap = $('.day-wrap-wrap');
		const hourWrap = $('.hour-wrap-wrap');
		bindBtnEvent(yearWrap);
		bindBtnEvent(monthWrap);
		bindBtnEvent(dayWrap);
		bindBtnEvent(hourWrap);
		yearChart.on('click', function (params) {
			if (params.name === temporaryTime.year.toString() && temporaryTime.month === 1 && temporaryTime.day === 1 && temporaryTime.hour === 1) {// 判断相同条件不查询
				return;
			}
			temporaryTime.year = Number(params.name);
			temporaryTime.month = 1;
			temporaryTime.day = 1;
			temporaryTime.hour = 1;
			sendTableData = getTableTime('y');
			getChartData('y');
			getChartData('m');
			getChartData('d');
			getChartData('h');
			refreshT.refresh(true);
		});
		monthChart.on('click', function (params) {
			if (params.name === temporaryTime.month.toString() && temporaryTime.day === 1 && temporaryTime.hour === 1) {
				return;
			}
			temporaryTime.month = Number(params.name);
			temporaryTime.day = 1;
			temporaryTime.hour = 1;
			sendTableData = getTableTime('m');
			getChartData('m');
			getChartData('d');
			getChartData('h');
			refreshT.refresh(true);
		});
		dayChart.on('click', function (params) {
			if (params.name === temporaryTime.day.toString() && temporaryTime.hour === 1) {
				return;
			}
			temporaryTime.day = Number(params.name);
			temporaryTime.hour = 1;
			sendTableData = getTableTime('d');
			getChartData('d');
			getChartData('h');
			refreshT.refresh(true);
		});
		hourChart.on('click', function (params) {
			if (params.name === temporaryTime.hour.toString()) {
				return;
			}
			temporaryTime.hour = Number(params.name);
			sendTableData = getTableTime('h');
			getChartData('h');
			refreshT.refresh(true);
		});
	}

    /**
     *
     *
     * @param {string} type
     */
	function getChartData(type: string) {
		$.ajax({
			url: 'spss/getData',
			type: 'POST',
			data: getChartTime(type),
			success: function (data) {
				let dataArr = data.data.data.split('||');
				if (dataArr[0] === 'null' || dataArr[0] === '') {
					xAxis = ['空'];
					chartData = ['0'];
					setChartOption(type);
					return;
				}
				xAxis = dataArr[0].split(',');
				chartData = dataArr[1].split(',');
				setChartOption(type);
			}
		});
	}
    /**
     *
     *
     * @param {string} title
     * @returns {*} 返回options
     */
	function getOp(title: string, type: string): any {
		return {
			color: ['#ffb000', '#37a6e7', '#4caf50'],
			grid: {
				left: '1%',
				top: '20%',
				right: '1%',
				bottom: '8%',
				containLabel: true
			},
			calculable: false,
			tooltip: {
				trigger: 'item'
			},
			toolbox: {
				feature: {
					saveAsImage: { show: true }
				},
				left: '55px',
				top: '-10px'
			},
			title: {
				text: title + ' 对话次数',
				textStyle: {
					fontSize: 12,
					fontWeight: 'bolder',
					color: '#999'
				},
				y: 'top',
				x: 'right'
			},
			xAxis: [
				{
					type: 'category',
					axisLine: { show: true },
					axisTick: { show: false },
					axisLabel: { interval: 0, rotate: 45 },
					data: xAxis
				}
			],
			yAxis: [
				{
					type: 'value',
					scale: true,
					splitLine: { show: false }
				}
			],
			series: [
				{
					name: '问答数',
					type: chartType[type],
					itemStyle: {
						normal: {
							color: (params) => {
								return getColor(params, title);
							}
						}
					},
					data: chartData
				}
			]
		};
	}

    /**
     *
     *
     * @param {any} params
     * @param {string} title
     * @returns {string}
     */
	function getColor(params, title: string): string {
		switch (title) {
			case '年':
				return params.name === sendTableData.year.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
			case '月':
				return params.name === sendTableData.month.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
			case '日':
				return params.name === sendTableData.day.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
			case '时':
				return params.name === sendTableData.hour.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
			default:
				return params.name === sendTableData.year.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
		}
	}

    /**
     *
     *
     * @param {string} type
     */
	function setChartOption(type: string) {
		switch (type) {
			case 'y':
				yearChart.setOption(getOp('年', type));
				break;
			case 'm':
				monthChart.setOption(getOp('月', type));
				break;
			case 'd':
				dayChart.setOption(getOp('日', type));
				break;
			case 'h':
				hourChart.setOption(getOp('时', type));
				break;
			default:
				yearChart.setOption(getOp('年', type));
				break;

		}
	}

	function initTable() {
		table = $('#table').DataTable(
			Object.assign(
				commonConfig(),
				{
					ajax: {
						url: 'spss/queryLog1',
						type: 'POST',
						dataSrc: data => data.rows,
						data: (data) => {
							const d = {
								page: getPage(data),
								rows: data.length,
								sort: 'id',
								order: 'desc'
							};
							Object.assign(d, sendTableData, {
								answerStatus: $('#status').val(),
								device: $('#device').val(),
								classifys: tree.selected.join(','),
								character: $('#character').val(),
								sender: $('#sender').val(),
								keyword: $('#keyword').val()
							});
							return cleanObject(d);
						}
					},
					scrollY: chartHeight === 109 ? getScrollHeight() : getTableHeight(),
					initComplete: initComplete,
					columns: [
						{ data: 'question', title: '问题', createdCell: createAddTitle },
						{ data: 'answer', title: '回复', createdCell: createAddTitle },
						{ data: 'classifyName', title: '类型', createdCell: createAddTitle },
						{ data: 'characterName', title: '角色', createdCell: createAddTitle },
						{ data: 'sender', title: '用户', createdCell: createAddTitle },
						{ data: 'time', title: '时间', createdCell: createAddTitle }
					]
				}
			)
		);
		refreshT = new Table(table);
	}
    /**
     *
     *
     * @param {string} type
     * @returns {Idate}
     */
	function getChartTime(type: string): Idate {// 返回适应图表的time
		let t: Idate;
		switch (type) {
			case 'y': t = {
				year: -1,
				month: -1,
				day: -1,
				hour: -1
			}; break;
			case 'm': t = {
				year: temporaryTime.year,
				month: -1,
				day: -1,
				hour: -1
			}; break;
			case 'd': t = {
				year: temporaryTime.year,
				month: temporaryTime.month,
				day: -1,
				hour: -1
			}; break;
			case 'h': t = {
				year: temporaryTime.year,
				month: temporaryTime.month,
				day: temporaryTime.day,
				hour: -1
			}; break;
			default: t = {
				year: -1,
				month: -1,
				day: -1,
				hour: -1
			}; break;
		}
		return t;
	}
    /**
     *
     *
     * @param {string} type
     * @returns {Idate}
     */
	function getTableTime(type: string): Idate {// 返回适应表格的time
		let t: Idate;
		switch (type) {
			case 'y': t = {
				year: temporaryTime.year,
				month: -1,
				day: -1,
				hour: -1
			}; break;
			case 'm': t = {
				year: temporaryTime.year,
				month: temporaryTime.month,
				day: -1,
				hour: -1
			}; break;
			case 'd': t = {
				year: temporaryTime.year,
				month: temporaryTime.month,
				day: temporaryTime.day,
				hour: -1
			}; break;
			case 'h': t = {
				year: temporaryTime.year,
				month: temporaryTime.month,
				day: temporaryTime.day,
				hour: temporaryTime.hour
			}; break;
			default: t = {
				year: temporaryTime.year,
				month: temporaryTime.month,
				day: temporaryTime.day,
				hour: temporaryTime.hour
			}; break;
		}
		return t;
	}

	function initComplete() {
		$('#search').on('click', () => {
			refreshT.refresh(true);
		});
		bindEnter($('#sender,#keyword'), () => {
			refreshT.refresh(true);
		});
		$('#reset-btn').on('click', () => {
			setTimeout(() => {
				tree.resetFirst();
			}, 0);
		});
	}
}

