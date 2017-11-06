<!DOCTYPE html><%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
  String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+ request.getContextPath() + "/";
%><c:set var="ctx" value="${pageContext.request.contextPath}"/><c:set var="isVcg" value="${sessionScope.accessKey=='pre.dam.vcg.com'}"/><html lang="zh-cmn-Hans"><head><!-- Copyright 2017 by Jintongsoft
@author Ding <ding.yuchao@jintongsoft.cn> --><base href="<%=basePath%>"><meta charset="utf-8"><meta name="referrer" content="no-referrer"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="renderer" content="webkit"><meta name="keyword" content="金童云平台,金童,云平台,智能机器人"><link type="text/css" rel="stylesheet" href="//localhost:9243/74.css"><link type="text/css" rel="stylesheet" href="//localhost:9243/34.css"><title>金童智能客服云平台</title></head><body class="nav-md"><div class="main_container"><div class="left_col"><div class="cloud-left-title"><a href="index"><i class="fa fa-cloud"></i><span>金童云平台</span></a></div><div class="cloud-profile"><div class="cloud-heading"><img class="img-circle cloud-heading-image" src="${ctx}${headicon}" alt="机器人头像"></div><div class="cloud-profile-info force-width"><h3>${appRead}</h3><h2>${user.nickname}</h2></div></div><div class="cloud-sidebar-menu"><ul class="cloud-menu-list" id="cloud-menu-list"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-home"></i><span class="cloud-menu-group-title-text">首页</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="index">欢迎页</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="index">欢迎页</a></li></c:if></ul></li><c:if test="${fn:contains(accesslist,'knowledge_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-book"></i><span class="cloud-menu-group-title-text">知识管理</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/corpus/review/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/corpus/review/index">语料审核</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/corpus/review/index">语料审核</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/corpus/audit/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/corpus/audit/index">无答案问题</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/corpus/audit/index">无答案问题</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/corpusManage/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/corpusManage/index">语料管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/corpusManage/index">语料管理</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/material/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/material/index">语料素材</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/material/index">语料素材</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/dialog/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/dialog/index">对话管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/dialog/index">对话管理</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='paraphrase/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="paraphrase/index">复述生成</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="paraphrase/index">复述生成</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/qaOnDocument/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/qaOnDocument/index">文本分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/qaOnDocument/index">文本分析</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/documentAnalysis/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/documentAnalysis/index">文档分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/documentAnalysis/index">文档分析</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/classify/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/classify/index">分类管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/classify/index">分类管理</a></li></c:if><c:if test="${fn:contains(accesslist,'keyword_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='keyword/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="keyword/index">关键词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="keyword/index">关键词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'stopword_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='stopword/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="stopword/index">停用词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="stopword/index">停用词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'sensitiveWord_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/sensitive/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/sensitive/index">敏感词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/sensitive/index">敏感词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'synonyms_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/synonyms/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/synonyms/index">同义词</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/synonyms/index">同义词</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'knowledge_typo_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='knowledge/typo/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="knowledge/typo/index">错别字</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="knowledge/typo/index">错别字</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'kbdocment_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-database"></i><span class="cloud-menu-group-title-text">知识库管理</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'depart_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='depart/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="depart/index">知识检索</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="depart/index">知识检索</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'depart_update')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='depart/allstatus'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="depart/allstatus">更新记录</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="depart/allstatus">更新记录</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'depart_filed')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='depart/filed'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="depart/filed">已归档知识</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="depart/filed">已归档知识</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'review_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='review/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="review/index">知识点审核</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="review/index">知识点审核</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'review_record')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='review/record'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="review/record">审核记录</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="review/record">审核记录</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'workflow_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='workflow/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="workflow/index">审核流程管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="workflow/index">审核流程管理</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'weixinv2_access')}"><li><div class="cloud-menu-group-title active"><i class="fa fa-fw cloud-menu-group-title-icon fa-wechat"></i><span class="cloud-menu-group-title-text">微信矩阵</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group" style="display:block;"><c:if test="${fn:contains(accesslist,'wechatCredential_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/index.do'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/index.do">公众号列表</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/index.do">公众号列表</a></li></c:if></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/enterprise/app/index.do'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/enterprise/app/index.do">应用列表</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/enterprise/app/index.do">应用列表</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/material/mediaHistory/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/material/mediaHistory/index">素材管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/material/mediaHistory/index">素材管理</a></li></c:if><c:if test="${fn:contains(accesslist,'wechatGroup_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/broadcast/index.do'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/broadcast/index.do">群发记录</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/broadcast/index.do">群发记录</a></li></c:if></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/broadcast/index.to'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a class="current" href="weixinv2/broadcast/index.to">图文数据统计</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a class="current" href="weixinv2/broadcast/index.to">图文数据统计</a></li></c:if><c:if test="${fn:contains(accesslist,'wechatGroup_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/group/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/group/index">粉丝管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/group/index">粉丝管理</a></li></c:if></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/menu/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/menu/index">自定义菜单</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/menu/index">自定义菜单</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'quickConnect_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-puzzle-piece"></i><span class="cloud-menu-group-title-text">快捷对接</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'wechatQA_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weixinv2/qaconnection'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weixinv2/qaconnection">微信对接</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weixinv2/qaconnection">微信对接</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'quickWeibo_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='weibo/main'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="weibo/main">微博</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="weibo/main">微博</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'openapi_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='api/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="api/index">金童OPEN API</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="api/index">金童OPEN API</a></li></c:if></c:if></ul></li></c:if><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-bar-chart-o"></i><span class="cloud-menu-group-title-text">统计分析</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/dataScreening/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/dataScreening/index">数据总览</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/dataScreening/index">数据总览</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/msgData/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/msgData/index">消息数据</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/msgData/index">消息数据</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/userData/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/userData/index">用户数据</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/userData/index">用户数据</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/satisfactionAnalysis/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/satisfactionAnalysis/index">满意度分析</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/satisfactionAnalysis/index">满意度分析</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/feedbackRate/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/feedbackRate/index">应答好评率</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/feedbackRate/index">应答好评率</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/sessionLog/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/sessionLog/index">会话记录</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/sessionLog/index">会话记录</a></li></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='spss/staffService/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="spss/staffService/index">人工客服统计</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="spss/staffService/index">人工客服统计</a></li></c:if></ul></li><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-envelope-o"></i><span class="cloud-menu-group-title-text">访客留言</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='cs/guestBook/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="cs/guestBook/index">访客留言</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="cs/guestBook/index">访客留言</a></li></c:if></ul></li><c:if test="${fn:contains(accesslist,'app_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-cogs"></i><span class="cloud-menu-group-title-text">应用配置</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'appInfo_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='setting/app/basicInfo/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="setting/app/basicInfo/index">智能机器人配置</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="setting/app/basicInfo/index">智能机器人配置</a></li></c:if></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='setting/cs/index2'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="setting/cs/index2">客服配置</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="setting/cs/index2">客服配置</a></li></c:if><c:if test="${fn:contains(accesslist,'superadmin_qa_setting_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='superadmin/qa_setting/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="superadmin/qa_setting/index">系统调优</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="superadmin/qa_setting/index">系统调优</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'cs_server_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='setting/cs/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="setting/cs/index">客服管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="setting/cs/index">客服管理</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'faq_access')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='setting/faq/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="setting/faq/index">常见问题</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="setting/faq/index">常见问题</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'appuser_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-user"></i><span class="cloud-menu-group-title-text">应用成员管理</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'appuser_list')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='user/app/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="user/app/index">成员列表</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="user/app/index">成员列表</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'appuser_manager')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='user/app/role'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="user/app/role">角色管理</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="user/app/role">角色管理</a></li></c:if></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist,'customize_access')}"><li><div class="cloud-menu-group-title"><i class="fa fa-fw cloud-menu-group-title-icon fa-wrench"></i><span class="cloud-menu-group-title-text">定制功能</span><i class="fa fa-chevron-down"></i></div><ul class="cloud-menu-group"><c:if test="${fn:contains(accesslist,'manualReply_func')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='manual_reply/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="manual_reply/index">人工回复</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="manual_reply/index">人工回复</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'personalLetter_func')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='personalLetter/expert'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="personalLetter/expert">@专家回复</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="personalLetter/expert">@专家回复</a></li></c:if></c:if><c:if test="${fn:contains(accesslist,'interview_func')}"><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='expertInterviews/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="expertInterviews/index">访谈一览</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="expertInterviews/index">访谈一览</a></li></c:if></c:if><c:set var="sign" value="${null}"></c:set><c:forEach var="menu" items="${menuSigns}"><c:if test="${menu.url=='recommend/index'}"><c:set var="sign" value="${menu}"></c:set></c:if></c:forEach><c:if test="${sign==null}"><li class="cloud-menu-item"><a href="recommend/index">推荐问题</a></li></c:if><c:if test="${sign!=null}"><li class="cloud-menu-item cloud-menu-sign" data-type="${menu.type}" data-num="${menu.num}"><a href="recommend/index">推荐问题</a></li></c:if></ul></li></c:if></ul></div></div><nav class="navbar navbar-default cloud-top-nav"><div class="container-fluid"><div class="navbar-header"><div class="navbar-brand"><a id="menu_toggle" href="javascript:;" style="padding:15px 0 0 15px;"><i class="fa fa-bars"></i></a><span class="cloud-top-title" style="font-size: 18px;padding-left:8px;opacity: 0.7;color: #555;position: relative;top: -2px;">${title}</span></div></div><div class="collapse navbar-collapse"><ul class="nav navbar-nav navbar-right"><li><c:if test="${usertype=='admin'}"><a href="${ctx}/superadmin/user/index" target="_blank"><i class="fa fa-user"></i>超级管理员</a></c:if></li><li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'online_test')}"><a href="${csclientUrl}${appKey}" target="_blank"><i class="fa fa-comments-o"></i>在线体验</a></c:if></li><li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'connect_manual')}"><a href="${csserverUrl}${appKey}" target="_blank"><i class="fa fa-headphones"></i>人工客服接入</a></c:if></li><li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'train_robot')}"><a href="${ctx}/knowledge/training" target="_blank"><i class="fa fa-rocket"></i>训练机器人</a></c:if></li><li><c:if test="${applicationOnly==false }"><a href="${ctx}/appswitch"><i class="fa fa-th"></i>切换应用</a></c:if></li><li><a class="dropdown-toggle export-main-sign" data-toggle="dropdown" href="javascript:;" aria-expanded="false"><i class="fa fa-cogs"></i>&nbsp;&nbsp;${user.adminName}<span class="fa fa-angle-down"></span><c:if test="${hasNewExport}"><span style="width:8px;height:8px;border-radius:50%;background-color:#e51c23;display:inline-block;position:absolute;top:10px;right:20px;"></span></c:if></a><ul class="dropdown-menu"><li class="export-sign"><c:if test="${hasNewExport}"><span style="width:8px;height:8px;border-radius:50%;background-color:#e51c23;display:inline-block;position:absolute;top:17px;left:5px;"></span></c:if><a href="${ctx}/knowledge/corpus/export/index">导出记录</a></li><li class="divider"></li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'help_top')}"><li><a href="uploadFile/help.pdf" target="_blank">帮助中心</a></li></c:if><li class="divider"></li><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'pwd_edit')}"><li><a href="user/pwd">修改密码</a></li></c:if><li><a href="${ctx}/logout">退出</a></li></ul></li></ul></div></div></nav><div class="right_col" id="right_col" role="main"><div class="x_panel"><div class="x_content"><div class="cloud-search-area"><form class="form-horizontal"><div class="cloud-row clearfix"><div class="form-group"><label class="cloud-input-title">标题</label><div class="cloud-input-content"><input class="form-control input-sm" id="title" type="text"></div></div><div class="form-group"><label class="cloud-input-title">公众号</label><div class="cloud-input-content cloud-lg"><select class="select form-control" id="weixin-account"></select></div></div><div class="form-group"><label class="cloud-input-title">发送时间</label><div class="cloud-input-content cloud-md"><input class="form-control input-sm" id="form-date" type="text" readonly></div></div><div class="form-group"><button class="btn btn-primary btn-sm" id="search-btn" type="button">查询</button><button class="btn btn-primary btn-sm" id="count-btn" type="button">合计</button><button class="btn btn-primary btn-sm" id="export-btn" type="button">导出</button></div><div class="form-group pull-right"><label class="cloud-input-title">每页显示</label><div class="cloud-input-content cloud-sm"><select class="form-control input-sm" id="page-change"><option value="20">20</option><option value="50">50</option><option value="100">100</option></select></div><label class="cloud-input-title">条数据</label></div></div></form></div><div class="cloud-row"><table class="table fixed-table" id="table"></table></div></div></div></div><footer class="footer" id="footer"><p class="pull-right"><a href="${ctx}">金童软件&nbsp;Jintong Software&nbsp;</a><span class="lead"><i class="fa fa-cloud"></i> 云平台系统</span></p></footer></div><div class="modal fade" id="count-modal" data-backdrop="false"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title"></h4></div><div class="modal-body"><form class="form-horizontal"><div class="form-group"><label class="cloud-input-title title-width"> 总送达人员</label><div class="cloud-input-content1 targetUsers"></div></div><div class="form-group"><label class="cloud-input-title title-width"> 总阅读数</label><div class="cloud-input-content1 pageReadCounts"></div></div><div class="form-group"><label class="cloud-input-title title-width">总查看原文数</label><div class="cloud-input-content1 oripageReadCounts"></div></div><div class="form-group"><label class="cloud-input-title title-width">总分享数</label><div class="cloud-input-content1 shareCounts"></div></div><div class="form-group"><label class="cloud-input-title title-width">总收藏数</label><div class="cloud-input-content1 favCounts"></div></div><div class="form-group"><label class="cloud-input-title title-width">总新增用户数</label><div class="cloud-input-content1 countNewUsers"></div></div><div class="form-group"><label class="cloud-input-title title-width">总取关数</label><div class="cloud-input-content1 countCancelUsers"></div></div></form></div></div></div></div><script>var ctx="${ctx}";
var isVcg=${isVcg};</script><script src="//localhost:9243/74.js"></script><script>var selectData=JSON.parse('${output}'.replace(/wxName/g,'text'));
var status=selectData[0].status;
var wechatCredentials=selectData[0].wechatCredentials;</script><script src="//localhost:9243/34.js"></script><!--[if lte IE 9]>
<script src='${ctx}/module/placeholders/placeholders.jquery.min.js'></script>
<![endif]--></body></html>