import * as utils from 'utils';
import { Upload } from 'upload';
import * as fileItem from './file-item.pug';
import * as resourceUtils from './resourceUtils';
let bigEl: JQuery;
let pagination;
let uploader;
let pushModal: resourceUtils.PushModal;
declare const nodeAccountId: string;
export function initFile(p: resourceUtils.PushModal) {
	pushModal = p;
	utils.tabShown($('#file-link'), (e) => { init(); });
}
function init() {
	bigEl = $('#file-tab');
	getFiles();
	initPagination();
	initUpload();
	bindEvent();
	bindEditEvent();
}
function initPagination() {
	const boxEl = $('#file-tab .file-box');
	boxEl.height(window.innerHeight - 227);
	pagination = new utils.Pagination($('#file-tab'), {
		size: 15,
		total: 1,
		onChange: ({ index, size }) => {
			getFiles(index);
		}
	});
}
function checkNone() {
	const box = $('.file-box');
	if (box.find('.box-item').length === 0) {
		box.html(resourceUtils.noResourceHtml());
	}
}
function removeNone() {
	const box = $('.file-box');
	if (box.find('.resource-none').length !== 0) {
		box.html('');
	}
}

function getFiles(num: number = 1) {
	const end = utils.addLoadingBg($('#file-tab'), $('#file-tab .file-box'));
	$.ajax('weixinv2/material/mediaList', {
		method: 'GET',
		data: {
			credentialId: resourceUtils.getAccountId('file'),
			page: num,
			type: 7,
			pageSize: 18,
			keyword: $.trim($('#file-search-title').val())
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
function initUpload() {
	uploader = new Upload({
		btn: $('#file-add-btn'),
		accept: '*',
		url: 'weixinv2/material/uploadFile',
		name: 'fileToUpload',
		onUpload() {
			uploader.uploader.setParams({
				credentialId: resourceUtils.getAccountId('file'),
				type: 7
			});
		},
		success(id, name, res) {
			getFiles();
		}
	});
}
function createFileItem(msg, smallUrl) {
	const id = $(`#file-account`).val();

	return $(fileItem({ msg, smallUrl, id, nodeAccountId }));

}
function bindEvent() {
	const tabEl = $('#file-tab');
	// 查询
	resourceUtils.bindSearchEvent('file', () => {
		getFiles();
	});
	// 删除
	resourceUtils.bindDeleteEvent('file', () => {
		getFiles();
	});
	// 推送到微信矩阵
	tabEl.on('click', '.view-share-all', function () {
		pushModal.show({
			type: 'file',
			mediaId: $(this).data().id,
			single: false,
			refresh: () => {
				getFiles();
			}
		});

	});
	// 群发
	tabEl.on('click', '.view-share', function () {
		pushModal.show({
			type: 'file',
			mediaId: $(this).data().id,
			single: true,
			refresh: () => {
				getFiles();
			}
		});
	});
}
// 编辑
function bindEditEvent() {
	let mediaId: string;
	const action = [];
	resourceUtils.bindResourceEditEvent('file', (data, el) => {
		const bigItem = el.closest('.file-item');
		const editItem = bigItem.find('.name-wrap');
		const input = editItem.find('input');
		const name = editItem.find('span');

		editItem.addClass('edit-active');
		input.val(name.text());
		input.focus();
		mediaId = data;
	});

	bigEl.on('blur', '.name-wrap input', function (e) {
		const el = $(e.currentTarget).closest('.name-wrap');
		el.removeClass('edit-active');
	});

	bigEl.on('change', '.name-wrap input', function () {
		const el = $(this);
		const editItem = el.closest('.name-wrap');
		const btn = el.closest('.file-item').find('.view-edit');
		const name = editItem.find('span');
		const data = name.data();
		const title = el.val();
		const msg = utils.alertMessage('正在修改文件', true, false);

		btn.hide();

		name.text(title);
		editItem.removeClass('edit-active');
		resourceUtils.resourceUpdateAjax({
			mediaId: mediaId,
			name: title + '.' + data.type
		}, (res) => {
			if (res.error) {
				name.text(data.name);
			} else {
				getFiles();

			}
			utils.alertMessage(res.msg, !res.error);
		})
			.always(() => {
				btn.show();
				msg.remove();
			});
	});

	bigEl.on('keypress', '.name-wrap input', function (e) {
		if (e.keyCode === 13) {
			$(this).trigger('change');
		}
	});
}
function appendDetail(dataArr) {
	const fileBox = $('.file-box');
	if (!dataArr || dataArr.length <= 0) {
		fileBox.html(resourceUtils.noResourceHtml());
	} else {
		fileBox.empty();
		for (let v of dataArr) {
			const suffix = v.name.split('.')[v.name.split('.').length - 1];
			fileBox.append(createFileItem(v, specifyTypeImg(v.kbFileType, suffix)));
		}
	}
}

function specifyTypeImg(docType, suffix) {
	let imgSrc = `${ctx}/images/types/`;
	switch (docType) {
		case 1:
			let docImg;
			if (suffix === 'doc' || 'docm' || 'dotx' || 'dotm' || 'docx') {
				docImg = imgSrc + 'doc.png';
			} else if (suffix === 'xls' || 'xlsx' || 'xlsm' || 'xltx' || 'xltm' || 'xlsb' || 'xlam') {
				docImg = imgSrc + 'xls.png';
			} else if (suffix === 'ppt' || 'pptx' || 'pptm' || 'ppsm' || 'potx' || 'potm') {
				docImg = imgSrc + 'ppt.png';
			} else if (suffix === 'pdf') {
				docImg = imgSrc + 'pdf.png';
			} else if (suffix === 'txt') {
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
