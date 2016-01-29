<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Igor Matyas (matyas.igor@gmail.com)
 * Date: Feb/27/14
 * Time: 9:41 PM
 */

$requestBody = @file_get_contents('php://input');
$requestData = json_decode($requestBody, true);

if (!isset($_GET['method'])) {
    exit();
}

if (isset($requestData['data'])) {
    $requestData['data'] = json_decode($requestData['data'], true);
}

$BigCoupon1 = [
    'couponId' => 'hp-offer',
    'imageSrc' => '/assets/panel/img/offers/big-hp.jpg',
];

$BigCoupon2 = [
    'couponId' => 'apple-offer',
    'imageSrc' => '/assets/panel/img/offers/big-iphone-5c.jpg',
];

$BigCoupon3 = [
    'couponId' => 'gap-offer',
    'imageSrc' => '/assets/panel/img/offers/big-gap.jpg',
];

$BigCoupon4 = [
    'couponId' => 'bk-offer',
    'imageSrc' => '/assets/panel/img/offers/big-bk.jpg',
];

$BigCoupon5 = [
    'couponId' => 'kfc-offer',
    'imageSrc' => '/assets/panel/img/offers/big-kfc.jpg',
];

$BigCoupon6 = [
    'couponId' => 'apple-offer',
    'imageSrc' => '/assets/panel/img/offers/big-mac.jpg',
];

$BigCoupon7 = [
    'couponId' => 'mcdonald-offer',
    'imageSrc' => '/assets/panel/img/offers/big-mcdonald.jpg',
];

$BigCoupon8 = [
    'couponId' => 'nike-offer',
    'imageSrc' => '/assets/panel/img/offers/big-nike.jpg',
];

$BigCoupon9 = [
    'couponId' => 'th-offer',
    'imageSrc' => '/assets/panel/img/offers/big-th.jpg',
];


$BigCoupons = [
    $BigCoupon1, $BigCoupon2, $BigCoupon3, $BigCoupon4, $BigCoupon5, $BigCoupon6, $BigCoupon7, $BigCoupon8, $BigCoupon9
];

