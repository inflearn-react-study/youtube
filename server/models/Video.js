const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const videoSchema = mongoose.Schema({

    writer: {
        type: Schema.Types.Object,
        ref: 'User',
    },
    title: {
        type: String,
        maxLength: 50,
    },
    description: {
        type: String
    },
    privacy: {
        type: String
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0,
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    },
}, {timestamps: true})

const Video = mongoose.model('Video', videoSchema)

module.exports = { Video }