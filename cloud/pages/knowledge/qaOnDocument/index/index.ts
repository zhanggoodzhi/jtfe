import * as utils from 'utils';
import './index.less';
import { Upload } from 'upload';
import { Table } from 'new-table';
import 'time';

let selected: {
	appId: number;
	createTime: number;
	documentName: string;
	documentSize: string;
	documentSystemName: string;
	documentType: string;
	id: number;
};

$(() => {
	utils.bindEnter($('#question'), () => {
		$('#ask-btn').trigger('click');
	});
	// initText();
	initDoc();
});

/*function initText() {
    $('#ask-btn').on('click', () => {
        const documentVal = $.trim($('#document').val()),
            questionVal = $.trim($('#question').val());
        if (documentVal === '') {
            utils.alertMessage('请填写文档内容');
        }
        else if (questionVal === '') {
            utils.alertMessage('请填写测试问题');
        }
        else {
            const endLoading = utils.loadingBtn($('#ask-btn'));
            $.ajax({
                url: 'knowledge/qaOnDocument/query',
                type: 'POST',
                data: {
                    content: documentVal,
                    question: questionVal
                },
                success: renderAnswer,
                complete: () => {
                    endLoading();
                }
            });
        }
    });
}*/


function initDoc() {
	const table = new Table({
		el: $('#select-doc-table'),
		options: {
			ajax: {
				url: 'knowledge/qaOnDocument/list',
				dataSrc: (d) => d.rows,
				data: (d: any) => {
					return utils.cleanObject({
						documentName: $('#doc-name-search').val().trim(),
						page: Math.floor((d.start + d.length) / d.length),
						rows: d.length
					});
				}
			},
			select: {
				style: 'single'
			},
			serverSide: true,
			scrollY: window.innerHeight * 0.4 + 'px',
			paging: true,
			columns: [
				{ data: 'documentName', title: '文档名称' },
				{
					data: 'createTime', title: '上传时间', width: '140px', render: (time: number) => {
						return moment(time).format('YYYY-MM-DD HH:mm:ss');
					}
				}
			]
		}
	}),
		t = table.dt;

	new Upload({
		btn: $('#upload-doc'),
		accept: '.txt,.doc,.docx,.pdf,.xls,.xlsx',
		url: 'knowledge/qaOnDocument/upload',
		name: 'attach',
		loading: true,
		option: {
			multiple: false
		},
		success: (id, name, res) => {
			if (!res.error) {
				updateSelectedDoc(res.data);
			} else {
				utils.alertMessage(res.msg, !res.error);
			}
		}
	}).uploader;

	$('#ask-btn').on('click', () => {
		if (!selected) {
			utils.alertMessage('请选择文档');
			return;
		}

		const question = $('#question').val().trim();

		if (question === '') {
			utils.alertMessage('请填写测试问题');
		}
		else {
			const end = utils.loadingBtn($('#ask-btn'));
			$.ajax('knowledge/qaOnDocument/analysis', {
				method: 'POST',
				data: {
					question: question,
					id: selected.id
				}
			})
				.done((res) => {
					renderAnswer(res);
				})
				.always(() => {
					end();
				});
		}
	});


	$('#doc-search-btn').on('click', () => {
		t.draw();
	});

	$('#select-doc').on('click', () => {
		$('#select-doc-modal').modal('show');
		t.draw();
	});

	$('#select-doc-modal').one('shown.bs.modal', () => {
		t.columns.adjust();
	});

	$('#select-doc-btn').on('click', () => {
		const s = t.row({ selected: true }).data();
		if (!s) {
			utils.alertMessage('请选择文档');
			return;
		}

		updateSelectedDoc(s);
		$('#select-doc-modal').modal('hide');

	});


	utils.bindEnter($('#doc-name-search'), () => {
		t.draw();
	});
}

function renderAnswer(res) {
	let html: string = '';
	if (!res.error && res.data) {
		const answers = res.data.slice(0, 3);
		if (answers.length <= 0) {
			html = '未找到合适的答案';
		} else {
			html = answers.map((text: string, index) => {
				return `
				<p>回复${index + 1}：</p>
				<p>${text.replace(/\n+/g, '<br/>')}</p>`;
			}).join('');
		}
	}
	else {
		utils.alertMessage(res.msg, !res.error);
	}
	$('#answer').html(html);
}


function updateSelectedDoc(data) {
	selected = data;
	$('#doc-name').text(data.documentName);
}


