/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:35 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .service('common', ['SETTINGS', '$http', '$rootScope', '$location', '$timeout', '$routeParams', 'messages', 'model', function (SETTINGS, $http, $rootScope, $location, $timeout, $routeParams, messages, model) {
        return {
            getFluid: function() {
                return model.getDataFromStorage('isFluid') != null ? model.getDataFromStorage('isFluid') : SETTINGS.isFluid;
            },
            setFluid: function() {
                this.setFluid(!$rootScope.Settings.isFluid);
            },
            toggleFluid: function(isFluid) {
                $rootScope.Settings.isFluid = isFluid;
                model.setDataInStorage('isFluid', isFluid);
                $timeout(function() { $(window).trigger('resize'); }, 250);
            }
        };
    }]);