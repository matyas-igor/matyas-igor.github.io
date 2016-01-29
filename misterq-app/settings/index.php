<? //header('Content-Type', 'text/html; charset=utf-8'); ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<?
    global $picturesFolder;
    global $picturesFolderUrl;
    include_once 'assets/qstickerApplication/php/inc/config.php';

    include_once 'assets/qstickerApplication/php/inc/templates.php';

    global $jsonProducts;
    include_once 'assets/qstickerApplication/php/inc/products.php';
?>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Конструктор подарков MisterQ</title>

    <meta name="keywords" content="чехол, стикер, наклейка, iPhone, iPad, Galaxy, iPad mini, qSticker, qCase, свой дизайн, одежда, кружки, мозайки, магниты, instagram, vk">
    <meta name="description" content="Создай чехол или наклейку для гаджета своими руками">

    <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/vendor/whhg-font/css/whhg.css">

    <link rel="stylesheet" href="/assets/qstickerApplication/css/style.css">
    <link rel="stylesheet" href="/assets/vendor/chosen/chosen.min.css">
    <link rel="stylesheet" href="/assets/vendor/blueimp-gallery/css/blueimp-gallery.min.css">
    <link rel="stylesheet" href="/assets/vendor/blueimp-gallery/css/bootstrap-image-gallery.min.css">

    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

    <meta name="viewport" content="user-scalable=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <style>
        body {
            background: url('assets/img/bg.png') repeat fixed center center #fff;
        }
    </style>
</head>

