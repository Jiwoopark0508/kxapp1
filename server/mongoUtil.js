"use strict";

let mongo = require("mongodb");
let mongoClient = mongo.MongoClient;
let _db;

module.exports = {
    connect() {
        mongoClient.connect("mongodb://localhost:27017/gqapp", (err, db) => {
            if(err){
                console.log("Connection Failed");
                process.exit(1);
            }
            _db = db;
            console.log("Connected to Mongo");
        });
    },
    template() {
        return _db.collection('template');
    },
    lecture() {
        return _db.collection('lecture');
    },
    questions() {
        return _db.collection('questions');
    }
};
