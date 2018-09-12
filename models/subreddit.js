const mongoose = require('mongoose');

const subredditSchema = new mongoose.Schema({
    name: String,
    owner: String,
    members: Object
});

module.exports = mongoose.model('Subreddit', subredditSchema);