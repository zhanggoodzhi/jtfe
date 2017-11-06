//右下角弹出框;
function slide(data) {
	jQuery.messager.show({
		title : '温馨提示:',
		msg : data,
		timeout : 5000,
		showType : 'slide'
	});
}

function loginbk() {
	window.top.location.href = appName+"/tologin";
}

function userPwdbk() {
	window.location.href = "user/pwd";
}
/**
 * 修改用户基本信息
 * 
 * @returns {Boolean}
 */
function btnUserInfo() {
	if (!(formUpdateUserName && formUpdateUserNickname() && formUpdateUserMobile())) {
		return false;
	}
	$.post(appName + "/user/updateUserInfo", {
		'mobile' : $("#mobile").val(),
		'nickname' : $("#nickname").val(),
		'userName':$("#userName").val(),
		'qq' : $("#qq").val()
	}, function(data) {
		if (data == "1") {
			jQuery.messager.alert('提示:', "修改用户信息成功", 'info');
		} else if (data == "0") {
			jQuery.messager.alert('提示:', "修改用户信息失败", 'error');
		} else if (data == "5") {
			slide("已超时，请重新登录");
		} else if (data == "13") {
			$("#nickname").val("");
			jQuery.messager.alert('提示:', "请输入真实的联系人 数字无效", 'warning');
		} else if (data == "15") {
			$("#mobile").val("");
			jQuery.messager.alert('提示:', "请输入正确的手机号码 支持号码1[3458]", 'warning');
		} else if (data == "151") {
			$("#mobile").val("");
			jQuery.messager.alert('提示:', "该手机号已存在", 'warning');
		} else if (data == "152") {
			$("#userName").val("");
			jQuery.messager.alert('提示:', "该账户已存在", 'warning');
		} else if (data == "16") {
			$("#qq").val("");
			jQuery.messager.alert('提示:', "请输入真实的QQ", 'warning');
		}
	});
}

/**
 * 修改密码
 * 
 * @returns {Boolean}
 */
function btnUserPwd() {
	if (!(formValidateOldPwd() && formNewPwd() && formConfirmNewPwd())) {
		return false;
	}
	$.post(appName + "/user/updateUserPwd", {
		'username' : $("#usernameHidden").val(),
		'pwdNew' : $("#newPwd").val(),
		'pwdOld' : $("#oldPwd").val()
	}, function(data) {
		if (data == "1") {
			$("#oldPwd").val("");
			$("#newPwd").val("");
			$("#confirmNewPwd").val("");
			jQuery.messager.alert('提示:', "修改密码成功", 'info');
		} else if (data == "0") {
			$("#oldPwd").val("");
			$("#newPwd").val("");
			$("#confirmNewPwd").val("");
			jQuery.messager.alert('提示:', "修改密码失败", 'error');
		} else if (data == "3") {
			$("#oldPwd").val("");
			jQuery.messager.alert('提示:', "请输入旧密码", 'warning');
		} else if (data == "4") {
			$("#oldPwd").val("");
			$("#newPwd").val("");
			$("#confirmNewPwd").val("");
			jQuery.messager.alert('提示:', "请输入旧密码错误", 'warning');
		} else if (data == "12") {
			$("#newPwd").val("");
			jQuery.messager.alert('提示:', "请输入正确的新密码 6-20个字母+数字", 'warning');
		} else if (data == "5") {
			slide("已超时，请重新登录");
			// window.location.href="login";
		}
	});
}

/**
 * 旧密码
 * 
 * @returns {Boolean}
 */
function formOldPwd(callFunc) {
	var $this = $("#oldPwd");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的旧密码。");
		return false;
	}
	if (callFunc != undefined) {
		callFunc();
	} else {
		showHint($this, 2, "填写正确");
		return true;
	}
}
function formValidateOldPwd() {
	var $this = $("#oldPwd");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的旧密码。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}
/**
 * 验证旧密码是否正确
 */
function checkOldPwd() {
	var $this = $("#oldPwd");
	$.post(appName + "/user/isUniqueUserPwd", {
		'username' : $.trim($("#usernameHidden").val()),
		'oldPwd' : $.trim($this.val())
	}, function(data) {
		if (data == "0") {
			showHint($this, 3, "已超时，请重新登录。");
			return false;
		} else if (data == "2") {
			showHint($this, 3, "旧密码输入错误。");
			return false;
		} else {
			showHint($this, 2, "填写正确");
			return true;
		}

	});
}
/**
 * 新密码
 * 
 * @returns {Boolean}
 */
function formNewPwd() {
	var $this = $("#newPwd");
	if ($this.is(':hidden')) {
		return true;
	}
	if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的新密码。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}
/**
 * 新密码确认
 * 
 * @returns {Boolean}
 */
function formConfirmNewPwd() {
	var $this = $("#confirmNewPwd");
	if ($this.is(':hidden')) {
		return true;
	}
	if ($this.val() == '') {
		showHint($this, 3, "密码不能为空。");
		return false;
	} else if (!regTest($this.val(), 'password')) {
		showHint($this, 3, "请输入6到20个字符的新密码。");
		return false;
	} else if ($this.val() !== $("#newPwd").val()) {
		showHint($this, 3, "两次输入的新密码不一致。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}
/**
 * 用户修改 昵称验证
 * 
 * @returns {Boolean}
 */
function formUpdateUserNickname() {
	var $this = $("#nickname");
	if ($this.is(':hidden')) {
		return true;
	}
	if ($.trim($this.val()) == '') {
		showHint($this, 3, "请输入昵称。");
		return false;
	}
	showHint($this, 2, "填写正确");
	return true;
}
/**
 * 用户修改 手机号
 * 
 * @param callFunc
 * @returns {Boolean}
 */
function formUpdateUserName() {
	var $this = $("#userName");
	if ($this.is(':hidden')) {
		return true;
	}
	showHint($this, 2, "填写正确");
	return true;
}
function formUpdateUserMobile() {
	var $this = $("#mobile");
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


/**
 * 用户名唯一验证
 */
function checkUpdateUserName() {
	var $this = $("#userName");
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

function checkUpdateUserMobile() {
	var $this = $("#mobile");
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
