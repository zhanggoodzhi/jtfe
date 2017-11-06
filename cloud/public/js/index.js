window.onload = function () {
    var screenHeight = window.screen.height;
    var screenHeight1 = screenHeight - 170;
    $("#mainContext").css("height", screenHeight1 + "px");
    $("#mainLeft").css("height", screenHeight1 + "px");
}

function pageLoad() {
    var date1 = parser((new Date(2035, 12, 31)).formatDate("yyyy-MM-dd"));
    var myDate = new Date()
    var beginDay = getNowFormatDate(myDate);
}
var parser = function (dateStr) {
    var regexDT = /(\d{4})-?(\d{2})?-?(\d{2})?\s?(\d{2})?:?(\d{2})?:?(\d{2})?/g;
    var matchs = regexDT.exec(dateStr);
    if (matchs != null) {
        var date = new Array();
        for (var i = 1; i < matchs.length; i++) {
            if (matchs[i] != undefined) {
                date[i] = matchs[i];
            } else {
                if (i <= 3) {
                    date[i] = "01";
                } else {
                    date[i] = "00";
                }
            }
        }
        return new Date(date[1], date[2] - 1, date[3], date[4], date[5],
            date[6]);
    } else {
        return new Date();
    }
};
var getNowFormatDate = function (dataStr) {
    var day = dataStr;
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    Year = day.getFullYear(); // 支持IE和火狐浏览器.
    Month = day.getMonth() + 1;
    Day = day.getDate();
    CurrentDate += Year + "-";
    if (Month >= 10) {
        CurrentDate += Month;
    } else {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += "0" + Day;
    }
    return CurrentDate;
}

function changeDivClass(divId, divClass) {
    $("#" + divId).removeClass();
    $("#" + divId).addClass(divClass);
}

$.ajaxSetup({
    cache: false, // 设置成false将不会从浏览器缓存读取信息
});

/**
 * session 丢失调整
 *
 * @returns
 */

function getSessionUser() {

}

function regTest(context, type) {
    var reg = {
        email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        mobile: /^1[3458]\d{9}$/,
        username: /^[A-Za-z0-9]{5,20}$/,
        password: /^.{6,20}$/,
        chinese: /[\u4e00-\u9fa5]/,
        IdCard1: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,
        IdCard2: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        phone: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
        url: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
        // /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})-(\-[0-9]{1,4})?$/
    };
    return reg[type].test(context);
}
/**
 * 默认为空
 *
 * @param id
 * @param readme
 * @returns {Boolean}
 */
function validDataIsNull(id, readme) {
    var $this = id;
    if ($this.is(':hidden')) {
        return true;
    }
    if ($.trim($this.val()) == '') {
        showHint($this, 3, readme);
        return false;
    }
    showHint($this, 2, "填写正确");
    return true;
}
/**
 * //senfe("表格名称","奇数行背景","偶数行背景","鼠标经过背景");
 * senfe("senfe","#fff","#ccc","#cfc");
 *
 * @param o
 * @param a
 * @param b
 * @param c
 */
function senfe(o, a, b, c) {
    var t = document.getElementById(o).getElementsByTagName("tr");
    for (var i = 0; i < t.length; i++) {
        // alert(t[i].sectionRowIndex);
        // if(t[i].sectionRowIndex==0){
        // t[0].style.backgroundColor="#90d086";
        // }else{
        t[i].style.backgroundColor = (t[i].sectionRowIndex % 2 == 0) ? a : b;
        $(t[i]).on('click',function(){
            if (this.x != "1") {
                this.x = "1"; // 本来打算直接用背景色判断，FF获取到的背景是RGB值，不好判断
            } else {
                this.x = "0";
            }
            //$(this).css('color','#333');
            $(this).addClass('addBgColor');
            $(t).not(this).removeClass('addBgColor');
        });
        t[i].onmouseover = function () {
            if (this.x != "1")
               this.style.backgroundColor = c;
        }
        t[i].onmouseout = function () {
            if (this.x != "1")
                this.style.backgroundColor = (this.sectionRowIndex % 2 == 0) ? a :b;
        }
        // }
    }
}

/**
 * 默认为空
 *
 * @param id
 * @param readme
 * @returns {Boolean}
 */
