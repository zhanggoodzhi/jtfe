import * as utils from 'utils';
import * as updateUtils from './updateUtils';
let modalEl;
let tabEl;
let pagination;
declare const appid;
declare const kbRestUrl;
declare const group;
let updateTable;
export function initNews(update) {
	updateTable = update;
	init();
}
export function renderNews(data) {
	const obj = {
		id: data.materialId,
		url: data.articles[0].picUrl,
		title: data.title,
		desc: data.desc
	};
	renderNewsFormat(obj);
}
export function renderNewsFormat(obj) {
	// tabEl = $('#news-tab');
	let desc = obj.desc ? `<div class="desc-wrap"><span class="ellipsis" title="${obj.desc}">${obj.desc}</span></div>` : '';
	const boxItem = $(`
<div class="image-item-wrap col-xs-3">
  <div class="image-item resource-hover-item">
  	<div class="name-wrap"><span class="ellipsis" title="${obj.title}">${obj.title}</span></div>
    <div style="background-image:url(${obj.url})" class="image"></div>
    ${desc}
    <div class="operate-wrap clearfix"><span data-id="${obj.id}" class="edit">编辑</span><span class="delete">删除</span></div>
  </div>
</div>
	`);
	tabEl.find('.resource-box').html('').append(boxItem);
	updateUtils.changeTagStyle('news');
}
function init() {
	tabEl = $('#news-tab');
	modalEl = $('#news-modal');
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
	updateUtils.bindDeleteEvent('news', updateTable);
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
		const desc = selected.data().desc;
		updateTable((answer) => {
			answer.resourceId = id;
			answer.type = 5;
			answer.plainText = title;
			return answer;
		});
		modalEl.modal('hide');
		renderNewsFormat({
			id,
			url,
			title,
			desc
		});
	});
}

function renderItems(num: number = 1) {
	const endLoading = utils.addLoadingBg(modalEl.find('.resource-image-list'));
	$.ajax(`${kbRestUrl}/resource/search/${appid}`, {
		method: 'POST',
		data: {
			page: num,
			size: 4,
			type: 'news',
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
	imageList.html('');
	for (let v of dataArr) {
		imageList.append(createNewsItem(v));
	}
}
function createNewsItem(msg) {
	return $(`
			<div class="image-item-wrap col-xs-3">
				<div class="image-item resource-hover-item"">
					<div class="name-wrap">
						<span class="ellipsis" title="${msg.title}">${msg.title}</span>
					</div>
						<div class="image" data-desc="${msg.desc}" data-title="${msg.title}" data-url="${msg.newsItemsGetList[0].picUrl}" data-id="${msg.resourceId}" style="background-image:url(${msg.newsItemsGetList[0].picUrl})">
							<div class="img-wrap">
								<img src="images/new_yes.png"/>
							</div>
						</div>
					<div class="desc-wrap">
						<span class="ellipsis" title="${msg.desc ? msg.desc : ''}">${msg.desc ? msg.desc : ''}</span>
					</div>
				</div>
			</div>
		`);
}
