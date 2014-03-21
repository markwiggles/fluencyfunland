
//globals
var imageObj = {};
var textObj = {};
var animation = {};
var theme = null;

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

//document on load
$(function() {
    getThemeNames();
    initContext(imageObj, "bg-canvas");
    initContext(textObj, "bg-canvas2");
    initDrawObject();
    initAnimation();
    //displayPosition();
});
function initDrawObject() {
    imageObj.draw = function() {
        if (imageObj.ctx) {
            var image = new Image();
            image.onload = function() {
                imageObj.ctx.drawImage(image, imageObj[imageObj.name].x, imageObj[imageObj.name].y,
                        image.width * imageObj[imageObj.name].scale, image.height * imageObj[imageObj.name].scale);
            };
            image.src = "themes/" + theme + "/objects/" + imageObj.name + ".png";
        }//end if ctx
    };
}

function initContext(object, canvasId) {
    object.canvas = document.getElementById(canvasId);
    if (object.canvas && object.canvas.getContext) {
        object.ctx = object.canvas.getContext("2d");
    }
}

function getThemeNames() {
    $.ajax({
        type: "GET",
        url: "./include/get_themes.php",
        datatype: "json",
        cache: false
    })      //callback
            .done(function(result) {
        //loop through the names: display the navigation and add sprite images
        var themeNames = $.parseJSON(result);
        themeNames.push("custom");
        $.each(themeNames, function(idx, themeName) {
            $("#themes").append($("<img>")
                    .attr("src", "img/thumbs/" + themeName + ".png")
                    .attr("alt", themeName)
                    .addClass("nav")
        );
            addSpriteStylesheet(themeName);
            $("#themes").show();
            initNavigation();
        });
        //getFlickrSets();
    });//end ajax
}

function initNavigation() {
    //initialise the navigation click event to assign theme and display selected object
    $(".nav").mousedown(function() {
        console.log("test");

        //hide the menu, assign the theme and collect the images
        $("#themes").hide();
        theme = $(this).attr("alt");
        getThemeImages();
        imageObj.name = null;

        //stop further navigation so the images don't appear twice
        $(".nav").unbind("mousedown");

        
        //if a custom set, then show the selected thumbs
//        if ($(this).hasClass("custom")) {
//            getFlickrThumbs($(this).attr("alt"));
//        }
    });
}

//get the image names relating to the selected theme
function getThemeImages() {

    //clear the decks
    $("#col1, #col2, #image-div").empty();
    clearCanvas(imageObj);
    clearCanvas(textObj);

    $.ajax({
        type: "GET",
        url: "./include/get_images.php",
        datatype: "json",
        cache: false,
        data: {theme: theme}
    })
            //callback
            .done(function(result) {
        //loop through the names and display the images, evenly in the 2 columns
        var imageNames = $.parseJSON(result);
        var imageSounds = new Array();
        $.each(imageNames, function(idx, imageName) {
            if (idx < imageNames.length / 2) {
                $("#col1").append($("<div>").addClass(imageName).addClass("sprite"));
            } else {
                $("#col2").append($("<div>").addClass(imageName).addClass("sprite"));
            }
            //change file name syntax to suit ionSound plugin
            imageSounds.push(imageName.replace("_", ""));
        });//end each
        //tidy the icons so they are evenly spaced
        spaceElements("col1");
        spaceElements("col2");
        initNavigation();

        //show the first background
        showBackground($("#col1").children(":first").attr('class').split(' ')[0] + "_bg");
        // show the theme as text
        drawText(theme, 100, 180);
        //initialise the sounds
        initSounds(imageSounds);
        //initialise the click event for the icons
        initSpriteEvent();
        //show the content ie the first background and the icons
        initTextEvent();
        $("#content").delay(100).fadeIn(100);
    });//end ajax
}

function initTextEvent() {
    $("#bg-canvas2").mousedown(function() {
        drawText(imageObj.name, 70, 80);
    });
}

function initSpriteEvent() {

    //initialise the click event to show the selected image and bg
    $(".sprite").mousedown(function() {

        var spriteClass = $(this).attr("class");
        imageObj.name = spriteClass.replace(" sprite", "");

        if (imageObj.ctx) {
            clearCanvas(imageObj);
        }
        if (textObj.ctx) {
            clearCanvas(textObj);
        }
        //hide current and show the new background
        $(".image_bg").hide();
        var bgImg = imageObj.name + "_bg";

        //empty the image div and append new background image
        showBackground(bgImg);
    });

}

