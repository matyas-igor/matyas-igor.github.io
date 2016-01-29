/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:41 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .controller('globalController', ['$scope', '$rootScope', 'model', function ($scope, $rootScope, model, SETTINGS) {
        $scope.submitLogout = function() {
            api.call(SETTINGS.apiUrls['auth/logout'], {}, function(json) {
                if (json && json.success === true) {
                    $rootScope.User = null;
                }
                $location.url(SETTINGS.startUrl);
            });
        };
    }]);
