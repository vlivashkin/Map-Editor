var map;
var panoramio;
var drawingManager;
var menu;

var figureList = {};

var tools = [
    {name: "marker", class: google.maps.drawing.OverlayType.MARKER},
    {name: "polyline", class: google.maps.drawing.OverlayType.POLYLINE},
    {name: "polygon", class: google.maps.drawing.OverlayType.POLYGON},
    {name: "rectangle", class: google.maps.drawing.OverlayType.RECTANGLE},
    {name: "circle", class: google.maps.drawing.OverlayType.CIRCLE}
];

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
    var id = 9;
    return id;
}

/**
 * Sign in function
 */
function signIn() {
    $.ajax({
        url: 'action.php',
        type: 'POST',
        data: {signin: true, email: $("#mail-field").val(), password: $("#pass-field").val()},
        success: function(data) {
            if(data.length == 4)
                location.reload();
        }
    });
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
        draggable: false,
        zIndex: 1,
        editable: false
    };

    var optionsPolyline = jQuery.extend({}, options);
    optionsPolyline.strokeWeight = 3;

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        markerOptions: {
            draggable: true,
            zIndex: 2,
            flat: false
        },
        polylineOptions: optionsPolyline,
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
    $("#sign-in").click(function () {
        signIn();
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
        setEditableAll(false);
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
            setEditableAll(false);
            setClickableAll(false);
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
    setClickableAll(true);
}

function listenComplete() {
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        var figure = event.overlay;
        var type = event.type;

        tools.forEach(function (tool) {
            if (type == tool.class)
                google.maps.event.addListener(figure, "rightclick", function (event) {
                    showContextMenu(event.latLng, figure.__gm_id, tool.name);
                });
        });

        google.maps.event.addListener(figure, "click", function () {
            setEditableAll(false);
            figure.setOptions({
                editable: true,
                draggable: true
            });
        });

        id = figure.__gm_id;
        figureList[id] = figure;

        saveObjectToDB(type, figure);
    });
}
/**
 * Save to DataBase functions
 */

function saveObjectToDB(type, figure) {
    var object = {
        id: figure.__gm_id,
        type: type
    };
    if (type == google.maps.drawing.OverlayType.MARKER) {
        object.position = figure.getPosition();
    } else if (type == google.maps.drawing.OverlayType.POLYLINE || type == google.maps.drawing.OverlayType.POLYGON) {
        object.path = figure.getPath().getArray();
    } else if (type == google.maps.drawing.OverlayType.RECTANGLE) {
        object.bounds = figure.getBounds();
    } else if (type == google.maps.drawing.OverlayType.CIRCLE) {
        object.center = figure.getCenter();
        object.radius = figure.getRadius();
    }

    console.log(JSON.stringify(object));

    $.ajax({
        url: 'classes/saveObjects.php',
        type: 'POST',
        data: {object: JSON.stringify(object), layer_id: getLayerId()},
        dataType: 'json',
        success: function (data) {
            console.log(data);
        }
    });
}

function delMarker(id) {
    var marker = figureList[id];
    marker.setMap(null);
}

/**
 * Context menu
 */

function showContextMenu(currentLatLng, id, name) {
    setMenuXY(currentLatLng);
    $("#dropdown-menu").show();
    var $dropdown = $('#dropdown-menu-a');
    $dropdown.text("Delete " + name);
    $dropdown.click(function () {
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
    return new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
}

function setMenuXY(currentLatLng) {
    var clickedPosition = getCanvasXY(currentLatLng);

    var $dropdown = $('#dropdown-menu');
    $dropdown.css('left', clickedPosition.x);
    $dropdown.css('top', clickedPosition.y);
}

function setClickableAll(clickable) {
    if (arguments.length == 0)
        clickable = true;
    Object.keys(figureList).forEach(function (temp) {
        figureList[temp].setOptions({
            clickable: clickable
        });
    });
}

function setEditableAll(editable) {
    if (arguments.length == 0)
        editable = true;
    Object.keys(figureList).forEach(function (temp) {
        figureList[temp].setOptions({
            editable: editable,
            draggable: editable
        });
    });
}