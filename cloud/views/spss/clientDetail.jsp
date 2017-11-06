<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.mask.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js"></script>

<link href="${pageContext.request.contextPath}/lib/ligerUI/skins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css">
<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';var appName = '${ctx}';</script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerComboBox.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTree.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDialog.js" type="text/javascript"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/spss/clientDetail.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerResizable.js" ></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/cloudUtil.js"></script>



</head>
<body style="padding:15px;">
    <div>
        <div id="toolbar" style="height: 60px;">
            <div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	            <label for="classifys" id="classifysLabel" style="margin-right: 4px;margin-left: 24px; margin-top: 4px; float: left;">类型</label>
	            <div class="comboBoxDiv" style="float: left; margin-top: 2px; margin-right: 5px;">
	                <input id="classifys" />
	            </div>
	            &nbsp;&nbsp;&nbsp;
	              <label for="keyword" id="keywordLabel" style="margin-right: 4px;">关键词</label>
            <input id="keyword" placeholder="请输入关键字" style="margin-top: 4px; border: 1px solid #ccc; width: 285px;height: 20px;">
            </div>
            <div >
             &nbsp;&nbsp;&nbsp;
	            <label for="startDay" id="startDayLabel" style="margin-right:4px;  float: left;">开始日期</label>
	            <div class="comboBoxDiv" style="margin-right: 5px;float: left;">
	                <input id="startDay"/>
	            </div>
	            <label for="endDay" id="endDayLabel" style="margin-right:4px; margin-top:4px; margin-left:108px;float: left;">结束日期</label>
	            <div style=" margin-top: 2px; margin-right: 5px;float: left;">
	                <input id="endDay"/>
	            </div>
	            	<a class="easyui-linkbutton"
						data-options="iconCls:'icon-dr',plain:true"
						 onclick="clientDetail.gridExportExcel()" style="float: right;">导出Excel</a>
	            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	            <a class="easyui-linkbutton" data-options="iconCls:'icon-search',plain:true" style="float: right;" onclick="clientDetail.gridReload()">查询</a>
	            
	        </div>
            <div style="display:none" >
	            <label for="corpusStatus" id="corpusStatusLabel" style="margin-right: 4px; margin-top: 4px; float: left;">状态</label>
	            <div class="comboBoxDiv" style="float: left; margin-top: 2px; margin-right: 5px;">
	                <input id="corpusStatus" />
	            </div>
            </div>
           
            
        </div>
        
        <table id="clientDetailGrid" title="" align="center" style="height: 500px;"></table>
    </div>
</body>
</html>
