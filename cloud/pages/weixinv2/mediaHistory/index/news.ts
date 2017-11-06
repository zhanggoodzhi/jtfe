import * as utils from 'utils';
import * as Sortable from 'sortablejs';
import 'script-loader!masonry-layout/dist/masonry.pkgd.min.js';
import * as newsItem from './news-item.pug';
import * as newsSidebar from './news-sidebar.pug';
import * as newsSidebarItem from './news-sidebar-item.pug';
import * as resourceUtils from './resourceUtils';
import { Upload } from 'upload';
import { OnlinePicturesAndDownloadRecord } from './online-pictures';
import { DamGallery } from './dam-gallery';
import { DamFavorite } from './dam-favorite';
import { Pagination } from 'pagination';
import 'editor';
import './news.less';


declare const nodeAccountId: string;
declare const hasOnlinePic: boolean;
declare const hasDam: boolean;

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
let editCreId: string;
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
			name: 'digest',
			param: 'desc',
			require: false
		},
		{
			name: 'sourceUrl',
			param: 'url',
			require: false,
			msg: '输入原文链接'
		},
		{
			name: 'content',
			param: 'content',
			require: true,
			msg: '输入文章正文'
		},
		{
			name: 'identifier',
			param: 'identifier',
			require: true,
			msg: '上传封面图片'
		},
		{
			name: 'identifierUrl',
			param: 'kbImageUrl',
			require: true
		},
		{
			name: 'kbImageMediaid',
			param: 'kbImageMediaid',
			require: false
		},
		{
			name: 'thumbUrl',
			param: 'wechatImageUrl',
			require: false
		},
		{
			name: 'thumbMediaId',
			param: 'wechatImageMediaid',
			require: true
		},
		{
			name: 'coverPic',
			param: 'isShow',
			require: true
		},
		{
			name: 'author',
			param: 'author',
			require: false,
			msg: '输入作者姓名'
		},
		{
			name: 'text',
			require: true,
			msg: '输入文章正文'
		}
	];

const sidebar = new utils.SideBar({
	id: 'news-z-sider',
	content: newsSidebar(),
	width: 0.8,
	onHide: () => {
		if (!$('#news-sidebar-save').data('loading') && addNewsCover.length > 0) {
			deleteNewsPic(addNewsCover);
		}
		setTimeout(clearSidebar, 300);
		editCreId = '';
	}
});

