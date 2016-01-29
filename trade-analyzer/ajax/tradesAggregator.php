<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Igor Matyas (matyas.igor@gmail.com)
 * Date: Oct/2/13
 * Time: 5:34 PM
 */

//header('Content-Type: text/html; charset=Windows-1251');
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 300); //300 seconds = 5 minutes
ini_set('max_input_time', 300); //300 seconds = 5 minutes

header('Content-Type: application/json; charset=utf-8');
//header('Content-Type: text/html; charset=utf-8');

global $actives;
global $codes;
include_once('../inc/tradesConfig.php');

if (!isset($_POST['needAggregate']) || $_POST['needAggregate'] != '1' || !isset($_POST['active']) || !isset($_POST['type']) || !in_array($_POST['active'], $actives) || (!isset($_POST['date']) && (!isset($_POST['dateStart']) || !isset($_POST['dateEnd'])))) {
    $returnObject = array(
        'status' => 'error',
        'class' => 'error',
        'message' => 'An error occurred. Don\'t need aggregate',
    );
    echo json_encode($returnObject);
    exit();
}

$active = $_POST['active'];
$type = $_POST['type'];

$shiftTime = 0;
if (isset($_POST['parameters']['substractHour']) && isset($_POST['parameters']['substractHour']) && $_POST['parameters']['substractHour'] == '1') {
    $shiftTime = - 60 * 60;
}

