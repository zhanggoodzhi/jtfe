import './index.less';
import 'bootstrap-daterangepicker/daterangepicker.css';
export { debounce, throttle, uniqueId } from 'lodash';
export const DATERANGEPICKERLOCALE = {
	'format': 'YYYY-MM-DD',
	'separator': ' - ',
	'applyLabel': '确定',
	'cancelLabel': '取消',
	'fromLabel': '从',
	'toLabel': '到',
	'customRangeLabel': '自定义时间',
	'weekLabel': 'W',
	'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
	'monthNames': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
	'firstDay': 1
};

export function renderTimeLength(value) {
	let theTime = parseInt(value);// 秒
	let theTime1 = 0;// 分
	let theTime2 = 0;// 小时
	if (theTime > 60) {
		theTime1 = Math.floor(theTime / 60);
		theTime = Math.floor(theTime % 60);
		if (theTime1 > 60) {
			theTime2 = Math.floor(theTime1 / 60);
			theTime1 = Math.floor(theTime1 % 60);
		}
	}
	let result = '' + Math.floor(theTime) + '秒';
	if (theTime1 > 0) {
		result = '' + Math.floor(theTime1) + '分' + result;
	}
	if (theTime2 > 0) {
		result = '' + Math.floor(theTime2) + '时' + result;
	}
	return result;
}
export function renderPercent(value) {
	return value + '%';
}
/**
 *
 * 获取全屏时rightCol的最小高度
 * @returns {number} 最小高度
 */
export const getMinContentHeight = (): number => {
	const rightCol = $('#right_col'),
		rightColPadding = rightCol.outerHeight() - rightCol.height();
	return window.innerHeight - rightColPadding - 5;
};
/**
 * 过滤对象中的undefind和""
 *
 * @param {any} obj 需要过滤的对象
 * @returns 过滤后的对象
 */
