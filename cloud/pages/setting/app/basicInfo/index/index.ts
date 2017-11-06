import * as utils from 'utils';
import 'new-table';
import { getPage, commonConfig, bindEnter, getTabsTableHeight, Table } from 'tables';
import { Answer } from './answer';
import 'editor';
import './index.less';
import 'script-loader!cropper/dist/cropper.min.js';
import 'cropper/dist/cropper.css';
import './basic-info';
import './character';

namespace AppUpdateAppInfo {
	interface IAnswerSubmitData {
		id?: number;
		contentHtml?: string;
		plainText?: string;
		priority?: string;
	}

	enum answerState {
		editDefaultAnswer,
		addDefaultAnswer,
		editRepeatAnswer,
		addRepeatAnswer,
		editSensitiveAnswer,
		addSensitiveAnswer
	}

	let state: answerState;

	const editor = new wangEditor($('#answer-editor'));

	$('#answer-editor').data('data', {});
	// (window as any).headingError = function (el) {
	// 	el.src = 'images/visitor.jpg';
	// 	el.onerror = null;
	// };

	$('.status-wrap-s').on('click', (e) => {
		const target = e.target.parentNode;
		const $input = $(target).find('input');
		const check = !$input.prop('checked');
		const value = check ? 1 : 0;
		$input.prop('checked', check);
		$input.prop('value', value);
	});

	// updateContentData();
	if (!HTMLCanvasElement.prototype.toBlob) {
		Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
			value: function (callback, type, quality) {
				const binStr = atob(this.toDataURL(type, quality).split(',')[1]),
					len = binStr.length,
					arr = new Uint8Array(len);

				for (let i = 0; i < len; i++) {
					arr[i] = binStr.charCodeAt(i);
				}

				callback(new Blob([arr], { type: type || 'image/png' }));
			}
		});
	}


	const list = [
		{
			name: 'default',
			urlName: 'defaultAnswer',
			nameText: '默认回复',
			addState: answerState.addDefaultAnswer,
			editState: answerState.editDefaultAnswer,
			method: 'POST',
			extra: {
				priority: 1
			}
		},
		{
			name: 'sensitive',
			urlName: 'sensitiveInfo',
			nameText: '敏感问题回复',
			addState: answerState.addSensitiveAnswer,
			editState: answerState.editSensitiveAnswer
		},
		{
			name: 'repeat',
			urlName: 'repeatQ',
			nameText: '重复问题回复',
			addState: answerState.addRepeatAnswer,
			editState: answerState.editRepeatAnswer
		}
	];

	const answers = list.map(v => {
		$(`#${v.name}-answer-add-btn`).on('click', () => {
			state = v.addState;
			showEditor(`新建${v.nameText}`);
		});

		$(`#${v.name}-answer-edit-btn`).on('click', () => {
			state = v.editState;
		});

		return new Answer(v);
	});

	$('#editor-yes-btn').on('click', () => {
		const html = editor.$txt.html(),
			text = utils.formatText(html);
		answers.forEach((answer, i) => {
			const aState = answer.state;
			switch (state) {
				case aState.add:
				case aState.edit:
					if (text === '' || text.match(/^\s+$/)) {
						utils.alertMessage(`${list[i].nameText}内容不能为空`);
						return;
					}

					answer.submit(Object.assign(editor.$txt.data('data'), {
						contentHtml: html,
						plainText: text
					}, (list[i] as any).extra), state === aState.edit);
					break;
				default:
					return;
			}
		});

	});

	$('#answer-modal').one('shown.bs.modal', () => {
		editor.create();
	});

	$('#answer-modal').on('hide.bs.modal', () => {
		$('#answer-editor')
			.data('data', {})
			.html('<p><br></p>');
	});

	function showEditor(title: string) {
		$('#answer-modal').modal('show')
			.find('.modal-title').html(title);
	}
}
