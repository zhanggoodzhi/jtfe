import * as utils from 'utils';
import { Uploader } from 'upload';
import * as tables from 'tables';
let table: any;
let bigEl: JQuery;
let audio = document.createElement('audio');
export function initVoice() {
	utils.tabShown($('#voice-link'), (e) => { initTable(); });
};
function initTable() {
	bigEl = $('#voice-tab');
	$('#voice-summary').parent().remove();// 语音不需要简介
	const tableEl = $('#voice-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true, // 后端分页
			ajax: {
				method: 'GET',
				url: '/resource/list',
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = tables.extendsData(d, utils.getSearchParams('voice'));
					const newData = utils.cleanObject(data);
					return newData;
				}
			},
			columns: [
				{ data: 'coverUrl', title: '语音', render: renderAudio, width: '20%' },
				{ data: 'title', title: '标题', className: 'title-wrap', createdCell: utils.createAddTitle, render: renderTitle },
				{ data: 'createTime', title: '创建时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'materialId', title: '操作', className: 'prevent', render: renderDownLoadAndEditAndDeleteBtn }
			]
		},
		initComplete: initComplete
	});
}
function renderTitle(title) {
	return `
		<span>${title}</span>
		<input class="input-small"/>
	`;
}
function renderAudio(coverUrl, type, row) {
	const time = row.timeLength;
	return `
		<div class="audio-wrap clearfix" data-id="${coverUrl}">
			<i class="material-icons stop">volume_mute</i>
			<i class="material-icons play">volume_up</i>
			<div class="time-wrap">
				<span class="time">${formatSeconds(time)}</span>
			</div>
		<div>
	`;
}
function initComplete() {
	initUpload();
	utils.tabShown($('#voice-link'), () => {
		this.reload();
	}, false);
	$('#voice-search').on('click', () => {
		this.reload();
	});
	utils.bindResourceDownloadEvent('voice');
	bindEditEvent();
	utils.bindResourceDeleteEvent('voice', () => {
		table.reload();
	});
	bindPlayEvent();
}
function initUpload() {
	new Uploader({
		btn: $('#voice-add'),
		accept: '.mid,.midi,.oga,.wav,.mp3',
		url: '/resource/file/upload',
		name: 'file',
		params: {
			type: 'voice'
		},
		success: (id, name, res) => {
			const data = res.data;
			utils.resourceCreateAjax({
				title: name,
				nonShared: {
					mediaId: data.mediaId,
					mediaUrl: data.url,
					timeLength: data.timeLength
				},
				type: 'voice'
			}, (msg) => {
				table.reload();
			});
		}
	});
}
function bindEditEvent() {
	let mediaId;
	let mediaUrl;
	utils.bindResourceEditEvent('voice', (data, el) => {
		const editItem = el.parent().siblings('.title-wrap');
		const input = editItem.find('input');
		const name = editItem.find('span');
		editItem.addClass('edit-active');
		input.val(name.text());
		input.focus();
		mediaId = data.nonShared.mediaId;
		mediaUrl = data.nonShared.mediaUrl;
	});
	bigEl.on('blur', '.title-wrap input', function () {
		const el = $(this);
		const editItem = el.closest('.title-wrap');
		const name = editItem.find('span');
		const materialId = table.dt.row(el.closest('tr')).data().materialId;
		const title = el.val() as string;
		utils.resourceUpdateAjax({
			materialId,
			title,
			nonShared: {
				mediaId,
				mediaUrl
			},
			type: 'voice'
		}, () => {
			editItem.removeClass('edit-active');
			name.text(title);
		});
	});
}
function formatSeconds(value) {
	let theTime = value;// 秒
	let theTime1 = 0;// 分
	let theTime2 = 0;// 小时
	// alert(theTime);
	if (theTime > 60) {
		theTime1 = Math.round(theTime / 60);
		theTime = Math.round(theTime % 60);
		// alert(theTime1+"-"+theTime);
		if (theTime1 > 60) {
			theTime2 = Math.round(theTime1 / 60);
			theTime1 = Math.round(theTime1 % 60);
		}
	}
	let result = '' + Math.round(theTime) + '秒';
	if (theTime1 > 0) {
		result = '' + Math.round(theTime1) + '分' + result;
	}
	if (theTime2 > 0) {
		result = '' + Math.round(theTime2) + '小时' + result;
	}
	return result;
}
function bindPlayEvent() {
	bigEl.on('click', '.audio-wrap', function () {
		const el = $(this);
		const url = el.data().id;
		if (el.is('.active')) {// 正在播放
			el.removeClass('active');
			audio.pause();
			audio.currentTime = 0;
		} else {
			bigEl.find('.audio-wrap').removeClass('active');
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
function renderDownLoadAndEditAndDeleteBtn(data, type, row) {
	return `
		<i data-url='${row.coverUrl}' class='view-download kb-icon kb-download'></i>
		<i data-id='${data}' class='view-edit kb-icon kb-edit'></i>
		<i data-id='${data}' class='view-delete kb-icon kb-delete'></i>
	`;
}
