import * as utils from 'utils';
import { Uploader } from 'upload';
import * as Masonry from 'masonry-layout';
import * as newsDetail from './newsDetail.pug';
import * as newsPreviewDetail from './newsPreviewDetail.pug';
import 'wangeditor/dist/css/wangEditor.min.css';
import * as wangEditor from 'wangeditor/dist/js/wangEditor.min.js';
const defaultData =
	{
		mediaId: null,
		mediaUrl: null,
		title: null,
		content: null,
		desc: null,
		link: null
	};
let bigEl: JQuery;
let detail;
let previewDetail;
let detailEl;
let saveData = [Object.assign({}, defaultData)];
let saveIndex = 0;
let ifAdd = true;
let editMaterialId = null;
let waterFall;
let allUploadArr = [];// 上传文件的数组
let deleteArr = [];// 待删除数组
let ifSave = false;
let editor;
export function initNews() {
	utils.tabShown($('#news-link'), (e) => { init(); });
};
function init() {
	bigEl = $('#news-tab');
	utils.setScroll();
	initSideDetail();
	initWaterFall();
	initWangEditor();
	appendNews();
	initScrollEvent();
	initUpload();
	bindEvent();
}

function initWangEditor() {
	editor = new wangEditor('wang-editor');
	editor.onchange = function () {
		console.log('触发change');
		saveData[saveIndex].content = this.$txt.html();
	};
	editor.config.uploadImgFns.onload = function (resultText, xhr) {
        // resultText 服务器端返回的text
        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持

        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
        const originalName = editor.uploadImgOriginalName || '';
		const data=JSON.parse(resultText);
        // 如果 resultText 是图片的url地址，可以这样插入图片：
        editor.command(null, 'insertHtml', '<img src="' + data.data.url + '" alt="' + originalName + '" style="max-width:100%;"/>');
        // 如果不想要 img 的 max-width 样式，也可以这样插入：
        // editor.command(null, 'InsertImage', resultText);
    };
	editor.config.uploadImgUrl = '/resource/file/upload';
	editor.config.uploadParams = {
		type: 'news'
	};
	editor.config.uploadImgFileName = 'file';
	editor.config.menus = $.map(wangEditor.config.menus, function (item, key) {
		if (item === 'video') {
			return null;
		}
		if (item === 'location') {
			return null;
		}
		return item;
	});
	editor.config.hideLinkImg = true;
	editor.create();
}

