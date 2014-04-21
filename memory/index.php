<?php
//include("include/scripts.php");
?> 
<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>Memory</title>
        <link rel="stylesheet" href="../css/main-styles.css"/>
        <link rel="stylesheet" href="css/memory-styles.css"/>
    </head>
    <body>

        <div id="outer-wrapper">
            <header><img src="../img/ffl.png"/></header>

            <div id="content">
                <div id="intro" class="show-intro">
                    <h1>The Memory Game</h1>
                    <h2>match any 2 cards</h2>
                    <div id="card1" class="cardIntro"><img src="img/animals/fish.png"></div>
                    <div id="card2" class="cardIntro"><img src="img/animals/lion.png"></div>
                    <div id="card3" class="cardIntro"><img src="img/animals/fish.png"></div>
                    <div id="card4" class="cardIntro"><img src="img/animals/lion.png"></div>
                    <img id="pointer" src="../img/pointer.png"/>
                    <img id="skip" src="../img/skip.png">
                </div>
                <div id="memory-menu">
                    <p id="choose">Choose a pack</p>
                </div>
                <div id="card-layout">
                    <img id="back" src="../img/back.png"/><img id="refresh" src="../img/refresh.png"/>
                    <img id="background"/>
                </div>
                <div id="container">

                </div>
            </div>
        </div>

        <script type="text/javascript" src="../js/jquery-1.11.0.min.js"></script>
        <script type="text/javascript" src="js/intro.js"></script>         
        <script type="text/javascript" src="../js/ion.sound.min.js"></script>
        <script type="text/javascript" src="../js/kinetic-v5.1.0.min.js"></script>
        <script type="text/javascript" src="../js/main-script.js"></script>
        <script type="text/javascript" src="js/memory-script.js"></script>
        <script type="text/javascript" src="../js/position.js"></script>

    </body>


</html>
