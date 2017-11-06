import 'script-loader!mark.js/jquery.mark.min.js';
import 'script-loader!DataTables/datatables.min.js';
import 'DataTables/DataTables-1.10.15/css/dataTables.bootstrap.css';
import '../tables/index.less';
import './index.less';


import * as utils from 'utils';

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

/**
 * 为表单元格的超长文本(省略)添加title属性
 *
 * @param {any} cell
 * @param {any} cellData
 */
export const createAddTitle = (cell, cellData) => {
	$(cell).attr('title', cellData);
};

/**
 * 表格的多选按钮，在column属性的第一行加上
 * @export
 * column里面的data属性
 * @param {string} data
 * @returns
 */
export function getCheckboxColumnObj(data) {
	const renderCheckTitle = function () {
		return '<input class="checkAll" style="vertical-align:-2px" type="checkbox" /> 全选';
	};
	const renderCheckBox = function (id) {
		return `<input type="checkbox" name="checklist" value="${id}"/>`;
	};
	return {
		data: data,
		title: renderCheckTitle,
		width: '10%',
		render: renderCheckBox
	};
}
/**
 * 绑定全选事件
 *
 * @export
 * table元素
 * @param {JQuery} el
 */
export function bindCheckBoxEvent(el: JQuery) {
	const container = el.closest('.dataTables_wrapper');
	const checkAllEl = container.find('.checkAll');
	checkAllEl.on('change', function (e) {
		const val = !!$(e.currentTarget).prop('checked');
		container.find('input[name=checklist]').prop('checked', val);
	});
	// const bodyEl = container.find('.dataTables_scrollBody');
	// console.log(bodyEl);
	el.on('change', 'input[name=checklist]', function () {
		let ifAllSelect = true;
		for (let checkbox of el.find('input[name=checklist]:visible').toArray()) {
			if (!$(checkbox).prop('checked')) {
				ifAllSelect = false;
				break;
			}
		}
		// bodyEl.find('input[name=checklist]').each((i, e) => {
		//     if ($(e).prop('checked') === false) {
		//         ifAllSelect = false;
		//     }
		// });
		checkAllEl.prop('checked', ifAllSelect);

	});
}

/**
 * 获取表格checkbox的所有id
 *
 * @export
 * 表格元素
 * @param {JQuery} el
 */
export function getCheckboxIds(el: JQuery) {
	const ids = [];
	el.find('input[type=checkbox]:checked').each((i, e) => {
		ids.push($(e).val());
	});
	return ids;
}

export function getCheckboxRowsData(el: JQuery) {
	const dataArr = [];
	el.find('input[type=checkbox]:checked').each((i, e) => {
		const data = el.DataTable().row($(e).closest('tr')).data();
		dataArr.push(data);
	});
	return dataArr;
}


interface ITableOptions {
	el: JQuery;
	options?: DataTables.Settings;
	/**
	 * checkbox样式的选中效果
	 *
	 * @type {{
	 * 		data: string; 对应cloumns.data
	 * 		title?: string; 对应cloumns.title
	 * 	}}
	 * @memberof ITableOptions
	 */
	checkbox?: {
		data: string;
		title?: string;
		defaultChecked?: boolean;
	};
}

interface ICheckLength {
    /**
     * 要做的操作的名称
     *
     * @type {string}
     * @memberOf ICheckLength
     */
	action?: string;
    /**
     * 要做的操作的目标的名称
     *
     * @type {string}
     * @memberOf ICheckLength
     */
	name?: string;
    /**
     * 是否单选
     *
     * @type {boolean}
     * @memberOf ICheckLength
     */
	single?: boolean;
    /**
     * 回调
     *
     * @type {Function}
     * @memberOf ICheckLength
     */
	cb: Function;
}


export class Table {
	static childRowClassName = 'cloud-child-row';
	private _options: ITableOptions;
	private _dt: DataTables.Api;
	private _init: boolean = false;
	private _initCbs: Function[] = [];
	private _checkbox: boolean;
	constructor(options: ITableOptions) {
		this._options = options;
		this.init();
	}

