<?php
require_once("classes/User.php");
$user = new User();
if (!$user->isLoggedIn())
    header('Location: index.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/main.css">
    <script src="js/jquery.js" type="text/javascript"></script>
    <script src="js/bootstrap.min.js" type="text/javascript"></script>
    <script src="js/main.js" type="text/javascript"></script>

    <title>Map Editor</title>
</head>
<body>

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="index.php">Map Planner</a>
        </div>

    </div>
</div>
<div id="folder-tree">
    <h2>Your folders</h2>
    <ul class="tree">
        <?php
        require_once('classes/FolderTree.php');
        $tree = (new FolderTree())->getFolderTree();
        drawTree($tree, $user->getId());

        function drawTree($elem, $uid)
        {
            for ($i = 0; $i < count($elem); $i++) {
                echo "<li>";
                if ($elem[$i][0] == 'l') {
                    echo "<a href='map.php?uid=" . $uid . "&lid=" . $elem[$i][1] . "'>";
                } else
                    echo "<a href='#'>";

                echo $elem[$i][2] . "</a>";
                if (count($elem[$i][4]) > 0) {
                    echo "<ul>";
                    drawTree($elem[$i][4], $uid);
                    echo "</ul>";
                }
                echo "</li>";
            }
        }

        ?>
    </ul>
    <script type="text/javascript">
        //<![CDATA[
        $(function () {
            $('.tree').liHarmonica({
                onlyOne: false,
                speed: 500
            });
        });
        //]]>
    </script>

</div>
</body>
</html>