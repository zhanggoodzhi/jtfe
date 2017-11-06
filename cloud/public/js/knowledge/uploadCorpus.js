$(function(){
	uploadCorpus.init();
});

var uploadCorpus = (function($,undefined){

	var $uploadExcel = undefined;
	var $uploadDemo = undefined;
	var $latestClassify = undefined;
	var $latestVirtualCharacter = undefined;
	
	var uploadSubmit = "uploadCorpusSumit"; 
	var downLoadClassify = "downloadClassify";
	var dialog = frameElement.dialog;
	
	method = {	
		init : function(){
			//initUploadify();
			$uploadExcel = $("#uploadExcel");
			$uploadDemo = $("#uploadDemo");
			$latestClassify = $("#latestClassify");
			$latestVirtualCharacter=$("#latestVirtualCharacter");
			$uploadDemo.attr("href", contextPath + "/uploadFile/corpus/jintongsoft.xls");
			
			$latestVirtualCharacter.click(function(){
				$.post("virtualCharacters",{},function(data){
					
					var content = "\ufeff";
					var blob = self.Blob;
					if(data instanceof Array){
						content += "角色编号,角色名称\n";
						for(var index in data){
							if(data[index].id != 0){
								content += "" + data[index].id + "," + data[index].vname + "\n";
							}
							
						}
					}else{
						content += "下载失败，请稍后！";
					}
					
					saveAs(new blob([content],{type:"text/plain;charset=utf8"}),"语料角色信息.xls");
					
				});
			});
			
			
			$latestClassify.click(function(){
				$.post("classifys",{},function(data){					
					var content = "\ufeff";
					var blob = self.Blob;
					if(data instanceof Array){
						content += "类型编号,类型名称\n";
						for(var index in data){
							if(data[index].id != 0){
								content += "" + data[index].id + "," + data[index].value + "\n";
							}
							
						}
					}else{
						content += "下载失败，请稍后！";
					}
					
					saveAs(new blob([content],{type:"text/plain;charset=utf8"}),"语料类型信息.xls");
					
				});
			});
			
			initDialog();
		},
		init1 : function(){
			initUploadify();
		}
	};
	
	var initUploadify = function(){
		$uploadExcel.uploadify({
			swf: contextPath + "/lib/uploadify/uploadify.swf",
			uploader: uploadSubmit,
			auto: false,
			multi: false,
			queueID: 'fileQueue',
			fileSizeLimit: 5*1024*1024,
			fileTypeDesc: 'Excel2013,2010,2007,2003',
			fileTypeExts: '*.xlsx;*.xls',
			
			onUploadProgress: function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal,queueBytesLoaded) {

				$("#result").append("<div>文件\""+file.name+"\"共"+totalBytesTotal+"字节，已上传"+totalBytesUploaded + "字节!</div><br/>");
			 	if(totalBytesUploaded==totalBytesTotal){
			 		$("#result").append("<div>文件\""+file.name+"\"上传成功！</div><br/>");
			 	}
	        },
			onUploadComplete: function(file) {
				console.log("uploadComplete");
			},
			
			onUploadSuccess: function(file,data,response) {	
   				var retdata=eval("(" + data + ")");
   				alert(retdata.msg);
   				//提示消息
   				$("#result").append("<div>"+retdata.msg+"</div><br/>");
			},
			onUploadError: function(file,errorCode,errorMsg,errorString,swfuploadifyQueue) {
				$("#result").html(errorString);
			}
			
		});
	};
	
	var initDialog = function(){

		dialog.options.buttons[0].onclick = function(){
			upload();
		};
		dialog.options.buttons[1].onclick = function(){
			cancel();
		};
	};
	
	
	var upload = function(){
		
		console.log("num=" + $("#uploadExcel").data('uploadify').queueData.queueLength);
		
		if( isSelected() && $("#fileQueue").children().length > 0){
			$('#uploadExcel').uploadify('upload','*');
		} else if($("#uploadExcel").data('uploadify').queueData.queueLength < 0){
			$.messager.alert("提示","文件已上传","warning");
		} else {
			$.messager.alert("提示","请选择文件","warning");
		}
		
		
	};
	
	var cancel = function(){
		dialog.close();
	};
	
	var isSelected = function(){
		return $("#uploadExcel").data('uploadify').queueData.queueLength > 0;
	};
	
	return method;

})(jQuery);


