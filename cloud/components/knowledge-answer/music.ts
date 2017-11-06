import 'time';
import * as utils from 'utils';
import * as tables from 'new-table';
import * as nTables from 'tables';
import * as item from './music-item.pug';
import { changeTagStyle, bindSure, formatSeconds, bindDeleteEvent } from './updateUtils';
export function initMusic(update) {
	init(update);
}
// 选择音频后素材部分内容修改
export function renderMusic(rowData) {
	tagEl.find('.resource-box').html('').append($(item({
		url: rowData.nonShared.musicUrl,
		song: rowData.nonShared.title,
		singer: rowData.nonShared.singer,
		album: rowData.nonShared.album,
		id: rowData.mediaid
	})));
	changeTagStyle('music');
	modalEl.modal('hide');
}
let modalEl, tagEl, musicTable, audio = document.createElement('audio');
declare const kbRestUrl;
declare const appid;
function init(update) {
	modalEl = $('#music-modal');
	tagEl = $('#music-tab');
	initMusicTable();
	bindEvents(update);
}
// 点击从素材中选择按钮，显示模态框
function bindEvents(update) {
	tagEl.find('.select-item').on('click', function () {
		musicTable.reload();
		modalEl.modal('show');
	});
	// 点击模态框确定按钮
	bindSure('音乐', musicTable, modalEl, (rowData) => {
		const rd = {
			url: rowData.coverUrl,
			song: rowData.title,
			singer: rowData.singer,
			album: rowData.album,
			id: rowData.mediaId
		};
		tagEl.find('.resource-box').append($(item(rd)));
		changeTagStyle('music');
		modalEl.modal('hide');
		update(answer => {
			answer.plainText = rowData.title;
			answer.resourceId = rowData.resourceId;
			answer.type = 7;
			return answer;
		});
	});
	// 点击删除按钮
	bindDeleteEvent('music', update);
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
		musicTable.reload();
	});
}

// 表格
function initMusicTable() {
	musicTable = new tables.Table({
		el: $('.music-table'),
		options: {
			select: false,
			paging: true,
			serverSide: true,
			pageLength: 6,
			ajax: {
				url: `${kbRestUrl}/resource/search/${appid}`,
				method: 'POST',
				dataSrc: data => data.data,
				data: (d: any) => {
					return utils.cleanObject({
						appid: appid,
						title: $.trim(modalEl.find('.keyword').val()),
						page: Math.floor(d.start / d.length) + 1,
						size: d.length,
						type: 'music'
					});
				}
			},
			initComplete: initComplete,
			columns: [
				{ data: '', title: '选择', render: renderCk, width: '10%', className: 'center-radio' },
				{ data: 'coverUrl', title: '歌名', createdCell: tables.createAddTitle, render: renderMusicElement, width: '25%', className: 'prevent' },
				{ data: 'singer', title: '歌手', render: (d) => { return '歌手：' + d; }, createdCell: tables.createAddTitle, width: '25%' },
				{ data: 'timeLength', title: '时长', render: (timeLength) => { return formatSeconds(timeLength); }, width: '20%' },
				{ data: 'createTime', title: '创建时间', render: utils.renderSimpleTime, width: '20%' }
			]
		}
	});
}
function initComplete() {
	bindPlayEvent(modalEl);
	bindPlayEvent(tagEl);
}

function renderMusicElement(coverUrl, type, row) {
	return `
		<div class="music-wrap clearfix" data-url="${coverUrl}">
			<i class="fa cloud-fa-icon fa-play-circle music-pause"></i>
			<i class="fa cloud-fa-icon fa-pause music-play"></i>
			&nbsp;&nbsp;<span class="title">${row.title}</span>
		<div>
	`;
}
function renderCk(url, type, row) {
	return `<input name="music" type="radio" value=""/>`;
}
// 音乐播放
function bindPlayEvent(pEl) {
	pEl.on('click', '.music-wrap', function (event) {
		const el = $(this);
		const url = el.data().url;
		if (el.is('.active')) {
			el.removeClass('active');
			audio.pause();
		} else {
			pEl.find('.music-wrap').removeClass('active');
			el.addClass('active');
			audio.src = url;
			audio.play();
		}
		$(audio).on('ended', () => {
			pEl.find('.music-wrap').removeClass('active');
		});
	});
}
