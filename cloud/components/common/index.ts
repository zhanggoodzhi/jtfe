import 'core-js/shim';
import 'script-loader!jquery';
import 'script-loader!bootstrap/dist/js/bootstrap.min.js';
import 'script-loader!pnotify/dist/pnotify.js';
import 'script-loader!pnotify/dist/pnotify.buttons.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'pnotify/dist/pnotify.css';
import 'pnotify/dist/pnotify.buttons.css';
import 'font-awesome/less/font-awesome.less';
import * as utils from 'utils';
import 'custom/custom.css';
import './index.less';
import 'custom-style';
import 'cPassword';
window.onload = function () {
	$('.disable_click').remove();
};
(function () {
	initJQuery();
	initElement();
	initMenu();
}());

function initMenu() {
	let lastTime = null;
	const menuList = $('#cloud-menu-list');
	$('#cloud-menu-list').on('click', '.cloud-menu-group-title', (e) => {
		const currentTime = new Date().getTime(),
			el = $(e.currentTarget),
			menu = el.next('.cloud-menu-group'),
			toggle = () => {
				if (el.hasClass('active')) {
					el.removeClass('active');
					menu.slideUp();
				}
				else {
					menuList.find('.active').removeClass('active')
						.next('.cloud-menu-group').slideUp();
					el.addClass('active');
					menu.slideDown();
				}
			};
		if (!lastTime) {
			lastTime = new Date().getTime();
			toggle();
		}
		else if (currentTime - lastTime < 300) {
			return;
		}
		else {
			lastTime = new Date().getTime();
			toggle();
		}

	});

	const body = $('body');

	initScreenWidth();
	let timer = null;
	$(window).on('resize', function(){
		timer && clearTimeout(timer);
		timer = setTimeout(initScreenWidth,100);
	});
	function initScreenWidth(){
		let screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
		if (screenWidth <= 768) {
			body.removeClass('nav-md').addClass('nav-sm');
			menuList.find('.cloud-menu-group').hide();
		} else {
			body.removeClass('nav-sm').addClass('nav-md');
		}
	}

	$('#menu_toggle').on('click', () => {
		if (body.hasClass('nav-md')) {
			body.removeClass('nav-md').addClass('nav-sm');
		} else {
			body.removeClass('nav-sm').addClass('nav-md');
		}

	});
}

function initJQuery() {
	const map = {};
	utils.useIcon();
	jQuery.ajaxSetup({
		dataFilter: utils.bigNumber2String,
		error: (err) => {
			if (err.status !== 0) {
				utils.alertMessage(`系统错误, 请刷新页面后重试或联系管理员\n错误信息:${err.statusText}\n错误状态码:${err.status}`);
			}
		}
	});

	jQuery.ajaxPrefilter((options, originalOptions, jqXHR) => {
		if (options.abortOnRetry) {
			const name = options.url + options.method;
			if (map[name]) {
				map[name].abort();
			}
			map[name] = jqXHR;
		}
	});
}

function initElement() {
	utils.setScrollHeight();

	$(document).on('change', 'input[type="number"],input.input-number', (e) => {
		const el = $(e.currentTarget),
			val = el.val().trim(),
			max = el.prop('max'),
			min = el.prop('min');
		let target: string;
		if (val === '') {
			if (min !== undefined) {
				target = min;
			}
			else {
				target = '';
			}
		}
		else {
			const currentNumber = Number(val);

			if (max !== '' && currentNumber > Number(max)) {
				target = max;
			}
			else if (min !== '' && currentNumber < Number(min)) {
				target = min;
			}
			else {
				return;
			}
		}
		el.val(target);
	})
		.on('input', 'input.input-english', (e) => {
			const el = $(e.currentTarget),
				val = el.val().trim();
			if (val !== '') {
				const currentVal = val.replace(/[^a-zA-Z0-9_]/g, '');
				if (currentVal === val) {
					return;
				}
				el.val(currentVal);
			}
		})
		.on('shown.bs.tab', () => {
			utils.setScrollHeight();
		});

	$('#right_col').css('minHeight', window.innerHeight - 5);

	if ($('[autofocus]').length < 1) {
		$('input[type="text"]:first').blur().focus();
	}
}




