import * as utils from 'utils';
import * as Sortable from 'sortablejs';
import 'script-loader!masonry-layout/dist/masonry.pkgd.min.js';
import * as newsItem from './news-item.pug';
import * as newsSidebar from './news-sidebar.pug';
import * as newsSidebarItem from './news-sidebar-item.pug';
// import * as throttle from 'lodash/throttle.js';
import * as resourceUtils from './resourceUtils';
import { Upload } from 'upload';
import 'editor';
import './news.less';
declare const appid;
declare const kbRestUrl;
declare const sendGroup;
declare const userid;
declare const idParam;
declare const typeParam;
enum Types {
	edit,
	add
}

enum Status {
	loading,
	finish,
	ready
}

// const replacePicList: {
// 	image: JQuery;
// 	xhr: JQueryXHR;
// }[] = [];

let type: Types;
// let credentialId: string;
let editNews;

let layout: boolean = false;


let removeNewsCover = [],
	addNewsCover = [];

const list: {
	name: string;
	param?: string;
	require: boolean;
	msg?: string;
}[] = [
		{
			name: 'title',
			param: 'title',
			require: true,
			msg: '输入文章标题'
		},
		{
			name: 'desc',
			param: 'desc',
			require: false
		},
		{
			name: 'url',
			param: 'url',
			require: false,
			//msg: '输入正文链接'
		},
		{
			name: 'content',
			param: 'content',
			require: false,
			//msg: '输入文章正文'
		},
		{
			name: 'picUrl',
			param: 'picUrl',
			require: true,
			msg: '上传封面图片'
		},
		{
			name: 'picMediaId',
			param: 'picMediaId',
			require: false
		},
		// {
		// 	name: 'coverPic',
		// 	param: 'isShow',
		// 	require: true
		// },
		// {
		// 	name: 'author',
		// 	param: 'author',
		// 	require: true,
		// 	msg: '输入作者姓名'
		// },
		{
			name: 'text',
			require: false,
			msg: '输入文章正文'
		}
	];

const sidebar = new utils.SideBar({
	content: newsSidebar(),
	width: 0.8,
	onHide: () => {
		if (!$('#news-sidebar-save').data('loading') && addNewsCover.length > 0) {
			resourceUtils.resourceFileDeleteMoreEvent(addNewsCover);
		}
		setTimeout(clearSidebar, 300);
	}
});

const wrap = $('#news-items-wrap'),
	group = $('#news-group'),
	linkType = $('#link-type'),
	remove = $('#remove-news'),
	editorType = $('#editor-type'),
	editor = new wangEditor(editorType),
	newsPagination = new utils.Pagination($('#news-tab'), {
		size: 10,
		total: 1,
		onChange: (d) => {
			getNews({
				page: d.index,
				size: d.size
			});
		}
	});

const resetRemove = () => {
	if (remove.hasClass('active')) {
		remove.removeClass('active')
			.find('.remove-text')
			.text('移动到此处删除');
	}
};

const groupSortable = Sortable.create(group.get(0), {
	group: 'group',
	animation: 150,
	fallbackOnBody: true,
	onMove: utils.throttle((e) => {
		const to = $(e.to);

		if (to.is(remove)) {
			to.addClass('active')
				.find('.remove-text')
				.text('松开删除');
		}
		else {
			resetRemove();
		}
	}, 200),
	onStart: (e) => {
		remove.removeClass('hidden');
	},
	onEnd: () => {
		remove.addClass('hidden');
		resetRemove();
	}
});

Sortable.create(remove.get(0), {
	group: {
		name: 'remove',
		put: ['group']
	},
	onAdd: (e) => {
		const item = $(e.item),
			data = item.data();

		// if (data.identifier || data.picMediaId) {
		// 	removeNewsCover.push(data.identifier || data.picMediaId);
		// }

		pushRemoveNewsCover(data);

		item.remove();

		checkSortable();

		if (group.find('.selected').length <= 0) {
			group.find('.news-sidebar-item:first').trigger('click');
		}
	}
});

