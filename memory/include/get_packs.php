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

$numCrds = 18;

$jsonObj["positions"] = createPositions($numCrds);

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


function createPositions($numCrds) {

    $x = 0;
    $y = 0;
    $paddingTop = 60;
    $marginTop = 20;
    $marginRight = 50;
    $marginLeft = 45;
    $imageWidth = 110;
    $imageHeight = 180;
    $spacingH = $marginLeft + $imageWidth;
    $spacingV = $marginTop + $imageHeight;

    $positions = array();

    for ($i = 0; $i < $numCrds; $i++) {

        $coords = array();

        $x = $spacingH * $i + $marginRight;

        if ($i < 6) {
            $y = $paddingTop;
        } else if ($i < 12) {
            $y = $spacingV + $paddingTop;
            $x -= $spacingH * 6;
        } else {
            $y = $spacingV * 2 + $paddingTop;
            $x -= $spacingH * 6 * 2;
        }

        $coords["x"] = $x;
        $coords["y"] = $y;

        array_push($positions, $coords);
    }

    return $positions;
}

function shuffle_assoc(&$array) {
    $keys = array_keys($array);

    shuffle($keys);

    foreach ($keys as $key) {
        $new[$key] = $array[$key];
    }

    $array = $new;

    return true;
}
?>


