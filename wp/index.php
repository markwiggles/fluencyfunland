<?php 
?> 
<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>Word and Pictures</title>

        <script type="text/javascript" src="../js/jquery-1.11.0.min.js"></script>
        <script type="text/javascript" src="../js/ion.sound.min.js"></script>
        <script type="text/javascript" src="js/wp-script.js"></script>
        <link rel="stylesheet" href="css/wp-styles.css"/>
    </head>
    <body>
        <div id="outer-wrapper">
            <header><img src="../img/ffl.png"/></header>
            <div id="content">
                <img id="back" src="../img/back.png"/>
                <div id="theme-menu"></div>
                <div id="custom-menu"></div>
                <p id="showTextMsg">Click anywhere in the picture to display the text</p>
                <div id="col1"></div>
                <canvas id="bg-canvas" width="804" height="560"></canvas>
                <canvas id="bg-canvas2" width="804" height="560"></canvas>
                <div id="image-div"></div>
                <div id="col2"></div>
            </div>
        </div>
    </body>
</html>
