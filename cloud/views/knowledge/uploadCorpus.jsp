<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=10" /> 
<title>数据上传</title>

<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>

<link href="${pageContext.request.contextPath}/lib/ligerUI/skins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css">
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerComboBox.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTree.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDialog.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/lib/uploadify/uploadify.css"></link>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/uploadify/jquery.uploadify.js"></script>


<script async="" src="${pageContext.request.contextPath}/js/knowledge/Blob.js"></script>
<script async="" src="${pageContext.request.contextPath}/js/knowledge/FileSaver.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/uploadCorpus.js" ></script>


<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';</script>
<style type="text/css">
	.div_row1 { 
		width: 100%;
		padding-top: 5px;
		min-height: 20px;
		height: auto;
	}
</style>
<script type="text/javascript">
	 $(function() {
           $("#uploadExcel").uploadify({
           	'buttonText':'选择文件',
           	'width'     : 80,
           	'height'    : 25,
            'swf'       : '<%=basePath%>lib/uploadify/uploadify.swf', 
            'uploader'      : 'uploadCorpusSumit',//处理上传的路径
            'cancelImage'     : '<%=basePath%>lib/uploadify/uploadify-cancel.png',
			'method'        : 'get',   				
			'postData'		: {},
			'button_image_url':'<%=basePath%>lib/uploadify/',
			'fileObjName'   : 'uploadExcel',   
   			'auto'           : false,
   			'multi'          : false,
   			'queueID'		: 'fileQueue',
   			'debug'			: false,
   			'removeCompleted': true,
   			'removeTimeout' : 0.5,
   			'requeueErrors'	: true,
   			'progressData'	: "all",// 'percentage''speed''all'
   			'queueSizeLimit' : 10, //限制在一次队列中的次数（可选定几个文件）。默认值= 999，而一次可传几个文件有 simUploadLimit属性决定。
   			'fileSizeLimit'	: 50*1024*1024, //50M
   			'fileTypeDesc'   : 'Excel2007,2003', 
   			'fileTypeExts'   : '*.xlsx;*.xls',//允许的格式
   			'onSelect'       : function(e, queueId, fileObj){
   				$("#uploadExcel").css("height",0);
   				$(".uploadify-button").hide();
   			},
   			'onCancel'       : function(file){
   				$("#uploadExcel").css("height", 25);
                $(".uploadify-button").show();
   			},
   			'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal,queueBytesLoaded) {
   			    if(totalBytesUploaded > 0){
   			    	$("#result").append("<div>文件\""+file.name+"\"共"+totalBytesTotal+"字节，已上传"+totalBytesUploaded + "字节!</div><br/>");
   			    }
  			 		
   			 	if(totalBytesUploaded > totalBytesTotal){
   			 		$("#result").append("<div>文件\""+file.name+"\"上传成功！</div><br/>");
   			 	}
  	        },
   			'onUploadComplete' : function(file) {
   		    },
   			'onUploadSuccess' : function(file,data,response) {
	   			var retdata=eval("(" + data + ")");
	   			console.log("file="+file+",data="+data+",retdata="+retdata+",response="+response);
	   			$("#result").append("<div>"+retdata.message+"</div><br/>");
   			},
   			'onUploadError' : function(file,errorCode,errorMsg,errorString,swfuploadifyQueue) {
   			    if(errorCode == -280){
   			   
   			    }else{
   			    	$("#result").html(errorString);
   			    }
   			    $("#uploadExcel").css("height", 25);
   			   $(".uploadify-button").show();
   			},
       });
    });
</script>
</head>
<body style="padding:15px;">
    <div>
                请按照模板格式上传语料，点击下载<a id="uploadDemo" href="">模板</a>
      <br/>
                最新的<a id="latestClassify" href="javascript:;">语料类型编号</a>
      <br/>
               最新的<a id="latestVirtualCharacter" href="javascript:;">角色编号</a>
    </div>
	<div class="div_row1">
		<input type="file" name="uploadExcel" id="uploadExcel" />
		<div id="fileQueue"></div>
		<div id="result"></div>
		<div id="progress"></div> 
	</div>

</body>
</html>