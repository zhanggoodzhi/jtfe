<!DOCTYPE html><%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
  String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+ request.getContextPath() + "/";
%><c:set var="ctx" value="${pageContext.request.contextPath}"/><html lang="zh-cmn-Hans"><head><!-- Copyright 2017 by Jintongsoft
@author Ding <ding.yuchao@jintongsoft.cn> --><base href="<%=basePath%>"><meta charset="utf-8"><meta name="referrer" content="no-referrer"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="renderer" content="webkit"><meta name="keyword" content="金童云平台,金童,云平台,智能机器人"><link type="text/css" rel="stylesheet" href="//localhost:9000/51.css"><link type="text/css" rel="stylesheet" href="//localhost:9000/33.css"><title>金童智能客服云平台</title></head><body><nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="./"><span class="primary-title">金童软件</span></a></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><a href="//www.jintongsoft.cn" target="_blank"><span class="primary-title">首页</span></a></li><li><a href="//openapi.jintongsoft.cn/qa" target="_blank"><span class="primary-title">社区</span></a></li><li><a href="//ta.jintongsoft.cn/" target="_blank"><span class="primary-title">TA情感社区</span></a></li><li><a href="//www.jintongsoft.cn/joinus.html" target="_blank"><span class="primary-title">加入我们</span></a></li><li><a href="${csclientUrl}68e84482012d42669c605187030e9e59" target="_blank"><span class="primary-title">智能客服体验</span></a></li><li><a href="./" target="_blank"><span class="primary-title">金童云平台</span></a></li></ul></div></div></nav><div class="container primary-container"></div><div id="particles"></div><script>var ctx="${ctx}";</script><script src="//localhost:9000/51.js"></script><script>var selectData = ${classifys};</script><script src="//localhost:9000/33.js"></script><!--[if lte IE 9]>
<script src='${ctx}/module/placeholders/placeholders.jquery.min.js'></script>
<![endif]--></body></html>