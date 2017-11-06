$(function () {
	addRecommend.init();
});


var addRecommend = (function ($, undefined) {
	var dialog = frameElement.dialog;
	var $questionQuery = undefined;
	var $questionGrid = undefined;
	var $questionComboBox = undefined;


	var $recommendGrid = undefined;
	var $recommendQuery = undefined;
	var $recommendComboBox = undefined;
	var $questionKeyword = undefined;
	var $recommendKeyword = undefined;

	var questionBoxManager = undefined;
	var recommendBoxManager = undefined;

	// var queryUrl = "queryPairs1";
	var queryUrl = "listCorpus";
	var saveUrl = "saveRecommend";
	var saveData = { questionId: undefined, recommendQuestionId: undefined };
	var tableWidth = 0;
	var remainWidth = 0;

	var keyword = "";
	var classifys = null;
	var queryParams = { keyword: "", classifys: classifys ,fullmatch:0};
	var keywordDefault = "关键字/ID";
	var saveData = { questionId: undefined, recommendQuestionId: undefined };

	// 配置参数
	var gridConfig = function (toolbarId, queryParams, displayName, onSelect) {
		return {
			toolbar: "#" + toolbarId,
			url: queryUrl,
			queryParams: queryParams,
			singleSelect: true,
			sortName: "id",
			sortOrder: "desc",
			pagination: true,
			pageSize: 10,
			pageList: [10, 20, 100],
			onSelect: onSelect,
			columns: [[{
				field: "id",
				title: "ID",
				width: autoWidth(0.07, 60),
				align: "center",
				halign: "center",
				sortable: true
			}, {
					field: "question",
					title: displayName,
					width: autoWidth(0.33, 250),
					align: "left",
					halign: "center",
					sortable: true
				}, {
					field: "classifyName",
					title: "类型",
					width: autoWidth(0.1, 120),
					align: "left",
					halign: "center",
					sortable: true
				}
			]],
		};
	};
	var comboBoxConfig = function () {
		return {
			width: 180,
			selectBoxWidth: 180,
			selectBoxHeight: 180,
			valueField: "id",
			textField: "value",
			treeLeafOnly: true,
			tree: {
				url: "classifys",
				ajaxType: "post",
				idFieldName: "id",
				parentIDFieldName: "parentId",
				textFieldName: "value",
				slide: true,
				isExpand: 2,
				onSelect: function (node) {
					console.log(node);
				}
			}
		};
	};

	var pageConfig = function (pageSize, pageList) {
		return {
			pageSize: pageSize,
			pageList: pageList,
			beforePageText: '第',
			afterPageText: '页',
			displayMsg: '显示 {from} - {to} 条',
		};
	}

	var autoWidth = function (percent, minWidth, remainMinWidth) {
		var result = 0;
		if (remainMinWidth) {
			result = Math.max(remainWidth, remainMinWidth);
		} else if (minWidth) {
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		} else {
			result = Math.round(tableWidth * percent);
		}

		remainWidth = remainWidth - result;
		//console.log("table width = " + tableWidth + ", percent  = " + percent +", result  = " + result);
		return result;
	};

	var initDialog = function () {

		dialog.options.buttons[0].onclick = function () {
			saveRecommend();
		};
	};

	var initGrid = function () {
		$questionGrid.datagrid(gridConfig("questionToolbar", queryParams, "问题", function (rowIndex, rowData) { saveData.questionId = rowData.questionId; }));
		$questionGrid.datagrid('getPager').pagination(pageConfig(10, [10, 20, 100]));

		$recommendGrid.datagrid(gridConfig("recommendToolbar", queryParams, "推荐问题", function (rowIndex, rowData) { saveData.recommendQuestionId = rowData.questionId; }));
		$recommendGrid.datagrid('getPager').pagination(pageConfig(10, [10, 20, 100]));
	};
	var initComboBox = function () {
		questionBoxManager = $questionComboBox.ligerComboBox(comboBoxConfig());
		recommendBoxManager = $recommendComboBox.ligerComboBox(comboBoxConfig());
	};

	var initVar = function () {
		$questionGrid = $("#questionGrid");
		$recommendGrid = $("#recommendGrid");
		$questionComboBox = $("#questionClassifys");
		$recommendComboBox = $("#recommendClassifys");
		$questionKeyword = $("#questionKeyword");
		$recommendKeyword = $("#recommendKeyword");
	};

	var gridReload = function ($grid, comboBoxManager, $keyword) {
		var reg = new RegExp(";", "g");
		if (comboBoxManager.getValue().replace(reg, ",") != "") {
			classifys = comboBoxManager.getValue().replace(reg, ",");
		}/*else{
			classifys = -100;
		}*/
		queryParams.classifys = classifys;
		queryParams.keyword = $keyword.val();
		$grid.datagrid('load', queryParams);

	};


	var method = {
		init: function () {
			initVar();
			initDialog();
			initGrid();
			initComboBox();
		},
		questionGridReload: function () {
			gridReload($questionGrid, questionBoxManager, $questionKeyword);
		},
		recommendGridReload: function () {
			gridReload($recommendGrid, recommendBoxManager, $recommendKeyword);
		},
	};


	//	var gridQueryClick = function (mode, comboBoxManager, gridManager){
	//		if(!comboBoxManager){
	//			//treeManager = $tree.ligerGetTreeManager();
	//			if(mode == 1){
	//				comboBoxManager = $("#classify").ligerGetComboBoxManager();
	//			}else{
	//				comboBoxManager = $("#recommendClassify").ligerGetComboBoxManager();
	//			}
	//			
	//		}
	//		
	//		//var notes = treeManager.getChecked();
	//		var reg=new RegExp(";","g");
	//		if(comboBoxManager.getValue().replace(reg,",") != ""){
	//			classifys = comboBoxManager.getValue().replace(reg,",");
	//		}else{
	//			classifys = new Array();
	//			classifys.push(-100);
	//		}
	//		
	//		if(!gridManager){
	//			if(mode == 1){
	//				gridManager = $questionGrid.ligerGetGridManager();
	//			}else{
	//				gridManager = $recommendGrid.ligerGetGridManager();
	//			}
	//		}
	//		
	//		gridManager.set({parms:{classifys:classifys,keyword:keyword}});
	//		gridManager.options.newPage = 1;
	//		$(".l-bar-btnfirst span", gridManager.toolbar).addClass("l-disabled");
	//		$(".l-bar-btnprev span", gridManager.toolbar).addClass("l-disabled");
	//		$questionGrid.show();
	//		
	//		
	//		console.log(comboBoxManager.getValue());
	//		gridManager.reload();
	//	};



	var saveRecommend = function () {

		if (!saveData.questionId || !saveData.recommendQuestionId) {
			new PNotify({
				title: '提示：',
				text: "请选择问题和要推荐的问题!"
			});
		} else {
			//$.ligerDialog.waitting("保存中");
			$.post(saveUrl, saveData, function (data) {
				$.ligerDialog.closeWaitting();
				if (data.status == "warning") {
					new PNotify({
						title: '提示：',
						text: data.message
					});
				} else if (data.status == "warn") {
					new PNotify({
						title: '提示：',
						text: data.message
					});
				} else if (data.status == "save") {
					new PNotify({
						title: '信息：',
						text: data.message,
						type: 'success'
					});
					parent.recommendList.addRefresh();


				} else {
					new PNotify({
						title: '提示：',
						text: data.message
					});
				}
			});
		}
	};



	return method;
})(jQuery);


