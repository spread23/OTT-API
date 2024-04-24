const jwt = require('jwt-simple')
const moment = require('moment')
const { config } = require('dotenv')

const secret_key = process.env.SECRET_KEY

const createToken = (recruiter) => {
    const payload = {
        id: recruiter._id,
        name: recruiter.name,
        lastname: recruiter.lastname,
        nick: recruiter.nick,
        email: recruiter.email,
        role: recruiter.role,
        image: recruiter.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret_key)
}

module.exports = {
    createToken,
    secret_key
}