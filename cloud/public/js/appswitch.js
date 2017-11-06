function headerApp(){
		domainsSelect = $('#domainsSelect option:selected').val();//选中的值
		appInfoList.init();
}

var domainsSelect = undefined;
function onSelectDomain(domainId) {
	domainsSelect = domainId;
}
var appInfoList = (function($, undefined) {
	var appId = undefined;
	// 页面元素
	var $appInfoGrid = undefined;
	var $keyword = undefined;
	var $domainId = domainsSelect;
	var tableWidth = 0;
	var remainWidth = 0;
	// 请求参数
	var queryUrl = appName + "/applist";
	var queryParams = {
		keyword : "",
		domainId : '0'
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
			// height : document.body.scrollHeight-110,
			toolbar : "#toolbar",
			url : queryUrl,
			queryParams : queryParams,
			singleSelect : true,
//			sort : "app_updateTime",
			sortName : "checkedState",
			sortOrder : "asc",
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
			onLoaded:function(data){
				$("#appInfoGrid").find(".l-grid-loading").hide();
				if(data.data && data.data.total == 0){
					$("#appInfoGrid").find(".l-grid-body2").css({overflow:"hidden"}).html("<div align=center>抱歉，当前搜索条件下无记录</div>");
				}else{
					$("#appInfoGrid").find(".l-grid-body2").css({"overflow-y":"auto","overflow-x":"hidden"});
				}
			},
			columns : [ [
					{
						field : 'id',
						title : '应用编号',
						sortable : true,
						width : autoWidth(0.1),
						align : 'center'
					},

					{
						field : 'app_name',
						title : '应用名称',
						sortable : true,
						width : autoWidth(0.14),
						align : 'center'
					},
					{
						field : 'app_readme',
						title : '描述信息',
						width : autoWidth(0.25),
						sortable : true,
						halign : "center",
						align : 'left'
					},
					{
						field : 'checkedState',
						title : '审核状态',
						width : autoWidth(0.15),
						sortable : true,
						align : 'center',
						formatter : function(value, rowData, rowIndex) {
							
							if(value==1){
								return "正式上线"
							}else if(value==0){
								return "<label class='fc_71'>等待审核</label>"
							}else if(value==3){
								return "试用"
							}else if(value==4){
								return "下线"
							}else if(value==5){
								return "内部使用"
							}else if(value==6){
								return "锁定"
							}
						}
					
					} ] ],
					onLoadSuccess : function() {
						$appInfoGrid.datagrid("uncheckAll");
						$appInfoGrid.datagrid('clearChecked');
						$appInfoGrid.datagrid('clearSelections');
						$appInfoGrid.datagrid('unselectAll');
						if(appId!=""){
							var all = $("#appInfoGrid").datagrid("getData");// 获取datagrid的数据。
							for ( var i = 0; i < all.rows.length; i++) {
								var row = all.rows[i];
									if (row.id == appId) {// 相同，也就是被选中。
										$('#appInfoGrid').datagrid('selectRow',i); 
										break;
									}
							}
						}
					}
					,
					onClickRow : function(rowIndex, rowData) {
						doSelctApp();
					}
		};
	};

	var pageConfig = function(pageSize, pageList) {
		return {
			pageSize : pageSize,
			pageList : pageList,
			beforePageText : '第',
			afterPageText : '页    共 {pages} 页',
			displayMsg : '显示 {from} - {to} 条,共 {total}条',
		};
	}
	var gridReload = function() {
		queryParams.keyword = $keyword.val();
		queryParams.domainId = $domainId.val();
		// TODO,抽取参数queryParams, Grid方便后期重构
		$appInfoGrid.datagrid('load', queryParams);
	};
	var initVar = function() {
		appId =$("#txtApplicationId").val();
		$appInfoGrid = $("#appInfoGrid");
		$domainId = $('#domainsSelect');// 选中的值
		
		$keyword = $("#keyword");
		$keyword.bind('keypress', function(event) {
			if (event.keyCode == "13") {
				gridReload();
			}
		});
		$toolbar = $("#toolbar");
		tableWidth = $("body").width() - 2 * 22;
		remainWidth = tableWidth;
	};
	var initGrid = function() {
		$appInfoGrid.datagrid(gridConfig());
		$appInfoGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100, 150 ]));
		$(".datagrid-wrap").css("border-left-width", 0);
		$(".datagrid-wrap").css("border-right-width", 0);
		$(".datagrid-wrap").css("border-bottom-width", 0);
	};
	var refresh = function() {
		$appInfoGrid.datagrid('reload');
	};

	var method = {
		init : function() {
			initVar();
			initGrid();
		},
		gridReload : gridReload,
	};
	return method;
})(jQuery);

function doSelctApp(){
	var row = $('#appInfoGrid').datagrid("getSelections");
	if ($(row).length == 0) {
		$.messager.alert('提示', '请选择一个应用！', "warning");
		return;
	}
	var appId=undefined;
	var appRead=undefined;
	for ( var i = 0; i < $(row).length; i++) {
		appId=row[i].id;
		appRead=row[i].app_name;
	}
	$.post(appName + "/chooseApp", {
		"appId" : appId,
		"appRead":appRead
	}, function(data) {
		if (data == "1") {
			$("#txtApplicationId").val(appId);
			window.location.href="index";
		}else{
			$.messager.alert('提示', '请选择一个应用！', "warning");
		}
	});
}
