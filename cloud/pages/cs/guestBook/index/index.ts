import { Table, extendsData } from 'new-table';
import * as utils from 'utils';
import 'daterangepicker';
import './index.less';
import * as sideBarPug from './sideBar.pug';
let table;
let date;
let sideBar;
let currentId;
let replyType = '在线';
$(() => {
	init();
});

function init() {
	$('#date').parent('.cloud-input-content').css('width', 300);
	initDate();
	initSideBar();
	initTable();
}

function initDate() {
	const now: any = new Date();
	date = new utils.CommonDate({
		el: $('#date'),
		options: {
			timePicker: true,
			timePicker24Hour: true,
			showCustomRangeLabel: false,
			locale: {
				format: 'YYYY-MM-DD HH:mm:ss',
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
			startDate: new Date(Date.parse(now) - 10 * 24 * 3600 * 1000),
			endDate: now
		}
	});
}

function initTable() {
	table = new Table({
		el: $('#table'),
		options: {
			ajax: {
				type: 'GET',
				url: 'cs/guestBook/findAllCsGuestBookPage',
				dataSrc: function (data) {
					const d = data.rows;
					return d;
				},
				data: function (d: any) {
					const data = Object.assign(getFormData(), {
						page: Math.floor((d.start + d.length) / d.length),
						rows: d.length
					});
					return utils.cleanObject(data);
				}
			},
			serverSide: true,
			paging: true,
			columns: [
				{
					data: 'id',
					title: '留言ID'
				},
				{
					data: 'visitor',
					title: '访客'
				},
				{
					data: 'content',
					title: '留言内容'
				},
				{
					data: 'expectReplyType',
					title: '期望回复方式',
					render: renderReplyType
				},
				{
					data: 'status',
					title: '状态',
					render: renderStatus
				},
				{
					data: 'messageTime',
					title: '留言时间',
					render: utils.renderCommonTime
				},
				{
					data: 'replyTime',
					title: '回复时间',
					render: utils.renderCommonTime
				},
				{
					data: 'id',
					title: '操作',
					render: (text) => {
						return `<button data-id="${text}" type="button" class="check btn btn-link">查看</button>`;
					}
				}
			],
			initComplete: initComplete
		}
	});
}

function getFormData() {
	return utils.cleanObject({
		id: $('#word-id').val(),
		visitor: $('#visitor-id').val(),
		status: $('#select').val(),
		messageTimeStart: date.getDate('start'),
		messageTimeEnd: date.getDate('end')
	});
}

function initSideBar() {
	sideBar = new utils.SideBar({
		title: '查看留言',
		content: ''
	});
}
function renderStatus(status) {
	switch (status) {
		case 0: return '未回复';
		case 1: return '已回复';
		default: return '回复状态错误';
	}
}
function renderSex(sex) {
	switch (sex) {
		case 0: return '男';
		case 1: return '女';
		default: return '男';
	}
}
function renderReplyType(type) {
	switch (type) {
		case 0: return '在线回复';
		case 1: return '电话回复';
		default: return '设置已回复';
	}
}
function renderInfo() {

}
function initComplete() {
	const contentEl = sideBar.elements.content;

	$('#table').on('click', '.check', function () {
		const id = $(this).data('id');
		$.ajax({
			url: 'cs/guestBook/findCsGuestBookById',
			method: 'POST',
			data: {
				id
			}
		}).done((data) => {
			currentId = id;
			contentEl.html('').append(sideBarPug({
				...data,
				status: renderStatus(data.status),
				sex: renderSex(data.sex),
				expectReplyType: renderReplyType(data.expectReplyType),
				messageTime: utils.renderCommonTime(data.messageTime),
				replyTime: utils.renderCommonTime(data.replyTime),
				replyType: renderReplyType(data.replyType)
			}));
			sideBar.show();
		});
	});

	$('#search-btn').on('click', () => {
		table.reload();
	});

	contentEl.on('click', '#reply', () => {
		utils.confirmModal({
			msg: `确认要设置为已回复么吗?`,
			className: 'btn-primary',
			text: '确定',
			cb: (modal, btn) => {
				$.ajax({
					url: 'cs/guestBook/reply',
					method: 'POST',
					data: {
						id: currentId,
						replyType: '-1'
					}
				}).done((data) => {
					sideBar.hide();
					modal.modal('hide');
					table.reload();
				});
			}
		});
	});

	contentEl.on('click', '#online-reply', function () {
		replyType = '在线';
		$(this).css('background', '#e7f4fd');
		$('#tele-reply').css('background', 'white');
		showTextArea();
	});

	contentEl.on('click', '#tele-reply', function () {
		replyType = '电话';
		$(this).css('background', '#e7f4fd');
		$('#online-reply').css('background', 'white');
		showTextArea();
	});
	contentEl.on('click', '#submit', function () {
		$.ajax({
			url: 'cs/guestBook/reply',
			method: 'POST',
			data: {
				id: currentId,
				replyType: replyType === '在线' ? 0 : 1,
				replyContent: $('#textarea').val()
			}
		}).done((data) => {
			utils.alertMessage('操作成功', true);
			sideBar.hide();
			table.reload();
		});
	});
	contentEl.on('click', '#cancel', function () {
		sideBar.hide();
	});
}

function showTextArea() {
	const contentEl = $('#operation .content');
	contentEl.find('.textarea-wrap').remove();
	contentEl.append(`
	<div class="textarea-wrap">
	<textarea id="textarea" class="form-control" rows="3" placeholder="请输入回复内容"></textarea>
	</div>
	`);
	$('.btn-wrap').show();
}
