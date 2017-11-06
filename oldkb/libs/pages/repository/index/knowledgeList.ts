import * as tables from "tables";
import * as utils from "utils";
import {Tree} from "tree";
import "select";
import "./knowledgeList.less";
import {KbRightHot} from "kbdetail";
declare let alldirectory: any;
declare let templates: any;
declare let labels: any;
let currentId = null, jstree, indexTable;
let kbDetail: any;
let kbEdit: any;
let selectTree: any;
let labelId: any = null;
export function initKnowledgeList(d, e) {
	kbDetail = d;
	kbEdit = e;
	initData();
	initRightSide();
};
function initData() {
	initJsTree();
	initTable();
}
// function initSelectTree() {
// 	selectTree = new SelectTree({
// 		el: $('#index-select-tree'),
// 		placeholder: '选择模板',
// 		size: 'small',
// 		data: formatTreeObj(templates),
// 		onChange: (selected) => {
// 			$('#index-select-tree').data('value', selected ? selected.id : '');
// 			$('#index-select-tree').trigger('change');
// 		}
// 	});
// }
function initRightSide() {
	new KbRightHot({
		el: $('#right-side'),
		clickHotKnowledge: (el) => {
			kbDetail.init(utils.getDetailParams(el));
		},
		clickHotLabel: (el) => {
			labelId = el.data('id');
			clearSearchParam();
			indexTable.reload();
			labelId = null;
		}
	});
}
function clearSearchParam() {
	$('.kb-header-search input').val(null);
	$('#template-select').val('');
	utils.initSelect();
	indexTable.dt.columns().search('');
}
function initJsTree() {
	jstree = new Tree({
		el: $('#index-jstree'),
		data: {
			method: 'GET',
			url: '/api/repository/directorystatus',
			data: (node) => {
				return node.id === '#' ? undefined : { directoryId: node.id };
			},
			dataFilter: formatTreeStr
		},
		jstree: {
			plugins: ['dnd', 'types', 'search'],
			types: {
				'#': {
					max_children: 1
				}
			}
		},
		ready: function () {
			this.openFirst();
		}
	}).tree;
	$('#index-jstree').on('changed.jstree', function (e, data) {
		jstreeClick(data.node);
	});
}

function formatTreeStr(str) {
	const data = JSON.parse(str);

	return JSON.stringify(formatTreeObj(data));
}
function formatTreeObj(obj) {
	const finalData = obj.map((v) => {
		return {
			id: !v.directoryId ? '#' : v.directoryId.toString(),
			text: !v.directoryName ? '没名字' : v.directoryName,
			parent: !v.parentDirectoryId ? '#' : v.parentDirectoryId.toString(),
			children: v.isHasChild ? true : false,
			a_attr: {
				class: v.isHasKnowledgeUpdate ? 'new' : null,
				'data-number': v.isHasKnowledgeUpdate ? v.knowledgeCount : null
			}
		};
	});
	return finalData;
}
function jstreeClick(node) {
	currentId = jstree.get_selected()[0];
	fillCrumb();
	indexTable.reload();
}
function fillCrumb() {// 填充面包屑
	let crumb = '' as any;
	let node = jstree.get_node(currentId);
	while (node) {
		crumb = crumb.split('/');
		crumb.splice(0, 0, node.text);
		crumb = crumb.join('/');
		node = jstree.get_node(node.parent);
	}
	crumb = crumb.substring(0, crumb.length - 1);
	$('.zz-detail .menu-title').html('知识类别' + crumb);
}

function bindEvent() {
	$('#add-btn').on('click', 'li', function () {
		const templateId = $(this).find('a').attr('data-id');
		kbEdit.showAdd(templateId);
	});
	$('#return').on('click', () => {
		let node = jstree.get_node(currentId);
		const parent = node.parent;
		jstree.deselect_all(true);
		jstree.select_node(parent);
		jstreeClick(parent);
	});
	$('.middle-line').on('drag', function () {

	});
}
function initTable() {
	const tableEl = $('#key-table');
	// detail.updateHeader([updateBtn, fileBtn]);
	utils.parseInputTime('2015-07-12~2017-06-15');
	const options = templates.map((v) => {
		return `<option value="${v.id}">${v.name}</option>`;
	});
	indexTable = new tables.Table({
		el: tableEl,
		headerSearch: ['title', {
			name: 'directoryName',
			el: $(`<select class="select-small" id="template-select">${options.join('')}</select>`)
		}, 'author', {
				name: 'time',
				type: 'time'
			}],
		options: {
			serverSide: true,
			ajax: {
				url: '/api/repository/folderlist',
				method: 'GET',
				data: (d: any) => {
					const columns = d.columns;
					const date = columns[3].search.value;
					let startDay = null;
					let endDay = null;
					if (date !== '') {
						startDay = JSON.parse(date).start;
						endDay = JSON.parse(date).end;
					}
					const data = tables.extendsData(d, {
						keyword: columns[0].search.value,
						templateId: columns[1].search.value,
						author: columns[2].search.value,
						labelId: labelId,
						startDay: startDay,
						endDay: endDay,
						status: 3,
						directoryId: currentId
					});
					return data;
				}
			},
			columns: [
				{ name: 'title', data: 'knowledgeName', title: '标题', width: '20%', createdCell: renderNewCell, className: 'prevent', render: utils.renderLink },
				{ name: 'directoryName', data: 'directoryName', title: '模板', width: '20%', createdCell: utils.createAddTitle },
				{ name: 'author', data: 'author', title: '作者' },
				{ name: 'time', data: 'updateAt', title: '更新时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				// { data: 'knowledgeId', title: '操作', className: 'prevent', render: utils.renderCheckBtn, width: '10%' }
			]
		},
		initComplete: function (dt) {
			utils.tabShown($('#knowledgeList-btn'), () => {
				this.reload();
			}, false);
			utils.initSelect();
			$('#template-select').siblings('ul.select-dropdown').css('overflow', 'initial');
			// initSelectTree();
			bindEvent();
			// let detail = new KbDetail({
			// 	modifyFn: () => {
			// 		detail.hide();
			// 		changeToEdit('modify');
			// 	},
			// 	updateFn: () => {
			// 		detail.hide();
			// 		changeToEdit('update');
			// 	},
			// 	hideFn: (data) => {
			// 		knowledgeDetail = data;
			// 	},
			// 	btnSuccess: () => {
			// 		indexTable.reload();
			// 	}
			// });
			tableEl.on('click', '.view-detail', function (e) {
				kbDetail.table = indexTable;
				kbDetail.init(utils.getDetailParams($(this)));
			});
			// $('.view-detail').eq(0).click();
		}
	});
}
function renderNewCell(cell, cellData, rowData) {
	$(cell).attr('title', cellData);
	$(cell).addClass('pad-left');
	if (rowData.new) {
		$(cell).addClass('red-dot');
	}
}

