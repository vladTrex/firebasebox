const admin = require('firebase-admin');
const express = require('express');
var bodyParser = require('body-parser');

// -- CONFIG --
const serviceAccount = require("./accountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://reactauth-e500b.firebaseio.com"
});

const firebaseDb = admin.database();

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(port, () => {
    console.log('We are live on ' + port);
});

// -- END CONFIG --

// -- Flow --
app.get('/projects',  async (req, res) => {

    const sp = await firebaseDb.ref('projects').once('value');

    const response = Object.assign({}, sp.val());
    res.send(response);
});

app.post('/projects', (req, res) => {
    const { project } = req.body;
    
    firebaseDb.ref('projects').push(JSON.parse(project));
    res.sendStatus(201);
});

// -- End flow -- 
