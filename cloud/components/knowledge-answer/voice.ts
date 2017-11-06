import 'time';
import * as utils from 'utils';
import * as tables from 'new-table';
import * as nTables from 'tables';
import { changeTagStyle, bindSure, formatSeconds, bindDeleteEvent } from './updateUtils';
import * as item from './voice-item.pug';
export function initVoice(update) {
	init(update);
}
// 选择音频后素材部分内容修改
export function renderVoice(msg) {
	const rowData = msg.nonShared;
	const time = formatSeconds(rowData.time);
	tagEl.find('.resource-box').append($(item({ url: rowData.musicUrl, time: time })));
	changeTagStyle('voice');
	modalEl.modal('hide');
}
let modalEl, tagEl, voiceTable, audio = document.createElement('audio');
declare const kbRestUrl;
declare const appid;
function init(update) {
	modalEl = $('#voice-modal');
	tagEl = $('#voice-tab');
	initVoiceTable();
	bindEvents(update);
}

function bindEvents(update) {
	// 点击从素材中选择按钮，显示模态框
	tagEl.find('.select-item').on('click', function () {
		voiceTable.reload();
		modalEl.modal('show');
	});
	// 点击模态框确定按钮
	bindSure('语音', voiceTable, modalEl, (rowData) => {
		const time = formatSeconds(rowData.timeLength);
		tagEl.find('.resource-box').html('').append($(item({ url: rowData.coverUrl, time: time })));
		changeTagStyle('voice');
		modalEl.modal('hide');
		update(answer => {
			answer.plainText = rowData.title;
			answer.resourceId = rowData.resourceId;
			answer.type = 2;
			return answer;
		});
	});
	// 点击删除按钮
	bindDeleteEvent('voice', update);
	// 点击选择按钮，左下角数据改
	modalEl.on('click', '.center-radio', () => {
		if ($('.center-radio input:checked').length === 1) {
			modalEl.find('.count-number').addClass('active');
		} else {
			modalEl.find('.count-number').removeClass('active');
		}
	});
	// 查询
	modalEl.find('.search').on('click', function () {
		voiceTable.reload();
	});
}

// 表格
function initVoiceTable() {
	voiceTable = new tables.Table({
		el: $('.voice-table'),
		options: {
			select: false,
			paging: true,
			serverSide: true, // 后端分页
			pageLength: 6,
			ajax: {
				method: 'POST',
				url: `${kbRestUrl}/resource/search/${appid}`,
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = {
						appid: appid,
						title: $.trim(modalEl.find('.keyword').val()),
						page: Math.floor(d.start / d.length) + 1,
						size: d.length,
						type: 'voice'
					};
					return utils.cleanObject(data);

				}
			},
			initComplete: initComplete,
			columns: [
				{ data: '', title: '选择', render: renderCk, width: '10%', className: 'center-radio' },
				{ data: 'coverUrl', title: '语音', render: renderAudio, width: '25%', className: 'prevent' },
				{ data: 'title', title: '标题', className: 'title-wrap force-width', createdCell: tables.createAddTitle, width: '40%' },
				{ data: 'createTime', title: '时间', createdCell: tables.createAddTitle, render: utils.renderSimpleTime, width: '25%' }
			]
		}
	});
}

function renderCk(url, type, row) {
	return `<input name="voice" type="radio" value=""/>`;
}
function renderAudio(coverUrl, type, row) {
	const time = row.hourLong;
	return `
		<div class="audio-wrap clearfix" data-url="${coverUrl}">
			<div class="gray-border">
				<div class="circle">
					<img src="images/voice.png" />
				</div>
			</div>
			<div class="time-wrap">
				<span class="time">${formatSeconds(row.timeLength)}</span>
			</div>
		<div>
	`;
}
function bindPlayEvent(bigEl) {
	bigEl.on('click', '.gray-border', function () {
		const el = $(this);
		const url = el.parent().data().url;
		if (el.is('.active')) {// 正在播放
			el.removeClass('active');
			audio.pause();
			audio.currentTime = 0;
		} else {
			bigEl.find('.gray-border').removeClass('active');
			audio.pause();
			el.addClass('active');
			audio.src = url;
			audio.currentTime = 0;
			audio.play();
		}
	});
	$(audio).on('ended', function () {
		bigEl.find('.audio-wrap').removeClass('active');
	});
}
function initComplete() {
	bindPlayEvent(modalEl);
	bindPlayEvent(tagEl);
}

