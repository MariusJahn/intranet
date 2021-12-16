-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.5.8-MariaDB-1:10.5.8+maria~focal - mariadb.org binary distribution
-- Server Betriebssystem:        debian-linux-gnu
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Exportiere Datenbank Struktur für intranet
CREATE DATABASE IF NOT EXISTS `intranet` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `intranet`;

-- Exportiere Struktur von Tabelle intranet.abteilung
CREATE TABLE IF NOT EXISTS `abteilung` (
  `abteilungID` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`abteilungID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='Beschreibt eine Abteilung der Feuerwehr Gelsenkirchen';

-- Exportiere Daten aus Tabelle intranet.abteilung: ~7 rows (ungefähr)
/*!40000 ALTER TABLE `abteilung` DISABLE KEYS */;
INSERT INTO `abteilung` (`abteilungID`, `name`) VALUES
	(1, '37/1 Verwaltung - Finanzen'),
	(2, '37/2 Gefahrenabwehr - Rettungsdienst'),
	(3, '37/3 Brandschutz - Gefahrenschutz'),
	(4, '37/4 Technische Dienste'),
	(5, '37/5 Einsatzplanung u. -lenkung, Bevölkerungsschutz'),
	(6, 'Stb Schule (Schüler)'),
	(7, 'Stb Schule (Lehrbeauftragter)');
/*!40000 ALTER TABLE `abteilung` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.dokument
CREATE TABLE IF NOT EXISTS `dokument` (
  `documentID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL DEFAULT '0',
  `validity` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `creationDate` datetime NOT NULL,
  `alterationDate` datetime NOT NULL,
  `parent` varchar(50) DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `binaryData` mediumblob NOT NULL,
  PRIMARY KEY (`documentID`) USING BTREE,
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8 COMMENT='Beschreibt ein ganzes Dokument';

-- Exportiere Daten aus Tabelle intranet.dokument: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `dokument` DISABLE KEYS */;
INSERT INTO `dokument` (`documentID`, `title`, `validity`, `creationDate`, `alterationDate`, `parent`, `category`, `binaryData`) VALUES
/*!40000 ALTER TABLE `dokument` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.mitarbeiter
CREATE TABLE IF NOT EXISTS `mitarbeiter` (
  `MitarbeiterID` int(11) NOT NULL AUTO_INCREMENT,
  `Benutzername` varchar(40) NOT NULL,
  `Passwort` char(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Email` varchar(40) DEFAULT NULL,
  `Vorname` varchar(40) DEFAULT NULL,
  `Nachname` varchar(40) DEFAULT NULL,
  `Telefon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MitarbeiterID`),
  UNIQUE KEY `Benutzername` (`Benutzername`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COMMENT='Beschreibt einen User bzw. Mitarbeiter. Wird von Active Directory gemappt.';

-- Exportiere Daten aus Tabelle intranet.mitarbeiter: ~3 rows (ungefähr)
/*!40000 ALTER TABLE `mitarbeiter` DISABLE KEYS */;
INSERT INTO `mitarbeiter` (`MitarbeiterID`, `Benutzername`, `Passwort`, `Email`, `Vorname`, `Nachname`, `Telefon`) VALUES
	(32, 'Admin', '$2a$10$yUjoEXDs7MD2ls1itDctneJ.5sM7dKKEcXiPtQfIMOrZLqcuBi.em', 'Admin123@gelsenkirchen.de', 'Admin', 'Admin', '999999'),
	(33, 'DanielTest1', '$2a$10$iUTCt7nrzcQEck8BHSlGt.r7CzscyQTghQKN4Pvs1kJ7KmyBalwyO', 'DanielTest1@gelsenkirchen.de', 'Daniel', 'Knecht', '012345'),
	(34, 'TestUser2', '$2a$10$Z.v7wIZgkLzQokqu9yg6CO3caxIgfje1eUNUbT.osOj6Upc3tzmlS', 'TestUser2', 'TestUser2', 'TestUser2', '213123123');
/*!40000 ALTER TABLE `mitarbeiter` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.mitarbeiter_abteilung
CREATE TABLE IF NOT EXISTS `mitarbeiter_abteilung` (
  `mitarbeiterID` int(11) NOT NULL,
  `abteilungID` smallint(6) NOT NULL,
  PRIMARY KEY (`mitarbeiterID`,`abteilungID`),
  KEY `mitarbeiterID` (`mitarbeiterID`),
  KEY `abteilungID` (`abteilungID`),
  CONSTRAINT `FK_mitarbeiter_abteilung_abteilung` FOREIGN KEY (`abteilungID`) REFERENCES `abteilung` (`abteilungID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_mitarbeiter_abteilung_mitarbeiter` FOREIGN KEY (`mitarbeiterID`) REFERENCES `mitarbeiter` (`MitarbeiterID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.mitarbeiter_abteilung: ~12 rows (ungefähr)
/*!40000 ALTER TABLE `mitarbeiter_abteilung` DISABLE KEYS */;
INSERT INTO `mitarbeiter_abteilung` (`mitarbeiterID`, `abteilungID`) VALUES
	(32, 1),
	(32, 2),
	(32, 3),
	(32, 4),
	(32, 5),
	(32, 6),
	(32, 7),
	(33, 1),
	(33, 3),
	(33, 4),
	(33, 5),
	(34, 3);
/*!40000 ALTER TABLE `mitarbeiter_abteilung` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.mitarbeiter_rollen
CREATE TABLE IF NOT EXISTS `mitarbeiter_rollen` (
  `MitarbeiterID` int(11) NOT NULL,
  `roleID` int(11) NOT NULL,
  PRIMARY KEY (`MitarbeiterID`,`roleID`),
  KEY `FK_mitarbeiter_rollen_rollen` (`roleID`),
  KEY `MitarbeiterID` (`MitarbeiterID`),
  CONSTRAINT `FK_mitarbeiter_rollen_mitarbeiter` FOREIGN KEY (`MitarbeiterID`) REFERENCES `mitarbeiter` (`MitarbeiterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_mitarbeiter_rollen_rollen` FOREIGN KEY (`roleID`) REFERENCES `rollen` (`roleID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportiere Daten aus Tabelle intranet.mitarbeiter_rollen: ~3 rows (ungefähr)
/*!40000 ALTER TABLE `mitarbeiter_rollen` DISABLE KEYS */;
INSERT INTO `mitarbeiter_rollen` (`MitarbeiterID`, `roleID`) VALUES
	(32, 78),
	(33, 86),
	(34, 111);
/*!40000 ALTER TABLE `mitarbeiter_rollen` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.newsfeed
CREATE TABLE IF NOT EXISTS `newsfeed` (
  `newsfeedID` smallint(6) NOT NULL AUTO_INCREMENT,
  `author` varchar(50) DEFAULT NULL,
  `createdDate` varchar(50) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `descriptiontext` varchar(1000) NOT NULL,
  `wholeEntry` varchar(4000) DEFAULT NULL,
  `pictureDataUrl` varchar(150) DEFAULT NULL,
  `showWholeEntry` tinyint(1) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`newsfeedID`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.newsfeed: ~7 rows (ungefähr)
/*!40000 ALTER TABLE `newsfeed` DISABLE KEYS */;
INSERT INTO `newsfeed` (`newsfeedID`, `author`, `createdDate`, `title`, `descriptiontext`, `wholeEntry`, `pictureDataUrl`, `showWholeEntry`) VALUES
	(109, 'Admin Admin', '24.01.2021, 15:04', 'Test', 'Test', 'testtesttest', '', 1),
	(110, 'Daniel Knecht', '26.01.2021, 16:25', 'T', 'T', NULL, '', 0),
	(111, 'Daniel Knecht', '26.01.2021, 16:25', 'T', 'T', NULL, '', 0),
	(112, 'Daniel Knecht', '26.01.2021, 16:25', 'T', 'T', NULL, '', 0),
	(113, 'Daniel Knecht', '26.01.2021, 16:25', 'T', 'T', NULL, '', 0),
	(118, 'Admin Admin', '29.01.2021, 10:54', 'Brand an der Neidenburger Straße 43', 'An der Westfälischen Hochschule hat es ein Feuer gegeben. Zum Glück wurde niemand verletzt.... bis auf die Prüfungen', 'Dies ist ein Beispieleintrag um die Weiterlesenfunktion zu demonstrieren.', 'http://localhost:3001/newsfeed/image_1611914075048_firefighter-2679283_1920.jpg', 1),
	(119, 'Admin Admin', '29.01.2021, 10:56', 'Die neuen Azubis sind da!', 'Die neuen Auszubildenden haben nun ihre Ausbildung in Gelsenkirchen angefangen.', NULL, 'http://localhost:3001/newsfeed/image_1611914163264_woman-fire-fighter-958266_1920.jpg', 0),
	(127, 'Admin Admin', '30.01.2021, 17:45', 'Es gibt eine neue Dienstliche Anweisung!', '', '', '', 0);
/*!40000 ALTER TABLE `newsfeed` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.quicklinks
CREATE TABLE IF NOT EXISTS `quicklinks` (
  `quicklinkID` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `href` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`quicklinkID`) USING BTREE,
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `href` (`href`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.quicklinks: ~1 rows (ungefähr)
/*!40000 ALTER TABLE `quicklinks` DISABLE KEYS */;
INSERT INTO `quicklinks` (`quicklinkID`, `name`, `href`) VALUES
	(29, 'Stadt Gelsenkirchen', 'https://www.gelsenkirchen.de/de/default.aspx');
/*!40000 ALTER TABLE `quicklinks` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.rechte
CREATE TABLE IF NOT EXISTS `rechte` (
  `rightID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  PRIMARY KEY (`rightID`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.rechte: ~5 rows (ungefähr)
/*!40000 ALTER TABLE `rechte` DISABLE KEYS */;
INSERT INTO `rechte` (`rightID`, `name`, `description`) VALUES
	(8, 'newsfeed_rights', 'Das Recht den Newsfeed zu verwalten'),
	(9, 'quicklinks_rights', 'Das Recht die Quicklinks zu verwalten'),
	(10, 'usermanagement_rights', 'Das Recht Benutzer zu verwalten'),
	(11, 'documanagement_rights', 'Das Recht Dokumente zu verwalten'),
	(12, 'rolesandrights_rights', 'Das Recht Rollen und Rechte zu verwalten');
/*!40000 ALTER TABLE `rechte` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.rollen
CREATE TABLE IF NOT EXISTS `rollen` (
  `roleID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`roleID`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8 COMMENT='Beschreibt eine funktionale Rolle im Intranet';

-- Exportiere Daten aus Tabelle intranet.rollen: ~4 rows (ungefähr)
/*!40000 ALTER TABLE `rollen` DISABLE KEYS */;
INSERT INTO `rollen` (`roleID`, `name`, `description`) VALUES
	(78, 'Admin', 'Administrator der Anwendung'),
	(86, 'Newsfeed_Rolle', 'Rolle Newsfeed zu verwalten'),
	(91, 'Standard Rolle', 'Rolle des StandartUsers'),
	(111, 'Standard_Mitarbeiter', 'Ein Mitarbeiter ohne weitere Rechte');
/*!40000 ALTER TABLE `rollen` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.rollen_rechte
CREATE TABLE IF NOT EXISTS `rollen_rechte` (
  `roleID` int(11) NOT NULL DEFAULT 0,
  `rightID` int(11) NOT NULL DEFAULT 0,
  `allowRead` tinyint(1) NOT NULL DEFAULT 0,
  `allowWrite` tinyint(1) NOT NULL DEFAULT 0,
  `allowExecute` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`roleID`,`rightID`),
  KEY `FK_rollen_rechte_rechte` (`rightID`),
  KEY `roleID` (`roleID`),
  CONSTRAINT `FK_rollen_rechte_rechte` FOREIGN KEY (`rightID`) REFERENCES `rechte` (`rightID`) ON DELETE CASCADE,
  CONSTRAINT `FK_rollen_rechte_rollen` FOREIGN KEY (`roleID`) REFERENCES `rollen` (`roleID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Zugewiesene Rechte an Rollen';

-- Exportiere Daten aus Tabelle intranet.rollen_rechte: ~14 rows (ungefähr)
/*!40000 ALTER TABLE `rollen_rechte` DISABLE KEYS */;
INSERT INTO `rollen_rechte` (`roleID`, `rightID`, `allowRead`, `allowWrite`, `allowExecute`) VALUES
	(78, 8, 1, 1, 1),
	(78, 9, 1, 1, 1),
	(78, 10, 1, 1, 1),
	(78, 11, 1, 1, 1),
	(78, 12, 1, 1, 1),
	(86, 8, 1, 1, 1),
	(91, 8, 1, 1, 1),
	(91, 9, 1, 1, 1),
	(91, 11, 1, 1, 1),
	(111, 8, 0, 0, 0),
	(111, 9, 0, 0, 0),
	(111, 10, 0, 0, 0),
	(111, 11, 0, 0, 0),
	(111, 12, 0, 0, 0);
/*!40000 ALTER TABLE `rollen_rechte` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;