/*global moment Chart resizeHeight*/
"use strict";
var locale = {
    "format": "YYYY-MM-DD",
    "separator": " - ",
    "applyLabel": "确定",
    "cancelLabel": "取消",
    "fromLabel": "从",
    "toLabel": "到",
    "customRangeLabel": "时间表",
    "weekLabel": "W",
    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
    "monthNames": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    "firstDay": 1
};
var backgroundColor = [
    "#afcaff",
    "#b399db",
    "#abdbc6",
    "#FFB6C1",
    "#DB7093"
];
var hoverBackgroundColor = backgroundColor;

var dataTableLanguage = {
    emptyTable: "没有数据",
    info: " 第 _START_ 到 _END_ 条数据，总计 _TOTAL_ 条数据",
    lengthMenu: "每页显示 _MENU_ 条数据",
    loadingRecords: "加载中...",
    processing: "查询中...",
    search: "查找:",
    zeroRecords: "没有检索到数据",
    infoEmpty: '没有检索到数据',
    infoFiltered: '(从 _MAX_ 条记录中筛选)',
    paginate: {
        first: '首页',
        previous: '上页',
        next: '下页',
        last: '尾页'
    }
};
var recordTable;
var reportBar, reportPie;
$(function () {
    init();
});

function init() {
    $.fn.dataTable.ext.errMode = 'throw';
    initChartPlugin();
    initDate();
    getData(initReport);
    initCategoryList();
    initDataTables();
    initCount();
    initView();
    closeModalCallBack();
    //initExport();
}

function getData(reportCallback) {
    var data, val;
    val = $("#report-time").val();
    val = val.split(" - ");
    data = {
        timeBegin: val[0],
        timeEnd: val[1]
    };

    $.ajax({
        url: "spss/feedbackReportOverall",
        data: data,
        type: "get",
        success: function (data) {
            //去除默认好评
            var d = {};
            d.x = data.msg.x.slice(1);
            d.y = data.msg.y.slice(1);
            reportCallback(d);
        }
    });
}

function initReport(data) {
    initReportBar(data);
    initReportPie(data);
    resizeHeight();
}

function initReportBar(data) {
    var d = {
        labels: data.x,
        datasets: [{
            label: "评价",
            borderWidth: 1,
            data: data.y,
            backgroundColor: [backgroundColor[0], backgroundColor[4]],
            hoverBackgroundColor: [hoverBackgroundColor[0], hoverBackgroundColor[4]]
        }]
    };

    reportBar = new Chart($("#report-bar"), {
        type: 'bar',
        data: d,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        stepSize: 1
                    }
                }]
            },
            legend: {
                display: false
            },
            categoryPercentage: 0.5,
            barPercentage: 0.5
            // tooltips: {
            // 	mode: "single",
            // 	callbacks: {
            // 		label: function (tooltips, tooltipsData) {
            // 			var i=tooltips.index;
            // 			return [tooltipsData.labels[i]+":"+tooltipsData.datasets[tooltips.datasetIndex].data[i]];
            // 		}
            // 	}
            // }
        }
    });
}

function initReportPie(data) {
    var d = {
        labels: data.x, //X轴
        datasets: [{
            data: data.y, //对应X轴每栏的值
            lable: "%",
            backgroundColor: [backgroundColor[0], backgroundColor[4]],
            hoverBackgroundColor: [hoverBackgroundColor[0], hoverBackgroundColor[4]]
        }] //可能会有两栏对比,所以数组,
    };

    reportPie = new Chart($("#report-pie"), {
        type: 'pie',
        data: d,
        options: {
            showPercentage: true,
            legend: {
                onClick: function () {
                    return false;
                }
            }
        }
    });
}

function updateReport(data) {
    updateReportBar(data);
    updateReportPie(data);
}

function updateReportBar(data) {
    if (!reportBar) {
        return;
    }
    reportBar.data.datasets[0].data = data.y;
    reportBar.update();
}

function updateReportPie(data) {
    if (!reportPie) {
        return;
    }
    reportPie.data.datasets[0].data = data.y;
    reportPie.update();
}

