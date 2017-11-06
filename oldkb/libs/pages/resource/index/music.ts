import * as utils from 'utils';
import * as tables from 'tables';
import * as bindAddMusicRes from './musicAddRes.pug';
import { Uploader } from 'upload';
import './music.less';
export function initMusic() {
	utils.tabShown($('#music-link'), (e) => { init(); });
};
let table: any,
	detail: any,
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
function init() {
	detail = new utils.SideDetail({
		title: '添加音乐素材',
		html: bindAddMusicRes(),
		className: 'music-add-res',
		hideFn: hideDel,
		menus: [utils.renderSideMenu('保存', 'music-save')]
	});
	$('#music-summary').parent().remove();
	const tableEl = $('#music-table');
	table = new tables.Table({
		el: tableEl,
		options: {
			serverSide: true,
			ajax: {
				method: 'GET',
				url: '/resource/list',
				dataSrc: function (data) {
					const d = data.data;
					return d;
				},
				data: function (d: any) {
					const data = tables.extendsData(d, utils.getSearchParams('music'));
					const newData = utils.cleanObject(data);
					return newData;
				}
			},
			columns: [
				{ data: 'coverUrl', title: '音乐标题', render: renderMusic, className: 'prevent' },
				{ data: 'singer', title: '歌手' },
				{ data: 'album', title: '专辑' },
				{ data: 'timeLength', title: '歌曲时长', render: renderTimeLength },
				{ data: 'createTime', title: '创建时间', createdCell: utils.createAddTitle, render: utils.renderTime },
				{ data: 'materialId', title: '操作', className: 'prevent', render: renderDownLoadAndEditAndDeleteBtn }
			]
		},
		initComplete: initComplete
	});
}
function renderMusic(coverUrl, type, row) {
	return `
		<div class="music-wrap clearfix" data-id="${coverUrl}">
			<i class="material-icons music-pause">play_circle_outline</i>
			<i class="material-icons music-play">pause_circle_outline</i>
			&nbsp;&nbsp;<span class="title">${row.title}</span>
		<div>
	`;
}
function renderDownLoadAndEditAndDeleteBtn(data, type, row) {
	return `
		<i data-url='${row.coverUrl}' class='view-download kb-icon kb-download'></i>
		<i data-id='${data}' class='view-edit kb-icon kb-edit'></i>
		<i data-id='${data}' class='view-delete kb-icon kb-delete'></i>
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
	let $addResPug = $('.music-add-res'),
		$musicTable = $('#music-table'),
		$musicTab = $('#music-tab');
	$upBtn = $('#upload-music');
	$musicShow = $('.music-show');
	utils.tabShown($('#music-link'), () => {
		this.reload();
	}, false);
	// 查询
	$('#music-search').on('click', () => {
		this.reload();
	});
	// 列表的删除
	utils.bindResourceDeleteEvent('music', () => {
		table.reload();
	});
	// 下载
	utils.bindResourceDownloadEvent('music');
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
	bindCancel();
}
// 上传音乐
function initUpload() {
	new Uploader({
		btn: $upBtn,
		accept: '.mid,.midi,.oga,.wav,.mp3',
		url: '/resource/file/upload',
		name: 'file',
		params: {
			type: 'music'
		},
		success: (id, name, res) => {
			mediaId = res.data.mediaId;
			uploadedArr.push(mediaId);
			timeLength = res.data.timeLength;
			musicUrl = res.data.url;
			$musicShow.html(renderMusicShow(musicUrl));
			$upBtn.addClass('disabled');
			$('.preview-r').attr('data-id', musicUrl);
			$('.preview-r').css('display', 'inline-block');
		}
	});
}
// 侧栏中的删除
function bindDelUpMusicEvent(pEl) {
	pEl.on('click', 'a.music-operation', function (event) {
		toDeleteArr.push(mediaId);
		$musicShow.html('');
		mediaId = '';
		musicUrl = '';
		$upBtn.removeClass('disabled');
		// materialId = '';
		// resourceId = '';
		$('.preview-r').attr('data-id', null);
		$('.preview-r').css('display', 'none');
		audio.pause();
		utils.toast('删除音乐成功！');
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
		$('#upload-music').addClass('disabled');
		$('.preview-r').attr('data-id', data.coverUrl);
		$('.preview-r').css('display', 'inline-block');
		detail.updateTitle('编辑音乐素材');
		detail.show();
		event.stopPropagation();
	});
}
// 添加音乐素材
function bindAddMusic(pEl) {
	pEl.on('click', '#music-add', (event) => {
		state = 'create';
		detail.updateTitle('添加音乐素材');
		initUpload();
		detail.show();
		event.stopPropagation();
	});
}
// 保存
function bindSaveMusic(pEl) {
	pEl.on('click', '.music-save', function (event) {
		saveFlag = true;
		const musicName = $('#song').val();
		const singer = $('#singer').val();
		const album = $('#album').val();
		// 校验
		if (musicName === '') {
			utils.toast('歌曲名称不能为空！');
			return;
		}
		if ($('.music-show').html() === '') {
			utils.toast('歌曲不能为空！');
			return;
		}
		let url: any, method: any, operation: any;
		if (state === 'create') {
			url = '/resource/create';
			method = 'POST';
			operation = '添加';
		} else if (state === 'update') {
			url = '/resource/update';
			method = 'PUT';
			operation = '修改';
		}
		utils.ajax({
			url: url,
			method: method,
			contentType: 'application/json',
			processData: false,
			data: JSON.stringify({
				title: musicName,// 歌名
				type: 'music',
				resourceId: resourceId,
				materialId: materialId,
				nonShared: {
					musicMediaId: mediaId,
					musicUrl: musicUrl,
					singer: singer,
					album: album,
					timeLength: timeLength
				}
			})
		}, () => {
			table.reload();
			detail.hide();
		});
		// $.ajax({
		// 	url: url,
		// 	method: method,
		// 	contentType: 'application/json',
		// 	processData: false,
		// 	data: JSON.stringify({
		// 		title: musicName,// 歌名
		// 		type: 'music',
		// 		resourceId: resourceId,
		// 		materialId: materialId,
		// 		nonShared: {
		// 			musicMediaId: mediaId,
		// 			musicUrl: musicUrl,
		// 			singer: singer,
		// 			album: album,
		// 			timeLength: timeLength
		// 		}
		// 	}),
		// 	success: () => {
		// 		table.reload();
		// 		detail.hide();
		// 	}
		// });
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
	$('.music-add-res').on('input', inputEl, function () {
		const inputVal = $.trim($(this).val() as string);
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
								<div class='row'>
									<audio src='${url}' controls="controls" class='showML'/>
									<div class='showMR'>
										<a class='music-operation'>删除</a>
									</div>
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
	$('.song-preview').val('歌曲名称');
	$('.song-related .singer-preview').val('歌手');
	$('.song-related .singer-album-preview').val('专辑');
	$('.preview-r').attr('data-id', null);
	$('.preview-r').css('display', 'none');
}
// 真假删除处理函数
function hideDel() {
	if (saveFlag) {
		utils.resourceFileDeleteMoreEvent(toDeleteArr);
	} else {
		utils.resourceFileDeleteMoreEvent(uploadedArr);
	}
	clearMusicForm();
	saveFlag = false;
}
//
function bindCancel() {
	$('.music-cancel').on('click', () => {
		detail.hide();
	});
}
