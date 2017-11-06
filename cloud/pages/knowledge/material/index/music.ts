import * as utils from 'utils';
import * as tables from 'new-table';
import * as bindAddMusicRes from './musicAddRes.pug';
import { Upload } from 'upload';
import './music.less';
import * as resourceUtils from './resourceUtils';
export function initMusic() {
	utils.tabShown($('#music-link'), (e) => { init(); });
}
let table: any,
	detail: any,
	detailEl,
	mediaId: any,
	timeLength: any,
	state: any,
	musicUrl: any,
	materialId: any = '',
	resourceId: any = '',
	$upBtn: JQuery,
	$musicShow: JQuery,
	toDeleteArr: any = [],
	uploadedArr: any = [],
	saveFlag: any = false;
let audio = document.createElement('audio');
declare const kbRestUrl;
declare const appid;
declare const group;
function init() {
	// $('#music-summary').parent().remove();
	initSidebar();
	initTable();
}
function initSidebar() {
	detail = new utils.SideBar({
		id: 'musicSideBar',
		title: '添加音乐素材',
		content: bindAddMusicRes(),
		width: 0.6,
		onHide: hideDel
	});
	detailEl = $('#musicSideBar');
}
function initTable() {
	const tableEl = $('#music-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			paging: true,
			pageLength: 10,
			serverSide: true,
			ajax: {
				method: 'POST',
				url: `${kbRestUrl}/resource/search/${appid}`,
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = tables.extendsData(d, {
						appid: appid,
						data: $.trim($('#music-search-title').val()),
						type: 'music',
						group: group
					});
					return utils.cleanObject(data);
				}
			},
			initComplete: initComplete,
			columns: [
				{ data: 'coverUrl', title: '歌名', render: renderMusic, className: 'prevent' },
				{ data: 'singer', title: '歌手' },
				{ data: 'album', title: '专辑' },
				{ data: 'timeLength', title: '歌曲时长', render: renderTimeLength },
				{ data: 'createTime', title: '时间', createdCell: tables.createAddTitle, render: utils.renderCommonTime },
				{
					data: 'materialId', title: '操作', className: 'prevent', render: (id) => {
						return resourceUtils.renderBtn(id, 'music');
					}
				}
			]
		}
	});
}
function renderMusic(coverUrl, type, row) {
	return `
		<div class="music-wrap clearfix" data-id="${coverUrl}">
			<i class="fa cloud-fa-icon fa-play-circle-o music-pause"></i>
			<i class="fa cloud-fa-icon fa-play-circle music-play"></i>
			&nbsp;&nbsp;<span class="title">${row.title}</span>
		<div>
	`;
}
function renderTimeLength(value) {
	let s = value;// 秒
	let m = 0;// 分
	let result: any = 0;
	if (s < 60) {
		result = '00:' + ('00' + s).substr(-2);
	} else if (s >= 60) {
		m = parseInt(s / 60 as any);
		s = parseInt(s % 60 as any);
		if (m > 0) {
			result = ('00' + m).substr(-2) + ':' + ('00' + s).substr(-2);
		}
	}
	return result;
}
function initComplete() {
	let $addResPug = $('.add-music-res'),
		$musicTable = $('#music-table'),
		$musicTab = $('#music-tab');
	$upBtn = $('#upload-music');
	$musicShow = $('.music-show');
	// music的tab点击后刷新表格
	utils.tabShown($('#music-link'), () => {
		table.reload();
	}, false);
	// 查询
	$('#music-search').on('click', () => {
		this.reload();
	});
	// 列表的删除
	resourceUtils.bindResourceDeleteEvent('music', () => {
		table.reload();
	});
	// 下载
	resourceUtils.bindResourceDownloadEvent('music');
	// 添加
	bindAddMusic($musicTab);
	// 编辑
	bindEditMusic($musicTable);
	// 列表中的音乐播放
	bindPlayEvent($musicTable);
	// 侧栏中的上传音乐
	initUpload();
	// 侧栏中的删除
	bindDelUpMusicEvent($addResPug);
	// 侧栏中的音乐播放
	bindPlayEvent($addResPug);
	// 侧栏中的预览
	bindMusicPreview();
	// 保存
	bindSaveMusic($addResPug);
	// 查询条件修改刷新表格
	resourceUtils.bindSearchEvent('music', () => {
		table.reload();
	});
	// link的tab点击后刷新表格
	utils.tabShown($('#music-link'), () => {
		table.reload();
	}, false);
	resourceUtils.triggerAddEvent();
}
// 上传音乐
function initUpload() {
	$('.file').on('change', '#upload-music', function () {
		toDeleteArr.push(mediaId);
		const thisFile = this.files[0];
		resourceUtils.uploadResource('music', thisFile, (data) => {
			mediaId = data.mediaId;
			uploadedArr.push(mediaId);
			timeLength = data.timeLength;
			musicUrl = data.url;
			$musicShow.html(renderMusicShow(musicUrl));
			$('#musicSideBar').find('.card-image').html(`
				<audio src="${musicUrl}" controls></audio>
			`);
			$('.preview-r').attr('data-id', musicUrl);
			$('.preview-r').css('display', 'inline-block');
		}, () => {
			const res = {
				data: {
					mediaId: 1,
					timeLength: 13431,
					url: 'images/text.mp3'
				}
			};
			mediaId = res.data.mediaId;
			uploadedArr.push(mediaId);
			timeLength = res.data.timeLength;
			musicUrl = res.data.url;
			$musicShow.html(renderMusicShow(musicUrl));
			$('#musicSideBar').find('.card-image').html(`
				<audio src="${musicUrl}" controls></audio>
			`);
		});
	});
}
// 侧栏中的删除
function bindDelUpMusicEvent(pEl) {
	pEl.on('click', 'a.music-operation', function (event) {
		toDeleteArr.push(mediaId);
		$musicShow.html('');
		/*mediaId = '';
		musicUrl = '';*/
		// materialId = '';
		// resourceId = '';
		$('.preview-r').attr('data-id', null);
		$('.preview-r').css('display', 'none');
		audio.pause();
		utils.alertMessage('删除音乐成功！', true);
		event.stopPropagation();
	});
}
// 音乐播放
function bindPlayEvent(pEl) {
	pEl.on('click', '.music-wrap', function (event) {
		event.preventDefault();
		const el = $(this);
		const url = el.data().id;
		if (el.is('.active')) {
			el.removeClass('active');
			audio.pause();
		} else {
			pEl.find('.music-wrap').removeClass('active');
			el.addClass('active');
			audio.src = url;
			audio.play();
		}
		$(audio).on('ended', () => {
			el.removeClass('active');
		});
		event.stopPropagation();
	});
}
// 编辑音乐
function bindEditMusic(pEl) {
	pEl.on('click', '.view-edit', function (event) {
		state = 'update';
		const el = $(this);
		const data = table.dt.row(el.parents('tr')).data();
		mediaId = data.mediaId;
		materialId = data.materialId;
		resourceId = data.resourceId;
		$('#song').val(data.title);
		$('#singer').val(data.singer);
		$('#album').val(data.album);
		$('.music-show').html(renderMusicShow(data.coverUrl));
		$('#musicSideBar').find('.card-image').html(`
				<audio src="${musicUrl}" controls></audio>
			`);
		detail.title = '编辑音乐素材';
		detail.show();
		event.stopPropagation();
	});
}
// 添加音乐素材
function bindAddMusic(pEl) {
	pEl.on('click', '#music-add-btn', (event) => {
		state = 'create';
		detail.title = '添加音乐素材';
		detail.show();
	});
}
// 保存
function bindSaveMusic(pEl) {
	pEl.on('click', '.music-save', function (event) {
		const musicName = $('#song').val();
		const singer = $('#singer').val();
		const album = $('#album').val();
		// 校验
		if (musicName === '') {
			utils.alertMessage('歌曲名称不能为空！', true);
			return;
		}
		if ($('.music-show').html() === '') {
			utils.alertMessage('歌曲不能为空！', true);
			return;
		}
		const nchangeArgs = {
			title: musicName,
			group: group,
			type: 'music',
			nonShared: {
				mediaId: mediaId,
				musicMediaId: mediaId,
				musicUrl: musicUrl,
				singer: singer,
				album: album,
				timeLength: timeLength
			}
		};
		if (state === 'create') {
			resourceUtils.resourceCreateAjax(nchangeArgs, (msg) => {
				saveFlag = true;
				table.reload();
				detail.hide();
				utils.alertMessage('新增音乐成功！', true);
			});
		} else if (state === 'update') {
			resourceUtils.resourceUpdateAjax(Object.assign(nchangeArgs, { materialId: materialId }), (msg) => {
				saveFlag = true;
				table.reload();
				detail.hide();
				utils.alertMessage('修改音乐成功！', true);
			});
		}
		event.stopPropagation();
	});
}
// 实时预览
function bindMusicPreview() {
	preview('#song', '歌曲名称', $('.song-preview'));
	preview('#singer', '歌手', $('.singer-preview'));
	preview('#album', '专辑', $('.singer-album-preview'));
}
function preview(inputEl, name, ref) {
	$('#musicSideBar').on('input', inputEl, function () {
		const inputVal = $.trim($(this).val());
		if (inputVal === '') {
			ref.text(name);
		} else {
			ref.text(inputVal);
		}
		event.stopPropagation();
	});
}
// 图片更新
function renderMusicShow(url) {
	const coverHtml = `<div class='row'>
							<div class='col s8 cover-box'>
								<audio src='${url}' controls="controls" class='showML'/>
								<div class='showMR'>
									<a class='music-operation'>删除</a>
								</div>
							</div>
						</div>`;
	return coverHtml;
}
// 清空form表单
function clearMusicForm() {
	$('#song').val('');
	$('#singer').val('');
	$('#album').val('');
	$('#upload-music').removeClass('disabled');
	$('.music-show').html('');
	materialId = '';
	resourceId = '';
	musicUrl = '';
	mediaId = '';
	$('.song-preview').val('歌曲名称');
	$('.song-related .singer-preview').val('歌手');
	$('.song-related .singer-album-preview').val('专辑');
}
// 真假删除处理函数
function hideDel() {
	if (saveFlag) {
		const nArr = toDeleteArr.filter(v => {
			return v !== '' && v !== null && v !== undefined;
		});
		resourceUtils.resourceFileDeleteMoreEvent(nArr, () => { toDeleteArr = []; });
	} else {
		const npArr = uploadedArr.filter(v => {
			return v !== '' && v !== null && v !== undefined;
		});
		resourceUtils.resourceFileDeleteMoreEvent(npArr, () => { uploadedArr = []; });
	}
	clearMusicForm();
	saveFlag = false;
}
