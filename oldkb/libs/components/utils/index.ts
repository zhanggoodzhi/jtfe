import * as moment from 'moment';
import './index.less';

/**
 *
 *
 * @export
 * @param {JQuery} el	被添加loading的元素
 * @param {JQuery} [blur]	被添加模糊效果的元素
 * @returns {Function}
 */
export function loading(el: JQuery, blur?: JQuery): Function {
	let bgEl = $('<div class="kb-loading-bg"></div>'),
		loadingEl = $(`<div class="kb-loading-wrap">
			<div class="preloader-wrapper small active">
				<div class="spinner-layer">
					<div class="circle-clipper left">
						<div class="circle"></div>
					</div>
					<div class="gap-patch">
						<div class="circle"></div>
					</div>
					<div class="circle-clipper right">
						<div class="circle"></div>
					</div>
				</div>
			</div>
		</div>`);
	if (!el.hasClass('kb-loading')) {
		el.addClass('kb-loading')
			.append(bgEl)
			.append(loadingEl);
		if (blur) {
			blur.addClass('kb-blur');
		}
	} else {
		bgEl = el.find('.kb-loading-bg');
		loadingEl = el.find('.kb-loading-wrap');
	}


	return () => {
		el.removeClass('kb-loading');
		bgEl.remove();
		loadingEl.remove();
		if (blur) {
			blur.removeClass('kb-blur');
		}
	};
}

export function btnLoading(btn: JQuery): Function {
	const loadingBtn = btn.clone(),
		width = btn.outerWidth(),
		className = 'kb-btn-loading disabled';
	loadingBtn.addClass(className)
		.width(width)
		.html('<i class="kb-icon kb-refresh" style="vertical-align: middle;"></i>');
	btn.hide().before(loadingBtn);
	return () => {
		loadingBtn.remove();
		btn.show();
	};
}

/**
 * 封装好是否成功的ajax
 *
 * @export
 * @param {any} option
 * @param {any} [done]
 * @param {any} [always]
 */
export function ajax(option, done?, always?) {
	$.ajax(option).done((data) => {
		if (!data || !data.status) {
			if (done) {
				done(data);
			}
		}
		if (data && data.status === 1) {
			if (done) {
				done(data);
			}
		}
		if (data && data.msg) {
			toast(data.msg);
		}
	}).always((data) => {
		if (always) {
			always(data);
		}
	});
}

export function initLeftRedDot() {
	$.ajax({
		url: '/message/hasUnread',
		method: 'GET',
		success: (num) => {
			const el = $('.kb-side-nav .user-center');
			el.attr('data-number', num);
			if (num !== 0) {
				el.addClass('redDot');
			}
		}
	});
}

export function triggerOnceWithinDelay(el: JQuery, evt: string, cb: Function, selector?: string, delay?: number) {
	let timer;
	const currentCb = (...args) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			cb(...args);
		}, delay || 200);
	};

	el.on(evt, selector, currentCb);
}


/**
 * 创建一个模态框
 *
 * @export
 * @param {string} title	标题
 * @param {string} content	内容
 * @param {string} btnText	按钮文本
 * @param {Function} cb		点击按钮后的回调
 */
export function modal(title: string, content: string, btnText: string, cb: Function, ready?: Function): JQuery {
	const modal = $(`<div class="modal kb-modal"></div>`),
		modalHeader = $(`<div class="modal-header"></div>`),
		modalContentWrap = $(`<div class="modal-content"></div>`),
		modalTitle = $(`<h5>${title}</h5>`),
		modalClose = $('<i class="small-close material-icons modal-action modal-close waves-effect">clear</i>'),
		modalContent = $(`<div class="row">${content}</div>`),
		modalFooter = $(`<div class="modal-footer">
				<a class="btn modal-action modal-close waves-effect btn-small kb-flat-btn">取消</a>
				<a class="modal-action waves-effect btn kb-yes-btn btn-small">${btnText}</a>
			</div>`);

	const yesBtn = modalFooter.find('.kb-yes-btn');

	const evtCb = () => {
		const end = btnLoading(yesBtn);
		const remove = () => {
			modal.modal('close');
		};

		cb(remove, end, modal);
	};
	modalHeader.append(modalTitle)
		.append(modalClose);
	modalContentWrap.append(modalContent);

	modal.append(modalHeader).append(modalContentWrap)
		.append(modalFooter);

	$(document.body).append(modal);

	yesBtn.on('click', evtCb);

	modal.modal({
		ready: () => {
			const input = modal.find('input:first');
			if (input.length > 0) {
				const len = (input.val() as string).length;
				input.focus();
				if (len > 0) {
					(input.get(0) as HTMLInputElement).setSelectionRange(len, len);
				}
			}
			if (ready) {
				ready(modal);
			}
		},
		complete: () => {
			modal.remove();
		}
	});

	modal.modal('open');

	return modal;
}

