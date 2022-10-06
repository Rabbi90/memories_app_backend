const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const postsRouter = require('./routes/postRoutes')
const authRouter = require('./routes/authRoutes')
const app = express()
require('./config/db')


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('images'))

app.use(cors({
    origin: "https://memories-app0.netlify.app",
}))

app.use('/api/', postsRouter)
app.use('/auth/', authRouter)

app.use((req, res, next) => {
    res.status(500).json({
        message: "Invalid Url !!"
    })
    next()
})

app.use((err, req, res, next) => {
    res.status(500).json({
        message: "Something is Wrong !!"
    })
    next()
})

module.exports = app