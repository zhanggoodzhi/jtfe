import './index.less';
import * as tables from 'new-table';
import * as utils from 'utils';
import 'script-loader!bootstrap-validator/dist/validator.min.js';
declare const appName;
declare const userName;
$(document).ready(function () {
	init();
	 $.ajaxSetup({
		 error:()=>{

		 }
	 });
});
function init() {
	$('#form').validator({
		custom: {
			length: function (el) {
				if (!/^\S{6,20}$/.test(el.val())) {
					return '密码格式为6 ~ 20位';
				}
			}
			// checkOld: function (el) {
			// 	const val = el.val();
			// 	let type;
			// 	$.ajax({
			// 		url: appName + '/user/isUniqueUserPwd',
			// 		method: 'POST',
			// 		async: false,
			// 		data: {
			// 			username: userName,
			// 			oldPwd: $.trim(el.val())
			// 		}
			// 	}).done((data) => {
			// 		type = data;
			// 	});
			// 	if (!type) {
			// 		return '网络错误';
			// 	} else if (type === '0') {
			// 		return '已超时，请重新登录。';
			// 	} else if (type === '2') {
			// 		return '旧密码输入错误。';
			// 	} else {
			// 		return '填写正确。';
			// 	}
			// }
		}
	});
	$('#save').on('click', function () {
		if ($(this).hasClass('disabled')) {
			return;
		}
		$.ajax({
			url: appName + '/user/updateUserPwd',
			method: 'POST',
			data: {
				username: userName,
				pwdNew: $('#new').val(),
				pwdOld: $('#old').val()
			}
		}).done((data) => {
			if (data === '1') {
				utils.alertMessage('修改密码成功', true);
				history.back();
			} else if (data === '0') {
				utils.alertMessage('修改密码失败', false);
			} else if (data === '3') {
				utils.alertMessage('请输入旧密码', false);
			} else if (data === '4') {
				utils.alertMessage('旧密码错误', false);
			} else if (data === '12') {
				utils.alertMessage('请输入正确的新密码 6-20个字母+数字', false);
			} else if (data === '5') {
				utils.alertMessage('已超时，请重新登录', false);
			}
		});
		return false;
	});
	$('#return').on('click', function () {
		history.back();
	});
}

