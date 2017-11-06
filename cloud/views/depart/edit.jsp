<!DOCTYPE html><%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
  String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+ request.getContextPath() + "/";
%><c:set var="ctx" value="${pageContext.request.contextPath}"/><html lang="zh-cmn-Hans"><head><!-- Copyright 2016 by jintongsoft | @author: Ding (ding.yuchao@jintongsoft.cn)--><base href="<%=basePath%>"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="renderer" content="webkit"><meta name="keyword" content="金童云平台,金童,云平台,智能机器人"><link type="text/css" href="${ctx}/module/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link type="text/css" href="${ctx}/module/pnotify/pnotify.min.css" rel="stylesheet"><link type="text/css" href="${ctx}/module/font-awesome/css/font-awesome.min.css" rel="stylesheet"><link href="${ctx}/module/jstree/themes/default/style.min.css?1497490210702" rel="stylesheet" type="text/css"><script src="${ctx}/module/jquery/jquery.min.js?1497490210702"></script><script src="${ctx}/module/bootstrap/js/bootstrap.min.js?1497490210702"></script><script src="${ctx}/module/pnotify/pnotify.min.js?1497490210702"></script><script src="${ctx}/dist/common.js?1497490210702"></script><script>var ctx="${ctx}";</script><link href="${ctx}/module/DataTables/DataTables-1.10.15/css/dataTables.bootstrap.min.css?1497490210702" rel="stylesheet" type="text/css"><script src="${ctx}/module/DataTables/DataTables-1.10.15/js/jquery.dataTables.min.js?1497490210702"></script><script src="${ctx}/module/DataTables/Select-1.2.2/js/dataTables.select.min.js?1497490210702"></script><script src="${ctx}/js/bootstrap-dialog.min.js?1497490210702"></script><script src="${ctx}/module/pdfobject/pdfobject.js?1497490210702"></script><script src="${ctx}/module/videojs/video.min.js?1497490210702"></script><script src="${ctx}/module/jstree/jstree.min.js?1497490210702"></script><script>var sendid='${id}';
var directoryName='${document.directory.name}';
var directoryId='${document.directory.id}';
var sendparentid='${parentid}';
var senddocid = '${document.docid}';
var direct='${direct}';</script><script src="${ctx}/dist/depart/edit.js?1497490210702"></script><title>金童智能客服云平台</title></head><body class="nav-md"><div class="main_container"><div class="left_col"><div class="cloud-left-title"><a href="index"><i class="fa fa-cloud"></i><span>金童云平台</span></a></div><div class="cloud-profile"><div class="cloud-heading"><img class="img-circle cloud-heading-image" src="${ctx}${headicon}" alt="机器人头像"></div><div class="cloud-profile-info force-width"><h3>${appRead}</h3><h2>${user.nickname}</h2></div></div><div class="cloud-sidebar-menu"><ul class="cloud-menu-list" id="cloud-menu-list"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-home"></i><span class="cloud-menu-group-title-text">首页</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="index">欢迎页</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="index">欢迎页</a></li></c:if></ul></li><c:if test="${fn:contains(accesslist,'knowledge_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-book"></i><span class="cloud-menu-group-title-text">知识管理</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/review/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/review/index">语料审核</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/review/index">语料审核</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/editByA/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/editByA/index">语料管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/editByA/index">语料管理</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/dialog/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/dialog/index">对话管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/dialog/index">对话管理</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='paraphrase/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="paraphrase/index">复述生成</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="paraphrase/index">复述生成</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/documentAnalysis/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/documentAnalysis/index">文档分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/documentAnalysis/index">文档分析</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/classify/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/classify/index">分类管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/classify/index">分类管理</a></li></c:if><c:if test="${fn:contains(accesslist,'keyword_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='keyword/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="keyword/index">关键词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="keyword/index">关键词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'stopword_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='stopword/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="stopword/index">停用词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="stopword/index">停用词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'sensitiveWord_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/sensitive/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/sensitive/index">敏感词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/sensitive/index">敏感词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'synonyms_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/synonyms/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/synonyms/index">同义词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/synonyms/index">同义词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'knowledge_typo_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/typo/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/typo/index">错别字</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/typo/index">错别字</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'kbdocment_access')}"><li><div class="cloud-menu-group-title active"><i class="fa fa-fw cloud-menu-group-title-icon fa-database"></i><span class="cloud-menu-group-title-text">知识库管理</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group" style="display:block;"><c:if test="${fn:contains(accesslist,'depart_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='depart/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a class="current" href="depart/index">知识检索</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a class="current" href="depart/index">知识检索</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'depart_update')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='depart/allstatus'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="depart/allstatus">更新记录</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="depart/allstatus">更新记录</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'depart_filed')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='depart/filed'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="depart/filed">已归档知识</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="depart/filed">已归档知识</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'review_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='review/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="review/index">知识点审核</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="review/index">知识点审核</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'review_record')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='review/record'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="review/record">审核记录</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="review/record">审核记录</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'workflow_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='workflow/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="workflow/index">审核流程管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="workflow/index">审核流程管理</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'weixinv2_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-wechat"></i><span class="cloud-menu-group-title-text">微信矩阵</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'wechatCredential_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/index.do'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/index.do">公众号列表</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/index.do">公众号列表</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'wechatqyapp_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/enterprise/app/index.do'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/enterprise/app/index.do">应用列表</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/enterprise/app/index.do">应用列表</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'wechatMaterial_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/material/mediaHistory.do'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/material/mediaHistory.do">素材管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/material/mediaHistory.do">素材管理</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'wechatGroup_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/broadcast/index.do'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/broadcast/index.do">群发记录</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/broadcast/index.do">群发记录</a></li></c:if></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/broadcast/index.to'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/broadcast/index.to">图文数据统计</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/broadcast/index.to">图文数据统计</a></li></c:if><c:if test="${fn:contains(accesslist,'wechatGroup_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/group/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/group/index">用户管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/group/index">用户管理</a></li></c:if></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/menu/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/menu/index">自定义菜单</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/menu/index">自定义菜单</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'quickConnect_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-puzzle-piece"></i><span class="cloud-menu-group-title-text">快捷对接</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'wechatQA_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/qaconnection'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/qaconnection">微信对接</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/qaconnection">微信对接</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'quickWeibo_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weibo/main'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weibo/main">微博</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weibo/main">微博</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'openapi_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='api/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="api/index">金童OPEN API</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="api/index">金童OPEN API</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'spss_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-bar-chart-o"></i><span class="cloud-menu-group-title-text">运营统计</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'spssLog_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/log'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/log">消息数据分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/log">消息数据分析</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'clientInfo_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/clientInfo'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/clientInfo">用户数据分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/clientInfo">用户数据分析</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'clientType_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/clientTypeInfo'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/clientTypeInfo">问题特征分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/clientTypeInfo">问题特征分析</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'clientType_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/feedback'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/feedback">用户评价分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/feedback">用户评价分析</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'cssession_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/cs/csstat'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/cs/csstat">人工客服统计</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/cs/csstat">人工客服统计</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'app_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-cogs"></i><span class="cloud-menu-group-title-text">应用配置</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'appInfo_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='setting/app/basicInfo/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="setting/app/basicInfo/index">智能机器人配置</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="setting/app/basicInfo/index">智能机器人配置</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'superadmin_qa_setting_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='superadmin/qa_setting/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="superadmin/qa_setting/index">系统调优</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="superadmin/qa_setting/index">系统调优</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'cs_server_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='setting/cs/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="setting/cs/index">客服管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="setting/cs/index">客服管理</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'faq_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='setting/faq/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="setting/faq/index">常见问题</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="setting/faq/index">常见问题</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'appuser_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-user"></i><span class="cloud-menu-group-title-text">应用成员管理</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'appuser_list')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='user/app/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="user/app/index">成员列表</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="user/app/index">成员列表</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'appuser_manager')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='user/app/role'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="user/app/role">成员角色</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="user/app/role">成员角色</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'customize_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-wrench"></i><span class="cloud-menu-group-title-text">定制功能</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'manualReply_func')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='manual_reply/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="manual_reply/index">人工回复</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="manual_reply/index">人工回复</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'personalLetter_func')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='personalLetter/expert'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="personalLetter/expert">@专家回复</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="personalLetter/expert">@专家回复</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'interview_func')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='expertInterviews/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="expertInterviews/index">访谈一览</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="expertInterviews/index">访谈一览</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'recommendList')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='recommend/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="recommend/index">推荐问题</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="recommend/index">推荐问题</a></li></c:if></c:if></ul></li></c:if></ul></div></div><nav class="navbar navbar-default cloud-top-nav"><div class="container-fluid"><div class="navbar-header"><div class="navbar-brand"><a id="menu_toggle" href="javascript:;" style="padding:15px 0 0 15px;"><i class="fa fa-bars"></i></a><span class="cloud-top-title" style="font-size: 18px;padding-left:8px;opacity: 0.7;color: #555;position: relative;top: -2px;">${title}</span></div></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><c:if test="${usertype=='admin'}"><a href="${ctx}/superadmin/user/index" target="_blank">超级管理员</a></c:if></li><li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'online_test')}"><a href="${csclientUrl}${appKey}" target="_blank">在线体验</a></c:if></li><li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'connect_manual')}"><a href="${csserverUrl}${appKey}" target="_blank">人工客服接入</a></c:if></li><li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'train_robot')}"><a href="${ctx}/knowledge/training" target="_blank">训练机器人</a></c:if></li><li><c:if test="${applicationOnly==false }"><a href="${ctx}/appswitch">切换应用</a></c:if></li><li><a class="dropdown-toggle" data-toggle="dropdown" href="javascript:;" aria-expanded="false">&nbsp;&nbsp;${user.nickname}<span class="fa fa-angle-down"></span></a><ul class="dropdown-menu"><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'help_top')}"><li><a href="uploadFile/help.pdf" target="_blank">帮助中心</a></li></c:if><li class="divider"></li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'pwd_edit')}"><li><a href="user/pwd">修改密码</a></li></c:if><li><a href="${ctx}/logout">退出</a></li></ul></li></ul></div></div></nav><div class="right_col" id="right_col" role="main"><div class="x_panel"><div class="x_content"><div class="big-title"><c:if test="${empty id}">新增知识点</c:if><c:if test="${status==1||status==3}">修改知识点</c:if><c:if test="${status==2}">更新知识点</c:if></div><div class="process-bar-wrap"><div class="process-bar"><div class="process-item-1"><div class="process-top"><div class="process-circle">1</div><div class="process-line"></div></div></div><div class="process-item-2"><div class="process-top"><div class="process-circle">2</div><div class="process-line"></div></div></div></div></div><div class="process-context-wrap"><div class="process-context"><div class="process-bottom-left">完善知识点</div><div class="process-bottom-right"><c:if test="${empty id}">完成新增</c:if><c:if test="${status==1||status==3}">完成修改</c:if><c:if test="${status==2}">完成更新</c:if></div></div></div><div class="form-wrap"><form class="form"><div class="form-text-wrap"><label class="form-item"><i class="image-wrap"><img src="images/redstar.png"></i>标题<c:if test="${empty id}"><input class="input" id="title" type="text" placeholder="请输入标题"></c:if><c:if test="${!empty id}"><input class="input" id="title" type="text" placeholder="请输入标题" value="${document.title}" disabled="true"></c:if></label><label class="form-item"><i class="image-wrap"><img src="images/redstar.png"></i>作者<c:if test="${empty id}"><input class="input" id="author" type="text" placeholder="请输入文档作者"></c:if><c:if test="${!empty id}"><input class="input" id="author" type="text" placeholder="请输入文档作者" value="${document.author}"></c:if></label><label class="form-item"><i class="image-wrap"><img src="images/redstar.png"></i>标签<c:if test="${empty id}"><input class="input" id="tag" type="text" placeholder="请输入标签，多个标签用分号隔开"></c:if><c:if test="${!empty id}"><input class="input" id="tag" type="text" placeholder="请输入标签，多个标签用分号隔开" value="${labels}"></c:if></label><label class="form-item"><i class="image-wrap"><img src="images/redstar.png"></i>分类<c:if test="${empty id}"><select class="select" id="type"><c:forEach var="classvalue" items="${classifys}"><option class="classify" name="${classvalue.value}" value="${classvalue.id}">${classvalue.value}</option></c:forEach></select></c:if><c:if test="${!empty id}"><select class="select" id="type"><c:forEach var="classvalue" items="${classifys}"><c:if test="${document.classify.id==classvalue.id}"><option class="classify" name="${classvalue.value}" value="${classvalue.id}" selected="selected">${classvalue.value}</option></c:if><c:if test="${document.classify.id!=classvalue.id}"><option class="classify" name="${classvalue.value}" value="${classvalue.id}">${classvalue.value}</option></c:if></c:forEach></select></c:if></label><label class="form-item special"><i class="image-wrap"><img src="images/redstar.png" style="visibility:hidden;"></i>目录<div class="cloud-select-tree form-control input" id="classify"></div></label><label class="form-item"><i class="image-wrap"><img class="last" src="images/redstar.png"></i>内容<c:if test="${empty id}"><textarea class="input" id="content" placeholder="请输入词条内容"></textarea></c:if><c:if test="${!empty id}"><textarea class="input" id="content" placeholder="请输入词条内容">${document.content}</textarea></c:if></label></div><div class="form-file-wrap"><div class="add-file-btn-wrap"><span class="add-file-text">知识点附件</span><label class="add-file-label">添加附件<input id="add-file" type="file" value="添加附件"></label></div><div class="add-file-content-wrap"><c:if test="${!empty id}"><c:if test="${!empty attachments}"><c:forEach var="attachment" items="${attachments}" varStatus="status"><div class="add-file-content-item" data-id="${attachment.id}" data-type="old"><div class="content-left col-xs-2"><span>附件<span class="file-index">${status.count}</span></span></div><div class="content-middle col-xs-4"><img class="file-icon" src="images/types/${attachment.type}.png"><a class="file-name" href="#" data-url="docfile/download?type=${attachment.type}&amp;filename=${attachment.filename}&amp;attachid=${attachment.attachid}" data-file-type="${attachment.type}">${attachment.filename}</a></div><div class="content-size-wrap col-xs-4">(<span class="file-size"><c:choose><c:when test="${Math.round(attachment.filesize/1024)==0}">${attachment.filesize}B</c:when><c:otherwise>${Math.round(attachment.filesize/1024)}KB</c:otherwise></c:choose></span>)</div><div class="content-delete-wrap col-xs-2"><span class="file-delete">删除</span></div></div></c:forEach></c:if></c:if></div></div><div class="associate-wrap"><div class="associate-btn-wrap"><span class="associate-text">关联知识点</span><button class="btn btn-primary btn-sm" id="associate" type="button">关联知识点</button></div><div class="associate-content-wrap"><c:if test="${!empty parent}"><div class="associate-content-item" data-id="${parent.id}"><div class="content-left col-xs-2"><span>父知识点</span></div><div class="content-id col-xs-4"><span class="associate-id">${parent.docid}</span></div><div class="content-name col-xs-4"><a class="associate-name" href="depart/detail?id=${parent.id}" target="_blank">${parent.title}</a></div><div class="content-delete-wrap col-xs-2"><span class="associate-delete">删除</span></div></div></c:if></div></div><div class="form-complete-wrap"><button class="btn btn-primary btn-sm" id="save" type="button">暂存知识点</button><button class="btn btn-primary btn-sm" id="sure" type="button"><c:if test="${empty id}">提交至审核</c:if><c:if test="${status==1||status==3}">确认修改</c:if><c:if test="${status==2}">确认更新</c:if></button></div></form><div class="new-content" style="display:none;"><div class="img-info-wrap"><img src="images/duigou.png"><span class="img-info-text"><c:if test="${empty id}">知识点已完成新增，请耐心等待管理员审核</c:if><c:if test="${status==1||status==3}">知识点修改申请已提交，请耐心等待管理员审核</c:if><c:if test="${status==2}">知识点更新申请已提交，请耐心等待管理员审核</c:if></span></div><div class="form-after-sure-wrap"><c:if test="${empty id||status==2||status==3}"><button class="btn btn-primary btn-sm" id="continue-modify" type="button" style="margin-right:27px;">继续修改</button></c:if><c:if test="${empty id}"><button class="btn btn-primary btn-sm" id="continue-add" type="button">继续新增</button></c:if><button class="btn btn-default btn-sm" id="check" type="button" data-id="${id}"><c:if test="${empty id}">查看内容</c:if><c:if test="${status==1||status==3}">查看内容</c:if><c:if test="${status==2}">查看内容</c:if></button></div></div></div><c:if test="${not empty olddocument}"><c:if test="${status != 4}"><div class="zz-preview"><h4>上一版本</h4><table><thead><tr><th class="col-xs-2">版本</th><th class="col-xs-2">名称</th><th class="col-xs-2">分类</th><th class="col-xs-2">主编</th><th class="col-xs-2">上传时间</th></tr></thead><tbody><tr><td class="col-xs-2">V${olddocument.version}</td><td class="col-xs-2">${olddocument.title}</td><td class="col-xs-2">${olddocument.classify.value}</td><td class="col-xs-2">${olddocument.creator}</td><td class="col-xs-2"><fmt:formatDate value="${olddocument.createtime}" pattern="yyyy-MM-dd HH:mm:ss"></fmt:formatDate></td></tr></tbody></table><div class="attachment-wrap"><c:forEach var="attachments" varStatus="status" items="${oldattachments}"><div class="file-content-item"><div class="content-left col-xs-1"><span>附件<span class="file-index">${status.count}</span></span></div><div class="content-middle col-xs-4"><img class="file-icon" src="images/types/${attachments.type}.png"><a href="#"><a class="file-name col-xs-8" href="#" data-url="docfile/download?type=${attachments.type}&amp;filename=${attachments.filename}&amp;attachid=${attachments.attachid}" data-file-type="${attachments.type}">${attachments.filename}</a></a></div><div class="content-size-wrap col-xs-7"><span class="file-size">(</span><c:choose><c:when test="${attachments.filesize lt 1024}">${attachments.filesize}B</c:when><c:otherwise><fmt:parseNumber integerOnly="true" value="${attachments.filesize/1024}"></fmt:parseNumber>KB</c:otherwise></c:choose>)</div></div></c:forEach></div></div></c:if></c:if></div></div></div><footer class="footer" id="footer"><p class="pull-right"><a href="${ctx}">金童软件&nbsp;Jintong Software&nbsp;</a><span class="lead"><i class="fa fa-cloud"></i> 云平台系统</span></p></footer></div><!--[if lte IE 9]>
<script src='${ctx}/module/placeholders/placeholders.jquery.min.js'></script>
<![endif]--></body></html>