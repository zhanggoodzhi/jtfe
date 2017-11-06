webpackJsonp([7],{

/***/ 1146:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(559);


/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";



    var echarts = __webpack_require__(10);
    var graphic = __webpack_require__(17);
    var layout = __webpack_require__(45);

    // Model
    echarts.extendComponentModel({

        type: 'title',

        layoutMode: {type: 'box', ignoreSize: true},

        defaultOption: {
            // 一级层叠
            zlevel: 0,
            // 二级层叠
            z: 6,
            show: true,

            text: '',
            // 超链接跳转
            // link: null,
            // 仅支持self | blank
            target: 'blank',
            subtext: '',

            // 超链接跳转
            // sublink: null,
            // 仅支持self | blank
            subtarget: 'blank',

            // 'center' ¦ 'left' ¦ 'right'
            // ¦ {number}（x坐标，单位px）
            left: 0,
            // 'top' ¦ 'bottom' ¦ 'center'
            // ¦ {number}（y坐标，单位px）
            top: 0,

            // 水平对齐
            // 'auto' | 'left' | 'right' | 'center'
            // 默认根据 left 的位置判断是左对齐还是右对齐
            // textAlign: null
            //
            // 垂直对齐
            // 'auto' | 'top' | 'bottom' | 'middle'
            // 默认根据 top 位置判断是上对齐还是下对齐
            // textBaseline: null

            backgroundColor: 'rgba(0,0,0,0)',

            // 标题边框颜色
            borderColor: '#ccc',

            // 标题边框线宽，单位px，默认为0（无边框）
            borderWidth: 0,

            // 标题内边距，单位px，默认各方向内边距为5，
            // 接受数组分别设定上右下左边距，同css
            padding: 5,

            // 主副标题纵向间隔，单位px，默认为10，
            itemGap: 10,
            textStyle: {
                fontSize: 18,
                fontWeight: 'bolder',
                color: '#333'
            },
            subtextStyle: {
                color: '#aaa'
            }
        }
    });

    // View
    echarts.extendComponentView({

        type: 'title',

        render: function (titleModel, ecModel, api) {
            this.group.removeAll();

            if (!titleModel.get('show')) {
                return;
            }

            var group = this.group;

            var textStyleModel = titleModel.getModel('textStyle');
            var subtextStyleModel = titleModel.getModel('subtextStyle');

            var textAlign = titleModel.get('textAlign');
            var textBaseline = titleModel.get('textBaseline');

            var textEl = new graphic.Text({
                style: graphic.setTextStyle({}, textStyleModel, {
                    text: titleModel.get('text'),
                    textFill: textStyleModel.getTextColor()
                }, {disableBox: true}),
                z2: 10
            });

            var textRect = textEl.getBoundingRect();

            var subText = titleModel.get('subtext');
            var subTextEl = new graphic.Text({
                style: graphic.setTextStyle({}, subtextStyleModel, {
                    text: subText,
                    textFill: subtextStyleModel.getTextColor(),
                    y: textRect.height + titleModel.get('itemGap'),
                    textVerticalAlign: 'top'
                }, {disableBox: true}),
                z2: 10
            });

            var link = titleModel.get('link');
            var sublink = titleModel.get('sublink');

            textEl.silent = !link;
            subTextEl.silent = !sublink;

            if (link) {
                textEl.on('click', function () {
                    window.open(link, '_' + titleModel.get('target'));
                });
            }
            if (sublink) {
                subTextEl.on('click', function () {
                    window.open(sublink, '_' + titleModel.get('subtarget'));
                });
            }

            group.add(textEl);
            subText && group.add(subTextEl);
            // If no subText, but add subTextEl, there will be an empty line.

            var groupRect = group.getBoundingRect();
            var layoutOption = titleModel.getBoxLayoutParams();
            layoutOption.width = groupRect.width;
            layoutOption.height = groupRect.height;
            var layoutRect = layout.getLayoutRect(
                layoutOption, {
                    width: api.getWidth(),
                    height: api.getHeight()
                }, titleModel.get('padding')
            );
            // Adjust text align based on position
            if (!textAlign) {
                // Align left if title is on the left. center and right is same
                textAlign = titleModel.get('left') || titleModel.get('right');
                if (textAlign === 'middle') {
                    textAlign = 'center';
                }
                // Adjust layout by text align
                if (textAlign === 'right') {
                    layoutRect.x += layoutRect.width;
                }
                else if (textAlign === 'center') {
                    layoutRect.x += layoutRect.width / 2;
                }
            }
            if (!textBaseline) {
                textBaseline = titleModel.get('top') || titleModel.get('bottom');
                if (textBaseline === 'center') {
                    textBaseline = 'middle';
                }
                if (textBaseline === 'bottom') {
                    layoutRect.y += layoutRect.height;
                }
                else if (textBaseline === 'middle') {
                    layoutRect.y += layoutRect.height / 2;
                }

                textBaseline = textBaseline || 'top';
            }

            group.attr('position', [layoutRect.x, layoutRect.y]);
            var alignStyle = {
                textAlign: textAlign,
                textVerticalAlign: textBaseline
            };
            textEl.setStyle(alignStyle);
            subTextEl.setStyle(alignStyle);

            // Render background
            // Get groupRect again because textAlign has been changed
            groupRect = group.getBoundingRect();
            var padding = layoutRect.margin;
            var style = titleModel.getItemStyle(['color', 'opacity']);
            style.fill = titleModel.get('backgroundColor');
            var rect = new graphic.Rect({
                shape: {
                    x: groupRect.x - padding[3],
                    y: groupRect.y - padding[0],
                    width: groupRect.width + padding[1] + padding[3],
                    height: groupRect.height + padding[0] + padding[2],
                    r: titleModel.get('borderRadius')
                },
                style: style,
                silent: true
            });
            graphic.subPixelOptimizeRect(rect);

            group.add(rect);
        }
    });


/***/ }),

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
__webpack_require__(7);
var tables_1 = __webpack_require__(13);
var echarts = __webpack_require__(10);
__webpack_require__(792);
__webpack_require__(131);
__webpack_require__(122);
__webpack_require__(119);
__webpack_require__(120);
__webpack_require__(37);
__webpack_require__(943);
var KnowledgeClassifyIndex;
(function (KnowledgeClassifyIndex) {
    var chartHeight;
    var tree;
    var table;
    var refreshT;
    var yearChart, monthChart, dayChart, hourChart;
    var time = new Date();
    var chartType = {
        y: 'bar',
        m: 'bar',
        d: 'bar',
        h: 'bar'
    };
    var temporaryTime = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        day: time.getDate(),
        hour: time.getHours()
    };
    var sendTableData = Object.assign({}, temporaryTime); // 表格的发送数据
    var xAxis = ['空'], chartData = ['0']; // 记录每次获取的横坐标与数据
    $(function () {
        init();
    });
    function init() {
        initChartHeight();
        bindResize();
        initTree();
    }
    function initTree() {
        tree = new utils_1.Tree({
            el: $('#main-classify'),
            data: utils_1.formatClassify(selectData, true),
            multiple: true,
            selected: true,
            initComplete: function () {
                initEcharts();
                bindClickEvent();
                initTable();
            }
        });
    }
    function bindResize() {
        $(window).resize(function () {
            $('.right_col').css('min-height', window.innerHeight - 5);
            initChartHeight();
            echartsResize();
            DataTablesBodyResize();
        });
    }
    function echartsResize() {
        yearChart.resize();
        monthChart.resize();
        dayChart.resize();
        hourChart.resize();
    }
    function getScrollHeight() {
        return (chartHeight + 35) * 4 + 32 - 32 - $('.cloud-search-area').height() - 51 - 27;
    }
    function DataTablesBodyResize() {
        $('.dataTables_scrollBody').height(chartHeight === 109 ? getScrollHeight() : tables_1.getTableHeight());
    }
    function initChartHeight() {
        chartHeight = (utils_1.getMinContentHeight() - 32) / 4 - 35;
        if (chartHeight < 109) {
            chartHeight = 109;
        }
        $('.chart').height(chartHeight);
    }
    function bindBtnEvent(el) {
        el.find('.bar').on('click', function () {
            var type = $(this).data('type');
            chartType[type] = 'bar';
            saveAndUpdateData(type);
            setChartOption(type);
        });
        el.find('.line').on('click', function () {
            var type = $(this).data('type');
            chartType[type] = 'line';
            saveAndUpdateData(type);
            setChartOption(type);
        });
    }
    function saveAndUpdateData(type) {
        var op;
        switch (type) {
            case 'y':
                op = yearChart.getOption();
                xAxis = op.xAxis[0].data;
                chartData = op.series[0].data;
                break;
            case 'm':
                op = monthChart.getOption();
                xAxis = op.xAxis[0].data;
                chartData = op.series[0].data;
                break;
            case 'd':
                op = dayChart.getOption();
                xAxis = op.xAxis[0].data;
                chartData = op.series[0].data;
                break;
            case 'h':
                op = hourChart.getOption();
                xAxis = op.xAxis[0].data;
                chartData = op.series[0].data;
                break;
            default:
                op = yearChart.getOption();
                xAxis = op.xAxis[0].data;
                chartData = op.series[0].data;
                break;
        }
    }
    function initEcharts() {
        yearChart = echarts.init(document.getElementById('year-chart'));
        monthChart = echarts.init(document.getElementById('month-chart'));
        dayChart = echarts.init(document.getElementById('day-chart'));
        hourChart = echarts.init(document.getElementById('hour-chart'));
        getChartData('y');
        getChartData('m');
        getChartData('d');
        getChartData('h');
    }
    function bindClickEvent() {
        var yearWrap = $('.year-wrap-wrap');
        var monthWrap = $('.month-wrap-wrap');
        var dayWrap = $('.day-wrap-wrap');
        var hourWrap = $('.hour-wrap-wrap');
        bindBtnEvent(yearWrap);
        bindBtnEvent(monthWrap);
        bindBtnEvent(dayWrap);
        bindBtnEvent(hourWrap);
        yearChart.on('click', function (params) {
            if (params.name === temporaryTime.year.toString() && temporaryTime.month === 1 && temporaryTime.day === 1 && temporaryTime.hour === 1) {
                return;
            }
            temporaryTime.year = Number(params.name);
            temporaryTime.month = 1;
            temporaryTime.day = 1;
            temporaryTime.hour = 1;
            sendTableData = getTableTime('y');
            getChartData('y');
            getChartData('m');
            getChartData('d');
            getChartData('h');
            refreshT.refresh(true);
        });
        monthChart.on('click', function (params) {
            if (params.name === temporaryTime.month.toString() && temporaryTime.day === 1 && temporaryTime.hour === 1) {
                return;
            }
            temporaryTime.month = Number(params.name);
            temporaryTime.day = 1;
            temporaryTime.hour = 1;
            sendTableData = getTableTime('m');
            getChartData('m');
            getChartData('d');
            getChartData('h');
            refreshT.refresh(true);
        });
        dayChart.on('click', function (params) {
            if (params.name === temporaryTime.day.toString() && temporaryTime.hour === 1) {
                return;
            }
            temporaryTime.day = Number(params.name);
            temporaryTime.hour = 1;
            sendTableData = getTableTime('d');
            getChartData('d');
            getChartData('h');
            refreshT.refresh(true);
        });
        hourChart.on('click', function (params) {
            if (params.name === temporaryTime.hour.toString()) {
                return;
            }
            temporaryTime.hour = Number(params.name);
            sendTableData = getTableTime('h');
            getChartData('h');
            refreshT.refresh(true);
        });
    }
    /**
     *
     *
     * @param {string} type
     */
    function getChartData(type) {
        $.ajax({
            url: 'spss/getData',
            type: 'POST',
            data: getChartTime(type),
            success: function (data) {
                var dataArr = data.data.data.split('||');
                if (dataArr[0] === 'null' || dataArr[0] === '') {
                    xAxis = ['空'];
                    chartData = ['0'];
                    setChartOption(type);
                    return;
                }
                xAxis = dataArr[0].split(',');
                chartData = dataArr[1].split(',');
                setChartOption(type);
            }
        });
    }
    /**
     *
     *
     * @param {string} title
     * @returns {*} 返回options
     */
    function getOp(title, type) {
        return {
            color: ['#ffb000', '#37a6e7', '#4caf50'],
            grid: {
                left: '1%',
                top: '20%',
                right: '1%',
                bottom: '8%',
                containLabel: true
            },
            calculable: false,
            tooltip: {
                trigger: 'item'
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                },
                left: '55px',
                top: '-10px'
            },
            title: {
                text: title + ' 对话次数',
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'bolder',
                    color: '#999'
                },
                y: 'top',
                x: 'right'
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: { show: true },
                    axisTick: { show: false },
                    axisLabel: { interval: 0, rotate: 45 },
                    data: xAxis
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    splitLine: { show: false }
                }
            ],
            series: [
                {
                    name: '问答数',
                    type: chartType[type],
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return getColor(params, title);
                            }
                        }
                    },
                    data: chartData
                }
            ]
        };
    }
    /**
     *
     *
     * @param {any} params
     * @param {string} title
     * @returns {string}
     */
    function getColor(params, title) {
        switch (title) {
            case '年':
                return params.name === sendTableData.year.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
            case '月':
                return params.name === sendTableData.month.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
            case '日':
                return params.name === sendTableData.day.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
            case '时':
                return params.name === sendTableData.hour.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
            default:
                return params.name === sendTableData.year.toString() ? 'rgba(42,63,84,.9)' : 'rgba(42,63,84,.6)';
        }
    }
    /**
     *
     *
     * @param {string} type
     */
    function setChartOption(type) {
        switch (type) {
            case 'y':
                yearChart.setOption(getOp('年', type));
                break;
            case 'm':
                monthChart.setOption(getOp('月', type));
                break;
            case 'd':
                dayChart.setOption(getOp('日', type));
                break;
            case 'h':
                hourChart.setOption(getOp('时', type));
                break;
            default:
                yearChart.setOption(getOp('年', type));
                break;
        }
    }
    function initTable() {
        table = $('#table').DataTable(Object.assign(tables_1.commonConfig(), {
            ajax: {
                url: 'spss/queryLog1',
                type: 'POST',
                dataSrc: function (data) { return data.rows; },
                data: function (data) {
                    var d = {
                        page: tables_1.getPage(data),
                        rows: data.length,
                        sort: 'id',
                        order: 'desc'
                    };
                    Object.assign(d, sendTableData, {
                        answerStatus: $('#status').val(),
                        device: $('#device').val(),
                        classifys: tree.selected.join(','),
                        character: $('#character').val(),
                        sender: $('#sender').val(),
                        keyword: $('#keyword').val()
                    });
                    return utils_1.cleanObject(d);
                }
            },
            scrollY: chartHeight === 109 ? getScrollHeight() : tables_1.getTableHeight(),
            initComplete: initComplete,
            columns: [
                { data: 'question', title: '问题', createdCell: tables_1.createAddTitle },
                { data: 'answer', title: '回复', createdCell: tables_1.createAddTitle },
                { data: 'classifyName', title: '类型', createdCell: tables_1.createAddTitle },
                { data: 'characterName', title: '角色', createdCell: tables_1.createAddTitle },
                { data: 'sender', title: '用户', createdCell: tables_1.createAddTitle },
                { data: 'time', title: '时间', createdCell: tables_1.createAddTitle }
            ]
        }));
        refreshT = new tables_1.Table(table);
    }
    /**
     *
     *
     * @param {string} type
     * @returns {Idate}
     */
    function getChartTime(type) {
        var t;
        switch (type) {
            case 'y':
                t = {
                    year: -1,
                    month: -1,
                    day: -1,
                    hour: -1
                };
                break;
            case 'm':
                t = {
                    year: temporaryTime.year,
                    month: -1,
                    day: -1,
                    hour: -1
                };
                break;
            case 'd':
                t = {
                    year: temporaryTime.year,
                    month: temporaryTime.month,
                    day: -1,
                    hour: -1
                };
                break;
            case 'h':
                t = {
                    year: temporaryTime.year,
                    month: temporaryTime.month,
                    day: temporaryTime.day,
                    hour: -1
                };
                break;
            default:
                t = {
                    year: -1,
                    month: -1,
                    day: -1,
                    hour: -1
                };
                break;
        }
        return t;
    }
    /**
     *
     *
     * @param {string} type
     * @returns {Idate}
     */
    function getTableTime(type) {
        var t;
        switch (type) {
            case 'y':
                t = {
                    year: temporaryTime.year,
                    month: -1,
                    day: -1,
                    hour: -1
                };
                break;
            case 'm':
                t = {
                    year: temporaryTime.year,
                    month: temporaryTime.month,
                    day: -1,
                    hour: -1
                };
                break;
            case 'd':
                t = {
                    year: temporaryTime.year,
                    month: temporaryTime.month,
                    day: temporaryTime.day,
                    hour: -1
                };
                break;
            case 'h':
                t = {
                    year: temporaryTime.year,
                    month: temporaryTime.month,
                    day: temporaryTime.day,
                    hour: temporaryTime.hour
                };
                break;
            default:
                t = {
                    year: temporaryTime.year,
                    month: temporaryTime.month,
                    day: temporaryTime.day,
                    hour: temporaryTime.hour
                };
                break;
        }
        return t;
    }
    function initComplete() {
        $('#search').on('click', function () {
            refreshT.refresh(true);
        });
        utils_1.bindEnter($('#sender,#keyword'), function () {
            refreshT.refresh(true);
        });
        $('#reset-btn').on('click', function () {
            setTimeout(function () {
                tree.resetFirst();
            }, 0);
        });
    }
})(KnowledgeClassifyIndex || (KnowledgeClassifyIndex = {}));


