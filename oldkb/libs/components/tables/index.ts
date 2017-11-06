import 'script-loader!DataTables/datatables.min.js';
import * as utils from 'utils';
import './index.less';
// 防止多次初始化
let init: boolean = false;

export function getSelectConfigObject(style: string = 'os') {
	return {
		style: style,
		blurable: false,
		info: false,
		selector: 'tr td:not(.prevent)'
	};
}

// init dataTables's config
(function ($) {
	if (init || !$ || !$.fn.DataTable) {
		return;
	}
	// 默认设置
	const config = {
		processing: true,
		// searching: true,
		ordering: false,
		lengthChange: false,
		paging: true,
		autoWidth: true,
		info: true,
		scrollCollapse: false,
		scrollX: false,
		pagingType: 'simple_numbers',
		pageLength: 20,
		fixedColumns: true,
		select: getSelectConfigObject(),
		columnDefs: [
			{
				orderSequence: ['desc', 'asc'],
				targets: '_all'
			}
		],
		language: {
			emptyTable: '没有检索到数据',
			info: ' 第 _START_ 到 _END_ 条数据，总计 _TOTAL_ 条数据',
			infoEmpty: '没有检索到数据',
			infoFiltered: '',
			lengthMenu: '每页显示 _MENU_ 条数据',
			loadingRecords: '加载中...',
			processing: `<div class='kb-preloader-wrapper'>
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
						</div>`,
			search: '查找:',
			zeroRecords: '没有检索到数据',
			paginate: {
				first: '首页',
				previous: '<i class="material-icons">chevron_left</i>',
				next: '<i class="material-icons">chevron_right</i>',
				last: '尾页'
			}
		}
	};

	$.fn.dataTable.ext.errMode = 'throw';
	$.extend(true, $.fn.dataTable.defaults, config);

	// 修改 loading 动效
	$(document).on('processing.dt', 'table', (e, settings, processing) => {
		const el = $(settings.nTable),
			blurClassName = 'kb-blur';
		if (processing) {
			if (!el.hasClass(blurClassName)) {
				el.addClass(blurClassName);
			}
		} else {
			if (el.hasClass(blurClassName)) {
				el.removeClass(blurClassName);
			}
		}
	})
		.on('draw.dt', 'table', (e, settings) => {
			const dt = $(e.currentTarget).DataTable(),
				tables = dt.tables(),
				body = $(tables.body()),
				bodyScroll = body.parent().parent('.dataTables_scrollBody');
			// 滚动至顶端(一般于翻页后)
			if (bodyScroll.get(0).scrollTop > 0) {
				bodyScroll.animate({ scrollTop: 0 }, {
					duration: 200
				});
			}
		});

	init = true;

}(jQuery));


interface ITableOptions {
	/**
	 * table元素Jquery对象
	 *
	 * @type {JQuery}
	 * @memberOf ITableOptions
	 */
	el: JQuery;

	/**
	 * 表格顶部的分栏搜索
	 * true为所有栏都添加,数组为column的name属性,只在该name栏添加
	 * @type {(boolean | string[])}
	 * @memberOf ITableOptions
	 */
	headerSearch?: boolean | [string | { el?: JQuery; name: string; type?: string; init?(): void; }];
	/**
	 * dataTable的setting对象
	 *
	 * @type {DataTables.Settings}
	 * @memberOf ITableOptions
	 */
	options?: DataTables.Settings & IDatatables;
	/**
	 * InitComplete 的回调,不要写在options中
	 *
	 *
	 * @memberOf ITableOptions
	 */
	initComplete?(this: Table, dt: DataTables.DataTable): void;
}

/**
 * 表格类,封装表格常用方法
 *
 * @export
 * @class Table
 */
export class Table {
	private options: ITableOptions;

	private inited: boolean = false;

	private disabled: boolean = false;

	constructor(options: ITableOptions) {
		this.options = options;
		this.init(options);
	}

	private init(options: ITableOptions) {
		const tableOptions = Object.assign({
			initComplete: this.initComplete,
			searching: options.headerSearch ? true : false,
			scrollY: this.getScrollY(),
			// preDrawCallback: () => {
			// 	this.dt.columns.adjust();
			// }
		}, options.options);
		options.el.DataTable(tableOptions);
	}

	private initComplete = () => {
		const op = this.options,
			dt = this.dt;

		this.initheaderSearch(dt);

		if (op.initComplete) {
			this.options.initComplete.call(this, dt);
		}

		if (!op.options || !op.options.scrollY) {
			// this.resetScrollY();
			utils.triggerOnceWithinDelay($(window), 'resize', this.resetScrollY);
		}

		this.inited = true;
	}

