<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<div class="wrapper header navbar navbar-fixed-top">
		<div class="container">
			<div class="row logo-menu-wrap">
				<div class="col-md-3 col-sm-12 logo">
				&nbsp;&nbsp;&nbsp;	<a href="#"><i class="fa fa-th-large fa-fw"></i>金童软件
					</a>
				</div>
				<div class="col-md-9 col-sm-12 menu">
					<a id="mobile-nav-btn" class="visible-xs" href="#"><i
						class="fa fa-chevron-down fa-2x"></i></a>
					<div class="nav">
						<ul>
							<li><a href="http://www.jintongsoft.cn" target="_blank"><i
									class="fa fa-home fa-fw"></i> <span>首页</span></a></li>
							<li><a href="http://openapi.jintongsoft.cn/qa/" target="_blank"><i
									class="fa fa-briefcase fa-fw" ></i> <span>社区</span></a></li>
							<li><a href="http://ta.jintongsoft.cn/" target="_blank"><i
									class="fa fa-heart fa-fw"></i> <span>TA情感社区</span></a></li>
							<li><a href="http://www.jintongsoft.cn/joinus.html" target="_blank"><i class="fa fa-users fa-fw"></i>
									<span>加入我们</span></a></li>
							<li><a target="_blank"
								href="http://cs.jintongsoft.cn/csclient/views/home?key=68e84482012d42669c605187030e9e59"><i
									class="fa fa-envelope fa-fw"></i> <span>智能客服体验</span></a></li>
							<li><a href="${ctx }/login/tologin"><i
									class="fa fa-cloud fa-fw"></i> <span>金童云平台</span></a></li>

						</ul>
					</div>
				</div>
			</div>
			<!--/row logo-menu-wrap-->
		</div>
		<!--/container-->
	</div>