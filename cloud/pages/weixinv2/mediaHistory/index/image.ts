import * as utils from 'utils';
import { Upload } from 'upload';
import * as resourceUtils from './resourceUtils';
let bigEl: JQuery;
let pagination: utils.Pagination;
let uploader;
// let endAlert;
let pushModal: resourceUtils.PushModal;
declare const nodeAccountId: string;
export function initImage(p: resourceUtils.PushModal) {
	pushModal = p;
	$('#image-link').one('shown.bs.tab', () => {
		init();
		$('#image-link').on('shown.bs.tab', () => {
			getImages(pagination.index);
		});
	});
}
function init() {
	bigEl = $('#image-tab');
	getImages();
	initPagination();
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
			getImages(index);
		}
	});
}

function getImages(index: number = 1) {
	const end = utils.addLoadingBg($('#image-tab'), $('#image-tab .image-box'));
	$.ajax('weixinv2/material/mediaList', {
		method: 'GET',
		data: {
			credentialId: resourceUtils.getAccountId('image'),
			page: index,
			pageSize: 18,
			type: 2,
			keyword: $('#image-search-title').val().trim()
		}
	}).done((msg) => {
		pagination.total = msg.total;
		const dataArr = msg.rows;
		appendDetail(dataArr);
	})
		.always(() => {
			end();
		});

}
function formatMonth(time) {
	return time ? moment(time).format('YYYY-MM') : null;
}
function initUpload() {
	uploader = new Upload({
		btn: $('#image-add-btn'),
		accept: '.jpg,.png',
		url: 'weixinv2/material/uploadFile',
		name: 'fileToUpload',
		onUpload() {
			uploader.uploader.setParams({
				credentialId: resourceUtils.getAccountId('image'),
				type: 2
			});
		},
		success(id, name, res) {
			getImages();
		}
	});
}
function createImageItem(msg) {
	const id = $(`#image-account`).val();
	let pushOne = `<div class="icon-wrap">
									<i data-id="${msg.id}" title="群发" class="push-one-icon"></i>
								</div>`,
		del = `<div class="icon-wrap">
				<i data-id="${msg.id}" title="删除" class="fa cloud-fa-icon fa-trash view-delete" data-id="${msg.id}"></i>
			</div>`;


	if (id === '') {
		pushOne = '';
	} else if (nodeAccountId && nodeAccountId !== id) {
		del = '';
	}

	return $(`
			<div class="image-item-wrap col-xs-2">
				<div class="image-item resource-hover-item" data-id="${msg.id}">
					<div class="image" data-url="${msg.identifierUrl}" style="background-image:url(${msg.identifierUrl})">
						<div class="toolbox-wrap">
							<div class="toolbox">
								<div class="icon-wrap">
									<i data-id="${msg.id}" title="推送到矩阵" class="push-all-icon"></i>
								</div>
								${pushOne}
								${del}
							</div>
						</div>
					</div>
					<div class="name-wrap ellipsis">
						<span title="${msg.name}">${msg.name}</span>
						<input class="input-small"/>
					</div>
				</div>
			</div>
		`);
}
function bindEvent() {
	const tabEl = $('#image-tab');
	resourceUtils.bindSearchEvent('image', () => {
		getImages();
	});
	resourceUtils.bindDeleteEvent('image', () => {
		getImages();
	});
	tabEl.on('click', '.push-all-icon', function () {
		pushModal.show({
			type: 'image',
			mediaId: $(this).data().id,
			single: false,
			refresh: () => {
				getImages();
			}
		});
	});
	tabEl.on('click', '.push-one-icon', function () {
		pushModal.show({
			type: 'image',
			mediaId: $(this).data().id,
			single: true,
			refresh: () => {
				getImages();
			}
		});
	});
	bindPreviewEvent();
}
function bindEditEvent() {
	let mediaId: string;
	let mediaUrl: string;
	resourceUtils.bindResourceEditEvent('image', (data, el) => {
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
		const title = el.val();
		resourceUtils.resourceUpdateAjax({
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
	if (!dataArr || dataArr.length <= 0) {
		imageBox.html(resourceUtils.noResourceHtml());
	} else {
		imageBox.empty();
		for (let v of dataArr) {
			imageBox.append(createImageItem(v));
		}
	}
}
