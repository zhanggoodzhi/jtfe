import './messageEdit.less';
import * as utils from 'utils';
import { Uploader } from 'upload';
let bigEl;
let oldHtml;
export function initMessageEdit() {
	init();
}
function init() {
	bigEl = $('#message-edit');
	utils.bindtabEvent('my-collect', () => {
		utils.setScroll();
	});
	initUpload();
	bindEvent();
	cloneHtml();
}
function cloneHtml() {
	oldHtml = bigEl.find('.user-form').clone();
}
function initUpload() {
	// new Uploader({
	// 	btn: bigEl.find('.head-icon-wrap .text'),
	// 	accept: '.jpg,.png',
	// 	url: '/resource/file/upload',
	// 	name: 'file',
	// 	params: {
	// 		type: 'voice'
	// 	},
	// 	success: (id, name, res) => {

	// 	}
	// });
}
function bindEvent() {
	bigEl.find('#edit-cancel').on('click', function () {
		bigEl.find('.user-form').replaceWith(oldHtml.clone());
		bindEvent();
	});
	bigEl.find('#edit-sure').on('click', function () {
		const id = bigEl.find('.account').data().id;
		const username = ($('#edit-username').val() as string).trim();
		const alias = ($('#edit-alias').val() as string).trim();
		const email = ($('#edit-email').val() as string).trim();
		const password = ($('#edit-password').val() as string).trim();
		const newPassword = ($('#edit-newPassword').val() as string).trim();
		const reNewPassword = ($('#edit-reNewPassword').val() as string).trim();
		const mobile = ($('#edit-mobile').val() as string).trim();
		const qq = ($('#edit-qq').val() as string).trim();
		const validateArr = [{
			name: alias,
			text: '用户名'
		}, {
			name: email,
			text: '邮箱'
		}, {
			name: password,
			text: '密码'
		}];
		for (let v of validateArr) {
			if (v.name === '') {
				utils.toast(v.text + '不能为空');
				return;
			}
		}
		if (email !== '' && !/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email)) {
			utils.toast('邮箱格式不正确');
			return;
		}
		if (mobile !== '' && !/^1[34578]\d{9}$/.test(mobile)) {
			utils.toast('手机号格式不正确');
			return;
		}
		if (qq !== '' && !/^[1-9][0-9]{4,}$/.test(qq)) {
			utils.toast('QQ格式不正确');
			return;
		}
		if (newPassword !== reNewPassword) {
			utils.toast('两次新密码输入不一致');
			return;
		}
		utils.confirmModal('确认要更新资料吗吗?', (remove, end) => {
			// const headIcons = $('#edit-alias').val().trim();
			$.ajax({
				url: '/api/member/user/update',
				method: 'PUT',
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify({
					id,
					alias,
					email,
					mobile,
					qq,
					oldPassword: password,
					password: newPassword,
					name: username
				}),
				success: () => {
					utils.toast('更新资料成功');
					remove();
				}
			});
		});
	});
}
