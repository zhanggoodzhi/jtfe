import {
	bindEnter, alertMessage, loadingBtn, endLoadingBtn, cleanObject, CommonDate, confirmModal, renderCommonTime
	, SideBar, renderTimeLength
} from 'utils';
import { initTip } from '../../spssUtils';
import 'daterangepicker';
import { Table, createAddTitle } from 'new-table';
import './index.less';
namespace StatisticsTalkIndex {
	let table, qTable;
	let unMatchSideBar;
	let baseuri;
	let currentId;
	let recordSideBar;
	let rowData;
	let defaultStartDate;
	let defaultEndDate;
	$(document).ready(function () {
		initSearchData();
		initDate();
		initSideBar();
		initIndexTables();
	});
	function initSearchData() {
		const hrefArr = window.location.href.split('?');
		if (hrefArr.length > 1) {
			const paramArr = hrefArr[1].split('&');
			const userName = paramArr[0].split('=')[1];
			const startTime = paramArr[1].split('=')[1];
			const endTime = paramArr[2].split('=')[1];
			$('#user').val(decodeURI(userName));
			defaultStartDate = new Date(Number(decodeURI(startTime)));
			defaultEndDate = new Date(Number(decodeURI(endTime)));
		}
	}
	function initSideBar() {
		unMatchSideBar = new SideBar({
			id: 'unMatch-sideBar',
			title: '查看详情',
			content: `
            <form id="pre-detail-form" class="disabled-form">
                <div class="cloud-row clearfix">
                    <div class="col-md-6">
                        <div class="form-group clearfix">
                            <label class="control-label col-md-5 col-sm-5 col-lg-5">用户</label>
                            <div class="col-md-7 col-sm-7 col-lg-7">
                                <p class="question">问题</p>
                            </div>
                        </div>
                    </div>
                     <div class="col-md-6">
                        <div class="form-group clearfix">
                            <label class="control-label col-md-5 col-sm-5 col-lg-5">访问时长</label>
                            <div class="col-md-7 col-sm-7 col-lg-7">
                                <p class="time">问题问题问题问题问题</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cloud-row clearfix">
                    <div class="col-md-6">
                        <div class="form-group clearfix">
                            <label class="control-label col-md-5 col-sm-5 col-lg-5">未匹配问题/所有问题</label>
                            <div class="col-md-7 col-sm-7 col-lg-7">
                                <p class="all-question">问题</p>
                            </div>
                        </div>
                    </div>
                     <div class="col-md-6">
                        <div class="form-group clearfix">
                            <label class="control-label col-md-5 col-sm-5 col-lg-5">未匹配问题比率</label>
                            <div class="col-md-7 col-sm-7 col-lg-7">
                                <p class="question-percent">问题问题问题问题问题</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="table-wrap">
                <table id="question-table" class="table"></table>
            </div>
        `
		});
		recordSideBar = new SideBar({
			id: 'chart-sideBar',
			title: '聊天记录',
			content: `
			<div class="record-wrap"></div>
        `
		});
	}
	function drawQTable() {
		if (qTable) {
			qTable.reload(true);
			return;
		}
		qTable = new Table(
			{
				el: $('#question-table'),
				options: {
					paging: true,
					serverSide: true,
					ajax: {
						type: 'POST',
						url: 'spss/sessionLog/notMatchQuestion',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							const time = $('#form-date').val().split(' - '),
								data = {
									customsession: currentId
								};
							return cleanObject(data);
						}
					},
					initComplete: bindQEvent,
					columns: [
						{ data: 'msgtext', title: '问题' },
						{
							data: 'msgtext', title: '操作', render: (msgtext) => {
								return `<div class="cloud-image-icon"><img data-name="${msgtext}" src="images/addFile.png" class="add-file" title="添加为新语料"/></div>`;
							}
						}
					]
				}
			});
	}
	function bindQEvent() {
		$('#question-table').on('click', '.add-file', function () {
			location.assign(`${ctx}/knowledge/editByA/update?question=${encodeURI($(this).data().name)}`);
		});
	}
	function initIndexTables() {
		table = new Table(
			{
				el: $('#key-table'),
				options: {
					serverSide: true,
					paging: true,
					ordering: true,
					order: [3, 'desc'],
					ajax: {
						type: 'POST',
						url: 'spss/sessionLog/pageSessionLogByParam',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							let startTimeOrder;
							for (let v of d.order) {
								if (v.column === 3) {
									startTimeOrder = v.dir;
								}
							}
							const time = $('#form-date').val().split(' - '),
								data = {
									startTimeOrder,
									page: Math.floor((d.start + d.length) / d.length),
									rows: d.length,
									startTime: time[0],
									endTime: time[1],
									userName: $.trim($('#user').val()),
									source: $.trim($('#source').val()),
									degree: $.trim($('#satisfy').val())
									// reason: $.trim($('#reason').val())
								};
							return cleanObject(data);
						}
					},
					initComplete: bindEvent,
					columns: [
						{ data: 'userName', title: '用户', createdCell: createAddTitle, orderable: false },
						{ data: 'source', title: '来源', orderable: false },
						{
							data: 'sessionTime', title: '会话时长<i class="table-tip fa fa-question-circle" id="time-tip"></i>', orderable: false, render: (s) => {
								return renderTimeLength(s);
							}
						},
						{ data: 'startTime', title: '开始时间', width: '128', render: renderCommonTime },
						{ data: 'endTime', title: '结束时间', width: '128', orderable: false, render: renderCommonTime },
						{ data: 'degree', title: '满意度', orderable: false, render: renderSatisfaction },
						{ data: 'shortComment', title: '评价', orderable: false },
						{ data: 'hasNoAnswer', title: '未匹配问题<i class="table-tip fa fa-question-circle" id="hasno-tip"></i>', orderable: false, render: renderNumber },
						{
							data: 'customSession', title: '操作', orderable: false, render: renderIcons
						}
					]
				}
			});
	}
	function renderSatisfaction(num) {
		if (num === null || num === undefined) {
			return '无';
		}
		if (num === 100) {
			return '非常满意';
		} else if (num === 75) {
			return '满意';
		} else if (num === 50) {
			return '一般';
		} else if (num === 25) {
			return '不满意';
		} else if (num === 0) {
			return '非常不满意';
		}
	}
	function renderNumber(text, type, row) {
		return `<span data-id="${row.sessionId}" class="red-number">${text}</span>`;
	}
	function renderIcons(id) {
		return `<div class="cloud-image-icon view-record"><img data-id="${id}" src="images/chart1.png" title="查看聊天记录"/></div>`;
	}
	function initDate() {
		const latestDate = new Date();
		const threeMonthBefore = new Date(latestDate as any - 30 * 3 * 24 * 60 * 60 * 1000);
		new CommonDate({
			el: $('#form-date'),
			options: {
				timePicker: true,
				timePicker24Hour: true,
				showCustomRangeLabel: false,
				locale: {
					format: 'YYYY-MM-DD HH:mm',
					'separator': ' - ',
					'applyLabel': '确定',
					'cancelLabel': '取消',
					'fromLabel': '从',
					'toLabel': '到',
					'weekLabel': 'W',
					'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
					'monthNames': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
					'firstDay': 1
				},
				ranges: null,
				startDate: defaultStartDate ? defaultStartDate : threeMonthBefore,
				endDate: defaultEndDate ? defaultEndDate : latestDate
			}
		});
	}
	function renderRecord(id) {
		$.ajax({
			url: 'spss/sessionLog/getMsglog',
			method: 'GET',
			data: {
				sessionId: id
			}
		}).done((data) => {
			let lastTime = 0;
			const wrapEl = $('#chart-sideBar .record-wrap');
			wrapEl.empty();
			for (let v of data.msg) {
				if (v.msgtime - lastTime > 20000) {
					const time = renderCommonTime(v.msgtime);
					wrapEl.append(`<div class="time-wrap"><span>${time}</span></div>`);
					lastTime = v.msgtime;
				}
				if (v.sendername === '访客') {
					wrapEl.append(`
<div class="chart-right-item clearfix"><img src="${data.data.vistorpic.substring(1)}" class="headIcon"/>
  <div class="content">
    <div class="name-wrap"><span class="name">${rowData.userName}</span></div>
    <div class="text-wrap">
      <div class="text">${parserMsg(v.msgtext)}</div>
    </div>
  </div>
</div>
					`);
				} else {
					let pic = '';
					let name = '';
					if (v.sendername === '机器人') {
						pic = data.data.robotpic.substring(1);
						name = '智能客服';
					} else {
						pic = data.data.servicerpic.substring(1);
						name = v.sendername;
					}
					wrapEl.append(`<div class="chart-left-item clearfix"><img src="${pic}" class="headIcon"/>
  <div class="content">
    <div class="name-wrap"><span class="name">${name}</span></div>
    <div class="text-wrap">
      <div class="text">${parserMsg(v.msgtext)}</div>
    </div>
  </div>
</div>`);
				}
			}
		});
	}
	function bindEvent() {
		initTip([{
			el: $('#time-tip'),
			content: `
			从会话开始到会话结束的时长
			`
		}, {
			el: $('#hasno-tip'),
			content: `
			会话中智能客服未匹配到答案的问题
			`
		}]);
		const tableEl = $('#key-table');
		$('#search-btn').on('click', function () {
			table.reload(true);
		});
		$('#export').on('click', function () {
			const href = `spss/sessionLog/exportSessionLogExcel?${$.param(table.dt.ajax.params())}`;
			window.open(href);
		});
		tableEl.on('click', '.red-number', function () {
			const modalEl = $('#unMatch-sideBar');
			const currentData = table.dt.row($(this).closest('td')).data();
			modalEl.find('.question').text(currentData.userName);
			modalEl.find('.time').text(renderTimeLength(currentData.sessionTime));
			modalEl.find('.all-question').text(`${currentData.hasNoAnswer}/${currentData.hasNoAnswer + currentData.hasAnswer}`);
			let percent = 0;
			if (currentData.hasNoAnswer + currentData.hasAnswer !== 0) {
				percent = (currentData.hasNoAnswer * 100 / (currentData.hasNoAnswer + currentData.hasAnswer)).toFixed(2) as any;
			}
			modalEl.find('.question-percent').text(`${percent}%`);
			currentId = currentData.customSession;
			drawQTable();
			unMatchSideBar.show();
		});
		tableEl.on('click', '.view-record', function () {
			const el = $(this).find('img');
			rowData = table.dt.row(el.closest('tr')).data();
			recordSideBar.show();
			renderRecord(el.data().id);
		});
	}

	function parserMsg(msg) {
		try {
			let multimedia = JSON.parse(msg);
			if (multimedia.fileType === 'IMAGE') {
				let imgSize;
				if (multimedia.width > 600) {
					imgSize = ' width=\"600px\" height=\"' + multimedia.height
						/ (multimedia.width / 600) + 'px\"';
				} else {
					imgSize = ' width=\"' + multimedia.width + 'px\" height=\"'
						+ multimedia.height + 'px\"';
				}
				msg = '<a id=' + multimedia.prefix
					+ ' class="preview"  href="'
					+ multimedia.fileDir + '" target="_blank">' + '<img  class="lazy" src='
					+ multimedia.fileDir + imgSize + ' /></a>';
			} else if (multimedia.fileType === 'DOCUMENT') {
				msg = '<div class="doc">'
					+ '<div class="imgstyle"><img src="../public/imgs/pdf.png/" width="50px" hight="50px"></div>'
					+ '<div class="textstyle">' + '<div class="docName">'
					+ multimedia.prefix + '</div>' + '<div class="docDown">'
					+ '<span class="size">文件大小 : ' + multimedia.size
					+ '</span>'
					+ '<span class="down"><a href="' + baseuri + multimedia.fileDir + ';" download="' + multimedia.prefix + '" '
					+ '>下载文件</a></span>' + '</div>' + '</div>' + '</div>';
			} else if (multimedia.fileType === 'FEEDBACK') {
				let degree = multimedia.degree;
				let evaluateHtml = '<div class="doc">'
					+ '	<table class="table table-striped">'
					+ '		<thead>'
					+ '			<tr>'
					+ '				<th colspan=2 style="text-align:center;min-width:200px;max-width:400px">用户评价信息</th>'
					+ '			</tr>'
					+ '		</thead>'
					+ '		<tbody>'
					+ '			<tr>'
					+ '				<td style="width:80px;">用户ID</td>'
					+ '				<td style="min-width:200px;max-width:400px">' + rowData.userName + '</td>'
					+ '			</tr>'
					+ '			<tr>'
					+ '				<td>满意度</td>';
				if (degree === '100' || degree === '75') {
					if (degree === '100') {
						evaluateHtml += '			<td>非常满意</td>';
					} else {
						evaluateHtml += '			<td>满意</td>';
					}
					evaluateHtml += '			</tr>';
				} else {
					if (degree === '50') {
						evaluateHtml += '			<td>一般</td>';
					} else if (degree === '25') {
						evaluateHtml += '			<td>不满意</td>';
					} else {
						evaluateHtml += '			<td>非常不满意</td>';
					}

					if (degree === '50') {
						evaluateHtml += '			</tr>'
							+ '			<tr>'
							+ '				<td>问题是否解决</td>';
						evaluateHtml += '			<td>' + multimedia.shortComment + '</td>';
					} else {
						evaluateHtml += '			</tr>'
							+ '			<tr>'
							+ '				<td>不足原因</td>';
						evaluateHtml += '			<td>' + multimedia.shortComment + '</td>';
					}
					evaluateHtml += '			</tr>';
				}
				evaluateHtml += '				<tr>'
					+ '					<td>具体评价</td>';
				if (multimedia.comment === null || multimedia.comment === '') {
					evaluateHtml += '				<td>未填写</td>';
				} else {
					evaluateHtml += '				<td>' + multimedia.comment + '</td>';
				}
				evaluateHtml = evaluateHtml + '	</tr>'
					+ '</tbody></table>';
				msg = evaluateHtml;
			}
			return msg;
		} catch (err) {
			return msg;
		}
	}
}

