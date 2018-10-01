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

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.isauth = req.isAuthenticated();
    next();
});

// express routes that exist
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/front'));
app.use('/', require('./routes/index'));
app.use('/', require('./routes/settings'));
app.use('/r/', require('./routes/subreddit'));
app.use('/u/', require('./routes/profile'));
app.use('/api', require('./routes/api'));


app.get('*', function (req, res) {
    res.status(404);
    res.render("./error")
});

// functions for persistant sessions
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

app.listen(process.env.PORT || 5000, function () {
    console.log("listening on port 5000!");
});