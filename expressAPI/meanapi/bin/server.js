const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");

console.log('server');

var loginRouter = require('../routes/login');
var newsfeedRouter = require('../routes/newsfeed');
var registerRouter = require('../routes/register');
var userlistRouter = require('../routes/users');
var quicklinksRouter = require('../routes/quicklinks');
var authRouter = require('../routes/auth');
var rolesRouter = require('../routes/roles');
var rightsRouter = require('../routes/rights');
var rolesAndRightsRouter = require('../routes/rolesandrights');
var filesystemRouter = require('../routes/filesystem');
var departmentRouter = require('../routes/department')
var rolesAndUserRouter = require('../routes/rolesanduser')




const app = express();

app.use(cors());
app.use('/login', loginRouter);
app.use('/newsfeed', newsfeedRouter);
app.use('/register', registerRouter);
app.use('/users', userlistRouter);
app.use('/quicklinks', quicklinksRouter);
app.use('/auth', authRouter);
app.use('/rollen', rolesRouter);
app.use('/rights', rightsRouter);
app.use('/rollen_rechte', rolesAndRightsRouter);
app.use('/filesystem', filesystemRouter);
app.use('/department', departmentRouter);
app.use('/rolesAndUser', rolesAndUserRouter);

const port = process.env.PORT || 3001;

//app.use(express.static(__dirname + "../../../../intranet-feuerwehr/dist/intranet-feuerwehr"));

app.get("/", (req, res) => {
    res.json({
        "statuscode" : 200,
        "status message": "SUCCESS"
    })
})

/*
app.post("/postData", (req,res)=> {
    res.json({
        "statuscode" : 200,
        "status message": "SUCCESS POST",
    })
    console.log("Funktioniert");
})*/

const server = http.createServer(app);

server.listen(port,() => console.log("Das Backend läuft und hört auf Port 3001"));
