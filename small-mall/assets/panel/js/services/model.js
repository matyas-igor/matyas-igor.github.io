/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:36 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .service('model', ['SETTINGS', '$http', '$rootScope', '$location', '$timeout', '$routeParams', 'api', function (SETTINGS, $http, $rootScope, $location, $timeout, $routeParams, api) {
        $rootScope.Storage = {};

        var model = {
            setData: function(service, field, value) {
                $timeout(function() {
                    if (typeof $rootScope.Storage[service] == 'undefined') {
                        $rootScope.Storage[service] = {};
                    }
                    $rootScope.Storage[service][field] = value;
//                    console.log(service, field, value);
                });
            },
            getData: function(service, field) {
                if ($rootScope.Storage[service] && typeof $rootScope.Storage[service][field] != 'undefined') {
                    return $rootScope.Storage[service][field];
                }
                return null;
            },
            loadData: function(action, data, service, field, onCompleteDataProcess, onBeforeSend, onComplete) {
                api.call(action, data, function(json) {
                    if (json && json.success && json.data) {
                        model.setData(service, field, onCompleteDataProcess ? onCompleteDataProcess(json.data) : json.data);
                    }
                }, onBeforeSend, onComplete);
            },
            _checkStorage: function() {
                try {
                    return 'localStorage' in window && window['localStorage'] !== null;
                } catch (e) {
                    return false;
                }
            },
            getDataFromStorage: function(key) {
                if (!model._checkStorage()) {
                    return null;
                }
                return window.localStorage.getItem(key);
            },
            setDataInStorage: function(key, value) {
                if (!model._checkStorage()) {
                    return null;
                }
                return window.localStorage.setItem(key, value);
            }
        };

        return model;
    }]);
