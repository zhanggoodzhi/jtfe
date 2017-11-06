import * as tables from 'tables';
import * as utils from 'utils';
import * as showDetail from './show-detail.pug';
import { Uploader } from 'upload';
import { SelectTree } from 'tree';
import * as addPug from './add-detail.pug';
import * as rightHotPug from './right-hot.pug';
import 'select';
import './index.less';
declare let labels: any;
declare let templates: any;
declare let alldirectory: any;
declare let sessionUserAlias: any;
export class KbDetail {
	/**
	 *
	 *
	 * @private
	 * @type {*}
	 * @memberOf KbDetail
	 * 侧栏的实例
	 */
	private detail: any;
	/**
	 *
	 *
	 * @private
	 * @type {JQuery}
	 * @memberOf KbDetail
	 * 侧栏的div
	 */
	private detailEl: JQuery;
	private versionTable = null;
	private reviewTable = null;
	private modifyTable = null;
	/**
	 *
	 *
	 * @private
	 * @type {*}
	 * @memberOf KbDetail
	 * 知识详情的数据
	 */
	private knowledgeDetail: any;
	/**
	 *
	 *
	 * @private
	 * @type {*}
	 * @memberOf KbDetail
	 * 点击按钮完成操作后需要刷新的表格
	 */
	private kbtable: any;
	/**
	 *
	 *
	 * @private
	 * @type {*}
	 * @memberOf KbDetail
	 * 对应的KbEdit类的实例
	 */
	private kbEdit: any;

	/**
	 *
	 *
	 * @private
	 * @type {*}
	 * @memberOf KbDetail
	 * 储存知识点详情层数的栈
	 */
	private stack = [];

