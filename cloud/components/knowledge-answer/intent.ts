import * as utils from 'utils';
import * as tables from 'new-table';
import * as nTables from 'tables';
import * as item from './intent-item.pug';
import { changeTagStyle, bindSure, bindDeleteEvent } from './updateUtils';
export function initIntent(update) {
	init(update);
}
let modalAddEl, tagEl, intentTable, modalEl;
declare const kbRestUrl;
declare const appid;
function init(update) {
	modalEl = $('#intent-modal');
	modalAddEl = $('#intent-add-modal');
	tagEl = $('#intent-tab');

	// initIntentTable();
	bindEvents(update);
}
export function renderIntent(rowData) {
	tagEl.find('.resource-box').html('').append(
		$(item({ str: rowData.plainText }))
	);
	modalEl.modal('hide');
}
// 表格
/* function initIntentTable() {
	intentTable = new tables.Table({
		el: $('.intent-table'),
		options: {
			select: false,
			paging: true,
			serverSide: true,
			pageLength: 6,
			ajax: {
				url: 'knowledge/corpusManage/intent/list',
				method: 'GET',
				dataSrc: data => data.rows,
				data: (d: any) => {
					return utils.cleanObject({
						intentKey: $.trim(modalEl.find('.keyword').val()),
						page: Math.floor(d.start / d.length) + 1,
						rows: d.length
					});
				}
			},
			// initComplete: initComplete,
			columns: [
				{ data: '', title: '选择', render: renderCk, className: 'center-radio' },
				{ data: 'id', title: 'id' },
				{ data: 'intentKey', title: 'intentKey' },
				{ data: 'extras', title: 'extras', width: '60%', render: renderIK }
			]
		}
	});
} */
function renderCk(url, type, row) {
	return `<input name="intent" type="radio" value=""/>`;
}
function renderIK(d) {
	return JSON.stringify(d);
}
function bindEvents(update) {
	// 点击添加意图，则添加
	tagEl.on('click', '.upload-item', () => {
		modalAddEl.modal('show');
	});
	// 点击从素材中选择，则显示意图列表
	/* tagEl.find('.select-item').on('click', function () {
		intentTable.reload();
		modalEl.modal('show');
	}); */
	// 点击模态框确定按钮
	bindSure('链接', intentTable, modalEl, (rowData) => {
		const intentJson = JSON.stringify({
			intentKey: rowData.intentKey,
			extras: rowData.extras.map(v => {
				const inputs = $(v).find('input');
				return {
					key: inputs.eq(0).val(),
					value: inputs.eq(1).val()
				};
			})
		});
		// const result = newARow(`[意图: ${intentJson}]`, { intentId: rowData.id });
		// const showData = JSON.stringify(result);
		tagEl.find('.resource-box').append($(item({ str: intentJson })));
		changeTagStyle('intent');
		modalEl.modal('hide');
		update(answer => {
			answer.plainText = intentJson;
			answer.resourceId = rowData.id;
			answer.type = 9;
			return answer;
		});
	});
	// 点击删除按钮
	bindDeleteEvent('intent', update);
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
		intentTable.reload();
	});




	$('#intent-confirm-btn').on('click', (e) => {
		const extras = modalAddEl.find('.extras-row').toArray(),
			code = $('#intent-code').val().trim();
		if (code === '') {
			utils.alertMessage('intentKey 不能为空');
		}
		/* else if (extras.length <= 0) {
			// 一条和多条获取数据的方式相同，区别的单条直接点击确认，多条要加号
			utils.alertMessage('extras 不能为空');
		} */
		else {
			const end = utils.loadingBtn($(e.currentTarget));
			let sendExtras;
			if (extras.length <= 0) {
				const one = modalAddEl.find('#extras-add');
				const inputs = $(one).find('input');
				const key = inputs.eq(0).val();
				const value = inputs.eq(1).val();
				if (!key) {
					utils.alertMessage('请输入extras的key！');
					end();
					return;
				}
				if (!value) {
					utils.alertMessage('请输入extras的value！');
					end();
					return;
				}
				sendExtras = [{ key, value }];
			} else {
				sendExtras = extras.map(v => {
					const inputs = $(v).find('input');
					return {
						key: inputs.eq(0).val(),
						value: inputs.eq(1).val()
					};
				});
			}
			const intentJson = JSON.stringify({
				intentKey: code,
				extras: sendExtras
			});
			$.ajax('knowledge/corpusManage/intent/add', {
				method: 'POST',
				data: {
					intentJson
				}
			})
				.done(msg => {
					if (!msg.error) {
						tagEl.find('.resource-box').append(item({ str: intentJson }));
						changeTagStyle('intent');
						update(answer => {
							answer.plainText = intentJson;
							answer.type = 9;
							answer.resourceId = msg.data.id;
							return answer;
						});
					}
				})
				.always(() => {
					end();
					modalAddEl.modal('hide');
				});
		}
	});

	modalAddEl.on('click', '.remove-this', (e) => {
		$(e.currentTarget).parent('.extras-row').remove();
	})
		.on('hidden.bs.modal', () => {
			$('#intent-code').val('');
			$('#intent-add-modal .extras-row').remove();
			$('#extras-add input').val('');
		});
	modalAddEl.on('click', '.add-operation', (e) => {
		// const el = $(e.currentTarget);
		let html = '<div class="row extras-row">';
		/*if (el.val().trim() === '') {
			return;
		}*/

		const inputs = $('#extras-add input').toArray();

		for (let v of inputs) {
			const vEl = $(v),
				val = vEl.val().trim();

			if (val === '') {
				return;
			}

			html += `
                    <div class="col-sm-5">
                        <input class="form-control input-sm" value="${val}">
                    </div>
                `;

		}

		for (let v of inputs) {
			$(v).val('');
		}

		html += `<span class='remove-this'>
					<i class="cloud-fa-icon fa fa-times-circle" title='删除词条意图'></i>
				</span></div>`;
		// <div class="remove-this"></div>
		$('.intent-add-form').append(html);
		// $('#extras-add').after(html);
	});
	// const newAText = '新建回复';
	// const newARow = (text: string = newAText, extra?) => {
	// 	const data = {
	// 		answer: {
	// 			plainText: text,
	// 			contentHtml: `<p>${text}</p>`
	// 		},
	// 		character: {
	// 			id: selectData.character[0].id
	// 		},
	// 		beginTime: moment().format('YYYY-MM-DD'),
	// 		endTime: moment().add(5, 'year').format('YYYY-MM-DD'),
	// 		pushway: selectData.pushway[0].id
	// 	};

	// 	if (extra) {
	// 		Object.assign(data, extra);
	// 	}

	// 	return data;
	// };
}
