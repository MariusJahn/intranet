var express = require('express');

var router = express.Router();
var db = require("../db");


router.use(express.json());
router.use(express.urlencoded());


// Variable mutler wird belegt, nötig um FormData File auszulesen und abzuspeichern
var multer = require('multer')({
    limits: {
        // Maximale File Größe in Bytes auf 50MBs
        fileSize: 50000000
    },
    fileFilter(req, file, cb) {
        // Hier kann in der Dokumentenverwaltung nach Typen gefiltert werden
        if (!file.originalname.match(/\.(pdf)$|\.(docx)$|\.(txt)$|\.(xlsx)$\.(jpg)$|\.(jpeg)$|\.(png)$|/)) {
            //Error
            cb(new Error('Dateityp nicht zulässig'))
        }
        //Success, cb ist return callback
        cb(undefined, true)
    }
})

/**
 * BackendRoute zum uploaden eines Dokuments in die Datenbank. Middleware Multer nötig um FormData auszuwerten und error ins Frontend zu senden
 */
router.post('/uploadFile', (req, res) => {
    multer.single('document')(req, res, (err) => {
        if (err) return res.send(false)

        // Nach Middleware multer möglich.
        const binaryData = req.file.buffer

        // Aus Request Body ( FormData ) Document Instanzen ziehen.
        const bodyFormData = req.body;
        const title = bodyFormData.title;
        const validity = bodyFormData.validity;
        const parent = bodyFormData.parent;
        const category = bodyFormData.category;

        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let creationDate = date;
        var alterationDate = date;
        const sql = "INSERT INTO dokument (title,validity,creationDate,alterationDate,parent,category,binaryData) values(?,?,?,?,?,?,?)";
        db.query(sql,[title,validity,creationDate,alterationDate,parent,category,binaryData],(err,result) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(200).send({
                message: 'Erfolgreich Dokument hochgeladen'
            })
        });
    })
})

/**
 * Liefert DokumentenTitel, der gewünschten Datei, nötig zum belegen des Dateinames bei Download
 */

router.get('/getDocumentTitle/:documentID', (req, res) => {
    const documentID = req.params.documentID;
    let sql = "SELECT title from dokument Where documentID = ?";

    db.query(sql,[documentID],(err,result) => {
        if(err) {
            res.status(500).send();
            return;
        }
        // Send 200 and Body mit Title
        res.status(200).send({
            title: result[0].title
        });
    });

});

/**
 * BackendRoute, zum Downloaden eines Dokuments anhand seiner ID, Methode liefert Blob Response der gewünschten Datei
 */

router.get('/getDocument/:documentID', (req, res) => {
    const documentID = req.params.documentID;
    let sql = "SELECT binaryData from dokument Where documentID = ?";

    db.query(sql,[documentID],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }

        // Aus Select die blob daten(bytes), hier wird result in buffer geschrieben.
        const buffer = result[0].binaryData;
        // Set Header in Response HTTP um Blob zu definieren
        res.setHeader('Content-Length', buffer.length);
        // schreibe Buffer Daten ( blob ) in Body der http response
        res.write(buffer, 'binary')
        res.status(200).send()
    });

});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'da'
 */

router.get('/da', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['da'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'db'
 */

router.get('/db', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['db'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'all'
 */

router.get('/all', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['all'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'abt1'
 */

router.get('/abt1', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['1'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'abt2'
 */

router.get('/abt2', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['2'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'abt3'
 */

router.get('/abt3', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['3'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'abt4'
 */

router.get('/abt4', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['4'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'abt5'
 */

router.get('/abt5', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['5'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'abt6'
 */

router.get('/abt6', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['6'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, holt alle Dokumente der Kategorie 'abt6'
 */

router.get('/abt7', (req, res) => {
    let sql ="SELECT documentID,title,validity,creationDate,alterationDate,parent from dokument where category = ? order by documentID DESC";

    db.query(sql,['7'], (err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Backend Route, aktualisiert ein Dokument (Gültigkeit, Parent, Alteration Date)
 */


router.put('/update', (req,res) => {
    var doc = req.body;
    var id = doc.documentID;
    var validity = doc.validity;
    var parent = doc.parent;

    let newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var alterationDate = newDate;

    let sql = "UPDATE dokument SET validity = ?, alterationDate = ?, parent = ? WHERE documentID = ?";

    db.query(sql, [validity, alterationDate, parent, id], (err, result) => {
        if (err) {
            res.status(500).send();
            return;
            //throw err;
        }
    });
    res.status(201).send();
});

/**
 * holt alle Titel von allen Dokumenten
 */

router.get('/titles', (req,res) => {
    let sql = "SELECT title FROM dokument";

    db.query(sql, (err, result) => {
        if(err) {
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

/**
 * Ändert Validity des Doks auf false
 */

router.put('/updateValidity', (req,res) => {
    var doc = req.body;
    var title = doc.parent;
    var validity = 0;
    let newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var alterationDate = newDate;

    let sql = "UPDATE dokument SET validity = ?, alterationDate = ? WHERE title = ?"

    db.query(sql, [validity, alterationDate, title], (err, result) => {
        if (err) {
            res.status(500).send();
            return;
        }
    });
    res.status(201).send();
});

module.exports = router;