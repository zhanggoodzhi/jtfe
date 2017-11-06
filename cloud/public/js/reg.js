function regTest(context, type) {
	var reg = {
		email : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		mobile : /^1[3458]\d{9}$/,
		username : /^[A-Za-z0-9]{5,20}$/,
		password : /^.{6,20}$/,
		chinese : /[\u4e00-\u9fa5]/,
		num : /^[0-9]*$/
	};
	return reg[type].test(context);
}
$(function() {
	var email = parseInt('0');
	var cname = parseInt('0');
	var pwd = parseInt('0');
	var alias = parseInt('0');
	var mobile = parseInt('0');
	var qq = parseInt('0');
	var yzcode = parseInt('0');
	if (email == 1) {
		showHint($('input[name=email]'), 3, '请填写正确的电子邮件。');
	} else if (email == 2) {
		showHint($('input[name=email]'), 3, '该邮箱帐户已被注册。');
	}
	if (cname == 1) {
		showHint($('input[name=cname]'), 3, '请输入正确的用户名。');
	} else if (cname == 2) {
		showHint($('input[name=cname]'), 3, '该用户名已被注册。');
	}

	if (pwd == 1) {
		showHint($('input[name=pwd]'), 3, '请输入6到20个字符的密码。');
	}
	if (alias == 1) {
		showHint($('input[name=alias]'), 3, '请输入联系人。');
	}
	if (mobile == 1) {
		showHint($('input[name=mobile]'), 3, '请输入正确的手机号码。');
	} else if (mobile == 2) {
		showHint($('input[name=mobile]'), 3, '该手机帐户已被注册。');
	}
	if (qq == 1) {
		showHint($('input[name=qq]'), 3, '请输入QQ号。');
	}
	if (yzcode == 1) {
		showHint($('input[name=yzcode]'), 3, '请重新输入验证码。');
	}
	$("[name='checkbox']").attr("checked", true);// 全选
});

function check_XY() {
	if (document.getElementById("chkXY").checked) {
		$("#txtXY").val("1");
		 $("#submit_button").css("display", "block");
	} else {
		$("#txtXY").val("0");
		$("#submit_button").css("display", "none");
	}
}

