<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <!DOCTYPE html>
  <html lang="zh-CN">
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
      <c:set var="ctx" value="${pageContext.request.contextPath}" />

      <head>
        <jsp:include page="../headv2.jsp" />
        <link href="${ctx }/module/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet" type="text/css" />
        <!--daterangepicker css-->
        <link href="${ctx }/module/DataTables/DataTables-1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet" type="text/css"
        />
        <!--datatables css-->
        <link href="${ctx }/module/wangEditor/css/wangEditor.min.css" rel="stylesheet" type="text/css" />
        <!--editor css-->
        <link href="${ctx }/module/jstree/themes/default/style.min.css" rel="stylesheet" type="text/css" />
        <!--ztree css-->
        <link href="${ctx }/css/datatables-custom.css" rel="stylesheet" type="text/css" />
        <link href="${ctx }/css/knowledge/corpuslist.css" rel="stylesheet" type="text/css" />
        <!--user css-->
        <script src="${ctx }/module/bootstrap-daterangepicker/moment.min.js"></script>
        <script src="${ctx }/module/bootstrap-daterangepicker/daterangepicker.min.js"></script>
        <!--bootstrap-daterangepicker js-->
        <script src="${ctx }/module/DataTables/DataTables-1.10.15/js/jquery.dataTables.min.js"></script>
        <script src="${ctx }/module/DataTables/Select-1.2.2/js/dataTables.select.min.js"></script>
        <!--datatables js-->
        <script src="${ctx }/js/bootstrap-dialog.min.js"></script>
        <!--bootstrap-dialog js-->
        <script src="${ctx }/module/wangEditor/js/wangEditor.min.js"></script>
        <!--editor js-->
        <script src="${ctx }/module/jstree/jstree.min.js"></script>
        <!--jstree js-->
        <script src="${ctx }/js/knowledge/editByQ.js"></script>
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
                                                    <c:forEach var="status" items="${selectmapObject.status}">
                                                            <option value="${status.id}">${status.name}</option>
                                                    </c:forEach>
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
                        <!--<div class="form-group">
                                                <label class="input-title">操作人</label>
                                                <div class="input-wrap input-wrap-sm">
                                                    <select class="form-control input-sm" id="select-auditor" name="auditor">
                                                        <c:forEach var="auditor" items="${selectmapObject.auditor}">
                                                            <option value="${auditor.id}">${auditor.name}</option>
                                                        </c:forEach>
                                                    </select>
                                                </div>
                                            </div>-->
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
                        <div class="form-group">
                          <label class="input-title">更新时间</label>
                          <div class="input-wrap">
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
                          <c:if test="${fn:contains(accesslist, 'pair_edit')}">
                            <button class="btn btn-primary btn-sm" type="button" id="edit-btn">编辑</button>
                          </c:if>
                          <c:if test="${fn:contains(accesslist, 'pair_add')}">
                            <button class="btn btn-primary btn-sm" type="button" id="add-btn">添加</button>
                          </c:if>
                          <c:if test="${fn:contains(accesslist, 'pair_check')}">
                            <button class="btn btn-primary btn-sm" type="button" id="check-btn">审核/撤销</button>
                          </c:if>
                          <c:if test="${fn:contains(accesslist, 'pair_upload')}">
                            <button class="btn btn-primary btn-sm" type="button" id="batch-upload-btn">批量上传</button>
                          </c:if>
                          <c:if test="${fn:contains(accesslist, 'pair_exportExcel')}">
                            <button class="btn btn-primary btn-sm" type="button" id="export-btn">导出未审核语料</button>
                          </c:if>
                          <!--<button class="btn btn-primary btn-sm" type="button" id="search-config-btn">查询参数配置</button>-->
                          <c:if test="${fn:contains(accesslist, 'pair_delete')}">
                            <button class="btn btn-danger btn-sm" type="button" id="del-btn">删除</button>
                          </c:if>
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
                        <!--<div class="form-group pull-right">
                                                <div class="num-wrap">
                                                    <span>符合的条目数量:</span>
                                                    <img src="images/throbber.gif" alt="loading" id="num-img">
                                                    <strong id="num"></strong>
                                                    <span>条</span>
                                                </div>
                                            </div>-->
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
        <div class="modal fade edit-table-modal" id="edit-modal" data-backdrop="false">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">编辑</h4>
              </div>
              <div class="modal-body">
                <form action="" class="form-horizontal form-label-left">
                  <div id="question-wrap">
                    <label class="input-title col-md-1 control-label">问题</label>
                    <div class="col-md-7">
                      <input type="text" class="form-control input-sm" id="question">
                    </div>
                  </div>
                  <div>
                    <label class="input-title col-md-1 control-label">分类</label>
                    <div class="col-md-3">
                      <div class="input-wrap select-classify-wrap">
                        <div class="form-control input-sm" name="classify" id="edit-select-classify-text" data-value=""></div>
                        <div class="tree-wrap" id="edit-select-classify">
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <table id="edit-table" class="edit-table">
                </table>
                <form action="" class="form-horizontal form-label-left">
                  <div class="form-group">
                    <div class="checkbox pull-left" id="edit-all-wrap">
                      <label>
                                            <input type="checkbox"  id="edit-all">编辑全部
                                            
                                        </label>
                      <small class="edit-all-message">*勾选此项可以编辑所有答案,不勾选即为编辑单条答案</small>
                    </div>
                    <button class="btn btn-primary btn-sm" type="button" id="edit-table-add-btn">添加</button>
                    <button class="btn btn-danger btn-sm" type="button" id="edit-table-del-btn">删除</button>
                  </div>
                </form>
                <div class="editor-wrap" id="editor-wrap">
                  <div id="editor"></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="save-btn"><span id="confirm">确认</span><i class="fa fa-spinner rotate" id="rotate"></i></button>
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
              </div>
            </div>
            <!-- /.modal-content -->
          </div>
          <!-- /.modal-dialog -->
        </div>
        <!-- /.modal -->
        <div class="modal fade" id="upload-modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">批量上传</h4>
              </div>
              <div class="modal-body">
                <form method="POST" id="upload-form" enctype="multipart/form-data" action="">
                  <div class="file-message">
                    <p><a href="/cloud/uploadFile/corpus/jintongsoft.xls">请按照模板格式上传语料，点击下载模板 </a> </p>
                    <p><a href="/cloud/knowledge/virtualCharactersFile">最新的语料角色信息</a><span> & </span><a href="/cloud/knowledge/classifysFile">最新的语料类型信息</a></p>
                  </div>
                  <div class="file-wrap">
                    <input type="file" id="upload" name="upload" accept=".xls,.xlsx">
                    <div class="upload-bg" id="upload-bg">
                      <i class="fa fa-upload" id="upload-icon-upload"></i>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary">确定</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
              </div>
            </div>
            <!-- /.modal-content -->
          </div>
          <!-- /.modal-dialog -->
        </div>
        <!-- /.modal -->
        <script>
          var selectData = JSON.parse('${selectmap}')[0];
        </script>
      </body>

  </html>