import './index.less';
import * as tables from 'new-table';
import * as utils from 'utils';
import 'script-loader!wizard/jquery.smartWizard.js';
namespace Weixinv2Qaconnection {
	$(document).ready(function () {
		init();
	});
	function init() {
		// Smart Wizard
		$('#wizard').smartWizard({
			enableFinishButton: false,
			labelNext: '下一步', // label for Next button
			labelPrevious: '上一步', // label for Previous button
			cycleSteps: false,
			enableAllSteps: true,
			includeFinishButton: false,
			onShowStep: function () {
				height();
			}
		});
		$('#wizard_verticle').smartWizard({
			transitionEffect: 'slide'
		});
		height();
		const publicEl = $('#public');
		const enterpriseEl = $('#enterprise');
		publicEl.find('.get').on('click', function () {
			gainPublic('pub');
		});
		publicEl.find('.copy1').on('click', function () {
			copyToClipboard('pub-wxurl');
		});
		publicEl.find('.copy2').on('click', function () {
			copyToClipboard('pub-wxtoken');
		});
		enterpriseEl.find('.get').on('click', function () {
			gainPublic('ent');
		});
		enterpriseEl.find('.copy1').on('click', function () {
			copyToClipboard('ent-wxurl');
		});
		enterpriseEl.find('.copy2').on('click', function () {
			copyToClipboard('ent-wxtoken');
		});
		enterpriseEl.find('.copy3').on('click', function () {
			copyToClipboard('ent-EncodingAESKey');
		});
	}

	function copyToClipboard(inputname) {
		let urlField = document.querySelector('#' + inputname);
		// select the contents
		(urlField as any).select();
		document.execCommand('copy'); // or 'cut'
	}

	function height() {
		let screenHeight = window.innerHeight;
		let h = $('.x_panel').outerHeight(true) + $('footer').outerHeight(true) + $('.nav_menu').outerHeight(true) + 16;
		if (h > screenHeight) {
			$('.left_col').css('height', h + 'px');
			$('.right_col').css('height', h + 'px');
			$('.main_container').css('height', h + 'px');
			$('.container').css('height', h + 'px');
			$('body').css('height', h + 'px');
		} else {
			$('.left_col').css('height', '100%');
			$('.right_col').css('height', '100%');
			$('.main_container').css('height', '100%');
			$('.container').css('height', '100%');
			$('body').css('height', '100%');
		}
	}
	// 公众号获取URL和Token
	function gainPublic(name) {
		let $selectData = $('.' + name);
		let characterId = $selectData.val();
		if (characterId === null) {
			alertMsg('获取URL和Token失败', '请先选择角色!');
			return;
		}
		let url = $selectData.data('url');
		let $wxurl = $('#' + name + '-wxurl');
		if (name === 'ent') {
			let corpID = $('#ent-corpId').val();
			if (corpID === '') {
				alertMsg('获取URL和Token失败', '请输入CorpId');
				return;
			}
			let sEncodingAESKey = $selectData.data('sencodingaeskey');
			$('#' + name + '-EncodingAESKey').val(sEncodingAESKey);
			$wxurl.val(url + '&sCorpID=' + corpID + '&characterId=' + characterId);
		} else {
			$wxurl.val(url + '&characterId=' + characterId);
		}
		let token = $selectData.data('token');
		$('#' + name + '-wxtoken').val(token);
	}
	// 提示信息
	function alertMsg(title, text) {
		new PNotify({
			title: title,
			text: text,
			type: 'error',
			styling: 'bootstrap3',
			hide: true,
			delay: 8000,
			buttons: {
				closer: true,
				sticker: false
			},
			animate_speed: 'normal'
		});
	}
}
