const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

let Account = require("../models/account")

router.get('/settings', authenticateUser(), function (req, res) {
    if (req.isAuthenticated()) {
        res.render('./settings')
    } else {
        res.render('./login')
    }
});

router.put('/settings/change/password', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) throw err

        Account.update({
            username: req.session.user
        }, {
            password: hash
        }, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.session.user}] password changed!`)
                res.send("OK")
            }
        });
    });
});

router.delete('/settings/delete/account', function (req, res) {
    Account.find({
        username: req.session.user
    }).remove(function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.session.user}] account deleted!`)
            res.send("OK")
        }
    });
});

function authenticateUser() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("login");
    };
}
module.exports = router