const bcrypt = require('bcrypt')
const authSchema = require('../model/auth.model')
const validator = require("email-validator");
const jwt = require('jsonwebtoken')
require('dotenv').config()


const login = async(req, res) => {
    const { email, password } = req.body
    try {
        if (!password || !email) {
            return res.status(400).json({ error: 'Field Cannot Be Empty!!' })
        }
        if (!validator.validate(email)) {
            return res.status(400).json({ error: 'Enter Valid Email!!' })
        }

        const userExist = await authSchema.findOne({ email: email })
        if (!userExist) {
            return res.status(400).json({ error: 'No User Found, Please Signup!!' })
        }

        const passMatch = await bcrypt.compare(password, userExist.password)
        if (!passMatch) {
            return res.status(400).json({ error: 'Password Didnt Match!!' })
        }

        const token = jwt.sign({ id: userExist._id }, process.env.SECRET, { expiresIn: '1d' })

        return res.status(200).json({
            token: token,
            profile: {
                id: userExist._id,
                firstname: userExist.firstname,
                lastname: userExist.lastname,
                email: userExist.email,
                name: userExist.firstname + ' ' + userExist.lastname
            }
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


const register = async(req, res) => {
    const { firstname, lastname, email, password, cpassword } = req.body
    try {
        if (!firstname || !lastname || !password || !cpassword || !email) {
            return res.status(400).json({ error: 'Field Cannot Be Empty!!' })
        }
        if (!validator.validate(email)) {
            return res.status(400).json({ error: 'Enter Valid Email!!' })
        }
        if (password !== cpassword) {
            return res.status(400).json({ error: 'Password Didnt Match!!' })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Minimum Password Length is 6!!' })
        }

        const userExist = await authSchema.findOne({ email: email })
        if (userExist) {
            return res.status(400).json({ error: 'User Already Exist, Please Login!!' })
        }

        const hash = await bcrypt.hash(password, 10)
        const newUser = new authSchema({ firstname, lastname, email, password: hash })
        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET, { expiresIn: '1d' })

        return res.status(201).json({
            token: token,
            profile: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                name: newUser.firstname + ' ' + newUser.lastname
            }
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


module.exports = { login, register }