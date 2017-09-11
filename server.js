// REQUIRE
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var sessionsModule = require('client-sessions');

// EXPRESS APP
var app = express();

// BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// STATIC
app.use(express.static('./public'));

// CONNECT TO MONGODB
mongoose.connect('mongodb://localhost/cigar_lounge', function(mongooseErr) {
    if( mongooseErr ) { console.error(mongooseErr); }
    else { console.info('Mongoose initialized!'); }
});

// USER SCHEMA
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    cigars: Number,
    unique_cigars: Number,
    created: {
        type: Date,
        default: function(){return new Date();}
    }
});

// USER MODEL

var UserModel = mongoose.model('User', UserSchema);

// LOGIN CHECK FUNCTIONS
var loginCheck = function(req, res, next){
    if(req.session._id){
        console.log('User Logged In');
        next();
    }
    else {
        console.log("No One Logged In");
        res.redirect('/');
    }
};

var loginCheckAjax = function(req,res,next){
        if(req.session._id){
            console.log('User Logged In');
            next();
        }
        else {
            console.log("No One Logged In");
            res.redirect({failure:'No One Logged In'});
        }
};

app.get('/', function (req, res){
    res.sendFile('/html/index.html', {root:'./public'});
});

app.get('/lounge', function (req, res){
    res.sendFile('/html/lounge.html', {root: './public'});
});

// APP LISTEN
app.listen(8080);
