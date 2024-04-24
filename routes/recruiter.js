const express = require('express')

const RecruiterController = require('../controllers/recruiter')
const check = require('../middlewares/authRecruiter')
const uploads = require('../middlewares/uploadRecruiter')

const router = express.Router()

router.get('/test', check.auth, RecruiterController.test)
router.post('/register', RecruiterController.register)
router.post('/login', RecruiterController.login)
router.get('/profile', check.auth, RecruiterController.profile)
router.post('/upload', [check.auth, uploads.single('file0')], RecruiterController.upload)
router.get('/getAvatar/:file', RecruiterController.getAvatar)

module.exports = router