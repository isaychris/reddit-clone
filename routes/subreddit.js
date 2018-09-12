const express = require("express");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");

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
        }
    }).then(function () {
        Post.find({
            subreddit: req.params.subreddit
        }, function (err, result) {
            if (err) throw err;
            if (!result.length) {
                res.render("subreddit", {
                    info: subreddit,
                    posts: undefined
                });
            } else {
                if (result.length) {
                    res.render("subreddit", {
                        info: subreddit,
                        posts: result
                    });
                }
            }
        })
    });
});

router.get('/:subreddit/:id', function (req, res) {
    res.redirect(`/r/${req.params.subreddit}/${req.params.id}/comments`)
});

router.get('/:subreddit/:id/comments', function (req, res) {
    let info = undefined;
    let comments = undefined;

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            info = doc[0];
        }
    }).then(function () {

        Comment.find({
            parent: req.params.id
        }, function (err, doc) {
            if (err) throw err;

            if (!doc.length) {
                console.log('yes comments were found');

            } else {
                comments = doc;
                console.log('yes comments were found');
                console.log(doc);
            }
        })
    }).then(function () {

        Post.find({
            _id: req.params.id
        }, function (err, result) {
            if (err) throw err;

            if (!result.length) {
                res.send("not found")

            } else {
                console.log(result[0]);
                res.render('post', {
                    info: info,
                    post: result[0],
                    comments: comments,
                    isAuth: req.isAuthenticated()
                });
            }
        })
    });
});

router.post('/:subreddit/:id/comments', function (req, res) {
    Comment({
        body: req.body.comment,
        time: "now",
        username: "isaychris",
        parent: req.params.id,
        votes: 0
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating comment")

        } else {
            res.redirect(`/r/${req.params.subreddit}/${req.params.id}/comments`)
        }
    });
});

router.get('/:subreddit/:id/delete', function (req, res) {
    // remove the document in the database that matches the id.
    Post.find({
        _id: req.params.id
    }).remove(function (err, doc) {
        if (err) throw err;

        // send response back with the document object that was deleted
        res.send(doc);
    });
});

router.get('/:subreddit/submit/post', function (req, res) {
    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.render('submit_post', {
                info: doc[0]
            });
        }
    });

});

router.post('/:subreddit/submit/post', function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.body,
        time: "now",
        username: "isaychris",
        type: "post",
        subreddit: req.params.subreddit,
        votes: 0
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating post")

        } else {
            res.redirect(`/r/${req.params.subreddit}`);
        }
    });
});

router.post('/:subreddit/submit/link', function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.body,
        time: "",
        username: "isaychris",
        type: "link",
        link: req.body.link,
        subreddit: req.params.subreddit,
        votes: 0
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating link")

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
            res.render('submit_link', {
                info: doc[0]
            });
        }
    });


});

// when user views a specific comment
router.get('/:subreddit/:id/comment/:comment_id', function (req, res) {});

// when user replies to a comment
router.post('/:subreddit/:id/comment/:comment_id', function (req, res) {});

module.exports = router;