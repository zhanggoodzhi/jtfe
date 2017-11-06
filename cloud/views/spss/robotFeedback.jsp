<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <!DOCTYPE html>
  <html lang="zh-CN">
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />

    <head>
      <jsp:include page="../headv2.jsp" />
      <link href="${ctx }/module/DataTables/DataTables-1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet" type="text/css"
      />
      <!--datatables css-->
      <link href="${ctx }/css/datatables-custom.css" rel="stylesheet" type="text/css" />
      <!--user css-->
      <link href="${ctx }/module/jstree/themes/default/style.min.css" rel="stylesheet" type="text/css" />
      <!--jstree css-->
      <script src="${ctx }/module/DataTables/DataTables-1.10.15/js/jquery.dataTables.min.js"></script>
      <script src="${ctx }/module/DataTables/Select-1.2.2/js/dataTables.select.min.js"></script>
      <!--datatables js-->
      <script src="${ctx }/module/moment/moment.min.js"></script>
      <!--moment.js-->
      <script src="${ctx }/js/bootstrap-dialog.min.js"></script>
      <!--bootstrap-dialog js-->
      <script src="${ctx }/module/jstree/jstree.min.js"></script>
      <!--jstree js-->
      <script src="${ctx }/js/spss/robotFeedback.js"></script>
      <!--user js-->
      <style>
        td {
          word-wrap: break-word;
          max-width: 400px;
        }
        
        .tree-wrap {
          position: absolute;
          z-index: 1050;
          padding: 0;
          top: 29px;
          border: 1px solid #7A9CD3;
          box-sizing: border-box;
          background-color: #FFF;
          font-size: 12px;
          display: none;
          max-height: 500px;
          overflow-y: auto;
          overflow-x: visible;
          padding-right: 10px;
        }
        
        .tree-wrap::-webkit-scrollbar {
          display: none;
          background-color: transparent;
        }
        
        .tree-wrap>ul {
          list-style: none;
          line-height: 20px;
        }
        
        #select-classify-text,
        #edit-select-classify-text {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          line-height: 20px;
          cursor: default;
        }
        
        .select-classify-wrap {
          width: 210px;
          position: relative;
        }
        
        .select-all {
          margin-left: 35px;
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
          <div class="right_col" role="main">
            <div class="x_panel">
              <div class="x_content">
                <div class="search-area">
                  <form class="form-horizontal form-label-left">
                    <div class="form-group-wrap">
                      <div class="form-group">
                        <label class="input-title">关键字</label>
                        <div class="input-wrap">
                          <input type="text" class="form-control input-sm" id="keyword">
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="input-title">类型</label>
                        <div class="input-wrap select-classify-wrap">
                          <div class="form-control input-sm" id="select-classify-text" data-value="">所有问题</div>
                          <div class="tree-wrap" id="select-classify"></div>
                        </div>
                      </div>
                    </div>
                    <div class="form-group-wrap">
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
                    </div>
                  </form>
                </div>
                <table id="key-table" class="display table key-table"></table>
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