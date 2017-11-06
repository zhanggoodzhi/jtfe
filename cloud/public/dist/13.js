webpackJsonp([13],{

/***/ 1145:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(558);


/***/ }),

/***/ 287:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 298:
/***/ (function(module, exports) {

module.exports = "/**\r\n * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)\r\n *\r\n * Apache License, Version 2.0:\r\n * Copyright (c) 2012 - 2015 David Stutz\r\n *\r\n * Licensed under the Apache License, Version 2.0 (the \"License\"); you may not\r\n * use this file except in compliance with the License. You may obtain a\r\n * copy of the License at http://www.apache.org/licenses/LICENSE-2.0\r\n *\r\n * Unless required by applicable law or agreed to in writing, software\r\n * distributed under the License is distributed on an \"AS IS\" BASIS, WITHOUT\r\n * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the\r\n * License for the specific language governing permissions and limitations\r\n * under the License.\r\n *\r\n * BSD 3-Clause License:\r\n * Copyright (c) 2012 - 2015 David Stutz\r\n * All rights reserved.\r\n *\r\n * Redistribution and use in source and binary forms, with or without\r\n * modification, are permitted provided that the following conditions are met:\r\n *    - Redistributions of source code must retain the above copyright notice,\r\n *      this list of conditions and the following disclaimer.\r\n *    - Redistributions in binary form must reproduce the above copyright notice,\r\n *      this list of conditions and the following disclaimer in the documentation\r\n *      and/or other materials provided with the distribution.\r\n *    - Neither the name of David Stutz nor the names of its contributors may be\r\n *      used to endorse or promote products derived from this software without\r\n *      specific prior written permission.\r\n *\r\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\r\n * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,\r\n * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR\r\n * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR\r\n * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,\r\n * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,\r\n * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;\r\n * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,\r\n * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR\r\n * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF\r\n * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\r\n */\r\n!function ($) {\r\n    \"use strict\";// jshint ;_;\r\n\r\n    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {\r\n        ko.bindingHandlers.multiselect = {\r\n            after: ['options', 'value', 'selectedOptions', 'enable', 'disable'],\r\n\r\n            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {\r\n                var $element = $(element);\r\n                var config = ko.toJS(valueAccessor());\r\n\r\n                $element.multiselect(config);\r\n\r\n                if (allBindings.has('options')) {\r\n                    var options = allBindings.get('options');\r\n                    if (ko.isObservable(options)) {\r\n                        ko.computed({\r\n                            read: function() {\r\n                                options();\r\n                                setTimeout(function() {\r\n                                    var ms = $element.data('multiselect');\r\n                                    if (ms)\r\n                                        ms.updateOriginalOptions();//Not sure how beneficial this is.\r\n                                    $element.multiselect('rebuild');\r\n                                }, 1);\r\n                            },\r\n                            disposeWhenNodeIsRemoved: element\r\n                        });\r\n                    }\r\n                }\r\n\r\n                //value and selectedOptions are two-way, so these will be triggered even by our own actions.\r\n                //It needs some way to tell if they are triggered because of us or because of outside change.\r\n                //It doesn't loop but it's a waste of processing.\r\n                if (allBindings.has('value')) {\r\n                    var value = allBindings.get('value');\r\n                    if (ko.isObservable(value)) {\r\n                        ko.computed({\r\n                            read: function() {\r\n                                value();\r\n                                setTimeout(function() {\r\n                                    $element.multiselect('refresh');\r\n                                }, 1);\r\n                            },\r\n                            disposeWhenNodeIsRemoved: element\r\n                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });\r\n                    }\r\n                }\r\n\r\n                //Switched from arrayChange subscription to general subscription using 'refresh'.\r\n                //Not sure performance is any better using 'select' and 'deselect'.\r\n                if (allBindings.has('selectedOptions')) {\r\n                    var selectedOptions = allBindings.get('selectedOptions');\r\n                    if (ko.isObservable(selectedOptions)) {\r\n                        ko.computed({\r\n                            read: function() {\r\n                                selectedOptions();\r\n                                setTimeout(function() {\r\n                                    $element.multiselect('refresh');\r\n                                }, 1);\r\n                            },\r\n                            disposeWhenNodeIsRemoved: element\r\n                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });\r\n                    }\r\n                }\r\n\r\n                var setEnabled = function (enable) {\r\n                    setTimeout(function () {\r\n                        if (enable)\r\n                            $element.multiselect('enable');\r\n                        else\r\n                            $element.multiselect('disable');\r\n                    });\r\n                };\r\n\r\n                if (allBindings.has('enable')) {\r\n                    var enable = allBindings.get('enable');\r\n                    if (ko.isObservable(enable)) {\r\n                        ko.computed({\r\n                            read: function () {\r\n                                setEnabled(enable());\r\n                            },\r\n                            disposeWhenNodeIsRemoved: element\r\n                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });\r\n                    } else {\r\n                        setEnabled(enable);\r\n                    }\r\n                }\r\n\r\n                if (allBindings.has('disable')) {\r\n                    var disable = allBindings.get('disable');\r\n                    if (ko.isObservable(disable)) {\r\n                        ko.computed({\r\n                            read: function () {\r\n                                setEnabled(!disable());\r\n                            },\r\n                            disposeWhenNodeIsRemoved: element\r\n                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });\r\n                    } else {\r\n                        setEnabled(!disable);\r\n                    }\r\n                }\r\n\r\n                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {\r\n                    $element.multiselect('destroy');\r\n                });\r\n            },\r\n\r\n            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {\r\n                var $element = $(element);\r\n                var config = ko.toJS(valueAccessor());\r\n\r\n                $element.multiselect('setOptions', config);\r\n                $element.multiselect('rebuild');\r\n            }\r\n        };\r\n    }\r\n\r\n    function forEach(array, callback) {\r\n        for (var index = 0; index < array.length; ++index) {\r\n            callback(array[index], index);\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Constructor to create a new multiselect using the given select.\r\n     *\r\n     * @param {jQuery} select\r\n     * @param {Object} options\r\n     * @returns {Multiselect}\r\n     */\r\n    function Multiselect(select, options) {\r\n\r\n        this.$select = $(select);\r\n\r\n        // Placeholder via data attributes\r\n        if (this.$select.attr(\"data-placeholder\")) {\r\n            options.nonSelectedText = this.$select.data(\"placeholder\");\r\n        }\r\n\r\n        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));\r\n\r\n        // Initialization.\r\n        // We have to clone to create a new reference.\r\n        this.originalOptions = this.$select.clone()[0].options;\r\n        this.query = '';\r\n        this.searchTimeout = null;\r\n        this.lastToggledInput = null;\r\n\r\n        this.options.multiple = this.$select.attr('multiple') === \"multiple\";\r\n        this.options.onChange = $.proxy(this.options.onChange, this);\r\n        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);\r\n        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);\r\n        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);\r\n        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);\r\n        this.options.onInitialized = $.proxy(this.options.onInitialized, this);\r\n\r\n        // Build select all if enabled.\r\n        this.buildContainer();\r\n        this.buildButton();\r\n        this.buildDropdown();\r\n        this.buildSelectAll();\r\n        this.buildDropdownOptions();\r\n        this.buildFilter();\r\n\r\n        this.updateButtonText();\r\n        this.updateSelectAll(true);\r\n\r\n        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {\r\n            this.disable();\r\n        }\r\n\r\n        this.$select.hide().after(this.$container);\r\n        this.options.onInitialized(this.$select, this.$container);\r\n    }\r\n\r\n    Multiselect.prototype = {\r\n\r\n        defaults: {\r\n            /**\r\n             * Default text function will either print 'None selected' in case no\r\n             * option is selected or a list of the selected options up to a length\r\n             * of 3 selected options.\r\n             *\r\n             * @param {jQuery} options\r\n             * @param {jQuery} select\r\n             * @returns {String}\r\n             */\r\n            buttonText: function(options, select) {\r\n                if (this.disabledText.length > 0\r\n                        && (this.disableIfEmpty || select.prop('disabled'))\r\n                        && options.length == 0) {\r\n\r\n                    return this.disabledText;\r\n                }\r\n                else if (options.length === 0) {\r\n                    return this.nonSelectedText;\r\n                }\r\n                else if (this.allSelectedText\r\n                        && options.length === $('option', $(select)).length\r\n                        && $('option', $(select)).length !== 1\r\n                        && this.multiple) {\r\n\r\n                    if (this.selectAllNumber) {\r\n                        return this.allSelectedText + ' (' + options.length + ')';\r\n                    }\r\n                    else {\r\n                        return this.allSelectedText;\r\n                    }\r\n                }\r\n                else if (options.length > this.numberDisplayed) {\r\n                    return options.length + ' ' + this.nSelectedText;\r\n                }\r\n                else {\r\n                    var selected = '';\r\n                    var delimiter = this.delimiterText;\r\n\r\n                    options.each(function() {\r\n                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();\r\n                        selected += label + delimiter;\r\n                    });\r\n\r\n                    return selected.substr(0, selected.length - 2);\r\n                }\r\n            },\r\n            /**\r\n             * Updates the title of the button similar to the buttonText function.\r\n             *\r\n             * @param {jQuery} options\r\n             * @param {jQuery} select\r\n             * @returns {@exp;selected@call;substr}\r\n             */\r\n            buttonTitle: function(options, select) {\r\n                if (options.length === 0) {\r\n                    return this.nonSelectedText;\r\n                }\r\n                else {\r\n                    var selected = '';\r\n                    var delimiter = this.delimiterText;\r\n\r\n                    options.each(function () {\r\n                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();\r\n                        selected += label + delimiter;\r\n                    });\r\n                    return selected.substr(0, selected.length - 2);\r\n                }\r\n            },\r\n            /**\r\n             * Create a label.\r\n             *\r\n             * @param {jQuery} element\r\n             * @returns {String}\r\n             */\r\n            optionLabel: function(element){\r\n                return $(element).attr('label') || $(element).text();\r\n            },\r\n            /**\r\n             * Create a class.\r\n             *\r\n             * @param {jQuery} element\r\n             * @returns {String}\r\n             */\r\n            optionClass: function(element) {\r\n                return $(element).attr('class') || '';\r\n            },\r\n            /**\r\n             * Triggered on change of the multiselect.\r\n             *\r\n             * Not triggered when selecting/deselecting options manually.\r\n             *\r\n             * @param {jQuery} option\r\n             * @param {Boolean} checked\r\n             */\r\n            onChange : function(option, checked) {\r\n\r\n            },\r\n            /**\r\n             * Triggered when the dropdown is shown.\r\n             *\r\n             * @param {jQuery} event\r\n             */\r\n            onDropdownShow: function(event) {\r\n\r\n            },\r\n            /**\r\n             * Triggered when the dropdown is hidden.\r\n             *\r\n             * @param {jQuery} event\r\n             */\r\n            onDropdownHide: function(event) {\r\n\r\n            },\r\n            /**\r\n             * Triggered after the dropdown is shown.\r\n             *\r\n             * @param {jQuery} event\r\n             */\r\n            onDropdownShown: function(event) {\r\n\r\n            },\r\n            /**\r\n             * Triggered after the dropdown is hidden.\r\n             *\r\n             * @param {jQuery} event\r\n             */\r\n            onDropdownHidden: function(event) {\r\n\r\n            },\r\n            /**\r\n             * Triggered on select all.\r\n             */\r\n            onSelectAll: function(checked) {\r\n\r\n            },\r\n            /**\r\n             * Triggered after initializing.\r\n             *\r\n             * @param {jQuery} $select\r\n             * @param {jQuery} $container\r\n             */\r\n            onInitialized: function($select, $container) {\r\n\r\n            },\r\n            enableHTML: false,\r\n            buttonClass: 'btn btn-default',\r\n            inheritClass: false,\r\n            buttonWidth: 'auto',\r\n            buttonContainer: '<div class=\"btn-group\" />',\r\n            dropRight: false,\r\n            dropUp: false,\r\n            selectedClass: 'active',\r\n            // Maximum height of the dropdown menu.\r\n            // If maximum height is exceeded a scrollbar will be displayed.\r\n            maxHeight: false,\r\n            checkboxName: false,\r\n            includeSelectAllOption: false,\r\n            includeSelectAllIfMoreThan: 0,\r\n            selectAllText: ' Select all',\r\n            selectAllValue: 'multiselect-all',\r\n            selectAllName: false,\r\n            selectAllNumber: true,\r\n            selectAllJustVisible: true,\r\n            enableFiltering: false,\r\n            enableCaseInsensitiveFiltering: false,\r\n            enableFullValueFiltering: false,\r\n            enableClickableOptGroups: false,\r\n            enableCollapsibelOptGroups: false,\r\n            filterPlaceholder: 'Search',\r\n            // possible options: 'text', 'value', 'both'\r\n            filterBehavior: 'text',\r\n            includeFilterClearBtn: true,\r\n            preventInputChangeEvent: false,\r\n            nonSelectedText: 'None selected',\r\n            nSelectedText: 'selected',\r\n            allSelectedText: 'All selected',\r\n            numberDisplayed: 3,\r\n            disableIfEmpty: false,\r\n            disabledText: '',\r\n            delimiterText: ', ',\r\n            templates: {\r\n                button: '<button type=\"button\" class=\"multiselect dropdown-toggle\" data-toggle=\"dropdown\"><span class=\"multiselect-selected-text\"></span> <b class=\"caret\"></b></button>',\r\n                ul: '<ul class=\"multiselect-container dropdown-menu\"></ul>',\r\n                filter: '<li class=\"multiselect-item filter\"><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-search\"></i></span><input class=\"form-control multiselect-search\" type=\"text\"></div></li>',\r\n                filterClearBtn: '<span class=\"input-group-btn\"><button class=\"btn btn-default multiselect-clear-filter\" type=\"button\"><i class=\"glyphicon glyphicon-remove-circle\"></i></button></span>',\r\n                li: '<li><a tabindex=\"0\"><label></label></a></li>',\r\n                divider: '<li class=\"multiselect-item divider\"></li>',\r\n                liGroup: '<li class=\"multiselect-item multiselect-group\"><label></label></li>'\r\n            }\r\n        },\r\n\r\n        constructor: Multiselect,\r\n\r\n        /**\r\n         * Builds the container of the multiselect.\r\n         */\r\n        buildContainer: function() {\r\n            this.$container = $(this.options.buttonContainer);\r\n            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);\r\n            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);\r\n            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);\r\n            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);\r\n        },\r\n\r\n        /**\r\n         * Builds the button of the multiselect.\r\n         */\r\n        buildButton: function() {\r\n            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);\r\n            if (this.$select.attr('class') && this.options.inheritClass) {\r\n                this.$button.addClass(this.$select.attr('class'));\r\n            }\r\n            // Adopt active state.\r\n            if (this.$select.prop('disabled')) {\r\n                this.disable();\r\n            }\r\n            else {\r\n                this.enable();\r\n            }\r\n\r\n            // Manually add button width if set.\r\n            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {\r\n                this.$button.css({\r\n                    'width' : this.options.buttonWidth,\r\n                    'overflow' : 'hidden',\r\n                    'text-overflow' : 'ellipsis'\r\n                });\r\n                this.$container.css({\r\n                    'width': this.options.buttonWidth\r\n                });\r\n            }\r\n\r\n            // Keep the tab index from the select.\r\n            var tabindex = this.$select.attr('tabindex');\r\n            if (tabindex) {\r\n                this.$button.attr('tabindex', tabindex);\r\n            }\r\n\r\n            this.$container.prepend(this.$button);\r\n        },\r\n\r\n        /**\r\n         * Builds the ul representing the dropdown menu.\r\n         */\r\n        buildDropdown: function() {\r\n\r\n            // Build ul.\r\n            this.$ul = $(this.options.templates.ul);\r\n\r\n            if (this.options.dropRight) {\r\n                this.$ul.addClass('pull-right');\r\n            }\r\n\r\n            // Set max height of dropdown menu to activate auto scrollbar.\r\n            if (this.options.maxHeight) {\r\n                // TODO: Add a class for this option to move the css declarations.\r\n                this.$ul.css({\r\n                    'max-height': this.options.maxHeight + 'px',\r\n                    'overflow-y': 'auto',\r\n                    'overflow-x': 'hidden'\r\n                });\r\n            }\r\n\r\n            if (this.options.dropUp) {\r\n\r\n                var height = Math.min(this.options.maxHeight, $('option[data-role!=\"divider\"]', this.$select).length*26 + $('option[data-role=\"divider\"]', this.$select).length*19 + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0));\r\n                var moveCalc = height + 34;\r\n\r\n                this.$ul.css({\r\n                    'max-height': height + 'px',\r\n                    'overflow-y': 'auto',\r\n                    'overflow-x': 'hidden',\r\n                    'margin-top': \"-\" + moveCalc + 'px'\r\n                });\r\n            }\r\n\r\n            this.$container.append(this.$ul);\r\n        },\r\n\r\n        /**\r\n         * Build the dropdown options and binds all nessecary events.\r\n         *\r\n         * Uses createDivider and createOptionValue to create the necessary options.\r\n         */\r\n        buildDropdownOptions: function() {\r\n\r\n            this.$select.children().each($.proxy(function(index, element) {\r\n\r\n                var $element = $(element);\r\n                // Support optgroups and options without a group simultaneously.\r\n                var tag = $element.prop('tagName')\r\n                    .toLowerCase();\r\n\r\n                if ($element.prop('value') === this.options.selectAllValue) {\r\n                    return;\r\n                }\r\n\r\n                if (tag === 'optgroup') {\r\n                    this.createOptgroup(element);\r\n                }\r\n                else if (tag === 'option') {\r\n\r\n                    if ($element.data('role') === 'divider') {\r\n                        this.createDivider();\r\n                    }\r\n                    else {\r\n                        this.createOptionValue(element);\r\n                    }\r\n\r\n                }\r\n\r\n                // Other illegal tags will be ignored.\r\n            }, this));\r\n\r\n            // Bind the change event on the dropdown elements.\r\n            $('li input', this.$ul).on('change', $.proxy(function(event) {\r\n                var $target = $(event.target);\r\n\r\n                var checked = $target.prop('checked') || false;\r\n                var isSelectAllOption = $target.val() === this.options.selectAllValue;\r\n\r\n                // Apply or unapply the configured selected class.\r\n                if (this.options.selectedClass) {\r\n                    if (checked) {\r\n                        $target.closest('li')\r\n                            .addClass(this.options.selectedClass);\r\n                    }\r\n                    else {\r\n                        $target.closest('li')\r\n                            .removeClass(this.options.selectedClass);\r\n                    }\r\n                }\r\n\r\n                // Get the corresponding option.\r\n                var value = $target.val();\r\n                var $option = this.getOptionByValue(value);\r\n\r\n                var $optionsNotThis = $('option', this.$select).not($option);\r\n                var $checkboxesNotThis = $('input', this.$container).not($target);\r\n\r\n                if (isSelectAllOption) {\r\n                    if (checked) {\r\n                        this.selectAll(this.options.selectAllJustVisible);\r\n                    }\r\n                    else {\r\n                        this.deselectAll(this.options.selectAllJustVisible);\r\n                    }\r\n                }\r\n                else {\r\n                    if (checked) {\r\n                        $option.prop('selected', true);\r\n\r\n                        if (this.options.multiple) {\r\n                            // Simply select additional option.\r\n                            $option.prop('selected', true);\r\n                        }\r\n                        else {\r\n                            // Unselect all other options and corresponding checkboxes.\r\n                            if (this.options.selectedClass) {\r\n                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);\r\n                            }\r\n\r\n                            $($checkboxesNotThis).prop('checked', false);\r\n                            $optionsNotThis.prop('selected', false);\r\n\r\n                            // It's a single selection, so close.\r\n                            this.$button.click();\r\n                        }\r\n\r\n                        if (this.options.selectedClass === \"active\") {\r\n                            $optionsNotThis.closest(\"a\").css(\"outline\", \"\");\r\n                        }\r\n                    }\r\n                    else {\r\n                        // Unselect option.\r\n                        $option.prop('selected', false);\r\n                    }\r\n\r\n                    // To prevent select all from firing onChange: #575\r\n                    this.options.onChange($option, checked);\r\n                }\r\n\r\n                this.$select.change();\r\n\r\n                this.updateButtonText();\r\n                this.updateSelectAll();\r\n\r\n                if(this.options.preventInputChangeEvent) {\r\n                    return false;\r\n                }\r\n            }, this));\r\n\r\n            $('li a', this.$ul).on('mousedown', function(e) {\r\n                if (e.shiftKey) {\r\n                    // Prevent selecting text by Shift+click\r\n                    return false;\r\n                }\r\n            });\r\n\r\n            $('li a', this.$ul).on('touchstart click', $.proxy(function(event) {\r\n                event.stopPropagation();\r\n\r\n                var $target = $(event.target);\r\n\r\n                if (event.shiftKey && this.options.multiple) {\r\n                    if($target.is(\"label\")){ // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)\r\n                        event.preventDefault();\r\n                        $target = $target.find(\"input\");\r\n                        $target.prop(\"checked\", !$target.prop(\"checked\"));\r\n                    }\r\n                    var checked = $target.prop('checked') || false;\r\n\r\n                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range\r\n                        var from = $target.closest(\"li\").index();\r\n                        var to = this.lastToggledInput.closest(\"li\").index();\r\n\r\n                        if (from > to) { // Swap the indices\r\n                            var tmp = to;\r\n                            to = from;\r\n                            from = tmp;\r\n                        }\r\n\r\n                        // Make sure we grab all elements since slice excludes the last index\r\n                        ++to;\r\n\r\n                        // Change the checkboxes and underlying options\r\n                        var range = this.$ul.find(\"li\").slice(from, to).find(\"input\");\r\n\r\n                        range.prop('checked', checked);\r\n\r\n                        if (this.options.selectedClass) {\r\n                            range.closest('li')\r\n                                .toggleClass(this.options.selectedClass, checked);\r\n                        }\r\n\r\n                        for (var i = 0, j = range.length; i < j; i++) {\r\n                            var $checkbox = $(range[i]);\r\n\r\n                            var $option = this.getOptionByValue($checkbox.val());\r\n\r\n                            $option.prop('selected', checked);\r\n                        }\r\n                    }\r\n\r\n                    // Trigger the select \"change\" event\r\n                    $target.trigger(\"change\");\r\n                }\r\n\r\n                // Remembers last clicked option\r\n                if($target.is(\"input\") && !$target.closest(\"li\").is(\".multiselect-item\")){\r\n                    this.lastToggledInput = $target;\r\n                }\r\n\r\n                $target.blur();\r\n            }, this));\r\n\r\n            // Keyboard support.\r\n            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function(event) {\r\n                if ($('input[type=\"text\"]', this.$container).is(':focus')) {\r\n                    return;\r\n                }\r\n\r\n                if (event.keyCode === 9 && this.$container.hasClass('open')) {\r\n                    this.$button.click();\r\n                }\r\n                else {\r\n                    var $items = $(this.$container).find(\"li:not(.divider):not(.disabled) a\").filter(\":visible\");\r\n\r\n                    if (!$items.length) {\r\n                        return;\r\n                    }\r\n\r\n                    var index = $items.index($items.filter(':focus'));\r\n\r\n                    // Navigation up.\r\n                    if (event.keyCode === 38 && index > 0) {\r\n                        index--;\r\n                    }\r\n                    // Navigate down.\r\n                    else if (event.keyCode === 40 && index < $items.length - 1) {\r\n                        index++;\r\n                    }\r\n                    else if (!~index) {\r\n                        index = 0;\r\n                    }\r\n\r\n                    var $current = $items.eq(index);\r\n                    $current.focus();\r\n\r\n                    if (event.keyCode === 32 || event.keyCode === 13) {\r\n                        var $checkbox = $current.find('input');\r\n\r\n                        $checkbox.prop(\"checked\", !$checkbox.prop(\"checked\"));\r\n                        $checkbox.change();\r\n                    }\r\n\r\n                    event.stopPropagation();\r\n                    event.preventDefault();\r\n                }\r\n            }, this));\r\n\r\n            if(this.options.enableClickableOptGroups && this.options.multiple) {\r\n                $('li.multiselect-group', this.$ul).on('click', $.proxy(function(event) {\r\n                    event.stopPropagation();\r\n                    console.log('test');\r\n                    var group = $(event.target).parent();\r\n\r\n                    // Search all option in optgroup\r\n                    var $options = group.nextUntil('li.multiselect-group');\r\n                    var $visibleOptions = $options.filter(\":visible:not(.disabled)\");\r\n\r\n                    // check or uncheck items\r\n                    var allChecked = true;\r\n                    var optionInputs = $visibleOptions.find('input');\r\n                    var values = [];\r\n\r\n                    optionInputs.each(function() {\r\n                        allChecked = allChecked && $(this).prop('checked');\r\n                        values.push($(this).val());\r\n                    });\r\n\r\n                    if (!allChecked) {\r\n                        this.select(values, false);\r\n                    }\r\n                    else {\r\n                        this.deselect(values, false);\r\n                    }\r\n\r\n                    this.options.onChange(optionInputs, !allChecked);\r\n               }, this));\r\n            }\r\n\r\n            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {\r\n                $(\"li.multiselect-group input\", this.$ul).off();\r\n                $(\"li.multiselect-group\", this.$ul).siblings().not(\"li.multiselect-group, li.multiselect-all\", this.$ul).each( function () {\r\n                    $(this).toggleClass('hidden', true);\r\n                });\r\n\r\n                $(\"li.multiselect-group\", this.$ul).on(\"click\", $.proxy(function(group) {\r\n                    group.stopPropagation();\r\n                }, this));\r\n\r\n                $(\"li.multiselect-group > a > b\", this.$ul).on(\"click\", $.proxy(function(t) {\r\n                    t.stopPropagation();\r\n                    var n = $(t.target).closest('li');\r\n                    var r = n.nextUntil(\"li.multiselect-group\");\r\n                    var i = true;\r\n\r\n                    r.each(function() {\r\n                        i = i && $(this).hasClass('hidden');\r\n                    });\r\n\r\n                    r.toggleClass('hidden', !i);\r\n                }, this));\r\n\r\n                $(\"li.multiselect-group > a > input\", this.$ul).on(\"change\", $.proxy(function(t) {\r\n                    t.stopPropagation();\r\n                    var n = $(t.target).closest('li');\r\n                    var r = n.nextUntil(\"li.multiselect-group\", ':not(.disabled)');\r\n                    var s = r.find(\"input\");\r\n\r\n                    var i = true;\r\n                    s.each(function() {\r\n                        i = i && $(this).prop(\"checked\");\r\n                    });\r\n\r\n                    s.prop(\"checked\", !i).trigger(\"change\");\r\n                }, this));\r\n\r\n                // Set the initial selection state of the groups.\r\n                $('li.multiselect-group', this.$ul).each(function() {\r\n                    var r = $(this).nextUntil(\"li.multiselect-group\", ':not(.disabled)');\r\n                    var s = r.find(\"input\");\r\n\r\n                    var i = true;\r\n                    s.each(function() {\r\n                        i = i && $(this).prop(\"checked\");\r\n                    });\r\n\r\n                    $(this).find('input').prop(\"checked\", i);\r\n                });\r\n\r\n                // Update the group checkbox based on new selections among the\r\n                // corresponding children.\r\n                $(\"li input\", this.$ul).on(\"change\", $.proxy(function(t) {\r\n                    t.stopPropagation();\r\n                    var n = $(t.target).closest('li');\r\n                    var r1 = n.prevUntil(\"li.multiselect-group\", ':not(.disabled)');\r\n                    var r2 = n.nextUntil(\"li.multiselect-group\", ':not(.disabled)');\r\n                    var s1 = r1.find(\"input\");\r\n                    var s2 = r2.find(\"input\");\r\n\r\n                    var i = $(t.target).prop('checked');\r\n                    s1.each(function() {\r\n                        i = i && $(this).prop(\"checked\");\r\n                    });\r\n\r\n                    s2.each(function() {\r\n                        i = i && $(this).prop(\"checked\");\r\n                    });\r\n\r\n                    n.prevAll('.multiselect-group').find('input').prop('checked', i);\r\n                }, this));\r\n\r\n                $(\"li.multiselect-all\", this.$ul).css('background', '#f3f3f3').css('border-bottom', '1px solid #eaeaea');\r\n                $(\"li.multiselect-group > a, li.multiselect-all > a > label.checkbox\", this.$ul).css('padding', '3px 20px 3px 35px');\r\n                $(\"li.multiselect-group > a > input\", this.$ul).css('margin', '4px 0px 5px -20px');\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Create an option using the given select option.\r\n         *\r\n         * @param {jQuery} element\r\n         */\r\n        createOptionValue: function(element) {\r\n            var $element = $(element);\r\n            if ($element.is(':selected')) {\r\n                $element.prop('selected', true);\r\n            }\r\n\r\n            // Support the label attribute on options.\r\n            var label = this.options.optionLabel(element);\r\n            var classes = this.options.optionClass(element);\r\n            var value = $element.val();\r\n            var inputType = this.options.multiple ? \"checkbox\" : \"radio\";\r\n\r\n            var $li = $(this.options.templates.li);\r\n            var $label = $('label', $li);\r\n            $label.addClass(inputType);\r\n            $li.addClass(classes);\r\n\r\n            if (this.options.enableHTML) {\r\n                $label.html(\" \" + label);\r\n            }\r\n            else {\r\n                $label.text(\" \" + label);\r\n            }\r\n\r\n            var $checkbox = $('<input/>').attr('type', inputType);\r\n\r\n            if (this.options.checkboxName) {\r\n                $checkbox.attr('name', this.options.checkboxName);\r\n            }\r\n            $label.prepend($checkbox);\r\n\r\n            var selected = $element.prop('selected') || false;\r\n            $checkbox.val(value);\r\n\r\n            if (value === this.options.selectAllValue) {\r\n                $li.addClass(\"multiselect-item multiselect-all\");\r\n                $checkbox.parent().parent()\r\n                    .addClass('multiselect-all');\r\n            }\r\n\r\n            $label.attr('title', $element.attr('title'));\r\n\r\n            this.$ul.append($li);\r\n\r\n            if ($element.is(':disabled')) {\r\n                $checkbox.attr('disabled', 'disabled')\r\n                    .prop('disabled', true)\r\n                    .closest('a')\r\n                    .attr(\"tabindex\", \"-1\")\r\n                    .closest('li')\r\n                    .addClass('disabled');\r\n            }\r\n\r\n            $checkbox.prop('checked', selected);\r\n\r\n            if (selected && this.options.selectedClass) {\r\n                $checkbox.closest('li')\r\n                    .addClass(this.options.selectedClass);\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Creates a divider using the given select option.\r\n         *\r\n         * @param {jQuery} element\r\n         */\r\n        createDivider: function(element) {\r\n            var $divider = $(this.options.templates.divider);\r\n            this.$ul.append($divider);\r\n        },\r\n\r\n        /**\r\n         * Creates an optgroup.\r\n         *\r\n         * @param {jQuery} group\r\n         */\r\n        createOptgroup: function(group) {\r\n            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {\r\n                var label = $(group).attr(\"label\");\r\n                var value = $(group).attr(\"value\");\r\n                var r = $('<li class=\"multiselect-item multiselect-group\"><a href=\"javascript:void(0);\"><input type=\"checkbox\" value=\"' + value + '\"/><b> ' + label + '<b class=\"caret\"></b></b></a></li>');\r\n\r\n                if (this.options.enableClickableOptGroups) {\r\n                    r.addClass(\"multiselect-group-clickable\")\r\n                }\r\n                this.$ul.append(r);\r\n                if ($(group).is(\":disabled\")) {\r\n                    r.addClass(\"disabled\")\r\n                }\r\n                $(\"option\", group).each($.proxy(function($, group) {\r\n                    this.createOptionValue(group)\r\n                }, this))\r\n            }\r\n            else {\r\n                var groupName = $(group).prop('label');\r\n\r\n                // Add a header for the group.\r\n                var $li = $(this.options.templates.liGroup);\r\n\r\n                if (this.options.enableHTML) {\r\n                    $('label', $li).html(groupName);\r\n                }\r\n                else {\r\n                    $('label', $li).text(groupName);\r\n                }\r\n\r\n                if (this.options.enableClickableOptGroups) {\r\n                    $li.addClass('multiselect-group-clickable');\r\n                }\r\n\r\n                this.$ul.append($li);\r\n\r\n                if ($(group).is(':disabled')) {\r\n                    $li.addClass('disabled');\r\n                }\r\n\r\n                // Add the options of the group.\r\n                $('option', group).each($.proxy(function(index, element) {\r\n                    this.createOptionValue(element);\r\n                }, this));\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Build the select all.\r\n         *\r\n         * Checks if a select all has already been created.\r\n         */\r\n        buildSelectAll: function() {\r\n            if (typeof this.options.selectAllValue === 'number') {\r\n                this.options.selectAllValue = this.options.selectAllValue.toString();\r\n            }\r\n\r\n            var alreadyHasSelectAll = this.hasSelectAll();\r\n\r\n            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple\r\n                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {\r\n\r\n                // Check whether to add a divider after the select all.\r\n                if (this.options.includeSelectAllDivider) {\r\n                    this.$ul.prepend($(this.options.templates.divider));\r\n                }\r\n\r\n                var $li = $(this.options.templates.li);\r\n                $('label', $li).addClass(\"checkbox\");\r\n\r\n                if (this.options.enableHTML) {\r\n                    $('label', $li).html(\" \" + this.options.selectAllText);\r\n                }\r\n                else {\r\n                    $('label', $li).text(\" \" + this.options.selectAllText);\r\n                }\r\n\r\n                if (this.options.selectAllName) {\r\n                    $('label', $li).prepend('<input type=\"checkbox\" name=\"' + this.options.selectAllName + '\" />');\r\n                }\r\n                else {\r\n                    $('label', $li).prepend('<input type=\"checkbox\" />');\r\n                }\r\n\r\n                var $checkbox = $('input', $li);\r\n                $checkbox.val(this.options.selectAllValue);\r\n\r\n                $li.addClass(\"multiselect-item multiselect-all\");\r\n                $checkbox.parent().parent()\r\n                    .addClass('multiselect-all');\r\n\r\n                this.$ul.prepend($li);\r\n\r\n                $checkbox.prop('checked', false);\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Builds the filter.\r\n         */\r\n        buildFilter: function() {\r\n\r\n            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.\r\n            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {\r\n                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);\r\n\r\n                if (this.$select.find('option').length >= enableFilterLength) {\r\n\r\n                    this.$filter = $(this.options.templates.filter);\r\n                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);\r\n\r\n                    // Adds optional filter clear button\r\n                    if(this.options.includeFilterClearBtn){\r\n                        var clearBtn = $(this.options.templates.filterClearBtn);\r\n                        clearBtn.on('click', $.proxy(function(event){\r\n                            clearTimeout(this.searchTimeout);\r\n                            this.$filter.find('.multiselect-search').val('');\r\n                            $('li', this.$ul).show().removeClass(\"filter-hidden\");\r\n                            this.updateSelectAll();\r\n                        }, this));\r\n                        this.$filter.find('.input-group').append(clearBtn);\r\n                    }\r\n\r\n                    this.$ul.prepend(this.$filter);\r\n\r\n                    this.$filter.val(this.query).on('click', function(event) {\r\n                        event.stopPropagation();\r\n                    }).on('input keydown', $.proxy(function(event) {\r\n                        // Cancel enter key default behaviour\r\n                        if (event.which === 13) {\r\n                          event.preventDefault();\r\n                        }\r\n\r\n                        // This is useful to catch \"keydown\" events after the browser has updated the control.\r\n                        clearTimeout(this.searchTimeout);\r\n\r\n                        this.searchTimeout = this.asyncFunction($.proxy(function() {\r\n\r\n                            if (this.query !== event.target.value) {\r\n                                this.query = event.target.value;\r\n\r\n                                var currentGroup, currentGroupVisible;\r\n                                $.each($('li', this.$ul), $.proxy(function(index, element) {\r\n                                    var value = $('input', element).length > 0 ? $('input', element).val() : \"\";\r\n                                    var text = $('label', element).text();\r\n\r\n                                    var filterCandidate = '';\r\n                                    if ((this.options.filterBehavior === 'text')) {\r\n                                        filterCandidate = text;\r\n                                    }\r\n                                    else if ((this.options.filterBehavior === 'value')) {\r\n                                        filterCandidate = value;\r\n                                    }\r\n                                    else if (this.options.filterBehavior === 'both') {\r\n                                        filterCandidate = text + '\\n' + value;\r\n                                    }\r\n\r\n                                    if (value !== this.options.selectAllValue && text) {\r\n\r\n                                        // By default lets assume that element is not\r\n                                        // interesting for this search.\r\n                                        var showElement = false;\r\n\r\n                                        if (this.options.enableCaseInsensitiveFiltering) {\r\n                                            filterCandidate = filterCandidate.toLowerCase();\r\n                                            this.query = this.query.toLowerCase();\r\n                                        }\r\n\r\n                                        if (this.options.enableFullValueFiltering && this.options.filterBehavior !== 'both') {\r\n                                            var valueToMatch = filterCandidate.trim().substring(0, this.query.length);\r\n                                            if (this.query.indexOf(valueToMatch) > -1) {\r\n                                                showElement = true;\r\n                                            }\r\n                                        }\r\n                                        else if (filterCandidate.indexOf(this.query) > -1) {\r\n                                            showElement = true;\r\n                                        }\r\n\r\n                                        // Toggle current element (group or group item) according to showElement boolean.\r\n                                        $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);\r\n\r\n                                        // Differentiate groups and group items.\r\n                                        if ($(element).hasClass('multiselect-group')) {\r\n                                            // Remember group status.\r\n                                            currentGroup = element;\r\n                                            currentGroupVisible = showElement;\r\n                                        }\r\n                                        else {\r\n                                            // Show group name when at least one of its items is visible.\r\n                                            if (showElement) {\r\n                                                $(currentGroup).show().removeClass('filter-hidden');\r\n                                            }\r\n\r\n                                            // Show all group items when group name satisfies filter.\r\n                                            if (!showElement && currentGroupVisible) {\r\n                                                $(element).show().removeClass('filter-hidden');\r\n                                            }\r\n                                        }\r\n                                    }\r\n                                }, this));\r\n                            }\r\n\r\n                            this.updateSelectAll();\r\n                        }, this), 300, this);\r\n                    }, this));\r\n                }\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Unbinds the whole plugin.\r\n         */\r\n        destroy: function() {\r\n            this.$container.remove();\r\n            this.$select.show();\r\n            this.$select.data('multiselect', null);\r\n        },\r\n\r\n        /**\r\n         * Refreshs the multiselect based on the selected options of the select.\r\n         */\r\n        refresh: function () {\r\n            var inputs = $.map($('li input', this.$ul), $);\r\n\r\n            $('option', this.$select).each($.proxy(function (index, element) {\r\n                var $elem = $(element);\r\n                var value = $elem.val();\r\n                var $input;\r\n                for (var i = inputs.length; 0 < i--; /**/) {\r\n                    if (value !== ($input = inputs[i]).val())\r\n                        continue; // wrong li\r\n\r\n                    if ($elem.is(':selected')) {\r\n                        $input.prop('checked', true);\r\n\r\n                        if (this.options.selectedClass) {\r\n                            $input.closest('li')\r\n                                .addClass(this.options.selectedClass);\r\n                        }\r\n                    }\r\n                    else {\r\n                        $input.prop('checked', false);\r\n\r\n                        if (this.options.selectedClass) {\r\n                            $input.closest('li')\r\n                                .removeClass(this.options.selectedClass);\r\n                        }\r\n                    }\r\n\r\n                    if ($elem.is(\":disabled\")) {\r\n                        $input.attr('disabled', 'disabled')\r\n                            .prop('disabled', true)\r\n                            .closest('li')\r\n                            .addClass('disabled');\r\n                    }\r\n                    else {\r\n                        $input.prop('disabled', false)\r\n                            .closest('li')\r\n                            .removeClass('disabled');\r\n                    }\r\n                    break; // assumes unique values\r\n                }\r\n            }, this));\r\n\r\n            this.updateButtonText();\r\n            this.updateSelectAll();\r\n        },\r\n\r\n        /**\r\n         * Select all options of the given values.\r\n         *\r\n         * If triggerOnChange is set to true, the on change event is triggered if\r\n         * and only if one value is passed.\r\n         *\r\n         * @param {Array} selectValues\r\n         * @param {Boolean} triggerOnChange\r\n         */\r\n        select: function(selectValues, triggerOnChange) {\r\n            if(!$.isArray(selectValues)) {\r\n                selectValues = [selectValues];\r\n            }\r\n\r\n            for (var i = 0; i < selectValues.length; i++) {\r\n                var value = selectValues[i];\r\n\r\n                if (value === null || value === undefined) {\r\n                    continue;\r\n                }\r\n\r\n                var $option = this.getOptionByValue(value);\r\n                var $checkbox = this.getInputByValue(value);\r\n\r\n                if($option === undefined || $checkbox === undefined) {\r\n                    continue;\r\n                }\r\n\r\n                if (!this.options.multiple) {\r\n                    this.deselectAll(false);\r\n                }\r\n\r\n                if (this.options.selectedClass) {\r\n                    $checkbox.closest('li')\r\n                        .addClass(this.options.selectedClass);\r\n                }\r\n\r\n                $checkbox.prop('checked', true);\r\n                $option.prop('selected', true);\r\n\r\n                if (triggerOnChange) {\r\n                    this.options.onChange($option, true);\r\n                }\r\n            }\r\n\r\n            this.updateButtonText();\r\n            this.updateSelectAll();\r\n        },\r\n\r\n        /**\r\n         * Clears all selected items.\r\n         */\r\n        clearSelection: function () {\r\n            this.deselectAll(false);\r\n            this.updateButtonText();\r\n            this.updateSelectAll();\r\n        },\r\n\r\n        /**\r\n         * Deselects all options of the given values.\r\n         *\r\n         * If triggerOnChange is set to true, the on change event is triggered, if\r\n         * and only if one value is passed.\r\n         *\r\n         * @param {Array} deselectValues\r\n         * @param {Boolean} triggerOnChange\r\n         */\r\n        deselect: function(deselectValues, triggerOnChange) {\r\n            if(!$.isArray(deselectValues)) {\r\n                deselectValues = [deselectValues];\r\n            }\r\n\r\n            for (var i = 0; i < deselectValues.length; i++) {\r\n                var value = deselectValues[i];\r\n\r\n                if (value === null || value === undefined) {\r\n                    continue;\r\n                }\r\n\r\n                var $option = this.getOptionByValue(value);\r\n                var $checkbox = this.getInputByValue(value);\r\n\r\n                if($option === undefined || $checkbox === undefined) {\r\n                    continue;\r\n                }\r\n\r\n                if (this.options.selectedClass) {\r\n                    $checkbox.closest('li')\r\n                        .removeClass(this.options.selectedClass);\r\n                }\r\n\r\n                $checkbox.prop('checked', false);\r\n                $option.prop('selected', false);\r\n\r\n                if (triggerOnChange) {\r\n                    this.options.onChange($option, false);\r\n                }\r\n            }\r\n\r\n            this.updateButtonText();\r\n            this.updateSelectAll();\r\n        },\r\n\r\n        /**\r\n         * Selects all enabled & visible options.\r\n         *\r\n         * If justVisible is true or not specified, only visible options are selected.\r\n         *\r\n         * @param {Boolean} justVisible\r\n         * @param {Boolean} triggerOnSelectAll\r\n         */\r\n        selectAll: function (justVisible, triggerOnSelectAll) {\r\n            justVisible = (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : justVisible;\r\n\r\n            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;\r\n            var allCheckboxes = $(\"li input[type='checkbox']:enabled\", this.$ul);\r\n            var visibleCheckboxes = allCheckboxes.filter(\":visible\");\r\n            var allCheckboxesCount = allCheckboxes.length;\r\n            var visibleCheckboxesCount = visibleCheckboxes.length;\r\n\r\n            if(justVisible) {\r\n                visibleCheckboxes.prop('checked', true);\r\n                $(\"li:not(.divider):not(.disabled)\", this.$ul).filter(\":visible\").addClass(this.options.selectedClass);\r\n            }\r\n            else {\r\n                allCheckboxes.prop('checked', true);\r\n                $(\"li:not(.divider):not(.disabled)\", this.$ul).addClass(this.options.selectedClass);\r\n            }\r\n\r\n            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {\r\n                $(\"option:not([data-role='divider']):enabled\", this.$select).prop('selected', true);\r\n            }\r\n            else {\r\n                var values = visibleCheckboxes.map(function() {\r\n                    return $(this).val();\r\n                }).get();\r\n\r\n                $(\"option:enabled\", this.$select).filter(function(index) {\r\n                    return $.inArray($(this).val(), values) !== -1;\r\n                }).prop('selected', true);\r\n            }\r\n\r\n            if (triggerOnSelectAll) {\r\n                this.options.onSelectAll();\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Deselects all options.\r\n         *\r\n         * If justVisible is true or not specified, only visible options are deselected.\r\n         *\r\n         * @param {Boolean} justVisible\r\n         */\r\n        deselectAll: function (justVisible) {\r\n            justVisible = (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : justVisible;\r\n            justVisible = typeof justVisible === 'undefined' ? true : justVisible;\r\n\r\n            if(justVisible) {\r\n                var visibleCheckboxes = $(\"li input[type='checkbox']:not(:disabled)\", this.$ul).filter(\":visible\");\r\n                visibleCheckboxes.prop('checked', false);\r\n\r\n                var values = visibleCheckboxes.map(function() {\r\n                    return $(this).val();\r\n                }).get();\r\n\r\n                $(\"option:enabled\", this.$select).filter(function(index) {\r\n                    return $.inArray($(this).val(), values) !== -1;\r\n                }).prop('selected', false);\r\n\r\n                if (this.options.selectedClass) {\r\n                    $(\"li:not(.divider):not(.disabled)\", this.$ul).filter(\":visible\").removeClass(this.options.selectedClass);\r\n                }\r\n            }\r\n            else {\r\n                $(\"li input[type='checkbox']:enabled\", this.$ul).prop('checked', false);\r\n                $(\"option:enabled\", this.$select).prop('selected', false);\r\n\r\n                if (this.options.selectedClass) {\r\n                    $(\"li:not(.divider):not(.disabled)\", this.$ul).removeClass(this.options.selectedClass);\r\n                }\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Rebuild the plugin.\r\n         *\r\n         * Rebuilds the dropdown, the filter and the select all option.\r\n         */\r\n        rebuild: function() {\r\n            this.$ul.html('');\r\n\r\n            // Important to distinguish between radios and checkboxes.\r\n            this.options.multiple = this.$select.attr('multiple') === \"multiple\";\r\n\r\n            this.buildSelectAll();\r\n            this.buildDropdownOptions();\r\n            this.buildFilter();\r\n\r\n            this.updateButtonText();\r\n            this.updateSelectAll(true);\r\n\r\n            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {\r\n                this.disable();\r\n            }\r\n            else {\r\n                this.enable();\r\n            }\r\n\r\n            if (this.options.dropRight) {\r\n                this.$ul.addClass('pull-right');\r\n            }\r\n        },\r\n\r\n        /**\r\n         * The provided data will be used to build the dropdown.\r\n         */\r\n        dataprovider: function(dataprovider) {\r\n\r\n            var groupCounter = 0;\r\n            var $select = this.$select.empty();\r\n\r\n            $.each(dataprovider, function (index, option) {\r\n                var $tag;\r\n\r\n                if ($.isArray(option.children)) { // create optiongroup tag\r\n                    groupCounter++;\r\n\r\n                    $tag = $('<optgroup/>').attr({\r\n                        label: option.label || 'Group ' + groupCounter,\r\n                        disabled: !!option.disabled\r\n                    });\r\n\r\n                    forEach(option.children, function(subOption) { // add children option tags\r\n                        $tag.append($('<option/>').attr({\r\n                            value: subOption.value,\r\n                            label: subOption.label || subOption.value,\r\n                            title: subOption.title,\r\n                            selected: !!subOption.selected,\r\n                            disabled: !!subOption.disabled\r\n                        }));\r\n                    });\r\n                }\r\n                else {\r\n                    $tag = $('<option/>').attr({\r\n                        value: option.value,\r\n                        label: option.label || option.value,\r\n                        title: option.title,\r\n                        class: option.class,\r\n                        selected: !!option.selected,\r\n                        disabled: !!option.disabled\r\n                    });\r\n                    $tag.text(option.label || option.value);\r\n                }\r\n\r\n                $select.append($tag);\r\n            });\r\n\r\n            this.rebuild();\r\n        },\r\n\r\n        /**\r\n         * Enable the multiselect.\r\n         */\r\n        enable: function() {\r\n            this.$select.prop('disabled', false);\r\n            this.$button.prop('disabled', false)\r\n                .removeClass('disabled');\r\n        },\r\n\r\n        /**\r\n         * Disable the multiselect.\r\n         */\r\n        disable: function() {\r\n            this.$select.prop('disabled', true);\r\n            this.$button.prop('disabled', true)\r\n                .addClass('disabled');\r\n        },\r\n\r\n        /**\r\n         * Set the options.\r\n         *\r\n         * @param {Array} options\r\n         */\r\n        setOptions: function(options) {\r\n            this.options = this.mergeOptions(options);\r\n        },\r\n\r\n        /**\r\n         * Merges the given options with the default options.\r\n         *\r\n         * @param {Array} options\r\n         * @returns {Array}\r\n         */\r\n        mergeOptions: function(options) {\r\n            return $.extend(true, {}, this.defaults, this.options, options);\r\n        },\r\n\r\n        /**\r\n         * Checks whether a select all checkbox is present.\r\n         *\r\n         * @returns {Boolean}\r\n         */\r\n        hasSelectAll: function() {\r\n            return $('li.multiselect-all', this.$ul).length > 0;\r\n        },\r\n\r\n        /**\r\n         * Updates the select all checkbox based on the currently displayed and selected checkboxes.\r\n         */\r\n        updateSelectAll: function(notTriggerOnSelectAll) {\r\n            if (this.hasSelectAll()) {\r\n                var allBoxes = $(\"li:not(.multiselect-item):not(.filter-hidden) input:enabled\", this.$ul);\r\n                var allBoxesLength = allBoxes.length;\r\n                var checkedBoxesLength = allBoxes.filter(\":checked\").length;\r\n                var selectAllLi  = $(\"li.multiselect-all\", this.$ul);\r\n                var selectAllInput = selectAllLi.find(\"input\");\r\n\r\n                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {\r\n                    selectAllInput.prop(\"checked\", true);\r\n                    selectAllLi.addClass(this.options.selectedClass);\r\n                    this.options.onSelectAll(true);\r\n                }\r\n                else {\r\n                    selectAllInput.prop(\"checked\", false);\r\n                    selectAllLi.removeClass(this.options.selectedClass);\r\n                    if (checkedBoxesLength === 0) {\r\n                        if (!notTriggerOnSelectAll) {\r\n                            this.options.onSelectAll(false);\r\n                        }\r\n                    }\r\n                }\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Update the button text and its title based on the currently selected options.\r\n         */\r\n        updateButtonText: function() {\r\n            var options = this.getSelected();\r\n\r\n            // First update the displayed button text.\r\n            if (this.options.enableHTML) {\r\n                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));\r\n            }\r\n            else {\r\n                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));\r\n            }\r\n\r\n            // Now update the title attribute of the button.\r\n            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));\r\n        },\r\n\r\n        /**\r\n         * Get all selected options.\r\n         *\r\n         * @returns {jQUery}\r\n         */\r\n        getSelected: function() {\r\n            return $('option', this.$select).filter(\":selected\");\r\n        },\r\n\r\n        /**\r\n         * Gets a select option by its value.\r\n         *\r\n         * @param {String} value\r\n         * @returns {jQuery}\r\n         */\r\n        getOptionByValue: function (value) {\r\n\r\n            var options = $('option', this.$select);\r\n            var valueToCompare = value.toString();\r\n\r\n            for (var i = 0; i < options.length; i = i + 1) {\r\n                var option = options[i];\r\n                if (option.value === valueToCompare) {\r\n                    return $(option);\r\n                }\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Get the input (radio/checkbox) by its value.\r\n         *\r\n         * @param {String} value\r\n         * @returns {jQuery}\r\n         */\r\n        getInputByValue: function (value) {\r\n\r\n            var checkboxes = $('li input', this.$ul);\r\n            var valueToCompare = value.toString();\r\n\r\n            for (var i = 0; i < checkboxes.length; i = i + 1) {\r\n                var checkbox = checkboxes[i];\r\n                if (checkbox.value === valueToCompare) {\r\n                    return $(checkbox);\r\n                }\r\n            }\r\n        },\r\n\r\n        /**\r\n         * Used for knockout integration.\r\n         */\r\n        updateOriginalOptions: function() {\r\n            this.originalOptions = this.$select.clone()[0].options;\r\n        },\r\n\r\n        asyncFunction: function(callback, timeout, self) {\r\n            var args = Array.prototype.slice.call(arguments, 3);\r\n            return setTimeout(function() {\r\n                callback.apply(self || window, args);\r\n            }, timeout);\r\n        },\r\n\r\n        setAllSelectedText: function(allSelectedText) {\r\n            this.options.allSelectedText = allSelectedText;\r\n            this.updateButtonText();\r\n        }\r\n    };\r\n\r\n    $.fn.multiselect = function(option, parameter, extraOptions) {\r\n        return this.each(function() {\r\n            var data = $(this).data('multiselect');\r\n            var options = typeof option === 'object' && option;\r\n\r\n            // Initialize the multiselect.\r\n            if (!data) {\r\n                data = new Multiselect(this, options);\r\n                $(this).data('multiselect', data);\r\n            }\r\n\r\n            // Call multiselect method.\r\n            if (typeof option === 'string') {\r\n                data[option](parameter, extraOptions);\r\n\r\n                if (option === 'destroy') {\r\n                    $(this).data('multiselect', false);\r\n                }\r\n            }\r\n        });\r\n    };\r\n\r\n    $.fn.multiselect.Constructor = Multiselect;\r\n\r\n    $(function() {\r\n        $(\"select[data-role=multiselect]\").multiselect();\r\n    });\r\n\r\n}(window.jQuery);\r\n"

/***/ }),