$SmallCoupons = [
    'food' => [
        [
            'name' => 'Burger King',
            'couponId' => 'bk-offer',
            'imageSrc' => '/assets/panel/img/offers/small-bk.png',
            'code' => 'UOPR-9384E-PER',
            'position' => '2nd floor, Section U99',
            'offer' => 'Sotaque Carioca / $5.99 – Special price',
        ],
        [
            'name' => 'McDonald\'s',
            'couponId' => 'mcdonald-offer',
            'imageSrc' => '/assets/panel/img/offers/small-mcdonald.png',
            'code' => 'CPQR-1134T-OUI',
            'position' => '3rd floor, Food corner',
            'offer' => 'Save $1.29 on SMOKEHOUSE DELUXE / only in July',
        ],
        [
            'name' => 'KFC',
            'couponId' => 'kfc-offer',
            'imageSrc' => '/assets/panel/img/offers/small-kfc.png',
            'code' => 'JJUT-8914V-PPO',
            'position' => '3rd floor, Food corner',
            'offer' => 'Chicken Bucket only for $16.99, up to 20 Jul',
        ],
        [
            'name' => 'STARBUCKS',
            'couponId' => 'starbucks-offer',
            'imageSrc' => '/assets/panel/img/offers/small-starbucks.png',
            'code' => 'SSTT-1123V-STB',
            'position' => 'Ground Level, Center Hall',
            'offer' => 'Every coffee for $5 from 7 AM to 11 AM',
        ],
        [
            'name' => 'SUBWAY',
            'couponId' => 'subway-offer',
            'imageSrc' => '/assets/panel/img/offers/small-subway.png',
            'code' => 'SUBV-5234V-SUB',
            'position' => '2nd floor, Section U101',
            'offer' => 'Italian meat SUB only for $7.59 (save $2.4)',
        ],
        [
            'name' => 'J.CO',
            'couponId' => 'jco-offer',
            'imageSrc' => '/assets/panel/img/offers/small-jco.png',
            'code' => 'TPOD-5400M-AZZ',
            'position' => '1st floor, Section A9',
            'offer' => 'Six-Donuts pack with cappuccino for $7 / only TODAY',
        ],
    ],
    'wear' => [
        [
            'name' => 'GAP',
            'couponId' => 'gap-offer',
            'imageSrc' => '/assets/panel/img/offers/small-gap.png',
            'code' => 'GAPP-0049E-YDV',
            'position' => '3rd floor, Section U350',
            'offer' => '30% OFF on selected items / July',
        ],
        [
            'name' => 'Nike',
            'couponId' => 'nike-offer',
            'imageSrc' => '/assets/panel/img/offers/small-nike.png',
            'code' => 'NIKE-9999T-XOT',
            'position' => 'Underground level',
            'offer' => '25% OFF on every Sneakers in July',
        ],
        [
            'name' => 'Tommy Hilfiger',
            'couponId' => 'th-offer',
            'imageSrc' => '/assets/panel/img/offers/small-th.png',
            'code' => 'TTHH-0009M-RET',
            'position' => 'Upper level, West side',
            'offer' => '$20 OFF if you spend more than $300',
        ],
        [
            'name' => 'H&M',
            'couponId' => 'hm-offer',
            'imageSrc' => '/assets/panel/img/offers/small-hm.png',
            'code' => 'HHMM-0309M-PUY',
            'position' => 'Upper level, East side',
            'offer' => '–$15 on every 4th item / only in July',
        ],
        [
            'name' => 'Zara',
            'couponId' => 'zara-offer',
            'imageSrc' => '/assets/panel/img/offers/small-zara.png',
            'code' => 'ZARA-5555Y-XCB',
            'position' => '2nd floor, Zone B',
            'offer' => '$10 OFF on every shirt up to 22th July',
        ],
        [
            'name' => 'Levi\'s',
            'couponId' => 'levis-offer',
            'imageSrc' => '/assets/panel/img/offers/small-levis.png',
            'code' => 'LEVI-0223S-DIY',
            'position' => '2nd floor, Section 276',
            'offer' => '$20 OFF in July on selected jeans',
        ],
    ],
    'tech' => [
        [
            'name' => 'Apple',
            'couponId' => 'apple-offer',
            'imageSrc' => '/assets/panel/img/offers/small-apple.png',
            'code' => 'APPL-0001E-AAA',
            'position' => '1st floor, Left Block',
            'offer' => '–5% on every iPhone 5C and MacBook Pro Retina\'15',
        ],
        [
            'name' => 'HP',
            'couponId' => 'hp-offer',
            'imageSrc' => '/assets/panel/img/offers/small-hp.png',
            'code' => 'HPHP-9999T-XOT',
            'position' => 'Underground level, Zone A',
            'offer' => 'Save $75 on all Laptops when you spend over than $999.99',
        ],
        [
            'name' => 'Dell',
            'couponId' => 'dell-offer',
            'imageSrc' => '/assets/panel/img/offers/small-dell.png',
            'code' => 'DELL-0009M-RET',
            'position' => 'Upper level, West side',
            'offer' => 'Save $50 on every laptops Series Envy / weekly offer',
        ],
        [
            'name' => 'Media Markt',
            'couponId' => 'mm-offer',
            'imageSrc' => '/assets/panel/img/offers/small-mm.png',
            'code' => 'MEMA-9876R-XXU',
            'position' => 'Upper level, East side',
            'offer' => '%5 OFF on all laptops and desktops in July',
        ],
        [
            'name' => 'BestBuy',
            'couponId' => 'bb-offer',
            'imageSrc' => '/assets/panel/img/offers/small-bb.png',
            'code' => 'BEST-5555Y-XCB',
            'position' => '3rd floor, Zone B',
            'offer' => '$10 OFF on every ASUS laptops Series E / ONLY THIS WEEK',
        ],
        [
            'name' => 'Samsung',
            'couponId' => 'samsung-offer',
            'imageSrc' => '/assets/panel/img/offers/small-samsung.png',
            'code' => 'SAMS-0223S-TIR',
            'position' => '2nd floor, Section C',
            'offer' => 'Galaxy S3 mini only for $399.99 – Special week offer',
        ],
    ],
    'other' => [
        [
            'name' => 'IKEA',
            'couponId' => 'ikea-offer',
            'imageSrc' => '/assets/panel/img/offers/small-ikea.png',
            'code' => 'IKEA-0001E-AAA',
            'position' => '1st floor, Right Block',
            'offer' => '–7% on furniture for bathroom, up to 25th July',
        ],
        [
            'name' => 'Macy\'s',
            'couponId' => 'macys-offer',
            'imageSrc' => '/assets/panel/img/offers/small-macys.png',
            'code' => 'MACY-9999S-XOT',
            'position' => 'Underground level, Zone A',
            'offer' => '15% discount on all products in the grocery department, only this week',
        ],
        [
            'name' => 'Cinemark',
            'couponId' => 'cinemark-offer',
            'imageSrc' => '/assets/panel/img/offers/small-cinemark.png',
            'code' => 'CINE-0009M-ARK',
            'position' => '5th floor, West side',
            'offer' => 'Buy 3 tickets for the price of two from 10 am to 18 pm',
        ],
        [
            'name' => 'AMF Bowling',
            'couponId' => 'amf-offer',
            'imageSrc' => '/assets/panel/img/offers/small-amf.png',
            'code' => 'AMFB-9876R-OWL',
            'position' => '3rd floor, East side',
            'offer' => '50% OFF on bowling game up to 17 pm',
        ],
        [
            'name' => 'GoodLife Fitness',
            'couponId' => 'gl-offer',
            'imageSrc' => '/assets/panel/img/offers/small-gl.png',
            'code' => 'GOOD-5555L-IFE',
            'position' => '1st floor, Zone B',
            'offer' => 'Free one-time visit to the gym with a swimming pool and massage',
        ],
        [
            'name' => 'Lego',
            'couponId' => 'lego-offer',
            'imageSrc' => '/assets/panel/img/offers/small-lego.png',
            'code' => 'LEGO-0223S-OFF',
            'position' => '2nd floor, Section C',
            'offer' => '$5 discount on any constructors of the summer series / up to the end of summer',
        ],
    ],
];


