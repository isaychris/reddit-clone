const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

mongoose.Promise = global.Promise;
let Account = require("../models/account");

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let PostState = require("../models/postState")
let CommentState = require("../models/commentState")

router.get('/:user', function (req, res) {
    res.redirect(`/u/${req.params.user}/posts`);

});

router.get('/:user/posts', function (req, res) {
    let subscribed = undefined;
    let posts = undefined;
    let created = undefined;

    Account.find({
        username: req.params.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            var d = new Date(result[0]['created'])
            created = d.toLocaleDateString().replace(/\//g, '-')
        }
    }).then(function () {
        Profile.find({
            username: req.params.user
        }, function (err, result) {
            if (err) throw err;

            if (result.length) {
                subscribed = result[0]['subscribed'];
            }
        }).then(function () {
            Post.find({
                    username: req.params.user
                })
                .sort({
                    votes: '-1'
                }).exec(function (err, result) {
                    if (err) throw err;

                    if (result.length) {
                        posts = result

                        console.log(`[Profile] fetching posts from ${req.params.user} !`)
                        res.render("./profile/profile_posts", {
                            profile_user: req.params.user,
                            posts: posts,
                            subscribed: subscribed,
                            created: created,
                            isAuth: req.isAuthenticated()
                        })
                    }
                })
        })
    })
})

router.get('/:user/comments', function (req, res) {
    let subscribed = undefined;
    let comments = undefined;
    let created = undefined;

    Account.find({
        username: req.params.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            var d = new Date(result[0]['created'])
            created = d.toLocaleDateString().replace(/\//g, '-')
        }
    }).then(function () {
        Profile.find({
            username: req.params.user
        }, function (err, result) {
            if (err) throw err;

            if (result.length) {
                subscribed = result[0]['subscribed'];
            }
        }).then(function () {
            Comment.aggregate([{
                    $match: {
                        username: req.params.user
                    }
                },
                {
                    $sort: {
                        votes: -1
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "ref", // field in the orders collection
                        foreignField: "_id", // field in the items collection
                        as: "parent"
                    }
                }
            ]).exec(function (err, result) {
                if (err) throw err;

                if (result.length) {
                    comments = result
                }
                console.log(`[Profile] fetching comments from ${req.params.user} !`)
                res.render("./profile/profile_comments", {
                    profile_user: req.params.user,
                    comments: comments,
                    created: created,
                    subscribed: subscribed,
                    isAuth: req.isAuthenticated()
                })
            });
        });
    });
})

router.get('/:user/saved', function (req, res) {
    res.redirect(`/u/${req.params.user}/saved/posts`);

})

router.get('/:user/saved/posts', function (req, res) {
    created = undefined
    subscribed = undefined

    Account.find({
        username: req.params.user
    }).exec().then((result) => {
        created = new Date(result[0]['created']).toLocaleDateString().replace(/\//g, '-')
        subscribed = result[0]['subscribed']

        return Profile.find({
            username: req.params.user
        })
    }).then((result) => {
        console.log(result)
        return Post.find({
            _id: {
                $in: result[0].saved_posts
            }
        }).sort({
            votes: '-1'
        })
    }).then((result) => {
        res.render("./profile/profile_saved_posts", {
            profile_user: req.params.user,
            posts: result,
            created: created,
            subscribed: subscribed,
            isAuth: req.isAuthenticated()
        })
    }).catch((err) => {
        console.log(err)
    })
})


router.get('/:user/saved/comments', function (req, res) {
    created = undefined
    subscribed = undefined

    Account.find({
        username: req.params.user
    }).exec().then((result) => {
        created = new Date(result[0]['created']).toLocaleDateString().replace(/\//g, '-')
        subscribed = result[0]['subscribed']

        return Profile.find({
            username: req.params.user
        })
    }).then((result) => {
        let casted_saved_comments = result[0].saved_comments.map(function (el) {
            return mongoose.Types.ObjectId(el)
        })
        return Comment.aggregate([{
                $match: {
                    _id: {
                        $in: casted_saved_comments
                    }
                }
            },
            {
                $sort: {
                    votes: -1
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "ref", // field in the orders collection
                    foreignField: "_id", // field in the items collection
                    as: "parent"
                }
            }
        ])
    }).then((result) => {
        res.render("./profile/profile_saved_comments", {
            profile_user: req.params.user,
            comments: result,
            created: created,
            subscribed: subscribed,
            isAuth: req.isAuthenticated()
        })
    }).catch((err) => {
        console.log(err)
    })

})

module.exports = router