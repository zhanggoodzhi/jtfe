<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
		<c:set var="ctx" value="${pageContext.request.contextPath}" />
		<c:set var="isVcg" value="${sessionScope.accessKey=='pre.dam.vcg.com'}" />
		<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
			<base href="<%=basePath%>">
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
			<!--使用最高版本IE-->
			<meta name="renderer" content="webkit">
			<!--使用webkit内核渲染-->

			<title>金童智能客服云平台</title>

			<!-- Bootstrap core CSS -->
			<!--<link href="css/bootstrap.min.css" rel="stylesheet">-->
			<link href="module/bootstrap/css/bootstrap.min.css" rel="stylesheet">
			<link href="fonts/css/font-awesome.min.css" rel="stylesheet">

			<!-- Custom styling plus plugins -->
			<link href="css/custom.css" rel="stylesheet">
			<script src="js/jquery.min.js"></script>

			<script src="module/pnotify/pnotify.core.js"></script>
			<script src="module/pnotify/pnotify.buttons.js"></script>
			<!--<script src="js/bootstrap.min.js"></script>-->
			<script src="module/bootstrap/js/bootstrap.min.js"></script>
			<script type="text/javascript">
				var appName = '${ctx}';
				var isVcg=${isVcg};
			</script>
			<script src="js/nicescroll/jquery.nicescroll.min.js"></script>
			<script src="js/custom.js"></script>
