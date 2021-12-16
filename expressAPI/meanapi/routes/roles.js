var express = require('express');
var router = express.Router();
var db = require("../db");

router.use(express.json());
router.use(express.urlencoded());

router.get('/role', (req, res) => {
    let sql = "SELECT * from rollen";
    db.query(sql,(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
})

router.get('/roleByName/:name', (req, res) => {
    let sql = "SELECT roleID from rollen WHERE name = ?";
    name = req.params.name;

    db.query(sql,[name],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send({roleID: result[0].roleID});
    });
})

router.get('/getRoles/:mitarbeiterID', (req, res) => {

    var mitarbeiterID = req.params.mitarbeiterID;

    let sql = "select mitarbeiter_rollen.roleID, name, description " +
        "from mitarbeiter_rollen, rollen " +
        "where mitarbeiter_rollen.roleID = rollen.roleID " +
        "and mitarbeiter_rollen.MitarbeiterID = ?";

    db.query(sql, [mitarbeiterID], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
})

router.get('/getRole/:roleID', (req, res) => {

    var roleID = req.params.roleID;

    let sql = "SELECT * from rollen where roleID = ?";
    db.query(sql, [roleID], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        // result[0], da Array erzeugt wird, aber nur nach Roles Object gefragt wird als Response
        res.send(result[0]);
    });
})

router.post("/addEntry", (req, res) => {

    var ergebnis = req.body;
    var name = ergebnis.name;
    var description = ergebnis.description;

    let sql = "INSERT INTO rollen (name,description) VALUES (?,?)"

    //Startet die Transaktion
    db.beginTransaction();

    db.query(sql, [name, description],(err,result) => {
        if(err) {
            db.rollback();
            console.log(err);
            res.status(500).send();
            return;
        }

    });

    let sql2 = "SELECT roleID FROM rollen where name = ?"
    var roleID;
    db.query(sql2, [name],(err,result) => {

        roleID = result[0].roleID;
        if(err) {
            db.rollback();
            res.status(500).send();
            return;
        }
    });

    let sql3 = "SELECT rightID FROM rechte "
    var allRights = [];
    db.query(sql3,(err,result) => {

        allRights = result;
        let sql4 = "INSERT INTO rollen_rechte (roleID, rightID, allowRead, allowWrite, allowExecute) VALUES (?, ?, 0, 0, 0)"

        for(let i=0; i<allRights.length;i++) {
            let rightID = allRights[i].rightID;
            db.query(sql4, [roleID, rightID],(err,result) => {


                if(err) {
                    db.rollback();
                    console.log(err);
                    res.status(500).send();
                    return;

                }

            });

        }

        if(err) {
            db.rollback();
            console.log(err);
            res.status(500).send();
            return;

        }
        //Abschließen der Transaktion
        db.commit();

        res.status(201).send();
    });




});

router.delete("/deleteEntry/:roleID", (req, res) => {
    roleID = req.params.roleID;

    let sql1 = "select * from mitarbeiter_rollen where roleID = ?";

    db.beginTransaction();

    db.query(sql1, [roleID] , (err, result) => {

        var allUser = result;

        if(err) {
            db.rollback();
            console.log(err);
            res.status(500).send();
            return;
        }

        //Hier Standardrolle eintragen
        let sql2 = "Insert into mitarbeiter_rollen (MitarbeiterID, roleID) VALUES (?, 111)";

        for(let i=0;i<allUser.length;i++) {
            let mitarbeiterID = allUser[i].MitarbeiterID;

            db.query(sql2, [mitarbeiterID] , (err, result) => {
                if(err) {
                    db.rollback();
                    console.log(err);
                    res.status(500).send();
                    return;
                }
            })
        }
    })

    let sql3 = "DELETE from rollen where roleID = ?";
    db.query(sql3, [roleID] , (err, result) => {
        if(err) {
            db.rollback();
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    })

    db.commit();
})

router.put('/updateRole/:roleID', (req, res) => {

    var ergebnis = req.body;
    var name = ergebnis.name;
    var description = ergebnis.description;
    var roleID = req.params.roleID;


    let sql = "UPDATE rollen SET name = ?, description = ? where roleID = ?";

    db.query(sql, [name, description, roleID], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    })
});

/**
 * Aktualisiert die Zwischentabelle Rollen_Rechte, eines bestimmten Rechts zu einer Rolle
 *
 */
router.put('/updateRightsFromRole/:roleID', (req, res) => {

    const {roleID, rightID,allowRead,allowWrite,allowExecute} = req.body;

    let sql = "UPDATE rollen_rechte SET allowRead = ?, allowWrite = ?, allowExecute = ? WHERE roleID = ? and rightID = ?"

    db.query(sql, [allowRead, allowWrite, allowExecute, roleID, rightID], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    })
});

/**
 * Aktualisiert die Zwischentabelle Mitarbeiter_Rollen, "Welche Rollen hat ein Mitarbeiter"
 *
 */
router.put('/updateRolesFromUser/:mitarbeiterID', (req, res) => {

    var mitarbeiterID = req.params.mitarbeiterID;

    let sql = "DELETE FROM mitarbeiter_rollen where MitarbeiterID = ?"

    db.query(sql, [mitarbeiterID], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
    })

    let sql2 = "insert into mitarbeiter_rollen (MitarbeiterID,roleID) VALUES (?,?)"
    roles = req.body
    for (role of roles) {
        roleID = role.roleID;

        db.query(sql2, [mitarbeiterID,roleID], (err,result) => {
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
