var express = require('express');
var router = express.Router();
var db = require("../db");

router.use(express.json());
router.use(express.urlencoded());

/**
 * Backendroute holt alle Abteilungen aus Datenbank.
 */
router.get('/departments', (req, res) => {
    let sql = "SELECT * from abteilung";
    db.query(sql,(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
})

router.get('/getDepartmentBy/:mitarbeiterID', (req, res) => {

    var mitarbeiterID = req.params.mitarbeiterID;

    let sql = "select mitarbeiter_abteilung.abteilungID, name  " +
        "from mitarbeiter_abteilung, abteilung " +
        "where  mitarbeiter_abteilung.abteilungID = abteilung.abteilungID " +
        "and mitarbeiter_abteilung.mitarbeiterID = ?";

    db.query(sql, [mitarbeiterID], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
})

/**
 * Backendroute um Zwischentabelle mitarbeiter_abteilung zu füllen
 */
router.post("/departmentToUser", (req, res) => {
    const {mitarbeiterID, abteilungID} = req.body


    let sql = "INSERT INTO mitarbeiter_abteilung (mitarbeiterID, abteilungID) VALUES (?,?)"

    db.query(sql, [mitarbeiterID,abteilungID],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
    });
    res.status(200).send();
});

/**
 * Aktualisiert die Zwischentabelle mitarbeiter_abteilung, "Welche Abteilung hat ein Mitarbeiter"
 *
 */
router.put('/updateDepartmentsFromUser/:mitarbeiterID', (req, res) => {

    var mitarbeiterID = req.params.mitarbeiterID;

    let sql = "DELETE FROM mitarbeiter_abteilung where mitarbeiterID = ?"

    db.query(sql, [mitarbeiterID], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
    })
    let sql2 = "insert into mitarbeiter_abteilung (mitarbeiterID,abteilungID) VALUES (?,?)"
    departments = req.body
    for (department of departments) {
        abteilungID = department.abteilungID;

        db.query(sql2, [mitarbeiterID,abteilungID], (err,result) => {
            if(err) {
                console.log(err);
                res.status(500).send();
                return;
            }

        })

    }
    res.status(200).send();
});

module.exports = router;