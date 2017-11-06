$(function(){
	corpus.init();
});

var corpus = (function($,undefined){
	var $gridQuery = undefined;
	var $corpusGrid = undefined;
	var treeManager = undefined;
	var gridManager = undefined;
	var comboBoxManager = undefined;
	var queryUrl = "queryPairs";
	var editUrl = "cloud/knowledge/editCorpus";
	var deleteUrl = "deleteCorpus";
	var editClassify = "editClassify";
	var keyword = "";
	var keywordDefault = "请输入关键字或ID";
	var classifys = [-100];
	var pairIds = [];
	
	
	var editCorpusDialogConfig = {
			height: 460,
            width: 550,
            title: "",
            url: editUrl, 
            showMax: false,
            showMin: false,
            isResize: true,
            slide: false,
            data: {
                refresh: function(){
                	gridManager.reload();
                }
            },
            myDataName: "hello",
            buttons: [
                      { 
                    	  text: '确定',
                    	  onclick: function (item, dialog) {
                    	  }
                      }, 
                      { 
                    	  text: '取消',
                    	  onclick: function (item, dialog) {
                    		  dialog.close(); 
                    	  } 
                      } 
            ]
	};
	
	var batchUploadDialogConfig = {
			height: 280,
            width: 400,
            title: "批量上传语料",
            url: "uploadCorpus", 
            showMax: false,
            showMin: false,
            isResize: true,
            slide: false,
            data: {
                refresh: function(){
                	gridManager.reload();
                }
            },
            buttons: [
                      { 
                    	  text: '确定',
                    	  onclick: function (item, dialog) {
                    	  }
                      }, 
                      { 
                    	  text: '取消',
                    	  onclick: function (item, dialog) {
                    		  dialog.close(); 
                    	  } 
                      } 
            ]
	};
	
	
	var classifyDialogConfig = {
			height: 430,
            width: 550,
            title: "",
            url: editClassify, 
            showMax: false,
            showMin: false,
            isResize: true,
            slide: false,
            data: {
                refresh: function(){
                	gridManager.reload();
                }
            },
            myDataName: "hello",
            buttons: [
                      { 
                    	  text: '确定',
                    	  onclick: function (item, dialog) {
                    	  }
                      }, 
                      { 
                    	  text: '取消',
                    	  onclick: function (item, dialog) {
                    		  dialog.close(); 
                    	  } 
                      } 
            ]
	};
	
	
	
	
	var method = {
		init : function(){
			$tree = $("#classifysTree");
			$corpusGrid = $("#corpusGrid");
			$gridQuery = $("#gridQuery");
			
			
			//cloudKnowledge.getTree("classifys", "classifysTree", "id", "parentId", "value");
			//treeManager = $("#classifysTree").ligerGetTreeManager();
			
			initGrid();
			$gridQuery.click(gridQueryClick);
			
			$(".comboBoxDiv").css("margin-top","0px");
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
	
	
	var gridQueryClick = function (){
		if(!treeManager || !comboBoxManager){
			//treeManager = $tree.ligerGetTreeManager();
			comboBoxManager = $("#classify").ligerGetComboBoxManager();
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
			gridManager = $corpusGrid.ligerGetGridManager();
		}
		
		gridManager.set({parms:{classifys:classifys,keyword:keyword}});
		gridManager.options.newPage = 1;
		$(".l-bar-btnfirst span", gridManager.toolbar).addClass("l-disabled");
		$(".l-bar-btnprev span", gridManager.toolbar).addClass("l-disabled");
		$corpusGrid.show();
		
		
		console.log(comboBoxManager.getValue());
		gridManager.reload();
	};
	
	var addCorpusClick = function(){
		editCorpusDialogConfig.title = "添加问题";
		editCorpusDialogConfig.data.mode = "1";
		$.ligerDialog.open(editCorpusDialogConfig);
	};
	
	var editCorpus = function(rowindex){
		console.log(rowindex);
		editCorpusDialogConfig.title = "修改问题";
		editCorpusDialogConfig.data.mode = "2";
		editCorpusDialogConfig.data.rowdata = gridManager.getRow(rowindex);
		$.ligerDialog.open(editCorpusDialogConfig);
	};
	
	
	var batchAddCorpusClick = function(){
		$.ligerDialog.open(batchUploadDialogConfig);
	};
		
		
	var batchDelete = function(){
		var rows = gridManager.getSelectedRows();
		pairIds = new Array();
		for(var index in rows){
			pairIds.push(rows[index].id);
                    	  }
		deleteCorpus();
	};
		
	var deleteCorpus = function(){
		
		if(pairIds.length > 0){
			
			$.ligerDialog.confirm("确认删除", function (yes) { 
			
				if(yes){
			$.post(deleteUrl, {"pairIds" : pairIds.join(",")}, function(data){
				if(data.status == "fail"){
					$.ligerDialog.error(data.message);
				}else if(data.status == "warn"){
					$.ligerDialog.warn(data.message);
				}else if(data.status == "success"){
					$.ligerDialog.success(data.message, function(){gridManager.reload();});
				}
			}, "json");
				}
			});
			
			
		} else {
			$.ligerDialog.warn("请选择要删除的问题");
		}
	
	};
	
	
	var editClassifyClick = function(){
		classifyDialogConfig.title = "类型管理";
		$.ligerDialog.open(classifyDialogConfig);
	};
	
	var initGrid = function(){
		gridManager = $("#corpusGrid").ligerGrid({
//			width : '100%',
//			height : 'auto',
//			nowrap : true,
//			striped : true,
//			fitColumns : false,
			columns:[{
				display: "ID",
				name: "id",
				width: "7%"
			},{
				display: "问题",
				name: "question",
				align: "left",
				width: "33%"
			},{
				display: "回复",
				name: "plainText",
				align: "left",
				width: "33%"
			},{
				display: "类型",
				name: "classifyName",
				align: "left",
				width: "10%"
			},{ 
				display: "操作",
				isSort: false,
				render: function (rowdata, rowindex, value){
	            	var h = "";
	            	if (!rowdata._editing){
		                h += "<a href='javascript:corpus.editCorpus(" + rowindex + ")'>修改</a> ";
		                h += "<a href='javascript:corpus.deleteCorpusClick(" + rowindex + ")'>删除</a> "; 
	            	}
	            	return h;
	            }
	        }],
			url:queryUrl,
			checkbox: true,
			width: 888,
			height: 519,
			root:"rows",
			record:"total",
			pagesizeParmName:"pageSize",
			pageParmName:"currentPage",
			pageSizeOptions:[15,30,100],
			pageSize:15,
			method:"post",
			dataAction:"server",
			sortName: "id",
			parms:{classifys:classifys,keyword:keyword},
			onLoaded:function(data){
				$(".l-grid-loading").hide();
				if(data.data && data.data.total == 0){
					$(".l-grid-body2").css({overflow:"hidden"}).html("<div align=center>抱歉，当前搜索条件下无记录</div>");
				}else{
					$(".l-grid-body2").css({"overflow-y":"auto","overflow-x":"hidden"});
				}
			},
			toolbar:{
				items:[{
					id:"classify",
					text: "分类",
					type: "comboBox",
					render: true,
					config: {
				        width: 200, 
				        selectBoxWidth: 200,
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
					        slide: true,
					        isExpand: 2,
					        onSelect: function(node){
					        	console.log(node);
					        }
					    }
					},
					style: {
						"margin-top":"2px"
					}
				},{
					text:keywordDefault,
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
						"margin-top":"2px",
						border: "1px solid #AECAF0"
					}
				},{
					text: "查询",
					click:gridQueryClick,
					img: contextPath + "/lib/ligerUI/skins/icons/search.gif"
				},{
					text: "添加",
					click:addCorpusClick,
					img: contextPath + "/lib/ligerUI/skins/icons/add.gif"
				},{
					text: "批量上传",
					click: batchAddCorpusClick,
					img: contextPath + "/lib/ligerUI/skins/icons/up.gif"
				},{
					text: "批量删除",
					click:batchDelete,
					img: contextPath + "/lib/ligerUI/skins/icons/delete.gif"
				}
//				,{
//					text: "类型管理",
//					click: editClassifyClick,
//					img: contextPath + "/lib/ligerUI/skins/icons/edit.gif"
//				}
				]
			}
});
	};

	return method;
})(jQuery);
