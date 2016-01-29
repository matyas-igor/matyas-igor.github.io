<?
    header('Content-Type: text/html; charset=utf-8');
?><!DOCTYPE html>
<html>
<head>
    <title>Tradelance</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<form action="/json.php" method="get" style="margin:20px; float:left;">
    <select name="json" style="width:300px;">
        <option value="">Не выбрана</option>
    <?php
    if ($handle = opendir('upload/')) {
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != ".." && is_file('upload/' . $entry) && substr($entry, strrpos($entry, '.') + 1) == 'json') {
                ?>
                <option value="<?='upload/' . $entry?>" <? if (isset($_GET['json']) && $_GET['json'] == 'upload/' . $entry) { ?>selected="selected"<? } ?>><?=$entry?></option>
            <?
            }
        }
        closedir($handle);
    }
    ?>
    </select>
    <input type="submit" value="Submit" />
</form>

<form action="/convert.php" method="post" enctype="multipart/form-data" style="margin:20px; float:left;">
    <input type="file" name="file" id="file">
    <input type="submit" name="submit" value="Convert">
    <a href="http://www.fibo-forex.ru/trader/download_quotes.html" style="margin-left:30px;" target="_blank">Download</a>
</form>

<div style="clear: both;"></div>

    <div id="chart" style="width:1000px; height:700px; margin:20px; float:left;"></div>

    <!-- JavaScript plugins (requires jQuery) -->
    <script src="assets/vendor/jquery/jquery-1.9.0.min.js"></script>

    <!-- Optionally enable responsive features in IE8. Respond.js can be obtained from https://github.com/scottjehl/Respond -->
    <script src="assets/vendor/svg/svg.min.js"></script>
    <script src="assets/vendor/underscore/underscore-min.js"></script>
    <script src="assets/vendor/disableSelection/disableSelection.js"></script>

    <script src="assets/tradeChart/tradeChart.js"></script>

<?
    if (isset($_GET['json']) && $_GET['json']) {
        $fileParts = explode('_', $_GET['json']);
        ?>
        <script>

            $(document).on('ready', function() {

                $.ajax({
                    url: '<?=$_GET['json']?>',
                    dataType: 'json',
                    success: function(tradeData) {
                        var tradeChart = $.tradeChart().init({
                            chartId: 'chart',
                            data: tradeData,
                            dataType: '<?=$fileParts[1]?>M'
                        });
                    }
                });
            });

        </script>
        <?
    }
?>

</body>
</html>