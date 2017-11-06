/*global moment PNotify selectData wangEditor*/
"use strict";
var keyTable, pageNum;
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
    $("#page-change").on("change", pageLenChange); //修改单页显示数量
    $("#select-classify-text").on("click", selectShow); //分类下拉菜单显示
    $("#select-classify").on("mouseleave", selectHide); //分类下拉菜单隐藏
    $("#form-question").on("keydown", keyboardSearch); //回车查询
    $("#form-answer").on("keydown", keyboardSearch); //回车查询
    $("#edit-select-classify-text").on("click", editSelectShow); //分类下拉菜单显示
    $("#edit-select-classify").on("mouseleave", selectHide); //分类下拉菜单隐藏
    preventIESelect(); //屏蔽ctrl+左键  IE
    initDate(); //初始化时间表单
    fillSelectData(); //填充下拉框菜单信息
    initDataTables(); //初始化主表格
    initBtn();
    initEditor();
});

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

    $("#begin-date").daterangepicker({
        locale: locale,
        singleDatePicker: true,
        showDropdowns: true
    });
    $("#end-date").daterangepicker({
        locale: locale,
        singleDatePicker: true,
        showDropdowns: true,
        startDate: moment().add(5, 'year')
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
                data: "classifyName",
                title: "类型",
                className: "key-table-td",
            }, {
                data: "characterName",
                title: "角色",
                className: "key-table-td"
            }, {
                data: "status",
                title: "状态",
                className: "key-table-td",
                render: renderStatus
            }, {
                data: "updateTime",
                title: "更新时间",
                className: "key-table-td",
                render: renderTime
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

function renderTime(data) {
    return moment(data).format("YYYY-MM-DD HH:mm:ss");
}

function renderStatus(data) {
    if (data != 8) {
        return "未审核";
    } else {
        return "已审核";
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
        var editD = [];
        selectData.classify.forEach(function (v) {
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
    var text;
    var html = $.trim(editor.$txt.html());
    var cloneEl = $(html);
    var el = $("#answer-content");
    cloneEl.find("img").replaceWith("[图片]");
    text = cloneEl.text();
    el.text(text);
    el.attr("data-html", html);
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

//查询
function search() {
    keyTable.draw();
}
//修改单页显示数量
function pageLenChange() {
    var len = $(this).val();
    keyTable.page.len(len).draw();
}

function selectShow() {
    $("#select-classify").slideToggle("fast");
}

function selectHide() {
    $(this).slideUp("fast");
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


function cleanData(data) {
    var d = {};
    for (var i in data) {
        if (data[i] !== undefined && data[i] !== null && data[i] !== "") {
            d[i] = data[i];
        }
    }


    return d;
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

function updatePaging(value) {
    $("#paging-num").text("- " + value + " -");
    $("#paging-num").attr("data-value", value - 1);
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


function initBtn() {
    initCreateRule();
    initInitRule();
}

function initCreateRule() {
    var selectEl;
    $("#create-rule-btn").on("click", function () {
        var tmp = $("#key-table .row-selected");
        selectEl = tmp;
        if (tmp.length < 2) {
            alertMessage("至少选择两条语料!");
        } else {
            $("#create-modal").modal("show");
            createNewTag();
        }
    });

    $("#create-modal").on("click", ".remove-this", function () {
        $(this).parents(".new-tag").remove();
    });

    $("#new-tag-btn").on("click", createNewTag);

    $("#create-submit-btn").on("click", function () {
        var el = $(this);
        var tags = $("#create-modal .new-tag");
        var name = $.trim($("#rule-name").val());
        if (!name) {
            alertMessage("请填写规则名称!");
        } else if (tags.length <= 0) {
            alertMessage("请新建一个标签!");
        } else {
            var data = {
                name: name,
            };
            var ids = [];
            var tagD = [];
            var tagsData = {};
            var check = true;

            loadingBtn(el);

            Array.prototype.forEach.call(tags, function (v) {
                var wrap = $(v);
                var name = $.trim(wrap.find(".tag-name").val());
                var val = $.trim(wrap.find(".tag-content").val());
                if ((!name && name !== "0") || (!val && val !== "0")) {
                    check = false;
                    return;
                }
                tagsData[name] = val;
                tagD.push(name);
            });
            if (!check) {
                alertMessage("请填写完整的标签名称和替换内容!");
                loadingEndBtn(el, "确定");
                return;
            }

            Array.prototype.forEach.call(selectEl, function (v) {
                var d = keyTable.row(v).data().id;
                ids.push(d);
            });
            data.tags = JSON.stringify(tagsData);
            data.pairids = ids.join(",");
            data.tag = tagD.join(",");

            $.ajax({
                url: "knowledge/paraphrase/save",
                type: "POST",
                data: data,
                success: function (msg) {
                    if (!msg.error) {
                        $("#create-modal").modal("hide");
                    }
                    alertMessage(msg.msg, msg.code);
                },
                complete: function () {
                    loadingEndBtn(el, "确定");
                }
            });
        }
    });

    $("#remove-tag-btn").on("click", function () {
        var select = $("#create-modal .selected");
        if (select.length <= 0) {
            return;
        } else {
            select.remove();
        }
    });

    $("#create-modal").on("hidden.bs.modal", function () {
        $(this).find(".new-tag").remove();
        $("#rule-name").val("");
        selectEl = null;
    });

    $("#create-modal").on("blur", ".tag-content", function () {
        var el = $(this);
        var val = $.trim(el.val());
        var ids;
        if (!val && val !== "0") {
            return;
        } else {
            ids = Array.prototype.map.call(selectEl, function (v) {
                return keyTable.row(v).data().id;
            });
            ids = ids.join(",");
            $.ajax({
                url: "knowledge/paraphrase/testKey",
                type: "POST",
                data: {
                    pairids: ids,
                    tag: val
                },
                success: function (msg) {
                    if (msg.error) {
                        alertMessage(msg.msg);
                        addElementError(el.parent());
                    } else {
                        clearElementError(el.parent());
                    }
                }
            });
        }
    });

    $("#search-btn").on("click", search);
}

function loadingBtn(el) {
    el.html('<i class="fa fa-spinner rotate" id="rotate"></i>').prop("disabled", "disabled");
}

function loadingEndBtn(el, text) {
    el.prop("disabled", null).text(text);
}

function createNewTag() {
    var el = $(
        '<div class="form-group clearfix new-tag">' +
        '<div class="col-md-3">' +
        '<input type="text" class="input-sm form-control tag-name" placeholder="标签名称">' +
        '</div>' +
        '<div class="col-md-5 content-wrap">' +
        '<input type="text" class="input-sm form-control tag-content" placeholder="替换内容">' +
        '<div class="remove-this"><img alt="关闭" title="关闭" src="/cloud/images/close.png" /></div>' +
        '</div>' +
        '</div>'
    );
    $("#new-tag-btn-wrap").before(el);
}

function initInitRule() {
    initCharacter();
    initSubmitInit();
    $("#answer-table").dataTable({
        processing: false, //加载提示
        serverSide: false, //后端分页
        searching: false, //搜索栏
        ordering: false, //排序
        lengthChange: false, //页面显示栏数修改
        pageLength: parseInt($("#page-change").val()), //每页显示条目
        pagingType: "simple_numbers",
        paging: false, //分页
        autoWidth: false,
        info: false
    });
    $("#init-rule-btn").on("click", function () {
        $.ajax({
            url: "knowledge/paraphrase/listType",
            type: "GET",
            success: function (data) {
                updateRuleList(data.msg);
                $("#init-modal").modal("show");
            }
        });
    });

    $("#rule-list").on("change", function () {
        var el = $(this);
        var val = el.val();
        var option;
        Array.prototype.forEach.call(el.find("option"), function (v) {
            var element = $(v);
            if (val === element.val()) {
                option = element.attr("data-value").split(",");
            }
        });

        if (!option) {
            return;
        }
        updateRuleOption(option);
    });

    $("#preview").on("click", function () {
        var tags = getTags();
        if (!tags) {
            return;
        }
        $.ajax({
            url: "knowledge/paraphrase/preview",
            type: "POST",
            data: {
                typeid: $("#rule-list").val(),
                tags: tags
            },
            success: function (data) {
                uodatePreviewArea(data.msg);
            }
        });

    });

    $("#init-modal").on("hidden.bs.modal", function () {
        $("#preview-area").val("");
        $("#answer-content").attr("data-html", "<p>无答案</p>").text("无答案");
        $("#editor").html("<p>无答案</p>");
        $("#status").val("8");
        $("#edit-select-classify-text").text("").attr("data-value", "");
        $("#edit-select-classify").jstree("deselect_all");
    });
}

function updateRuleList(data) {
    var str = "";
    var el = $("#rule-list");
    data.forEach(function (v) {
        str += '<option value="' + v.id + '" data-value="' + v.typeTag + '">' + v.typeName + '</option>';
    });
    el.empty().append(str);
    updateRuleOption(data[0].typeTag.split(","));
    //默认选中第一个
}

function updateRuleOption(data) {
    var str = "";
    var el = $("#options-area");
    data.forEach(function (v) {
        str += '<div class="option-item"><label class="input-title">' + v + '</label><div class="input-wrap"><input type="text" class="form-control input-sm option-value" data-name="' + v + '"></div></div>';
    });
    el.empty().append(str);
}

function uodatePreviewArea(data) {
    var el = $("#preview-area");
    var str = data.join("\n\r");
    el.val(str);

}

function editSelectShow() {
    $("#edit-select-classify").slideToggle("fast");
}

function initCharacter() {
    var str = "";
    var el = $("#character");
    var data = selectData.character;
    data.forEach(function (v) {
        str += '<option value="' + v.id + '">' + v.name + '</option>';
    });
    el.empty().append(str);
}

function initSubmitInit() {
    $("#init-submit-btn").on("click", function () {
        var btn = $(this);
        var data = {
            classifyid: $("#edit-select-classify-text").attr("data-value"),
            typeid: $("#rule-list").val(),
            tags: getTags(),
            plain_text: $("#answer-content").text(),
            html_content: $("#answer-content").attr("data-html"),
            status: $("#status").val(),
            characterid: $("#character").val(),
            beginTime: $("#begin-date").val(),
            endTime: $("#end-date").val()
        };
        if (!data.tags) {
            return;
        }
        for (var i in data) {
            if (!data[i] && data[i] !== "0") {
                alertMessage("请填写所有数据!");
                return;
            }
        }
        loadingBtn(btn);
        $.ajax({
            url: "knowledge/paraphrase/save2db",
            type: "POST",
            data: data,
            success: function (msg) {
                alertMessage(msg.msg, msg.code);
                $("#init-modal").modal("hide");
                refresh();
            },
            complete: function () {
                loadingEndBtn(btn, "确定");
            }
        });
    });
}

function getTags() {
    var optionsEl = $(".option-value");
    var check = true;
    var tags = {};
    if (optionsEl.length <= 0) {
        return;
    }

    Array.prototype.forEach.call(optionsEl, function (v) {
        var element = $(v);
        var val = $.trim(element.val());
        if (!check) {
            return;
        }
        if (!val && val !== "0") {
            check = false;
            alertMessage("请填写所有替换标签的内容");
            return;
        }
        tags[element.attr("data-name")] = val;
    });
    if (!check) {
        return false;
    } else {
        tags = JSON.stringify(tags);
        return tags;
    }
}

function refresh() {
    var num = Number($("#paging-num").attr("data-value"));
    keyTable.page(num).draw("page");
}

function addElementError(el) {
    if (el.hasClass("has-error")) {
        return;
    } else {
        el.addClass("has-error");
    }
}

function clearElementError(el) {
    if (el.hasClass("has-error")) {
        el.removeClass("has-error");
    }
}