export function initNews() {
	let currentNewsNode: JQuery;
	// let msg;
	const width = wrap.width(),
		itemWidth = 300,
		gutter = (width % itemWidth) / (Math.floor(width / itemWidth) - 1),
		content = sidebar.elements.content;
	$('#news-upload-btn').on('change', function () {
		currentNewsNode = group.find('.selected');
		const thisFile = this.files[0];
		resourceUtils.uploadResource('news', thisFile, (imgData) => {
			$(this).val(null);
			pushRemoveNewsCover(currentNewsNode.data());

			// addNewsCover.push(imgData.mediaId);

			currentNewsNode.data({
				picMediaId: imgData.mediaId,
				picUrl: imgData.url
			});

			pushAddNewsCover(currentNewsNode.data());

			if (currentNewsNode.hasClass('selected')) {
				$('#news-sidebar-cover').css('backgroundImage', 'url(' + imgData.url + ')');
			}
			currentNewsNode.find('.news-sidebar-item-cover').css('backgroundImage', 'url(' + imgData.url + ')');
		});
	});

	// const upload = new Upload({
	// 	url: 'weixinv2/material/uploadNewsUrl',
	// 	accept: '.png,.jpg,.jepg,.gif',
	// 	btn: $('#news-sidebar-cover'),
	// 	name: 'fileToUpload',
	// 	/*params: {
	// 		credentialId: () => getCredentialId()
	// 	},*/
	// 	onUpload: (id, name) => {
	// 		currentNewsNode = group.find('.selected');
	// 		// msg = utils.alertMessage('正在上传图片', true, false);
	// 	},
	// 	success: (id, name, res) => {
	// 		// if (msg) {
	// 		// 	msg.remove();
	// 		// 	msg = null;
	// 		// }
	// 		pushRemoveNewsCover(currentNewsNode.data());

	// 		// addNewsCover.push(res.picMediaId);

	// 		currentNewsNode.data({
	// 			picMediaId: res.picMediaId,
	// 			identifier: null,
	// 			coverUrl: res.picUrl,
	// 			thumbMediaId: res.wechatImageMediaid
	// 		});

	// 		pushAddNewsCover(currentNewsNode.data());

	// 		if (currentNewsNode.hasClass('selected')) {
	// 			$('#news-sidebar-cover').css('backgroundImage', 'url(' + res.picUrl + ')');
	// 			$('#show-cover-wrap').show();
	// 		}

	// 		currentNewsNode.find('.news-sidebar-item-cover').css('backgroundImage', 'url(' + res.picUrl + ')');
	// 	}
	// });

	utils.setScrollHeight();

	wrap.masonry({
		itemSelector: '.news-item',
		columnWidth: itemWidth,
		gutter: gutter,
		transitionDuration: 0
	});

	$('#add-empty-news').on('click', () => {
		addGroupItem();
	});

	$('#news-add-btn').on('click', () => {
		type = Types.add;
		renderSideBar();
		sidebar.show();
	});

	wrap.on('click', '.edit-news', (e) => {
		const data = $(e.currentTarget).closest('.news-item').data();
		// credentialId = data.credentialId;
		editNews = data;
		type = Types.edit;
		renderSideBar(data);
		sidebar.show();
	});

	resourceUtils.bindResourceDeleteEvent('news', () => {
		getNewsList();
	});
	// wrap.on('click', '.delete-news', (e) => {
	// 	const data = $(e.currentTarget).closest('.news-item').data();
	// 	utils.confirmModal({
	// 		msg: '确认删除选中图文组？',
	// 		cb: (modal, btn) => {
	// 			const end = utils.loadingBtn(btn);
	// 			$.ajax('weixinv2/material/deleteNewsList', {
	// 				method: 'POST',
	// 				data: {
	// 					mediaId: data.id
	// 				}
	// 			})
	// 				.done(res => {
	// 					if (!res.error) {
	// 						modal.modal('hide');
	// 						getNewsList();
	// 					}
	// 					utils.alertMessage(res.msg, !res.error);
	// 				})
	// 				.always(() => {
	// 					end();
	// 				});
	// 		}
	// 	});
	// });

	group.on('click', '.news-sidebar-item', (e) => {
		const item = $(e.currentTarget);
		if (item.hasClass('selected')) {
			return;
		} else {
			const data = item.data();
			group.find('.selected').removeClass('selected');
			item.addClass('selected');
			fillSidebarData(data);
		}
	});

	$('#news-link').on('shown.bs.tab', () => {
		if (layout) {
			wrap.masonry('layout');
			layout = false;
		}
	});

	// $('#news-sidebar-auth').on('change', (e) => {
	// 	group.find('.selected').data('author', $(e.currentTarget).val().trim());
	// });

	$('#link-type').on('change', (e) => {
		group.find('.selected').data('url', $(e.currentTarget).val().trim());
	});
	/* $('#news-sidebar-url').on('change', (e) => {
		group.find('.selected').data('url', $(e.currentTarget).val().trim());
	}); */

	$('#news-sidebar-title').on('change', (e) => {
		const val = $(e.currentTarget).val().trim();
		group.find('.selected')
			.data('title', val)
			.find('.news-sidebar-item-title').html(val);
	});

	// $('#news-sidebar-show-cover').on('change', (e) => {
	// 	group.find('.selected').data('coverPic', $(e.currentTarget).prop('checked') ? 1 : 0);
	// });

	$('#news-sidebar-summary').on('change', (e) => {
		group.find('.selected').data('desc', $(e.currentTarget).val().trim());
	});

	// 切换类型
	enum contentType {
		content = 'content',
		link = 'link'
	}
	const $outerEditor = $('.outer'),
		$toggleType = $('#toggle-type');
	
	$toggleType.on('click',function(){
		let _content_ = linkType.hasClass('hidden');
		if(_content_){
			toggleContentType(contentType.link)
		}else{
			toggleContentType(contentType.content)
		}
	});

	// $('#toggle-type').on('click', (e) => {
	// 	const btn = $(e.currentTarget);
	// 	if (linkType.hasClass('hidden')) {// 链接显示的时候，按钮为"手动编辑"。并且把富文本隐藏
	// 		btn.html('手动编辑');
	// 		linkType.removeClass('hidden');
	// 		$outerEditor.addClass('hidden');
	// 	} else {// 链接隐藏时，按钮为“链接到网页”。富文本显示
	// 		btn.html('链接到网页');
	// 		linkType.addClass('hidden');
	// 		$outerEditor.removeClass('hidden');
	// 	}
	// });

	$('#news-account').on('change', (e) => {
		const val = $(e.currentTarget).val();
		$('#news-add-btn').prop('disabled', !val);
		resetNews();
	});

	utils.bindEnter($('#news-search-title'), () => {
		resetNews();
	});

	$('#news-search-btn').on('click', () => {
		resetNews();
	});

	$('#news-sidebar-cancel').on('click', () => {
		sidebar.hide();
	});

	$('#news-sidebar-save').on('click', (e) => {
		// if (replacePicList.length > 0) {
		// 	utils.alertMessage('请等待图片上传至微信服务器');
		// 	return;
		// }
		setTimeout(() => {
			const data = getSaveData() as any;

			if (!data) {
				return;
			}

			let url;
			let method;
			switch (type) {
				case Types.add:
					url = 'create/' + appid;
					method = 'POST';
					break;
				case Types.edit:
					url = 'update';
					method = 'PUT';
					break;
				default:
					return;
			}

			const end = utils.loadingBtn($(e.currentTarget));
			const articles = data.map((v) => {
				return {
					title: v.title,
					desc: v.desc,
					picMediaId: v.picMediaId,
					picUrl: v.picUrl,
					url: v.url,
					content: v.content
				};
			});
			const sendData = {
				articles,
				materialId: editNews ? editNews.resourceId : undefined,
				creatorId: editNews ? undefined : userid,
				group: sendGroup,
				type: 'news'
			};
			$.ajax({
				method,
				url: `${kbRestUrl}/resource/${url}`,
				data: JSON.stringify(utils.cleanObject(sendData)),
				contentType: 'application/json'
			}).done((res) => {
				utils.alertMessage('保存成功', true);
				if (!res.error) {
					if (removeNewsCover.length > 0) {
						resourceUtils.resourceFileDeleteMoreEvent(removeNewsCover);
					}
					sidebar.hide(false);
					clearSidebar();
					getNewsList();
				}
			}).always(() => {
				end();
			});
			// $.ajax('weixinv2/material/' + url, {
			// 	method: 'POST',
			// 	contentType: 'application/json',
			// 	data: JSON.stringify(
			// 		utils.cleanObject({
			// 			// credentialId: getCredentialId(),
			// 			id: editNews ? editNews.id : '',
			// 			newsVoList: data
			// 		}))
			// })
			// 	.done(res => {
			// 		utils.alertMessage(res.msg, !res.error);
			// 		if (!res.error) {
			// 			if (removeNewsCover.length > 0) {
			// 				deleteNewsPic(removeNewsCover);
			// 			}
			// 			sidebar.hide(false);
			// 			clearSidebar();
			// 			getNewsList();
			// 		}
			// 	})
			// 	.always(() => {
			// 		end();
			// 	});
		}, 300);
	});
	resetNews();

	initEditor();

	initAsset();
	if (typeParam !== 'news') {
		return;
	}
	resourceUtils.triggerAddEvent();
	resourceUtils.triggerEditEvent((res) => {
		const data = res.data[0];
		editNews = data;
		type = Types.edit;
		renderSideBar(data);
		sidebar.show();
	});


	/* -- 定义函数 -- */
	// 填充数据
	function fillSidebarData(data) {
		$('#news-sidebar-title').val(data.title);
		// $('#news-sidebar-auth').val(data.author);
		$('#news-sidebar-summary').val(data.desc);
		// $('#news-sidebar-url').val(data.url);
		// $('#news-sidebar-show-cover').prop('checked', !!data.coverPic);
		editorType.html(data.content);
		// 根据url字段是否为空判断当前内容类型切换
		if(data.url){
			$('#link-type').val(data.url);
			toggleContentType(contentType.link);
		}else{
			toggleContentType(contentType.content);
		}
		
		if (data.picUrl) {
			$('#news-sidebar-cover')
				.css('backgroundImage', 'url(' + data.picUrl + ')');
		} else {
			$('#news-sidebar-cover')
				.css('backgroundImage', '');
		}
	}

	// 切换内容类型 手动编辑 or 正文链接
	function toggleContentType(type?: contentType){
		switch(type){
			case contentType.link:
				$toggleType.html('手动编辑');
				linkType.removeClass('hidden');
				$outerEditor.addClass('hidden');
				break;
			case contentType.content:
			default:
				$toggleType.html('链接到网页');
				linkType.addClass('hidden');
				$outerEditor.removeClass('hidden');
				break;
		}
	}



}
// function triggerEditEvent() {
// 	if (!idParam) {
// 		return;
// 	}
// 	getMedia(Object.assign({
// 		type: 'news',
// 		group: sendGroup,
// 		appid: appid,
// 		page: 1,
// 		size: 10,
// 		id: idParam
// 	}), (res) => {
// 		const data = res.data[0];
// 		editNews = data;
// 		type = Types.edit;
// 		renderSideBar(data);
// 		sidebar.show();
// 	});
// }
/*

function getCredentialId() {
	return editNews ? editNews.credentialId : resourceUtils.getActiveAccountId();
}*/

