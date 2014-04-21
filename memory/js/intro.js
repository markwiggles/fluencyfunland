



var intro = (function() {
    $("#pointer").show();
    $("#pointer").animate({left: 220, top: 290}, 1500, function() {
        $("#card1 img").show();
        $("#pointer").animate({left: 390, top: 290}, 2000, function() {
            $("#card2 img").show();
            restore();
            $("#pointer").animate({left: 550, top: 290}, 2000, function() {
                $("#card3 img").show();
                $("#pointer").animate({left: 550, top: 290}, 1000, function() {
                    $("#card3 img").show();
                    $("#pointer").animate({left: 220, top: 290}, 1000, function() {
                        $("#card1 img").show();
                        $("#card3").animate({left: 230, top: 300}, 1000, function() {
                            $("#card1,#card3").fadeOut(1500);
                            $("#pointer").hide();
                            $(".show-intro").fadeOut(500, function() {
                                $("#memory-menu").fadeIn(1000);
                            });
                        });
                    });
                });
            });
        });
    });
});

/* show intro on load */
intro();

function restore() {
    setTimeout(function() {
        $(".cardIntro img").hide();
        initCardNavigation();
    }, 1500);
}
