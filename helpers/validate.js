const validator = require('validator')

const validate = (params) => {
    let result = false
    let name = !validator.isEmpty(params.name) &&
                validator.isLength(params.name, {min: 4, max: undefined}) &&
                validator.isAlpha(params.name, 'es-ES')
            
    let email = !validator.isEmpty(params.email) &&
                validator.isEmail(params.email)

    let password = !validator.isEmpty(params.password) &&
                    validator.isLength(params.password, {min: 8, max: 20})
            
    let nick = !validator.isEmpty(params.nick) && 
                validator.isLength(params.nick, {min: 4, max: 20})
    
    if (!name || !email || !password || !nick) {
        throw new Error('No se ha superado la validacion de parametros')
    }

    return result   
}

module.exports = validate