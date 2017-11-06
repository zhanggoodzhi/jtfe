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

<link href="${ctx}/lib/ligerUI/skins/Aqua/css/ligerui-all.css"
	rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/icon.css">



<jsp:include page="../headv2.jsp" />
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/jquery.easyui.min.js" ></script>
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js" ></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script src="${ctx}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerComboBox.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerTree.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerDialog.js"
	type="text/javascript"></script>
<script type="text/javascript"
	src="${ctx}/js/knowledge/recommendList.js"></script>
<script type="text/javascript" src="${ctx}/js/jquery.noty.packaged.min.js"></script>
<script type="text/javascript" src="${ctx}/js/jtnoty.js"></script>
<script src="${ctx }/js/static.js" type="text/javascript" charset="utf-8"></script>
<script src="${ctx }/js/jquery.qrcode.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/js/jquery.cookie.js"></script>
<script type="text/javascript">
	var contextPath = '${ctx}';
</script>
</head>
<title>推荐问题</title>
<style>
td {
	table-layout: fixed;
	word-break: break-all;
}
.custom_panel{
	padding:0px;
}
.custom_panel div.datagrid-wrap{
	padding:0px;
}
div.panel-body{
	padding-left:0px;
	padding-right:0px;
}
#recommendGrid input[type="radio"], input[type="checkbox"]{
	margin:0px;
}
.recommendList_modal{
	top:30%;
}
button, .btn {
    margin-bottom: 0px;
    margin-right: 5px;
}
.l-dialog-buttons{
	padding-top: 2px;
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
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="custom_panel x_panel">
                            <div>
                            	<c:if test="${user.nickname!=null}">
									<input type="hidden" id="txtApplicationId" value="${appId }">
									<input type="hidden" id="txtAppKey" value="${appKey }">
									<input type="hidden" id="txtSecreteKey" value="${secreteKey }">
								</c:if>


								<div id="toolbar" style="height: 40px;padding-top: 12px;padding-left: 10px;">
									<div style="float: left">
										<label for="classifys" id="classifysLabel"
											style="margin-right: 4px; margin-top: 4px; float: left;">类型</label>
										<div class="comboBoxDiv"
											style="float: left; margin-top: 2px; margin-right: 5px;">
											<input id="classifys" />
										</div>
									</div>
									<label for="keyword" id="keywordLabel" style="margin-right: 4px;">关键词</label>
									<input id="keyword" placeholder="请输入关键词"
										style="margin-top: 4px; border: 1px solid #ccc;width: 255px;height: 22px; "> <a
										class="easyui-linkbutton"
										data-options="iconCls:'icon-search',plain:true"
										onclick="recommendList.gridReload()">查询</a> <a
										class="easyui-linkbutton"
										data-options="iconCls:'icon-add',plain:true"
										onclick="recommendList.addRecommendClick()">添加</a> <a
										class="easyui-linkbutton"
										data-options="iconCls:'icon-delete',plain:true"
										onclick="recommendList.batchDelete()">批量删除</a>
								</div>
								<!-- 模态框（Modal）删除-->
										<div class="recommendList_modal modal fade"  id="delDiv"  tabindex="-1"
												role="dialog" aria-labelledby="del_dialogLabel"
												aria-hidden="true">
												<div class="modal-dialog">
													<div class="modal-content">
														<div class="modal-body">
															<div style="margin-left:120px;"><h3>您是否确定删除该条数据？</h3></div>
														</div>
														<div class="modal-footer">
															<button type="button" class="btn btn-default" data-dismiss="modal">关闭
															</button>
															<button id="del_confirmed" type="button"
																class="btn btn-primary">确定</button>
														</div>
													</div>
													<!-- /.modal-content -->
												</div>
												<!-- /.modal -->
										</div>
								<table id="recommendGrid" ></table>



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