function initCategoryList() {
    var categoryList = $("#category").DataTable({
        ajax: {
            type: "GET",
            url: "spss/feedbackByCategory",
            dataSrc: function (data) {
                var d = data.rows;
                return d;
            },
            data: function () {
                var data, val;
                val = $("#report-time").val();
                val = val.split(" - ");
                data = {
                    timeBegin: val[0],
                    timeEnd: val[1]
                };
                return data;
            }
        },
        info: false,
        processing: false, //加载提示
        serverSide: false, //后端分页
        searching: false, //搜索栏
        ordering: false, //排序
        lengthChange: false, //页面显示栏数修改
        paging: false, //分页
        autoWidth: true,
        initComplete: function () {
            resizeHeight();
        },
        columns: [{
                data: "categoryname",
                title: "类别"
            },
            {
                data: "feedbackAllBean.countSatisfy",
                title: "好评"
            },
            {
                data: "feedbackAllBean.countUnsatisfy",
                title: "差评"
            },
            {
                data: "feedbackAllBean.percentSatisfy",
                title: "平均满意度",
                render: function (data) {
                    return data + "%";
                }
            }
        ],
        language: dataTableLanguage
    });

    $("#report-time").on("change", function () {
        if (!$(this).val()) {
            return;
        }
        getData(updateReport);
        categoryList.ajax.reload().draw();
    });
}

function initDate() {
    $("#report-time").daterangepicker({
        locale: locale,
        opens: "right",
        autoApply: true,
        alwaysShowCalendars: false,
        ranges: {
            '今天': [moment(), moment()],
            '最近7天': [moment().subtract(6, 'days'), moment()],
            '最近30天': [moment().subtract(29, 'days'), moment()],
            '最近3个月': [moment().subtract(3, 'month').startOf('month'), moment()],
            '最近1年': [moment().subtract(1, 'year').startOf('year'), moment()],
            '全部数据': ["1970-01-01", "2038-12-31"]
        },
        startDate: moment().subtract(29, 'days'),
        endDate: moment()
    });
}

function initDataTables() {
    var table = $('#key-table').DataTable({
        ajax: {
            type: "POST",
            url: "spss/robotFeedback/list",
            dataSrc: function (data) {
                var d = data.rows;
                return d;
            },
            data: function (d) {
                var data = {
                    page: Math.floor((d.start + d.length) / d.length),
                    rows: d.length,
                    score: $("#score-val").val(),
                };
                return cleanData(data);

            }
        },
        scrollY: window.innerHeight >= 768 ? window.innerHeight - 225 - $(".search-area").height() : window.innerHeight - 195 - $(".search-area").height(), //tbody高度
        scrollCollapse: true, //内容变少固定高度
        processing: false, //加载提示
        serverSide: true, //后端分页
        searching: false, //搜索栏
        ordering: false, //排序
        lengthChange: false, //页面显示栏数修改
        pageLength: parseInt($("#page-change").val()), //每页显示条目
        pagingType: "simple_numbers",
        paging: true, //分页
        autoWidth: true,
        drawCallback: function () {
            $(".dataTables_scrollBody").scrollTop(0);
        },
        initComplete: function () {
            resizeHeight();
        },
        columns: [{
                data: "tsp",
                title: "时间",
                render: renderTime
            },
            {
                data: "score",
                title: "满意度",
                render: renderScore
            },
            {
                data: "shortComment",
                title: "不满原因"
            },
            {
                data: "userComment",
                title: "用户评论"
            },
            {
                data: "clientUserId",
                title: "操作",
                render: renderView
            },
        ],
        language: dataTableLanguage
    });

    // $("#search-btn").on("click", function () {
    // 	table.draw();
    // });
    $("#score-val").on("change", function () {
        table.draw();
    });
    $("#page-change").on("change", function () {
        var len = $(this).val();
        table.page.len(len).draw();
    });
}

function renderView(data) {
    if (!data) {
        return "";
    } else {
        return "<botton type='botton' class='btn btn-sm btn-success view-record' data-id='" + data + "'>查看聊天记录</botton>";
    }
}

function renderTime(data) {
    if (!data) {
        return "无数据";
    } else {
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
    }
}

function renderScore(data) {
    var score;
    if (!data && data !== 0) {
        return "无数据";
    } else {
        switch (data) {
            case 100:
                score = "非常满意";
                break;
            case 75:
                score = "满意";
                break;
            case 50:
                score = "一般";
                break;
            case 25:
                score = "不满意";
                break;
            case 0:
                score = "非常不满意";
                break;
            default:
                score = data + "分";
                break;
        }
        return score;
    }
}

