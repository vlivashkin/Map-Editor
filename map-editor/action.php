<?php
require_once("classes/LoginAction.php");
if ($_POST) {
    $signin = new LoginAction($_POST);
    if (isset($_POST['signin'])) {
        if ($signin->signIn())
            echo "yes";
        else
            echo "no";
    }
} else
    header('Location: index.php');
?>