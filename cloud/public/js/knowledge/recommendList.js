$(function () {
    recommendList.init();
});

var recommendList = (function ($, undefined) {

    // 页面元素
    var $recommendGrid = undefined;
    var $classifyComboBox = undefined;
    var $keyword = undefined;
    var $toolbar = undefined;

    var comboBoxManager = undefined;
    var tableWidth = 0;
    var remainWidth = 0;

    // 请求参数
    var queryUrl = "knowledge/queryRecommends1";
    var deleteUrl = "knowledge/deleteRecommend";
    var editUrl = "knowledge/addRecommend";
    var classifys = "-100";
    var queryParams = {
        keyword: "",
        classifys: classifys
    };

    var autoWidth = function (percent, minWidth, remainMinWidth) {
        var result = 0;
        if (remainMinWidth) {
            result = Math.max(remainWidth, remainMinWidth);
        } else if (minWidth) {
            result = Math.round(Math.max(tableWidth * percent, minWidth));
        } else {
            result = Math.round(tableWidth * percent);
        }

        remainWidth = remainWidth - result;
        //console.log("table width = " + tableWidth + ", percent  = " + percent +", result  = " + result);
        return result;
    };

    // 配置参数
    var gridConfig = function () {
        return {
            height: document.body.scrollHeight - 220,
            toolbar: "#toolbar",
            url: queryUrl,
            queryParams: queryParams,
            singleSelect: false,
            sortName: "id",
            sortOrder: "desc",
            pagination: true,
            pageSize: 20,
            pageList: [20, 50, 100],
            rownumbers: true,
            columns: [
                [{
                    field: "checkbox",
                    checkbox: true
                        //				},{
                        //					field : "id",
                        //					title : "ID",
                        //					width : autoWidth(0.07),
                        //					align : "center",
                        //					halign : "center",
                        //					sortable : true
                }, {
                    field: "question",
                    title: "问题",
                    width: autoWidth(0.30),
                    align: "left",
                    halign: "center",
                    sortable: true
                }, {
                    field: "recommendQuestion",
                    title: "推荐问题",
                    width: autoWidth(0.30),
                    align: "left",
                    halign: "center",
                    sortable: true
                }, {
                    field: "opterate",
                    title: "操作",
                    align: "center",
                    width: autoWidth(0.21),
                    halign: "center",
                    sortable: false,
                    formatter: function (value, rowData, rowIndex) {
                        return "<a class='l-btn l-btn-small l-btn-plain' onclick='recommendList.operateDelete(" + rowData.id + ")'>" +
                            "<span class='l-btn-left l-btn-icon-left'>" +
                            "<span class='l-btn-text'>删除</span>" +
                            "<span class='l-btn-icon icon-delete'></span>" +
                            "</span>" +
                            "</a>";
                    }
                }]
            ],
            onLoadSuccess: function () {
                $recommendGrid.datagrid("uncheckAll");
            }
        };
    };

    var comboBoxConfig = function () {
        return {
            width: 250,
            selectBoxWidth: 250,
            selectBoxHeight: 250,
            valueField: "id",
            textField: "value",
            treeLeafOnly: true,
            tree: {
                url: "knowledge/classifys",
                ajaxType: "post",
                idFieldName: "id",
                parentIDFieldName: "parentId",
                textFieldName: "value",
                slide: true,
                isExpand: 2,
                onSelect: function (node) {
                    console.log(node);
                }
            }
        };
    };

    var addRecommendConfig = function () {
        return {
            height: 520,
            width: 1060,
            title: "添加推荐问题",
            url: editUrl,
            showMax: false,
            showMin: false,
            isResize: true,
            slide: false,
            data: {
                refresh: function () {
                    $recommendGrid.datagrid('reload');
                },
                mode: "1"
            },
            buttons: [{
                text: '确定',
                onclick: function (item, dialog) {}
            }, {
                text: '关闭',
                onclick: function (item, dialog) {
                    dialog.close();
                    gridReload();
                }
            }]
        };
    };

    var pageConfig = function (pageSize, pageList) {
        return {
            pageSize: pageSize,
            pageList: pageList,
            beforePageText: '第',
            afterPageText: '页',
            displayMsg: '显示 {from} - {to} 条,  共 {total}条',
        };
    };

    var gridReload = function () {
        var reg = new RegExp(";", "g");
        if (comboBoxManager.getValue().replace(reg, ",") != "") {
            classifys = comboBoxManager.getValue().replace(reg, ",");
        } else {
            classifys = -100;
        }
        queryParams.classifys = classifys;
        queryParams.keyword = $keyword.val();

        //TODO,抽取参数queryParams, Grid方便后期重构
        $recommendGrid.datagrid('load', queryParams)

    };

    var operateDelete = function (recommendId) {
        pairIds = new Array();
        pairIds.push(recommendId);
        deleteRecommend();
        return false;
    };

    var batchDelete = function () {
        var rows = $recommendGrid.datagrid("getSelections");
        pairIds = new Array();
        for (var index in rows) {
            pairIds.push(rows[index].id);
        }
        deleteRecommend();
    };

    var deleteRecommend = function () {

        if (pairIds.length > 0) {
            $("#delDiv").modal('toggle');
            $("#del_confirmed").click(function () {
                $.post(deleteUrl, {
                    "pairIds": pairIds.join(",")
                }, function (data) {
                    if (data.status == "fail") {
                        new PNotify({
                            title: '错误：',
                            text: data.message,
                            type: "error"
                        });
                    } else if (data.status == "warn") {
                        new PNotify({
                            title: '提示：',
                            text: data.message
                        });
                    } else if (data.status == "success") {
                        //						$.messager.alert("提示",data.message,'info');
                        refresh();
                        $("#delDiv").modal('hide');
                    }
                }, "json");
            });
            //			$.messager.confirm("提示","确认删除？",function(yes){
            //				if(yes){

            //				}
            //			});
        } else {
            new PNotify({
                title: '提示：',
                text: "请选择要删除的问题!"
            });
        }

    };



    var initVar = function () {
        $recommendGrid = $("#recommendGrid");
        $classifyComboBox = $("#classifys");
        $keyword = $("#keyword");
        $keyword.bind('keypress', function (event) {
            if (event.keyCode == "13") {
                gridReload();
            }
        });
        $toolbar = $("#toolbar");
        tableWidth = $("body").width() - 2 * 22;
        remainWidth = tableWidth;
    };

    var initGrid = function () {
        $recommendGrid.datagrid(gridConfig());
        $recommendGrid.datagrid('getPager').pagination(pageConfig(20, [20, 50, 100]));
        /*$(".datagrid-wrap").css("border-left-width",0);
        $(".datagrid-wrap").css("border-right-width",0);
        $(".datagrid-wrap").css("border-bottom-width",0);*/
    };
    var initComboBox = function () {
        comboBoxManager = $classifyComboBox.ligerComboBox(comboBoxConfig());
        $('.comboBoxDiv').on('click', '.l-trigger-cancel', function () {//点击删除刷新下拉框
            comboBoxManager.reload();
        });
    };

    var refresh = function () {
        $recommendGrid.datagrid('reload');
    };

    var addRefresh = function () {
        $.ligerDialog.close();
        refresh();

    };

    var method = {
        init: function () {
            initVar();
            initGrid();
            initComboBox();
        },
        gridReload: gridReload,
        addRefresh: addRefresh,
        addRecommendClick: function () {
            $.ligerDialog.open(addRecommendConfig());
        },
        batchDelete: batchDelete,
        operateDelete: operateDelete,

    };

    return method;
})(jQuery);
