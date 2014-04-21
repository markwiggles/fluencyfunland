
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


function createImages() {
    $.each(hotspot.objects, function(idx, object) {
        drawImage(object);
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

function tweenCallback(tween, objectName) {
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
    }); //end event initialisation
}

