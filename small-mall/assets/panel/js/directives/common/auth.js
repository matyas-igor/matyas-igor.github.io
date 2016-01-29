/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:44 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .directive('login', function($rootScope, $location, $filter, $timeout, $interval, SETTINGS, api, url) {
        return {
            restrict: 'A',
            templateUrl: SETTINGS.templatesUrl + 'directives/common/login.html',
            link: function($scope, element, attrs, controller) {

                $scope.Locals.userLogin = null;

                $scope.submitLogin = function() {

                    api.call(SETTINGS.apiUrls['auth/login'], $scope.userLogin, function(json) {

                        if (json && json.success === true && json.data && json.data.id && json.data.email && json.data.type) {
                            $rootScope.User = json.data;
                            $location.path(url.formPathAbsolute(SETTINGS.startService, SETTINGS.startMethod));

                        } else if (json && json.success === false && json.message) {
                            messages.add('Wrong email or password');
                            $rootScope.User = null;
                            $location.url(SETTINGS.startUrl);
                        } else {
                            messages.add('Can\'t login');
                            $rootScope.User = null;
                            $location.url(SETTINGS.startUrl);
                        }
                    });

                };
            }
        }
    });
