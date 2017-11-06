import * as utils from 'utils';
import { Upload } from 'upload';
import { videojs } from 'videojs';
import * as videoDetail from './videoDetail.pug';
import * as resourceUtils from './resourceUtils';
declare const nodeAccountId: string;
let bigEl: JQuery;
let detail;
let pagination;
let detailEl;
let titleR;
let videoInfo;
let ifAdd = true;
let allUploadArr = [];// 上传文件的数组
let deleteArr = [];// 待删除数组
let ifSave = false;
let editId = null;
let timeLength;
let currentData;
declare const kbRestUrl;
declare const appid;
declare const group;
export function initVideo() {
	utils.tabShown($('#video-link'), (e) => { init(); });
}

function init() {
	bigEl = $('#video-tab');
	initPagination();
	appendVideos();
	initSideDetail();
	initUpload();
	bindEvent();
}

function initSideDetail() {
	detail = new utils.SideBar({
		id: 'videoSideBar',
		title: '新增视频素材',
		content: videoDetail(),
		onHide: () => {
			if (!ifSave) {
				resourceUtils.resourceFileDeleteMoreEvent(allUploadArr);
			}
			clearForm();
		}
	});
	detailEl = $('#videoSideBar');
}

function initPagination() {
	const boxEl = $('#video-tab .video-box');
	boxEl.height(window.innerHeight - 297);
	pagination = new utils.Pagination($('#video-tab'), {
		size: 9,
		total: 1,
		onChange: ({ index, size }) => {
			appendVideos(index);
		}
	});
}

function appendVideos(num: number = 1, next?, end?) {
	pagination.index = num;
	// $.ajax('weixinv2/material/mediaList', {
	// 	method: 'GET',
	// 	data: Object.assign({
	// 		page: num,
	// 		pageSize: 9,
	// 		type: 4,
	// 		keyword: $('#video-search-title').val().trim()
	// 	})
	// }).done((msg) => {
	// 	pagination.total = msg.total;
	// 	const dataArr = msg.rows;
	// 	if (num === 1) {
	// 		$('.video-box').html('');
	// 	}
	// 	if (dataArr.length === 0) {
	// 		checkNone();
	// 		return;
	// 	}
	// 	appendDetail(dataArr);
	// 	checkNone();
	// });
	$.ajax({
		url: `${kbRestUrl}/resource/search/${appid}`,
		method: 'POST',
		data: {
			group,
			appid: appid,
			title: $('#video-search-title').val().trim(),
			page: num,
			size: 9,
			type: 'video'
		}
	}).done((msg) => {
		pagination.total = msg.total;
		const dataArr = msg.data;
		resourceUtils.triggerAddEvent();
		resourceUtils.triggerEditEvent((res) => {
			const data = res.data[0];
			currentData = data;
			const id = data.resourceId;
			ifAdd = false;
			editId = id;
			const url = data.coverUrl;
			const titleAll = data.title.split('.');
			titleR = titleAll.pop();
			const titleL = titleAll.join('');
			detailEl.find('.sidebar-title').text('编辑视频素材');
			detailEl.find('.title').val(titleL);
			detailEl.find('.desc').val(data.desc);
			renderUploadDetail('', url);
			renderPreviewVideo(id, url);
			detailEl.find('#video-upload input').prop('disabled', true).css('cursor', 'auto');
			detail.show();
		});
		if (num === 1) {
			$('.video-box').html('');
		}
		if (dataArr.length === 0) {
			checkNone();
			return;
		}
		appendDetail(dataArr);
		checkNone();
	});
}

function appendDetail(dataArr) {
	const videoBox = $('.video-box');
	videoBox.html('');
	for (let v of dataArr) {
		const itemWrap = createVideoItem(v);
		videoBox.append(itemWrap);
		const el = $(`#video-${v.resourceId}`).get(0);
		videojs(el);
	}
}

