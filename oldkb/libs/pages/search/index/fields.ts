import './fields.less';
import * as utils from 'utils';
import {KbRightHot} from 'kbdetail';

let pagination;
let kbDetail;
export function initFields(d) {
	kbDetail = d;
	utils.initDatePicker();// 必须先执行
	initPagination();
	initInfo();
	initRightSide();
	initEvevt();
}

function initPagination() {
	pagination = new utils.Pagination({
		el: $('.pagination-wrap'),
		size: 20,
		total: 1,
		onChange: (data) => {
			const index = data.index;
			reload(index);
		}
	});
}

function initInfo() {
	const el = $('.hot-search-wrap .detail ul');
	const endLoading = utils.loading(el);
	getHostMsg(3, (data) => {
		endLoading();
		data.map((v, i) => {
			el.append(
				`<li><span class="number">${i + 1}.</span><span class="text" data-id="${v.knowledgeId}">${v.knowledgeName}<span></li>`
			);
		});
	});
}

function getHostMsg(type, fn) {
	$.ajax({
		method: 'GET',
		url: '/api/search/knowledge/hot',
		data: {
			type: type
		}
	}).done((data) => {
		fn(data);
	});
}

function initRightSide() {
	new KbRightHot({
		el: $('#right-side'),
		clickHotKnowledge: (el) => {
			kbDetail.init(utils.getDetailParams(el));
		},
		clickHotLabel: (el) => {
			const keyWordEl = $('#search-keyword');
			const nofieldsEl = $('#nofields');
			const noupdateEl = $('#noupdate');
			keyWordEl.val(el.text());
			nofieldsEl.click();
			$('#label').click();
			if (!noupdateEl.prop('checked')) {
				noupdateEl.click();
			}
			noupdateEl.click();
			reload(1);
		}
	});
}