export const cleanObject = (obj) => {
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

export function tabShown(tab: JQuery, cb: Function, once: boolean = true) {
	if (tab.parent().hasClass('active') && once) {
		cb();
		return;
	}
	const on = once ? tab.one : tab.on;
	on.call(tab, 'shown.bs.tab', (e: JQueryEventObject) => {
		cb();
	});
}


/**
 * 右上角提示
 *
 * @param {string} msg 提示文本
 * @param {(string | number | boolean)} [status="error"] 提示状态
 * @param {boolean}
 */


const pnotifyStack = {
	dir1: 'down',
	dir2: 'left',
	push: 'bottom',
	spacing1: 25,
	spacing2: 25,
	firstpos1: 50,
	firstpos2: 25,
	context: $('body'),
	modal: false
};

export const alertMessage = (msg: string, status?: string | number | boolean, hide?: boolean): any => {
	let title = '操作失败',
		type = 'error';
	// if ($('.ui-pnotify').length > 0) {
	//     PNotify.removeAll();
	// }
	if (status !== undefined) {
		switch (status.toString()) {
			case 'success':
			case '200':
			case 'true':
				type = 'success';
				title = '操作成功';
				break;
			case 'error':
			case 'false':
				title = '操作失败';
				type = 'error';
				break;
			default:
				title = '温馨提示';
				type = status as string;
				break;
		}
	}


	return new PNotify({
		title: title,
		text: msg,
		type: type,
		styling: 'bootstrap3',
		hide: hide !== undefined ? false : true,
		delay: 8000,
		buttons: {
			closer: true,
			sticker: false
		},
		animate_speed: 'normal',
		stack: pnotifyStack
	});
};

/**
 *
 * 为按钮添加Loading效果并禁用
 * @param {JQuery} btn  需要被禁用的按钮元素
 * @returns {Function}  解除禁用的函数
 */

export function loadingBtn(btn: JQuery): Function {
	const clone = btn.clone(),
		width = btn.outerWidth();



	clone.prop('disabled', 'disabled')
		.width(width)
		.html('<i class="fa fa-spinner fa-spin fa-fw"></i>');

	btn
		.data('loading', true)
		.hide()
		.before(clone);


	return () => {
		clone.remove();
		btn
			.data('loading', false)
			.show();
	};
}

/**
 *
 * 如果有多个loadingBtn加载在一个按钮上,可以手动恢复按钮可点击状态
 * @param {JQuery} btn 按钮元素
 * @param {string} text 恢复后的按钮文字
 */
export const endLoadingBtn = (btn: JQuery) => {
	if (btn.is(':hidden')) {
		const clone = btn.prev();
		if (clone.prop('disabled')) {
			clone.remove();
			btn.show();
		}
	}
};

interface ISimpleDateProps {
    /**绑定的input元素
     *
     *
     * @type {JQuery}
     * @memberOf SimpleDateProps
     */
	el: JQuery;
    /**
     * 默认时间
     *
     * @type {(string | Date | moment.Moment)}
     * @memberOf SimpleDateProps
     */
	date?: string | Date | moment.Moment;
    /**
     * daterangepicker options
     *
     * @type {daterangepicker.Settings}
     * @memberOf SimpleDateProps
     */
	options?: daterangepicker.Settings;
}

/**
 *
 * 单选的时间选择器
 * @class SimpleDate
 */
export class SimpleDate {
	private props: ISimpleDateProps;
	private date;

	constructor(props: ISimpleDateProps) {
		this.props = props;
		this.init();
	}
	private init() {
		const config: daterangepicker.Settings = {
			locale: DATERANGEPICKERLOCALE,
			singleDatePicker: true,
			showDropdowns: true
		};
		if (this.props.date) {
			config.startDate = this.props.date as any;
		}
		this.date = this.props.el.daterangepicker(Object.assign(config, this.props.options));
		this.props.el.addClass('cloud-date');
	}
    /**
     * 删除实例
     */
	public destroy() {
		this.props.el.toArray().forEach(v => {
			$(v).data('daterangepicker').remove();
		});
	}
}

interface ICommonDateProps {
	el: JQuery;
	options?: daterangepicker.Settings;
	onClick?: any;
}

export class CommonDate {
	private props: ICommonDateProps;
	private date;
	static START = '1970-01-01';
	static END = '2038-12-31';

	constructor(props: ICommonDateProps) {
		this.props = props;
		this.init();
	}
	private init() {
		const config = {
			locale: DATERANGEPICKERLOCALE,
			opens: 'center',
			autoApply: true,
			alwaysShowCalendars: false,
			startDate: CommonDate.START,
			endDate: CommonDate.END,
			ranges: {
				'今天': [moment(), moment()],
				'最近7天': [moment().subtract(6, 'days'), moment()],
				'最近30天': [moment().subtract(29, 'days'), moment()],
				'最近3个月': [moment().subtract(3, 'month'), moment()],
				'最近1年': [moment().subtract(1, 'year'), moment()],
				'全部数据': [CommonDate.START, CommonDate.END]
			}
		};
		this.date = this.props.el.daterangepicker(Object.assign(config, this.props.options))
			.on('apply.daterangepicker', this.props.onClick);
		this.props.el.addClass('cloud-date');
	}

	public resetDate() {
		this.setDate(CommonDate.START, CommonDate.END);
	}

	public getDate(type?: string): string | string[] {
		const val = this.props.el.val().split(DATERANGEPICKERLOCALE.separator);
		const start = val[0], end = val[1];
		let result;
		switch (type) {
			case 'start':
				result = start;
				break;
			case 'end':
				result = end;
				break;
			default:
				result = val;
				break;
		}

		if (start === CommonDate.START && end === CommonDate.END) {
			result = '';
		}
		return result;
	}

	public setDate(start: string | Date | moment.Moment, end: string | Date | moment.Moment) {
		this.props.el.val(this.format(start) + DATERANGEPICKERLOCALE.separator + this.format(end));
	}

	private format(time: string | Date | moment.Moment): string {
		return moment(time).format(DATERANGEPICKERLOCALE.format);
	}

	public destroy() {
		this.props.el.toArray().forEach(v => {
			$(v).data('daterangepicker').remove();
		});
	}
}

/**
 *
 * @el 绑定的元素
 * @config   设置
 * @onChange 内容变化后的回调
 * @interface EditorProps
 */
interface IEditorProps {
	el: JQuery;
	config?: any;
	onChange?: any;
}

/**
 *
 * 富文本编辑器初始化设置
 * @class Editor
 */
export class Editor {
	private props: IEditorProps;
	private editor: any;
	constructor(props: IEditorProps) {
		this.props = props;
		this.init();
	}
	init() {
		const config = {
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
				// "alignleft",
				// "aligncenter",
				// "alignright",
				'|',
				'link',
				'unlink',
				'|',
				'uploadvideo',
				'img',
				'|',
				'undo',
				'redo'
			],
			uploadImgUrl: 'knowledge/uploadPairImg'
		};
		this.editor = new wangEditor(this.props.el);
		if (this.props.config) {
			Object.assign(config, this.props.config);
		}
		Object.assign(this.editor.config, config);

		if (this.props.hasOwnProperty('onChange')) {
			this.editor.onchange = this.props.onChange;
		}
		this.editor.create();
	}

	get editorElement() {
		return this.editor;
	}
}

/**
 *
 * el 绑定的元素d
 * data 数据
 * multiple 是否可以多选 不填或false
 * selected 默认选中元素true为选中第一个,或者未要选中的元素的id
 * @interface ClassifyTreeProps
 */

interface IClassifyTreeProps {
	el: JQuery;
	data: ITreeData[];
	multiple?: boolean;
	selected?: boolean | string[];
	onChange?: any; // 添加选中事件
}

export interface ITreeData {
	id: string;
	text: string;
	parent: string;
}

interface ITree {
	el: JQuery;
	data: ITreeData[];
	elementClassName?: string;
	treeWrapClassName?: string;
	treeClassName?: string;
	onChange?: Function;
	multiple?: boolean;
	disabled?: boolean;
	selected?: boolean | string[];
	selectAllClear?: boolean;
	initComplete?: Function;
}


export class Tree {
	private props: ITree;
	private treeElement: JQuery;
	private wrapElement: JQuery;
	private selectedIds: string[];
	private _tree: JSTree;
	private initState: boolean = false;
	private beforeInit: Function[] = [];
	constructor(props: ITree) {
		this.props = Object.assign({
			elementClassName: 'cloud-tree-element',
			treeWrapClassName: 'cloud-tree-wrap',
			treeClassName: 'clouod-tree',
			multiple: false,
			disabled: false,
			selected: true,
			selectAllClear: true
		}, props);

		this.init();
	}

	private init() {
		this.packElement();
		const config = {
			'core': {
				'data': (node, cb) => cb(this.props.data),
				'strings': {
					'Loading ...': '加载中 ...'
				},
				'animation': 100,
				'themes': {
					'icons': false
				},
				'multiple': this.props.multiple
			}
		};

		this.props.el.addClass(this.props.elementClassName);

		if (config.core.multiple) {
			Object.assign(config, {
				checkbox: {
					'keep_selected_style': true,
					'tie_selection': true,
					'visible': false
				},
				plugins: [
					'checkbox'
				]
			});
		}

		this.treeElement.jstree(config)
			.on('changed.jstree', this.onChange)
			.on('refresh.jstree', this.onRefresh)
			.one('ready.jstree', this.initComplete);
	}

