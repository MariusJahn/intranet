var express = require('express');
var router = express.Router();
var db = require("../db");

router.use(express.json());
router.use(express.urlencoded());

router.get('/ID', (req, res) => {
    let sql = "SELECT * from rollen_rechte";
    db.query(sql,(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
})

router.post("/addEntry", (req, res) => {
    const {roleID, rightID, allowRead, allowWrite, allowExecute} = req.body

    let sql = "INSERT INTO rollen_rechte (roleID,rightID,allowRead,allowWrite,allowExecute) VALUES (?,?,?,?,?)"

    db.query(sql, [roleID, rightID, allowRead,allowWrite,allowExecute],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
    });
    res.status(200).send();
});

router.delete("/deleteIDs/:roleID", (req, res) => {
    roleID = req.params.roleID;
    let sql = "DELETE from rollen_rechte where roleID = ?";
    db.query(sql, [roleID] , (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    })
})

module.exports = router;
