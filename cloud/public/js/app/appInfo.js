/*global wangEditor*/
"use strict";

$(function () {
    $("#robotName").on("input", function () {
        var el = $(this);
        el.val(el.val().replace(/\s/g, ""));
    });
});
var appId = undefined;
var domainsSelect = undefined;

function onSelectDomain(domainId) {
    domainsSelect = domainId;
    //	appInfoList.init();
}

function isImg(imgfile, fileValue) {
    var result = false;
    if (!/.(gif|jpg|jpeg|png|jpg)$/.test(fileValue)) {
        fileValue = null;
        new PNotify({
            title: '提示：',
            text: '图片格式需为gif/jpg/jpeg/png/jpg中的一种！'
        });
        clearFileInput(imgfile);
        result = false;
    } else if (!checkPhoto("furl_logo_edit")) {
        clearFileInput(imgfile);
        result = false;
    } else {
        result = true;
    }
    return result;
}

function clearFileInput(imgfile) {
    imgfile.after(imgfile.clone().val(""));
    imgfile.remove();
}

function checkPhoto(fid) {
    var maxsize = 10 * 1014 * 1024; //2KB
    var errMsg = "上传的附件文件不能超过10M！！！";
    var tipMsg = "您的浏览器暂不支持计算上传文件的大小，确保上传文件不要超过10M，建议使用IE、FireFox、Chrome浏览器。";
    var browserCfg = {};
    var backValue;
    var ua = window.navigator.userAgent;
    if (ua.indexOf("MSIE") >= 1) {
        browserCfg.ie = true;
    } else if (ua.indexOf("Firefox") >= 1) {
        browserCfg.firefox = true;
    } else if (ua.indexOf("Chrome") >= 1) {
        browserCfg.chrome = true;
    }
    try {
        var obj_file = document.getElementById(fid);
        var filesize = 0;
        if (browserCfg.firefox || browserCfg.chrome) {
            filesize = obj_file.files[0].size;
        } else if (browserCfg.ie) {
            var obj_img = document.getElementById('tempimg');
            obj_img.dynsrc = obj_file.value;
            filesize = obj_img.fileSize;
        } else {
            new PNotify({
                title: '提示：',
                text: tipMsg
            });
            backValue = false;
        }

        if (filesize == -1) {
            new PNotify({
                title: '提示：',
                text: errMsg
            });
            backValue = false;
        } else if (filesize > maxsize) {
            new PNotify({
                title: '提示：',
                text: errMsg
            });
            backValue = false;
        } else {
            backValue = true;;
        }
    } catch (e) {
        new PNotify({
            title: '提示：',
            text: e
        });
        backValue = false;
    }
    return backValue;
}

function editRobotEditMsg() {
    if ($("#robotName").val().trim() == "") {
        new PNotify({
            title: '保存失败',
            text: '智能机器人名称不能为空',
            type: 'warn'
        });
        return false;
    }
    if ($("#editor").text().trim() == "") {
        new PNotify({
            title: '保存失败',
            text: '欢迎语不能为空',
            type: 'warn'
        });
        return false;
    }
    robotEdit();
    return true;

}

function basicMsg_reflash() {
    $("#basicMsg_tab").tab('show');
}

function robotEdit() {
    var url;
    var clientstyle = "1";
    if ($('#simple').is(':checked'))
        clientstyle = "2";
    var recom = "0";
    if ($('#recomQuestionDisplay1').is(':checked'))
        recom = "1";
    var faq = "0";
    if ($('#faqExpandDisplay1').is(':checked'))
        faq = "1";
    var is_open = "0";
    if ($('#is_open_yes').is(':checked'))
        is_open = "1";
    var help = "0";
    if ($('#ishelpfulDisplay1').is(':checked'))
        help = "1";
    var quick = "4";
    if ($('#quick_1').is(':checked'))
        quick = "1";
    else if ($('#quick_2').is(':checked'))
        quick = "2";
    else if ($('#quick_3').is(':checked'))
        quick = "3";
    else if ($('#quick_5').is(':checked'))
        quick = "5";
    else if ($('#quick_6').is(':checked'))
        quick = "6";
    else if ($('#quick_7').is(':checked'))
        quick = "7";
    else if ($('#quick_8').is(':checked'))
        quick = "8";

    url = appName + "/frontStyle/update"

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: {
            "robotName": $("#robotName").val(),
            "guide": $("#editor").html().trim(),
            "client_style": clientstyle,
            "recomQuestionDisplay": recom,
            "isOpen": is_open,
            "faqExpandDisplay": faq,
            "ishelpfulDisplay": help,
            "quick_access_style": quick
        },
        complete: function (data, status, xhr) {
            console.log(data);
        },
        success: function (result) {
            if (result == 1) {
                new PNotify({
                    title: '提示',
                    text: "保存成功！",
                    type: 'success'
                });
            } else {
                new PNotify({
                    title: '错误：',
                    text: "保存失败！",
                    type: 'error'
                });
            }
        }
    });

}

function initCharacter() {
    var heightDG = document.body.scrollHeight - 110;
    $("#dg2").css("height", heightDG + "px");
    dg2List.init();
    $("#defaultAnswerTab").css("height", heightDG + "px");
}

$(function () {
    $("#upfile_0").on("change", uploadRobotHead);
    $("#upfile_1").on("change", uploadVisitorHead);
    basicMsg_reflash();
    initEditor();
    $("#robot_tabs a").on('shown.bs.tab', function (e) {
        if ($(e.target).attr('id') === 'basicMsg_tab') {} else if ($(e.target).attr('id') === 'character_tab') {
            initCharacter();
        }
        resizeHeight();
    });

    $("#character_confirmed").click(function () {
        character_add();
    });

    $("#defaultAnswer_save_confirmed").click(function () {
        defaultAnswer_append();
    });

    $("#defaultAnswer_edit_confirmed").click(function () {
        defaultAnswer_edit();
    });
});



function uploadVisitorHead() {
    uploadHead("app/uploadVisitorHead", $("#imgVisitorForm"), $("#imgVisitorHead"), $(this));
}

function uploadRobotHead() {
    uploadHead("app/uploadRobotHead", $("#imgForm"), $("#imgRobotHead"), $(this));
}

function uploadHead(url, form, headElement, el) {
    if (!el.val()) {
        return;
    }
    form.ajaxSubmit({
        url: url,
        type: 'post',
        dataType: 'json',
        complete: function (data) {
            var result = eval('(' + data.responseText + ')');
            if (result.code == "200") {
                headElement.css("background-image",
                    "url('" + result.msg + "')");
            } else {
                new PNotify({
                    title: '上传图片失败',
                    text: result.msg,
                    type: 'error'
                });
            }
            el.val("");
        },
    }, 'json');
}

function initEditor() {
    var editorArr = ["editor", "new-editor", "edit-editor"];
    wangEditor.config.printLog = false; //禁用Log
    editorArr.forEach(function (v) {
        var editor = new wangEditor(v);
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
        editor.config.menuFixed = false; //禁用吸顶
        // editor.config.uploadImgFns.onload = function (resultText, xhr) {
        // 	var originalName = editor.uploadImgOriginalName || '';
        // 	console.log(resultText);
        // 	editor.command(null, 'insertHtml', '<img src="' + resultText + '" alt="' + originalName + '" style="max-width:100%;"/>');
        // };
        editor.create();
    });
}
