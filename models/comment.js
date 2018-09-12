const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: String,
    time: String,
    username: String,
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    karma: Number
});

module.exports = mongoose.model('Comment', commentSchema);