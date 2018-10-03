const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let Account = require("../models/account")

exports.posts = function (req, res) {
    let subscribed = undefined;
    let posts = undefined;
    let created = undefined;
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
        username: req.params.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    })

    Account.find({
        username: req.params.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            var d = new Date(result[0]['created'])
            created = d.toLocaleDateString().replace(/\//g, '-')
        } else {
            res.render("./error")
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
                .sort(sort).exec(function (err, result) {
                    if (err) throw err;

                    if (result.length) {
                        posts = result
                    }
                    console.log(`[Profile] fetching posts from ${req.params.user} !`)
                    res.render("./profile/profile_posts", {
                        profile_user: req.params.user,
                        posts: posts,
                        karma: karma,
                        subscribed: subscribed,
                        created: created,
                        isAuth: req.isAuthenticated()
                    })
                })
        })
    })
}

exports.comments = function (req, res) {
    let subscribed = undefined;
    let comments = undefined;
    let created = undefined;
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
        username: req.params.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    })

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
                    $sort: sort
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
                    karma: karma,
                    created: created,
                    subscribed: subscribed,
                    isAuth: req.isAuthenticated()
                })
            });
        });
    });
}

exports.saved_posts = function (req, res) {
    let created = undefined
    let subscribed = undefined
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
        username: req.params.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    })

    Account.find({
        username: req.params.user
    }).exec().then((result) => {
        created = new Date(result[0]['created']).toLocaleDateString().replace(/\//g, '-')

        return Profile.find({
            username: req.params.user
        })
    }).then((result) => {
        console.log(result)
        return Post.find({
            _id: {
                $in: result[0].saved_posts
            }
        }).sort(sort)
    }).then((result) => {
        res.render("./profile/profile_saved_posts", {
            profile_user: req.params.user,
            posts: result,
            karma: karma,
            created: created,
            subscribed: subscribed,
            isAuth: req.isAuthenticated()
        })
    }).catch((err) => {
        console.log(err)
    })
}

exports.saved_comments = function (req, res) {
    let created = undefined
    let subscribed = undefined
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
        username: req.params.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    })

    Account.find({
        username: req.params.user
    }).exec().then((result) => {
        created = new Date(result[0]['created']).toLocaleDateString().replace(/\//g, '-')

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
                $sort: sort
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
            karma: karma,
            created: created,
            subscribed: subscribed,
            isAuth: req.isAuthenticated()
        })
    }).catch((err) => {
        console.log(err)
    })

}