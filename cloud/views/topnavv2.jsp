<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <%@ taglib prefix="fn"
           uri="http://java.sun.com/jsp/jstl/functions" %>
      <c:set var="ctx" value="${pageContext.request.contextPath}" />
      <div class="nav_menu" style="background-color: #f8f8f8">
        <nav class="" role="navigation">
          <div class="nav toggle">
            <a id="menu_toggle" style='padding:15px 0 0 15px'><i class="fa fa-bars"></i></a>
            <span style="font-size: 18px;padding-left:8px;opacity: 0.7;color: #555;position: relative;top: -2px;">${title}</span>
          </div>
          <ul class="nav navbar-nav navbar-right">
            <li class="">
              <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> <i class="fa fa-cogs">&nbsp;&nbsp;${user.nickname }
						<input type="hidden" id="txtAudit_statusType" value="${ audit_statusType}"></i>
                <%-- 				 <img src="images/img.jpg" alt="">${user.nickname } --%> <span class=" fa fa-angle-down"></span>
              </a>
              <ul class="dropdown-menu dropdown-usermenu animated fadeInDown pull-right">
                <c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'pwd_edit')}">
                  <li><a href="user/pwd"> 修改密码</a></li>
                </c:if>
                <!-- 					<li><a href="user/organization"> <span -->
                <!-- 							class="badge bg-red pull-right">50%</span> <span>认证信息</span> -->
                <!-- 					</a></li> -->
                <c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'help_top')}">
                  <li><a href="uploadFile/help.pdf" target="_blank">帮助中心</a></li>
                </c:if>
                <li><a href="${ctx}/logout"><i class="fa fa-sign-out pull-right"></i> 退出</a></li>
              </ul>
            </li>
            <li role="presentation" class="dropdown">
              <c:if test="${applicationOnly==false }">
                <a href="javascript:void(0)" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false" onclick="javascript:window.location.href='${ctx}/appswitch'">
                  <i class="fa fa-th"> </i>切换应用
                </a>
              </c:if>
            </li>
            <li role="presentation" class="dropdown">
              <c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'train_robot')}">
                <a href="javascript:void(0)" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false" onclick="javascript:window.location.href='${ctx}/knowledge/training'">
                  <i class="fa fa-tree"> </i>训练机器人
                </a>
              </c:if>
            </li>
            <li role="presentation" class="dropdown">
              <c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'train_robot')}"><a href="${csserverUrl}${appKey}" target="_blank"><i
					class="fa fa-headphones"> </i>人工客服接入</a></c:if>
            </li>
            <li role="presentation" class="dropdown">
              <c:if test="${usertype=='admin' or usertype=='manager' or fn:contains(accesslist, 'online_test')}"><a href="${csclientUrl}${appKey}" target="_blank"><i
					class="fa fa-comments-o"> </i>在线体验</a></c:if>
            </li>
            <li role="presentation" class="dropdown">
              <c:if test="${usertype=='admin'}"><a href="superadmin/user/index" target="_blank"><i
					class="fa fa-bug"> </i>超级管理员</a></c:if>
            </li>
          </ul>
        </nav>
      </div>