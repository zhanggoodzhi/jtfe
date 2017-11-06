/*global moment PNotify selectData BootstrapDialog*/
"use strict";
var editTable, keyTable, pageNum;
var modalWidth;
var languageData = {
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
    },
    locale = {
        "format": "YYYY-MM-DD",
        "separator": " - ",
        "applyLabel": "确定",
        "cancelLabel": "取消",
        "fromLabel": "从",
        "toLabel": "到",
        "customRangeLabel": "自定义时间",
        "weekLabel": "W",
        "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
        "monthNames": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        "firstDay": 1
    };
$(function () {
    $.fn.dataTable.ext.errMode = 'throw';
    $("#edit-btn").on("click", editClick); //编辑问题弹出模态框
    $("#del-btn").on("click", delQuestion); //删除问题
    $("#check-btn").on("click", checkQuestion); //审核问题
    $("#search-btn").on("click", search); //查询问题
    $("#edit-modal").on("hidden.bs.modal", clearEditTable); //关闭模态框清空表格
    $("#page-change").on("change", pageLenChange); //修改单页显示数量
    $("#select-classify-text").on("click", selectShow); //分类下拉菜单显示
    $("#select-classify").on("mouseleave", selectHide); //分类下拉菜单隐藏
    $("#edit-select-classify").on("mouseleave", selectHide); //分类下拉菜单隐藏
    $("#search-type").on("change", changePlaceholder); //修改placeholder
    $("#form-question").on("keydown", keyboardSearch); //回车查询
    $("#form-answer").on("keydown", keyboardSearch); //回车查询
    $("#batch-upload-btn").on("click", uploadShow); //显示批量上传
    $("#upload").on("change", upload); //批量上传
    $("#upload-modal").on("hidden.bs.modal", resetUpload); //清空
    $("#export-btn").on("click", exportCorpus);
    $("#edit-modal").on("show.bs.modal", setModalWidth);
    $("#add-btn").on("click", createNewQuestion);
    preventIESelect(); //屏蔽ctrl+左键  IE
    initDate(); //初始化时间表单
    fillSelectData(); //填充下拉框菜单信息
    initDataTables(); //初始化主表格
});

function createNewQuestion() {
    window.location.href = "knowledge/editByA/update";
}