	private init() {
		const op = this._options,
			_options = {
				scrollY: this.getScrollY(),
				select: {
					style: 'os',
					blurable: false,
					info: false,
					selector: 'tr td:not(.prevent)'
				}
			};
		this._checkbox = !!(op.checkbox && op.options.columns);

		if (op.options && op.options.hasOwnProperty('select')) {
			if (typeof op.options.select === 'object') {
				Object.assign(_options.select, op.options.select);
				delete op.options.select;
			} else if (this._checkbox) {
				delete op.options.select;
			}
		}

		if (this._checkbox) {

			Object.assign(_options.select, {
				selector: 'td:first-child' // 使用checkbox不再是点行选中
			});
			if (_options.select.style === 'os') {
				_options.select.style = 'multi+shift'; // 修改默认多选形式为multi+shift
			}

			this.initCheckbox(_options.select.style);
		}

		op.el.on('init.dt', (...args) => {
			this._init = true;
			if (this._initCbs.length > 0) {
				this._initCbs.forEach(cb => {
					cb(...args);
				});
			}
		})
			.on('select.dt', (e, dt, type, indexes) => {
				if (type === 'row' && indexes.length > 0) {
					Array.prototype.forEach.call(dt.rows(indexes).nodes(), tr => {
						this.getChildren($(tr)).addClass('selected');
					});
				}
			})
			.on('deselect.dt', (e, dt, type, indexes) => {
				if (type === 'row' && indexes.length > 0) {
					Array.prototype.forEach.call(dt.rows(indexes).nodes(), tr => {
						this.getChildren($(tr)).removeClass('selected');
					});
				}
			});





		this._dt = op.el.DataTable(Object.assign(_options, op.options));
	}

	private initCheckbox(style: string) {
		const sellectAllClassName = 'selected-all',
			checkSelect = utils.debounce(() => {
				const selectHeader = $(this.settings.nTableWrapper).find('thead .cloud-table-checkbox:visible'),
					selectAll = this._dt.rows()[0].length === this._dt.rows({ selected: true })[0].length;

				if (selectAll) {
					selectHeader.addClass(sellectAllClassName);
				}
				else {
					selectHeader.removeClass(sellectAllClassName);
				}
			}, 200);
		const single = style === 'single';
		this._options.options.columns.unshift(Object.assign({
			title: single ? '' : '<i class="fa fa-fw"></i>',
			data: 'id',
			render: (args) => {
				return '<i class="fa fa-fw" > </i>';
			},
			orderable: false,
			width: '20px',
			className: 'cloud-table-checkbox'
		}, this._options.checkbox));

		if (!single) {
			this._initCbs.push(
				(e, settings) => {
					const wrapper = $(settings.nTableWrapper);
					wrapper.on('click', 'thead .cloud-table-checkbox', (ce) => {
						const el = $(ce.currentTarget);

						if (el.hasClass(sellectAllClassName)) {
							this._dt.rows().deselect();
							el.removeClass(sellectAllClassName);
						} else {
							this._dt.rows().select();
							el.addClass(sellectAllClassName);
						}
					});

					this._options.el.on('draw.dt', () => {
						if (this._options.checkbox.defaultChecked) {// 默认选择当前页
							wrapper.find('thead .cloud-table-checkbox:visible').addClass(sellectAllClassName);
							this._dt.rows().select();
						} else {
							wrapper.find('thead .cloud-table-checkbox:visible').removeClass(sellectAllClassName);
						}
					});

					this._options.el.on('deselect.dt', checkSelect);

					this._options.el.on('select.dt', checkSelect);
				}
			);
		}
	}


	private getScrollY() {
		const op = this._options;
		if (op.options && op.options.hasOwnProperty('scrollY')) {
			return op.options.scrollY;
		}

		const height = utils.getFullHeight(op.el),
			tableOtherHeight = 52 + 44;
		console.log(height);
		return height - tableOtherHeight;
	}

