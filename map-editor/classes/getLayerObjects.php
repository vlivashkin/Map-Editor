<?php
	require_once 'User.php';
	$user = new User();

	if($_GET && isset($_GET['layer']) && $user->isLoggedIn()) {
		$layer = $_GET['layer'];
		
		if(!is_numeric($layer))
			return;

		require_once('SQLConfig.php');
		$connect = new mysqli(SQLConfig::SERVERNAME, SQLConfig::USER, SQLConfig::PASSWORD, SQLConfig::DATABASE);
		$querystring = "SELECT o.json FROM objects o INNER JOIN layers l ON l.layer_id = o.layer_id WHERE l.owner_id = '".$user->getId()."' AND l.layer_id = '".$layer."'";
		$query = $connect->query($querystring);

		if ($num = $query->num_rows > 0) {
			$objects = array();
            while ($row = $query->fetch_assoc())
                array_push($objects, $row['json']);

            echo json_encode($objects);
        }

	}
?>