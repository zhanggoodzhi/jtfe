webpackJsonp([23],{

/***/ 1160:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(572);


/***/ }),

/***/ 572:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
var upload_1 = __webpack_require__(30);
__webpack_require__(7);
var tables = __webpack_require__(13);
__webpack_require__(21);
var html = __webpack_require__(996);
__webpack_require__(954);
var uploadDoc, detialData;
$(init);
function init() {
    new upload_1.Upload({
        btn: $('#upload-file'),
        accept: '.xls,.xlsx',
        url: 'superadmin/autoTest/upload_excel',
        name: 'origin',
        loading: true,
        success: function (id, name, res) {
            $('#file-info').html(name);
            uploadDoc = res.data;
        } /*,
        error: (id, name, res) => {
            $('#file-info').html('上传文件出现错误');
        }*/
    });
    var sidebar = new utils.SideBar({
        title: '测试报告',
        id: 'sidebar',
        width: 0.8
    });
    $('#start-time').daterangepicker({
        locale: Object.assign({}, utils.DATERANGEPICKERLOCALE, {
            format: 'YYYY-MM-DD HH:mm'
        }),
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true,
        startDate: moment().add(1, 'minutes')
    });
    $('#table').DataTable({
        ajax: {
            url: 'superadmin/autoTest/plans',
            dataSrc: function (res) { return res.rows; },
            data: function (data) {
                return utils.cleanObject({
                    page: Math.floor((data.start + data.length) / data.length),
                    rows: data.length,
                    status: $('#search-status').val(),
                    remark: $('#search-remark').val().trim()
                });
            }
        },
        serverSide: true,
        paging: true,
        columns: [
            { title: '备注', data: 'remark' },
            { title: '状态', data: 'status', render: renderStatus, width: '100px' },
            { title: '最佳', data: 'bestResult', width: '80px' },
            { title: '最差', data: 'worstResult', width: '80px' },
            { title: '执行时间', data: 'startTime', render: renderTime, width: '140px' },
            { title: '结束时间', data: 'finishTime', render: renderTime, width: '140px' },
            { title: '创建时间', data: 'createTime', render: renderTime, width: '140px' },
            {
                title: '操作',
                className: 'prevent cloud-table-action',
                width: '80px',
                data: 'testPlanId',
                render: function (id) {
                    return "\n                        <a href=\"javascript:;\" class=\"show-detail\" title=\"\u67E5\u770B\u6D4B\u8BD5\u62A5\u544A\">\n                            <i class=\"fa fa-eye\"></i>\n                        </a>\n                        <a href=\"superadmin/autoTest/report?testPlanId=" + id + "\" title=\"\u4E0B\u8F7D\u6D4B\u8BD5\u62A5\u544A\">\n                            <i class=\"fa fa-download\"></i>\n                        </a>\n                    ";
                }
            }
        ],
        select: false,
        scrollY: '' + tables.getScrollY($('#table')),
        initComplete: function () {
            var dt = $('#table').DataTable(), wrap = $('#sidebar'), keyArray = [
                { name: 'QUESTION_SIM', value: '问句相似度' },
                { name: 'ANSWER_SIM', value: '答案相似度' },
                { name: 'FRAME_SIM', value: '骨架相似度' }
            ], keyMap = {};
            keyArray.forEach(function (k) {
                keyMap[k.name] = k.value;
            });
            utils.bindEnter($('#search-remark'), function () {
                dt.draw();
            });
            $('#search-btn').on('click', function () {
                dt.draw();
            });
            $('#create-btn').on('click', function () {
                $('#create-modal').modal('show');
            });
            $('#create-modal').on('show.bs.modal', function () {
                $('#start-time').data('daterangepicker').setStartDate(moment().add(1, 'minutes'));
            });
            $('#create-submit-btn').on('click', function () {
                var data = {
                    settings: [],
                    startTime: moment($('#start-time').val()).valueOf(),
                    remark: $('#remark').val().trim(),
                    fileId: uploadDoc
                };
                if (data.remark === '') {
                    utils.alertMessage('备注说明不能为空');
                    return;
                }
                for (var _i = 0, _a = $('#create-modal .settings').toArray(); _i < _a.length; _i++) {
                    var setting = _a[_i];
                    var s = $(setting), key = s.data('key'), settingData = {
                        key: key
                    };
                    for (var _b = 0, _c = s.find('input').toArray(); _b < _c.length; _b++) {
                        var input = _c[_b];
                        var i = $(input), val = i.val().trim();
                        if (val === '') {
                            utils.alertMessage(keyMap[key] + '的' + i.prop('placeholder') + '不能为空');
                            return;
                        }
                        settingData[i.prop('name')] = val;
                    }
                    data.settings.push(settingData);
                }
                if (!uploadDoc) {
                    utils.alertMessage('请上传测试文件');
                }
                else if ($('#upload-file').is(':hidden')) {
                    utils.alertMessage('请等待文件上传完毕');
                }
                else {
                    var end_1 = utils.loadingBtn($('#create-submit-btn'));
                    $.ajax('superadmin/autoTest/plans', {
                        method: 'POST',
                        data: JSON.stringify(data),
                        contentType: 'application/json'
                    })
                        .done(function (res) {
                        if (!res.error) {
                            $('#create-modal').modal('hide');
                            dt.ajax.reload();
                        }
                        utils.alertMessage(res.msg, !res.error);
                    })
                        .always(function () {
                        end_1();
                    });
                }
            });
            $('#table').on('click', '.show-detail', function (e) {
                var data = dt.row($(e.currentTarget).closest('tr')).data(), end = utils.loadingBtn($(e.currentTarget));
                $.ajax('superadmin/autoTest/plans_outline', {
                    data: {
                        testPlanId: data.testPlanId
                    }
                })
                    .done(function (res) {
                    if (!res.error) {
                        Object.assign(res, {
                            start: renderTime(res.executeAt),
                            end: renderTime(res.completeAt),
                            create: renderTime(res.createAt),
                            statusText: renderStatus(res.status),
                            keyMap: keyMap,
                            keyArray: keyArray
                        });
                        showDetail(res);
                    }
                    else {
                        utils.alertMessage(res.msg, !res.error);
                    }
                })
                    .always(function () {
                    end();
                });
            });
            /*wrap.on('click', '.view-corpus', (e) => {
                const btn = $(e.currentTarget),
                    table = $('<table class="table"></table>');

                btn.parent().after(table);

                table.DataTable({
                    ajax: {
                        url: 'superadmin/autoTest/plans_init_data',
                        data: {
                            testPlanId: detialData.testPlanId
                        },
                        dataSrc: res => res
                    },
                    select: false,
                    scrollY: '500px',
                    scrollCollapse: true,
                    columns: [
                        { data: 'question', title: '问句' },
                        { data: 'answer', title: '回复' }
                    ]
                });

                btn.remove();
            });
*/
            wrap.on('click', '.view-testcase', function (e) {
                var btn = $(e.currentTarget), table = $('<table class="table fixed-table" id="testcase-table"></table>');
                btn.parent().after(table);
                btn.next('.toggle-testcase').removeClass('hidden');
                table.DataTable({
                    ajax: {
                        url: 'superadmin/autoTest/plans_test_cases',
                        data: {
                            testPlanId: detialData.testPlanId
                        },
                        dataSrc: function (res) { return res; }
                    },
                    columns: [
                        { data: 'question', title: '测试问句', createdCell: tables.createAddTitle },
                        { data: 'expect', title: '期望匹配', createdCell: tables.createAddTitle }
                    ],
                    select: false,
                    scrollY: '500px',
                    scrollCollapse: true
                });
                btn.remove();
            });
            wrap.on('click', '.toggle-testcase', function (e) {
                var table = $('#testcase-table').closest('.dataTables_wrapper'), btn = $(e.currentTarget);
                btn.text(table.is(':visible') ? '显示' : '隐藏');
                table.toggle();
            });
            wrap.on('click', '.result-link', function (e) {
                var a = $(e.currentTarget), target = $(a.attr('data-target'));
                if (target.length > 0) {
                    if (target.is(':hidden')) {
                        target.collapse('show');
                    }
                    wrap.find('.sidebar-content').animate({
                        scrollTop: target.get(0).offsetTop - target.prev('.panel').height()
                    });
                }
            });
            wrap.on('show.bs.collapse', '.collapse', function (e) {
                var target = $(e.currentTarget);
                wrap.find('.collapse').toArray().forEach(function (v) {
                    var el = $(v);
                    if (!el.is(target) && el.is(':visible')) {
                        el.collapse('hide');
                    }
                });
            });
        }
    });
    function showDetail(data) {
        detialData = data;
        sidebar.elements.content.html(html(data));
        $('#sidebar .collapse').toArray().forEach(function (el) {
            var collapse = $(el);
            collapse.one('show.bs.collapse', function (e) {
                var table = $('<table class="table fixed-table"></table>');
                collapse.find('.panel-body').append(table);
                table.DataTable({
                    ajax: {
                        url: 'superadmin/autoTest/plans_test_result_detail',
                        data: {
                            testResultId: collapse.attr('data-id')
                        },
                        dataSrc: function (res) { return res; }
                    },
                    columns: [
                        { data: 'question', title: '测试问句', createdCell: tables.createAddTitle },
                        { data: 'matched', title: '实际匹配问句', createdCell: tables.createAddTitle },
                        { data: 'maxSimilarityExpectedQuestionStr', title: '最相似问句', createdCell: tables.createAddTitle },
                        { data: 'questionSimDegree', title: '相似度', width: '75px' },
                        { data: 'expectedMaxSimilarityDegree', title: '问句最大相似度', createdCell: tables.createAddTitle, width: '100px' },
                        { data: 'expect', title: '期望回复', createdCell: tables.createAddTitle },
                        { data: 'real', title: '真实回复', createdCell: tables.createAddTitle },
                        { data: 'inputWord', title: '测试问题重要词汇', createdCell: tables.createAddTitle },
                        { data: 'expectedWord', title: '预期问题重要词汇', createdCell: tables.createAddTitle },
                        { data: 'similarWord', title: '实际回复问题重要词汇', createdCell: tables.createAddTitle }
                    ],
                    select: false,
                    scrollY: '500px',
                    scrollCollapse: true,
                    createdRow: function (row, d) {
                        if (d.passed) {
                            $(row).addClass('result-success');
                        }
                        else {
                            if (d.mismatchNoAnswer) {
                                $(row).addClass('result-fail');
                            }
                            else {
                                $(row).addClass('result-fail-no-answer');
                            }
                        }
                    }
                });
            });
        });
        sidebar.show();
    }
}
function renderTime(time) {
    return time ? moment(time).format('YYYY-MM-DD HH:mm') : '无';
}
function renderStatus(status) {
    var map = {
        '1': '准备就绪',
        '2': '正在测试',
        '3': '测试结束',
        '4': '计划取消',
        '5': '异常终止'
    };
    return map[status] || '';
}
function renderBooleanResult(value) {
    return value ? '是' : '否';
}


