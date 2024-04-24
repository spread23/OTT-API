const { Schema, model } = require('mongoose')

const EmployeeSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Country'
    },
    city: {
        type: String,
        default: 'City'
    },
    talents: {
        type: String,
        default: 'Talents'
    },
    jobType: {
        type: String,
        default: 'Remoto'
    },
    email: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        default: 'Experience'
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