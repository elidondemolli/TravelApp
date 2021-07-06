const express = require('express')
const DB = require('./config/db')
const PinRoute = require('./routes/pin-route')
const UserRoute = require('./routes/user-route') 
const app = express()

DB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('working')
})

app.listen(8000, () => {
    console.log('Backend server is running')
})

app.use('/api/user', UserRoute)
app.use('/api/pin', PinRoute)

