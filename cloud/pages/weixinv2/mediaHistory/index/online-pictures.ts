import { alertMessage, bindEnter, cleanObject, renderSimpleTime, tabShown, getImage } from 'utils';
import * as nTables from 'new-table';
import './online-pictures.less';
interface IOnlinePicturesAndDownloadRecord {
	rightParentId: string;// 右侧id
	ulFirstParentId: string;// ul的第一个父亲的Id
	authorization: boolean;// 权限
	listFotomoredownloadUrl: string;
	searchPicPreUrl: string;
	getVcgPicPreUrl: string;
	downloadSearchPicUrl: string;
	downloadVCGPicUrl: string;
	downloadData?: Object;
	editor;
}
export class OnlinePicturesAndDownloadRecord {
	private _options: IOnlinePicturesAndDownloadRecord;
	private _elements: {
		$onlinePicTab: JQuery;
		$onlinePicTabContent: JQuery;
		$downloadSign: JQuery;
		$downloadTable: JQuery;
	};
	constructor(options?: IOnlinePicturesAndDownloadRecord) {
		const _options: IOnlinePicturesAndDownloadRecord = {
			rightParentId: '#news-asset-column',
			ulFirstParentId: '#news-asset-wrap',
			authorization: false,
			listFotomoredownloadUrl: '',
			searchPicPreUrl: '',
			getVcgPicPreUrl: '',
			downloadSearchPicUrl: '',
			downloadVCGPicUrl: '',
			downloadData: {},
			editor: ''
		};
		Object.assign(_options, options);
		this._options = _options;
		this.init();
	}
	private init() {
		// 在线图库的tab对应的li元素
		const $onlinePicTab = $('<li role="presentation"><a id="view-tab" href="#view-net" role="tab" data-toggle="tab">在线图库</a></li>');
		// 在线图库的tab-content
		const $onlinePicTabContent = $(`
			<div id="view-net" role="tabpanel" class="tab-pane container">
				<div class="native-view">
					<div class="view-search-header row">
					<div class="col-sm-6 col-md-6 col-lg-6"><a class="href-view">下载视图网图片</a></div>
					<div class="col-sm-6 col-md-6 col-lg-6"><a class="href-china-view">下载VCG高清图片</a></div>
					</div>
					<div class="view-ctx">
					<div class="view-container">
						<div class="view-scroll row"></div>
						<div class="view-loading">
						<div class="with-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span>图片加载中......</span></div>
						<div class="no-source"></div>
						</div>
					</div>
					</div>
				</div>
				<div style="display:none" class="online-view">
					<div class="view-search-header row">
					<div class="col-sm-9 col-md-9 col-lg-9">
						<div class="input-group">
							<input id="search-bar" type="text" placeholder="输入关键词查找" class="form-control"/>
							<span class="input-group-btn">
								<button id="search-pic" type="button" class="btn btn-default">
									<span aria-hidden="true" class="glyphicon glyphicon-search"></span>
								</button>
							</span>
						</div>
					</div>
					<div class="col-sm-3 col-md-3 col-lg-3">
						<button id="back-native" class="btn btn-primary btn-sm">返回</button>
					</div>
					</div>
					<div class="view-ctx">
					<div class="view-container">
						<div class="view-scroll row"></div>
						<div class="view-loading">
						<div class="with-loading"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span>图片加载中......</span></div>
						<div class="no-source"></div>
						</div>
					</div>
					</div>
				</div>
			</div>`);
		// 下载标志
		const $downloadSign = $('<div class="download-record-sign"><i class="fa fa-list-ul"></i></div>');
		// 下载记录表格
		const $downloadTable = $(`
			<div class="right-sub">
				<ul role="tablist" class="nav nav-tabs">
					<li id='download-record-tab' role="presentation" class="active"><a href="#download-record-tab" aria-controls="blocktitle" role="tab" data-toggle="tab">下载记录</a></li>
				</ul>
				<div class="tab-content">
					<div id="download-record-tab" role="tabpanel" class="tab-pane in active">
					<table id="download-table" class="table fixed-table"></table>
					</div>
				</div>
				<div class="download-back">
					<button type="button" class="btn btn-primary btn-sm"><i class="fa fa-reply">&nbsp;&nbsp;</i><span>返回</span></button>
				</div>
			</div>`);
		if (this._options.authorization) {// 有权限
			$(this._options.ulFirstParentId).find('ul').append($onlinePicTab);
			$(this._options.ulFirstParentId).find('.tab-content').append($onlinePicTabContent);
			$(this._options.ulFirstParentId).append($downloadSign);
			$(this._options.rightParentId).append($downloadTable);
		}
		this._elements = {
			$onlinePicTab,
			$onlinePicTabContent,
			$downloadSign,
			$downloadTable
		};
	}
	public initOnlinePics() {
		const listFotomoredownloadUrl = this._options.listFotomoredownloadUrl;
		const searchPicPreUrl = this._options.searchPicPreUrl;
		const getVcgPicPreUrl = this._options.getVcgPicPreUrl;
		const downloadSearchPicUrl = this._options.downloadSearchPicUrl;
		const downloadVCGPicUrl = this._options.downloadVCGPicUrl;
		const editor = this._options.editor;
		/*===================视图网相关功能=======================*/
		let preUrl;// url的前部分
		let downloadUrl;// 下载Url
		/*=================视图网图库本地下载相关功能=======================*/
		let nativePage = 1;
		let nativeTotalPage = 0;
		const $nativeViewLoadingSign = $('.native-view .view-loading .with-loading');
		const $nativeViewNoSource = $('.native-view .view-loading .no-source');

		(function ($) {
			bindEvents();
			// initRecordTable();
		})(jQuery);

		function bindEvents() {
			bindTabEvent();
			bindNativeViewScrollEvent();
			bindJumpViewEvent();
			bindJumpVcgEvent();
			bindBackNativeEvent();
			bindOnlineViewScrollEvent();
			bindDownloadEvent();
			bindSearchViewEvent();
			bindEnterSearchEvent();
			bindDownloadRecordEvent();
			bindDownloadBackEvent();
			bindInsertMediaEvent();
		}
		// 点击view-tab，显示在线图库
		function bindTabEvent() {
			$('#view-tab').one('shown.bs.tab', () => {
				// mediaType = 1;
				$('.native-view .view-scroll').empty();
				getNativeView(1);
				$('.native-view').show();
				$('.online-view').hide();
			});
		}
		// 查询本地视图
		function getNativeView(thisPage) {
			let imghtml = '';
			$nativeViewLoadingSign.show();
			$nativeViewNoSource.html('');
			$.ajax({
				url: listFotomoredownloadUrl,
				data: {
					pageNumber: thisPage
				},
				success: function (d) {
					$nativeViewLoadingSign.hide();
					const data = d.rows;
					if (d.total === 0) {
						$nativeViewNoSource.html('没有图片，快去下载吧~');
					} else if (data.length <= 20) {
						nativeTotalPage = Math.ceil(d.total / 20);
						d.rows.forEach(v => {
							imghtml += `<div class='col-sm-6 col-md-6 col-lg-6 single-img item' data-url='${v.localUrl}' data-id='${v.id}'>
									<div class='img-box' style='background:url(${v.localUrl})'></div>
								</div>`;
						});
						$('.native-view .view-scroll').append(imghtml);
					}
				},
				error: () => {
					$nativeViewLoadingSign.hide();
					$nativeViewNoSource.html('图片加载失败!');
				}
			});
		}
		// 本地视图网滚动翻页
		function bindNativeViewScrollEvent() {
			$('.native-view .view-ctx').on('scroll', function () {
				const documentHeight = $(this)[0].scrollHeight;// 实际内容的高度
				const scrollTopHeight = $(this).scrollTop();
				const viewHeight = $(this).outerHeight();
				const botHeight = 50;
				if (scrollTopHeight + viewHeight + botHeight >= documentHeight) {
					++nativePage;
					if (nativePage <= nativeTotalPage) {
						getNativeView(nativePage);
					}
				}
			});
		}
		let initialPaginationKeyword;
		// 无限滚动翻页
		let initialPaginationPage = 1;
		let searchPaginationPage = 1;
		let searchPaginationKeyword = '';
		let searchFlag = false;
		let viewTotalPage = 0;
		// 跳转到视图网图片页面
		function bindJumpViewEvent() {
			$('.href-view').on('click', () => {
				$('.native-view').hide();
				$('.online-view').show();
				$('.online-view .view-scroll').empty();
				preUrl = searchPicPreUrl;
				downloadUrl = downloadSearchPicUrl;
				initialPaginationKeyword = 'moutain';
				getView(1, 'moutain');
				initialPaginationPage = 1;
				searchPaginationPage = 1;
				searchPaginationKeyword = '';
				searchFlag = false;
				viewTotalPage = 0;
			});
		}
		// 跳转到VCG高清图片页面
		function bindJumpVcgEvent() {
			$('.href-china-view').on('click', () => {
				$('.native-view').hide();
				$('.online-view').show();
				$('.online-view .view-scroll').empty();
				preUrl = getVcgPicPreUrl;
				downloadUrl = downloadVCGPicUrl;
				initialPaginationKeyword = '';
				getView(1, '');
				initialPaginationPage = 1;
				searchPaginationPage = 1;
				searchPaginationKeyword = '';
				searchFlag = false;
				viewTotalPage = 0;
			});
		}
		/*=================视图网图库相关功能=======================*/
		// 返回视图网本地图库，查询视图网本地图
		function bindBackNativeEvent() {
			$('#back-native').on('click', function () {
				$('.native-view').show();
				$('.online-view').hide();
				$('.native-view .view-scroll').empty();
				getNativeView(1);
			});
		}

		// 滚动时翻页
		function bindOnlineViewScrollEvent() {
			$('.online-view .view-ctx').on('scroll', function () {
				const documentHeight = $(this)[0].scrollHeight;// 实际内容的高度
				const scrollTopHeight = $(this).scrollTop();
				const viewHeight = $(this).outerHeight();
				const botHeight = 50;
				if (searchFlag) {
					if (scrollTopHeight + viewHeight + botHeight >= documentHeight) {
						++searchPaginationPage;
						if (searchPaginationPage <= viewTotalPage) {
							getView(searchPaginationPage, searchPaginationKeyword);
						}
					}
				} else {
					if (scrollTopHeight + viewHeight + botHeight >= documentHeight) {
						++initialPaginationPage;
						if (initialPaginationPage <= viewTotalPage) {
							getView(initialPaginationPage, initialPaginationKeyword);
						}
					}
				}
			});
		}
		// 获取视图网图片数据
		function getView(thisPage, thisKeyword) {
			let imghtml = '';
			const $viewLoadingSign = $('.online-view .view-loading .with-loading');
			const $viewNoSource = $('.online-view .view-loading .no-source');
			$viewLoadingSign.show();
			$viewNoSource.html('');
			$.ajax({
				url: `${preUrl}?page=${thisPage}&keyword=${thisKeyword}`,
				success: function (d) {
					$viewLoadingSign.hide();
					const data = d.rows;
					if (data.length === 0 && thisPage === 1) {
						$viewNoSource.html('暂无数据！');
					} else if (data.length <= 20) {
						viewTotalPage = Math.ceil(d.total / 20);
						data.forEach(v => {

							imghtml += `<div class='col-sm-6 col-md-6 col-lg-6 single-img'>
										<div class='download-cover'>
											<button type="button" class="btn btn-default download-btn" data-thumb=${v.thumb} data-id=${v.photoId} data-origin=${v.origin} data-download=${v.download}>
												<a href='${v.origin}' download><span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>下载</a>
											</button>
										</div>
										<div class='img-box' style='background-image: url("${v.thumb}");'></div>
									</div>`;
						});
						$('.online-view .view-scroll').append(imghtml);

						$('.online-view .single-img').each(function () {
							// 根据后端的download字段，判断是否显示下载遮罩
							const download = $(this).children('.download-cover').children('.download-btn').data('download');
							if (!download) {
								// 鼠标浮动到图片上面，遮罩和下载按钮出现
								$(this).off('mouseenter mouseleave').hover(function () {
									$(this).children('.download-cover').slideDown('fast');
								}, function () {
									$(this).children('.download-cover').slideUp('fast');
								});
							} else {
								$(this).children('.download-cover').hide();
							}

						});
					}
				},
				error: () => {
					$viewLoadingSign.hide();
					$viewNoSource.html('图片加载失败!');
				}
			});
		}
		// 下载功能
		function bindDownloadEvent() {
			$('.online-view').on('click', '.single-img .download-btn', function () {
				// 下载功能
				// $(this).children('.download-cover').children('.download-btn').on('click', function (e) {
				const photoId = $(this).data('id');
				const thumb = $(this).data('thumb');
				const origin = $(this).data('origin');
				$.ajax({
					url: `${downloadUrl}`,
					type: 'POST',
					data: {
						photoId: photoId,
						thumb: thumb,
						origin: origin
					},
					success: (msg) => {
						if (!msg.error) {
							$(this).parent('.download-cover').remove();
							alertMessage('下载图片成功！', true);
						} else {
							alertMessage('下载图片失败！');
						}
					}
				});
				// });
			});
		}
		// 点击查询功能，清空原来图片，查询第一页数据并显示
		function searchView() {
			$('.online-view .view-scroll').html('');
			searchFlag = true;
			searchPaginationKeyword = $.trim($('#search-bar').val());
			searchPaginationPage = 1;
			if (searchPaginationKeyword === '') {
				searchPaginationKeyword = initialPaginationKeyword;
			}
			getView(searchPaginationPage, searchPaginationKeyword);
		}
		// 点击搜索功能查询
		function bindSearchViewEvent() {
			$('#search-pic').on('click', () => {
				searchView();
			});
		}
		function bindEnterSearchEvent() {
			// 绑定回车查询功能
			bindEnter($('#search-bar'), () => {
				searchView();
			});
		}
		/*===================下载记录相关功能=======================*/
		// 下载记录表格初始化
		let recordTable;
		let recordTableComplete = false;
		// 点击下载记录图标，显示下载记录表格
		function bindDownloadRecordEvent() {
			$('.download-record-sign').on('click', () => {
				$('.news-asset-wrap').hide();
				if (recordTableComplete) {
					recordTable.reload();
				} else {
					initRecordTable();
				}
				$('.right-sub').show();
			});
		}
		// 返回功能
		function bindDownloadBackEvent() {
			$('.download-back').on('click', () => {
				$('.news-asset-wrap').show();
				$('.right-sub').hide();
			});
		}
		let thisPageNumber;
		function initRecordTable() {
			recordTable = new nTables.Table({
				el: $('#download-table'),
				options: {
					serverSide: true,
					paging: true,
					ajax: {
						url: listFotomoredownloadUrl,
						type: 'POST',
						dataSrc: data => data.rows,
						data: (data) => {
							thisPageNumber = nTables.getPage(data);
							return cleanObject({
								pageNumber: thisPageNumber
							});
						}
					},
					columns: [
						{ data: 'id', title: '序号', width: '25%', render: renderIndex },
						{ data: 'thumb', title: '图片', className: 'prevent', width: '25%', render: renderRecordImg },
						{ data: 'id', title: 'id', width: '25%' },
						{ data: 'tsp', title: '创建时间', render: renderSimpleTime, width: '25%' }
					],
					initComplete: initRecordComplete
				}
			});

			function renderIndex(data, type, row, meta) {
				return (thisPageNumber - 1) * 20 + meta.row + 1;
			}

			function renderRecordImg(data, type, row) {
				return `<div style='background:url(${data})' class='record-img' data-origin='${row.origin}' title='点击查看大图'></div>`;
			}
		}
		function initRecordComplete() {
			recordTableComplete = true;
			bindViewLargeEvent();
		}
		// 点击下载图片，查看大图
		function bindViewLargeEvent() {
			$('#download-table').on('click', '.record-img', function () {
				const modalRoot = $('#record-modal');
				const oriImg = $(this).data('origin');
				modalRoot.find('img').attr('src', `${oriImg}`);
				modalRoot.modal('show');
			});
		}
		// 点击右侧，把多媒体插入到编辑器中
		function bindInsertMediaEvent() {
			// 点击单个图片或者视频插入到富文本编辑器
			$('.native-view').on('click', '.item', function (e) {
				const mediaUrl = $(this).data('url');
				const mediaId = $(this).data('id');
				editor.command(e, 'insertHtml', `<img id="${mediaId}" src="${mediaUrl}" style="max-width:100%">`);
			});
		}
	}
}
