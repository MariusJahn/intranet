

const express = require('express');
const jwt = require('jsonwebtoken');
const jwt_decoded = require('jwt-decode');
const db = require("../db");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded());
//router.use(verifyToken); Middleware läuft vor allen Actionen

//verifyToken is Middleware Funktion
// Format vom Token
// Authorization: Baerer <acces_token> pull token out of header
function verifyToken(request, response, next) {
    // Get auth header value
    bearerHeader = request.headers.authorization // request.headers[Authorization] so nicht möglich in middleware, bearerHeader so undefined
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space Authorization: Baerer <acces_token>
        const bearer = bearerHeader.split(' ') // Split bei Space und erzeugt feld [1] index ist also acces_token
        // Get token from array bearer
        const bearerToken = bearer[1]
        // Set the token
        request.jwtToken = bearerToken
        // next middleware, in diesem Fall wird der router.get ausgeführt
        next();
    } else {
        //Forbidden
        response.sendStatus(403);
    }
}


router.get('/' ,verifyToken, (request, response ) => {

    jwt.verify(request.jwtToken, '782948BCAD1DAB205F8DDD1CE090FC1D60F014270C43EB69B31F2EEB7F9A4557' , (err, authData) => {
        if(err) {
            response.send(false);
            return;
        } else {
            // Token ist erfolgreich verfifiziert, true an Methode isAuthenticated im auth Service
            response.send(true);
            return;
        };
    })

});


//Sende Username aus JWT Header Anfrage
router.get('/getUsername',verifyToken, (request, response ) => {

    //middleware verifyToken zieht Token aus Header.
    try {
        var decoded = jwt_decoded(request.jwtToken)
        // decodes JWT liefert Feld mit Attributen, es wird username: "Username" ausgewählt
        var username = decoded['username']
    } catch (e) {
        response.sendStatus(404); //Ohne näheren Grund
        return;
    }
    response.send({
        username: username
    });
});

//Sende Abteilungen aus JWT Header Anfrage
router.get('/getDepartments',verifyToken, (request, response ) => {

    //middleware verifyToken zieht Token aus Header.
    try {
        var decoded = jwt_decoded(request.jwtToken)
        // decodes JWT liefert Feld mit Attributen, es wird userDepartment: ausgewählt
        var userDepartment = decoded['userDepartment']
    } catch (e) {
        response.sendStatus(404); //Ohne näheren Grund
        return;
    }

    response.send({
        allDepartment: userDepartment.allDepartment
    });
});

// ist angemeldeter User Admin? -bzw besitzt Token isAdmin: true?
router.get('/isAdmin',verifyToken, (request, response ) => {

    //middleware verifyToken zieht Token aus Header und belegt request.jwtToken
    try {
        var decoded = jwt_decoded(request.jwtToken)
        // decodes JWT liefert Feld mit Attributen, es wird isAdmin: "boolean" ausgewählt
        var isAdmin = decoded['isAdmin']
    } catch (e) {
        response.sendStatus(404); //Ohne näheren Grund
        return;
    }
    response.send(isAdmin);
});


//Sende Permission aus JWT Header Anfrage
router.post('/hasUserPermission',verifyToken, (request, response ) => {
    var rightID = request.body.rightID;
    var allowPermission = request.body.allowPermission

    //middleware verifyToken zieht Token aus Header.
    try {
        var decoded = jwt_decoded(request.jwtToken)
        // decodes JWT liefert Feld mit Attributen, es wird userPermission:  ausgewählt
        var userPermission = decoded['userPermission']

    } catch (e) {
        response.sendStatus(404); //Ohne näheren Grund
        return;
    }

    // Algo der prüft ob User(JWT-userPermission) gefragtes Recht besitzt.
    for (let i = 0; i < userPermission.allPermission.length; i++){
        if (userPermission.allPermission[i].rightID === rightID) {
            switch (allowPermission){
                    case "allowRead":
                        if (userPermission.allPermission[i].permissions.allowRead === 1){
                            response.send(true);
                            return;
                    }
                        break;
                    case "allowWrite":
                        if (userPermission.allPermission[i].permissions.allowWrite === 1){
                            response.send(true);
                            return;
                        }
                        break;
                    case "allowExecute":
                        if (userPermission.allPermission[i].permissions.allowExecute === 1){
                            response.send(true);
                            return;
                        }
                        break;
                }
            }
        }
    // User hat nicht angefragtes Recht.
    response.send(false);
});

//Sende UserID aus JWT Header Anfrage
router.get('/getUserId',verifyToken, (request, response ) => {

    //middleware verifyToken zieht Token aus Header.
    try {
        var decoded = jwt_decoded(request.jwtToken)
        // decodes JWT liefert Feld mit Attributen, es wird userId: ID ausgewählt
        var userId = decoded['userId']
    } catch (e) {
        response.sendStatus(404); //Ohne näheren Grund
        return;
    }
    response.send({
        userId: userId
    });
});




router.get('/getUser',verifyToken, (request, response ) => {
    //middleware verifyToken zieht Token aus Header.
    try {
        var decoded = jwt_decoded(request.jwtToken)
        // decodes JWT liefert Feld mit Attributen, es wird userId: ID ausgewählt
        var userId = decoded['userId']
    } catch (e) {
        response.sendStatus(404); //Ohne näheren Grund
        return;
    }
    // Ziehe User aus DB, aus gewonnener UserID
    let sql = "SELECT * from mitarbeiter Where MitarbeiterID = ?";

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);
            response.status(500).send();
            return;
        }
        // Send 200 and Result (User)
        response.status(200).send(result);
    });
});


module.exports = router;
