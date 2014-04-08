/**Function to display (to console) the coords of the mouse when clicked
 * @returns void
 */
function displayPosition(elementId) {
    $("#"+ elementId).mousedown(function(e) {
        var pos = findPos(this);
        x = e.pageX - pos.x;
        y = e.pageY - pos.y;
        var coordinateDisplay = x + " , " + y;
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


