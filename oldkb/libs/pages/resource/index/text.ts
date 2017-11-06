import 'script-loader!emoji/jquery.qqFace.js';
import 'script-loader!emoji/jquery-browser.js';
// import 'script-loader!emoji/emoji.js';
import * as tables from 'tables';
import * as utils from 'utils';
import * as textLinkRes from './textAddRes.pug';
import 'emoji/qqFace.css';
import './text.less';
import * as emojidata from 'emoji/emotion.json';

let table: any, detail: any, state: any, resourceId: any, materialId: any;
export function initText() {
	utils.tabShown($('#text-link'), (e) => { init(); });
};

function init() {
	$('#text-summary').parent().remove();
	// 初始化侧栏
	detail = new utils.SideDetail({
		title: '添加文本素材',
		html: textLinkRes(),
		menus: [utils.renderSideMenu('保存', 'text-save')]
	});
	$('.input-field textarea').characterCounter();
	// 初始化表情包
	$('#face').qqFace({
		id: 'facebox', // 表情盒子的ID
		assign: 'text-ctx', // 空间的id
		path: '/images/emoji/'	// 表情存放的路径
	});
	const tableEl = $('#text-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true, // 后端分页
			ajax: {
				method: 'GET',
				url: '/resource/list',
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = tables.extendsData(d, utils.getSearchParams('text'));
					const newData = utils.cleanObject(data);
					return newData;
				}
			},
			columns: [
				{ data: 'content', title: '内容', width: '80%', className: 'text-table-ctx' },
				{ data: 'createTime', title: '创建时间', createdCell: utils.createAddTitle, render: utils.renderTime, width: '10%' },
				{ data: 'materialId', title: '操作', className: 'prevent', render: utils.renderEditAndDeleteBtn, width: '10%' }
			]
		},
		initComplete: initComplete
	});
}
function initComplete() {
	const $ctx = $('#text-ctx');
	const $saveCtx = $('.text-save');
	const $p = $('.text-ctx2 p');
	utils.tabShown($('#text-link'), () => {
		this.reload();
	}, false);

	$('#text-search').on('click', () => {
		this.reload();
	});
	$('#text-add').on('click', () => {
		state = 'create';
		clearForm();
		detail.updateTitle('添加文本素材');
		detail.show();
	});
	// 清空表单的函数
	function clearForm() {
		$ctx.val('');
		$p.text('');
		$ctx.removeClass('invalid');;
	}
	detail.element.overlay.on('click', () => {
		detail.hide();
	});
	// $('.text-cancel,.kb-close').on('click', () => {
	// 	detail.hide();
	// });
	// let emojidata;
	// $.getJSON('/modules/emoji/emotion.json', function (data) {
	// 	emojidata = data.map(function (v, i) {
	// 		return {
	// 			id: v.id,
	// 			phrase: v.phrase,
	// 			url: v.url
	// 		};
	// 	});
	// 	// console.log(11,emojidata);
	// });
	// 预览表情
	function view(str) {
		// debugger
		str = str.replace(/\</g, '&lt;');
		str = str.replace(/\>/g, '&gt;');
		str = str.replace(/\n/g, '<br/>');
		// 把str中的文字用数字代替
		str = str.replace(/\[.+?\]/g, function (match) {
			let result;
			let title = match;
			title = title.replace('[', '');
			title = title.replace(']', '');
			emojidata.map(function (v, i) {
				if (match === v.phrase) {
					result = `<img src="/images/emoji/${v.url}" border="0" title=${title}/>`;
				}
			});
			return result;
		});
		$p.html(str);
	}
	// 添加素材文本实时预览
	/*$('.preview').on('click',function(){
		const addStr=$ctx.val();
		view(addStr);
	});*/
	$ctx.on('input', function () {
		const addStr = $(this).val();
		view(addStr);
		// const inputVal = $(this).val();
		// $p.text(inputVal);
	});
	// 添加素材文本的保存功能
	$saveCtx.on('click', () => {
		let changeArgs: any = {
			ctx: '',
			url: '',
			method: '',
			operation: '',
			materialId: '',
			resourceId: ''
		};
		const ctx = $.trim($ctx.val() as string);
		if (ctx === '') {
			utils.toast('文本素材的内容不能为空！');
			return;
		} else if (ctx.length > 600) {
			utils.toast('文本素材的内容不能大于600字符！');
			return;
		} else {
			changeArgs.ctx = ctx;
		}
		if (state === 'create') {
			changeArgs.url = '/resource/create';
			changeArgs.method = 'POST';
			changeArgs.operation = '添加';
			changeLink(changeArgs);
		} else if (state === 'update') {
			changeArgs.url = '/resource/update';
			changeArgs.method = 'PUT';
			changeArgs.materialId = materialId;
			changeArgs.resourceId = resourceId;
			changeArgs.operation = '修改';
			changeLink(changeArgs);
		}

	});
	// 表格中的编辑和删除操作
	$('#text-table').on('click', '.view-edit', function () {
		state = 'update';
		const el = $(this);
		const data = table.dt.row(el.parents('tr')).data();
		resourceId = data.resourceId;
		materialId = data.materialId;
		// 填充编辑
		const tCtx = data.content;
		$ctx.val(tCtx);
		$p.text(tCtx);
		view(tCtx);
		/*let str = tCtx;
		str = str.replace(/\</g,'&lt;');
		str = str.replace(/\>/g,'&gt;');
		str = str.replace(/\n/g,'<br/>');
		str = str.replace(/\[\/表情([0-9]*)\]/g,'<img src="/images/emoji/$1.gif" border="0" />');
		$p.html(str);*/
		detail.updateTitle('编辑文本素材');
		detail.show();
	});
	utils.bindResourceDeleteEvent('text', () => {
		table.reload();
	});
	function changeLink(changeArgs) {
		utils.ajax({
			url: changeArgs.url,
			method: changeArgs.method,
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				materialId: changeArgs.materialId,
				resourceId: changeArgs.resourceId,
				type: 'text',
				nonShared: {
					content: changeArgs.ctx,
				}
			})
		}, (data) => {
			table.reload();
			detail.hide();
		});
		// $.ajax({
		// 	url: changeArgs.url,
		// 	method: changeArgs.method,
		// 	contentType: 'application/json',
		// 	processData: false,
		// 	data: JSON.stringify({
		// 		materialId: changeArgs.materialId,
		// 		resourceId: changeArgs.resourceId,
		// 		type: 'text',
		// 		nonShared: {
		// 			content: changeArgs.ctx,
		// 		}
		// 	}),
		// 	success: () => {
		// 		utils.toast(`${changeArgs.operation}文本素材成功！`);
		// 		table.reload();
		// 		detail.hide();
		// 	}
		// });
	}
}


