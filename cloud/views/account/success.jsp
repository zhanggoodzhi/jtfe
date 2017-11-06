<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.net.URLDecoder"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<script type="text/javascript"  src="${ctx }/js/jquery-1.11.0.js"></script>


<script>
	var csOperationList = '${csOperationList }';
	
</script>
<script type="text/javascript"  src="${ctx }/js/testsuccess.js"></script>
</head>
<body>
=====
${csOperationList }
<div id="csOperation" style="display: none;">
	<c:forEach items="${csOperationList }" var="csOperation" >
	<p>sfwesgerwsv</p>
		<input id="opname${csOperation.id}" type="text" value="${csOperation.opname}"><input id="description${csOperation.id}" type="text" value="${csOperation.description}"><br/>
	</c:forEach>
</div>
</body>
</html>