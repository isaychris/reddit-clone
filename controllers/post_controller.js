let Post = require("../models/post");
let Profile = require("../models/profile");
let PostState = require("../models/postState")

exports.check = function (req, res) {
    PostState.find({
        username: req.session.user
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            res.send(doc)
        }
    })
}

exports.edit = function (req, res) {
    Post.update({
        _id: req.params.id
    }, {
        body: req.body.text
    }, function (err, result) {
        if (err) throw err;

        console.log(`[${req.params.id}] post edited!`)
        res.send("success")
    })
}

exports.delete = function (req, res) {
    Post.find({
            _id: req.params.id
        })
        .remove(function (err, doc) {
            if (err) throw err;

            console.log(`[${req.params.id}] post deleted!`)
            res.send(doc);
        });
}

exports.save = function (req, res) {
    Profile.update({
        username: req.session.user
    }, {
        $push: {
            saved_posts: req.params.id
        }
    }, function (err, doc) {
        if (err) throw err;
    });

    let query = {
        username: req.session.user,
        ref: req.params.id
    };
    let update = {
        saved: true
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    PostState.findOneAndUpdate(query, update, options, function (error, doc) {
        if (error) throw error;

        if (doc) {
            console.log(`[${req.params.id}] post saved!`)
        }
        res.send("success")

    })
}

exports.unsave = function (req, res) {
    let query = {
        username: req.session.user,
        ref: req.params.id
    };
    let update = {
        saved: false
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    Profile.update({
        username: req.session.user
    }, {
        $pull: {
            saved_posts: req.params.id
        }
    }, function (err, doc) {
        if (err) throw err;
    });

    PostState.findOneAndUpdate(query, update, options, function (error, doc) {
        if (error) throw error;

        if (doc) {
            console.log(`[${req.params.id}] post unsaved!`)
        }
        res.send("success")

    })
}

exports.vote = function (req, res) {
    console.log(req.params.id)


    if (req.body.action == "increment") {
        console.log("increment")
        Profile.update({
            username: req.body.user
        }, {
            $inc: {
                karma_post: 1
            }
        }, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.session.user}] post karma increased!`)
            }
        });
    } else if (req.body.action == "decrement") {
        console.log("decrement")

        Profile.update({
            username: req.body.user
        }, {
            $inc: {
                karma_post: -1
            }
        }, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.session.user}] post karma decreased!`)
            }
        });
    }

    let query = {
        username: req.session.user,
        ref: req.params.id
    };
    let update = {
        vote: req.body.state
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    Post.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.params.id}] post vote count changed!`)
        }
    })


    PostState.findOneAndUpdate(query, update, options, function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.params.id}] post vote count changed!`)
            res.send("OK")
        }
    })
}