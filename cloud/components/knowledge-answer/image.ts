import * as utils from 'utils';
import * as updateUtils from './updateUtils';
let modalEl;
let tabEl;
let pagination;
declare const appid;
declare const kbRestUrl;
declare const group;
let updateTable;
export function initImage(update) {
	updateTable = update;
	init();
}
export function renderImage(data) {
	const obj = {
		id: data.materialId,
		url: data.nonShared.mediaUrl,
		title: data.title
	};
	renderImageFormat(obj);
}
function renderImageFormat(obj) {
	// tabEl = $('#image-tab');
	const boxItem = $(`
<div data-id="${obj.id}" class="image-item-wrap col-xs-3">
  <div class="image-item resource-hover-item">
    <div style="background-image:url(${obj.url})" class="image"></div>
    <div class="name-wrap"><span class="ellipsis" title="${obj.title}">${obj.title}</span></div>
    <div class="operate-wrap clearfix"><span class="delete">删除</span></div>
  </div>
</div>
	`);
	tabEl.find('.resource-box').html('').append(boxItem);
	updateUtils.changeTagStyle('image');
}
function init() {
	tabEl = $('#image-tab');
	modalEl = $('#image-modal');
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
	updateUtils.bindDeleteEvent('image', updateTable);
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
		const url = selected.data().url;
		const title = selected.data().title;
		updateTable((answer) => {
			answer.resourceId = id;
			answer.type = 4;
			answer.plainText = title;
			return answer;
		});
		modalEl.modal('hide');
		renderImageFormat({
			id,
			url,
			title
		});
	});
	modalEl.find('.search').on('click', function () {
		renderItems();
	});
}

function renderItems(num: number = 1) {
	const endLoading = utils.addLoadingBg(modalEl.find('.resource-image-list'));
	$.ajax(`${kbRestUrl}/resource/search/${appid}`, {
		method: 'POST',
		data: {
			page: num,
			size: 6,
			type: 'image',
			title: modalEl.find('.keyword').val().trim(),
			group: group
		}
	}).done((msg) => {
		endLoading();
		pagination.total = msg.total;
		let dataArr = [];
		for (let v of msg.data) {
			dataArr.push(...v.resourceGetList);
		}
		renderDetail(dataArr);
	});
}
function renderDetail(dataArr) {
	const imageList = modalEl.find('.resource-image-list');
	imageList.html('');
	for (let v of dataArr) {
		imageList.append(createImageItem(v));
	}
}
function createImageItem(msg) {
	return $(`
			<div class="image-item-wrap col-xs-3">
				<div class="image-item resource-hover-item">
						<div class="image" data-title="${msg.title}" data-id="${msg.resourceId}" data-url="${msg.coverUrl}" style="background-image:url(${msg.coverUrl})">
							<div class="img-wrap">
								<img src="images/new_yes.png"/>
							</div>
						</div>
					<div class="name-wrap">
						<span class="ellipsis" title="${msg.title}">${msg.title}</span>
					</div>
				</div>
			</div>
		`);
}