function initDate() {
    $("#form-date").daterangepicker({
        locale: locale,
        opens: "left",
        autoApply: true,
        alwaysShowCalendars: false,
        ranges: {
            '今天': [moment(), moment()],
            '最近7天': [moment().subtract(6, 'days'), moment()],
            '最近30天': [moment().subtract(29, 'days'), moment()],
            '最近3个月': [moment().subtract(3, 'month').startOf('month'), moment()],
            '最近1年': [moment().subtract(1, 'year').startOf('year'), moment()],
            '全部数据': ["1970-01-01", "2038-12-31"]
        },
        startDate: "1970-01-01",
        endDate: "2038-12-31"
    });
}
//main table
function initDataTables() {
    var width = $(".x_content").width() - 10;
    keyTable = $('#key-table').DataTable({
            ajax: {
                type: "POST",
                url: "knowledge/editByA/listCorpusByPM",
                dataSrc: function (data) {
                    var d = data.rows;
                    d.forEach(function (v) {
                        v.plainText = pure(v.plainText);
                        v.updateTime = format(v.updateTime);
                        v.statusName = getStatus(v.status);
                    });
                    return d;
                },
                data: function (d) {
                    var date = $("#form-date").val().split(" - ");
                    if (date[0].match("1970-01-01") && date[1].match("2038-12-31")) {
                        date[0] = "";
                        date[1] = "";
                    }
                    var data = {
                        keyword: $.trim($("#form-question").val()),
                        answerkeyword: $.trim($("#form-answer").val()),
                        classifys: $("#select-classify-text").attr("data-value"),
                        corpusStatus: $("#select-status").val(),
                        character: $("#select-character").val(),
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length,
                        fullmatch: $("#search-type").prop("checked") ? 1 : 0,
                        beginTime: $.trim(date[0]),
                        endTime: $.trim(date[1])
                    };
                    d = cleanData(data);
                    displayCountNum(d);
                    updatePaging(d.page);
                    return d;


                },
                error: function (err) {
                    alertMessage("错误代码" + err.status);
                }
            },
            scrollY: window.innerHeight > 768 ? $(".right_col").height() - 248 - $(".search-area").height() : $(".right_col").height() - 185 - $(".search-area").height(), //tbody高度
            scrollCollapse: false, //内容变少固定高度
            processing: true, //加载提示
            serverSide: true, //后端分页
            searching: false, //搜索栏
            ordering: false, //排序
            lengthChange: false, //页面显示栏数修改
            pageLength: parseInt($("#page-change").val()), //每页显示条目
            pagingType: "full",
            paging: true, //分页
            autoWidth: false,
            info: true,
            select: {
                style: 'os',
                className: 'row-selected',
                blurable: false,
                info: false
            },
            columns: [{
                data: "question",
                title: "问题",
                className: "key-table-td",
                render: function (data) {
                    return "<div title='" + data + "' class='show-title' style='width:" + (width * 0.25) + "px'>" + data + "</div>";
                }
            }, {
                data: "plainText",
                title: "回复",
                className: "key-table-td",
                render: function (data) {
                    return "<div title='" + data + "' class='show-title' style='width:" + (width * 0.35) + "px'>" + data + "</div>";
                }
            }, {
                data: "hits",
                title: "热度",
                className: "key-table-td"
            }, {
                data: "classifyName",
                title: "类型",
                className: "key-table-td",
            }, {
                data: "characterName",
                title: "角色",
                className: "key-table-td"
            }, {
                data: "statusName",
                title: "状态",
                className: "key-table-td"
            }, {
                data: "updateTime",
                title: "更新时间",
                className: "key-table-td"
            }],
            infoCallback: function () {
                return;
            },
            drawCallback: function () {
                $(".dataTables_scrollBody").scrollTop(0);
            },
            initComplete: function () {
                $("#key-table").on("dblclick", function () {
                    if ($(".row-selected").length < $("#page-change").val() / 2) {
                        keyTable.rows().select();
                    } else {
                        keyTable.rows().deselect();
                    }
                });

                //setWidth($("#key-table"));
            },
            language: languageData
        })
        .on("error", function () {
            alertMessage("请刷新后重试！");
        });
}

function format(time) {
    var date = new Date(time);
    var y = date.getFullYear();
    var m = addZero(date.getMonth() + 1);
    var d = addZero(date.getDate());

    return y + "-" + m + "-" + d;
}

function addZero(num) {
    if (num > 9) {
        return num;
    } else {
        return "0" + num;
    }
}
//通过id获取status名
function getStatus(value) {
    if (!selectData || !selectData.status) {
        return;
    } else {
        //8为已审核，其他为未审核
        if (value != 8) {
            return "未审核";
        } else {
            return "已审核";
        }
    }
}

function alertMessage(msg, status) {
    var title, actionStatus;
    var actionStatusName = "";
    PNotify.removeAll();
    status = status || "error";
    if (status === "success" || status === "200") {
        title = "操作成功";
        actionStatus = "success";
    } else {
        title = "操作失败";
        actionStatusName = "错误信息:";
        actionStatus = "error";
    }
    new PNotify({
        title: title,
        text: actionStatusName + msg,
        type: actionStatus,
        styling: 'bootstrap3',
        delay: "5000"
    });
}
//编辑按钮
function editClick() {
    var select = $("#key-table .row-selected");
    if (select.length <= 0) {
        alertMessage("请选择要操作的问题！")
    } else if (select.length > 1) {
        alertMessage("只能编辑一个问题！")
    } else {
        var id = keyTable.row(select).data().id;
        window.location.href = "knowledge/editByA/update?pairId=" + id;
    }
}

