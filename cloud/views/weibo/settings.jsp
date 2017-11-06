<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=10" />

<link rel="stylesheet" type="text/css"
	href="jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="jquery-easyui-1.3.6/themes/icon.css">
<link href="${pageContext.request.contextPath}/css/font.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" 	src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.mask.js"></script>
<script type="text/javascript" charset="utf-8"	src="${ctx }/js/weibo/setting.js"></script>

</head>
</head>
<body>
	<div id="divSettingHei" style="border: 0px solid red; max-height: 540px;">
	<div class="divKs-tb1">基本设置：</div>
		<div class="divSCopy">
			<span class="divKs-tb">URL:</span> <span class="CM-portcnp2 f_l"> <input
				id="addrEl" readonly="readonly" name="" onfocus="" type="text"
				class="CM-input01"
				value="http://mp.weibo.jintongsoft.cn/jop-weibo/callback?ak=${key }"
				style="width: 600px;">
			</span>
		</div>
		<div class="divSCopyTokenLab" >
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请将URL复制到您的<a class="divKs-title-zi"
				href="http://d.weibo.com/" target="_blank">新浪微博</a>认证账号开发模式下的接口配置中。
		</div>
		<div class="divSCopyToken2">
		<input type="hidden" id="txtApplicationId" value="${appId }">
			<span class="divKs-tb">&nbsp;&nbsp;&nbsp;App key:</span> <span class="CM-portcnp2 f_l"> <input
				id="txtAppkey"  name="" type="text"
				class="CM-input01 CM-fz12 CM-cl02"
				value="${weiboCredential.appkey }" style="width: 600px;"><sup>*</sup>
			</span>
		</div>
		<div class="divSCopyToken2">
			<span class="divKs-tb">App secret:</span> <span class="CM-portcnp2 f_l"> <input
				id="txtAppsecret" name="" type="text"
				class="CM-input01 CM-fz12 CM-cl02"
				value="${weiboCredential.appsecret }" style="width: 600px;"><sup>*</sup>
			</span>
		</div>
		<div class="CM-portcn02 p-t10">
			<p class="CM-portcnp4 CM-lh22 t-l f_l">
				<font class="divSCopyTokenLab1">如何开启微博认证账号开发模式？</font><br><span
					class="CM-cl04">登录到<a target="_blank" class="divKs-title-zi"
					href="http://d.weibo.com/">新浪微博</a>认证帐号，进入菜单栏“粉丝服务”—&gt;“开发者中心”根据提示将URL复制到相应输入框中，点击“保存”在开发者模式。<br>
				</span>
			</p>
			<p class="CM-portcnp4 CM-lh22 t-l f_l">
				<font class="divSCopyTokenLab1">如何获取App key 和App secret？</font><br><span
					class="CM-cl04">请登录新浪微博，在<a target="_blank" class="divKs-title-zi"
					href="http://open.weibo.com/apps">应用管理中心</a>中查看。或者你的新浪微博身份认证的邮箱。如果没有应用，需要<a target="_blank" class="divKs-title-zi"
					href="http://open.weibo.com/development">创建应用</a><br>
				</span>
			</p>
			<p class="CM-portcnp4 CM-lh22 t-l f_l">
				<font class="divSCopyTokenLab1">如何配置授权？</font><br> <span
					class="CM-cl04">请登录新浪微博，在<a target="_blank" class="divKs-title-zi"
					href="http://open.weibo.com/apps">应用信息</a>--高级设置--授权设置<br>
					授权回调页：http://www.jintongsoft.cn/cloud/weibo/getAccessToken<br>
					取消授权回调页：http://www.jintongsoft.cn<br>
				</span>
			</p>
		</div>
		<input type="hidden" id="txtweiboRedirectUri" value="${weiboRedirectUri }">
		<div align="center" style="margin-bottom: 20px;">
			<button type="button" onclick="setting.submit()" onmouseover="onbtnOverCss(this)" onmouseout="onbtnOutCss(this)"
				class="btn02">保存</button>
			<c:if test="${weiboCredential.appkey!=null }">
			<button type="button" onclick="setting.accessSubmit()" onmouseover="onbtnOverCss(this)" onmouseout="onbtnOutCss(this)"
				class="btn02">授权</button>
			</c:if>
		</div>
		</div>
		
</body>
</html>