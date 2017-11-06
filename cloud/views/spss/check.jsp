<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<meta http-equiv="X-UA-Compatible" content="IE=10" /> 
<head>
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>语料类别相关</title>

</head>
<body style="margin: 0px;">
<div  class="easyui-panel" title="语料操作分析"
		data-options="iconCls:'icon-fx'" style="min-width: 800px;background-color: #FAFCFF;">
<div id="myechart" style="height:500px;border:0px solid red;padding:30px;"></div></div>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/esl.js"></script>
<script type="text/javascript">
require.config({
    paths:{ 
        echarts:'${pageContext.request.contextPath}/js/echarts',
        'echarts/chart/bar' : '${pageContext.request.contextPath}/js/echarts-map',
        'echarts/chart/line': '${pageContext.request.contextPath}/js/echarts-map',
        'echarts/chart/map' : '${pageContext.request.contextPath}/js/echarts-map'
    }
});

require(
    [
        'echarts',
        'echarts/chart/bar',
        'echarts/chart/line',
        'echarts/chart/map'
    ],
    function(ec) {
        var myChart = ec.init(document.getElementById('myechart'));
        myChart.setOption({
            title : {
				text: '语料状态分布图',
				subtext: '',
				x:'center'
			},
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {d}%"
			},
			legend: {
				x : 'center',
				y : 'bottom',
				data: ${legend}
			},
			toolbox: {
				show : true,
				feature : {
					mark : true,
					dataView : {readOnly: false},
					restore : true,
					saveAsImage : true
				}
			},
			calculable : true,
			series : [
				{
					name:'所占比重',
					type:'pie',
					radius : [30, 110],
					center : ['50%', 200],
					roseType : 'area',
					data: ${status}
				}
			]
        });
        
    }
);
    </script>

</body>
</html>