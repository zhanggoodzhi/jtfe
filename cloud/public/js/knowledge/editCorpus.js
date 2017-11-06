$(function(){
	editCorpus.init();
});

var editCorpus = (function($,undefined){

	var $question = undefined;
	var $questions = undefined;
	var $classify = undefined;
	var $corpusStatus = undefined;
	var $character = undefined;
	var classifyManager = undefined;
	var corpusStatusManager = undefined;
	var characterManager = undefined;
	var $beginTime = undefined;
	var $endTime = undefined;
	
	var classifysUrl = "classifys";
	var charactersUrl = "characters";
	var saveCorpusUrl = "saveCorpus";
	var queryUrl = "queryPairsByQuestion";
	var saveData = {classify:"", corpusStatus:"", beginTime:$("#beginTime").val(),endTime:$("#endTime").val() ,character:"", question:"", plainText:"", htmlContent:""};
	var corpusStatusData =[{ id: 0, text: "未审核" }, { id: 1, text: "已审核"}];
	var ueditor = undefined;
    var dialog = frameElement.dialog; 
    var dialogData = dialog.get('data');
    var mode = dialogData.mode;
    var rowdata = dialogData.rowdata;
    var pairIds = undefined;

    var reg = /^<hr style="height:1px;border:none;border-top:1px dashed #0066CC;" pairid=/;
    var newHtmlHeader = '<hr style="height:1px;border:none;border-top:1px dashed #0066CC;" pairid="-1"/>';
    var newPlainHeader = '<hr style="height:1px;border:none;border-top:1px dashed #0066CC;" pairid="-1">';
	
	method = {	
		init : function(){
			$question = $("#question");
			$questions = $("#questions");
			$classify = $("#classify");
			$corpusStatus = $("#corpusStatus");
			$character = $("#character");
			$beginTime = $("#beginTime");
			$endTime = $("#endTime");
			initCheckBox();
			initUedit();
			initDialog();
//			initTime();
		},
		isMultyAnswer : function(){
			if(mode == 3){
				return false;
			}else{
				return true;
			}
		}
	};
	
	var getNowFormatDate= function(dataStr){
	    var day = dataStr;
	    var Year = 0;
	    var Month = 0;
	    var Day = 0;
	    var CurrentDate = "";
	    Year= day.getFullYear();//支持IE和火狐浏览器.
	    Month= day.getMonth()+1;
	    Day = day.getDate();
	    CurrentDate += Year+"-";
	    if (Month >= 10 ){
	     CurrentDate += Month+"-";
	    }
	    else{
	     CurrentDate += "0" + Month+"-";
	    }
	    if (Day >= 10 ){
	     CurrentDate += Day ;
	    }
	    else{
	     CurrentDate += "0" + Day ;
	    }
	    return CurrentDate;
	 }
//	var initTime =function(){
//		$beginTime.val(getNowFormatDate(new Date()));
//		$endTime.val("2035-12-31");
//	}
	var initCheckBox = function(){
		classifyManager = $classify.ligerComboBox({
	        width : 200, 
	        selectBoxWidth: 200,
	        selectBoxHeight: 200,
	        valueField: 'id',
	        textField: 'value',
	        treeLeafOnly: true,
	        tree: { 
	        	url: classifysUrl,
	        	ajaxType:'post', 
	        	idFieldName: 'id',
		        parentIDFieldName: 'parentId',
		        textFieldName: 'value',
		        slide: true,
		        isExpand: 4,
		        checkbox: false,
		        onSelect: function(node){
		        	console.log(node);
		        }
		    }
		});
		corpusStatusManager = $corpusStatus.ligerComboBox({
			width: 200,
			emptyText: "",
            data: corpusStatusData,
            isMultiSelect: false,
            onSelected: function (newvalue){
            	console.log("状态=" + newvalue);
            }
        });
		corpusStatusManager.setValue("1");
		characterManager = $character.ligerComboBox({
	        width : 200, 
	        selectBoxWidth: 200,
	        selectBoxHeight: 200,
	        valueField: 'id',
	        textField: 'vname',
	        slide: true,  
			url : charactersUrl,
			ajaxType : "post",
			onSelect : function(node) {
				console.log("角色"+node);
			},
			onSuccess : function(data){
				if(mode === '1'){
					this.setValue(1);
				}else if(mode=="2"){
					this.setValue(dialogData.rowdata.characterId);
				}else if(mode=="3"){
					this.setValue(1);
				}
			}
	        
		});
	};

	var initUedit = function(){
		ueditor = UE.getEditor('answer', {
			toolbars:  [
			    ['emotion','bold', 'italic', 'underline', 'fontborder', 'strikethrough', 
			     'removeformat', 'formatmatch', 'autotypeset', 'pasteplain', '|',
			     'forecolor', 'insertorderedlist', 'insertunorderedlist', 'cleardoc','|',
			     'link','answer','symbol' ,'|','simpleupload', '|', 'insertimage',  '|'
			    ]
			],
			initialFrameHeight: 300,
			autoHeightEnabled: false
		});
	};
	
	
	
	var initDialog = function(){

		dialog.options.buttons[0].onclick = function(){
			saveCorpus();
		};
		if(mode === '1'){
			$beginTime.val(getNowFormatDate(new Date()));
			$endTime.val("2035-12-30");
			//增加问题0066CC
			ueditor.ready(function(){
				ueditor.setContent('<hr style="height:1px;border:none;border-top:1px dashed #0066CC;" pairid="-1"><p><br></p>');
			});
		} else if(mode === '2'){
			//修改问题
			$question.val(dialogData.rowdata.question);
			classifyManager.setValue(dialogData.rowdata.classifyId);
			var status = undefined;
			if(dialogData.rowdata.status == 8){
				status = 1;
			}else{
				status = 0;
			}
			corpusStatusManager.setValue(status);
			characterManager.setValue(dialogData.rowdata.characterId);
			$beginTime.val(dialogData.rowdata.beginTime);
			$endTime.val(dialogData.rowdata.endTime);
			$("body").append('<div class="l-window-mask" style="display: block; height: 590px;"></div><div class="datagrid-mask-msg" style="display: block; left: 50%; height: 16px; margin-left: -56px; line-height: 16px; z-index:9001;">加载数据中 ...</div>');
			console.log(dialogData.rowdata);
			$.post(queryUrl,{question: dialogData.rowdata.questionId,characterId:dialogData.rowdata.characterId},function(data){
			ueditor.ready(function(){
					ueditor.setContent(data.data.multyAnswer.rawHtmlContent);
					pairIds = data.data.multyAnswer.pairIds;
			});
				$("body > .l-window-mask").remove();
				$("body > .datagrid-mask-msg").remove();
			},"json");

		} else if(mode === '3'){
			//批量回复
			$question.hide();
			
			var questionsStr = dialogData.questions.join(";");
			var temp = questionsStr.substring(0,15);
			$("#beginTime").val(getNowFormatDate(new Date()));
			$("#endTime").val("2035-12-31");
//			characterManager.setValue(1);
			if(questionsStr.length > 15){
				temp += "...";
				$questions.tooltip({
					position : "bottom",
					content : questionsStr,
					onShow: function(){
				        $(this).tooltip('tip').css({
				            width : 350,
				            left : 15
				        });
				    }
				});
			}
			$questions.html(temp);
			$questions.show();
			
			corpusStatusManager.setValue(1);
			pairIds = dialogData.pairIds;
//			ueditor.ready(function(){
//				ueditor.setContent('<hr style="height:1px;border:none;border-top:1px dashed #0066CC;" pairid="-1"><p><br></p>');
//			});
			
			ueditor.ready(function(){
				ueditor.ui.toolbars[0].items[18].setDisabled(true)
			});
		}
		ueditor.ready(function(){
			ueditor.addshortcutkey("answer", "ctrl+13");
		});
	};
	
	var saveCorpus = function(){
		initSaveData();
		
		
		if(mode == "3"){
			if(saveData.classify==""||saveData.corpusStatus==""){
				$.messager.alert("提示","问题或分类选项为空","warning");
			} else {
				$("body").append('<div class="l-window-mask" style="display: block; height: 580px;"></div><div class="datagrid-mask-msg" style="display: block; left: 50%; height: 16px; margin-left: -56px; line-height: 16px; z-index:9001;">后台操作中 ...</div>');
				
				$.post(saveCorpusUrl, saveData, function(data){
					
					if(data.status == "fail"){
						$.messager.alert("提示",data.message,"error");
					}else if(data.status == "warn"){
						$.messager.alert("提示",data.message,"warning");
					}else if(data.status == "success"){
						//$.ligerDialog.success(data.message, function(){dialog.close();});
						dialog.close();
					}
					$("body > .l-window-mask").remove();
					$("body > .datagrid-mask-msg").remove();
					dialogData.refresh();
				}, "json");
			}
		}else{
		if(saveData.question==""||saveData.classify==""||saveData.corpusStatus==""){
			$.messager.alert("提示","问题或分类选项为空","warning");
		}else if(saveData.beginTime =="" || saveData.endTime==""){
			$.messager.alert("提示","生效时间或失效时间不得为空","warning");
		}else {
				//$(".load").easyMask("show",{msg:""});
			$("body").append('<div class="l-window-mask" style="display: block; height: 580px;"></div><div class="datagrid-mask-msg" style="display: block; left: 50%; height: 16px; margin-left: -56px; line-height: 16px; z-index:9001;">后台操作中 ...</div>');
			
		$.post(saveCorpusUrl, saveData, function(data){
			
			if(data.status == "fail"){
				$.messager.alert("提示",data.message,"error");
			}else if(data.status == "warn"){
				$.messager.alert("提示",data.message,"warning");
			}else if(data.status == "success"){
				//$.ligerDialog.success(data.message, function(){dialog.close();});
				dialog.close();
			}
				$("body > .l-window-mask").remove();
				$("body > .datagrid-mask-msg").remove();
				dialogData.refresh();
		}, "json");
		}
		}

	};
	
	var initSaveData = function(){

		$question.val() && (saveData.question = $question.val()); 
		classifyManager.getValue() && (saveData.classify = classifyManager.getValue());
		corpusStatusManager.getValue() && (saveData.corpusStatus = corpusStatusManager.getValue());
		characterManager.getValue() && (saveData.character = characterManager.getValue());
		
		ueditor.getContent() && (saveData.htmlContent = ueditor.getContent());
		ueditor.getPlainTxt() && (saveData.plainText = ueditor.getPlainTxt());
		
		saveData.mode = mode;
		saveData.beginTime=$("#beginTime").val();
		saveData.endTime=$("#endTime").val();
		if(saveData.htmlContent.match(reg)==null && mode!=3){
			saveData.htmlContent = newHtmlHeader + saveData.htmlContent;
			saveData.plainText = newPlainHeader + saveData.plainText;
		}
		if(mode == 2){
		//saveData.pairId = rowdata.id;
		//同一问题被多个pair引用
		saveData.pairIds = pairIds.join(",");
		saveData.questionId = rowdata.questionId;
		saveData.answerId = rowdata.answerId;
		saveData.beginTime=$("#beginTime").val();
		saveData.endTime=$("#endTime").val();
		}else if(mode == 3){
			saveData.pairIds = pairIds.join(",");
		}

		console.log(saveData);
	};

	return method;

})(jQuery);


