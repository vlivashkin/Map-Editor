var map;
var panoramio;
var drawingManager;
var menu;

var figureList = {};

var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,

    streetViewControl: true,
    mapTypeControl: true,
    disableDefaultUI: true,
    overviewMapControl: true,

    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
};

/**
 * Function to get user layer id from the url string
 * like map.php?lid={id}
 * @returns {id}
 */
function getLayerId() {
    var id;
    return id;
}

function initialize() {
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    panoramio = new google.maps.panoramio.PanoramioLayer();

    menu = document.getElementById("menubar");
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(menu);

    var options = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.25,
        clickable: false,
        zIndex: 1,
        editable: true
    }

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        markerOptions: {
            draggable: true,
            zIndex: 2,
            flat: false
        },
        polylineOptions: options,
        polygonOptions: options,
        rectangleOptions: options,
        circleOptions: options
    });
    drawingManager.setMap(map);

    createListeners();
}

/**
 * Listeners
 */

function createListeners() {
    listenMenu();
    listenEsc();

    var tools = [
        {name: "marker", class: google.maps.drawing.OverlayType.MARKER},
        {name: "polyline", class: google.maps.drawing.OverlayType.POLYLINE},
        {name: "polygon", class: google.maps.drawing.OverlayType.POLYGON},
        {name: "rectangle", class: google.maps.drawing.OverlayType.RECTANGLE},
        {name: "circle", class: google.maps.drawing.OverlayType.CIRCLE}
    ];

    tools.forEach(listenToolBtn);

    listenComplete();
}

function listenMenu() {
    $("#zoom-in").click(function () {
        map.setZoom(map.getZoom() + 1);
    });
    $("#zoom-out").click(function () {
        map.setZoom(map.getZoom() - 1);
    });
    $("#panoramio").click(function () {
        if (panoramio.getMap() != null)
            panoramio.setMap(null);
        else
            panoramio.setMap(map);
    });
    $("#toolBtn").click(function () {
        $("#toolbar").toggle();
    });
}

function listenEsc() {
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            closeTool();
        }
    });
    google.maps.event.addListener(map, 'click', function () {
        $("#dropdown-menu").hide();
    });
    google.maps.event.addListener(map, 'rightclick', function () {
        closeTool();
    });
}

function listenToolBtn(tool) {
    var $btn = $("#" + tool.name);

    $btn.click(function () {
        if (!$btn.hasClass("btn-primary")) {
            closeTool();
            drawingManager.setOptions({
                drawingMode: tool.class
            });
            $btn.addClass("btn-primary");
        } else {
            closeTool();
        }
    });
}

function closeTool() {
    drawingManager.setOptions({
        drawingMode: null
    });
    $(".btn-tool").removeClass("btn-primary");
    $("#dropdown-menu").hide();
}

function listenComplete() {
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        var marker = event.overlay;
        var type = event.type;

        if (type == google.maps.drawing.OverlayType.MARKER) {
            google.maps.event.addListener(marker, "rightclick", function (event) {
                showContextMenu(event.latLng, marker.__gm_id, "Delete marker");
            });
        } else if (type == google.maps.drawing.OverlayType.POLYLINE || type == google.maps.drawing.OverlayType.POLYGON) {
            google.maps.event.addListener(marker, "insert_at", function (event) {
                console.log(marker.__gm_id + " insert_at");
                console.log(marker.getPath().getArray());
            });
            google.maps.event.addListener(marker, "remove_at", function (event) {
                console.log(marker.__gm_id + " remove_at");
                console.log(marker.getPath().getArray());
            });
            google.maps.event.addListener(marker, "set_at", function (event) {
                console.log(marker.__gm_id + " set_at: ");
                console.log(marker.getPath().getArray());
            });
        } else if (type == google.maps.drawing.OverlayType.RECTANGLE) {
            google.maps.event.addListener(marker, "bounds_changed", function () {
                console.log(marker.__gm_id + " bounds_changed:");
                console.log(marker.getBounds());
            });
        } else if (type == google.maps.drawing.OverlayType.CIRCLE) {
            google.maps.event.addListener(marker, "radius_changed", function () {
                console.log(marker.__gm_id + " radius_changed:");
                console.log(marker.getRadius());
            });
            google.maps.event.addListener(marker, "center_changed", function () {
                console.log(marker.__gm_id + " center_changed:");
                console.log(marker.getCenter());
            });
        }

        id = marker.__gm_id;
        figureList[id] = marker;

        saveObjectToDB(type, marker);
    });
}
/**
 * Save to DataBase functions
 */

function saveObjectToDB(type, marker) {
    var object = {
        id: marker.__gm_id,
        type: type
    };
    if (type == google.maps.drawing.OverlayType.MARKER) {
        object.position = marker.getPosition();
    } else if (type == google.maps.drawing.OverlayType.POLYLINE || type == google.maps.drawing.OverlayType.POLYGON) {
        object.path = marker.getPath().getArray();
    } else if (type == google.maps.drawing.OverlayType.RECTANGLE) {
        object.bounds = marker.getBounds();
    } else if (type == google.maps.drawing.OverlayType.CIRCLE) {
        object.center = marker.getCenter();
        object.radius = marker.getRadius();
    }

    console.log(object);

    $.ajax({
        url: 'classes/saveObjects.php',
        type: 'POST',
        data: {object: JSON.stringify(object), layer_id: getLayerId()},
        dataType: 'json'
    });
}

var delMarker = function (id) {
    var marker = figureList[id];
    marker.setMap(null);
}

/**
 * Context menu
 */

function showContextMenu(currentLatLng, id, text) {
    setMenuXY(currentLatLng);
    $("#dropdown-menu").show();
    $("#dropdown-menu-a").text(text);
    $("#dropdown-menu-a").click(function() {
        delMarker(id);
        $("#dropdown-menu").hide();
    });
}

function getCanvasXY(currentLatLng) {
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );
    var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    var worldCoordinate = map.getProjection().fromLatLngToPoint(currentLatLng);
    var currentLatLngOffset = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    return currentLatLngOffset;
}

function setMenuXY(currentLatLng) {
    var mapWidth = $('#map_canvas').width();
    var mapHeight = $('#map_canvas').height();
    var menuWidth = $('.contextmenu').width();
    var menuHeight = $('.contextmenu').height();
    var clickedPosition = getCanvasXY(currentLatLng);
    var x = clickedPosition.x;
    var y = clickedPosition.y;

    if ((mapWidth - x ) < menuWidth)//if to close to the map border, decrease x position
        x = x - menuWidth;
    if ((mapHeight - y ) < menuHeight)//if to close to the map border, decrease y position
        y = y - menuHeight;

    $('#dropdown-menu').css('left', x);
    $('#dropdown-menu').css('top', y);
};