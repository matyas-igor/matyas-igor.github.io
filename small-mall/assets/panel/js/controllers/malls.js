/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Feb/11/14
 * Time: 11:50 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .config(function (SETTINGS, $routeProvider, $locationProvider) {

        $routeProvider
            .when('/mall/:mallId', {templateUrl: SETTINGS.templatesUrl + 'controllers/malls/index.html', controller: 'mallsIndex'})
            .when('/mall/:mallId/offers/:offersTypeId', {templateUrl: SETTINGS.templatesUrl + 'controllers/malls/index.html', controller: 'mallsIndex'})
            .when('/mall/:mallId/coupon/:couponId', {templateUrl: SETTINGS.templatesUrl + 'controllers/malls/coupon.html', controller: 'mallsCoupon'})
    })
    .controller('mallsIndex', ['$scope', '$rootScope', '$location', '$routeParams', 'api', 'url', 'model', function ($scope, $rootScope, $location, $routeParams, api, url, model) {

        if (!$routeParams.offersTypeId) {
            $location.path(url.formPathArray(['mall', $routeParams.mallId, 'offers', 'food']));
        }

        model.setData('navigation', 'backLink', null);
        model.setData('malls', 'offersTypeId', $routeParams.offersTypeId);
        model.setData('malls', 'mallId', $routeParams.mallId);

        model.setData('common', 'title', null);
        model.setData('malls', 'index', null);

        api.call('coupons/list', {mallId: $routeParams.mallId, offersTypeId: $routeParams.offersTypeId}, function(json) {
            if (json && json.success) {
                model.setData('malls', 'index', json.data);
                model.setData('common', 'title', json.data.mall.name);
            }
        });
    }])
    .controller('mallsCoupon', ['$scope', '$rootScope', '$location', '$routeParams', 'api', 'url', 'model', function ($scope, $rootScope, $location, $routeParams, api, url, model) {
        model.setData('navigation', 'backLink', null);
        model.setData('common', 'title', null);
        model.setData('malls', 'coupon', null);
        api.call('coupons/get', {couponId: $routeParams.couponId}, function(json) {
            if (json && json.success) {
                model.setData('malls', 'coupon', json.data.coupon);
                model.setData('common', 'title', json.data.coupon.name);
                model.setData('navigation', 'backLink', url.formPathArray(['mall', $routeParams.mallId]));
            }
        })
    }]);