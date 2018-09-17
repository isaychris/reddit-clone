const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    username: String,
    post_states: [{
        ref: mongoose.Schema.Types.ObjectId,
        vote: {
            type: String,
            default: "neutral"
        },
        saved: Boolean
    }],
    comment_states: [{
        ref: mongoose.Schema.Types.ObjectId,
        vote: {
            type: String,
            default: "neutral"
        },
        saved: Boolean
    }]
});

module.exports = mongoose.model('State', stateSchema);