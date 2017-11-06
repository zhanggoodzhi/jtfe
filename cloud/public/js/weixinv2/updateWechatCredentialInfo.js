/*$(function () {

});*/

$(function () {
	$('.btn.disabled').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
	});
});

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
		},
	}, 'json');
}
String.prototype.getBytesLength = function () {
	return this.replace(/[^\x00-\xff]/gi, "--").length;
}

function testNull() {
	if ($.trim($("#wxName").val()) === "") {
		new PNotify({
			title: '提示：',
			text: '公众号名称不能为空'
		});
		return 0;
	}
	if ($("#wxName").val().getBytesLength() > 255) {
		new PNotify({
			title: '提示：',
			text: '公众号名称长度不能超过255个字节'
		});
		return 0;
	}
	if ($("#description").val().getBytesLength() > 255) {
		new PNotify({
			title: '提示：',
			text: '公众号介绍长度不能超过255个字节'
		});
		return 0;
	}
	var bgImgUrl = $('#imgcover_0').css('background-image').substr(3);
	if (!bgImgUrl) {
		new PNotify({
			title: '提示：',
			text: '公众号二维码不能为空'
		});
		return 0;
	}
	return 1;
}

function formSubmit() {
	if (testNull() == 1)
		$("#updateWechatCredentialInfo").submit();
}
