import './index.less';
import { confirmModal, alertMessage, loadingBtn, cleanObject, addLoadingBg } from 'utils';
import 'select';
import * as tables from 'new-table';
declare const kbRestUrl;
declare const appid;
declare const sendGroup;
declare const idParam;
declare const typeParam;
// 素材部分公用函数start
export function uploadResource(type, thisFile, cb: Function, cb2?: Function) {
	if (thisFile) {
		const mimeType = thisFile.type;
		$.ajax({
			url: `${kbRestUrl}/resource/file/upload/${thisFile.name}/${type}/${appid}`,
			method: 'POST',
			contentType: mimeType,
			data: thisFile,
			processData: false,
			success: function (data) {
				cb(data);
			},
			error: function (e) {
				if (cb2) {
					cb2();
				}
			}
		});
	}
}
export function renderBtn(id, type) {
	return `
		<div class="btnToolbox">
			<div class="icon-wrap view-edit" data-id='${id}' title='编辑'>
				<img src="${ctx}/images/materialIcon/editIconD.png" width="20px" height="20px">
			</div>
			<div class="icon-wrap view-delete" data-id='${id}' title='删除'>
				<img src="${ctx}/images/materialIcon/delIconD.png" width="20px" height="20px">
			</div>
		</div>
	`;
}

/**
 * 搜索回车事件，搜索按钮事件
 * @export
 * @param {any} type
 * @param {any} cb
 */
export function bindSearchEvent(type, cb) {
	$(`#${type}-search-btn`).on('click', () => {
		cb();
	});
	$(`#${type}-search-title`).on('keydown', (e) => {
		if (e && e.keyCode === 13) {
			cb();
			return false;
		}
	});
}
export function resourceCreateAjax(data, cb) {
	console.log(data);
	return $.ajax({
		url: `${kbRestUrl}/resource/create/${appid}`,
		method: 'POST',
		data: JSON.stringify(data),
		xhrFields: {
			withCredentials: true
		},
		contentType: 'application/json'
	}).done((msg) => {
		cb(msg);
	});
}
export function resourceUpdateAjax(data, cb) {
	return $.ajax({
		url: `${kbRestUrl}/resource/update`,
		method: 'PUT',
		data: JSON.stringify(data),
		contentType: 'application/json'
	}).done((msg) => {
		cb(msg);
	});
}
export function bindResourceEditEvent(type, cb) {
	$(`#${type}-tab`).on('click', '.view-edit', function () {
		const el = $(this);
		const id = el.data().id;
		cb(id, el);
	});
}
export function bindResourceDownloadEvent(type) {
	$(`#${type}-tab`).on('click', '.view-download', function () {
		const a = document.createElement('a');
		a.href = $(this).data().url;
		a.download = '';
		a.click();
	});
}

// 图文组接口不同
/*export function bindDeleteEvent(type, cb) {
	let text;
	switch (type) {
		case 'text': text = '文本'; break;
		case 'image': text = '图片'; break;
		case 'voice': text = '语音'; break;
		case 'video': text = '视频'; break;
		case 'music': text = '音乐'; break;
		case 'link': text = '链接'; break;
		case 'file': text = '文件'; break;
		default: text = '~~~~type错误~~~~~'; break;
	}

	$(`#${type}-tab`).on('click', '.view-delete', function () {
		const el = $(this);
		const id = el.data().id;
		confirmModal({
			msg: `确认删除该${text}吗?`,
			cb: (modal, btn) => {
				const end = loadingBtn(btn);
				$.ajax({
					url: 'weixinv2/material/deleteMedia',
					method: 'POST',
					data: {
						mediaId: id
					},
					success: (res) => {
						if (!res.error) {
							cb(res, el);
							modal.modal('hide');
						}
						alertMessage(res.msg, !res.error);
					},
					complete: () => {
						end();
					}
				});
			}
		});
	});
}*/
export function bindResourceDeleteEvent(type, cb) {
	let text;
	switch (type) {
		case 'text': text = '文本'; break;
		case 'image': text = '图片'; break;
		case 'voice': text = '语音'; break;
		case 'video': text = '视频'; break;
		case 'music': text = '音乐'; break;
		case 'news': text = '图文'; break;
		case 'link': text = '链接'; break;
		case 'file': text = '文件'; break;
		default: text = '~~~~type错误~~~~~'; break;
	}
	$(`#${type}-tab`).on('click', '.view-delete', function () {
		const el = $(this);
		const id = el.data().id;
		confirmModal({
			msg: `确认删除该${text}吗?（该素材关联的语料将被一同删除，请知悉！）`,
			cb: (modal, btn) => {
				const endLoading = loadingBtn(btn);
				$.ajax({
					url: `${ctx}/knowledge/material/delete?materialId=${id}&type=${type}`/* `${kbRestUrl}/resource/delete/${appid}/${id}/${type}` */,
					method: 'DELETE',
					success: (res) => {
						if (res.success) {
							cb();
							alertMessage('删除成功！', true);
						} else {
							alertMessage(res.msg, res.success);
						}
						modal.modal('hide');
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	});
}
export function triggerAddEvent() {
	if ((window as any).ifResolveHrefParam) {
		return;
	}
	$(`#${typeParam}-link`).trigger('addResource');
	(window as any).ifResolveHrefParam = true;
}
export function triggerEditEvent(cb) {
	if (!idParam) {
		return;
	}
	$.ajax(`${kbRestUrl}/resource/search/${appid}`, {
		method: 'POST',
		data: cleanObject({
			type: typeParam,
			group: sendGroup,
			appid: appid,
			page: 1,
			size: 10,
			id: idParam
		})
	})
		.done(res => {
			if (cb) {
				cb(res);
			}
		});
}
export function resourceFileDeleteMoreEvent(ids, cb?: Function) {
	if (ids.length === 0) {
		return;
	}
	ids.forEach(v => {
		const meI = encodeURIComponent(v);
		$.ajax({
			url: `${kbRestUrl}/resource/file/delete?mediaId=${meI}`,
			method: 'DELETE',
			success: () => {
				if (cb) {
					cb();
				}
			}
		});
	});
}

export function noResourceHtml() {
	return '<p class="cloud-no-resource">没有检索到数据</p>';
}
// 素材部分公用函数end
