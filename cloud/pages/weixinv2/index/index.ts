import './index.less';
import { Table, extendsData } from 'new-table';
import * as tables from 'tables';
import * as utils from 'utils';
import { Upload } from 'upload';
declare const adminType: number;
declare const userExtraData: string;
let wxId;
namespace Weixinv2Index {
	let imgUrl: string;
	interface ISendObj {
		wxAppId: string;
		wxAppSecret: string;
		wxName: string;
		sync: string;
		wxType: string;
		description: string;
		coverLocalUri: string;
	}

	const upload = new Upload({
		url: 'weixinv2/uploadQrcode',
		accept: 'image/png, image/jpeg, image/jpg',
		name: 'attach',
		btn: $('#imgcover'),
		success: (id, name, data) => {
			if (!data.error) {
				$('#imgcover').css('backgroundImage', 'url(' + data.msg + ')');
				imgUrl = data.msg;
			} else {
				utils.alertMessage(data.msg);
			}
		}
	});
	const table = new Table({
		el: $('#table'),
		options: {
			serverSide: true,
			paging: true,
			select: false,
			ajax: {
				url: 'weixinv2/list',
				type: 'GET',
				dataSrc: data => {
					const syncMap: { [key: string]: number } = {};
					data.rows.forEach((row, index) => {
						if (row.syncprogress !== 100) {
							syncMap[row.id] = index;
						}
					});
					if (!$.isEmptyObject(syncMap)) {
						syncPolling(syncMap);
					}
					return data.rows;
				},
				data: data => {
					return extendsData(data);
				}
			},
			initComplete: initComplete,
			columns: [
				{ name: 'wxName', data: 'wxName', width: '105px', title: '名称', createdCell: tables.createAddTitle },
				{ name: 'wxAppId', data: 'wxAppId', width: '160px', title: 'APPID', createdCell: tables.createAddTitle },
				{ name: 'appSecret', data: 'appSecret', title: 'APPSECRET', createdCell: tables.createAddTitle },
				/*{ name: 'status', data: 'status', width: '60px', title: '状态', render: (text) => { return text === 1 ? '已认证' : '未认证'; } },*/
				{ name: '公众号类型', data: 'accountType', width: '80px', title: '公众号类型', render: renderType },
				{name: 'action', data: 'syncprogress', title: '操作', width: '350px', render: renderBtns}
			]
		}
	});

	function syncPolling(syncMap: { [key: string]: number }) {
		$.ajax('weixinv2/syncCredential', {
			method: 'POST',
			abortOnRetry: true,
			data: {
				credentialIds: Object.keys(syncMap).join(',')
			}
		})
			.done(res => {
				if (!res.error && res.data && res.data.length > 0) {
					res.data.forEach(v => {
						const percent = Number(v.name),
							cell = table.dt.cell(syncMap[v.id], 'action:name');
						cell.data(percent);
						$(cell.node()).html(cell.render('display'));
						if (percent === 100) {
							delete syncMap[v.id];
						}
					});

					if (!$.isEmptyObject(syncMap)) {
						setTimeout(() => {
							syncPolling(syncMap);
						}, 2000);
					}
				}
			});
	}

