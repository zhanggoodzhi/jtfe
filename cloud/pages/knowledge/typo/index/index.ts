import {
	bindEnter,
	// Upload,
	alertMessage, loadingBtn, endLoadingBtn, cleanObject, CommonDate, confirmModal, renderCommonTime
} from 'utils';
import 'new-table';
import { bindPageChange, commonConfig, VARIABLES, delBtnClick, Table } from 'tables';
import 'daterangepicker';
import 'script-loader!bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js';
import 'bootstrap-tagsinput/dist/bootstrap-tagsinput.less';
import './index.less';
import { DelayUpload } from 'upload';
namespace TyposIndex {
	let table, state, t;
	$(document).ready(function () {
		initDate();
		initDataTables();
	});
	function initDataTables() {
		table = $('#key-table').DataTable(
			Object.assign(
				commonConfig(),
				{
					ajax: {
						type: 'POST',
						url: 'knowledge/typo/list',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							const time = $('#form-date').val().split(' - '),
								data = {
									page: Math.floor((d.start + d.length) / d.length),
									rows: d.length,
									beginTime: time[0],
									endTime: time[1],
									keyword: $.trim($('#keywrods').val()),
									correct: $.trim($('#correct').val())
								};
							return cleanObject(data);
						}
					},
					initComplete: () => {
						upload();
						// const input = $("#keywrods");
						initTags();
						initAddWords();
						initDelWords();
						initEditWords();
						initSubmit();
						bindEnter($('#keywrods,#correct'), () => {
							t.refresh(true);
							// table.draw();
						});
					},
					columns: [
						{ data: 'typo', title: '用户输入的错字' },
						{ data: 'correct', title: '纠正为' },
						{ data: 'tsp', title: '更新时间', width: VARIABLES.width.commonTime, render: renderCommonTime }
					]
				}));
		t = new Table(table);
		$('#search-btn').on('click', () => {
			t.refresh(true);
			// table.draw();
		});

		bindPageChange(table, $('#page-change'));
	}


	function initDate() {
		new CommonDate({
			el: $('#form-date')
		});
	}
	function upload() {
		const uploadBtn = $('#upload-submit-btn');
		const upload = new DelayUpload({
			accept: '.xls,xlsx',
			url: 'knowledge/typo/batchupload',
			name: 'uploadedFile',
			saveBtn: $('#upload-wrap'),
			submitBtn: uploadBtn,
			save: (id, fileName) => {
				$('#info-wrap').show();
				$('#info-name').text(fileName);
			},
			success: (msg) => {
				if (!msg.error) {
					alertMessage(msg.msg, msg.code, false);
					$('#upload').modal('hide');
					t.refresh();
					$('#info-wrap').hide();
					$('#info-name').text('');
				}
			},
			cancel: () => {
				$('#info-wrap').hide();
				$('#info-name').text('');
			}
		});
		$('#upload').on('hide.bs.modal', () => {
			upload.cancel();
		});
		// const upload = new Upload({
		//     url: 'knowledge/typo/batchupload',
		//     name: 'uploadedFile',
		//     accept: '.xlsx,.xls',
		//     bindChangeEvent: false,
		//     success: (msg) => {
		//         alertMessage(msg.msg, msg.code, false);
		//         if (!msg.error) {
		//             $('#upload').modal('hide');
		//             t.refresh();
		//             // table.draw();
		//         }
		//     },
		//     onChange: (files) => {
		//         if (files) {
		//             $('#info-wrap').show();
		//             $('#info-name').text(files[0].name);
		//         }
		//     },
		//     clearCallback: () => {
		//         $('#info-wrap').hide();
		//         $('#info-name').text('');
		//     },
		//     complete: () => {
		//         endLoadingBtn(uploadBtn, '确定');
		//     }
		// });
		// $('#upload').on('hide.bs.modal', () => {
		//     upload.clear();
		// });
		// $('#upload-wrap').on('click', () => {
		//     upload.select();
		// });
		// uploadBtn.on('click', () => {
		//     if (!upload.getFiles()) {
		//         alertMessage('请选择要上传的文件');
		//         return;
		//     }
		//     loadingBtn(uploadBtn);
		//     upload.upload();
		// });
		$('#batch-upload-btn').on('click', () => {
			$('#upload').modal('show');
		});
	}
	function initTags() {
		const tag: any = $('#input-tag');
		const input = $('#input-title');
		tag.tagsinput();
		tag.on('beforeItemRemove', (e) => {
			const val = $.trim(input.val());
			if (e.item === val) {
				input.val('');
			}
		});
		bindEnter(input, () => {
			$('.bootstrap-tagsinput input').focus();
		});

		$('#add-modal').on('hidden.bs.modal', function () {
			$('#input-title').val('');
			tag.tagsinput('removeAll');
			clearData();
			state = null;
		});
	}
	function initAddWords() {
		$('#add-btn').on('click', function () {
			$('#add-modal').modal('show').find('.modal-title').text('添加错别字');
			clearData();
			state = 'add';
		});
	}

	function initSubmit() {
		const btn = $('#submit-btn');
		const tag: any = $('#input-tag');
		btn.on('click', function () {
			const value = $.trim($('#input-title').val());
			const tagVal = tag.val();
			let bool;
			if (!state) {
				alertMessage('未知错误!');
			}
			else if (!value) {
				alertMessage('请输入错别字代表词!');
			}
            /*else if (tag.tagsinput("items").length <= 1) {
                alertMessage("请至少输入一个错别字!");
            }*/
			else if (tagVal.replace(/,/g, '').length > 200) {
				alertMessage('用户输入的错字长度不能超过200!');
			}
			else {
				const id = tag.attr('data-id'),
					data: any = {
						correct: value,
						typo: tagVal
					};
				let url;
				if (state === 'edit') {
					data.id = id;
					url = 'knowledge/typo/update';
					bool = false;
				} else if (state === 'add') {
					url = 'knowledge/typo/add';
					bool = true;
				}
                /*if (id) {
                    data.id = id;
                    url = 'knowledge/typo/update';
                }
                else {
                    url = 'knowledge/typo/add';
                }*/
				loadingBtn(btn);
				$.ajax({
					url: url,
					type: 'POST',
					data: data,
					success: (msg) => {
						alertMessage(msg.msg, msg.code);
						if (!msg.error) {
							$('#add-modal').modal('hide');
							t.refresh(bool);
							// table.draw();
						}
					},
					complete: () => {
						endLoadingBtn(btn);
					}
				});
			}
		});
	}


	function initDelWords() {
		delBtnClick({
			el: $('#del-btn'),
			table: table,
			name: '错别字',
			url: 'knowledge/typo/delete',
			type: 'GET'
		});
	}

	function clearData() {
		let tag = $('#typos');
		tag.attr({ 'data-id': '', 'data-value': '' });
	}

	function initEditWords() {
		let tag: any = $('#input-tag');
		$('#edit-btn').on('click', function () {
			let select = $('.selected');
			if (select.length > 1) {
				alertMessage('只能编辑一个错别字!');
			}
			else if (select.length < 1) {
				alertMessage('请选择要编辑的错别字!');
			}
			else {
				let data = table.row(select).data();
				let typo = data.typo.split(',');
				tag.attr('data-id', data.id);
				tag.attr('data-value', data.correct);
				$('#input-title').val(data.correct);
				typo.forEach(function (v) {
					tag.tagsinput('add', v);
				}, this);
				$('#add-modal').modal('show').find('.modal-title').text('编辑错别字');
				state = 'edit';
			}
		});
	}
}
