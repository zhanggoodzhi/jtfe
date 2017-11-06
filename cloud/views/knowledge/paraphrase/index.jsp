<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <!DOCTYPE html>
  <html lang="zh-CN">
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
      <c:set var="ctx" value="${pageContext.request.contextPath}" />

      <head>
        <jsp:include page="../../headv2.jsp" />
        <link href="${ctx}/module/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet" type="text/css" />
        <!--daterangepicker css-->
        <link href="${ctx}/module/DataTables/DataTables-1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet" type="text/css"
        />
        <!--datatables css-->
        <link href="${ctx}/module/wangEditor/css/wangEditor.min.css" rel="stylesheet" type="text/css" />
        <!--editor css-->
        <link href="${ctx}/module/jstree/themes/default/style.min.css" rel="stylesheet" type="text/css" />
        <!--jstree css-->
        <link href="${ctx}/css/datatables-custom.css" rel="stylesheet" type="text/css" />
        <link href="${ctx}/css/knowledge/corpuslist.css" rel="stylesheet" type="text/css" />
        <!--user css-->
        <script src="${ctx}/module/bootstrap-daterangepicker/moment.min.js"></script>
        <script src="${ctx}/module/bootstrap-daterangepicker/daterangepicker.min.js"></script>
        <!--bootstrap-daterangepicker js-->
        <script src="${ctx}/module/DataTables/DataTables-1.10.15/js/jquery.dataTables.min.js"></script>
        <script src="${ctx}/module/DataTables/Select-1.2.2/js/dataTables.select.min.js"></script>
        <!--datatables js-->
        <script src="${ctx}/js/bootstrap-dialog.min.js"></script>
        <!--bootstrap-dialog js-->
        <script src="${ctx}/module/wangEditor/js/wangEditor.min.js"></script>
        <!--editor js-->
        <script src="${ctx}/module/jstree/jstree.min.js"></script>
        <!--jstree js-->
        <script src="${ctx}/js/knowledge/paraphrase/index.js"></script>
        <!--user js-->
        <style>
          .rule-name {
            text-align: left !important;
          }
          
          #rotate {
            display: inline-block;
          }
          
          #create-modal .selected {
            position: relative;
          }
          
          #init-modal .input-title {
            width: auto;
          }
          
          #create-modal .input-title {
            width: auto;
          }
          
          .rule-list-wrap {
            width: 150px;
          }
          
          .preview-area {
            width: 100%;
            height: 230px;
            overflow: auto;
            outline-width: 0 !important;
          }
          
          .answer-table {
            width: 100%;
          }
          
          #answer-content {
            width: 350px;
          }
          
          .content-wrap {
            position: relative;
          }
          
          .remove-this {
            width: 15px;
            height: 15px;
            position: absolute;
            top: -6px;
            right: 4px;
            cursor: pointer;
          }
          
          .remove-this>img {
            display: block;
            width: 100%;
            height: 100%;
          }
          
          .modal-dialog {
            margin: 30px auto;
          }
        </style>
      </head>

      <body class="nav-md">
        <div class="container body">
          <div class="main_container">
            <div class="col-md-3 left_col">
              <jsp:include page="../../leftv2.jsp" />
            </div>
            <div class="top_nav">
              <jsp:include page="../../topnavv2.jsp" />
            </div>
            <!-- page content -->
            <div class="right_col" role="main">
              <div class="x_panel">
                <div class="x_content">
                  <div class="search-area">
                    <form class="form-horizontal form-label-left" id="search-form">
                      <div class="form-group-wrap">
                        <div class="form-group">
                          <label class="input-title">类型</label>
                          <div class="input-wrap select-classify-wrap">
                            <div class="form-control input-sm" id="select-classify-text" data-value="">所有问题</div>
                            <div class="tree-wrap" id="select-classify">
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="input-title">状态</label>
                          <div class="input-wrap input-wrap-sm">
                            <select class="form-control input-sm" id="select-status" name="corpusStatus">
                                                        <option value="">全部</option>
                                                        <option value="1">未审核</option>
                                                        <option value="8">已审核</option>

                                                    </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="input-title">角色</label>
                          <div class="input-wrap input-wrap-sm">
                            <select class="form-control input-sm" id="select-character" name="character">
                                                        <option value="">全部</option>
                                                        <c:forEach var="character" items="${selectmapObject.Characters}">
                                                            <option value="${character.id}">${character.name}</option>
                                                        </c:forEach>
                                                    </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="input-title">问题</label>
                          <div class="input-wrap">
                            <input type="text" class="form-control input-sm" placeholder="关键词" id="form-question">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="input-title">回复</label>
                          <div class="input-wrap">
                            <input type="text" class="form-control input-sm" placeholder="关键词" id="form-answer">
                          </div>
                        </div>
                        <div class="form-group ">
                          <label class="input-title">更新时间</label>
                          <div class="input-wrap form-date-wrap">
                            <input type="text" id="form-date" class="form-control input-sm form-date">
                          </div>
                        </div>
                      </div>
                      <div class="form-group-wrap">
                        <div class="form-group">
                          <div class="checkbox search-type-wrap">
                            <label>
                                                        <input type="checkbox" name="search-type" id="search-type">全文匹配
                                                    </label>
                          </div>
                          <button class="btn btn-primary btn-sm" type="button" id="search-btn">查询</button>
                          <button class="btn btn-primary btn-sm" type="button" id="create-rule-btn">创建复述规则</button>
                          <button class="btn btn-primary btn-sm" type="button" id="init-rule-btn">复述生成</button>
                        </div>
                        <div class="form-group pull-right">
                          <label class="input-title page-change-wrap">每页显示</label>
                          <div class="input-wrap">
                            <select id="page-change" class="form-control input-sm">
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                    <option value="200">200</option>
                                                    <option value="500">500</option>
                                                    <option value="1000">1000</option>
                                                </select>
                          </div>
                          <label class="input-title page">条数据</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <table id="key-table" class="display table key-table"></table>
                </div>
              </div>
              <footer>
                <jsp:include page="../../footerv2.jsp" />
              </footer>
            </div>
          </div>
        </div>
        <div class="modal fade" id="create-modal" data-backdrop="false">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">创建复述规则功能</h4>
              </div>
              <div class="modal-body">
                <form class="form-horizontal">
                  <div class="form-group clearfix">
                    <label class="input-title">规则名称</label>
                    <div class="col-md-5">
                      <input type="text" name="ruleName" id="rule-name" class="form-control input-sm">
                    </div>
                  </div>
                  <div class="form-group clearfix" id="new-tag-btn-wrap">
                    <button type="button" class="btn btn-success pull-right btn-sm" id="new-tag-btn">新建标签</button>
                    <!--<button type="button" class="btn btn-success pull-right btn-sm" id="remove-tag-btn">删除标签</button>-->
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="create-submit-btn">确定</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
              </div>
            </div>
            <!-- /.modal-content -->
          </div>
        </div>
        <div class="modal fade" id="init-modal" data-backdrop="false">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">复述生成</h4>
              </div>
              <div class="modal-body">
                <from class="form-horizontal">
                  <div class="form-group">
                    <div>
                      <label class="input-title">选择规则</label>
                      <div class="input-wrap rule-list-wrap">
                        <select id="rule-list" class="form-control input-sm"></select>
                      </div>
                    </div>
                    <div>
                      <label class="input-title">分类</label>
                      <div class="input-wrap select-classify-wrap">
                        <div class="form-control input-sm" name="classify" id="edit-select-classify-text" data-value=""></div>
                        <div class="tree-wrap" id="edit-select-classify">
                        </div>
                      </div>
                    </div>
                    <button type="button" class="btn btn-success pull-right btn-sm" id="preview">预览</button>
                  </div>
                  <div class="form-group" id="options-area"></div>
                  <div class="form-group">
                    <textarea class="preview-area" name="preview-area" id="preview-area" readonly="readonly"></textarea>
                  </div>
                  <div class="form-group">
                    <table class="answer-table" id="answer-table">
                      <thead>
                        <tr>
                          <th>回复</th>
                          <th>状态</th>
                          <th>角色</th>
                          <th>生效时间</th>
                          <th>失效时间</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="answer">
                            <div class="show-title" id="answer-content" data-html="<p>无答案</p>">
                              无答案
                            </div>
                          </td>
                          <td class="answer">
                            <div class="input-wrap">
                              <select name="status" id="status" class="form-control input-sm">
                                                                <option value="1">未审核</option>
                                                                <option value="8" selected="true">已审核</option>
                                                            </select>
                            </div>
                          </td>
                          <td class="answer">
                            <div class="input-wrap">
                              <select name="character" class="form-control input-sm" id="character"></select>
                            </div>
                          </td>
                          <td class="answer">
                            <div class="inptu-wrap">
                              <input name="beginTime" id="begin-date" type="text" class="form-control date input-sm">
                            </div>
                          </td>
                          <td class="answer">
                            <div class="inptu-wrap">
                              <input name="endTime" id="end-date" type="text" class="form-control date input-sm">
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="form-group">
                    <div id="editor">
                      <p>无答案</p>
                    </div>
                  </div>
                </from>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="init-submit-btn">确定</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
              </div>
            </div>
          </div>
        </div>
        <script>
          var selectData = JSON.parse('${selectmap}')[0];
        </script>
      </body>

  </html>