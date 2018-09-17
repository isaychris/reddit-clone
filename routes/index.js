const express = require("express");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let State = require("../models/state");


// EDITING POSTS
router.put('/edit/post/:id', function (req, res) {
    Post.update({
        _id: req.params.id
    }, {
        body: req.body.text
    }, function (err, result) {
        if (err) throw err;

        console.log(`[${req.params.id}] post edited!`)
        res.send("success")
    })
});

// EDITING COMMENTS
router.put('/edit/comment/:id', function (req, res) {
    Comment.update({
        _id: req.params.id
    }, {
        body: req.body.text
    }, function (err, result) {
        if (err) throw err;

        console.log(`[${req.params.id}] comment edited!`)
        res.send("success")
    })
});

// DELETING POST
router.delete('/delete/post/:id', function (req, res) {
    Post.find({
            _id: req.params.id
        })
        .remove(function (err, doc) {
            if (err) throw err;

            console.log(`[${req.params.id}] post deleted!`)
            res.send(doc);
        });
});


// SAVING POST
router.put('/save/post/:id', function (req, res) {
    let update = {
        saved: true
    };
    let options = {
        upsert: true
    };
    let query = {
        $and: [{
                username: req.session.auth
            },
            {
                post_states: {
                    ref: body.params.id
                }
            }
        ]
    };

    State.findOneAndUpdate(query, update, options, function (err, result) {
            if (!error) {
                // If the document doesn't exist
                if (!result) {
                    // Create it
                    result = new State();
                }
                // Save the document
                result.save(function (error) {
                    if (!error) {
                        // Do something with the document
                    } else {
                        throw error;
                    }
                });
            }
        })
        .then(function () {
            Profile.update({
                username: req.session.user
            }, {
                $push: {
                    saved_posts: req.params.id
                }
            }, function (err, doc) {
                if (err) throw err;

                console.log(`[${req.params.id}] post saved!`)
                res.send(doc);
            });
        });
});

// UNSAVING POST
router.put('/unsave/post/:id', function (req, res) {
    console.log("attempting to save");
    Profile.update({
        username: req.session.user
    }, {
        $pull: {
            saved_posts: req.params.id
        }
    }, function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.id}] post unsaved!`)
        res.send(doc);
    });
});

// VOTING POST
router.put('/vote/post/:id', function (req, res) {
    Post.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;

        console.log(`[${req.params.id}] post voted!`)
        res.send(result);
    })
});



// DELETING COMMENT
router.delete('/delete/comment/:id', function (req, res) {
    Comment.find({
            _id: req.params.id
        })
        .remove(function (err, doc) {
            if (err) throw err;

            console.log(`[${req.params.id}] comment deleted!`)
            res.send(doc);
        });
});


// SAVING COMMENT
router.put('/save/comment/:id', function (req, res) {
    Profile.update({
        username: req.session.user
    }, {
        $push: {
            saved_comments: req.params.id
        }
    }, function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.id}] comment saved!`)
        res.send(doc);
    });
});

// UNSAVING COMMENT
router.put('/unsave/comment/:id', function (req, res) {
    Profile.update({
        username: req.session.user
    }, {
        $pull: {
            saved_comments: req.params.id
        }
    }, function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.id}] comment unsaved!`)
        res.send(doc);
    });
});

// VOTING ON COMMENT
router.put('/vote/comment/:id', function (req, res) {
    Comment.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;

        console.log(`[${req.params.id}] comment voted!`)
    });
});

// CHECKING SUBREDDIT
router.get('/submit/check/:subreddit', function (req, res) {
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
});

// SUBSCRIBING TO SUBREDDIT
router.put('/subscribe/:subreddit', function (req, res) {
    Profile.update({
        username: req.session.user
    }, {
        $push: {
            subscribed: req.params.subreddit
        }
    }, function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.subeddit}] subscription added!`)
        res.send("success!")
    })
});

// UNSUBSCRIBE FROM SUBREDDIT
router.put('/unsubscribe/:subreddit', function (req, res) {
    Profile.update({
        username: req.session.user
    }, {
        $pull: {
            subscribed: req.body.subreddit
        }
    }, function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.subeddit}] subscription removed!`)
        res.send("success!")
    })
});

module.exports = router;