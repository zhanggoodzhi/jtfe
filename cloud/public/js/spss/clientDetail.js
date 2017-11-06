$(function(){
	clientDetail.init();
});

var clientDetail = (function($,undefined){

	var $clientDetailGrid = undefined;
	var $classifyComboBox = undefined;
	var $corpusComboBox = undefined;
	var $startDay = undefined;
	var $endDay = undefined;
	var $keyword = undefined;
	
	var clientDetailManager = undefined;
	var comboBoxManager = undefined;
	
	var queryUrl = "queryClientDetail";
	var classifys = "-100";
	var queryParams={uid:0, startDay:new Date(), endDay:new Date(), category:-100, classifys:-100, keyword:""};
    var dialog = frameElement.dialog; 
    var dialogData = dialog.get('data');
    var rowdata = dialogData.rowdata;
	
    var corpusStatusData = [ {
		id : -1,
		text : "全部"
	}, {
		id : 0,
		text : "未审核"
	}, {
		id : 1,
		text : "已审核"
	} ];
	
    var gridConfig = function(queryParams){
    	return {
    		toolbar : "#toolbar",
			url : queryUrl,
			queryParams : queryParams,
			singleSelect : false,
			sortName : "time",
			sortOrder : "desc",
			pagination : true,
			pageSize : 20,
			pageList : [20,50,100],
			rownumbers : true,
			columns:[[{
				field : "question",
				title : "问题",
				width : 220,
				align : "left",
				halign : "center",
				sortable : true
			},{
				field : "answer",
				title : "回复",
				width : 250,
				align : "left",
				halign : "center",
				sortable : true
			},{
				field : "classifyName",
				title : "分类",
				width : 80,
				align : "center",
				halign : "center",
				sortable : true
			},
			{
				field : "characterName",
				title : "角色",
				width : 100,
				align : "center",
				halign : "center",
				sortable : true
				
			},{
				field : "time",
				title : "时间",
				width : 100,
				align : "center",
				halign : "center",
				sortable : true
			}]],
		};
    };
    
    var gridReload = function(){

		//queryParams.category = category;
		
    	//queryParams.year = year;
		//queryParams.month = month;
		//queryParams.day = day;
		
		
		queryParams.startDay = parser($startDay.datebox("getValue"));
		queryParams.endDay = new Date(parser($endDay.datebox("getValue")).getTime()+24*60*60*1000);
		
		var reg=new RegExp(";","g");
		if(comboBoxManager.getValue().replace(reg,",") != ""){
			classifys = comboBoxManager.getValue().replace(reg,",");
		}else{
			classifys = "-100";
		}
		queryParams.keyword = $keyword.val();
		queryParams.classifys = classifys;
		$clientDetailGrid.datagrid('load', queryParams);
		
	};
    var initVar = function(){
    	$clientDetailGrid = $("#clientDetailGrid");
    	$classifyComboBox = $("#classifys");
    	$corpusComboBox = $("#corpusStatus");
    	$startDay = $("#startDay");
		$endDay = $("#endDay");
		$keyword = $("#keyword");
		
    };
    
    
    var initGrid = function(){
    	$clientDetailGrid.datagrid(gridConfig(queryParams));	
    }
    
    var comboBoxConfig = function() {
		return {
			width : 180,
			selectBoxWidth : 180,
			valueField : "id",
			textField : "value",
			treeLeafOnly : true,
			tree : {
				url : contextPath + "/knowledge/classifys",
				ajaxType : "post",
				idFieldName : "id",
				parentIDFieldName : "parentId",
				textFieldName : "value",
				slide : true,
				isExpand : 2,
				onSelect : function(node) {
					console.log(node);
				}
			}
		};
	};
	
	var formatter = function(date){
		var mode = "0"

	    switch (mode) {  
	        case "0":  
	                return date.formatDate("yyyy-MM-dd");  
	            break;  
	        case "1":  
	                return date.formatDate("yyyy-MM");  
	            break;  
	        case "2":  
	                return date.formatDate("yyyy");  
	            break;  
	        case "3":  
	        	return date.formatDate("yyyy-MM-dd");  
	        	break;  
	        default:  
	            break;  
	    } 
	};
	
	var parser = function(dateStr){
		var regexDT = /(\d{4})-?(\d{2})?-?(\d{2})?\s?(\d{2})?:?(\d{2})?:?(\d{2})?/g;  
		var matchs = regexDT.exec(dateStr);
		if(matchs != null){
			var date = new Array();
			for (var i = 1; i < matchs.length; i++) {  
				if (matchs[i]!=undefined) {  
					date[i] = matchs[i];  
				} else {  
					if (i<=3) {  
						date[i] = "01";  
					} else {  
						date[i] = "00";  
					}  
				}  
			}  
			return new Date(date[1], date[2]-1, date[3], date[4], date[5],date[6]); 
		}else{
			return new Date();
		}
	};
	
	var getDateConfig = function(){
		return {
			showSeconds : false,
			formatter : formatter,
			parser : parser
		};
	};
	
	var initComboBox = function() {
		comboBoxManager = $classifyComboBox.ligerComboBox(comboBoxConfig());

//		corpusStatusManager = $corpusComboBox.ligerComboBox({
//			width : 80,
//			emptyText : "",
//			data : corpusStatusData,
//			isMultiSelect : false,
//			onSelected : function(newvalue) {
//				console.log("状态=" + newvalue);
//			}
//		});
//		corpusStatusManager.setValue("-1");
		
		$startDay.datebox(getDateConfig());
		$endDay.datebox(getDateConfig());
		
		//设置开始结束时间
		$startDay.datebox("setValue", formatter(dialogData.startDay));
		$endDay.datebox("setValue", formatter(new Date(dialogData.endDay.getTime()-1)));
		
		
		
	};
    
    
	var initDialog = function(){
		
		queryParams.uid = rowdata.uid;
		queryParams.startDay = dialogData.startDay;
		queryParams.endDay =  dialogData.endDay;
		queryParams.category = dialogData.category;

		dialog.options.buttons[0].onclick = function(){
			dialog.close();
		};
	};
	var gridExportExcel=function(){
		var tabTitle="用户"+rowdata.user+"的会话记录";
		jQuery.messager.confirm('提示:','是否导入'+tabTitle,function(event){ 
			if(event){ 
			var keyword= $("#keyword").val();
				var startDay = parser($startDay.datebox("getValue"));
				var endDay = new Date(parser($endDay.datebox("getValue")).getTime()+24*60*60*1000);
			var paramesExcel="?title="+encodeURI(tabTitle)+"&uid="+rowdata.uid+"&keyword="+keyword+"&category="+dialogData.category+"&classifys="+classifys+"&startDay="+encodeURIComponent(startDay)+"&endDay="+encodeURIComponent(endDay);
			window.location.href = appName + "/spss/queryClientDetailExportExcel"+paramesExcel;;
			}
		}); 
	};
	
	method = {	
			init : function(){
				initVar();
				initDialog();
				initGrid();
				initComboBox();
			},
			gridReload : gridReload,
			gridExportExcel:gridExportExcel
	};
	
	return method;

})(jQuery);


