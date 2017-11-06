
function initDefaultGroupGrid() {
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
	$("#defaultAccountGroupTab")
			.datagrid(
					{
						width : '100%',
						height : document.body.scrollHeight-330,
						nowrap : true,
						rownumbers : true,
						singleSelect : true,
						toolbar : '#group_tb',
						url : appName
								+ "/account/queryAppDefaultGroup?appId="
								+ appId,
						columns : [ [
								{
									field : 'groupname',
									title : '&nbsp;&nbsp;分组名称&nbsp;&nbsp;',
									width : autoWidth(0.4),
									sortable : true,
									align : 'center',
								},
								
								{
									field : 'opt',
									title : '&nbsp;&nbsp;操作&nbsp;&nbsp;',
									width : autoWidth(0.4),
									align : 'center',
									formatter : function(value, rec) {
										var btnEdit = '<a class="editDA" onclick="group_editDAData('+rec.id+')" href="#">编辑</a>';
										var btnDel = '<a class="btnDelDA" onclick="group_btnDelDA(\''
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

function group_reflash(){
	initDefaultGroupGrid();
	$('#defaultAccountGroupTab').datagrid('loadData',{ total: 0, rows: [] });
	$("#group_tab").tab('show');
	
	initDefaultGroupGrid();
	
}

function addSeleteOption(name,groupid){
	var options = "<option value='" + groupid + "' class = 'option_"+groupid+"''>" + name + "</option>";
	$("#groupidSave").append(options);
	$("#groupidEdit").append(options);
	$("#privilege_groupidSave").append(options); 
}
function delSeleteOption(name,groupid){
	$(".option_" + groupid).remove();
}
function editSeleteOption(name,groupid){
	$(".option_" + groupid).text(name);
}
/**
 * 刷新
 */
function group_reject() {
	group_reflash();
	
}
/**
 * 编辑
 */
var group_id;
function group_edit(){
	var id = group_id;
	var appId = $("#txtAppId").val();
	var groupname=$("#groupEdit").val();
	if(groupname==""){
		alert('请填写分组名称', "warning");
	}else{
		$.post(appName + "/account/editDefaultGroup", {
			"id" : id,
			"appId" : appId,
			"groupname" : groupname
		}, function(data) {
			if(data.state=="2"){
				new PNotify({
                    title: '消息：',
                    text: '分组名重复，无法修改!'
                });
				//alert('分组名重复，无法修改', "error");
			} else {
				group_reflash();
				editSeleteOption(data.name,data.groupid);
				$("#editAppDefaultGroupDiv").modal('hide');
			}
		});
	}
}

function group_editDAData(id) {
	group_id = id;
	$.post(appName + "/account/AppDefaultGroupById?id=" + id, function(data) {
		$(data).each(function(key, val) {
			$("#groupEdit").val(val.groupname);
		});
	}, "json");
	$("#editAppDefaultGroupDiv").modal('toggle');

}

function group_save(){
	var appId = $("#txtAppId").val();
	var groupname=$("#groupSave").val();
	if(groupname==""){
		new PNotify({
            title: '消息：',
            text: '请填写分组名称!'
        });
	}else{
	$.post(appName + "/account/saveDefaultGroup", {
		"appId" : appId,
		"groupname" : groupname
	}, function(data) {
		if(data.state=="2"){
			new PNotify({
	            title: '消息：',
	            text: '分组名重复，无法添加!'
	        });
		} else {
			group_reflash();
			addSeleteOption(data.name,data.groupid);
			$("#saveAppDefaultGroupDiv").modal('hide');
		}
	});
	}
}

function group_append() {
	$("#saveAppDefaultGroupDiv").modal('toggle');
}
/**
 * 删除
 */
var ids = [];
function group_btnDelDA(id) {
	ids = new Array();
	ids.push(id);
	var url = appName + "/account/doDeleteDefaultGroup";
	delGroup(url,ids);
}

function delGroup(url,ids){
	$("#delDiv").modal('toggle');
	document.getElementById('del_confirmed').onclick = function(){
		$.post(url, {
			'ids' : ids.join(",")
		}, function(data) {
			if (data.state == "1") {
				group_reflash();
				$("#delDiv").modal('hide');
				delSeleteOption(data.name,data.groupid);
			} else if(data.state == "2"){
				new PNotify({
		            title: '错误：',
		            text: '删除数据失败！该分组已分配权限，无法删除。您必须先删除该分组的权限才能删除该分组!',
		            type: 'error'
		        });
			} else if(data.state == '3'){
				new PNotify({
		            title: '错误：',
		            text: '删除数据失败！该分组存在用户，无法删除。您必须删除该分组的用户才能删除该分组!',
		            type: 'error'
		        });
			}
		});
	};
	
}