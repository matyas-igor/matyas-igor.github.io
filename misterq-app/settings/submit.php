<?php
ini_set('memory_limit', '128M');
ini_set('max_execution_time', 360); //300 seconds = 5 minutes
ini_set('max_input_time', 360); //300 seconds = 5 minutes

// define('ENVIRONMENT', 'production');
define('ENVIRONMENT', 'testing');

header('Content-Type: application/json; charset=utf-8');
//header('Content-Type: text/html; charset=utf-8');
if (!isset($_POST['uniqueId'])) {
    $returnObject = array(
        'status' => 'error',
        'message' => 'Произошла ошибка, пожалуйста, повторите попытку позже',
    );

    echo json_encode($returnObject);
    exit();
}

$folderPath = 'images/';

if ($_GET['action'] == 'image') {
    $parsedImage = parseImage($_POST['imageData'], $_POST['uniqueId'] . '-' . $_POST['imageName']);
    file_put_contents($folderPath . $parsedImage['name'], base64_decode($parsedImage['image']));

    $returnObject = array(
        'status' => 'success',
        'message' => 'Изображение успешно загружено',
    );

    echo json_encode($returnObject);
    exit();
}

if (ENVIRONMENT == 'testing') {

    if ($_GET['action'] == 'data') {
        $uniqueId = $_POST['uniqueId'];
        $imagesIds = $_POST['imagesIds'];
        $imagesIdsExtensions = $_POST['imagesIdsExtensions'];

        $files = array();
        foreach ($imagesIds as $imageId) {
            $imageExtension = $imagesIdsExtensions[$imageId];
            $imageName = $imageId . '.' . $imageExtension;
            $files[] = array('name' => $imageName, 'image' => base64_encode(file_get_contents($folderPath . $_POST['uniqueId'] . '-' . $imageName)));

            @unlink($folderPath . $_POST['uniqueId'] . '-' . $imageName);
        }

        sendEmails('matyas.igor@gmail.com', 'test@test.local', 'test', 'test message', $files);
    }

    exit();
}

