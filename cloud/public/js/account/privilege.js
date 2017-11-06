
function initDefaultPrivilegeGrid() {
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
	var appId = $("#txtAppId").val();
	$("#defaultPrivilegeTab")
			.datagrid(
					{
						width : '100%',
						height : document.body.scrollHeight-330,
						nowrap : true,
						rownumbers : true,
						singleSelect : true,
						toolbar : '#privilege_tb',
						url : appName
								+ "/account/queryAppDefaultPrivilege?appId="
								+ appId,
						columns : [ [
								{
									field : 'accountGroup.groupname',
									title : '&nbsp;&nbsp;权限分组&nbsp;&nbsp;',
									width : autoWidth(0.15),
									sortable : true,
									align : 'center',
									formatter: function (value, rec) {
								         return rec.accountGroup.groupname;
								     }
								},
								{
									field : 'opname',
									title : '&nbsp;&nbsp操作权限&nbsp;&nbsp;',
									width : autoWidth(0.15),
									sortable : true,
									align : 'center',
									formatter: function (value, rec) {
										var opname = "";
										var operationids = rec.operationids;
										var operationidArray = new Array();
										operationidArray = operationids.split(",");
										$(operationidArray).each(function(i, operationid) {
											opname = opname + $("#opname"+operationid).val()+"&nbsp;";
										});
								         return opname;
								     }
								},
								{
									field : 'description',
									title : '&nbsp;&nbsp操作权限说明&nbsp;&nbsp;',
									width : autoWidth(0.2),
									sortable : true,
									align : 'center',
									formatter: function (value, rec) {
										var description = "拥有(";
										var operationids = rec.operationids;
										var operationidArray = new Array();
										operationidArray = operationids.split(",");
										$(operationidArray).each(function(i, operationid) {
											description = description + $("#description"+operationid).val()+"&nbsp;";
										});
										description = description + ")";
								         return description;
								     }
								},
								{
									field : 'opt',
									title : '&nbsp;&nbsp;操作&nbsp;&nbsp;',
									width : autoWidth(0.3),
									align : 'center',
									formatter : function(value, rec) {
										var btnEdit = '<a class="editDA" onclick="privilege_editDAData('+rec.id+')" href="#">编辑</a>';
										var btnDel = '<a class="btnDelDA" onclick="privilege_btnDelDA(\''
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


function privilege_reflash(){
	$('#privilege_tab').tab('show');
	initDefaultPrivilegeGrid();
	var priRow = $('#defaultPrivilegeTab').datagrid('getRows');
	console.log("priRow="+priRow);
	$('#defaultPrivilegeTab').datagrid('loadData',{ total: 0, rows: [] });
	
}
/**
 * 刷新
 */
function privilege_reject() {
	privilege_reflash();
}
/**
 * 编辑
 */
var privilege_id;
function privilege_edit(){
	var id = privilege_id;
	var appId = $("#txtAppId").val();
	var groupid = $("#groupid").val();
	//var operationid = $("#operationidEdit").val();
	var operationidArray = new Array();
	$("input[name='operationidsEdit']:checked").each(function(i, n) {
		operationidArray.push(n.value);
	});
	$.post(appName + "/account/editDefaultPrivilege", {
		"id" : id,
		"appId" : appId,
		"groupid" : groupid,
		"operationidArray" : operationidArray.join(",")
	}, function(data) {
		if(data=="1"){
			privilege_reflash();
			$("#editAppDefaultPrivilegeDiv").modal('hide');
		}  else if(data=="2"){
			new PNotify({
                title: '错误：',
                text: '添加失败！已赋予的权限！!',
                type: 'error'
            });
		} else{
			new PNotify({
                title: '消息：',
                text: '请为该分组赋予权限!'
            });
		}
	});
}

function privilege_editDAData(id) {
	privilege_id = id;
	$("input[name='operationidsEdit']").prop("checked", false);
	
	$.post(appName + "/account/AppDefaultPrivilegeById?id=" + id, function(data) {
		$(data).each(function(key, val) {
			$("#privilege_groupidEdit").html(val.accountGroup.groupname);
			$("#groupid").val(val.accountGroup.id);
			var operationids = val.operationids;
			var operationArray = new Array();
			operationArray = operationids.split(",");
			$(operationArray).each(function(i, operationid) {
				$("#operation"+operationid).prop('checked',true);
			});
		});
	}, "json");
	
	$("#editAppDefaultPrivilegeDiv").modal('toggle');
}

function privilege_save(){
	var appId = $("#txtAppId").val();
	var groupid = $("#privilege_groupidSave").val();
	var operationidArray = new Array();
	$("input[name='operationidsSave']:checked").each(function(i, n) {
		operationidArray.push(n.value);
	});
	$.post(appName + "/account/saveDefaultPrivilege", {
		"appId" : appId,
		"groupid" : groupid,
		"operationidArray" : operationidArray.join(",")
	}, function(data) {
		if(data=="1"){
			privilege_reflash();
			$("#saveAppDefaultPrivilegeDiv").modal('hide');
		} else if(data=="2"){
			new PNotify({
                title: '错误：',
                text: '添加失败！已赋予的权限！',
                type: 'error'
                	
            });
		} else{
			new PNotify({
                title: '消息：',
                text: '请为该分组赋予权限！'
            });
		}
	});
}


function privilege_append() {
	$.post(appName + "/account/accountGroupList", function(data) {
		console.log("data="+data);
		if(data==0){
			new PNotify({
                title: '消息：',
                text: '请先在分组管理中添加分组！'
            });
		}else{
			$("#saveAppDefaultPrivilegeDiv").modal('toggle');
		}
	});
	
}
/**
 * 删除
 */
var ids = [];
function privilege_btnDelDA(id) {
	ids = new Array();
	ids.push(id);
	var url = appName + "/account/doDeleteDefaultPrivilege";
	delPrivilege(url,ids);
}

function delPrivilege(url,ids){
	$("#delDiv").modal('toggle');
	document.getElementById('del_confirmed').onclick = function(){
		$.post(url, {
			'ids' : ids.join(",")
		}, function(data) {
			if (data == "1") {
				$("#delDiv").modal('hide');
				privilege_reflash();
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