<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="en">

<head>
<jsp:include page="../headv2.jsp" />
<link href="${ctx }/css/common.css" rel="stylesheet" type="text/css" />

<link href="${ctx}/lib/ligerUI/skins/Aqua/css/ligerui-all.css"
	rel="stylesheet" type="text/css">
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${ctx}/jquery-easyui-1.3.6/themes/icon.css">
	
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx }/js/index.js"></script>
<script type="text/javascript"
	src="${ctx}/jquery-easyui-1.3.6/jquery.easyui.mask.js"></script>
<script src="${ctx}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerComboBox.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerTree.js"
	type="text/javascript"></script>
<script src="${ctx}/lib/ligerUI/js/plugins/ligerDialog.js"
	type="text/javascript"></script>


<script type="text/javascript" src="${ctx}/js/knowledge/cloudUtil.js"></script>
<script type="text/javascript"
	src="${ctx}/js/knowledge/cloudKnowledge.js"></script>
<script type="text/javascript" src="${ctx}/js/knowledge/corpusList.js"></script>
<script type="text/javascript">
	var contextPath = '${pageContext.request.contextPath}';
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
				<div id="cutAppWin">
					<table id="cutAppInfoTable"
						style="margin: 5px 0px 0px 10px; width: 400px;" cellpadding="0"
						cellspacing="0"></table>
				</div>
				<input type="hidden" id="txtAudit_statusType"
					value="${ audit_statusType}">
				<div id="toolbar"
					style="height: 80px; padding-top: 12px; padding-left: 10px;">
					<div>
						<div style="float: left">
							<label for="classifys" id="classifysLabel"
								style="margin-right: 4px; margin-top: 4px; float: left; font-size: 12px;">类型</label>
							<div class="comboBoxDiv"
								style="float: left; margin-top: 2px; margin-right: 5px;">
								<input id="classifys" />
							</div>
						</div>
						<div style="float: left">
							<label for="corpusStatus" id="corpusStatusLabel"
								style="margin-right: 4px; margin-top: 4px; float: left;">状态</label>
							<div class="comboBoxDiv"
								style="float: left; margin-top: 2px; margin-right: 5px;">
								<input id="corpusStatus" style="width: 85px; height: 20px;" />
							</div>
						</div>
						<div style="float: left">
							<label for="character" id="characterLabel"
								style="margin-right: 4px; margin-top: 4px; float: left;">角色</label>
							<div class="comboBoxDiv"
								style="float: left; margin-top: 2px; margin-right: 5px;">
								<input id="character" style="width: 95px; height: 20px;" />
							</div>
						</div>
						<div style="float: left">
							<label for="corpusAuditor" id="corpusAuditorLabel"
								style="margin-right: 4px; margin-top: 4px; float: left;">操作人</label>
							<div class="comboBoxDiv"
								style="float: left; margin-top: 2px; margin-right: 5px;">
								<input id="corpusAuditor" style="width: 85px; height: 20px;" />
							</div>
						</div>
						<label for="keyword" id="keywordLabel" style="margin-right: 4px;">问题</label>
						<input id="keyword" placeholder="关键词"
							style="margin-top: 4px; border: 1px solid #ccc; width: 120px; height: 20px;"
							value="${classifyPersonalization.keywords }"> 
							<label for="keyword" id="keywordLabel" style="margin-right: 4px;">回复</label>
						<input id="answerkeyword" placeholder="关键词"
							style="margin-top: 4px; border: 1px solid #ccc; width: 120px; height: 20px;"
							value=""> 
							<input
							type="hidden" id="txtHidCorpusStatus"
							value="${classifyPersonalization.corpusStatus }"> <input
							type="hidden" id="txtHidAuditorId"
							value="${classifyPersonalization.auditor_id }"> <input
							type="hidden" id="txtHidCharacterId"
							value="${classifyPersonalization.characterId }"> <input
							type="hidden" id="txtHidKeywords"
							value="${classifyPersonalization.keywords }"> <input
							type="hidden" id="txtHidclassifyPIds" value="${classifyPIds }">

					
					</div>
					<div style="margin-top: 5px;">
						<label class="easyui-linkbutton"
							data-options="iconCls:'icon-add',plain:true"
							onclick="corpusList.addCorpusClick()">添加</label> <a
							class="easyui-linkbutton"
							data-options="iconCls:'icon-upload',plain:true"
							onclick="corpusList.uploadCorpusClick()">批量上传</a> <a
							class="easyui-linkbutton"
							data-options="iconCls:'icon-delete',plain:true"
							onclick="corpusList.batchDelete()">批量删除</a> <a
							class="easyui-linkbutton"
							data-options="iconCls:'icon-ok',plain:true"
							onclick="corpusList.batchCheck()">批量审核</a> <a
							class="easyui-linkbutton"
							data-options="iconCls:'icon-undo',plain:true"
							onclick="corpusList.batchUnCheck()">批量撤销</a> <a
							class="easyui-linkbutton"
							data-options="iconCls:'icon-edit',plain:true"
							onclick="corpusList.batchEdit()">批量编辑</a><a
							class="easyui-linkbutton"
							data-options="iconCls:'icon-dr',plain:true"
							onclick="corpusList.gridExportExcel()">导出未审核语料</a>
							<a class="easyui-linkbutton"
							data-options="iconCls:'icon-aut',plain:true"
							onclick="window.open ('personalization/classifyPersonalization') ">默认查询参数配置</a>
							
							<span style=" margin-left:40px;">
							<a class="easyui-linkbutton"
							data-options="iconCls:'icon-sum',plain:true"
							onclick="corpusList.showNumberOfQualifiedPair()"><span id="counttext">计数</span></a>
							
								<a class="easyui-linkbutton"
							data-options="iconCls:'icon-search',plain:true"
							onclick="corpusList.gridReload()">查询</a>
					
						
						</span>
					</div>
				</div>
				<table id="corpusGrid"></table>

				<div id="divDebaseQueryMultiWord"
					style="display: none; text-align: center;">
					<table>
						<tr>
							<td>&nbsp;<input type="checkbox" name="txtQuestion"
								checked="checked" value="1" style="cursor: pointer;"><span
								style="font-size: 14; color: #000;">&nbsp;问题：</span>
							</td>
							<td><input id="txtQuestionKeyWord" placeholder="请输入问题关键字"
								tabindex="1"
								style="margin-top: 4px; border: 1px solid #ccc; width: 350px; height: 20px; font-size: 14; color: #000;">
							</td>
						</tr>

						<tr style="margin-top: 30px;">
							<td>&nbsp;<input type="checkbox" name="txtAnswer" value="2"
								checked="checked" style="cursor: pointer;"><span
								style="font-size: 14; color: #000;">&nbsp;回复：</span></td>
							<td><input id="txtAnswerKeyWord" placeholder="请输入回复关键字"
								tabindex="2"
								style="margin-top: 4px; border: 1px solid #ccc; width: 350px; height: 20px; font-size: 14; color: #000;">
							</td>
						</tr>

					</table>
				</div>
				<footer>
					<jsp:include page="../footerv2.jsp" />
				</footer>
			</div>
		</div>

	</div>


</body>

</html>
