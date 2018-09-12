const express = require("express");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");

router.get('/:subreddit', function (req, res) {
    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (!doc.length) {
            res.send(`Error: Unable to find subreddit ${req.params.subreddit}`);

        } else {
            Post.find({
                subreddit: req.params.subreddit
            }, function (err, result) {
                if (err) throw err;

                if (!doc.length) {
                    res.render("subreddit", {
                        name: req.params.subreddit,
                    });
                } else {
                    console.log(result);
                    res.render("subreddit", {
                        name: req.params.subreddit,
                        posts: result
                    });
                }
            })
        }
    })
});

// when user views the comments for a post
router.get('/:subreddit/:id/', function (req, res) {
    Post.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (!doc.length) {
            res.send(`Error: Unable to find subreddit ${req.params.subreddit}`);

        } else {
            Comment.find({
                subreddit: req.params.subreddit
            }, function (err, result) {
                if (err) throw err;

                if (!doc.length) {
                    res.render("subreddit", {
                        name: req.params.subreddit,
                        posts: {}
                    });

                } else {
                    console.log(result);
                    res.render("subreddit", {
                        name: req.params.subreddit,
                        posts: result
                    });
                }
            })
        }
    })
});

// when user views the comments for a post
router.get('/:subreddit/:id/comments', function (req, res) {
    Post.find({
        subreddit: req.params.subreddit
    }, function (err, result) {
        if (err) throw err;

        if (!result.length) {
            res.render("subreddit", {
                name: req.params.subreddit,
            });
        } else {
            console.log(result[0]);
            res.render('view_post', {
                name: req.params.subreddit,
                post: result[0]
            });
        }
    })
});

// when user comments on a post
router.post('/:subreddit/:id/comments/submit', function (req, res) {});

// when user views a specific comment
router.get('/:subreddit/:id/comment/:comment_id', function (req, res) {});

// when user replies to a comment
router.post('/:subreddit/:id/comment/:comment_id/submit', function (req, res) {});

module.exports = router;