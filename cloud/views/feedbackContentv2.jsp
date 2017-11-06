<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<head>
<jsp:include page="headv2.jsp" />
</head>
<script type="text/javascript">var appName = '${ctx}';</script>
<link href="${ctx }/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/font.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/index.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/reg.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"	href="${ctx }/jquery-easyui-1.3.6/themes/icon.css">
<!-- <script type="text/javascript"	src="/cloud/jquery-easyui-1.3.6/jquery.min.js"></script> -->
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/jquery.easyui.min.js" ></script>
<script type="text/javascript"	src="${ctx }/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js" ></script>
<script src="${ctx }/js/jquery.qrcode.min.js" type="text/javascript"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script src="${ctx }/js/static.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" charset="utf-8"	src="${ctx }/js/feedback.js"></script>
<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<div class="col-md-3 left_col">
				<jsp:include page="leftv2.jsp" />
			</div>
			<div class="top_nav">
				<jsp:include page="topnavv2.jsp" />
			</div>
			<div class="right_col" role="main">
				<div class="col-md-12 col-sm-12 col-xs-12">
					<div class="x_panel">
						<div class="x_title">
							<h2>
								问题反馈 <small>提交反馈内容</small>
							</h2>
							<ul class="nav navbar-right panel_toolbox">
								<li><a class="collapse-link"><i
										class="fa fa-chevron-up"></i></a></li>
								<li class="dropdown"><a href="#" class="dropdown-toggle"
									data-toggle="dropdown" role="button" aria-expanded="false"><i
										class="fa fa-wrench"></i></a>
									<ul class="dropdown-menu" role="menu">
										<li><a href="user">个人信息</a></li>
									</ul></li>
								<li><a class="close-link"><i class="fa fa-close"></i></a></li>
							</ul>
							<div class="clearfix"></div>
						</div>
						<div class="x_content">
							<br />
							<table border="0" class="tab_2012" >
					<tbody>
						<tr>
							<th scope="row" width="100"><sup>*</sup> 反馈标题：</th>
							<td class="td_input"><input id="title_input" name="title"
								type="text" maxlength="20" class="reg_input_text_01" value=""
								tabindex="1" style="width: 300px;"></td>
							<td class="td_hint_str">
								<div class="left into_input_jt_01">&nbsp;</div>
								<div class="left into_input_bg_01">
									<span class="hint_text">请输入反馈标题。</span>
								</div>
							</td>
						</tr>
						<tr>
							<th scope="row" width="100"><sup>*</sup> 反馈内容：</th>
							<td class="td_input"><textarea rows="5" cols="36"
									style="resize: none;width: 300px;" id="feedback_input" name="feedback"
									 tabindex="2" ></textarea></td>
							<td class="td_hint_str">
								<div class="left into_input_jt_01">&nbsp;</div>
								<div class="left into_input_bg_01">
									<span class="hint_text">请输入反馈内容。</span>
								</div>
							</td>
						</tr>
						<tr>
							<th scope="row" width="100"><sup>*</sup> 手机号码：</th>
							<td class="td_input"><input id="mobile_input" name="mobile"
								type="text" maxlength="11" class="reg_input_text_01" value=""
								tabindex="3" style="width: 300px;"></td>
							<td class="td_hint_str">
								<div class="left into_input_jt_01">&nbsp;</div>
								<div class="left into_input_bg_01">
									<span class="hint_text">请输入手机号码。</span>
								</div>
							</td>
						</tr>
						<tr class="tr_focus">
							<th scope="row"></th>
							<td class="td_hint_str"><input type="hidden" name="submit"
								value="post"> <input id="submit_button"
								onclick="btnOclkFeedback()" type="button" value="提交意见"
								class="btn btn-success" >
								</td>
						</tr>
					</tbody>
				</table>
						</div>
					</div>
				</div>
				<jsp:include page="footerv2.jsp" />
			</div>
		</div>
	</div>
</body>

</html>
