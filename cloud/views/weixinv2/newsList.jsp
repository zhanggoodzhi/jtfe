<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <c:set var="selectId" value="${wechatCredentials}" />
    <script type="text/javascript">
        var ctx='${ctx}';
        var selectId = new Array();
        var i = 0;
        var credentialId = '${credentialId}';
        <c:forEach items="${wechatCredentials}" var="a">
  			 selectId[i]="${a.id}";
  			 i = i +1;
		</c:forEach>
		var matrix = new Array();

		<c:forEach var="wechatCredential" items="${wechatCredentials}">
		matrix["${wechatCredential.id}"] = '${wechatCredential.wxName}';
		</c:forEach>
		var currentMediaId="";
    </script>
    <!DOCTYPE html>
    <html lang="zh-CN">

    <head>
      <script>
	var mediaId = '${mediaId}';
	var currentwxid = '${credential.id}';
	var currentwxname = '${credential.wxName}';
	var matrix = new Array();
	<c:forEach var="wechatCredential" items="${wechatCredentials}">
	matrix["${wechatCredential.id}"] = '${wechatCredential.wxName}';
	</c:forEach>

	var defaultContent ='本文为<b>${credential.wxName}</b>原创文章, 转载请注明出处<br/>欢迎大家扫描二维码关注微信公众号<br/>';
	defaultContent+='<img src="${credential.qrcode}" style="width:120px;height:120px;">';
	defaultContent+='<br/>请在此输入正文<br/><br/><br/>';
	var matrixercode ='<br/>======欢迎点击图片扫描二维码关注以下公众号=====<br/>';
	var matrixsize=0;
	<c:forEach var="wechatCredential" items="${wechatCredentials}">
		<c:if test="${wechatCredential.id!=credential.id}">
			matrixercode +='<img src="${wechatCredential.qrcode}" style="width:120px;height:120px;">';
			matrixsize+=1;
		</c:if>
		</c:forEach>
	if(matrixsize>0)
		defaultContent+=matrixercode;
</script>
      <link href="${ctx}/css/bootstrap.min.css" rel="stylesheet">
      <link href="${ctx}/css/animate.min.css" rel="stylesheet">
      <!-- Custom styling plus plugins -->
      <link href="${ctx}/css/custom.css" rel="stylesheet">
      <link href="${ctx}/css/icheck/flat/green.css" rel="stylesheet">
      <!-- editor -->
      <link href="${ctx}/css/editor/external/google-code-prettify/prettify.css" rel="stylesheet">
      <link href="${ctx}/css/editor/index.css" rel="stylesheet">
      <!-- select2 -->
      <link href="${ctx}/css/select/select2.min.css" rel="stylesheet">
      <!-- switchery -->
      <link rel="stylesheet" href="${ctx}/css/switchery/switchery.min.css" />
      <script src="${ctx}/js/jquery.min.js"></script>
      <jsp:include page="../headv2.jsp" />
      <script type="text/javascript" charset="utf-8" src="${ctx}/js/bootstrap-dialog.min.js"></script>
      <!-- 页面Js文件的引用 -->
      <script type="text/javascript" src="${ctx}/js/weixinv2/material/newsList.js"></script>
      <script type="text/javascript" src="${ctx}/js/weixinv2/mediaHistory.js"></script>
      <script type="text/javascript" src="${ctx}/js/ajaxfileupload.js"></script>
      <!-- chart js -->
      <script src="${ctx}/js/chartjs/chart.min.js"></script>
      <!-- bootstrap progress js -->
      <script src="${ctx}/js/progressbar/bootstrap-progressbar.min.js"></script>
      <script src="${ctx}/js/nicescroll/jquery.nicescroll.min.js"></script>
      <!-- icheck -->
      <script src="${ctx}/js/icheck/icheck.min.js"></script>
      <!-- tags -->
      <script src="${ctx}/js/tags/jquery.tagsinput.min.js"></script>
      <!-- switchery -->
      <script src="${ctx}/js/switchery/switchery.min.js"></script>
      <!-- daterangepicker -->
      <script type="${ctx}/text/javascript" src="js/moment.min2.js"></script>
      <script type="${ctx}/text/javascript" src="js/datepicker/daterangepicker.js"></script>
      <!-- richtext editor -->
      <script src="${ctx}/js/editor/bootstrap-wysiwyg.js"></script>
      <script src="${ctx}/js/editor/external/jquery.hotkeys.js"></script>
      <script src="${ctx}/js/editor/external/google-code-prettify/prettify.js"></script>
      <!-- select2 -->
      <script src="${ctx}/js/select/select2.full.js"></script>
      <!-- form validation -->
      <script type="text/javascript" src="${ctx}/js/parsley/parsley.min.js"></script>
      <!-- textarea resize -->
      <script src="${ctx}/js/textarea/autosize.min.js"></script>
      <script>
	autosize($('.resizable_textarea'));
