let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");

exports.get_all = function (req, res) {
    let subreddit = undefined;
    let posts = undefined;
    let subscribed = false;
    let karma = 0

    let sort = undefined;

    switch (req.query.sort) {
        case "top":
            sort = {
                votes: -1
            }
            break;
        case "new":
            sort = {
                time: -1
            }
            break;
        case "old":
            sort = {
                time: 1
            }
            break;
        default:
            sort = {
                votes: -1
            }
    }

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            subreddit = doc[0]
        } else {
            res.render("./error")
        }
    }).then(function () {
        Profile.find({
            username: req.session.user,
            subscribed: req.params.subreddit,
        }, function (err, doc) {
            if (err) throw err;

            if (!doc.length) {
                // res.send("Unable to find subreddit state")
                return;
            } else {
                subscribed = true
            }
        }).then(function () {
            Post.find({
                subreddit: req.params.subreddit
            }).sort(sort).exec(function (err, result) {
                if (err) throw err;
                if (result.length) {
                    posts = result
                }

                console.log(`[${req.params.subreddit}] fetching posts!`)
                res.render("./subreddit/subreddit", {
                    info: subreddit,
                    posts: posts,
                    karma: karma,
                    state: subscribed,
                    isAuth: req.isAuthenticated()
                })
            });
        });
    });
}

exports.get_post = function (req, res) {
    let info = undefined
    let post = undefined
    let comments = undefined
    let subscribed = false;
    let karma = 0

    let sort = undefined;

    switch (req.query.sort) {
        case "top":
            sort = {
                votes: -1
            }
            break;
        case "new":
            sort = {
                time: -1
            }
            break;
        case "old":
            sort = {
                time: 1
            }
            break;
        default:
            sort = {
                votes: -1
            }
    }

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            info = doc[0]
        }
    }).then(function () {
        Profile.find({
            username: req.session.user,
            subscribed: req.params.subreddit,
        }, function (err, doc) {
            if (err) throw err;

            if (!doc.length) {
                // res.send("Unable to find subreddit state")
                return;
            } else {
                subscribed = true
            }
        }).then(function () {
            Post.find({
                _id: req.params.id
            }, function (err, doc) {
                if (err) {
                    res.render('./error')
                } else {
                    if (doc.length) {
                        post = doc[0]
                    }
                }
            }).then(function () {

                Comment.find({
                    ref: req.params.id
                }).sort(sort).exec(function (err, result) {
                    if (err) throw err;
                    if (result.length) {
                        comments = result
                    }

                    res.render('./post', {
                        info: info,
                        post: post,
                        karma: karma,
                        comments: comments,
                        state: subscribed,
                        isAuth: req.isAuthenticated()
                    })
                })
            })
        })
    })
}

// CHECKING SUBREDDIT
exports.check_subreddit = function (req, res) {
    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (!doc.length) {
            res.send(false);
            return;
        }
        console.log(`[${req.params.subreddit}] checked!`)
        res.send(true);
    });
}

// SUBSCRIBING TO SUBREDDIT
exports.subscribe = function (req, res) {
    Profile.update({
        username: req.session.user
    }, {
        $push: {
            subscribed: req.params.subreddit
        }
    }, function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.subreddit}] subscription added!`)
        res.send('success!')
    })
}

// UNSUBSCRIBE FROM SUBREDDIT
exports.unsubscribe = function (req, res) {
    Profile.update({
        username: req.session.user
    }, {
        $pull: {
            subscribed: req.params.subreddit
        }
    }, function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.subeddit}] subscription removed!`)
        res.send('success!')
    })
}