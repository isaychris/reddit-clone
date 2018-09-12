const express = require("express");
const router = express.Router();

let Info = require("../models/Info");

// when user views a user profile
router.get('/:username', function (req, res) {
    // display the users posts and comments here.

});

module.exports = router;