if (ENVIRONMENT == 'production') {

// data:image/jpeg;base64,
// data:image/png;base64,
// var_dump($_POST);

    $productId = $_POST['productId'];
    $uniqueId = $_POST['uniqueId'];
    $imagesIds = $_POST['imagesIds'];
    $colors = $_POST['colors'];
    $imagesIdsExtensions = $_POST['imagesIdsExtensions'];

    $files = array();
    foreach ($imagesIds as $imageId) {
        $imageExtension = $imagesIdsExtensions[$imageId];
        $imageName = $imageId . '.' . $imageExtension;
        $files[$imageId] = array('name' => $imageName, 'image' => base64_encode(file_get_contents($folderPath . $_POST['uniqueId'] . '-' . $imageName)));

        @unlink($folderPath . $_POST['uniqueId'] . '-' . $imageName);
    }
    
    global $productsInformation;

    require_once('inc/config.php');
    require_once('inc/insales_api.php');

    define(BASEURL_INSALES, "http://$inSalesApiKey:$inSalesApiPassword@$inSalesDomain/");

//    insales_api_client = insales_api_client($inSalesDomain, $inSalesApiKey, $inSalesApiPassword);

    $productAdditionalOptions = isset($_POST['optionsIds']) ? $_POST['optionsIds'] : array();

    $productCategoryId = 1297378;
    $productCollectionId = 2099066;
    $productCollectionUrl = '/collection/tovary-iz-rendera';
    $productWallpaperId = 2813;

//    $productCategoryId = 1580223;
//    $productCollectionId = 2100348;
//    $productCollectionUrl = '/collection/puhoviki';
//    $productWallpaperId = 2813;

    try
    {
//        $response = insales_api_client('GET', '/admin/product_fields.json');
//        var_dump($response);
//
//        $categories = insales_api_client('GET', '/admin/categories.json');
//        var_dump($categories);
//
//        $collections = insales_api_client('GET', '/admin/collections.json');
//        var_dump($collections); exit();

        $productName = $productsInformation[$productId]['name'];
        $productDescriptionFull = $productsInformation[$productId]['descriptionFull'];
        $productDescriptionShort = $productsInformation[$productId]['descriptionShort'];
        $productPrice = intval($productsInformation[$productId]['price']);

        if ($productAdditionalOptions && is_array($productAdditionalOptions) && count($productAdditionalOptions) > 0) {
            $optionsNamesArray = array();
            foreach ($productAdditionalOptions as $option) {
                if (isset($productsInformation[$productId]['options'][$option])) {
                    $optionsNamesArray[] = $productsInformation[$productId]['options'][$option]['name'];
                    $productPrice += intval($productsInformation[$productId]['options'][$option]['price']);
                }
            }
            if (count($optionsNamesArray) > 0) {
                $productName .= ' (+ ' . implode(', ', $optionsNamesArray) . ')';
            }
        }

        $productXml =
            '<?xml version="1.0" encoding="UTF-8"?>
            <product>
                <category-id type="integer">'.$productCategoryId.'</category-id>
    <title>'.$productName.'</title>
    <description>'.htmlspecialchars($productDescriptionFull).'</description>
    <short-description>'.$productDescriptionShort.'</short-description>
    <properties-attributes type="array">
    </properties-attributes>
    <variants-attributes type="array">
        <variant>
            <quantity type="integer" nil="true"/>
            <price type="decimal">'.round($productPrice, 1).'</price>
            <cost-price type="decimal" nil="true">'.round($productPrice, 1).'</cost-price>
            <old-price type="decimal" nil="true"/>
        </variant>
    </variants-attributes>
</product>';

        $product = insales_api_client('POST', '/admin/products.xml', $productXml, 'xml');
        $productId = intval($product->id);
        $productVariant = $product->variants->variant;
        $productVariantId = intval($productVariant->id);
        $productLink = strval($product->permalink);

//
//    var_dump($product);
//    var_dump($productId);
//    var_dump($productVariantId);
//
//    exit();

    $productCollectionXml =
'<?xml version="1.0" encoding="UTF-8"?>
<collect>
    <collection-id type="integer">'.$productCollectionId.'</collection-id>
    <product-id type="integer">'.$productId.'</product-id>
</collect>';

    $response = insales_api_client('POST', '/admin/collects.xml', $productCollectionXml, 'xml');

//    $response = insales_api_client('GET', '/admin/products/#'.$productId.'/images.json');
//
//    var_dump($response);
//    exit();

        $productImageXml =
            '<?xml version="1.0" encoding="UTF-8"?>
            <image>
                <title>'.$productName.'</title>
    <filename>'.$files['product']['name'].'</filename>
    <attachment><![CDATA['.$files['product']['image'].']]></attachment>
</image>';

        $response = insales_api_client('POST', '/admin/products/'.$productId.'/images.xml', $productImageXml, 'xml');

//    var_dump($productImageXml);

        $productWallpaperXml =
            '<?xml version="1.0" encoding="UTF-8"?>
            <file>
                <filename>product'.$productId.$files['wallpaper']['name'].'</filename>
    <attachment><![CDATA['.$files['wallpaper']['image'].']]></attachment>
</file>';

        $response = insales_api_client('POST', '/admin/files.xml', $productWallpaperXml, 'xml');

//    var_dump($response);

        $productWallpaperUrl = strval($response->{'absolute-url'});

        $productNameXml =
            '<?xml version="1.0" encoding="UTF-8"?>
            <product>
                <id type="integer">'.$productId.'</id>
    <title>'.$productName.' №'.$productId.'</title>
</product>';

        $response = insales_api_client('PUT', '/admin/products/'.$productId.'.xml', $productNameXml, 'xml');

        $productFieldXml =
            '<?xml version="1.0" encoding="UTF-8"?>
            <product-field-value>
              <product-field-id>'.$productWallpaperId.'</product-field-id>
  <value>'.$productWallpaperUrl.'</value>
</product-field-value>';

        $response = insales_api_client('POST', '/admin/products/'.$productId.'/product_field_values.xml', $productFieldXml, 'xml');

//    var_dump($productFieldXml);
//    var_dump($response); exit();

        $productInStoreLink = $inSalesStoreDomain . $productCollectionUrl . '/product/' . $productLink;

        $colorsArray = array();
        foreach ($colors as $colorName => $color) {
            $colorsArray[] = $colorName . ': ' . $color;
        }

        $message = '<p>Заказ №' . $productId . '</p>';
        $message .= '<p>' . $productName . '</p>';
        $message .= '<p>' . 'Стоимость: ' . $productPrice . ' р.' . '</p>';
        $message .= '<p>' . 'Цвет: '.implode(', ', $colorsArray).'</p>';
        $message .= '<p>' . 'Ссылка на товар: <a href="'.$productInStoreLink.'">'.$productInStoreLink.'</a></p>';

        $subject = 'Заказ №' . $productId . ' - ' . $productName;

        $result = sendEmails($qStickerEmails, $qStickerEmailFrom, $subject, $message, $files);

        if ($result) {
            $returnObject = array(
                'status' => 'success',
                'productId' => $productId,
                'productVariantId' => $productVariantId,
                'productLink' => $productLink,
                'productInStoreLink' => $productInStoreLink,
            );
        } else {
            $returnObject = array(
                'status' => 'error',
                'message' => 'Произошла ошибка, пожалуйста, повторите попытку позже',
            );
        }

        echo json_encode($returnObject);
    }
    catch (InsalesApiException $e)
    {
        /* $e->getInfo() вернет массив со следующими ключами:
            * method
            * path
            * params (third parameter passed to $shopify)
            * response_headers
            * response
            * shops_myshopify_domain
            * shops_token
        */
        $returnObject = array(
            'status' => 'error',
            'message' => $e->getInfo(),
        );
        echo json_encode($returnObject);
    }
    catch (InsalesCurlException $e)
    {
        // $e->getMessage() возвращает содержимое curl_errno(), $e->getCode() возвращает содержимое curl_ error()
        $returnObject = array(
            'status' => 'error',
            'message' => $e->getMessage(),
        );
        echo json_encode($returnObject);
    }
}

