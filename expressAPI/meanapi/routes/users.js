var express = require('express');
var router = express.Router();
var db = require("../db");

const bcrypt = require('bcrypt');
const saltRounds = 10;


router.use(express.json());
router.use(express.urlencoded());


/* GET users listing. */
router.get('/', (req, res) => {
  let sql ="SELECT * from mitarbeiter order by MitarbeiterID DESC";

  db.query(sql,(err,result) => {
    if(err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(result);
  });
});

/**
 * Gibt den Vor und Nachnamen anhand übergebender ID
 */
router.get('/getNameByID/:mitarbeiterID', (req, res) => {

    const mitarbeiterID = req.params.mitarbeiterID;

    let sql ="SELECT Vorname, Nachname from mitarbeiter where MitarbeiterID = ?";

    db.query(sql,[mitarbeiterID],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send({
            name: result[0].Vorname,
            lastname: result[0].Nachname
        })
    });
});





router.delete('/deleteUser/:MitarbeiterID', (req, res) => {

  MitarbeiterID = req.params.MitarbeiterID;

  let sql = "DELETE from mitarbeiter where MitarbeiterID = ?";

  db.query(sql, [MitarbeiterID] ,(err,result) => {
    if(err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(result);

  })
});

router.put('/updateUser/:MitarbeiterID', (req, res) => {



    let sql = "UPDATE mitarbeiter SET Vorname = ?, Nachname = ?, Benutzername = ?, Email = ?, Telefon = ? WHERE MitarbeiterID = ?";

    db.query(sql,
        [req.body.Vorname, req.body.Nachname, req.body.Benutzername, req.body.Email, req.body.Telefon,req.body.MitarbeiterID],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send();
            return;
          }
          res.send(result);
        });
  });


router.put('/updateUserPassword/:MitarbeiterID', (req, res) => {

  var password = req.body.Passwort

  bcrypt.hash(password, saltRounds, function (hashError, hash) {
    if (hashError) {
      response.status(500).send(hashError.message);
      return
    }

    let sql = "UPDATE mitarbeiter SET Vorname = ?, Nachname = ?, Benutzername = ?, Passwort = ?, Email = ?, Telefon = ? WHERE MitarbeiterID = ?";

    db.query(sql,
        [req.body.Vorname, req.body.Nachname, req.body.Benutzername, hash, req.body.Email, req.body.Telefon,req.body.MitarbeiterID],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send();
            return;
          }
          res.send(result);
        });
  });
});



module.exports = router;
