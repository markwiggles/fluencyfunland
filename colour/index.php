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

        <script type="text/javascript" src="../js/jquery-1.11.0.min.js"></script>

        <script type="text/javascript" src="../js/ion.sound.min.js"></script>
        <script type="text/javascript" src="../js/kinetic-v5.0.1.js"></script>
        <script type="text/javascript" src="js/flower-code.js"></script>
        <script type="text/javascript" src="js/dino-code.js"></script>
        <script type="text/javascript" src="js/cowboy-code.js"></script>
        <script type="text/javascript" src="js/rocket-code.js"></script>
        <script type="text/javascript" src="js/soccer-code.js"></script>
        <script type="text/javascript" src="js/color-script.js"></script>

        <link rel="stylesheet" href="css/color-styles.css"/>
    </head>
    <body>
        <div id="outer-wrapper">
            <header><img src="../img/ffl.png"/></header>


            <div id="content">
                <div id="color-menu">
                    <img id="color-header" src="img/header.png"/>
                    <img id="" src="img/menu.png"/>
                    <img class="color-thumb" id="flowerthumb" src="img/flowerthumb.png"/>
                    <img class="color-thumb" id="rocketthumb" src="img/rocketthumb.png"/>
                    <img class="color-thumb" id="dinothumb" src="img/dinothumb.png"/>
                    <img class="color-thumb" id="cowboythumb" src="img/cowboythumb.png"/>
                    <img class="color-thumb" id="soccerthumb" src="img/soccerthumb.png"/>
                </div>
                <img id="back" src="../img/back.png"/>
                <div id="drawing">
                    
                    <div id="container"></div>
                    <div id="colors">
                        <canvas id="color-canvas" width="250" height="768"></canvas>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </body>
</html>