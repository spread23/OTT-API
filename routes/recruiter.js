const express = require('express')

const RecruiterController = require('../controllers/recruiter')

const router = express.Router()

router.get('/test', RecruiterController.test)
router.post('/register', RecruiterController.register)
router.post('/login', RecruiterController.login)

module.exports = router