// function deleteNewsPic(data) {
// 	$.ajax('weixinv2/material/deleteByMediaid', {
// 		method: 'POST',
// 		contentType: 'application/json',
// 		data: JSON.stringify(data)
// 	});
// }

function clearSidebar() {
	renderSideBar();
	// credentialId = null;
	editNews = null;
	removeNewsCover = [];
	addNewsCover = [];
}

function checkSortable() {
	if (group.find('.news-sidebar-item').length <= 1) {
		groupSortable.option('disabled', true);
	} else {
		groupSortable.option('disabled', false);
	}
}

function resetNews() {
	newsPagination.index = 1;
	getNewsList();
}

function getCoverData(data) {
	return {
		kbMediaid: data.picMediaId || null
		// credentialId: getCredentialId()
	};
}

function pushRemoveNewsCover(data) {
	if (data.picMediaId) {
		removeNewsCover.push(data.picMediaId);
	}
}

function pushAddNewsCover(data) {
	if (data.picMediaId) {
		addNewsCover.push(data.picMediaId);
	}
}

function getNewsList() {
	getNews({
		page: newsPagination.index,
		size: newsPagination.size
	});
}

function initEditor() {
	editor.config.menus = [
		'bold',
		'underline',
		'italic',
		'eraser',
		'forecolor',
		'bgcolor',
		'|',
		'quote',
		'fontfamily',
		'fontsize',
		'unorderlist',
		'orderlist',
		'|',
		'link',
		'unlink',
		'|',
		'undo',
		'redo',
		'fullscreen'
	];

	editor.onchange = function () {
		const html = this.$txt.html(),
			text = this.$txt.text();
		group.find('.selected').data({
			content: html,
			text: text
		});
	};

	editor.create();

	const toggleBtn = $('<div class="toggle-type-btn" type="button"><i class="fa fa-file-text-o" title="选择模板"></i></div>'),
		icon = toggleBtn.find('.fa'),
		groupWrap = $('.news-group-wrap');

	editorType.prev('.wangEditor-menu-container')
		.append(toggleBtn);

	toggleBtn.on('click', () => {
		if (icon.hasClass('fa-file-text-o')) {
			icon.removeClass('fa-file-text-o')
				.prop('title', '返回编辑')
				.addClass('fa-chevron-left');
		} else {
			icon.addClass('fa-file-text-o')
				.prop('title', '选择模板')
				.removeClass('fa-chevron-left');
		}

		groupWrap.toggleClass('hidden');
	});


	$('#news-template-tab').on('click', '.news-template-group', (e) => {
		editor.command(e, 'insertHtml', $(e.currentTarget).html());
	});
}

