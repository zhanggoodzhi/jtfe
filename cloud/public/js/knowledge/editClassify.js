$(function(){
	editClassify.init();
});

var editClassify = (function($,undefined){

	var $parentClassify = undefined;
	var $classifyName = undefined;
	var parentClassifyManager = undefined;
	
	
	var $classify2 = undefined;
	var $parentClassify2 = undefined;
	var $classifyName2 = undefined;
	var classify2Manager = undefined;
	var parentClassify2Manager = undefined;
	
	var $classify3 = undefined;
	var classify3Manager = undefined;
	
	var $classifyTab = undefined;
	var classifysUrl = "/cloud/knowledge/classifys";
	var saveClassifyUrl = "saveClassify";
    var dialog = frameElement.dialog;
    var dialogData = dialog.get('data');
    var editData = {};
    
    var classifyConfig = {
	        width : 200, 
	        selectBoxWidth: 200,
	        selectBoxHeight: 200,
	        valueField: 'id',
	        textField: 'value',
	        parentSelected: true,
	        //treeLeafOnly: true,
	        tree: { 
	        	url: classifysUrl,
	        	ajaxType:'post', 
	        	idFieldName: 'id',
		        parentIDFieldName: 'parentId',
		        textFieldName: 'value',
		        slide: true,
		        isExpand: 2,
		        checkbox: false,
		        single: true,
		        onSelect: function(node){
		        	console.log(node);
		        }
		    },
		    onSelected: function (newvalue){
		    	console.log('选择的是 ' + newvalue);
            }
	};
    
    //1:新增,2:修改,3:删除
    var mode = 1;

	
	method = {	
		init : function(){
			$classifyName = $("#classifyName");
			$parentClassify = $("#parentClassify");

			$classify2 = $("#classify2");
			$parentClassify2 = $("#parentClassify2");
			$classifyName2 = $("#classifyName2");
			
			$classify3 = $("#classify3");
			
			initComboBox();
			initDialog();
			initTab();
		}
	};
	
	var initTab = function(){
		$classifyTab=$("#classifyTab");
		$classifyTab.ligerTab({
			onBeforeSelectTabItem: function (tabid){
                console.log('onBeforeSelectTabItem ' + tabid);
                setMode(tabid);
            },
            onAfterSelectTabItem: function (tabid){
                console.log('onAfterSelectTabItem ' + tabid);
            }
        });
	};
	
	var setMode = function(tabid){
		if(tabid == "tabitem1"){
			mode = 1;
		}else if(tabid == "tabitem2"){
			mode = 2;
		}else if(tabid == "tabitem3"){
			mode = 3;
		}
	};
	
	var initComboBox = function(){
		parentClassifyManager = $parentClassify.ligerComboBox(classifyConfig);
		classify2Manager = $classify2.ligerComboBox(classifyConfig);
		parentClassify2Manager = $parentClassify2.ligerComboBox(classifyConfig);
		classify3Manager = $classify3.ligerComboBox(classifyConfig);
	};
	
	
	var initDialog = function(){

		dialog.options.buttons[0].onclick = function(){
			editClassify();
		};
	};
	
	
	var editClassify = function(){
		initEditData();
		if(verify()){
			if(editData.mode == 3){
				$.ligerDialog.confirm("确认删除", function (yes) {
					submit();
				});
			}else{
				submit();
			}
		}
	};
	
	var initEditData = function(){
		if(mode == 1){
			editData.mode = 1;
			editData.classifyName = $classifyName.val();
			editData.parentClassifyId = parentClassifyManager.getValue();
		}else if(mode == 2){
			editData.mode = 2;
			editData.classifyId = classify2Manager.getValue();
			editData.classifyName = $classifyName2.val();
			editData.parentClassifyId = parentClassify2Manager.getValue();
		}else if(mode == 3){
			editData.mode = 3;
			editData.classifyId = classify3Manager.getValue();
		}
	};
	
	var verify = function(){
		var check = true;
		
		if((editData.mode == 2 || editData.mode == 3) && editData.classifyId == 0){
			$.ligerDialog.warn("所有问题类型为系统类型,请重新选择");
			check = false;
		}
		return check;
	};
	
	var submit = function(){
		$.post(saveClassifyUrl, editData, function(data){
			if(data.status == "fail"){
				$.ligerDialog.error(data.message);
			}else if(data.status == "warn"){
				$.ligerDialog.warn(data.message);
			}else if(data.status == "success"){
				$.ligerDialog.success(data.message);
			}
			parentClassifyManager.reload();
			
			parentClassify2Manager.reload();
			classify2Manager.reload();
			
			classify3Manager.reload();

			dialogData.refresh();
		},"json");
	};
	
	return method;

})(jQuery);


