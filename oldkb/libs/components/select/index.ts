import "script-loader!select2/dist/js/select2.full.min.js";
import "script-loader!select2/dist/js/i18n/zh-CN.js";
import "select2/dist/css/select2.min.css";
import "./index.less";

(function () {
	($.fn.select2 as any).defaults.set('language', 'zh-CN');

	($.fn.select2 as any).amd.require._defined['select2/selection/search'].prototype.resizeSearch = function () {
		this.$search.css('width', '25px');

		let width = '';

		if (this.$search.attr('placeholder') !== '') {
			width = this.$selection.find('.select2-selection__rendered').innerWidth();
		} else {
			const minimumWidth = this.$search.val().length + 1;

			width = (minimumWidth * 1.1) + 'em';
		}

		this.$search.css('width', width);
	};
}());
