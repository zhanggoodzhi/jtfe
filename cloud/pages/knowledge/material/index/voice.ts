import * as utils from 'utils';
import { Upload } from 'upload';
import * as tables from 'new-table';
import * as resourceUtils from './resourceUtils';
let table: tables.Table;
let bigEl: JQuery;
let ifEnter = false;
let audio = document.createElement('audio');
declare const kbRestUrl;
declare const appid;
declare const group;

export function initVoice() {
	utils.tabShown($('#voice-link'), (e) => {
		initTable();
	});
}

function initTable() {
	bigEl = $('#voice-tab');
	const tableEl = $('#voice-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			paging: true,
			serverSide: true, // 后端分页
			pageLength: 10,
			ajax: {
				url: `${kbRestUrl}/resource/search/${appid}`,
				method: 'POST',
				dataSrc: data => data.data,
				data: (d: any) => {
					const data = {
						group,
						appid: appid,
						title: $.trim($('#link-search-title').val()),
						page: Math.floor(d.start / d.length) + 1,
						size: d.length,
						type: 'voice'
					};
					return utils.cleanObject(data);
				}
			},
			initComplete: initComplete,
			columns: [
				{ data: 'coverUrl', title: '语音', render: renderAudio, width: '20%' },
				{ data: 'title', title: '标题', className: 'title-wrap force-width', createdCell: tables.createAddTitle, render: renderTitle },
				{ data: 'createTime', title: '时间', createdCell: tables.createAddTitle, render: utils.renderCommonTime },
				{
					data: 'resourceId', title: '操作', className: 'prevent', render: (id) => {
						return resourceUtils.renderBtn(id, 'voice');
					}
				}
			]
		}
	});
}
function renderTitle(title) {
	const titleAll = title.split('.');
	const titleR = titleAll.pop();
	const titleL = titleAll.join('');
	return `
		<span>${titleL}</span>
		<input data-titler="${titleR}" class="input-small"/>
	`;
}
function renderAudio(url, type, row) {
	const time = row.timeLength;
	return `
		<div class="audio-wrap clearfix" data-url="${url}">
			<div class="gray-border">
				<div class="circle">
					<img src="images/voice.png" />
				</div>
			</div>
			<div class="time-wrap">
				<span class="time">${formatSeconds(time)}</span>
			</div>
		<div>
	`;
}
function initComplete() {
	initUpload();
	resourceUtils.bindSearchEvent('voice', () => {
		table.reload();
	});
	utils.tabShown($('#voice-link'), () => {
		table.reload();
	}, false);
	$('#voice-search-btn').on('click', () => {
		table.reload();
	});
	// utils.bindResourceDownloadEvent('voice');
	bindEditEvent();
	resourceUtils.bindResourceDeleteEvent('voice', () => {
		table.reload();
	});
	bindPlayEvent();
}

function initUpload() {
	$('#voice-upload-btn').on('change', function () {
		const thisFile = this.files[0];
		resourceUtils.uploadResource('voice', thisFile, (data) => {
			$(this).val(null);
			resourceUtils.resourceCreateAjax({
				title: thisFile.name,
				group: group,
				type: 'voice',
				nonShared: {
					mediaUrl: data.url,
					mediaId: data.mediaId
				}
			}, (msg) => {
				table.reload();
			});
		});
	});
	// const uploader = new Upload({
	// 	btn: $('#voice-add-btn'),
	// 	accept: '.mid,.midi,.oga,.wav,.mp3',
	// 	url: 'weixinv2/material/uploadFile',
	// 	name: 'fileToUpload',
	// 	onUpload() {
	// 		uploader.uploader.setParams({
	// 			type: 3
	// 		});
	// 	},
	// 	success(id, name, res) {
	// 		table.reload();
	// 	}
	// });
}
function bindEditEvent() {
	let mediaId;
	let mediaUrl;
	$('#voice-tab').on('click', '.view-edit', function () {
		const el = $(this);
		const id = el.data().id;
		const editItem = el.closest('td').siblings('.title-wrap');
		const input = editItem.find('input');
		const name = editItem.find('span');
		editItem.addClass('edit-active');
		input.val(name.text());
		input.focus();
	});

	bigEl.on('blur', '.title-wrap input', function () {
		// ifEnter让Enter不触发blur
		const el = $(this);
		if (ifEnter) {
			ifEnter = false;
			return;
		}
		changeName(el);
	});
	bigEl.on('keydown', '.title-wrap input', function (e) {
		if (e && e.keyCode === 13) {
			const el = $(this);
			ifEnter = true;
			changeName(el);
			return false;
			// const editItem = el.closest('.title-wrap');
			// editItem.removeClass('edit-active');
			// const name = editItem.find('span');
			// const title = el.val() + '.' + el.attr('data-titler');
			// const titleL = title.split('.')[0];
			// name.text(titleL);
		}
	});
}
function changeName(el) {
	const editItem = el.closest('.title-wrap');
	const name = editItem.find('span');
	const oldName = name.text();
	const row = table.dt.row(el.closest('tr')).data() as any;
	const id = row.resourceId;
	const title = el.val() + '.' + el.attr('data-titler');
	editItem.removeClass('edit-active');
	const titleL = title.split('.')[0];
	const btn = el.closest('tr').find('.view-edit');
	const msg = utils.alertMessage('正在修改语音', true, false);
	name.text(titleL);
	btn.hide();
	if (el.val() === '') {
		utils.alertMessage('标题不能为空');
		name.text(oldName);
		return;
	}
	if (el.val().length > 64) {
		utils.alertMessage('标题不能超过64个字');
		name.text(oldName);
		return;
	}
	resourceUtils.resourceUpdateAjax({
		title,
		group,
		materialId: id,
		type: 'voice',
		nonShared: {
			mediaUrl: row.coverUrl,
			mediaId: row.mediaId
		}

	}, (data) => {
		if (!data.error) {
			table.reload();
			utils.alertMessage('语音名称修改成功', !data.error);
		} else {
			name.text(oldName);
			utils.alertMessage(data.msg, !data.error);
		}
	})
		.always(() => {
			btn.show();
			msg.remove();
		})
		.fail(() => {
			name.text(oldName);
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