function createVideoItem(data) {
	const item = $(`
			<div class="video-item-wrap col-xs-4">
				<div class="video-item resource-hover-item">
					<div class="name-wrap ellipsis">
						<span>${data.title.split('.')[0]}</span>
					</div>
					<video
						id="video-${data.resourceId}"
						class="video stop video-js"
						controls
						preload="auto"
						data-setup='{}'>
					<source src="${data.coverUrl}"></source>
					<p class="vjs-no-js">
						您的浏览器不支持播放该视频
					</p>
					</video>
					<div class="desc-wrap ellipsis">
						<span>${data.desc || '暂无简介'}</span>
					</div>
					<div class="toolbox-wrap">
						<div class="toolbox">
							<div class="icon-wrap">
								<i class="fa cloud-fa-icon fa-edit view-edit" data-id="${data.resourceId}"></i>
							</div>
							<div class="icon-wrap">
								<i class="fa cloud-fa-icon fa-trash view-delete" data-id="${data.resourceId}"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			`);
	item.data('msg', data);
	return item;
}
function bindEvent() {
	utils.tabShown($('#video-link'), (e) => {
		appendVideos();
	}, false);
	resourceUtils.bindSearchEvent('video', () => {
		appendVideos();
	});
	$('#video-add-btn').on('click', () => {
		ifAdd = true;
		detailEl.find('.sidebar-title').text('添加视频素材');
		detail.show();
	});
	resourceUtils.bindResourceDownloadEvent('video');
	$('#video-tab').on('click', '.view-edit', function () {
		const el = $(this);
		const data = el.closest('.video-item-wrap').data().msg;
		currentData = data;
		const id = el.data().id;
		ifAdd = false;
		editId = id;
		const url = data.coverUrl;
		const titleAll = data.title.split('.');
		titleR = titleAll.pop();
		const titleL = titleAll.join('');
		detailEl.find('.sidebar-title').text('编辑视频素材');
		detailEl.find('.title').val(titleL);
		detailEl.find('.desc').val(data.desc);
		renderUploadDetail('', url);
		renderPreviewVideo(id, url);
		detailEl.find('#video-upload input').prop('disabled', true).css('cursor', 'auto');
		// detailEl.find('.image-cover').css('cursor', 'auto');
		detail.show();
	});

	resourceUtils.bindResourceDeleteEvent('video', (data, el) => {
		appendVideos();
	});
	bindDetailEvent();
}
function bindDetailEvent() {
	detailEl.on('input', '.title', function () {
		const titlePreview = detailEl.find('.title-preview');
		const inputVal = $.trim($(this).val());
		if (inputVal === '') {
			titlePreview.text('标题');
		} else {
			titlePreview.text(inputVal);
		}
	});
	detailEl.on('input', '.desc', function () {
		const descPreview = detailEl.find('.desc-preview');
		const inputVal = $.trim($(this).val());
		if (inputVal === '') {
			descPreview.text('简介');
		} else {
			descPreview.text(inputVal);
		}
	});
	detailEl.find('#video-save').on('click', () => {
		const endLoading = utils.loadingBtn($('#video-save'));
		ifSave = true;
		const title = $.trim(detailEl.find('.title').val());
		const desc = $.trim(detailEl.find('.desc').val());
		if (title === '') {
			utils.alertMessage('标题不能为空');
			endLoading();
			return;
		}
		if (desc === '') {
			utils.alertMessage('简介不能为空');
			endLoading();
			return;
		}
		if (title.length > 64) {
			utils.alertMessage('标题不能超过64个字');
			endLoading();
			return;
		}
		if (desc.length > 64) {
			utils.alertMessage('简介不能超过64个字');
			endLoading();
			return;
		}
		if (!detailEl.find('.imgcover video').length) {
			utils.alertMessage('请上传视频');
			endLoading();
			return;
		}
		resourceUtils.resourceFileDeleteMoreEvent(deleteArr);
		if (ifAdd) {
			resourceUtils.resourceCreateAjax({
				title: $.trim(detailEl.find('.title').val()) + '.' + titleR,
				desc: $.trim(detailEl.find('.desc').val()),
				group: group,
				type: 'video',
				nonShared: {
					mediaUrl: videoInfo.url,
					mediaId: videoInfo.mediaId
				}
			}, () => {
				detail.hide();
				endLoading();
				appendVideos();
			}/*, 'video'*/);
		} else {
			resourceUtils.resourceUpdateAjax({
				materialId: currentData.resourceId,
				title: $.trim(detailEl.find('.title').val()) + '.' + titleR,
				desc: $.trim(detailEl.find('.desc').val()),
				group: group,
				type: 'video',
				nonShared: {
					mediaUrl: currentData.coverUrl,
					mediaId: currentData.mediaId
				}
			}, () => {
				appendVideos();
				endLoading();
				detail.hide();
			}/*, 'video'*/);
		}
	});
	detailEl.find('.cancel').on('click', function () {
		detail.hide();
	});
}
function checkNone() {
	const box = $('.video-box');
	if (box.find('.video-item-wrap').length === 0) {
		box.html(resourceUtils.noResourceHtml());
	}
}
function clearForm() {
	titleR = '';
	videoInfo = null;
	ifSave = false;
	deleteArr = [];
	allUploadArr = [];
	detailEl.find('.title').val(null);
	detailEl.find('.desc').val(null);
	const uploadWrap = detailEl.find('.video-upload-wrap');
	uploadWrap.find('video').remove();
	uploadWrap.find('img').remove();
	uploadWrap.append('<img src="images/upload_video.png">');
	detailEl.find('.title-preview').text('标题');
	detailEl.find('.desc-preview').text('简介');
	detailEl.find('.card-image').html('');
	detailEl.find('#video-upload input').prop('disabled', false).css('cursor', 'pointer');
	// detailEl.find('.image-cover').css('cursor', 'pointer');
}
function initUpload() {
	let end1;
	let end2;

	$('#video-upload-btn').on('change', function () {
		end1 = utils.addLoadingBg($('.video-upload-wrap'));
		end2 = utils.addLoadingBg($('.card-image'));
		const thisFile = this.files[0];
		resourceUtils.uploadResource('video', thisFile, (imgData) => {
			end1();
			end2();
			$(this).val(null);
			const id = imgData.mediaId;
			const url = imgData.url;
			const videoEl = $('.video-upload-wrap').find('video');
			if (videoEl.length) {
				const mediaId = videoEl.data().id;
				if (mediaId) {
					deleteArr.push(mediaId);
				}
			}
			allUploadArr.push(id);
			renderUploadDetail(id, url);
			titleR = thisFile.name.split('.').pop();
			videoInfo = imgData;
			timeLength = imgData.timeLength;
			renderPreviewVideo(id, url);
		}, () => {
			end1();
			end2();
		});
	});
	// new Upload({
	// 	btn: btn,
	// 	accept: '.3gp,.3g2,.mpeg,.ogv,.webm,.mp4',
	// 	url: 'weixinv2/material/uploadVideo',
	// 	name: 'fileToUpload',
	// 	size: 20000000,
	// 	option: {
	// 		messages: {
	// 			sizeError: '文件不能超过20M'
	// 		}
	// 	},
	// 	success: (id, name, data) => {
	// 		const sIdentiFier = data.data.mediaId;
	// 		const sUrl = data.data.url;
	// 		const videoEl = $('.video-upload-wrap').find('video');
	// 		if (videoEl.length) {
	// 			const mediaId = videoEl.data().id;
	// 			if (mediaId) {
	// 				deleteArr.push(mediaId);
	// 			}
	// 		}
	// 		allUploadArr.push(sIdentiFier);
	// 		renderUploadDetail(sIdentiFier, sUrl);
	// 		titleR = name.split('.').pop();
	// 		videoInfo = data;
	// 		timeLength = data.data.timeLength;
	// 		renderPreviewVideo(sIdentiFier, sUrl);
	// 	}
	// });
}
function renderPreviewVideo(id, url) {
	$('.card-image').html('').append(`
		<video
			id="video-${id}"
			class="video stop video-js"
			style="width:100%;height:230px;"
			controls
			preload="auto"
			data-setup='{}'>
		<source src="${url}" type="video/mp4"></source>
		<p class="vjs-no-js">
			您的浏览器不支持播放该视频
		</p>
		</video>
	`);
	videojs(`#video-${id}`);
}
function renderUploadDetail(id, url) {
	const el = detailEl.find('.video-upload-wrap');
	el.find('img').remove();
	el.find('video').remove();
	el.append(`
		<video
			data-id="${id}"
			style="width:200px;height:124px;"
			class="video stop video-js"
			preload="auto"
			data-setup='{}'>
		<source src="${url}" type="video/mp4"></source>
		</video>
	`);
}
