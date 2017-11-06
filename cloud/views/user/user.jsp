<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<jsp:include page="../headv2.jsp" />
<script type="text/javascript">var appName = '${ctx}';</script>
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/icon.css">
<!-- <script type="text/javascript"	src="/cloud/jquery-easyui-1.3.6/jquery.min.js"></script> -->
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/jquery.easyui.min.js" ></script>
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js" ></script>
<script src="${ctx }/js/jquery.qrcode.min.js" type="text/javascript"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script src="${ctx }/js/static.js" type="text/javascript" charset="utf-8"></script>

<script type="text/javascript" charset="utf-8" src="${ctx}/js/user/user.js"></script>
<script type="text/javascript">

	$(document).ready(function() {
		$("#userName").focus(function() {
			showHint($(this), 1, "请填写账户。");
		}).blur(function() {
			formUpdateUserName(checkUpdateUserName);
		});
		//联系人
		$("#nickname").focus(function() {
			showHint($(this), 1, "请输入昵称。");
		}).blur(function() {
			formUpdateUserNickname();
		});
		//手机
		$("#mobile").focus(function() {
			showHint($(this), 1, "请输入真实手机。");
		}).blur(function() {
			formUpdateUserMobile(checkUpdateUserMobile);
		});
		
		

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
				<div class="col-md-12 col-sm-12 col-xs-12">
					<div class="x_panel">
						<div class="x_title">
							<h2>
								个人信息 <small>基本信息修改</small>
							</h2>
							<ul class="nav navbar-right panel_toolbox">
								<li><a class="collapse-link"><i
										class="fa fa-chevron-up"></i></a></li>
								<li class="dropdown"><a href="#" class="dropdown-toggle"
									data-toggle="dropdown" role="button" aria-expanded="false"><i
										class="fa fa-wrench"></i></a>
									<ul class="dropdown-menu" role="menu">
										<li><a href="user/pwd">修改密码</a></li>
									</ul></li>
								<li><a class="close-link"><i class="fa fa-close"></i></a></li>
							</ul>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<br />
							<form action="" id="updateForm" method="post">
					<input type="hidden" id="userId" value="${user.name }">
					<table width="756" border="0" cellspacing="0" cellpadding="0" class="cl">
						<tbody>

							<tr>
								<td width="107" height="44" align="right" valign="middle"><sup>*</sup><b>账户：</b></td>
								<td width="262" height="44" align="left" valign="middle">
								<input type="text" id="userName" value="${user.name }"
											name="last-name" required="required"
											class="form-control col-md-7 col-xs-12">
							</td>
								<td width="14" height="44" align="left" valign="middle">&nbsp;</td>
								<td class="td_hint_str">
									<div class="left into_input_jt_01" style="display: none;">&nbsp;</div>
									<div class="left into_input_bg_01" style="display: none;">
										<span class="hint_text"></span>
									</div>
								</td>
							</tr>

							<tr>
								<td height="44" align="right" valign="middle"><b>密码：</b></td>
								<td height="44" align="left" valign="middle">
								<input type="button" class="btn btn-danger" value="修改密码"
											onclick="userPwdbk();" >
<!-- 								<input type="button" class="btn01" value="修改密码"  onclick="userPwdbk();" onmouseover="onbtnOverCss(this)" onmouseout="onbtnOutCss(this)"> -->
								<td height="44" align="left" valign="middle">&nbsp;</td>
								<td height="44" align="left" valign="middle">&nbsp;</td>
							</tr>
							<tr>
								<td height="44" align="right" valign="middle"><b>Email：</b></td>
								<td height="44" align="left" valign="middle">${user.email }</td>
								<td height="44" align="left" valign="middle">&nbsp;</td>
								<td align="left" valign="middle" class="fc_7_1">已认证Email不可修改，需要修改请联系工作人员必填</td>
							</tr>
							<tr>
								<td height="44" align="right" valign="middle"><sup>*</sup><b>姓名：</b></td>
								<td height="44" align="left" valign="middle"><input
									type="text" id="nickname" value="${user.nickname }"
									style="width: 260px;" class="txt01"></td>
								<td height="44" align="left" valign="middle">&nbsp;</td>
								<td class="td_hint_str">
									<div class="left into_input_jt_01" style="display: none;">&nbsp;</div>
									<div class="left into_input_bg_01" style="display: none;">
										<span class="hint_text"></span>
									</div>
								</td>
							</tr>
							<tr>
								<td height="44" align="right" valign="middle"><sup>*</sup><b>手机：</b></td>
								<td height="44" align="left" valign="middle"><input
									type="text" id="mobile" value="${user.mobile }" maxlength="11"
									style="width: 260px;" class="txt01"></td>
								<td height="44" align="left" valign="middle">&nbsp;</td>
								<!-- 									    <td align="left" valign="middle" class="fc_8" id="mobileMsgSpan">请填写可以联系到您的真实号码，以便后续的权限申请</td> -->
								<td class="td_hint_str">
									<div class="left into_input_jt_01" style="display: none;">&nbsp;</div>
									<div class="left into_input_bg_01" style="display: none;">
										<span class="hint_text"></span>
									</div>
								</td>
							</tr>
							<tr>
								<td height="44" align="right" valign="middle"><b>QQ：</b></td>
								<td height="44" align="left" valign="middle"><input
									type="text" id="qq" value="${user.qq }" maxlength="25"
									style="width: 260px;" class="txt01"></td>
								<td height="44" align="left" valign="middle">&nbsp;</td>
								<!-- 									    <td align="left" valign="middle" class="fc_8">建议填写，便于我们联系</td> -->
								<td class="td_hint_str">
									<div class="left into_input_jt_01" style="display: none;">&nbsp;</div>
									<div class="left into_input_bg_01" style="display: none;">
										<span class="hint_text"></span>
									</div>
								</td>
							</tr>
							<tr>
								<td height="70" align="right" >&nbsp;</td>
								<td height="70" align="left" >
								
								<input  type="button"
											class="btn btn-success" value="  保      存     " onclick="btnUserInfo()"> <br> <br> 
<!-- 									<span class="fc_7"> 如有修改，请按此按钮提交完成修改 </span> -->
									
									</td>
								<td height="70" align="left" valign="middle">&nbsp;</td>
								<td height="70" align="left" valign="middle">&nbsp;</td>
							</tr>
						</tbody>
					</table>
				</form>
						</div>
					</div>
				</div>
				<jsp:include page="../footerv2.jsp" />
			</div>
		</div>
	</div>
</body>
</html>
