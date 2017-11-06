import { alertMessage, loadingBtn, renderCommonTime, cleanObject, bindEnter } from 'utils';
import 'new-table';
import { getPage, commonConfig, bindPageChange, delBtnClick, VARIABLES, Table } from 'tables';
import 'time';
import './index.less';
import { DelayUpload } from 'upload';
interface IWord {
	wordName: string;
	listParam: string;
	addParam: string;
	path: string;
	delType: string;
}

class Word {
	private props: IWord;
	constructor(props: IWord) {
		this.props = props;
		this.init();
	}
	init() {
		const tname = this.props.wordName;
		$('#key-table').DataTable(
			Object.assign(
				commonConfig(),
				{
					ajax: {
						type: 'POST',
						url: this.props.path + '/list',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							let data = {
								page: getPage(d),
                                rows: d.length,
                                source: $('#source').val()
							};
							data[this.props.listParam] = $('#keyword').val();
							return cleanObject(data);
						}
					},
					columns: [
						{ data: 'word', title: tname },
						{ data: 'createTime', title: '创建时间', render: renderCommonTime, width: VARIABLES.width.commonTime },
						{ data: 'updateTime', title: '修改时间', render: renderCommonTime, width: VARIABLES.width.commonTime }
					],
					initComplete: this.initComplete
				}
			));
	}

	initComplete = () => {
		const table = $('#key-table').DataTable();
		const t = new Table(table);
		const name = this.props.wordName;
		delBtnClick({
			table: table,
			url: this.props.path + '/delete',
			name: name,
			type: this.props.delType,
			el: $('#del-btn')
		});

		const uploadBtn = $('#upload-submit-btn');
		const upload = new DelayUpload({
			accept: '.xls,xlsx',
			url: this.props.path + '/batchupload',
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
		//     url: this.props.path + '/batchupload',
		//     name: 'uploadedFile',
		//     accept: '.xlsx,.xls',
		//     bindChangeEvent: false,
		//     success: (msg) => {
		//         alertMessage(msg.msg, msg.code, false);
		//         if (!msg.error) {
		//             $('#upload').modal('hide');
		//             // table.draw();
		//             t.refresh();
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

		$('#add-btn').on('click', () => {
			$('#add-modal').modal('show');
			$('#add-word').val('');
		});

		$('#add-modal').on('shown.bs.modal', () => {
			$('#add-word').focus();
		});

		$('#add-submit').on('click', () => {
			const val = $.trim($('#add-word').val());
			if (val === '') {
				alertMessage(`${name}不能为空`);
			}
            /*else if (val.length > 255) {
                alertMessage('' + name + '长度不能超过255个字符！');
            } */else {
				const loading = loadingBtn($('#add-submit'));
				let data = {};
				data[this.props.addParam] = $('#add-word').val();
				$.ajax({
					type: 'POST',
					url: this.props.path + '/add',
					data: data,
					success: (msg) => {
						if (!msg.error) {
							$('#add-modal').modal('hide');
							// table.draw();
							t.refresh(true);
						}
						alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						loading();
					}
				});
			}
		});

		$('#edit-btn').on('click', () => {
			const data = table.rows({ selected: true }).data();
			if (data.length < 1) {
				alertMessage(`请选择要编辑的${name}`);
			}
			else if (data.length > 1) {
				alertMessage(`只能编辑一个${name}`);
			}
			else {
				const currentData = data[0];
				$('#edit-modal').modal('show');
				$('#edit-modal-content').html(
					`<div class='form-group'>
                        <label>原${name}</label>
                        <p class='form-control-static' title='${currentData.word}'>${currentData.word}</p>
                    </div>
                    <div class='form-group'>
                        <label>修改为</label>
                        <input type='text' class='form-control' data-id='${currentData.id}' value='${currentData.word}' data-old='${currentData.word}' maxlength='50'>
                    </div>`);
				$('#edit-modal-content input:first').select();
			}
		});

		$('#edit-submit').on('click', () => {
			let data = [];
			Array.prototype.forEach.call($('#edit-modal-content input'), v => {
				const el = $(v),
					val = $.trim(el.val());
				if (val === el.attr('data-old')) {
					return;
				}
				data.push({
					id: el.data('id'),
					name: val
				});
			});
			if (data.length < 1) {
				alertMessage(`未修改${name}或所有${name}为空`);
			}
			else if (data[0].name.length > 255) {
				alertMessage(`${name}长度不能超过255个字符`);
				return;
			}
			else {
				const loading = loadingBtn($('#edit-submit'));
				$.ajax({
					url: this.props.path + '/update',
					type: 'POST',
					data: JSON.stringify({ 'data': data }),
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					success: (msg) => {
						if (!msg.error) {
							$('#edit-modal').modal('hide');
							// table.draw(false);
							t.refresh();
						}
						alertMessage(msg.msg, !msg.error);
					},
					complete: () => {
						loading();
					}
				});
			}
		});

		$('#search-btn').on('click', () => {
			// table.draw();
			t.refresh(true);
		});


		bindEnter($('#keyword'), () => {
			// table.draw();
			t.refresh(true);
		});

		bindEnter($('#edit-modal'), () => {
			$('#edit-submit').click();
		}, 'input');

		bindEnter($('#add-modal'), () => {
			$('#add-submit').click();
		}, 'input');


		bindPageChange(table, $('#page-change'));

		// $('#keyword').focus();

	}
}

export default Word;

