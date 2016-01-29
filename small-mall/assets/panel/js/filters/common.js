/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:40 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .filter('nl2br', function() {
        return function(text) {
            return text ? text.replace(/\n/g, '<br/>') : text;
        };
    })
    .filter('toTrusted', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
