const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: String,
    karma_post: {
        type: Number,
        default: 0
    },
    karma_comment: {
        type: Number,
        default: 0
    },
    saved_posts: Array,
    saved_comments: Array,
    subscribed: Array,
    owned: Array
});

module.exports = mongoose.model('Profile', profileSchema);