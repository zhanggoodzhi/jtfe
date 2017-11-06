<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <!DOCTYPE html>
  <html lang="zh-CN">
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />

    <head>
      <jsp:include page="../../headv2.jsp" />
      <link href="${ctx }/module/DataTables/DataTables-1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet" type="text/css"
      />
      <!--datatables css-->
      <link href="${ctx }/css/datatables-custom.css" rel="stylesheet" type="text/css" />
      <!--user css-->
      <script src="${ctx }/module/DataTables/DataTables-1.10.15/js/jquery.dataTables.min.js"></script>
      <script src="${ctx }/module/DataTables/Select-1.2.2/js/dataTables.select.min.js"></script>
      <!--datatables js-->
      <script src="${ctx }/js/bootstrap-dialog.min.js"></script>
      <!--bootstrap-dialog js-->
      <script src="${ctx }/js/knowledge/keyword/index.js"></script>
      <!--user js-->
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
                  <form class="form-horizontal form-label-left">
                    <div class="form-group-wrap">
                      <div class="form-group">
                        <label class="input-title">关键词</label>
                        <div class="input-wrap">
                          <input type="text" class="form-control input-sm" id="keyword">
                        </div>
                      </div>
                    </div>
                    <div class="form-group-wrap">
                      <div class="form-group">
                        <button class="btn btn-primary btn-sm" type="button" id="search-btn">查询</button>
                        <button class="btn btn-primary btn-sm" type="button" id="add-btn">添加</button>
                        <button class="btn btn-danger btn-sm" type="button" id="del-btn">删除</button>
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
    </body>

  </html>