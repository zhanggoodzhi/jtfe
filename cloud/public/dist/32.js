webpackJsonp([32],{

/***/ 1175:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(587);


/***/ }),

/***/ 587:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(967);
__webpack_require__(7);
var utils_1 = __webpack_require__(5);
var tables = __webpack_require__(13);
var Weixinv2Index;
(function (Weixinv2Index) {
    var table;
    var t;
    $(function () {
        var btn = $('#sync-btn'), account = $('#weixin-account');
        initTable();
        account.on('change', function (e) {
            var val = $(e.currentTarget).val();
            if (val === '') {
                btn.prop('disabled', 'true');
            }
            else {
                btn.prop('disabled', '');
            }
        });
    });
    /**
     * 初始化表格
     */
    function initTable() {
        table = $('#table').DataTable(Object.assign(tables.commonConfig(), {
            select: false,
            ajax: {
                url: 'weixinv2/group/listUser',
                type: 'GET',
                data: function (data) {
                    return {
                        page: tables.getPage(data),
                        rows: data.length,
                        credentialId: $('#weixin-account').val(),
                        groupId: $('#weixin-group').val()
                    };
                },
                dataSrc: function (data) { return data.rows; }
            },
            initComplete: initComplete,
            columns: [
                { data: 'key.headimgurl', title: '头像', render: renderImg },
                { data: 'key.credential.wxName', title: '公众号' },
                { data: 'key.nickname', title: '昵称', createdCell: tables.createAddTitle },
                { data: 'value', title: '分组' },
                { data: 'key.city', title: '城市' }
            ]
        }));
        t = new tables.Table(table);
    }
    function renderImg(text) {
        return '<img src="' + text + '" class="head-img" alt="头像"/>';
    }
    /**
     *
     *
     * @param {HTMLElement} that
     * @returns
     */
    function selectChange(that) {
        var group = $('#weixin-group'), account = $(that);
        group.empty();
        group.append('<option value="" >全部分组</option>');
        if (!account.val()) {
            return;
        }
        $.ajax({
            url: 'weixinv2/group/listGroup',
            type: 'GET',
            data: {
                credentialId: account.val()
            },
            success: function (data) {
                var d = data.rows;
                d.forEach(function (value, index) {
                    group.append('<option value=' + value.id + ' >' + value.name + '</option>');
                });
            }
        });
    }
    function initComplete() {
        var btn = $('#sync-btn'), account = $('#weixin-account');
        $('#search-btn').on('click', function () {
            // if (!$('#weixin-account').val() && $('#weixin-group').val()) {
            //     return;
            // }
            // table.draw();
            t.refresh(true);
        });
        $('#weixin-account').on('change', function () {
            selectChange(this);
        });
        btn.on('click', function () {
            var end = utils_1.loadingBtn(btn);
            $.ajax('weixinv2/resyncUserAndGroup', {
                method: 'POST',
                data: {
                    credentialId: account.val()
                }
            })
                .done(function (res) {
                utils_1.alertMessage(res.msg, !res.error);
                if (!res.error) {
                    table.draw();
                }
            })
                .always(function () {
                end();
            });
        });
        tables.bindPageChange(table, $('#page-change'));
    }
})(Weixinv2Index || (Weixinv2Index = {}));


/***/ }),

/***/ 967:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1175]);
//# sourceMappingURL=32.js.map