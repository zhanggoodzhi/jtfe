webpackJsonp([31],{

/***/ 1176:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(588);


/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(968);
var new_table_1 = __webpack_require__(7);
var tables = __webpack_require__(13);
var utils = __webpack_require__(5);
var upload_1 = __webpack_require__(30);
var wxId;
var Weixinv2Index;
(function (Weixinv2Index) {
    var imgUrl;
    var upload = new upload_1.Upload({
        url: 'weixinv2/uploadQrcode',
        accept: 'image/png, image/jpeg, image/jpg',
        name: 'attach',
        btn: $('#imgcover'),
        success: function (id, name, data) {
            if (!data.error) {
                $('#imgcover').css('backgroundImage', 'url(' + data.msg + ')');
                imgUrl = data.msg;
            }
            else {
                utils.alertMessage(data.msg);
            }
        }
    });
    var table = new new_table_1.Table({
        el: $('#table'),
        options: {
            serverSide: true,
            paging: true,
            select: false,
            ajax: {
                url: 'weixinv2/list',
                type: 'GET',
                dataSrc: function (data) {
                    var syncMap = {};
                    data.rows.forEach(function (row, index) {
                        if (row.syncprogress !== 100) {
                            syncMap[row.id] = index;
                        }
                    });
                    if (!$.isEmptyObject(syncMap)) {
                        syncPolling(syncMap);
                    }
                    return data.rows;
                },
                data: function (data) {
                    return new_table_1.extendsData(data);
                }
            },
            initComplete: initComplete,
            columns: [
                { name: 'wxName', data: 'wxName', width: '105px', title: '名称', createdCell: tables.createAddTitle },
                { name: 'wxAppId', data: 'wxAppId', width: '160px', title: 'APPID', createdCell: tables.createAddTitle },
                { name: 'appSecret', data: 'appSecret', title: 'APPSECRET', createdCell: tables.createAddTitle },
                /*{ name: 'status', data: 'status', width: '60px', title: '状态', render: (text) => { return text === 1 ? '已认证' : '未认证'; } },*/
                { name: '公众号类型', data: 'accountType', width: '80px', title: '公众号类型', render: renderType },
                { name: 'action', data: 'syncprogress', title: '操作', width: '350px', render: renderBtns }
            ]
        }
    });
    function syncPolling(syncMap) {
        $.ajax('weixinv2/syncCredential', {
            method: 'POST',
            abortOnRetry: true,
            data: {
                credentialIds: Object.keys(syncMap).join(',')
            }
        })
            .done(function (res) {
            if (!res.error && res.data && res.data.length > 0) {
                res.data.forEach(function (v) {
                    var percent = Number(v.name), cell = table.dt.cell(syncMap[v.id], 'action:name');
                    cell.data(percent);
                    $(cell.node()).html(cell.render('display'));
                    if (percent === 100) {
                        delete syncMap[v.id];
                    }
                });
                if (!$.isEmptyObject(syncMap)) {
                    setTimeout(function () {
                        syncPolling(syncMap);
                    }, 2000);
                }
            }
        });
    }
    function renderType(accountType) {
        switch (accountType) {
            case 1:
                return '服务号';
            case 2:
                return '订阅号';
            case 3:
                return '企业号';
            default:
                return '';
        }
    }
    function renderBtns(data, type, row) {
        if (row.syncprogress !== 100) {
            return "<p class=\"table-td-info\">\u300C" + data + "%\u300D\u7D20\u6750\u540C\u6B65\u4E2D...</p>";
        }
        var user = '';
        if (row.accountType !== 3) {
            user = row.administrators ? "<a class=\"btn btn-link btn-sm change-user\">\u4FEE\u6539\u7BA1\u7406\u5458</a>" : "<a class=\"btn btn-link btn-sm bind-user\">\u7ED1\u5B9A\u7BA1\u7406\u5458</a>";
        }
        return "\n        <div class=\"row-input\" data-wxAppId=\"" + row.wxAppId + "\" data-id=\"" + row.id + "\">\n            <a style=\"padding-left:0;\" href=\"weixinv2/material/mediaHistory/index?id=" + row.id + "\" class=\"btn btn-link btn-sm\">\u7D20\u6750\u7BA1\u7406</a>\n\t\t\t" + user + "\n            <a href=\"weixinv2/updateWechatCredentialInfo.do?id=" + row.id + "\" class=\"btn btn-link btn-sm\">\u7F16\u8F91</a>\n            <button class=\"sync btn btn-link btn-sm\">\u7D20\u6750\u540C\u6B65</button>\n            " + ((adminType !== 2 || userExtraData === '') ?
            '<button class="dele btn btn-link btn-sm" type= "button"> 解除绑定 </button>'
            : '') + "\n        </div>";
    }
    // 关注公众号，选择企业号时，只能选择不同步和全部
    function accountAttend() {
        $('#accountType input').on('change', function () {
            // debugger;
            if (parseInt($(this).val()) === 3) {
                $('.nosync-label input').click();
                $('.accNot').hide();
            }
            else {
                $('.week-label input').click();
                $('.accNot').show();
            }
        });
    }
    function initComplete() {
        var dt = table.dt;
        accountAttend();
        var modalEl = $('#bind-user-modal');
        $('#table').on('click', '.bind-user', function (e) {
            var rowData = dt.row($(this).closest('tr')).data();
            wxId = rowData.id;
            modalEl.find('.modal-title').text('绑定管理员');
            modalEl.find('#delete-btn').hide();
            modalEl.modal('show');
            modalEl.find('#input-name').val(rowData.wxName);
            modalEl.find('#input-nickname').val(rowData.nickName);
            modalEl.find('#input-account').val(rowData.administrators);
        });
        $('#table').on('click', '.change-user', function (e) {
            var rowData = dt.row($(this).closest('tr')).data();
            wxId = rowData.id;
            modalEl.find('.modal-title').text('修改管理员');
            modalEl.find('#delete-btn').show();
            modalEl.modal('show');
            modalEl.find('#input-name').val(rowData.wxName);
            modalEl.find('#input-nickname').val(rowData.nickName);
            modalEl.find('#input-account').val(rowData.administrators);
        });
        modalEl.on('click', '#user-save', function (e) {
            var name = modalEl.find('#input-name').val().trim();
            var nickname = modalEl.find('#input-nickname').val().trim();
            var account = modalEl.find('#input-account').val().trim();
            if (nickname === '') {
                utils.alertMessage('微信昵称不能为空!');
                return;
            }
            if (account === '') {
                utils.alertMessage('微信号不能为空!');
                return;
            }
            var endLoading = utils.loadingBtn($(this));
            $.ajax({
                url: 'weixinv2/addAuditor',
                method: 'POST',
                data: {
                    wechatId: wxId,
                    nickName: nickname,
                    wechatNumber: account
                }
            }).done(function (res) {
                if (!res.error) {
                    if (modalEl.find('.modal-title').text() === '绑定管理员') {
                        utils.alertMessage('管理员绑定成功!', true);
                    }
                    else {
                        utils.alertMessage('管理员修改成功!', true);
                    }
                    modalEl.modal('hide');
                    dt.ajax.reload();
                }
                else {
                    utils.alertMessage(res.msg, !res.error);
                }
            })
                .always(function () {
                endLoading();
            });
        });
        modalEl.on('click', '#delete-btn', function (e) {
            utils.confirmModal({
                msg: "\u786E\u8BA4\u5220\u9664\u8BE5\u7BA1\u7406\u5458\u5417?",
                cb: function (modal, btn) {
                    var endLoading = utils.loadingBtn(btn);
                    $.ajax({
                        url: 'weixinv2/deleteAuditor',
                        type: 'POST',
                        data: {
                            wechatId: wxId
                        },
                        success: function (msg) {
                            if (!msg.error) {
                                table.reload();
                                modal.modal('hide');
                                modalEl.modal('hide');
                            }
                            utils.alertMessage(msg.msg, !msg.error);
                        },
                        complete: function () {
                            endLoading();
                        }
                    });
                }
            });
        });
        $('#submit').on('click', addWxAccount);
        $('#addWechat').on('hidden.bs.modal', clearModal);
        $('#table').on('click', '.sync', function (e) {
            var endFn = utils.loadingBtn($(e.target));
            // const wxAppSecret: string = $(e.target).closest('.row-input').attr('data-wxAppSecret');
            var wxid = $(e.target).closest('.row-input').attr('data-id');
            sync(wxid, endFn);
        });
        $('#table').on('click', '.dele', function (e) {
            var id = $(e.target).closest('.row-input').attr('data-id');
            dele(id);
        });
        tables.bindPageChange(dt, $('#page-change'));
    }
    function addWxAccount() {
        var sendData = {};
        var el = $('#addWechat');
        var flag = false;
        for (var _i = 0, _a = el.find('input[type=text]').toArray(); _i < _a.length; _i++) {
            var v = _a[_i];
            var element = $(v);
            var data = element.data();
            var name_1 = element.prop('name');
            var value = element.val();
            sendData[name_1] = value;
            if (data.required && element.val() === '') {
                utils.alertMessage(element.parent().prev().text() + '不能为空!');
                flag = true;
                return;
            }
        }
        var checkInput = el.find('input:checked');
        checkInput.each(function (i, e) {
            sendData[$(e).attr('name')] = $(e).val();
        });
        sendData.coverLocalUri = imgUrl;
        var endSubmit = utils.loadingBtn($('#submit'));
        var endConnet = utils.loadingBtn($('#connect-btn'));
        // const p = utils.alertMessage('正在关联公众号', true, false);
        $.ajax({
            url: 'weixinv2/addWechatCredential',
            type: 'POST',
            data: utils.cleanObject(sendData),
            success: function (data) {
                // p.remove();
                if (!data.error) {
                    $('#addWechat').modal('hide');
                    // table.draw();
                    table.reload(true);
                    clearModal();
                }
                utils.alertMessage(data.msg, !data.error);
            },
            complete: function () {
                endSubmit();
                endConnet();
            }
        });
    }
    function clearModal() {
        var el = $('#addWechat');
        el.find('input[type="text"]').val('');
        el.find('input[data-default="true"]').click();
        $('#imgcover').css('backgroundImage', "url(" + ctx + "/images/upqrcode.png)");
        imgUrl = null;
    }
    /**
     *
     *
     * @param {string} wxAppId 发给后台的id
     * @param {Function} endFn 结束‘加载中’的函数
     */
    function sync(wxid, endFn) {
        $.ajax({
            url: 'weixinv2/resync',
            data: {
                'credentialId': wxid
            },
            type: 'post',
            success: function (data) {
                endFn();
                utils.alertMessage(data.msg, !data.error);
                if (!data.error) {
                    table.reload(true);
                }
            },
            complete: function () {
                endFn();
            }
        });
    }
    /**
     *
     *
     * @param {string} id 发给后台的id
     */
    function dele(id) {
        utils.confirmModal({
            msg: '您确定要解除绑定么？',
            text: '解除绑定',
            cb: function (modal, btn) {
                var endLoading = utils.loadingBtn(btn);
                $.ajax({
                    url: 'weixinv2/deleteWechatCredential',
                    data: {
                        wechatId: id
                    },
                    type: 'post',
                    success: function (data) {
                        if (!data.error) {
                            table.reload(true);
                            modal.modal('hide');
                        }
                        utils.alertMessage(data.msg, !data.error);
                    },
                    complete: function () {
                        endLoading();
                    }
                });
            }
        });
    }
})(Weixinv2Index || (Weixinv2Index = {}));


/***/ }),

/***/ 968:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1176]);
//# sourceMappingURL=31.js.map