/*global moment PNotify selectData wangEditor BootstrapDialog*/
"use strict";
var editTable, keyTable, state, nowEditQuestionText, pageNum;
var delData = [];
var check = true;
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
    editTableColumnsData = [{
        data: "answer",
        title: "回复",
        className: "key-table-td edit-answer",
        render: function (data) {
            return "<div class='show-title' style='width:" + (getModalWidth() * 0.35) + "px'>" + data + "</div>";
        }
    }, {
        data: "status",
        title: "状态",
        className: "key-table-td edit-select"
    }, {
        data: "character",
        title: "角色",
        className: "key-table-td edit-select"
    }, {
        data: "beginTime",
        title: "生效时间",
        className: "key-table-td"
    }, {
        data: "endTime",
        title: "失效时间",
        className: "key-table-td"
    }],
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
    $("#add-btn").on("click", addQuestion); //添加问题弹出模态框
    $("#del-btn").on("click", delQuestion); //删除问题
    $("#check-btn").on("click", checkQuestion); //审核问题
    $("#search-btn").on("click", search); //查询问题
    $("#save-btn").on("click", save); //保存
    $("#edit-modal").on("hidden.bs.modal", clearEditTable); //关闭模态框清空表格
    $("#edit-table-add-btn").on("click", editAddClick); //批量编辑-添加回答
    $("#edit-table-del-btn").on("click", editDelClick); //批量编辑-删除回答
    $("#page-change").on("change", pageLenChange); //修改单页显示数量
    $("#select-classify-text").on("click", selectShow); //分类下拉菜单显示
    $("#select-classify").on("mouseleave", selectHide); //分类下拉菜单隐藏
    $("#edit-select-classify-text").on("click", editSelectShow); //分类下拉菜单显示
    $("#edit-select-classify").on("mouseleave", selectHide); //分类下拉菜单隐藏
    $("#question").on("blur", checkQuestionExist); //查重
    $("#search-type").on("change", changePlaceholder); //修改placeholder
    $("#edit-all").on("change", changeEnableEditAll); //改变编辑全部属性
    $("#form-question").on("keydown", keyboardSearch); //回车查询
    $("#form-answer").on("keydown", keyboardSearch); //回车查询
    $("#batch-upload-btn").on("click", uploadShow); //显示批量上传
    $("#upload").on("change", upload); //批量上传
    $("#upload-modal").on("hidden.bs.modal", resetUpload); //清空
    $("#export-btn").on("click", exportCorpus);
    $("#edit-modal").on("show.bs.modal", setModalWidth);
    preventIESelect(); //屏蔽ctrl+左键  IE
    initDate(); //初始化时间表单
    fillSelectData(); //填充下拉框菜单信息
    initDataTables(); //初始化主表格
    initEditor(); //初始化文本编辑器
});
//单条问题编辑-ajax data
function editOne(id) {
    var qid = id ? id : keyTable.row($(".row-selected")).data().questionId;
    state = "editone";
    editTable = $('#edit-table').DataTable({
            ajax: {
                url: "knowledge/listByQuestionId",
                dataSrc: function (data) {
                    var d = [],
                        pub = data.rows[0],
                        q = $("#question");
                    data.rows.forEach(function (v) {
                        d.push({
                            beginTime: getTime("beginTime", format(v.beginTime)),
                            endTime: getTime("endTime", format(v.endTime)),
                            status: getSelectStatusData(v.status),
                            character: getSelectCharacterData(v.character.id),
                            answer: pure(v.answer.plainText),
                            answerHtml: v.answer.contentHtml,
                            answerId: v.answer.id,
                            questionId: v.question.id,
                            question: v.question.literal,
                            pairId: v.id
                        });
                    });
                    nowEditQuestionText = pub.question.literal;
                    q.val(pub.question.literal); //问题表单赋值
                    getSelectClassifyData(pub.question.classify.id); //下拉框赋值
                    return d;
                },
                data: function () {
                    return {
                        qid: qid
                    };
                },
                error: function (err) {
                    alertMessage("错误代码" + err.status);
                    clearEditTable();
                }
            },
            processing: false, //加载提示
            serverSide: false, //后端分页
            searching: false, //搜索栏
            ordering: false, //排序
            lengthChange: false, //页面显示栏数修改
            pageLength: parseInt($("#page-change").val()), //每页显示条目
            pagingType: "simple_numbers",
            paging: false, //分页
            autoWidth: false,
            info: false,
            scrollY: "250px",
            scrollCollapse: true,
            select: {
                style: 'single',
                className: 'row-selected',
                blurable: false,
                info: false
            },
            columns: editTableColumnsData,
            language: languageData
        })
        .on("error", function () {
            clearEditTable();
        });
    initTableComplete(); //初始化表格完成

}
//批量编辑-main datatables data
function editMore() {
    state = "editmore";
    editTable = $('#edit-table').DataTable({
            data: (function () {
                var d = [],
                    select = $("#key-table .row-selected"),
                    qStr = [];
                Array.prototype.forEach.call(select, function (v) {
                    var data = keyTable.row(v).data();
                    qStr.push(data.question);
                    d.push({
                        answerId: data.answerId,
                        answer: data.plainText,
                        beginTime: getTime("beginTime", data.beginTime),
                        endTime: getTime("endTime", data.endTime),
                        status: getSelectStatusData(data.status),
                        character: getSelectCharacterData(data.characterId),
                        answerHtml: data.htmlContent,
                        classify: data.classifyName,
                        classifyId: data.classifyId,
                        questionId: data.questionId,
                        question: data.question,
                        pairId: data.id
                    });
                });
                $("#question-wrap").css("display", "none"); //隐藏问题表单
                $("#edit-all-wrap").css("display", "block"); //显示编辑全部选框
                $("#edit-table-add-btn").css("display", "none"); //隐藏添加按钮
                getSelectClassifyData(d[0].classifyId); //下拉框赋值
                return d;

            }()),
            processing: false, //加载提示
            serverSide: false, //后端分页
            searching: false, //搜索栏
            ordering: false, //排序
            lengthChange: false, //页面显示栏数修改
            pageLength: parseInt($("#page-change").val()), //每页显示条目
            pagingType: "simple_numbers",
            paging: false, //分页
            autoWidth: false,
            info: false,
            scrollY: "250px",
            scrollCollapse: true,
            select: {
                style: 'single',
                className: 'row-selected',
                blurable: false,
                info: false
            },
            columns: [{
                data: "question",
                title: "问题",
                className: "key-table-td",
                render: function (data) {
                    return "<div title='" + data + "' class='show-title' style='width:" + (getModalWidth() * 0.15) + "px'>" + data + "</div>";
                }
            }, {
                data: "answer",
                title: "回复",
                className: "key-table-td edit-answer",
                render: function (data) {
                    return "<div title='" + data + "' class='show-title' style='width:" + (getModalWidth() * 0.25) + "px'>" + data + "</div>";
                }
            }, {
                data: "status",
                title: "状态",
                className: "key-table-td edit-select",
                width: "100px"
            }, {
                data: "character",
                title: "角色",
                className: "key-table-td edit-select",
                width: "100px"
            }, {
                data: "beginTime",
                title: "生效时间",
                className: "key-table-td",
                width: "150px"
            }, {
                data: "endTime",
                title: "失效时间",
                className: "key-table-td",
                width: "150px"
            }],
            language: languageData
        })
        .on("error", function () {
            clearEditTable();
        });
    initTableComplete(); //初始化表格完成


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
                url: "knowledge/listCorpus",
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
    if (select.length == 1) {
        editOne(); //单条编辑
    } else if (select.length > 1) {
        editMore(); //多条编辑
    } else {
        alertMessage("请选择要编辑的问题！");
        return;
    }
}

