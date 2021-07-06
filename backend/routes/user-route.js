const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/User')

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        await newUser.save()
        res.status(200).json({ message: newUser })
    } catch (error) {
        res.status(401).json({ message: 'Username or Email exists'})
        throw error
    }
})

router.get('/', async (req, res) => {
    try {
        const result = await User.find()
        res.status(200).json({ message: result })
    } catch (error) {
        res.status(500).json({ message: 'wrong'})
        throw error
    }
})

router.post('/login', async (req, res) => {
    try {
        const result = await User.findOne({ username: req.body.username})

        if(!result){
            return res.status(500).json({ message: "Wrong username"})
        }

        const comparePassword = await bcrypt.compare(req.body.password, result.password)

        if(!comparePassword){
            return res.status(500).json({ message: "Wrong password"})
        }

        return res.status(200).json({ message: 'SUCCESS', result: result.username})
    } catch (error) {
        return res.status(500).json({ message: 'wrong'})
    }
})

module.exports = router