/**
 * 确认用的模态框
 *
 * @export
 * @param {string} msg	提示消息
 * @param {any} cb		回调
 */
export function confirmModal(msg: string, cb): JQuery {
	return modal('温馨提示', `<p>${msg}</p>`, '确定', cb);
}



interface IInput {
	name: string;
	placeholder?: string;
	value?: string;
}

/**
 *
 *
 * @export
 * @param {string} title	标题
 * @param {IInput[]} inputs	表单对象
 * @param {Function} cb		回调
 */
export function inputModal(title: string, inputs: IInput[], cb: Function): JQuery {
	const inputsHtml = inputs.map(v => {
		return `<div class="input-field col s12">
					<input class='kb-input-item' name="${v.name}" ${v.placeholder ? 'placeholder=' + v.placeholder : ''} ${v.value ? 'value=' + v.value : ''} type= "text" >
				</div>`;
	}).join('');

	return modal(title, inputsHtml, '保存', (remove, end, modal) => {
		const data: any = {};
		for (let v of modal.find('.kb-input-item').toArray()) {
			const el = $(v),
				val = (el.val() as string).trim();
			if (val === '') {
				return end();
			}

			data[el.prop('name')] = val;
			if (!data.lang || data.lang !== 'zh') {
				data.lang = val.match(/[\u4e00-\u9fa5]/) ? 'zh' : 'en';
			}
		}
		cb(data, remove, end, modal);
	});
}

/**
 * 提示
 *
 * @export
 * @param {string} msg	文本
 * @param {number} [delay=5000]	延迟
 */
export function toast(msg: string, delay = 5000) {
	Materialize.toast(msg, delay);
}

interface ISideDetailOptions {
	/**
	 * 内容
	 *
	 * @type {(string | JQuery)}
	 * @memberOf ISideDetailOptions
	 */
	html?: string | JQuery;
	/**
	 * 宽
	 *
	 * @type {(string | number)}
	 * @memberOf ISideDetailOptions
	 */
	width?: string | number;
	/**
	 * 标题
	 *
	 * @type {string}
	 * @memberOf ISideDetailOptions
	 */
	title: string;
	/**
	 * header中的按钮
	 *
	 * @type {JQuery[]}
	 * @memberOf ISideDetailOptions
	 */
	menus?: JQuery[];

	/**
	 *
	 * 外层的类名
	 * @type {string}
	 * @memberOf ISideDetailOptions
	 */
	className?: string;
	hideFn?: () => void;
}

interface ISideDetailCp {
	el: JQuery;
	overlay: JQuery;
	body: JQuery;
	header: JQuery;
	headerTitle: JQuery;
	headerMenus: JQuery;
	closeBtn: JQuery;
}

/**
 * 创建一个侧边栏用于显示详情
 *
 * @export
 * @class SideDetail
 */
export class SideDetail {
	private options: ISideDetailOptions;
	private cp: ISideDetailCp;
	// private originBodyOverflow: string;
	static shownClassName: string = 'show';
	constructor(options: ISideDetailOptions) {
		const op = Object.assign({
			width: window.innerWidth * 0.7,
			className: ''
		}, options);
		this.options = op;
		this.init(op);
	}