/***/ }),

/***/ 792:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);

    __webpack_require__(371);

    __webpack_require__(793);
    __webpack_require__(794);

    var barLayoutGrid = __webpack_require__(866);
    var echarts = __webpack_require__(10);

    echarts.registerLayout(zrUtil.curry(barLayoutGrid, 'bar'));

    // Visual coding for legend
    echarts.registerVisual(function (ecModel) {
        ecModel.eachSeriesByType('bar', function (seriesModel) {
            var data = seriesModel.getData();
            data.setVisual('legendSymbol', 'roundRect');
        });
    });

    // In case developer forget to include grid component
    __webpack_require__(356);


/***/ }),

/***/ 793:
/***/ (function(module, exports, __webpack_require__) {



    module.exports = __webpack_require__(795).extend({

        type: 'series.bar',

        dependencies: ['grid', 'polar'],

        brushSelector: 'rect'
    });


/***/ }),

/***/ 794:
/***/ (function(module, exports, __webpack_require__) {

"use strict";



    var zrUtil = __webpack_require__(2);
    var graphic = __webpack_require__(17);
    var helper = __webpack_require__(797);

    var BAR_BORDER_WIDTH_QUERY = ['itemStyle', 'normal', 'barBorderWidth'];

    // FIXME
    // Just for compatible with ec2.
    zrUtil.extend(__webpack_require__(62).prototype, __webpack_require__(796));

    var BarView = __webpack_require__(10).extendChartView({

        type: 'bar',

        render: function (seriesModel, ecModel, api) {
            var coordinateSystemType = seriesModel.get('coordinateSystem');

            if (coordinateSystemType === 'cartesian2d'
                || coordinateSystemType === 'polar'
            ) {
                this._render(seriesModel, ecModel, api);
            }
            else if (__DEV__) {
                console.warn('Only cartesian2d and polar supported for bar.');
            }

            return this.group;
        },

        dispose: zrUtil.noop,

        _render: function (seriesModel, ecModel, api) {
            var group = this.group;
            var data = seriesModel.getData();
            var oldData = this._data;

            var coord = seriesModel.coordinateSystem;
            var baseAxis = coord.getBaseAxis();
            var isHorizontalOrRadial;

            if (coord.type === 'cartesian2d') {
                isHorizontalOrRadial = baseAxis.isHorizontal();
            }
            else if (coord.type === 'polar') {
                isHorizontalOrRadial = baseAxis.dim === 'angle';
            }

            var animationModel = seriesModel.isAnimationEnabled() ? seriesModel : null;

            data.diff(oldData)
                .add(function (dataIndex) {
                    if (!data.hasValue(dataIndex)) {
                        return;
                    }

                    var itemModel = data.getItemModel(dataIndex);
                    var layout = getLayout[coord.type](data, dataIndex, itemModel);
                    var el = elementCreator[coord.type](
                        data, dataIndex, itemModel, layout, isHorizontalOrRadial, animationModel
                    );
                    data.setItemGraphicEl(dataIndex, el);
                    group.add(el);

                    updateStyle(
                        el, data, dataIndex, itemModel, layout,
                        seriesModel, isHorizontalOrRadial, coord.type === 'polar'
                    );
                })
                .update(function (newIndex, oldIndex) {
                    var el = oldData.getItemGraphicEl(oldIndex);

                    if (!data.hasValue(newIndex)) {
                        group.remove(el);
                        return;
                    }

                    var itemModel = data.getItemModel(newIndex);
                    var layout = getLayout[coord.type](data, newIndex, itemModel);

                    if (el) {
                        graphic.updateProps(el, {shape: layout}, animationModel, newIndex);
                    }
                    else {
                        el = elementCreator[coord.type](
                            data, newIndex, itemModel, layout, isHorizontalOrRadial, animationModel, true
                        );
                    }

                    data.setItemGraphicEl(newIndex, el);
                    // Add back
                    group.add(el);

                    updateStyle(
                        el, data, newIndex, itemModel, layout,
                        seriesModel, isHorizontalOrRadial, coord.type === 'polar'
                    );
                })
                .remove(function (dataIndex) {
                    var el = oldData.getItemGraphicEl(dataIndex);
                    if (coord.type === 'cartesian2d') {
                        el && removeRect(dataIndex, animationModel, el);
                    }
                    else {
                        el && removeSector(dataIndex, animationModel, el);
                    }
                })
                .execute();

            this._data = data;
        },

        remove: function (ecModel, api) {
            var group = this.group;
            var data = this._data;
            if (ecModel.get('animation')) {
                if (data) {
                    data.eachItemGraphicEl(function (el) {
                        if (el.type === 'sector') {
                            removeSector(el.dataIndex, ecModel, el);
                        }
                        else {
                            removeRect(el.dataIndex, ecModel, el);
                        }
                    });
                }
            }
            else {
                group.removeAll();
            }
        }
    });

    var elementCreator = {

        cartesian2d: function (
            data, dataIndex, itemModel, layout, isHorizontal,
            animationModel, isUpdate
        ) {
            var rect = new graphic.Rect({shape: zrUtil.extend({}, layout)});

            // Animation
            if (animationModel) {
                var rectShape = rect.shape;
                var animateProperty = isHorizontal ? 'height' : 'width';
                var animateTarget = {};
                rectShape[animateProperty] = 0;
                animateTarget[animateProperty] = layout[animateProperty];
                graphic[isUpdate ? 'updateProps' : 'initProps'](rect, {
                    shape: animateTarget
                }, animationModel, dataIndex);
            }

            return rect;
        },

        polar: function (
            data, dataIndex, itemModel, layout, isRadial,
            animationModel, isUpdate
        ) {
            var sector = new graphic.Sector({shape: zrUtil.extend({}, layout)});

            // Animation
            if (animationModel) {
                var sectorShape = sector.shape;
                var animateProperty = isRadial ? 'r' : 'endAngle';
                var animateTarget = {};
                sectorShape[animateProperty] = isRadial ? 0 : layout.startAngle;
                animateTarget[animateProperty] = layout[animateProperty];
                graphic[isUpdate ? 'updateProps' : 'initProps'](sector, {
                    shape: animateTarget
                }, animationModel, dataIndex);
            }

            return sector;
        }
    };

    function removeRect(dataIndex, animationModel, el) {
        // Not show text when animating
        el.style.text = null;
        graphic.updateProps(el, {
            shape: {
                width: 0
            }
        }, animationModel, dataIndex, function () {
            el.parent && el.parent.remove(el);
        });
    }

    function removeSector(dataIndex, animationModel, el) {
        // Not show text when animating
        el.style.text = null;
        graphic.updateProps(el, {
            shape: {
                r: el.shape.r0
            }
        }, animationModel, dataIndex, function () {
            el.parent && el.parent.remove(el);
        });
    }

    var getLayout = {
        cartesian2d: function (data, dataIndex, itemModel) {
            var layout = data.getItemLayout(dataIndex);
            var fixedLineWidth = getLineWidth(itemModel, layout);

            // fix layout with lineWidth
            var signX = layout.width > 0 ? 1 : -1;
            var signY = layout.height > 0 ? 1 : -1;
            return {
                x: layout.x + signX * fixedLineWidth / 2,
                y: layout.y + signY * fixedLineWidth / 2,
                width: layout.width - signX * fixedLineWidth,
                height: layout.height - signY * fixedLineWidth
            };
        },

        polar: function (data, dataIndex, itemModel) {
            var layout = data.getItemLayout(dataIndex);
            return {
                cx: layout.cx,
                cy: layout.cy,
                r0: layout.r0,
                r: layout.r,
                startAngle: layout.startAngle,
                endAngle: layout.endAngle
            };
        }
    };

    function updateStyle(
        el, data, dataIndex, itemModel, layout, seriesModel, isHorizontal, isPolar
    ) {
        var color = data.getItemVisual(dataIndex, 'color');
        var opacity = data.getItemVisual(dataIndex, 'opacity');
        var itemStyleModel = itemModel.getModel('itemStyle.normal');
        var hoverStyle = itemModel.getModel('itemStyle.emphasis').getBarItemStyle();

        if (!isPolar) {
            el.setShape('r', itemStyleModel.get('barBorderRadius') || 0);
        }

        el.useStyle(zrUtil.defaults(
            {
                fill: color,
                opacity: opacity
            },
            itemStyleModel.getBarItemStyle()
        ));

        var cursorStyle = itemModel.getShallow('cursor');
        cursorStyle && el.attr('cursor', cursorStyle);

        var labelPositionOutside = isHorizontal
            ? (layout.height > 0 ? 'bottom' : 'top')
            : (layout.width > 0 ? 'left' : 'right');

        if (!isPolar) {
            helper.setLabel(
                el.style, hoverStyle, itemModel, color,
                seriesModel, dataIndex, labelPositionOutside
            );
        }

        graphic.setHoverStyle(el, hoverStyle);
    }

    // In case width or height are too small.
    function getLineWidth(itemModel, rawLayout) {
        var lineWidth = itemModel.get(BAR_BORDER_WIDTH_QUERY) || 0;
        return Math.min(lineWidth, Math.abs(rawLayout.width), Math.abs(rawLayout.height));
    }

    module.exports = BarView;


/***/ }),