	/**
	 *
	 *
	 * @private
	 *
	 * @memberOf KbDetail
	 * 判断是否是后退
	 */
	private ifBack = false;
	private detailData: any;
	private btns = {
		updateBtn: utils.renderSideMenu('更新', 'updateBtn'),
		fileBtn: utils.renderSideMenu('归档', 'fileBtn'),
		modifyBtn: utils.renderSideMenu('修改', 'modifyBtn'),
		passBtn: utils.renderSideMenu('通过', 'passBtn'),
		refuseBtn: utils.renderSideMenu('驳回', 'refuseBtn'),
		revertBtn: utils.renderSideMenu('还原', 'revertBtn'),
		backBtn: utils.renderSideMenu('后退', 'backBtn')
	};
	constructor() {
		$('select').material_select();// 初始化select标签
		this.detail = new utils.SideDetail({
			title: '查看详情',
			className: 'knowledge-detail'
		});
		this.detailEl = this.detail.element.el;
		this.bindEvent();
	}
	public init(params) {
		if (!this.ifBack) {
			this.stack.push(params);
		}
		$.ajax({
			type: 'GET',
			url: '/api/repository/detail',
			data: {
				knowledgeId: params.id,
				version: params.version,
				logicid: params.logicid
			},
			success: (data) => {
				this.detailData = data;
				this.knowledgeDetail = data.knowledge;
				this.render();
			}
		});
	}
	private bindEvent() {
		const self = this;
		this.detailEl.on('click', '.version-tab', () => {
			this.initVersionTable();
		});
		this.detailEl.on('click', '.review-tab', () => {
			this.initReviewTable();
		});
		this.detailEl.on('click', '.modify-tab', () => {
			this.initModifyTable();
		});

		this.detailEl.on('click', '.updateBtn', () => {
			this.kbEdit.showUpdate(this.knowledgeDetail);
			this.btnSuccess();
		});
		this.detailEl.on('click', '.modifyBtn', () => {
			this.kbEdit.showModify(this.knowledgeDetail);
			this.btnSuccess();
		});
		this.detailEl.on('click', '.passBtn', () => {
			$.ajax({
				type: 'PUT',
				url: '/review/audit',
				processData: false,
				contentType: 'application/json',
				data: JSON.stringify({
					knowledgeId: this.knowledgeDetail.knowledgeId,
					result: 1
				}),
				success: (data) => {
					utils.toast('已通过审核');
					this.btnSuccess();
				}
			});
		});
		this.detailEl.on('click', '.refuseBtn', () => {
			utils.modal('请填写驳回理由', `
			 <div class="row">
				<div class="input-field col s12">
				<textarea id="revert" class="materialize-textarea"></textarea>
				<label for="revert">驳回理由</label>
				</div>
			</div>
			`, '确定', (remove) => {
					$.ajax({
						type: 'PUT',
						url: '/review/audit',
						processData: false,
						contentType: 'application/json',
						data: JSON.stringify({
							knowledgeId: this.knowledgeDetail.knowledgeId,
							result: 0,
							reason: $('#revert').val()
						}),
						success: (data) => {
							utils.toast('驳回成功');
							this.btnSuccess();
							remove();
						}
					});
				});
		});
		this.detailEl.on('click', '.revertBtn', () => {
			utils.confirmModal('确定要还原么？', (remove) => {
				$.ajax({
					type: 'PUT',
					url: `/repository/revert/${this.knowledgeDetail.knowledgeId}`,
					success: (data) => {
						utils.toast('还原成功');
						this.btnSuccess();
						remove();
					}
				});
			});
		});
		this.detailEl.on('click', '.fileBtn', () => {
			utils.confirmModal('确定要归档么？', (remove) => {
				$.ajax({
					type: 'PUT',
					url: `/repository/filing/${this.knowledgeDetail.knowledgeId}`,
					success: (data) => {
						utils.toast('归档成功');
						this.btnSuccess();
						remove();
					}
				});
			});
		});
		this.detailEl.on('click', '.backBtn', () => {
			this.detail.hide();
			this.removeDataTable();
			let params = this.stack.pop();
			this.ifBack = true;
			setTimeout(() => {
				this.init(params);
				this.ifBack = false;
			}, 300);
		});
		this.detailEl.on('click', '.kb-close', () => {
			this.hide();
		});
		this.detail.element.overlay.on('click', () => {
			this.hide();
		});
		this.fixTab();

		// 收藏
		this.detailEl.on('click', '.star-wrap i', function () {
			if ($(this).hasClass('active')) {
				$.ajax({
					url: '/api/collection/delete?knowledgeId=' + self.knowledgeDetail.knowledgeId,
					type: 'DELETE',
					success: () => {
						const el = $('.star-wrap .number');
						const text = Number(el.text());
						el.text((text - 1).toString());
						$(this).removeClass('active');
					}
				});
			} else {
				$.ajax({
					url: '/api/collection/create',
					type: 'POST',
					data: {
						knowledgeId: self.knowledgeDetail.knowledgeId
					},
					success: () => {
						const el = $('.star-wrap .number');
						const text = Number(el.text());
						el.text((text + 1).toString());
						$(this).addClass('active');
					}
				});
			}
		});
		// 评论相关
		this.detailEl.on('click', '.reply-btn', function () {
			setTimeout(() => {
				const commentSuperId = $(this).closest('.comment-item').data('id');
				const commentSuperName = $(this).closest('.comment-item').find('.comment-name').eq(0).text();
				const present = $(this).parent().siblings('.comment-info').find('.present').text();
				$(this).closest('.comment-content').after(`
					<div class="row reply-content-wrap">
						<div class="col s9 input-field reply-content">
							<textarea placeholder="回复 ${present}:" id="reply" class="materialize-textarea input-small"></textarea>
						</div>
						<div class="col s3 input-field reply-sure">
							<a class="waves-effect waves-light btn btn-small" data-id="${commentSuperId}" data-name="${commentSuperName}">回复</a>
						</div>
					</div>
				`);
				// 调整回复框的top，使它在滚动条内，不然看不见
				// const replyEl = $('.reply-content-wrap');
				// const offsetParentEl = replyEl.offsetParent();
				// const top = replyEl.offset().top;
				// const scrollTop = offsetParentEl.scrollTop();
				// const height = offsetParentEl.outerHeight();
				// if (top > scrollTop + height) {
				// 	offsetParentEl.scrollTop(top);
				// }
			}, 50);
		});
		$('body').on('click', function (e) {
			if ($(e.target).closest('.reply-content-wrap').length === 0) {
				$('.reply-content-wrap').remove();
			}
		});
		this.detailEl.on('click', '.reply-sure a', function () {
			const el = $(this);
			const commentSuperId = el.data('id');
			const commentSuperName = el.data('name');
			$.ajax({
				url: '/api/comment/create',
				type: 'POST',
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify({
					knowledgeId: self.knowledgeDetail.knowledgeId,
					content: $('#reply').val(),
					commentSuperId: commentSuperId
				}),
				success: (data) => {
					el.closest('.big-item').find('.comment-attachment').append(
						`<li class="comment-item clearfix" data-id="${data.commentId}">
						<div class="head-icon-wrap left">
							<img src="/images/adminhead.png"></div>
						<div class="comment-main">
							<div class="comment-info">
								<a class="comment-name present">${sessionUserAlias}</a>
								回复
								<a class="comment-name">${commentSuperName}</a>
								<div class="comment-time">${data.createTime}</div>
							</div>
							<div class="comment-content">
								${data.content}
								<a class="waves-effect waves-light btn btn-small btn-flat reply-btn"><i class="material-icons left">textsms</i>回复</a>
							</div>
						</div>
					</li>`
					);
					el.closest('.reply-content-wrap').remove();
					utils.toast('回复成功');
				}
			});
		});
		this.detailEl.on('click', '.publish', function () {
			const textarea = self.detailEl.find('.comment-textarea-wrap textarea');
			const value = textarea.val();
			if (value === '') {
				utils.toast('请输入评论内容');
				return;
			}
			$.ajax({
				url: '/api/comment/create',
				type: 'POST',
				contentType: 'application/json',
				processData: false,
				data: JSON.stringify({
					knowledgeId: self.knowledgeDetail.knowledgeId,
					content: value
				}),
				success: (data) => {
					utils.toast('发布评论成功！');
					textarea.val(null);
					const item = $(`
						<li class="comment-item big-item clearfix" data-id="${data.commentId}">
							<div class="head-icon-wrap left">
								<img src="/images/adminhead.png">
							</div>
							<div class="comment-main big-main">
								<div class="comment-info">
									<a class="comment-name present">${sessionUserAlias}</a>
									<div class="comment-time">${data.createTime}</div>
								</div>
								<div class="comment-content">
									${data.content}
									<a class="waves-effect waves-light btn btn-small btn-flat reply-btn"><i class="material-icons left">textsms</i>回复</a>
								</div>
								<ul class="comment-attachment">

								</ul>
							</div>
						</li>
					`);
					$('.comment-list').append(item);
				}
			});
		});
	}
	private removeDataTable() {
		this.versionTable = null;
		this.reviewTable = null;
		this.modifyTable = null;
	}
	private fixTab() {
		utils.fixedTab($(document), '.kb-side-body', '.knowledge-detail .tabs');
	}
	get kbDetail() {
		return this.knowledgeDetail;
	}
	private btnSuccess() {
		if (this.kbtable) {
			this.kbtable.reload();
		}
		this.hide();
	}
	private hide() {
		this.detail.hide();
		this.removeDataTable();
		this.stack = [];
	}
	private render() {
		const self = this;
		let backBtnArr = [];
		if (this.stack.length > 1) {
			backBtnArr = [this.btns.backBtn];
		}
		this.detail.updateTitle('查看知识点详情: ' + this.knowledgeDetail.knowledgeName);
		$('.kb-side-header').find('h4').append(`
			<span class="head-small">   (评论:<span class="comment-number"></span> | 收藏：${this.knowledgeDetail.collectionNum})<span>
		`);
		this.detail.updateHtml(showDetail(this.knowledgeDetail));
		const updateTimeEl = this.detailEl.find('.detail-update-time');
		updateTimeEl.html(utils.renderTime(updateTimeEl.text() as any));
		this.detailEl.find('ul.tabs').tabs();
		this.detail.show();
		const stepWrapEl = this.detailEl.find('.review-step');
		switch (this.knowledgeDetail.status) {
			case '1':
				this.detail.updateHeader(backBtnArr.concat([this.btns.modifyBtn]));
				break;
			case '2':
				if (this.detailData.isreview) {
					this.detail.updateHeader(backBtnArr.concat([this.btns.passBtn, this.btns.refuseBtn]));
				} else {
					this.detail.element.headerMenus.find(`li:not(.kb-close)`).remove();
				}
				stepWrapEl.show();
				this.detailData.reviewlist.map((v, i) => {
					stepWrapEl.find('.anchor').append(`
						<li>
							<a class="active${v.result}">
								<span class="line"></span>
								<span class="circle tooltipped" data-position="bottom" data-delay="50" data-tooltip="${v.username}">${v.index}</span>
							</a>
						</li>
					`);
				});
				break;
			case '3':
				if (this.detailData.isoperate) {
					this.detail.updateHeader(backBtnArr.concat([this.btns.updateBtn, this.btns.fileBtn]));
				} else {
					this.detail.updateHeader(backBtnArr.concat([this.btns.fileBtn]));
				}
				break;
			case '4':
				this.detail.updateHeader(backBtnArr.concat([this.btns.modifyBtn]));
				stepWrapEl.show();
				this.detailData.reviewlist.map((v, i) => {
					stepWrapEl.find('.anchor').append(`
						<li>
							<a class="active${v.result}">
								<span class="line"></span>
								<span class="circle tooltipped" data-position="bottom" data-delay="50" data-tooltip="${v.username}">${v.index}</span>
							</a>
						</li>
					`);
				});
				this.detailEl.find('.basic-info-list').append(`
					<li><span class="list-title">驳回理由</span><span style="color:#c51f29;">${this.detailData.reviewhistory.reason}</span></li>
				`);
				break;
			case '5':
				if (this.detailData.isoperate) {
					this.detail.updateHeader(backBtnArr.concat([this.btns.updateBtn, this.btns.revertBtn]));
				} else {
					this.detail.updateHeader(backBtnArr.concat([this.btns.revertBtn]));
				}
				break;
			default:
				utils.toast('未知状态');
				break;
		};
		$('.tooltipped').tooltip({ delay: 50 });// 初始化tooltip插件
		this.getCollectStatus();
		this.getComment(1);

		new utils.ScrollPagination({
			el: $('.knowledge-detail .kb-side-body'),
			cb: (page, next, end) => {
				self.getComment(page, next, end);
			}
		});
	}
	private getComment(page, next?, end?) {
		$.ajax({
			url: '/api/comment/knowledge/comment/list',
			type: 'get',
			data: {
				knowledgeId: this.knowledgeDetail.knowledgeId,
				page: page,
				size: 15
			},
			success: (msg) => {
				$('.kb-header-title .comment-number').text(msg.total);
				if (msg.data.length === 0) {
					if (end) {
						end();
					}
					return;
				}
				this.renderComment(msg.data);
				if (next) {
					next();
				}
			}
		});
	};
	private renderComment(data) {
		const bigEl = $('.comment-list');
		// bigEl.html('');
		for (let v of data) {
			const item = $(`
				<li class="comment-item big-item clearfix" data-id="${v.commentId}">
					<div class="head-icon-wrap left">
						<img src="/images/adminhead.png">
					</div>
					<div class="comment-main big-main">
						<div class="comment-info">
							<a class="comment-name present" data-id="${v.userid}">ID${v.userid}</a>
							<div class="comment-time">${v.createTime}</div>
						</div>
						<div class="comment-content">
							${v.content}
							<a class="waves-effect waves-light btn btn-small btn-flat reply-btn"><i class="material-icons left">textsms</i>回复</a>
						</div>
						<ul class="comment-attachment">

						</ul>
					</div>
				</li>
			`);
			bigEl.append(item);
			for (let vv of v.childs) {
				item.find('.comment-attachment').append(
					`<li class="comment-item clearfix" data-id="${vv.commentId}">
						<div class="head-icon-wrap left">
							<img src="/images/adminhead.png"></div>
						<div class="comment-main">
							<div class="comment-info">
								<a class="comment-name present" data-id="${vv.userid}">ID${vv.userid}</a>
								回复
								<a class="comment-name" data-id="${v.userid}">ID${v.userid}</a>
								<div class="comment-time">${vv.createTime}</div>
							</div>
							<div class="comment-content">
								${vv.content}
								<a class="waves-effect waves-light btn btn-small btn-flat reply-btn"><i class="material-icons left">textsms</i>回复</a>
							</div>
						</div>
					</li>`
				);
			}
		}
	}
	private getCollectStatus() {
		$.ajax({
			url: '/api/collection/iscollected',
			type: 'get',
			data: {
				knowledgeId: this.knowledgeDetail.knowledgeId
			},
			success: (bool) => {
				if (bool) {
					$('.star-wrap i').addClass('active');
				}
			}
		});
	};
	private initVersionTable() {
		if (this.versionTable) {
			this.versionTable.reload();
			return;
		}
		const self = this;
		const el = this.detailEl.find('#version-table');
		this.versionTable = new tables.Table({
			el: el,
			options: {
				scrollY: '400',
				ajax: {
					url: '/api/repository/versionhistory',
					type: 'GET',
					dataSrc: function (data) {
						const d = data;
						return d;
					},
					data: function (d: any) {
						const data = {
							logicid: self.knowledgeDetail.logicid
						};
						d = utils.cleanObject(data);
						return d;
					}
				},
				columns: [
					{ data: 'knowledgeId', title: 'ID', createdCell: utils.createAddTitle },
					{ data: 'knowledgeName', title: '名称' },
					{ data: 'updateAt', title: '更新时间', createdCell: utils.createAddTitle, render: utils.renderTime },
					{ data: 'authorId', title: '作者' },
					{ data: 'version', title: '版本' },
					{ data: 'templateName', title: '类别' },
					{ data: 'status', title: '状态', render: utils.renderStatus },
					{ data: 'knowledgeId', title: '操作', className: 'prevent', render: utils.renderCheckBtn, width: '10%' }
					// { data: 'labels', title: '标签', render: this.renderLabels, createdCell: this.createLabelCell }
				]
			},
			initComplete: (dt) => {
				el.on('click', '.view-detail', function (e) {
					self.detail.hide();
					self.removeDataTable();
					setTimeout(() => {
						self.init(utils.getDetailParams($(this)));
					}, 300);
				});
			}
		});
	}
	private initReviewTable() {
		if (this.reviewTable) {
			this.reviewTable.reload();
			return;
		}
		const self = this;
		const el = this.detailEl.find('#review-table');
		this.reviewTable = new tables.Table({
			el: el,
			options: {
				scrollY: '400',
				ajax: {
					url: '/api/repository/reviewhistory',
					type: 'GET',
					dataSrc: function (data) {
						const d = data;
						return d;
					},
					data: function (d: any) {
						const data = {
							logicid: self.knowledgeDetail.logicid
						};
						d = utils.cleanObject(data);
						return d;
					}
				},
				columns: [
					{ data: 'id', title: 'ID', createdCell: utils.createAddTitle },
					{ data: 'title', title: '标题' },
					{ data: 'reviewTime', title: '审核时间', createdCell: utils.createAddTitle, render: utils.renderTime },
					{ data: 'author', title: '作者' },
					{ data: 'version', title: '版本' },
					{ data: 'status', title: '状态', render: utils.renderStatus },
					{ data: 'id', title: '操作', className: 'prevent', render: utils.renderCheckBtn, width: '10%' }
				]
			},
			initComplete: (dt) => {
				el.on('click', '.view-detail', function (e) {
					self.detail.hide();
					self.removeDataTable();
					setTimeout(() => {
						const params = utils.getDetailParams($(this));
						params.id = null;
						self.init(params);
					}, 300);
				});
			}
		});
	}
	private initModifyTable() {
		if (this.modifyTable) {
			this.modifyTable.reload();
			return;
		}
		const self = this;
		const el = this.detailEl.find('#modify-table');
		this.modifyTable = new tables.Table({
			el: el,
			options: {
				scrollY: '400',
				ajax: {
					url: '/api/repository/modifyhistory',
					type: 'GET',
					dataSrc: function (data) {
						const d = data;
						return d;
					},
					data: function (d: any) {
						const data = {
							logicid: self.knowledgeDetail.logicid
						};
						d = utils.cleanObject(data);
						return d;
					}
				},
				columns: [
					{ data: 'id', title: 'ID', createdCell: utils.createAddTitle },
					{ data: 'modifyTime', title: '修改时间', createdCell: utils.createAddTitle, render: utils.renderTime },
					{ data: 'version', title: '版本' },
					{ data: 'remark', title: '变更说明' },
					{ data: 'oldStatus', title: '旧状态', render: utils.renderStatus },
					{ data: 'newStatus', title: '新状态', render: utils.renderStatus },
					{ data: 'id', title: '操作', className: 'prevent', render: utils.renderCheckBtn, width: '10%' }
				]
			},
			initComplete: (dt) => {
				el.on('click', '.view-detail', function (e) {
					self.detail.hide();
					self.removeDataTable();
					setTimeout(() => {
						const params = utils.getDetailParams($(this));
						params.id = null;
						self.init(params);
					}, 300);
				});
			}
		});
	}
	set table(table) {
		this.kbtable = table;
	}
	set editInstance(edit) {
		this.kbEdit = edit;
	}

