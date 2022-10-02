const mongoose = require('mongoose')

const postModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true,
    },
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: Array,
        default: []
    },
    createdOn: {
        type: Date,
        default: new Date().toISOString()
    },
    imageFile: {
        type: String,
        required: true
    }
})

const postSchema = mongoose.model('posts', postModel)
module.exports = postSchema