	private init(options: ISideDetailOptions) {
		const cp: ISideDetailCp = {
			el: $(`<div class="kb-side-detail z-depth-3 ${options.className}"></div>`),
			overlay: $('<div class="kb-overlay"></div>'),
			body: $('<div class="kb-side-body row"></div>'),
			header: $('<header class="kb-side-header row"></header>'),
			headerTitle: $('<h4 class="kb-header-title"></h4>'),
			headerMenus: $('<ul class="kb-header-menus"></ul>'),
			closeBtn: $('<li class="kb-close"><i class="material-icons">close</i></li>')
		};
		// 插入按钮
		cp.headerMenus.append(cp.closeBtn);

		// 插入头部内容
		cp.header
			.append(cp.headerTitle)
			.append(cp.headerMenus);

		// 插入主体
		cp.el
			.append(cp.header)
			.append(cp.body)
			.width(options.width);

		// 插入浏览器并渲染
		$(document.body)
			.append(cp.el)
			.append(cp.overlay);

		cp.closeBtn.on('click', () => {
			this.hide();
		});

		cp.overlay.on('click', () => {
			this.hide();
		});

		// this.originBodyOverflow = $(document.body).css('overflow');
		this.cp = cp;

		if (options.html) {
			this.updateHtml(options.html);
		}

		this.updateHeader(options.menus || [], options.title);
		initSelect();
		initDatePicker();
	}

	/**
	 * 显示侧边栏
	 *
	 *
	 * @memberOf SideDetail
	 */
	public show() {
		const cp = this.cp;
		cp.el.addClass(SideDetail.shownClassName);
		cp.overlay.addClass(SideDetail.shownClassName);
		// $(document.body).css('overflow', 'hidden');
	}


	/**
	 * 隐藏
	 *
	 *
	 * @memberOf SideDetail
	 */
	public hide(cb?: Function) {
		const cp = this.cp;
		cp.el.removeClass(SideDetail.shownClassName);
		cp.overlay.removeClass(SideDetail.shownClassName);
		if (cb) {
			cb();
		}
		if (this.options.hideFn) {
			this.options.hideFn();
		}
		// $(document.body).css('overflow', this.originBodyOverflow);
	}

	/**
	 * 切换
	 *
	 *
	 * @memberOf SideDetail
	 */
	public toggle() {
		this.cp.el.hasClass(SideDetail.shownClassName) ? this.hide() : this.show();
	}

	/**
	 * 移除
	 *
	 *
	 * @memberOf SideDetail
	 */
	public remove() {
		const cp = this.cp;
		this.hide();
		setTimeout(() => {
			cp.el.remove();
			cp.overlay.remove();
		}, 300);
	}

	/**
	 * 更新内容
	 *
	 * @param {(string | JQuery)} html	要更新的内容
	 *
	 * @memberOf SideDetail
	 */
	public updateHtml(html: string | JQuery) {
		this.cp.body
			.empty()
			.append(html);
	}

	/**
	 * 更新菜单
	 *
	 * @param {JQuery[]} menus 	菜单按钮
	 * @param {string} [title]	标题
	 *
	 * @memberOf SideDetail
	 */
	public updateHeader(menus: JQuery[], title?: string) {
		const cp = this.cp;
		if (title) {
			this.updateTitle(title);
		}

		if (menus.length > 0) {
			cp.headerMenus.find(`li:not(.kb-close)`).remove();
			menus.forEach(v => {
				cp.closeBtn.before(v);
			});
		}
	}

	public updateTitle(title: string) {
		this.cp.headerTitle.html(title);
	}

	get element() {
		return this.cp;
	}
}


/**
 * 渲染一个统一的按钮,可以使用返回值绑定事件
 *
 * @export
 * @param {(string | string[])} text
 * @returns
 */
export function renderSideMenu(text: string | string[], className?: string) {
	if (typeof text === 'object' && text instanceof Array) {
		return text.map(v => renderSideMenu(v));
	} else {
		return $(`<li><a class="waves-effect btn btn-small ${className ? className : null}">${text}</a></li>`);
	}
}

export function renderStatus(status) {
	switch (status) {
		case '0':
			return '<span style="color:#272727;">未创建</span>';
		case '1':
			return '<span style="color:#a0a0a0;">草稿</span>';
		case '2':
			return '<span style="color:#dd5501;">审核中</span>';
		case '3':
			return '<span style="color:#73a93a;">已发布</span>';
		case '4':
			return '<span style="color:#c51f29;">被驳回</span>';
		case '5':
			return '<span style="color:#1f9ce5;">已归档</span>';
		default:
			return '未知状态';
	}
}

export function renderVersion(version: number) {
	return `${version}.0`;
}