switch ($_GET['method']) {
    case 'auth/login':

        $response = [
            'success' => false,
            'message' => "User not found"
        ];

        if ($requestData['email'] == 'z@z.com' && $requestData['password'] == '1') {
            $response = [
                'success' => true,
                'message' => "login",
                'data' => [
                    'id' => "FMGN-3228X",
                    'email' =>  "z@z.com",
                    'type' => "trader"
                ]
            ];

            setcookie('logged', 'true', time() + 60 * 60 * 24);
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();

        break;


    case 'auth/info':

        $response = [
            'success' => false,
            'message' => "Unauthorized"
        ];

        if (isset($_COOKIE['logged']) && $_COOKIE['logged'] == 'true') {
            $response = [
                'success' => true,
                'data' => [
                    'id' => "FMGN-3228X",
                    'email' =>  "z@z.com",
                    'type' => "trader"
                ]
            ];
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();

        break;

    case 'auth/logout':
        setcookie('logged', 'false', time());

        $response = [
            'success' => true,
            'message' => "Logout"
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();

        break;

    case 'coupons/list':

        foreach ($SmallCoupons as $SmallCouponsType => $SmallCouponsArray) {
            shuffle($SmallCoupons[$SmallCouponsType]);
        }

        $response = [
            'success' => true,
            'data' => [
                'mall'=> ['name' => 'Great Mall, IL', 'url' => 'great-mall'],
                "couponIndex" => $BigCoupons[rand(0, count($BigCoupons) - 1)],
                "coupons" => $SmallCoupons[$requestData['offersTypeId']]
            ]
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);

        exit();

        break;

    case 'coupons/get':

        $couponId = $requestData['couponId'];
        $coupon = [];

        foreach ($SmallCoupons as $SmallCouponsSection) {
            foreach ($SmallCouponsSection as $SmallCoupon) {
                if ($SmallCoupon['couponId'] == $couponId) {
                    $coupon = $SmallCoupon;
                    break;
                }
            }
        }

        $response = [
            'success' => $coupon ? true : false,
            'data' => [
                "coupon" => $coupon,
            ]
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();

        break;
}