function validDataRegTest(id, readme) {
    var $this = id;
    if ($this.is(':hidden')) {
        return true;
    }
    if ($.trim($this.val()) == '') {
        showHint($this, 3, readme);
        return false;
    }
    if (!regTest($this.val(), 'mobile')) {
        showHint($this, 3, readme);
        return false;
    }
    showHint($this, 2, "填写正确");
    return true;
}

function validDataSelectIsNull(id, readme) {

    if (id.is(':hidden')) {
        return true;
    }
    if ($.trim(id.val()) == '0') {
        showHint(id, 3, readme);
        return false;
    }
    showHint(id, 2, "填写正确");
    return true;
}

function showHint($element, type, message) {
    $hintTd = $element.parent().siblings(".td_hint_str");
    $hintElements = $hintTd.children();
    $hintText = $hintTd.find(".hint_text");
    $hintText.text(message);
    for (var i = 1; i <= 3; i++) {
        if (type == i) {
            $($hintElements[0]).addClass("into_input_jt_0" + i);
            $($hintElements[1]).addClass("into_input_bg_0" + i);
        } else {
            $($hintElements[0]).removeClass("into_input_jt_0" + i);
            $($hintElements[1]).removeClass("into_input_bg_0" + i);
        }
    }
    $hintElements.show();
}

function hideHint($element) {
    $hintTd = $element.parent().siblings(".td_hint_str");
    $hintElements = $hintTd.children();
    $hintElements.hide();
}

function onbtnOverCss(v) {
    v.style.backgroundColor = "#3a8841";
}

function onbtnOutCss(v) {
    v.style.backgroundColor = "#2f9833";
}
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1,
        // month
        'd+': this.getDate(),
        // day
        'h+': this.getHours(),
        // hour
        'm+': this.getMinutes(),
        // minute
        's+': this.getSeconds(),
        // second
        'q+': Math.floor((this.getMonth() + 3) / 3),
        // quarter
        'S': this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format) || /(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '')
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};
Date.prototype.formatDate = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function bulletinSystemInit() {

    $(".bulletinSystemDel").remove();
    $
        .post(
            appName + "/bulletin/queryBulletinSystem",
            function (data) {
                $(data)
                    .each(
                        function (key, val) {
                            var title = val.title;
                            if (title.length > 12) {
                                title = title.substring(0, 12) +
                                    "......";
                            }
                            var sequence = key + 1;
                            var newbulletinSystem = ""
                            if (sequence == 1) {

                                $(
                                        "<tr class='bulletinSystemDel '  style='cursor: pointer;height:30px;'  >" +
                                        "<td  onclick='onclkBulletinSystem(" +
                                        val.id +
                                        ")' ><label class='bulletinSystemTabLable'>" +
                                        title +
                                        "</label><img src='images/new.png'/></td><td " +
                                        "onclick='onclkBulletinSystem(" +
                                        val.id +
                                        ")' align='right'  class='bulletinSystemTabLable' style='padding-right:8px;'>" +
                                        val.createTime
                                        .substring(
                                            0,
                                            10) +
                                        "</td></tr>")
                                    .appendTo(
                                        "#bulletinSystemTab");
                                newbulletinSystem = val.id;
                                onclkBulletinSystem(newbulletinSystem);

                            } else {
                                $(
                                        "<tr class='bulletinSystemDel' style='cursor: pointer;height:30px;'  >" +
                                        "<td  onclick='onclkBulletinSystem(" +
                                        val.id +
                                        ")' ><label  class='bulletinSystemTabLable'>" +
                                        title +
                                        "</label></td><td " +
                                        "onclick='onclkBulletinSystem(" +
                                        val.id +
                                        ")' align='right'  class='bulletinSystemTabLable' style='padding-right:8px;'>" +
                                        val.createTime
                                        .substring(
                                            0,
                                            10) +
                                        "</td></tr>")
                                    .appendTo(
                                        "#bulletinSystemTab");
                            }
                            senfe("bulletinSystemTab",
                                "#ffffff", "#fafafa",
                                "#f1f1f1");
                        });
            }, 'json');
}

function onclkBulletinSystem(id) {
    $("#divbulletinSystem").show();
    $("#divFlow").hide();
    $.get(appName + "/bulletin/listBulletinSystemById?id=" + id, function (data) {
        $(data).each(function (key, val) {
            // $("#labTitle").html(val.title);
            // $("#divContentHtml").html(val.contentHtml);
            $("#divContentHtml").html(val.msg.title);
            $("#divContentHtml").html(val.msg.contentHtml);
        });
    }, "json");
    resizeHeight();
}
