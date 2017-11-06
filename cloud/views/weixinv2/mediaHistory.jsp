<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="selectId" value="${selectWechatCredentials}" />
<script type="text/javascript">
        var selectId = new Array();
        var i = 0;
        var credentialId = '${wechatCredential.id}';
        <c:forEach items="${selectWechatCredentials}" var="a">
            selectId[i]="${a.id}";
            i = i +1;
        </c:forEach>
		    var matrix = new Array();

        <c:forEach var="wechatCredential" items="${wechatCredentials}">
        matrix["${wechatCredential.id}"] = '${wechatCredential.wxName}';
        </c:forEach>
        var currentMediaId="";
</script>

<html lang="en">

<head>
<script src="${ctx }/js/jquery.min.js"></script>
<jsp:include page="../headv2.jsp" />
<script type="text/javascript" charset="utf-8" src="${ctx }/js/bootstrap-dialog.min.js"></script>
<script type="text/javascript" src="${ctx }/js/ajaxfileupload.js"></script>
<!-- 页面Js文件的引用 -->
<script type="text/javascript" src="${ctx }/js/weixinv2/mediaHistory.js"></script>
<script type="text/javascript" src="${ctx }/module/jquery.lazyload.min.js"></script>
<!-- select2 -->
<link href="${ctx}/css/select/select2.min.css" rel="stylesheet">
<!-- select2 -->
<script src="${ctx}/js/select/select2.full.js"></script>
<!-- moment.js -->
<script src="${ctx}/module/moment/moment.min.js"></script>
<!-- video-js-->
<link href="${ctx}/module/videojs/video-js.min.css" rel="stylesheet" type="text/css"/>
<script src="${ctx}/module/videojs/video.min.js"></script>
<script src="${ctx}/module/videojs/lang/zh-CN.js"></script>
<style>
.bootstrap-dialog-footer-buttons button {
	margin-bottom: 5px !important
}

.right_col * {
	font-size: 13px;
}

.imgcover {
	border: 1px solid #f5f5f5;
	width: 120px;
	height: 120px;
	background-image: url('${ctx }/images/upimage.png');
	background-size: 100% 100%;
	margin: 10px;
}

.carrousel {
	background-color: rgba(10, 10, 10, 0.8);
	display: none;
	margin: auto;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 1000;
}

.carrousel>img {
	margin: auto;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 1000;
}

