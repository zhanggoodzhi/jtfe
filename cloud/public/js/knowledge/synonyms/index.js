/*global PNotify moment*/
"use strict";
var table, state;
$(document).ready(function () {
    preventIESelect();
    initDate();
    initDataTables();
    initTags();
    initAddWords();
    initDelWords();
    initEditWords();
    initSubmit();
});
function initDataTables() {
    table = $('#key-table').DataTable({
        ajax: {
            type: "POST",
            url: "knowledge/synonyms/list",
            dataSrc: function (data) {
                var d = data.rows;
                return d;
            },
            data: function (d) {
                var time = $("#form-date").val().split(" - ");
                var data = {
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length,
                    beginTime: time[0],
                    endTime: time[1],
                    keyword: $.trim($("#keywrods").val())
                };
                return cleanData(data);
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
        autoWidth: true,
        select: {
            style: 'os',
            className: 'row-selected',
            blurable: false,
            info: false
        },
        drawCallback: function () {
            $(".dataTables_scrollBody").scrollTop(0);
        },
        columns: [
            { data: "representative", title: "同义词组代表词", },
            { data: "synonyms", title: "同文词组", },
            { data: "tsp", title: "修改时间", render: renderTime }
        ],
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

    $("#search-btn").on("click", function () {
        table.draw();
    });
    $("#page-change").on("change", function () {
        var len = $(this).val();
        table.page.len(len).draw();
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


function initDate() {
    var locale = {
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

function renderTime(data) {
    if (!data) {
        return "无数据";
    }
    else {
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
    }
}

function initTags() {
    var tag = $('#input-tag');
    var oldTitle;
    tag.tagsinput();
    $("#input-title").on("keyup", function () {
        var el = $(this);
        var val = $.trim(el.val());
        if (state === "edit") {
            oldTitle = tag.attr("data-value");
            tag.attr("data-value", val);
        }
        if (!oldTitle) {
            oldTitle = val;
        }
        else {
            tag.tagsinput("remove", oldTitle);
        }
        tag.tagsinput("add", val);
        oldTitle = val;
    });

    $("#add-modal").on("hidden.bs.modal", function () {
        $("#input-title").val("");
        tag.tagsinput('removeAll');
        clearData();
        state = null;
    });
}
function initAddWords() {
    $("#add-btn").on("click", function () {
        $("#add-modal").modal('show').find(".modal-title").text("添加同义词");
        clearData();
        state = "add";
    });
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

function initSubmit() {
    var tag = $('#input-tag');
    $("#submit-btn").on("click", function () {
        var title = $("#input-title");
        if (!state) {
            alertMessage("未知错误!");
        }
        else if (!title.val()) {
            alertMessage("请输入同义词代表词!");
        }
        else if (tag.tagsinput('items').length <= 1) {
            alertMessage("请至少输入一个同义词!");
        }
        else {
            var id = tag.attr("data-id");
            var data = {
                representative: $.trim($("#input-title").val()),
                synonyms: tag.val()
            };
            var url;
            if (id) {
                data.id = id;
                url = "knowledge/synonyms/update";
            }
            else {
                url = "knowledge/synonyms/add";
            }
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                success: function (msg) {
                    alertMessage(msg.msg, msg.code);
                    table.draw();
                    $("#add-modal").modal('hide');
                },
                error: function (err) {
                    alertMessage("错误代码：" + err.status);
                }
            });
        }
    });
}

function preventIESelect() {
    $("#key-table").on("mousedown", ".key-table-td", function (e) {
        e = e || window.event;
        if (e.which === 1 && e.ctrlKey) {
            e.preventDefault();
        }
    });
}


function initDelWords() {
    $("#del-btn").on("click", function () {
        var select = $(".row-selected");
        if (select.length < 0) {
            alertMessage("请选择要删除的同义词!");
        }
        else if (!table) {
            alertMessage("系统错误!");
            return;
        }
        else {
            var ids = Array.prototype.map.call(select, function (v) {
                return table.row($(v)).data().id;
            });
            ids = ids.join(",");
            $.ajax({
                url: "knowledge/synonyms/delete",
                type: "GET",
                data: {
                    ids: ids
                },
                success: function (msg) {
                    alertMessage(msg.msg, msg.code);
                    table.draw();
                },
                error: function (err) {
                    alertMessage("错误代码：" + err.status);
                }
            });
        }
    });

}

function clearData() {
    var tag = $("#input-tag");
    tag.attr({ "data-id": "", "data-value": "" });
}
function initEditWords() {
    var tag = $('#input-tag');
    $("#edit-btn").on("click", function () {
        var select = $(".row-selected");

        if (select.length > 1) {
            alertMessage("只能编辑一个同义词!");
        }
        else if (select.length < 1) {
            alertMessage("请选择要编辑的同义词!");
        }
        else {
            var data = table.row(select).data();
            var synonyms = data.synonyms.split(",");
            tag.attr("data-id", data.id);
            tag.attr("data-value", data.representative);
            $("#input-title").val(data.representative);
            synonyms.forEach(function (v) {
                tag.tagsinput("add", v);
            }, this);
            $("#add-modal").modal("show").find(".modal-title").text("编辑同义词");
            state = "edit";
        }
    });
}