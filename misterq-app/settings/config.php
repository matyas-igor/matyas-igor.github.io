<?php
//define('ENVIRONMENT', 'production');
//define('ENVIRONMENT', 'testing');
define('ENVIRONMENT', 'nothing');

// ---------------------------------------------------

// qsticker-test5.myinsales.ru
$inSalesDomain = 'qsticker-test5.myinsales.ru';
$inSalesApiKey = '2a0e6b02148f8afdd19bde3d04a73e91';
$inSalesApiPassword = 'b7ebc8c3218062ba5ccb899243ecc0b6';
$inSalesStoreDomain = 'qsticker-test5.myinsales.ru';

// ---------------------------------------------------

// local (qsticker.local)
//$settingsOAuth = array(
//    'vk' => array('applicationId' => '3964801', 'secureKey' => '1dQJ96QmKLSktHTTPtD8'),
//    'instagram' => array('clientId' => '943e875fb10e4390904db1555d8083bf', 'clientSecret' => '6a0fe4375524426faa2107690e61feca'),
//);
//$applicationDomain = 'http://qsticker.local';

// production testing (qsticker.matyas-igor.ru)
$settingsOAuth = array(
    'vk' => array('applicationId' => '3979281', 'secureKey' => 'Tv2Iy5tRUHvNO2Gvx8bP'),
    'instagram' => array('clientId' => 'c94eb8649b2e4bc395044502dec2c865', 'clientSecret' => 'f1bb8da6af734b1fb987d97931a2f20d'),
);
$applicationDomain = 'http://qsticker.matyas-igor.ru';

// ---------------------------------------------------

