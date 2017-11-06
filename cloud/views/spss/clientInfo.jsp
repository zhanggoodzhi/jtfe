<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
  <%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
    <c:set var="ctx" value="${pageContext.request.contextPath}" />
    <!DOCTYPE html>
    <html lang="zh-CN">

    <head>
      <jsp:include page="../headv2.jsp" />
      <link href="${ctx}/lib/ligerUI/skins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css">
      <link href="${ctx }/css/common.css" rel="stylesheet" type="text/css" media="all" />
      <link rel="stylesheet" type="text/css" href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css">
      <link rel="stylesheet" type="text/css" href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">
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
	var columnInfo = ${classifys};
</script>
      <script type="text/javascript" src="${ctx}/js/spss/clientInfo.js"></script>
      <style type="text/css">
        #clientInfoContent,
        #clientInfoInQS,
        #trendChart {
          height: 300px;
        }

        #clientInfoSide {
          height: 300px;
        }
        .l-text.l-text-combobox{
          overflow:hidden!important;
        }
      </style>
      <script type="text/javascript">
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
              <div class="win">
                <img alt="" src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icons/fx.png" class="winImg">                <label class="winLabel">访客地域分析</label>
              </div>
              <div id="myechart" style="height: 600px; border: 0px solid red; padding-top: 10px;"></div>
            </div>
            <div class="x_panel">
              <div class="win">
                <img alt="" src="${ctx}/jquery-easyui-1.3.6/themes/icons/utj.png" class="winImg"> <label class="winLabel">用户数据分析</label>
              </div>
              <div id="clientInfoDiv" style="border: 0px solid red">
                <!-- 左侧主显区 -->
                <div id="clientInfoContent">
                  <div style="float: left; text-align: center;">
                    <label for="stasticsMode" id="stasticsModeLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">统计模式:&nbsp;</label>
                    <div class="comboBoxDiv" style="float: left; margin-top: 2px; margin-right: 5px;">
                      <!--<input id="stasticsMode" />-->
                      <select id="stasticsMode" onChange="clientInfo.getChangedSelected();" style="height:20px;line-height:20px;font-size:12px;">
                        <option value='0' selected>每日统计(以小时单位)</option>
                        <option value='1'>每月统计(以天单位)</option>
                        <option value='2'>每年统计(以月单位)</option>
                        <option value='3'>任意时段统计(以天单位)</option>
                      </select>
                    </div>
                  </div>
                  <div style="float: left" class="param">
                    <label for="day" id="dayLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;日期:&nbsp;</label>
                    <div style="float: left; margin-top: 2px; margin-right: 5px;">
                      <input id="day" />
                    </div>
                  </div>
                  <div style="float: left; display: none" class="param">
                    <label for="year" id="yearLabel" style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;年:&nbsp;</label>
                    <div style="float: left; margin-top: 2px; margin-right: 5px;">
                      <input id="year" />
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
                  <div style="float: left;">
                    <input type="button" value="分析" class="btn02" onclick="clientInfo.analyseClient();" style="width: 60px; margin-top: 2px;"
                    />
                  </div>
                  <div id="toolbar" style="height: 25px;">
                    <label style="font-size: 12px;">用户对话量总数</label>
                    <label>最小条数:&nbsp;</label> <input type="text" id="minCount">&nbsp;
                    <label>最大条数:&nbsp;</label> <input type="text" id="maxCount">&nbsp;
                    <label>用户类型:&nbsp;</label> <select id="is_anonymous">
									<option value="-1">全部</option>
									<option value="0">注册</option>
									<option value="1">访客</option>
								</select> &nbsp;
                    <!-- 						<input type="button" value="查询" class="btn02" > -->
                    <label for="sender" id="senderLabel">用户：</label> <input id="sender" placeholder="请输入用户" style="margin-top: 4px; border: 1px solid #ccc; width: 120px; height: 20px;">
                    <a class="easyui-linkbutton" id="minMax" data-options="iconCls:'icon-search',plain:true">查询</a>
                  </div>
                  <!-- 				</div> -->
                  <div id="clientInfoInQS">
                    <div id="trendChart"></div>
                  </div>
                </div>
                <!-- END 左侧主显区 -->
                <!-- 右侧边栏 -->
                <div id="clientInfoSide" style='display:none'>
                  <table id="clientGrid"></table>
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
    <script type="text/javascript">
	$(document).ready(function() {
		$("#minMax").click(function() {
			var min = document.getElementById("minCount").value;
			var max = document.getElementById("maxCount").value;
			var sender = document.getElementById("sender").value;
			var select = document.getElementById("is_anonymous");
			var is_anomymous = select.options[select.selectedIndex].value;
			if (min == "" && max != "") {
				alert("请输入最少条数");
			} else if (max == "" && min != "") {
				alert("请输入最大条数");
			} else if (Number(min) > Number(max)) {
				alert("最小条数不能超过最大条数");
			} else {
				if (max == "" && min == "") {
					min = 0;
					max = -100;
				}
				clientInfo.selectData(min, max, is_anomymous, sender);
			}

		});

	});
</script>
    <script type="text/javascript">
require.config({
    paths:{
        echarts:'${pageContext.request.contextPath}/js/echarts',
        'echarts/chart/map' : '${pageContext.request.contextPath}/js/echarts-map'
    }
});

require(
    [
        'echarts',
        'echarts/chart/map'
    ],
    function(ec) {
        var myChart2 = ec.init(document.getElementById('myechart'));
        myChart2.setOption({
            title : {
                text: '在线用户地区分布',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                x:'left',
                data:['用户']
            },
            dataRange: {
                min: ${minvalue},
                max: ${maxvalue},
                x: 'left',
                y: 'bottom',
                color:['#2259AA','#D5E2F7'],
                text:['高','低'],           // 文本，默认为数值文本
                calculable : true,
                textStyle: {
                    color: 'orange'
                }
            },
            toolbox: {
                show : true,
                orient : 'vertical',
                x: 'right',
                y: 'center',
                feature : {
                    mark : {show: true},
                    dataView : {readOnly: false, show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            roamController: {
                show: true,
                x: 'right',
                mapTypeControl: {
                    'china': true
                }
            },
            series : [
                {
                    name: '用户',
                    type: 'map',
                    mapType: 'china',
                    itemStyle:{
                        normal:{label:{show:true}, color:'#ff8c00'},// for legend
                        emphasis:{label:{show:true}}
                    },
                    data: ${data1}
                }
            ]
        });
    }
);

    </script>