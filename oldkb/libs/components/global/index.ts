// style
import "material-design-icons/iconfont/material-icons.css";
import "materialize-css/css/materialize.css";
import "./index.less";
// script
import "core-js";
import "script-loader!jquery";
import "script-loader!materialize-css";
import * as utils from "utils";

// $(() => {
initMaterialPulgin();
initGlobal();
utils.setScroll();
utils.triggerOnceWithinDelay($(window), 'resize', utils.setScroll);
// });

function initMaterialPulgin() {
	utils.initDatePicker();
	utils.initSelect();
}

function initGlobal() {
	const menu = $('#user-center-menu'),
		overlay = $('<div class="kb-overlay shadow"></div>');

	$(document.body).append(overlay);

	$('#user-center-icon').parent().on('click', () => {
		menu.toggleClass('show');
		overlay.toggleClass('show');
	});

	overlay.on('click', () => {
		menu.removeClass('show');
		overlay.removeClass('show');
	});

	Array.prototype.forEach.call($('select'), (v) => {
		const el = $(v);
		if (el.parent('.select-wrapper').length <= 0) {
			el.material_select();
		}
	});
	// 左侧菜单个人中心小红点
	utils.initLeftRedDot();


	// $(document).on('click', (e) => {
	// 	if (menu.hasClass('show')) {
	// 		const el = $(e.target);
	// 		if (el.parents('.user-center').length <= 0) {
	// 			menu.removeClass('show');
	// 		}
	// 	}

	// });
}


(function ($) {
	$.extend(($.fn.pickadate as any).defaults,
		{
			// The title label to use for the month nav buttons
			labelMonthNext: '下个月',
			labelMonthPrev: '三个月',

			// The title label to use for the dropdown selectors
			labelMonthSelect: '请选择月',
			labelYearSelect: '请选择年',

			// Months and weekdays
			monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthsShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
			weekdaysFull: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

			// Materialize modified
			weekdaysLetter: ['日', '一', '二', '三', '四', '五', '六'],

			// Today and clear
			today: '今天',
			clear: '清除',
			close: '确定',

			// The format to show on the `input` element
			format: 'yyyy - mm - dd'
		});

	$.ajaxSetup({
		statusCode: {
			'403': () => {
				window.location.assign('/');
			}
		},
		error: (xhr) => {
			if (xhr.status === 0) {
				utils.toast('网络错误');
			} else if (xhr.status !== 200) {
				utils.toast(xhr.responseJSON.message);
			}
		}
	});
}(jQuery));



