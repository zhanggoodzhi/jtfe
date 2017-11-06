import './index.less';
// 密码显示和隐藏(html:在.cloud-input-content处加上.cloud-password，返回一个密码操作可视框，对外提供reset方法)
(function ($) {
	const pwdWrap = `
		<div class="input-group">
			<input class="c-password form-control" type="password" placeholder="请输入密码" aria-describedby="eye-pic">
			<span class="c-pwd-change input-group-addon" id="eye-pic">
				<div class="glyphicon glyphicon-eye-open eye-hide" aria-hidden="true"></div>
				<div class="glyphicon glyphicon-eye-close eye-show" aria-hidden="true"></div>
			</span>
		</div>
	`;

	// 内部绑定一个切换事件（对样式和属性进行操作）
	function changPwdVisibility() {
		const $changeBtn = $('.c-pwd-change');
		if ($changeBtn) {
			$changeBtn.on('click', () => {
				const $cInput = $('.c-password');
				const pwdType = $cInput.attr('type');
				$cInput.attr('type', pwdType === 'text' ? 'password' : 'text');
				const $pic = $('.c-pwd-change .glyphicon');
				$pic.each((v, e) => {
					const isShow = $(e).hasClass('eye-show');
					if (isShow) {
						$(e).addClass('eye-hide').removeClass('eye-show');
					} else {
						$(e).addClass('eye-show').removeClass('eye-hide');
					}
				});
			});
		}
	}

	$.fn.extend({
		'cPassword': function () {
			$(this).append($(pwdWrap));
			changPwdVisibility();
			// 对外提供一个初始化input的类型和操作眼睛的样式
			return {
				resetCPwd: function () {
					$('.c-pwd-change .glyphicon-eye-open').addClass('eye-hide').removeClass('eye-show');
					$('.c-pwd-change .glyphicon-eye-close').addClass('eye-show').removeClass('eye-hide');
					$('.c-password').attr('type', 'password');
				}
			};
		}
	});

})(jQuery);
