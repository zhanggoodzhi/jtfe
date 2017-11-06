import './link.less';
import 'time';
import 'upload';
import { Upload } from 'upload';
import * as tables from 'new-table';
import * as ntables from 'tables';
import * as utils from 'utils';
import * as linkSidebar from './link-sidebar.pug';
import * as resourceUtils from './resourceUtils';
let pushModal: resourceUtils.PushModal;
export function initLink(p: resourceUtils.PushModal) {
	pushModal = p;
	utils.tabShown($('#link-link'), (e) => {
		init();
	});
}
let linkSideBar: any, $linkSideBar: JQuery, linkTable;
let detail: any,
	mediaId: any,
	coverUrl: any,
	state: any,
	cloudId: any,
	toDeleteArr: any = [],
	uploadedArr: any = [],
	saveFlag: any = false,
	$titleInput, $linkInput, $descInput, $upBtn, $cardImage, $titlePreview, $descPreview, $rightSider,
	editCrenditialId;
function init() {
	initSideBar();
	initTable();
	bindPush();
}
function initSideBar() {
	linkSideBar = new utils.SideBar({
		id: 'linkSideBar',
		title: '新增链接素材',
		content: linkSidebar(),
		width: 0.6,
		onHide:()=>{
			hideDel();
		},
		onShow:()=>{
			saveFlag = false;
		}
	});
	$linkSideBar = $('#linkSideBar');
	$titleInput = $('#title');
	$linkInput = $('#link');
	$descInput = $('#desc');
	$upBtn = $('#imgcover');
	// $upBtn.css('background-image',`url(${ctx}/images/upImg.png)`);
	// $coverShow = $('.imgcover img');
	$cardImage = $('.card-image');
	$titlePreview = $('#title-preview');
	$descPreview = $('#desc-preview');
	$rightSider = $('.right-innerBox');
	initUpload();
	validate();

}
function initTable() {
	linkTable = new tables.Table({
		el: $('#link-table'),
		options: {
			paging: true,
			serverSide: true,
			pageLength: 10,
			ajax: {
				url: 'weixinv2/enterprise/outsideChain/list',
				method: 'POST',
				dataSrc: data => data.rows,
				data: (data: any) => {
					return {
						keyword: $.trim($('#link-search-title').val()),
						credentialId: resourceUtils.getAccountId('link'),
						page: Math.floor((data.start + data.length) / data.length),
						size: data.length
					};
				}
			},
			initComplete: initComplete,
			columns: [
				{ data: 'coverUrl', title: '封面图片', render: renderCover },
				{ data: 'title', title: '标题' },
				{ data: 'relatedUrl', title: '链接地址' },
				{ data: 'desc', title: '简介' },
				{ data: 'createTime', title: '创建时间', width: (ntables as any).VARIABLES.width.commonTime, render: utils.renderCommonTime },
				{
					data: 'cloudId', title: '操作', className: 'prevent', render: (id) => {
						return resourceUtils.renderBtn(id, 'link');
					}
				}
			]
		}
	});
}
function bindPush() {
	const flag = $('.specity-flag').val();
	const parse = (data) => {
		return {
			url: 'weixinv2/enterprise/outsideChain/sendAll',
			data: data.map(v => {
				return {
					outsideChainId: v.mediaId,
					agentid: v.agentid,
					credential: v.credential
				};
			})
		};
	};
	// 推送到微信矩阵
	$('#link-table').on('click', '.view-share-all', function () {
		pushModal.show({
			type: 'link',
			mediaId: $(this).data().id,
			single: false,
			refresh: () => {
				linkTable.reload();
			},
			parse: parse
		});
	});
	// 群发
	$('#link-table').on('click', '.view-share', function () {
		pushModal.show({
			type: 'link',
			mediaId: $(this).data().id,
			single: true,
			refresh: () => {
				linkTable.reload();
			},
			parse: parse
		});
	});
}
function initUpload() {
	// 上传图片
	new Upload({
		btn: $upBtn,
		accept: '.jpg,.png',
		url: 'weixinv2/enterprise/outsideChain/actionUpload',
		name: 'file',
		success: (id, name, res) => {
			// 点击上传图片后，上传成功后，要把之前的mediaId放到deleteArr中，
			toDeleteArr.push(mediaId);
			mediaId = res.data.mediaId;
			const upUrl = res.data.url;
			$upBtn.css('background-image', `url(${upUrl})`);
			// 删除图片功能
			uploadedArr.push(mediaId);
			// 预览部分添加封面
			$cardImage.html(`<img src='${upUrl}' width='100%'/>`);
		}
	});
}
function initComplete() {
	// 查询条件修改刷新表格
	resourceUtils.bindSearchEvent('link', () => {
		linkTable.reload();
	});
	// link的tab点击后刷新表格
	utils.tabShown($('#link-link'), () => {
		linkTable.reload();
	}, false);
	// 添加素材，显示侧栏
	$('#link-add-btn').on('click', () => {
		state = 'create';
		$linkSideBar.find('.sidebar-title').text('添加链接素材');
		clearForm();
		$upBtn.css('background-image', `url(${ctx}/images/upImg.png)`);
		linkSideBar.show();
	});

	// 表格中的编辑操作
	bindEdit();
	// 侧栏的保存按钮
	bindSave();
	// 表格中删除
	resourceUtils.bindDeleteEvent('link', () => {
		linkTable.reload();
	});
	/* resourceUtils.bindResourceDeleteEvent('link', () => {
		linkTable.reload();
	}); */
	jump();
}
// 表单校验
function validate() {
	// blur的时候进行校验
	/* $titleInput.on('blur', function () {
		const el = $(this);
		const inputVal = $.trim($(this).val());
		if (inputVal === '') {
			utils.alertMessage('标题不能为空！');
		} else if (inputVal.length > 64) {
			utils.alertMessage('标题不能超过64字符！');
		} else {
			$titlePreview.text(inputVal);
			utils.alertMessage('标题合法！', true);
		}
	}); */
	$titleInput.on('input', function () {
		const inputVal = $.trim($(this).val());
		if (inputVal === '') {
			$titlePreview.text('标题');
		} else {
			$titlePreview.text(inputVal);
		}
	});
	// $linkInput.on('blur', function () {
	// 	const el = $(this);
	// 	const inputVal = $.trim($(this).val());
	// 	if (inputVal === '') {
	// 		utils.alertMessage('链接不能为空！');
	// 	} else if (inputVal.length > 64) {
	// 		utils.alertMessage('链接不能超过64字符！');
	// 	} else if (!/[a-zA-z]+:\/\/[^s]*/.test(inputVal)) {
	// 		utils.alertMessage('链接不合法！');
	// 	} else {
	// 		$rightSider.data('href', inputVal);
	// 		utils.alertMessage('链接合法！', true);
	// 	}
	// });
	/* $descInput.on('blur', function () {
		const el = $(this);
		const inputVal = $.trim($(this).val());
		if (inputVal.length > 120) {
			utils.alertMessage('摘要不能超过120字符！');
		} else {
			$descPreview.text(inputVal);
			utils.alertMessage('摘要合法！', true);
		}
	}); */
	$descInput.on('input', function () {
		const inputVal = $.trim($(this).val());
		if (inputVal === '') {
			$descPreview.text('摘要');
		} else {
			$descPreview.text(inputVal);
		}
	});
}
// 表格中无图片时设置默认
function renderCover(d) {
	if (d) {
		return `<div class='table-cover' style='background-image: url(${d});'></div>`;
	} else {
		return `<div class='table-cover' style='background-image: url(${ctx}/images/default.png);'></div>`;
	}
}
// 表格中的编辑
function bindEdit() {
	$('#link-table').on('click', '.view-edit', function () {
		state = 'update';
		const el = $(this);
		const data = linkTable.dt.row(el.closest('tr')).data();
		// 填充编辑
		const dTitle = data.title;
		const dLink = data.relatedUrl;
		const dUrl = data.coverUrl;
		const dDsc = data.desc;
		cloudId = data.cloudId;
		editCrenditialId = data.resourceId;

		$titleInput.val(dTitle);
		$linkInput.val(dLink);
		$titlePreview.text(dTitle);
		$rightSider.data('href', dLink);

		if (dUrl) {
			$upBtn.css('background-image', `url(${dUrl})`);
			$cardImage.html(`<img src='${dUrl}' width='100%'/>`);
		}
		if (dDsc) {
			$descInput.val(dDsc);
			$descPreview.text(dDsc);
		}
		mediaId = data.mediaId;
		$linkSideBar.find('.sidebar-title').text('编辑链接素材');
		linkSideBar.show();
	});
}
// 侧栏中的保存
function bindSave() {
	$('.link-save').on('click', () => {
		const endLoading = utils.loadingBtn($('.link-save'));
		saveFlag = true;
		const tval=$.trim($titleInput.val());
		if (tval === '') {
			utils.alertMessage('标题不能为空！');
			endLoading();
			return;
		}else if(tval.length>64){
			utils.alertMessage('标题不能超过64字符！');
			endLoading();
			return;
		}
		const lval=$.trim($linkInput.val());
		if ( lval=== '') {
			utils.alertMessage('链接不能为空！');
			endLoading();
			return;
		/* } else if (lval.length > 64) {
			utils.alertMessage('链接不能超过64字符！');
			endLoading();
			return; */
		} else if (!/[a-zA-z]+:\/\/[^s]*/.test(lval)) {
			utils.alertMessage('链接不合法！');
			endLoading();
			return;
		}
		const dval = $.trim($($descInput).val());
		if (dval.length > 120) {
			utils.alertMessage('摘要不能超过120字符！');
			endLoading();
			return;
		}

		let nchangeArgs = {
			mediaid: mediaId,
			title: $.trim($titleInput.val()),
			clickLink: $.trim($linkInput.val()),
			digest: $.trim($descInput.val()),
			credentialId: ''
		};
		if (state === 'create') {
			nchangeArgs.credentialId = resourceUtils.getAccountId('link');
			resourceUtils.resourceCreateAjax(nchangeArgs, (msg) => {
				linkTable.reload();
				linkSideBar.hide();
				utils.alertMessage(msg.msg, !msg.error);
				endLoading();
			}, 'link');
		} else if (state === 'update') {
			nchangeArgs.credentialId = editCrenditialId;
			resourceUtils.resourceUpdateAjax(Object.assign(nchangeArgs, { id: cloudId }), (msg) => {
				linkTable.reload();
				linkSideBar.hide();
				utils.alertMessage(msg.msg, !msg.error);
				endLoading();
			}, 'link');
		}

	});
}

// 真假删除处理函数
function hideDel() {
	if (saveFlag) {
		resourceUtils.resourceFileDeleteMoreEvent(toDeleteArr, 'link', () => { toDeleteArr = []; });
	} else {
		resourceUtils.resourceFileDeleteMoreEvent(uploadedArr, 'link', () => { uploadedArr = []; });
	}
	clearForm();
}
// 清空表单的函数
function clearForm() {
	$titleInput.val('');
	$linkInput.val('');
	$descInput.val('');
	mediaId = '';
	coverUrl = '';
	$upBtn.css('background-image', `url(${ctx}/images/upImg.png)`);
	$cardImage.html('');
	$($rightSider).data('href',null);
	$titlePreview.html('标题');
	$descPreview.html('摘要');
}
// 点击右侧预览框，跳转到链接
function jump() {
	$rightSider.on('click', () => {
		const lhref = $($rightSider).data('href');
		if (lhref) {
			window.open(lhref);
		}
	});
}


