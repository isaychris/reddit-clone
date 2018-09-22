const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

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
        }, function (err, result) {
            if (err) throw err;

            if (result.length) {
                posts = result
            }

            console.log(`[Profile] fetching posts from ${req.params.user} !`)
            res.render("./profile/profile_posts", {
                profile_user: req.params.user,
                posts: posts,
                subscribed: subscribed,
                isAuth: req.isAuthenticated()
            })
        });
    });
})

router.get('/:user/comments', function (req, res) {
    let subscribed = undefined;
    let comments = undefined;

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
                subscribed: subscribed,
                isAuth: req.isAuthenticated()
            })
        });
    });
});

router.get('/:user/saved', function (req, res) {});



module.exports = router