export function renderSimpleTime(time: number | Date | moment.Moment | string): string | boolean {
	const m = moment(time);
	if (m.isValid()) {
		return m.format('YYYY-MM-DD');
	} else {
		return false;
	}
}

export function renderTime(time: number | Date | moment.Moment | string) {
	// return moment(time).format('YYYY-MM-DD');
	moment.locale('zh-cn');
	return time ? moment(time).fromNow() : null;
}
export function formatTime(time: number | Date | moment.Moment | string) {
	return time ? moment(time).format('YYYY-MM-DD') : null;
}
export function formatMonth(time: number | Date | moment.Moment | string) {
	return time ? moment(time).format('YYYY-MM') : null;
}

export function createAddTitle(cell, cellData) {
	$(cell).attr('title', cellData);
};
export function renderCheckBtn(data, type, row) {
	return `<i data-id='${data}' data-version='${row.version}' data-logicid='${row.logicid}' class='view-detail kb-icon kb-check'></i>`;
}
export function renderLink(data, type, row) {
	return `<a data-id='${row.knowledgeId}' data-version='${row.version}' data-logicid='${row.logicid}' class="view-detail">${data}</a>`;
}

export function renderDeleteBtn(data, type, row) {
	return `
		<i data-id='${data}' class='view-delete kb-icon kb-delete'></i>
	`;
}
export function renderEditAndDeleteBtn(data) {
	return `
		<i data-id='${data}' class='view-edit kb-icon kb-edit'></i>
		<i data-id='${data}' class='view-delete kb-icon kb-delete'></i>
	`;
}
export function renderEditBtn(data) {
	return `
		<i data-id='${data}' class='view-edit kb-icon kb-edit'></i>
	`;
}
export function resourceCreateAjax(data, cb) {
	return ajax({
		url: '/resource/create',
		method: 'POST',
		processData: false,
		contentType: 'application/json',
		data: JSON.stringify(data)
	}, (msg) => {
		cb(msg);
	});
}
export function resourceUpdateAjax(data, cb) {
	return ajax({
		url: '/resource/update',
		method: 'PUT',
		processData: false,
		contentType: 'application/json',
		data: JSON.stringify(data)
	}, (msg) => {
		cb(msg);
	});
	// return $.ajax({
	// 	url: '/resource/update',
	// 	method: 'PUT',
	// 	processData: false,
	// 	contentType: 'application/json',
	// 	data: JSON.stringify(data)
	// }).done((msg) => {
	// 	cb(msg);
	// });
}
export function bindResourceDownloadEvent(type) {
	$(`#${type}-tab`).on('click', '.view-download', function () {
		const a = document.createElement('a');
		a.href = $(this).data().url;
		a.download = '';
		a.click();
	});
}
export function bindResourceEditEvent(type, cb) {
	$(`#${type}-tab`).on('click', '.view-edit', function () {
		const el = $(this);
		const id = el.data().id;
		$.ajax('/resource/detail', {
			method: 'GET',
			data: {
				materialId: id,
				type: type
			}
		}).done((data) => {
			cb(data, el);
		});
	});
}
export function configurationDeleteEvent(url: string, data, cb?) {
	confirmModal('确认删除该条目吗?', (remove, end) => {
		$.ajax(`${url}?${$.param(data)}`, {
			method: 'delete'
		})
			.always(() => {
				end();
			})
			.done(() => {
				toast('删除成功');
				cb();
				remove();
			});
	});
}
export function bindResourceDeleteEvent(type, cb?) {
	let text;
	switch (type) {
		case 'text': text = '文本'; break;
		case 'image': text = '图片'; break;
		case 'voice': text = '语音'; break;
		case 'video': text = '视频'; break;
		case 'music': text = '音乐'; break;
		case 'news': text = '图文'; break;
		case 'link': text = '链接'; break;
		default: text = '~~~~type错误~~~~~'; break;
	}
	$(`#${type}-tab`).on('click', '.view-delete', function () {
		const el = $(this);
		const id = el.data().id;
		confirmModal(`确认删除该${text}吗?`, (remove, end) => {
			$.ajax(`/resource/delete?materialId=${id}&type=${type}`, {
				method: 'delete'
			})
				.always(() => {
					end();
				})
				.done((data) => {
					toast('删除成功');
					remove();
					if (cb) {
						cb(data, el);
					}
				});
		});
	});
}
export function resourceFileDeleteMoreEvent(ids, cb?) {
	if (ids.length === 0) {
		return;
	}
	//console.log('ids',ids);
	$.ajax({
		url: `/resource/file/deleteMore?${$.param({ mediaIds: ids.join(',') })}`,
		// url: `/resource/file/deleteMore?mediaIds=${ids.join(',')}`,
		type: 'delete',
		success: () => {
			if (cb) {
				cb();
			}
		}
	});
}
/**
 *
 *
 * @export
 * @param {string} str
 * @returns 去掉时间中间的空格
 */
