const bcrypt = require('bcrypt')

const Recruiter = require('../models/recruiter')
const validate = require('../helpers/validate')

const test = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de prueba de recruiter'
    })
}

const register = async (req, res) => {
    const params = req.body

    if (!params.name || !params.lastname ||
        !params.nick || !params.email || !params.password) {
        return res.status(404).json({
            status: 'error',
            message: 'faltan parametros'
        })
    }

    try {
        validate(params)
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error en la validacion'
        })
    }

    try {
        const recruiterFound = await Recruiter.find({
            $or: [
                { email: params.email },
                { nick: params.nick }
            ]
        })

        if (recruiterFound && recruiterFound.length >= 1) {
            return res.status(200).json({
                status: 'error',
                message: 'El recruiter ya existe'
            })
        }

        const pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd

        const recruiterToSave = new Recruiter(params)
        const recruiterStorage = await recruiterToSave.save()

        return res.status(201).json({
            status: 'success',
            message: 'Recruiter registrado',
            recruiter: recruiterStorage
        })

    } catch (error) {
        return res.status(501).json({
            status: 'error',
            message: 'Error en la busqueda de recruiters',
            error: error.message
        })
    }
}

const login = async (req, res) => {
    const params = req.body

    if (!params.email || !params.password) {
        return res.status(404).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {
        const recruiterFound = await Recruiter.findOne({
            email: params.email
        })

        if (!recruiterFound) {
            return res.status(400).json({
                status: 'error',
                message: 'Email incorrecto'
            })
        }

        const pwd = bcrypt.compareSync(params.password, recruiterFound.password)
        if (!pwd) {
            return res.status(400).json({
                status: 'error',
                message: 'Las contraseñas no coinciden'
            })
        }

        const token = null

        return res.status(200).json({
            status: 'success',
            message: 'Recruiter logeado',
            recruiter: recruiterFound,
            token
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error en la busqueda del recruiter'
        })
    }
}

module.exports = {
    test,
    register,
    login
}