/***/ 795:
/***/ (function(module, exports, __webpack_require__) {

"use strict";



    var SeriesModel = __webpack_require__(247);
    var createListFromArray = __webpack_require__(281);

    module.exports = SeriesModel.extend({

        type: 'series.__base_bar__',

        getInitialData: function (option, ecModel) {
            return createListFromArray(option.data, this, ecModel);
        },

        getMarkerPosition: function (value) {
            var coordSys = this.coordinateSystem;
            if (coordSys) {
                // PENDING if clamp ?
                var pt = coordSys.dataToPoint(value, true);
                var data = this.getData();
                var offset = data.getLayout('offset');
                var size = data.getLayout('size');
                var offsetIndex = coordSys.getBaseAxis().isHorizontal() ? 0 : 1;
                pt[offsetIndex] += offset + size / 2;
                return pt;
            }
            return [NaN, NaN];
        },

        defaultOption: {
            zlevel: 0,                  // 一级层叠
            z: 2,                       // 二级层叠
            coordinateSystem: 'cartesian2d',
            legendHoverLink: true,
            // stack: null

            // Cartesian coordinate system
            // xAxisIndex: 0,
            // yAxisIndex: 0,

            // 最小高度改为0
            barMinHeight: 0,
            // 最小角度为0，仅对极坐标系下的柱状图有效
            barMinAngle: 0,
            // cursor: null,

            // barMaxWidth: null,
            // 默认自适应
            // barWidth: null,
            // 柱间距离，默认为柱形宽度的30%，可设固定值
            // barGap: '30%',
            // 类目间柱形距离，默认为类目间距的20%，可设固定值
            // barCategoryGap: '20%',
            // label: {
            //     normal: {
            //         show: false
            //     }
            // },
            itemStyle: {
                // normal: {
                    // color: '各异'
                // },
                // emphasis: {}
            }
        }
    });


/***/ }),