function initAsset() {
	const picContariner = $('#news-asset-pic-contariner'),
		pic = $('#news-asset-pic'),
		width = picContariner.get(0).offsetWidth,
		imageWidth = 200,
		column = width < imageWidth ? 1 : Math.floor(width / imageWidth),
		columnWidth = (100 / column) + '%',
		createImageItem = (d) => {
			if (!d) {
				return '';
			}

			return `<div class="news-pic-item" style="width:${columnWidth}">
				<img src="${d.coverUrl}"/>
				<p title="${d.title}">${d.title}</p>
			</div>`;
		};

	const assetPagination = new utils.Pagination(pic, {
		size: 20,
		total: 1,
		onChange: (d) => {
			getAssetMedia({
				page: d.index,
				size: d.size
			});
		}
	});

	const getAssetMedia = (data?, cb?) => {
		const d = Object.assign({
			appid,
			group: sendGroup,
			type: 'image',
			page: 1,
			size: 20
		}, data);

		if (assetPagination.index !== d.page) {
			assetPagination.index = d.page;
		}

		const end = utils.addLoadingBg($('#news-asset-pic'), $('#news-asset-pic-contariner'));
		getMedia(d, (res) => {
			if (!res.error) {
				const rows = [];
				for (let v of res.data) {
					rows.push(...v.resourceGetList);
				}
				// const rows = res.data;
				let html = '';
				rows.forEach((v, i) => {
					if (i % column === 0) {
						html += `<li class="clearfix">${createImageItem(rows[i])}</li>`;
					}
				});

				picContariner.html(html);

				$('#news-asset-column').animate({
					scrollTop: 0
				});

				assetPagination.total = res.recordsFiltered;
				end();
			}
			if (cb) {
				cb(res);
			}
		});
	};

	getAssetMedia();
	utils.tabShown($('#news-link'), (e) => {
		resetNews();
		getAssetMedia();
	}, false);
	picContariner.on('click', '.news-pic-item', (e) => {
		if (editorType.is(':visible')) {
			const id = utils.uniqueId('editor-image-'),
				url = $(e.currentTarget).find('img').prop('src');

			editor.command(e, 'insertHtml', `<img id="${id}" src="${url}">`);

			// const image = $('#' + id),
			// 	xhr = $.ajax('weixinv2/material/changeUrl', {
			// 		method: 'POST',
			// 		data: {
			// 			credentialId: getCredentialId(),
			// 			url: url
			// 		},
			// 		dataType: 'text',
			// 		success: res => {
			// 			const index = replacePicList.indexOf(replacePic);
			// 			if (!res.error) {
			// 				image.prop('src', res);
			// 			} else {
			// 				utils.alertMessage('图片上传到微信服务器失败,请重新点击上传！');
			// 				image.remove();
			// 			}
			// 			replacePicList.splice(index, 1);
			// 		}
			// 	}),
			// 	replacePic = {
			// 		image: image,
			// 		xhr: xhr
			// 	};
			// replacePicList.push(replacePic);
		}
	});

	// // 图库 上传图片
	// $('#news-image-upload-btn').on('change', function () {
	// 	const thisFile = this.files[0];
	// 	resourceUtils.uploadResource('image', thisFile, (imgData) => {
	// 		$(this).val(null);
	// 		resourceUtils.resourceCreateAjax({
	// 			title: thisFile.name,
	// 			group: sendGroup,
	// 			type: 'image',
	// 			nonShared: {
	// 				mediaUrl: imgData.url,
	// 				mediaId: imgData.mediaId
	// 			}
	// 		}, (msg) => {
	// 			utils.alertMessage('操作成功', true);
	// 			getAssetMedia();
	// 		});
	// 	});
	// });

	$('#news-account').on('change', () => {
		getAssetMedia();
	});
}

