<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html>
<head>
<jsp:include page="../headv2.jsp" />
<link href="${ctx }/css/index.css" type="text/css" rel="stylesheet">
<link href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css" href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript" src="${ctx}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.mask.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/weibo/main.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/weibo/setting.js"></script>
<script type="text/javascript">
	var appName = '${ctx}';
	var contextPath = '${pageContext.request.contextPath}';
	var status = $
	{
		status
	};
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
				<div class="x_panel">
					<div class="x_title">
						<h2>
							<c:if test="${status==0 }">按照引导对接微博
      </c:if>
							<c:if test="${status==1 }">
新浪微博对接成功      </c:if>
						</h2>
						<div class="clearfix"></div>
					</div>
					<div class="x_content">

						<div id="article_content" class="article_content">
							<p>
								<b style="color: red; font-size: 16px;">第一步：</b>
								<a href="http://open.weibo.com/development/fenfu" target="_blank">http://open.weibo.com/development/fenfu</a>&nbsp;&nbsp;申请应用，点击创建应用，填写相关应用即可。
							</p>
							<p>
								<img src="${ctx }/images/weibo01.png" width="545px;">
								<br>
							</p>
							<p></p>
							<p>
								<b style="color: red; font-size: 16px;">第二步：</b>
								填写完之后，在管理应用里就能看到自己的应用了。 点击应用，会跳转到应用信息-基本信息。
								<br>
								在这里可以看到自己申请用户的
								<b>app key</b>
								及
								<b>app secret</b>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如图指导填写
								<br />
							<div class="divSCopyToken2">
								<span class="divKs-tb">&nbsp;&nbsp;&nbsp;微博账号:</span> <span class="CM-portcnp2 f_l">
									<input id="txtweiboName" name="txtweiboName" type="text" class="CM-input01 CM-fz12 CM-cl02"
										value="${weiboCredential.name }" style="width: 330px;"> <sup style="color: red">*</sup>
								</span>
							</div>
							<div class="divSCopyToken2">
								<input type="hidden" id="txtApplicationId" value="${appId }">
								<span class="divKs-tb">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;App key:</span> <span
									class="CM-portcnp2 f_l"> <input id="txtAppkey" name="" type="text"
										class="CM-input01 CM-fz12 CM-cl02" value="${weiboCredential.appkey }"
										style="width: 330px;"> <sup style="color: red">*</sup>
								</span>
							</div>
							<div class="divSCopyToken2">
								<span class="divKs-tb">App secret:</span> <span class="CM-portcnp2 f_l"> <input
										id="txtAppsecret" name="" type="text" class="CM-input01 CM-fz12 CM-cl02"
										value="${weiboCredential.appsecret }" style="width: 330px;"> <sup
										style="color: red">*</sup>
								</span>
							</div>
							<input type="hidden" id="txtweiboRedirectUri" value="${weiboRedirectUri }">
							<div style="margin-left: 220px;">
								<button type="button" onclick="setting.submit()" class="btn btn-lg btn-success">保存</button>
								<c:if test="${weiboCredential.appkey!=null }">
									<button type="button" onclick="setting.accessSubmit()" class="btn btn-lg btn-success">授权</button>
								</c:if>
							</div>
							<p></p>
							<p>
								&nbsp;<a href="${ctx}/images/weibo02.png" target="_blank"><img
										src="${ctx}/images/weibo02.png" alt="点击放大" width="545px;" height="250px;"> </a>
							</p>
							<p>
								<b style="color: red; font-size: 16px;">第三步：</b>
								点击高级信息，设计回调页面。请填写授权设置：
								<br />
								复制
								<b>授权回调页：http://www.jintongsoft.cn/cloud/weibo/getAccessToken</b>
								<br />
								<b>取消授权回调页：http://www.jintongsoft.cn</b>
							</p>
							<p>
								<a href="${ctx}/images/weibo03.png" target="_blank"><img src="${ctx}/images/weibo03.png"
										width="545px;" height="300px;"></a>
								<br>

							</p>
							<p></p>
							<p>
								<b style="color: red; font-size: 16px;">第四步：</b>
								微博首页 <a href="http://weibo.com/" target="_blank">http://weibo.com/</a>点击右上角账户，进入管理中心，
								请点击“粉丝服务”—>开启“开发者中心”
								<br />
								根据提示将URL复制到相应输入框中，点击“保存”在开发者模式。
							<div class="divSCopy">
								<span class="divKs-tb">URL:</span> <span class="CM-portcnp2 f_l"> <input id="addrEl"
										readonly="readonly" name="" onfocus="" type="text" class="CM-input01"
										value="http://mp.weibo.jintongsoft.cn/jop-weibo/callback?ak=${key }" style="width: 600px;">
								</span>
							</div>
							<a href="${ctx}/images/weibo05.png" target="_blank"><img src="${ctx}/images/weibo05.png"
									width="545px;" height="350px;">
								<br> </a>
							<p></p>
							<p>&nbsp;</p>
						</div>

					</div>
					<footer>
						<jsp:include page="../footerv2.jsp" />
					</footer>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
