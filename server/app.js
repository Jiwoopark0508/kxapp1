"use strict";

let express = require('express');
let app = express();

let port = process.env.port || 9000;

app.use( express.static( __dirname + '/../client' ));

app.get('/home', (req, res) => {
    res.json("Hello");
});
app.listen(port, () => console.log("listening on port 9000"));
