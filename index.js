const express = require('express')
const cors = require('cors')
const { config } = require('dotenv')

const connection = require('./database/connection')
const EmployeeRouter = require('./routes/employee')
const RecruiterRouter = require('./routes/recruiter')

const app = express()
const port = process.env.PORT || 3900

config()

connection()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    return res.status(200).send({
        status: 'success',
        message: 'Endpoint de prueba'
    })
})

app.use('/api/employee', EmployeeRouter)
app.use('/api/recruiter', RecruiterRouter)

app.listen(port, () => {
    console.log('El server esta escuchando en el puerto ', port)
})