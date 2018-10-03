const bcrypt = require("bcrypt");
let Profile = require("../models/profile");
let Account = require("../models/account");

exports.view = function (req, res) {
    if (req.isAuthenticated()) {
        Profile.find({
            username: req.session.user
        }, function (err, result) {
            if (err) throw err;

            if (result.length) {
                karma = result[0]['karma_post'] + result[0]['karma_comment']
                res.render('./settings', {
                    karma: karma
                })
            }
        })
    } else {
        res.render('./login')
    }
}
exports.change_password = function (req, res) {
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
}

exports.delete_account = function (req, res) {
    Account.find({
        username: req.session.user
    }).remove(function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.session.user}] account deleted!`)
            res.send("OK")
        }
    });
}