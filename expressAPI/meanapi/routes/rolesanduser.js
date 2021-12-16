var express = require('express');
var router = express.Router();
var db = require("../db");

router.use(express.json());
router.use(express.urlencoded());


/**
 * Backendroute um Zwischentabelle mitarbeiter_rollen zu füllen
 */
router.post("/roleToUser", (req, res) => {
    const {MitarbeiterID, roleID} = req.body


    let sql = "INSERT INTO mitarbeiter_rollen (MitarbeiterID, roleID) VALUES (?,?)"

    db.query(sql, [MitarbeiterID,roleID],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
    });
    res.status(200).send();
});

module.exports = router;