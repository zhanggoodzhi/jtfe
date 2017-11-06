import './index.less';
// import 'select2/dist/css/select2.css';
// import 'script-loader!select2/dist/js/select2.full.min.js';
import { confirmModal, alertMessage, loadingBtn, uniqueId } from 'utils';
import 'select';
import * as tables from 'new-table';

declare const nodeAccountId: string;
declare const output;
declare const groupOutput;
declare const credentialBeansOutput;
// 素材部分公用函数start
export function renderBtn(id, type) {
	const val = $(`#${type}-account`).val();
	let edit = `
			<div class="icon-wrap view-edit" data-id='${id}' title='编辑'>
				<img src="${ctx}/images/materialIcon/editIconD.png" width="20px" height="20px">
			</div>
	`,
		del = `
			<div class="icon-wrap view-delete" data-id='${id}' title='删除'>
				<img src="${ctx}/images/materialIcon/delIconD.png" width="20px" height="20px">
			</div>
		`,
		pushOne = `
			<div class="icon-wrap view-share" data-id='${id}' title='群发'>
				<img src="${ctx}/images/materialIcon/shareIconD.png" width="20px" height="20px">
			</div>
		`;

	if (val === '') {
		pushOne = '';
	} else if (nodeAccountId && nodeAccountId !== val) {
		edit = del = '';
	}
	return `
		<div class="btnToolbox">
			${edit}
			<div class="icon-wrap view-share-all" data-id='${id}' title='推送到微信矩阵'>
				<img src="${ctx}/images/materialIcon/shareAllIconD.png" width="20px" height="20px">
			</div>
			${pushOne}
			${del}
		</div>
	`;
}

/**
 * 获取公众号ID
 *
 * @export
 * @param {any} type
 * @returns
 */
export function getAccountId(type) {
	const selectEl = $(`#${type}-account`);
	const value = selectEl.val();
	if (value) {
		return value;
	} else {
		if (type === 'text' || type === 'link') {
			return '';
		} else {
			const ids = [];
			selectEl.find('option:not(:first)').each((i, e) => {
				ids.push($(e).val());
			});
			return ids.join(',');
		}
	}
}


export function getActiveAccountId() {
	const account = $('#tab-content .active.tab-pane .weixin-account');
	if (account.length > 0) {
		const val = account.val(),
			selectId = val === ''
				? Array.prototype.map.call(
					account.find('option:not([value=""])'),
					o => $(o).val()).join(',')
				: val;

		return selectId;
	}

	return '';
}


/**
 * 搜索回车事件，搜索按钮事件，公众号change事件
 * (注意：请将初始化上传事件放在这个前面，不然新建素材按钮不会disabled)
 * @export
 * @param {any} type
 * @param {any} cb
 */
export function bindSearchEvent(type, cb) {
	$(`#${type}-search-btn`).on('click', () => {
		cb();
	});
	$(`#${type}-search-title`).on('keydown', (e) => {
		if (e && e.keyCode === 13) {
			cb();
			return false;
		}
	});
	const addBtn = $(`#${type}-add-btn`);
	// addBtn.prop('disabled', 'disabled').find('input[type=file]').prop('disabled', true).css('cursor', 'not-allowed');
	$(`#${type}-account`).on('change', function () {
		// 	if ($.trim($(`#${type}-account`).val()) === '') {
		// 		addBtn.prop('disabled', 'disabled').find('input[type=file]').prop('disabled', true).css('cursor', 'not-allowed');
		// 	} else {
		// 		addBtn.prop('disabled', null).find('input[type=file]').prop('disabled', false).css('cursor', 'pointer');
		// 	}
		cb();
	});
}
export function resourceCreateAjax(data, cb, type?) {
	if (type === 'text') {
		return $.ajax({
			url: 'weixinv2/enterprise/plaintext/save',
			method: 'POST',
			data: data
		}).done((msg) => {
			cb(msg);
		});
	} else if (type === 'link') {
		return $.ajax({
			url: 'weixinv2/enterprise/outsideChain/save',
			method: 'POST',
			data: data
		}).done((msg) => {
			cb(msg);
		});
	} else if (type === 'video') {
		return $.ajax({
			url: 'weixinv2/material/saveVideo',
			method: 'POST',
			data: data
		}).done((msg) => {
			cb(msg);
		});
	}
}
export function resourceUpdateAjax(data, cb, type?) {
	if (type === 'text') {
		return $.ajax({
			url: 'weixinv2/enterprise/plaintext/update',
			method: 'POST',
			data: data
		}).done((msg) => {
			cb(msg);
		});
	} else if (type === 'link') {
		return $.ajax({
			url: 'weixinv2/enterprise/outsideChain/upload',
			method: 'POST',
			data: data
		}).done((msg) => {
			cb(msg);
		});
	} else if (type === 'video') {
		return $.ajax({
			url: 'weixinv2/material/updateVideo',
			method: 'POST',
			data: data
		}).done((msg) => {
			cb(msg);
		});
	} else {
		return $.ajax({
			url: 'weixinv2/material/updateNewMedia',
			method: 'POST',
			data: data
		}).done((msg) => {
			cb(msg);
		});
	}

}
export function bindResourceEditEvent(type, cb) {
	$(`#${type}-tab`).on('click', '.view-edit', function () {
		const el = $(this);
		const id = el.data().id;
		cb(id, el);
	});
}
export function bindResourceDownloadEvent(type) {
	$(`#${type}-tab`).on('click', '.view-download', function () {
		const a = document.createElement('a');
		a.href = $(this).data().url;
		a.download = '';
		a.click();
	});
}