	// 初始化栏搜索
	private initheaderSearch(dt) {
		const op = this.options;

		if (!op.headerSearch) {
			return;
		}

		const tHead = $(dt.tables().header()),
			isArray = Array.isArray(op.headerSearch),
			tr = $('<tr></tr>');
		// 绑定查询事件
		const bindEvt = (el: JQuery, index: number, check?: Function) => {

			/**
			 * 非input只绑定Change事件
			 * 如jstree组件在修改值后应该修改该el.data('value')并主动触发传入的el的change事件
			 * 如select则直接会监听到change事件
			 */

			const evt = el.is('input') ? 'input keyup' : 'change';

			utils.triggerOnceWithinDelay(el, evt, (e: KeyboardEvent) => {
				// 在keyup时过滤掉一些按键
				if (e.type === 'keyup' && e.keyCode && utils.matchKeycode(e.keyCode)) {
					return false;
				}
				// data-value优先级比value高
				const val = (el.data('value') || el.val() || '').toString().trim();


				const column = dt.column(index);
				// 与之前的值不同时
				if (column.search() !== val) {
					let d;
					if (check) {
						// 验证失败
						d = check(val);
						if (!d) {
							return;
						}
					}
					column.search(d || val);
					this.reload(true);
				}
			});
		};

		tHead.addClass('kb-header-search');

		// 为每栏做单独的绑定
		dt.columns().every(index => {
			const column = dt.init().columns[index],
				field = $(`<div class='input-field'></div>`),
				input = $(`<input class='input-small' placeholder='输入${column.title}'>`),
				th = $('<th></th>');

			const inserInput = (check?: Function) => {
				field.append(input);
				bindEvt(input, index, check);
				th.append(field);
			};
			if (isArray) { // 数组时
				const name = column.name;
				if (name !== undefined) {
					for (let item of op.headerSearch as any[]) {
						// 传入为字符串(name属性)即一般的input
						if (typeof item === 'string') {
							if (item === name) {
								inserInput();
								break;
							}
						} else {
							if (item.name === name) {

								if (item.el) {// 传入带有el参数,即自定义元素
									field.append(item.el);
									bindEvt(item.el, index);
									th.append(field);
									if (item.init) {
										item.init();
									}
									break;
								} else if (item.type) {// 传入带有type参数,即一些默认的选项
									switch (item.type) {
										case 'time':
											input.prop('title', '时间格式: xxxx-xx-xx\n在开始处加入<,>或用~连接两个时间\n如:>2017-01-01(2017-01-01及之后)\n<2017-01-01(2017-01-01及之前)\n2017-01-01~2017-02-02(2017-01-01至2017-02-02)\n注意：若月或天为单数，前面的0不能省略');
											inserInput(val => {
												// 将用户输入时间格式化
												const d = utils.parseInputTime(val);
												// search.value只支持字符串
												return d ? JSON.stringify(d) : false;
											});
											break;
										default:
											break;
									}
								}
							}
						}
					}
				}
			} else { // true时
				inserInput();
			}

			tr.append(th);
		});

		tHead.append(tr);
	}

	private getScrollY() {
		const op = this.options,
			height = utils.getFullHeight(op.el),
			tableOtherHeight = (op.headerSearch ? 63 : 52) + (op.el.hasClass('no-header') ? 0 : 44);
		return height - tableOtherHeight;
	}

	// 重置scrollY 初始化之后高度与初始化之前不同
	public resetScrollY = () => {
		const scrollBody = $(this.dt.tables().containers()).find('.dataTables_scrollBody'),
			top = scrollBody.offset().top;
		if (scrollBody.is(':hidden')) {
			return;
		}
		if (top < 0) {
			setTimeout(() => {
				this.resetScrollY();
			}, 100);
			return;
		}


		if (scrollBody.length > 0) {
			const height = utils.getFullHeight(scrollBody) - 44;
			if (scrollBody.height() !== height) {
				scrollBody.css({
					maxHeight: height,
					height: height
				});
			}
		}
	}

	// 主动让表格处于加载状态
	public loading() {
		const dt = this.dt,
			el = $(dt.tables().body()),
			blurClassName = 'kb-blur',
			processing = $(dt.tables().containers()).find('.dataTables_processing');

		el.addClass(blurClassName);
		processing.show();
		return () => {
			el.removeClass(blurClassName);
			processing.hide();
		};
	}

	// 从服务端刷新数据
	public reload(reset: boolean = false, cb?: Function) {
		const dt = this.dt;
		dt.ajax.reload(cb, reset);
	}

	// 从本地刷新数据
	public refresh(data: any[]) {
		const dt = this.dt;
		dt.rows().remove();
		dt.rows.add(data);
		dt.draw();
	}

	public isSingle(): boolean {
		return this.selected.length === 1;
	}

	public isMultiple(): boolean {
		return this.selected.length > 1;
	}

	public isSelected(): boolean {
		return this.selected.length > 0;
	}

	public isInited(): boolean {
		return this.inited;
	}

	public isDisabled(): boolean {
		return this.disabled;
	}

	public enable(): void {
		let style = 'os';
		const op = this.options;
		if (op.options && op.options.select && op.options.select.style) {
			style = op.options.select.style;
		}
		this.dt.select.style(style);
		this.disabled = false;
	}

	public disable(): void {
		this.dt.select.style('api');
		this.disabled = true;
	}

	get dt(): DataTables.DataTable {
		return this.options.el.DataTable();
	}

	get el(): JQuery {
		return this.options.el;
	}

	get selected() {
		return this.dt.rows({ selected: true })[0];
	}

	get selectedData() {
		return this.dt.rows({ selected: true }).data();
	}
}


export function extendsData(tableData, ...customData) {
	const result = {
		page: Math.floor(tableData.start / tableData.length) + 1,
		size: tableData.length
	};
	if (customData) {
		Object.assign(result, ...customData);
	}
	return result;
}
