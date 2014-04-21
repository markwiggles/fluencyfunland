
var hotspot = {
    name: null,
    path: null,
    objects: {},
    positions: []
};


var farm = {name: "farm", path: "img/farm/"};
farm.positions = [
    {posX: 820, posY: 440},
    {posX: 650, posY: 500},
    {posX: 100, posY: 500},
    {posX: 420, posY: 500},
    {posX: 700, posY: 440},
    {posX: 800, posY: 300},
    {posX: 20, posY: 340},
    {posX: 600, posY: 300},
    {posX: 280, posY: 480},
    {posX: 700, posY: 300}
];

farm.objects = {
    bird: {name: "bird", picAdj: 0.3},
    farmer: {name: "farmer", picAdj: 1},
    cow: {name: "cow", picAdj: 0.8},
    duck: {name: "duck", picAdj: 0.4},
    chicken: {name: "chicken", picAdj: 0.5},
    scarecrow: {name: "scarecrow", picAdj: 1},
    goat: {name: "goat", picAdj: .8},
    guineapig: {name: "guineapig", picAdj: 0.4},
    kitten: {name: "kitten", picAdj: 0.5},
    rabbit: {name: "rabbit", picAdj: 0.3}
};

var park = {name: "park", path: "img/park/"};

park.positions = [
    {posX: 820, posY: 520},
    {posX: 320, posY: 230},
    {posX: 180, posY: 520},
    {posX: 500, posY: 300},
    {posX: 200, posY: 240},
    {posX: 500, posY: 500}
];

park.objects = {
    ball: {name: "ball", picAdj: 1.1},
    bicycle: {name: "bicycle", picAdj: 1.3},
    dog: {name: "dog", picAdj: 1.1},
    football: {name: "football", picAdj: 0.6},
    picnic: {name: "picnic", picAdj: 1.7},
    running: {name: "running", picAdj: 1.7},
    fountain: {name: "fountain", picAdj: 1.6, posX: 10, posY: 250},
    slide: {name: "slide", picAdj: 3, posX: 700, posY: 220},
    swings: {name: "swings", picAdj: 3, posX: 830, posY: 170}
};

getPacks();

function addObjParams(objects) {
    $.each(objects, function(objName, object) {

        object.imgName = objName;
        object.imgSrc = hotspot.path + objName + ".png";
        object.scale = 0.1;
        object.scaleTo = 1;
        object.duration = 0.5;
        object.easing = "Linear";
        object.callback = function() {
            tweenCallback(tweens[objName], objName);
        };
    });
}

function getPacks() {

    $.ajax({
        type: "GET",
        url: "./include/get_packs.php",
        datatype: "json",
        cache: false
    }).done(function(result) {

        var jsonObj = $.parseJSON(result);


        /*for each pack, place the packs data in the defined packs object,
         and create the menu items */
        var jsonPacks = jsonObj.packs;

        $.each(jsonPacks, function(idx, pack) {

            var packImage = new Image();
            var packBg = new Image();
            packImage = "img/" + idx + ".png";
            packBg = "img/" + idx + "/background.png";

            //create the menu items
            $("#hotspots-menu")
                    .append($("<div>")
                    .addClass("menu-item")
                    .append($("<img>")
                    .attr("src", packImage)
                    .addClass("nav")).append($("<p>").html(idx))
                    );
            //create the backgrounds            
            $("#hotspots-layout")
                    .append($("<img>")
                    .addClass("background")
                    .attr("src", packBg)
                    .attr("id", idx));
        });

        initPageNavigation();
    });
}

function initPageNavigation() {

    //initialise the navigatiion for the menu item
    $(".nav").unbind().on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        //assign the selected theme
        var theme = $(this).next().html();
        hotspot = eval(theme);

        //show the selected background, objects, and init the large images and sounds
        $("#" + hotspot.name).show();
        $("#dark-bg").fadeIn(2000);

        addObjParams(farm.objects);
        addObjParams(park.objects);
        initPositions();
        drawObjects();
        createImages();
        initObjects();
        initSounds();

        //show the hotspot layout
        $("#hotspots-menu").hide();
        $("#hotspots-layout").show();
        $("#back, #refresh").show();
    });

    $("#back").unbind().on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        imgLayer.remove();
        imgLayer.draw();

        imgLayer.remove();
        imgLayer.draw();

        initStage();
        initLayers();

        initPositions();
        drawObjects();
        createImages();
        initObjects();
        initSounds();

        //show the hotspot menu
        $("#hotspots-menu").show();
        $("#hotspots-layout, .background, #dark-bg").hide();
        $("#back, #refresh").hide();
    });

    $("#refresh").unbind().on('mousedown touchstart', function(event) {
        event.stopPropagation();
        event.preventDefault();

        imgLayer.remove();
        imgLayer.draw();

        initStage();
        initLayers();

        initPositions();
        drawObjects();
        createImages();
        initObjects();
        initSounds();
    });
}

function initPositions() {

    shuffle(hotspot.positions);
    var i = 0;
    $.each(hotspot.objects, function(idx, object) {
        if (idx !== "swings" && idx !== "slide" && idx !== "fountain") {
            object.posX = hotspot.positions[i].posX;
            object.posY = hotspot.positions[i].posY;
        }
        i++;
    });
}

function drawObjects() {

    //remove previous objects
    $("#hotspots-layout .objects").remove();

    $.each(hotspot.objects, function(idx, object) {

        //adjust the image height so the objects look realistic
        var divHt = 150 * object.picAdj;
        var divWd = 150 * object.picAdj;

        //adjust the perspective size according to the y coord
        var divHt = Math.round(divHt * object.posY / 680 * 1.5);
        var divWd = Math.round(divWd * object.posY / 680 * 1.5);

        //adjust coords for smaller dimensions than original div
        var x = object.posX + (150 - divWd);
        var y = object.posY + (150 - divHt);
        var zIndex = Math.round(y);

        $("#hotspots-layout")
                .append($("<div>").addClass("objects")
                .css({height: divHt, width: divWd})
                .attr("id", object.name)
                .css({left: x, top: y})
                .css("zIndex", zIndex)
                .append($("<img>")
                .attr("src", hotspot.path + object.name + "_s.png")
                .addClass("objImage")
                .attr("id", object.name + "_s"))
                .append($("<img>")
                .attr("src", hotspot.path + object.name + "_g.png")
                .addClass("objGlow")
                .attr("id", object.name + "_g"))
                );
    });
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
            x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
}