export function clearTimeEmpty(str) {
	return str.split(' ').join('');
}

/**
 *
 * 过滤对象中的undefind和空字符串
 * @export
 * @param {({ [key: string]: any })} obj 需要过滤的对象
 * @returns
 */
export function cleanObject(obj: { [key: string]: any }) {
	const result = {};
	for (let i in obj) {
		let val = obj[i];

		if (typeof val === 'string') {
			val = val.trim();
		}

		if (val !== '' && val !== undefined) {
			result[i] = val;
		}
	}
	return result;
};
export function setScroll() {
	const els = $('.kb-scroll:visible');
	Array.prototype.forEach.call(els, v => {
		const el = $(v),
			height = getFullHeight(el);
		if (height > 0) {
			el.css('height', height);
		}
	});
}
export function tabShown(tab: JQuery, cb: Function, once: boolean = true) {
	if (tab.hasClass('active') && once) {
		cb();
	}
	else {
		const tabs = tab.parents('.tabs');
		if (once && tabs.find('.tab .active').length <= 0 && tab.is(tabs.find('.tab a:first'))) {
			cb();
		}
		else {
			const on = once ? tab.one : tab.on;

			on.call(tab, 'click', (e: JQueryEventObject) => {
				const el = $(tab.attr('href'));
				if (!el.is(':visible')) {
					setTimeout(() => {
						cb(e);
					}, 0);
				} else {
					cb(e);
				}
			});
		}
	}
}
export function bindtabEvent(dataId, cb) {
	$('.user-tag .col[data-id="' + dataId + '"]').on('click', function () {
		if ($(this).hasClass('active')) {
			return;
		} else {
			cb();
		}
	});
}
export function initBtnStyle(ulEls) {
	ulEls.each((i, e) => {
		$(e).on('click', 'li', function () {
			const el = $(this);
			const siblingEl = el.siblings();
			el.addClass('active');
			siblingEl.removeClass('active');
		});
	});
}
export function fixedTab(tab: JQuery, container: string, selector?: string) {
	/*	tab.on('click', selector, (e) => {
			const containerEl = $(e.currentTarget).parents(container);
			containerEl.scrollTop((e.currentTarget as HTMLElement).offsetTop);
		});*/
}

interface IPaginationProps {
    /**
     * 要绑定的元素
     *
     * @type {JQuery}
     * @memberOf PaginationProps
     */
	el: JQuery;
    /**
     * 分页数量
     *
     * @type {number}
     * @memberOf PaginationProps
     */
	size: number;
    /**
     * 总共条数
     *
     * @type {number}
     * @memberOf PaginationProps
     */
	total: number;
    /**
     * 当前页,默认为1
     *
     * @type {number}
     * @memberOf PaginationProps
     */
	current?: number;
    /**
     * 点击修改分页之后的回调
     *
     * @type {*}
     * @memberOf PaginationProps
     */
	onChange?: Function;
}

export class Pagination {
	private props: IPaginationProps;
	private totalPages: number;
	private current: number;
	private wrap: JQuery;

	constructor(props: IPaginationProps) {
		this.props = props;
		this.current = props.current ? props.current : 1;
		this.init();
	}

	private init() {
		this.wrap = $('<ul class="kb-pagination-wrap pagination"></ul>');
		this.props.el.append(this.wrap);
		this.render();
		if (this.props.onChange) {
			this.bindEvent();
		}
	}

	private getTotalPages(): number {
		return Math.ceil(this.props.total / this.props.size);
	}