.mask.no-caption .tools {
	margin: 0px 0 0 0;
}
table{
	font-size: 13px;
}
.table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td{
	vertical-align:middle;
}
.table .select2-selection.select2-selection--multiple{
  height:34px!important;
  min-height:30px!important;
}
.table ul.select2-selection__rendered{
  height:32px!important;
}
.table ul .select2-selection__choice{
  margin-top:0px!important;
}
.table ul .select2-search.select2-search--inline{
  height:24px!important;
}
.table .select2.select2-container{
  width:100%!important;
}
.table ul li .select2-search__field{
  height:22px;
  margin-top:3px;
  text-align:center;

}
.table td span{
  line-height: 26px!important;
}
.audio-wrap{
  width:70%;
  background: #fff;
  cursor:pointer;
  border:1px solid #ccc;
  border-radius: 5px;
}
.audio-wrap span{
  float:left;
  margin-left:5px;
}
.clearfix{
  clear:both;
}
.audio-wrap .time-wrap{
  float:right;
  margin-right:5px;
}
.play{
  display: none;
}
.audio-wrap.active .stop{
  display: none;
}
.audio-wrap.active .play{
  display: inline-block;
}
.video-item-wrap {
    text-align: center;
    margin-bottom: 40px;
}
.video-item-wrap .video-item {
    display: inline-block;
    border: 1px solid #ccc;
    position: relative;
}
.video-item-wrap .video-item .video {
    width: 336px;
    height: 190px;
    box-sizing: content-box;
    text-align: center;
}
.name-wrap, .desc-wrap {
    min-height: 28px;
    text-align: center;
    padding: 3px 0;
}
.resource-hover-item {
    cursor: pointer;

}
.vjs-modal-dialog .vjs-modal-dialog-content{
  padding:20px 0!important;
}
</style>
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
			<div class="carrousel">
				<img style="border: 5px solid white" src="" />
			</div>
			<div class="right_col" role="main">
				<div class="x_panel">
          <!--==============头部===-->
					<div class="row">
            <!--=================================左侧tab-->
						<div class="col-md-5">
							<ul id="myTab" class="nav nav-tabs bar_tabs">
								<c:if test="${action==0}">
									<c:if test="${all==1}">
										<c:if test="${type==1}">
											<li class="active">
										</c:if>
										<c:if test="${type!=1}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=1&id=-1" id="msgTab"> 图文消息</a>
										</li>
										<c:if test="${type==2}">
											<li class="active">
										</c:if>
										<c:if test="${type!=2}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=2&id=-1" id="picTab">图片</a>
										</li>
										<c:if test="${type==3}">
											<li class="active">
										</c:if>
										<c:if test="${type!=3}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=3&id=-1" id="voiceTab">语音</a>
										</li>
										<c:if test="${type==4}">
											<li class="active">
										</c:if>
										<c:if test="${type!=4}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=4&id=-1" id="videoTab">视频</a>
										</li>
									</c:if>
									<c:if test="${all==0}">
										<c:if test="${type==1}">
											<li class="active">
										</c:if>
										<c:if test="${type!=1}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=1" id="msgTab"> 图文消息</a>
										</li>
										<c:if test="${type==2}">
											<li class="active">
										</c:if>
										<c:if test="${type!=2}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=2" id="picTab">图片</a>
										</li>
										<c:if test="${type==3}">
											<li class="active">
										</c:if>
										<c:if test="${type!=3}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=3" id="voiceTab">语音</a>
										</li>
										<c:if test="${type==4}">
											<li class="active">
										</c:if>
										<c:if test="${type!=4}">
											<li>
										</c:if>
										<a href="weixinv2/material/mediaHistory.do?type=4" id="videoTab">视频</a>
										</li>
									</c:if>
								</c:if>
								<c:if test="${action==1}">
									<c:if test="${type==1}">
										<li class="active">
									</c:if>
									<c:if test="${type!=1}">
										<li>
									</c:if>
									<a href="weixinv2/material/mediaHistory.do?type=1&id=${wechatCredential.id}" id="msgTab">
										图文消息</a>
									</li>
									<c:if test="${type==2}">
										<li class="active">
									</c:if>
									<c:if test="${type!=2}">
										<li>
									</c:if>
									<a href="weixinv2/material/mediaHistory.do?type=2&id=${wechatCredential.id}" id="picTab">图片</a>
									</li>
									<c:if test="${type==3}">
										<li class="active">
									</c:if>
									<c:if test="${type!=3}">
										<li>
									</c:if>
									<a href="weixinv2/material/mediaHistory.do?type=3&id=${wechatCredential.id}" id="voiceTab">语音</a>
									</li>
									<c:if test="${type==4}">
										<li class="active">
									</c:if>
									<c:if test="${type!=4}">
										<li>
									</c:if>
									<a href="weixinv2/material/mediaHistory.do?type=4&id=${wechatCredential.id}" id="videoTab">视频</a>
									</li>
								</c:if>

							</ul>
						</div>
            <!--=====================================右侧选项-->
						<div class="col-md-7" style="margin-top: 10px">
              <c:if test="${extra!='1'||(extra=='1'&&extraCredential.id==wechatCredential.id)}">
                <c:if test="${action=='1'}">
                  <input name="id" id="id" value=${wechatCredential.id } style="display: none">
                  <c:if test="${type=='1'}">
                    <button type="button" class="uploadbtn btn btn-success" id="addWechatButton" style="float: right;" onclick="window.location.href='${ctx}/weixinv2/material/newsCreator.do?wxid=${wechatCredential.id }'">
                      <span class="glyphicon glyphicon-plus"></span> 新建图文组
                    </button>
                  </c:if>
                  <c:if test="${type=='2'}">
                    <button type="button" class="uploadbtn btn btn-success" id="picButtonUpload" style="float: right;" onclick="uploadMedia(2)">
                      <span class="glyphicon glyphicon-plus"></span> 上传图片
                    </button>
                  </c:if>
                  <c:if test="${type=='3'}">
                    <button type="button" class="uploadbtn btn btn-success" id="voiceButtonUpload"
                      style="float: right;" onclick="uploadMedia(3)">
                      <span class="glyphicon glyphicon-plus"></span> 上传语音
                    </button>
                  </c:if>
                  <c:if test="${type=='4'}">
                    <button type="button" class="uploadbtn btn btn-success" id="videoButtonUpload"
                      style="float: right;" onclick="uploadMedia(4)">
                      <span class="glyphicon glyphicon-plus"></span> 上传视频
                    </button>
                  </c:if>
                </c:if>

                <c:if test="${action=='0'}">
                  <c:if test="${type=='1'}">
                    <button type="button" class="uploadbtn btn btn-default" style="float: right; background-color: #F0F0F0;" id="addWechatButton"
                      data-container="body" data-toggle="popover" data-placement="bottom" data-content="需先选择一个公众号">
                    <span class="glyphicon glyphicon-plus"></span> 新建图文组
                  </button>
                  </c:if>
                  <c:if test="${type=='2'}">
                    <button type="button" class="uploadbtn btn btn-default" id="picButtonUpload" style="float: right; background-color: #F0F0F0;"
                      data-container="body" data-toggle="popover" data-placement="bottom" data-content="上传需选择一个公众号">
                    <span class="glyphicon glyphicon-plus"></span> 上传图片
                  </button>
                  </c:if>
                  <c:if test="${type=='3'}">
                    <button type="button" class="uploadbtn btn btn-default" id="voiceButtonUpload" style="float: right;background-color: #F0F0F0;" onclick="uploadMedia(3)">
                      <span class="glyphicon glyphicon-plus"></span> 上传语音
                    </button>
                  </c:if>
                  <c:if test="${type=='4'}">
                    <button type="button" class="uploadbtn btn btn-default" id="videoButtonUpload" style="float: right;background-color: #F0F0F0;" onclick="uploadMedia(4)">
                      <span class="glyphicon glyphicon-plus"></span> 上传视频
                    </button>
                  </c:if>
                </c:if>
              </c:if>
							<!--<c:if test="${action=='1'}">
								<input name="id" id="id" value=${wechatCredential.id } style="display: none">
								<c:if test="${type=='1'}">
									<button type="button" class="uploadbtn btn btn-success" id="addWechatButton"
										style="float: right;"
										onclick="window.location.href='${ctx}/weixinv2/material/newsCreator.do?wxid=${wechatCredential.id }'">
										<span class="glyphicon glyphicon-plus"></span> 新建图文组
									</button>
								</c:if>
								<c:if test="${type=='2'}">
									<button type="button" class="uploadbtn btn btn-success" id="picButtonUpload"
										style="float: right;" onclick="uploadMedia(2)">
										<span class="glyphicon glyphicon-plus"></span> 上传图片
									</button>
								</c:if>
								<c:if test="${type=='3'}">
									<button type="button" class="uploadbtn btn btn-success" id="voiceButtonUpload"
										style="float: right;" onclick="uploadMedia(3)">
										<span class="glyphicon glyphicon-plus"></span> 上传语音
									</button>
								</c:if>
								<c:if test="${type=='4'}">
									<button type="button" class="uploadbtn btn btn-success" id="videoButtonUpload"
										style="float: right;" onclick="uploadMedia(4)">
										<span class="glyphicon glyphicon-plus"></span> 上传视频
									</button>
								</c:if>
							</c:if>
							<c:if test="${action=='0'}">
								<c:if test="${type=='1'}">
									<button type="button" class="uploadbtn btn btn-default"
										style="float: right; background-color: #F0F0F0;" id="addWechatButton"
										data-container="body" data-toggle="popover" data-placement="bottom"
										data-content="需先选择一个公众号">
										<span class="glyphicon glyphicon-plus"></span> 新建图文组
									</button>
								</c:if>
								<c:if test="${type=='2'}">
									<button type="button" class="uploadbtn btn btn-default" id="picButtonUpload"
										style="float: right; background-color: #F0F0F0;" data-container="body"
										data-toggle="popover" data-placement="bottom" data-content="上传需选择一个公众号">
										<span class="glyphicon glyphicon-plus"></span> 上传图片
									</button>
								</c:if>
								<c:if test="${type=='3'}">
									<button type="button" class="uploadbtn btn btn-default" id="voiceButtonUpload"
										style="float: right; background-color: #F0F0F0;" data-container="body"
										data-toggle="popover" data-placement="bottom" data-content="上传需选择一个公众号">
										<span class="glyphicon glyphicon-plus"></span> 上传语音
									</button>
								</c:if>
								<c:if test="${type=='4'}">
									<button type="button" class="uploadbtn btn btn-default" id="videoButtonUpload"
										style="float: right; background-color: #F0F0F0;" data-container="body"
										data-toggle="popover" data-placement="bottom" data-content="上传需选择一个公众号">
										<span class="glyphicon glyphicon-plus"></span> 上传视频
									</button>
								</c:if>
							</c:if>-->
							<div class="currentWxAccount" style="float: right; display: inline-block; margin-right: 10px">
								<span>当前公众号</span>
								<c:if test="${action=='1'}">
									<div class="btn-group">
										<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
											${wechatCredential.wxName } <span class="caret"></span>
										</button>
										<ul class="dropdown-menu">
											<c:if test="${extra=='0'}">
                        <li><a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1">所有公众号 </a></li>
											</c:if>
											<c:forEach var="wechatCredential" items="${wechatCredentials}">
												<li><a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}">${wechatCredential.wxName}</a>
												</li>
											</c:forEach>

										</ul>
									</div>
								</c:if>
								<c:if test="${action=='0'}">
									<div class="btn-group">
										<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
											<c:if test="${extra=='0'}">
											所有公众号
											</c:if>
											<c:if test="${extra=='1'}">
												${extraCredential.wxName}
											</c:if>
											<span class="caret"></span>
										</button>
										<ul class="dropdown-menu">
											<c:forEach var="wechatCredential" items="${wechatCredentials}">
												<li><a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}">${wechatCredential.wxName}</a>
												</li>
											</c:forEach>
										</ul>
									</div>
								</c:if>
							</div>
							<div class="clearfix"></div>
						</div>
					</div>
          <!--==============内容===-->
					<div class="tab-content">
						<c:if test="${type==1}">
							<div class="tab-pane fade in active" id="msg">
						</c:if>
						<c:if test="${type!=1}">
							<div class="tab-pane fade" id="msg">
						</c:if>

						<div class="x_title">
							<div class="clearfix"></div>
						</div>
          <!--======图文表格start=========================================-->
						<table class="table table-striped responsive-utilities jambo_table">
							<thead>
								<tr class="headings">
									<th>封面</th>
									<th>标题</th>
									<th>公众号</th>
									<th>时间</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="wechatMedia" items="${wechatMedias}">
									<c:if test="${wechatMedia.type=='1'}">
										<tr class="even pointer">
											<td class=" ">
												<img class="lazy" src="images/loadingx2.png" alt=""
													data-original="${wechatMedia.localuri}" style="height: 40px; width: 70px">
											</td>
											<td class=" ">
												<c:forEach var="rel" items="${rels}">
													<c:if test="${rel.mediaid==wechatMedia.id}">
														<c:forEach var="wechatNew" items="${wechatNews}">
															<c:if test="${wechatNew.id==rel.newsid}">
																				${wechatNew.title }</br>
															</c:if>
														</c:forEach>
													</c:if>
												</c:forEach>
											</td>
											<td class=" ">
												<c:if test="${action=='1'}">
																	${wechatCredential.wxName }
																</c:if>
												<c:if test="${action=='0'}">
													<c:forEach var="wechatCredential" items="${wechatCredentials}">
														<c:if test="${wechatCredential.id==wechatMedia.credentialId}">
																			${wechatCredential.wxName }
																		</c:if>
													</c:forEach>
												</c:if>
											</td>
											<td class=" ">
												<fmt:formatDate value="${wechatMedia.updateTime }" pattern="yyyy-MM-dd HH:mm:ss" />
											</td>
											<td class="last">
												<c:if test="${usertype!='user'}">
													<a
														href="weixinv2/material/newsList.do?mediaid=${wechatMedia.id}&wxid=${wechatCredential.id}">&nbsp;编辑&nbsp;</a>
													<a onclick="previewBroadcastModal('${wechatMedia.id }')" href="javascript:;">&nbsp;预览&nbsp;</a>
													<c:if test="${fn:contains(accesslist, 'wechatBrocastToAll')}">
														<a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;">&nbsp;推送到矩阵&nbsp;</a>
													</c:if>
													<c:if test="${action=='1'}">
														<a onclick="addBroadcastModal('${wechatMedia.id }',1,'${wechatCredential.id}')"
															href="javascript:;">&nbsp;群发&nbsp;</a>
													</c:if>
													<a onclick="delNews('${wechatMedia.id }')" href="javascript:;">&nbsp;删除</a>
												</c:if>
												<c:if test="${usertype=='user'}">
													<c:if test="${extra=='1'}">
														<c:if test="${extraCredential.id==wechatMedia.credentialId}">
															<a
																href="weixinv2/material/newsList.do?mediaid=${wechatMedia.id}&wxid=${wechatCredential.id}">&nbsp;编辑&nbsp;</a>
															<a onclick="previewBroadcastModal('${wechatMedia.id }')" href="javascript:;">&nbsp;预览&nbsp;</a>

															<c:if test="${fn:contains(accesslist, 'wechatBrocastToAll')}">
																<a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;">&nbsp;推送到矩阵&nbsp;</a>
															</c:if>
															<a onclick="addBroadcastModal('${wechatMedia.id }',1,'${extraCredential.id}')"
																href="javascript:;">&nbsp;群发&nbsp;</a>

															<a onclick="delNews('${wechatMedia.id }')" href="javascript:;">&nbsp;删除</a>
														</c:if>
														                                    <c:if test="${extraCredential.id!=wechatMedia.credentialId}">
                                      <a onclick="previewBroadcastModal('${wechatMedia.id }')" href="javascript:;">&nbsp;预览&nbsp;</a>
                                      <c:if test="${fn:contains(accesslist, 'wechatBrocastToAll')}">
                                        <a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;">&nbsp;推送到矩阵&nbsp;</a>
                                      </c:if>
                                      <a onclick="addBroadcastModal('${wechatMedia.id }',2,'${extraCredential.id }')" href="javascript:;">&nbsp;转发&nbsp;</a>
                                    </c:if>
													</c:if>
                                  <c:if test="${extra=='0'}">
                                    <a href="weixinv2/material/newsList.do?mediaid=${wechatMedia.id}&wxid=${wechatCredential.id}">&nbsp;编辑&nbsp;</a>
                                    <a onclick="previewBroadcastModal('${wechatMedia.id }')" href="javascript:;">&nbsp;预览&nbsp;</a>
                                    <c:if test="${fn:contains(accesslist, 'wechatBrocastToAll')}">
                                      <a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;">&nbsp;推送到矩阵&nbsp;</a>
                                    </c:if>
                                    <c:if test="${action=='1'}">
                                      <a onclick="addBroadcastModal('${wechatMedia.id }',1,'${wechatCredential.id}')" href="javascript:;">&nbsp;群发&nbsp;</a>
                                    </c:if>
                                    <a onclick="delNews('${wechatMedia.id }')" href="javascript:;">&nbsp;删除</a>
                                  </c:if>
												</c:if>
											</td>
										</tr>
									</c:if>
								</c:forEach>
							</tbody>
						</table>
						<c:if test="${type==1}">
							<jsp:include page="mediaPage.jsp" />
						</c:if>
					</div>
					<!-- "msg" tab end -->
          <!--图片表格start===========================-->
					<c:if test="${type==2}">
						<div class="tab-pane fade in active" id="pic">
					</c:if>
					<c:if test="${type!=2}">
						<div class="tab-pane fade" id="pic">
					</c:if>
					<div class="x_title">
						<c:if test="${action=='1'}">
						</c:if>
						<div class="clearfix"></div>
					</div>

					<div class="row" id="picTable">
						<c:forEach var="wechatMedia" items="${wechatMedias}">
							<c:if test="${wechatMedia.type=='2'}">
								<div class="col-md-55" id="record-${wechatMedia.id}">
									<div class="thumbnail">
										<div class="image view view-first">
											<a onclick="showPic('${wechatMedia.localuri }')" href="javascript:;" title="放大图片">
                        <img class="lazy" style="width: 100%; display: block;" src="images/loading.png"
													data-original="${wechatMedia.localuri}" alt="image" />
											</a>
											<div class="mask no-caption">
												<div class="tools tools-bottom">
													<c:if test="${usertype!='user'}">
														<a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;"
															title="推送到矩阵"> <i class="fa fa-th"></i>
														</a>
														<c:if test="${action=='1'}">
															<a onclick="addBroadcastModal('${wechatMedia.id }',1,'${wechatCredential.id}')"
																href="javascript:;" title="群发"> <i class="fa fa-wechat"></i>
															</a>
														</c:if>
														<a onclick="delMedia(${wechatMedia.id })" href="javascript:;" title="删除"> <i
															class="fa fa-times"></i>
														</a>
													</c:if>
													<!--<c:if test="${usertype=='user'}">
														<c:if test="${extra=='1'}">
															<c:if test="${extraCredential.id==wechatMedia.credentialId}">
																<a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;"
																	title="推送到矩阵"> <i class="fa fa-th"></i>
																</a>
																<a onclick="addBroadcastModal('${wechatMedia.id }',1,'${extraCredential.id}')"
																	href="javascript:;" title="群发"> <i class="fa fa-wechat"></i>
																</a>

																<a onclick="delMedia(${wechatMedia.id })" href="javascript:;" title="删除"> <i
																	class="fa fa-times"></i>
																</a>
															</c:if>
															<c:if test="${extraCredential.id!=wechatMedia.credentialId}">
															<a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;"
																	title="推送到矩阵"> <i class="fa fa-th"></i>
																</a>
																<a onclick="addBroadcastModal('${wechatMedia.id }',2,'${extraCredential.id}')"
																	href="javascript:;" title="转发"> <i class="fa fa-wechat"></i>
																</a>

															</c:if>
														</c:if>
														<c:if test="${extra=='0'}">
															<a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;"
																title="推送到矩阵"> <i class="fa fa-th"></i>
															</a>
														</c:if>
													</c:if>-->
                          <c:if test="${usertype=='user'}">
                            <c:if test="${extra=='1'}">
                              <c:if test="${extraCredential.id==wechatMedia.credentialId}">
                                <!--<a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;" title="推送到矩阵"> <i class="fa fa-th"></i>
                                </a>
                                <a onclick="addBroadcastModal('${wechatMedia.id }',1,'${extraCredential.id}')" href="javascript:;" title="群发"> <i class="fa fa-wechat"></i>
                                </a>-->
                                <a onclick="delMedia(${wechatMedia.id })" href="javascript:;" title="删除"> <i class="fa fa-times"></i></a>
                              </c:if>
                              <!--<c:if test="${extraCredential.id!=wechatMedia.credentialId}">
                                <a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;" title="推送到矩阵"> <i class="fa fa-th"></i>
                                </a>
                                <a onclick="addBroadcastModal('${wechatMedia.id }',2,'${extraCredential.id}')" href="javascript:;" title="转发"> <i class="fa fa-wechat"></i>
                                </a>
                              </c:if>-->
                            </c:if>
                            <!--<c:if test="${extra=='0'}">
                              <a onclick="addBroadcastModal('${wechatMedia.id }',0,0)" href="javascript:;" title="推送到矩阵"> <i class="fa fa-th"></i>
                              </a>
                            </c:if>-->
                          </c:if>
												</div>
											</div>
										</div>
										<div class="caption">
											<p>${wechatMedia.name }</p>
										</div>
									</div>
								</div>
							</c:if>
						</c:forEach>
					</div>
					<c:if test="${type==2}">
						<jsp:include page="mediaPage.jsp" />
					</c:if>
				</div>
				<!-- "pic" tab end -->
        <!--语音表格start===========================-->
				<c:if test="${type==3}">
					<div class="tab-pane fade in active" id="voice">
				</c:if>
				<c:if test="${type!=3}">
					<div class="tab-pane fade" id="voice">
				</c:if>
				<div class="x_title">
					<c:if test="${action=='1'}">
					</c:if>
					<div class="clearfix"></div>
				</div>

				<div class="row" id="voiceTable">
          <table class="table table-striped responsive-utilities jambo_table voice-table">
							<thead>
								<tr class="headings">
									<th>语音</th>
									<th>标题</th>
									<th>创建时间</th>
                  <th>操作</th>
								</tr>
							</thead>
							<tbody>
                <c:forEach var="wechatMedia" items="${wechatMedias}">
                  <c:if test="${wechatMedia.type=='3'}">
                    <!--====================需修改-->
                    <tr class="even pointer">
                          <td class=" ">
                            <div class="audio-wrap clearfix" data-id="${wechatMedia.localuri}">
                              <span class="glyphicon glyphicon-volume-up stop"></span>
                              <span class="glyphicon glyphicon-volume-down play"></span>
                              <div class="time-wrap">
                                <span class="time">${wechatMedia.hourLong}秒</span>
                              </div>
                            </div>
                          </td>
                          <td class=" ">
                            ${wechatMedia.name }
                          </td>
                          <td class="renderTime">
                            <script>
                              moment.locale('zh-cn');
                              var t=moment('${wechatMedia.tsp}').fromNow();
                              $('.renderTime').text(t);
                            </script>
                          </td>
                          <td class="renderOpt" style='cursor:pointer'>
                            <a onclick="delMedia(${wechatMedia.id })">删除</a>
                          </td>
                    </tr>
                    <%--<div class="col-md-55" id="record-${wechatMedia.id}">
                      <div class="thumbnail">
                        <div class="image view view-first">
                          <img style="width: 100%; display: block;" src=${wechatMedia.url } alt="image" />
                          <div class="mask no-caption">
                            <div class="tools tools-bottom">
                              <a onclick="delMedia(${wechatMedia.id })"> <i class="fa fa-times"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="caption">
                          <p>${wechatMedia.name }</p>
                        </div>
                      </div>
                    </div>--%>
                  </c:if>
                </c:forEach>
              </tbody>
            </table>
				</div>
				<c:if test="${type==3}">
					<jsp:include page="mediaPage.jsp" />
				</c:if>
			</div>
			<!-- "voice" tab end -->
      <!--视频表格start===========================-->
			<c:if test="${type==4}">
				<div class="tab-pane fade in active" id="video">
			</c:if>
			<c:if test="${type!=4}">
				<div class="tab-pane fade" id="video">
			</c:if>

			<div class="x_title">
				<div class="clearfix"></div>
			</div>

			<div class="row" id="videoTable">

				<c:forEach var="wechatMedia" items="${wechatMedias}">
					<c:if test="${wechatMedia.type=='4'}">
            <div class="col-sm-3 col-md-3 col-xs-3" id="record-${wechatMedia.id}">
              <div class="video-item-wrap col s4">
                <div class="video-item resource-hover-item">
                  <div class="name-wrap ellipsis">
                    <span>${wechatMedia.name}</span>
                  </div>
                  <video
                      id="video-${wechatMedia.id}"
                      class="video video-js vjs-big-play-centered vjsp"
                      controls
                      preload="auto"
                      data-setup='{}'
                      data-id="${wechatMedia.id}">
                    <source src="${wechatMedia.localuri}"></source>
                    <p class="vjs-no-js">
                      您的浏览器不支持播放该视频
                    </p>
                  </video>
                  <div class="desc-wrap ellipsis" style='clear:both;padding:7px 15px;'>
                    <span style='float:left'>简介${wechatMedia.name}</span>
                    <a style='float: right' onclick="delMedia(${wechatMedia.id })"> <i class="fa fa-trash"></i></a>
                  </div>
                </div>
              </div>
            </div>
						<%--<div class="col-md-55" id="record-${wechatMedia.id}">
							<div class="thumbnail">
								<div class="image view view-first">
									<img style="width: 100%; display: block;" src='${wechatMedia.url}' alt="image" />
									<div class="mask no-caption">
										<div class="tools tools-bottom">
											<a onclick="delMedia(${wechatMedia.id })"> <i class="fa fa-times"></i></a>
										</div>
									</div>
								</div>
								<div class="caption">
									<p>${wechatMedia.name }</p>
								</div>
							</div>
						</div>--%>
					</c:if>
				</c:forEach>
        <script>
          var $vjses=$('.vjsp');
          $vjses.each(function(){
            videojs(('#video-'+$(this).data('id')), {
              language: 'zh-CN'
            });
          });
        </script>
			</div>
			<c:if test="${type==4}">
				<jsp:include page="mediaPage.jsp" />
			</c:if>
		</div>
		<!-- "video" tab end -->
	</div>
	<!-- "tab-content" end -->
	</div>

	<footer>
		<jsp:include page="../footerv2.jsp" />
	</footer>
	</div>
	</div>
	</div>

