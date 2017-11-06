var tagList = (function($, undefined) {

	// 页面元素
	var $classifyTagGrid = undefined;
	var $keyword = undefined;
	var $toolbar = undefined;

	var tableWidth = 0;
	var remainWidth = 0;

	// 请求参数
	var queryUrl = "config/queryClassifyTag";
	var deleteUrl = "config/deleteClassifyTag";
	var queryParams = {
		keyword : ""
	};

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
//			height : document.body.scrollHeight - 110,
			toolbar : "#toolbar",
			url : queryUrl,
			queryParams : queryParams,
			singleSelect : true,
			sortName : "id",
			sortOrder : "desc",
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100 ],
			rownumbers : true,
			columns : [ [
					// {
					// field : "checkbox",
					// checkbox : true
					// },
					{
						field : "tag_name",
						title : "标签",
						width : autoWidth(0.20),
						align : "center",
						halign : "center",
						sortable : true
					},
					{
						field : "classifyNames",
						title : "所属分类",
						width : autoWidth(0.32),
						align : "left",
						halign : "center"
					},
					{
						field : "tag_readme",
						title : "描述",
						width : autoWidth(0.20),
						align : "left",
						halign : "center",
						sortable : true,
						formatter : function(value, rowData, rowIndex) {
							return cloudUtil.gridHtmlTips(value, 25);
						}
					},
					{
						// updateTimeStr
						field : "update_time",
						title : "变更时间",
						width : autoWidth(0.12),
						align : "center",
						halign : "center",
						sortable : true,
						formatter : function(value, rowData, rowIndex) {
							var date = new Date(value);
							var formatDate = date.formatDate("yyyy-MM-dd");
							return formatDate;
						}
					},
					{
						field : "opterate",
						title : "操作",
						align : "center",
						width : autoWidth(0.15),
						halign : "center",
						sortable : false,
						formatter : function(value, rowData, rowIndex) {
							return "<a class='l-btn l-btn-small l-btn-plain' href='javascript:window.location.href='/cloud/config/classifyTag'' onclick='tagList.operateDelete("
									+ rowData.id
									+ ")'>"
									+ "<span class='l-btn-left l-btn-icon-left'>"
									+ "<span class='l-btn-text'>删除</span>"
									+ "<span class='l-btn-icon icon-delete'></span>"
									+ "</span>" + "</a>";
						}
					} ] ],
			onLoadSuccess : function() {
				$classifyTagGrid.datagrid("uncheckAll");

			},
			onClickRow : function(rowIndex, rowData) {
//				$('#classifyTreeGrid').parent()
//				.find("div .datagrid-cell-check").children(
//						"input[type='checkbox']").attr("checked",
//						false);
				$('#classifyTreeGrid').datagrid("uncheckAll");
				$.post(appName + "/config/queryClassifyTagRelByTagId",{"tagId":rowData.id},
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
		queryParams.keyword = $keyword.val();
		// TODO,抽取参数queryParams, Grid方便后期重构
		$classifyTagGrid.datagrid('load', queryParams)

	};

	var operateDelete = function(id) {
		pairIds = new Array();
		pairIds.push(id);
		deleteClassifyTag();
		return false;
	};

	var batchDelete = function() {
		var rows = $classifyTagGrid.datagrid("getSelections");
		pairIds = new Array();
		for ( var index in rows) {
			pairIds.push(rows[index].id);
		}
		deleteClassifyTag();
	};

	var deleteClassifyTag = function() {
		if (pairIds.length > 0) {
//			$.messager.confirm("提示", "确认删除？", function(yes) {
//				if (yes) {
					$.post(appName+"/"+deleteUrl, {
						"pairIds" : pairIds.join(",")
					}, function(data) {
						if (data.status == "fail") {
							$.messager.alert("提示", data.message, 'error');
						} else if (data.status == "warn") {
							$.messager.alert("提示", data.message, 'warning');
						} else if (data.status == "success") {
							// $.messager.alert("提示",data.message,'info');
							refresh();
						}
					}, "json");
//				}
//			});
		} else {
			$.messager.alert("提示", "请选择要删除的问题!", 'warning');
		}

	};

	var initVar = function() {
		$classifyTagGrid = $("#classifyTagGrid");
		$keyword = $("#keyword");
		$keyword.bind('keypress', function(event) {
			if (event.keyCode == "13") {
				gridReload();
			}
		});
		$toolbar = $("#toolbar");
		tableWidth = $("#rightContext").width() - 2 * 22;
		remainWidth = tableWidth;
	};

	var initGrid = function() {
		$classifyTagGrid.datagrid(gridConfig());
		$classifyTagGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100 ]));
		$(".datagrid-wrap").css("border-left-width", 0);
		$(".datagrid-wrap").css("border-right-width", 0);
		$(".datagrid-wrap").css("border-bottom-width", 0);
	};
	var refresh = function() {
		$classifyTagGrid.datagrid('reload');
	};

	var method = {
		init : function() {
			initVar();
			initGrid();
		},
		gridReload : gridReload,
		batchDelete : batchDelete,
		operateDelete : operateDelete,
	};

	return method;
})(jQuery);

