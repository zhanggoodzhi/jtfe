import * as  utils from 'utils';
import './index.less';
// import * as debounce from 'lodash/debounce.js';

namespace SuperadminFieldQa_settingIndex {
	declare const switchItems: {
		[key: string]: string;
	};
	declare const thresholdItems: {
		[key: string]: string;
	};

	$(init);


	function init() {
		if (!$.isEmptyObject(switchItems)) {
			for (let key in switchItems) {
				$(`[name='${key}'][value='${switchItems[key]}']`)
					.prop('checked', true);
			}
		}
		if (!$.isEmptyObject(thresholdItems)) {
			for (let key in thresholdItems) {
				$(`[name='${key}']`)
					.val(thresholdItems[key]);
			}
		}

		$(document).on('change', 'input', utils.debounce(
			(e) => {
				const input = $(e.currentTarget),
					val = input.val().trim();

				if (val !== '') {
					const name = input.prop('name'),
						text = input.closest('.form-group').data('name'),
						group = input.data('group');
					$.ajax(`superadmin/qa_setting/${group}`, {
						type: 'POST',
						contentType: 'application/json',
						data: JSON.stringify([{
							key: name,
							value: val
						}])
					})
						.done((res) => {
							if (!res.error) {
								utils.alertMessage(`保存「${text}」成功`, true);
							} else {
								utils.alertMessage(res.msg, !res.error);
							}
						})
						.fail(() => {
							utils.alertMessage(`保存「${text}」失败`);
							setTimeout(() => {
								location.reload();
							}, 1000);
						});
				}
			}, 300)
		);
	}


}