const wrap = $('#news-items-wrap'),
	group = $('#news-group'),
	linkType = $('#link-type'),
	remove = $('#remove-news'),
	editorType = $('#editor-type'),
	editor = new wangEditor(editorType),
	newsPagination = new Pagination($('#news-tab'), {
		size: 10,
		onChange: (d) => {
			getNews({
				page: d.index,
				pageSize: d.size
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

		// if (data.identifier || data.kbImageMediaid) {
		// 	removeNewsCover.push(data.identifier || data.kbImageMediaid);
		// }



		pushRemoveNewsCover(data);

		item.remove();

		checkSortable();

		if (group.find('.selected').length <= 0) {
			group.find('.news-sidebar-item:first').trigger('click');
		}
	}
});

export function initNews(p: resourceUtils.PushModal) {
	let currentNewsNode: JQuery;
	// let msg;
	const width = wrap.width(),
		itemWidth = 300,
		gutter = (width % itemWidth) / (Math.floor(width / itemWidth) - 1),
		content = sidebar.elements.content;

	const upload = new Upload({
		url: 'weixinv2/material/uploadNewsUrl',
		accept: '.png,.jpg,.jepg,.gif',
		btn: $('#news-sidebar-cover'),
		name: 'fileToUpload',
		params: {
			credentialId: () => getCredentialId()
		},
		onUpload: (id, name) => {
			currentNewsNode = group.find('.selected');
			// msg = utils.alertMessage('正在上传图片', true, false);
		},
		success: (id, name, res) => {
			// if (msg) {
			// 	msg.remove();
			// 	msg = null;
			// }
			pushRemoveNewsCover(currentNewsNode.data());

			// addNewsCover.push(res.kbImageMediaid);

			currentNewsNode.data({
				kbImageMediaid: res.kbImageMediaid,
				identifier: null,
				identifierUrl: res.kbImageUrl,
				thumbMediaId: res.wechatImageMediaid
			});

			pushAddNewsCover(currentNewsNode.data());

			if (currentNewsNode.hasClass('selected')) {
				$('#news-sidebar-cover').css('backgroundImage', 'url(' + res.kbImageUrl + ')');
				$('#show-cover-wrap').show();
			}

			currentNewsNode.find('.news-sidebar-item-cover').css('backgroundImage', 'url(' + res.kbImageUrl + ')');
		}
	});

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


	wrap.on('click', '.delete-news', (e) => {
		const data = $(e.currentTarget).closest('.news-item').data();
		utils.confirmModal({
			msg: '确认删除选中图文组？',
			cb: (modal, btn) => {
				const end = utils.loadingBtn(btn);
				$.ajax('weixinv2/material/deleteNewsList', {
					method: 'POST',
					data: {
						mediaId: data.id
					}
				})
					.done(res => {
						if (!res.error) {
							modal.modal('hide');
							getNewsList();
						}
						utils.alertMessage(res.msg, !res.error);
					})
					.always(() => {
						end();
					});
			}
		});
	});

	wrap.on('click', '.push-all-news', (e) => {
		const data = $(e.currentTarget).closest('.news-item').data();
		p.show({
			type: 'news',
			mediaId: data.id,
			single: false,
			refresh: () => {
				resetNews();
			}
		});
	});

	wrap.on('click', '.push-one-news', (e) => {
		const data = $(e.currentTarget).closest('.news-item').data();
		p.show({
			type: 'news',
			mediaId: data.id,
			single: true,
			refresh: () => {
				resetNews();
			}
		});
	});

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

	$('#news-sidebar-auth').on('change', (e) => {
		group.find('.selected').data('author', $(e.currentTarget).val().trim());
	});

	$('#news-sidebar-url').on('change', (e) => {
		group.find('.selected').data('sourceUrl', $(e.currentTarget).val().trim());
	});

	$('#news-sidebar-title').on('change', (e) => {
		const val = $(e.currentTarget).val().trim();
		group.find('.selected')
			.data('title', val)
			.find('.news-sidebar-item-title').html(val);
	});

	$('#news-sidebar-show-cover').on('change', (e) => {
		group.find('.selected').data('coverPic', $(e.currentTarget).prop('checked') ? 1 : 0);
	});

	$('#news-sidebar-summary').on('change', (e) => {
		group.find('.selected').data('digest', $(e.currentTarget).val().trim());
	});

	// 切换类型
	// $('#toggle-type').on('click', (e) => {
	// 	const btn = $(e.currentTarget);
	// 	if (linkType.hasClass('hidden')) {
	// 		btn.html('手动编辑');
	// 		linkType.removeClass('hidden');
	// 	} else {
	// 		btn.html('链接到网页');
	// 		linkType.addClass('hidden');
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
		// const summary = $('#news-sidebar-summary');
		// if (summary.val().trim() === '') {
		// 	summary.val(utils.formatText(editorType.html()).slice(0, 54)).trigger('change');
		// }
		setTimeout(() => {
			const data = getSaveData();
			let url;
			if (!data) {
				return;
			}

			switch (type) {
				case Types.add:
					url = 'uploadNews';
					break;
				case Types.edit:
					url = 'updateNews';
					break;
				default:
					return;
			}

			const end = utils.loadingBtn($(e.currentTarget));
			$.ajax('weixinv2/material/' + url, {
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(
					utils.cleanObject({
						credentialId: getCredentialId(),
						id: editNews ? editNews.id : '',
						newsVoList: data
					}))
			})
				.done(res => {
					utils.alertMessage(res.msg, !res.error);
					if (!res.error) {
						if (removeNewsCover.length > 0) {
							deleteNewsPic(removeNewsCover);
						}
						sidebar.hide(false);
						clearSidebar();
						getNewsList();
					}
				})
				.always(() => {
					end();
				});
		}, 300);
	});

	resetNews();

	initPreveiw();

	initEditor();

	initAsset();
}


function getCredentialId() {
	return editNews ? editNews.credentialId : resourceUtils.getActiveAccountId();
}

