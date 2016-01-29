/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Sep/29/13
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jquery'], function() {

(function($) {

    var TradeParser = function() {
        var that = this;

        this.settings = {
            $logsContainer: null,
            dataStart: null,
            dataEnd: null
        };

        this.options = {
            isStarted: false,
            dateStart: null,
            dateEnd: null,
            dateCurrent: null,
            $logsContainer: null,
            $notificationsContainer: null,
            $logsCounter: null,
            $notificationsCounter: null,
            parserUrl: null,
            actives: [],
            activeIndex: 0,
            originalTitle: ''
        };

        this.init = function(settings) {
            $.extend(that.settings, settings);

            that.options.$logsContainer = settings.$logsContainer;
            that.options.$notificationsContainer = settings.$notificationsContainer;

            that.options.$logsCounter = settings.$logsCounter;
            that.options.$notificationsCounter = settings.$notificationsCounter;

            that.options.parserUrl = settings.parserUrl;

            that.options.originalTitle = $('title').text();

            return that;
        };

        this.start = function(options) {
            that.options.isStarted = true;

//            that.options.$logsContainer.empty();

            that._log('Parser started', 'warning');

            if (!options || !options.actives || !$.isArray(options.actives) || options.actives.length == 0) {
                that._log('Parser stopped: no actives', 'error');
                return;
            }

            that.options.actives = options.actives;
            that.options.dateStart = options.dateStart;
            that.options.dateEnd = options.dateEnd;

            that._log('Date start: ' + that.options.dateStart.toString() + '. Date end: ' + that.options.dateEnd.toString(), 'info');

            if (that.options.dateEnd.getTime() >= that.options.dateStart.getTime()) {
                that.options.dateCurrent = that.options.dateStart;
                that.options.activeIndex = 0;
                that._start(that.options.actives[that.options.activeIndex]);
            } else {
                that._log('Parser ended', 'warning');
            }

            return that;
        };

        this.stop = function() {
            that.options.isStarted = false;
            that._log('Parser stopped', 'warning');
            $('title').text(that.options.originalTitle);

            return that;
        };

        this.error = function(message) {
            that._log(message, 'error');
        };

        this._start = function(active) {
            that._log('Start parsing. Active: '+active+'. Date: ' + that.options.dateCurrent.toString(), 'info');
            $('title').text(active + ', ' + that.options.dateCurrent.toString());

            $.ajax({
                url: that.options.parserUrl,
                type: 'post',
                dataType: 'json',
                data: {
                    needParse: 1,
                    ys: that.options.dateCurrent.getFullYear(),
                    ms: that.options.dateCurrent.getMonth() + 1,
                    ds: that.options.dateCurrent.getDate(),
                    yf: that.options.dateCurrent.getFullYear(),
                    mf: that.options.dateCurrent.getMonth() + 1,
                    df: that.options.dateCurrent.getDate(),
                    active: active
                },
                success: function(json) {
                    that._log(json.message, json.class);

                    if (typeof json.notifications != undefined && $.isArray(json.notifications) && json.notifications.length > 0) {
                        var notificationCounter;
                        for (notificationCounter in json.notifications) {
                            that._notificate(json.notifications[notificationCounter].message, json.notifications[notificationCounter].class);
                        }
                    }

                    if (json.status == 'success') {
                        that.options.activeIndex++;
                        if (typeof that.options.actives[that.options.activeIndex] == 'undefined') {
                            that.options.activeIndex = 0;
                            that.options.dateCurrent = new Date(that.options.dateCurrent.getFullYear(), that.options.dateCurrent.getMonth(), that.options.dateCurrent.getDate() + 1);
                        }
                        if (that.options.isStarted && that.options.dateEnd.getTime() >= that.options.dateCurrent.getTime()) {
                            setTimeout(function() {
                                that._start(that.options.actives[that.options.activeIndex]);
                            }, 1500);
                        } else {
                            that._log('Parser ended', 'warning');
                            $('title').text(that.options.originalTitle);
                        }
                    } else {
                        that._log('Parser ended', 'warning');
                        $('title').text(that.options.originalTitle);
                    }
                },
                error: function() {
                    that._log('Oops! Something went wrong!', 'error');
                    $('title').text(that.options.originalTitle);
                }
            });
        };

        this._log = function(message, type) {
            var $message = $('<div class="alert alert-'+type+'">[' + Date().toString() + ']: '+message+'<a href="#" class="close" data-dismiss="alert">&times;</a></div>').prependTo(that.options.$logsContainer),
                currentCount = parseInt(that.options.$logsCounter.attr('data-count')) + 1;

            that.options.$logsCounter.html(currentCount.toString());
            that.options.$logsCounter.attr('data-count', currentCount.toString());

            $message.find('a[data-dismiss="alert"]').on('click', function() {
                var currentCount = parseInt(that.options.$logsCounter.attr('data-count')) - 1;

                that.options.$logsCounter.html(currentCount.toString());
                that.options.$logsCounter.attr('data-count', currentCount.toString());
            });
        };

        this._notificate = function(message, type) {
            var $message = $('<div class="alert alert-'+type+'">[' + Date().toString() + ']: '+message+'<a href="#" class="close" data-dismiss="alert">&times;</a></div>').prependTo(that.options.$notificationsContainer),
                currentCount = parseInt(that.options.$notificationsCounter.attr('data-count')) + 1;

            that.options.$notificationsCounter.html(currentCount.toString());
            that.options.$notificationsCounter.attr('data-count', currentCount.toString());

            $message.find('a[data-dismiss="alert"]').on('click', function() {
                var currentCount = parseInt(that.options.$notificationsCounter.attr('data-count')) - 1;

                that.options.$notificationsCounter.html(currentCount.toString());
                that.options.$notificationsCounter.attr('data-count', currentCount.toString());
            });
        };

        this.clearLogs = function() {
            that.options.$logsContainer.html('');

            that.options.$logsCounter.html('0');
            that.options.$logsCounter.attr('data-count', '0');
        };

        this.clearNotifications = function() {
            that.options.$notificationsContainer.html('');
            that.options.$notificationsCounter.html('0');
            that.options.$notificationsCounter.attr('data-count', '0');
        };
    };

    var pluginsInit = function() {
        return new TradeParser();
    };

    $.fn.tradeParser = pluginsInit;
    $.tradeParser = pluginsInit;

})(window.jQuery);

});