<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/calendar.js"></script> 

<form action="client" method="get" name="myfrom">
开始时间：<input name="startDate" type="text" style="padding-left:5px;" size="10" id="startDate" value="${startDate }" onclick="SelectDate(this)" readonly="readonly" />
结束时间：<input name="endDate" type="text" style="padding-left:5px;" size="10" id="endDate" value="${endDate }" onclick="SelectDate(this)" readonly="readonly" />
<input type="submit" id="sbm_search" value="查询">
</form>
<div>
	<table border="1">
		<tr>
			<th>访问量概况</th>
		</tr>
		<tr>
			<td>		</td>
			<td>注册来访</td>
			<td>访客来访</td>
			<td>注册</td>
			<td>新注册比例</td>
		</tr>
		<tr>
			<td>今日</td>
			<td>${todaysignedVistor }</td>
			<td>${todayallVistor }</td>
			<td>${todaycountSign }</td>
			<td>${todayrate }</td>
		</tr>
		<tr>
			<td>昨日</td>
			<td>${yesterdaysignedVistor }</td>
			<td>${yesterdayallVistor }</td>
			<td>${yesterdaycountSign }</td>
			<td>${yesterdayrate }</td>
		</tr>
		<tr>
			<td>前一周</td>
			<td>${thisWeeksignedVistor }</td>
			<td>${thisWeekallVistor }</td>
			<td>${thisWeekcountSign }</td>
			<td>${thisWeekrate }</td>
		</tr>
		<tr>
			<td>前一月</td>
			<td>${thisMonthsignedVistor }</td>
			<td>${thisMonthallVistor }</td>
			<td>${thisMonthcountSign }</td>
			<td>${thisMonthrate }</td>
		</tr>
	</table>
</div>
</body>
</html>