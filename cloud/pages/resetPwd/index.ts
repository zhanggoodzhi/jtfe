import * as utils from 'utils';
import * as tables from 'new-table';
import './index.less';
import 'primary';
import 'script-loader!bootstrap-validator/dist/validator.min.js';
declare const username;
declare const activieId;
namespace ResetPwdIndex {
	$(() => {
		if (username) {
			next();
			next();
			$('#user').val(username);
		}
		init();
	});
	function init() {
		$('#form3').validator({
			custom: {
				length: function (el) {
					if (!/^\S{6,20}$/.test(el.val())) {
						return '密码格式为6 ~ 20位';
					}
				}
			}
		});
		bindEvent();
	}
	function bindEvent() {
		$('#next1').on('click', function () {
			if ($(this).hasClass('disabled')) {
				return;
			}
			const endLoading = utils.loadingBtn($(this));
			$.ajax({
				url: 'register/isEmailPWD',
				method: 'POST',
				data: {
					email: $('#email').val()
				}
			}).done((data) => {
				if (!data.error) {
					next();
				}
				utils.alertMessage(data.msg, !data.error);
				endLoading();
			});
			return false;
		});
		$('#next3').on('click', function () {
			if ($(this).hasClass('disabled')) {
				return;
			}
			const endLoading = utils.loadingBtn($(this));
			$.ajax({
				url: 'register/updateResetPwd',
				method: 'POST',
				data: {
					activeId: activieId,
					password: $('#old-password').val().trim()
				}
			}).done((data) => {
				if (!data.error) {
					next();
				}
				utils.alertMessage(data.msg, !data.error);
				endLoading();
			});
			return false;
		});
	}
	function next() {
		let index;
		const bigEl = $('.reset-container');
		const circleArr = $('.wizard_steps').find('a').toArray();
		circleArr.forEach((v) => {
			const el = $(v);
			if (el.hasClass('selected')) {
				index = Number(el.find('.step_no').text());
				return;
			}
		});
		const nextIndex = index + 1;
		circleArr.forEach((v, i) => {
			const el = $(v);
			if (i + 1 < nextIndex) {
				el.removeClass('disabled').removeClass('selected').addClass('done');
			} else if (i + 1 === nextIndex) {
				el.removeClass('disabled').removeClass('done').addClass('selected');
			} else {
				el.removeClass('done').removeClass('selected').addClass('disabled');
			}
		});
		$(`#form${nextIndex}`).show().siblings('.step-form').hide();
	}
}
