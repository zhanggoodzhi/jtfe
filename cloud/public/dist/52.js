webpackJsonp([52],{

/***/ 1130:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(543);


/***/ }),

/***/ 543:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
__webpack_require__(929);
var upload_1 = __webpack_require__(30);
var new_table_1 = __webpack_require__(7);
__webpack_require__(36);
var selected;
$(function () {
    utils.bindEnter($('#question'), function () {
        $('#ask-btn').trigger('click');
    });
    // initText();
    initDoc();
});
/*function initText() {
    $('#ask-btn').on('click', () => {
        const documentVal = $.trim($('#document').val()),
            questionVal = $.trim($('#question').val());
        if (documentVal === '') {
            utils.alertMessage('请填写文档内容');
        }
        else if (questionVal === '') {
            utils.alertMessage('请填写测试问题');
        }
        else {
            const endLoading = utils.loadingBtn($('#ask-btn'));
            $.ajax({
                url: 'knowledge/qaOnDocument/query',
                type: 'POST',
                data: {
                    content: documentVal,
                    question: questionVal
                },
                success: renderAnswer,
                complete: () => {
                    endLoading();
                }
            });
        }
    });
}*/
function initDoc() {
    var table = new new_table_1.Table({
        el: $('#select-doc-table'),
        options: {
            ajax: {
                url: 'knowledge/qaOnDocument/list',
                dataSrc: function (d) { return d.rows; },
                data: function (d) {
                    return utils.cleanObject({
                        documentName: $('#doc-name-search').val().trim(),
                        page: Math.floor((d.start + d.length) / d.length),
                        rows: d.length
                    });
                }
            },
            select: {
                style: 'single'
            },
            serverSide: true,
            scrollY: window.innerHeight * 0.4 + 'px',
            paging: true,
            columns: [
                { data: 'documentName', title: '文档名称' },
                {
                    data: 'createTime', title: '上传时间', width: '140px', render: function (time) {
                        return moment(time).format('YYYY-MM-DD HH:mm:ss');
                    }
                }
            ]
        }
    }), t = table.dt;
    new upload_1.Upload({
        btn: $('#upload-doc'),
        accept: '.txt,.doc,.docx,.pdf,.xls,.xlsx',
        url: 'knowledge/qaOnDocument/upload',
        name: 'attach',
        loading: true,
        option: {
            multiple: false
        },
        success: function (id, name, res) {
            if (!res.error) {
                updateSelectedDoc(res.data);
            }
            else {
                utils.alertMessage(res.msg, !res.error);
            }
        }
    }).uploader;
    $('#ask-btn').on('click', function () {
        if (!selected) {
            utils.alertMessage('请选择文档');
            return;
        }
        var question = $('#question').val().trim();
        if (question === '') {
            utils.alertMessage('请填写测试问题');
        }
        else {
            var end_1 = utils.loadingBtn($('#ask-btn'));
            $.ajax('knowledge/qaOnDocument/analysis', {
                method: 'POST',
                data: {
                    question: question,
                    id: selected.id
                }
            })
                .done(function (res) {
                renderAnswer(res);
            })
                .always(function () {
                end_1();
            });
        }
    });
    $('#doc-search-btn').on('click', function () {
        t.draw();
    });
    $('#select-doc').on('click', function () {
        $('#select-doc-modal').modal('show');
        t.draw();
    });
    $('#select-doc-modal').one('shown.bs.modal', function () {
        t.columns.adjust();
    });
    $('#select-doc-btn').on('click', function () {
        var s = t.row({ selected: true }).data();
        if (!s) {
            utils.alertMessage('请选择文档');
            return;
        }
        updateSelectedDoc(s);
        $('#select-doc-modal').modal('hide');
    });
    utils.bindEnter($('#doc-name-search'), function () {
        t.draw();
    });
}
function renderAnswer(res) {
    var html = '';
    if (!res.error && res.data) {
        var answers = res.data.slice(0, 3);
        if (answers.length <= 0) {
            html = '未找到合适的答案';
        }
        else {
            html = answers.map(function (text, index) {
                return "\n\t\t\t\t<p>\u56DE\u590D" + (index + 1) + "\uFF1A</p>\n\t\t\t\t<p>" + text.replace(/\n+/g, '<br/>') + "</p>";
            }).join('');
        }
    }
    else {
        utils.alertMessage(res.msg, !res.error);
    }
    $('#answer').html(html);
}
function updateSelectedDoc(data) {
    selected = data;
    $('#doc-name').text(data.documentName);
}


/***/ }),

/***/ 929:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1130]);
//# sourceMappingURL=52.js.map