function renderSideBar(data?) {
	group.empty();
	switch (type) {
		case Types.add:
			sidebar.title = '添加图文消息';
			addGroupItem();
			break;
		case Types.edit:
			sidebar.title = '编辑图文消息';
			if (data && data.newsItemsGetList.length > 0) {
				data.newsItemsGetList.forEach(d => {
					addGroupItem(d);
				});
			} else {
				addGroupItem();
			}

			break;
		default:
			return;
	}

	sidebar.elements.content.find('.news-sidebar-item:first').trigger('click');
}

function addGroupItem(data?) {
	if (!data) {
		data = {
			// 'author': '',
			'title': '',
			'picUrl': '',
			// 'originurl': '',
			'desc': '',
			// 'coverPic': 0,
			'content': '<p><br/><p/>',
			'text': '',
			'url' : ''
		};
	} else {
		data.text = utils.formatText(data.content);
	}

	const item = $(newsSidebarItem(data));
	item.data(data);
	group.append(item);
	checkSortable();
}

function getNews(data, cb?) {
	const end = utils.addLoadingBg($('#news-scroll'), $('#news-items-wrap'));

	Object.assign(data, {
		title: $('#news-search-title').val().trim()
	});

	getMedia(Object.assign({
		type: 'news',
		group: sendGroup,
		appid: appid
	}, data), (res) => {
		if (!res.error) {
			const select = $('#news-account').val();
			wrap.empty();

			newsPagination.total = res.recordsFiltered;

			wrap.masonry('layout');

			if (!wrap.is(':visible')) {
				layout = true;
			}

			if (res.data.length <= 0) {
				wrap.append(resourceUtils.noResourceHtml());
			}

			res.data.forEach(d => {
				const item = $(newsItem(Object.assign({
					select,
					time: moment(d.createTime).format('YYYY-MM-DD HH:mm:ss')
				}, d)));

				item.data(d);

				wrap
					.append(item)
					.masonry('appended', item);
			});

			end();
		}

		if (cb) {
			cb(res);
		}

	});
}


