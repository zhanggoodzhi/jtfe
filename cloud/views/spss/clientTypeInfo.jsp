<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <jsp:include page="../headv2.jsp" />
      <link href="${ctx}/lib/ligerUI/skins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css">
      <link href="${ctx }/css/common.css" rel="stylesheet" type="text/css" media="all" />
      <link rel="stylesheet" type="text/css" href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css">
      <link rel="stylesheet" type="text/css" href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">
      <script type="text/javascript" src="${ctx}/jquery-easyui-1.3.6/jquery.min.js"></script>
      <script type="text/javascript" src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
      <script type="text/javascript" src="${ctx}/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js"></script>
      <script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
      <script src="${ctx}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
      <script src="${ctx}/lib/ligerUI/js/plugins/ligerComboBox.js" type="text/javascript"></script>
      <script src="${ctx}/lib/ligerUI/js/plugins/ligerTree.js" type="text/javascript"></script>
      <script src="${ctx}/lib/ligerUI/js/plugins/ligerDialog.js" type="text/javascript"></script>
      <script src="${ctx}/lib/ligerUI/js/plugins/ligerDateEditor.js" type="text/javascript"></script>
      <script type="text/javascript" src="${ctx}/js/esl.js"></script>
      <script type="text/javascript" src="${ctx}/js/knowledge/cloudUtil.js"></script>
      <script type="text/javascript">
        var contextPath = '${pageContext.request.contextPath}';
        var currentTime = '${currentTime}';
      </script>
      <script type="text/javascript" src="${ctx }/js/spss/clientTypeInfo.js"></script>
      <script type="text/javascript" src="${ctx}/js/spss/statTopWord.js"></script>
      <style type="text/css">
        .toolbar {
          height: 40px;
        }

        #clientTypeInfoChart {
          min-height: 300px;
        }
        .l-text.l-text-combobox{
          overflow:hidden!important;
        }
      </style>
      <script type="text/javascript">
        var appName = '${ctx}';

        var contextPath = '${pageContext.request.contextPath}';
        var currentTime = '${currentTime}';
      </script>
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
              <div class="" role="tabpanel" data-example-id="togglable-tabs">
                <ul id="myTab" class="nav nav-tabs bar_tabs" role="tablist">
                  <li role="presentation" class="active"><a href="#tab_content1" id="home-tab" role="tab" data-toggle="tab" aria-expanded="true">问题分类分布</a></li>
                  <li role="presentation" class=""><a href="#tab_content2" role="tab" id="profile-tab" data-toggle="tab" aria-expanded="false">词频数据分析</a></li>
                </ul>
                <div id="myTabContent" class="tab-content">
                  <div role="tabpanel" class="tab-pane fade active in" id="tab_content1" aria-labelledby="home-tab">
                    <div class="toolbar">
                      <div style="float: left; text-align: center;">
                        <label for="stasticsMode" id="stasticsModeLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold; padding-left: 20px;">统计模式:&nbsp;</label>
                        <div class="comboBoxDiv" style="float: left; margin-top: 2px; margin-right: 5px;">
                          <!--<input id="stasticsMode" />-->
                          <select id="stasticsMode" onChange="info.getChangedSelected();" style="height:20px;line-height:20px;font-size:12px;">
                            <option value='0' selected>每日统计(以小时单位)</option>
                            <option value='1'>每月统计(以天单位)</option>
                            <option value='2'>每年统计(以月单位)</option>
                            <option value='3'>任意时段统计(以天单位)</option>
                          </select>
                        </div>
                      </div>
                      <!-- 				<div id="clientInfoInDay"> -->
                      <div style="float: left" class="param">
                        <label for="day" id="dayLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;日期:&nbsp;</label>
                        <div style="float: left; margin-top: 2px; margin-right: 5px;">
                          <input id="day" />
                        </div>
                      </div>
                      <div style="float: left; display: none" class="param">
                        <label for="year" id="yearLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;年:&nbsp;</label>
                        <div style="float: left; margin-top: 2px; margin-right: 5px;" id="gdh">
                          <input id="year"/>
                        </div>
                      </div>
                      <div style="float: left; display: none" class="param">
                        <label for="month" id="monthLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;月:&nbsp;</label>
                        <div style="float: left; margin-top: 2px; margin-right: 5px;">
                          <input id="month" />
                        </div>
                      </div>
                      <div style="float: left; display: none" class="param">
                        <label for="startDay" id="startDayLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;开始日期:&nbsp;</label>
                        <div class="comboBoxDiv" style="float: left; margin-top: 2px; margin-right: 5px;">
                          <input id="startDay" />
                        </div>
                      </div>
                      <div style="float: left; display: none" class="param">
                        <label for="endDay" id="endDayLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;结束日期:&nbsp;</label>
                        <div style="float: left; margin-top: 2px; margin-right: 5px;">
                          <input id="endDay" />
                        </div>
                      </div>
                      <div>
                        <input type="button" value="分析" class="btn02" onclick="info.analyseClient();" style="width: 60px; margin-top: 2px;" />
                      </div>
                    </div>
                    <div id="clientTypeInfoChart" style="border: 0px solid red; margin: 10px 20px 0px 30px;"></div>
                  </div>
                  <div role="tabpanel" class="tab-pane fade" id="tab_content2" aria-labelledby="profile-tab">
                    <div>
                      <div>
                        <input id="txtToday" value="${today }" type="hidden">
                        <select id="selectThe" onchange="onSelectThemonths(this.options[this.selectedIndex].value)" style="width: 280px; height: 26px;">
											<c:forEach var="day" items="${listThemonths }">
												<option value="${day}"
													<c:if test="${day==today}?'selected='selected'':''"></c:if>>${day }</option>
											</c:forEach>
										</select>
                      </div>
                      <div id="divStatTopWord" style="border: 0px solid red; margin: 5px 0px 0px 15px; overflow-y: auto; overflow-x: hidden;">
                        <%-- 				<c:if test="${listStatTopWords!=null }"> --%>
                          <%-- 					<c:forEach var="words" items="${listStatTopWords }"> --%>
                            <%-- 					<span style="" href ="#"  title='出现次数:${words.occurences }'>${words.token }</span>  --%>
                              <%-- 					</c:forEach> --%>
                                <%-- 				</c:if> --%>
                      </div>
                    </div>
                  </div>
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
    <script type="text/javascript">
      $(function () {
        // console.log($('#selectThe').find("option:selected").text());
        onSelectThemonths($('#selectThe').find("option:selected").text());
      })
    </script>

    </html>