/***/ 796:
/***/ (function(module, exports, __webpack_require__) {




    var getBarItemStyle = __webpack_require__(248)(
        [
            ['fill', 'color'],
            ['stroke', 'borderColor'],
            ['lineWidth', 'borderWidth'],
            // Compatitable with 2
            ['stroke', 'barBorderColor'],
            ['lineWidth', 'barBorderWidth'],
            ['opacity'],
            ['shadowBlur'],
            ['shadowOffsetX'],
            ['shadowOffsetY'],
            ['shadowColor']
        ]
    );
    module.exports = {
        getBarItemStyle: function (excludes) {
            var style = getBarItemStyle.call(this, excludes);
            if (this.getBorderLineDash) {
                var lineDash = this.getBorderLineDash();
                lineDash && (style.lineDash = lineDash);
            }
            return style;
        }
    };


/***/ }),

/***/ 797:
/***/ (function(module, exports, __webpack_require__) {



    var graphic = __webpack_require__(17);

    var helper = {};

    helper.setLabel = function (
        normalStyle, hoverStyle, itemModel, color, seriesModel, dataIndex, labelPositionOutside
    ) {
        var labelModel = itemModel.getModel('label.normal');
        var hoverLabelModel = itemModel.getModel('label.emphasis');

        graphic.setLabelStyle(
            normalStyle, hoverStyle, labelModel, hoverLabelModel,
            {
                labelFetcher: seriesModel,
                labelDataIndex: dataIndex,
                defaultText: seriesModel.getRawValue(dataIndex),
                isRectText: true,
                autoColor: color
            }
        );

        fixPosition(normalStyle);
        fixPosition(hoverStyle);
    };

    function fixPosition(style, labelPositionOutside) {
        if (style.textPosition === 'outside') {
            style.textPosition = labelPositionOutside;
        }
    }

    module.exports = helper;


/***/ }),