if ($type == '1D') {

    $tradesStartTime = array(
        'minutes' => 00,
        'hours' => 10
    );

    $tradesEndTime = array(
        'minutes' => 49,
        'hours' => 23
    );

    $date = $_POST['date'];

    $time = mktime(0, 0, 0, intval($date['month']), intval($date['day']), intval($date['year']));

    $fileName = $codes[$active].'_' . mb_substr($date['year'], 2, 2) . sprintf("%02s", intval($date['month'])) . sprintf("%02s", intval($date['day'])) . '_' . mb_substr($date['year'], 2, 2). sprintf("%02s", intval($date['month'])) . sprintf("%02s", intval($date['day']));
    $fileNameInput =  '../trades/' . $fileName . '.txt';
    $fileNameOutput =  '../json/' . $active . '_' . $date['year'] . '-' . $date['month'] . '-' . $date['day'] .'.json';

    if (!file_exists($fileNameInput)) {
        $returnObject = array(
            'status' => 'success',
            'class' => 'warning',
            'message' => 'Doesn\'t exist such file in directory: ' . $fileNameInput,
        );
        echo json_encode($returnObject);
        exit();
    }

    $fileHandle = fopen($fileNameInput, 'r');

    if (!$fileHandle) {
        $returnObject = array(
            'status' => 'error',
            'class' => 'error',
            'message' => 'An error occurred. Can\'t open the file',
        );
        echo json_encode($returnObject);
        exit();
    }

    $marketData = array();
    $data = array();

    $pricesLevels = array();
    $pricesVolumes = array();

    $lastValue = false;
    $lastTimestamp = false;

    $minValue = false;
    $maxValue = false;

    while (($bufferString = fgets($fileHandle)) !== false) {
        if ($bufferString && count($bufferParts = explode(';', $bufferString)) == 4) {

            $hours = intval(mb_substr($bufferParts[1], 0, 2));
            $minutes = intval(mb_substr($bufferParts[1], 2, 2));

            $timestamp = mktime($hours, $minutes, 0, intval($date['month']), intval($date['day']), intval($date['year'])) + $shiftTime;

            $volume = floatval($bufferParts[3]);
            $value = floatval($bufferParts[2]);

            if (!in_array($value, $pricesLevels)) {
                $pricesLevels[] = $value;
            }

            // новое значение
            if (!isset($data['timestamp']) || $data['timestamp'] != $timestamp) {
                if (isset($data['timestamp'])) {
                    // уже было значение
                    $marketData[] = $data;

                    if ($lastTimestamp < ($timestamp - 60)) {
                        $currentTimestamp = $lastTimestamp + 60;
                        do {
                            $marketData[] = array(
                                'timestamp' => $currentTimestamp,
                                'open' => $lastValue,
                                'high' => $lastValue,
                                'low' => $lastValue,
                                'close' => $lastValue,
                                'volume' => 0,
                            );
                            $currentTimestamp += 60;
                        } while ($currentTimestamp <= ($timestamp - 60));
                    }
                } else {
                    // первое значение
                    if ($timestamp > ($time + $tradesStartTime['minutes'] * 60 + $tradesStartTime['hours'] * 60 * 60 + $shiftTime)) {
                        $currentTimestamp = $time + $tradesStartTime['minutes'] * 60 + $tradesStartTime['hours'] * 60 * 60 + $shiftTime;
                        do {
                            $marketData[] = array(
                                'timestamp' => $currentTimestamp,
                                'open' => $value,
                                'high' => $value,
                                'low' => $value,
                                'close' => $value,
                                'volume' => 0,
                            );
                            $currentTimestamp += 60;
                        } while ($currentTimestamp < $timestamp);
                    }
                }

                $data = array(
                    'timestamp' => $timestamp,
                    'open' => $value,
                    'high' => $value,
                    'low' => $value,
                    'close' => $value,
                    'volume' => 0,
                );
            }

            $data['high'] = max($data['high'], $value);
            $data['low'] = min($data['low'], $value);
            $data['close'] = $value;
            $data['volume'] += $volume;

            if (!isset($pricesVolumes[$timestamp])) {
                $pricesVolumes[$timestamp] = array();
            }

            if (!isset($pricesVolumes[$timestamp][strval($value)])) {
                $pricesVolumes[$timestamp][strval($value)] = 0;
            }
            $pricesVolumes[$timestamp][strval($value)] += $volume;

            $lastValue = $value;
            $lastTimestamp = $timestamp;

            $minValue = $minValue === false || $minValue > $value ? $value : $minValue;
            $maxValue = $maxValue === false || $maxValue < $value ? $value : $maxValue;
        }
    }

    if (count($data) > 0) {
        $marketData[] = $data;
    }

    if ($lastTimestamp < ($time + $tradesEndTime['minutes'] * 60 + $tradesEndTime['hours'] * 60 * 60 + $shiftTime)) {
        $currentTimestamp = $lastTimestamp + 60;
        do {
            $marketData[] = array(
                'timestamp' => $currentTimestamp,
                'open' => $lastValue,
                'high' => $lastValue,
                'low' => $lastValue,
                'close' => $lastValue,
                'volume' => 0,
            );
            $currentTimestamp += 60;
        } while ($currentTimestamp <= ($time + $tradesEndTime['minutes'] * 60 + $tradesEndTime['hours'] * 60 * 60 + $shiftTime));
    }

    sort($pricesLevels);

    $currentVolumes = array();
    foreach ($pricesLevels as $priceLevel) {
        $currentVolumes[strval($priceLevel)] = 0;
    }

    $timestampsVolumes = array();
    foreach ($pricesVolumes as $timestamp => $priceVolumes) {
        foreach ($priceVolumes as $price => $volume) {
            $currentVolumes[strval($price)] += $volume;
        }
        $timestampsVolumes[strval($timestamp)] = $currentVolumes;
    }

    if (!feof($fileHandle)) {
        $returnObject = array(
            'status' => 'error',
            'class' => 'error',
            'message' => 'An error occurred. Unexpected fgets() fail',
        );
        echo json_encode($returnObject);
        exit();
    }

    fclose($fileHandle);

    $json = array(
        'data' => $marketData,
        'levels' => $pricesLevels,
        'volumes' => $timestampsVolumes,
        'minValue' => $minValue,
        'maxValue' => $maxValue
    );

    if (!file_put_contents($fileNameOutput, json_encode($json))) {
        $returnObject = array(
            'status' => 'error',
            'class' => 'error',
            'message' => 'An error occurred. Can\'t write output file',
        );
        echo json_encode($returnObject);
        exit();
    }

    $returnObject = array(
        'status' => 'success',
        'class' => 'success',
        'message' => 'Output file ' . $fileNameOutput . ' had been successfully written',
    );
    echo json_encode($returnObject);
    exit();
}