function initUpload() {
	const btn = $('#upload-news');
	new Uploader({
		btn: btn,
		accept: '.jpg,.png',
		url: '/resource/file/upload',
		name: 'file',
		params: {
			type: 'news'
		},
		success: (id, name, res) => {
			const data = res.data;
			const obj = saveData[saveIndex];
			if (obj.mediaId) {
				deleteArr.push(obj.mediaId);
			}
			obj.mediaId = data.mediaId;
			obj.mediaUrl = data.url;
			allUploadArr.push(data.mediaId);
			renderSideDetail();
		}
	});
}
function checkNone() {
	const box = $('.news-box');
	if (box.find('.news-item-wrap').length === 0) {
		box.html('<p class="resource-none">无图文素材</p>');
	}
}
function removeNone() {
	const box = $('.news-box');
	if (box.find('.resource-none').length !== 0) {
		box.html('');
	}
}
function initWaterFall() {
	waterFall = new Masonry('.grid', {
		columnWidth: 0,
		itemSelector: '.news-item-wrap'
	});
}
function waterFallReload() {
	waterFall.destroy();
	initWaterFall();
}
function initSideDetail() {
	detail = new utils.SideDetail({
		title: '新增图文素材',
		html: newsDetail(),
		hideFn: clearForm,
		menus: [utils.renderSideMenu('保存', 'save')],
		className: 'news-detail'
	});
	detailEl = detail.element.el;
	previewDetail = new utils.SideDetail({
		title: '图文素材预览',
		html: newsPreviewDetail(),
		className: 'news-preview-detail'
	});
}
function appendNews(num: number = 1, next?, end?) {
	let endLoading;
	if (num === 1) {
		const loadingEl = bigEl.find('.kb-scroll');
		endLoading = utils.loading(loadingEl);
	}
	$.ajax('/resource/list', {
		method: 'GET',
		data: Object.assign({
			page: num,
			size: 20
		}, utils.getSearchParams('news'))
	}).done((msg) => {
		const dataArr = msg.data;
		if (num === 1) {
			endLoading();
			$('.news-box').html('');
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
		waterFallReload();
	});
}
function appendDetail(dataArr) {
	const newsBox = $('.news-box');
	for (let v of dataArr) {
		const itemWrap = createNewsItem(v);
		newsBox.append(itemWrap);
	}
}
function createNewsItem(obj) {
	let smallArr = obj.newsItemsGetList;
	const itemWrap = $(`
			<div class="news-item-wrap col s4" style="position: absolute; left: 0px; top: 0px;">
				<div class="news-item resource-hover-item">
					<div class="toolbox-wrap">
						<div class="toolbox">
							<div class="icon-wrap">
								<i class="kb-icon kb-edit view-edit" data-id="${obj.materialId}"></i>
							</div>
							<div class="icon-wrap">
								<i class="kb-icon kb-delete view-delete" data-id="${obj.materialId}"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			`);
	smallArr.map((v, i) => {
		const item = itemWrap.find('.news-item');
		if (i === 0) {
			const el = $(`
						<div class="cover-wrap">
							<div class="image-wrap" style="background:url(${v.picUrl}) no-repeat">
								<div class="name-wrap ellipsis">
									<span>${v.title}</span>
								</div>
							</div>
						</div>
					`);
			el.data('detail', v);
			item.append(el);
		} else {
			const el = $(`
						<div class="child-wrap">
							<div class="name-wrap">${v.title}</div>
							<div class="image-wrap">
								<img src="${v.picUrl}">
							</div>
						</div>
						`);
			el.data('detail', v);
			item.append(el);
		}
	});
	return itemWrap;
}
function initScrollEvent() {
	new utils.ScrollPagination({
		el: $('#news-tab .kb-scroll'),
		cb: (page, next, end) => {
			appendNews(page, next, end);
		}
	});
}
function clearForm() {
	if (!ifSave) {// 取消时才调用，取消时不管是编辑还是新增都是上传多少就删掉多少
		utils.resourceFileDeleteMoreEvent(allUploadArr);
	}
	ifSave = false;
	allUploadArr = [];
	deleteArr = [];
	saveData = [Object.assign({}, defaultData)];
	saveIndex = 0;
	renderSideDetail();
}

function bindEvent() {
	$('#news-search').on('click', () => {
		appendNews();
	});
	$('#news-add').on('click', () => {
		ifAdd = true;
		detail.updateTitle('新增图文素材');
		saveIndex = 0;
		renderSideDetail();
		detail.show();
	});
	utils.bindResourceEditEvent('news', (data) => {
		detail.updateTitle('编辑图文素材');
		ifAdd = false;
		editMaterialId = data.materialId;
		saveData = data.articles.map((v) => {
			return {
				mediaId: v.picMediaId,
				mediaUrl: v.picUrl,
				title: v.title,
				desc: v.desc,
				content: v.content,
				link: v.url
			};
		});
		saveIndex = 0;
		renderSideDetail();
		detail.show();
	});
	utils.bindResourceDeleteEvent('news', (data, el) => {
		const bigItem = el.closest('.news-item-wrap');
		bigItem.remove();
		waterFallReload();
		checkNone();
	});
	bindDetailEvent();
	bigEl.on('click', '.cover-wrap,.child-wrap', showPreview);
}
function showPreview() {
	const data = $(this).data().detail;
	previewDetail.updateHtml(newsPreviewDetail(data));
	previewDetail.show();
}
function renderSideDetail() {
	const data = saveData[saveIndex];
	detailEl.find('.title').val(data.title);
	detailEl.find('.desc').val(data.desc);
	editor.$txt.html(data.content);
	detailEl.find('.link').val(data.link);
	const coverShow = detailEl.find('.cover-show');
	coverShow.html('');
	if (data.mediaId) {
		coverShow.append(`
			<div class='row'>
				<div class='col s8 cover-box'>
					<div class='row'>
						<div class='col s6'>
							<img src="${data.mediaUrl}"/>
						</div>
						<div class='col s6'>
							<a class='cover-operation' data-id="${data.mediaId}">删除</a>
						</div>
					</div>
				</div>
			</div>
		`);
	}
	const addWrap = detailEl.find('.add-wrap');
	detailEl.find('.resource-hover-item').remove();
	saveData.map((v, i) => {
		const active = i === saveIndex ? 'active' : '';
		if (i === 0) {
			const str = v.mediaUrl ? `url(${v.mediaUrl}) no-repeat` : 'white';
			$(`
				<div class="cover-wrap resource-hover-item ${active}">
					<div class="image-wrap" style="background:${str}">
						<div class="name-wrap ellipsis">
							<span>${v.title && v.title !== '' ? v.title : '标题'}</span>
						</div>
					</div>
					<div class="toolbox-wrap">
						<div class="toolbox">
							<div class="icon-wrap">
								<i class="material-icons down">arrow_downward</i>
							</div>
							<div class="icon-wrap">
								<i class="kb-icon kb-delete"></i>
							</div>
						</div>
					</div>
				</div>
			`).insertBefore(addWrap);
		} else {
			const str = v.mediaUrl ? `<img class="image" src="${v.mediaUrl}" />` : `<div class="image"></div>`;
			$(`
			 	<div class="child-wrap resource-hover-item ${active}">
					<div class="name-wrap">
						${v.title && v.title !== '' ? v.title : '标题'}
					</div>
					<div class="image-wrap">
						${str}
					</div>
					<div class="toolbox-wrap">
						<div class="toolbox">
							<div class="icon-wrap">
								<i class="material-icons up">arrow_upward</i>
							</div>
							<div class="icon-wrap" style="display:${i === saveData.length - 1 ? 'none' : 'block'};">
								<i class="material-icons down">arrow_downward</i>
							</div>
							<div class="icon-wrap">
								<i class="kb-icon kb-delete"></i>
							</div>
						</div>
					</div>
				</div>
			`).insertBefore(addWrap);
		}
	});
	if (saveData.length >= 6) {
		addWrap.addClass('hide');
	} else {
		addWrap.removeClass('hide');
	}
}
function bindDetailEvent() {
	detailEl.on('input', '.title', function () {
		saveData[saveIndex].title = $(this).val();
	});

	detailEl.on('input', '.desc', function () {
		saveData[saveIndex].desc = $(this).val();
	});
	detailEl.on('input', '.link', function () {
		saveData[saveIndex].link = $(this).val();
	});
	detailEl.on('click', '.cover-operation', function () {
		deleteArr.push(saveData[saveIndex].mediaId);
		saveData[saveIndex].mediaId = null;
		saveData[saveIndex].mediaUrl = null;
		renderSideDetail();
	});
	detailEl.find('.cancel').on('click', function () {
		detail.hide();
	});
	// 保存
	detailEl.find('.save').on('click', () => {
		ifSave = true;
		let error = '';
		for (let i = 0; i < saveData.length; i++) {
			const v = saveData[i];
			if (!v.mediaUrl) {
				error = `图文组的第${i + 1}项没有图片`;
				break;
			}
			if (!v.title || v.title === '') {
				error = `图文组的第${i + 1}项没有标题`;
				break;
			}
			if (!/[a-zA-z]+:\/\/[^s]*/.test(v.link)) {
				error = `图文组的第${i + 1}项链接不合法`;
				break;
			}
		}
		if (error) {
			utils.toast(error);
			return;
		}
		const smallArr = saveData.map((v) => {
			return {
				title: v.title,
				desc: v.desc,
				content: v.content,
				url: v.link,
				picMediaId: v.mediaId,
				PicUrl: v.mediaUrl
			};
		});
		utils.resourceFileDeleteMoreEvent(deleteArr);
		if (ifAdd) {
			utils.resourceCreateAjax({
				type: 'news',
				articles: smallArr
			}, (data) => {
				removeNone();
				detail.hide();
				const itemWrap = createNewsItem(data.data);
				bigEl.find('.news-box').prepend(itemWrap);
				waterFallReload();
			});
		} else {
			utils.resourceUpdateAjax({
				materialId: editMaterialId,
				type: 'news',
				articles: smallArr
			}, (data) => {
				detail.hide();
				const itemWrap = createNewsItem(data.data);
				const editItem = bigEl.find(`.view-edit[data-id="${data.data.materialId}"]`).closest('.news-item-wrap');
				itemWrap.insertAfter(editItem);
				editItem.remove();
				waterFallReload();
			});
		}
	});
	detailEl.on('click', '.up', function (e) {
		e.stopPropagation();
		const index = $(this).closest('.resource-hover-item').index();
		leftArr(index);
		renderSideDetail();
	});
	function leftArr(index) {// 和前一个元素交换
		const shiftItem = saveData[index];
		saveData.splice(index, 1);
		saveData.splice(index - 1, 0, shiftItem);
	}
	detailEl.on('click', '.down', function (e) {
		e.stopPropagation();
		const index = $(this).closest('.resource-hover-item').index();
		leftArr(index + 1);
		renderSideDetail();
	});
	detailEl.on('click', '.kb-delete', function (e) {
		e.stopPropagation();
		if (saveData.length === 1) {
			if (saveData[0].mediaId) {
				deleteArr.push(saveData[0].mediaId);
			}
			clearForm();
		} else {
			const index = $(this).closest('.resource-hover-item').index();
			if (saveData[index].mediaId) {
				deleteArr.push(saveData[index].mediaId);
			}
			saveData.splice(index, 1);
			saveIndex = saveData.length - 1;
			renderSideDetail();
		}
	});
	detailEl.on('click', '.resource-hover-item', function () {
		const index = $(this).index();
		saveIndex = index;
		renderSideDetail();
	});
	detailEl.on('click', '.add-wrap', function () {
		saveData.push(Object.assign({}, defaultData));
		saveIndex++;
		renderSideDetail();
	});
}
