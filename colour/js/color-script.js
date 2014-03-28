
//globals

var drawColor = "";
var strokeColor = "black";
var context = null;
var layer0 = null;
var layer1 = null;
var layer2 = null;
var layer3 = null;
var layer4 = null;
var stage = null;
var currentDrawing = null;

$(function() {

    $("#color-canvas").css("background-color", "white");
    $("#content").show();

    initCanvas();
    initFindColor();
    initSelectColor();
    initLayers();
    initDrawingNavigation();

    /*used in testing*/
    //displayPosition(); 

});

function initDrawingNavigation() {
    $(".color-thumb").on({'mousedown touchstart': function() {
            currentDrawing = eval($(this).attr("id").replace("thumb", ""));

            //hide menu
            $("#color-menu").hide();
            //show drawing
            $("#drawing, #back").show();
            //init selected drawing shapes
            initShapes(currentDrawing);
            initShapeBoolean(currentDrawing);
        }});

    $("#back").on({'mousedown touchstart': function() {
            //remove drawing and get back to menu
            clearLayers();
            $("#drawing").hide();
            $("#color-menu").show();
            document.body.style.cursor = "auto";
        }});


}

function clearLayers() {
    initLayers();
    initShapeBoolean(currentDrawing);
}

function initShapes(drawing) {
    for (var i = 1; i <= drawing.shapes; i++) {
        var shape = "shape" + i;
        drawShape(drawing, shape);
    }
}

function initLayers() {

    drawColor = "white";
    strokeColor = "black";

    stage = new Kinetic.Stage({
        container: 'container',
        width: 774,
        height: 768
    });
    layer0 = new Kinetic.Layer();
    layer1 = new Kinetic.Layer();
    layer2 = new Kinetic.Layer();
    layer3 = new Kinetic.Layer();
    layer4 = new Kinetic.Layer();

}

/*
 * Function to create a shape by defining a
 * drawing function which draws a shape
 */
function drawShape(shape, name) {

    shape[name].object = new Kinetic.Shape({
        sceneFunc: function(ctx) {
            //create the shape
            eval(shape[name].code);
            // KineticJS specific context method
            ctx.fillStrokeShape(this);
        },
        fill: drawColor,
        stroke: strokeColor,
        strokeWidth: 1
    });


    //add the offsets and scale
    shape[name].object.offsetX(shape.x);
    shape[name].object.offsetY(shape.y);
    shape[name].object.scale({x: shape.scale, y: shape.scale});

    // add the specified shape to the background layer
    if (shape.layer0.indexOf(name) !== -1) {
        shape[name].object.setFill("black"); //set the fill
        shape[name].object.setStroke("black");
        layer0.add(shape[name].object);
    } else {

        // add the shape to the main layer
        layer1.add(shape[name].object);

        //add third layer for specified objects - drawColor 
        if (shape.layer2.indexOf(name) !== -1) {
            shape[name].object.setFill(drawColor);
            shape[name].object.setStroke(strokeColor);
            layer2.add(shape[name].object);
        }

        //add second layer for specified objects - black
        if (shape.layer3.indexOf(name) !== -1) {
            shape[name].object.setFill("black");
            shape[name].object.setStroke("black");
            layer3.add(shape[name].object);
        }

        //add fourth layer for specified objects - all white
        if (shape.layer4.indexOf(name) !== -1) {
            shape[name].object.setFill("white");
            shape[name].object.setStroke("white");
            layer4.add(shape[name].object);
        }
    }


    // add the layers to the stage
    stage.add(layer0);
    stage.add(layer1);
    stage.add(layer2);
    stage.add(layer3);
    stage.add(layer4);

    // initialise the event to redraw with (new?) color
    shape[name].object.on('mousedown touchstart', function() {
        drawShape(shape, name);
        if (drawColor !== "white") {
            shape[name].colored = true;
            console.log("color" + drawColor);
            console.log("changed to true");
        }
        console.log(name);
    });

    checkFinish(shape);
}


function initCanvas() {
    var mycanvas = document.getElementById("color-canvas");
    var ctx = mycanvas.getContext("2d");

    var image = new Image();
    image.onload = function() {
        ctx.drawImage(image, 0, 0);
    };
    image.src = "img/crayons.png";
}


