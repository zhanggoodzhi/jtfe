var classList = (function($, undefined) {
	// 页面元素
	var $classifyTree = undefined;
	var $menuTree = undefined;
	var $menuListGrid = undefined;
	
	var treeManager=undefined
	
	var classifysUrl="/cloud/knowledge/classifys";
	var queryGMenuUrl="faq/queryAllGeneralMenu";
	var queryClassInfo="/faq/queryClassInfo";
	var updateUrl="/faq/updateClassInfo";
	var queryParams = {
			keyword : ""
		};
	
	var remainWidth = 0;
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
			height : document.body.scrollHeight -220,
			url : queryGMenuUrl,
			queryParams : queryParams,
//			toolbar : "#toolbarList",
			striped : true,
			fitColumns : true,
			sortName : "id",
			sortOrder : "asc",
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
			remoteSort : false,
			singleSelect : true,
			columns : [ [
					{
						field : 'id',
						title : '',
						width : autoWidth(0.10),
						checkbox : true,
						align : 'center'
					},
					{
						field : 'name',
						title : '菜单名称',
						width : autoWidth(0.10),
						sortable : true,
						align : 'center'
					},
					 ] ],
			onCheck : function(rowIndex,rowData){
				treeManager.expandAll();
				$(".l-checkbox").each(function(){
					$(this).removeClass("l-checkbox-checked").removeClass("l-checkbox-incomplete").addClass("l-checkbox-unchecked");
				});
				$.post(appName + queryClassInfo + "?id=" + rowData.id, function(data) {
					$(data).each(function(key, val) {
						$(".l-checkbox").each(function(){
							if($(this).parent().parent().attr("id") == val.toString()){
								$(this).removeClass("l-checkbox-unchecked").addClass("l-checkbox-checked");
							}
						})
					});
					treeManager.refreshTree();
				}, "json");
			},
			onLoadSuccess : function() {
				$menuListGrid.datagrid("uncheckAll");
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
		$menuListGrid.datagrid('load', "");

	};
	
	
	var classifyTreeConfig = function() {
		return {
			treeLeafOnly : true,
			url : classifysUrl,
			ajaxType : "post",
			idFieldName : "id",
			parentIDFieldName : "parentId",
			textFieldName : "value",
			slide : true,
			isExpand : 2
		};
	};
	
	
	var findClassify = function(){
		var temp = $("#keywordTree").val();
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
	
	
	var updateMappingInfo = function(id,ids,confirmInfo) {
		$("#menuDiv").modal('toggle');
		menuMappingSave(id,ids,updateUrl);
		 
	};
	
	var operateAdd = function(){
		var row = $menuListGrid.datagrid("getSelected");
		var confirmInfo = '是否执行更改';
		pairIds = new Array();
		data = treeManager.getChecked();

		if(row != null){
			if(data == ""){
				confirmInfo = '尚未选择分组，将会清除所有之前的分组数据，要继续吗？';
			}
			for ( var index in data) {
				pairIds.push(data[index].data.id);
			}
			updateMappingInfo(row.id,pairIds,confirmInfo);
				
		}
		else{
			new PNotify({
	            title: '错误：',
	            text: '请选择菜单！',
	            type: "error"
	        });
		}
	};
	
	
	var refresh = function() {
		$menuListGrid.datagrid('load',"");
		$(".l-checkbox").each(function(){
			$(this).removeClass("l-checkbox-checked").removeClass("l-checkbox-incomplete");
		})
	};
	
	var initTrees = function() {
		treeManager = $classifyTree.ligerTree(classifyTreeConfig());
	};
	
	var initGrid = function() {
		$menuListGrid.datagrid(gridConfig());
		$menuListGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100, 150 ]));
		/*$(".datagrid-wrap").css("border-left-width", 0);
		$(".datagrid-wrap").css("border-right-width", 0);
		$(".datagrid-wrap").css("border-bottom-width", 20);*/
		
		$("#menuListAdd").bind("click",operateAdd);
		$("#findClassify").bind("click",findClassify);
		
		//所有标签点击后均刷新第三个标签页
		$("li").bind("click",function(){
			refresh();
		});
	};
	var initVar = function() {
		$classifyTree=$("#classifyTree");
		$menuListGrid = $("#menuListGrid");
//		$toolbar = $("#toolbarList");
		tableWidth = $("body").width() - 2 * 22;
		remainWidth = tableWidth;
	};

	var method = {
		init : function() {
			initVar();
			initTrees();
			initGrid();
		},
		gridReload : gridReload,
		operateAdd : operateAdd,
		findClassify : findClassify,
	};

	return method;
})(jQuery);


function menuMappingSave(id,ids,updateUrl){
	document.getElementById("menu_confirmed").onclick=function(){
		$(".easyui-panel").easyMask("show", {
			msg : "请稍候..."
		});
		$.post(appName + updateUrl, {
			'id' : id,
			'ids' : ids.join(",")
		}, function(data) {
			if (data == 1) {
				$(".easyui-panel").easyMask("hide", {
					msg : "请稍候..."
				});
				
				new PNotify({
		            title: '信息：',
		            text: '操作成功！',
		            type: "success"
		        });
				$("#menuDiv").modal('hide');
			} else {
				new PNotify({
		            title: '错误：',
		            text: '操作失败！',
		            type: "error"
		        });
			}
		});
	}
}