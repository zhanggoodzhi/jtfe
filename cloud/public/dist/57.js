webpackJsonp([57],{

/***/ 1122:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(536);


/***/ }),

/***/ 536:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(919);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
// import { alertMessage, ClassifyTree, cleanObject, CommonDate, bindInput, addLoadingBg, bindEnter, confirmModal, formatText, getMinContentHeight } from 'utils';
var utils = __webpack_require__(5);
__webpack_require__(37);
// import 'editor';
__webpack_require__(21);
var dialogUpdate;
(function (dialogUpdate) {
    var tableRowSelected;
    var date, target, tree, classify;
    var answer = $('#answer-area'), question = $('#question');
    // const classify: utils.ClassifyTree = initClassify();
    var defaultQuestion = '默认问题', defaultAnswer = '默认回复';
    $(function () {
        initTree();
        initCorpus();
    });
    function getTreeData(cb) {
        $.ajax({
            type: 'POST',
            url: 'knowledge/dialog/getDetail',
            data: {
                id: dialogid
            },
            success: function (msg) {
                var data = msg.rows, treeData = data.map(function (v) {
                    var d = {
                        id: v.id,
                        qId: v.expectWord.id,
                        parent: v.parent,
                        text: v.expectWord.literal,
                        plainText: v.content.plainText,
                        // contentHtml: v.content.contentHtml,
                        fromServer: true,
                        synedPairId: v.synedPairId
                    };
                    d.current = Object.assign({}, d);
                    if (!v.parent) {
                        d.parent = '#';
                        d.state = {
                            'selected': true
                        };
                    }
                    return d;
                });
                if (data.length > 0) {
                    $('#select-character').val(data[0].character.id);
                }
                cb(treeData);
            }
        });
    }
    function initTree() {
        var endLoadTree = null, endLoadTable = null;
        $(document).ajaxStart(function () {
            if (!endLoadTree) {
                endLoadTree = loadTree();
            }
            if (!endLoadTable) {
                endLoadTable = loadTable();
            }
        });
        $(document).ajaxComplete(function () {
            if (endLoadTree) {
                endLoadTree();
                endLoadTree = null;
            }
            if (endLoadTable) {
                endLoadTable();
                endLoadTable = null;
            }
        });
        getTreeData(function (treeData) {
            // $('#tree').height('auto');
            $('#tree').jstree({
                'core': {
                    'data': treeData,
                    'strings': {
                        'Loading ...': '加载中...'
                    },
                    'animation': 100,
                    'themes': {
                        'icons': false
                    },
                    'check_callback': true,
                    'multiple': false
                },
                'dnd': {
                    'large_drag_target': true
                },
                'contextmenu': {
                    'items': {
                        'create': {
                            'separator_before': false,
                            'separator_after': true,
                            '_disabled': false,
                            'label': '新建',
                            'action': treeAddAction
                        },
                        'rename': {
                            'separator_before': false,
                            'separator_after': false,
                            '_disabled': false,
                            'label': '重命名',
                            'action': function (data) {
                                var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                                inst.edit(obj);
                            }
                        },
                        'remove': {
                            'separator_before': false,
                            'icon': false,
                            'separator_after': false,
                            '_disabled': false,
                            'label': '删除',
                            'action': function (data) {
                                var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
                                if (obj.parent === '#') {
                                    utils.alertMessage('无法删除根节点!');
                                    return;
                                }
                                utils.confirmModal({
                                    msg: '确认删除选中问题吗？',
                                    cb: function (modal, btn) {
                                        var end = utils.loadingBtn(btn);
                                        $.ajax({
                                            type: 'POST',
                                            url: 'knowledge/dialog/update/removeNode',
                                            data: {
                                                id: obj.id
                                            },
                                            success: function (msg) {
                                                if (!msg.error) {
                                                    if (inst.is_selected(obj)) {
                                                        inst.delete_node(inst.get_selected());
                                                    }
                                                    else {
                                                        inst.delete_node(obj);
                                                    }
                                                    tree.deselect_all();
                                                    tree.select_node(obj.parent);
                                                    modal.modal('hide');
                                                }
                                                else {
                                                    utils.alertMessage(msg.msg);
                                                }
                                            },
                                            complete: function () {
                                                end();
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                },
                'types': {
                    '#': {
                        'max_children': 1
                    }
                },
                'plugins': ['dnd', 'contextmenu', 'types', 'conditionalselect', 'unique'],
                'conditionalselect': checkLeave
            })
                .on('changed.jstree', updateContent)
                .on('rename_node.jstree', updateName)
                .on('move_node.jstree', moveNode)
                .one('ready.jstree', treeInitComplete);
            question.on('input', function () { return rename(question.val().trim()); });
            answer.on('input', function () { return updateContentData(answer.val().trim()); });
        });
    }
    function refreshTree() {
        getTreeData(function (treeData) {
            tree.settings.core.data = treeData;
            tree.refresh(true, null);
        });
    }
    function rename(val) {
        var data = tree.get_selected(true)[0];
        data.original.current.text = val;
        tree.rename_node(data.id, val);
    }
    // function initEditor() {
    // 	const e = new Editor({
    // 		el: $('#editor'),
    // 		onChange: updateContentData
    // 	});
    // 	editor = e.editorElement;
    // }
    function updateContentData(val) {
        var data = tree.get_selected(true)[0].original.current;
        if (data.plainText !== val) {
            data.plainText = val;
        }
        // if (data.contentHtml !== html) {
        // 	data.contentHtml = html;
        // 	data.plainText = formatText(html);
        // }
    }
    function updateName(e, text) {
        var q = question, t = $.trim(q.val());
        if (t === text.text) {
            return;
        }
        tree.get_selected(true)[0].original.current.text = text.text;
        q.val(text.text);
    }
    function updateContent(e, t) {
        if (!tree) {
            return;
        }
        var data = tree.get_selected(true);
        if (data.length !== 1) {
            return;
        }
        var d = data[0].original.current;
        var text = d.text, val = d.plainText || '';
        // html = d.contentHtml ? d.contentHtml : '<p><br/></p>';
        // checkAble(d);
        // if (question.val() === text && answer.val() === val) {
        // 	return;
        // }
        question.val(text);
        answer.val(val);
        // editor.$txt.html(html);
    }
    function deleteNode(node, parent) {
        var id = parent.node.original.current.id;
        if (id) {
            $.ajax({
                type: 'POST',
                url: 'knowledge/dialog/update/removeNode',
                data: {
                    id: id
                },
                success: function (msg) {
                    if (msg.error) {
                        utils.alertMessage(msg.msg);
                    }
                }
            });
        }
    }
    function initEditForm() {
        $('.edit-form').show();
        initSave();
    }
    function moveNode(node, parent, position, oldParent) {
        var nodeEl = parent.node;
        tree.deselect_all();
        tree.select_node(nodeEl.id);
        tree.open_node(parent.parent);
        $.ajax({
            url: 'knowledge/dialog/update/moveNode',
            type: 'POST',
            data: {
                id: nodeEl.id,
                parentId: nodeEl.parent
            },
            success: function (msg) {
                utils.alertMessage(msg.msg, !msg.error);
                if (msg.error) {
                    refreshTree();
                }
            },
            error: refreshTree
        });
    }
    function initSave() {
        $('#submit-btn').on('click', function () {
            var origin = tree.get_selected(true)[0].original, data = origin.current, expectword = question.val().trim(), content = answer.val().trim(), d = {
                id: data.id
            };
            if (expectword === defaultQuestion || content === defaultAnswer) {
                utils.alertMessage("\u95EE\u9898\u6216\u56DE\u590D\u4E0D\u80FD\u4E3A" + defaultQuestion + "\u548C" + defaultAnswer);
                return;
            }
            if (expectword === origin.plainText && content === origin.text) {
                utils.alertMessage('问题或回复未发生改动');
                return;
            }
            if (tableRowSelected && tableRowSelected.pairId /*&& selected.id*/) {
                Object.assign(d, {
                    pairId: tableRowSelected.pairId
                });
                save(d);
            }
            else {
                Object.assign(d, {
                    expectword: expectword,
                    content: content
                });
                save(d);
                // if (data.qId && data.synedPairId !== 1) {
                // 	checkDialog(d, data.qId);
                // }
                // else {
                // 	save(d);
                // }
            }
        });
    }
    function save(data) {
        var d = tree.get_selected(true)[0].original;
        $.ajax({
            url: 'knowledge/dialog/update/modifyNode',
            type: 'POST',
            data: data,
            success: function (msg) {
                utils.alertMessage(msg.msg, !msg.error);
                console.log(d);
                if (!msg.error) {
                    // d.current.synedPairId = synedPairId;
                    Object.assign(d, d.current);
                }
                else {
                    refreshTree();
                }
            },
            error: refreshTree
        });
    }
    function checkDialog(data, qid) {
        $.ajax({
            url: 'knowledge/dialog/update/isExistPm',
            type: 'POST',
            data: {
                qid: qid
            },
            success: function (msg) {
                if (!msg.error) {
                    if (msg.msg === true) {
                        utils.confirmModal({
                            msg: '对话模型的问题已经被修改,是否希望在语料库中继续保留之前的问答对及复述',
                            text: '保留',
                            className: 'btn-primary',
                            cb: function (modal, btn) {
                                modal.modal('hide');
                                save(data);
                            },
                            cancelText: '不保留',
                            cancel: function (modal, btn) {
                                modal.modal('hide');
                                Object.assign(data, { delFlag: 1 });
                                save(data);
                            }
                        });
                    }
                    else {
                        save(data);
                    }
                }
            }
        });
    }
    function treeAddAction(data) {
        var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
        if (!checkLeave(Object.assign({}, obj, { id: null }))) {
            return;
        }
        for (var _i = 0, _a = obj.children; _i < _a.length; _i++) {
            var i = _a[_i];
            var d = tree.get_node(i).original.current;
            if (d.text === defaultQuestion || d.plainText === defaultAnswer) {
                tree.deselect_all();
                tree.select_node(i);
                utils.alertMessage("\u5B58\u5728" + defaultQuestion + "\u6216" + defaultAnswer + ",\u8BF7\u4FDD\u5B58\u6216\u5220\u9664\u8BE5\u95EE\u9898\u540E\u518D\u6DFB\u52A0\u8282\u70B9");
                return;
            }
        }
        // const endLoadTree = loadTree();
        $.ajax({
            url: 'knowledge/dialog/update/addNode',
            type: 'POST',
            data: {
                parentId: obj.id
            },
            success: function (msg) {
                if (!msg.error) {
                    var d = {
                        id: msg.msg,
                        text: defaultQuestion,
                        plainText: defaultAnswer,
                        // contentHtml: defaultAnswerHtml,
                        parent: obj.id
                    };
                    d.current = Object.assign({}, d);
                    inst.create_node(obj, d, 'last', function (newNode) {
                        setTimeout(function () {
                            tree.deselect_all();
                            tree.select_node(newNode);
                            inst.edit(newNode);
                        }, 0);
                    });
                }
                else {
                    utils.alertMessage(msg.msg);
                }
            }
        });
    }
    function initCorpus() {
        var btn = $('#show-coupus-btn');
        btn.one('click', function () {
            var showbtn = $('<button type="button" class="btn btn-sm btn-primary" id="show-btn">选择现有语料</button>')
                .hide()
                .on('click', function () {
                $('#show-coupus-wrap').show();
                showbtn.hide();
            });
            btn.after(showbtn)
                .remove();
            beforeInitTable();
            $('#table').DataTable(Object.assign(tables_1.simpleConfig('single'), {
                ajax: {
                    type: 'POST',
                    url: 'knowledge/dialog/getPairs',
                    dataSrc: function (data) { return data.rows; },
                    data: function (data) {
                        var d = {
                            questionkeyword: $.trim($('#form-question').val()),
                            answerkeyword: $.trim($('#form-answer').val()),
                            classifyIds: classify.selected.join(','),
                            // corpusStatus: $("#select-status").val(),
                            characterId: $('#select-character').val(),
                            page: tables_1.getPage(data),
                            rows: data.length,
                            pushway: $('#select-pushway').val(),
                            beginTime: date.getDate('start'),
                            endTime: date.getDate('end')
                        };
                        return utils.cleanObject(d);
                    }
                },
                scrollY: tables_1.getTableHeight() - 504,
                scrollCollapse: true,
                pageLength: 20,
                processing: false,
                columns: [
                    { name: 'question', data: 'literal', title: '问题', width: '50%', createdCell: tables_1.createAddTitle },
                    { name: 'plainText', data: 'digest', title: '回复', width: '50%', createdCell: tables_1.createAddTitle }
                ],
                drawCallback: function () {
                    toggleTable();
                },
                initComplete: initComplete
            }))
                .on('select', tableChange)
                .on('deselect', function () {
                tableRowSelected = null;
                toggleTable();
            });
        });
    }
    function beforeInitTable() {
        var wrap = $('#show-coupus-wrap');
        wrap.removeClass('hidden');
        $('#hide-btn').on('click', function () {
            deselectTable();
            wrap.hide();
            $('#show-btn').show();
        });
        initClassify();
        initDate();
    }
    function tableChange(e, dt, type, indexes) {
        if (type === 'row') {
            var q = question;
            tableRowSelected = dt.row(indexes).data();
            q.val(tableRowSelected.literal);
            // editor.$txt.html(selected.htmlContent);
            answer.val(tableRowSelected.digest);
            rename(tableRowSelected.literal);
            toggleTable();
        }
    }
    var toggleTable = utils.debounce(function () {
        if (tableRowSelected) {
            question.prop('disabled', true);
            answer.prop('disabled', true);
        }
        else {
            question.prop('disabled', null);
            answer.prop('disabled', null);
        }
    }, 200);
    // function tableDisable() {
    // 	question.prop('disabled', true);
    // 	answer.prop('disabled', true);
    // 	// editor.disable();
    // }
    // function tableEnable() {
    // 	if (selected) {
    // 		selected = null;
    // 	}
    // 	question.prop('disabled', null);
    // 	answer.prop('disabled', null);
    // 	// editor.enable();
    // }
    /*    function checkAble(data) {
            $("#hide-btn").click();
            if (data.synedPairId) {
                // $("#show-btn,#show-coupus-btn").hide();
                tableDIsable();
            }
            else {
                // $("#show-btn,#show-coupus-btn").show();
                tableEnable();
            }
        }*/
    function initClassify() {
        var d = selectData.classify.map(function (v) {
            var data = {
                id: v.id,
                text: v.name,
                parent: v.parent
            };
            return data;
        });
        d.unshift({
            text: '所有问题',
            id: 0,
            parent: '#',
            state: {
                opened: true
            }
        });
        classify = new utils.ClassifyTree({
            el: $('#classify'),
            data: d,
            selected: true,
            multiple: true
        });
    }
    function initDate() {
        date = new utils.CommonDate({
            el: $('#form-date')
        });
    }
    function deselectTable() {
        if ($('#show-coupus-btn').length <= 0 && tableRowSelected) {
            var table = $('#table').DataTable();
            table.rows().deselect();
        }
    }
    function initComplete() {
        var table = $('#table').DataTable();
        $('#search-btn').on('click', function () {
            table.draw();
        });
        utils.bindEnter($('#form-question,#form-answer'), function () {
            table.draw();
        });
    }
    function checkLeave(t) {
        var select = tree.get_selected(true)[0], data = select.original, current = data.current;
        if ($('#submit-btn').prop('disabled')) {
            utils.alertMessage('正在保存中,请稍等');
            return false;
        }
        if (select.id === t.id) {
            return false;
        }
        if (data.plainText === current.plainText && data.text === current.text) {
            deselectTable();
            return true;
        }
        $('#leave-confirm-modal').modal('show');
        target = t;
        return false;
    }
    function treeInitComplete() {
        tree = $('#tree').jstree(true);
        tree.open_all();
        initEditForm();
        updateContent(null, null);
        $('#leave-btn').on('click', function () {
            var select = tree.get_selected(true)[0], data = select.original, current = data.current;
            if (!target) {
                return;
            }
            deselectTable();
            for (var i in current) {
                current[i] = data[i];
            }
            $('#leave-confirm-modal').modal('hide');
            tree.rename_node(select.id, data.text);
            if (target.id) {
                tree.deselect_all();
                tree.select_node(target.id);
            }
            else {
                treeAddAction({ reference: select.id });
            }
        });
        $('#leave-confirm-modal').on('hidden.bs.modal', function () {
            target = null;
        });
    }
    function loadTree() {
        return utils.addLoadingBg($('#tree-wrap'), $('#tree'));
    }
    function loadTable() {
        return utils.addLoadingBg($('#table-wrap'), $('#table-blur'));
    }
})(dialogUpdate || (dialogUpdate = {}));


/***/ }),

/***/ 919:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1122]);
//# sourceMappingURL=57.js.map