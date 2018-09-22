const express = require("express");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Profile = require("../models/profile");
let PostState = require("../models/postState")

// FETCHING POSTS
router.get('/', function (req, res) {
    let subscribed = undefined;
    let subreddits = undefined;
    let posts = undefined;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed'];
        }
    }).then(function () {
        Subreddit.find({}, function (err, doc) {
            if (err) throw err;

            if (doc.length) {
                subreddits = doc
            }
        }).then(function () {
            PostState.find({
                username: req.session.user
            }, function (err, doc) {
                if (err) throw err;

                if (doc.length) {
                    postStates = doc
                }
            }).then(function () {
                Post.find({}).sort({
                    votes: '-1'
                }).exec(function (err, result) {
                    if (err) throw err;
                    if (result.length) {
                        posts = result
                    }

                    console.log(`[Frontpage] fetching posts!`)
                    res.render("./front/front", {
                        posts: posts,
                        subreddits: subreddits,
                        subscribed: subscribed,
                        isAuth: req.isAuthenticated()
                    })
                });
            });
        });
    });
});

router.get('/submit/post', function (req, res) {
    let subscribed = undefined;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
        }

        res.render("./front/front_post", {
            isAuth: req.isAuthenticated(),
            subscribed: subscribed
        });
    })
});

router.get('/submit/link', function (req, res) {
    let subscribed = undefined;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
        }

        res.render("./front/front_link", {
            isAuth: req.isAuthenticated(),
            subscribed: subscribed
        });
    })
});


router.get('/submit/subreddit', function (req, res) {
    let subscribed = undefined;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
        }

        res.render("./front/front_subreddit", {
            isAuth: req.isAuthenticated(),
            subscribed: result[0]['subscribed']
        });
    })
});


// SUBMITING A POST
router.post('/submit/post', function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.text,
        username: req.session.user,
        type: "post",
        subreddit: req.body.subreddit,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[Frontpage] post submitted to [${req.body.subreddit}]`)
        res.redirect(`/r/${req.body.subreddit}/${doc._id}/comments`);
    });
});


// SUBMITING A LINK
router.post('/submit/link', function (req, res) {
    let type = "link"

    function checkURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    if (checkURL(req.body.link)) {
        type = "img"
    }

    Post({
        title: req.body.title,
        link: req.body.link,
        username: req.session.user,
        type: type,
        subreddit: req.body.subreddit,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[Frontpage] link submitted to [${req.body.subreddit}]`)
        res.redirect(`/r/${req.body.subreddit}/${doc._id}/comments`);
    });
});


// SUBMITING A SUBREDDIT
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

        }).then(function () {
        Subreddit({
            name: req.body.subreddit,
            description: req.body.description
        }).save(function (err, doc) {
            if (err) throw err

            console.log(`[Frontpage] ${req.body.subreddit} subreddit created`)
            res.redirect(`/r/${req.body.subreddit}`);
        });
    });
});

// SEARCHING FOR A POST
router.post('/search', function (req, res) {
    let subscribed = undefined;
    let subreddits = undefined;
    let posts = undefined;

    Profile.find({
            username: req.session.user
        }, function (err, result) {
            if (err) throw err;
            if (result.length) {
                subscribed = result[0]['subscribed'];
            }
        })
        .then(function () {
            Subreddit.find({}, function (err, doc) {
                    if (err) throw err;

                    if (doc.length) {
                        subreddits = doc
                    }
                })
                .then(function () {
                    Post.find({
                            title: {
                                $regex: '.*' + req.body.query + '.*',
                                $options: 'i'
                            }
                        })
                        .sort({
                            votes: '-1'
                        })
                        .exec(function (err, result) {
                            if (err) throw err;
                            if (result.length) {
                                posts = result
                            }

                            console.log(`[Frontpage] searching for posts which contain '{${req.body.query}}'`)
                            res.render("./front/front_search", {
                                posts: result,
                                subreddits: subreddits,
                                subscribed: subscribed,
                                query: req.body.query,
                                isAuth: req.isAuthenticated()
                            })
                        });
                });
        });
});
module.exports = router;