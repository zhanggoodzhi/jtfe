import * as utils from 'utils';
import './user.less';
import { KbDetail, KbEdit } from 'kbdetail';
import { initMessageCenter } from './messageCenter';
import { initMyDraft } from './myDraft';
import { initMyKnowledge } from './myKnowledge';
import { initMyComment } from './myComment';
import { initMyCollect } from './myCollect';
import { initMessageEdit } from './messageEdit';
let ifInitMyKnowledge = false;
let ifInitMyComment = false;
let ifInitMyCollect = false;
export function initUser() {
	initTags();
}
function initTags() {
	const tagEl = $('.user-tag');
	const header = $('.head-wrap');
	tagEl.on('click', '.col', function () {
		let id = $(this).data('id');
		const contentEl = $('#' + id);
		if (contentEl.hasClass('active')) {
			return;
		} else {
			tagEl.find('.col').removeClass('active');
			$('.tag-content').removeClass('active');
			$(this).addClass('active');
			contentEl.addClass('active');
		}
	});
	header.on('click', 'h3', function () {
		let link = $(this).data('link');
		const contentEl = $('#' + link);
		if (contentEl.hasClass('active')) {
			return;
		} else {
			tagEl.find('.col').removeClass('active');
			$('.tag-content').removeClass('active');
			tagEl.find(`.col[data-id="${link}"]`).addClass('active');
			contentEl.addClass('active');
		}
	});
	const e = new KbEdit();
	const d = new KbDetail();
	d.editInstance = e;
	initMessageCenter(d);
	tagEl.find('.col[data-id="draft-box"]').one('click', function () {
		setTimeout(() => {
			initMyDraft(d, e);
		}, 100);
	});
	tagEl.find('.col[data-id="my-knowledge"]').one('click', function () {
		if (ifInitMyKnowledge) {
			return;
		}
		setTimeout(() => {
			initMyKnowledge(d, e);
			ifInitMyKnowledge = true;
		}, 100);
	});
	tagEl.find('.col[data-id="my-comment"]').one('click', function () {
		if (ifInitMyComment) {
			return;
		}
		setTimeout(() => {
			initMyComment();
			ifInitMyComment = true;
		}, 100);
	});
	tagEl.find('.col[data-id="my-collect"]').one('click', function () {
		if (ifInitMyCollect) {
			return;
		}
		setTimeout(() => {
			initMyCollect();
			ifInitMyCollect = true;
		}, 100);
	});
	tagEl.find('.col[data-id="message-edit"]').one('click', function () {
		setTimeout(() => {
			initMessageEdit();
			utils.setScroll();
		}, 100);
	});
	header.find('h3[data-link="my-knowledge"]').one('click', function () {
		if (ifInitMyKnowledge) {
			return;
		}
		setTimeout(() => {
			initMyKnowledge(d, e);
			ifInitMyKnowledge = true;
		}, 100);
	});
	header.find('h3[data-link="my-comment"]').one('click', function () {
		if (ifInitMyComment) {
			return;
		}
		setTimeout(() => {
			initMyComment();
			ifInitMyComment = true;
		}, 100);
	});
	header.find('h3[data-link="my-collect"]').one('click', function () {
		if (ifInitMyCollect) {
			return;
		}
		setTimeout(() => {
			initMyCollect();
			ifInitMyCollect = true;
		}, 100);
	});
}
