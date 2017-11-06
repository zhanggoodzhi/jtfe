import './index.less';
import * as utils from 'utils';
import 'script-loader!mark.js/jquery.mark.min.js';

/**
 *
 * 创建DataTable setting select对象 ,防止单个页面存在多个表格时引用类型被修改
 * @param {string} [style="os"]
 * @returns
 */
const select = (style: string = 'os') => {
	return {
		style: style,
		blurable: false,
		info: false,
		selector: 'tr td:not(.prevent)'
	};
};

// 统一一些组件的宽高
export const VARIABLES = {
	width: {
		char: 15,
		simpleTime: 70,
		commonTime: 128,
		button: 58,
		minimum: 40,
		icon: 12
	}
};



/**
 * 重置表头
 *
 * @param {JQuery} [el=$('.table')]
 */


export const adjustTable = (tableElement: JQuery = $('.table')) => {
	Array.prototype.forEach.call(tableElement, (v: HTMLElement) => {
		const el = $(v);
		// 必须是dataTables且不在隐藏状态
		if ($.fn.dataTable.isDataTable(v) && v.offsetHeight > 0) {
			const table = el.DataTable(),
				settings = table.settings()[0];
			// 必须初始化完成并且有滚动的头部元素即scrollY有值
			if (settings && settings.nScrollHead) {
				const scrollHead = $(settings.nScrollHead),
					scrollHeadInner = scrollHead.find('.dataTables_scrollHeadInner');
				// 必须两个宽度不等
				if (scrollHead.width() !== scrollHeadInner.width()) {
					table.columns.adjust();
				}
			}
		}
	});
};


/**
 * 绑定window的resize事件和切换视图,调整表头宽度
 */
const resizeAdjustTable = () => {
	$(window).resize(utils.triggerOnceWithinDelay(adjustTable, 100));

	$(() => {
		$('#menu_toggle').on('click', () => {
			setTimeout(adjustTable, 0);
		});
	});
};

/**
 * 绑定有tabs页面切换时调整表头宽度
 */
const tabsShownAdjustTable = () => {
	const tabsItem = $('.nav-tabs [data-toggle="tab"]');
	// 必须要有tabs元素
	if (tabsItem.length > 0) {
		Array.prototype.forEach.call(tabsItem, (v) => {
			const tabEl = $(v),
				tabContentEl = $(tabEl.attr('href')),
				tableElement = tabContentEl.find('.table');
			// 该页的tabscontent中必须要有表格元素
			if (tableElement.length > 0) {
				tabEl.on('shown.bs.tab', utils.triggerOnceWithinDelay(() => {
					adjustTable(tableElement);
				}, 100));
			}
		});
	}
};


/**
 * 绑定dataTables事件
 */
const bindTableEvent = () => {
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
			const table = $(e.currentTarget).DataTable(),
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
			$(settings.nScrollBody).scrollTop(0);
		})
		.on('error.dt', (e, settings, techNote, message) => {
			utils.alertMessage(`获取表格数据出现异常: ${message}`);
		});
};


/**
 * 绑定分页change事件,作刷新操作
 *
 * @param {DataTables.Api} table
 * @param {JQuery} el
 */
export const bindPageChange = (table: DataTables.Api, el: JQuery = $('#page-change')) => {
	el.on('change', function () {
		table.page.len(el.val()).draw(false);
	});
};


export const bindEnter = (table: DataTables.Api, el: JQuery = $('#keyword'), selector?: string) => {
	utils.bindEnter(el, () => {
		table.ajax.reload().draw(true);
	}, selector);
};

/**
 * 阻止ie ctrl+左键
 */
const preventIESelect = (): void => {
	$(document).on('mousedown', '.table', (e) => {
		if (e.ctrlKey && e.which === 1) {
			e.preventDefault();
			return false;
		}
	});
};


/**
 * 获取全屏时Datatables中对应的scrollY的高度
 *
 * @param {JQuery} [searchElement=$(".cloud-search-area")]  查询表单元素
 * @returns {string}
 */
export const getTableHeight = (searchElement: JQuery = $('.cloud-search-area')): any => {
	const colHeight = utils.getMinContentHeight(),
		searchHeight = searchElement.height(),
		panelPdMg = 11 + 11,
		conentPdMg = 5 + 6,
		tablePaginateHeight = 27,
		tableHeadHeight = 51,
		height = colHeight - searchHeight - panelPdMg - conentPdMg - tableHeadHeight - tablePaginateHeight - 1;
	return height;
};


export const getTabsTableHeight = (searchElement: JQuery): any => {
	const tabContentPdMg = 16,
		tabsHeight = 40;
	return getTableHeight(searchElement) - tabContentPdMg - tabsHeight - 8;
};


/**
 * datatable开始后端分页后获取正确的当前页
 *
 * @param {any} data    dataSrc传入的对象
 * @returns {number}
 */
export const getPage = (data): number => {
	return Math.floor((data.start + data.length) / data.length);
};


/*const bindEnter = (el: JQuery, cb: Function, selector?: string): void => {
    utils.bindEnter(el, cb, selector);
};*/


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
 * 建议配置,常用于非主页的小表格
 *
 * @param {string} [style]
 * @returns
 */
export const simpleConfig = (style?: string): any => {
	return {
		select: select(style),
		serverSide: true,
		paging: true,
		scrollY: 280,
		scrollCollapse: true
	};
};

/**
 * 常用配置,常用语主页的整页表格
 *
 * @param {string} [style]
 * @returns
 */
export const commonConfig = (style?: string): any => {
	return {
		scrollY: getTableHeight(),
		serverSide: true,
		paging: true,
		select: select(style)
	};
};

