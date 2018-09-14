const express = require("express");
const router = express.Router();

let Post = require("../models/post");
let Profile = require("../models/profile");
let Subreddit = require("../models/subreddit");

router.get('/', function (req, res) {
    let subscribed = [];
    let subreddits = [];

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;
        if (!result.length) {
            subscribed = undefined
        } else {
            subscribed = result[0]['subscribed'];
        }
    }).then(function () {
        Subreddit.find({}, function (err, doc) {
            if (err) throw err;

            if (!doc.length) {
                console.log("CANT FIND ANY SUBREDDITS")
                subreddits = undefined
            } else {
                subreddits = doc
            }
        })
    }).then(function () {
        Post.find({}).sort({
            votes: '-1'
        }).exec(function (err, result) {
            if (err) throw err;
            if (!result.length) {
                res.render("index", {
                    posts: undefined,
                    subreddits: subreddits,
                    subscribed: subscribed,
                    isAuth: req.isAuthenticated()
                });
            } else {
                res.render("index", {
                    posts: result,
                    subreddits: subreddits,
                    subscribed: subscribed,
                    isAuth: req.isAuthenticated()
                })
            }
        })
    })
});



router.get('/submit/post', function (req, res) {
    let subscribed = [];

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;
        if (!result.length) {
            res.render("index_post", {
                isAuth: req.isAuthenticated(),
                subscribed: undefined
            });
        } else {
            res.render("index_post", {
                isAuth: req.isAuthenticated(),
                subscribed: result[0]['subscribed']
            });
        }
    })
});

router.get('/submit/link', function (req, res) {
    let subscribed = [];

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;
        if (!result.length) {
            res.render("index_link", {
                isAuth: req.isAuthenticated(),
                subscribed: undefined
            });
        } else {
            console.log(subscribed)
            res.render("index_link", {
                isAuth: req.isAuthenticated(),
                subscribed: result[0]['subscribed']
            });
        }
    })
});


router.get('/submit/subreddit', function (req, res) {
    let subscribed = [];
    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;
        if (!result.length) {
            res.render("index_subreddit", {
                isAuth: req.isAuthenticated(),
                subscribed: undefined
            });
        } else {
            console.log(subscribed)
            res.render("index_subreddit", {
                isAuth: req.isAuthenticated(),
                subscribed: result[0]['subscribed']
            });
        }
    })
});

router.post('/submit/post', function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.text,
        username: req.session.user,
        type: "post",
        subreddit: req.body.subreddit,
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating post")

        } else {
            res.redirect(`/r/${req.body.subreddit}/${doc._id}/comments`);
        }
    });
});

router.post('/submit/link', function (req, res) {
    Post({
        title: req.body.title,
        link: req.body.link,
        username: req.session.user,
        type: "link",
        subreddit: req.body.subreddit,
    }).save(function (err, doc) {
        if (err) {
            res.send("error creating link")
        } else {
            res.redirect(`/r/${req.body.subreddit}/${doc._id}/comments`);
        }
    });
});


router.post('/submit/subreddit', function (req, res) {
    Profile.update({
            username: req.session.user
        }, {
            $push: {
                owned: req.body.subreddit
            }
        },
        function (err, doc) {
            if (err) throw err;
            console.log("subscription added!");

        }).then(function () {
        Subreddit({
            name: req.body.subreddit,
            description: req.body.description
        }).save(function (err, doc) {
            if (err) {
                res.send("error creating subreddit")

            } else {
                res.redirect(`/r/${req.body.subreddit}`);
            }
        });
    });
});


// DELETING POST
router.delete('/delete/:id', function (req, res) {
    Post.find({
        _id: req.params.id
    }).remove(function (err, doc) {
        if (err) throw err;

        console.log("post deleted!")
        // send response back with the document object that was deleted
        res.send(doc);
    });
    //     res.redirect(`/r/${req.params.subreddit}`)
});


// SAVE POST
router.put('/save/:id', function (req, res) {
    console.log("attempting to save");
    Profile.update({
            username: req.session.user
        }, {
            $push: {
                saved_posts: req.params.id
            }
        },
        function (err, doc) {
            if (err) throw err;
            console.log("post saved!");

            // send response back with the document object that was edited
            res.send(doc);
        });
});

// UNSAVE POST
router.put('/unsave/:id', function (req, res) {
    console.log("attempting to save");
    Profile.update({
            username: req.session.user
        }, {
            $pull: {
                saved_posts: req.params.id
            }
        },
        function (err, doc) {
            if (err) throw err;
            console.log("post unsaved!");

            // send response back with the document object that was edited
            res.send(doc);
        });
});

// VOTING
router.put('/vote/:id', function (req, res) {
    Post.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;
    })
});


module.exports = router;