function deleteNewsPic(data) {
	$.ajax('weixinv2/material/deleteByMediaid', {
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data)
	});
}

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

function fillSidebarData(data) {
	const showCoverWrap = $('#show-cover-wrap');
	$('#news-sidebar-title').val(data.title);
	$('#news-sidebar-auth').val(data.author);
	$('#news-sidebar-summary').val(data.digest);
	$('#news-sidebar-url').val(data.sourceUrl);
	$('#news-sidebar-show-cover').prop('checked', !!data.coverPic);

	const html = $(data.content);

	Array.prototype.forEach.call(html.find('img[data-src]'), (v) => {
		const img = $(v);
		img.prop('src', img.attr('data-src'));
		img.removeAttr('data-src');
	});

	editorType.empty().append(html);

	if (data.identifierUrl) {
		$('#news-sidebar-cover')
			.css('backgroundImage', 'url(' + data.identifierUrl + ')');
		showCoverWrap.show();
	} else {
		$('#news-sidebar-cover')
			.css('backgroundImage', '');

		showCoverWrap.hide();
	}
}

function resetNews() {
	newsPagination.index = 1;
	getNewsList();
}

function getCoverData(data) {
	return {
		kbMediaid: data.kbImageMediaid || null,
		wechatMediaid: data.thumbMediaId,
		identifier: data.identifier,
		credentialId: getCredentialId()
	};
}

function pushRemoveNewsCover(data) {
	if (data.kbImageMediaid || data.identifier) {
		removeNewsCover.push(getCoverData(data));
	}
}

function pushAddNewsCover(data) {
	if (data.kbImageMediaid || data.identifier) {
		addNewsCover.push(getCoverData(data));
	}
}

