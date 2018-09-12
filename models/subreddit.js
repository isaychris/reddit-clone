const mongoose = require('mongoose');

const subredditSchema = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Subreddit', subredditSchema);