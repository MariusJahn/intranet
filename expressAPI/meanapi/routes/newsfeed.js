var express = require('express');
var router = express.Router();
var db = require("../db");

//const fileUpload = require('express-fileupload');
const multer = require('multer');
// FileSystem nötig um File zu löschen
const fs = require('fs');

//http://localhost:3001/newsfeed/filename Bilder jetzt durch express.static erreichbar! über folgende URL
router.use(express.static('./uploads/images'));

router.use(express.json());
router.use(express.urlencoded());



var storage = multer.diskStorage({

    // Pfad wählen zum abspeichern
    destination: function (req, file, cb) {
        cb(null, './uploads/images')
    },

    // Bennenung des Filenames
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
})

// Variable wird mit "multer" belegt, nötig um FormData File auszulesen und abzuspeichern
var uploadImage = multer({
    storage: storage, //var storage verwenden
    limits: {
        // Maximale Img Größe auf 10MBs
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg)$|\.(jpeg)$|\.(png)$|/)) {
            //Error
            cb(new Error('Nur JPG oder PNG Formate zulässig'))
        }
        //Success, cb ist return callback
        cb(undefined, true)
    }
})

//Middleware Mutlter .single('') wird ausgeführt und speichert Request (FormData) ab
router.post('/uploadImage', uploadImage.single('image'), (request, response) => {
    //Durch multer auf .file zugreifbar!
    const file = request.file
    // passende backend url für Image
    const url = request.protocol + '://'+ 'localhost:3001/newsfeed/' + file.filename;

    if (!file) {
        return response.status(400).send();
    }
    //Json response, imagePath nötig zur Bild-URL Belegung im Newsfeed
    response.status(200).send({
        status: 'success',
        imagePath: url,
        uploadedFile: file
    })
});


/**
 * Ideensammlung um Bilder anzuhängen
 *
 * Momentan wird der Pfad in den Newseintrag geschrieben, dieser führt zum Backend.
 *
 *  - Blob datei in DB und dann mit übertragen
 *  - Abfrage der Pfade und Bilder im Backend um dann Bild dem Newsfeed anzuhängen (mappen)
 *  - Mit extra Schritt Bild beim getten aus der DB holen?!? (Daten sparen?!?)
 *  - PDFs usw gehen auch als Pfad über a href
 */
router.get('/news', (req, res) => {

    let sql = "SELECT * from newsfeed order by newsfeedID DESC"; // Desc = Absteigend
    //let sql ="SELECT * from mitarbeiter";
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

    var ergebnis = req.body;
    var author = ergebnis.author;
    var date = ergebnis.createdDate;
    var title = ergebnis.title;
    var descriptiontext = ergebnis.descriptiontext;
    var wholeEntry = ergebnis.wholeEntry;
    var pictureDataUrl = ergebnis.pictureDataUrl;
    var showWholeEntry = ergebnis.showWholeEntry;

    let sql = "INSERT INTO newsfeed (author,createdDate,title,descriptiontext,wholeEntry,pictureDataUrl,showWholeEntry) VALUES (?,?,?,?,?,?,?)"


    db.query(sql, [author,date,title, descriptiontext, wholeEntry, pictureDataUrl, showWholeEntry],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);
    });
});

router.put('/editEntry/:newsfeedID', (req, res) => {

    var newsfeedID = req.params.newsfeedID;
    var ergebnis = req.body;
    var author = ergebnis.author;
    var date = ergebnis.createdDate;
    var title = ergebnis.title;
    var descriptiontext = ergebnis.descriptiontext;
    var wholeEntry = ergebnis.wholeEntry;
    var pictureDataUrl = ergebnis.pictureDataUrl;
    var showWholeEntry = ergebnis.showWholeEntry;

    let sql = "UPDATE newsfeed SET author = ?, createdDate = ?, title = ?, descriptiontext = ?, wholeEntry = ?, showWholeEntry = ? WHERE newsfeedID = ?";

    db.query(sql,
        [author,date,title, descriptiontext, wholeEntry, showWholeEntry, newsfeedID],(err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send();
                return;
            }
            res.send(result);
        });
});

// Middleware um PictureURl aus DB zu bekommen um Bild aus Backend zu löschen
function getPictureURL(req, res, next) {
    var newsfeedID = req.params.newsfeedID;
    let sql_select = "SELECT pictureDataUrl from newsfeed where newsfeedID = ?";
    db.query(sql_select,[newsfeedID],(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        req.pictureURL = result[0].pictureDataUrl;
        next();
    });
}

router.delete('/deleteEntry/:newsfeedID', getPictureURL,(req, res) => {

    var newsfeedID = req.params.newsfeedID;

    // Aus Middleware-Funktion pictureURL bekommen
    let pictureURL = req.pictureURL;


    // Wenn PictureURL vorhanden:
    // aus PictureURL Backend Path erhalten
    if (pictureURL !== '') {
        const length = pictureURL.length;
        const imageName = pictureURL.slice(31,length)

        // Erstelle Manuell Path mit BildNamen
        let path = './uploads/images/'
        path = path + imageName;

        // File (Image) der gelöschten News entfernen
        try {
            fs.unlinkSync(path)
            //Image File gelöscht
        } catch(err) {
            console.log(err)
        }
    }

    let sql = "DELETE from newsfeed where newsfeedID = ?";
    db.query(sql, [newsfeedID] ,(err,result) => {
        if(err) {
            console.log(err);
            res.status(500).send();
            return;
        }
        res.send(result);

    });
});

module.exports = router;