	private render() {
		let str = '';
		if (this.current === 1) {
			str += `<li class="paginate_button previous disabled waves-effect"><a href="#!"><i class="material-icons">chevron_left</i></a></li>`;
		} else {
			str += `<li class="paginate_button previous waves-effect"><a href="#!"><i class="material-icons">chevron_left</i></a></li>`;
		}
		this.totalPages = this.getTotalPages();
		if (this.totalPages === 0) {
			this.wrap.html(`
				<li class="paginate_button previous disabled waves-effect"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
				<li class="paginate_button number-paginate waves-effect active" data-index="1"><a href="#!">1</a></li>
				<li class="paginate_button next disabled waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
			`);
			return;
		}

		if (this.totalPages < 6) {
			str += this.getPagingElement(1, this.totalPages);
		}
		else {
			if (this.current < 5) {
				str += this.getPagingElement(1, 5);
				str += `...<li class="paginate_button number-paginate waves-effect" data-index="${this.totalPages}"><a href="#!">${this.totalPages}</a></li>`;
			}
			else if (this.current <= this.totalPages - 4) {
				str += `<li class="paginate_button number-paginate waves-effect" data-index="1"><a href="#!">1</a></li>...`;
				str += this.getPagingElement(this.current - 1, this.current + 1);
				str += `...<li class="paginate_button number-paginate" data-index="${this.totalPages}"><a href="#!">${this.totalPages}</a></li>`;
			}
			else {
				str += `<li class="paginate_button number-paginate waves-effect" data-index="1"><a href="#!">1</a></li>...`;
				str += this.getPagingElement(this.totalPages - 4, this.totalPages);
			}
		}
		if (this.current === this.totalPages) {
			str += `<li class="paginate_button next disabled waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>`;
		} else {
			str += `<li class="paginate_button next waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>`;
		}
		this.wrap.html(str);
	}


	private getPagingElement(start: number, end: number): string {
		let str = '';
		for (let i = start; i <= end; i++) {
			if (i === this.current) {
				str += `<li class="paginate_button number-paginate current active" data-index="${i}"><a href="#!">${i}</a></li>`;
			}
			else {
				str += `<li class="paginate_button number-paginate waves-effect" data-index="${i}"><a href="#!">${i}</a></li>`;
			}
		}
		return str;
	}

	private bindEvent() {
		const self = this;
		this.wrap.on('click', '.number-paginate', function () {
			self.jump(parseInt($(this).attr('data-index')));
		});

		this.wrap.on('click', '.next', function () {
			self.jump(self.current + 1);
		});

		this.wrap.on('click', '.previous', function () {
			self.jump(self.current - 1);
		});
	}

    /**
     * 传入目标索引
     *
     * @private
     * @param {number} index
     *
     * @memberOf Pagination
     */
	private jump(index: number) {
		if (index < 1 || index > this.totalPages || index === this.current) {
			return;
		}
		this.current = index;
		this.render();
		this.props.onChange({ index: this.current, size: this.props.size });
	}

	set total(t: number) {
		this.props.total = t;
		const totalP = this.getTotalPages();
		this.current = 1;
		if (this.current > totalP) {
			this.index = totalP === 0 ? 1 : totalP;
			this.render();
		}
		else {
			this.render();
		}
	}

	set index(i: number) {
		this.current = i;
		this.render();
	}
    /*
        public reset() {
            this.current = 1;
            this.render();
        }*/
}

/**
 * 格式化用户输入的时间>,<,~
 *
 * @export
 * @param {string} time
 * @returns
 */
export function parseInputTime(time: string) {
	const date: { start?: string; end?: string; } = {};
	time = time.replace(/\s/g, '');
	// >,<
	if (time.match(/^[><]\d{4}-\d{2}-\d{2}/)) {
		const timeStr = renderSimpleTime(time.slice(1)) as string;
		if (!timeStr) {
			toast('输入的时间不合法');
			return false;
		}
		switch (time.charAt(0)) {
			case '>':
				date.start = timeStr;
				break;
			case '<':
				date.end = timeStr;
				break;
			default:
				// toast('时间格式不合法');
				return false;
		}
		// ~
	} else if (time.match(/\d{4}-\d{2}-\d{2}~\d{4}-\d{2}-\d{2}/)) {
		const timeArr: string[] = time.split('~'),
			start = renderSimpleTime(timeArr[0]) as string,
			end = renderSimpleTime(timeArr[1]) as string;
		if (!start || !end) {
			toast('输入的时间不合法');
			return false;
		}
		if (!moment(start).isBefore(end)) {
			toast('起始时间必须小于结束时间');
			return;
		}
		date.start = start;
		date.end = end;
	} else {
		// toast('时间格式不合法');
		return false;
	}
	return date;
}


