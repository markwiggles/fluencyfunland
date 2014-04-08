<?php
?> 
<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <title>Jigsaw</title>



        <link rel="stylesheet" href="css/jigsaw-styles.css"/>
    </head>
    <body>

        <div id="outer-wrapper">
            <header><img src="../img/ffl.png"/></header>

            <div id="content">

                <div id="jigsaw-menu" style="display: block;">
                    <div id="puzzle">
                        <p>6 piece puzzles</p>
                    </div>
                    <img class="nav" src="img/jig1/jig1.png" id="jig1"/>
                    <img class="nav" src="img/jig2/jig2.png" id="jig2"/>
                    <img class="nav" src="img/jig3/jig3.png" id="jig3"/>
                    <div id="puzzle">
                        <p>9 piece puzzles</p>
                    </div>
                    <img class="nav" src="img/jig4/jig4.png" id="jig4"/>
                    <img class="nav" src="img/jig5/jig5.png" id="jig5"/>
                </div>

                <img id="back" src="../img/back.png"/><img id="refresh" src="../img/refresh.png"/>
                <img id="background"/>
                <div id="container"></div>
            </div>
        </div>

        <script type="text/javascript" src="../js/jquery-1.11.0.min.js"></script>
        <script type="text/javascript" src="../js/ion.sound.min.js"></script>
        <script type="text/javascript" src="../js/kinetic-v5.0.1.js"></script>
        <script type="text/javascript" src="js/jigsaw-script.js"></script>
        <script type="text/javascript" src="../js/position.js"></script>
    </body>
</html>