if ($type == '1W') {

    $tradesStartTime = array(
        'minutes' => 00,
        'hours' => 10
    );

    $tradesEndTime = array(
        'minutes' => 45,
        'hours' => 23
    );

    $dateStart = $_POST['dateStart'];
    $dateEnd = $_POST['dateEnd'];

    $timeStart = mktime(0, 0, 0, intval($dateStart['month']), intval($dateStart['day']), intval($dateStart['year']));
    $timeEnd = mktime(0, 0, 0, intval($dateEnd['month']), intval($dateEnd['day']), intval($dateEnd['year']));

    $time = $timeStart;

    $marketData = array();

    $pricesLevels = array();
    $pricesVolumes = array();

    $minValue = false;
    $maxValue = false;

    $additionalMessages = array();

    while ($time <= $timeEnd) {

        $data = array();
        $lastValue = false;
        $lastTimestamp = false;

        $fileName = $codes[$active].'_' . mb_substr(date('Y', $time), 2, 2) . sprintf("%02s", intval(date('n', $time))) . sprintf("%02s", intval(date('j', $time))) . '_' . mb_substr(date('Y', $time), 2, 2) . sprintf("%02s", intval(date('n', $time))) . sprintf("%02s", intval(date('j', $time)));
        $fileNameInput =  '../trades/' . $fileName . '.txt';

        if (!file_exists($fileNameInput)) {
            $additionalMessages[] = 'Doesn\'t exist such file in directory: ' . $fileNameInput;
            $time += 60 * 60 * 24;
            continue;
        }

        $fileHandle = fopen($fileNameInput, 'r');

        if (!$fileHandle) {
            $returnObject = array(
                'status' => 'error',
                'class' => 'error',
                'message' => 'An error occurred. Can\'t open the file',
            );
            echo json_encode($returnObject);
            exit();
        }

        while (($bufferString = fgets($fileHandle)) !== false) {
            if ($bufferString && count($bufferParts = explode(';', $bufferString)) == 4) {

                $hours = intval(mb_substr($bufferParts[1], 0, 2));
                $minutes = intval(mb_substr($bufferParts[1], 2, 2));

                $timestamp = $time + floor(($minutes * 60 + $hours * 60 * 60) / (5 * 60)) * (5 * 60) + $shiftTime;

                $volume = floatval($bufferParts[3]);
                $value = floatval($bufferParts[2]);

                if (!in_array($value, $pricesLevels)) {
                    $pricesLevels[] = $value;
                }

                // новое значение
                if (!isset($data['timestamp']) || $data['timestamp'] != $timestamp) {
                    if (isset($data['timestamp'])) {
                        // уже было значение
                        $marketData[] = $data;

                        if ($lastTimestamp < ($timestamp - 5 * 60)) {
                            $currentTimestamp = $lastTimestamp + 5 * 60;
                            do {
                                $marketData[] = array(
                                    'timestamp' => $currentTimestamp,
                                    'open' => $lastValue,
                                    'high' => $lastValue,
                                    'low' => $lastValue,
                                    'close' => $lastValue,
                                    'volume' => 0,
                                );
                                $currentTimestamp += 5 * 60;
                            } while ($currentTimestamp <= ($timestamp - 5 * 60));
                        }
                    } else {
                        // первое значение
                        if ($timestamp > ($time + $tradesStartTime['minutes'] * 60 + $tradesStartTime['hours'] * 60 * 60 + $shiftTime)) {
                            $currentTimestamp = $time + $tradesStartTime['minutes'] * 60 + $tradesStartTime['hours'] * 60 * 60 + $shiftTime;
                            do {
                                $marketData[] = array(
                                    'timestamp' => $currentTimestamp,
                                    'open' => $value,
                                    'high' => $value,
                                    'low' => $value,
                                    'close' => $value,
                                    'volume' => 0,
                                );
                                $currentTimestamp += 5 * 60;
                            } while ($currentTimestamp < $timestamp);
                        }
                    }

                    $data = array(
                        'timestamp' => $timestamp,
                        'open' => $value,
                        'high' => $value,
                        'low' => $value,
                        'close' => $value,
                        'volume' => 0,
                    );
                }

                $data['high'] = max($data['high'], $value);
                $data['low'] = min($data['low'], $value);
                $data['close'] = $value;
                $data['volume'] += $volume;

                if (!isset($pricesVolumes[$timestamp])) {
                    $pricesVolumes[$timestamp] = array();
                }

                if (!isset($pricesVolumes[$timestamp][strval($value)])) {
                    $pricesVolumes[$timestamp][strval($value)] = 0;
                }
                $pricesVolumes[$timestamp][strval($value)] += $volume;

                $lastValue = $value;
                $lastTimestamp = $timestamp;

                $minValue = $minValue === false || $minValue > $value ? $value : $minValue;
                $maxValue = $maxValue === false || $maxValue < $value ? $value : $maxValue;
            }
        }

        if (count($data) > 0) {
            $marketData[] = $data;
        }

        if ($lastTimestamp < ($time + $tradesEndTime['minutes'] * 60 + $tradesEndTime['hours'] * 60 * 60 + $shiftTime)) {
            $currentTimestamp = $lastTimestamp + 5 * 60;
            do {
                $marketData[] = array(
                    'timestamp' => $currentTimestamp,
                    'open' => $lastValue,
                    'high' => $lastValue,
                    'low' => $lastValue,
                    'close' => $lastValue,
                    'volume' => 0,
                );
                $currentTimestamp += 5 * 60;
            } while ($currentTimestamp <= ($time + $tradesEndTime['minutes'] * 60 + $tradesEndTime['hours'] * 60 * 60 + $shiftTime));
        }

        if (!feof($fileHandle)) {
            $returnObject = array(
                'status' => 'error',
                'class' => 'error',
                'message' => 'An error occurred. Unexpected fgets() fail',
            );
            echo json_encode($returnObject);
            exit();
        }

        fclose($fileHandle);

        $time += 60 * 60 * 24;
    }

    sort($pricesLevels);

    $currentVolumes = array();
    foreach ($pricesLevels as $priceLevel) {
        $currentVolumes[strval($priceLevel)] = 0;
    }

    $timestampsVolumes = array();
    foreach ($pricesVolumes as $timestamp => $priceVolumes) {
        foreach ($priceVolumes as $price => $volume) {
            $currentVolumes[strval($price)] += $volume;
        }
        $timestampsVolumes[strval($timestamp)] = $currentVolumes;
    }

    $json = array(
        'data' => $marketData,
        'levels' => $pricesLevels,
        'volumes' => $timestampsVolumes,
        'minValue' => $minValue,
        'maxValue' => $maxValue
    );

    $fileNameOutput =  '../json/' . $active . '_' . $dateStart['year'] . '-' . $dateStart['month'] . '-' . $dateStart['day'] .'_' . $dateEnd['year'] . '-' . $dateEnd['month'] . '-' . $dateEnd['day'] .'.json';

    if (!file_put_contents($fileNameOutput, json_encode($json))) {
        $returnObject = array(
            'status' => 'error',
            'class' => 'error',
            'message' => 'An error occurred. Can\'t write output file',
        );
        echo json_encode($returnObject);
        exit();
    }

    $additionalMessage = count($additionalMessages) > 0 ? '<br />' . implode('<br />', $additionalMessages) : '';

    $returnObject = array(
        'status' => 'success',
        'class' => 'success',
        'message' => 'Output file ' . $fileNameOutput . ' had been successfully written' . $additionalMessage,
    );
    echo json_encode($returnObject);
    exit();
}





