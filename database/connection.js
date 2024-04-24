const mongoose = require('mongoose')
const { config } = require('dotenv')

config()
mongoose.set('strictQuery', true)

const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Te has conectado de manera satisfactoria a la DB')
    } catch (error) {
        console.log('No se pudo conectar a la DB')
    }
}

module.exports = connection