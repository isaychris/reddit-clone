const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

let Subreddit = require("../models/subreddit");
let Post = require("../models/post");
let Comment = require("../models/comment");
let Profile = require("../models/profile");
let PostState = require("../models/postState")
let CommentState = require("../models/commentState")

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
    let query = {
        username: req.session.user,
        ref: req.params.id
    };
    let update = {
        saved: true
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    PostState.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) throw error;
        res.send('nice')
    })
})

// UNSAVING POST
router.put('/unsave/post/:id', function (req, res) {
    let query = {
        username: req.session.user,
        ref: req.params.id
    };
    let update = {
        saved: false
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    PostState.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) throw error;
        res.send('nice')
    })
});

// VOTING POST
router.put('/vote/post/:id', function (req, res) {
    let query = {
        username: req.session.user,
        ref: req.params.id
    };
    let update = {
        vote: req.body.state
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    Post.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.params.id}] post vote count changed!`)
        }
    }).then(function () {
        PostState.findOneAndUpdate(query, update, options, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.params.id}] post vote count changed!`)
                res.send("OK")
            }
        })
    })
})


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
    let query = {
        username: req.session.user,
        ref: mongoose.Types.ObjectId(req.params.id)
    };
    let update = {
        saved: true
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    CommentState.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) throw error;
        res.send('nice')
    })
});

// UNSAVING COMMENT
router.put('/unsave/comment/:id', function (req, res) {
    let query = {
        username: req.session.user,
        ref: mongoose.Types.ObjectId(req.params.id)
    };
    let update = {
        saved: false
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };


    Comment.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.params.id}] comment vote count changed!`)
        }
    }).then(function () {
        CommentState.findOneAndUpdate(query, update, options, function (error, result) {
            if (error) throw error;
            res.send('nice')
        })
    })
});

// VOTING ON COMMENT
router.put('/vote/comment/:id', function (req, res) {
    let query = {
        username: req.session.user,
        ref: req.params.id
    };
    let update = {
        vote: req.body.state
    };
    let options = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    Comment.update({
        _id: req.params.id
    }, {
        votes: req.body.vote
    }, function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.params.id}] comment vote count changed!`)
        }
    }).then(function () {
        CommentState.findOneAndUpdate(query, update, options, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.params.id}] comment vote count changed!`)
                res.send("OK")
            }
        })
    })
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

        console.log(`[${req.params.subreddit}] subscription added!`)
        res.send('success!')
    })
});

// UNSUBSCRIBE FROM SUBREDDIT
router.put('/unsubscribe/:subreddit', function (req, res) {
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
});

router.get('/check/states/posts', function (req, res) {
    PostState.find({
        username: req.session.user
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            res.send(doc)
        }
    })
})

router.get('/check/states/comments', function (req, res) {
    CommentState.find({
        username: req.session.user
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            res.send(doc)
        }
    })
})
module.exports = router;