import { alertMessage, confirmModal, loadingBtn, addLoadingBg } from 'utils';
import { renderImage } from './image';
import { renderVideo } from './video';
import { renderNews } from './news';
import { renderAttach } from './attach';
import { renderMusic } from './music';
import { renderVoice } from './voice';
import { renderLink } from './link';
import { renderText } from './text';
import { renderHtml } from './html';
import { renderIntent} from './intent';
declare const appid;
declare const kbRestUrl;
export function changeTagStyle(type) {
	/*const tabEl = $(`#${type}-tab`);
	const toolEl = tabEl.find('.tool-wrap');
	if (tabEl.find('.resource-box').html()) {
		toolEl.hide();
	} else {
		toolEl.show();
	}*/
}
// bind events when click the sure button in the modal
export function bindSure(type: string, table, modalEl: JQuery, cb: Function) {
	modalEl.on('click', '.sure', () => {
		const ck = modalEl.find('input:checked');
		const el = table.dt.row($(ck).closest('tr'));
		const data: any = el.data();
		if (ck.length > 0) {
			cb(data);
		} else {
			alertMessage(`请选择一条${type}！`);
			return;
		}
	});
}
// format time
export function formatSeconds(value) {
	let s = value;// 秒
	let m = 0;// 分
	let result: any = 0;
	if (s < 60) {
		result = '00:' + ('00' + s).substr(-2);
	} else if (s >= 60) {
		m = parseInt(s / 60 as any);
		s = parseInt(s % 60 as any);
		if (m > 0) {
			result = ('00' + m).substr(-2) + ':' + ('00' + s).substr(-2);
		}
	}
	return result;
}

// export function getTypeName(id) {
// 	for (let v of selectData.type) {
// 		if (id === v.id) {
// 			return v.enname;
// 		}
// 	}
// }

// export function renderTag(answer) {
// 	const materialId = answer.resourceId;
// 	// 获取pairs中的answer中的type，在selectData中遍历对应的string名
// 	const typeId = answer.type;
// 	const typeName = getTypeName(typeId);
// 	// const renderTagActive = function () {
// 	// 	const liEl = $(`#${typeName}-link`).parent('li');
// 	// 	liEl.siblings().removeClass('active');
// 	// 	liEl.addClass('active');
// 	// 	const tabEl = $(`#${typeName}-tab`);
// 	// 	tabEl.siblings().removeClass('active').removeClass('in');
// 	// 	tabEl.addClass('active').addClass('in');
// 	// };
// 	if (typeName === 'attach') {
// 		$(`#file-tab`).find('.tool-wrap').hide();
// 		const endLoading = addLoadingBg($(`#${typeName}-tab`));
// 		$(`#file-link`).tab('show');
// 		$.ajax({
// 			url: `${kbRestUrl}/attachment/detail/${materialId}`,
// 			method: 'GET'
// 		}).done((msg) => {
// 			endLoading();
// 			renderFile(msg);
// 		});
// 		return;
// 	}
// 	switch (typeName) {
// 		case 'text': renderTextContent(answer.plainText); break;
// 		case 'html': renderRichTextContent(answer.plainText); break;
// 		default:
// 			$(`#${typeName}-tab`).find('.tool-wrap').hide();
// 			const endLoading = addLoadingBg($(`#${typeName}-tab`));
// 			$(`#${typeName}-link`).tab('show');
// 			$.ajax({
// 				url: `${kbRestUrl}/resource/detail`,
// 				// url:`${kbRestUrl}/resource/detail?appid=${appid}&type=image&materialId=6257163409402363904`,
// 				data: {
// 					appid: appid,
// 					type: typeName,
// 					materialId: materialId
// 				}
// 			}).done((msg) => {
// 				console.log(msg);
// 				debugger;
// 				endLoading();
// 				// renderTagActive();
// 				switch (typeName) {
// 					case 'image': renderImage(msg); break;
// 					case 'video': renderVideo(msg); break;
// 					case 'news': renderNews(msg); break;
// 					case 'voice': renderVoiceContent(msg.nonShared); break;
// 					case 'music': renderMusicContent(msg); break;
// 					case 'link': renderLinkContent(msg); break;
// 					case 'intent':renderIntent(msg);break;
// 					default: renderImage(msg); break;
// 				}
// 			});
// 			break;
// 	}

// }
// export function clearTag(type) {
// 	const tabEl = $(`#${type}-tab`);
// 	if (type === 'text') {
// 		tabEl.find('#text-ctx').val('');
// 	} else if (type === 'html') {
// 		$('#editor').html('<p><br></p>');
// 	} else {
// 		const toolEl = tabEl.find('.tool-wrap');
// 		toolEl.show();
// 		tabEl.find('.resource-box').html('');
// 	}
// }

// export function clearAllTags() {
// 	const content = $('#tab-content');
// 	content.find('.resource-box').html('');
// 	content.find('.tool-wrap').show();
// 	$('#text-ctx').val('');
// 	$('#editor').html('<p><br></p>');
// }
export function bindDeleteEvent(type, update?) {
	const tabEl = $(`#${type}-tab`);
	const boxEl = tabEl.find('.resource-box');
	boxEl.on('click', '.delete', function () {
		confirmModal({
			msg: `确认删除这一项吗?`,
			cb: (modal, btn) => {
				modal.modal('hide');
				boxEl.html('');
				// changeTagStyle(type);
				update((answer) => {
					answer.resourceId = null;
					answer.type = null;
					answer.plainText = null;
					return answer;
				});
			}
		});
	});
}
