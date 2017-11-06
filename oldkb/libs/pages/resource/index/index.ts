import { initText } from './text';
import { initImage } from './image';
import { initVoice } from './voice';
import { initVideo } from './video';
import { initMusic } from './music';
import { initNews } from './news';
import { initLink } from './link';
import { initAttach } from './attach';
import './index.less';
namespace ResourceIndex {
	$(() => {
		initText();
		initImage();
		initVoice();
		initVideo();
		initMusic();
		initNews();
		initLink();
		initAttach();
		bindClean();
	});
	function bindClean() {
		const arr = ['text', 'image', 'voice', 'video', 'music', 'news', 'link'];
		for (let v of arr) {
			bindCleanEvent(v);
		}
	}
	function bindCleanEvent(text) {
		$('.kb-tabs-content').on('click', `#${text}-clean`, function () {
			$(`#${text}-name`).val(null);
			$(`#${text}-summary`).val(null);
			$(`#${text}-uploadtime .date-start`).val(null);
			$(`#${text}-uploadtime .date-end`).val(null);
		});
	};
}
