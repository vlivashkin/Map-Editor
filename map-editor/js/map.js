var map;
var panoramio;
var drawingManager;
var menu;

var id = 0;
var figureList = [];
var type;
var figure;

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
}

function listenComplete() {
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        var object = {
            id: id++,
            type: event.type
        };
        if (event.type == google.maps.drawing.OverlayType.MARKER) {
            object.position = {
                lat: event.overlay.getPosition().lat(),
                lng: event.overlay.getPosition().lng()
            }
        } else if (event.type == google.maps.drawing.OverlayType.POLYLINE) {
            object.path = event.overlay.getPath().getArray();
        } else if (event.type == google.maps.drawing.OverlayType.POLYGON) {
            object.path = event.overlay.getPath().getArray();
        } else if (event.type == google.maps.drawing.OverlayType.RECTANGLE) {
            object.bounds = {
                north: event.overlay.getBounds().getNorthEast().lat(),
                east: event.overlay.getBounds().getNorthEast().lng(),
                south: event.overlay.getBounds().getSouthWest().lat(),
                west: event.overlay.getBounds().getSouthWest().lng()
            }
        } else if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
            object.center = {
                lat: event.overlay.getCenter().lat(),
                lng: event.overlay.getCenter().lng()
            }
            object.radius = event.overlay.getRadius();
        }
        console.log(object);

        figureList.push({
            id: object.id,
            type: object.type,
            object: event.overlay
        });

        saveObjectToDB(object);
    });
}
/**
 * Save to DataBase functions
 */

function saveObjectToDB(object) {
    $.ajax({
        url: 'classes/saveObjects.php',
        type: 'POST',
        data: {object: JSON.stringify(object), layer_id: getLayerId()},
        dataType: 'json'
    });
}