<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<base href="<%=basePath%>">
<!DOCTYPE html>
<html lang="en">

<head>
<jsp:include page="../headv2.jsp" />
<link href="${ctx}/lib/ligerUI/skins/Aqua/css/ligerui-all.css"
	rel="stylesheet" type="text/css">
<link href="${ctx }/css/common.css" rel="stylesheet" type="text/css" />

<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">

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
	src="${ctx }/js/config/classifyPersonalization.js"></script>
<script type="text/javascript">
	var appName = '${ctx}';
	$(function() {
		$("#classifyTreeGridDiv").css("height",
				1000 - 280 + "px");
		$("#classifyPersonalizationDiv").css("height",
				1000 - 200 + "px");
		$("#classifyPersonalizationGrid").css("height",
				$("#classifyPersonalizationDiv").height() + "px");
		personalizationList.init();
		classifyTreeList.init();
	});
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
				<div id="tagContext">
					<div id="leftContextCP">
							<div id="classifyPersonalizationDiv"
							>
							<table id="classifyPersonalizationGrid" title="维护语料管理个性化设置"></table>
						</div>
					</div>
					<div id="rightContextCP" style="background: #FFFFFF;">
						<div class="panel-header" style="width: 100%;"><div class="panel-title">自定义设置</div><div class="panel-tool"></div></div>
						<div id="toolbarTree"
							style="padding-top: 10px; padding-left: 10px; height: 40px; border-left:1px solid #ccc;border-right:1px solid #ccc;">
							<!-- 					style="height: 40px; padding-top: 12px; padding-left: 10px;"> -->
							<label for="keywordTree" id="keywordLabel"
								style="margin-right: 4px;">关键词</label> <input id="keywordTree"
								placeholder=""
								style="margin-top: 4px; border: 1px solid #ccc; width: 80px; height: 22px;">
							<a class="easyui-linkbutton"
								data-options="iconCls:'icon-search',plain:true"
								onclick="classifyTreeList.findClassify()">查询</a> <a
								href="javascript:void(0)" class="easyui-linkbutton"
								iconCls="icon-add" plain="true" onclick="showDialog()">自定义</a>
						</div>
						<div id="classifyTreeGridDiv"
							style="border: 1px solid #ccc; overflow: scroll;">
							<ul id="classifyTree"></ul>
						</div>
					</div>
				</div>

				<div id="dd" class="easyui-dialog" title="自定义"
					style="width: 550px; height: 420px;"
					data-options="buttons:'#bb',resizable:false,modal:true,closed:true,iconCls:'icon-changes'">
					<form id="ff" method="post">
						<table>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;">*</label><b>默认角色：</b></td>
								<td style="height: auto;">
									<div class="comboBoxDiv"
										style="float: left; margin-top: 2px; margin-right: 5px;">
										<input id="character" style="width: 359px; height: 25px;" />
									</div>
								</td>
							</tr>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;">*</label><b>语料状态：</b></td>
								<td style="height: auto;">
									<div class="comboBoxDiv"
										style="float: left; margin-top: 2px; margin-right: 5px;">
										<input id="corpusStatus" style="width: 359px; height: 25px;" />
									</div>
								</td>
							</tr>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;">*</label><b>操作人：</b></td>
								<td style="height: auto;">
									<div class="comboBoxDiv"
										style="float: left; margin-top: 2px; margin-right: 5px;">
										<input id="corpusAuditor" style="width: 359px; height: 25px;" />
									</div>
								</td>
							</tr>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;"></label><b>关键词：</b></td>
								<td style="height: auto;"><input id="corpusKeyword"
									placeholder="请输入问题或回复关键字"
									style="margin-top: 4px; border: 1px solid #ccc; width: 359px; height: 25px;"
									value="无答案"></td>
							</tr>
							<tr>
								<td class="fs_person"><b>描述：</b></td>
								<td style="height: auto;" colspan="2"><input type="text"
									id="tagreadme" name="tagreadme" value="" maxlength="50"
									style="width: 359px; height: 25px;" class="txt01"></td>
							</tr>
							<tr style="height: 50px;">
								<td class="fs_person"><b>选择类型：</b></td>
								<td colspan="2"><textarea id="labclsPNames"
										style="width: 359px; height: 120px;" class="txt01"
										readonly="readonly"></textarea> <input id="txtclsPIds"
									type="hidden"></td>
							</tr>


						</table>
					</form>
				</div>
				<div id="bb">
					<a onclick="doAddClassifyPersonalization()"
						class="easyui-linkbutton" data-options="iconCls:'icon-ok'">保
						存&nbsp;&nbsp;</a> <a onclick="hideDialog()" class="easyui-linkbutton"
						data-options="iconCls:'icon-cancel'">关 闭&nbsp;&nbsp;</a>
				</div>
				<!-- 编辑 -->
				<div id="editDiv" class="easyui-dialog" title="编辑个性化设置"
					style="width: 550px; height: 320px;"
					data-options="buttons:'#ee',resizable:false,modal:true,closed:true,iconCls:'icon-changes'">
					<form id="ff" method="post">

						<table>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;">*</label><b>默认角色：</b></td>
								<td style="height: auto;"><input type="hidden"
									id="txtEditId" name="txtEditId"
									value="${classifyPersonalization.id }"> <input
									id="txtCharacterId" type="hidden"
									value="${classifyPersonalization.characterId }"> <input
									id="txtStatus" type="hidden"
									value="${classifyPersonalization.corpusStatus }"> <input
									id="txtAuditor" type="hidden"
									value="${classifyPersonalization.auditor_id }">
									<div class="comboBoxDiv"
										style="float: left; margin-top: 2px; margin-right: 5px;">
										<input id="txtCharacter" style="width: 359px; height: 25px;" />


									</div></td>
							</tr>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;">*</label><b>语料状态：</b></td>
								<td style="height: auto;">
									<div class="comboBoxDiv"
										style="float: left; margin-top: 2px; margin-right: 5px;">
										<input id="txtCorpusStatus"
											style="width: 359px; height: 25px;" />
									</div>
								</td>
							</tr>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;">*</label><b>操作人：</b></td>
								<td style="height: auto;">
									<div class="comboBoxDiv"
										style="float: left; margin-top: 2px; margin-right: 5px;">
										<input id="txtCorpusAuditor"
											style="width: 359px; height: 25px;" />
									</div>
								</td>
							</tr>
							<tr>
								<td class="fs_person"><label
									style="color: #ff0000; font-weight: bold; font-size: 14px;"></label><b>关键词：</b></td>
								<td style="height: auto;"><input id="txtCorpusKeyword"
									placeholder="请输入问题或回复关键字"
									style="margin-top: 4px; border: 1px solid #ccc; width: 359px; height: 25px;"
									value="${classifyPersonalization.keywords }"></td>
							</tr>
							<tr>
								<td class="fs_person"><b>描述：</b></td>
								<td style="height: auto;" colspan="2"><input type="text"
									id="txtTagreadme" name="tagreadme"
									value="${classifyPersonalization.readme }" maxlength="50"
									style="width: 359px; height: 25px;" class="txt01"></td>
							</tr>


						</table>
					</form>
				</div>
				<div id="ee">
					<a onclick="doUpdateClassifyPersonalization()"
						class="easyui-linkbutton" data-options="iconCls:'icon-ok'">保
						存&nbsp;&nbsp;</a> <a onclick="hideDialogEdit()"
						class="easyui-linkbutton" data-options="iconCls:'icon-cancel'">关
						闭&nbsp;&nbsp;</a>
				</div>

				<footer>
					<jsp:include page="../footerv2.jsp" />
				</footer>
			</div>
		</div>

	</div>

</body>

</html>
