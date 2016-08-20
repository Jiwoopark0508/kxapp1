"use strict";

let express = require('express');
let app = express();

let mongoUtil = require('./mongoUtil');
mongoUtil.connect();
let port = process.env.port || 9000;

app.use( express.static( __dirname + '/../client' ));

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
app.listen(port, () => console.log("listening on port 9000"));
