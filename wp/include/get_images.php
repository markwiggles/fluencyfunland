<?php

//check if values are set
$theme = (isset($_GET['theme'])) ? $_GET['theme'] : "beach";



$images = getFiles("../themes/{$theme}/objects");
$imageNames = array();

foreach ($images as $image) {
    array_push($imageNames, basename($image, ".png"));
}

echo json_encode($imageNames);

function getFiles($directory) {
    $dir = new RecursiveDirectoryIterator("{$directory}");
    $images = array();
    $i = 0;
    foreach (new RecursiveIteratorIterator($dir) as $filename) {

        $filename = str_replace('\\', '/', $filename);
        $images[$i] = $filename;
        $i++;
    }
    return $images;
}

?>