function showBackground(imageName) {
    $("#image-div").empty();
    $("#image-div").addClass("loading");
    $("#showTextMsg").hide();
    var image = new Image();
    image.src = "themes/" + theme + "/backgrounds/" + imageName + ".png";
    $(image).load(function() {
        $("#image-div").append(image).hide().fadeIn(500, function() {
            $("#image-div").removeClass("loading");
        });
        //draw the object/animation
        initAnimation(imageObj);
        animate(imageObj);
        //play the sound
        $.ionSound.play((imageObj.name).replace("_", ""));
        //show text msg
        $("#showTextMsg").show();
    });
}
//function to initialise the sounds
function initSounds(imageSounds) {

    //need to initialise imageNames without underscores because ionSound can't handle

    $.ionSound({
        sounds: imageSounds,
        path: "themes/" + theme + "/sounds/",
        volume: "1.0",
        multiplay: true
    });
}

function initAnimation() {
    animation.bounce = {gravity: .4, bounceFactor: 1, velocity: 1};
}

function animate(object) {
    initAnimation();
    setObjectParams(object);
    //drawAnimation(object);
    object.draw();
}

function drawAnimation(object) {
    var startTime = new Date().getTime();
    //var interval = setInterval(function() {
//        if (new Date().getTime() - startTime > 3000) {
//            clearInterval(interval);
//            return;
//        }
    update(object);
    //}, 100000000);

//    requestAnimFrame(drawAnimation);
//    update(object);
}

function update(object) {
    clearCanvas(object);
    object.draw();
    //Create the animation
//    object[object.name].y += animation.bounce.velocity;//add the velocity vector    
//    animation.bounce.vy += animation.bounce.gravity;//add some acceleration
//
//    //Make it rebound
//    if (object[object.name].y > 350) {
//        //Reposition the object on bottom and then bounce it
//        object[object.name].y = 300;
//        animation.bounce.vy *= -animation.bounce.bounceFactor;
//    }
//        /*bounceFactor variable decides the elasticity 
//         * i.e. how elastic the collision will be.
//         * If it's 1, then the collision will be perfectly elastic. 
//         * If 0, then it will be inelastic. */

}

function clearCanvas(object) {
    object.ctx.clearRect(0, 0, 804, 560);
}

function drawObject(imageObj) {

    if (imageObj.ctx) {
        clearCanvas(imageObj);
        var image = new Image();
        image.onload = function() {
            setObjectParams(imageObj.name);
            imageObj.ctx.drawImage(image, imageObj.x, imageObj.y, image.width * imageObj.scale, image.height * imageObj.scale);
        };
        image.src = "themes/" + theme + "/objects/" + imageObj.name + ".png";
    }//end if ctx
}//end initCanvas

function drawText(text, size, posY) {

    $("#showTextMsg").hide();

    if (textObj.ctx && typeof(text) !== "undefined" && text !== null) {
        text = text.replace("_", " ");

        clearCanvas(textObj);

        //write the name
        textObj.ctx.font = "bold " + size + "px Comic Sans MS";
        textObj.ctx.textAlign = "center";
        textObj.ctx.shadowColor = "darkgrey";
        textObj.ctx.shadowBlur = 3;
        textObj.ctx.shadowOffsetX = 2;
        textObj.ctx.shadowOffsetY = 2;
        textObj.ctx.strokeStyle = 'black';
        textObj.ctx.lineWidth = 3;
        textObj.ctx.strokeText(text, 400, posY); //posY: 80 for objects, 

//        var width = textObj.ctx.measureText(text).width;
//        textObj.ctx.fillStyle = 'navy';
//        /// draw background rect assuming height of font
//        textObj.ctx.fillRect(0, 0, width + 20, 100);
        textObj.ctx.fillStyle = "white";
        textObj.ctx.fillText(text, 400, posY);

    }//end if ctx
}//end drawText