//表格初始化后调用
function initTableComplete() {
    //datatables initComplite可能会出现table变量undefind或表单元素未加载完成的情况
    if ($("#edit-table .date").length <= 0) {
        setTimeout(initTableComplete, 50);
    } else {
        $("#edit-modal").modal(); //弹出模态框
        //选中弹出编辑器
        editTable.on("select", function (e, dt, type, indexes) {
            if ($("#edit-all").prop("checked") && indexes[0] !== 0) {
                var tr = $("#edit-table tbody tr:first");
                editTable.row(0).select(); //选中第一条
                $(".dataTables_scrollBody").scrollTop(0); //滚动到最上方
                if (!tr.hasClass("show-warning")) {
                    tr.addClass("show-warning");
                    setTimeout(function () {
                        tr.removeClass("show-warning");
                    }, 1000);
                }
                return false;
            } else {
                if (type === "row") {
                    var text = editTable[type](indexes).data().answerHtml;
                    if (!text.match(/<.+>/ig)) {
                        text = "<p>" + text + "</p>";
                    }
                    $("#editor").html(text);
                    $("#editor-wrap").css("display", "block");
                }
            }

        });
        //失焦隐藏编辑器
        editTable.on("deselect", function () {
            if ($("#edit-table .row-selected").length <= 0) {
                $("#editor").html("");
                $("#editor-wrap").css("display", "none");
            }
        });
        //阻止事件冒泡，防止编辑表单时选中或失焦
        $("#edit-table input").on("click", function (e) {
            createDate($(this)); //初始化时间表单
            e.stopPropagation();
        });
        $("#edit-table select").on("click", function (e) {
            e.stopPropagation();
        });
        //默认选中第一行
        editTable.row(0).select();
        //滚动条启用时可能会出现表头宽度不正确的情况
        setTimeout(function () {
            editTable.columns.adjust();
        }, 10);
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
    state = undefined;
    nowEditQuestionText = undefined;
    delData = [];
    $("#edit-all").prop("checked", null);
    $("#question-wrap").css("display", "block"); //显示问题表单
    $("#edit-all-wrap").css("display", "none"); //隐藏编辑全部选框
    $("#edit-table-add-btn").css("display", "inline-block"); //显示添加按钮

}

//填充下拉框数据
function fillSelectData() {
    if (!selectData || !selectData.classifys) {
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
        var editD = [];
        selectData.classifys.forEach(function (v) {
            var data = {
                id: v.id,
                text: v.name,
                parent: v.parent
            };
            var editData = {
                id: v.id,
                text: v.name
            };
            if (v.parent === 0) {
                editData.parent = "#";
            } else {
                editData.parent = v.parent;
            }
            d.push(data);
            editD.push(editData);
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


        var nodeTree = $("#edit-select-classify").jstree({
                "core": {
                    "data": editD,
                    "strings": false,
                    "animation": 100,
                    "themes": {
                        "icons": false
                    }
                }
            })
            .on("select_node.jstree", updateEditClassifyValue)
            .on('loaded.jstree', function () {
                nodeTree.jstree('open_all');
            });
    }



}
//返回角色html元素并选中
function getSelectCharacterData(value) {
    var character = "<div class='input-wrap'><select name='character' class='form-control input-sm'>";
    if (!selectData || !selectData.character) {
        alertMessage("获取查询信息失败，请刷新后重试！");
        return;
    } else {
        selectData.character.forEach(function (v) {
            if (value === v.id) {
                character += "<option value=" + v.id + " selected='true'>" + v.name + "</option>";
            } else {
                character += "<option value=" + v.id + ">" + v.name + "</option>";
            }
        });
        character += "</select></div>";
        return character;
    }
}
//选中类型
function getSelectClassifyData(value) {
    if (!selectData || !selectData.classifys) {
        alertMessage("获取查询信息失败，请刷新后重试！");
        return;
    } else {
        var tree = $("#edit-select-classify").jstree();
        var data = tree._model.data;
        tree.deselect_all();
        if (data[value]) {
            tree.select_node(value);
        } else {
            tree.select_node($("#edit-select-classify li:first"));
        }
    }
}
//返回状态html元素并选中
function getSelectStatusData(value) {
    var status = "<div class='input-wrap'><select name='status' class='form-control input-sm'>";
    if (!selectData || !selectData.status) {
        alertMessage("获取查询信息失败，请刷新后重试！");
        return;
    } else {
        selectData.status.forEach(function (v) {
            if (value === v.id) {
                status += "<option value=" + v.id + " selected='true'>" + v.name + "</option>";
            } else {
                status += "<option value=" + v.id + ">" + v.name + "</option>";
            }
        });
        status += "</select></div>";
        return status;
    }
}
//返回时间下拉框元素
function getTime(name, time) {
    return "<div class='input-wrap'><input name=" + name + " type='text' value='" + time + "' class='form-control date input-sm'></div>";
}
//初始化编辑器
function initEditor() {
    var editor = new wangEditor('editor');
    editor.config.menus = [
        'bold',
        'underline',
        'italic',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        //'quote',引用
        'fontfamily',
        'fontsize',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        //'emotion',表情
        '|',
        'img',
        '|',
        'undo',
        'redo'
    ];

    editor.config.uploadImgUrl = "knowledge/uploadPairImg"; //支持本地上传图片
    wangEditor.config.printLog = false; //禁用Log
    editor.config.menuFixed = false; //禁用吸顶

    editor.config.uploadImgFns.onload = function (resultText) {
        // resultText 服务器端返回的text
        // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
        // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
        var originalName = editor.uploadImgOriginalName || '';
        // 如果 resultText 是图片的url地址，可以这样插入图片：
        editor.command(null, 'insertHtml', '<img src="' + resultText + '" alt="' + originalName + '" style="max-width:100%;"/>');
        // 如果不想要 img 的 max-width 样式，也可以这样插入：
        // editor.command(null, 'InsertImage', resultText);
        editorChangeCallback(editor);
    };
    //编辑器编辑内容改变
    editor.onchange = function () {
        editorChangeCallback(editor);
    };
    editor.create();
}

function editorChangeCallback(editor) {
    var select = $("#edit-table .row-selected");
    if (select.length !== 1) {
        return;
    } else {
        if ($("#edit-all").prop("checked")) {
            var tr = $("#edit-table tbody tr");
            Array.prototype.forEach.call(tr, function (v) {
                changeTextAndHtml($(v), editor);
            });
        } else {
            changeTextAndHtml(select, editor);
        }
    }

}

function changeTextAndHtml(el, editor) {
    var data = editTable.row(el).data();
    //var tmp = editor.$txt.clone();
    var text;
    var cloneEl = $(editor.$txt.html());
    cloneEl.find("img").replaceWith("[图片]");
    text = cloneEl.text();
    //tmp.find("img").html("[图片]");
    //text = tmp.text();
    data.answer = text;
    data.answerHtml = editor.$txt.html();
    el.find(".edit-answer .show-title").text(text);
}
//编辑表添加回答
function editAddClick() {
    if (!editTable) {
        return;
    }
    var el;
    editTable.row.add({
        answer: "添加回答",
        beginTime: getTime("beginTime", moment().format("YYYY-MM-DD")),
        endTime: getTime("endTime", "2035-12-31"),
        status: getSelectStatusData(),
        character: getSelectCharacterData(),
        answerHtml: "添加回答",
        classify: "",
        answerId: "",
        pairId: "",
        questionId: "",
        question: $.trim($("#question").val())
    }).draw();
    //每条回答绑定
    el = $("#edit-table tr").last();
    el.find("input").on("click", function (e) {
        createDate($(this));
        e.stopPropagation();
    });
    el.find("select").on("click", function (e) {
        e.stopPropagation();
    });
    //添加后选中
    editTable.row(el).select();
}
//删除编辑表回答
function editDelClick() {
    var select = $("#edit-table .row-selected");
    if (!editTable) {
        return;
    }
    if (select.length <= 0) {
        alertMessage("请选择一个回答！");
    } else {
        if ($("#edit-all").prop("checked")) {
            var tr = $("#edit-table tbody tr");
            Array.prototype.forEach.call(tr, function (v) {
                delEditRow($(v));
            });
        } else {
            delEditRow(select);

        }


        //如果所有回答删除就新建一行
        if ($("#edit-table tbody tr").length === 1 && $("#edit-table tbody tr").attr("role") !== "row") {
            if (state !== "editmore") {
                //批量编辑是时不会新建
                editAddClick();
            }
        } else {
            //否则选中第一行
            editTable.row(0).select();
        }


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
//增加问题
function addQuestion() {
    state = "addquestion";
    var q = $("#question");
    editTable = $('#edit-table').DataTable({
            data: [{
                answer: "添加回答",
                beginTime: getTime("beginTime", moment().format("YYYY-MM-DD")),
                endTime: getTime("endTime", "2035-12-31"),
                status: getSelectStatusData(),
                character: getSelectCharacterData(),
                answerHtml: "添加回答",
                classify: "",
                answerId: "",
                pairId: "",
                questionId: "",
                question: $.trim($("#question").val())
            }],
            processing: false, //加载提示
            serverSide: false, //后端分页
            searching: false, //搜索栏
            ordering: false, //排序
            lengthChange: false, //页面显示栏数修改
            pageLength: parseInt($("#page-change").val()), //每页显示条目
            pagingType: "simple_numbers",
            paging: false, //分页
            autoWidth: false,
            info: false,
            scrollY: "250px",
            scrollCollapse: true,
            select: {
                style: 'single',
                className: 'row-selected',
                blurable: false,
                info: false
            },
            columns: editTableColumnsData,
            language: languageData
        })
        .on("error", function () {
            clearEditTable();
        });
    //清空问题表单
    q.val("");
    getSelectClassifyData(); //清空下拉框
    initTableComplete(); //初始化表格完成

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
                    url: "knowledge/pair/delete",
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
//保存
function save() {
    var tr = $("#edit-table tbody tr");
    var d = [];
    var confirm = $("#confirm"),
        rotate = $("#rotate"),
        btn = $("#save-btn");
    if (!check) {
        alertMessage("问题已存在！请前往编辑该问题！");
        return;
    } else if ($("#edit-select-classify-text").attr("data-value") == "-1") {
        alertMessage("请选择分类！");
        return;
    } else if (tr.length >= 1 && tr.first().attr("role")) {
        Array.prototype.forEach.call(tr, function (v) {
            var el = $(v),
                data = editTable.row(el).data();
            var tmp = {
                classifyId: $("#edit-select-classify-text").attr("data-value"),
                characterId: el.find("[name='character']").val(),
                status: el.find("[name='status']").val(),
                beginTime: el.find("[name='beginTime']").val(),
                endTime: el.find("[name='endTime']").val(),
                questionId: data.questionId,
                question: data.question,
                plainText: data.answer,
                htmlContent: data.answerHtml,
                answerId: data.answerId,
                id: data.pairId
            };
            tmp = cleanData(tmp);
            d.push(tmp);
        });
    } else if (!tr.first().attr("role")) {
        d = [];
    } else {
        alertMessage("未知错误！");
        return;
    }
    //按钮加载状态
    confirm.css("display", "none");
    rotate.css("display", "inline-block");
    btn.prop("disabled", "disabled");
    //保存请求
    $.ajax({
        url: "knowledge/pair/update",
        type: "POST",
        data: JSON.stringify({
            data: d,
            delData: delData
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
            if (msg.code === "200") {
                alertMessage("保存成功", "success");
                $("#edit-modal").modal('hide');
                refresh();
            } else {
                alertMessage(msg.msg);
            }

        },
        error: function (err) {
            alertMessage("错误代码" + err.status);
        },
        complete: function () {
            //关闭按钮加载状态
            confirm.css("display", "inline-block");
            rotate.css("display", "none");
            btn.prop("disabled", null);
        }
    });



}

function selectShow() {
    $("#select-classify").slideToggle("fast");
}

function selectHide() {
    $(this).slideUp("fast");
}

function editSelectShow() {
    $("#edit-select-classify").slideToggle("fast");
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
//查重
function checkQuestionExist() {
    var val = $.trim($(this).val()),
        parent = $(this).parent();
    updateQuestionData();
    if (state === "editmore") {
        return;
    }
    if (!val || val == nowEditQuestionText) {
        clearError();
        return;
    } else {
        $.ajax({
            url: "knowledge/listByQuestionLiteral",
            type: "POST",
            data: {
                literal: val
            },
            success: function (msg) {
                if (msg.code === "200") {
                    if (msg.msg) {
                        clearError();
                        var el = $("<div class='col-md-7'><a class='question-error' id='question-error' href='javascript:;'>该问题已经存在，点击前往该问题!</a>");
                        el.on("click", function () {
                            clearEditTable();
                            editOne(msg.msg);
                            clearError();
                            check = true;
                        });
                        parent.addClass("has-error");
                        parent.parent().append(el);
                        check = false;
                    } else {
                        check = true;
                        clearError();
                    }
                } else {
                    alertMessage("获取问题重复信息失败，请刷新后重试！");
                }
            },
            error: function (err) {
                alertMessage("错误代码" + err.status);
            }
        });
    }
}

//清空重复时的错误信息
function clearError() {
    var el = $("#question-error");
    if (el.length > 0) {
        el.parent().remove();
        $("#question").parent().removeClass("has-error");
    }
}

//更新编辑表单类型value和显示内容
function updateEditClassifyValue() {
    var data = $("#edit-select-classify").jstree().get_selected(true);
    var classify = $("#edit-select-classify-text");
    if (data.length === 1) {
        classify.text(data[0].text);
        classify.attr("data-value", data[0].id);
    } else {
        alertMessage("未知错误，请联系管理员！");
    }
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
        url: "knowledge/listCorpusCount",
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

function updateQuestionData() {
    var text = $.trim($("#question").val());
    var tr = $("#edit-table tbody tr");
    Array.prototype.forEach.call(tr, function (v) {
        var el = $(v);
        var data = editTable.row(el).data();
        data.question = text;
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

function changeEnableEditAll() {
    var firstTr = $("#edit-table tbody tr:first"),
        otherTr = $("#edit-table tbody tr:not(:first)");
    //添加、解除绑定
    if ($(this).prop("checked")) {
        otherTr.find("select").prop("disabled", "disabled");
        otherTr.find("input").prop("disabled", "disabled");
        firstTr.find("[name='status']").on("change", changeAllStatus);
        firstTr.find("[name='character']").on("change", changeAllcharacter);
        firstTr.find("[name='beginTime']").on("change", changeAllBeginTime);
        firstTr.find("[name='endTime']").on("change", changeAllEndTime);
        editTable.row(0).select(); //选中第一条
        $(".dataTables_scrollBody").scrollTop(0); //滚动到最上方
    } else {
        otherTr.find("select").prop("disabled", null);
        otherTr.find("input").prop("disabled", null);
        firstTr.find("[name='status']").off("change", changeAllStatus);
        firstTr.find("[name='character']").off("change", changeAllcharacter);
        firstTr.find("[name='beginTime']").off("change", changeAllBeginTime);
        firstTr.find("[name='endTime']").off("change", changeAllEndTime);
    }

    function changeAllStatus() {
        otherTr.find("[name='status']").val($(this).val());
    }

    function changeAllcharacter() {
        otherTr.find("[name='character']").val($(this).val());
    }

    function changeAllBeginTime() {
        otherTr.find("[name='beginTime']").val($(this).val());
    }

    function changeAllEndTime() {
        otherTr.find("[name='endTime']").val($(this).val());
    }

}

function createDate(el) {
    if (!el.attr("data-date")) {
        el.attr("data-date", "true");
        el.daterangepicker({
            locale: locale,
            singleDatePicker: true,
            showDropdowns: true
        });
        el.click();
    }
}

function delEditRow(el) {
    var data = editTable.row(el).data(); //获取该行数据
    editTable.row(el).remove().draw(); //删除该行
    if (data.pairId !== undefined && data.pairId !== null && data.pairId !== "") {
        delData.push({
            id: data.pairId
        });
    }
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
