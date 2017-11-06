﻿<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
      <c:set var="ctx" value="${pageContext.request.contextPath}" />
      <script src="js/main.js"></script>
      <div class="left_col scroll-view">
        <div class="navbar nav_title" style="border: 0;">
          <a href="index" class="site_title"> <i class="fa fa-cloud"></i> <span>金童云平台</span>
          </a>
        </div>
        <div class="clearfix"></div>
        <!-- menu prile quick info -->
        <div class="profile">
          <div class="profile_pic">
            <img src="${ctx}${headicon}" class="img-circle profile_img">
          </div>
          <div class="profile_info">
            <span>${appRead}</span>
            <h2>${user.nickname }</h2>
          </div>
        </div>
        <!-- /menu prile quick info -->
        <br />
        <!-- sidebar menu -->
        <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
          <div class="menu_section">
            <h3>&nbsp;</h3>
            <ul class="nav side-menu">
              <li>
                <a href="javascript:;"> <i class="fa fa-home"></i> 首页 <span class="fa fa-chevron-down"></span></a>
                <ul class="nav child_menu" style="display: none">
                  <li><a href="index">欢迎页</a></li>
                </ul>
              </li>
              <c:if test="${fn:contains(accesslist, 'knowledge_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-book"></i> 知识管理 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                    <%-- 	<li><a href="knowledge/editByQ">语料管理</a></li> --%>
                      <li><a href="knowledge/corpus/review/index">语料审核</a></li>
        <li><a href="knowledge/corpus/audit/index">无答案问题</a></li>
                      <li><a href="knowledge/corpusManage/index">语料管理</a></li>
						<li><a href="knowledge/material/index">语料素材</a></li>
                      <li><a href="knowledge/dialog/index">对话管理</a></li>
                      <%-- <li><a href="superadmin/user/index">用户管理</a></li> --%>
                        <c:if test="${fn:contains(accesslist, 'paraphrase_access')}">
                          <li><a href="paraphrase/index">复述生成</a></li>
                        </c:if>
                        <c:if test="${fn:contains(accesslist, 'qaOnDocument_access')}">
						</c:if>
						<li><a href="knowledge/qaOnDocument/index">文本分析</a></li>
                          <li><a href="knowledge/documentAnalysis/index">文档分析</a></li>
                          <!--<c:if test="${fn:contains(accesslist, 'documentAnalysis_access')}">
                        </c:if>-->
                          <%-- <li><a href="knowledge/pm/index">主从结构</a></li>--%>
                            <li><a href="knowledge/classify/index">分类管理</a></li>
                            <c:if test="${fn:contains(accesslist, 'keyword_access')}">
                              <li><a href="keyword/index">关键词</a></li>
                            </c:if>
                            <c:if test="${fn:contains(accesslist, 'stopword_access')}">
                              <li><a href="stopword/index">停用词</a></li>
                            </c:if>
                            <c:if test="${fn:contains(accesslist, 'sensitiveWord_access')}">
                              <li><a href="knowledge/sensitive/index">敏感词</a></li>
                            </c:if>
                            <c:if test="${fn:contains(accesslist, 'synonyms_access')}">
                              <li><a href="knowledge/synonyms/index">同义词</a></li>
                            </c:if>
                            <c:if test="${fn:contains(accesslist, 'knowledge_typo_access')}">
                              <li><a href="knowledge/typo/index">错别字</a></li>
                            </c:if>
                  </ul>
                </li>
              </c:if>
              <c:if test="${fn:contains(accesslist, 'kbdocment_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-database"></i> 知识库管理 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                    <c:if test="${fn:contains(accesslist, 'depart_access')}">
                      <li><a href="depart/index">知识检索</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'depart_update')}">
                      <li><a href="depart/allstatus">更新记录</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'depart_filed')}">
                      <li><a href="depart/filed">已归档知识</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'review_access')}">
                      <li><a href="review/index">知识点审核</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'review_record')}">
                      <li><a href="review/record">审核记录</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'workflow_access')}">
                      <li><a href="workflow/index">审核流程管理</a></li>
                    </c:if>
                  </ul>
                </li>
              </c:if>
              <c:if test="${fn:contains(accesslist, 'weixinv2_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-wechat"></i> 微信矩阵 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                    <c:if test="${fn:contains(accesslist, 'wechatCredential_access')}">
                      <li><a href="weixinv2/index.do">公众号列表</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'wechatqyapp_access')}">
                      <li><a href="weixinv2/enterprise/app/index.do">应用列表</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'wechatMaterial_access')}">
                      <li><a href="weixinv2/material/mediaHistory/index">素材管理</a></li>
                    </c:if>
                    <%--<c:if test="${fn:contains(accesslist, 'wechatMaterial_access')}">
                      <li><a href="weixinv2/material/mediaHistory.do">素材管理</a></li>
                    </c:if>--%>
                    <c:if test="${fn:contains(accesslist, 'wechatGroup_access')}">
                      <li><a href="weixinv2/broadcast/index.do">群发记录</a></li>
                    </c:if>
                    <li><a href="weixinv2/broadcast/index.to">图文数据统计</a></li>
                    <c:if test="${fn:contains(accesslist, 'wechatGroup_access')}">
                      <li><a href="weixinv2/group/index">粉丝管理</a></li>
                    </c:if>
                    <li><a href="weixinv2/menu/index">自定义菜单</a></li>
                  </ul>
                </li>
              </c:if>
              <c:if test="${fn:contains(accesslist, 'quickConnect_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-puzzle-piece"></i> 快捷对接 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                    <c:if test="${fn:contains(accesslist, 'wechatQA_access')}">
                      <li><a href="weixinv2/qaconnection">微信对接</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'quickWeibo_access')}">
                      <li><a href="weibo/main">微博</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'openapi_access')}">
                      <li><a href="api/index">金童OPEN API</a></li>
                    </c:if>
                  </ul>
                </li>
              </c:if>
              <c:if test="${fn:contains(accesslist, 'spss_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-bar-chart-o"></i> 运营统计 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                    <c:if test="${fn:contains(accesslist, 'spssLog_access')}">
                      <li><a href="spss/log">消息数据分析</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'clientInfo_access')}">
                      <li><a href="spss/clientInfo">用户数据分析</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'clientType_access')}">
                      <li><a href="spss/clientTypeInfo">问题特征分析</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'clientType_access')}">
                      <li><a href="spss/feedback">用户评价分析</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'cssession_access')}">
                      <li><a href="spss/cs/csstat">人工客服统计</a></li>
                    </c:if>
                  </ul>
                </li>
              </c:if>
                <li>
                  <a href="javascript:;"> <i class="fa fa-bar-chart-o"></i> 统计分析 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                      <li><a href="spss/dataScreening/index">数据总览</a></li>
                      <li><a href="spss/msgData/index">消息数据</a></li>
                      <li><a href="spss/userData/index">用户数据</a></li>
                      <li><a href="spss/satisfactionAnalysis/index">满意度分析</a></li>
                      <li><a href="spss/feedbackRate/index">应答好评率</a></li>
                      <li><a href="spss/sessionLog/index">会话记录</a></li>
                      <li><a href="spss/staffService/index">人工客服统计</a></li>

                  </ul>
				</li>
			</c:if>
			<li>
				<a href="javascript:;"> <i class="fa fa-envelope-o"></i> 访客留言 <span class="fa fa-chevron-down"></span>
				</a>
				<ul class="nav child_menu" style="display: none">
					<li><a href="cs/guestBook/index">访客留言</a></li>
				</ul>
			</li>
              <c:if test="${fn:contains(accesslist, 'app_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-cogs"></i> 应用配置 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                    <c:if test="${fn:contains(accesslist, 'appInfo_access')}">
                      <li><a href="setting/app/basicInfo/index">智能机器人配置</a></li>
                    </c:if>
					<li><a href="setting/cs/index2">客服配置</a></li>
                    <c:if test="${fn:contains(accesslist, 'superadmin_qa_setting_access')}">
                      <li><a href="superadmin/qa_setting/index">系统调优</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'cs_server_access')}">
                      <li><a href="setting/cs/index">客服管理</a></li>
                    </c:if>
                    <%--
                      <c:if test="${fn:contains(accesslist, 'document_access')}">
                        <li><a href=document/documentManager>客服资料管理</a></li>
                      </c:if>
                    --%>
                      <c:if test="${fn:contains(accesslist, 'faq_access')}">
                        <li><a href="setting/faq/index">常见问题</a></li>
                      </c:if>
                  </ul>
                </li>
              </c:if>
              <c:if test="${fn:contains(accesslist, 'appuser_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-user"></i> 应用成员管理 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
					  <%--<c:if test="${fn:contains(accesslist, 'setting_user_list')}">
					  	<li><a href="setting/user/index">成员列表</a></li>
					  </c:if>--%>
                    <c:if test="${fn:contains(accesslist, 'appuser_list')}">
                      <li><a href="user/app/index">成员列表</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'appuser_manager')}">
                      <li><a href="user/app/role">成员角色</a></li>
                    </c:if>
                  </ul>
                </li>
              </c:if>
              <c:if test="${fn:contains(accesslist, 'customize_access')}">
                <li>
                  <a href="javascript:;"> <i class="fa fa-wrench"></i> 定制功能 <span class="fa fa-chevron-down"></span>
                  </a>
                  <ul class="nav child_menu" style="display: none">
                    <c:if test="${fn:contains(accesslist, 'manualReply_func')}">
                      <li><a href="manual_reply/index">人工回复</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'personalLetter_func')}">
                      <li><a href="personalLetter/expert">@专家回复</a></li>
                    </c:if>
                    <c:if test="${fn:contains(accesslist, 'interview_func')}">
                      <li><a href="expertInterviews/index">访谈一览</a></li>
                    </c:if>
                      <li><a href="recommend/index">推荐问题</a></li>
                  </ul>
                </li>
              </c:if>
            </ul>
          </div>
        </div>
        <!-- /sidebar menu -->
      </div>
