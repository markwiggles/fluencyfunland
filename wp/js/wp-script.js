


initStage();
initLayers();
//displayPosition("#container");


/** Function to initialise the click event to show the selected image and bg
 * @returns void
 */
function initSpriteEvent() {
    $(".sprite").on("mousedown touchstart", function() {
        event.stopPropagation();
        event.preventDefault();

        txtLayer.removeChildren();
        txtLayer.draw();

        currentObject = ($(this).attr("class")).split(" ")[0];
        $("#container, .theme-bg").hide();

        //show the  background and object
        $("#" + currentObject + "_bg").show("500", function() {
            imgLayer.getChildren().hide();
            images[currentObject].show();
            tweens[currentObject].reset();
            tweens[currentObject].play();
            $.ionSound.play(currentObject);
            $("#container").show();
        });
    });
    initBackNavigation();
}

function initBackNavigation() {

    //initialise event to take us back to the wp menu
    $("#back").on("mousedown touchstart", function() {
        event.stopPropagation();
        event.preventDefault();

        imgLayer.getChildren().hide();
        images["beachball"].hide();
        tweens["beachball"].reset();


        //clear the column divs, and hide the page elements
        $("#col1, #col2").empty();
        $("#container, #col1, #col2, #back, .theme-bg").hide();

        //if in the custom theme go back to the custom menu
        if (currentTheme === "custom") {
            if (!$("#custom-menu").is(":hidden")) {
                $("#theme-menu").show();
                $("#custom-menu").hide();
            } else {
                $("#custom-menu").show();
                $("#back").show();
            }
        } else {
            $("#theme-menu").show();
        }
    });
}


/** Create the html for each object with a theme, which is hidden until selected 
 * @returns {undefined}
 */
function createObjectBackgrounds() {

    $.each(themes[currentTheme].objects, function(idx, object) {

        var objectBg = "themes/" + currentTheme + "/backgrounds/" + idx + "_bg.png";

        //for each object - create an object background
        $("#image-div")
                .append($("<img>")
                        .addClass("theme-bg " + currentTheme)
                        .attr("src", objectBg)
                        .attr("id", idx + "_bg")
                        .attr("alt", idx)
                        );
    });
}


/** Get the image names for the selected theme from the theme folder
 * - loop through them to display the sprite thumbs, evenly in the columns
 * @returns void
 */
function displayThemeSpriteImages() {

    if (currentTheme !== "custom") {

        var imageNames = themes[currentTheme].objects;

        var imageSounds = new Array();
        var numColumns = 2;
        var i = 0;
        $.each(imageNames, function(imageName, object) {

            if (i < getObjectSize(imageNames) / numColumns) {
                $("#col1").append($("<div>").addClass(imageName).addClass("sprite"));
            } else {
                $("#col2").append($("<div>").addClass(imageName).addClass("sprite"));
            }
            //change file name syntax to suit ionSound plugin
            imageSounds.push(imageName.replace("_", ""));
            i++;
        });//end each
        //tidy the icons so they are evenly spaced
        spaceElements("col1");
        spaceElements("col2");

        //initialise the events and sounds
        initSpriteEvent();
        initSounds(imageSounds);
        initShowTextEvent();

        setTimeout(function() {
            $("#col1, #col2").removeClass("loading");
        }, 1500);


    }
}

/** Function to initialise the event to show the text when the background is clicked
 * @returns void
 */
function initShowTextEvent() {
    $("#container").on("mousedown touchstart", function() {
        event.stopPropagation();
        event.preventDefault();

        // show the theme as text on the image
        var posX = $("#container").width() / 2;
        var posY = 100;
        var size = 70;
        var message = currentObject;
        drawText(posX, posY, size, message);
    });
}

//function to initialise the sounds
function initSounds(imageSounds) {

    //need to initialise imageNames without underscores because ionSound can't handle
    $.ionSound({
        sounds: imageSounds,
        path: "themes/" + currentTheme + "/sounds/",
        volume: "1.0",
        multiplay: true
    });
}


function spaceElements(column) {

    var elements = $("#" + column).children();
    var heights = 0;

    $.each(elements, function(idx, element) {
        heights += $(element).height();
    });
    var margin = ($("#" + column).height() - heights) / elements.length;
    $("#" + column + " .sprite").css({"margin-top": margin});
    $("#" + column + " img").css({"margin-top": margin});
}


/** Function to show the custom page
 * @returns void
 */
function showCustomPage() {

    //theme = "custom";
    //clear the divs ready for the next images
    $("#col1, #col2, #image-div").empty();
    $("#custom-menu").empty();

    //hide the canvas
    $("#image-div, #container").hide();
    //show the sets
    displayCustomSets();
    $("#custom-menu").show();
}


/**Function to call Flickr to get any photoset names and ids
 * @returns {undefined}
 */
function displayCustomSets() {

    $("#custom-menu").addClass("loading");

    $.ajax({
        type: "GET",
        url: "./include/get_flickr_sets.php",
        datatype: "json",
        cache: false
    }).done(function(result) {

        $("#custom-menu").removeClass("loading");

        var jsonObj = $.parseJSON(result);

        var photosets = jsonObj.photosets.photoset;

        $("#themes").append($("<div>").addClass("photosets"));

        $.each(photosets, function(idx, photoset) {
            //loop through the data and append names,ids to create navigation for the sets
            $("#custom-menu")
                    .append($("<div>").addClass("custom-item")
                            .attr("alt", photoset.id)
                            .append($("<span>").html(photoset.title._content)
                                    ));
        });

        //initialise navigation to select the images
        $(".custom-item").mousedown(function() {
            //show the divs
            $("#custom-menu").hide();
            $("#col1, #col2, #bg-canvas, #bg-canvas2, #back, #image-div").show();

            displayFlickrThumbs($(this).attr("alt"));
        });

    });//end ajax
}

function displayFlickrThumbs(photosetId) {

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

        //initialise event to display alt text - ie title
        $("#bg-canvas2").mousedown(function() {
            drawText($("#image-div .customImage:visible").attr("alt"), 70, 80);
        });
        initCustomThumbEvent();
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

        var object = $(this).attr("id");

        $("#showTextMsg").show();
        $(".customImage").hide();
        $("#" + object + "_lge").fadeIn(500);
    }); //end mousedown
}

var getObjectSize = function(obj) {
    var len = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            len++;
    }
    return len;
};