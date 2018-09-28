const express = require("express");
const router = express.Router();

let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");


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
                res.status(403);
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
            res.status(403);
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
            res.status(403);
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
            res.status(403);
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
            res.status(403);
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
            res.status(403);
            res.json({
                error: `Unable to find info for /u/${req.params.profile}`
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
            res.status(403);
            res.json({
                error: `Unable to find posts for /u/${req.params.profile}`
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
            res.status(403);
            res.json({
                error: `Unable to find post.`
            })
        }
    })
});

module.exports = router;