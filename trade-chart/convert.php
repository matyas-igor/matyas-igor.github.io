<?
if (isset($_POST['submit'])) {
    if ($_FILES["file"]["error"] > 0)
    {
        echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    }
    else
    {
        if ($_FILES["file"]["type"] != 'text/csv') {
            echo "Upload: " . $_FILES["file"]["name"] . "<br>";
            echo "Type: " . $_FILES["file"]["type"] . "<br>";
            echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
            echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
            echo $_FILES["file"]["name"] . " - only .csv allowed. ";

        } else {
            if (file_exists("upload/" . $_FILES["file"]["name"]))
            {
                echo "Upload: " . $_FILES["file"]["name"] . "<br>";
                echo "Type: " . $_FILES["file"]["type"] . "<br>";
                echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
                echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
                echo $_FILES["file"]["name"] . " already exists. ";
            }
            else
            {
                move_uploaded_file($_FILES["file"]["tmp_name"],
                    "upload/" . $_FILES["file"]["name"]);

                $fileDest = "upload/" . $_FILES["file"]["name"];
                $file = file_get_contents($fileDest);
                $fileStrings = explode(PHP_EOL, $file);

                $json = array();
                foreach ($fileStrings as $fileString) {
                    if (trim($fileString)) {
                        $fileData = explode(',', $fileString);
                        if (count($fileData) == 7) {
                            $dates = explode('.', $fileData[0]);
                            $times = explode(':', $fileData[1]);

                            $timestamp = mktime(intval($times[0]), intval($times[1]), 0, intval($dates[1]), intval($dates[2]), intval($dates[0]));
                            $open = floatval($fileData[2]);
                            $high = floatval($fileData[3]);
                            $low = floatval($fileData[4]);
                            $close = floatval($fileData[5]);
                            $volume = floatval($fileData[6]);

                            $json[] = array(
                                'timestamp' => $timestamp,
                                'open' => $open,
                                'high' => $high,
                                'low' => $low,
                                'close' => $close,
                                'volume' => $volume,
                            );
                        }
                    }
                }

                $fileJsonNames = "upload/" . substr($_FILES["file"]["name"], 0, strrpos($_FILES["file"]["name"], '.')) . '.json';

                file_put_contents($fileJsonNames, json_encode($json));

                header('Location: /json.php');
                exit();
            }
        }

        echo "Upload: " . $_FILES["file"]["name"] . "<br>";
        echo "Type: " . $_FILES["file"]["type"] . "<br>";
        echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
        echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
        echo "Stored in: " . "upload/" . $_FILES["file"]["name"];
    }
}
?>

<html>
<body>

<form action="/convert.php" method="post" enctype="multipart/form-data">
    <label for="file">Filename:</label>
    <input type="file" name="file" id="file"><br>
    <input type="submit" name="submit" value="Submit">
</form>

</body>
</html>

