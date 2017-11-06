var dgList = (function($,undefined){
	// 页面元素
	var $dg= undefined;
	var $keyword = undefined;
	var tableWidth = 0;
	var queryUrl = "sensitiveWord/querySensitiveWord1";
	var queryParams = {keyword:""};
	var remainWidth = 0;
	var autoWidth = function(percent, minWidth, remainMinWidth){
		var result = 0;
		if(remainMinWidth){
			result =  Math.max(remainWidth, remainMinWidth);
		}else if(minWidth){
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		}else{
			result = Math.round(tableWidth * percent);
		}
		remainWidth = remainWidth - result;
		return result;
	};
	// 配置参数
	var gridConfig = function(){ 
		return {
			toolbar : "#toolbar",
			url : queryUrl,
			queryParams : queryParams,
			striped : true,
			fitColumns : true,
			sortName : "id",
			sortOrder : "desc",
			pagination : true,
			pageSize : 20,
			pageList : [20,50,100],
			rownumbers : true,
			singleSelect : true,
			checkOnSelect : false,// 选择checkbox则选择行
			selectOnCheck : false,// 选择行则选择checkbox
			columns : [ [ 
			{
				field : 'word',
				title : '敏感词',
				width : autoWidth(0.15),
				sortable : true,
				align : 'center'
			}] ],
			 onLoadSuccess : function(){
				 $dg.datagrid("uncheckAll");
				}
			};
		};
		var pageConfig = function(pageSize, pageList){
			return {  
		        pageSize: pageSize,
		        pageList: pageList,
		        beforePageText: '第',
		        afterPageText: '页    共 {pages} 页',  
		        displayMsg: '显示 {from} - {to} 条,  共 {total}条',  
		    };
		}
		var gridReload = function(){
			queryParams.keyword = $keyword.val();
			//TODO,抽取参数queryParams, Grid方便后期重构
			$dg.datagrid('load', queryParams);
			
		};
		
		var initVar = function(){
			$dg = $("#dg");
			$keyword = $("#keyword");
			$keyword.bind('keypress',function(event){
	            if(event.keyCode == "13"){
	            	gridReload();
	            }
	        });
			$toolbar = $("#toolbar");
			tableWidth = $("body").width() - 2*22;
			remainWidth = tableWidth;
		};
		var initGrid = function (){
			$dg.datagrid(gridConfig());
			$dg.datagrid('getPager').pagination(pageConfig(20,[20,50,100]));
		};
		var refresh = function(){
			$dg.datagrid('reload');
		};
		var method = {
				init : function(){
					initVar();
					initGrid();
				},
				gridReload : gridReload,
			};

			return method;
		})(jQuery);
var dg2List = (function($,undefined){
	// 页面元素
	var $dg2= undefined;
	var $keyword = undefined;
	var tableWidth = 0;
	var queryUrl = "sensitiveWord/querySensitiveWord2";
	var queryParams = {keyword:""};
	var remainWidth = 0;
	var autoWidth = function(percent, minWidth, remainMinWidth){
		var result = 0;
		if(remainMinWidth){
			result =  Math.max(remainWidth, remainMinWidth);
		}else if(minWidth){
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		}else{
			result = Math.round(tableWidth * percent);
		}
		remainWidth = remainWidth - result;
		return result;
	};
	// 配置参数
	var gridConfig = function(){ 
		return {
			toolbar : "#toolbar2",
			url : queryUrl,
			queryParams : queryParams,
			striped : true,
			fitColumns : true,
			sortName : "id",
			sortOrder : "desc",
			pagination : true,
			pageSize : 20,
			pageList : [20,50,100],
			rownumbers : true,
			singleSelect : true,
			checkOnSelect : false,// 选择checkbox则选择行
			selectOnCheck : false,// 选择行则选择checkbox
			columns : [ [ 
			{
				field : 'word',
				title : '敏感词',
				width : autoWidth(0.25),
				sortable : true,
				align : 'center'
			}] ],
			 onLoadSuccess : function(){
				 $dg2.datagrid("uncheckAll");
				}
			};
		};
		var pageConfig = function(pageSize, pageList){
			return {  
		        pageSize: pageSize,
		        pageList: pageList,
		        beforePageText: '第',
		        afterPageText: '页    共 {pages} 页',  
		        displayMsg: '显示 {from} - {to} 条,  共 {total}条',  
		    };
		}
		var gridReload = function(){
			queryParams.keyword = $keyword.val();
			//TODO,抽取参数queryParams, Grid方便后期重构
			$dg2.datagrid('load', queryParams);
			
		};
		
		var initVar = function(){
			$dg2 = $("#dg2");
			$keyword = $("#keyword2");
			$keyword.bind('keypress',function(event){
	            if(event.keyCode == "13"){
	            	gridReload();
	            }
	        });
			$toolbar = $("#toolbar2");
			tableWidth = $("body").width() - 2*22;
			remainWidth = tableWidth;
		};
		var initGrid = function (){
			$dg2.datagrid(gridConfig());
			$dg2.datagrid('getPager').pagination(pageConfig(20,[20,50,100]));
			$(".datagrid-wrap").css("border-right-width",0);
		};
		var refresh = function(){
			$dg2.datagrid('reload');
		};
		var method = {
				init : function(){
					initVar();
					initGrid();
				},
				gridReload : gridReload,
			};

			return method;
		})(jQuery);