function removeNews(els?) {
	els = els || wrap.find('.news-item');
	if (els.length > 0) {
		Array.prototype.forEach.call(els, el => {
			wrap.masonry('remove', el)
				.masonry();
		});
	}
}


function getMedia(data, cb?) {
	if (!data.hasOwnProperty('credentialId')) {
		/*Object.assign(data, {
			credentialId: resourceUtils.getActiveAccountId()
		});*/
	}
	$.ajax(`${kbRestUrl}/resource/search/${appid}`, {
		method: 'POST',
		data: utils.cleanObject(data)
	})
		.done(res => {
			if (cb) {
				cb(res);
			}
		});
}



function getSaveData() {
	const items = group.find('.news-sidebar-item').toArray();

	if (items.length <= 0) {
		return;
	}

	const data = [];
	for (let i = 0, len = items.length; i < len; i++) {
		const item = $(items[i]),
			itemData = item.data(),
			d: { [key: string]: string } = {};
		let url, content, text;

		for (let v of list) {
			const vname = v.name;
			const val = itemData[vname];
			/* if (v.name === 'text' && /^\s+$/.test(val) === true) {
				utils.alertMessage(`请在图文组中的第${i + 1}个图文消息中输入正文`);
				return;
			} */

			if ((val === undefined || val === '') && v.require) {
				if (v.msg) {
					utils.alertMessage(`请在图文组中的第${i + 1}个图文消息中${v.msg}`);
				}
				return;
			}
			if (vname === 'url') {
				url = val;
			}
			if (vname === 'content') {
				content = val;
			}
			if (vname === 'text') {
				text = val;
			}
			if (v.param) {
				d[v.param] = val;
			}
		}
		/* 正文链接或者正文内容至少有一个 */
		const trimText = $.trim(text);
		if (!url && !trimText) {
			utils.alertMessage(`请在图文组中的第${i + 1}个图文消息的正文部分输入正文或添加正文链接`);
			return;
		}
		const isURL = /^https?:\/\/[\w]+/.test(url);
		if(url && !isURL){
			utils.alertMessage(`请在图文组中的第${i + 1}个图文消息的正文链接输入格式正确的网址`);
			return ;
		}
		
		if (url) {
			d.url = url;
			d.content = '<p><br></p>';
			d.text = null;
		}else {
			d.url = '';
			d.text = text;
			d.content = content;
		}
		data.push(d);
	}
	return data;
}
