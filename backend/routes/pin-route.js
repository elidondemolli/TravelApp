const express = require('express')
const router = express.Router()
const Pin = require('../models/Pin')

router.post('/', async (req, res) => {
    try {
        const pin = new Pin(req.body)
        await pin.save()
        res.status(200).json( pin )
    } catch (error) {
        res.status(500).json('ERROR')
        throw error
    }
})

router.get('/', async (req, res) => {
    try {
        const result = await Pin.find()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json('ERROR')
    }
})

module.exports = router