const mongoose = require('mongoose')

const authModal = new mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})

const authSchema = mongoose.model('auth', authModal)
module.exports = authSchema