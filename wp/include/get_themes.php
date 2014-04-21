<?php

$folders = glob("../themes/*");
$names = array();

foreach ($folders as $folder) {
    $folder = str_replace("../themes/", "", $folder);

    $images = getFiles("../themes/{$folder}/objects");
    $imageNames = array();

    foreach ($images as $image) {
        array_push($imageNames, basename($image, ".png"));
    }
    $names[$folder] = $imageNames;
}
echo json_encode($names);



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
