require('dotenv').config()

const dev = {
    app: {
        PORT: process.env.port || 5000
    },
    db: {
        URL: process.env.DB || 'mongodb://localhost:27017'
    }
}

module.exports = dev