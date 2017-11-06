<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.net.URLDecoder"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html>
<head>
<jsp:include page="headv2.jsp" />
<!-- Bootstrap core CSS -->
<link rel="stylesheet" href="${ctx }/css/style.css" />
<link href="${ctx }/css/regv2.css" rel="stylesheet">
<script type="text/javascript" src="${ctx }/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript">
	var appName = '${ctx}';
</script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/regv2.js"></script>
<script type='text/javascript' src='${ctx }/js/jquery.particleground.js'></script>
<script type='text/javascript' src='${ctx }/js/particleground.js'></script>
<style type="text/css">
.carrousel {
	background-color: rgba(10, 10, 10, 0.8);
	display: none;
	margin: auto;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 10000;
}

.carrousel>login_reg {
	margin: auto;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 10000;
}
</style>
<body style="background-color: #34495E">
	<!--header-->
	<jsp:include page="headerContainer.jsp" />

	<div id="particles">
		<div id="intro">
			<div id="page-wrapper" style="min-height: 561px;">
				<div class="ng-scope">
					<nav class="navbar ng-scope" role="navigation">
						<div class="navbar-header" style="margin-left: 15%; margin-top: 8px;"></div>
					</nav>
					<br class="ng-scope">
					<br class="ng-scope">
					<div class="container ng-scope">
						<div class="login-panel panel panel-default" style="width: 400px; margin: 0px auto">

							<div class="panel-body" style="width: 320px; margin: 0 auto; padding: 0px;">
								<br>
								<h1 class="panel-title" style="text-align: center;">
									<b style="font-size: 23px; color: #908D88">注册账号</b>
								</h1>
								<br>
								<form name="form" role="form" class="ng-pristine ng-valid">
									<fieldset>
										<div class="form-group">
											<input
												style="height:38px;padding-left:34px;background:url('${ctx }/images/small_icon/friends.png') no-repeat 8px;"
												class="form-control" placeholder="企业组织名称" name="company" id="company" type="text"
												value="">
										</div>
										<div class="form-group">
											<input
												style="height:38px;padding-left:34px;background:url('${ctx }/images/small_icon/message.png') no-repeat 8px;"
												class="form-control" placeholder="邮箱" name="email" id="email_input" type="text" value="">
										</div>
										<div class="form-group">
											<input
												style="height:38px;padding-left:34px;background:url('${ctx }/images/small_icon/call.png') no-repeat 8px;"
												class="form-control" placeholder="手机" name="mobile" id="mobile_input" type="text"
												value="">

										</div>
										<div class="form-group">
											<input
												style="height:38px;padding-left:34px;background:url('${ctx }/images/small_icon/account.png') no-repeat 8px;"
												class="form-control" placeholder="输入密码" name="pwd" id="pwd_input" type="password"
												value="">
										</div>
										<div class="form-group">
											<input
												style="height:38px;padding-left:34px;background:url('${ctx }/images/small_icon/account.png') no-repeat 8px;"
												class="form-control" placeholder="再次输入密码" name="agpwd" id="repwd_input" type="password"
												value="">
										</div>
										<div class="checkbox">
											<div class="form-group">
												<span style="font-size: 14px; font-family: cursive; font-weight: bold; color: #908d88">以下是选填内容</span>
												<span style="color: #0095FF; cursor: pointer;">◢</span>
											</div>
											<div class="submenu" style="">
												<div class="form-group">
													<input
														style="height:38px;padding-left:34px;background:url('${ctx }/images/small_icon/contacts.png') no-repeat 8px;"
														class="form-control" placeholder="联系人" name="alias" id="alias_input" type="text"
														value="">
												</div>
												<div class="form-group">
													<input
														style="height:38px;padding-left:34px;background:url('${ctx }/images/small_icon/qq.png') no-repeat 8px;"
														class="form-control" placeholder="QQ" name="qq" id="qq_input" type="text" value="">

												</div>
											</div>
										</div>
										<!-- Change this to a button or input when using this as a form -->
										<div style="text-align: center;">
											<a onclick="do_reg();" class="btn btn-lg btn-success"
												style="width: 100%; background-color: #0095FF; border-color: #0095FF; border-radius: 10px;">注册</a>
										</div>
										<span style="display: inline-block; float: right;"> <a style="color: #0095FF"
											href="login">返回登录页</a>
										</span>
										<br>
									</fieldset>
								</form>
							</div>
						</div>
					</div>
					<div class="carrousel" id="login_reg">
						<div class="login_reg">
							<div>恭喜你注册成功，现在去邮箱验证！</div>
							<span style="display: inline-block;"> <a style="color: #0095FF" href="login">返回登录页</a>
							</span>
							<br>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>