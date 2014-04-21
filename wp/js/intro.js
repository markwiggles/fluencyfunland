/* 
 This script to run first to show the theme menu
 */

//globals
var themes = {};
var currentTheme = null;
var currentObject = null;
var flickrSets = {};
var images = {};
var tweens = {};


displayThemeMenu();

/** Collect the theme names by looking through the theme folders
 * - create the theme menu items for navigation
 * - add the sprite stylesheets
 * - when done, call the function to init theme navigation
 * @returns void
 */
function displayThemeMenu() {
    
    $("#theme-menu").addClass("loading");
    
    $.ajax({
        type: "GET",
        url: "./include/get_themes.php",
        datatype: "json",
        cache: false
    }).done(function(result) {
        //loop through the names: display the navigation and add sprite images
        var themeNames = $.parseJSON(result);

        themeNames["custom"] = "";
        $.each(themeNames, function(themeName, objects) {

            //create the theme object
            themes[themeName] = {
                name: themeName,
                objects: {}
            };

            $("#theme-menu").append($("<img>")
                    .attr("src", "img/thumbs/" + themeName + ".png")
                    .attr("alt", themeName)
                    .addClass("nav")
                    );
            themeName !== "custom" ? addSpriteStylesheet(themeName) : "";
            themeName !== "custom" ? createThemeBackground(themeName) : "";

            $.each(objects, function(idx, object) {
                themes[themeName].objects[object] = {};
            });
        });

        initThemeNavigation();
        setObjectParams(themeNames);
        
    });//end ajax
}

/**Initialise the events for the items on the theme menu
 * @returns void
 */
function initThemeNavigation() {

    //initialise the wp thumbs event to assign theme and display selected background and sprites
    $(".nav").mousedown(function(event) {
        event.stopPropagation();
        event.preventDefault();
        
        $("#col1, #col2").addClass("loading");

        currentTheme = $(this).attr("alt");
        currentObject = currentTheme;

        imgLayer.getChildren().hide();
        imgLayer.draw();

        // show the theme as text on the image
        var posX = $("#container").width() / 2;
        var posY = 100;
        var size = 70;
        var message = currentTheme;
        drawText(posX, posY, size, message);

        $("#container, #col1, #col2, #back").show();
        $("#showTextMsg").hide();
        $("#theme-menu").hide();

        //if this is the first time selected, create the object backgrounds
        if ($("#image-div").children("." + currentTheme).length === 0) {
            createObjectBackgrounds();
        }

        //for custom show page with the sets and navigation to each set
        if (currentTheme === "custom") {
            showCustomPage();
        } else {
            //show background and object images 
            $("#" + currentTheme + "_bg").show();
            displayThemeSpriteImages();
        }
    });
}

function addSpriteStylesheet(theme) {
    $(document.head).append(
            "<link rel='stylesheet' type='text/css' href='themes/" + theme + "/sprites.css'/>"
            );
}
/** Create the html for each background theme (one each), which is hidden until selected 
 * @returns {undefined}
 */
function createThemeBackground(theme) {

    var themeBgSrc = "themes/" + theme + "/backgrounds/" + theme + "_bg.png";
    $("#image-div")
            .append($("<img>")
                    .addClass("theme-bg")
                    .attr("src", themeBgSrc)
                    .attr("id", theme + "_bg")
                    .attr("alt", theme)
                    );
}