	private packElement() {
		const props = this.props;
		const wrap = $(`<div class="${props.treeWrapClassName}"></div>`)
			.css({
				'height': props.el.outerHeight()
			});
		this.treeElement = $(`<div class="${props.treeClassName}"></div>`);
		props.el.wrap(wrap);
		props.el.after(this.treeElement);
		this.wrapElement = wrap;
		this.adjustWidth();
	}

    /**
     * 初始化完毕后回调
     *
     * @private
     *
     * @memberOf Tree
     */
	private initComplete = () => {
		const props = this.props;
		this.initState = true;
		this.initAnimation();
		this._tree = $(this.treeElement).jstree(true);
		this._tree.open_all();
		if (props.selected) {
			if (props.selected === true && props.data.length > 0) {
				// 默认选中第一个
				this.selected = [props.data[0].id];
				if (props.multiple && props.selectAllClear) {
					this.clear();
				}
			}
			else {
				this.selected = props.selected as string[];
			}
		}

		if (this.beforeInit.length > 0) {
			this.beforeInit.forEach(v => {
				v();
			});
			this.beforeInit = null;
		}

		if (this.props.initComplete) {
			this.props.initComplete(this);
		}
	}

	private initAnimation() {
		this.props.el.on('click', () => {
			if (!this.props.disabled) {
				this.treeElement.toggleClass('show');
			}
		});

		this.treeElement.on('mouseleave', () => {
			this.hideTree();
		});
	}

	private hideTree() {
		const el = this.treeElement;
		if (el.hasClass('show')) {
			el.removeClass('show');
		}
	}

	private onRefresh = () => {
		this._tree.open_all();
	}

	private onChange = (node, action) => {
		const props = this.props,
			data = props.data,
			selectedData = this._tree.get_selected(true),
			ids = selectedData.map(v => v.id);
		let str: string = '';

		if (props.multiple && (selectedData.length === 0 || data.length === selectedData.length) && props.selectAllClear) {
			str = data[0].text;
			this.selectedIds = [];
		}
		else {
			// 排序
			for (let i of data) {
				if (ids.indexOf(i.id + '') > -1) {
					str += i.text + ',';
				}
			}
			str = str.slice(0, -1);
			this.selectedIds = ids;
		}

		this.props.el.text(str).attr('title', str);

		if (!this.props.multiple) {
			this.treeElement.removeClass('show');
		}

		if (this.props.onChange) {
			this.props.onChange();
		}
	}


	public adjustWidth() {
		if (!this.initState) {
			this.beforeInit.push(() => { this.adjustWidth(); });
			return;
		}
		const el = this.props.el,
			elOuterWidth = el.outerWidth(true),
			elPadding = (elOuterWidth - el.width()) / 2;

		this.treeElement.css({
			'top': el.outerHeight(),
			'left': 0,
			'minWidth': el.outerWidth(true),
			'paddingLeft': `${elPadding}px`,
			'paddingRight': `${elPadding}px`
		});
	}

	public clear() {
		if (!this.initState) {
			this.beforeInit.push(() => { this.clear(); });
			return;
		}
		$(this.treeElement).jstree(true).deselect_all();
	}

	public resetFirst() {
		if (!this.initState) {
			this.beforeInit.push(() => { this.resetFirst(); });
			return;
		}
		this.selected = [this.props.data[0].id];
	}


	get selected() {
		return this.selectedIds;
	}

	set selected(ids: string[]) {
		if (!this.initState) {
			this.beforeInit.push(() => { this.selected = ids; });
			return;
		}
		this.clear();
		$(this.treeElement).jstree(true).select_node(ids);
	}

	get data() {
		return this.props.data;
	}

	set data(data: ITreeData[]) {
		if (!this.initState) {
			this.beforeInit.push(() => { this.props.data = data; });
			return;
		}
		this.props.data = data;
		this._tree.refresh(true, false);
	}

	get tree(): JSTree {
		return this._tree;
	}
}

/**
 * 已重写请使用Tree类
 * 初始化选中类别的下拉菜单
 * @class ClassifyTree
 */
export class ClassifyTree {
	private props: IClassifyTreeProps;
	private currentElement: JQuery;
	private selectedId: string[];
	private isDisbaled: boolean = false;
	static currentElementClass: string = 'classify-tree-wrap';
	static elClass: string = 'cloud-select-tree';
	constructor(props: IClassifyTreeProps) {
		this.props = props;
		this.selectedId = [];
		this.init();
		this.bindAnimate();
	}
	private init() {
		this.props.el.addClass(ClassifyTree.elClass);
		this.addTreeElement();
		const config: any = {
			'core': {
				'data': this.data,
				'strings': {
					'Loading ...': '加载中 ...'
				},
				'animation': 100,
				'themes': {
					'icons': false
				},
				'multiple': false
			},
			'callback': {
				'onselect': this.props.onChange
			}
		};
		// 多选
		if (this.props.hasOwnProperty('multiple') && this.props.multiple === true) {
			config.core.multiple = true;
			config.checkbox = {
				'keep_selected_style': true,
				'tie_selection': true,
				'visible': false
			};
			config.plugins = ['checkbox'];
		}

		this.currentElement.jstree(config)
			// .on("select_node.jstree", this.onChange.bind(this))
			// .on("select_node.jstree", this.onChange)
			.on('changed.jstree', this.onChange)
			.one('ready.jstree', () => {
				const tree = $(this.currentElement).jstree(true);
				tree.open_all();
				if (this.props.hasOwnProperty('selected')) {
					if (this.props.selected === true && this.data.length > 0) {
						this.selected = [this.data[0].id];
						if (this.props.hasOwnProperty('multiple') && this.props.multiple === true) {
							tree.deselect_all();
						}
					}
					else {
						this.selected = this.props.selected as string[];
					}
				}
			});

	}
	// 为元素添加tree的元素用于填充tree
	private addTreeElement() {
		const parentEl = this.props.el.parent();
		parentEl.css('position', 'relative');
		this.currentElement = $(`<div class="${ClassifyTree.currentElementClass}"></div>`);
		this.props.el.after(this.currentElement);
		this.adjustWidth();
	}

