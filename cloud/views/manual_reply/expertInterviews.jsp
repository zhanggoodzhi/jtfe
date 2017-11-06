<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.net.URLDecoder"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">
<head>
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
<script type="text/javascript" charset="utf-8"	src="${ctx }/js/reply/expertInterview.js"></script>
<script type="text/javascript">
	var appName = '${ctx}';
	$(function() {
		var heightDG = document.body.scrollHeight - 110;
		$("#noReplyGrid").css("height", heightDG + "px");
		$("#noReplyGrid").css("width", $("#mgcLeft").width() + "px");
		previewReplyList.init();
	});
</script>
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
				<div class="">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="x_panel">
							<div class="x_content">
								<table id="previewGrid"
									style="border-left-width: 0px; border-right-width: 0px; border-bottom-width: 0px;"></table>
								<div id="toolbarPreview">
									<label for="keyword3" id="keywordLabel3"
										style="margin-right: 4px; margin-left: 14px;">关键词</label> <input
										id="keyword3" placeholder="请输入关键字搜索问题"
										style="margin-top: 4px; border: 1px solid #ccc; width: 305px; height: 22px;">

									<a class="easyui-linkbutton"
										data-options="iconCls:'icon-search',plain:true"
										onclick="previewReplyList.gridReload()">查询</a> <a
										href="javascript:void(0)" class="easyui-linkbutton"
										iconCls="icon-no" plain="true"
										onclick="previewReplyList.batchDelete()">删除</a>
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
