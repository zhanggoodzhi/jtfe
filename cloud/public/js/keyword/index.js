/*global BootstrapDialog PNotify*/
"use strict";
$(document).ready(function () {
    initDataTables();
    preventIESelect();
});


function initDataTables() {
    var table = $('#key-table').DataTable({
        ajax: {
            type: "POST",
            url: "keyword/list",
            dataSrc: function (data) {
                var d = data.rows;
                // d.forEach(function (value) {
                //     value.createTime = format(value.createTime);
                //     value.updateTime = format(value.updateTime);
                // });
                return d;
            },
            data: function (d) {
                return {
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length,
                    keyword: $("#keyword").val() || ""
                };
            }
        },
        scrollY: window.innerWidth >= 768 ? $(".right_col").height() - 245 - $(".search-area").height() : $(".right_col").height() - 215 - $(".search-area").height(),//tbody高度
        scrollCollapse: true,//内容变少固定高度
        processing: false,//加载提示
        serverSide: true,//后端分页
        searching: false,//搜索栏
        ordering: false,//排序
        lengthChange: false,//页面显示栏数修改
        pageLength: parseInt($("#page-change").val()),//每页显示条目
        pagingType: "simple_numbers",
        paging: true,//分页
        autoWidth: false,
        select: {
            style: 'os',
            className: 'row-selected',
            blurable: false,
            info: false
        },
        columns: [
            { data: "word", title: "关键词" },
            { data: "createTime", title: "创建时间", render: function (data) { return format(data); } },
            { data: "updateTime", title: "修改时间", render: function (data) { return format(data); } },

        ],
        initComplete: function () {
            $("#key-table").on("dblclick", function () {
                if ($(".row-selected").length < $("#page-change").val() / 2) {
                    table.rows().select();
                }
                else {
                    table.rows().deselect();
                }

            });
        },
        language: {
            emptyTable: "没有数据",
            info: " 第 _START_ 到 _END_ 条数据，总计 _TOTAL_ 条数据",
            lengthMenu: "每页显示 _MENU_ 条数据",
            loadingRecords: "加载中...",
            processing: "查询中...",
            search: "查找:",
            zeroRecords: "没有检索到数据",
            infoEmpty: '没有检索到数据',
            infoFiltered: '(从 _MAX_ 条记录中筛选)',
            paginate: {
                first: '首页',
                previous: '上页',
                next: '下页',
                last: '尾页'
            }
        }


    });
    $("#del-btn").on("click", function () {
        var selectArr = [],
            select = $(".row-selected");
        if (select.length > 0) {
            Array.prototype.forEach.call(select, function (value) {
                var data = table.row(value).data();
                selectArr.push(data.id);
            });
            BootstrapDialog.show({
                title: "温馨提示",
                message: "确认删除选中的关键词吗？",
                size: BootstrapDialog.SIZE_SMALL,
                buttons: [
                    {
                        label: "确认",
                        cssClass: "btn-success",
                        action: function (dialogItself) {
                            emptyKeyword();
                            delAjax(selectArr.join(","));
                            dialogItself.close();
                        }
                    },
                    {
                        label: "取消",
                        cssClass: "btn-default",
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                    }
                ]

            });
        }
        else {
            alertMessage("请选择一个关键词！");
        }

    });
    $("#add-btn").on("click", function () {
        BootstrapDialog.show({
            title: "请填写要添加的关键词",
            message: $('<input class="form-control input-sm" id="add-word">'),
            size: BootstrapDialog.SIZE_SMALL,
            buttons: [
                {
                    label: "确认",
                    cssClass: "btn-primary",
                    action: function (dialogItself) {
                        if (!$("#add-word").val()) {
                            alertMessage("请填写关键词！");
                            return;
                        }
                        emptyKeyword();
                        addAjax();
                        dialogItself.close();
                    }
                },
                {
                    label: "取消",
                    cssClass: "btn-default",
                    action: function (dialogItself) {
                        dialogItself.close();
                    }
                }
            ]
        });
    });

    $("#edit-btn").on("click", function () {
        var select = $(".row-selected");
        var str = "";
        if (select.length > 0) {
            $("#edit-modal").modal("show");
            Array.prototype.forEach.call(select, function (v) {
                var data = table.row(v).data();
                str += '<div class="form-group"><label class="col-sm-3 control-label" title="' + data.word + '">' + data.word + '</label><div class="col-sm-9"><input type="text" class="form-control" name="' + data.id + '" value="' + data.word + '"  data-old="' + data.word + '"></div></div>';
            });
            $("#edit-modal-content").empty().append(str);
        }
        else {
            alertMessage("请选择一个关键词！");
        }
    });

    // $("#edit-modal").on("hidden.bs.modal", function () {
    //     $("#edit-modal-content").empty();
    // });

    $("#edit-submit").on("click", function () {
        var data = [];
        var btn = $(this);
        Array.prototype.forEach.call($("#edit-modal-content input"), function (v) {
            var el = $(v);
            var val = $.trim(el.val());
            if (val === el.attr("data-old")) {
                return;
            }
            data.push({
                id: Number(el.prop("name")),
                name: val
            });
        });
        if (data.length <= 0) {
            alertMessage("未修改关键词或所有关键词为空!");
            return;
        }
        loadingBtn(btn);
        $.ajax({
            url: "keyword/update",
            type: "POST",
            data: JSON.stringify({ "data": data }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                if (!msg.error) {
                    $("#edit-modal").modal("hide");
                    table.draw();
                }
                alertMessage(msg.msg, msg.code);
            },
            complete: function () {
                loadingEndBtn(btn, "确定");
            }
        });
        //console.log($("#edit-modal-content").serializeArray(), $("#edit-modal-content").serialize());
    });

    $("#search-btn").on("click", function () {
        table.draw();
    });

    $("#keyword").on("input", function () {
        if (!$(this).val()) {
            table.draw();
        }
        else {
            return;
        }
    })
        .on("keydown", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                table.draw();
                $(this).blur();

            }
            else {
                return;
            }
        });

    $("#page-change").on("change", function () {
        var len = $(this).val();
        table.page.len(len).draw();

    });
    function delAjax(data) {
        $.ajax({
            url: "keyword/delete",
            type: "POST",
            data: {
                ids: data
            },
            cache: false,
            success: function (msg) {
                if (msg.code === "200") {
                    alertMessage(msg.msg, "success");
                }
                else {
                    alertMessage(msg.msg);
                }
                table.draw();
            },
            error: function (err) {
                alertMessage(err);
            }

        });
    }

    function addAjax() {
        $.ajax({
            type: "POST",
            url: "keyword/add",
            data: {
                word: $("#add-word").val()
            },
            cache: false,
            success: function (msg) {
                if (msg.code === "200") {
                    alertMessage(msg.msg, "success");
                }
                else {
                    alertMessage(msg.msg);
                }
                table.draw();
            },
            error: function (err) {
                alertMessage(err);
            }

        });
    }

}


