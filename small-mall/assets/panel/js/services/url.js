/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:36 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .service('url', ['SETTINGS', '$http', '$rootScope', '$location', '$timeout', '$routeParams', function (SETTINGS, $http, $rootScope, $location, $timeout, $routeParams) {


        var useHash = SETTINGS.useHash,
            pathSeparator = '/';

        var url = {
            currentPath: function() {
                var pathName = useHash ? $location.hash() : $location.path(),
                    pathParts = pathName.replace(/^\/|\/$|^#/g, '').split(pathSeparator);

                return {
                    service: pathParts[0] ? pathParts[0] : null,
                    method: pathParts[1] ? pathParts[1] : null
                };
            },
            _formPath: function(service, method, parameters, needExtendRouteParams) {
                if (typeof needExtendRouteParams == 'undefined') { needExtendRouteParams = true; }
                if (needExtendRouteParams) { parameters = angular.extend($routeParams, parameters); }
                return (useHash ? '#' : '') + '/' + service + '/' + method + (_.size(parameters) > 0 ? '?' + $.param(parameters) : '');
            },
            _formPathArray: function(address, parameters, needExtendRouteParams) {
                if (typeof needExtendRouteParams == 'undefined') { needExtendRouteParams = true; }
                if (needExtendRouteParams) { parameters = angular.extend($routeParams, parameters); }
                return (useHash ? '#' : '') + '/' + address.join('/') + (_.size(parameters) > 0 ? '?' + $.param(parameters) : '');
            },
            getPath: function(service, method, parameters) {
                var parametersCurrent = parameters ? parameters : {};
                return url._formPath(service, method, parametersCurrent);
            },
            formPath: function(service, method, parameters) {

                var parametersCurrent = parameters ? parameters : {},
                    currentPath = url.currentPath();

                service = service ? service : currentPath.service;
                method = method ? method : currentPath.method ? currentPath.method : 'index';

                return url._formPath(service, method, parametersCurrent);
            },
            formPathArray: function(address, parameters) {

                var parametersCurrent = parameters ? parameters : {};

                return url._formPathArray(address, parametersCurrent, false);
            },
            formPathAbsolute: function(service, method, parameters) {

                var parametersCurrent = parameters ? parameters : {};
                return url._formPath(service, method, parametersCurrent, false);
            },
            getParameters: function() {

                var routeParams = $routeParams;
                if (_.size(routeParams) > 0) {
                    for (var paramKey in routeParams) {
                        routeParams[paramKey] = decodeURI(routeParams[paramKey].toString().replace(/[+]/g," "));
                    }
                }

                return routeParams;
            }
        };

        return url;
    }]);
