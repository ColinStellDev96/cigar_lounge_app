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
    if(mongooseErr) {console.error(mongooseErr);}
    else {console.info('Mongoose initialized!');}
});

// USER SCHEMA
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    cigars: 0,
    unique_cigars: 0,
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

// COOKIES SETUP
app.use(sessionsModule({
    cookieName: 'app-cookie',
    secret: '$T0G1E1689',
    requestKey: 'session',
    duration: (86400 * 1000) * 7, // ONE WEEK
    cookie: {
        ephemeral: false,
        httpOnly: true,
        secure: false
        }
}));

app.use(function (req, res, next){
    console.log('session?', req.session);
    next();
});

//SIGN-UP FRONT-END/BACK-END CONNECTION
app.post('/signup', function(req, res){
    var newUser = new UserModel(req.body);
    bcrypt.genSalt(11, function(saltErr, salt){
        if (saltErr) {console.log(saltErr);}
        console.log('salt generated: ', salt);

        bcrypt.hash(newUser.password, salt, function (hashErr, hashedPassword){
            if (hashErr){console.log(hashErr);}
            newUser.password = hashedPassword;

            newUser.save(function(saveErr, user){
                if (saveErr) {console.log(saveErr);}
                else {
                    req.session._id = user._id;
                    res.send({success:'success!'});
                }
            });
        });
    });
});

// LOGIN FRONT-END/BACK-END CONNECTION
app.post('/login', function (req, res){
    UserModel.findOne({username: req.body.username}, function(err, user){
        if (err) {console.log('Username Not Found');}
        else if (!user) {
            console.log('User Not Found');
            res.send(alert('Failed To Log In'));
        }
        else {
            bcrypt.compare(req.body.password, user.password, function(bcryptErr, matched){
                if (bcryptErr) {console.log(bcryptErr);}
                else if (!matched) {
                    console.log('Password Does Not Match');
                    res.send(alert('Failed To Login'));
                }
                else {
                    req.session._id = user._id;
                    res.send({success:'success'});
                }
            });
        }
    });
});

// ROUTING
app.get('/', function (req, res){
    res.sendFile('/html/index.html', {root:'./public'});
});

app.get('/dashboard', loginCheck, function (req, res){
    // res.sendFile('/html/lounge.html', {root:'./public'});
    UserModel.findOne({_id:req.session._id}, function(err, user){
        if(err){console.log('err?', err);}
        else if (user) {
            console.log(user);
            res.sendFile('/html/dashboard.html', {root: './public'});
        }
        else {
            res.redirect('/');
        }
    });
});

app.get('/me', loginCheckAjax, function (req, res){
    UserModel.findOne({_id:req.session._id}, function(err, user){
        res.send(user);
    });
});

// LOGOUT
app.get('/logout', function (req,res){
    req.session.reset();
    res.redirect('/');
});

// APP LISTEN
app.listen(8080);
