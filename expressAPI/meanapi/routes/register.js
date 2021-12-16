const express = require('express');
const db = require("../db");
const bcrypt = require('bcrypt');

const saltRounds = 10;
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());

router.get('/', (req, res) => {

})
/**
 * neuer nicht vorhandener User wird in Datenbank gelegt.
 */
router.post("/", (request, response) => {

    const {Benutzername, Passwort, Email, Vorname, Nachname, Telefon} = request.body;

    /*bcrypt.hash(password, saltRounds, function (hashError, hash) {
        if (hashError) {
            response.status(500).send(hashError.message);
            return
        }
    */
    // User wird mit Benutzername und Passwort angelegt.
    const sql = "INSERT INTO mitarbeiter (Benutzername, Passwort, Vorname, Nachname, Email, Telefon) values(?,?,?,?,?,?)";
    db.query(sql, [Benutzername, Passwort, Vorname, Nachname, Email, Telefon], (error, result) => {
        if (error) {
            console.log(error);
            response.status(500).send();
            return;
        }
           response.status(200).send();
    });
});

module.exports = router;
