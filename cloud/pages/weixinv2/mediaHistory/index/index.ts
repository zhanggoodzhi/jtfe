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
	declare const nodeAccountId: string;
	declare const pushTarget: boolean;

	const pushModal = new resourceUtils.PushModal();
	init();
	initNews(pushModal);
	initText(pushModal);
	initImage(pushModal);
	initVoice(pushModal);
	initVideo(pushModal);
	initMusic(pushModal);
	initLink(pushModal);
	initFile(pushModal);

	function init() {
		const map = {},
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

		$.ajaxPrefilter((options, originalOptions, jqXHR) => {
			if (options.ignoreFilter) {
				return;
			}
			const url = 'weixinv2/material/mediaList';
			if (options.url === url) {
				const name = originalOptions.data.type;
				if (map[name]) {
					const req = map[name];
					req.abort();
				}

				map[name] = jqXHR;
			}
		});

		checkAccess();

		tabContent.on('change', '.weixin-account', e => {
			checkAccess();
		});


	}
}
