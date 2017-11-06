<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

<head>
<jsp:include page="../headv2.jsp" />
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
				<div class="win">
					<img alt=""
						src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icons/fx.png"
						class="winImg"> <label class="winLabel">访客地域分析</label>
				</div>
				<div id="myechart"
					style="height: 600px; border: 0px solid red; padding-top: 10px;"></div>
			
			<footer>
				<jsp:include page="../footerv2.jsp" />
			</footer>
		</div>
	</div>

	</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/esl.js"></script>
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
                data:['注册用户','访客用户']
            },
            dataRange: {
                min: 0,
                max: 1000,
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
                    name: '注册用户',
                    type: 'map',
                    mapType: 'china',
                    itemStyle:{
                        normal:{label:{show:true}, color:'#ff8c00'},// for legend
                        emphasis:{label:{show:true}}
                    },
                    data: ${data1}
                },
        	    {
                    name: '访客用户',
                    type: 'map',
                    mapType: 'china',
                    itemStyle:{
                        normal:{label:{show:true}, color:'#da70d6'},// for legend
                        emphasis:{label:{show:true}}
                    },
                   data:${data2}
                }
            ]
        });
    }
);

    </script>
</body>

</html>