	// 选项发生变化的回调
	private onChange = (node, action) => {
		const tree = $(this.currentElement).jstree(true),
			data = this.data,
			selected = tree.get_selected(true),
			ids = selected.map(v => v.id);
		let str: string = '';
		this.selectedId = ids;

		if (this.props.multiple === true && (selected.length <= 0 || data.length === selected.length)) {
			this.selectedId = [];
			str = data[0].text;
		}
		else {
			for (let i of data) {
				if (ids.indexOf(i.id + '') > -1) {
					str += i.text + ',';
				}
			}
			str = str.slice(0, -1);
		}
		this.props.el.text(str).attr('title', str);

		if (!this.props.multiple) {
			this.currentElement.removeClass('show');
		}
	}

	public disable(): void {
		this.isDisbaled = true;
		this.props.el.addClass('disabled');
	}

	public enable(): void {
		this.isDisbaled = false;
		this.props.el.removeClass('disabled');
	}
	// 为数调整位置和宽度
	public adjustWidth(): ClassifyTree {
		const parentEl = this.props.el.parent();
		this.currentElement.css({
			'top': this.props.el.outerHeight(),
			'left': (parentEl.outerWidth(true) - this.props.el.outerWidth(true)) / 2,
			'minWidth': this.props.el.outerWidth(true)
		});
		return this;
	}

	public updateData(data): ClassifyTree {
		(this.currentElement.jstree(true) as any).settings.core.data = data;
		this.data = data;
		this.refresh();
		return this;
	}

	public refresh(): ClassifyTree {
		(this.currentElement.jstree(true) as any).refresh();
		return this;
	}

    /**
     *
     * 绑定点击和移除动画
     * @private
     */
	private bindAnimate(): ClassifyTree {
		this.props.el.on('click', () => {
			if (!this.isDisbaled) {
				this.currentElement.toggleClass('show');
			}
		});

		// if (!this.props.multiple) {
		this.currentElement.on('mouseleave', () => {
			if (this.currentElement.hasClass('show')) {
				this.currentElement.removeClass('show');
			}
		});
		// }


		return this;

	}


	public reset(): ClassifyTree {
		$(this.currentElement).jstree(true).deselect_all();
		return this;
	}

	get tree(): JQuery {
		return this.currentElement;
	}

	get selected(): string[] {
		return this.selectedId;
	}

	get data(): any {
		return this.props.data;
	}

	set data(data) {
		this.props.data = data;
	}

	set selected(ids: string[]) {
		this.reset()
			.currentElement.jstree(true).select_node(ids);
	}

}

interface IClassifyTreeOriginData {
	id: string;
	name: string;
	parent: string;
}


/**
 * 包装原始的分类数据
 *
 * @param {IClassifyTreeOriginData[]} data  原始分类数据
 * @param {boolean} [total=false]   是否有所有问题
 * @returns {ITreeData[]}   包装后的数据
 */
export const formatClassify = (data: IClassifyTreeOriginData[], topLevel: boolean = false, topLevelText: string = '所有类型'): ITreeData[] => {
	const d: ITreeData[] = [];
	let parent = '#';
	if (topLevel) {
		const totalData = {
			text: topLevelText,
			parent: '#',
			id: 'root'
		};
		d.push(totalData);
		parent = totalData.id;
	}
	data.forEach(v => {
		d.push({
			text: v.name,
			parent: ('' + v.parent) === '0' ? parent : v.parent,
			id: v.id
		});
	});
	return d;
};

interface IUploadProps {
    /**
     * 需要上传文件的Url
     *
     * @type {string}
     * @memberOf IUploadProps
     */
	url: string;


    /**
     * 是否允许多选文件
     *
     * @type {boolean}
     * @memberOf IUploadProps
     */
	multiple?: boolean;


    /**
     * input 的 accept属性,限制文件类型
     *
     * @type {string}
     * @memberOf IUploadProps
     */
	accept: string;
    /**
     * formData的name属性
     *
     * @type {string}
     * @memberOf IUploadProps
     */
	name?: string;
    /**
     * 上传成功后的回调
     *
     * @type {Function}
     * @memberOf IUploadProps
     */
	success: Function;
    /**
     * 上传完毕的回调
     *
     * @type {Function}
     * @memberOf IUploadProps
     */
	complete?: Function;
    /**
     * 是否允许添加重复文件
     *
     * @type {boolean}
     * @memberOf IUploadProps
     */
	repeat?: boolean;
    /**
     * 文件重复的回调
     *
     * @type {Function}
     * @memberOf IUploadProps
     */
	repeatCallback?: Function;
    /**
     * 是否要在用户选中文件之后立即自动上传
     *
     * @type {boolean}
     * @memberOf IUploadProps
     */
	bindChangeEvent?: boolean;
    /**
     * 用户选中文件后的回调
     *
     * @type {Function}
     * @memberOf IUploadProps
     */
	onChange?: Function;
    /**
     * 用户清空后的回调
     *
     * @type {Function}
     * @memberOf IUploadProps
     */
	clearCallback?: Function;


