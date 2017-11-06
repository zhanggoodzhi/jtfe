$(function () {
    $('#addWechatButton').mouseenter(function () {
        $('#addWechatButton').popover('toggle');
    });
    $('#addWechatButton').mouseleave(function () {
        $('#addWechatButton').popover('hide');
    });

    $('#picButtonUpload').mouseenter(function () {
        $('#picButtonUpload').popover('toggle');
    });
    $('#picButtonUpload').mouseleave(function () {
        $('#picButtonUpload').popover('hide');
    });

    $('#voiceButtonUpload').mouseenter(function () {
        $('#voiceButtonUpload').popover('toggle');
    });
    $('#voiceButtonUpload').mouseleave(function () {
        $('#voiceButtonUpload').popover('hide');
    });

    $('#videoButtonUpload').mouseenter(function () {
        $('#videoButtonUpload').popover('toggle');
    });
    $('#videoButtonUpload').mouseleave(function () {
        $('#videoButtonUpload').popover('hide');
    });
    $("#myTab a").on('shown.bs.tab', function (e) {
        $(".uploadbtn").css("display", "none");
        if ($(e.target).attr("href") == "#msg")
            $("#addWechatButton").css("display", "inline-block");
        if ($(e.target).attr("href") == "#pic")
            $("#picButtonUpload").css("display", "inline-block");
        if ($(e.target).attr("href") == "#voice")
            $("#voiceButtonUpload").css("display", "inline-block");
        if ($(e.target).attr("href") == "#video")
            $("#videoButtonUpload").css("display", "inline-block");
        resizeHeightRow();
        loadimg();
    });
    $("#tB input.checkBoxInput").on('change', function (e) {
        var checkboxId = $(e.target).attr('id');
        var num = checkboxId.split('_')[1];
        var accType=$(this).next().val();
        showSelect(num,accType);
    });
    // 下拉选择框，选项被改变后，相关的select的是否可选性要修改。根据selectAccType修改，为3时。。。，不为3时
    $("#tB select").on('change', function (e) {
        var targetId = $(e.target).attr('id');
        var task = targetId.split('_')[0];
        var num = targetId.split('_')[1];
        var selectAccType=$(this).prev().val();
        if (task == "target") {
            showGroupSelect(targetId, num,selectAccType);
        }
    });

    $(".carrousel").click(function (e) {
        $(".carrousel").find("img").attr("src", '');
        $(".carrousel").fadeOut(200);
    });
    // 群发模态框绑定清空事件
    $('#sendMsg').on('hidden.bs.modal',function(){
        clearMsgForm();
    });
    bindPlayVoice();
});
function clearMsgForm(){
    for (var i = 0; i < selectId.length; i++) {
        // if ($('#checkbox_' + selectId[i]).is(':checked')) {
            var sendAccType=$('#checkbox_' + selectId[i]).next().val();
            $('#checkbox_' + selectId[i]).removeAttr("checked");
            $('#group_' + selectId[i]).val('-1');
            $('#gender_' + selectId[i]).val('0');
            $('#gender_' + selectId[i]).attr("disabled", "disabled");
            $('#group_' + selectId[i]).attr("disabled", "disabled");
            if(parseInt(sendAccType)!==3){
                $('#target_' + selectId[i]).val('1');
            }else{
                $('#target_' + selectId[i]).val('').trigger('change');
            }
            $('#target_' + selectId[i]).attr("disabled", "disabled");
            /*$('#tB input').removeAttr("checked");
            $("#tB select").attr("disabled", "disabled");*/
        //}
    }
}
function resizeHeightRow() {
    resizeHeight();
}

// -----------------点击群发，打开群发模态框-----------------
var tempId = 0;

function addBroadcastModal(mediaId, flag, id) {
    tempId = mediaId;
    // 初始化select2
    $('select.select').select2({
        placeholder:'企业号群发对象'
    });
    if (flag == 0) {
        $('#tB tr').show();
        $('#formtitle_sendMsg').html("推送到矩阵");
        $('#sendMsg_info').html("发送消息到指定的公众号");
    } else if (flag == 1) {
        //$('#tB input').removeAttr("checked");
        //$("#tB select").attr("disabled", "disabled");
        /*for (var i = 0; i < selectId.length; i++) {
            $('#target_' + selectId[i]).val('1');
            $('#group_' + selectId[i]).val('-1');
            $('#gender_' + selectId[i]).val('0');
        }*/
        $('#tB tr').hide();
        $('#formtitle_sendMsg').html("群发消息");
        $('#sendMsg_info').html("将当前素材群发至当前公众号");
        $('#tr_' + id).show();
    } else if (flag == 2) {
        $('#tB input').removeAttr("checked");
        $("#tB select").attr("disabled", "disabled");
        for (var i = 0; i < selectId.length; i++) {
            $('#target_' + selectId[i]).val('1');
            $('#group_' + selectId[i]).val('-1');
            $('#gender_' + selectId[i]).val('0');
        }
        $('#tB tr').hide();
        $('#tr_' + id).show();
        $('#formtitle_sendMsg').html("转发消息");
        $('#sendMsg_info').html("将当前公众号的素材转发至此账号对应的公众号");
    }

    $('#sendMsg').modal('toggle');
}

