var noReplyList = (function($, undefined) {
	// 页面元素
	var $noReplyGrid = undefined;
	var $keyword = undefined;
	var tableWidth = 0;
	var queryUrl = "personalLetter/queryNoReplyPersonalLetters";
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
			height : document.body.scrollHeight - 130,
			toolbar : "#toolbarNoReply",
			url : queryUrl,
			queryParams : queryParams,
			striped : true,
			singleSelect : true,
			fitColumns : true,
			sortName : "sendTime",
			sortOrder : "desc",
			pagination : true,
			pageSize : 100,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
			columns : [ [ {
				field : 'fromUser',
				title : '用户账号',
				width : autoWidth(0.10),
				sortable : true,
				align : 'center',
				halign : "center"
			}, {
				field : 'content',
				title : '问题',
				width : autoWidth(0.35),
				sortable : true,
				align : 'left',
				halign : "center"
			}, {
				field : 'content3',
				title : '系统自动回复',
				width : autoWidth(0.20),
				sortable : true,
				align : 'left',
				halign : "center"
			}, {
				field : 'to',
				title : '@专家',
				width : autoWidth(0.1),
				sortable : true,
				align : 'center'
			}, {
				field : 'sendTime',
				title : '提问时间',
				width : autoWidth(0.12),
				sortable : true,
				align : 'center',
				formatter : function(value, rowData, rowIndex) {
					var date = new Date(value);
					var formatDate = date.formatDate("yyyy-MM-dd hh:mm:ss");
					return formatDate;
				}
			} ] ],
			onLoadSuccess : function() {
				$noReplyGrid.datagrid("uncheckAll");
			},
			onSelect : function(rowIndex, rowData) {
				id = rowData.id;
				selected = rowIndex;
				$qNode.val(rowData.content);
				$aNode.focus();
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
		$noReplyGrid.datagrid('load', queryParams);

	};

	var initVar = function() {
		$qNode = $("#q");
		$aNode = $("#a");
		$noReplyGrid = $("#noReplyGrid");
		$keyword = $("#keyword");
		$keyword.bind('keypress', function(event) {
			if (event.keyCode == "13") {
				gridReload();
			}
		});
		$toolbar = $("#toolbarNoReply");
		tableWidth = $("body").width() - 2 * 22;
		remainWidth = tableWidth;
	};
	var initGrid = function() {
		$noReplyGrid.datagrid(gridConfig());
		$noReplyGrid.datagrid('getPager').pagination(
				pageConfig(100, [ 50, 100, 150 ]));
		$(".datagrid-wrap").css("border-left-width", 0);
		$(".datagrid-wrap").css("border-right-width", 0);
		$(".datagrid-wrap").css("border-bottom-width", 0);
	};
	var refresh = function() {
		$noReplyGrid.datagrid('reload');
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

function doReplyExpert(){
	if(id===null){
		alert("先选中一个问题回复后提交");
		return;
	}
	var val=$("#a").val();
	if(val==null||$.trim(val)==""){
		alert("请输入回复内容后提交");	
		$("#a").val("");
		$("#a").focus();
		return;
	}
	$.post('personalLetter/doReplyExpert',{
		id:id,
		text:val
	},function(data){
		if(data=='ok'){
			$("#noReplyGrid").datagrid('deleteRow',selected);
			id=null;
			selected=null;
			$("#q").val('');
			$("#a").val('');
			noReplyList.refresh();
		}else{
			alert('系统异常,请稍后再试');
		}
	},'text');
}
