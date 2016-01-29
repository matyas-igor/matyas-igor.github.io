<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Trades Analyzer</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <? include_once('inc/tradesStyles.php'); ?>
    <style>
        html, body, #chartsContainer {
            height: 100%;
        }
        body {
            margin: 0; padding: 0;
            max-height: 100%;
            overflow: hidden;
        }
        #bodyWrap {
            padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
        }
        #containerWrap {
            padding-top:110px;
            height: auto;
            min-height:100%;

        }
        #chartsContainer {
            clear: both;
        }
        .chartsContainerCell {float: left;}
    </style>
</head>

<?
global $actives;
include_once('inc/tradesConfig.php');
$currentTopMenu = 'analyzer';

$showForm = isset($_GET['showForm']) ? $_GET['showForm'] == '1' : true;
$showAnalyse = isset($_GET['showAnalyse']) ? $_GET['showAnalyse'] == '1' : false;
$type = $showAnalyse ? $_GET['type'] : false;

function showCellForm($actives, $rowCounter, $columnCounter, $containerWidth, $containerHeight) {
    ?>
    <div class="chartsContainerCell" style="width: <?=$containerWidth?>%; height: 100%;"  id="chartsContainerCell-<?=$rowCounter?>-<?=$columnCounter?>">
        <div class="chartsCellForm" id="chartsCellForm-<?=$rowCounter?>-<?=$columnCounter?>" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>">
            <form class="form-inline" style="margin: 0;">
                <span id="tradesVisibleContainer-<?=$rowCounter?>-<?=$columnCounter?>">
                    <label class="checkbox" for="tradesSelectType-<?=$rowCounter?>-<?=$columnCounter?>">Type: </label>
                    <select id="tradesSelectType-<?=$rowCounter?>-<?=$columnCounter?>" class="input-mini">
                        <option value="1D">1D</option>
                        <option value="1W">1W</option>
                    </select>
                    <label for="tradesDate-<?=$rowCounter?>-<?=$columnCounter?>" class="checkbox">Date: </label>
                    <input type="text" class="input-small datepicker tradesDate" id="tradesDate-<?=$rowCounter?>-<?=$columnCounter?>" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>" />
                    <label for="tradesActive-<?=$rowCounter?>-<?=$columnCounter?>" class="checkbox">Active: </label>
                    <select class="input-small" id="tradesActive-<?=$rowCounter?>-<?=$columnCounter?>" class="tradesActive" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>">
                        <? foreach ($actives as $active): ?>
                            <option value="<?=$active?>"><?=$active?></option>
                        <? endforeach; ?>
                    </select>
                    <button class="btn btn-primary tradesStartAnalyseButton" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>">Analyse</button>
                    <button class="btn btn-danger tradesStartDestroyButton" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>">Destroy</button>
                </span>
                <button class="btn btn-inverse tradesVisibleFormButton" data-type="hide" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>">Hide</button>
                <button class="btn btn-inverse tradesVisibleFormButton" data-type="show" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>" style="display: none;">Show</button>

                <label for="tradesStep-<?=$rowCounter?>-<?=$columnCounter?>" class="checkbox">Step size: </label>
                <input type="text" class="input-mini tradesStep" style="width:30px;" value="5" id="tradesStep-<?=$rowCounter?>-<?=$columnCounter?>" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>" />
                <div class="btn-group">
                    <button class="btn tradesShiftButton" data-type="minus" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>">❮</button>
                    <button class="btn tradesShiftButton" data-type="plus" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>">❯</button>
                </div>
                <div class="btn-group">
                    <button class="btn tradesModeButton" disabled="disabled" data-mode="scroll" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>"><i class="icon icon-handdrag"></i></button>
                    <button class="btn tradesModeButton" data-mode="screenshot" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>"><i class="icon icon-screenshot"></i></button>
                </div>

                <span class="tradesCellStatus" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>" id="tradesCellStatus-<?=$rowCounter?>-<?=$columnCounter?>"></span>
            </form>
        </div>
        <div class="chartsCellGraphsContainer" id="chartsCellGraphsContainer-<?=$rowCounter?>-<?=$columnCounter?>" data-row="<?=$rowCounter?>" data-column="<?=$columnCounter?>"> </div>
    </div>
    <?
}

?>