export function matchKeycode(keycode: number, list: number[] = [37, 38, 39, 40]) {
	if (list.indexOf(keycode) > -1) {
		return true;
	}
	return false;
}

export function getFullHeight(el) {
	let height = window.innerHeight - el.offset().top - 1;
	Array.prototype.forEach.call(el.parents(), p => {
		const par = $(p);
		height -= ['marginBottom', 'paddingBottom', 'borderBottom']
			.map(v => parseFloat(par.css(v)))
			.reduce((x, y) => {
				return x + y;
			}, 0);
	});
	return height;
}

export function getDetailParams(el: JQuery) {
	return {
		id: el.attr('data-id') === 'undefined' ? null : el.attr('data-id'),
		version: el.attr('data-version') === 'undefined' ? null : el.attr('data-version'),
		logicid: el.attr('data-logicid') === 'undefined' ? null : el.attr('data-logicid')
	};
}

export function debounce(cb: Function, delay: number = 200) {
	let before: number = 0;

	return () => {
		const now: number = new Date().getTime();
		if (now - before > delay) {
			before = now;
			cb();
		}
	};
}

interface Itime {
	startTime: string;
	endTime: string;
}
interface IrangeDateBtn {
	el: JQuery;
	sureCb?: (data?: Itime) => void;
	cancelCb?: (data?: Itime) => void;
}
export class RangeDateBtn {
	private startTime: string = '';
	private endTime: string = '';

	/**
	 * 按钮的jq对象
	 *
	 * @private
	 * @type {JQuery}
	 * @memberOf RangeDateBtn
	 */
	private op: IrangeDateBtn;
	private dropDownEl: JQuery;

	/**
	 * 点击时间框事件
	 *
	 * @private
	 *
	 * @memberOf RangeDateBtn
	 */
	constructor(op: IrangeDateBtn) {
		this.op = op;
		this.init();
	}
	private init() {
		this.dropDownEl = $(`
		<div class="row kb-rangeDate-btn">
			<div class="col input-field s12">
                <div class="range-date-wrap" id="filed-updatetime">
					<input class="datepicker input-small date-start" type="date" placeholder="开始时间">
					<i class="small material-icons">trending_flat</i>
					<input class="datepicker input-small date-end" type="date" placeholder="结束时间">
				</div>
            </div>
			<div class="col input-field s12 rangeDate-btn-wrap">
                <a class="waves-effect btn-small btn sure">确定</a>
				<a class="waves-effect btn-small btn btn-flat cancel">取消</a>
            </div>
		</div>
	`);
		this.op.el.after(this.dropDownEl);
		initDatePicker();
		this.resetOffset();
		this.bindEvent();
	}
	private resetOffset() {
		const width = this.op.el.outerWidth();
		const height = this.op.el.outerHeight();
		const dWidth = this.dropDownEl.outerWidth();
		const position = this.op.el.position();
		const scrollTop = this.op.el.offsetParent().scrollTop();
		this.dropDownEl.css('left', position.left - (dWidth - width) / 2 + 'px')
			.css('top', position.top + scrollTop + height + 3 + 'px');
	}
	private bindEvent() {
		const self = this;
		$('body').on('click', (e) => {
			if (!this.dropDownEl.hasClass('kb-rangeDate-btn-active')) {
				return;
			}
			if ($(e.target).closest('.kb-rangeDate-btn').length === 0 && e.target !== this.op.el[0]) {
				this.hide();
				if (this.op.cancelCb) {
					this.op.cancelCb(self.getTime());
				}
			}
		});
		this.op.el.on('click', () => {
			this.clickBtn();
		});
		this.dropDownEl.find('.date-start').on('change', function () {
			self.startTime = clearTimeEmpty($(this).val());
		});
		this.dropDownEl.find('.date-end').on('change', function () {
			self.endTime = clearTimeEmpty($(this).val());
		});
		this.dropDownEl.find('.sure').on('click', function () {
			self.render();
			self.hide();
			if (self.op.sureCb) {
				self.op.sureCb(self.getTime());
			}
		});
		this.dropDownEl.find('.cancel').on('click', function () {
			self.hide();
			if (self.op.cancelCb) {
				self.op.cancelCb(self.getTime());
			}
		});
	}
	private clickBtn() {
		if (this.dropDownEl.hasClass('kb-rangeDate-btn-active')) {
			this.hide();
		} else {
			this.show();
		}
	}
	private render() {
		if (this.startTime === '' && this.endTime === '') {
			this.op.el.text('不限时间');
		} else if (this.startTime === '') {
			this.op.el.text('<' + this.endTime);
		} else if (this.endTime === '') {
			this.op.el.text('>' + this.startTime);
		} else {
			this.op.el.text(this.startTime + ' ~ ' + this.endTime);
		}
	}
	private show() {
		this.resetOffset();
		this.dropDownEl.addClass('kb-rangeDate-btn-active');
	}
	private hide() {
		this.dropDownEl.removeClass('kb-rangeDate-btn-active');
	}
	public getTime() {
		return {
			startTime: this.startTime,
			endTime: this.endTime
		};
	}
	get btnEl() {
		return this.op.el;
	}
}
export function initDatePicker() {
	$('.datepicker').pickadate({
		selectMonths: true,
		selectYears: 15
	});
}
export function initSelect() {
	$('select').material_select();
}
export function getSearchParams(text) {
	const rangeTimeEl = $(`#${text}-uploadtime`);
	const data = {
		type: `${text}`,
		title: $(`#${text}-name`).val(),
		desc: $(`#${text}-summary`).val(),
		startDay: clearTimeEmpty(rangeTimeEl.find('.date-start').val()),
		endDay: clearTimeEmpty(rangeTimeEl.find('.date-end').val())
	};
	const newData = cleanObject(data);
	return newData;
}
/**
 * 附件
 */
