<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Trades Parser</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <? include_once('inc/tradesStyles.php'); ?>
</head>

<?
global $actives;
include_once('inc/tradesConfig.php');
$currentTopMenu = 'parser';
?>

<body>

<? include_once('inc/tradesTopMenu.php'); ?>

<div class="container">

    <form class="form-inline">
        <div class="clearfix">
            <label for="tradesDateStart" class="checkbox">Date start: </label> <input type="text" class="input-small datepicker" id="tradesDateStart" />
            <label for="tradesDateEnd" class="checkbox">Date end: </label> <input type="text" class="input-small datepicker" id="tradesDateEnd" />
            <button class="btn btn-primary" id="tradesStartParsingButton">Start parsing</button>
            <button class="btn btn-danger" id="tradesStopParsingButton">Stop parsing</button>
            <button class="btn btn-inverse" id="tradesClearLogsButton">Clear logs</button>
            <button class="btn btn-inverse" id="tradesClearNotificationsButton">Clear notifications</button>
        </div>
        <div class="clearfix">
            <? foreach ($actives as $active): ?>
                <label class="checkbox inline"><input type="checkbox" <? /*checked="checked"*/ ?> value="<?=$active?>" class="tradesActiveCheckbox" /> <?=$active?></label>
            <? endforeach; ?>
        </div>
    </form>

    <ul class="nav nav-tabs bootstrap-tabs">
        <li class="active"><a href="#tab-logs" data-toggle="tab">Logs (<span id="tradesLogsCounter" data-count="0">0</span>)</a></li>
        <li><a href="#tab-notifications" data-toggle="tab">Notifications (<span id="tradesNotificationsCounter" data-count="0">0</span>)</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="tab-logs">
            <div id="tradesLogsContainer"></div>
        </div>
        <div class="tab-pane" id="tab-notifications">
            <div id="tradesNotificationsContainer"></div>
        </div>
    </div>
</div>
<!-- /container -->

<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="assets/vendor/require/require.js"></script>
<script>
    require.config({
        baseUrl: '/assets',
        paths: {
            jquery: 'vendor/jquery/jquery-1.10.2',
            underscore: 'vendor/underscore/underscore-min'
        }
    });

    require(['jquery', 'vendor/datepicker/js/bootstrap-datepicker', 'vendor/bootstrap/js/bootstrap.min', 'tradeParser/tradeParser'], function() {

        (function($) {
            $('.datepicker').datepicker({
                format: 'dd.mm.yyyy',
                weekStart: 1
            });

            var tradeParser = $.tradeParser().init({
                $logsContainer: $('#tradesLogsContainer'),
                $notificationsContainer: $('#tradesNotificationsContainer'),
                $logsCounter: $('#tradesLogsCounter'),
                $notificationsCounter: $('#tradesNotificationsCounter'),
                parserUrl: '/ajax/tradesParser.php'
            });

            $('#tradesStartParsingButton').on('click', function(event) {
                event.preventDefault();

                var actives = [],
                    $activesCheckboxes = $('.tradesActiveCheckbox:checked');

                if ($activesCheckboxes.length > 0) {
                    $activesCheckboxes.each(function() {
                        actives.push($(this).val());
                    });
                }

                var dateStartString = $('#tradesDateStart').val(),
                    dateEndString = $('#tradesDateEnd').val();

                if (!dateStartString || !dateEndString) {
                    tradeParser.error('Wrong start or end dates');
                    return;
                }

                var dateStart = new Date(parseInt(dateStartString.substr(6, 4)), parseInt(dateStartString.substr(3, 2)) - 1, parseInt(dateStartString.substr(0, 2))),
                    dateEnd = new Date(parseInt(dateEndString.substr(6, 4)), parseInt(dateEndString.substr(3, 2)) - 1, parseInt(dateEndString.substr(0, 2)));

                tradeParser.start({
                    actives: actives,
                    dateStart: dateStart,
                    dateEnd: dateEnd
                });
            });

            $('#tradesStopParsingButton').on('click', function(event) {
                event.preventDefault();
                tradeParser.stop();
            });

            $('#tradesLogsContainer, #tradesNotificationsContainer').on('click', '.tradesReloadLink', function(event) {
                event.preventDefault();

                var active = $(this).attr('data-active'),
                    day = parseInt($(this).attr('data-day')),
                    month = parseInt($(this).attr('data-month')),
                    year = parseInt($(this).attr('data-year')),
                    date = new Date(year, month - 1, day);

                tradeParser.stop().start({
                    actives: [active],
                    dateStart: date,
                    dateEnd: date
                });

                $(this).parent('.alert').find('a[data-dismiss="alert"]').triggerHandler('click');
                $(this).parent('.alert').remove();

            });

            $('#tradesClearLogsButton').on('click', function(event) {
                event.preventDefault();
                tradeParser.clearLogs();
            });

            $('#tradesClearNotificationsButton').on('click', function(event) {
                event.preventDefault();
                tradeParser.clearNotifications();
            });

        })(window.jQuery);
    });

</script>
</body>
</html>