<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Igor Matyas (matyas.igor@gmail.com)
 * Date: Sep/29/13
 * Time: 2:02 PM
 */

//header('Content-Type: text/html; charset=Windows-1251');
ini_set('memory_limit', '512M');
ini_set('max_execution_time', 360); //300 seconds = 5 minutes
ini_set('max_input_time', 360); //300 seconds = 5 minutes

header('Content-Type: application/json; charset=utf-8');
//header('Content-Type: text/html; charset=utf-8');

global $actives;
global $ems;
global $markets;
global $codes;

include_once('../inc/tradesConfig.php');

if (!isset($_POST['needParse']) || $_POST['needParse'] != '1' || !isset($_POST['active']) || !in_array($_POST['active'], $actives)) {
    $returnObject = array(
        'status' => 'error',
        'class' => 'error',
        'message' => 'An error occurred. Don\'t need parse',
    );
    echo json_encode($returnObject);
    exit();
}

$active = $_POST['active'];

class cURL
{
    var $headers;
    var $user_agent;
    var $compression;
    var $cookie_file;
    var $proxy;

    function cURL($cookies = TRUE, $cookie = 'cookies.txt', $compression = 'gzip', $proxy = '')
    {
        $this->headers[] = 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
//        $this->headers[] = 'Accept-Encoding: gzip,deflate,sdch';
        $this->headers[] = 'Accept-Language: en-US,en;q=0.8,ru;q=0.6';
        $this->headers[] = 'Cache-Control: no-cache';
        $this->headers[] = 'Connection: keep-alive';
        $this->headers[] = 'Host: 195.128.78.52';
        $this->headers[] = 'Pragma: no-cache';
        $this->headers[] = 'Referer: http://www.finam.ru/analysis/profile0000300007/default.asp';
        $this->headers[] = 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36';

        $this->user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36';
        $this->compression = $compression;
        $this->proxy = $proxy;
        $this->cookies = $cookies;
    }

