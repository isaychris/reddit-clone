const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    time: {
        type: Date,
        default: Date.now()
    },
    type: String,
    link: String,
    username: String,
    votes: {
        type: Number,
        default: 0
    },
    subreddit: String,
});

module.exports = mongoose.model('Post', postSchema);