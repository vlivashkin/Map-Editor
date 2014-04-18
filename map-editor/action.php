<?php
require_once("classes/LoginAction.php");
if ($_POST) {
    $signin = new LoginAction($_POST);
    if (isset($_POST['signin'])) {
        if ($signin->signIn())
            header('Location: home.php');
        else
            header('Location: index.php');
    }
} else
    header('Location: index.php');
?>