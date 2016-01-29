<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Igor Matyas (matyas.igor@gmail.com)
 * Date: Oct/28/13
 * Time: 11:20 PM
 */

header('Content-Type: application/json; charset=utf-8');

global $applicationDomain;
global $settingsOAuth;

include_once 'inc/config.php';

$settings = $settingsOAuth;

if (!isset($_GET['method'])) {
    $returnObject = array(
        'status' => 'error',
        'message' => 'Произошла ошибка, пожалуйста, повторите попытку позже',
    );
    echo json_encode($returnObject);
    exit();
}

$method = $_GET['method'];

if (isset($_GET['provider'])) {
    if ($_GET['provider'] == 'instagram') {
        switch ($method) {
            case 'getUserPhotos':

                $parameters = isset($_GET['parameters']) ? $_GET['parameters'] : array();
                $login = $_GET['login'];

                if (isset($_GET['accessToken']) && isset($_GET['userId'])) {
                    $parameters = array_merge(array('access_token' => $_GET['accessToken']), $parameters);
                    $file = file_get_contents('https://api.instagram.com/v1/users/'.$_GET['userId'].'/media/recent?' . http_build_query($parameters));
                } else {
                    $file = file_get_contents('http://instagram.com/'.$login.'/media?' . http_build_query($parameters));
                }

                echo $file;
                exit();

            case 'getAuthorizeUrl':

//                https://instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token

                $getRedirectParameters = array('provider' => 'instagram', 'action' => 'completeAuthorization');
                if (isset($_GET['parameters']) && is_array($_GET['parameters']) && count($_GET['parameters']) > 0) {
                    $getRedirectParameters = array_merge($_GET['parameters'], $getRedirectParameters);
                }

                $getParameters = array(
                    'client_id' => $settings['instagram']['clientId'],
                    'redirect_uri' => $applicationDomain . '?' . http_build_query($getRedirectParameters),
                    'response_type' => 'token',
                    'revoke' => '1'
                );

                echo json_encode(array('url' => 'https://instagram.com/oauth/authorize/?' . http_build_query($getParameters)));
                exit();

                break;

            case 'getUserInfo':

                $json = array();

                $methodsArray = array(
                    'user' => array('url' => 'users/self/', 'parameters' => array()),
                    'follows' => array('url' => 'users/self/follows', 'parameters' => array()),
                );

                $getParameters = array(
                    'access_token' => $_GET['accessToken'],
                );

                foreach ($methodsArray as $methodName => $methodArray) {
                    $parameters = array_merge($getParameters, $methodArray['parameters']);
                    $json[$methodName] = json_decode(file_get_contents('https://api.instagram.com/v1/'.$methodArray['url'] . '?' . http_build_query($parameters)));
                }

                echo json_encode($json);
                exit();

                break;
        }


    }

    if ($_GET['provider'] == 'vk') {
        switch ($method) {
            case 'getAuthorizeUrl':

                $getParameters = array(
                    'client_id' => $settings['vk']['applicationId'],
                    'scope' => 'friends,photos',
                    'redirect_uri' => $applicationDomain . '?' . http_build_query(array('provider' => 'vk', 'action' => 'completeAuthorization')),
                    'display' => 'page',
                    'v' => '5.2',
                    'response_type' => 'token',
                    'revoke' => '1'
                );

                echo json_encode(array('url' => 'https://oauth.vk.com/authorize?' . http_build_query($getParameters)));
                exit();

                break;

            case 'getUserInfo':

                $json = array();

                $userId = $_GET['userId'];
                $methodsArray = array(
                    'friends' => array('url' => 'friends.get', 'parameters' => array('user_id' => $userId, 'fields' => 'first_name,last_name', 'order' => 'name')),
                    'user' => array('url' => 'users.get', 'parameters' => array('user_ids' => strval($userId), 'fields' => 'nickname,screen_name,photo_50,photo_100')),
                    'albums' => array('url' => 'photos.getAlbums', 'parameters' => array('owner_id' => $userId, 'need_system' => '1', 'need_covers' => '1', 'photo_sizes' => '1'))
                );

                $getParameters = array(
                    'v' => '5.2',
                    'access_token' => $_GET['accessToken'],
                );

                foreach ($methodsArray as $methodName => $methodArray) {
                    $parameters = array_merge($getParameters, $methodArray['parameters']);
                    $json[$methodName] = json_decode(file_get_contents('https://api.vk.com/method/'.$methodArray['url'] . '?' . http_build_query($parameters)));
                }

                echo json_encode($json);
                exit();

                break;

            case 'getUserAlbums':

                $json = array();

                $userId = $_GET['userId'];
                $methodsArray = array(
                    'albums' => array('url' => 'photos.getAlbums', 'parameters' => array('owner_id' => $userId, 'need_system' => '1', 'need_covers' => '1', 'photo_sizes' => '1'))
                );

                $getParameters = array(
                    'v' => '5.2',
                    'access_token' => $_GET['accessToken'],
                );

                $parameters = array_merge($getParameters, $methodsArray['albums']['parameters']);
                $json = json_decode(file_get_contents('https://api.vk.com/method/'.$methodsArray['albums']['url'] . '?' . http_build_query($parameters)));

                echo json_encode($json);
                exit();

                break;

            case 'getAlbumPhotos':

                $json = array();

                $userId = $_GET['userId'];
                $albumId = $_GET['albumId'];

                $methodsArray = array(
                    'photos' => array('url' => 'photos.get', 'parameters' => array('owner_id' => $userId, 'album_id' => $albumId, 'photo_sizes' => '1', 'rev' => '1'))
                );

                $getParameters = array(
                    'v' => '5.2',
                    'access_token' => $_GET['accessToken'],
                );

                $parameters = array_merge($getParameters, $methodsArray['photos']['parameters']);
                $json = json_decode(file_get_contents('https://api.vk.com/method/'.$methodsArray['photos']['url'] . '?' . http_build_query($parameters)));

                echo json_encode($json);
                exit();

                break;

            case 'getLogoutLink':

                $file = $_POST['html'];
                $link = '';
                // href="https://login.vk.com/?act=logout&hash=dfb0b7936002c40082&_origin=http://vk.com"
                $regexp = "\<a\s[^>]*href=\"https://login.vk.com/?act=logout&hash=([^\"]+)\"[^>]*>([^<]*)\<\/a\>";
                if (preg_match("/$regexp/siU", $file, $matches)) {
                    $link = 'https://login.vk.com/?act=logout&hash=' . $matches[1];
                }

                echo json_encode(array('url' => $link));
                exit();

                break;
        }
    }
} else {
    switch ($method) {
        case 'getImage':
            echo 'data:image/jpeg;base64,' . base64_encode(file_get_contents($_GET['imageUrl']));
            exit();

            break;
    }
}
