const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let PostState = require("../models/postState")
let CommentState = require("../models/commentState")

// SUBREDDIT
router.get('/:subreddit/:id', function (req, res) {
    res.redirect(`/r/${req.params.subreddit}/${req.params.id}/comments`)
});

// FETCHING POSTS
router.get('/:subreddit', function (req, res) {
    let subreddit = undefined;
    let posts = undefined;

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            subreddit = doc[0]
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
            Post.aggregate([{
                    $match: {
                        subreddit: req.params.subreddit
                    }
                },
                {
                    $sort: {
                        votes: -1
                    }
                },
                {
                    $lookup: {
                        from: "postStates",
                        localField: "_id", // field in the orders collection
                        foreignField: "ref", // field in the items collection
                        as: "states"
                    }
                }
            ]).exec(function (err, result) {
                if (err) throw err;

                if (result.length) {
                    posts = result
                }

                console.log(`[${req.params.subreddit}] fetching posts!`)
                res.render("./subreddit/subreddit", {
                    info: subreddit,
                    posts: posts,
                    isAuth: req.isAuthenticated()
                })
            });
        });
    });
});


router.get('/:subreddit/:id/comments', function (req, res) {
    console.log("viewing POST")
    let info = undefined
    let post = undefined
    let comments = undefined

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            info = doc[0]
        }
    }).then(function () {
        Post.find({
            _id: req.params.id
        }, function (err, doc) {
            if (err) throw err

            if (doc.length) {
                post = doc[0]
            }
        }).then(function () {
            PostState.find({
                username: req.session.user,
                ref: req.params.id
            }, function (err, doc) {
                if (err) throw err;

                if (doc.length) {
                    postStates = doc[0]
                }
            }).then(function () {
                Comment.aggregate([{
                        $match: {
                            ref: mongoose.Types.ObjectId(req.params.id)
                        }
                    },
                    {
                        $lookup: {
                            from: "commentStates",
                            localField: "_id", // field in the orders collection
                            foreignField: "ref", // field in the items collection
                            as: "states"
                        }
                    }
                ]).exec(function (err, result) {
                    if (err) throw err;

                    if (result.length) {
                        comments = result
                    }

                    console.log(result)
                    res.render('./post', {
                        info: info,
                        post: post,
                        comments: comments,
                        isAuth: req.isAuthenticated()
                    })
                })
            })
        })
    })
})


router.get('/:subreddit/test/:id', function (req, res) {
    Comment.aggregate([{
            $match: {
                ref: req.params.id
            }
        },
        {
            $lookup: {
                from: "commentStates",
                localField: "_id", // field in the orders collection
                foreignField: "ref", // field in the items collection
                as: "states"
            }
        }
    ]).exec(function (err, result) {
        if (err) throw err;

        res.json(result)
    })
})

// SUBMITTING A COMMENT
router.post('/:subreddit/:id/comments', function (req, res) {
    Comment({
        body: req.body.comment,
        username: req.session.user,
        ref: req.params.id,
    }).save(function (err, doc) {
        if (err) throw err

        console.log(`[${req.params.subreddit}] comment posted!`)
        res.redirect(`/r/${req.params.subreddit}/${req.params.id}/comments`)
    })
})

router.get('/:subreddit/submit/post', function (req, res) {
    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            res.render('./subreddit/subreddit_post', {
                info: doc[0],
                isAuth: req.isAuthenticated(),
            })
        }
    })
})

router.post('/:subreddit/submit/post', function (req, res) {
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
})


router.get('/:subreddit/submit/link', function (req, res) {
    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            res.render('./subreddit/subreddit_link', {
                info: doc[0],
                isAuth: req.isAuthenticated(),
            })
        }
    })
})

router.post('/:subreddit/submit/link', function (req, res) {
    let type = "link"

    function checkURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    if (checkURL(req.body.link)) {
        console.log("its an image")
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
})

// SEARCHING FOR A POST
router.post('/:subreddit/search', function (req, res) {
    let subreddit = undefined
    let posts = undefined

    Subreddit.find({
        name: req.params.subreddit
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            subreddit = doc[0]
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
                query: req.body.query,
                isAuth: req.isAuthenticated(),
            })
        })
    })
})

module.exports = router