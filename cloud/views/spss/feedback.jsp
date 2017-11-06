<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <!DOCTYPE html>
  <html lang="zh-CN">
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />

    <head>
      <jsp:include page="../headv2.jsp" />
      <link href="${ctx }/module/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet" type="text/css" />
      <!--daterangepicker css-->
      <link href="${ctx }/module/DataTables/DataTables-1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet" type="text/css"
      />
      <!--datatables css-->
      <link href="${ctx }/css/datatables-custom.css" rel="stylesheet" type="text/css" />
      <!--user css-->
      <!--<link href="${ctx }/module/jstree/themes/default/style.min.css" rel="stylesheet" type="text/css" />-->
      <!--jstree css-->
      <link href="${ctx }/css/spss/feedback.css" rel="stylesheet" type="text/css" />
      <!--user css-->
      <script src="${ctx }/module/DataTables/DataTables-1.10.15/js/jquery.dataTables.min.js"></script>
      <script src="${ctx }/module/DataTables/Select-1.2.2/js/dataTables.select.min.js"></script>
      <!--datatables js-->
      <script src="${ctx }/module/moment/moment.min.js"></script>
      <!--moment.js-->
      <!--<script src="${ctx }/module/jstree/jstree.min.js"></script>-->
      <!--jstree js-->
      <script src="${ctx }/module/charjs/Chart.min.js"></script>
      <!--charjs js-->
      <script src="${ctx }/module/bootstrap-daterangepicker/daterangepicker.min.js"></script>
      <!--bootstrap-daterangepicker js-->
      <script src="${ctx }/js/spss/feedback.js"></script>
      <!--user js-->
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
          <div class="right_col" role="main">
            <div class="x_panel">
              <div class="x_content">
                <section class="clearfix report-wrap">
                  <h3 class="section-title">问答满意率统计</h3>
                  <header class="form-wrap">
                    <form action="" class="form-horizontal form-label-left clearfix">
                      <div class="form-group pull-left">
                        <label class="control-label form-label">时间：</label>
                        <div class="time-wrap">
                          <input type="text" class="form-control input-sm" id="report-time">
                        </div>
                      </div>
                      <!--<div class="form-group pull-right">
                                                <button class="btn btn-primary btn-sm" type="button" id="export-btn">导出</button>
                                            </div>
                                            <div class="form-group pull-right">
                                                <label class="input-title">导出图表:</label>
                                                <div class="input-wrap export-wrap">
                                                    <select class="form-control input-sm" id="export-select">
                                                        <option value="">全部</option>
                                                        <option value="#report-bar">问答满意率柱状图</option>
                                                        <option value="#report-pie">问答满意率饼图</option>
                                                        <option value="#count">智能客服满意度饼图</option>
                                                    </select>
                                                </div>
                                            </div>-->
                    </form>
                  </header>
                  <div class="col-md-6">
                    <canvas id="report-bar"></canvas>
                  </div>
                  <div class="col-md-6">
                    <canvas id="report-pie"></canvas>
                  </div>
                </section>
                <section id="category-list" class="clearfix categoryList-wrap">
                  <h3 class="section-title">问答满意率分类统计</h3>
                  <table id="category" class="display table key-table"></table>
                </section>
                <section class="clearfix count-wrap">
                  <h3 class="section-title">智能客服满意度统计</h3>
                  <div class="col-md-6 col-md-offset-3">
                    <canvas id="count"></canvas>
                  </div>
                </section>
                <section>
                  <h3 class="section-title">智能客服满意度详情</h3>
                  <div class="search-area">
                    <form class="form-horizontal form-label-left">
                      <div class="form-group-wrap">
                        <div class="form-group">
                          <label class="input-title">满意度</label>
                          <div class="input-wrap">
                            <select class="form-control input-sm" id="score-val">
                                                            <option value="">全部</option>
                                                            <option value="100">非常满意</option>
                                                            <option value="75">满意</option>
                                                            <option value="50">一般</option>
                                                            <option value="25">不满意</option>
                                                            <option value="0">非常不满意</option>
                                                        </select>
                          </div>
                        </div>
                        <div class="form-group pull-right">
                          <label class="input-title page-change-wrap">每页显示</label>
                          <div class="input-wrap">
                            <select id="page-change" class="form-control input-sm">
                                                            <option value="20">20</option>
                                                            <option value="50">50</option>
                                                            <option value="100">100</option>
                                                        </select>
                          </div>
                        </div>
                        <!--<div class="form-group-wrap">
                                                <div class="form-group">
                                                    <button class="btn btn-primary btn-sm" type="button" id="search-btn">查询</button>
                                                </div>

                                                <div class="form-group pull-right">
                                                    <label class="input-title page-change-wrap">每页显示</label>
                                                    <div class="input-wrap">
                                                        <select id="page-change" class="form-control input-sm">
													<option value="20">20</option>
													<option value="50">50</option>
													<option value="100">100</option>
												</select>
                                                    </div>
                                                    <label class="input-title page">条数据</label>
                                                </div>
                                            </div>-->
                    </form>
                    </div>
                    <table id="key-table" class="display table key-table"></table>
                </section>
                </div>
              </div>
              <footer>
                <jsp:include page="../footerv2.jsp" />
              </footer>
            </div>
          </div>
        </div>
        <div class="modal fade" id="view-record-modal">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">查看聊天记录</h4>
              </div>
              <div class="modal-body">
                <table id="view-record" class="display table"></table>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
              </div>
            </div>
            <!-- /.modal-content -->
          </div>
          <!-- /.modal-dialog -->
        </div>
        <!-- /.modal -->
    </body>

  </html>