//function to init and assign object co-ords and scale
function setObjectParams(themeNames) {

    themes.beach.objects.beachball = {posX: 300, posY: 250, scale: 1, rotation: 10,
        movX: 20, movY: 70, scaleTo: 1, duration: 2, easing: "BounceEaseOut"};
    themes.beach.objects.bucket = {posX: 200, posY: 300, scale: 1,
        movX: 10, movY: 0, scaleTo: 1.1, duration: 1, easing: "StrongEaseInOut"};
    themes.beach.objects.crab = {posX: 300, posY: 300, scale: 0.9,
        movX: 30, movY: 0, scaleTo: 0.9, duration: 1, easing: "EaseOut"};
    themes.beach.objects.jellyfish = {posX: 300, posY: 100, scale: 1,
        movX: 30, movY: -40, scaleTo: 1, duration: 2, easing: "EaseInOut"};
    themes.beach.objects.lifeguard = {posX: 300, posY: 200, scale: 1.1,
        movX: -20, movY: 0, scaleTo: 1.1, duration: 2, easing: "Linear"};
    themes.beach.objects.sandcastle = {posX: 350, posY: 450, scale: 0.1,
        movX: 0, movY: -100, scaleTo: 1, duration: 4, easing: "StrongEaseInOut"};
    themes.beach.objects.seagull = {posX: 200, posY: 100, scale: 0.7, rotation: 5,
        movX: -100, movY: 50, scaleTo: 0.8, duration: 2, easing: "EaseInOut"};
    themes.beach.objects.seashell = {posX: 400, posY: 280, scale: 0.4,
        movX: 0, movY: 20, scaleTo: 1.1, duration: 2, easing: "Linear"};
    themes.beach.objects.towel = {posX: 100, posY: 350, scale: 0,
        movX: 00, movY: 0, scaleTo: 1.2, duration: 1, easing: "StrongEaseInOut"};
    themes.beach.objects.umbrella = {posX: 80, posY: -40, scale: 1,
        movX: 10, movY: 20, scaleTo: 1, duration: 1, easing: "StrongEaseInOut"};

    themes.home.objects.backyard = {posX: 100, posY: 0, scale: 0.88,
        movX: 0, movY: 0, scaleTo: 0.9, duration: 1, easing: "Linear"};
    themes.home.objects.bath = {posX: 100, posY: 200, scale: .99,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.home.objects.bed = {posX: 80, posY: 250, scale: .99,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.home.objects.fridge = {posX: 200, posY: 20, scale: 0.97,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.home.objects.lounge = {posX: 190, posY: 170, scale: 0.99,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.home.objects.oven = {posX: 100, posY: 200, scale: 0.9,
        movX: 0, movY: 0, scaleTo: 0.92, duration: 1, easing: "Linear"};
    themes.home.objects.parents = {posX: 270, posY: 250, scale: 0.9,
        movX: 0, movY: 20, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.home.objects.toilet = {posX: 280, posY: 180, scale: 0.99,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.home.objects.tv = {posX: 280, posY: 60, scale: .99,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.home.objects.washing_machine = {posX: 400, posY: 160, scale: 0.98,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};

    themes.farm.objects.chicken = {posX: 675, posY: 420, scale: 0.8,
        movX: -20, movY: 0, scaleTo: 0.8, duration: 1, easing: "EaseInOut"};
    themes.farm.objects.cow = {posX: 350, posY: 350, scale: 1,
        movX: -20, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.farm.objects.duck = {posX: 540, posY: 380, scale: 1,
        movX: -20, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.farm.objects.farmer = {posX: 600, posY: 380, scale: 0.97,
        movX: 0, movY: 5, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.farm.objects.horse = {posX: 260, posY: 150, scale: 1,
        movX: -20, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.farm.objects.goat = {posX: 380, posY: 340, scale: 1,
        movX: 20, movY: 0, scaleTo: 1, duration: 1, easing: "EaseInOut"};
    themes.farm.objects.pig = {posX: 350, posY: 380, scale: 1,
        movX: 20, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.farm.objects.scarecrow = {posX: 300, posY: 280, scale: 1,
        movX: 0, movY: 0, scaleTo: 1.2, duration: 1, easing: "EaseInOut"};
    themes.farm.objects.sheep = {posX: 350, posY: 370, scale: 1,
        movX: -20, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.farm.objects.tractor = {posX: 230, posY: 250, scale: 0.98,
        movX: -20, movY: 10, scaleTo: 1, duration: 1, easing: "Linear"};

    themes.pets.objects.bird = {posX: 180, posY: 390, scale: 1,
        movX: 20, movY: 0, scaleTo: 1, duration: 1, easing: "EaseInOut"};
    themes.pets.objects.goldfish = {posX: 280, posY: 280, scale: 1,
        movX: -30, movY: 0, scaleTo: 1, duration: 2, easing: "Linear"};
    themes.pets.objects.guineapig = {posX: 290, posY: 200, scale: 1,
        movX: -20, movY: 0, scaleTo: 1, duration: 4, easing: "Linear"};
    themes.pets.objects.hermitcrab = {posX: 310, posY: 290, scale: 1,
        movX: 20, movY: 0, scaleTo: 1, duration: 4, easing: "Linear"};
    themes.pets.objects.kitten = {posX: 430, posY: 370, scale: 0.95,
        movX: 0, movY: 0, scaleTo: 1, duration: 4, easing: "Linear"};
    themes.pets.objects.lamb = {posX: 430, posY: 270, scale: 1,
        movX: 20, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.pets.objects.mouse = {posX: 420, posY: 220, scale: 1,
        movX: 0, movY: -20, scaleTo: 1, duration: 4, easing: "Linear"};
    themes.pets.objects.puppy = {posX: 385, posY: 280, scale: 1, rotation: -3,
        movX: -5, movY: 10, scaleTo: 1, duration: 1, easing: "EaseInOut"};
    themes.pets.objects.rabbit = {posX: 290, posY: 270, scale: 1,
        movX: 10, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.pets.objects.turtle = {posX: 390, posY: 251, scale: 1, rotation: 3,
        movX: 10, movY: 0, scaleTo: 1, duration: 2, easing: "Linear"};

    themes.picnic.objects.ants = {posX: 180, posY: 320, scale: 1,
        movX: 50, movY: 0, scaleTo: 1, duration: 2, easing: "EaseInOut"};
    themes.picnic.objects.bbq = {posX: 180, posY: 320, scale: 0,
        movX: 50, movY: 0, scaleTo: 0, duration: 2, easing: "EaseInOut"};
    themes.picnic.objects.boomerang = {posX: 270, posY: 150, scale: 1, rotation: 360,
        movX: -200, movY: 0, scaleTo: 0.8, duration: 2, easing: "Linear"};
    themes.picnic.objects.park_bench = {posX: 80, posY: 30, scale: 0.9,
        movX: 0, movY: 0, scaleTo: 0.9, duration: 1, easing: "Linear"};
    themes.picnic.objects.picnic_basket = {posX: 120, posY: 320, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 4, easing: "Linear"};
    themes.picnic.objects.picnic_blanket = {posX: 240, posY: 260, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 4, easing: "Linear"};
    themes.picnic.objects.tennisball = {posX: 380, posY: 210, scale: 1,rotation: 90,
        movX: -130, movY: 20, scaleTo: 1, duration: 2, easing: "Linear"};
    
    themes.playground.objects.slide = {posX: 200, posY: 50, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.playground.objects.swings = {posX: 150, posY: 130, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.playground.objects.trampoline = {posX: 230, posY: 120, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.playground.objects.tunnel = {posX: 260, posY: 150, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};

    themes.school.objects.blackboard = {posX: 240, posY: 80, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.school.objects.lunchbox = {posX: 320, posY: 170, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.school.objects.pencils = {posX: 530, posY: 400, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.school.objects.singing = {posX: 230, posY: 200, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};

    themes.shops.objects.icecream_truck = {posX: 40, posY: 180, scale: 1,rotation: -4,
        movX: -200, movY: 100, scaleTo: 1, duration: 4, easing: "EaseIn"};
    themes.shops.objects.money = {posX: 250, posY: 90, scale: 1.1,
        movX: 0, movY: 0, scaleTo: 1.1, duration: 1, easing: "Linear"};
    themes.shops.objects.vegetables = {posX: 190, posY: 265, scale: 0,
        movX: 0, movY: 0, scaleTo: 0, duration: 4, easing: "Linear"};

    themes.sport.objects.basketball = {posX: 320, posY: 130, scale: 1,
        movX: 0, movY: -20, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.sport.objects.cricket = {posX: 200, posY: 290, scale: 1,
        movX: 0, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};
    themes.sport.objects.football = {posX: 500, posY: 500, scale: 0.5,rotation: 180,
        movX: -100, movY: -440, scaleTo: 0.1, duration: 2, easing: "EaseInOut"};
    themes.sport.objects.gymnastics = {posX: 280, posY: 120, scale: 1,
        movX: 10, movY: 0, scaleTo: 1, duration: 2, easing: "Linear"};
    themes.sport.objects.netball = {posX: 300, posY: 100, scale: 1,
        movX: 10, movY: -20, scaleTo: 1, duration: 1, easing: "EaseIn"};
    themes.sport.objects.soccer = {posX: 230, posY: 250, scale: 1,
        movX: 10, movY: 10, scaleTo: 1.1, duration: 1, easing: "Linear"};
    themes.sport.objects.tennis = {posX: 100, posY: 230, scale: 1,
        movX: 10, movY: 0, scaleTo: 1, duration: 1, easing: "Linear"};

    themes.transport.objects.bicycle = {posX: 360, posY: 220, scale: 1, rotation: 5,
        movX: 55, movY: 15, scaleTo: 1, duration: 1, easing: "EaseOut"};
    themes.transport.objects.bus = {posX: 380, posY: 270, scale: 1, rotation: -2,
        movX: -40, movY: 0, scaleTo: 1, duration: 2, easing: "Linear"};
    themes.transport.objects.car = {posX: 50, posY: 90, scale: .4, rotation: -3,
        movX: -40, movY: 30, scaleTo: .4, duration: 2, easing: "Linear"};
    themes.transport.objects.motorcycle = {posX: 390, posY: 370, scale: 1,
        movX: -50, movY: 0, scaleTo: 1, duration: 2, easing: "EaseInOut"};
    themes.transport.objects.plane = {posX: 40, posY: 170, scale: .4,
        movX: 100, movY: 0, scaleTo: 1, duration: 2, easing: "Linear"};
    themes.transport.objects.rocket = {posX: 100, posY: 380,
        movX: 700, movY: -230, scale: 1, scaleTo: 0, duration: 4, easing: "EaseOut", };
    themes.transport.objects.scooter = {posX: 220, posY: 150, scale: 0.96,
        movX: -60, movY: 10, scaleTo: 1, duration: 2, easing: "EaseOut"};
    themes.transport.objects.ship = {posX: 200, posY: 280, scale: 0.9, rotation: -5,
        movX: 80, movY: 0, scaleTo: 1, duration: 2, easing: "Linear"};
    themes.transport.objects.train = {posX: 260, posY: 230, scale: 1.17,
        movX: -5, movY: 10, scaleTo: 1.18, duration: 1, easing: "Linear"};
    themes.transport.objects.tram = {posX: 120, posY: 180, scale: 1.2,
        movX: -150, movY: 0, scaleTo: 1.2, duration: 3, easing: "EaseOut"};

    $.each(themeNames, function(themeName, objects) {
        $.each(objects, function(idx, object) {
            themes[themeName].objects[object].imgName = object;
            themes[themeName].objects[object].imgSrc = "themes/" + themeName
                    + "/objects/" + object + ".png";
            themes[themeName].objects[object].callback = function() {
            };
            drawImage(themes[themeName].objects[object]);
        });
    });
}



