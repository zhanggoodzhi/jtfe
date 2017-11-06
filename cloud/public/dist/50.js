webpackJsonp([50],{

/***/ 1135:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(548);


/***/ }),

/***/ 548:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(933);
__webpack_require__(36);
var KnowledgeTrainning;
(function (KnowledgeTrainning) {
    var ifStop = false;
    var ifFirst = true;
    $(init);
    function init() {
        if (!appId) {
            utils.alertMessage('获取appId失败错误');
        }
        else {
            getTrainStatus(function (data) {
                switch (data.status) {
                    // 载入后第一次查询如果为成功则为未开始
                    case 1:
                        renderProgressBar({
                            status: -1,
                            statusValue: "\u4E0A\u6B21\u8BAD\u7EC3\u6210\u529F,\u8BAD\u7EC3\u65F6\u95F4\u4E3A <b>" + data.createTime + "</b>",
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
                $('#experience-btn').on('click', function (e) {
                    location.assign($(e.currentTarget).data('href'));
                });
                $('#start-btn').on('click', train);
                $('#end-btn').on('click', stop);
            });
        }
    }
    function stop() {
        utils.confirmModal({
            msg: "\u7EC8\u6B62\u540E\u6B64\u6B21\u8BAD\u7EC3\u4E0D\u751F\u6548\uFF0C\u60A8\u786E\u8BA4\u8981\u7EC8\u6B62\u8BAD\u7EC3\u5417?",
            text: '确定',
            cb: function (modal, btn) {
                var loading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'train/stopTrain',
                    method: 'GET'
                }).done(function (msg) {
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
                }).always(function () {
                    loading();
                });
            }
        });
    }
    function getTrainStatus(cb) {
        $.ajax({
            type: 'POST',
            url: 'train/status',
            data: {
                appId: appId
            },
            success: function (res) {
                if (res.error) {
                    utils.alertMessage(res.msg, !res.error);
                }
                else {
                    var data = res.data;
                    if (cb !== undefined) {
                        cb(data);
                    }
                    else {
                        renderProgressBar(data);
                        if (data.status === 0) {
                            setTimeout(function () {
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
            success: function (res) {
                if (!res.data) {
                    ifFirst = false;
                }
                cb(utils.renderCommonTime(res.data.createTime));
            }
        });
    }
    function train(e) {
        var endLoading = utils.loadingBtn($(e.currentTarget));
        $.ajax({
            url: 'train/train',
            type: 'POST',
            data: {
                appId: appId
            },
            success: function (res) {
                if (!res.error) {
                    $('#start').hide();
                    getTrainStatus();
                    utils.alertMessage('已经发起训练请求,您可以切换到其它页面进行其它操作,训练状态可以观察训练机器人进度下方显示的内容', true);
                }
                else {
                    utils.alertMessage(res.msg, !res.error, false);
                }
            },
            complete: function () {
                endLoading();
            }
        });
    }
    /**
     * 渲染进度条并控制按钮显示状态
     *
     * @param {IResData} data
     */
    function renderProgressBar(data) {
        var startBtn = $('#start-btn').hide(), endBtn = $('#end-btn'), experienceBtn = $('#experience-btn');
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
                $('#status-text').html("\u8BAD\u7EC3\u6210\u529F,\u4E0A\u6B21\u8BAD\u7EC3\u65F6\u95F4\u4E3A" + data.createTime);
                break;
            case 2:
                startBtn.show();
                endBtn.hide();
                $('#progress-bar').width(0 * 100 + '%');
                if (ifStop) {
                    utils.alertMessage('训练已终止，您可以重新开始训练！', true);
                    $('#status-text').html('训练终止');
                    ifStop = false;
                }
                else {
                    $('#status-text').html(ifFirst ? '' : '训练失败'); // 防止字段闪烁
                }
                if (ifFirst) {
                    getLastSuccess(function (time) {
                        $('#status-text').html("\u8BAD\u7EC3\u6210\u529F,\u4E0A\u6B21\u8BAD\u7EC3\u65F6\u95F4\u4E3A" + time);
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
})(KnowledgeTrainning || (KnowledgeTrainning = {}));


/***/ }),

/***/ 933:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1135]);
//# sourceMappingURL=50.js.map