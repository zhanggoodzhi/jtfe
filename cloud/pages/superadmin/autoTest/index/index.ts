import * as utils from 'utils';
import { Upload } from 'upload';
import 'new-table';
import * as tables from 'tables';
import 'daterangepicker';
import * as html from './c-sidebar.pug';
import './index.less';

let uploadDoc, detialData;

$(init);


function init() {
	new Upload({
		btn: $('#upload-file'),
		accept: '.xls,.xlsx',
		url: 'superadmin/autoTest/upload_excel',
		name: 'origin',
		loading: true,
		success: (id, name, res) => {
			$('#file-info').html(name);
			uploadDoc = res.data;
		}/*,
        error: (id, name, res) => {
            $('#file-info').html('上传文件出现错误');
        }*/
	});

	const sidebar = new utils.SideBar({
		title: '测试报告',
		id: 'sidebar',
		width: 0.8
	});

	$('#start-time').daterangepicker({
		locale: Object.assign({}, utils.DATERANGEPICKERLOCALE, {
			format: 'YYYY-MM-DD HH:mm'
		}),
		singleDatePicker: true,
		timePicker: true,
		timePicker24Hour: true,
		startDate: moment().add(1, 'minutes')
	});

	$('#table').DataTable({
		ajax: {
			url: 'superadmin/autoTest/plans',
			dataSrc: res => res.rows,
			data: (data: any) => {
				return utils.cleanObject({
					page: Math.floor((data.start + data.length) / data.length),
					rows: data.length,
					status: $('#search-status').val(),
					remark: $('#search-remark').val().trim()
				});
			}
		},
		serverSide: true,
		paging: true,
		columns: [
			{ title: '备注', data: 'remark' },
			{ title: '状态', data: 'status', render: renderStatus, width: '100px' },
			{ title: '最佳', data: 'bestResult', width: '80px' },
			{ title: '最差', data: 'worstResult', width: '80px' },
			{ title: '执行时间', data: 'startTime', render: renderTime, width: '140px' },
			{ title: '结束时间', data: 'finishTime', render: renderTime, width: '140px' },
			{ title: '创建时间', data: 'createTime', render: renderTime, width: '140px' },
			{
				title: '操作',
				className: 'prevent cloud-table-action',
				width: '80px',
				data: 'testPlanId',
				render: (id) => {
					return `
                        <a href="javascript:;" class="show-detail" title="查看测试报告">
                            <i class="fa fa-eye"></i>
                        </a>
                        <a href="superadmin/autoTest/report?testPlanId=${id}" title="下载测试报告">
                            <i class="fa fa-download"></i>
                        </a>
                    `;
				}
			}
		],
		select: false,
		scrollY: '' + tables.getScrollY($('#table')),
		initComplete: () => {
			const dt = $('#table').DataTable(),
				wrap = $('#sidebar'),
				keyArray = [
					{ name: 'QUESTION_SIM', value: '问句相似度' },
					{ name: 'ANSWER_SIM', value: '答案相似度' },
					{ name: 'FRAME_SIM', value: '骨架相似度' }
				],
				keyMap = {};
			keyArray.forEach(k => {
				keyMap[k.name] = k.value;
			});

			utils.bindEnter($('#search-remark'), () => {
				dt.draw();
			});

			$('#search-btn').on('click', () => {
				dt.draw();
			});

			$('#create-btn').on('click', () => {
				$('#create-modal').modal('show');
			});

			$('#create-modal').on('show.bs.modal', () => {
				$('#start-time').data('daterangepicker').setStartDate(moment().add(1, 'minutes'));
			});

			$('#create-submit-btn').on('click', () => {
				const data = {
					settings: [],
					startTime: moment($('#start-time').val()).valueOf(),
					remark: $('#remark').val().trim(),
					fileId: uploadDoc
				};

				if (data.remark === '') {
					utils.alertMessage('备注说明不能为空');
					return;
				}
				for (let setting of $('#create-modal .settings').toArray()) {
					const s = $(setting),
						key = s.data('key'),
						settingData: { [key: string]: string } = {
							key: key
						};
					for (let input of s.find('input').toArray()) {
						const i = $(input),
							val = i.val().trim();
						if (val === '') {
							utils.alertMessage(keyMap[key] + '的' + i.prop('placeholder') + '不能为空');
							return;
						}

						settingData[i.prop('name')] = val;

					}
					data.settings.push(settingData);
				}
				if (!uploadDoc) {
					utils.alertMessage('请上传测试文件');
				}
				else if ($('#upload-file').is(':hidden')) {
					utils.alertMessage('请等待文件上传完毕');
				}
				else {
					const end = utils.loadingBtn($('#create-submit-btn'));

					$.ajax('superadmin/autoTest/plans', {
						method: 'POST',
						data: JSON.stringify(data),
						contentType: 'application/json'
					})
						.done((res) => {
							if (!res.error) {
								$('#create-modal').modal('hide');
								dt.ajax.reload();
							}
							utils.alertMessage(res.msg, !res.error);
						})
						.always(() => {
							end();
						});
				}

			});

			$('#table').on('click', '.show-detail', e => {
				const data: any = dt.row($(e.currentTarget).closest('tr')).data(),
					end = utils.loadingBtn($(e.currentTarget));
				$.ajax('superadmin/autoTest/plans_outline', {
					data: {
						testPlanId: data.testPlanId
					}
				})
					.done(res => {
						if (!res.error) {
							Object.assign(res, {
								start: renderTime(res.executeAt),
								end: renderTime(res.completeAt),
								create: renderTime(res.createAt),
								statusText: renderStatus(res.status),
								keyMap,
								keyArray
							});

							showDetail(res);
						}
						else {
							utils.alertMessage(res.msg, !res.error);
						}
					})
					.always(() => {
						end();
					});

			});


            /*wrap.on('click', '.view-corpus', (e) => {
                const btn = $(e.currentTarget),
                    table = $('<table class="table"></table>');

                btn.parent().after(table);

                table.DataTable({
                    ajax: {
                        url: 'superadmin/autoTest/plans_init_data',
                        data: {
                            testPlanId: detialData.testPlanId
                        },
                        dataSrc: res => res
                    },
                    select: false,
                    scrollY: '500px',
                    scrollCollapse: true,
                    columns: [
                        { data: 'question', title: '问句' },
                        { data: 'answer', title: '回复' }
                    ]
                });

                btn.remove();
            });
*/
			wrap.on('click', '.view-testcase', (e) => {
				const btn = $(e.currentTarget),
					table = $('<table class="table fixed-table" id="testcase-table"></table>');

				btn.parent().after(table);

				btn.next('.toggle-testcase').removeClass('hidden');

				table.DataTable({
					ajax: {
						url: 'superadmin/autoTest/plans_test_cases',
						data: {
							testPlanId: detialData.testPlanId
						},
						dataSrc: res => res
					},
					columns: [
						{ data: 'question', title: '测试问句', createdCell: tables.createAddTitle },
						{ data: 'expect', title: '期望匹配', createdCell: tables.createAddTitle }
					],
					select: false,
					scrollY: '500px',
					scrollCollapse: true
				});

				btn.remove();
			});

			wrap.on('click', '.toggle-testcase', (e) => {
				const table = $('#testcase-table').closest('.dataTables_wrapper'),
					btn = $(e.currentTarget);

				btn.text(table.is(':visible') ? '显示' : '隐藏');

				table.toggle();
			});

			wrap.on('click', '.result-link', (e) => {
				const a = $(e.currentTarget),
					target = $(a.attr('data-target'));

				if (target.length > 0) {
					if (target.is(':hidden')) {
						target.collapse('show');
					}

					wrap.find('.sidebar-content').animate({
						scrollTop: target.get(0).offsetTop - target.prev('.panel').height()
					});

				}


			});

			wrap.on('show.bs.collapse', '.collapse', (e) => {
				const target = $(e.currentTarget);
				wrap.find('.collapse').toArray().forEach(v => {
					const el = $(v);
					if (!el.is(target) && el.is(':visible')) {
						el.collapse('hide');
					}
				});
			});

		}
	});

	function showDetail(data) {
		detialData = data;
		sidebar.elements.content.html(html(data));
		$('#sidebar .collapse').toArray().forEach(el => {
			const collapse = $(el);
			collapse.one('show.bs.collapse', (e) => {
				const table = $('<table class="table fixed-table"></table>');


				collapse.find('.panel-body').append(table);

				table.DataTable({
					ajax: {
						url: 'superadmin/autoTest/plans_test_result_detail',
						data: {
							testResultId: collapse.attr('data-id')
						},
						dataSrc: res => res
					},
					columns: [
						{ data: 'question', title: '测试问句', createdCell: tables.createAddTitle },
						{ data: 'matched', title: '实际匹配问句', createdCell: tables.createAddTitle },
						{ data: 'maxSimilarityExpectedQuestionStr', title: '最相似问句', createdCell: tables.createAddTitle },
						{ data: 'questionSimDegree', title: '相似度', width: '75px' },
						{ data: 'expectedMaxSimilarityDegree', title: '问句最大相似度', createdCell: tables.createAddTitle, width: '100px' },
						{ data: 'expect', title: '期望回复', createdCell: tables.createAddTitle },
						{ data: 'real', title: '真实回复', createdCell: tables.createAddTitle },
						{ data: 'inputWord', title: '测试问题重要词汇', createdCell: tables.createAddTitle },
						{ data: 'expectedWord', title: '预期问题重要词汇', createdCell: tables.createAddTitle },
						{ data: 'similarWord', title: '实际回复问题重要词汇', createdCell: tables.createAddTitle }
					],
					select: false,
					scrollY: '500px',
					scrollCollapse: true,
					createdRow: (row, d: any) => {
						if (d.passed) {
							$(row).addClass('result-success');
						} else {
							if (d.mismatchNoAnswer) {
								$(row).addClass('result-fail');
							} else {
								$(row).addClass('result-fail-no-answer');
							}
						}
					}
				});
			});
		});
		sidebar.show();
	}
}


function renderTime(time: number) {
	return time ? moment(time).format('YYYY-MM-DD HH:mm') : '无';
}

function renderStatus(status: number) {
	const map = {
		'1': '准备就绪',
		'2': '正在测试',
		'3': '测试结束',
		'4': '计划取消',
		'5': '异常终止'
	};


	return map[status] || '';
}


function renderBooleanResult(value: boolean) {
	return value ? '是' : '否';
}
