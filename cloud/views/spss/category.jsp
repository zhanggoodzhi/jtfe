<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta http-equiv="X-UA-Compatible" content="IE=10" /> 
<title>分类数据分析</title>
</head>

<link href="${pageContext.request.contextPath}/css/font.css"
	rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/css/reg.css"
	rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/css/main.css"
	rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/css/common.css"
	rel="stylesheet" type="text/css" media="all" />
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript"
	src="${pageContext.request.contextPath}/js/calendar.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>

<link
	href="${pageContext.request.contextPath}/lib/ligerUI/skins/Aqua/css/ligerui-all.css"
	rel="stylesheet" type="text/css">
<script
	src="${pageContext.request.contextPath}/lib/ligerUI/js/core/base.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerComboBox.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTree.js"
	type="text/javascript"></script>

<script type="text/javascript">var year = ${year}; var month = ${month}; var day = ${day}; var hour = ${hour}</script>
<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';</script>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/js/esl.js"></script>
	
	<script type="text/javascript"
	src="${pageContext.request.contextPath}/js/spss/categoryEchart.js"></script>

<body>
<div id="myechart"></div>
</body>
</html>