	/**
	 *
	 *
	 *
	 * @memberOf KbDetail
	 * 设置是否是后退状态
	 */
	set back(bool) {
		this.ifBack = bool;
	}
}

export class KbEdit {
	private op;
	private addDetail: any;
	private editStatus: string;
	private addDetailEl: any;
	private selectTree: any;
	private templateId: any;
	private knowledgeDetail: any;
	private addFileList = [];
	private uploadArr = [];// 记录上传过的文件
	private deleteArr = [];// 记录需要删除的文件
	private ifSaveMode = false;
	constructor(op?: any) {
		if (op) {
			this.op = op;
		}
		this.init();
	}
	private init() {
		this.addDetail = new utils.SideDetail({
			title: '新增',
			html: addPug(),
			menus: [utils.renderSideMenu('提交审核', 'sendBtn'), utils.renderSideMenu('保存草稿', 'saveBtn')],
			className: 'add-detail-wrap st1'
		});
		this.addDetailEl = this.addDetail.element.el;
		this.initSelectTree();
		this.renderSelect2();
		this.bindEvent();
	}
	private bindEvent() {
		this.addDetailEl.on('click', '.step1next', () => {
			if (!this.validateEmpty(this.addDetailEl.find('.step1 #title,#select-tree,#add-select2'))) {
				return;
			};
			this.changeFormStyle(2);
		});
		this.addDetailEl.on('click', '.step2next', () => {
			if (!this.validateEmpty(this.addDetailEl.find('.step2 input'))) {
				return;
			};
			this.changeFormStyle(3);
		});
		this.addDetailEl.on('click', '.step2before', () => {
			this.changeFormStyle(1);
		});
		this.addDetailEl.on('click', '.step3before', () => {
			this.changeFormStyle(2);
		});
		this.addDetailEl.on('click', '.sendBtn', () => {// 提交审核

			if (!this.validateEmpty(this.addDetailEl.find('.step1 #title,#select-tree,#add-select2,.step2 input'))) {
				return;
			};
			this.ifSave(false, this.editStatus, () => {
				utils.toast('提交审核成功');
				this.addDetail.hide();
				this.cleanAddDetail();
			});
		});
		this.addDetailEl.on('click', '.saveBtn', () => {// 保存草稿
			this.ifSave(true, this.editStatus, () => {
				utils.toast('保存成功');
				this.addDetail.hide();
				this.cleanAddDetail();
			});
		});
		this.addDetailEl.find('.kb-close').on('click', () => {
			this.cleanAddDetail();
		});
		this.addDetail.element.overlay.on('click', () => {
			this.cleanAddDetail();
		});
		this.bindUploadFileEvent();
	}
	private bindUploadFileEvent() {
		new Uploader({
			btn: $('#upload-attache'),
			// 'image/jpeg,image/png,image/x-icon,application/vnd.ms-excel,application/msword,application/vnd.ms-powerpoint,video/x-msvideo,audio/x-wav'
			// '.txt,.jpg,.png,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.pdf,audio/*,video/*'
			accept: '.txt,.jpg,.png,.xls,.xlsx,.doc,.docx,.ppt,.pptx,.pdf,.avi,.mid,.midi,.oga,.wav,.3gp,.3g2,.mpeg,.ogv,.webm,.mp4,.mp3',
			url: '/attach/upload',
			name: 'files',
			success: (id, name, res) => {
				res.data.forEach(v => {
					this.addFileList.push({
						id: v.id,
						url: v.url,
						name: v.filename,
						type: v.type,
						size: v.size
					});
					this.uploadArr.push(v.id);
				});
				this.renderFile();
			}
		});
		const self = this;
		$('.add-detail-wrap').on('click', '.content-delete-wrap', function () {
			const id = $(this).attr('data-id');
			self.deleteArr.push(id);
			self.addFileList.splice(Number($(this).attr('data-index')), 1);
			self.renderFile();

		});
	}
	private renderFile() {
		const el = $('.add-file-content-wrap');
		el.html('');
		this.addFileList.map((v, i) => {
			const size = this.renderFileSize(v.size);
			el.append(`
		<div class="add-file-content-item" >
			<div class="content-left col s2" >
				<span>
					附件<span class="file-index">${i + 1}</span>
				</span>
			</div>
			<div class="content-middle col s4">
				<img class="file-icon" src="/images/types/doc.png">
				<a class="file-name">${v.name}</a>
			</div>
			<div class="content-size-wrap col s2">
				(<span class="file-size">${size}</span>)
			</div>
			<div class="content-delete-wrap col s2" data-id="${v.id}" data-index="${i}">
				<i class="kb-icon kb-delete"></i>
			</div>
		 </div>
		`);
		});
	}
	private renderFileSize(size) {
		if (size > 1000) {
			return (size / 1000).toFixed(2) + 'KB';
		} else {
			return size + 'B';
		}
	}
	private validateEmpty(els) {
		for (let v of els.toArray()) {
			const el = $(v);
			let val: any = el.val();
			if (el.is('.jstree')) {// 如果是下拉树
				const text = el.siblings('.kb-placeholder').text();
				const value = el.parent().siblings('.select-dropdown').val();
				if (value === text) {
					utils.toast(text + '不能为空');
					return false;
				}
			} else if (el.is('.select2-hidden-accessible')) {// 如果是多选的select2
				const text = el.parent().siblings('.select2').find('.select2-search__field').attr('placeholder');
				if (val.length === 0) {
					utils.toast(text + '不能为空');
					return false;
				}
			} else {
				val = val.trim();
				if (!val && !el.prop('disabled')) {
					utils.toast(el.siblings('label').text() + '不能为空');
					return false;
				}
			}
		}
		return true;
	}
	private ifSave(bool, state, cb) {
		let url;
		let type;
		let sendData;
		const addDetailEl = $('.add-detail-wrap');
		const title = addDetailEl.find('#title').val();
		const classify = this.selectTree.selected.id;
		const tag = addDetailEl.find('#add-select2').select2('val');
		const fieldEl = $('.add-detail-wrap').find('.fields-wrap');
		const addFields = [];
		const editFields = [];
		this.ifSaveMode = true;
		fieldEl.find('input').each((i, e) => {
			const el = $(e);
			const id = el.attr('data-id');
			const value = $(e).val();
			addFields.push({
				fieldMetaId: id,
				value: value
			});
			editFields.push({
				fieldId: id,
				value: value
			});
		});
		const attachment = [];
		addDetailEl.find('.content-delete-wrap').each((i, e) => {
			attachment.push($(e).attr('data-id'));
		});
		switch (state) {
			case 'add':
				url = '/api/repository/create';
				type = 'POST';
				sendData = {
					knowledgeTemplateId: this.templateId,
					knowledgeName: title,
					status: bool ? 1 : 2,
					labels: tag,
					fields: addFields,
					attachments: attachment,
					directoryId: classify
				};
				break;
			case 'modify':
				url = '/api/repository/update';
				type = 'PUT';
				sendData = {
					knowledgeId: this.knowledgeDetail.knowledgeId,
					status: bool ? 1 : 2,
					labels: tag,
					fields: editFields,
					attachments: attachment,
					directoryId: classify
				};
				break;
			case 'update':
				url = '/api/repository/upgrade';
				type = 'POST';
				sendData = {
					preKnowledgeId: this.knowledgeDetail.knowledgeId,
					status: bool ? 1 : 2,
					labels: tag,
					fields: editFields,
					attachments: attachment,
					directoryId: classify
				};
				break;
			default:
				url = '/api/repository/create';
				break;
		}
		$.ajax({
			type: type,
			url: url,
			processData: false,
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			success: (data) => {
				cb();
			}
		});
	}
	private cleanAddDetail() {
		const self = this;
		const addDetailEl = $('.add-detail-wrap');
		this.selectTree.clean();

		$('#add-select2').val(null).trigger('change');
		addDetailEl.find('.step1 #title,.step1 #author,.step1 textarea').val('');
		addDetailEl.find('.fields-wrap').html('');
		addDetailEl.find('.add-file-content-wrap').html('');
		this.addFileList = [];
		if (this.ifSaveMode && this.deleteArr.length !== 0) {
			$.ajax({
				url: `/attach/delete?${$.param({
					ids: this.deleteArr.join(',')
				})}`,
				method: 'DELETE',
				success: () => {
					self.deleteArr = [];
					self.uploadArr = [];
				}
			});
			return;
		}
		if (!this.ifSaveMode && this.uploadArr.length !== 0) {
			$.ajax({
				url: `/attach/delete?${$.param({
					ids: this.uploadArr.join(',')
				})}`,
				method: 'DELETE',
				success: () => {
					self.deleteArr = [];
					self.uploadArr = [];
				}
			});
		}
		this.ifSaveMode = false;
	}
	private renderSelect2() {
		for (let v of labels) {
			$('#add-select2').append(`<option value="${v.id}">${v.name}</option>`);
		}
		$('#add-select2').select2({
			placeholder: '标签'
		});
	}
	public showAdd(templateId) {
		this.templateId = templateId;
		let fields;
		for (let v of templates) {
			if (v.id.toString() === this.templateId) {
				fields = v.fields;
			}
		}
		this.renderFields(fields);
		this.changeFormStyle(1);
		this.changeToAdd();
	}
	public showModify(knowledgeDetail) {
		this.knowledgeDetail = knowledgeDetail;
		this.changeToEdit('modify');
	}
	public showUpdate(knowledgeDetail) {
		this.knowledgeDetail = knowledgeDetail;
		this.changeToEdit('update');
	}
	private changeToEdit(str) {
		this.editStatus = str;
		const label = this.knowledgeDetail.labels.map((v) => {
			return v.id;
		});
		this.renderFields(this.knowledgeDetail.fields);
		this.changeFormStyle(1);
		this.addDetail.updateTitle('编辑知识点：' + this.knowledgeDetail.knowledgeName);
		this.addDetailEl.find('#title').val(this.knowledgeDetail.knowledgeName).prop('disabled', true).siblings('label').addClass('active');
		this.selectTree.selected = this.knowledgeDetail.directory.directoryId;
		$('#add-select2').val(label).trigger('change');
		this.addFileList = this.knowledgeDetail.attachments.map((v) => {
			return {
				id: v.id,
				url: v.url,
				name: v.filename,
				type: v.type,
				size: v.filesize
			};
		});
		this.renderFile();
		this.addDetail.show();
	}
	private initSelectTree() {
		this.selectTree = new SelectTree({
			el: $('#select-tree'),
			placeholder: '类别',
			data: this.formatTreeObj(alldirectory)
		});
	}
	private formatTreeObj(obj) {
		const finalData = obj.map((v) => {
			return {
				id: !v.directoryId ? '#' : v.directoryId.toString(),
				text: !v.directoryName ? '没名字' : v.directoryName,
				parent: !v.parentDirectoryId ? '#' : v.parentDirectoryId.toString(),
				children: v.isHasChild ? true : false,
				a_attr: {
					class: v.isHasKnowledgeUpdate ? 'new' : null,
					'data-number': v.isHasKnowledgeUpdate ? v.knowledgeCount : null
				}
			};
		});
		return finalData;
	}
	private renderFields(fields) {
		for (let v of fields) {
			const id = v.id || v.fieldId;
			const value = v.value ? v.value : '';
			$('form.step2 .fields-wrap').append(`
				<div class="row">
					<div class="input-field col s12">
						<input class="required" data-id="${id}" type="text" value="${value}">
						<label class="active" for="title">
							${v.label}
						</label>
					</div>
				</div>
			`);
		}
	}
	private changeFormStyle(num) {// 序号从1开始
		const addDetailEl = $('.add-detail-wrap');
		addDetailEl.removeClass('st1 st2 st3').addClass('st' + num);
		addDetailEl.find('.kb-step-wrap li').removeClass('active').eq(num - 1).addClass('active');
	}
	private changeToAdd() {
		this.editStatus = 'add';
		this.addDetail.updateTitle('新增');
		this.addDetail.show();
		this.addDetailEl.find('#title').prop('disabled', false);
	}
}
interface IKbRightHot {
	el: JQuery;
	clickHotKnowledge: (el: JQuery) => void;
	clickHotLabel: (el: JQuery) => void;
}
export class KbRightHot {
	private op: any;
	constructor(op: IKbRightHot) {
		this.op = op;
		this.init();
	}
	private init() {
		this.op.el.addClass('right-side').append(rightHotPug());
		this.renderInfo();
		this.initDropDown();
		this.bindEvent();
	}
	private renderInfo() {
		this.getHostMsg(1, this.op.el.find('.hot-knowledge .comment'));
		this.getHostMsg(2, this.op.el.find('.hot-knowledge .collect'));
		$.ajax({
			type: 'GET',
			url: '/api/search/label/hot',
			success: (data) => {
				data.map((v) => {
					this.op.el.find('.hot-label .label').append(`
					<li data-id="${v.id}">${v.name}</li>
				`);
				});
			}
		});
	}
	private getHostMsg(type, el) {
		$.ajax({
			type: 'GET',
			url: '/api/search/knowledge/hot',
			data: {
				type: type
			},
			success: (data) => {
				data.map((v, i) => {
					let numStr = '';
					if (i < 10) {
						numStr = '0' + (i + 1);
					} else {
						numStr = i + 1;
					}
					el.append(`
						<li data-id="${v.knowledgeId}">${numStr}  ${v.knowledgeName}</li>
					`);
				});
			}
		});
	}
	private initDropDown() {
		$('.dropdown-button').dropdown({
			inDuration: 300,
			outDuration: 225,
			gutter: 0, // Spacing from edge
			belowOrigin: false, // Displays dropdown below the button
			alignment: 'left', // Displays dropdown with edge aligned to the left of button
		}
		);
	}
	private bindEvent() {
		const self = this;
		$('#hot-dropdown').on('click', 'li', function () {
			const el = $(this);
			const bigEl = self.op.el.find('.info-box-wrap');
			const commentEl = bigEl.find('.comment');
			const collectEl = bigEl.find('.collect');
			self.op.el.find('.dropdown-button span').text(el.text());
			if (el.data('type') === 'comment') {
				commentEl.show();
				collectEl.hide();
			} else {
				commentEl.hide();
				collectEl.show();
			}
		});
		$('.hot-knowledge .content-wrap').on('click', 'li', function () {
			self.op.clickHotKnowledge($(this));
		});
		$('.hot-label .label').on('click', 'li', function () {
			self.op.clickHotLabel($(this));
		});
	}
}
