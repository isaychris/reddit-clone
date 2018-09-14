const express = require("express");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");

// SUBREDDIT
router.get('/:subreddit/:id', function (req, res) {
    res.redirect(`/r/${req.params.subreddit}/${req.params.id}/comments`)
});

router.get('/:subreddit', function (req, res) {
    let subreddit = undefined

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;
        if (!doc.length) {
            res.send("unable to find subreddit")
        } else {
            subreddit = doc[0]
            console.log(subreddit)
        }
    }).then(function () {
        Post.find({
            subreddit: req.params.subreddit
        }).sort({
            votes: '-1'
        }).exec(function (err, result) {
            if (err) throw err;
            if (!result.length) {
                res.render("subreddit", {
                    info: subreddit,
                    posts: undefined,
                    isAuth: req.isAuthenticated()
                });
            } else {
                if (result.length) {
                    res.render("subreddit", {
                        info: subreddit,
                        posts: result,
                        isAuth: req.isAuthenticated()
                    });
                }
            }
        })
    });
});

// COMMENTS
router.get('/:subreddit/:id/comments', function (req, res) {
    let info = undefined;
    let post = undefined;

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            info = doc[0];
        }
    }).then(function () {
        Post.find({
            _id: req.params.id
        }, function (err, doc) {
            if (err) throw err;

            if (!doc.length) {
                res.send("NO POST FOUND??")
            } else {
                post = doc[0]
            }
        }).then(function () {
            Comment.find({
                parent: req.params.id
            }, function (err, doc) {
                if (err) throw err;

                if (!doc.length) {
                    console.log('NO COMMENTS FOUND??');
                }

                res.render('post', {
                    info: info,
                    post: post,
                    comments: doc,
                    isAuth: req.isAuthenticated()
                });
            });
        });
    });
});

router.post('/:subreddit/:id/comments', function (req, res) {
    Comment({
        body: req.body.comment,
        username: req.session.user,
        parent: req.params.id,
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating comment")

        } else {
            res.redirect(`/r/${req.params.subreddit}/${req.params.id}/comments`)
        }
    });
});

router.get('/:subreddit/submit/post', function (req, res) {
    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.render('subreddit_post', {
                info: doc[0],
                isAuth: req.isAuthenticated(),
            });
        }
    });

});

router.post('/:subreddit/submit/post', function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: "post",
        subreddit: req.params.subreddit,
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating post")

        } else {
            res.redirect(`/r/${req.params.subreddit}`);
        }
    });
});


router.get('/:subreddit/submit/link', function (req, res) {
    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.render('subreddit_link', {
                info: doc[0],
                isAuth: req.isAuthenticated(),
            });
        }
    });

});

router.post('/:subreddit/submit/link', function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: "link",
        link: req.body.link,
        subreddit: req.params.subreddit,
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating link")

        } else {
            res.redirect(`/r/${req.params.subreddit}`);
        }
    });
});


module.exports = router;