export function renderEditAndDeleteIcon(id) {
	return '<i class="fa fa-edit view-edit"></i><i class="fa fa-trash view-delete"></i>';
}

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
		for (let checkbox of el.find('input[name=checklist]').toArray()) {
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

/**
 * 获取选中的row的数据
 *
 * @param {DataTables.Api} table
 * @returns {Array<any>}
 */
export const getSelected = (table: DataTables.Api): Array<any> => table.rows({ selected: true }).data().toArray();


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
	unique?: boolean;
    /**
     * 表格元素
     *
     * @type {DataTables.Api}
     * @memberOf ICheckLength
     */
	table: DataTables.Api;
    /**
     * 回调
     *
     * @type {Function}
     * @memberOf ICheckLength
     */
	cb: Function;
}

/**
 * 检查选中的行的数量
 *
 * @param {ICheckLength} options
 */
export const checkLength = (options: ICheckLength) => {

	const config: ICheckLength = Object.assign({
		action: '删除',
		name: '语料',
		unique: true
	}, options),
		rows = config.table.rows({ selected: true }),
		row = config.table.row({ selected: true }),
		datas = rows.data().toArray(),
		data = row.data(),
		len = datas.length;
	if (len < 1) {
		utils.alertMessage(`请选择要${config.action}的${config.name}`);
	}
	else {
		if (config.unique) {
			if (len > 1) {
				utils.alertMessage(`只能${config.action}一条${config.name}`);
			}
			else {
				config.cb(data, row);
			}
		}
		else {
			config.cb(datas, rows);
		}
	}
};


/**
 * 快速创建删除对话框
 *
 * @interface IDelClick
 */
interface IDelClick {
    /**
     *  要绑定的元素
     *
     * @type {JQuery}
     * @memberOf IDelClick
     */
	el: JQuery;
    /**
     * dataTable
     *
     * @type {DataTables.Api}
     * @memberOf IDelClick
     */
    /**
     *
     *
     * @type {DataTables.Api}
     * @memberOf IDelClick
     */
	table: DataTables.Api;
    /**
     * 要做的操作的目标的名称
     *
     * @type {string}
     * @memberOf IDelClick
     */
	name: string;
    /**
     * 接口
     *
     * @type {string}
     * @memberOf IDelClick
     */
	url: string;
    /**
     * 接口方式
     *
     * @type {string}
     * @memberOf IDelClick
     */
	type?: string;
    /**
     * 接口字段名
     *
     * @type {string}
     * @memberOf IDelClick
     */
	param?: string;
    /**
     * 传入数据字段名
     *
     * @type {string}
     * @memberOf IDelClick
     */
	dataParam?: string;
}



/**
 * 为删除按钮绑定删除事件
 *
 * @param {IDelClick} options
 */
export const delBtnClick = (options: IDelClick) => {
	const config: IDelClick = Object.assign({
		type: 'POST',
		param: 'ids',
		dataParam: 'id'
	}, options);
	config.el.on('click', () => {
		checkLength({
			name: config.name,
			action: '删除',
			unique: false,
			table: config.table,
			cb: (data) => {
				utils.confirmModal({
					msg: `确认删除选中的${config.name}吗?`,
					cb: (modal, btn) => {
						const endLoading = utils.loadingBtn(btn);
						const d: any = {};
						d[config.param] = data.map(v => v[config.dataParam]).join(',');
						$.ajax({
							url: config.url,
							type: config.type,
							data: d,
							success: (msg) => {
								if (!msg.error) {
									config.table.ajax.reload(null, false);
									modal.modal('hide');
								}
								utils.alertMessage(msg.msg, !msg.error);
							},
							complete: () => {
								endLoading();
							}
						});
					}
				});
			}
		});
	});
};


export const renderClassify = (id) => {
	const classify = selectData.classify;
	if (!classify || classify.length < 1) {
		return '';
	}
	for (let v of classify) {
		if (id === v.id) {
			return v.name;
		}
	}

	return '';
};


/**
 * 封装云平台表格通用方法
 *
 * @export
 * @class Table
 */
export class Table {
	public table: DataTables.Api;
	constructor(table: DataTables.Api) {
		this.table = table;
	}

    /**
     *
     * @param {boolean} reset 是否要回到第一页
     * @param {boolean} reload 是否要重新获取ajax数据
     * @memberOf Table
     */
	refresh = (reset: boolean = false, reload: boolean = true) => {
		const container = $((this.table as any).table().container());
		const checkAllEl = container.find('.checkAll');
		if (checkAllEl.length) {
			checkAllEl.prop('checked', false);
		}
		const table = this.table;
		if (reload) {
			table.ajax.reload(null, reset);
		} else {
			table.draw(reset);
		}
	}
}


export function getScrollY(table: JQuery) {
	const height = utils.getFullHeight(table),
		tableOtherHeight = 52 + 30;
	return height - tableOtherHeight;
}


/**
 * 初始化默认表格设置
 */
const initConfig = () => {
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
		select: select(),
		columnDefs: [
			{
				orderSequence: ['desc', 'asc'],
				targets: '_all',
				className: 'force-width'
			}
		],
		language: {
			emptyTable: '没有检索到数据',
			info: ' 第 _START_ 到 _END_ 条数据，总计 _TOTAL_ 条数据',
			infoEmpty: '没有检索到数据',
			infoFiltered: '',
			lengthMenu: '每页显示 _MENU_ 条数据',
			loadingRecords: '加载中...',
			processing: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
			search: '查找:',
			zeroRecords: '没有检索到数据',
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

	if (window.cloudTableInit) {
		return;
	}
	resizeAdjustTable();
	tabsShownAdjustTable();
	bindTableEvent();
	preventIESelect();
};

initConfig();

