var personalizationList = (function($, undefined) {
	// 页面元素
	var $classifyPersonalizationGrid = undefined;
	var $keyword = undefined;
	var $toolbar = undefined;
	var tableWidth = 0;
	var remainWidth = 0;
	// 请求参数
	var queryUrl = "personalization/queryClassifyPersonalization";
	var deleteUrl = "personalization/deleteClassifyPersonalization";
	
	var autoWidth = function(percent, minWidth, remainMinWidth) {
		var result = 0;
		if (remainMinWidth) {
			result = Math.max(remainWidth, remainMinWidth);
		} else if (minWidth) {
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		} else {
			result = Math.round(tableWidth * percent);
		}
		remainWidth = remainWidth - result;
		return result;
	};
	// 配置参数
	var gridConfig = function() {
		return {
//			toolbar : "#toolbar",
			url : queryUrl,
			singleSelect : true,
			sortName : "id",
			sortOrder : "desc",
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100 ],
			rownumbers : true,
			columns : [ [
					{
						field : "classifyNames",
						title : "所属分类",
						width : 180,
						align : "left ",
						halign : "center"
					},
					{
						field : "keywords",
						title : "关键词",
						width : 100,
						align : "center",
						halign : "center",
						sortable : true,
						
					},
					{
						field : "characterName",
						title : "角色",
						width : 70,
						align : "center",
						halign : "center",
						sortable : true,
						
					},
					{
						field : "corpusStatus",
						title : "状态",
						width : 50,
						align : "center",
						halign : "center",
						sortable : true,
						formatter : function(value, rowData, rowIndex) {
							if(value==1){
								return "已审核";
							}else if(value==0){
								return "未审核";
							}else{
								return "全部";
							}
						}
					},
					{
						field : "auditor",
						title : "操作者",
						width : 65,
						align : "center",
						halign : "center",
						sortable : true,
						formatter : function(value, rowData, rowIndex) {
							if(value==0){
								return "全部";
							}else{
								return "用户";
							}
						}
					},
					
					{
						field : "opterate",
						title : "操作",
						align : "center",
						width : 190,
						halign : "center",
						sortable : false,
						formatter : function(value, rowData, rowIndex) {
							var btnEdit='<a class="editClass"  onclick="operateEdit(\''
								+ rowData.id
								+ '\')">编辑</a>';
							var btnDelete='<a class="deleteClass"  onclick="personalizationList.operateDelete(\''
								+ rowData.id
								+ '\')">删除</a>';
							if (rowData.isOpen==0) {
								var btnHide = '<a class="hideClass" onclick="personalizationList.operateOpen(1,\''+rowData.id+'\')">关闭</a>';
								return btnHide+btnEdit+btnDelete;
							} else {
								var btnShow = '<a class="showClass" onclick="personalizationList.operateOpen(0,\''+rowData.id+'\')">开启</a>';
								return btnShow+btnEdit+btnDelete;
							}
						}
					} ] ],
			onLoadSuccess : function() {
				$classifyPersonalizationGrid.datagrid("uncheckAll");
				$('.hideClass').linkbutton({
					text : '已关闭 ',
					
					plain : true,
					iconCls : 'icon-closed'
				});
				$('.showClass').linkbutton({
					text : '已开启',
					plain : true,
					iconCls : 'icon-open'
				});
				$('.editClass').linkbutton({
					text : '编辑',
					plain : true,
					iconCls : 'icon-edit'
				});

				$('.deleteClass').linkbutton({
					text : '删除',
					plain : true,
					iconCls : 'icon-delete'
				});

			},
			onClickRow : function(rowIndex, rowData) {
				$('#classifyTreeGrid').datagrid("uncheckAll");
				$.post(appName + "/config/queryClassifyPersonalizationRelByPId",{"pid":rowData.id},
						function(data) {
								$(data).each(function(key, val) {
									operateClasscify(rowData.id,val.classify_id);
								});
			}, 'json');
				
			}
		};
	};
	var pageConfig = function(pageSize, pageList) {
		return {
			pageSize : pageSize,
			pageList : pageList,
			beforePageText : '第',
			afterPageText : '页    共 {pages} 页',
			displayMsg : '显示 {from} - {to} 条,  共 {total}条',
		};
	}

	var gridReload = function() {
		// TODO,抽取参数queryParams, Grid方便后期重构
		$classifyPersonalizationGrid.datagrid('load', queryParams)

	};

	var operateDelete = function(id) {
		pairIds = new Array();
		pairIds.push(id);
		deleteP();
		return false;
	};

	var batchDelete = function() {
		var rows = $classifyPersonalizationGrid.datagrid("getSelections");
		pairIds = new Array();
		for ( var index in rows) {
			pairIds.push(rows[index].id);
		}
		deleteP();
	};
	var operateOpen=function (operate,id){
		if(operate==1){
			$.post(appName+"/personalization/getIsOpenByAppId" ,function(data) {
				if(data==1){
					$.messager.alert("提示", "只能打开一个设置", 'warning');
				}else{
					doIsOpen(id,operate);
				}
			});
		}else{
			doIsOpen(id,operate);
	}
	}
var doIsOpen=function(id,operate){
	$.post(appName+"/personalization/updateIsOpen", {
		"id" : id,
		"isOpen":operate
	}, function(data) {
		if (data.status == "fail") {
			$.messager.alert("提示", data.message, 'error');
		} else if (data.status == "warn") {
			$.messager.alert("提示", data.message, 'warning');
		} else if (data.status == "success") {
			refresh();
		}
	}, "json");
}
	var deleteP = function() {
		if (pairIds.length > 0) {
					$.post(appName+"/"+deleteUrl, {
						"ids" : pairIds.join(",")
					}, function(data) {
						if (data.status == "fail") {
							$.messager.alert("提示", data.message, 'error');
						} else if (data.status == "warn") {
							$.messager.alert("提示", data.message, 'warning');
						} else if (data.status == "success") {
							refresh();
						}
					}, "json");
		} else {
			$.messager.alert("提示", "请选择要删除的问题!", 'warning');
		}

	};

	var initVar = function() {
		$classifyPersonalizationGrid = $("#classifyPersonalizationGrid");
		$toolbar = $("#toolbar");
		tableWidth = $("#leftContext").width() - 2 * 22;
		remainWidth = tableWidth;
	};

	var initGrid = function() {
		$classifyPersonalizationGrid.datagrid(gridConfig());
		$classifyPersonalizationGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100 ]));
		$(".datagrid-wrap").css("border-right-width", 0);
	};
	var refresh = function() {
		$classifyPersonalizationGrid.datagrid('reload');
	};
	var method = {
		init : function() {
			initVar();
			initGrid();
		},
		gridReload : gridReload,
		batchDelete : batchDelete,
		operateDelete : operateDelete,
		operateOpen:operateOpen,
	};

	return method;
})(jQuery);

