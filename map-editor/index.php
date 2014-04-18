<?php 
        require_once("classes/User.php");
        $user = new User();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
        <head>
        	<meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
                <meta http-equiv="content-type" content="text/html; charset=utf-8" /> 
                <link rel="stylesheet" href="css/bootstrap.min.css">
                <link rel="stylesheet" href="css/main.css">
                <script src="js/bootstrap.min.js"></script>

        	<title>Map Editor</title>
        </head>
        <body>

                <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
                        <div class="container">
                                <div class="navbar-header">
                                        <a class="navbar-brand" href="#">Map Planner</a>
                                </div>
                                <?php
                                        if(!$user->isLoggedIn()) {
                                ?>
                                <div class="navbar-collapse collapse">
                                        <form class="navbar-form navbar-right" role="form" method="post" action="action.php">
                                                <div class="form-group">
                                                        <input type="text" name="email" placeholder="Email" class="form-control">
                                                </div>
                                                <div class="form-group">
                                                        <input type="password" name="password" placeholder="Password" class="form-control">
                                                </div>
                                                <button type="submit" name="signin" class="btn btn-success">Sign in</button>
                                        </form>
                                </div>
                                <?php 
                                        } else {
                                ?>

                                
                                <?php
                                        }
                                ?>
                        </div>
                </div>

                <div class="jumbotron">
                        <div class="container">
                                <h1>Welcome!</h1>
                                <p>Plan your doings with your own map! It is easy to try map editing. Just sign in and draw your
                                        map objects. Show imagination and have fun!
                                </p>
                                <p><a href="map.php" class="btn btn-primary btn-lg" role="button">Try it! &raquo;</a></p>
                        </div>
                </div>

                <div class="container">
                        <div class="row">
                                <div class="col-md-4">
                                        <h2>Simple editing</h2>
                                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
                                        <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
                                </div>
                                <div class="col-md-4">
                                        <h2>Traveling</h2>
                                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
                                        <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
                                </div>
                                <div class="col-md-4">
                                        <h2>Another one</h2>
                                        <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
                                        <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
                                </div>
                        </div>

                        <hr>

                        <footer>
                                <p>&copy; Company 2014</p>
                        </footer>
                </div>
        </body>
</html>