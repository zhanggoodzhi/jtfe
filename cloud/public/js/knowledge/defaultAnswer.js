
function initDefaultAnswerGrid() {
	var autoWidth = function (percent, minWidth, remainMinWidth) {
		var tableWidth = $("body").width() - 2 * 22;

		remainWidth = tableWidth;
		var result = 0;
		if (remainMinWidth) {
			result = Math.max(remainWidth, remainMinWidth);
		} else if (minWidth) {
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		} else {
			result = Math.round(tableWidth * percent);
		}

		remainWidth = remainWidth - result;
		//		alert("table width = " + tableWidth + ", percent  = " + percent +", result  = " + result);
		return result;
	};

	var h = $("#mainContext").height() - 110;
	var appId = $("#txtAppId").val();
	$("#defaultAnswerTab")
		.datagrid(
		{
			width: autoWidth,
			height: 400,//document.body.scrollHeight/2,
			nowrap: true,
			rownumbers: true,
			singleSelect: true,
			toolbar: '#default_answer_tb',
			url: appName
			+ "/defaultAnswer/queryAppDefaultAnswer?appId="
			+ appId,
			columns: [[
				{
					field: 'plainText',
					title: '&nbsp;&nbsp;回复内容&nbsp;&nbsp;',
					width: autoWidth(0.45),
					sortable: true,
					align: 'center',
				},
				{
					field: 'priority',
					title: '&nbsp;&nbsp;优先级&nbsp;&nbsp;',
					sortable: true,
					width: autoWidth(0.05),
					align: 'center'
				},
				{
					field: 'opt',
					title: '&nbsp;&nbsp;操作&nbsp;&nbsp;',
					width: autoWidth(0.1),
					align: 'center',
					formatter: function (value, rec) {
						var btnEdit = '<a class="editDA" onclick="editDAData(' + rec.id + ')" href="/cloud/config/classifyTag">编辑</a>';
						var btnDel = '<a class="btnDelDA" onclick="btnDelDA(\''
							+ rec.id
							+ '\')" href="javascript:void(0)">删除</a>';
						return btnEdit + btnDel;
					}
				},]],
			onLoadSuccess: function (data) {
				$('.editDA').linkbutton({
					text: '编辑',
					plain: true,
					iconCls: 'icon-edit'
				});
				$('.btnDelDA').linkbutton({
					text: '删除',
					plain: true,
					iconCls: 'icon-no'
				});
			}

		});
}
/**
 * 刷新
 */
function reject() {
	$('#defaultAnswerTab').datagrid('loadData', { total: 0, rows: [] });
	initDefaultAnswerGrid();
	//window.location.href = appName + "/defaultAnswer/noanswerList";
}
/**
 * 编辑
 */
var defaultAnswerId;
function defaultAnswer_edit() {
	var id = defaultAnswerId;
	var appId = $("#txtAppId").val();
	$.post(appName + "/defaultAnswer/editDefaultAnswer", {
		"id": id,
		"appId": appId,
		"contentHtml": $("#edit-editor").html(),
		"plainText": $("#edit-editor").text(),
		"priority": $("#edit-txtPriority").val()
	}, function (data) {
		if (data == "0") {
			new PNotify({
				title: '错误：',
				text: '添加失败！',
				type: "error"
			});

		} else if (data == "2") {
			new PNotify({
				title: '错误：',
				text: '该内容已存在，无法修改！',
				type: "error"
			});
		} else {
			reject();
			$("#editAppDefaultAnswerDiv").modal('hide');
		}
	});
}


function editDAData(id) {
	defaultAnswerId = id;
	$.post(appName + "/defaultAnswer/AppDefaultAnswerById?id=" + id, function (data) {
		console.log(data);
		$(data).each(function (key, val) {
			$("#edit-editor").html(val.contentHtml);
			$("#edit-txtPriority").val(val.priority);
			$("#txtp").val(val.priority);
		});
	}, "json");

	$("#editAppDefaultAnswerDiv").modal('toggle');
}

function defaultAnswer_append() {
	var appId = $("#txtAppId").val();
	var contentHtml = $("#new-editor").html();
	var plainText = $.trim($("#new-editor").text());
	var priority = $("#add-txtPriority").val();
	if (plainText === "" || plainText === undefined) {
		new PNotify({
			title: '提示：',
			text: '请填写内容信息！'
		});
	} else {
		$.post(appName + "/defaultAnswer/saveDefaultAnswer", {
			"appId": appId,
			"contentHtml": contentHtml,
			"plainText": plainText,
			"priority": priority
		}, function (data) {
			if (data == "0") {
				new PNotify({
					title: '错误：',
					text: '添加失败！',
					type: "error"
				});
			} else if (data == "2") {
				new PNotify({
					title: '错误：',
					text: '该内容已存在，无法添加！',
					type: "error"
				});
			} else {
				reject();
				$("#saveAppDefaultAnswerDiv").modal('hide');
			}
		});
	}
}

function appendDefaultAnswer() {
	$("#saveAppDefaultAnswerDiv").modal('toggle');
}
/**
 * 删除
 */
var ids = [];
function btnDelDA(id) {
	ids = new Array();
	ids.push(id);
	$("#delDiv").modal('toggle');
	document.getElementById('del_confirmed').onclick = function () {
		$.post(appName + "/defaultAnswer/doDeleteDefaultAnswer", {
			'ids': ids.join(",")
		}, function (data) {
			if (data == "1") {
				reject();
				$("#delDiv").modal('hide');
			} else {
				new PNotify({
					title: '错误：',
					text: '删除数据失败！',
					type: "error"
				});
			}
		});
	};
}