function initEvevt() {
	const nofieldsEl = $('#nofields');
	const itemEls = $('input[name="search-fields"]:not("#nofields")');
	const noupdateEl = $('#noupdate');
	const dataStartEl = $('.date-start');
	const dataEndEl = $('.date-end');
	const associateEl = $('.associate-wrap');
	const keyWordEl = $('#search-keyword');
	nofieldsEl.on('click', function () {
		itemEls.each((index, elem: HTMLInputElement) => {
			elem.checked = false;
		});
	});
	$('.search-fields').on('click', 'input[name="search-fields"]:not("#nofields")', function () {
		nofieldsEl.prop('checked', false);
	});
	$('#noupdate').on('click', () => {
		dataStartEl.val(null);
		dataEndEl.val(null);
	});
	$('.date-start').on('change', function () {
		noupdateEl.prop('checked', false);
	});
	$('#search-clear').on('click', () => {
		keyWordEl.val(null);
	});

	$('#search-btn').on('click', () => {
		if ((keyWordEl.val() as string).trim() === '') {
			$('.kb-search-detail .detail-wrap').html('');
			$('.pagination-wrap').hide();
			turnDefaultStyle();
			return;
		}
		removeDefaultStyle();
		reload(1);
	});
	keyWordEl.on('keydown', (e) => {
		if (e && e.keyCode === 13) { // enter 键
			if ((keyWordEl.val() as string).trim() === '') {
				$('.kb-search-detail .detail-wrap').html('');
				$('.pagination-wrap').hide();
				turnDefaultStyle();
				return;
			}
			removeDefaultStyle();
			reload(1);
		}
	});
	keyWordEl.on('input', function () {
		removeDefaultStyle();
		const val = $(this).val();
		if (val === '') {
			associateEl.html('').hide();
			return;
		}
		$.ajax({
			method: 'GET',
			url: '/api/search/knowledge/hot',
			data: {
				type: 3,
				keyword: $(this).val(),
			},
			success: (data) => {
				associateEl.html('');
				if (data.length === 0) {
					associateEl.hide();
					return;
				}
				for (let v of data) {
					associateEl.append(`
						<li>${v.knowledgeName}</li>
				`);
				}
				associateEl.show();
			}
		});
	});
	keyWordEl.on('focus', function () {
		if (associateEl.find('li').length !== 0) {
			associateEl.show();
		}
	});
	keyWordEl.on('blur', function (e) {
		setTimeout(() => {
			associateEl.hide();
		}, 150);
	});
	associateEl.on('click', 'li', function () {
		associateEl.hide();
		keyWordEl.val($(this).text());
		reload(1);
	});
	$('.kb-search-detail').on('click', '.title', function () {
		kbDetail.init(utils.getDetailParams($(this)));
	});
	$('.hot-search-wrap .detail ul').on('click', '.text', function () {
		removeDefaultStyle();
		keyWordEl.val($(this).text());
		if (!nofieldsEl.prop('checked')) {
			nofieldsEl.click();
		}
		nofieldsEl.click();
		if (!noupdateEl.prop('checked')) {
			noupdateEl.click();
		}
		noupdateEl.click();
		reload(1);
	});
	$('#hot-dropdown').on('click', 'li', function () {
		const bigEl = $('.info-box-wrap');
		const commentEl = bigEl.find('comment');
		const collectEl = bigEl.find('collect');
		if ($(this).data('type') === 'comment') {
			commentEl.show();
			collectEl.hide();
		} else {
			commentEl.hide();
			collectEl.show();
		}
	});
}
function turnDefaultStyle() {
	$('#kb-search').addClass('search-default');
}
function removeDefaultStyle() {
	$('#kb-search').removeClass('search-default');
}
function reload(num) {
	const itemEls = $('input[name="search-fields"]:not("#nofields")');
	const fields = new Array();
	itemEls.each((index, domElement: HTMLInputElement) => {
		if (domElement.checked) {
			fields.push(domElement.id);
		}
	});
	const startDay = utils.clearTimeEmpty($('.date-start').val());
	const endDay = utils.clearTimeEmpty($('.date-end').val());
	const detailUl = $('.detail-wrap');
	const endLoading = utils.loading(detailUl);
	$.ajax({
		method: 'GET',
		url: '/api/repository/solr',
		data: {
			keyword: $('#search-keyword').val(),
			fields: fields.length === 0 ? 'title,content,attach,label' : fields.join(','),// 此处采用字符串形式
			startDay: startDay !== '' ? startDay : null,
			endDay: endDay !== '' ? endDay : null,
			page: num,
			size: 20
		},
		success: (data) => {
			const msg = data.solrPage;
			const info = data.owlSearchOutputList;
			const infoBox = $('.show-wrap ul');
			infoBox.empty();
			info.forEach(v => {
				infoBox.append(`
				<li>
					<div class="top">
						<div class="name-wrap">
							<span>${v.name}</span>
						</div>
						<div class="info-wrap">
							<p class="age">年龄：${v.age}</p>
							<p class="sex">性别：${v.sex}</p>
						</div>
					</div>
					<div class="bottom">
						<p class="desc">${v.discription}</p>
					</div>
				</li>
				`);
			});
			endLoading();
			// if (num === 1) {// 传入的不是1的话就肯定是点击每页的事件了，那总页数不变
			// }
			pagination.total = msg.total;
			pagination.index = num;
			renderDetail(msg.data);
		}
	});
}
function renderDetail(data) {
	const detailUl = $('.detail-wrap');
	detailUl.html('');
	$('.pagination-wrap').show();
	if (data.length === 0) {
		detailUl.html('无搜索结果');
		return;
	}
	for (let v of data) {
		let itemEl = $(`
			<li class="detail-item">
				<a class="title" data-id="${v.knowledgeId}">${v.title}</a>
				<p class="text">${v.content}</p>
				<p class="info">
					<span class="time">${utils.renderTime(v.createtime)}</span>
					<span class="separate">|</span>
					<span>作者：${v.author ? v.author : '未知'}</span>
					<span class="separate">|</span>
					<span>分类：${v.templateName ? v.templateName : '未知'}</span>
				</p>
				<ul class="attachments">
				</ul>
			</li>
		`);
		for (let sv of v.attachmentSet) {
			itemEl.find('.attachments').append(`
				<li>
					<img src="/images/types/doc.png">
					<a class="file-name">${sv.filename}</a>
				</li>
			`);
		}
		detailUl.append(itemEl);
	}
}
