import { addLoadingBg, SideBar, cleanObject, alertMessage } from 'utils';
interface ICorpusUpdateSideBar {
	/**
	 * 侧栏标题
	 *
	 * @type {string}
	 * @memberof ICorpusUpdateSideBar
	 */
	title: string;
	/**
	 * 是否是复述添加那边的
	 *
	 * @type {boolean}
	 * @memberof ICorpusUpdateSideBar
	 */
	ifReview?: boolean;
	hideFn?: Function;
}

export default class CorpusUpdateSideBar {
	private op;
	private sideBar;
	constructor(o) {
		const _default = {
			ifReview: false,
			title: '添加语料'
		};
		this.op = { ..._default, ...o };
		this.init();
	}

	private init() {
		this.initSideBar();
	}

	private initSideBar() {
		this.sideBar = new SideBar({
			title: 'xxx',
			content: '',
			onHide: () => {
				this.sideBar.elements.wrap.find('iframe').remove();
			}
		});
	}

	public open(id, title, src?) {
		const sideBarEl = this.sideBar.elements.wrap;
		sideBarEl.find('.sidebar-title').text(title);
		const iframeEl = document.createElement('iframe');
		if (src) {
			iframeEl.src = src;
		} else {
			const str = $.param(cleanObject({
				type: this.op.ifReview ? 'review' : '',
				pairId: id ? id : ''
			}));
			iframeEl.src = `knowledge/corpusManage/update?${str}`;
		}
		sideBarEl.find('.sidebar-content').append($(iframeEl));
		const endLoading = addLoadingBg(sideBarEl.find('.sidebar-content'));
		iframeEl.onload = () => {
			if (endLoading) {
				endLoading();
			}
			iframeEl.contentWindow.jump = s => {
				window.open(s);
			};
			iframeEl.contentWindow.hideFn = (res) => {
				alertMessage(res.msg, !res.error);
				if (!res.error) {
					this.sideBar.hide();
					this.op.hideFn();
				}
			};
		};
		this.sideBar.show();
	}
}
