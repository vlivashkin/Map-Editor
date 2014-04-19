<?php
/**
 * File: saveObject.php
 * Author: Sergey Shilin
 * Date: 19.04.14
 * Time: 4:16
 */

    require_once('User.php');
    require_once('SQLConfig.php');
    $user = new User();
    if ($user->isLoggedIn() && isset($_POST['object']) && isset($_POST['layer_id'])) {
        $mysqli = new mysqli(SQLConfig::SERVERNAME, SQLConfig::USER, SQLConfig::PASSWORD, SQLConfig::DATABASE);
        //        folder id should be written into session
        $query = "INSERT INTO `layers` VALUES (null, '', '', 0, '".$user->getId()."', '".$_SESSION['folder_id']."')";
        $result = $mysqli->query($query);

        if($result === TRUE) {
            // That's OK. We can do everything
        }
    }

?>