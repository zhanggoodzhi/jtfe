import './text.less';
import 'time';
import { emojiData } from 'emoji';
import * as tables from 'new-table';
import * as ntables from 'tables';
import * as utils from 'utils';
import * as resourceUtils from './resourceUtils';
import * as textSideBar from './text-sidebar.pug';
import * as emoji from 'emoji';

let state: any, materialId: any, sideBar: any, textTable: any, $sideBar: any, $p: JQuery, $ctx: JQuery, $saveCtx: JQuery;

declare const kbRestUrl;
declare const appid;
declare const group;
export function initText() {
	utils.tabShown($('#text-link'), (e) => {
		init();
	});
}
function init() {
	$('#text-summary').parent().remove();
	// 初始化侧栏
	initSideBar();
	initQqFace();
	initTable();
}
/**
 * 初始化表格
 */
function initTable() {
	textTable = new tables.Table({
		el: $('#text-table'),
		options: {
			paging: true,
			serverSide: true,
			pageLength: 15,
			ajax: {
				url: `${kbRestUrl}/resource/search/${appid}`,
				method: 'POST',
				dataSrc: data => data.data,
				data: (d: any) => {
					const data = {
						group,
						appid:appid,
						title:$.trim($('#text-search-title').val()),
						page: Math.floor(d.start / d.length) + 1,
						size: d.length,
						type: 'text',
						textType:1
					};
					return utils.cleanObject(data);
				}
			},
			initComplete: initComplete,
			columns: [
				{ data: 'content', width: '70%', title: '文本内容', createdCell: tables.createAddTitle },
				{ data: 'createTime', title: '时间', width: (ntables as any).VARIABLES.width.commonTime, render: utils.renderCommonTime },
				{
					data: 'materialId', title: '操作', render: (id) => {
						return resourceUtils.renderBtn(id, 'text');
					}
				}
			]
		}
	});
}

/**
 * 初始化表情
 */
function initQqFace() {
	$('#face').qqFace({
		id: 'facebox', // 表情盒子的ID
		assign: 'text-ctx', // 空间的id
		path: `${ctx}/images/emoji/`	// 表情存放的路径
	});
}
/**
 * 初始化侧栏
 */
function initSideBar() {
	sideBar = new utils.SideBar({
		id: 'textSideBar',
		title: '新增文本素材',
		content: textSideBar(),
		width: 0.6
	});
	$sideBar = $('#textSideBar');
}
function initComplete() {
	// 查询条件修改刷新表格
	resourceUtils.bindSearchEvent('text', () => {
		textTable.reload();
	});
	// 点击tab刷新表格
	utils.tabShown($('#text-link'), () => {
		textTable.reload();
	},false);
	$ctx = $('#text-ctx');
	$saveCtx = $('.text-save');
	$p = $('.text-ctx2 p');
	// 左侧编辑部分实时预览
	$ctx.on('input', function () {
		const addStr = $(this).val();
		view(addStr);
	});
	// 点击添加素材按钮
	add();
	// 表格中的编辑操作
	edit();
	// 保存功能
	save();
	// 表格中删除
	resourceUtils.bindResourceDeleteEvent('text', () => {
		textTable.reload();
	});
	resourceUtils.triggerAddEvent();
}
// 解析表情并实现预览
function view(str) {
	// const emojiData = getEmoji();
	str = str.replace(/\</g, '&lt;');
	str = str.replace(/\>/g, '&gt;');
	str = str.replace(/\n/g, '<br/>');
	// 把str中的文字用数字代替
	str = str.replace(/\[.+?\]/g, function (match) {
		let result;
		let title = match;
		title = title.replace('[', '');
		title = title.replace(']', '');
		emojiData.map(function (v, i) {
			if (match === v.phrase) {
				result = `<img src="${ctx}/images/emoji/${v.url}" border="0" title=${title}/>`;
			}
		});
		return result;
	});
	$p.html(str);
}
// 点击表格中的添加
function add() {
	$('#text-add-btn').on('click', () => {
		state = 'create';
		clearForm();
		// $sideBar.find('.sidebar-title').text('添加文本素材');
		sideBar.updateTitle('添加文本素材');
		sideBar.show();
	});
}
// 点击表格中的编辑
function edit() {
	$('#text-table').on('click', '.view-edit', function () {
		state = 'update';
		const el = $(this);
		const data = textTable.dt.row(el.closest('tr')).data();
		materialId = data.materialId;
		// 填充编辑
		const tCtx = data.content;
		$ctx.val(tCtx);
		$p.text(tCtx);
		view(tCtx);
		// $sideBar.find('.sidebar-title').text('编辑文本素材');
		sideBar.updateTitle('编辑文本素材');
		sideBar.show();
	});
}
// 点击保存按钮，保存功能
function save() {
	$saveCtx.on('click', () => {
		const endLoading = utils.loadingBtn($('.link-save'));
		const ctx = $.trim($ctx.val());
		if (ctx === '') {
			utils.alertMessage('文本素材的内容不能为空！');
			endLoading();
			return;
		} else if (ctx.length > 600) {
			utils.alertMessage('文本素材的内容不能大于600字符！');
			endLoading();
			return;
		}
		// 添加新建
		if (state === 'create') {
			resourceUtils.resourceCreateAjax({
				type:'text',
				textType:1,
				group:group,
				nonShared:{
					content: ctx
				}
			}, (msg) => {
				textTable.reload();
				sideBar.hide();
				endLoading();
				utils.alertMessage(msg.msg, true);
			});
		} else if (state === 'update') {
			// 编辑
			resourceUtils.resourceUpdateAjax({
				materialId:materialId,
				type:'text',
				group:group,
				nonShared:{
					content: ctx
				}
			}, (msg) => {
				textTable.reload();
				sideBar.hide();
				endLoading();
				utils.alertMessage(msg.msg, true);
			});
		}
	});
}
// 清空表单的函数
function clearForm() {
	$ctx.val('');
	$p.text('');
	$ctx.removeClass('invalid');
}


