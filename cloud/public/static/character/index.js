var sex = undefined;

function onSelectSex(sexId) {
    sex = sexId;
}
var dg2List = (function ($, undefined) {
    // 页面元素
    var $dg2 = undefined;
    var $parent = undefined;
    var $cParent = undefined;
    var $keyword = undefined;
    var tableWidth = 0;
    var queryUrl = "character/querySensitiveWord2";
    var queryInnerUrl = "character/queryInnerCharacter";
    var queryParams = {
        keyword: ""
    };
    var remainWidth = 0;
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
    var h = $("#mainContextSession").height();
    // 配置参数
    var gridConfig = function () {
        return {
            height: document.body.scrollHeight - 250,
            toolbar: "#toolbar2",
            view: detailview,
            url: queryUrl,
            queryParams: queryParams,
            striped: true,
            sortName: "id",
            sortOrder: "asc",
            pagination: true,
            pageSize: 20,
            pageList: [20, 50, 100],
            rownumbers: true,
            columns: [
                [

                    //			             {
                    //				field : 'serial',
                    //				title : '',
                    //				width : autoWidth(0.1),
                    ////				checkbox : true,
                    //				align : 'center'
                    //			},
                    {
                        field: 'id',
                        title: 'ID',
                        width: autoWidth(0.05),
                        align: 'center'
                    }, {
                        field: 'vname',
                        title: '角色',
                        width: autoWidth(0.10),
                        align: 'center'
                    }, {
                        field: "gender",
                        title: "性别",
                        width: autoWidth(0.05),
                        align: "center",
                        halign: "center",
                        sortable: true,
                        formatter: function (value, rowData, rowIndex) {
                            if (value == 0) {
                                return "未知";
                            } else if (value == 1) {
                                return "男";
                            } else {
                                return "女";
                            }
                        }
                    }, {
                        field: 'label',
                        title: '标签',
                        width: autoWidth(0.30),
                        align: 'left'
                            //				formatter : function(value, rowData, rowIndex){
                            //					return cloudUtil.gridHtmlTips(value, 20);
                            //				}
                    }, {
                        field: 'desc',
                        title: '描述',
                        width: autoWidth(0.10),
                        align: 'center'
                    }, {
                        field: 'opt',
                        title: '&nbsp;&nbsp;操作&nbsp;&nbsp;',
                        width: autoWidth(0.1),
                        align: 'center',
                        formatter: function (value, rec) {
                            if (rec.scope == 1) {
                                return;
                            }
                            if (rec.deleted == 1) {
                                var btnRecover = '<a class="btnRecover" onclick="innerRecover(\'' + rec.id + '\',\'' + rec.vname + '\')" href="javascript:void(0)" >撤销删除</a>';
                                return btnRecover;
                            } else {
                                var btnEdit = '<a class="editDA" onclick="editshowDialog(\'' +
                                    rec.id + '\')" href="javascript:void(0)" >编辑</a>';
                                var btnDel = '<a class="btnDelDA" onclick="innerDel(\'' +
                                    rec.id + '\',\'' + rec.vname + '\')" href="javascript:void(0)">删除</a>';
                                return btnEdit + btnDel;
                            }
                        }

                    },
                ]
            ],
            rowStyler: function (index, row) {
                if (row.deleted == 1) {
                    return 'background-color:#fff;color:red;font-weight:bold;'
                }

            },

            onLoadSuccess: function (index) {
                $dg2.datagrid("uncheckAll");
                $('.editDA').linkbutton({
                    text: '编辑',
                    plain: true,
                    iconCls: 'icon-edit'
                });
                $('.btnDelDA').linkbutton({
                    text: '删除',
                    plain: true,
                    iconCls: 'icon-no'
                });
                $('.btnRecover').linkbutton({
                    text: '撤销删除',
                    plain: true,
                    iconCls: 'icon-redo'
                });

            },

            detailFormatter: function (index, row) {
                //				$.post(appName + "/character/isParentCharactersSize", {
                //					'id' : row.id
                //				}, function(data) {
                //					if (data == 1) {
                return '<div style="padding:2px;background:#e0e0e0;"><table id="ddv-' + index + '"></table></div>';
                //				} else{
                //				}
                //			});
            },
            onExpandRow: function (index, row) {
                if (row.deleted == 1) {
                    return '无操作权限';
                }
                //				var ddv = $(this).datagrid('getRowDetail', index).find('table.ddv');
                $('#ddv-' + index).datagrid({
                    url: queryInnerUrl,
                    queryParams: {
                        'pid': row.id
                    },
                    fitColumns: true,
                    //					singleSelect : true,
                    rownumbers: true,
                    loadMsg: '',
                    height: 'auto',
                    columns: [
                        [{
                            field: 'id',
                            title: 'ID',
                            width: autoWidth(0.03),
                            align: 'center'
                        }, {
                            field: 'vname',
                            title: '角色',
                            width: autoWidth(0.1),
                            align: 'center'
                        }, {
                            field: 'label',
                            title: '标签',
                            width: autoWidth(0.30),
                            align: 'left'
                                //						formatter : function(value, rowData, rowIndex){
                                //							return cloudUtil.gridHtmlTips(value, 20);
                                //						}
                        }, {
                            field: 'desc',
                            title: '描述',
                            width: autoWidth(0.15),
                            align: 'center'
                        }, {
                            field: 'opt',
                            title: '&nbsp;&nbsp;操作&nbsp;&nbsp;',
                            width: autoWidth(0.1),
                            align: 'center',
                            formatter: function (value, rec) {
                                if (rec.scope == 1) {
                                    var btn = '<a class="btn"  href="javascript:void(0)" >无权操作</a>';
                                    return btn;
                                }
                                if (rec.deleted == 1) {
                                    var btnRecover = '<a class="btnRecover" onclick="innerRecover(\'' + rec.id + '\',\'' + rec.vname + '\')" href="javascript:void(0)" >撤销删除</a>';
                                    return btnRecover;
                                } else {
                                    var btnInnerEdit = '<a class="editDA" onclick="editshowDialog(\'' +
                                        rec.id + '\')" href="javascript:void(0)" >编辑</a>';
                                    var btnInnerDel = '<a class="btnDelDA" onclick="innerDel(\'' +
                                        rec.id + '\',\'' + rec.vname + '\')" href="javascript:void(0)">删除</a>';
                                    return btnInnerEdit + btnInnerDel;
                                }
                            }
                        }, ]
                    ],
                    rowStyler: function (index, row) {

                        if (row.deleted == 1) {
                            return 'background-color:#fff;color:red;font-weight:bold;'
                        }
                    },
                    onResize: function (data) {
                        $("#dg2").datagrid('fixDetailRowHeight', index);
                    },
                    onLoadSuccess: function () {
                        $('.btn').linkbutton({
                            text: '无权操作',
                            plain: true,
                            iconCls: 'icon-gl'
                        });
                        $('.btnRecover').linkbutton({
                            text: '撤销删除',
                            plain: true,
                            iconCls: 'icon-redo'
                        });
                        $('.editDA').linkbutton({
                            text: '编辑',
                            plain: true,
                            iconCls: 'icon-edit'
                        });
                        $('.btnDelDA').linkbutton({
                            text: '删除',
                            plain: true,
                            iconCls: 'icon-no'
                        });
                        $('.editLabel').linkbutton({
                            text: '标签',
                            plain: true,
                            iconCls: 'icon-add'
                        });
                        $('.editParent').linkbutton({
                            text: '分类',
                            plain: true,
                            iconCls: 'icon-ok'
                        });
                        setTimeout(function () {
                            $('#dg2').datagrid('fixDetailRowHeight', index);
                        }, 0);
                    },
                });

                $("#dg2").datagrid('fixDetailRowHeight', index);
            },
        }
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

    //添加
    var characterParentListConfig = function () {
        return {
            url: "character/queryParent",
            width: 380,
            height: 26,
            panelWidth: 380,
            panelHeight: 26,
            valueField: "id",
            textField: "vname",
            editable: false
        };
    };


    var gridReload = function () {
        queryParams.keyword = $keyword.val();
        //TODO,抽取参数queryParams, Grid方便后期重构
        $dg2.datagrid('load', queryParams);

    };

    var initVar = function () {
        $dg2 = $("#dg2");
        $keyword = $("#keyword2");
        $keyword.bind('keypress', function (event) {
            if (event.keyCode == "13") {
                gridReload();
            }
        });
        $toolbar = $("#toolbar2");
        tableWidth = $("body").width() - 2 * 22;
        remainWidth = tableWidth;

        $cParent = $("#cParent");
        $parent = $("#parent");
    };
    var initGrid = function () {
        $dg2.datagrid(gridConfig());
        $dg2.datagrid('getPager').pagination(pageConfig(20, [20, 50, 100]));
        $(".datagrid-wrap").css("border-left-width", 0);
        $(".datagrid-wrap").css("border-right-width", 0);
        $(".datagrid-wrap").css("border-bottom-width", 0);

        $cParent.combobox(characterParentListConfig());
        $parent.combobox(characterParentListConfig());

    };
    var refresh = function () {
        $dg2.datagrid('reload');
    };
    var method = {
        init: function () {
            initVar();
            initGrid();
        },
        gridReload: gridReload,
    };

    return method;
})(jQuery);



function del() {
    var rows = $('#dg2').datagrid('getSelections');
    if (!$.isEmptyObject(rows)) {
        $.messager.confirm('Confirm', '确定要删除吗?', function (r) {
            if (r) {
                var ids = '';
                for (var i = 0; i < rows.length; i++) {
                    console.log(rows[i]);
                    if (rows[i].vname == "小金童") {
                        alert("小金童为默认角色，不可删除！");
                        doRefresh();
                        exit;
                    }
                    if (i != (rows.length - 1)) {
                        ids += rows[i].id + ',';
                    } else {
                        ids += rows[i].id;
                    }
                }
                $.post('character/preset/picked/del', {
                    ids: ids
                }, function (result) {
                    if (result.success) {
                        doRefresh();
                    } else {
                        $.messager.show({
                            title: 'Error',
                            msg: result.errorMsg
                        });
                    }
                }, 'json');
            }
        });
    }
}

function innerDel(id, name) {
    if (name == "小金童") {
        alert("小金童为默认角色，不可删除！");
        return;
    }
    $.post('character/preset/picked/del', {
        ids: id
    }, function (result) {
        if (result == 1) {
            //			jQuery.messager.alert('提示:','删除成功','success');
            doRefresh();
        } else if (result == 2) {
            alert('存在子节点，不能删除！', 'error');
        }
    }, 'json');
}

function doRefresh() {
    //	$('#dg').datagrid('clearChecked');
    //	$('#dg').datagrid('clearSelections');
    //	$('#dg').datagrid('unselectAll');
    $('#dg2').datagrid('clearChecked');
    $('#dg2').datagrid('clearSelections');
    $('#dg2').datagrid('unselectAll');
    //	$('#dg').datagrid('reload');
    $('#dg2').datagrid('reload');
    $('#cParent').combobox('reload');
}

function showDialog() {
    $('#type').val("0");
    $("#word").val("");
    $("#desc").val("");
    $("#label").val("");
    $("#parent").combobox("setValue", 0);
    $('#dd').modal('toggle');

}
//function editshowDialog(id,vname) {
//	$('#ee').dialog('open');
//	$("#characterName").val(vname);
//
//	$("#characterId").val(id);
//}
function editshowDialog(id) {
    $('#dd').modal('toggle');
    $.post(appName + "/character/getCharacterById?id=" + id, function (data) {
        $(data).each(function (key, val) {
            console.log(val);
            $('#type').val(val.scope);
            $("#characterId").val(val.id);
            $("#word").val(val.vname);
            $("#desc").val(val.desc);
            $("#label").val(val.label);
            $("#parent").combobox('setValue', val.parentId);
            document.getElementById("sex")[val.gender].selected = true;
            sex = val.gender;
        });
    }, "json");



    //	$("#characterId").val(id);
    //	$("#word").val(vname);
    //	if(desc=="null"||desc==null){
    //		desc="";
    //	}
    //	$("#desc").val(desc);
    //	if(label=="null"||label==null){
    //		label="";
    //	}
    //	$("#label").val(label);
    //	$("#parent").combobox('setValue',pid);
}

function edithideDialog() {
    $('#ee').modal('hide');
}

function hideDialog() {
    $('#dd').modal('hide');
}

function hideLabelDialog() {
    $('#eidtLabel').modal('hide');
}

function hideParentDialog() {
    $('#eidtParent').modal('hide');
}
//function  edit2(){
//	$.messager.progress(); // 显示进度条
//	$("#editForm").form('submit', {
//		url : 'character/prefer/edit',
//		onSubmit : function() {
//			var isValid = $(this).form('validate');
//			if (!isValid) {
//				$.messager.progress('close'); // 如果表单是无效的则隐藏进度条
//			}
//			return isValid; // 返回false终止表单提交
//		},
//		success : function(data) {
//			data = $.parseJSON(data);
//			$.messager.progress('close'); // 如果提交成功则隐藏进度条
//			edithideDialog();
////			alert(data.success);
//			if (data.success)
//				doRefresh();
//			else
//				$.messager.show({
//					showType : 'fade',
//					title : '修改失败',
//					msg : data.errorMsg,
//					timeout : 4000
//				});
//		}
//	});
//}


function innerRecover(id) {
    console.log("object");
    $.post("character/preset/picked/add2", {
        'id': id
    }, function (data) {
        if (data == 1) {
            //			jQuery.messager.alert('提示:','撤销删除成功','success');
            doRefresh();
        } else {
            alert('撤销删除失败!', 'error');
        }
    });
}


function add2() {
    if ($("#type").val() == "0") {
        if ($("#word").val() == "" || $("#word").val() == null) {
            alert('角色名为必填项！', 'error');
            return;
        }
        if ($("#parent").combobox('getValue') == "" || $("#parent").combobox('getValue') == null) {
            alert('父级为必填项！', 'error');
            return;
        }
        $.post('character/prefer/add', {
            'word': $("#word").val(),
            'desc': $("#desc").val(),
            'label': $("#label").val(),
            'pid': $("#parent").combobox('getValue'),
            'sex': sex
        }, function (data) {
            hideDialog();
            if (data == 1) {
                //				jQuery.messager.alert('提示:','添加成功','success');
                doRefresh();
            } else {
                alert('添加失败', 'error');
            }
        });
    } else {
        var id = $('#characterId').val();
        var vname = $("#word").val();
        var desc = $("#desc").val();
        var label = $("#label").val();
        var pid = $("#parent").combobox('getValue');
        if (vname == "" || vname == null) {
            alert('角色名为必填项！', 'error');
            return;
        }
        if (pid == "" || pid == null) {
            alert('父级为必填项！', 'error');
            return;
        }
        if (pid == id) {
            alert('不能以自己为父级！', 'error');
            return;
        }
        $.post("character/prefer/edit", {
            'id': id,
            'vname': vname,
            'desc': desc,
            'label': label,
            'pid': pid,
            'sex': sex
        }, function (data) {
            if (data == 1) {
                //				jQuery.messager.alert('提示:','修改成功','success');
                hideDialog();
                doRefresh();
            } else if (data == 2) {
                alert('存在子节点，无法改变父级!', 'error');
            } else {
                alert('修改失败!', 'error');
            }
        });
    }
}

$(function () {

    var heightDG = document.body.scrollHeight - 110;
    $("#dg2").css("height", heightDG + "px");
    //dg2List.init();
    //$("#defaultAnswerTabDiv").css("height",$("#mainContext").height()-110+"px");
    $("#defaultAnswerTab").css("height", heightDG + "px");

    $("#character_tab").tab('show');
    dg2List.init();
    $("#robot_tabs a").on('shown.bs.tab', function (e) {
        if ($(e.target).attr('id') === 'character_tab') {
            dg2List.init();
        }
        if ($(e.target).attr('id') === 'default_answer_tab') {
            initDefaultAnswerGrid();
            initUedit_save();
        }
    });

    $("#character_confirmed").click(function () {
        add2();
    });

    $("#defaultAnswer_save_confirmed").click(function () {
        defaultAnswer_append();
    });

    $("#defaultAnswer_edit_confirmed").click(function () {
        defaultAnswer_edit();
    });
});