function previewBroadcastModal(mediaId) {
    $('#previewMsg').modal('toggle');
    currentMediaId = mediaId;
}

function previewBroadcast() {
    new PNotify({
        title: '消息提示',
        text: '正在发送消息预览请求',
        type: 'info'
    });
    var wechatname = $("#previewWxAccount").val();
    $.ajax({
        url: 'weixinv2/broadcast/previewBroadcast',
        type: 'POST',
        data: {
            "credential": $("#previewWxappid").val(),
            "touser": wechatname,
            "mediaId": currentMediaId
        },
        success: function (data) {
            if (data.code == "200") {
                new PNotify({
                    title: '消息提示',
                    text: '消息预览发送成功, 请到微信上面查看效果',
                    type: 'success'
                });
                $('#previewMsg').modal('hide');
            } else {
                new PNotify({
                    title: '预览发送失败',
                    text: data.msg,
                    type: 'error'
                });
            }
        }
    });

}
// -----------------当选择公众号时，对应下拉框启用，反之禁用-------------------
function showSelect(num,accType) {
    if(parseInt(accType)===3){
        if ($('#checkbox_' + num).is(':checked')) {
            $('#target_' + num).removeAttr("disabled");
        }else{
            $('#target_' + num).attr("disabled", "disabled");
        }
    }else{
        if ($('#checkbox_' + num).is(':checked')) {
            $('#target_' + num).removeAttr("disabled");
            $('#gender_' + num).removeAttr("disabled");
        } else {
            $('#target_' + num).attr("disabled", "disabled");
            $('#gender_' + num).attr("disabled", "disabled");
            $('#group_' + num).attr("disabled", "disabled");
        }

    }
}
// -----------------当对象为 按标签选择时，对应下拉框启用-------------------
function showGroupSelect(targetId, num,selectAccType) {
    if(parseInt(selectAccType)!==3){
        if ($('#' + targetId).val() == "2") {
            $('#group_' + num).removeAttr("disabled");
        }
        if ($('#' + targetId).val() == "1") {
            $('#group_' + num).attr("disabled", "disabled");
        }
    }
}
// -----------------添加群发-------------------
function addBroadcast() {
    // 确认群发之后，要获取改行的accType，为3的时候，要添加一个字段，即应用id的数组
    // debugger
    $('#sendMsg').modal('hide');
    new PNotify({
        title: '提示：',
        text: '正在将群发消息提交到微信服务器,请稍候'
    });
    for (var i = 0; i < selectId.length; i++) {
        if ($('#checkbox_' + selectId[i]).is(':checked')) {
            var sendData={};

            var credential = selectId[i];
            var wxname = $('#credentiallabel_' + selectId[i]).text();
            var target = $('#target_' + selectId[i]).val();
            var group = $('#group_' + selectId[i]).val();
            var gender = $('#gender_' + selectId[i]).val();

            // 获取type，为3的时候，添加字段agentids,并修改target
            var sendAccType=$('#checkbox_' + selectId[i]).next().val();
            var agentIds='';
            if(parseInt(sendAccType)===3){
                agentIds=$('#target_' + selectId[i]).val();
                sendData.agentid=agentIds.join(',');
            }else{
                sendData.target=target;
            }
            /*$('#checkbox_' + selectId[i]).removeAttr("checked");
            $('#group_' + selectId[i]).val('-1');
            $('#gender_' + selectId[i]).val('0');
            $('#gender_' + selectId[i]).attr("disabled", "disabled");
            $('#group_' + selectId[i]).attr("disabled", "disabled");*/
            /*if(parseInt(sendAccType)!==3){
                $('#target_' + selectId[i]).val('1');
            }else{
                $('#target_' + selectId[i]).val('').trigger('change');
            }
            $('#target_' + selectId[i]).attr("disabled", "disabled");*/
            // var country = $('#country').val();
            sendData.credential=credential;
            sendData.mediaId=tempId;
            sendData.group=group;
            sendData.gender=gender;
            (function (wxname) {
                $.ajax({
                    url: 'weixinv2/broadcast/addBroadcast',
                    type: 'POST',
                    data:sendData,
                    success: function (data) {
                        if (data.code == "200") {
                            new PNotify({
                                title: '消息提示',
                                text: wxname + ': 消息已经群发成功',
                                type: 'success'
                            });
                        } else {
                            new PNotify({
                                title: '消息提示',
                                text: wxname + ': ' + data.msg,
                                type: 'error'
                            });
                        }
                    }
                });
            }(wxname));
        }
    }
}

// -----------------删除图文消息-------------------
var userDialog = undefined;

