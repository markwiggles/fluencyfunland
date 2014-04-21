/* 
 functions shared accross activities
 */
//globals
var imgLayer = null;
var txtLayer = null;

//completion messages - shown randomly
messages = ["well done", "you did it", "all finished", "awesome job", "too cool", "excellent", "great work", "you are the best", "you are smart"];

var object = {imgName: null, imgSrc: null, posX: null, posY: null,
    movX: null, movY: null, scale: null, scaleTo: null, rotation: null,
    duration: null, easing: null, callback: function() {
    }};

function initStage() {
//set the stage
    stage = new Kinetic.Stage({
        container: 'container',
        width: $("#container").width(),
        height: $("#container").height()
    });
}

function initLayers() {
//create the layer
    imgLayer = new Kinetic.Layer();
    txtLayer = new Kinetic.Layer();
    stage.add(imgLayer);
    stage.add(txtLayer);

    var canvas1 = imgLayer.getCanvas();
    //canvas1.setPixelRatio(1);
    canvas1.setWidth($("#container").width());
    canvas1.setHeight($("#container").height());
    var canvas2 = txtLayer.getCanvas();
    //canvas2.setPixelRatio(1);
    canvas2.setWidth($("#container").width());
    canvas2.setHeight($("#container").height());

}

function drawText(posX, posY, size, message) {

    txtLayer.removeChildren();

    var textMsg = new Kinetic.Text({
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
    //center the text
    textMsg.offsetX(textMsg.width() / 2);
    txtLayer.add(textMsg);
    stage.add(txtLayer);
}//end drawText


function drawImage(object) {

    var imageObj = new Image();
    imageObj.onload = function() {
        var image = new Kinetic.Image({
            x: object.posX,
            y: object.posY,
            scaleX: typeof(object.scale) === "undefined" ? 0 :object.scale ,
            scaleY: typeof(object.scale) === "undefined" ? 0 :object.scale,
            image: imageObj
        });
        image.hide();
        imgLayer.add(image);
        stage.add(imgLayer);
        

        //add image to images object
        images[object.imgName] = image;
        createTween(image, object);
    };
    imageObj.src = object.imgSrc;
}

function createTween(image, object) {
    
    var newPosX = typeof(object.movX) === "undefined" ? 280 : image.getX() + object.movX;
    var newPosY = typeof(object.movY) === "undefined" ? 50 : image.getY() + object.movY;

    var tween = new Kinetic.Tween({
        node: image,
        force3D: true,
        rotation: typeof(object.rotation) === "undefined" ? 0 : object.rotation,
        duration: object.duration,
        easing: Kinetic.Easings[object.easing],
        x: newPosX,
        y: newPosY,
        scaleX: typeof(object.scaleTo) === "undefined" ? 0 :object.scaleTo,
        scaleY: typeof(object.scaleTo) === "undefined" ? 0 :object.scaleTo,
        onFinish: function() {
            object.callback();
        }
    });

    //add tween to tweens object
    tweens[object.imgName] = tween;
}