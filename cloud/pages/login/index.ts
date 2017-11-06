import 'primary';
import * as utils from 'utils';
import './index.less';
namespace Login {
	$(init);
	function init() {
		const codeImage = $('#code-img'),
			form = $('#login-form');
		codeImage.on('click', () => {
			const src = codeImage.prop('src');
			$('#code-img').prop('src', src.replace(/\?\d+$/, `?${new Date().getTime()}`));
		});

		form.on('submit', (e) => {
			for (let v of form.serializeArray()) {
				if (v.value === '') {
					const input = $(`input[name=${v.name}]`);
					utils.alertMessage(`${input.prop('placeholder')}不能为空`);
					e.preventDefault();
					return false;
				}
			}
		});
	}
}
