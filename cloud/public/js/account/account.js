
function initDefaultAccountGrid() {
	var autoWidth = function(percent, minWidth, remainMinWidth){
		var tableWidth = $("body").width() - 2*22;

		remainWidth = tableWidth;
		var result = 0;
		if(remainMinWidth){
			result =  Math.max(remainWidth, remainMinWidth);
		}else if(minWidth){
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		}else{
			result = Math.round(tableWidth * percent);
		}
		
		remainWidth = remainWidth - result;
//		alert("table width = " + tableWidth + ", percent  = " + percent +", result  = " + result);
		return result;
	};
	
	var h=$("#mainContext").height()-110;
	var appId = $("#appIdSave").val();
	$("#defaultAccountTab")
			.datagrid(
					{
						width : '100%',
						height : document.body.scrollHeight-300,
						nowrap : true,
						rownumbers : true,
						singleSelect : true,
						toolbar : '#account_tb',
						url : appName
								+ "/account/queryAppDefaultAccount?appId="
								+ appId,
						columns : [ [
								{
									field : 'username',
									title : '&nbsp;&nbsp;用户名&nbsp;&nbsp;',
									width : autoWidth(0.1),
									sortable : true,
									align : 'center',
								},
								{
									field : 'alias',
									title : '&nbsp;&nbsp;别名&nbsp;&nbsp;',
									width : autoWidth(0.1),
									sortable : true,
									align : 'center',
								},
								{
									field : 'accountGroup.groupname',
									title : '&nbsp;&nbsp;分组名&nbsp;&nbsp;',
									width : autoWidth(0.1),
									sortable : true,
									align : 'center',
									formatter: function (value, rec) {
								         return rec.accountGroup.groupname;
								     }
								},
								{
									field : 'email',
									title : '&nbsp;&nbsp;邮箱&nbsp;&nbsp;',
									width : autoWidth(0.1),
									sortable : true,
									align : 'center',
								},
								{
									field : 'mobile',
									title : '&nbsp;&nbsp;电话&nbsp;&nbsp;',
									width : autoWidth(0.1),
									sortable : true,
									align : 'center',
								},
								{
									field : 'deleted',
									title : '&nbsp;&nbsp;是否可用&nbsp;&nbsp;',
									width : autoWidth(0.1),
									sortable : true,
									align : 'center',
									formatter: function (value, rec) {
										if(rec.deleted==1){
											rec.deleted = '不可用'
										}else{
											rec.deleted = '可用'
										}
								         return rec.deleted;
								     }
								},
								{
									field : 'opt',
									title : '&nbsp;&nbsp;操作&nbsp;&nbsp;',
									width : autoWidth(0.2),
									align : 'center',
									formatter : function(value, rec) {
										var btnEdit = '<a class="editDA" onclick="account_editDAData('+rec.id+')" href="/cloud/config/classifyTag">编辑</a>';
										var btnDel = '<a class="btnDelDA" onclick="account_btnDelDA(\''
												+ rec.id
												+ '\')" href="javascript:void(0)">删除</a>';
										return btnEdit + btnDel;
									}
								}, ] ],
						onLoadSuccess : function(data) {
							$('.editDA').linkbutton({
								text : '编辑',
								plain : true,
								iconCls : 'icon-edit'
							});
							$('.btnDelDA').linkbutton({
								text : '删除',
								plain : true,
								iconCls : 'icon-no'
							});
						}

					});
}

function account_reflash(){
	$("#account_tab").tab('show');
	
	initDefaultAccountGrid();
	$('#defaultAccountTab').datagrid('loadData',{ total: 0, rows: [] });
}
/**
 * 刷新
 */
function account_reject() {
	account_reflash();
}
/**
 * 编辑
 */
function account_editDAData(id){
	$.post(appName + "/account/AppDefaultAccountById?id=" + id, function(data) {
		$(data).each(function(key, val) {
			$("#idEdit").val(id);
			$("#usernameEdit").val(val.username);
			$("#groupidEdit").val(val.accountGroup.id);
			//$("#passwordEdit").val(val.password);
			$("#aliasEdit").val(val.alias);
			$("#emailEdit").val(val.email);
			$("#mobileEdit").val(val.mobile);
			if(val.deleted==1){
				$("#edit0").attr("checked","checked");
				$("#edit1").attr("checked",false);
			}else{
				$("#edit1").attr("checked","checked");
				$("#edit0").attr("checked",false);
			}
		});
	}, "json");
	$("#editAppDefaultAccountDiv").modal('toggle');
}


function account_append() {
	$.post(appName + "/account/accountGroupList", function(data) {
		if(data.length==0){
			new PNotify({
                title: '消息：',
                text: '请先在分组管理中添加分组！'
            });
		}else{
			
			$("#saveAppDefaultAccountDiv").modal('toggle');
		}
	});
}



/**
 * 删除
 */
var ids = [];
function account_btnDelDA(id) {
	ids = new Array();
	ids.push(id);
	var url = appName + "/account/doDeleteDefaultAccount";
	delData(url,ids);
}

function delData(url,ids){
	$("#delDiv").modal('toggle');
	document.getElementById('del_confirmed').onclick = function(){
		$.post(url, {
			'ids' : ids.join(",")
		}, function(data) {
			if (data == "1") {
				account_reflash();
				$("#delDiv").modal('hide');
			} else {
				new PNotify({
	                title: '错误：',
	                text: '删除数据失败！',
	                type: 'error'
	            });
			}
		});
	};
}

function check(status){
	checkUsernameAccount(status);
	return checkPasswordAccount(status) & checkAliasAccount(status) & checkEmailAccount(status) & checkEmailAccount(status) & checkMobileAccount(status);
}

