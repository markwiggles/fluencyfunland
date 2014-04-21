<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>

<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>Colour-in</title>

        <link rel="stylesheet" href="../css/main-styles.css"/>
        <link rel="stylesheet" href="css/color-styles.css"/>
    </head>
    <body>
        <div id="outer-wrapper">
            <header><img src="../img/ffl.png"/></header>


            <div id="content">
                <div id="color-menu">
                    <img id="color-header" src="img/header.png"/>
                    <img id="book" src="img/color_book.png"/>
                    <img class="color-thumb nav" id="flowerthumb" src="img/flowerthumb.png"/>
                    <img class="color-thumb nav" id="rocketthumb" src="img/rocketthumb.png"/>
                    <img class="color-thumb nav" id="dinothumb" src="img/dinothumb.png"/>
                    <img class="color-thumb nav" id="cowboythumb" src="img/cowboythumb.png"/>
                    <img class="color-thumb nav" id="soccerthumb" src="img/soccerthumb.png"/>
                </div>
                <img id="back" src="../img/back.png"/>
                <div id="drawing">
                    <div id="container"></div>
                    <div id="colors">
                        <canvas id="color-canvas" width="250" height="680"></canvas>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <script type="text/javascript" src="../js/jquery-1.11.0.min.js"></script>
        <script type="text/javascript" src="../js/position.js"></script>
        <script type="text/javascript" src="../js/ion.sound.min.js"></script>
        <script type="text/javascript" src="../js/kinetic-v5.1.0.min.js"></script>
        <script type="text/javascript" src="js/flower-code.js"></script>
        <script type="text/javascript" src="js/dino-code.js"></script>
        <script type="text/javascript" src="js/cowboy-code.js"></script>
        <script type="text/javascript" src="js/rocket-code.js"></script>
        <script type="text/javascript" src="js/soccer-code.js"></script>
        <script type="text/javascript" src="js/color-script.js"></script>
        
    </body>
</html>