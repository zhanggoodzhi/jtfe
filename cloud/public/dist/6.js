webpackJsonp([6],{

/***/ 1149:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(562);


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

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {


    var echarts = __webpack_require__(10);
    var zrUtil = __webpack_require__(2);
    module.exports = function (seriesType, actionInfos) {
        zrUtil.each(actionInfos, function (actionInfo) {
            actionInfo.update = 'updateView';
            /**
             * @payload
             * @property {string} seriesName
             * @property {string} name
             */
            echarts.registerAction(actionInfo, function (payload, ecModel) {
                var selected = {};
                ecModel.eachComponent(
                    {mainType: 'series', subType: seriesType, query: payload},
                    function (seriesModel) {
                        if (seriesModel[actionInfo.method]) {
                            seriesModel[actionInfo.method](
                                payload.name,
                                payload.dataIndex
                            );
                        }
                        var data = seriesModel.getData();
                        // Create selected map
                        data.each(function (idx) {
                            var name = data.getName(idx);
                            selected[name] = seriesModel.isSelected(name)
                                || false;
                        });
                    }
                );
                return {
                    name: payload.name,
                    selected: selected
                };
            });
        });
    };


/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Data selectable mixin for chart series.
 * To eanble data select, option of series must have `selectedMode`.
 * And each data item will use `selected` to toggle itself selected status
 *
 * @module echarts/chart/helper/DataSelectable
 */


    var zrUtil = __webpack_require__(2);

    module.exports = {

        updateSelectedMap: function (targetList) {
            this._targetList = targetList.slice();
            this._selectTargetMap = zrUtil.reduce(targetList || [], function (targetMap, target) {
                targetMap.set(target.name, target);
                return targetMap;
            }, zrUtil.createHashMap());
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        // PENGING If selectedMode is null ?
        select: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            var selectedMode = this.get('selectedMode');
            if (selectedMode === 'single') {
                this._selectTargetMap.each(function (target) {
                    target.selected = false;
                });
            }
            target && (target.selected = true);
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        unSelect: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            // var selectedMode = this.get('selectedMode');
            // selectedMode !== 'single' && target && (target.selected = false);
            target && (target.selected = false);
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        toggleSelected: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            if (target != null) {
                this[target.selected ? 'unSelect' : 'select'](name, id);
                return target.selected;
            }
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        isSelected: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            return target && target.selected;
        }
    };


/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {



    var zrUtil = __webpack_require__(2);
    var echarts = __webpack_require__(10);

    __webpack_require__(143);
    __webpack_require__(144);

    __webpack_require__(130)('pie', [{
        type: 'pieToggleSelect',
        event: 'pieselectchanged',
        method: 'toggleSelected'
    }, {
        type: 'pieSelect',
        event: 'pieselected',
        method: 'select'
    }, {
        type: 'pieUnSelect',
        event: 'pieunselected',
        method: 'unSelect'
    }]);

    echarts.registerVisual(zrUtil.curry(__webpack_require__(151), 'pie'));

    echarts.registerLayout(zrUtil.curry(
        __webpack_require__(146), 'pie'
    ));

    echarts.registerProcessor(zrUtil.curry(__webpack_require__(148), 'pie'));


/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

"use strict";



    var List = __webpack_require__(135);
    var zrUtil = __webpack_require__(2);
    var modelUtil = __webpack_require__(29);
    var numberUtil = __webpack_require__(24);
    var completeDimensions = __webpack_require__(136);

    var dataSelectableMixin = __webpack_require__(132);

    var PieSeries = __webpack_require__(10).extendSeriesModel({

        type: 'series.pie',

        // Overwrite
        init: function (option) {
            PieSeries.superApply(this, 'init', arguments);

            // Enable legend selection for each data item
            // Use a function instead of direct access because data reference may changed
            this.legendDataProvider = function () {
                return this.getRawData();
            };

            this.updateSelectedMap(option.data);

            this._defaultLabelLine(option);
        },

        // Overwrite
        mergeOption: function (newOption) {
            PieSeries.superCall(this, 'mergeOption', newOption);
            this.updateSelectedMap(this.option.data);
        },

        getInitialData: function (option, ecModel) {
            var dimensions = completeDimensions(['value'], option.data);
            var list = new List(dimensions, this);
            list.initData(option.data);
            return list;
        },

        // Overwrite
        getDataParams: function (dataIndex) {
            var data = this.getData();
            var params = PieSeries.superCall(this, 'getDataParams', dataIndex);
            // FIXME toFixed?

            var valueList = [];
            data.each('value', function (value) {
                valueList.push(value);
            });

            params.percent = numberUtil.getPercentWithPrecision(
                valueList,
                dataIndex,
                data.hostModel.get('percentPrecision')
            );

            params.$vars.push('percent');
            return params;
        },

        _defaultLabelLine: function (option) {
            // Extend labelLine emphasis
            modelUtil.defaultEmphasis(option.labelLine, ['show']);

            var labelLineNormalOpt = option.labelLine.normal;
            var labelLineEmphasisOpt = option.labelLine.emphasis;
            // Not show label line if `label.normal.show = false`
            labelLineNormalOpt.show = labelLineNormalOpt.show
                && option.label.normal.show;
            labelLineEmphasisOpt.show = labelLineEmphasisOpt.show
                && option.label.emphasis.show;
        },

        defaultOption: {
            zlevel: 0,
            z: 2,
            legendHoverLink: true,

            hoverAnimation: true,
            // 默认全局居中
            center: ['50%', '50%'],
            radius: [0, '75%'],
            // 默认顺时针
            clockwise: true,
            startAngle: 90,
            // 最小角度改为0
            minAngle: 0,
            // 选中时扇区偏移量
            selectedOffset: 10,
            // 高亮扇区偏移量
            hoverOffset: 10,

            // If use strategy to avoid label overlapping
            avoidLabelOverlap: true,
            // 选择模式，默认关闭，可选single，multiple
            // selectedMode: false,
            // 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
            // roseType: null,

            percentPrecision: 2,

            // If still show when all data zero.
            stillShowZeroSum: true,

            // cursor: null,

            label: {
                normal: {
                    // If rotate around circle
                    rotate: false,
                    show: true,
                    // 'outer', 'inside', 'center'
                    position: 'outer'
                    // formatter: 标签文本格式器，同Tooltip.formatter，不支持异步回调
                    // 默认使用全局文本样式，详见TEXTSTYLE
                    // distance: 当position为inner时有效，为label位置到圆心的距离与圆半径(环状图为内外半径和)的比例系数
                },
                emphasis: {}
            },
            // Enabled when label.normal.position is 'outer'
            labelLine: {
                normal: {
                    show: true,
                    // 引导线两段中的第一段长度
                    length: 15,
                    // 引导线两段中的第二段长度
                    length2: 15,
                    smooth: false,
                    lineStyle: {
                        // color: 各异,
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 1
                },
                emphasis: {}
            },

            // Animation type canbe expansion, scale
            animationType: 'expansion',

            animationEasing: 'cubicOut',

            data: []
        }
    });

    zrUtil.mixin(PieSeries, dataSelectableMixin);

    module.exports = PieSeries;


/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {



    var graphic = __webpack_require__(17);
    var zrUtil = __webpack_require__(2);

    /**
     * @param {module:echarts/model/Series} seriesModel
     * @param {boolean} hasAnimation
     * @inner
     */
    function updateDataSelected(uid, seriesModel, hasAnimation, api) {
        var data = seriesModel.getData();
        var dataIndex = this.dataIndex;
        var name = data.getName(dataIndex);
        var selectedOffset = seriesModel.get('selectedOffset');

        api.dispatchAction({
            type: 'pieToggleSelect',
            from: uid,
            name: name,
            seriesId: seriesModel.id
        });

        data.each(function (idx) {
            toggleItemSelected(
                data.getItemGraphicEl(idx),
                data.getItemLayout(idx),
                seriesModel.isSelected(data.getName(idx)),
                selectedOffset,
                hasAnimation
            );
        });
    }

    /**
     * @param {module:zrender/graphic/Sector} el
     * @param {Object} layout
     * @param {boolean} isSelected
     * @param {number} selectedOffset
     * @param {boolean} hasAnimation
     * @inner
     */
    function toggleItemSelected(el, layout, isSelected, selectedOffset, hasAnimation) {
        var midAngle = (layout.startAngle + layout.endAngle) / 2;

        var dx = Math.cos(midAngle);
        var dy = Math.sin(midAngle);

        var offset = isSelected ? selectedOffset : 0;
        var position = [dx * offset, dy * offset];

        hasAnimation
            // animateTo will stop revious animation like update transition
            ? el.animate()
                .when(200, {
                    position: position
                })
                .start('bounceOut')
            : el.attr('position', position);
    }

    /**
     * Piece of pie including Sector, Label, LabelLine
     * @constructor
     * @extends {module:zrender/graphic/Group}
     */
    function PiePiece(data, idx) {

        graphic.Group.call(this);

        var sector = new graphic.Sector({
            z2: 2
        });
        var polyline = new graphic.Polyline();
        var text = new graphic.Text();
        this.add(sector);
        this.add(polyline);
        this.add(text);

        this.updateData(data, idx, true);

        // Hover to change label and labelLine
        function onEmphasis() {
            polyline.ignore = polyline.hoverIgnore;
            text.ignore = text.hoverIgnore;
        }
        function onNormal() {
            polyline.ignore = polyline.normalIgnore;
            text.ignore = text.normalIgnore;
        }
        this.on('emphasis', onEmphasis)
            .on('normal', onNormal)
            .on('mouseover', onEmphasis)
            .on('mouseout', onNormal);
    }

    var piePieceProto = PiePiece.prototype;

    piePieceProto.updateData = function (data, idx, firstCreate) {

        var sector = this.childAt(0);

        var seriesModel = data.hostModel;
        var itemModel = data.getItemModel(idx);
        var layout = data.getItemLayout(idx);
        var sectorShape = zrUtil.extend({}, layout);
        sectorShape.label = null;

        if (firstCreate) {
            sector.setShape(sectorShape);

            var animationType = seriesModel.getShallow('animationType');
            if (animationType === 'scale') {
                sector.shape.r = layout.r0;
                graphic.initProps(sector, {
                    shape: {
                        r: layout.r
                    }
                }, seriesModel, idx);
            }
            // Expansion
            else {
                sector.shape.endAngle = layout.startAngle;
                graphic.updateProps(sector, {
                    shape: {
                        endAngle: layout.endAngle
                    }
                }, seriesModel, idx);
            }

        }
        else {
            graphic.updateProps(sector, {
                shape: sectorShape
            }, seriesModel, idx);
        }

        // Update common style
        var itemStyleModel = itemModel.getModel('itemStyle');
        var visualColor = data.getItemVisual(idx, 'color');

        sector.useStyle(
            zrUtil.defaults(
                {
                    lineJoin: 'bevel',
                    fill: visualColor
                },
                itemStyleModel.getModel('normal').getItemStyle()
            )
        );
        sector.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();

        var cursorStyle = itemModel.getShallow('cursor');
        cursorStyle && sector.attr('cursor', cursorStyle);

        // Toggle selected
        toggleItemSelected(
            this,
            data.getItemLayout(idx),
            itemModel.get('selected'),
            seriesModel.get('selectedOffset'),
            seriesModel.get('animation')
        );

        function onEmphasis() {
            // Sector may has animation of updating data. Force to move to the last frame
            // Or it may stopped on the wrong shape
            sector.stopAnimation(true);
            sector.animateTo({
                shape: {
                    r: layout.r + seriesModel.get('hoverOffset')
                }
            }, 300, 'elasticOut');
        }
        function onNormal() {
            sector.stopAnimation(true);
            sector.animateTo({
                shape: {
                    r: layout.r
                }
            }, 300, 'elasticOut');
        }
        sector.off('mouseover').off('mouseout').off('emphasis').off('normal');
        if (itemModel.get('hoverAnimation') && seriesModel.isAnimationEnabled()) {
            sector
                .on('mouseover', onEmphasis)
                .on('mouseout', onNormal)
                .on('emphasis', onEmphasis)
                .on('normal', onNormal);
        }

        this._updateLabel(data, idx);

        graphic.setHoverStyle(this);
    };

    piePieceProto._updateLabel = function (data, idx) {

        var labelLine = this.childAt(1);
        var labelText = this.childAt(2);

        var seriesModel = data.hostModel;
        var itemModel = data.getItemModel(idx);
        var layout = data.getItemLayout(idx);
        var labelLayout = layout.label;
        var visualColor = data.getItemVisual(idx, 'color');

        graphic.updateProps(labelLine, {
            shape: {
                points: labelLayout.linePoints || [
                    [labelLayout.x, labelLayout.y], [labelLayout.x, labelLayout.y], [labelLayout.x, labelLayout.y]
                ]
            }
        }, seriesModel, idx);

        graphic.updateProps(labelText, {
            style: {
                x: labelLayout.x,
                y: labelLayout.y
            }
        }, seriesModel, idx);
        labelText.attr({
            rotation: labelLayout.rotation,
            origin: [labelLayout.x, labelLayout.y],
            z2: 10
        });

        var labelModel = itemModel.getModel('label.normal');
        var labelHoverModel = itemModel.getModel('label.emphasis');
        var labelLineModel = itemModel.getModel('labelLine.normal');
        var labelLineHoverModel = itemModel.getModel('labelLine.emphasis');
        var visualColor = data.getItemVisual(idx, 'color');

        graphic.setLabelStyle(
            labelText.style, labelText.hoverStyle = {}, labelModel, labelHoverModel,
            {
                labelFetcher: data.hostModel,
                labelDataIndex: idx,
                defaultText: data.getName(idx),
                autoColor: visualColor,
                useInsideStyle: !!labelLayout.inside
            },
            {
                textAlign: labelLayout.textAlign,
                textVerticalAlign: labelLayout.verticalAlign,
                opacity: data.getItemVisual(idx, 'opacity')
            }
        );

        labelText.ignore = labelText.normalIgnore = !labelModel.get('show');
        labelText.hoverIgnore = !labelHoverModel.get('show');

        labelLine.ignore = labelLine.normalIgnore = !labelLineModel.get('show');
        labelLine.hoverIgnore = !labelLineHoverModel.get('show');

        // Default use item visual color
        labelLine.setStyle({
            stroke: visualColor,
            opacity: data.getItemVisual(idx, 'opacity')
        });
        labelLine.setStyle(labelLineModel.getModel('lineStyle').getLineStyle());

        labelLine.hoverStyle = labelLineHoverModel.getModel('lineStyle').getLineStyle();

        var smooth = labelLineModel.get('smooth');
        if (smooth && smooth === true) {
            smooth = 0.4;
        }
        labelLine.setShape({
            smooth: smooth
        });
    };

    zrUtil.inherits(PiePiece, graphic.Group);


    // Pie view
    var Pie = __webpack_require__(149).extend({

        type: 'pie',

        init: function () {
            var sectorGroup = new graphic.Group();
            this._sectorGroup = sectorGroup;
        },

        render: function (seriesModel, ecModel, api, payload) {
            if (payload && (payload.from === this.uid)) {
                return;
            }

            var data = seriesModel.getData();
            var oldData = this._data;
            var group = this.group;

            var hasAnimation = ecModel.get('animation');
            var isFirstRender = !oldData;
            var animationType = seriesModel.get('animationType');

            var onSectorClick = zrUtil.curry(
                updateDataSelected, this.uid, seriesModel, hasAnimation, api
            );

            var selectedMode = seriesModel.get('selectedMode');

            data.diff(oldData)
                .add(function (idx) {
                    var piePiece = new PiePiece(data, idx);
                    // Default expansion animation
                    if (isFirstRender && animationType !== 'scale') {
                        piePiece.eachChild(function (child) {
                            child.stopAnimation(true);
                        });
                    }

                    selectedMode && piePiece.on('click', onSectorClick);

                    data.setItemGraphicEl(idx, piePiece);

                    group.add(piePiece);
                })
                .update(function (newIdx, oldIdx) {
                    var piePiece = oldData.getItemGraphicEl(oldIdx);

                    piePiece.updateData(data, newIdx);

                    piePiece.off('click');
                    selectedMode && piePiece.on('click', onSectorClick);
                    group.add(piePiece);
                    data.setItemGraphicEl(newIdx, piePiece);
                })
                .remove(function (idx) {
                    var piePiece = oldData.getItemGraphicEl(idx);
                    group.remove(piePiece);
                })
                .execute();

            if (
                hasAnimation && isFirstRender && data.count() > 0
                // Default expansion animation
                && animationType !== 'scale'
            ) {
                var shape = data.getItemLayout(0);
                var r = Math.max(api.getWidth(), api.getHeight()) / 2;

                var removeClipPath = zrUtil.bind(group.removeClipPath, group);
                group.setClipPath(this._createClipPath(
                    shape.cx, shape.cy, r, shape.startAngle, shape.clockwise, removeClipPath, seriesModel
                ));
            }

            this._data = data;
        },

        dispose: function () {},

        _createClipPath: function (
            cx, cy, r, startAngle, clockwise, cb, seriesModel
        ) {
            var clipPath = new graphic.Sector({
                shape: {
                    cx: cx,
                    cy: cy,
                    r0: 0,
                    r: r,
                    startAngle: startAngle,
                    endAngle: startAngle,
                    clockwise: clockwise
                }
            });

            graphic.initProps(clipPath, {
                shape: {
                    endAngle: startAngle + (clockwise ? 1 : -1) * Math.PI * 2
                }
            }, seriesModel, cb);

            return clipPath;
        },

        /**
         * @implement
         */
        containPoint: function (point, seriesModel) {
            var data = seriesModel.getData();
            var itemLayout = data.getItemLayout(0);
            if (itemLayout) {
                var dx = point[0] - itemLayout.cx;
                var dy = point[1] - itemLayout.cy;
                var radius = Math.sqrt(dx * dx + dy * dy);
                return radius <= itemLayout.r && radius >= itemLayout.r0;
            }
        }

    });

    module.exports = Pie;


/***/ }),

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// FIXME emphasis label position is not same with normal label position


    var textContain = __webpack_require__(81);

    function adjustSingleSide(list, cx, cy, r, dir, viewWidth, viewHeight) {
        list.sort(function (a, b) {
            return a.y - b.y;
        });

        // 压
        function shiftDown(start, end, delta, dir) {
            for (var j = start; j < end; j++) {
                list[j].y += delta;
                if (j > start
                    && j + 1 < end
                    && list[j + 1].y > list[j].y + list[j].height
                ) {
                    shiftUp(j, delta / 2);
                    return;
                }
            }

            shiftUp(end - 1, delta / 2);
        }

        // 弹
        function shiftUp(end, delta) {
            for (var j = end; j >= 0; j--) {
                list[j].y -= delta;
                if (j > 0
                    && list[j].y > list[j - 1].y + list[j - 1].height
                ) {
                    break;
                }
            }
        }

        function changeX(list, isDownList, cx, cy, r, dir) {
            var lastDeltaX = dir > 0
                ? isDownList                // 右侧
                    ? Number.MAX_VALUE      // 下
                    : 0                     // 上
                : isDownList                // 左侧
                    ? Number.MAX_VALUE      // 下
                    : 0;                    // 上

            for (var i = 0, l = list.length; i < l; i++) {
                // Not change x for center label
                if (list[i].position === 'center') {
                    continue;
                }
                var deltaY = Math.abs(list[i].y - cy);
                var length = list[i].len;
                var length2 = list[i].len2;
                var deltaX = (deltaY < r + length)
                    ? Math.sqrt(
                          (r + length + length2) * (r + length + length2)
                          - deltaY * deltaY
                      )
                    : Math.abs(list[i].x - cx);
                if (isDownList && deltaX >= lastDeltaX) {
                    // 右下，左下
                    deltaX = lastDeltaX - 10;
                }
                if (!isDownList && deltaX <= lastDeltaX) {
                    // 右上，左上
                    deltaX = lastDeltaX + 10;
                }

                list[i].x = cx + deltaX * dir;
                lastDeltaX = deltaX;
            }
        }

        var lastY = 0;
        var delta;
        var len = list.length;
        var upList = [];
        var downList = [];
        for (var i = 0; i < len; i++) {
            delta = list[i].y - lastY;
            if (delta < 0) {
                shiftDown(i, len, -delta, dir);
            }
            lastY = list[i].y + list[i].height;
        }
        if (viewHeight - lastY < 0) {
            shiftUp(len - 1, lastY - viewHeight);
        }
        for (var i = 0; i < len; i++) {
            if (list[i].y >= cy) {
                downList.push(list[i]);
            }
            else {
                upList.push(list[i]);
            }
        }
        changeX(upList, false, cx, cy, r, dir);
        changeX(downList, true, cx, cy, r, dir);
    }

    function avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight) {
        var leftList = [];
        var rightList = [];
        for (var i = 0; i < labelLayoutList.length; i++) {
            if (labelLayoutList[i].x < cx) {
                leftList.push(labelLayoutList[i]);
            }
            else {
                rightList.push(labelLayoutList[i]);
            }
        }

        adjustSingleSide(rightList, cx, cy, r, 1, viewWidth, viewHeight);
        adjustSingleSide(leftList, cx, cy, r, -1, viewWidth, viewHeight);

        for (var i = 0; i < labelLayoutList.length; i++) {
            var linePoints = labelLayoutList[i].linePoints;
            if (linePoints) {
                var dist = linePoints[1][0] - linePoints[2][0];
                if (labelLayoutList[i].x < cx) {
                    linePoints[2][0] = labelLayoutList[i].x + 3;
                }
                else {
                    linePoints[2][0] = labelLayoutList[i].x - 3;
                }
                linePoints[1][1] = linePoints[2][1] = labelLayoutList[i].y;
                linePoints[1][0] = linePoints[2][0] + dist;
            }
        }
    }

    module.exports = function (seriesModel, r, viewWidth, viewHeight) {
        var data = seriesModel.getData();
        var labelLayoutList = [];
        var cx;
        var cy;
        var hasLabelRotate = false;

        data.each(function (idx) {
            var layout = data.getItemLayout(idx);

            var itemModel = data.getItemModel(idx);
            var labelModel = itemModel.getModel('label.normal');
            // Use position in normal or emphasis
            var labelPosition = labelModel.get('position') || itemModel.get('label.emphasis.position');

            var labelLineModel = itemModel.getModel('labelLine.normal');
            var labelLineLen = labelLineModel.get('length');
            var labelLineLen2 = labelLineModel.get('length2');

            var midAngle = (layout.startAngle + layout.endAngle) / 2;
            var dx = Math.cos(midAngle);
            var dy = Math.sin(midAngle);

            var textX;
            var textY;
            var linePoints;
            var textAlign;

            cx = layout.cx;
            cy = layout.cy;

            var isLabelInside = labelPosition === 'inside' || labelPosition === 'inner';
            if (labelPosition === 'center') {
                textX = layout.cx;
                textY = layout.cy;
                textAlign = 'center';
            }
            else {
                var x1 = (isLabelInside ? (layout.r + layout.r0) / 2 * dx : layout.r * dx) + cx;
                var y1 = (isLabelInside ? (layout.r + layout.r0) / 2 * dy : layout.r * dy) + cy;

                textX = x1 + dx * 3;
                textY = y1 + dy * 3;

                if (!isLabelInside) {
                    // For roseType
                    var x2 = x1 + dx * (labelLineLen + r - layout.r);
                    var y2 = y1 + dy * (labelLineLen + r - layout.r);
                    var x3 = x2 + ((dx < 0 ? -1 : 1) * labelLineLen2);
                    var y3 = y2;

                    textX = x3 + (dx < 0 ? -5 : 5);
                    textY = y3;
                    linePoints = [[x1, y1], [x2, y2], [x3, y3]];
                }

                textAlign = isLabelInside ? 'center' : (dx > 0 ? 'left' : 'right');
            }
            var font = labelModel.getFont();

            var labelRotate = labelModel.get('rotate')
                ? (dx < 0 ? -midAngle + Math.PI : -midAngle) : 0;
            var text = seriesModel.getFormattedLabel(idx, 'normal')
                        || data.getName(idx);
            var textRect = textContain.getBoundingRect(
                text, font, textAlign, 'top'
            );
            hasLabelRotate = !!labelRotate;
            layout.label = {
                x: textX,
                y: textY,
                position: labelPosition,
                height: textRect.height,
                len: labelLineLen,
                len2: labelLineLen2,
                linePoints: linePoints,
                textAlign: textAlign,
                verticalAlign: 'middle',
                rotation: labelRotate,
                inside: isLabelInside
            };

            // Not layout the inside label
            if (!isLabelInside) {
                labelLayoutList.push(layout.label);
            }
        });
        if (!hasLabelRotate && seriesModel.get('avoidLabelOverlap')) {
            avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight);
        }
    };


/***/ }),