// 图文组接口不同
export function bindDeleteEvent(type, cb) {
	let text;
	switch (type) {
		case 'text': text = '文本'; break;
		case 'image': text = '图片'; break;
		case 'voice': text = '语音'; break;
		case 'video': text = '视频'; break;
		case 'music': text = '音乐'; break;
		case 'link': text = '链接'; break;
		case 'file': text = '文件'; break;
		default: text = '~~~~type错误~~~~~'; break;
	}

	$(`#${type}-tab`).on('click', '.view-delete', function () {
		const el = $(this);
		const id = el.data().id;
		confirmModal({
			msg: `确认删除该${text}吗?`,
			cb: (modal, btn) => {
				const end = loadingBtn(btn);
				$.ajax({
					url: 'weixinv2/material/deleteMedia',
					method: 'POST',
					data: {
						mediaId: id
					},
					success: (res) => {
						if (!res.error) {
							cb(res, el);
							modal.modal('hide');
						}
						alertMessage(res.msg, !res.error);
					},
					complete: () => {
						end();
					}
				});
			}
		});
	});
}
export function bindResourceDeleteEvent(type, cb) {
	let text;
	switch (type) {
		case 'text': text = '文本'; break;
		case 'image': text = '图片'; break;
		case 'voice': text = '语音'; break;
		case 'video': text = '视频'; break;
		case 'music': text = '音乐'; break;
		case 'news': text = '图文'; break;
		case 'link': text = '链接'; break;
		case 'file': text = '文件'; break;
		default: text = '~~~~type错误~~~~~'; break;
	}
	if (type === 'text') {
		$(`#${type}-tab`).on('click', '.view-delete', function () {
			const el = $(this);
			const id = el.data().id;
			confirmModal({
				msg: `确认删除该${text}吗?`,
				cb: (modal, btn) => {
					const endLoading = loadingBtn(btn);
					$.ajax({
						url: `weixinv2/enterprise/plaintext/delete`,
						method: 'POST',
						data: { id: `${id}` },
						success: (res) => {
							if (!res.error) {
								// table.ajax.reload(null, false);
								cb();
								modal.modal('hide');
							}
							alertMessage(res.msg, !res.error);
						},
						complete: () => {
							endLoading();
						}
					});
				}
			});
		});
	} else if (type === 'link') {
		// url和data要修改
		$(`#${type}-tab`).on('click', '.view-delete', function () {
			const el = $(this);
			const id = el.data().id;
			confirmModal({
				msg: `确认删除该${text}吗?`,
				cb: (modal, btn) => {
					const endLoading = loadingBtn(btn);
					$.ajax({
						url: `weixinv2/enterprise/outsideChain/delete`,
						method: 'POST',
						data: { id: `${id}` },
						success: (res) => {
							if (!res.error) {
								cb();
								// table.ajax.reload(null, false);
								modal.modal('hide');
							}
							alertMessage(res.msg, !res.error);
						},
						complete: () => {
							endLoading();
						}
					});
				}
			});
		});
	}
}

export function resourceFileDeleteMoreEvent(ids, type?: String, cb?: Function) {
	if (ids.length === 0) {
		return;
	}
	let nurl: string;
	if (type === 'link') {
		nurl = 'weixinv2/enterprise/outsideChain/deleteMore';

	} else if (type === 'video') {
		nurl = 'weixinv2/material/deleteMoreVideo';
	}
	$.ajax({
		url: nurl,
		method: 'POST',
		data: {
			mediaIds: ids.join(',')
		},
		success: () => {
			if (cb) {
				cb();
			}
		}
	});
}


