<?php
/**
 * Created by JetBrains PhpStorm.
 * User: admin
 * Date: Jun/19/13
 * Time: 9:42 PM
 * To change this template use File | Settings | File Templates.
 */
exit();
header('Content-type: application/json');
global $lang;

require_once(__DIR__ . '/inc/Image_lib.php');
require_once(__DIR__ . '/inc/Upload.php');
require_once(__DIR__ . '/inc/upload_lang.php');

$allowedTypes = array('jpg', 'png');
$imagePath = __DIR__ . '/upload/';

$config = array();
$config['upload_path'] = $imagePath;
$config['allowed_types'] = implode('|', $allowedTypes);
$config['max_size']	= '10000';

$upload = new Upload($config);
// $imageLib = new Image_lib();

if (!$upload->do_upload('uploadImage')) {
    $error = trim(strip_tags($upload->display_errors()));

    $returnObject = array(
        'status' => 'error',
        'message' => $lang[$error]
    );

    echo json_encode($returnObject);


} else {

    $fileData = $upload->data();

    $imageFile = $imagePath . $fileData['file_name'];
    $imagePathParts = pathinfo($imageFile);

    if (!($imageContent = @file_get_contents($imageFile))) {
        $returnObject = array(
            'status' => 'error',
            'message' => 'Произошла ошибка на сервере'
        );

        echo json_encode($returnObject);
        exit();
    }

    @unlink($imageFile);

    $returnObject = array(
        'status' => 'success',
        'extension' => $imagePathParts['extension'],
        'image' => 'data:' . $fileData['file_type'] . ';base64,' . base64_encode($imageContent)
    );

    echo json_encode(array_merge($returnObject));
}