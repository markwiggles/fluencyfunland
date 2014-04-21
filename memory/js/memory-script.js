
//globals

var stage = null;
var imgLayer = null;
var txtlayer = null;
var images = {};
var tweens = {};

var card1 = {//1st selection
    id: null,
    source: null,
    x: null,
    y: null
};
var card2 = {//2nd selection
    id: null,
    source: null,
    x: null,
    y: null
};

var cards = {}; //all the cards
var positions = []; //absolute positions for the cards on the layout (unchanged)
var shuffledPositions = []; //the copied array with the shuffled positions

// object to store the packs data
var packs = {};
packs.currentPack = {
    name: null,
    imgSrc: null,
    numImgs: null,
    images: [],
    background: null,
    sounds: [],
    color: null,
    object: null,
    coords: null
};

packs.currentPack.objCoords = {x: null, y: null};

var animals = {imgName: "animals", imgSrc: "objects/animals.png", posX: 1000, posY: 400,
    movX: -100, movY: 0, scale: 1, scaleTo: 1,
    duration: 4, easing: "Linear", callback: function() {
    }};
var food = {imgName: "food", imgSrc: "objects/food.png", posX: 0, posY: 320,
    movX: 500, movY: 20, scale: 1, scaleTo: 1,
    duration: 4, easing: "EaseOut", callback: function() {
    }};
var transport = {imgName: "transport", imgSrc: "objects/transport.png", posX: 200, posY: 380,
    movX: 700, movY: -230, scale: 1, scaleTo: 0,
    duration: 4, easing: "EaseOut", callback: function() {
    }};

var packColors = ["white", "white", "white", "#FFC2C2", "#66E0A3", "#99EBFF"];


$(function() {

    getPacks();
    initRefreshBackNavigation();
    initStage();
    initLayers();


    $("#skip").unbind().on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        //stop animation
        $("#intro").removeClass("show-intro");

        $("#intro").fadeOut(500, function() {
            $("#memory-menu").show();
        });
    });
});

function initPageNavigation() {
    $(".nav").unbind().on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        //show the card layout
        $("#memory-menu").hide();
        $("#card-layout").show();

        //assign selected pack and cardImage
        var pack = $(this).parent().find("p").html();
        packs.currentPack = packs[pack];
        $("#background").attr("src", packs.currentPack.background);
        initSounds();

        // dealCards();
        dealCallback();
        celebrate();

        shuffleCards();
        createCardLayout();

    });
}

function initRefreshBackNavigation() {
    $("#back").unbind().on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $("#memory-menu").show();
        $("#card-layout, #background, #container").hide();

        //remove the old deck
        $(".deck").remove();
        $(".cards").remove();
    });

    $("#refresh").unbind().on("mousedown touchstart", function(event) {
        event.stopPropagation();
        event.preventDefault();

        //remove navigation until dealing is finished
        $(".card-back, #back, #refresh, #skip").unbind();

        //remove the old deck
        $(".deck").remove();

        $("#memory-menu, #background, #container").hide();

        //remove any old cards, and deal up again
        $(".cards").remove();


        //deal the cards
        dealCards(); //starts the animation
        shuffleCards(); //get ready while we are waiting
        createCardLayout();
    });
}

function initCardNavigation() {
    $(".cards").unbind().on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();
        checkCard(this);
    });
}

function checkCard(thisCrd) {

    var thisId = $(thisCrd).attr("id");
    var thisSrc = $(thisCrd).find("img").attr("src");

//hide the back of the card and show the image
    $("#" + thisId + " .card-back").hide();
    $("#" + thisId + " .card-image").show();

//if this is the first card (i.e. card1 - null) assign the card
    if (card1.id === null) {
        card1.source = thisSrc;
        card1.id = thisId;

        //if this is the 2nd card (i.e. card1 is assigned, and card2 is null), assign card2  
    } else if (card1.id !== null && card2.id === null && thisId !== card1.id) {

        card2.source = thisSrc;
        card2.id = thisId;
        $(".cards").unbind();

        //now if both cards are assigned, you can check if cards match
        if (card1.source === card2.source) {

            //match the cards, hide them and check finish
            $("#" + card2.id).animate({
                left: cards[card1.id].x + 10,
                top: cards[card1.id].y + 10
            }, 500, function() {
                $("#" + card1.id + ", " + "#" + card2.id).fadeOut(500, function() {
                    isFinished() ? celebrate() : "";
                });
                initCards();
            });
        }//end if
        restoreCards();
    }
}

function restoreCards() {
    //after time interval, restore cards
    setTimeout(function() {
        initCards();
        $(".card-back").show();
        $(".card-image").hide();
        initCardNavigation();
    }, 1000);
}

function initCards() {
    card1.id = null;
    card2.id = null;
}

/**Function: copies the original positions array shuffles the coords
 * assigns the shuffled coords back to the cards object and assigns the css
 * @returns void
 */
function shuffleCards() {

    var numCrds = packs.currentPack.numImgs;

    //make the correct sized copy of the array and shuffle the coords
    shuffledPositions = positions.slice(0, numCrds);
    shuffle(shuffledPositions);
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
            x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
}

/**Function: animation to show a card deck dealing cards to the card layout div
 * shows a css created deck image
 * runs a string created code to provide the animated dealing sequence
 * when done, a callback function hides the deck, and shows the shuffled cards
 * @returns void
 */
