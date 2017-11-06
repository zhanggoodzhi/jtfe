require.config({
	paths:{
		"echarts" : contextPath + "/js/echarts",
        "echarts/chart/line" : contextPath + "/js/echarts-map",
        "echarts/chart/bar" : contextPath + "/js/echarts-map",
	}
});

$(function(){
	qaInfo.init();
});

var qaInfo = (function($,undefined){
        
    	var echartsConfig = undefined;
    	var trendUrl = "getCategoryData";
    	var trendParams = {year:year, month:month, day:day, hour:hour};

    	var myChart = undefined         
       
        
    	var getEchartsOption = function(xdata, ydata){
    		var option = {
    				color:['#234566'],
    	        	grid:{x:0,y:30,x2:0,y2:60},
    	        	calculable:false,
    	            tooltip : {
    	                trigger: 'item',
    	            },
    	            toolbox: {
    	                show : true,
    	                x:'left',
    	                feature : {
    	                	magicType:['line', 'bar'],
    	                    dataView : false,
    	                    restore : false,
    	                    saveAsImage : false
    	                }
    	            },
    	            xAxis : [
    	                {
    	                    type : 'category',
    	                    axisLine:{show : true},
    	                    axisTick:{show : false},
    	                    axisLabel:{interval:0,rotate:45},
    	                    data : ""
    	                }
    	            ],
    	            yAxis : [
    	                {
    	                    type : 'value',
    	                    scale : true,
    	                    axisLine:{show : false},
    	                    axisLabel:{show : false},
    	                    splitLine:{show : false},
    	                    splitArea:{show : true}
    	                }
    	            ],
    	            series : [
    	                      {
    	                          "name":"问答数",
    	                          "type":"bar",
    	                          	itemStyle: {
    	                              normal: {
    	                                  label : {
    	                                      show: true, 
    	                                      position: 'inside',                                      
    	                                      textStyle: {
    	                                          color: 'tomato'
    	                                      }
    	                                  }
    	                              }
    	                          },
    	                          "data":""
    	                      }
    	                  ]  
            };
    		option.xAxis[0].data = xdata;
    		option.series[0].data = ydata;

    		return option;
    	};
    	
    	var initEchart = function(year,month,day,hour){
    		require(
    	            [
					'echarts',
					'echarts/chart/bar',
					'echarts/chart/line',
    	            ],
    	            function (echarts) {
    	            	
    	            	   	            		
	            		if(myChart){
	            			myChart.clear();
	            			myChart.dispose();
	            		}
	                    myChart = echarts.init($("#myechart")[0]);           

    	            	trendParams.year = year;
    	            	trendParams.month = month;
    	            	trendParams.day = day;
    	            	trendParams.hour = hour;
    	                $.post(trendUrl, trendParams, function(data){    	                
    	                	
    	                		console.log("data=" + data.data.data);
    	                		var datas = data.data.data.split("||");		
    	                		var xdata = datas[0].split(",");
    	                		var ydata = datas[1].split(",");
    	                		var option = getEchartsOption(xdata, ydata);
    	                		//echart.hideLoading();
    	                		//echart.setOption(option); 
    	                		
    	                		//设置单击事件
    	                		echartsConfig = require("echarts/config");
  
	                			myChart.hideLoading();
	                			myChart.setOption(option);
	                			myChart.on(echartsConfig.EVENT.CLICK, echartClick);

    	                	
    	                },"json");
    	        }
    		);
    	};
        
    	var echartClick = function(param){
			//点击年
    		var dataIndex = param.dataIndex;		

    	}
    	
    	
    	method = {
    			init : function(){	
				    initEchart(2014, -1, -1, -1);
    			},
    		};
    		return method;
      
})(jQuery);