    /**
     * 是否允许空的文件
     *
     * @type {boolean}
     * @memberOf IUploadProps
     */
	ableEmpty?: boolean;


	clearInput?: boolean;
}
/**
 * 上传文件通用组件
 *
 * @class Upload
 */
export class Upload {
	private props: IUploadProps;
    /**
     * input元素
     *
     * @private
     * @type {JQuery}
     * @memberOf Upload
     */
	private input: JQuery;
    /**
     * 已经上传成功的文件列表
     *
     * @private
     * @type {number[]}
     * @memberOf Upload
     */
	private files: string[];
	constructor(props: IUploadProps) {
		this.props = Object.assign({
			name: 'upload',
			repeat: true,
			bindChangeEvent: true,
			multiple: false,
			ableEmpty: false,
			clearInput: true
		}, props);
		this.init();
	}

	private init = () => {
		this.files = [];
		this.input = $(`<input type="file" accept="${this.props.accept}" ${this.props.multiple ? 'multiple = "multiple"' : ''}  name="${this.props.name}" /> `);
		if (this.props.onChange) {
			this.input.on('change', () => {
				this.props.onChange(this.getFiles());
			});
		}
		if (this.props.bindChangeEvent) {
			this.input.on('change', this.upload);
		}
	}

	private uploadFile(file, cb?: Function, data?: Object) {
		if (!(window as any).FormData) {
			// tslint:disable-next-line:no-console
			console.log('不支持FormData!');
			return;
		}
		const form = new FormData();
		form.append(this.props.name, file);
		if (data) {
			for (let v in data) {
				form.append(v, data[v]);
			}
		}

		$.ajax({
			url: this.props.url,
			type: 'POST',
			data: form,
			processData: false,
			contentType: false,
			success: (msg) => {
				if (file.length > 0) {
					this.props.success(msg, this.getFileCode(file));
				}
				else {
					this.props.success(msg);
				}

				if (this.props.clearInput) {
					this.clear();
				}
			},
			complete: (jqXHR, textStatus) => {
				if (this.props.complete) {
					this.props.complete(jqXHR, textStatus);
				}
				if (cb) {
					cb(jqXHR, textStatus);
				}
			},
			error: () => {
				if (file.length > 0) {
					this.removeFile(this.getFileCode(file));
				}
			}
		});
	}

    /**
     * 生成文件的唯一标识
     *
     * @private
     * @param {any} file
     * @returns {string}
     *
     * @memberOf Upload
     */
	private getFileCode(file): string {
		const code = 3637;
		const getStringCode: Function = (s: string): number => {
			return code * Array.prototype.reduce.call(s, (x, y, i) => x + s.charCodeAt(i), 0);
		};

		return (
			getStringCode(file.name)
			+ getStringCode(file.type)
			+ file.lastModified
			+ file.size).toString(16);
	}


    /**
     *
     * 开始上传
     *
     * @memberOf Upload
     */
	public upload = (data?: Object, cb?: Function) => {
		const files = this.getFiles();
		// 没有文件且不允许空||没有文件允许空但是没有data
		if ((!files && !this.props.ableEmpty) || (!files && this.props.ableEmpty && !data)) {
			return;
		}
		if (!files) {
			this.uploadFile((this.input.get(0) as HTMLInputElement).files, cb, data);
			return;
		}
		Array.prototype.forEach.call(files, v => {
			const code = this.getFileCode(v);
			if (!this.props.repeat && this.files.indexOf(code) >= 0) {
				if (this.props.repeatCallback) {
					this.props.repeatCallback();
				}
				return;
			}
			this.uploadFile(v, cb, data);
			this.files.push(code);
		});
	}

    /**
     * 获取选中的文件
     *
     * @returns {(FileList | boolean)}
     *
     * @memberOf Upload
     */
	public getFiles(): FileList | boolean {
		const fileElement = this.input;
		if (fileElement.val() === '') {
			return false;
		}
		const files = (fileElement.get(0) as HTMLInputElement).files;
		if (files.length < 1) {
			return false;
		}

		return files;
	}

    /**
     * 清空选中的文件
     *
     *
     * @memberOf Upload
     */
	public clear() {
		this.input.val('').trigger('change');
		if (this.props.clearCallback) {
			this.props.clearCallback();
		}
	}

    /**
     * 触发弹出选择文件
     *
     *
     * @memberOf Upload
     */
	public select() {
		this.input.click();
	}

    /**
     *
     * 在已经上传的文件列表中移除该文件
     * @param {number} getFileCode
     *
     * @memberOf Upload
     */
	public removeFile(file: string) {
		const index = this.files.indexOf(file);
		if (index >= 0) {
			this.files.splice(index, 1);
		}
	}


}

