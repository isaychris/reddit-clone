let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Profile = require("../models/profile");

exports.subreddit_post_view = function (req, res) {
    let subscribed = false
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });

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
        Subreddit.find({
            name: req.params.subreddit
        }, function (err, doc) {
            if (err) throw err

            if (doc.length) {
                res.render('./subreddit/subreddit_post', {
                    info: doc[0],
                    karma: karma,
                    state: subscribed,
                    isAuth: req.isAuthenticated(),
                })
            }
        })
    })
}
exports.subreddit_post = function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: "post",
        subreddit: req.params.subreddit,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.subreddit}] post submitted!`)
        res.redirect(`/r/${req.params.subreddit}`)
    })
}
exports.subreddit_link_view = function (req, res) {
    let subscribed = false;
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });


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
        Subreddit.find({
            name: req.params.subreddit
        }, function (err, doc) {
            if (err) throw err

            if (doc.length) {
                res.render('./subreddit/subreddit_link', {
                    info: doc[0],
                    karma: karma,
                    state: subscribed,
                    isAuth: req.isAuthenticated(),
                })
            }
        })
    })
}
exports.subreddit_link = function (req, res) {
    let type = "link"

    function checkURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    if (checkURL(req.body.link)) {
        type = "img"
    }

    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: type,
        link: req.body.link,
        subreddit: req.params.subreddit,
    }).save(function (err, doc) {
        if (err) throw error;

        console.log(`[${req.params.subreddit}] link submitted!`)
        res.redirect(`/r/${req.params.subreddit}`)
    })
}

exports.subreddit_search = function (req, res) {
    let subreddit = undefined
    let posts = undefined
    let subscribed = false
    let karma = 0

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
            subreddit = doc[0]
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
                $and: [{
                        subreddit: req.params.subreddit
                    },
                    {
                        title: {
                            $regex: '.*' + req.body.query + '.*',
                            $options: 'i'
                        }
                    }
                ]
            }).sort({
                votes: '-1'
            }).exec(function (err, result) {
                if (err) throw err;
                if (result.length) {
                    posts = result
                }

                console.log(`[${req.params.subreddit}] searching for posts which contain '{${req.body.query}}'`)
                res.render("./subreddit/subreddit_search", {
                    info: subreddit,
                    posts: result,
                    karma: karma,
                    state: subscribed,
                    query: req.body.query,
                    isAuth: req.isAuthenticated(),
                })
            })
        })
    })
}


// SUBMITING A POST
exports.front_post = function (req, res) {
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
}

// SUBMITING A LINK
exports.front_link = function (req, res) {
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
}


// SUBMITING A SUBREDDIT
exports.subreddit = function (req, res) {
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
}

// SEARCHING FOR A POST
exports.front_search = function (req, res) {
    let subscribed = undefined;
    let subreddits = undefined;
    let posts = undefined;
    let karma = 0;

    Profile.find({
            username: req.session.user
        }, function (err, result) {
            if (err) throw err;
            if (result.length) {
                subscribed = result[0]['subscribed'];
                karma = result[0]['karma_post'] + result[0]['karma_comment']
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
                                karma: karma,
                                query: req.body.query,
                                isAuth: req.isAuthenticated()
                            })
                        });
                });
        });
}

exports.front_post_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']

        }

        res.render("./front/front_post", {
            isAuth: req.isAuthenticated(),
            subscribed: subscribed,
            karma: karma
        });
    })
}

exports.front_post_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']

        }

        res.render("./front/front_post", {
            isAuth: req.isAuthenticated(),
            subscribed: subscribed,
            karma: karma
        });
    })
}
exports.front_link_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }

        res.render("./front/front_link", {
            isAuth: req.isAuthenticated(),
            karma: karma,
            subscribed: subscribed
        });
    })
}
exports.subreddit_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }

        res.render("./front/front_subreddit", {
            isAuth: req.isAuthenticated(),
            karma: karma,
            subscribed: result[0]['subscribed']
        });
    })
}