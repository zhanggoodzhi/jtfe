<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<% String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+ request.getContextPath() + "/";%><!DOCTYPE html><html lang="zh-cmn-Hans"><head><c:set var="ctx" value="${pageContext.request.contextPath}"></c:set><base href="<%=basePath%>"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="renderer" content="webkit"><link href="${ctx}/module/bootstrap/css/bootstrap.min.css?version=1474960583321" rel="stylesheet" type="text/css"><link href="${ctx}/module/pnotify/pnotify.min.css?version=1474960583321" rel="stylesheet" type="text/css"><link href="${ctx}/fonts/css/font-awesome.min.css?version=1474960583321" rel="stylesheet" type="text/css"><link href="${ctx}/module/custom/custom.css?version=1474960583321" rel="stylesheet" type="text/css"><script src="${ctx}/module/js-core/shim.min.js?version=1474960583321"></script><script src="${ctx}/module/jquery/jquery.min.js?version=1474960583321"></script><script src="${ctx}/module/bootstrap/js/bootstrap.min.js?version=1474960583321"></script><script src="${ctx}/module/nicescroll/jquery.nicescroll.min.js?version=1474960583321"></script><script src="${ctx}/module/pnotify/pnotify.min.js?version=1474960583321"></script><script src="${ctx}/dist/common.js?version=1474960583321"></script><script>var ctx="${ctx}";</script><script src="${ctx}/dist/directory/index.js?version=1474960583321"></script><title>金童智能客服云平台</title></head><body class="nav-md"><div class="container body"><div class="main_container"><div class="col-md-3 left_col"><div class="left_col scroll-view"><div class="navbar nav_title" style="border: 0"><a class="site_title" href="index"><i class="fa fa-cloud"></i><span>金童云平台</span></a></div><div class="profile"><div class="profile_pic"><img class="img-circle profile_img" src="/cloud${headicon}"></div><div class="profile_info"><span>${appRead}</span><h2>${user.nickname}</h2></div></div><div class="clearfix"></div><div class="main_menu_side hidden-print main_menu" id="sidebar-menu"><div class="menu_section"><ul class="nav side-menu" id="side-menu"><li><a href="javascript:;"><i class="fa fa-home"></i> 首页 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><li><a href="index">欢迎页</a></li></ul></li><c:if test="${fn:contains(accesslist, 'knowledge_access')}"><li><a href="javascript:;"><i class="fa fa-book"></i> 知识管理 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><li><a href="knowledge/editByA/index">语料管理</a></li><li><a href="knowledge/dialog/index">对话管理</a></li><c:if test="${fn:contains(accesslist, 'paraphrase_access')}"><li><a href="paraphrase/index">复述生成</a></li></c:if><c:if test="${fn:contains(accesslist, 'keyword_access')}"><li><a href="keyword/index">关键词</a></li></c:if><c:if test="${fn:contains(accesslist, 'synonyms_access')}"><li><a href="knowledge/synonyms/index">同义词</a></li></c:if><c:if test="${fn:contains(accesslist, 'stopword_access')}"><li><a href="stopword/index">停用词</a></li></c:if><c:if test="${fn:contains(accesslist, 'sensitiveWord_access')}"><li><a href="knowledge/sensitive/index">敏感词</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist, 'knowledge_access')}"><li><a href="javascript:;"><i class="fa fa-database"></i> 知识库管理 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><c:if test="${fn:contains(accesslist, 'depart_access')}"><li><a href="depart/index">部门知识库</a></li></c:if><c:if test="${fn:contains(accesslist, 'depart_update')}"><li><a href="depart/allstatus">更新记录</a></li></c:if><c:if test="${fn:contains(accesslist, 'depart_filed')}"><li><a href="depart/filed">已归档知识</a></li></c:if><c:if test="${fn:contains(accesslist, 'review_access')}"><li><a href="review/index">知识点审核</a></li></c:if><c:if test="${fn:contains(accesslist, 'review_record')}"><li><a href="review/record">审核记录</a></li></c:if><c:if test="${fn:contains(accesslist, 'workflow_access')}"><li><a href="workflow/index">审核流程管理</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist, 'weixinv2_access')}"><li><a href="javascript:;"><i class="fa fa-wechat"></i> 微信矩阵 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><c:if test="${fn:contains(accesslist, 'wechatCredential_access')}"><li><a href="weixinv2/index.do">公众号列表</a></li></c:if><c:if test="${fn:contains(accesslist, 'wechatMaterial_access')}"><li><a href="weixinv2/material/mediaHistory.do">素材管理</a></li></c:if><c:if test="${fn:contains(accesslist, 'wechatGroup_access')}"><li><a href="weixinv2/broadcast/index.do">群发记录</a></li></c:if><c:if test="${fn:contains(accesslist, 'wechatGroup_access')}"><li><a href="weixinv2/group/index">用户管理</a></li></c:if><li><a href="weixinv2/menu/index">自定义菜单</a></li></ul></li></c:if><c:if test="${fn:contains(accesslist, 'quickConnect_access')}"><li><a href="javascript:;"><i class="fa fa-puzzle-piece"></i> 快捷对接 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><c:if test="${fn:contains(accesslist, 'wechatQA_access')}"><li><a href="weixinv2/qaconnection">微信对接</a></li></c:if><c:if test="${fn:contains(accesslist, 'quickWeibo_access')}"><li><a href="weibo/main">微博</a></li></c:if><c:if test="${fn:contains(accesslist, 'openapi_access')}"><li><a href="api/index">金童OPEN API</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist, 'spss_access')}"><li><a href="javascript:;"><i class="fa fa-bar-chart-o"></i> 运营统计 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><c:if test="${fn:contains(accesslist, 'spssLog_access')}"><li><a href="spss/log">消息数据分析</a></li></c:if><c:if test="${fn:contains(accesslist, 'clientInfo_access')}"><li><a href="spss/clientInfo">用户数据分析</a></li></c:if><c:if test="${fn:contains(accesslist, 'clientType_access')}"><li><a href="spss/clientTypeInfo">问题特征分析</a></li></c:if><c:if test="${fn:contains(accesslist, 'clientType_access')}"><li><a href="spss/feedback">用户评价分析</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist, 'app_access')}"><li><a href="javascript:;"><i class="fa fa-cogs"></i> 应用配置 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><c:if test="${fn:contains(accesslist, 'appInfo_access')}"><li><a href="app/updateAppInfo">智能机器人配置</a></li></c:if><c:if test="${fn:contains(accesslist, 'account_access')}"><li><a href="account/accountManager">客服人员管理</a></li></c:if><c:if test="${fn:contains(accesslist, 'document_access')}"><li><a href="document/documentManager">客服资料管理</a></li></c:if><c:if test="${fn:contains(accesslist, 'faq_access')}"><li><a href="faq/index">常见问题</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist, 'appuser_access')}"><li><a href="javascript:;"><i class="fa fa-user"></i> 应用成员管理 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><c:if test="${fn:contains(accesslist, 'appuser_list')}"><li><a href="user/app/index">成员列表</a></li></c:if><c:if test="${fn:contains(accesslist, 'appuser_manager')}"><li><a href="user/app/role">成员角色</a></li></c:if></ul></li></c:if><c:if test="${fn:contains(accesslist, 'customize_access')}"><li><a href="javascript:;"><i class="fa fa-wrench"></i> 定制功能 <span class="fa fa-chevron-down"></span></a><ul class="nav child_menu"><c:if test="${fn:contains(accesslist, 'manualReply_func')}"><li><a href="manual_reply/index">人工回复</a></li></c:if><c:if test="${fn:contains(accesslist, 'personalLetter_func')}"><li><a href="personalLetter/expert">@专家回复</a></li></c:if><c:if test="${fn:contains(accesslist, 'interview_func')}"><li><a href="expertInterviews/index">访谈一览</a></li></c:if><c:if test="${fn:contains(accesslist, 'recommendList')}"><li><a href="knowledge/recommendList">推荐问题</a></li></c:if></ul></li></c:if></ul></div></div></div></div><div class="top_nav"><div class="nav_menu"><nav role="navigation"><div class="nav toggle"><a id="menu_toggle"><i class="fa fa-bars"></i></a><span class="h4 title-alignment">${title}</span></div><ul class="nav navbar-nav navbar-right"><li><a class="user-profile dropdown-toggle" href="javascript:;" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cogs">${user.nickname }<input id="txtAudit_statusType" type="hidden" value="${ audit_statusType}"></i><span class="fa fa-angle-down"></span></a><ul class="dropdown-menu dropdown-usermenu animated fadeInDown pull-right"><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'pwd_edit')}"><li><a href="user/pwd"> 修改密码</a></li></c:if><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'help_top')}"><li><a href="uploadFile/help.pdf" target="_blank">帮助中心</a></li></c:if><li><a href="${ctx}/logout"><i class="fa fa-sign-out pull-right"></i> 退出</a></li></ul></li><li class="dropdown" role="presentation"><c:if test="${applicationOnly==false }"><a class="dropdown-toggle info-number" href="javascript:void(0)" data-toggle="dropdown" aria-expanded="false" onclick="javascript:window.location.href='${ctx}/appswitch'"><i class="fa fa-th"> </i>切换应用</a></c:if></li><li class="dropdown" role="presentation"><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'train_robot')}"><a class="dropdown-toggle info-number" href="javascript:void(0)" data-toggle="dropdown" aria-expanded="false" onclick="javascript:window.location.href='${ctx}/knowledge/training'"><i class="fa fa-tree"> </i>训练机器人</a></c:if></li><li class="dropdown" role="presentation"><c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'online_test')}"><a href="javascript:void(0)" onclick="javascript:window.open('${csclientUrl}${appKey}')"><i class="fa fa-comments-o"> </i>在线体验</a></c:if></li></ul></nav></div></div><div class="right_col" role="main"><footer><p class="pull-right">金童软件 <a href="${ctx}">Jintong Software</a>. <span class="lead"><i class="fa fa-cloud"></i> 云平台系统</span></p></footer></div></div></div></body></html>