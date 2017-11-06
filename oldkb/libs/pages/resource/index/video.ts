import * as utils from 'utils';
import { Uploader } from 'upload';
import { videojs } from '../../../components/videojs';
import * as videoDetail from './videoDetail.pug';
let bigEl: JQuery;
let detail;
let detailEl;
let mediaId;
let mediaUrl;
let ifAdd = true;
let allUploadArr = [];// 上传文件的数组
let deleteArr = [];// 待删除数组
let ifSave = false;
let editMaterialId = null;
let timeLength;
export function initVideo() {
	utils.tabShown($('#video-link'), (e) => { init(); });
};
function init() {
	bigEl = $('#video-tab');
	utils.setScroll();
	appendVideos();
	initSideDetail();
	initScrollEvent();
	initUpload();
	bindEvent();
}
function initSideDetail() {
	detail = new utils.SideDetail({
		title: '新增视频素材',
		html: videoDetail(),
		hideFn: clearForm,
		menus: [utils.renderSideMenu('保存', 'save')],
		className: 'video-detail'
	});
	detailEl = detail.element.el;
}
function initScrollEvent() {
	new utils.ScrollPagination({
		el: $('#video-tab .kb-scroll'),
		cb: (page, next, end) => {
			appendVideos(page, next, end);
		}
	});
}
function appendVideos(num: number = 1, next?, end?) {
	$.ajax('/resource/list', {
		method: 'GET',
		data: Object.assign({
			page: num,
			size: 20
		}, utils.getSearchParams('video'))
	}).done((msg) => {
		const dataArr = msg.data;
		if (num === 1) {
			$('.video-box').html('');
		}
		if (dataArr.length === 0) {
			if (end) {
				end();
			}
			checkNone();
			return;
		}
		if (next) {
			next();
		}
		appendDetail(dataArr);
	});
}
function appendDetail(dataArr) {
	const videoBox = $('.video-box');
	for (let v of dataArr) {
		const url = v.coverUrl;
		const itemWrap = createVideoItem(v, url);
		videoBox.append(itemWrap);
		videojs(`#video-${v.materialId}`);
	}
}
function createVideoItem(data, url) {
	return $(`
			<div class="video-item-wrap col s4"">
				<div class="video-item resource-hover-item">
					<div class="name-wrap ellipsis">
						<span>${data.title}</span>
					</div>
					<video
						id="video-${data.materialId}"
						class="video stop video-js"
						controls
						preload="auto"
						data-setup='{}'>
					<source src="${url}"></source>
					<p class="vjs-no-js">
						您的浏览器不支持播放该视频
					</p>
					</video>
					<div class="desc-wrap ellipsis">
						<span>${data.desc}</span>
					</div>
					<div class="toolbox-wrap">
						<div class="toolbox">
							<div class="icon-wrap">
								<i class="kb-icon kb-download view-download" data-url="${url}"></i>
							</div>
							<div class="icon-wrap">
								<i class="kb-icon kb-edit view-edit" data-id="${data.materialId}"></i>
							</div>
							<div class="icon-wrap">
								<i class="kb-icon kb-delete view-delete" data-id="${data.materialId}"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			`);
}
function bindEvent() {
	$('#video-search').on('click', () => {
		appendVideos();
	});
	$('#video-add').on('click', () => {
		ifAdd = true;
		detail.updateTitle('新增视频素材');
		detail.show();
	});
	utils.bindResourceDownloadEvent('video');
	utils.bindResourceEditEvent('video', (data) => {
		ifAdd = false;
		editMaterialId = data.materialId;
		detail.updateTitle('编辑视频素材');
		const nonShared = data.nonShared;
		mediaId = nonShared.mediaId;
		mediaUrl = nonShared.mediaUrl;
		detailEl.find('.title').val(data.title);
		detailEl.find('.desc').val(data.desc);
		renderUploadDetail(nonShared.mediaId, nonShared.mediaUrl);
		renderPreviewVideo(mediaId, mediaUrl);
		detail.show();
	});
	utils.bindResourceDeleteEvent('video', (data, el) => {
		const bigItem = el.closest('.video-item');
		bigItem.parent().remove();
		checkNone();
	});
	bindDetailEvent();
}
function bindDetailEvent() {
	detailEl.on('input', '.title', function () {
		const titlePreview = detailEl.find('.title-preview');
		const inputVal = $.trim($(this).val() as string);
		if (inputVal === '') {
			titlePreview.text('标题');
		} else {
			titlePreview.text(inputVal);
		}
	});
	detailEl.on('input', '.desc', function () {
		const descPreview = detailEl.find('.desc-preview');
		const inputVal = $.trim($(this).val() as string);
		if (inputVal === '') {
			descPreview.text('简介');
		} else {
			descPreview.text(inputVal);
		}
	});
	detailEl.on('click', '.cover-operation', function () {
		deleteArr.push(mediaId);
		utils.toast('删除视频成功！');
		detailEl.find('.cover-show').html('');
		detailEl.find('.card-image').html('');
		mediaId = null;
		mediaUrl = null;
	});
	detailEl.find('.save').on('click', () => {
		ifSave = true;
		const title = $.trim(detailEl.find('.title').val());
		if (title === '') {
			utils.toast('标题不能为空');
			return;
		}
		if (!mediaUrl) {
			utils.toast('请上传视频');
			return;
		}
		utils.resourceFileDeleteMoreEvent(deleteArr);
		if (ifAdd) {
			utils.resourceCreateAjax({
				title: $.trim(detailEl.find('.title').val()),
				desc: $.trim(detailEl.find('.desc').val()),
				type: 'video',
				nonShared: {
					mediaId,
					mediaUrl,
					timeLength
				}
			}, (data) => {
				const newData = data.data;
				removeNone();
				const videoItem = `
				<div class="video-item-wrap col s4"">
				<div class="video-item resource-hover-item">
					<div class="name-wrap ellipsis">
						<span>${newData.title}</span>
					</div>
					<video
						id="video-${newData.materialId}"
						class="video video-js vjs-big-play-centered stop"
						controls
						preload="auto"
						data-setup='{}'>
					<source src="${mediaUrl}" type="video/mp4" type="video/mp4"></source>
					<p class="vjs-no-js">
						您的浏览器不支持播放该视频
					</p>
					</video>
					<div class="desc-wrap ellipsis">
						<span>${newData.desc}</span>
					</div>
					<div class="toolbox-wrap">
						<div class="toolbox">
							<div class="icon-wrap">
								<i class="kb-icon kb-edit view-edit" data-id="${newData.materialId}"></i>
							</div>
							<div class="icon-wrap">
								<i class="kb-icon kb-delete view-delete" data-id="${newData.materialId}"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
				bigEl.find('.video-box').prepend(videoItem);
				videojs(`#video-${data.data.materialId}`);
				detail.hide();
			});
		} else {
			utils.resourceUpdateAjax({
				materialId: editMaterialId,
				title: $.trim(detailEl.find('.title').val()),
				desc: $.trim(detailEl.find('.desc').val()),
				type: 'video',
				nonShared: {
					mediaId,
					mediaUrl,
					timeLength
				}
			}, (data) => {
				const newData = data.data;
				const editItem = bigEl.find(`.view-edit[data-id="${newData.materialId}"]`).closest('.video-item-wrap');
				const videoItem = createVideoItem(newData, mediaUrl);
				videoItem.insertAfter(editItem);
				videojs(`#video-${newData.materialId}`);
				editItem.remove();
				detail.hide();
			});
		}
	});
	detailEl.find('.cancel').on('click', function () {
		detail.hide();
	});
}
function checkNone() {
	const box = $('.video-box');
	if (box.find('.video-item-wrap').length === 0) {
		box.html('<p class="resource-none">无视频素材</p>');
	}
}
function removeNone() {
	const box = $('.video-box');
	if (box.find('.resource-none').length !== 0) {
		box.html('');
	}
}
function clearForm() {
	if (!ifSave) {
		utils.resourceFileDeleteMoreEvent(allUploadArr);
	}
	ifSave = false;
	mediaId = null;
	mediaUrl = null;
	detailEl.find('.title').val(null);
	detailEl.find('.desc').val(null);
	detailEl.find('.cover-show').html('');
	detailEl.find('.title-preview').text('标题');
	detailEl.find('.desc-preview').text('简介');
	detailEl.find('.card-image').html('');
}
function initUpload() {
	const btn = $('#upload-video');
	new Uploader({
		btn: btn,
		accept: '.3gp,.3g2,.mpeg,.ogv,.webm,.mp4',
		url: '/resource/file/upload',
		name: 'file',
		params: {
			type: 'video'
		},
		size: 20000000,
		options: {
			messages: {
				sizeError: '文件不能超过20M'
			}
		},
		success: (id, name, res) => {
			const data = res.data;
			renderUploadDetail(data.mediaId, data.url);
			if (mediaId) {
				deleteArr.push(mediaId);
			}
			mediaId = data.mediaId;
			allUploadArr.push(mediaId);
			mediaUrl = data.url;
			timeLength = data.timeLength;
			renderPreviewVideo(mediaId, mediaUrl);
		}
	});
}
function renderPreviewVideo(id, url) {
	$('.card-image').html('').append(`
		<video
			id="video-${id}"
			class="video stop video-js"
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
	detailEl.find('.cover-show').html('').append(`
		<div class='row'>
			<div class='col s8 cover-box'>
				<div class='row'>
					<div class='col s6'>
						<video
							style="height:80px;width:80px;margin: 10px 0 0 15px;"
							class="video stop"
							preload="auto"
							data-setup='{}'>
						<source src="${url}" type="video/mp4"></source>
						</video>
					</div>
					<div class='col s2'>
						<a class='cover-operation' data-id="${id}">删除</a>
					</div>
				</div>
			</div>
		</div>
	`);
}
