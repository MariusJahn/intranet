var express = require('express');
var router = express.Router();
var db = require("../db");

router.use(express.json());
router.use(express.urlencoded());

router.get('/recht', (req, res) => {
    let sql = "SELECT * from rechte";
    db.query(sql,(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
})

router.get('/getRightFromRole/:roleID', (req, res) => {
    const roleID = req.params.roleID;

    let sql = "SELECT * from rollen_rechte where roleID = ?";
    db.query(sql,[roleID],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

router.get('/rightByID/:rightID', (req, res) => {
    const rightID = req.params.rightID;
    let sql = "SELECT * from rechte where rightID = ?";
    db.query(sql,[rightID],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        // result[0] nötig, da Response vom Typ Rights (ohne [])
        res.send(result[0]);
    });
});



module.exports = router;
