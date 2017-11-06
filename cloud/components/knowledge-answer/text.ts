import 'emoji';
import { emojiData } from 'emoji';
import * as utils from 'utils';
export function initText(update) {
	utils.tabShown($('#text-link'), (e) => {
		init(update);
	});
}

export function renderText(data) {
	$('#text-ctx').val(data.plainText);
}

function init(update) {
	$('#text-ctx').on('input', (e) => {
		update(answer => {
			answer.plainText = $(e.currentTarget).val().trim();
			answer.type = 1;
			return answer;
		});

	});
	initEmoji();
}
function initEmoji() {
	$('#face').qqFace({
		id: 'facebox',
		assign: 'text-ctx',
		path: `${ctx}/images/emoji/`
	});
}
// 解析表情并实现预览
/*function view(str) {
	// const emojiData = getEmoji();
	console.log(111,emojiData);
	str = str.replace(/\</g, '&lt;');
	str = str.replace(/\>/g, '&gt;');
	str = str.replace(/\n/g, '<br/>');
	// 把str中的文字用数字代替
	str = str.replace(/\[.+?\]/g, function (match) {
		let result;
		let title = match;
		title = title.replace('[', '');
		title = title.replace(']', '');
		emojiData.map(function (v, i) {
			if (match === v.phrase) {
				result = `<img src="${ctx}/images/emoji/${v.url}" border="0" title=${title}/>`;
			}
		});
		return result;
	});
	$('#text-ctx').html(str);
}*/
