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
    </div>



    <!-- JavaScript plugins (requires jQuery) -->
    <script src="assets/vendor/jquery/jquery-1.9.0.min.js"></script>

    <!-- Optionally enable responsive features in IE8. Respond.js can be obtained from https://github.com/scottjehl/Respond -->
    <script src="assets/vendor/svg/svg.min.js"></script>
    <script src="assets/vendor/underscore/underscore-min.js"></script>
    <script src="assets/vendor/disableSelection/disableSelection.js"></script>


    <script>
        function getRandomInt(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var draw = SVG('chart').size(300, 300);

        var group = draw.group();

        var rect = draw.rect(100, 100).attr({ fill: '#fff' }).move(0, 0);
        var rect2 = draw.rect(100, 100).attr({ fill: '#ccc' }).move(50, 50);

        //var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#333' });
        var text = draw.text('SVG.JS').font({ size: 36 }).fill({ color: '#999' }).x(50);

        group.add(text).add(rect2);

//        group.x(100).y(100);

        rect.x(10).y(10).attr({height: 20});

        group.move(10, 10).scale(2, 2);

//
//        group.move(0, 50);
//        rect.x(0).y(50);
//        //group.scale(1, 2);
//
        var mask = draw.mask().add(rect);
        //group.maskWith(mask);
        //text.maskWith(mask);
        //ellipse.maskWith(mask);

    </script>
</body>
</html>