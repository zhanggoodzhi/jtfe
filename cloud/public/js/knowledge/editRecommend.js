$(function(){
	editRecommend.init();
});

var editRecommend = (function($,undefined){
	var dialog = frameElement.dialog; 
	var $questionQuery = undefined;
	var $questionGrid = undefined;
	var $recommendGrid = undefined;
	var $recommendQuery = undefined;
	var gridManager = undefined;
	var comboBoxManager = undefined;
	
	var recommendGridManager = undefined;
	var recommendBoxManager = undefined;
	
	var queryUrl = "queryPairs";
	var saveUrl = "saveRecommend";
	var saveData = {questionId:undefined, recommendQuestionId:undefined};

	var keyword = "";
	var keywordDefault = "关键字/ID";
	var classifys = [-100];
	var pairIds = [];

	
	var method = {
		init : function(){
			$tree = $("#classifysTree");
			$questionGrid = $("#questionGrid");
			$recommendGrid = $("#recommendGrid");
			$questionQuery = $("#gridQuery");
			
			
			//cloudKnowledge.getTree("classifys", "classifysTree", "id", "parentId", "value");
			//treeManager = $("#classifysTree").ligerGetTreeManager();
			
			initGrid();
			$questionQuery.click(gridQueryClick);
			
			$(".comboBoxDiv").css("margin-top","0px");
			initDialog();
		},
		editCorpus : function(rowindex){
			editCorpus(rowindex);
		},
		deleteCorpusClick : function (rowindex) {
			pairIds = new Array();
			pairIds.push(gridManager.getRow(rowindex).id);
			deleteCorpus();
		}
	};
	
	
	var gridQueryClick = function (mode, comboBoxManager, gridManager){
		if(!comboBoxManager){
			//treeManager = $tree.ligerGetTreeManager();
			if(mode == 1){
				comboBoxManager = $("#classify").ligerGetComboBoxManager();
			}else{
				comboBoxManager = $("#recommendClassify").ligerGetComboBoxManager();
			}
			
		}
		
		//var notes = treeManager.getChecked();
		var reg=new RegExp(";","g");
		if(comboBoxManager.getValue().replace(reg,",") != ""){
			classifys = comboBoxManager.getValue().replace(reg,",");
		}else{
			classifys = new Array();
			classifys.push(-100);
		}
		
		if(!gridManager){
			if(mode == 1){
				gridManager = $questionGrid.ligerGetGridManager();
			}else{
				gridManager = $recommendGrid.ligerGetGridManager();
			}
		}
		
		gridManager.set({parms:{classifys:classifys,keyword:keyword}});
		gridManager.options.newPage = 1;
		$(".l-bar-btnfirst span", gridManager.toolbar).addClass("l-disabled");
		$(".l-bar-btnprev span", gridManager.toolbar).addClass("l-disabled");
		$questionGrid.show();
		
		
		console.log(comboBoxManager.getValue());
		gridManager.reload();
	};
	
	var initGrid = function(){
		gridManager = $("#questionGrid").ligerGrid({
			columns:[{
				display: "ID",
				name: "id",
				width: "15%"
			},{
				display: "问题",
				name: "question",
				align: "left",
				width: "65%"
			},{
				display: "类型",
				name: "classifyName",
				align: "left",
				//width: "10%"
			}],
			url:queryUrl,
			//checkbox: true,
			width: 440,
			height: 375,
			root:"rows",
			record:"total",
			pagesizeParmName:"pageSize",
			pageParmName:"currentPage",
			pageSizeOptions:[10,20,100],
			pageSize:10,
			method:"post",
			dataAction:"server",
			sortName: "id",
			parms:{classifys:classifys,keyword:keyword},
			onLoaded:function(data){
				$("#questionGrid").find(".l-grid-loading").hide();
				if(data.data && data.data.total == 0){
					$("#questionGrid").find(".l-grid-body2").css({overflow:"hidden"}).html("<div align=center>抱歉，当前搜索条件下无记录</div>");
				}else{
					$("#questionGrid").find(".l-grid-body2").css({"overflow-y":"auto","overflow-x":"hidden"});
				}
			},
			onSelectRow:function(rowdata, rowid, rowobj){
				console.log(rowdata);
				saveData.questionId = rowdata.questionId;
			},
			toolbar:{
				items:[{
					text: "分类",
					type: "comboBox",
					render: true,
					id: "classify",
					config: {
				        width: 180, 
				        selectBoxWidth: 180,
				        selectBoxHeight: 200,
				        valueField: "id",
				        textField: "value",
				        treeLeafOnly: true,
				        tree: { 
				        	url: "knowledge/classifys",
				        	ajaxType: "post", 
				        	idFieldName: "id",
					        parentIDFieldName: "parentId",
					        textFieldName: "value",
					        isMultiSelect: false,
					        slide: true,
					        isExpand: 2,
					        onSelected: function(node){
					        	console.log(node);
					        	console.log("hello");
					        }
					    }
					},
					style: {
						"margin-top":"2px"
					}
				},{
					text: keywordDefault,
					type: "input",
					render: true,
					focus: function(item){

					},
					blur: function(item){
						var ditem = $("[toolbarid="+item.id+"]");
						var dinput = $("input:first", ditem);
						keyword = dinput.val();
					},
					style:{
						"margin-top": "2px",
						border: "1px solid #AECAF0",
						width: "80px"
					},
					bind:{
						act:"keypress",
						fun:function(event){
							if(event.keyCode == "13"){
								gridQueryClick(1, comboBoxManager, gridManager);
							}
						}
					}
					
				}
//				,{
//					text: "查询",
//					click: gridQueryClick,
//					img: contextPath + "/lib/ligerUI/skins/icons/search.gif"
//				}
				]
			}
		});
		

		recommendManager = $("#recommendGrid").ligerGrid({
			columns:[{
				display: "ID",
				name: "id",
				width: "15%"
			},{
				display: "问题",
				name: "question",
				align: "left",
				width: "65%"
			},{
				display: "类型",
				name: "classifyName",
				align: "left",
				//width: "10%"
			}],
			url:queryUrl,
			//checkbox: true,
			width: 440,
			height: 375,
			root:"rows",
			record:"total",
			pagesizeParmName:"pageSize",
			pageParmName:"currentPage",
			pageSizeOptions:[10,20,100],
			pageSize:10,
			method:"post",
			dataAction:"server",
			sortName: "id",
			parms:{classifys:classifys,keyword:keyword},
			onLoaded:function(data){
				$("#recommendGrid").find(".l-grid-loading").hide();
				if(data.data && data.data.total == 0){
					$("#recommendGrid").find(".l-grid-body2").css({overflow:"hidden"}).html("<div align=center>抱歉，当前搜索条件下无记录</div>");
				}else{
					$("#recommendGrid").find(".l-grid-body2").css({"overflow-y":"auto","overflow-x":"hidden"});
				}
			},
			onSelectRow:function(rowdata, rowid, rowobj){
				console.log(rowdata);
				saveData.recommendQuestionId = rowdata.questionId;
			},
			toolbar:{
				items:[{
					text: "分类",
					type: "comboBox",
					render: true,
					id: "recommendClassify",
					config: {
				        width: 180, 
				        selectBoxWidth: 180,
				        selectBoxHeight: 200,
				        valueField: "id",
				        textField: "value",
				        treeLeafOnly: true,
				        tree: { 
				        	url: "classifys",
				        	ajaxType: "post", 
				        	idFieldName: "id",
					        parentIDFieldName: "parentId",
					        textFieldName: "value",
					        isMultiSelect: false,
					        slide: true,
					        isExpand: 2,
					        onSelected: function(node){
					        	console.log(node);
					        	console.log("hello");
					        }
					    }
					},
					style: {
						"margin-top":"2px"
					}
				},{
					text: keywordDefault,
					type: "input",
					render: true,
					focus: function(item){

					},
					blur: function(item){
						var ditem = $("[toolbarid="+item.id+"]");
						var dinput = $("input:first", ditem);
						keyword = dinput.val();
					},
					style:{
						"margin-top": "2px",
						border: "1px solid #AECAF0",
						width: "80px"
					},
					bind:{
						act:"keypress",
						fun:function(event){
							if(event.keyCode == "13"){
								gridQueryClick(2, recommendBoxManager, recommendGridManager);
							}
						}
					}
					
				}
//				,{
//					text: "查询",
//					click: gridQueryClick,
//					img: contextPath + "/lib/ligerUI/skins/icons/search.gif"
//				}
				]
			}
		});
	};
	
	var initDialog = function(){

		dialog.options.buttons[0].onclick = function(){
			saveRecommend();
		};
	};
	
	var saveRecommend = function(){
		
		if(!saveData.questionId || !saveData.recommendQuestionId){
			$.ligerDialog.warn("请选择问题和要推荐的问题");
		}else{
			//$.ligerDialog.waitting("保存中");
			$.post(saveUrl,saveData,function(data){
				$.ligerDialog.closeWaitting();
				if(data.status=="success"){
					$.ligerDialog.success(data.message);
				}else if(data.status=="warn"){
					$.ligerDialog.warn(data.message);
				}else{
					$.ligerDialog.error(data.message);
				}
			});
		}
	};
	
	

	return method;
})(jQuery);
