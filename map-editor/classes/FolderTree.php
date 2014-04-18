<?php
	/**
	 * Folder Tree class
	 */
	
	class FolderTree {

		private $mainfoldername;
		private $mainfolderdesc;
		private $user_id;
		private $tree;
		private $connect;

		public function __construct() {
			if(isset($_SESSION['name']) && isset($_SESSION['password'])) {
				$this->connect = new mysqli("localhost", "root", "ohlnj8Etf0NJ04yy", "map_editor");
				$this->user_id = $this->connect->query("SELECT `user_id` FROM `users` WHERE `e-mail` = '".$_SESSION['name']."' AND `pass` = '".$_SESSION['password']."'")->fetch_array(MYSQLI_ASSOC)['user_id'];
				$result = $this->connect->query("SELECT folder_id, folder_name, description FROM folders WHERE main = '1' AND owner_id = '".$this->user_id."'");

				$folder = $result->fetch_array(MYSQLI_ASSOC);
				$this->mainfoldername = $folder['folder_name'];
				$this->mainfolderdesc = $folder['description'];
				$mainfolderID = $folder['folder_id'];

				$this->tree = array();

				$this->tree = $this->fillTree($mainfolderID);
			}
		}

		private function fillTree($parent) {
			$tree = array();
			$query = $this->connect->query("SELECT folder_id, folder_name, description FROM folders WHERE owner_id = '".$this->user_id."' AND parent_id = '".$parent."'");

			if($num = $query->num_rows > 0) {
				while ($row = $query->fetch_assoc())
					array_push($tree, ["f", $row['folder_id'], $row['folder_name'], $row['description'], $this->fillTree($row['folder_id'])]);
			}

			$query_layers = $this->connect->query("SELECT layer_id, layer_name, description FROM layers WHERE owner_id = '".$this->user_id."' AND folder_id = '".$parent."'");
			if($numl = $query_layers->num_rows > 0) {
				while ($row = $query_layers->fetch_assoc())
					array_push($tree, ["l", $row['layer_id'], $row['layer_name'], $row['description']]);
			}

			return $tree;
		}

		public function getFolderTree() {
			return $this->tree;
		}
	}
?>