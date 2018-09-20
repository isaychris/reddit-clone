const mongoose = require('mongoose');

const postStateSchema = new mongoose.Schema({
    username: String,
    ref: mongoose.Schema.Types.ObjectId,
    vote: {
        type: String,
        default: "neutral"
    },
    saved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('PostState', postStateSchema, "postStates");