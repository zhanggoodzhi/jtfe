var general_menu_id = 0;
var previewReplyList = (function($, undefined) {
	// 页面元素
	var $previewGrid = undefined;
	var $keyword = undefined;
	var tableWidth = 0;
	var queryAllUrl = "faq/queryAllGeneralMenu";
	var singleQueryUrl = "/faq/queryGeneralMenu";
	var singleIdQueryUrl = "/faq/queryGeneralMenuById";
	var addUrl = "/faq/addGeneralMenu";
	var deleteUrl = "/faq/deleteGeneralMenus";
	var editUrl = "/faq/updateGeneralMenu";
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
			toolbar : "#toolbarPreview",
			url : queryAllUrl,
			queryParams : queryParams,
			striped : true,
			fitColumns : true,
			sortName : "id",
			sortOrder : "asc",
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
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
					{
						field : 'gmDesc',
						title : '描述',
						width : autoWidth(0.10),
						sortable : true,
						align : 'center'
					},
					{
						field : 'index',
						title : '优先级',
						width : autoWidth(0.10),
						sortable : true,
						align : 'center'
					},
					{
						field : 'parentName',
						title : '父级菜单',
						width : autoWidth(0.10),
						sortable : true,
						align : 'center'
					},
					{
						field : 'opt',
						title : '&nbsp;&nbsp;操作&nbsp;&nbsp;',
						width : autoWidth(0.15),
						align : 'center',
						formatter : function(value, rec) {
							var btn = '<a class="editcls" onclick="previewReplyList.operateEdit(\''
								+ rec.id
								+ '\')">编辑</a>';
							var btnDeleteApp = '<a class="delcls" onclick="previewReplyList.operateDel(\''
								+ rec.id
								+ '\',\''
								+ rec.name
								+ '\')" >删除</a>';
							return btn + btnDeleteApp;
						}
					}, ] ],
			onLoadSuccess : function() {
				$('.editcls').linkbutton({
					text : '编辑',
					plain : true,
					iconCls : 'icon-edit'
				});
				$('.delcls').linkbutton({
					text : '删除',
					plain : true,
					iconCls : 'icon-delete'
				});
				$previewGrid.datagrid("uncheckAll");
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
		$previewGrid.datagrid('load', queryParams);

	};

	
	var batchDelete = function() {
		var rows = $previewGrid.datagrid("getSelections");
		pairIds = new Array();
		for ( var index in rows) {
			pairIds.push(rows[index].id);
		}
		deleteGMenuView();
	};
	var deleteGMenuView = function() {
		if (pairIds.length > 0) {
			$("#delDiv").modal('toggle');
			delmenu(pairIds,deleteUrl);
			/*$.messager.confirm("提示","确认删除？",function(yes){
			if(yes){
			
			}
			});*/
		} else {
			new PNotify({
	            title: '提示：',
	            text: '请选择要删除的问题!'
	        });
		}
	};
	
	var clearUpdateDiv = function(){
		$("#parent").empty();
		$("#name").val("");
		$("#desc").val("");
		$("#index").val("");
	}
	
	var operateAppend_ajax = function(){
		$.post(appName + addUrl, {
			"name" : $("#name").val(),
			"desc" : $("#desc").val(),
			"index" : $("#index").val(),
			"parent" : $("#parent").val()
		}, function(data) {
			if (data == "0") {
				new PNotify({
		            title: '提示：',
		            text: '添加失败！'
		        });
			}else if(data=="2"){
				new PNotify({
		            title: '提示：',
		            text: '该名称已存在，无法添加！'
		        });
			}else if(data=="3"){
				new PNotify({
		            title: '提示：',
		            text: '请将信息填写完整！'
		        });
			}else if(data=="4"){
				new PNotify({
		            title: '提示：',
		            text: '优先级应当为1~10的数字！'
		        });
			}else {
				$("#updateGeneralMenuDiv").modal('hide');
				refresh();
			}
		});
	}
	
	var operateAppend = function() {
		general_menu_id = 0;
		$.post(appName + singleQueryUrl, function(data) {
			$(data).each(function(key, val) {				
				if(val == "根节点")
					$("#parent").append("<option selected='selected'>"+val+"</option>");
				else
					$("#parent").append("<option>"+val+"</option>");
			});
			
		}, "json");
		
		$("#updateGeneralMenuDiv").modal('toggle');
		
		clearUpdateDiv();
	};
	
	var operateEdit_ajax = function(){
		var id = general_menu_id;
		var name = $("#name").val();
		var desc = $("#desc").val();
		var index = $("#index").val();
		if(name.trim(name)===""||desc.trim(desc)===""||index.trim(index)===""){
			new PNotify({
	            title: '错误：',
	            text: '请将信息填写完整！',
	            type: 'error'
	        });
			return;
		}
		if(!checkNum(index)){
			return;
		}
		
		$.post(appName + editUrl, {
			"id" : id,
			"name" : $("#name").val(),
			"desc" : $("#desc").val(),
			"index" : $("#index").val(),
			"parent" : $("#parent").val()
		}, function(data) {
			if (data == "0") {
				new PNotify({
		            title: '错误：',
		            text: '添加失败！',
		            type: 'error'
		        });
				
			}else if(data=="2"){
				new PNotify({
		            title: '错误：',
		            text: '该内容已存在，无法修改！',
		            type: 'error'
		        });
			} else {
				$("#updateGeneralMenuDiv").modal('hide');
				refresh();
			}
		});
	}
	
	var operateEdit = function(id) {
		general_menu_id = id;
		$.post(appName + singleIdQueryUrl + "?id=" + id, function(data) {
			$("#parent").empty();
			$(data).each(function(key, val) {
				if(key==0){
					$("#name").val(val);
				}else if(key==1){
					$("#desc").val(val);
				}else if(key==2){
					$("#index").val(val);
				}else{
					$("#parent").append("<option>"+val+"</option>");
				}
			});
		}, "json");
		
		$("#updateGeneralMenuDiv").modal('toggle');
		clearUpdateDiv();
	};
	
	var operateDel = function(id,name) {
		if (id == "") {
			new PNotify({
	            title: '提示：',
	            text: '删除请谨慎操作，只能选取当行！'
	        });
			return;
		}
		ids = new Array();
		ids.push(id);

		userDialog = new BootstrapDialog.show({
			title : '提示',
			message : '您是否确定删除该条数据?',
			buttons : [ 
			{
				label : '取消',
				cssClass : 'btn-default',
				action : function(dialogItself) {
					dialogItself.close();
				}
			},{
				label : '确认',
				cssClass : 'btn-primary',
				action : function() {
					$(".easyui-panel").easyMask("show", {
						msg : "请稍候..."
					});
					$.post(appName + deleteUrl, {
						'ids' : ids.join(",")
					}, function(data) {
						if (data == 1) {
							$(".easyui-panel").easyMask("hide", {
								msg : "请稍候..."
							});
							$("#previewGrid").datagrid('reload');
							userDialog.close();
						} else if (data == 2){
							new PNotify({
					            title: '错误：',
					            text: '删除失败!请先将常见问题映射关系解除！',
					            type:"error"
					        });
						} else if (data == 3){
							new PNotify({
					            title: '信息：',
					            text: '删除成功!部分菜单与常见问题存在映射关系，无法删除！',
					            type: "success"
					        });
							$(".easyui-panel").easyMask("hide", {
								msg : "请稍候..."
							});
							$("#previewGrid").datagrid('reload');
							$("#delDiv").modal('hide');
						} else {
							new PNotify({
					            title: '错误：',
					            text: '删除此分组失败!',
					            type:"error"
					        });
						}
					});
				}
			} ]
		});

	};
	
	
	
	var initVar = function() {
		$previewGrid = $("#previewGrid");
		$keyword = $("#keyword");
		$keyword.bind('keypress', function(event) {
			if (event.keyCode == "13") {
				gridReload();
			}
		});
		$toolbar = $("#toolbarPreview");
		tableWidth = $("body").width() - 2 * 22;
		remainWidth = tableWidth;
	};
	var initGrid = function() {
		$previewGrid.datagrid(gridConfig());
		$previewGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100, 150 ]));
		/*$(".datagrid-wrap").css("border-left-width", 0);
		$(".datagrid-wrap").css("border-right-width", 0);
		$(".datagrid-wrap").css("border-bottom-width", 20);*/
	};
	var refresh = function() {
		$previewGrid.datagrid('reload');
	};
	var method = {
		init : function() {
			initVar();
			initGrid();
		},
		gridReload : gridReload,
		batchDelete : batchDelete,
		operateEdit : operateEdit,
		operateEdit_ajax : operateEdit_ajax,
		operateAppend : operateAppend,
		operateAppend_ajax : operateAppend_ajax,
		operateDel:operateDel,
	};

	return method;
})(jQuery);


