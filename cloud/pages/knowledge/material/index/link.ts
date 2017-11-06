import './link.less';
import 'time';
import * as tables from 'new-table';
import * as ntables from 'tables';
import * as utils from 'utils';
import * as linkSidebar from './link-sidebar.pug';
import * as resourceUtils from './resourceUtils';
export function initLink() {
	utils.tabShown($('#link-link'), (e) => {
		init();

	});
}
let linkSideBar: any, $linkSideBar: JQuery, linkTable;
let detail: any,
	mediaId: any,
	coverUrl: any,
	state: any,
	materialId: any,
	toDeleteArr: any = [],
	uploadedArr: any = [],
	saveFlag: any = false,
	$titleInput, $linkInput, $descInput, $upBtn, $cardImage, $titlePreview, $descPreview, $rightSider, upUrl;
declare const kbRestUrl;
declare const appid;
declare const group;
function init() {
	initSideBar();
	initTable();
}
function initSideBar() {
	linkSideBar = new utils.SideBar({
		id: 'linkSideBar',
		title: '新增链接素材',
		content: linkSidebar(),
		width: 0.6,
		onHide: () => {
			hideDel();
		}
	});
	$linkSideBar = $('#linkSideBar');
	$titleInput = $('#title');
	$linkInput = $('#link');
	$descInput = $('#desc');
	$upBtn = $('#imgcover');
	$cardImage = $('.card-image');
	$titlePreview = $('#title-preview');
	$descPreview = $('#desc-preview');
	$rightSider = $('.right-innerBox');
	initUpload();
	rightPreview();
}
function initTable() {
	linkTable = new tables.Table({
		el: $('#link-table'),
		options: {
			paging: true,
			serverSide: true,
			pageLength: 10,
			ajax: {
				url: `${kbRestUrl}/resource/search/${appid}`,
				method: 'POST',
				dataSrc: data => data.data,
				data: (d: any) => {
					const data = tables.extendsData(d, {
						appid: appid,
						title: $.trim($('#link-search-title').val()),
						type: 'link',
						group: group
					});
					return utils.cleanObject(data);
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
					data: 'materialId', title: '操作', className: 'prevent', render: (id) => {
						return resourceUtils.renderBtn(id, 'link');
					}
				}
			]
		}
	});
}
function initUpload() {
	$('#imgcover').on('change', '#upload-btn', function () {
		toDeleteArr.push(mediaId);
		const thisFile = this.files[0];
		resourceUtils.uploadResource('link', thisFile, (data) => {
			mediaId = data.mediaId;
			upUrl = data.url;
			$upBtn.css('background-image', `url(${upUrl})`);
			uploadedArr.push(mediaId);
			$cardImage.html(`<img src='${upUrl}' width='100%'/>`);
		});
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
		// $linkSideBar.find('.sidebar-title').text('添加链接素材');
		linkSideBar.title = '添加链接素材';
		clearForm();
		$upBtn.css('background-image', `url(${ctx}/images/upImg.png)`);
		linkSideBar.show();
	});

	// 表格中的编辑操作
	bindEdit();
	// 侧栏的保存按钮
	bindSave();
	// 表格中删除
	resourceUtils.bindResourceDeleteEvent('link', () => {
		linkTable.reload();
	});
	jump();
	resourceUtils.triggerAddEvent();
	resourceUtils.triggerEditEvent((res) => {
		state = 'update';
		const el = $(this);
		const data = res.data[0];
		// 填充编辑
		const dTitle = data.title;
		const dLink = data.relatedUrl;
		const dUrl = data.coverUrl;
		const dDsc = data.desc;
		materialId = data.materialId;

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
		linkSideBar.title = '编辑链接素材';
		linkSideBar.show();
	});
}
// 右侧预览
function rightPreview() {
	$titleInput.on('input', function () {
		const inputVal = $.trim($(this).val());
		if (inputVal === '') {
			$titlePreview.text('标题');
		} else {
			$titlePreview.text(inputVal);
		}
	});
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
		materialId = data.materialId;

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
		linkSideBar.title = '编辑链接素材';
		linkSideBar.show();
	});
}
// 侧栏中的保存
function bindSave() {
	$('.link-save').on('click', () => {
		const endLoading = utils.loadingBtn($('.link-save'));
		const tval = $.trim($titleInput.val());
		if (tval === '') {
			utils.alertMessage('标题不能为空！');
			endLoading();
			return;
		} else if (tval.length > 64) {
			utils.alertMessage('标题不能超过64字符！');
			endLoading();
			return;
		}
		const lval = $.trim($linkInput.val());
		if (lval === '') {
			utils.alertMessage('链接不能为空！');
			endLoading();
			return;
		} else if (lval.length > 64) {
			utils.alertMessage('链接不能超过64字符！');
			endLoading();
			return;
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

		const nchangeArgs = {
			title: $.trim($titleInput.val()),
			desc: $.trim($descInput.val()),
			group: group,
			type: 'link',
			nonShared: {
				linkUrl: $.trim($linkInput.val()),
				mediaUrl: upUrl,
				mediaId: mediaId
			}
		};
		/*const uchangeArgs = {
			materialId: materialId,
			title: $.trim($titleInput.val()),
			desc: $.trim($descInput.val()),
			group:group,
			type:'link',
			nonShared:{
				linkUrl: $.trim($linkInput.val()),
				mediaUrl:upUrl,
				mediaId: mediaId
			}
		};*/
		if (state === 'create') {
			resourceUtils.resourceCreateAjax(nchangeArgs, (msg) => {
				saveFlag = true;
				linkTable.reload();
				linkSideBar.hide();
				utils.alertMessage('新增链接成功！', true);
				endLoading();
			});
		} else if (state === 'update') {
			resourceUtils.resourceUpdateAjax(Object.assign(nchangeArgs, { materialId: materialId }), (msg) => {
				saveFlag = true;
				linkTable.reload();
				linkSideBar.hide();
				utils.alertMessage('修改链接成功！', true);
				endLoading();
			});
		}

	});
}

// 真假删除处理函数
function hideDel() {
	if (saveFlag) {
		const nArr = toDeleteArr.filter(v => {
			return v !== '' && v !== null;
		});
		resourceUtils.resourceFileDeleteMoreEvent(nArr, () => { toDeleteArr = []; });
	} else {
		const nfArray = uploadedArr.filter(v => {
			return v !== '' && v !== null;
		});
		resourceUtils.resourceFileDeleteMoreEvent(nfArray, () => { uploadedArr = []; });
	}
	clearForm();
	saveFlag = false;
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
	$($rightSider).data('href', null);
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