//关闭模态框清空编辑表
function clearEditTable() {
    if (editTable) {
        editTable.destroy();
        editTable = undefined;
        if ($("[data-date=true]").length > 0) {
            Array.prototype.forEach.call($("[data-date=true]"), function (v) {
                $(v).data("daterangepicker").remove();
            });
        }
        //$(".daterangepicker:not(':first')").remove();
        $("#edit-table").empty();
    }
    $("#edit-all").prop("checked", null);
    $("#question-wrap").css("display", "block"); //显示问题表单
    $("#edit-all-wrap").css("display", "none"); //隐藏编辑全部选框
    $("#edit-table-add-btn").css("display", "inline-block"); //显示添加按钮

}

//填充下拉框数据
function fillSelectData() {
    if (!selectData || !selectData.classify) {
        alertMessage("获取查询信息失败，请刷新后重试！");
        return;
    } else {
        var d = [{
            text: "所有问题",
            id: 0,
            parent: "#",
            state: {
                opened: true
            }
        }];
        selectData.classify.forEach(function (v) {
            var data = {
                id: v.id,
                text: v.name,
                parent: v.parent
            };


            d.push(data);
        });

        var mainTree = $("#select-classify").jstree({
                "core": {
                    "data": d,
                    "strings": false,
                    "animation": 100,
                    "themes": {
                        "icons": false
                    },
                    "multiple": true
                },
                "checkbox": {
                    "keep_selected_style": true,
                    "tie_selection": true,
                    "visible": false
                },
                "plugins": ["checkbox"]
            })
            .on("select_node.jstree", updateClassifyValue)
            .on("deselect_node.jstree", updateClassifyValue)
            .on('loaded.jstree', function () {
                mainTree.jstree('open_all');
            });
    }



}



//查询
function search() {
    keyTable.draw();
}
//修改单页显示数量
function pageLenChange() {
    var len = $(this).val();
    keyTable.page.len(len).draw();
}

//删除问题
function delQuestion() {
    var select = $("#key-table .row-selected");
    var d = [];
    if (select.length <= 0) {
        alertMessage("请选择要操作的问题！");
        return;
    }
    BootstrapDialog.show({
        title: "温馨提示",
        message: "确认删除选中问题吗？",
        size: BootstrapDialog.SIZE_SMALL,
        buttons: [{
            label: "确认",
            cssClass: "btn-danger",
            action: function (dialogItself) {
                Array.prototype.forEach.call(select, function (v) {
                    var data = keyTable.row(v).data();
                    d.push(data.id);
                });
                d = d.join(",");
                $.ajax({
                    url: "knowledge/editByA/delete",
                    data: {
                        pairIds: d
                    },
                    type: "POST",
                    success: function () {
                        refresh();
                    },
                    error: function (err) {
                        alertMessage("错误代码" + err.status);
                    }
                });
                dialogItself.close();
            }
        }, {
            label: "取消",
            cssClass: "btn-default",
            action: function (dialogItself) {
                dialogItself.close();
            }
        }]
    });
}
//审核问题
function checkQuestion() {
    var select = $("#key-table .row-selected");
    var checkedD = [];
    var unchecedD = [];
    if (select.length <= 0) {
        alertMessage("请选择要操作的问题！");
        return;
    }
    Array.prototype.forEach.call(select, function (v) {
        var data = keyTable.row(v).data();
        if (data.status != 8) {
            checkedD.push(data.id);
        } else {
            unchecedD.push(data.id);
        }
    });

    if (checkedD.length > 0) {
        checkedD = checkedD.join(",");
        $.ajax({
            url: "knowledge/pair/check",
            data: {
                pairIds: checkedD
            },
            type: "POST",
            success: function (msg) {
                refresh();
                alertMessage(msg.msg, msg.code);
            },
            error: function (err) {
                alertMessage("错误代码" + err.status);
            }
        });
    }

    if (unchecedD.length > 0) {
        unchecedD = unchecedD.join(",");
        $.ajax({
            url: "knowledge/pair/uncheck",
            data: {
                pairIds: unchecedD
            },
            type: "POST",
            success: function (msg) {
                refresh();
                alertMessage(msg.msg, msg.code);
            },
            error: function (err) {
                alertMessage("错误代码" + err.status);
            }
        });
    }
}

