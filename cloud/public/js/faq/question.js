var generalMenusSelect=undefined;
var faqSelect=undefined;
function onSelectDeneralMenu(id){
	generalMenusSelect=id;
}
function onSelectFaq(id){
	faqSelect=id;
}
var questionList = (function($, undefined) {
	// 页面元素
	var $questionGrid = undefined;
	var $keywordQuestion = undefined;
	
	var queryUrl="faq/queryFrequentQuestion";
	var updateUrl="/faq/updateFrequent";
	var queryParams = {
			keyword : "",
			generalMenuId:$("#generalMenucomboBoxId").val(),
			faq:$("#faqBoxId").val()
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
			height : document.body.scrollHeight - 220,
			url : queryUrl,
			queryParams : queryParams,
			toolbar : "#toolbarQuestion",
			striped : true,
			fitColumns : true,
			sortName : "pid",
			sortOrder : "asc",
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
			columns : [ [
					{
						field : 'pid',
						title : '',
						width : autoWidth(0.00),
						sortable : true,
						align : 'center',
						hidden : true
					},
//					{
//						field : 'menu',
//						title : '所属菜单',
//						width : autoWidth(0.05),
//						sortable : true,
//						align : 'center',
//					},
					{
						field : 'question',
						title : '问题',
						width : autoWidth(0.15),
						sortable : true,
						align : 'left',
						formatter : function(value, rowData, rowIndex){
							return cloudUtil.gridHtmlTips(value, 30);
						}
					},
					{
						field : 'answer',
						title : '答案文本',
						width : autoWidth(0.20),
						sortable : true,
						align : 'left',
						formatter : function(value, rowData, rowIndex){
							return cloudUtil.gridHtmlTips(value, 40);
						}
					},
					{
						field : 'classify',
						title : '分类',
						width : autoWidth(0.05),
//						sortable : true,
						align : 'center'
					},
					{
						field : 'faq',
						title : 'FAQ',
						width : autoWidth(0.02),
						sortable : true,
						align : 'center',
						formatter : function(value, rowData, rowIndex) {
							return (value) ? "是"
									: "<label class='fc_71'>否</label>";
						}
					},
					{
						field : 'createtime',
						title : '创建时间',
						width : autoWidth(0.05),
						sortable : true,
						align : 'center'
					},
					{
						field : 'opt',
						title : '&nbsp;&nbsp;操作&nbsp;&nbsp;',
						width : autoWidth(0.05),
						align : 'center',
						formatter : function(value, rec) {
							if (rec.faq) {
								var btnHide = '<a class="hideQuestion" onclick="questionList.faqUpdate(\''
									+ rec.pid
									+ '\')">隐藏</a>';
								return btnHide;
							} else {
								var btnShow = '<a class="showQuestion" onclick="questionList.faqUpdate(\''
									+ rec.pid
									+ '\')">显示</a>';
								return btnShow;
							}
							
						}
					},] ],
				onLoadSuccess : function() {
					$('.hideQuestion').linkbutton({
						text : '设置屏蔽',
						plain : true,
						iconCls : 'icon-remove'
					});
					$('.showQuestion').linkbutton({
						text : '设置开放',
						plain : true,
						iconCls : 'icon-add'
					});
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
	var questionGridReload = function() {
		$keywordQuestion = $("#keywordQuestion");
		
		queryParams.keyword = $keywordQuestion.val();
		queryParams.generalMenuId =$("#generalMenucomboBoxId").val();
		queryParams.faq =$("#faqBoxId").val();
		// TODO,抽取参数queryParams, Grid方便后期重构
		$questionGrid.datagrid('load', queryParams);

	};	
	
	var faqUpdate = function(pid){
		$(".easyui-panel").easyMask("show", {
			msg : "请稍候..."
		});
		$.post(appName + updateUrl, {
			'pid' : pid
		}, function(data) {
			if (data == 1) {
				new PNotify({
		            title: '信息：',
		            text: '修改成功!',
		            type: "success"
		        });
				questionGridReload();
				$(".easyui-panel").easyMask("hide", {
					msg : "请稍候..."
				});
			} else {
				new PNotify({
		            title: '错误：',
		            text: '修改失败!',
		            type: "error"
		        });
			}
		});
	};
	
	
	var refresh = function() {
		$questionGrid.datagrid('reload');
	};
	
	
	var initGrid = function() {
		$questionGrid.datagrid(gridConfig());
		$questionGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100, 150 ]));
		/*$(".datagrid-wrap").css("border-left-width", 0);
		$(".datagrid-wrap").css("border-right-width", 0);
		$(".datagrid-wrap").css("border-bottom-width", 20);*/
	};
	
	var initVar = function() {
		$questionGrid = $("#questionGrid");
		$toolbar = $("#toolbarQuestion");
		$keywordQuestion = $("#keywordQuestion");
		$keywordQuestion.bind('keypress', function(event) {
			if (event.keyCode == "13") {
				questionGridReload();
			}
		});
		tableWidth = $("body").width() - 2 * 22;
		remainWidth = tableWidth;
		
	};

	var method = {
		init : function() {
			initVar();
			initGrid();
		},
		questionGridReload : questionGridReload,
		faqUpdate : faqUpdate
	};

	return method;
})(jQuery);