var dg3List = (function($,undefined){
	// 页面元素
	var $dg3= undefined;
	var $keyword = undefined;
	var tableWidth = 0;
	var queryUrl = "sensitiveWord/querySensitiveWord3";
	var queryParams = {keyword:""};
	var remainWidth = 0;
	var autoWidth = function(percent, minWidth, remainMinWidth){
		var result = 0;
		if(remainMinWidth){
			result =  Math.max(remainWidth, remainMinWidth);
		}else if(minWidth){
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		}else{
			result = Math.round(tableWidth * percent);
		}
		remainWidth = remainWidth - result;
		return result;
	};
	// 配置参数
	var gridConfig = function(){ 
		return {
			toolbar : "#toolbar3",
			url : queryUrl,
			queryParams : queryParams,
			striped : true,
			fitColumns : true,
			sortName : "id",
			sortOrder : "desc",
			pagination : true,
			pageSize : 20,
			pageList : [20,50,100],
			rownumbers : true,
			singleSelect : true,
			checkOnSelect : false,// 选择checkbox则选择行
			selectOnCheck : false,// 选择行则选择checkbox
			columns : [ [ 
			{
				field : 'word',
				title : '敏感词',
				width : autoWidth(0.40),
				sortable : true,
				align : 'center'
			},{
				field : 'createTime',
				title : '创建时间',
				width : autoWidth(0.12),
				sortable : true,
				align : 'center',
					formatter : function(value, rowData,
							rowIndex) {
						var date = new Date(value);
						var formatDate = date.formatDate("yyyy-MM-dd");
						return formatDate;
					}
			}, 
			{
				field : 'updateTime',
				title : '修改时间',
				width : autoWidth(0.12),
				sortable : true,
				align : 'center',
					formatter : function(value, rowData,
							rowIndex) {
						var date = new Date(value);
						var formatDate = date.formatDate("yyyy-MM-dd");
						return formatDate;
					}
			}] ],
			 onLoadSuccess : function(){
				 $dg3.datagrid("uncheckAll");
				}
			};
		};
		var pageConfig = function(pageSize, pageList){
			return {  
		        pageSize: pageSize,
		        pageList: pageList,
		        beforePageText: '第',
		        afterPageText: '页    共 {pages} 页',  
		        displayMsg: '显示 {from} - {to} 条,  共 {total}条',  
		    };
		}
		var gridReload = function(){
			queryParams.keyword = $keyword.val();
			//TODO,抽取参数queryParams, Grid方便后期重构
			$dg3.datagrid('load', queryParams)
			
		};
		
		var initVar = function(){
			$dg3 = $("#dg3");
			$keyword = $("#keyword3");
			$keyword.bind('keypress',function(event){
	            if(event.keyCode == "13"){
	            	gridReload();
	            }
	        });
			$toolbar = $("#toolbar3");
			tableWidth = $("body").width() - 2*22;
			remainWidth = tableWidth;
		};
		var initGrid = function (){
			$dg3.datagrid(gridConfig());
			$dg3.datagrid('getPager').pagination(pageConfig(20,[20,50,100]));
		};
		var refresh = function(){
			$dg3.datagrid('reload');
		};
		var method = {
				init : function(){
					initVar();
					initGrid();
				},
				gridReload : gridReload,
			};

			return method;
		})(jQuery);


