function selectShow() {
    $("#select-classify").slideToggle("fast");
}

function selectHide() {
    $(this).slideUp("fast");
}

//更新查询表单类型value和显示内容
function updateClassifyValue() {
    var data = $("#select-classify").jstree().get_selected(true);
    var classify = $("#select-classify-text");
    var tmp = {
        val: [],
        dataVal: []
    };
    if (data.length <= 0) {
        tmp.val = ["所有问题"];
    } else if (data.length === $("#select-classify .jstree-node").length) {
        tmp.val = ["所有问题"];
    } else {
        data.forEach(function (v) {
            if (v.id === "0") {
                return;
            } else {
                tmp.val.push(v.text);
                tmp.dataVal.push(v.id);
            }
        });
    }

    classify.text(tmp.val.join(","));
    classify.attr("data-value", tmp.dataVal.join(","));

}

//改变placeholder
function changePlaceholder() {
    var q = $("#form-question"),
        a = $("#form-answer");
    if ($(this).prop("checked")) {
        q.prop("placeholder", "全文匹配");
        a.prop("placeholder", "全文匹配");
    } else {
        q.prop("placeholder", "关键字");
        a.prop("placeholder", "关键字");
    }
}

//回车查询
function keyboardSearch(e) {
    if (e.keyCode === 13) {
        search();
        $(this).blur();
    } else {
        return;
    }
}

function displayCountNum(data) {
    var img, num, page;
    //防止该元素为初始化
    if ($("#key-table_info").length <= 0) {
        setTimeout(function () {
            displayCountNum(data);
            return;
        }, 50);
    }
    //只生成一次
    if ($("#num").length <= 0) {
        $("#key-table_info").html('<div class="num-wrap"><span>符合的条目数量:</span><img src="images/throbber.gif" alt="loading" class="num-img"><strong id="num"></strong><span>条</span><span class="page-total">总计:</span><img src="images/throbber.gif" alt="loading" class="num-img"><strong id="page"></strong><span>页</span><span id="paging-num" class="paging-num">- 1 -</span></div>');
        $("#key-table_wrapper").append("<div class='jump-wrap'><input type='text' id='jump-text'/><button class='btn btn-xs btn-primary' id='jump-btn' type='button'>跳转</button></div>");
        //有值点击选中全部
        $("#jump-text").on("focus", function () {
            if ($(this).val()) {
                $(this).select();
            }
        });
        $("#jump-btn").on("click", function () {
            var val = Number($("#jump-text").val());
            if (!pageNum) {
                alertMessage("请等待读取总数完成！");
                return;
            }
            jumpAction(val, pageNum);
        });
    }
    if (!data || data.page !== 1) {
        return;
    }
    img = $(".num-img");
    num = $("#num");
    page = $("#page");
    img.css("display", "inline-block");
    page.css("display", "none");
    num.css("display", "none");
    $.ajax({
        url: "knowledge/editByA/listCorpusByPMCount",
        type: "POST",
        data: data,
        success: function (msg) {
            if (msg.code === "200") {
                pageNum = Math.ceil(msg.msg / data.rows);
                img.css("display", "none");
                num.css("display", "inline");
                page.css("display", "inline");
                num.html("&nbsp;" + msg.msg + "&nbsp;");
                page.html("&nbsp;" + pageNum + "&nbsp;");
            }
        },
        error: function (err) {
            alertMessage("错误代码" + err.status);
        }

    });
}

