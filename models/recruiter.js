const { Schema, model } = require('mongoose')

const RecruiterSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    company: {
        type: String,
        default: 'Company'
    },
    companyDescription: {
        type: String,
        default: 'Description'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'recruiter'
    },
    image: {
        type: String,
        default: 'image.png'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('Recruiter', RecruiterSchema, 'recruiters')