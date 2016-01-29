/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 4:36 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .service('messages', ['SETTINGS', '$http', '$rootScope', '$location', '$timeout', '$routeParams', function (SETTINGS, $http, $rootScope, $location, $timeout, $routeParams) {
        $rootScope.Messages = {};

        var messageId = 0,
            messageRemoveTime = 3000,
            setTimerMessageRemove = function(messageId) {
                $timeout(function() {
                    if ($rootScope.Messages[messageId]) {
                        delete $rootScope.Messages[messageId];
                    }
                }, messageRemoveTime);
            };

        return {
            add: function(message) {
                $rootScope.Messages[messageId.toString()] = message;
                setTimerMessageRemove(messageId.toString());
                messageId++;
            }
        };
    }]);