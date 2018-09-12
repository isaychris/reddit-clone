const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: String,
    time: String,
    username: String,
    parent: mongoose.Schema.Types.ObjectId,
    votes: Number
});

module.exports = mongoose.model('Comment', commentSchema);