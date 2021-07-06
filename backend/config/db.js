const mongoose = require('mongoose')
require('dotenv').config()

module.exports = connection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false 
        })

        console.log('MongoDB connected...')
    } catch (error) {
        throw error
    }
}