function operateClasscify(id,suser) {
	var all = $("#classifyTreeGrid").datagrid("getData");// 获取datagrid的数据。
	for ( var i = 0; i < all.rows.length; i++) {
		var row = all.rows[i];
			if (row.id == suser) {// 相同，也就是被选中。
				$('#classifyTreeGrid').datagrid('selectRow',i); 
				break;
			}
	}
}

var classifyTreeList = (function($, undefined) {
	var $classifyTree = undefined;
	var $keywordTree = undefined;
	var tableWidth = 0;
	var remainWidth = 0;
	var queryUrlClassifys = "/cloud/knowledge/classifys";
	
	var treeManager=undefined;
	var findClassify = function(){
		var temp = $keywordTree.val();
		if(temp == "")
			return;
		$(".l-checkbox").each(function(){
			$(this).parent().find("span").each(function(){
				if($(this).text().indexOf(temp)>=0){
					if($(this).prev().attr("class").indexOf("folder")>=0);
					else
						$(this).prev().prev().removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
				}
			});
		})
		treeManager.refreshTree();
	};
	
	var classifyTreeConfig = function() {
		return {
			treeLeafOnly : true,
			url : queryUrlClassifys,
			ajaxType : "post",
			idFieldName : "id",
			parentIDFieldName : "parentId",
			textFieldName : "value",
			slide : true,
			isExpand : 10
		};
	};
	var initVar = function() {
		$classifyTree = $("#classifyTree");
		$toolbar = $("#toolbarTree");
		$keywordTree=$("#keywordTree");
	};
	
	var initTree = function() {
		treeManager = $classifyTree.ligerTree(classifyTreeConfig());
	};

	var method = {
		init : function() {
			initVar();
			initTree();
		},
		findClassify : findClassify
	};

	return method;
})(jQuery);

function doRefresh() {
	$(".l-checkbox").each(function(){
		$(this).removeClass("l-checkbox-checked").removeClass("l-checkbox-incomplete");
	});
	$('#classifyPersonalizationGrid').datagrid('clearChecked');
	$('#classifyPersonalizationGrid').datagrid('clearSelections');
	$('#classifyPersonalizationGrid').datagrid('unselectAll');
	$('#classifyPersonalizationGrid').datagrid('reload');
}
//添加加载 角色 状态内容
var charactersUrl="/cloud/knowledge/charactersAll";
var comboBoxConfig1 = function() {
	return {
        selectBoxWidth : 359,
        width : 359,
        selectBoxHeight : 359,
        valueFieldID : '-1',
        valueField : "id",
		textField : "vname",
		url : charactersUrl,
		ajaxType : "post",
		onSuccess : function(data){
			this.setValue(1);
		}
	};
};
var corpusStatusData = [ {id : -1,text : "全部"}, {id : 0,text : "未审核"}, {id : 1,text : "已审核"} ];
var comboxBoxStatus=function(){
	return {
		selectBoxWidth : 359,
        selectBoxHeight : 359,
		width : 359,
		emptyText: "",
		valueField : "id",
		data : corpusStatusData,
		onSuccess : function(data){
			this.setValue(0);
		}
	};
}