function operateClasscify(id,suser) {
	var all = $("#classifyTreeGrid").datagrid("getData");// 获取datagrid的数据。
	for ( var i = 0; i < all.rows.length; i++) {
		var row = all.rows[i];
			if (row.id == suser) {// 相同，也就是被选中。
				$('#classifyTreeGrid').datagrid('selectRow',i); 
//				$('#classifyTreeGrid').parent()
//						.find("div .datagrid-cell-check").children(
//								"input[type='checkbox']").eq(i).attr("checked",
//								true);
				break;
			}
	}
}

var classifyTreeList = (function($, undefined) {
//	var $classifyTreeGrid = undefined;
	var $classifyTree = undefined;
	var $keywordTree = undefined;
//	var $keyword = undefined;
//	var $toolbar = undefined;
	var tableWidth = 0;
	var remainWidth = 0;
//	var queryUrl = "config/queryClassify";
	var queryUrl = "/cloud/knowledge/classifys";
	
	var treeManager=undefined;
//	var queryParams = {
//		keyword : ""
//	};
//	var autoWidth = function(percent, minWidth, remainMinWidth) {
//		var result = 0;
//		if (remainMinWidth) {
//			result = Math.max(remainWidth, remainMinWidth);
//		} else if (minWidth) {
//			result = Math.round(Math.max(tableWidth * percent, minWidth));
//		} else {
//			result = Math.round(tableWidth * percent);
//		}
//		remainWidth = remainWidth - result;
//		return result;
//	};
	// 配置参数
//	var gridConfig = function() {
//		return {
//			height : document.body.scrollHeight - 110,
//			toolbar : "#toolbarTree",
//			url : queryUrl,
//			queryParams : queryParams,
//			singleSelect : false,
//			sortName : "id",
//			sortOrder : "desc",
//			pagination : true,
//			pageSize : 50,
//			pageList : [50, 100 ],
//			rownumbers : true,
//			columns : [ [ {
//				field : "checkbox",
//				checkbox : true
//			}, {
//				field : "id",
//				title : "分类",
//				width : autoWidth(0.10),
//				align : "center",
//				halign : "center",
//				sortable : true
//			}, {
//				field : "value",
//				title : "分类",
//				width : autoWidth(0.41),
//				align : "center",
//				halign : "center",
//				sortable : true
//			}, {
//				field : "remark",
//				title : "描述",
//				width : autoWidth(0.52),
//				align : "left",
//				halign : "center",
//				sortable : true,
//				formatter : function(value, rowData, rowIndex) {
//					return cloudUtil.gridHtmlTips(value, 24);
//				}
//			} ] ],
//			onLoadSuccess : function() {
//				$classifyTreeGrid.datagrid("uncheckAll");
//			}
//		};
//	};
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
			url : queryUrl,
			ajaxType : "post",
			idFieldName : "id",
			parentIDFieldName : "parentId",
			textFieldName : "value",
			slide : true,
			isExpand : 10
		};
	};
