/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Feb/11/14
 * Time: 6:52 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

// Declare app level module which depends on filters, and services
var web = angular.module('web', [
        'ngRoute',
        'ngTouch',
        'ngResource',
        'mobile-angular-ui',

        'mobile-angular-ui.pointer-events',     // prevents actions on disabled elements
        'mobile-angular-ui.active-links',       // add .active class to active links
        'mobile-angular-ui.fastclick',          // provides touch events with fastclick
        'mobile-angular-ui.scrollable'         // polyfills overflow:auto with overthrow

//        'mobile-angular-ui.directives.toggle',
//        'mobile-angular-ui.directives.overlay',
//        'mobile-angular-ui.directives.forms',
//        'mobile-angular-ui.directives.panels',
//        'mobile-angular-ui.directives.capture',
//        'mobile-angular-ui.directives.sidebars',
//        'mobile-angular-ui.directives.navbars',
//        'mobile-angular-ui.directives.carousel'
    ])
    .config(function (SETTINGS, $routeProvider, $locationProvider) {

        $routeProvider
            .otherwise({redirectTo: SETTINGS.startUrl});

        $locationProvider.html5Mode(true);
    })
    .run(['$rootScope', '$timeout', '$interval', 'api', 'url', 'model', 'common', 'SETTINGS', function ($rootScope, $timeout, $interval, api, url, model, common, SETTINGS) {

        var settings = {
            isFluid: common.getFluid()
        };

        $rootScope.Settings = angular.extend(SETTINGS, settings);

        $rootScope.Locals = {};
        $rootScope.Globals = {};

        $rootScope.Url = url;

        $rootScope.Math = mathjs();
        $rootScope.Moment = moment;

        $rootScope.$on("$routeChangeStart", function() {
            model.setData('common', 'loading', true);
        });
        $rootScope.$on("$routeChangeSuccess", function() {
            model.setData('common', 'loading', false);
        });

        $interval(function() { $rootScope.$broadcast('common.timer.update'); }, 1000);

    }]);