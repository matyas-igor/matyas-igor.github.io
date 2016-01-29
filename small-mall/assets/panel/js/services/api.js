/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:35 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .service('api', ['SETTINGS', '$http', '$rootScope', '$location', '$timeout', '$routeParams', 'messages', function (SETTINGS, $http, $rootScope, $location, $timeout, $routeParams, messages) {
        var api = {
            _send: function(url, data, onSuccess, onBeforeSend, onComplete) {
                NProgress.start();

                var that = this;

                onBeforeSend ? onBeforeSend() : null;

                if (data && typeof data.data != 'undefined') {
                    data.data = angular.toJson(data.data);
                }
                if (!data) {
                    data = {};
                }

                $http({
                    withCredentials: true,
                    crossDomain: true,
                    url: url,
                    method: 'post',
                    responseType: 'json',
                    data: data,
                    dataType: 'json'
                })
                    .success(function (json, status, headers, config) {
                        NProgress.done();

                        if (json && json.message && angular.isObject(json.message) && typeof json.message.success != 'undefined' && typeof json.message.text != 'undefined') {
                            messages.add(json.message);
                        }

                        if (json && typeof json.success != 'undefined' && json.success === false && json.message == "Unauthorized") {
                            $rootScope.User = false;
                            $location.path(SETTINGS.startUrl);
                        } else {
                            onSuccess ? onSuccess(json) : null;
                            onComplete ? onComplete() : null;
                        }
                    })
                    .error(function(json, status, headers, config) {
                        onSuccess ? onSuccess(null) : null;
                        onComplete ? onComplete() : null;
                    });
            },
            log: function(success, text) {
                messages.add({success: success, text: text, date: (new Date()).toString()});
            },

            call: function(action, data, onSuccess, onBeforeSend, onComplete) {
                this._send(SETTINGS.apiUrl + "?method="+action, data, onSuccess, onBeforeSend, onComplete);
            },
            callStack: function(callsArray, onComplete) {
                var callCount = callsArray.length,
                    callCounter = 0;

                var makeCall = function(callIndex, callsArray) {
                    var call = callsArray[callIndex],
                        callOnSuccess = function(call) {
                            return function(json) {
                                call.onSuccess ? call.onSuccess(json) : $.noop();
                                callCounter++;
                                if (callCounter == callCount) {
                                    onComplete ? onComplete() : $.noop();
                                }
                            };
                        };

                    $timeout(function() {
                        api.call(call.action, call.data, callOnSuccess(call), call.onBeforeSend ? call.onBeforeSend : $.noop, call.onComplete ? call.onComplete : $.noop);
                    }, (callIndex + 1) * 100);
                };

                for (var callIndex in callsArray) {
                    makeCall(callIndex, callsArray);
                }
            },
            showProgress: function() {
                $timeout(function() { NProgress.start(); }, 10);
                $timeout(function() { NProgress.done(); }, Math.floor((Math.random() * 300) + 300));
                $timeout(function() { NProgress.remove(); }, 5050);
            }
        };

        return api;
    }]);