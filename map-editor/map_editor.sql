-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Апр 19 2014 г., 02:31
-- Версия сервера: 5.5.35
-- Версия PHP: 5.4.4-14+deb7u7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `map_editor`
--

-- --------------------------------------------------------

--
-- Структура таблицы `folders`
--

CREATE TABLE IF NOT EXISTS `folders` (
  `folder_id` int(11) NOT NULL AUTO_INCREMENT,
  `folder_name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `owner_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `main` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`folder_id`),
  UNIQUE KEY `folder_id` (`folder_id`),
  KEY `owner_id` (`owner_id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `folders`
--

INSERT INTO `folders` (`folder_id`, `folder_name`, `description`, `public`, `owner_id`, `parent_id`, `main`) VALUES
(3, 'Folder 1', 'My first folder', 0, 3, 7, 0),
(4, 'Folder 2', 'My second folder', 0, 3, 7, 0),
(5, 'Sub Folder 1', 'My first sub folder', 0, 3, 3, 0),
(6, 'Sub Folder 1', 'My second sub folder', 0, 3, 4, 0),
(7, 'My Main Folder', 'List of my layers and folders is here', 0, 3, 0, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `layers`
--

CREATE TABLE IF NOT EXISTS `layers` (
  `layer_id` int(11) NOT NULL AUTO_INCREMENT,
  `layer_name` varchar(150) NOT NULL,
  `description` varchar(200) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `owner_id` int(11) NOT NULL,
  `folder_id` int(11) NOT NULL,
  PRIMARY KEY (`layer_id`),
  UNIQUE KEY `layer_id` (`layer_id`),
  KEY `folder_id` (`folder_id`),
  KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Дамп данных таблицы `layers`
--

INSERT INTO `layers` (`layer_id`, `layer_name`, `description`, `public`, `owner_id`, `folder_id`) VALUES
(2, 'Sublayer1', 'My first layer', 0, 3, 5),
(3, 'Sublayer2', 'My second layer', 0, 3, 3),
(4, 'Sublayer 3', 'My third layer', 0, 3, 3),
(5, 'Sublayer 2', 'Another layer', 0, 3, 6),
(6, 'Sublayer 5', 'Another layer', 0, 3, 4),
(7, 'Sublayer 6', 'Another layer', 0, 3, 4),
(9, 'Main Folder Layer', 'hello :)', 0, 3, 7);

-- --------------------------------------------------------

--
-- Структура таблицы `objects`
--

CREATE TABLE IF NOT EXISTS `objects` (
  `object_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `json` blob NOT NULL,
  `layer_id` int(11) NOT NULL,
  PRIMARY KEY (`object_id`),
  UNIQUE KEY `object_id` (`object_id`),
  KEY `layer_id` (`layer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Layer objects: markers, polylines, polygones, circles, rectangles and other' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `e-mail` varchar(100) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `fullname` text NOT NULL,
  `picture` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `e-mail`, `pass`, `fullname`, `picture`) VALUES
(1, 'snape@liceum8.ru', '5c924fd71a5cce07b5d332f4666e737b', 'Sergey Shilin', 0),
(2, 'illusionww@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Vladimir Ivashkin', 0),
(3, 'test@test.ru', '827ccb0eea8a706c4c34a16891f84e7b', 'TEST USER', 0);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`);

--
-- Ограничения внешнего ключа таблицы `layers`
--
ALTER TABLE `layers`
  ADD CONSTRAINT `layers_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `layers_ibfk_2` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`folder_id`);

--
-- Ограничения внешнего ключа таблицы `objects`
--
ALTER TABLE `objects`
  ADD CONSTRAINT `objects_ibfk_1` FOREIGN KEY (`layer_id`) REFERENCES `layers` (`layer_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
