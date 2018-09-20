const mongoose = require('mongoose');

const subredditStateSchema = new mongoose.Schema({
    username: String,
    ref: mongoose.Schema.Types.ObjectId,
    subbed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('SubredditState', subredditStateSchema);