function delmenu(ids,deleteUrl){
	$("#del_confirmed").click(function(){
		$(".easyui-panel").easyMask("show", {
			msg : "请稍候..."
		});
		$.post(appName + deleteUrl, {
			'ids' : ids.join(",")
		}, function(data) {
			if (data == 1) {
				$(".easyui-panel").easyMask("hide", {
					msg : "请稍候..."
				});
				$("#previewGrid").datagrid('reload');
				$("#delDiv").modal('hide');
			} else if (data == 2){
				new PNotify({
		            title: '错误：',
		            text: '删除失败!请先将常见问题映射关系解除！',
		            type:"error"
		        });
			} else if (data == 3){
				new PNotify({
		            title: '信息：',
		            text: '删除成功!部分菜单与常见问题存在映射关系，无法删除！',
		            type: "success"
		        });
				$(".easyui-panel").easyMask("hide", {
					msg : "请稍候..."
				});
				$("#previewGrid").datagrid('reload');
				$("#delDiv").modal('hide');
			} else {
				new PNotify({
		            title: '错误：',
		            text: '删除此分组失败!',
		            type:"error"
		        });
			}
		});
	});
}


function checkNum(num){
	var reg = /^[1-9]\d*$/;
	if(!reg.test(num)){
		new PNotify({
            title: '提示：',
            text: '请输入大于1（包括1）的整数字符！'
        });
		return false;
	}else{
		if(num<0||parseInt(num)>10){
			new PNotify({
                title: '提示：',
                text: "请输入1到" + 10 + "的整数！"
            });
			return false;
		}else{	
			return true;
		}
	}
}