</body>
<!-- 上传图片 模态框 -->
<div class="modal fade" id="uploadMedia" tabindex="-1" role="dialog"
	aria-labelledby="updateMediaLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title" id="myModalLabel">上传素材</h4>
			</div>
			<form id="demo-form2" data-parsley-validate class="form-horizontal form-label-left">
				</br>
				</br>
				<div class="form-group">
					<label class="control-label col-md-3 col-sm-3 col-xs-12">
						文件名称 <span class="required">*</span>
					</label>
					<div class="col-md-6 col-sm-6 col-xs-12">
						<input id="fileToUpload" type="file" size="20" name="fileToUpload" class="input"
							style="float: right">
					</div>
				</div>

				<div clas="ln_solid"></div>
				</br>
				</br>
				<div class="form-group">
					<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
						<button type="button" class="btn btn-success" onclick="uploadFile()">上传</button>
						<button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>

					</div>
				</div>

			</form>
		</div>
	</div>
</div>
<!-- 群发 模态框 -->
<div class="modal fade" id="sendMsg" tabindex="-1" role="dialog" aria-labelledby="sendMsgLabel">
	<div class="modal-dialog  modal-dialog-mainform" role="document">
		<div class="modal-content modal-content-mainform">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title" id="formtitle_sendMsg">发送消息</h4>
			</div>
			<div class="x_content">
				<!-- 				<p>发送消息到指定的公众号</p> -->
				<p id="sendMsg_info" class="bg-info">账号必须是公众号的粉丝才能接收图文消息预览</p>
				<div class="checkbox" id="selectAllDiv">
	                 <label>
	                	<input type="checkbox" name="selectAll" id="selectAll">全选
	                 </label>
	            </div>
				<table class="table table-striped" style='table-layout: fixed'>
					<thead>
						<tr class="headings">
							<th>公众号</th>
							<th>群发对象</th>
							<th id="groupLabelTitle">标签</th>
							<th>性别</th>
						</tr>
					</thead>
					<tbody id="tB">
						<c:forEach var="selectWechatCredential" items="${selectWechatCredentials}">
							<tr class="even pointer" id="tr_${selectWechatCredential.id }">
								<td class=" ">
									<label id="credentiallabel_${selectWechatCredential.id }">
										<input type="checkbox" id="checkbox_${selectWechatCredential.id }" class='checkBoxInput'/>${selectWechatCredential.wxName }
                    <input type="hidden" value='${selectWechatCredential.accountType}' class='hiddenAccType'/>
                  </label>
								</td>
                <c:if test="${selectWechatCredential.accountType!='3'}">
                  <td class=" ">
                    <div class="form-group">
                      <input type="hidden" value='${selectWechatCredential.accountType}' class='hiddenAccType'/>
                      <select class="form-control" id="target_${selectWechatCredential.id }"
                        disabled="disabled">
                        <option value="1">全部用户</option>
                        <option value="2">按标签选择</option>
                      </select>
                    </div>
                  </td>
                  <td class=" ">
                    <div class="form-group">
                      <select class="form-control" id="group_${selectWechatCredential.id }" disabled="disabled">
                        <option value="-1">请选择标签</option>
                        <c:forEach var="groupName" items="${groupNames}">
                          <c:if test="${groupName.credential.id == selectWechatCredential.id }">
                            <option value="${groupName.groupid }">${groupName.name }</option>
                          </c:if>
                        </c:forEach>
                      </select>
                    </div>
                  </td>
                  <td class=" ">
                    <div class="form-group">
                      <select class="form-control form-group" id="gender_${selectWechatCredential.id }" disabled="disabled">
                        <option value="0">全部</option>
                        <option value="1">男</option>
                        <option value="2">女</option>
                      </select>
                    </div>
                  </td>
                </c:if>
                <c:if test="${selectWechatCredential.accountType=='3'}">
                  <td class=" ">
                    <div class="form-group">
                      <input type="hidden" value='${selectWechatCredential.accountType}' class='hiddenAccType'/>
                      <select class="form-control select" id="target_${selectWechatCredential.id }" disabled="disabled" multiple="multiple">
                        <c:forEach var="agent" items="${wechatAppInCredentialBeans}">
                          <c:if test='${agent.credentialId==selectWechatCredential.id}'>
                            <c:forEach var='app' items='${agent.apps}'>
                              <option value='${app.agentid}'>${app.name}</option>
                            </c:forEach>
                          </c:if>
                        </c:forEach>
                      </select>
                    </div>
                  </td>
                  <td class=" ">
                  </td>
                  <td class=" ">
                  </td>
                </c:if>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>

			<div clas="ln_solid"></div>
			<br />
			<div class="form-group" style="margin: 0 auto; text-align: center;">
				<button type="button" class="btn btn-primary" style="margin: 0 auto; text-align: center;"
					onclick="addBroadcast()">确定</button>
				<button type="button" class="btn" style="margin: 0 auto; text-align: center;"
					data-dismiss="modal">取消</button>
			</div>
			<div clas="ln_solid"></div>
			<br />
		</div>
	</div>
