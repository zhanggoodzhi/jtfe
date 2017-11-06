$(function () {
    $.fn.dataTable.ext.errMode = "throw";
    initDataTables();
});
function initDataTables() {
    var table = $('#key-table').DataTable({
        ajax: {
            url: "weixinv2/broadcast/list",
            dataSrc: function (data) {
                var d = [];
                data.rows.forEach(function (value) {
                    d.push({
                        coverImg: "<img src='" + value.cover + "' class='cover-img' alt='封面' onerror='imgErr(this)'/>",
                        title: function () {
                            var msg = "";
                            if (value.title.length) {
                                value.title.forEach(function (v) {
                                    msg += "<p class='weixin-title'>" + v + "</p>";
                                });
                            }
                            return "<div>" + msg + "</div>";
                        },
                        target: value.group,
                        gender: value.gender,
                        account: value.wechatName,
                        status: value.status,
                        date: format(value.tsp)
                    });
                });
                return d;
            },
            data: function (d) {
                return {
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length
                };
            }
        },
        scrollY: window.innerWidth >= 768 ? $(".right_col").height() - 245 - $(".search-area").height() : $(".right_col").height() - 215 - $(".search-area").height(),//tbody高度
        scrollCollapse: true,//内容变少固定高度
        processing: false,//加载提示
        serverSide: true,//后端分页
        searching: false,//搜索栏
        ordering: false,//排序
        lengthChange: false,//页面显示栏数修改,
        pageLength: parseInt($("#page-change").val()),//每页显示条目
        pagingType: "simple_numbers",
        paging: true,//分页
        autoWidth: true,
        columns: [
            { data: "coverImg", title: "封面", className: "key-table-td" },
            { data: "title", title: "标题", className: "key-table-td" },
            { data: "target", title: "发送对象", className: "key-table-td" },
            { data: "gender", title: "性别", className: "key-table-td" },
            { data: "account", title: "公众号", className: "key-table-td" },
            { data: "status", title: "状态", className: "key-table-td" },
            { data: "date", title: "时间", className: "key-table-td" }
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

    })
        .on("error", function (err) {
            window.console.log(err);
        });
    $("#page-change").on("change", function () {
        var len = $(this).val();
        table.page.len(len).draw();

    });
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

function imgErr(img) {
    img.src = "images/loading.png";
    img.onerror = null;
}
