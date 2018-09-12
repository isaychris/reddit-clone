const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport")
const db = require("./configs/database");
const app = express();

app.set('view engine', 'ejs');

// making the connection to mongo database
mongoose.connect(db.config.uri, db.config.options);

// middlewares for express routes
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

app.use(passport.initialize());
app.use(passport.session());

// express routes that exist
app.use('/', require('./routes/auth'));
app.use('/u/', require('./routes/auth'));
app.use('/r/', require('./routes/subreddit'));

// functions for persistant sessions
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

// frontpage route
app.get('/', function (req, res) {
    res.redirect('/r/front')
});

app.listen(process.env.PORT || 5000, function () {
    console.log("listening on port 5000!");
});