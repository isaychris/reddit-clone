const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: String,
    time: {
        type: Date,
        default: Date.now()
    },
    username: String,
    ref: mongoose.Schema.Types.ObjectId,
    votes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Comment', commentSchema);