interface IConfirmDelete {
    /**
     * 模态框内容
     *
     * @type {string}
     * @memberOf IConfirmDelete
     */
	msg: string;
    /**
     * 点击左边按钮回调函数(一般为删除按钮)
     *
     * @type {Function}
     * @memberOf IConfirmDelete
     */
	cb: Function;
    /**
     * 左边按钮的文本
     *
     * @type {string}
     * @memberOf IConfirmDelete
     */
	text?: string;
    /**
     * 左边按钮的类名
     *
     * @type {string}
     * @memberOf IConfirmDelete
     */
	className?: string;
    /**
     * 点击右边按钮回调函数(一般为取消按钮)
     *
     * @type {Function}
     * @memberOf IConfirmDelete
     */
	cancel?: Function;
    /**
     * 右边按钮的文本
     *
     * @type {string}
     * @memberOf IConfirmDelete
     */
	cancelText?: string;
    /**
     * 右边按钮的类名
     *
     * @type {string}
     * @memberOf IConfirmDelete
     */
	cancelClassName?: string;
}

/**
 * 确认模态框,一般用于是否删除
 *
 * @param {IConfirmDelete} options
 */
export const confirmModal = (options: IConfirmDelete) => {
	const op: IConfirmDelete = Object.assign({
		className: 'btn-danger',
		text: '删除',
		cancelClassName: 'btn-default',
		cancelText: '取消'
	}, options),

		yesBtn = $(`<button class="btn ${op.className}" type="button">
                        ${op.text}
                    </button>`),
		noBtn = $(`<button class="btn ${op.cancelClassName}" type="button" ${op.cancel ? '' : 'data-dismiss="modal"'}>
                        ${op.cancelText}
                </button>`),
		modal = $(`
        <div class="modal fade">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">
                                &times;
                            </span>
                        </button>
                        <h4 class="modal-title">
                            温馨提示
                        </h4>
                    </div>
                    <div class="modal-body">
                        <p>
                            ${op.msg}
                        </p>
                    </div>
                    <div class="modal-footer">

                    </div>
                </div>
            </div>
        </div>`),
		callback = (e: Event) => { op.cb(modal, $(e.currentTarget)); },
		cancelCallback = (e) => { op.cancel(modal, $(e.currentTarget)); };


	modal.find('.modal-footer').append(yesBtn, noBtn);
	$(document.body).append(modal);

	if (op.cb) {
		yesBtn.on('click', callback);
	}

	if (op.cancel) {
		noBtn.on('click', cancelCallback);
	}


	modal.modal({
		backdrop: false
	});

	modal.one('hidden.bs.modal', () => {
		if (op.cb) {
			yesBtn.off('click', callback);
		}

		if (op.cancel) {
			noBtn.off('click', cancelCallback);
		}
		modal.remove();
	});

	noBtn.focus();
};

/**
 * 绑定input的输入事件
 *
 * @param {JQuery} el   元素
 * @param {string} event    需要绑定的事件(如"input keypress")
 * @param {any} cb  回调
 * @param {number} [delay=200]  延迟
 * @param {string} [selector]   可能用于事件委托的选择器
 */
export const bindInput = (el: JQuery, event: string, cb, delay: number = 200, selector?: string) => {
	let timer;
	const callback = (e) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			cb($.trim($(e.currentTarget).val()), e);
		}, delay);
	};
	if (selector) {
		el.on(event, selector, callback);
	}
	else {
		el.on(event, callback);
	}

};

/**
 * 为元素增加Loading覆盖层
 *
 * @param {JQuery} el   需要被覆盖的元素
 * @param {JQuery} [blurEl] 需要被模糊的元素
 * @returns {Function}  清除覆盖层函数
 */
export const addLoadingBg = (el: JQuery, blurEl?: JQuery): Function => {
	if (!el.hasClass('loading-parent')) {
		const loadingEl = $(`
        <div class="loading-bg">
            <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
        </div>
    `);

		el.addClass('loading-parent')
			.prepend(loadingEl);

		if (blurEl && !blurEl.hasClass('loading-blur')) {
			blurEl.addClass('loading-blur');
		}
	}

	return () => {
		el.removeClass('loading-parent');
		el.find('.loading-bg').remove();
		// loadingEl.remove();
	};
};

/**
 * 渲染YYYY-MM-DD格式时间
 *
 * @param {(string | Date | moment.Moment)} time
 * @returns
 */
export const renderSimpleTime = (time: string | Date | moment.Moment) => {
	if (!time) {
		return '无';
	}
	return moment(time).format('YYYY-MM-DD');
};

/**
 * 渲染YYY-MM-DD HH:mm:ss格式时间
 *
 * @param {(string | Date | moment.Moment)} time
 * @returns
 */
export const renderCommonTime = (time: string | Date | moment.Moment) => {
	if (!time) {
		return '无';
	}
	return moment(time).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 格式化富文本,一般用于语料的答案
 *
 * @param {string} html 富文本
 * @returns {string}    纯文本
 */
export const formatText = (html: string, replace = true): string => {
	const tags: string[] = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'table', 'ul', 'ol', 'pre', 'li', 'tr', 'code'],
		replaceMap = [
			{
				element: 'img',
				replacement: '[图片]'
			},
			{
				element: 'video',
				replacement: '[视频]'
			},
			{
				element: 'audio',
				replacement: '[音频]'
			}
		],
		replaceRegs: RegExp[] = tags.map(tag => {
			return new RegExp('\>\\s*\<(' + tag + ')\>', 'ig');
		});

	// 去除空格
	html = html.replace(/\s*</ig, '<');

	replaceRegs.forEach(reg => {
		if (reg.test(html)) {
			html = html.replace(reg, (matchStr, tag) => {
				return '>\n<' + tag + '>';
			});
		}
	});

	const wrap = $(`<div>${html}</div>`);

	if (replace) {
		for (let v of replaceMap) {
			wrap.find(v.element).replaceWith(v.replacement);
		}
	}
	return wrap.text();
};

