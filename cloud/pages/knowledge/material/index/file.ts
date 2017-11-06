import * as utils from 'utils';
import { Upload } from 'upload';
import * as fileItem from './file-item.pug';
import * as resourceUtils from './resourceUtils';
let bigEl: JQuery;
let pagination;
let uploader;
declare const kbRestUrl;
declare const appid;
declare const group;
export function initFile() {
	utils.tabShown($('#file-link'), (e) => { init(); });
}
function init() {
	bigEl = $('#file-tab');
	initPagination();
	appendFiles();
	bindEvent();
}
function initPagination() {
	const boxEl = $('#file-tab .file-box');
	boxEl.height(window.innerHeight - 227);
	pagination = new utils.Pagination($('#file-tab'), {
		size: 18,
		total: 1,
		onChange: ({ index, size }) => {
			appendFiles(index);
		}
	});
}

function appendFiles(num: number = 1) {
	pagination.index = num;
	$.ajax({
		url: `${kbRestUrl}/attachment/page/search`,
		method: 'POST',
		data: {
			filename: $.trim($('#file-search-title').val()),
			appid,
			page: num,
			size: 18,
			group
		}
	}).done((msg) => {
		pagination.total = msg.total;
		const dataArr = msg.data;
		if (num === 1) {
			$('.file-box').html('');
		}
		if (dataArr.length === 0) {
			checkNone();
			return;
		}
		appendDetail(dataArr);
		checkNone();
	});
}
function bindUploadEvent() {
	$('#file-upload-btn').on('change', function () {
		const thisFile = this.files[0];
		if (thisFile) {
			const mimeType = thisFile.type;
			const name = thisFile.name;
			const formdata = new FormData();
			formdata.append('input', thisFile);
			formdata.append('mediatype', mimeType);
			formdata.append('filename', name);
			formdata.append('group', group);
			formdata.append('appid', appid);
			$.ajax({
				url: `${kbRestUrl}/attachment/upload`,
				method: 'POST',
				contentType: false,
				processData: false,
				data: formdata,
				success: function (data) {
					utils.alertMessage('新增文件成功！', true);
					appendFiles();
				}
			});
		}
	});
}
function createFileItem(msg, smallUrl) {
	return $(fileItem({ msg, smallUrl }));
}
function bindEvent() {
	utils.tabShown($('#file-link'), (e) => {
		appendFiles();
	}, false);
	const tabEl = $('#file-tab');
	// 查询
	resourceUtils.bindSearchEvent('file', () => {
		appendFiles();
	});
	// 删除
	resourceUtils.bindResourceDeleteEvent('file', () => {
		appendFiles();
	});
	// bindFileDeleteEvent();
	// 编辑
	bindEditEvent();
	// 上传
	bindUploadEvent();
	// 下载
	bindDownloadEvent();
}
function bindDownloadEvent() {
	$(`#file-tab`).on('click', '.view-download', function () {
		const msg = $(this).data('msg');
		const type = msg.type;
		const filename = msg.filename;
		const mediaid = msg.mediaid;
		window.location.href = `${kbRestUrl}/attachment/file/by_mediaid/${type}?filename=${filename}&mediaid=${mediaid}`;
		/*$.ajax({
			url: `${kbRestUrl}/attachment/file/by_mediaid/${type}?filename=${filename}&mediaid=${mediaid}`,
			method: 'GET',
			success: (res) => {
				// appendFiles();
				utils.alertMessage('下载文件成功！',true);
			},
			error:(xhr,err,obj)=>{
				utils.alertMessage('下载失败！');
			}
		});*/
	});
}
function bindFileDeleteEvent() {
	$(`#file-tab`).on('click', '.view-delete', function () {
		const el = $(this);
		const id = el.data().id;
		utils.confirmModal({
			msg: `确认删除该文件吗?（该素材关联的语料将被一同删除，请知悉！）`,
			cb: (modal, btn) => {
				const end = utils.loadingBtn(btn);
				$.ajax({
					url: `${kbRestUrl}/attachment/delete/single/${id}`,
					method: 'GET',
					success: (res) => {
						appendFiles();
						modal.modal('hide');
						utils.alertMessage('删除文件成功！', true);
					},
					complete: () => {
						end();
					}
				});
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
		const el = $(this);// input
		const editItem = el.closest('.name-wrap');
		const btn = el.closest('.file-item').find('.view-edit');// 编辑按钮
		const name = editItem.find('span');// span 存储数据
		const data = name.data();// 获取span中的数据
		const msgData = data.msg;
		const title = el.val();// 修改后的数据
		const msg = utils.alertMessage('正在修改文件', true, false);
		btn.hide();
		name.text(title);
		editItem.removeClass('edit-active');
		$.ajax({
			url: `${kbRestUrl}/attachment/update`,
			method: 'POST',
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				id: msgData.id,
				type: msgData.type,
				knowledgeid: msgData.knowledgeid,
				filename: title + msgData.fileext,
				fileext: msgData.fileext,
				filesize: msgData.filesize,
				mediaid: msgData.mediaid,
				group
			}),
			success: (res) => {
				appendFiles();
				utils.alertMessage('修改文件名称成功！', true);
			}
		});
	});

	/*bigEl.on('keypress', '.name-wrap input', function (e) {
		if (e.keyCode === 13) {
			$(this).trigger('change');
		}
	});*/
}
function appendDetail(dataArr) {
	const fileBox = $('.file-box');
	fileBox.empty();
	if (!dataArr || dataArr.length <= 0) {
		fileBox.append(resourceUtils.noResourceHtml());
	} else {
		for (let v of dataArr) {
			const suffix = v.filename.split('.')[v.filename.split('.').length - 1];
			fileBox.append(createFileItem(v, specifyTypeImg(v.type, suffix)));
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
function checkNone() {
	const box = $('.file-box');
	if (box.find('.file-item-wrap').length === 0) {
		box.html(resourceUtils.noResourceHtml());
	}
}
function removeNone() {
	const box = $('.file-box');
	if (box.find('.cloud-no-resource').length !== 0) {
		box.html('');
	}
}