/***/ 146:
/***/ (function(module, exports, __webpack_require__) {



    var numberUtil = __webpack_require__(24);
    var parsePercent = numberUtil.parsePercent;
    var labelLayout = __webpack_require__(145);
    var zrUtil = __webpack_require__(2);

    var PI2 = Math.PI * 2;
    var RADIAN = Math.PI / 180;

    module.exports = function (seriesType, ecModel, api, payload) {
        ecModel.eachSeriesByType(seriesType, function (seriesModel) {
            var center = seriesModel.get('center');
            var radius = seriesModel.get('radius');

            if (!zrUtil.isArray(radius)) {
                radius = [0, radius];
            }
            if (!zrUtil.isArray(center)) {
                center = [center, center];
            }

            var width = api.getWidth();
            var height = api.getHeight();
            var size = Math.min(width, height);
            var cx = parsePercent(center[0], width);
            var cy = parsePercent(center[1], height);
            var r0 = parsePercent(radius[0], size / 2);
            var r = parsePercent(radius[1], size / 2);

            var data = seriesModel.getData();

            var startAngle = -seriesModel.get('startAngle') * RADIAN;

            var minAngle = seriesModel.get('minAngle') * RADIAN;

            var validDataCount = 0;
            data.each('value', function (value) {
                !isNaN(value) && validDataCount++;
            });

            var sum = data.getSum('value');
            // Sum may be 0
            var unitRadian = Math.PI / (sum || validDataCount) * 2;

            var clockwise = seriesModel.get('clockwise');

            var roseType = seriesModel.get('roseType');
            var stillShowZeroSum = seriesModel.get('stillShowZeroSum');

            // [0...max]
            var extent = data.getDataExtent('value');
            extent[0] = 0;

            // In the case some sector angle is smaller than minAngle
            var restAngle = PI2;
            var valueSumLargerThanMinAngle = 0;

            var currentAngle = startAngle;
            var dir = clockwise ? 1 : -1;

            data.each('value', function (value, idx) {
                var angle;
                if (isNaN(value)) {
                    data.setItemLayout(idx, {
                        angle: NaN,
                        startAngle: NaN,
                        endAngle: NaN,
                        clockwise: clockwise,
                        cx: cx,
                        cy: cy,
                        r0: r0,
                        r: roseType
                            ? NaN
                            : r
                    });
                    return;
                }

                // FIXME 兼容 2.0 但是 roseType 是 area 的时候才是这样？
                if (roseType !== 'area') {
                    angle = (sum === 0 && stillShowZeroSum)
                        ? unitRadian : (value * unitRadian);
                }
                else {
                    angle = PI2 / validDataCount;
                }

                if (angle < minAngle) {
                    angle = minAngle;
                    restAngle -= minAngle;
                }
                else {
                    valueSumLargerThanMinAngle += value;
                }

                var endAngle = currentAngle + dir * angle;
                data.setItemLayout(idx, {
                    angle: angle,
                    startAngle: currentAngle,
                    endAngle: endAngle,
                    clockwise: clockwise,
                    cx: cx,
                    cy: cy,
                    r0: r0,
                    r: roseType
                        ? numberUtil.linearMap(value, extent, [r0, r])
                        : r
                });

                currentAngle = endAngle;
            }, true);

            // Some sector is constrained by minAngle
            // Rest sectors needs recalculate angle
            if (restAngle < PI2 && validDataCount) {
                // Average the angle if rest angle is not enough after all angles is
                // Constrained by minAngle
                if (restAngle <= 1e-3) {
                    var angle = PI2 / validDataCount;
                    data.each('value', function (value, idx) {
                        if (!isNaN(value)) {
                            var layout = data.getItemLayout(idx);
                            layout.angle = angle;
                            layout.startAngle = startAngle + dir * idx * angle;
                            layout.endAngle = startAngle + dir * (idx + 1) * angle;
                        }
                    });
                }
                else {
                    unitRadian = restAngle / valueSumLargerThanMinAngle;
                    currentAngle = startAngle;
                    data.each('value', function (value, idx) {
                        if (!isNaN(value)) {
                            var layout = data.getItemLayout(idx);
                            var angle = layout.angle === minAngle
                                ? minAngle : value * unitRadian;
                            layout.startAngle = currentAngle;
                            layout.endAngle = currentAngle + dir * angle;
                            currentAngle += dir * angle;
                        }
                    });
                }
            }

            labelLayout(seriesModel, r, width, height);
        });
    };


/***/ }),

