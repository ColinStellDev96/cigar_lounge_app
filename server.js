// REQUIRE
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var sessionsModule = require('client-sessions');
var multer = require('multer');
var child_process = require('child_process');

// EXPRESS APP
var app = express();

// BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// STATIC
app.use(express.static('./public'));

// CONNECT TO MONGODB
mongoose.connect('mongodb://localhost/cigar_lounge', function(mongooseErr) {
    if (mongooseErr) {
        console.error(mongooseErr);
    } else {
        console.info('Mongoose initialized!');
    }
});

// USER SCHEMA
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    cigars: {
        type: Array,
        default: []
    },
    created: {
        type: Date,
        default: function() {
            return new Date();
        }
    },
    imgpath: String
}, {minimize: false});

// USER MODEL
var UserModel = mongoose.model('User', UserSchema);

//CIGAR Schema
var CigarSchema = new mongoose.Schema({
    brand: String,
    name: String,
    size: String,
    gauge: Number,
    wrapper: String,
    origin: String,
    img_url: String,
    buy_url: String,
    url_copy: String
}, {collection: 'cigar_data'});

// CIGAR MODEL
var CigarModel = mongoose.model('Cigar', CigarSchema, 'cigar_data');

// LOGIN CHECK FUNCTIONS
var loginCheck = function(req, res, next) {
    if (req.session._id) {
        console.log('User Logged In');
        next();
    } else {
        console.log("No One Logged In");
        res.redirect('/');
    }
};

var loginCheckAjax = function(req, res, next) {
    if (req.session._id) {
        console.log('User Logged In');
        next();
    } else {
        console.log("No One Logged In");
        res.redirect({failure: 'No One Logged In'});
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

app.use(function(req, res, next) {
    console.log('session?', req.session);
    next();
});

//SIGN-UP FRONT-END/BACK-END CONNECTION
app.post('/signup', function(req, res) {
    var newUser = new UserModel(req.body);
    console.log(newUser);
    bcrypt.genSalt(11, function(saltErr, salt) {
        if (saltErr) {
            console.log(saltErr);
        }
        console.log('salt generated: ', salt);

        bcrypt.hash(newUser.password, salt, function(hashErr, hashedPassword) {
            if (hashErr) {
                console.log(hashErr);
            }
            newUser.password = hashedPassword;

            newUser.save(function(saveErr, user) {
                if (saveErr) {
                    console.log(saveErr);
                } else {
                    req.session._id = user._id;
                    res.send({success: 'success!'});
                }
            });
        });
    });
});

// LOGIN FRONT-END/BACK-END CONNECTION
app.post('/login', function(req, res) {
    UserModel.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            console.log('Username Not Found');
        } else if (!user) {
            console.log('User Not Found');
            res.send(alert('Failed To Log In'));
        } else {
            bcrypt.compare(req.body.password, user.password, function(bcryptErr, matched) {
                if (bcryptErr) {
                    console.log(bcryptErr);
                } else if (!matched) {
                    console.log('Password Does Not Match');
                    res.send('Failed To Login');
                } else {
                    req.session._id = user._id;
                    res.send({success: 'success'});
                }
            });
        }
    });
});

// ROUTING
app.get('/', function(req, res) {
    res.sendFile('/html/index.html', {root: './public'});
});

app.get('/dashboard', loginCheck, function(req, res) {
    // res.sendFile('/html/lounge.html', {root:'./public'});
    UserModel.findOne({
        _id: req.session._id
    }, function(err, user) {
        if (err) {
            console.log('err?', err);
        } else if (user) {
            console.log(user);
            res.sendFile('/html/dashboard.html', {root: './public'});
        } else {
            res.redirect('/');
        }
    });
});

// HUMIDOR CIGAR DATA
app.get('/cigars', function(req, res) {
    CigarModel.find({}, function(err, data) {
        // console.log('cigars', data);
        res.send(data);
    });
});

//USER INFO
app.get('/me', loginCheckAjax, function(req, res) {
    UserModel.findOne({
        _id: req.session._id
    }, function(err, user) {
        res.send(user);
    });
});

/*
Model.findAndUpdate(query, modifier, options, callback)
*/

// ADDING CIGARS TO USER DATA
app.put('/me', function(req, res) {
    console.log(req.body);
    UserModel.findOneAndUpdate({
        _id: req.session._id,
        'cigars.id': req.body.cigar
    }, {
        $inc: {
            "cigars.$.count": 1
        }
    }, function(err, user) {
        if (err) {
            res.send('error');
        } else if (!user) {
            console.log('not user');
            UserModel.findOneAndUpdate({
                _id: req.session._id
            }, {
                $push: {
                    cigars: {
                        id: req.body.cigar,
                        count: 1
                    }
                }
            }, {
                new: true,
                upsert: true
            }, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send('error');
                }
                console.log("here's data", data);
                res.send(data);
            });
        } else {
            res.send(user);
        }
    });
});

app.put('/delete', function(req, res) {
    console.log('body', req.body);
    UserModel.findOneAndUpdate({
        _id: req.session._id,
        'cigars.id': req.body.cigar
    }, {
        $inc: {
            "cigars.$.count": -1
        }
    }, function(err, user) {
        console.log('err', err, 'user', user);
        if (err) {
            res.send('error');
        } else if (!user) {
            res.send();
        } else {
            UserModel.findOneAndUpdate({
                _id: req.session._id,
                'cigars.count': {
                    $lt: 1
                }
            }, {
                $pull: {
                    cigars: {
                        id: req.body.cigar
                    }
                }
            }, function(err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(data);
                }
            });
        }
    });
});

/*
Model.find(query, projection, callback(err, data))
*/

app.get('/cigars_enjoyed', function(req, res) {
    UserModel.findOne({
        _id: req.session._id
    }, function(err, user) {
        var cigarArr = user.cigars.map(cigar => cigar.id);
        console.log("cigarArr", cigarArr);
        CigarModel.find({
            _id: {
                $in: cigarArr
            }
        }, function(err, data) {
            //  console.log('data', data);
            res.send(data);
        });
    });
});

//PHOTO UPLOAD
app.post('/profile-photo', multer({dest: './public/imgs/'}).single('profile-pic'), function(req, res) {
    // console.log('body?', req.body);
    // console.log('files?', req.file);
    UserModel.findOne({
        _id: req.session._id
    }, function(err, user) {
        child_process.exec(`mv "${__dirname}/public/imgs/${req.file.filename}" "${__dirname}/public/imgs/pic${user.username}.${req.file.mimetype.split('/')[1]}"`);
        user.imgpath = `/imgs/pic${user.username}.${req.file.mimetype.split('/')[1]}`;
        user.save(function(err) {
            if (err) {
                res.send('error');
            } else {
                res.send('photo upload success');
            }
        });
    });

});

// LOGOUT
app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
});

// APP LISTEN
app.listen(80);
