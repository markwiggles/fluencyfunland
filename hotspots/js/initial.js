
var hotspot = {
    name: null,
    path: null,
    objects: {},
    positions: []
};


var farm = {name: "farm", path: "img/farm/"};
farm.positions = [
    {x: 820, y: 440},
    {x: 650, y: 500},
    {x: 100, y: 500},
    {x: 420, y: 500},
    {x: 700, y: 440},
    {x: 800, y: 300},
    {x: 0, y: 360},
    {x: 600, y: 300},
    {x: 280, y: 520},
    {x: 700, y: 300}
];

farm.objects = {
    bird: {name: "bird", scale: 0.3},
    farmer: {name: "farmer", scale: 1},
    cow: {name: "cow", scale: 0.8},
    duck: {name: "duck", scale: 0.4},
    chicken: {name: "chicken", scale: 0.5},
    scarecrow: {name: "scarecrow", scale: 1},
    goat: {name: "goat", scale: .8},
    guineapig: {name: "guineapig", scale: 0.4},
    kitten: {name: "kitten", scale: 0.5},
    rabbit: {name: "rabbit", scale: 0.3}
};
var underwater = {name: "underwater", path: "img/underwater/"};
underwater.objects = {
    turtle: {name: "turtle", scale: 1},
    frog: {name: "frog", scale: 1}
};

//assign object
hotspot = farm;

initBackground(hotspot);
$("#background").show();
initPositions();
drawObjects();
$("#dark-bg").fadeIn(2000);


function initBackground(hotspot) {
    $("#background").attr("src", hotspot.path + "background.png");
}

/** Function
 * 
 * @returns {undefined}
 */
function initPositions() {

    shuffle(hotspot.positions);

    var i = 0;
    $.each(hotspot.objects, function(idx, object) {
        object.x = hotspot.positions[i].x;
        object.y = hotspot.positions[i].y;
        i++;
    });

}

function drawObjects() {

    $.each(hotspot.objects, function(idx, object) {

        //adjust the image height
        var divHt = 150 * object.scale;
        var divWd = 150 * object.scale;

        //adjust the perspective size according to the y coord
        var divHt = divHt * object.y / 680 * 1.5;
        var divWd = divWd * object.y / 680 * 1.5;
        // * object.y/680 * 2;


        //adjust coords for smaller dimaensions than original div
        var x = object.x + (150 - divWd);
        var y = object.y + (150 - divHt);
        var zIndex = Math.round(y);

        $("#hotspots-layout")
                .append($("<div>").addClass("objects")
                .css({height: divHt, width: divWd})
                .attr("id", object.name)
                .css({left: x, top: y})
                .css("zIndex",zIndex)
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