function add() {
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length>0) {
		var ids = '';
		for (var i = 0; i < rows.length; i++) {
			if (i != (rows.length - 1))
				ids += rows[i].id + ',';
			else
				ids += rows[i].id;
		}
		if (ids=='') return;
		$.post('sensitiveWord/preset/picked/add', {
			ids : ids
		}, function(result) {
			if (result.success) {
				doRefresh();
			} else {
				$.messager.show({
					title : 'Error',
					msg : result.errorMsg
				});
			}
		}, 'json');
	}else{
		new PNotify({
            title: '提示：',
            text: "请在【未选择的预置敏感词】表格中选择预置敏感词！"
        });
	}
}
function del() {
	var rows = $('#dg2').datagrid('getSelections');
	if (!$.isEmptyObject(rows)) {
		$.messager.confirm('Confirm', '确定要删除吗?', function(r) {
			if (r) {
				var ids = '';
				for (var i = 0; i < rows.length; i++) {
					if (i != (rows.length - 1))
						ids += rows[i].id + ',';
					else
						ids += rows[i].id;
				}
				$.post('sensitiveWord/preset/picked/del', {
					ids : ids
				}, function(result) {
					if (result.success) {
						doRefresh();
					} else {
						$.messager.show({
							title : 'Error',
							msg : result.errorMsg
						});
					}
				}, 'json');
			}
		});
	}
}

function doRefresh() {
	$('#dg').datagrid('clearChecked');
	$('#dg').datagrid('clearSelections');
	$('#dg').datagrid('unselectAll');
	$('#dg2').datagrid('clearChecked');
	$('#dg2').datagrid('clearSelections');
	$('#dg2').datagrid('unselectAll');
	$('#dg').datagrid('reload');
	$('#dg2').datagrid('reload');
}

function showDialog() {
	$('#dd').dialog('open');
}

function hideDialog() {
	$('#dd').dialog('close');
}

function add2() {
	$.messager.progress(); // 显示进度条
	$('#ff').form('submit', {
		url : 'sensitiveWord/prefer/add',
		onSubmit : function() {
			var isValid = $(this).form('validate');
			if (!isValid) {
				$.messager.progress('close'); // 如果表单是无效的则隐藏进度条
			}
			return isValid; // 返回false终止表单提交
		},
		success : function(data) {
			data = $.parseJSON(data);
			$.messager.progress('close'); // 如果提交成功则隐藏进度条
			hideDialog();
			if (data.success)
				doRefresh2();
			else
				$.messager.show({
					showType : 'fade',
					title : '添加失败',
					msg : data.errorMsg,
					timeout : 4000
				});
		}
	});
}
function del2() {
	var rows = $('#dg3').datagrid('getSelections');
	if (rows.length == 0) {
		$.messager.alert('提示', '请至少选择一条数据', "warning");
		return;
	}
	if (!$.isEmptyObject(rows)) {
		$.messager.confirm('Confirm', '确定要删除吗?', function(r) {
			if (r) {
				var ids = '';
				for (var i = 0; i < rows.length; i++) {
					if (i != (rows.length - 1))
						ids += rows[i].id + ',';
					else
						ids += rows[i].id;
				}
				$.post('sensitiveWord/prefer/del', {
					ids : ids
				}, function(result) {
					if (result.success) {
						doRefresh2();
					} else {
						$.messager.show({
							title : 'Error',
							msg : result.errorMsg
						});
					}
				}, 'json');
			}
		});
	}
}

function doRefresh2() {
	$('#dg3').datagrid('clearChecked');
	$('#dg3').datagrid('clearSelections');
	$('#dg3').datagrid('unselectAll');
	$('#dg3').datagrid('reload');
}