/**
 * 监听输入回车
 *
 * @param {JQuery} el   元素
 * @param {Function} cb 回调
 * @param {string} [selector]   可能用于事件委托的选择器
 */
export const bindEnter = (el: JQuery, cb: Function, selector?: string): void => {
	if (selector) {
		el.on('keydown', selector, e => {
			if (e.keyCode === 13) {
				e.preventDefault();
				cb(e);
			}
		});
	}
	else {
		el.on('keydown', e => {
			if (e.keyCode === 13) {
				e.preventDefault();
				cb(e);
			}
		});
	}
};

interface IFilterChild {
	data: any[];
	id: string;
	idParam?: string;
	parentParam?: string;
	self?: boolean;
}

/**
 * 扁平数据过滤子级
 *
 * @param {IFilterChild} options
 * @returns
 */
export const filterChild = (options: IFilterChild) => {
	const d = Object.assign({
		idParam: 'id',
		parentParam: 'parentId',
		self: false
	}, options),
		filterList = [],
		result = [],
		filterById = (id) => {
			d.data.forEach((v) => {
				const vId = v[d.idParam],
					vPId = v[d.parentParam];
				if (filterList.indexOf(vId) < 0) {
					if (id === vPId || id === vId) {
						filterList.push(vId);
						filterById(vId);
					}
					else {
						return;
					}
				}
			});
		};


	filterById(d.id);


	d.data.forEach(v => {
		const vId = v[d.idParam];
		if (filterList.indexOf(vId) < 0) {
			result.push(v);
		}
	});

	return result;
};


export const triggerOnceWithinDelay = (cb: Function, delay: number = 200) => {
	let timerId: number = null;
	return () => {
		if (timerId) {
			clearTimeout(timerId);
		}

		timerId = setTimeout(cb, delay);
	};
};

export enum IconState {
	plus,
	loading,
	minus
}

export const useIcon = () => {
	const iconMap = new Map();
	const getKeyCode = (el: Element) => {
		const target = $(el);
		const code = target.data('code');
		if (!code) {
			const newCode = '' + new Date().getTime() + Math.random();
			target.data('code', newCode);
			return newCode;
		} else {
			return code;
		}
	};

	class Icon {
		private target: HTMLElement;
		private el: HTMLElement;
		private iconState: IconState;
		static publicClassName: string = 'fa';
		static className = {
			[IconState.plus]: 'fa-plus-square',
			[IconState.loading]: 'fa-spinner fa-spin',
			[IconState.minus]: 'fa-minus-square'
		};

		constructor(target: HTMLElement) {
			this.target = target;
			this.init();
			iconMap.set(getKeyCode(target), this);
		}

		private init() {
			this.el = document.createElement('i');
			this.state = IconState.plus;
			$(this.target).empty().append(this.el);
		}

		private changeClassName() {
			this.el.className = Icon.publicClassName + ' ' + Icon.className[this.iconState];
		}

		set state(state: IconState) {
			this.iconState = state;
			this.changeClassName();
		}

		get state() {
			return this.iconState;
		}
	}
	jQuery.fn.extend({
		icon: function (): Icon {
			const code = getKeyCode(this);
			if (!iconMap.has(code)) {
				new Icon(this);
			}
			return iconMap.get(code);
		}
	});
};

export function bigNumber2String(json: string) {
	return json.replace(/(:|\,)\s?[1-9]\d{18}/g, (str) => {
		return `${str[0]}"${str.slice(1).trim()}"`;
	});
}

interface ISideBarOptions {
	id?: string;
	title?: string;
	content?: string;
	width?: number;
	onHide?(this: SideBar): void;
	onShow?(this: SideBar): void;
}

export class SideBar {
	private _options: ISideBarOptions;
	private _elements: {
		wrap: JQuery;
		header: JQuery;
		title: JQuery;
		content: JQuery;
		backdrop: JQuery;
		closeBtn: JQuery;
	};

	constructor(options?: ISideBarOptions) {
		const _options: ISideBarOptions = {
			title: '',
			content: '',
			width: 0.7
		};

		Object.assign(_options, options);

		this._options = _options;

		this.init();
	}

	private init() {
		const op = this._options,
			wrap = $(`<div id="${op.id ? op.id : ''}" class='cloud-sidebar'></div>`),
			backdrop = $(`<div class='sidebar-backdrop'></div>`),
			header = $(`<header class='sidebar-header'></header>`),
			title = $(`<h4 class='sidebar-title'>${op.title}</h4>`),
			closeBtn = $(`<button type='button' class='close'>&times;</button>`),
			content = $(`<div class='sidebar-content'>${op.content}</div>`);

		wrap.css({
			width: op.width * window.innerWidth + 'px'
		});

		header.append(title);
		header.append(closeBtn);
		wrap.append(header, content);

		$(document.body).append(wrap, backdrop);

		closeBtn.on('click', () => {
			this.hide();
		});
		backdrop.on('click', () => {
			this.hide();
		});

		this._elements = {
			wrap,
			header,
			title,
			content,
			closeBtn,
			backdrop
		};
	}

	public show = (trigger: boolean = true) => {
		const els = this._elements;
		$('html').addClass('fixed');
		els.wrap.addClass('show');
		els.backdrop.addClass('show');
		if (trigger) {
			if (this._options.onShow) {
				this._options.onShow.call(this);
			}
		}
	}

