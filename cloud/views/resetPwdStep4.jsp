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
							<td id="process_title_1"><i class="num">1</i>请输入绑定的邮箱
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
							<td id="process_title_1" class="state_doing"><i class="num">4</i>完成</td>

						</tr>
					</tbody>
				</table>
				<form method="post" id="form_emailResetPWD"
					name="form_emailResetPWD" action="" class="emailResetPWDForm">
					<table border="0" class="tab_2012" style="margin:10px 25%">
						<tbody id="resetPwdSuccess">
							<c:if test="${updatePwdSuccessful!=null }">
								<tr class="str_2">
									<th scope="row"><img src="${ctx }/images/img_18.gif"></th>
									<td class="str_1">
										<div class="box_07">
											<span class="font_4">${updatePwdSuccessful }</span><br>
											为了保护您的账号安全，请重新登录。
										</div>
									</td>
								</tr>
								<tr>
									<th scope="row">&nbsp;</th>
									<td style="padding: 20px 0 0 16px;"><a
										href="${ctx }/login"><img
											src="${ctx }/images/bu_now_login.gif"><br></a></td>
								</tr>
							</c:if>

							<c:if test="${updatePwdFailure!=null }">
								<tr class="str_2">
									<th scope="row"><img src="${ctx }/images/img_41.gif"></th>
									<td class="str_1">
										<div class="box_07">
											<span class="font_4">${updatePwdFailure }</span><br> <a
												href="javascript: history.back();" class="fc_1"><b>
													<script>
														setTimeout(
																'history.back();',
																3000);
													</script> 返回
											</b></a>
										</div>
									</td>
								</tr>
							</c:if>
						</tbody>

					</table>
				</form>
			</div>
		</div>
	</div>
</body>
</html>