<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Igor Matyas (matyas.igor@gmail.com)
 * Date: Oct/2/13
 * Time: 5:34 PM
 */

//header('Content-Type: text/html; charset=Windows-1251');
ini_set('memory_limit', '128M');
ini_set('max_execution_time', 180); //300 seconds = 5 minutes
ini_set('max_input_time', 180); //300 seconds = 5 minutes

header('Content-Type: application/json; charset=utf-8');
//header('Content-Type: text/html; charset=utf-8');

if (!isset($_POST['needSave']) || $_POST['needSave'] != '1' || !isset($_POST['svg'])) {
    $returnObject = array(
        'status' => 'error',
        'message' => 'An error occurred. Don\'t need save',
    );
    echo json_encode($returnObject);
    exit();
}

$svgFileName = date('Y-m-d_H-i-s') . '_' . md5(mt_rand()) . '.svg';
$svgPath = '../svg/' . $svgFileName;

if (!file_put_contents($svgPath, $_POST['svg'])) {
    $returnObject = array(
        'status' => 'error',
        'message' => 'An error occurred. Can\'t write file',
    );
    echo json_encode($returnObject);
    exit();
}

$returnObject = array(
    'status' => 'success',
    'imageUrl' => '/svg/' . $svgFileName
);
echo json_encode($returnObject);
exit();