//	var pageConfig = function(pageSize, pageList) {
//		return {
//			pageSize : pageSize,
//			pageList : pageList,
//			beforePageText : '第',
//			afterPageText : '页    共 {pages} 页',
//			displayMsg : '显示 {from} - {to} 条,  共 {total}条',
//		};
//	}
//	var gridReload = function() {
//		queryParams.keyword = $keyword.val();
//		// TODO,抽取参数queryParams, Grid方便后期重构
//		$classifyTreeGrid.datagrid('load', queryParams)
//
//	};
	var initVar = function() {
//		$classifyTreeGrid = $("#classifyTreeGrid");
//		$keyword = $("#keywordTree");
//		$keyword.bind('keypress', function(event) {
//			if (event.keyCode == "13") {
//				gridReload();
//			}
//		});
		$classifyTree = $("#classifyTree");
		$toolbar = $("#toolbarTree");
		$keywordTree=$("#keywordTree");
//		tableWidth = $("#leftContext").width() - 2 * 22;
//		remainWidth = tableWidth;
	};
	
	
//	var initGrid = function() {
//		$classifyTreeGrid.datagrid(gridConfig());
//		$classifyTreeGrid.datagrid('getPager').pagination(
//				pageConfig(50, [ 50, 100 ]));
//		$(".datagrid-wrap").css("border-left-width", 0);
//		$(".datagrid-wrap").css("border-right-width", 0);
//		$(".datagrid-wrap").css("border-bottom-width", 0);
//	};
	var initTree = function() {
		treeManager = $classifyTree.ligerTree(classifyTreeConfig());
	};
//	var refresh = function() {
//		$classifyTreeGrid.datagrid('reload');
//	};

	var method = {
		init : function() {
			initVar();
			initTree();
		},
		findClassify : findClassify
//		gridReload : gridReload,
	};

	return method;
})(jQuery);

function doRefresh() {
//	$('#classifyTreeGrid').datagrid('clearChecked');
//	$('#classifyTreeGrid').datagrid('clearSelections');
//	$('#classifyTreeGrid').datagrid('unselectAll');
	$(".l-checkbox").each(function(){
		$(this).removeClass("l-checkbox-checked").removeClass("l-checkbox-incomplete");
	});
	$('#classifyTagGrid').datagrid('clearChecked');
	$('#classifyTagGrid').datagrid('clearSelections');
	$('#classifyTagGrid').datagrid('unselectAll');
//	$('#classifyTreeGrid').datagrid('reload');
	$('#classifyTagGrid').datagrid('reload');
}
function showDialog() {
	$("#tagname").val("");
	$("#tagreadme").val("");
//	var row = $('#classifyTreeGrid').datagrid("getSelections");
	data = $("#classifyTree").ligerGetTreeManager().getChecked();
//	if ($(row).length == 0) {
	if (data == "") {
		$.messager.alert('提示', '请至少选择一个分类数据！', "warning");
		return;
	}
	dids = new Array();
	clsname = new Array();
	
	for ( var index in data) {
		if($("#classifyTree").ligerGetTreeManager().hasChildren(data[index].data));
		else{
			dids.push(data[index].data.id);
			clsname.push(data[index].data.value);
		}
	}
	
//	for ( var i = 0; i < $(row).length; i++) {
//		dids.push(row[i].id);
//		clsname.push(row[i].value);
//	}
	$.post(appName + "/config/sessionClassifyId", {
		"clsIds" : dids.join(","),// row[0].id,
		"clsNames" : clsname.join(",")
	// row[0].id,
	}, function(data) {
		if (data == "1") {
			$('#dd').dialog('open');
			$("#labclsNames").text(clsname.join(","));
			$("#txtclsIds").val(dids.join(","));
		} else {
			$.messager.alert('提示', '请选择一个分类数据', "warning");
		}
	});
}

function hideDialog() {
	$('#dd').dialog('close');
}
/**
 * 打标签工作
 */
function doAddClassifyTag() {
	var tagName = $("#tagname").val();
	var tagReadme = $("#tagreadme").val();
	if (tagName == "") {
		$.messager.alert('提示', '请填写标签名称', "warning");
		return;
	}
	$.post(appName + "/config/saveClassifyTag", {
		"classifyId" : dids.join(","),
		"tagName" : tagName,
		"tagReadme" : tagReadme
	}, function(data) {
		if (data.status == "fail") {
			$.messager.alert("提示", data.message, 'error');
		} else if (data.status == "warn") {
			$.messager.alert("提示", data.message, 'warning');
		} else if (data.status == "success") {
			// $.messager.alert("提示",data.message,'info');
			$('#dd').dialog('close');
			doRefresh();
		}
	}, "json");
}
