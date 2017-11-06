$(function() {
	corpusList.init();
});

var corpusList = (function($, undefined) {

	// 页面元素
	var $corpusGrid = undefined;
	var $classifyComboBox = undefined;
	var $corpusComboBox = undefined;
	var $characterComboBox = undefined;
	var $corpusAuditorComboBox = undefined;
	var $keyword = undefined;
	var queryParams = undefined;
	var $txtHidCharacterId = undefined;
	var $txtHidCorpusStatus = undefined;
	var $txtHidAuditorId = undefined;
	var $txtHidKeywords = undefined;
	var $txtHidclassifyPIds = undefined;
	var comboBoxManager = undefined;
	var corpusStatusManager = undefined;
	var characterManager = undefined;
	var auditorManager = undefined;
	var tableWidth = 0;
	var remainWidth = 0;

	// 请求参数
	var queryUrl = "knowledge/queryPairs1";
	var queryUrlSimilarity = "knowledge/querySimilarity";
	var editUrl = "knowledge/editCorpus";
	var deleteUrl = "knowledge/deleteCorpus";
	var checkUrl = "knowledge/checkCorpus";
	var unCheckUrl = "knowledge/unCheckCorpus";
	var classifysUrl = "knowledge/classifys";
	var charactersUrl = "knowledge/characters";
	var charactersUrlAll = "knowledge/charactersAll";
	var classifys = "-100";
	var classifyNames = undefined;
	var corpusStatus = 0;
	var corpusAuditor = 0;
	var character = -1;
	var keywordStr = "";

	var corpusAuditorData = [ {
		id : 0,
		text : "全部"
	}, {
		id : 1,
		text : "用户"
	} ];
	var corpusStatusData = [ {
		id : 0,
		text : "未审核"
	}, {
		id : 1,
		text : "已审核"
	} ];
	var rowData = undefined;
	var pageConfig = function(pageSize, pageList) {
		return {
			pageSize : pageSize,
			pageList : pageList,
			beforePageText : '第',
			afterPageText : '页  ',
			displayMsg : ' 当前为第 {from} - {to} 条',
			layout : [ 'list', 'first', 'prev', 'next' ]

		};
	}

	var autoWidth = function(percent, minWidth, remainMinWidth) {
		var result = 0;
		if (remainMinWidth) {
			result = Math.max(remainWidth, remainMinWidth);
		} else if (minWidth) {
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		} else {
			result = Math.round(tableWidth * percent);
		}

		remainWidth = remainWidth - result;
		// console.log("table width = " + tableWidth + ", percent = " + percent
		// +", result = " + result);
		return result;
	};
	// 配置参数
	var gridConfig = function() {
		return {
			height : document.body.scrollHeight - 130,
			toolbar : "#toolbar",
			url : queryUrl,
			queryParams : queryParams,
			singleSelect : true,
			sortName : "updateTime",
			sortOrder : "desc",
			nowrap : true,
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
			checkOnSelect : false,// 选择checkbox则选择行
			selectOnCheck : false,// 选择行则选择checkbox
			columns : [ [
					{
						field : "checkbox",
						checkbox : true

					// },{
					// field : "id",
					// title : "ID",
					// width : autoWidth(0.07),
					// align : "center",
					// halign : "center",
					// sortable : true
					},
					{
						field : "question",
						title : "问题",
						width : autoWidth(0.14),
						align : "left",
						halign : "center",
						sortable : true,
						formatter : function(value, rowData, rowIndex) {
							return cloudUtil.gridHtmlTips(value, 30);
						}
					},
					{
						field : "plainText",
						title : "回复",
						width : autoWidth(0.15),
						align : "left",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							return cloudUtil.gridHtmlTips(rowData.htmlContent,
									30);
						}
					},
					{
						field : "classifyName",
						title : "类型",
						width : autoWidth(0.08),
						align : "center",
						halign : "center",
					},

					{
						field : "characterName",
						title : "角色",
						width : autoWidth(0.08),
						align : "center",
						halign : "center",

					},
					{
						field : "status",
						title : "状态",
						width : autoWidth(0.04),
						align : "center",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							return value == 8 ? "已审核" : "未审核";
						}
					},
					{
						field : "updateTime",
						title : "更新时间",
						width : autoWidth(0.08),
						align : "center",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							var date = new Date(value);
							var formatDate = date
									.formatDate("yyyy-MM-dd hh:mm");
							return formatDate;
						}
					},

					{
						field : "opterate",
						title : "操作",
						width : autoWidth(0.15),
						align : "center",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							var opHtml = "";
							if (rowData.status != 8) {
								opHtml += "<a class='l-btn l-btn-small l-btn-plain' onclick='corpusList.operateCheck("
										+ rowIndex
										+ ")'>"
										+ "<span class='l-btn-left l-btn-icon-left'>"
										+ "<span class='l-btn-text'>审核</span>"
										+ "<span class='l-btn-icon icon-ok'></span>"
										+ "</span>" + "</a>";
							} else {
								opHtml += "<a class='l-btn l-btn-small l-btn-plain'  onclick='corpusList.operateUnCheck("
										+ rowIndex
										+ ")'>"
										+ "<span class='l-btn-left l-btn-icon-left'>"
										+ "<span class='l-btn-text'>撤销</span>"
										+ "<span class='l-btn-icon icon-undo'></span>"
										+ "</span>" + "</a>";
							}

							return opHtml
									+ "<a class='l-btn l-btn-small l-btn-plain' onclick='corpusList.operateEdit("
									+ rowIndex
									+ ")'>"
									+ "<span class='l-btn-left l-btn-icon-left'>"
									+ "<span class='l-btn-text'>编辑</span>"
									+ "<span class='l-btn-icon icon-edit'></span>"
									+ "</span>"
									+ "</a>"
									+ "<a class='l-btn l-btn-small l-btn-plain'  onclick='corpusList.operateDelete("
									+ rowData.id
									+ ")'>"
									+ "<span class='l-btn-left l-btn-icon-left'>"
									+ "<span class='l-btn-text'>删除</span>"
									+ "<span class='l-btn-icon icon-delete'></span>"
									+ "</span>" + "</a>";
						}
					} ] ],

			onLoadSuccess : function() {
				$corpusGrid.datagrid("uncheckAll");

			}
		};
	};
	// API
	// 配置参数
	var gridSimilarityConfig = function() {
		return {
			height : document.body.scrollHeight - 110,
			toolbar : "#toolbar",
			url : queryUrlSimilarity,
			queryParams : querySimilarityParams,
			singleSelect : false,
			nowrap : true,
			pagination : true,
			pageSize : 50,
			pageList : [ 50, 100, 150 ],
			rownumbers : true,
			columns : [ [
					{
						field : "checkbox",
						checkbox : true
					},
					{
						field : "question",
						title : "问题",
						width : autoWidth(0.14),
						align : "left",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							return cloudUtil.gridHtmlTips(value, 30);
						}
					},
					{
						field : "plainText",
						title : "回复",
						width : autoWidth(0.15),
						align : "left",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							return cloudUtil.gridHtmlTips(rowData.htmlContent,
									30);
						}
					},
					{
						field : "classifyName",
						title : "类型",
						width : autoWidth(0.08),
						align : "center",
						halign : "center"
					},

					{
						field : "characterName",
						title : "角色",
						width : autoWidth(0.08),
						align : "center",
						halign : "center"
					},
					{
						field : "status",
						title : "状态",
						width : autoWidth(0.04),
						align : "center",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							return value == 8 ? "已审核" : "未审核";
						}
					},
					{
						field : "updateTime",
						title : "更新时间",
						width : autoWidth(0.08),
						align : "center",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							var date = new Date(value);
							var formatDate = date
									.formatDate("yyyy-MM-dd hh:mm");
							return formatDate;
						}
					},
					{
						field : "createTime",
						title : "创建时间",
						width : autoWidth(0.08),
						align : "center",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							var date = new Date(value);
							var formatDate = date
									.formatDate("yyyy-MM-dd hh:mm");
							return formatDate;
						}
					},
					{
						field : "opterate",
						title : "操作",
						width : autoWidth(0.15),
						align : "center",
						halign : "center",
						formatter : function(value, rowData, rowIndex) {
							var opHtml = "";
							if (rowData.status != 8) {
								opHtml += "<a class='l-btn l-btn-small l-btn-plain' onclick='corpusList.operateCheck("
										+ rowIndex
										+ ")'>"
										+ "<span class='l-btn-left l-btn-icon-left'>"
										+ "<span class='l-btn-text'>审核</span>"
										+ "<span class='l-btn-icon icon-ok'></span>"
										+ "</span>" + "</a>";
							} else {
								opHtml += "<a class='l-btn l-btn-small l-btn-plain'  onclick='corpusList.operateUnCheck("
										+ rowIndex
										+ ")'>"
										+ "<span class='l-btn-left l-btn-icon-left'>"
										+ "<span class='l-btn-text'>撤销</span>"
										+ "<span class='l-btn-icon icon-undo'></span>"
										+ "</span>" + "</a>";
							}

							return opHtml
									+ "<a class='l-btn l-btn-small l-btn-plain' onclick='corpusList.operateEdit("
									+ rowIndex
									+ ")'>"
									+ "<span class='l-btn-left l-btn-icon-left'>"
									+ "<span class='l-btn-text'>编辑</span>"
									+ "<span class='l-btn-icon icon-edit'></span>"
									+ "</span>"
									+ "</a>"
									+ "<a class='l-btn l-btn-small l-btn-plain'  onclick='corpusList.operateDelete("
									+ rowData.id
									+ ")'>"
									+ "<span class='l-btn-left l-btn-icon-left'>"
									+ "<span class='l-btn-text'>删除</span>"
									+ "<span class='l-btn-icon icon-delete'></span>"
									+ "</span>" + "</a>";
						}
					} ] ]

			,

			onLoadSuccess : function(data) {
				if (data.status == "fail") {
					$.messager.alert("提示", data.message, 'error');
				} else if (data.status == "warn") {
					$.messager.alert("提示", data.message, 'warning');
				} else if (data.status == "success") {
				}
				$corpusGrid.datagrid("uncheckAll");
			}
		};
	};

	var editCorpusDialogConfig = function(title, mode, rowData, pairIds,
			questions) {
		return {
			height : 658,
			width : 700,
			title : title,
			url : editUrl,
			showMax : false,
			showMin : false,
			isResize : true,
			slide : false,
			data : {
				refresh : function() {
					$corpusGrid.datagrid('reload');
				},
				mode : mode,
				rowdata : rowData,
				pairIds : pairIds,
				questions : questions
			},
			buttons : [ {
				text : '确定',
				onclick : function(item, dialog) {
				}
			}, {
				text : '取消',
				onclick : function(item, dialog) {
					dialog.close();
				}
			} ]
		};
	};

	var uploadDialogConfig = function() {

		return {
			height : 280,
			width : 400,
			title : "批量上传语料",
			url : "knowledge/uploadCorpus",
			showMax : false,
			showMin : false,
			isResize : true,
			slide : false,
			data : {
				refresh : function() {
					gridReload();
				}
			},
			buttons : [ {
				text : '确定',
				onclick : function(item, dialog) {
				}
			}, {
				text : '取消',
				onclick : function(item, dialog) {
					dialog.close();
				}
			} ]
		};
	};

	var comboBoxConfig = function() {
		return {
			width : 200,
			selectBoxWidth : 200,
			selectBoxHeight : 250,
			valueField : "id",
			textField : "value",
			treeLeafOnly : true,
			slide : true,
			tree : {
				url : classifysUrl,
				ajaxType : "post",
				idFieldName : "id",
				parentIDFieldName : "parentId",
				textFieldName : "value",
				slide : true,
				isExpand : 3,
				onSelect : function(node) {
					console.log(node);
				}
			}
		};
	};

	var comboBoxConfig2 = function() {
		return {
			width : 90,
			selectBoxWidth : 90,
			selectBoxHeight : 250,
			valueField : "id",
			textField : "vname",
			slide : true,
			url : charactersUrlAll,
			ajaxType : "post",
			onSelect : function(node) {
				console.log(node);
			},
			onSuccess : function(data) {
				if (character != "") {
					this.setValue(character);
				}

			}

		};
	};
	var comboBoxConfig1 = function() {
		return {
			width : 90,
			selectBoxWidth : 90,
			selectBoxHeight : 250,
			valueField : "id",
			textField : "vname",
			slide : true,
			url : charactersUrl,
			ajaxType : "post",
			onSelect : function(node) {
				console.log(node);
			},
			onSuccess : function(data) {
				if (character != "") {
					this.setValue(character);
				}

			}

		};
	};
	var comboxBoxAuditor = function() {
		return {
			selectBoxWidth : 90,
			selectBoxHeight : 90,
			width : 90,
			emptyText : 0,
			valueField : "id",
			data : corpusAuditorData
		};
	}
	var $corpusGrid = function() {
		var reg = new RegExp(";", "g");
		if (comboBoxManager.getValue().replace(reg, ",") != "") {
			classifys = comboBoxManager.getValue().replace(reg, ",");
		} else {
			classifys = -100;
		}
		queryParams.classifys = classifys;
		queryParams.keyword = $keyword.val();
		queryParams.answerkeyword = $answerkeyword.val(),

		queryParams.corpusStatus = corpusStatusManager.getValue();
		queryParams.character = characterManager.getValue();
		queryParams.auditor = auditorManager.getValue();
		$corpusGrid.datagrid("uncheckAll");
		$corpusGrid.datagrid('load', queryParams);
	};
	var gridReload = function() {
		var reg = new RegExp(";", "g");
		if (comboBoxManager.getValue() == "") {
			classifys = -100;
		} else {
			if (comboBoxManager.getValue().replace(reg, ",") != "") {
				classifys = comboBoxManager.getValue().replace(reg, ",");
			} else {
				classifys = -100;
			}
		}
		queryParams.classifys = classifys;
		queryParams.keyword = $keyword.val();
		queryParams.answerkeyword = $answerkeyword.val(),

		queryParams.corpusStatus = corpusStatusManager.getValue();
		queryParams.character = characterManager.getValue();
		if (auditorManager.getValue() == "") {
			corpusAuditor = 0;
		} else {
			corpusAuditor = auditorManager.getValue()
		}
		queryParams.auditor = corpusAuditor;
		$corpusGrid.datagrid("uncheckAll");
		$corpusGrid.datagrid('load', queryParams);
		var grid = $('#corpusGrid');

		// $corpusGrid.datagrid(gridConfig());
		// $corpusGrid.datagrid('getPager').pagination(
		// pageConfig(50, [ 50, 100, 150 ]));
		// $(".datagrid-wrap").css("border-left-width",0);
		// $(".datagrid-wrap").css("border-right-width",0);
		// $(".datagrid-wrap").css("border-bottom-width",0);
	};

	/**
	 * 导出Excel表格数据 2015.10.22
	 */
	var gridExportExcel = function() {
		var reg = new RegExp(";", "g");
		if (comboBoxManager.getValue() == "") {
			classifys = -100;
		} else {
			if (comboBoxManager.getValue().replace(reg, ",") != "") {
				classifys = comboBoxManager.getValue().replace(reg, ",");
			} else {
				classifys = -100;
			}
		}
		var title = "语料管理";
		var keyword = $keyword.val();
		var sortName = "id";
		var sortOrder = "desc";

		corpusStatus = corpusStatusManager.getValue();
		character = characterManager.getValue();
		if (auditorManager.getValue() == "") {
			corpusAuditor = 0;
		} else {
			corpusAuditor = auditorManager.getValue()
		}
		console.log("title=" + title);
		console.log("corpusStatus=" + corpusStatus);
		console.log("corpusAuditor=" + corpusAuditor);
		console.log("character=" + character);
		console.log("classifys=" + classifys);
		console.log("keyword=" + keyword);
		console.log("sortName=" + sortName);
		console.log("sortOrder=" + sortOrder);
		jQuery.messager.confirm('提示:', '是否导出数据到Excel!', function(event) {
			if (event) {
				var queryParamsExcel = "title=" + title + "&corpusStatus=" + 0
						+ "&auditor=" + corpusAuditor + "&character="
						+ character + "&classifys=" + classifys + "&keyword="
						+ keyword + "&sortName=" + sortName + "&sortOrder="
						+ sortOrder;
				window.location.href = appName + "/knowledge/exportExcel?"
						+ queryParamsExcel;
			}
		});
	}

	var gridReloadSimilarity = function() {
		var reg = new RegExp(";", "g");
		if (comboBoxManager.getValue().replace(reg, ",") != "") {
			classifys = comboBoxManager.getValue().replace(reg, ",");
		} else {
			classifys = -100;
		}
		querySimilarityParams.classifys = classifys;
		querySimilarityParams.corpusStatus = corpusStatusManager.getValue();
		querySimilarityParams.character = characterManager.getValue();
		if (auditorManager.getValue() == "") {
			corpusAuditor = 0;
		} else {
			corpusAuditor = auditorManager.getValue()
		}
		queryParams.auditor = corpusAuditor;
		queryMultiWordDiv();
	};

	var initVar = function() {
		$corpusGrid = $("#corpusGrid");
		$txtHidCharacterId = $("#txtHidCharacterId").val();
		$txtHidCorpusStatus = $("#txtHidCorpusStatus").val();
		$txtHidAuditorId = $("#txtHidAuditorId").val();
		$txtHidclassifyPIds = $("#txtHidclassifyPIds").val();
		$txtHidKeywords = $("#txtHidKeywords").val();
		$classifyComboBox = $("#classifys");
		$characterComboBox = $("#character");
		$corpusAuditorComboBox = $("#corpusAuditor")
		$keyword = $("#keyword");
		$answerkeyword = $("#answerkeyword");
		if ($txtHidKeywords != undefined) {
			$keyword.val($txtHidKeywords);
		}
		if ($txtHidCharacterId != undefined) {
			character = $txtHidCharacterId
		}
		if ($txtHidAuditorId != undefined) {
			corpusAuditor = $txtHidAuditorId;
		}
		if ($txtHidCorpusStatus != undefined) {
			corpusStatus = $txtHidCorpusStatus;
		}

		if ($txtHidclassifyPIds != "") {
			classifys = $txtHidclassifyPIds;
		}
		queryParams = {
			keyword : $keyword.val(),
			answerkeyword : $answerkeyword.val(),
			classifys : classifys,
			corpusStatus : corpusStatus,
			character : character,
			auditor : corpusAuditor
		};
		querySimilarityParams = {
			keyword : $keyword.val(),
			answerkeyword : $answerkeyword.val(),
			literal : "",
			plainText : "",
			limitPage : 0,
			classifys : classifys,
			corpusStatus : corpusStatus,
			character : character,
			auditor : corpusAuditor
		};

		$keyword.bind('keypress', function(event) {
			if (event.keyCode == "13") {
				gridReload();
			}
		});

		$corpusComboBox = $("#corpusStatus");
		tableWidth = $("body").width() - 2 * 28;
		remainWidth = tableWidth;
		// corpusStatusManager.selectValue(corpusStatus);
	};
	var gridSimilarityData = function() {

		$corpusGrid.datagrid(gridSimilarityConfig());
		$corpusGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100, 150 ]));
		$(".datagrid-wrap").css("border-left-width", 0);
		$(".datagrid-wrap").css("border-right-width", 0);
		$(".datagrid-wrap").css("border-bottom-width", 0);
	}
	var initGrid = function() {
		$corpusGrid.datagrid(gridConfig());

		$corpusGrid.datagrid('getPager').pagination(
				pageConfig(50, [ 50, 100, 150 ]));

	};

	var initComboBox = function() {
		comboBoxManager = $classifyComboBox.ligerComboBox(comboBoxConfig());
		corpusStatusManager = $corpusComboBox.ligerComboBox({
			width : 80,
			emptyText : "",
			data : corpusStatusData,
			isMultiSelect : false,
			onSelected : function(newvalue) {
				// console.log("状态=" + newvalue);
			}
		// ,
		// onSuccess : function(data){
		//			
		// console.log(JSON.stringify(data));
		// this.setValue(1);//dialogData.rowdata.characterId
		// }
		});
		if (corpusStatus == "") {
			corpusStatus = "0";
		}
		corpusStatusManager.setValue(corpusStatus);
		characterManager = $characterComboBox.ligerComboBox(comboBoxConfig2());
		auditorManager = $corpusAuditorComboBox
				.ligerComboBox(comboxBoxAuditor());
		auditorManager.setValue(corpusAuditor);
	};

	var queryMultiWordDiv = function() {
		$("#divDebaseQueryMultiWord").show();
		queryMultiWordDivDialog = $("#divDebaseQueryMultiWord")
				.dialog(
						{
							width : 450,
							height : 150,
							iconCls : 'icon-similarity',
							resizable : false,
							shadow : true,
							modal : true,
							buttons : [
									{
										id : 'btnOK',
										text : '确定-AND',
										iconCls : 'icon-ok',
										align : 'center',
										tabindex : "3",
										handler : function() {

											var txtQuestion = $(
													'input:checkbox[name=txtQuestion]:checked')
													.val();
											var txtAnswer = $(
													'input:checkbox[name=txtAnswer]:checked')
													.val();
											if (txtQuestion == "1") {
												querySimilarityParams.literal = $(
														"#txtQuestionKeyWord")
														.val();
											} else {
												querySimilarityParams.literal = ""
											}
											if (txtAnswer == "2") {
												querySimilarityParams.plainText = $(
														"#txtAnswerKeyWord")
														.val();
											} else {
												querySimilarityParams.plainText = "";
											}
											querySimilarityParams.keyword = "";
											querySimilarityParams.limitPage = 9999;
											// $corpusGrid.datagrid("uncheckAll");
											// $corpusGrid.datagrid('load',
											// querySimilarityParams);
											gridSimilarityData();
											queryMultiWordDivDialog
													.dialog('close');
										}
									},
									{
										id : 'btnOK',
										text : '确定-OR',
										iconCls : 'icon-ok',
										align : 'center',
										handler : function() {

											var txtQuestion = $(
													'input:checkbox[name=txtQuestion]:checked')
													.val();
											var txtAnswer = $(
													'input:checkbox[name=txtAnswer]:checked')
													.val();
											var q = "";
											var a = "";
											if (txtQuestion == "1") {
												q = $("#txtQuestionKeyWord")
														.val();
											} else {
												q = "";
											}
											if (txtAnswer == "2") {
												a = $("#txtAnswerKeyWord")
														.val();
											} else {
												a = "";
											}

											querySimilarityParams.literal = ""
											querySimilarityParams.plainText = "";
											querySimilarityParams.keyword = q
													+ a;
											querySimilarityParams.limitPage = 0;
											// $corpusGrid.datagrid("uncheckAll");
											// $corpusGrid.datagrid('load',
											// querySimilarityParams);
											gridSimilarityData();
											queryMultiWordDivDialog
													.dialog('close');
										}
									},
									{
										id : 'btnClose',
										text : '关闭',
										iconCls : 'icon-cancel',
										handler : function() {
											queryMultiWordDivDialog
													.dialog('close');
										}
									} ],
							title : "&nbsp;选择多词查询模式",
						});
		queryMultiWordDivDialog.dialog('open');
	}
	var operateEdit = function(rowIndex) {
		var data = $corpusGrid.datagrid("getData");
		var rowData = data.rows[rowIndex];
		console.log(rowData);
		$.ligerDialog.open(editCorpusDialogConfig("修改问题", "2", rowData));
	};

	var batchEdit = function(rowIndex) {
		var pairIds = getSelectedIds($corpusGrid);
		var questions = getQuestions($corpusGrid);
		$.ligerDialog.open(editCorpusDialogConfig("批量编辑", "3", undefined,
				pairIds, questions));
	};

	var operateCheck = function(rowIndex) {
		var pairIds = getIdsByRowIndex($corpusGrid, rowIndex);
		checkCorpus(pairIds);
	};

	var batchCheck = function() {
		var pairIds = getSelectedIds($corpusGrid);
		checkCorpus(pairIds);
	};

	var checkCorpus = function(pairIds) {
		if (pairIds.length > 0) {
			corpusPost(checkUrl, {
				"pairIds" : pairIds.join(",")
			});
		} else {
			$.messager.alert("提示", "请选择要审核的问题!", 'warning');
		}
	};

	var operateUnCheck = function(rowIndex) {
		var pairIds = getIdsByRowIndex($corpusGrid, rowIndex);
		unCheckCorpus(pairIds);
	};

	var batchUnCheck = function() {
		var pairIds = getSelectedIds($corpusGrid);
		unCheckCorpus(pairIds);
	};

	var unCheckCorpus = function(pairIds) {
		if (pairIds.length > 0) {
			corpusPost(unCheckUrl, {
				"pairIds" : pairIds.join(",")
			});
		} else {
			$.messager.alert("提示", "请选择要撤销的问题!", 'warning');
		}
	};

	var corpusPost = function(url, params) {
		$(".easyui-panel").easyMask("show", {
			msg : "请稍候..."
		});
		$.post(url, params, function(data) {
			if (data.status == "fail") {
				$.messager.alert("提示", data.message, 'error');
			} else if (data.status == "warn") {
				$.messager.alert("提示", data.message, 'warning');
			} else if (data.status == "success") {

			}
			$(".easyui-panel").easyMask("hide");
			refresh();
		}, "json");
	};

	var showNumberOfQualifiedPair = function () {
		var reg = new RegExp(";", "g");
		if (comboBoxManager.getValue().replace(reg, ",") != "") {
			classifys = comboBoxManager.getValue().replace(reg, ",");
		} else {
			classifys = -100;
		}
		classifys = classifys;
		keyword = $keyword.val();
		answerkeyword = $answerkeyword.val(),

		corpusStatus = corpusStatusManager.getValue();
		character = characterManager.getValue();
		auditor = auditorManager.getValue();
		$('#counttext').text("正在查询中...");
		new PNotify({
            title: '正在计数',
            text: '正在为您计算符合当前查询条件的语料记录数',
            type: 'info'
        });
		$.ajax({
			url : 'knowledge/queryPairsCount',
			type : 'POST',
			data : {
				"classifys" : classifys,
				"corpusStatus" : corpusStatus,
				"auditor" : auditor,
				"character" : character,
				"keyword" : keyword,
				"answerkeyword" : answerkeyword
			},
			dataType : 'json',
			success : function(data) {
				$('#counttext').text("计数");
				
				new PNotify({
                    title: '计数结果',
                    text: '符合当前条件的查询语料共有'+data.count+'条',
                    type: 'success'
                });
			}
		});

	};
	var batchDelete = function() {
		pairIds = getSelectedIds($corpusGrid);
		deleteCorpus();
	};

	var operateDelete = function(pairId) {
		pairIds = new Array();
		pairIds.push(pairId);
		deleteCorpus();
		return false;
	};

	var deleteCorpus = function() {

		if (pairIds.length > 0) {

			$.messager.confirm("提示", "确认删除？", function(yes) {
				if (yes) {
					$(".easyui-panel").easyMask("show", {
						msg : "请稍候..."
					});
					$.post(deleteUrl, {
						"pairIds" : pairIds.join(",")
					}, function(data) {
						if (data.status == "fail") {
							$.messager.alert("提示", data.message, 'error');
						} else if (data.status == "warn") {
							$.messager.alert("提示", data.message, 'warning');
						} else if (data.status == "success") {
						}
						$(".easyui-panel").easyMask("hide", {
							msg : "请稍候..."
						});
						refresh();
					}, "json");

				}
			});
		} else {
			$.messager.alert("提示", "请选择要删除的问题!", 'warning');
		}

	};

	var getIdsByRowIndex = function(grid, rowIndex) {
		var data = grid.datagrid("getData");
		var rowData = data.rows[rowIndex];
		ids = new Array();
		ids.push(rowData.id);
		return ids;
	};

	var getSelectedIds = function(grid) {
		var rows = grid.datagrid("getChecked");
		var pairIds = new Array();
		for ( var index in rows) {
			pairIds.push(rows[index].id);
		}
		return pairIds;
	};

	var getQuestions = function(grid) {
		var rows = grid.datagrid("getChecked");
		var questions = new Array();
		for ( var index in rows) {
			questions.push(rows[index].question);
		}
		return questions;
	};

	var refresh = function() {
		// gridSimilarityData();
		$corpusGrid.datagrid('reload');

	};

	var method = {
		init : function() {
			initVar();
			initGrid();
			initComboBox();
		},
		gridReload : gridReload,
		addCorpusClick : function() {
			$.ligerDialog.open(editCorpusDialogConfig("添加问题", "1"));
		},
		uploadCorpusClick : function() {
			$.ligerDialog.open(uploadDialogConfig());
		},
		gridReloadSimilarity : gridReloadSimilarity,
		batchDelete : batchDelete,
		operateEdit : operateEdit,
		operateDelete : operateDelete,
		operateCheck : operateCheck,
		batchCheck : batchCheck,
		operateUnCheck : operateUnCheck,
		batchUnCheck : batchUnCheck,
		batchEdit : batchEdit,
		gridExportExcel : gridExportExcel,// 定义导出Excel的函数的入口。必须。
		showNumberOfQualifiedPair: showNumberOfQualifiedPair,
	};
	return method;
})(jQuery);

