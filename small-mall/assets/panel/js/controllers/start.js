/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:39 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .config(['SETTINGS', '$routeProvider', '$locationProvider', function (SETTINGS, $routeProvider, $locationProvider) {

        $routeProvider
            .when('/start/index', {
                templateUrl: SETTINGS.templatesUrl + 'start.html',
                controller: 'startController'
            })
            .otherwise({redirectTo: SETTINGS.startUrl});

        $locationProvider.html5Mode(true);
    }])
    .controller('startController', ['$scope', '$rootScope', '$location', 'api', 'url', function ($scope, $rootScope, $location, api, url) {

    }]);

