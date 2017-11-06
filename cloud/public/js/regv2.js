function alert_div(adv) {
	$("#phone_forget_button").css('display', 'block');
	$("#phone_forget_button")
			.html(
					"<span style='background:url() no-repeat -2px;display: inline-block;'>&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;"
							+ adv
							+ "&nbsp;&nbsp;&nbsp;<br><br><button type='button' onclick='close_pfb()' style='position:relative;background-color: #0095FF;border-color: #0095FF;color:#fff;float:right;margin-right:8px;'>关闭</button><br><div>&nbsp;</div>");
}

function login_error_cancel() {
	$("#login_error_d").css('display', 'none');
}

function close_pfb() {
	$("#phone_forget_button").css('display', 'none');
}

function do_reg() {
	var f = document.form;
	if (f.company.value === "") {
		new PNotify({
			title : '注册失败',
			text : '企业组织名称不能为空',
			type : 'warn'
		});
		f.company.focus();
		return false;
	}
	if (f.email.value === "") {
		new PNotify({
			title : '注册失败',
			text : '邮箱不能为空',
			type : 'warn'
		});
		f.email.focus();
		return false;
	} else {
		var eReg = /^[A-Za-z0-9_\.\-]{1,32}\@[A-Za-z0-9\-]{1,32}\.([A-Za-z]{1,4}|[A-Za-z]{1,4}\.[A-Za-z]{1,5})$/;
		if (!eReg.test(f.email.value)) {
			new PNotify({
				title : '注册失败',
				text : '电子邮箱格式不正确',
				type : 'warn'
			});
			f.email.focus();
			return false;
		}
		$.post(appName + "/register/isUniqueUserEmail", {
			'email' : $.trim(f.email.value)
		}, function(data) {
			if (data == "2") {
				new PNotify({
					title : '注册失败',
					text : '该邮箱已注册，请直接登录',
					type : 'warn'
				});
				f.email.focus();
				return false;
			}
		});
	}

	if (f.mobile.value === "") {
		new PNotify({
			title : '注册失败',
			text : '手机号不能为空',
			type : 'warn'
		});
		f.mobile.focus();
		return false;
	} else {
		var reg = /^0?(13[0-9]|15[012356789]|18[02356789]|14[57]|17[0678])[0-9]{8}$/;
		if (!reg.test(f.mobile.value)) {
			var reg = /^0?(170[059])[0-9]{7}$/;
			if (!reg.test(f.mobile.value)) {
				new PNotify({
					title : '注册失败',
					text : '请输入正确的手机号码',
					type : 'warn'
				});
				f.mobile.focus();
				return false;
			} else {
			}
		} else {
		}
		/**
		 * 手机唯一验证
		 */
		$.post(appName + "/register/isUniqueUserMobile", {
			'mobile' : $.trim(f.mobile.value)
		}, function(data) {
			if (data == "2") {
				new PNotify({
					title : '注册失败',
					text : '该手机已注册，请直接登录',
					type : 'warn'
				});
				f.mobile.focus();
				return false;
			}
		});

	}
	if (f.pwd.value === "") {
		new PNotify({
			title : '注册失败',
			text : '密码不能为空',
			type : 'warn'
		});
		f.pwd.focus();
		return false;
	}
	if (f.pwd.value.length < 6) {
		new PNotify({
			title : '注册失败',
			text : '密码不能小于6位',
			type : 'warn'
		});
		f.pwd.focus();
		return false;
	}
	if (f.agpwd.value === "") {
		new PNotify({
			title : '注册失败',
			text : '确认密码不能为空',
			type : 'warn'
		});
		f.agpwd.focus();
		return false;
	}
	if (f.agpwd.value.length < 6) {
		new PNotify({
			title : '注册失败',
			text : '确认密码不能为空',
			type : 'warn'
		});
		f.agpwd.focus();
		return false;
	}
	if (f.agpwd.value !== f.pwd.value) {
		new PNotify({
			title : '注册失败',
			text : '密码不一致',
			type : 'warn'
		});
		f.agpwd.focus();
		return false;
	}

	var regData = {
		company : $('input[name="company"]').val(),
		email : $('input[name="email"]').val(),
		mobile : $('input[name="mobile"]').val(),
		pwd : $('input[name="pwd"]').val(),
		alias : $('input[name="alias"]').val(),
		qq : $('input[name="qq"]').val()
	};

	$.post(appName + "/register/doUuserRegister", regData, function(data) {
		if (data == "0") {
			new PNotify({title : '注册失败',text : '系统异常,请与系统管理员联系!',type : 'warn'});
		} else if (data == "13") {
			new PNotify({title : '注册失败',text : '该企业名称已经被注册过',type : 'warn'});
		} else if (data == "14") {
			new PNotify({title : '注册失败',text : '无效的邮箱地址',type : 'warn'});
		} else if (data == "141") {
			new PNotify({title : '注册失败',text : '该邮箱帐户已被注册。',type : 'warn'});
		} else if (data == "12") {
			new PNotify({title : '注册失败',text : '有效的密码必须多于6位且少于20位的字母加数字的组合',type : 'warn'});
		} else if (data == "15") {
			new PNotify({title : '注册失败',text : '请输入正确的手机号码',type : 'warn'});
		} else if (data == "151") {
			new PNotify({title : '注册失败',text : '该手机账号已注册11。',type : 'warn'});
		} else if (data == "16") {
			new PNotify({title : '注册失败',text : '请输入真实的QQ。',type : 'warn'});
		} else if (data == "99") {
			new PNotify({title : '注册失败',text : '填写的邮箱地址不存在。',type : 'warn'});
		} else if (data == "1") {
			$("#login_reg").css('display', 'block');
		}
	});
}
