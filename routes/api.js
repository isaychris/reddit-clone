const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const router = express.Router();

let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let Account = require("../models/account");


router.get('/r/:subreddit', function (req, res) {
    Post.find({
            subreddit: req.params.subreddit
        })
        .sort({
            votes: '-1'
        }).exec(function (err, doc) {
            if (err) throw err;

            if (doc.length) {
                res.json(doc)
            } else {
                res.status(404);
                res.json({
                    error: `Unable to find posts from /r/${req.params.subreddit}`
                })
            }
        })
});

router.get('/frontpage', function (req, res) {
    Post.find({}).sort({
        votes: '-1'
    }).exec(function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.json(doc)
        } else {
            res.status(404);
            res.json({
                error: `Unable to find posts.`
            })
        }
    })
})

router.get('/comment/:id', function (req, res) {
    Comment.find({
        _id: req.params.id
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.json(doc[0])
        } else {
            res.status(404);
            res.json({
                error: `Unable to find comment.`
            })
        }
    })
})

router.get('/post/:id', function (req, res) {
    Post.find({
        _id: req.params.id
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.json(doc[0])
        } else {
            res.status(404);
            res.json({
                error: `Unable to find post.`
            })
        }
    })
})

router.get('/post/:id/comments', function (req, res) {
    Comment.find({
        ref: req.params.id
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.json(doc)
        } else {
            res.status(404);
            res.json({
                error: `Unable to find any comments.`
            })
        }
    })
})

router.get('/u/:profile', function (req, res) {
    Profile.find({
        username: req.params.profile
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.json(doc[0])
        } else {
            res.status(404);
            res.json({
                error: `Unable to find info for /u/${req.params.profile}.`
            })
        }
    })
});

router.get('/u/:profile/posts', function (req, res) {
    Post.find({
        username: req.params.profile
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.json(doc)
        } else {
            res.status(404);
            res.json({
                error: `Unable to find posts for /u/${req.params.profile}.`
            })
        }
    })
});

router.get('/u/:profile/comments', function (req, res) {
    Comment.find({
        username: req.params.profile
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.json(doc)
        } else {
            res.status(404);
            res.json({
                error: `Unable to find post.`
            })
        }
    })
});

router.post('/register', function (req, res) {
    if (req.body.username && req.body.password) {
        req.body.username = req.body.username.toLowerCase();

        if (validator.isAlphanumeric(req.body.username)) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) throw err

                Account({
                    username: req.body.username,
                    password: hash,
                    created: Date.now()
                }).save(function (err, doc) {
                    if (err) {
                        console.log(err)
                        res.status(409);
                        res.json({
                            error: `Username '${req.body.username}' already exists.`
                        })
                    } else {
                        Profile({
                            username: req.body.username
                        }).save(function (err, doc) {
                            if (err) throw err

                            res.json({
                                success: `Username '${req.body.username}' was registered.`
                            })
                        })
                    }
                })
            })
        } else {
            res.status(400)
            res.json({
                error: `Username must only include alphanumeric characters.`
            })
        }
    } else {
        res.status(400)
        res.json({
            error: `Username and password is required.`
        })
    }
})

module.exports = router;