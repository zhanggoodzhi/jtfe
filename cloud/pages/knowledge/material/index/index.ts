import { initText } from './text';
import { initNews } from './news';
import { initImage } from './image';
import { initVoice } from './voice';
import { initVideo } from './video';
import { initMusic } from './music';
import { initLink } from './link';
import { initFile } from './file';
import './index.less';
import * as resourceUtils from './resourceUtils';
namespace Weixinv2MediaHistoryIndex {
	(window as any).ifResolveHrefParam = false;
	declare const nodeAccountId: string;
	declare const pushTarget: boolean;
	declare const typeParam;
	declare const idParam;
	bindJumpEvent();
	init();
	initNews();
	initText();
	initImage();
	initVoice();
	initVideo();
	initMusic();
	initLink();
	initFile();
	changeTab();
	/**
	 * 处理跳转操作
	 *
	 */
	function bindJumpEvent() {
		if (!typeParam) {
			return;
		}
		const linkEl = $(`#${typeParam}-link`);
		linkEl.bind('addResource', function () {
			if (idParam) {
				return;
			}
			const addBtn = $(`#${typeParam}-add-btn`);
			if (addBtn.find('input').length) {
				return;
			}
			addBtn.click();
		});
	}

	/**
	 * 切换菜单
	 *
	 * @returns
	 */
	function changeTab() {
		if (!typeParam) {
			return;
		}
		const linkEl = $(`#${typeParam}-link`);
		linkEl.tab('show');
	}

	function init() {
		const /*reg = new RegExp('[\?&]credentialId=([^]*)'),*/
			tabContent = $('#tab-content'),
			checkAccess = () => {
				const panes = tabContent.find('.tab-pane');
				Array.prototype.forEach.call(panes, v => {
					const el = $(v),
						btn = el.find('.weixin-add-btn'),
						option = el.find('.weixin-account option:selected');

					if (option.hasClass('without-access')) {
						btn.hide();
					} else {
						btn.show();
					}
				});
			};

		// $.ajaxSetup({
		// 	beforeSend: (xhr, obj) => {
		// 		if (obj.type.toLowerCase() === 'get') {
		// 			const url = obj.url,
		// 				id = reg.exec(url),
		// 				selectId = resourceUtils.getActiveAccountId();
		// 			if (id === null && selectId !== '') {
		// 				obj.url += (/\?/.test(url) ? '&' : '?') + 'credentialId=' + selectId;
		// 			}
		// 		}
		// 		return true;
		// 	}
		// });

		checkAccess();

		tabContent.on('change', '.weixin-account', e => {
			checkAccess();
		});
	}
}
