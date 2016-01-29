<?
global $productsInformation;
global $settingsOAuth;
global $applicationDomain;
include_once 'config.php';

$jsonProducts = array();
$jsonProducts['oAuthSettings'] = array('oAuth' => $settingsOAuth, 'applicationDomain' => $applicationDomain);
$jsonProducts['productsColors'] = array(
    '#480f0f',
    '#656415',
    '#20430f',
    '#104047',
    '#091d4d',
    '#47084a',

    '#741615',
    '#94921c',
    '#377619',
    '#196f7c',
    '#17367e',
    '#7d0f81',

    '#b92625',
    '#cdca26',
    '#52ad28',
    '#24a4b8',
    '#214fbc',
    '#b016b6',

    '#ff3533',
    '#fffb25',
    '#72f337',
    '#32dffa',
    '#2d69fa',
    '#ed37f4',

    '#ff6f6e',
    '#fffd90',
    '#a7fc80',
    '#88eefe',
    '#7098fa',
    '#f681fb',

    '#ffb1b0',
    '#fffecf',
    '#deffcf',
    '#d5f9ff',
    '#c1d2fa',
    '#fdcdff',

    '#ffffff',
    '#dddddd',
    '#999999',
    '#666666',
    '#333333',
    '#000000',

);
$jsonProducts['productsInformation'] = $productsInformation;

$jsonProducts['productsTypes'] = array(
    'case' => array(
        'title' => 'Чехлы Qcase',
        'products' => array(
            // 'case-iphone6',
            // 'case-iphone6-plus',
            // 'case-iphone5c',
            'case-iphone5',
            'case-iphone4',
            'case-galaxyS3',
            'case-ipad-2-3-4',
            'case-ipad-mini',
        ),
    ),
    'sticker' => array(
        'title' => 'Наклейки Qsticker',
        'products' => array(
            // 'sticker-iphone6',
            // 'sticker-iphone6-plus',
            'sticker-iphone5',
            'sticker-iphone4',
            'sticker-galaxyS3',
            'sticker-ipad-2-3-4',
            'sticker-ipad-mini',
        ),
    ),
    'wear' => array(
        'title' => 'Одежда',
        'products' => array(
            'wear-tshirt',
        ),
    ),
    'cup' => array(
        'title' => 'Кружки',
        'products' => array(
            'cup-termo-plastic',
            'cup-termo-metal',
            'cup-latte-big',
            'cup-latte-small',
            'cup-simple',
        ),
    ),
    'mosaic' => array(
        'title' => 'Мозайки',
        'products' => array(
            'mosaic-270-345-cartoon',
            'mosaic-240-190-cartoon',

            'mosaic-275-305-magnet',
            'mosaic-270-180-magnet',
            'mosaic-180-130-magnet',
        ),
    ),
    'magnet' => array(
        'title' => 'Магниты',
        'products' => array(
            'magnet-square',
            'magnet-round',
            'magnet-heart',
            'magnet-oval',
        ),
    ),
);

