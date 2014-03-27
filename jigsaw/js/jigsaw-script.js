
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

var jigsaw = {name: "", numPieces: 0, numCols: 0, numRows: 0, widthImg: 0, heightImg: 0, sounds: []};

var jig1 = {name: "jig1", numPieces: 6, numCols: 3, numRows: 2, widthImg: 205, heightImg: 236, sounds: ["sheep"]};

/**Function: runs when page loads
 */
$(function() {

    heightContainer = $("#container").height();
    widthContainer = $("#container").width();
    jigsaw = jig1;
    
    initStage();
    initLayers();
    initSounds();
    findOrigin();
    createGrid();
    createBackgoundImage((jigsaw.widthImg * jigsaw.numCols), (jigsaw.heightImg * jigsaw.numRows));
    displayPieces();

    $("#back, #refresh").show();

    for (var i = 0; i < jigsaw.numPieces; i++) {
        boxes[i].full = false;
    }
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
        boxes[i].pieceId = i;
    }
}

function displayPieces() {
    var x, y;
    var positions = createPositions();
    for (var i = 0; i < jigsaw.numPieces; i++) {

        x = positions[i][0];
        y = positions[i][1];

//        x = Math.floor((Math.random() * 800) + 20);
//        y = Math.floor((Math.random() * 470) + 20);

        var source = "img/" + jigsaw.name + "/" + jigsaw.name + "-" + (i + 1) + ".png";
        createImagePieces(x, y, i, source);
    }
}


function initDrag(dragObj) {

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

        boxLayer.draw();
    });

    //check the coords as the box is dragged, snap to as it nears the destination
    dragObj.on("dragend", function() {


        //console.log("box: " + currBox.pieceId + currBox.full);

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
                    //console.log("get");
                    this.setX(this.getX() + 70);
                    this.setY(this.getY() + 70);
                }
            }
        }


        if (isClose(this)) { //this dragged object

            //set the x,y coords to the destination box
            if (currBox !== "") {
                dragObj.setX(currBox.getX());
                dragObj.setY(currBox.getY());

                currBox.full = true;

                if (this.pieceId === currBox.pieceId) {
                    this.placed = true;
                    this.setStroke("");
                    this.setStrokeWidth(0);
                } else {
                    this.setStroke("red");
                    this.setStrokeWidth(4);
                }
            }
        }

        //check for finish
        isFinished() ? celebrate() : "";
        //redraw()
        boxLayer.draw();
    });
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
    }
    boxLayer.draw();
    $.ionSound.play(jigsaw.sounds[0]);
}

function isFinished() {
    var count = 0;
    var pieces = boxLayer.getChildren();
    $.each(pieces, function(idx, piece) {

        if (piece.placed) {
            count++;
        }
    });
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
            width: 205,
            height: 236,
            draggable: true
        });
        boxLayer.add(image);
        stage.add(boxLayer);

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

        testPiece();
    };
    imageObj.src = source;


}

function createBackgoundImage(width, height) {

    $("#background")
            .attr("src", "img/" + jigsaw.name + "/" + jigsaw.name + "g.png")
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

function testPiece() {

    var children = boxLayer.getChildren();

    $.each(children, function(idx, child) {

        child.placed = false;

        child.on("mousedown", function() {

            //console.log(this.pieceId + ": " + this.placed);

        });
    });
}


//create positions for the pieces, placing them in an object

function createPositions() {
    var positions = [];
    var mgn = 60;
    var spacing = (heightContainer - mgn) / (jigsaw.numPieces / 2);
    var rightX = widthContainer - jigsaw.widthImg;
    var x = 0, y = 0;

    for (var i = 0; i < 6; i++) {

        if (i > 2) {
            x = rightX;
        } else {
            x = 0;
        }
        y = mgn + spacing * (i % (jigsaw.numPieces / 2));
        positions.push([x, y]);
    }
    return shuffle(positions);
}



function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
}
