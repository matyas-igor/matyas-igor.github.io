/**
 * Created with JetBrains PhpStorm.
 * User: admin
 * Date: Jun/26/14
 * Time: 10:09 PM
 * To change this template use File | Settings | File Templates.
 */

web
    .directive('stopwatch', function($rootScope, $location, $filter, $timeout, $interval, SETTINGS, api, model, url) {
        return {
            restrict: 'A',
            scope: {
                start: '@',
                end: '@'
            },
            template: '{{Locals.time}}',
            link: function($scope, element, attrs, controller) {

                if (!$scope.Locals) { $scope.Locals = {}; }

                $scope.Locals.time = null;

                var formatTime = function(time) {

                        var time = time / 1000,
                            daysCount = Math.floor(time / (60 * 60 * 24)),
                            hoursCount = Math.floor((time - daysCount * 60 * 60 * 24) / (60 * 60)),
                            minutesCount = Math.floor((time - daysCount * 60 * 60 * 24 - hoursCount * 60 * 60) / 60),
                            secondsCount = Math.floor(time - daysCount * 60 * 60 * 24 - hoursCount * 60 * 60 - minutesCount * 60),
                            timeString = '';

                        if (daysCount == 0 && hoursCount == 0 && minutesCount == 0) {
                            if (secondsCount <= 0) {
                                return 'Now';
                            } else {
                                return secondsCount.toString() + ' ' + (secondsCount > 1 ? 'seconds' : 'second') + ' ago';
                            }
                        }

                        if (daysCount > 0) {
                            timeString += daysCount + ' ' + (daysCount > 1 ? 'days' : 'day') + ' ';
                        }

                        timeString += hoursCount.toString().replace(/^(\d)$/, '0$1') + ':' + minutesCount.toString().replace(/^(\d)$/, '0$1') + ':' + secondsCount.toString().replace(/^(\d)$/, '0$1');

                        return timeString;
                    },
                    updateDate = function() {
                        if (attrs.start) {
                            var dateStart = moment(attrs.start).toDate(),
                                dateEnd = attrs.end ? moment(attrs.end).toDate() : moment().toDate();
                            $scope.Locals.time = formatTime(dateEnd.getTime() - dateStart.getTime());
                        } else {
                            $scope.Locals.time = 'Now';
                        }
                    };

                updateDate();

                if (!attrs.end) {
                    $rootScope.$on('common.timer.update', updateDate);
                }
            }
        }
    });
