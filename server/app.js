"use strict";

let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let jsonParser = bodyParser.json();
let app = express();

let mongoUtil = require('./mongoUtil');
mongoUtil.connect();
let port = process.env.port || 9000;

app.use( express.static( __dirname + '/../client' ));
app.use(cookieParser());

app.get('/home', (req, res) => {
    res.json("Hello");
});
app.get('/type', (req, res) => {
    let templateDB = mongoUtil.template();
    let templates;
    templateDB.find().toArray((err, docs) => {
        if(err){ 
            res.sendStatus(400);
        }
        templates = docs;
        res.json(templates);
    });
});
app.get('/type/:typeid', (req, res) => {
    let typeId = +req.params.typeid;
    let result;
    mongoUtil.template().find({typeNum: typeId})
                    .toArray((err, doc) => {
                        if(err){
                            res.sendStatus(400);
                        }
                        result = doc;          
                        res.json(result);
                    });
    
    
});
// Get lecture 
app.get('/lecture/:type/:number', (req, res) => {
    let templateCollection = mongoUtil.template();
    let typeId = +req.params.type;
    let tempNum = +req.params.number;
    
    templateCollection.find({typeNum:typeId}).toArray((err, docs) => {
        if(err){
            res.sendStatus(400);
        }
        docs = docs[0].templates[tempNum];


        res.json(docs);
    });
});
// Get sub goal
// return lectures subgoal
app.get('/subgoal/:lecNum/:lecInterval', (req, res) => {
    let lecture = mongoUtil.lecture();
    let lecNum = +req.params.lecNum;

    lecture.find({"lecNum" : lecNum}).toArray((err, docs) => {
        if(err){
            res.sendStatus(400);
        }
        res.json(docs[0]);
    });
});
// Post submit
// Save questions into DB
app.post('/submit', jsonParser, (req, res) => {
    let queCollection = mongoUtil.questions();
    let body = req.body;
    queCollection.insertMany(body).then(function(r){
        res.json("Success");
    });
} );
// Save User Cookie
app.get('/user/:userName', (req, res) => {
    res.cookie('name', req.params.userName)
        .send("user Successfully saved : " + req.params.userName);
});

// Get all questions
//// for instructor
app.get('/allQuestions', (req, res) => {
    let queCollection = mongoUtil.questions();
    queCollection.find().toArray((err, docs) => {
        if(err){
            console.log(err);
            res.sendStatus(400);
        }
        res.json(docs);
    });
});
app.listen(port, () => console.log("listening on port 9000"));
