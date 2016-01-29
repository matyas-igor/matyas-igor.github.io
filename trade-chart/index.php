<?
    header('Content-Type: text/html; charset=utf-8');
?><!DOCTYPE html>
<html>
<head>
    <title>Tradelance</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

    <div id="chart" style="width:1000px; height:700px; margin:50px; float:left;"></div>

    <div id="chartOptions" style="margin-top:50px; float:left;">
        <button class="tradeChartAddCandle">Add candle<br><span style="font-size: 0.9em;">or press Enter</span></button>
        <div></div>
        <input type="text" name="testInput" />
    </div>



    <!-- JavaScript plugins (requires jQuery) -->
    <script src="assets/vendor/jquery/jquery-1.9.0.min.js"></script>

    <!-- Optionally enable responsive features in IE8. Respond.js can be obtained from https://github.com/scottjehl/Respond -->
    <script src="assets/vendor/svg/svg.min.js"></script>
    <script src="assets/vendor/underscore/underscore-min.js"></script>
    <script src="assets/vendor/disableSelection/disableSelection.js"></script>

    <script src="assets/tradeChart/tradeChart.js"></script>
    <script>
        <?
        $tradeData = array();

        $open = false;
        $close = false;

        $dataStartTimestamp = 0;

        $dataCount = 1000;
        $dataTime = 30 * 60;
        $dataType = '30M';

        $tradeDataAdditional = array();

        for ($i = 0; $i < $dataCount + 1000; $i++) {

            if ($i >= $dataCount) {

                $open = $close !== false ? $close : rand(400, 600);
                $close = rand(500, 700);
                $high = max($open, $close) + rand(0, 95);
                $low = min($open, $close) - rand(0, 75);
                $volume = rand(0, 6000);

                $tradeDataAdditional[] = array(
                    'timestamp' => strval(mktime(0, 0, 0) + $i * $dataTime),
                    'open' => strval($open),
                    'high' => strval($high),
                    'low' => strval($low),
                    'close' => strval($close),
                    'volume' => strval($volume)
                );

                continue;
            }

            $open = $close !== false ? $close : rand(100, 300);
            $close = rand(100, 300);
            $high = max($open, $close) + rand(0, 95);
            $low = min($open, $close) - rand(0, 75);
            $volume = rand(0, 3000);

            $tradeData[] = array(
                'timestamp' => strval(mktime(0, 0, 0) + $i * $dataTime),
                'open' => strval($open),
                'high' => strval($high),
                'low' => strval($low),
                'close' => strval($close),
                'volume' => strval($volume)
            );

            if ($i == $dataCount / 2 - 1) {
                $dataStartTimestamp = mktime(0, 0, 0) + $i * $dataTime;
            }
        }

        ?>

        var tradeData = <?=json_encode($tradeData)?>,
            tradeDataAdditional = <?=json_encode($tradeDataAdditional)?>;

        $(document).on('ready', function() {

            var tradeChart = $.tradeChart().init({
                chartId: 'chart',
                data: tradeData,
                dataType: '<?=$dataType?>'
            });

            var tradeAddData = function() {
                var candle = _(tradeDataAdditional).first();
                tradeDataAdditional = _(tradeDataAdditional).rest();

                console.log(candle);

                tradeChart.addData(candle);
            };

            $(document).keypress(function(e) {
                if (e.which == 13) {
                    tradeAddData();
                }
            });

            $('.tradeChartAddCandle').on('click', tradeAddData);
        });

    </script>
</body>
</html>