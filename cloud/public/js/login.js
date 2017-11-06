/**
 * 初始加载
 */
$(document)
		.ready(
				function() {
					var userhidden=$("#userhidden").val();
					if(userhidden!=""){
						$("#username").val(userhidden);
					}
					var passHidden=$("#passHidden").val();
					if(passHidden!=""){
						if ($("#passwordShow").text() == '密码') {
							$("#passwordShow").text('');
						}
						$("#password").val(passHidden);
					}
					$("#username").focus(
							function() {
								if ($(this).val() == '用户名/邮箱/手机号') {
									$(this).val('');
								}
//								$(this)
//								.attr('style',"height:38px;padding-left:34px;background:url('images/small_icon/contacts.png') no-repeat 8px; color:#000");
							});
					$("#username")
							.blur(
									function() {
										if ($(this).val() == '') {
//											$(this).val('用户名/邮箱/手机号');
										}
										;
//										$(this)
//												.attr('style',"height:38px;padding-left:34px;background:url('images/small_icon/contacts.png') no-repeat 8px; color:#999");
										check_username($(this).val());
									});

					$("#password").focus(
							function() {
								$("#passwordShow").text("");
								if ($(this).val() == '密码') {
									$(this).val('');
									$('#passwordShow').show();
								}
//								$(this).attr('style',
//										'border:1px solid #888; color:#000;');
							});
					$("#password")
							.blur(
									function() {
										$("#passwordShow").text("密码");
										if ($(this).val() == '') {
											$('#passwordShow').show();
										}
										;
//										$(this)
//												.attr('style',
//														'border:1px solid #B3B3B3; color:#999');
										check_pass($(this).val());
									});
					$("#verification")
							.focus(
									function() {
										if ($(this).val() == '验证码') {
											$(this).val('');
										}
										$(this)
												.attr('style',
														'border:1px solid #888; color:#000;width:100px');
									});
					$("#verification")
							.blur(
									function() {
										if ($(this).val() == '') {
											$(this).val('验证码');
										}
										$(this)
												.attr('style',
														'border:1px solid #B3B3B3; color:#999;width:100px');
										check_yzm($(this).val());
						
									});
				});
/**
 * error 提示
 * 
 * @param str
 * @returns {String}
 */
function call_error(str) {

	return '<div class="wrong_info" ><img src="' + appName
			+ '/images/ico_w.gif" style="vertical-align:-4px;" > ' + str
			+ '</div>';
}
/**
 * 用户验证
 * 
 * @param val
 * @returns {Boolean}
 */
function check_username(val) {
	val = val.replace(/(^\s*)|(\s*$)/g, "");
	if (val == '用户名/邮箱/手机号' || val == '') {
		$('#ErrorTip').show();
		$('#ErrorTip').html(call_error('重新输入账户'));
		return false;
	}

	if (val.length <= 2) {
		$('#ErrorTip').show();
		$('#ErrorTip').html(call_error('用户名错误'));
		return false;
	}
	return true;
}
/**
 * 密码验证
 * 
 * @param val
 * @returns {Boolean}
 */
function check_pass(val) {
	if (val == '') {
		$('#ErrorTip').show();
		$('#ErrorTip').html(call_error('请输入密码'));
		return false;
	}
	if (val.length < 6) {
		$('#ErrorTip').show();
		$('#ErrorTip').html(call_error('密码错误'));
		$("#passwordShow").text("");
		return false;
	}
	$('#ErrorTip').hide();
	$('#ErrorTip').html('');
	$("#passwordShow").text("");

	return true;
}
/**
 * 验证码验证
 * @param val
 * @returns {Boolean}
 */
function check_yzm(val) {
    if (!$('#verification').attr('disabled')) {
        if (val.length < 4) {
            $('#ErrorTip').show();
            $('#ErrorTip').html(call_error('验证码错误'));
            return false;
        }
        var msg = false;
        $.post(appName + "/login/ValidateCodeImage", {
    		'code' : val
    	}, function(data) {
            if (data == "0") {
            	 $('#ErrorTip').show();
                 $('#ErrorTip').html(call_error('验证码错误'));
            } else if (data == "2") {
                $('#ErrorTip').show();
                $('#ErrorTip').html(call_error('验证码已过期'));
                $('#yzcode').trigger('click');

            } else if(data=="3"){            	
                $('#ErrorTip').show();
                $('#ErrorTip').html(call_error('验证码不正确'));
            }else{
            	 msg = true;
            }
    	});
        if (!msg) {
            return false;
        } else {
            $('#ErrorTip').hide();
            $('#ErrorTip').html('');
            return true;
        }
    } else {
        return true;
    }
}

