const jwt = require('jsonwebtoken')
require('dotenv').config()

const Auth = (req, res, next) => {
    try {
        const token = req.headers.authorization
        const isOurToken = token.length < 500

        if (token && isOurToken) {
            const { id } = jwt.verify(token, process.env.SECRET)
            req.userId = id
        } else {
            const { sub } = jwt.decode(token)
            req.userId = sub
        }

        return next()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = Auth