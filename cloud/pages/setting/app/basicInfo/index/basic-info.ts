import * as utils from 'utils';
declare const radioList: Array<any>;


interface IInfoSubmitData {
	robotName?: string;
	guide?: string;
	clientStyle?: number;
	recomQuestionDisplay?: number;
	isOpen?: number;
	faqExpandDisplay?: number;
	ishelpfulDisplay?: number;
	quickAccessStyle?: number;
	timeoutMsg?: string;
	feedbackMsg?: string;
	useHumanServicer?: string;
	useCoreference?: string;
	useDialogModel?: string;
	useMisspellCorrect?: string;
	useCustomizedMisspell?: string;
	noanswerMsg?: string;
	useNoanswerHuman?: string;
	noanswerTimes?: string;
	timeoutLength?: string;
}

initCorpper();

for (let v of $('#info-form-wrap input:radio').toArray()) {
	const el = $(v);
	if (el.prop('value') === el.attr('data-value')) {
		el.prop('checked', true);
	}
}

Array.prototype.forEach.call($('.base-editor'), (v) => {
	const el = $(v);
	const editor = new wangEditor(v);

	editor.create();

	editor.$txt.html(el.data('html'));
});


$('#info-save-btn').on('click', () => {
	const infoSubmitData: IInfoSubmitData = {};
	const allElement = $('#info-form-wrap input');

	for (let v of $('.base-editor').toArray()) {
		const el = $(v),
			html = el.html().trim(),
			text = utils.formatText(html),
			name = el.data('name');

		if (text && name) {
			infoSubmitData[name] = html;
		}
	}

	for (let v of radioList) {
		const val = $.trim(allElement.filter(v.el).val());
		if (val === '') {
			if (v.require) {
				utils.alertMessage(`${v.text}不能为空`);
				return;
			}
			else {
				continue;
			}

		}
		infoSubmitData[v.valName] = val;
	}

	const end = utils.loadingBtn($('#info-save-btn'));

	$.ajax({
		url: 'setting/app/basicInfo/update',
		type: 'POST',
		data: infoSubmitData,
		success: (msg) => {
			utils.alertMessage(msg.msg, !msg.error);
		},
		complete: () => {
			end();
		}
	});
});


for (let v of $('.page-style').toArray()) {
	const el = $(v),
		src = `images/frontStyle/${el.data('type')}.jpg`;
	new Image().src = src;
	el.tooltip({
		html: true,
		container: '#info-form-wrap',
		title: `<img src="${src}"/>`,
		trigger: 'hover',
		delay: 200
	});
}


function initCorpper() {
	const cropper = $('#cropper-image').cropper({
		aspectRatio: 1,
		viewMode: 1,
		dragMode: 'move',
		preview: '.cropper-preview',
		minContainerHeight: 400,
		zoomOnTouch: false
	});
	let headEl: JQuery;
	$('#info-form-wrap').on('click', '.cropper', function () {
		const el = $('<input type="file" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" />');
		headEl = $(this);
		el.one('change', function () {
			if (!this.value || !this.files || this.files.length !== 1) {
				return;
			}
			const file = this.files[0];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				showCropper();
				cropper.cropper('replace', (e.currentTarget as any).result);
			};
		});

		el.click(); // IE弹窗会阻塞页面,一定要放在绑定事件之后

	});

	$('#cancel-btn').on('click', hideCropper);

	$('#crop-btn').on('click', () => {
		if (!headEl) {
			return;
		}
		const loading = utils.loadingBtn($('#crop-btn'));
		cropper.cropper('getCroppedCanvas', {
			width: 80,
			height: 80
		}).toBlob((blob) => {
			const data = new FormData(),
				elData = headEl.data();
			data.append(elData.name, blob);
			$.ajax({
				url: elData.url,
				type: 'POST',
				data: data,
				processData: false,
				contentType: false,
				success: (msg) => {
					if (!msg.error) {
						headEl.prop('src', msg.msg);
						if (elData.changeHeadSrc) {
							$('.cloud-heading-image').prop('src', msg.msg);
						}
						hideCropper();
						utils.alertMessage('修改成功', true);
					}
					else {
						utils.alertMessage(msg.msg);
					}
				},
				complete: () => {
					loading();
				}
			});
		});
	});
}

function showCropper() {
	$('#info-form-wrap').hide();
	$('#cropper-wrap').show();
}

function hideCropper() {
	$('#info-form-wrap').show();
	$('#cropper-wrap').hide();
}
