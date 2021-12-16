var mysql = require('mysql');

/**
 *  MariaDB installieren! + HeidiSQL
 *  Hier werden die MariaDB-Einstellungen verwendet. Standardmäßig ist das:
 *  Benutzername: root
 *  Passwort: Travianer1 -> Unser Passwort
 *  Port: 3306
 * @type {Connection} ist die Datenbankverbindung.
 */
const connection = mysql.createConnection({
    //Host muss im Production von Docker auf den Servicenamen umgeändert werden.
    host: "mariadb",
    port: 3306,
    user: 'root',
    password: "Travianer1",
    database: "intranet"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Verbindung hergestellt");
})

module.exports = connection;