var delNews = function (mediaId) {
    userDialog = new BootstrapDialog.show({
        size: BootstrapDialog.SIZE_NORMAL,
        title: '提示',
        message: '确认删除?',
        buttons: [{
            label: '确认',
            cssClass: 'btn-primary',
            action: function () {
                ajaxDeleteNews(mediaId);
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

var ajaxDeleteNews = function (mediaId) {
    $.ajax({
        url: 'weixinv2/material/deleteNewsList',
        data: {
            mediaId: mediaId
        },
        type: 'post',
        success: function (data, status) {
            if (data.code == "200") {
                userDialog.close();
                location.reload(true);
            } else {
                new PNotify({
                    title: '消息提示',
                    text: '删除失败',
                    type: data.msg
                });
            }
        }
    });
};
// 语音播放
var audio = document.createElement('audio');

function bindPlayVoice(){
    $('.voice-table').on('click', '.audio-wrap', function (e) {
        //debugger
		var el = $(this);
		var url = el.data().id;
		if (el.is('.active')) {// 正在播放
			el.removeClass('active');
			audio.pause();
			audio.currentTime = 0;
		} else {
            $('.voice-table').find('.audio-wrap').removeClass('active');
			audio.pause();
			el.addClass('active');
			audio.src = url;
			audio.currentTime = 0;
			audio.play();
		}
        e.stopPropagation();
	});
	$(audio).on('ended', function () {
		$('.voice-table').find('.audio-wrap').removeClass('active');
	});
}
// -----------------删除图片/音频/视频-------------------
function delMedia(mediaId) {
    userDialog = new BootstrapDialog.show({
        title: '提示',
        message: '确认删除?',
        buttons: [{
            label: '确认',
            cssClass: 'btn-primary',
            action: function () {
                ajaxDeleteMedia(mediaId);
            }
        }, {
            label: '取消',
            cssClass: 'btn-default',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }]
    });
}

function ajaxDeleteMedia(mediaId) {
    $.ajax({
        url: 'weixinv2/material/deleteMedia',
        data: {
            mediaId: mediaId
        },
        type: 'post',
        success: function (data, status) {
            if (status == "success") {
                userDialog.close();
                $("#record-" + mediaId).remove();
                location.reload(true);
            }
        }
    });
}

// -----------------动态添加文件-------------------
function addMediaDynamically(wechatMediaId, wechatMediaUrl, wechatMediaName,
    type) {
    trhtml = '<div class="col-md-55" id="record-' + wechatMediaId + '">';
    trhtml += '<div class="thumbnail">';
    trhtml += '<div class="image view view-first">';
    trhtml += '<img class="lazy" style="width: 100%; display: block;" src="' +
        wechatMediaUrl + '" data-original="' + wechatMediaUrl +
        '" alt="image" />';
    trhtml += '<div class="mask no-caption"><div class="tools tools-bottom">';
    if (type == '2') {
        trhtml += '<a onclick="showPic(' +
            "'" +
            wechatMediaUrl +
            "'" +
            ')" title="放大图片" href="javascript:;"> <i class="fa fa-expand"></i></a>';
        trhtml += '<a onclick="addBroadcastModal(' +
            wechatMediaId +
            ')" title="群发" href="javascript:;"> <i class="fa fa-pencil"></i></a>';
    }
    trhtml += '<a onclick="delMedia(' +
        wechatMediaId +
        ')" title="删除" href="javascript:;"><i class="fa fa-times"></i></a>';
    trhtml += '</div></div></div>';
    trhtml += '<div class="caption"><p>' + wechatMediaName +
        '</p></div></div></div>';
    /*if (type == '2')
        $('#picTable').prepend(trhtml);*/
    if (type == '3')
        $('#voiceTable').prepend(trhtml);
    if (type == '4')
        $('#videoTable').prepend(trhtml);
};
// -----------------上传文件-------------------
function uploadMedia(type) {
    tempId = type;
    $('#uploadMedia').modal('toggle');
}

function uploadFile() {
    var credentialId = $('#id').val();
    // var name = $('#fileToUpload').val();

    $('#uploadMedia').modal('hide');
    $.ajaxFileUpload({
        url: 'weixinv2/material/uploadFile', // 处理图片脚本
        type: 'POST',
        secureuri: false,
        fileElementId: "fileToUpload", // file控件id
        dataType: 'json',
        data: {
            "credentialId": credentialId,
            "type": tempId
        },
        error: function (data, status, e) {
            /* console.log(e); */
        },
        success: function (data, status) {
            if (typeof (data.state) != 'undefined') {
                if (data.state != 'SUCCESS') {
                    new PNotify({
                        title: '消息提示',
                        text: data.state
                    });
                } else {
                    $('#fileToUpload').val('');
                    addMediaDynamically(data.mediaid, data.mediaurl, data.name,
                        tempId);

                }
            }
        },
        complete: function (data) {
            location.reload(true);
        }
    });
    return false;
}
// -----------------图片放大-------------------
function showPic(uri) {
    $(".carrousel").find("img").attr("src", uri);
    $(".carrousel").fadeIn(200);
}
