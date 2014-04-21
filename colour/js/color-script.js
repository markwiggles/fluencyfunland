
//globals

var drawColor = "";
var strokeColor = "black";
var context = null;
var layer0 = null;
var layer1 = null;
var layer2 = null;
var layer3 = null;
var layer4 = null;
var layer5 = null;
var layer6 = null;
var stage = null;
var completed = false;

var drawing = {
    name: null,
    x: null,
    y: null,
    scale: null,
    shapeCount: null, //count of number of shapes
    layerBg: [], //shapes in background - drawn first
    layer2: [], //shapes drawn as per drawColor, but in front
    layer3: [], //shapes to be all black
    layer4: [], //shapes to be all white
    layer5: [], //shapes to be white, and converted to backgorund color on finish
    layer6: [] ////shapes to be all black in front of others
};



$("#color-canvas").css("background-color", "white");
$("#content").show();

initCanvas();
initFindColor();
initSelectColor();
initLayers();
initDrawingNavigation();

/*used in testing*/
//displayPosition("container");


function initDrawingNavigation() {
    $(".color-thumb").on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        drawing = eval($(this).attr("id").replace("thumb", ""));

        //show the blank drawing//init selected drawing shapes
        $("#color-menu").hide();
        $("#drawing, #back").show();
        initShapes();
        initShapeBoolean();
    });

    $("#back").on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        //remove drawing and get back to menu
        clearLayers();
        $("#container").removeClass();
        $("#drawing, #back").hide();
        $("#color-menu").show();
        document.body.style.cursor = "auto";
        completed = false;
    });


}

function clearLayers() {
    initLayers();
    initShapeBoolean();
}

function initShapes() {
    for (var i = 1; i <= drawing.shapeCount; i++) {
        var shape = "shape" + i;
        drawShape(shape);
    }
}

function initLayers() {

    drawColor = "white";
    strokeColor = "black";

    stage = new Kinetic.Stage({
        container: 'container',
        width: 774,
        height: 680
    });
    layer0 = new Kinetic.Layer();
    layer1 = new Kinetic.Layer();
    layer2 = new Kinetic.Layer();
    layer3 = new Kinetic.Layer();
    layer4 = new Kinetic.Layer();
    layer5 = new Kinetic.Layer();
    layer6 = new Kinetic.Layer();
}

/*
 * Function to create a shape by defining a
 * drawing function which draws a shape
 */
function drawShape(shape) {

    //Create the drawing shape using the predefined drawing code
    drawing[shape].object = new Kinetic.Shape({
        sceneFunc: function(ctx) {
            eval(drawing[shape].code);
            ctx.fillStrokeShape(this);
        },
        fill: drawColor,
        stroke: strokeColor,
        strokeWidth: 1
    });
    //add the offsets and scale
    drawing[shape].object.offsetX(drawing.x);
    drawing[shape].object.offsetY(drawing.y);
    drawing[shape].object.scale({x: drawing.scale, y: drawing.scale});

    // add the specified shape to the background layer
    if (drawing.layer0.indexOf(shape) !== -1) {
        drawing[shape].object.setFill("black"); //set the fill
        drawing[shape].object.setStroke("black");
        layer0.add(drawing[shape].object);
    } else {

        // add the specified shape to the main layer
        layer1.add(drawing[shape].object);

        //add third layer for specified shapes - drawColor 
        if (drawing.layer2.indexOf(shape) !== -1) {
            drawing[shape].object.setFill(drawColor);
            drawing[shape].object.setStroke(strokeColor);
            layer2.add(drawing[shape].object);
        }

        //add second layer for specified shapes - black
        if (drawing.layer3.indexOf(shape) !== -1) {
            drawing[shape].object.setFill("black");
            drawing[shape].object.setStroke("black");
            layer3.add(drawing[shape].object);
        }

        //add fourth layer for specified shapes - all white
        if (drawing.layer4.indexOf(shape) !== -1) {
            drawing[shape].object.setFill("white");
            drawing[shape].object.setStroke("white");
            layer4.add(drawing[shape].object);
        }
                        //add fifth layer for specified shapes - all white, unless finished
        if (drawing.layer5.indexOf(shape) !== -1) {
            drawing[shape].object.setFill("black");
            drawing[shape].object.setStroke("black");
            layer5.add(drawing[shape].object);
        }
        //add fifth layer for specified shapes - all white, unless finished
        if (drawing.layer6.indexOf(shape) !== -1 && !checkFinish()) {
            drawing[shape].object.setFill("white");
            drawing[shape].object.setStroke("white");
            layer6.add(drawing[shape].object);
        }

    }

    // add the layers to the stage
    stage.add(layer0);
    stage.add(layer1);
    stage.add(layer2);
    stage.add(layer3);
    stage.add(layer4);
    stage.add(layer5);
    stage.add(layer6);

    // initialise the event to draw shapes
    drawing[shape].object.on('mousedown touchstart', function() {
        
        if (!completed) {
            drawShape(shape);
            if (drawColor !== "white") {
                drawing[shape].colored = true;
            }
            checkFinish() ? celebrate() : "";
        }
    });
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

    $('#color-canvas').mousemove(function(event) {
        var pos = findPos(this);
        var x = event.pageX - pos.x;
        var y = event.pageY - pos.y;
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
    });
}

function initSelectColor() {

    $('#color-canvas').on({'mousedown touchstart': function(event) {
            if (!completed) {
                var pos = findPos(this);
                var x = event.pageX - pos.x;
                var y = event.pageY - pos.y;
                var coord = "x=" + x + ", y=" + y;
                var c = this.getContext('2d');
                var p = c.getImageData(x, y, 1, 1).data;
                var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
                drawColor = hex;
                //strokeColor = hex;
                makeCursor(hex);
                $("#color-pick").css("background-color", hex);
            }
        }
    });
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
function initShapeBoolean() {

    for (var i = 1; i <= drawing.shapeCount; i++) {
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
    $.each(drawing.layer5, function(idx, shapeNo) {
        drawing[shapeNo].colored = true;
    });
    $.each(drawing.layer6, function(idx, shapeNo) {
        drawing[shapeNo].colored = true;
    });

}


function checkFinish() {

    var count = 0;
    $.each(drawing, function(idx, shape) {
            if (drawing[idx].colored) {
                count++;
            }
    });
    return count === drawing.shapeCount;
}

function celebrate() {
    $("#container").removeClass();
    $("#container").addClass(drawing.name);
    addShapeBgColor();
    completed = true;
    document.body.style.cursor = "default";
}

function addShapeBgColor() {
    //for the shapes in layer 5 array, add the bg color
    $.each(drawing.layer6, function(idx, shape) {
        drawing[shape].object.setFill(drawing.colorBg);
        drawing[shape].object.setStroke(drawing.colorBg);
        layer6.add(drawing[shape].object);
    });
    stage.add(layer6);
}