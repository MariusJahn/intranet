const express = require('express');
const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());

/**
 * sendet das gehashte Passwort, wenn der Benutzername richtig ist
 */

/**
 * Route um aus angefragten Benutzername, das gehashte Passwort ins Frontend zu übermitteln um richtige Eingabe zu vergleichen.
 */
router.post("/", (request,response) => {

    const username = request.body.usernameReq;
    const sql = "SELECT * from mitarbeiter where Benutzername = ?";
    db.query(sql, [username], (error,result) => {
        if (error) {
            response.status(500).send(error.message);
            return
        }
        if (result.length <= 0){
            response.send(false);
            return
        }
        const hash = result[0].Passwort;
        response.send({hash});
    });
})

/**
 * Zwischenmethode liefert ganzes UserObject aus NamenRequest
 * @param request anfrage aus http
 * @param response antwort
 * @param next nächst auszuführende Methode (hier getPermissionMapForUser() )
 */
function getUserFromName(request, response, next) {
    const username = request.body.usernameReq;
    const sql = "SELECT * from mitarbeiter where Benutzername = ?";

    db.query(sql, [username], (error, result) => {
        if (error) {
            response.status(500).send(error.message);
            return
        }
        if (result.length <= 0) {
            response.send(false);
            return
        }
        // Belegt request.user mit User aus Datenbank
        request.user = result[0];
        next();
    });
}

/**
 * Zwischenmethode erzeugt für angefragten User ein Json, da Wert für userPermission in JWT wieder JSON sein muss
 * Ins JWT um Rechte abzufragen in gesamter Anwendung
 * @param request anfrage aus http
 * @param response antwort
 * @param next nächst auszuführende Methode
 */
function getPermissionForUser(request, response, next) {
    const userID = request.user.MitarbeiterID;

    const sql = "SELECT * \n" +
        "FROM rollen_rechte \n" +
        "WHERE roleID IN \n" +
        "\t(SELECT roleID FROM mitarbeiter_rollen WHERE MitarbeiterID = ?)";

    db.query(sql, [userID], (error, result) => {
        if (error) {
            response.status(500).send(error.message);
            return
        }
        // Alle Rechte aus rollen_rechte des Users in JSON
        for (let i = 0; i < result.length; i++) {
            // Erster JSON eintrag, zum definieren, definiert Feld, um in JSON pushen zu können, da ein User individuell viele Rechte haben kann
            if (i == 0) {
                var allPermissionJSON = {"allPermission":[{
                        "rightID": result[i].rightID,
                        "permissions":{
                            "allowRead": result[i].allowRead,
                            "allowWrite": result[i].allowWrite,
                            "allowExecute": result[i].allowExecute}
                    }]}
            } else {
                var permissionJSON = {
                    "rightID": result[i].rightID,
                    "permissions": {
                        "allowRead": result[i].allowRead,
                        "allowWrite": result[i].allowWrite,
                        "allowExecute": result[i].allowExecute
                    }
                };
                allPermissionJSON["allPermission"].push(permissionJSON)
            }
        }
        request.userPermission = allPermissionJSON
        next();
    });
}

function isUserAdmin(request, response, next) {
    const userID = request.user.MitarbeiterID;
    const sql = "SELECT * from mitarbeiter_rollen where MitarbeiterID = ?";
    var isAdmin;
    db.query(sql, [userID], (error, result) => {
        if (error) {
            response.status(500).send(error.message);
            return
        }
        // 78 roleID des Admins!!!
        if (result[0].roleID === 78) {
            isAdmin = true;
        } else {
            isAdmin = false;
        }
        request.isAdmin = isAdmin;
        next();
    });
}

/**
 * Erzeugt ein Json object, welcher aus n Abteilungen des angemeldeten Users besteht, um in JWT zu speichern
 * @param request
 * @param response
 * @param next nächst auszuführende Methode (jetzt Route)
 */
function getDepartmentForUser(request, response, next) {
    const mitarbeiterID = request.user.MitarbeiterID;

    const sql = "SELECT * \n" +
        "FROM abteilung \n" +
        "WHERE abteilungID IN \n" +
        "\t(SELECT abteilungID FROM mitarbeiter_abteilung WHERE mitarbeiterID = ?)";

    db.query(sql, [mitarbeiterID], (error, result) => {
        if (error) {
            response.status(500).send(error.message);
            return
        }
        // Alle Abteilungen des Users in JSON
        for (let i = 0; i < result.length; i++) {
            // Erster JSON eintrag, zum definieren, definiert Feld, um in JSON pushen zu können, da ein User individuell viele Abteilungen haben kann
            if (i == 0) {
                var allDepartmentJSON = {"allDepartment":[{
                        "departmentID": result[i].abteilungID,
                        "name": result[i].name
                    }]}
            } else {
                var departmentJSON = {
                    "departmentID": result[i].abteilungID,
                    "name": result[i].name
                };
                allDepartmentJSON["allDepartment"].push(departmentJSON)
            }
        }
        request.userDepartment = allDepartmentJSON
        next();
    });
}



/**
 * Passwort Hash ist im Frontend verglichen worden und korrekt, jetzt kann für den Benutzer (Name in Post) eine Session
 * durch JWT aufgebaut werden.
 */
router.post("/token",getUserFromName,isUserAdmin,getPermissionForUser,getDepartmentForUser, (request, response) => {
    // Aus ZwischenMethode getUserFromName
    const user = request.user;

    // Aus ZwischenMethode isUserAdmin
    const isAdmin = request.isAdmin;

    // Aus ZwischenMethode getPermissionForUser
    const userPermission = request.userPermission

    const userDepartment = request.userDepartment


    const token = jwt.sign({
            // Wir übergeben  Variablen, die wir im JWT Token „speichern“ möchten
            // Dadurch haben wir in den geschützten Routen Zugriff auf diese Variablen.
            username: user.Benutzername,
            userId: user.MitarbeiterID,
            isAdmin: isAdmin,
            userPermission: userPermission,
            userDepartment: userDepartment

            },
        '782948BCAD1DAB205F8DDD1CE090FC1D60F014270C43EB69B31F2EEB7F9A4557', { // Secret Key, zur Verschlüsselung
            expiresIn: (60 * 60) * 3 // Wie lange Token gültig ohne RefreshToken, hier 3 Stunde (60m x 60s) *3, TODO: Refresh Token Mechanismus einbauen
            // z.b  "iat": 1611152738,
            //      "exp": 1611170738, werden automatisch - Erstell und AblaufZeit (sekunden seit unix epoch) in den Payload(Data) des JWT Tokens gespeichert
            });
    response.status(200).send({ // 200 ist Anfrage erfolgreich verlaufen
        success: true,
        usernameID: user.MitarbeiterID,
        username: user.Benutzername,
        jwt: token
        })
    });

module.exports = router;