function initFindColor() {

    $('#color-canvas').mousemove(function(e) {
        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var coord = "x=" + x + ", y=" + y;
        var c = this.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        //do something with the color
        //console.log(hex);
        //console.log(coord);
        //drawColor = hex;
        $("#color-pick").css("background-color", hex);
        document.getElementById("color-canvas").style.cursor = "pointer";
    }
    );
}

function initSelectColor() {

    $('#color-canvas').on({'mousedown touchstart': function(e) {
            var pos = findPos(this);
            var x = e.pageX - pos.x;
            var y = e.pageY - pos.y;
            var coord = "x=" + x + ", y=" + y;
            var c = this.getContext('2d');
            var p = c.getImageData(x, y, 1, 1).data;
            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            //do something with the color
            //console.log(hex);
            drawColor = hex;
            //strokeColor = hex;
            makeCursor(hex);

            $("#color-pick").css("background-color", hex);
        }
    });
}

function displayPosition() {
    $("#content").mousedown(function(e) {
        var pos = findPos(this);
        x = e.pageX - pos.x;
        y = e.pageY - pos.y;
        var coordinateDisplay = "x=" + x + ", y=" + y;
        console.log(coordinateDisplay);
    });
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x: curleft, y: curtop};
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function makeCursor(color) {

    /// create off-screen canvas
    var cursor = document.createElement('canvas'),
            ctx = cursor.getContext('2d');

    cursor.width = 100;
    cursor.height = 100;

    /// draw some shape for sake of demo
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(14, 24);
    ctx.bezierCurveTo(18, 20, 21, 17, 25, 13);
    ctx.bezierCurveTo(33, 22, 42, 31, 50, 39);
    ctx.bezierCurveTo(47, 43, 43, 46, 40, 50);
    ctx.bezierCurveTo(31, 41, 23, 33, 14, 24);
    ctx.moveTo(10, 20);
    ctx.bezierCurveTo(10, 20, 9, 19, 8, 18);
    ctx.lineTo(8, 17);
    ctx.bezierCurveTo(9, 16, 8, 15, 8, 14);
    ctx.bezierCurveTo(7, 13, 6, 13, 6, 12);
    ctx.bezierCurveTo(4, 9, 2, 7, 1, 4);
    ctx.lineTo(0, 3);
    ctx.bezierCurveTo(0, 2, 1, 1, 1, 0);
    ctx.bezierCurveTo(2, 0, 3, 0, 4, 0);
    ctx.bezierCurveTo(6, 2, 8, 3, 10, 4);
    ctx.bezierCurveTo(12, 5, 14, 6, 16, 8);
    ctx.bezierCurveTo(16, 8, 17, 8, 17, 7);
    ctx.bezierCurveTo(18, 7, 18, 7, 19, 8);
    ctx.bezierCurveTo(19, 8, 20, 9, 21, 10);
    ctx.bezierCurveTo(18, 13, 14, 17, 10, 20);
    ctx.moveTo(24, 13);
    ctx.bezierCurveTo(21, 17, 17, 20, 14, 24);
    ctx.moveTo(22, 11);
    ctx.bezierCurveTo(19, 15, 16, 18, 12, 22);
    ctx.moveTo(22, 11);
    ctx.lineTo(12, 22);
    ctx.fill();
    ctx.stroke();

    /// set image as cursor.
    if (drawColor !== "white") {
        document.body.style.cursor = 'url(' + cursor.toDataURL() + '), auto';
    }

}
function initShapeBoolean(drawing) {

    for (var i = 1; i <= drawing.shapes; i++) {
        var shape = "shape" + i;
        drawing[shape].colored = false;

    }
    //assign true to pre-colored shapes ie outline, black, and white
    $.each(drawing.layer0, function(idx, shapeNo) {
        drawing[shapeNo].colored = true;
    });

    $.each(drawing.layer3, function(idx, shapeNo) {
        drawing[shapeNo].colored = true;
    });
    $.each(drawing.layer4, function(idx, shapeNo) {
        drawing[shapeNo].colored = true;
    });

}


function checkFinish(drawing) {

    var shapes = drawing.shapes;
    var count = 0;

    var idxOthers = ["x", "y", "scale", "shapes", "layer0", "layer2", "layer3", "layer4"]

    $.each(drawing, function(idx, shape) {
        //console.log("i " + idx);
        //if the idx is a shape ie not contained in the array
        if (idxOthers.indexOf(idx) === -1) {
            console.log(idx + ":" + drawing[idx].colored);

            if (drawing[idx].colored) {
                count++;
            }
        }
    });
    console.log(count);
    console.log(drawing);
}