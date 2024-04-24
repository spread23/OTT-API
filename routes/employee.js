const express = require('express')

const EmployeeController = require('../controllers/employee')
const check = require('../middlewares/auth')
const uploads = require('../middlewares/upload')

const router = express.Router()

router.get('/test', check.auth, EmployeeController.test)
router.post('/register', EmployeeController.register)
router.post('/login', EmployeeController.login)
router.get('/profile', check.auth, EmployeeController.profile)
router.post('/upload', [check.auth, uploads.single('file0')], EmployeeController.upload)
router.get('/getAvatar/:file', EmployeeController.getAvatar)

module.exports = router