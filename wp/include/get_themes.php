<?php

$folders = glob("../themes/*");
$names = array();

foreach ($folders as $folder) {
    $folder = str_replace("../themes/", "", $folder);
    array_push($names, $folder);
}
echo json_encode($names);
?>
