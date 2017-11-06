function initDefaultDocumentGrid() {
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
    var appid = $("#appidSave").val();
    $("#defaultDocumentTab")
        .datagrid({
            width: '100%',
            height: document.body.scrollHeight - 110,
            nowrap: true,
            rownumbers: true,
            singleSelect: true,
            toolbar: '#tb',
            url: appName +
            "/document/queryAppDefaultDocument?appid=" +
            appid,
            columns: [
                [{
                    field: 'docname',
                    title: '&nbsp;&nbsp;文档名称&nbsp;&nbsp;',
                    width: autoWidth(0.2),
                    sortable: true,
                    align: 'center',
                }, {
                    field: 'doctype',
                    title: '&nbsp;&nbsp文档格式&nbsp;&nbsp;',
                    width: autoWidth(0.1),
                    sortable: true,
                    align: 'center',
                }, {
                    field: 'docsize',
                    title: '&nbsp;&nbsp文档大小&nbsp;&nbsp;',
                    width: autoWidth(0.1),
                    sortable: true,
                    align: 'center',
                }, {
                    field: 'location',
                    title: '&nbsp;&nbsp上传路径&nbsp;&nbsp;',
                    width: autoWidth(0.2),
                    sortable: true,
                    align: 'center',
                }, {
                    field: 'opt',
                    title: '&nbsp;&nbsp;操作&nbsp;&nbsp;',
                    width: autoWidth(0.2),
                    align: 'center',
                    formatter: function (value, rec) {
                        var btnEdit = '<a class="editDA" onclick="editDAData(' + rec.id + ')" href="/cloud/config/classifyTag">编辑</a>';
                        var btnDel = '<a class="btnDelDA" onclick="btnDelDA(\'' +
                            rec.id +
                            '\')" href="javascript:void(0)">删除</a>';
                        return btnEdit + btnDel;
                    }
                },]
            ],
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
    window.location.href = appName + "/document/documentManager";
}
/**
 * 编辑
 */
var documentId;

function docment_update() {
    var id = documentId;
    if ($("#docnameEdit").val() == "" || $("#docnameEdit").val() == null) {
        new PNotify({
            title: '提示：',
            text: '文件名为必填项！'
        });
        return;
    }
    //验证图片格式
    var file = $("#attachEdit");
    var fileValue = document.getElementById("attachEdit").value;
    if (fileValue != null && fileValue.length > 0) {
        if (!/.(doc|docx|pdf|txt)$/.test(fileValue)) {
            fileValue = null;
            new PNotify({
                title: '提示：',
                text: '文件格式需为doc|docx|pdf|txt中的一种！'
            });
            file.after(imgfile.clone().val(""));
            file.remove();
            return;
        }
    }

    $('#edit').ajaxSubmit({
        url: appName + "/document/editDefaultDocument",
        type: 'post',
        dateType: 'json',
        //onSubmit: function(){},
        complete: function (data, status, xhr) {
            console.log(data);
        },
        success: function (result) {
            var data = $.parseJSON(result);
            if (data == "2") {
                new PNotify({
                    title: '错误：',
                    text: '文件名已存在，无法修改',
                    type: 'error'
                });
            } else {
                window.location.href = appName + "/document/documentManager";
                $("#editAppDefaultAccountDiv").modal('hide');
            }
        }
    }, 'json');
}


function editDAData(id) {
    documentId = id;
    $.post(appName + "/document/appDefaultDocumentById?id=" + id, function (data) {
        $(data).each(function (key, val) {
            $("#idEdit").val(val.id);
            $("#docnameEdit").val(val.docname);
            $("#existfile").html(val.location);
        });
    }, "json");

    $("#editAppDefaultDocumentDiv").modal('toggle');

}

//add new document
function docment_add() {
    var appid = $("#txtAppId").val();
    if ($("#docnameSave").val() == "" || $("#docnameSave").val() == null) {
        new PNotify({
            title: '提示：',
            text: '文件名为必填项！'
        });
        return;
    }
    //验证图片格式
    var file = $("#attachSave");
    var fileValue = document.getElementById("attachSave").value;
    if (fileValue != null && fileValue.length > 0) {
        if (!/.(doc|docx|pdf|txt)$/.test(fileValue)) {
            fileValue = null;
            new PNotify({
                title: '提示：',
                text: '文件格式需为doc|docx|pdf|txt中的一种！'
            });
            file.after(imgfile.clone().val(""));
            file.remove();
            return;
        }
    } else {
        new PNotify({
            title: '提示：',
            text: '文件未上传！'
        });
        return false;
    }

    $('#save').ajaxSubmit({
        url: appName + "/document/saveDefaultDocument",
        type: 'post',
        dateType: 'json',
        //onSubmit: function(){},
        complete: function (data, status, xhr) {
            console.log(data);
        },
        success: function (result) {
            if (!result.error) {
                $("#saveAppDefaultDocumentDiv").modal('hide');
                window.location.reload();
            } else {
                new PNotify({
                    title: '操作失败',
                    text: result.msg,
                    type: 'error'
                });
            }
        }
    }, 'json');
}


function append() {
    $("#saveAppDefaultDocumentDiv").modal('toggle');
}
/**
 * 删除
 */
var ids = [];

function btnDelDA(id) {
    ids = new Array();
    ids.push(id);
    var url = appName + "/document/doDeleteDefaultDocument";
    $("#delDiv").modal('toggle');
    $("#del_confirmed").click(function () {
        $.post(url, {
            'ids': ids.join(",")
        }, function (data) {
            if (data == "1") {
                window.location.href = appName + "/document/documentManager";
                $("#delDiv").modal('hide');
            } else {
                new PNotify({
                    title: '错误：',
                    text: '删除数据失败！',
                    type: 'error'
                });
            }
        });
    });
}


$(function () {

    $("#defaultDocumentTabDiv").css("height",
        $("#mainContext").height() - 110 + "px");
    $("#defaultDocumentTab").css("height",
        $("#defaultDocumentTabDiv").height() - 50 + "px");
    initDefaultDocumentGrid();

    $("#document_save_confirmed").click(function () {
        docment_add();
    });

    $("#document_update_confirmed").click(function () {
        docment_update();
    });
});