</div>

<!-- 预览 模态框 -->
<div class="modal fade" id="previewMsg" tabindex="-1" role="dialog" aria-labelledby="previewMsg">
	<div class="modal-dialog  modal-dialog-mainform" role="document">
		<div class="modal-content modal-content-mainform">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title" id="formtitle">图文消息预览</h4>
			</div>
			<div class="x_content">
				<p>发送图文消息预览到指定微信号</p>
				<p class="bg-info">账号必须是公众号的粉丝才能接收图文消息预览</p>
				<form class="form-horizontal">
					<div class="form-group">
						<label for="inputWxappid" class="col-sm-2 control-label">公众号</label>
						<div class="col-sm-10">
							<select id="previewWxappid" class="form-control">
                <c:if test='${isAppUser==0}'>
                  <c:forEach var="current" items="${wechatCredentials}">
                    <c:if test='${current.accountType!=3}'>
                      <c:if test="${wechatCredential.id==current.id}">
                        <option value="${current.id}" selected="selected">${current.wxName}</option>
                      </c:if>
                      <c:if test="${wechatCredential.id!=current.id}">
                        <option value="${current.id}">${current.wxName}</option>
                      </c:if>
                    </c:if>
                  </c:forEach>
                </c:if>
                <c:if test='${isAppUser==1}'>
                  <option value="${extraCredential.id}" selected="selected">${extraCredential.wxName}</option>
                </c:if>
              </select>
						</div>
					</div>
					<div class="form-group">
						<label for="inputPassword3" class="col-sm-2 control-label">微信账号名</label>
						<div class="col-sm-10">
							<input id="previewWxAccount" placeholder="请输入微信号（注意：非微信昵称）" type="text" class="form-control">
						</div>
					</div>
				</form>
			</div>
			<div clas="ln_solid"></div>
			<br />
			<div class="form-group" style="margin: 0 auto; text-align: center;">
				<button type="button" class="btn btn-primary" style="margin: 0 auto; text-align: center;"
					onclick="previewBroadcast()">确定</button>
				<button type="button" class="btn" style="margin: 0 auto; text-align: center;"
					data-dismiss="modal">取消</button>
			</div>
			<div clas="ln_solid"></div>
			<br />
		</div>
	</div>
</div>

<script type="text/javascript">
/*console.log($('.cloud-videojs-play'));
  videojs('.cloud-videojs-play');*/
$(function() {
    $("img.lazy").lazyload();
});
/*function loadimg(){
	$("img.lazy").lazyload();
}*/
</script>
</html>

