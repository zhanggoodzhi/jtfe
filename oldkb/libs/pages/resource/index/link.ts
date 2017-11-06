import * as tables from 'tables';
import * as utils from 'utils';
import { Uploader } from 'upload';
import * as addLinkRes from './linkAddRes.pug';
import './link.less';

export function initLink() {
	utils.tabShown($('#link-link'), (e) => { init(); });
};
let table: any,
	detail: any,
	mediaId: any,
	coverUrl: any,
	state: any,
	resourceId: any,
	materialId: any,
	toDeleteArr: any = [],
	uploadedArr: any = [],
	saveFlag: any = false,
	$titleInput, $linkInput, $descInput, $upBtn, $coverShow, $cardImage, $titlePreview, $descPreview, $rightSider, $addLinkRes;
function init() {
	// 初始化侧栏
	detail = new utils.SideDetail({
		title: '添加链接素材',
		html: addLinkRes(),
		className: 'link-add-res',
		hideFn: hideDel,
		menus: [utils.renderSideMenu('保存', 'link-save')]
	});
	$('.input-field input,.input-field textarea').characterCounter();
	// 表格初始化
	const tableEl = $('#link-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/resource/list',
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = tables.extendsData(d, utils.getSearchParams('link'));
					const newData = utils.cleanObject(data);
					return newData;
				}
			},
			columns: [
				{ data: 'coverUrl', title: '封面图片', render: renderCover },
				{ data: 'title', title: '标题', createdCell: utils.createAddTitle },
				{ data: 'relatedUrl', title: '链接地址' },
				{ data: 'desc', title: '简介', createdCell: utils.createAddTitle },
				{ data: 'createTime', title: '创建时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'materialId', title: '操作', className: 'prevent', render: utils.renderEditAndDeleteBtn }
			]
		},
		initComplete: initComplete
	});
}

