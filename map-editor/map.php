<!DOCTYPE html>
<html>
	<head>
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<meta http-equiv="content-type" content="text/html; charset=utf-8" /> 
		<link rel="StyleSheet" type="text/css" href="css/map.css" />		
		<link rel="stylesheet" href="css/bootstrap.min.css">

		<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&language=ru&libraries=places,panoramio," type="text/javascript"></script>
		<script src="js/map.js" type="text/javascript"></script>
		<script src="js/jquery.js" type="text/javascript"></script>
		<script src="js/bootstrap.min.js" type="text/javascript"></script>
		<title>Map</title>

	</head>
	<body onload="initialize()">
		<div id="editing-panel">
			<div class="btn-group" style="margin: 10px 0 0 0">
				<button id="marker" title="place a marker" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-map-marker"></span>
				</button>
			</div>
			<div class="btn-group">
				<button id="polyline" title="draw a polyline" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-flash"></span>
				</button>
			</div>
			<div class="btn-group">
				<button id="polygon" title="draw a polygon" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-stop"></span>
				</button>
			</div>
			<div class="btn-group">
				<button  id="rectangle" title="draw a rectangle" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-retweet"></span>
				</button>
			</div>
			<div class="btn-group">
				<button id="circle" title="draw a circle" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-certificate"></span>
				</button>
			</div>
			<div class="btn-group">
				<button id="description" title="add a description" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-comment"></span>
				</button>
			</div>
			<div class="btn-group">
				<button title="attach a photo" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-camera"></span>
				</button>
			</div>
			<hr>
			<div class="btn-group">
				<button title="calculate the distance" type="button" class="btn btn-warning">
				  <span class="glyphicon glyphicon-resize-horizontal"></span>
				</button>
			</div>
			<div class="btn-group">
				<button title="get point coordinates" type="button" class="btn btn-warning">
				  <span class="glyphicon glyphicon-screenshot"></span>
				</button>
			</div>
			<div class="btn-group">
				<button title="attach a photo" type="button" class="btn btn-warning">
				  <span class="glyphicon glyphicon-camera"></span>
				</button>
			</div>
			<!-- <hr>
			<div class="btn-group">
				<button id="marker" title="place a marker" type="button" class="btn btn-success">
				  <span class="glyphicon glyphicon-ok-circle"></span>
				</button>
			</div>
			<div class="btn-group">
				<button id="polyline" title="draw a polyline" type="button" class="btn btn-danger">
				  <span class="glyphicon glyphicon-remove-circle"></span>
				</button>
			</div> -->
		</div>

		<div id="menu-panel">
			<div class="btn-group">
				<button id="edit" type="button" class="btn btn-danger">
				  <span class="glyphicon glyphicon-pencil"></span>
				</button>
			</div>
			<div class="btn-group">
				<button id="panoramio" type="button" class="btn btn-primary">
				  <span class="glyphicon glyphicon-picture"></span>
				</button>
			</div>
			<div class="btn-group">
				<button id="zoom-out" type="button" class="btn btn-success">
				  <span class="glyphicon glyphicon-zoom-out"></span>
				</button>
				<button id="zoom-in" type="button" class="btn btn-success">
				  <span class="glyphicon glyphicon-zoom-in"></span>
				</button>
			</div>
		</div>
		<div id="map-canvas" />
	</body>
</html>	