import * as utils from 'utils';
import { videojs } from 'videojs';
import * as updateUtils from './updateUtils';
let modalEl;
let tabEl;
let pagination;
declare const appid;
declare const kbRestUrl;
declare const group;
let updateTable;
export function initVideo(update) {
	updateTable = update;
	init();
}
export function renderVideo(data) {
	const obj = {
		id: data.materialId,
		url: data.nonShared.mediaUrl,
		title: data.title,
		desc: data.desc
	};
	renderVideoFormat(obj);
}
function renderVideoFormat({ id, title, desc, url }) {
	tabEl = $('#video-tab');
	const boxItem = $(`
<div class="image-item-wrap col-xs-6">
  <div class="image-item resource-hover-item">
  	 <div class="name-wrap"><span class="ellipsis" title="${title}">${title}</span></div>
    <video width="230" height="170" id="video-box-${id}" class="video-js video" controls src="${url}">
						</video>
    <div class="desc-wrap"><span class="ellipsis" title="${desc}">${desc}</span></div>
    <div class="operate-wrap clearfix"><span data-id="${id}" class="edit">编辑</span><span class="delete">删除</span></div>
  </div>
</div>
	`);
	tabEl.find('.resource-box').html('').append(boxItem);
	videojs($(`#video-box-${id}`).get(0));
	updateUtils.changeTagStyle('video');
}
function init() {
	tabEl = $('#video-tab');
	modalEl = $('#video-modal');
	initPagination();
	bindEvent();
}
function initPagination() {
	pagination = new utils.Pagination(modalEl.find('.resource-content'), {
		size: 4,
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
	updateUtils.bindDeleteEvent('video', updateTable);
	tabEl.find('.select-item').on('click', function () {
		modalEl.modal('show');
		renderItems();
	});
	modalEl.on('hide.bs.modal', function () {
		clearModal();
	});
	modalEl.on('change', '.video-select-item', function () {
		modalEl.find('.count-number').addClass('active');
	});
	modalEl.find('.sure').on('click', function () {
		const selected = modalEl.find('input[type=radio]:checked');
		if (!selected.length) {
			utils.alertMessage('请先选择一项');
			return;
		}
		const id = selected.data().id;
		const url = selected.data().url;
		const title = selected.data().title;
		const desc = selected.data().desc;
		modalEl.modal('hide');
		renderVideoFormat({
			id,
			url,
			title,
			desc
		});
		updateTable((answer) => {
			answer.plainText = title;
			answer.type = 3;
			answer.resourceId = id;
			return answer;
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
			size: 4,
			type: 'video',
			title: modalEl.find('.keyword').val().trim(),
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
	imageList.empty();
	for (let v of dataArr) {
		imageList.append(createVideoItem(v));
		videojs($(`#video-${v.resourceId}`).get(0));
	}
}
function createVideoItem(msg) {
	const videoItem = $(`
			<div class="image-item-wrap col-xs-6">
				<div class="image-item resource-hover-item" data-id="${msg.resourceId}">
					<label class="name-wrap">
						<input data-url="${msg.coverUrl}" data-title="${msg.title}" data-desc="${msg.desc}" data-id="${msg.resourceId}" class="video-select-item" name="video-item" type="radio">
						<span class="ellipsis" title="${msg.title}">${msg.title}</span>
					</label>
						<video width="230" height="170" id="video-${msg.resourceId}" class="video-js video" controls src="${msg.coverUrl}">
						</video>
					<div class="desc-wrap">
						<span class="ellipsis" title="${msg.desc}">${msg.desc}</span>
					</div>
				</div>
			</div>
		`);
	return videoItem;
}