function alertMessage(msg, status) {
    var title, type;
    PNotify.removeAll();
    switch (status) {
        case "success":
        case "200":
        case "true":
            type = "success";
            title = "操作成功";
            break;
        default:
            type = "error";
            title = "操作失败";
            break;
    }
    new PNotify({
        title: title,
        text: msg,
        type: type,
        styling: 'bootstrap3',
        delay: "5000"
    });
}

function emptyKeyword() {
    $("#keyword").val("");
}
function format(time) {
    var date = new Date(time);
    var y = date.getFullYear();
    var m = addZero(date.getMonth() + 1);
    var d = addZero(date.getDate());
    var h = addZero(date.getHours());
    var min = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());
    return y + " - " + m + " - " + d + " &nbsp;" + h + ":" + min + ":" + s;
}
function addZero(num) {
    if (num > 9) {
        return num;
    }
    else {
        return "0" + num;
    }
}
function preventIESelect() {
    $("#key-table").on("mousedown", ".key-table-td", function (e) {
        e = e || window.event;
        if (e.which === 1 && e.ctrlKey) {
            e.preventDefault();
        }
    });
}

function loadingBtn(el) {
    el.html('<i class="fa fa-spinner rotate" id="rotate"></i>').prop("disabled", "disabled");
}

function loadingEndBtn(el, text) {
    el.prop("disabled", null).text(text);
}