/***/ 148:
/***/ (function(module, exports) {


    module.exports = function (seriesType, ecModel) {
        var legendModels = ecModel.findComponents({
            mainType: 'legend'
        });
        if (!legendModels || !legendModels.length) {
            return;
        }
        ecModel.eachSeriesByType(seriesType, function (series) {
            var data = series.getData();
            data.filterSelf(function (idx) {
                var name = data.getName(idx);
                // If in any legend component the status is not selected.
                for (var i = 0; i < legendModels.length; i++) {
                    if (!legendModels[i].isSelected(name)) {
                        return false;
                    }
                }
                return true;
            }, this);
        }, this);
    };


/***/ }),

/***/ 151:
/***/ (function(module, exports) {

// Pick color from palette for each data item.
// Applicable for charts that require applying color palette
// in data level (like pie, funnel, chord).


    module.exports = function (seriesType, ecModel) {
        // Pie and funnel may use diferrent scope
        var paletteScope = {};
        ecModel.eachRawSeriesByType(seriesType, function (seriesModel) {
            var dataAll = seriesModel.getRawData();
            var idxMap = {};
            if (!ecModel.isSeriesFiltered(seriesModel)) {
                var data = seriesModel.getData();
                data.each(function (idx) {
                    var rawIdx = data.getRawIndex(idx);
                    idxMap[rawIdx] = idx;
                });
                dataAll.each(function (rawIdx) {
                    var filteredIdx = idxMap[rawIdx];

                    // If series.itemStyle.normal.color is a function. itemVisual may be encoded
                    var singleDataColor = filteredIdx != null
                        && data.getItemVisual(filteredIdx, 'color', true);

                    if (!singleDataColor) {
                        // FIXME Performance
                        var itemModel = dataAll.getItemModel(rawIdx);
                        var color = itemModel.get('itemStyle.normal.color')
                            || seriesModel.getColorFromPalette(dataAll.getName(rawIdx), paletteScope);
                        // Legend may use the visual info in data before processed
                        dataAll.setItemVisual(rawIdx, 'color', color);

                        // Data is not filtered
                        if (filteredIdx != null) {
                            data.setItemVisual(filteredIdx, 'color', color);
                        }
                    }
                    else {
                        // Set data all color for legend
                        dataAll.setItemVisual(rawIdx, 'color', singleDataColor);
                    }
                });
            }
        });
    };


/***/ }),

