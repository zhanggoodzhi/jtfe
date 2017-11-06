import * as answerHtml from './answer.pug';
import * as modalHtml from './modal.pug';
import { IAnswer } from 'interface';
import { initText, renderText } from './text';
import { initImage, renderImage } from './image';
import { initNews, renderNews } from './news';
import { initVoice, renderVoice } from './voice';
import { initVideo, renderVideo } from './video';
import { initMusic, renderMusic } from './music';
import { initLink, renderLink } from './link';
import { initAttach, renderAttach } from './attach';
import { initIntent, renderIntent } from './intent';
import { initHtml, renderHtml } from './html';
import * as utils from 'utils';
import './index.less';

// 这三个参数在知识库中使用，必须要有
declare const appid;
declare const kbRestUrl;
declare const group;

interface IKnowledgeAnswerOptions {
	answerContainer: JQuery;
	modalContainer?: JQuery;
	types?: string[];
}

interface IAnswerTypes {
	name: string;
	text: string;
	id: number;
	/**
	 * 是否需要模态框
	 *
	 * @type {boolean}
	 * @memberOf IAnswerTypes
	 */
	modal: boolean;
	content?: string;
	actionText?: string;
	init?(update: Function): void;
	render?(answer: IAnswer): void;
}


export class KnowledgeAnswer {
	private _options: IKnowledgeAnswerOptions;
	private _types: IAnswerTypes[];
	static answerTypes: IAnswerTypes[] = [
		{
			name: 'text',
			text: '文本',
			id: 1,
			content: `
			<form>
			<div class="form-group">
			<textarea id='text-ctx' rows='7' maxlength='600' placeholder='请输入文本内容，不超过600字' class="form-control"></textarea>
			<div id='face' class='faceBtn' style='background:url(images/emoji/face.gif) 4px 4px no-repeat;'> 添加表情</div>
			</div>
			</form>
			`,
			init: initText,
			render: renderText,
			modal: false
		},
		{
			name: 'html',
			text: '富文本',
			id: 10,
			content: `<div id='editor' class='editor'></div>`,
			init: initHtml,
			render: renderHtml,
			modal: false
		},
		{
			name: 'image',
			id: 4,
			actionText: '上传',
			text: '图片',
			init: initImage,
			render: renderImage,
			modal: true
		},
		{
			name: 'voice',
			id: 2,
			actionText: '上传',
			text: '语音',
			init: initVoice,
			render: renderVoice,
			modal: true
		},
		{
			name: 'video',
			id: 3,
			actionText: '上传',
			text: '视频',
			init: initVideo,
			render: renderVideo,
			modal: true
		},
		{
			name: 'music',
			id: 7,
			actionText: '上传',
			text: '音乐',
			init: initMusic,
			render: renderMusic,
			modal: true
		},
		{
			name: 'news',
			id: 5,
			actionText: '新建',
			text: '图文',
			init: initNews,
			render: renderNews,
			modal: true
		},
		{
			name: 'link',
			id: 6,
			actionText: '新建',
			text: '链接',
			init: initLink,
			render: renderLink,
			modal: true
		},
		{
			name: 'attach',
			id: 8,
			actionText: '上传',
			text: '文件',
			init: initAttach,
			render: renderAttach,
			modal: true
		},
		{
			name: 'intent',
			id: 9,
			content: `
			<div class="tool-wrap">
				<div class="upload-item">
					<div class="img-wrap">
						<img src="images/knowledge_answer/intent.png"/>
					</div>
					<span>新建意图</span>
				</div>
			</div>
			`,
			actionText: '新建',
			text: '意图',
			init: initIntent,
			render: renderIntent,
			modal: true
		}
	];

	constructor(options: IKnowledgeAnswerOptions) {
		const _default: IKnowledgeAnswerOptions = {
			modalContainer: $(document.body),
			types: KnowledgeAnswer.answerTypes.map(v => v.name)
		} as IKnowledgeAnswerOptions;
		this._options = Object.assign({}, _default, options);
		this.preInit(this._options);
	}

	private preInit(options: IKnowledgeAnswerOptions) {
		this._types = KnowledgeAnswer.answerTypes.filter(v => options.types.indexOf(v.name) > -1);
		const aHtml = answerHtml({
			types: this._types
		});
		const mHtml = modalHtml({
			types: this._types.filter((v) => { return v.modal; })
		});
		options.answerContainer.html(aHtml);
		options.modalContainer.append(mHtml);
	}

	public getTypeById(id: number) {
		for (let v of KnowledgeAnswer.answerTypes) {
			if (v.id === id) {
				return v;
			}
		}
		return this._types[0];
	}


	public renderAnswer = (answer: IAnswer) => {
		const type = this.getTypeById(answer.type);
		const materialId = answer.resourceId;
		let url, data;
		switch (type.name) {
			case 'text':
			case 'html':
			case 'intent':
				type.render(answer);
				return;
			case 'attach':
				url = `${kbRestUrl}/attachment/detail/${materialId}`;
				break;
			default:
				url = `${kbRestUrl}/resource/detail`;
				data = {
					appid: appid,
					type: type.name,
					materialId: materialId
				};
				break;
		}
		const end = utils.addLoadingBg(this._options.answerContainer, this._options.answerContainer.find('.tab-content'));
		$.ajax(url, {
			data: data
		})
			.done(res => {
				type.render(res);
			})
			.always(() => {
				end();
			});
	}

	public init(updateAnswer: Function) {
		this._types.forEach(v => {
			v.init(updateAnswer);
		});
	}
}
