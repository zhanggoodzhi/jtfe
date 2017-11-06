<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.net.URLDecoder"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html>
<jsp:include page="headv2.jsp" />
<link rel="stylesheet" type="text/css" href="${ctx }/css/color.css">
<link rel="stylesheet" type="text/css" href="${ctx }/css/style.css">
<meta http-equiv="refresh" content="6;url=${ctx }/tologin">
<link href="${ctx }/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/font.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/reg.css" rel="stylesheet" type="text/css" />
<script type="text/javascript"
	src="${ctx }/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/reg.js"></script>
<script type="text/javascript">
	var appName = '${ctx}';
</script>
<body>
	<!--header-->
<jsp:include page="headerContainer.jsp"/>

		<div id="reg_doc">
			<!-- 		<div class="reg_head" > -->
			<div class="reg_box_nav cls">
				<div class="reg_nav">
					<ul class="cls">
						<li class="index"><a >找回密码</a><span class="jiantou"></span></li>
					</ul>
				</div>
			</div>

			<div class="reg_content"
				style="border: 1px solid #D5D5D5; height: 580px;margin-top: 40px;">
				<c:if test="${regSuccessful!=null }">
					<div class="login-content03"
						style="display:; margin-left: 20%; margin-top: 10%; font-size: 16px; color: #333">
						<img alt="" src="${ctx }/images/icon_2.jpg"
							style="vertical-align: middle;"> ${regSuccessful }
					</div>
				</c:if>

				<c:if test="${regFailure!=null }">
					<div class="login-content03"
						style="display:; margin-left: 30%; margin-top: 30%; font-size: 16px; color: #333">
						<img alt="" src="${ctx }/images/icon_3.jpg"
							style="vertical-align: middle;"> ${regFailure }
					</div>
				</c:if>

				<c:if test="${regSuccessful==null && regFailure==null  }">
					<div class="login-content03"
						style="display:; margin-left: 30%; margin-top: 30%; font-size: 16px; color: #333">
						<img alt="" src="${ctx }/images/icon_0.png"
							style="vertical-align: middle;"> &nbsp; <br>
					</div>
				</c:if>
			</div>
		</div>
</body>
</html>