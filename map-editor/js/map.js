var map;
var panoramio;
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
        mapTypeIds: [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
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

    var menu = document.getElementById("menubar");
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(menu);

    createListeners();
}

/**
 * Listeners
 */

function createListeners() {
    listenMenu();

    listenEsc();

    listenToolBtn("marker");
    listenToolBtn("polyline");
    listenToolBtn("polygon");
    listenToolBtn("rectangle");
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
            removeListeners();
        }
    });
}

function listenToolBtn(btn) {
    var $btn = $("#" + btn);

    $btn.click(function () {
        if (!$btn.hasClass("btn-primary")) {
            var options = {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                clickable: false,
                editable: true,
                map: map
            };

            removeListeners();
            $btn.addClass("btn-primary");
            map.setOptions({draggableCursor: 'crosshair'});
            type = btn;

            switch (btn) {
                case "marker" :
                    google.maps.event.addListenerOnce(map, 'click', function (event) {
                        addMarker(event.latLng);
                    });
                    break;
                case "polyline" :
                    strokeOpacity = 1.0;
                    figure = new google.maps.Polyline(options);
                    figure.setMap(map);
                    google.maps.event.addListener(map, 'click', function (event) {
                        drawPath(event.latLng);
                    });
                    break;
                case "polygon" :
                    figure = new google.maps.Polygon(options);
                    figure.setMap(map);
                    google.maps.event.addListener(map, 'click', function (event) {
                        drawPath(event.latLng);
                    });
                    break;
                case "rectangle" :
                    var points = new google.maps.LatLngBounds();
                    figure = new google.maps.Rectangle(options);
                    figure.setMap(map);
                    google.maps.event.addListenerOnce(map, 'click', function (event) {
                        drawRect(event.latLng, points);
                    });
                    break;
            }
            google.maps.event.addListener(map, 'dblclick', function () {
                removeListeners();
            });
        } else {
            removeListeners();
        }
    });
}

function removeListeners() {
    $(".btn-tool").removeClass("btn-primary");
    google.maps.event.clearListeners(map, 'click');
    map.setOptions({draggableCursor: null});
    firstClick = false;

    if (figure != null) {
        saveObjectToDB(figure);
        figure = null;
    }
}

/**
 * Draw functions
 */

function addMarker(location) {
    figure = new google.maps.Marker({
        position: location,
        draggable: true,
        flat: false,
        map: map
    });
    removeListeners();
}

function drawPath(location) {
    path = new google.maps.MVCArray();
    path = figure.getPath();
    path.insertAt(path.length, location);
    figure.setPath(path);
}

function drawRect(location, points) {
    if (points.isEmpty()) {
        points.extend(location);
        figure.setBounds(points);
        google.maps.event.addListenerOnce(map, 'click', function (event) {
            drawRect(event.latLng, points);
        });
    } else {
        points.extend(location);
        figure.setBounds(points);
        removeListeners();
    }
}

/**
 * Save to DataBase functions
 */

function saveObjectToDB(object) {
    var obj = {'type': type};
    switch (type) {
        case "marker" :
            obj.points = object.getPosition();
            break;
        case "polyline" :
        case "polygon" :
            obj.points = object.getPath().j;
            break;
        case "rectangle" :
            obj.points = object.getBounds();
    }

    console.log(obj);

    $.ajax({
        url: 'classes/saveObjects.php',
        type: 'POST',
        data: {object: JSON.stringify(obj), layer_id: getLayerId()},
        dataType: 'json'
    });
}