import * as tables from 'new-table';
import * as ntables from 'tables';
import 'daterangepicker';
import { bindEnter, alertMessage, cleanObject, loadingBtn, renderSimpleTime, forbidEnterAutoSubmit } from 'utils';
import 'select';
import * as uploads from 'upload';
import './index.less';
namespace SuperadminRehearsalTemplateIndex {
	$(function () {
		initTable();
		initUpload();
	});
	enum operation {
		add,
		edit
	}
	let saveOp, saveGroupId, saveStatus, upload, table;
	const $wrap = $('#info-wrap');
	const keywordEl = $('#keyword');
	let uploadMsg = [];
	let allTData = [];

	function initUpload() {
		upload = new uploads.DelayUpload({
			multiple: true,
			name: 'file',
			accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12',
			url: 'superadmin/rehearsalTemplate/uploadExcel',
			saveBtn: $('#upload-wrap'),
			onAllComplete: (succeeded, failed) => {
				uploadRoot.modal('hide');
				table.reload();
				$wrap.empty();
				let allTotal = 0;
				let allSuccess = 0;
				let allFail = 0;
				uploadMsg.forEach(v => {
					allTotal += v.totalNumber;
					allSuccess += v.successNumber;
					allFail += v.failNumber;
					const dataL=v.list;
					dataL.forEach(m =>{
						allTData.push(m);
					});
				});
				uploadMsg = [];
				const hrefStr='点击<a id="exportFail" href="javascript:;">下载失败列表</a>';
				alertMessage(`总共上传${allTotal}条，成功导入${allSuccess}条，失败${allFail}条，${hrefStr}`, '提示', false);
				allTotal=0;allSuccess=0;allFail=0;
			},
			save: (id, name) => {
				const el = $(`<p><span id='info-name'>${name}</span>
								<span aria-hidden='true' class='glyphicon glyphicon-trash info-del' data-fileId='${id}'></span></p>`);
				$wrap.append(el);
				el.find('.info-del').on('click', function () {
					upload.uploader.cancel($(this).data('fileid'));
					$(this).parent('p').remove();
				});
			},
			success: (msg) => {
				uploadMsg.push(msg.data);
			},
			cancel: () => {
				$wrap.empty();
			}
		});
		bindExportFailEvent();
	}
	const tableEl = $('#table');
	function initTable() {
		table = new tables.Table({
			el: tableEl,
			options: {
				serverSide: true,
				paging: true,
				ajax: {
					url: 'superadmin/rehearsalTemplate/list',
					type: 'POST',
					dataType: 'json',
					dataSrc: (data) => {
						return data.rows;
					},
					data: (data) => {
						return cleanObject({
							page: ntables.getPage(data),
							rows: parseInt($('#page-change').val().trim()),
							status: $.trim($('#status').val()),
							keyword: $.trim(keywordEl.val())
						});
					}
				},
				initComplete: initcomplete,
				columns: [
					{ data: 'content', className: 'force-width prevent', createdCell: createShowCorpus, width: (ntables as any).VARIABLES.width.icon },
					{ data: 'content', title: '模板', render: renderContent },
					{ data: 'status', title: '状态', render: renderStatus },
					{ data: 'questionNum', title: '复述问法', render: renderReview },
					{ data: 'updateTime', title: '更新时间', render: renderSimpleTime, width: (ntables as any).VARIABLES.width.simpleTime },
					{ data: 'groupId', title: '操作', className: 'prevent', render: renderBtns }
				]
			}
		});
	}
	function createShowCorpus(cell, cellData, rowData, rowIndex, colIndex) {
		const el = $(cell);
		if (cellData.length > 1) {
			el.addClass('more-template').html(`<i class='fa fa-plus-square'></i>`);
		} else {
			el.addClass('disabled').html(`<i class='fa fa-plus-square'></i>`);
		}
	}
	function renderContent(d) {
		return d[0].template;
	}
	function renderStatus(text) {
		switch (text) {
			case 1:
				return '已启用';
			case 0:
				return '已停用';
			default:
				return '';
		}
	}
	function renderReview(d, type, row) {
		return `<a href='javascript:;' style='color:#337ab7;text-decoration:underline' class='review-q' data-groupid='${row.groupId}'>${d}</a>`;
	}
	function renderBtns(d, type, row) {
		const rStatus = row.status;
		let sBtn;
		switch (rStatus) {
			case 0:
				sBtn = '启用';
				break;
			case 1:
				sBtn = '停用';
				break;
			default:
				sBtn = '';
				break;
		}
		return `<div data-id='${d}' data-status='${row.status}' data-num='${row.questionNum}' data-content='${row.content}'>
			<a href='javascript:;' title='编辑' style='color:#337ab7' class='edit-single'>编辑</a>
			<span>|</span>
			<a href='javascript:;' title='删除' style='color:#337ab7' class='del-single'>删除</a>
			<span>|</span>
			<a href='javascript:;' title='${sBtn}' style='color:red' class='change-status'>${sBtn}</a>
		</div>`;
	}
	function initcomplete() {
		// 添加模态框中功能
		bindAddEvent();
		// bindAddE();
		bindAddD();
		bindSaveT();
		// 查询
		bindSearchEvent();
		// 绑定回车查询时间
		bindEnter(keywordEl, () => {
			table.reload();
		});
		// 导入
		bindUploadModalEvent();
		bindUploadEvent();

		// 校验模板合格
		bindQualifyTemplate();
		// 导出
		bindExportEvent();
		// 批量删除
		bindBatchDeleteEvent();

		//  以下表格中的相关功能
		// 点击加号效果
		bindGetTemplatesEvent();
		// 启用/禁用
		bindChangeStatusEvent();
		// 查看复述问句
		bindReviewQueEvent();
		// 删除单个
		bindDeleteSingleEvent();
		// 删除模板
		bindDelTEvent();
		// 删除模板和复述
		bindDelTAndQEvent();
		// 编辑模板
		bindEditEvent();

		clearAddModal();
		forbidEnterAutoSubmit();
	}
	function bindExportFailEvent() {
		$('body').on('click','#exportFail', function () {
			let params = [];
			allTData.forEach(v => {
				params.push({ groupId: v.groupId, templateContent: v.templateContent });
			});
			const form=document.createElement('form');
			const node=document.createElement('input');
			form.action='superadmin/rehearsalTemplate/exportFailDataExcel';
			form.method='post';
			node.name='failExcelList';
			node.value=JSON.stringify(params);
			form.appendChild(node.cloneNode());
			form.style.display='none';
			document.body.appendChild(form);
			form.submit();
			uploadMsg = [];
			allTData = [];
		});
	}
	// 查询
	function bindSearchEvent() {
		$('#search-btn').on('click', () => {
			table.reload();
		});
	}
	// 表格中的加号效果（同时只能显示一条）
	let tempContent;
	function bindGetTemplatesEvent() {
		tableEl.on('click', '.more-template', function () {
			const $shownTrs=tableEl.find('tr.shown').not($(this).closest('tr'));
			$shownTrs.toArray().forEach(v=>{
				const r = tableEl.DataTable().row(v);
				r.child.hide();
				$(v).removeClass('shown');
				$(v).find('.more-template').html(`<i class='fa fa-plus-square'></i>`);
			});

			const tr = $(this).closest('tr');
			const row = tableEl.DataTable().row(tr);
			if (row.child.isShown()) {
				row.child.hide();
				tr.removeClass('shown');
				$(this).html(`<i class='fa fa-plus-square'></i>`);
			}
			else {
				const d: any = (row.data() as any).content;
				tempContent = [...d];
				tempContent.shift();
				row.child(format(tempContent)).show();
				tr.next().find('td').each(function () {
					$(this).css('border-top', 'none');
				});
				tr.addClass('shown');
				$(this).html(`<i class='fa fa-minus-square'></i>`);
			}
		});
	}
	function format(d) {
		let rowsStr = '';
		d.forEach(v => {
			rowsStr += `<div class='row-border'>${v.template}</div>`;
		});
		return rowsStr;
	}
	// 点击添加按钮
	const addModalRoot = $('#add-modal');
	function bindAddEvent() {
		$('#add-btn').on('click', () => {
			saveOp = operation.add;
			addModalRoot.find('.modal-title').text('添加复述模板');
			addModalRoot.find('#add-submit-btn').text('确认');
			addModalRoot.modal('show');
		});
	}
	// 点击添加模态框中的加号
	const rInputEl = $('.review-input input');
	let repeatFlag;
	function bindQualifyTemplate() {
		$('.add-repeat').on('click', function() {
			const thisT = $.trim(rInputEl.val());// 当前模板
			// 前端为空校验
			if(thisT===''){
				rInputEl.addClass('error-validate').focus();
				const $msg=$(this).closest('.form-group').find('.validate-msg');
				$msg.find('.validate-ctx').text('请输入模板内容！');
				$msg.css('display', 'inline-block');
				return;
			}else{
				$('.validate-msg').css('display', 'none');
			}
			repeatFlag = false;
			validateRepeat(thisT);
			// 前端重复校验
			if (repeatFlag) {
				rInputEl.addClass('error-validate').focus();
				const $msg=$(this).closest('.form-group').find('.validate-msg');
				$msg.find('.validate-ctx').text('模板重复！');
				$msg.css('display', 'inline-block');
				return;
			}
			// 前端简单校验合格后追加此复述模板
			rInputEl.val('').removeClass('error-validate').focus();
			addRepeatQuestion(thisT);
		});
	}
	// 判断校验成功的模板是否重复
	function validateRepeat(thisT) {
		const otherTs = $('.review-input .r-ctx');
		otherTs.toArray().forEach(v => {
			if (thisT === $(v).val()) {
				repeatFlag = true;
				return false;
			}
		});
	}
	function addRepeatQuestion(slaveQuestion) {
		$('#add-modal .form-horizontal').append(concactHtml(`${slaveQuestion}`));
	}
	// 点击添加模态框中的保存按钮
	function bindSaveT() {
		$('#add-submit-btn').on('click', function () {
			let cTs = [];
			const $msgBoxes=$('#add-modal input.correct-validate');
			// 阻止为空的进行保存
			if($msgBoxes.length===0){
				return;
			}
			// 有重复的不允许保存
			const contentsArray=$msgBoxes.toArray();
			let tempTs=[];

			contentsArray.forEach(v => {
				cTs.push({
					template: $(v).val()
				});
				tempTs.push($(v).val());
			});
			let empFlag=false;
			tempTs.forEach(v=>{
				if(v===''){
					empFlag=true;
					return;
				}
			});
			if(empFlag){
				alertMessage('添加的模板不能为空！');
				return;
			}
			// if(isRepeat(tempTs)){
			// 	alertMessage('模板不允许重复，请检查！');
			// 	return;
			// }
			const endloading = loadingBtn($(this));
			if (saveOp === operation.add) {
				$.ajax({
					url: 'superadmin/rehearsalTemplate/addTemplate',
					method: 'POST',
					contentType:'application/json',
					data:JSON.stringify({
						content:cTs
					}),
					success: (msg) => {
						if (!msg.error) {
							table.reload();
							addModalRoot.modal('hide');
							alertMessage(msg.msg, !msg.error);
						}else{
							showErrors(msg);
						}
					},
					complete: () => {
						endloading();
					}
				});
			}
			if (saveOp === operation.edit) {
				$.ajax({
					url: 'superadmin/rehearsalTemplate/updatePair',
					method: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						groupId: saveGroupId,
						content: cTs,
						status: saveStatus
					}),
					success: (msg) => {
						if (!msg.error) {
							table.reload();
							addModalRoot.modal('hide');
							alertMessage(msg.msg, !msg.error);
						}else{
							showErrors(msg);
						}
					},
					complete: () => {
						endloading();
					}
				});
			}
		});
	}
	// 判断数组中是否有重复元素
	function isRepeat(ary){
		const nary=[];
		ary.forEach(v=>{
			if(nary.length===0){
				nary.push(v);
			}else{
				nary.forEach(n=>{
					if(v!==n){
						nary.push(v);
					}
				});
			}
		});
		if(ary.length===nary.length){
			return false;
		}else{
			return true;
		}
	}
	// 点击保存后端返回对应的错误提示显示
	function showErrors(msg){
		// 对应的框下给出错误提示 reason template
		const msgErrors=msg.data;// 后端返回的错误信息
		if(!msgErrors){
			alertMessage('后端数据异常',false);
			return;
		}
		const $moreMsgBoxes=$('.more-t');// 前端所有的模板的输入框
		const errIds=[];// 后端错误的id
		msgErrors.forEach(v=>{
			// 前端显示每条错误信息
			errIds.push(v.id);
			const $thisMsgBox=$($moreMsgBoxes[v.id]);
			$thisMsgBox.find('.validate-ctx').text(v.reason);
			$thisMsgBox.find('.validate-msg').css('display','inline-block');
		});
		// 把正确的模板下面对应的错误提示框隐藏
		const $rightMsgBoxes=[];
		$moreMsgBoxes.toArray().forEach((currentValue,index)=>{
			let sameFlag=false;
			for(let i=0;i<errIds.length;i++){
				if(index===errIds[i]){
					sameFlag=true;
					return;
				}
			}
			if(!sameFlag){
				$rightMsgBoxes.push(currentValue);
			}
		});
		$rightMsgBoxes.forEach(v=>{
			$(v).find('.validate-msg').css('display','none');
		});
	}
	// 模态框关闭时，清空
	function clearAddModal() {
		addModalRoot.on('hidden.bs.modal', () => {
			rInputEl.val('');
			$('.more-t').remove();
			saveGroupId = '',
			saveStatus = '';
			rInputEl.removeClass('error-validate');
			$('.validate-msg').hide();
		});
	}
	// 添加时点击删除
	function bindAddD() {
		addModalRoot.on('click', '.add-delete', function () {
			const inpEl = $(this).parents('.more-t').remove();
		});
	}

	// 点击批量上传按钮
	const uploadRoot = $('#upload-doc-modal');
	function bindUploadModalEvent() {
		$('#batch-upload-btn').on('click', () => {
			uploadRoot.modal('show');
		});
	}
	// 批量上传模态框中的上传按钮
	function bindUploadEvent() {
		$('#upload').on('click', () => {
			upload.uploadAllFile();
		});
	}
	// 点击导出按钮
	function bindExportEvent() {
		$('#export-btn').on('click', function () {
			const keyword = $.trim(keywordEl.val());
			const status = $('#status').val();
			window.location.href = `${ctx}/superadmin/rehearsalTemplate/exportExcel?keyword=${keyword}&status=${status}`;
		});
	}
	// 点击批量删除按钮
	const delModalRoot = $('#del-modal');
	let delGroupIds = [];
	let singleType;
	function bindBatchDeleteEvent() {
		$('#batch-del-btn').on('click', function () {
			delGroupIds = [];
			// 获取选中行，计算总共的复述问法，修改页面，显示模态框
			const seletedRows = ntables.getSelected(tableEl.DataTable());
			let batchNum = 0;
			seletedRows.forEach(v => {
				delGroupIds.push(v.groupId);
				batchNum += v.questionNum;
			});
			$('.inner-title').text('选中的');
			$('.q-num').text(batchNum);
			delModalRoot.modal('show');
		});
	}
	/*表格中的功能*/
	// 表格中的删除
	function bindDeleteSingleEvent() {
		tableEl.on('click', '.del-single', function () {
			delGroupIds = [];
			const el = $(this).parent('div');
			delGroupIds.push(el.data('id'));
			const num = el.data('num');
			$('.inner-title').text('该');
			$('.q-num').text(num);
			delModalRoot.modal('show');
		});
	}
	// 仅删除模板
	function bindDelTEvent() {
		$('#del-template-only').on('click', function () {
			singleType = 0;
			const endLoading = loadingBtn($(this));
			delAjax(endLoading);
		});
	}
	// 删除模板和复述
	function bindDelTAndQEvent() {
		$('#del-t-q').on('click', function () {
			singleType = 1;
			const endLoading = loadingBtn($(this));
			delAjax(endLoading);
		});
	}
	function delAjax(endLoading) {
		$.ajax({
			url: 'superadmin/rehearsalTemplate/deleteAllTemplate',
			type: 'POST',
			data: {
				groupIds: delGroupIds.join(','),
				type: singleType
			},
			success: (msg) => {
				if (!msg.error) {
					table.reload();
					delModalRoot.modal('hide');
				}
				alertMessage(msg.msg, !msg.error);
			},
			complete: () => {
				endLoading();
			}
		});
	}
	// 表格中的复述问法预览
	let reviewTableEl = $('#review-table');
	let reviewTable;
	let reviewTableD;
	function bindReviewQueEvent() {
		tableEl.one('click', '.review-q', function () {
			// 获取groupId，初始化表格，显示模态框
			const rGroupId = $(this).data('groupid');
			reviewTable = new tables.Table({
				el: reviewTableEl,
				options: {
					serverSide: true,
					paging: true,
					ajax: {
						url: 'superadmin/rehearsalTemplate/findRehearsalReview',
						type: 'POST',
						dataType: 'json',
						dataSrc: (data) => {
							return data.rows;
						},
						data: (data) => {
							return cleanObject({
								page: ntables.getPage(data),
								size: parseInt($('#page-change').val().trim()),
								groupId: rGroupId
							});
						}
					},
					initComplete: initReviewComplete,
					columns: [
						{ data: 'rehearsalContent', title: '操作1' },
						{ data: 'updateTime', title: '更新时间', render: renderSimpleTime, width: (ntables as any).VARIABLES.width.simpleTime }
					]
				}
			});
			reviewTableD = reviewTableEl.DataTable();
			$('#review-q-modal').modal('show');
		});
	}
	function initReviewComplete() {
		tableEl.on('click', '.review-q', () => {
			const rGroupId = $(this).data('groupid');
			reviewTable.reload();
			$('#review-q-modal').modal('show');
		});
	}
	// 表格中的启动/禁用
	function bindChangeStatusEvent() {
		tableEl.on('click', '.change-status', function () {
			const el = $(this).parent('div');
			const groupId = el.data('id');
			const status = el.data('status') === 0 ? 1 : 0;
			$.ajax({
				url: 'superadmin/rehearsalTemplate/setStatus',
				method: 'POST',
				data: {
					groupId: groupId,
					status: status
				},
				success: (msg) => {
					if (!msg.error) {
						table.reload();
					}
					alertMessage(msg.msg, !msg.error);
				}
			});
		});
	}
	// 表格中的编辑
	function bindEditEvent() {
		tableEl.on('click', '.edit-single', function () {
			saveOp = operation.edit;
			addModalRoot.find('.modal-title').text('编辑复述模板');
			addModalRoot.find('#add-submit-btn').text('保存');

			saveGroupId = $(this).parent('div').data('id');
			saveStatus = $(this).parent('div').data('status');
			$.ajax({
				url: 'superadmin/rehearsalTemplate/toUpdateTemplate',
				method: 'POST',
				data: {
					groupId: saveGroupId
				},
				success: (msg) => {
					if (!msg.error) {
						const cts = msg.data.content;
						let ctsHmtl = '';
						cts.forEach(v => {
							ctsHmtl += concactHtml(v.template);
						});
						$('#add-modal .form-horizontal').append($(ctsHmtl));
						addModalRoot.modal('show');
					} else {
						alertMessage(msg.msg, false);
						return;
					}
				}
			});

		});
	}
	function concactHtml(slaveQuestion) {
		return `<div class="form-group more-t">
					<div class="cloud-input-content review-input">
						<input value="${slaveQuestion}" class="form-control input-md r-ctx correct-validate" type="text"/>
						<span class='add-operation'>
							<i class="cloud-fa-icon fa fa-times-circle add-delete" title='删除复述问法'></i>
						</span>
					</div>
					<span class='validate-msg'>
						<img src='${ctx}/images/validate/error.png'/>
						<span class='validate-ctx'></span>
					</span>
				</div>`;
	}
}

