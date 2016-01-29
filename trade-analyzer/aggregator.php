<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Trades Aggregator</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <? include_once('inc/tradesStyles.php'); ?>
</head>

<?
global $actives;
include_once('inc/tradesConfig.php');
$currentTopMenu = 'aggregator';
?>

<body>

<? include_once('inc/tradesTopMenu.php'); ?>

<div class="container">

    <ul class="nav nav-tabs bootstrap-tabs">
        <li class="active"><a href="#tab-days" data-toggle="tab">Days apart</a></li>
        <li><a href="#tab-week" data-toggle="tab">Whole week together</a></li>
    </ul>

    <div class="tab-content">
        <div class="tab-pane active" id="tab-days">
            <form class="form-inline">
                <div class="clearfix">
                    <label for="tradesDateStart" class="checkbox">Date start: </label> <input type="text" class="input-small datepicker" id="tradesDateStart" />
                    <label for="tradesDateEnd" class="checkbox">Date end: </label> <input type="text" class="input-small datepicker" id="tradesDateEnd" />
                    <label for="tradesActive" class="checkbox">Active: </label>
                    <select class="input-small" id="tradesActive">
                        <? foreach ($actives as $active): ?>
                            <option value="<?=$active?>"><?=$active?></option>
                        <? endforeach; ?>
                    </select>
                    <label class="checkbox" for="tradesSubstractHour"><input type="checkbox" id="tradesSubstractHour" value="1" /> Subtract an hour</label>
                    <button class="btn btn-primary" id="tradesStartAggregatingButton">Start aggregate</button>
                </div>
            </form>
        </div>
        <div class="tab-pane" id="tab-week">
            <form class="form-inline">
                <div class="clearfix">
                    <label for="tradesDateWeek" class="checkbox">Date: </label> <input type="text" class="input-small datepicker" id="tradesDateWeek" />
                    <label for="tradesActiveWeek" class="checkbox">Active: </label>
                    <select class="input-small" id="tradesActiveWeek">
                        <? foreach ($actives as $active): ?>
                            <option value="<?=$active?>"><?=$active?></option>
                        <? endforeach; ?>
                    </select>
                    <label class="checkbox" for="tradesSubstractHourWeek"><input type="checkbox" id="tradesSubstractHourWeek" value="1" /> Subtract an hour</label>
                    <button class="btn btn-primary" id="tradesStartAggregatingWeekButton">Start aggregate</button>
                </div>
            </form>
        </div>
    </div>



    <div id="tradesResultsContainer"></div>
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

    require(['jquery', 'vendor/datepicker/js/bootstrap-datepicker', 'vendor/bootstrap/js/bootstrap.min', 'tradeAggregator/tradeAggregator'], function() {

        (function($) {
            $('.datepicker').datepicker({
                format: 'dd.mm.yyyy',
                weekStart: 1
            });

            var tradeAggregator = $.tradeAggregator().init({
                $messagesContainer: $('#tradesResultsContainer'),
                aggregatorUrl: '/ajax/tradesAggregator.php'
            });

            $('#tradesStartAggregatingButton').on('click', function(event) {
                event.preventDefault();

                var active = $('#tradesActive').val(),
                    dateStringStart = $('#tradesDateStart').val(),
                    dateStringEnd = $('#tradesDateEnd').val(),
                    substractHour = $('#tradesSubstractHour:checked').length > 0 ? '1' : '0';

                if (!dateStringStart || !dateStringEnd) {
                    tradeAggregator.error('Wrong start or end date');
                    return;
                }

                var dateStart = new Date(parseInt(dateStringStart.substr(6, 4)), parseInt(dateStringStart.substr(3, 2)) - 1, parseInt(dateStringStart.substr(0, 2))),
                    dateEnd = new Date(parseInt(dateStringEnd.substr(6, 4)), parseInt(dateStringEnd.substr(3, 2)) - 1, parseInt(dateStringEnd.substr(0, 2)));

                tradeAggregator.start({
                    active: active,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    type: '1D',
                    parameters: {
                        substractHour: substractHour
                    }
                });
            });

            $('#tradesStartAggregatingWeekButton').on('click', function(event) {
                event.preventDefault();

                var active = $('#tradesActiveWeek').val(),
                    dateString = $('#tradesDateWeek').val(),
                    substractHour = $('#tradesSubstractHourWeek').length > 0 ? '1' : '0';

                if (!dateString) {
                    tradeAggregator.error('Wrong start or end date');
                    return;
                }

                var dateStart = new Date(parseInt(dateString.substr(6, 4)), parseInt(dateString.substr(3, 2)) - 1, parseInt(dateString.substr(0, 2))),
                    dateEnd = new Date(parseInt(dateString.substr(6, 4)), parseInt(dateString.substr(3, 2)) - 1, parseInt(dateString.substr(0, 2)) + 6);

                tradeAggregator.start({
                    active: active,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    type: '1W',
                    parameters: {
                        substractHour: substractHour
                    }
                });
            });

        })(window.jQuery);
    });

</script>
</body>
</html>