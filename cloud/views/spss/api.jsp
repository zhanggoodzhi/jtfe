<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

<head>
<jsp:include page="../headv2.jsp" />
<link href="${ctx}/lib/ligerUI/skins/Aqua/css/ligerui-all.css"
	rel="stylesheet" type="text/css">
<link href="${ctx }/css/common.css" rel="stylesheet" type="text/css"
	media="all" />
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script src="${ctx}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerComboBox.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerTree.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerDialog.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerDateEditor.js"
	type="text/javascript"></script>

<script type="text/javascript" src="${ctx}/js/esl.js"></script>
<script type="text/javascript" src="${ctx}/js/knowledge/cloudUtil.js"></script>
<script type="text/javascript">
	var contextPath = '${pageContext.request.contextPath}';
	var appName = '${ctx}';
	var currentTime = '${currentTime}';
	var columnInfo = '${classifys}';
</script>
<script type="text/javascript">
	var itemList = ${itemList};
</script>
<script type="text/javascript" src="${ctx}/js/spss/apiEchart.js"></script>
<style type="text/css">
.toolbar{
	height:40px;
}
#trendChart{
	height:300px;
}
</style>
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
				<div id="clientInfoContent">
				<div class="toolbar" >
				
					<div style="float: left; text-align: center;">
						<label for="stasticsMode" id="stasticsModeLabel"
							style="margin-right: 4px; margin-top: 10px; float: left; font-size: 14px; font-weight: bold; ">统计模式:&nbsp;</label>
						<div class="comboBoxDiv"
							style="float: left; margin-top: 2px; margin-right: 5px;">
							<input id="stasticsMode" />
						</div>
					</div>


					<!-- 				<div id="clientInfoInDay"> -->
					<div style="float: left" class="param">
						<label for="day" id="dayLabel"
							style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;日期:&nbsp;</label>
						<div style="float: left; margin-top: 2px; margin-right: 5px;">
							<input id="day" />
						</div>
					</div>

					<div style="float: left; display: none" class="param">
						<label for="year" id="yearLabel"
							style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;年:&nbsp;</label>
						<div style="float: left; margin-top: 2px; margin-right: 5px;">
							<input id="year" />
						</div>
					</div>

					<div style="float: left; display: none" class="param">
						<label for="month" id="monthLabel"
							style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;月:&nbsp;</label>
						<div style="float: left; margin-top: 2px; margin-right: 5px;">
							<input id="month" />
						</div>
					</div>

					<div style="float: left; display: none" class="param">
						<label for="startDay" id="startDayLabel"
							style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;开始日期:&nbsp;</label>
						<div class="comboBoxDiv"
							style="float: left; margin-top: 2px; margin-right: 5px;">
							<input id="startDay" />
						</div>
					</div>
					<div style="float: left; display: none" class="param">
						<label for="endDay" id="endDayLabel"
							style="margin-right: 4px; margin-top: 4px; float: left; font-size: 14px; font-weight: bold;">&nbsp;&nbsp;结束日期:&nbsp;</label>
						<div style="float: left; margin-top: 2px; margin-right: 5px;">
							<input id="endDay" />
						</div>
					</div>

					<div style="float: left;">
						<input type="button" value="分析" class="btn02"
							onclick="clientInfo.analyseClient();"
							style="width: 60px; margin-top: 2px;" />
					</div>
					<div style="float: right;">
						<input id="radioItem">
					</div>
					<label for="stasticsMode" id="stasticsModeLabel"
						style="float: right; font-size: 14px; font-weight: bold;">切换接口名称:&nbsp;</label>
</div>
					<div id="clientInfoInQS">
						<div id="trendChart"></div>
					</div>
				</div>

				<!-- END 左侧主显区 -->
				<!-- 右侧边栏 -->
				<div id="clientInfoSide">
					<table id="clientGrid"></table>


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