//function to init and assign object co-ords and scale
function setObjectParams(object) {

    object.beachball = {x: 300, y: 250, scale: 1, anim: function() {
            console.log("test");
        }};
    object.bucket = {x: 230, y: 300, scale: 1};
    object.crab = {x: 300, y: 300, scale: 1};
    object.jellyfish = {x: 300, y: 100, scale: 1};
    object.lifeguard = {x: 300, y: 200, scale: 1.1};
    object.sandcastle = {x: 350, y: 350, scale: 1};
    object.seagull = {x: 200, y: 100, scale: 0.7};
    object.seashell = {x: 400, y: 300, scale: 0.7};
    object.towel = {x: 100, y: 350, scale: 1};
    object.backyard = {x: 100, y: 0, scale: 0.9};
    object.bath = {x: 100, y: 200, scale: 1};
    object.bed = {x: 80, y: 250, scale: 1};
    object.fridge = {x: 200, y: 20, scale: 1};
    object.lounge = {x: 190, y: 170, scale: 1};
    object.oven = {x: 100, y: 200, scale: 0.9};
    object.parents = {x: 270, y: 250, scale: 0.9};
    object.toilet = {x: 280, y: 180, scale: 1};
    object.tv = {x: 280, y: 60, scale: 1};
    object.washing_machine = {x: 400, y: 160, scale: 1};
    object.umbrella = {x: 100, y: 0, scale: 1};
    object.chicken = {x: 675, y: 420, scale: 0.8};
    object.cow = {x: 350, y: 350, scale: 1};
    object.duck = {x: 540, y: 380, scale: 1};
    object.farmer = {x: 600, y: 380, scale: 1};
    object.horse = {x: 260, y: 150, scale: 1};
    object.goat = {x: 380, y: 340, scale: 1};
    object.pig = {x: 350, y: 380, scale: 1};
    object.scarecrow = {x: 300, y: 280, scale: 1.2};
    object.sheep = {x: 350, y: 370, scale: 1};
    object.tractor = {x: 230, y: 250, scale: 1};
    object.bird = {x: 180, y: 390, scale: 1};
    object.goldfish = {x: 280, y: 280, scale: 1};
    object.guineapig = {x: 290, y: 200, scale: 1};
    object.hermitcrab = {x: 330, y: 290, scale: 1};
    object.kitten = {x: 430, y: 370, scale: 1};
    object.lamb = {x: 450, y: 270, scale: 1};
    object.mouse = {x: 420, y: 200, scale: 1};
    object.puppy = {x: 385, y: 280, scale: 1};
    object.rabbit = {x: 290, y: 270, scale: 1};
    object.turtle = {x: 390, y: 251, scale: 1};
    object.ants = {x: 280, y: 320, scale: 1};
    object.boomerang = {x: 270, y: 150, scale: 1};
    object.park_bench = {x: 80, y: 30, scale: 1};
    object.picnic_basket = {x: 120, y: 320, scale: 1};
    object.picnic_blanket = {x: 290, y: 270, scale: 1};
    object.tennisball = {x: 380, y: 210, scale: 1};
    object.slide = {x: 200, y: 50, scale: 1};
    object.swings = {x: 150, y: 130, scale: 1};
    object.trampoline = {x: 230, y: 120, scale: 1};
    object.tunnel = {x: 260, y: 160, scale: 1};
    object.blackboard = {x: 240, y: 80, scale: 1};
    object.lunchbox = {x: 320, y: 170, scale: 1};
    object.pencils = {x: 530, y: 400, scale: 1};
    object.singing = {x: 230, y: 200, scale: 1};
    object.icecream_truck = {x: 40, y: 180, scale: 1};
    object.money = {x: 250, y: 90, scale: 1.1};
    object.vegetables = {x: 190, y: 265, scale: 0.5};
    object.basketball = {x: 320, y: 130, scale: 1};
    object.cricket = {x: 200, y: 290, scale: 1};
    object.football = {x: 320, y: 200, scale: .3};
    object.gymnastics = {x: 280, y: 120, scale: 1};
    object.netball = {x: 300, y: 100, scale: 1};
    object.soccer = {x: 230, y: 250, scale: 1.2};
    object.tennis = {x: 100, y: 230, scale: 1};
    object.bicycle = {x: 360, y: 240, scale: 1};
    object.bus = {x: 380, y: 270, scale: 1};
    object.car = {x: 50, y: 90, scale: .4};
    object.motorcycle = {x: 390, y: 380, scale: 1};
    object.plane = {x: 120, y: 170, scale: 1};
    object.rocket = {x: 300, y: 170, scale: 1};
    object.scooter = {x: 220, y: 170, scale: 1};
    object.ship = {x: 200, y: 280, scale: 1};
    object.train = {x: 260, y: 230, scale: 1.2};
    object.tram = {x: 120, y: 180, scale: 1.2};
}

