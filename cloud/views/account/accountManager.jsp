<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="en">

<head>
<base href="<%=basePath%>">
<meta http-equiv="X-UA-Compatible" content="IE=10" />

<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/icon.css">

<jsp:include page="../headv2.jsp" />
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/jquery.easyui.min.js" ></script>
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js" ></script>
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/datagrid-detailview.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/static.js" ></script>
<script type="text/javascript" src="${ctx }/js/jquery.qrcode.min.js" ></script>
<script type="text/javascript" src="${ctx}/js/jquery.cookie.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/reg.js"></script>
<script type="text/javascript" src="${ctx}/js/jquery.noty.packaged.min.js"></script>
<script type="text/javascript" src="${ctx}/js/jtnoty.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/app/cloudApp.js"></script>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/account/account.js"></script>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/account/accountGroup.js"></script>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/account/privilege.js"></script>

<script type="text/javascript">
	var appName = '${ctx}';
	
</script>
</head>
<title>客服人员管理</title>
<style>
td {
	table-layout: fixed;
	word-break: break-all;
}
.msgTip{
	display: inline-block;
    line-height: 2.2;
    color: rgb(243, 69, 69);
    background: red;
    height: 34;
}
.formstyle{
	padding-left:100px;
}
.formstyle table tr{
	    height: 40;
}
.privilege_tablestyle{
	margin-left:90px;
}
.title{
	color: black;
	font: bold;
}
.tablestyle{
	margin-left:120px;
}
.asterisk{
	color: red;
}
.panel{
	margin-bottom: 0px;
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
	padding-top:0px;
	padding-bottom:0px;
}
.table_div{
    width: 100%;
    background-color: #fff;
}
.account_modal{
	top:20%;
}
button, .btn {
    margin-bottom: 0px;
    margin-right: 5px;
}
.attenionMsg{
	height:24px;
	line-height: 24px;
}
.count_left{
	padding-left:30px;
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
			
			<div class="right_col" style="min-height: 907px;" role="main">
				
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
					
						<div class="custom_panel x_panel">
                            <div role="tabpanel" data-example-id="togglable-tabs">
                            	<c:if test="${user.nickname!=null}">
									<input type="hidden" id="txtApplicationId" value="${appId }">
									<input type="hidden" id="txtAppKey" value="${appKey }">
									<input type="hidden" id="txtSecreteKey" value="${secreteKey }">
									<input id="txtAppId" type="hidden" value="${appId }">
								</c:if>
								

								  <!-- Nav tabs -->
								 <ul class="nav nav-tabs bar_tabs" role="tablist" id="account_tabs">
								 		<li id="group_tabli" role="presentation"><a id="group_tab"  href="#group" aria-controls="group" role="tab" data-toggle="tab">分组管理</a></li>
										<li id="account_tabli" role="presentation"><a id="account_tab" href="#account" aria-controls="account" role="tab" data-toggle="tab">帐号管理</a></li>
										
										<li id="privilege_tabli"  role="presentation"><a id="privilege_tab"  href="#privilege" aria-controls="privilege" role="tab" data-toggle="tab">权限管理</a></li>
								 </ul>
								  <!-- Tab panes -->
								  <div class="tab-content">
									    <div class="tab-pane" id="account">
												
												<div id="defaultAccountTabDiv" class="table_div">
													<table id="defaultAccountTab">
													</table>
												</div>
												<div id="account_tb" style="height: auto">
													<a href="javascript:void(0)" class="easyui-linkbutton"
														data-options="iconCls:'icon-add',plain:true" onclick="account_append()">添加</a>
													<a href="javascript:void(0)" class="easyui-linkbutton"
														data-options="iconCls:'icon-reload',plain:true" onclick="account_reject()">刷新</a>
												</div>
												<!-- 模态框（Modal）保存account-->
												<div class="account_modal modal fade"  id="saveAppDefaultAccountDiv"  tabindex="-1"
													role="dialog" aria-labelledby="account_dialogLabel" aria-hidden="true">
													<div class="modal-dialog">
														<div class="modal-content">
															<div class="modal-header">
																<button type="button" class="close" data-dismiss="modal"
																	aria-hidden="true">&times;</button>
																<h4 class="modal-title" id="save_account_dialogLabel">保存客服帐号</h4>
															</div>
															<div class="modal-body">
															<div class="count_left">
																<form class="formstyle" id="save" action="" method="post">
																	<input id="appIdSave" type="hidden" name="appId" value="${appId }">
																		<table align="">
																			<tr>
																				<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;用户名：</span></td>
																				<td><input class="form-control" type="text" id="usernameSave" name="username" onkeyup="checkUsernameAccount('Save')" onblur="checkUsernameAccount('Save')" value=""></td>
																				<td><span id="usernameSaveMsg" ></span></td>
																			</tr>
																			<tr>
																				<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="title">&nbsp;密码：</span></td>
																				<td><input class="form-control" type="text" id="passwordSave" name="password" onkeyup="checkPasswordAccount('Save')" onblur="checkPasswordAccount('Save')" value=""></td>
																				<td><span id="passwordSaveMsg"></span></td>
																			</tr>
																			<tr>
																				<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;权限分组：</span></td>
																				<td>
																					<select class="form-control" id="groupidSave" name="groupid" class="">
																						<c:forEach var="oneGroup" items="${accountGroup}">
																							<option value="${oneGroup.id}" class="option_${oneGroup.id}">${oneGroup.groupname}</option>		
																						</c:forEach>
																					</select> 																			
																				</td>
																			</tr>
																			<tr>
																				<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;别名：</span></td>
																				<td><input class="form-control" type="text" id="aliasSave" name="alias" onkeyup="checkAliasAccount('Save')" onblur="checkAliasAccount('Save')" value=""></td>
																				<td><span id="aliasSaveMsg"></span></td>
																			</tr>
																			<tr>
																				<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="title">&nbsp;邮箱：</span></td>
																				<td><input class="form-control" type="text" id="emailSave" name="email" onkeyup="checkEmailAccount('Save')" onblur="checkEmailAccount('Save')"  value=""></td>
																				<td><span id="emailSaveMsg"></span></td>
																			</tr>
																			<tr>
																				<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="title">&nbsp;电话：</span></td>
																				<td><input class="form-control" type="text" id="mobileSave" name="mobile" onkeyup="checkMobileAccount('Save')" onblur="checkMobileAccount('Save')"  value=""></td>
																				<td><span id="mobileSaveMsg"></span></td>
																			</tr>
																			<tr>
																				<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;是否可用：</span></td>
																				<td>
																					<input  type="radio" class="" name="deleted" value="1" /> 不可用 
																					<input  type="radio" class="" name="deleted" checked="checked" value="0" /> 可用
																				</td>
																			</tr>
																	</table>
																</form>
															</div>
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-default" data-dismiss="modal">关闭
																</button>
																<button id="account_save_confirmed" type="button"
																	class="btn btn-primary">确定</button>
															</div>
														</div>
														<!-- /.modal-content -->
													</div>
													<!-- /.modal -->
												</div>
												<div style="display: none;">
													
												</div>
												
												
												<!-- 模态框（Modal）更新account-->
												<div class="account_modal modal fade"  id="editAppDefaultAccountDiv"  tabindex="-1"
													role="dialog" aria-labelledby="account_dialogLabel"
													aria-hidden="true">
													<div class="modal-dialog">
														<div class="modal-content">
															<div class="modal-header">
																<button type="button" class="close" data-dismiss="modal"
																	aria-hidden="true">&times;</button>
																<h4 class="modal-title" id="edit_account_dialogLabel">更新客服帐号</h4>
															</div>
															<div class="modal-body">
															<div class="count_left">
																<form id="edit" class="formstyle" action="" method="post">
																	<input id="appIdEdit" type="hidden" name="appId" value="${appId }">
																	<input id="idEdit" type="hidden" name="id" value="">
																	<table align="">
																		<tr>
																			<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;用户名：</span></td>
																			<td><input class="form-control" type="text" id="usernameEdit" name="username" onkeyup="checkUsernameAccount('Edit')" onblur="checkUsernameAccount('Edit')" value=""/></td>
																			<td><span id="usernameEditMsg"></span></td>
																		</tr>
																		<tr>
																			<td></td>
																			<td><span id="isModifyPwd"><input type="checkbox" name="pwdbox" id="pwdbox" value="0"/>是否修改密码</span></td>
																		</tr>
																		<tr>
																			<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="title">&nbsp;密码：</span></td>
																			<td><input class="form-control" type="text" id="passwordEdit" name="password" onkeyup="checkPasswordAccount('Edit')" onblur="checkPasswordAccount('Edit')" value=""/></td>
																			<!-- 是否修改密码 -->
																			<td><span id="passwordEditMsg"></span></td>
																		</tr>
																		<tr>
																			<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;权限分组：</span></td>
																			<td>
																				<select class="form-control" id="groupidEdit" name="groupid" class="">
																					<c:forEach var="oneGroup" items="${accountGroup}">
																						<option value="${oneGroup.id}" class="option_${oneGroup.id}">${oneGroup.groupname}</option>		
																					</c:forEach>
																				</select> 
																			</td>
																		</tr>
																		<tr>
																			<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;别名：</span></td>
																			<td><input class="form-control" type="text" id="aliasEdit" name="alias" onkeyup="checkAliasAccount('Edit')" onblur="checkAliasAccount('Edit')" value=""/></td>
																			<td><span id="aliasEditMsg"></span></td>
																		</tr>
																		<tr>
																			<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="title">&nbsp;邮箱：</span></td>
																			<td><input class="form-control" type="text" id="emailEdit" name="email" onkeyup="checkEmailAccount('Edit')" onblur="checkEmailAccount('Edit')"  value=""/></td>
																			<td><span id="emailEditMsg"></span></td>
																		</tr>
																		<tr>
																			<td class="fs_person"><span class="asterisk">&nbsp;</span><span class="title">&nbsp;电话：</span></td>
																			<td><input class="form-control" type="text" id="mobileEdit" name="mobile" onkeyup="checkMobileAccount('Edit')" onblur="checkMobileAccount('Edit')"  value=""/></td>
																			<td><span id="mobileEditMsg"></span></td>
																		</tr>
																		<tr>
																			<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;是否可用：</span></td>
																			<td>
																				<input  id="edit0" type="radio" class="" name="deleted" value="1" /> 不可用
																				<input  id="edit1" type="radio" class="" name="deleted" value="0" /> 可用
																			</td>
																		</tr>
																	</table>
																</form>
															</div>
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-default" data-dismiss="modal">关闭
																</button>
																<button id="account_update_confirmed" type="button"
																	class="btn btn-primary">确定</button>
															</div>
														</div>
														<!-- /.modal-content -->
													</div>
													<!-- /.modal -->
												</div>
												
												<div  style="display: none;">
													
												</div>
									    </div>
									    <div class="tab-pane" id="group">
												<!-- <input id="txtAppId" type="hidden" value="${appId }"> -->
												<div>
													<table id="defaultAccountGroupTab">
													</table>
												</div>
												<div id="group_tb" style="height: auto">
													<a href="javascript:void(0)" class="easyui-linkbutton"
														data-options="iconCls:'icon-add',plain:true" onclick="group_append()">添加</a>
													<a href="javascript:void(0)" class="easyui-linkbutton"
														data-options="iconCls:'icon-reload',plain:true" onclick="group_reject()">刷新</a>
													
												</div>
												
											<!-- 模态框（Modal）保存-->
											<div class="account_modal modal fade"  id="saveAppDefaultGroupDiv"  tabindex="-1"
													role="dialog" aria-labelledby="group_dialogLabel"
													aria-hidden="true">
													<div class="modal-dialog">
														<div class="modal-content">
															<div class="modal-header">
																<button type="button" class="close" data-dismiss="modal"
																	aria-hidden="true">&times;</button>
																<h4 class="modal-title" id="group_dialogLabel">保存分組</h4>
															</div>
															<div class="modal-body">
																<table align="center" class="" >
																	<tr>
																		<td class="col-md-3 col-sm-3 col-xs-12 fs_person"><span class="asterisk">*</span><span class="title">&nbsp;分组名称：</span></td>
																		<td><input type="text"  class="form-control col-md-9 col-sm-9 col-xs-12 txt01" id="groupSave" value=""></td>
																	</tr>
																</table>
											
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-default" data-dismiss="modal">关闭
																</button>
																<button id="group_save_confirmed" type="button"
																	class="btn btn-primary">确定</button>
															</div>
														</div>
														<!-- /.modal-content -->
													</div>
													<!-- /.modal -->
												</div>
												
												<div style="display: none;">
													
												</div>
												
												<!-- 模态框（Modal）更新-->
												<div class="account_modal modal fade"  id="editAppDefaultGroupDiv"  tabindex="-1"
													role="dialog" aria-labelledby="group_dialogLabel"
													aria-hidden="true">
													<div class="modal-dialog">
														<div class="modal-content">
															<div class="modal-header">
																<button type="button" class="close" data-dismiss="modal"
																	aria-hidden="true">&times;</button>
																<h4 class="modal-title" id="group_dialogLabel">更新分組</h4>
															</div>
															<div class="modal-body">
																<table align="center"  class="" >
																	<tr>
																		<td class="col-md-3 col-sm-3 col-xs-12 fs_person"><span class="asterisk">*</span><span class="title">&nbsp;分组名称：</span></td>
																		<td><input type="text"  class="form-control col-md-9 col-sm-9 col-xs-12 txt01" id="groupEdit" value=""></td>
																	</tr>
																</table>
											
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-default" data-dismiss="modal">关闭
																</button>
																<button id="group_update_confirmed" type="button"
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
										<div class="tab-pane" id="privilege">
												<!-- <input id="txtAppId" type="hidden" value="${appId }"> -->
												<div id="defaultPrivilegeTabDiv" class="table_div">
													<table id="defaultPrivilegeTab">
													</table>
												</div>
												<div id="privilege_tb" style="height: auto">
													<a href="javascript:void(0)" class="easyui-linkbutton"
														data-options="iconCls:'icon-add',plain:true" onclick="privilege_append()">添加</a>
													<a href="javascript:void(0)" class="easyui-linkbutton"
														data-options="iconCls:'icon-reload',plain:true" onclick="privilege_reject()">刷新</a>
												</div>
										
											<!-- 模态框（Modal）保存權限-->
												<div class="account_modal modal fade"  id="saveAppDefaultPrivilegeDiv"  tabindex="-1"
													role="dialog" aria-labelledby="privilege_dialogLabel"
													aria-hidden="true">
													<div class="modal-dialog">
														<div class="modal-content">
															<div class="modal-header">
																<button type="button" class="close" data-dismiss="modal"
																	aria-hidden="true">&times;</button>
																<h4 class="modal-title" id="privilege_dialogLabel">保存权限</h4>
															</div>
															<div class="modal-body">
																<table align="center" class="privilege_tablestyle" >
																	<tr>
																		<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;权限分组：</span></td>
																		<td>
																			<select class="form-control" id="privilege_groupidSave" name="groupid" class="">
																				<c:forEach var="oneGroup" items="${accountGroup}">
																					<option value="${oneGroup.id}" class="option_${oneGroup.id}">${oneGroup.groupname}</option>		
																				</c:forEach>
																			</select> 
																		</td>
																	</tr>
																	<tr>
																		<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;操作权限：</span></td>
																		<td>
																			<c:forEach items="${csOperationList }" var="csOperation">
																				<input type="checkbox" name="operationidsSave" value="${csOperation.id}">${csOperation.opname }<span>&nbsp;(${csOperation.description })</span><br/>
																			</c:forEach>
																		</td>
																	</tr>
																</table>
											
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-default" data-dismiss="modal">关闭
																</button>
																<button id="privilege_save_confirmed" type="button"
																	class="btn btn-primary">确定</button>
															</div>
														</div>
														<!-- /.modal-content -->
													</div>
													<!-- /.modal -->
												</div>
										
										
												<div id="" style="display: none;">
													
												</div>
												
												<!-- 模态框（Modal）更新權限-->
												<div class="account_modal modal fade"  id="editAppDefaultPrivilegeDiv"  tabindex="-1"
													role="dialog" aria-labelledby="privilege_dialogLabel"
													aria-hidden="true">
													<div class="modal-dialog">
														<div class="modal-content">
															<div class="modal-header">
																<button type="button" class="close" data-dismiss="modal"
																	aria-hidden="true">&times;</button>
																<h4 class="modal-title" id="privilege_dialogLabel">更新权限</h4>
															</div>
															<div class="modal-body">
																<table align="center" class="privilege_tablestyle" >
																	<tr>
																		<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;权限分组：</span></td>
																		<td>
																		<input id="groupid" type="hidden" value="">
																		<span id="privilege_groupidEdit"></span>
																		</td>
																	</tr>
																	<tr>
																		<td class="fs_person"><span class="asterisk">*</span><span class="title">&nbsp;操作权限：</span></td>
																		<td>
																			
																			<c:forEach items="${csOperationList }" var="csOperation">
																				<input id="operation${csOperation.id}" type="checkbox" name="operationidsEdit" value="${csOperation.id}">${csOperation.opname }<span>&nbsp;(${csOperation.description })</span><br/>
																			</c:forEach>
																			
																		</td>
																	</tr>
																</table>
											
															</div>
															<div class="modal-footer">
																<button type="button" class="btn btn-default" data-dismiss="modal">关闭
																</button>
																<button id="privilege_update_confirmed" type="button"
																	class="btn btn-primary">确定</button>
															</div>
														</div>
														<!-- /.modal-content -->
													</div>
													<!-- /.modal -->
												</div>
												
												
												<div id="" style="display: none;">
													
												</div>
												<div id="csOperation" style="display: none;">
													<c:forEach items="${csOperationList }" var="csOperation" >
													<p>sfwesgerwsv</p>
														<input id="opname${csOperation.id}" type="hidden" value="${csOperation.opname}"><input id="description${csOperation.id}" type="hidden" value="${csOperation.description}"><br/>
													</c:forEach>
												</div>
										</div>
									<!-- 模态框（Modal）删除-->
										<div class="account_modal modal fade"  id="delDiv"  tabindex="-1"
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
