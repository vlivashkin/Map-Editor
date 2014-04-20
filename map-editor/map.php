<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <link rel="StyleSheet" type="text/css" href="css/map.css"/>
    <link rel="stylesheet" href="css/bootstrap.min.css">

    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&language=ru&libraries=places,panoramio,drawing"
            type="text/javascript"></script>
    <script src="js/map.js" type="text/javascript"></script>
    <script src="js/jquery.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/sessionstorage.js" type="text/javascript"></script>
    <title>Map</title>

</head>
<body onload="initialize()">
<div id="toolbar">
    <div style="margin: 10px 0 -10px 0">
        <p>
            <button id="marker" title="place a marker" type="button"
                    class="btn btn-tool glyphicon glyphicon-map-marker"></button>
        </p>
        <p>
            <button id="polyline" title="draw a polyline" type="button"
                    class="btn btn-tool glyphicon glyphicon-flash"></button>
        </p>
        <p>
            <button id="polygon" title="draw a polygon" type="button"
                    class="btn btn-tool glyphicon glyphicon-stop"></button>
        </p>
        <p>
            <button id="rectangle" title="draw a rectangle" type="button"
                    class="btn btn-tool glyphicon glyphicon-retweet"></button>
        </p>
        <p>
            <button id="circle" title="draw a circle" type="button"
                    class="btn btn-tool glyphicon glyphicon-certificate"></button>
        </p>
        <p>
            <button disabled="disabled" id="description" title="add a description" type="button"
                    class="btn btn-tool glyphicon glyphicon-comment"></button>
        </p>
        <p>
            <button disabled="disabled" id="photo" title="attach a photo" type="button"
                    class="btn btn-tool glyphicon glyphicon-camera"></button>
    </div>
    <hr>
    <div style="margin: -10px 0 0 0">
        <p>
            <button disabled="disabled" title="calculate the distance" type="button"
                    class="btn btn-warning glyphicon glyphicon-resize-horizontal"></button>
        </p>
        <p>
            <button disabled="disabled" title="get point coordinates" type="button"
                    class="btn btn-warning glyphicon glyphicon-screenshot"></button>
        </p>
        <p>
            <button disabled="disabled" title="attach a photo" type="button"
                    class="btn btn-warning glyphicon glyphicon-camera"></button>
        </p>
    </div>
</div>

<div id="menubar">
    <button id="toolBtn" type="button" class="btn btn-danger glyphicon glyphicon-pencil"></button>
    <button id="panoramio" type="button" class="btn btn-primary glyphicon glyphicon-picture"></button>
    <div class="btn-group">
        <button id="zoom-out" type="button" class="btn btn-success glyphicon glyphicon-zoom-out"></button>
        <button id="zoom-in" type="button" class="btn btn-success glyphicon glyphicon-zoom-in"></button>
    </div>
</div>
<div id="map-canvas"></div>
</body>
</html>	