// function getClassify() {
// 	$.ajax({
// 		url: "knowledge/classifys",
// 		type: "get",
// 		success: function (data) {
// 			var d = [];
// 			data.forEach(function (v) {
// 				if (v.id === 0) {
// 					v.parentId = "#";
// 				}
// 				d.push({
// 					text: v.value,
// 					parent: v.parentId,
// 					id: v.id
// 				});
// 			});
// 			initClassifyTree(d);
// 		}
// 	});
// }

// function initClassifyTree(d) {
// 	var tree = $("#select-classify").jstree({
// 		"core": {
// 			"data": d,
// 			"strings": false,
// 			"animation": 100,
// 			"themes": {
// 				"icons": false
// 			},
// 			"multiple": true
// 		},
// 		"checkbox": {
// 			"keep_selected_style": true,
// 			"tie_selection": true,
// 			"visible": false
// 		},
// 		"plugins": ["checkbox"]
// 	}).on('loaded.jstree', function () {
// 		tree.jstree('open_all');
// 	}).on("select_node.jstree deselect_node.jstree", updateClassifyValue);

// 	$("#select-classify-text").on("click", function () {
// 		$("#select-classify").slideToggle("fast");
// 	});
// 	$("#select-classify").on("mouseleave", function () {
// 		$("#select-classify").slideUp("fast");
// 	});

// }

// function updateClassifyValue() {
// 	var data = $("#select-classify").jstree().get_selected(true);
// 	var classify = $("#select-classify-text");
// 	var tmp = {
// 		val: [],
// 		dataVal: []
// 	};
// 	if (data.length <= 0) {
// 		tmp.val = ["所有问题"];
// 	}
// 	else if (data.length === $("#select-classify .jstree-node").length) {
// 		tmp.val = ["所有问题"];
// 	}
// 	else {
// 		data.forEach(function (v) {
// 			if (v.id === "0") {
// 				return;
// 			}
// 			else {
// 				tmp.val.push(v.text);
// 				tmp.dataVal.push(v.id);
// 			}
// 		});
// 	}
// 	classify.text(tmp.val.join(","));
// 	classify.attr("data-value", tmp.dataVal.join(","));
// }


function cleanData(data) {
    var d = {};
    for (var i in data) {
        if (data[i] !== undefined && data[i] !== null && data[i] !== "") {
            d[i] = data[i];
        }
    }
    return d;
}


function initView() {
    $("#key-table").on("click", ".view-record", function () {
        createRecordTable($(this));
    });
}

function cleanRecordTable() {
    if (recordTable) {
        recordTable.destroy();
        recordTable = null;
    }
}

function createRecordTable(el) {
    cleanRecordTable();
    disableBtn(el);
    var id = el.attr("data-id");
    recordTable = $("#view-record").DataTable({
        ajax: {
            type: "GET",
            url: "spss/queryClientDetail",
            dataSrc: function (data) {
                var d = data.rows;
                return d;
            },
            data: function (data) {
                return {
                    stringUid: id,
                    category: -100,
                    classifys: -100,
                    startDay: new Date("1970/1/1").toString(),
                    endDay: new Date().toString(),
                    page: Math.floor((data.start + data.length) / data.length),
                    rows: 20,
                    sort: "time",
                    order: "desc",
                };
            },
            complete: function () {
                ableBtn(el);
            }
        },
        info: false,
        processing: false, //加载提示
        serverSide: true, //后端分页
        searching: false, //搜索栏
        ordering: false, //排序
        lengthChange: false, //页面显示栏数修改
        paging: true, //分页
        autoWidth: false,
        pagingType: "simple_numbers",
        pageLength: 20, //每页显示条目
        scrollY: window.innerHeight - 350,
        scrollCollapse: true, //内容变少固定高度
        initComplete: function () {
            //var emptyEl = $("#view-record .dataTables_empty");
            $("#view-record-modal").modal('show');
            // if (emptyEl.length > 0) {
            // 	emptyEl.attr("colspan", $("#view-record thead th").length);
            // }
        },
        columns: [{
                data: "question",
                title: "问题"
            },
            {
                data: "answer",
                title: "回答"
            },
            {
                data: "classifyName",
                title: "分类"
            },
            {
                data: "time",
                title: "时间"
            }
        ],
        language: dataTableLanguage
    });
}

