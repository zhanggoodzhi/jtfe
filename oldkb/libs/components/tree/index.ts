import "script-loader!jstree";
import * as utils from "utils";
// import 'jstree/dist/themes/default/style.css';
import "./index.less";

interface ITreeOptions {
	/**
	 * 树元素
	 *
	 * @type {JQuery}
	 * @memberOf ITreeOptions
	 */
	el: JQuery;
	/**
	 * 包裹loading元素的父级,该元素会被完全覆盖,在laoding时无法点击
	 *
	 * @type {JQuery}
	 * @memberOf ITreeOptions
	 */
	loadingWrap?: JQuery;
	/**
	 * 在loading时被模糊的元素,不能和wrap为同一个元素,因为loading图标也会被模糊
	 *
	 * @type {JQuery}
	 * @memberOf ITreeOptions
	 */
	blur?: JQuery;
	/**
	 * jstree原生options
	 *
	 * @type {Object}
	 * @memberOf ITreeOptions
	 */
	jstree?: Object;
	/**
	 * 初始化完成的回调
	 *
	 * @type {Function}
	 * @memberOf ITreeOptions
	 */
	ready?(this: Tree, e, tree): void;
	/**
	 * jstree的data
	 *
	 * @type {*}
	 * @memberOf ITreeOptions
	 */
	data?: any;
}

/**
 * 通用树类
 *
 * @export
 * @class Tree
 */
export class Tree {
	private options: ITreeOptions;
	constructor(options: ITreeOptions) {
		const defaultOptions = {
			jstree: {}
		};
		this.options = Object.assign(defaultOptions, options);
		this.init();
	}

	private init() {
		const options = this.options;
		options.el.jstree(
			Object.assign(
				{
					core: {
						data: options.data,
						strings: {
							'Loading ...': '加载中 ...'
						},
						animation: 100,
						themes: {
							icons: false
						},
						check_callback: true,
						multiple: false
					}
				}, options.jstree
			))
			.on('ready.jstree', (e, tree) => {
				if (options.ready) {
					options.ready.call(this, e, tree);
				}
			});
	}

	public openFirst() {
		this.tree.open_node(this.data[0]);
	}

	public loading() {
		if (this.options.loadingWrap) {
			return utils.loading(this.options.loadingWrap, this.options.blur);
		}
	}

	get tree(): JSTree {
		return this.options.el.jstree(true);
	}

	get el(): JQuery {
		return this.options.el;
	}

	get data() {
		return this.tree.get_json(null, null, true);
	}

	set data(data) {
		(this.tree as any).settings.core.data = data;
		this.tree.refresh(false, false);
	}
	get selected() {
		const selected = this.tree.get_selected(true);
		if (selected && selected.length === 1) {
			return selected[0];
		} else {
			return selected;
		}
	}

	set selected(ids: boolean | string[] | string | { id: string; text?: string; }) {
		const tree = this.tree;
		tree.deselect_all();
		if (ids) {
			if (typeof ids === 'boolean') {
				const data = this.data;
				if (data && data.length > 0) {
					tree.select_node(data[0].id);
				}
			}
			else {
				tree.select_node(ids);
			}
		}
	}
}


interface ISelectTreeOptions {
	/**
	 * 树元素
	 *
	 * @type {JQuery}
	 * @memberOf ITreeOptions
	 */
	el: JQuery;

	/**
	 * 下拉框未选值时显示的内容
	 *
	 * @type {string}
	 * @memberOf ISelectTreeOptions
	 */
	placeholder: string;
	/**
	 * jstree原生options
	 *
	 * @type {Object}
	 * @memberOf ITreeOptions
	 */
	jstree?: Object;
	/**
	 * 初始化完成的回调
	 *
	 * @type {Function}
	 * @memberOf ITreeOptions
	 */
	ready?(this: SelectTree, e, tree): void;

	/**
	 * onChange事件的回调
	 *
	 * @param {any} selected
	 *
	 * @memberOf ISelectTreeOptions
	 */
	onChange?(selected): void;
	data?: any;
	size?: string;
}

export class SelectTree extends Tree {
	private treeWrap: JQuery;
	private input: JQuery;
	private placeholderStr: string;
	constructor(options: ISelectTreeOptions) {
		const ready = options.ready;
		options.ready = (e, tree) => {
			this.tree.open_all();
			if (ready) {
				ready.call(this, e, tree);
			}
		};
		super(options);
		this.initSelect(options);
	}

	private initSelect(options: ISelectTreeOptions) {
		const el = options.el,
			parent = el.parent(),
			arrow = $('<span class="caret">▼</span>'),
			wrap = $(`<div class='kb-select-wrapper ${options.size ? 'select-' + options.size : ''}'></div>`),
			treeWrap = $(`<div class='kb-tree-wrap z-depth-3'></div>`),
			input = $(`<input readonly class='select-dropdown'value='${options.placeholder}'>`),
			placeholder = $(`<div class='kb-placeholder'>${options.placeholder}</div>`);

		el.addClass('kb-select-tree');

		parent.append(wrap);
		wrap.append(arrow)
			.append(input)
			.append(treeWrap);
		treeWrap.append(placeholder)
			.append(el);

		input.on('click', (e) => {
			this.show();
		});

		input.on('blur', (e) => {
			this.hide();
		});

		el.on('changed.jstree', (e, evtTree) => {
			const selected = evtTree.selected;
			if (selected && selected.length > 0) {
				if (options.onChange) {
					options.onChange(this.selected);
				}
				input.val((this.selected as any).text);
			} else {
				if (options.onChange) {
					options.onChange(null);
				}
				input.val(options.placeholder);
			}
		});

		placeholder.on('click', () => {
			this.tree.deselect_all();
		});

		this.treeWrap = treeWrap;
		this.input = input;
		this.placeholderStr = options.placeholder;
	}

	public show() {
		this.treeWrap.slideDown();
	}

	public clean() {
		this.input.val(this.placeholderStr);
		this.selected = false;
	}

	public hide() {
		this.treeWrap.fadeOut();
	}
}
