<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <jsp:include page="../headv2.jsp" />
      <script src="${ctx }/js/jquery.min.js"></script>
      <script type="text/javascript" charset="utf-8" src="${ctx }/js/bootstrap-dialog.min.js"></script>
      <script type="text/javascript" src="${ctx }/js/jquery.form.js"></script>
      <script type="text/javascript" src="${ctx }/js/weixinv2/updateWechatCredentialInfo.js"></script>
      <style>
        .imgcover {
          width: 120px;
          height: 120px;
          background-image: url('${wechatCredential.qrcode }');
          background-size: 100% 100%;
        }

        .control-label {
          text-align: right;
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
              <h4 class="modal-title" id="myModalLabel">编辑公众号</h4>
              <form id="updateWechatCredentialInfo" name="updateWechatCredentialInfo" data-parsley-validate class="form-horizontal form-label-left"
                action="${ctx}/weixinv2/updateWechatCredential" method="POST">
                <div class="form-group">
                  <input name="id" value=${wechatCredential.id } style="display: none">
                </div>
                <div class="form-group">
                  <label class="control-label col-md-3 col-sm-3 col-xs-12" for="wxName">微信公众号 <span class="required">*</span>
							</label>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" id="wxName" name="wxName" value="${wechatCredential.wxName }" required="required" class="form-control col-md-7 col-xs-12">
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-3 col-sm-3 col-xs-12" for="wxAppId">AppID <span class="required">*</span>
							</label>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" id="wxAppId" name="wxAppId" value="${wechatCredential.wxAppId }" required="required" class="form-control col-md-7 col-xs-12"
                      readonly>
                  </div>
                </div>
                <div class="form-group">
                  <label for="appSecret" class="control-label col-md-3 col-sm-3 col-xs-12">AppSecret</label>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" id="appSecret" name="appSecret" value="${wechatCredential.appSecret }" required="required" class="form-control col-md-7 col-xs-12"
                      readonly>
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-3 col-sm-3 col-xs-12">账号类型</label>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <div id="accountType" class="btn-group" data-toggle="buttons" >
                      <c:if test="${wechatCredential.accountType=='1'}">
                        <label class="btn btn-default active" data-toggle-class="btn-primary" data-toggle-passive-class="btn-default"> <input
											type="radio" id="accountType1" name="accountType" value="1"
											checked="checked"> 服务号
										</label>
                      </c:if>
                      <c:if test="${wechatCredential.accountType!='1'}">
                        <label class="btn btn-default disabled" data-toggle-class="btn-primary" data-toggle-passive-class="btn-default"> <input
                          type="radio" id="accountType1" name="accountType" value="1"  >服务号
										</label>
                      </c:if>
                      <c:if test="${wechatCredential.accountType!='2'}">
                        <label class="btn btn-default disabled" data-toggle-class="btn-primary" data-toggle-passive-class="btn-default"> <input
											type="radio" id="accountType2" name="accountType" value="2"  >订阅号
										</label>
                      </c:if>
                      <c:if test="${wechatCredential.accountType=='2'}">
                        <label class="btn btn-default active" data-toggle-class="btn-primary" data-toggle-passive-class="btn-default"> <input
											type="radio" id="accountType2" name="accountType" value="2"
											checked="checked"  > 订阅号
										</label>
                      </c:if>
                      <c:if test="${wechatCredential.accountType=='3'}">
                       <label class="btn btn-default active" data-toggle-class="btn-primary" data-toggle-passive-class="btn-default"> <input
                          type="radio" id="accountType3" name="accountType" value="3"
                          checked="checked" > 企业号
                        </label>
                      </c:if>
                      <c:if test="${wechatCredential.accountType!='3'}">
                       <label class="btn btn-default disabled" data-toggle-class="btn-primary" data-toggle-passive-class="btn-default"> <input
                          type="radio" id="accountType3" name="accountType" value="3"  > 企业号
                        </label>
                      </c:if>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="description" class="control-label col-md-3 col-sm-3 col-xs-12">公众号介绍</label>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <input type="text" id="description" name="description" value="${wechatCredential.description }" class="form-control col-md-7 col-xs-12">
                  </div>
                </div>
                <input type="text" class="form-control" name="coverLocalUri" id="coverLocalUri" value="${wechatCredential.qrcode }" style="display: none">
              </form>
              <form id="imgForm" name="imgForm" action="" enctype="multipart/form-data">
                <div class="col-md-12">
                  <label class="control-label col-md-3 col-sm-3 col-xs-12">公众号二维码</label>
                  <div class="col-md-6 col-sm-6 col-xs-12">
                    <div id="imgcover_0" class="imgcover"></div>
                    <div id="container" class="moxie-shim" style="position: absolute; top: 1px; left: 11px; width: 120px; height: 120px; overflow: hidden; z-index: 0;">
                      <input type="file" style="cursor: pointer; font-size: 999px; opacity:0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"
                        id="upfile_0" onchange="uploadQrcode()" name="attach" accept="image/png, image/jpeg, image/jpg">
                    </div>
                  </div>
                </div>
              </form>
              <div class="ln_solid"></div>
              <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-4">
                <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3" style="margin: 0 auto; text-align: center;">
                  <button type="button" class="btn btn-primary" onclick="formSubmit()">提交</button>
                  <button type="button" class="btn btn-default" onclick="window.location.href='weixinv2/index.do'" data-dismiss="modal">取消</button>
                </div>
              </div>
            </div>
            <footer>
              <jsp:include page="../footerv2.jsp" />
            </footer>
          </div>
        </div>
      </div>
    </body>

    </html>