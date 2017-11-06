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
    	var trendUrl = "spss/getData";
    	var trendParams = {year:year, month:month, day:day, hour:hour};

    	var myChartHour = undefined         
        var myChartYear = undefined         
        var myChartMonth = undefined
        var myChartDay = undefined
       
        
    	var getEchartsOption = function(xdata, ydata,title){
    		var option = {
    				color:['#234566'],
    	        	grid:{x:0,y:30,x2:0,y2:60},
    	        	calculable:false,
    	            tooltip : {
    	                trigger: 'item',
    	            },
    	            title : {
    	                text:title+"  对话次数  ",
    	                textStyle:{
                    		fontSize: 12, 
                    		fontWeight: 'bolder', 
                    		color: '#999'
                    		},
                    		y:'top',
                    		x:'right',
    	            },
    	            
    	            toolbox: {
    	                show : true,
    	                x:'left',
    	                feature : {
    	                	magicType:['line', 'bar'],
    	                    dataView : false,
    	                    restore : false,
    	                    saveAsImage : true
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
    	
    	var initEchart = function(mode,year,month,day,hour){
    		require(
    	            [
					'echarts',
					'echarts/chart/bar',
					'echarts/chart/line',
    	            ],
    	            function (echarts) {
    	            	switch(mode){
    	            	case(1):{    	            		
    	            		if(myChartYear){
    	            			myChartYear.clear();
    	            			myChartYear.dispose();
    	            		}
    	                    myChartYear = echarts.init($("#myechartYear")[0]);           
    	                    break;
    	            	}
    	            	case(2):{
    	            		if(myChartMonth){
    	            			myChartMonth.clear();
    	            			myChartMonth.dispose();
    	            		}
    	            		myChartMonth =echarts.init($("#myechartMonth")[0]); 
    	            		break;
    	            	}
    	            	case(3):{
    	            		if(myChartDay){
    	            			myChartDay.clear();
    	            			myChartDay.dispose();
    	            		}
    	            		myChartDay =echarts.init($("#myechartDay")[0]); 
    	            		break;
    	            	}
    	            	case(4):{
    	            		if(myChartHour){
    	            			myChartHour.clear();
    	            			myChartHour.dispose();
    	            		}
    	            		myChartHour =echarts.init($("#myechart")[0]);   
    	            		break;
    	            	}
    	            	default: break;
    	            	}
    	            	
    	            	trendParams.year = year;
    	            	trendParams.month = month;
    	            	trendParams.day = day;
    	            	trendParams.hour = hour;
    	                $.post(trendUrl, trendParams, function(data){
    	                		var datas = data.data.data.split("||");		
    	                		var xdata = datas[0].split(",");
    	                		var ydata = datas[1].split(",");
//    	                		var option = getEchartsOption(xdata, ydata,'ss');
    	                		//echart.hideLoading();
    	                		//echart.setOption(option); 
    	                		
    	                		//设置单击事件
    	                		echartsConfig = require("echarts/config");
    	                		switch(mode){
    	                		case(1) :{
    	                			myChartYear.hideLoading();
    	                			myChartYear.setOption(getEchartsOption(xdata, ydata,'年'));
    	                			myChartYear.on(echartsConfig.EVENT.CLICK, echartClick1);
    	                			break;
    	                		}
    	                		case(2) :{
    	                			myChartMonth.hideLoading();
    	                			myChartMonth.setOption(getEchartsOption(xdata, ydata,'月'));
    	                			myChartMonth.on(echartsConfig.EVENT.CLICK, echartClick2);
    	                			break;
    	                		}
    	                		case(3) :{
    	                			myChartDay.hideLoading();
    	                			myChartDay.setOption(getEchartsOption(xdata, ydata,'日'));
    	                			myChartDay.on(echartsConfig.EVENT.CLICK, echartClick3);
    	                			break;
    	                		}
    	                		case(4) :{
    	                			myChartHour.hideLoading();
    	                			myChartHour.setOption(getEchartsOption(xdata, ydata,'时'));
    	                			myChartHour.on(echartsConfig.EVENT.CLICK, echartClick4);
    	                			break;
    	                		}
    	                		default: break;
    	                		}
    	                		
    	                	
    	                	
    	                },"json");
    	        }
    		);
    	};
        
    	var echartClick1 = function(param){
			//点击年
    		var dataIndex = param.dataIndex;		
			year = dataIndex+2014;
			month = -1;
			day = -1;
			hour = -1;
			initEchart(2, year, -1, -1, -1);

			initEchart(3, year, 1, -1, -1);

			initEchart(4, year, 1, 1, -1);
			
			corpusList.clearCondition();
            corpusList.gridReload();  
            $("#corpusGrid").datagrid({title:year+"年"}); 
            $(".datagrid").find(".panel-title").attr({align:"center"});
            corpusList.formatPage();
    	}
    	
    	var echartClick2 = function(param){
			//点击月
    		var dataIndex = param.dataIndex;		
			month = dataIndex+1;
			day = -1;
			hour = -1;
			initEchart(3, year, month, -1, -1);

			initEchart(4, year, month, 1, -1);
			
			corpusList.clearCondition();
            corpusList.gridReload();  
            $("#corpusGrid").datagrid({title:year+"年"+month+"月"});
            $(".datagrid").find(".panel-title").attr({align:"center"});
            corpusList.formatPage();
    	}
    	
    	var echartClick3 = function(param){
			//点击日
    		var dataIndex = param.dataIndex;	
    		if(month==-1){
    			month=1;
    		}
			day = dataIndex+1;
			hour = -1;

			initEchart(4, year, month, day, -1);
			
			corpusList.clearCondition();
            corpusList.gridReload();  
            $("#corpusGrid").datagrid({title:year+"年"+month+"月"+day+"日"});
            $(".datagrid").find(".panel-title").attr({align:"center"});
            corpusList.formatPage();
    	}
    	var echartClick4 = function(param){
			//点击日
    		var dataIndex = param.dataIndex;	
    		if(day==-1){
    			day=1;
    		}
    		if(month==-1){
    			month=1;
    		}
			hour = dataIndex;
			corpusList.hour = hour;
			corpusList.clearCondition();
            corpusList.gridReload();  
            $("#corpusGrid").datagrid({title:year+"年"+month+"月"+day+"日   "+hour+"点到"+(hour+1)+"点"});
            $(".datagrid").find(".panel-title").attr({align:"center"});
            corpusList.formatPage();
    	}
    	method = {
    			init : function(){	
					initEchart(4, year, month, day, -1);
				    initEchart(3, year, month, -1, -1);
				    initEchart(2, year, -1, -1, -1);
				    initEchart(1, -1, -1, -1, -1);
    			},
    		};
    		return method;
      
})(jQuery);