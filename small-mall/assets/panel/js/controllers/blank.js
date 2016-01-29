/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:42 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .controller('blankController', ['$scope', '$rootScope', 'api', function ($scope, $rootScope, api) {
        api.authorization();
        api.showProgress();
    }]);