	public hide = (trigger: boolean = true) => {
		const els = this._elements;
		$('html').removeClass('fixed');
		els.wrap.removeClass('show');
		els.backdrop.removeClass('show');
		if (trigger && this._options.onHide) {
			this._options.onHide.call(this);
		}
	}

	public toggle = (trigger: boolean = true) => {
		$('html').hasClass('fixed') ? this.hide(trigger) : this.show(trigger);
	}


	public settings = (options?: ISideBarOptions) => {
		if (options) {
			Object.assign(this._options, options);
		}

		return this._options;
	}

	get title() {
		return this._elements.title.html();
	}

	set title(title: string) {
		this._elements.title.html(title);
	}

	get elements() {
		return this._elements;
	}
}

export function getFullHeight(el: JQuery) {
	let height = window.innerHeight - el.offset().top - 1;
	Array.prototype.forEach.call(el.parents(), p => {
		const par = $(p);
		['marginBottom', 'paddingBottom', 'borderBottomWidth'].forEach(v => {
			height -= parseFloat(par.css(v));
		});
	});

	Array.prototype.forEach.call(el.nextAll(), n => {
		height -= $(n).height();
	});

	return Math.ceil(height);
}


export function setScrollHeight() {
	Array.prototype.forEach.call($('.cloud-scroll:visible'), (v) => {
		const el = $(v);
		el.height(getFullHeight(el));
	});

	Array.prototype.forEach.call($('.cloud-minheight:visible'), (v) => {
		const el = $(v);
		el.css('min-height', getFullHeight(el));
	});
}

/**
 * 下拉加载更多
 *
 * @export
 * @class ScrollPagination
 */
interface IScrollPagination {
	/**
	 * 滚动元素(需要固定高度)
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
		op.el.css('overflow', 'auto')
			.css('position', 'relative');
		this.op = op;
		this.init();
		this.loadingEl = $(`
			<div class="below-loading"></div>
			`);
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
			if (scrollHeight <= height + top + padding) {
				this.op.el.append(this.loadingEl);
				this.op.el.find('.below-loading').css('top', this.op.el.get(0).scrollHeight - 50);
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

/**
 *
 *
 * @export
 * @param {JQuery} el	被添加loading的元素
 * @param {JQuery} [blur]	被添加模糊效果的元素
 * @returns {Function}
 */
export function loading(el: JQuery, blur?: JQuery): Function {
	let loadingEl = $(`<i class="fa fa-spinner fa-spin fa-fw"></i>`);
	if (!el.hasClass('cloud-div-loading')) {
		el.addClass('cloud-div-loading')
			.append(loadingEl);
		if (blur) {
			blur.addClass('kb-blur');
		}
	}
	return () => {
		el.removeClass('cloud-div-loading');
		loadingEl.remove();
		if (blur) {
			blur.removeClass('kb-blur');
		}
	};
}
// 禁用回车自动提交表单
export function forbidEnterAutoSubmit() {
	document.onkeydown = function (event) {
		let target, code, tag;
		if (!event) {
			// event = window.event; // 针对ie浏览器
			target = event.srcElement;
			code = event.keyCode;
			if (code === 13) {
				tag = target.tagName;
				if (tag === 'TEXTAREA') { return true; }
				else { return false; }
			}
		}
		else {
			target = event.target; // 针对遵循w3c标准的浏览器，如Firefox
			code = event.keyCode;
			if (code === 13) {
				tag = target.tagName;
				if (tag === 'INPUT') { return false; }
				else { return true; }
			}
		}
	};
}
export function getImage($container, d) {
	const width = $container.get(0).offsetWidth(),
		imageWidth = 200,
		column = width < imageWidth ? 1 : Math.floor(width / imageWidth),
		columnWidth = (100 / column) + '%';
	return `<div class="news-pic-item" style="width:${columnWidth}">
			<img src="${d.identifierUrl}"/>
			<p title="${d.name}">${d.name}</p>
		</div>`;
}

export function renderMilliTimeLength(value) {
	let milliSecond = parseInt(value);
	let second = 0;
	let minute = 0;
	let hour = 0;
	if (milliSecond > 1000) {
		second = Math.floor(milliSecond / 1000);
		milliSecond = Math.floor(milliSecond % 1000);
		if (second > 60) {
			minute = Math.floor(second / 60);
			second = Math.floor(second % 60);
			if (minute > 60) {
				hour = Math.floor(minute / 60);
				minute = Math.floor(minute % 60);
			}
		}
	}
	let result = '';
	// if (milliSecond > 0) {
	// 	result = '' + Math.floor(milliSecond) + '毫秒' + result;
	// }
	let smallStr = (milliSecond / 1000).toFixed(2);
	if (smallStr[0] === '1') {
		if (second !== 59) {
			second++;
		} else {
			second = 0;
			if (minute !== 59) {
				minute++;
			} else {
				minute = 0;
				hour++;
			}
		}
	}
	smallStr = smallStr.substring(1);
	if (minute > 0 || hour > 0) {
		result = '' + Math.floor(second).toString() + '秒' + result;
	} else {
		result = '' + (Math.floor(second).toString() + smallStr) + '秒' + result;
	}
	if (hour > 0) {
		result = '' + Math.floor(minute) + '分' + result;
	} else {
		if (minute > 0) {
			result = '' + Math.floor(minute) + '分' + result;
		}
	}
	if (hour > 0) {
		result = '' + Math.floor(hour) + '时' + result;
	}
	return result;
}

export { Pagination } from 'pagination';
