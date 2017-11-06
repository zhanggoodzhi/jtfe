<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="en">

<head>
<base href="<%=basePath%>">
<meta http-equiv="X-UA-Compatible" content="IE=10" />

<link rel="stylesheet" type="text/css"
	href="${ctx }/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${ctx }/jquery-easyui-1.3.6/themes/icon.css">
<link rel="stylesheet" type="text/css" href="${ctx }/css/cssession.css" />


<jsp:include page="../headv2.jsp" />
<script type="text/javascript"
	src="${ctx }/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${ctx }/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script src="${ctx }/js/static.js" type="text/javascript"
	charset="utf-8"></script>
<script src="${ctx }/js/jquery.qrcode.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/js/jquery.cookie.js"></script>
<script type="text/javascript" src="${ctx}/js/jquery.noty.packaged.min.js"></script>
<script type="text/javascript" src="${ctx}/js/jtnoty.js"></script>

<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/csSession/csSession.js"></script>
<script type="text/javascript">
	var appName = '${ctx}';
</script>
</head>
<title>评分管理系统</title>
<style>
td {
	table-layout: fixed;
	word-break: break-all;
}

.panel {
	margin-bottom: 0px;
}

.custom_panel {
	padding: 0px;
}

.custom_panel div.datagrid-wrap {
	padding: 0px;
}

div.panel-body {
	padding-left: 0px;
	padding-right: 0px;
	padding-top: 0px;
	padding-bottom: 0px;
}

#mainContextSession {
	width: 100%;
	height: 83%;
	background-color: #fff;
}

.session_modal {
	top: 10%;
}

.mslog-modal-dialog {
	width: 900px;
	margin: 0px auto;
}

.pagination_pageli>.disabled>a, .pagination_pageli>.disabled>a:focus,
	.pagination_pageli>.disabled>a:hover {
	cursor: default;
}

.pagination-position {
	margin: 0px;
}

.msglog-modal-footer {
	padding: 10px;
}

#msglog-page {
	float: right;
	display: inline-block;
}

#pagination_page {
	float: right;
	display: inline-block;
}

#page-select {
	height: 29px;
	float: left;
	display: inline-block;
	line-height: 29px;
}
</style>
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
				<div class="x_panel">
					<div class="row">
						<div class="col-md-12 col-sm-12 col-xs-12">
							<div class="custom_panel x_panel">
								<div>
									<c:if test="${user.nickname!=null}">
										<input type="hidden" id="txtApplicationId" value="${appId }">
										<input type="hidden" id="txtAppKey" value="${appKey }">
										<input type="hidden" id="txtSecreteKey" value="${secreteKey }">
									</c:if>


									<div id="mainContextSession">

										<div id="defaultFeedbackTabDiv"
											style="height: 200px; border: 0px solid red;">
											<table id="defaultFeedbackTab">
											</table>
										</div>
										<div id="tb" style="height: auto">
											<a href="javascript:void(0)" class="easyui-linkbutton"
												data-options="iconCls:'icon-reload',plain:true"
												onclick="reject()">刷新</a>
										</div>
										<!-- 模态框（Modal）session-->
										<div class="session_modal modal fade" id="feedbackDiv"
											tabindex="-1" role="dialog"
											aria-labelledby="session_dialogLabel" aria-hidden="true">
											<div class="modal-dialog">
												<div class="modal-content">
													<div class="modal-header">
														<button type="button" class="close" data-dismiss="modal"
															aria-hidden="true">&times;</button>
														<h4 class="modal-title">显示session信息</h4>
													</div>
													<div class="modal-body">
														<input type="hidden" id="appid" value="${appId }" />
														<table class="table table-striped table-bordered">
															<thead>
																<tr>
																	<th class="topTitle">&nbsp;标题</th>
																	<th class="topTitle">信息</th>
																</tr>
															</thead>
															<tr>
																<td><span class="title">&nbsp;sessionID：</span></td>
																<td><span id="sessionid"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;真实姓名：</span></td>
																<td><span id="realname"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;邮箱：</span></td>
																<td><span id="email"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;电话号码：</span></td>
																<td><span id="mobile"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;QQ：</span></td>
																<td><span id="qq"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;微信信息：</span></td>
																<td><span id="wechat"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;区域信息：</span></td>
																<td><span id="city"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;IP地址：</span></td>
																<td><span id="ip"></span></td>
															</tr>
															<tr>
																<td><span class="title">&nbsp;备注：</span></td>
																<td><span id="notes"></span></td>
															</tr>
														</table>
													</div>
													<!-- <div class="modal-footer">
												<button type="button" class="btn btn-default" data-dismiss="modal">关闭
												</button>
												<button id="session_confirmed" type="button"
													class="btn btn-primary">确定</button>
											</div> -->
												</div>
												<!-- /.modal-content -->
											</div>
											<!-- /.modal -->
										</div>


										<!-- 模态框（Modal）session-->
										<div class="session_modal modal fade" id="chatDiv"
											tabindex="-1" role="dialog"
											aria-labelledby="session_dialogLabel" aria-hidden="true">
											<div class="mslog-modal-dialog modal-dialog">
												<div class="modal-content">
													<div class="modal-header">
														<button type="button" class="close" data-dismiss="modal"
															aria-hidden="true">&times;</button>
														<h4 class="modal-title">显示聊天记录</h4>
													</div>
													<div class="modal-body">
														<div id="chat_table">
															<table width="100%" class="table">
																<thead>
																	<tr>
																		<th class="tableid">ID</th>
																		<th class="tablesendname">发送者</th>
																		<th>聊天记录</th>
																		<th class="tabletime">聊天时间</th>
																	</tr>
																</thead>
																<tbody id="chatlist">
																</tbody>
															</table>
														</div>
													</div>
													<div class="msglog-modal-footer modal-footer"
														id="chat-foot">
														<div id="msglog-page">
															<ul id="pagination_page"
																class="pagination_pageli pagination-position pagination pagination-sm">

															</ul>
															<div id="page-select"></div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div id="" style="display: none;"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer> <jsp:include page="../footerv2.jsp" /> </footer>
			</div>
		</div>

	</div>

</body>
</html>