/***/ 562:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var spssUtils_1 = __webpack_require__(87);
var echarts = __webpack_require__(10);
// import 'echarts/lib/chart/bar';
__webpack_require__(131);
__webpack_require__(142);
__webpack_require__(122);
__webpack_require__(119);
__webpack_require__(133);
__webpack_require__(120);
__webpack_require__(946);
var StatisticsSatisfactionIndex;
(function (StatisticsSatisfactionIndex) {
    var pieChart;
    var lineChart;
    var datePicker;
    $(function () {
        init();
    });
    function init() {
        spssUtils_1.initTip([{
                el: $('#num-tip'),
                content: "\n\t\t\t\u7EDF\u8BA1\u88AB\u7528\u6237\u8BC4\u4EF7\u4E3A\u975E\u5E38\u6EE1\u610F\u3001\u6EE1\u610F\u3001\u4E00\u822C\u3001\u4E0D\u6EE1\u610F\u548C\u975E\u5E38\u4E0D\u6EE1\u610F\u7684\u4F1A\u8BDD\u6B21\u6570\u5360\u6BD4\n\t\t\t"
            }, {
                el: $('#percent-tip'),
                content: "\n\t\t\t\u7EDF\u8BA1\u4EBA\u5DE5\u5BA2\u670D\u548C\u667A\u80FD\u5BA2\u670D\u7684\u6EE1\u610F\u7387\n\t\t\t"
            }]);
        initDatePicker();
        initCharts();
    }
    function initDatePicker() {
        var el = $('.spss-time-container .date-range-picker');
        datePicker = new spssUtils_1.SpssBtnDate({
            el: el,
            onClick: function (mode, date) {
                drawPieChart();
                drawLineChart();
            }
        });
    }
    function initCharts() {
        pieChart = echarts.init(document.getElementById('pie-chart'));
        drawPieChart();
        lineChart = echarts.init(document.getElementById('line-chart'));
        drawLineChart();
    }
    function drawPieChart() {
        getPieChartData(function (data) {
            pieChart.setOption(getPieOp(data));
        });
    }
    function drawLineChart() {
        getLineChartData(function (data) {
            lineChart.setOption(getLineOp(data));
        });
    }
    function getPieChartData(cb) {
        $.ajax({
            url: 'spss/satisfactionAnalysis//statSatisfaction',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            cb(data);
        });
    }
    function getLineChartData(cb) {
        $.ajax({
            url: 'spss/satisfactionAnalysis/dataFilter',
            method: 'GET',
            data: {
                mode: datePicker.mode,
                startDay: datePicker.date.startDay,
                endDay: datePicker.date.endDay
            }
        }).done(function (data) {
            cb(data);
        });
    }
    function getPieOp(data) {
        return {
            color: ['#ffb000', '#37a6e7', '#4caf50', '#a9a9a9', '#c51f29'],
            series: {
                data: data,
                name: '满意度统计',
                type: 'pie',
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            toolbox: {
                right: 50,
                feature: {
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['非常满意', '满意', '一般', '不满意', '非常不满意']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }
        };
    }
    function getLineOp(data) {
        var series = data.yData.map(function (v) {
            return {
                name: v.name,
                type: 'line',
                data: v.data
            };
        });
        return {
            color: ['#ffb000', '#37a6e7', '#4caf50'],
            series: series,
            toolbox: {
                right: 50,
                feature: {
                    saveAsImage: {}
                }
            },
            tooltip: {
                formatter: spssUtils_1.formatter,
                trigger: 'axis'
            },
            legend: {
                data: ['人工客服', '智能客服']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.xData
            },
            yAxis: {
                axisLabel: spssUtils_1.axisLabel,
                type: 'value'
            }
        };
    }
})(StatisticsSatisfactionIndex || (StatisticsSatisfactionIndex = {}));


/***/ }),

/***/ 946:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1149]);
//# sourceMappingURL=6.js.map