function showHint($element, type, message) {
	$hintTd = $element.parent().siblings(".td_hint_str");
	$hintElements = $hintTd.children();
	$hintText = $hintTd.find(".hint_text");
	$hintText.text(message);
	for ( var i = 1; i <= 3; i++) {
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

function formValidEmail(callFunc) {
	var $this = $("#email_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'email')) {
		showHint($this, 3, "请填写正确格式的电子邮件地址。");
		return false;
	}

	if (callFunc != undefined) {
		callFunc();
	} else {
		showHint($this, 2, "填写正确");
		return true;
	}
}
function formValidEmail1() {
	var $this = $("#email_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'email')) {
		showHint($this, 3, "请填写正确格式的电子邮件地址。");
		return false;
	}

		showHint($this, 2, "填写正确");
		return true;
}
/**
 * 重置密码
 * 
 * @param callFunc
 * @returns {Boolean}
 */
function formValidEmailPWD(callFunc) {
	var $this = $("#emailpwd_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'email')) {
		showHint($this, 3, "请填写正确格式的电子邮件地址。");
		return false;
	}
	if (callFunc != undefined) {
		callFunc();
	} else {
		showHint($this, 2, "填写正确");
		return true;
	}
}
function formValidMobile(callFunc) {
	var $this = $("#mobile_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'mobile')) {
		showHint($this, 3, "请输入正确的手机号码。");
		return false;
	}
	if (callFunc != undefined) {
		callFunc();
	} else {
		showHint($this, 2, "填写正确");
		return true;
	}
}
function formValidMobile1() {
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
function formValidPassword() {
	var $this = $("#pwd_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的密码。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}

function formValidPasswordReset() {
	var $this = $("#pwdResetPwd_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的密码。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}

function formValidRePassword() {
	var $this = $("#repwd_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if ($this.val() == '') {
		showHint($this, 3, "密码不能为空。");
		return false;
	} else if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的密码。");
		return false;
	} else if ($this.val() !== $("#pwd_input").val()) {
		showHint($this, 3, "两次输入的密码不一致。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}
function formValidRePasswordReset() {
	var $this = $("#repwdResetPwd_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if ($this.val() == '') {
		showHint($this, 3, "密码不能为空。");
		return false;
	} else if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的密码。");
		return false;
	} else if ($this.val() !== $("#pwdResetPwd_input").val()) {
		showHint($this, 3, "两次输入的密码不一致。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}

function formValidComName(callFunc) {
	var $this = $("#cname_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if ($.trim($this.val()) == '') {
		showHint($this, 3, "请输入用户名。");
		return false;
	}
	if (callFunc != undefined) {
		callFunc();
	} else {
		showHint($this, 2, "填写正确");
		return true;
	}
}

function formValidComName1() {
	var $this = $("#cname_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if ($.trim($this.val()) == '') {
		showHint($this, 3, "请输入用户名。");
		return false;
	}
		showHint($this, 2, "填写正确");
		return true;
}
/**
 * 联系人
 * 
 * @returns {Boolean}
 */
function formValidWebsite() {
	var $this = $("#alias_input");
	if ($this.is(':hidden')) {
		return true;
	}
	if ($.trim($this.val()) == '') {
		showHint($this, 3, "请输入联系人。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}

/**
 * 判断邮箱唯一验证
 */
function checkEmail() {
	var $this = $("#email_input");
	$.post(appName + "/register/isUniqueUserEmail", {
		'email' : $.trim($this.val())
	}, function(data) {
		if (data == "0") {
			showHint($this, 3, "请填写正确格式的电子邮件地址。");
		} else if (data == "2") {
			showHint($this, 3, "该邮箱账号已注册。");
		} else {
			showHint($this, 2, "填写正确");
		}

	});

}
/**
 * 手机唯一验证
 */
function checkMobile() {
	var $this = $("#mobile_input");
	$.post(appName + "/register/isUniqueUserMobile", {
		'mobile' : $.trim($this.val())
	}, function(data) {
		if (data == "0") {
			showHint($this, 3, "请输入正确的手机号码。");
		} else if (data == "2") {
			showHint($this, 3, "该手机账号已注册。");
		} else {
			showHint($this, 2, "填写正确");
		}
	});
}
/**
 * 用户名唯一验证
 */
function checkComName() {
	var $this = $("#cname_input");
	$.post(appName + "/register/isUniqueUserName", {
		'username' : $.trim($this.val())
	}, function(data) {
		if (data == "0") {
			showHint($this, 3, "请输入用户名。");
		} else if (data == "2") {
			showHint($this, 3, "该用户名称已注册。");
		} else {
			showHint($this, 2, "填写正确");
		}
	});
}
// 验证码判断
function check_yzm() {
	var $this = $("#yzcode_input");
	$.post(appName + "/register/ValidateCodeImage", {
		'code' : $.trim($this.val())
	}, function(data) {
		if (data == "0") {
			showHint($this, 3, "请输入正确的验证码。");
		} else if (data == "1") {
			showHint($this, 2, "填写正确");
		} else if (data == "2") {
			showHint($this, 3, "该验证码已过期。");
			$('#yzcode').trigger('click');
		} else if (data == "3") {
			showHint($this, 3, "验证码错误，请重新输入。");
		}
	});
}

$(document).ready(function() {
	// 邮箱
	$("#email_input").focus(function() {
		showHint($(this), 1, "请输入常用邮箱，可用于登陆。");
	}).blur(function() {
		formValidEmail(checkEmail);
	});
	// 用户名
	$("#cname_input").focus(function() {
		showHint($(this), 1, "请输入用户名称。");
	}).blur(function() {
		formValidComName(checkComName);
	});
	// 密码
	$("#pwd_input").focus(function() {
		showHint($(this), 1, "请输入6到20个字符的密码。");
	}).blur(function() {
		formValidPassword();
	});
	// 确认密码
	$("#repwd_input").focus(function() {
		showHint($(this), 1, "请再次输入密码。");
	}).blur(function() {
		formValidRePassword();
	});
	// 联系人
	$("#alias_input").focus(function() {
		showHint($(this), 1, "请输入联系人。");
	}).blur(function() {
		formValidWebsite();
	});
	// 手机
	$("#mobile_input").focus(function() {
		showHint($(this), 1, "请输入真实手机。");
	}).blur(function() {
		formValidMobile(checkMobile);
	});
	// QQ
	$("#qq_input").focus(function() {

		// showHint($(this), 1, "请输入真实手机。");
	}).blur(function() {
		var qq = $("#qq_input");
		if (qq.val() != "") {
			if (!regTest(qq.val(), 'num')) {
				showHint(qq, 3, "请输入正确的QQ号。");
				return false;
			}
		}
	});
	// 验证码
	$("#yzcode_input").focus(function() {
		showHint($(this), 1, "请输入验证码。");
	}).blur(function() {
		yzcode=document.getElementById("yzcode_input").value;  
		if(yzcode.length==5){
			check_yzm();
		}else{
			showHint($(this), 1, "请重新输入验证码。");
		}
		
		
	});
});
/**
 * 用户注册
 * 
 * @returns {Boolean}
 */
function btnRegister() {
	$("#loadimg").show();
	if (!(formValidEmail1() && formValidPassword() && formValidRePassword()
			&& formValidComName1() && formValidMobile1() && formValidWebsite())) {
		$("#loadimg").hide();
		return false;
	}

	$.post(appName + "/register/userRegister", {
		'email' : $("#email_input").val(),
		'cname' : $("#cname_input").val(),
		'pwd' : $("#pwd_input").val(),
		'alias' : $("#alias_input").val(),
		'mobile' : $("#mobile_input").val(),
		'qq' : $("#qq_input").val(),
		'yzcode' : $("#yzcode_input").val()
	}, function(data) {
		$("#loadimg").hide();
		if (data == "0") {
			$.messager.alert('提示', '注册失败！', "error");
		} else if (data == "1") {
			showHint($("#qq_input"), 2, "填写正确");
			window.location.href = "register/regSuccessful";
		} else if (data == "11") {
			showHint($("#cname_input"), 3, "请输入正确的用户名  5-20个字母+数字。");
		} else if (data == "101") {
			showHint($("#cname_input"), 3, "该用户名称已注册。");
		} else if (data == "12") {
			showHint($("#pwd_input"), 3, "请输入正确的密码  6-20个字母+数字。");
		} else if (data == "13") {
			showHint($("#alias_input"), 3, "请输入真实的联系人 数字无效。");
		} else if (data == "14") {
			showHint($("#email_input"), 3, "请输入正确的邮箱。");
		} else if (data == "141") {
			showHint($("#email_input"), 3, "该邮箱帐户已被注册。");
		} else if (data == "15") {
			showHint($("#mobile_input"), 3, "请输入正确的手机号码  支持号码1[3458]。");
		} else if (data == "151") {
			showHint($("#mobile_input"), 3, "该手机账号已注册。");
		} else if (data == "16") {
			showHint($("#qq_input"), 3, "请输入真实的QQ。");
		} else if (data == "17") {
			showHint($("#yzcode_input"), 3, "验证码错误，请重新输入。");
		} else if (data == "171") {
			showHint($("#yzcode_input"), 3, "该验证码已过期。");
			$('#yzcode').trigger('click');
		}
		
	});

}
/**
 * 忘记密码-邮箱 点击下一步
 * 
 * @returns {Boolean}
 */
function btnRegisterEmailPwd() {
	if (!(formValidEmailPWD())) {
		return false;
	}
	$("#loadimg").show();
//	alert( $("#emailpwd_input").val())
	$.post(appName + "/register/isEmailPWD", {
		'email' : $("#emailpwd_input").val()
	}, function(data) {
//		alert(data);
		window.location.href = appName + "/register/resetPwdEmailMess";
	});
	$("#loadimg").hide();
}
/**
 * 更改密码
 */
function btnResetPwd() {
	if (!(formValidPasswordReset && formValidRePasswordReset())) {
		return false;
	}
	$("#loadimg").show();
	$.post(appName + "/register/updateResetPwd", {
		'username' : $("#cnameResetPwd_input").val(),
		'password' : $("#pwdResetPwd_input").val(),
	}, function(data) {
		window.location.href = appName + "/register/resetPwdMess";
	});
	$("#loadimg").hide();
}

function getPar(par) {
	// 获取当前URL
	var local_url = document.location.href;
	// 获取要取得的get参数位置
	var get = local_url.indexOf(par + "=");
	if (get == -1) {
		return false;
	}
	// 截取字符串
	var get_par = local_url.slice(par.length + get + 1);
	// 判断截取后的字符串是否还有其他get参数
	var nextPar = get_par.indexOf("&");
	if (nextPar != -1) {
		get_par = get_par.slice(0, nextPar);
	}
	return get_par;
}
