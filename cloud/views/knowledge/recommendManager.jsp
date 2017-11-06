<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=10" /> 
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<jsp:include page="../common/common.jsp"></jsp:include>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/cloudKnowledge.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/recommendManager.js"></script>
<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';</script>
</head>
<body>

	<!-- 分类详情  -->
	<div align="center" class="easyui-panel" title="推荐问题管理" data-options="iconCls:'icon-nlp'"
		style="min-width:800px; background-color: #FAFCFF;" >
		<div id="recommendGrid" style="margin:20px;"></div>
	</div>
</body>
</html>