function checkUsernameAccount(status){
	var username = $("#username"+status).val();
	var obj = $("#username"+status+"Msg");
	if(username==null||username===""){
		obj.html("用户名不能为空！");
		obj.css("color","rgb(243, 69, 69)");
	}else{
		var appId = $("#appIdSave").val();
		var url = appName + "/account/checkUserName";
		var id=null;
		if(status==='Edit'){
			id=$("#idEdit").val();
		}
		$.ajax({
			url:url,
			type:'POST',
			data:{"username":username,"appId":appId,"id":id},
			dataType:'json',
			success:function(data){
				if(data==1){
					obj.html("用戶名可以使用");
					obj.css("color","green");
				}else{
					obj.html("用戶名已存在");
					obj.css("color","rgb(243, 69, 69)");
				}
			}
		});
	}
}

function checkPasswordAccount(status){
	var password = $("#password"+status).val();
	var pwd = $("#pwd"+status).val();
	var passwordObj = $("#password"+status+"Msg");
	var pwdObj = $("#pwd"+status+"Msg");
	var pwdbox = $("#pwdbox")[0].checked;
	if(pwdbox||status==="Save"){
		if(password==null||password===""){
			passwordObj.html("密码不能为空！");
			passwordObj.css("color","rgb(243, 69, 69)");
			return false;
		}else if(password.length<6){
			passwordObj.html("密码必须大于六位！");
			passwordObj.css("color","rgb(243, 69, 69)");
			return false;
		}else{
			passwordObj.html("密码正确！");
			passwordObj.css("color","green");
			pwdObj.html("密码正确！");
			pwdObj.css("color","green");
			return true;
		}
	}else{
		return true;
	}
		
	
	
}

function checkAliasAccount(status){
	var alias = $("#alias"+status).val();
	var obj = $("#alias"+status+"Msg");
	if(alias==null||alias===""){
		obj.html("别名不能为空！");
		obj.css("color","rgb(243, 69, 69)");
		return false;
	}else{
		obj.html("别名正确");
		obj.css("color","green");
		return true;
	}
}

function checkEmailAccount(status){
	var email = $("#email"+status).val();
	var obj = $("#email"+status+"Msg");
	var exp = /^\w+(\.\w+)?@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
	if(email==null||email===""){
		obj.html("");
		return true;
	}else if(exp.test(email)){
		obj.html("邮箱格式正确！");
		obj.css("color","green");
		return true;
	}else{
		obj.html("邮箱格式错误!");
		obj.css("color","rgb(243, 69, 69)");
		return false;
	}
}


function checkMobileAccount(status){
	var mobile = $("#mobile"+status).val();
	var obj = $("#mobile"+status+"Msg");
	var tel = /(^(\d{2,4}[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?([-_－—]?\d{1,7})?$)|(^(\+86)?0?1[35]\d{9}$)/;
	if(mobile==null||mobile===""){
		obj.html("");
		return true;
	}else if(tel.test(mobile)){
		obj.html("电话号码格式正确！");
		obj.css("color","green");
		return true;
	}else{
		obj.html("电话号码格式错误!");
		obj.css("color","rgb(243, 69, 69)");
		return false;
	}
}


function account_save(){
	if(!check("Save")){
		return;
	}else{
		$('#save').ajaxSubmit({
			type:'post',
			url:appName + "/account/saveDefaultAccount",
			dateType:'json',
		    success:function(result) {
		    	var data = $.parseJSON(result); 
				if(data=="2"){
					new PNotify({
		                title: '消息：',
		                text: '用户名已存在，无法修改！'
		            });
				} else {
					account_reflash();
					$("#saveAppDefaultAccountDiv").modal('hide');
				}
			},
			
		});
	
	}
}

function account_update(){
	if(!check("Edit")){
		return;
	}else{
		$('#edit').ajaxSubmit({
			url:appName + "/account/editDefaultAccount",
			type:'post',
			dateType:'json',
			//onSubmit: function(){},
		    success:function(result) {
		    	var data = $.parseJSON(result); 
				if(data=="2"){
					new PNotify({
		                title: '消息：',
		                text: '用户名已存在，无法修改！'
		            });
				} else {
					account_reflash();
					$("#editAppDefaultAccountDiv").modal('hide');
				}
			}
		});
		
	}
}

$(function() {

	
	
	group_reflash();
	$("#account_tabs a").on('shown.bs.tab',function(e){
		if($(e.target).attr('id')==='account_tab'){
			initDefaultAccountGrid();
		}else if($(e.target).attr('id')==='group_tab'){
			initDefaultGroupGrid();
		}else if($(e.target).attr('id')==='privilege_tab'){
			initDefaultPrivilegeGrid();
		}
		
	});
	
	$("#passwordEdit").attr("disabled", "disabled");
	$("#pwdEdit").attr("disabled", "disabled");
	
	$("#pwdbox").change(function(){
		if(this.checked){
			$("#passwordEdit").attr("disabled", false);
			$("#pwdEdit").attr("disabled", false);
		}else{
			$("#passwordEdit").attr("disabled", "disabled");
			$("#pwdEdit").attr("disabled", "disabled");
			$("#passwordEdit").val("");
			$("#pwdEdit").val("");
			$("#passwordEditMsg").html("");
			$("#pwdEditMsg").html("");
		}
	})
	
	
	/**
	 * 保存、修改、删除操作
	 */
	$("#account_save_confirmed").click(function(){
		account_save();
	});
	
	$("#account_update_confirmed").click(function(){
		account_update();
	});
	
	$("#group_save_confirmed").click(function(){
		group_save();
	});
	
	$("#group_update_confirmed").click(function(){
		group_edit();
	});
	$("#privilege_save_confirmed").click(function(){
		privilege_save();
	});
	
	$("#privilege_update_confirmed").click(function(){
		privilege_edit();
	});
	
});