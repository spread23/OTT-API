const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

const { createToken } = require('../services/jwtRecruiter')
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

        const token = createToken(recruiterFound)

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

const profile = async (req, res) => {
    const id = req.recruiter.id

    try {

        const recruiterFound = await Recruiter.findById({
            _id: id
        })

        if (!recruiterFound) {
            return res.status(404).json({
                status: 'error',
                message: 'No hay ningun recruiter con ese id'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Profile de recruiter',
            recruiter: recruiterFound
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error en la busqueda del recruiter'
        })
    }
}

const upload = async (req, res) => {
    if (!req.file) {
        return res.status(404).json({
            status: 'error',
            message: 'La consulta no contiene archivo'
        })
    }

    const image = req.file.originalname
    const imageSplit = image.split('\.')
    const extension = imageSplit[1]

    if (extension != 'jpg' && extension != 'png' &&
        extension != 'jpeg' && extension != 'gif') {

        const filePath = req.file.path
        fs.unlinkSync(filePath)

        return res.status(400).json({
            status: 'error',
            message: 'La extension no es valida'
        })
    }

    try {
        const recruiterUploaded = await Recruiter.findByIdAndUpdate({
            _id: req.recruiter.id
        }, {
            image: req.file.filename
        }, { new: true })

        return res.status(201).json({
            status: 'success',
            message: 'Upload satisfactorio',
            recruiter: recruiterUploaded
        })

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error al actualizar recruiter'
        })
    }
}

const getAvatar = (req, res) => {
    const file = req.params.file
    const filePath = './uploads/avatars/recruiters/' + file

    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(400).json({
                status: 'error',
                message: 'El archivo no existe'
            })
        }

        return res.status(200).sendFile(path.resolve(filePath))
    })
}



module.exports = {
    test,
    register,
    login,
    profile,
    upload,
    getAvatar
}