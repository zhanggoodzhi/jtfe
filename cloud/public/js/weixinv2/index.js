var addWechat = function () {
    BootstrapDialog.show({
        message: $('<div></div>').load('/weixinv2/addWechatCredentialInfo.do')
    });
};

var table;

var updateWechat = function (wechatId) {
    BootstrapDialog.show({
        title: '提示',
        message: $('<div></div>').load(
            '/weixinv2/updateWechatCredentialInfo.do?=' + wechatId)
    });
};
var userDialog = undefined;

var delWechat = function (wechatId) {
    userDialog = new BootstrapDialog.show({
        title: '提示',
        message: '确认解除绑定?',
        buttons: [{
            label: '确认',
            cssClass: 'btn-primary',
            action: function () {
                ajaxDeleteWechat(wechatId);
            }
        }, {
            label: '取消',
            cssClass: 'btn-default',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }]
    });
};

var ajaxDeleteWechat = function (wechatId) {
    $.ajax({
        url: 'weixinv2/deleteWechatCredential',
        data: {
            wechatId: wechatId,
        },
        type: 'post',
        success: function (data, status) {
            if (status == "success") {
                userDialog.close();
                table.draw();
            }
        }
    });
};

function addRecordDynamically(wechatId, wxName, wxAppid, wxSecret) {
    trhtml = '<tr id="record-' + wechatId + '" class="even pointer">';
    trhtml += '<td class=" ">' + wxName + '</td>';
    trhtml += '<td class=" ">' + wxAppid + '</td>';
    trhtml += '<td class=" ">' + wxSecret + '</td>';
    trhtml += '<td class=" ">已认证</td>';
    trhtml += '<td class="last">';
    trhtml += '<a href="weixinv2/material/mediaHistory.do?id=' + wechatId +
        '">素材管理</a>';
    trhtml += '<a href="weixinv2/updateWechatCredentialInfo.do?id=' + wechatId +
        '">&nbsp编辑</a>';
    trhtml += '<a onclick="delWechat(\'' + wechatId +
        '\')" href="javascript:;">&nbsp解除绑定</a>';
    trhtml += '</td>';
    trhtml += '</tr>';
    $('#wechattable').append(trhtml);
};

function addWxAccount() {

    var wxAppId = $('#wxAppId').val().trim();
    var wxAppSecret = $('#appSecret').val().trim();
    var wxName = $('#wxName').val().trim();
    var wxType = "1";
    if ($('#accountType2').is(':checked'))
        wxType = "2";
    var syncType = $("input[name='sync-type']:checked").val();
    var description = $('#description').val().trim();
    var coverLocalUri = $('#coverLocalUri').val();
    console.log($("input[name='sync-type']:checked"));
    if (wxName == undefined || wxName == "") {
        new PNotify({
            title: '保存失败',
            text: '请设置公众号的名称',
            type: 'error'
        });
        return;
    } else if (wxAppId == undefined || wxAppId == "") {
        new PNotify({
            title: '保存失败',
            text: '请设置公众号的APPID',
            type: 'error'
        });
        return;
    } else if (wxAppSecret == undefined || wxAppSecret == "") {
        new PNotify({
            title: '保存失败',
            text: '请设置公众号的 AppSecret',
            type: 'error'
        });
        return;
    } else if (coverLocalUri == undefined || coverLocalUri == "") {
        new PNotify({
            title: '保存失败',
            text: '请设置公众号的二维码',
            type: 'error'
        });
        return;
    } else if (syncType === "") {
        new PNotify({
            title: '保存失败',
            text: '请设置同步素材',
            type: 'error'
        });
        return;
    }
    $('#addWechat').modal('hide');

    new PNotify({
        title: '提示：',
        text: '正在尝试从微信服务器获取公众号信息(素材,用户,消息等),请稍候',
        hide: false
    });

    $.ajax({
        url: 'weixinv2/addWechatCredential',
        type: 'POST',
        data: {
            "wxAppId": wxAppId,
            "wxAppSecret": wxAppSecret,
            "wxName": wxName,
            "wxType": wxType,
            "description": description,
            "coverLocalUri": coverLocalUri,
            "sync": syncType
        },
        success: function (data) {
            PNotify.removeAll();

            if (data.code == "200") {
                new PNotify({
                    title: '关联成功',
                    text: '您已成功关联了公众号:' + wxName,
                    type: 'success'
                });
                $('#wxAppId').val('');
                $('#appSecret').val('');
                $('#wxName').val('');
                $('#description').val('');
                $(".imgcover").css("background-image",
                    "url('images/upqrcode.png')");
                $('#coverLocalUri').val('');
                addRecordDynamically(data.msg, wxName, wxAppId, wxAppSecret);
                table.draw();
            } else {
                new PNotify({
                    title: '关联失败',
                    text: data.msg,
                    type: 'error'
                });

            }
        }
    });

}

