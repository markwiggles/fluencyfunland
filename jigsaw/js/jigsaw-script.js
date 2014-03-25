
var stage;
var bgLayer;
var boxLayer;

var jigsaw = {};
var origin = {};
var boxes = {};
var currBox = {};
var pieces = {};

var sensitivity = 50;

var widthContainer;
var heightContainer;

var jig1 = {name: "jig1", numPieces: 6, numCols: 3, numRows: 2, widthImg: 205, heightImg: 236, sounds: ["sheep"]};

/**Function: runs when page loads
 */
$(function() {

    heightContainer = $("#container").height();
    widthContainer = $("#container").width();
    jigsaw = jig1;

    initStage();
    initLayers();
    initSounds(jigsaw.sounds);
    findOrigin();
    createGrid();
    createBackgoundImage((jigsaw.widthImg * jigsaw.numCols), (jigsaw.heightImg * jigsaw.numRows));
    displayPieces();

    //displayPosition(); //for testing
});

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
    boxLayer = new Kinetic.Layer();
    stage.add(bgLayer);
    stage.add(boxLayer);
}

//create the grid, and assign the coords and the number of the piece
function createGrid() {

    var strokeWidth = 1;

    for (var i = 0; i < jigsaw.numPieces; i++) {
        var ptX, ptY;

        if (i < jigsaw.numCols) {//row1
            ptX = origin.x + (jigsaw.widthImg * i);
            ptY = origin.y + (jigsaw.heightImg * 0);
            boxes[i] = kRect(ptX, ptY, jigsaw.widthImg, jigsaw.heightImg, "lightgrey", strokeWidth, boxLayer);
        } else {//row2  
            ptX = origin.x + (jigsaw.widthImg * (i % jigsaw.numCols));
            ptY = origin.y + (jigsaw.heightImg);
            boxes[i] = kRect(ptX, ptY, jigsaw.widthImg, jigsaw.heightImg, "lightgrey", strokeWidth, boxLayer);
        }
        boxes[i].coords = {left: ptX, right: ptX + jigsaw.widthImg, top: ptY, bottom: ptY + jigsaw.heightImg};
        boxes[i].piece = i;
    }
}

function displayPieces() {
    var x, y;
    for (var i = 0; i < jigsaw.numPieces; i++) {

        x = Math.floor((Math.random() * 800) + 20);
        y = Math.floor((Math.random() * 470) + 20);

        var source = "img/" + jigsaw.name + "/" + jigsaw.name + "-" + (i + 1) + ".png";
        createImagePieces(x, y, i, source);
    }
}


function initDrag(dragObj) {

    //assign the destination according to where the center of dragged is
    dragObj.on("dragmove", function() {

        isCenterInBox(this);

        //isPieceAdjacent(this);

        //the bounds of the container for the image
        var boundL = 0;
        var boundR = widthContainer - jigsaw.widthImg;
        var boundTop = 0;
        var boundBtm = heightContainer - jigsaw.heightImg;

        var x = this.getX();
        var y = this.getY();

        //if object is over the boundaries snap back
        x < boundL ? this.setX(boundL) : "";
        x > boundR ? this.setX(boundR) : "";
        y < boundTop ? this.setY(boundTop) : "";
        y > boundBtm ? this.setY(boundBtm) : "";

        boxLayer.draw();
    });

    //check the coords as the box is dragged, snap to as it nears the destination
    dragObj.on("dragend", function() {

        if (isClose(this)) { //this dragged object

            //set the x,y coords to the destination box and draw the layer
            if (currBox !== "") {
                dragObj.setX(currBox.getX());
                dragObj.setY(currBox.getY());
            }

            //check for finish
            if (this.piece === currBox.piece) {
                currBox.placed = true;
                isFinished() ? celebrate() : "";
            }
        }
        boxLayer.draw();
    });
}

function isPieceAdjacent(piece) {

    var ht = jigsaw.heightImg;

    //check if this piece x is close to matching piece
    console.log(piece.piece);
    if (piece.piece === 3) {

        console.log(piece.getX() + "," + pieces[0].getX());
        if (piece.getX() === pieces[0].getX() + 20 && piece.getY() === pieces[0].getY() + ht + 20) {

            piece.setX(pieces[0].getX());
            piece.setY(pieces[0].getY() + ht);
        }
    }

}

function isClose(dragShape) {

    if (!$.isEmptyObject(currBox)) {
        var posX = currBox.getX();
        var posY = currBox.getY();
        var x = dragShape.getX();
        var y = dragShape.getY();

        if (x >= (posX - sensitivity) && x <= (posX + sensitivity) && y >= (posY - sensitivity) && y <= (posY + sensitivity)) {

            if (dragShape.piece === currBox.piece) {
                return true;
            } else {
                dragShape.setX(x + sensitivity);
                dragShape.setY(y + sensitivity);
            }
        }
    }
    return false;
}

/**Function to assign the closest destination area, calculated by comparing the 
 * dragged shape position (center) with the coordinates
 * @param {drag object} dragShape
 * @returns void
 */
function isCenterInBox(dragShape) {
    //get the center of the shape
    var x = dragShape.getX() + dragShape.width() / 2;
    var y = dragShape.getY() + dragShape.height() / 2;

    for (var i = 0; i < jigsaw.numPieces; i++) {
        if ((x >= boxes[i].coords.left && x <= boxes[i].coords.right) && (y >= boxes[i].coords.top && y <= boxes[i].coords.bottom)) {
            currBox = boxes[i];
        }
    }
}

function celebrate() {
    for (var i = 0; i < jigsaw.numPieces; i++) {
        pieces[i].setStroke("");
        pieces[i].setStrokeWidth(0);
        boxes[i].setStroke("");
        boxes[i].setStrokeWidth(0);
    }
    boxLayer.draw();
    $.ionSound.play(jigsaw.sounds[0]);
}

function isFinished() {
    var count = 0;
    for (var i = 0; i < jigsaw.numPieces; i++) {
        if (boxes[i].placed) {
            count++;
        }
    }
    return (count === jigsaw.numPieces);
}


// build the specified KineticJS Rectangle and add it to the stage
function kRect(x, y, width, height, stroke, strokewidth, layer, drag) {
    var rect = new Kinetic.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        stroke: stroke,
        strokeWidth: strokewidth,
        draggable: drag
    });
    layer.add(rect);
    stage.draw();
    return rect;
}

/**Function: creates the image and adds it to the layer
 * in the specified position
 * calls the initDrag function to initialise the dragging
 * @param {integer} posX
 * @param {integer} posY
 * @param {integer} pieceId
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
            width: 205,
            height: 236,
            stroke: "grey",
            strokewidth: 1,
            draggable: true
        });
        boxLayer.add(image);
        stage.add(boxLayer);

        image.piece = pieceId;
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
        $("#container").removeClass("loading");
    };
    imageObj.src = source;


}

function createBackgoundImage(width, height) {

    var imageObj = new Image();

    imageObj.onload = function() {
        var image = new Kinetic.Image({
            x: origin.x,
            y: origin.y,
            image: imageObj,
            width: width,
            height: height,
            stroke: "grey",
            strokewidth: 1,
            opacity: 0.3
        });
        bgLayer.add(image);
        stage.add(bgLayer);
    };
    imageObj.src = "img/" + jigsaw.name + "/" + jigsaw.name + "g.png";
}

//function to initialise the sounds
function initSounds(imageSounds) {

    $.ionSound({
        sounds: imageSounds,
        path: "sounds/",
        volume: "1.0",
        multiplay: true
    });
}