    function get($url)
    {
        $process = curl_init($url);
        curl_setopt($process, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($process, CURLOPT_HEADER, false);
        curl_setopt($process, CURLOPT_USERAGENT, $this->user_agent);
        curl_setopt($process, CURLOPT_ENCODING, 'gzip,deflate,sdch');
//        curl_setopt($process, CURLOPT_ENCODING , $this->compression);
        curl_setopt($process, CURLOPT_TIMEOUT, 300);
        curl_setopt($process, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1);

        $opts = array(
//            CURLINFO_CONTENT_TYPE => "text/txt",
            CURLOPT_BINARYTRANSFER => TRUE,
            CURLOPT_RETURNTRANSFER => TRUE,
        );

        curl_setopt_array($process, $opts);

        $return = curl_exec($process);
        curl_close($process);
        return $return;
    }

    function error($error)
    {
        echo "cURL Error: {$error}";
        die;
    }
}

//http://195.128.78.52/SPFB.SBRF_130928_130929.txt?market=14&em=17456&code=SPFB.SBRF&df=28&mf=8&yf=2013&dt=29&mt=8&yt=2013&p=1&f=SPFB.SBRF_130928_130929&e=.txt&cn=SPFB.SBRF&dtf=1&tmf=1&MSOR=0&mstime=on&mstimever=1&sep=3&sep2=1&datf=9

$postParams = array(
    'df' => intval($_POST['df']),
    'mf' => intval($_POST['mf']) - 1,
    'yf' => intval($_POST['yf']),
    'dt' => intval($_POST['ds']),
    'mt' => intval($_POST['ms']) - 1,
    'yt' => intval($_POST['ys']),
    'fileName' => $codes[$active].'_' . mb_substr($_POST['ys'], 2, 2) . sprintf("%02s", intval($_POST['ms'])) . sprintf("%02s", intval($_POST['ds'])) . '_' . mb_substr($_POST['yf'], 2, 2). sprintf("%02s", intval($_POST['mf'])) . sprintf("%02s", intval($_POST['df'])),
);

$fileName = 'http://195.128.78.52/';

$dataString = sprintf("%02s", intval($_POST['ds'])) . '.' . sprintf("%02s", intval($_POST['ms'])) . '.' . $_POST['ys'];
$time = mktime(0, 0, 0, intval($_POST['ms']), intval($_POST['ds']), intval($_POST['ys']));
$additionalString = 'Active: ' . $active . '. Date: '.date('D', $time) . ', ' . $dataString . '. <a href="#" class="tradesReloadLink" data-active="'.$active.'" data-day="'.$_POST['ds'].'" data-month="'.$_POST['ms'].'" data-year="'.$_POST['ys'].'">Reload</a>.';

$params = array(
    'market' => $markets[$active],
    'em' => $ems[$active],
    'code' => $codes[$active],
    'df' => $postParams['df'],
    'mf' => $postParams['mf'],
    'yf' => $postParams['yf'],
    'dt' => $postParams['dt'],
    'mt' => $postParams['mt'],
    'yt' => $postParams['yt'],
    'p' => 1,
    'f' => $postParams['fileName'],
    'e' => '.txt',
    'cn' => 'SPFB.'.$active,
    'dtf' => 1,
    'tmf' => 1,
    'MSOR' => 0,
    'mstime' => 'on',
    'mstimever' => 1,
    'sep' => 3,
    'sep2' => 1,
    'datf' => 9,
);

$fileName .= $params['f'] . $params['e'] . '?' . http_build_query($params);

$notifications = array();

//var_dump($fileName);

try {

    $cc = new cURL();

//    var_dump($cc);

    $trades = $cc->get($fileName);

//    var_dump($trades);
//    $trades = file_get_contents($fileName);
//    echo $trades;

    // Здесь анализ trades

    if ($trades) {
        $tradesStrings = explode("\n", trim(trim($trades), "\n"));

        $notificationMessages = array();
        if (count($tradesStrings) < 10) {
            $notificationMessages[] = 'Too few lines in the file!';
        }

        if (count($tradesStrings) > 1) {
            $firstString = $tradesStrings[0];
            $lastString = $tradesStrings[count($tradesStrings) - 1];

            $firstStringParts = explode(';', $firstString);
            $lastStringParts = explode(';', $lastString);

            if (count($firstStringParts) != 4 || count($lastStringParts) != 4) {
                $notificationMessages[] = 'Not trades data in file!';
            }

            if (count($firstStringParts) == 4) {
                $hours = intval(mb_substr($firstStringParts[1], 0, 2));
                $minutes = intval(mb_substr($firstStringParts[1], 2, 2));

                if ($hours * 60 + $minutes >= 10 * 60 + 30) {
                    $notificationMessages[] = 'Trades starts at '.mb_substr($firstStringParts[1], 0, 2).':'.mb_substr($firstStringParts[1], 2, 2).'!';
                }
            }

            if (count($lastStringParts) == 4) {
                $hours = intval(mb_substr($lastStringParts[1], 0, 2));
                $minutes = intval(mb_substr($lastStringParts[1], 2, 2));

                if ($hours * 60 + $minutes <= 23 * 60 + 30) {
                    $notificationMessages[] = 'Trades ends at '.mb_substr($lastStringParts[1], 0, 2).':'.mb_substr($lastStringParts[1], 2, 2).'!';
                }
            }
        }

        if (count($notificationMessages) > 0) {
            $notificationMessages[] = 'File: ' . '<a href="/trades/'.$postParams['fileName'].'.txt" target="_blank">'.$postParams['fileName'].'.txt</a>. ' . $additionalString;

            $notifications[] = array('message' => implode('<br />', $notificationMessages), 'class' => 'warning');
        }
    }

    $result = false;
    $additionalInformation = '';

    if ($trades) {
        $result = file_put_contents('../trades/' . $params['f'] . $params['e'], $trades);
        $additionalInformation = 'File: <a href="/trades/'.$postParams['fileName'].'.txt" target="_blank">'.$postParams['fileName'].'.txt</a>.';
        $fileSize = filesize('../trades/' . $params['f'] . $params['e']);
        $additionalInformation .= ' ('.$fileSize.' bytes)';
    } else {
        $result = true;
        $additionalInformation = '(0 bytes)';

        $notifications[] = array('message' => 'Empty file! ' . $additionalString, 'class' => 'success');
    }

    if ($result) {
        $returnObject = array(
            'status' => 'success',
            'class' => 'success',
            'message' => 'Trading data successfully downloaded. '.$additionalInformation . '. ' . $additionalString,
            'notifications' => $notifications,
        );
        echo json_encode($returnObject);
    } else {
        $notifications[] = array('message' => 'Can\'t write file: ' . $postParams['fileName'] . '. ' . $additionalString, 'class' => 'error');
        $returnObject = array(
            'status' => 'success',
            'class' => 'error',
            'message' => 'An error occurred while writing trade data file: '.$postParams['fileName'] . '. ' . $additionalString,
            'notifications' => $notifications,
        );
        echo json_encode($returnObject);
    }


} catch (Exception $e) {
    $notifications[] = array('message' => 'Can\'t download file: ' . $postParams['fileName'] . '. ' . $additionalString, 'class' => 'error');
    $returnObject = array(
        'status' => 'success',
        'class' => 'error',
        'message' => 'An error occurred while downloading file: ' . $postParams['fileName'] . '. ' . $additionalString,
        'notifications' => $notifications,
    );
    echo json_encode($returnObject);
}

exit();