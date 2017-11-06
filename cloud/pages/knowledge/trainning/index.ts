import * as utils from 'utils';
import './index.less';
import 'time';
namespace KnowledgeTrainning {
	declare const appId: string;
	let ifStop = false;
	let ifFirst = true;
	interface IResData {
		status: number;
		statusValue: string;
		progress: number;
		createTime?: string;
	}

	$(init);

	function init() {

		if (!appId) {
			utils.alertMessage('获取appId失败错误');
		} else {
			getTrainStatus((data: IResData) => {
				switch (data.status) {
					// 载入后第一次查询如果为成功则为未开始
					case 1:
						renderProgressBar({
							status: -1,
							statusValue: `上次训练成功,训练时间为 <b>${data.createTime}</b>`,
							progress: 0
						});
						break;
					case 2:
						renderProgressBar(data);
						break;
					default:
						getTrainStatus();
						break;
				}

				$('#experience-btn').on('click', (e) => {
					location.assign($(e.currentTarget).data('href'));
				});

				$('#start-btn').on('click', train);
				$('#end-btn').on('click', stop);
			});
		}
	}
	function stop() {
		utils.confirmModal({
			msg: `终止后此次训练不生效，您确认要终止训练吗?`,
			text: '确定',
			cb: (modal, btn) => {
				const loading = utils.loadingBtn(btn);
				$.ajax({
					url: 'train/stopTrain',
					method: 'GET'
				}).done((msg) => {
					if (!msg.error) {
						modal.modal('hide');
						ifStop = true;
						utils.alertMessage('正在终止训练', true);
						// renderProgressBar({
						// 	status: -1,
						// 	statusValue: `训练终止`,
						// 	progress: 0
						// });
					}
				}).always(() => {
					loading();
				});
			}
		});
	}
	function getTrainStatus(cb?: Function) {
		$.ajax({
			type: 'POST',
			url: 'train/status',
			data: {
				appId: appId
			},
			success: (res) => {
				if (res.error) {
					utils.alertMessage(res.msg, !res.error);
				} else {
					const data: IResData = res.data;
					if (cb !== undefined) {
						cb(data);
					}
					else {
						renderProgressBar(data);
						if (data.status === 0) {
							setTimeout(() => {
								getTrainStatus(cb);
							}, 500);
						}
					}
				}
			}
		});
	}
	function getLastSuccess(cb) {
		$.ajax({
			type: 'GET',
			url: 'train/lastTrainSuccess',
			success: (res) => {
				if (!res.data) {
					ifFirst = false;
				}
				cb(utils.renderCommonTime(res.data.createTime));
			}
		});
	}

	function train(e: JQueryEventObject) {
		const endLoading = utils.loadingBtn($(e.currentTarget));
		$.ajax({
			url: 'train/train',
			type: 'POST',
			data: {
				appId: appId
			},
			success: (res) => {
				if (!res.error) {
					$('#start').hide();
					getTrainStatus();
					utils.alertMessage('已经发起训练请求,您可以切换到其它页面进行其它操作,训练状态可以观察训练机器人进度下方显示的内容', true);
				} else {
					utils.alertMessage(res.msg, !res.error, false);
				}
			},
			complete: () => {
				endLoading();
			}
		});
	}


    /**
     * 渲染进度条并控制按钮显示状态
     *
     * @param {IResData} data
     */
	function renderProgressBar(data: IResData) {
		const startBtn = $('#start-btn').hide(),
			endBtn = $('#end-btn'),
			experienceBtn = $('#experience-btn');
		switch (data.status) {
			case 0:
				startBtn.hide();
				endBtn.show();
				$('#status-text').html(data.statusValue);
				break;
			case 1:
				utils.alertMessage('训练完成, 您现在可以打开访客界面重新感受一下经过训练升级后的智能客服', true);
				startBtn.show();
				experienceBtn.show();
				endBtn.hide();
				$('#status-text').html(`训练成功,上次训练时间为${data.createTime}`);
				break;
			case 2:
				startBtn.show();
				endBtn.hide();

				$('#progress-bar').width(0 * 100 + '%');
				if (ifStop) {
					utils.alertMessage('训练已终止，您可以重新开始训练！', true);
					$('#status-text').html('训练终止');
					ifStop = false;
				} else {
					$('#status-text').html(ifFirst ? '' : '训练失败');// 防止字段闪烁
				}
				if (ifFirst) {
					getLastSuccess((time) => {
						$('#status-text').html(`训练成功,上次训练时间为${time}`);
						ifFirst = false;
					});
				}
				return;
			default:
				startBtn.show();
				endBtn.hide();
				$('#status-text').html(data.statusValue);
				break;
		}
		$('#progress-bar').width(data.progress * 100 + '%');

	}
}