$jsonProducts['products'] = array(
    'case-iphone6' => array(
        'name' => 'iPhone 6',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1100,
                'height' => 1514,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1100, 1514),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'screen' => array(
                    'position' => array(292, 182, 518, 1038),
                    'width' => 750,
                    'height' => 1334,
                ),
                'zoom' => 0.9,
            ),
        ),
        'folderUrl' => 'img/case-iphone6/'
    ),
    'case-iphone6-plus' => array(
        'name' => 'iPhone 6 Plus',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1100,
                'height' => 1514,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1100, 1514),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'screen' => array(
                    'position' => array(292, 182, 518, 1038),
                    'width' => 1080,
                    'height' => 1920,
                ),
                'zoom' => 1.05,
            ),
        ),
        'folderUrl' => 'img/case-iphone6/'
    ),
    'case-iphone5c' => array(
        'name' => 'iPhone 5C',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1224,
                'height' => 1535,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1224, 1535),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'screen' => array(
                    'position' => array(379, 238, 485, 975),
                    'width' => 640,
                    'height' => 1136,
                ),
            ),
        ),
        'folderUrl' => 'img/case-iphone5c/'
    ),
    'sticker-iphone6-plus' => array(
        'name' => 'iPhone 6 Plus',
        'editors' => array(
            'front' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 787,
                'height' => 1470,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 787, 1470),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'screen' => array(
                    'position' => array(118, 244, 547, 968),
                    'width' => 1080,
                    'height' => 1920,
                ),
                'zoom' => 1.05,
            ),
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 787,
                'height' => 1470,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 787, 1470),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'zoom' => 1.05,
            ),
        ),
        'folderUrl' => 'img/sticker-iphone6-plus/'
    ),
    'sticker-iphone6' => array(
        'name' => 'iPhone 6',
        'editors' => array(
            'front' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 900,
                'height' => 1528,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 900, 1528),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'screen' => array(
                    'position' => array(178, 271, 546, 967),
                    'width' => 750,
                    'height' => 1334,
                ),
                'zoom' => 0.95,
            ),
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 900,
                'height' => 1528,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 900, 1528),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'zoom' => 0.95,
            ),
        ),
        'folderUrl' => 'img/sticker-iphone6/'
    ),

    'case-iphone5' => array(
        'name' => 'iPhone 5/5S',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1216,
                'height' => 1904,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1216, 1904),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(29, 88, 1181, 952),
                            array(29, 952, 1181, 1816),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(29, 88, 1181, 664),
                            array(29, 664, 1181, 1240),
                            array(29, 1240, 1181, 1816),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(29, 88, 605, 520),
                            array(29, 520, 605, 952),
                            array(29, 952, 605, 1384),
                            array(29, 1384, 605, 1816),
                            array(605, 88, 1181, 520),
                            array(605, 520, 1181, 952),
                            array(605, 952, 1181, 1384),
                            array(605, 1384, 1181, 1816),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(29, 88, 1181, 952),
                            array(29, 952, 1181, 1816),
                            array(605, 808, 893, 1096),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(29, 88, 605, 664),

                            array(605, 88, 893, 376),
                            array(893, 88, 1181, 376),
                            array(605, 376, 893, 664),
                            array(893, 376, 1181, 664),

                            array(29, 664, 317, 952),
                            array(317, 664, 605, 952),
                            array(29, 952, 317, 1240),
                            array(317, 952, 605, 1240),

                            array(605, 664, 1181, 1240),

                            array(29, 1240, 605, 1816),

                            array(605, 1240, 893, 1528),
                            array(893, 1240, 1181, 1528),
                            array(605, 1528, 893, 1816),
                            array(893, 1528, 1181, 1816),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(29, 88, 317, 376),
                            array(317, 88, 605, 376),
                            array(29, 376, 317, 664),
                            array(317, 376, 605, 664),

                            array(605, 88, 893, 376),
                            array(893, 88, 1181, 376),
                            array(605, 376, 893, 664),
                            array(893, 376, 1181, 664),

                            array(29, 664, 317, 952),
                            array(317, 664, 605, 952),
                            array(29, 952, 317, 1240),
                            array(317, 952, 605, 1240),

                            array(605, 664, 893, 952),
                            array(893, 664, 1181, 952),
                            array(605, 952, 893, 1240),
                            array(893, 952, 1181, 1240),

                            array(29, 1240, 317, 1528),
                            array(317, 1240, 605, 1528),
                            array(29, 1528, 317, 1816),
                            array(317, 1528, 605, 1816),

                            array(605, 1240, 893, 1528),
                            array(893, 1240, 1181, 1528),
                            array(605, 1528, 893, 1816),
                            array(893, 1528, 1181, 1816),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'editorOverlay' => 'back-contour.png',
                'productOverlay' => 'back-productOverlay.png',
                'techOverlay' => 'back-techOverlay.png',
                'screen' => array(
                    'position' => array(302, 304, 910, 1486),
                    'width' => 640,
                    'height' => 1136,
                ),
                'tech' => array(
                    'left' => 100,
                    'top' => 84,
                    'width' => 1016,
                    'height' => 1736,
                ),
                'zoom' => 1.25,
            ),
        ),
        'folderUrl' => 'img/case-iphone5/'
    ),
    'case-iphone4' => array(
        'name' => 'iPhone 4/4S',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1269,
                'height' => 1716,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1269, 1716),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(102, 60, 1166, 858),
                            array(102, 858, 1166, 1656),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(102, 60, 1166, 592),
                            array(102, 592, 1166, 1124),
                            array(102, 1124, 1166, 1656),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(102, 60, 634, 461),
                            array(102, 461, 634, 858),
                            array(102, 858, 634, 1257),
                            array(102, 1257, 634, 1656),
                            array(634, 60, 1166, 461),
                            array(634, 461, 1166, 858),
                            array(634, 858, 1166, 1257),
                            array(634, 1257, 1166, 1656),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(102, 60, 1166, 858),
                            array(102, 858, 1166, 1656),
                            array(634, 725, 900, 991),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(102, 60, 634, 592),

                            array(634, 60, 900, 328),
                            array(900, 60, 1166, 328),
                            array(634, 328, 900, 592),
                            array(900, 328, 1166, 592),

                            array(102, 592, 368, 858),
                            array(368, 592, 634, 858),
                            array(102, 858, 368, 1124),
                            array(368, 858, 634, 1124),

                            array(634, 592, 1166, 1124),

                            array(102, 1124, 634, 1656),

                            array(634, 1124, 900, 1390),
                            array(900, 1124, 1166, 1390),
                            array(634, 1390, 900, 1656),
                            array(900, 1390, 1166, 1656),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(102, 60, 368, 328),
                            array(368, 60, 634, 328),
                            array(102, 328, 368, 592),
                            array(368, 328, 634, 592),

                            array(634, 60, 900, 328),
                            array(900, 60, 1166, 328),
                            array(634, 328, 900, 592),
                            array(900, 328, 1166, 592),

                            array(102, 592, 368, 858),
                            array(368, 592, 634, 858),
                            array(102, 858, 368, 1124),
                            array(368, 858, 634, 1124),

                            array(634, 592, 900, 858),
                            array(900, 592, 1166, 858),
                            array(634, 858, 900, 1124),
                            array(900, 858, 1166, 1124),

                            array(102, 1124, 368, 1390),
                            array(368, 1124, 634, 1390),
                            array(102, 1390, 368, 1656),
                            array(368, 1390, 634, 1656),

                            array(634, 1124, 900, 1390),
                            array(900, 1124, 1166, 1390),
                            array(634, 1390, 900, 1656),
                            array(900, 1390, 1166, 1656),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'editorOverlay' => 'back-contour.png',
                'productOverlay' => 'back-productOverlay.png',
                'techOverlay' => 'back-techOverlay.png',
                'screen' => array(
                    'position' => array(353, 430, 911, 1270),
                    'width' => 640,
                    'height' => 960,
                ),
                'tech' => array(
                    'left' => 115,
                    'top' => 58,
                    'width' => 1039,
                    'height' => 1600,
                ),
                'zoom' => 1.25,
            ),
        ),
        'folderUrl' => 'img/case-iphone4/'
    ),
    'case-galaxyS3' => array(
        'name' => 'Galaxy S3',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1396,
                'height' => 1949,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1396, 1949),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(89, 62, 1305, 974),
                            array(89, 974, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(89, 62, 1305, 670),
                            array(89, 670, 1305, 1278),
                            array(89, 1278, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(89, 62, 697, 518),
                            array(89, 518, 697, 974),
                            array(89, 974, 697, 1430),
                            array(89, 1430, 697, 1886),
                            array(697, 62, 1305, 518),
                            array(697, 518, 1305, 974),
                            array(697, 974, 1305, 1430),
                            array(697, 1430, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(89, 62, 1305, 974),
                            array(89, 974, 1305, 1886),
                            array(697, 822, 1001, 1126),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(89, 62, 697, 670),

                            array(697, 62, 1001, 366),
                            array(1001, 62, 1305, 366),
                            array(697, 366, 1001, 670),
                            array(1001, 366, 1305, 670),

                            array(89, 670, 393, 974),
                            array(393, 670, 697, 974),
                            array(89, 974, 393, 1278),
                            array(393, 974, 697, 1278),

                            array(697, 670, 1305, 1278),

                            array(89, 1278, 697, 1886),

                            array(697, 1278, 1001, 1582),
                            array(1001, 1278, 1305, 1582),
                            array(697, 1582, 1001, 1886),
                            array(1001, 1582, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(89, 62, 393, 366),
                            array(393, 62, 697, 366),
                            array(89, 366, 393, 670),
                            array(393, 366, 697, 670),

                            array(697, 62, 1001, 366),
                            array(1001, 62, 1305, 366),
                            array(697, 366, 1001, 670),
                            array(1001, 366, 1305, 670),

                            array(89, 670, 393, 974),
                            array(393, 670, 697, 974),
                            array(89, 974, 393, 1278),
                            array(393, 974, 697, 1278),

                            array(697, 670, 1001, 974),
                            array(1001, 670, 1305, 974),
                            array(697, 974, 1001, 1278),
                            array(1001, 974, 1305, 1278),

                            array(89, 1278, 393, 1582),
                            array(393, 1278, 697, 1582),
                            array(89, 1582, 393, 1886),
                            array(393, 1582, 697, 1886),

                            array(697, 1278, 1001, 1582),
                            array(1001, 1278, 1305, 1582),
                            array(697, 1582, 1001, 1886),
                            array(1001, 1582, 1305, 1886),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'editorOverlay' => 'back-contour.png',
                'productOverlay' => 'back-productOverlay.png',
                'techOverlay' => 'back-techOverlay.png',
                'screen' => array(
                    'position' => array(301, 305, 1099, 1619),
                    'width' => 720,
                    'height' => 1280,
                ),
                'tech' => array(
                    'left' => 143,
                    'top' => 62,
                    'width' => 1110,
                    'height' => 1825,
                ),
                'zoom' => 1.15,
            ),
        ),
        'folderUrl' => 'img/case-galaxyS3/'
    ),
    'case-ipad-2-3-4' => array(
        'name' => 'iPad 2/3/4',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1290,
                'height' => 1695,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1290, 1695),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(76, 100, 1223, 563),
                            array(76, 563, 1223, 1127),
                            array(76, 1127, 1223, 1578),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(76, 100, 645, 563),
                            array(76, 563, 645, 1127),
                            array(76, 1127, 645, 1578),
                            array(645, 100, 1223, 563),
                            array(645, 563, 1223, 1127),
                            array(645, 1127, 1223, 1578),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(76, 100, 645, 563),

                            array(645, 100, 925, 285),
                            array(925, 100, 1223, 285),
                            array(645, 285, 925, 563),
                            array(925, 285, 1223, 563),

                            array(76, 563, 364, 847),
                            array(364, 563, 645, 847),
                            array(76, 847, 364, 1127),
                            array(364, 847, 645, 1127),

                            array(645, 563, 1223, 1127),

                            array(76, 1127, 645, 1578),

                            array(645, 1127, 925, 1409),
                            array(925, 1127, 1223, 1409),
                            array(645, 1409, 925, 1578),
                            array(925, 1409, 1223, 1578),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(76, 100, 364, 285),
                            array(364, 100, 645, 285),
                            array(76, 285, 364, 563),
                            array(364, 285, 645, 563),

                            array(645, 100, 925, 285),
                            array(925, 100, 1223, 285),
                            array(645, 285, 925, 563),
                            array(925, 285, 1223, 563),

                            array(76, 563, 364, 847),
                            array(364, 563, 645, 847),
                            array(76, 847, 364, 1127),
                            array(364, 847, 645, 1127),

                            array(645, 563, 925, 847),
                            array(925, 563, 1223, 847),
                            array(645, 847, 925, 1127),
                            array(925, 847, 1223, 1127),

                            array(76, 1127, 364, 1409),
                            array(364, 1127, 645, 1409),
                            array(76, 1409, 364, 1578),
                            array(364, 1409, 645, 1578),

                            array(645, 1127, 925, 1409),
                            array(925, 1127, 1223, 1409),
                            array(645, 1409, 925, 1578),
                            array(925, 1409, 1223, 1578),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'editorOverlay' => 'back-contour.png',
                'productOverlay' => 'back-productOverlay.png',
                'screen' => array(
                    'position' => array(222, 283, 852, 1125),
                    'width' => 1536,
                    'height' => 2048,
                ),
                'tech' => array(
                    'left' => 76,
                    'top' => 100,
                    'width' => 1147,
                    'height' => 1478,
                ),
                'zoom' => 1.15,
            ),
        ),
        'folderUrl' => 'img/case-ipad-2-3-4/'
    ),
    'case-ipad-mini' => array(
        'name' => 'iPad mini 1/2',
        'editors' => array(
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1268,
                'height' => 1767,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1268, 1767),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(101, 115, 1143, 621),
                            array(101, 621, 1143, 1139),
                            array(101, 1139, 1143, 1645),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(101, 115, 622, 621),
                            array(101, 621, 622, 1139),
                            array(101, 1139, 622, 1645),
                            array(622, 115, 1143, 621),
                            array(622, 621, 1143, 1139),
                            array(622, 1139, 1143, 1645),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(101, 115, 622, 621),

                            array(622, 115, 892, 369),
                            array(892, 115, 1143, 369),
                            array(622, 369, 892, 621),
                            array(892, 369, 1143, 621),

                            array(101, 621, 358, 880),
                            array(358, 621, 622, 880),
                            array(101, 880, 358, 1139),
                            array(358, 880, 622, 1139),

                            array(622, 621, 1143, 1139),

                            array(101, 1139, 622, 1645),

                            array(622, 1139, 892, 1399),
                            array(892, 1139, 1143, 1399),
                            array(622, 1399, 892, 1645),
                            array(892, 1399, 1143, 1645),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(101, 115, 358, 369),
                            array(358, 115, 622, 369),
                            array(101, 369, 358, 621),
                            array(358, 369, 622, 621),

                            array(622, 115, 892, 369),
                            array(892, 115, 1143, 369),
                            array(622, 369, 892, 621),
                            array(892, 369, 1143, 621),

                            array(101, 621, 358, 880),
                            array(358, 621, 622, 880),
                            array(101, 880, 358, 1139),
                            array(358, 880, 622, 1139),

                            array(622, 621, 892, 880),
                            array(892, 621, 1143, 880),
                            array(622, 880, 892, 1139),
                            array(892, 880, 1143, 1139),

                            array(101, 1139, 358, 1399),
                            array(358, 1139, 622, 1399),
                            array(101, 1399, 358, 1645),
                            array(358, 1399, 622, 1645),

                            array(622, 1139, 892, 1399),
                            array(892, 1139, 1143, 1399),
                            array(622, 1399, 892, 1645),
                            array(892, 1399, 1143, 1645),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'editorOverlay' => 'back-contour.png',
                'productOverlay' => 'back-productOverlay.png',
                'screen' => array(
                    'position' => array(192, 305, 864, 1147),
                    'width' => 1536,
                    'height' => 2048,
                ),
                'tech' => array(
                    'left' => 101,
                    'top' => 115,
                    'width' => 1042,
                    'height' => 1530,
                ),
                'zoom' => 1.15,
            ),
        ),
        'folderUrl' => 'img/case-ipad-mini/'
    ),

    'sticker-iphone5' => array(
        'name' => 'iPhone 5/5S',
        'editors' => array(
            'front' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 876,
                'height' => 1450,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 876, 1450),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(32, 116, 843, 725),
                            array(32, 725, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(32, 116, 843, 522),
                            array(32, 522, 843, 928),
                            array(32, 928, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(32, 116, 436, 420),
                            array(32, 420, 436, 725),
                            array(32, 725, 436, 1030),
                            array(32, 1030, 436, 1334),
                            array(436, 116, 843, 420),
                            array(436, 420, 843, 725),
                            array(436, 725, 843, 1030),
                            array(436, 1030, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(32, 116, 843, 725),
                            array(32, 725, 843, 1334),
                            array(436, 623, 649, 827),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(32, 116, 436, 522),

                            array(436, 116, 649, 319),
                            array(649, 116, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 843, 928),

                            array(32, 928, 436, 1334),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1334),
                            array(649, 1131, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(32, 116, 232, 319),
                            array(232, 116, 436, 319),
                            array(32, 319, 232, 522),
                            array(232, 319, 436, 522),

                            array(436, 116, 649, 319),
                            array(649, 116, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 649, 725),
                            array(649, 522, 843, 725),
                            array(436, 725, 649, 928),
                            array(649, 725, 843, 928),

                            array(32, 928, 232, 1131),
                            array(232, 928, 436, 1131),
                            array(32, 1131, 232, 1334),
                            array(232, 1131, 436, 1334),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1334),
                            array(649, 1131, 843, 1334),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'screen' => array(
                    'position' => array(186, 290, 492, 870),
                    'width' => 640,
                    'height' => 1136,
                ),
                'tech' => array(
                    'left' => 101,
                    'top' => 112,
                    'width' => 663,
                    'height' => 1218,
                ),
            ),
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 876,
                'height' => 1450,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 876, 1450),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(32, 18, 843, 725),
                            array(32, 725, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(32, 18, 843, 522),
                            array(32, 522, 843, 928),
                            array(32, 928, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(32, 18, 436, 420),
                            array(32, 420, 436, 725),
                            array(32, 725, 436, 1030),
                            array(32, 1030, 436, 1423),
                            array(436, 18, 843, 420),
                            array(436, 420, 843, 725),
                            array(436, 725, 843, 1030),
                            array(436, 1030, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(32, 18, 843, 725),
                            array(32, 725, 843, 1423),
                            array(436, 623, 649, 827),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(

                            array(32, 18, 232, 116),
                            array(232, 18, 436, 116),
                            array(436, 18, 843, 116),

                            array(32, 116, 436, 522),

                            array(436, 116, 649, 319),
                            array(649, 116, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 843, 928),

                            array(32, 928, 436, 1334),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1334),
                            array(649, 1131, 843, 1334),

                            array(32, 1334, 232, 1423),
                            array(232, 1334, 436, 1423),
                            array(436, 1334, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(32, 18, 232, 319),
                            array(232, 18, 436, 319),
                            array(32, 319, 232, 522),
                            array(232, 319, 436, 522),

                            array(436, 18, 649, 319),
                            array(649, 18, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 649, 725),
                            array(649, 522, 843, 725),
                            array(436, 725, 649, 928),
                            array(649, 725, 843, 928),

                            array(32, 928, 232, 1131),
                            array(232, 928, 436, 1131),
                            array(32, 1131, 232, 1423),
                            array(232, 1131, 436, 1423),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1423),
                            array(649, 1131, 843, 1423),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'editorOverlay' => 'back-contour.png',
                'tech' => array(
                    'left' => 54,
                    'top' => 18,
                    'width' => 764,
                    'height' => 1405,
                ),
            ),
        ),
        'folderUrl' => 'img/sticker-iphone5/'
    ),
    'sticker-iphone4' => array(
        'name' => 'iPhone 4/4S',
        'editors' => array(
            'front' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 876,
                'height' => 1450,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 876, 1450),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(32, 116, 843, 725),
                            array(32, 725, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(32, 116, 843, 522),
                            array(32, 522, 843, 928),
                            array(32, 928, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(32, 116, 436, 420),
                            array(32, 420, 436, 725),
                            array(32, 725, 436, 1030),
                            array(32, 1030, 436, 1334),
                            array(436, 116, 843, 420),
                            array(436, 420, 843, 725),
                            array(436, 725, 843, 1030),
                            array(436, 1030, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(32, 116, 843, 725),
                            array(32, 725, 843, 1334),
                            array(436, 623, 649, 827),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(32, 116, 436, 522),

                            array(436, 116, 649, 319),
                            array(649, 116, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 843, 928),

                            array(32, 928, 436, 1334),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1334),
                            array(649, 1131, 843, 1334),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(32, 116, 232, 319),
                            array(232, 116, 436, 319),
                            array(32, 319, 232, 522),
                            array(232, 319, 436, 522),

                            array(436, 116, 649, 319),
                            array(649, 116, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 649, 725),
                            array(649, 522, 843, 725),
                            array(436, 725, 649, 928),
                            array(649, 725, 843, 928),

                            array(32, 928, 232, 1131),
                            array(232, 928, 436, 1131),
                            array(32, 1131, 232, 1334),
                            array(232, 1131, 436, 1334),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1334),
                            array(649, 1131, 843, 1334),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'screen' => array(
                    'position' => array(192, 332, 506, 758),
                    'width' => 640,
                    'height' => 960,
                ),
                'tech' => array(
                    'left' => 54,
                    'top' => 16,
                    'width' => 764,
                    'height' => 1405,
                ),
            ),
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 876,
                'height' => 1450,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 876, 1450),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(32, 18, 843, 725),
                            array(32, 725, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(32, 18, 843, 522),
                            array(32, 522, 843, 928),
                            array(32, 928, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(32, 18, 436, 420),
                            array(32, 420, 436, 725),
                            array(32, 725, 436, 1030),
                            array(32, 1030, 436, 1423),
                            array(436, 18, 843, 420),
                            array(436, 420, 843, 725),
                            array(436, 725, 843, 1030),
                            array(436, 1030, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(32, 18, 843, 725),
                            array(32, 725, 843, 1423),
                            array(436, 623, 649, 827),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(

                            array(32, 18, 232, 116),
                            array(232, 18, 436, 116),
                            array(436, 18, 843, 116),

                            array(32, 116, 436, 522),

                            array(436, 116, 649, 319),
                            array(649, 116, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 843, 928),

                            array(32, 928, 436, 1334),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1334),
                            array(649, 1131, 843, 1334),

                            array(32, 1334, 232, 1423),
                            array(232, 1334, 436, 1423),
                            array(436, 1334, 843, 1423),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(32, 18, 232, 319),
                            array(232, 18, 436, 319),
                            array(32, 319, 232, 522),
                            array(232, 319, 436, 522),

                            array(436, 18, 649, 319),
                            array(649, 18, 843, 319),
                            array(436, 319, 649, 522),
                            array(649, 319, 843, 522),

                            array(32, 522, 232, 725),
                            array(232, 522, 436, 725),
                            array(32, 725, 232, 928),
                            array(232, 725, 436, 928),

                            array(436, 522, 649, 725),
                            array(649, 522, 843, 725),
                            array(436, 725, 649, 928),
                            array(649, 725, 843, 928),

                            array(32, 928, 232, 1131),
                            array(232, 928, 436, 1131),
                            array(32, 1131, 232, 1423),
                            array(232, 1131, 436, 1423),

                            array(436, 928, 649, 1131),
                            array(649, 928, 843, 1131),
                            array(436, 1131, 649, 1423),
                            array(649, 1131, 843, 1423),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'editorOverlay' => 'back-contour.png',
                'tech' => array(
                    'left' => 47,
                    'top' => 46,
                    'width' => 799,
                    'height' => 1341,
                ),
            ),
        ),
        'folderUrl' => 'img/sticker-iphone4/'
    ),
    'sticker-galaxyS3' => array(
        'name' => 'Galaxy S3',
        'editors' => array(
            'front' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 1396,
                'height' => 1949,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1396, 1949),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(89, 62, 1305, 978),
                            array(89, 978, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(89, 62, 1305, 670),
                            array(89, 670, 1305, 1278),
                            array(89, 1278, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(89, 62, 697, 518),
                            array(89, 518, 697, 978),
                            array(89, 978, 697, 1430),
                            array(89, 1430, 697, 1886),
                            array(697, 62, 1305, 518),
                            array(697, 518, 1305, 978),
                            array(697, 978, 1305, 1430),
                            array(697, 1430, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(89, 62, 1305, 978),
                            array(89, 978, 1305, 1886),
                            array(697, 822, 1001, 1126),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(89, 62, 697, 670),

                            array(697, 62, 1001, 366),
                            array(1001, 62, 1305, 366),
                            array(697, 366, 1001, 670),
                            array(1001, 366, 1305, 670),

                            array(89, 670, 393, 978),
                            array(393, 670, 697, 978),
                            array(89, 978, 393, 1278),
                            array(393, 978, 697, 1278),

                            array(697, 670, 1305, 1278),

                            array(89, 1278, 697, 1886),

                            array(697, 1278, 1001, 1582),
                            array(1001, 1278, 1305, 1582),
                            array(697, 1582, 1001, 1886),
                            array(1001, 1582, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(89, 62, 393, 366),
                            array(393, 62, 697, 366),
                            array(89, 366, 393, 670),
                            array(393, 366, 697, 670),

                            array(697, 62, 1001, 366),
                            array(1001, 62, 1305, 366),
                            array(697, 366, 1001, 670),
                            array(1001, 366, 1305, 670),

                            array(89, 670, 393, 978),
                            array(393, 670, 697, 978),
                            array(89, 978, 393, 1278),
                            array(393, 978, 697, 1278),

                            array(697, 670, 1001, 978),
                            array(1001, 670, 1305, 978),
                            array(697, 978, 1001, 1278),
                            array(1001, 978, 1305, 1278),

                            array(89, 1278, 393, 1582),
                            array(393, 1278, 697, 1582),
                            array(89, 1582, 393, 1886),
                            array(393, 1582, 697, 1886),

                            array(697, 1278, 1001, 1582),
                            array(1001, 1278, 1305, 1582),
                            array(697, 1582, 1001, 1886),
                            array(1001, 1582, 1305, 1886),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'screen' => array(
                    'position' => array(287, 281, 825, 1354),
                    'width' => 720,
                    'height' => 1280,
                ),
                'tech' => array(
                    'left' => 141,
                    'top' => 101,
                    'width' => 1107,
                    'height' => 1738,
                ),
            ),
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 1396,
                'height' => 1949,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1396, 1949),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(89, 62, 1305, 978),
                            array(89, 978, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(89, 62, 1305, 670),
                            array(89, 670, 1305, 1278),
                            array(89, 1278, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(89, 62, 697, 518),
                            array(89, 518, 697, 978),
                            array(89, 978, 697, 1430),
                            array(89, 1430, 697, 1886),
                            array(697, 62, 1305, 518),
                            array(697, 518, 1305, 978),
                            array(697, 978, 1305, 1430),
                            array(697, 1430, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(89, 62, 1305, 978),
                            array(89, 978, 1305, 1886),
                            array(697, 822, 1001, 1126),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(89, 62, 697, 670),

                            array(697, 62, 1001, 366),
                            array(1001, 62, 1305, 366),
                            array(697, 366, 1001, 670),
                            array(1001, 366, 1305, 670),

                            array(89, 670, 393, 978),
                            array(393, 670, 697, 978),
                            array(89, 978, 393, 1278),
                            array(393, 978, 697, 1278),

                            array(697, 670, 1305, 1278),

                            array(89, 1278, 697, 1886),

                            array(697, 1278, 1001, 1582),
                            array(1001, 1278, 1305, 1582),
                            array(697, 1582, 1001, 1886),
                            array(1001, 1582, 1305, 1886),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(89, 62, 393, 366),
                            array(393, 62, 697, 366),
                            array(89, 366, 393, 670),
                            array(393, 366, 697, 670),

                            array(697, 62, 1001, 366),
                            array(1001, 62, 1305, 366),
                            array(697, 366, 1001, 670),
                            array(1001, 366, 1305, 670),

                            array(89, 670, 393, 978),
                            array(393, 670, 697, 978),
                            array(89, 978, 393, 1278),
                            array(393, 978, 697, 1278),

                            array(697, 670, 1001, 978),
                            array(1001, 670, 1305, 978),
                            array(697, 978, 1001, 1278),
                            array(1001, 978, 1305, 1278),

                            array(89, 1278, 393, 1582),
                            array(393, 1278, 697, 1582),
                            array(89, 1582, 393, 1886),
                            array(393, 1582, 697, 1886),

                            array(697, 1278, 1001, 1582),
                            array(1001, 1278, 1305, 1582),
                            array(697, 1582, 1001, 1886),
                            array(1001, 1582, 1305, 1886),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'editorOverlay' => 'back-contour.png',
                'tech' => array(
                    'left' => 141,
                    'top' => 101,
                    'width' => 1107,
                    'height' => 1738,
                ),
            ),
        ),
        'folderUrl' => 'img/sticker-galaxyS3/'
    ),
    'sticker-ipad-2-3-4' => array(
        'name' => 'iPad 2/3/4',
        'editors' => array(
            'front' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 593,
                'height' => 746,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 593, 746),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(29, 22, 564, 240),
                            array(29, 240, 564, 506),
                            array(29, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(29, 22, 296, 240),
                            array(29, 240, 296, 506),
                            array(29, 506, 296, 714),

                            array(296, 22, 564, 240),
                            array(296, 240, 564, 506),
                            array(296, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                            array(296, 240, 564, 506),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(29, 22, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 564, 506),

                            array(29, 506, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(29, 22, 162, 106),
                            array(162, 22, 296, 106),
                            array(29, 106, 162, 240),
                            array(162, 106, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 430, 372),
                            array(430, 240, 564, 372),
                            array(296, 372, 430, 506),
                            array(430, 372, 564, 506),

                            array(29, 506, 162, 640),
                            array(162, 506, 296, 640),
                            array(29, 640, 162, 714),
                            array(162, 640, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'screen' => array(
                    'position' => array(91, 98, 413, 544),
                    'width' => 1536,
                    'height' => 2048,
                ),
                'tech' => array(
                    'left' => 27,
                    'top' => 24,
                    'width' => 537,
                    'height' => 688,
                ),
            ),
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 593,
                'height' => 746,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 593, 746),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(29, 22, 564, 240),
                            array(29, 240, 564, 506),
                            array(29, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(29, 22, 296, 240),
                            array(29, 240, 296, 506),
                            array(29, 506, 296, 714),

                            array(296, 22, 564, 240),
                            array(296, 240, 564, 506),
                            array(296, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                            array(296, 240, 564, 506),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(29, 22, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 564, 506),

                            array(29, 506, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(29, 22, 162, 106),
                            array(162, 22, 296, 106),
                            array(29, 106, 162, 240),
                            array(162, 106, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 430, 372),
                            array(430, 240, 564, 372),
                            array(296, 372, 430, 506),
                            array(430, 372, 564, 506),

                            array(29, 506, 162, 640),
                            array(162, 506, 296, 640),
                            array(29, 640, 162, 714),
                            array(162, 640, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'editorOverlay' => 'back-contour.png',
                'tech' => array(
                    'left' => 27,
                    'top' => 24,
                    'width' => 537,
                    'height' => 688,
                ),
            ),
        ),
        'folderUrl' => 'img/sticker-ipad-2-3-4/'
    ),
    'sticker-ipad-mini' => array(
        'name' => 'iPad mini 1/2',
        'editors' => array(
            'front' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 593,
                'height' => 746,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 593, 746),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(29, 22, 564, 240),
                            array(29, 240, 564, 506),
                            array(29, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(29, 22, 296, 240),
                            array(29, 240, 296, 506),
                            array(29, 506, 296, 714),

                            array(296, 22, 564, 240),
                            array(296, 240, 564, 506),
                            array(296, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                            array(296, 240, 564, 506),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(29, 22, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 564, 506),

                            array(29, 506, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(29, 22, 162, 106),
                            array(162, 22, 296, 106),
                            array(29, 106, 162, 240),
                            array(162, 106, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 430, 372),
                            array(430, 240, 564, 372),
                            array(296, 372, 430, 506),
                            array(430, 372, 564, 506),

                            array(29, 506, 162, 640),
                            array(162, 506, 296, 640),
                            array(29, 640, 162, 714),
                            array(162, 640, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'screen' => array(
                    'position' => array(93, 100, 403, 538),
                    'width' => 1536,
                    'height' => 2048,
                ),
                'tech' => array(
                    'left' => 27,
                    'top' => 24,
                    'width' => 537,
                    'height' => 688,
                ),
            ),
            'back' => array(
                'id' => 'back',
                'name' => 'Вид сзади',
                'width' => 593,
                'height' => 746,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 593, 746),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(29, 22, 564, 240),
                            array(29, 240, 564, 506),
                            array(29, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(29, 22, 296, 240),
                            array(29, 240, 296, 506),
                            array(29, 506, 296, 714),

                            array(296, 22, 564, 240),
                            array(296, 240, 564, 506),
                            array(296, 506, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(29, 22, 564, 372),
                            array(29, 372, 564, 714),
                            array(296, 240, 564, 506),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(29, 22, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 564, 506),

                            array(29, 506, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(29, 22, 162, 106),
                            array(162, 22, 296, 106),
                            array(29, 106, 162, 240),
                            array(162, 106, 296, 240),

                            array(296, 22, 430, 106),
                            array(430, 22, 564, 106),
                            array(296, 106, 430, 240),
                            array(430, 106, 564, 240),

                            array(29, 240, 162, 372),
                            array(162, 240, 296, 372),
                            array(29, 372, 162, 506),
                            array(162, 372, 296, 506),

                            array(296, 240, 430, 372),
                            array(430, 240, 564, 372),
                            array(296, 372, 430, 506),
                            array(430, 372, 564, 506),

                            array(29, 506, 162, 640),
                            array(162, 506, 296, 640),
                            array(29, 640, 162, 714),
                            array(162, 640, 296, 714),

                            array(296, 506, 430, 640),
                            array(430, 506, 564, 640),
                            array(296, 640, 430, 714),
                            array(430, 640, 564, 714),
                        ),
                    ),
                ),
                'mask' => 'back-mask.png',
                'overlay' => 'back-overlay.png',
                'productOverlay' => 'back-productOverlay.png',
                'editorOverlay' => 'back-contour.png',
                'tech' => array(
                    'left' => 27,
                    'top' => 24,
                    'width' => 537,
                    'height' => 688,
                ),
            ),
        ),
        'folderUrl' => 'img/sticker-ipad-mini/'
    ),

    'wear-tshirt' => array(
        'name' => 'Футболка',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 2124,
                'height' => 1729,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(633, 327, 1512, 1512),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(633, 327, 1512, 919),
                            array(633, 919, 1512, 1512),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(633, 327, 1512, 715),
                            array(633, 715, 1512, 1125),
                            array(633, 1125, 1512, 1512),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(633, 327, 1081, 715),
                            array(633, 715, 1081, 1125),
                            array(633, 1125, 1081, 1512),

                            array(1081, 327, 1512, 715),
                            array(1081, 715, 1512, 1125),
                            array(1081, 1125, 1512, 1512),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(633, 327, 1512, 919),
                            array(633, 919, 1512, 1512),
                            array(1081, 715, 1512, 1125),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid5.png',
                        'parts' => array(
                            array(633, 327, 1081, 715),

                            array(1081, 327, 1301, 513),
                            array(1301, 327, 1512, 513),
                            array(1081, 513, 1301, 715),
                            array(1301, 513, 1512, 715),

                            array(633, 715, 856, 919),
                            array(856, 715, 1081, 919),
                            array(633, 919, 856, 1125),
                            array(856, 919, 1081, 1125),

                            array(1081, 715, 1512, 1125),

                            array(633, 1125, 1081, 1512),

                            array(1081, 1125, 1301, 1337),
                            array(1301, 1125, 1512, 1337),
                            array(1081, 1337, 1301, 1512),
                            array(1301, 1337, 1512, 1512),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid6.png',
                        'parts' => array(
                            array(633, 327, 856, 513),
                            array(856, 327, 1081, 513),
                            array(633, 513, 856, 715),
                            array(856, 513, 1081, 715),

                            array(1081, 327, 1301, 513),
                            array(1301, 327, 1512, 513),
                            array(1081, 513, 1301, 715),
                            array(1301, 513, 1512, 715),

                            array(633, 715, 856, 919),
                            array(856, 715, 1081, 919),
                            array(633, 919, 856, 1125),
                            array(856, 919, 1081, 1125),

                            array(1081, 715, 1301, 919),
                            array(1301, 715, 1512, 919),
                            array(1081, 919, 1301, 1125),
                            array(1301, 919, 1512, 1125),

                            array(633, 1125, 856, 1337),
                            array(856, 1125, 1081, 1337),
                            array(633, 1337, 856, 1512),
                            array(856, 1337, 1081, 1512),

                            array(1081, 1125, 1301, 1337),
                            array(1301, 1125, 1512, 1337),
                            array(1081, 1337, 1301, 1512),
                            array(1301, 1337, 1512, 1512),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'overlayPosition' => 'under',
                'productOverlay' => 'front-productOverlay.png',
                'productOverlayPosition' => 'under',
                'tech' => array(
                    'left' => 633,
                    'top' => 327,
                    'width' => 879,
                    'height' => 1184,
                ),
                'zoom' => 1.1,
                'colors' => array('#ffffff'),
                'needColorOverlay' => false,
            ),
        ),
        'folderUrl' => 'img/wear-tshirt/'
    ),

    'cup-termo-plastic' => array(
        'name' => 'Термо-стакан (пластиковый)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Обзор 360°',
                'width' => 2301,
                'height' => 1600,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2301, 1600),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(

                            array(366, 479, 679, 787),
                            array(366, 787, 679, 1095),
                            array(366, 1095, 679, 1404),

                            array(679, 479, 995, 787),
                            array(679, 787, 995, 1095),
                            array(679, 1095, 995, 1404),

                            array(995, 479, 1309, 787),
                            array(995, 787, 1309, 1095),
                            array(995, 1095, 1309, 1404),

                            array(1309, 479, 1631, 787),
                            array(1309, 787, 1631, 1095),
                            array(1309, 1095, 1631, 1404),

                            array(1631, 479, 1951, 787),
                            array(1631, 787, 1951, 1095),
                            array(1631, 1095, 1951, 1404),
                        ),
                    ),

                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
//                            366 519 679 837 995 1150 1309 1467 1631 1793 1951
//                            479 635 787 942 1095 1248 1404
                            array(366, 479, 519, 635),
                            array(366, 635, 519, 787),
                            array(366, 1095, 519, 1248),
                            array(366, 1248, 519, 1404),
    
                            array(519, 479, 679, 635),
                            array(519, 635, 679, 787),
                            array(519, 1095, 679, 1248),
                            array(519, 1248, 679, 1404),

                            array(679, 787, 837, 942),
                            array(679, 942, 837, 1095),

                            array(837, 787, 995, 942),
                            array(837, 942, 995, 1095),
    
                            array(995, 479, 1150, 635),
                            array(995, 635, 1150, 787),
                            array(995, 1095, 1150, 1248),
                            array(995, 1248, 1150, 1404),
    
                            array(1150, 479, 1309, 635),
                            array(1150, 635, 1309, 787),
                            array(1150, 1095, 1309, 1248),
                            array(1150, 1248, 1309, 1404),

                            array(1309, 787, 1467, 942),
                            array(1309, 942, 1467, 1095),

                            array(1467, 787, 1631, 942),
                            array(1467, 942, 1631, 1095),
    
                            array(1631, 479, 1793, 635),
                            array(1631, 635, 1793, 787),
                            array(1631, 1095, 1793, 1248),
                            array(1631, 1248, 1793, 1404),
    
                            array(1793, 479, 1951, 635),
                            array(1793, 635, 1951, 787),
                            array(1793, 1095, 1951, 1248),
                            array(1793, 1248, 1951, 1404),

                            array(366, 787, 679, 1095),

                            array(679, 479, 995, 787),
                            array(679, 1095, 995, 1404),

                            array(995, 787, 1309, 1095),

                            array(1309, 479, 1631, 787),
                            array(1309, 1095, 1631, 1404),

                            array(1631, 787, 1951, 1095),
                        ),
                    ),

//                    array(
//                        'iconUrl' => 'icon-grid3.png',
//                        'parts' => array(
////                            366 519 679 837 995 1150 1309 1467 1631 1793 1951
////                            479 635 787 942 1095 1248 1404
//                            array(366, 479, 519, 635),
//                            array(366, 635, 519, 787),
//                            array(366, 787, 519, 942),
//                            array(366, 942, 519, 1095),
//                            array(366, 1095, 519, 1248),
//                            array(366, 1248, 519, 1404),
//
//                            array(519, 479, 679, 635),
//                            array(519, 635, 679, 787),
//                            array(519, 787, 679, 942),
//                            array(519, 942, 679, 1095),
//                            array(519, 1095, 679, 1248),
//                            array(519, 1248, 679, 1404),
//
//                            array(679, 479, 837, 635),
//                            array(679, 635, 837, 787),
//                            array(679, 787, 837, 942),
//                            array(679, 942, 837, 1095),
//                            array(679, 1095, 837, 1248),
//                            array(679, 1248, 837, 1404),
//
//                            array(837, 479, 995, 635),
//                            array(837, 635, 995, 787),
//                            array(837, 787, 995, 942),
//                            array(837, 942, 995, 1095),
//                            array(837, 1095, 995, 1248),
//                            array(837, 1248, 995, 1404),
//
//                            array(995, 479, 1150, 635),
//                            array(995, 635, 1150, 787),
//                            array(995, 787, 1150, 942),
//                            array(995, 942, 1150, 1095),
//                            array(995, 1095, 1150, 1248),
//                            array(995, 1248, 1150, 1404),
//
//                            array(1150, 479, 1309, 635),
//                            array(1150, 635, 1309, 787),
//                            array(1150, 787, 1309, 942),
//                            array(1150, 942, 1309, 1095),
//                            array(1150, 1095, 1309, 1248),
//                            array(1150, 1248, 1309, 1404),
//
//                            array(1309, 479, 1467, 635),
//                            array(1309, 635, 1467, 787),
//                            array(1309, 787, 1467, 942),
//                            array(1309, 942, 1467, 1095),
//                            array(1309, 1095, 1467, 1248),
//                            array(1309, 1248, 1467, 1404),
//
//                            array(1467, 479, 1631, 635),
//                            array(1467, 635, 1631, 787),
//                            array(1467, 787, 1631, 942),
//                            array(1467, 942, 1631, 1095),
//                            array(1467, 1095, 1631, 1248),
//                            array(1467, 1248, 1631, 1404),
//
//                            array(1631, 479, 1793, 635),
//                            array(1631, 635, 1793, 787),
//                            array(1631, 787, 1793, 942),
//                            array(1631, 942, 1793, 1095),
//                            array(1631, 1095, 1793, 1248),
//                            array(1631, 1248, 1793, 1404),
//
//                            array(1793, 479, 1951, 635),
//                            array(1793, 635, 1951, 787),
//                            array(1793, 787, 1951, 942),
//                            array(1793, 942, 1951, 1095),
//                            array(1793, 1095, 1951, 1248),
//                            array(1793, 1248, 1951, 1404),
//                        ),
//                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'editorOverlay' => 'front-contour.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 366,
                    'top' => 479,
                    'width' => 1585,
                    'height' => 925,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/cup-termo-plastic/'
    ),
    'cup-latte-big' => array(
        'name' => 'Кружка латте (большая)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Обзор 360°',
                'width' => 2200,
                'height' => 1572,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2200, 1572),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'editorOverlay' => 'front-contour.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 386,
                    'top' => 217,
                    'width' => 1403,
                    'height' => 1199,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/cup-latte-big/'
    ),
    'cup-latte-small' => array(
        'name' => 'Кружка латте (маленькая)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Обзор 360°',
                'width' => 2200,
                'height' => 1193,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2200, 1193),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'editorOverlay' => 'front-contour.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 369,
                    'top' => 184,
                    'width' => 1463,
                    'height' => 847,
                ),
                'zoom' => 1.25,
            ),
        ),
        'folderUrl' => 'img/cup-latte-small/'
    ),
    'cup-termo-metal' => array(
        'name' => 'Кружка-термос (метал)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Обзор 360°',
                'width' => 2300,
                'height' => 1577,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2300, 1577),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(299, 204, 726, 571),
                            array(299, 571, 726, 933),

                            array(726, 204, 1152, 571),
                            array(726, 571, 1152, 933),

                            array(1152, 204, 1580, 571),
                            array(1152, 571, 1580, 933),

                            array(1580, 204, 2005, 571),
                            array(1580, 571, 2005, 933),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(299, 571, 726, 933),
                            array(726, 204, 1152, 571),
                            array(1152, 571, 1580, 933),
                            array(1580, 204, 2005, 571),

                            array(299, 204, 509, 388),
                            array(299, 388, 509, 571),

                            array(509, 204, 726, 388),
                            array(509, 388, 726, 571),

                            array(726, 571, 940, 754),
                            array(726, 754, 940, 933),

                            array(940, 571, 1152, 754),
                            array(940, 754, 1152, 933),

                            array(1152, 204, 1364, 388),
                            array(1152, 388, 1364, 571),

                            array(1364, 204, 1580, 388),
                            array(1364, 388, 1580, 571),

                            array(1580, 571, 1796, 754),
                            array(1580, 754, 1796, 933),

                            array(1796, 571, 2005, 754),
                            array(1796, 754, 2005, 933),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(299, 204, 509, 388),
                            array(299, 388, 509, 571),
                            array(299, 571, 509, 754),
                            array(299, 754, 509, 933),

                            array(509, 204, 726, 388),
                            array(509, 388, 726, 571),
                            array(509, 571, 726, 754),
                            array(509, 754, 726, 933),

                            array(726, 204, 940, 388),
                            array(726, 388, 940, 571),
                            array(726, 571, 940, 754),
                            array(726, 754, 940, 933),

                            array(940, 204, 1152, 388),
                            array(940, 388, 1152, 571),
                            array(940, 571, 1152, 754),
                            array(940, 754, 1152, 933),

                            array(1152, 204, 1364, 388),
                            array(1152, 388, 1364, 571),
                            array(1152, 571, 1364, 754),
                            array(1152, 754, 1364, 933),

                            array(1364, 204, 1580, 388),
                            array(1364, 388, 1580, 571),
                            array(1364, 571, 1580, 754),
                            array(1364, 754, 1580, 933),

                            array(1580, 204, 1796, 388),
                            array(1580, 388, 1796, 571),
                            array(1580, 571, 1796, 754),
                            array(1580, 754, 1796, 933),

                            array(1796, 204, 2005, 388),
                            array(1796, 388, 2005, 571),
                            array(1796, 571, 2005, 754),
                            array(1796, 754, 2005, 933),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(299, 204, 940, 933),

                            array(940, 204, 1152, 388),
                            array(940, 388, 1152, 571),
                            array(940, 571, 1152, 754),
                            array(940, 754, 1152, 933),

                            array(1152, 204, 1364, 388),
                            array(1152, 388, 1364, 571),
                            array(1152, 571, 1364, 754),
                            array(1152, 754, 1364, 933),

                            array(1364, 204, 2005, 933),
                        ),
                    ),
                    // x: 299 509 726 940 1152 1364 1580 1796 2005
                    // y: 204 388 571 754 933
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'editorOverlay' => 'front-contour.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 299,
                    'top' => 204,
                    'width' => 1706,
                    'height' => 729,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/cup-termo-metal/'
    ),
    'cup-simple' => array(
        'name' => 'Кружка (керамика)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Обзор 360°',
                'width' => 2300,
                'height' => 1123,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2300, 1123),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid1.png',
                        'parts' => array(
                            array(299, 204, 726, 571),
                            array(299, 571, 726, 933),

                            array(726, 204, 1152, 571),
                            array(726, 571, 1152, 933),

                            array(1152, 204, 1580, 571),
                            array(1152, 571, 1580, 933),

                            array(1580, 204, 2005, 571),
                            array(1580, 571, 2005, 933),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid2.png',
                        'parts' => array(
                            array(299, 571, 726, 933),
                            array(726, 204, 1152, 571),
                            array(1152, 571, 1580, 933),
                            array(1580, 204, 2005, 571),

                            array(299, 204, 509, 388),
                            array(299, 388, 509, 571),

                            array(509, 204, 726, 388),
                            array(509, 388, 726, 571),

                            array(726, 571, 940, 754),
                            array(726, 754, 940, 933),

                            array(940, 571, 1152, 754),
                            array(940, 754, 1152, 933),

                            array(1152, 204, 1364, 388),
                            array(1152, 388, 1364, 571),

                            array(1364, 204, 1580, 388),
                            array(1364, 388, 1580, 571),

                            array(1580, 571, 1796, 754),
                            array(1580, 754, 1796, 933),

                            array(1796, 571, 2005, 754),
                            array(1796, 754, 2005, 933),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid3.png',
                        'parts' => array(
                            array(299, 204, 509, 388),
                            array(299, 388, 509, 571),
                            array(299, 571, 509, 754),
                            array(299, 754, 509, 933),

                            array(509, 204, 726, 388),
                            array(509, 388, 726, 571),
                            array(509, 571, 726, 754),
                            array(509, 754, 726, 933),

                            array(726, 204, 940, 388),
                            array(726, 388, 940, 571),
                            array(726, 571, 940, 754),
                            array(726, 754, 940, 933),

                            array(940, 204, 1152, 388),
                            array(940, 388, 1152, 571),
                            array(940, 571, 1152, 754),
                            array(940, 754, 1152, 933),

                            array(1152, 204, 1364, 388),
                            array(1152, 388, 1364, 571),
                            array(1152, 571, 1364, 754),
                            array(1152, 754, 1364, 933),

                            array(1364, 204, 1580, 388),
                            array(1364, 388, 1580, 571),
                            array(1364, 571, 1580, 754),
                            array(1364, 754, 1580, 933),

                            array(1580, 204, 1796, 388),
                            array(1580, 388, 1796, 571),
                            array(1580, 571, 1796, 754),
                            array(1580, 754, 1796, 933),

                            array(1796, 204, 2005, 388),
                            array(1796, 388, 2005, 571),
                            array(1796, 571, 2005, 754),
                            array(1796, 754, 2005, 933),
                        ),
                    ),
                    array(
                        'iconUrl' => 'icon-grid4.png',
                        'parts' => array(
                            array(299, 204, 940, 933),

                            array(940, 204, 1152, 388),
                            array(940, 388, 1152, 571),
                            array(940, 571, 1152, 754),
                            array(940, 754, 1152, 933),

                            array(1152, 204, 1364, 388),
                            array(1152, 388, 1364, 571),
                            array(1152, 571, 1364, 754),
                            array(1152, 754, 1364, 933),

                            array(1364, 204, 2005, 933),
                        ),
                    ),
                    // x: 299 509 726 940 1152 1364 1580 1796 2005
                    // y: 204 388 571 754 933
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'editorOverlay' => 'front-contour.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 299,
                    'top' => 204,
                    'width' => 1706,
                    'height' => 729,
                ),
                'zoom' => 1.25,
            ),
        ),
        'folderUrl' => 'img/cup-simple/'
    ),

    'mosaic-270-345-cartoon' => array(
        'name' => 'Мозайка 270×345мм (картон)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 2200,
                'height' => 1654,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2200, 1654),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 228,
                    'top' => 151,
                    'width' => 1748,
                    'height' => 1354,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/mosaic-270-345-cartoon/'
    ),
    'mosaic-240-190-cartoon' => array(
        'name' => 'Мозайка 240×190мм (картон)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 2200,
                'height' => 1865,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2200, 1865),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 278,
                    'top' => 175,
                    'width' => 1637,
                    'height' => 1508,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/mosaic-240-190-cartoon/'
    ),
    'mosaic-275-305-magnet' => array(
        'name' => 'Мозайка 275×305мм (магнит)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 2200,
                'height' => 1835,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2200, 1835),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 281,
                    'top' => 157,
                    'width' => 1634,
                    'height' => 1517,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/mosaic-275-305-magnet/'
    ),
    'mosaic-270-180-magnet' => array(
        'name' => 'Мозайка 270×180мм (магнит)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 2200,
                'height' => 1334,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2200, 1334),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 261,
                    'top' => 132,
                    'width' => 1666,
                    'height' => 1062,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/mosaic-270-180-magnet/'
    ),
    'mosaic-180-130-magnet' => array(
        'name' => 'Мозайка 180×130мм (магнит)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 2200,
                'height' => 1495,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 2200, 1495),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 472,
                    'top' => 299,
                    'width' => 1254,
                    'height' => 944,
                ),
                'zoom' => 1.1,
            ),
        ),
        'folderUrl' => 'img/mosaic-180-130-magnet/'
    ),

    'magnet-square' => array(
        'name' => 'Магнит (квадрат)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 1600,
                'height' => 1228,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1600, 1228),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 364,
                    'top' => 172,
                    'width' => 885,
                    'height' => 885,
                ),
                'zoom' => 1.2,
            ),
        ),
        'folderUrl' => 'img/magnet-square/'
    ),
    'magnet-round' => array(
        'name' => 'Магнит (круг)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 1600,
                'height' => 1337,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1600, 1337),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 277,
                    'top' => 157,
                    'width' => 1038,
                    'height' => 1038,
                ),
                'zoom' => 1.2,
            ),
        ),
        'folderUrl' => 'img/magnet-round/'
    ),
    'magnet-heart' => array(
        'name' => 'Магнит (сердце)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 1600,
                'height' => 1259,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1600, 1259),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 201,
                    'top' => 132,
                    'width' => 1192,
                    'height' => 966,
                ),
                'zoom' => 1.2,
            ),
        ),
        'folderUrl' => 'img/magnet-heart/'
    ),
    'magnet-oval' => array(
        'name' => 'Магнит (овал)',
        'editors' => array(
            'back' => array(
                'id' => 'front',
                'name' => 'Вид спереди',
                'width' => 1600,
                'height' => 1263,
                'grids' => array(
                    array(
                        'iconUrl' => 'icon-grid0.png',
                        'parts' => array(
                            array(0, 0, 1600, 1263),
                        ),
                    ),
                ),
                'mask' => 'front-mask.png',
                'overlay' => 'front-overlay.png',
                'productOverlay' => 'front-productOverlay.png',
                'tech' => array(
                    'left' => 215,
                    'top' => 171,
                    'width' => 1176,
                    'height' => 910,
                ),
                'zoom' => 1.2,
            ),
        ),
        'folderUrl' => 'img/magnet-oval/'
    ),
);