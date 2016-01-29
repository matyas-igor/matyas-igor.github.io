<?php
//define('ENVIRONMENT', 'production');
define('ENVIRONMENT', 'testing');
//define('ENVIRONMENT', 'nothing');

// ---------------------------------------------------

$picturesFolder = 'pictures/';
$picturesFolderUrl = '/pictures/';

// qsticker-test5.myinsales.ru
$inSalesDomain = 'qsticker-test5.myinsales.ru';
$inSalesApiKey = '2a0e6b02148f8afdd19bde3d04a73e91';
$inSalesApiPassword = 'b7ebc8c3218062ba5ccb899243ecc0b6';
$inSalesStoreDomain = 'qsticker-test5.myinsales.ru';

// ---------------------------------------------------

// local (qsticker.local)
$settingsOAuth = array(
    'vk' => array('applicationId' => '3964801', 'secureKey' => '1dQJ96QmKLSktHTTPtD8'),
    'instagram' => array('clientId' => '943e875fb10e4390904db1555d8083bf', 'clientSecret' => '6a0fe4375524426faa2107690e61feca'),
);
$applicationDomain = 'http://misterq-igormatyas.rhcloud.com/';

// ---------------------------------------------------

$testingEmails = 'matyas.igor@gmail.com';

// ---------------------------------------------------

$productsInformation = array(
    'case-iphone6' => array(
        "name" => "Qcase с инидивидуальным дизайном для iPhone 6",
        "title" => "Qcase для iPhone 6",
        "price" => "899",
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
    'case-iphone6-plus' => array(
        "name" => "Qcase с инидивидуальным дизайном для iPhone 6 Plus",
        "title" => "Qcase для iPhone 6 Plus",
        "price" => "899",
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
    'case-iphone5c' => array(
        "name" => "Qcase с инидивидуальным дизайном для iPhone 5C",
        "title" => "Qcase для iPhone 5C",
        "price" => "899",
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
    'sticker-iphone6-plus' => array(
        "name" => "Qsticker с инидивидуальным дизайном для iPhone 6 Plus",
        "title" => "Qsticker для iPhone 6 Plus",
        "price" => "899",
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
    'sticker-iphone6' => array(
        "name" => "Qsticker с инидивидуальным дизайном для iPhone 6",
        "title" => "Qsticker для iPhone 6",
        "price" => "899",
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

    'case-ipad-mini' => array(
        "name" => "Qcase с инидивидуальным дизайном для iPad mini 1/2",
        "title" => "Qcase для iPad mini 1/2",
        "price" => "999",
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
    'case-ipad-2-3-4' => array(
        "name" => "Qcase с инидивидуальным дизайном для iPad 2/3/4",
        "title" => "Qcase для iPad 2/3/4",
        "price" => "1299",
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
    'case-galaxyS3' => array(
        "name" => "Qcase с инидивидуальным дизайном для Galaxy S3",
        "title" => "Qcase для Galaxy S3",
        "price" => "899",
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
        "price" => "899",
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
        "price" => "899",
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
    'sticker-ipad-mini' => array(
        "name" => "Qsticker с инидивидуальным дизайном для iPad mini 1/2",
        "title" => "Qsticker для iPad mini 1/2",
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
    'wear-tshirt' => array(
        "name" => "Футболка с индивидуальным дизайном",
        "title" => "Футболка",
        "price" => "699",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'cup-termo-plastic' => array(
        "name" => "Термо-стакан (пластиковый) с индивидуальным дизайном",
        "title" => "Термо-стакан (пластиковый)",
        "price" => "699",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'cup-termo-metal' => array(
        "name" => "Кружка-термос (метал) с индивидуальным дизайном",
        "title" => "Кружка-термос (метал)",
        "price" => "699",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'cup-simple' => array(
        "name" => "Кружка (керамика) с индивидуальным дизайном",
        "title" => "Кружка (керамика)",
        "price" => "349",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'cup-latte-big' => array(
        "name" => "Кружка латте (большая) с индивидуальным дизайном",
        "title" => "Кружка латте (большая)",
        "price" => "599",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'cup-latte-small' => array(
        "name" => "Кружка латте (маленькая) с индивидуальным дизайном",
        "title" => "Кружка латте (маленькая)",
        "price" => "399",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'mosaic-270-345-cartoon' => array(
        "name" => "Мозайка 270мм на 345мм (картон) с индивидуальным дизайном",
        "title" => "Мозайка 270×345мм (картон)",
        "price" => "299",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'mosaic-240-190-cartoon' => array(
        "name" => "Мозайка 240мм на 190мм (картон) с индивидуальным дизайном",
        "title" => "Мозайка 240×190мм (картон)",
        "price" => "199",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'mosaic-275-305-magnet' => array(
        "name" => "Мозайка 275мм на 305мм (магнит) с индивидуальным дизайном",
        "title" => "Мозайка 275×305мм (магнит)",
        "price" => "899",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'mosaic-270-180-magnet' => array(
        "name" => "Мозайка 270мм на 180мм (магнит) с индивидуальным дизайном",
        "title" => "Мозайка 270×180мм (магнит)",
        "price" => "499",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'mosaic-180-130-magnet' => array(
        "name" => "Мозайка 180мм на 130мм (магнит) с индивидуальным дизайном",
        "title" => "Мозайка 180×130мм (магнит)",
        "price" => "299",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),

    'magnet-square' => array(
        "name" => "Магнит (квадрат) с индивидуальным дизайном",
        "title" => "Магнит (квадрат)",
        "price" => "149",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'magnet-round' => array(
        "name" => "Магнит (круг) с индивидуальным дизайном",
        "title" => "Магнит (круг)",
        "price" => "149",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'magnet-heart' => array(
        "name" => "Магнит (сердце) с индивидуальным дизайном",
        "title" => "Магнит (сердце)",
        "price" => "149",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
    'magnet-oval' => array(
        "name" => "Магнит (овал) с индивидуальным дизайном",
        "title" => "Магнит (овал)",
        "price" => "149",
        "descriptionFull" => "",
        "descriptionShort" => "",
        "options" => array(),
    ),
);

$qStickerEmails = array(
    'matyas.igor@gmail.com'
);

$qStickerEmailFrom = 'Qsticker application <mail@qsticker.ru>';