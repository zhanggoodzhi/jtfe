import * as utils from 'utils';
import 'new-table';
import * as tables from 'tables';
import { initPreAudited, initAudited } from './review';
import { DelayUpload } from 'upload';
import { SimpleDate } from 'daterangepicker';
import 'tree';
import './index.less';
declare const selectData;
let kbyte = 1024;
let mbyte = 1048576;
namespace KnowledgeDocmentAnalysisIndex {
	$(init);

	function init() {
		initDocMgr();
		$('#pre-audit-tab').one('shown.bs.tab', initPreAudited);
		$('#audited-tab').one('shown.bs.tab', initAudited);
	}

	// 文档管理
	function initDocMgr() {
		const cdate = new utils.CommonDate({
			el: $('.doc-form-date')
		});

		// 填充下拉框数据
		const classify = new utils.Tree({
			el: $('#doc-classify'),
			data: utils.formatClassify(selectData.classify)
		});

		new SimpleDate({
			el: $('#start-date')
		});
		new SimpleDate({
			el: $('#end-date'),
			date: moment().add(5, 'year')
		});

		// 初始化表格
		const docMgrTable = $('#mgr-table').DataTable(
			Object.assign(
				tables.commonConfig(),
				{
					ajax: {
						type: 'POST',
						url: 'knowledge/attach/list',
						dataSrc: data => { return data.rows; },
						data: (d: any) => {
							const time = $('#mgr-form-date').val().split(' - '),
								data = {
									page: Math.floor((d.start + d.length) / d.length),
									rows: d.length,
									keyword: $.trim($('#doc-title').val()),
									hasGenerate: $('#corpus-status').val(),
									startDay: time[0],
									endDay: time[1]
								};
							return utils.cleanObject(data);
						}
					},
					scrollY: tables.getTabsTableHeight($('#mgr-search-form')),
					initComplete: initDocMgrComplete,
					columns: [
						{ data: 'attachName', title: '文档' },
						{ data: 'filesize', title: '大小', render: renderSize },
						{ data: 'hasGenerate', title: '生成语料状态', render: renderGene },
						{ data: 'uploadTime', title: '更新时间', render: utils.renderSimpleTime },
						{ data: 'id', title: '操作', render: renderDocOpt, className: 'prevent' }
					]
				}
			));
		function renderSize(d) {
			if (d > mbyte) {
				return `${Math.floor(d * 100 / mbyte) / 100}MB`;
			} else if (d > kbyte) {
				return `${Math.floor(d * 100 / kbyte) / 100}KB`;
			} else {
				return `${d}B`;
			}
		}
		function renderGene(d) {
			if (d) {
				return '<span>已生成</span>';
			} else {
				return '<span style="color:red">未生成</span>';
			}
		}
		function renderDocOpt(data, type, row) {
			return `<div data-attachId=${row.attachId} class='doc-opt'>
                            <a class='opt-update' id='#optu${data}' title='更新文档'><i class="fa fa-refresh"></i></a>
                            <a class='opt-view' id='#optv${data}' title='查看文档' href='knowledge/attach/downDoc?attachId=${row.attachId}'><i class="fa fa-eye"></i></a>
                            <a class='opt-generate' id='#optg${data}' title='生成语料'><img src='${ctx}/images/generate.png' width='17px' style='margin-top:-5px'/></a>
                            <a class='opt-del' id='#optd${data}' title='删除文档'><i class="fa fa-trash"></i></a>
                        </div>`;
		}

		function initDocMgrComplete() {
			const t = new tables.Table(docMgrTable);
			const upRoot = $('#upload-doc-modal');
			const generateRoot = $('#generate-modal');
			let generateSource;// 判断生成语料的情况来源。用于确定点击'生成'功能时，执行哪个后端接口（/generate或者/upload）
			let upParams;// 上传附加参数
			let upHasGenerated = false;// 是否生成语料的标志
			let upAttachId = '';// upAttachId
			let clearStoredFilesLater = false;// 点击'上传并生成语料'后，该值改变，用于判断是否立即清除保存的文件，也可用于上传成功后关闭哪个模态框
			/*上传文档相关功能*/
			const $wrap = $('#info-wrap');
			let upFileId;
			let triggerEnd;
			const upload = new DelayUpload({
				multiple: true,
				name: 'fileUpload',
				// application/vnd.ms-excel，application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
				accept: '.txt,.doc,.docx,.pdf,.xls,.xlsx',
				url: 'knowledge/attach/upload',
				saveBtn: $('#upload-wrap'),// 上传添加列表
				onAllComplete: () => {
					// utils.endLoadingBtn($('#only-upload'));
					if (!clearStoredFilesLater) {
						upRoot.modal('hide');
					} else {
						generateRoot.modal('hide');
					}
					t.refresh();
					$wrap.empty();

					if (triggerEnd) {
						triggerEnd();
					}
				},
				save: (id, name) => {
					if (upAttachId) {
						upload.uploader.setItemLimit(1);
					} else {
						upload.uploader.setItemLimit(100);
					}
					const el = $(`<p><span id='info-name'>${name}</span>
                                    <span aria-hidden='true' class='glyphicon glyphicon-trash info-del' data-fileId='${id}'></span></p>`);
					$wrap.append(el);
					upFileId = $(this).data('fileid');
					el.find('.info-del').on('click', function () {
						upload.uploader.cancel($(this).data('fileid'));
						$(this).parent('p').remove();
					});

				},
				success: (msg) => {
					if (msg.error) {
						utils.alertMessage(msg.msg, !msg.error);
					}
				},
				cancel: () => {
					$wrap.empty();
				}
			});


			utils.bindEnter($('#doc-title'), () => {
				docMgrTable.draw();
			});
            /*清空模态框（点击仅上传后，upRoot关闭后，清空upRoot;点击上传并生成语料后，点击生成后，generateRoot关闭后，清空upRoot和generateRoot;
            点击批量生成语料或者表格中的生成语料按钮后,generateRoot关闭后，清空generateRoot）*/
			clearModals();
			function clearModals() {
				upRoot.on('hide.bs.modal', () => {
					if (!clearStoredFilesLater) {
						upAttachId = '';
						upload.cancel();
						clearUpRoot();
					} else if (clearStoredFilesLater) {
						clearUpRoot();
					}
				});

				generateRoot.on('hide.bs.modal', () => {
					if(testAjax){
                		testAjax.abort();
                	}
					if (!clearStoredFilesLater) {
						clearGenerateRoot();
					} else if (clearStoredFilesLater) {
						upAttachId = '';
						upload.cancel();
						clearGenerateRoot();
						clearStoredFilesLater = false;
					}
				});
			}
			// 清空upRoot
			function clearUpRoot() {
				$wrap.empty();
			}
			// 清空generateRoot
			function clearGenerateRoot() {
				classify.resetFirst();
				$('#select-character').val('');
				$('#select-pushway').val('');
				$('#start-date').val(moment().format('YYYY-MM-DD'));
				$('#end-date').val(moment().add(5, 'year').format('YYYY-MM-DD'));
			}

			// 上传文档按钮
			$('#upload-btn').on('click', function () {
				upRoot.modal('show');
			});
			// 表格中的更新文档
			$('#mgr-table').on('click', '.opt-update', (e) => {
				const data: any = docMgrTable.row($(e.currentTarget).closest('tr')).data();
				upAttachId = data.attachId;
				upRoot.modal('show');
			});
			// 判断是否有上传文件
			let submitedArr;
			let failedArr;
			function hasUploadFile() {
				submitedArr = upload.uploader.getUploads({
					status: upload.qq.status.SUBMITTED
				});
				failedArr = upload.uploader.getUploads({
					status: upload.qq.status.UPLOAD_FAILED
				});
			}
			// 仅上传
			$('#only-upload').on('click', () => {
				upParams = {
					hasGenerate: false,
					attachId: upAttachId
				};
				upload.uploader.setParams(upParams, upFileId);
				upload.uploadAllFile();
				hasUploadFile();
				if ([...submitedArr, ...failedArr].length !== 0) {
					triggerEnd = utils.loadingBtn($('#only-upload'));
				}
				// utils.loadingBtn($('#only-upload'));
			});
			// 上传并生成语料('上传并生成语料'为保存功能，'生成'为提交功能)
			const $uploadAndGenerateBtn = $('#upload-and-generate');
			$uploadAndGenerateBtn.on('click', () => {
				generateSource = 'upload';
				upHasGenerated = true;
				hasUploadFile();
				if ([...submitedArr, ...failedArr].length === 0) {
					utils.alertMessage('请先上传文档再生成语料！');
					return;
				} else {
					clearStoredFilesLater = true;
					upRoot.modal('hide');
					generateRoot.modal('show');
				}
			});
			/*生成语料相关功能*/
			let geAttachId;// 生成语料的attachId
			// 生成语料
			$('#mgr-table').on('click', '.opt-generate', (e) => {
				generateSource = 'generate';
				const data: any = docMgrTable.row($(e.currentTarget).closest('tr')).data();
				geAttachId = data.attachId;
				showGenerateRoot(data.hasGenerate, `该文档已生成语料，是否重新生成（重新生成会删除现有相关语料？）`, '重新生成');

			});
			// 批量生成语料
			$('#generate-btn').on('click', () => {
				generateSource = 'generate';
				const data = docMgrTable.rows({ selected: true }).data().toArray();
				if (data.length <= 0) {
					utils.alertMessage('请选择要批量生成语料的文档');
					return;
				}
				geAttachId = data.map(v => v.attachId).join(',');
				let count = 0;
				data.forEach(v => {
					if (v.hasGenerate) {
						count++;
					}
				});
				showGenerateRoot((count > 0), `已选择的数据存在` + count + `条文档已生成语料，是否全部重新生成（重新生成会删除现有相关语料？）`, '确定');
			});

			function showGenerateRoot(hasGenerate: boolean, msg: string, text: string) {
				if (hasGenerate) {
					utils.confirmModal({
						msg: msg,
						cb: (modal, btn) => {
							modal.modal('hide');
							generateRoot.modal('show');
						},
						className: 'btn-primary',
						text: text
					});
				} else {
					generateRoot.modal('show');
				}
			}

			// 生成语料（点击'生成'按钮，分为两种情况：单纯的生成语料和上传文档后的生成语料）
			const $generateCorpusBtn = $('#generate-modal-btn');
			let testAjax;
			function generateCorpus() {
				triggerEnd = utils.loadingBtn($generateCorpusBtn);
				// 校验不能为空
				const clId = classify.selected[0];
				const chId = $('#select-character').val();
				const pu = $('#select-pushway').val();
				const sd = $('#start-date').val();
				const ed = $('#end-date').val();
				let num = 0;
				const validateIsEmpty = (val, name) => {
					if (!val) {
						utils.alertMessage(`请选择${name}！（${name}不能为空）`);
						return;
					}
					++num;
				};
				validateIsEmpty(clId, '类型');
				validateIsEmpty(chId, '角色');
				validateIsEmpty(pu, '渠道');
				validateIsEmpty(sd, '生效日期');
				validateIsEmpty(ed, '失效日期');
				if (num !== 5) {
					triggerEnd();
					return;
				}
				if (generateSource === 'generate') {
					testAjax=$.ajax({
						url: 'knowledge/attach/generate',
						type: 'POST',
						data: {
							attachIds: geAttachId,
							classifyId: clId,
							characterId: chId,
							pushway: pu,
							startDay: sd,
							endDay: ed
						}
					})
						.done(res => {
							if (!res.error) {
								generateRoot.modal('hide');
								t.refresh(true);
								utils.alertMessage(res.msg, true);
							} else {
								utils.alertMessage(res.msg);
							}
						})
						.always(() => {
							triggerEnd();
						});
				} else if (generateSource === 'upload') {
					// 上传并生成语料的生成：修改param值。
					upParams = {
						hasGenerate: upHasGenerated,
						attachId: upAttachId,
						classifyId: clId,
						characterId: chId,
						pushway: pu,
						startDay: sd,
						endDay: ed
					};
					upload.uploader.setParams(upParams, upFileId);
					// debugger
					upload.uploadAllFile();
				}
			}
			$generateCorpusBtn.on('click', () => {
				generateCorpus();
			});

			// 预览文件
			// $('#mgr-table').on('click', '.opt-view', (e) => {
			// 	const data: any = docMgrTable.row($(e.currentTarget).closest('tr')).data();
			// 	const id = data.attachId;
			// 	window.open('knowledge/attach/viewDoc?attachId=' + id);
			// });

			/*删除相关功能*/
			// 删除
			$('#mgr-table').on('click', '.opt-del', (e) => {
				const data: any = docMgrTable.row($(e.currentTarget).closest('tr')).data();
				const id = data.attachId;
				utils.confirmModal({
					msg: `删除操作会将该文档生成的语料一并删除，您确定删除选中的记录吗？`,
					cb: (modal, btn) => {
						const endLoading = utils.loadingBtn(btn);
						$.ajax({
							url: 'knowledge/attach/delete',
							type: 'GET',
							data: {
								attachIds: id
							},
							success: (msg) => {
								if (!msg.error) {
									docMgrTable.ajax.reload(null, false);
									modal.modal('hide');
								}
								utils.alertMessage(msg.msg, !msg.error);
							},
							complete: () => {
								endLoading();
							}
						});
					}
				});
			});
			// 批量删除
			tables.delBtnClick({
				el: $('#del-btn'),
				table: docMgrTable,
				name: '文档（相应文档所生成的语料也会被一并删除）',
				url: 'knowledge/attach/delete',
				type: 'GET',
				param: 'attachIds',
				dataParam: 'attachId'
			});

			// 查询
			$('#mgr-search-btn').on('click', function () {
				t.refresh(true);
			});

			// 重置
			$('#mgr-reset-btn').on('click', function () {
				$('#doc-title').val('');
				$('#corpus-status').val('');
				cdate.resetDate();
				t.refresh(true);
			});
		}
	}
    /*// 待审核
    function initPreAudited() {
        //初始化表格
        let preTable;
        function initDataTables() {
            preTable = $('#pre-table').DataTable(
                Object.assign(
                    tables.commonConfig(),
                    {
                        ajax: {
                            type: 'POST',
                            url: 'knowledge/synonyms/list',
                            dataSrc: data => { return data.rows; },
                            data: (d: any) => {
                                const time = $('#pre-form-date').val().split(' - '),
                                    data = {
                                        page: Math.floor((d.start + d.length) / d.length),
                                        rows: d.length,
                                        beginTime: time[0],
                                        endTime: time[1],
                                        keyword: $.trim($('#keywrods').val())
                                    };
                                return utils.cleanObject(data);
                            }
                        },
                        initComplete: () => {

                        },
                        columns: [
                            { data: 'title', title: '问题' },
                            { data: 'size', title: '回复' },
                            { data: 'tsp', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
                            { data: 'id', title: '操作' }
                        ]
                    }));

            const t = new tables.Table(preTable);
            $('#pre-search-btn').on('click', function () {
                t.refresh(true);
            });
        }
    }
    // 已审核
    function initAudited() {
        //初始化表格
        let auditedTable;
        function initDataTables() {
            auditedTable = $('#audited-table').DataTable(
                Object.assign(
                    tables.commonConfig(),
                    {
                        ajax: {
                            type: 'POST',
                            url: 'knowledge/synonyms/list',
                            dataSrc: data => { return data.rows; },
                            data: (d: any) => {
                                const time = $('#audited-form-date').val().split(' - '),
                                    data = {
                                        page: Math.floor((d.start + d.length) / d.length),
                                        rows: d.length,
                                        beginTime: time[0],
                                        endTime: time[1],
                                        keyword: $.trim($('#keywrods').val())
                                    };
                                return utils.cleanObject(data);
                            }
                        },
                        initComplete: () => {

                        },
                        columns: [
                            { data: 'title', title: '问题' },
                            { data: 'size', title: '回复' },
                            { data: 'tsp', title: '更新时间', width: tables.VARIABLES.width.commonTime, render: utils.renderCommonTime },
                            { data: 'id', title: '操作' }
                        ]
                    }));

            const t = new tables.Table(auditedTable);
            $('#audited-search-btn').on('click', function () {
                t.refresh(true);
            });
        }
    }*/
}
