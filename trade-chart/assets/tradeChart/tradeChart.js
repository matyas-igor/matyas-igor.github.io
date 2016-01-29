/**
 * Created with JetBrains PhpStorm.
 * User: Igor Matyas
 * Date: Aug/5/13
 * Time: 6:28 PM
 * To change this template use File | defaults | File Templates.
 */

(function($) {

    var TradeChart = function() {
        var that = this;

        this.settings = {
            chartId: 'chart',
            width: 1000,
            height: 700,
            data: [],
            dataType: '1M',
            dataStartTimestamp: null,
            dataEndTimestamp: null,
            dataStartIndex: null,
            dataEndIndex: null,
            candlesCount: 145
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
                leftPadding: 30,
                rightPadding: 80,
                verticalShift: 2,
                verticalShiftBig: 5,
                verticalTextShift: 5,
                verticalTextShiftAdditional: 5,
                horizontalShift: 15,
                horizontalTextShift: 20,
                candles: {
                    upColor: '#72b05f',
                    upColorBorder: '#5e8e50',
                    downColor: '#db5151',
                    downColorBorder: '#ba4646'
                },
                verticalDividerShift: 18,
                verticalDividerTextVerticalShift: 12,
                verticalDividerTextHorizontalShift: 5,

                columnWidth: 15,
                columnSpaceWidth: 3,
                additionalCandlesCount: -1
            },
            volumeChartSettings: {
                bottomPadding: 40,
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
                height: 30,
                topPadding: 0,
                bottomPadding: 40,
                backgroundColorFill: '#bbbbbb',
                backgroundColorStroke: 'none',
                draggerColorFill: 'none',
                draggerColorStroke: '#333',
                draggerWidth: 14,
                draggerHeight: 24,
                overlayOpacity: 0.7,
                candlesMinCount: 10,
                intervalsCount: 50,
                mouseWheelIntervalsCount: 22
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
            eventClassPermanent: 'tradeChartPermanent'
        };

        this.options = {
            textAttr: {size: this.defaults.textSize, family: this.defaults.textFontFamily, stroke: "none", fill: this.defaults.textColor},
            textAttrMiddle: {size: this.defaults.textSizeMiddle, family: this.defaults.textFontFamily, stroke: "none", fill: this.defaults.textColor},
            textAttrSmall: {size: this.defaults.textSizeSmall, family: this.defaults.textFontFamily, stroke: "none", fill: this.defaults.textColorAdditional},
            isBusy: false,
            callStack: []
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
            scroll: {}
        };

        this.init = function(settings) {
            $.extend(that.settings, settings);

            that._calculateDataIntervals();
            that._calculateDataTypes();

            that._calculateParameters();

            that._calculateDataTypes();

            that.options.svg = SVG(that.settings.chartId).size(that.settings.width, that.settings.height);

            that.options.$chart = $('#'+that.settings.chartId)
            that.options.$chart.css({'shape-rendering': 'crispEdges'});

            that.options.chartOffsetY = that.options.$chart.offset().top;
            that.options.chartOffsetX = that.options.$chart.offset().left;

            that.options.$chart.disableSelection();
//
//            that.options.svg.rect(that.settings.width, that.settings.height).attr({fill: '#ddd'});
//            that.options.svg.rect(that.options.dataChartWidth, that.options.dataChartHeight).x(that.options.dataChartLeft).y(that.options.dataChartTop).attr({fill: '#fff', stroke: 'none'});

            that._drawHorizontalAxis();
            that._drawVerticalAxis();
            that._drawCandles();

            that._drawVolumesAxis();
            that._drawVolumes();

            that._drawScroll();

            that._setMouseWheelEvents();

            return that;
        };

        this._setMouseWheelEvents = function() {
            $(window).on('mousewheel.' + that.defaults.eventClassPermanent, function(event) {
                if ((event.pageX - that.options.chartOffsetX) < that.settings.width && (event.pageY - that.options.chartOffsetY) < that.settings.height) {
                    var deltaX = event.originalEvent.wheelDeltaX,
                        deltaY = event.originalEvent.wheelDeltaY,
                        candlesScrollCount = Math.round(that.options.dataCount / that.defaults.scrollSettings.mouseWheelIntervalsCount),
                        candleWidth = that.options.dataChartWidth / that.options.scrollCandlesCount,
                        dataStartIndex, dataEndIndex, xLeft, xRight, needChange = false;

                    if (deltaX != 0) {
                        dataStartIndex = Math.min(Math.max(that.settings.dataStartIndex + (deltaX > 0 ? -1 : 1) * candlesScrollCount, 0), that.options.scrollCandlesEnd - that.options.dataCount + 1);
                        dataEndIndex = dataStartIndex + that.options.dataCount - 1;
                        needChange = true;
                    }

                    if (deltaY != 0) {
                        if (deltaY > 0) {
                            if (that.settings.dataStartIndex > 0) {
                                dataStartIndex = Math.max(that.settings.dataStartIndex - candlesScrollCount, 0);
                                dataEndIndex = that.settings.dataEndIndex;
                                needChange = true;
                            }
//                            else if (that.settings.dataEndIndex < that.options.scrollCandlesEnd) {
//                                dataStartIndex = that.settings.dataStartIndex;
//                                dataEndIndex = Math.min(that.settings.dataEndIndex + candlesScrollCount, that.options.scrollCandlesEnd);
//                                needChange = true;
//                            }
                        } else if (deltaY < 0) {
                            if (that.settings.dataStartIndex < that.settings.dataEndIndex - that.defaults.scrollSettings.candlesMinCount) {
                                dataStartIndex = Math.min(that.settings.dataStartIndex + candlesScrollCount, that.settings.dataEndIndex - that.defaults.scrollSettings.candlesMinCount);
                                dataEndIndex = that.settings.dataEndIndex;
                                needChange = true;
                            }
                        }
                    }

                    if (needChange && (dataStartIndex != that.settings.dataStartIndex || dataEndIndex != that.settings.dataEndIndex)) {
                        xLeft = (dataStartIndex - that.options.scrollCandlesStart) * candleWidth;
                        xRight = (dataEndIndex - that.options.scrollCandlesStart) * candleWidth;
                        that._updateScroll(xLeft, xRight);
                        that._update(dataStartIndex, dataEndIndex, false);
                    }

                    event.preventDefault();
                }
            });

            $(window).on('mousedown.' + that.defaults.eventClassPermanent, function(event) {
                if ((event.pageX - that.options.chartOffsetX) < that.settings.width && (event.pageY - that.options.chartOffsetY) < that.options.volumeChartBottom) {

                    $('body').css({cursor: 'ew-resize'});
                    that.options.mouseDraggerOffsetX = event.pageX;
                    that.options.shiftCandlesStartIndex = that.settings.dataStartIndex;

                    $(window).on('mousemove.'+that.defaults.eventClass, function(event) {

                        var candleWidth = that.options.dataChartWidth / that.options.scrollCandlesCount,
                            candleShiftWidth = that.options.dataChartWidth / that.options.dataCount,
                            shiftX = event.pageX - that.options.mouseDraggerOffsetX,
                            shiftCandles = Math.round(-shiftX / candleShiftWidth),
                            dataStartIndex = Math.min(Math.max(that.options.shiftCandlesStartIndex + shiftCandles, 0), that.options.scrollCandlesEnd - that.options.dataCount + 1),
                            dataEndIndex = dataStartIndex + that.options.dataCount - 1,
                            xLeft = (dataStartIndex - that.options.scrollCandlesStart) * candleWidth,
                            xRight = (dataEndIndex - that.options.scrollCandlesStart) * candleWidth;

                        if (dataStartIndex != that.settings.dataStartIndex) {
                            that._updateScroll(xLeft, xRight);
                            that._update(dataStartIndex, dataEndIndex, false);
                        }
                    });

                    $(window).on('mouseup.'+that.defaults.eventClass, function() {
                        $('body').css({cursor: 'default'});
                        $(window).off('.'+that.defaults.eventClass);
                    });

                    event.preventDefault();
                }
            });
        };

        this._animateScroll = function(dataStartIndex, dataEndIndex) {
            var candleWidth = (that.options.dataChartWidth / that.options.scrollCandlesCount),
                scrollPolygon = that._getScrollPolygon(candleWidth),
                xLeft = (dataStartIndex - that.options.scrollCandlesStart) * candleWidth,
                xRight = (dataEndIndex - that.options.scrollCandlesStart)  * candleWidth,
                animateTime = that.options.dataCount <= that.defaults.candlesMaxAnimateCount ? that.defaults.animateTime : 0,
                polygonWidth = scrollPolygon.count + that.defaults.dataChartSettings.additionalCandlesCount,
                polygonHeight = scrollPolygon.maxValue - scrollPolygon.minValue,
                yScale = (that.options.scrollHeight - 3)/ polygonHeight,
                xScale = (that.options.dataChartWidth - 2) /polygonWidth;

            that.data.scroll.polygon.plot(scrollPolygon.polygon).scale(xScale, yScale).move((that.options.dataChartLeft + 1) / xScale, (that.options.scrollTop + 3) / yScale);

            var labels = that._getScrollLabels(candleWidth);
            labels = that._redrawScrollLabels(labels);
            that.data.scroll.labels = labels;

            that._updateScroll(xLeft, xRight);
        };

        this._drawScroll = function() {

            var candleWidth = (that.options.dataChartWidth / that.options.scrollCandlesCount),
                scrollPolygon = that._getScrollPolygon(candleWidth),
                polygon = that.options.svg.polygon(scrollPolygon.polygon),
                polygonWidth = scrollPolygon.count + that.defaults.dataChartSettings.additionalCandlesCount,
                polygonHeight = scrollPolygon.maxValue - scrollPolygon.minValue,
                yScale = (that.options.scrollHeight - 3)/ polygonHeight,
                xScale = (that.options.dataChartWidth - 2) /polygonWidth;

            polygon.attr({fill: that.defaults.scrollSettings.backgroundColorFill, stroke: that.defaults.scrollSettings.backgroundColorStroke}).opacity(0).animate(that.defaults.animateOpacityTime).opacity(1);
            $(polygon.node).css({'shape-rendering': 'auto'});

            polygon.scale(xScale, yScale).move((that.options.dataChartLeft + 1) / xScale, (that.options.scrollTop + 3) / yScale);
            that.data.scroll.polygon = polygon;

            var xLeft = (that.settings.dataStartIndex - that.options.scrollCandlesStart) * candleWidth,
                xRight = (that.settings.dataEndIndex - that.options.scrollCandlesStart)  * candleWidth;

            that.data.scroll.draggerLeftOverlay = that._drawRect(that.options.dataChartLeft - 2, that.options.scrollTop, xLeft + 2, that.options.scrollHeight, '#ffffff', 'none', false).attr({opacity: that.defaults.scrollSettings.overlayOpacity, 'stroke-width': 0});
            that.data.scroll.draggerRightOverlay = that._drawRect(that.options.dataChartLeft + xRight, that.options.scrollTop, that.options.dataChartWidth - xRight + 2, that.options.scrollHeight, '#ffffff', 'none', false).attr({opacity: that.defaults.scrollSettings.overlayOpacity, 'stroke-width': 0});

            that.data.scroll.axis = that._drawLine(that.options.dataChartLeft, that.options.scrollBottom, that.options.dataChartRight, that.options.scrollBottom, that.defaults.lineColor);
            that.data.scroll.axisLineRight = that._drawLine(that.options.dataChartRight, that.options.scrollBottom + that.defaults.dataChartSettings.verticalShiftBig, that.options.dataChartRight, that.options.scrollBottom - that.defaults.dataChartSettings.verticalShiftBig, that.defaults.lineColor);
            that.data.scroll.axisLineLeft = that._drawLine(that.options.dataChartLeft, that.options.scrollBottom + that.defaults.dataChartSettings.verticalShiftBig, that.options.dataChartLeft, that.options.scrollBottom - that.defaults.dataChartSettings.verticalShiftBig, that.defaults.lineColor);

            var labels = that._getScrollLabels(candleWidth);
            labels = that._drawScrollLabels(labels);

            that.data.scroll.labels = labels;

            that.data.scroll.dragger = that._drawRect(xLeft + that.options.dataChartLeft, that.options.scrollTop, xRight - xLeft, that.options.scrollHeight, that.defaults.scrollSettings.draggerColorFill, that.defaults.scrollSettings.draggerColorStroke, true).attr({'stroke-width': '2'});
            that.data.scroll.draggerOverlay = that._drawRect(xLeft + that.options.dataChartLeft, that.options.scrollTop, xRight - xLeft, that.options.scrollHeight, '#ffffff', 'none', false).attr({opacity: 0});

            that.options.draggerWidth = xRight - xLeft;

            that.data.scroll.rulerRight = that.options.svg.image("/assets/images/ruler.svg", that.defaults.scrollSettings.draggerWidth, that.defaults.scrollSettings.draggerHeight).x(that.options.dataChartLeft + xRight - that.defaults.scrollSettings.draggerWidth / 2).y(that.options.scrollTop + that.options.scrollHeight / 2 -  that.defaults.scrollSettings.draggerHeight / 2).front();
            that.data.scroll.rulerLeft = that.options.svg.image("/assets/images/ruler.svg", that.defaults.scrollSettings.draggerWidth, that.defaults.scrollSettings.draggerHeight).x(that.options.dataChartLeft + xLeft - that.defaults.scrollSettings.draggerWidth / 2).y(that.options.scrollTop + that.options.scrollHeight / 2 -  that.defaults.scrollSettings.draggerHeight / 2).front();

            $(that.data.scroll.rulerLeft.node).css({'cursor': 'col-resize'});
            $(that.data.scroll.rulerRight.node).css({'cursor': 'col-resize'});
            $(that.data.scroll.draggerOverlay.node).css({'cursor': 'ew-resize'});

            that._setScrollEvents();
        };

        this._setScrollEvents = function() {
            that.data.scroll.draggerOverlay.mousedown(function(event) {
                $(window).on('mousemove.'+that.defaults.eventClass, function(event) {
                    // вычисляем левое положение драггера
                    var x = Math.min(Math.max(event.pageX - that.options.chartOffsetX - that.options.scrollDraggerOffsetX - that.options.dataChartLeft, 0), that.options.dataChartWidth - that.options.draggerWidth),
                        candleWidth = that.options.dataChartWidth / that.options.scrollCandlesCount,
                        candleStart = Math.min(Math.max(Math.round(x / candleWidth), that.options.scrollCandlesStart), that.options.scrollCandlesEnd),
                        xLeft = candleStart * candleWidth,
                        xRight = xLeft + that.options.draggerWidth,
                        dataStartIndex = candleStart,
                        dataEndIndex = Math.round(xRight / candleWidth);

                    if (dataStartIndex != that.settings.dataStartIndex) {
                        that._updateScroll(xLeft, xRight);
                        that._update(dataStartIndex, dataEndIndex, false);
                    }
                });
                $(window).on('mouseup.'+that.defaults.eventClass, function() {
                    $(window).off('.'+that.defaults.eventClass);
                });

                that.options.scrollDraggerOffsetX = event.offsetX - that.data.scroll.draggerOverlay.attr('x');
            });
            
            that.data.scroll.rulerLeft.mousedown(function(event) {
                $(window).on('mousemove.'+that.defaults.eventClass, function(event) {
                    // вычисляем левое положение драггера
                    var x = Math.min(Math.max(event.pageX - that.options.chartOffsetX - that.options.scrollDraggerOffsetX - that.options.dataChartLeft, 0), that.options.dataChartWidth),
                        candleWidth = that.options.dataChartWidth / that.options.scrollCandlesCount,
                        candleStart = Math.min(Math.max(Math.round(x / candleWidth), that.options.scrollCandlesStart), that.settings.dataEndIndex - that.defaults.scrollSettings.candlesMinCount),
                        xLeft = candleStart * candleWidth,
                        xRight = (that.settings.dataEndIndex - that.options.scrollCandlesStart) * candleWidth,
                        dataStartIndex = candleStart;

                    if (dataStartIndex != that.settings.dataStartIndex) {
                        that._updateScroll(xLeft, xRight);
                        that._update(dataStartIndex, that.settings.dataEndIndex, false);
                    }
                });
                $(window).on('mouseup.'+that.defaults.eventClass, function() {
                    $(window).off('.'+that.defaults.eventClass);
                });

                that.options.scrollDraggerOffsetX = event.offsetX - that.data.scroll.rulerLeft.attr('x') - that.data.scroll.rulerLeft.attr('width') / 2;
            });

            that.data.scroll.rulerRight.mousedown(function(event) {
                $(window).on('mousemove.'+that.defaults.eventClass, function(event) {
                    // вычисляем левое положение драггера
                    var x = Math.min(Math.max(event.pageX - that.options.chartOffsetX - that.options.scrollDraggerOffsetX - that.options.dataChartLeft, 0), that.options.dataChartWidth),
                        candleWidth = that.options.dataChartWidth / that.options.scrollCandlesCount,
                        candleEnd = Math.min(Math.max(Math.round(x / candleWidth), that.settings.dataStartIndex + that.defaults.scrollSettings.candlesMinCount), that.options.scrollCandlesEnd),
                        xLeft = (that.settings.dataStartIndex - that.options.scrollCandlesStart) * candleWidth,
                        xRight = candleEnd * candleWidth,
                        dataEndIndex = candleEnd;

                    if (dataEndIndex != that.settings.dataEndIndex) {
                        that._updateScroll(xLeft, xRight);
                        that._update(that.settings.dataStartIndex, dataEndIndex, false);
                    }
                });
                $(window).on('mouseup.'+that.defaults.eventClass, function() {
                    $(window).off('.'+that.defaults.eventClass);
                });

                that.options.scrollDraggerOffsetX = event.offsetX - that.data.scroll.rulerRight.attr('x') - that.data.scroll.rulerRight.attr('width') / 2;
            });
        };

        this._updateScroll = function(xLeft, xRight) {
            that.data.scroll.dragger.attr({x: xLeft + that.options.dataChartLeft, width: xRight - xLeft});
            that.data.scroll.draggerOverlay.attr({x: xLeft + that.options.dataChartLeft, width: xRight - xLeft});

            that.data.scroll.rulerRight.attr({x: that.options.dataChartLeft + xRight - that.defaults.scrollSettings.draggerWidth / 2});
            that.data.scroll.rulerLeft.attr({x: that.options.dataChartLeft + xLeft - that.defaults.scrollSettings.draggerWidth / 2});

            that.data.scroll.draggerLeftOverlay.attr({width: xLeft + 2});
            that.data.scroll.draggerRightOverlay.attr({x: that.options.dataChartLeft + xRight, width: that.options.dataChartWidth - xRight + 2});
            that.options.draggerWidth = xRight - xLeft;
        };

        this._getScrollLabels = function(candleWidth) {
            var labels = [];
            for (i = that.options.scrollCandlesStart; i <= that.options.scrollCandlesEnd; i++) {
                if (i in that.settings.data && (i - that.options.scrollCandlesStart) % that.options.scrollAxisLabelInterval == 0) {
                    var x = (i - that.options.scrollCandlesStart) * candleWidth + that.options.dataChartLeft,
                        date = new Date(parseInt(that.settings.data[i].timestamp) * 1000),
                        label = {};

                    // можно рисовать
                    label.x = x;
                    label.date = date;

                    labels.push(label);
                }
            }

            return labels;
        };

        this._drawScrollLabels = function(labels) {
            for (i in labels) {
                // можно рисовать
                labels[i].text = that._drawHorizontalLabel(labels[i].x, that.options.scrollBottom + that.defaults.dataChartSettings.verticalTextShift, labels[i].date, true, true, true, true, true, true);
                labels[i].line = that._drawLine(labels[i].x, that.options.scrollTop, labels[i].x, that.options.scrollBottom + that.defaults.dataChartSettings.verticalShiftBig, that.defaults.lineColor, {'stroke-dasharray': '4, 2'});
            }
            return labels;
        };

        this._redrawScrollLabels = function(labels) {
            var i = 0,
                animateTime = 10;

            while (i in labels) {
                if (i in that.data.scroll.labels) { // перемещаем
                    var dateText = that._getHorizontalLabelText(labels[i].date, true, true, true);
                    labels[i].text = that.data.scroll.labels[i].text;
                    labels[i].line = that.data.scroll.labels[i].line;

                    labels[i].text.main.attr({text: dateText.main}).stop().opacity(1).animate(animateTime).transform({x: labels[i].x});
                    if (labels[i].text.additional) {
                        labels[i].text.additional.attr({text: dateText.additional}).stop().opacity(1).animate(animateTime).transform({x: labels[i].x});
                    }
                    labels[i].line.stop().opacity(1).animate(animateTime).plot([[labels[i].x, that.options.scrollTop], [labels[i].x, that.options.scrollBottom + that.defaults.dataChartSettings.verticalShiftBig]]);
                } else {
                    // можно рисовать
                    labels[i].text = that._drawHorizontalLabel(labels[i].x, that.options.scrollBottom + that.defaults.dataChartSettings.verticalTextShift, labels[i].date, true, true, true, true, true, true);
                    labels[i].line = that._drawLine(labels[i].x, that.options.scrollTop, labels[i].x, that.options.scrollBottom + that.defaults.dataChartSettings.verticalShiftBig, that.defaults.lineColor, {'stroke-dasharray': '4, 2'});
                }
                i++;
            }

            while (i in that.data.scroll.labels) {
                var label = that.data.scroll.labels[i],
                    text = label.text,
                    line = label.line;

                text.main.animate(animateTime).attr({opacity: 0}).after(function() { this.remove(); });
                if (text.additional) {
                    text.additional.animate(animateTime).attr({opacity: 0}).after(function() { this.remove(); });
                }
                line.animate(animateTime).attr({opacity: 0}).after(function() { this.remove(); });

                that.data.scroll.labels.splice(i, 1);
            }

            that.data.scroll.dragger.front();
            that.data.scroll.rulerRight.front();
            that.data.scroll.rulerLeft.front();

            return labels;
        };

        this._getScrollPolygon = function(candleWidth) {
            // рисуем графон
            var maxValue = null,
                minValue = null,
                polygon = [];

            for (i = 0; i < that.settings.data.length; i++) {
                maxValue = maxValue === null || maxValue < parseFloat(that.settings.data[i].close) ? parseFloat(that.settings.data[i].close) : maxValue;
                minValue = minValue === null || minValue > parseFloat(that.settings.data[i].close) ? parseFloat(that.settings.data[i].close) : minValue;
            }

            polygon.push([0, maxValue - minValue]);

            for (i = 0; i < that.settings.data.length; i++) {
                polygon.push([i, maxValue - parseFloat(that.settings.data[i].close)]);
            }

            polygon.push([that.settings.data.length - 1, maxValue - minValue]);

            return {
                polygon: polygon,
                minValue: minValue,
                maxValue: maxValue,
                count: that.settings.data.length
            };
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
                    volumesSet.add(volume.rect);
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
        };

        this._calculateDataIntervals = function() {
            var timestamps = _(that.settings.data).pluck('timestamp');

            // начало
            if (that.settings.dataStartIndex !== null) {
                that.settings.dataStartTimestamp = that.settings.data[that.settings.dataStartIndex].timestamp;
            } else {
                if (that.settings.dataStartTimestamp === null) {
                    that.settings.dataStartIndex = Math.max(that.settings.data.length - that.settings.candlesCount, 0);
                    that.settings.dataStartTimestamp = that.settings.data[that.settings.dataStartIndex].timestamp;
                } else {
                    if ((that.settings.dataStartIndex = _(timestamps).indexOf(that.settings.dataStartTimestamp.toString())) == -1) {
                        that.settings.dataStartIndex = 0;
                        if (parseInt(that.settings.dataStartTimestamp) <= parseInt(_(timestamps).first())) {
                            that.settings.dataStartIndex = 0;
                            that.settings.dataStartTimestamp = that.settings.data[that.settings.dataStartIndex].timestamp;
                        } else if (parseInt(that.settings.dataStartTimestamp) >= parseInt(_(timestamps).last())) {
                            that.settings.dataStartIndex = that.settings.data.length - 1;
                            that.settings.dataStartTimestamp = that.settings.data[that.settings.dataStartIndex].timestamp;
                        } else {
                            // ищем перебором
                            for (i in timestamps) {
                                var nextIndex = parseInt(i) + 1,
                                    previousIndex = parseInt(i) - 1,
                                    previousValue = parseInt(previousIndex in timestamps ? timestamps[previousIndex] : timestamps[i]),
                                    nextValue = parseInt(nextIndex in timestamps ? timestamps[nextIndex]: timestamps[i]),
                                    currentValue = parseInt(timestamps[i]);

                                if (parseInt(that.settings.dataStartTimestamp) >= previousValue && parseInt(that.settings.dataStartTimestamp) <= currentValue) {
                                    that.settings.dataStartIndex = i;
                                    that.settings.dataStartTimestamp = timestamps[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            
            // конец
            if (that.settings.dataEndIndex !== null) {
                that.settings.dataEndTimestamp = that.settings.data[that.settings.dataEndIndex].timestamp;
            } else {
                if (that.settings.dataEndTimestamp === null) {
                    that.settings.dataEndIndex = that.settings.data.length - 1;
                    that.settings.dataEndTimestamp = that.settings.data[that.settings.dataEndIndex].timestamp;
                } else {
                    if ((that.settings.dataEndIndex = _(timestamps).indexOf(that.settings.dataEndTimestamp.toString())) == -1) {
                        that.settings.dataEndIndex = that.settings.data.length - 1;
                        if (parseInt(that.settings.dataEndTimestamp) <= parseInt(_(timestamps).first())) {
                            that.settings.dataEndIndex = 0;
                            that.settings.dataEndTimestamp = that.settings.data[that.settings.dataEndIndex].timestamp;
                        } else if (parseInt(that.settings.dataEndTimestamp) >= parseInt(_(timestamps).last())) {
                            that.settings.dataEndIndex = that.settings.data.length - 1;
                            that.settings.dataEndTimestamp = that.settings.data[that.settings.dataEndIndex].timestamp;
                        } else {
                            // ищем перебором
                            for (i in timestamps) {
                                var nextIndex = parseInt(i) + 1,
                                    previousIndex = parseInt(i) - 1,
                                    previousValue = parseInt(previousIndex in timestamps ? timestamps[previousIndex] : timestamps[i]),
                                    nextValue = parseInt(nextIndex in timestamps ? timestamps[nextIndex]: timestamps[i]),
                                    currentValue = parseInt(timestamps[i]);

                                if (parseInt(that.settings.dataEndTimestamp) >= currentValue && parseInt(that.settings.dataEndTimestamp) <= nextValue) {
                                    that.settings.dataEndIndex = i;
                                    that.settings.dataEndTimestamp = timestamps[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            console.log('start: ' + that.settings.dataStartIndex);
            console.log('end: ' + that.settings.dataEndIndex);

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

            var value, dataInterval;

            that.options.dataIntervalsCount = Math.max(Math.round(Math.sqrt(that.settings.data.length) / that.defaults.intervalsValueCount) * that.defaults.intervalsValueCount, that.defaults.intervalsValueCount);
            that.options.dataIntervalsValues = [];

            // минимальные и максимальные значения
            that.options.maxValue = null;
            that.options.minValue = null;
            that.options.maxVolume = null;

            for (var dataIndex = 0; dataIndex < that.settings.data.length; dataIndex++) {
                value = that.settings.data[dataIndex];
                dataInterval = Math.floor(dataIndex / that.options.dataIntervalsCount);

                if ((dataIndex in that.settings.data) && (dataIndex >= that.settings.dataStartIndex && dataIndex <= that.settings.dataEndIndex)) {
                    that.options.maxValue = that.options.maxValue === null ? parseFloat(value.high) : Math.max(that.options.maxValue, parseFloat(value.high));
                    that.options.minValue = that.options.minValue === null ? parseFloat(value.low) : Math.min(that.options.minValue, parseFloat(value.low));
                    that.options.maxVolume = that.options.maxVolume === null ? parseFloat(value.volume) : Math.max(that.options.maxVolume, parseFloat(value.volume));
                }

                if (!(dataInterval in that.options.dataIntervalsValues)) {
                    that.options.dataIntervalsValues.push({maxValue: parseFloat(value.high), minValue: parseFloat(value.low), maxVolume: parseFloat(value.volume)});
                } else {
                    that.options.dataIntervalsValues[dataInterval].maxValue = Math.max(that.options.dataIntervalsValues[dataInterval].maxValue, parseFloat(value.high));
                    that.options.dataIntervalsValues[dataInterval].minValue = Math.min(that.options.dataIntervalsValues[dataInterval].minValue, parseFloat(value.low));
                    that.options.dataIntervalsValues[dataInterval].maxVolume = Math.max(that.options.dataIntervalsValues[dataInterval].maxVolume, parseFloat(value.volume));
                }
            }

            console.log(that.options.dataIntervalsValues);
        };

        this._recalculateIntervals = function(dataStartIndex, dataEndIndex) {
            var needRecalculateData = false,
                needRecalculateVolume = false,
                dataIndex, value, dataInterval, minValue = null, maxValue = null, maxVolume = null;
            
            if (dataStartIndex >= that.settings.dataEndIndex || dataEndIndex <= that.settings.dataStartIndex) {
                needRecalculateData = true;
                needRecalculateVolume = true;
            } else {
                
                var startIndexMin = Math.min(dataStartIndex, that.settings.dataStartIndex),
                    startIndexMax = Math.max(dataStartIndex, that.settings.dataStartIndex),
                    endIndexMin = Math.min(dataEndIndex, that.settings.dataEndIndex),
                    endIndexMax = Math.max(dataEndIndex, that.settings.dataEndIndex);
                
                if ((startIndexMax - startIndexMin) + (endIndexMax - endIndexMin) > that.options.dataIntervalsValues.length) { // нет смысла проверять
                    needRecalculateData = true;
                    needRecalculateVolume = true;
                } else {
                    if (startIndexMin != startIndexMax) {
                        for (dataIndex = startIndexMin; dataIndex <= startIndexMax; dataIndex++) {
                            if (!(dataIndex in that.settings.data)) {
                                continue;
                            }
                            value = that.settings.data[dataIndex];
                            if (parseFloat(value.high) >= that.options.maxValue || parseFloat(value.low) <= that.options.minValue) {
                                needRecalculateData = true;
                            }
                            if (parseFloat(value.volume) >= that.options.maxVolume) {
                                needRecalculateVolume = true;
                            }
                            if (needRecalculateData && needRecalculateVolume) {
                                break;
                            }
                        }
                    }
                    
                    if (endIndexMin != endIndexMax) {
                        for (dataIndex = endIndexMin; dataIndex <= endIndexMax; dataIndex++) {
                            if (!(dataIndex in that.settings.data)) {
                                continue;
                            }
                            value = that.settings.data[dataIndex];
                            if (parseFloat(value.high) >= that.options.maxValue || parseFloat(value.low) <= that.options.minValue) {
                                needRecalculateData = true;
                            }
                            if (parseFloat(value.volume) >= that.options.maxVolume) {
                                needRecalculateVolume = true;
                            }
                            if (needRecalculateData && needRecalculateVolume) {
                                break;
                            }
                        }
                    }
                }
            }

            if (needRecalculateData || needRecalculateVolume) {

                var dataIntervalStart = Math.floor(Math.min(dataStartIndex, that.settings.data.length - 1) / that.options.dataIntervalsCount),
                    dataIntervalEnd = Math.floor(Math.min(dataEndIndex, that.settings.data.length - 1) / that.options.dataIntervalsCount),
                    dataIntervalIndex,
                    maxValueCentral = null, minValueCentral = null, maxVolumeCentral = null, needCalculateSideMaxValue = needRecalculateData, needCalculateSideMinValue = needRecalculateData, needCalculateSideVolume = needRecalculateVolume,
                    maxValueSide = Math.max(that.options.dataIntervalsValues[dataIntervalStart].maxValue, that.options.dataIntervalsValues[dataIntervalEnd].maxValue),
                    minValueSide = Math.min(that.options.dataIntervalsValues[dataIntervalStart].minValue, that.options.dataIntervalsValues[dataIntervalEnd].minValue),
                    maxVolumeSide = Math.max(that.options.dataIntervalsValues[dataIntervalStart].maxVolume, that.options.dataIntervalsValues[dataIntervalEnd].maxVolume);

                if (dataIntervalEnd > dataIntervalStart + 1) { // здесь нужно считать внутри
                    for (dataIntervalIndex = dataIntervalStart + 1; dataIntervalIndex < dataIntervalEnd; dataIntervalIndex++) {
                        if (needRecalculateVolume) {
                            maxVolumeCentral = maxVolumeCentral === null ? that.options.dataIntervalsValues[dataIntervalIndex].maxVolume : Math.max(maxVolumeCentral, that.options.dataIntervalsValues[dataIntervalIndex].maxVolume);
                        }
                        if (needRecalculateData) {
                            maxValueCentral = maxValueCentral === null ? that.options.dataIntervalsValues[dataIntervalIndex].maxValue : Math.max(maxValueCentral, that.options.dataIntervalsValues[dataIntervalIndex].maxValue);
                            minValueCentral = minValueCentral === null ? that.options.dataIntervalsValues[dataIntervalIndex].minValue : Math.min(minValueCentral, that.options.dataIntervalsValues[dataIntervalIndex].minValue);
                        }
                    }

                    maxVolume = maxVolumeCentral;
                    maxValue = maxValueCentral;
                    minValue = minValueCentral;

                    if (needRecalculateVolume) {
                        if (maxVolumeCentral >= maxVolumeSide) {
                            needCalculateSideVolume = false;
                        }
                    }

                    if (needRecalculateData) {
                        if (maxValueCentral >= maxValueSide) {
                            needCalculateSideMaxValue = false;
                        }
                        if (minValueCentral <= minValueSide) {
                            needCalculateSideMinValue = false;
                        }
                    }
                }

                if (needCalculateSideVolume || needCalculateSideMinValue || needCalculateSideMaxValue) {

                    var dataSideIndexes = _.union(_.range(Math.min(dataStartIndex, that.settings.data.length - 1), (dataIntervalStart + 1) * that.options.dataIntervalsCount + 1), _.range(dataIntervalEnd * that.options.dataIntervalsCount, Math.min(dataEndIndex, that.settings.data.length - 1) + 1));
                    for (dataInterval in dataSideIndexes) {
                        dataIndex = dataSideIndexes[dataInterval];

                        if (!(dataIndex in that.settings.data)) {
                            continue;
                        }

                        value = that.settings.data[dataIndex];
                        if (needCalculateSideMaxValue) {
                            maxValue = maxValue === null ? parseFloat(value.high) : Math.max(maxValue, parseFloat(value.high));
                        }
                        if (needCalculateSideMinValue) {
                            minValue = minValue === null ? parseFloat(value.low) : Math.min(minValue, parseFloat(value.low));
                        }
                        if (needCalculateSideVolume) {
                            maxVolume = maxVolume === null ? parseFloat(value.volume) : Math.max(maxVolume, parseFloat(value.volume));
                        }
                    }
                }
            }

            var returnData = {
                data: needRecalculateData && (minValue != that.options.minValue || maxValue != that.options.maxValue),
                volume: needRecalculateVolume && (maxVolume != that.options.maxVolume)
            };

            if (needRecalculateData) {
                that.options.minValue = minValue;
                that.options.maxValue = maxValue;
            }
            if (needRecalculateVolume) {
                that.options.maxVolume = maxVolume;
            }


            return returnData;
        };

        this._calculateScrollCandles = function() {
            that.options.scrollCandlesStart = 0;
            that.options.scrollCandlesEnd = that.settings.data.length + that.defaults.dataChartSettings.additionalCandlesCount;
            that.options.scrollCandlesCount = that.options.scrollCandlesEnd - that.options.scrollCandlesStart;
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
            }

            if (calculateVolume) {
                var volumeIntervalPower = Math.floor(Math.log(that.options.maxVolume) / Math.log(10)) - 1;
                that.options.volumeChartMaxValue = Math.ceil(that.options.maxVolume / Math.pow(10, volumeIntervalPower)) * Math.pow(10, volumeIntervalPower);
            }

            if (calculateScrollAxisInterval) {
                // вычисляем сколько и где будут подписи по горизонтали в скролле
                that.options.scrollAxisLabelInterval = Math.floor(Math.floor(that.options.scrollCandlesCount / (that.options.dataChartWidth / ((that.defaults.horizontalFiledsSizeMin + that.defaults.horizontalFiledsSizeMax) / 2))) / 2) * 2;
            }

            // xScale, yScale and etc.
            that.options.maskWidth = dataCount * (that.defaults.dataChartSettings.columnWidth + that.defaults.dataChartSettings.columnSpaceWidth);
            that.options.xScale = that.options.dataChartWidth / that.options.maskWidth;

            //that.options.scrollInterval = Math.round(that.options.scrollCandlesCount / that.defaults.scrollSettings.intervalsCount / 5) * 5;
        };

        this._recalculateScrollAxisInterval = function() {

            var scrollAxisLabelInterval = Math.ceil((that.options.dataChartWidth / that.options.scrollCandlesCount) * that.options.scrollAxisLabelInterval);

            if (scrollAxisLabelInterval < that.defaults.horizontalFiledsSizeMin || scrollAxisLabelInterval > that.defaults.horizontalFiledsSizeMax) {
                // нужно пересчитать
                // вычисляем сколько и где будут подписи по горизонтали в скролле
                that.options.scrollAxisLabelInterval = Math.floor(Math.floor(that.options.scrollCandlesCount / (that.options.dataChartWidth / ((that.defaults.horizontalFiledsSizeMin + that.defaults.horizontalFiledsSizeMax) / 2))) / 2) * 2;
            }
        };
        
        this._recalculateHorizontalAxisLabelInterval = function() {

            var horizontalAxisLabelInterval = Math.ceil((that.options.dataChartWidth / that.options.dataCount) * that.options.horizontalAxisLabelInterval);

            if (horizontalAxisLabelInterval < that.defaults.horizontalFiledsSizeMin || horizontalAxisLabelInterval > that.defaults.horizontalFiledsSizeMax) {
                // нужно пересчитать
                // вычисляем сколько и где будут подписи по горизонтали в скролле
                that.options.horizontalAxisLabelInterval = Math.floor(Math.floor(that.options.dataCount / (that.options.dataChartWidth / ((that.defaults.horizontalFiledsSizeMin + that.defaults.horizontalFiledsSizeMax) / 2))) / 2) * 2;
            }
        };

        this._drawVerticalAxis = function() {

            // вертикальная линия
            //that._drawLine(that.options.dataChartRight, that.options.dataChartTop, that.options.dataChartRight, that.options.dataChartBottom + 1, this.defaults.lineColor);

            var labels = that._getVerticalAxisLabels();
            that._drawVerticalAxisLabels(labels);

            that.options.verticalLabels = labels;
        };

        this._redrawVerticalAxis = function() {
            var labels = that._getVerticalAxisLabels();
            that._redrawVerticalAxisLabels(labels);

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
                            text.text(that._prepareNumberToLabel(valueLine));
                        }

                        if (yLine != that.options.verticalLabels[i].y) {
                            line.plot([[that.options.dataChartLeft, yLine + that.options.dataChartTop], [that.options.dataChartRight + that.defaults.dataChartSettings.horizontalShift, yLine + that.options.dataChartTop]]);
                            text.transform({y: yLine + that.options.dataChartTop - that.defaults.textSize * 0.9});
                        }
                    } else {
                        if (i in that.data.verticalAxis) {
                            text.text(that._prepareNumberToLabel(valueLine));
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

//            var currentDate = null,
//                counter = null,
//                value = null,
//                date = null,
//                dateDay,
//                dateMonth,
//                dateYear,
//                x,
//                isNewDay = false,
//                isNewMonth = false,
//                isNewYear = false,
//                currentDay,
//                currentMonth,
//                currentYear;
//
//            for (var dataCounterIndex in labelRangeIndexes) {
//
//                if (!(labelRangeIndexes[dataCounterIndex] in that.settings.data)) {
//                    continue;
//                }
//
//                counter = labelRangeIndexes[dataCounterIndex] - dataStartIndex;
//                value = that.settings.data[labelRangeIndexes[dataCounterIndex]];
//                date = new Date(parseInt(value.timestamp) * 1000);
//
//                dateDay = date.getDate();
//                dateMonth = date.getMonth();
//                dateYear = date.getFullYear();
//
//                currentDay = currentDate === null ? null : currentDate.getDate();
//                currentMonth = currentDate === null ? null : currentDate.getMonth();
//                currentYear = currentDate === null ? null : currentDate.getFullYear();
//
//                isNewDay = currentDate === null || (!(currentDay == dateDay && currentMonth == dateMonth && dateYear == currentYear));
//                isNewMonth = currentDate === null || (!(currentMonth == dateMonth && dateYear == currentYear));
//                isNewYear = currentDate === null || (!(dateYear == currentYear));
//
//                x = that._calculateHorizontalAxisXByCounter(counter);
//
//                that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]] = {};
//                that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]].text = that._drawHorizontalLabel(x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalTextShift, date, isNewDay, isNewMonth, isNewYear, needAnimate);
//                that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]].line = that._drawLine(x, that.options.volumeChartBottom, x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalShiftBig, that.defaults.lineColor, null, needAnimate).back();
//
//                currentDate = date;
//            }

//            if ((drawDay || drawMonth || drawYear) && counter > 0) {
//                var xDivider = that._calculateHorizontalDividerXByCounter(counter),
//                    dateText = '',
//                    needDraw = false;
//
//                // draw divider
//                if (that.options.showAxisTime && drawDay) {
//                    needDraw = true;
//                    // день + месяц + год
//                    dateText = date.getDate().toString() + ' ' + that.defaults.months[date.getMonth()] + ' ' + date.getFullYear().toString();
//                } else if (that.options.showAxisDate && drawMonth) {
//                    needDraw = true;
//                    // месяц + год
//                    dateText = that.defaults.months[date.getMonth()] + ' ' + date.getFullYear().toString();
//                } else if (that.options.showAxisMonth && drawYear) {
//                    needDraw = true;
//                    // год
//                    dateText = date.getFullYear().toString() + ' year';
//                }
//
//                if (needDraw) {
//                    that.data.horizontalAxis.dividers[dataCounter] = {};
//                    that.data.horizontalAxis.dividers[dataCounter].line = that._drawLine(xDivider, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerShift, xDivider, that.options.volumeChartBottom, that.defaults.lineColor, {'stroke-dasharray': '4, 2'}, needAnimate);
//                    that.data.horizontalAxis.dividers[dataCounter].text = that._drawText(xDivider + that.defaults.dataChartSettings.verticalDividerTextHorizontalShift, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerTextVerticalShift - 0.9 * that.defaults.textSizeMiddle, dateText, 'middle', 'start', needAnimate);
//                }
//            }
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

        this._redrawHorizontalAxis = function(dataStartIndex, dataEndIndex) {

            var labelStartIndex = Math.ceil(dataStartIndex / that.options.horizontalAxisLabelInterval) * that.options.horizontalAxisLabelInterval,
                labelEndIndex = Math.floor(dataEndIndex / that.options.horizontalAxisLabelInterval) * that.options.horizontalAxisLabelInterval,
                labelRangeIndexes = _.range(labelStartIndex, labelEndIndex + that.options.horizontalAxisLabelInterval, that.options.horizontalAxisLabelInterval),
                label, x, counter, value, date;

            for (var dataCounterIndex in labelRangeIndexes) {
                label = that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]];
                counter = labelRangeIndexes[dataCounterIndex] - dataStartIndex;
                x = that._calculateHorizontalAxisXByCounter(counter);

                if (labelRangeIndexes[dataCounterIndex] in that.data.horizontalAxis.labels) {
                    // перемещаем
                    label.line.plot([[x, that.options.volumeChartBottom], [x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalShiftBig]]);
                    label.text.main.transform({x: x});
                    label.text.additional.transform({x: x});
                } else if (labelRangeIndexes[dataCounterIndex] in that.settings.data) {
                    // создаем
                    value = that.settings.data[labelRangeIndexes[dataCounterIndex]];
                    date = new Date(parseInt(value.timestamp) * 1000);

                    that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]] = {};
                    that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]].text = that._drawHorizontalLabel(x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalTextShift, date, true, true, true, false);
                    that.data.horizontalAxis.labels[labelRangeIndexes[dataCounterIndex]].line = that._drawLine(x, that.options.volumeChartBottom, x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalShiftBig, that.defaults.lineColor, null, false).back();
                }
            }

            // лишние удаляем
            var dataCounterDeleteIndexes = _(that.options.labelRangeIndexes).difference(labelRangeIndexes);
            if (dataCounterDeleteIndexes && dataCounterDeleteIndexes.length > 0) {
                for (var dataCounterIndex in dataCounterDeleteIndexes) {
                    that._removeHorizontalLabel(dataCounterDeleteIndexes[dataCounterIndex], null, false);
                }
            }

            that.options.labelRangeIndexes = labelRangeIndexes;

//            _(that.data.horizontalAxis.labels).each(function(value, dataCounter) {
//                that._removeHorizontalLabel(dataCounter, null, false, true, false);
//            });

//            _(that.data.horizontalAxis.dividers).each(function(value, dataCounter) {
//                that._removeHorizontalLabel(dataCounter, null, false, false, true);
//            });

//            this._drawHorizontalAxis(dataStartIndex, dataEndIndex, false, false);
        }

        this._prepareNumber = function(number) {
            return number.toFixed(2);
        };

        this._prepareNumberToLabel = function(number) {
            return number.toFixed(2);
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
            return that._drawText(x, y - that.defaults.textSize * 0.9, that._prepareNumberToLabel(number), 'normal', 'start', needAnimate);
        };

        this._getHorizontalLabelText = function(date, newDay, newMonth, newYear) {
            var text = {main: null, additional: null};

            if (that.options.showAxisTime) {
                text.main = that._prependZero(date.getHours()) + ':' + that._prependZero(date.getMinutes());
                if (newDay) {
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
                    candlesSet.add(candle.line).add(candle.rect);
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

        // Внешние функции
        this.addData = function(value, onComplete) {
            if (!that._checkIsBusy('addData', _(arguments).toArray())) {
                return that._addData(value, onComplete);
            } else {
                return false;
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

        this._addIntervalsData = function(value, dataIndex) {

            var dataInterval = Math.floor(dataIndex / that.options.dataIntervalsCount);

            if (!(dataInterval in that.options.dataIntervalsValues)) {
                that.options.dataIntervalsValues.push({maxValue: parseFloat(value.high), minValue: parseFloat(value.low), maxVolume: parseFloat(value.volume)});
            } else {
                that.options.dataIntervalsValues[dataInterval].maxValue = Math.max(that.options.dataIntervalsValues[dataInterval].maxValue, parseFloat(value.high));
                that.options.dataIntervalsValues[dataInterval].minValue = Math.min(that.options.dataIntervalsValues[dataInterval].minValue, parseFloat(value.low));
                that.options.dataIntervalsValues[dataInterval].maxVolume = Math.max(that.options.dataIntervalsValues[dataInterval].maxVolume, parseFloat(value.volume));
            }
        };

        this._addData = function(value, onComplete) {

            var addData = function() {
                that.options.isBusy = true;

                that.settings.data.push(value);

                var dataStartIndex = that.settings.dataStartIndex + 1,
                    dataEndIndex = that.settings.dataEndIndex + 1;

                that._addIntervalsData(value, that.settings.data.length - 1);

                // смотрим, нужно ли что-то пересчитывать
                var needRecalculate = that._recalculateIntervals(dataStartIndex, dataEndIndex);

                if (needRecalculate.data || needRecalculate.volume) { // пересчитываем интервалы
                    that._calculateChartIntervals(needRecalculate.data, false, needRecalculate.volume, false);
                }

                // анимируем свечки
                setTimeout(function() {

                    setTimeout(function() {
                        that.settings.dataStartIndex = dataStartIndex;
                        that.settings.dataEndIndex = dataEndIndex;

                        that.settings.dataStartTimestamp = that.settings.data[dataStartIndex].timestamp;
                        that.settings.dataEndTimestamp = that.settings.data[that.settings.data.length - 1].timestamp;

                        that.options.isBusy = false;

                        if (onComplete && $.isFunction(onComplete)) {
                            onComplete();
                        }

                        that._checkCallStack();

                    }, 5);


                    if (needRecalculate.volume) {
                        setTimeout(function() {
                            that.data.volumeAxis.max.text.attr({text: that._prepareNumberToLabel(that.options.volumeChartMaxValue)});
                        }, 5);
                    }

                    if (needRecalculate.data) {
                        setTimeout(function() {
                            that._redrawVerticalAxis();
                        }, 5);
                    }

                }, 5);

                that._addCandle(dataStartIndex, dataEndIndex, needRecalculate);
                that._addVolume(dataStartIndex, dataEndIndex, needRecalculate);

                // TODO: улучшить перфоманс!!! (ТОРМОЗИТ ЗДЕСЬ)
                setTimeout(function() {
                    that._redrawHorizontalAxis(dataStartIndex, dataEndIndex);
                }, 10);

                setTimeout(function() {
                    // анимируем скролл
                    that._calculateScrollCandles();
                    that._recalculateScrollAxisInterval();

                    that._animateScroll(dataStartIndex, dataEndIndex);
                }, 5);
            }

            if ((that.settings.dataEndIndex >= that.settings.data.length - 2) && (that.settings.dataStartIndex <= that.settings.data.length - 1)) { // находимся в конце
                addData();
            } else { // находимся не в конце
                var dataIntervalIndex = that.settings.dataEndIndex - that.settings.dataStartIndex,
                    candleWidth = that.options.dataChartWidth / that.options.scrollCandlesCount,
                    dataEndIndex, dataStartIndex;

                if (!(that.settings.dataEndIndex >= that.settings.data.length - 2)) {
                    dataEndIndex = that.settings.data.length - 1;
                    dataStartIndex = dataEndIndex - dataIntervalIndex;
                } else if (!(that.settings.dataStartIndex <= that.settings.data.length - 1)) {
                    dataStartIndex = that.settings.data.length - 1;
                    dataEndIndex = dataStartIndex + dataIntervalIndex;
                }

                var xLeft = dataStartIndex * candleWidth,
                    xRight = dataEndIndex * candleWidth;

                that._updateScroll(xLeft, xRight);
                that._update(dataStartIndex, dataEndIndex, addData);
            }

            return true;
        };

        this._addCandle = function(dataStartIndex, dataEndIndex, needRecalculate) {

            var startIndex = that.settings.dataStartIndex;

            that._hideCandle(startIndex, function() {

                // свечка уже убрана
                // сдвигаем все свечки
                that._animateCandles(dataStartIndex, dataEndIndex, needRecalculate.data, function() {

                    // добавляем новую свечку
                    var dataIndex = that.settings.data.length - 1,
                        value = that.settings.data[dataIndex],
                        candle = that._drawCandle(value, dataIndex),
                        candlesSet = that.options.svg.set();

                    that.data.candles[dataIndex] = candle;
                    that.data.candlesGroup.add(candle.line).add(candle.rect);
                    that.data.candlesSetLines.add(candle.line);

                    candlesSet.add(candle.line).add(candle.rect);

                    candle.line.attr({'stroke-width': 1 / that.options.xScale});

                    candlesSet.opacity(0).animate(25).opacity(1).after(function() {
                        candlesSet.clear();
                        setTimeout(function() {
                            that._showCandle(startIndex);
                        }, 15);
                    });
                });
            });
        };

        this._addVolume = function(dataStartIndex, dataEndIndex, needRecalculate) {

            var startIndex = that.settings.dataStartIndex;

            that._hideVolume(startIndex, function() {

                // объем уже убран
                // сдвигаем все объемы
                that._animateVolumes(dataStartIndex, dataEndIndex, needRecalculate.volume, function() {

                    // добавляем новый объем
                    var dataIndex = that.settings.data.length - 1,
                        value = that.settings.data[dataIndex],
                        volume = that._drawVolume(value, dataIndex),
                        volumesSet = that.options.svg.set();

                    that.data.volumes[dataIndex] = volume;
                    that.data.volumesGroup.add(volume.rect);

                    volumesSet.add(volume.rect);

                    volumesSet.opacity(0).animate(25).opacity(1).after(function() {
                        volumesSet.clear();
                        setTimeout(function() {
                            that._showVolume(startIndex);
                        }, 15);
                    });
                });
            });
        };


        this._animateCandles = function(dataStartIndex, dataEndIndex, needRecalculateData, onComplete) {
            // сдвигаем все нахуй
            this._updateCandles(dataStartIndex, dataEndIndex, false, false);

            if (onComplete && $.isFunction(onComplete)) {
                onComplete();
            }
        };

        this._animateVolumes = function(dataStartIndex, dataEndIndex, needRecalculateVolume, onComplete) {
            // сдвигаем все нахуй
            this._updateVolumes(dataStartIndex, dataEndIndex, false, false);

            if (onComplete && $.isFunction(onComplete)) {
                onComplete();
            }
        };

        this._animateHorizontalAxis = function(dataStartIndex, dataEndIndex, onComplete) {
            that._removeHorizontalLabel(that.settings.dataStartIndex, function() {
                // сдвигаем все нахуй
                for (dataIndex = that.settings.dataStartIndex + 1; dataIndex <= that.settings.dataEndIndex; dataIndex++) {
                    that._shiftHorizontalLabel(dataIndex);
                }

                if (onComplete && $.isFunction(onComplete)) {
                    setTimeout(onComplete, 5);
                }
            });
        };

        this._shiftHorizontalLabel = function(index) {
            var animateTime =  25,
                counter = index - that.settings.dataStartIndex - 1;

            if (index in that.data.horizontalAxis.labels) {
                var label = that.data.horizontalAxis.labels[index],
                    line = label.line,
                    x = that._calculateHorizontalAxisXByCounter(counter),
                    text = label.text,
                    textMain = text.main,
                    textAdditional = 'additional' in text ? text.additional : null;

                if (that.options.dataCount <= that.defaults.axisMaxAnimateCount) {
                    line.stop().opacity(1).animate(animateTime).plot([[x, that.options.volumeChartBottom], [x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalShiftBig]]);
                    textMain.stop().opacity(1).animate(animateTime).transform({x: x});
                    if (textAdditional) {
                        textAdditional.stop().opacity(1).animate(animateTime).transform({x: x});
                    }
                } else {
                    line.stop().opacity(1).plot([[x, that.options.volumeChartBottom], [x, that.options.volumeChartBottom + that.defaults.dataChartSettings.verticalShiftBig]]);
                    textMain.stop().opacity(1).transform({x: x});
                    if (textAdditional) {
                        textAdditional.stop().opacity(1).transform({x: x});
                    }
                }
            }

            if (index in that.data.horizontalAxis.dividers) {
                var xDivider = that._calculateHorizontalDividerXByCounter(counter),
                    divider = that.data.horizontalAxis.dividers[index];

                if (that.options.dataCount <= that.defaults.axisMaxAnimateCount) {
                    divider.line.stop().opacity(1).animate(animateTime).plot([[xDivider, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerShift], [xDivider, that.options.volumeChartBottom]]);
                    divider.text.stop().opacity(1).animate(animateTime).transform({x: xDivider + that.defaults.dataChartSettings.verticalDividerTextHorizontalShift});
                } else {
                    divider.line.stop().opacity(1).plot([[xDivider, that.options.dataChartTop - that.defaults.dataChartSettings.verticalDividerShift], [xDivider, that.options.volumeChartBottom]]);
                    divider.text.stop().opacity(1).transform({x: xDivider + that.defaults.dataChartSettings.verticalDividerTextHorizontalShift});
                }
            }
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

        this._removeHorizontalDivider = function(index, onComplete, needAnimate) {

            var animateTime = that.options.dataCount <= that.defaults.candlesMaxAnimateCount ? that.defaults.animateTime : (that.options.dataCount <= that.defaults.axisMaxAnimateCount ? 25 : 10);

            if (typeof needAnimate === 'undefined') {
                needAnimate = true;
            }

            if (index in that.data.horizontalAxis.dividers) {
                var divider = that.data.horizontalAxis.dividers[index],
                    lineDivider = divider.line,
                    textDivider = divider.text;

                if (needAnimate) {
                    lineDivider.animate(animateTime).opacity(0).after(function() { this.remove(); });
                    textDivider.animate(animateTime).opacity(0).after(function() { this.remove(); });
                } else {
                    lineDivider.remove();
                    textDivider.remove();
                }

                delete that.data.horizontalAxis.dividers[index];
            }

            if (onComplete && $.isFunction(onComplete)) {
                setTimeout(onComplete, 5);
            }
        };

        this._hideCandle = function(index, onComplete) {
            var candle = that.data.candles[index],
                line = candle.line,
                rect = candle.rect;

            line.animate(25).opacity(0);
            rect.animate(25).opacity(0);

            if (onComplete && $.isFunction(onComplete)) {
                setTimeout(onComplete, 5);
            }
        };

        this._showCandle = function(index, onComplete) {
            var candle = that.data.candles[index],
                line = candle.line,
                rect = candle.rect;

            line.opacity(1);
            rect.opacity(1);

            if (onComplete && $.isFunction(onComplete)) {
                setTimeout(onComplete, 10);
            }
        };

        this._hideVolume = function(index, onComplete) {
            var volume = that.data.volumes[index],
                rect = volume.rect;

            rect.animate(25).opacity(0);

            if (onComplete && $.isFunction(onComplete)) {
                setTimeout(onComplete, 5);
            }
        };

        this._showVolume = function(index, onComplete) {
            var volume = that.data.volumes[index],
                rect = volume.rect;

            rect.opacity(1);

            if (onComplete && $.isFunction(onComplete)) {
                setTimeout(onComplete, 5);
            }
        };

        this._update = function(dataStartIndex, dataEndIndex, onComplete) {

            if (that._checkIsBusy('update', _(arguments).toArray(), true)) {
                return false;
            }

            that.options.isBusy = true;

            setTimeout(function() {
                // здесь пересчитываем и меняем ебаные вертикальные метки
                var needRecalculate = that._recalculateIntervals(dataStartIndex, dataEndIndex);

                that._calculateChartIntervals(needRecalculate.data, false, needRecalculate.volume, false, dataEndIndex - dataStartIndex + 1);

                if ((that.settings.dataEndIndex - that.settings.dataStartIndex) != (dataEndIndex - dataStartIndex)) {
                    that._recalculateHorizontalAxisLabelInterval();
                }

                if (needRecalculate.volume) {
                    that.data.volumeAxis.max.text.attr({text: that._prepareNumberToLabel(that.options.volumeChartMaxValue)});
                }

                if (needRecalculate.data) {
                    that._redrawVerticalAxis();
                }

                // TODO: улучшить перфоманс!!! (ТОРМОЗИТ ЗДЕСЬ)
                setTimeout(function() {
                    that._redrawHorizontalAxis(dataStartIndex, dataEndIndex);
                }, 10);

                that._updateCandles(dataStartIndex, dataEndIndex, needRecalculate.data, (that.settings.dataEndIndex - that.settings.dataStartIndex) != (dataEndIndex - dataStartIndex), false);
                that._updateVolumes(dataStartIndex, dataEndIndex, needRecalculate.volume, false);

                that.settings.dataStartIndex = dataStartIndex;
                that.settings.dataEndIndex = dataEndIndex;

                that.options.dataCount = dataEndIndex - dataStartIndex + 1;

                setTimeout(function() {
                    that.options.isBusy = false;
                    if (onComplete && $.isFunction(onComplete)) {
                        onComplete();
                    }

                    that._checkCallStack();
                }, 10);
            }, 5);
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
    };

    var pluginsInit = function() {
        return new TradeChart();
    };

    $.fn.tradeChart = pluginsInit;
    $.tradeChart = pluginsInit;

})(jQuery);