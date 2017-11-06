var editTable, keyTable, publicData;
$(function () {
    $("#edit-btn").on("click", function () {
        var select = $(".row-selected");
        if (select.length < 1) {
            return;
        }
        edit();
    });//触发模态框
    initDataTables();
    initDate();
});

function edit(qid) {
    if (editTable) {
        editTable.destroy();
        editTable=null;
    }

    editTable = $('#edit-table').DataTable({
        // ajax: {
        //     url: "knowledge/listByQuestionId",
        //     dataSrc: function (data) {
        //         var d = [];
        //         data.rows.forEach(function (v, i) {
        //             d.push({
        //                 beginTime: "<div class='input-wrap'><input type='text' value='" + format(v.beginTime) + "' class='form-control date input-sm'></div>",
        //                 endTime: "<div class='input-wrap'><input type='text' value='" + format(v.endTime) + "' class='form-control date input-sm'></div>",
        //                 status: getStatus(v.status),
        //                 character: v.character.vname,
        //                 answer: v.answer.plainText
        //             });
        //         });
        //         $("#question").val(data.rows[0].question.literal);
        //         return d;
        //     },
        //     data: function (d) {
        //         return {
        //             qid: keyTable.row($(".row-selected")).data().questionId
        //         };
        //     }
        // },
        data:(function(){
            var select=$(".row-selected");
            var d=[];
            $("#question").val(keyTable.row(select[0]).data().question);
            Array.prototype.forEach.call(select,function(v,i){
                var data=keyTable.row(v).data();
                d.push({
                    beginTime: "<div class='input-wrap'><input type='text' value='" + data.beginTime + "' class='form-control date input-sm'></div>",
                    endTime: "<div class='input-wrap'><input type='text' value='" + data.endTime + "' class='form-control date input-sm'></div>",
                    status: data.status,
                    character: data.characterName,
                    answer: data.plainText
                });
            });
            console.log(d);
            return d;
        }()),
        processing: false,//加载提示
        serverSide: false,//后端分页
        searching: false,//搜索栏
        ordering: false,//排序
        lengthChange: false,//页面显示栏数修改
        pageLength: parseInt($("#page-change").val()),//每页显示条目
        pagingType: "simple_numbers",
        paging: false,//分页
        autoWidth: false,
        info: false,
        columns: [
            { data: "answer", title: "回复", className: "key-table-td" },
            { data: "status", title: "状态", className: "key-table-td", width: "100px" },
            { data: "character", title: "角色", className: "key-table-td", width: "100px" },
            { data: "beginTime", title: "生效时间", className: "key-table-td", width: "150px" },
            { data: "endTime", title: "失效时间", className: "key-table-td", width: "150px" },

        ],
        initComplete: function () {
            $("#edit-modal").modal();
            $("#edit-table .date").datetimepicker({
                format: "yyyy-mm-dd",
                minView: 2,
                autoclose: true,
                language: "zh-CN"
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


}

function initDate() {
    (function ($) {
        $.fn.datetimepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"]
        };
    } (jQuery));
    $(".date").datetimepicker({
        format: "yyyy-mm-dd",
        minView: 2,
        autoclose: true,
        language: "zh-CN"
    });
}

function initDataTables() {
    keyTable = $('#key-table').DataTable({
        ajax: {
            url: "knowledge/queryPairs1",
            dataSrc: function (data) {
                var d = data.rows;
                d.forEach(function (v, i) {
                    v.updateTime = format(v.updateTime);
                    v.status = getStatus(v.status);
                });
                return d;
            },
            data: function (d) {
                return {
                    keyword: "",
                    answerkeyword: "",
                    classifys: "-100",
                    corpusStatus: "",
                    character: "",
                    auditor: "",
                    page: 1,
                    rows: 50,
                    sort: "updateTime",
                    order: "desc"
                }


            }
        },
        scrollY: $(".right_col").height() - 245 - $(".search-area").height(),//tbody高度
        scrollCollapse: true,//内容变少固定高度
        processing: false,//加载提示
        serverSide: true,//后端分页
        searching: false,//搜索栏
        ordering: false,//排序
        lengthChange: false,//页面显示栏数修改
        pageLength: parseInt($("#page-change").val()),//每页显示条目
        pagingType: "simple",
        paging: true,//分页
        autoWidth: true,
        info: false,
        select: {
            style: 'multi',
            className: 'row-selected',
            blurable: false,
            info: false
        },
        columns: [
            { data: "question", title: "问题", className: "key-table-td" },
            { data: "plainText", title: "回复", className: "key-table-td" },
            { data: "classifyName", title: "类型", className: "key-table-td" },
            { data: "characterName", title: "角色", className: "key-table-td" },
            { data: "status", title: "状态", className: "key-table-td" },
            { data: "updateTime", title: "更新时间", className: "key-table-td" },

        ],
        initComplete: function () {
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
    // $("#del-btn").on("click", function (e) {
    //     var selectArr = [],
    //         select = $(".row-selected");
    //     if (select.length > 0) {
    //         Array.prototype.forEach.call(select, function (value, index) {
    //             var data = table.row(value).data();
    //             selectArr.push(data.id);
    //         });
    //         BootstrapDialog.show({
    //             title: "温馨提示",
    //             message: "确认删除选中的关键词吗？",
    //             size: BootstrapDialog.SIZE_SMALL,
    //             buttons: [
    //                 {
    //                     label: "确认",
    //                     cssClass: "btn-success",
    //                     action: function (dialogItself) {
    //                         emptyKeyword();
    //                         delAjax(selectArr.join(","));
    //                         dialogItself.close();
    //                     }
    //                 },
    //                 {
    //                     label: "取消",
    //                     cssClass: "btn-default",
    //                     action: function (dialogItself) {
    //                         dialogItself.close();
    //                     }
    //                 }
    //             ]

    //         });
    //     }
    //     else {
    //         alertMessage("请选择一个关键词！");
    //     }

    // });
    // $("#add-btn").on("click", function (e) {
    //     BootstrapDialog.show({
    //         title: "请填写要添加的关键词",
    //         message: $('<input class="form-control input-sm" id="add-word">'),
    //         size: BootstrapDialog.SIZE_SMALL,
    //         buttons: [
    //             {
    //                 label: "确认",
    //                 cssClass: "btn-success",
    //                 action: function (dialogItself) {
    //                     if (!$("#add-word").val()) {
    //                         alertMessage("请填写关键词！");
    //                         return;
    //                     }
    //                     emptyKeyword();
    //                     addAjax();
    //                     dialogItself.close();
    //                 }
    //             },
    //             {
    //                 label: "取消",
    //                 cssClass: "btn-default",
    //                 action: function (dialogItself) {
    //                     dialogItself.close();
    //                 }
    //             }
    //         ]
    //     });
    // });

    // $("#search-btn").on("click", function () {
    //     table.draw();
    // });

    // $("#keyword").on("input", function () {
    //     if (!$(this).val()) {
    //         table.draw();
    //     }
    //     else {
    //         return;
    //     }
    // })
    // $("#page-change").on("change", function (e) {
    //     var len = $(this).val();
    //     table.page.len(len).draw();

    // });
    // function delAjax(data) {
    //     $.ajax({
    //         url: "keyword/delete",
    //         type: "POST",
    //         data: {
    //             ids: data
    //         },
    //         cache: false,
    //         success: function (msg) {
    //             if (msg.code === "200") {
    //                 alertMessage(msg.msg, "success");
    //             }
    //             else {
    //                 alertMessage(msg.msg);
    //             }
    //             table.draw();
    //         },
    //         error: function (err) {
    //             alertMessage(err);
    //         }

    //     });
    // }

    // function addAjax() {
    //     $.ajax({
    //         type: "POST",
    //         url: "keyword/add",
    //         data: {
    //             word: $("#add-word").val()
    //         },
    //         cache: false,
    //         success: function (msg) {
    //             if (msg.code === "200") {
    //                 alertMessage(msg.msg, "success");
    //             }
    //             else {
    //                 alertMessage(msg.msg);
    //             }
    //             table.draw();
    //         },
    //         error: function () {
    //             alertMessage(err);
    //         }

    //     });
    // }

}

function format(time) {
    var date = new Date(time);
    var y = date.getFullYear();
    var m = addZero(date.getMonth() + 1);
    var d = addZero(date.getDate());
    var h = addZero(date.getHours());
    var min = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());

    return y + "-" + m + "-" + d;
}
function addZero(num) {
    if (num > 9) {
        return num;
    }
    else {
        return "0" + num;
    }
}

function getStatus(num) {
    if (num == 1) {
        return "未审核";
    }
    else if (num == 8) {
        return "已审核";
    }
}