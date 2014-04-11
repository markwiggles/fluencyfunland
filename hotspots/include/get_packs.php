<?php

/*
  script to get the names of the card pack folders, and the images in the directories
 * also calculates the positions coordinate for the cards on the card layout
 */

$path = "../img";

$jsonObj = array();
$packs = array();
$folders = array();
$images = array();

foreach (new DirectoryIterator($path) as $file) {
    if ($file->isDot())
        continue;

    if ($file->isDir()) {
        $folder = $file->getFilename();
        $packs[$folder] = $folder;
        $images = getFiles($folder);
        $packs[$folder] = array('images' => $images, 'count' => count($images));
    }
}

$jsonObj["packs"] = $packs;

echo json_encode($jsonObj);


function getFiles($folder) {
    
    $path = "../img/{$folder}";
    
    $files = array();
    foreach (new DirectoryIterator($path) as $file) {
        if ($file->isDot()) {
            continue;
        }
        $pngFile = $file->getFilename();
        $filename = str_replace(".png", "", $pngFile);
        $files[$filename."1"] = "img/{$folder}/{$pngFile}";
        $files[$filename."2"] = "img/{$folder}/{$pngFile}";
    }
    return $files;
}


?>


