import 'time';
import * as utils from 'utils';
import * as tables from 'new-table';
import * as nTables from 'tables';
import * as item from './link-item.pug';
import { changeTagStyle, bindSure, bindDeleteEvent } from './updateUtils';
export function initLink(update) {
	init(update);
}
// 选择音频后素材部分内容修改
export function renderLink(rowData) {
	tagEl.find('.resource-box').html('').append($(item({
		url: rowData.nonShared.linkUrl,
		title: rowData.title,
		ctx: rowData.nonShared.content
	})));
	changeTagStyle('link');
	modalEl.modal('hide');
}
let modalEl, tagEl, linkTable;
declare const kbRestUrl;
declare const appid;
function init(update) {
	modalEl = $('#link-modal');
	tagEl = $('#link-tab');
	initLinkTable();
	bindEvents(update);
}
// 点击从素材中选择按钮，显示模态框
function bindEvents(update) {
	tagEl.find('.select-item').on('click', function () {
		linkTable.reload();
		modalEl.modal('show');
	});
	// 点击模态框确定按钮
	bindSure('链接', linkTable, modalEl, (rowData) => {
		tagEl.find('.resource-box').append($(item({
			url: rowData.relatedUrl,
			title: rowData.title,
			ctx: rowData.desc,
			id: rowData.resourceId
		})));
		changeTagStyle('link');
		modalEl.modal('hide');
		update(answer => {
			answer.plainText = rowData.title;
			answer.resourceId = rowData.resourceId;
			answer.type = 6;
			return answer;
		});
	});
	// 点击删除按钮
	bindDeleteEvent('link', update);
	// 点击选择按钮，左下角数据改
	modalEl.on('click', '.center-radio', () => {
		if ($('.center-radio input:checked').length === 1) {
			modalEl.find('.count-number').addClass('active');
		} else {
			modalEl.find('.count-number').removeClass('active');
		}
	});
	// 查询
	modalEl.find('.search').on('click', function () {
		linkTable.reload();
	});
	tagEl.find('.edit').on('click', function () {
		const id = $(this).data('id');
		location.href = `${ctx}/knowledge/material/index?type=link&id=${id}`;
	});
}

// 表格
function initLinkTable() {
	linkTable = new tables.Table({
		el: $('.link-table'),
		options: {
			select: false,
			paging: true,
			serverSide: true,
			pageLength: 6,
			ajax: {
				url: `${kbRestUrl}/resource/search/${appid}`,
				method: 'POST',
				dataSrc: data => data.data,
				data: (d: any) => {
					return utils.cleanObject({
						appid: appid,
						title: $.trim(modalEl.find('.keyword').val()),
						page: Math.floor(d.start / d.length) + 1,
						size: d.length,
						type: 'link'
					});
				}
			},
			// initComplete: initComplete,
			columns: [
				{ data: '', title: '选择', render: renderCk, width: '10%', className: 'center-radio' },
				{ data: 'title', title: 'linkname', createdCell: tables.createAddTitle, width: '15%' },
				{ data: 'relatedUrl', title: '链接地址', render: renderLinkUrl, width: '50%' },
				{ data: 'createTime', title: '创建时间', render: utils.renderSimpleTime, width: '25%' }
			]
		}
	});
}
function renderCk(url, type, row) {
	return `<input name="link" type="radio" value=""/>`;
}
function renderLinkUrl(d) {
	return `<div class='link-title'><span class='glyphicon glyphicon-link'></span><a href=${d} target="_blank">${d}</a></div>`;
}
