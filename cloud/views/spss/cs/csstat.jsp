<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

    <!DOCTYPE html>
    <html lang="zh-CN">
    <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
        <c:set var="ctx" value="${pageContext.request.contextPath}" />

        <head>
            <jsp:include page="../../headv2.jsp" />

            <link href="${ctx }/css/datatables-custom.css" rel="stylesheet" type="text/css" />
            <!--user css-->

            <link href="${ctx }/module/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet" type="text/css" />
            <!--daterangepicker css-->

            <script src="${ctx }/module/charjs/Chart.min.js"></script>
            <!--charjs js-->

            <script src="${ctx }/module/bootstrap-daterangepicker/moment.min.js"></script>
            <script src="${ctx }/module/bootstrap-daterangepicker/daterangepicker.min.js"></script>
            <!--bootstrap-daterangepicker js-->

            <script src="${ctx }/js/spss/cs/csstat.js"></script>
            <!--user js-->
            <style>
                .form-wrap {
                    margin-bottom: 20px;
                }
                
                .form-horizontal .form-label {
                    float: left;
                    padding: 6px 0;
                }
                
                .input-wrap {
                    float: left;
                    width: 90px;
                }
                
                .time-wrap {
                    float: left;
                    width: 160px;
                }
                
                section {
                    clear: both;
                }
                /*.workTime{
                    display: none;
                }*/
                
                .service-name {
                    clear: both;
                }
                #custom-service-wrap>div{
                    overflow: hidden;
                }
                .time-wrap>input{
                    cursor: pointer;
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
                                <section id="app-wrap">
                                    <header class="form-wrap">
                                        <form action="" class="form-horizontal form-label-left">
                                            <label for="" class="control-label form-label">视图：</label>
                                            <div class="input-wrap">
                                                <select name="view" id="change-view" class="form-control input-sm">
                                                <option value="day">天</option>
                                                <option value="hour">小时</option>
                                            </select>
                                            </div>
                                            <div class="time-wrap">
                                                <input type="text" class="form-control input-sm" id="change-time">
                                            </div>
                                        </form>
                                    </header>
                                    <div class="col-md-6">
                                        <canvas id="user-num"></canvas>
                                    </div>
                                    <div class="col-md-6">
                                        <canvas id="message-num"></canvas>
                                    </div>
                                </section>
                                <section id="server-wrap">
                                    <header class="form-wrap">
                                        <form action="" class="form-horizontal form-label-left">
                                            <label for="" class="control-label form-label">时间：</label>
                                            <div class="time-wrap">
                                                <input type="text" class="form-control input-sm" id="custom-service-change-time">
                                            </div>
                                        </form>
                                    </header>
                                    <div class="col-md-12" id="custom-service-wrap">

                                    </div>
                                </section>
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