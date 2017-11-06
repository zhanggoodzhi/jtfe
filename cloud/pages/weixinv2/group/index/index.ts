import './index.less';
import 'new-table';
import { alertMessage, loadingBtn } from 'utils';
import * as tables from 'tables';
namespace Weixinv2Index {
	let table: DataTables.Api;
	let t: tables.Table;
	$(() => {
		const btn = $('#sync-btn'),
			account = $('#weixin-account');
		initTable();
		account.on('change', (e) => {
			const val = $(e.currentTarget).val();
			if (val === '') {
				btn.prop('disabled', 'true');
			} else {
				btn.prop('disabled', '');
			}
		});
	});

    /**
     * 初始化表格
     */
	function initTable() {
		table = $('#table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					select: false,
					ajax: {
						url: 'weixinv2/group/listUser',
						type: 'GET',
						data: (data) => {
							return {
								page: tables.getPage(data),
								rows: data.length,
								credentialId: $('#weixin-account').val(),
								groupId: $('#weixin-group').val()
							};
						},
						dataSrc: data => data.rows
					},
					initComplete: initComplete,
					columns: [
						{ data: 'key.headimgurl', title: '头像', render: renderImg },
						{ data: 'key.credential.wxName', title: '公众号' },
						{ data: 'key.nickname', title: '昵称', createdCell: tables.createAddTitle },
						{ data: 'value', title: '分组' },
						{ data: 'key.city', title: '城市' }
					]
				}
			)
		);
		t = new tables.Table(table);
	}
	function renderImg(text) {
		return '<img src="' + text + '" class="head-img" alt="头像"/>';
	}
    /**
     *
     *
     * @param {HTMLElement} that
     * @returns
     */
	function selectChange(that: HTMLElement) {
		const group = $('#weixin-group'),
			account = $(that);
		group.empty();
		group.append('<option value="" >全部分组</option>');
		if (!account.val()) {
			return;
		}
		$.ajax({
			url: 'weixinv2/group/listGroup',
			type: 'GET',
			data: {
				credentialId: account.val()
			},
			success: function (data) {
				const d = data.rows;
				d.forEach(function (value, index) {
					group.append('<option value=' + value.id + ' >' + value.name + '</option>');
				});
			}
		});
	}
	function initComplete() {
		const btn = $('#sync-btn'),
			account = $('#weixin-account');

		$('#search-btn').on('click', function () {
			// if (!$('#weixin-account').val() && $('#weixin-group').val()) {
			//     return;
			// }
			// table.draw();
			t.refresh(true);
		});
		$('#weixin-account').on('change', function () {
			selectChange(this);
		});

		btn.on('click', () => {
			const end = loadingBtn(btn);
			$.ajax('weixinv2/resyncUserAndGroup', {
				method: 'POST',
				data: {
					credentialId: account.val()
				}
			})
				.done(res => {
					alertMessage(res.msg, !res.error);
					if (!res.error) {
						table.draw();
					}
				})
				.always(() => {
					end();
				});
		});
		tables.bindPageChange(table, $('#page-change'));
	}
}
