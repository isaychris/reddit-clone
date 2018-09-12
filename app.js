const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./configs/database");
const app = express();

app.set('view engine', 'ejs');

// making the connection to mongo database
mongoose.connect(db.config.uri, db.config.options);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// express routes that exist
app.use('/', require('./routes/auth'));
app.use('/u/', require('./routes/auth'));
app.use('/r/', require('./routes/subreddit'));

// frontpage route
app.get('/', function (req, res) {
    res.redirect('/r/front')
});

app.listen(process.env.PORT || 5000, function () {
    console.log("listening on port 5000!");
});