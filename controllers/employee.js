const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

const validate = require('../helpers/validate')
const Employee = require('../models/employee')
const { createToken } = require('../services/jwt')

const test = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Endpoint de prueba de employee'
    })
}

const register = async (req, res) => {
    const params = req.body

    if (!params.name || !params.lastname || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {
        validate(params)
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }

    try {
        const employeeFound = await Employee.find({
            $or: [
                { email: params.email },
                { nick: params.nick }
            ]
        })

        if (employeeFound && employeeFound.length >= 1) {
            return res.status(400).json({
                status: 'error',
                message: 'El employee ya existe'
            })
        }

        const pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd

        const employeeToSave = new Employee(params)
        const employeeStored = await employeeToSave.save()

        return res.status(201).json({
            status: 'success',
            message: 'Employee registrado correctamente',
            employee: employeeStored
        })

    } catch (error) {
        return res.status(501).json({
            status: 'error',
            message: error.message
        })
    }
}

const login = async (req, res) => {
    const params = req.body

    if (!params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan parametros'
        })
    }

    try {

        const employeeFound = await Employee.findOne({
            email: params.email
        })

        if (!employeeFound) {
            return res.status(404).json({
                status: 'error',
                message: 'El email es incorrecto'
            })
        }

        const pwd = bcrypt.compareSync(params.password, employeeFound.password)

        if (!pwd) {
            return res.status(404).json({
                status: 'error',
                message: 'Los passwords no coinciden'
            })
        }

        const token = createToken(employeeFound)

        return res.status(200).json({
            status: 'success',
            message: 'Employee logeado correctamente',
            employee: employeeFound,
            token
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error en la consulta de email y password'
        })
    }
}

const profile = async (req, res) => {
    const id = req.employee.id

    try {
        const employeeFound = await Employee.findById({
            _id: id
        })

        if (!employeeFound) {
            return res.status(404).json({
                status: 'error',
                message: 'El id no coincide con ningun employee'
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Perfil de employee',
            employee: employeeFound
        })

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'El id es incorrecto'
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

    if (extension != 'png' && extension != 'jpg' &&
        extension != 'jpeg' && extension != 'gif') {
        const filePath = req.file.path

        fs.unlinkSync(filePath)

        return res.status(500).json({
            status: 'error',
            message: 'La extension del archivo no es valida'
        })
    }

    try {

        const employeeUpdated = await Employee.findByIdAndUpdate({
            _id: req.employee.id
        }, {
            image: req.file.filename
        }, { new: true })

        if (!employeeUpdated) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encuentra el employee'
            })
        }

        return res.status(201).json({
            status: 'success',
            message: 'Upload de avatar correcto',
            employee: employeeUpdated
        })

    } catch (error) {
        return res.status(501).json({
            status: 'error',
            message: 'Error al actualizar employee'
        })
    }
}

const getAvatar = (req, res) => {
    const file = req.params.file
    const filePath = './uploads/avatars/employees/' + file

    fs.stat(filePath, (error, exists) => {
        if (error || !exists) {
            return res.status(404).json({
                status: 'error',
                message: 'El archivo no existe en el server'
            })
        }

        return res.status(200).sendFile(path.resolve(filePath))
    })
}

module.exports = {
    test,
    register,
    login,
    upload,
    getAvatar,
    profile
}