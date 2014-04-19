var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,

    streetViewControl: true,
    mapTypeControl: true,
    disableDefaultUI: true,
    overviewMapControl: true,

    mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT
    },

    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
};
var map;
var panoramio;

/**
 * Some useful functions
 */

/**
 * Function to get user layer id from the url string
 * like map.php?lid={id}
 * @returns {id}
 */
function getLayerId() {
    var id;
    return id;
}

/**
 * Save to DataBase functions
 */

function saveObjectToDB(object) {
    $.ajax({
        url: 'classes/saveObject.php',
        type: 'POST',
        data: {object: JSON.stringify(object, null, 2), layer_id: getLayerId()},
        dataType: "text"
    });
}
/**
 * Draw functions
 */

function addMarker(location, listener) {
    var marker = new google.maps.Marker({
        position: location,
        draggable: true,
        flat: false,
        map: map
    });

    saveObjectToDB(marker);

    // google.maps.event.addListener(marker, 'dragend', function(event){
    // 	marker.setPosition(event.latLng)
    // });
}

function drawPolyline(poly, location) {
    path = new google.maps.MVCArray();
    path = poly.getPath();
    path.insertAt(path.length, location);
    poly.setPath(path);
}

function drawPolygon(poly, location) {
    path = new google.maps.MVCArray();
    path = poly.getPath();
    path.insertAt(path.length, location);
    poly.setPath(path);
}

function drawRectangle(rectangle, location) {
    points = new google.maps.LatLngBounds;
    points = rectangle.getBounds().toString();
    console.log(points);
    // points.extend(location);
    // rectangle.setBounds(points);
}

/**
 * Listeners
 */

function listenPlaceMarkerButton() {
    $("#marker").click(function () {
        var listener = google.maps.event.addListenerOnce(map, 'click', function (event) {
            addMarker(event.latLng, listener);
        });
    });
}

function listenAddPolylineButton() {
    $("#polyline").click(function () {
        var options = {
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            editable: true,
            map: map
        };
        var poly = new google.maps.Polyline(options);
        poly.setMap(map);
        // google.maps.event.addListener(poly, 'click', function(event) {
        // 	// poly.setEditable(true);
        // });
        var listener = google.maps.event.addListener(map, 'click', function (event) {
            drawPolyline(poly, event.latLng);
        });
    });
}

function listenAddPolygonButton() {
    $("#polygon").click(function () {
        var options = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            editable: true,
            map: map
        };
        var poly = new google.maps.Polygon(options);
        poly.setMap(map);
        // google.maps.event.addListener(poly, 'click', function(event) {
        // 	// poly.setEditable(true);
        // });
        var listener = google.maps.event.addListener(map, 'click', function (event) {
            drawPolygon(poly, event.latLng);
        });
    });
}

function listenAddRectangleButton() {
    $("#rectangle").click(function () {
        var options = {
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            editable: true,
            map: map
        };
        var rec = new google.maps.Rectangle(options);
        rec.setMap(map);
        // google.maps.event.addListener(poly, 'click', function(event) {
        // 	// poly.setEditable(true);
        // });
        var listener = google.maps.event.addListener(map, 'click', function (event) {
            drawRectangle(rec, event.latLng);
        });
    });
}

function createListeners() {
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

    $("#edit").click(function () {
        if ($("#editing-panel").css("display").localeCompare("none"))
            $("#editing-panel").css("display", "none");
        else
            $("#editing-panel").css("display", "block");
    });

    listenPlaceMarkerButton();
    listenAddPolylineButton();
    listenAddPolygonButton();
    listenAddRectangleButton();

}

function initialize() {
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    panoramio = new google.maps.panoramio.PanoramioLayer();

    var menu = document.getElementById("menu-panel");
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(menu);

    createListeners();
}