function initComplete() {
	$titleInput = $('#title');
	$linkInput = $('#link');
	$descInput = $('#desc');
	$upBtn = $('a#upload-img');
	$coverShow = $('.cover-show');
	$cardImage = $('.card-image');
	$titlePreview = $('#title-preview');
	$descPreview = $('#desc-preview');
	$rightSider = $('.right-innerBox');
	$addLinkRes = $('.link-add-res');
	// detail.element.overlay.on('click', () => {
	// 	detail.hide();
	// });
	// link的tab点击后刷新表格
	utils.tabShown($('#link-link'), () => {
		this.reload();
	}, false);
	// 查询功能
	$('#link-search').on('click', () => {
		this.reload();
	});
	// 添加素材，显示侧栏
	$('#link-add').on('click', () => {
		state = 'create';
		detail.updateTitle('添加链接素材');
		// clearForm();
		detail.show();
	});
	// 侧栏的取消和右上角叉叉按钮
	// $('.link-cancel,.kb-close').on('click', () => {
	// 	detail.hide();
	// });
	// 侧栏的保存按钮
	$('.link-save').on('click', () => {
		saveFlag = true;
		if ($.trim($titleInput.val()) === '') {
			utils.toast('标题不能为空！');
			return;
		}
		if ($.trim($linkInput.val()) === '') {
			utils.toast('链接不能为空！');
			return;
		}
		let changeArgs = {
			title: $.trim($titleInput.val()),
			desc: $.trim($descInput.val()),
			linkUrl: $.trim($linkInput.val()),
			url: '',
			method: '',
			operation: '',
			resourceId: '',
			materialId: ''
		};
		if (state === 'create') {
			changeArgs.url = '/resource/create';
			changeArgs.method = 'POST';
			changeArgs.operation = '添加';
			changeLink(changeArgs);
		} else if (state === 'update') {
			changeArgs.url = '/resource/update';
			changeArgs.method = 'PUT';
			changeArgs.resourceId = resourceId;
			changeArgs.materialId = materialId;
			changeArgs.operation = '修改';
			changeLink(changeArgs);
		}
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
				title: changeArgs.title,
				desc: changeArgs.desc,
				type: 'link',
				nonShared: {
					mediaId: mediaId,
					linkUrl: changeArgs.linkUrl
				}
			})
		}, () => {
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
		// 		title: changeArgs.title,
		// 		desc: changeArgs.desc,
		// 		type: 'link',
		// 		nonShared: {
		// 			mediaId: mediaId,
		// 			linkUrl: changeArgs.linkUrl
		// 		}
		// 	}),
		// 	success: () => {
		// 		table.reload();
		// 		detail.hide();
		// 	}
		// });
	}
	// blur的时候进行校验
	$titleInput.on('blur', function () {
		const el = $(this);
		const inputVal = $.trim($(this).val() as string);
		if (inputVal === '') {
			el.addClass('invalid');
			utils.toast('标题不能为空！');
		} else if (inputVal.length > 64) {
			el.addClass('invalid');
			utils.toast('标题不能超过64字符！');
		} else {
			el.removeClass('invalid');
			// $titlePreview.text(inputVal);
			utils.toast('标题合法！');
		}
	});
	$titleInput.on('input', function () {
		const inputVal = $.trim($(this).val() as string);
		if (inputVal === '') {
			$titlePreview.text('标题');
		} else {
			$titlePreview.text(inputVal);
		}
	});
	$linkInput.on('blur', function () {
		const el = $(this);
		const inputVal = $.trim($(this).val() as string);
		if (inputVal === '') {
			el.addClass('invalid');
			utils.toast('链接不能为空！');
		} else if (inputVal.length > 64) {
			el.addClass('invalid');
			utils.toast('链接不能超过64字符！');
		} else if (!/[a-zA-z]+:\/\/[^s]*/.test(inputVal)) {
			el.addClass('invalid');
			utils.toast('链接不合法！');
		} else {
			el.removeClass('invalid');
			$rightSider.attr('href', inputVal);
			utils.toast('链接合法！');
		}
	});
	$descInput.on('blur', function () {
		const el = $(this);
		const inputVal = $.trim($(this).val() as string);
		if (inputVal.length > 120) {
			el.addClass('invalid');
			utils.toast('摘要不能超过120字符！');
		} else {
			el.removeClass('invalid');
			// $descPreview.text(inputVal);
			utils.toast('摘要合法！');
		}
	});
	$descInput.on('input', function () {
		const inputVal = $.trim($(this).val() as string);
		if (inputVal === '') {
			$descPreview.text('摘要');
		} else {
			$descPreview.text(inputVal);
		}
	});
	// 上传图片
	new Uploader({
		btn: $upBtn,
		accept: '.jpg,.png',
		url: '/resource/file/upload',
		name: 'file',
		params: {
			type: 'link'
		},
		success: (id, name, res) => {
			mediaId = res.data.mediaId;
			const upUrl = res.data.url;
			$coverShow.html(renderResCover(upUrl));
			// 禁用上传按钮
			$upBtn.addClass('disabled');
			// 删除图片功能
			uploadedArr.push(mediaId);
			// 预览部分添加封面
			$cardImage.append(`<img src='${upUrl}'/>`);
			$descInput.addClass('truncate');
		}
	});

	// 表格中的编辑和删除操作
	$('#link-table').on('click', '.view-edit', function () {
		state = 'update';
		const el = $(this);
		const data = table.dt.row(el.parents('tr')).data();
		// 填充编辑
		const dTitle = data.title;
		const dLink = data.relatedUrl;
		const dUrl = data.coverUrl;
		const dDsc = data.desc;

		$titleInput.val(dTitle);
		$linkInput.val(dLink);
		$titlePreview.text(dTitle);
		$rightSider.attr('href', dLink);

		if (dUrl) {
			$coverShow.html(renderResCover(dUrl));
			$upBtn.addClass('disabled');
			$cardImage.append(`<img src='${dUrl}'/>`);
		}
		if (dDsc) {
			$descInput.val(dDsc);
			$descPreview.text(dDsc);
		}
		mediaId = data.mediaId;
		resourceId = data.resourceId;
		materialId = data.materialId;
		detail.updateTitle('编辑链接素材');
		detail.show();
	});
	utils.bindResourceDeleteEvent('link', () => {
		table.reload();
	});
	// .on('click', '.view-delete', function () {
	// 	const id = $(this).data().id;
	// 	utils.confirmModal('确认删除该条链接素材吗?', (remove, end) => {
	// 		$.ajax(`/resource/delete?materialId=${id}&type=link`, {
	// 			method: 'delete'
	// 		})
	// 			.always(() => {
	// 				end();
	// 			})
	// 			.done(() => {
	// 				utils.toast('删除成功');
	// 				table.reload();
	// 				remove();
	// 			});
	// 	});
	// });




	// 图片更新
	function renderResCover(url) {
		const coverHtml = `<div class='row'>
								<div class='col s8 cover-box'>
									<div class='row'>
										<div class='col s6'>
											<img src='${url}' class='cover-thumbnail'/>
										</div>
										<div class='col s2'>
											<a class='cover-operation'>删除</a>
										</div>
									</div>
								</div>
							</div>`;
		return coverHtml;
	}
	// 侧栏中删除图片的功能
	delRightImg();
	function delRightImg() {
		$addLinkRes.on('click', 'a.cover-operation', (event) => {
			toDeleteArr.push(mediaId);
			$coverShow.html('');
			$upBtn.removeClass('disabled');
			$descInput.removeClass('truncate');
			$cardImage.html('');
			mediaId = '';
			coverUrl = '';
			utils.toast('删除封面图片成功！');
			event.stopPropagation();
		});
	}
	bindCancel();
}
// 表格中无图片时设置默认
function renderCover(d) {
	if (d) {
		return `<div class='table-cover' style='background-image: url(${d});'></div>`;
	} else {
		return `<div class='table-cover' style='background-image: url(/images/default.png);'></div>`;
	}
}
// 真假删除处理函数
function hideDel() {
	if (saveFlag) {
		utils.resourceFileDeleteMoreEvent(toDeleteArr);
	} else {
		utils.resourceFileDeleteMoreEvent(uploadedArr);
	}
	clearForm();
	saveFlag = true;
};
// 清空表单的函数
function clearForm() {
	$titleInput.val('');
	$titleInput.removeClass('invalid');
	$linkInput.val('');
	$linkInput.removeClass('invalid');
	$descInput.val('');
	$descInput.removeClass('invalid');
	mediaId = '';
	coverUrl = '';
	$coverShow.html('');
	$upBtn.removeClass('disabled');
	$cardImage.html('');
	$titlePreview.html('标题');
	$descPreview.html('摘要');
}
function bindCancel() {
	$('.music-cancel').on('click', () => {
		detail.hide();
	});
}


