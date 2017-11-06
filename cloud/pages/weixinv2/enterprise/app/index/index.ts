import './index.less';
import 'new-table';
import * as tables from 'tables';
import * as utils from 'utils';
import 'select';
namespace Weixinv2EnterpriseApp {
	let table: DataTables.Api;
	let t: tables.Table;
	let $table: JQuery;
	let mActionState: any;
	let eSendData: any = {};
	let modalRoot: any;
	declare const agentList;
	$(() => {
		initSelect();
		initTable();
	});
	function initSelect() {
		const $agentList = $('.agentid');
		$agentList.select2({
			data: agentList,
			placeholder: '请选择企业号管理组',
			multiple: true
		});
		$agentList.val('').trigger('change');
	}
    /**
     * 初始化表格
     */
	function initTable() {
		$table = $('#enterprise-app-table');
		table = $table.DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					select: false,
					ajax: {
						url: 'weixinv2/enterprise/app/list',
						type: 'GET',
						dataSrc: data => data.rows,
						data: (data) => {
							return {
								page: Math.floor((data.start + data.length) / data.length),
								rows: data.length
							};
						}
					},
					initComplete: initComplete,
					columns: [
						// { name: 'round_logo_url', data: 'round_logo_url', title: '应用LOG',render:renderLog},
						{ name: 'name', data: 'name', width: '20%', title: '应用名称'/*, createdCell: tables.createAddTitle */ },
						{ name: 'agentid', data: 'agentid', width: '20%', title: '应用ID', createdCell: tables.createAddTitle },
						{ data: 'credentialName', title: '', 'orderable': false, width: tables.VARIABLES.width.icon, className: 'show-g-corpus force-width prevent', createdCell: createShowCorpus/*, render: renderShowCorpus*/ },
						{ name: 'credentialName', data: 'credentialName', title: '管理组'/*, createdCell: tables.createAddTitle*/, render: renderAgents },
						{ name: 'action', title: '操作', render: renderBtns }
					]
				}
			)
		);
		t = new tables.Table(table);
	}
    /*function renderLog(data){
        return `<img src=${data} class='logIamge' style="background-image: url('${data}');"/>`;
    }*/
	function renderAgents(data) {
		return data[0];
	}
	function renderBtns(data, type, row) {
		return `<div class="row-input" data-d=' + ${row} + '><a style="padding-left:0;" class="btn btn-link btn-sm enterprise-app-del">删除</a><a class="btn btn-link btn-sm enterprise-app-edit">编辑</a></div>`;
	}
	function createShowCorpus(td: HTMLElement, cellDatA, rowData) {
		const el = $(td);
		if (cellDatA.length > 1) {
			el
				.addClass('show-corpus-td')
				.data('agentNames', cellDatA)
				.icon();
		}
		else {
			el.addClass('disabled')
				.icon();
		}
	}
	function initComplete() {
		modalRoot = $('#addEnterpriseApp');
		modalRoot.on('hidden.bs.modal', clearModal);
		tables.bindPageChange(table, $('#page-change'));
		// 添加应用
		$('#addEnterpriseAppBtn').on('click', () => {
			mActionState = 'create';
			modalRoot.modal('show').find('h4.modal-title').text('添加应用');
		});
		// 修改应用
		$table.on('click', '.enterprise-app-edit', editEnterpriseApp);
		// 保存
		modalRoot.on('click', '#submit', saveEnterpriseApp);
		// 删除enterprise-app-del
		$table.on('click', '.enterprise-app-del', delEnterpriseApp);
		// 左侧加号点击
		$table.on('click', '.show-corpus-td.show-g-corpus', function (e) {
			showCorpus(e);
		});
	}
	function showCorpus(e: JQueryEventObject) {
		// 符号切换
		const el = $(e.currentTarget),
			tr = el.parents('tr'),
			icon = el.icon();
		switch (icon.state) {
			case utils.IconState.plus:
				const trs = getTrs(el.data().agentNames, name);
				tr.after($(trs));
				icon.state = utils.IconState.minus;
				return;
			case utils.IconState.minus:
				icon.state = utils.IconState.plus;
				break;
			default:
				return;
		}
		clearTable();
	}
	// 把子管理组名称遍历为行显示。
	function getTrs(data, name: string) {
		let html = '';
		const len = table.columns().indexes().length;
		if (!data || data.length <= 0) {
			return `
                <tr class="cps-details">
                    <td colspan="${len}" class="text-center">无数据</td>
                </tr>`;
		}
		let tempData = [];
		for (let i = 0; i < data.length; i++) {
			if (i > 0) {
				tempData.push(data[i]);
			}
		}
		for (let v of tempData) {
			html += ` <tr class="cps-details">`;
			if (!v) {
				html += `<td></td>`;
			}
			else {
				html += `<td></td><td></td><td></td><td class="force-width">${v}</td><td></td>`;
			}
			html += `</tr>`;
		}
		return html;
	}
	// 重置表格中减号变为加号
	function clearTable() {
		$('.cps-details').remove();
		resetIcon($('#table tbody .show-corpus-td'));
	}
	function resetIcon(element?: JQuery) {
		Array.prototype.forEach.call(element, v => {
			const icon = $(v).icon();
			if (icon.state === utils.IconState.minus) {
				icon.state = utils.IconState.plus;
			}
		});
	}
	// 删除
	function delEnterpriseApp(row) {
		const el = $(this);
		const eData: any = table.row(el.parents('tr')).data();
		$.ajax({
			url: 'weixinv2/enterprise/app/delete',
			type: 'POST',
			data: {
				id: eData.id
			},
			success: function (data) {
				if (!data.error) {
					t.refresh(true);
				}
				utils.alertMessage(data.msg, !data.error);
			}
		});
	}
	// 修改应用
	function editEnterpriseApp(row) {
		mActionState = 'edit';
		const el = $(this);
		const data: any = table.row(el.parents('tr')).data();
		eSendData.id = data.id;
		let pIds = [];
		agentList.forEach(v => {
			data.credentialId.forEach(t => {
				if (v.id === t) {
					pIds.push(v.id);
				}
			});
		});
		$(modalRoot.find('#agent')).val(pIds).trigger('change');
		modalRoot.find('#wxEAppId').val(data.agentid);
		modalRoot.find('#wxEAppId').attr('readonly', 'readonly');
		modalRoot.modal('show').find('h4.modal-title').text('编辑应用');
	}
	// 清空模态框
	function clearModal() {
		const el = $('#addEnterpriseApp');
		el.find('input[type="text"]').val('');
		el.find('select').val('').trigger('change');
		el.find('#wxEAppId').removeAttr('readonly');
		eSendData.id = null;
	}
	// 点击模态框中的确认
	function saveEnterpriseApp() {
		const endLoading = utils.loadingBtn($('#submit'));
		let url: any;
		let sendData: any = {};
		sendData.credentialId = $('.agentid').val().join(',');
		if (mActionState === 'create') {
			sendData.agentid = $('#wxEAppId').val();
			if (!sendData.credentialId) {
				endLoading();
				utils.alertMessage('管理组不能为空！');
				return;
			} else if (!sendData.agentid) {
				endLoading();
				utils.alertMessage('应用ID不能为空！');
				return;
			}
			url = 'weixinv2/enterprise/app/getApplication';
		} else if (mActionState === 'edit') {
			if (!sendData.credentialId) {
				endLoading();
				utils.alertMessage('管理组不能为空！');
				return;
			}
			url = 'weixinv2/enterprise/app/edit';
			sendData.id = eSendData.id;
		}
		$.ajax({
			url: url,
			type: 'POST',
			data: utils.cleanObject(sendData),
			success: function (data) {
				if (!data.error) {
					$('#addEnterpriseApp').modal('hide');
					t.refresh(true);
					clearModal();
				}
				utils.alertMessage(data.msg, !data.error);
			},
			complete: () => { endLoading(); }
		});
	}
}
