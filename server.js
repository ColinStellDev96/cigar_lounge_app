// REQUIRE
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var sessionsModule = require('client-sessions');

// EXPRESS APP
var app = express();

// CONNECT TO MONGODB
mongoose.connect('mongodb://localhost/cigar_lounge', function(mongooseErr) {
    if( mongooseErr ) { console.error(mongooseErr); }
    else { console.info('Mongoose initialized!'); }
});

// BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// STATIC
app.use(express.static('./public'));

app.get('/', function (req, res){
    res.sendFile('/html/index.html', {root:'./public'});
});

app.get('/lounge', function (req, res){
    res.sendFile('/html/lounge.html', {root: './public'});
});

// APP LISTEN
app.listen(8080);
