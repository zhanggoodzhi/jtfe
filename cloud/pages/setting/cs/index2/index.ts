import * as utils from 'utils';

interface IItem {
	title: string;
	options: Array<{
		label: string;
		value: number;
		info?: string;
	}>;
}



const form = $('#form');
const radioArea = $('#radio-area');
const greetings = $('#greetings');
const btn = $('#edit-greetings-btn');

const radioItems: { [key: string]: IItem } = {
	isMessage: {
		title: '留言功能是否开启',
		options: [{
			label: '开启',
			value: 0
		}, {
			label: '关闭',
			value: 1
		}]
	},
	serviceMode: {
		title: '服务模式',
		options: [{
			label: '仅智能客服模式',
			value: 1,
			info: '不启用人工客服，所有会话全都由机器人客服进行回复'
		}, {
			label: '仅人工客服模式',
			value: 2,
			info: '不启用智能机器人客服，所有会话全部接入人工客服'
		}, {
			label: '智能客服+人工客服模式',
			value: 3,
			info: '同时启用机器人和人工客服，访客发起对话后优先接入机器人，同时由访客自主选择是否要转接人工客服'
		}]
	}
};

function fillConfig() {
	$.post('setting/cs/getAppServiceMode')
		.done(res => {
			if (!res.error) {
				const data = res.data;

				greetings.val(data.greetings);

				radioArea.html(Object.keys(radioItems).map(key => {
					const item = radioItems[key];
					return `
					<div class="form-group">
					<label>${item.title}</label>
					${item.options.map(
							op =>
								`<div class="radio">
									<label>
										<input type="radio" name="${key}" value="${op.value}" ${op.value === data[key] ? 'checked' : ''}/>
										${op.label}
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										${op.info || ''}
									</label>
								</div>`
						).join('')}
					</div>
					`;

				}).join(''));
			}
		});
}


function updateConfig(data) {
	const originData = form.serializeArray().reduce((result, item) => {
		result[item.name] = item.value;
		return result;
	}, {});

	const greet = greetings.val().trim();

	Object.assign(originData, {
		greetings: greet
	});

	return $.ajax('setting/cs/appServiceMode', {
		method: 'POST',
		data: Object.assign(originData, data)
	})
		.done(res => {
			if (res.error) {
				fillConfig();
			}
			utils.alertMessage(res.msg, !res.error);
		});
}



btn.on('click', () => {
	const save = !greetings.prop('readonly');
	if (save) {
		const value = greetings.val().trim();
		if (!value) {
			utils.alertMessage('人工客服欢迎语不能为空');
			return;
		}
		const end = utils.loadingBtn(btn);
		const cb = () => end();

		updateConfig({ greetings: value })
			.then((res) => {
				if (!res.error) {
					fillConfig();
					greetings.prop('readonly', true);
					btn.html('编辑');
				}
				cb();
			});
	} else {
		greetings.prop('readonly', false);
		btn.html('保存');
	}
	// $('#editor-modal').modal('show');
});

// $('#editor-modal').one('shown.bs.modal', () => {
// 	const el = $('#editor');
// 	const html = el.html();

// 	el.empty();

// 	const edt = new wangEditor(el);

// 	edt.create();

// 	el.html(html);

// 	$('#editor-yes-btn').on('click', () => {
// 		const value = $('#editor').html();
// 		if (!$('#editor').text().trim()) {
// 			utils.alertMessage('人工客服欢迎语不能为空');
// 			return;
// 		}
// 		const end = utils.loadingBtn($('#editor-yes-btn'));
// 		const cb = () => end();

// 		updateConfig({ greetings: value })
// 			.then((res) => {
// 				if (!res.error) {
// 					fillConfig();
// 					$('#editor-modal').modal('hide');
// 				}
// 				cb();
// 			});
// 	});
// });


form.on('change', 'input:radio', (e) => {
	const radio = $(e.currentTarget),
		name = radio.prop('name'),
		value = radio.val();

	updateConfig({ [name]: value });
});



fillConfig();