	function renderType(accountType) {
		switch (accountType) {
			case 1:
				return '服务号';
			case 2:
				return '订阅号';
			case 3:
				return '企业号';
			default:
				return '';
		}
	}
	function renderBtns(data, type, row) {
		if (row.syncprogress !== 100) {
			return `<p class="table-td-info">「${data}%」素材同步中...</p>`;
		}
		let user = '';
		if (row.accountType !== 3) {
			user = row.administrators ? `<a class="btn btn-link btn-sm change-user">修改管理员</a>` : `<a class="btn btn-link btn-sm bind-user">绑定管理员</a>`;
		}
		return `
        <div class="row-input" data-wxAppId="${row.wxAppId}" data-id="${row.id}">
            <a style="padding-left:0;" href="weixinv2/material/mediaHistory/index?id=${row.id}" class="btn btn-link btn-sm">素材管理</a>
			${user}
            <a href="weixinv2/updateWechatCredentialInfo.do?id=${row.id}" class="btn btn-link btn-sm">编辑</a>
            <button class="sync btn btn-link btn-sm">素材同步</button>
            ${(adminType !== 2 || userExtraData === '') ?
				'<button class="dele btn btn-link btn-sm" type= "button"> 解除绑定 </button>'
				: ''}
        </div>`;
	}
	// 关注公众号，选择企业号时，只能选择不同步和全部
	function accountAttend() {
		$('#accountType input').on('change', function () {
			// debugger;
			if (parseInt($(this).val()) === 3) {
				$('.nosync-label input').click();
				$('.accNot').hide();
			} else {
				$('.week-label input').click();
				$('.accNot').show();
			}
		});
	}
	function initComplete() {
		const dt = table.dt;
		accountAttend();
		const modalEl = $('#bind-user-modal');

		$('#table').on('click', '.bind-user', function (e) {
			const rowData = dt.row($(this).closest('tr')).data() as any;
			wxId = rowData.id;
			modalEl.find('.modal-title').text('绑定管理员');
			modalEl.find('#delete-btn').hide();
			modalEl.modal('show');
			modalEl.find('#input-name').val(rowData.wxName);
			modalEl.find('#input-nickname').val(rowData.nickName);
			modalEl.find('#input-account').val(rowData.administrators);
		});

		$('#table').on('click', '.change-user', function (e) {
			const rowData = dt.row($(this).closest('tr')).data() as any;
			wxId = rowData.id;
			modalEl.find('.modal-title').text('修改管理员');
			modalEl.find('#delete-btn').show();
			modalEl.modal('show');
			modalEl.find('#input-name').val(rowData.wxName);
			modalEl.find('#input-nickname').val(rowData.nickName);
			modalEl.find('#input-account').val(rowData.administrators);
		});
		modalEl.on('click', '#user-save', function (e) {
			const name = modalEl.find('#input-name').val().trim();
			const nickname = modalEl.find('#input-nickname').val().trim();
			const account = modalEl.find('#input-account').val().trim();
			if (nickname === '') {
				utils.alertMessage('微信昵称不能为空!');
				return;
			}
			if (account === '') {
				utils.alertMessage('微信号不能为空!');
				return;
			}
			const endLoading = utils.loadingBtn($(this));

			$.ajax({
				url: 'weixinv2/addAuditor',
				method: 'POST',
				data: {
					wechatId: wxId,
					nickName: nickname,
					wechatNumber: account
				}
			}).done((res) => {
				if (!res.error) {
					if (modalEl.find('.modal-title').text() === '绑定管理员') {
						utils.alertMessage('管理员绑定成功!', true);
					} else {
						utils.alertMessage('管理员修改成功!', true);
					}
					modalEl.modal('hide');
					dt.ajax.reload();
				} else {
					utils.alertMessage(res.msg, !res.error);
				}
			})
				.always(() => {
					endLoading();
				});
		});

		modalEl.on('click', '#delete-btn', function (e) {
			utils.confirmModal({
				msg: `确认删除该管理员吗?`,
				cb: (modal, btn) => {
					const endLoading = utils.loadingBtn(btn);
					$.ajax({
						url: 'weixinv2/deleteAuditor',
						type: 'POST',
						data: {
							wechatId: wxId
						},
						success: (msg) => {
							if (!msg.error) {
								table.reload();
								modal.modal('hide');
								modalEl.modal('hide');
							}
							utils.alertMessage(msg.msg, !msg.error);
						},
						complete: () => {
							endLoading();
						}
					});
				}
			});
		});

		$('#submit').on('click', addWxAccount);

		$('#addWechat').on('hidden.bs.modal', clearModal);

		$('#table').on('click', '.sync', (e) => {
			const endFn: Function = utils.loadingBtn($(e.target));
			// const wxAppSecret: string = $(e.target).closest('.row-input').attr('data-wxAppSecret');
			const wxid: string = $(e.target).closest('.row-input').attr('data-id');
			sync(wxid, endFn);
		});

		$('#table').on('click', '.dele', (e) => {
			const id: string = $(e.target).closest('.row-input').attr('data-id');
			dele(id);
		});

		tables.bindPageChange(dt, $('#page-change'));



	}

	function addWxAccount() {
		const sendData = {} as ISendObj;
		const el: JQuery = $('#addWechat');
		let flag: boolean = false;
		for (let v of el.find('input[type=text]').toArray()) {
			const element = $(v);
			const data = element.data();
			const name: string = element.prop('name');
			const value: string = element.val();
			sendData[name] = value;
			if (data.required && element.val() === '') {
				utils.alertMessage(element.parent().prev().text() + '不能为空!');
				flag = true;
				return;
			}
		}
		const checkInput: JQuery = el.find('input:checked');
		checkInput.each((i, e) => {
			sendData[$(e).attr('name')] = $(e).val();
		});
		sendData.coverLocalUri = imgUrl;
		const endSubmit = utils.loadingBtn($('#submit'));
		const endConnet = utils.loadingBtn($('#connect-btn'));
		// const p = utils.alertMessage('正在关联公众号', true, false);
		$.ajax({
			url: 'weixinv2/addWechatCredential',
			type: 'POST',
			data: utils.cleanObject(sendData),
			success: function (data) {
				// p.remove();
				if (!data.error) {
					$('#addWechat').modal('hide');
					// table.draw();
					table.reload(true);
					clearModal();
				}
				utils.alertMessage(data.msg, !data.error);
			},
			complete: () => {
				endSubmit();
				endConnet();
			}
		});
	}

	function clearModal() {
		const el = $('#addWechat');
		el.find('input[type="text"]').val('');
		el.find('input[data-default="true"]').click();
		$('#imgcover').css('backgroundImage', `url(${ctx}/images/upqrcode.png)`);
		imgUrl = null;
	}


    /**
     *
     *
     * @param {string} wxAppId 发给后台的id
     * @param {Function} endFn 结束‘加载中’的函数
     */
	function sync(wxid: string, endFn: Function) {
		$.ajax({
			url: 'weixinv2/resync',
			data: {
				'credentialId': wxid
			},
			type: 'post',
			success: (data) => {
				endFn();
				utils.alertMessage(data.msg, !data.error);
				if (!data.error) {
					table.reload(true);
				}
			},
			complete: () => {
				endFn();
			}
		});
	}

    /**
     *
     *
     * @param {string} id 发给后台的id
     */
	function dele(id: string) {
		utils.confirmModal({
			msg: '您确定要解除绑定么？',
			text: '解除绑定',
			cb: (modal, btn) => {
				const endLoading = utils.loadingBtn(btn);
				$.ajax({
					url: 'weixinv2/deleteWechatCredential',
					data: {
						wechatId: id
					},
					type: 'post',
					success: function (data) {
						if (!data.error) {
							table.reload(true);

							modal.modal('hide');
						}
						utils.alertMessage(data.msg, !data.error);
					},
					complete: () => {
						endLoading();
					}
				});
			}
		});
	}
}
