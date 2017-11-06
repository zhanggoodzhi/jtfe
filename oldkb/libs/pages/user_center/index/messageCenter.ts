import './messageCenter.less';
import * as utils from 'utils';
let kbDetail: any;
export function initMessageCenter(d) {
	kbDetail = d;
	initData();
	bindEvent();
}
function initData() {
	renderList();
	initScrollEvent();
}
function initScrollEvent() {
	new utils.ScrollPagination({
		el: $('.scroll-el'),
		cb: (page, next, end) => {
			addList(page, next, end);
		}
	});
}
function renderList() {
	$('.kb-scroll ul').html('');
	addList(1);
}
function addList(page, next?, end?) {
	$.ajax({
		url: '/message/list',
		method: 'GET',
		data: {
			page: page,
			size: 20
		},
		success: (msg) => {
			let data = msg.data;
			if (data.length === 0) {
				if (end) {
					end();
				}
				return;
			}
			let str = '';
			for (let v of data) {
				switch (v.sign) {
					case 1: str = '有人评论了我的知识'; break;
					case 2: str = '有人收藏了我的知识'; break;
					case 3: str = '有人回复了我的评论'; break;
					case 4: str = '系统消息'; break;
					default: console.log('sign出错'); break;
				}
				const formatTime1 = v.createTime.split(' ')[0];
				const formatTime2 = v.createTime.split(' ')[1];
				$('.kb-scroll ul').append(`
					<li>
						<div class="row">
							<div class="image-wrap col s1">
								<img data-status="${v.status}" data-id="${v.messageId}" src="/images/letter${v.status}.png">
							</div>
							<div class="main col s11">
								<div class="top clearfix">
									<span class="title left">${str}<a class="knowledge-detail" data-id="${v.knowledgeId}">${v.knowledgeName ? v.knowledgeName : ''}</a></span>
									<span class="time right"><span class="date">${formatTime1}</span>${formatTime2}</span>
								</div>
								<div class="text">${v.content ? v.content : ''}</div>
							</div>
						</div>
					</li>
				`);
			};
			if (next) {
				next();
			}
		}
	});
}
function bindEvent() {
	const bigEl = $('.scroll-el');
	utils.bindtabEvent('message-center', () => {
		console.log('刷新表格');
	});
	bigEl.on('click', 'img', function () {
		if ($(this).data('status') === 1) {
			return;
		}
		$.ajax({
			url: '/message/signUnRead',
			method: 'PUT',
			data: {
				messageId: $(this).data('id')
			},
			success: () => {
				(this as HTMLImageElement).src = '/images/letter1.png';
				utils.initLeftRedDot();
			}
		});
	});
	$('.allReaded').on('click', function () {
		$.ajax({
			url: '/message/signUnRead/all',
			method: 'PUT',
			success: () => {
				$('.kb-scroll img').attr('src', '/images/letter1.png');
			}
		});
	});
	bigEl.on('click', '.knowledge-detail', function () {
		kbDetail.init(utils.getDetailParams($(this)));
	});
}
