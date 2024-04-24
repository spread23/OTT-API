const { Schema, model } = require('mongoose')

const EmployeeSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'image.png'
    },
    role: {
        type: String,
        default: 'employee'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('Employee', EmployeeSchema, 'employees')