/***/ 303:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20)(__webpack_require__(298))

/***/ }),

/***/ 305:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(303);
__webpack_require__(287);


/***/ }),

/***/ 558:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
var nTables = __webpack_require__(7);
__webpack_require__(942);
__webpack_require__(305);
__webpack_require__(47);
var SettingUserIndex;
(function (SettingUserIndex) {
    $(function () {
        /*$('.multiselect').multiselect({
            buttonWidth: '330px'
        });
        $('#addUserButton').mouseenter(function () {
            $('#addUserButton').popover('toggle');
        });
        $('#addUserButton').mouseleave(function () {
            $('#addUserButton').popover('hide');
        });
        $('#addUser').on('hidden.bs.modal', function(){
            $('#email_input').val('');
            $('#mobile_input').val('');
            $('#alias_input').val('');
            $('#pwd_input').val('');
            $('#repwd_input').val('');
            $('#roleSelect').multiselect('clearSelection');
            $('#roleSelect').multiselect('refresh');
            $('#qq_input').val('');
            $('#wxAppSecret-add-input').val(null).trigger('change');
        });
        $('#addUser').on('shown.bs.modal', function(){
            $('#wxAppSecret-add-input').select2({
                placeholder: '请选择微信公众号',
                allowClear: true,
                minimumResultsForSearch: Infinity
            });
        });

        $('#editUser').on('shown.bs.modal', function(){
            $('#wxAppSecret-edit-input').select2({
                placeholder: '请选择微信公众号',
                allowClear: true,
                minimumResultsForSearch: Infinity
            });
        });*/
        initTable();
    });
    var tableEl = $('#usertable');
    var userTable;
    function initTable() {
        userTable = new nTables.Table({
            el: tableEl,
            options: {
                serverSide: true,
                // paging:true,
                ajax: {
                    url: 'setting/user/lowerAdmin/list',
                    method: 'POST',
                    dataSrc: function (data) { return data.msg; },
                    data: function (data) {
                        return '';
                        /*return utils.cleanObject({
                            page: tables.getPage(data),
                            rows: data.length
                        });*/
                    }
                },
                columns: [
                    { data: 'alias', title: '名称' },
                    { data: 'email', title: 'email' },
                    { data: 'mobile', title: '手机号' },
                    { data: 'alias', title: '成员角色' },
                    { data: 'alias', title: '微信公众号' },
                    { data: 'id', title: '操作', render: renderBtns, className: 'prevent' }
                ],
                initComplete: initComplete
            }
        });
    }
    function renderBtns(id) {
        return "<div data-id='" + id + "'><i class='fa fa-edit view-edit' title='\u7F16\u8F91' style='cursor:pointer'></i><i class='fa fa-trash view-delete' title='\u5220\u9664' style='cursor:pointer'></i></div>";
    }
    function initComplete() {
        bindEditEvent();
        bindDelEvent();
    }
    // 编辑
    function bindEditEvent() {
        tableEl.on('click', '.view-edit', function () {
            var id = $(this).parent('div').data('id');
        });
    }
    function bindEditSubmitEvent() {
        /*$.ajax({
            url:'setting/user/lowerAdmin/delete',
            method:'POST',
            data:{
                userids:id
            },
            success:(msg)=>{
                utils.alertMessage('ddd');
            }
        });*/
    }
    // 添加
    function bindAddEvent() {
    }
    // 删除
    function bindDelEvent() {
        tableEl.on('click', '.view-delete', function () {
            var id = $(this).parent('div').data('id');
            utils.confirmModal({
                msg: "\u786E\u8BA4\u5220\u9664\u9009\u4E2D\u7684\u6210\u5458\u5417?",
                cb: function (modal, btn) {
                    var endLoading = utils.loadingBtn(btn);
                    $.ajax({
                        url: 'setting/user/lowerAdmin/delete',
                        type: 'POST',
                        data: {
                            userids: id
                        },
                        success: function (msg) {
                            if (!msg.error) {
                                userTable.reload();
                                modal.modal('hide');
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
    }
    // function emailCheckUnique(){
    // 	let email = $('#email_input').val().trim();
    // 	$.post(/*appName + */'/register/isUniqueUserEmail', {
    // 			'email': email
    // 		}, function (data) {
    // 			if (data === '2') {
    // 				new PNotify({
    // 					title: '注册失败',
    // 					text: '该邮箱已注册，请直接登录',
    // 					type: 'error'
    // 				});
    // 				return;
    // 			}
    // 		});
    // }
    // function tellCheckUnique(){
    // 	let mobile = $('#mobile_input').val().trim();
    // 	/**
    // 	 * 手机唯一验证
    // 	 */
    // 	$.post(/*appName + */'/register/isUniqueUserMobile', {
    // 		'mobile': mobile
    // 	}, function (data) {
    // 		if(data ==='2'){
    // 			new PNotify({
    // 				title: '注册失败',
    // 				text: '该手机已注册，请直接登录',
    // 				type: 'error'
    // 			});
    // 			return;
    // 		}
    // 	});
    // }
    // let trhtml;
    // function addRecordDynamically(id, alias, email, molile, role,regWxName) {
    // 	trhtml = '<tr id="record-' + id + '" class="even pointer">';
    // 	if (alias ===''){
    // 		alias = '未指定';
    // 	}
    // 	if (regWxName ===''){
    // 		regWxName = '未指定';
    // 	}
    // 	trhtml += '<td class=" ">' + alias + '</td>';
    // 	trhtml += '<td class=" ">' + email + '</td>';
    // 	trhtml += '<td class=" ">' + molile + '</td>';
    // 	trhtml += '<td class=" ">' + role + '</td>';
    // 	trhtml += '<td class=" ">' +regWxName + '</td>';
    // 	trhtml += '<td class="last">';
    // 	trhtml += '<a onclick="editUser(\'' + id +
    // 		'\')" href="javascript:;">编辑</a>';
    // 	trhtml += '<a onclick="delUser(\'' + id +
    // 		'\')" href="javascript:;">删除</a>';
    // 	trhtml += '</td>';
    // 	trhtml += '</tr>';
    // 	$('#usertable').append(trhtml);
    // }
    // function editRecordDynamically(id, alias, email, molile, role,wxName) {
    // 	if (alias ===''){
    // 		alias = '未指定';
    // 	}
    // 	if (wxName === '') {
    // 		wxName = '未指定';
    // 	}
    // 	trhtml = '<td class=" ">' + alias + '</td>';
    // 	trhtml += '<td class=" ">' + email + '</td>';
    // 	trhtml += '<td class=" ">' + molile + '</td>';
    // 	trhtml += '<td class=" ">' + role + '</td>';
    // 	trhtml += '<td class=" ">' + wxName + '</td>';
    // 	trhtml += '<td class="last">';
    // 	trhtml += '<a onclick="editUser(\'' + id +
    // 		'\')" href="javascript:;">编辑</a>';
    // 	trhtml += '<a onclick="delUser(\'' + id +
    // 		'\')" href="javascript:;">删除</a>';
    // 	trhtml += '</td>';
    // 	$('#record-' + id).html(trhtml);
    // }
    // function doReg() {
    // 	let email = $('#email_input').val().trim();
    // 	let mobile = $('#mobile_input').val().trim();
    // 	let pwd = $('#pwd_input').val().trim();
    // 	let repwd = $('#repwd_input').val().trim();
    // 	let alias = $('#alias_input').val().trim();
    // 	let qq = $('#qq_input').val().trim();
    // 	let credentialId=$.trim($('#wxAppSecret-add-input option:selected').val());
    // 	let regWxName=$.trim($('#wxAppSecret-add-input option:selected').text());
    // 	if (email === undefined || email === '') {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '请填写邮箱',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	} else {
    // 		let eReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    // 		if (!eReg.test(email)) {
    // 			new PNotify({
    // 				title: '注册失败',
    // 				text: '电子邮箱格式不正确',
    // 				type: 'error'
    // 			});
    // 			return;
    // 		}
    // 	}
    // 	if (mobile === undefined || mobile === '') {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '请填写手机号',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	} else {
    // 		let reg = /^0?(13[0-9]|15[012356789]|18[02356789]|14[57]|17[0678])[0-9]{8}$/;
    // 		if (!reg.test(mobile)) {
    // 			reg = /^0?(170[059])[0-9]{7}$/;
    // 			if (!reg.test(mobile)) {
    // 				new PNotify({
    // 					title: '注册失败',
    // 					text: '手机号码格式不正确',
    // 					type: 'error'
    // 				});
    // 				return;
    // 			}
    // 		}
    // 	}
    // 	if (alias === '') {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '联系人不能为空',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	if (pwd === undefined || pwd === '') {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '密码不能为空',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	if (pwd.length < 6) {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '密码不能小于6位',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	if (repwd === undefined || repwd === '') {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '确认密码不能为空',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	if (repwd.length < 6) {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '确认密码不能小于6位',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	if (pwd !== repwd) {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '密码不一致',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	if ($('#roleSelect').val() === undefined || $('#roleSelect').val() === '') {
    // 		new PNotify({
    // 			title: '注册失败',
    // 			text: '成员角色不能为空',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	let roles = $('#roleSelect').val().join(',');
    // 	$.ajax({
    // 		url: 'user/app/doReg',
    // 		type: 'POST',
    // 		data: {
    // 			'email': email,
    // 			'mobile': mobile,
    // 			'pwd': pwd,
    // 			'roles': roles,
    // 			'alias': alias,
    // 			'qq': qq,
    // 			'credentialId':credentialId
    // 		},
    // 		success: function (data) {
    // 			PNotify.removeAll();
    // 			if (data.state === 'success') {
    // 				new PNotify({
    // 					title: '注册成功',
    // 					text: '您已成功注册应用成员',
    // 					type: 'success'
    // 				});
    // 				$('#email_input').val('');
    // 				$('#mobile_input').val('');
    // 				$('#pwd_input').val('');
    // 				$('#repwd_input').val('');
    // 				$('#alias_input').val('');
    // 				$('#qq_input').val('');
    // 				$('#wxAppSecret-add-input').val(null).trigger('change');
    // 				addRecordDynamically(data.msg, alias, email, mobile, data.role,regWxName);
    // 				$('#addUser').modal('hide');
    // 			} else {
    // 				new PNotify({
    // 					title: '注册失败',
    // 					text: data.msg,
    // 					type: 'error'
    // 				});
    // 			}
    // 		}
    // 	});
    // }
    // let userDialog = undefined;
    // function delUser(userId) {
    // 	userDialog = new BootstrapDialog.show({
    // 		title: '提示',
    // 		message: '确认删除?',
    // 		buttons: [{
    // 			label: '确认',
    // 			cssClass: 'btn-primary',
    // 			action: function () {
    // 				ajaxDeleteUser(userId);
    // 			}
    // 		}, {
    // 			label: '取消',
    // 			cssClass: 'btn-default',
    // 			action: function (dialogItself) {
    // 				dialogItself.close();
    // 			}
    // 		}]
    // 	});
    // }
    // function ajaxDeleteUser(userId) {
    // 	$.ajax({
    // 		url: 'user/app/delUser',
    // 		data: {
    // 			userId: userId
    // 		},
    // 		type: 'post',
    // 		success: function (data) {
    // 			if (data.state === 'success') {
    // 				userDialog.close();
    // 				new PNotify({
    // 					title: '删除成功',
    // 					text: '删除成功',
    // 					type: 'success'
    // 				});
    // 				$('#record-' + userId).remove();
    // 			} else {
    // 				new PNotify({
    // 					title: '删除失败',
    // 					text: '删除失败',
    // 					type: 'error'
    // 				});
    // 			}
    // 		}
    // 	});
    // }
    // // 点击编辑应用成员时，获取应用成员信息息
    // function editUser(userId) {
    // 	$.ajax({
    // 		url: 'user/app/getUser',
    // 		type: 'POST',
    // 		data: {
    // 			'userId': userId
    // 		},
    // 		success: function (data) {
    // 			if (data.state === 'success') {
    // 				$('#email_edit').val(data.email);
    // 				$('#mobile_edit').val(data.mobile);
    // 				$('#alias_edit').val(data.alias);
    // 				$('#qq_edit').val(data.qq);
    // 				$('#wxAppSecret-edit-input').val(data.extraData).trigger('change');// 获取值
    // 				let roles = new Array();
    // 				roles = data.roles.split(',');
    // 				$('.edit-options').attr('selected', 'false');
    // 				$('#roleSelect_edit').multiselect('select', roles);
    // 				$('#roleSelect_edit').multiselect('refresh');
    // 				$('#userid').val(userId);
    // 				$('#editUser').modal('toggle');
    // 			} else {
    // 				new PNotify({
    // 					title: '编辑失败',
    // 					text: '编辑失败',
    // 					type: 'fail'
    // 				});
    // 			}
    // 		}
    // 	});
    // }
    // function doEditUser() {
    // 	let userId = $('#userid').val().trim();
    // 	let email = $('#email_edit').val().trim();
    // 	let mobile = $('#mobile_edit').val().trim();
    // 	let alias = $('#alias_edit').val().trim();
    // 	let qq = $('#qq_edit').val().trim();
    // 	let credentialId=$.trim($('#wxAppSecret-edit-input option:selected').val());
    // 	let wxName=$.trim($('#wxAppSecret-edit-input option:selected').text());
    // 	if ($('#roleSelect_edit').val() === undefined || $('#roleSelect_edit').val() === '') {
    // 		new PNotify({
    // 			title: '编辑失败',
    // 			text: '成员角色不能为空',
    // 			type: 'error'
    // 		});
    // 		return;
    // 	}
    // 	let roles = $('#roleSelect_edit').val().join(',');
    // 	$('#editUser').modal('hide');
    // 	$.ajax({
    // 		url: 'user/app/doEditUser',
    // 		type: 'POST',
    // 		data: {
    // 			'userId': userId,
    // 			'email': email,
    // 			'mobile': mobile,
    // 			'roles': roles,
    // 			'alias': alias,
    // 			'qq': qq,
    // 			'credentialId':credentialId
    // 		},
    // 		success: function (data) {
    // 			PNotify.removeAll();
    // 			if (data.state ==='success'){
    // 				new PNotify({
    // 					title: '编辑成功',
    // 					text: '您已成功编辑应用成员',
    // 					type: 'success'
    // 				});
    // 				$('#userid').val('');
    // 				$('#email_edit').val('');
    // 				$('#mobile_edit').val('');
    // 				$('#alias_edit').val('');
    // 				$('#qq_edit').val('');
    // 				// $('#wxAppSecret_edit').val('');
    // 				$ ('#wxAppSecret-edit-input').val(null).trigger('change');
    // 				// location.reload();
    // 				editRecordDynamically(data.msg, alias, email, mobile, data.role, wxName);
    // 			} else {
    // 				new PNotify({
    // 					title: '失败',
    // 					text: /*data.msg*/ '失败',
    // 					type: 'error'
    // 				});
    // 			}
    // 		}
    // 	});
    // }
})(SettingUserIndex || (SettingUserIndex = {}));


/***/ }),

/***/ 942:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[1145]);
//# sourceMappingURL=13.js.map