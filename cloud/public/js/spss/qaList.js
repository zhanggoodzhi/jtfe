/**
 *
 */
$(function () {
    corpusList.init();
});

var corpusList = (function ($, undefined) {

    // 页面元素
    var $corpusGrid = undefined;
    var $classifyComboBox = undefined;
    var $answerComboBox = undefined;
    var $keyword = undefined;
    var $sender = undefined;
    var $characterComboBox = undefined;
    var $devComboBox = undefined;
    var comboBoxManager = undefined;
    var answerManager = undefined;

    var characterManager = undefined;
    var devManager = undefined;

    var tableWidth = 0;
    var remainWidth = 0;
    var tableTitle = year + "年" + month + "月" + day + "日" + " " + hour + "点到" +
        (hour + 1) + "点";
    var charactersUrl = "/cloud/knowledge/characters";

    // 请求参数
    var queryUrl = "spss/queryLog1";
    var classifys = "-100";
    var characters = "-1"
    var answerStatusData = [{
        id: -1,
        text: "全部"
    }, {
        id: 0,
        text: "无答案"
    }, {
        id: 1,
        text: "有答案"
    }];
    var devData = [{
        id: -1,
        text: "全部"
    }, {
        id: 1,
        text: "PC端"
    }, {
        id: 2,
        text: "移动端"
    }, {
        id: 3,
        text: "微信"
    }, {
        id: 4,
        text: "微博"
    }, {
        id: 5,
        text: "易信"
    }, {
        id: 6,
        text: "Android"
    }, {
        id: 7,
        text: "IOS"
    }, {
        id: 8,
        text: "论坛"
    }];
    var queryParams = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        answerStatus: -1,
        device: -1,
        keyword: "",
        sender: "",
        classifys: classifys,
        character: characters
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
        return result;
    };
    // var h=$("#content").height()-110;
    // alert(h)
    // $("#corpusGrid").attr("style","height:"+$(".right_col").height()-110+"px;");
    // 配置参数
    var gridConfig = function () {

        return {
            height: $(".right_col").height() - 150, // document.body.scrollHeight-110,
            toolbar: "#toolbar",
            url: queryUrl,
            queryParams: queryParams,
            singleSelect: true,
            sortName: "id",
            sortOrder: "desc",
            pagination: true,
            pageSize: 20,
            pageList: [20, 50, 100],
            rownumbers: true,
            title: tableTitle,
            columns: [
                [

                    // {
                    // field : "id",
                    // title : "ID",
                    // width : autoWidth(0.07),
                    // align : "center",
                    // halign : "center",
                    // sortable : true
                    // },
                    {
                        field: "question",
                        title: "问题",
                        width: autoWidth(0.23),
                        align: "left",
                        halign: "center",
                        sortable: true
                    }, {
                        field: "answer",
                        title: "回复",
                        width: autoWidth(0.20),
                        align: "left",
                        halign: "center",
                        sortable: true,
                        formatter: function (value, rowData, rowIndex) {
                            return cloudUtil.gridHtmlTips(value, 20);
                        }

                    }, {
                        field: "classifyName",
                        title: "类型",
                        width: autoWidth(0.14),
                        halign: "center",
                        align: "center",
                        sortable: true
                    }, {
                        field: "characterName",
                        title: "角色",
                        width: autoWidth(0.12),
                        align: "center",
                        halign: "center",
                        sortable: true,

                    },

                    {
                        field: "sender",
                        title: "用户",
                        width: autoWidth(0.15),
                        align: "center",
                        halign: "center",
                        sortable: true,
                        formatter: function (value, rec) {
                            var btn = '<a class="btnUndoSets" onclick="senderRow1(\'' +
                                rec.sender +
                                '\')" href="javascript:void(0)">' +
                                rec.sender + '</a>';
                            return btn;
                        }

                    }, {
                        field: "time",
                        title: "时间",
                        width: autoWidth(0.15),
                        align: "center",
                        halign: "center",
                        sortable: true
                    },
                    // {
                    // field : "source",
                    // title : "来源",
                    // width : autoWidth(0.1),
                    // align : "center",
                    // halign : "center",
                    // sortable : true
                    // },

                ]
            ],
        }
    };

    var comboBoxConfig = function () {
        return {
            selectBoxWidth: 150,
            selectBoxHeight: 150,
            valueField: "id",
            textField: "value",
            treeLeafOnly: true,
            tree: {
                url: contextPath + "/knowledge/classifys",
                ajaxType: "post",
                idFieldName: "id",
                parentIDFieldName: "parentId",
                textFieldName: "value",
                slide: true,
                isExpand: 2,
            }
        };
    };
    var comboBoxConfig1 = function () {
        return {
            isMultiSelect: true,
            selectBoxWidth: 100,
            selectBoxHeight: 155,
            isShowCheckBox: true,
            split: ",",
            initText: '请选择',
            valueFieldID: '-1',
            valueField: "id",
            textField: "vname",
            url: charactersUrl,
            ajaxType: "post",
            onSelect: function (node) {},

        };
    };

    var initComboBox = function () {
        comboBoxManager = $classifyComboBox.ligerComboBox(comboBoxConfig());

        answerManager = $answerComboBox.ligerComboBox({
            emptyText: "",
            data: answerStatusData,
            isMultiSelect: false,
            onSelected: function (newvalue) {}
        });
        answerManager.setValue("-1");

        devManager = $devComboBox.ligerComboBox({
            emptyText: "",
            data: devData,
            isMultiSelect: false,
            onSelected: function (newvalue) {}
        });
        devManager.setValue("-1");
        characterManager = $characterComboBox.ligerComboBox(comboBoxConfig1());
    };

    var gridReload = function () {
        console.log("reload");
        setTableTitle();
        queryParams.year = year;
        queryParams.month = month;
        queryParams.day = day;
        queryParams.hour = hour;

        var reg = new RegExp(";", "g");
        if (comboBoxManager.getValue().replace(reg, ",") != "") {
            classifys = comboBoxManager.getValue().replace(reg, ",");
        } else {
            classifys = -100;
        }
        queryParams.sender = $sender.val();
        queryParams.keyword = $keyword.val();
        queryParams.classifys = classifys;
        queryParams.answerStatus = answerManager.getValue();
        queryParams.device = devManager.getValue();
        queryParams.character = characterManager.getValue();
        $corpusGrid.datagrid('load', queryParams);
        $(".datagrid").find(".panel-title").attr({
            align: "center"
        });

    };

    var initVar = function () {

        $corpusGrid = $("#corpusGrid");
        $classifyComboBox = $("#classifys");
        $answerComboBox = $("#answerStatus");
        $devComboBox = $("#device");
        $keyword = $("#keyword");
        $sender = $("#sender");
        $characterComboBox = $("#character");
        tableWidth = $("#side").width() - 2 * 22;
        remainWidth = tableWidth;
        $keyword.bind('keypress', function (event) {
            if (event.keyCode == "13") {
                gridReload();
            }
        });
        $sender.bind('keypress', function (event) {
            if (event.keyCode == "13") {
                gridReload();
            }
        });
    };
    var initGrid = function () {

        $corpusGrid.datagrid(gridConfig());
        $(".datagrid").find(".panel-title").attr({
            align: "center"
        });
        $corpusGrid.datagrid('getPager').pagination(
            pageConfig(20, [20, 50, 100]));
    };

    var pageConfig = function (pageSize, pageList) {
        return {
            pageSize: pageSize,
            pageList: pageList,
            beforePageText: '第',
            afterPageText: '页    共 {pages} 页',
            displayMsg: '显示 {from} - {to} 条,  共 {total}条',
        };
    };
    var clearCondition = function () {
        comboBoxManager.setValue();

        // devManager.setValue("-1");
        // characterManager.setValue(-1);

        comboBoxManager.clearTreeValue();

        answerManager.setValue("-1");
        $keyword.val("");
        $sender.val("");
        $("#device").val("");
    }

    var formatPage = function () {
        $corpusGrid.datagrid('getPager').pagination(
            pageConfig(50, [50, 100, 150]));
    }

    var setTableTitle = function () {
        if (month == -1 && year != -1) {
            tableTitle = year + "年";
        } else if (day == -1 && month != -1) {
            tableTitle = year + "-" + month;
        } else if (hour == -1 && day != -1) {
            tableTitle = year + "-" + month + "-" + day;
        } else {
            tableTitle = year + "-" + month + "-" + day;
        }
        // tableTitle = title;
    }
    var gridExportExcel = function () {
        var tabTitle = $(".datagrid").find(".panel-title").text();
        jQuery.messager.confirm('提示:', '是否导入' + tabTitle,
            function (event) {
                if (event) {
                    // var queryParamsExcel = {title:tabTitle,year:year,
                    // month:month, day:day, hour:hour, answerStatus:-1,
                    // keyword:"", sender:"", classifys:classifys};
                    var keyword = $("#keyword").val();
                    var sender = $("#sender").val();
                    var character = $("#character").val();
                    var device = $("#device").val();
                    var answerStatus = $("#answerStatus").val();
                    if (answerStatus == "") {
                        answerStatus = -1;
                    }
                    if (answerStatus == "全部") {
                        answerStatus = -1;
                    }
                    if (device == "") {
                        device = -1;
                    }
                    var queryParamsExcel = "title=" + tabTitle + "&year=" +
                        year + "&month=" + month + "&day=" + day +
                        "&hour=" + hour + "&answerStatus=" +
                        answerStatus + "&device=" + device +
                        "&keyword=" + keyword + "&sender=" + sender +
                        "&classifys=" + classifys + "&character=" +
                        character;
                    window.location.href = appName +
                        "/spss/queryLog1ExportExcel?" +
                        queryParamsExcel;
                    // $.post(appName + "/spss/queryLog1ExportExcel");
                }
            });
    }
    method = {
        init: function () {
            initVar();
            initComboBox();
            initGrid();
        },
        gridExportExcel: gridExportExcel,
        gridReload: gridReload,
        clearCondition: clearCondition,
        setTableTitle: setTableTitle,
        formatPage: formatPage,
        hour: hour,
        year: year,
        month: month,
        day: day,
    };
    return method;
})(jQuery);

function senderRow1(v) {
    if (v.indexOf("匿名") == 0) {
        v = v.substring(2, v.length)
    }
    $("#sender").val(v);
}