<body>
    <div id="bodyWrap">
        <? include_once('inc/tradesTopMenu.php'); ?>

        <? if ($showForm): ?>
        <div class="container">

            <ul class="nav nav-tabs bootstrap-tabs">
                <li class="active"><a href="#tab-simpleGrid" data-toggle="tab">Simple grid</a></li>
                <li><a href="#tab-weekGrid" data-toggle="tab">Week grid</a></li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane active" id="tab-simpleGrid">

                    <form class="form-inline" method="get" action="/analyzer.php" style="margin: 0;">
                        <div class="clearfix">
                            <label class="checkbox">Columns count: </label>
                            <select name="columns" style="width: 55px;">
                                <? for ($i = 1; $i <= 10; $i++): ?>
                                    <option value="<?=$i?>" <? if (isset($_GET['columns']) && $_GET['columns'] == $i) { ?>selected="selected"<? } ?>><?=$i?></option>
                                <? endfor; ?>
                            </select>
                            <label class="checkbox">Rows count: </label>
                            <select name="rows" style="width: 55px;">
                                <? for ($i = 1; $i <= 10; $i++): ?>
                                    <option value="<?=$i?>" <? if (isset($_GET['rows']) && $_GET['rows'] == $i) { ?>selected="selected"<? } ?>><?=$i?></option>
                                <? endfor; ?>
                            </select>
                            <input class="btn btn-primary" type="submit" value="Start analyse" />
                            <input type="hidden" name="type" value="simpleGrid" />
                            <input type="hidden" name="showForm" value="0" />
                            <input type="hidden" name="showAnalyse" value="1" />
                        </div>
                    </form>

                </div>
                <div class="tab-pane" id="tab-weekGrid">
                    <form class="form-inline" method="get" action="/analyzer.php" style="margin: 0;">
                        <div class="clearfix">
                            <label class="checkbox">Columns count: </label>
                            <select name="columns" style="width: 55px;">
                                <? for ($i = 1; $i <= 10; $i++): ?>
                                    <option value="<?=$i?>" <? if (isset($_GET['columns']) ? ($_GET['columns'] == $i) : $i == 5) { ?>selected="selected"<? } ?>><?=$i?></option>
                                <? endfor; ?>
                            </select>
                            <label class="checkbox">Week cell position: </label>
                            <select name="position" class="input-small">
                                <option value="top" <? if (isset($_GET['position']) && $_GET['position'] == 'top') { ?>selected="selected"<? } ?>>top</option>
                                <option value="bottom" <? if (isset($_GET['position']) && $_GET['position'] == 'bottom') { ?>selected="selected"<? } ?>>bottom</option>
                            </select>
                            <input class="btn btn-primary" type="submit" value="Start analyse" />
                            <input type="hidden" name="type" value="weekGrid" />
                            <input type="hidden" name="showForm" value="0" />
                            <input type="hidden" name="showAnalyse" value="1" />
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <!-- /container -->
        <? endif; ?>
    </div>
    <?
    if ($showAnalyse) {
        switch ($type) {
            case 'simpleGrid':

                if (isset($_GET['columns']) && intval($_GET['columns']) > 0 && isset($_GET['rows']) && intval($_GET['rows']) > 0) {
                    $columns = intval($_GET['columns']);
                    $rows = intval($_GET['rows']);

                    $containerWidth = round(100 / $columns, 2);
                    $containerHeight = round(100 / $rows, 2);

                    ?>
                    <div id="chartsContainer">
                        <?
                        for ($rowCounter = 1; $rowCounter <= $rows; $rowCounter++) {
                            ?>
                            <div class="chartsContainerRow" style="width: 100%; height: <?=$containerHeight?>%;">
                                <?
                                for ($columnCounter = 1; $columnCounter <= $columns; $columnCounter++) {
                                    showCellForm($actives, $rowCounter, $columnCounter, $containerWidth, $containerHeight);
                                }
                                ?>
                            </div>
                        <?
                        }
                        ?>
                    </div>
                    <?
                }

                break;

            case 'weekGrid':

                if (isset($_GET['columns']) && intval($_GET['columns']) > 0 && isset($_GET['position'])) {
                    $columns = intval($_GET['columns']);
                    $position = $_GET['position'] == 'top' ? 'top' : 'bottom';

                    $rows = 2;

                    $containerWidth = round(100 / $columns, 2);
                    $containerHeight = round(100 / $rows, 2);

                    ?>
                    <div id="chartsContainer">
                        <?
                        for ($rowCounter = 1; $rowCounter <= $rows; $rowCounter++) {
                            ?>
                            <div class="chartsContainerRow" style="width: 100%; height: <?=$containerHeight?>%;">
                                <?
                                if (($rowCounter == 1 && $position == 'top') || ($rowCounter == 2 && $position == 'bottom')) {
                                    showCellForm($actives, $rowCounter, $columnCounter, 100, $containerHeight);
                                } else {
                                    for ($columnCounter = 1; $columnCounter <= $columns; $columnCounter++) {
                                        showCellForm($actives, $rowCounter, $columnCounter, $containerWidth, $containerHeight);
                                    }
                                }
                                ?>
                            </div>
                        <?
                        }
                        ?>
                    </div>
                <?
                }

                break;
        }

    }
    ?>

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

        require(['jquery', 'vendor/datepicker/js/bootstrap-datepicker', 'vendor/bootstrap/js/bootstrap.min', 'tradeChart/tradeChart'], function() {

            (function($) {

                var charts = {};
                $('.chartsCellGraphsContainer').each(function() {
                    var row = $(this).attr('data-row'),
                        column = $(this).attr('data-column'),
                        chartId = 'chartsCellGraphsContainer-'+row+'-'+column;

                    charts[chartId] = $.tradeChart();
                });

                $('.datepicker').datepicker({
                    format: 'dd.mm.yyyy',
                    weekStart: 1
                });

                var resizeChartsContainer = function() {
                    $('#chartsContainer').height($('body').height() - $('#bodyWrap').outerHeight());
                };
                resizeChartsContainer();

                $('.tradesStartDestroyButton').on('click', function(event) {

                    event.preventDefault();

                    var row = $(this).attr('data-row'),
                        column = $(this).attr('data-column'),
                        chartId = 'chartsCellGraphsContainer-'+row+'-'+column;

                    charts[chartId].destroy();
                });

                var chartShiftInterval = null,
                    shiftValue = function($element) {
                        var row = $element.attr('data-row'),
                            column = $element.attr('data-column'),
                            chartId = 'chartsCellGraphsContainer-'+row+'-'+column,
                            value = Math.abs(parseInt($('#tradesStep-'+row+'-'+column).val())),
                            multiplicator = $element.attr('data-type') == 'plus' ? 1 : -1;

                        charts[chartId].shift(value * multiplicator);
                    },
                    $tradesShiftButton = $('.tradesShiftButton');

                $tradesShiftButton.on('click', function() {
                    event.preventDefault();

                    var $element = $(this);

                    shiftValue($element);
                });

                $tradesShiftButton.on('mousedown', function(event) {

                    event.preventDefault();

                    var $element = $(this);

                    if (chartShiftInterval) {
                        clearInterval(chartShiftInterval);
                    }

                    chartShiftInterval = setInterval(function() {
                        shiftValue($element);
                    }, 150);

                    $(window).on('mouseup.chartShiftEvent', function() {
                        if (chartShiftInterval) {
                            clearInterval(chartShiftInterval);
                        }

                        $(window).off('.chartShiftEvent');
                    });
                });

                $('.tradesStartAnalyseButton').on('click', function(event) {

                    event.preventDefault();

                    var row = $(this).attr('data-row'),
                        column = $(this).attr('data-column'),
                        active = $('#tradesActive-'+row+'-'+column).val(),
                        type = $('#tradesSelectType-'+row+'-'+column).val(),
                        dateString = $('#tradesDate-'+row+'-'+column).val(),
                        chartId = 'chartsCellGraphsContainer-'+row+'-'+column;

                    $('#tradesCellStatus-'+row+'-'+column).html('');

                    if (!dateString || !active) {
                        $('#tradesCellStatus-'+row+'-'+column).html('<span class="label label-important">Wrong date or active</label>');
                    }

                    var date = new Date(parseInt(dateString.substr(6, 4)), parseInt(dateString.substr(3, 2)) - 1, parseInt(dateString.substr(0, 2)));

                    var dataType = '1M', fileName, dateEnd, showAdditionalAxisLabels = true, showScrollDate = true;

                    switch (type) {
                        case '1D':
                            dataType = '1M';
                            fileName = active+'_'+date.getFullYear().toString()+'-'+(date.getMonth() + 1).toString()+'-'+date.getDate()+'.json';
                            showAdditionalAxisLabels = false;
                            showScrollDate = false;
                            break;
                        case '1W':
                            dataType = '5M';
                            dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
                            fileName = active+'_'+date.getFullYear().toString()+'-'+(date.getMonth() + 1).toString()+'-'+date.getDate()+'_'+dateEnd.getFullYear().toString()+'-'+(dateEnd.getMonth() + 1).toString()+'-'+dateEnd.getDate()+'.json';
                            showAdditionalAxisLabels = true;
                            showScrollDate = true;
                            break;
                    }

                    $.ajax({
                        url: '/json/'+fileName,
                        type: 'get',
                        dataType: 'json',
                        beforeSend: function() {
                            $('#tradesCellStatus-'+row+'-'+column).html('<span class="label label-info">Data is now loading</label>');
                        },
                        complete: function() {
//                            $('#tradesCellStatus-'+row+'-'+column).html('');
                        },
                        success: function(json) {
                            if (json) {
                                $('#tradesCellStatus-'+row+'-'+column).html('');

                                var width = $('#chartsContainerCell-'+row+'-'+column).width(),
                                    height = $('#chartsContainerCell-'+row+'-'+column).height() - $('#chartsCellForm-'+row+'-'+column).outerHeight();

                                $('#'+chartId).width(width).height(height);

                                var parameters = {
                                    chartId: chartId,
                                    width: width,
                                    height: height,
                                    data: json.data,
                                    levels: json.levels,
                                    volumes: json.volumes,
                                    rulerUrl: '/assets/tradeChart/ruler.svg',
                                    dataType: dataType,
                                    showAdditionalAxisLabels: showAdditionalAxisLabels,
                                    showScrollDate: showScrollDate
                                };

                                if (charts[chartId].isInited()) {
                                    charts[chartId].update(parameters);
                                } else {
                                    charts[chartId].init(parameters);
                                }

                            } else {
                                $('#tradesCellStatus-'+row+'-'+column).html('<span class="label label-important">Error while downloading market data</label>');
                            }

                        },
                        error: function() {
                            $('#tradesCellStatus-'+row+'-'+column).html('<span class="label label-important">Error while downloading market data</label>');
                        }
                    });
                });

                $('.tradesVisibleFormButton').on('click', function(event) {
                    event.preventDefault();

                    var row = $(this).attr('data-row'),
                        column = $(this).attr('data-column'),
                        type = $(this).attr('data-type'),
                        $container = $('#tradesVisibleContainer-'+row+'-'+column),
                        chartId = 'chartsCellGraphsContainer-'+row+'-'+column;

                    $(this).hide();

                    if (type == 'hide') {
                        $('.tradesVisibleFormButton[data-row="'+row+'"][data-column="'+column+'"][data-type="show"]').show();
                        $container.hide();
                    } else {
                        $('.tradesVisibleFormButton[data-row="'+row+'"][data-column="'+column+'"][data-type="hide"]').show();
                        $container.show();
                    }

                    var width = $('#chartsContainerCell-'+row+'-'+column).width(),
                        height = $('#chartsContainerCell-'+row+'-'+column).height() - $('#chartsCellForm-'+row+'-'+column).outerHeight();

                    $('#'+chartId).width(width).height(height);

                    if (charts[chartId].isInited()) {
                        charts[chartId].update({
                            width: width,
                            height: height
                        });
                    }

                });

                $('.tradesModeButton').on('click', function(event) {
                    event.preventDefault();

                    var row = $(this).attr('data-row'),
                        column = $(this).attr('data-column'),
                        mode = $(this).attr('data-mode'),
                        chartId = 'chartsCellGraphsContainer-'+row+'-'+column;

                    $('.tradesModeButton[data-row="'+row+'"][data-column="'+column+'"]').removeAttr('disabled');
                    $(this).attr('disabled', 'disabled');

                    charts[chartId].setMode(mode);
                });

                var resizeCharts = function() {
                    resizeChartsContainer();
                    var chartId, chartIdParts, row, column, width, height;
                    for (chartId in charts) {
                        if (charts[chartId].isInited()) {
                            chartIdParts = chartId.split('-');
                            row = chartIdParts[1];
                            column = chartIdParts[2];

                            width = $('#chartsContainerCell-'+row+'-'+column).width();
                            height = $('#chartsContainerCell-'+row+'-'+column).height() - $('#chartsCellForm-'+row+'-'+column).outerHeight();

                            $('#'+chartId).width(width).height(height);

                            charts[chartId].update({
                                width: width,
                                height: height
                            });
                        }
                    }

                    resizeChartTimeout = null;
                };

                var resizeChartTimeout = null;

                $(window).on('resize', function() {
                    if (resizeChartTimeout) {
                        clearTimeout(resizeChartTimeout);
                    }

                    resizeChartTimeout = setTimeout(resizeCharts, 1500);
                });

            })(window.jQuery);
        });

    </script>
</body>
</html>