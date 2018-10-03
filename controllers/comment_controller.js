let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let CommentState = require("../models/commentState")


exports.check = function (req, res) {
    CommentState.find({
        username: req.session.user
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            res.send(doc)
        }
    })
}
exports.comment = function (req, res) {
    Post.update({
        _id: req.params.id
    }, {
        $inc: {
            num_of_comments: 1
        }
    }, function (err, result) {
        if (err) throw err;

        if (!result.length) {
            console.log("something went wrong")
        }
        if (result.length) {
            console.log(`[${req.params.subreddit}] number of comment updated!`)
        }
    })

    Comment({
        body: req.body.comment,
        username: req.session.user,
        ref: req.params.id,
    }).save(function (err, doc) {
        if (err) throw err

        console.log(`[${req.params.subreddit}] comment posted!`)
        res.redirect(`/r/${req.params.subreddit}/${req.params.id}/comments`)
    })
}

exports.edit = function (req, res) {
    Comment.update({
        _id: req.params.id
    }, {
        body: req.body.text
    }, function (err, result) {
        if (err) throw err;

        console.log(`[${req.params.id}] comment edited!`)
        res.send("success")
    })
}

exports.delete = function (req, res) {
    Comment.find({
        _id: req.params.id
    }).exec().then((result) => {
        Post.update({
            _id: result[0]['ref']
        }, {
            $inc: {
                num_of_comments: -1
            }
        }, function (err, result) {
            if (err) throw err;

            if (result.length) {
                console.log(`[${req.params.subreddit}] number of comment updated!`)
            }
        })
    }).catch((err) => {
        console.log(err)
    })

    Comment.find({
            _id: req.params.id
        })
        .remove(function (err, doc) {
            if (err) throw err;

            console.log(`[${req.params.id}] comment deleted!`)
            res.send("OK");
        });
}

exports.save = function (req, res) {
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

    Profile.update({
        username: req.session.user
    }, {
        $push: {
            saved_comments: req.params.id
        }
    }, function (err, doc) {
        if (err) throw err;
    });

    CommentState.findOneAndUpdate(query, update, options, function (error, doc) {
        if (error) throw error;

        if (doc) {
            console.log(`[${req.params.id}] comment saved!`)
            res.send("success")
        }
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
            saved_comments: req.params.id
        }
    }, function (err, doc) {
        if (err) throw err;
    });

    CommentState.findOneAndUpdate(query, update, options, function (error, doc) {
        if (error) throw error;

        if (doc) {
            console.log(`[${req.params.id}] comment unsaved!`)
            res.send("success")
        }
    })
}

exports.vote = function (req, res) {
    if (req.body.action == "increment") {
        console.log("increment")
        Profile.update({
            username: req.body.user
        }, {
            $inc: {
                karma_comment: 1
            }
        }, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.session.user}] comment karma increased!`)
            }
        });
    } else if (req.body.action == "decrement") {
        console.log("decrement")

        Profile.update({
            username: req.body.user
        }, {
            $inc: {
                karma_comment: -1
            }
        }, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.session.user}] comment karma decreased!`)
            }
        });
    }

    Comment.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.params.id}] comment vote count changed!`)
        }
    });

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

    CommentState.findOneAndUpdate(query, update, options, function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.session.user}] comment state set!`)
            res.send("OK")
        }
    })
}