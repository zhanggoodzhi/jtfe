<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.net.URLDecoder"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html>
<head>
<jsp:include page="headv2.jsp" />
<link rel="stylesheet" type="text/css" href="${ctx }/css/color.css">
<link rel="stylesheet" type="text/css" href="${ctx }/css/style.css">
<link href="${ctx }/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/font.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/reg.css" rel="stylesheet" type="text/css" />
<script type="text/javascript"
	src="${ctx }/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/reg.js"></script>
<script type="text/javascript">
	var appName = '${ctx}';
</script>

</head>
<body>
	<!--header-->
<jsp:include page="headerContainer.jsp"/>

	<div id="reg_doc">
		<!-- 		<div class="reg_head" > -->
		<div class="reg_box_nav cls">
			<div class="reg_nav">
				<ul class="cls">
					<li class="index"><a>找回密码</a><span class="jiantou"></span></li>
				</ul>
			</div>
		</div>

		<div class="reg_content"
			style="border: 1px solid #D5D5D5; height: 580px; margin-top: 40px;">
			<!-- 找回密码 -->
			<div class="login-content03" style="font-size: 16px; color: #333">
				<table class="ui_step_2">
					<tbody>
						<tr class="ui_step_bar_2">
							<td id="process_title_1" class="state_doing"><i class="num">1</i>请输入绑定的邮箱
								<div class="arr_out">
									<i class="arr_in"></i>
								</div></td>
							<td id="process_title_1"><i class="num">2</i>验证邮箱
								<div class="arr_out">
									<i class="arr_in"></i>
								</div></td>
							<td id="process_title_1"><i class="num">3</i>设置新密码
								<div class="arr_out">
									<i class="arr_in"></i>
								</div></td>
							<td id="process_title_1"><i class="num">4</i>完成</td>

						</tr>
					</tbody>
				</table>

				<form method="post" id="form_emailResetPWD"
					name="form_emailResetPWD" action="" class="emailResetPWDForm">
					<table border="0" class="tab_2012" style="margin-left: 15%">
						<tbody id="emailPwdTable" style="display: block;">
							<tr>
								<th scope="row" width="140"><sup>*</sup> <strong>请输入邮箱：</strong></th>
								<td class="td_input"><input id="emailpwd_input"
									name="emailpwd" type="text" maxlength="60"
									class="reg_input_text_01" value="" tabindex="1"></td>
								<td class="td_hint_str">
									<div class="left into_input_jt_01">&nbsp;</div>
									<div class="left into_input_bg_01">
										<span class="hint_text">请输入绑定的邮箱。</span>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row" width="140"></th>
								<th scope="row" colspan="2"><img alt="下一步"
									src="${ctx}/images/bu_next.gif"
									style="cursor: pointer; float: left;"
									onclick="btnRegisterEmailPwd()">
									<div id="loadimg"
										style="height: 15px; margin-top: 10px; display: none;">
										<img alt="" src="${ctx}/images/loadingm.gif">&nbsp;数据正在提交...
									</div></th>
							</tr>

						</tbody>
					</table>
				</form>
			</div>

		</div>
	</div>
</body>
</html>