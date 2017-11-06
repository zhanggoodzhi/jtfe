<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

<head>
<jsp:include page="headv2.jsp" />
</head>


<body class="nav-md">

	<div class="container body">
		<div class="main_container">
			<div class="col-md-3 left_col">
				<jsp:include page="leftv2.jsp" />
			</div>
			<div class="top_nav">
				<jsp:include page="topnavv2.jsp" />
			</div>
			<!-- page content -->
			<div class="right_col" role="main">
				<div class="x_panel">
				<h2>empty</h2>
				</div>

				<footer>
					<jsp:include page="footerv2.jsp" />
				</footer>
			</div>
		</div>

	</div>

</body>

</html>