<body>
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" id="qstickerApplicationNavbar">
        <div class="container-fluid">
            <div class="container-fluid-inner">
                <div class="navbar-header" style="width: 240px;">
                    <a class="navbar-brand" href="/">MisterQ</a>
                </div>
                <ul class="nav navbar-nav" id="qstickerNavbar">
                    <li class="active"><a href="#" data-id="editor"><i class="icon-star-empty" style="position: relative; top: 1px; margin-right: 5px; line-height: 16px;"></i> Мой дизайн</a></li>
                    <li><a href="#" data-id="pictures">Как это выглядит?</a></li>
                    <li><a href="#" data-id="categories">Готовые предложения</a></li>
                </ul>
            </div>
            <div class="clearfix"></div>
        </div>
    </nav>
    <div class="container-fluid">
        <div class="container-fluid-inner">
            <div id="qstickerContainer" class="qstickerNavbar-tabContainer" data-id="editor">
                <div id="qstickerSidebar" style="float: left;"></div>
                <div id="qstickerApplicationWrapper" style="float: left; z-index: 100;"></div>
            </div>
            <div id="qstickerProductContainer" style="display: none;" class="qstickerNavbar-tabContainer"></div>
            <div id="qstickerPicturesContainer" style="margin-top: 60px; display: none;" class="qstickerNavbar-tabContainer" data-id="pictures">
                <div class="qstickerSidebar" style="float: left; width: 240px;">
                    <div class="list-group list-group-no-bordered" style="margin-right: 10px;">
                        <?
                        foreach ($jsonProducts['productsTypes'] as $productId => $productArray) {
                            ?>
                            <a href="#" class="list-group-item list-group-item-big button-toggle" data-id="<?=$productId?>"><?=$productArray['title']?></a>
                            <?
                        }
                        ?>
                    </div>
                </div>
                <div class="qstickerInformation" style="padding-left: 240px;">
                    <?
                    foreach ($jsonProducts['productsTypes'] as $productId => $productArray) {
                        ?>
                        <div class="qstickerPictures-container" data-id="<?=$productId?>" style="display: none;">
                        <?
                        $picturesProductFolder = $picturesFolder . $productId;
                        $picturesFiles = scandir($picturesProductFolder);
                        foreach ($picturesFiles as $pictureFile) {
                            if (mb_substr($pictureFile, 0, mb_strlen('icon-')) == 'icon-') {
                                $pictureImageFile = mb_substr($pictureFile, mb_strlen('icon-'));
                                ?>
                                    <a href="<?=$picturesFolderUrl . $productId . '/' . $pictureImageFile?>" style="background-image: url('<?=$picturesFolderUrl . $productId . '/' . $pictureFile?>');" class="qstickerPictures-image"></a>
                                <?
                            }
                        }
                        ?>
                        </div>
                        <?
                    }
                    ?>
                </div>
            </div>
            <div id="qstickerCategoriesContainer" style="margin-top: 51px; display: none; background-color: #fff; padding: 20px 0 30px;" class="qstickerNavbar-tabContainer" data-id="categories">
                <div class="qstickerCategories-row">

                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/qsticker" target="_blank">
                            <img src="assets/img/icons/sticker.jpg" alt="" />
                            <h3>Наклейки Qsticker</h3>
                        </a>
                    </div>

                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/qcase" target="_blank">
                            <img src="assets/img/icons/case.jpg" alt="" />
                            <h3>Чехлы Qcase</h3>
                        </a>
                    </div>

                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/odezhda" target="_blank">
                            <img src="assets/img/icons/wear.jpg" alt="" />
                            <h3>Одежда</h3>
                        </a>
                    </div>

                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/aksessuary-dlya-gadzhetov" target="_blank">
                            <img src="assets/img/icons/cup.jpg" alt="" />
                            <h3>Кружки</h3>
                        </a>
                    </div>

                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/aksessuary-dlya-gadzhetov" target="_blank">
                            <img src="assets/img/icons/gift.jpg" alt="" />
                            <h3>Подарки</h3>
                        </a>
                    </div>

                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/aksessuary-dlya-gadzhetov" target="_blank">
                            <img src="assets/img/icons/magnet.jpg" alt="" />
                            <h3>Магниты</h3>
                        </a>
                    </div>

                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/aksessuary-dlya-gadzhetov" target="_blank">
                            <img src="assets/img/icons/mosaic.jpg" alt="" />
                            <h3>Мозайки</h3>
                        </a>
                    </div>


                    <div class="qstickerCategories-cell">
                        <a href="http://www.misterq.ru/collection/aksessuary-dlya-gadzhetov" target="_blank">
                            <img src="assets/img/icons/mosaic.jpg" alt="" />
                            <h3>Мозайки</h3>
                        </a>
                    </div>


                </div>
            </div>
        </div>
    </div>

    <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
        <div class="slides"></div>
        <h3 class="title"></h3>
        <a class="prev">‹</a>
        <a class="next">›</a>
        <a class="close">×</a>
        <a class="play-pause"></a>
        <ol class="indicator"></ol>
    </div>

    <script src="/assets/vendor/require/require.js"></script>
    <script>
        require.config({
            baseUrl: '/assets',
            shim: {
                underscore: {
                    exports: '_'
                },
                jquery: {
                    exports: '$'
                }
            },
            paths: {
                jquery: 'vendor/jquery/jquery-1.10.2',
                underscore: 'vendor/underscore/underscore-min',
                qsticker: 'qstickerApplication/js/qstickerApplication.js?t=<?=date('Y-m-d_H-i-s', mktime(5, 11, 00, 12, 30, 2013))?>'
            }
        });

        require(['qsticker', 'jquery', 'vendor/bootstrap/js/bootstrap.min'], function(qSticker) {

            var $qstickerContainer = $('#qstickerContainer'),
                $qstickerProductContainer = $('#qstickerProductContainer'),
                $qstickerPicturesContainer = $('#qstickerPicturesContainer'),
                $qstickerCategoriesContainer = $('#qstickerCategoriesContainer'),
                $qstickerSidebar = $('#qstickerSidebar'),
                $qstickerApplicationWrapper = $('#qstickerApplicationWrapper'),
                $qstickerNavbar = $('#qstickerNavbar'),
                applicationTopMargin = $('#qstickerApplicationNavbar').outerHeight(),
                applicationHeight = $(window).height() - applicationTopMargin,
                resizeApplication = function() {
                    var applicationTopMargin = $('#qstickerApplicationNavbar').outerHeight(),
                        applicationHeight = $(window).height() - applicationTopMargin;

                    $qstickerContainer.css({
                        'min-height': applicationHeight,
                        'margin-top': applicationTopMargin,
                        'margin-bottom': 0,
                        'padding': 0
                    });
                    $qstickerProductContainer.css({
                        'margin-top': applicationTopMargin
                    });
                    $qstickerSidebar.css({
                        'min-height': applicationHeight
                    });
                    $qstickerApplicationWrapper.css({
                        'height': applicationHeight
                    });

                    return {topMargin: applicationTopMargin, height: applicationHeight};
                },
                resizeTimeout = null;

            resizeApplication();

            var qStickerApplication = new qSticker(),
                qstickerData = <?=json_encode($jsonProducts)?>,
                getParameters = <?=json_encode($_GET)?>;

            qStickerApplication.init({
                $container: $qstickerContainer,
                $wrapper: $qstickerApplicationWrapper,
                $sidebar: $qstickerSidebar,
                $navbar: $qstickerNavbar,
                height: applicationHeight,
                productsData: qstickerData,
                getParameters: getParameters,
                applicationUrl: '/assets/qstickerApplication/',
                $productContainer: $qstickerProductContainer,
                $picturesContainer: $qstickerPicturesContainer,
                $categoriesContainer: $qstickerCategoriesContainer
            });

            $(window).on('resize', function() {
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }

                resizeTimeout = setTimeout(function() {
                    var heightObject = resizeApplication();
                    qStickerApplication.resize(heightObject.height);
                    resizeTimeout = null;
                }, 150);
            });

//                qSticker.init({
//                    submitPath: '/assets/qstickerApplication/php/submit.php',
//                    applicationPath: '/assets/qstickerApplication/',
//                    onComplete: function(json) {
//                        setTimeout(function() {
//                            var domain = 'http://qsticker-tes-2.myinsales.ru';
//                            window.location = domain + '/product/' + json.productLink;
//                        }, 1000);
//                    }
//                });

        });

    </script>
</body>
</html>
