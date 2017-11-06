webpackJsonp([71],{

/***/ 1143:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(555);


/***/ }),

/***/ 555:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
var form = $('#form');
var radioArea = $('#radio-area');
var greetings = $('#greetings');
var btn = $('#edit-greetings-btn');
var radioItems = {
    isMessage: {
        title: '留言功能是否开启',
        options: [{
                label: '开启',
                value: 0
            }, {
                label: '关闭',
                value: 1
            }]
    },
    serviceMode: {
        title: '服务模式',
        options: [{
                label: '仅智能客服模式',
                value: 1,
                info: '不启用人工客服，所有会话全都由机器人客服进行回复'
            }, {
                label: '仅人工客服模式',
                value: 2,
                info: '不启用智能机器人客服，所有会话全部接入人工客服'
            }, {
                label: '智能客服+人工客服模式',
                value: 3,
                info: '同时启用机器人和人工客服，访客发起对话后优先接入机器人，同时由访客自主选择是否要转接人工客服'
            }]
    }
};
function fillConfig() {
    $.post('setting/cs/getAppServiceMode')
        .done(function (res) {
        if (!res.error) {
            var data_1 = res.data;
            greetings.val(data_1.greetings);
            radioArea.html(Object.keys(radioItems).map(function (key) {
                var item = radioItems[key];
                return "\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>" + item.title + "</label>\n\t\t\t\t\t" + item.options.map(function (op) {
                    return "<div class=\"radio\">\n\t\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" name=\"" + key + "\" value=\"" + op.value + "\" " + (op.value === data_1[key] ? 'checked' : '') + "/>\n\t\t\t\t\t\t\t\t\t\t" + op.label + "\n\t\t\t\t\t\t\t\t\t\t&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n\t\t\t\t\t\t\t\t\t\t" + (op.info || '') + "\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>";
                }).join('') + "\n\t\t\t\t\t</div>\n\t\t\t\t\t";
            }).join(''));
        }
    });
}
function updateConfig(data) {
    var originData = form.serializeArray().reduce(function (result, item) {
        result[item.name] = item.value;
        return result;
    }, {});
    var greet = greetings.val().trim();
    Object.assign(originData, {
        greetings: greet
    });
    return $.ajax('setting/cs/appServiceMode', {
        method: 'POST',
        data: Object.assign(originData, data)
    })
        .done(function (res) {
        if (res.error) {
            fillConfig();
        }
        utils.alertMessage(res.msg, !res.error);
    });
}
btn.on('click', function () {
    var save = !greetings.prop('readonly');
    if (save) {
        var value = greetings.val().trim();
        if (!value) {
            utils.alertMessage('人工客服欢迎语不能为空');
            return;
        }
        var end_1 = utils.loadingBtn(btn);
        var cb_1 = function () { return end_1(); };
        updateConfig({ greetings: value })
            .then(function (res) {
            if (!res.error) {
                fillConfig();
                greetings.prop('readonly', true);
                btn.html('编辑');
            }
            cb_1();
        });
    }
    else {
        greetings.prop('readonly', false);
        btn.html('保存');
    }
    // $('#editor-modal').modal('show');
});
// $('#editor-modal').one('shown.bs.modal', () => {
// 	const el = $('#editor');
// 	const html = el.html();
// 	el.empty();
// 	const edt = new wangEditor(el);
// 	edt.create();
// 	el.html(html);
// 	$('#editor-yes-btn').on('click', () => {
// 		const value = $('#editor').html();
// 		if (!$('#editor').text().trim()) {
// 			utils.alertMessage('人工客服欢迎语不能为空');
// 			return;
// 		}
// 		const end = utils.loadingBtn($('#editor-yes-btn'));
// 		const cb = () => end();
// 		updateConfig({ greetings: value })
// 			.then((res) => {
// 				if (!res.error) {
// 					fillConfig();
// 					$('#editor-modal').modal('hide');
// 				}
// 				cb();
// 			});
// 	});
// });
form.on('change', 'input:radio', function (e) {
    var radio = $(e.currentTarget), name = radio.prop('name'), value = radio.val();
    updateConfig((_a = {}, _a[name] = value, _a));
    var _a;
});
fillConfig();


/***/ })

},[1143]);
//# sourceMappingURL=71.js.map