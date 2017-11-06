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


<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/icon.css">


<script type="text/javascript">
var appName = '${ctx}';
</script>
<jsp:include page="../headv2.jsp" />
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/jquery.easyui.min.js" ></script>
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js" ></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script src="${ctx }/js/static.js" type="text/javascript" charset="utf-8"></script>
<script src="${ctx }/js/jquery.qrcode.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/js/jquery.cookie.js"></script>
<script type="text/javascript" src="${ctx}/js/jquery.noty.packaged.min.js"></script>
<script type="text/javascript" src="${ctx}/js/jtnoty.js"></script>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/app/cloudApp.js"></script>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/document/document.js"></script>
</head>
<title>文档管理</title>
<style>
td {
	table-layout: fixed;
	word-break: break-all;
}
.formstyle{
	padding-top:20px;
}
.title{
	vertical-align: bottom;
	color: black;
	font: bold;
}
.attention{
	vertical-align: bottom;
	color: green;
	font: bold;
}
.asterisk{
	color: red;
}
.custom_panel{
	padding:0px;
	border: 0px;
}
.custom_panel div.datagrid-wrap{
	padding:0px;
}
div.panel-body{
	padding-left:0px;
	padding-right:0px;
}
.document_modal{
	top:20%;
}
button, .btn {
    margin-bottom: 0px;
    margin-right: 5px;
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
				
                <div class="clearfix"></div>
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="custom_panel x_panel">
                            <div>
                            	<c:if test="${user.nickname!=null}">
									<input type="hidden" id="txtApplicationId" value="${appId }">
									<input type="hidden" id="txtAppKey" value="${appKey }">
									<input type="hidden" id="txtSecreteKey" value="${secreteKey }">
								</c:if>
								<div>
								<table id="defaultDocumentTab">
								</table>
								<div id="tb" style="height: auto">
									<a href="javascript:void(0)" class="easyui-linkbutton"
										data-options="iconCls:'icon-add',plain:true" onclick="append()">添加</a>
									<a href="javascript:void(0)" class="easyui-linkbutton"
										data-options="iconCls:'icon-reload',plain:true" onclick="reject()">刷新</a>
								</div>
								
								
								<!-- 模态框（Modal）保存-->
								<div class="document_modal modal fade"  id="saveAppDefaultDocumentDiv"  tabindex="-1"
									role="dialog" aria-labelledby="document_dialogLabel" aria-hidden="true">
									<div class="modal-dialog">
										<div class="modal-content">
											<div class="modal-header">
												<button type="button" class="close" data-dismiss="modal"
														aria-hidden="true">&times;</button>
												<h4 class="modal-title" id="document_dialogLabel">新增文档</h4>
											</div>
											<div class="modal-body">
												<form class="formstyle" id="save" action="" enctype="multipart/form-data">
													<table align="center">
														<tr  style="display: none;">
															<td><input id="appidSave" type="hidden" name="appid" value="${appId }"></td>
														</tr>
														<tr>
															<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;文档名称：</span></td>
															<td><input class="form-control txt01" id="docnameSave" type="text" name="docname" value=""></td>
														</tr>
														<tr>
															<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;文件上传：</span></td>
															<td class="fs_person"><input id="attachSave" type="file" id="attach" name="attach" /></td>
														</tr>
														<tr>
															<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="attention">&nbsp;</span></td>
															<td class="fs_person"><span  class="attention">提示：文件格式为.docx .pdf .txt任意一种</span></td>
														</tr>
														<tr  style="display: none;">
															<td><input id="uploaderSave" type="hidden" name="uploader" value="${user.id }"></td>
														</tr>
													</table>
												</form>		
											
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
												<button id="document_save_confirmed" type="button" class="btn btn-primary">确定</button>
											</div>
										</div>
										<!-- /.modal-content -->
									</div>
									<!-- /.modal -->
								</div>
												
												
								<div style="display: none;">
									
								</div>
								
								<!-- 模态框（Modal）保存-->
								<div class="document_modal modal fade"  id=editAppDefaultDocumentDiv  tabindex="-1"
									role="dialog" aria-labelledby="document_dialogLabel" aria-hidden="true">
									<div class="modal-dialog">
										<div class="modal-content">
											<div class="modal-header">
												<button type="button" class="close" data-dismiss="modal"
														aria-hidden="true">&times;</button>
												<h4 class="modal-title" id="document_dialogLabel">更新文档</h4>
											</div>
											<div class="modal-body">
												<form class="formstyle" id="edit" action="" enctype="multipart/form-data">
													<table align="center">
														<tr style="display: none;">
															<td><input id="appidEdit" type="hidden" name="appid" value="${appId }"></td>
														</tr>
														<tr style="display: none;">
															<td><input id="idEdit" type="hidden" name="id" value=""></td>
														</tr>
														<tr>
															<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;文档名称：</span></td>
															<td><input class="form-control txt01" id="docnameEdit" type="text" name="docname" value=""></td>
														</tr>
														<tr>
															<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;文件上传：</span></td>
															<td class="fs_person"><input id="attachEdit" type="file" id="attach" name="attach" /></td>
														</tr>
														<tr>
															<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="attention">&nbsp;</span></td>
															<td class="fs_person"><span  class="attention">提示：文件格式为.docx .pdf .txt任意一种</span></td>
														</tr>
														<tr>
															<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;已上传文件：</span></td>
															<td class="fs_person"><span id="existfile"></span></td>
														</tr>
														<tr  style="display: none;">
															<td><input id="uploaderEdit" type="hidden" name="uploader" value="${user.id }"></td>
														</tr>
													</table>
												</form>
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
												<button id="document_update_confirmed" type="button" class="btn btn-primary">确定</button>
											</div>
										</div>
										<!-- /.modal-content -->
									</div>
									<!-- /.modal -->
								</div>
								
								<!-- 模态框（Modal）删除-->
								<div class="document_modal modal fade"  id="delDiv"  tabindex="-1"
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
								<div style="display: none;">
									
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
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/jquery.form.js"></script>
</html>