	// 重置scrollY 初始化之后高度与初始化之前不同
	public resetScrollY = () => {
		const scrollBody = $(this._dt.tables().containers()).find('.dataTables_scrollBody'),
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

	// 从服务端刷新数据
	public reload(reset: boolean = false, cb?: Function) {
		const dt = this.dt,
			jqXhr: JQueryXHR = this.settings.jqXHR;
		if (jqXhr) {
			jqXhr.abort();
		}
		dt.ajax.reload(cb, reset);
	}
	// 从本地刷新数据
	public refresh(data: any[]) {
		const dt = this.dt;
		dt.rows().remove();
		dt.rows.add(data);
		dt.draw();
	}

	public adjustHeader() {
		this._dt.columns.adjust();
	}

	public scroll2Top() {
		const scrollBody = this.settings.nScrollBody;
		if (scrollBody) {
			const $s = $(scrollBody);
			$s.animate({
				scrollTop: 0
			});
		}
	}

	public scroll2Btoom() {
		const scrollBody: HTMLElement = this.settings.nScrollBody;
		if (scrollBody) {
			const $s = $(scrollBody);
			$s.animate({
				scrollTop: scrollBody.scrollHeight
			});
		}
	}

	public hasChild(tr: JQuery, group?: string) {
		const data = tr.data('child');

		if (!group) {
			return !!data;
		}

		return data && data[group];
	}

	public isShownChild(tr: JQuery, group: string) {
		return this.hasChild(tr, group) && this.getChildren(tr, group).first().is(':visible');
	}

	public addChildRows(tr: JQuery, data: { [key: string]: string }[], group: string) {
		if (this.hasChild(tr, group)) {
			this.showChildRows(tr, group);
			return;
		}

		if (!tr.data('child')) {
			tr.data('child', {});
		}

		const len = this._dt.columns().indexes().length;

		let html = '';

		data.forEach(v => {
			html += `<tr class="${Table.childRowClassName} ${tr.hasClass('selected') ? 'selected' : ''}">`;

			if (v.hasOwnProperty('_all')) {
				html += `<td colspan="${len}" class="child-row-all">${v._all}</td>`;
			} else {
				this._options.options.columns.forEach(colunm => {
					const d = v[colunm.name];
					html += `<td>${(d === undefined || d === null) ? '' : d}</td>`;
				});
			}
			html += '</tr>';
		});

		const trs = $(html);

		tr.after(trs);

		tr.data('child')[group] = trs;

		this.adjustHeader();
	}

	public getChildren(tr: JQuery, group?: string) {
		const child = tr.data('child');

		if (!child) {
			return $();
		}
		else if (!group) {
			return $().add(...Object.keys(child).map(v => child[v]));
		}
		else if (!child[group] || !this.hasChild(tr, group)) {
			return $();
		}

		return child[group];
	}

	public showChildRows(tr: JQuery, group?: string) {
		this.getChildren(tr, group).show();
		this.adjustHeader();
	}

	public hideChildRows(tr: JQuery, group?: string) {
		this.getChildren(tr, group).hide();
		this.adjustHeader();
	}


	public checkLength = (options: ICheckLength) => {
		const config: ICheckLength = Object.assign({
			action: '删除',
			name: '语料',
			single: true
		}, options),
			datas = this.selected,
			len = datas.length;
		if (len < 1) {
			utils.alertMessage(`请选择要${config.action}的${config.name}`);
		}
		else {
			if (config.single) {
				if (len > 1) {
					utils.alertMessage(`只能${config.action}一条${config.name}`);
				}
				else {
					config.cb(datas[0]);
				}
			}
			else {
				config.cb(datas);
			}
		}
	}

	get table() {
		return this._options.el;
	}

	get dt() {
		return this._dt;
	}

	get selected() {
		return this._dt.rows({ selected: true }).data().toArray();
	}

	get isInit() {
		return this._init;
	}

	get settings() {
		return this._dt.settings()[0];
	}
}


export const adjustTable = utils.debounce((table?: JQuery) => {
	if (table && $.fn.dataTable.isDataTable(table)) {
		table.DataTable().columns.adjust();
	} else {
		$.fn.dataTable
			.tables({ visible: true, api: true })
			.columns.adjust();
	}
}, 100);

/**
 * datatable开始后端分页后获取正确的当前页
 *
 * @param {any} data    dataSrc传入的对象
 * @returns {number}
 */
export const getPage = (data): number => {
	return Math.floor((data.start + data.length) / data.length);
};

(function ($) {
	if (window.cloudTableInit || !$ || !$.fn.DataTable) {
		return;
	}

	const config = {
		processing: true, // 加载提示
		searching: false, // 搜索栏
		ordering: false, // 排序
		lengthChange: false, // 页面显示栏数修改
		paging: false, // 分页
		autoWidth: false,
		info: true,
		scrollCollapse: false,
		pagingType: 'simple_numbers',
		pageLength: parseInt($('#page-change').val()) || 20,
		columnDefs: [
			{
				targets: '_all',
				orderSequence: ['desc', 'asc'],
				className: 'force-width'
			}
		],
		language: {
			emptyTable: '没有检索到数据',
			info: ' 第 _START_ 到 _END_ 条数据，总计 _TOTAL_ 条数据',
			infoEmpty: '',
			infoFiltered: '',
			lengthMenu: '每页显示 _MENU_ 条数据',
			loadingRecords: '加载中...',
			processing: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
			search: '查找:',
			zeroRecords: '',
			paginate: {
				first: '首页',
				previous: '上页',
				next: '下页',
				last: '尾页'
			}
		}
	};

	$.fn.dataTable.ext.errMode = 'throw';

	$.extend(true, $.fn.dataTable.defaults, config);

	$(document)
		.on('processing.dt', 'table', (e, settings, processing) => {
			const scrollBody = $(settings.nScrollBody);
			if (processing) {
				if (!scrollBody.hasClass('table-blur')) {
					scrollBody.addClass('table-blur');
				}
			}
			else {
				scrollBody.removeClass('table-blur');
			}
		})
		.on('draw.dt', 'table', (e, settings) => {
			const $table = $(e.currentTarget),
				table = $table.DataTable(),
				tableRows = table.rows()[0],
				tableBody = $(table.tables().body()),
				tableContainer = $(table.tables().containers()),
				searchForm = tableContainer.prev(),
				keywordInput = searchForm.find('input[type="text"]:not(.cloud-date)'),
				keywords: string[] = [];
			if (tableRows.length > 0 && keywordInput.length > 0) {
				Array.prototype.forEach.call(keywordInput, v => {
					const val = $(v).val().trim();
					if (val !== '') {
						if (keywords.length < 1 || keywords.indexOf(val) < 0) {
							keywords.push(val);
						}
					}
				});
				if (keywords.length > 0) {
					tableBody.mark(keywords, {
						exclude: ['button', '.prevent']
					});
				}
			}

			if (!$table.hasClass('no-scroll')) {
				$(settings.nScrollBody).scrollTop(0);
			}
		})
		.on('error.dt', (e, settings, techNote, message) => {
			utils.alertMessage(`获取表格数据出现异常: ${message}`);
		});


	$(window).resize(() => adjustTable);

	$('#menu_toggle').on('click', () => {
		setTimeout(() => adjustTable, 0);
	});

	const tabsItem = $('.nav-tabs [data-toggle="tab"]');
	// 必须要有tabs元素
	if (tabsItem.length > 0) {
		Array.prototype.forEach.call(tabsItem, (v) => {
			const tabLink = $(v),
				tabContent = $(tabLink.attr('href')),
				table = tabContent.find('.table');
			// 该页的tabscontent中必须要有表格元素
			if (table.length > 0) {
				tabLink.on('shown.bs.tab', () => {
					adjustTable(table);
				});
			}
		});
	}

	window.cloudTableInit = true;
}(jQuery));