interface IPushData {
	url: string;
	data: any[];
}

interface IshowOp {
	type: string;
	mediaId: string;
	/**
	 *
	 * true为群发
	 * @type {boolean}
	 * @memberOf IshowOp
	 */
	single: boolean;
	/**
	 *
	 *
	 * 点击确定的回调
	 * @memberOf IshowOp
	 */
	refresh?: () => void;

	parse?: (d: IPushItem[]) => IPushData;
}

interface IPushItem {
	mediaId: string;
	credential: string;
	target?: string;
	group?: string;
	agentid?: string;
}

export class PushModal {
	private modal: JQuery = $('#push-modal');
	private table: tables.Table;
	private op: IshowOp;


	constructor() {
		this.modal.one('shown.bs.modal', () => {
			this.initTable();
		});
	}
	private initTable() {
		this.table = new tables.Table({
			el: $('#push-table'),
			options: {
				serverSide: false,
				scrollY: '450px',
				scrollCollapse: true,
				select: 'multi',
				data: output[0].wechatCredentials,
				info: false,
				initComplete: () => {
					this.initSelect2();
					this.bindEvent();
				},
				columns: [
					{ data: 'wxName', title: '公众号' },
					{
						data: 'accountType', className: 'select-wrap prevent', title: '群发对象',
						render: this.renderSelect
					}
				]
			},
			checkbox: {
				data: ''
			}
		});
		// this.table = new tables.Table({
		// 	el: $('#push-table'),
		// 	options: {
		// 		serverSide: false,
		// 		scrollY: '450px',
		// 		scrollCollapse: true,
		// 		select: false,
		// 		info: false,
		// 		initComplete: () => {
		// 			this.initSelect2();
		// 			this.bindEvent();
		// 		},
		// 	}
		// });
	}
	private renderSelect(text, status, rowData) {
		if (text !== 3) {
			let options = '';
			groupOutput[0].groupNames.map((v) => {
				if (v.credential.id === rowData.id) {
					options += `
						<option value="${v.groupid}">${v.name}</option>
						`;
				}
			});
			return `
	<div class="form-group">
	  <select data-id="${rowData.id}" class="select form-control">
	    <option value="-1">全部用户</option>
	    ${options}
	  </select>
	</div>
				`;
		} else {
			let options = '';
			credentialBeansOutput[0].wechatAppInCredentialBeans.map((v) => {
				if (v.credentialId === rowData.id) {
					for (let sv of v.apps) {
						options += `
						<option value="${sv.agentid}">${sv.name}</option>
						`;
					}
				}
			});
			return `
	<div class="form-group">
		<select data-id="${rowData.id}" multiple="multiple" class="select form-control select2">
			${options}
		</select>
	</div>
				`;
		}
	}
	private initSelect2() {
		this.modal.find('.select2').select2({
			placeholder: '企业号群发对象'
		});
	}

