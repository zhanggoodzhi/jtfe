<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=10" /> 
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icon.css">
<link href="${pageContext.request.contextPath}/css/custom.css" rel="stylesheet">
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>

<link href="${pageContext.request.contextPath}/lib/ligerUI/skins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css">
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerComboBox.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTree.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDialog.js" type="text/javascript"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.noty.packaged.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jtnoty.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/module/pnotify/pnotify.core.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/module/pnotify/pnotify.buttons.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/module/pnotify/pnotify.nonblock.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/addRecommend.js"></script>
<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';</script>

</head>
<style>
.l-dialog-buttons{
	padding-top: 2px;
}
</style>
<body style="padding:15px;background: white;">
    <div style="float:left; padding:20px; width:500px; height:470px;">
    	选择问题
        <div id="questionToolbar" style="height:30px;">
			<div style="float:left">
				<label for="questionClassifys" id="questionClassifysLabel" style="margin-right:4px; margin-top:4px; float:left;">类型</label>
				<div class="comboBoxDiv" style="float: left; margin-top: 2px; margin-right: 5px;">
					<input id="questionClassifys"/>
				</div>
			</div>
			<label for="questionKeyword" id="questionKeywordLabel" style="margin-right:4px;">关键词</label>
			<input id="questionKeyword" placeholder="请输入关键字或ID" style="margin-top:4px; width:100px; border: 1px solid #ccc;">
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search',plain:true" onclick="addRecommend.questionGridReload()">查询</a>
		</div>
		<table id="questionGrid" style="height:366px;"></table>
	</div>
        
    <div style="float:right; padding:20px; width:500px; height:470px;">
    	选择关联问题
        <div id="recommendToolbar" style="height:30px;">
			<div style="float:left">
				<label for="recommendClassifys" id="recommendClassifysLabel" style="margin-right:4px; margin-top:4px; float:left;">类型</label>
				<div class="comboBoxDiv" style="float: left; margin-top: 2px; margin-right: 5px;">
					<input id="recommendClassifys"/>
				</div>
			</div>
			<label for="recommendKeyword" id="recommendKeywordLabel" style="margin-right:4px;">关键词</label>
			<input id="recommendKeyword" placeholder="请输入关键字或ID" style="margin-top:4px; width:100px; border: 1px solid #ccc;">
			<a class="easyui-linkbutton" data-options="iconCls:'icon-search',plain:true" onclick="addRecommend.recommendGridReload()">查询</a>
		</div>
		<table id="recommendGrid" style="height:366px;"></table>
    </div>
</body>
</html>
