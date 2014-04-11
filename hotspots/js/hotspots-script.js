
//globals for Kinetic js
var stage = null;
var imgLayer = null;
var txtLayer = null;

var images = {};
var tweens = {};

$(function() {

    initStage();
    initLayers();


    //displayPosition("hotspots-layout");
});


function initImages() {

    $.each(hotspot.objects, function(idx, object) {
        drawImage(object.name);
    });
}

function initObjects() {


    //initially show the normal image
    $(".objGlow").hide();
    $(".objImage").show();

    //on mouseover show the glowing image
    $(".objects").on("mouseenter", function(event) {
        event.stopPropagation();
        event.preventDefault();
        var image1 = $(this).find("img:eq(0)");
        var image2 = $(this).find("img:eq(1)");
        image1.hide();
        image2.show();
    });
    //when leaving, go back to the normal image
    $(".objects").on("mouseleave", function(event) {
        event.stopPropagation();
        event.preventDefault();
        var image1 = $(this).find("img:eq(0)");
        var image2 = $(this).find("img:eq(1)");
        image1.show();
        image2.hide();
    });

    //on click or touch, hide the small image and call the animation to enlarge
    $(".objects").on("mousedown touchstart", function(event) {
        event.stopPropagation();
        event.preventDefault();
        //stop further selection
        $(".objects").unbind("mousedown touchstart");
        //show the image canvas
        $("#container").show();

        var objectName = $(this).attr("id");

        $(this).hide();

        $("#hotspots-layout").css({opacity: "0.2"});

        //hide the images that will be tweened
        $.each(images, function(idx, image) {
            image.hide();
        });

        //play tween
        images[objectName].show();
        tweens[objectName].play();
    });
}


function initSounds() {

    var sounds = [];

    $.each(hotspot.objects, function(idx, object) {
        sounds.push(object.name);
    });

    $.ionSound({
        sounds: sounds,
        path: "sounds/",
        volume: "1.0",
        multiplay: true
    });
}

function initStage() {
//set the stage
    stage = new Kinetic.Stage({
        container: 'container',
        width: 1024,
        height: 680
    });
}

function initLayers() {
//create the layer
    imgLayer = new Kinetic.Layer();
    txtLayer = new Kinetic.Layer();
    stage.add(imgLayer);
    stage.add(txtLayer);
}


function drawText(posX, posY, size, message) {

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

function drawImage(objectName) {

    var object = hotspot.objects[objectName];

    var imageObj = new Image();
    imageObj.onload = function() {
        var image = new Kinetic.Image({
            x: object.x,
            y: object.y,
            width: 100,
            height: 100,
            image: imageObj,
            id: objectName
        });
        imgLayer.add(image);
        stage.add(imgLayer);

        images[objectName] = image;
        image.hide();
        createTween(objectName);
    };
    imageObj.src = hotspot.path + object.name + ".png";
}

function createTween(objectName) {

    var image = images[objectName];

    var tween = new Kinetic.Tween({
        node: image,
        force3D: true,
        duration: 0.5,
        x: 280,
        y: 50,
        scaleX: 5.5,
        scaleY: 5.5,
        onFinish: function() {

            //show text for the object
            drawText(512, 20, 60, objectName);
            $.ionSound.play(objectName);

            //initiate event to remove large image on click
            $("#container").on("mousedown touchstart", function(event) {
                event.stopPropagation();
                event.preventDefault();

                txtLayer.removeChildren();
                tween.reset();
                imgLayer.draw();
                txtLayer.draw();

                $(".objects").show();
                initObjects();
                $("#container").hide();
                $("#hotspots-layout").css({opacity: "1.0"});
            });//end event initialisation
        }//end onFinish

    });
    //add tween to object
    tweens[objectName] = tween;
}