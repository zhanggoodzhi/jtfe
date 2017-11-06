function regTest(context, type) {
	var reg = {
		mobile : /^1[3458]\d{9}$/
	};
	return reg[type].test(context);
}
$(function() {
	var title = parseInt('0');
	var feedback = parseInt('0');
	var mobile = parseInt('0');
	if (title == 1) {
		showHint($('input[name=title]'), 3, '反馈标题不能为空。');
	}
	if (feedback == 1) {
		showHint($('input[name=feedback]'), 3, '反馈内容不能为空。');
	}
	if (mobile == 1) {
		showHint($('input[name=mobile]'), 3, '请输入正确的手机号码。');
	}
});

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

function formValidTitle() {
	var $this = $("#title_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if($this.val()==''){
		showHint($this, 3, "反馈标题不能为空。");
		return false;
	}	
	showHint($this, 2, "填写正确");
	return true;

}

function formValidFeedback() {
	var $this = $("#feedback_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if($this.val()==''){
		showHint($this, 3, "反馈内容不能为空。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;

}

function formValidMobile() {
	var $this = $("#mobile_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'mobile')) {
		showHint($this, 3, "请输入正确的手机号码。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}

$(document).ready(function() {
	// 反馈标题
	$("#title_input").focus(function() {
		showHint($(this), 1, "请输入反馈标题。");
	}).blur(function() {
		formValidTitle();
	});
	// 用户名
	$("#feedback_input").focus(function() {
		showHint($(this), 1, "请输入反馈内容。");
	}).blur(function() {
		formValidFeedback();
	});
	// 密码
	$("#mobile_input").focus(function() {
		showHint($(this), 1, "请输入正确的手机号码。");
	}).blur(function() {
		formValidMobile();
	});
});

function btnOclkFeedback() {
	$("#loadimg").show();
	if (!(formValidTitle() && formValidFeedback() && formValidMobile())) {
		$("#loadimg").hide();
		return false;
	}
	$.post(appName + "/feedback/feedbackInput", {
		'title' : $("#title_input").val(),
		'feedback' : $("#feedback_input").val(),
		'mobile' : $("#mobile_input").val()
	}, function(data) {
		$("#loadimg").hide();
		if (data == "0") {
			jQuery.messager.alert('提示:', "问题反馈失败，请联系管理员", 'error');
		} else if (data == "1") {
			jQuery.messager.alert('提示:', "问题反馈成功", 'info');
//			window.location.href = appName +"/feedback/feedbackSuccessful";
		} else if(data=="15"){
			showHint($("#mobile_input"), 3, "请输入正确的手机号码  支持号码1[3458]。");
		}
	});
}
