<?php
	require_once 'SQLConfig.php';
	if ($_POST) {
		if($_FILE)
			echo "file";
		echo "only post";
		// $connect = new mysqli(SQLConfig::SERVERNAME, SQLConfig::USER, SQLConfig::PASSWORD, SQLConfig::DATABASE);
		// $querystring = "INSERT INTO objects VALUES ()";
		// $query = $connect->query($querystring);
	}
?>