<!DOCTYPE html><%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
  String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+ request.getContextPath() + "/";
%><c:set var="ctx" value="${pageContext.request.contextPath}"/><c:set var="isVcg" value="${sessionScope.accessKey=='pre.dam.vcg.com'}"/><html lang="zh-cmn-Hans"><head><!-- Copyright 2017 by Jintongsoft
@author Ding <ding.yuchao@jintongsoft.cn> --><base href="<%=basePath%>"><meta charset="utf-8"><meta name="referrer" content="no-referrer"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="renderer" content="webkit"><meta name="keyword" content="金童云平台,金童,云平台,智能机器人"><link type="text/css" rel="stylesheet" href="//localhost:9243/74.css"><link type="text/css" rel="stylesheet" href="//localhost:9243/9.css"><title>金童智能客服云平台</title></head><body class="nav-md"><nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="./"><span class="primary-title">金童软件</span></a></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><a href="//www.jintongsoft.cn" target="_blank"><span class="primary-title">首页</span></a></li><li><a href="//openapi.jintongsoft.cn/qa" target="_blank"><span class="primary-title">社区</span></a></li><li><a href="//ta.jintongsoft.cn/" target="_blank"><span class="primary-title">TA情感社区</span></a></li><li><a href="//www.jintongsoft.cn/joinus.html" target="_blank"><span class="primary-title">加入我们</span></a></li><li><a href="${csclientUrl}68e84482012d42669c605187030e9e59" target="_blank"><span class="primary-title">智能客服体验</span></a></li><li><a href="./" target="_blank"><span class="primary-title">金童云平台</span></a></li></ul></div></div></nav><div class="container primary-container"><div class="reset-container"><div class="wizard_horizontal"><ul class="wizard_steps anchor"><li><a class="link1 selected" isdone="1" rel="1"><span class="step_no">1</span><span class="step_descr"><small>输入邮箱</small></span></a></li><li><a class="link2 disabled" isdone="1" rel="2"><span class="step_no">2</span><span class="step_descr"><small>进入邮箱验证</small></span></a></li><li><a class="link3 disabled" isdone="1" rel="3"><span class="step_no">3</span><span class="step_descr"><small>设置新密码</small></span></a></li><li><a class="link4 disabled" isdone="1" rel="4"><span class="step_no">4</span><span class="step_descr"><small>完成</small></span></a></li></ul></div><form class="step-form" id="form1" data-toggle="validator" role="form"><div class="form-group"><label class="control-label">请输入绑定的邮箱</label><input class="form-control" id="email" data-required-error="请输入邮箱" type="email" required><div class="help-block with-errors"></div></div><div class="form-group center"><button class="btn btn-success" id="next1" type="submit">下一步</button></div></form><form class="step-form" id="form2"><div class="info-wrap"><img src="images/icon_2.jpg"><div class="info"><h4>请您立即登录该邮箱，并按邮件中提示完成找回密码的操作。</h4><p>注意：如果您连续多次申请找回密码，请以最新收到的邮件为准！</p></div></div></form><form class="step-form" id="form3"><div class="form-group"><label class="control-label">用户名</label><input class="form-control" id="user" readonly data-required-error="请输入用户名" type="text" required><div class="help-block with-errors"></div></div><div class="form-group"><label class="control-label">请输入新的密码</label><input class="form-control" id="old-password" data-length data-required-error="请输入新密码" type="password" required><div class="help-block with-errors"></div></div><div class="form-group"><label class="control-label">再次输入新密码</label><input class="form-control" id="new-password" data-length data-match-error="两次密码输入不一致" data-match="#old-password" data-required-error="请再次输入新密码" type="password" required><div class="help-block with-errors"></div></div><div class="form-group center"><button class="btn btn-success" id="next3" type="submit">确定</button></div></form><form class="step-form" id="form4"><div class="info-wrap"><img src="images/img_18.gif"><div class="info"><h4>修改密码成功！</h4><p>为了保护您的账号安全，请重新登录。</p></div></div><div class="form-group center"><a class="btn btn-success" id="step-login" href="login">马上登陆</a></div></form></div></div><div id="particles"></div><script>var ctx="${ctx}";
var isVcg=${isVcg};</script><script src="//localhost:9243/74.js"></script><script>var username='${username}';
var activieId='${param.activieId}';</script><script src="//localhost:9243/9.js"></script><!--[if lte IE 9]>
<script src='${ctx}/module/placeholders/placeholders.jquery.min.js'></script>
<![endif]--></body></html>