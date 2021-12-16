var express = require('express');
var router = express.Router();
var db = require("../db");

router.use(express.json());
router.use(express.urlencoded());

// holt Links aus Datenbank
router.get('/link', (req, res) => {

    let sql = "SELECT * from quicklinks";
    db.query(sql,(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
})

// fügt einen Link in Datenbank hinzu
router.post("/addEntry", (req, res) => {

    var ergebnis = req.body;

    var name = ergebnis.name;
    var href = ergebnis.href;

    let sql = "INSERT INTO quicklinks (name, href) VALUES (?, ?)"


    db.query(sql, [name, href],(err,result) => {

        if(err) {
            res.status(500).send();
            return;
        }

        res.status(200).send();

    });




});

// löscht einen Link aus Datenbank
router.delete("/deleteEntry/:quicklinkID", (req, res) => {

    quicklinkID = req.params.quicklinkID;

    let sql = "DELETE from quicklinks where quicklinkID = ?";

    db.query(sql, [quicklinkID] ,(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }

        res.send(result);

    })

});

module.exports = router;