function parseImage($imageString, $imageName) {
    $types = array(
        array('type' => 'data:image/jpeg;base64,', 'extension' => 'jpg'),
        array('type' => 'data:image/jpg;base64,', 'extension' => 'jpg'),
        array('type' => 'data:image/png;base64,', 'extension' => 'png'),
    );

    $returnObject = array('name' => '', 'image' => '');

    foreach ($types as $type) {
        if (mb_substr($imageString, 0, mb_strlen($type['type'])) == $type['type']) {
            $returnObject = array('name' => $imageName . '.' . $type['extension'], 'image' => mb_substr($imageString, mb_strlen($type['type'])));
            break;
        }
    }

    return $returnObject;
};

function RGBToHex($r, $g, $b) {
    //String padding bug found and the solution put forth by Pete Williams (http://snipplr.com/users/PeteW)
    $hex = "#";
    $hex.= str_pad(dechex($r), 2, "0", STR_PAD_LEFT);
    $hex.= str_pad(dechex($g), 2, "0", STR_PAD_LEFT);
    $hex.= str_pad(dechex($b), 2, "0", STR_PAD_LEFT);

    return $hex;
};

function sendEmails($to, $from, $subject, $message, $files) {

    $headers = "From: $from";

    // boundary
    $semi_rand = md5(uniqid(time()));
    $mime_boundary = "==Multipart_Boundary_x{$semi_rand}x";

    // headers for attachment
    $headers .= "\nMIME-Version: 1.0\n" . "Content-Type: multipart/mixed;\n" . " boundary=\"{$mime_boundary}\"";

    // multipart boundary
    $message = "This is a multi-part message in MIME format.\n\n" . "--{$mime_boundary}\n" . "Content-Type: text/html; charset=\"utf-8\"\n" . "Content-Transfer-Encoding: 8bit\n\n" . ($message) . "\n\n";
    $message .= "--{$mime_boundary}\n";

    // preparing attachments
    foreach ($files as $file) {
        $data = chunk_split($file['image']);
        $message .= "Content-Type: {\"application/octet-stream\"};\n" . " name=\"" .$file['name'] ."\"\n" .
            "Content-Disposition: attachment;\n" . " filename=\"" .$file['name'] ."\"\n" .
            "Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
        $message .= "--{$mime_boundary}\n";
    }

    $result = true;
    if (is_array($to)) {
        foreach ($to as $toEmail) {
            $result = $result && mail($toEmail, $subject, $message, $headers);
        }
    } else {
        $result = $result && mail($to, $subject, $message, $headers);
    }
    return $result;
};