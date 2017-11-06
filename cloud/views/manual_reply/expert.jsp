<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.net.URLDecoder"%>
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
	src="${ctx }/js/reply/expert.js"></script>
<script type="text/javascript">
	$(function() {

		noReplyList.init();
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
					<div class="col-md-9 col-sm-9 col-xs-12">
						<div class="x_panel">
						<div class="x_title">
								<h2>
									用户问题 <small>客户问题人工回复功能</small>
								</h2>
								<div class="clearfix"></div>
							</div>
							<div class="x_content">
								<div id="toolbarNoReply">
									<label for="keyword" id="keywordLabel"
										style="margin-right: 4px; margin-left: 14px;"></label> <input
										id="keyword" placeholder="请输入关键字搜索 问题"
										style="margin-top: 4px; border: 1px solid #ccc; width: 285px; height: 22px;">

									<a class="easyui-linkbutton"
										data-options="iconCls:'icon-search',plain:true"
										onclick="noReplyList.gridReload()">查询</a>
								</div>
								<table id="noReplyGrid" ></table>
							</div>
						</div>
					</div>


					<div class="col-md-3 col-sm-3 col-xs-12">
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
											placeholder="请在左边选择回复的问题"
											style="width: 100%; height: 12%; resize: none;" id="q"></textarea>
									</div>
									<div>
										<div class="replyLabel">回复</div>
										<textarea style="width: 100%; height: 56%; resize: none;"
											placeholder="再次输入立即回复它" id="a"></textarea>
									</div>
									<div align="center">
										<input class="btn btn-success" type="button" align="middle" value="发送"
											style="width: 20%; background-color: #0095FF; padding-top2: 20px; border-color: #0095FF; border-radius: 20px;margin-top: 10px;" onclick="doReplyExpert()"
											>
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
