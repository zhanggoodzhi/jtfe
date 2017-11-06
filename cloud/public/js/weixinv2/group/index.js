$(function () {
    initDataTables();
    $("#weixin-account").on("change", function () {
        var group = $("#weixin-group"),
            account = $(this);
        group.empty();
        group.append("<option value='' >全部分组</option>")
        if (!account.val()) {
            return;
        }

        $.ajax({
            url: "weixinv2/group/listGroup",
            type: "GET",
            data: {
                credentialId: account.val()
            },
            success: function (data) {
                var d = data.rows;
                d.forEach(function (value, index) {
                    group.append("<option value=" + value.id + " >" + value.name + "</option>");
                });
            }
        });
    });

});
function initDataTables() {
    var table = $('#key-table').DataTable({
        ajax: {
            url: "weixinv2/group/listUser",
            dataSrc: function (data) {
                var d = [];
                data.rows.forEach(function (value, index) {
                    d.push({
                        headImg: "<img src='" + value.key.headimgurl + "' class='head-img' alt='头像' onerror='imgErr(this)'/>",
                        wxName: value.key.credential.wxName,
                        nickname: value.key.nickname,
                        group: value.value,
                        city: value.key.city
                    });

                });
                return d;

            },
            data: function (d) {
                return {
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length,
                    credentialId: $("#weixin-account").val(),
                    groupId: $("#weixin-group").val()

                }
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
            { data: "headImg", title: "头像", className: "key-table-td" },
            { data: "wxName", title: "公众号", className: "key-table-td" },
            { data: "nickname", title: "昵称", className: "key-table-td" },
            { data: "group", title: "分组", className: "key-table-td" },
            { data: "city", title: "城市", className: "key-table-td" }


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
    $("#page-change").on("change", function (e) {
        var len = $(this).val();
        table.page.len(len).draw();

    });
    $("#search-btn").on("click", function () {
        if (!$("#weixin-account").val() && $("#weixin-group").val()) {
            return;
        }
        table.draw();
    });
}

function imgErr(img) {
    img.src = "images/user.png";
    img.onerror = null;
}