function disableBtn(el) {
    el.attr("disabled", "disabled");
    el.html("<i class='fa fa-spinner rotate'></i>");
}

function ableBtn(el) {
    el.attr("disabled", null);
    el.text("查看聊天记录");
}

function closeModalCallBack() {
    $("#view-record-modal").on("hidden.bs.modal", function () {
        cleanRecordTable();
    });
    $("#view-record-modal").on("show.bs.modal", function () {
        if (recordTable) {
            resizeTh();
        }
    });
}

function resizeTh() {
    if ($("#view-record-modal .modal-body").width() <= 0) {
        setTimeout(function () {
            resizeTh();
        }, 100);
        return;
    } else {
        recordTable.columns.adjust();
    }
}


function initCount() {
    $.ajax({
        url: "spss/robotFeedback/count",
        type: "GET",
        success: function (data) {
            var d = {
                labels: data.msg.x, //X轴
                datasets: [{
                    data: data.msg.y,
                    label: "%",
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: hoverBackgroundColor
                }]
            };
            new Chart($("#count"), {
                type: 'pie',
                data: d,
                options: {
                    showPercentage: true,
                    legend: {
                        onClick: function () {
                            return false;
                        }
                    }
                }
            });
            resizeHeight();
        }
    });
}

function initChartPlugin() {
    Chart.pluginService.register({
        afterDraw: function (chart) {
            if (chart.config.options.showPercentage || chart.config.options.showLabel) {
                var self = chart.config;
                var ctx = chart.chart.ctx;

                ctx.font = '14px Arial';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";

                self.data.datasets.forEach(function (dataset) {
                    var total = 0, //total values to compute fraction
                        labelxy = [],
                        offset = Math.PI / 2, //start sector from top
                        radius,
                        centerx,
                        centery,
                        lastend = 0; //prev arc's end line: starting with 0

                    //for (var val of dataset.data) { total += val; console.log(val) }
                    dataset.data.forEach(function (v) {
                        total += v;
                    });

                    //TODO needs improvement
                    var i = 0;
                    var meta = dataset._meta[i];
                    while (!meta) {
                        i++;
                        meta = dataset._meta[i];
                    }

                    var element;
                    for (var index = 0; index < meta.data.length; index++) {

                        element = meta.data[index];
                        radius = 0.9 * element._view.outerRadius - element._view.innerRadius;
                        centerx = element._model.x;
                        centery = element._model.y;
                        var thispart = dataset.data[index],
                            arcsector = Math.PI * (2 * thispart / total);
                        if (element.hasValue() && dataset.data[index] > 0) {
                            labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
                        } else {
                            labelxy.push(-1);
                        }
                        lastend += arcsector;
                    }


                    var lradius = radius * 3 / 4;
                    for (var idx in labelxy) {
                        if (labelxy[idx] === -1) continue;
                        var langle = labelxy[idx],
                            dx = centerx + lradius * Math.cos(langle),
                            dy = centery + lradius * Math.sin(langle),
                            val = Math.round(dataset.data[idx] / total * 100);
                        if (chart.config.options.showPercentage)
                            ctx.fillText(val + '%', dx, dy);
                        else
                            ctx.fillText(chart.config.data.labels[idx], dx, dy);
                    }
                    ctx.restore();
                });
            }
        }
    });
}



// function initExport() {
// 	$("#export-btn").on("click", function () {
// 		var val = $("#export-select").val();
// 		if (!val) {
// 			exportImgAll();
// 		}
// 		else {
// 			exportImg($(val));
// 		}
// 	});
// }

// function exportImg(el) {
// 	var url = el.get(0).toDataURL("image/png");
// 	downloadFile(el.attr("id") + ".png", url);
// }

// function downloadFile(fileName, content) {
// 	var aLink = document.createElement('a');
// 	var blob = new Blob([content]);
// 	var evt = document.createEvent("HTMLEvents");
// 	evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
// 	aLink.download = fileName;
// 	aLink.href = URL.createObjectURL(blob);
// 	aLink.dispatchEvent(evt);
// }
