var map;
var panoramio;
var drawingManager;
var menu, toolbar;

var figureList = {};
var selected = {};

var ctrlIsPressed = false;

var tools = [
    {name: "marker", class: google.maps.drawing.OverlayType.MARKER},
    {name: "polyline", class: google.maps.drawing.OverlayType.POLYLINE},
    {name: "polygon", class: google.maps.drawing.OverlayType.POLYGON},
    {name: "rectangle", class: google.maps.drawing.OverlayType.RECTANGLE},
    {name: "circle", class: google.maps.drawing.OverlayType.CIRCLE}
];

var selectedFigure = {
    editable: true,
    draggable: true,
    strokeOpacity: 1,
    fillOpacity: 0.30
};

var unselectedFigure = {
    editable: false,
    draggable: false,
    strokeOpacity: 0.7,
    fillOpacity: 0.20
};

var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,

    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    disableDefaultUI: true,
    overviewMapControl: true
};


/**
 * Function to operate with browser address string
 */

var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");

        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    } 
    return query_string;
} ();

/**
 * Function to get user layer id from the url string
 * like map.php?lid={id}
 * @returns {id}
 */
function getLayerId() {
    return QueryString.lid;
}

/**
 * Get user objects from database
 */

function displayObjectsFromDB() {
    if(getLayerId())
        $.ajax({
            url: 'classes/getLayerObjects.php',
            method: 'GET',
            dataType: 'json',
            data: {layer: getLayerId()},
            success: function(json) {
                console.log(json);
            }
        });
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

    menu = document.getElementById("signinbar");
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(menu);
    menu = document.getElementById("menubar");
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(menu);
    toolbar = document.getElementById("toolbar");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(toolbar);

    var defaultMarker = {
        draggable: true,
        zIndex: 2,
        flat: false
    };

    var defaultOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.20,
        clickable: false,
        draggable: false,
        zIndex: 1,
        editable: false
    };

    var defaultPolyline = jQuery.extend({}, defaultOptions);
    defaultPolyline.strokeWeight = 3;

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        markerOptions: defaultMarker,
        polylineOptions: defaultPolyline,
        polygonOptions: defaultOptions,
        rectangleOptions: defaultOptions,
        circleOptions: defaultOptions
    });
    drawingManager.setMap(map);

    var ctaLayer = new google.maps.KmlLayer({
        url: 'http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml'
    });
    ctaLayer.setMap(map);

    createListeners();
    displayObjectsFromDB();

    setTimeout(function() {
        $("#signinbar").show();
        $("#menubar").show();
        $("#toolbar").show();
    }, 300);
}

/**
 * Listeners
 */

function createListeners() {
    listenMenu();
    listenEsc();
    tools.forEach(listenToolBtn);
    listenFigureComplete();
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
    $(document).keydown(function (e) {
        if (e.keyCode == 17) {
            ctrlIsPressed = true;
        } else if (e.keyCode == 46) {
            delFigure();
        }
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            closeTool();
        } else if (e.keyCode == 17)
            ctrlIsPressed = false;
    });
    google.maps.event.addListener(map, 'click', function () {
        $("#dropdown-menu").hide();
        unselectAll();
    });
    google.maps.event.addListener(map, 'rightclick', function () {
        closeTool();
        $("#dropdown-menu").hide();
        unselectAll();
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
            unselectAll();
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

function listenFigureComplete() {
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        var figure = event.overlay;
        var toolName = event.type;

        tools.forEach(function (tool) {
            if (event.type == tool.class) {
                toolName = tool.class;
            }
        });

        google.maps.event.addListener(figure, "rightclick", function (event) {
            if (selected.length > 1) {
                if (selected.indexOf(figure) >= 0) {
                    showContextMenu(event.latLng, "this objects: " + selected.length);
                }
            } else {
                showContextMenu(event.latLng, toolName, figure.__gm_id);
            }
        });

        google.maps.event.addListener(figure, "drag", function (event) {
            console.log("position_changed");
        });

        google.maps.event.addListener(figure, "click", function () {
            if (!ctrlIsPressed) {
                unselectAll();
            }
            if (selected.indexOf(figure) >= 0) {
                unselectFigure(figure);
            } else {
                selectFigure(figure);
            }

        });

        figureList[figure.__gm_id] = figure;

        saveObjectToDB(toolName, figure);
    });
}

function delFigure(id) {
    if (arguments.length == 1 && id != undefined) {
        console.log(id);
        figureList[id].setMap(null);
    } else {
        selected.forEach(function (figure) {
            figure.setMap(null);
        })
    }
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

function selectFigure(figure) {
    figure.setOptions(selectedFigure);
    selected.push(figure);
}

function unselectFigure(figure) {
    figure.setOptions(unselectedFigure);
    selected.splice(selected.indexOf(figure), 1);
}

function unselectAll() {
    Object.keys(figureList).forEach(function (temp) {
        figureList[temp].setOptions(unselectedFigure);
    });
    selected = [];
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

/**
 * Context menu
 */

function showContextMenu(currentLatLng, name, id) {
    setMenuXY(currentLatLng);
    $("#dropdown-menu").show();
    var $dropdown = $('#dropdown-menu-a');
    $dropdown.text("Delete " + name);
    $dropdown.click(function () {
        delFigure(id);
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