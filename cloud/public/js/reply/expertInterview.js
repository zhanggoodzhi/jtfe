var previewReplyList = (function($, undefined) {
	// 页面元素
	var $previewGrid = undefined;
	var $keyword = undefined;
	var tableWidth = 0;
	var queryUrl = "expertInterviews/queryPreviewReplyPersonalLetters";
	var deleteUrl = "expertInterviews/doDeleteExpertInterviews";
	var updateUrl = "expertInterviews/doPubExpertInterviews";
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
			toolbar : "#toolbarPreview",
			url : queryUrl,
			queryParams : queryParams,
			striped : true,
			fitColumns : true,
			sortName : "pub",
			sortOrder : "desc",
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
			columns : [ [
					{
						field : 'serial',
						title : '',
						width : autoWidth(0.15),
						checkbox : true,
						align : 'center'
					},
					{
						field : 'fromUser',
						title : '用户',
						width : autoWidth(0.10),
						align : 'center'
					},
					{
						field : 'content',
						title : '问题',
						width : autoWidth(0.15),
						align : 'center'
					},
					{
						field : 'to',
						title : '@专家',
						width : autoWidth(0.10),
						align : 'center'
					},
					{
						field : 'content2',
						title : '专家回复',
						width : autoWidth(0.25),
						align : 'center'
					},
					{
						field : 'sendTime',
						title : '创建时间',
						width : autoWidth(0.12),
						align : 'center',
						formatter : function(value, rowData, rowIndex) {
							var date = new Date(value);
							var formatDate = date
									.formatDate("yyyy-MM-dd hh:mm:ss");
							return formatDate;
						}
					},
					{
						field : 'pub',
						title : '策略',
						width : autoWidth(0.06),
						sortable : true,
						align : 'center',
						formatter : function(value, rowData, rowIndex) {
							return value == 1 ? "开放"
									: "<label class='fc_71'>屏蔽</label>";
						}
					},
					{
						field : 'opt',
						title : '&nbsp;&nbsp;操作&nbsp;&nbsp;',
						width : autoWidth(0.15),
						align : 'center',
						formatter : function(value, rec) {
							if (rec.pub == 1) {
								var btnHide = '<a class="btnHideDA" onclick="previewReplyList.batchUpdateState('
										+ rec.id
										+ ',0)" href="/cloud/config/classifyTag">设置屏蔽</a>';
								return btnHide;
							} else {
								var btnShow = '<a class="btnShowDA" onclick="previewReplyList.batchUpdateState(\''
										+ rec.id
										+ '\',1)" href="javascript:void(0)">设置开放</a>';
								return btnShow;
							}
						}
					}, ] ],
			onLoadSuccess : function() {
				$('.btnHideDA').linkbutton({
					text : '设置屏蔽',
					plain : true,
					iconCls : 'icon-remove'
				});
				$('.btnShowDA').linkbutton({
					text : '设置开放',
					plain : true,
					iconCls : 'icon-add'
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

	var operateDelete = function(personalLetterId) {
		pairIds = new Array();
		pairIds.push(personalLetterId);
		deleteExperterView();
		return false;
	};
	var batchDelete = function() {
		var rows = $previewGrid.datagrid("getSelections");
		pairIds = new Array();
		for ( var index in rows) {
			pairIds.push(rows[index].id);
		}
		deleteExperterView();
	};
	var deleteExperterView = function() {
		if (pairIds.length > 0) {
			// $.messager.confirm("提示","确认删除？",function(yes){
			// if(yes){
			$.post(deleteUrl, {
				"ids" : pairIds.join(",")
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
			// }
			// });
		} else {
			$.messager.alert("提示", "请选择要删除的问题!", 'warning');
		}

	};
	var batchUpdateState = function(id,state) {
		$.post(updateUrl, {
			"id" : id,
			"state":state
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
	}

	var initVar = function() {
		$previewGrid = $("#previewGrid");
		$keyword = $("#keyword3");
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
		$(".datagrid-wrap").css("border-left-width",0);
		$(".datagrid-wrap").css("border-right-width",0);
		$(".datagrid-wrap").css("border-bottom-width",0);
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
		operateDelete : operateDelete,
		batchUpdateState:batchUpdateState,
	};

	return method;
})(jQuery);

/**
 * 删除
 */
var ids = [];
function btnDelDA(id) {
	ids = new Array();
	ids.push(id);
	$.messager.confirm("操作提示", "确定要删除该数据？", function(data) {
		if (data) {
			$.post(appName + "/expertInterviews/doDeleteExpertInterviews", {
				'ids' : ids.join(",")
			}, function(data) {
				if (data == "1") {
					previewReplyList.refresh();
				} else {
					$.messager.alert('提示', '删除数据失败！', "error");
				}
			});
		}
	});
}