	private bindEvent() {
		// tables.bindCheckBoxEvent($('#push-table'));

		this.modal.on('hidden.bs.modal', (e) => {
			this.clearTable();
		});

		const self = this;

		$('#push-sure').on('click', () => {
			let num = 0;
			const op = this.op;

			if (!op) {
				return;
			}
			// const rowsData = this.table.selected;
			// if (rowsData.length <= 0) {
			// 	alertMessage('请选择公众号');
			// 	return;
			// }
			// const data: IPushItem[] = [];
			// const
			// rowsData.map((v) => {
			// 	val = tr.find('select').val(),
			// 	const d: IPushItem = {
			// 		credential: v.id,
			// 		mediaId: op.mediaId
			// 	} as IPushItem;
			// });
			const trs = this.modal.find('tr.selected');

			if (trs.length <= 0) {
				alertMessage('请选择公众号');
				return;
			}


			const data: IPushItem[] = [];

			Array.prototype.forEach.call(trs, v => {
				const tr = $(v),
					trData: any = this.table.dt.row(tr).data(),
					val = tr.find('select').val(),
					d: IPushItem = {
						credential: trData.id,
						mediaId: op.mediaId
					} as IPushItem;

				if (Array.isArray(val)) {
					if (val.length <= 0) {
						alertMessage('请选择公众号「' + trData.wxName + '」的群发对象');
						return;
					}
					d.agentid = val.join(',');
				} else {
					if (val === '-1') {
						d.target = '1';
					} else {
						d.target = '2';
						d.group = val;
					}
				}

				data.push(d);
			});

			if (data.length <= 0) {
				return;
			}

			const end = loadingBtn($('#push-sure'));

			const currentData: IPushData = op.parse ? op.parse(data) : {
				url: 'weixinv2/broadcast/addBroadcast',
				data: data
			};
			const self = this;
			currentData.data.forEach((v, i) => {
				$.ajax(currentData.url, {
					method: 'POST',
					data: v
				}).done(res => {
					if (!res.error) {
						const name = (self.table.dt.row(trs.eq(i)).data() as any).wxName;

						alertMessage(`成功推送到 "${name}"`, !res.error);
					} else {
						alertMessage(res.msg, !res.error);
					}
				})
					.always(() => {
						num++;

						if (num >= i) {
							this.modal.modal('hide');
							op.refresh();
							end();
						}
					});
			});



			// const nameArr = [];
			// const sendArr = [];


			// if (checked.length <= 0) {
			// 	alertMessage('请选择公众号');
			// 	return;
			// }
			// for (let e of checked.toArray()) {
			// 	const checkbox = $(e);
			// 	const type = checkbox.attr('data-type');
			// 	const td = checkbox.parent();
			// 	const el = td.siblings('.select-wrap').find('.select');
			// 	const name = td.next().text();
			// 	const credential = el.data().id;
			// 	const mediaId = op.mediaId;
			// 	const value = el.val();

			// 	switch (op.type) {
			// 		case 'text':
			// 		case 'file':
			// 		case 'link':
			// 			if (type !== '3') {
			// 				alertMessage('文本、文件和链接只能推送给企业号');
			// 				return;
			// 			}
			// 			break;
			// 		default:
			// 			break;
			// 	}

			// 	nameArr.push(name);
			// 	if (el.hasClass('select2')) {
			// 		sendArr.push({
			// 			credential,
			// 			mediaId,
			// 			agentid: value.join(',')
			// 		});
			// 	} else {
			// 		if (el.val() === '-1') {
			// 			sendArr.push({
			// 				mediaId,
			// 				credential,
			// 				target: 1
			// 			});
			// 		} else {
			// 			sendArr.push({
			// 				mediaId,
			// 				credential,
			// 				target: 2,
			// 				group: value
			// 			});
			// 		}
			// 	}
			// }

			// let sum = 0;

			// const end = loadingBtn($('#push-sure'));
			// sendArr.forEach((v, i) => {
			// 	$.ajax('weixinv2/broadcast/addBroadcast', {
			// 		method: 'POST',
			// 		data: v
			// 	}).done(res => {
			// 		if (!res.error) {
			// 			alertMessage(`成功推送到 "${nameArr[i]}"`, !res.error);
			// 		} else {
			// 			alertMessage(res.msg, !res.error);
			// 		}
			// 	})
			// 		.always(() => {
			// 			sum++;
			// 			if (sum === sendArr.length) {
			// 				this.modal.modal('hide');
			// 				op.cb();
			// 				end();
			// 			}
			// 		});
			// });
		});
	}

	private clearTable() {
		this.modal.find('tbody tr').show();
		this.modal.find('input[type=checkbox]').prop('checked', false);
		this.modal.find('select:not(.select2)').val('-1');
		this.modal.find('.select2').select2().val(null).trigger('change');
	}

	public updateTitle(title) {
		this.modal.find('.modal-header h4').html(title);
	}

	public show(op: IshowOp) {
		this.op = op;

		switch (op.type) {
			// case 'text':
			// case 'video':
			case 'file':
			case 'link':
				const trs = $('#push-table tbody tr'),
					wx = trs.filter('[data-type!="3"]');
				if (trs.length <= wx.length) {
					return alertMessage('没有符合推送该类型的公众号');
				}
				wx.hide();
				break;
			default:
				break;
		}

		if (op.single) {
			const currentAccountId = $(`#${op.type}-account`).val();
			if (!currentAccountId) {
				return;
			}

			$('#check-wrap').hide();
			this.updateTitle('群发');

			this.modal.find('tbody tr').each((i, e) => {
				const el = $(e);
				if (el.attr('data-id') !== currentAccountId) {
					el.hide();
				} else {
					el.find('input[type="checkbox"]').prop('checked', true).trigger('change');
				}
			});
		} else {
			$('#check-wrap').show();
			this.updateTitle('推送到矩阵');
		}

		this.modal.modal('show');
	}

	public hide() {
		this.modal.modal('hide');
	}
}


export function noResourceHtml() {
	return '<p class="cloud-no-resource">没有检索到数据</p>';
}
// 素材部分公用函数end

