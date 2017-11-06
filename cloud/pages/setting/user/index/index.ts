import * as utils from 'utils';
import * as nTables from 'new-table';
import * as tables from 'tables';
import './index.less';
import 'multiselect';
import 'select';
namespace SettingUserIndex{
	$(function () {
		/*$('.multiselect').multiselect({
			buttonWidth: '330px'
		});
		$('#addUserButton').mouseenter(function () {
			$('#addUserButton').popover('toggle');
		});
		$('#addUserButton').mouseleave(function () {
			$('#addUserButton').popover('hide');
		});
		$('#addUser').on('hidden.bs.modal', function(){
			$('#email_input').val('');
			$('#mobile_input').val('');
			$('#alias_input').val('');
			$('#pwd_input').val('');
			$('#repwd_input').val('');
			$('#roleSelect').multiselect('clearSelection');
			$('#roleSelect').multiselect('refresh');
			$('#qq_input').val('');
			$('#wxAppSecret-add-input').val(null).trigger('change');
		});
		$('#addUser').on('shown.bs.modal', function(){
			$('#wxAppSecret-add-input').select2({
				placeholder: '请选择微信公众号',
				allowClear: true,
				minimumResultsForSearch: Infinity
			});
		});

		$('#editUser').on('shown.bs.modal', function(){
			$('#wxAppSecret-edit-input').select2({
				placeholder: '请选择微信公众号',
				allowClear: true,
				minimumResultsForSearch: Infinity
			});
		});*/
		initTable();
	});
	const tableEl=$('#usertable');
	let userTable;
	function initTable(){
		userTable=new nTables.Table({
			el:tableEl,
			options:{
				serverSide:true,
				// paging:true,
				ajax: {
					url: 'setting/user/lowerAdmin/list',
					method: 'POST',
					dataSrc: data => data.msg,
					data: (data:any) => {
						return '';
						/*return utils.cleanObject({
							page: tables.getPage(data),
							rows: data.length
						});*/
					}
				},
				columns: [
					{data:'alias',title:'名称'},
					{data:'email',title:'email'},
					{data:'mobile',title:'手机号'},
					{data:'alias',title:'成员角色'},
					{data:'alias',title:'微信公众号'},
					{data:'id',title:'操作',render:renderBtns,className:'prevent'}
				],
				initComplete: initComplete
			}
		});
	}
	function renderBtns(id){
		return `<div data-id='${id}'><i class='fa fa-edit view-edit' title='编辑' style='cursor:pointer'></i><i class='fa fa-trash view-delete' title='删除' style='cursor:pointer'></i></div>`;
	}
	function initComplete(){
		bindEditEvent();
		bindDelEvent();
	}
	// 编辑
	function bindEditEvent(){
		tableEl.on('click','.view-edit',function(){
			const id=$(this).parent('div').data('id');

		});
	}
	function bindEditSubmitEvent(){
		/*$.ajax({
			url:'setting/user/lowerAdmin/delete',
			method:'POST',
			data:{
				userids:id
			},
			success:(msg)=>{
				utils.alertMessage('ddd');
			}
		});*/
	}
	// 添加
	function bindAddEvent(){
		
	}
	// 删除
	function bindDelEvent(){
		tableEl.on('click','.view-delete',function(){
			const id=$(this).parent('div').data('id');
			utils.confirmModal({
				msg: `确认删除选中的成员吗?`,
				cb: (modal, btn) => {
					const endLoading = utils.loadingBtn(btn);
					$.ajax({
						url:'setting/user/lowerAdmin/delete',
						type:'POST',
						data:{
							userids:id
						},
						success: (msg) => {
							if (!msg.error) {
								userTable.reload();
								modal.modal('hide');
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
	}

	// function emailCheckUnique(){
	// 	let email = $('#email_input').val().trim();
	// 	$.post(/*appName + */'/register/isUniqueUserEmail', {
	// 			'email': email
	// 		}, function (data) {
	// 			if (data === '2') {
	// 				new PNotify({
	// 					title: '注册失败',
	// 					text: '该邮箱已注册，请直接登录',
	// 					type: 'error'
	// 				});
	// 				return;
	// 			}
	// 		});
	// }
	// function tellCheckUnique(){
	// 	let mobile = $('#mobile_input').val().trim();
	// 	/**
	// 	 * 手机唯一验证
	// 	 */
	// 	$.post(/*appName + */'/register/isUniqueUserMobile', {
	// 		'mobile': mobile
	// 	}, function (data) {
	// 		if(data ==='2'){
	// 			new PNotify({
	// 				title: '注册失败',
	// 				text: '该手机已注册，请直接登录',
	// 				type: 'error'
	// 			});
	// 			return;
	// 		}
	// 	});
	// }
	// let trhtml;
	// function addRecordDynamically(id, alias, email, molile, role,regWxName) {
	// 	trhtml = '<tr id="record-' + id + '" class="even pointer">';
	// 	if (alias ===''){
	// 		alias = '未指定';
	// 	}
	// 	if (regWxName ===''){
	// 		regWxName = '未指定';
	// 	}
	// 	trhtml += '<td class=" ">' + alias + '</td>';
	// 	trhtml += '<td class=" ">' + email + '</td>';
	// 	trhtml += '<td class=" ">' + molile + '</td>';
	// 	trhtml += '<td class=" ">' + role + '</td>';
	// 	trhtml += '<td class=" ">' +regWxName + '</td>';
	// 	trhtml += '<td class="last">';
	// 	trhtml += '<a onclick="editUser(\'' + id +
	// 		'\')" href="javascript:;">编辑</a>';
	// 	trhtml += '<a onclick="delUser(\'' + id +
	// 		'\')" href="javascript:;">删除</a>';
	// 	trhtml += '</td>';
	// 	trhtml += '</tr>';
	// 	$('#usertable').append(trhtml);
	// }

	// function editRecordDynamically(id, alias, email, molile, role,wxName) {
	// 	if (alias ===''){
	// 		alias = '未指定';
	// 	}
	// 	if (wxName === '') {
	// 		wxName = '未指定';
	// 	}
	// 	trhtml = '<td class=" ">' + alias + '</td>';
	// 	trhtml += '<td class=" ">' + email + '</td>';
	// 	trhtml += '<td class=" ">' + molile + '</td>';
	// 	trhtml += '<td class=" ">' + role + '</td>';
	// 	trhtml += '<td class=" ">' + wxName + '</td>';
	// 	trhtml += '<td class="last">';
	// 	trhtml += '<a onclick="editUser(\'' + id +
	// 		'\')" href="javascript:;">编辑</a>';
	// 	trhtml += '<a onclick="delUser(\'' + id +
	// 		'\')" href="javascript:;">删除</a>';
	// 	trhtml += '</td>';

	// 	$('#record-' + id).html(trhtml);
	// }

	// function doReg() {
	// 	let email = $('#email_input').val().trim();
	// 	let mobile = $('#mobile_input').val().trim();
	// 	let pwd = $('#pwd_input').val().trim();
	// 	let repwd = $('#repwd_input').val().trim();
	// 	let alias = $('#alias_input').val().trim();
	// 	let qq = $('#qq_input').val().trim();
	// 	let credentialId=$.trim($('#wxAppSecret-add-input option:selected').val());
	// 	let regWxName=$.trim($('#wxAppSecret-add-input option:selected').text());
	// 	if (email === undefined || email === '') {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '请填写邮箱',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	} else {
	// 		let eReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
	// 		if (!eReg.test(email)) {
	// 			new PNotify({
	// 				title: '注册失败',
	// 				text: '电子邮箱格式不正确',
	// 				type: 'error'
	// 			});
	// 			return;
	// 		}
	// 	}
	// 	if (mobile === undefined || mobile === '') {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '请填写手机号',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	} else {
	// 		let reg = /^0?(13[0-9]|15[012356789]|18[02356789]|14[57]|17[0678])[0-9]{8}$/;
	// 		if (!reg.test(mobile)) {
	// 			reg = /^0?(170[059])[0-9]{7}$/;
	// 			if (!reg.test(mobile)) {
	// 				new PNotify({
	// 					title: '注册失败',
	// 					text: '手机号码格式不正确',
	// 					type: 'error'
	// 				});
	// 				return;
	// 			}
	// 		}
	// 	}

	// 	if (alias === '') {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '联系人不能为空',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	if (pwd === undefined || pwd === '') {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '密码不能为空',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	if (pwd.length < 6) {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '密码不能小于6位',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	if (repwd === undefined || repwd === '') {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '确认密码不能为空',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	if (repwd.length < 6) {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '确认密码不能小于6位',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	if (pwd !== repwd) {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '密码不一致',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	if ($('#roleSelect').val() === undefined || $('#roleSelect').val() === '') {
	// 		new PNotify({
	// 			title: '注册失败',
	// 			text: '成员角色不能为空',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	let roles = $('#roleSelect').val().join(',');


	// 	$.ajax({
	// 		url: 'user/app/doReg',
	// 		type: 'POST',
	// 		data: {
	// 			'email': email,
	// 			'mobile': mobile,
	// 			'pwd': pwd,
	// 			'roles': roles,
	// 			'alias': alias,
	// 			'qq': qq,
	// 			'credentialId':credentialId
	// 		},
	// 		success: function (data) {
	// 			PNotify.removeAll();
	// 			if (data.state === 'success') {
	// 				new PNotify({
	// 					title: '注册成功',
	// 					text: '您已成功注册应用成员',
	// 					type: 'success'
	// 				});
	// 				$('#email_input').val('');
	// 				$('#mobile_input').val('');
	// 				$('#pwd_input').val('');
	// 				$('#repwd_input').val('');
	// 				$('#alias_input').val('');
	// 				$('#qq_input').val('');
	// 				$('#wxAppSecret-add-input').val(null).trigger('change');
	// 				addRecordDynamically(data.msg, alias, email, mobile, data.role,regWxName);
	// 				$('#addUser').modal('hide');
	// 			} else {
	// 				new PNotify({
	// 					title: '注册失败',
	// 					text: data.msg,
	// 					type: 'error'
	// 				});
	// 			}
	// 		}
	// 	});

	// }
	// let userDialog = undefined;

	// function delUser(userId) {
	// 	userDialog = new BootstrapDialog.show({
	// 		title: '提示',
	// 		message: '确认删除?',
	// 		buttons: [{
	// 			label: '确认',
	// 			cssClass: 'btn-primary',
	// 			action: function () {
	// 				ajaxDeleteUser(userId);
	// 			}
	// 		}, {
	// 			label: '取消',
	// 			cssClass: 'btn-default',
	// 			action: function (dialogItself) {
	// 				dialogItself.close();
	// 			}
	// 		}]
	// 	});
	// }

	// function ajaxDeleteUser(userId) {
	// 	$.ajax({
	// 		url: 'user/app/delUser',
	// 		data: {
	// 			userId: userId
	// 		},
	// 		type: 'post',
	// 		success: function (data) {
	// 			if (data.state === 'success') {
	// 				userDialog.close();
	// 				new PNotify({
	// 					title: '删除成功',
	// 					text: '删除成功',
	// 					type: 'success'
	// 				});
	// 				$('#record-' + userId).remove();
	// 			} else {
	// 				new PNotify({
	// 					title: '删除失败',
	// 					text: '删除失败',
	// 					type: 'error'
	// 				});

	// 			}
	// 		}
	// 	});
	// }
	// // 点击编辑应用成员时，获取应用成员信息息
	// function editUser(userId) {
	// 	$.ajax({
	// 		url: 'user/app/getUser',
	// 		type: 'POST',
	// 		data: {
	// 			'userId': userId
	// 		},
	// 		success: function (data) {
	// 			if (data.state === 'success') {
	// 				$('#email_edit').val(data.email);
	// 				$('#mobile_edit').val(data.mobile);
	// 				$('#alias_edit').val(data.alias);
	// 				$('#qq_edit').val(data.qq);
	// 				$('#wxAppSecret-edit-input').val(data.extraData).trigger('change');// 获取值
	// 				let roles = new Array();
	// 				roles = data.roles.split(',');
	// 				$('.edit-options').attr('selected', 'false');
	// 				$('#roleSelect_edit').multiselect('select', roles);
	// 				$('#roleSelect_edit').multiselect('refresh');
	// 				$('#userid').val(userId);
	// 				$('#editUser').modal('toggle');
	// 			} else {
	// 				new PNotify({
	// 					title: '编辑失败',
	// 					text: '编辑失败',
	// 					type: 'fail'
	// 				});
	// 			}
	// 		}
	// 	});
	// }

	// function doEditUser() {
	// 	let userId = $('#userid').val().trim();
	// 	let email = $('#email_edit').val().trim();
	// 	let mobile = $('#mobile_edit').val().trim();
	// 	let alias = $('#alias_edit').val().trim();
	// 	let qq = $('#qq_edit').val().trim();
	// 	let credentialId=$.trim($('#wxAppSecret-edit-input option:selected').val());
	// 	let wxName=$.trim($('#wxAppSecret-edit-input option:selected').text());
	// 	if ($('#roleSelect_edit').val() === undefined || $('#roleSelect_edit').val() === '') {
	// 		new PNotify({
	// 			title: '编辑失败',
	// 			text: '成员角色不能为空',
	// 			type: 'error'
	// 		});
	// 		return;
	// 	}
	// 	let roles = $('#roleSelect_edit').val().join(',');
	// 	$('#editUser').modal('hide');

	// 	$.ajax({
	// 		url: 'user/app/doEditUser',
	// 		type: 'POST',
	// 		data: {
	// 			'userId': userId,
	// 			'email': email,
	// 			'mobile': mobile,
	// 			'roles': roles,
	// 			'alias': alias,
	// 			'qq': qq,
	// 			'credentialId':credentialId
	// 		},
	// 		success: function (data) {
	// 			PNotify.removeAll();

	// 			if (data.state ==='success'){
	// 				new PNotify({
	// 					title: '编辑成功',
	// 					text: '您已成功编辑应用成员',
	// 					type: 'success'
	// 				});
	// 				$('#userid').val('');
	// 				$('#email_edit').val('');
	// 				$('#mobile_edit').val('');
	// 				$('#alias_edit').val('');
	// 				$('#qq_edit').val('');
	// 				// $('#wxAppSecret_edit').val('');
	// 				$ ('#wxAppSecret-edit-input').val(null).trigger('change');
	// 				// location.reload();
	// 				editRecordDynamically(data.msg, alias, email, mobile, data.role, wxName);
	// 			} else {
	// 				new PNotify({
	// 					title: '失败',
	// 					text: /*data.msg*/ '失败',
	// 					type: 'error'
	// 				});

	// 			}
	// 		}
	// 	});

	// }
}

