-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.3.15-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Exportiere Datenbank Struktur für intranet
CREATE DATABASE IF NOT EXISTS `intranet` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `intranet`;

-- Exportiere Struktur von Tabelle intranet.abteilung
CREATE TABLE IF NOT EXISTS `abteilung` (
  `AbteilungID` smallint(6) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`AbteilungID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Beschreibt eine Abteilung der Feuerwehr Gelsenkirchen';

-- Exportiere Daten aus Tabelle intranet.abteilung: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `abteilung` DISABLE KEYS */;
/*!40000 ALTER TABLE `abteilung` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.berechtigung
CREATE TABLE IF NOT EXISTS `berechtigung` (
  `BerechtigungID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Beschreibung` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`BerechtigungID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Beschreibt eine Berechtigung. Bei Erhalt ist die Erlaubnis für eine Funktion gegeben.';

-- Exportiere Daten aus Tabelle intranet.berechtigung: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `berechtigung` DISABLE KEYS */;
/*!40000 ALTER TABLE `berechtigung` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.dokument
CREATE TABLE IF NOT EXISTS `dokument` (
  `documentID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL DEFAULT '0',
  `validity` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `creationDate` datetime NOT NULL,
  `alterationDate` datetime NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `category` varchar(50) NOT NULL,
  `binaryData` mediumblob NOT NULL,
  PRIMARY KEY (`documentID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COMMENT='Beschreibt ein ganzes Dokument';

-- Exportiere Daten aus Tabelle intranet.dokument: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `dokument` DISABLE KEYS */;
/*!40000 ALTER TABLE `dokument` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.mitarbeiter
CREATE TABLE IF NOT EXISTS `mitarbeiter` (
  `MitarbeiterID` int(11) NOT NULL AUTO_INCREMENT,
  `Benutzername` varchar(40) NOT NULL,
  `Passwort` char(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Email` varchar(40) DEFAULT NULL,
  `Vorname` varchar(40) DEFAULT NULL,
  `Nachname` varchar(40) DEFAULT NULL,
  `Abteilung` varchar(50) DEFAULT NULL,
  `Telefon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MitarbeiterID`),
  UNIQUE KEY `Benutzername` (`Benutzername`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Beschreibt einen User bzw. Mitarbeiter. Wird von Active Directory gemappt.';

-- Exportiere Daten aus Tabelle intranet.mitarbeiter: ~2 rows (ungefähr)
/*!40000 ALTER TABLE `mitarbeiter` DISABLE KEYS */;
INSERT INTO `mitarbeiter` (`MitarbeiterID`, `Benutzername`, `Passwort`, `Email`, `Vorname`, `Nachname`, `Abteilung`, `Telefon`) VALUES
	(2, 'Administrator', '$2a$10$TCPP71XIShtsF8hq4O6Rj.S0QkrAay7h6JsP4AbgK0wgtEAjvDm/q', 'Administrator@web.de', 'Administrator', 'Administrator', '', '');
/*!40000 ALTER TABLE `mitarbeiter` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.mitarbeiter_abteilung
CREATE TABLE IF NOT EXISTS `mitarbeiter_abteilung` (
  `mitarbeiterID` int(11) NOT NULL,
  `abteilungID` smallint(6) NOT NULL,
  PRIMARY KEY (`mitarbeiterID`,`abteilungID`),
  KEY `mitarbeiterID` (`mitarbeiterID`),
  KEY `abteilungID` (`abteilungID`),
  CONSTRAINT `FK_mitarbeiter_abteilung_abteilung` FOREIGN KEY (`abteilungID`) REFERENCES `abteilung` (`AbteilungID`),
  CONSTRAINT `FK_mitarbeiter_abteilung_mitarbeiter` FOREIGN KEY (`mitarbeiterID`) REFERENCES `mitarbeiter` (`MitarbeiterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.mitarbeiter_abteilung: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `mitarbeiter_abteilung` DISABLE KEYS */;
/*!40000 ALTER TABLE `mitarbeiter_abteilung` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.mitarbeiter_rollen
CREATE TABLE IF NOT EXISTS `mitarbeiter_rollen` (
  `MitarbeiterID` int(11) NOT NULL DEFAULT 0,
  `roleID` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`MitarbeiterID`,`roleID`),
  KEY `FK_mitarbeiter_rollen_rollen` (`roleID`),
  KEY `MitarbeiterID` (`MitarbeiterID`),
  CONSTRAINT `FK_mitarbeiter_rollen_mitarbeiter` FOREIGN KEY (`MitarbeiterID`) REFERENCES `mitarbeiter` (`MitarbeiterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_mitarbeiter_rollen_rollen` FOREIGN KEY (`roleID`) REFERENCES `rollen` (`roleID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportiere Daten aus Tabelle intranet.mitarbeiter_rollen: ~2 rows (ungefähr)
/*!40000 ALTER TABLE `mitarbeiter_rollen` DISABLE KEYS */;
INSERT INTO `mitarbeiter_rollen` (`MitarbeiterID`, `roleID`) VALUES
	(2, 78);
/*!40000 ALTER TABLE `mitarbeiter_rollen` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.newsfeed
CREATE TABLE IF NOT EXISTS `newsfeed` (
  `newsfeedID` smallint(6) NOT NULL AUTO_INCREMENT,
  `author` varchar(50) DEFAULT NULL,
  `createdDate` varchar(50) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `descriptiontext` varchar(1000) NOT NULL,
  `wholeEntry` varchar(2000) DEFAULT NULL,
  `pictureDataUrl` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`newsfeedID`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.newsfeed: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `newsfeed` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsfeed` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.quicklinks
CREATE TABLE IF NOT EXISTS `quicklinks` (
  `quicklinkID` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `href` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`quicklinkID`) USING BTREE,
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `href` (`href`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.quicklinks: ~0 rows (ungefähr)
/*!40000 ALTER TABLE `quicklinks` DISABLE KEYS */;
/*!40000 ALTER TABLE `quicklinks` ENABLE KEYS */;

-- Exportiere Struktur von Tabelle intranet.rechte
CREATE TABLE IF NOT EXISTS `rechte` (
  `rightID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  PRIMARY KEY (`rightID`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle intranet.rechte: ~4 rows (ungefähr)
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
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8 COMMENT='Beschreibt eine funktionale Rolle im Intranet';

-- Exportiere Daten aus Tabelle intranet.rollen: ~2 rows (ungefähr)
/*!40000 ALTER TABLE `rollen` DISABLE KEYS */;
INSERT INTO `rollen` (`roleID`, `name`, `description`) VALUES
	(78, 'Admin', 'Administrator der Anwendung'),
	(82, 'Test', 'test');
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

-- Exportiere Daten aus Tabelle intranet.rollen_rechte: ~7 rows (ungefähr)
/*!40000 ALTER TABLE `rollen_rechte` DISABLE KEYS */;
INSERT INTO `rollen_rechte` (`roleID`, `rightID`, `allowRead`, `allowWrite`, `allowExecute`) VALUES
	(78, 8, 1, 1, 1),
	(78, 9, 1, 1, 1),
	(78, 10, 1, 1, 1),
	(78, 11, 1, 1, 1),
	(78, 12, 1, 1, 1),
	(82, 8, 1, 1, 1),
	(82, 9, 1, 1, 1);
/*!40000 ALTER TABLE `rollen_rechte` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
