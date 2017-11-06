<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html>
<head>
<script type="text/javascript">
	var appName = '${ctx}';
</script>
<jsp:include page="../headv2.jsp" />
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.mask.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/reply/reply.js"></script>

<style type="text/css">
textarea {
	padding: 10px;
}

.label {
	padding: 10px;
}
</style>
</head>

<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<div class="col-md-3 left_col">
				<jsp:include page="../leftv2.jsp" />
			</div>
			<div class="top_nav">
				<jsp:include page="../topnavv2.jsp" />
			</div>
			<!-- page content -->
			<div class="right_col" role="main">
				<div class="clearfix"></div>
				<div class="row">
					<div class="col-md-6 col-sm-6 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>
									用户提问 <small>视觉中国定制功能，客户提问人工回复功能</small>
								</h2>
								<div class="clearfix"></div>
							</div>
							<div class="x_content">
								<table id="tt" title="问题列表" rownumbers="true" pagination="true">
									<thead>
										<tr>
											<th field="user" align="center">用户名</th>
											<th field="q" align="center">机器未答问题</th>
											<th field="ts" align="center">时间</th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
					</div>


					<div class="col-md-6 col-sm-6 col-xs-12">
						<div class="x_panel">
							<div class="x_title">
								<h2>
									客服回答 <small>客户问题人工回复功能</small>
								</h2>
								<div class="clearfix"></div>
							</div>
							<div class="x_content">

								<div class="replyRight">
									<div>
										<div class="replyLabel">问题</div>
										<textarea type="text" readonly="readonly"
											placeholder="请在左边选择机器未答的问题进行快速回复"
											style="width: 100%; height: 12%; resize: none;" id="q"></textarea>
									</div>
									<div>
										<div class="replyLabel">回复</div>
										<textarea style="width: 100%; height: 50%; resize: none;"
											placeholder="再次输入立即回复它" id="a"></textarea>
									</div>
									<div align="center">
										<br> <input  class="btn btn-success" type="button" align="middle" value="提交"
											style="width: 20%; background-color: #0095FF; padding-top2: 20px; border-color: #0095FF; border-radius: 20px;margin-top: 10px;" 
											onclick="postData()">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
					<footer>
					<jsp:include page="../footerv2.jsp" />
				</footer>
				</div>
			</div>
		</div>
</body>

</html>
				
