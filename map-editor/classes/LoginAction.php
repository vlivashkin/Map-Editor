<?php

	class LoginAction {
		private $post;
		private $db_connect;

		public function __construct($post) {
			$this->post = $post;
			require_once('SQLConfig.php');
			$this->db_connect = (new SQLConfig())->connect();
		}

		public function signIn() {
			if($this->post) {
				$name = $this->post['email'];
				if(!get_magic_quotes_gpc())
					$password = md5($this->post['password']);
				else
					$password = md5(stripslashes($this->post['password']));


				$query = "SELECT * FROM `users` WHERE `e-mail` = '".$name."' AND `pass` = '".$password."'";
				$mysqli = new mysqli("localhost", "root", "ohlnj8Etf0NJ04yy", "map_editor");
				$result = $mysqli->query("SELECT 'Hello, dear MySQL user!' AS _message FROM DUAL");

				if($result->num_rows) {
					session_start();
					$_SESSION['name'] = $name;
					$_SESSION['password'] = $password;
					setcookie('name', $name, time()+ 86400 * 30 * 12);
					setcookie('pass', $password, time()+ 86400 * 30 * 12);
					return true;
				}
			}
			return false; 
		}
	}
?>

