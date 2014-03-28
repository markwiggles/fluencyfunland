
/* Globals */
var stage;
var bgLayer;
var pceLayer;

var origin = {}; //where the grid starts
var boxes = {}; //the grid where the pieces go
var currBox = {}; // where the center of the current dragged peice is
var pieces = {}; // all the piece data including the Kinetic image


//the snap into place parameter - how far the piece is away
var sensitivity = 50;

//our dimensions
var widthContainer;
var heightContainer;

//jigsaw object template
var jigsaw = {name: "", numPieces: 0, numCols: 0, numRows: 0, widthImg: 0, heightImg: 0, sounds: []};

//the data for the jigsaws
var jig1 = {name: "jig1", numPieces: 6, numCols: 3, numRows: 2, widthImg: 200, heightImg: 236, sounds: ["sheep"]};
var jig2 = {name: "jig2", numPieces: 6, numCols: 3, numRows: 2, widthImg: 200, heightImg: 236, sounds: ["bus"]};
var jig3 = {name: "jig3", numPieces: 6, numCols: 3, numRows: 2, widthImg: 200, heightImg: 236, sounds: ["bed"]};
var jig4 = {name: "jig4", numPieces: 9, numCols: 3, numRows: 3, widthImg: 200, heightImg: 158, sounds: ["seagull"]};
var jig5 = {name: "jig5", numPieces: 9, numCols: 3, numRows: 3, widthImg: 200, heightImg: 158, sounds: ["monkeys"]};

//completion messages - shown randomly
var messages = ["well done", "you did it", "all finished", "awesome job", "too cool", "excellent"];

/**Function: runs when page loads
 */
$(function() {

    initNavigation();

    /* some functions if we need to test anything */
    //displayPosition(); 
    //getgetLayerInfo()
});

function initNavigation() {

    //go back to the menu, hiding the current jigsaw etc
    $("#back").on("mousedown", function() {
        $("#background, #container, #back, #refresh").hide();
        $("#jigsaw-menu").fadeIn(500);
    });

    //re-load the jigsaw
    $("#refresh").on("mousedown", function() {
        $("#background, #container, #back, #refresh").fadeOut(500);
        initJigsaw();
        $("#background, #container, #back, #refresh").fadeIn(500);
    });

    //assign the selected jigsaw, hide the menu, and show the puzzle etc
    $(".nav").on("mousedown", function() {
        jigsaw = eval($(this).attr("id"));
        initJigsaw();
        $("#jigsaw-menu").hide();
        $("#background, #container, #back, #refresh").fadeIn(500);
    });
}

function initJigsaw() {

    heightContainer = $("#container").height();
    widthContainer = $("#container").width();
    findOrigin();
    createBackgoundImage((jigsaw.widthImg * jigsaw.numCols), (jigsaw.heightImg * jigsaw.numRows));
    initStage();
    initLayers();
    initSounds();
    createGrid();
    displayPieces();

    for (var i = 0; i < jigsaw.numPieces; i++) {
        boxes[i].occupy = "empty";
    }

    //for testing
    //test();
    //displayPosition(); 
}

/** Function: find the origin (x,y) of the jigsaw drawing
 * @returns void
 */
function findOrigin() {
    origin.x = (0 + (widthContainer - jigsaw.widthImg * jigsaw.numCols) / 2) + 0.5;
    origin.y = (0 + (heightContainer - jigsaw.heightImg * jigsaw.numRows) / 2) + 0.5;
}

function initStage() {
    //set the stage
    stage = new Kinetic.Stage({
        container: 'container',
        width: widthContainer,
        height: heightContainer
    });
}

function initLayers() {
    //create the layer/s
    bgLayer = new Kinetic.Layer();
    pceLayer = new Kinetic.Layer();
    stage.add(bgLayer);
    stage.add(pceLayer);
}

//create the grid, and assign the coords and the number of the piece
function createGrid() {

    var strokeWidth = 1;

    for (var i = 0; i < jigsaw.numPieces; i++) {
        var ptX, ptY; // the coords of each box in the grid

        if (i < jigsaw.numCols) {//row1
            ptX = origin.x + (jigsaw.widthImg * i);
            ptY = origin.y + (jigsaw.heightImg * 0);
            boxes[i] = kRect(ptX, ptY, jigsaw.widthImg, jigsaw.heightImg, "lightgrey", strokeWidth, bgLayer);
        } else {//row2 & 3

            ptX = origin.x + (jigsaw.widthImg * (i % jigsaw.numCols));
            ptY = origin.y + (jigsaw.heightImg);

            //for 9 piece puzzles
            if (jigsaw.numPieces > 6 && i > 5) {
                ptY = origin.y + (jigsaw.heightImg * 2);
            }
            boxes[i] = kRect(ptX, ptY, jigsaw.widthImg, jigsaw.heightImg, "lightgrey", strokeWidth, bgLayer);
        }
        boxes[i].coords = {left: ptX, right: ptX + jigsaw.widthImg, top: ptY, bottom: ptY + jigsaw.heightImg};
        boxes[i].pieceId = i;
    }
}