function uploadQrcode() {
    var formObject;
    var url;
    formObject = $("#imgForm");
    url = "weixinv2/uploadQrcode";
    formObject.ajaxSubmit({
        url: url,
        type: 'post',
        dataType: 'json',
        complete: function (data, status, xhr) {
            var result = eval('(' + data.responseText + ')');
            if (result.code == "200") {
                $(".imgcover").css("background-image",
                    "url('" + result.msg + "')");
                $("#coverLocalUri").val(result.msg);
            } else {
                new PNotify({
                    title: '上传图片失败',
                    text: result.msg,
                    type: 'error'
                });
            }
        }
    }, 'json');
}

function resync(wechatId) {
    new PNotify({
        title: '提示：',
        text: '正在尝试从微信服务器获取公众号信息(素材,用户,消息等)更新,请稍候',
        hide: false
    });
    $.ajax({
        url: 'weixinv2/resync',
        data: {
            "wxappid": wechatId,
        },
        type: 'post',
        success: function (data, status) {
            if (status == "success") {
                alertMessage("已成功重新同步", "success");
                table.draw();
            }
        },
        error: function (error) {
            alertMessage("错误代码：" + error.status, "error");
        }
    });
}

function alertMessage(msg, status) {
    var titile;
    PNotify.removeAll();
    status = status || "error";
    if (status === "success") {
        title = "操作成功";
    } else {
        title = "操作失败";
    }
    new PNotify({
        title: title,
        text: msg,
        type: status,
        styling: 'bootstrap3',
        delay: "5000"
    });
}


$(function () {
    initDataTables();
});


function initDataTables() {
    table = $('#key-table').DataTable({
        ajax: {
            url: "weixinv2/list",
            dataSrc: function (data) {
                var d = data.rows;
                d.forEach(function (value, index) {
                    value.status = value.status == 1 ? "已认证" : "未认证";
                    value.action = "<div><a href='weixinv2/material/mediaHistory.do?id=" + value.id + "' class='btn btn-success btn-sm'>素材管理</a><a href='weixinv2/updateWechatCredentialInfo.do?id=" + value.id + "' class='btn btn-warning btn-sm'>编辑</a><button onclick='resync(\"" + value.wxAppId + "\")' class='btn btn-info btn-sm'>素材同步</button><button class='btn btn-danger btn-sm' type='button' onclick='delWechat(" + value.id + ")'>解除绑定</button></div>";
                });
                return d;
            },
            data: function (d) {
                return [];
            }
        },
        scrollY: window.innerWidth >= 768 ? $(".right_col").height() - 245 - $(".search-area").height() : $(".right_col").height() - 215 - $(".search-area").height(), //tbody高度
        scrollCollapse: true, //内容变少固定高度
        processing: false, //加载提示
        serverSide: true, //后端分页
        searching: false, //搜索栏
        ordering: false, //排序
        lengthChange: false, //页面显示栏数修改,
        pageLength: 10, //每页显示条目
        pagingType: "simple_numbers",
        paging: true, //分页
        autoWidth: true,
        columns: [{
                data: "wxName",
                title: "名称",
                className: "key-table-td"
            }, {
                data: "wxAppId",
                title: "APPID",
                className: "key-table-td"
            }, {
                data: "appSecret",
                title: "APPSECRET",
                className: "key-table-td"
            }, {
                data: "status",
                title: "状态",
                className: "key-table-td"
            }, {
                data: "action",
                title: "操作",
                className: "key-table-td",
                width: "270px"
            }

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
}
