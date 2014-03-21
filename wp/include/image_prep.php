<?php

function createThumbnails($col, $theme) {
    
    $images = getImageFiles("wp/{$theme}/objects");
    
    
    $idx = $col == "col1" ? 0 : 1; 

    foreach ($images as $image) {
        $name = basename($image, ".png");
        if ($idx % 2 == 0) {
            echo "<img id='{$name}' src='{$image}' class='image-object' alt='{$name}' />";
        }
        $idx++;
    }
}

function loadBackgrounds($theme) {
    
    $images = getImageFiles("wp/{$theme}/backgrounds");

    foreach ($images as $image) {
        
            $name = basename($image, ".png");
        
            echo "<img id='{$name}' src='{$image}' alt='{$name}' style='display:none;' class='image-bg'/>";
    }
}

function getImageFiles($directory) {
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
