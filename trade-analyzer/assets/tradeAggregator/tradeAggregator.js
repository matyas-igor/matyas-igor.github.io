/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Sep/29/13
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery'], function() {

(function($) {

    var TradeAggregator = function() {
        var that = this;

        this.settings = {
            $messagesContainer: null,
            dataStart: null,
            dataEnd: null,
            type: '1D'
        };

        this.options = {
            isStarted: false,
            dateStart: null,
            dateEnd: null,
            dateCurrent: null,
            $messagesContainer: null,
            aggregatorUrl: null,
            originalTitle: '',
            parameters: {}
        };

        this.init = function(settings) {
            $.extend(that.settings, settings);

            that.options.$messagesContainer = settings.$messagesContainer;
            that.options.aggregatorUrl = settings.aggregatorUrl;

            that.options.originalTitle = $('title').text();

            return that;
        };

        this.start = function(options) {

            that.options.isStarted = true;

            that._console('Aggregator started', 'warning');

            if (!options || !options.active) {
                that._console('Aggregator stopped: no active select', 'error');
                return;
            }

            that.options.dateStart = options.dateStart;
            that.options.dateEnd = options.dateEnd;
            that.settings.type = options.type;

            if (typeof options.parameters != 'undefined') that.options.parameters = options.parameters;

            that._console('Date start: ' + that.options.dateStart.toString() + '. Date end: ' + that.options.dateEnd.toString(), 'info');

            if (that.settings.type == '1D') {
                if (that.options.dateEnd.getTime() >= that.options.dateStart.getTime()) {
                    that.options.dateCurrent = that.options.dateStart;
                    that._start(options.active);
                } else {
                    that._console('Aggregator ended', 'warning');
                }
            }
            if (that.settings.type == '1W') {
                that._startWeek(options.active, that.options.dateStart, that.options.dateEnd);
            }
        };

        this.stop = function() {
            that.options.isStarted = false;
            that._console('Aggregator stopped', 'warning');
            $('title').text(that.options.originalTitle);
        };

        this.error = function(message) {
            that._console(message, 'error');
        };

        this._start = function(active) {
            that._console('Start aggregating. Active: '+active+'. Date: ' + that.options.dateCurrent.toString(), 'info');
            $('title').text(active + ', ' + that.options.dateCurrent.toString());

            $.ajax({
                url: that.options.aggregatorUrl,
                type: 'post',
                dataType: 'json',
                data: {
                    needAggregate: 1,
                    date: {
                        year: that.options.dateCurrent.getFullYear(),
                        month: that.options.dateCurrent.getMonth() + 1,
                        day: that.options.dateCurrent.getDate()
                    },
                    active: active,
                    type: that.settings.type,
                    parameters: that.options.parameters
                },
                success: function(json) {

                    that._console(json.message, json.class);

                    if (json.status == 'success') {
                        that.options.dateCurrent = new Date(that.options.dateCurrent.getFullYear(), that.options.dateCurrent.getMonth(), that.options.dateCurrent.getDate() + 1);

                        if (that.options.isStarted && that.options.dateEnd.getTime() >= that.options.dateCurrent.getTime()) {
                            setTimeout(function() {
                                that._start(active);
                            }, 1500);
                        } else {
                            that._console('Aggregator ended', 'warning');
                            $('title').text(that.options.originalTitle);
                        }
                    } else {
                        that._console('Aggregator ended', 'warning');
                        $('title').text(that.options.originalTitle);
                    }

                },
                error: function() {
                    that._console('Oops! Something went wrong!', 'error');
                    $('title').text(that.options.originalTitle);
                }
            });
        };

        this._startWeek = function(active, dateStart, dateEnd) {
            that._console('Start aggregating. Active: '+active+'. Date start: ' + dateStart.toString(), 'info');
            $('title').text(active + ', ' + dateStart.toString());

            $.ajax({
                url: that.options.aggregatorUrl,
                type: 'post',
                dataType: 'json',
                data: {
                    needAggregate: 1,
                    dateStart: {
                        year: dateStart.getFullYear(),
                        month: dateStart.getMonth() + 1,
                        day: dateStart.getDate()
                    },
                    dateEnd: {
                        year: dateEnd.getFullYear(),
                        month: dateEnd.getMonth() + 1,
                        day: dateEnd.getDate()
                    },
                    active: active,
                    type: that.settings.type,
                    parameters: that.options.parameters
                },
                success: function(json) {

                    that._console(json.message, json.class);

                    that._console('Aggregator ended', 'warning');
                    $('title').text(that.options.originalTitle);
                },
                error: function() {
                    that._console('Oops! Something went wrong!', 'error');
                    $('title').text(that.options.originalTitle);
                }
            });
        };

        this._console = function(message, type) {
            that.options.$messagesContainer.prepend('<div class="alert alert-'+type+'">[' + Date().toString() + ']: '+message+'</div>');
        };

    };

    var pluginsInit = function() {
        return new TradeAggregator();
    };

    $.fn.tradeAggregator = pluginsInit;
    $.tradeAggregator = pluginsInit;

})(window.jQuery);

});