var corpusAuditorData = [ {id :0,text : "全部"}, {id :1,text : "用户"} ];
var comboxBoxAuditor=function(){
	return {
		selectBoxWidth : 359,
        selectBoxHeight : 359,
		width : 359,
		emptyText: 0,
		valueField : "id",
		data : corpusAuditorData,
		onSuccess : function(data){
			this.setValue(0);
		}
	};
}
//打开自定义界面
function showDialog() {
	var mangerCharacter=$("#character").ligerComboBox(comboBoxConfig1());
	$("#corpusStatus").ligerComboBox(comboxBoxStatus());
	$("#corpusAuditor").ligerComboBox(comboxBoxAuditor());
	
	$("#tagreadme").val("");
	data = $("#classifyTree").ligerGetTreeManager().getChecked();
	if (data == "") {
		$.messager.alert('提示', '请至少选择一个分类数据！', "warning");
		return;
	}
	dids = new Array();
	clsname = new Array();
	for ( var index in data) {
			dids.push(data[index].data.id);
			clsname.push(data[index].data.value);
	}
	$.post(appName + "/personalization/sessionClassifyPersonId", {
		"clsPIds" : dids.join(","),
		"clsPNames" : clsname.join(",")
	}, function(data) {
		if (data == "1") {
			$('#dd').dialog('open');
			$("#labclsPNames").text(clsname.join(","));
			$("#txtclsPIds").val(dids.join(","));
		} else {
			$.messager.alert('提示', '请选择一个分类数据', "warning");
		}
	});
}
//执行自定义
/**
 * 自定义
 */
function doAddClassifyPersonalization() {
	var statusValue=$("#corpusStatus").ligerComboBox().getValue();
	var auditorValue=$("#corpusAuditor").ligerComboBox().getValue();
	if(statusValue==""){
		statusValue=0;
	}
	if(auditorValue==""){
		auditorValue=0;
	}
	var tagReadme = $("#tagreadme").val();
	$.post(appName + "/personalization/saveClassifyPersonalization", {
		"classifyId" : dids.join(","),
		"readme" : tagReadme,
		"corpusStatus":statusValue,
		"characterId":$("#character").ligerComboBox().getValue(),
		"keywords":$("#corpusKeyword").val(),
		"auditor":auditorValue
	}, function(data) {
		if (data.status == "fail") {
			$.messager.alert("提示", data.message, 'error');
		} else if (data.status == "warn") {
			$.messager.alert("提示", data.message, 'warning');
		} else if (data.status == "success") {
			$('#dd').dialog('close');
			doRefresh();
		}
	}, "json");
}
/**
 * 打开编辑界面
 * @param id
 */
function operateEdit(id){
	$.post(appName + "/personalization/getClassifyPersonIdById", {
		"id" :id
	}, function(data) {
		if(data==1){
			$('#editDiv').dialog('open');
			var statusManager=$("#txtCorpusStatus").ligerComboBox(comboxBoxStatus());
			var auditorManager=$("#txtCorpusAuditor").ligerComboBox(comboxBoxAuditor());
			var characterManager=$("#txtCharacter").ligerComboBox(comboBoxConfig1());
			var cId=$("#txtCharacterId").val();
			var sId=$("#txtStatus").val();
			var aId=$("#txtAuditor").val();
			statusManager.selectValue(sId);
			auditorManager.selectValue(aId);
			characterManager.selectValue(cId);
		}
	});
}
/**
 * 执行编辑
 */
function doUpdateClassifyPersonalization(){
	var txtStatus=$("#txtCorpusStatus").ligerComboBox().getValue();
	var txtauditor=$("#txtCorpusAuditor").ligerComboBox().getValue();
	
	var txtCharacterId=$("#txtCharacter").ligerComboBox().getValue();
	if(txtauditor==""){
		txtauditor=0;
	}
	if(txtStatus==""){
		txtStatus=0;
	}
	var tagReadme = $("#txtTagreadme").val();
	if (txtEditId == undefined) {
		$.messager.alert('提示', '请重新编辑', "warning");
		return;
	}
	$.post(appName + "/personalization/updateClassifyPersonalization", {
		"id" : $("#txtEditId").val(),
		"readme" : tagReadme,
		"corpusStatus":txtStatus,
		"characterId":txtCharacterId,
		"keywords":$("#txtCorpusKeyword").val(),
		"auditor":txtauditor
	}, function(data) {
		if (data.status == "fail") {
			$.messager.alert("提示", data.message, 'error');
		} else if (data.status == "warn") {
			$.messager.alert("提示", data.message, 'warning');
		} else if (data.status == "success") {
			$('#editDiv').dialog('close');
			doRefresh();
		}
	}, "json");
}



function hideDialog() {
	$('#dd').dialog('close');
}

function hideDialogEdit(){
	$('#editDiv').dialog('close');
}