function getNewsList() {
	getNews({
		page: newsPagination.index,
		pageSize: newsPagination.size
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
			text = utils.formatText(html);


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
	$('.news-sidebar').on('click', '.image-item', (e) => {
		if (editorType.is(':visible')) {
			const id = utils.uniqueId('editor-image-'),
				url = $(e.currentTarget).prop('src');
			editor.command(e, 'insertHtml', `<img id="${id}" src="${url}" style="max-width:100%">`);
		}
	});

	// 在线图库
	const rightCtx = new OnlinePicturesAndDownloadRecord({
		rightParentId: '#news-asset-column',
		ulFirstParentId: '#news-asset-wrap',
		authorization: hasOnlinePic,
		listFotomoredownloadUrl: 'weixinv2/material/listFotomoredownload',
		searchPicPreUrl: `${ctx}/weixinv2/material/searchpic`,
		getVcgPicPreUrl: `${ctx}/weixinv2/vcg/getVcgPic`,
		downloadSearchPicUrl: `${ctx}/weixinv2/material/fotomoreDownload`,
		downloadVCGPicUrl: `${ctx}/weixinv2/vcg/vcgDownload`,
		editor: editor
	});
	rightCtx.initOnlinePics();

	// DAM图库
	const damGallery = new DamGallery({
		ulFirstParentId: '#news-asset-wrap',
		authorization: hasDam,
		url: 'weixinv2/dam/getDamPic'
	});
	// DAM收藏夹
	// const damFavorite = new DamFavorite({
	// 	ulFirstParentId: '#news-asset-wrap',
	// 	authorization: hasDam,
	// 	url: 'weixinv2/dam/getFavorites'
	// });
	// 微信图库 上传图片
	const uploader = new Upload({
		btn: $('.upload-img'),
		accept: '.jpg,.png',
		url: 'weixinv2/material/uploadFile',
		name: 'fileToUpload',
		onUpload() {
			uploader.uploader.setParams({
				credentialId: editCreId ? editCreId : resourceUtils.getAccountId('news'),
				type: 2
			});
		},
		success(id, name, res) {
			getAssetMedia();
		}
	});

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
				<img src="${d.identifierUrl}" class='image-item'/>
				<p title="${d.name}">${d.name}</p>
			</div>`;
		};

	const assetPagination = new Pagination(pic, {
		onChange: (d) => {
			getAssetMedia({
				page: d.index,
				pageSize: d.size
			});
		}
	});

	const getAssetMedia = (data?, cb?) => {
		const d = Object.assign({
			type: 2,
			page: 1,
			pageSize: 20
		}, data);

		if (assetPagination.index !== d.page) {
			assetPagination.index = d.page;
		}

		const end = utils.addLoadingBg($('#news-asset-pic'), $('#news-asset-pic-contariner'));
		getMedia(d, (res) => {
			if (!res.error) {
				const rows = res.rows;
				let html = '';
				rows.forEach((v, i) => {
					html += createImageItem(rows[i]);
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

	$('#news-account').on('change', () => {
		getAssetMedia();
	});

	sidebar.settings({
		onShow: () => {
			getAssetMedia();
		}
	});
}

function renderSideBar(data?) {
	if (data) {
		editCreId = data.credentialId;
	}
	group.empty();
	switch (type) {
		case Types.add:
			sidebar.title = '添加图文消息';
			addGroupItem();
			break;
		case Types.edit:
			sidebar.title = '编辑图文消息';
			if (data && data.news.length > 0) {
				data.news.forEach(d => {
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
			'author': '',
			'title': '',
			'identifierUrl': '',
			'originurl': '',
			'digest': '',
			'coverPic': 0,
			'content': '<p><br/><p/>',
			'text': ''
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
		keyword: $('#news-search-title').val().trim()
	});

	getMedia(Object.assign({ type: 1 }, data), (res) => {
		if (!res.error) {
			const select = $('#news-account').val();
			wrap.empty();

			newsPagination.total = res.recordsFiltered;

			wrap.masonry('layout');

			if (!wrap.is(':visible')) {
				layout = true;
			}

			if (res.rows.length <= 0) {
				wrap.append(resourceUtils.noResourceHtml());
			}

			res.rows.forEach(d => {
				const item = $(newsItem(Object.assign({
					select,
					nodeId: nodeAccountId,
					time: moment(d.tsp).format('YYYY-MM-DD HH:mm:ss')
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
		Object.assign(data, {
			credentialId: resourceUtils.getActiveAccountId()
		});
	}
	$.ajax('weixinv2/material/mediaList', {
		data: utils.cleanObject(data),
		ignoreFilter: data.type === 2
	} as JQueryAjaxSettings)
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

		for (let v of list) {
			const val = itemData[v.name];
			if ((val === undefined || val === '') && v.require) {
				if (v.msg) {
					utils.alertMessage(`请在图文组中的第${i + 1}个图文消息中${v.msg}`);
				}
				return;
			}

			if (v.param) {
				if (v.param === 'content') {
					const el = $(`<div>${val}</div>`);
					el.find('ul,ol').css('padding-left', '20px');
					d[v.param] = el.html();
				} else {
					d[v.param] = val;
				}
			}

		}

		if (!d.desc && type === Types.add) {
			d.desc = utils.formatText(d.content, false).slice(0, 54).trim();
		}

		data.push(d);
	}

	return data;
}


function initPreveiw() {
	const modal = $('#preview-news-modal'),
		account = $('#preview-wx-account'),
		user = $('#preview-wx-user');


	if (!account) {
		return;
	}

	let selectNews;


	wrap.on('click', '.preview-news', (e) => {
		user.val('');
		account.val(account.find('option:first').val());
		modal.modal('show');
		selectNews = $(e.currentTarget).closest('.news-item').data();
	});

	$('#preview-news-btn').on('click', (e) => {
		const credential = account.val(),
			touser = user.val().trim();

		if (!selectNews) {
			return;
		}
		if (credential === '' || credential === null || credential === undefined) {
			utils.alertMessage('无可推送的公众号');
			return;
		}

		if (touser === '') {
			utils.alertMessage('请填写微信号');
			return;
		}

		const end = utils.loadingBtn($(e.currentTarget));

		$.ajax('weixinv2/broadcast/previewBroadcast', {
			method: 'POST',
			data: {
				mediaId: selectNews.id,
				credential,
				touser
			}
		})
			.done((res) => {
				if (!res.error) {
					modal.modal('hide');
				}

				utils.alertMessage(res.msg, !res.error);
			})
			.always(() => {
				end();
			});
	});
}
