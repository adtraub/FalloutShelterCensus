
var express = require('express');
var app = express();
var path = require('path'); //used to resolve paths of relative files
var port = 8080

//allows html file to reference files in external folders
app.use(express.static(path.join(__dirname + '/css')));
app.use(express.static(path.join(__dirname + '/js')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);

console.log("Now listening on port " + port);
