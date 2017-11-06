<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>今日数据分析</title>

</head>
<body>
 <div id="myechart" style="height:200px;border:1px solid #ccc;padding:10px;"></div>
	<input type="button" value="查看未答" onclick="window.location='index.php?r=op/spss/daily_log&mark=0'">
	<input type="button" value="查看已答" onclick="window.location='index.php?r=op/spss/daily_log&mark=1'">
	<div id="myechart1" style="height:300px;border:1px solid #ccc;padding:10px;"></div>
	<script type="text/javascript" src="js/esl.js"></script>
    <script type="text/javascript">
    require.config({
        paths:{ 
            echarts:'./js/echarts',
            'echarts/chart/bar' : './js/echarts-map',
            'echarts/chart/line': './js/echarts-map',
            'echarts/chart/map' : './js/echarts-map'
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
			var myChart1 = ec.init(document.getElementById('myechart1'));
            myChart1.setOption({
                title : {
                     text: '今日未答、已答问题',
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                legend: {
                    data:['未答问题', '已答问题']
                },
                calculable : true,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 0,
                    end : 20,
                    orient : 'vertical'
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : true,
                        dataZoom : true,
                        dataView : {readOnly: false},
                        magicType:['line', 'bar'],
                        restore : true,
                        saveAsImage : true
                    }
                },
                yAxis : [
                         {
                             name : '数量',
                             type : 'value',
                             scale: true,
                             precision:0,
                             power:10,
                             boundaryGap: [0.2, 0.2],
                             splitArea : {show : true}
                         }
                ],
                xAxis : [
                    {
                        name : '分类',
                        type : 'category',
                        position : 'bottom',
                        axisTick : {
							show : true,
							interval : 0
                        },
                        axisLabel : {
                        	show : true,
                        	interval : 0,
                        	rotate : -30
                        },
                        data : ${categories}
                    }
                ],
                series : [
                    {
                        name:'未答问题',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'inside'}}},
                        data:${no_answer}
                    },
                    {
                        name:'已答问题',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'inside'}}},
                        data: ${has_answer}
                    }
                ]
            });

	 var myChart = ec.init(document.getElementById('myechart'));
            var option = {
				title : {
                     text: '今日用户活跃度',
//                     subtext: '数据来自网络'
                },
            	    tooltip : {
            	        trigger : 'axis',
            	        formatter : '{b0}<br/>{a0} : {c0}<br/>{a1} : {c1}<br/>{a2} : {c2}%',
            	    },
            	    toolbox: {
            	        show : true,
            	        feature : {
            	            mark : true,
            	            dataView : {readOnly: true},
            	            magicType:['line', 'bar'],
            	            restore : true,
            	            saveAsImage : true
            	        }
            	    },
            	    calculable : true,
            	    legend: {
            	        data:['登录用户数量','注册用户数量','活跃程度']
            	    },
            	    yAxis : [
            	        {
                	        name : '日期',
            	            type : 'category',
            	            data : [<?php echo $dates;?>]
            	        }
            	    ],
            	    xAxis : [
            	        {
            	            type : 'value',
            	            name : '用户数量',
            	            axisLabel : {
            	                formatter: '{value} 人'
            	            },
            	            splitArea : {show : true}
            	        },
            	        {
            	            type : 'value',
            	            name : '活跃程度',
            	            min : 0,
            	            max : 100,
            	            axisLabel : {
            	                formatter: '{value} %'
            	            },
            	            splitLine : {show : false}
            	        }
            	    ],
            	    series : [

            	        {
            	            name:'登录用户数量',
            	            type:'bar',
            	            data:[<?php echo $logins;?>]
            	        },
            	        {
            	            name:'注册用户数量',
            	            type:'bar',
            	            data:[<?php echo $registed;?>]
            	        },
            	        {
            	            name:'活跃程度',
            	            type:'line',
            	         
            	            data:[<?php echo $activeRate;?>]
            	        }
            	    ]
            	};
            	                    
            myChart.setOption(option);
            
        }


    );

    </script>
</body>
</html>