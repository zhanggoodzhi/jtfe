/*global PNotify moment*/
"use strict";
$(document).ready(function () {
    getClassify();
    initDataTables();
    initView();
});
function initDataTables() {
    var table = $('#key-table').DataTable({
        ajax: {
            type: "POST",
            url: "spss/robotFeedback/list",
            dataSrc: function (data) {
                var d = data.rows;
                return d;
            },
            data: function (d) {
                var data = {
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length,
                    keyword: $.trim($("#form-question").val()),
                    classifys: $("#select-classify-text").attr("data-value")
                };
                return cleanData(data);

            }
        },
        scrollY: window.innerWidth >= 768 ? window.innerWidth - 245 - $(".search-area").height() : window.innerWidth - 215 - $(".search-area").height(),//tbody高度
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
        drawCallback: function () {
            $(".dataTables_scrollBody").scrollTop(0);
        },
        initComplete:function(){
            
        },
        columns: [
            { data: "tsp", title: "时间", render: renderTime },
            { data: "score", title: "分数", render: renderScore },
            { data: "shortComment", title: "不满原因" },
            { data: "userComment", title: "用户评论" },
            { data: "clientUserId", title: "操作", render: renderView },
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

function renderView(data) {
    if (!data) {
        return "";
    }
    else {
        return "<botton type='botton' class='btn btn-sm btn-success view-record' data-id='" + data + "'>查看聊天记录</botton>";
    }
}

// function alertMessage(msg, status) {
//     var title;
//     PNotify.removeAll();
//     status = status || "error";
//     if (status === "success") {
//         title = "操作成功";
//     }
//     else {
//         title = "操作失败";
//     }
//     new PNotify({
//         title: title,
//         text: msg,
//         type: status,
//         styling: 'bootstrap3',
//         delay: "5000"
//     });
// }

function renderTime(data) {
    if (!data) {
        return "无数据";
    }
    else {
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
    }
}

function renderScore(data) {
    var score;
    if (!data && data !== 0) {
        return "无数据";
    }
    else {
        switch (data) {
            case 100:
                score = "非常满意";
                break;
            case 75:
                score = "满意";
                break;
            case 50:
                score = "一般";
                break;
            case 25:
                score = "不满意";
                break;
            case 0:
                score = "非常不满意";
                break;
            default:
                score = data + "分";
                break;
        }
        return score;
    }
}

function getClassify() {
    $.ajax({
        url: "knowledge/classifys",
        type: "get",
        success: function (data) {
            var d = [];
            data.forEach(function (v) {
                if (v.id === 0) {
                    v.parentId = "#";
                }
                d.push({
                    text: v.value,
                    parent: v.parentId,
                    id: v.id
                });
            });
            initClassifyTree(d);
        }
    });
}

function initClassifyTree(d) {
    var tree = $("#select-classify").jstree({
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
    }).on('loaded.jstree', function () {
        tree.jstree('open_all');
    }).on("select_node.jstree deselect_node.jstree", updateClassifyValue);

    $("#select-classify-text").on("click", function () {
        $("#select-classify").slideToggle("fast");
    });
    $("#select-classify").on("mouseleave", function () {
        $("#select-classify").slideUp("fast");
    });

}

function updateClassifyValue() {
    var data = $("#select-classify").jstree().get_selected(true);
    var classify = $("#select-classify-text");
    var tmp = {
        val: [],
        dataVal: []
    };
    if (data.length <= 0) {
        tmp.val = ["所有问题"];
    }
    else if (data.length === $("#select-classify .jstree-node").length) {
        tmp.val = ["所有问题"];
    }
    else {
        data.forEach(function (v) {
            if (v.id === "0") {
                return;
            }
            else {
                tmp.val.push(v.text);
                tmp.dataVal.push(v.id);
            }
        });
    }
    classify.text(tmp.val.join(","));
    classify.attr("data-value", tmp.dataVal.join(","));
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


function initView() {
    $("#key-table").on("click", ".view-record", function () {
        $.ajax({
            url: "spss/queryClientDetail",
            type: "POST",
            data: {
                stringUid: $(this).attr("data-id"),
               // stringUid: "DE803E096C21B2C2F5BFB0E9348A762F",
                // uid:6237,
                category: -100,
                classifys: -100,
                keyword: "",
                startDay: "Sat Jul 10 2016 00:00:00 GMT+0800",
                endDay: "Sat Jul 16 2016 19:31:29 GMT+0800",
                page: 1,
                rows: 20,
                sort: "time",
                order: "desc",
            },
            success: function (data) {
                console.log(data);
            }
        });
    });
}
