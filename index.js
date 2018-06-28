const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./config/config');


// -- CONFIG --
const serviceAccount = require("./config/accountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: appConfig.databaseURL
});

const firebaseDb = admin.database();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(appConfig.PORT, () => {
    console.log('We are live on ' + appConfig.PORT);
});

// -- END CONFIG --

// -- Flow --
app.get('/projects',  async (req, res) => {

    const sp = await firebaseDb.ref('projects').once('value');

    const response = Object.assign({}, sp.val());
    res.send(response);
});

app.get('/project', async (req, res) => {
    const project_id = req.param('project_id');

    const projectSnapshot = await firebaseDb.ref(`projects/${project_id}`).once('value');
    res.send(projectSnapshot.val());
});

app.post('/projects', (req, res) => {
    const { project } = req.body;
    
    firebaseDb.ref('projects').push(JSON.parse(project));
    res.sendStatus(201);
});

// app.put('/');

// -- End flow -- 