</script>
      <!-- Autocomplete -->
      <script type="text/javascript" src="${ctx}/js/autocomplete/countries.js"></script>
      <script src="${ctx}/js/autocomplete/jquery.autocomplete.js"></script>
      <script type="text/javascript" src="${ctx}/js/jquery.form.js"></script>
      <!-- 修改 -->
      <style>
        .right_col * {
          font-size: 13px;
        }
        .last a {
          margin-right: 5px;
        }

        .bootstrap-dialog-footer-buttons button {
          margin-bottom: 5px !important
        }

        /*.imgcover {
          width: 120px;
          height: 120px;
          background-image: url('images/upimage.png');
          background-size: 100% 100%;
        }*/

        .imgcover {
          border: 1px solid #f5f5f5;
          width: 120px;
          height: 120px;
          background-image: url('${ctx }/images/upimage.png');
          background-size: 100% 100%;
          margin: 10px;
        }
        .newcontentpart {
          margin: 10px
        }

        /*.modal-dialog-mainform {
          width: 1000px !important;
          height: 620px !important;
          margin: 30px auto 0px auto !important;
        }

        .modal-content-mainform {
          width: 1000px !important;
          height: 620px !important;
        }
*/
        #editor img {
          max-width: 100%;
          height: auto !important;
        }

        .load {
          margin: auto;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 1000;
        }

        .fa-small-size {
          font-size: 12px;
          font-weight: bolder;
          vertical-align: middle;
        }

        table {
          font-size: 13px;
        }

        .table>thead>tr>th,
        .table>tbody>tr>th,
        .table>tfoot>tr>th,
        .table>thead>tr>td,
        .table>tbody>tr>td,
        .table>tfoot>tr>td {
          vertical-align: middle;
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
          <div class="right_col" role="main">
            <div class="x_panel">
              <div style='display: none' id="loadGif" class="load">
                <img src='images/loadingPic.gif' class="load" alt='' />
              </div>
              <h4 class="modal-title" id="myModalLabel">编辑图文组</h4>
              <a href="weixinv2/material/newsCreator.do?mediaid=${mediaId }&wxid=${credentialId }" class="btn btn-default" style="float: right">新增文章</a>
              <div class="form-group">
                <input id="mediaId" name="mediaId" value="${mediaId }" style="display: none">
              </div>
              <div class="form-group">
                <input id="credentialId" name="credentialId" value="${credentialId }" style="display: none">
              </div>
              <table id="wechattable" class="table table-striped responsive-utilities jambo_table">
                <thead>
                  <tr class="headings">
                    <th style="width: 80px">封面</th>
                    <th>标题</th>
                    <th class=" no-link last" style="width: 150px">
                      <span class="nobr">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <c:forEach var="newsList" items="${newsLists}">
                    <tr id="record-${newsList.id}" class="even pointer">
                      <c:if test="${newsList.cover!=null}">
                        <td class=" ">
                          <img id="record-cover-${newsList.id}" class="coverimg lazy" src="images/loading.png" style="height: 40px; width: 70px" data-original="${newsList.cover.localuri}"
                            src="">
                        </td>
                      </c:if>
                      <c:if test="${newsList.cover==null}">
                        <td id="record-title-${newsList.id}" class=" ">
                          <img class="coverimg" data-original="" src="">
                        </td>
                      </c:if>
                      <td id="record-title-${newsList.id}" class=" ">${newsList.title }</td>
                      <td class=" last">
                        <a href="weixinv2/material/newsCreator.do?mediaid=${mediaId }&wxid=${credentialId }&newsid=${newsList.id }" href="javascript:;">编辑</a>
                        <a class='article-nums' onclick="delWechatNews('${newsList.id }')" href="javascript:;">删除文章</a>
                      </td>
                    </tr>
                  </c:forEach>
                </tbody>
              </table>
              <!-- wechattable end -->
              <a class="btn btn-default article-back" href="weixinv2/material/mediaHistory.do?id=${credentialId }">返回</a>
              <button type="button" class="btn btn-default" onclick="previewBroadcastModal('${mediaId }')">预览</button>
              <button type="button" class="btn btn-default" onclick="addBroadcastModal('${mediaId }',0,0)">推送到矩阵</button>
              <button type="button" class="btn btn-default" onclick="addBroadcastModal('${mediaId }',1,'${credentialId}')">群发</button>
              <button type="button" class="btn btn-default" onclick="delWechatMedia()">删除</button>
            </div>
            <footer>
              <jsp:include page="../footerv2.jsp" />
            </footer>
          </div>
        </div>
      </div>
    </body>

    </html>
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
                <c:forEach var="selectWechatCredential" items="${wechatCredentials}">
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
               <%--<c:forEach var="selectWechatCredential" items="${wechatCredentials}">
                  <tr class="even pointer" id="tr_${selectWechatCredential.id }">
                    <td class=" ">
                      <label id="credentiallabel_${selectWechatCredential.id }">
										<input type="checkbox" id="checkbox_${selectWechatCredential.id }">${selectWechatCredential.wxName }</label>
                    </td>
                    <td class=" ">
                      <div class="form-group">
                        <select class="form-control form-group" id="target_${selectWechatCredential.id }" disabled="disabled">
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
                  </tr>
                </c:forEach>--%>
              </tbody>
            </table>
          </div>
          <div clas="ln_solid"></div>
          <br />
          <div class="form-group" style="margin: 0 auto; text-align: center;">
            <button type="button" class="btn btn-primary" style="margin: 0 auto; text-align: center;" onclick="addBroadcast()">确定</button>
            <button type="button" class="btn" style="margin: 0 auto; text-align: center;" data-dismiss="modal">取消</button>
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
                    <c:forEach var="current" items="${wechatCredentials}">
                      <c:if test="${current.accountType!='3'}">
                        <c:if test="${wechatCredential.id==current.id}">
                          <option value="${current.id}" selected="selected">${current.wxName}</option>
                        </c:if>
                        <c:if test="${wechatCredential.id!=current.id}">
                          <option value="${current.id}">${current.wxName}</option>
                        </c:if>
                      </c:if>
                    </c:forEach>
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
            <button type="button" class="btn btn-primary" style="margin: 0 auto; text-align: center;" onclick="previewBroadcast()">确定</button>
            <button type="button" class="btn" style="margin: 0 auto; text-align: center;" data-dismiss="modal">取消</button>
          </div>
          <div clas="ln_solid"></div>
          <br />
        </div>
      </div>
    </div>
    <script src="${ctx}/module/jquery.lazyload.min.js"></script>
    <!-- form validation -->
    <script type="text/javascript">

	$(function() {
		    $("img.lazy").lazyload();
	});
	function normalsize() {
		$('#metaform').css("display","block");
		$('#editor').css("max-height","250px");
		$('#editor').css("height","250px");
	}
	function maxsize() {
		$('#metaform').css("display","none");
		$('#editor').css("max-height","430px");
		$('#editor').css("height","430px");

	}
</script>
    <!-- /editor -->