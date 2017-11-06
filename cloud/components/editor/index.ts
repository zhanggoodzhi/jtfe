// tslint:disable no-empty

import { DelayUpload } from 'upload';

// 屏蔽Wangeditor的声明
const methodName = ['info', 'log', 'warn', 'error'];
const consoleMethod = [];

methodName.forEach(name => {
	consoleMethod.push(console[name]);
	console[name] = function () { };
});

import 'script-loader!wangeditor/dist/js/wangEditor.min.js';
import 'wangeditor/dist/css/wangEditor.less';

consoleMethod.forEach((method, index) => {
	console[methodName[index]] = method;
});

/**
 * 为富文本编辑器拓展上传视频功能
 */
(function () {
	wangEditor.createMenu(function (check) {
		const menuId = 'uploadvideo';
		const editor = this;
		if (!check(menuId)) {
			return;
		}
		const menu = new wangEditor.Menu({
			editor: editor,
			id: menuId,
			title: '上传视频',
			$domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-play"></i></a>'),
			$domSelected: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-play"></i></a>')
		});
		const container = $('<div></div>');
		const icon = $('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>');
		const infoContainer = $('<div class="info-container"></div>');
		const fileName = $('<p style="margin:0 10px"></p>');
		const sizeContainer = $('<div style="margin:20px 10px;text-align=center"></div>');
		const widthInput = $('<input type="text" value="640" style="width:50px;text-align:center;"/>');
		const heightInput = $('<input type="text" value="498" style="width:50px;text-align:center;"/>');
		const btnContainer = $('<div></div>');
		const btnSubmit = $('<button class="right" type="button">确定</button>');
		const btnCancel = $('<button class="right gray" type="button">取消</button>');

		new DelayUpload({
			accept: '.mp4,.avi,.flv,.rmvb,.mkv,.3gp,.wmv',
			url: 'knowledge/uploadPairVideo',
			name: 'uploadPairVideo',
			saveBtn: icon,
			submitBtn: btnSubmit,
			cancelBtn: btnCancel,
			save: (id, name) => {
				infoContainer.show();
				fileName.text(name);
			},
			success: (msg) => {
				if (!msg.error && msg.data) {
					const html = `<br/><video src="${msg.data}" controls="controls" width="${$.trim(widthInput.val())}" heightInput="${$.trim(heightInput.val())}"></video><br/>`;
					editor.command(null, 'insertHtml', html);
					menu.dropPanel.hide();
					infoContainer.hide();
					fileName.text('');
				}
			},
			cancel: () => {
				menu.dropPanel.hide();
				infoContainer.hide();
				fileName.text('');
			}
		});
		infoContainer.append(fileName);

		sizeContainer.append('<span> 宽度 </span>')
			.append(widthInput)
			.append('<span> px &nbsp;&nbsp;&nbsp;</span>')
			.append('<span> 高度 </span>')
			.append(heightInput)
			.append('<span> px </span>');

		btnContainer.append(btnSubmit)
			.append(btnCancel);

		container.append(icon)
			.append(infoContainer)
			.append(sizeContainer)
			.append(btnContainer);

		menu.dropPanel = new wangEditor.DropPanel(editor, menu, {
			$content: container,
			width: 350
		});

		editor.menus[menuId] = menu;
	});
}());

const defaultConfig = {
	printLog: false,
	menus: [
		'bold',
		'underline',
		'italic',
		'eraser',
		'forecolor',
		'bgcolor',
		'|',
		'quote',
		'fontfamily',
		'fontsize',
		'unorderlist',
		'orderlist',
		'|',
		'link',
		'unlink',
		'|',
		'uploadvideo',
		'img',
		'|',
		'undo',
		'redo',
		'fullscreen'
	],
	legalTags: 'p,h1,h2,h3,h4,h5,h6,blockquote,table,ul,ol,pre,img,section',
	pasteFilter: false,
	uploadImgUrl: 'knowledge/uploadPairImg'
};


Object.assign(wangEditor.config, defaultConfig);


