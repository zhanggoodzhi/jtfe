<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=10" />
<title>金童云服务平台</title>
</head>
<link href="${ctx}/lib/ligerUI/skins/Aqua/css/ligerui-all.css"
	rel="stylesheet" type="text/css">
<link href="${ctx }/css/main.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/font.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/index.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/reg.css" rel="stylesheet" type="text/css" />
<link href="${ctx }/css/common.css" rel="stylesheet" type="text/css" />

<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>

<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script src="${ctx}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerComboBox.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerTree.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerDialog.js"
	type="text/javascript"></script>
	<script type="text/javascript" src="${ctx}/js/knowledge/cloudUtil.js"></script>
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/config/classifyTag.js"></script>

<script type="text/javascript">
	var appName = '${ctx}';
	$(function() {
		$("#classifyTreeGridDiv").css("height",$("#mainContext").height()-200+"px"); 
// 		$("#classifyTreeGrid").css("height",$("#classifyTreeGridDiv").height()-10+"px");
		$("#classifyTagGridDiv").css("height",$("#mainContext").height()-110+"px");
		$("#classifyTagGrid").css("height",$("#classifyTagGridDiv").height()-10+"px");
		
		tagList.init();
		classifyTreeList.init();
	});
</script>
<body>
	<jsp:include page="../headv2.jsp"></jsp:include>
	<div id="cutAppWin">
		<table id="cutAppInfoTable"
			style="margin: 5px 0px 0px 10px; width: 400px;" cellpadding="0"
			cellspacing="0"></table>
	</div>
	<input type="hidden" id="txtAudit_statusType"
		value="${ audit_statusType}">
	<div>
		<div id="mainLeft">
			<div class="mainLeftTitle"
				onclick="javascript:window.location.href='${ctx}/main'">
				<div
					style="font-size: 12px; font-weight: bold; color: #575765; padding-top: 4px;">
					<img alt="" src="${ctx }/images/main.png"
						style="vertical-align: middle;">&nbsp;金童云服务平台
				</div>
			</div>
			<!--<jsp:include page="../mainleft.jsp" />-->
		</div>
	</div>
	<div id="mainContext">
		<div id="divConfigWin" class="win">
			<img alt="" src="${ctx }/jquery-easyui-1.3.6/themes/icons/sy.png"
				class="winImg"> <label class="winLabel">分类标签</label>
		</div>
		<div id="tagContext">
			<div id="leftContext" style="background:#FFFFFF;">
				<div style="background:#eeeeee;border:1px solid #CDCDCD;height:20px;padding-top:7px;">
					<label class="winLabel" style="margin-left:10px;">选择分类</label>
				</div>
				<div id="toolbarTree" style="margin-top:10px;margin-left:10px;height:43px">
<!-- 					style="height: 40px; padding-top: 12px; padding-left: 10px;"> -->
					<label for="keywordTree" id="keywordLabel"
						style="margin-right: 4px;">关键词</label> <input id="keywordTree"
						placeholder="请输入名称搜索"
						style="margin-top: 4px; border: 1px solid #ccc; width: 255px; height: 22px;">
					<a class="easyui-linkbutton"
						data-options="iconCls:'icon-search',plain:true"
						onclick="classifyTreeList.findClassify()">查询</a> 
						<a
						href="javascript:void(0)" class="easyui-linkbutton"
						iconCls="icon-add" plain="true" onclick="showDialog()">打标签</a>
				</div>
				<div id="classifyTreeGridDiv" style="border: 1px solid #ccc;overflow:scroll;">
					<ul id="classifyTree"></ul>
<!-- 					<table id="classifyTreeGrid" title="选择分类"> -->
<!-- 					</table> -->
				</div>
			</div>
			<div id="rightContext">
				<div id="toolbar"
					style="height: 40px; padding-top: 12px; padding-left: 10px;">
					<label for="keyword" id="keywordLabel" style="margin-right: 4px;">关键词</label>
					<input id="keyword" placeholder="请输入关键字搜索"
						style="margin-top: 4px; border: 1px solid #ccc; width: 255px; height: 22px;">
					<a class="easyui-linkbutton"
						data-options="iconCls:'icon-search',plain:true"
						onclick="tagList.gridReload()">查询</a> 
<!-- 						<a class="easyui-linkbutton" -->
<!-- 						data-options="iconCls:'icon-delete',plain:true" -->
<!-- 						onclick="tagList.batchDelete()">批量删除</a> -->
				</div>
				<div id="classifyTagGridDiv" style="border: 1px solid #ccc">
				<table id="classifyTagGrid" title="标签管理"></table>
				</div>
			</div>
		</div>

		<div id="dd" class="easyui-dialog" title="打标签" 
			style="width: 450px; height: 320px;"
			data-options="buttons:'#bb',resizable:false,modal:true,closed:true,iconCls:'icon-changes'">
			<form id="ff" method="post">
				<table>
				<tr>
						<td class="fs_person"><label
							style="color: #ff0000; font-weight: bold; font-size: 14px;">*</label><b>标签名称：</b></td>
						<td style="height: auto;"><input type="text" id="tagname"
							name="tagname" value="" maxlength="32" style="width: 300px;"
							class="txt01"></td>
						<td class="td_hint_str">
							<div class="left into_input_jt_01" style="display: none;">&nbsp;</div>
							<div class="left into_input_bg_01" style="display: none;">
								<span class="hint_text">请填写标签名称</span>
							</div>
						</td>
					</tr>
					<tr>
						<td class="fs_person"><b>标签描述：</b></td>
						<td style="height: auto;" colspan="2"><textarea
								id="tagreadme" name="tagreadme"
								style="width: 300px; height: 80px;" class="txt01"></textarea></td>
					</tr>
					<tr style="height: 50px;">
						<td class="fs_person"><b>选择类型：</b></td>
						<td colspan="2">
					<textarea id="labclsNames" style="width: 300px; height: 120px;" class="txt01" readonly="readonly"></textarea> <input id="txtclsIds"
							type="hidden"> 
						</td>
					</tr>
					
					
				</table>
			</form>
		</div>
		<div id="bb">
			<a  onclick="doAddClassifyTag()" class="easyui-linkbutton" data-options="iconCls:'icon-ok'">保   存&nbsp;&nbsp;</a>
			<a  onclick="hideDialog()" class="easyui-linkbutton"  data-options="iconCls:'icon-cancel'">关   闭&nbsp;&nbsp;</a>
		</div>



	</div>
</body>
</html>