/***/ }),

/***/ 954:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 996:
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(25);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (bestResult, bestResultId, count, create, end, keyArray, remarks, settings, start, statusText, testResultOutlines, worstResult, worstResultId) {pug_html = pug_html + "\u003Cp\u003E计划任务：" + (pug.escape(null == (pug_interp = remarks) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cp\u003E状态：" + (pug.escape(null == (pug_interp = statusText) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cp\u003E创建时间：" + (pug.escape(null == (pug_interp = create) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cp\u003E执行时间：" + (pug.escape(null == (pug_interp = start) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cp\u003E完成时间：" + (pug.escape(null == (pug_interp = end) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cp\u003E训练语料：\u003Ca class=\"btn btn-sm btn-primary\" href=\"knowledge\u002FeditByA\u002Findex\" target=\"_blank\"\u003E查看\u003C\u002Fa\u003E\u003C\u002Fp\u003E\u003Cp\u003E初始参数配置\u003C\u002Fp\u003E\u003Ctable class=\"table\"\u003E\u003Cthead\u003E\u003Ctr\u003E\u003Cth\u003E参数\u003C\u002Fth\u003E\u003Cth\u003E最小值\u003C\u002Fth\u003E\u003Cth\u003E最大值\u003C\u002Fth\u003E\u003Cth\u003E步长\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E\u003Ctbody\u003E";
// iterate settings
;(function(){
  var $$obj = settings;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var setting = $$obj[pug_index0];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.key) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.start) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.end) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.step) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var setting = $$obj[pug_index0];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.key) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.start) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.end) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003Ctd\u003E" + (pug.escape(null == (pug_interp = setting.step) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E\u003Cp\u003E测试用例：\u003Cbutton class=\"btn btn-sm btn-primary view-testcase\" type=\"button\"\u003E查看\u003C\u002Fbutton\u003E\u003Cbutton class=\"btn btn-sm btn-primary toggle-testcase hidden\" type=\"button\"\u003E隐藏\u003C\u002Fbutton\u003E\u003C\u002Fp\u003E";
if (count>0) {
pug_html = pug_html + "\u003Cp\u003E测试报告：一共执行\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = count) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E轮，通过率：";
if (bestResultId) {
pug_html = pug_html + "\u003Ca" + (" class=\"result-link best\""+" href=\"javascript:;\""+pug.attr("data-target", "#result-detial-"+bestResultId, true, true)) + "\u003E最佳" + (pug.escape(null == (pug_interp = bestResult) ? "" : pug_interp)) + "\u003C\u002Fa\u003E，";
}
else {
pug_html = pug_html + "\u003Ca href=\"javascript:;\"\u003E最佳0%\u003C\u002Fa\u003E，";
}
if (worstResultId) {
pug_html = pug_html + "\u003Ca" + (" class=\"result-link worst\""+" href=\"javascript:;\""+pug.attr("data-target", "#result-detial-"+worstResultId, true, true)) + "\u003E最差" + (pug.escape(null == (pug_interp = worstResult) ? "" : pug_interp)) + "\u003C\u002Fa\u003E";
}
else {
pug_html = pug_html + "\u003Ca href=\"javascript:;\"\u003E最差0%\u003C\u002Fa\u003E";
}
pug_html = pug_html + "\u003C\u002Fp\u003E";
}
if (testResultOutlines) {
pug_html = pug_html + "\u003Cdiv class=\"panel-group\"\u003E";
// iterate testResultOutlines
;(function(){
  var $$obj = testResultOutlines;
  if ('number' == typeof $$obj.length) {
      for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
        var result = $$obj[index];
pug_html = pug_html + "\u003Cdiv class=\"panel panel-white\"\u003E\u003Cdiv class=\"panel-heading\"\u003E\u003Ch4 class=\"panel-title\"\u003E\u003Ca" + (" role=\"button\" data-toggle=\"collapse\""+pug.attr("href", "#result-detial-"+result.testResultId, true, true)+" aria-expanded=\"true\"") + "\u003E第\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = index+1) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E轮：";
// iterate keyArray
;(function(){
  var $$obj = keyArray;
  if ('number' == typeof $$obj.length) {
      for (var pug_index2 = 0, $$l = $$obj.length; pug_index2 < $$l; pug_index2++) {
        var k = $$obj[pug_index2];
// iterate result.thresholds
;(function(){
  var $$obj = result.thresholds;
  if ('number' == typeof $$obj.length) {
      for (var pug_index3 = 0, $$l = $$obj.length; pug_index3 < $$l; pug_index3++) {
        var threshold = $$obj[pug_index3];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index3 in $$obj) {
      $$l++;
      var threshold = $$obj[pug_index3];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
    }
  }
}).call(this);

      }
  } else {
    var $$l = 0;
    for (var pug_index2 in $$obj) {
      $$l++;
      var k = $$obj[pug_index2];
// iterate result.thresholds
;(function(){
  var $$obj = result.thresholds;
  if ('number' == typeof $$obj.length) {
      for (var pug_index4 = 0, $$l = $$obj.length; pug_index4 < $$l; pug_index4++) {
        var threshold = $$obj[pug_index4];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index4 in $$obj) {
      $$l++;
      var threshold = $$obj[pug_index4];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
    }
  }
}).call(this);

    }
  }
}).call(this);

pug_html = pug_html + "通过率：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.passingRate) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E，\n测试\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.count) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n通过\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.passed) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n失败\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.failed) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n无答案\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.mismatchNoAnswerCount) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n混淆（答错）\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.mismatchWrongAnswerCount) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次\u003C\u002Fa\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"panel-collapse collapse\""+" role=\"tabpanel\""+pug.attr("id", "result-detial-"+result.testResultId, true, true)+pug.attr("data-id", result.testResultId, true, true)) + "\u003E\u003Cdiv class=\"panel-body\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;
      var result = $$obj[index];
pug_html = pug_html + "\u003Cdiv class=\"panel panel-white\"\u003E\u003Cdiv class=\"panel-heading\"\u003E\u003Ch4 class=\"panel-title\"\u003E\u003Ca" + (" role=\"button\" data-toggle=\"collapse\""+pug.attr("href", "#result-detial-"+result.testResultId, true, true)+" aria-expanded=\"true\"") + "\u003E第\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = index+1) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E轮：";
// iterate keyArray
;(function(){
  var $$obj = keyArray;
  if ('number' == typeof $$obj.length) {
      for (var pug_index5 = 0, $$l = $$obj.length; pug_index5 < $$l; pug_index5++) {
        var k = $$obj[pug_index5];
// iterate result.thresholds
;(function(){
  var $$obj = result.thresholds;
  if ('number' == typeof $$obj.length) {
      for (var pug_index6 = 0, $$l = $$obj.length; pug_index6 < $$l; pug_index6++) {
        var threshold = $$obj[pug_index6];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index6 in $$obj) {
      $$l++;
      var threshold = $$obj[pug_index6];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
    }
  }
}).call(this);

      }
  } else {
    var $$l = 0;
    for (var pug_index5 in $$obj) {
      $$l++;
      var k = $$obj[pug_index5];
// iterate result.thresholds
;(function(){
  var $$obj = result.thresholds;
  if ('number' == typeof $$obj.length) {
      for (var pug_index7 = 0, $$l = $$obj.length; pug_index7 < $$l; pug_index7++) {
        var threshold = $$obj[pug_index7];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
      }
  } else {
    var $$l = 0;
    for (var pug_index7 in $$obj) {
      $$l++;
      var threshold = $$obj[pug_index7];
if (k.name===threshold.k) {
pug_html = pug_html + (pug.escape(null == (pug_interp = k.value) ? "" : pug_interp)) + "：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = threshold.v) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E&nbsp;&nbsp;";
}
    }
  }
}).call(this);

    }
  }
}).call(this);

pug_html = pug_html + "通过率：\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.passingRate) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E，\n测试\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.count) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n通过\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.passed) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n失败\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.failed) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n无答案\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.mismatchNoAnswerCount) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次，\n混淆（答错）\u003Cstrong\u003E" + (pug.escape(null == (pug_interp = result.mismatchWrongAnswerCount) ? "" : pug_interp)) + "\u003C\u002Fstrong\u003E次\u003C\u002Fa\u003E\u003C\u002Fh4\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv" + (" class=\"panel-collapse collapse\""+" role=\"tabpanel\""+pug.attr("id", "result-detial-"+result.testResultId, true, true)+pug.attr("data-id", result.testResultId, true, true)) + "\u003E\u003Cdiv class=\"panel-body\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E";
}}.call(this,"bestResult" in locals_for_with?locals_for_with.bestResult:typeof bestResult!=="undefined"?bestResult:undefined,"bestResultId" in locals_for_with?locals_for_with.bestResultId:typeof bestResultId!=="undefined"?bestResultId:undefined,"count" in locals_for_with?locals_for_with.count:typeof count!=="undefined"?count:undefined,"create" in locals_for_with?locals_for_with.create:typeof create!=="undefined"?create:undefined,"end" in locals_for_with?locals_for_with.end:typeof end!=="undefined"?end:undefined,"keyArray" in locals_for_with?locals_for_with.keyArray:typeof keyArray!=="undefined"?keyArray:undefined,"remarks" in locals_for_with?locals_for_with.remarks:typeof remarks!=="undefined"?remarks:undefined,"settings" in locals_for_with?locals_for_with.settings:typeof settings!=="undefined"?settings:undefined,"start" in locals_for_with?locals_for_with.start:typeof start!=="undefined"?start:undefined,"statusText" in locals_for_with?locals_for_with.statusText:typeof statusText!=="undefined"?statusText:undefined,"testResultOutlines" in locals_for_with?locals_for_with.testResultOutlines:typeof testResultOutlines!=="undefined"?testResultOutlines:undefined,"worstResult" in locals_for_with?locals_for_with.worstResult:typeof worstResult!=="undefined"?worstResult:undefined,"worstResultId" in locals_for_with?locals_for_with.worstResultId:typeof worstResultId!=="undefined"?worstResultId:undefined));;return pug_html;};
module.exports = template;

/***/ })

},[1160]);
//# sourceMappingURL=23.js.map