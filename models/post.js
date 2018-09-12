const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    time: String,
    type: String,
    link: String,
    username: String,
    votes: Number,
    subreddit: String,
});

module.exports = mongoose.model('Post', postSchema);