export function getSearchAtachParams(text) {
	const rangeTimeEl = $(`#${text}-uploadtime`);
	const data = {
		types: ($(`#${text}-type`).val() as string[]).join(','),
		title: $(`#${text}-filename`).val(),
		startDay: clearTimeEmpty(rangeTimeEl.find('.date-start').val()),
		endDay: clearTimeEmpty(rangeTimeEl.find('.date-end').val())
	};
	const newData = cleanObject(data);
	return newData;
}
/**
 * 下拉加载更多
 *
 * @export
 * @class ScrollPagination
 */
interface IScrollPagination {
	/**
	 * 滚动元素
	 *
	 * @type {JQuery}
	 * @memberOf IScrollPagination
	 */
	el: JQuery;
	/**
	 * 滚动到底部的回调
	 * 其中continue需要在ajax请求成功，并且有数据情况下调用。（一开始解绑了滚动事件，请求成功后重新绑定）
	 * end需要在无返回值时调用
	 * @memberOf IScrollPagination
	 */
	cb: (page, next, end) => void;
}
export class ScrollPagination {
	private page = 1;
	private timer = null;
	private op: any;
	private loadingEl: JQuery;
	constructor(op) {
		this.op = op;
		this.init();
		this.loadingEl = $(`
			<div class="below-loading"></div>
			`);
		this.op.el.append(this.loadingEl);
	}
	private init() {
		this.bindEvent();
	}
	private bindEvent() {
		this.op.el.on('scroll', this.scrollEvent);
	}
	private scrollEvent = () => {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			const scrollHeight = this.op.el[0].scrollHeight;
			const height = this.op.el.outerHeight();
			const top = this.op.el.scrollTop();
			const padding = 40;// 距离底部的距离
			this.op.el.find('.kb-loading-wrap').css('top', this.op.el.get(0).scrollHeight);
			if (scrollHeight <= height + top + padding) {
				const endloading = loading(this.loadingEl);
				this.page++;
				this.op.el.off('scroll', this.scrollEvent);
				const next = () => {
					endloading();
					this.bindEvent();
				};
				const end = () => {
					endloading();
				};
				if (this.op.cb) {
					this.op.cb(this.page, next, end);
				}
			}
		}, 50);
	}
}
