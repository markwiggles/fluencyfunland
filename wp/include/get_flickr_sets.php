<?php

/*
 * get the sets from flickr for the userId
 *
 */

$apiKey = "e7eda1a0b16883ab5f62f53d055d57e3";

//check if values are set
$userId = (isset($_GET['userid'])) ? $_GET['userid'] : "120283968@N08";

$getListMethod = "flickr.photosets.getList";
$photoListArg = array(
    'api_key' => $apiKey,
    'method' => $getListMethod,
    'user_id' => $userId,
    'format' => "json"
);
//call Flickr to get pics
$jsonPhotosetList = callFlickr($photoListArg);

echo $jsonPhotosetList;




function callFlickr($arg) {

    $query = http_build_query($arg);

    $url = "http://api.flickr.com/services/rest/?" . $query;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $contents = curl_exec($ch);
    if (curl_errno($ch)) {
        echo curl_error($ch);
        echo "\n<br>";
        $contents = '';
    } else {
        curl_close($ch);
    }

    if (!is_string($contents) || !strlen($contents)) {
        echo "Failed to get contents.";
        $contents = '';
    }

    $json = preg_replace('/.+?({.+}).+/', '$1', $contents); //remove backslashes

    return $json;
}

?>