function dealCards() {

    var dealSpeed = 200;//ms

    //renew the cards
    initCards();
    restoreCards();

    //create the packed deck on the card layout
    createDeck(packs.currentPack.numImgs);
    $(".deck").hide();
    setTimeout(function() {
        $(".deck").show();
    }, 500);

    //run the dealing animation
    setTimeout(function() {
        eval(createDealingCode(packs.currentPack.numImgs, dealSpeed));
    }, 1000);

}
/*function to run after dealing cards is done
 - show the cards and set up the navigation */
function dealCallback() {
    $(".deck").hide();
    $(".cards").show();
    initCardNavigation();
    initRefreshBackNavigation();
}

function createDeck(numCrds) {

    var packImg = packs.currentPack.imgSrc;
    var packColor = packs.currentPack.color;

    //remove the old deck
    $(".deck").remove();

    var x = 50;
    var y = 60;
    var offset = 1;
    //create the card deck, i.e. grouped cards
    for (var i = 0; i < numCrds; i++) {
        $("#card-layout")
                .append($("<div>").addClass("deck")
                .css({left: x, top: y}).attr("id", "deck" + i)
                .css("background-color", packColor)
                .css("background-image", "url(" + packImg + ")")
                );
        x += offset;
        y += offset;
    }
}

function createDealingCode(numCrds, dealSpeed) {

    var code = "";

    //create animate loop code
    for (var i = numCrds - 1; i >= 0; i--) {
        var crdId = "'#deck" + i + "'";
        code += "$(" + crdId + ").animate({left: positions[" + i + "].x, top: positions[" + i + "].y}, " + dealSpeed + ", function() {";
    }
    //add the callback
    code += "dealCallback();";
    //end the script
    for (var i = 0; i < numCrds; i++) {
        code += "});";
    }
    return code;
}


function isFinished() {
    var cards = $("#card-layout").children(".cards:visible");
    if (cards.length === 0) {
        return true;
    }
    return false;
}

function celebrate() {
    //change background, message and play sound
    $(".cards").hide();
    $("#background").fadeIn(500);
    $.ionSound.play(packs.currentPack.sounds[0]);
    var message = messages[Math.floor((Math.random() * messages.length))];
    drawText(512, 100, 70, message);

    //show the image and animate
    images[packs.currentPack.name].show();
    tweens[packs.currentPack.name].play();
    $("#container").show();
}

function getPacks() {

    $.ajax({
        type: "GET",
        url: "./include/get_packs.php",
        datatype: "json",
        cache: false
    }).done(function(result) {

        var jsonObj = $.parseJSON(result);

        //assign the positions to the global object
        positions = jsonObj.positions;

        /*for each pack, place the packs data in the defined packs object,
         and create the menu items */
        var jsonPacks = jsonObj.packs;
        var i = 0;
        $.each(jsonPacks, function(idx, pack) {

            var packImage = new Image();
            packImage = "img/" + idx + ".png";
            var objectImage = "objects/" + idx + ".png";
            var background = "img/" + idx + "_bg.png";

            packs[idx] = {};
            packs[idx].name = idx;
            packs[idx].imgSrc = packImage;
            packs[idx].numImgs = pack.count;
            packs[idx].images = pack.images;
            packs[idx].background = background;
            packs[idx].sounds = [idx];
            packs[idx].color = packColors[i];
            packs[idx].object = objectImage;
            //packs[idx].coords = eval(idx + "Obj");

            //draw and save the images and animations
            drawImage(eval(idx));

            createMenuItem(idx, packImage, pack.count, packColors[i]);
            i++;
        });
        initPageNavigation();
    });
}
/**Function: creates the html pack item to show on the menu
 * @param {string} pack: the name of the pack
 * @param {string} packImg: the source of the image (card back)
 * @returns void
 */
function createMenuItem(packName, packImg, packCount, packColor) {
    //create the menu item for each pack
    $("#memory-menu")
            .append($("<div>").addClass("pack")
            .append($("<div>").addClass("packImg").addClass("nav")
            .css("background-image", "url(" + packImg + ")")
            .css("background-color", packColor))
            .append($("<p>").addClass("pack-type").html(packName))
            .append($("<p>").addClass("pack-count").html(packCount + " cards")
            ));
}

/**Function: creates the html for the cards on the card layout
 * - uses the assigned global for the selected current pack and shuffled positions
 * @returns void
 */
function createCardLayout() {

    var packImg = packs.currentPack.imgSrc;
    var packColor = packs.currentPack.color;

    //for each image in the current pack, and create the cards layout
    var i = 0;
    $.each(packs.currentPack.images, function(idx, imageSrc) {

        cards[idx] = {};

        $("#card-layout")
                .append($("<div>").addClass("cards")
                .attr("id", idx)
                .css({left: shuffledPositions[i].x, top: shuffledPositions[i].y})
                .css("background-image", "url(" + packImg + ")")
                .css("background-color", packColor)
                .append($("<img>").addClass("card-image")
                .attr("src", imageSrc)
                ));

        //assign the positions to the card object, so the cards can be found
        cards[idx].x = shuffledPositions[i].x;
        cards[idx].y = shuffledPositions[i].y;

        i++;
    });
}

function initSounds() {

    $.ionSound({
        sounds: [packs.currentPack.sounds],
        path: "sounds/",
        volume: "1.0",
        multiplay: true
    });
}