function displayPosition() {
    $("#image-div, #bg-canvas1, #bg-canvas2").mousedown(function(e) {
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

function spaceElements(column) {

    var elements = $("#" + column).children();
    var heights = 0;

    //console.log(elements);
    //console.log("no: " + elements.length);


    $.each(elements, function(idx, element) {
        heights += $(element).height();
        //console.log("hts: " + heights);
    });
    var margin = ($("#" + column).height() - heights) / 5;
    $("#" + column + " .sprite").css({"margin-top": margin});
    $("#" + column + " img").css({"margin-top": margin});
}

function addSpriteStylesheet(theme) {
    if (theme !== "custom") {
        $(document.head).append(
                "<link rel='stylesheet' type='text/css' href='themes/" + theme + "/sprites.css'/>"
                );
    }
}

function getFlickrSets() {
    $.ajax({
        type: "GET",
        url: "./include/get_flickr_sets.php",
        datatype: "json",
        cache: false
    })
            .done(function(result) { //when the pics come back

        var jsonObj = $.parseJSON(result);

        var photosets = jsonObj.photosets.photoset;

        $("#themes").append($("<div>").addClass("photosets"));

        $.each(photosets, function(idx, photoset) {
            //loop through the data and append names,ids to create navigation for the sets
            $(".photosets")
                    .append($("<a>")
                    .html(photoset.title._content)
                    .attr("alt", photoset.id)
                    .addClass("custom").addClass("nav")
                    );
        });
        initNavigation();
    });//end ajax
}


function getFlickrThumbs(photosetId) {

    $("#image-div").addClass("loading");

    $.ajax({
        type: "GET",
        url: "./include/get_flickr_thumbs.php",
        datatype: "json",
        cache: false,
        data: {photoset: photosetId}
    }).done(function(result) {

        //Everything to be done when the thumb images come back
        var jsonObj = $.parseJSON(result);
        var photos = jsonObj.photoset.photo;
        //loop through the data and create the pics in the right div
        $.each(photos, function(idx, photo) {
            //add the thumbnails to the columns evenly
            var columnDiv = idx % 2 === 0 ? "#col1" : "#col2";
            appendThumbs(columnDiv, photo);
            createLargeImages(photo);
        }); //end each
        //show the content ie the thumbnails
        $("#content").delay(100).fadeIn(100);
        $("#image-div").removeClass("loading");
        initNavigation();

        initCustomThumbEvent()

        //initialise event to display alt text - ie title
        $("#bg-canvas2").mousedown(function() {
            drawText($("#image-div .customImage:visible").attr("alt"), 70, 80);
        });
        //spaceElements("col1");
        //spaceElements("col2");
        //trigger event on first image - ie load first image
        $("#col1").children(":first").trigger("mousedown");
    }); //end ajax
}//end function

function createLargeImages(photo) {
    //create the large images (to be hidden until selected)
    $("#image-div")
            .append($("<img>")
            .attr("src", createImageUrl(photo, "large"))
            .addClass("customImage")
            .attr("id", photo.id + "_lge")
            .attr("alt", photo.title)
            );
}

function appendThumbs(columnDiv, photo) {
    $(columnDiv)
            .append($("<img>")
            .attr("id", photo.id)
            .addClass("customThumb")
            .attr("src", createImageUrl(photo, "thumb")
            ));
}

function createImageUrl(photo, size) {
    var suffix = size === "thumb" ? "t.jpg" : "c.jpg";
    var src_url = "http://farm" + photo.farm + ".static.flickr.com/" +
            photo.server + "/" + photo.id + "_" + photo.secret + "_" + suffix;
    return src_url;
}

//Function to initialise event to display the custom images selected by thumbs
function initCustomThumbEvent() {
    $("#col1 img, #col2 img").mousedown(function() {
        $("#showTextMsg").show();
        $(".customImage").hide();
        clearCanvas(textObj);
        $("#" + $(this).attr("id") + "_lge").fadeIn(500);
    }); //end mousedown
}