function displayPieces() {
    var x, y;
    var positions = createPositions();
    for (var i = 0; i < jigsaw.numPieces; i++) {

        x = positions[i][0];
        y = positions[i][1];

        var source = "img/" + jigsaw.name + "/" + jigsaw.name + "-" + (i + 1) + ".png";
        createImagePieces(x, y, i, source);
    }
}


function initDrag(dragObj) {

    dragObj.on("dragstart", function() {

        //assign the piece to be in the current box
        isCenterInBox(dragObj);

        this.setStroke("black");
        this.setStrokeWidth(3);

        //if this piece was in current box
        if (this.pieceId === currBox.occupy) {
            currBox.occupy = "empty";
        }
    });

    //assign the destination according to where the center of dragged is
    dragObj.on("dragmove", function() {

        //assign the piece to be in the current box
        isCenterInBox(this);

        //the bounds of the container for the image
        var boundL = 0;
        var boundR = widthContainer - jigsaw.widthImg;
        var boundTop = 0;
        var boundBtm = heightContainer - jigsaw.heightImg;


        //if object is over the boundaries snap back
        this.getX() < boundL ? this.setX(boundL) : "";
        this.getX() > boundR ? this.setX(boundR) : "";
        this.getY() < boundTop ? this.setY(boundTop) : "";
        this.getY() > boundBtm ? this.setY(boundBtm) : "";

        pceLayer.draw();
    });

    //check the coords as the box is dragged, snap to as it nears the destination
    dragObj.on("dragend", function() {

        //the coords of the piece being dragged
        var x = this.getX();
        var y = this.getY();

        this.placed = false;

        var dist = 40;

        //make sure the piece isn't on top of another one
        for (var i = 0; i < jigsaw.numPieces; i++) {
            //every other piece except this one
            if (this.pieceId !== pieces[i].pieceId) {
                //snap the piece back, if it is left on top of another
                if (this.getX() >= pieces[i].getX() - dist && this.getX() <= pieces[i].getX() + dist &&
                        this.getY() >= pieces[i].getY() - dist && this.getY() <= pieces[i].getY() + dist) {
                    rejectPiece(this);
                }
            }
        }

        //if this piece is close to the current box origin
        if (isClose(this)) { //this dragged object


            //if not already full, place the piece in the box
            if (currBox.occupy === "empty") {
                dragObj.setX(currBox.getX());
                dragObj.setY(currBox.getY());
                currBox.occupy = this.pieceId;

                //if it is the right piece
                if (this.pieceId === currBox.pieceId) {
                    this.placed = true;
                    this.setDraggable(false);
                    this.setStroke("");
                    this.setStrokeWidth(0);
                } else {
                    this.setStroke("red");
                    this.setStrokeWidth(4);
                }
            } else {
                rejectPiece(this);
            }
        }

        //check for finish
        isFinished() ? celebrate() : "";
        //redraw()
        pceLayer.draw();
    });
}

function rejectPiece(piece) {
    piece.setX(piece.getX() + 20);
    piece.setY(piece.getY() + 20);
}

function isClose(piece) {

    //get the coords of the current box, and compare against the piece being dragged
    if (!$.isEmptyObject(currBox)) {
        var posX = currBox.getX();
        var posY = currBox.getY();
        var x = piece.getX();
        var y = piece.getY();

        if (x >= (posX - sensitivity) && x <= (posX + sensitivity) && y >= (posY - sensitivity) && y <= (posY + sensitivity)) {
            return true;
        }
    }
    return false;
}

/**Function to assign the closest destination area, calculated by comparing the 
 * dragged shape position (center) with the coordinates
 * @param {drag object} dragShape
 * @returns void
 */
function isCenterInBox(dragObj) {
    //get the center of the shape
    var x = dragObj.getX() + dragObj.width() / 2;
    var y = dragObj.getY() + dragObj.height() / 2;

    for (var i = 0; i < jigsaw.numPieces; i++) {
        if ((x >= boxes[i].coords.left && x <= boxes[i].coords.right) && (y >= boxes[i].coords.top && y <= boxes[i].coords.bottom)) {
            currBox = boxes[i];
        }
    }
}

