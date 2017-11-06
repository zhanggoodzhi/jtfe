import * as utils from 'utils';
import { Upload } from 'upload';
import * as resourceUtils from './resourceUtils';
let bigEl: JQuery;
let pagination;
let uploader;
// let endAlert;
declare const kbRestUrl;
declare const appid;
declare const group;
export function initImage() {
	utils.tabShown($('#image-link'), (e) => {
		init();
	});
}
function init() {
	bigEl = $('#image-tab');
	initPagination();
	appendImages();
	initUpload();
	bindEvent();
}
function initPagination() {
	const boxEl = $('#image-tab .image-box');
	boxEl.height(window.innerHeight - 297);
	pagination = new utils.Pagination($('#image-tab'), {
		size: 18,
		total: 1,
		onChange: ({ index, size }) => {
			appendImages(index);
		}
	});
}
function checkNone() {
	const box = $('.image-box');
	if (box.find('.image-item-wrap').length === 0) {
		box.html(resourceUtils.noResourceHtml());
	}
}

function appendImages(num: number = 1) {
	pagination.index = num;
	// $.ajax('weixinv2/material/mediaList', {
	// 	method: 'GET',
	// 	data: {
	// 		page: num,
	// 		pageSize: 18,
	// 		type: 2,
	// 		keyword: $('#image-search-title').val().trim()
	// 	}
	// }).done((msg) => {
	// 	pagination.total = msg.total;
	// 	const dataArr = msg.rows;
	// 	if (num === 1) {
	// 		$('.image-box').html('');
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
			title: $('#image-search-title').val().trim(),
			page: num,
			size: 18,
			type: 'image'
		}
	}).done((msg) => {
		pagination.total = msg.total;
		const dataArr = [];
		for (let v of msg.data) {
			dataArr.push(...v.resourceGetList);
		}
		if (num === 1) {
			$('.image-box').html('');
		}
		if (dataArr.length === 0) {
			checkNone();
			return;
		}
		appendDetail(dataArr);
		checkNone();
	});
}
function formatMonth(time) {
	return time ? moment(time).format('YYYY-MM') : null;
}
function initUpload() {
	$('#image-upload-btn').on('change', function () {
		const thisFile = this.files[0];
		resourceUtils.uploadResource('image', thisFile, (imgData) => {
			$(this).val(null);
			resourceUtils.resourceCreateAjax({
				title: thisFile.name,
				group: group,
				type: 'image',
				nonShared: {
					mediaUrl: imgData.url,
					mediaId: imgData.mediaId
				}
			}, (msg) => {
				utils.alertMessage('操作成功', true);
				appendImages();
			});
		});
	});
	// bigEl.
	// uploader = new Upload({
	// 	btn: $('#image-add-btn'),
	// 	accept: '.jpg,.png',
	// 	url: 'weixinv2/material/uploadFile',
	// 	name: 'fileToUpload',
	// 	onUpload() {
	// 		uploader.uploader.setParams({
	// 			type: 2
	// 		});
	// 		// endAlert = utils.alertMessage('正在上传', true, false);
	// 	},
	// 	success(id, name, res) {
	// 		// endAlert.remove();
	// 		appendImages();
	// 	}
	// });
}
function createImageItem(msg) {
	return $(`
			<div class="image-item-wrap col-xs-2">
				<div class="image-item resource-hover-item" data-id="${msg.resourceId}">
					<div class="image" data-url="${msg.coverUrl}" style="background-image:url(${msg.coverUrl})">
						<div class="toolbox-wrap">
							<div class="toolbox">
								<div class="icon-wrap">
									<i data-id="${msg.resourceId}" title="删除" class="fa cloud-fa-icon fa-trash view-delete" data-id="${msg.resourceId}"></i>
								</div>
							</div>
						</div>
					</div>
					<div class="name-wrap ellipsis">
						<span title="${msg.title}">${msg.title}</span>
						<input class="input-small"/>
					</div>
				</div>
			</div>
		`);
}
function bindEvent() {
	const tabEl = $('#image-tab');
	resourceUtils.bindSearchEvent('image', () => {
		appendImages();
	});
	resourceUtils.bindResourceDeleteEvent('image', () => {
		appendImages();
		checkNone();
	});
	bindPreviewEvent();
	utils.tabShown($('#image-link'), (e) => {
		appendImages();
	}, false);
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
		const endLoading = utils.addLoadingBg(previewWrap);
		previewWrap.find('.preloader-wrapper').removeClass('small').addClass('large');
		previewWrap.find('.spinner-layer').css('border-color', 'white');
		const newImg = $(`<img class="image-loading" src="${el.data().url}"/>`);
		previewWrap.append(newImg);
		endLoading();
		newImg.on('load', function () {
			newImg.removeClass('image-loading');
		});
		// detailAjax(bigItem.data().id).done((data) => {
		// 	const newImg = $(`<img class="image-loading" src="${data.nonShared.mediaUrl}"/>`);
		// 	previewWrap.append(newImg);
		// 	newImg.on('load', function () {
		// 		endLoading();
		// 		newImg.removeClass('image-loading');
		// 	});
		// });
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
	imageBox.html('');
	for (let v of dataArr) {
		imageBox.append(createImageItem(v));
	}
}

