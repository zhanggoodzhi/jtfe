import * as utils from 'utils';
import * as updateUtils from './updateUtils';
let modalEl;
let tabEl;
let pagination;
declare const appid;
declare const kbRestUrl;
declare const group;
let updateTable;
export function initAttach(update) {
	updateTable = update;
	init();
}
export function renderAttach(data) {
	const src = getSrc({
		type: data.type,
		fileext: data.fileext
	});
	const obj = {
		src,
		id: data.id,
		title: data.filename
	};
	renderFileFormat(obj);
}
function renderFileFormat({ id, title, src }) {
	const boxItem = $(`
<div data-id="${id}" class="image-item-wrap col-xs-3">
  <div class="image-item resource-hover-item">
    <div style="background-image:url(${src})" class="image file"></div>
    <div class="name-wrap"><span class="ellipsis" title="${title}">${title}</span></div>
    <div class="operate-wrap clearfix"><span class="delete">删除</span></div>
  </div>
</div>
	`);
	tabEl.find('.resource-box').html('').append(boxItem);
	updateUtils.changeTagStyle('attach');
}
function init() {
	tabEl = $('#attach-tab');
	modalEl = $('#attach-modal');
	initPagination();
	bindEvent();
}
function initPagination() {
	pagination = new utils.Pagination(modalEl.find('.resource-content'), {
		size: 6,
		total: 1,
		onChange: ({ index, size }) => {
			renderItems(index);
		}
	});
}
function clearModal() {
	modalEl.find('.keyword').val('');
	modalEl.find('.modal-footer span').removeClass('active');
}
function bindEvent() {
	updateUtils.bindDeleteEvent('attach', updateTable);
	tabEl.find('.select-item').on('click', function () {
		modalEl.modal('show');
		renderItems();
	});
	modalEl.on('hide.bs.modal', function () {
		clearModal();
	});
	modalEl.on('click', '.image-item-wrap .image', function () {
		const el = $(this);
		const parentEl = el.closest('.image-item-wrap');
		parentEl.siblings().find('.image').removeClass('active');
		el.addClass('active');
		modalEl.find('.count-number').addClass('active');
	});
	modalEl.find('.sure').on('click', function () {
		const selected = modalEl.find('.image.active');
		if (!selected.length) {
			utils.alertMessage('请先选择一项');
			return;
		}
		const id = selected.data().id;
		const src = selected.data().src;
		const title = selected.data().title;
		updateTable((answer) => {
			answer.plainText = title;
			answer.type = 8;
			answer.resourceId = id;
			return answer;
		});
		modalEl.modal('hide');
		renderFileFormat({
			id,
			src,
			title
		});
	});
	modalEl.find('.search').on('click', function () {
		renderItems();
	});
}

function renderItems(num: number = 1) {
	const endLoading = utils.addLoadingBg(modalEl.find('.resource-image-list'));
	$.ajax(`${kbRestUrl}/attachment/page/search`, {
		method: 'POST',
		data: {
			appid,
			page: num,
			size: 6,
			filename: modalEl.find('.keyword').val().trim(),
			group: group
		}
	}).done((msg) => {
		endLoading();
		pagination.total = msg.total;
		const dataArr = msg.data;
		renderDetail(dataArr);
	});
}
function renderDetail(dataArr) {
	const imageList = modalEl.find('.resource-image-list');
	imageList.html('');
	for (let v of dataArr) {
		imageList.append(createFileItem(v));
	}
}
function getSrc(msg) {
	let imgSrc = 'images/types/';
	switch (msg.type) {
		case 1:
			let docImg;
			const extension = msg.fileext.substring(1);
			if (extension === 'doc' || 'docm' || 'dotx' || 'dotm' || 'docx') {
				docImg = imgSrc + 'doc.png';
			} else if (extension === 'xls' || 'xlsx' || 'xlsm' || 'xltx' || 'xltm' || 'xlsb' || 'xlam') {
				docImg = imgSrc + 'xls.png';
			} else if (extension === 'ppt' || 'pptx' || 'pptm' || 'ppsm' || 'potx' || 'potm') {
				docImg = imgSrc + 'ppt.png';
			} else if (extension === 'pdf') {
				docImg = imgSrc + 'pdf.png';
			} else if (extension === 'txt') {
				docImg = imgSrc + 'txt.png';
			}
			return docImg;
		case 2:
			return imgSrc + 'audio.png';
		case 3:
			return imgSrc + 'video.png';
		case 4:
			return imgSrc + 'image.png';
		default:
			return '';
	}
}
function createFileItem(msg) {
	const src = getSrc(msg);
	return $(`
			<div class="image-item-wrap col-xs-3">
				<div class="image-item resource-hover-item" data-id="${msg.id}">
						<div class="image file" data-src="${src}" data-title="${msg.filename}" data-id="${msg.id}" style="background-image:url(${src})">
							<div class="img-wrap">
								<img src="images/new_yes.png"/>
							</div>
						</div>
					<div class="name-wrap">
						<span class="ellipsis" title="${msg.filename}">${msg.filename}</span>
					</div>
				</div>
			</div>
		`);
}