/***/ 866:
/***/ (function(module, exports, __webpack_require__) {

"use strict";



    var zrUtil = __webpack_require__(2);
    var numberUtil = __webpack_require__(24);
    var parsePercent = numberUtil.parsePercent;

    var STACK_PREFIX = '__ec_stack_';

    function getSeriesStackId(seriesModel) {
        return seriesModel.get('stack') || STACK_PREFIX + seriesModel.seriesIndex;
    }

    function getAxisKey(axis) {
        return axis.dim + axis.index;
    }

    /**
     * @param {Object} opt
     * @param {module:echarts/coord/Axis} opt.axis Only support category axis currently.
     * @param {number} opt.count Positive interger.
     * @param {number} [opt.barWidth]
     * @param {number} [opt.barMaxWidth]
     * @param {number} [opt.barGap]
     * @param {number} [opt.barCategoryGap]
     * @return {Object} {width, offset, offsetCenter} If axis.type is not 'category', return undefined.
     */
    function getLayoutOnAxis(opt, api) {
        var params = [];
        var baseAxis = opt.axis;
        var axisKey = 'axis0';

        if (baseAxis.type !== 'category') {
            return;
        }
        var bandWidth = baseAxis.getBandWidth();

        for (var i = 0; i < opt.count || 0; i++) {
            params.push(zrUtil.defaults({
                bandWidth: bandWidth,
                axisKey: axisKey,
                stackId: STACK_PREFIX + i
            }, opt));
        }
        var widthAndOffsets = doCalBarWidthAndOffset(params, api);

        var result = [];
        for (var i = 0; i < opt.count; i++) {
            var item = widthAndOffsets[axisKey][STACK_PREFIX + i];
            item.offsetCenter = item.offset + item.width / 2;
            result.push(item);
        }

        return result;
    }

    function calBarWidthAndOffset(barSeries, api) {
        var seriesInfoList = zrUtil.map(barSeries, function (seriesModel) {
            var data = seriesModel.getData();
            var cartesian = seriesModel.coordinateSystem;
            var baseAxis = cartesian.getBaseAxis();
            var axisExtent = baseAxis.getExtent();
            var bandWidth = baseAxis.type === 'category'
                ? baseAxis.getBandWidth()
                : (Math.abs(axisExtent[1] - axisExtent[0]) / data.count());

            var barWidth = parsePercent(
                seriesModel.get('barWidth'), bandWidth
            );
            var barMaxWidth = parsePercent(
                seriesModel.get('barMaxWidth'), bandWidth
            );
            var barGap = seriesModel.get('barGap');
            var barCategoryGap = seriesModel.get('barCategoryGap');

            return {
                bandWidth: bandWidth,
                barWidth: barWidth,
                barMaxWidth: barMaxWidth,
                barGap: barGap,
                barCategoryGap: barCategoryGap,
                axisKey: getAxisKey(baseAxis),
                stackId: getSeriesStackId(seriesModel)
            };
        });

        return doCalBarWidthAndOffset(seriesInfoList, api);
    }

    function doCalBarWidthAndOffset(seriesInfoList, api) {
        // Columns info on each category axis. Key is cartesian name
        var columnsMap = {};

        zrUtil.each(seriesInfoList, function (seriesInfo, idx) {
            var axisKey = seriesInfo.axisKey;
            var bandWidth = seriesInfo.bandWidth;
            var columnsOnAxis = columnsMap[axisKey] || {
                bandWidth: bandWidth,
                remainedWidth: bandWidth,
                autoWidthCount: 0,
                categoryGap: '20%',
                gap: '30%',
                stacks: {}
            };
            var stacks = columnsOnAxis.stacks;
            columnsMap[axisKey] = columnsOnAxis;

            var stackId = seriesInfo.stackId;

            if (!stacks[stackId]) {
                columnsOnAxis.autoWidthCount++;
            }
            stacks[stackId] = stacks[stackId] || {
                width: 0,
                maxWidth: 0
            };

            // Caution: In a single coordinate system, these barGrid attributes
            // will be shared by series. Consider that they have default values,
            // only the attributes set on the last series will work.
            // Do not change this fact unless there will be a break change.

            // TODO
            var barWidth = seriesInfo.barWidth;
            if (barWidth && !stacks[stackId].width) {
                // See #6312, do not restrict width.
                stacks[stackId].width = barWidth;
                barWidth = Math.min(columnsOnAxis.remainedWidth, barWidth);
                columnsOnAxis.remainedWidth -= barWidth;
            }

            var barMaxWidth = seriesInfo.barMaxWidth;
            barMaxWidth && (stacks[stackId].maxWidth = barMaxWidth);
            var barGap = seriesInfo.barGap;
            (barGap != null) && (columnsOnAxis.gap = barGap);
            var barCategoryGap = seriesInfo.barCategoryGap;
            (barCategoryGap != null) && (columnsOnAxis.categoryGap = barCategoryGap);
        });

        var result = {};

        zrUtil.each(columnsMap, function (columnsOnAxis, coordSysName) {

            result[coordSysName] = {};

            var stacks = columnsOnAxis.stacks;
            var bandWidth = columnsOnAxis.bandWidth;
            var categoryGap = parsePercent(columnsOnAxis.categoryGap, bandWidth);
            var barGapPercent = parsePercent(columnsOnAxis.gap, 1);

            var remainedWidth = columnsOnAxis.remainedWidth;
            var autoWidthCount = columnsOnAxis.autoWidthCount;
            var autoWidth = (remainedWidth - categoryGap)
                / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
            autoWidth = Math.max(autoWidth, 0);

            // Find if any auto calculated bar exceeded maxBarWidth
            zrUtil.each(stacks, function (column, stack) {
                var maxWidth = column.maxWidth;
                if (maxWidth && maxWidth < autoWidth) {
                    maxWidth = Math.min(maxWidth, remainedWidth);
                    if (column.width) {
                        maxWidth = Math.min(maxWidth, column.width);
                    }
                    remainedWidth -= maxWidth;
                    column.width = maxWidth;
                    autoWidthCount--;
                }
            });

            // Recalculate width again
            autoWidth = (remainedWidth - categoryGap)
                / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
            autoWidth = Math.max(autoWidth, 0);

            var widthSum = 0;
            var lastColumn;
            zrUtil.each(stacks, function (column, idx) {
                if (!column.width) {
                    column.width = autoWidth;
                }
                lastColumn = column;
                widthSum += column.width * (1 + barGapPercent);
            });
            if (lastColumn) {
                widthSum -= lastColumn.width * barGapPercent;
            }

            var offset = -widthSum / 2;
            zrUtil.each(stacks, function (column, stackId) {
                result[coordSysName][stackId] = result[coordSysName][stackId] || {
                    offset: offset,
                    width: column.width
                };

                offset += column.width * (1 + barGapPercent);
            });
        });

        return result;
    }

    /**
     * @param {string} seriesType
     * @param {module:echarts/model/Global} ecModel
     * @param {module:echarts/ExtensionAPI} api
     */
    function barLayoutGrid(seriesType, ecModel, api) {

        var barWidthAndOffset = calBarWidthAndOffset(
            zrUtil.filter(
                ecModel.getSeriesByType(seriesType),
                function (seriesModel) {
                    return !ecModel.isSeriesFiltered(seriesModel)
                        && seriesModel.coordinateSystem
                        && seriesModel.coordinateSystem.type === 'cartesian2d';
                }
            )
        );

        var lastStackCoords = {};
        var lastStackCoordsOrigin = {};

        ecModel.eachSeriesByType(seriesType, function (seriesModel) {

            // Check series coordinate, do layout for cartesian2d only
            if (seriesModel.coordinateSystem.type !== 'cartesian2d') {
                return;
            }

            var data = seriesModel.getData();
            var cartesian = seriesModel.coordinateSystem;
            var baseAxis = cartesian.getBaseAxis();

            var stackId = getSeriesStackId(seriesModel);
            var columnLayoutInfo = barWidthAndOffset[getAxisKey(baseAxis)][stackId];
            var columnOffset = columnLayoutInfo.offset;
            var columnWidth = columnLayoutInfo.width;
            var valueAxis = cartesian.getOtherAxis(baseAxis);

            var barMinHeight = seriesModel.get('barMinHeight') || 0;

            var valueAxisStart = baseAxis.onZero
                ? valueAxis.toGlobalCoord(valueAxis.dataToCoord(0))
                : valueAxis.getGlobalExtent()[0];

            var coordDims = [
                seriesModel.coordDimToDataDim('x')[0],
                seriesModel.coordDimToDataDim('y')[0]
            ];
            var coords = data.mapArray(coordDims, function (x, y) {
                return cartesian.dataToPoint([x, y]);
            }, true);

            lastStackCoords[stackId] = lastStackCoords[stackId] || [];
            lastStackCoordsOrigin[stackId] = lastStackCoordsOrigin[stackId] || []; // Fix #4243

            data.setLayout({
                offset: columnOffset,
                size: columnWidth
            });

            data.each(seriesModel.coordDimToDataDim(valueAxis.dim)[0], function (value, idx) {
                if (isNaN(value)) {
                    return;
                }

                if (!lastStackCoords[stackId][idx]) {
                    lastStackCoords[stackId][idx] = {
                        p: valueAxisStart, // Positive stack
                        n: valueAxisStart  // Negative stack
                    };
                    lastStackCoordsOrigin[stackId][idx] = {
                        p: valueAxisStart, // Positive stack
                        n: valueAxisStart  // Negative stack
                    };
                }
                var sign = value >= 0 ? 'p' : 'n';
                var coord = coords[idx];
                var lastCoord = lastStackCoords[stackId][idx][sign];
                var lastCoordOrigin = lastStackCoordsOrigin[stackId][idx][sign];
                var x;
                var y;
                var width;
                var height;

                if (valueAxis.isHorizontal()) {
                    x = lastCoord;
                    y = coord[1] + columnOffset;
                    width = coord[0] - lastCoordOrigin;
                    height = columnWidth;

                    lastStackCoordsOrigin[stackId][idx][sign] += width;
                    if (Math.abs(width) < barMinHeight) {
                        width = (width < 0 ? -1 : 1) * barMinHeight;
                    }
                    lastStackCoords[stackId][idx][sign] += width;
                }
                else {
                    x = coord[0] + columnOffset;
                    y = lastCoord;
                    width = columnWidth;
                    height = coord[1] - lastCoordOrigin;

                    lastStackCoordsOrigin[stackId][idx][sign] += height;
                    if (Math.abs(height) < barMinHeight) {
                        // Include zero to has a positive bar
                        height = (height <= 0 ? -1 : 1) * barMinHeight;
                    }
                    lastStackCoords[stackId][idx][sign] += height;
                }

                data.setItemLayout(idx, {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
            }, true);

        }, this);
    }

    barLayoutGrid.getLayoutOnAxis = getLayoutOnAxis;

    module.exports = barLayoutGrid;


/***/ }),

/***/ 943:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1146]);
//# sourceMappingURL=7.js.map