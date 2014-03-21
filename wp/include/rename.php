<?php

$filenames = glob("../wp/pets/sounds/*");

foreach($filenames as $filename) {
    
    $new = strtolower($filename);
    rename ($filename, $new);
}

echo var_dump($filenames);

?>
