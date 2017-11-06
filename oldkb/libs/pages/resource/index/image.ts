import * as utils from 'utils';
import { Uploader } from 'upload';
let bigEl: JQuery;
export function initImage() {
	utils.tabShown($('#image-link'), (e) => { init(); });
};
function init() {
	bigEl = $('#image-tab');
	$('#image-summary').parent().remove();// 图片不需要简介
	utils.setScroll();
	appendImages();
	initScrollEvent();
	initUpload();
	bindEvent();
}
function initScrollEvent() {
	new utils.ScrollPagination({
		el: $('#image-tab .kb-scroll'),
		cb: (page, next, end) => {
			appendImages(page, next, end);
		}
	});
}
function checkNone() {
	const box = $('.image-box');
	if (box.find('.box-item').length === 0) {
		box.html('<p class="resource-none">无图片素材</p>');
	}
}
function removeNone() {
	const box = $('.image-box');
	if (box.find('.resource-none').length !== 0) {
		box.html('');
	}
}

function appendImages(num: number = 1, next?, end?) {
	$.ajax('/resource/list', {
		method: 'GET',
		data: Object.assign({
			page: num,
			size: 40
		}, utils.getSearchParams('image'))
	}).done((msg) => {
		// removeNone();
		const dataArr = msg.data;
		if (num === 1) {
			$('.image-box').html('');
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
function initUpload() {
	new Uploader({
		btn: $('#image-add'),
		accept: '.jpg,.png',
		url: '/resource/file/upload',
		name: 'file',
		params: {
			type: 'image'
		},
		success: (id, name, res) => {
			const data = res.data;
			utils.resourceCreateAjax({
				title: name,
				nonShared: {
					mediaId: data.mediaId,
					mediaUrl: data.url
				},
				type: 'image'
			}, (msg) => {
				removeNone();
				const url = data.url;
				const smallUrl = data.imgSmallUrl;
				const imageItem = createImageItem(msg.data, url, smallUrl);
				const thisMonth = utils.formatMonth(new Date());
				const latestMonth = bigEl.find('.time-wrap').eq(0).find('span').text();
				if (thisMonth === latestMonth) {// 当前时间符合老图片的月份
					bigEl.find('.box-item').eq(0).find('.time-wrap').after(imageItem);
				} else {
					let boxItem = $(`
						<div class="row box-item"></div>
					`);
					boxItem.append(`
						<div class="time-wrap col s12">
							<span>${thisMonth}</span>
						</div>
					`).append(imageItem);
					bigEl.find('.image-box').prepend(boxItem);
				}
			});
		}
	});
}
function createImageItem(msg, url, smallUrl) {
	return $(`
			<div class="image-item-wrap col s2">
				<div class="image-item resource-hover-item" data-id="${msg.materialId}">
					<div class="image" data-url="${smallUrl}" style="background-image:url(${smallUrl})">
						<div class="toolbox-wrap">
							<div class="toolbox">
								<div class="icon-wrap">
									<i class="kb-icon kb-download view-download" data-url="${url}"></i>
								</div>
								<div class="icon-wrap">
									<i class="kb-icon kb-edit view-edit" data-id="${msg.materialId}"></i>
								</div>
								<div class="icon-wrap">
									<i class="kb-icon kb-delete view-delete" data-id="${msg.materialId}"></i>
								</div>
							</div>
						</div>
					</div>
					<div class="name-wrap ellipsis">
						<span>${msg.title}</span>
						<input class="input-small"/>
					</div>
				</div>
			</div>
		`);
}
function bindEvent() {
	$('#image-search').on('click', () => {
		appendImages();
	});
	utils.bindResourceDownloadEvent('image');
	bindEditEvent();
	utils.bindResourceDeleteEvent('image', (data, el) => {
		const bigItem = el.closest('.image-item');
		if (bigItem.parent().siblings('.image-item-wrap').length === 0) {
			bigItem.closest('.box-item').remove();
		} else {
			bigItem.parent().remove();
		}
		checkNone();
	});
	bindPreviewEvent();
}
function bindEditEvent() {
	let mediaId: string;
	let mediaUrl: string;
	utils.bindResourceEditEvent('image', (data, el) => {
		console.log('小ajax');
		const bigItem = el.closest('.image-item');
		const editItem = bigItem.find('.name-wrap');
		const input = editItem.find('input');
		const name = editItem.find('span');
		editItem.addClass('edit-active');
		input.val(name.text());
		input.focus();
		mediaId = data.nonShared.mediaId;
		mediaUrl = data.nonShared.mediaUrl;
	});
	bigEl.on('blur', '.name-wrap input', function () {
		const el = $(this);
		const editItem = el.closest('.name-wrap');
		const name = editItem.find('span');
		const materialId = el.closest('.image-item').data().id;
		const title = el.val() as string;
		utils.resourceUpdateAjax({
			materialId,
			title,
			nonShared: {
				mediaId,
				mediaUrl
			},
			type: 'image'
		}, () => {
			editItem.removeClass('edit-active');
			name.text(title);
		});
	});
	bigEl.on('keypress', '.name-wrap input', function (e) {
		if (e.keyCode === 13) {
			$(this).blur();
		}
	});
}
function bindPreviewEvent() {
	const previewWrap = bigEl.find('.preview-wrap');
	bigEl.on('click', '.image', function (e) {
		const el = $(e.target);
		if (el.is('.toolbox-wrap') || el.closest('.toolbox-wrap').length > 0) {// 如果点在工具上
			return;
		}
		const bigItem = el.parent();
		previewWrap.addClass('preview-show');
		previewWrap.find('img').remove();
		const endLoading = utils.loading($('.preview-wrap'));
		previewWrap.find('.preloader-wrapper').removeClass('small').addClass('large');
		previewWrap.find('.spinner-layer').css('border-color', 'white');
		detailAjax(bigItem.data().id).done((data) => {
			const newImg = $(`<img class="image-loading" src="${data.nonShared.mediaUrl}"/>`);
			previewWrap.append(newImg);
			newImg.on('load', function () {
				endLoading();
				newImg.removeClass('image-loading');
			});
		});
	});
	previewWrap.on('click', '.close-btn', function () {
		previewWrap.removeClass('preview-show');
	});
}

function detailAjax(id) {
	return $.ajax('/resource/detail', {
		method: 'GET',
		data: {
			materialId: id,
			type: 'image'
		}
	});
}
function appendDetail(dataArr) {
	const imageBox = $('.image-box');
	for (let v of dataArr) {
		const lastTimeWrap = bigEl.find('.time-wrap:last');
		if (utils.formatMonth(v.createTime) === lastTimeWrap.find('span').text()) {
			let imglist = v.resourceGetList;
			for (let vi of imglist) {
				const url = vi.coverUrl;
				const smallUrl = vi.imgSmallMediaUrl;
				lastTimeWrap.parent().append(createImageItem(vi, url, smallUrl));
			}
		} else {
			let boxItem = $(`
			<div class="row box-item"></div>
		`);
			let time = utils.formatMonth(v.createTime);
			boxItem.append(`
			<div class="time-wrap col s12">
				<span>${time}</span>
			</div>
		`);
			let imglist = v.resourceGetList;
			for (let vi of imglist) {
				const url = vi.coverUrl;
				const smallUrl = vi.imgSmallMediaUrl;
				boxItem.append(createImageItem(vi, url, smallUrl));
			}
			imageBox.append(boxItem);
		}
	}
}
