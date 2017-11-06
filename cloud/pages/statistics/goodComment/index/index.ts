import { getMinContentHeight, cleanObject, renderPercent } from 'utils';
import { SpssBtnDate, formatter, axisLabel, initTip } from '../../spssUtils';
import { Table } from 'new-table';
import * as echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import './index.less';
import 'DataTables/DataTables-1.10.15/css/dataTables.bootstrap.min.css';
namespace StatisticsGoodCommentIndex {
	let pieChart;
	let lineChart;
	let datePicker;
	let goodTable;
	$(() => {
		init();
	});
	function init() {
		initTip([{
			el: $('#reply-tip'),
			content: `
			智能客服的回复被用户评价为好评和差评的次数占比
			`
		}, {
			el: $('#role-tip'),
			content: `
			智能客服不同角色的好评率
			`
		}, {
			el: $('#type-tip'),
			content: `
			所有知识类型的评价情况
			`
		}]);
		initDatePicker();
		initCharts();
		initTable();
	}
	function initDatePicker() {
		const el = $('.spss-time-container .date-range-picker');
		datePicker = new SpssBtnDate({
			el,
			onClick: (mode, date) => {
				drawPieChart();
				drawLineChart();
				goodTable.reload(true);
			}
		});
	}

	function initTable() {
		goodTable = new Table(
			{
				el: $('#good-table'),
				options: {
					paging: true,
					scrollY: '300px',
					ordering: true,
					order: [[5, 'desc']],
					ajax: {
						type: 'POST',
						url: 'spss/feedbackRate/categoryStatList',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							let goodOrder;
							let badOrder;
							for (let v of d.order) {
								if (v.column === 5) {
									goodOrder = v.dir;
								}
								if (v.column === 7) {
									badOrder = v.dir;
								}
							}
							const data = {
								goodOrder,
								badOrder,
								page: Math.floor((d.start + d.length) / d.length),
								rows: d.length,
								mode: datePicker.mode,
								startDay: datePicker.date.startDay,
								endDay: datePicker.date.endDay
							};
							return cleanObject(data);
						}
					},
					initComplete: () => {
						initTip([{
							el: $('#num-tip'),
							content: `
							用户对智能客服的回复进行了评价的数量
							`
						}, {
							el: $('#percent-tip'),
							content: `
							用户进行了评价的回复数在智能客服所有回复数中的占比
							`
						}]);
						$('#export').on('click', function () {
							const href = `spss/feedbackRate/exportCategoryFeedbackExcel?${$.param({
								mode: datePicker.mode,
								startDay: datePicker.date.startDay,
								endDay: datePicker.date.endDay
							})}`;
							window.open(href);
						});
					},
					serverSide: true,
					columns: [
						{ data: 'no', title: '排行', orderable: false },
						{ data: 'categoryName', title: '类型', orderable: false },
						{ data: 'appraiseNum', title: '参评数<i class="table-tip fa fa-question-circle" id="num-tip"></i>', orderable: false },
						{ data: 'appraiseRate', title: '参评率<i class="table-tip fa fa-question-circle" id="percent-tip"></i>', orderable: false, render: renderPercent },
						{ data: 'goodNum', title: '好评数', orderable: false },
						{ data: 'goodRate', width: '30', title: '好评率', render: renderPercent },
						{ data: 'badNum', title: '差评数', orderable: false },
						{ data: 'badRate', width: '30', title: '差评率', render: renderPercent }
					]
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
			lineChart.clear();
			lineChart.setOption(getLineOp(data));
		});
	}
	function getPieChartData(cb) {
		$.ajax({
			url: 'spss/feedbackRate/pieChart',
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
			url: 'spss/feedbackRate/charactorStatLine',
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
				data: ['好评', '差评']
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
		const legend = data.yData.map((v) => {
			return v.name;
		});
		const series = data.yData.map((v) => {
			return {
				name: v.name,
				type: 'line',
				data: v.data
			};
		});
		return {
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
				data: data.xData
			},
			yAxis: {
				axisLabel,
				type: 'value'
			}
		};
	}
}