function celebrate() {

    for (var i = 0; i < jigsaw.numPieces; i++) {
    }
    pceLayer.draw();
    $.ionSound.play(jigsaw.sounds[0]);
    var message = messages[Math.floor((Math.random() * 6))];
    drawText(widthContainer / 2, 200, 70, message);
}

function isFinished() {
    var count = 0;
    var pieces = pceLayer.getChildren();
    $.each(pieces, function(idx, piece) {

        if (piece.placed) {
            count++;
        }
    });
    return (count === jigsaw.numPieces);
}


// build the specified KineticJS Rectangle and add it to the stage
function kRect(x, y, width, height, stroke, strokewidth, layer) {
    var rect = new Kinetic.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        stroke: stroke,
        strokeWidth: strokewidth
    });
    layer.add(rect);
    stage.draw();
    return rect;
}


/**Function: creates the piece image and adds it to the layer
 * in the specified position
 * calls the initDrag function to initialise the dragging
 * @param {integer} posX: x coord on the container
 * @param {integer} posY: y coord on the container
 * @param {integer} pieceId
 * @param {text} source: url of the image
 * @returns {undefined}
 */
function createImagePieces(posX, posY, pieceId, source) {

    $("#container").addClass("loading");

    var imageObj = new Image();

    imageObj.onload = function() {
        var image = new Kinetic.Image({
            x: posX,
            y: posY,
            image: imageObj,
            width: jigsaw.widthImg,
            height: jigsaw.heightImg,
            draggable: true,
            stroke: "black",
            strokeWidth: 3,
        });
        pceLayer.add(image);
        stage.add(pceLayer);

        image.pieceId = pieceId;
        initDrag(image);

        // add cursor styling and move pices to the top
        image.on('touchstart mouseover', function() {
            document.body.style.cursor = 'pointer';
            this.moveToTop();
        });
        image.on('mouseout', function() {
            document.body.style.cursor = 'default';
        });
        pieces[pieceId] = image;
        pieces[pieceId].position = pieces[pieceId].getX();
        $("#container").removeClass("loading");

    };
    imageObj.src = source;


}

function createBackgoundImage(width, height) {

    var source = "img/" + jigsaw.name + "/" + jigsaw.name + "g.png";

    $("#background")
            .attr("src", source)
            .css("left", origin.x)
            .css("top", origin.y)
            .css("width", width + "px")
            .css("height", height + "px");
}

//function to initialise the sounds
function initSounds() {

    $.ionSound({
        sounds: jigsaw.sounds,
        path: "sounds/",
        volume: "1.0",
        multiplay: true
    });
}

//create positions for the pieces, placing them in an object
function createPositions() {
    var positions = [];
    var mgnTop = 60;
    var mgnBtm = 20;
    var mgnSide = 3;

    //spacing for 9 piece puzzles
    var leftSpacing = 115;
    var rightSpacing = 153;
    var spacing = jigsaw.numPieces === 9 ? leftSpacing : (heightContainer - mgnTop) / (jigsaw.numPieces / 2) - mgnBtm;
    var rghtX = widthContainer - jigsaw.widthImg;
    var x = 0, y = 0;

    for (var i = 0; i < jigsaw.numPieces; i++) {

        if (i < jigsaw.numPieces / 2) {
            x = mgnSide;
        } else {
            x = rghtX - mgnSide;
            spacing = jigsaw.numPieces === 9 ? rightSpacing : (heightContainer - mgnTop) / (jigsaw.numPieces / 2) - mgnBtm;
        }
        y = mgnTop + spacing * Math.floor((i % (jigsaw.numPieces / 2)));

        positions.push([x, y]);
    }
    return shuffle(positions);
}

//textObj.ctx.shadowColor = "darkgrey";
//        textObj.ctx.shadowBlur = 3;
//        textObj.ctx.shadowOffsetX = 2;
//        textObj.ctx.shadowOffsetY = 2;

function drawText(posX, posY, size, message) {

    var text = new Kinetic.Text({
        x: posX,
        y: posY,
        text: message,
        fontSize: size,
        fontStyle: "bold",
        fontFamily: 'Comic Sans MS',
        shadowColor: "darkgrey",
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        stroke: "black",
        strokeWidth: 1,
        fill: 'white'
    });

    text.offsetX(text.width() / 2);

    pceLayer.add(text);
    stage.draw();

}//end drawText



function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
            x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
}


function getLayerInfo() {

    var boxes = bgLayer.getChildren();
    var pieces = pceLayer.getChildren();

    $.each(boxes, function(idx, box) {
        //console.log(box.pieceId);
    });
    boxes.on("mousedown", function() {
        console.log("box: " + this.occupy);
    });
    pieces.on("mousedown", function() {
        console.log("piece: " + this.pieceId);
    });
}
