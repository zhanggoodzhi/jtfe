require.config({
	paths : {
		"echarts" : contextPath + "/js/echarts",
		"echarts/chart/line" : contextPath + "/js/echarts-map",
		"echarts/chart/bar" : contextPath + "/js/echarts-map",
	}
});
$(function() {
	clientInfo.init();
});

var clientInfo = (function($, undefined) {
	var $clientGrid = undefined;
	var $stasticsMode = undefined;
	var $day = undefined;
	var $month = undefined;
	var $year = undefined;
	var $startDay = undefined;
	var $endDay = undefined;
	var $radioItem = undefined;

	var trendChart = undefined;
	var echartsConfig = undefined;
	var checkvalue = -1;
	

	var parser = function(dateStr) {
		var regexDT = /(\d{4})-?(\d{2})?-?(\d{2})?\s?(\d{2})?:?(\d{2})?:?(\d{2})?/g;
		var matchs = regexDT.exec(dateStr);
		if (matchs != null) {
			var date = new Array();
			for ( var i = 1; i < matchs.length; i++) {
				if (matchs[i] != undefined) {
					date[i] = matchs[i];
				} else {
					if (i <= 3) {
						date[i] = "01";
					} else {
						date[i] = "00";
					}
				}
			}
			return new Date(date[1], date[2] - 1, date[3], date[4], date[5],
					date[6]);
		} else {
			return new Date();
		}
	};

	var startDay = parser((new Date()).formatDate("yyyy-MM-dd"));
	var endDay = parser((new Date((new Date()).getTime() + 24 * 60 * 60 * 1000))
			.formatDate("yyyy-MM-dd"));

	var stasticsModeManager = undefined;
	var yearManager = undefined;
	var monthManager = undefined;
	var itemManager = undefined;
	
	
	var today = new Date(currentTime);
	var currentYear = today.getFullYear();
	var currentMonth = today.getMonth() + 1;
	var currentDay = today.getDate();
	var todayStr = (new Date()).formatDate("yyyy-MM-dd");
	var stasticsModeData = [ {
		id : 0,
		text : "每日统计(以小时单位)"
	}, {
		id : 1,
		text : "每月统计(以天单位)"
	}, {
		id : 2,
		text : "每年统计(以月单位)"
	}, {
		id : 3,
		text : "任意时段统计(以天单位)"
	} ];
	var itemData = itemList;
	var yearData = (function(){

		var result = [];
		
		for(var startYear = currentYear; startYear >= 2013; startYear--){
			result.push({id:startYear, text:startYear+"年"});
		}
		return result;
	})();
	var monthData = [ {
		id : 1,
		text : "1月"
	}, {
		id : 2,
		text : "2月"
	}, {
		id : 3,
		text : "3月"
	}, {
		id : 4,
		text : "4月"
	}, {
		id : 5,
		text : "5月"
	}, {
		id : 6,
		text : "6月"
	}, {
		id : 7,
		text : "7月"
	}, {
		id : 8,
		text : "8月"
	}, {
		id : 9,
		text : "9月"
	}, {
		id : 10,
		text : "10月"
	}, {
		id : 11,
		text : "11月"
	}, {
		id : 12,
		text : "12月"
	} ];

	var queryUrl = appName+"/spss/apiHashData";
	var trendUrl = appName+"/spss/apiEchart";
	var detailUrl = "clientDetail";
	var timeString = todayStr+" 00:00:00";

	var trendParams = {
		mode : 0,
		day : today,
		year : currentYear,
		month : currentMonth,
		startDay : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
		endDay : today,
		anynomous : -1,
		hour : -1,
		minCount : 0,
		maxCount : -100,
		itemid : 1,
	};

	var initVar = function() {
		$clientGrid = $("#clientGrid");
		$stasticsMode = $("#stasticsMode");
		$radioItem = $("#radioItem");
		$year = $("#year");
		$month = $("#month");

		$day = $("#day");
		$startDay = $("#startDay");
		$endDay = $("#endDay");
		tableWidth = $("body").width() - 2*22;
		remainWidth = tableWidth;
	}
	
	var initCombox = function() {
		stasticsModeManager = $stasticsMode.ligerComboBox({
			width : 200,
			emptyText : "",
			data : stasticsModeData,
			isMultiSelect : false,
			onSelected : function(value) {
				console.log("onselect value=" + value);
				initDateBox(value);			
			}
		});
		stasticsModeManager.setValue("0");
		
		itemManager = $radioItem.ligerComboBox({
			width : 300,
			emptyText : "",
			data : itemData,
			isMultiSelect : false,
			onSelect : function(value) {
				console.log("onselect value=" + value);
				trendParams.itemid=value;
				if(value!=checkvalue&&checkvalue!=-1){
					
					updateData();

					initEcharts();
					checkvalue=value;
				}
					
			}
		});
		if(itemData.length>0){
			itemManager.setValue(itemData[0]["id"]);
			checkvalue=itemData[0]["id"];
		}
		

		yearManager = $year.ligerComboBox({
			width : 80,
			emptyText : "",
			data : yearData,
			isMultiSelect : false,
		});
		yearManager.setValue(2014);

		monthManager = $month.ligerComboBox({
			width : 80,
			emptyText : "",
			data : monthData,
			isMultiSelect : false,
		});
		monthManager.setValue(currentMonth);
	};

	var initDateBox = function(value) {

		switch (value) {
		case "0":
			hideAllParam();
			$day.parent().parent().show();
			$day.datebox(getDateConfig());
			$day.datebox("setValue", todayStr);
			break;
		case "1":
			hideAllParam();
			$year.closest(".param").show();
			yearManager.setValue(currentYear);
			$month.closest(".param").show();
			monthManager.setValue(currentMonth);
			break;
		case "2":
			hideAllParam();
			$year.closest(".param").show();
			yearManager.setValue(currentYear);
			break;
		case "3":
			hideAllParam();
			$startDay.parent().parent().show();
			$endDay.parent().parent().show();
			$startDay.datebox(getDateConfig());
			$endDay.datebox(getDateConfig());
			$startDay.datebox("setValue", todayStr);
			$endDay.datebox("setValue", todayStr);
			break;
		}
	};

	var hideAllParam = function() {
		$(".param").hide();
	};

	var getDateConfig = function() {
		return {
			showSeconds : false,
			formatter : formatter,
			parser : parser
		};
	};

	var initGrid = function() {
		$clientGrid.datagrid(gridConfig());
		$clientGrid.datagrid({
			title : todayStr
		});
		$(".datagrid").find(".panel-title").attr({
			align : "center"
		});
		$clientGrid.datagrid('getPager').pagination(
				pageConfig(10, [ 10, 50, 100 ]));
	};

	var pageConfig = function(pageSize, pageList) {
		return {
			pageSize : pageSize,
			pageList : pageList,
			beforePageText : '第',
			afterPageText : '页    共 {pages} 页',
			displayMsg : '显示 {from} - {to} 条,  共 {total}条',
		};
	};
	var autoWidth = function(percent, minWidth, remainMinWidth){
		var result = 0;
		if(remainMinWidth){
			result =  Math.max(remainWidth, remainMinWidth);
		}else if(minWidth){
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		}else{
			result = Math.round(tableWidth * percent);
		}
		
		remainWidth = remainWidth - result;
		return result;
	};
	var getColumnsConfig = function() {
		var columnTitle = [ {
			field : "id",
			title : "接口ID",
			width : autoWidth(0.05),	
			align : "center",
			halign : "center",
			sortable : true
		},{
			field : "api",
			title : "接口名称",
			width : autoWidth(0.30),	
			align : "center",
			halign : "center",
			sortable : true
		}, 
		{
			field : "readme",
			title : "接口说明",
			width : autoWidth(0.35),	
			align : "center",
			halign : "center",
			sortable : true
		},{
			field : "count",
			title : "计数",
			width : autoWidth(0.10),		
			align : "center",
			halign : "center",
			sortable : true
		}];



		return columnTitle;
	};
	var gridConfig = function() {
		return {
//			toolbar : "#toolbar",
			url : queryUrl,
			queryParams : trendParams,
			singleSelect : true,
			sortName : "id",
			sortOrder : "desc",
			pagination : true,
			pageSize : 10,
			rownumbers : true,
			pageList : [ 10, 50, 100 ],
			columns : [ getColumnsConfig() ],
			onLoadSuccess : function(){
				var data = $clientGrid.datagrid("getData");
				console.log(data.rows);
				var itemdata2 = new Array(data.rows.length);				
				for(var i=0; i<data.rows.length; i++){
					var rowdata = data.rows[i];
					var id = rowdata.id;
					var api = rowdata.api;
					var arr = new Array(2);
					arr["id"]=id;
					arr["text"]=api;
					itemdata2[i] = arr;
					
				}
				console.log(itemdata2);
		
				itemManager = $radioItem.ligerComboBox({					
					data : itemdata2 ,		
					onSelected : function(value) {
						console.log("onselect value=" + value);
						trendParams.itemid=value;
						if(value!=checkvalue&&checkvalue!=-1&&value>0){
							
							updateData();

							initEcharts();
							checkvalue=value;
						}
							
					}
				});
			itemManager.setValue("0");
			}
		};
	};

	var initEcharts = function() {
		require([ 	'echarts',
					'echarts/chart/bar',
					'echarts/chart/line',
				], 
		function(echarts) {
			if(trendChart){
				trendChart.clear();
				trendChart.dispose();
    		}
			trendChart = echarts.init($("#trendChart")[0]);

			trendChart.showLoading({
				text : "正在努力的读取数据中...",
			});
			
			$.post(trendUrl, trendParams, function(data) {

				if (data.status == "success") {
					var option = getEchartsOption(data.data.echartsOption);
					trendChart.hideLoading();
					trendChart.setOption(option);

					// 设置单击事件
					echartsConfig = require("echarts/config");
					trendChart.on(echartsConfig.EVENT.CLICK, echartClick);
				} else {
					trendChart.showLoading({
						text : "读取数据中失败",
					});
				}

			}, "json");
		});
	};

	var formatter = function(date) {
		var mode = "0"
		if (stasticsModeManager) {
			mode = stasticsModeManager.getValue();
		}

		switch (mode) {
		case "0":
			return date.formatDate("yyyy-MM-dd");
			break;
		case "1":
			return date.formatDate("yyyy-MM");
			break;
		case "2":
			return date.formatDate("yyyy");
			break;
		case "3":
			return date.formatDate("yyyy-MM-dd");
			break;
		default:
			break;
		}
	};

	var getEchartsOption = function(serverOption) {
		var option = {
				title : {
			        text: '接口使用情况',
			        subtext: '调用次数'
			    },
			tooltip : {
				show : true
			},
			toolbox : {
				show : true,
				x : 'right',
				feature : {
					magicType : [ 'line', 'bar' ],
					dataView : true,
					restore : true,
					saveAsImage : true
				}
			},
			legend : {
				orient : "horizontal",
				x : "center",
				y : "top",
				data : null
			},
			xAxis : [ {
				type : "category",
				data : null
			} ],
			yAxis : [ {
				type : "value"
			} ],
			series : [{
				name : 'aaa',
				type : "line",
				data : null,
				showAllSymbol :true,
			}]
		};
		option.legend.data = serverOption.legend;
		option.xAxis[0].data = serverOption.category;
		option.series[0].name = serverOption.series[0].name;
		option.series[0].data = serverOption.series[0].data;
		return option;
	};

	var analyseClient = function() {

		updateData();

		initEcharts();
		refreshGrid();
	};
	
	var selectData = function(min, max, is_anomymous) {
		trendParams.minCount = min;
		trendParams.maxCount = max;
		trendParams.anynomous = is_anomymous;
		refreshGrid();
	}

	var refreshGrid = function() {
		$clientGrid.datagrid("load", trendParams);
	};

	var updateData = function() {
		var gridTitle;
		var mode = stasticsModeManager.getValue();
		var itemid = itemManager.getValue();
		trendParams.mode = mode;
		trendParams.anynomous = -1;
		trendParams.itemid = itemid;
		
		switch (mode) {
		case "0":
			trendParams.day = parser($day.datebox("getValue"));
			startDay = trendParams.day;
			endDay = new Date(trendParams.day.getTime() + 24 * 60 * 60 * 1000);
			trendParams.startDay = startDay;
			trendParams.endDay = endDay;
			gridTitle = $day.datebox("getValue");
			break;
		case "1":
			trendParams.year = yearManager.getValue();
			trendParams.month = monthManager.getValue();
			if (trendParams.month < 10) {
				gridTitle = trendParams.year + "-0" + trendParams.month;
				startDay = parser(trendParams.year + "-0" + trendParams.month);
			} else {
				startDay = parser(trendParams.year + "-" + trendParams.month);
				gridTitle = trendParams.year + "-" + trendParams.month;
			}

			endDay = new Date(new Date(startDay.getTime()).setMonth(startDay
					.getMonth() + 1));
			trendParams.startDay = startDay;
			trendParams.endDay = endDay;
			break;
		case "2":
			trendParams.year = yearManager.getValue();
			startDay = parser(trendParams.year);
			endDay = new Date(new Date(startDay.getTime()).setYear(startDay
					.getFullYear() + 1));
			trendParams.startDay = startDay;
			trendParams.endDay = endDay;
			gridTitle = yearManager.getValue();
			break;
		case "3":
			trendParams.startDay = parser($startDay.datebox("getValue"));
			trendParams.endDay = parser($endDay.datebox("getValue"));
			startDay = trendParams.startDay;
			endDay = new Date(trendParams.endDay.getTime() + 24 * 60 * 60
					* 1000);
			trendParams.startDay = startDay;
			trendParams.endDay = endDay;
			gridTitle = $startDay.datebox("getValue") + "——"
					+ $endDay.datebox("getValue");
			break;
		}
		$clientGrid.datagrid({
			title : gridTitle
		});
		$(".datagrid").find(".panel-title").attr({
			align : "center"
		});
	};

	var detailDialogConfig = function(title, rowData, startDay, endDay, pcid) {
		return {
			height : 620,
			width : 850,
			title : title,
			url : detailUrl,
			showMax : false,
			showMin : false,
			isResize : true,
			slide : false,
			
			data : {
				refresh : function() {
					refreshGrid();
				},
				rowdata : rowData,
				startDay : startDay,
				endDay : endDay,
				category : pcid,
				keyword : ""
			},
			buttons : [
			// {
			// text : "确定",
			// onclick : function(item, dialog) {
			// }
			// },
			{
				text : "关闭",
				onclick : function(item, dialog) {
					dialog.close();
				}
			} ]
		};
	};

	var operateDetail = function(rowIndex, linkDom) {
		var data = $clientGrid.datagrid("getData");
		var rowData = data.rows[rowIndex];
		var pcid = -100;
		if (linkDom) {

			var test = $(linkDom).parent().attr("class").replace(
					/datagrid-cell-c\d*-_/g, "categoryId_");
			// var startPos =
			// ($(linkDom).parent().attr("class").search(/datagrid-cell-c\d*-_-?\d*$/g));

			var startPos = test.search(/categoryId_-?\d*$/g);

			pcid = test.substring(startPos + 11);
		}

		$.ligerDialog.open(detailDialogConfig("用户:" + rowData.user + ", 问答详情",
				rowData, trendParams.startDay, trendParams.endDay, pcid));
	};

	var echartClick = function(param) {
		var charOnclikeTitle;
		// console.log("单击事件, param=" +param.seriesIndex + param.dataIndex);
		var seriesIndex = param.seriesIndex;
		var dataIndex = param.dataIndex;
		var option = trendChart.getOption();
		var time = option.xAxis[0].data[dataIndex];
		var time1 = option.xAxis[0].data[dataIndex + 1];
		console.log("xAxis" + option.xAxis[0].data[dataIndex]);
		var getMode = stasticsModeManager.getValue();
		console.log("getMode" + getMode);
		trendParams.anynomous = seriesIndex;
		trendParams.hour = dataIndex;
		switch (getMode) {
		case "0": {
			var datas = time.split("-");
			var startHour = trendParams.day.formatDate("yyyy-MM-dd") + " "
					+ datas[0] + ":00";
			var endHour = trendParams.day.formatDate("yyyy-MM-dd") + " "
					+ datas[1] + ":00";
			trendParams.mode = 4;
			// trendParams.hour=11;
			trendParams.startDay = new Date(startHour);
			trendParams.endDay = new Date(endHour);
			$clientGrid.datagrid(gridConfig());
			charOnclikeTitle = startHour + "点到" + endHour+"点";
			$clientGrid.datagrid({
				title : charOnclikeTitle
			});
			$(".datagrid").find(".panel-title").attr({
				align : "center"
			});

			break;
		}

		case "1": {
			trendParams.mode = 0;
			trendParams.day = new Date(time);
			trendParams.startDay = new Date(time);
			trendParams.endDay = new Date(time1);
			console.log("day" + trendParams.day);
			$clientGrid.datagrid(gridConfig());
			charOnclikeTitle = time + "——" + time1;
			$clientGrid.datagrid({
				title : charOnclikeTitle
			});
			$(".datagrid").find(".panel-title").attr({
				align : "center"
			});
			break;
		}
		case "2": {
			trendParams.mode = 1;
			trendParams.month = dataIndex + 1;
			var showmonth = (trendParams.month < 10 ? "0" + trendParams.month
					: trendParams.month);
			var month = parseInt(trendParams.month, 10);
			var maxDay = new Date(trendParams.year, month, 0).getDate();

			var startDay = trendParams.year + "-" + showmonth + "-01";
			var endDay = trendParams.year + "-" + showmonth + "-" + maxDay;
			trendParams.startDay = new Date(startDay);
			trendParams.endDay = new Date(endDay);
			console.log("maxDay" + trendParams.endDay);
			$clientGrid.datagrid(gridConfig());
			charOnclikeTitle = startDay + "——" + endDay;
			$clientGrid.datagrid({
				title : charOnclikeTitle
			});
			$(".datagrid").find(".panel-title").attr({
				align : "center"
			});
			break;
		}
		case "3": {
			trendParams.mode = 0;
			trendParams.day = new Date(time);
			trendParams.startDay = new Date(time);
			trendParams.endDay = new Date(time1);
			console.log("day" + trendParams.startDay);
			charOnclikeTitle = time + "——" + time1;
			$clientGrid.datagrid({
				title : charOnclikeTitle
			});
			$(".datagrid").find(".panel-title").attr({
				align : "center"
			});
			break;
		}

		default:
			break;

		}
		refreshGrid();

	}

	method = {
		init : function() {
			initVar();
			initCombox();
			initGrid();
			initEcharts();
		},
		analyseClient : analyseClient,
		operateDetail : operateDetail,
		selectData : selectData
	};
	return method;
})(jQuery);
