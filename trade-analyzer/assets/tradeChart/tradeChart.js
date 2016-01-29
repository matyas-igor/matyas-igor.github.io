/**
 * Created with JetBrains PhpStorm.
 * User: Igor Matyas
 * Date: Aug/5/13
 * Time: 6:28 PM
 * To change this template use File | defaults | File Templates.
 */

define(['jquery', 'vendor/svg/svg.min',  'vendor/svg/svg.export.min',  'vendor/svg/svg.import.min', 'underscore', 'vendor/disableSelection/disableSelection'], function() {

(function($) {

    var TradeChart = function() {
        var that = this;

        this.settings = {
            chartId: 'chart',
            width: 1000,
            height: 700,
            data: [],
            levels: [],
            volumes: {},
            dataType: '1M',

            showDaysDividers: true,
            showAdditionalAxisLabels: true,
            showScrollDate: true,

            rulerUrl: null
        };

        this.defaults = {
            textSize: 12,
            textSizeMiddle: 11,
            textSizeSmall: 9,
            textColor: '#666',
            textColorAdditional: '#999',
            textFontFamily: 'Fontin-Sans, Arial',
            lineColor: '#e5e5e5',
            dataChartSettings: {
                topPadding: 20,
                bottomPadding: 20,
                leftPadding: 270,
                rightPadding: 80,
                verticalShift: 2,
                verticalShiftBig: 5,
                verticalTextShift: 5,
                verticalTextShiftAdditional: 5,
                horizontalShift: 5,
                horizontalTextShift: 10,
                candles: {
                    upColor: '#72b05f',
                    upColorBorder: '#5e8e50',
                    downColor: '#db5151',
                    downColorBorder: '#ba4646'
                },
                verticalDividerShift: 6,
                verticalDividerTextVerticalShift: 21,

                daysDividersTextVerticalShiftTop: 21,
                daysDividersTextVerticalShiftRight: 4,

                daysDividersVerticalShiftTop: 18,
                daysDividersVerticalShiftBottom: 0,

                columnWidth: 15,
                columnSpaceWidth: 3
            },
            analyzeChartSettings: {
                width: 150,
                leftPadding: 80,
                rightPadding: 10,
                colorFill: '#52BBDE',
                colorStroke: 'none',
                colorMaxFill: '#DBCDF7',
                colorMaxStroke: 'none'
            },
            volumeChartSettings: {
                bottomPadding: 35,
                topPadding: 0,
                height: 60,
                colorFill: '#52BBDE',
                colorStroke: 'none'
            },
            additionalChartSettings: {
                height: 0,
                bottomPadding: 0,
                topPadding: 0
            },
            scrollSettings: {
                height: 20,
                topPadding: 0,
                bottomPadding: 10,
                draggerColor: '#ff0000',
                draggerTextColor: '#fff',
                draggerColorDivider: '#FFDEDE',
                draggerColorStroke: '#333',
                draggerHeight: 20,
                draggerRulerHeight: 24,
                draggerRulerWidth: 13,
                draggerRectHeight: 14,
                draggerRectAdditionalWidth: 4,
                mouseWheelIntervalsCount: 50
            },
            horizontalFiledsSizeMin: 75,
            horizontalFiledsSizeMax: 175,
            verticalFieldsSize: 40,
            months: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            verticalAxisIntervals: [
                1.0,
                1.25,
                1.5,
                2.0,
                2.5,
                3.0,
                4.0,
                5.0,
                7.5,
                10.0
            ],
            dataTypes: ['1M', '5M', '10M', '15M', '30M', '1H', '4H', '1D', '7D', '1MON'],
            dataTypesTime: {
                '1M': 60,
                '5M': 5 * 60,
                '10M': 10 * 60,
                '15M': 15 * 60,
                '30M': 30 * 60,
                '1H': 60 * 60,
                '4H': 4 * 60 * 60,
                '1D': 24 * 60 * 60,
                '7D': 7 * 24 * 60 * 60,
                '1W': 7 * 24 * 60 * 60,
                '1MON': 30 * 24 * 60 * 60
            },
            animateTime: 75,
            animateOpacityTime: 150,
            candlesMaxAnimateCount: 65,
            axisMaxAnimateCount: 130,
            intervalsValueCount: 25,
            eventClass: 'tradeChart',
            eventClassPermanent: 'tradeChartPermanent',
            viewerSettings: {
                margin: 30
            }
        };

        this.options = {
            isInited: false,
            textAttr: {size: this.defaults.textSize, family: this.defaults.textFontFamily, stroke: "none", fill: this.defaults.textColor},
            textAttrMiddle: {size: this.defaults.textSizeMiddle, family: this.defaults.textFontFamily, stroke: "none", fill: this.defaults.textColor},
            textAttrSmall: {size: this.defaults.textSizeSmall, family: this.defaults.textFontFamily, stroke: "none", fill: this.defaults.textColorAdditional},
            isBusy: false,
            scrollCandles: null,
            svg: null,
            lastValue: 0,
            callStack: [],
            mode: 'scroll'
        };

        this.data = {
            horizontalAxis: {
                line: null,
                labels: {},
                dividers: {}
            },
            verticalAxis: [],
            volumeAxis: {},
            candles: {},
            volumes: {},
            scroll: {},
            analyse: {},
            daysDividers: {}
        };

        this.init = function(settings) {
            return that._init(settings);
        };

        this._init = function(settings) {

            if (that.options.isInited) {
                return that;
            }

            $.extend(that.settings, settings);

            if (!that.settings.showAdditionalAxisLabels) {
                that.defaults.volumeChartSettings.bottomPadding = 25;
            }

            if (typeof settings.data != 'undefined' && typeof settings.levels != 'undefined' && typeof settings.volumes != 'undefined') {
                that.options.scrollCandles = null;
            }

            that.options.svg = SVG(that.settings.chartId).size(that.settings.width, that.settings.height);

            that.options.$chart = $('#'+that.settings.chartId)
            that.options.$chart.css({'shape-rendering': 'crispEdges'});

            that.options.$chart.disableSelection();

            that.options.chartOffsetY = that.options.$chart.offset().top;
            that.options.chartOffsetX = that.options.$chart.offset().left;

//            that.options.svg.rect(that.settings.width, that.settings.height).attr({fill: '#ddd'});
//            that.options.svg.rect(that.options.dataChartWidth, that.options.dataChartHeight).x(that.options.dataChartLeft).y(that.options.dataChartTop).attr({fill: '#fff', stroke: 'none'});

            that._calculateDataIntervals();
            that._calculateDataTypes();
            that._calculateParameters();

            that._drawHorizontalAxis();
            that._drawVerticalAxis();
            that._drawDaysDividers();

            that._drawCandles();
            that._drawVolumesAxis();
            that._drawVolumes();
            that._drawScroll();
            that._drawAnalyse();

            that._setMouseWheelEvents();

            that.options.isInited = true;

            return that;
        };

        this.update = function(settings) {
            if (!that._checkIsBusy('update', _(arguments).toArray(), true)) {
                that._update(settings);
            }
        };

        this._update = function(settings) {
            that.options.isBusy = true;

            that._destroy();
            that._init(settings);

            that.options.isBusy = false;
            that._checkCallStack();
        };

        this._destroy = function() {
            if (that.options.isInited) {
                that.options.svg.clear();
                that.options.svg.mousedown(null);
                $(that.options.svg.node).off('.' + that.defaults.eventClassPermanent + '-' + that.settings.chartId);
                $(that.options.svg.node).remove();

                that.options.svg = null;
                that.options.isInited = false;
            }
        };

        this.destroy = function() {
            that._destroy();
        };

        this.isInited = function() {
            return that.options.isInited;
        };


        this._setMouseWheelEvents = function() {
            $(that.options.svg.node).on('mousewheel.' + that.defaults.eventClassPermanent + '-' + that.settings.chartId, function(event) {
                if ((event.pageX - that.options.chartOffsetX) < that.settings.width && (event.pageY - that.options.chartOffsetY) < that.settings.height) {
                    var deltaX = event.originalEvent.wheelDeltaX,
                        deltaY = event.originalEvent.wheelDeltaY,
                        candlesScrollCount = Math.round(that.options.dataCount / that.defaults.scrollSettings.mouseWheelIntervalsCount), scrollCandles;

                    if (deltaX != 0) {
                        scrollCandles = Math.min(Math.max(that.options.scrollCandles + (deltaX > 0 ? -1 : 1) * candlesScrollCount, 0), that.settings.data.length - 1);

                        if (!that._checkIsBusy('shiftScroll', [scrollCandles], true)) {
                            that._shiftScroll(scrollCandles, function() { that.options.isBusy = true; }, function() {
                                that.options.isBusy = false;
                                that._checkCallStack();
                            });
                        }
                    }

                    event.preventDefault();
                }
            });
        };

        this._drawVerticalAnalyseLabels = function(labels) {
            if (labels.length > 0) {
                for (i in labels) {
                    var yLine = labels[i].y,
                        valueLine = labels[i].value,
                        label = {};

                    label.line = that._drawLine(that.defaults.analyzeChartSettings.leftPadding, yLine + that.options.dataChartTop, that.defaults.analyzeChartSettings.leftPadding - that.defaults.dataChartSettings.horizontalShift, yLine + that.options.dataChartTop, that.defaults.lineColor).back();
                    label.text = that._drawVerticalAnalyseLabel(that.defaults.analyzeChartSettings.leftPadding - that.defaults.dataChartSettings.horizontalTextShift, yLine + that.options.dataChartTop, valueLine);

                    that.data.analyse.verticalAxis.push(label);
                }
            }
        };

        this._drawVerticalAnalyseLabel = function(x, y, number, needAnimate) {
            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }
            return that._drawText(x, y - that.defaults.textSize * 0.9, that._prepareNumberToLabel(number, that.options.verticalAxisLabelDataInterval), 'normal', 'end', needAnimate);
        };

        this._drawAnalyse = function() {
            that.data.analyse.axis = that._drawLine(that.defaults.analyzeChartSettings.leftPadding, that.options.dataChartTop, that.defaults.analyzeChartSettings.leftPadding, that.options.dataChartBottom, that.defaults.lineColor);
            that.data.analyse.verticalAxis = [];
            that.data.analyse.maxVolumes = {};
            that.data.analyse.volumes = {};

            that._drawVerticalAnalyseLabels(that.options.verticalLabels);

            var timestamp = that.settings.data[that.options.scrollCandles].timestamp.toString();

            that.options.analyseTimestamp = timestamp;

            that._drawAnalyseMaxVolumes();
            that._drawAnalyseVolumes(timestamp);
        };

        this._drawAnalyseMaxVolumes = function() {
            var level, i,
                timestamp = _(that.settings.data).last().timestamp.toString(),
                volumes = that.settings.volumes[timestamp],
                maxVolume = null,
                volume, width, yLine, line;

            for (i in that.settings.levels) {
                level = that.settings.levels[i];
                volume = volumes[level];

                maxVolume = maxVolume == null || maxVolume < volume ? volume : maxVolume;
            }

            that.options.maxAnalyseVolume = maxVolume;

            for (i in that.settings.levels) {

                level = that.settings.levels[i];
                volume = parseFloat(volumes[level]);

                width = volume / maxVolume * that.defaults.analyzeChartSettings.width;
                yLine = that.options.dataChartBottom - parseInt(i) / (that.settings.levels.length - 1) * that.options.dataChartHeight;

                line = that._drawLine(that.defaults.analyzeChartSettings.leftPadding, yLine, that.defaults.analyzeChartSettings.leftPadding + width, yLine, that.defaults.analyzeChartSettings.colorMaxFill).attr({'stroke-width': '2'}).back();

                that.data.analyse.maxVolumes[level] = line;
            }
        };

        this._drawAnalyseVolumes = function(timestamp) {
            var level, i,
                volumes = typeof that.settings.volumes[timestamp] == 'undefined' ? that.options.analyseVolumes : that.settings.volumes[timestamp],
                volume, width, yLine, line;

            for (i in that.settings.levels) {

                level = that.settings.levels[i];
                volume = parseFloat(volumes[level]);

                width = volume / that.options.maxAnalyseVolume * that.defaults.analyzeChartSettings.width;
                yLine = that.options.dataChartBottom - parseInt(i) / (that.settings.levels.length - 1) * that.options.dataChartHeight;

                line = that._drawLine(that.defaults.analyzeChartSettings.leftPadding, yLine, that.defaults.analyzeChartSettings.leftPadding + width, yLine, that.defaults.analyzeChartSettings.colorFill).attr({'stroke-width': '2'}).front();

                that.data.analyse.volumes[level] = line;
            }

            that.data.scroll.lastValueLine.front();

            that.data.scroll.lastValueRightRect.front();
            that.data.scroll.lastValueLeftRect.front();

            that.data.scroll.lastValueRightText.front();
            that.data.scroll.lastValueLeftText.front();

            that.data.scroll.dividerRect.front();
            that.data.scroll.dividerText.front();

            that.options.analyseVolumes = volumes;
        };

        this._redrawAnalyseVolumes = function(timestamp) {
            var level, i,
                volumesCurrent = that.settings.volumes[that.options.analyseTimestamp],
                volumesNew = that.settings.volumes[timestamp],
                volumeNew, volumeCurrent, width, yLine, line;

            if (volumesNew && volumesCurrent) {
                for (i in that.settings.levels) {

                    level = that.settings.levels[i];
                    if (volumesNew[level]) {
                        volumeNew = parseFloat(volumesNew[level]);
                    } else {
                        volumeNew = 0;
                    }

                    if (volumesCurrent[level]) {
                        volumeCurrent = parseFloat(volumesCurrent[level]);
                    } else {
                        volumeCurrent = 0;
                    }

                    if (true || volumeNew != volumeCurrent) {
                        width = volumeNew / that.options.maxAnalyseVolume * that.defaults.analyzeChartSettings.width;
                        yLine = that.options.dataChartBottom - parseInt(i) / (that.settings.levels.length - 1) * that.options.dataChartHeight;

                        line = that.data.analyse.volumes[level];

                        line.plot([[that.defaults.analyzeChartSettings.leftPadding, yLine], [that.defaults.analyzeChartSettings.leftPadding + width, yLine]]);
                    }
                }

                that.options.analyseVolumes = volumesNew;
            }
        };

        this._drawScroll = function() {

            var xCenter = that.options.xScale * (that.options.scrollCandles * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnWidth / 2 + that.defaults.dataChartSettings.columnSpaceWidth),
                dividerTime = new Date(parseInt(that.settings.data[that.options.scrollCandles].timestamp) * 1000),
                dividerTimeString = that._prependZero(dividerTime.getHours()) + ':' + that._prependZero(dividerTime.getMinutes());

            if (that.settings.showScrollDate) {
                dividerTimeString += ', '+dividerTime.getDate().toString() + ' ' + that.defaults.months[dividerTime.getMonth()] + ' ' + dividerTime.getFullYear().toString();
            }

            that.data.scroll.axis = that._drawLine(that.options.dataChartLeft, (that.options.scrollBottom + that.options.scrollTop) / 2, that.options.dataChartRight, (that.options.scrollBottom + that.options.scrollTop) / 2, that.defaults.scrollSettings.draggerColorStroke);
            that.data.scroll.divider = that._drawLine(that.options.dataChartLeft + xCenter, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerShift, that.options.dataChartLeft + xCenter, that.options.scrollBottom, that.defaults.scrollSettings.draggerColorDivider);
            that.data.scroll.dividerText = that._drawText(that.options.dataChartLeft + xCenter, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerTextVerticalShift, dividerTimeString, 'middle', 'middle').font({fill: that.defaults.scrollSettings.draggerTextColor});
            that.data.scroll.dragger = that.options.svg.image(that.settings.rulerUrl, that.defaults.scrollSettings.draggerRulerWidth, that.defaults.scrollSettings.draggerRulerHeight).x(that.options.dataChartLeft + xCenter - that.defaults.scrollSettings.draggerRulerWidth / 2).y(that.options.scrollTop + that.options.scrollHeight / 2 -  that.defaults.scrollSettings.draggerRulerHeight / 2).front();
            $(that.data.scroll.dragger.node).css({'cursor': 'col-resize'});

            var lastValue = typeof that.settings.data[that.options.scrollCandles] == 'undefined' ? that.options.lastValue : parseFloat(that.settings.data[that.options.scrollCandles].close),
                yLine = that.options.dataChartBottom - ((lastValue - that.options.dataChartMinValue) / (that.options.dataChartMaxValue - that.options.dataChartMinValue) * that.options.dataChartHeight);

            that.data.scroll.lastValueLine = that._drawLine(that.defaults.analyzeChartSettings.leftPadding - that.defaults.dataChartSettings.horizontalShift, yLine, that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, yLine, that.defaults.scrollSettings.draggerColor).attr({'stroke-dasharray': '3,2'}).front();

            that.data.scroll.lastValueRightText = that._drawVerticalLabel(that.options.dataChartRight + that.defaults.dataChartSettings.horizontalTextShift, yLine, lastValue).font({fill: that.defaults.scrollSettings.draggerTextColor});
            that.data.scroll.lastValueLeftText = that._drawVerticalAnalyseLabel(that.defaults.analyzeChartSettings.leftPadding - that.defaults.dataChartSettings.horizontalTextShift, yLine, lastValue).font({fill: that.defaults.scrollSettings.draggerTextColor});

            var width = $(that.data.scroll.lastValueRightText.node).width(), height = that.defaults.scrollSettings.draggerRectHeight, additionalWidth = that.defaults.scrollSettings.draggerRectAdditionalWidth;
            that.data.scroll.lastValueRightRect = that._drawRect(that.options.dataChartRight + that.defaults.dataChartSettings.horizontalTextShift - additionalWidth / 2, yLine - height / 2, width + additionalWidth, height, that.defaults.scrollSettings.draggerColor, 'none', true, {rx: 2, ry: 2});
            that.data.scroll.lastValueLeftRect = that._drawRect(that.defaults.analyzeChartSettings.leftPadding - that.defaults.dataChartSettings.horizontalTextShift - additionalWidth / 2 - width, yLine - height / 2, width + additionalWidth, height, that.defaults.scrollSettings.draggerColor, 'none', true, {rx: 2, ry: 2});

            var dividerTextWidth = $(that.data.scroll.dividerText.node).width();
            that.data.scroll.dividerRect = that._drawRect(that.options.dataChartLeft + xCenter - dividerTextWidth / 2 - additionalWidth / 2, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerTextVerticalShift + 3, dividerTextWidth + additionalWidth, height - 2, that.defaults.scrollSettings.draggerColor, 'none', true, {rx: 2, ry: 2});

            that.options.lastValue = lastValue;

            that._setScrollEvents();
        };

        this._setScrollEvents = function() {
            that.options.svg.mousedown(function(event) {
                if (that.options.mode == 'scroll') {
                    $(window).on('mousemove.'+that.defaults.eventClass, function(event) {
                        // вычисляем левое положение драггера
                        var xCenter = Math.min(Math.max(event.pageX - that.options.chartOffsetX - that.options.scrollDraggerOffsetX - that.options.dataChartLeft, 0), that.options.dataChartWidth),
                            scrollCandles = Math.min(Math.max(Math.round((xCenter / that.options.xScale - (that.defaults.dataChartSettings.columnWidth / 2 + that.defaults.dataChartSettings.columnSpaceWidth)) / (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth)), 0), that.settings.data.length - 1);

                        that._shiftScroll(scrollCandles);
                    });
                    $(window).on('mouseup.'+that.defaults.eventClass, function() {
                        $(window).off('.'+that.defaults.eventClass);
                    });

                    var xCenter = that.options.xScale * (that.options.scrollCandles * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnWidth / 2 + that.defaults.dataChartSettings.columnSpaceWidth);

                    that.options.scrollDraggerOffsetX = event.offsetX - (xCenter + that.options.dataChartLeft);
                }

                if (that.options.mode == 'screenshot') {
                    $(window).on('mousemove.'+that.defaults.eventClass, function(event) {
                        var viewerOffsetX = Math.min(Math.max(event.pageX - that.options.chartOffsetX, 0), that.settings.width),
                            viewerOffsetY = Math.min(Math.max(event.pageY - that.options.chartOffsetY, 0), that.settings.height);

                        if (!that.options.viewerRect) {
                            that.options.viewerRect = that._drawRect(Math.min(that.options.viewerOffsetX, viewerOffsetX), Math.min(that.options.viewerOffsetY, viewerOffsetY), Math.abs(that.options.viewerOffsetX - viewerOffsetX), Math.abs(that.options.viewerOffsetY - viewerOffsetY), 'none', '#000', false, {'stroke-width' : '1', 'stroke-dasharray': '5,2'});
                        } else {
                            that.options.viewerRect
                                .move(Math.min(that.options.viewerOffsetX, viewerOffsetX), Math.min(that.options.viewerOffsetY, viewerOffsetY))
                                .size(Math.abs(that.options.viewerOffsetX - viewerOffsetX), Math.abs(that.options.viewerOffsetY - viewerOffsetY));
                        }
                    });
                    $(window).on('mouseup.'+that.defaults.eventClass, function(event) {
                        var viewerOffsetX = Math.min(Math.max(event.pageX - that.options.chartOffsetX, 0), that.settings.width),
                            viewerOffsetY = Math.min(Math.max(event.pageY - that.options.chartOffsetY, 0), that.settings.height);

                        $(window).off('.'+that.defaults.eventClass);

                        if (that.options.viewerRect) {
                            that.options.viewerRect.remove();
                            that.options.viewerRect = null;
                        }

                        that._viewer(Math.min(that.options.viewerOffsetX, viewerOffsetX), Math.min(that.options.viewerOffsetY, viewerOffsetY), Math.abs(that.options.viewerOffsetX - viewerOffsetX), Math.abs(that.options.viewerOffsetY - viewerOffsetY), that.settings.width, that.settings.height);
                    });

                    that.options.viewerOffsetX = event.offsetX;
                    that.options.viewerOffsetY = event.offsetY;
                }
            });
        };

        this.setMode = function(mode) {
            that.options.mode = mode;

            if (mode == 'screenshot') {
                that.options.$chart.css('cursor', 'crosshair');
            } else {
                that.options.$chart.css('cursor', 'default');
            }
        };

        this._shiftScroll = function(scrollCandles, onStart, onComplete) {

            if (typeof onStart != 'undefined' && $.isFunction(onStart)) onStart();

            if (scrollCandles != that.options.scrollCandles && typeof that.settings.data[scrollCandles] != 'undefined') {

                var dividerTime = new Date(parseInt(that.settings.data[scrollCandles].timestamp) * 1000),
                    dividerTimeString = that._prependZero(dividerTime.getHours()) + ':' + that._prependZero(dividerTime.getMinutes());

                if (that.settings.showScrollDate) {
                    dividerTimeString += ', '+dividerTime.getDate().toString() + ' ' + that.defaults.months[dividerTime.getMonth()] + ' ' + dividerTime.getFullYear().toString();
                }

                that._updateScroll(scrollCandles, that.options.scrollCandles);

                xCenter = that.options.xScale * (scrollCandles * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnWidth / 2 + that.defaults.dataChartSettings.columnSpaceWidth);
                that.data.scroll.dragger.x(that.options.dataChartLeft + xCenter - that.defaults.scrollSettings.draggerRulerWidth / 2).y(that.options.scrollTop + that.options.scrollHeight / 2 -  that.defaults.scrollSettings.draggerRulerHeight / 2);
                that.data.scroll.divider.plot([[that.options.dataChartLeft + xCenter, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerShift], [that.options.dataChartLeft + xCenter, that.options.scrollBottom]]);
                that.data.scroll.dividerText.transform({x: that.options.dataChartLeft + xCenter}).text(dividerTimeString);

                var timestamp = that.settings.data[scrollCandles].timestamp.toString();
                that._redrawAnalyseVolumes(timestamp);
                that.options.analyseTimestamp = timestamp;

                var lastValue = parseFloat(that.settings.data[scrollCandles].close),
                    yLine = that.options.dataChartBottom - ((lastValue - that.options.dataChartMinValue) / (that.options.dataChartMaxValue - that.options.dataChartMinValue) * that.options.dataChartHeight);

                that.data.scroll.lastValueLine.plot([[that.defaults.analyzeChartSettings.leftPadding - that.defaults.dataChartSettings.horizontalShift, yLine], [that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, yLine]]);
                that.data.scroll.lastValueRightText.text(that._prepareNumberToLabel(lastValue, that.options.verticalAxisLabelDataInterval)).transform({y: yLine - that.defaults.textSize * 0.9});
                that.data.scroll.lastValueLeftText.text(that._prepareNumberToLabel(lastValue, that.options.verticalAxisLabelDataInterval)).transform({y: yLine - that.defaults.textSize * 0.9});;

                that.options.lastValue = lastValue;

                var width = $(that.data.scroll.lastValueRightText.node).width(), height = that.defaults.scrollSettings.draggerRectHeight, additionalWidth = that.defaults.scrollSettings.draggerRectAdditionalWidth;
                that.data.scroll.lastValueRightRect.attr({
                    x: that.options.dataChartRight + that.defaults.dataChartSettings.horizontalTextShift - additionalWidth / 2,
                    y: yLine - height / 2,
                    width: width + additionalWidth
                });
                that.data.scroll.lastValueLeftRect.attr({
                    x: that.defaults.analyzeChartSettings.leftPadding - that.defaults.dataChartSettings.horizontalTextShift - additionalWidth / 2 - width,
                    y: yLine - height / 2,
                    width: width + additionalWidth
                });

                var dividerTextWidth = $(that.data.scroll.dividerText.node).width();
                that.data.scroll.dividerRect.attr({
                    x: that.options.dataChartLeft + xCenter - dividerTextWidth / 2 - additionalWidth / 2,
                    y: that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerTextVerticalShift + 3,
                    width: dividerTextWidth + additionalWidth
                });
            }

            if (typeof onComplete != 'undefined' && $.isFunction(onComplete)) onComplete();
        };

        this._drawVolumesAxis = function() {
            var labelTop = {}, labelBottom = {};

            labelTop.line = that._drawLine(that.options.dataChartLeft, that.options.volumeChartTop, that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, that.options.volumeChartTop, that.defaults.lineColor).back();
            labelTop.text = that._drawVerticalLabel(that.options.dataChartRight + that.defaults.dataChartSettings.horizontalTextShift, that.options.volumeChartTop, that.options.volumeChartMaxValue);

            labelBottom.line = that._drawLine(that.options.dataChartLeft, that.options.volumeChartBottom, that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, that.options.volumeChartBottom, that.defaults.lineColor).back();
            labelBottom.text = that._drawVerticalLabel(that.options.dataChartRight + that.defaults.dataChartSettings.horizontalTextShift, that.options.volumeChartBottom, 0);

            that.data.volumeAxis.max = labelTop;
            that.data.volumeAxis.min = labelBottom;
        };

        this._drawVolumes = function() {

            var volumesSet = that.options.svg.set();
            
            that.data.volumesGroup = that.options.svg.group();
            that.data.volumesGroupMask = that.options.svg.mask();
            that.data.volumesGroupMaskRect = that.options.svg.rect(1, 1).attr({fill: '#fff'});
            that.data.volumesGroupMask.add(that.data.volumesGroupMaskRect);
            that.data.volumesGroup.maskWith(that.data.volumesGroupMask);

            for (var dataCounter in that.settings.data) {
                var counter = dataCounter,
                    value = that.settings.data[dataCounter],
                    volume = that._drawVolume(value, counter);

                that.data.volumes[dataCounter] = volume;
                that.data.volumesGroup.add(volume.rect);

                if (dataCounter >= that.settings.dataStartIndex && dataCounter <= that.settings.dataEndIndex) {
                    if (dataCounter <= that.options.scrollCandles) {
                        volumesSet.add(volume.rect);
                    } else {
                        that._hideVolume(dataCounter);
                    }
                }
            }

            that._updateVolumes(that.settings.dataStartIndex, that.settings.dataEndIndex, false);

            volumesSet.opacity(0).animate(that.defaults.animateOpacityTime).opacity(1).after(function() {
                volumesSet.clear();
            });
        };


        this._drawVolume = function(value, counter, needAnimate) {
            var colorFill = that.defaults.volumeChartSettings.colorFill,
                colorStroke = that.defaults.volumeChartSettings.colorStroke,

                xLeft = parseInt(counter) * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnSpaceWidth,
                xRight = parseInt(counter) * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth,

                yVolume = value.volume;

            if (typeof needAnimate == 'undefined') {
                needAnimate = false;
            }

            var rect = that.options.svg.rect(xRight - xLeft, yVolume).x(xLeft).y(-yVolume).fill(colorFill).stroke({width: 0, color: 'none'});

            return {rect: rect};
        };

        this._calculateDataTypes = function() {
            that.options.showAxisTime = true;
            that.options.showAxisDate = true;
            that.options.showAxisMonth = true;
            that.options.showAxisYear = true;

            that.options.dataTime = 0;
            if (that.defaults.dataTypes.indexOf(that.settings.dataType) != -1) {
                that.options.dataTime = that.defaults.dataTypesTime[that.settings.dataType];
            }

            if (that.options.dataTime > that.defaults.dataTypesTime['4H']) {
                that.options.showAxisTime = false;
            }

            if (that.options.dataTime >= that.defaults.dataTypesTime['1MON']) {
                that.options.showAxisDate = false;
            }

            if (!that.settings.showAdditionalAxisLabels) {
                that.options.showAxisDate = false;
                that.options.showAxisMonth = false;
                that.options.showAxisYear = false;
            }
        };

        this._calculateDataIntervals = function() {

            that.settings.dataStartIndex = 0;
            that.settings.dataEndIndex = this.settings.data.length - 1;

            // количество отображаемых значений
            that.options.dataCount = that.settings.dataEndIndex - that.settings.dataStartIndex + 1;
        };

        this._calculateParameters = function() {

            that._calculateIntervals();

            // область отрисовки графиков
            that.options.dataChartLeft = that.defaults.dataChartSettings.leftPadding;
            that.options.dataChartTop = that.defaults.dataChartSettings.topPadding;
            that.options.dataChartWidth =  that.settings.width - (that.defaults.dataChartSettings.rightPadding + that.defaults.dataChartSettings.leftPadding)
            that.options.dataChartHeight =  that.settings.height -
                (
                    that.defaults.dataChartSettings.bottomPadding + that.defaults.dataChartSettings.topPadding +
                    that.defaults.volumeChartSettings.height + that.defaults.volumeChartSettings.bottomPadding + that.defaults.volumeChartSettings.topPadding +
                    that.defaults.additionalChartSettings.height + that.defaults.additionalChartSettings.bottomPadding + that.defaults.additionalChartSettings.topPadding +
                    that.defaults.scrollSettings.height + that.defaults.scrollSettings.bottomPadding + that.defaults.scrollSettings.topPadding
                );

            that.options.dataChartBottom = that.options.dataChartTop + that.options.dataChartHeight;
            that.options.dataChartRight = that.options.dataChartLeft + that.options.dataChartWidth;

            that.options.volumeChartTop = that.defaults.dataChartSettings.topPadding + that.defaults.dataChartSettings.bottomPadding + that.options.dataChartHeight + that.defaults.volumeChartSettings.topPadding;
            that.options.volumeChartHeight = that.defaults.volumeChartSettings.height;
            that.options.volumeChartBottom = that.options.volumeChartTop + that.options.volumeChartHeight;

            that.options.scrollTop = that.options.volumeChartBottom + that.defaults.volumeChartSettings.bottomPadding + that.defaults.additionalChartSettings.height + that.defaults.additionalChartSettings.topPadding + that.defaults.additionalChartSettings.bottomPadding + that.defaults.scrollSettings.topPadding;
            that.options.scrollHeight = that.defaults.scrollSettings.height;
            that.options.scrollBottom = that.options.scrollTop + that.options.scrollHeight;

            that._calculateScrollCandles();
            that._calculateChartIntervals();
        };

        this._calculateIntervals = function() {

            var value;

            // минимальные и максимальные значения
            that.options.maxValue = null;
            that.options.minValue = null;
            that.options.maxVolume = null;

            for (var dataIndex = 0; dataIndex < that.settings.data.length; dataIndex++) {
                value = that.settings.data[dataIndex];

                that.options.maxValue = that.options.maxValue === null ? parseFloat(value.high) : Math.max(that.options.maxValue, parseFloat(value.high));
                that.options.minValue = that.options.minValue === null ? parseFloat(value.low) : Math.min(that.options.minValue, parseFloat(value.low));
                that.options.maxVolume = that.options.maxVolume === null ? parseFloat(value.volume) : Math.max(that.options.maxVolume, parseFloat(value.volume));
            }
        };

        this._calculateScrollCandles = function() {
            that.options.scrollCandles = typeof that.options.scrollCandles == 'undefined' || that.options.scrollCandles == null ? that.settings.data.length - 1 : that.options.scrollCandles;
        };

        this._calculateChartIntervals = function(calculateVertical, calculateHorizontal, calculateVolume, calculateScrollAxisInterval, dataCount) {
            if (typeof calculateVertical == 'undefined') {
                calculateVertical = true;
            }
            if (typeof calculateHorizontal == 'undefined') {
                calculateHorizontal = true;
            }
            if (typeof calculateVolume == 'undefined') {
                calculateVolume = true;
            }
            if (typeof calculateScrollAxisInterval == 'undefined') {
                calculateScrollAxisInterval = true;
            }
            if (typeof dataCount == 'undefined') {
                dataCount = that.options.dataCount;
            }

            if (calculateVertical) {
                // Вертикальные интервалы
                // сколько примерно значений в одном делении
                var dataChartIntervalValue = (that.options.maxValue - that.options.minValue) / that.options.dataChartHeight * that.defaults.verticalFieldsSize;

                // подбираем шкалу
                that.options.dataChartIntervalValue = Math.floor(Math.log(dataChartIntervalValue) / Math.log(10)); // порядок
                // размер интервалов
                that.options.verticalAxisLabelDataInterval = _(that.defaults.verticalAxisIntervals).first() * Math.pow(10, that.options.dataChartIntervalValue);
                for (i in that.defaults.verticalAxisIntervals) {
                    var nextIndex = parseInt(i) + 1,
                        previousIndex = parseInt(i) - 1,
                        previousValue = (previousIndex in that.defaults.verticalAxisIntervals ? (that.defaults.verticalAxisIntervals[previousIndex] + that.defaults.verticalAxisIntervals[i]) / 2 : that.defaults.verticalAxisIntervals[i]) * Math.pow(10, that.options.dataChartIntervalValue),
                        nextValue = (nextIndex in that.defaults.verticalAxisIntervals ? (that.defaults.verticalAxisIntervals[nextIndex] + that.defaults.verticalAxisIntervals[i]) / 2 : that.defaults.verticalAxisIntervals[i]) * Math.pow(10, that.options.dataChartIntervalValue);

                    if (dataChartIntervalValue >= previousValue && dataChartIntervalValue <= nextValue) {
                        that.options.verticalAxisLabelDataInterval = that.defaults.verticalAxisIntervals[i] * Math.pow(10, that.options.dataChartIntervalValue);
                        break;
                    }
                }

                that.options.dataChartMinValue = Math.max(Math.floor(that.options.minValue / Math.pow(10, that.options.dataChartIntervalValue)) * Math.pow(10, that.options.dataChartIntervalValue) /*- that.options.verticalAxisLabelDataInterval / 4*/, 0);
                that.options.dataChartMaxValue = Math.ceil(that.options.maxValue / Math.pow(10, that.options.dataChartIntervalValue)) * Math.pow(10, that.options.dataChartIntervalValue) /*+ that.options.verticalAxisLabelDataInterval / 4*/;
            }

            if (calculateHorizontal) {
                // Горизонтальные
                // вычисляем сколько и где будут подписи по горизонтали
                that.options.horizontalAxisLabelInterval = Math.floor(Math.floor(that.options.dataCount / (that.options.dataChartWidth / ((that.defaults.horizontalFiledsSizeMin + that.defaults.horizontalFiledsSizeMax) / 2))) / 2) * 2;

                if (that.settings.dataType == '1M') {
                    that.options.horizontalAxisLabelInterval = Math.round(that.options.horizontalAxisLabelInterval / 15) * 15;
                }
            }

            if (calculateVolume) {
                var volumeIntervalPower = Math.floor(Math.log(that.options.maxVolume) / Math.log(10)) - 1;
                that.options.volumeChartMaxValue = Math.ceil(that.options.maxVolume / Math.pow(10, volumeIntervalPower)) * Math.pow(10, volumeIntervalPower);
            }

            // xScale, yScale and etc.
            that.options.maskWidth = dataCount * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth);
            that.options.xScale = that.options.dataChartWidth / that.options.maskWidth;

            //that.options.scrollInterval = Math.round(that.options.scrollCandlesCount / that.defaults.scrollSettings.intervalsCount / 5) * 5;
        };

        this._drawVerticalAxis = function() {

            // вертикальная линия
            //that._drawLine(that.options.dataChartRight, that.options.dataChartTop, that.options.dataChartRight, that.options.dataChartBottom + 1, this.defaults.lineColor);

            var labels = that._getVerticalAxisLabels();
            that._drawVerticalAxisLabels(labels);

            that.options.verticalLabels = labels;
        };

        this._getVerticalAxisLabels = function() {
            var valueLine = that.options.dataChartMinValue,
                yLine = null,
                labels = [];

            // Вычисляем начальное значение
            var currentValue = Math.ceil(that.options.dataChartMinValue / that.options.verticalAxisLabelDataInterval) * that.options.verticalAxisLabelDataInterval;

            // если первая метка далека от начала, рисуем начало
            if (currentValue > that.options.dataChartMinValue + that.options.verticalAxisLabelDataInterval * 0.5) {
                valueLine = that.options.dataChartMinValue;
                yLine = that._valueToY(valueLine);

                labels.push({y: yLine, value: valueLine});
            }

            while (currentValue < that.options.dataChartMaxValue + that.options.verticalAxisLabelDataInterval * 0.5) {

                valueLine = currentValue;

                // слишком близко к горизонтальной линии не будем рисовать, сразу последнее значение нарисуем
                if ((that.options.dataChartMaxValue - currentValue) < that.options.verticalAxisLabelDataInterval / 4 || currentValue >= that.options.dataChartMaxValue) {
                    valueLine = that.options.dataChartMaxValue;
                }

                yLine = that._valueToY(valueLine);

                labels.push({y: yLine, value: valueLine});

                currentValue += that.options.verticalAxisLabelDataInterval;
            }

            return labels;
        };

        this._drawVerticalAxisLabels = function(labels) {
            if (labels.length > 0) {
                for (i in labels) {
                    var yLine = labels[i].y,
                        valueLine = labels[i].value,
                        label = {};

                    label.line = that._drawLine(that.options.dataChartLeft, yLine + that.options.dataChartTop, that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, yLine + that.options.dataChartTop, that.defaults.lineColor).back();
                    label.text = that._drawVerticalLabel(that.options.dataChartRight + that.defaults.dataChartSettings.horizontalTextShift, yLine + that.options.dataChartTop, valueLine);

                    that.data.verticalAxis.push(label);
                }
            }
        };

        this._redrawVerticalAxisLabels = function(labels) {
            var i = 0, yLine, valueLine, text, line, label, axis;
            if (labels.length > 0) {
                while (i in labels) {
                    yLine = labels[i].y;
                    valueLine = labels[i].value;

                    if (i in that.data.verticalAxis) {
                        text = 'target' in that.data.verticalAxis[i].text ? that.data.verticalAxis[i].text.target : that.data.verticalAxis[i].text,
                        line = 'target' in that.data.verticalAxis[i].line ? that.data.verticalAxis[i].line.target : that.data.verticalAxis[i].line;
                    }

                    if (i in that.options.verticalLabels && i in that.data.verticalAxis) {
                        if (valueLine != that.options.verticalLabels[i].value) {
                            text.text(that._prepareNumberToLabel(valueLine, that.options.verticalAxisLabelDataInterval));
                        }

                        if (yLine != that.options.verticalLabels[i].y) {
                            line.plot([[that.options.dataChartLeft, yLine + that.options.dataChartTop], [that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, yLine + that.options.dataChartTop]]);
                            text.transform({y: yLine + that.options.dataChartTop - that.defaults.textSize * 0.9});
                        }
                    } else {
                        if (i in that.data.verticalAxis) {
                            text.text(that._prepareNumberToLabel(valueLine, that.options.verticalAxisLabelDataInterval));
                            line.plot([[that.options.dataChartLeft, yLine + that.options.dataChartTop], [that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, yLine + that.options.dataChartTop]]);
                            text.transform({y: yLine + that.options.dataChartTop - that.defaults.textSize * 0.9});

                        } else {
                            // добавляем
                            var label = {};
                            label.line = that._drawLine(that.options.dataChartLeft, yLine + that.options.dataChartTop, that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, yLine + that.options.dataChartTop, that.defaults.lineColor, null, false).back();
                            label.text = that._drawVerticalLabel(that.options.dataChartRight + that.defaults.dataChartSettings.horizontalTextShift, yLine + that.options.dataChartTop, valueLine, false);
                            that.data.verticalAxis.push(label);
                        }
                    }
                    i++;
                }


                // удаляем лишние
                while (i in that.data.verticalAxis) {

                    axis = that.data.verticalAxis[i];
                    line = axis.line;
                    text = axis.text;

                    line.remove();
                    text.remove();

                    that.data.verticalAxis.splice(i, 1);
                };
            }
        };

        this._calculateHorizontalAxisXByCounter = function(counter) {
            return that.options.dataChartLeft + (parseInt(counter) * (that.defaults.dataChartSettings.columnWidth+ that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnWidth/ 2 + that.defaults.dataChartSettings.columnSpaceWidth) * that.options.xScale;
        }

        this._calculateHorizontalDividerXByCounter = function(counter) {
            return that.options.dataChartLeft + (parseInt(counter) * (that.defaults.dataChartSettings.columnWidth+ that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnSpaceWidth / 2) * that.options.xScale;
        }

        this._drawHorizontalAxisLabels = function(labelRangeIndexes, dataStartIndex, needAnimate) {

            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }

            var counter, value, date, x;

            for (var dataCounterIndex in labelRangeIndexes) {

                if (!(labelRangeIndexes[dataCounterIndex] in that.settings.data)) {
                    continue;
                }

                counter = labelRangeIndexes[dataCounterIndex] - dataStartIndex;
                value = that.settings.data[labelRangeIndexes[dataCounterIndex]];
                date = new Date(parseInt(value.timestamp) * 1000);

                x = that._calculateHorizontalAxisXByCounter(counter);

                that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]] = {};
                that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]].text = that._drawHorizontalLabel(x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalTextShift, date, true, true, true, needAnimate);
                that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]].line = that._drawLine(x, that.options.volumeChartBottom, x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalShiftBig, that.defaults.lineColor, null, needAnimate).back();
            }
        };

        this._drawHorizontalAxis = function(dataStartIndex, dataEndIndex, needDrawLine, needAnimate) {

            if (typeof needDrawLine == 'undefined') {
                needDrawLine = true;
            }
            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }
            if (typeof dataStartIndex == 'undefined') {
                dataStartIndex = that.settings.dataStartIndex;
            }
            if (typeof dataEndIndex == 'undefined') {
                dataEndIndex = that.settings.dataEndIndex;
            }

            if (needDrawLine) {
                // линия
                that.data.horizontalAxis.line = that._drawLine(that.options.dataChartLeft, that.options.volumeChartBottom, that.options.dataChartRight, that.options.volumeChartBottom, this.defaults.lineColor);
            }

            var labelStartIndex = Math.ceil(dataStartIndex / that.options.horizontalAxisLabelInterval) * that.options.horizontalAxisLabelInterval,
                labelEndIndex = Math.floor(dataEndIndex / that.options.horizontalAxisLabelInterval) * that.options.horizontalAxisLabelInterval;

            that.options.labelRangeIndexes = _.range(labelStartIndex, labelEndIndex + that.options.horizontalAxisLabelInterval, that.options.horizontalAxisLabelInterval);
            that._drawHorizontalAxisLabels(that.options.labelRangeIndexes, dataStartIndex, needAnimate);
        };

        this._drawDaysDividers = function() {
            if (that.settings.showDaysDividers) {
                var currentDay = null, dataCounter, day;
                for (dataCounter in that.settings.data) {
                    day = new Date(parseInt(that.settings.data[dataCounter].timestamp) * 1000);
                    day.setHours(0), day.setMinutes(0), day.setSeconds(0), day.setMilliseconds(0);

                    if (currentDay === null || currentDay.getTime() != day.getTime()) {
                        that._drawDayDivider(dataCounter, day);
                        currentDay = day;
                    }
                }
            }
        };

        this._drawDayDivider = function(dataCounter, day) {
            var dayTimeString = day.getDate().toString() + ' ' + that.defaults.months[day.getMonth()] + ' ' + day.getFullYear().toString(),
                divider = {},
                xLine = that._calculateHorizontalDividerXByCounter(dataCounter);

            divider.line = that._drawLine(xLine, that.options.dataChartTop - that.defaults.dataChartSettings.daysDividersVerticalShiftTop, xLine, that.options.volumeChartBottom + that.defaults.dataChartSettings.daysDividersVerticalShiftBottom, that.defaults.lineColor).attr({'stroke-dasharray': '3,2'}).back();
            divider.text = that._drawText(xLine + that.defaults.dataChartSettings.daysDividersTextVerticalShiftRight, that.options.dataChartTop - that.defaults.dataChartSettings.daysDividersTextVerticalShiftTop, dayTimeString, 'middle', 'start', true);

            that.data.daysDividers[dataCounter] = divider;
        };

        this._prepareNumber = function(number) {
            return number.toFixed(2);
        };

        this._prepareNumberToLabel = function(number, interval) {
            var power = Math.abs(Math.min((Math.log(interval) / Math.log(10)) - 1, 0));
            return number.toFixed(power);
        };

        this._drawLine = function(xStart, yStart, xEnd, yEnd, color, additionalAttributes, needAnimate) {

            var line = that.options.svg.polyline([[xStart, yStart], [xEnd, yEnd]]).attr({fill : 'none', stroke: color, 'stroke-width': '1'});

            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }

            if (additionalAttributes) {
                line.attr(additionalAttributes);
            }

            if (needAnimate) {
                line.opacity(0).animate(that.defaults.animateOpacityTime).opacity(1);
            }

            return line;
        };

        this._drawPath = function(xStart, yStart, xEnd, yEnd, color, additionalAttributes, needAnimate) {

            var path = that.options.svg.path(that._getPathString(xStart, yStart, xEnd, yEnd)).attr({fill : 'none', stroke: color, 'stroke-width': '5'});

            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }

            if (additionalAttributes) {
                path.attr(additionalAttributes);
            }

            if (needAnimate) {
                path.opacity(0).animate(that.defaults.animateOpacityTime).opacity(1);
            }

            return path;
        };

        this._drawRect = function(x, y, width, height, colorFill, colorStroke, needAnimate, additionalAttributes) {
            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }

            var rect = that.options.svg.rect(that._prepareNumber(width), that._prepareNumber(height)).attr({fill: colorFill, stroke: colorStroke, x: that._prepareNumber(x), y: that._prepareNumber(y)});

            if (additionalAttributes) {
                rect.attr(additionalAttributes);
            }

            if (needAnimate) {
                rect.opacity(0).animate(that.defaults.animateOpacityTime).opacity(1);
            }

            return rect;
        };

        this._drawText = function(x, y, text, type, anchor, needAnimate) {
            var textAttr = that.options.textAttr;
            if (type == 'small') {
                textAttr = that.options.textAttrSmall;
            } else if (type == 'middle') {
                textAttr = that.options.textAttrMiddle;
            }
            textAttr['anchor'] = anchor ? anchor : 'start';

            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }

            var textBox = that.options.svg.text(text).font(textAttr).transform({x: x, y: y});

            if (needAnimate) {
                textBox.opacity(0).animate(that.defaults.animateOpacityTime).opacity(1);
            }

            return textBox;
        }

        this._drawVerticalLabel = function(x, y, number, needAnimate) {
            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }
            return that._drawText(x, y - that.defaults.textSize * 0.9, that._prepareNumberToLabel(number, that.options.verticalAxisLabelDataInterval), 'normal', 'start', needAnimate);
        };

        this._getHorizontalLabelText = function(date, newDay, newMonth, newYear) {
            var text = {main: null, additional: null};

            if (that.options.showAxisTime) {
                text.main = that._prependZero(date.getHours()) + ':' + that._prependZero(date.getMinutes());
                if (newDay && (that.options.showAxisDate || that.options.showAxisMonth || that.options.showAxisYear)) {
                    text.additional = date.getDate().toString() + ' ' + that.defaults.months[date.getMonth()] + ' ' + date.getFullYear().toString();
                }
            } else if (that.options.showAxisDate) {
                text.main = date.getDate().toString() + ' ' + that.defaults.months[date.getMonth()];
                if (newYear) {
                    text.additional = date.getFullYear().toString();
                }
            } else if (that.options.showAxisMonth) {
                text.main = that.defaults.months[date.getMonth()] + ' ' + date.getFullYear().toString();
            }

            return text;
        };

        this._drawHorizontalLabel = function(x, y, date, isNewDay, isNewMonth, isNewYear, needAnimate) {

            var dateText = that._getHorizontalLabelText(date, isNewDay, isNewMonth, isNewYear),
                text = {main: null, additional: null};

            if (typeof needAnimate == 'undefined') {
                needAnimate = true;
            }

            text.main = that._drawText(x, y, dateText.main, 'normal', 'middle', needAnimate);
            if (dateText.additional) {
                text.additional = that._drawText(x, y + that.defaults.textSizeSmall + that.defaults.dataChartSettings.verticalTextShiftAdditional, dateText.additional, 'small', 'middle', needAnimate);
            }

            return text;
        };

        this._prependZero = function(number) {
            if (parseInt(number) < 10) {
                return '0' + number.toString();
            }
            return number.toString();
        };

        this._getPathString = function(xStart, yStart, xEnd, yEnd) {
            return "M"+that._prepareNumber(xStart)+","+that._prepareNumber(yStart)+"L"+that._prepareNumber(xEnd)+","+that._prepareNumber(yEnd);
        };

        this._drawCandle = function(value, counter, needAnimate) {
            var colorFill = parseFloat(value.open) > parseFloat(value.close) ? that.defaults.dataChartSettings.candles.downColor : that.defaults.dataChartSettings.candles.upColor,
                colorStroke = parseFloat(value.open) > parseFloat(value.close) ? that.defaults.dataChartSettings.candles.downColorBorder : that.defaults.dataChartSettings.candles.upColorBorder,

                xCenter = parseInt(counter) * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnWidth / 2 + that.defaults.dataChartSettings.columnSpaceWidth,
                xLeft = parseInt(counter) * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnSpaceWidth,
                xRight = parseInt(counter) * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth,

                yHigh = parseFloat(value.high),
                yLow = parseFloat(value.low),
                yMin = Math.min(parseFloat(value.close), parseFloat(value.open)),
                yMax = Math.max(parseFloat(value.open), parseFloat(value.close));

            if (typeof needAnimate == 'undefined') {
                needAnimate = false;
            }

            var rect = that.options.svg.rect(xRight - xLeft, yMax - yMin).x(xLeft).y(-yMax).fill(colorFill).stroke({width: 0, color: 'none'}),
                line = that.options.svg.line(xCenter, -yHigh, xCenter, -yLow).stroke({width: 1, color: colorStroke});

            return {rect: rect, line: line};
        };

        this._drawCandles = function() {

            that.options.isBusy = true;

            var candlesSet = that.options.svg.set();

            that.data.candlesGroup = that.options.svg.group();
            that.data.candlesSetLines = that.options.svg.set();
            that.data.candlesGroupMask = that.options.svg.mask();
            that.data.candlesGroupMaskRect = that.options.svg.rect(1, 1).attr({fill: '#fff'});
            that.data.candlesGroupMask.add(that.data.candlesGroupMaskRect);
            that.data.candlesGroup.maskWith(that.data.candlesGroupMask);

            for (var dataCounter in that.settings.data) {
                var counter = dataCounter,
                    value = that.settings.data[dataCounter],
                    candle = that._drawCandle(value, counter);

                that.data.candles[dataCounter] = candle;
                that.data.candlesGroup.add(candle.line).add(candle.rect);
                that.data.candlesSetLines.add(candle.line);

                if (dataCounter >= that.settings.dataStartIndex && dataCounter <= that.settings.dataEndIndex) {
                    if (dataCounter <= that.options.scrollCandles) {
                        candlesSet.add(candle.line).add(candle.rect);
                    } else {
                        that._hideCandle(dataCounter);
                    }
                }
            }

            this._updateCandles(that.settings.dataStartIndex, that.settings.dataEndIndex, true, true, false);

            candlesSet.opacity(0).animate(that.defaults.animateOpacityTime).opacity(1).after(function() {
                candlesSet.clear();
                that.options.isBusy = false;
                that._checkCallStack();
            });
        };

        this._indexToX = function(value) {
            return (that.options.dataChartWidth - 2) / that.options.scrollCandlesCount * value + 1;
        };

        this._valueToY = function(value) {
            return Math.round((that.options.dataChartMaxValue - (parseFloat(value))) / (that.options.dataChartMaxValue - that.options.dataChartMinValue) * that.options.dataChartHeight);
        };

        this._volumeToY = function(value) {
            return Math.floor((that.options.volumeChartMaxValue - (parseFloat(value))) / (that.options.volumeChartMaxValue) * (that.options.volumeChartHeight - 2));
        };

        this._checkCallStack = function() {
            if (that.options.callStack.length > 0) {
                var stack = that.options.callStack[0];
                that.options.callStack.splice(0, 1);
                that['_' + stack['functionName']].apply(that, stack['argumentsArray']);
            }
        };

        this._checkIsBusy = function(functionName, argumentsArray, needOut) {

            if (that.options.isBusy || that.options.callStack.length > 0) {

                if (typeof needOut == 'undefined') {
                    needOut = false;
                }

                if (needOut && that.options.callStack.length > 0) {
                    var i = 0;
                    while (i in that.options.callStack) {
                        if (that.options.callStack[i].functionName == functionName) {
                            that.options.callStack.splice(i, 1);
                            continue;
                        }
                        i++;
                    }
                }

                that.options.callStack.push({
                    'functionName': functionName,
                    'argumentsArray': argumentsArray
                });

                return true;
            }
            return false;
        };

        this._removeHorizontalLabel = function(index, onComplete, needAnimate) {

            var animateTime = that.options.dataCount <= that.defaults.candlesMaxAnimateCount ? that.defaults.animateTime : (that.options.dataCount <= that.defaults.axisMaxAnimateCount ? 25 : 10);

            if (typeof needAnimate === 'undefined') {
                needAnimate = true;
            }

            if (index in that.data.horizontalAxis.labels) {

                var label = that.data.horizontalAxis.labels[index],
                    line = label.line;

                if (needAnimate) {
                    line.animate(animateTime).opacity(0).after(function() { this.remove(); });
                } else {
                    line.remove();
                }
                var text = label.text,
                    textMain = text.main,
                    textAdditional = 'additional' in text ? text.additional : null;

                if (needAnimate) {
                    textMain.animate(animateTime).opacity(0).after(function() { this.remove(); });
                    if (textAdditional) {
                        textAdditional.animate(animateTime).opacity(0).after(function() { this.remove(); });
                    }
                } else {
                    textMain.remove();
                    if (textAdditional) {
                        textAdditional.remove();
                    }
                }

                delete that.data.horizontalAxis.labels[index];
            }

            if (onComplete && $.isFunction(onComplete)) {
                setTimeout(onComplete, 5);
            }
        };

        this._hideCandle = function(index) {
            var candle = that.data.candles[index],
                line = candle.line,
                rect = candle.rect;

            line.hide(); // .opacity(0).exportAttr({opacity: 0});
            rect.hide(); // .opacity(0).exportAttr({opacity: 0});
        };

        this._showCandle = function(index) {
            var candle = that.data.candles[index],
                line = candle.line,
                rect = candle.rect;

            line.show(); // .opacity(1).exportAttr({opacity: 1});
            rect.show(); // .opacity(1).exportAttr({opacity: 1});
        };

        this._hideVolume = function(index) {
            var volume = that.data.volumes[index],
                rect = volume.rect;

            rect.hide(); // .opacity(0).exportAttr({opacity: 0});
        };

        this._showVolume = function(index) {
            var volume = that.data.volumes[index],
                rect = volume.rect;

            rect.show(); // .opacity(1).exportAttr({opacity: 1});
        };

        this._updateScroll = function(scrollCandles, scrollCandlesCurrent) {

            if (that._checkIsBusy('updateScroll', _(arguments).toArray(), true)) {
                return false;
            }

            that.options.isBusy = true;

            setTimeout(function() {

                that._updateVisibility(scrollCandles, scrollCandlesCurrent);

                that.options.scrollCandles = scrollCandles;

                setTimeout(function() {
                    that.options.isBusy = false;
                    that._checkCallStack();
                }, 5);
            }, 5);
        };

        this._updateVisibility = function(scrollCandles, scrollCandlesCurrent) {
            var counter;

            if (scrollCandles < scrollCandlesCurrent) {
                for (counter = scrollCandles + 1; counter <= scrollCandlesCurrent; counter++) {
                    that._hideCandle(counter);
                    that._hideVolume(counter);
                }
            } else if (scrollCandles > scrollCandlesCurrent) {
                for (counter = scrollCandlesCurrent + 1; counter <= scrollCandles; counter++) {
                    that._showCandle(counter);
                    that._showVolume(counter);
                }
            }
        };

        this._updateCandles = function(dataStartIndex, dataEndIndex, needRecalculateData, needChangeStrokeWidth, needAnimate) {

            var maskHeight = that.options.dataChartMaxValue,
                maskWidth = that.options.maskWidth,
                maskX = dataStartIndex * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnSpaceWidth / 2,
                xScale = that.options.xScale,
                yScale = that.options.dataChartHeight / (that.options.dataChartMaxValue - that.options.dataChartMinValue),
                xGroup = that.options.dataChartLeft - maskX * xScale,
                yGroup = that.options.dataChartTop + that.options.dataChartHeight + that.options.dataChartMinValue * yScale;

            that.data.candlesGroup.transform({
                x: xGroup,
                y: yGroup,
                scaleX: xScale,
                scaleY: yScale
            });

            that.data.candlesGroupMask.clear();
            that.data.candlesGroupMaskRect.attr({height: maskHeight, width: maskWidth, x: maskX, y: -maskHeight});
            that.data.candlesGroupMask.add(that.data.candlesGroupMaskRect);

            if (needChangeStrokeWidth) {
                that.data.candlesSetLines.attr({'stroke-width': 1 / xScale});
            }
        };

        this._updateVolumes = function(dataStartIndex, dataEndIndex, needRecalculateVolume, needAnimate) {

            var maskHeight = that.options.volumeChartMaxValue,
                maskWidth = that.options.maskWidth,
                maskX = dataStartIndex * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth) + that.defaults.dataChartSettings.columnSpaceWidth / 2,
                xScale = that.options.xScale,
                yScale = (that.options.volumeChartHeight - 2) / that.options.volumeChartMaxValue,
                xGroup = that.options.dataChartLeft - maskX * xScale,
                yGroup = that.options.volumeChartBottom - 1 * yScale;

            that.data.volumesGroup.transform({
                x: xGroup,
                y: yGroup,
                scaleX: xScale,
                scaleY: yScale
            });

            that.data.volumesGroupMask.clear();
            that.data.volumesGroupMaskRect.attr({height: maskHeight, width: maskWidth, x: maskX, y: -maskHeight});
            that.data.volumesGroupMask.add(that.data.volumesGroupMaskRect);

        };

        this.shift = function(value) {
            if (!that.options.isInited) {
                return;
            }

            var scrollCandles = Math.min(Math.max(that.options.scrollCandles + value, 0), that.settings.data.length - 1);

            that._shiftScroll(scrollCandles);
        };

        this._showOverlay = function(onComplete) {
            var overlay =
            '<div id="tradeChartOverlay" style="width: 100%; height:100%; background: #fff; position: fixed; top: 0; left: 0; z-index: 2000;">'+
            '   <div id="tradeChartViewerForm">'+
            '       <form class="form-inline" style="margin-bottom: 0;">'+
            '           <div class="btn-group"><button class="btn tradeChartViewerZoomButton" data-type="minus"><i class="icon icon-minus"></i></button><button class="btn tradeChartViewerZoomButton" data-type="plus"><i class="icon icon-plus"></i></button></div>'+
            '           <span class="pull-right"><button class="btn btn-danger" id="tradeChartViewerCloseButton">Close</button></span>'+
            '       </form>'+
            '   </div>'+
            '   <div id="tradeChartViewerContainer">'+
            '   </div>'+
            '</div>';

            that.options.$chartViewerOverLay = $(overlay).appendTo('body');
            that.options.$chartViewerContainer = that.options.$chartViewerOverLay.find('#tradeChartViewerContainer');

            var resizeWrapper = function() {
                that.options.viewerWidth = that.options.$chartViewerOverLay.width();
                that.options.viewerHeight = that.options.$chartViewerOverLay.height() - that.options.$chartViewerOverLay.find('#tradeChartViewerForm').outerHeight();

                that.options.$chartViewerContainer.height(that.options.viewerHeight).width(that.options.viewerWidth);

                if (that.options.svgViewer) {
                    that.options.svgViewer.size(that.options.viewerWidth, that.options.viewerHeight);
                }
            };

            resizeWrapper();

            $(window).on('resize.'+that.defaults.eventClass + '-overlay', resizeWrapper);

            that.options.$chartViewerOverLay.find('#tradeChartViewerCloseButton').on('click', function(event) {
                event.preventDefault();
                that._hideOverlay();
            });

            that.options.$chartViewerOverLay.find('.tradeChartViewerZoomButton').on('click', function(event) {
                event.preventDefault();
                that._hideOverlay();
            });

            $(window).on('keydown.'+that.defaults.eventClass + '-overlay', function(event) {
                // if (event.which == 13) {  }    // enter
                if (event.which == 27) {  // esc
                    event.preventDefault();
                    that._hideOverlay();
                }
            });

            if (onComplete && $.isFunction(onComplete)) {
                onComplete();
            }
        };

        this._hideOverlay = function() {
            $(document).off('.'+that.defaults.eventClass + '-overlay');
            $(window).off('.'+that.defaults.eventClass + '-overlay');

            that.options.svgViewer.clear();
            that.options.$chartViewerOverLay.remove();
            that.options.svgViewer = null;
        };

        this._viewer = function(screenX, screenY, screenWidth, screenHeight, imageWidth, imageHeight) {

            $.ajax({
                url: '/ajax/tradesSaver.php',
                type: 'post',
                dataType: 'json',
                data: {
                    needSave: '1',
                    svg: that.options.svg.exportSvg()
                },
                success: function(json) {
                    if (json.status == 'success') {

                        that._hideHint();

                        that._showOverlay(function() {
                            that.options.svgViewer = SVG('tradeChartViewerContainer').size(that.options.viewerWidth, that.options.viewerHeight);

                            var scale = 1, scaleViewer = 1;
                            if ((screenWidth / screenHeight) > (imageWidth / imageHeight)) {
                                scale = imageWidth / screenWidth;
                            } else {
                                scale = imageHeight / screenHeight;
                            }
                            if ((that.options.viewerWidth / that.options.viewerHeight) > (imageWidth / imageHeight)) {
                                scaleViewer = that.options.viewerWidth / imageWidth;
                            } else {
                                scaleViewer = that.options.viewerHeight / imageHeight;
                            }

                            that.options.svgViewer.image(json.imageUrl, imageWidth, imageHeight).transform({
                                scaleX: scale * scaleViewer,
                                scaleY: scale * scaleViewer,
                                x: -screenX * scale * scaleViewer + (that.options.viewerWidth - screenWidth * scale * scaleViewer) / 2,
                                y: -screenY * scale * scaleViewer + (that.options.viewerHeight - screenHeight * scale * scaleViewer) / 2
                            });
                        });

                    } else {
                        that._showHint(json.message, 'error');
                    }

                },
                beforeSend: function() {
                    that._showHint('Пожалуйста, подождите, идет создание скрина');
                }
            });
        };

        this._showHint = function(message, type) {
            if (typeof type == 'undefined') {
                type = 'default';
            }
            that.options.$hintContainer = $('<div id="tradeHintContainer" style="width: 100%; height:65px; background: #fff; position: fixed; bottom: 0; left: 0; z-index: 2000;"></div>').appendTo('body');
            that.options.$hintContainer.append('<div class="alert alert-'+type+'" style="margin: 0 30px;">'+message+'</div>');
        };

        this._hideHint = function() {
            that.options.$hintContainer.remove();
        };
    };



    var pluginsInit = function() {
        return new TradeChart();
    };

    $.fn.tradeChart = pluginsInit;
    $.tradeChart = pluginsInit;

})(window.jQuery);

});