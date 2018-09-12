const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    username: String,
    karma_post: Number,
    karma_comment: Number,
    saved: Object,
    subscribed: Object,
    owned: Object
});

module.exports = mongoose.model('Info', infoSchema);