function cleanData(data) {
    var d = {};
    for (var i in data) {
        if (data[i] !== undefined && data[i] !== null && data[i] !== "") {
            d[i] = data[i];
        }
    }
    return d;
}


function uploadShow() {
    $("#upload-modal").modal();
}

function upload() {
    //var data = new FormData(document.getElementById("upload-form"));
    if (!$("#upload").val()) {
        return;
    }
    new PNotify({
        title: "温馨提示",
        text: "正在上传语料文件...",
        type: "notice",
        styling: 'bootstrap3',
        hide: false
    });
    $("#upload-form").ajaxSubmit({
        url: 'knowledge/uploadCorpusSumit',
        type: "POST",
        // success: function (msg) {
        //     console.log(msg);
        //     alertMessage(msg.msg, msg.code);
        //     $("#upload-modal").modal("hide");
        // },
        // error: function (err) {
        //     alertMessage("错误代码" + err.status);
        // },
        complete: function (xhr) {
            var data = JSON.parse(xhr.responseText);
            if (data.code === "200") {
                alertMessage(data.msg, data.code);
                $("#upload-modal").modal("hide");
            } else {
                alertMessage("上传失败!");
            }
        }
    });

    // $.ajax({
    //     url: 'knowledge/uploadCorpusSumit',
    //     type: 'POST',
    //     data: data,
    //     contentType: false,
    //     processData: false,
    //     success: function (msg) {
    //         alertMessage(msg.msg, msg.code);
    //         $("#upload-modal").modal("hide");
    //     },
    //     error: function (err) {
    //         alertMessage("错误代码" + err.status);
    //     }
    // });
}

function jumpAction(val, total) {
    if (val <= 0 || val > total || isNaN(val)) {
        alertMessage("请输入正确的数字！");
        $("#jump-text").val("");
        return;
    } else {
        keyTable.page(val - 1).draw("page");
    }
}


function exportCorpus() {
    new PNotify({
        title: "提示",
        text: "正在生成文件, 请稍等",
        type: "notice",
        styling: 'bootstrap3',
        delay: "5000"
    });
    var date = $("#form-date").val().split(" - ");
    var data = {
        keyword: $.trim($("#form-question").val()),
        answerkeyword: $.trim($("#form-answer").val()),
        classifys: $("#select-classify-text").attr("data-value"),
        corpusStatus: $("#select-status").val(),
        character: $("#select-character").val(),
        fullmatch: $("#search-type").prop("checked") ? 1 : 0,
        beginTime: $.trim(date[0]),
        endTime: $.trim(date[1])
    };
    var d = cleanData(data);
    var str = "";
    for (var i in d) {
        str += "&" + i + "=" + d[i];
    }
    str = "?" + str.slice(1);
    location.href = "exportExcel" + str;

}


function resetUpload() {
    $("#upload").val(null);
}

function updatePaging(value) {
    $("#paging-num").text("- " + value + " -");
    $("#paging-num").attr("data-value", value - 1);
}
//保存paging刷新
function refresh() {
    var num = Number($("#paging-num").attr("data-value"));
    keyTable.page(num).draw("page");
}


function pure(data) {
    var t = $("<div>" + data + "</div>").text();
    return t;
}

function preventIESelect() {
    $("#key-table").on("mousedown", ".key-table-td", function (e) {
        e = e || window.event;
        if (e.which === 1 && e.ctrlKey) {
            e.preventDefault();
        }
    });
}


function setModalWidth() {
    var width = $(this).find(".modal-lg .modal-content").width();
    if (width <= 0) {
        modalWidth = 870;
    } else {
        modalWidth = width;
    }
    return modalWidth;
}

function getModalWidth() {
    var w = 870;
    if (modalWidth) {
        w = modalWidth;
    }
    return w;
}
