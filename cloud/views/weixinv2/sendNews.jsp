<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">
<head>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/bootstrap-dialog.min.js"></script>
</head>
<jsp:include page="../headv2.jsp" />
<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<div class="col-md-3 left_col">
				<jsp:include page="../leftv2.jsp" />
			</div>
			<div class="top_nav">
				<jsp:include page="../topnavv2.jsp" />
			</div>
			<div class="right_col" role="main">
			<div class="x_panel">
				
							<h4 class="modal-title" id="myModalLabel">群发消息</h4>
						
						
				</div>
			 	<footer>
					<jsp:include page="../footerv2.jsp" />
				</footer> 
			</div>
		</div>
	</div>
</body>
</html>
