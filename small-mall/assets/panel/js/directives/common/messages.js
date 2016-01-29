/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .directive('messages', function($rootScope, $location, $filter, $timeout, $interval, SETTINGS, api) {
        return {
            restrict: 'A',
            templateUrl: SETTINGS.templatesUrl + 'directives/common/messages.html',
            link: function($scope, element, attrs, controller) {}
        }
    });
