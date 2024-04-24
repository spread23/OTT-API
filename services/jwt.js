const jwt = require('jwt-simple')
const moment = require('moment')
const { config } = require('dotenv')

const secret_key = process.env.SECRET_KEY

const createToken = (employee) => {
    const payload = {
        id: employee._id,
        name: employee.name,
        nick: employee.nick,
        email: employee.email,
        image: employee.image,
        role: employee.role,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret_key)
}

module.exports = {
    createToken,
    secret_key
}