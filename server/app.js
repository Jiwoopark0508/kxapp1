"use strict";

let express = require('express');
let app = express();

let port = process.env.port || 9000;

app.use( express.static( __dirname + '/../client' ));

app.get('/home', (req, res) => {
    res.json("Hello");
});
app.get('/type', (req, res) => {
    res.json({name: "이해/분석", id:1});
});
app.get('/type/:typeid', (req, res) => {
    res.json(["...를 어떻게 하는지 설명해라", "왜 ...인지 해석하라"]);
});
app.listen(port, () => console.log("listening on port 9000"));