$productsInformation = array(
    'case-galaxyS3' => array(
        "name" => "Qcase с инидивидуальным дизайном для Galaxy S3",
        "title" => "Qcase для Galaxy S3",
        "price" => "1199",
        "descriptionFull" => "<p>Подробнее о наших чехлах:</p> <p> <ul> <li>Печать на чехлах со всех сторон</li> <li>После оплаты заказа заставка на экран придет на вашу почту</li> <li>Рисунок не стирается даже после мелких царапин на стекле</li> <li>Высокое качество материалов</li> <li>Чехол не мешает использованию наушников и зарядки</li> <li>Можно использовать с защитной пленкой</li> </ul> </p>",
        "descriptionShort" => "",
        "options" => array(
            'matte-protective-film' => array(
                "name" => "матовая защитная пленка",
                "title" => "добавить матовую защитную пленку",
                "price" => "299"
            ),
            'glance-protective-film' => array(
                "name" => "глянцевая защитная пленка",
                "title" => "добавить глянцевую защитную пленку",
                "price" => "299"
            ),
        )
    ),
    'sticker-galaxyS3' => array(
        "name" => "Qsticker с инидивидуальным дизайном для Galaxy S3",
        "title" => "Qsticker для Galaxy S3",
        "price" => "999",
        "descriptionFull" => "<p>Подробнее о наших наклейках:</p> <p> <ul> <li>Закрывают заднюю, переднюю и боковые стороны</li> <li>После оплаты заказа заставка на экран придет на вашу почту</li> <li>Клеится без пузырей</li> <li>После удаления не оставляет следов клея</li> <li>Очень тонкий винил 3М (1 мм)</li> <li>Можно использовать с защитной пленкой</li> </ul> </p>",
        "descriptionShort" => "",
        "options" => array(
            'matte-protective-film' => array(
                "name" => "матовая защитная пленка",
                "title" => "добавить матовую защитную пленку",
                "price" => "299"
            ),
            'glance-protective-film' => array(
                "name" => "глянцевая защитная пленка",
                "title" => "добавить глянцевую защитную пленку",
                "price" => "299"
            ),
        ),
    ),
    'case-iphone5' => array(
        "name" => "Qcase с инидивидуальным дизайном для iPhone 5/5S",
        "title" => "Qcase для iPhone 5/5S",
        "price" => "1199",
        "descriptionFull" => "<p>Подробнее о наших чехлах:</p> <p> <ul> <li>Печать на чехлах со всех сторон</li> <li>После оплаты заказа заставка на экран придет на вашу почту</li> <li>Рисунок не стирается даже после мелких царапин на стекле</li> <li>Высокое качество материалов</li> <li>Чехол не мешает использованию наушников и зарядки</li> <li>Можно использовать с защитной пленкой</li> </ul> </p>",
        "descriptionShort" => "",
        "options" => array(
            'matte-protective-film' => array(
                "name" => "матовая защитная пленка",
                "title" => "добавить матовую защитную пленку",
                "price" => "299"
            ),
            'glance-protective-film' => array(
                "name" => "глянцевая защитная пленка",
                "title" => "добавить глянцевую защитную пленку",
                "price" => "299"
            ),
        )
    ),
    'sticker-iphone5' => array(
        "name" => "Qsticker с инидивидуальным дизайном для iPhone 5/5S",
        "title" => "Qsticker для iPhone 5/5S",
        "price" => "999",
        "descriptionFull" => "<p>Подробнее о наших наклейках:</p> <p> <ul> <li>Закрывают заднюю, переднюю и боковые стороны</li> <li>После оплаты заказа заставка на экран придет на вашу почту</li> <li>Клеится без пузырей</li> <li>После удаления не оставляет следов клея</li> <li>Очень тонкий винил 3М (1 мм)</li> <li>Можно использовать с защитной пленкой</li> </ul> </p>",
        "descriptionShort" => "",
        "options" => array(
            'matte-protective-film' => array(
                "name" => "матовая защитная пленка",
                "title" => "добавить матовую защитную пленку",
                "price" => "299"
            ),
            'glance-protective-film' => array(
                "name" => "глянцевая защитная пленка",
                "title" => "добавить глянцевую защитную пленку",
                "price" => "299"
            ),
        ),
    ),
    'case-iphone4' => array(
        "name" => "Qcase с инидивидуальным дизайном для iPhone 4/4S",
        "title" => "Qcase для iPhone 4/4S",
        "price" => "1199",
        "descriptionFull" => "<p>Подробнее о наших чехлах:</p> <p> <ul> <li>Печать на чехлах со всех сторон</li> <li>После оплаты заказа заставка на экран придет на вашу почту</li> <li>Рисунок не стирается даже после мелких царапин на стекле</li> <li>Высокое качество материалов</li> <li>Чехол не мешает использованию наушников и зарядки</li> <li>Можно использовать с защитной пленкой</li> </ul> </p>",
        "descriptionShort" => "",
        "options" => array(
            'matte-protective-film' => array(
                "name" => "матовая защитная пленка",
                "title" => "добавить матовую защитную пленку",
                "price" => "299"
            ),
            'glance-protective-film' => array(
                "name" => "глянцевая защитная пленка",
                "title" => "добавить глянцевую защитную пленку",
                "price" => "299"
            ),
        ),
    ),
    'sticker-iphone4' => array(
        "name" => "Qsticker с инидивидуальным дизайном для iPhone 4/4S",
        "title" => "Qsticker для iPhone 4/4S",
        "price" => "999",
        "descriptionFull" => "<p>Подробнее о наших наклейках:</p> <p> <ul> <li>Закрывают заднюю, переднюю и боковые стороны</li> <li>После оплаты заказа заставка на экран придет на вашу почту</li> <li>Клеится без пузырей</li> <li>После удаления не оставляет следов клея</li> <li>Очень тонкий винил 3М (1 мм)</li> <li>Можно использовать с защитной пленкой</li> </ul> </p>",
        "descriptionShort" => "",
        "options" => array(
            'matte-protective-film' => array(
                "name" => "матовая защитная пленка",
                "title" => "добавить матовую защитную пленку",
                "price" => "299"
            ),
            'glance-protective-film' => array(
                "name" => "глянцевая защитная пленка",
                "title" => "добавить глянцевую защитную пленку",
                "price" => "299"
            ),
        ),
    ),
    'sticker-ipad-2-3-4' => array(
        "name" => "Qsticker с инидивидуальным дизайном для iPad 2/3/4",
        "title" => "Qsticker для iPad 2/3/4",
        "price" => "999",
        "descriptionFull" => "<p>Подробнее о наших наклейках:</p> <p> <ul> <li>Закрывают заднюю, переднюю и боковые стороны</li> <li>После оплаты заказа заставка на экран придет на вашу почту</li> <li>Клеится без пузырей</li> <li>После удаления не оставляет следов клея</li> <li>Очень тонкий винил 3М (1 мм)</li> <li>Можно использовать с защитной пленкой</li> </ul> </p>",
        "descriptionShort" => "",
        "options" => array(
            'matte-protective-film' => array(
                "name" => "матовая защитная пленка",
                "title" => "добавить матовую защитную пленку",
                "price" => "299"
            ),
            'glance-protective-film' => array(
                "name" => "глянцевая защитная пленка",
                "title" => "добавить глянцевую защитную пленку",
                "price" => "299"
            ),
        ),
    ),
);

$qStickerEmails = array(
    'matyas.igor@gmail.com'
);

$qStickerEmailFrom = 'Qsticker application <mail@qsticker.ru>';